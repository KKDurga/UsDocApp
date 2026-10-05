"use strict";
eHnoteWebApp.controller("USCoordinatorParentCtrl", ["$scope", "$rootScope", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteSurgeryService", "eHnoteCacheStorageService", "eHnoteAuditServices", "$uibModal", "eHnoteMainAppointmentService", "eHnoteSettingsDataService", "eHnotePatientDataService", "datapersistanceFactory", "eHnoteReferalDataService", "eHnoteLoginStatusService", "USPrintService", "$location", "eHnotePatientAddressDataServices", "eHnotePatientVisitReasonServices",
    function ($scope, $rootScope, $filter, alertify, eHnoteMasterDataService, eHnoteSurgeryService, eHnoteCacheStorageService, eHnoteAuditServices, $uibModal, eHnoteMainAppointmentService, eHnoteSettingsDataService, eHnotePatientDataService, datapersistanceFactory, eHnoteReferalDataService, eHnoteLoginStatusService, USPrintService, $location, eHnotePatientAddressDataServices, eHnotePatientVisitReasonServices) {



        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        };

        $scope.AppointmentCheckInDynamicStatus = 0;
        $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData");

        if ($scope.OrganizationSettingsData !== undefined) {
            if ($scope.OrganizationSettingsData.AppointmentSettings !== undefined) {
                if ($scope.OrganizationSettingsData.AppointmentSettings.AppointmentCheckInDynamicStatus === 1) {
                    $scope.AppointmentCheckInDynamicStatus = 1;
                }
                if ($scope.OrganizationSettingsData.PatientRegistration.SelectBarCodeLabelPrint === '2') {
                    $scope.ShowBarCodeprint = true;
                }
                if ($scope.OrganizationSettingsData.PatientRegistration.SelectBarCodeLabelPrint === '3') {
                    $scope.ShowLabelprint = true;
                }
            }
        }

        var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.RoleId = userLoginDetails.RoleID;


        $scope.Coordinatorobj = {
            "Type": "Surgery",
            "EnterBillTemplateName": "",
            "SelectedBillTemplateName": "",
            "BillParticular": "",
            "ClaimActionObj": "",
            "PayorObj": "",
            "PayorObj1": "",
            "AllergyItems": [],
            "SurgeryArray": [],
            "InvestigationsArray": [],
            "ProceduresArray": [],
            "Vitals": [],
            "FinalOrdersList": [],
            "VideoDetails": [],
            "TempImagesArray": [],
            "TempPdfArray": [],
        }

        $scope.GetOrganizationSurgery = function () {
            var newlist = "";
            if ($scope.Coordinatorobj.FinalOrdersList.length > 0) {
                var filtredobj = $filter("filter")($scope.Coordinatorobj.FinalOrdersList, function (item, index) { return item.CoordinatorStatusId != null }) || [];
                if (filtredobj.length > 0) {
                    angular.forEach(filtredobj, function (item) {
                        newlist += "," + item.OrgDescriptionId;
                    });
                    if (newlist.charAt(0) === ",") {
                        newlist = newlist.slice(1);
                    }
                }
            }
            var params = {
                "OrgProcedureIds": newlist || 0,
                "HospitalId": $scope.HospitalId,
                "PageSize": 10,
                "PageNumber": 1
            };

            eHnoteSurgeryService.GetOrganizationSurgeryDocumentMaterial(params).then(function (response) {
                if (response.data.Count !== 0) {
                    if (response.data.rows !== undefined) {
                        $scope.tempmaterialList = response.data.rows;
                        if ($scope.tempmaterialList.length > 0) {
                            $scope.Coordinatorobj.VideoDetails = [];
                            angular.forEach($scope.tempmaterialList, function (Item) {
                                if (Item.VideoDetails.length > 0) {
                                    angular.forEach(Item.VideoDetails, function (Vitem) {
                                        var videoId = '';
                                        var url = Vitem.VideoURL;
                                        videoId = url.split("=")[1];
                                        Vitem.videoId = videoId || null;
                                        Vitem.IsChecked = false;
                                        $scope.Coordinatorobj.VideoDetails.push(Vitem);
                                    });
                                }

                                if (Item.DocumentDetails.length > 0) {
                                    angular.forEach(Item.DocumentDetails, function (kitem) {
                                        if (kitem.DocumentExt === 'image/jpeg' || kitem.DocumentExt === "image/png") {
                                            kitem.file = kitem.S3URL;
                                            kitem.IsChecked = false;
                                            $scope.Coordinatorobj.TempImagesArray.push(kitem);
                                        }
                                        if (kitem.DocumentExt === "application/pdf") {
                                            kitem.file = kitem.S3URL;
                                            kitem.IsChecked = false;
                                            $scope.Coordinatorobj.TempPdfArray.push(kitem);
                                        }
                                    });
                                }


                            });
                        }


                        //if ($scope.tempmaterialList.length > 0) {                          
                        //    angular.forEach($scope.tempmaterialList, function (Item) {                       
                        //        Item.TempImagesArray = [];
                        //        Item.TempPdfArray = [];
                        //        if (Item.VideoDetails.length > 0) {                                
                        //            angular.forEach(Item.VideoDetails, function (Vitem) {
                        //                var videoId = '';
                        //                var url = Vitem.VideoURL;
                        //                videoId = url.split("=")[1];
                        //                Vitem.videoId = videoId || null;

                        //            });
                        //        }
                        //        if (Item.DocumentDetails.length > 0) {
                        //            angular.forEach(Item.DocumentDetails, function (kitem) {
                        //                if (kitem.DocumentExt === 'image/jpeg' || kitem.DocumentExt === "image/png") {
                        //                    kitem.file = kitem.S3URL;
                        //                    Item.TempImagesArray.push(kitem);
                        //                }
                        //                if (kitem.DocumentExt === "application/pdf") {
                        //                    kitem.file = kitem.S3URL;
                        //                    Item.TempPdfArray.push(kitem);
                        //                }
                        //            });
                        //        }
                        //    });

                        //}
                        //else {
                        //    $scope.tempmaterialList = [];
                        //}
                    }
                }
                else {
                    $scope.tempmaterialList = [];
                }
            });
        };

        $scope.GetAdvisedProceduresListByAppointmentId = function () {

            var params = {
                "AppointmentId": $scope.cacheStorageItem.appointmentid || 0,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "HospitalId": $scope.HospitalId,
            };

            eHnoteSurgeryService.GetAdvisedProceduresListByAppointmentId(params).then(function (resp) {
                if (resp.data.Status == "Success") {
                    $scope.Coordinatorobj.AllergyItems = resp.data.AllergyItems || [];
                    $scope.Coordinatorobj.SurgeryArray = resp.data.SurgeryArray || [];
                    $scope.Coordinatorobj.InvestigationsArray = resp.data.InvestigationsArray || [];
                    $scope.Coordinatorobj.ProceduresArray = resp.data.ProceduresArray || [];
                    $scope.Coordinatorobj.Vitals = resp.data.Vitals || [];
                    //$scope.Coordinatorobj.FinalOrdersList = $scope.Coordinatorobj.SurgeryArray.concat(
                    //    $scope.Coordinatorobj.InvestigationsArray,
                    //    $scope.Coordinatorobj.ProceduresArray
                    //);
                    $scope.Coordinatorobj.FinalOrdersList = [];
                    if ($scope.Coordinatorobj.SurgeryArray.length > 0) {
                        angular.forEach($scope.Coordinatorobj.SurgeryArray, function (item) {

                            var obj = {

                                "DiagnosisList": item.DiagnosisList || [],
                                "DescriptionId": item.DescriptionId || null,
                                "Description": item.Description || '',
                                "OrgDescriptionId": item.OrgDescriptionId || '',
                                "DeleteInd": item.DeleteInd || '',
                                "ExternalCoManager": item.ExternalCoManager || '',
                                "InternalCoManager": item.InternalCoManager || '',
                                "OrderType": item.OrderType || '',
                                "OrderTypeId": item.OrderTypeId || '',
                                "OrganId": item.OrganId || '',
                                "ProcedureCode": item.ProcedureCode || '',
                                "CoordinatorStatusId": null,
                                "CoordinatorStatus": "",
                                "PatientDescriptionId": item.PatientSurgeryId || null,
                                "PlanofDiscussionsNotes": "",
                                "DoctorNotes": "",
                                "DoctorId": null,
                                "NurseId": null,
                                "CoSurgeonId": null,
                                "AnesthesistId": null,
                                "SurgeryAppointmentId": null,
                                "PreAdmissionAppointmentId": null,
                                "ParentAppointmentId": null,
                                "DateOfSurgery": '',
                                "PreAdmissionDate": '',
                                "FollowupDate": '',
                                "Remarks": '',
                                "FirstFollowupDate": '',
                                "SecondFollowupDate": '',
                                "ThirdFollowupDate": '',
                                "FirstfollowupAppointmentId": null,
                                "SecondfollowupAppointmentId": null,
                                "ThirdfollowupAppointmentId": null,
                                "open": false
                            }
                            $scope.Coordinatorobj.FinalOrdersList.push(obj);
                        });

                    }
                    if ($scope.Coordinatorobj.InvestigationsArray.length > 0) {
                        angular.forEach($scope.Coordinatorobj.InvestigationsArray, function (item) {

                            var obj = {

                                "DiagnosisList": item.DiagnosisList || [],
                                "DescriptionId": item.DescriptionId || null,
                                "OrgDescriptionId": item.OrgDescriptionId || '',
                                "Description": item.Description || '',
                                "DeleteInd": item.DeleteInd || '',
                                "ExternalCoManager": item.ExternalCoManager || '',
                                "InternalCoManager": item.InternalCoManager || '',
                                "OrderType": item.OrderType || '',
                                "OrderTypeId": item.OrderTypeId || '',
                                "OrganId": item.OrganId || '',
                                "ProcedureCode": item.ProcedureCode || '',
                                "CoordinatorStatusId": null,
                                "CoordinatorStatus": "",

                                "PatientDescriptionId": item.PatientInvestigationId || null,
                                "PlanofDiscussionsNotes": "",
                                "DoctorNotes": "",
                                "DoctorId": null,
                                "NurseId": null,
                                "CoSurgeonId": null,
                                "AnesthesistId": null,
                                "SurgeryAppointmentId": null,
                                "PreAdmissionAppointmentId": null,
                                "ParentAppointmentId": null,
                                "DateOfSurgery": '',
                                "PreAdmissionDate": '',
                                "Remarks": '',
                                "FollowupDate": '',
                                "FirstFollowupDate": '',
                                "SecondFollowupDate": '',
                                "ThirdFollowupDate": '',
                                "FirstfollowupAppointmentId": null,
                                "SecondfollowupAppointmentId": null,
                                "ThirdfollowupAppointmentId": null,
                                "open": false
                            }
                            $scope.Coordinatorobj.FinalOrdersList.push(obj);
                        });

                    }
                    if ($scope.Coordinatorobj.ProceduresArray.length > 0) {
                        angular.forEach($scope.Coordinatorobj.ProceduresArray, function (item) {
                            var obj = {

                                "DiagnosisList": item.DiagnosisList || [],
                                "DescriptionId": item.DescriptionId || null,
                                "OrgDescriptionId": item.OrgDescriptionId || '',
                                "Description": item.Description || '',
                                "DeleteInd": item.DeleteInd || '',
                                "ExternalCoManager": item.ExternalCoManager || '',
                                "InternalCoManager": item.InternalCoManager || '',
                                "OrderType": item.OrderType || '',
                                "OrderTypeId": item.OrderTypeId || '',
                                "OrganId": item.OrganId || '',
                                "ProcedureCode": item.ProcedureCode || '',
                                "CoordinatorStatusId": null,
                                "CoordinatorStatus": "",
                                "PatientDescriptionId": item.PatientProcedureId || null,
                                "PlanofDiscussionsNotes": "",
                                "DoctorNotes": "",
                                "DoctorId": null,
                                "NurseId": null,
                                "CoSurgeonId": null,
                                "AnesthesistId": null,
                                "SurgeryAppointmentId": null,
                                "PreAdmissionAppointmentId": null,
                                "ParentAppointmentId": null,
                                "DateOfSurgery": '',
                                "PreAdmissionDate": '',
                                "FollowupDate": '',
                                "Remarks": '',
                                "FirstFollowupDate": '',
                                "SecondFollowupDate": '',
                                "ThirdFollowupDate": '',
                                "FirstfollowupAppointmentId": null,
                                "SecondfollowupAppointmentId": null,
                                "ThirdfollowupAppointmentId": null,
                                "open": false
                            }
                            $scope.Coordinatorobj.FinalOrdersList.push(obj);
                        });

                    }


                    if ($scope.Coordinatorobj.FinalOrdersList.length > 0) {
                        $scope.Mainobj.IsEditData = true;
                        $scope.SelectedProcedure = $scope.Coordinatorobj.FinalOrdersList[0];
                    }
                }

            });
        };

        $scope.GetAllUsers = function () {

            eHnoteMainAppointmentService.getBranchSubSpecializationsById(doctorinfo.doctordata.UserAddress[0].SubOrganizationId, $scope.HospitalId).then(function (resp) {
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
                        if (resp.rows.length > 0) {
                            $scope.allUserList = resp.rows;
                            if ($scope.allUserList.length !== 0) {
                                $scope.clinicDoctorList = [];
                                $scope.AllCoordinatorList = [];
                                $scope.AllAnesthesistsList = [];
                                $scope.AllNursesList = [];
                                $scope.AllNursesList = angular.copy($scope.allUserList);
                                $scope.AllNursesList = _.uniq($scope.AllNursesList, false, function (p) { return p.DoctorID; });
                                $scope.AllNursesList = $filter("filter")($scope.AllNursesList, function (item) {
                                    return item.RoleId === 8;
                                });
                                $scope.AllAnesthesistsList = angular.copy($scope.allUserList);
                                $scope.AllAnesthesistsList = _.uniq($scope.AllAnesthesistsList, false, function (p) { return p.DoctorID; });
                                $scope.AllAnesthesistsList = $filter("filter")($scope.AllAnesthesistsList, function (item) {
                                    return item.RoleId === 30;
                                });

                                $scope.AllCoordinatorList = angular.copy($scope.allUserList);
                                $scope.AllCoordinatorList = _.uniq($scope.AllCoordinatorList, false, function (p) { return p.DoctorID; });
                                $scope.AllCoordinatorList = $filter("filter")($scope.AllCoordinatorList, function (item) {
                                    return item.RoleId === 18;
                                });
                                $scope.clinicDoctorList = angular.copy($scope.allUserList);
                                $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                                $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, function (item) {
                                    return item.RoleId === 1 || item.RoleId === 43;
                                });
                            }

                        } else {
                            alertify.error("No Users Found in Selected Departments");
                        }
                    }

                    function onGetUsersFailure(data) {
                    }

                }
            });
        };

        $scope.GetPatientInfo = function () {
            return {
                "PatientId": 0,
                "FullName": "",
                "DisplayId": "",
                "Age": "",
                "Gender": "",
                "MobileNo": "",
                "Address": "",
                "ReferralSource": "",
                "ReferralDoctor": "",
                "PCP": "",
                "ExternalManagerName": "",
                "ReferralName": "",
                "ExtCoManager": "",
                "IntCoManager": "",
                "Allergies": [],
                "patientInsuranceDetails": [],
                "patientAddress": ""
            };
        };
        $scope.GetExternalMenager = function () {
            var newreqObj = {
                'LocationId': null,
                'PageNumber': 1,
                'PageSize': 1000,
                'SearchTaxt': '',
                "SpecializationId": null,
                "DeleteInd": 'N',
                "OrganizationId": $scope.HospitalId || 0
            };
            eHnoteReferalDataService.GetReferalPCPDoctors(newreqObj).then(function (resp) {
                $scope.ReferalPCPDoctorsList = [];
                $scope.ReferalDoctorsList = [];
                $scope.ExternalManegerDoctorsList = [];
                if (resp.data.status === "Success") {
                    $scope.ReferalPCPDoctorsList = $filter("filter")(resp.data.PcpRefdetails, function (item) {
                        return item.RefaralTypeId === 1;
                    });
                    $scope.ReferalDoctorsList = $filter("filter")(resp.data.PcpRefdetails, function (item) {
                        return item.RefaralTypeId === 2;
                    });
                    $scope.ExternalManegerDoctorsList = $filter("filter")(resp.data.PcpRefdetails, function (item) {
                        return item.RefaralTypeId === 3;
                    });
                }
                else {
                    alertify.error(resp.data.Message);
                }
            });
        };

        $scope.updateAppointmentPatientTrackerstatus = function () {

            $scope.RoomTypeId = null;
            if ($scope.RoleId == 18) {
                $scope.RoomTypeId = 4;
            }

            $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
            var params = {
                "UserId": eHnoteMasterDataService.getLoginId(),
                "HospitalId": $scope.HospitalId,
                "AppointmentId": $scope.cacheStorageItem.appointmentid,
                "AppointmentTrackerDetailId": 0,
                "RoleId": $scope.RoleId,
                "DoctorId": null,
                "DoctorRoleId": null,
                "RoomTypeId": $scope.RoomTypeId || null,
                "RoomId": null,
                "IsSendTo": "N",
                "IsCheckedIn": "N",
                "IsCheckedOut": "N",
                "IsReCheckIn": "N",
                "IsReCheckOut": "N",
                "CurrentTime": $scope.CurrentTime,
            }
            eHnoteMainAppointmentService.AddUpdateAppointmentTrackerDetails(params).then(function (resp) {

            }, function (err) {
                console.log(err);
                alertify.error("Getting Failed");
            });
        };

        $scope.init = function () {
            $scope.PatientInfo = $scope.GetPatientInfo();

            $scope.SelectPatient($scope.cacheStorageItem.PatientID);
            $scope.GetAdvisedProceduresListByAppointmentId();
            $scope.GetAllUsers();
            $scope.GetmasterClaimAction();
            $scope.GetAdvisedProceduresListByStatus();
            //  $scope.GetOrganizationSurgery();
            $scope.GetExternalMenager();
            $scope.SelectedProcedure = '';
            if ($scope.AppointmentCheckInDynamicStatus === 1) {
                var params = {
                    "AppointmentId": $scope.cacheStorageItem.appointmentid || 0,
                };
                eHnoteMainAppointmentService.GetLatestTrackerStatusById(params).then(function (resp) {
                    if (resp.data.Status === 'Success') {
                        var DynamicStatusarray = resp.data.rows[0];

                        //$scope.cacheStorageItem.RoomTypeId = DynamicStatusarray.RoomTypeId || 0;
                        if ((userLoginDetails.RoleID == 18) && (DynamicStatusarray.RoomTypeId == 4) && DynamicStatusarray.Status == 'Waiting') {
                            $scope.IsFromDifferentRoom = false;
                            $scope.updateAppointmentPatientTrackerstatus();
                        }
                    }
                }, function (err) {
                    console.log(err);
                    alertify.error("Getting Failed");
                });
            }
        };


        $scope.GetStatus = function () {
            return [{
                "Id": 1,
                //"Name": "Pending"
                "Name": "Not Accepted"
            },
            {
                "Id": 2,
                // "Name": "Explained"
                "Name": "Follow-Up"
            },
            {
                "Id": 3,
                "Name": "Accepted"
            }
            ];
        };
        $scope.GetStatusList = angular.copy($scope.GetStatus());

        $scope.changeDateOfSurgery = function (surgeryDt, item) {
            var FirstFollowupDate = moment(surgeryDt).add(1, 'days').format('MM-DD-YYYY');
            var SecondFollowupDate = moment(surgeryDt).add(7, 'days').format('MM-DD-YYYY');
            var ThirdFollowupDate = moment(surgeryDt).add(30, 'days').format('MM-DD-YYYY');
            item.FirstFollowupDate = FirstFollowupDate;
            item.SecondFollowupDate = SecondFollowupDate;
            item.ThirdFollowupDate = ThirdFollowupDate;
        };


        $scope.Getmainobj = function () {
            return {
                "AdvisedProceduresId": 0,
                "CoordinatorStatusId": null,
                "UserId": $scope.UserId || 0,
                "OrganizationId": $scope.HospitalId || 0,
                "CoordinatorStatus": "",
                "CostEstimatorType": "Bill",
                "IsEditData": false,
                "SummaryView": false,
                "PrimaryPatientInsuranceDetailId": 0,
                "SecondaryPatientInsuranceDetailId": 0,
                "ProcedureCode": "",
                "OrderTypeId": null,
                "OrderType": "",
                "Description": "",
                "DescriptionId": null,
                "OrgDescriptionId": null,
                "PatientDescriptionId": null,
                "PlanofDiscussionsNotes": "",
                "DoctorNotes": "",
                "DeleteInd": "N",
                "AppointmentId": $scope.cacheStorageItem.appointmentid || null,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "Remarks": '',
                //"DateOfSurgery": "",
                //"SurgeryAppointmentId": null,
                //"PreOpAppointmentId": null,
                //"ParentAppointmentId": null,
                //"PreAdmissionDate": "",
                //"DoctorId": null,
                //"NurseId": null,
                //"CoSurgeonId": null,
                //"AnesthesistId": null,
                //"FollowupDate": '',
                //"FirstFollowupDate": '',
                //"SecondFollowupDate": '',
                //"ThirdFollowupDate": '',
                //"FirstfollowupAppointmentId": null,
                //"SecondfollowupAppointmentId": null,
                //"ThirdfollowupAppointmentId": null,
                // "OrganId": null,
                "DiagnosisList": [],
                "FinalOrdersList": [],
                "PatientEducationImageList": [],
                "PatientEducationVideoList": [],
                "TotalChargeAmount": 0,
                "TotalAmount": 0,
                "TotalInsuranceAmount": 0,
                "TotalPatientResponsibilityAmount": 0,
                "BillItemDocumentList": [],
                "BillItemList": [],
                "CurrentMedicationList": [],
                "InvestigationsList": [],
                "MedicationsList": [],
                "StatusFlag": "D",
                "ReviewedBy": null,

            }
        };

        $scope.Mainobj = angular.copy($scope.Getmainobj());

        $scope.GetmasterClaimAction = function () {
            eHnoteSettingsDataService.GetmasterClaimActionList().then(function (resp) {
                $scope.billPaymentByModes = resp.data.BillPaymentByModes || [];
                $scope.Coordinatorobj.ClaimActionObj = $filter("filter")($scope.billPaymentByModes, { "BillPaymentTypeId": 1 })[0];
                if ($scope.PatientInfo.patientInsuranceDetails.length > 0) {
                    $scope.Coordinatorobj.ClaimActionObj = $filter("filter")($scope.billPaymentByModes, { "BillPaymentTypeId": 2 })[0];
                    $scope.ChangeBillByMode($scope.Coordinatorobj);
                }

            }, function (err) {
                alertify.error("Failed");
                console.log(err);
            });
        }

        $scope.SelectPatient = function (patientId) {
            eHnoteAuditServices.getPatientDetailsById(patientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
            function ongetPatientDetailsSuccess(data) {
                if (data !== undefined) {
                    var patientitem = data;

                    $scope.PatientInfo = $scope.GetPatientInfo();

                    eHnoteMasterDataService.addpatientData(patientitem);
                    $scope.patientid = patientitem.Patient[0].PatientID;
                    $scope.PatientInfo.PatientId = patientitem.Patient[0].PatientID;
                    $scope.PatientInfo.FullName = patientitem.Patient[0].FullName;
                    $scope.PatientInfo.DisplayId = patientitem.Patient[0].PatientDisplayId;
                    $scope.PatientInfo.Age = patientitem.Patient[0].AgeInYears + 'Y' + ' ' + patientitem.Patient[0].AgeInMonths + 'M';
                    $scope.PatientInfo.Gender = patientitem.Patient[0].Gender;
                    $scope.PatientInfo.MobileNo = patientitem.Patient[0].AltCountryCode + '-' + patientitem.Patient[0].Altareacode + '-' + patientitem.Patient[0].PatientHomeNumber;
                    $scope.PatientInfo.PCP = patientitem.Patient[0].AdditionalInfo.PCPName;
                    $scope.PatientInfo.ExternalManagerName = patientitem.Patient[0].ExternalManagerName;
                    $scope.PatientInfo.ReferralName = patientitem.Patient[0].ReferralName;
                    $scope.PatientInfo.Allergies = angular.copy(patientitem.Patient[0].PatientAllergies);
                    $scope.PatientInfo.patientInsuranceDetails = angular.copy(patientitem.patientInsuranceDetails);
                    $scope.PatientInfo.patientAddress = angular.copy(patientitem.PatientAddress.PermanentAddress);
                    $scope.PatientInfo.IsNoChargePatient = patientitem.Patient[0].IsNoChargePatient || false;

                    //$scope.PatientDetailsInfo.PatientID = patientitem.Patient[0].PatientID;

                }
            }
            function ongetPatientDetailsError(error) {
                console.log(error);
            }


        }



        $scope.ChangesProcedure = function (item) {
            $scope.SelectedProcedure = item;
        }


        //$scope.GetOrganizationSurgery = function () {

        //    var params = {
        //        "OrgProcedureId": $scope.Mainobj.OrgDescriptionId || 0,
        //        "HospitalId": $scope.HospitalId,
        //    };

        //    eHnoteSurgeryService.GetOrganizationSurgeryDocumentMaterial(params).then(function (response) {
        //        if (response.data.Status == "Success") {
        //            if (response.data.rows !== undefined) {
        //                $scope.tempmaterialList = response.data.rows;
        //                if ($scope.tempmaterialList.length > 0) {
        //                    angular.forEach($scope.tempmaterialList, function (Item) {
        //                        Item.TempImagesArray = [];
        //                        Item.TempPdfArray = [];
        //                        if (Item.VideoDetails.length > 0) {
        //                            angular.forEach(Item.VideoDetails, function (Vitem) {
        //                                var videoId = '';
        //                                var url = Vitem.VideoURL;
        //                                videoId = url.split("=")[1];
        //                                Vitem.videoId = videoId;

        //                            });
        //                        }
        //                        if (Item.DocumentDetails.length > 0) {
        //                            angular.forEach(Item.DocumentDetails, function (kitem) {
        //                                if (kitem.DocumentExt === 'image/jpeg' || kitem.DocumentExt === "image/png") {
        //                                    kitem.file = kitem.S3URL;
        //                                    Item.TempImagesArray.push(kitem);
        //                                }
        //                                if (kitem.DocumentExt === "application/pdf") {
        //                                    kitem.file = kitem.S3URL;
        //                                    Item.TempPdfArray.push(kitem);
        //                                }
        //                            });
        //                        }
        //                        $scope.Mainobj.PatientEducationVideoList = Item.VideoDetails || [];
        //                            //   "PatientEducationImageList": [],
        //                            //"PatientEducationVideoList": [],
        //                    });

        //                }
        //                else {
        //                    $scope.tempmaterialList = [];
        //                }
        //            }


        //        }

        //    });
        //};


        $scope.GetAdvisedProceduresListByStatus = function () {

            var params = {
                "AppointmentId": $scope.cacheStorageItem.appointmentid || 0,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "HospitalId": $scope.HospitalId,
                "OrgDescriptionId": 0
            };

            eHnoteSurgeryService.GetAdvisedProceduresListByStatus(params).then(function (resp) {
                if (resp.data.Status == "Success") {
                    if (!angular.equals(resp.data.rows, {})) {
                        var obj = resp.data.rows;
                        //   if ($scope.Mainobj.OrgDescriptionId = obj.OrganizationDescriptionId) {
                        $scope.Mainobj.BillItemList = obj.BillItemList || [];
                        $scope.Mainobj.AdvisedProceduresId = obj.CordinatorAdvisedProcedureId;
                        $scope.Mainobj.CurrentMedicationList = obj.CurrentMedicationList || [];
                        $scope.Mainobj.InvestigationsList = obj.InvestigationsList || [];
                        $scope.Mainobj.MedicationsList = obj.MedicationsList || [];
                        $scope.Mainobj.FinalOrdersList = obj.FinalOrdersList || [];
                        $scope.Mainobj.ReviewedBy = obj.ReviewedBy || '';
                        $scope.Mainobj.ReviewedByName = obj.ReviewedByName || '';
                        $scope.Mainobj.TotalAmount = obj.TotalAmount || '';
                        $scope.Mainobj.TotalChargeAmount = obj.TotalChargeAmount || 0;
                        $scope.Mainobj.Remarks = obj.Remarks || '';
                        $scope.Mainobj.SummaryView = true;
                        $scope.Mainobj.StatusFlag = obj.StatusFlag || 'D';
                        $scope.Mainobj.CordinatorAdvicedlogArray = obj.CordinatorAdvicedlogarray || [];
                        //$scope.Mainobj.CoordinatorStatus = obj.CoordinatorStatus;
                        //$scope.Mainobj.CoordinatorStatusId = obj.CoordinatorStatusId;
                        //$scope.Mainobj.NurseId = obj.NurseId;
                        //$scope.Mainobj.OrderType = obj.OrderType;
                        //$scope.Mainobj.OrderTypeId = obj.OrderTypeId;
                        //$scope.Mainobj.PreAdmissionDate = obj.PreAdmissionDate || '';
                        //$scope.Mainobj.PreOpAppointmentId = obj.PreOpAppointmentId || '';
                        //$scope.Mainobj.PrimaryPatientInsuranceDetailId = obj.PrimaryPatientInsuranceDetailId || '';
                        //$scope.Mainobj.SecondaryPatientInsuranceDetailId = obj.SecondaryPatientInsuranceDetailId || '';
                        //$scope.Mainobj.SecondfollowupAppointmentId = obj.SecondfollowupAppointmentId || '';
                        //$scope.Mainobj.SurgeryAppointmentId = obj.SurgeryAppointmentId || '';
                        //$scope.Mainobj.ThirdfollowupAppointmentId = obj.ThirdfollowupAppointmentId || '';
                        //$scope.Mainobj.CoSurgeonId = obj.CoSurgeonId || '';
                        //$scope.Mainobj.AnesthesistId = obj.AnesthesistId || '';
                        //$scope.Mainobj.DoctorId = obj.DoctorId || '';            
                        //$scope.Mainobj.DateOfSurgery = obj.DateOfSurgery || '';
                        //$scope.Mainobj.FirstFollowupDate = obj.FirstFollowupDate || '';
                        //$scope.Mainobj.SecondFollowupDate = obj.SecondFollowupDate || '';
                        //$scope.Mainobj.ThirdFollowupDate = obj.ThirdFollowupDate || '';
                        //$scope.Mainobj.FollowupDate = obj.FollowupDate || '';

                        if ($scope.Mainobj.FinalOrdersList.length > 0) {
                            if ($scope.Coordinatorobj.FinalOrdersList.length > 0) {
                                angular.forEach($scope.Mainobj.FinalOrdersList, function (Aitem) {
                                    angular.forEach($scope.Coordinatorobj.FinalOrdersList, function (Bitem) {
                                        if (Aitem.OrderTypeId == Bitem.OrderTypeId && Aitem.OrgDescriptionId == Bitem.OrgDescriptionId) {
                                            Bitem.AnesthesistId = Aitem.AnesthesistId;
                                            Bitem.Doctorobj = Aitem.DoctorName || '';
                                            Bitem.DoctorId = Aitem.DoctorId || null;
                                            Bitem.NurseId = Aitem.NurseId || null;
                                            Bitem.Anesthesistobj = Aitem.AnesthesistName || '';
                                            Bitem.CoSurgeonObj = Aitem.CoSurgeonName || '';
                                            Bitem.CoSurgeonId = Aitem.CoSurgeonId;
                                            Bitem.CoordinatorStatusId = Aitem.CoordinatorStatusId.toString();
                                            Bitem.CoordinatorStatus = Aitem.CoordinatorStatus;
                                            Bitem.CordinatorAdvisedProcedureId = Aitem.CordinatorAdvisedProcedureId || null;
                                            Bitem.CordinatorFinalOrdersListId = Aitem.CordinatorFinalOrdersListId || null;
                                            Bitem.DateOfSurgery = Aitem.DateOfSurgery || '';
                                            Bitem.FollowupDate = Aitem.FollowupDate || '';
                                            Bitem.FirstFollowupDate = Aitem.FirstFollowupDate || '';
                                            Bitem.SecondFollowupDate = Aitem.SecondFollowupDate || '';
                                            Bitem.ThirdFollowupDate = Aitem.ThirdFollowupDate || '';
                                            Bitem.PreAdmissionDate = Aitem.PreAdmissionDate || '';
                                            Bitem.PreAdmissionAppointmentId = Aitem.PreAdmissionAppointmentId || null;
                                            Bitem.PreAdmissionStatusId = Aitem.PreAdmissionStatusId || null;
                                            Bitem.PreAdmissionStatus = Aitem.PreAdmissionStatus || '';

                                            if (Bitem.PreAdmissionStatus == "") {
                                                if (Bitem.PreAdmissionStatusId === 1) {
                                                    Bitem.PreAdmissionStatus = "Approved";
                                                } else if (Bitem.PreAdmissionStatusId === 2) {
                                                    Bitem.PreAdmissionStatus = "Not Fit for Surgery";
                                                } else {
                                                    Bitem.PreAdmissionStatus = "Postpone Surgery";
                                                }
                                            }

                                            if (Bitem.FollowupDate != "") {
                                                Bitem.FollowupDate = $filter('date')(Bitem.FollowupDate, 'M-dd-yyyy');
                                            }
                                            if (Bitem.FirstFollowupDate != "") {
                                                Bitem.FirstFollowupDate = $filter('date')(Bitem.FirstFollowupDate, 'M-dd-yyyy');
                                            }
                                            if (Bitem.SecondFollowupDate != "") {
                                                Bitem.SecondFollowupDate = $filter('date')(Bitem.SecondFollowupDate, 'M-dd-yyyy');
                                            }
                                            if (Bitem.ThirdFollowupDate != "") {
                                                Bitem.ThirdFollowupDate = $filter('date')(Bitem.ThirdFollowupDate, 'M-dd-yyyy');
                                            }
                                            if (Bitem.PreAdmissionDate != "") {
                                                Bitem.PreAdmissionDate = $filter('date')(Bitem.PreAdmissionDate, 'M-dd-yyyy');
                                            }
                                            if (Bitem.DateOfSurgery != "") {
                                                Bitem.DateOfSurgery = $filter('date')(Bitem.DateOfSurgery, 'M-dd-yyyy');
                                            }
                                        }
                                    });
                                });
                            }
                        }
                        //  }
                        if ($scope.Mainobj.CurrentMedicationList.length > 0) {
                            angular.forEach($scope.Mainobj.CurrentMedicationList, function (Mitem) {
                                if (Mitem.DurationDate != "") {
                                    Mitem.DurationDate = $filter('date')(Mitem.DurationDate, 'M-dd-yyyy');
                                }
                                if (Mitem.FromDate != "") {
                                    Mitem.FromDate = $filter('date')(Mitem.FromDate, 'M-dd-yyyy');
                                }
                                if (Mitem.ToDate != "") {
                                    Mitem.ToDate = $filter('date')(Mitem.ToDate, 'M-dd-yyyy');
                                }
                            });
                        }
                    }
                    $scope.changePrice();
                }


            });
        };

        $scope.init();

        $scope.SeletedItem = function (item, Type) {
            $scope.Mainobj = angular.copy($scope.Getmainobj());
            if (Type == 'Surgery') {
                //$scope.Mainobj.OrgDescriptionId = item.OrganizationSurgeryId;
                //$scope.Mainobj.Description = item.SurgeryName;
                //$scope.Mainobj.DescriptionId = item.SurgeryId;
                //$scope.Mainobj.PatientDescriptionId = item.PatientSurgeryId;
                $scope.Mainobj.OrganId = item.OrganId;
                $scope.Mainobj.OrgDescriptionId = item.OrgDescriptionId;
                $scope.Mainobj.Description = item.Description;
                $scope.Mainobj.DescriptionId = item.DescriptionId;
                $scope.Mainobj.PatientDescriptionId = item.PatientSurgeryId;


                $scope.Mainobj.ProcedureCode = item.ProcedureCode;
                $scope.Mainobj.PlanofDiscussionsNotes = item.PlanofDiscussionsNotes;
                $scope.Mainobj.DoctorNotes = item.DoctorNotes;
                $scope.Mainobj.DiagnosisList = item.DiagnosisList;
                $scope.Mainobj.OrderTypeId = 3;
                $scope.Mainobj.OrderType = 'Surgery';
                //$scope.Mainobj.DateOfSurgery = $filter('date')(new Date(item.SurgeryDate),"MM-dd-yyyy");
                $scope.Mainobj.IsEditData = true;

                $scope.Mainobj.PatientId = $scope.PatientInfo.PatientId;
                $scope.Mainobj.ParentAppointmentId = 0;
                $scope.Mainobj.AppointmentId = $scope.cacheStorageItem.appointmentid || 0;

                $scope.ExternalManegerDoctorsList = $scope.ExternalManegerDoctorsList || [];
                let tempArray1 = $filter('filter')($scope.ExternalManegerDoctorsList, { 'DoctorID': item.ExternalCoManagerId }, true);
                if (tempArray1.length > 0) {
                    $scope.PatientInfo.ExtCoManager = tempArray1[0].FullName;
                }
                //let tempArray2 = $filter('filter')($scope.allUserList, { 'DoctorID': item.InternalCoManagerId }, true);
                let tempArray2 = $filter('filter')($scope.clinicDoctorList, { 'DoctorID': item.InternalCoManagerId }, true);
                if (tempArray2.length > 0) {
                    $scope.PatientInfo.IntCoManager = tempArray2[0].FullName;
                }
            }
            if (Type == 'Procedures') {
                $scope.Mainobj.OrganId = item.OrganId;
                $scope.Mainobj.OrgDescriptionId = item.OrgDescriptionId;
                $scope.Mainobj.Description = item.Description;
                $scope.Mainobj.DescriptionId = item.DescriptionId;
                $scope.Mainobj.PatientDescriptionId = item.PatientProcedureId;

                //$scope.Mainobj.OrgDescriptionId = item.OrgProcedureId;
                //$scope.Mainobj.Description = item.ProcedureName;
                //$scope.Mainobj.DescriptionId = item.ProcedureId;
                //$scope.Mainobj.PatientDescriptionId = item.PatientProcedureId;

                $scope.Mainobj.ProcedureCode = item.ProcedureCode;
                $scope.Mainobj.PlanofDiscussionsNotes = item.PlanofDiscussionsNotes;
                $scope.Mainobj.DoctorNotes = item.DoctorNotes;
                $scope.Mainobj.DiagnosisList = item.DiagnosisList;
                $scope.Mainobj.IsEditData = true;
                $scope.Mainobj.OrderTypeId = 2;
                $scope.Mainobj.OrderType = 'Procedure';
            }
            if (Type == 'Investigations') {
                $scope.Mainobj.OrganId = item.OrganId;
                $scope.Mainobj.OrgDescriptionId = item.OrgDescriptionId;
                $scope.Mainobj.Description = item.Description;
                $scope.Mainobj.DescriptionId = item.DescriptionId;
                $scope.Mainobj.PatientDescriptionId = item.PatientInvestigationId;

                //$scope.Mainobj.OrgDescriptionId = item.OrgInvestigationId;
                //$scope.Mainobj.PatientDescriptionId = item.PatientInvestigationId;
                //$scope.Mainobj.Description = item.InvestigationName;
                //$scope.Mainobj.DescriptionId = item.InvestigationId;

                $scope.Mainobj.ProcedureCode = item.ProcedureCode;
                $scope.Mainobj.PlanofDiscussionsNotes = item.PlanofDiscussionsNotes;
                $scope.Mainobj.DoctorNotes = item.DoctorNotes;
                $scope.Mainobj.DiagnosisList = item.DiagnosisList;
                $scope.Mainobj.IsEditData = true;
                $scope.Mainobj.OrderTypeId = 1;
                $scope.Mainobj.OrderType = 'Investigation';
            }
            $scope.GetAdvisedProceduresListByStatus();
            //  $scope.GetOrganizationSurgery();
        }


        $scope.GetOrganizationProcedure = function (text) {
            //if ($scope.mainBillingObject.BillingProviderId === 0 || $scope.mainBillingObject.BillingProviderId === "") {
            //    alertify.error("Please Select Billing Provider");
            //    return false;
            //}

            var params = {
                "OrganizationId": $scope.HospitalId,
                "ProcedureId": 0,
                "CPTCODE": "",  // cptcode tblorganizationprocedure
                "SearchText": text || "", // searchtext
                "TypeOfServiceId": 0,
                "PageNumber": 1,
                "PageSize": 10,
                "Status": 1,
                "IsFrequent": "N"
            };
            if (params.SearchText == '') {
                params.IsFrequent = 'Y';
            }
            return eHnoteSettingsDataService.GetOrganizationProcedures(params).then(function (resp) {
                if (resp.data.rows !== undefined) {
                    return resp.data.rows.map(function (item) {
                        return item;
                    });
                }
            });
        };

        $scope.pushtoBill = function (item) {
            var OrganizationPayorId = 0;
            $scope.selectobj = {
                "OrganizationProcedureId": item.OrganizationProcedureId,
                "ProcedureId": item.ProcedureId,
                "CPTCode": item.CPTCode,
                "ProcedureName": item.ProcedureName,
                "DeleteInd": "N",
                "ProcedureCost": null,
                "DeleteInd": 'N',
                "CordinatorBillItemListId": 0,
                "Units": 1,
                "Charges": null,
                "InsuranceAmount": null,
                "PatientCoPay": null,
                "Total": 0
            };

            var List = $filter("filter")($scope.Mainobj.BillItemList, function (Aitem) {
                return (Aitem.OrganizationProcedureId === item.OrganizationProcedureId && Aitem.DeleteInd === 'N');
            });
            if (List.length > 0) {
                /*alertify.error('You have already entered this Billitem');*/
                alertify.error('Bill Item Already Added!');
                $scope.Coordinatorobj.BillParticular = "";
                return;
            }


            var req = {
                "ParentOrganizationId": $scope.ParenthospitalId,
                "OrganizationId": $scope.HospitalId,
                "OrganizationPayorId": OrganizationPayorId || 0,
                "OrganizationProcedureId": item.OrganizationProcedureId || 0
            };

            eHnoteSettingsDataService.GetOrganizationProcedureCostById(req).then(function (resp) {
                if (resp.data.Status === "Success") {
                    var ProcedureCost = 0;
                    if (resp.data.rows.length > 0) {
                        ProcedureCost = resp.data.rows[0].ActualCost || 0;
                    }
                    $scope.selectobj.ProcedureCost = ProcedureCost;
                    $scope.Mainobj.BillItemList.push($scope.selectobj);
                    $scope.Coordinatorobj.BillParticular = '';

                } else {
                    alertify.error(resp.data.Message);
                }

            }, function (error) {

            });
        }



        $scope.GetUserBillItemDetails = function () {
            var params = {
                "UserId": $scope.UserId,
                "SearchText": "",
                "PageSize": 1000,
                "PageNumber": 1,
                "OrganizationId": $scope.HospitalId,
            }
            eHnotePatientDataService.GetUserBillItemDetails(params).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.BillItemTemplatesArray = resp.data.rows || [];
                }

            }, function (err) {

            });
        }
        $scope.GetUserBillItemDetails();

        $scope.DelectBillitem = function (item, index) {
            $scope.Mainobj.BillItemList.splice(index, 1);
            $scope.changePrice();
        };

        $scope.onblurevent = function () {
            $scope.Mainobj.BillItemList = $scope.Mainobj.BillItemList || [];
            $scope.Mainobj.TotalAmount = null;
            $scope.Mainobj.TotalChargeAmount = 0;
            if ($scope.Mainobj.BillItemList.length > 0) {
                angular.forEach($scope.Mainobj.BillItemList, function (item) {
                    item.PatientCoPay = parseInt(item.PatientCoPay);
                    item.PatientCoPay = item.PatientCoPay || 0;
                    if (item.PatientCoPay != 0) {
                        $scope.Mainobj.TotalAmount += item.PatientCoPay;
                        $scope.Mainobj.TotalChargeAmount += item.PatientCoPay;
                    }
                });

            }
        }

        $scope.SaveBillTemplates = function () {
            if ($scope.Coordinatorobj.EnterBillTemplateName == '') {
                /*alertify.error('Enter Template Name');*/
                alertify.error('Please Add At Least One Bill Item!');
                return false;
            }
            if ($scope.Mainobj.BillItemList.length == 0) {
                alertify.error('Select BillItem');
                return false;
            }
            var params = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "DeleteInd": "N",
                "TemplateId": 0,
                "TemplateName": $scope.Coordinatorobj.EnterBillTemplateName || '',
                "BillItems": $scope.Mainobj.BillItemList || [],
            }

            eHnotePatientDataService.AddUpdateUserBillItemTemplateDetails(params).then(function (resp) {
                if (resp.data.Status === "Success") {
                    alertify.success("Save successfully");
                    $scope.Coordinatorobj.EnterBillTemplateName = '';
                    $scope.GetUserBillItemDetails();

                } else {
                    alertify.error(resp.data.Message);
                }
            }, function (err) {

            });
        }

        $scope.ChangesForBillTemp = function (item) {
            console.log(item);
            item = item || '';
            /*$scope.Mainobj.BillItemList = [];*/
            if (item != '') {
                $scope.Mainobj.BillItemList = angular.copy(item.BillItems) || [];
            }
            $scope.changePrice();

        }



        $scope.selectPrintImgLogo = function (file) {
            $scope.file = file;
        }

        $scope.Savebillitemimage = function () {
            if ($scope.file != null) {
                var pName = $scope.file.name, name = "";
                var type = $scope.file.type.split("/")[1];
                if (pName.length > 9) {
                    name = pName.substring(0, 9) + "..." + "." + type;
                } else {
                    name = angular.copy(pName) + '.' + type;
                }
                var param = {
                    "OrgDescriptionId": $scope.Mainobj.OrgDescriptionId,
                    "PatientId": $scope.PatientInfo.PatientId,
                    "PatientName": $scope.PatientInfo.FullName,
                    "AppointmentId": $scope.cacheStorageItem.appointmentid,
                    "file": $scope.file,
                    "DeleteInd": "N",
                    "UserId": $scope.UserId,
                    "HospitalId": $scope.HospitalId,
                    "S3URL": "",
                    "DocumentId": 0,
                    "DocumentName": $scope.file.name || "",
                    "DocumentExt": $scope.file.type,
                    "DisplayName": name
                };
                eHnoteSurgeryService.AddUpdateCostEstimatorupload(param, $scope.file).then(function (resp) {
                    console.log(resp);
                    $scope.Mainobj.CostEstimatorType = "Bill";
                }, function (errorr) {

                    console.log(error);
                });
            }

        }

        $scope.OnSelectProcedure = function (item) {
            $scope.EducationMaterialObj.OrgProcedureId = item.OrganizationProcedureId || null;
        }

        $scope.GetEducationMaterialObj = function () {
            return {
                "Type": "Procedure",
                "OrgProcedureId": "",
                "ProcedureName": "",
                "SearchProcedureObj": "",
                "DocumentDetails": [],
                "VideoDetails": [{
                    "VideoId": 0,
                    "VideoName": "",
                    "VideoURL": "",
                    "DeleteInd": 'N'
                }],
                "TempImagesArray": [],
                "TempPdfArray": [],
                "TempVideoArray": [],
                "IsSendMaterialEmail": false,
                "FileName": "",
                "SelectSurgeryMaterial": ""
            };
        };
        $scope.EducationMaterialObj = angular.copy($scope.GetEducationMaterialObj());
        $scope.EducationfieldPopup = function () {
            $scope.EducationMaterialObj = angular.copy($scope.GetEducationMaterialObj());
            $scope.EducationMaterialObj.ProcedureName = $scope.Mainobj.Description || '';
            $scope.EducationMaterialObj.OrgProcedureId = $scope.Mainobj.OrgDescriptionId || '';

            $scope.mInstanceAdd1 = $uibModal.open({
                "templateUrl": "EducationMaterialPopup.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "windowClass": "modal__popup--1 bottom-to-top-modal in",
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {

                    $scope.Addnew = function (item) {

                        $scope.Varray = item.VideoDetails[item.VideoDetails.length - 1];
                        if ($scope.Varray.VideoURL == '') {
                            alertify.error("Enter URL");
                            return false;
                        }
                        if ($scope.Varray.VideoName == '') {
                            alertify.error("Enter Name");
                            return false;
                        }
                        $scope.DeleteVideodetails = false;
                        if ($scope.Varray.VideoURL != '' && $scope.Varray.VideoName != '') {
                            $scope.DeleteVideodetails = true;
                        }
                        else {
                            $scope.DeleteVideodetails = false;
                        }
                        var obj = {
                            "VideoId": 0,
                            "VideoName": "",
                            "VideoURL": "",
                            "DeleteInd": 'N'
                        }
                        $scope.EducationMaterialObj.VideoDetails.push(obj);
                    }

                    $scope.ConfrontationCloseuib = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                    $scope.selectPrintImgLogo1 = function (files) {
                        files = files || [];
                        if (files.length > 0) {
                            angular.forEach(files, function (item) {
                                $scope.file1 = item;
                                if ($scope.file1 != null) {

                                    var pName = $scope.file1.name, name = "";
                                    var type = $scope.file1.type.split("/")[1];
                                    if (pName.length > 9) {
                                        name = pName.substring(0, 9) + "..." + "." + type;
                                    } else {
                                        name = angular.copy(pName) + '.' + type;
                                    }
                                    var obj = {
                                        "file": $scope.file1,
                                        "DeleteInd": false,
                                        "DocumentId": 0,
                                        "DocumentName": $scope.file1.name || "",
                                        "DocumentExt": $scope.file1.type,
                                        "DisplayName": name,
                                        "FileName": $scope.EducationMaterialObj.FileName,
                                    };
                                    if ($scope.file1.type != 'application/pdf') {
                                        $scope.EducationMaterialObj.TempImagesArray.push(obj);
                                    }
                                    else {
                                        $scope.EducationMaterialObj.TempPdfArray.push(obj);
                                    }
                                    angular.element("input[type='file']").val(null);
                                }

                            });
                        }
                    }
                    $scope.SendEducation = function (item) {

                        $scope.Varray = item.VideoDetails[item.VideoDetails.length - 1];
                        $scope.file = "";
                        if (item.TempPdfArray.length > 0) {
                            $scope.file = item.TempPdfArray[0].file || "";
                        }
                        if (item.TempImagesArray.length > 0) {
                            $scope.file = item.TempImagesArray[0].file || "";
                        }

                        if ($scope.Varray.VideoURL == '' && $scope.Varray.VideoName == '' && $scope.file == "") {
                            if ($scope.Varray.VideoURL == '') {
                                alertify.error("Enter URL");
                                return false;
                            }
                        }
                        else if ($scope.Varray.VideoName !== '' && $scope.Varray.VideoURL == '') {
                            if ($scope.Varray.VideoURL == '') {
                                alertify.error("Enter URL");
                                return false;
                            }
                        }
                        else if ($scope.Varray.VideoURL !== '' && $scope.Varray.VideoName == '') {
                            if ($scope.Varray.VideoName == '') {
                                alertify.error("Enter Name");
                                return false;
                            }
                        }
                        else if ($scope.Varray.VideoURL == '' && $scope.Varray.VideoName == '' && $scope.file == "") {
                            if ($scope.file == "") {
                                alertify.error("Please select the file");
                                return false;
                            }
                        } else if (item.TempImagesArray.length > 0) {
                            var List = 0;
                            angular.forEach(item.TempImagesArray, function (imgitem) {
                                imgitem.FileName = imgitem.FileName || "";
                                if (imgitem.FileName == "") {
                                    List++;
                                }
                            });
                            if (List != 0) {
                                alertify.error("Add Image Name");
                                return false;
                            }
                        } else if (item.TempPdfArray.length > 0) {
                            var List1 = 0;
                            angular.forEach(item.TempPdfArray, function (Pdfitem) {
                                Pdfitem.FileName = Pdfitem.FileName || "";
                                if (Pdfitem.FileName == "") {
                                    List1++;
                                }
                            });
                            if (List1 != 0) {
                                alertify.error("Add File Name");
                                return false;
                            }
                        }

                        var obj = {
                            "EducationMaterial": $scope.EducationMaterialObj,
                            "Type": $scope.EducationMaterialObj.Type ||'Procedure',
                            "PatientID": 0,
                            "DoctorID": null, // Surgoen id
                            "UserId": eHnoteMasterDataService.getLoginId(), // surgeon id
                            "HospitalId": $scope.HospitalId,
                            "PatientName": '',
                            "OrgProcedureId": $scope.EducationMaterialObj.OrgProcedureId,
                        };
                        obj.EducationMaterial.TempDocumentDetails = obj.EducationMaterial.TempDocumentDetails || [];
                        obj.EducationMaterial.VideoDetails = obj.EducationMaterial.VideoDetails || [];
                        $scope.EducationMaterialObj.TempPdfArray = $scope.EducationMaterialObj.TempPdfArray || [];
                        if ($scope.EducationMaterialObj.TempPdfArray.length > 0) {
                            angular.forEach($scope.EducationMaterialObj.TempPdfArray, function (item) {
                                item.DocumentId = item.DocumentId || 0;
                                var object = {
                                    "DocumentTypeId": item.DocumentTypeId,
                                    "DocumentName": item.DocumentName,
                                    "DocumentExt": item.DocumentExt,
                                    "S3URL": item.S3URL,
                                    "file": item.file,
                                    "DeleteInd": item.DeleteInd,
                                    "DocumentId": item.DocumentId,
                                    "FileName": item.FileName
                                };
                                if (item.DocumentId === 0) {
                                    obj.EducationMaterial.TempDocumentDetails.push(object);
                                    obj.EducationMaterial.DocumentDetails.push(object);
                                }
                                else {
                                    obj.EducationMaterial.DocumentDetails.push(object);
                                }
                            });
                        }
                        $scope.EducationMaterialObj.TempImagesArray = $scope.EducationMaterialObj.TempImagesArray || [];
                        if ($scope.EducationMaterialObj.TempImagesArray.length > 0) {
                            angular.forEach($scope.EducationMaterialObj.TempImagesArray, function (item) {
                                item.DocumentId = item.DocumentId || 0;

                                var object = {
                                    "DocumentTypeId": item.DocumentTypeId,
                                    "DocumentName": item.DocumentName,
                                    "DocumentExt": item.DocumentExt,
                                    "S3URL": item.S3URL,
                                    "file": item.file,
                                    "DeleteInd": item.DeleteInd,
                                    "DocumentId": item.DocumentId,
                                    "FileName": item.FileName
                                };
                                if (item.DocumentId === 0) {
                                    obj.EducationMaterial.TempDocumentDetails.push(object);
                                    obj.EducationMaterial.DocumentDetails.push(object);
                                }
                                else {
                                    obj.EducationMaterial.DocumentDetails.push(object);
                                }

                            });
                        }
                        $scope.EducationMaterialObj.VideoUrl = $scope.EducationMaterialObj.VideoUrl || "";
                        if ($scope.EducationMaterialObj.VideoUrl !== "") {
                            var Obj = {
                                "VideoId": 0,
                                "VideoURL": $scope.EducationMaterialObj.VideoUrl,
                                "VideoName": $scope.EducationMaterialObj.VideoName,
                                "DeleteInd": false
                            };
                            $scope.EducationMaterialObj.TempVideoArray.push(Obj);
                            $scope.EducationMaterialObj.VideoUrl = "";
                            $scope.EducationMaterialObj.VideoName = "";
                        }

                        if ($scope.EducationMaterialObj.TempVideoArray.length > 0) {
                            angular.forEach($scope.EducationMaterialObj.TempVideoArray, function (item) {
                                item.VideoId = item.VideoId || 0;
                                var object = {
                                    "VideoURL": item.VideoURL,
                                    "VideoName": item.VideoName,
                                    "DeleteInd": item.DeleteInd,
                                    "VideoId": item.VideoId
                                };
                                obj.EducationMaterial.VideoDetails.push(object);

                            });
                        }
                        eHnoteSurgeryService.AddEducationMaterial(obj, OnEducationMaterialSuccess, OnEducationMaterialError);

                        function OnEducationMaterialSuccess(data) {
                            if (data.Status === "Success") {
                                alertify.success("Education Material added successfully");
                                $uibModalInstance.close();

                            }
                        }

                        function OnEducationMaterialError(data) {
                            console.log(data);
                        }
                    };

                    $scope.ClearVideoDetails = function (item) {
                        var index = $scope.EducationMaterialObj.VideoDetails.indexOf(item);
                        if (index > -1) {
                            $scope.EducationMaterialObj.VideoDetails.splice(index, 1);
                        }
                    };

                    $scope.Removetempimage = function (item) {

                        var index = $scope.EducationMaterialObj.TempImagesArray.indexOf(item);
                        if (index > -1) {
                            $scope.EducationMaterialObj.TempImagesArray.splice(index, 1);
                        }
                    }
                }
            });
            $scope.mInstanceAdd1.result.then(function (response) {
                //   $scope.GetOrganizationSurgery();
            }, function (cancel) { });
        }





        $scope.changeStatus = function (item) {

            item.open = false;
            var CoordinatorStatusId = parseInt(item.CoordinatorStatusId) || null;
            if (CoordinatorStatusId != null) {
                item.CoordinatorStatus = $filter("filter")($scope.GetStatusList, { "Id": CoordinatorStatusId }, true)[0].Name;
            } else {
                item.CoordinatorStatus = "";
            }

            if (item.CoordinatorStatusId == 2 || item.CoordinatorStatusId == '2') {
                item.FollowupDate = "";
                item.Remarks = "";
            }
            if (item.CoordinatorStatusId == 3 || item.CoordinatorStatusId == '3') {
                item.FollowupDate = "";
                item.Remarks = "";
                item.open = true;
            }
        };
        //$scope.changeStatus = function (item) {
        //    if (item === "Accepted") {
        //        item.CoordinatorStatusId = 3;
        //        item.CoordinatorStatus = "Accepted";
        //        item.FollowupDate = "";
        //        item.Remarks = "";
        //    } else if (item === "Follow-Up") {
        //        item.CoordinatorStatusId = 2;
        //        item.CoordinatorStatus = "Follow-Up";
        //        item.FollowupDate = "";
        //        item.Remarks = "";
        //    } else if (item === "Not Accepted") {
        //        item.CoordinatorStatusId = 1;
        //        item.CoordinatorStatus = "Not Accepted";
        //        item.FollowupDate = "";
        //        item.Remarks = "";
        //    } else {
        //        item.CoordinatorStatusId = "";
        //        item.CoordinatorStatus = "";
        //        item.FollowupDate = "";
        //        item.Remarks = "";
        //    }
        //};




        $scope.openPdfFileUploads = function (url) {
            window.open(url);
        };

        $scope.medicationcordinatorclick = function (Type) {
            Type = Type || 'PreSurgery';
            $scope.mInstancecoordinationAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/cordinationviewpopup.html",
                "controller": "UScoordinationviewpopupCtrl",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "cache": function () { return angular.copy($scope.Mainobj) },
                    "Type": function () { return angular.copy(Type) },
                    "ScreenType": function () { return '' },
                    "IsComingFrom": function () { return 'Coordinator' },
                },
               // "windowClass": "newassessmentspopupuib",
                "windowClass": "modal__popup--1 bottom-to-top-modal in",
            });

            $scope.mInstancecoordinationAdd.result.then(function (resp) {
                if (resp.PreMedicationslist.length !== 0) {
                    $scope.Mainobj.MedicationsList = [];
                    $scope.Mainobj.MedicationsList = resp.PreMedicationslist || [];
                } else if (resp.PreMedicationslist.length == 0) {
                    $scope.Mainobj.MedicationsList = [];
                }

                if (resp.CurrentMedicationslist.length !== 0) {
                    $scope.Mainobj.CurrentMedicationList = [];
                    $scope.Mainobj.CurrentMedicationList = resp.CurrentMedicationslist || [];
                } else if (resp.CurrentMedicationslist.length == 0) {
                    $scope.Mainobj.CurrentMedicationList = [];
                }

                if (resp.Investigationslist.length !== 0) {
                    $scope.Mainobj.InvestigationsList = [];
                    $scope.Mainobj.InvestigationsList = resp.Investigationslist || [];
                } else if (resp.Investigationslist.length == 0) {
                    $scope.Mainobj.InvestigationsList = [];
                }
            }, function () { });
        }

        $scope.AdvancedHealth = function () {
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/Advancedhealth.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
               // "windowClass": "newassessmentspopupuib",
                "windowClass": "modal__popup--1 bottom-to-top-modal in",
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
                    $scope.closeuib = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        }

        $scope.AddUpdateAdvisedProcedures = function (type) {

            $scope.Mainobj.StatusFlag = type || 'D';
            if ($scope.Coordinatorobj.FinalOrdersList.length > 0) {
                var filtredobj = $filter("filter")($scope.Coordinatorobj.FinalOrdersList, function (item, index) { return item.CoordinatorStatusId != null }) || [];
                if (filtredobj.length > 0) {
                    $scope.Mainobj.FinalOrdersList = filtredobj;
                }
            }
            if ($scope.Mainobj.FinalOrdersList.length == 0) {
                alertify.error("Please Select Status");
                return false;
            }
            //$scope.Mainobj.CoordinatorStatusId = $scope.Mainobj.CoordinatorStatusId || '';
            //if ($scope.Mainobj.CoordinatorStatusId == '') {
            //    alertify.error("Please Select Status");
            //    return false;
            //}
            //if ($scope.Mainobj.CoordinatorStatusId == 2 || $scope.Mainobj.CoordinatorStatusId == 1) {
            //    $scope.Mainobj.FollowupDate = $scope.Mainobj.FollowupDate || '';
            //    if ($scope.Mainobj.FollowupDate == '') {
            //        alertify.error("Please Select FollowupDate");
            //        return false;
            //    }
            //}
            $scope.Mainobj.ReviewedBy = $scope.Mainobj.ReviewedBy || '';
            if ($scope.Mainobj.ReviewedBy == '') {
                alertify.error("Please Select ReviewedBy");
                return false;
            }

            $scope.Mainobj.PatientId = $scope.PatientInfo.PatientId || 0;
          


            //$scope.Mainobj.PatientEducationImageList = [];
            //$scope.Mainobj.PatientEducationVideoList = [];
            if ($scope.Coordinatorobj.VideoDetails.length>0) {
                var filtredobj = $filter("filter")($scope.Coordinatorobj.VideoDetails, function (item, index) { return item.IsChecked == true }) || [];
                if (filtredobj.length > 0) {
                    $scope.Mainobj.PatientEducationVideoList = filtredobj;
                }
            }
            if ($scope.Coordinatorobj.TempImagesArray.length > 0) {
                var filtredobj = $filter("filter")($scope.Coordinatorobj.TempImagesArray, function (item, index) { return item.IsChecked == true }) || [];
                if (filtredobj.length > 0) {
                    $scope.Mainobj.PatientEducationImageList = filtredobj;
                }
            }
            console.log(JSON.stringify($scope.Mainobj));
            // return false;
            eHnoteSurgeryService.AddUpdateAdvisedProcedures($scope.Mainobj).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.GetAdvisedProceduresListByAppointmentId();
                    setTimeout(function () {
                        $scope.GetAdvisedProceduresListByStatus();
                    }, 500);
                    //  $scope.GetOrganizationSurgery();
                    alertify.success('Submit Successfully');
                } else {
                    alertify.error('Some Error');
                }
            }, function () {

            });
        };

        $scope.ShowCoordinatorLog = function () {
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "CoordinatorLogPopup.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "size": "lg",
            });
        };
        $scope.CloseCosultPop = function () {
            $scope.mInstanceAdd.dismiss("cancel");
        };

        $scope.AfterEditSummary = function (item) {
            if (item.StatusFlag == 'C') {
                var r = alertify.confirm(
                    "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>Are you sure you want to UnSign, Yes to continue ? </h4>",
                    function () {
                        var Obj = {
                            "AppointmentId": item.AppointmentId,
                            "AdvisedProcedureId": item.AdvisedProcedureId,
                            "UserId": $scope.UserId,
                            "StatusFlag": "C"
                        };
                        eHnoteSurgeryService.AddCordinatorSignUnsignLog(Obj).then(function (resp) {
                            console.log(resp);

                            if (resp.data.Status === "Success") {
                                if (resp.data.CordinatorAdvicedlogArray.length > 0) {
                                    $scope.Mainobj.CordinatorAdvicedlogArray = resp.data.CordinatorAdvicedlogArray || [];
                                }
                                if ($scope.Mainobj.FinalOrdersList.length > 0) {
                                    if ($scope.Coordinatorobj.FinalOrdersList.length > 0) {
                                        angular.forEach($scope.Mainobj.FinalOrdersList, function (Aitem) {
                                            angular.forEach($scope.Coordinatorobj.FinalOrdersList, function (Bitem) {
                                                if (Aitem.OrderTypeId == Bitem.OrderTypeId && Aitem.OrgDescriptionId == Bitem.OrgDescriptionId) {
                                                    Bitem.AnesthesistId = Aitem.AnesthesistId;
                                                    Bitem.Doctorobj = Aitem.DoctorName || '';
                                                    Bitem.Anesthesistobj = Aitem.AnesthesistName || '';
                                                    Bitem.CoSurgeonObj = Aitem.CoSurgeonName || '';
                                                    Bitem.CoSurgeonId = Aitem.CoSurgeonId;
                                                    Bitem.CoordinatorStatusId = Aitem.CoordinatorStatusId.toString();
                                                    Bitem.CoordinatorStatus = Aitem.CoordinatorStatus;
                                                    Bitem.CordinatorAdvisedProcedureId = Aitem.CordinatorAdvisedProcedureId || null;
                                                    Bitem.CordinatorFinalOrdersListId = Aitem.CordinatorFinalOrdersListId || null;
                                                    Bitem.DateOfSurgery = Aitem.DateOfSurgery || '';
                                                    Bitem.FollowupDate = Aitem.FollowupDate || '';
                                                    Bitem.FirstFollowupDate = Aitem.FirstFollowupDate || '';
                                                    Bitem.SecondFollowupDate = Aitem.SecondFollowupDate || '';
                                                    Bitem.ThirdFollowupDate = Aitem.ThirdFollowupDate || '';
                                                    Bitem.PreAdmissionDate = Aitem.PreAdmissionDate || '';
                                                    Bitem.PreAdmissionAppointmentId = Aitem.PreAdmissionAppointmentId || null;
                                                    Bitem.PreAdmissionStatusId = Aitem.PreAdmissionStatusId || null;
                                                    Bitem.PreAdmissionStatus = Aitem.PreAdmissionStatus || '';

                                                    if (Bitem.PreAdmissionStatus == "") {
                                                        if (Bitem.PreAdmissionStatusId === 1) {
                                                            Bitem.PreAdmissionStatus = "Approved";
                                                        } else if (Bitem.PreAdmissionStatusId === 2) {
                                                            Bitem.PreAdmissionStatus = "Not Fit for Surgery";
                                                        } else {
                                                            Bitem.PreAdmissionStatus = "Postpone Surgery";
                                                        }
                                                    }

                                                    if (Bitem.FollowupDate != "") {
                                                        Bitem.FollowupDate = $filter('date')(Bitem.FollowupDate, 'M-dd-yyyy');
                                                    }
                                                    if (Bitem.FirstFollowupDate != "") {
                                                        Bitem.FirstFollowupDate = $filter('date')(Bitem.FirstFollowupDate, 'M-dd-yyyy');
                                                    }
                                                    if (Bitem.SecondFollowupDate != "") {
                                                        Bitem.SecondFollowupDate = $filter('date')(Bitem.SecondFollowupDate, 'M-dd-yyyy');
                                                    }
                                                    if (Bitem.ThirdFollowupDate != "") {
                                                        Bitem.ThirdFollowupDate = $filter('date')(Bitem.ThirdFollowupDate, 'M-dd-yyyy');
                                                    }
                                                    if (Bitem.PreAdmissionDate != "") {
                                                        Bitem.PreAdmissionDate = $filter('date')(Bitem.PreAdmissionDate, 'M-dd-yyyy');
                                                    }
                                                    if (Bitem.DateOfSurgery != "") {
                                                        Bitem.DateOfSurgery = $filter('date')(Bitem.DateOfSurgery, 'M-dd-yyyy');
                                                    }
                                                }
                                            });
                                        });
                                    }
                                }
                                item.SummaryView = false;

                            } else {
                                alertify.error(resp);
                            }

                        },
                            function (error) {
                                console.log(error);
                                alertify.error(error);
                            });
                    }, function () {

                        return false;
                    });
            } else {
                item.SummaryView = false;
                if ($scope.Mainobj.FinalOrdersList.length > 0) {
                    if ($scope.Coordinatorobj.FinalOrdersList.length > 0) {
                        angular.forEach($scope.Mainobj.FinalOrdersList, function (Aitem) {
                            angular.forEach($scope.Coordinatorobj.FinalOrdersList, function (Bitem) {
                                if (Aitem.OrderTypeId == Bitem.OrderTypeId && Aitem.OrgDescriptionId == Bitem.OrgDescriptionId) {
                                    Bitem.AnesthesistId = Aitem.AnesthesistId;
                                    Bitem.Doctorobj = Aitem.DoctorName || '';
                                    Bitem.Anesthesistobj = Aitem.AnesthesistName || '';
                                    Bitem.CoSurgeonObj = Aitem.CoSurgeonName || '';
                                    Bitem.CoSurgeonId = Aitem.CoSurgeonId;
                                    Bitem.CoordinatorStatusId = Aitem.CoordinatorStatusId.toString();
                                    Bitem.CoordinatorStatus = Aitem.CoordinatorStatus;
                                    Bitem.CordinatorAdvisedProcedureId = Aitem.CordinatorAdvisedProcedureId || null;
                                    Bitem.CordinatorFinalOrdersListId = Aitem.CordinatorFinalOrdersListId || null;
                                    Bitem.DateOfSurgery = Aitem.DateOfSurgery || '';
                                    Bitem.FollowupDate = Aitem.FollowupDate || '';
                                    Bitem.FirstFollowupDate = Aitem.FirstFollowupDate || '';
                                    Bitem.SecondFollowupDate = Aitem.SecondFollowupDate || '';
                                    Bitem.ThirdFollowupDate = Aitem.ThirdFollowupDate || '';
                                    Bitem.PreAdmissionDate = Aitem.PreAdmissionDate || '';
                                    Bitem.PreAdmissionAppointmentId = Aitem.PreAdmissionAppointmentId || null;
                                    Bitem.PreAdmissionStatusId = Aitem.PreAdmissionStatusId || null;
                                    Bitem.PreAdmissionStatus = Aitem.PreAdmissionStatus || '';

                                    if (Bitem.PreAdmissionStatus == "") {
                                        if (Bitem.PreAdmissionStatusId === 1) {
                                            Bitem.PreAdmissionStatus = "Approved";
                                        } else if (Bitem.PreAdmissionStatusId === 2) {
                                            Bitem.PreAdmissionStatus = "Not Fit for Surgery";
                                        } else {
                                            Bitem.PreAdmissionStatus = "Postpone Surgery";
                                        }
                                    }

                                    if (Bitem.FollowupDate != "") {
                                        Bitem.FollowupDate = $filter('date')(Bitem.FollowupDate, 'M-dd-yyyy');
                                    }
                                    if (Bitem.FirstFollowupDate != "") {
                                        Bitem.FirstFollowupDate = $filter('date')(Bitem.FirstFollowupDate, 'M-dd-yyyy');
                                    }
                                    if (Bitem.SecondFollowupDate != "") {
                                        Bitem.SecondFollowupDate = $filter('date')(Bitem.SecondFollowupDate, 'M-dd-yyyy');
                                    }
                                    if (Bitem.ThirdFollowupDate != "") {
                                        Bitem.ThirdFollowupDate = $filter('date')(Bitem.ThirdFollowupDate, 'M-dd-yyyy');
                                    }
                                    if (Bitem.PreAdmissionDate != "") {
                                        Bitem.PreAdmissionDate = $filter('date')(Bitem.PreAdmissionDate, 'M-dd-yyyy');
                                    }
                                    if (Bitem.DateOfSurgery != "") {
                                        Bitem.DateOfSurgery = $filter('date')(Bitem.DateOfSurgery, 'M-dd-yyyy');
                                    }
                                }
                            });
                        });
                    }
                }
            }

        }

        $scope.ChangeBillByMode = function (item, index) {

            if (item.ClaimActionObj != "") {
                $scope.Coordinatorobj.ClaimActionId = item.ClaimActionObj.BillPaymentTypeId;
                $scope.Coordinatorobj.BillTypeId = item.ClaimActionObj.BillPaymentTypeId;
            }
            if ($scope.Coordinatorobj.BillTypeId === 1) {
                $scope.Coordinatorobj.PayorObj = '';
            }
            else if ($scope.Coordinatorobj.BillTypeId === 2) {

                var filtredobj1 = $filter("filter")($scope.PatientInfo.patientInsuranceDetails, { "IdentifierId": 1 });

                if (filtredobj1.length === 0) {
                    filtredobj1 = $filter("filter")($scope.PatientInfo.patientInsuranceDetails, { "IdentifierId": 2 });
                }

                if (filtredobj1.length > 0) {
                    var filtredobj2 = $filter("filter")($scope.PatientInfo.patientInsuranceDetails, { "PayorId": filtredobj1[0].PayorId });
                    if (filtredobj2.length > 0) {
                        $scope.Coordinatorobj.PayorObj = filtredobj2[0];
                    }

                }


            }
            else if ($scope.Coordinatorobj.BillTypeId === 3) {
                var filtredobj1 = $filter("filter")($scope.PatientInfo.patientInsuranceDetails, { "IdentifierId": 2 });

                if (filtredobj1.length === 0) {
                    if ($scope.PatientInfo.patientInsuranceDetails.length > 0) {
                        filtredobj1 = $filter("filter")($scope.PatientInfo.patientInsuranceDetails, { "IdentifierId": 1 });
                        alertify.error("Patient Dosent Have Secondary Insurance,Please Select Primary or Other");
                    }
                }
                if (filtredobj1.length > 0) {

                    var filtredobj2 = $filter("filter")($scope.PatientInfo.patientInsuranceDetails, { "PayorId": filtredobj1[0].PayorId });
                    if (filtredobj2.length > 0) {
                        $scope.Coordinatorobj.PayorObj1 = filtredobj2[0];
                    }
                }
            }
        }
        $scope.EditInsurance = function (item) {
            item = item || '';
            if (item != '') {
                $rootScope.$broadcast("loadBillertoPatientINsuranceEdit", item);
            }
        };


        var SetupPopUp = '';
        $scope.SurgeryBookAppt1 = function (Type) {
            $scope.Mainobj.AdvisedProceduresId = $scope.Mainobj.AdvisedProceduresId || null;
            if ($scope.Mainobj.AdvisedProceduresId == null) {

            }

            if ($scope.Mainobj.CoordinatorStatusId == 3 && $scope.Mainobj.AdvisedProceduresId == null) {

                $scope.Mainobj.ReviewedBy = $scope.Mainobj.ReviewedBy || '';
                if ($scope.Mainobj.ReviewedBy == '') {
                    alertify.error("Please Select ReviewedBy");
                    return false;
                }

                $scope.AddUpdateAdvisedProcedures();
            }

            $scope.PageName = "book";
            $scope.Type = Type || '';
            var doctorinfo = eHnoteMasterDataService.getUserInfo();
            var clinicAddress = { "ClinicId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalID };
            var doctorID = {
                "DoctorID": doctorinfo.doctorid
            };

            if (doctorinfo.RoleID === 43 || doctorinfo.RoleID === 57) {
                eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
                eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
            }
            else if (doctorinfo.RoleID === 1 || doctorinfo.RoleID === 56) {
                eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
            } else {
                eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
            }

            //var obj = {
            //    'IsComingFrom': 'Coordinator',
            //    'IsApptType': $scope.Type,
            //    "AppointmentId": $scope.cacheStorageItem.appointmentid || 0,

            //}
            //datapersistanceFactory.set("CoordinatorScreen", obj);
            //SetupPopUp = $uibModal.open({
            //    "templateUrl": 'SurgeryApptPopupId.html',
            //    "scope": $scope,
            //    "keyboard": false,
            //    "backdrop": "static",
            //    "windowClass": "appointment-full-popup",

            //});

            $scope.ASCDatesArray = [];
            if ($scope.Mainobj.DateOfSurgery) {
                $scope.ASCDatesArray.push($scope.Mainobj.DateOfSurgery);
            }

            if ($scope.Mainobj.FirstFollowupDate) {
                $scope.ASCDatesArray.push($scope.Mainobj.FirstFollowupDate);
            }

            if ($scope.Mainobj.SecondFollowupDate) {
                $scope.ASCDatesArray.push($scope.Mainobj.SecondFollowupDate);
            }

            if ($scope.Mainobj.ThirdFollowupDate) {
                $scope.ASCDatesArray.push($scope.Mainobj.ThirdFollowupDate);
            }

            var Obj = {
                "PageName": "book",
                "AppDate": "",
                "ispatientExistsval": false,
                "calenderDate": undefined,
                "AppointmentId": null,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "DoctorId": null,
                "StartTime": null,
                "EndTime": null,
                'type': 'ASC',
                'IsComingFrom': 'Coordinator',
                'IsApptType': $scope.Type,
                "IsMultipleAppts": true,
                "ASCDatesArray": $scope.ASCDatesArray
            };
            datapersistanceFactory.set('AppointmentDetailsCache', Obj);

            BookApptPopupOpened();
        }
        $scope.SurgeryBookAppt = function (Type, item) {
            $scope.Mainobj.AdvisedProceduresId = $scope.Mainobj.AdvisedProceduresId || null;
            if ($scope.Mainobj.AdvisedProceduresId == null) {

            }

            //if (item.CoordinatorStatusId == 3 && $scope.Mainobj.AdvisedProceduresId == null) {

            //    $scope.Mainobj.ReviewedBy = $scope.Mainobj.ReviewedBy || '';
            //    if ($scope.Mainobj.ReviewedBy == '') {
            //        alertify.error("Please Select ReviewedBy");
            //        return false;
            //    }
            //    item.StatusFlag = item.StatusFlag || 'D';
            //    $scope.AddUpdateAdvisedProcedures(item.StatusFlag);
            //}

            $scope.PageName = "book";
            $scope.Type = Type || '';
            var doctorinfo = eHnoteMasterDataService.getUserInfo();
            var clinicAddress = { "ClinicId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalID };
            var doctorID = {
                "DoctorID": doctorinfo.doctorid
            };

            if (doctorinfo.RoleID === 43 || doctorinfo.RoleID === 57) {
                eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
                eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
            }
            else if (doctorinfo.RoleID === 1 || doctorinfo.RoleID === 56) {
                eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
            } else {
                eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
            }

            //var obj = {
            //    'IsComingFrom': 'Coordinator',
            //    'IsApptType': $scope.Type,
            //    "AppointmentId": $scope.cacheStorageItem.appointmentid || 0,

            //}
            //datapersistanceFactory.set("CoordinatorScreen", obj);
            //SetupPopUp = $uibModal.open({
            //    "templateUrl": 'SurgeryApptPopupId.html',
            //    "scope": $scope,
            //    "keyboard": false,
            //    "backdrop": "static",
            //    "windowClass": "appointment-full-popup",

            //});

            $scope.ASCDatesArray = [];
           
            if (item.PreAdmissionDate == "" || item.PreAdmissionDate == null) {
                let ApptTabObj = {
                    "TabName": "PreAdmission",
                    "TabId": 1
                };

                $scope.ASCDatesArray.push(ApptTabObj);
            }

            if (item.DateOfSurgery == "" || item.DateOfSurgery == null) {
                let ApptTabObj = {
                    "TabName": "ASC",
                    "TabId": 2
                };
                $scope.ASCDatesArray.push(ApptTabObj);
            }

            if (item.FirstFollowupDate == "" || item.FirstFollowupDate == null) {
                let ApptTabObj = {
                    "TabName": "Post FollowUp 1",
                    "TabId": 3
                };
                $scope.ASCDatesArray.push(ApptTabObj);
            }

            if (item.SecondFollowupDate == "" || item.SecondFollowupDate == null) {
                let ApptTabObj = {
                    "TabName": "Post FollowUp 2",
                    "TabId": 4 
                };
                $scope.ASCDatesArray.push(ApptTabObj);
            }

            if (item.ThirdFollowupDate == "" || item.ThirdFollowupDate == null) {
                let ApptTabObj = {
                    "TabName": "Post FollowUp 3",
                    "TabId": 5
                };
                $scope.ASCDatesArray.push(ApptTabObj);
            }

            //$scope.ASCDatesArray = [
            //    {
            //        "TabName": "PreAdmission",
            //        "TabId": 1
            //    },
            //    {
            //        "TabName": "ASC",
            //        "TabId": 2
            //    },
            //    {
            //        "TabName": "Post FollowUp 1",
            //        "TabId": 3
            //    },
            //    {
            //        "TabName": "Post FollowUp 2",
            //        "TabId": 4
            //    },
            //    {
            //        "TabName": "Post FollowUp 3",
            //        "TabId": 5
            //    },
            //];


            var Obj = {
                "PageName": "book",
                "AppDate": "",
                "ispatientExistsval": false,
                "calenderDate": undefined,
                "AppointmentId": null,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "DoctorId": null,
                "StartTime": null,
                "EndTime": null,
                'type': 'ASC',
                'IsComingFrom': 'Coordinator',
                'IsApptType': $scope.Type,
                "IsMultipleAppts": true,
                //"ASCDatesArray": ["2023-07-10", "2023-07-11", "2023-07-17", "2023-08-10"]
                "ASCDatesArray": $scope.ASCDatesArray
            };
            datapersistanceFactory.set('AppointmentDetailsCache', Obj);

            BookApptPopupOpened();
        }

        $scope.$on('closePopup1', function (event) {
            SetupPopUp.dismiss('cancel');
        });
        $scope.$on('successMethod1', function (event, data) {
            console.log(data);

            if ($scope.Type == 'PreAdmission') {
                $scope.Mainobj.PreAdmissionDate = data.response.ConsultationDt;
                $scope.Mainobj.PreAdmissionAppointmentId = data.response.AppointmentID;
            }
            if ($scope.Type == 'DateOfSurgery') {
                $scope.Mainobj.DateOfSurgery = data.response.ConsultationDt;
            }
            $scope.AddUpdateAdvisedProcedures();
            SetupPopUp.dismiss('cancel');

        });

        $scope.GetOrganizationProcedures = function (val) {
            var obj = {
                "OrganizationId": $scope.HospitalId,
                "ProcedureId": 0,
                "CPTCODE": "",
                "SearchText": val || "",
                "TypeOfServiceId": 0,
                "PageNumber": 1,
                "PageSize": 10,
                "GetAllIndicator": 0,
                "ParentOrganizationId": $scope.ParenthospitalId,
                "IsFrequent": "N",
                "Status": 0
            };
            if (val == "") {
                obj.IsFrequent = "Y"
            }
            return eHnoteSettingsDataService.GetOrganizationProcedures(obj).then(function (response) {
                if (response.data.Status == "Success") {
                    if (response.data.rows.length !== 0) {
                        return response.data.rows.map(function (item) {
                            return item;
                        });

                    }
                }
            });
        };


        $scope.ViewAdvisorpopup = function () {
            var type = 'Surgery';
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/Coordinatoradvisorpopup.html",
                // "controller": "advisorpopupCtrl",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "newassessmentspopupuib ",
                //"size": "lg",
                "resolve": {
                    "FinalObj": function () { return type; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteSettingsDataService, eHnotePatientPVService, FinalObj, eHnoteSurgeryService) {


                    $scope.GetOrganName = function () {
                        return [{
                            "OrganId": 1,
                            "OrganName": "OD"
                        },
                        {
                            "OrganId": 2,
                            "OrganName": "OS"
                        },
                        {
                            "OrganId": 3,
                            "OrganName": "OU"
                        }
                        ];
                    };
                    $scope.GetOrganNameList = angular.copy($scope.GetOrganName());
                    $scope.Orderobj = {
                        "SearchProcedureObj": "",
                        "DiagnosisObject": "",
                        /*"Type": "Surgery",*/
                        "Type": FinalObj,
                        "InvestigationsDetails": [],
                        "SurgeriesDetails": [],
                        "ProceduresDetails": [],

                    }

                    $scope.GetDiagnosisList = function (val) {
                        var object = {
                            "LevelType": 'O',
                            "HospitalId": $scope.HospitalId,
                            "UserId": $scope.UserId,
                            "SpecializationId": $scope.SpecializationId,
                            "SearchText": val,
                            "PageSize": 10,
                            "PageNumber": 1,
                            "Type": '',
                            "IsFrequent": 'N',
                            "ParentOrganizationId": $scope.ParenthospitalId || null,
                        };

                        if (val == '') {
                            object.IsFrequent = 'Y';
                        }
                        return eHnoteSettingsDataService.GetMasterDiagnosis(object).then(function (response) {
                            if (response.data.count !== 0) {
                                if (response.data.DiagnosisList !== undefined) {

                                    return response.data.DiagnosisList.map(function (item) {
                                        return item;
                                    });
                                }
                            }
                        });

                    };
                    $scope.GetOrganizationCPTProcedure = function (val) {
                        var obj = {
                            "OrganizationId": $scope.HospitalId,
                            "ProcedureId": 0,
                            "CPTCODE": "",
                            "SearchText": val || "",
                            "TypeOfServiceId": 0,
                            "PageNumber": 1,
                            "PageSize": 10,
                            "GetAllIndicator": 0,
                            "ParentOrganizationId": $scope.ParenthospitalId,
                            "IsFrequent": "N",
                            "Status": 0
                        };
                        if (val == "") {
                            obj.IsFrequent = "Y"
                        }
                        return eHnoteSettingsDataService.GetOrganizationProcedures(obj).then(function (response) {
                            if (response.data.Status == "Success") {
                                if (response.data.rows.length !== 0) {
                                    return response.data.rows.map(function (item) {
                                        return item;
                                    });

                                }
                            }
                        });
                    };

                    $scope.onSelectAssesmentPlannewDiagnosis = function (mainobject, Diagnosisitem) {

                        if (Diagnosisitem.DiagnosisList.length > 0) {
                            var filterdiagnosis = $filter("filter")(Diagnosisitem.DiagnosisList, function (Aitem, index) { return Aitem.DiagnosisId == mainobject.DiagnosisId },);
                            if (filterdiagnosis.length > 0) {
                                mainobject = "";
                                $scope.Orderobj.DiagnosisObject = "";
                                alertify.error("Diagnosis Already Added");
                                return false;
                            }
                        }



                        var obj = {
                            "ActiveInd": "Y",
                            "DiagnosisDetailId": mainobject.DiagnosisId || 0,
                            "DiagnosisId": mainobject.DiagnosisId,
                            "DiagnosisName": mainobject.DiagnosisName,
                            "ICDCode": mainobject.ICD10CODE
                        }

                        Diagnosisitem.DiagnosisList.push(obj);
                        $scope.Orderobj.DiagnosisObject = "";
                    };
                    $scope.OnClickAdvisedProcedure = function (mainitem, Type) {

                        if (Type == 'Investigations') {
                            $scope.Coordinatorobj.InvestigationsArray = $scope.Coordinatorobj.InvestigationsArray || [];
                            if ($scope.Orderobj.InvestigationsDetails.length > 0) {
                                var filterProcedure = $filter("filter")($scope.Orderobj.InvestigationsDetails, function (Aitem, index) { return Aitem.OrgDescriptionId == mainitem.OrganizationProcedureId },);
                                if (filterProcedure.length > 0) {
                                    $scope.Orderobj.SearchProcedureObj = "";
                                    alertify.error("Investigation Already Added");
                                    return false;
                                }
                            }

                            if ($scope.Coordinatorobj.InvestigationsArray.length > 0) {
                                var filterProcedure = $filter("filter")($scope.Coordinatorobj.InvestigationsArray, function (Aitem, index) { return Aitem.OrgDescriptionId == mainitem.OrganizationProcedureId },);
                                if (filterProcedure.length > 0) {
                                    $scope.Orderobj.SearchProcedureObj = "";
                                    alertify.error("Investigation Already Added");
                                    return false;
                                }
                            }
                            if ($scope.Orderobj.InvestigationsDetails.length !== 0) {
                                angular.forEach($scope.Orderobj.InvestigationsDetails, function (item) {
                                    item.IsEditData = false;
                                });
                            }
                            var object = {
                                "PatientOrderId": 0,
                                /* "SpecializationId": 0,*/
                                "SpecializationId": 3,
                                "DescriptionId": mainitem.ProcedureId || "",
                                "Description": mainitem.ProcedureName || "",
                                "ProcedureCode": mainitem.ProcedureCode || 0,
                                "OrgDescriptionId": mainitem.OrganizationProcedureId || 0,
                                "Remarks": "",
                                "OrganId": null,
                                "OrderTypeId": 1,
                                "OrderType": "Investigations",
                                "OrganName": "",
                                "BillingCode": "",
                                "BookingStatusId": "2",
                                "CPTCode": mainitem.CPTCode,
                                "StatusId": "1",
                                "DeleteInd": "N",
                                "InvSpecialityId": "",
                                "PatientSurgeryId": 0,
                                "SurgeryListId": 0,
                                "IsEditData": true,
                                "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                                "DurationType": mainitem.DurationType || "D",
                                "CoordinatorId": mainitem.CoordinatorId || 0,
                                "ExternalCoManagerId": mainitem.ExternalCoManagerId || 0,
                                "InternalCoManagerId": mainitem.InternalCoManagerId || 0,
                                "ShowDateFormat": false,
                                "Duration": '',
                                "DurationType": 'D',
                                "DurationDate": '',
                                "DiagnosisList": [],

                            }

                            $scope.Orderobj.InvestigationsDetails.push(object);
                            $scope.Orderobj.SearchProcedureObj = '';
                        }
                        if (Type == 'Surgery') {
                            $scope.Coordinatorobj.SurgeryArray = $scope.Coordinatorobj.SurgeryArray || [];
                            if ($scope.Coordinatorobj.SurgeryArray.length > 0) {
                                if ($scope.Orderobj.SurgeriesDetails.length > 0) {
                                    var filterProcedure = $filter("filter")($scope.Orderobj.SurgeriesDetails, function (Aitem, index) { return Aitem.OrgDescriptionId == mainitem.OrganizationProcedureId },);
                                    if (filterProcedure.length > 0) {
                                        $scope.Orderobj.SearchProcedureObj = "";
                                        alertify.error("Surgery Already Added");
                                        return false;
                                    }
                                }
                                var filterProcedure = $filter("filter")($scope.Coordinatorobj.SurgeryArray, function (Aitem, index) { return Aitem.OrgDescriptionId == mainitem.OrganizationProcedureId },);
                                if (filterProcedure.length > 0) {
                                    $scope.Orderobj.SearchProcedureObj = "";
                                    alertify.error("Surgery Already Added");
                                    return false;
                                }
                            }

                            if ($scope.Orderobj.SurgeriesDetails.length !== 0) {
                                angular.forEach($scope.Orderobj.SurgeriesDetails, function (item) {
                                    item.IsEditData = false;
                                });
                            }
                            var object = {
                                "PatientOrderId": 0,
                                "SpecializationId": 3,
                                "DescriptionId": mainitem.ProcedureId || "",
                                "Description": mainitem.ProcedureName || "",
                                "ProcedureCode": mainitem.ProcedureCode || 0,
                                "OrgDescriptionId": mainitem.OrganizationProcedureId || 0,
                                "Remarks": "",
                                "OrganId": null,
                                "OrderTypeId": 3,
                                "OrderType": "Surgery",
                                "OrganName": "",
                                "BillingCode": "",
                                "BookingStatusId": "2",
                                "CPTCode": mainitem.CPTCode,
                                "StatusId": "1",
                                "DeleteInd": "N",
                                "InvSpecialityId": "",
                                "PatientSurgeryId": 0,
                                "SurgeryListId": 0,
                                "IsEditData": true,
                                "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                                "DurationType": mainitem.DurationType || "D",
                                "CoordinatorId": mainitem.CoordinatorId || 0,
                                "ExternalCoManagerId": mainitem.ExternalCoManagerId || 0,
                                "InternalCoManagerId": mainitem.InternalCoManagerId || 0,
                                "ShowDateFormat": false,
                                "Duration": '',
                                "DurationType": 'D',
                                "DurationDate": '',
                                "DiagnosisList": [],
                                "UserId": $scope.UserId

                            }

                            $scope.Orderobj.SurgeriesDetails.push(object);
                            $scope.Orderobj.SearchProcedureObj = '';
                        }
                        if (Type == 'Procedures') {
                            $scope.Coordinatorobj.ProceduresArray = $scope.Coordinatorobj.ProceduresArray || [];
                            if ($scope.Orderobj.ProceduresDetails.length > 0) {
                                var filterProcedure = $filter("filter")($scope.Orderobj.ProceduresDetails, function (Aitem, index) { return Aitem.OrgDescriptionId == mainitem.OrganizationProcedureId },);
                                if (filterProcedure.length > 0) {
                                    $scope.Orderobj.SearchProcedureObj = "";
                                    alertify.error("Procedure Already Added");
                                    return false;
                                }
                            }
                            if ($scope.Coordinatorobj.ProceduresArray.length > 0) {
                                var filterProcedure = $filter("filter")($scope.Coordinatorobj.ProceduresArray, function (Aitem, index) { return Aitem.OrgDescriptionId == mainitem.OrganizationProcedureId },);
                                if (filterProcedure.length > 0) {
                                    $scope.Orderobj.SearchProcedureObj = "";
                                    alertify.error("Procedure Already Added");
                                    return false;
                                }
                            }
                            if ($scope.Orderobj.ProceduresDetails.length !== 0) {
                                angular.forEach($scope.Orderobj.ProceduresDetails, function (item) {
                                    item.IsEditData = false;
                                });
                            }
                            var object = {
                                "PatientOrderId": 0,
                                "SpecializationId": 3,
                                "DescriptionId": mainitem.ProcedureId || "",
                                "Description": mainitem.ProcedureName || "",
                                "ProcedureCode": mainitem.ProcedureCode || 0,
                                "OrgDescriptionId": mainitem.OrganizationProcedureId || 0,
                                "Remarks": "",
                                "OrganId": null,
                                "OrderTypeId": 2,
                                "OrderType": "Procedure",
                                "OrganName": "",
                                "BillingCode": "",
                                "BookingStatusId": "2",
                                "CPTCode": mainitem.CPTCode,
                                "StatusId": "1",
                                "DeleteInd": "N",
                                "InvSpecialityId": "",
                                "PatientSurgeryId": 0,
                                "SurgeryListId": 0,
                                "IsEditData": true,
                                "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                                "DurationType": mainitem.DurationType || "D",
                                "CoordinatorId": mainitem.CoordinatorId || 0,
                                "ExternalCoManagerId": mainitem.ExternalCoManagerId || 0,
                                "InternalCoManagerId": mainitem.InternalCoManagerId || 0,
                                "ShowDateFormat": false,
                                "Duration": '',
                                "DurationType": 'D',
                                "DurationDate": '',
                                "DiagnosisList": [],

                            }

                            $scope.Orderobj.ProceduresDetails.push(object);
                            $scope.Orderobj.SearchProcedureObj = '';
                        }







                    };

                    $scope.closeuib = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                    $scope.ChangeAdvisedOrder = function (mainitem, Type) {
                        if (Type == 'Surgery') {
                            angular.forEach($scope.Orderobj.SurgeriesDetails, function (item) {
                                item.IsEditData = false;
                            })
                            mainitem.IsEditData = true;
                        }
                        if (Type == 'Procedure') {
                            angular.forEach($scope.Orderobj.ProceduresDetails, function (item) {
                                item.IsEditData = false;
                            })
                            mainitem.IsEditData = true;
                        }
                        if (Type == 'Investigation') {
                            angular.forEach($scope.Orderobj.InvestigationsDetails, function (item) {
                                item.IsEditData = false;
                            })
                            mainitem.IsEditData = true;
                        }


                    }

                    $scope.SaveOrderssData = function () {
                        var InvestigationsDetails = $filter("filter")($scope.Orderobj.InvestigationsDetails, { "DeleteInd": "N" }, true);
                        var SurgeriesDetails = $filter("filter")($scope.Orderobj.SurgeriesDetails, { "DeleteInd": "N" }, true);
                        var ProceduresDetails = $filter("filter")($scope.Orderobj.ProceduresDetails, { "DeleteInd": "N" }, true);

                        if (SurgeriesDetails.length > 0) {
                            var List1 = 0;
                            var List11 = 0;
                            angular.forEach(SurgeriesDetails, function (sitem) {
                                sitem.OrganId = sitem.OrganId || null;
                                if (sitem.OrganId == null) {
                                    List1++;
                                } else if (sitem.Duration == "" && sitem.DurationDate == "") {
                                    List11++;
                                }
                            });
                            if (List1 != 0) {
                                alertify.error("Please Select Organ");
                                return false;
                            } else if (List11 != 0) {
                                alertify.error("Please Select Schedule");
                                return false;
                            }
                        }

                        if (InvestigationsDetails.length > 0) {
                            var List2 = 0;
                            var List22 = 0;
                            angular.forEach(InvestigationsDetails, function (Iitem) {
                                Iitem.OrganId = Iitem.OrganId || null;
                                if (Iitem.OrganId == null) {
                                    List2++;
                                } else if (Iitem.Duration == "" && Iitem.DurationDate == "") {
                                    List22++;
                                }
                            });
                            if (List2 != 0) {
                                alertify.error("Please Select Organ");
                                return false;
                            } else if (List22 != 0) {
                                alertify.error("Please Select Schedule");
                                return false;
                            }
                        }

                        if (ProceduresDetails.length > 0) {
                            var List3 = 0;
                            var List33 = 0;
                            angular.forEach(ProceduresDetails, function (Pitem) {
                                Pitem.OrganId = Pitem.OrganId || null;
                                if (Pitem.OrganId == null) {
                                    List3++;

                                }
                                else if (Pitem.Duration == "" && Pitem.DurationDate == "") {
                                    List33++;
                                }
                            });
                            if (List3 != 0) {
                                alertify.error("Please Select Organ");
                                return false;
                            } else if (List33 != 0) {
                                alertify.error("Please Select Schedule");
                                return false;
                            }
                        }

                        if (InvestigationsDetails.length == 0 && SurgeriesDetails.length == 0 && ProceduresDetails.length == 0) {
                            alertify.error("Please Select any Surgeries,Procedures or Investigations");
                            return false;
                        }
                        var obj = {
                            "AppointmentId": $scope.cacheStorageItem.appointmentid || 0,
                            "PatientId": $scope.cacheStorageItem.PatientID || 0,
                            "HospitalId": $scope.HospitalId,
                            "UserId": $scope.UserId,
                            "InvestigationsDetails": $scope.Orderobj.InvestigationsDetails || [],
                            "SurgeriesDetails": $scope.Orderobj.SurgeriesDetails || [],
                            "ProceduresDetails": $scope.Orderobj.ProceduresDetails || [],

                        }
                        // console.log(JSON.stringify(obj));
                        eHnoteSurgeryService.AddUpdateCordinatorOrderDetails(obj).then(function (resp) {
                            if (resp.data.Status == "Success") {
                                $uibModalInstance.close("cancel");
                                $scope.GetAdvisedProceduresListByAppointmentId();
                            }



                        });
                    }

                    $scope.RemoveProcedure = function (item, index, type) {
                        if (type == "Investigations") {
                            $scope.Orderobj.InvestigationsDetails.splice(index, 1);
                            if ($scope.Orderobj.InvestigationsDetails.length !== 0) {
                                angular.forEach($scope.Orderobj.InvestigationsDetails, function (item) {
                                    item.IsEditData = false;
                                });
                                $scope.Orderobj.InvestigationsDetails[0].IsEditData = true;
                            }
                        }

                        if (type == "Surgery") {
                            $scope.Orderobj.SurgeriesDetails.splice(index, 1);
                            if ($scope.Orderobj.SurgeriesDetails.length !== 0) {
                                angular.forEach($scope.Orderobj.SurgeriesDetails, function (item) {
                                    item.IsEditData = false;
                                });
                                $scope.Orderobj.SurgeriesDetails[0].IsEditData = true;
                            }
                        }

                        if (type == "Procedures") {
                            $scope.Orderobj.ProceduresDetails.splice(index, 1);
                            if ($scope.Orderobj.ProceduresDetails.length !== 0) {
                                angular.forEach($scope.Orderobj.ProceduresDetails, function (item) {
                                    item.IsEditData = false;
                                });
                                $scope.Orderobj.ProceduresDetails[0].IsEditData = true;
                            }
                        }
                    }

                    $scope.ChangeProcedureList = function () {
                        $scope.ProcedureListFocus = false;
                    }

                }
            });
            $scope.mInstanceAdd.result.then(function (resp) {
                $scope.GetAdvisedProceduresListByAppointmentId();

            }, function (cancel) {
            });
        }

        $scope.SearchDOClist = function (val) {
            $scope.FilterclinicDoctorList = angular.copy($scope.clinicDoctorList);
            val = val || "";
            if (val !== null) {
                $scope.FilterclinicDoctorList = $filter("filter")($scope.FilterclinicDoctorList, { "FullName": val });
                return $scope.FilterclinicDoctorList.map(function (item) {
                    return item;

                });
            }
        }


        $scope.SearchAdditionalDOClist = function (val) {
            $scope.FilterclinicDoctorList = angular.copy($scope.clinicDoctorList);
            val = val || "";
            if (val !== null) {
                $scope.FilterclinicDoctorList = $filter("filter")($scope.FilterclinicDoctorList, { "FullName": val });
                return $scope.FilterclinicDoctorList.map(function (item) {
                    return item;

                });
            }
        }

        $scope.SearchNurselist = function (val) {
            $scope.AllNursesList1 = angular.copy($scope.AllNursesList);
            val = val || "";
            if (val !== null) {
                $scope.AllNursesList1 = $filter("filter")($scope.AllNursesList1, { "FullName": val });
                return $scope.AllNursesList1.map(function (item) {
                    return item;

                });
            }
        }

        $scope.SearchAnesthetistlist = function (val) {
            $scope.AllAnesthesistsList1 = angular.copy($scope.AllAnesthesistsList);
            val = val || "";
            if (val !== null) {
                $scope.AllAnesthesistsList1 = $filter("filter")($scope.AllAnesthesistsList1, { "FullName": val });
                return $scope.AllAnesthesistsList1.map(function (item) {
                    return item;

                });
            }
        }
        $scope.OnSelectDoctor = function (obj, item) {
            // $scope.Mainobj.DoctorId = obj.DoctorID;
            item.DoctorId = obj.DoctorID;
        }
        $scope.OnSelectAdditionalDoctor = function (obj, item) {
            //    $scope.Mainobj.CoSurgeonId = obj.DoctorID;
            item.CoSurgeonId = obj.DoctorID;
        }
        $scope.OnSelectNurse = function (obj, item) {
            //  $scope.Mainobj.NurseId = obj.DoctorID;
            item.NurseId = obj.DoctorID;
        }
        $scope.OnSelectAnesthetist = function (obj, item) {
            // $scope.Mainobj.AnesthesistId = obj.DoctorID;
            item.AnesthesistId = obj.DoctorID;
        }

        $scope.Changetab = function (Type) {
            $scope.Coordinatorobj.Type = Type;
            if (Type == "Surgery") {
                if ($scope.Coordinatorobj.SurgeryArray.length !== 0) {
                    var Surgeryitem = $scope.Coordinatorobj.SurgeryArray[0];
                    $scope.SeletedItem(Surgeryitem, Type);
                } else {
                    $scope.Mainobj.IsEditData = false;
                }

            }
            if (Type == "Investigations") {
                if ($scope.Coordinatorobj.InvestigationsArray.length !== 0) {
                    var Investigationitem = $scope.Coordinatorobj.InvestigationsArray[0];
                    $scope.SeletedItem(Investigationitem, Type);
                } else {
                    $scope.Mainobj.IsEditData = false;
                }
            }
            if (Type == "Procedures") {
                if ($scope.Coordinatorobj.ProceduresArray.length !== 0) {
                    var Procedureitem = $scope.Coordinatorobj.ProceduresArray[0];
                    $scope.SeletedItem(Procedureitem, Type);
                } else {
                    $scope.Mainobj.IsEditData = false;
                }
            }
        }

        $scope.RemoveSurgeryItem = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
                var obj = {
                    "PatientOrderId": item.PatientOrderId,
                    "AppointmentId": $scope.cacheStorageItem.appointmentid || 0,
                    "PatientId": $scope.cacheStorageItem.PatientID || 0,
                    "HospitalId": $scope.HospitalId,
                    "UserId": $scope.UserId,
                    "DescriptionId": item.DescriptionId,
                    "OrgDescriptionId": item.OrgDescriptionId,
                    "OrderTypeId": item.OrderTypeId,
                    "OrderType": item.OrderType,
                    "DeleteInd": "Y"
                }
                if (item.OrderTypeId == 1) {
                    obj.PatientInvestigationId = item.PatientInvestigationId || 0;
                }
                if (item.OrderTypeId == 2) {
                    obj.PatientProcedureId = item.PatientProcedureId || 0;
                }
                if (item.OrderTypeId == 3) {
                    obj.PatientSurgeryId = item.PatientSurgeryId || 0;
                }
                eHnoteSurgeryService.RemoveAdvisedProcedures(obj).then(function (resp) {
                    if (resp.data.Status === "Success") {
                        alertify.success(' Deleted Successfully');
                        $scope.GetAdvisedProceduresListByAppointmentId();
                    } else {
                        alertify.error("Some Error Occur");
                    }
                });
            });
        }

        $scope.CalendarAdmissionFocus = false;
        $scope.CalendarInd = function (item) {
            if (item != '') {
                $scope.CalendarAdmissionFocus = !$scope.CalendarAdmissionFocus;
            }
        }

        $scope.CalendarSurgeryFocus = false;
        $scope.CalendarSurgeryInd = function (item) {
            if (item != '') {
                $scope.CalendarSurgeryFocus = !$scope.CalendarSurgeryFocus;
            }
        }

        $scope.CalendarPost1DayFocus = false;
        $scope.CalendarPost1DayInd = function (item) {
            if (item != '') {
                $scope.CalendarPost1DayFocus = !$scope.CalendarPost1DayFocus;
            }
        }

        $scope.CalendarPost1WeekFocus = false;
        $scope.CalendarPost1WeekInd = function (item) {
            if (item != '') {
                $scope.CalendarPost1WeekFocus = !$scope.CalendarPost1WeekFocus;
            }
        }

        $scope.CalendarPost1MonthFocus = false;
        $scope.CalendarPost1MonthInd = function (item) {
            if (item != '') {
                $scope.CalendarPost1MonthFocus = !$scope.CalendarPost1MonthFocus;
            }
        }




        $scope.CordinatePrint = function (item, titem) {
            var obj = {
                "BillingType": "Billing Items",
                "PrintedDatenTime": "",
                "CordinatePrintInformation": item,
                "PatientName": titem.FullName,
                "PatientDisplayId": titem.DisplayId,
                "Gender": titem.Gender,
                "Age": titem.Age,
                "MobileNo": titem.MobileNo,
            }

            var printDate = $filter("date")(new Date(), "MMM-dd-yyyy");
            var printTime = moment(new Date()).format("HH:mm");
            var printDatemTime = printDate + '  ' + printTime;
            obj.PrintedDatenTime = printDatemTime;
            USPrintService.GenerateCordinatePrint(obj);

        }

        $scope.ChangeItem = function (item) {
            item.ShowDateFormat = !item.ShowDateFormat;
        }

        $scope.changePrice = function () {
            $scope.Mainobj.BillItemList = $scope.Mainobj.BillItemList || [];
            $scope.Mainobj.TotalAmount = null;
            $scope.Mainobj.TotalChargeAmount = null;
            if ($scope.Mainobj.BillItemList.length > 0) {
                angular.forEach($scope.Mainobj.BillItemList, function (item) {
                    var Quantity = 0;
                    var Price = 0; Quantity = item.Units;
                    Price = item.PatientCoPay;
                    if (Quantity > 0 && Price > 0) {
                        /*$scope.hghgh = Quantity * Price;*/
                        item.Total = Quantity * Price;
                    } else {
                        item.Total = 0;
                    }
                    item.PatientCoPay = parseInt(item.PatientCoPay);
                    if (item.PatientCoPay != 0) {
                        $scope.Mainobj.TotalAmount += item.Total;
                        $scope.Mainobj.TotalChargeAmount += item.Total;
                    }
                    if (item.PatientCoPay == null || item.Units == null) {
                        $scope.Mainobj.TotalChargeAmount = '';
                    }
                });
            }
        }

        $scope.CalendarFollowUpDateFocus = false;
        $scope.CalendarFollowUpDate = function (item) {
            if (item != '') {
                $scope.CalendarFollowUpDateFocus = !$scope.CalendarFollowUpDateFocus;
            }
        }

        $scope.Coordinatorsend = function () {

            var params = {
                "AppointmentId": $scope.cacheStorageItem.appointmentid || 0,
            };

            $scope.IsShowCheckinDeatilsInd = false;
            eHnoteMainAppointmentService.GetLatestTrackerStatusById(params).then(function (resp) {
                if (resp.data.Status === 'Success') {
                    if (resp.data.rows.length > 0) {
                        var DynamicStatusarray = resp.data.rows[0];

                        if (userLoginDetails.RoleID == 18 && DynamicStatusarray.RoomTypeId == 4) {
                            $scope.DynamicStatusInstanceAdd = $uibModal.open({
                                templateUrl: "sendToPatientTemplate.html",
                                /*"size": "lg",*/
                                "windowClass": "modal__ninety--",
                                "resolve": {
                                    "HospitalId": function () { return $scope.HospitalId; },
                                    "subSplArray": function () { return $scope.allSubSpecializationsArray; },
                                    "allUserList": function () { return $scope.allUserList; },
                                    /*"DoctorFullName": function () { return item.DoctorFullName; },*/
                                    "AppointmentDoctorID": function () { return doctorinfo.doctorid; },
                                    "appointmentid": function () { return $scope.cacheStorageItem.appointmentid; },
                                    "patientid": function () { return $scope.cacheStorageItem.PatientID; },
                                    "Currentstatus": function () { return DynamicStatusarray.Status; },
                                    "roleId": function () { return $scope.userLoginDetails.RoleID; },
                                    /*"VisitTyepId": function () { return item.AppointmentTypeId; },*/
                                    "PreviousRoomTypeId": function () { return DynamicStatusarray.RoomTypeId; },
                                    "HospitalEquipmentList": function () { return $scope.HospitalEquipmentList; },
                                    "ProfileStatusMasterId": function () { return $scope.cacheStorageItem.ProfileStatusMasterId; },
                                },
                                "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteMainAdminServices, HospitalId, allUserList, subSplArray, appointmentid, patientid, roleId, AppointmentDoctorID, Currentstatus, PreviousRoomTypeId, HospitalEquipmentList, ProfileStatusMasterId) {
                                    $scope.RoleId = roleId;
                                    $scope.HospitalId = HospitalId;
                                    /*$scope.DoctorFullName = DoctorFullName;*/
                                    $scope.AppointmentDoctorID = AppointmentDoctorID;
                                    $scope.allUserList = allUserList;
                                    $scope.allSubSpecializationsArray = subSplArray;
                                    $scope.appointmentid = appointmentid;
                                    $scope.patientid = patientid;
                                    $scope.Currentstatus = Currentstatus;
                                    /*$scope.VisitTyepId = VisitTyepId;*/
                                    $scope.PreviousRoomTypeId = PreviousRoomTypeId;
                                    $scope.IsShowCheckinDeatilsInd = true;
                                    $scope.HospitalEquipmentList = HospitalEquipmentList || [];
                                    $scope.ProfileStatusMasterId = ProfileStatusMasterId;

                                    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                                    let selectedPatientTagList = angular.copy(appointmentinfo.PatientTagList) || [];
                                    $scope.SelectedPatientTagList = angular.copy($scope.HospitalEquipmentList) || [];

                                    angular.forEach(selectedPatientTagList, function (item) {
                                        angular.forEach($scope.SelectedPatientTagList, function (kitem) {
                                            if (kitem.HospitalEquipmentId === item.HospitalEquipmentId) {
                                                kitem.IsChecked = true;
                                            }
                                        });
                                    });
                                    $scope.TagPatientObj = {
                                        "SelectTag": "Select Tag Patient",
                                        "PatientTag": "",
                                        "AllPatientTagsCheck": false,
                                    };
                                    $scope.PatientTagToggle = function (item) {
                                        var checkedArray = _.where($scope.SelectedPatientTagList, { IsChecked: true });
                                        $scope.TagPatientObj.AllPatientTagsCheck = checkedArray.length > 0 && $scope.SelectedPatientTagList.length === checkedArray.length ? true : false;
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
                                    $scope.stopClosingDropDown = function (event) {
                                        event.stopPropagation();
                                    }
                                    $scope.ApptObj = {
                                        "VisitTypeId": appointmentinfo.VisitTypeId || 0,
                                        "VisitReasonName": appointmentinfo.VisitReason,
                                        "ConfirmationStatusId": appointmentinfo.ConfirmationStatusId || null,
                                    };

                                    $scope.RoomType = {
                                        "IsSelectedCheckout": false
                                    };
                                    // $scope.searchfilterforRoom = searchfilterforRoom;
                                    if ($scope.allUserList.length !== 0) {
                                        $scope.clinicDoctorList = [];
                                        $scope.Calendardoctorlist1 = [];
                                        $scope.MultiselectDoctorlist = [];

                                        //var RoleID = $scope.userLoginDetails.RoleID;
                                        $scope.AllCounsollerList = angular.copy($scope.allUserList);

                                        $scope.AllTechnicianList = angular.copy($scope.allUserList);

                                        $scope.AllDoctorList = angular.copy($scope.allUserList);

                                        $scope.AllBillingList = angular.copy($scope.allUserList);
                                        $scope.AllReceptionList = angular.copy($scope.allUserList);
                                        $scope.AllOpthaList = angular.copy($scope.allUserList);

                                        $scope.AllDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
                                        $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                                            /*return item.RoleId === 1 || item.RoleId === 43;*/
                                            return (item.RoleId === 1 && item.SuffixId === 10) || (item.RoleId === 43 && item.SuffixId === 10);
                                        });

                                        $scope.AllCounsollerList = _.uniq($scope.AllCounsollerList, false, function (p) { return p.DoctorID; });
                                        $scope.AllCounsollerList = $filter("filter")($scope.AllCounsollerList, function (item) {
                                            return item.RoleId === 18;
                                        });

                                        $scope.AllTechnicianList = _.uniq($scope.AllTechnicianList, false, function (p) { return p.DoctorID; });
                                        $scope.AllTechnicianList = $filter("filter")($scope.AllTechnicianList, function (item) {
                                            return item.RoleId === 10 || item.RoleId === 38 || item.RoleId === 55;
                                        });

                                        $scope.AllBillingList = _.uniq($scope.AllBillingList, false, function (p) { return p.DoctorID; });
                                        $scope.AllBillingList = $filter("filter")($scope.AllBillingList, function (item) {
                                            return item.RoleId === 2 || item.RoleId === 19;
                                        });

                                        $scope.AllReceptionList = _.uniq($scope.AllReceptionList, false, function (p) { return p.DoctorID; });
                                        $scope.AllReceptionList = $filter("filter")($scope.AllReceptionList, function (item) {
                                            return item.RoleId === 2;
                                        });

                                        $scope.AllOpthaList = _.uniq($scope.AllOpthaList, false, function (p) { return p.DoctorID; });
                                        $scope.AllOpthaList = $filter("filter")($scope.AllOpthaList, function (item) {
                                            return (item.RoleId === 1 && item.SuffixId === 13) || (item.RoleId === 43 && item.SuffixId === 13);
                                        });

                                    }
                                    $scope.searchfilterforRoom = {
                                        "txt1": "",
                                        "txt2": "",
                                        "txt3": "",
                                        "txt4": "",
                                        "txt5": "",
                                        "txt8": "",
                                        "txt9": ""
                                    };
                                    $scope.popup_value = 1;
                                    eHnoteMainAdminServices.GetAllWaitingRoomType().then(function (resp) {
                                        $scope.RoomTypeList = resp.data;
                                        $scope.RoomTypeList = $filter("filter")(resp.data, function (item, index) { return item.Id !== 6 && item.Id !== 5 && item.Id !== 3 && item.Id !== 8 });


                                    }, function (err) {
                                        console.log(err);
                                        alertify.error("Getting  Failed");
                                    });
                                    $scope.switchtonexttab = function (val) {
                                        $scope.popup_value = val;
                                    };

                                    $scope.GetVisitReasonfunction = function (val) {
                                        var getParams = {
                                            "OrganizationId": $scope.HospitalId,
                                            "ReasonTypeId": 1,
                                            "SearchText": val || "",
                                            "VisitTypeId": $scope.AppointmentTypeId || null
                                        };
                                        eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(getParams).then(function (resp) {
                                            if (resp.data !== undefined) {
                                                if (resp.data.rows.length > 0) {
                                                    $scope.GetVisitReasonsArray = [];
                                                    $scope.GetVisitReasonsArray = $filter("filter")(resp.data.rows, function (kitem) {
                                                        return kitem.ActiveIND == "Y";
                                                    });
                                                }

                                            }
                                        });
                                    }
                                    $scope.GetVisitReasonfunction();

                                    $scope.RoomSearchObj = {
                                        "RoomTypeId": 0,
                                        "RoomId": 0,
                                        "RoomTypeobj": "",
                                        "NewApptStartTime": "",
                                        "NewApptEndTime": "",
                                        "otherDocInd": "N",
                                        "Opthamobj": "",
                                        "OptomId": null,
                                        "Technicianobj": "",
                                        "TechnicianId": null,
                                        "Counsellorobj": "",
                                        "CounsellorId": null,
                                        "DilationAssistantobj": "",
                                        "DilationAssistantId": null,
                                        "DoctorId": null,
                                        "sendtoDoctorRoleId": null,
                                        "Roomobj": "",
                                        "SelectDoctor": "",
                                        "sendtoDoctorId": "",
                                        "otherDocInd": false,
                                        "SubSpecialityObj": "",
                                        "SubSpecialityId": "",

                                    }

                                    $scope.ChangesRoomType = function (item) {

                                        $scope.RoomSearchObj.NewApptStartTime = "";
                                        $scope.RoomSearchObj.NewApptEndTime = "";
                                        $scope.RoomSearchObj.otherDocInd = "N";
                                        $scope.RoomSearchObj.RoomTypeId = item;
                                        $scope.searchfilterforRoom = { "txt1": "", "txt2": "", "txt3": "", "txt4": "", "txt5": "", "txt8": "" };
                                        $scope.RoomSearchObj.SelectDoctor = "";
                                        if (item != 7) {
                                            $scope.RoomType.IsSelectedCheckout = false;
                                        }

                                        //if ($scope.RoomSearchObj.RoomTypeId === 1) {
                                        //    // if ($scope.RoleId == 1 || $scope.RoleId == 43) {
                                        //    //   $scope.RoomSearchObj.DoctorId = eHnoteMasterDataService.getLoginId();
                                        //    $scope.SelectDoctor = $filter("filter")($scope.AllDoctorList, { "DoctorID": $scope.AppointmentDoctorID }, true)[0];
                                        //    $scope.RoomSearchObj.SelectDoctor = $scope.SelectDoctor.FullName;

                                        //    $scope.ChangesRoomDoctor($scope.SelectDoctor);
                                        //    //}
                                        //    //else {
                                        //    //    $scope.RoomSearchObj.DoctorId = eHnoteMasterDataService.getLoginId();
                                        //    //}

                                        //}

                                        var params = {
                                            "HospitalId": $scope.HospitalId,
                                            "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
                                            "SearchText": "",
                                            "PageNumber": 1,
                                            "PageSize": 100
                                        }
                                        eHnoteSettingsDataService.GetWaitingRoomList(params).success(function (data) {
                                            if (data.Status === "Success") {
                                                $scope.RoomListarray = data.rows || [];
                                            } else {
                                                $scope.RoomListarray = [];
                                            }

                                        }).error(function (error) {

                                        });


                                    }

                                    $scope.closeRoom = function (item) {
                                        $uibModalInstance.dismiss("cancel");
                                    };


                                    $scope.ChangesRoom = function (item) {
                                        item = item || null;
                                        if (item !== null) {
                                            $scope.RoomSearchObj.RoomId = item.RoomId || 0;
                                            $scope.RoomSearchObj.RoomAvailability = item.RoomAvailability || 0;
                                            $scope.RoomSearchObj.RoomCapacity = item.RoomCapacity || 0;
                                        } else {
                                            $scope.RoomSearchObj.RoomId = 0;
                                            $scope.RoomSearchObj.RoomAvailability = 0;
                                            $scope.RoomSearchObj.RoomCapacity = 0;
                                        }

                                    };

                                    $scope.ChangesOptham = function (item) {
                                        $scope.RoomSearchObj.SelectDoctor = item.FullName;
                                        $scope.RoomSearchObj.OptomId = item.DoctorID;
                                        $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                                        $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                                        $scope.RoomSearchObj.CounsellorId = null;
                                        $scope.RoomSearchObj.TechnicianId = null;
                                        $scope.RoomSearchObj.DilationAssistantId = null;
                                        $scope.RoomSearchObj.DoctorId = null;
                                        $scope.RoomSearchObj.ARId = null;
                                        $scope.RoomSearchObj.BillingUserId = null;
                                        $scope.searchfilterforRoom.txt2 = "";
                                    };

                                    $scope.ChangesBillingUser = function (item) {
                                        $scope.RoomSearchObj.SelectDoctor = item.FullName;
                                        $scope.RoomSearchObj.BillingUserId = item.DoctorID;
                                        $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                                        $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                                        $scope.RoomSearchObj.TechnicianId = null;
                                        $scope.RoomSearchObj.OptomId = null;
                                        $scope.RoomSearchObj.CounsellorId = null;
                                        $scope.RoomSearchObj.DilationAssistantId = null;
                                        $scope.RoomSearchObj.DoctorId = null;
                                        $scope.RoomSearchObj.ARId = null;
                                        $scope.searchfilterforRoom.txt9 = "";
                                    };
                                    $scope.ChangesReceptionUser = function (item) {
                                        $scope.RoomSearchObj.SelectDoctor = item.FullName;
                                        $scope.RoomSearchObj.TechnicianId = null;
                                        $scope.RoomSearchObj.OptomId = null;
                                        $scope.RoomSearchObj.CounsellorId = null;
                                        $scope.RoomSearchObj.DilationAssistantId = null;
                                        $scope.RoomSearchObj.DoctorId = null;
                                        $scope.RoomSearchObj.ARId = null;
                                        $scope.RoomSearchObj.ReceptionId = item.DoctorID;
                                        $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                                        $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                                        $scope.searchfilterforRoom.txt10 = "";
                                    };
                                    $scope.getUserBranchslots = function (item) {
                                        var SelectedDoctorId = parseInt(item.DoctorID);
                                        var SelectedUserBranchId = parseInt(item.UserBranchId);


                                        var appointmentDate = $filter('date')(new Date(), "yyyy-MM-dd");
                                        var params = {
                                            "DoctorId": SelectedDoctorId,
                                            "UserBranchId": SelectedUserBranchId,
                                            "Date": appointmentDate
                                        }
                                        console.log(params);
                                        eHnoteMainAppointmentService.GetDoctorBookedslots(params, OnGetSuccess, OnGetError);

                                        function OnGetSuccess(response) {
                                            console.log(JSON.stringify(response));
                                            if (response.status === 'Success') {


                                                angular.forEach(response.NormalSlots, function (item) {
                                                    item.StartTime = item.StartTime.substring(0, 5);
                                                });
                                                angular.forEach(response.TeleSlots, function (item) {
                                                    item.StartTime = item.StartTime.substring(0, 5);
                                                });

                                                newreStructureDoctorSelectedSlots(response);
                                            }

                                        }
                                        function OnGetError(response) {
                                            var MinPerCaseval = SelectedDoctorObj.MinPerCase || 5;
                                            bindDoctorSlots(MinPerCaseval, 'current');
                                        }








                                    };
                                    $scope.ChangesRoomDoctor = function (item) {

                                        if ($scope.AppointmentDoctorID == item.DoctorID) {
                                            $scope.RoomSearchObj.SelectDoctor = item.FullName;
                                            $scope.RoomSearchObj.DoctorId = item.DoctorID;
                                            $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                                            $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                                            $scope.RoomSearchObj.OptomId = null;
                                            $scope.RoomSearchObj.CounsellorId = null;
                                            $scope.RoomSearchObj.DilationAssistantId = null;
                                            $scope.RoomSearchObj.TechnicianId = null;
                                            $scope.RoomSearchObj.ARId = null;
                                            $scope.searchfilterforRoom.txt1 = "";
                                            $scope.RoomSearchObj.BillingUserId = null;
                                        } else {

                                            $scope.getUserBranchslots(item);
                                            $scope.RoomSearchObj.DoctorId = item.DoctorID;
                                            $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                                            $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                                            $scope.RoomSearchObj.SelectDoctor = item.FullName;
                                        }
                                    };


                                    $scope.ChangesCounsellor = function (item) {
                                        $scope.RoomSearchObj.SelectDoctor = item.FullName;
                                        $scope.RoomSearchObj.CounsellorId = item.DoctorID;
                                        $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                                        $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                                        $scope.RoomSearchObj.OptomId = null;
                                        $scope.RoomSearchObj.TechnicianId = null;
                                        $scope.RoomSearchObj.DilationAssistantId = null;
                                        $scope.RoomSearchObj.DoctorId = null;
                                        $scope.RoomSearchObj.ARId = null;
                                        $scope.searchfilterforRoom.txt4 = "";
                                        $scope.RoomSearchObj.BillingUserId = null;
                                    };

                                    $scope.ChangesTechnician = function (item) {
                                        $scope.RoomSearchObj.SelectDoctor = item.FullName;
                                        $scope.RoomSearchObj.TechnicianId = item.DoctorID;
                                        $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                                        $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                                        $scope.RoomSearchObj.OptomId = null;
                                        $scope.RoomSearchObj.CounsellorId = null;
                                        $scope.RoomSearchObj.DilationAssistantId = null;
                                        $scope.RoomSearchObj.DoctorId = null;
                                        $scope.RoomSearchObj.ARId = null;
                                        $scope.searchfilterforRoom.txt5 = "";
                                        $scope.RoomSearchObj.BillingUserId = null;
                                    };

                                    $scope.ChangeOpthaUser = function (item) {
                                        $scope.RoomSearchObj.SelectDoctor = item.FullName;
                                        $scope.RoomSearchObj.TechnicianId = null;
                                        $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                                        $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                                        $scope.RoomSearchObj.OptomId = item.DoctorID;
                                        $scope.RoomSearchObj.CounsellorId = null;
                                        $scope.RoomSearchObj.DilationAssistantId = null;
                                        $scope.RoomSearchObj.DoctorId = null;
                                        $scope.RoomSearchObj.ARId = null;
                                        $scope.searchfilterforRoom.txt11 = "";
                                        $scope.RoomSearchObj.BillingUserId = null;
                                    };

                                    $scope.ChangesCheckItem = function (item, checkoutItem) {
                                        if (checkoutItem === true) {
                                            $scope.RoomSearchObj.sendtoDoctorId = null;
                                            $scope.RoomSearchObj.RoomTypeobj = "";
                                            $scope.submitbutton = "Save";
                                            $scope.ChangesRoomType(item);
                                        } else {
                                            $scope.RoomSearchObj.RoomTypeobj = "";
                                            $scope.submitbutton = "Send";
                                        }
                                    };


                                    function reStructureDoctorSelectedSlots(resp) {
                                        if (resp.IsLeave) {
                                            alertify.error("Doctor is on Leave.Please choose another doctor");
                                            return false;
                                        }
                                        if (resp.UserConsultationNew.length > 0) {
                                            var apptTypeId = parseInt($scope.VisitTyepId);
                                            resp.UserConsultationNew[0].NewAppointmentMaxSlots = resp.UserConsultationNew[0].NewAppointmentMaxSlots || 0;
                                            resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots = resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots || 0;
                                            resp.UserConsultationNew[0].OTAppointmentMaxSlots = resp.UserConsultationNew[0].OTAppointmentMaxSlots || 0;
                                            if (apptTypeId == 1) {
                                                if (resp.UserConsultationNew[0].NewAppointmentMaxSlots != 0) {
                                                    if (resp.DoctorNewAppointmentCount > resp.UserConsultationNew[0].NewAppointmentMaxSlots || resp.DoctorNewAppointmentCount == resp.UserConsultationNew[0].NewAppointmentMaxSlots) {
                                                        alertify.error("Maximum new appointments are reached for this doctor. Please choose another doctor");
                                                        return false;
                                                    }
                                                }
                                            } else if (apptTypeId == 2 || apptTypeId == 3) {
                                                if (resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots != 0) {
                                                    if (resp.DoctorFollowUpAppointmentCount > resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots || resp.DoctorFollowUpAppointmentCount == resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots) {
                                                        alertify.error("Maximum followup appointments are reached for this doctor. Please choose another doctor");
                                                        return false;
                                                    }
                                                }
                                            } else if (apptTypeId == 4 || apptTypeId == 14) {
                                                if (resp.UserConsultationNew[0].OTAppointmentMaxSlots != 0) {
                                                    if (resp.DoctorAscAppointmentCount > resp.UserConsultationNew[0].OTAppointmentMaxSlots || resp.DoctorAscAppointmentCount == resp.UserConsultationNew[0].OTAppointmentMaxSlots) {
                                                        alertify.error("Maximum ASC appointments are reached for this doctor. Please choose another doctor");
                                                        return false;
                                                    }
                                                }
                                            }
                                        }

                                        $scope.timeslots = [];
                                        var GivenDate = resp.Date;
                                        var CurrentDate = new Date();
                                        GivenDate = new Date(GivenDate);

                                        $scope.iscurrentDate = false;


                                        if (GivenDate > CurrentDate) {
                                            $scope.iscurrentDate = false;
                                        } else {
                                            $scope.iscurrentDate = true;
                                        }
                                        $scope.time = $filter('date')(new Date(), 'HH:mm');
                                        angular.forEach(resp.UserConsultationNew, function (item) {

                                            var arr = item.SlotStartTime.split(':');
                                            var shour = $.trim(arr[0]);
                                            var smin = $.trim(arr[1]);


                                            var arr2 = item.SlotEndTime.split(':')
                                            var ehour = $.trim(arr2[0]);
                                            var emin = $.trim(arr2[1]);
                                            var startingTime = moment().hours(shour).minutes(smin);
                                            var endingTime = moment().hours(ehour).minutes(emin);
                                            var currentStartTime = angular.copy(startingTime);
                                            var token = 1;
                                            while (currentStartTime < endingTime) {

                                                var slotObj = {
                                                    "StartTime": currentStartTime.format("HH:mm"),
                                                    "EndTime": currentStartTime.add(item.MinPerCase, "minute").format("HH:mm"),
                                                    "TokenNumber": token,
                                                    "Available": "Y"
                                                }
                                                token++;
                                                $scope.timeslots.push(slotObj);


                                            }
                                            if ($scope.iscurrentDate === true) {
                                                $scope.timeslots = $filter("filter")($scope.timeslots, function (kitem, index) { return kitem.StartTime > $scope.time });
                                            }
                                        });

                                        angular.forEach($scope.timeslots, function (item) {
                                            angular.forEach(resp.NormalSlots, function (item1) {
                                                if (item.StartTime == item1.StartTime) {
                                                    item.Available = 'N';
                                                }
                                            });
                                        });

                                        $scope.setValue = [];
                                        if ($scope.timeslots.length > 0) {
                                            angular.forEach($scope.timeslots, function (item1) {
                                                if (item1.Available === 'Y') {
                                                    var res = item1.StartTime.split(":");
                                                    item1.StartTime = res[0] + ":" + res[1];
                                                    $scope.setValue.push(item1);
                                                }
                                            });
                                            if ($scope.setValue.length > 0) {
                                                $scope.patinet_appStarttime = $scope.setValue[0];
                                                $scope.RoomSearchObj.NewApptStartTime = $scope.patinet_appStarttime.StartTime;
                                                $scope.RoomSearchObj.NewApptEndTime = $scope.patinet_appStarttime.EndTime;
                                                $scope.RoomSearchObj.otherDocInd = "Y";
                                            } else {
                                                alertify.error("Doctor Slot is not available.Please choose another doctor");
                                                $scope.setValue = [];
                                                $scope.patinet_appStarttime = "";
                                                $scope.RoomSearchObj.sendtoDoctorId = null;
                                                $scope.RoomSearchObj.NewApptStartTime = "";
                                                $scope.RoomSearchObj.NewApptEndTime = "";
                                                $scope.RoomSearchObj.otherDocInd = "N";

                                            }


                                        } else {
                                            alertify.error("Doctor is not available.Please choose another doctor");
                                            $scope.setValue = [];
                                            $scope.patinet_appStarttime = "";
                                            $scope.EndtimeVAlue = "";
                                            $scope.RoomSearchObj.NewApptStartTime = "";
                                            $scope.RoomSearchObj.NewApptEndTime = "";
                                            $scope.RoomSearchObj.otherDocInd = "N";
                                            $scope.RoomSearchObj.sendtoDoctorId = null;
                                            return;
                                        }
                                    }
                                    function newreStructureDoctorSelectedSlots(resp) {
                                        if (resp.UserScheduleSlots.length > 0) {
                                            var apptTypeId = parseInt($scope.VisitTyepId);
                                            resp.UserScheduleSlots[0].NewAppointmentMaxSlots = resp.UserScheduleSlots[0].NewAppointmentMaxSlots || 0;
                                            resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots = resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots || 0;
                                            resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots = resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots || 0;
                                            resp.UserScheduleSlots[0].ASCAppointmentMaxSlots = resp.UserScheduleSlots[0].ASCAppointmentMaxSlots || 0;
                                            if (apptTypeId == 1) {
                                                if (resp.UserScheduleSlots[0].NewAppointmentMaxSlots != 0) {
                                                    if (resp.DoctorNewAppointmentCount > resp.UserScheduleSlots[0].NewAppointmentMaxSlots || resp.DoctorNewAppointmentCount == resp.UserScheduleSlots[0].NewAppointmentMaxSlots) {
                                                        alertify.error("Maximum new appointments are reached for this doctor. Please choose another doctor");
                                                        return false;
                                                    }
                                                }
                                            }
                                            else if (apptTypeId == 2) {
                                                if (resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots != 0) {
                                                    if (resp.DoctorFollowUpAppointmentCount > resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots || resp.DoctorFollowUpAppointmentCount == resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots) {
                                                        alertify.error("Maximum followup appointments are reached for this doctor. Please choose another doctor");
                                                        return false;
                                                    }
                                                }
                                            }
                                            else if (apptTypeId == 3) {
                                                if (resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots != 0) {
                                                    if (resp.DoctorFollowUpAppointmentCount > resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots || resp.DoctorFollowUpAppointmentCount == resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots) {
                                                        alertify.error("Maximum followup appointments are reached for this doctor. Please choose another doctor");
                                                        return false;
                                                    }
                                                }
                                            }
                                            else if (apptTypeId == 4 || apptTypeId == 14) {
                                                if (resp.UserScheduleSlots[0].ASCAppointmentMaxSlots != 0) {
                                                    if (resp.DoctorAscAppointmentCount > resp.UserScheduleSlots[0].ASCAppointmentMaxSlots || resp.DoctorAscAppointmentCount == resp.UserScheduleSlots[0].ASCAppointmentMaxSlots) {
                                                        alertify.error("Maximum ASC appointments are reached for this doctor. Please choose another doctor");
                                                        return false;
                                                    }
                                                }
                                            }
                                        }

                                        $scope.timeslots = [];
                                        var GivenDate = resp.Date;
                                        var CurrentDate = new Date();
                                        GivenDate = new Date(GivenDate);

                                        $scope.iscurrentDate = false;


                                        if (GivenDate > CurrentDate) {
                                            $scope.iscurrentDate = false;
                                        } else {
                                            $scope.iscurrentDate = true;
                                        }
                                        $scope.time = $filter('date')(new Date(), 'HH:mm');
                                        angular.forEach(resp.UserScheduleSlots, function (item) {

                                            var arr = item.StartTime.split(':');
                                            var shour = $.trim(arr[0]);
                                            var smin = $.trim(arr[1]);


                                            var arr2 = item.EndTime.split(':')
                                            var ehour = $.trim(arr2[0]);
                                            var emin = $.trim(arr2[1]);
                                            var startingTime = moment().hours(shour).minutes(smin);
                                            var endingTime = moment().hours(ehour).minutes(emin);
                                            var currentStartTime = angular.copy(startingTime);
                                            var token = 1;
                                            while (currentStartTime < endingTime) {

                                                var slotObj = {
                                                    "StartTime": currentStartTime.format("HH:mm"),
                                                    "EndTime": currentStartTime.add(item.MinPerCase, "minute").format("HH:mm"),
                                                    "TokenNumber": token,
                                                    "Available": "Y"
                                                }
                                                token++;
                                                $scope.timeslots.push(slotObj);


                                            }
                                            if ($scope.iscurrentDate === true) {
                                                $scope.timeslots = $filter("filter")($scope.timeslots, function (kitem, index) { return kitem.StartTime > $scope.time });
                                            }
                                        });

                                        angular.forEach($scope.timeslots, function (item) {
                                            angular.forEach(resp.NormalSlots, function (item1) {
                                                if (item.StartTime == item1.StartTime) {
                                                    item.Available = 'N';
                                                }
                                            });
                                        });

                                        $scope.setValue = [];
                                        if ($scope.timeslots.length > 0) {
                                            angular.forEach($scope.timeslots, function (item1) {
                                                if (item1.Available === 'Y') {
                                                    var res = item1.StartTime.split(":");
                                                    item1.StartTime = res[0] + ":" + res[1];
                                                    $scope.setValue.push(item1);
                                                }
                                            });
                                            if ($scope.setValue.length > 0) {
                                                $scope.patinet_appStarttime = $scope.setValue[0];
                                                $scope.RoomSearchObj.NewApptStartTime = $scope.patinet_appStarttime.StartTime;
                                                $scope.RoomSearchObj.NewApptEndTime = $scope.patinet_appStarttime.EndTime;
                                                $scope.RoomSearchObj.otherDocInd = "Y";
                                            } else {
                                                alertify.error("Doctor Slot is not available.Please choose another doctor");
                                                $scope.setValue = [];
                                                $scope.patinet_appStarttime = "";
                                                $scope.RoomSearchObj.sendtoDoctorId = null;
                                                $scope.RoomSearchObj.NewApptStartTime = "";
                                                $scope.RoomSearchObj.NewApptEndTime = "";
                                                $scope.RoomSearchObj.otherDocInd = "N";

                                            }


                                        } else {
                                            alertify.error("Doctor is not available.Please choose another doctor");
                                            $scope.setValue = [];
                                            $scope.patinet_appStarttime = "";
                                            $scope.EndtimeVAlue = "";
                                            $scope.RoomSearchObj.NewApptStartTime = "";
                                            $scope.RoomSearchObj.NewApptEndTime = "";
                                            $scope.RoomSearchObj.otherDocInd = "N";
                                            $scope.RoomSearchObj.sendtoDoctorId = null;
                                            return;
                                        }
                                    }


                                    $scope.SendToRoom = function (item) {
                                        $scope.RoomSearchObj.RoomTypeId = $scope.RoomSearchObj.RoomTypeId || 0;
                                        if ($scope.RoomSearchObj.RoomTypeId === 0) {
                                            alertify.error("Select Room Type");
                                            return false;
                                        }



                                        if ($scope.RoomSearchObj.RoomTypeId == 1 && $scope.RoomSearchObj.otherDocInd === "Y") {
                                            $scope.RoomSearchObj.sendtoDoctorId = $scope.RoomSearchObj.sendtoDoctorId || 0;
                                            if ($scope.RoomSearchObj.sendtoDoctorId === 0) {
                                                alertify.error("Select Doctor");
                                                return false;
                                            }
                                        }
                                        if ($scope.RoomSearchObj.otherDocInd === "Y") {
                                            if ($scope.RoomSearchObj.NewApptStartTime === "") {
                                                alertify.error("Doctor is not available.Please choose another doctor");
                                                return false;
                                            }
                                        }

                                        $scope.RoomTypeId = null;
                                        if ($scope.RoleId == 1 || $scope.RoleId == 43) {
                                            var SuffixId = doctorinfo.doctordata.User[0].SuffixId || 0;
                                            $scope.RoomTypeId = 1;
                                            if (SuffixId == 13) { //optha
                                                $scope.RoomTypeId = 12;
                                            }
                                            if (SuffixId == 10) { //doctor
                                                $scope.RoomTypeId = 1;
                                            }

                                        } else if ($scope.RoleId == 10) {
                                            $scope.RoomTypeId = 2;
                                        } else if ($scope.RoleId == 19) {
                                            $scope.RoomTypeId = 9;
                                        }
                                        else if ($scope.RoleId == 2) {
                                            $scope.RoomTypeId = 10;
                                        }
                                        else if ($scope.RoleId == 18) {
                                            $scope.RoomTypeId = 4;
                                        }
                                        else {
                                            $scope.RoomTypeId = null;
                                        }

                                        $scope.PatientTagList = [];
                                        let selectedPatientTagList = $filter('filter')($scope.SelectedPatientTagList, { "IsChecked": true }, true);
                                        $scope.PatientTagList = angular.copy(selectedPatientTagList);

                                        if ($scope.Currentstatus == "Active") {

                                            $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                                            var params = {
                                                "UserId": eHnoteMasterDataService.getLoginId(),
                                                "HospitalId": $scope.HospitalId,
                                                "AppointmentId": $scope.appointmentid,
                                                "AppointmentTrackerDetailId": 0,
                                                "RoleId": $scope.RoleId,
                                                "DoctorId": $scope.RoomSearchObj.sendtoDoctorId || null,
                                                "DoctorRoleId": $scope.RoomSearchObj.sendtoDoctorRoleId || null,
                                                "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
                                                "RoomId": $scope.RoomSearchObj.RoomId,
                                                "IsSendTo": "Y",
                                                "CurrentTime": $scope.CurrentTime,
                                                "IsCheckedIn": "N",
                                                "NewApptStartTime": $scope.RoomSearchObj.NewApptStartTime || "",
                                                "NewApptEndTime": $scope.RoomSearchObj.NewApptEndTime || "",
                                                "otherDocInd": $scope.RoomSearchObj.otherDocInd || "N",
                                                "IsCheckedOut": "N",
                                                "IsReCheckIn": "N",
                                                "IsReCheckOut": "N",
                                                "VisitTypeId": $scope.ApptObj.VisitTypeId,
                                                "HospitalEquipmentId": null,
                                                "PatientTagList": $scope.PatientTagList || []
                                            }

                                            console.log($scope.RoleId);
                                            if (params.RoomTypeId === 7) {
                                                params.RoomId = null;
                                                params.IsCheckedOut = "Y";
                                                params.Status = 'Completed';
                                            }
                                            eHnoteMainAppointmentService.AddUpdateAppointmentTrackerDetails(params).then(function (resp) {
                                                if (resp.data.Status == "Success") {
                                                    $location.url("/Coordinator");
                                                } else {
                                                    alertify.error("Patient is Active at Another User,You Can't Send Patient");
                                                }
                                            }, function (err) {
                                                console.log(err);
                                                alertify.error("Getting Failed");
                                            });

                                            $uibModalInstance.close("cancel");

                                        }




                                    }

                                },



                            });

                            $scope.DynamicStatusInstanceAdd.result.then(function (resp) {

                            }, function (cancel) {
                            });
                        }

                    }
                }
            }, function (err) {
                console.log(err);
                alertify.error("Getting Failed");
            });



        }

        $scope.GetAllHospitalEquipments = function () {
            //var obj = {
            //    "ParentOrganizationId": $scope.ParenthospitalId
            //}
            $scope.ParenthospitalId = $scope.ParenthospitalId || 0;
            eHnotePatientAddressDataServices.GetAllHospitalEquipments($scope.ParenthospitalId).then(function (resp) {
                if (resp.data.rows.length > 0) {
                    $scope.HospitalEquipmentList = resp.data.rows || [];
                    //$scope.HospitalEquipmentList = $filter("filter")($scope.HospitalEquipmentList, function (Nitem) {
                    //    return Nitem.HospitalEquipmentId === 1 || Nitem.HospitalEquipmentId === 4;
                    //}) || [];

                }
            });
        };
        $scope.GetAllHospitalEquipments();


        function BookApptPopupOpened() {
            var openBookAppt = "";
            $scope.bookapptSetupPopUp = $uibModal.open({
                "templateUrl": "templates/appointment/BookAppointmentPopup.html",
                "keyboard": false,
                "backdrop": "static",
                "windowClass": "appointment-full-popup",
                "controller": "UsNewBookAppointmentPopupCtrl",
                "resolve": {
                    "allUserList": function () { return angular.copy($scope.allUserList); },
                    "openBookAppt": function () { return openBookAppt; }
                }
            });

            $scope.bookapptSetupPopUp.result.then(function (resp) {

                if ($scope.Coordinatorobj.FinalOrdersList.length > 0) {
                    angular.forEach($scope.Coordinatorobj.FinalOrdersList, function (item) {
                        if (resp.response.AppointmentTypeId === 7 && item.CoordinatorStatusId == 3) {
                            item.PreAdmissionAppointmentId = resp.response.AppointmentID;
                        }

                        if ($scope.PageName === 'reschedule') {
                            item.PreAdmissionStatusId = null;
                            item.PreAdmissionStatus = null;
                        }
                    });
                }

                $scope.AddUpdateAdvisedProcedures();

                //if ($scope.mainAppointmentView.isCalendarorList == 'list' || $scope.mainCalendarView.MainTab == 1) {
                //    $scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
                //}
                //var obj = {
                //    "selectedDoctor": $scope.selectedDoctor
                //}
                //$rootScope.$broadcast("AppointmentTypefilter", obj);
                //if ($scope.activeEvent === 'Calendar1') {
                //    $scope.loadappt();
                //}
                //if ($scope.mainCalendarView.MainTab == 2 && $scope.mainAppointmentView.isCalendarorList == 'calendar') {
                //    $scope.filterSelectedDoctorsonCalendar();
                //    $scope.clearSelectedSlots();
                //    $scope.clearEventSelectedSlots();
                //}

                //$scope.clearSelectedSlots();
                //$scope.clearEventSelectedSlots();

            }, function () { });

        }

        $scope.CoordinatornotesPopover = {
            templateUrl: 'templates/uibpopups/CoordinatornotesPopover.html',
        };
        $scope.DoctornotesPopover = {
            templateUrl: 'templates/uibpopups/DoctornotesPopover.html',
        };
        $scope.LognotesPopover = {
            templateUrl: 'templates/uibpopups/LognotesPopover.html',
        };



        $scope.EditAppointmentPopup = function (obj) {

            obj = obj || "";

            if (obj !== "") {
                eHnoteMainAppointmentService.getAdditionalApptDetailsById(obj.PreAdmissionAppointmentId).then(function (resp) {
                    resp.data = resp.data || [];

                    if (resp.data.length > 0) {
                        if (resp.data[0].AppointmentDetails.length > 0) {

                            let ApptObj = resp.data[0].AppointmentDetails[0];

                            var Sarray = ApptObj.StartTime.split(":");
                            var stime = Sarray[0] + ":" + Sarray[1];
                            var date = moment(ApptObj.AppointmentDate).format();
                            var earray = ApptObj.EndTime.split(":");
                            var etime = earray[0] + ":" + earray[1];
                            var apptime = ApptObj.AppointmentId;
                            var VisitTypeId = ApptObj.AppointmentTypeId || "";
                            VisitTypeId = VisitTypeId != '' ? VisitTypeId : 0;
                            var VisitRemarks = ApptObj.VisitRemarks || "";

                            $scope.AppDate = [stime, etime, apptime, ApptObj.VisitReason ? ApptObj.VisitReason : "", ApptObj.ReferralSourceId ? ApptObj.ReferralSourceId : "", VisitTypeId, VisitRemarks];

                            $scope.calenderDate = moment(date).format("DD-MMM-YYYY" + " " + stime);

                            $scope.PageName = "reschedule";

                            let surgeryList = [];
                            angular.forEach($scope.Coordinatorobj.FinalOrdersList, function (item) {
                                let obj = {
                                    "PatientSurgeryId": item.PatientDescriptionId
                                }
                                surgeryList.push(obj);
                            });

                            var Obj = {
                                "PageName": "reschedule",
                                "AppDate": $scope.AppDate,
                                "ispatientExistsval": true,
                                "calenderDate": $scope.calenderDate,
                                "AppointmentDate": ApptObj.AppointmentDate,
                                "AppointmentId": ApptObj.AppointmentId || null,
                                "PatientId": $scope.Mainobj.PatientId || null,
                                'IsComingFrom': '',
                                "DoctorId": ApptObj.DoctorID,
                                "StartTime": stime || "",
                                "EndTime": etime,
                                'type': 'op',
                                "SurgeryList": surgeryList || []
                            };
                            datapersistanceFactory.set('AppointmentDetailsCache', Obj);
                            BookApptPopupOpened();
                        }
                    }



                }, function (err) {
                    console.log(err);
                    alertify.error("Getting data failed");
                });
            }
        };

        $scope.costestimatedpopup = function () {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/costestimatedpopup.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "inventory-full-popup",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };

        
    }]);


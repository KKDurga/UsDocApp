"use strict";
eHnoteWebApp.controller("USPatientAlertsCtrl", ["$scope", "$uibModalInstance", "PatientAlertsobj", "eHnoteMasterDataService", "eHnoteLoginStatusService", "eHnoteInsuranceService", "alertify", "$q", "$filter", "eHnoteSettingsDataService", "eHnoteAuditServices","eHnoteUserDataService",
    function ($scope, $uibModalInstance, PatientAlertsobj, eHnoteMasterDataService, eHnoteLoginStatusService, eHnoteInsuranceService, alertify, $q, $filter, eHnoteSettingsDataService, eHnoteAuditServices, eHnoteUserDataService)
   {
        $scope.PatientAlertsobj = PatientAlertsobj;
    

        $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.SpecializationId = $scope.doctorinfo.doctordata.User[0].SpecializationId;
        $scope.DoctorId = $scope.doctorinfo.doctordata.User[0].DoctorID;
        $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

        $scope.HospitalId = 0;
        $scope.ParentHospitalId = 0;

        if ( $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo &&
            $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode &&
            $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
            $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        }
        function getIsfromscreenObj() {
            let obj = {
                "IsfromScreen": "",
                "IsfromscreenInd": false,
                "TempMsgArray": []
            }
            return obj
        }
        $scope.IsfromscreenObj = getIsfromscreenObj();
        $scope.uibcloses = function () {
            if ($scope.IsfromscreenObj.IsfromScreen == 'Bookappointment') {
               /* $uibModalInstance.dismiss($scope.IsfromscreenObj);*/
                if ($scope.AlertObj.AlertMessage == '') {
                    $scope.PatientAlertsobj.ApptNotesData = $scope.PatientAlertsobj.ApptNotesData || '';
                    if ($scope.PatientAlertsobj.ApptNotesData != '') {
                        if ($scope.PatientAlertsobj.ApptNotesData.ScreenType == 'BookAppt') {
                            $scope.IsfromscreenObj.popupclose = $scope.IsfromscreenObj.popupclose || '';
                            $scope.IsfromscreenObj.popupclose = 'close';
                            $uibModalInstance.close($scope.IsfromscreenObj);
                        }
                    } else {
                        $uibModalInstance.dismiss($scope.IsfromscreenObj);
                    }
                   
                } else {
                    $uibModalInstance.dismiss($scope.IsfromscreenObj);
                }
            } else {
                $uibModalInstance.close();
            }
            $scope.AlertObj = GetAlertData();
            $scope.PatientSearchdata = getSelectedPatientData();
            angular.forEach($scope.MasterAlertTypes, function (item) {
                item.IsChecked = false;
            });

        };
        $scope.IsdesiableNotesTypeInd = false;
        $scope.MasterPriority = PatientAlertsobj.MasterPriority || [] ;
        $scope.MasterAlertTypes = PatientAlertsobj.MasterAlertTypes || [] ;
        $scope.MasterAlertTag = PatientAlertsobj.MasterAlertTag || [] ;
        $scope.MasterAlertNoteType = PatientAlertsobj.MasterAlertNoteType || [] ;
        $scope.IsdesiableNotesTypeInd = PatientAlertsobj.IsdesiableNotesTypeInd || false ;
        $scope.IsfromscreenObj.IsfromScreen = PatientAlertsobj.IsfromScreen || "" ;
        PatientAlertsobj.AppointmentId = PatientAlertsobj.AppointmentId || 0 ;
        PatientAlertsobj.isshowEditInd = PatientAlertsobj.isshowEditInd || false ;
        $scope.GetClaimListObj = function () {
            return {
                "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "OrganizationId": $scope.HospitalId,
                "OrganizationFacilityId": 0,
                "PatientId": "",
                "PatienClaimNumber": "",
                "ClaimNumber": "",
                "BatchNumber": "",
                "BillingProviderId": 0,
                "RenderingProviderId": 0,
                "RenderingProviderName": "",
                "PayorId": 0,
                "BillPaymentTypeId": 0,
                "TransmissionMethodId": 0,
                "BillPaymentTypeObj": "",
                "TransmissionTypeId": null,
                "ClaimTypeId": 0,
                "PayorId": null,
                "ClaimStatusList": "",
                "PageSize": 100,
                "PageNumber": 1,
                "Count": 0,
                "BatchNumber": "",
                "IsReadytosubmit": false,
                "ClaimStatusId": 0,
                "CurrentResponsibilityId": 0,
                "DenialId": 0,
                "IsActive": false,
                "OrganizationFacilityId": "",
            };
        };
        $scope.SearchClaimListObj = angular.copy($scope.GetClaimListObj());

        function GetAlertData() {
            return {
                "AlertId": 0,
                "PatientNoteId": 0,
                "AppointmentNoteId": 0,
                "OrganizationId": $scope.HospitalId,
                "PatientId": PatientAlertsobj.PatientId,
                "StartDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "EndDate": null,
                "PriorityId": 0,
                "PriorityName":"",
                "AlertTagId":0,
                "AlertTagName": "",
                "AlertMessage": "",
                "StatusId": 1,
                "Status": "Active",
                "UserId": $scope.UserId,
                "DeleteInd": "N",    
                "AlertTypesList": [],
                "AlertNoteTypeId": 0,
                "AlertNoteName": "",
                "IsClickSavePatientAlertssBtn ":false,
                    
            };
        };
       
        $scope.AlertObj = GetAlertData();

        $scope.GetLogObj = function () {

            return {
                "UserId": $scope.UserId || null,
                "OrganizationId": $scope.HospitalId || null,
                "AppointmentId": PatientAlertsobj.AppointmentId || null,
                "PatientId": PatientAlertsobj.PatientId || null,
                "LogArray": [],
                "AlertData": "",
            }
        };

        $scope.filterAlerts = function (item) {
            return item.NoteTypeId != 6;
        };

        $scope.filterMasterAlerts = function (item) {
            return item.AlertNoteTypeId != 6;
        };
       
        $scope.init = function () {
            $scope.PatientAlertsList = [];
            $scope.masterSettlementStatusList = [];
            let obj = {
                "PatientId": PatientAlertsobj.PatientId,
                "OrganizationId": $scope.HospitalId,
                "StatusId": 1
            }
            $q.all([
                eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
                eHnoteInsuranceService.GetPatientAlertsNew(obj),
            ]).then(function (resp) {
                if (resp[0].data.status == "Success") {
                    resp[0].data.rows = resp[0].data.rows || [];
                    if (resp[0].data.BillPaymentByModes.length > 0) {
                        $scope.ClaimDataList = angular.copy(resp[0].data.BillPaymentByModes);
                    }

                    if (resp[0].data.TransmissionMethods.length !== 0) {
                        $scope.ClaimFormatList = resp[0].data.TransmissionMethods || [];
                        $scope.ClaimFormatList = $filter("filter")($scope.ClaimFormatList, function (item) {
                            return item.TransmissionMethodId === 1 || item.TransmissionMethodId === 2;
                        });
                    }

                    if (resp[0].data.ClaimStatus.length > 0) {
                        $scope.MasterClaimStatusList = angular.copy(resp[0].data.ClaimStatus);
                        $scope.ClaimStatusListDD = angular.copy(resp[0].data.ClaimStatus);
                        $scope.ClaimStatusListDD.forEach(function (item) {
                            item.IsChecked = true;
                        });
                        $scope.SearchClaimListObj.ClaimStatusList = $scope.MasterClaimStatusList.map(function (status) {
                            return status.ClaimStatusId;
                        }).join(',');
                        console.log($scope.SearchClaimListObj.ClaimStatusList);
                    }
                    if (resp[0].data.CurrentResponsibilities.length > 0) {
                        $scope.CurrentResponsibilityList = resp[0].data.CurrentResponsibilities || [];
                    }
                    if (resp[0].data.DenialCodes.length > 0) {
                        $scope.DenialCodesList = resp[0].data.DenialCodes || [];
                    }
                    if (resp[0].data.MasterPriority.length > 0) {
                        $scope.MasterPriority = resp[0].data.MasterPriority || [];
                    }
                    if (resp[0].data.MasterAlertTypes.length > 0) {
                        $scope.MasterAlertTypes = resp[0].data.MasterAlertTypes || [];                       
                        angular.forEach($scope.MasterAlertTypes, function (item) {
                            var object = {
                                'AlertDeatilId': 0,
                                'AlertId': 0,
                                'IsChecked': false,
                                'DeleteInd': 'N',
                                'AlertTypeId': item.AlertTypeId,
                                'AlertTypeName': item.AlertName,
                            }
                            $scope.AlertObj.AlertTypesList.push(object);
                        });

                    }
                    if (resp[0].data.MasterAlertTag.length > 0) {
                        $scope.MasterAlertTag = resp[0].data.MasterAlertTag || [];
                    }
                    if (resp[0].data.MasterAlertNoteType.length > 0) {
                         $scope.MasterAlertNoteType = resp[0].data.MasterAlertNoteType || [];      
                        //$scope.MasterAlertNoteType = $filter("filter")(resp[0].data.MasterAlertNoteType, function (item) {
                        //    return item.AlertNoteTypeId !== 6;
                        //}) || [];
                    }
                    if (resp[0].data.SettlementStatus.length > 0) {
                        angular.forEach(resp[0].data.SettlementStatus, function (item) {
                            if (item.SettlementStatusId == 2 || item.SettlementStatusId == 3) {
                                $scope.masterSettlementStatusList.push(item);
                            }
                        })
                    };
                    if ($scope.MasterAlertNoteType.length > 0) {
                        if (PatientAlertsobj.AlertNoteTypeId != undefined) {
                            let Id = PatientAlertsobj.AlertNoteTypeId || 0;
                            var NotesTypes = $filter("filter")($scope.MasterAlertNoteType, { "AlertNoteTypeId": Id })[0] || {};
                            $scope.AlertObj.AlertNoteTypeId = NotesTypes.AlertNoteTypeId || 0;
                            $scope.AlertObj.AlertNoteName = NotesTypes.AlertNoteName || "";
                        }
                    };
                }
                if (resp[1].data.Status == "Success") {
                    if (resp[1].data.rows.length > 0) {                    
                        $scope.PatientAlertsList = resp[1].data.rows || [];
                        $scope.PatientAlertsobj.AlertItem = $scope.PatientAlertsobj.AlertItem || '';
                        if ($scope.PatientAlertsobj.AlertItem !== '') {
                            
                            let PatientNoteId = $scope.PatientAlertsobj.AlertItem.PatientNoteId || 0;
                            let AppointmentNoteId = $scope.PatientAlertsobj.AlertItem.AppointmentNoteId || 0;

                            if (PatientNoteId !== 0) {

                                let filtervalue1 = $scope.PatientAlertsList.find(function (item) {
                                    return item.PatientNoteId === PatientNoteId;
                                }) || {};

                                $scope.EditAlertList(filtervalue1);

                            } else if (AppointmentNoteId !== 0) {

                                let filtervalue2 = $scope.PatientAlertsList.find(function (item) {
                                    return item.AppointmentNoteId === AppointmentNoteId;
                                }) || {};


                                $scope.EditAlertList(filtervalue2);
                            } else if(PatientAlertsobj.isshowEditInd){
                               if($scope.PatientAlertsobj.AlertItem){
                                 $scope.EditAlertList(PatientAlertsobj.AlertItem);
                                }
                            }
                            $scope.LogObj = $scope.LogObj || {};
                            $scope.LogObj.AlertData = $scope.PatientAlertsobj.AlertItem || "";
                        }

                    }   

                }
                $scope.PatientAlertsobj.ApptNotesData = $scope.PatientAlertsobj.ApptNotesData || '';
                if ($scope.PatientAlertsobj.ApptNotesData !='') {
                    if ($scope.PatientAlertsobj.ApptNotesData.ScreenType == 'BookAppt') {
                        $scope.AlertObj.AlertMessage = $scope.PatientAlertsobj.ApptNotesData.ApptNotes || '';
                    }
                }

            }, function (err) {
                console.log(err);
                alertify.error("Getting Data Failed");
            });
        }

        function getSelectedPatientData() {
            var obj = {
                "CreateAlert": 2,
                "IsShowAlert": false,
            }
            return obj;
        };
        $scope.PatientSearchdata = getSelectedPatientData();

        

        $scope.ChangeAlertNotestype = function (Id) {
            Id == Id || 0;
            var NotesTypes = $filter("filter")($scope.MasterAlertNoteType, { "AlertNoteTypeId": Id })[0] || {};

            $scope.AlertObj.AlertNoteTypeId = NotesTypes.AlertNoteTypeId || 0;
            $scope.AlertObj.AlertNoteName = NotesTypes.AlertNoteName || "";
        }


        $scope.ChangesAlertRadiobtn = function (Id,obj) {
            $scope.PatientSearchdata.CreateAlert = Id;
            obj.AlertId = obj.AlertId || 0;
            if ($scope.PatientSearchdata.CreateAlert == 1) {
                $scope.AlertObj.DeleteInd = 'N';
                if ($scope.AlertObj.AlertTypesList.length > 0) {
                    angular.forEach($scope.AlertObj.AlertTypesList, function (item) {
                        item.IsChecked = false;
                    });
                }
                $scope.PatientSearchdata.IsShowAlert = true;
            } else {
                $scope.PatientSearchdata.IsShowAlert = false;
                if ($scope.AlertObj.AlertTypesList.length > 0) {
                    angular.forEach($scope.AlertObj.AlertTypesList, function (item) {
                        item.IsChecked = false;
                        item.AlertDeatilId = item.AlertDeatilId || 0;
                        if (item.AlertDeatilId !== 0) {
                            item.DeleteInd = 'Y';
                        }
                    });
                }
                if (obj.AlertId !== 0) {
                    $scope.AlertObj.DeleteInd = 'Y';
                };
                $scope.AlertObj.EndDate = '';
                $scope.AlertObj.PriorityId = 0;
                $scope.AlertObj.PriorityName = '';
            }

        }

        $scope.AlertTypesListData = [];
        $scope.updateAlertTypesListData = function (mitem, obj) {
            mitem.AlertId = obj.AlertId || 0;
            if (mitem.IsChecked) {
                mitem.DeleteInd = 'N';
            } else if (!mitem.IsChecked) {
                if (mitem.AlertDeatilId !== 0) {
                    mitem.DeleteInd = 'Y';
                }
            }
        };

        $scope.ChangePrioritylist = function (PriorityList) {
            $scope.AlertObj.PriorityId = PriorityList.PriorityId || 0;
            $scope.AlertObj.PriorityName = PriorityList.PriorityName || "";
        }

        $scope.ChangeAlertTag = function (Id) {
            Id == Id || 0
            var AlertTagList = $filter("filter")($scope.MasterAlertTag, { "AlertTagId": Id })[0] || {};

            $scope.AlertObj.AlertTagId = AlertTagList.AlertTagId || 0;
            $scope.AlertObj.AlertTagName = AlertTagList.AlertTagName ||"";

        }


     

        $scope.EditAlertList = function (item) {
            $scope.AlertObj = GetAlertData();
            $scope.PatientSearchdata = getSelectedPatientData();
            $scope.AlertObj.AlertMessage = item.PatientNotes || "";
            $scope.AlertTypesList = [];
            if (item.AlertData !== null) {

                $scope.AlertObj.AlertMessage = item.AlertData.AlertMessage || "";
                $scope.AlertObj.AlertId = item.AlertData.AlertId || 0;         
                $scope.AlertObj.AlertTagId = item.AlertData.AlertTagId || 0;           
                $scope.AlertObj.AlertTagName = item.AlertData.AlertTagName || "";
                $scope.AlertObj.StatusId = item.AlertData.StatusId || 0;
                $scope.AlertObj.PriorityId = item.AlertData.PriorityId || 0;
                $scope.AlertObj.PriorityName = item.AlertData.PriorityName || "";             
                $scope.AlertObj.StartDate = $filter('date')(item.AlertData.StartDate, "MM-dd-yyyy") || "";
                $scope.AlertObj.EndDate = $filter('date')(item.AlertData.EndDate, "MM-dd-yyyy") || "";
                $scope.AlertObj.Status = item.AlertData.Status || "";
                $scope.AlertObj.DeleteInd = item.AlertData.DeleteInd || "N";
                $scope.AlertTypesList = item.AlertData.AlertTypesList || [];

                if ($scope.AlertObj.PriorityName != '') {
                    $scope.PatientSearchdata.IsShowAlert = true;
                    $scope.PatientSearchdata.CreateAlert = 1;
                }
            }

            if ($scope.MasterAlertTypes.length > 0) {
                angular.forEach($scope.MasterAlertTypes, function (item) {
                    var object = {
                        'AlertDeatilId': 0,
                        'AlertId': 0,
                        'IsChecked': false,
                        'DeleteInd': 'N',
                        'AlertTypeId': item.AlertTypeId,
                        'AlertTypeName': item.AlertName,
                    }
                    $scope.AlertObj.AlertTypesList.push(object);
                });
            }

            $scope.AlertObj.PatientNoteId = item.PatientNoteId || 0;
            $scope.AlertObj.AppointmentNoteId = item.AppointmentNoteId || 0;
            $scope.AlertObj.AlertNoteTypeId = item.NoteTypeId;
            $scope.AlertObj.AlertNoteName = item.NoteType;
            if ($scope.AlertTypesList.length > 0) {
                angular.forEach($scope.AlertTypesList, function (pitem) {
                    var templist = $filter("filter")($scope.AlertObj.AlertTypesList, { "AlertTypeId": pitem.AlertTypeId }, true) || [];
                    if (templist.length > 0) {
                        templist[0].IsChecked = true;
                        templist[0].AlertDeatilId = pitem.AlertDeatilId;
                        templist[0].AlertId = pitem.AlertId;
                        templist[0].AlertTypeId = pitem.AlertTypeId;
                        templist[0].AlertTypeName = pitem.AlertTypeName;
                        templist[0].DeleteInd = pitem.DeleteInd;
                    }
                });
            }
                
            /*$scope.AlertTypesListData = angular.copy($scope.AlertObj.AlertTypesList) || [];*/
                     
        };
        $scope.init();

     
        $scope.AddPatientAlert1 = function () {
            if ($scope.AlertObj.AlertMessage === "") {
                alertify.error("Please Enter the alert Message!");
                return false;
            }
            if ($scope.PatientSearchdata.CreateAlert === 1) {
                if ($scope.AlertObj.PriorityName === "") {
                    alertify.error("Please Enter the Priority!");
                    return false;
                }
            }
            $scope.AlertObj.AlertTypesList = angular.copy($scope.AlertTypesListData) || [];

            let param = {
                "AlertId": $scope.AlertObj.AlertId,
                "PatientId": $scope.AlertObj.PatientId,
                "StartDate": $scope.AlertObj.StartDate,
                "EndDate": $scope.AlertObj.EndDate,
                "PriorityId": $scope.AlertObj.PriorityId,
                "PriorityName": $scope.AlertObj.PriorityName,
                "AlertTagId": $scope.AlertObj.AlertTagId,
                "AlertTagName": $scope.AlertObj.AlertTagName,
                "AlertMessage": $scope.AlertObj.AlertMessage,
                "StatusId": $scope.AlertObj.StatusId,
                "Status": $scope.AlertObj.Status,
                "UserId": $scope.AlertObj.UserId,
                "AlertNoteTypeId": $scope.AlertObj.AlertNoteTypeId,
                "AlertNoteName": $scope.AlertObj.AlertNoteName,
                "OrganizationId": $scope.AlertObj.OrganizationId,
                "DeleteInd": $scope.AlertObj.DeleteInd,
                "AlertTypesList": $scope.AlertObj.AlertTypesList || [],        
                "AppointmentId": PatientAlertsobj.AppointmentId || 0,
                "IsfromscreenInd":true
            }

            if ($scope.IsfromscreenObj.IsfromScreen == 'Bookappointment' && $scope.AlertObj.AlertNoteTypeId == 4 && $scope.PatientAlertsobj.AppointmentId!=0 ) {
                $scope.IsfromscreenObj.TempMsgArray.push(param);
                $scope.PatientAlertsList.push(param);
                $scope.ClearPatientAlert();
                return false;
            }

            eHnoteInsuranceService.AddUpdatePatientAlerts(param).then(function (resp) {
                if (resp.data.status =="Success") {
                    console.log("Alert added successfully", resp);
                    alertify.success("Patient alert added successfully!");
                    $scope.AlertObj = GetAlertData();
                    angular.forEach($scope.MasterAlertTypes, function (item) {
                        item.IsChecked = false;
                    });
                    $scope.ClearPatientAlert();
                    $scope.getPatientAlertsList();
                   /* $uibModalInstance.close();*/
                }
                    
                },
            );
        };

        $scope.DeletePatientAlert = function (item) {

            item = item || null;

            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete?", function () {
                var obj = {
                    UserId: $scope.UserId,
                    OrganizationId: $scope.HospitalId,
                    PatientNoteId: item.PatientNoteId || 0,
                    AppointmentNoteId: item.AppointmentNoteId || 0,
                    NoteTypeId: item.NoteTypeId,
                    NoteTypeName: item.NoteType,
                    PatientId: PatientAlertsobj.PatientId,
                    AppointmentId: PatientAlertsobj.AppointmentId,
                    DeleteInd: "Y",
                    Notes: $scope.AlertObj.AlertMessage,
                    CreateAlert: 1,
                    AlertData: null
                };

            
                if (item.AlertData !== null) {
                    obj.AlertData = {
                        AlertId: item.AlertData.AlertId,
                        StartDate: item.AlertData.StartDate,
                        EndDate: item.AlertData.EndDate || null,
                        PriorityId: item.AlertData.PriorityId,
                        PriorityName: item.AlertData.PriorityName,
                        AlertTagId: item.AlertData.AlertTagId,
                        AlertTagName: item.AlertData.AlertTagName,
                        AlertMessage: item.AlertData.AlertMessage,
                        StatusId: item.AlertData.StatusId,
                        Status: item.AlertData.Status,
                        DeleteInd: "Y",
                        AlertTypesList: item.AlertData.AlertTypesList || []
                    };
                    angular.forEach(item.AlertData.AlertTypesList, function (pitem) {
                        pitem.IsChecked = false;
                        pitem.DeleteInd = 'Y';
                    });
                }

                eHnoteInsuranceService.AddUpdatePatientNoteandAlertData(obj).then(function (resp) {

                    if (resp.data.status == "Success") {
                        $scope.getPatientAlertsListNew();
                        alertify.success("Deleted successfully");
                        $scope.ClearPatientAlert();

                        if ($scope.MasterAlertNoteType.length > 0) {
                            if (PatientAlertsobj.AlertNoteTypeId != undefined) {
                                let Id = PatientAlertsobj.AlertNoteTypeId || 0;
                                var NotesTypes = $filter("filter")($scope.MasterAlertNoteType, { "AlertNoteTypeId": Id })[0] || {};
                                $scope.AlertObj.AlertNoteTypeId = NotesTypes.AlertNoteTypeId || 0;
                                $scope.AlertObj.AlertNoteName = NotesTypes.AlertNoteName || "";
                            }
                        };
                    } else {
                        alertify.error("Failed to delete the patient alert.");
                    }
                }, function onerror(err) {
                    console.log(err);
                });

            } ,
                function () {
                $scope.$digest();
                r = "You pressed Cancel!";
            });
           
        }

        $scope.getPatientAlertsList = function () {
            $scope.PatientAlertsList = [];
            let obj = {
                "PatientId": PatientAlertsobj.PatientId,
                "OrganizationId": $scope.HospitalId,
                "StatusId": 1
            }
            $q.all([
                eHnoteInsuranceService.GetPatientAlerts(obj),
            ]).then(function (resp) {

                if (resp[0].data.Status == "Success") {
                    if (resp[0].data.rows.length > 0) {
                        $scope.PatientAlertsList = angular.copy(resp[0].data.rows) || [];
                    }
                }
            }, function (err) {
                console.log(err);
                alertify.error("Getting Data Failed");
            });
        }
        $scope.ClearPatientAlert = function () {
            $scope.AlertObj = GetAlertData();
            $scope.PatientSearchdata = getSelectedPatientData();
            $scope.PatientSearchdata.CreateAlert = 2;
            if ($scope.MasterAlertTypes.length > 0) {
                angular.forEach($scope.MasterAlertTypes, function (item) {
                    var object = {
                        'AlertDeatilId': 0,
                        'AlertId': 0,
                        'IsChecked': false,
                        'DeleteInd': 'N',
                        'AlertTypeId': item.AlertTypeId,
                        'AlertTypeName': item.AlertName,
                    }
                    $scope.AlertObj.AlertTypesList.push(object);
                });
            }      
        }

        $scope.AddPatientAlert = function () {
            $scope.AlertObj.AlertNoteTypeId = $scope.AlertObj.AlertNoteTypeId || null;
            if ($scope.AlertObj.AlertNoteTypeId === null) {
                alertify.error("Please Select the Note Type!");
                return false;
            }

            if ($scope.AlertObj.AlertMessage === "") {
                alertify.error("Please Enter the alert Message!");
                return false;
            }
            if ($scope.PatientSearchdata.CreateAlert === 1) {
                if ($scope.AlertObj.PriorityName === "") {
                    alertify.error("Please Enter the Priority!");
                    return false;
                }
            }

            var AlertTypesList = [];

            var TempArray = $filter("filter")($scope.AlertObj.AlertTypesList, function (kitem) { return kitem.AlertDeatilId != 0 || kitem.IsChecked == true });
            if (TempArray.length > 0) {
                AlertTypesList = angular.copy(TempArray);
            };

            var Array = $filter("filter")(AlertTypesList, function (kitem) { return kitem.DeleteInd == 'N'});

            if ($scope.PatientSearchdata.CreateAlert == 1) {
                if (Array.length == 0) {
                    alertify.error("Please Select the Screen!");
                    return false;
                }
            }

            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "PatientNoteId": $scope.AlertObj.PatientNoteId || 0,
                "AppointmentNoteId": $scope.AlertObj.AppointmentNoteId || 0,
                "NoteTypeId": $scope.AlertObj.AlertNoteTypeId,
                "NoteTypeName": $scope.AlertObj.AlertNoteName,
                "PatientId": PatientAlertsobj.PatientId,
                "AppointmentId": PatientAlertsobj.AppointmentId,
                "DeleteInd": "N",
                "Notes": $scope.AlertObj.AlertMessage,
                "CreateAlert": $scope.PatientSearchdata.CreateAlert,
                "AlertData": null,
            };

            if ($scope.PatientSearchdata.CreateAlert == 1 || $scope.AlertObj.AlertId !==0) {
                var AlertObj = {
                    "AlertId": $scope.AlertObj.AlertId,
                    "StartDate": $scope.AlertObj.StartDate,
                    "EndDate": $scope.AlertObj.EndDate || null,
                    "PriorityId": $scope.AlertObj.PriorityId,
                    "PriorityName": $scope.AlertObj.PriorityName,
                    "AlertTagId": $scope.AlertObj.AlertTagId,
                    "AlertTagName": $scope.AlertObj.AlertTagName,
                    "AlertMessage": $scope.AlertObj.AlertMessage,
                    "StatusId": $scope.AlertObj.StatusId,
                    "Status": $scope.AlertObj.Status,
                    "DeleteInd": $scope.AlertObj.DeleteInd,
                    "AlertTypesList": AlertTypesList,
                }
                obj.AlertData = AlertObj;
            }


            eHnoteInsuranceService.AddUpdatePatientNoteandAlertData(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                  
                    alertify.success("Patient alert added successfully!");
                    
                    $scope.ClearPatientAlert();
                    $scope.getPatientAlertsListNew();
                }

            },
            );
        };
        $scope.getPatientAlertsListNew = function () {
            $scope.PatientAlertsList = [];
            let obj = {
                "PatientId": PatientAlertsobj.PatientId,
                "OrganizationId": $scope.HospitalId,
                "StatusId": 1
            }
            $q.all([
                eHnoteInsuranceService.GetPatientAlertsNew(obj),
            ]).then(function (resp) {

                if (resp[0].data.Status == "Success") {
                    if (resp[0].data.rows.length > 0) {
                        $scope.PatientAlertsList = angular.copy(resp[0].data.rows) || [];
                        if ($scope.MasterAlertNoteType.length > 0) {
                            if (PatientAlertsobj.AlertNoteTypeId != undefined) {
                                let Id = PatientAlertsobj.AlertNoteTypeId || 0;
                                var NotesTypes = $filter("filter")($scope.MasterAlertNoteType, { "AlertNoteTypeId": Id })[0] || {};
                                $scope.AlertObj.AlertNoteTypeId = NotesTypes.AlertNoteTypeId || 0;
                                $scope.AlertObj.AlertNoteName = NotesTypes.AlertNoteName || "";
                            }
                        };
                    }
                }
            }, function (err) {
                console.log(err);
                alertify.error("Getting Data Failed");
            });
        };
        $scope.PatientAlertsAdditionalinfo = {
            templateUrl: 'PatientAlertsAdditionalinfo.html',
        };
        $scope.SelectedPatientNotesPopover = function (item) {
            $scope.PatientNotesLogData = item || [];
        }

        $scope.PatientNotesAdditionalinfo = {
            templateUrl: 'PatientNotesAdditionalinfo.html',
        };

        $scope.SelectedPatientNotesPopoverData = function (item) {
            $scope.PatientNotesLogArray = item || [];
        }

        $scope.PatientName = PatientAlertsobj.PatientFullName || '';
        $scope.PatientDisplayId = PatientAlertsobj.PatientDisplayID || '';
        $scope.PatientId = PatientAlertsobj.PatientId || 0;
        $scope.patiendetilsopen = function () {
            let patientId = $scope.PatientId || 0;
            eHnoteAuditServices.getPatientDetailsById(patientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
            function ongetPatientDetailsSuccess(data) {
                if (data !== undefined) {
                    var selectedPatientData = data;

                    $scope.PaitentDetails = {
                        "FullName": selectedPatientData.Patient[0].FullName || "",
                        "PatientDisplayId": selectedPatientData.Patient[0].PatientDisplayId || "",
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
                        "PCPDoctorName": selectedPatientData.Patient[0].PCPDoctorName || '',
                        "RefferalName": selectedPatientData.Patient[0].ReferralName || '',
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
        $scope.comparePatientNotes = function (oldObj, newObj) {

            oldObj = oldObj || {};
            newObj = newObj || {};

            let oldArr = [];
            let newArr = [];

            function fmtDate(d) {
                if (!d) return "";
                return $filter("date")(new Date(d), "MM-dd-yyyy");
            }


            function check(label, oldVal, newVal) {
                if ((oldVal || "") !== (newVal || "")) {
                    if (oldVal) oldArr.push(`${label} : ${oldVal}`);
                    if (newVal) newArr.push(`${label} : ${newVal}`);
                }
            }
            function isEmpty(obj) {
                return !obj || Object.keys(obj).length === 0;
            }

            let oldAlert = oldObj.AlertData && oldObj.AlertData.DeleteInd !== "Y"
                ? oldObj.AlertData
                : {};

            let newAlert = newObj.AlertData && newObj.AlertData.DeleteInd !== "Y"
                ? newObj.AlertData
                : {};

            if ((!isEmpty(newAlert) && !isEmpty(oldAlert)) || (isEmpty(newAlert) && isEmpty(oldAlert))) {
                oldObj.CreateAlert = newObj.CreateAlert || 1;
            }
            else if (!isEmpty(newAlert) && isEmpty(oldAlert)) {
                oldObj.CreateAlert = 2;
            }
            else if (isEmpty(newAlert) && !isEmpty(oldAlert)) {
                oldObj.CreateAlert = 1;
            }
            // Alert Yes/No
            check(
                "Alert",
                oldObj.CreateAlert == 1 ? "Yes" : "No",
                newObj.CreateAlert == 1 ? "Yes" : "No"
            );

            // Start Date 
            check("Start Date", fmtDate(oldAlert.StartDate), fmtDate(newAlert.StartDate));

            // End Date
            check("End Date", fmtDate(oldAlert.EndDate), fmtDate(newAlert.EndDate));

            // Priority
            check("Priority", oldAlert.PriorityName, newAlert.PriorityName);

            // Notes
            check("Notes", oldObj.PatientNotes, newObj.Notes);


            if (oldArr.length === 0 && newArr.length === 0) {
                return null;
            }

            return {
                old: oldArr.join("\n\n").trim(),
                new: newArr.join("\n\n").trim(),
            };
        };


        $scope.AlertObj.IsClickSavePatientAlertssBtn = false;
        $scope.AddPatientAlertNew = function () {
            $scope.LogObj.LogArray = [];
            $scope.AlertObj.AlertNoteTypeId = $scope.AlertObj.AlertNoteTypeId || null;
            if ($scope.AlertObj.AlertNoteTypeId === null) {
                alertify.error("Please Select the Note Type!");
                return false;
            }

            if ($scope.AlertObj.AlertMessage === "") {
                alertify.error("Please Enter the alert Message!");
                return false;
            }
            if ($scope.PatientSearchdata.CreateAlert === 1) {
                if ($scope.AlertObj.PriorityName === "") {
                    alertify.error("Please Enter the Priority!");
                    return false;
                }
            }
            $scope.AlertObj.IsClickSavePatientAlertssBtn = true;
            var AlertTypesList = [];

            var TempArray = $filter("filter")($scope.AlertObj.AlertTypesList, function (kitem) { return kitem.AlertDeatilId != 0 || kitem.AlertTypeId == 7 });
            if (TempArray.length > 0) {
                AlertTypesList = angular.copy(TempArray);
            };


            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "PatientNoteId": $scope.AlertObj.PatientNoteId || 0,
                "AppointmentNoteId": $scope.AlertObj.AppointmentNoteId || 0,
                "NoteTypeId": $scope.AlertObj.AlertNoteTypeId,
                "NoteTypeName": $scope.AlertObj.AlertNoteName,
                "PatientId": PatientAlertsobj.PatientId,
                "AppointmentId": PatientAlertsobj.AppointmentId,
                "DeleteInd": "N",
                "Notes": $scope.AlertObj.AlertMessage,
                "CreateAlert": $scope.PatientSearchdata.CreateAlert,
                "AlertData": null,
                "Logs": {}
            };

            if ($scope.PatientSearchdata.CreateAlert == 1 || $scope.AlertObj.AlertId !== 0) {
                var AlertObj = {
                    "AlertId": $scope.AlertObj.AlertId,
                    "StartDate": $scope.AlertObj.StartDate,
                    "EndDate": $scope.AlertObj.EndDate || null,
                    "PriorityId": $scope.AlertObj.PriorityId,
                    "PriorityName": $scope.AlertObj.PriorityName,
                    "AlertTagId": $scope.AlertObj.AlertTagId,
                    "AlertTagName": $scope.AlertObj.AlertTagName,
                    "AlertMessage": $scope.AlertObj.AlertMessage,
                    "StatusId": $scope.AlertObj.StatusId,
                    "Status": $scope.AlertObj.Status,
                    "DeleteInd": $scope.AlertObj.DeleteInd,
                    "AlertTypesList": AlertTypesList,
                }
                obj.AlertData = AlertObj;
            }

            if (obj != "") {
                let resultProc = $scope.comparePatientNotes(
                    $scope.LogObj.AlertData,      // OLD
                    obj     // NEW
                );

                let oldDesc = "";
                let newDesc = "";
                if (resultProc.old || resultProc.new) {

                    let header = "Patient Notes\n";

                    if (resultProc.old) {
                        oldDesc += header + resultProc.old;
                    }
                    if (resultProc.new) {
                        newDesc += header + resultProc.new;
                    }
                }

                if (oldDesc || newDesc) {
                    $scope.LogObj.LogArray.push({
                        LogId: 0,
                        ModuleId: 1,
                        ModuleName: "OUTPatient",
                        SubModuleId: 62,
                        SubModuleName: "Patient Notes",
                        ScreenType: "Patient Notes",
                        ActionType: oldDesc ? "Edited" : "Added",
                        OldActionDescription: oldDesc.trim(),
                        NewActionDescription: newDesc.trim(),
                        ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                    });
                }
            }
            if ($scope.LogObj.LogArray.length > 0) {
                obj.Logs = $scope.LogObj || {};
            }
            eHnoteInsuranceService.AddUpdatePatientNoteandAlertData(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    alertify.success("Patient alert added successfully!");
                    $scope.AlertObj.IsClickSavePatientAlertssBtn = false;
                     $uibModalInstance.close();
                }
                $scope.AlertObj.IsClickSavePatientAlertssBtn = false;
            },
            );
        };

    }



]);

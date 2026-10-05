"use strict";
eHnoteWebApp.controller('EhnoteCommunicationCtrl', ['$scope', "$mdDialog", "EhnoteCrmService", "$filter", "$location", "eHnoteMasterDataService", "eHnoteLoginStatusService", "$rootScope", "eHnoteMainAppointmentService", "eHnotePatientDataService", "alertify", "$timeout", "InventoryService", "eHnoteMainDashboardDataServices", "datapersistanceFactory", function ($scope, $mdDialog, EhnoteCrmService, $filter, $location, eHnoteMasterDataService, eHnoteLoginStatusService, $rootScope, eHnoteMainAppointmentService, eHnotePatientDataService, alertify, $timeout, InventoryService, eHnoteMainDashboardDataServices, datapersistanceFactory) {


    //L = Lead
    //P = Patient
    //d = Doctor


    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
   
    if (userLoginDetails.loggedinStatus) {
        $rootScope.showMainPageHeader = true;
    } else {
        $rootScope.showMainPageHeader = false;
        datapersistanceFactory.clearAll();
        $location.path('/login');
    }
    $scope.PatientPerPage = 10;

   

      

   
    
    

    $scope.Tab = 1;
  
    $scope.switchTab = function (item) {
        $scope.Tab = item;

        if ($scope.Tab ==2) {
            $scope.ChangeSms();
        }
    }

    


    $scope.searchRadio = {
        "PatientsearchType": 2,
        
    }
    function getSelectedpatient() {

        var obj = {
            "SearchText": "",
            "PatientId": 0
        }
        return obj;
    };
    $scope.patientSearch = getSelectedpatient();
    $scope.AllPatientList = [];
    
        



        $scope.LoadPatientsearch = function (val) {

            if (val == undefined || val == null || val == "") {
                $scope.AllPatientList = [];
                $scope.patientSearch.PatientId = 0;
                return false;
            }

            var object = {              
                "ParentOrganizationId": $scope.ParentHospitalId,
                "Name": null,
                "Mobile": null,
                "PatientId": null,
                "PageSize": 30,
                "PageNo": 1
            }

            if ($scope.searchRadio.PatientsearchType == 1) {
                object.Name = val;
            } else if ($scope.searchRadio.PatientsearchType == 2) {
                object.PatientId = val;
            }

          InventoryService.SearchInvPatient(object).then(function (resp) {
            if (resp.data.data.length !== 0) {
                if (resp.data.data != undefined) {
                    $scope.AllPatientList = [];
                    var patientList = resp.data.data || [];
                    angular.forEach(patientList, function (items) {
                        var obj = {
                            "FullName": items.fullname,
                            "PatientId": items.PatientId,
                            "PatientHomeNumber": items.MobileNo,
                            "PatientDisPlayID": items.PatientDisplayId
                        };
                        $scope.AllPatientList.push(obj);
                    });
                }
              }   else {
                $scope.patients = [];
                 }
           }, function (err) { console.log(err); alertify.error("Search Patient Failed"); });
        };


    $scope.Selectedpatient = function (pitem) {
        $scope.patientSearch.PatientId = pitem.PatientId;
        $scope.AllPatientList = [];

    }
    $scope.changesearchType = function (id) {
        $scope.searchRadio.PatientsearchType = id;
        $scope.patientSearch = getSelectedpatient();
        $scope.AllPatientList = [];
    }
   


    $scope.SMSHistorySearch = {
        
        "FromDate": $filter("date")(new Date(), "dd-MM-yyyy"),
        "ToDate": $filter("date")(new Date(), "dd-MM-yyyy"),
        "PageNumber": 1,
        "PatientId": null,
        "PageSize": 10,
    }
    

    $scope.currentPage = 1;
    
    
    $scope.SMSHistoryListArray = [];

    $scope.ChangeSms = function () {
        var Object = {
            "FromDate": $scope.SMSHistorySearch.FromDate,
            "ToDate": $scope.SMSHistorySearch.ToDate,
            "PatientId": null,
            "PageSize": $scope.SMSHistorySearch.PageSize,
            "PageNumber": $scope.SMSHistorySearch.PageNumber,
        };
      

        Object.FromDate = $filter("dateFormatter")(Object.FromDate, "-");
        Object.ToDate = $filter("dateFormatter")(Object.ToDate, "-");
       

        eHnotePatientDataService.GetAllPatientsSMSHistory(Object).then(function (resp) {
            $scope.SMSHistoryListArray = [];
            if (resp.data.status === "Success"  ) {
                $scope.SMSHistoryListArray = resp.data.rows || [];
                $scope.SMSHistoryListArrayCount = resp.data.count;
            }
        });
        
    }
   

    $scope.Changepage = function (currentPage) {
        $scope.SMSHistorySearch.PageNumber = currentPage || 1;
        $scope.ChangeSms();
    }

    $scope.ClearList = function () {
     
        $scope.SMSHistoryListArray = [];
        $scope.SMSHistorySearch = {

            "FromDate": $filter("date")(new Date(), "dd-MM-yyyy"),
            "ToDate": $filter("date")(new Date(), "dd-MM-yyyy"),
            "PageNumber": 1,
            "PatientId": null,
            "PageSize": 10,
        }
        $scope.ChangeSms();

    }

 



  
    
    $scope.Search = {
        "FromDate": $filter("date")(new Date(), "dd-MM-yyyy"),
        "ToDate": $filter("date")(new Date(), "dd-MM-yyyy"),
        //"ToDate": $filter("date")(new Date().setDate(new Date().getDate() - 30), "dd-MM-yyyy"),
        "HospitalId": null,
        "ScreenTypeId": null,
        "SubScreenTypeId": null,
        "PageNumber": 1,
        "PageSize": 10,
        "sendMessageTextForSMS": "",
        "GetAllIndicator": 0,
        "HeaderCommunicationType": "SMS"
    };

 


    $scope.hospid = "";
    $scope.parenthospid = "";
    var doctorinfo = eHnoteMasterDataService.getUserInfo();

    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    console.log($scope.UserAccessRights);
    $scope.ParentHospitalId = 0;
    
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
        $scope.hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.parenthospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.Search.HospitalId = $scope.hospid;
        $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    }

    $scope.Branches = [];
    $scope.GetBranches = function () {
        InventoryService.GetBranches($scope.parenthospid).then(function (resp) {
            if (resp.data.Status !== 1) {
                alertify.error(resp.data.Message);
                $scope.Branches = [];
            } else {
                $scope.Branches = resp.data.data;

                console.log($scope.Branches);
                $scope.Search.SelectedBranch = $filter("filter")($scope.Branches, { "OrganizationId": $scope.hospid }, true)[0];
                $scope.Search.HospitalId = $scope.Search.SelectedBranch.OrganizationId;


            }
        }, function (err) {
            alertify.error("Getting Branches Failed");
            console.log(err);
        });
    };
    $scope.GetBranches();
    //$scope.Init = function () {


    //};
    //$scope.Init();

    $scope.changehospital = function (item) {
        item = item || null;
        if (item !== null) {
            $scope.Search.HospitalId = item;
            $scope.GetAllIndicator = 0;
        }
        //else {
        //    $scope.Search.HospitalId = item;
        //    $scope.GetAllIndicator = 1;
        //}
    };


    $scope.showpagination = true;
    $scope.Communicationsarray = [];
    $scope.CommunicationSubScreenType = [];
    //  $scope.init1 = function () {
    eHnoteMainDashboardDataServices.GetCommunicationScreenType(CommunicationSuccess, CommunicationError);
    function CommunicationSuccess(resp) {
        $scope.Communicationsarray = resp.rows;
        $scope.Search.ScreenTypeId = $scope.Communicationsarray[8].ScreenTypeId;
        $scope.getCommunicationScreen($scope.Search.ScreenTypeId);
    }
    function CommunicationError(err) {
    }
    //}




    $scope.getCommunicationScreen = function (item) {
        item = item || null;
        if (item !== null) {
            eHnoteMainDashboardDataServices.GetCommunicationSubScreenType(item, onSuccessScreenType, onFailedScreenType);
            function onSuccessScreenType(resp) {
                $scope.CommunicationSubScreenType = resp.rows;
                $scope.Search.SubScreenTypeId = $scope.CommunicationSubScreenType[0].SubScreenTypeId;
            }
            function onFailedScreenType(err) {
            }

        }
        else {
            $scope.Search.SubScreenTypeId = null;
        }
    };


    $scope.Communicationlist = function (page, maxsize) {
        var obj = {
            "ScreenType": $scope.Search.ScreenTypeId || 9,
            "SubType": $scope.Search.SubScreenTypeId || 17,
            "StartDate": $scope.Search.FromDate,
            "EndDate": $scope.Search.ToDate,
            "HospitalId": $scope.Search.HospitalId,
            "GetAllIndicator": $scope.Search.GetAllIndicator,
            "HeaderCommunicationType": $scope.Search.HeaderCommunicationType,
            "PageNumber": page || $scope.Search.PageNumber,
            "PageSize": maxsize || $scope.Search.PageSize

        };
        //if (obj.HospitalId !== null) {
        //    obj.GetAllIndicator = 0;
        //} else {
        //    obj.HospitalId = $scope.parenthospid;
        //    obj.GetAllIndicator = 1;
        //}
        obj.StartDate = $filter("dateFormatter")(obj.StartDate, "-");
        obj.EndDate = $filter("dateFormatter")(obj.EndDate, "-");
        EhnoteCrmService.GetPatientListByScreenType(obj).then(function (resp) {
            // if (resp.data.Status === 1) {
            // $scope.CommunicationLeads = resp.data.rows;
            //   if (resp.data.rows.length > 0) {
            //if (resp.data.ScreenTypeName === "Lead") {
            //    $scope.CommunicationLeads = resp.data.rows;
            //    $scope.TotalLeadPatients = resp.data.count;
            //    $scope.activeTabCommunication = 3;

            //}
            //else
            if (maxsize === 500000) {
                $scope.showpagination = false;
            }
            else {
                $scope.showpagination = true;
            }
            if (resp.data.ScreenTypeName === "OPD" || resp.data.ScreenTypeName === "Surgery" || resp.data.ScreenTypeName === "Opticals" || resp.data.ScreenTypeName === "Pharmacy" || resp.data.ScreenTypeName === "Staff" || resp.data.ScreenTypeName === "Patients" || resp.data.ScreenTypeName === "Followup" || resp.data.ScreenTypeName === "BirthdayWishes" || resp.data.ScreenTypeName === "Lead") {
                $scope.Screentype = resp.data.ScreenTypeName;
                $scope.communicationpatientlist = resp.data.rows;
                $scope.Totalpatientlist = resp.data.count;
                $scope.activeTabCommunication = 11;

            }
        }, function (err) {
            console.log(err);
            $scope.availableSMSTemplates = [];
        });
    };
    $scope.Communicationlist();


    $scope.addPatientsToGrpPopup = function (data) {
        $scope.AddGroupspopup = true;
        $scope.GroupTypeId = data[0].Type;
        $scope.GroupDetailsData = data;
        $scope.GetAllGroups();
    };

    // $scope.Groupslist = false;
    // $scope.Groupinpatientlist = true;
    $scope.GetAllGroups = function () {
        $scope.Groupslist = false;
        $scope.Groupinpatientlist = true;
        var obj = {
            //"HospitalId": parentHospitalId,
            "HospitalId": $scope.Search.HospitalId,
            "GetAllIndicator": true,
            "GroupTypeId": $scope.Search.ScreenTypeId
        };
        if (obj.HospitalId === null) {
            obj.HospitalId = parentHospitalId;
        } else {
            obj.GetAllIndicator = false;
        }
        EhnoteCrmService.GetAllCommunicationGroups(obj).then(function (resp) {
            $scope.GroupsList = resp.data;
            $scope.activeTabCommunication = 9;
        }, function (err) {
        });
    };

    $scope.pagepatientChanged = function (PatientPage) {
        $scope.Communicationlist(PatientPage);
    };



    $scope.addPatientMobile1 = function (item) {
        $scope.activeTabCommunication == 9;
        if (item.Selected) {
            $scope.Patient_final_data.push({
                "Name": item.PatientName || item.DoctorName,
                "Phone": item.MobileNo,
                "Email": item.Email || null,
                "PatientId": item.MRNO,
                "Type": item.ScreenType,
                "LeadId": null,
                "DoctorId": null
            });
            if ($scope.selecteAllPatients !== undefined || $scope.selecteAllPatients) {
                $scope.selecteAllPatients = false;
            }
        } else {
            var ind = $scope.Patient_final_data.findIndex(x => x.Phone === item.PhoneNumber);
            $scope.Patient_final_data.splice(ind, 1);
            if ($scope.selecteAllPatients !== undefined || $scope.selecteAllPatients) {
                $scope.selecteAllPatients = false;
            }
        }
        $scope.NumOfPatientSelected = $scope.Patient_final_data.length;
        if ($scope.Patient_final_data.length === $scope.getPatientList.length && $scope.getPatientList.length !== 0) {
            $scope.selecteAllPatients = true;
        }
    };

    $scope.ShowDashBoard = function () {
        $scope.activeTabCommunication = 11;
        $scope.NumOfPatientSelected = 0;
    };
    $scope.checkAllPatients1 = function (selecteAllPatients) {
        var maxsize = 500000;
        $scope.Communicationlist('', maxsize);
        $timeout(function () {

            if (selecteAllPatients) {
                $scope.Patient_final_data = [];
                angular.forEach($scope.communicationpatientlist, function (item, index) {
                    item.Selected = selecteAllPatients;


                    $scope.Patient_final_data.push({
                        "Name": item.PatientName,
                        "Phone": item.MobileNo,
                        "Email": item.Email || null,
                        "DoctorId": null,
                        "Type": item.ScreenType,
                        "LeadId": null,
                        "PatientId": item.PatientID
                    });


                });
                $scope.NumOfPatientSelected = $scope.Patient_final_data.length;
            } else {
                angular.forEach($scope.getPatientList, function (item, index) {
                    item.Selected = selecteAllPatients;
                });
                $scope.Patient_final_data = [];
                $scope.NumOfPatientSelected = $scope.Patient_final_data.length;
            }
        }, 1000);


    };
    $scope.AddNewGroup = function (item, item2) {
        $scope.LeadUserGroupId = 0;
        item = item || "";
        if (item !== "") {
            $scope.LeadUserGroupId = 0;
            var ExistArray = $filter("filter")($scope.GroupsList, { "GroupName": item }, true);
            if (ExistArray.length > 0) {
                alertify.error("Group Name Is Already Exisit");
                return false;
            }
        } else {
            $scope.LeadUserGroupId = item2.LeadUserGroupId;
            angular.forEach(item2.GroupDetails, function (subitem) {
                $scope.GroupDetailsData.push(subitem);
            });
        }
        var obj = {
            "UserId": $scope.User.UserId,
            "GroupName": item === "" || item === null ? item2.GroupName : item,
            //"HospitalId": parentHospitalId,
            "HospitalId": $scope.Search.HospitalId,
            "LeadUserGroupId": $scope.LeadUserGroupId,
            "GroupTypeId": $scope.GroupDetailsData[0].Type,
            "ActiveInd": "Y",
            "GroupDetails": $scope.GroupDetailsData
        };

        if (obj.GroupName === undefined || obj.GroupName === '') {
            alertify.error("Group Name Is Mandatory");
            return false;
        }

        EhnoteCrmService.AddNewCommunicationGroup(obj).then(function (resp) {
            if (resp.data.status === "Success") {
                $scope.GetAllGroups();
                $scope.AddGroupspopup = false;
                $scope.CommunicationGropuname = "";
                $scope.NumOfPatientSelected = 0;
                $scope.final_data = [];
                $scope.Patient_final_data = [];
                $scope.LeadPatient_final_data = [];
                alertify.success("Group Added Successfully");
                // $scope.GetAllDashBoardCount();
                //angular.forEach($scope.getPatientList, function (item) {
                //    item.Selected = false;
                //});
                angular.forEach($scope.communicationpatientlist, function (item) {
                    item.Selected = false;
                });
            } else {
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            console.log(err);
            alertify.success("Saving group failed");
        });
    };











    $scope.changeBirthWishStatus = function (val, item) {
        if (val === 1) {
            var obj = {
                "SMSind": item.SMSind ? false : true,
                "PatientId": item.PatientId,
                "BSMSind": false
            };

        } else {
            var obj = {
                "SMSind": false,
                "BSMSind": item.SMSind ? false : true,
                "PatientId": item.PatientId
            };
        }
        EhnoteCrmService.communicationStatusChange(obj).then(function (resp) {

            if (val === 1) {
                //  $scope.GetAllFollowUps();
                $scope.Communicationlist();
            } else {
                // $scope.GetAllBirthDayWishes(1);
                $scope.Communicationlist();
            }

        }, function (err) {
        });
    };

    var checkArray = [];
    $scope.User = {};
    $scope.User.UserId = eHnoteMasterDataService.getLoginId();
    $scope.User.RoleId = userLoginDetails.RoleID;
    $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
    var parentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    $scope.hospid = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    $scope.LeadPatient_final_data = [];
    $scope.LeadPatientPageSize = 3;
    $scope.currentPage = 1;
    $scope.PatientPageSize = 5;
    $scope.maxsize = 5;
    $scope.sendOption = "SMS";
    $scope.TemplateDetailId = 0;
    $scope.HospitalIDLst = [];
    $scope.CommunicationLeads = [];
    $scope.getPatientList = [];
    $scope.DoctorList = [];
    $scope.final_data = [];
    $scope.availableSMSTemplates = [];
    $scope.NumOfLeadPatientSelected = 0;
    $scope.NumOfPatientSelected = 0;
    $scope.NumOfGroupsSelected = 0;
    $scope.showList = 'LEADPAT_LIST';
    $scope.orgUsersData = $scope.doctorinfo.doctordata.UserAddress;
    if ($scope.orgUsersData[0] !== undefined) {
        $scope.HospitalName = $scope.orgUsersData[0].ClinicName;
        $scope.Location = $scope.orgUsersData[0].Location;
        $scope.BranchEmail = $scope.orgUsersData[0].BranchEmail;
        $scope.MobileNo = $scope.orgUsersData[0].MobileNo;
    }

    $scope.showListMenu = function (showListMenu) {
        $scope.grpsForSendingMsgs = [];
        $scope.showList = showListMenu;
    };
    $scope.LeadPatientPerPage = 10;




    $scope.CommunicationAccess = {
        "ListPatientsTabAccess": false,
        "ListDoctorsTabAccess": false,
        "PatientLeadsTabAccess": false,
        "SMSTemplateTabAccess": false
    };


    $scope.UserAccessList = [];
    if ($scope.doctorinfo !== "") {
        if ($scope.doctorinfo.doctordata.User !== undefined) {
            $scope.UserAccessList = $scope.doctorinfo.doctordata.User[0].UseAccessDetails;
            $rootScope.ParentSpecializationId = $scope.doctorinfo.doctordata.User[0].SpecializationId;
            checkUserAccessPermissions();
        }
    }



    //Access Code Added By Durga on 01-10-2019


    function checkUserAccessPermissions() {
        angular.forEach($scope.UserAccessList, function (item) {
            if (item.AccessCategoryId === 5 && item.ActiveInd === "Y") {
                angular.forEach(item.AccessList, function (citem) {
                    if (citem.AccessRightId === 23 && citem.ActiveInd === "Y") {
                        $scope.CommunicationAccess.ListPatientsTabAccess = true;
                    }
                    if (citem.AccessRightId === 24 && citem.ActiveInd === "Y") {
                        $scope.CommunicationAccess.ListDoctorsTabAccess = true;
                    }
                    if (citem.AccessRightId === 25 && citem.ActiveInd === "Y") {
                        $scope.CommunicationAccess.PatientLeadsTabAccess = true;
                    }
                    if (citem.AccessRightId === 26 && citem.ActiveInd === "Y") {
                        $scope.CommunicationAccess.SMSTemplateTabAccess = true;
                    }
                });
            }
        });
    }





    //$scope.activeTabCommunication = 3;
    //$scope.ChangeTabcommunication = function (type) {
    //    checkArray = [];
    //    $scope.NumOfGroupsSelected = 0;
    //    $scope.GroupList_final_data = [];
    //    $scope.selecteAllGroups = false;
    //    $scope.selecteAllPatients = false;
    //    if (type === 3) {
    //        $scope.GetCommunicationLeads(1);
    //    }
    //    if (type === 6) {

    //        $scope.GetAllPatientsForSms(1);
    //    }
    //    if (type === 7) {
    //        $scope.GetAllDoctors();
    //    }
    //    if (type === 4) {
    //        $scope.GetAllBirthDayWishes(1);
    //    }
    //    if (type === 8) {
    //        $scope.GetAllFollowUps();
    //    }
    //    if (type === 9) {
    //        $scope.Groupslist = false;
    //        $scope.Groupinpatientlist = true;
    //        $scope.GetAllGroups();
    //    }
    //    if (type === 10) {
    //        $scope.GetBranches();
    //    }
    //    $scope.activeTabCommunication = type;
    //};
    //$scope.GetAllFollowUps = function () {
    //    var obj = {
    //        "OrgId": parentHospitalId,
    //        "Fromdate": '',
    //        "Todate": '',
    //        "PageSize": 20,
    //        "PageNumber": 1
    //    };
    //    EhnoteCrmService.GetAllFollowUps(obj).then(function (resp) {
    //        $scope.communicationFollowups = resp.data;
    //    }, function (err) {
    //    });
    //};

    //$scope.GetAllGroups();
    $scope.GetAllBirthDayWishes = function (page) {

        var obj = {
            "OrgId": parentHospitalId,
            "Fromdate": '',
            "Todate": '',
            "PageSize": 10,
            "PageNumber": page
        };
        EhnoteCrmService.GetBirthDayWishes(obj).then(function (resp) {
            $scope.communicationBirthDayWish = resp.data;
            $scope.BirthTotalItem = $scope.communicationBirthDayWish[0].fcount;
        }, function (err) {
        });
    };
    $scope.BirthDayPageChanged = function (page) {
        //$scope.GetAllBirthDayWishes(page);
        $scope.Communicationlist(page);
    };

    $scope.pageChanged = function (LeadPatientPage) {
        // $scope.GetCommunicationLeads(LeadPatientPage);
        $scope.Communicationlist(LeadPatientPage);
    };
    //$scope.GetCommunicationLeads = function (LeadPatientPage) {
    //    var obj = {
    //        "Name": null,
    //        "Mobile": null,
    //        "LeadstatusId": null,
    //        "OrgId": parentHospitalId,
    //        "PageSize": 10,
    //        "PageNumber": LeadPatientPage,
    //        "CreatedBy": null
    //    };
    //    EhnoteCrmService.getLeadPatients(obj).then(function (resp) {
    //        if (resp.data.Status === 1) {
    //            $scope.CommunicationLeads = resp.data.data;
    //            if ($scope.CommunicationLeads.length === 0) {
    //                $scope.TotalLeadPatients = 0;
    //            } else {
    //                $scope.TotalLeadPatients = $scope.CommunicationLeads[0].TotalLeadPatients;
    //            }
    //            var checkedCount = 0;
    //            if ($scope.LeadPatient_final_data.length !== 0) {
    //                angular.forEach($scope.CommunicationLeads, function (item, index) {
    //                    var ind = $scope.LeadPatient_final_data.findIndex(x => x.Phone === item.Mobile);
    //                    if (ind !== -1) {
    //                        $scope.CommunicationLeads[index].Selected = true;
    //                        checkedCount++;
    //                    }
    //                });
    //                if (checkedCount === $scope.CommunicationLeads.length) {
    //                    $scope.selecteAllLeadPatients = true;
    //                } else {
    //                    $scope.selecteAllLeadPatients = false;
    //                }
    //            }
    //        }
    //    }, function (err) {
    //    });
    //};
    //$scope.GetCommunicationLeads(1);
    $scope.GetAllDashBoardCount = function () {
        var obj = {
            "OrgId": parentHospitalId,
            "Fromdate": '',
            "Todate": ''
        };
        EhnoteCrmService.GetAllCommunicationDashBoard(obj).then(function (resp) {
            $scope.GetDashBoardCommDetails = resp.data[0];

        }, function (err) {
        });
    };
    $scope.GetAllDashBoardCount();


    $scope.GetAllPatientsForSms = function (PatientPage) {
        var param = eHnoteMasterDataService.getPatientSearchInfo();

        param.UserId = null;
        param.PageSize = 21;
        param.PageNumber = PatientPage;
        param.SearchText = "";
        param.SearchDetails = { "PatientType": "" };
        param.PhoneNumber = "";
        param.EndAge = 0;
        param.StartAge = 0;
        param.Count = 0;
        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID !== undefined) {
            param.HospitalID = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            param.HospitalIDLst = [];
        }
        var docParams = {
            "PageSize": 10,
            "PageNumber": PatientPage,
            "HospitalID": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "ActiveDoctors": "Y"
        };
        eHnoteMainAppointmentService.getClinicDoctorsWithRoles(docParams, onListDocSuccess, OnListDocFailed);
        function onListDocSuccess(data) {

            var list = [];


            angular.forEach(data, function (item) {
                list.push(item.HospitalInfo.HospitalDetails.HospitalID);
            });
            if (list.length === 0) {
                list.push($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID);
            }
            param.HospitalIDLst = list;
            delete param.DoctorID;
            param.GetAllSpecializationInd = true;
            param.GetAllPatientInd = true;
            eHnotePatientDataService.SearchPatient1(param, OnGetPatientSuccess, OnGetSubmitPatientError, $scope.sendhospcode);
        }
        function OnListDocFailed(err) {
            console.log(err);
        }

    };

    function OnGetPatientSuccess(data) {
        $scope.count = data.count;
        $scope.totalItems = data.count;
        $scope.getPatientList = [];
        angular.forEach(data.rows, function (item) {
            $scope.patientinitval = {};
            $scope.patientinitval.PatientID = item.PatientId;
            $scope.patientinitval.Title = item.Title;
            $scope.patientinitval.FullName = item.FullName;
            $scope.patientinitval.DOB = item.DOB;
            $scope.patientinitval.Age = item.Age;
            $scope.patientinitval.EmailID = item.EmailID;
            $scope.patientinitval.Gender = item.Gender;
            $scope.patientinitval.LastVisited = item.LastVisited;
            $scope.patientinitval.PhoneNumber = item.PhoneNumber;
            $scope.patientinitval.CurrentAge = item.CurrentAge;
            $scope.patientinitval.patientCaseBillingAmtInfo = item.patientCaseBillingAmtInfo;
            $scope.patientinitval.patientdisplayid = item.DisplayID;
            $scope.patientinitval.Reviewed = item.Reviewed === undefined ? "N" : item.Reviewed;
            $scope.patientinitval.ProfileImg = item.ProfileImg;
            $scope.patientinitval.familydisplayid = item.FamilyDisplayID;
            $scope.getPatientList.push($scope.patientinitval);
        });
    }
    function OnGetSubmitPatientError(data) {
        $scope.getPatientList = [];
        $scope.totalItems = 0;
    }
    $scope.GetAllDoctors = function () {

        var clinicParams = {
            "PageSize": 1000,
            "PageNumber": 1,
            "ActiveDoctors": "Y",
            "HospitalID": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID
        };
        eHnoteMainAppointmentService.getClinicDoctorsWithRoles(clinicParams, OnGetDoctorSuccess, OnGetDoctorError);
    };
    function OnGetDoctorSuccess(data) {
        $scope.DoctorList = [];
        $scope.AllDoctorList = [];
        if (data.length !== 0) {
            angular.forEach(data, function (item, index) {
                if (item.DoctorDetails !== undefined) {
                    if (item.HospitalInfo.HospitalDetails.ActiveIND === "Y" && item.DoctorDetails.length > 0) {
                        $scope.AllDoctorList = $scope.AllDoctorList.concat(item.DoctorDetails);
                    }
                }
            });
            $scope.DoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
            $scope.DoctorList = _.sortBy($scope.DoctorList, "FullName");
        }
    }
    function OnGetDoctorError(err) {
        console.log(err);
    }




    $scope.LeadPatient_final_data = [];
    $scope.checkAllLeadPatients = function (selecteAllLeadPatients) {
        if (selecteAllLeadPatients) {

            angular.forEach($scope.CommunicationLeads, function (item) {
                checkArray.push(1);
                item.Selected = selecteAllLeadPatients;

                var ind = $scope.LeadPatient_final_data.findIndex(x => x.Phone === item.Mobile);

                if (ind === -1) {



                    $scope.LeadPatient_final_data.push({
                        "Name": item.Name,
                        "Phone": item.Mobile,
                        "Email": item.Email,
                        "DoctorId": null,
                        "Type": "L",
                        "LeadId": item.LeadId,
                        "PatientId": null
                    });

                }

            });
            $scope.NumOfLeadPatientSelected = $scope.LeadPatient_final_data.length;
        } else {
            angular.forEach($scope.CommunicationLeads, function (item) {
                checkArray = [];
                item.Selected = selecteAllLeadPatients;

                var ind = $scope.LeadPatient_final_data.findIndex(x => x.Phone === item.Mobile);

                $scope.LeadPatient_final_data.splice(ind, 1);

            });



            $scope.NumOfLeadPatientSelected = $scope.LeadPatient_final_data.length;
        }
    };
    $scope.GroupName = '';
    $scope.CloseAddGroup = function () {
        $scope.AddGroupspopup = false;
        $scope.CommunicationGropuname = "";
        $scope.GroupName = '';
    };

    //$scope.changebuttoncommunication = 'Email';
    $scope.headerComunication = 'SMS';
    $scope.changeToComunicationBody = function (changebuttoncommunication) {
        //if (changebuttoncommunication === 'Email') {
        //    $scope.changebuttoncommunication = 'SMS';
        //    $scope.headerComunication = 'Email';
        //} else {
        //    $scope.changebuttoncommunication = 'Email';
        //    $scope.headerComunication = 'SMS';
        //}
        if (changebuttoncommunication === 'SMS') {
            //$scope.changebuttoncommunication = 'SMS';
            $scope.headerComunication = 'SMS';
        } else {
            //$scope.changebuttoncommunication = 'Email';
            $scope.headerComunication = 'Email';
        }

    };

    $scope.GroupList_final_data = [];
    $scope.addGroupsMobile = function (item) {

        if (item.Selected) {
            checkArray.push(1);
            $scope.GroupList_final_data.push(item);
        } else {
            if (checkArray.length > 0)
                checkArray.splice(parseInt(checkArray.length - 1), 1);
            var ind = $scope.GroupList_final_data.findIndex(x => x.GroupName === item.GroupName);
            $scope.GroupList_final_data.splice(ind, 1);
        }
        if (checkArray.length > 0 && checkArray.length === $scope.GroupsList.length) {
            $scope.selecteAllGroups = true;
        } else {
            $scope.selecteAllGroups = false;
        }
        $scope.NumOfGroupsSelected = $scope.GroupList_final_data.length;
        $scope.deletegroup = item;
    };



    $scope.addLeadPatientMobile = function (item) {
        if (item.Selected) {
            checkArray.push(1);
            $scope.LeadPatient_final_data.push({
                "Name": item.Name,
                "Phone": item.Mobile,
                "Email": item.Email,
                "LeadId": item.LeadId,
                "PatientId": null,
                "DoctorId": null,
                "Type": "L"
            });
            if ($scope.selecteAllLeadPatients !== undefined || $scope.selecteAllLeadPatients) {
                $scope.selecteAllLeadPatients = false;
            }
        } else {
            if (checkArray.length > 0) {
                checkArray.splice(parseInt(checkArray.length - 1), 1);
            }

            var ind = $scope.LeadPatient_final_data.findIndex(x => x.Phone === item.Mobile);
            $scope.LeadPatient_final_data.splice(ind, 1);
            if ($scope.selecteAllLeadPatients !== undefined || $scope.selecteAllLeadPatients) {
                $scope.selecteAllLeadPatients = false;
            }
        }
        $scope.NumOfLeadPatientSelected = $scope.LeadPatient_final_data.length;


        var pagepart = $scope.LeadPatient_final_data.length / $scope.CommunicationLeads.length;


        if (checkArray.length > 0 && checkArray.length === $scope.CommunicationLeads.length) {
            $scope.selecteAllLeadPatients = true;
        }
        else {
            $scope.selecteAllLeadPatients = false;
        }




    };


    $scope.Patient_final_data = [];

    $scope.GetAllSmsTemplates = function () {

        EhnoteCrmService.GetAllSmsTemplates(parentHospitalId, $scope.User.UserId).then(function (resp) {
            if (resp.data.Status === 1) {
                $scope.availableSMSTemplates = resp.data.data;
            }
        }, function (err) {
            console.log(err);
            $scope.availableSMSTemplates = [];
        });
    };
    $scope.GetAllSmsTemplates();


    $scope.AllBranches = [];
    $scope.GetAllBranchAddress = function () {
        EhnoteCrmService.GetAllBranchAddress(parentHospitalId).then(function (resp) {
            if (resp.data.Status === 1) {
                $scope.AllBranches = resp.data.data;
            }
        }, function (err) {
            console.log(err);
            $scope.AllBranches = [];
        });
    };
    $scope.GetAllBranchAddress();


    $scope.SendMessage = function (PhoneNumber, sendMessageTextForSMS) {



        if (!$scope.UserAccessRights.AllAccessRights.SMSSendsms) {
            alertify.error("Sorry You Dont have Access,Please Contact Administrator");
            return false;
        }

        $scope.ManualPhoneNumber = PhoneNumber;
        $scope.Search.sendMessageTextForSMS = sendMessageTextForSMS;
        $scope.sendSmsToAllDoctors();

    };
    $scope.SubjectDescription = "";
    $scope.SendEmailMessage = function (PatientEmailNumber, sendMessageTextForSMS) {
        $scope.ManualEmailNumber = PatientEmailNumber;
        $scope.Search.sendMessageTextForSMS = sendMessageTextForSMS;
        $scope.SendEmailToAllMembers();
    };

    $scope.SendEmailToAllMembers = function () {
        $scope.Search.sendMessageTextForSMS = $scope.Search.sendMessageTextForSMS || "";
        $scope.ManualEmailNumber = $scope.ManualEmailNumber || "";

        if ($scope.Search.sendMessageTextForSMS === "") {
            alertify.error("Please Enter Message");
            return;
        }
        var tempArray = [];
        if ($scope.ManualEmailNumber === "") {
            if (($scope.Patient_final_data.length === 0 && $scope.final_data.length === 0 && $scope.LeadPatient_final_data.length === 0 && $scope.GroupList_final_data.length === 0)
                || ($scope.Patient_final_data.length !== 0 && $scope.final_data.length !== 0 && $scope.LeadPatient_final_data.length !== 0 && $scope.GroupList_final_data.length !== 0)) {
                alertify.error("Please Select Patients Or Doctors");
                return;
            }
            tempArray = $scope.Patient_final_data.concat($scope.final_data);
            tempArray = tempArray.concat($scope.LeadPatient_final_data);
            $scope.Indiv_Group_final_data = [];
            if ($scope.GroupList_final_data.length !== 0) {



                angular.forEach($scope.GroupList_final_data, function (Aitem, index) {
                    angular.forEach(Aitem.GroupDetails, function (item, index) {
                        $scope.Indiv_Group_final_data.push({ "Name": item.Name, "Email": item.Email });
                    });

                });

                tempArray = tempArray.concat($scope.Indiv_Group_final_data);
            }
        } else {

            var object = { "Name": "", "Email": $scope.ManualEmailNumber };
            tempArray.push(object);
        }

        var Emailstring = '';
        angular.forEach(tempArray, function (item, index) {
            Emailstring = (Emailstring + item.Email) + (index === tempArray.length - 1 ? '' : ',');
        });



        var req = {
            "UserId": $scope.User.UserId,
            "Message": $scope.Search.sendMessageTextForSMS,
            "EmailNumbers": Emailstring,
            "DoctorsEmails": tempArray,
            "ParentOrganizationId": parentHospitalId,
            "Subject": $scope.SubjectDescription,
            "HospitalName": $scope.HospitalName,
            "Location": $scope.Location,
            "BranchEmail": $scope.BranchEmail,
            "MobileNo": $scope.MobileNo

        };
        EhnoteCrmService.sendEmailToAllDoctors(req).then(function (resp) {
            if (resp.data.Status === 1) {
                alertify.success("Email Sent Succesfully");
                $scope.Patient_final_data = [];
                $scope.GroupList_final_data = [];
                $scope.Search.sendMessageTextForSMS = "";
                $scope.NumOfDoctorsSelected = 0;
                $scope.NumOfLeadPatientSelected = 0;
                $scope.NumOfPatientSelected = 0;
                $scope.NumOfGroupsSelected = 0;


                angular.forEach($scope.GroupsList, function (item) {
                    item.Selected = false;
                });
                angular.forEach($scope.communicationpatientlist, function (item) {
                    item.Selected = false;
                });


                $scope.ManualPhoneNumber = "";
                $scope.SelectedTemplateName = "";
                $scope.PatientEmailNumber = "";
            }
            if (resp.data.Status === 2) {
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            console.log(err);
            alertify.error("Email Sending Failed");
        });

    };
    $scope.sendSmsToAllDoctors = function () {
        $scope.Search.sendMessageTextForSMS = $scope.Search.sendMessageTextForSMS || "";
        $scope.ManualPhoneNumber = $scope.ManualPhoneNumber || "";

        if ($scope.Search.sendMessageTextForSMS === "") {
            alertify.error("Please Enter Message");
            return;
        }
        var tempArray = [];
        if ($scope.ManualPhoneNumber === "") {
            if (($scope.Patient_final_data.length === 0 && $scope.final_data.length === 0 && $scope.LeadPatient_final_data.length === 0 && $scope.GroupList_final_data.length === 0)
                || ($scope.Patient_final_data.length !== 0 && $scope.final_data.length !== 0 && $scope.LeadPatient_final_data.length !== 0 && $scope.GroupList_final_data.length !== 0)) {
                alertify.error("Please Select Patients Or Doctors");
                return;
            }
            tempArray = $scope.Patient_final_data.concat($scope.final_data);
            tempArray = tempArray.concat($scope.LeadPatient_final_data);
            var abc = tempArray.length;
            $scope.Indiv_Group_final_data = [];
            if ($scope.GroupList_final_data.length !== 0) {


                angular.forEach($scope.GroupList_final_data, function (Aitem, index) {
                    angular.forEach(Aitem.GroupDetails, function (item, index) {
                        $scope.Indiv_Group_final_data.push({
                            "Name": item.Name || null,
                            "Phone": item.Phone || null,
                            "Email": item.Email || null,
                            "PatientId": item.PatientId || null,
                            "Type": Aitem.GroupTypeid || null,
                            "LeadId": item.LeadId || null,
                            "DoctorId": item.DoctorId || null
                        });
                    });


                });
                tempArray = tempArray.concat($scope.Indiv_Group_final_data);
                abc = tempArray.length;
                console.log(abc);
            }
        } else {
            if ($scope.ManualPhoneNumber.length !== 10) {
                alertify.error("Manual Number should Be 10 Digits");
                return;
            }
            var object = { "Name": "", "Phone": parseInt($scope.ManualPhoneNumber) };
            tempArray.push(object);
            abc = tempArray.length;
        }



        if (abc > $scope.doctorinfo.doctordata.UserAddress[0].MaxSMSCount) {
            alertify.error("Sms Limit exceed");
            return false;
        }


        //angular.forEach(tempArray, function (item, index) {
        //    mobilestring = (mobilestring + "91" + item.Phone) + (index === tempArray.length - 1 ? "" : ",");
        //});
    
        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you want send " + abc + " Members?", function () {
            

            _.map(tempArray, function (tag) {
                if (tag.Phone !== null) {
                    tag.Phone = "91" + tag.Phone;
                }
                return tag;
            });
            var req = {
                "UserId": $scope.User.UserId,
                "Message": $scope.Search.sendMessageTextForSMS,
                "mobileNumbers": _.pluck(tempArray, "Phone").join(","),
                "DoctorsPhones": tempArray,
                "ParentOrganizationId": parentHospitalId,
                "OrganizationId":  $scope.hospid ,
                "SenderId": $scope.doctorinfo.doctordata.UserAddress[0].SMSSenderId,
                "IsSMSInd": $scope.doctorinfo.doctordata.UserAddress[0].IsSMSInd

            };
            console.log(req);

            // return;


            EhnoteCrmService.sendSmsToAllDoctors(req).then(function (resp) {
                if (resp.data.Status === 0) {
                    alertify.success("Message Sent Succesfully");

                    //$scope.final_data = [];

                    $scope.Patient_final_data = [];
                    $scope.GroupList_final_data = [];
                    //$scope.Search.sendMessageTextForSMS = "";
                    $scope.NumOfPatientSelected = 0;
                    $scope.NumOfGroupsSelected = 0;

                    angular.forEach($scope.GroupsList, function (item) {
                        item.Selected = false;
                    });
                    angular.forEach($scope.communicationpatientlist, function (item) {
                        item.Selected = false;
                    });

                    $scope.ManualPhoneNumber = "";
                    $scope.SelectedTemplateName = "";
                    $scope.Search.sendMessageTextForSMS = "";
                    $scope.laedsPhoneNumber = "";
                }
                if (resp.data.Status === 2) {
                    alertify.error(resp.data.Message);
                }
            }, function (err) {
                console.log(err);
                alertify.error("Message Sending Failed");
            });

        }, function () {
            r = "You pressed Cancel!";
        });


    };
    $scope.onClickCreateTemplate = function () {
        $scope.createTemplatePopup = true;
        $scope.messageTextForTemp = null;
        $scope.templateName = null;
    };
    $scope.onClickUpdtCommTemplate = function (data) {
        $scope.updtTemplatePopup = true;
        $scope.templateName = data.TemplateTitle;
        $scope.messageTextForTemp = data.TemplateDescription;
        $scope.TemplateDetailId = data.SmsTemplateId;
        $scope.showUpdateButton = false;
    };
    $scope.onClickDelCommTemplate = function (data) {
        $scope.delTemplatePopup = true;
        $scope.templateName = data.TemplateTitle;
        $scope.messageTextForTemp = data.TemplateDescription;
        $scope.TemplateDetailId = data.SmsTemplateId;
    };
    $scope.addCommTemplate = function () {
        if (!$scope.UserAccessRights.AllAccessRights.SMSAddUpdateTemplate) {
            alertify.error("Sorry You Dont have Access,Please Contact Administrator");
            return false;
        }
        $scope.templateName = $scope.templateName || "";

        $scope.messageTextForTemp = $scope.messageTextForTemp || "";


        if ($scope.templateName === "") {
            alertify.error("Enter Template Name");
            return;
        }
        if ($scope.messageTextForTemp === "") {
            alertify.error("Enter Message");
            return;
        }
        var req = {
            "TemplateTitle": $scope.templateName,
            "TemplateDescription": $scope.messageTextForTemp,
            "UserId": $scope.User.UserId,
            "TemplateId": 0,
            "TemplateTypeId": 3,
            "OrganizationId": parentHospitalId
        };
        EhnoteCrmService.AddEditSMStemplate(req).then(function (resp) {
            if (resp.data.Status === 1) {

                if (resp.data.data === 0) {
                    alertify.error("Template Name Already Exist");
                    return;
                }


                $scope.GetAllSmsTemplates();
                alertify.success("Template Added Successfully");
                $scope.createTemplatePopup = false;
                $scope.templateName = "";
                $scope.messageTextForTemp = "";
            }
            if (resp.data.Status === 2) {
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            console.log(err);
            alertify.error("Template Adding Failed");
        });
    };
    $scope.checkAllGroups = function (selecteAllGroups) {
        if (selecteAllGroups) {
            $scope.GroupList_final_data = [];
            angular.forEach($scope.GroupsList, function (item, index) {
                checkArray.push(1);
                item.Selected = selecteAllGroups;
                $scope.GroupList_final_data.push(item);
            });
        } else {
            angular.forEach($scope.GroupsList, function (item, index) {
                item.Selected = selecteAllGroups;
            });
            $scope.GroupList_final_data = [];
            checkArray = [];
        }
        $scope.NumOfGroupsSelected = $scope.GroupList_final_data.length;
    };




    //$scope.addPatientMobile = function (item) {
    //    if (item.Selected) {
    //        $scope.Patient_final_data.push({
    //            "Name": item.FullName,
    //            "Phone": item.PhoneNumber,
    //            "Email": item.EmailID || null,
    //            "PatientId": item.PatientID,
    //            "Type": "P",
    //            "LeadId": item.LeadId,
    //            "DoctorId": null
    //        });
    //        if ($scope.selecteAllPatients !== undefined || $scope.selecteAllPatients) {
    //            $scope.selecteAllPatients = false;
    //        }
    //    } else {
    //        var ind = $scope.Patient_final_data.findIndex(x => x.Phone === item.PhoneNumber);
    //        $scope.Patient_final_data.splice(ind, 1);
    //        if ($scope.selecteAllPatients !== undefined || $scope.selecteAllPatients) {
    //            $scope.selecteAllPatients = false;
    //        }
    //    }
    //    $scope.NumOfPatientSelected = $scope.Patient_final_data.length;
    //    if ($scope.Patient_final_data.length === $scope.getPatientList.length && $scope.getPatientList.length !== 0) {
    //        $scope.selecteAllPatients = true;
    //    }
    //};



    //$scope.checkAllPatients = function (selecteAllPatients) {
    //    if (selecteAllPatients) {
    //        $scope.Patient_final_data = [];
    //        angular.forEach($scope.getPatientList, function (item, index) {
    //            item.Selected = selecteAllPatients;


    //            $scope.Patient_final_data.push({
    //                "Name": item.FullName,
    //                "Phone": item.PhoneNumber,
    //                "Email": item.EmailID,
    //                "DoctorId": null,
    //                "Type": "P",
    //                "LeadId": null,
    //                "PatientId": item.PatientID
    //            });


    //        });
    //        $scope.NumOfPatientSelected = $scope.Patient_final_data.length;
    //    } else {
    //        angular.forEach($scope.getPatientList, function (item, index) {
    //            item.Selected = selecteAllPatients;
    //        });
    //        $scope.Patient_final_data = [];
    //        $scope.NumOfPatientSelected = $scope.Patient_final_data.length;
    //    }
    //};

    //$scope.addDoctorMobile = function (item) {
    //    if (item.Selected) {
    //        $scope.final_data.push({
    //            "Name": item.FullName,
    //            "Phone": item.Mobile,
    //            "Email": item.Email,
    //            "DoctorId": item.DoctorID,
    //            "Type": "D",
    //            "LeadId": item.LeadId,
    //            "PatientId": null
    //        });
    //        if ($scope.selecteAllDoctors !== undefined || $scope.selecteAllDoctors) {
    //            $scope.selecteAllDoctors = false;

    //        }
    //    } else {
    //        var ind = $scope.final_data.findIndex(x => x.Phone === item.Mobile);
    //        $scope.final_data.splice(ind, 1);
    //        if ($scope.selecteAllDoctors !== undefined || $scope.selecteAllDoctors) {
    //            $scope.selecteAllDoctors = false;

    //        }
    //    }
    //    $scope.NumOfDoctorsSelected = $scope.final_data.length;
    //    if ($scope.final_data.length === $scope.DoctorList.length && $scope.DoctorList.length !== 0) {
    //        $scope.selecteAllDoctors = true;
    //    }
    //};
    //$scope.checkAllDoctors = function (selecteAllDoctors) {
    //    if (selecteAllDoctors) {
    //        $scope.final_data = [];
    //        angular.forEach($scope.DoctorList, function (item) {
    //            item.Selected = selecteAllDoctors;
    //            $scope.final_data.push({
    //                "Name": item.FullName,
    //                "Phone": item.Mobile,
    //                "Email": item.Email,
    //                "DoctorId": item.DoctorID,
    //                "Type": "D",
    //                "LeadId": null,
    //                "PatientId": null
    //            });


    //        });
    //        $scope.NumOfDoctorsSelected = $scope.final_data.length;
    //    } else {
    //        angular.forEach($scope.DoctorList, function (item) {
    //            item.Selected = selecteAllDoctors;
    //        });
    //        $scope.final_data = [];
    //        $scope.NumOfDoctorsSelected = $scope.final_data.length;
    //    }
    //};
    $scope.SendMessageLimit = function (val) {
        $scope.sendOption = val;
        if (val === 'SMS') {
            $scope.messageLength = 300;
        } else {
            $scope.messageLength = '';
        }
    };
    $scope.closeCreateTemplatePopup = function () {
        $scope.createTemplatePopup = false;
        $scope.templateName = "";
        $scope.messageTextForTemp = "";
    };

    $scope.closeUpdtTemplatePopup = function (data) {
        $scope.delTemplatePopup = false;
        $scope.updtTemplatePopup = false;
        $scope.templateName = "";
        $scope.messageTextForTemp = "";
        $scope.TemplateDetailId = 0;
    };
    $scope.updtCommTemplate = function () {

        $scope.templateName = $scope.templateName || "";

        $scope.messageTextForTemp = $scope.messageTextForTemp || "";

        if ($scope.templateName === "") {
            alertify.error("Enter Template Name");
            return;
        }
        if ($scope.messageTextForTemp === "") {
            alertify.error("Enter Text For Template");
            return;
        }



        var req = {
            "TemplateTitle": $scope.templateName,
            "TemplateDescription": $scope.messageTextForTemp,
            "UserId": $scope.User.UserId,
            "TemplateId": $scope.TemplateDetailId,
            "TemplateTypeId": 3,
            "OrganizationId": parentHospitalId
        };
        EhnoteCrmService.AddEditSMStemplate(req).then(function (resp) {
            if (resp.data.Status === 1) {

                if (resp.data.data === 0) {
                    alertify.error("Template Name Already Exist");
                    return;
                }

                $scope.GetAllSmsTemplates();
                $scope.updtTemplatePopup = false;
                alertify.success("Template Updated Successfully");
            }
            if (resp.data.Status === 2) {
                alertify.error(resp.data.Message);
            }

        }, function (err) {
            console.log(err);
            alertify.error("Template Updating Failed");
        });

    };
    $scope.DeleteTemplate = function () {
        EhnoteCrmService.DeleteSmsTemplate($scope.TemplateDetailId).then(function (resp) {
            if (resp.data.Status === 1) {
                $scope.GetAllSmsTemplates();
                alertify.success("Template Deleted Successfully");
                $scope.delTemplatePopup = false;
            }
        }, function (err) {
            console.log(err);
            alertify.error("Template Deleting Failed");
        });
    };
    $scope.onClickMsgTemplete = function (template) {
        $scope.SelectedTemplateName = template.TemplateTitle;
        var items = "";
        if ($scope.sendOption === "EMAIL") {
            //$scope.sendMessageTextForMail = "";
            $scope.Search.sendMessageTextForSMS = "";
            items = $scope.availableMailTemplates;
        } else {
            $scope.Search.sendMessageTextForSMS = "";
            $scope.SelectedTemplateName = "";
            items = $scope.availableSMSTemplates;
        }
        for (var i = 0; i < items.length; i++) {
            if (template.TemplateDetailId !== items[i].TemplateDetailId) {
                items[i].Selected = false;
            } else {
                if (template.Selected) {
                    items[i].Selected = false;
                } else {
                    items[i].Selected = true;
                }
            }
        }
        $scope.buildMessageUsingTemplate(template.Selected, template.TemplateDescription, template.TemplateTitle);
    };
    $scope.buildMessageUsingTemplate = function (isChecked, template, title) {
        if (isChecked) {
            $scope.Search.sendMessageTextForSMS = template || '';
            $scope.SelectedTemplateName = title || "";
        }
    };
    //$scope.onBranchAddress = function (Branch) {
    //    $scope.sendMessageTextForSMS = "";
    //    $scope.SelectedTemplateName = "";



    //    var HospitalName = Branch.HospitalName || "";
    //    var HNo = Branch.HNo || "";
    //    var StreetName = Branch.StreetName || "";
    //    var AreaName = Branch.AreaName || "";
    //    var Landmark = Branch.Landmark || "";
    //    var LocName = Branch.LocName || "";
    //    var Cityname = Branch.Cityname || "";
    //    var StateName = Branch.StateName || "";
    //    var Country = Branch.Country || "";
    //    var Pincode = Branch.Pincode || "";



    //    if (HospitalName !== "") {
    //        $scope.sendMessageTextForSMS += HospitalName;
    //    }
    //    if (HNo !== "") {
    //        $scope.sendMessageTextForSMS += "," + HNo;
    //    }
    //    if (StreetName !== "") {
    //        $scope.sendMessageTextForSMS += "," + StreetName;
    //    }
    //    if (AreaName !== "") {
    //        $scope.sendMessageTextForSMS += "," + AreaName;
    //    }
    //    if (Landmark !== "") {
    //        $scope.sendMessageTextForSMS += "," + Landmark;
    //    }
    //    if (LocName !== "") {
    //        $scope.sendMessageTextForSMS += "," + LocName;
    //    }
    //    if (Cityname !== "") {
    //        $scope.sendMessageTextForSMS += "," + Cityname;
    //    }
    //    if (StateName !== "") {
    //        $scope.sendMessageTextForSMS += "," + StateName;
    //    }
    //    if (Country !== "") {
    //        $scope.sendMessageTextForSMS += "," + Country;
    //    }
    //    if (Pincode !== "") {
    //        $scope.sendMessageTextForSMS += "," + Pincode;
    //    }

    //    angular.forEach($scope.AllBranches, function (item, index) {
    //        item.Selected = false;
    //    });


    //    if (Branch.Selected) {
    //        Branch.Selected = false;
    //    } else {
    //        Branch.Selected = true;
    //    }

    //    $scope.buildMessageUsingTemplate(Branch.Selected, $scope.sendMessageTextForSMS, "");
    //};

    $scope.btnName = 'Template';
    $scope.templateHeader = 'Templates';
    $scope.templateBranchClick = function (type) {
        $scope.btnName = type;
        if (type === "Template") {
            $scope.templateHeader = 'Template';
        }
        else {
            $scope.templateHeader = 'Templates';
        }
    };

    $scope.bindBranchAddr = function (item) {
        var strAddr = "";
        if (item.HNo) {
            strAddr += "Hno : " + item.HNo;
        }
        if (item.Landmark) {
            strAddr = strAddr ? strAddr + ' , ' : '';
            strAddr += "Landmark :" + item.Landmark;
        }
        if (item.LocName) {
            strAddr = strAddr ? strAddr + ' , ' : '';
            strAddr += "Location :" + item.LocName;
        }
        if (item.AreaName) {
            strAddr = strAddr ? strAddr + ' , ' : '';
            strAddr += "Area : " + item.AreaName;
        }
        if (item.Cityname) {
            strAddr = strAddr ? strAddr + ' , ' : '';
            strAddr += "City : " + item.Cityname;
        }
        if (item.StateName) {
            strAddr = strAddr ? strAddr + ' , ' : '';
            strAddr += "State : " + item.StateName;
        }
        if (item.Pincode) {
            strAddr = strAddr ? strAddr + ' , ' : '';
            strAddr += "Pincode : " + item.Pincode;
        }
        $scope.SelectedTemplateName = item.HospitalName;
        $scope.Search.sendMessageTextForSMS = strAddr ? strAddr.trim() : '';

    };

    $scope.showUpdateButton = false;
    $scope.keypressevt = function () {
        $scope.keypresskeycode = event.keyCode;
        $scope.showUpdateButton = true;
    };

    $scope.Groupslist = false;
    $scope.Groupinpatientlist = false;
    $scope.GroupDetails = [];
    $scope.GroupDetailslist = function (Groups) {
        $scope.GroupDetails = Groups;
        $scope.Groupslist = true;
        $scope.Groupinpatientlist = false;

    };
    $scope.groupcancel = function () {
        $scope.Groupslist = false;
        $scope.Groupinpatientlist = true;
    };
    $scope.newgroupname = false;
    $scope.changeGroup = function (item) {
        if (item !== null) {
            $scope.GroupName = item;
            $scope.CommunicationGropuname = "";
            $scope.newgroupname = false;
        }
        else {
            $scope.newgroupname = true;
        }

    };

    $scope.DeleteGrouplist = [];
    $scope.addGroupsMobilelist = function (item) {
        $scope.DeleteGrouplist.push({ "Name": item.Name, "Phone": item.Phone, "Email": item.Email });

    };
    $scope.listofgroup = [];
    $scope.Deletegrouppatient = function (Aitem) {

        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to remove from this group?", function () {
            $scope.listofgroup = Aitem;


            angular.forEach($scope.DeleteGrouplist, function (subitem) {
                $scope.listofgroup.GroupDetails = $filter("filter")($scope.listofgroup.GroupDetails, function (Bitem, index) { return (Bitem.Name !== subitem.Name && Bitem.Phone !== subitem.Phone); });
            });


            var obj = {
                "UserId": $scope.listofgroup.HospitalId,
                "GroupName": $scope.listofgroup.GroupName,
                "HospitalId": $scope.listofgroup.HospitalId,
                "LeadUserGroupId": $scope.listofgroup.LeadUserGroupId,
                "GroupType": $scope.listofgroup.GroupType,
                "ActiveInd": 'Y',
                "GroupDetails": $scope.listofgroup.GroupDetails
            };

            EhnoteCrmService.AddNewCommunicationGroup(obj).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.AddGroupspopup = false;
                    $scope.final_data = [];
                    $scope.Patient_final_data = [];
                    $scope.listofgroup = [];
                    $scope.LeadPatient_final_data = [];
                    alertify.success("Successfully Removed From Group");
                    $scope.GetAllDashBoardCount();

                } else {
                    alertify.error(resp.data.Message);
                }
            },
                function (err) {
                });
        }, function () {
            r = "You pressed Cancel!";
        });

    };


    $scope.Deletegroup = function (item) {
        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete this group(s)?", function () {
            var obj = {
                "UserId": item.HospitalId,
                "GroupName": item.GroupName,
                "HospitalId": item.HospitalId,
                "LeadUserGroupId": item.LeadUserGroupId,
                "GroupType": item.GroupType,
                "ActiveInd": 'N',
                "GroupDetails": item.GroupDetails
            };
            EhnoteCrmService.AddNewCommunicationGroup(obj).then(function (resp) {
                if (resp.data.status === 'Success') {
                    $scope.AddGroupspopup = false;
                    $scope.final_data = [];
                    $scope.Patient_final_data = [];
                    $scope.LeadPatient_final_data = [];
                    $scope.listofgroup = [];
                    $scope.GroupList_final_data = [];
                    $scope.NumOfGroupsSelected = 0;
                    alertify.success("Group Successfully Deleted");
                    $scope.GetAllDashBoardCount();
                    $scope.GetAllGroups();

                } else {
                    alertify.error(resp.data.Message);
                }
            },
                function (err) {
                });
        }, function () {
            r = "You pressed Cancel!";
        });


    };

    $scope.showaddnew = function () {
        $scope.newgroupname = true;
    };


    $scope.clearAllMessage = function (sendOption) {
        var items = "";
        if (sendOption === 'SMS') {
            $scope.Search.sendMessageTextForSMS = "";
            items = $scope.availableSMSTemplates;
            for (var i = 0; i < items.length; i++) {
                items[i].Selected = false;
            }
        } else if (sendOption === 'Email') {
            $scope.clinicNameForMessageEMAIL = $scope.doctorinfo.doctordata.UserAddress[0].ClinicName + " has sent you this message. ";
            //$scope.sendMessageTextForMail = "";
            $scope.Search.sendMessageTextForSMS = "";
            $scope.sendMessageSubject = "";
            items = $scope.availableMailTemplates;
            for (var i = 0; i < items.length; i++) {
                items[i].Selected = false;
            }
        }

    };


    //Sms Usage
    // $scope.Branches = [];
    //$scope.SmsUsageBranches = [{ "Id": 1 }, { "Id": 2 }];
    //$scope.Search1 = {
    //    "startdate": null,
    //    "enddate": null,
    //    "SelectedBranch": null
    //};
    //$scope.GetBranches = function () {
    //    InventoryService.GetBranches(parentHospitalId).then(function (resp) {
    //        if (resp.data.Status !== 1) {
    //            alertify.error(resp.data.Message);
    //            $scope.Branches = [];
    //        } else {
    //            $scope.Branches = resp.data.data;
    //            $scope.Search1.SelectedBranch = $filter("filter")($scope.Branches, { "OrganizationId": $scope.hospid }, true)[0];
    //        }
    //    }, function (err) {
    //        $scope.Branches = [];
    //        console.log(err);
    //        alertify.error("Getting Branches Failed");
    //    });
    //};


    $scope.SearchSmsUsage = function () { };
    $scope.ClearSmsUsageSearch = function () { };


}]);

  
  
 
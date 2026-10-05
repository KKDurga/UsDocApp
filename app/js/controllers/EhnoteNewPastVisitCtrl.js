"use strict";
eHnoteWebApp.controller("EhnoteNewPastVisitCtrl", ["$scope", "$http", "$log", "$rootScope", "$compile", "$q", "$location", "$ocLazyLoad", "$uibModal", "$routeParams", "$filter", "$timeout", "eHnoteMainAppointmentService", "eHnoteLoginStatusService", "eHnoteDiagnosisDataServices", "datapersistanceFactory", "eHnoteMasterDataService", "eHnotePatientDataService", "eHnoteProcedureDataService", "alertify", "eHnoteCacheStorageService", "Lightbox", "eHnoteInsuranceService", "eHnotePatientAddressDataServices", function ($scope, $http, $log, $rootScope, $compile, $q, $location, $ocLazyLoad, $uibModal, $routeParams, $filter, $timeout, eHnoteMainAppointmentService, eHnoteLoginStatusService, eHnoteDiagnosisDataServices, datapersistanceFactory, eHnoteMasterDataService, eHnotePatientDataService, eHnoteProcedureDataService, alertify, eHnoteCacheStorageService, Lightbox, eHnoteInsuranceService, eHnotePatientAddressDataServices) {


  

  
    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();

    
    if ($scope.cacheStorageItem.patientid === undefined) {
        $scope.cacheStorageItem.patientid = appointmentinfo.PatientID;
        $scope.cacheStorageItem.patientID = appointmentinfo.PatientID;
    }
    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();

    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    $scope.RoleId = userLoginDetails.RoleID;
    $scope.showBillinginCasehistory = true;
    var currentdate = new Date();
    $scope.SearchRecordTypeId = "";

   // $rootScope.patientdetailesConsultation = true;
   // $rootScope.patientAllSearchHeader = true;

    //$rootScope.patientdetailesConsultation = true;
    //$rootScope.patientConsultationScreen = false;

    $scope.$emit("patientInfoDetails", appointmentinfo);

    $scope.SpecializationId = 0;
    $scope.Subtab = 1;

    $rootScope.$on("ShowBillingTab", function (event, item) {
        if (item) {
            $scope.Tab = "billing";
        }
    });

    if ($scope.RoleId === 17 || $scope.RoleId === 2 || $scope.RoleId === 11 || $scope.RoleId === 18) {//Receptionist
        $scope.Tab = "billing";
    } else {
        $scope.Tab = "casehistory";
    }

    if ($scope.RoleId === 1) {
        $scope.DoctorId = doctorinfo.doctorid;
    } else {
        $scope.DoctorId = 0;
    }
    $scope.appointmentAccess = {
        "showEditConsultationBtnAccessFromAppList": false,
        "patientBillingAccess": false
    };
    $scope.UserAccessList = [];
    if (doctorinfo !== "") {
        if (doctorinfo.doctordata.User !== undefined) {
            $scope.UserAccessList = doctorinfo.doctordata.User[0].UseAccessDetails;
            //$rootScope.ParentSpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
            $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
            checkUserAccessPermissions();
        }
    }

    function checkUserAccessPermissions() {
        angular.forEach($scope.UserAccessList, function (item) {
            if (item.AccessCategoryId === 3 && item.ActiveInd === 'Y') {
                angular.forEach(item.AccessList, function (citem) {

                    if (citem.AccessRightId === 120 && citem.ActiveInd === "Y") {
                        $scope.appointmentAccess.showEditConsultationBtnAccessFromAppList = true;
                    }
                });
            }
            if (item.AccessCategoryId === 4 && item.ActiveInd === 'Y') {
                angular.forEach(item.AccessList, function (citem) {

                    if (citem.AccessRightId === 22 && citem.ActiveInd === "Y") {
                        $scope.appointmentAccess.patientBillingAccess = true;
                    }
                });
            }
        });
    }

    $scope.init = function () {
        // generatePatientNotes(appointmentinfo.PatientID);
    };


    $scope.init();

    $scope.HospitalArray = [];
    $scope.switchTab = function (type) {
      
        
        $scope.Tab = type;
        

        if (type === 'FileUploads') {
            getAllFiles($scope.cacheStorageItem.patientid, $scope.DoctorId);
        }
        if (type === 'casehistory') {
            generatePatientNotes(appointmentinfo.PatientID);
        }

      
    };
    // var doctorInfo = eHnoteMasterDataService.getUserInfo();

    $scope.ImagesList = [];
    $scope.PatientPrecriptionReportList = [];
    $scope.PatientInvestigationReportList = [];

    $scope.generalPrescriptionImageArray = [];
    $scope.generalPrescriptionpdfArray = [];

    $scope.generalInvestigationImageArray = [];
    $scope.generalInvestigationpdfArray = [];
    $scope.ImagesPrecriptionCount = 0;
    $scope.ImageInvestigationCount = 0;

    $scope.FilePreviousIndex = 0;
    $scope.mainpatientScreen = true;

    $scope.DocumentTypeList = [];

    $scope.GetRecordTypes = function () {
        eHnoteDiagnosisDataServices.GetMasterRecordType().then(function (resp) {
            $scope.RecordTypesList = resp.data.rows || [];
            if ($scope.RecordTypesList.length > 0) {
                $scope.previousFileUploadObj.RecordTypeId = $scope.RecordTypesList[0];
                $scope.RecordTypeId = $scope.previousFileUploadObj.RecordTypeId.RecordTypeId;
            }
        });
    };
    $rootScope.$on("ShowFileUploadTab", function (event, item) {
        if (item) {
            $scope.Tab = "FileUploads";
            $scope.Subtab = 3;
            $scope.GetRecordTypes();
            $scope.clear();
            $scope.previousFileUploadObj.FileDate = "";
            $scope.previousFileUploadObj.DoctorName = "";
            $scope.previousfiles = [];
            $scope.TempImagesArray = [];
            $scope.TempPdfArray = [];
        }
    });
    //function getAllPatientPreviousRecords(patientid) {
    //    eHnoteDiagnosisDataServices.GetAllPatientPreviousRecords(patientid).then(function (resp) {
    //        if (resp.data.rows.length>0) {
    //            $scope.TotalPatientPreviousArray = resp.data.rows;
    //            $scope.PatientPrecriptionReportList = $filter("filter")($scope.TotalPatientPreviousArray, {"RecordTypeId": 1 }, true);
    //            $scope.PatientInvestigationReportList = $filter("filter")($scope.TotalPatientPreviousArray, {"RecordTypeId": 2 }, true);

    //            if ($scope.PatientPrecriptionReportList.length > 0) {
    //                angular.forEach($scope.PatientPrescriptionReportList, function (mitem) {
    //                    var extension = ".jpg";
    //                    if (mitem.FileName) {
    //                        extension = mitem.FileName.split(".")[1];
    //                    }
    //                    var pName = mitem.FileName.split("_")[0];
    //                    if (pName.length > 9) {
    //                        name = pName.substring(0, 9) + "..." + "." + extension;
    //                    } else {
    //                        name = angular.copy(pName) + '.' + extension;
    //                    }
    //                    mitem.FileName = name;
    //                });
    //                $scope.generalPrescriptionImageArray = $filter("filter")($scope.PatientPrecriptionReportList, { "FileExt": 'image/jpeg' }, true);
                  
                    
    //                $scope.generalPrescriptionpdfArray = $filter("filter")($scope.PatientPrecriptionReportList, {"FileExt": 'application/pdf' }, true);
    //            }
    //            if ($scope.PatientInvestigationReportList.length > 0) {
    //                angular.forEach($scope.PatientInvestigationReportList, function (kitem) {
    //                    var extension = ".jpg";
    //                    if (kitem.FileName) {
    //                        extension = kitem.FileName.split(".")[1];
    //                    }
    //                    var pName = kitem.FileName.split("_")[0];
    //                    if (pName.length > 9) {
    //                        name = pName.substring(0, 9) + "..." + "." + extension;
    //                    } else {
    //                        name = angular.copy(pName) + '.' + extension;
    //                    }
    //                    kitem.FileName = name;
    //                });
    //                $scope.generalInvestigationImageArray = $filter("filter")($scope.PatientInvestigationReportList, {"FileExt": 'image/jpeg' }, true);
    //                $scope.generalInvestigationpdfArray = $filter("filter")($scope.PatientInvestigationReportList, { "FileExt": 'application/pdf' }, true);
    //            }
    //            if ($scope.generalPrescriptionImageArray.length > 0) {
    //                $scope.ImagesPrecriptionCount++;
    //            }
    //            if ($scope.generalInvestigationImageArray.length > 0) {
    //                $scope.ImageInvestigationCount++;
    //            }
    //        }
    //    });
    //}

    function GetPatientPreviousRecordDataById(recordId) {
        eHnoteDiagnosisDataServices.GetPatientPreviousRecordDataById(recordId).then(function (resp) {
            $scope.TotalPatientPreviousArray = [];
            $scope.generalPrescriptionpdfArray = [];
            $scope.generalPrescriptionImageArray = [];
            if (resp.data.rows.length > 0) {
                $scope.TotalPatientPreviousArray = resp.data.rows;
                if ($scope.TotalPatientPreviousArray.length > 0) {
                    angular.forEach($scope.TotalPatientPreviousArray, function (mitem) {
                        var extension = ".jpg";
                        if (mitem.FileName) {
                            extension = mitem.FileName.split(".")[1];
                        }
                        var pName = mitem.FileName.split("_")[0];
                        if (pName.length > 9) {
                            name = pName.substring(0, 9) + "..." + "." + extension;
                        } else {
                            name = angular.copy(pName) + '.' + extension;
                        }
                        mitem.DisplayFileName = name;
                    });
                    
                    //$scope.generalPrescriptionImageArray = $filter("filter")($scope.TotalPatientPreviousArray, { "FileExt": 'image/jpeg' , "FileExt": 'image/png'  }, true);

                    angular.forEach($scope.TotalPatientPreviousArray, function (mitem) {
                        if (mitem.FileExt === 'image/jpeg' || mitem.FileExt === 'image/png')
                            {
                            $scope.generalPrescriptionImageArray.push(mitem);
                           }
                    });
                    $scope.generalPrescriptionpdfArray = $filter("filter")($scope.TotalPatientPreviousArray, {"FileExt": 'application/pdf' }, true);
                    if ($scope.generalPrescriptionImageArray.length > 0) {
                    $scope.ImagesPrecriptionCount++;
                }

                }
            }
        });
    }


    function getAllPatientPreviousRecords(req) {
        eHnoteDiagnosisDataServices.GetAllPatientPreviousRecords(req).then(function (resp) {
            if (resp.data.rows.length > 0) {
                $scope.ImagesList = resp.data.rows[0].MedicalRecords;
                if ($scope.ImagesList.length>0) {
                    GetPatientPreviousRecordDataById($scope.ImagesList[0].MedicalRecordId);
                }
            }
        });
    }
    $scope.GetIndividualFile = function (item, ind) {
        $scope.FilePreviousIndex = ind;
        GetPatientPreviousRecordDataById(item.MedicalRecordId);
    }
    
       $scope.SearchObj = {
        "FromDate": "",
        "ToDate": "",
        "RecordType": "",
        "RecordTypeId": $scope.SearchRecordTypeId,
        "PatientId": $scope.cacheStorageItem.patientid
    }


    $scope.clear = function () {
        $scope.SearchObj.FromDate = "";
        $scope.SearchObj.ToDate = "";
        $scope.SearchObj.RecordTypeId = "";
        $scope.SearchObj.RecordType = "";
        $scope.SearchObj.PatientId = $scope.cacheStorageItem.patientid;
        getAllPatientPreviousRecords($scope.SearchObj);
    };

    $scope.changePreviousUploadTab = function (val) {
        $scope.Subtab = val;
        if ($scope.Subtab === 3) {
            $scope.GetRecordTypes();
            $scope.clear();
            $scope.previousFileUploadObj.FileDate = "";
            $scope.previousFileUploadObj.DoctorName = "";
            $scope.previousfiles = [];
            $scope.TempImagesArray = [];
            $scope.TempPdfArray = [];
        }
        if ($scope.Subtab === 4) {
           $scope.getPatientinsurancepaDetails();
        }
    }

    $scope.FilterAppointments = function (mainpatientScreen) {
        if (mainpatientScreen) {
            $scope.mainpatientScreen = false;
        } else {
            $scope.mainpatientScreen = true;
        }
    };
  



    $scope.updateAppointInfo = function () {
        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        appointmentinfo.CaptureBillingFrom = "PatientcasHistory";
        appointmentinfo.DoctorID = eHnoteMasterDataService.getLoginId();
        eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
    };
    $scope.SearchByTextCase = function (searchtext) {
        searchtext = searchtext || "";
        if (searchtext === "" || searchtext.length < 2) {
            $scope.patients = [];
            return;
        }
        var HospitalID = 0;

        //if ($scope.RoleId === 1) {//Normal Doctor
        //    HospitalID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        //}

        //if ($scope.RoleId === 2 || $scope.RoleId === 4) {//ADMIN DOCTOR or RECEPTIONIST 
        //    HospitalID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        //}

        HospitalID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        var param = {
            "PageSize": 20,
            "FirstName": "",
            "hasparam": true,
            "PageNumber": 1,
            "HospitalID": HospitalID,
            "loaderStatus": false,
            "PhoneNumber": "",
            "UserId": eHnoteMasterDataService.getLoginId()
        };

        if (!isNaN(searchtext)) {
            param.PhoneNumber = searchtext;
            param.hasparam = true;
            param.FirstName = "";
        } else {
            param.FirstName = searchtext;
            param.hasparam = true;
            param.PhoneNumber = "";
        }
        //   eHnotePatientDataService.SearchOnlyPatient(param, OnGetPatientSuccess, OnGetPatientError);

        //function OnGetPatientSuccess(data) {

        //    $scope.patients = data.rows;
        //    angular.forEach($scope.patients, function (item) {
        //        var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
        //        var val = array_list[Math.floor(Math.random() * array_list.length)];
        //        item.colors = val;
        //    });
        //}
        //function OnGetPatientError(data) {
        //}
    };
    //$scope.getPatientCaseHistoryItem = function (patientitem) {
    //    var item = {};
    //    item.Patient = [];
    //    item.PatientAddress = [];
    //    item.PatientPhone = [];
    //    item.Patient.push({
    //        PatientID: patientitem.Patient[0].PatientId,
    //        Title: patientitem.Patient[0].Title,
    //        FullName: patientitem.Patient[0].FullName,
    //        DOB: patientitem.Patient[0].DOB,
    //        Gender: patientitem.Patient[0].Gender,
    //        Age: patientitem.Patient[0].Age,
    //        CurrentAge: patientitem.Patient[0].CurrentAge
    //    });
    //    item.PatientID = patientitem.Patient[0].PatientId;

    //    item.PatientPhone.push({ PhNumber: patientitem.PatientPhone ? patientitem.PatientPhone[0].PhNumber : "" });
    //    eHnoteMasterDataService.addAppointmentInfo(item);
    //    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    //    $scope.cacheStorageItem.PatientID = patientitem.Patient[0].PatientId;
    //    $scope.cacheStorageItem.patientid = patientitem.Patient[0].PatientId;
    //    $scope.cacheStorageItem.appointmentid = 0;
    //    $scope.cacheStorageItem.appointmentStatus = "";
    //    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
    //    //setCacheStorage(item, datapersistanceFactory, eHnoteCacheStorageService, eHnoteMasterDataService);
    //    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    //    $scope.$broadcast("formcaseSearch", appointmentinfo);
    //    $scope.$emit("patientInfoDetails", appointmentinfo);
    //    $scope.patients = [];
    //    $scope.SearchBy = '';
    //}


    //$scope.getPatientCaseHistoryItem = function (patientitem) {
    //    var item = {};
    //    item.Patient = [];
    //    item.PatientAddress = [];
    //    item.PatientPhone = [];
    //    item.Patient.push({
    //        PatientID: patientitem.PatientId,
    //        Title: patientitem.Title,
    //        FullName: patientitem.FullName,
    //        DOB: patientitem.DOB,
    //        Gender: patientitem.Gender,
    //        Age: patientitem.Age,
    //        CurrentAge: patientitem.CurrentAge
    //    });
    //    item.PatientID = patientitem.PatientID;

    //    item.PatientPhone.push({ PhNumber: patientitem.PhoneNumber ? patientitem.PhoneNumber : "" });
    //    eHnoteMasterDataService.addAppointmentInfo(item);
    //    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    //    $scope.cacheStorageItem.PatientID = patientitem.PatientID;
    //    $scope.cacheStorageItem.patientid = patientitem.PatientID;
    //    $scope.cacheStorageItem.PatientName = patientitem.FullName;
    //    $scope.cacheStorageItem.appointmentid = 0;
    //    $scope.cacheStorageItem.appointmentStatus = "";
    //    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
    //    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    //    $scope.$broadcast("formcaseSearch", appointmentinfo);
    //    $scope.$emit("patientInfoDetails", appointmentinfo);
    //    $scope.patients = [];
    //    $scope.SearchBy = '';
    //}


    //Durgareddy as on 14-12-2019
    $scope.showCreateNewPlanBtn = false;
    $scope.showStartConsultationBtn = false;
    $scope.showFollowUpBtn = false;


    $scope.hideEditBtn = false;
    $scope.isFollowUpBtnAccess = false;
    $scope.isOnGngBtnAccess = false;
    $scope.showCreateplanBtn = false;

    $scope.UserId = eHnoteMasterDataService.getLoginId();
    if (userLoginDetails.RoleID !== undefined) {


        //if (userLoginDetails.RoleID === 2 || userLoginDetails.RoleID === 15 || userLoginDetails.RoleID === 17 || userLoginDetails.RoleID === 4) {
        //    $scope.hideEditBtn = true;
        //}

        if (userLoginDetails.RoleID === 1 || userLoginDetails.RoleID === 4 || userLoginDetails.RoleID === 43 || userLoginDetails.RoleID === 14) {
            $scope.isOnGngBtnAccess = true;
        }

        if (userLoginDetails.RoleID === 1 || userLoginDetails.RoleID === 4 || userLoginDetails.RoleID === 43 || userLoginDetails.RoleID === 14) {
            $scope.isFollowUpBtnAccess = true;
            $scope.showCreateplanBtn = true;
            if ($scope.cacheStorageItem.appointmentStatus !== undefined) {

                //if ($scope.cacheStorageItem.appointmentStatus == 'O') {
                //    $scope.showCreateplanBtn = false;
                //}  

            }
        }
        if (userLoginDetails.RoleID === 10) {// Optometrist

            if ($scope.cacheStorageItem.appointmentid === 0) {
                $scope.showCreateplanBtn = false;
            } else {
                $scope.showCreateplanBtn = true;
                if ($scope.cacheStorageItem.appointmentStatus !== undefined) {
                    if ($scope.cacheStorageItem.appointmentStatus === 'O') {
                        // $scope.showCreateplanBtn = false;
                    } else {
                        $scope.showCreateplanBtn = true;
                    }

                }
            }
        }

        if (userLoginDetails.RoleID === 15 || userLoginDetails.RoleID === 10) { //Associate Admin || Optometrist
            $scope.showBillinginCasehistory = false;
        }
        if (userLoginDetails.RoleID === 17) {//Reception with CRM
            $scope.showCreateplanBtn = false;
        }
        //Durgareddy as on 14-12-2018
        if (userLoginDetails.RoleID === 1 || userLoginDetails.RoleID === 4 || userLoginDetails.RoleID === 43 || userLoginDetails.RoleID === 10) {// Doctor || Admin Doctor || Optometrist
            $scope.showCreateNewPlanBtn = true;
        }



    }
    $scope.$on("ClearPastVisitCache", function (evt) {

    });
    $scope.$on("formcaseSearch", function (evt, data) {
        $scope.Tab = "casehistory";
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        $scope.$broadcast("callopthacaseHistory", data);
        //$scope.GetOpthaPatientCaseHistory(data);
    });

    $scope.LoadPatient = function () {
        $scope.showicon = false;
        var clinic = $scope.AppListselectedclinic;
        var param = eHnoteMasterDataService.getPatientSearchInfo();
        param.DoctorID = eHnoteMasterDataService.getLoginId();
        param.PageSize = 21;
        param.PageNumber = 1;
        param.SearchText = "";
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            param['HospitalCD'] = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        }
        param.EndAge = ($scope.Toage === "") ? 0 : 0;
        param.StartAge = ($scope.Frmage === "") ? 0 : 0;
        param.Count = 0;
        $scope.checkall = 'Y';
        eHnoteMasterDataService.addPatientSearchInfo(param);
        $scope.SearchPatient();
    };

    function InitialiseSearchParam() {
        $scope.patients = [];
        $scope.morepatientdata = true;
        prevpagno = 0;
        pageno = 0;
        $scope.pageno = 1;
    }


    $scope.SearchPatient = function (data) {
        param['SearchText'] = "";
        $scope.hospcal = [];
        if (prevpagno !== $scope.pageno) {
            pageno = $scope.pageno;
            prevpagno = $scope.pageno;
        }
        clinic = $scope.AppListselectedclinic;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            param['HospitalCD'] = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.hospcal.push(doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID);
        }

        var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();

        eHnotePatientDataService.SearchPatient1(param, OnGetPatientSuccess, OnGetPatientError, $scope.sendhospcode);
        $scope.Reset();
    };
    $scope.SearchByText = function () {
        var name = $scope.SearchBy;
        $scope.Emailid = "";
        $scope.showicon = true;
        if (name === "") {
            $scope.LoadPatient();
            $scope.showicon = false;
            return;
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
        clinic = $scope.AppListselectedclinic;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            param['HospitalID'] = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;

            $scope.HospitalArray = [];
            $scope.CheckHospitalId = {};

            //  if ($scope.RoleId == 1) {
            angular.forEach(doctorinfo.doctordata.UserAddress, function (item) {
                if (item.ExtDetails !== undefined) {
                    if (item.ExtDetails.HospitalInfo !== undefined && item.ExtDetails.HospitalInfo.HospitalID !== undefined && item.ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                        var Obj = {
                            "HospitalName": item.ClinicName,
                            "HospitalID": item.ExtDetails.HospitalInfo.HospitalID,
                            "ActiveIND": "Y",
                            "isChecked": true
                        };
                        $scope.HospitalArray.push(Obj);
                    }
                }
            });
            //}
        }
        var list = [];
        angular.forEach($scope.HospitalArray, function (items) {
            if (items.isChecked) {
                list.push(items.HospitalID);
            }
        });

        param['HospitalIDLst'] = list;


        if (clinic && clinic.ExtDetails && clinic.ExtDetails.HospitalIDLst && clinic.ExtDetails.HospitalIDLst !== null) {
            param['HospitalIDLst'] = clinic.ExtDetails.HospitalIDLst;
        }

        var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();
        eHnoteMasterDataService.addPatientSearchInfo(param);
        InitialiseSearchParam();
        $scope.morepatientdata = false;
        if (param.PhoneNumber !== "") {
            eHnotePatientDataService.SearchPatient1(param, OnGetSearchPatientSuccess, OnGetPatientSearchError, $scope.sendhospcode);
        } else if (param.SearchText !== "") {

            eHnotePatientDataService.SearchPatient1(param, OnGetSearchPatientSuccess, OnGetPatientSearchError, $scope.sendhospcode);
        }
    };

    function OnGetSearchPatientSuccess(data) {
        var patients = $scope.patients;
        if (data.count > 0) {
            $scope.count = data.count;
            $scope.ShowAllPatientsValue = false;
            $scope.ShowAllfilterPatientsValue = false;
            $scope.currentPage = 1;
            var patientsdata = data.rows;
            $scope.totalItems = data.count;
            $scope.patientpushval.length = 0;
            angular.forEach(data.rows, function (item) {
                // $scope.patientinitval.ProfileImg = "";
                var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
                var val = array_list[Math.floor(Math.random() * array_list.length)];
                if (item.EmailID !== undefined) {
                    $scope.patientinitval.EmailID = item.EmailID;
                }

                $scope.patientinitval.PatientID = item.PatientId;
                $scope.patientinitval.Title = item.Title;
                $scope.patientinitval.FullName = item.FullName;
                $scope.patientinitval.DOB = item.DOB;

                if (item.Age !== undefined) {
                    if (item.Age.toString().indexOf('.') !== -1) {
                        var ageSplitArray = item.Age.toString().split('.');
                        $scope.patientviewYear = ageSplitArray[0] + "Y";
                        $scope.patientviewMounth = ageSplitArray[1] !== undefined ? ageSplitArray[1] + "M" : "";
                        item.Age = $scope.patientviewYear + " " + $scope.patientviewMounth;
                    } else {
                        item.Age = item.Age + "Y";
                    }
                }
                $scope.patientinitval.Age = item.Age;
                $scope.patientinitval.Gender = item.Gender;
                $scope.patientinitval.LastVisited = item.LastVisited;
                $scope.patientinitval.CountryCode = item.CountryCode;
                $scope.patientinitval.PhoneNumber = item.PhoneNumber;
                $scope.patientinitval.CurrentAge = item.CurrentAge;
                $scope.patientinitval.colors = val;
                $scope.patientinitval.patientCaseBillingAmtInfo = item.patientCaseBillingAmtInfo;
                $scope.patientinitval.patientdisplayid = item.DisplayID;
                $scope.patientinitval.Reviewed = item.Reviewed === undefined ? "N" : item.Reviewed;
                $scope.patientinitval.familydisplayid = item.FamilyDisplayID;
                // $scope.patientinitval.ProfileImg = item.ProfileImg;
                $scope.patientinitval.ReferralSourceId = item.ReferralSourceId;
                $scope.patientinitval.Due = item.Due;
                var previouspatval = angular.copy($scope.patientinitval);
                $scope.patientpushval.push(previouspatval);
            });
            $scope.patients = $scope.patientpushval;

            $scope.noresult = false;
            $scope.showloading = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        } else {
            $scope.ShowAllPatientsValue = true;
            $scope.ShowAllfilterPatientsValue = false;
            $scope.count = 0;
            $scope.patients = [];
            $scope.totalItems = 0;
        }
    }
    function OnGetPatientSearchError() {
        $scope.ShowAllPatientsValue = true;
        $scope.ShowAllfilterPatientsValue = false;
        $scope.count = 0;
        $scope.patients = [];
        $scope.totalItems = 0;
    }
    $scope.patientinitval = {};
    $scope.patientinitval.patientCaseBillingAmtInfo = [];
    $scope.patientpushval = [];
    function OnGetPatientSuccess(data) {
        var patients = "";
        $scope.ShowAllPatientsValue = false;
        $scope.ShowAllfilterPatientsValue = false;
        patients = $scope.patients;
        $scope.count = data.count;
        $scope.totalItems = data.count;
        var patientsdata = data.rows;
        $scope.patientpushval.length = 0;
        angular.forEach(data.rows, function (item) {
            var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
            var val = array_list[Math.floor(Math.random() * array_list.length)];
            $scope.patientinitval.PatientID = item.PatientId;
            $scope.patientinitval.Title = item.Title;
            $scope.patientinitval.FullName = item.FullName;
            $scope.patientinitval.DOB = item.DOB;




            if (item.Age !== undefined) {
                if (item.Age.toString().indexOf('.') !== -1) {
                    var ageSplitArray = item.Age.toString().split('.');
                    $scope.patientviewYear = ageSplitArray[0] + "Y";
                    $scope.patientviewMounth = ageSplitArray[1] !== undefined ? ageSplitArray[1] + "M" : "";
                    item.Age = $scope.patientviewYear + " " + $scope.patientviewMounth;
                } else {
                    item.Age = item.Age + "Y";
                }
            }

            $scope.patientinitval.Age = item.Age;
            $scope.patientinitval.EmailID = item.EmailID;
            $scope.patientinitval.Gender = item.Gender;
            $scope.patientinitval.LastVisited = item.LastVisited;
            $scope.patientinitval.PhoneNumber = item.PhoneNumber;
            $scope.patientinitval.CurrentAge = item.CurrentAge;
            $scope.patientinitval.colors = val;
            $scope.patientinitval.patientCaseBillingAmtInfo = item.patientCaseBillingAmtInfo;
            $scope.patientinitval.patientdisplayid = item.DisplayID;
            $scope.patientinitval.Reviewed = item.Reviewed === undefined ? "N" : item.Reviewed;
            $scope.patientinitval.familydisplayid = item.FamilyDisplayID;
            $scope.patientinitval.Due = item.Due;
            var previouspatval = angular.copy($scope.patientinitval);
            $scope.patientpushval.push(previouspatval);
        });
        $scope.patients = $scope.patientpushval;
        $scope.noresult = false;
        $scope.showloading = false;
        angular.forEach(data.rows, function (item) {
            if (item.CurrentAge !== undefined) {
                $scope.ageSplits.year = item.CurrentAge.year;
                $scope.ageSplits.months = item.CurrentAge.month.toString();
                if ($scope.ageSplits.months < 10) {
                    $scope.ageSplits.months = "0" + $scope.ageSplits.months;
                    item.Age = $scope.ageSplits.year + "." + $scope.ageSplits.months;
                } else {
                    item.Age = $scope.ageSplits.year + "." + $scope.ageSplits.months;
                }
            } else {
                if (item.Age !== undefined) {
                    if (item.Age.toString().indexOf('.') !== -1) {
                        var ageSplitArray = item.Age.toString().split('.');
                        $scope.ageSplits.year = ageSplitArray[0].toString();
                        $scope.ageSplits.months = ageSplitArray[1].toString();
                        item.Age = $scope.ageSplits.year + "." + $scope.ageSplits.months;
                    } else {
                        $scope.ageSplits.year = item.Age.toString();
                        $scope.ageSplits.months = '0';
                        item.Age = $scope.ageSplits.year + "." + $scope.ageSplits.months;
                    }
                } else {
                    $scope.ageSplits = { year: 1, months: '0' };
                }
            }
        });
        $scope.$broadcast('scroll.infiniteScrollComplete');
    }
    $scope.FileUplaodItemIndex = 0;
    function getAllFiles(patientid, doctorId) {
        eHnoteDiagnosisDataServices.GetAllFileUploads(patientid, doctorId).then(function (response) {
            $scope.PatientimageFile = response.data.Appointments;
            if ($scope.PatientimageFile !== undefined) {
                seperateFileUpload($scope.PatientimageFile[0]);
            }
        });
    }


    function seperateFileUpload(arr) {
        $scope.generalImgUploads = [];
        $scope.generalPdfUploads = [];
        $scope.PreTreatmentImgUploads = [];
        $scope.PreTreatmentPdfUploads = [];
        $scope.PostTreatmentImgUploads = [];
        $scope.PostTreatmentPdfUploads = [];
        $scope.ConsentImgUploads = [];
        $scope.ConsentPdfUploads = [];
        $scope.ForumFiles = angular.copy(arr.ForumFiles) || [];
        $scope.ForumPdfUploads = [];
        $scope.ForumImgUploads = [];
        if ($scope.ForumFiles.length > 0) {


            for (var i = 0; i < $scope.ForumFiles.length; i++) {
                $scope.docname = '';
                $scope.ForumFiles[i].docNameDisplay = '';
                var extension = ".jpg";



                if ($scope.ForumFiles[i].DocURL) {
                    extension = $scope.ForumFiles[i].DocURL.split(/[#?]/)[0].split('.').pop().trim();
                }


                var pName = $scope.ForumFiles[i].DocName.split("_")[0];
                if (pName.length > 9) {
                    name = pName.substring(0, 9) + "..." + "." + extension;
                } else {
                    name = angular.copy(pName) + '.' + extension;
                }
                $scope.ForumFiles[i].docNameDisplay = name;

                if ($scope.ForumFiles[i].DocURL.indexOf(".pdf") > -1) {
                    $scope.ForumFiles[i].DeleteInd = false;
                    $scope.ForumFiles.IsRemarksinEdit = false;
                    switch ($scope.ForumFiles[i].FileTypeId) {
                        case 6:
                            $scope.ForumPdfUploads.push($scope.ForumFiles[i]);
                            break;
                    }
                } else {
                    $scope.ForumFiles[i].DeleteInd = false;
                    $scope.ForumFiles.IsRemarksinEdit = false;
                    switch ($scope.ForumFiles[i].FileTypeId) {
                        case 6:
                            $scope.ForumImgUploads.push($scope.ForumFiles[i]);
                            break;
                    }
                }
            }
        }
        if (arr.Files && arr.Files.length > 0) {
            var filteredArray = arr.Files;
            angular.forEach(filteredArray, function (item) {
                var extension = ".jpg";
                if (item.DocName) {
                    extension = item.DocName.split(".")[1];
                }
                var pName = item.DocName.split("_")[0];
                if (pName.length > 9) {
                    name = pName.substring(0, 9) + "..." + "." + extension;
                } else {
                    name = angular.copy(pName) + '.' + extension;
                }
                item.docNameDisplay = name;
                if (item.DocURL.indexOf(".pdf") > -1) {
                    item.DeleteInd = false;
                    item.IsRemarksinEdit = false;

                    switch (item.FileTypeId) {
                        case 1:
                            $scope.generalPdfUploads.push(item);
                            break;
                        case 2:
                            $scope.PreTreatmentPdfUploads.push(item);
                            break;
                        case 3:
                            $scope.PostTreatmentPdfUploads.push(item);
                            break;
                        case 4:
                            $scope.ConsentPdfUploads.push(item);
                            break;
                    }

                } else {
                    item.DeleteInd = false;
                    item.IsRemarksinEdit = false;
                    switch (item.FileTypeId) {
                        case 1:
                            $scope.generalImgUploads.push(item);
                            break;
                        case 2:
                            $scope.PreTreatmentImgUploads.push(item);
                            break;
                        case 3:
                            $scope.PostTreatmentImgUploads.push(item);
                            break;
                        case 4:
                            $scope.ConsentImgUploads.push(item);
                            break;
                    }
                }
            });
        }

        $scope.Subtab = 1;
    }

    $scope.getFiles = function (arr, ind) {
        $scope.FileUplaodItemIndex = ind;
        seperateFileUpload(arr);
    };
    $scope.openfile = function (item) {
        if (item.FileExt === 'application/pdf') {
            window.open(item.DocURL);
        }
        else {
            $scope.FileUploadURlArray = [];
            $scope.FileUploadURlArray.push({
                "url": item.DocURL,
                "thumbUrl": item.DocURL
            });
            Lightbox.openModal($scope.FileUploadURlArray, 0);
        }
    };


    $scope.preimgitemPreview = function (index) {
        Lightbox.openModal($scope.PreTreatmentImgUploads, index);
    };
    $scope.genimgitemPreview = function (index) {
        Lightbox.openModal($scope.generalImgUploads, index);
    };
    $scope.postimgitemPreview = function (index) {
        Lightbox.openModal($scope.PostTreatmentImgUploads, index);
    };
    $scope.consentimgitemPreview = function (index) {
        Lightbox.openModal($scope.ConsentImgUploads, index);
    };


    $scope.openPdfFileUploads = function (url) {
        window.open(url);
    };


    $scope.createaNewPlan = function () {
        $scope.cacheStorageItem.appointmentid = 0;
        $scope.cacheStorageItem.Diagnosis = [];
        $scope.cacheStorageItem.Treatments = [];
        $scope.cacheStorageItem.Investigations = [];
        $scope.cacheStorageItem.ChiefComplaints = [];
        $scope.cacheStorageItem.ClinicalNotes = [];
        $scope.cacheStorageItem.Prescriptions = [];
        $scope.cacheStorageItem.Observations = [];
        $scope.cacheStorageItem.LabTest = [];
        $scope.cacheStorageItem.MedicalConditions = [];
        $scope.cacheStorageItem.AllergyItems = [];
        $scope.cacheStorageItem.MedicalHistory = [];
        $scope.cacheStorageItem.UnaidedArray = [];
        $scope.cacheStorageItem.RefractionArray = [];
        $scope.cacheStorageItem.AcceptenceArray = [];
        $scope.cacheStorageItem.KeretometerArray = [];
        $scope.cacheStorageItem.OcularDominanceArray = [];
        $scope.cacheStorageItem.PinholeArray = [];
        $scope.cacheStorageItem.LCVArray = [];
        $scope.cacheStorageItem.BinocularArray = [];
        $scope.cacheStorageItem.AnteriorSegmentArray = [];
        $scope.cacheStorageItem.PosteriorSegmentArray = [];
        $scope.cacheStorageItem.AdditionalInvestgationArray = [];
        $scope.cacheStorageItem.RestructuredDocInvTemplates = [];
        $scope.cacheStorageItem.ColourVisionArray = [];
        $scope.cacheStorageItem.OcularMotilityArray = [];
        $scope.cacheStorageItem.TonometryTestArray = [];
        $scope.cacheStorageItem.Findings = [];
        $scope.cacheStorageItem.InvestigationDetails = [];
        $scope.cacheStorageItem.chkOldglass = false;
        $scope.cacheStorageItem.IsfindingsDataInitialized = false;
        $scope.cacheStorageItem.FollowUpDuration = '';
        $scope.cacheStorageItem.FollowUpDurationType = 'D';
        $scope.cacheStorageItem.FollowUpDurationTypeName = 'Day(s)';
        $scope.cacheStorageItem.FollowUpNotes = '';
        $scope.cacheStorageItem.SurgeryArray = [];
        $scope.cacheStorageItem.FileUploadImageArray = [];
        $scope.cacheStorageItem.AppointmentPatientUploads = [];
        $scope.cacheStorageItem.appointmentid = 0;
        $scope.cacheStorageItem.FileUploadPDfArray = [];
        $scope.cacheStorageItem.appointmentStatus = "";
        $scope.cacheStorageItem.TreatmentPlanId = 0;
        $scope.cacheStorageItem.SelectedConsultationType = "";
        $scope.cacheStorageItem.PatientVitals = [];
        $scope.cacheStorageItem.OptomComments = '';
        $scope.cacheStorageItem.DoctorComments = '';
        $scope.cacheStorageItem.GlassPrescriptionArray = [];
        $scope.cacheStorageItem.ArRefractionArray = [];
        $scope.cacheStorageItem.PlanOfCareComments = [];

        $scope.cacheStorageItem.BirthHistory = [];
        $scope.cacheStorageItem.FamilyHistory = [];
        $scope.cacheStorageItem.NutritionalHistory = [];
        $scope.cacheStorageItem.ImmunisationHistory = [];
        $scope.cacheStorageItem.SurgicalHistory = [];
        $scope.cacheStorageItem.PatientInvestigations = [];
        $scope.cacheStorageItem.MenstrualHistory = [];
        $scope.cacheStorageItem.LifestyleHistory = [];
        $scope.cacheStorageItem.PatientSuggestInvestigation = [];
        $scope.cacheStorageItem.LabtestList = [];
        $scope.cacheStorageItem.GonioscopyArray = [];
        $scope.cacheStorageItem.VisionDetails = [];
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.$broadcast("callCreateNewPlan");
    };

    function generatePatientNotes(patientId) {
        //eHnotePatientDataService.GetGeneralPatientHistory(patientId).then(function (resp) {
        eHnotePatientDataService.GetMedicalConditonHistoriesByPatientId(patientId).then(function (resp) {
            if (resp.data !== undefined) {
                $scope.PatientPastMedicalHistory = resp.data.PastMedicalHistory;
                $scope.PatientBirthHistory = resp.data.BirthHistory;
                $scope.PatientFamilyHistory = resp.data.FamilyHistory;
                $scope.PatientImmunisationHistory = resp.data.ImmunisationHistory;
                $scope.PatientNutritionalHistory = resp.data.NutritionalHistory;
                $scope.PatientSurgicalHistory = resp.data.SurgicalHistory;
                $scope.PatientMenstrualHistory = resp.data.MenstrualHistory;
                $scope.PatientLifestyleHistory = resp.data.PatientLifestyleHistory;
            }
            $scope.cacheStorageItem.MedicalHistory = [];
            $scope.cacheStorageItem.BirthHistory = [];
            $scope.cacheStorageItem.FamilyHistory = [];
            $scope.cacheStorageItem.NutritionalHistory = [];
            $scope.cacheStorageItem.ImmunisationHistory = [];
            $scope.cacheStorageItem.SurgicalHistory = [];
            $scope.cacheStorageItem.MenstrualHistory = [];
            $scope.cacheStorageItem.LifestyleHistory = [];

            if ($scope.PatientPastMedicalHistory !== undefined) {
                if ($scope.PatientPastMedicalHistory.length !== 0) {
                    $scope.cacheStorageItem.MedicalHistory = $scope.PatientPastMedicalHistory;
                }
            }

            if ($scope.PatientBirthHistory !== undefined) {
                if ($scope.PatientBirthHistory.length !== 0) {
                    $scope.cacheStorageItem.BirthHistory = $scope.PatientBirthHistory;
                }
            }
            if ($scope.PatientFamilyHistory !== undefined) {
                if ($scope.PatientFamilyHistory.length !== 0) {
                    $scope.cacheStorageItem.FamilyHistory = $scope.PatientFamilyHistory;
                }
            }
            if ($scope.PatientNutritionalHistory !== undefined) {
                if ($scope.PatientNutritionalHistory.length !== 0) {
                    $scope.cacheStorageItem.NutritionalHistory = $scope.PatientNutritionalHistory;
                }
            }
            if ($scope.PatientImmunisationHistory !== undefined) {
                if ($scope.PatientImmunisationHistory.length !== 0) {
                    $scope.cacheStorageItem.ImmunisationHistory = $scope.PatientImmunisationHistory;
                }
            }
            if ($scope.PatientSurgicalHistory !== undefined) {
                if ($scope.PatientSurgicalHistory.length !== 0) {
                    $scope.cacheStorageItem.SurgicalHistory = $scope.PatientSurgicalHistory;
                }
            }
            if ($scope.PatientMenstrualHistory !== undefined) {
                if ($scope.PatientMenstrualHistory.length !== 0) {
                    $scope.cacheStorageItem.MenstrualHistory = $scope.PatientMenstrualHistory;
                }
            }

            if ($scope.PatientLifestyleHistory !== undefined) {
                if ($scope.PatientLifestyleHistory.length !== 0) {
                    $scope.cacheStorageItem.LifestyleHistory = $scope.PatientLifestyleHistory;
                }
            }
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);

        }, function (err) {

        });
    }
    $scope.previousfiles = [];
    $scope.TempImagesArray = [];
    $scope.TempPdfArray = [];

    $scope.previousFileUploadObj = {
        "RecordTypeId": "",
        "DoctorName": "",
        "PatientName": $scope.cacheStorageItem.PatientName,
        "PatientId": $scope.cacheStorageItem.patientid,
        "FileDate": "",
        "MedicalRecordId": 0,
        "UserId": eHnoteMasterDataService.getLoginId()
    };

    //$scope.dynamicPreviousPopover = {
    //    templateUrl: 'patientPreviousFiles.html'
    //};
    $scope.tempPrecriptionCount = 0;

    $scope.uploadPatientPreviousFiles = function ($files) {
        if ($files.length > 0) {
            $scope.previousfiles.push($files[0]);
            if ($scope.previousfiles != null) {
                if ($scope.previousfiles.length > 0) {
                    $scope.TempImagesArray = [];
                    $scope.TempPdfArray = [];
                    angular.forEach($scope.previousfiles, function (kitem) {

                        var pName = kitem.name, name = "";
                        var type = kitem.type.split("/")[1];
                        if (pName.length > 9) {
                            name = pName.substring(0, 9) + "..." + "." + type;
                        } else {
                            name = angular.copy(pName) + '.' + type;
                        }
                        var obj = {
                            "file": kitem,
                            "DeleteInd": false,
                            "FileId": 0,
                            "FileExt": kitem.type,
                            "FileName": name
                        };
                        if (kitem.type != 'application/pdf') {
                            $scope.TempImagesArray.push(obj);
                            $scope.tempPrecriptionCount++;
                        }
                        else {
                            $scope.TempPdfArray.push(obj);
                        }
                    });
                }
            }
        }
    };
    $scope.Removeimage = function (item) {
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
            item.DeleteInd = true;
            if (item.FileId === 0) {
                if ($scope.TempImagesArray.length > 0) {
                    for (var k = 0; k < $scope.TempImagesArray.length; k++) {
                        if ($scope.TempImagesArray[k].DeleteInd === true) {
                            $scope.TempImagesArray.splice(k, 1);
                        }
                    }
                }
                if ($scope.previousfiles.length > 0) {
                    for (var j = 0; j < $scope.previousfiles.length; j++) {
                        //if (item.file.name === $scope.previousfiles[j].name) {
                        if ($scope.previousfiles[j].name === item.file.name) {
                                $scope.previousfiles.splice(j, 1);
                        }
                    }
                   
                }
            }
        }, function () {
            return;
        });


    };
    $scope.RemovePdfimage = function (item) {
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
            item.DeleteInd = true;
            if (item.FileId === 0) {
                if ($scope.TempPdfArray.length > 0) {
                    for (var k = 0; k < $scope.TempPdfArray.length; k++) {
                        if ($scope.TempPdfArray[k].DeleteInd === true) {
                            $scope.TempPdfArray.splice(k, 1);
                        }
                    }
                }
                if ($scope.previousfiles.length > 0) {
                    for (var j = 0; j < $scope.previousfiles.length; j++) {
                        if ($scope.previousfiles[j].name === item.file.name) {
                            $scope.previousfiles.splice(j, 1);
                        }
                    }

                }
            }
        }, function () {
            return;
        });
    };


    $scope.openPdfFileUploads = function (url) {
        window.open(url);
    };


    $scope.ChangeRecordType = function (item) {
        item = item || "";
        if (item != "") {
            $scope.RecordTypeId = item.RecordTypeId;
        }
    }

    $scope.ChangeRecordTypeList = function (item) {
        item = item || "";
        if (item != "") {
            $scope.SearchRecordTypeId = item.RecordTypeId;
        }
        else {
            $scope.SearchRecordTypeId = "";
        }
    }
    $scope.changeFromDate = function (fromdt) {
        $scope.SearchObj.FromDate = $filter("dateFormatter")(fromdt, "-");
    }

    $scope.changeToDate = function (todt) {
        $scope.SearchObj.ToDate = $filter("dateFormatter")(todt, "-");
    }
  
    $scope.SearchPreviousPatientFiles = function () {
        $scope.SearchObj.RecordTypeId = $scope.SearchRecordTypeId;
        getAllPatientPreviousRecords($scope.SearchObj);
    }


    $scope.DeletePreviousImages = function (item) {
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
            var obj = {
                "MedicalRecordId": item.MedicalRecordId,
                "UserId": eHnoteMasterDataService.getLoginId(),
                "FileId": item.FileId,
                "FileName": item.FileName,
                "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
            }
            eHnoteDiagnosisDataServices.DeletePatientPreviousMedicalRecordImg(obj, onupdateDeletesuccess, onupdateDelerror);
        }, function () { });
        function onupdateDeletesuccess(response) {
            if (response.status === 'Success') {
               // getPatientNoteFiles(item.AppointmentId);
                getAllPatientPreviousRecords($scope.SearchObj);
                alertify.success("File deleted successfully");
            }
        }
        function onupdateDelerror(errordata) {
            console.log(errordata);
        }
    };

    $scope.SavePatientPreviousUploads = function () {
        if ($scope.previousfiles === "" || $scope.previousfiles === null || $scope.previousfiles === undefined) {
            return;
        }
        if ($scope.RecordTypeId==="") {
            alertify.error("Please Select RecordType");
            return;
        }
        if ($scope.previousFileUploadObj.DoctorName === "") {
            alertify.error("Please Enter DoctorName");
            return;
        }
        if ($scope.previousFileUploadObj.FileDate === "") {
            alertify.error("Please Select Date");
            return;
        }
        var file = $scope.previousfiles;
        var fd = new FormData();
        fd.append("PatientId", $scope.previousFileUploadObj.PatientId);
        fd.append("UserId", $scope.previousFileUploadObj.UserId);
        fd.append("DoctorName", $scope.previousFileUploadObj.DoctorName);
        fd.append("PatientName", $scope.previousFileUploadObj.PatientName);
        fd.append('FileDate', $filter("dateFormatter")($scope.previousFileUploadObj.FileDate, "-"));
        fd.append("MedicalRecordId", $scope.previousFileUploadObj.MedicalRecordId);
        fd.append("RecordTypeId", $scope.RecordTypeId);
        fd.append("DeleteInd", 'N');
        fd.append("HospitalID", doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID);
       
        angular.forEach(file, function (value, key) {
            fd.append(key, value);
        });
        eHnoteDiagnosisDataServices.addPatientPreviousUploadfile(fd, callbackfileuploadSuccess, callbackfileuploadError);
        function callbackfileuploadSuccess(resp) {
            if (resp.status === "Success") {
                $scope.previousfiles = [];
                $scope.TempImagesArray = [];
                $scope.TempPdfArray = [];
                $scope.tempPrecriptionCount = 0;
                //getAllPatientPreviousRecords($scope.cacheStorageItem.patientid);
                $scope.previousFileUploadObj.DoctorName = "";
                $scope.previousFileUploadObj.FileDate = "";
                $scope.previousFileUploadObj.MedicalRecordId = 0;
                $scope.previousFileUploadObj.RecordTypeId = $scope.RecordTypesList[0];
                getAllPatientPreviousRecords($scope.SearchObj);

            }
           
        }
        function callbackfileuploadError(err) {
            alertify.success("Uploading Failed");
        }
    }

    $scope.GetAllDocumentType = function () {
        eHnotePatientAddressDataServices.GetAllDocumentType().then(function (resp) {
            $scope.DocumentTypeList = resp.data.DocumentTypes;
        }, function (err) {
            console.log(err);
            alertify.error("Getting DocumentType Failed");
        });
    };
    $scope.GetAllDocumentType();

    function restructureUploads(docArray) {

        if (docArray.length > 0) {
            $scope.TempImagesArray = [];
            $scope.TempPdfArray = [];
            angular.forEach(docArray, function (kitem) {
                var pName = kitem.DocumentName, name = "";
                var type = kitem.DocumentExt.split("/")[1];
                if (pName.length > 9) {
                    name = pName.substring(0, 9) + "..." + "." + type;
                } else {
                    name = angular.copy(pName) + '.' + type;
                }
                kitem.FileName = name;
                if (kitem.DocumentExt != 'application/pdf') {
                    $scope.TempImagesArray.push(kitem);
                    $scope.tempPrecriptionCount++;
                }
                else {
                    $scope.TempPdfArray.push(kitem);
                }
            });
        }
    }

    $scope.getPatientinsurancepaDetails = function () {
        $scope.patientInsuranceTpasArray = [];
        $scope.selectedInsTpaObj = "";
        eHnoteInsuranceService.getPatientInsuranceDtls(appointmentinfo.PatientID).then(function (response) {
            if (response.data !== undefined) {
                if (response.data.rows.length > 0) {
                    $scope.patientInsuranceTpasArray = response.data.rows;
                    $scope.selectedInsTpaObj = $scope.patientInsuranceTpasArray[0];
                    $scope.TempImagesArray = [];
                    $scope.TempPdfArray = [];
                    if ($scope.selectedInsTpaObj.PatientDocumentDetails.length > 0) {
                        restructureUploads($scope.selectedInsTpaObj.PatientDocumentDetails);
                    }

                }
            }
        });
    }
   
    $scope.insTpaUploadObj = {
        "UserId": eHnoteMasterDataService.getLoginId(),
        "PatientId": appointmentinfo.PatientID,
        "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
        "DocumentObj": "",
        "DocumentTypeId": "",
        "PatientInsuranceDetailId": 0,
        "InsuranceUploads": [],
        "TempImagesArray": [],
        "TempPdfArray": []
    };
    $scope.selectDocumentType = function (item) {

        $scope.insTpaUploadObj.DocumentTypeId = item.Id;

    };

    $scope.selectInsTpaFile = function ($files) {
        if ($files.length > 0) {
            $scope.insTpaUploadObj.InsuranceUploads = $files;
            if ($scope.insTpaUploadObj.InsuranceUploads != null) {
                if ($scope.insTpaUploadObj.InsuranceUploads.length > 0) {
                    $scope.insTpaUploadObj.TempImagesArray = [];
                    $scope.insTpaUploadObj.TempPdfArray = [];
                    angular.forEach($scope.insTpaUploadObj.InsuranceUploads, function (kitem) {

                        var pName = kitem.name, name = "";
                        var type = kitem.type.split("/")[1];
                        if (pName.length > 9) {
                            name = pName.substring(0, 9) + "..." + "." + type;
                        } else {
                            name = angular.copy(pName) + '.' + type;
                        }
                        var obj = {
                            "file": kitem,
                            "DocumentTypeId": $scope.insTpaUploadObj.DocumentTypeId,
                            "DeleteInd": false,
                            "DocumentId": 0,
                            "DocumentExt": kitem.type,
                            "DisplayName": name
                        }
                        if (kitem.type != 'application/pdf') {
                            $scope.insTpaUploadObj.TempImagesArray.push(obj);

                        }
                        else {
                            $scope.insTpaUploadObj.TempPdfArray.push(obj);
                        }
                    });
                }
            }
        }
    };

    $scope.uploadPatientInsTpaDocuments = function () {
        var file = $scope.insTpaUploadObj.InsuranceUploads;
        var fd = new FormData();
        if ($scope.insTpaUploadObj.DocumentTypeId == undefined || $scope.insTpaUploadObj.DocumentTypeId == null || $scope.insTpaUploadObj.DocumentTypeId == "") {
            alertify.error("Please select Document Type");
            return
        }
        else if (file == undefined || file == null || file == "") {
            alertify.error("Please select file");
            return
        }


        $scope.insTpaUploadObj.PatientInsuranceDetailId = $scope.selectedInsTpaObj.PatientInsuranceDetailId;

        fd.append("PatientInsuranceDetailId", $scope.insTpaUploadObj.PatientInsuranceDetailId);
        fd.append("PatientId", $scope.insTpaUploadObj.PatientId);
        fd.append("BranchId", $scope.insTpaUploadObj.HospitalId);
        fd.append("UserId", $scope.insTpaUploadObj.UserId);
        fd.append("DocumentTypeId", $scope.insTpaUploadObj.DocumentTypeId);
        fd.append("InsuranceUploads", $scope.insTpaUploadObj.InsuranceUploads);




        angular.forEach(file, function (value, key) {
            fd.append(key, value);
        });
        eHnoteDiagnosisDataServices.addPatientInsuranceTpaFileUpload(fd, callbackfileuploadSuccess, callbackfileuploadError);
        function callbackfileuploadSuccess(resp) {
            if (resp.Status === "Success") {
                $scope.TempImagesArray = [];
                $scope.TempPdfArray = [];
                if (resp.DocumentDetails.length > 0) {
                    $scope.selectedInsTpaObj.PatientDocumentDetails.push(resp.DocumentDetails[resp.DocumentDetails.length - 1]);
                    restructureUploads(resp.DocumentDetails);
                    $scope.insTpaUploadObj.DocumentTypeId = "";
                    $scope.insTpaUploadObj.InsuranceUploads = "";
                    $scope.GetAllDocumentType();
                    angular.element("input[type='file']").val('');
                }
            } else {
                alertify.error("Some Error Occured");
            }

        }
        function callbackfileuploadError(err) {
            alertify.success("Uploading Failed");
        }
    }

    $scope.checkpatientInsuranceUploads = function (item, index) {
        $scope.FileUploadIndex = index;
        $scope.selectedInsTpaObj = item;
        $scope.TempImagesArray = [];
        $scope.TempPdfArray = [];
        if ($scope.selectedInsTpaObj.PatientDocumentDetails.length > 0) {
            restructureUploads($scope.selectedInsTpaObj.PatientDocumentDetails);
        }
    }

    $scope.backtoPatientProfile = function () {
        $location.url("/PatientProfile");
        $scope.cacheStorageItem.appointmentid = 0;
        $scope.cacheStorageItem.Diagnosis = [];
        $scope.cacheStorageItem.Treatments = [];
        $scope.cacheStorageItem.Investigations = [];
        $scope.cacheStorageItem.ChiefComplaints = [];
        $scope.cacheStorageItem.ClinicalNotes = [];
        $scope.cacheStorageItem.Prescriptions = [];
        $scope.cacheStorageItem.Observations = [];
        $scope.cacheStorageItem.PlanOfCareComments = [];
        $scope.cacheStorageItem.LabTest = [];
        $scope.cacheStorageItem.MedicalConditions = [];
        $scope.cacheStorageItem.AllergyItems = [];
        $scope.cacheStorageItem.MedicalHistory = [];
        $scope.cacheStorageItem.UnaidedArray = [];
        $scope.cacheStorageItem.RetinoscopyArray = [];
        $scope.cacheStorageItem.RefractionArray = [];
        $scope.cacheStorageItem.AcceptenceArray = [];
        $scope.cacheStorageItem.KeretometerArray = [];
        $scope.cacheStorageItem.OcularDominanceArray = [];
        $scope.cacheStorageItem.PinholeArray = [];
        $scope.cacheStorageItem.LCVArray = [];
        $scope.cacheStorageItem.BinocularArray = [];
        $scope.cacheStorageItem.AnteriorSegmentArray = [];
        $scope.cacheStorageItem.PosteriorSegmentArray = [];
        $scope.cacheStorageItem.AdditionalInvestgationArray = [];
        $scope.cacheStorageItem.RestructuredDocInvTemplates = [];
        $scope.cacheStorageItem.ColourVisionArray = [];
        $scope.cacheStorageItem.OcularMotilityArray = [];
        $scope.cacheStorageItem.TonometryTestArray = [];
        $scope.cacheStorageItem.Findings = [];
        $scope.cacheStorageItem.InvestigationDetails = [];
        $scope.cacheStorageItem.chkOldglass = false;
        $scope.cacheStorageItem.IsfindingsDataInitialized = false;
        $scope.cacheStorageItem.FollowUpDuration = '';
        $scope.cacheStorageItem.FollowUpDurationType = 'D';
        $scope.cacheStorageItem.FollowUpDurationTypeName = 'Day(s)';
        $scope.cacheStorageItem.FollowUpNotes = '';
        $scope.cacheStorageItem.SurgeryArray = [];
        $scope.cacheStorageItem.FileUploadImageArray = [];
        $scope.cacheStorageItem.appointmentid = 0;
        $scope.cacheStorageItem.FileUploadPDfArray = [];
        $scope.cacheStorageItem.appointmentStatus = "";
        $scope.cacheStorageItem.TreatmentPlanId = 0;
        $scope.cacheStorageItem.SelectedConsultationType = "";
        $scope.cacheStorageItem.AppointmentPatientUploads = [];
        $scope.cacheStorageItem.OptomComments = '';
        $scope.cacheStorageItem.DoctorComments = '';
        $scope.cacheStorageItem.GlassPrescriptionArray = [];
        $scope.cacheStorageItem.ArRefractionArray = [];
        $scope.cacheStorageItem.PatientVitals = [];
        //$scope.cacheStorageItem.PlanOfCareComments = [];
        $scope.cacheStorageItem.BirthHistory = [];
        $scope.cacheStorageItem.FamilyHistory = [];
        $scope.cacheStorageItem.NutritionalHistory = [];
        $scope.cacheStorageItem.ImmunisationHistory = [];
        $scope.cacheStorageItem.SurgicalHistory = [];
        $scope.cacheStorageItem.PatientInstructions = [];
        $scope.cacheStorageItem.MenstrualHistory = [];

        $scope.cacheStorageItem.LifestyleHistory = [];
        // $scope.cacheStorageItem.Checklist = {};
        $scope.cacheStorageItem.Checklist.MainArray.SkinArray = [];
        $scope.cacheStorageItem.Checklist.MainArray.HairArray = [];
        $scope.cacheStorageItem.GonioscopyArray = [];
        $scope.cacheStorageItem.DryEyeEvaluationArray = [];
        $scope.cacheStorageItem.ClinicalNotesComments = '';
        $scope.cacheStorageItem.PatientInstructionComments = '';
        $scope.cacheStorageItem.LacrimalPatiency = [];
        $scope.cacheStorageItem.NavCasehistoryToPatientprofile = false;
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
    }

   
}]);


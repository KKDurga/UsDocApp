
eHnoteWebApp.controller("EhnoteMedicalCtrl", ["$scope", "$rootScope", "eHnoteConditionsDataService", "datacookieFactory", 'eHnoteMainAppointmentService', "datapersistanceFactory", "eHnoteCacheStorageService", "eHnotePatientDataService", "$timeout", "$filter", 'eHnoteMasterDataService', 'alertify', "eHnoteLoginStatusService", 'eHnotePatientPVService', function ($scope, $rootScope, eHnoteConditionsDataService, datacookieFactory, eHnoteMainAppointmentService, datapersistanceFactory, eHnoteCacheStorageService, eHnotePatientDataService, $timeout, $filter, eHnoteMasterDataService, alertify, eHnoteLoginStatusService, eHnotePatientPVService) {
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    var consultationtype = eHnoteMasterDataService.getconsultType();
    $scope.noVitaldisplay = false;
    $scope.cacheStorageItem.Bmivalue = "";
    $scope.cacheStorageItem.USRId = doctorinfo.doctordata.User[0].DoctorID;
    var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    var strttime = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var strtlocalTime = moment.utc(strttime).toDate();
    strtlocalTime = moment(strtlocalTime).format('YYYY-MM-DD HH:mm:ss');
    cacheStorageItem.ConsultationStartTime = strtlocalTime;
    eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
    $scope.cacheStorageItem = cacheStorageItem;
    if (cacheStorageItem.patienthistcaseid !== undefined) {
        var PatientVisitID = cacheStorageItem.patienthistcaseid;
    } else {
        var PatientVisitID = 0;
    }

    $scope.medicalsForDoctor = [];
    $scope.doctorID = $scope.cacheStorageItem.doctorid;
    $scope.hospitalcd = undefined;
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.hospitalcd = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
    }
 

    if (!cacheStorageItem.IsInvestigationMode) {
        if (cacheStorageItem.appointmentid === 0) {
            AddAppointment();
        } else {
            startConsultation(cacheStorageItem.appointmentid);
        }
    }

    function AddAppointment() {
        var appointdate = $filter('date')(new Date($scope.curDate.ConsultationDate), "yyyy-MM-dd");
        var daycd = $filter('date')(new Date($scope.curDate.ConsultationDate), "EEE");
        var starttime = $filter('date')(new Date(), "HH:mm");
        var endtime = $filter('date')(new Date(), "HH:mm");
        var exitLoop = false;
        daycd = daycd.toUpperCase();
        var hospcode = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        var hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        var parenthospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        eHnotePatientDataService.AddPatientAppointmentImmediate(starttime, endtime, doctorinfo.doctorid, daycd, appointdate, $scope.cacheStorageItem.patientid, OnAddApointmentSuccess, OnAddApointmentError);
    }
    function OnAddApointmentSuccess(data) {
        var endConsultationData = eHnoteMasterDataService.getAfterConsultationData();
        if (data.response !== null && data.response.AppointmentID !== null) {
            cacheStorageItem.appointmentid = data.response.AppointmentID;
            $scope.cacheStorageItem.appointmentid = data.response.AppointmentID;
            endConsultationData.appointmentid = data.response.AppointmentID;
            eHnoteMasterDataService.addAfterConsultationData(endConsultationData);
            eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
            startConsultation(cacheStorageItem.appointmentid);
        }
    }
    function OnAddApointmentError(err) {
        console.log(err);
    }
    function startConsultation(appId) {

        var params = {
            "PatientVisitID": PatientVisitID,
            "HospitalId": doctorinfo.hospitalID,
            "DoctorID": doctorinfo.doctorid,
            "PatientID": cacheStorageItem.patientid,
            "AppointmentID": appId,
            "StartTime": new Date(),
            "USRId": doctorinfo.doctordata.User[0].DoctorID
        };
         
        eHnoteConditionsDataService.startConsultation(params, OnGenerateConsultationSuccess, OnGenerateConsultationError);
    }
    function OnGenerateConsultationSuccess(data) {
        var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();        
        cacheStorageItem.ConsultationID = data.ConsultationID;
        cacheStorageItem.PatientVisitID = data.PatientVisitID;
        eHnoteMasterDataService.addConsultAndPatientVisitId(data.ConsultationID, data.PatientVisitID);
        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
    }
    function OnGenerateConsultationError(err) {
        console.log(err);
    }


    $scope.IsHidden = {};
    if (cacheStorageItem.MedicalConditionsArray) {
        $scope.medicalsForDoctor = cacheStorageItem.MedicalConditionsArray;
    }
    $scope.Medicalpageno = 1;
    $scope.MedicalActiveMenu = function (pageno) {
        return (pageno === $scope.Medicalpageno) ? "active" : "";
    };
    $scope.SwitchMedicalPage = function (pageno) {
        $scope.Medicalpageno = pageno;
    };
    $scope.MedicalChecked = {};
    $scope.MedicalsActive = function (index) {
        if (!$scope.MedicalChecked[index]) {
            $scope.medicalsForDoctor[index].ActiveIND = "Y";
            $scope.medicalsForDoctor[index].risk = "N";
            $scope.MedicalCheckedRisk[index] = false;
        } else {
            $scope.medicalsForDoctor[index].ActiveIND = "N";
        }
        cacheStorageItem.MedicalConditionsArray = [];
        cacheStorageItem.MedicalConditionsArray = $scope.medicalsForDoctor;
        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
    };



    $scope.ClearMedicalNotes = function (index) {
        $scope.medicalsForDoctor[index].notes = "";
        cacheStorageItem.MedicalConditionsArray = [];
        cacheStorageItem.MedicalConditionsArray = $scope.medicalsForDoctor;
        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
    };
    $scope.UpdateMedicalNotes = function (index) {
        cacheStorageItem.MedicalConditionsArray = [];
        cacheStorageItem.MedicalConditionsArray = $scope.medicalsForDoctor;
        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
    };
    $scope.NextClickFromMedical = function () {
        var isOPT = false;
        if ($scope.Medicalpageno === "1") {
            if (!$scope.ChckSpeciality) {
                $scope.Medicalpageno = "3";
                angular.element("html, body").animate({ scrollTop: 0 }, "slow");
                return false;
            } else {
                $scope.Medicalpageno = "2";
                angular.element("html, body").animate({ scrollTop: 0 }, "slow");
                return false;
            }
        }
        if ($scope.Medicalpageno === "4") {
            $scope.Medicalpageno = "2";
            angular.element("html, body").animate({ scrollTop: 0 }, "slow");
            return false;
        }
        if ($scope.Medicalpageno === "2") {
            $scope.Medicalpageno = "3";
            angular.element("html, body").animate({ scrollTop: 0 }, "slow");
            return false;
        }
        if ($scope.Medicalpageno === "3") {
            $scope.ChangeTab(13, 13);
            angular.element("html, body").animate({ scrollTop: 0 }, "slow");
        }
    };
    $scope.focusNext = function (val) {
        var value = /^\d{3}$/;
        if (value.test(val)) {
            angular.element(event.target).next().focus().select();
        }
    };
    $scope.VitalClick = function (key) {
        $scope.hidethis = false;
    };
    if ($scope.cacheStorageItem.appObjectCollection) {
        $scope.Notes.appObjectCollection = $scope.cacheStorageItem.appObjectCollection;
    }
    $scope.addEmptyRecordMedicalHistory = function () {
        var emptyavailable = false;
        angular.forEach($scope.cacheStorageItem.PatientPastMedicalHistory, function (value) {
            if (value === "") {
                emptyavailable = true;
            }
        });
        if (!emptyavailable) {
            var str = "";
            $scope.cacheStorageItem.PatientPastMedicalHistory.push(str);
        }
    };
    $scope.cacheStorageItem.PatientPastMedicalHistory = [];
    if ($scope.cacheStorageItem.PatientPastMedicalHistory.length === 0) {
        $scope.addEmptyRecordMedicalHistory();
    }
    $scope.removePastHistory = function (index) {
        if (index > -1) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
                $scope.cacheStorageItem.PatientPastMedicalHistory.splice(index, 1);
                $scope.cacheStorageItem.appObjectCollection = $scope.Notes.appObjectCollection;
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                if ($scope.cacheStorageItem.PatientPastMedicalHistory.length === 0) {
                    $scope.addEmptyRecordMedicalHistory();
                }
            },
          function () {
              x = "You pressed Cancel!";
          });
        }
    };
    var listParams = {
        "DoctorID": $scope.doctorID,
        "HospitalCD": $scope.hospitalcd,
        "USRType": "DOCTOR",
        "PageSize": 10,
        "PageNumber": 1,
        "PageType": "TRTMNT",
        "USRId": $scope.doctorID
    };
    $scope.clearPastMedicalHistory = function (index) {
        $scope.cacheStorageItem.PatientPastMedicalHistory.splice(index, 1);
        $scope.cacheStorageItem.appObjectCollection = $scope.Notes.appObjectCollection;
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        if ($scope.cacheStorageItem.PatientPastMedicalHistory.length === 0) {
            $scope.addEmptyRecordMedicalHistory();
        }
    };


    $scope.MedicalConditionArray = [];
    eHnoteConditionsDataService.GetMedicalConditionCategory(CategorySuccess, CategoryError);
    function CategorySuccess(resp) {
        $scope.MedicalConditionCategories = resp;
        $scope.selectedCategory = $scope.MedicalConditionCategories[0];
        if (cacheStorageItem.MedicalHistory) {
        } else {
            // GetMedicalConditionSettings();
        }
    }
    //function GetMedicalConditionSettings() {
    //    var req = {
    //        "USRId": doctorinfo.doctorid,
    //        "PageSize": 10,
    //        "PageNumber": 10
    //    };
    //    eHnoteConditionsDataService.GetMedicalConditionSettings(req, ConditionSettingsSuccess, ConditionSettingsError);
    //}
    //function ConditionSettingsSuccess(resp) {
    //    if (resp !== undefined) {
    //        if (resp.length > 0) {
    //            if ($scope.MedicalConditionArray.length === 0) {
    //                for (var i = 0; i < resp.length; i++) {
    //                    for (var j = 0; j < $scope.MedicalConditionCategories.length; j++) {
    //                        if (resp[i].CategoryId === $scope.MedicalConditionCategories[j].MedicalConditionCategoryId) {
    //                            $scope.MedicalConditionArray.push({
    //                                "Description": resp[i].Description,
    //                                "MedConditionId": resp[i].MedConditionId,
    //                                "CategoryId": resp[i].CategoryId,
    //                                "CatergoryDesc": $scope.MedicalConditionCategories[j].MedicalConditionCategoryName,
    //                                "ActiveIND": "N",
    //                                "Notes": ""
    //                            });
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //        $scope.cacheStorageItem.MedicalHistory = $scope.MedicalConditionArray;
    //    }
    //}
    //function ConditionSettingsError(err) {
    //    $scope.cacheStorageItem.MedicalHistory = [];
    //}
    function CategoryError(err) {
        console.log(err);
    }
    $scope.changeStatus = function (ActiveIND, MedConditionId) {
        var index = -1;
        $scope.cacheStorageItem.MedicalHistory.some(function (obj, i) {
            return obj.MedConditionId === MedConditionId ? index = i : false;
        });
        if (ActiveIND === "N") {
            $scope.cacheStorageItem.MedicalHistory[index].ActiveIND = "Y";
        } else {
            $scope.cacheStorageItem.MedicalHistory[index].ActiveIND = "N";
        }
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
    };
    function loadvistReason() {
        var getParams = {
            "UserId": doctorinfo.doctorid
        };
        var hospid = undefined;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        }
    }
    loadvistReason();
    $scope.$on('MedicalControllerCalled', function (ev, args) {
        UpdateCacheStorage();
    });
    function UpdateCacheStorage() {
        var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        cacheStorageItem.PatientPastMedicalHistory = $scope.cacheStorageItem.PatientPastMedicalHistory;
        cacheStorageItem.MedicalHistory = $scope.cacheStorageItem.MedicalHistory;
        cacheStorageItem.VisitReason = $scope.cacheStorageItem.VisitReason;
        cacheStorageItem.Vitals = $scope.cacheStorageItem.Vitals;
        eHnoteCacheStorageService.addvitalParamsOfPatient($scope.cacheStorageItem.Vitals);
        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
    }


    getdoctorVitalparams();

    function getdoctorVitalparams() {
        
        eHnoteConditionsDataService.getPatientVitalsByDoctorId(callbackSuccessonVitals, ErroronVitals);
        function callbackSuccessonVitals(data) {
            var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
            cacheStorageItem.Vitals = data;
            $scope.cacheStorageItem.Vitals = data;
            angular.forEach(cacheStorageItem.Vitals, function (item, index) {
                item.Value = "";
            });
            //getvitalparamertersbyId($scope.cacheStorageItem.patientid);
            eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
        }
        function ErroronVitals(err) {
            console.log(err);
        }
    }

    $scope.bmiValueCal = function (val1, val2) {


        var height_in_meter = 0;
        var weight_in_kg = 0;
        var BMI;
        if (val1 !== '' && val1 !== undefined && val1 !== 'NA' && val1 !== "0") {
            var height_parts = val1.split(" ");
            height_in_meter = parseInt(height_parts[0].trim()) / 100;
        } else {
            return 'NA';
        }
        if (val2 !== '' && val2 !== undefined && val2 !== 'NA' && val2 !== "0") {
            var weight_parts = val2.split(" ");
            weight_in_kg = parseInt(weight_parts[0].trim());
        } else {
            return 'NA';
        }
        BMI = weight_in_kg / (height_in_meter * height_in_meter);
        BMI = Math.round(BMI * 100) / 100;
        if (BMI < 18.5) {
            BMI = BMI + ' (Under Weight)';
        } else if (BMI >= 18.5 && BMI < 24.9) {
            BMI = BMI + ' (Normal Weight)';
        } else if (BMI >= 25 && BMI < 29.9) {
            BMI = BMI + ' (Over Weight)';
        } else {
            BMI = BMI + ' (Obesity)';
        }
        $scope.cacheStorageItem.Bmivalue = BMI;

        $scope.cacheStorageItem.Vitals.push({ "VitalID": 17, "Value": BMI });



        cacheStorageItem.Vitals.push({ "VitalID": 17, "Value": BMI });
        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
    };

    //function getvitalparamertersbyId(PatientID) {
    //    eHnotePatientPVService.getPatientPastVitalsByPatientId(PatientID, OnPVsuccess, OnPVerror);
    //    function OnPVsuccess(data) {
    //        if (data !== null || data !== undefined) {
    //            var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    //            for (var i = 0; i < cacheStorageItem.Vitals.length; i++) {
    //                for (var j = 0; j < data.Vitals.length; j++) {
    //                    if (cacheStorageItem.Vitals[i].VitalID === data.Vitals[j].VitalID) {
    //                        cacheStorageItem.Vitals[i].Value = data.Vitals[j].Value;
    //                    }
    //                }
    //            }
    //            if (cacheStorageItem.Vitals[1].Value !== "" && cacheStorageItem.Vitals[0].Value !== "" && cacheStorageItem.Vitals[1].Value !== undefined && cacheStorageItem.Vitals[0].Value !== undefined) {
    //                $scope.bmiValueCal(cacheStorageItem.Vitals[1].Value, cacheStorageItem.Vitals[0].Value);
    //            }
    //        }
    //        $scope.cacheStorageItem.Vitals = cacheStorageItem.Vitals;
    //        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
    //    }
    //    function OnPVerror(err) {
    //        console.log(err);
    //    }
    //}

}]);
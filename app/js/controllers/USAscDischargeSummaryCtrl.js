eHnoteWebApp.controller("USAscDischargeSummaryCtrl", ["$scope", "$uibModalInstance", "$rootScope", "$location", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "eHnotePatientDataService", "alertify", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "$uibModal", "datapersistanceFactory", "$window", "eHnoteMainAppointmentService", "$q", "eHnotePatientAddressDataServices", "eHnoteOrgReferralDataServices", "localStorageFactory", "eHnoteSurgeryService", "$timeout", "eHnotePrintService", "eHnoteSettingsDataService", "SurgeryStaticDataService", "eHnoteInsuranceService", "Lightbox", "eHnoteDbStaticDataService", "eHnoteMainAdminServices", "eHnoteAuditServices", "eHnoteDiagnosisDataServices", "datacookieFactory", "$translate", "eHnoteUserDataService", "allUserList","USPrintService", function ($scope, $uibModalInstance, $rootScope, $location, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, eHnotePatientDataService, alertify, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, $uibModal, datapersistanceFactory, $window, eHnoteMainAppointmentService, $q, eHnotePatientAddressDataServices, eHnoteOrgReferralDataServices, localStorageFactory, eHnoteSurgeryService, $timeout, eHnotePrintService, eHnoteSettingsDataService, SurgeryStaticDataService, eHnoteInsuranceService, Lightbox, eHnoteDbStaticDataService, eHnoteMainAdminServices, eHnoteAuditServices, eHnoteDiagnosisDataServices, datacookieFactory, $translate, eHnoteUserDataService, allUserList, USPrintService) {

    var doctorinfo = eHnoteMasterDataService.getUserInfo();
  
    $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();    
    $scope.allUserList = allUserList;
    $scope.patientSearchType = 4;
    $scope.ShowAdmissionTab = true;
    $scope.ShowAppointmnetTab = true;
    $scope.ShowPatientSeatch = false;
    $scope.AllCounselorsList = [];
    $scope.AppListdoctoraddress = [];
    $scope.BranchesListArray = [];
    $scope.AllDoctorsList = [];
    $scope.AllDoctorAnesthesiologist = [];
    $scope.AllDoctorAssistant = [];
    $scope.AllCounselorsList = [];
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    $scope.IsPatientSelected = false;
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.RoleId = userLoginDetails.RoleID;
    $scope.UserSettingObject = datapersistanceFactory.getItem('UserSettingsData');
    $scope.userProfilePic = "img/register-defaultuser-ico.png";

    $scope.closeuib = function () {
        $uibModalInstance.dismiss("cancel");
    }

    $scope.isAddingScreenVisible = true;
    $scope.isEditScreenVisible = false;
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();

    if (doctorinfo !== undefined) {

        $scope.orgUsersData = doctorinfo.doctordata.UserAddress;
        if ($scope.orgUsersData !== undefined) {
            if ($scope.orgUsersData[0] !== undefined) {
                if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
                    $scope.parenthospId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                }
                $scope.lRName = $scope.orgUsersData[0].ExtDetails.RoleName;

                $scope.Name = userLoginDetails.displayName;
                $rootScope.mainDisplayName = userLoginDetails.displayName;
                //$scope.SpecialityName = userLoginDetails.specialisation;
                //$scope.Speciality = userLoginDetails.specialisation;
                $scope.SpecialityName = "";
                $scope.Speciality ="";

                $scope.groupID = doctorinfo.doctordata.User[0].GroupId;
                $scope.accessRights = doctorinfo.doctordata.User[0].AccessDetails;
                $scope.RoleName = doctorinfo.doctordata.User[0].RoleName;
                /*  $scope.Speciality = userLoginDetails.specialisation;*/
                $scope.Speciality = "";
                userLoginDetails.RoleID = doctorinfo.doctordata.User[0].RoleId;


                if (userLoginDetails.RoleID === 4 || userLoginDetails.RoleID === 43 || userLoginDetails.RoleID === 1 || userLoginDetails.RoleID === 3 || userLoginDetails.RoleID === 14 || userLoginDetails.RoleID === 56 || userLoginDetails.RoleID === 57) {
                    $scope.profileName = $rootScope.mainDisplayName + ' (' + $scope.lRName + ')';
                } else {
                    $scope.profileName = $rootScope.mainDisplayName + ' (' + $scope.lRName + ')';
                }

                $scope.userProfilePic = datapersistanceFactory.getItem('userProfileimg') || "img/register-defaultuser-ico.png";

                var speciality = datacookieFactory.set('specialisation');
                if (datapersistanceFactory.getItem('userProfileimg') !== "") {
                    $scope.ProfileImage = "data:image/png;base64," + GetImage(datapersistanceFactory.getItem('userProfileimg'));
                } else {
                    $scope.ProfileImage = "data:image/png;base64," + (datapersistanceFactory.getItem('userProfileimg') === "") ? "" : GetImage(datapersistanceFactory.getItem('userProfileimg'));
                }
            }
        }
    }
   
    $scope.AddToCache = function () {
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    };
 
    $scope.languageObj = {
        "selectedLang": "en"
    };

    $scope.languageObj.selectedLang = datapersistanceFactory.getItem("SelectedLanguageKey");

    $scope.activeLanguageChange = function (langKey) {
        $scope.languageObj.selectedLang = langKey;
        $translate.use(langKey);
        datapersistanceFactory.set("SelectedLanguageKey", langKey);
    };


    $scope.GetNavObj = function () {
        return {
            "IsEvaluationTab": false,
            "IsAnesthetistPlanTab": false
        };
    };
    $scope.NavObj = $scope.GetNavObj();
    $scope.NavObj.IsEvaluationTab = true;
    $scope.PatientDetailsObj = {
        "PatientId": 0,
        "FullName": "",
        "Mobile": "",
        "DisplayId": "",
        "Gender": "",
        "Age": "",
        "S3URL": "",
        "ExternalCoManager": "",
        "InternalCoManager": "",
        "PCP": "",
        "InsuranceDetails": [],
        "Allergies": []
    };
   
    $scope.SurgeryDiagnosisObj = {
        "Diagnosis": "",
        "DiagnosisId": null,
        "OrganizationDiagnosisId": null,
        "OrganizationSurgeryId": null,
        "SurgeryId": null,
        "SurgeryDate": "",
        "OperativeProcedure": "",
        "Surgeon": "",
        "SelectedSurgery": "",
        "ExternalCoManagerId": null,
        "InternalCoManagerId": null
    };
    /*  $scope.PreAdmObj = angular.copy($scope.GetPreAdmObj());*/


    $scope.GetDischargeSummaryObj = function () {
        return {
            "IsShowAddScreen": null,
            "PatientId": $scope.cacheStorageItem.PatientID,
            "AppointmentId": $scope.cacheStorageItem.AppointmentId,
            "PatientName": "",
            "PatientASCPostOPId": null,
            "DiagnosisName": "",
            "ProcedureName": "",
            "Surgeon": "",
            "PatientDisplayId": null,
            "Organ": "",
            "Medications": [],
            "Prescriptions": [],
            "PostOpDiagnosis": [],
            "AllergyItems": [],
            "SurgicalHistory": [],
            "SystemicHistory": [],
            "CurrentEyeMedicationList": [],
            "CurrentSystemicMedicationList": [],
            "MedicationInstructions": "",
            "PostOpInstruction": "",
            "DischargeInstruction": "",
            "AscPostOpInstructionTemplateList": [],
            "PostOpConditionTemplatesList": [],
            "PostOpProceduralTemplatesList": [],
            "DischargeMedicationInstructionTemplates": [],
            "SelectedMedInstructionTemplate": "",
            "DischargeMedicationInstructions": "",
            "MedictionTemplateName": "",
            "FollowUpInstructions": "",
            "CoManagementInstruction": "",
            "PatientConditionInstruction": "",
            "ProceduralInstruction": "",
            "PostOpInstrufction": "",
            "ExaminationNotes": "",
            "FollowUpDate1": "",
            "FollowUpDate2": "",
            "FollowUpDate3": "",
            "FollowUpTime1": "",
            "FollowUpTime2": "",
            "FollowUpTime3": "",
            "FirstFollowupAppointmentId": 0,
            "SecondFollowupAppointmentId": 0,
            "ThirdFollowupAppointmentId": 0,
            "DischargeMedicationTemplateName": "",
            "SelectedDischargeMedicationTemplate": "",
            "DischargePostOpInstructionTemplateName": "",
            "PostOpInstructionTemplateId": null,
            "DischargeReviewedBy": null,
            "DischargeReviewedByName": '',
            "DischargeReviewedBySuffix": '',
            "ReviewedByLicenseNumber": '',
            "DischargeSummaryTemplateName": "",
            "CoManagementTemplateName": "",
            "ConditionOnDischargeTemplateName": "",
            "ProceduralNameTemplateName": "",
            "FollowUpDate2Ind": false,
            "FollowUpDate3Ind": false,
            "DischargeMedicationInstructionTemplateId": null,
            "DischargeProcedureNameInstructionTemplateId": null,
            "PatientDischargeConditionInstructionTemplateId": null,
            "DischargeCoManagementInstructionTemplateId": null,
            "Findings": "",
            "MedicineOrdersInstructions": "",
            "FindingsTemplates": [],
            "FollowupTemplates": [],
            "PostOpCoManagementTemplates": [],

        }
    };

    $scope.DischargeSummaryObj = angular.copy($scope.GetDischargeSummaryObj());

    $scope.ShowEvaluationTab = function () {
        $scope.NavObj = $scope.GetNavObj();
        $scope.NavObj.IsEvaluationTab = true;
    };
    $scope.ShowAnesthetistPlanTab = function () {
        $scope.NavObj = $scope.GetNavObj();
        $scope.NavObj.IsAnesthetistPlanTab = true;
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
                        $scope.PerformedByArray = [];
                        $scope.allUserList = $scope.allUserList || [];
                        if ($scope.allUserList.length > 0) {
                            $scope.PerformedByArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 8 || x.RoleId == 30 || x.RoleId == 43 || x.RoleId == 56 || x.RoleId == 57);
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
  

    /* Post-op Discharge - Start   */

    //if ($scope.cacheStorageItem.SurgeryList.length > 0) {
    //    angular.forEach($scope.cacheStorageItem.SurgeryList, function (item, index) {
    //        if (index!=0) {
    //            $scope.SurgeryDiagnosisObj.OperativeProcedure += ', ';
    //        }
    //        $scope.SurgeryDiagnosisObj.OperativeProcedure += item.SurgeryName;
    //        $scope.SurgeryDiagnosisObj.SurgeryDate = $scope.cacheStorageItem.AppointmentDate;
    //        $scope.SurgeryDiagnosisObj.OrganizationSurgeryId = item.OrganizationSurgeryId;
    //        $scope.SurgeryDiagnosisObj.SurgeryId = item.SurgeryId;
    //        $scope.SurgeryDiagnosisObj.OrganId = item.OrganId;

    //        item.DiagnosisList = item.DiagnosisList || [];
    //        if (item.DiagnosisList.length > 0) {
    //            $scope.SurgeryDiagnosisObj.Diagnosis = item.DiagnosisList[0].DiagnosisName;
    //            $scope.SurgeryDiagnosisObj.OrganizationDiagnosisId = item.DiagnosisList[0].OrganizationDiagnosisId;
    //            $scope.SurgeryDiagnosisObj.DiagnosisId = item.DiagnosisList[0].DiagnosisId;
    //        }

    //        $scope.SurgeryDiagnosisObj.Diagnosis2 = $scope.SurgeryDiagnosisObj.Diagnosis2 || '';
    //        if (item.DiagnosisList.length > 1) {
    //            $scope.SurgeryDiagnosisObj.Diagnosis2 = item.DiagnosisList[1].DiagnosisName;
    //        }

    //        if (item.DoctorId  =='') {
    //            item.DoctorId = item.SurgeonId || '';
    //        } else {
    //            item.DoctorId = item.DoctorId || '';
    //        }
            
    //        if (item.DoctorId != '') {
    //            let temparray3 = $filter('filter')($scope.allUserList, { 'DoctorID': item.DoctorId }, true);
    //            if (temparray3.length > 0) {
    //                $scope.SurgeryDiagnosisObj.Surgeon = temparray3[0].FullName;
    //            } else {
    //                $scope.SurgeryDiagnosisObj.Surgeon = "";
    //            }
    //        }
    //        $scope.SurgeryDiagnosisObj.InternalCoManagerId = item.InternalCoManagerId || null;
    //        item.InternalCoManagerId = item.InternalCoManagerId || '';
    //        if (item.InternalCoManagerId != '') {
    //            let temparray = $filter('filter')($scope.allUserList, { 'DoctorID': item.InternalCoManagerId }, true);
    //            if (temparray.length > 0) {
    //                $scope.SurgeryDiagnosisObj.InternalCoManager = temparray[0].FullName;
    //            } else {
    //                $scope.SurgeryDiagnosisObj.InternalCoManager = "";
    //            }
    //        }

    //        $scope.SurgeryDiagnosisObj.ExternalCoManagerId = item.ExternalCoManagerId || null;
    //        item.ExternalCoManagerId = item.ExternalCoManagerId || '';
    //        if (item.ExternalCoManagerId != '') {
    //            let temparray = $filter('filter')($scope.allUserList, { 'DoctorID': item.ExternalCoManagerId }, true);
    //            if (temparray.length > 0) {
    //                $scope.SurgeryDiagnosisObj.ExternalCoManager = temparray[0].FullName;
    //            } else {
    //                $scope.SurgeryDiagnosisObj.ExternalCoManager = "";
    //            }
    //        }
    //    });
    //}
    $scope.GivenByArray = [];
    $scope.DischargeArray = [];
    $scope.ChecklistArray = [];
    $scope.SurgeonArray = [];

    //$scope.DischargeArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 8 || x.RoleId == 43 || x.RoleId == 16 || x.RoleId == 38);


    $scope.GivenByArray = $scope.allUserList.filter((x) => x.RoleId == 8 );

    $scope.ChecklistArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 43);

    $scope.SurgeonArray = $scope.ChecklistArray.filter((x) => x.SuffixId == 10);

    $scope.DischargeArray = $scope.GivenByArray.concat($scope.SurgeonArray);


    $scope.GetDischargeData = function () {

        let req = {
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
            "PatientId": $scope.cacheStorageItem.PatientID || null
        };

        eHnoteSurgeryService.GetPostOpDischargeData(req).then(function (resp) {
            if (resp.data.Status === "Success") {                
                $scope.DischargeSummaryObj.Diagnosis = angular.copy(resp.data.Diagnosis);
                $scope.DischargeSummaryObj.Prescriptions = angular.copy(resp.data.Prescription);
                $scope.DischargeSummaryObj.ExaminationNotes = angular.copy(resp.data.Findings);
                $scope.DischargeSummaryObj.MedicineOrdersInstructions = angular.copy(resp.data.MedicineOrdersInstructions);
                $scope.DischargeSummaryObj.AllergyItems = angular.copy(resp.data.AllergyItemsArray);
                $scope.DischargeSummaryObj.SurgicalHistory = angular.copy(resp.data.SurgicalHistory);
                $scope.DischargeSummaryObj.SystemicHistory = angular.copy(resp.data.SystemicHistory);
                $scope.DischargeSummaryObj.CurrentEyeMedicationList = angular.copy(resp.data.CurrentEyeMedicationList);
                $scope.DischargeSummaryObj.CurrentSystemicMedicationList = angular.copy(resp.data.CurrentSystemicMedicationList);
                $scope.DischargeSummaryObj.LastSignOffUserDetails = angular.copy(resp.data.LastSignOffUserDetails)||[];


                if (resp.data.rows.length > 0) {
                  
                    $scope.PostopDischargeDetails = angular.copy(resp.data.rows[0]);

                    $scope.DischargeSummaryObj.DischargeChartStatus = $scope.PostopDischargeDetails.DischargeChartStatus;

                    let surgeriesArray = [];
                    angular.forEach($scope.cacheStorageItem.SurgeryList, function (item) {
                        surgeriesArray.push(item.SurgeryName);
                    });

                    let operativeProcedure;
                    if (surgeriesArray.length > 0) {
                        operativeProcedure = surgeriesArray.join(",");
                    } else {
                        operativeProcedure = "";
                    }

                    $scope.DischargeSummaryObj.PatientASCPostOPId = $scope.PostopDischargeDetails.PatientASCPostOPId || null;

                    $scope.DischargeSummaryObj.FollowUpDate1 = $filter('date')($scope.PostopDischargeDetails.FollowUpDate1, "MM-dd-yyyy") || "";
                    $scope.DischargeSummaryObj.FollowUpDate2 = $filter('date')($scope.PostopDischargeDetails.FollowUpDate2, "MM-dd-yyyy") || "";
                    $scope.DischargeSummaryObj.FollowUpDate3 = $filter('date')($scope.PostopDischargeDetails.FollowUpDate3, "MM-dd-yyyy") || "";

                    if ($scope.DischargeSummaryObj.FollowUpDate2 != "") {
                        $scope.DischargeSummaryObj.FollowUpDate2Ind = true;
                    } else {
                        $scope.DischargeSummaryObj.FollowUpDate2Ind = false;
                    }
                    if ($scope.DischargeSummaryObj.FollowUpDate3 != "") {
                        $scope.DischargeSummaryObj.FollowUpDate3Ind = true;
                    } else {
                        $scope.DischargeSummaryObj.FollowUpDate3Ind = false;
                    }

                    $scope.DischargeSummaryObj.DischargeReviewedBy = $scope.PostopDischargeDetails.DischargeReviewedBy || "";
                    $scope.DischargeSummaryObj.FollowUpInstructions = $scope.PostopDischargeDetails.FollowUpInstructions || "";
                    $scope.DischargeSummaryObj.CoManagementInstruction = $scope.PostopDischargeDetails.CoManagementInstruction || "";
                    $scope.DischargeSummaryObj.MedicationInstruction = $scope.PostopDischargeDetails.MedicationInstruction || "";
                    $scope.DischargeSummaryObj.DischargeInstruction = $scope.PostopDischargeDetails.DischargeInstruction || "";
                    $scope.DischargeSummaryObj.PatientConditionInstruction = $scope.PostopDischargeDetails.PatientConditionInstruction || "";
                    $scope.DischargeSummaryObj.ProceduralInstruction = $scope.PostopDischargeDetails.ProceduralInstruction || "";
                    $scope.DischargeSummaryObj.ExaminationNotes = $scope.PostopDischargeDetails.ExaminationNotes || "";

                }
            }

        }, function () {

        });
    };
    //$scope.GetDischargeData();

    $scope.addTextBoxF1 = function () {

        if ($scope.DischargeSummaryObj.FollowUpDate1 == '') {
            alertify.error("Please Enter Followup 1 !");
            return false;
        }
        $scope.DischargeSummaryObj.FollowUpDate2Ind = true;
    }

    $scope.followupsecond = false;
    $scope.addTextBoxF2 = function () {
        if ($scope.DischargeSummaryObj.FollowUpDate2 == '') {
            alertify.error("Please Enter Followup 2 !");
            return false;
        }
        $scope.DischargeSummaryObj.FollowUpDate3Ind = true;
    }

    $scope.SavePostOpDischargeData = function (str) {

        $scope.currentDate = $filter('date')(new Date(), "yyyy-MM-dd");
        var ReviewedDate = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
        let submitreq = {
            "ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,
            "PatientASCPostOPId": $scope.DischargeSummaryObj.PatientASCPostOPId || null,
            "UserId": $scope.UserId || null,
            "HospitalId": $scope.HospitalId || null,
            "PatientId": $scope.cacheStorageItem.PatientID || null,
            "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
            "OperativeNotes": "",
            "DischargeCriteriaChecklist": [],
            "DischargeTransferChecklist": [],
            "CriteriaNotes": "",
            "ExaminationNotes": $scope.DischargeSummaryObj.ExaminationNotes,
            //"ProceduralInstruction": $scope.DischargeSummaryObj.ProceduralInstruction,
            "PatientConditionInstruction": $scope.DischargeSummaryObj.PatientConditionInstruction,
            "DischargeInstruction": $scope.DischargeSummaryObj.DischargeInstruction,
            "CoManagementInstruction": $scope.DischargeSummaryObj.CoManagementInstruction,
            "MedicationInstruction": $scope.DischargeSummaryObj.MedicationInstruction,
            "FollowUpInstructions": $scope.DischargeSummaryObj.FollowUpInstructions,
            "TransferTime": "",
            "TransferReason": "",
            "FollowUpDate1": $scope.DischargeSummaryObj.FollowUpDate1,
            "FollowUpDate2": $scope.DischargeSummaryObj.FollowUpDate2,
            "FollowUpDate3": $scope.DischargeSummaryObj.FollowUpDate3,
            "FollowUpTime1": "",
            "FollowUpTime2": "",
            "FollowUpTime3": "",
            "DischargeReviewedBy": $scope.DischargeSummaryObj.DischargeReviewedBy,
            "TempDocumentDetails": [],
            "PostOpDiagnosisArray": [],
            "DocumentDetails": [],
            "DischargeChartStatus": (str === 'SignOff') ? "E" : "D",
            "StatusFlag": (str === 'SignOff') ? "E" : "D",
            "SignDate": $scope.currentDate,
            "DischargeReviewedDate": ReviewedDate || null

        };

        eHnoteSurgeryService.AddUpdatePostOpDischargeDetails(submitreq, onSubmitSuccess, onSubmitError);

        function onSubmitSuccess(data) {
            alertify.success("Data Submitted successfully!");
            //$scope.GetDischargeData();
            //$scope.DischargeSummaryObj.IsShowAddScreen = false;
            $scope.OnScreenLoad();           
        }

        function onSubmitError(data) {
            alertify.error("Submit Failed!");
            console.log(data);
        }
    }

    $scope.ClickcreateAddtemplateover = {
        templateUrl: 'AddPostopInstructionTemplate.html',
    };
    $scope.ClickcreateMedInstructiontemplateover = {
        templateUrl: 'AddMedInstructionTemplate.html',
    };
    $scope.ClickConditionOnDischargeTemplate = {
        templateUrl: 'AddConditionOnDischargeTemplate.html',
    };
    $scope.ClickProceduralNameTemplate = {
        templateUrl: 'AddProceduralNameTemplate.html',
    };
    $scope.ClickCoManagementTemplate = {
        templateUrl: 'AddCoManagementTemplate.html',
    };

   
    $scope.GetAscPostopDischargeTemplates = function () {
        let req = {
            "HospitalId": $scope.HospitalId,
            "UserId": $scope.UserId
        };

        eHnoteSurgeryService.GetAscPostopDischargeTemplates(req).then(function (resp) {

            if (resp.data.status == "Success") {
                $scope.DischargeSummaryObj.DischargeMedicationInstructionTemplates = angular.copy(resp.data.DischargeMedicationTemplates);
                $scope.DischargeSummaryObj.AscPostOpInstructionTemplateList = angular.copy(resp.data.PostopDischargeTemplates);
                $scope.DischargeSummaryObj.PostOpConditionTemplatesList = angular.copy(resp.data.PostOpConditionTemplates);
                $scope.DischargeSummaryObj.PostOpCoManagementTemplates = angular.copy(resp.data.PostOpCoManagementTemplates);
                $scope.DischargeSummaryObj.PostOpProceduralTemplatesList = angular.copy(resp.data.PostOpProceduralTemplates);
            }

       

        });
    };

    //$scope.GetAscPostopDischargeTemplates();
    
    $scope.GetTrackAppointmentDetails = function () {
        let trackerReq = {
            "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
        };

        eHnoteMainAppointmentService.GetASCLatestTrackerStatusById(trackerReq).then(function (resp) {
            if (resp.data.Status === "Success") {
                if (resp.data.rows.length > 0) {
                    if (resp.data.rows[0].RoomTypeId != 18) {
                        $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                        let params = {
                            "UserId": eHnoteMasterDataService.getLoginId(),
                            "HospitalId": $scope.HospitalId,
                            "AppointmentId": $scope.cacheStorageItem.AppointmentId,
                            "ASCAppointmentTrackerDetailId": 0,
                            "RoleId": $scope.RoleId,
                            "DoctorId": null,
                            "DoctorRoleId": null,
                            "RoomTypeId": 18,
                            "RoomId": null,
                            "Remarks": '',
                            "CurrentTime": $scope.CurrentTime,
                            "IsSendTo": "Y",
                            "IsCheckedIn": "N",
                            "IsCheckedOut": "N",
                            "IsReCheckIn": "N",
                            "IsReCheckOut": "N"
                        }
                        eHnoteMainAppointmentService.AddUpdateASCAppointmentTrackerDetails(params).then(function (resp) {
                            if (resp.data.Status === "Success") {
                                $scope.cacheStorageItem.RoomTypeId = 18;
                                $scope.AddToCache();
                            }
                        });
                    }
                }
            }
        }, function () {

        });

       
    }

    $scope.GetPreOpMedicineCheckListTemplates = function () {

        let req = {
            "OrganizationId": $scope.HospitalId,
            "UserId": $scope.UserId,
        };
        eHnoteSurgeryService.GetIntraOPSurgicalNoteTemplates(req).then(function (resp) {
            if (resp.data.Status === "Success") {

                $scope.DischargeSummaryObj.FindingsTemplates = [];
                $scope.DischargeSummaryObj.FollowupTemplates = [];

                $scope.DischargeSummaryObj.FindingsTemplates = resp.data.FindingsTemplates || [];
                $scope.DischargeSummaryObj.FollowupTemplates = resp.data.FollowupTemplates || [];

            }

        }, function (err) {
            console.log(err);
        });
    };
    //$scope.GetPreOpMedicineCheckListTemplates();

    $scope.OnScreenLoad = function () {

        $scope.GetTrackAppointmentDetails();

        let req = {
            "OrganizationId": $scope.HospitalId,
            "UserId": $scope.UserId,
        };

        let req1 = {
            "HospitalId": $scope.HospitalId,
            "UserId": $scope.UserId
        };

        let req2 = {
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
            "PatientId": $scope.cacheStorageItem.PatientID || null
        };

     

        $q.all([
            eHnoteSurgeryService.GetIntraOPSurgicalNoteTemplates(req),
            eHnoteSurgeryService.GetAscPostopDischargeTemplates(req1),
            eHnoteSurgeryService.GetPostOpDischargeData(req2)
        ]).then(function (resp) {

            if (resp[0].data.Status == "Success") {
                $scope.DischargeSummaryObj.FindingsTemplates = resp[0].data.FindingsTemplates || [];
                $scope.DischargeSummaryObj.FollowupTemplates = resp[0].data.FollowupTemplates || [];
            }

            if (resp[1].data.status == "Success") {
                $scope.DischargeSummaryObj.DischargeMedicationInstructionTemplates = angular.copy(resp[1].data.DischargeMedicationTemplates);
                $scope.DischargeSummaryObj.AscPostOpInstructionTemplateList = angular.copy(resp[1].data.PostopDischargeTemplates);
                $scope.DischargeSummaryObj.PostOpConditionTemplatesList = angular.copy(resp[1].data.PostOpConditionTemplates);
                $scope.DischargeSummaryObj.PostOpCoManagementTemplates = angular.copy(resp[1].data.PostOpCoManagementTemplates);
                $scope.DischargeSummaryObj.PostOpProceduralTemplatesList = angular.copy(resp[1].data.PostOpProceduralTemplates);
            }

            if (resp[2].data.Status === "Success") {


                $scope.DischargeSummaryObj.Findings = angular.copy(resp[2].data.Findings);
                $scope.DischargeSummaryObj.LastSignOffUserDetails = angular.copy(resp[2].data.LastSignOffUserDetails)||[];
                $scope.DischargeSummaryObj.Findings = $scope.DischargeSummaryObj.Findings.replace(/\n/g, '<br>');

                resp[2].data.FollowUpDate1 = resp[2].data.FollowUpDate1 || "";
                if (resp[2].data.FollowUpDate1 != "") {
                    $scope.DischargeSummaryObj.FollowUpDate1 = $filter('date')(resp[2].data.FollowUpDate1, "MM-dd-yyyy") || "";
                }

                resp[2].data.FollowUpDate2 = resp[2].data.FollowUpDate2 || "";
                if (resp[2].data.FollowUpDate2 != "") {
                    $scope.DischargeSummaryObj.FollowUpDate2 = $filter('date')(resp[2].data.FollowUpDate2, "MM-dd-yyyy") || "";
                }

                resp[2].data.FollowUpDate3 = resp[2].data.FollowUpDate3 || "";
                if (resp[2].data.FollowUpDate3 != "") {
                    $scope.DischargeSummaryObj.FollowUpDate3 = $filter('date')(resp[2].data.FollowUpDate3, "MM-dd-yyyy") || "";
                }

                $scope.DischargeSummaryObj.FirstFollowupAppointmentId = resp[2].data.FirstFollowupAppointmentId || 0;
                $scope.DischargeSummaryObj.SecondFollowupAppointmentId = resp[2].data.SecondFollowupAppointmentId || 0;
                $scope.DischargeSummaryObj.ThirdFollowupAppointmentId = resp[2].data.ThirdFollowupAppointmentId || 0;
                

                if ($scope.DischargeSummaryObj.Findings != '') {
                    $scope.DischargeSummaryObj.ExaminationNotesInd = true;
                }

                $scope.DischargeSummaryObj.Diagnosis = angular.copy(resp[2].data.Diagnosis);
                $scope.DischargeSummaryObj.Prescriptions = angular.copy(resp[2].data.Prescription);
                $scope.DischargeSummaryObj.ExaminationNotes = angular.copy(resp[2].data.Findings);
                $scope.DischargeSummaryObj.MedicineOrdersInstructions = angular.copy(resp[2].data.MedicineOrdersInstructions);
                $scope.DischargeSummaryObj.AllergyItems = angular.copy(resp[2].data.AllergyItemsArray);
                $scope.DischargeSummaryObj.SurgicalHistory = angular.copy(resp[2].data.SurgicalHistory);
                $scope.DischargeSummaryObj.SystemicHistory = angular.copy(resp[2].data.SystemicHistory);
                $scope.DischargeSummaryObj.CurrentEyeMedicationList = angular.copy(resp[2].data.CurrentEyeMedicationList);
                $scope.DischargeSummaryObj.CurrentSystemicMedicationList = angular.copy(resp[2].data.CurrentSystemicMedicationList);

                $scope.DischargeSummaryObj.SurgeryList = angular.copy(resp[2].data.SurgeryList);


                if (resp[2].data.rows.length > 0) {

                    $scope.isAddingScreenVisible =false;
                    $scope.isEditScreenVisible = true;

                    $scope.PostopDischargeDetails = angular.copy(resp[2].data.rows[0]);

                    $scope.DischargeSummaryObj.DischargeChartStatus = $scope.PostopDischargeDetails.DischargeChartStatus;

                    let surgeriesArray = [];
                    angular.forEach($scope.cacheStorageItem.SurgeryList, function (item) {
                        surgeriesArray.push(item.SurgeryName);
                    });

                    let operativeProcedure;
                    if (surgeriesArray.length > 0) {
                        operativeProcedure = surgeriesArray.join(",");
                    } else {
                        operativeProcedure = "";
                    }

                    $scope.DischargeSummaryObj.PatientASCPostOPId = $scope.PostopDischargeDetails.PatientASCPostOPId || null;

                    $scope.DischargeSummaryObj.FollowUpDate1 = $filter('date')($scope.PostopDischargeDetails.FollowUpDate1, "MM-dd-yyyy") || "";
                    $scope.DischargeSummaryObj.FollowUpDate2 = $filter('date')($scope.PostopDischargeDetails.FollowUpDate2, "MM-dd-yyyy") || "";
                    $scope.DischargeSummaryObj.FollowUpDate3 = $filter('date')($scope.PostopDischargeDetails.FollowUpDate3, "MM-dd-yyyy") || "";

                    if ($scope.DischargeSummaryObj.FollowUpDate2 != "") {
                        $scope.DischargeSummaryObj.FollowUpDate2Ind = true;
                    } else {
                        $scope.DischargeSummaryObj.FollowUpDate2Ind = false;
                    }
                    if ($scope.DischargeSummaryObj.FollowUpDate3 != "") {
                        $scope.DischargeSummaryObj.FollowUpDate3Ind = true;
                    } else {
                        $scope.DischargeSummaryObj.FollowUpDate3Ind = false;
                    }
                                      
                    $scope.DischargeSummaryObj.DischargeReviewedBy = $scope.PostopDischargeDetails.DischargeReviewedBy || "";
                    $scope.DischargeSummaryObj.FollowUpInstructions = $scope.PostopDischargeDetails.FollowUpInstructions || "";
                    $scope.DischargeSummaryObj.CoManagementInstruction = $scope.PostopDischargeDetails.CoManagementInstruction || "";
                    $scope.DischargeSummaryObj.MedicationInstruction = $scope.PostopDischargeDetails.MedicationInstruction || "";
                    $scope.DischargeSummaryObj.DischargeInstruction = $scope.PostopDischargeDetails.DischargeInstruction || "";
                    $scope.DischargeSummaryObj.PatientConditionInstruction = $scope.PostopDischargeDetails.PatientConditionInstruction || "";
                    $scope.DischargeSummaryObj.ProceduralInstruction = $scope.PostopDischargeDetails.ProceduralInstruction || "";
                    $scope.DischargeSummaryObj.DischargeReviewedBy = $scope.DischargeSummaryObj.DischargeReviewedBy || 0;
                    if ($scope.DischargeSummaryObj.DischargeReviewedBy != 0) {
                        var TempFilter = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.DischargeSummaryObj.DischargeReviewedBy }, true);
                        if (TempFilter.length > 0) {
                            $scope.DischargeSummaryObj.DischargeReviewedByName = angular.copy(TempFilter[0].FullName);
                            $scope.DischargeSummaryObj.DischargeReviewedBySuffix = angular.copy(TempFilter[0].SuffixName);
                            $scope.DischargeSummaryObj.ReviewedByLicenseNumber = angular.copy(TempFilter[0].LicenseNumber);
                            if (TempFilter[0].SuffixId == 10) {
                                $scope.DischargeSummaryObj.DischargeReviewedByName = ' Dr. ' + $scope.DischargeSummaryObj.DischargeReviewedByName;
                            }
                        }
                    }
                 
                    $scope.DischargeSummaryObj.DischargeReviewedDate = $filter('date')($scope.PostopDischargeDetails.DischargeReviewedDate, "MM-dd-yyyy hh:mm a");                   
                    $scope.DischargeSummaryObj.PatientConditionInstruction = $scope.DischargeSummaryObj.PatientConditionInstruction.replace(/\n/g, '<br>');
                    $scope.DischargeSummaryObj.DischargeInstruction = $scope.DischargeSummaryObj.DischargeInstruction.replace(/\n/g, '<br>');
                    $scope.DischargeSummaryObj.CoManagementInstruction = $scope.DischargeSummaryObj.CoManagementInstruction.replace(/\n/g, '<br>');
                    $scope.DischargeSummaryObj.ExaminationNotes = $scope.DischargeSummaryObj.ExaminationNotes.replace(/\n/g, '<br>');
                    $scope.DischargeSummaryObj.FollowUpInstructions = $scope.DischargeSummaryObj.FollowUpInstructions.replace(/\n/g, '<br>');


                    if ($scope.DischargeSummaryObj.PatientConditionInstruction !='') {
                        $scope.DischargeSummaryObj.PatientConditionInstructionInd = true;
                    }

                    if ($scope.DischargeSummaryObj.DischargeInstruction != '') {
                        $scope.DischargeSummaryObj.DischargeInstructionInd = true;
                    }

                    if ($scope.DischargeSummaryObj.CoManagementInstruction  != '') {
                        $scope.DischargeSummaryObj.CoManagementInstructionInd = true;
                    }
                    
                    
                  

                   

                } else {
                    $scope.isAddingScreenVisible = true;
                    $scope.isEditScreenVisible = false;
                    $scope.DischargeSummaryObj.DischargeReviewedBy = null;
                    $scope.DischargeSummaryObj.FollowUpInstructions = "";
                    $scope.DischargeSummaryObj.CoManagementInstruction = "";
                    $scope.DischargeSummaryObj.MedicationInstruction = "";
                    $scope.DischargeSummaryObj.DischargeInstruction = "";
                    $scope.DischargeSummaryObj.PatientConditionInstruction = "";
                    $scope.DischargeSummaryObj.ProceduralInstruction = "";
                    $scope.DischargeSummaryObj.FollowUpDate1 = "";
                    $scope.DischargeSummaryObj.FollowUpDate2 = "";
                    $scope.DischargeSummaryObj.FollowUpDate3 = "";
                    $scope.DischargeSummaryObj.FollowUpDate2Ind = false;
                    $scope.DischargeSummaryObj.FollowUpDate3Ind = false;
                }
            }

            //if ($scope.MainObj.IsSummaryNav) {
            //    $scope.DischargeSummaryObj.IsShowAddScreen = true;
            //} else {
            //    if (resp[2].data.rows.length == 0) {
            //        $scope.DischargeSummaryObj.IsShowAddScreen = true;
            //    }
            //    else if (resp[2].data.rows.length > 0) {
            //        $scope.DischargeSummaryObj.IsShowAddScreen = false;
            //    }
            //}


            if ($scope.DischargeSummaryObj.SurgeryList.length > 0) {
                angular.forEach($scope.DischargeSummaryObj.SurgeryList, function (item) {

                    var surgerylist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.cacheStorageItem.DoctorID}, true);
                    if (surgerylist.length > 0) {
                        $scope.SurgeryDiagnosisObj.Surgeon = angular.copy(surgerylist[0].FullName);
                        $scope.SurgeryDiagnosisObj.SurgeonID = angular.copy(item.SurgeonId);
                    } else {
                        var surgerylist1 = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.cacheStorageItem.DoctorID }, true);
                        if (surgerylist1.length > 0) {
                            $scope.SurgeryDiagnosisObj.Surgeon = angular.copy(surgerylist1[0].FullName);
                        }
                    }

                    var cosurgerylist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.CoSurgeonId }, true);
                    if (cosurgerylist.length > 0) {
                        $scope.SurgeryDiagnosisObj.CoSurgeonId = angular.copy(item.SurgeonId);
                    }

                    var Anesthetistlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.AnesthetistId }, true);
                    if (Anesthetistlist.length > 0) {
                        $scope.SurgeryDiagnosisObj.Anesthetist = angular.copy(Anesthetistlist[0].FullName);
                        $scope.SurgeryDiagnosisObj.AnesthetistID = angular.copy(item.AnesthetistId);
                    } else {
                        $scope.SurgeryDiagnosisObj.Anesthetist = $scope.SurgeryDiagnosisObj.Anesthetist || '';
                    }

                    var Nurselist = $filter("filter")($scope.AllNurseList, function (kitem) { return kitem.DoctorID == item.NurseId }, true);
                    if (Nurselist.length > 0) {
                        $scope.SurgeryDiagnosisObj.Nurse = angular.copy(Nurselist[0].FullName);
                        $scope.SurgeryDiagnosisObj.NurseID = angular.copy(item.NurseId);
                    } else {
                        $scope.SurgeryDiagnosisObj.Nurse = $scope.SurgeryDiagnosisObj.Nurse || '';
                    }

                    $scope.SurgeryDiagnosisObj.OperativeProcedure = item.SurgeryName;
                    $scope.SurgeryDiagnosisObj.SurgeryDate = $scope.cacheStorageItem.AppointmentDate;
                    $scope.SurgeryDiagnosisObj.OrganizationSurgeryId = item.OrganizationSurgeryId;
                    $scope.SurgeryDiagnosisObj.SurgeryId = item.SurgeryId;
                    $scope.SurgeryDiagnosisObj.OrganId = item.OrganId;

                    item.DiagnosisList = item.DiagnosisList || [];
                    if (item.DiagnosisList.length > 0) {
                        $scope.SurgeryDiagnosisObj.Diagnosis = item.DiagnosisList[0].DiagnosisName;
                        $scope.SurgeryDiagnosisObj.OrganizationDiagnosisId = item.DiagnosisList[0].OrganizationDiagnosisId;
                        $scope.SurgeryDiagnosisObj.DiagnosisId = item.DiagnosisList[0].DiagnosisId;
                        $scope.SurgeryDiagnosisObj.ICDCode = item.DiagnosisList[0].ICDCode;
                    }

                    $scope.SurgeryDiagnosisObj.Diagnosis2 = $scope.SurgeryDiagnosisObj.Diagnosis2 || '';
                    if (item.DiagnosisList.length > 1) {
                        $scope.SurgeryDiagnosisObj.Diagnosis2 = item.DiagnosisList[1].DiagnosisName;
                        $scope.SurgeryDiagnosisObj.ICDCode2 = item.DiagnosisList[1].ICDCode;
                    }

                    $scope.SurgeryDiagnosisObj.InternalCoManagerId = item.InternalCoManagerId || null;
                    item.InternalCoManagerId = item.InternalCoManagerId || '';
                    if (item.InternalCoManagerId != '') {
                        let temparray = $filter('filter')($scope.allUserList, { 'DoctorID': item.InternalCoManagerId }, true);
                        if (temparray.length > 0) {
                            $scope.SurgeryDiagnosisObj.InternalCoManager = temparray[0].FullName;
                            var License = '';
                            var Suffix = '';
                            if (item.SuffixName !== '') {
                                Suffix = temparray[0].SuffixName;
                            }
                            if (item.LicenseNumber !== '') {
                                License = 'Lic : ' + temparray[0].LicenseNumber;
                            }

                            $scope.SurgeryDiagnosisObj.InternalCoManager = ' Dr. ' + $scope.SurgeryDiagnosisObj.InternalCoManager + ' ' + Suffix + ' ' + License;
                        } else {
                            $scope.SurgeryDiagnosisObj.InternalCoManager = "";
                        }
                    }

                    $scope.SurgeryDiagnosisObj.ExternalCoManagerId = item.ExternalCoManagerId || null;
                    $scope.SurgeryDiagnosisObj.ExternalCoManager = item.ExternalCoManagerName || '';
                    //item.ExternalCoManagerId = item.ExternalCoManagerId || '';
                    //if (item.ExternalCoManagerId != '') {
                    //    let temparray = $filter('filter')($scope.allUserList, { 'DoctorID': item.ExternalCoManagerId }, true);
                    //    if (temparray.length > 0) {
                    //        $scope.SurgeryDiagnosisObj.ExternalCoManager = temparray[0].FullName;
                    //    } else {
                    //        $scope.SurgeryDiagnosisObj.ExternalCoManager = "";
                    //    }
                    //}
                });
            }

            //$scope.MainObj.IsSummaryNav = false;
        });

        $scope.AllNurseList = angular.copy($scope.allUserList);
        $scope.AllNurseList = _.uniq($scope.AllNurseList, false, function (p) { return p.DoctorID; });
        $scope.AllNurseList = $filter("filter")($scope.AllNurseList, function (item) {
            return item.RoleId === 8;
        });
    };

    $scope.OnScreenLoad();

    $scope.IsOpenDiscahrge = function () {
        $scope.IsOpenDischarge = !$scope.IsOpenDischarge;
    }
    $scope.SaveDischargePostOpInstructionTemplate = function () {

        /*  $scope.DischargeSummaryObj.PostOpInstructionTemplateId = $scope.DischargeSummaryObj.PostOpInstructionTemplateId || 0;*/
        if ($scope.DischargeSummaryObj.DischargeInstruction == '') {
            alertify.error("Please Enter Discharge Instruction!");
            return false;
        }
        if ($scope.DischargeSummaryObj.PostOpInstructionTemplateId != 0) {
            if ($scope.DischargeSummaryObj.DischargePostOpInstructionTemplateName == "") {
                alertify.error("Please Enter Template Name!");
                return;
            }
        }
        if ($scope.DischargeSummaryObj.DischargePostOpInstructionTemplateName == "") {
            alertify.error("Please Enter Template Name!");
            return;
        }

        let templateReq = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "PostOpInstructionTemplateId":  0,
            "DischargeInstruction": $scope.DischargeSummaryObj.DischargeInstruction || "",
            "TemplateName": $scope.DischargeSummaryObj.DischargePostOpInstructionTemplateName,
            "DeleteInd": "N"
        };
        eHnoteSurgeryService.AddUpdateAscPostOpInstructionTemplates(templateReq).then(function (resp) {
            if (resp.data.status === "Success") {
                alertify.success("Template saved successfully!");
                $scope.GetAscPostopDischargeTemplates();
                $scope.DischargeSummaryObj.DischargePostOpInstructionTemplateName = "";
                $scope.DischargeSummaryObj.PostOpInstructionTemplateId = 0;
                $scope.IsOpenDischarge = false;
            }
            if (resp.data.status === "Failure") {
                alertify.error(resp.data.Message)
            }
        }, function (err) {
            console.log(err);
        });

    };
    $scope.DischargeSummaryObj.DischargeInstructionInd = false;
    $scope.OnSelectTemplatelist = function (array) {
        let temparray = $filter('filter')(array, { 'PostOpInstructionTemplateId': $scope.DischargeSummaryObj.PostOpInstructionTemplateId }, true);
        temparray = temparray || [];
        $scope.DischargeSummaryObj.DischargeInstructionInd = true;
        if (temparray.length > 0) {
            $scope.DischargeSummaryObj.DischargeInstruction = temparray[0].DischargeInstruction;
            $scope.DischargeSummaryObj.PostOpInstructionTemplateId = temparray[0].PostOpInstructionTemplateId;
        } else {
            $scope.DischargeSummaryObj.DischargeInstruction = "";
        }
    };

    $scope.AddDischargeMedicationInstructionTemplate = function () {
        $scope.DischargeSummaryObj.DischargeMedicationInstructionTemplateId = $scope.DischargeSummaryObj.DischargeMedicationInstructionTemplateId || 0;
        if ($scope.DischargeSummaryObj.DischargeMedicationInstructionTemplateId != 0) {
            if ($scope.DischargeSummaryObj.MedictionTemplateName == "") {
                alertify.error("Please Enter Template Name!");
                return;
            }
        }
        if ($scope.DischargeSummaryObj.MedictionTemplateName == "") {
            alertify.error("Please Enter Template Name!");
            return;
        }

        let templateReq = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "DischargeMedicationInstructionTemplateId": $scope.DischargeSummaryObj.DischargeMedicationInstructionTemplateId || 0,
            "DischargeMedicationInstruction": $scope.DischargeSummaryObj.MedicationInstruction,
            "TemplateName": $scope.DischargeSummaryObj.MedictionTemplateName,
            "DeleteInd": "N",
        };
        eHnoteSurgeryService.AddUpdateDischargeMedicationInstructionTemplates(templateReq).then(function (resp) {
            if (resp.data.status === "Success") {
                alertify.success("Template saved successfully!");
                $scope.GetAscPostopDischargeTemplates();
                $scope.DischargeSummaryObj.MedictionTemplateName = "";
            }
            if (resp.data.status === "Failure") {
                alertify.error(resp.data.Message)
            }
        }, function (err) {
            console.log(err);
        });
    };

    $scope.OnSelectMedicationInstructionTemplate = function (item) {
        if (item != null) {
            $scope.DischargeSummaryObj.MedicationInstruction = item.DischargeMedicationInstruction || "";
            $scope.DischargeSummaryObj.DischargeMedicationInstructionTemplateId = item.TemplateId || 0;
        } else {
            $scope.DischargeSummaryObj.MedicationInstruction = "";
        }
    };

    $scope.AddUpdateAscPostOpProceduralNameTemplates = function () {
        $scope.DischargeSummaryObj.DischargeProcedureNameInstructionTemplateId = $scope.DischargeSummaryObj.DischargeProcedureNameInstructionTemplateId || 0;
        if ($scope.DischargeSummaryObj.DischargeProcedureNameInstructionTemplateId != 0) {
            if ($scope.DischargeSummaryObj.ProceduralNameTemplateName == "") {
                alertify.error("Please Enter Template Name!");
                return;
            }
        }
        if ($scope.DischargeSummaryObj.ProceduralNameTemplateName == "") {
            alertify.error("Please Enter Template Name!");
            return;
        }

        let templateReq = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "DischargeProcedureNameInstructionTemplateId": $scope.DischargeSummaryObj.DischargeProcedureNameInstructionTemplateId || 0,
            "DischargeProcedureInstructions": $scope.DischargeSummaryObj.ProceduralInstruction,
            "TemplateName": $scope.DischargeSummaryObj.ProceduralNameTemplateName,
            "DeleteInd": "N",
        };
        eHnoteSurgeryService.AddUpdateAscPostOpProceduralNameTemplates(templateReq).then(function (resp) {
            if (resp.data.status === "Success") {
                alertify.success("Template saved successfully!");
                $scope.GetAscPostopDischargeTemplates();
                $scope.DischargeSummaryObj.ProceduralNameTemplateName = "";
            }
            if (resp.data.status === "Failure") {
                alertify.error(resp.data.Message)
            }
        }, function (err) {
            console.log(err);
        });
    };

    $scope.OnSelectProcedureTemplatelist = function (array) {
        let temparray = $filter('filter')(array, { 'DischargeProcedureNameInstructionTemplateId': $scope.DischargeSummaryObj.DischargeProcedureNameInstructionTemplateId }, true);
        temparray = temparray || [];
        if (temparray.length > 0) {
            $scope.DischargeSummaryObj.ProceduralInstruction = temparray[0].DischargeProcedureInstructions;
            $scope.DischargeSummaryObj.DischargeProcedureNameInstructionTemplateId = temparray[0].DischargeProcedureNameInstructionTemplateId;
        } else {
            $scope.DischargeSummaryObj.DischargeProcedureInstructions = "";
        }
    };


    $scope.IsOpenPatient = function () {
        $scope.IsOpenPatientCondition = !$scope.IsOpenPatientCondition;
    }

    $scope.AddUpdateAscPostOpConditionOnDischargeTemplates = function () {
        //$scope.DischargeSummaryObj.PatientDischargeConditionInstructionTemplateId = $scope.DischargeSummaryObj.PatientDischargeConditionInstructionTemplateId || 0;
        if ($scope.DischargeSummaryObj.PatientConditionInstruction == '') {
            alertify.error("Please Enter Patient Condition Instruction!");
            return;
        }
        if ($scope.DischargeSummaryObj.PatientDischargeConditionInstructionTemplateId != 0) {
            if ($scope.DischargeSummaryObj.ConditionOnDischargeTemplateName == "") {
                alertify.error("Please Enter Template Name!");
                return;
            }
        }
        if ($scope.DischargeSummaryObj.ConditionOnDischargeTemplateName == "") {
            alertify.error("Please Enter Template Name!");
            return;
        }

        let templateReq = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "PatientDischargeConditionInstructionTemplateId":  0,
            "PatientDischargeConditionInstructions": $scope.DischargeSummaryObj.PatientConditionInstruction,
            "TemplateName": $scope.DischargeSummaryObj.ConditionOnDischargeTemplateName,
            "DeleteInd": "N",
        };
        eHnoteSurgeryService.AddUpdateAscPostOpConditionOnDischargeTemplates(templateReq).then(function (resp) {
            if (resp.data.status === "Success") {
                alertify.success("Template saved successfully!");
                $scope.GetAscPostopDischargeTemplates();
                $scope.DischargeSummaryObj.ConditionOnDischargeTemplateName = "";
                $scope.DischargeSummaryObj.PatientDischargeConditionInstructionTemplateId = 0;
                $scope.IsOpenPatientCondition = false;
            }
            if (resp.data.status === "Failure") {
                alertify.error(resp.data.Message)
            }
        }, function (err) {
            console.log(err);
        });
    };
    $scope.DischargeSummaryObj.PatientConditionInstructionInd = false;
    $scope.OnSelectConditionTemplatelist = function (array) {
        let temparray = $filter('filter')(array, { 'PatientDischargeConditionInstructionTemplateId': $scope.DischargeSummaryObj.PatientDischargeConditionInstructionTemplateId }, true);
        temparray = temparray || [];
        $scope.DischargeSummaryObj.PatientConditionInstructionInd = true;
        if (temparray.length > 0) {
            $scope.DischargeSummaryObj.PatientConditionInstruction = temparray[0].PatientDischargeConditionInstructions;
            $scope.DischargeSummaryObj.PatientDischargeConditionInstructionTemplateId = temparray[0].PatientDischargeConditionInstructionTemplateId;
        } else {
            $scope.DischargeSummaryObj.PatientConditionInstruction = "";
        }
    };


    $scope.IsOpenComangement = function () {
        $scope.IsOpenComange = !$scope.IsOpenComange
    }
    $scope.AddUpdateAscPostOpCoManagementTemplates = function () {
        //$scope.DischargeSummaryObj.DischargeCoManagementInstructionTemplateId = $scope.DischargeSummaryObj.DischargeCoManagementInstructionTemplateId || 0;
        if ($scope.DischargeSummaryObj.CoManagementInstruction=='') {
            alertify.error("Please Enter Co-Management Instruction!");
            return false;
        }
        if ($scope.DischargeSummaryObj.DischargeCoManagementInstructionTemplateId != 0) {
            if ($scope.DischargeSummaryObj.CoManagementTemplateName == "") {
                alertify.error("Please Enter Template Name!");
                return;
            }
        }
        if ($scope.DischargeSummaryObj.CoManagementTemplateName == "") {
            alertify.error("Please Enter Template Name!");
            return;
        }

        let templateReq = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "DischargeCoManagementInstructionTemplateId": 0,
            "DischargeCoManagementInstructions": $scope.DischargeSummaryObj.CoManagementInstruction,
            "TemplateName": $scope.DischargeSummaryObj.CoManagementTemplateName,
            "DeleteInd": "N",
        };
        eHnoteSurgeryService.AddUpdateAscPostOpCoManagementTemplates(templateReq).then(function (resp) {
            if (resp.data.status === "Success") {
                alertify.success("Template saved successfully!");
                $scope.GetAscPostopDischargeTemplates();
                $scope.DischargeSummaryObj.CoManagementTemplateName = "";
                $scope.DischargeSummaryObj.DischargeCoManagementInstructionTemplateId = 0;
                $scope.IsOpenComange = false;
            }
            if (resp.data.status === "Failure") {
                alertify.error(resp.data.Message)
            }
        }, function (err) {
            console.log(err);
        });
    };
    $scope.DischargeSummaryObj.CoManagementInstructionInd = false;
    $scope.OnSelectCoManagementTemplatelist = function (array) {
        let temparray = $filter('filter')(array, { 'DischargeCoManagementInstructionTemplateId': $scope.DischargeSummaryObj.DischargeCoManagementInstructionTemplateId }, true);
        temparray = temparray || [];
        $scope.DischargeSummaryObj.CoManagementInstructionInd = true;
        if (temparray.length > 0) {
            $scope.DischargeSummaryObj.CoManagementInstruction = temparray[0].DischargeCoManagementInstructions;
            $scope.DischargeSummaryObj.DischargeCoManagementInstructionTemplateId = temparray[0].DischargeCoManagementInstructionTemplateId;
        } else {
            $scope.DischargeSummaryObj.CoManagementInstruction = "";
        }
    };

    /* Post-op Discharge - End   */

    $scope.$on("admissionEmitEvent", function (event, data) {
        $scope.cacheStorageItem.AdmissionId = data || 0;
        $scope.AddToCache();
    });

    $scope.$on("SummaryNavSubEvent", function (event, data) {
        if (data == 0) {
            $scope.ChangeTab(9);
        } else if (data == 1) {
            $scope.ChangeTab(2);
        } else if (data == 2) {
            $scope.ChangeTab(3);
        } else if (data == 3) {
            $scope.ChangeTab(4);
        } else if (data == 4) {
            $scope.OnScreenLoad();
        } else if (data == 5) {
            $scope.ChangeTab(13);
        }
        
    });

    $scope.Quicksummarypopupprofile = function (SubTabId) {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/Quicksummarypopup.html",
            "backdrop": "static",
            "keyboard": false,
            // "windowClass": "modal__popup--1 bottom-to-top-modal in",
            "windowClass": "offcanves-right  ",
            "scope": $scope,
            "controller": "QuickAccessSummaryCtrl",
            "resolve": {
                "SubTabId": function () { return SubTabId; }
            }
        });
    };

    $scope.PostOpDischargeSignOff = function (str) {

        let obj = {
            "Screen": "Discharge",
            "Type": "SignOff",
            "allUserList": angular.copy($scope.allUserList) || [],
        };

        let signmodalInstance = $uibModal.open({
            "templateUrl": "templates/consultation/SignOffPassword.html",
            "controller": "UsSignOffPasswordPopupCtrl",
            "size": "md",
            "windowClass": " ",
            "backdrop": "static",
            "keyboard": false,
            "resolve": {
                "obj": function () { return obj; }
            }
        });
        signmodalInstance.result.then(function (resp) {
            $scope.SavePostOpDischargeData("SignOff");
        }, function (data) {

        });
    }


    $scope.TempObj = {
        "IsFindingsTemplateSavePopOver": false,
        "IsFollowUpTemplateSavePopOver": false,
        "EnterFindingsTemplateName": "",
        "EnterFollowUpTemplateName": "",
       
    }
    $scope.Findingstemplateover = {
        templateUrl: 'AddFindingsTemplatSave.html',
    };

    $scope.FollowUptemplateover = {
        templateUrl: 'AddFollowUpTemplatSave.html',
    };

    $scope.SaveFindingsTemplate = function () {
        $scope.TempObj.EnterFindingsTemplateName = $scope.TempObj.EnterFindingsTemplateName || "";
        if ($scope.DischargeSummaryObj.ExaminationNotes == '') {
            alertify.error("Please Enter ExaminationNotes!");
            return false;
        }
        if ($scope.TempObj.EnterFindingsTemplateName === "") {
            alertify.error("Please Enter Template Name!");
            return false;
        } else {
            let templateReq = {
                "UserId": $scope.UserId || "",
                "HospitalId": $scope.HospitalId || "",
                "TemplateId": 0,
                "TemplateName": $scope.TempObj.EnterFindingsTemplateName || "",
                "DeleteInd": "N",
                "TemplateNotes": [],
                "TypeId": '3',
                "TypeName": 'Findings',
            };
            templateReq.TemplateNotes = $scope.DischargeSummaryObj.ExaminationNotes || "";
            /*console.log(templateReq);*/
            eHnoteSurgeryService.AddUpdateIntraOpTemplates(templateReq).then(function (resp) {
                if (resp.data.Status === "Success") {
                    alertify.success("Template saved successfully!");
                    $scope.TempObj.EnterFindingsTemplateName = "";
                    $scope.TempObj.IsFindingsTemplateSavePopOver = false;
                    $scope.GetPreOpMedicineCheckListTemplates();
                    //$uibModalInstance.close();
                }
                if (resp.data.status === "Failure") {
                    alertify.error('TemplateName Already Exists')
                }
            }, function (err) {
                console.log(err);
            });

        }

    };

    //$scope.AddChecklistFindingsTemplate = function () {
    //    let modalInstance = $uibModal.open({
    //        "templateUrl": "templates/uibpopups/ChecklistTemplateNamePopUp.html",
    //        "controller": function ($scope, $uibModalInstance, surgicalnotes) {
    //            $scope.closePopup = function () {
    //                $uibModalInstance.dismiss("cancel");
    //            };

    //            $scope.SaveTemplateName = function () {
    //                $scope.TemplateName = $scope.TemplateName || "";
    //                if ($scope.TemplateName === "") {
    //                    alertify.error("Please enter template name!");
    //                    return false;
    //                } else {
    //                    let templateReq = {
    //                        "UserId": $scope.UserId || "",
    //                        "HospitalId": $scope.HospitalId || "",
    //                        "TemplateId": 0,
    //                        "TemplateName": $scope.TemplateName || "",
    //                        "DeleteInd": "N",
    //                        "TemplateNotes": [],
    //                        "TypeId": '3',
    //                        "TypeName": 'Findings',
    //                    };
    //                    templateReq.TemplateNotes = $scope.DischargeSummaryObj.ExaminationNotes || "";
    //                    /*console.log(templateReq);*/
    //                    eHnoteSurgeryService.AddUpdateIntraOpTemplates(templateReq).then(function (resp) {
    //                        if (resp.data.Status === "Success") {
    //                            alertify.success("Template saved successfully!");
    //                            $uibModalInstance.close();
    //                        }
    //                        if (resp.data.status === "Failure") {
    //                            alertify.error('TemplateName Already Exists')
    //                        }
    //                    }, function (err) {
    //                        console.log(err);
    //                    });

    //                }

    //            };
    //        },
    //        "backdrop": "static",
    //        "keyboard": false,
    //        "size": "sm",
    //        "scope": $scope,
    //        "resolve": {
    //            "surgicalnotes": function () {
    //                return $scope.DischargeSummaryObj.ExaminationNotes;
    //            }
    //        }
    //    });
    //    modalInstance.result.then(function (data) {
    //        $scope.GetPreOpMedicineCheckListTemplates();
    //    }, function (data) {
    //        console.log(data);
    //    });
    //};

    $scope.OnselectFindingsNotesTemplates = function (item) {
        item.TemplateNotes = item.TemplateNotes || "";
        $scope.DischargeSummaryObj.ExaminationNotesInd = true;
        if (item.TemplateNotes != '') {
            $scope.DischargeSummaryObj.ExaminationNotes = item.TemplateNotes || "";
        }
        else {
            $scope.DischargeSummaryObj.ExaminationNotes = '';
        }
    }

    $scope.ClearFindingsTempNotes = function (item) {
        if (item == '') {
            $scope.DischargeSummaryObj.SelectedFindingsNotesTemplate = 'Select';
        }
    }




    $scope.SaveFollowUpTemplate = function () {
        $scope.TempObj.EnterFollowUpTemplateName = $scope.TempObj.EnterFollowUpTemplateName || "";
        if ($scope.DischargeSummaryObj.FollowUpInstructions == '') {
            alertify.error("Please Enter FollowUp Instructions");
            return false;
        }
        if ($scope.TempObj.EnterFollowUpTemplateName === "") {
            alertify.error("Please Enter Template Name!");
            return false;
        } else {
            let templateReq = {
                "UserId": $scope.UserId || "",
                "HospitalId": $scope.HospitalId || "",
                "TemplateId": 0,
                "TemplateName": $scope.TempObj.EnterFollowUpTemplateName || "",
                "DeleteInd": "N",
                "TemplateNotes": [],
                "TypeId": '5',
                "TypeName": 'Followup',
            };
            templateReq.TemplateNotes = $scope.DischargeSummaryObj.FollowUpInstructions || "";
            /*console.log(templateReq);*/
            eHnoteSurgeryService.AddUpdateIntraOpTemplates(templateReq).then(function (resp) {
                if (resp.data.Status === "Success") {
                    alertify.success("Template saved successfully!");
                    $scope.TempObj.EnterFollowUpTemplateName = '';
                    $scope.TempObj.IsFollowUpTemplateSavePopOver = false;
                    $scope.GetPreOpMedicineCheckListTemplates();
                  //  $uibModalInstance.close();
                }
                if (resp.data.status === "Failure") {
                    alertify.error('TemplateName Already Exists')
                }
            }, function (err) {
                console.log(err);
            });

        }

    };

    //$scope.AddChecklistFollowupTemplate = function () {
    //    let modalInstance = $uibModal.open({
    //        "templateUrl": "templates/uibpopups/ChecklistTemplateNamePopUp.html",
    //        "controller": function ($scope, $uibModalInstance, surgicalnotes) {
    //            $scope.closePopup = function () {
    //                $uibModalInstance.dismiss("cancel");
    //            };

    //            $scope.SaveTemplateName = function () {
    //                $scope.TemplateName = $scope.TemplateName || "";
    //                if ($scope.TemplateName === "") {
    //                    alertify.error("Please enter template name!");
    //                    return false;
    //                } else {
    //                    let templateReq = {
    //                        "UserId": $scope.UserId || "",
    //                        "HospitalId": $scope.HospitalId || "",
    //                        "TemplateId": 0,
    //                        "TemplateName": $scope.TemplateName || "",
    //                        "DeleteInd": "N",
    //                        "TemplateNotes": [],
    //                        "TypeId": '5',
    //                        "TypeName": 'Followup',
    //                    };
    //                    templateReq.TemplateNotes = $scope.DischargeSummaryObj.FollowUpInstructions || "";
    //                    /*console.log(templateReq);*/
    //                    eHnoteSurgeryService.AddUpdateIntraOpTemplates(templateReq).then(function (resp) {
    //                        if (resp.data.Status === "Success") {
    //                            alertify.success("Template saved successfully!");
    //                            $uibModalInstance.close();
    //                        }
    //                        if (resp.data.status === "Failure") {
    //                            alertify.error('TemplateName Already Exists')
    //                        }
    //                    }, function (err) {
    //                        console.log(err);
    //                    });

    //                }

    //            };
    //        },
    //        "backdrop": "static",
    //        "keyboard": false,
    //        "size": "sm",
    //        "scope": $scope,
    //        "resolve": {
    //            "surgicalnotes": function () {
    //                return $scope.DischargeSummaryObj.FollowUpInstructions;
    //            }
    //        }
    //    });
    //    modalInstance.result.then(function (data) {
    //        $scope.GetPreOpMedicineCheckListTemplates();
    //    }, function (data) {
    //        console.log(data);
    //    });
    //};


    $scope.OnselectFollowUpNotesTemplates = function (item) {
        item.TemplateNotes = item.TemplateNotes || "";
        $scope.DischargeSummaryObj.FollowUpInstructionsInd = true;
        if (item.TemplateNotes != '') {
            $scope.DischargeSummaryObj.FollowUpInstructions = item.TemplateNotes || "";
        }
        else {
            $scope.DischargeSummaryObj.FollowUpInstructions = '';
        }
    }

    $scope.ClearFollowupTempNotes = function (item) {
        if (item == '') {
            $scope.DischargeSummaryObj.SelectedFollowupNotesTemplate = 'Select';
        }
    }

    $scope.ShowFilesPopup = function () {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/FilesPopUp.html",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": "modal__popup--1 bottom-to-top-modal in  ",
            //"windowClass": "offcanves-right",
            "scope": $scope,
            "controller": function ($scope, $uibModal, $uibModalInstance) {
                $scope.closeuibpopup = function () {
                    $uibModalInstance.dismiss();
                };
            },
        });
    };

    $scope.Ascbasicdetailspopup = function () {

        let reqIds = {
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "HospitalId": $scope.HospitalId,
            "ParentHospitalId": $scope.ParentHospitalId || null,
        };

        var modalInstance = $uibModal.open({
            "templateUrl": "templates/uibpopups/Ascbasicdetailspopup.html",
            "resolve": {
                "AllUserList": function () { return $scope.allUserList; },
                "AllAnesthetistList": function () { return $scope.AnesthetistArray; },
                "AllNurseList": function () { return $scope.AllNurseList; },
                "AppointmentId": function () { return $scope.cacheStorageItem.AppointmentId; },
                "PatientSurgeryId": function () { return $scope.SurgeryDiagnosisObj.SelectedSurgery.PatientSurgeryId; },
                "SurgeonID": function () { return $scope.SurgeryDiagnosisObj.SelectedSurgery.DoctorId; },
                "SurgeryList": function () { return $scope.DischargeSummaryObj.SurgeryList; },
                "reqIds": function () { return reqIds; },
                "SurgeryDiagnosisObj": function () { return $scope.SurgeryDiagnosisObj; },
                "PatientDetails": function () { return $scope.selectedPatientData; },
                "cacheStorageItem": function () { return $scope.cacheStorageItem; }

            },
            "controller": function ($scope, $uibModal, $uibModalInstance, AllUserList, AllAnesthetistList, AllNurseList, AppointmentId, PatientSurgeryId, SurgeonID, SurgeryDiagnosisObj, reqIds, PatientDetails, SurgeryList, cacheStorageItem) {
                $scope.PatientID = cacheStorageItem.PatientID;
                $scope.cacheStorageItem = cacheStorageItem;

                $scope.UserId = reqIds.UserId;
                $scope.SpecializationId = reqIds.SpecializationId;
                $scope.HospitalId = reqIds.HospitalId;

                $scope.ParentHospitalId = reqIds.ParentHospitalId || null;

                $scope.adviseObj = {
                    'SearchProcedureObj': "",
                    'DiagnosisObject': "",
                    'SearchReferalObj': ""
                };

                $scope.EditSurgeryObj = {
                    "AllUserList": [],
                    "AllAnesthetistList": [],
                    "AllNurseList": [],
                    "UserID": null,
                    "AnesthetistID": null,
                    "NurseID": null,
                    "Height": "",
                    "Weight": ""
                }


                $scope.HeightUnits = [
                    {
                        "Unit": "Ft/Inches",
                        "UnitId": 1
                    },
                    {
                        "Unit": "Cms",
                        "UnitId": 2
                    }
                ];

                $scope.WeightUnits = [
                    {
                        "Unit": "Kgs",
                        "UnitId": 1
                    },
                    {
                        "Unit": "lbs",
                        "UnitId": 2
                    }
                ];

                $scope.SurgeryList = SurgeryList;
                $scope.EditSurgeryObj.Height = $scope.SurgeryList[0].Height;
                $scope.EditSurgeryObj.Weight = $scope.SurgeryList[0].Weight;


                $scope.EditSurgeryObj.AllUserList = AllUserList;
                $scope.EditSurgeryObj.AllAnesthetistList = AllAnesthetistList;
                $scope.EditSurgeryObj.AllNurseList = AllNurseList;
                if (SurgeryDiagnosisObj.SurgeonID != '') {
                    $scope.EditSurgeryObj.SurgeonID = SurgeryDiagnosisObj.SurgeonID;
                } else {
                    $scope.EditSurgeryObj.SurgeonID = SurgeonID;
                }
                $scope.EditSurgeryObj.AnesthetistID = SurgeryDiagnosisObj.AnesthetistID;
                $scope.EditSurgeryObj.CoSurgeonId = SurgeryDiagnosisObj.CoSurgeonId;
                $scope.EditSurgeryObj.ExternalCoManagerId = SurgeryDiagnosisObj.ExternalCoManagerId;
                $scope.EditSurgeryObj.InternalCoManagerId = SurgeryDiagnosisObj.InternalCoManagerId;
                $scope.EditSurgeryObj.NurseID = SurgeryDiagnosisObj.NurseID;

                $scope.EditSurgeryObj.Age = $scope.cacheStorageItem.Age;
                $scope.EditSurgeryObj.Gender = $scope.cacheStorageItem.Gender;
                $scope.EditSurgeryObj.Race = $scope.cacheStorageItem.RaceName;
                $scope.EditSurgeryObj.Height = $scope.cacheStorageItem.Height;
                $scope.EditSurgeryObj.Weight = $scope.cacheStorageItem.Weight;


                $scope.GetDiagnosisList = function (val) {
                    let object = {
                        "LevelType": 'O',
                        "HospitalId": $scope.HospitalId,
                        "UserId": $scope.UserId,
                        "SpecializationId": $scope.SpecializationId,
                        "SearchText": val,
                        "PageSize": 10,
                        "PageNumber": 1,
                        "Type": '',
                        "IsFrequent": 'N',
                        "ParentOrganizationId": $scope.ParentHospitalId || null,
                    };

                    if (object.SearchText == '') {
                        object.IsFrequent = 'Y';
                    }
                    if ($scope.Assesmenttab === 2) {
                        if ($scope.AdvisedOrderDetailsArray.length == 0) {
                            alertify.error("Please Select Any Order And Continue To search");
                            return false;
                        }
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

                $scope.DiagnosisArray = [];

                if ($scope.SurgeryList.length > 0) {
                    angular.forEach($scope.SurgeryList, function (item) {
                        if (item.DiagnosisList.length > 0) {
                            angular.forEach(item.DiagnosisList, function (kitem) {
                                kitem.DeleteInd = "N";
                                $scope.DiagnosisArray.push(kitem);
                            });

                        }
                    });
                }

                $scope.onSelectHeight = function (id) {
                    if (id == 2) {
                        $scope.EditSurgeryObj.HeightUnitName = "Cms";
                    } else {
                        $scope.EditSurgeryObj.HeightUnitName = "Ft/Inches";
                    }
                };

                $scope.onSelectWeight = function (id) {
                    if (id == 2) {
                        $scope.EditSurgeryObj.WeightUnitName = "lbs";
                    } else {
                        $scope.EditSurgeryObj.WeightUnitName = "Kgs";
                    }
                };

                $scope.onSelectDiagnosis = function (mainobject) {

                    let filterdiagnosis = $filter("filter")($scope.DiagnosisArray, function (Aitem, index) { return Aitem.DiagnosisId == mainobject.DiagnosisId },);
                    if (filterdiagnosis.length > 0) {
                        mainobject = "";
                        $scope.adviseObj.DiagnosisObject = "";
                        alertify.error("Diagnosis Already Added");
                        return false;
                    }

                    let obj = {
                        "DeleteInd": "N",
                        "DiagnosisDetailId": 0,
                        "DiagnosisId": mainobject.DiagnosisId,
                        "DiagnosisName": mainobject.DiagnosisName,
                        "ICDCode": mainobject.ICD10CODE,
                    }

                    $scope.DiagnosisArray.push(obj);


                    $scope.adviseObj.DiagnosisObject = "";
                };

                $scope.RemoveDiagnosis = function (obj) {
                    if (obj.DiagnosisDetailId == 0) {
                        let index = $scope.DiagnosisArray.indexOf(obj);
                        if (index > -1) {
                            $scope.DiagnosisArray.splice(index, 1);
                        }
                    } else {
                        obj.DeleteInd = "Y";
                    }

                }

                $scope.SaveEditSurgeryStaff = function (item) {
                    var obj = {
                        //"PatientSurgeryID": PatientSurgeryId,
                        "AppointmentID": AppointmentId,
                        "AnesthetistID": item.AnesthetistID,
                        "NurseID": item.NurseID,
                        "SurgeonID": item.SurgeonID,
                        "UserId": $scope.UserId,
                        "AppointmentTypeId": 4,
                        "Height": $scope.EditSurgeryObj.Height || null,
                        "Weight": $scope.EditSurgeryObj.Weight || null,
                        "PatientId": $scope.PatientID,
                        "DiagnosisList": $scope.DiagnosisArray || [],
                        "ExternalCoManagerId": $scope.EditSurgeryObj.ExternalCoManagerId,
                        "InternalCoManagerId": $scope.EditSurgeryObj.InternalCoManagerId,
                        "CoSurgeonId": $scope.EditSurgeryObj.CoSurgeonId,
                        "HeightUnitId": $scope.EditSurgeryObj.HeightUnitId,
                        "HeightUnitName": $scope.EditSurgeryObj.HeightUnitName || 'Cms',
                        "WeightUnitId": $scope.EditSurgeryObj.WeightUnitId,
                        "WeightUnitName": $scope.EditSurgeryObj.WeightUnitName || 'lbs',
                        "Logs": {},
                    };
                    eHnoteSurgeryService.AddUpdateSurgeryStaffList(obj).then(function (response) {
                        console.log(response);
                        if (response.data.status === "Success") {
                            $uibModalInstance.close(response);
                        }
                    });
                };
                $scope.close = function (item) {
                    $uibModalInstance.dismiss("cancel");
                };
            },
            "backdrop": "static",
            "size": "lg",
            "keyboard": false,
            // "windowClass": "modal__popup--1 bottom-to-top-modal in",
        });
        modalInstance.result.then(function (data) {
            if (data.data.status === "Success") {

                let patientId = $scope.cacheStorageItem.PatientID || 0;
                eHnoteAuditServices.getPatientDetailsById(patientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
                function ongetPatientDetailsSuccess(data) {
                    if (data !== undefined) {
                        var patientitem = data;
                        $scope.cacheStorageItem.Height = patientitem.Patient[0].Height;
                        $scope.cacheStorageItem.Weight = patientitem.Patient[0].Weight;

                        $scope.AddToCache();
                    }
                }

                function ongetPatientDetailsError(error) {
                    console.log(error);
                }

                $scope.OnScreenLoad();
            }
        }, function (cancel) {

        }); 
    }
    $scope.ChangeReviewedbyItem = function (Id) {
        var TempFilter = $filter('filter')($scope.DischargeArray, { 'DoctorID': Id }, true);
        if (TempFilter.length > 0) {
            $scope.DischargeSummaryObj.DischargeReviewedBy = TempFilter[0].DoctorID;
            $scope.DischargeSummaryObj.DischargeReviewedByName = TempFilter[0].FullName;
            $scope.DischargeSummaryObj.DischargeReviewedBySuffix = angular.copy(TempFilter[0].SuffixName);
            $scope.DischargeSummaryObj.ReviewedByLicenseNumber = angular.copy(TempFilter[0].LicenseNumber);
        } else {
            $scope.DischargeSummaryObj.DischargeReviewedBy = '';
            $scope.DischargeSummaryObj.DischargeReviewedByName = '';
            $scope.DischargeSummaryObj.DischargeReviewedBySuffix = '';
            $scope.DischargeSummaryObj.ReviewedByLicenseNumber = '';
        }
    };

    $scope.NavFromSumary = function (item) {
        $scope.isAddingScreenVisible = true;
        $scope.isEditScreenVisible = false;

        $scope.DischargeSummaryObj.Findings = item.Findings.replace(/<br>/g, '\n');
        $scope.DischargeSummaryObj.PatientConditionInstruction = item.PatientConditionInstruction.replace(/<br>/g, '\n');
        $scope.DischargeSummaryObj.DischargeInstruction = item.DischargeInstruction.replace(/<br>/g, '\n');
        $scope.DischargeSummaryObj.CoManagementInstruction = item.CoManagementInstruction.replace(/<br>/g, '\n');
        $scope.DischargeSummaryObj.ExaminationNotes = item.ExaminationNotes.replace(/<br>/g, '\n');
        $scope.DischargeSummaryObj.FollowUpInstructions = item.FollowUpInstructions.replace(/<br>/g, '\n');


        if (item.PatientConditionInstruction != '') {
            $scope.DischargeSummaryObj.PatientConditionInstructionInd = true;
        }

        if (item.DischargeInstruction != '') {
            $scope.DischargeSummaryObj.DischargeInstructionInd = true;
        }

        if (item.CoManagementInstruction != '') {
            $scope.DischargeSummaryObj.CoManagementInstructionInd = true;
        }
        if (item.Findings != '') {
            $scope.DischargeSummaryObj.ExaminationNotesInd = true;
        }
        if (item.FollowUpInstructions != '') {
            $scope.DischargeSummaryObj.FollowUpInstructionsInd = true;
        }

        


    }

    $scope.toDataURL = function (dataURL, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', dataURL);
        xhr.responseType = 'blob';
        xhr.send();
    };
    $scope.HeaderLogo = '';
    $scope.DischargeSummaryPrint = function () {
        if (doctorinfo.doctordata.UserAddress.length > 0) {
            var EhnoteLogoURL = [];
            EhnoteLogoURL = doctorinfo.doctordata.UserAddress[0].OrganizationLogoUrl;
        }
        var EhnoteLogo = '';
        if (EhnoteLogoURL !== '') {
            $scope.toDataURL(EhnoteLogoURL, function (dataURL) {
                EhnoteLogo = dataURL;
                $scope.HeaderLogo = EhnoteLogo;
            });
        } else {
            $scope.HeaderLogo = EhnoteLogo;
        }
        let CreatedByName = "";
        if (doctorinfo.doctordata.User.length > 0) {
            if (doctorinfo.doctordata.User[0].Suffix !== '') {
                CreatedByName = doctorinfo.doctordata.User[0].FullName + ' ' + doctorinfo.doctordata.User[0].Suffix || "";
            } else {
                CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
            }
        }
        var Medications = [];
        if ($scope.DischargeSummaryObj.Prescriptions.length > 0) {
            angular.forEach($scope.DischargeSummaryObj.Prescriptions, function (item) {
                if (item.PrescriptionDetails.length > 0) {
                    Medications.push(item);
                }
            });
        } else {
            Medications = [];
        }

        $scope.Surgeondoctor = '';
        $scope.Anesthetist = '';
        $scope.PreOpDiagnosis = '';
        $scope.SurgeryName = '';
        $scope.OrganId = "";
        $scope.OrganName = "";
        if ($scope.DischargeSummaryObj.SurgeryList.length > 0) {
            angular.forEach($scope.DischargeSummaryObj.SurgeryList, function (sitem) {
                var Surgeonlist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.cacheStorageItem.DoctorID });
                if (Surgeonlist.length > 0) {
                    $scope.Surgeondoctor = Surgeonlist[0].FullName;
                    if (Surgeonlist[0].SuffixId == 10) {
                        $scope.Surgeondoctor = ' Dr. ' + $scope.Surgeondoctor;
                    }
                    if (Surgeonlist[0].SuffixName !== '') {
                        $scope.Surgeondoctor = $scope.Surgeondoctor + ' ' + Surgeonlist[0].SuffixName;
                    }
                }
                var Anesthesistlist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == sitem.AnesthetistId });
                if (Anesthesistlist.length > 0) {
                    $scope.Anesthetist = Anesthesistlist[0].FullName;
                    if (Anesthesistlist[0].SuffixId == 10) {
                        $scope.Anesthetist = ' Dr. ' + $scope.Anesthetist;
                    }
                    if (Anesthesistlist[0].SuffixName !== '') {
                        $scope.Anesthetist = $scope.Anesthetist + ' ' + Anesthesistlist[0].SuffixName;
                    }
                }
                if (sitem.SurgeryName !== '' && sitem.SurgeryName !== null) {
                    $scope.SurgeryName = sitem.SurgeryName;
                }
                if (sitem.DiagnosisList.length > 0) {
                    angular.forEach(sitem.DiagnosisList, function (sitem) {
                        var IcdCode = '';
                        if (sitem.ICDCode !== '' && sitem.ICDCode !== null) {
                            IcdCode = sitem.ICDCode;
                        }
                        if ($scope.PreOpDiagnosis !== '') {
                            $scope.PreOpDiagnosis = $scope.PreOpDiagnosis + ' , ' + IcdCode + '-' + sitem.DiagnosisName;
                        }
                        if ($scope.PreOpDiagnosis == '') {
                            $scope.PreOpDiagnosis = IcdCode + '-' + sitem.DiagnosisName;
                        }
                    });
                }
                $scope.OrganId = sitem.OrganId || "";
                if (sitem.OrganId !== '' && sitem.OrganId !== null) {
                    if ($scope.OrganId == 1) {
                        $scope.OrganName = "OD";
                    } else if ($scope.OrganId == 2) {
                        $scope.OrganName = "OS";
                    } else if ($scope.OrganId == 3) {
                        $scope.OrganName = "OU";
                    } else if ($scope.OrganId == 4) {
                        $scope.OrganName = "General";
                    }
                }
            });
        } else {
            $scope.Surgeondoctor = '';
            $scope.Anesthetist = '';
            $scope.PreOpDiagnosis = '';
            $scope.SurgeryName = '';
        }
        var ReviewedByMDDoctorArray = [];
        if ($scope.DischargeSummaryObj.DischargeReviewedBy !== 0 && $scope.SurgeonArray.length>0) {
            ReviewedByMDDoctorArray = $filter("filter")($scope.SurgeonArray, function (kitem) { return kitem.DoctorID == $scope.DischargeSummaryObj.DischargeReviewedBy }, true);
        }
        else {
            ReviewedByMDDoctorArray = [];
        }


        $timeout(function () {
            var Object = {
                'SurgeryDate': $scope.SurgeryDiagnosisObj.SurgeryDate || '',
                'OperativeProcedure': $scope.SurgeryDiagnosisObj.OperativeProcedure || '',
                'OrganId': $scope.SurgeryDiagnosisObj.OrganId || '',
                'Surgeon': $scope.Surgeondoctor || '',
                "Anesthetist": $scope.Anesthetist || '',
                "Diagnosis": $scope.PreOpDiagnosis || '',
                "SurgeryName": $scope.SurgeryName || '',
                "OrganName": $scope.OrganName || '',
                "CreatedBy": CreatedByName,
                "ConsultationDate": $scope.cacheStorageItem.AppointmentDate || '',
                "AppointmentTime": $scope.cacheStorageItem.AppointmentTime || '',
                "Name": $scope.cacheStorageItem.PatientName || '',
                "Age": $scope.cacheStorageItem.Age || '',
                "Gender": $scope.cacheStorageItem.Gender || '',
                "PatientDOB": $scope.cacheStorageItem.PatientDOB || '',
                "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayId || '',
                "PatientOldMrno": $scope.cacheStorageItem.PatientOldMrno || '',
                "PostOpDiagnosisArray": $scope.DischargeSummaryObj.Diagnosis || [],/* PostOpDiagnosis*/
                "VisitType": $scope.cacheStorageItem.AppointmentType || '',
                "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                "ExaminationNotes": $scope.DischargeSummaryObj.ExaminationNotes || '',
                "PatientCondition": $scope.DischargeSummaryObj.PatientConditionInstruction || '',
                "PostOpInstructions": $scope.DischargeSummaryObj.DischargeInstruction || '',
                "MedicationsArray": Medications || [],
                "MedicationInstructions": $scope.DischargeSummaryObj.MedicineOrdersInstructions || '',
                "ExternalCoManager": $scope.SurgeryDiagnosisObj.ExternalCoManager || '',
                "InternalCoManager": $scope.SurgeryDiagnosisObj.InternalCoManager || '',
                "CoManagementInstruction": $scope.DischargeSummaryObj.CoManagementInstruction || '',
                "FollowUpDate1": $scope.DischargeSummaryObj.FollowUpDate1 || '',
                "FollowUpDate2": $scope.DischargeSummaryObj.FollowUpDate2 || '',
                "FollowUpDate3": $scope.DischargeSummaryObj.FollowUpDate3 || '',
                "FollowUpInstructions": $scope.DischargeSummaryObj.FollowUpInstructions || '',
                "DischargeReviewedByName": $scope.DischargeSummaryObj.DischargeReviewedByName || '',
                "SuffixName": $scope.DischargeSummaryObj.DischargeReviewedBySuffix || '',
                "ReviewedByLicenseNumber": $scope.DischargeSummaryObj.ReviewedByLicenseNumber || '',
                "DischargeReviewedDate": $scope.DischargeSummaryObj.DischargeReviewedDate || '',
                "SignOffUserDetails": $scope.DischargeSummaryObj.LastSignOffUserDetails || [],
                "EhnoteLogoURL": $scope.HeaderLogo || '',
            }
            USPrintService.GenerateASCDischargeSummaryPrint(Object);
        }, 500);
    }

    $scope.UnsignFromSumary = function (item) {
 
        let obj = {
            "Screen": "Discharge",
            "Type": "Unsign",
            "allUserList": angular.copy($scope.allUserList) || [],
        };
        let signmodalInstance = $uibModal.open({
            "templateUrl": "templates/consultation/SignOffPassword.html",
            "controller": "UsSignOffPasswordPopupCtrl",
            "size": "md",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": " ",
            "resolve": {
                "obj": function () { return obj; }
            }
        });
        signmodalInstance.result.then(function (resp) {
            $scope.NavFromSumary($scope.DischargeSummaryObj);
        }, function (data) {
        });
    }
}]);
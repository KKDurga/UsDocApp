"use strict";
eHnoteWebApp.controller("EhnoteDiagnosisTemplatePopUpCtrl", ["$scope", "eHnotePatientDataService", "$timeout", "alertify", "$uibModalInstance", "eHnoteMasterDataService", "eHnoteCacheStorageService", "$filter", "eHnoteSettingsDataService", "eHnoteLabService", "datapersistanceFactory", "DiagnosisData", "eHnoteLoginStatusService", "loginCookieFactory", "eHnoteSurgeryService", function ($scope, eHnotePatientDataService, $timeout, alertify, $uibModalInstance, eHnoteMasterDataService, eHnoteCacheStorageService, $filter, eHnoteSettingsDataService, eHnoteLabService, datapersistanceFactory, DiagnosisData, eHnoteLoginStatusService, loginCookieFactory, eHnoteSurgeryService) {

    var doctorinfo = eHnoteMasterDataService.getUserInfo();

    $scope.SubTab = 1;
    $scope.DiagnosisData = DiagnosisData || "";
    $scope.SpecializationId = 0;
    $scope.PatientInstructionComments = "";
    $scope.ClinicalNotesComments = "";
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    $scope.DisplayDate = $filter('date')(new Date(), "dd-MMM-yyyy");
    $scope.Surgery = [];
    $scope.obj = {
        "SelectedDiagnosisItem": "", 
        "SelectedInvestigationItem": "", 
        "SelectedConsultationTreatment": "", 
        "SelectedTreatments": "", 
        "isGlassPrescribed": false,
        "isRxPrescribed": false,
        "isSurgeriesPrescribed": false,
        "AddInvestigation": false,
        "AddTreatment": false,
        "TemplateId": 0,
        "SelectedTemplateName": "",
        "TemplateDetails": "",
        "UserId": "",
        "TemplateName": "",
        "DeleteInd": 0,
        "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
        "SelectedSurgeryItem":""
    };
    $scope.GetDiagnosisType = function () {
        return [{
            "DiagnosisType": 1,
            "DiagnosisTypeName": "Provisional"
        },
        {
            "DiagnosisType": 3,
            "DiagnosisTypeName": "Final"
        }];
    };
    $scope.medicineGetObj = {
        "SearchText": "",
        "PageSize": 10,
        "PageNumber": 1,
        "TotalItems": 0
    };
    $scope.medicineTaperDropObj = {
        "SearchText": "",
        "PageSize": 10,
        "PageNumber": 1,
        "TotalItems": 0
    };
    $scope.medicineTaperTabletObj = {
        "SearchText": "",
        "PageSize": 10,
        "PageNumber": 1,
        "TotalItems": 0
    };
    $scope.DiagnosisType = "3";

    $scope.GetDiagnosisTypeList = angular.copy($scope.GetDiagnosisType());
    $scope.selectedDiagnosisTypName = $scope.GetDiagnosisTypeList[1].DiagnosisTypeName;
    $scope.changeSubTab = function (val) {
        $scope.SubTab = val;
    };

    function GetEyeName(SelectedEye) {
        if (SelectedEye === 1 || SelectedEye === "1") {
            return "OD";
        }
        if (SelectedEye === 2 || SelectedEye === "2") {
            return "OS";
        }
        if (SelectedEye === 3 || SelectedEye === "3") {
            return "OU";
        }
        if (SelectedEye === 4 || SelectedEye === "4") {
            return "General";
        }
    }

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
        },
        {
            "OrganId": 4,
            "OrganName": "General"
        }
        ];
    };
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    if ($scope.RoleId === 4 || $scope.RoleId === 43 || $scope.RoleId === 1 || $scope.RoleId === 3) {
        $scope.DisplayName = userLoginDetails.displayName;
    }
    //else if ($scope.RoleId === 2 || $scope.RoleId === 59) {
    //    $scope.DisplayName = appointmentinfo.DoctorFullName;
    //}
    else {
        $scope.DisplayName = userLoginDetails.displayName;
    }


    $scope.CustomPrescFrequency = [];
    var mObj = datapersistanceFactory.getItem("masterDataArrays");
    if (mObj.PrescriptionFrequencies !== undefined && mObj.PrescriptionFrequencies.length > 0) {
        $scope.DefaultPrescFrequency = $filter("filter")(mObj.PrescriptionFrequencies, { "FrequencyType": 'D' }, true);
        $scope.CustomPrescFrequency = mObj.PrescriptionFrequencies;
    }
    $scope.ShowTaperDropsInd = false;
    $scope.ShowTaperTabletInd = false;
    $scope.GetOrganNameList = angular.copy($scope.GetOrganName());
    $scope.selectedTaperDropOrganTypeName = $scope.GetOrganNameList[3].OrganName;
    $scope.selectedTaperTabletOrganTypeName = $scope.GetOrganNameList[3].OrganName;

    $scope.GetDiagnosisEasyList = function (val) {
        var object = {
            "LevelType": 'O',
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "UserId": doctorinfo.doctorid,
            "SpecializationId": $scope.SpecializationId,
            "SearchText": val,
            "PageSize": 10,
            "PageNumber": 1,
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID || null
        };
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
    $scope.Diagnosis = [];
    $scope.DiagnosisBlurChange = function (SelectedDiagnosis) {
        $scope.obj.SelectedDiagnosisItem = SelectedDiagnosis;
        $scope.obj.SelectedDiagnosisItem = $scope.obj.SelectedDiagnosisItem || "";
        if ($scope.obj.SelectedDiagnosisItem === "") {
            return;
        }

        var object = {
            "PatientDiagnosisId": 0,
            "SpecializationId": $scope.SpecializationId,
            "OrganId": $scope.SelectedEye,
            "OrganName": GetEyeName($scope.SelectedEye),
            "Teethno": $scope.teethNos,
            "showdiagnosis": false,
            "DiagnosisData": {
                "DiagnosisId": $scope.obj.SelectedDiagnosisItem.DiagnosisId,
                "DiagnosisHistoryId": 0,
                "DiagnosisTypeId": $scope.DiagnosisType,
                "DiagnosisName": $scope.obj.SelectedDiagnosisItem.DiagnosisName,
                "DiagnosisNotes": $scope.obj.SelectedDiagnosisItem.DiagnosisNotes ? $scope.obj.SelectedDiagnosisItem.DiagnosisNotes : '',
                "ActiveInd": "Y",
                "ShowNote": false,
                "ModifiedBy": $scope.DisplayName,
                "ModifiedDt": $scope.DisplayDate
            }
        };
        var i = 0;
        if ($scope.Diagnosis.length > 0) {
            if ($scope.DiagnosisType === 1) {
                i = 0;
                angular.forEach($scope.Diagnosis, function (item) {
                    if (item.DiagnosisData.DiagnosisId === $scope.obj.SelectedDiagnosisItem.DiagnosisId && item.DiagnosisData.DiagnosisTypeId === 1 && item.DiagnosisData.ActiveInd === 'Y') {
                        alertify.error('You have already entered this provisional diagnosis');
                        i++;
                    }
                });
            } else if ($scope.DiagnosisType === 3) {
                i = 0;
                angular.forEach($scope.Diagnosis, function (item) {
                    if (item.DiagnosisData.DiagnosisId === $scope.obj.SelectedDiagnosisItem.DiagnosisId && item.DiagnosisData.DiagnosisTypeId === 3 && item.DiagnosisData.ActiveInd === 'Y') {
                        alertify.error('You have already entered this final diagnosis');
                        i++;
                    }
                });
            }
        }
        if (i === 0) {
            object.DiagnosisData.DiagnosisNotes = "";
            $scope.Diagnosis.push(object);
        }
        $scope.obj.SelectedDiagnosisItem = "";
        $scope.SelectedEye = 4;
        $scope.selectedDiagnosisTypName = $scope.GetDiagnosisTypeList[1].DiagnosisTypeName;
        $scope.selectedOrganTypeName = $scope.GetOrganNameList[3].OrganName;
 
    };


    $scope.InvSpecialityId = 3;
    $scope.GetAllSpecialityInd = 1;
    $scope.SelectedEye = 4;
    $scope.SelectedEyeoptha = 3;
    $scope.changeInvSpeciality = function (item) {
        item = parseInt(item);
        if (item === 0) {
            $scope.InvSpecialityId = 0;
            $scope.SelectedEyeoptha = 4;
            $scope.GetAllSpecialityInd = 0;
            $scope.GetOrganNameListoptha = $filter("filter")($scope.GetOrganNameList, function (item, index) { return item.OrganId === 4 });
            $scope.selectedOrganTypeNameoptha = $scope.GetOrganNameListoptha[0].OrganName;
        }
        else {
            $scope.IsInvestigation = false;
            $scope.InvSpecialityId = 3;
            $scope.SelectedEyeoptha = 3;
            $scope.GetAllSpecialityInd = 1;
            $scope.GetOrganNameListoptha = $filter("filter")($scope.GetOrganNameList, function (item, index) { return item.OrganId !== 4 });
            $scope.selectedOrganTypeNameoptha = $scope.GetOrganNameListoptha[2].OrganName;
        }

    };
    $scope.GetOrganNameListoptha = angular.copy($scope.GetOrganName());
    if ($scope.InvSpecialityId === 3) {
        $scope.GetOrganNameListoptha = $filter("filter")($scope.GetOrganNameList, function (item, index) { return item.OrganId !== 4 });
        $scope.selectedOrganTypeNameoptha = $scope.GetOrganNameListoptha[2].OrganName;
    } else {
        $scope.GetOrganNameListoptha = $filter("filter")($scope.GetOrganNameList, function (item, index) { return item.OrganId === 4 });
        $scope.selectedOrganTypeNameoptha = $scope.GetOrganNameListoptha[0].OrganName;
    }


    $scope.getNewOrgInvestigations = function (SearchText) {
        var params = {
            "InvSpecialityId": $scope.InvSpecialityId,
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "GetAllIndicator": 0,
            "GetAllSpecialityInd": $scope.GetAllSpecialityInd,
            "PageSize": 10,
            "PageNumber": 1,
            "SearchText": SearchText,
        };
        return eHnoteLabService.getOrganizationInvestigationData(params).then(function (resp) {
            if (resp.data.rows !== undefined) {
                $scope.obj.AddInvestigation = false;
                return resp.data.rows.map(function (item) {
                    return item;
                });
            }
            else {
                $scope.obj.AddInvestigation = true;
            }
        });
    };

    $scope.PatientInvestigations = [];
    $scope.Treatments = [];
    $scope.onselectOrgInvestigation = function (InvObject) {

        $scope.obj.SelectedInvestigationItem = InvObject || "";
        if ($scope.obj.SelectedInvestigationItem === "") {
            return;
        }
        var object = {
            "PatientInvestigationId": 0,
            "OrganId": $scope.SelectedEyeoptha.toString(),
            "OrganName": GetEyeName($scope.SelectedEyeoptha),
            "OrgInvestigationId": $scope.obj.SelectedInvestigationItem.OrgInvestigationId,
            "InvestigationId": $scope.obj.SelectedInvestigationItem.InvestigationId,
            "InvestigationName": $scope.obj.SelectedInvestigationItem.InvestigationName,
            "InvestigationNotes": $scope.obj.SelectedInvestigationItem.InvestigationNotes || "",
            "InvestigationInstruction": "",
            "CategoryId": $scope.obj.SelectedInvestigationItem.CategoryId,
            "ActiveInd": 'Y',
            "Teethno": $scope.teethNos,
            "StatusId": $scope.obj.SelectedInvestigationItem.StatusId ? $scope.obj.SelectedInvestigationItem.StatusId : "1",
            "IsTreatmentInvoiced": false,
            "showInvestigationsplancare": false,
            "Type": $scope.Type,
            "Cost": 0,
            "Discount": 0,
            "ShowNote": false,
            "InvSpecialityId": $scope.obj.SelectedInvestigationItem.InvSpecialityId,
            "ImagesData": [],
            "RedoInvestigationInd": false,
            "RedoInvestigationRemarks": "",
            "RedoInvestigationRemarksId": ""
        };

        if (object.InvSpecialityId === 3) {
            $scope.selectedRightEye = object.InvestigationName.includes("OD") || object.InvestigationName.includes("RE") || object.InvestigationName.includes('Right Eye') || object.InvestigationName.includes('R E') || object.InvestigationName.includes('R.E') || object.InvestigationName.includes('od');
            if ($scope.selectedRightEye === true) {
                object.OrganId = '1';
                object.OrganName = 'Right Eye';
            }
            $scope.selectedLeftEye = object.InvestigationName.includes("OS") || object.InvestigationName.includes("LE") || object.InvestigationName.includes('Left Eye') || object.InvestigationName.includes('L E') || object.InvestigationName.includes('L.E') || object.InvestigationName.includes('os');

            if ($scope.selectedLeftEye === true) {
                object.OrganId = '2';
                object.OrganName = 'Left Eye';
            }
            $scope.selectedBothEye = object.InvestigationName.includes("Both EYE") || object.InvestigationName.includes("BE") || object.InvestigationName.includes('Both Eye') || object.InvestigationName.includes('B.E') || (object.InvestigationName.includes("OD") && object.InvestigationName.includes("OS"));

            if ($scope.selectedBothEye === true) {
                object.OrganId = '3';
                object.OrganName = 'Both Eye';
            }
            if ($scope.selectedRightEye === true && $scope.selectedLeftEye === true) {
                object.OrganId = '3';
                object.OrganName = 'Both Eye';
            }

        }

        //$scope.ChangeOrganInvestigation(object);
        var i = 0;
        if ($scope.PatientInvestigations.length > 0) {
            angular.forEach($scope.PatientInvestigations, function (item) {
                if (item.InvestigationId === $scope.obj.SelectedInvestigationItem.InvestigationId && item.ActiveInd === 'Y') {
                    alertify.error('You already entered this Investigation');
                    i++;
                    return false;
                }
            });
        }
        if (i === 0) {
            $scope.PatientInvestigations.push(object);
        }
        $scope.SuggestionInvestigationObject = "";

        $scope.selectedOrgInvObj = "";
        $scope.InvSpecialityId = InvObject.InvSpecialityId;
        $scope.GetAllSpecialityInd = InvObject.GetAllSpecialityInd;
        $scope.obj.SelectedInvestigationItem = "";
    };


    $scope.RemovePatientInvestigation = function (item, index) {
        if (item.PatientInvestigationId === 0) {
            $scope.PatientInvestigations.splice(index, 1);
        } else {
            var ind = $scope.PatientInvestigations.findIndex(x => x.PatientInvestigationId === item.PatientInvestigationId);
            $scope.PatientInvestigations[ind].ActiveInd = "N";
        }
    
    };


    $scope.RemoveTreatment = function (index, item) {
        if (item.TreatmentData.TreatmentHistoryId === 0) {
            $scope.Treatments.splice(index, 1);
        } else {
            item.TreatmentData.ActiveInd = "N";
        }
        if ($scope.Treatments.length > 0) {
            $scope.showHideTreatmentsdiv = true;
            $scope.showHideTreatmentsdiv = $filter("filter")($scope.Treatments, function (item) {
                return item.TreatmentData.ActiveInd === "Y";
            }).length > 0 ? true : false;
        }
       
    };

    $scope.getTreatments = function (val, ProcedureTypeId) {
        var object = {
            "LevelType": "O",
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "UserId": doctorinfo.doctorid,
            "SpecializationId": $scope.SpecializationId,
            "SearchText": val,
            "PageSize": 10,
            "PageNumber": 1,
            "ProcedureTypeId": ProcedureTypeId,
            "AllBranchInd": 0
        };
        return eHnoteSettingsDataService.GetMasterProcedures(object).then(function (response) {
            if (response.data.count !== 0) {
                if (response.data.ProcedureList !== undefined) {
                    $scope.obj.AddTreatment = false;

                    return response.data.ProcedureList.map(function (item) {
                        return item;
                    });
                } else {
                    $scope.obj.AddTreatment = true;
                }
            } else {
                $scope.obj.AddTreatment = true;
            }
        });
    };

    function addNewItemToCache(subArray, mainArrayName, newobj) {
        var mObj = datapersistanceFactory.getItem('masterDataArrays');
        if (mObj[mainArrayName] === undefined) {
            mObj[mainArrayName] = [];
        }
        mObj[mainArrayName].unshift(newobj);
        loginCookieFactory.set('masterDataArrays', mObj);
    }

    $scope.AddNewTreatment = function (TreatmentObject) {
        TreatmentObject = TreatmentObject || "";
        var cost = $scope.Generalcost || 0;
        if (TreatmentObject === "") {
            alertify.error("Enter Procedure name");
            return;
        }

        $scope.masterProcedureObj = {
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "UserId": doctorinfo.doctorid,
            "ProcedureId": 0,
            "ProcedureName": TreatmentObject,
            "ProcedureNotes": "",
            "SpecializationId": $scope.SpecializationId,
            "ProcedureGeneralCost": parseFloat(cost),
            "ProcedureCgsCost": 0,
            "ProcedureCgsValue": "",
            "CgsType": "true",
            "ProcedureSgsCost": 0,
            "ProcedureSgsValue": "",
            "SgsType": "true",
            "ProcedurePvtInsuranceCost": 0,
            "ProcedurePvtInsuranceValue": "",
            "PvtInsType": "true",
            "ProcedureTypeId": 1,
            "ActiveInd": "Y",
            "OrgProcedureId": 0
        };
        eHnoteSettingsDataService.AddUpdateMasterProcedures($scope.masterProcedureObj).success(function (response) {
            if (response.status === 'Success') {
                if (response.ProcedureList.length > 0) {
                    var patientTypeCost = "";

                    if ($scope.PatientTypeId === 1) {
                        patientTypeCost = parseFloat(response.ProcedureList[0].ProcedureGeneralCost);
                    }
                    else if ($scope.PatientTypeId === 2) {
                        if (response.ProcedureList[0].ProcedureCgsCost !== 0) {
                            patientTypeCost = parseFloat(response.ProcedureList[0].ProcedureCgsCost);
                        } else {
                            patientTypeCost = parseFloat(response.ProcedureList[0].ProcedureGeneralCost);
                        }
                    }
                    else if ($scope.PatientTypeId === 3) {
                        if (response.ProcedureList[0].ProcedureSgsCost !== 0) {
                            patientTypeCost = parseFloat(response.ProcedureList[0].ProcedureSgsCost);
                        } else {
                            patientTypeCost = parseFloat(response.ProcedureList[0].ProcedureGeneralCost);
                        }
                    }

                    else if ($scope.PatientTypeId === 4) {
                        if (response.ProcedureList[0].ProcedureInsuranceCost !== 0) {
                            patientTypeCost = parseFloat(response.ProcedureList[0].ProcedureInsuranceCost);
                        } else {
                            patientTypeCost = parseFloat(response.ProcedureList[0].ProcedureGeneralCost);
                        }
                    }

                      var object = {
                            "PatientTreatmentId": 0,
                            "SpecializationId": $scope.SpecializationId,
                            "OrganId": $scope.SelectedEye,
                            "OrganName": GetEyeName($scope.SelectedEye),
                            "Teethno": $scope.teethNos,
                            "TreatmentData": {
                                "TreatmentHistoryId": 0,
                                "ProcedureId": response.ProcedureList[0].ProcedureId,
                                "TreatmentName": response.ProcedureList[0].ProcedureName,
                                "TreatmentNotes": "",
                                "ProcedureMaxCost": patientTypeCost,
                                "TreatmentCost": patientTypeCost,
                                "Multiplyfactor": 1,
                                "DiscountCost": 0,
                                "TreatmentStatus": "1",
                                "discountValue": "",
                                "discountType": "A",
                                "TreatmentDiscountAmt": 0,
                                "ShowNote": false,
                                "TreatmentFinalCost": patientTypeCost,
                                "RecommendedForSurgery": "N",
                                "SurgeryData": {},
                                "SurgeryStatusId": 0,
                                "TotalSittings": 0,
                                "ActiveInd": "Y",
                                "ModifiedBy": $scope.DisplayName,
                                "ModifiedDt": $scope.DisplayDate,
                                "RedoTreatmentInd": false,
                                "RedoTreatmentRemarks": ""
                            }
                        };
                        $scope.Treatments.push(object);

                    //if ($scope.flagType === 'surgery') {
                    //    $scope.SurgeryObject = "";
                    //    $scope.newSurgeryObj = {
                    //        "ProcedureId": response.ProcedureList[0].ProcedureId,
                    //        "ProcedureName": response.ProcedureList[0].ProcedureName,
                    //        "ProcedureNotes": response.ProcedureList[0].ProcedureNotes,
                    //        "ProcedureGeneralCost": response.ProcedureList[0].ProcedureGeneralCost,
                    //        "ProcedureCgsCost": response.ProcedureList[0].ProcedureCgsCost,
                    //        "ProcedureSgsCost": response.ProcedureList[0].ProcedureSgsCost,
                    //        "ProcedureInsuranceCost": response.ProcedureList[0].ProcedureInsuranceCost,
                    //        "ProcedureTypeId": response.ProcedureList[0].ProcedureTypeId,
                    //        "ProcedureTypeName": response.ProcedureList[0].ProcedureTypeName,
                    //        "SpecializationId": $scope.SpecializationId,
                    //        "UserId": response.ProcedureList[0].UserId,
                    //        "ActiveInd": response.ProcedureList[0].ActiveInd
                    //    };
                    //    $scope.newSurgeryObj.Organ = "3";
                    //    $scope.newSurgeryObj.Surgeon = doctorinfo.doctordata.User[0].FullName;
                    //    $scope.newSurgeryObj.SurgeonId = doctorinfo.doctorid;
                    //    $scope.newSurgeryObj.SurgeonItem = {
                    //        "FullName": doctorinfo.doctordata.User[0].FullName,
                    //        "Sequence": 1,
                    //        "DoctorID": doctorinfo.doctorid,
                    //        "EmailId": doctorinfo.doctordata.User[0].UserEmailId,
                    //        "MobileNo": doctorinfo.doctordata.UserPhone[0].PhNumber,
                    //        "CountryCode": "91",
                    //        "Gender": doctorinfo.doctordata.User[0].Gender,
                    //        "UserBranchId": doctorinfo.doctordata.UserAddress[0].UserBranchId,
                    //        "Active": doctorinfo.doctordata.UserAddress[0].Active,
                    //        "SpecializationId": doctorinfo.doctordata.User[0].SpecializationId,
                    //        "MinPerCase": doctorinfo.doctordata.UserAddress[0].ExtDetails.MinPerCase,
                    //        "RoleId": doctorinfo.RoleID
                    //    };

                    //    $scope.newSurgeryObj.Anesthesist = "";
                    //    $scope.newSurgeryObj.AnesthesistId = "";
                    //    $scope.newSurgeryObj.AnesthesistItem = "";
                    //    $scope.newSurgeryObj.Counselor = "";
                    //    $scope.newSurgeryObj.CounselorId = "";
                    //    $scope.newSurgeryObj.CounselorItem = "";
                    //    $scope.newSurgeryObj.CounselorInstructions = "";
                    //    $scope.newSurgeryObj.SurgeryStatus = "1";
                    //    $scope.newSurgeryObj.SurgeryStatusId = 1;
                    //    $scope.newSurgeryObj.showCounselorInst = "";
                    //    $scope.newSurgeryObj.SurgerySuggestedDate = $filter("date")(new Date(), "dd-MMM-yyyy");
                    //    $scope.showSurgeryOperationDiv = true;
                    //} else {
                    //    var object = {
                    //        "PatientTreatmentId": 0,
                    //        "SpecializationId": $scope.SpecializationId,
                    //        "OrganId": $scope.SelectedEye,
                    //        "OrganName": GetEyeName($scope.SelectedEye),
                    //        "Teethno": $scope.teethNos,
                    //        "TreatmentData": {
                    //            "TreatmentHistoryId": 0,
                    //            "ProcedureId": response.ProcedureList[0].ProcedureId,
                    //            "TreatmentName": response.ProcedureList[0].ProcedureName,
                    //            "TreatmentNotes": "",
                    //            "ProcedureMaxCost": patientTypeCost,
                    //            "TreatmentCost": patientTypeCost,
                    //            "Multiplyfactor": 1,
                    //            "DiscountCost": 0,
                    //            "TreatmentStatus": "1",
                    //            "discountValue": "",
                    //            "discountType": "A",
                    //            "TreatmentDiscountAmt": 0,
                    //            "ShowNote": false,
                    //            "TreatmentFinalCost": patientTypeCost,
                    //            "RecommendedForSurgery": "N",
                    //            "SurgeryData": {},
                    //            "SurgeryStatusId": 0,
                    //            "TotalSittings": 0,
                    //            "ActiveInd": "Y",
                    //            "ModifiedBy": $scope.DisplayName,
                    //            "ModifiedDt": $scope.DisplayDate,
                    //            "RedoTreatmentInd": false,
                    //            "RedoTreatmentRemarks": ""
                    //        }
                    //    };
                    //    $scope.cacheStorageItem.Treatments.push(object);
                    //    calculateTreatSums();
                    //}
                    addNewItemToCache('treatmentList', 'masterProceduresArray', response.ProcedureList[0]);
                    $scope.TreatmentObject = "";
                    $scope.Generalcost = "";
                    $scope.obj.AddTreatment = false;
                    alertify.success("Successfully Added");
                    $scope.obj.SelectedTreatments = "";
                    //modelIntance.dismiss('cancel');
                }
                $scope.obj.AddTreatment = false;
            }

            if (response.status === 'Failure') {
                if (response.Message === 'ProcedureName Already Exists') {
                    alertify.error("ProcedureName already exist");
                    $scope.TreatmentObject = "";
                    $scope.Generalcost = "";
                }
            }
        })
            .error(function (error) {
                alertify.error("Error Occured");
            });
    };


    $scope.RemoveDiagnosis = function (item) {
        if (item.PatientDiagnosisId === 0) {
            var index = $scope.Diagnosis.indexOf(item);
            if (index > -1) {
                $scope.Diagnosis.splice(index, 1);
            }
        } else {
            item.DiagnosisData.ActiveInd = "N";
        }
    };

    $scope.TreatMentChange = function (TreatmentObject) {
        TreatmentObject = TreatmentObject || "";
    };

    $scope.changediagorgan = function (diag, item) {
        diag = parseInt(diag);
        if (diag === 1 || diag === "1") {
            item.DiagnosisData.OrganName = "Right Eye";
        }
        if (diag === 2 || diag === "2") {
            item.DiagnosisData.OrganName = "Left Eye";
        }
        if (diag === 3 || diag === "3") {
            item.DiagnosisData.OrganName = "Both Eyes";
        }
        if (diag === 4 || diag === "4") {
            item.DiagnosisData.OrganName = "General";
        }
        item.OrganId = diag;
   
    };

   

    $scope.ChangeOrganInvestigation = function (item) {
        item.OrganId = item.OrganId.toString();
        if (item.OrganId === "1") {
            item.OrganName = "Right Eye";
        }
        else if (item.OrganId === "2") {
            item.OrganName = "Left  Eye";
        }
        else if (item.OrganId === "3") {
            item.OrganName = "Both  Eye";
        }
        else if (item.OrganId === "4") {
            item.OrganName = "General";
        }
    };

    $scope.ChangeDiagnosisTypeId = function (diag, item) {
        diag.DiagnosisData.DiagnosisTypeId = item;
    };

    $scope.bindDurationType = function (item, val) {
        item.PrescriptionData.DurationType = val;
        item.PrescriptionData.DurationTypeName = val === "Y" ? "Years(s)" : (val === "C" ? "To Be continued" : (val === "M" ? "Month(s)" : (val === "D" ? "Day(s)" : (val === "W" ? "Week(s)" : (val === "L" ? "Life Time" : "")))));
        if (item.PrescriptionData.DurationType === 'L') {
            item.PrescriptionData.Duration = "";
        }
        else if (item.PrescriptionData.DurationType === 'C') {
            item.PrescriptionData.Duration = "";
        }
        
    };

    $scope.changeprocess = function (treatment, item) {
        treatment = parseInt(treatment);
        if (treatment === 1) {
            item.OrganName = "Right Eye";
        }
        if (treatment === 2) {
            item.OrganName = "Left Eye";
        }
        if (treatment === 3) {
            item.OrganName = "Both Eyes";
        }
        if (treatment === 4) {
            item.OrganName = "General";
        }
        item.OrganId = treatment;
      
    };

    $scope.PushfreqTreatment = function (item) {

        $scope.obj.SelectedTreatments = item;
        var cost = "";
        $scope.obj.SelectedTreatments.IsProcedureCostdisable = true;
        if ($scope.obj.SelectedTreatments.ProcedureGeneralCost === undefined || $scope.obj.SelectedTreatments.ProcedureGeneralCost === null) {
            $scope.obj.SelectedTreatments.ProcedureGeneralCost = 0;
        }
        if ($scope.PatientTypeId === 1) {
            cost = $scope.obj.SelectedTreatments.ProcedureGeneralCost;

            if (cost === 0) {
                $scope.obj.SelectedTreatments.IsProcedureCostdisable = false;
            }
        } else if ($scope.PatientTypeId === 2) {
            if ($scope.obj.SelectedTreatments.ProcedureCgsCost !== undefined && $scope.obj.SelectedTreatments.ProcedureCgsCost !== 0) {
                cost = $scope.obj.SelectedTreatments.ProcedureCgsCost;
            } else {
                cost = $scope.obj.SelectedTreatments.ProcedureGeneralCost;
                if (cost === 0) {
                    $scope.obj.SelectedTreatments.IsProcedureCostdisable = false;
                }
            }
        } else if ($scope.PatientTypeId === 3) {
            if ($scope.obj.SelectedTreatments.ProcedureSgsCost !== undefined && $scope.obj.SelectedTreatments.ProcedureSgsCost !== 0) {
                cost = $scope.obj.SelectedTreatments.ProcedureSgsCost;
            } else {
                cost = $scope.obj.SelectedTreatments.ProcedureGeneralCost;
                if (cost === 0) {
                    $scope.obj.SelectedTreatments.IsProcedureCostdisable = false;
                }
            }
        } else if ($scope.PatientTypeId === 4) {
            if ($scope.obj.SelectedTreatments.ProcedureInsuranceCost !== undefined && $scope.obj.SelectedTreatments.ProcedureInsuranceCost !== 0) {
                cost = $scope.obj.SelectedTreatments.ProcedureInsuranceCost;
            } else {
                cost = item.ProcedureGeneralCost;
                if (cost === 0) {
                    $scope.obj.SelectedTreatments.IsProcedureCostdisable = false;
                }
            }
        }

        var object = {
            "PatientTreatmentId": 0,
            "SpecializationId": $scope.SpecializationId,
            "OrganId": $scope.SelectedEye.toString(),
            "OrganName": GetEyeName($scope.SelectedEye),
            "Teethno": $scope.teethNos,
            "showProceduresTreatments": false,
            "TreatmentData": {
                "TreatmentHistoryId": 0,
                "ProcedureId": $scope.obj.SelectedTreatments.ProcedureId,
                "TreatmentName": $scope.obj.SelectedTreatments.ProcedureName,
                "TreatmentNotes": $scope.obj.SelectedTreatments.ProcedureNotes || "",
                "ProcedureMaxCost": cost || "",
                "TreatmentCost": cost,
                "Multiplyfactor": 1,
                "DiscountCost": 0,
                "TreatmentStatus": "1",
                "discountValue": "",
                "discountType": "P",
                "TreatmentDiscountAmt": 0,
                "ShowNote": false,
                "TreatmentFinalCost": cost,
                "RecommendedForSurgery": "N",
                "SurgeryData": {},
                "SurgeryStatusId": 0,
                "TotalSittings": 0,
                "ActiveInd": 'Y',
                "IsTreatmentInvoiced": false,
                "IsProcedureCostdisable": $scope.obj.SelectedTreatments.IsProcedureCostdisable,
                "ModifiedBy": $scope.DisplayName,
                "ModifiedDt": $scope.DisplayDate,
                "RedoTreatmentInd": false,
                "RedoTreatmentRemarks": ""
            }
        };

        var i = 0;
        if ($scope.Treatments.length > 0) {
            angular.forEach($scope.Treatments, function (initem) {
                if (initem.TreatmentData.ProcedureId === item.ProcedureId && initem.TreatmentData.ActiveInd === "Y") {
                    alertify.error('You have already entered this Procedure');
                    i++;
                }
            });
        }
        if (i === 0) {
            $scope.showHideTreatmentsdiv = true;
            $scope.Treatments.push(object);
        }
        $scope.TreatmentObject = "";
       // $scope.ChangeTreatMentBilling("");
        $("#ulTreat").css("background-color", "#e5e5e5");
        $timeout(function () {
            $("#ulTreat").focus();
            $("#ulTreat").css("background-color", "#fff");
        }, 100);

        $scope.obj.SelectedTreatments.ProcedureName = "";
        $scope.obj.SelectedTreatments = "";
        // $scope.DiaFocusTreatment = false;
        $scope.SelectedEye = 4;
        $scope.selectedTreatmentOrganTypeName = $scope.GetOrganNameList[3].OrganName;
    };
    $scope.ConsultationTreatments = [];
    $scope.changefromisGlassPrescribed = function (isGlassPrescribed) {
        $scope.obj.isGlassPrescribed = isGlassPrescribed;
        if ($scope.obj.isGlassPrescribed) {
            if ($scope.ConsultationTreatments.length > 0) {
                var List = $filter("filter")($scope.ConsultationTreatments, { "TreatmentName": 'Glass/Lens prescribed', "ActiveInd": 'Y' }, true);
                if (List.length > 0) {
                    alertify.error('You have already entered this Glass/Lens');
                    return;
                }
                else {
                    var object = {
                        "PatientTreatmentId": 0,
                        "TreatmentName": "Glass/Lens prescribed",
                        "ActiveInd": "Y",
                        "ModifiedBy": $scope.DisplayName,
                        "ModifiedDt": $scope.DisplayDate
                    };
                    $scope.ConsultationTreatments.push(object);
                }
            }
            else {
                var object = {
                    "PatientTreatmentId": 0,
                    "TreatmentName": "Glass/Lens prescribed",
                    "ActiveInd": "Y",
                    "ModifiedBy": $scope.DisplayName,
                    "ModifiedDt": $scope.DisplayDate
                };
                $scope.ConsultationTreatments.push(object);
            }
        }
        else {
            if ($scope.ConsultationTreatments.length > 0) {
                var List = $filter("filter")($scope.ConsultationTreatments, { "TreatmentName": 'Glass/Lens prescribed', "ActiveInd": 'Y' }, true);
                if (List.length > 0) {
                    var index = $scope.ConsultationTreatments.indexOf(List[0]);
                    if (List[0].PatientTreatmentId === 0) {
                        if (index > -1) {
                            $scope.ConsultationTreatments.splice(index, 1);
                        }
                    } else {
                        $scope.ConsultationTreatments[index].ActiveInd = 'N';
                    }
                  
                }
            }
        }

    };
    $scope.changefromisRxPrescribed = function (isRxPrescribed) {
        $scope.obj.isRxPrescribed = isRxPrescribed;
        if ($scope.obj.isRxPrescribed) {
            if ($scope.ConsultationTreatments.length > 0) {
                var List = $filter("filter")($scope.ConsultationTreatments, { "TreatmentName": 'Rx prescribed', "ActiveInd": 'Y' }, true);
                if (List.length > 0) {
                    alertify.error('You have already entered this Glass/Lens');
                    return;
                }
                else {
                    var object = {
                        "PatientTreatmentId": 0,
                        "TreatmentName": "Rx prescribed",
                        "ActiveInd": "Y",
                        "ModifiedBy": $scope.DisplayName,
                        "ModifiedDt": $scope.DisplayDate
                    };
                    $scope.ConsultationTreatments.push(object);
                }
            }
            else {
                var object = {
                    "PatientTreatmentId": 0,
                    "TreatmentName": "Rx prescribed",
                    "ActiveInd": "Y",
                    "ModifiedBy": $scope.DisplayName,
                    "ModifiedDt": $scope.DisplayDate
                };
                $scope.ConsultationTreatments.push(object);
            }
        }
        else {
            if ($scope.ConsultationTreatments.length > 0) {
                var List = $filter("filter")($scope.ConsultationTreatments, { "TreatmentName": 'Rx prescribed', "ActiveInd": 'Y' }, true);
                if (List.length > 0) {
                    var index = $scope.ConsultationTreatments.indexOf(List[0]);
                    if (List[0].PatientTreatmentId === 0) {
                        if (index > -1) {
                            $scope.ConsultationTreatments.splice(index, 1);
                        }
                    } else {
                        $scope.ConsultationTreatments[index].ActiveInd = 'N';
                    }
              
                }
            }
        }

    };
    $scope.changefromisSurgeriesPrescribed = function (isSurgeriesPrescribed) {
        $scope.obj.isSurgeriesPrescribed = isSurgeriesPrescribed;
        if ($scope.obj.isSurgeriesPrescribed) {
            if ($scope.ConsultationTreatments.length > 0) {
                var List = $filter("filter")($scope.ConsultationTreatments, { "TreatmentName": 'Procedure/Surgeries prescribed', "ActiveInd": 'Y' }, true);
                if (List.length > 0) {
                    alertify.error('You have already entered this Glass/Lens');
                    return;
                }
                else {
                    var object = {
                        "PatientTreatmentId": 0,
                        "TreatmentName": "Procedure/Surgeries prescribed",
                        "ActiveInd": "Y",
                        "ModifiedBy": $scope.DisplayName,
                        "ModifiedDt": $scope.DisplayDate
                    };
                    $scope.ConsultationTreatments.push(object);
                }
            }
            else {
                var object = {
                    "PatientTreatmentId": 0,
                    "TreatmentName": "Procedure/Surgeries prescribed",
                    "ActiveInd": "Y",
                    "ModifiedBy": $scope.DisplayName,
                    "ModifiedDt": $scope.DisplayDate
                };
                $scope.ConsultationTreatments.push(object);
            }
        }
        else {
            if ($scope.ConsultationTreatments.length > 0) {
                var List = $filter("filter")($scope.ConsultationTreatments, { "TreatmentName": 'Procedure/Surgeries prescribed', "ActiveInd": 'Y' }, true);
                if (List.length > 0) {
                    var index = $scope.ConsultationTreatments.indexOf(List[0]);
                    if (List[0].PatientTreatmentId === 0) {
                        if (index > -1) {
                            $scope.ConsultationTreatments.splice(index, 1);
                        }
                    } else {
                        $scope.ConsultationTreatments[index].ActiveInd = 'N';
                    }
                    
                }
            }
        }
    };

    $scope.RemoveConsultationTreatment = function (obs) {
        var index = $scope.ConsultationTreatments.indexOf(obs);
        if (obs.TreatmentName === 'Glass/Lens prescribed') {
            $scope.obj.isGlassPrescribed = false;
        }
        if (obs.TreatmentName === 'Rx prescribed') {
            $scope.obj.isRxPrescribed = false;
        }
        if (obs.TreatmentName === 'Procedure/Surgeries prescribed') {
            $scope.obj.isSurgeriesPrescribed = false;
        }
        if (obs.PatientTreatmentId === 0) {
            if (index > -1) {
                $scope.ConsultationTreatments.splice(index, 1);
            }
        } else {
            $scope.ConsultationTreatments[index].ActiveInd = 'N';
        }
     
    };

    $scope.addNewOrgInv = function (SelectedInvestigationItem) {
        $scope.newInvReqObject.InvestigationName = SelectedInvestigationItem || "";
        $scope.modelInvIntance = $uibModal.open({
            "size": 'md',
            "templateUrl": 'InvNewpopup.html',
            "scope": $scope,
            "backdrop": "static",
            "keyboard": false
        });
    };

    $scope.AddNewConsultationTreatment = function (TreatmentObject) {
        var object = {
            "PatientTreatmentId": 0,
            "TreatmentName": TreatmentObject,
            "ActiveInd": "Y",
            "ModifiedBy": $scope.DisplayName,
            "ModifiedDt": $scope.DisplayDate
        };

        $scope.ConsultationTreatments.push(object);
        $scope.obj.SelectedConsultationTreatment = "";
    };
    $scope.GetMedicines = function (text) {
        text = text || "";        
        var object = {
            "LevelType": "G",
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalId,
            "UserId": doctorinfo.doctorid,
            "SpecializationId": $scope.SpecializationId,
            "SearchText": text,
            "PageSize": 10,
            "PageNumber": 1,
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID || null,
        };
        return eHnoteSettingsDataService.GetMasterMedicines(object).then(function (response) {
            if (response.data.count !== 0) {
                if (response.data.MedicineList !== undefined) {                   
                    return response.data.MedicineList.map(function (item) {
                        return item;
                    });
                } 
            } 
        });

    };
    $scope.GetTaperMedicines = function (text, typeid) {
        text = text || "";       
        var object = {
            "LevelType": "G",
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalId,
            "UserId": doctorinfo.doctorid,
            "SpecializationId": $scope.SpecializationId,
            "SearchText": text,
            "PageSize": 10,
            "PageNumber": 1,
            "MedicineTypeId": typeid,
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID || null,
        };
        return eHnoteSettingsDataService.GetMasterMedicines(object).then(function (response) {
            if (response.data.count !== 0) {
                if (response.data.MedicineList !== undefined) {                    
                    return response.data.MedicineList.map(function (item) {
                        return item;
                    });
                } 
            }
        });

    };
    $scope.ChangeTaperTabletEye = function (item) {
        $scope.SelectedEye = item.OrganId;
        $scope.selectedTaperTabletOrganTypeName = item.OrganName;
    };
    $scope.ChangeTaperDropEye = function (item) {
        $scope.SelectedEye = item.OrganId;
        $scope.selectedTaperDropOrganTypeName = item.OrganName;
    };
    $scope.Prescriptions = [];
    $scope.PushfreqMedicalItems = function (item) {

        var frqobject = $filter("filter")($scope.CustomPrescFrequency, { "FrequencyId": 18 }, true)[0];

        var object = {
            "PrescriptionId": 0,
            "PrescriptionType": "GenericMedicine",
            "PrescriptionData": {
                "PrescriptionHistoryId": 0,
                "Id": item.MedicineId,
                "Name": item.MedicineName,
                "MedicineGenericName": item.GenericName,
                "Dosage": "1",          
                "TypeOfDosage": "Default",
                "Dosage1": "",
                "Dosage2": "",
                "Dosage3": "",
                "FrequencyObj": frqobject,
                "Frequency": frqobject.Name,
                "FrequencyId": frqobject.FrequencyId,
                "FrequencyEnglish": "",
                "FrequencyHindhi": "",
                "FrequencyTelugu": "",
                "FrequencyMarathi": "",
                "FrequencyKannada": "",
                "Frequencypanjab": "",
                "FrequencyTamil": "",
                "PrintNote": "",
                "Intake": "2",
                "Duration": "",
                "DurationType": "D",
                "DurationTypeName": "Day(s)",
                "MedicineType": 1,
                "OrganId": $scope.SelectedEye,
                "OrganName": GetEyeName($scope.SelectedEye),
                "Teethno": $scope.teethNos,
                "Notes": item.Notes,
                "ActiveInd": "Y",
                "Instructions": item.Instructions,
                "InstructionsLanguage": item.InstructionsLanguage || [],
                "ShowInstruction": false,
                "ModifiedBy": $scope.DisplayName,
                "ModifiedDt": $scope.DisplayDate,
                "TaperingArray": []
            }
        };

        var hindhiobj = $filter("filter")(object.PrescriptionData.FrequencyObj.languages, { "Language": 'hi' })[0];
        object.PrescriptionData.FrequencyHindhi = hindhiobj ? hindhiobj.translateName : '';
        var englishobj = $filter("filter")(object.PrescriptionData.FrequencyObj.languages, { "Language": 'en' })[0];
        object.PrescriptionData.FrequencyEnglish = englishobj ? englishobj.translateName : '';
        var englishobj = $filter("filter")(object.PrescriptionData.FrequencyObj.languages, { "Language": 'te' })[0];
        object.PrescriptionData.FrequencyTelugu = englishobj ? englishobj.translateName : '';

        var martiobj = $filter("filter")(object.PrescriptionData.FrequencyObj.languages, { "Language": 'mr' })[0];
        object.PrescriptionData.FrequencyMarathi = martiobj ? martiobj.translateName : '';

        var kannadaobj = $filter("filter")(object.PrescriptionData.FrequencyObj.languages, { "Language": 'kn' })[0];
        object.PrescriptionData.FrequencyKannada = kannadaobj ? kannadaobj.translateName : '';

        var panjabobj = $filter("filter")(object.PrescriptionData.FrequencyObj.languages, { "Language": 'pa' })[0];
        object.PrescriptionData.Frequencypanjab = panjabobj ? panjabobj.translateName : '';

        var tamilobj = $filter("filter")(object.PrescriptionData.FrequencyObj.languages, { "Language": 'ta' })[0];
        object.PrescriptionData.FrequencyTamil = tamilobj ? tamilobj.translateName : '';

        var i = 0;
        if ($scope.Prescriptions.length > 0) {
            angular.forEach($scope.Prescriptions, function (initem) {
                if (initem.PrescriptionData.Id === item.MedicineId && initem.PrescriptionData.ActiveInd === "Y") {
                    alertify.error('You have already entered this medicine');
                    i++;
                }
            });
        }
        if (i === 0) {
            $scope.showHideprescriptiondiv = true;
            $scope.Prescriptions.push(object);
        }
        $scope.medicineGetObj.MedicineObject = "";    
        item.MedicineName = "";
        item = "";
        //$scope.DiaFocusMedicine = false;
    };

    $scope.PushTaperDropItems = function (item) {
        var finalobj = {
            "PrescriptionId": 0,
            "PrescriptionType": "TaperDrop",
            "PrescriptionData": {
                "PrescriptionHistoryId": 0,
                "OrganId": $scope.SelectedEye,
                "OrganName": GetEyeName($scope.SelectedEye),
                "Id": item.MedicineId,
                "Name": item.MedicineName,
                //"MedicineType": item.MedicineTypeId,
                "MedicineType": item.MedicineType,
                "ActiveInd": 'Y',
                "TaperingArray": [{
                    "TaperMedicineId": 0,
                    "Frequency1": "One drop",
                    "Dosage": "",
                    "Frequency2": "times a day for",
                    "Duration": "",
                    "DurationType": "D",
                    "DurationTypeName": "Day(s)",
                    "ActiveInd": "Y",
                    "SNo": 0
                }]
            }
        };
      
        var i = 0;
        if ($scope.Prescriptions.length > 0) {
            angular.forEach($scope.Prescriptions, function (initem) {
                if (initem.PrescriptionData.Id === item.MedicineId && initem.PrescriptionData.ActiveInd === "Y") {
                    alertify.error('You have already entered this medicine');
                    i++;
                }
            });
        }
        if (i === 0) {
            $scope.Prescriptions.push(finalobj);
        }
        $scope.medicineTaperDropObj.SearchText = "";
        $scope.SelectedEye = 4;
        $scope.SelectedEyeObj = $scope.GetOrganNameList[3];
        $scope.selectedTaperDropOrganTypeName = $scope.GetOrganNameList[3].OrganName;
      
        item.MedicineName = "";
        item = "";
    };

    $scope.PushTaperTabletItems = function (item) {
        var frqobject = $filter("filter")($scope.CustomPrescFrequency, { "FrequencyId": 18 })[0];
        var finalobj = {
            "PrescriptionId": 0,
            "PrescriptionType": "TaperTablet",
            "PrescriptionData": {
                "PrescriptionHistoryId": 0,
                "Id": item.MedicineId,
                "Name": item.MedicineName,           
                "MedicineType": item.MedicineType,
                "ActiveInd": 'Y',             
                "TaperingArray": [{
                    "TaperMedicineId": 0,
                    "Dosage": "",
                    "Frequency1": "mg",               
                    "EyeType": {
                        "FrequencyId": frqobject.FrequencyId,
                        "FrequencyCode": frqobject.Code,
                        "FrequencyName": frqobject.Name
                    },
                    "Frequency2": "for",
                    "Duration": "",
                    "DurationType": "D",
                    "DurationTypeName": "Day(s)",
                    "ActiveInd": "Y",
                    "SelectedTaperEyeType": frqobject,
                    "SNo": 0
                }]
            }
        };
        var i = 0;
        if ($scope.Prescriptions.length > 0) {
            angular.forEach($scope.Prescriptions, function (initem) {
                if (initem.PrescriptionData.Id === item.MedicineId && initem.PrescriptionData.ActiveInd === "Y") {
                    alertify.error('You have already entered this medicine');
                    i++;
                }
            });
        }
        if (i === 0) {
            $scope.Prescriptions.push(finalobj);
        }
        $scope.medicineTaperTabletObj.SearchText = "";
        
        item.MedicineName = "";
        item = "";
    };
    $scope.PushTaperFrequencyItems = function (item) {
       
        var obj = {
            "FrequencyId": item.SelectedTaperEyeType.FrequencyId,
            "FrequencyCode": item.SelectedTaperEyeType.Code,
            "FrequencyName": item.SelectedTaperEyeType.Name
        };
        item.EyeType = obj;      

    };

    $scope.changeDosageType = function (item, type, index) {
        item.PrescriptionData.TypeOfDosage = type;
        item.PrescriptionData.Dosage1 = "";
        item.PrescriptionData.Dosage2 = "";
        item.PrescriptionData.Dosage3 = "";
        item.PrescriptionData.Frequency = "";
        item.PrescriptionData.Dosage = "";
        item.PrescriptionData.Duration = "";
        item.PrescriptionData.FrequencyObj = "";
        item.PrescriptionData.TypeOfDosage = type;

        if (type === "Default") {
            var frqobject = { "FrequencyId": 18, "Name": "1-0-1", "FrequencyType": "D", "Code": "0" };
            item.PrescriptionData.FrequencyObj = frqobject;
            item.PrescriptionData.Frequency = frqobject.Name;
            item.PrescriptionData.FrequencyId = frqobject.FrequencyId;
        }
    };

    $scope.ShowTaperDrops = function () {
     //   $scope.isGlobalPrescription = isGlobalPrescription;
        $scope.ShowTaperDropsInd = true;
    };

    $scope.bindTapperingDurationType = function (item, val) {
        item.DurationType = val;
        item.DurationTypeName = val === "Y" ? "Years(s)" : (val === "C" ? "To Be continued" : (val === "M" ? "Month(s)" : (val === "D" ? "Day(s)" : (val === "W" ? "Week(s)" : (val === "L" ? "Life Time" : "")))));
        
    };

    $scope.ShowTaperTablet = function () {
       // $scope.isGlobalPrescription = isGlobalPrescription;
        $scope.ShowTaperTabletInd = true;
    };

    $scope.AddDrops = function (item, index) {
        var Dosage2 = "";
        var Dosage = 0;
        item[index].Dosage = parseInt(item[index].Dosage) || "";
        Dosage = item[index].Dosage;
        if (Dosage > 10) {
            return;
        }
        if (Dosage === 10) {
            Dosage2 = (Dosage) - 2;
        }
        if (Dosage === 8) {
            Dosage2 = (Dosage) - 2;
        }
        if (Dosage === 6) {
            Dosage2 = (Dosage) - 1;
        }
        if (Dosage === 5) {
            Dosage2 = (Dosage) - 1;
        }
        if (Dosage === 4) {
            Dosage2 = (Dosage) - 1;
        }
        if (Dosage === 3) {
            Dosage2 = (Dosage) - 1;
        }
        if (Dosage === 2) {
            Dosage2 = (Dosage) - 1;
        }
        if (Dosage === 1) {
            Dosage2 = (Dosage) - 1;
        }

        if (Dosage !== 0 && Dosage !== "" && Dosage !== 1) {
            var obj = {
                "TaperMedicineId": 0,
                "Frequency1": "One drop",
                "Dosage": Dosage2,
                "Frequency2": "times a day for",
                "Duration": parseInt(item[index].Duration),
                "DurationType": item[index].DurationType,
                "DurationTypeName": item[index].DurationTypeName,
                "ActiveInd": 'Y',
                "SNo": parseInt(item[index].SNo) + 1
            };
            item.push(obj);
        }
    }
    $scope.ClearDrops = function (item, ind) {
        if (item.length > 0) {
            angular.forEach(item, function (mitem, index) {
                if (mitem.TaperMedicineId !== 0) {
                    mitem.ActiveInd = 'N';
                }
                else {
                    item.splice(1);
                    console.log(item);
                }
            });
            item[0].ActiveInd = 'Y';
        }
    }

    $scope.RemoveTaperDrop = function (item) {
        if (item.PrescriptionType === 'TaperDrop') {
            var index = $scope.Prescriptions.indexOf(item);
            if (item.PrescriptionData.PrescriptionHistoryId === 0) {
                if (index > -1) {
                    
                    for (var k = 0; k < $scope.Prescriptions.length; k++) {
                        if ($scope.Prescriptions[k].PrescriptionType === "TaperDrop" && $scope.Prescriptions[k].PrescriptionData.Name === item.PrescriptionData.Name) {
                            $scope.Prescriptions.splice(k, 1);
                        }
                    }
                }
            } else {
                item.PrescriptionData.ActiveInd = "N";
                if (item.PrescriptionData.TaperingArray.length > 0) {
                    angular.forEach(item.PrescriptionData.TaperingArray, function (mitem) {
                        mitem.ActiveInd = "N";
                    });
                }
            }
            if ($scope.Prescriptions.length > 0) {
                $scope.showHideprescriptiondiv = true;
                $scope.showHideprescriptiondiv = $filter("filter")($scope.Prescriptions, function (item) {
                    return item.PrescriptionData.ActiveInd === "Y";
                }).length > 0 ? true : false;
            }
           
        }
    };
    $scope.RemoveTaperTablet = function (item) {
        if (item.PrescriptionType === 'TaperTablet') {

            var index = $scope.Prescriptions.indexOf(item);
            if (item.PrescriptionData.PrescriptionHistoryId === 0) {
                if (index > -1) {
                
                    for (var k = 0; k < $scope.Prescriptions.length; k++) {
                        if ($scope.Prescriptions[k].PrescriptionType === "TaperTablet" && $scope.Prescriptions[k].PrescriptionData.Name === item.PrescriptionData.Name) {
                            $scope.Prescriptions.splice(k, 1);
                        }
                    }
                }

            } else {
                item.PrescriptionData.ActiveInd = "N";
                if (item.PrescriptionData.TaperingArray.length > 0) {
                    angular.forEach(item.PrescriptionData.TaperingArray, function (mitem) {
                        mitem.ActiveInd = "N";
                    });
                }
            }
            if ($scope.Prescriptions.length > 0) {
                $scope.showHideprescriptiondiv = true;
                $scope.showHideprescriptiondiv = $filter("filter")($scope.Prescriptions, function (item) {
                    return item.PrescriptionData.ActiveInd === "Y";
                }).length > 0 ? true : false;
            }
            
        }
    };
    $scope.AddTaperingTablet = function (item, index) {
        var Dosage2 = "";
        var Dosage = 0;
        item[index].Dosage = parseInt(item[index].Dosage) || "";
        Dosage = item[index].Dosage;
        if (Dosage === 100) {
            Dosage2 = (Dosage) - 10;
        }
        if (Dosage === 90) {
            Dosage2 = (Dosage) - 10;
        }
        if (Dosage === 80) {
            Dosage2 = (Dosage) - 10;
        }
        if (Dosage === 70) {
            Dosage2 = (Dosage) - 10;
        }
        if (Dosage === 60) {
            Dosage2 = (Dosage) - 10;
        }
        if (Dosage === 50) {
            Dosage2 = (Dosage) - 10;
        }
        if (Dosage === 40) {
            Dosage2 = (Dosage) - 10;
        }
        if (Dosage === 30) {
            Dosage2 = (Dosage) - 10;
        }
        if (Dosage === 20) {
            Dosage2 = (Dosage) - 10;
        }
        if (Dosage === 10) {
            Dosage2 = (Dosage) - 5;
        }
        if (Dosage !== 0 && Dosage !== "" && Dosage !== 5) {
            var obj = {
                "TaperMedicineId": 0,
                "Dosage": Dosage2,
                "Frequency1": "mg",
                "EyeType": item[index].EyeType,
                "Frequency2": "for",
                "Duration": parseInt(item[index].Duration),
                "DurationType": item[index].DurationType,
                "DurationTypeName": item[index].DurationTypeName,
                "ActiveInd": 'Y',
                "SelectedTaperEyeType": item[index].SelectedTaperEyeType,
                "SNo": parseInt(item[index].SNo) + 1
            };
            item.push(obj);
        }
    }
    $scope.ClearTaperingTablets = function (item, ind) {
        if (item.length > 0) {
            angular.forEach(item, function (mitem, index) {
                if (mitem.TaperMedicineId !== 0) {
                    mitem.ActiveInd = 'N';
                }
                else {
                    item.splice(1);
                    console.log(item);
                }
            });
            item[0].ActiveInd = 'Y';
        }
       
    }

    $scope.RemovePrescription = function (index, item) {
        if (item.PrescriptionType === "GenericMedicine") {
            if (item.PrescriptionData.PrescriptionHistoryId === 0) {
         
                for (var k = 0; k < $scope.Prescriptions.length; k++) {
                    if ($scope.Prescriptions[k].PrescriptionType === "GenericMedicine" && $scope.Prescriptions[k].PrescriptionData.Name === item.PrescriptionData.Name) {
                        $scope.Prescriptions.splice(k, 1);
                    }
                }

            } else {
                item.PrescriptionData.ActiveInd = "N";
            }
            if ($scope.Prescriptions.length > 0) {
                $scope.showHideprescriptiondiv = true;
                $scope.showHideprescriptiondiv = $filter("filter")($scope.Prescriptions, function (item) {
                    return item.PrescriptionData.ActiveInd === "Y";
                }).length > 0 ? true : false;
            }
           
        }
    };

    //var obj = [{
    //    "Type": 1,
    //    "TypeName": "Diagnosis",
    //    "Diagnosisarray": $scope.Diagnosis || []
    //},{
    //    "Type": 2,
    //    "TypeName": "Prescription",
    //    "Diagnosisarray": $scope.Diagnosis || []
    //},{
    //    "Type": 3,
    //    "TypeName": "Investigations",
    //    "Diagnosisarray": $scope.PatientInvestigations || []
    //},{
    //    "Type": 4,
    //    "TypeName": "Procedures",
    //    "Diagnosisarray": $scope.Treatments || []
    //},{
    //    "Type": 5,
    //    "TypeName": "Treatments",
    //    "Diagnosisarray": $scope.ConsultationTreatments || []
    //},{
    //    "Type": 6,
    //    "TypeName": "DoctorNotes",
    //    "Diagnosisarray": $scope.Diagnosis || []
    //},{
    //    "Type": 7,
    //    "TypeName": "ClinicalNotes",
    //    "Diagnosisarray": $scope.Diagnosis || []
    //    }]

    function getnewSurgeryMainObj() {
        $scope.object = {
            "PatientSurgeryId": 0,
            "ParentPatientSurgeryId": 0,
            "SpecializationId": $scope.SpecializationId,
            "SurgeryCategoryName": "",
            "SurgeryCategoryId": "",
            "SurgeryCategoryObj": "",
            "OrgSurgeryId": "",
            "SurgeryId": "",
            "SurgeryName": "",
            "FullSurgeryName": "",
            "OrganId": "",
            "OrganName": "",
            "SurgeryGeneralCost": "",
            "SurgeryCgsCost": "",
            "SurgerySgsCost": "",
            "SurgeryInsuranceCost": "",
            "SurgeryTypeId": "",
            "SurgeryTypeName": "",
            "SurgeryDoctorId": "",
            "SurgeryDoctorName": "",
            "SurgeryAnesthesiaDoctorId": "",
            "SurgeryAnesthesiaDoctorName": "",
            "SurgeryCounselorId": "",
            "SurgeryCounselorName": "",
            "showCounselorInst": false,
            "SurgeryInstructions": "",
            "SurgeryStatusId": "",
            "SurgeryStatus": "",
            "SurgerySuggestedDate": "",
            "IolPower": "",
            "ActiveInd": "Y",
            "SurgeryOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
        };

        $scope.object.SurgeryStatusId = 1;

       // var surgeonobj = $filter("filter")($scope.cacheStorageItem.AllDoctorsList, { "DoctorID": appointmentinfo.DoctorID }, true)[0];

      //  $scope.object.SurgeryDoctorName = surgeonobj.FullName;
      //  $scope.object.SurgeryDoctorId = surgeonobj.DoctorID;
        $scope.object.SurgerySuggestedDate = $filter("date")(new Date(), "dd-MMM-yyyy");
        return $scope.object;
    }

    $scope.getOrgSurgeries = function (text) {
        var params = {
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "AllBranchInd": 0,
            "PageSize": 10,
            "PageNumber": 1,
            "SearchText": text,
            "SurgeryCategoryId": null
        };
        return eHnoteSurgeryService.GetOrganizationSurgeries(params, "Get").then(function (response) {
            if (response.data.count !== 0) {
                if (response.data.rows !== undefined) {
                    return response.data.rows.map(function (item) {
                        return item;
                    });
                }
            }
        });

    };
    $scope.onSelectSurgery = function (item) {
        $scope.obj.SelectedSurgeryItem = item;
        var Object = getnewSurgeryMainObj();

        Object.OrgSurgeryId = $scope.obj.SelectedSurgeryItem.OrgSurgeryId;
        Object.SurgeryName = $scope.obj.SelectedSurgeryItem.SurgeryName;
        var cost = 0;
        Object.SurgeryGeneralCost = $scope.obj.SelectedSurgeryItem.ProcedureGeneralCost || 0;
        Object.SurgeryCgsCost = $scope.obj.SelectedSurgeryItem.ProcedureCgsCost || 0;
        Object.SurgerySgsCost = $scope.obj.SelectedSurgeryItem.ProcedureSgsCost || 0;
        Object.ProcedureInsuranceCost = $scope.obj.SelectedSurgeryItem.ProcedurePvtInsuranceCost || 0;
        if ($scope.PatientTypeId === 1) {
            cost = Object.ProcedureGeneralCost;
        } else if ($scope.PatientTypeId === 2) {
            if (Object.ProcedureCgsCost !== 0) {
                cost = Object.ProcedureCgsCost;
            } else {
                cost = Object.ProcedureGeneralCost;
            }
        } else if ($scope.PatientTypeId === 3) {
            if (Object.ProcedureSgsCost !== 0) {
                cost = Object.ProcedureSgsCost;
            } else {
                cost = Object.ProcedureGeneralCost;
            }
        } else if ($scope.PatientTypeId === 4) {
            if (Object.ProcedureInsuranceCost !== 0) {
                cost = Object.ProcedureInsuranceCost;
            } else {
                cost = Object.ProcedureGeneralCost;
            }
        }
        var EyeName = "";
        EyeName = GetEyeName(Object.OrganId);
        if (EyeName === "General") {
            EyeName = "";
        } else {
            EyeName = " for " + EyeName;
        }
        var FullSurgeryName = "";
        FullSurgeryName = Object.SurgeryName + "" + EyeName + " (" + $filter('date')(new Date(), "dd-MMM-yyyy") + ") ";

        Object.FullSurgeryName = FullSurgeryName;
        Object.IsTreatmentInvoiced = false;

        var organFilterArray = $filter("filter")($scope.Surgery, function (initem) {
            return initem.OrgSurgeryId === Object.OrgSurgeryId && initem.ActiveInd === "Y";
        });

        var i = 0;

        if (organFilterArray.length > 0) {
            angular.forEach(organFilterArray, function (initem) {
                if (initem.OrganId != 3) {
                    if (initem.OrganId === Object.OrganId) {
                        alertify.error('You have already added these Surgery');
                        i++;
                        return;
                    }
                } else {
                    alertify.error('You have already added these Surgery');
                    i++;
                    return;
                }
            });
        }

        if (i === 0) {
            if ($filter("filter")($scope.Surgery, { "OrgSurgeryId": Object.OrgSurgeryId }, true).length == 2) {
                alertify.error('You have already added these Surgery');
                return;
            } else {
                $scope.Surgery.push(Object);
            }
        }
        //$scope.AddToCache();
        $scope.obj.SelectedSurgeryItem = "";
    };


    $scope.RemoveSuregry = function (index, item) {
        if (item.PatientSurgeryId === 0) {
            $scope.Surgery.splice(index, 1);
        } else {
            item.ActiveInd = "N";
        }
        if ($scope.Surgery.length > 0) {
            $scope.showHideSurgerydiv = true;
            $scope.showHideSurgerydiv = $filter("filter")($scope.Surgery, function (item) {
                return item.ActiveInd === "Y";
            }).length > 0 ? true : false;
        }
    };
    $scope.changeSurgeryorgan = function (diag, item) {
        diag = parseInt(diag);
        item.OrganId = diag;
    };

    var count=0;
    $scope.SaveDiagnosisTemplates = function () {

        console.log("hydTemplate");

        if ($scope.obj.SelectedTemplateName ==="") {
            alertify.error("Please Enter Template Name");
            return false;
        }
        $scope.FinalSubmitArray = [];
        if ($scope.Diagnosis.length !== 0) {
            var object = {
                "RowID": count++,
                "Type": 1,
                "TypeName": "Diagnosis",
                "Diagnosisarray": $scope.Diagnosis
            };
            $scope.FinalSubmitArray.push(object);
        }
        if ($scope.Prescriptions.length !== 0) {
            var object = {
                "RowID": count++,
                "Type": 2,
                "TypeName": "Prescriptions",
                "Prescriptionsarray": $scope.Prescriptions
            };
            $scope.FinalSubmitArray.push(object);
        }
        if ($scope.PatientInvestigations.length !== 0) {
            var object = {
                "RowID": count++,
                "Type": 3,
                "TypeName": "Investigations",
                "Investigationsarray": $scope.PatientInvestigations
            };
            $scope.FinalSubmitArray.push(object);
        }
        if ($scope.Treatments.length !== 0) {
            var object = {
                "RowID": count++,
                "Type": 4,
                "TypeName": "Procedures",
                "Treatmentsarray": $scope.Treatments
            };
            $scope.FinalSubmitArray.push(object);
        }
        if ($scope.ConsultationTreatments.length !== 0) {
            var object = {
                "RowID": count++,
                "Type": 5,
                "TypeName": "Treatments",
                "ConsultationTreatmentsarray": $scope.ConsultationTreatments
            };
            $scope.FinalSubmitArray.push(object);
        }
        if ($scope.PatientInstructionComments !== "") {
            var object = {
                "RowID": count++,
                "Type": 6,
                "TypeName": "PatientInstruction",
                "PatientInstructionComments": $scope.PatientInstructionComments
            };
            $scope.FinalSubmitArray.push(object);
        }
        if ($scope.ClinicalNotesComments !== "") {
            var object = {
                "RowID": count++,
                "Type": 7,
                "TypeName": "ClinicalNotes",
                "ClinicalNotesComments": $scope.ClinicalNotesComments
            };
            $scope.FinalSubmitArray.push(object);
        }
        if ($scope.Surgery.length !== 0) {
            var object = {
                "RowID": count++,
                "Type": 8,
                "TypeName": "Surgery",
                "Surgeryarray": $scope.Surgery
            };
            $scope.FinalSubmitArray.push(object);
        }

            
        var params = {
            "TemplateId": $scope.obj.TemplateId||0,
            "TemplateDetails": $scope.FinalSubmitArray||[],
            "UserId": doctorinfo.doctorid,
            "TemplateName": $scope.obj.SelectedTemplateName,
            "DeleteInd": $scope.obj.DeleteInd||0,
            "OrganizationId": $scope.obj.OrganizationId,
            "IsDiagnosisMultiple": false

        }
        eHnotePatientDataService.AddUpdateUserConsultationTemplateDetails(params).then(function (resp) {
            $uibModalInstance.close();
          //  $uibModalInstance.dismiss('cancel');
        }, function (err) {

        });
    };


    if ($scope.DiagnosisData !=="") {
        console.log($scope.DiagnosisData);

        $scope.obj.TemplateId = $scope.DiagnosisData.TemplateId;
        $scope.obj.SelectedTemplateName = $scope.DiagnosisData.TemplateName;
        $scope.obj.DeleteInd = $scope.DiagnosisData.DeleteInd;
        $scope.obj.UserId = $scope.DiagnosisData.UserId;
        $scope.obj.OrganizationId = $scope.DiagnosisData.OrganizationId;
        if ($scope.DiagnosisData.TemplateDetails.length !==0) {
            angular.forEach($scope.DiagnosisData.TemplateDetails, function (Aitem) {
                if (Aitem.Type ===1) {
                    $scope.Diagnosis = Aitem.Diagnosisarray || [];
                }
                if (Aitem.Type === 2) {
                    $scope.Prescriptions = Aitem.Prescriptionsarray || [];
                    console.log($scope.Prescriptions);
                    if ($scope.Prescriptions.length !==0) {
                        angular.forEach($scope.Prescriptions, function (pre) {
                            if (pre.PrescriptionType === "TaperDrop") {
                                $scope.ShowTaperDropsInd = true;
                            }
                            if (pre.PrescriptionType === "TaperTablet") {
                                $scope.ShowTaperTabletInd = true;
                            }
                        });
                    }
                }
                if (Aitem.Type === 3) {
                    $scope.PatientInvestigations = Aitem.Investigationsarray || [];
                }
                if (Aitem.Type === 4) {
                    $scope.Treatments = Aitem.Treatmentsarray || [];
                }
                if (Aitem.Type === 5) {
                    $scope.ConsultationTreatments = Aitem.ConsultationTreatmentsarray || [];
                }
                if (Aitem.Type === 6) {
                    $scope.PatientInstructionComments = Aitem.PatientInstructionComments || [];
                }
                if (Aitem.Type === 7) {
                    $scope.ClinicalNotesComments = Aitem.ClinicalNotesComments || [];
                }
                if (Aitem.Type === 8) {
                    $scope.Surgery = Aitem.Surgeryarray || [];
                }
            });
        }
      
    }
    
    
    $scope.CancelVision = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
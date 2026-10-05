"use strict";
eHnoteWebApp.controller("UsOrderInterpretationPopup", ["$scope", "eHnotePatientDataService", "eHnotePatientAddressDataServices", "alertify", "$uibModalInstance", "eHnoteMasterDataService", "eHnoteSettingsDataService", "eHnoteCacheStorageService", "eHnoteInsuranceService", "InventoryService", "$filter", "$q", "ParentObj", 'eHnoteDiagnosisDataServices', '$window', '$timeout', '$sce', "eHnoteUserDataService", "$uibModal","eHnoteSurgeryService",
    function ($scope, eHnotePatientDataService, eHnotePatientAddressDataServices, alertify, $uibModalInstance, eHnoteMasterDataService, eHnoteSettingsDataService, eHnoteCacheStorageService, eHnoteInsuranceService, InventoryService, $filter, $q, ParentObj, eHnoteDiagnosisDataServices, $window, $timeout, $sce, eHnoteUserDataService, $uibModal, eHnoteSurgeryService) {


        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        $scope.FindingCheckValuesList = $scope.cacheStorageItem.FindingCheckValuesList || [];
        
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID || 0;

        $scope.ParentObject = {
            "Mode": ParentObj.Mode || "AddNew",
            "UserId": ParentObj.UserId,
            "HospitalId": ParentObj.HospitalId,
            "AppointmentId": ParentObj.AppointmentId || 0,
            "AppointmentDate": ParentObj.AppointmentDate || "",
            "ConsultationId": ParentObj.ConsultationId || 0,
            "PatientId": ParentObj.PatientId,
            "PatientName": ParentObj.PatientName || "",
            "PatientOrderId": ParentObj.PatientOrderId || 0,
            "selectedImageStudyObj": ParentObj.selectedImageStudyObj,
            "SelectedDiagnosisArray": ParentObj.SelectedDiagnosisArray || [],
            "InterpretationSummaryArray": ParentObj.InterpretationSummaryArray || [],
            "allUserList": ParentObj.allUserList || [],
            "MasterModalityArray": ParentObj.MasterModalityArray || [],
            "selectedImageStudyFiles": ParentObj.selectedImageStudyFiles || [],
            "selectedPatientData": ParentObj.selectedPatientData || {},
            "IsFrom": ParentObj.IsFrom || "",
        }
        $scope.selectedPatientData = $scope.ParentObject.selectedPatientData;
        $scope.ModuleId = 1;
        $scope.ModuleName = "OUTPatient";
        if ($scope.ParentObject) {
            if ($scope.ParentObject.IsFrom == "OP") {
                $scope.ModuleId = 1;
                $scope.ModuleName = "OUTPatient";
            } else if ($scope.ParentObject.IsFrom == "ASC") {
                $scope.ModuleId = 2;
                $scope.ModuleName = "ASC List";
            }
            if ($scope.cacheStorageItem.AppointmentTypeId == 7 || $scope.cacheStorageItem.AppointmentTypeId == 6) {
                $scope.ModuleId = 3;
                $scope.ModuleName = "Pre Admission";
            }
        }

        function getnewImageStudyDetailsAddReqObj() {
            var obj = {
                "OPChartStatus": ParentObj.selectedImageStudyObj.OPChartStatus||"",
                "IschartSignoff": false,
                "ApptDoctorName": "",
                "ApptDoctorId": "",
                "UserId": $scope.UserId,
                "PatientImageStudyId": 0,
                "PatientOrderId": $scope.ParentObject.PatientOrderId || 0,
                "OrderName": "",
                "SelectedEye": 1,
                "ConnectedDiagnosisList": [],
                "InvestigationId": 0,
                "ModalityId": "",
                "HospitalId": $scope.HospitalId,
                "OrganizationId": $scope.HospitalId,
                "ModalityName": "",
                "ImageQuality": "",
                "AppointmentId": $scope.ParentObject.AppointmentId || 0,
                "ConsultationId": $scope.ParentObject.ConsultationId || 0,
                "AppointmentDate": $scope.ParentObject.AppointmentDate || "",
                "ConsultationDate": "",
                "CPTCode": "",
                "LOINCCode": "",
                "ProcedureId": 0,
                "OrganizationProcedureId": 0,
                "ProcedureName": "",
                "ProcedureCode": "",
                "OrderDate": null,
                "OrderNumber": "",
                "OrderTypeId": 1,
                "OrganId": 0,
                "StatusId": 1,
                "PatientId": $scope.ParentObject.PatientId,
                "PatientName": $scope.ParentObject.PatientName || "",
                "InvestigationName": "OCT",
                "OCTMACFindings": "",
                "OCTONFindings": "",
                "DoctorObj": {
                    "FullName": "Select"
                },
                "DoctorName": "",
                "DoctorId": "",
                "TechnicianObj": {
                    "FullName": "Select"
                },
                "TechnicianName": "",
                "TechnicianId": 0,
                "ProviderRemarks": "",
                "TechnicianRemarks": "",
                "SelectedDiagObj": "",
                "ODMacularFindingValue": "",
                "ODMacularThickNess": "",
                "ODONfindingValue": "",
                "ODRHFLThickNess": "",
                "OSMacularFindingValue": "",
                "OSMacularThickNess": "",
                "OSONfindingValue": "",
                "OSRHFLThickNess": "",
                "ODIOLLensValue": "",
                "ODIOLPower": "",
                "ODToricPower": "",
                "ODIOLManufacturer": "",
                "OSIOLLensValue": "",
                "OSIOLPower": "",
                "OSToricPower": "",
                "OSIOLManufacturer": "",
                "ODFrequenciesValue": "",
                "ODFixationLoss": "",
                "ODFalsePositiveErrors": "",
                "ODFalseNegitiveErrors": "",
                "ODTDProbabilityPlot": "",
                "ODPDProbabilityPlot": "",
                "ODMeanDeviation": "",
                "ODPatternStandardDeviation": "",
                "ODVisualFieldIndex": "",
                "ODGHTValue": "",
                "ODHVFFindingValue": "",
                "OSFixationLoss": "",
                "OSFalsePositiveErrors": "",
                "OSFalseNegitiveErrors": "",
                "OSTDProbabilityPlot": "",
                "OSPDProbabilityPlot": "",
                "OSMeanDeviation": "",
                "OSPatternStandardDeviation": "",
                "OSVisualFieldIndex": "",
                "OSGHTValue": "",
                "OSHVFFindingValue": "",
                "DiagnosisListArray": [],
                "ODFindingValue": "",
                "OSFrequenciesValue": "",
                "OSFindingValue": "",
                "ODK1Value": "",
                "ODK2Value": "",
                "ODCYLValue": "",
                "ODCornealThicknessValue": "",
                "OSK1Value": "",
                "OSK2Value": "",
                "OSCYLValue": "",
                "OSCornealThicknessValue": "",
                "ODOCTMACFindings": "",
                "ODLidsValue": "",
                "ODConjunctivaValue": "",
                "ODScleraValue": "",
                "ODCorneaValue": "",
                "OSOCTMACFindings": "",
                "OSLidsValue": "",
                "OSConjunctivaValue": "",
                "OSScleraValue": "",
                "OSCorneaValue": "",
                "ODEndothelialCellCountValue": "",
                "ODEndoCornealThicknessValue": "",
                "ODEndothelialCellDensity": "",
                "OSEndothelialCellCountValue": "",
                "OSEndoCornealThicknessValue": "",
                "OSEndothelialCellDensity": "",
                "ODASOCTfindingValue": "",
                "OSASOCTfindingValue": "",
                "ODFAFindingValue": "",
                "OSFAFindingValue": "",
                "ODICGFindingValue": "",
                "OSICGFindingValue": "",
                "ImagestudyReviewedDate": "",
                "ODFundusFindingValue": "",
                "OSFundusFindingValue": "",
                "ODFundusFindingObj": "",
                "OSFundusFindingObj": "",
                "FundusFindingArray": [],
                "FAFindingArray": [],
                "ICGFindingArray": [],
                "MacularFindingArray": [],
                "ONFindingArray": [],
                "OSMaculaShowAddNewBtn": false,
                "ODMaculaShowAddNewBtn": false,
                "ODDiscShowAddNewBtn": false,
                "OSDiskShowAddNewBtn": false,
                "ODCorneaShowAddNewBtn": false,
                "OSCorneaShowAddNewBtn": false,
                "ODRetinaShowAddNewBtn": false,
                "OSRetinaShowAddNewBtn": false,
                "ODFAShowAddNewBtn": false,
                "OSFAShowAddNewBtn": false,
                "ODICGShowAddNewBtn": false,
                "OSICGShowAddNewBtn": false,
                "PatientFiles": [],
                "IsClickSaveImageStudytBtns": false,
                "OtherFindingODValueId": null,
                "OtherFindingODValue": '',
                "OtherFindingOSValueId": null,
                "OtherFindingOSValue": '',
                "OSOtherFinShowAddNewBtn": false,
                "ODOtherFinShowAddNewBtn": false,
                "OtherFindingODObj": '',
                "OtherFindingOSObj": '',
                "OtherFindingArray": [],
                "IsModalityId": "",
            };

            return obj;
        }
        $scope.selectedImageStudyObj = getnewImageStudyDetailsAddReqObj();
        $scope.GetLogObj = function () {
            return {
                "UserId": $scope.UserId || null,
                "OrganizationId": $scope.HospitalId || null,
                "AppointmentId": $scope.ParentObject.AppointmentId || 0,
                "ConsultationId": $scope.ParentObject.ConsultationId || 0,
                "PatientId": $scope.ParentObject.PatientId || null,
                "LogArray": [],
                "PatientOrderId": 0,
                "OrganizationProcedureId": 0,
                "ProcedureId": 0,
                "ProcedureCode": "",
                "ProcedureName": "",
                "ProcedureObj": "",
                "CPTCode": "",
                "ModalityId": 0,
                "ModalityName": "",
                "OrganId": "",
                "OrderNumber": "",
                "AppointmentDate": "",
                "DiagnosisList": [],
                "ProviderRemarks": "",
                "TechnicianRemarks": "",
                "ODCornealThicknessValue": "",
                "OSCornealThicknessValue": "",
                "ODCYLValue": "",
                "OSCYLValue": "",
                "ODK2Value": "",
                "OSK2Value": "",
                "ODK1Value": "",
                "OSK1Value": "",
                "DiagnosisListArray": [],
                "TechnicianId": 0,
                "DoctorId": 0,
                "selectedImageStudyObj": "",
            }
        }
        $scope.LogObj = $scope.GetLogObj();
        $scope.AddAuditLogNew = function (selectedItem) {
            $scope.LogObj.LogArray = [];
            let SubModuleName = selectedItem.SubModuleName || "";
            let SubModuleId = selectedItem.SubModuleId || 0;
            let ScreenType = selectedItem.ScreenType || "";
            let ActionType = selectedItem.ActionType || "Accessed";
            let ActionDescription = selectedItem.ActionDescription || "";
            let OldActionDescription = selectedItem.OldActionDescription || "";
            let NewActionDescription = selectedItem.NewActionDescription || "";
            let obj = {
                "LogId": 0,
                "ModuleId": $scope.ModuleId,
                "ModuleName": $scope.ModuleName||"",
                "SubModuleId": SubModuleId,
                "SubModuleName": SubModuleName,
                "ScreenType": ScreenType,
                "ActionType": ActionType,
                // "ActionDescription": ActionDescription,
                "OldActionDescription": OldActionDescription,
                "NewActionDescription": NewActionDescription,
                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            };
            $scope.LogObj.LogArray.push(obj);
            eHnoteSurgeryService.AddAuditLog($scope.LogObj).then(function (resp) {
                if (resp.data.status == "Success") {
                    console.log("Added");
                }
            });
        }


        $scope.selectedImageStudyFiles = {
            "RightEyeFiles": [],
            "LeftEyeFiles": [],
            "BothEyeFiles":[],
            "AllFiles": []
        };

        $scope.ODImgObj = {
            "Index": 0,
            "S3URL": "",
            "DocumentId": "",
            "wrapper": "",
            "viewer": "",
            "total": "",
            "curSpan": "",
            "isDicomFile": false
        }


        $scope.mainViewerObj = {
            "isODFullscreen": false,
            "isOSFullscreen": false,
            "isHalfScreen": false,
            "isGridScreen": false,
            "isShowCompareView": false,
            "ODs3url": "",
            "OSs3url": "",
            "numDivs": 1,
            "PatientId": ParentObj.PatientId,
            "AppointmentId": ParentObj.AppointmentId,
            "PatientOrderId": ParentObj.selectedImageStudyObj.PatientOrderId,
            "ModalityId": ParentObj.selectedImageStudyObj.ModalityId,
            "InvestigationId": ParentObj.selectedImageStudyObj.InvestigationId,
            "invSearchType": "3",
            "isRightDicomViewer": false,
            "isLeftDicomViewer": false,
            "showSyncButton": false,
            "IsModalityId": ParentObj.selectedImageStudyObj.ModalityId,
        }


        if ($scope.selectedPatientData && Object.keys($scope.selectedPatientData).length > 0) {
            $scope.PaitentDetails = {
                "FullName": $scope.selectedPatientData.Patient[0].FullName || "",
                "PatientDisplayId": $scope.selectedPatientData.Patient[0].PatientDisplayId || "",
                "MobileNo": $scope.selectedPatientData.Patient[0].MobileNo || 0,
                "DOB": $scope.selectedPatientData.Patient[0].DOB || "",
                "AgeInYears": $scope.selectedPatientData.Patient[0].AgeInYears || 0,
                "AgeInMonths": $scope.selectedPatientData.Patient[0].AgeInMonths || 0,
                "S3URL": $scope.selectedPatientData.Patient[0].S3URL || "",
                "SocialSecurityNo": $scope.selectedPatientData.Patient[0].SocialSecurityNo || "",
                "BloodGroupName": $scope.selectedPatientData.Patient[0].PatientOtherDetails[0].BloodGroupName || "",
                "MaritalStatusName": $scope.selectedPatientData.Patient[0].PatientOtherDetails[0].MaritalStatus || "",
                "ExternalComanagerName": $scope.selectedPatientData.Patient[0].ExternalComanagerName || '',
                "InternalComanagerName": $scope.selectedPatientData.Patient[0].InternalComanagerName || '',
                "PCPDoctorName": $scope.selectedPatientData.Patient[0].PCPDoctorName || '',
                "RefferalName": $scope.selectedPatientData.Patient[0].ReferralName || '',
                "ContactInfo": {
                    "EmailID": $scope.selectedPatientData.Patient[0].EmailId || "",
                }
            }


            $scope.PostalAddressSummaryObj = {
                "AddressId": $scope.selectedPatientData.PatientAddress.PostalAddress.AddressId || 0,
                "AddressLine1": $scope.selectedPatientData.PatientAddress.PostalAddress.AddressLine1 || "",
                "AddressLine2": $scope.selectedPatientData.PatientAddress.PostalAddress.AddressLine2 || "",
                "ZipCode": $scope.selectedPatientData.PatientAddress.PostalAddress.ZipCode || "",
                "CountyId": $scope.selectedPatientData.PatientAddress.PostalAddress.CountyId || 0,
                "CountyName": $scope.selectedPatientData.PatientAddress.PostalAddress.CountyName || "",
                "CityName": $scope.selectedPatientData.PatientAddress.PostalAddress.CityName || "",
                "CityId": $scope.selectedPatientData.PatientAddress.PostalAddress.CityId || 0,
                "StateName": $scope.selectedPatientData.PatientAddress.PostalAddress.StateName || "",
                "StateId": $scope.selectedPatientData.PatientAddress.PostalAddress.StateId || 0,
                "CountryName": $scope.selectedPatientData.PatientAddress.PostalAddress.CountryName || "",
                "CountryId": $scope.selectedPatientData.PatientAddress.PostalAddress.CountryId || 0,
            }

            $scope.PermanentAddressSummaryObj = {
                "AddressId": $scope.selectedPatientData.PatientAddress.PermanentAddress.AddressId || 0,
                "AddressLine1": $scope.selectedPatientData.PatientAddress.PermanentAddress.AddressLine1 || "",
                "AddressLine2": $scope.selectedPatientData.PatientAddress.PermanentAddress.AddressLine2 || "",
                "ZipCode": $scope.selectedPatientData.PatientAddress.PermanentAddress.ZipCode || "",
                "CountyId": $scope.selectedPatientData.PatientAddress.PermanentAddress.CountyId || 0,
                "CountyName": $scope.selectedPatientData.PatientAddress.PermanentAddress.CountyName || "",
                "CityName": $scope.selectedPatientData.PatientAddress.PermanentAddress.CityName || "",
                "CityId": $scope.selectedPatientData.PatientAddress.PermanentAddress.CityId || 0,
                "StateName": $scope.selectedPatientData.PatientAddress.PermanentAddress.StateName || "",
                "StateId": $scope.selectedPatientData.PatientAddress.PermanentAddress.StateId || 0,
                "CountryName": $scope.selectedPatientData.PatientAddress.PermanentAddress.CountryName || "",
                "CountryId": $scope.selectedPatientData.PatientAddress.PermanentAddress.CountryId || 0,
            }

            $scope.PatientOfficeNumber = $scope.selectedPatientData.Patient[0].OfficeAreaCode + $scope.selectedPatientData.Patient[0].PatientOfficeNumber;
            var obj1 = eHnoteUserDataService.UsMobileFormatChange($scope.PatientOfficeNumber);
            $scope.PatientOfficeNumber = obj1.UsFormatMobileNumber;

            $scope.PatientMobileNumber = $scope.selectedPatientData.Patient[0].MobileNo;
            var obj2 = eHnoteUserDataService.UsMobileFormatChange($scope.PatientMobileNumber);
            $scope.PatientMobileNumber = obj2.UsFormatMobileNumber;

            $scope.DemographicSummaryObj = {
                "LanguageName": $scope.selectedPatientData.Patient[0].AdditionalInfo.LanguageName || "",
                "Proficiency": $scope.selectedPatientData.Patient[0].AdditionalInfo.Proficiency || "",
                "SexualOrientation": $scope.selectedPatientData.Patient[0].AdditionalInfo.SexualOrientation || "",
                "GenderIdentityStatus": $scope.selectedPatientData.Patient[0].AdditionalInfo.GenderIdentity || "",
            }
        }


        $scope.clinicDoctorList = [];
        $scope.AllTecniciansList = [];

        angular.forEach($scope.ParentObject.allUserList, function (Aitem) {
            if (Aitem.RoleId === 1 || Aitem.RoleId === 3 || Aitem.RoleId === 4 || Aitem.RoleId === 43 || Aitem.RoleId === 16 || Aitem.RoleId === 56 || Aitem.RoleId === 57) {
                $scope.clinicDoctorList.push(Aitem);
            }
        });
        $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });

        angular.forEach($scope.ParentObject.allUserList, function (Aitem) {
            if (Aitem.RoleId === 10) {
                $scope.AllTecniciansList.push(Aitem);
            }
        });
        $scope.AllTecniciansList = _.uniq($scope.AllTecniciansList, false, function (p) { return p.DoctorID; });

        $scope.PatientOrdersArrayNew = [];

        $scope.orderPopupObj = {
            "IsNewOrder": false,
        };




        $scope.mainAllFilesArray = [];
        $scope.tempODImagesArray = [];
        $scope.tempOSImagesArray = [];
        $scope.tempOUImagesArray = [];
        $scope.ODFileupload = [];
        $scope.OSFileupload = [];
        $scope.patientVisitsArray = [];
        $scope.Fileupload = "";


        $scope.uibclose = function () {
            var resp = {
                "selectedImageStudyObj": $scope.selectedImageStudyObj
            }
            $uibModalInstance.close(resp);
        };
        
        function GetPatientOrderInterpretationDetails() {
            let params = {
                "PatientId": $scope.selectedImageStudyObj.PatientId,
                "BranchId": $scope.HospitalId,
                "PageSize": 100,
                "PageNumber": 1,
            };
            eHnotePatientDataService.GetPatientOrderInterpretationDetails(params).then(function (resp) {
                if (resp.data.Status == "Success") {
                    
                    if (resp.data.rows.length > 0) {
                        $scope.PatientOrdersArrayNew = resp.data.rows || [];

                        angular.forEach($scope.PatientOrdersArrayNew, function (oitem) {
                            oitem.IsSelected = false;
                            const organMap = { 3: "OU", 2: "OS", 1: "OD" };
                            oitem.OrganName = organMap[oitem.OrganId] || "OD";
                            oitem.isdisableOrderSelection = false;
                            var visitDate = "";
                            if (oitem.ConsultationDate != null && oitem.ConsultationDate != undefined) {
                                visitDate = $filter("date")(oitem.ConsultationDate, "MM-dd-yyyy");
                            } else if (oitem.AppointmentDate != null && oitem.ConsultationDate != undefined) {
                                visitDate = $filter("date")(oitem.AppointmentDate, "MM-dd-yyyy");
                            }
                            oitem.OrderCompleteName = visitDate + " - " + oitem.ProcedureName + " - " + oitem.OrganName + " ( " + oitem.ModalityName + " ) - " + oitem.SecondUserFullName
                        });
                        if ($scope.PatientOrdersArrayNew.length > 0) {
                            let filterobj = [];
                            if ($scope.orderPopupObj.IsNewOrder) {
                                filterobj = $filter('filter')($scope.PatientOrdersArrayNew, { 'ProcedureId': $scope.selectedImageStudyObj.ProcedureId }, true) || [];
                            } else {
                                filterobj = $filter('filter')($scope.PatientOrdersArrayNew, { 'PatientOrderId': $scope.selectedImageStudyObj.PatientOrderId }, true) || [];
                            }
                            if (filterobj.length>0) {
                                $scope.selectedImageStudyObj.PatientOrderId = filterobj[0].PatientOrderId;
                                $scope.mainAllFilesArray = filterobj[0].PatientFiles||[];
                                $scope.tempODImagesArray = $filter('filter')(filterobj[0].PatientFiles, {'OrganId':1},true)||[];
                                $scope.tempOSImagesArray = $filter('filter')(filterobj[0].PatientFiles, {'OrganId':2},true)||[];
                                $scope.tempOUImagesArray = $filter('filter')(filterobj[0].PatientFiles, { 'OrganId': 3 }, true) || [];
                                if (filterobj[0].PatientFiles.length>0) {
                                    $scope.selectedPreviewObj.DocumentId = filterobj[0].PatientFiles[0].DocumentId || 0;
                                }
                            }
                        }
                        

                    }

                }
            })
        }

        $scope.compareImagemanagementdata = function (newdata,olddata) {

            newdata = newdata || "";
            olddata = olddata || "";
            let oldArr = [];
            let newArr = [];

            let oldFields = pickInterpretationCompareFields(olddata);
            let newFields = pickInterpretationCompareFields(newdata);

            if (JSON.stringify(oldFields) !== JSON.stringify(newFields)) {
                oldArr.push(formatInterpretationResult(olddata));
                newArr.push(formatInterpretationResult(newdata));
            }


            return {
                oldDescription: oldArr.join("\n\n").trim(),
                newDescription: newArr.join("\n\n").trim(),
            };
        };


        function formatInterpretationResult(inv) {
            let iod = inv;
            if (!iod) return "";

            let out = [];
            let header = `Order Name : ${inv.OrderName || inv.ProcedureName||""}`;
            out.push(header);
             let formattedDate = iod.OrderDate
                ? $filter("date")(iod.OrderDate, "MM-dd-yyyy")
                : "";

            let formattedvisitDate = iod.ConsultationDate
                ? $filter("date")(iod.ConsultationDate, "MM-dd-yyyy")
                : "";
            let formattedvisitDate1 = iod.AppointmentDate
                ? $filter("date")(iod.AppointmentDate, "MM-dd-yyyy")
                : "";

            
            let eye = iod.OrganId == 1 ? "OD" :
                iod.OrganId == 2 ? "OS" :
                    iod.OrganId == 3 ? "OU" : "";
            out.push(`Visit Date : ${formattedvisitDate || formattedvisitDate1}`);
            out.push(`Modality : ${iod.ModalityName}`);
            if (iod.OrderNumber)
                out.push(`Order Number : ${iod.OrderNumber}`);
            if (eye)
                out.push(`Selected Organ : ${eye}`);
            if (iod.formattedDate)
            out.push(`Order Date : ${formattedDate}`);

            if (iod.DiagnosisListArray && iod.DiagnosisListArray.length > 0) {

                const diagList = iod.DiagnosisListArray.filter(d => d.DeleteInd === 'N');

                if (diagList.length > 0) {
                    out.push("\nDiagnosis :");
                    diagList.forEach(d => {
                        out.push(`${d.ICD10CODE || d.ICDCode} | ${d.ICD10DIAGDESCRIPTION}`);
                    });
                }
            }
            // ---- Interpretation Result ----
            if (iod.ImageQuality) {
                out.push("\n\nResult  :-");
                out.push(`Image Quality : ${iod.ImageQuality}`);
            }

            // ---- Findings ----
            let findings = [];

            function pushIf(label, value) {
                if (value) findings.push(`${label} : ${value}`);
            }

            // ---- OD ----
            let od = [];
            pushIf.call({}, {}, null); // no-op safeguard

            function pushOD(label, value) {
                if (value) od.push(`${label} : ${value}`);
            }
            let odMacular = getFindingText(iod.MacularFindingArray, 4, 1);
            let odON = getFindingText(iod.ONFindingArray, 5, 1);
            let odFundus = getFindingText(iod.FundusFindingArray, 1, 1);
            let odFA = getFindingText(iod.FAFindingArray, 2, 1);
            let odICG = getFindingText(iod.ICGFindingArray, 3, 1);

            pushOD("Macular Findings Value", odMacular);
            pushOD("Macular Thickness", iod.ODMacularThickNess);
            pushOD("RHFL Thickness", iod.ODRHFLThickNess);
            pushOD("IOL Lens Value", iod.ODIOLLensValue);
            pushOD("IOL Power", iod.ODIOLPower);
            pushOD("Toric Power", iod.ODToricPower);
            pushOD("IOL Manufacturer", iod.ODIOLManufacturer);
            pushOD("Frequencies Value", iod.ODFrequenciesValue);
            pushOD("Finding Value", iod.ODFindingValue);
            pushOD("K1 Value", iod.ODK1Value);
            pushOD("K2 Value", iod.ODK2Value);
            pushOD("CYL Value", iod.ODCYLValue);
            pushOD("Corneal Thickness", iod.ODCornealThicknessValue);
            pushOD("SL Photo", iod.ODOCTMACFindings);
            pushOD("Lids", iod.ODLidsValue);
            pushOD("Conjunctiva", iod.ODConjunctivaValue);
            pushOD("Sclera", iod.ODScleraValue);
            pushOD("Cornea", iod.ODCorneaValue);
            pushOD("Endothelial Cell Count", iod.ODEndothelialCellCountValue);
            pushOD("Endothelial Corneal Thickness", iod.ODEndoCornealThicknessValue);
            pushOD("Endothelial Cell Density", iod.ODEndothelialCellDensity);
            pushOD("Fixation Loss", iod.ODFixationLoss);
            pushOD("False Positive Errors", iod.ODFalsePositiveErrors);
            pushOD("False Negative Errors", iod.ODFalseNegitiveErrors);
            pushOD("TD Probability Plot", iod.ODTDProbabilityPlot);
            pushOD("PD Probability Plot", iod.ODPDProbabilityPlot);
            pushOD("Mean Deviation", iod.ODMeanDeviation);
            pushOD("Pattern Std Deviation", iod.ODPatternStandardDeviation);
            pushOD("Visual Field Index", iod.ODVisualFieldIndex);
            pushOD("GHT Value", iod.ODGHTValue);
            pushOD("HVF Finding", iod.ODHVFFindingValue);
            pushOD("AS-OCT", iod.ODASOCTfindingValue);


            pushOD("ON Findings", odON);
            pushOD("Fundus Findings", odFundus);
            pushOD("FA", odFA);
            pushOD("ICG", odICG);


            if (od.length > 0) {
                out.push("\nFindings :");
                out.push("OD -");
                od.forEach(x => out.push(x));
            }

            // ---- OS ----
            let os = [];

            function pushOS(label, value) {
                if (value) os.push(`${label} : ${value}`);
            }
            let osMacular = getFindingText(iod.MacularFindingArray, 4, 2);
            let osON = getFindingText(iod.ONFindingArray, 5, 2);
            let osFundus = getFindingText(iod.FundusFindingArray, 1, 2);
            let osFA = getFindingText(iod.FAFindingArray, 2, 2);
            let osICG = getFindingText(iod.ICGFindingArray, 3, 2);

            pushOS("Macular Findings Value", osMacular);
            pushOS("Macular Thickness", iod.OSMacularThickNess);
            pushOS("RHFL Thickness", iod.OSRHFLThickNess);
            pushOS("IOL Lens Value", iod.OSIOLLensValue);
            pushOS("IOL Power", iod.OSIOLPower);
            pushOS("Toric Power", iod.OSToricPower);
            pushOS("IOL Manufacturer", iod.OSIOLManufacturer);
            pushOS("Frequencies Value", iod.OSFrequenciesValue);
            pushOS("Finding Value", iod.OSFindingValue);
            pushOS("K1 Value", iod.OSK1Value);
            pushOS("K2 Value", iod.OSK2Value);
            pushOS("CYL Value", iod.OSCYLValue);
            pushOS("Corneal Thickness", iod.OSCornealThicknessValue);
            pushOS("SL Photo", iod.OSOCTMACFindings);
            pushOS("Lids", iod.OSLidsValue);
            pushOS("Conjunctiva", iod.OSConjunctivaValue);
            pushOS("Sclera", iod.OSScleraValue);
            pushOS("Cornea", iod.OSCorneaValue);
            pushOS("Endothelial Cell Count", iod.OSEndothelialCellCountValue);
            pushOS("Endothelial Corneal Thickness", iod.OSEndoCornealThicknessValue);
            pushOS("Endothelial Cell Density", iod.OSEndothelialCellDensity);
            pushOS("Fixation Loss", iod.OSFixationLoss);
            pushOS("False Positive Errors", iod.OSFalsePositiveErrors);
            pushOS("False Negative Errors", iod.OSFalseNegitiveErrors);
            pushOS("TD Probability Plot", iod.OSTDProbabilityPlot);
            pushOS("PD Probability Plot", iod.OSPDProbabilityPlot);
            pushOS("Mean Deviation", iod.OSMeanDeviation);
            pushOS("Pattern Std Deviation", iod.OSPatternStandardDeviation);
            pushOS("Visual Field Index", iod.OSVisualFieldIndex);
            pushOS("GHT Value", iod.OSGHTValue);
            pushOS("HVF Finding", iod.OSHVFFindingValue);
            pushOS("AS-OCT", iod.OSASOCTfindingValue);


            pushOS("ON Findings", osON);
            pushOS("Fundus Findings", osFundus);
            pushOS("FA", osFA);
            pushOS("ICG", osICG);


            if (os.length > 0) {
                out.push("\nOS -");
                os.forEach(x => out.push(x));
            }

            // ---- Files (OD / OS specific) ----
            let odFiles = getActiveFilesByEye(iod.PatientFiles, 1);
            let osFiles = getActiveFilesByEye(iod.PatientFiles, 2);
            let ouFiles = getActiveFilesByEye(iod.PatientFiles, 3);

            if (odFiles || osFiles || ouFiles) {
                out.push("\nFiles :");

                if (odFiles) {
                    out.push(`OD : ${odFiles}`);
                }

                if (osFiles) {
                    out.push(`OS : ${osFiles}`);
                }
                if (ouFiles) {
                    out.push(`OU : ${ouFiles}`);
                }
            }


            // ---- Technician / Provider ----
            if (iod.TechnicianName)
                out.push(`\nTechnician : ${iod.TechnicianName}`);

            if (iod.TechnicianRemarks)
                out.push(`Technician Notes : ${iod.TechnicianRemarks}`);

            if (iod.DoctorName)
                out.push(`Provider : ${iod.DoctorName}`);

            if (iod.ProviderRemarks)
                out.push(`Provider Notes : ${iod.ProviderRemarks}`);

            return out.join("\n");
        }

        function formatInterpretationResultTemplate(inv) {
            let iod = inv;
            if (!iod) return "";

            let out = [];

            // ---- Interpretation Result ----
            if (iod.ImageQuality) {
              //  out.push("\nInterpretation Result :-");
                out.push(`Image Quality : ${iod.ImageQuality}`);
            }

            // ---- Findings ----
            let findings = [];

            function pushIf(label, value) {
                if (value) findings.push(`${label} : ${value}`);
            }

            // ---- OD ----
            let od = [];
            pushIf.call({}, {}, null); // no-op safeguard

            function pushOD(label, value) {
                if (value) od.push(`${label} : ${value}`);
            }
            let odMacular = getFindingText(iod.MacularFindingArray, 4, 1);
            let odON = getFindingText(iod.ONFindingArray, 5, 1);
            let odFundus = getFindingText(iod.FundusFindingArray, 1, 1);
            let odFA = getFindingText(iod.FAFindingArray, 2, 1);
            let odICG = getFindingText(iod.ICGFindingArray, 3, 1);

            pushOD("Macular Findings Value", odMacular);
            pushOD("Macular Thickness", iod.ODMacularThickNess);
            pushOD("RHFL Thickness", iod.ODRHFLThickNess);
            pushOD("IOL Lens Value", iod.ODIOLLensValue);
            pushOD("IOL Power", iod.ODIOLPower);
            pushOD("Toric Power", iod.ODToricPower);
            pushOD("IOL Manufacturer", iod.ODIOLManufacturer);
            pushOD("Frequencies Value", iod.ODFrequenciesValue);
            pushOD("Finding Value", iod.ODFindingValue);
            pushOD("K1 Value", iod.ODK1Value);
            pushOD("K2 Value", iod.ODK2Value);
            pushOD("CYL Value", iod.ODCYLValue);
            pushOD("Corneal Thickness", iod.ODCornealThicknessValue);
            pushOD("SL Photo", iod.ODOCTMACFindings);
            pushOD("Lids", iod.ODLidsValue);
            pushOD("Conjunctiva", iod.ODConjunctivaValue);
            pushOD("Sclera", iod.ODScleraValue);
            pushOD("Cornea", iod.ODCorneaValue);
            pushOD("Endothelial Cell Count", iod.ODEndothelialCellCountValue);
            pushOD("Endothelial Corneal Thickness", iod.ODEndoCornealThicknessValue);
            pushOD("Endothelial Cell Density", iod.ODEndothelialCellDensity);
            pushOD("Fixation Loss", iod.ODFixationLoss);
            pushOD("False Positive Errors", iod.ODFalsePositiveErrors);
            pushOD("False Negative Errors", iod.ODFalseNegitiveErrors);
            pushOD("TD Probability Plot", iod.ODTDProbabilityPlot);
            pushOD("PD Probability Plot", iod.ODPDProbabilityPlot);
            pushOD("Mean Deviation", iod.ODMeanDeviation);
            pushOD("Pattern Std Deviation", iod.ODPatternStandardDeviation);
            pushOD("Visual Field Index", iod.ODVisualFieldIndex);
            pushOD("GHT Value", iod.ODGHTValue);
            pushOD("HVF Finding", iod.ODHVFFindingValue);
            pushOD("AS-OCT", iod.ODASOCTfindingValue);


            pushOD("ON Findings", odON);
            pushOD("Fundus Findings", odFundus);
            pushOD("FA", odFA);
            pushOD("ICG", odICG);


            if (od.length > 0) {
                out.push("\nFindings :");
                out.push("OD -");
                od.forEach(x => out.push(x));
            }

            // ---- OS ----
            let os = [];

            function pushOS(label, value) {
                if (value) os.push(`${label} : ${value}`);
            }
            let osMacular = getFindingText(iod.MacularFindingArray, 4, 2);
            let osON = getFindingText(iod.ONFindingArray, 5, 2);
            let osFundus = getFindingText(iod.FundusFindingArray, 1, 2);
            let osFA = getFindingText(iod.FAFindingArray, 2, 2);
            let osICG = getFindingText(iod.ICGFindingArray, 3, 2);

            pushOS("Macular Findings Value", osMacular);
            pushOS("Macular Thickness", iod.OSMacularThickNess);
            pushOS("RHFL Thickness", iod.OSRHFLThickNess);
            pushOS("IOL Lens Value", iod.OSIOLLensValue);
            pushOS("IOL Power", iod.OSIOLPower);
            pushOS("Toric Power", iod.OSToricPower);
            pushOS("IOL Manufacturer", iod.OSIOLManufacturer);
            pushOS("Frequencies Value", iod.OSFrequenciesValue);
            pushOS("Finding Value", iod.OSFindingValue);
            pushOS("K1 Value", iod.OSK1Value);
            pushOS("K2 Value", iod.OSK2Value);
            pushOS("CYL Value", iod.OSCYLValue);
            pushOS("Corneal Thickness", iod.OSCornealThicknessValue);
            pushOS("SL Photo", iod.OSOCTMACFindings);
            pushOS("Lids", iod.OSLidsValue);
            pushOS("Conjunctiva", iod.OSConjunctivaValue);
            pushOS("Sclera", iod.OSScleraValue);
            pushOS("Cornea", iod.OSCorneaValue);
            pushOS("Endothelial Cell Count", iod.OSEndothelialCellCountValue);
            pushOS("Endothelial Corneal Thickness", iod.OSEndoCornealThicknessValue);
            pushOS("Endothelial Cell Density", iod.OSEndothelialCellDensity);
            pushOS("Fixation Loss", iod.OSFixationLoss);
            pushOS("False Positive Errors", iod.OSFalsePositiveErrors);
            pushOS("False Negative Errors", iod.OSFalseNegitiveErrors);
            pushOS("TD Probability Plot", iod.OSTDProbabilityPlot);
            pushOS("PD Probability Plot", iod.OSPDProbabilityPlot);
            pushOS("Mean Deviation", iod.OSMeanDeviation);
            pushOS("Pattern Std Deviation", iod.OSPatternStandardDeviation);
            pushOS("Visual Field Index", iod.OSVisualFieldIndex);
            pushOS("GHT Value", iod.OSGHTValue);
            pushOS("HVF Finding", iod.OSHVFFindingValue);
            pushOS("AS-OCT", iod.OSASOCTfindingValue);


            pushOS("ON Findings", osON);
            pushOS("Fundus Findings", osFundus);
            pushOS("FA", osFA);
            pushOS("ICG", osICG);


            if (os.length > 0) {
                out.push("\nOS -");
                os.forEach(x => out.push(x));
            }

            if (iod.DiagnosisListArray && iod.DiagnosisListArray.length > 0) {

                const diagList = iod.DiagnosisListArray.filter(d => d.DeleteInd === 'N');

                if (diagList.length > 0) {
                    out.push("\nDiagnosis :");
                    diagList.forEach(d => {
                        out.push(`${d.ICD10CODE || d.ICDCode} | ${d.ICD10DIAGDESCRIPTION}`);
                    });
                }
            }

            // ---- Technician / Provider ----
            if (iod.TechnicianName)
                out.push(`\nTechnician : ${iod.TechnicianName}`);

            if (iod.TechnicianRemarks)
                out.push(`Technician Notes : ${iod.TechnicianRemarks}`);

            if (iod.DoctorName)
                out.push(`Provider : ${iod.DoctorName}`);

            if (iod.ProviderRemarks)
                out.push(`Provider Notes : ${iod.ProviderRemarks}`);

            return out.join("\n");
        }


        function pickInterpretationCompareFields(iod) {
            iod = iod || {};
            let formattedDate = iod.OrderDate
                ? $filter("date")(iod.OrderDate, "MM-dd-yyyy")
                : "";
            return {
                ImageQuality: iod.ImageQuality,

                OD: {
                    MacularThickness: iod.ODMacularThickNess,
                    RHFLThickness: iod.ODRHFLThickNess,
                    IOLLensValue: iod.ODIOLLensValue,
                    IOLPower: iod.ODIOLPower,
                    ToricPower: iod.ODToricPower,
                    IOLManufacturer: iod.ODIOLManufacturer,
                    FrequenciesValue: iod.ODFrequenciesValue,
                    FindingValue: iod.ODFindingValue,
                    K1Value: iod.ODK1Value,
                    K2Value: iod.ODK2Value,
                    CYLValue: iod.ODCYLValue,
                    CornealThickness: iod.ODCornealThicknessValue,
                    ASOCT: iod.ODASOCTfindingValue,
                    SLPhoto: iod.ODOCTMACFindings,
                    LidsValue: iod.ODLidsValue,
                    ConjunctivaValue: iod.ODConjunctivaValue,
                    ScleraValue: iod.ODScleraValue,
                    CorneaValue: iod.ODCorneaValue,
                    EndothelialCellCount: iod.ODEndothelialCellCountValue,
                    EndothelialCornealThickness: iod.ODEndoCornealThicknessValue,
                    EndothelialCellDensity: iod.ODEndothelialCellDensity,
                    FixationLoss: iod.ODFixationLoss,
                    FalsePositiveErrors: iod.ODFalsePositiveErrors,
                    FalseNegitiveErrors: iod.ODFalseNegitiveErrors,
                    TDProbabilityPlot: iod.ODTDProbabilityPlot,
                    PDProbabilityPlot: iod.ODPDProbabilityPlot,
                    MeanDeviation: iod.ODMeanDeviation,
                    PatternStandardDeviation: iod.ODPatternStandardDeviation,
                    VisualFieldIndex: iod.ODVisualFieldIndex,
                    GHTValue: iod.ODGHTValue,
                    HVFFindingValue: iod.ODHVFFindingValue,
                    Findings: {
                        Macular: getFindingText(iod.MacularFindingArray, 4, 1),
                        ON: getFindingText(iod.ONFindingArray, 5, 1),
                        Fundus: getFindingText(iod.FundusFindingArray, 1, 1),
                        FA: getFindingText(iod.FAFindingArray, 2, 1),
                        ICG: getFindingText(iod.ICGFindingArray, 3, 1)
                    },
                    Files: getActiveFilesByEye(iod.PatientFiles, 1)
                },

                OS: {
                    MacularThickness: iod.OSMacularThickNess,
                    RHFLThickness: iod.OSRHFLThickNess,
                    IOLLensValue: iod.OSIOLLensValue,
                    IOLPower: iod.OSIOLPower,
                    ToricPower: iod.OSToricPower,
                    IOLManufacturer: iod.OSIOLManufacturer,
                    FrequenciesValue: iod.OSFrequenciesValue,
                    FindingValue: iod.OSFindingValue,
                    K1Value: iod.OSK1Value,
                    K2Value: iod.OSK2Value,
                    CYLValue: iod.OSCYLValue,
                    CornealThickness: iod.OSCornealThicknessValue,
                    SLPhoto: iod.OSOCTMACFindings,
                    LidsValue: iod.OSLidsValue,
                    ConjunctivaValue: iod.OSConjunctivaValue,
                    ScleraValue: iod.OSScleraValue,
                    CorneaValue: iod.OSCorneaValue,
                    EndothelialCellCount: iod.OSEndothelialCellCountValue,
                    EndothelialCornealThickness: iod.OSEndoCornealThicknessValue,
                    EndothelialCellDensity: iod.OSEndothelialCellDensity,
                    FixationLoss: iod.OSFixationLoss,
                    FalsePositiveErrors: iod.OSFalsePositiveErrors,
                    FalseNegitiveErrors: iod.OSFalseNegitiveErrors,
                    TDProbabilityPlot: iod.OSTDProbabilityPlot,
                    PDProbabilityPlot: iod.OSPDProbabilityPlot,
                    MeanDeviation: iod.OSMeanDeviation,
                    PatternStandardDeviation: iod.OSPatternStandardDeviation,
                    VisualFieldIndex: iod.OSVisualFieldIndex,
                    GHTValue: iod.OSGHTValue,
                    HVFFindingValue: iod.OSHVFFindingValue,
                    ASOCT: iod.OSASOCTfindingValue,
                    Findings: {
                        Macular: getFindingText(iod.MacularFindingArray, 4, 2),
                        ON: getFindingText(iod.ONFindingArray, 5, 2),
                        Fundus: getFindingText(iod.FundusFindingArray, 1, 2),
                        FA: getFindingText(iod.FAFindingArray, 2, 2),
                        ICG: getFindingText(iod.ICGFindingArray, 3, 2)
                    },
                    Files: getActiveFilesByEye(iod.PatientFiles, 2)
                },
                DiagnosisList: (iod.DiagnosisListArray || [])
                    .filter(d => d.DeleteInd === 'N')
                    .map(d => ({
                        DiagnosisId: d.DiagnosisId,
                        ICD10CODE: d.ICD10CODE || d.ICDCode,
                        DiagnosisName: d.ICD10DIAGDESCRIPTION
                    })),
                Organ: iod.SelectedEye,
                Modality: iod.ModalityName,
                OrderDate: formattedDate,
                OrderNumber: iod.OrderNumber,
                TechnicianName: iod.TechnicianName,
                TechnicianRemarks: iod.TechnicianRemarks,
                DoctorName: iod.DoctorName,
                ProviderRemarks: iod.ProviderRemarks
            };
        }
        function getFindingText(arr, typeId, organId) {
            if (!Array.isArray(arr)) return "";

            return arr
                .filter(x =>
                    x.DeleteInd === 'N' &&
                    x.TypeId === typeId &&
                    x.OrganId === organId
                )
                .map(x => x.FindingValue)
                .join(", ");
        }
        function getActiveFilesByEye(files, organId) {
            if (!Array.isArray(files)) return "";

            return files
                .filter(f =>
                    f.DeleteInd === 'N' &&
                    f.OrganId === organId &&
                    f.DocumentName
                )
                .map(f => f.DocumentName)
                .join(", ");
        }


        $scope.selectedImageStudyObj.IsClickSaveImageStudytBtns = false;
        $scope.saveImageManagementStudyDetails = function (type) {
            $scope.LogObj.LogArray = [];
            type = type || "";
            if ($scope.orderPopupObj.IsNewOrder) {

                if ($scope.selectedImageStudyObj.IschartSignoff) {
                    alertify.error("This appointment is signed off");
                    return false;
                }
                //var TempArray = $filter("filter")($scope.patientVisitsArray, { "AppointmentId": $scope.selectedImageStudyObj.AppointmentId }, true) || [];
                //if (TempArray.length > 0) {
                //    if (TempArray[0].OPChartStatus == "E") {
                //        alertify.error("This appointment is signed off");
                //        return false;
                //    }
                //}
                var invId = parseFloat($scope.selectedImageStudyObj.ProcedureId) || 0;
                if (invId === 0) {
                    alertify.error("Please select an Investigation");
                    return false;
                }
                var consId = parseFloat($scope.selectedImageStudyObj.ConsultationId) || 0;
                if (consId === 0) {
                    alertify.error("Please select a Visit");
                    return false;
                }

                

                var modId = parseFloat($scope.selectedImageStudyObj.ModalityId) || 0;
                if (modId === 0) {
                    alertify.error("Please select a Modality");
                    return false;
                }
                var orgId = parseFloat($scope.selectedImageStudyObj.OrganId) || 0;
                if (orgId === 0) {
                    alertify.error("Please select an Organ");
                    return false;
                }
            }
            if (!$scope.orderPopupObj.IsNewOrder) {
                var orderId = parseFloat($scope.selectedImageStudyObj.PatientOrderId) || 0;
                if (orderId === 0) {
                    alertify.error("Please select an Order");
                    return false;
                }
               
            }



         

            $scope.SelectedDiagnosisArray = $scope.SelectedDiagnosisArray || [];
            if ($scope.SelectedDiagnosisArray.length > 0) {
                angular.forEach($scope.SelectedDiagnosisArray, function (item) {
                    $scope.selectedImageStudyObj.DiagnosisListArray.push(item);
                });
            }
            var ReviewedDate = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
            var params = angular.copy($scope.selectedImageStudyObj);
            params.DoctorObj = "";
            params.TechnicianObj = "";
            params.SelectedDiagObj = "";
            params.ODFundusFindingObj = "";
            params.OSFundusFindingObj = "";
            params.ODFAFindingObj = "";
            params.OSFAFindingObj = "";
            params.ODICGFindingObj = "";
            params.OSICGFindingObj = "";
            params.DoctorId = parseFloat(params.DoctorId) || 0;
            params.TechnicianId = parseFloat(params.TechnicianId) || 0;
            params.ImagestudyReviewedDate = ReviewedDate;
            params.InterpretationArrayNew = $scope.InterpretationArrayNew || [];
            params.PatientFiles = [];
            params.Logs = {};



            if ($scope.tempODImagesArray.length > 0) {
                angular.forEach($scope.tempODImagesArray, function (item) {
                    params.PatientFiles.push(item);
                });
            };

            if ($scope.tempOSImagesArray.length > 0) {
                angular.forEach($scope.tempOSImagesArray, function (item) {
                    params.PatientFiles.push(item);
                });
            };
            if ($scope.tempOUImagesArray.length > 0) {
                angular.forEach($scope.tempOUImagesArray, function (item) {
                    params.PatientFiles.push(item);
                });
            };



            if (params.PatientFiles.length === 0) {
                alertify.error("Please upload/scan atleaset 1 file to continue");
                return false;
            }


            //if (params.PatientImageStudyId == 0) {
            //    let obj = {
            //        "LogId": 0,
            //        "ModuleId": 2,
            //        "ModuleName": "ASC",
            //        "SubModuleId": 7,
            //        "SubModuleName": "Image Management",
            //        "ScreenType": "ASC List",
            //        "ActionType": 'Added',
            //        "ActionDescription": `Interpretation for order ${params.OrderName} for Appointment ID: ${params.AppointmentId}: ${$scope.LogObj.AppointmentId}`,
            //        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            //    };
            //    $scope.LogObj.LogArray.push(obj);
            //}
            //else {
            //    let count = compareInterpretationOrder(params, $scope.LogObj);
            //    if (count > 0) {
            //        let obj = {
            //            "LogId": 0,
            //            "ModuleId": 2,
            //            "ModuleName": "ASC",
            //            "SubModuleId": 7,
            //            "SubModuleName": "Image Management",
            //            "ScreenType": "ASC List",
            //            "ActionType": 'Edited',
            //            "ActionDescription": `Interpretation for order ${params.OrderName} for Appointment ID: ${params.AppointmentId}: ${$scope.LogObj.AppointmentId}`,
            //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            //        };
            //        $scope.LogObj.LogArray.push(obj);
            //    }
            //}

            $scope.selectedImageStudyObj.IsClickSaveImageStudytBtns = true;
            if (type !== 'Notclose') {
                if (params != "") {
                    let resultInv = $scope.compareImagemanagementdata(params, $scope.LogObj.selectedImageStudyObj);

                    let oldDesc = "";
                    let newDesc = "";

                    if (resultInv.oldDescription || resultInv.newDescription) {

                        let invHeader = "Interpretation\n";

                        if (resultInv.oldDescription) {
                            oldDesc += (oldDesc ? "\n\n" : "") + invHeader + resultInv.oldDescription;
                        }

                        if (resultInv.newDescription) {
                            newDesc += (newDesc ? "\n\n" : "") + invHeader + resultInv.newDescription;
                        }
                    }


                    // Edited or Added
                    if (oldDesc || newDesc) {
                        $scope.LogObj.LogArray.push({
                            LogId: 0,
                            ModuleId: $scope.ModuleId,
                            ModuleName: $scope.ModuleName|| "",
                            SubModuleId: 22,
                            SubModuleName: "Image Management",
                            ScreenType: "Interpretation",
                            ActionType: oldDesc ? "Edited" : "Added",
                            OldActionDescription: oldDesc.trim(),
                            NewActionDescription: newDesc.trim(),
                            ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                        });
                    }
                }
            }
            if ($scope.LogObj.LogArray.length > 0) {
                params.Logs = $scope.LogObj || {};
            }

            eHnotePatientDataService.AddUpdatePatientImageStudyOrderDetails(params, OnAddInterpretationPatientSuccess, OnAddInterpretationPatientError);
        
            function OnAddInterpretationPatientSuccess(response) {

                console.log(response);
                //$uibModalInstance.close('save');
                $scope.selectedImageStudyObj.PatientImageStudyId = response.PatientImageStudyId || 0;
                if (type == 'Notclose') {
                    GetPatientOrderInterpretationDetails();
                    if (response.PatientImageStudyId !== 0) {
                        $scope.getPatientImageStudyDetailsById(response);
                        $scope.selectedImageStudyObj.IsClickSaveImageStudytBtns = false;
                    }
                } else {
                    alertify.success("Added  Successfully");
                    $scope.selectedImageStudyObj.IsClickSaveImageStudytBtns = false;
                    $scope.uibclose();
                }
            }
            function OnAddInterpretationPatientError(error) {
                console.log(error);
                $scope.selectedImageStudyObj.IsClickSaveImageStudytBtns = false;
                alertify.error("Adding  Failed");
            }
        }

        $scope.orderdiagnosisPopover = {
            templateUrl: 'orderdiagnosisPopover.html',
        };
        //$scope.onselectDiagnosisitem = function (val, item) {
        //    var List = $filter("filter")($scope.selectedImageStudyObj.DiagnosisListArray, function (Aitem) {
        //        return (Aitem.DiagnosisId === val.DiagnosisId);
        //    });
        //    if (List.length > 0) {
        //        alertify.error('You have already Selected this Diagnosis');
        //        $scope.selectedImageStudyObj.SelectedDiagObj = "";
        //        return false;
        //    } else {

        //        var obj = {
        //            "PatientImageStudyDiagnosisId": 0,
        //            "DeleteInd": "N",
        //            "DiagnosisId": val.DiagnosisId || 0,
        //            "DiagnosisTypeId": val.DiagnosisTypeId || null,
        //            "ICD10CODE": val.ICD10CODE || null,
        //            "ICD10DIAGDESCRIPTION": val.ICD10DIAGDESCRIPTION || null,
        //            "ICD10DIAGNAME": val.ICD10DIAGNAME || null,
        //        }



        //        $scope.selectedImageStudyObj.DiagnosisListArray.push(obj);
        //        $scope.selectedImageStudyObj.SelectedDiagObj = "";

        //    }



        //}

        $scope.onselectDiagnosisitem = function (val, item) {
            var List = $filter("filter")($scope.selectedImageStudyObj.DiagnosisListArray, function (Aitem) {
                return (Aitem.DiagnosisId === val.DiagnosisId);
            });
            if (List.length > 0) {
                alertify.error('You have already Selected this Diagnosis');
                $scope.selectedImageStudyObj.SelectedDiagObj = "";
                return false;
            } else {

                var obj = {
                    "PatientImageStudyDiagnosisId": 0,
                    "DeleteInd": "N",
                    "DiagnosisId": val.DiagnosisId || 0,
                    "DiagnosisTypeId": val.DiagnosisTypeId || null,
                    "ICD10CODE": val.ICD10CODE || null,
                    "ICD10DIAGDESCRIPTION": val.ICD10DIAGDESCRIPTION || null,
                    "ICD10DIAGNAME": val.ICD10DIAGNAME || null,
                    "OrganId": val.OrganId
                }



                $scope.selectedImageStudyObj.DiagnosisListArray.push(obj);
                $scope.selectedImageStudyObj.SelectedDiagObj = "";

            }



        }


        $scope.addAdvisedDiagnosistoOrder = function (mitem) {
            if (mitem.IsCheckedDiagnosis) {

                var List = $filter("filter")($scope.selectedImageStudyObj.DiagnosisListArray, function (Aitem) {
                    return (Aitem.DiagnosisId === mitem.DiagnosisId);
                });
                if (List.length > 0) {
                    alertify.error('You have already Selected this Diagnosis');
                    return false;
                } else {
                    var obj = {
                        "PatientImageStudyDiagnosisId": 0,
                        "DeleteInd": "N",
                        "DiagnosisId": mitem.DiagnosisId || 0,
                        "DiagnosisTypeId": mitem.DiagnosisTypeId || null,
                        "ICD10CODE": mitem.ICD10CODE || null,
                        "ICD10DIAGDESCRIPTION": mitem.ICD10DIAGDESCRIPTION || null,
                        "ICDCodewithDIAGDESCRIPTION": mitem.ICD10CODE + '-' + mitem.ICD10DIAGDESCRIPTION,
                        "ICD10DIAGNAME": mitem.ICD10DIAGNAME || null,
                    }
                    $scope.selectedImageStudyObj.DiagnosisListArray.push(obj);
                }


            } else {
                for (var i = $scope.selectedImageStudyObj.DiagnosisListArray.length - 1; i >= 0; i--) {
                    if ($scope.selectedImageStudyObj.DiagnosisListArray[i].DiagnosisId === mitem.DiagnosisId) {
                        $scope.selectedImageStudyObj.DiagnosisListArray.splice(i, 1);
                    }
                }
            }

        };



        $scope.TempObj = {
            "IsFindingsTemplateSavePopOver": false,
            "ImageManagementTemplateName": "",
            "ImageManagementTemplates": []
        }
        $scope.ImageManagementTemplateUrl = {
            templateUrl: 'AddImagamanagementTemplate.html',
        };


        function compareInterpretationOrder(NewValue, OldValue) {
            var count = 0;
            NewValue.FundusFindingArray = NewValue.FundusFindingArray || [];
            OldValue.FundusFindingArray = OldValue.FundusFindingArray || [];
            NewValue.FundusFindingArray.forEach(function (Newitem) {
                var differentItem1 = OldValue.FundusFindingArray.filter(function (olditem) {
                    return ((olditem.DeleteInd == Newitem.DeleteInd) && (olditem.FindingId == Newitem.FindingId) && (olditem.FindingValue == Newitem.FindingValue) && (olditem.OrganId == Newitem.OrganId))
                }) || [];
                if (differentItem1.length == 0) {
                    count++;
                }
            });
            NewValue.FAFindingArray = NewValue.FAFindingArray || [];
            OldValue.FAFindingArray = OldValue.FAFindingArray || [];
            NewValue.FAFindingArray.forEach(function (Newitem) {
                var differentItem2 = OldValue.FAFindingArray.filter(function (olditem) {
                    return ((olditem.DeleteInd == Newitem.DeleteInd) && (olditem.FindingId == Newitem.FindingId) && (olditem.FindingValue == Newitem.FindingValue) && (olditem.OrganId == Newitem.OrganId))
                }) || [];
                if (differentItem2.length == 0) {
                    count++;
                }
            });

            NewValue.ICGFindingArray = NewValue.ICGFindingArray || [];
            OldValue.ICGFindingArray = OldValue.ICGFindingArray || [];
            NewValue.ICGFindingArray.forEach(function (Newitem) {
                var differentItem3 = OldValue.ICGFindingArray.filter(function (olditem) {
                    return ((olditem.DeleteInd == Newitem.DeleteInd) && (olditem.FindingId == Newitem.FindingId) && (olditem.FindingValue == Newitem.FindingValue) && (olditem.OrganId == Newitem.OrganId))
                }) || [];
                if (differentItem3.length == 0) {
                    count++;
                }
            });
            if (NewValue.ProviderRemarks != OldValue.ProviderRemarks) {
                count++;
            }
            if (NewValue.TechnicianRemarks != OldValue.TechnicianRemarks) {
                count++;
            }
            if (NewValue.TechnicianId != OldValue.TechnicianId) {
                count++;
            }
            if (NewValue.DoctorId != OldValue.DoctorId) {
                count++;
            }
            console.log(count);
            NewValue.DiagnosisListArray = NewValue.DiagnosisListArray || [];
            OldValue.DiagnosisListArray = OldValue.DiagnosisListArray || [];
            NewValue.DiagnosisListArray.forEach(function (Newitem) {
                var differentItem4 = OldValue.DiagnosisListArray.filter(function (olditem) {
                    return ((olditem.DeleteInd == Newitem.DeleteInd) && (olditem.PatientImageStudyDiagnosisId == Newitem.PatientImageStudyDiagnosisId) && (olditem.DiagnosisId == Newitem.DiagnosisId) && (olditem.ICD10CODE == Newitem.ICD10CODE))
                }) || [];
                if (differentItem4.length == 0) {
                    count++;
                }
            });
            return count;
        }

        $scope.SaveImageManagementTemplates = function () {
            $scope.LogObj.LogArray = [];
            $scope.TempObj.ImageManagementTemplateName = $scope.TempObj.ImageManagementTemplateName || "";

            if ($scope.TempObj.ImageManagementTemplateName == "") {
                alertify.error("please enter template name");
                return;
            }
            $scope.selectedImageStudyObj.ProviderRemarks = $scope.selectedImageStudyObj.ProviderRemarks || "";
            $scope.selectedImageStudyObj.ImageQuality = $scope.selectedImageStudyObj.ImageQuality || "";
            $scope.selectedImageStudyObj.TechnicianRemarks = $scope.selectedImageStudyObj.TechnicianRemarks || "";
            $scope.selectedImageStudyObj.ODEndothelialCellCountValue = $scope.selectedImageStudyObj.ODEndothelialCellCountValue || "";
            $scope.selectedImageStudyObj.OSEndothelialCellCountValue = $scope.selectedImageStudyObj.OSEndothelialCellCountValue|| "";
            $scope.selectedImageStudyObj.ODEndothelialCellDensity = $scope.selectedImageStudyObj.ODEndothelialCellDensity  || "";
            $scope.selectedImageStudyObj.OSEndothelialCellDensity = $scope.selectedImageStudyObj.OSEndothelialCellDensity|| "";
            $scope.selectedImageStudyObj.ODEndoCornealThicknessValue = $scope.selectedImageStudyObj.ODEndoCornealThicknessValue || "";
            $scope.selectedImageStudyObj.OSEndoCornealThicknessValue = $scope.selectedImageStudyObj.OSEndoCornealThicknessValue || "";
            $scope.selectedImageStudyObj.ODK1Value = $scope.selectedImageStudyObj.ODK1Value || "";
            $scope.selectedImageStudyObj.OSK1Value = $scope.selectedImageStudyObj.OSK1Value || "";
            $scope.selectedImageStudyObj.ODK2Value = $scope.selectedImageStudyObj.ODK2Value || "";
            $scope.selectedImageStudyObj.OSK2Value = $scope.selectedImageStudyObj.OSK2Value || "";
            $scope.selectedImageStudyObj.ODCYLValue = $scope.selectedImageStudyObj.ODCYLValue || "";
            $scope.selectedImageStudyObj.OSCYLValue = $scope.selectedImageStudyObj.OSCYLValue || "";
            $scope.selectedImageStudyObj.ODCornealThicknessValue = $scope.selectedImageStudyObj.ODCornealThicknessValue || "";
            $scope.selectedImageStudyObj.OSCornealThicknessValue = $scope.selectedImageStudyObj.OSCornealThicknessValue || "";
            $scope.selectedImageStudyObj.ODOCTMACFindings = $scope.selectedImageStudyObj.ODOCTMACFindings || "";
            $scope.selectedImageStudyObj.OSOCTMACFindings = $scope.selectedImageStudyObj.OSOCTMACFindings || "";
            $scope.selectedImageStudyObj.ODIOLLensValue = $scope.selectedImageStudyObj.ODIOLLensValue || "";
            $scope.selectedImageStudyObj.OSIOLLensValue = $scope.selectedImageStudyObj.OSIOLLensValue || "";
            $scope.selectedImageStudyObj.ODIOLPower = $scope.selectedImageStudyObj.ODIOLPower || "";
            $scope.selectedImageStudyObj.OSIOLPower = $scope.selectedImageStudyObj.OSIOLPower || "";
            $scope.selectedImageStudyObj.ODIOLManufacturer = $scope.selectedImageStudyObj.ODIOLManufacturer || "";
            $scope.selectedImageStudyObj.OSIOLManufacturer = $scope.selectedImageStudyObj.OSIOLManufacturer || "";
            $scope.selectedImageStudyObj.ODFindingValue = $scope.selectedImageStudyObj.ODFindingValue || "";
            $scope.selectedImageStudyObj.OSFindingValue = $scope.selectedImageStudyObj.OSFindingValue || "";
            $scope.selectedImageStudyObj.ODFrequenciesValue = $scope.selectedImageStudyObj.ODFrequenciesValue || "";
            $scope.selectedImageStudyObj.OSFrequenciesValue = $scope.selectedImageStudyObj.OSFrequenciesValue || "";
            $scope.selectedImageStudyObj.ODFixationLoss = $scope.selectedImageStudyObj.ODFixationLoss || "";
            $scope.selectedImageStudyObj.OSFixationLoss = $scope.selectedImageStudyObj.OSFixationLoss || "";
            $scope.selectedImageStudyObj.ODFalsePositiveErrors = $scope.selectedImageStudyObj.ODFalsePositiveErrors || "";
            $scope.selectedImageStudyObj.OSFalsePositiveErrors = $scope.selectedImageStudyObj.OSFalsePositiveErrors || "";
            $scope.selectedImageStudyObj.ODFalseNegitiveErrors = $scope.selectedImageStudyObj.ODFalseNegitiveErrors || "";
            $scope.selectedImageStudyObj.OSFalseNegitiveErrors = $scope.selectedImageStudyObj.OSFalseNegitiveErrors || "";
            $scope.selectedImageStudyObj.ODTDProbabilityPlot = $scope.selectedImageStudyObj.ODTDProbabilityPlot || "";
            $scope.selectedImageStudyObj.OSTDProbabilityPlot = $scope.selectedImageStudyObj.OSTDProbabilityPlot || "";
            $scope.selectedImageStudyObj.ODPDProbabilityPlot = $scope.selectedImageStudyObj.ODPDProbabilityPlot || "";
            $scope.selectedImageStudyObj.OSPDProbabilityPlot = $scope.selectedImageStudyObj.OSPDProbabilityPlot || "";
            $scope.selectedImageStudyObj.ODMeanDeviation = $scope.selectedImageStudyObj.ODMeanDeviation  || "";
            $scope.selectedImageStudyObj.OSMeanDeviation = $scope.selectedImageStudyObj.OSMeanDeviation || "";
            $scope.selectedImageStudyObj.ODPatternStandardDeviation = $scope.selectedImageStudyObj.ODPatternStandardDeviation || "";
            $scope.selectedImageStudyObj.OSPatternStandardDeviation = $scope.selectedImageStudyObj.OSPatternStandardDeviation|| "";
            $scope.selectedImageStudyObj.ODVisualFieldIndex = $scope.selectedImageStudyObj.ODVisualFieldIndex  || "";
            $scope.selectedImageStudyObj.OSVisualFieldIndex = $scope.selectedImageStudyObj.OSVisualFieldIndex || "";
            $scope.selectedImageStudyObj.ODGHTValue = $scope.selectedImageStudyObj.ODGHTValue || "";
            $scope.selectedImageStudyObj.OSGHTValue = $scope.selectedImageStudyObj.OSGHTValue || "";
            $scope.selectedImageStudyObj.ODHVFFindingValue = $scope.selectedImageStudyObj.ODHVFFindingValue || "";
            $scope.selectedImageStudyObj.OSHVFFindingValue = $scope.selectedImageStudyObj.OSHVFFindingValue || "";
            $scope.selectedImageStudyObj.ODASOCTfindingValue = $scope.selectedImageStudyObj.ODASOCTfindingValue || "";
            $scope.selectedImageStudyObj.OSASOCTfindingValue = $scope.selectedImageStudyObj.OSASOCTfindingValue || "";
            $scope.selectedImageStudyObj.ODRHFLThickNess = $scope.selectedImageStudyObj.ODRHFLThickNess || "";
            $scope.selectedImageStudyObj.OSRHFLThickNess = $scope.selectedImageStudyObj.OSRHFLThickNess || "";
            $scope.selectedImageStudyObj.ODMacularThickNess = $scope.selectedImageStudyObj.ODMacularThickNess || "";
            $scope.selectedImageStudyObj.OSMacularThickNess = $scope.selectedImageStudyObj.OSMacularThickNess || "";
            $scope.selectedImageStudyObj.MacularFindingArray = $scope.selectedImageStudyObj.MacularFindingArray || [];
            $scope.selectedImageStudyObj.ICGFindingArray = $scope.selectedImageStudyObj.ICGFindingArray || [];
            $scope.selectedImageStudyObj.ONFindingArray = $scope.selectedImageStudyObj.ONFindingArray || [];
            $scope.selectedImageStudyObj.FundusFindingArray = $scope.selectedImageStudyObj.FundusFindingArray|| [];
            $scope.selectedImageStudyObj.FAFindingArray = $scope.selectedImageStudyObj.FAFindingArray|| [];
            if ($scope.selectedImageStudyObj.ProviderRemarks == "" && $scope.selectedImageStudyObj.TechnicianRemarks == "") {
                alertify.error("please enter any remarks to create template");
                return;
            }

            var params = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "ImagemanagementTemplateId": 0,
                "ModalityId": $scope.selectedImageStudyObj.ModalityId,
                "TemplateName": $scope.TempObj.ImageManagementTemplateName,
                "ProviderNotes": $scope.selectedImageStudyObj.ProviderRemarks,
                "MacularFindingArray": $scope.selectedImageStudyObj.MacularFindingArray,
                "ICGFindingArray": $scope.selectedImageStudyObj.ICGFindingArray,
                "ONFindingArray": $scope.selectedImageStudyObj.ONFindingArray,
                "FundusFindingArray": $scope.selectedImageStudyObj.FundusFindingArray,
                "FAFindingArray": $scope.selectedImageStudyObj.FAFindingArray,
                "ImageQuality": $scope.selectedImageStudyObj.ImageQuality,
                "ODEndothelialCellCountValue": $scope.selectedImageStudyObj.ODEndothelialCellCountValue,
                "OSEndothelialCellCountValue": $scope.selectedImageStudyObj.OSEndothelialCellCountValue,
                "ODEndothelialCellDensity": $scope.selectedImageStudyObj.ODEndothelialCellDensity,
                "OSEndothelialCellDensity": $scope.selectedImageStudyObj.OSEndothelialCellDensity,
                "ODEndoCornealThicknessValue": $scope.selectedImageStudyObj.ODEndoCornealThicknessValue,
                "OSEndoCornealThicknessValue": $scope.selectedImageStudyObj.OSEndoCornealThicknessValue,
                 "ODK1Value": $scope.selectedImageStudyObj.ODK1Value,
                "OSK1Value": $scope.selectedImageStudyObj.OSK1Value,
                "ODK2Value": $scope.selectedImageStudyObj.ODK2Value,
                "OSK2Value": $scope.selectedImageStudyObj.OSK2Value,
                "ODCYLValue": $scope.selectedImageStudyObj.ODCYLValue,
                "OSCYLValue": $scope.selectedImageStudyObj.OSCYLValue,
                "ODCornealThicknessValue": $scope.selectedImageStudyObj.ODCornealThicknessValue,
                "OSCornealThicknessValue": $scope.selectedImageStudyObj.OSCornealThicknessValue,
                "ODASOCTfindingValue": $scope.selectedImageStudyObj.ODASOCTfindingValue,
                "OSASOCTfindingValue": $scope.selectedImageStudyObj.OSASOCTfindingValue,
                "ODRHFLThickNess": $scope.selectedImageStudyObj.ODRHFLThickNess,
                "OSRHFLThickNess": $scope.selectedImageStudyObj.OSRHFLThickNess,
                "ODMacularThickNess": $scope.selectedImageStudyObj.ODMacularThickNess,
                "OSMacularThickNess": $scope.selectedImageStudyObj.OSMacularThickNess,
                "ODIOLLensValue": $scope.selectedImageStudyObj.ODIOLLensValue,
                "OSIOLLensValue": $scope.selectedImageStudyObj.OSIOLLensValue,
                "ODIOLPower": $scope.selectedImageStudyObj.ODIOLPower,
                "OSIOLPower": $scope.selectedImageStudyObj.OSIOLPower,
                "ODIOLManufacturer": $scope.selectedImageStudyObj.ODIOLManufacturer,
                "OSIOLManufacturer": $scope.selectedImageStudyObj.OSIOLManufacturer,
                "ODOCTMACFindings": $scope.selectedImageStudyObj.ODOCTMACFindings,
                "OSOCTMACFindings": $scope.selectedImageStudyObj.OSOCTMACFindings,
                 "ODFindingValue": $scope.selectedImageStudyObj.ODFindingValue,
                "OSFindingValue": $scope.selectedImageStudyObj.OSFindingValue,
                "ODFrequenciesValue": $scope.selectedImageStudyObj.ODFrequenciesValue,
                "OSFrequenciesValue": $scope.selectedImageStudyObj.OSFrequenciesValue,
                "ODFixationLoss": $scope.selectedImageStudyObj.ODFixationLoss,
                "OSFixationLoss": $scope.selectedImageStudyObj.OSFixationLoss,
                "ODFalsePositiveErrors": $scope.selectedImageStudyObj.ODFalsePositiveErrors,
                "OSFalsePositiveErrors": $scope.selectedImageStudyObj.OSFalsePositiveErrors,
                "ODFalseNegitiveErrors": $scope.selectedImageStudyObj.ODFalseNegitiveErrors,
                "OSFalseNegitiveErrors": $scope.selectedImageStudyObj.OSFalseNegitiveErrors,
                "ODTDProbabilityPlot": $scope.selectedImageStudyObj.ODTDProbabilityPlot,
                "OSTDProbabilityPlot": $scope.selectedImageStudyObj.OSTDProbabilityPlot,
                "ODPDProbabilityPlot": $scope.selectedImageStudyObj.ODPDProbabilityPlot,
                "OSPDProbabilityPlot": $scope.selectedImageStudyObj.OSPDProbabilityPlot,
               "ODMeanDeviation": $scope.selectedImageStudyObj.ODMeanDeviation,
                "OSMeanDeviation": $scope.selectedImageStudyObj.OSMeanDeviation,
                "ODPatternStandardDeviation": $scope.selectedImageStudyObj.ODPatternStandardDeviation,
                "OSPatternStandardDeviation": $scope.selectedImageStudyObj.OSPatternStandardDeviation,
                "ODVisualFieldIndex": $scope.selectedImageStudyObj.ODVisualFieldIndex,
                "OSVisualFieldIndex": $scope.selectedImageStudyObj.OSVisualFieldIndex,
                "ODGHTValue": $scope.selectedImageStudyObj.ODGHTValue,
                "OSGHTValue": $scope.selectedImageStudyObj.OSGHTValue,
                "ODHVFFindingValue": $scope.selectedImageStudyObj.ODHVFFindingValue,
                "OSHVFFindingValue": $scope.selectedImageStudyObj.OSHVFFindingValue,
                "TechnicianNotes": $scope.selectedImageStudyObj.TechnicianRemarks,
                "DeleteInd": "N",
                "DiagnosisList": [],
                "Logs": {}
            }

            // ---------- LOG FOR TEMPLATE SAVE ----------
            let interpretationText = formatInterpretationResultTemplate($scope.selectedImageStudyObj);

            if (interpretationText && interpretationText.trim() !== "") {

                let logText = "Interpretation\n" + interpretationText;

                $scope.LogObj.LogArray.push({
                    LogId: 0,
                    ModuleId: $scope.ModuleId,
                    ModuleName: $scope.ModuleName || "",
                    SubModuleId: 22,
                    SubModuleName: "Image Study",
                    ScreenType: "Interpretation Template",
                    ActionType: "Added",
                    OldActionDescription: "",
                    NewActionDescription: `Template Name : ${$scope.TempObj.ImageManagementTemplateName}\n\nAdded in Template :\n${logText.trim()}`,
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                });
            }

            angular.forEach($scope.selectedImageStudyObj.DiagnosisListArray, function (ditem) {
                var diagobj = {
                    "DiagnosisDetailId": 0,
                    "DeleteInd": "N",
                    "DiagnosisId": ditem.DiagnosisId,
                    "DiagnosisTypeId": ditem.DiagnosisTypeId,
                    "DiagnosisCode": ditem.ICD10CODE,
                    "DiagnosisDescription": ditem.ICD10DIAGDESCRIPTION,
                    "DiagnosisName": ditem.ICD10DIAGNAME
                }
                params.DiagnosisList.push(diagobj);
            });


            console.log(params);
            //if ($scope.LogObj.LogArray.length > 0) {
            //    params.Logs = $scope.LogObj || {};
            //}

            eHnotePatientDataService.AddUpdateOrganizationImagemanagementTemplate(params).then(function (resp) {



                console.log(resp);

                if (resp.data.Status == "Success") {
                    alertify.success("Template Added Successfully");
                    $scope.TempObj.ImageManagementTemplateName = "";
                    $scope.TempObj.IsFindingsTemplateSavePopOver = false;
                    $scope.GetOrganizationImagemanagementTemplate();
                } else {
                    $scope.TempObj.ImageManagementTemplateName = "";
                    alertify.error("Template Name Already Exists");
                }

            }, function (err) {
                console.log(err);
                alertify.error("Getting Failed");
            });
        }

        $scope.GetOrganizationImagemanagementTemplate = function () {
            let req = {
                "OrganizationId": $scope.HospitalId,
                "UserId": $scope.UserId,
                /*"ModalityId": $scope.studyViewGetObj.ModalityId || 0*/
                "ModalityId": $scope.selectedImageStudyObj.ModalityId || 0
            };

            eHnotePatientDataService.GetOrganizationImagemanagementTemplate(req).then(function (resp) {

                console.log(JSON.stringify(resp));

                if (resp.data.status == "Success") {

                    $scope.TempObj.ImageManagementTemplates = angular.copy(resp.data.rows);
                }



            });
        };
        $scope.GetOrganizationImagemanagementTemplate();
        $scope.OnselectImageManagementTemplate = function (obj) {
            console.log(obj);

            $scope.selectedImageStudyObj.ProviderRemarks = obj.ProviderNotes || "";
            $scope.selectedImageStudyObj.TechnicianRemarks = obj.TechnicianNotes || "";
            $scope.selectedImageStudyObj.ImageQuality = obj.ImageQuality || "";
            $scope.selectedImageStudyObj.ODEndothelialCellCountValue = obj.ODEndothelialCellCountValue || "";
            $scope.selectedImageStudyObj.OSEndothelialCellCountValue = obj.OSEndothelialCellCountValue || "";
            $scope.selectedImageStudyObj.ODEndothelialCellDensity = obj.ODEndothelialCellDensity || "";
            $scope.selectedImageStudyObj.OSEndothelialCellDensity = obj.OSEndothelialCellDensity || "";
            $scope.selectedImageStudyObj.ODEndoCornealThicknessValue = obj.ODEndoCornealThicknessValue || "";
            $scope.selectedImageStudyObj.OSEndoCornealThicknessValue = obj.OSEndoCornealThicknessValue || "";
            $scope.selectedImageStudyObj.ODK1Value = obj.ODK1Value || "";
            $scope.selectedImageStudyObj.OSK1Value = obj.OSK1Value || "";
            $scope.selectedImageStudyObj.ODK2Value = obj.ODK2Value || "";
            $scope.selectedImageStudyObj.OSK2Value = obj.OSK2Value || "";
            $scope.selectedImageStudyObj.ODCYLValue = obj.ODCYLValue || "";
            $scope.selectedImageStudyObj.OSCYLValue = obj.OSCYLValue || "";
            $scope.selectedImageStudyObj.ODCornealThicknessValue = obj.ODCornealThicknessValue || "";
            $scope.selectedImageStudyObj.ODOCTMACFindings = obj.ODOCTMACFindings || "";
            $scope.selectedImageStudyObj.OSOCTMACFindings = obj.OSOCTMACFindings || "";
            $scope.selectedImageStudyObj.ODIOLLensValue = obj.ODIOLLensValue || "";
            $scope.selectedImageStudyObj.OSIOLLensValue = obj.OSIOLLensValue || "";
            $scope.selectedImageStudyObj.ODIOLPower = obj.ODIOLPower || "";
            $scope.selectedImageStudyObj.OSIOLPower = obj.OSIOLPower || "";
            $scope.selectedImageStudyObj.ODIOLManufacturer = obj.ODIOLManufacturer || "";
            $scope.selectedImageStudyObj.OSIOLManufacturer = obj.OSIOLManufacturer || "";
            $scope.selectedImageStudyObj.ODFindingValue = obj.ODFindingValue || "";
            $scope.selectedImageStudyObj.OSFindingValue = obj.OSFindingValue || "";
            $scope.selectedImageStudyObj.ODFrequenciesValue = obj.ODFrequenciesValue || "";
            $scope.selectedImageStudyObj.OSFrequenciesValue = obj.OSFrequenciesValue || "";
            $scope.selectedImageStudyObj.ODASOCTfindingValue = obj.ODASOCTfindingValue || "";
            $scope.selectedImageStudyObj.OSASOCTfindingValue = obj.OSASOCTfindingValue || "";
            $scope.selectedImageStudyObj.ODRHFLThickNess = obj.ODRHFLThickNess || "";
            $scope.selectedImageStudyObj.ODMacularThickNess = obj.ODMacularThickNess || "";
            $scope.selectedImageStudyObj.OSRHFLThickNess = obj.OSRHFLThickNess || "";
            $scope.selectedImageStudyObj.OSMacularThickNess = obj.OSMacularThickNess || "";
            $scope.selectedImageStudyObj.OSCornealThicknessValue = obj.OSCornealThicknessValue || "";
            $scope.selectedImageStudyObj.ODFixationLoss = obj.ODFixationLoss || "";
            $scope.selectedImageStudyObj.OSFixationLoss = obj.OSFixationLoss || "";
            $scope.selectedImageStudyObj.ODFalsePositiveErrors = obj.ODFalsePositiveErrors || "";
            $scope.selectedImageStudyObj.OSFalsePositiveErrors = obj.OSFalsePositiveErrors || "";
            $scope.selectedImageStudyObj.ODFalseNegitiveErrors = obj.ODFalseNegitiveErrors || "";
            $scope.selectedImageStudyObj.OSFalseNegitiveErrors = obj.OSFalseNegitiveErrors || "";
            $scope.selectedImageStudyObj.ODTDProbabilityPlot = obj.ODTDProbabilityPlot || "";
            $scope.selectedImageStudyObj.OSTDProbabilityPlot = obj.OSTDProbabilityPlot || "";
            $scope.selectedImageStudyObj.ODPDProbabilityPlot = obj.ODPDProbabilityPlot || "";
            $scope.selectedImageStudyObj.OSPDProbabilityPlot = obj.OSPDProbabilityPlot || "";
            $scope.selectedImageStudyObj.ODMeanDeviation = obj.ODMeanDeviation || "";
            $scope.selectedImageStudyObj.OSMeanDeviation = obj.OSMeanDeviation || "";
            $scope.selectedImageStudyObj.ODPatternStandardDeviation = obj.ODPatternStandardDeviation || "";
            $scope.selectedImageStudyObj.OSPatternStandardDeviation = obj.OSPatternStandardDeviation || "";
            $scope.selectedImageStudyObj.ODVisualFieldIndex = obj.ODVisualFieldIndex || "";
            $scope.selectedImageStudyObj.OSVisualFieldIndex = obj.OSVisualFieldIndex || "";
            $scope.selectedImageStudyObj.ODGHTValue = obj.ODGHTValue || "";
            $scope.selectedImageStudyObj.OSGHTValue = obj.OSGHTValue || "";
            $scope.selectedImageStudyObj.ODHVFFindingValue = obj.ODHVFFindingValue || "";
            $scope.selectedImageStudyObj.OSHVFFindingValue = obj.OSHVFFindingValue || "";

            if (obj.MacularFindingArray.length > 0) {
                angular.forEach(obj.MacularFindingArray, function (item) {

                    if (item.OrganId == 1) {
                        var obj = {

                            "InterpretationFindingId": 0,
                            "FindingTemplateId": 0,
                            "FindingId": item.FindingId,
                            "FindingValue": item.FindingValue,
                            "DeleteInd": "N",
                            "OrganId": 1,
                            "TypeId": 2
                        }

                        let editedIVCondition = $filter("filter")($scope.selectedImageStudyObj.MacularFindingArray, function (fitem) {
                            return fitem.FindingId === item.FindingId;
                        }) || [];
                        if (editedIVCondition.length == 0) {
                            $scope.selectedImageStudyObj.MacularFindingArray.push(obj);
                        }
                    }
                    if (item.OrganId == 2) {
                        var obj = {

                            "InterpretationFindingId": 0,
                            "FindingTemplateId": 0,
                            "FindingId": item.FindingId,
                            "FindingValue": item.FindingValue,
                            "DeleteInd": "N",
                            "OrganId": 2,
                            "TypeId": 2
                        }

                        let EditedIVCondition = $filter("filter")($scope.selectedImageStudyObj.MacularFindingArray, function (fitem) {
                            return fitem.FindingId === item.FindingId;
                        }) || [];
                        if (EditedIVCondition.length == 0) {
                            $scope.selectedImageStudyObj.MacularFindingArray.push(obj);
                        }
                    }

                });

            }


            if (obj.ICGFindingArray.length > 0) {

                angular.forEach(obj.ICGFindingArray, function (item) {

                    if (item.OrganId == 1) {
                        var obj = {

                            "InterpretationFindingId": 0,
                            "FindingTemplateId": 0,
                            "FindingId": item.FindingId,
                            "FindingValue": item.FindingValue,
                            "DeleteInd": "N",
                            "OrganId": 1,
                            "TypeId": 2
                        }

                        let editedIVCondition = $filter("filter")($scope.selectedImageStudyObj.ICGFindingArray, function (fitem) {
                            return fitem.FindingId === item.FindingId;
                        }) || [];
                        if (editedIVCondition.length == 0) {
                            $scope.selectedImageStudyObj.ICGFindingArray.push(obj);
                        }
                    }
                    if (item.OrganId == 2) {
                        var obj = {

                            "InterpretationFindingId": 0,
                            "FindingTemplateId": 0,
                            "FindingId": item.FindingId,
                            "FindingValue": item.FindingValue,
                            "DeleteInd": "N",
                            "OrganId": 2,
                            "TypeId": 2
                        }

                        let EditedIVCondition = $filter("filter")($scope.selectedImageStudyObj.ICGFindingArray, function (fitem) {
                            return fitem.FindingId === item.FindingId;
                        }) || [];
                        if (EditedIVCondition.length == 0) {
                            $scope.selectedImageStudyObj.ICGFindingArray.push(obj);
                        }
                    }

                });
            }
          
            if (obj.ONFindingArray.length > 0) {
                angular.forEach(obj.ONFindingArray, function (item) {

                    if (item.OrganId == 1) {
                        var obj = {

                            "InterpretationFindingId": 0,
                            "FindingTemplateId": 0,
                            "FindingId": item.FindingId,
                            "FindingValue": item.FindingValue,
                            "DeleteInd": "N",
                            "OrganId": 1,
                            "TypeId": 2
                        }

                        let ONFinding = $filter("filter")($scope.selectedImageStudyObj.ONFindingArray, function (fitem) {
                            return fitem.FindingId === item.FindingId;
                        }) || [];
                        if (ONFinding.length == 0) {
                            $scope.selectedImageStudyObj.ONFindingArray.push(obj);
                        }
                    }
                    if (item.OrganId == 2) {
                        var obj = {

                            "InterpretationFindingId": 0,
                            "FindingTemplateId": 0,
                            "FindingId": item.FindingId,
                            "FindingValue": item.FindingValue,
                            "DeleteInd": "N",
                            "OrganId": 2,
                            "TypeId": 2
                        }

                        let ONFinding2 = $filter("filter")($scope.selectedImageStudyObj.ONFindingArray, function (fitem) {
                            return fitem.FindingId === item.FindingId;
                        }) || [];
                        if (ONFinding2.length == 0) {
                            $scope.selectedImageStudyObj.ONFindingArray.push(obj);
                        }
                    }

                });
            }
            if (obj.FundusFindingArray.length > 0) {
                angular.forEach(obj.FundusFindingArray, function (item) {

                    if (item.OrganId == 1) {
                        var obj = {

                            "InterpretationFindingId": 0,
                            "FindingTemplateId": 0,
                            "FindingId": item.FindingId,
                            "FindingValue": item.FindingValue,
                            "DeleteInd": "N",
                            "OrganId": 1,
                            "TypeId": 2
                        }

                        let FundusFinding = $filter("filter")($scope.selectedImageStudyObj.FundusFindingArray, function (fitem) {
                            return fitem.FindingId === item.FindingId;
                        }) || [];
                        if (FundusFinding.length == 0) {
                            $scope.selectedImageStudyObj.FundusFindingArray.push(obj);
                        }
                    }
                    if (item.OrganId == 2) {
                        var obj = {

                            "InterpretationFindingId": 0,
                            "FindingTemplateId": 0,
                            "FindingId": item.FindingId,
                            "FindingValue": item.FindingValue,
                            "DeleteInd": "N",
                            "OrganId": 2,
                            "TypeId": 2
                        }

                        let FundusFinding2 = $filter("filter")($scope.selectedImageStudyObj.FundusFindingArray, function (fitem) {
                            return fitem.FindingId === item.FindingId;
                        }) || [];
                        if (FundusFinding2.length == 0) {
                            $scope.selectedImageStudyObj.FundusFindingArray.push(obj);
                        }
                    }

                });
            }

            if (obj.FAFindingArray.length > 0) {
                angular.forEach(obj.FAFindingArray, function (item) {

                    if (item.OrganId == 1) {
                        var obj = {

                            "InterpretationFindingId": 0,
                            "FindingTemplateId": 0,
                            "FindingId": item.FindingId,
                            "FindingValue": item.FindingValue,
                            "DeleteInd": "N",
                            "OrganId": 1,
                            "TypeId": 2
                        }

                        let FAFinding = $filter("filter")($scope.selectedImageStudyObj.FAFindingArray, function (fitem) {
                            return fitem.FindingId === item.FindingId;
                        }) || [];
                        if (FAFinding.length == 0) {
                            $scope.selectedImageStudyObj.FAFindingArray.push(obj);
                        }
                    }
                    if (item.OrganId == 2) {
                        var obj = {

                            "InterpretationFindingId": 0,
                            "FindingTemplateId": 0,
                            "FindingId": item.FindingId,
                            "FindingValue": item.FindingValue,
                            "DeleteInd": "N",
                            "OrganId": 2,
                            "TypeId": 2
                        }

                        let FAFinding2 = $filter("filter")($scope.selectedImageStudyObj.FAFindingArray, function (fitem) {
                            return fitem.FindingId === item.FindingId;
                        }) || [];
                        if (FAFinding2.length == 0) {
                            $scope.selectedImageStudyObj.FAFindingArray.push(obj);
                        }
                    }

                });

            }

              
            $scope.selectedImageStudyObj.DiagnosisListArray = [];

            if (obj.DiagnosisList.length > 0) {
                angular.forEach(obj.DiagnosisList, function (ditem) {
                    var newobj = {
                        "PatientImageStudyDiagnosisId": 0,
                        "DeleteInd": "N",
                        "DiagnosisId": ditem.DiagnosisId || 0,
                        "DiagnosisTypeId": ditem.DiagnosisTypeId || 0,
                        "ICD10CODE": ditem.DiagnosisCode || "",
                        "ICD10DIAGDESCRIPTION": ditem.DiagnosisDescription || "",
                        "ICD10DIAGNAME": ditem.DiagnosisName || "",
                    }

                    var filteredDiags = $filter("filter")($scope.selectedImageStudyObj.DiagnosisListArray, { "DiagnosisId": ditem.DiagnosisId }, true) || [];

                    if (filteredDiags.length === 0) {
                        $scope.selectedImageStudyObj.DiagnosisListArray.push(newobj);
                    }
                });


            }
        };

        $scope.addtemplatepopover = function () {
            $scope.TempObj.IsFindingsTemplateSavePopOver = true;
            $scope.TempObj.ImageManagementTemplateName = '';
        };

        $scope.OpenFindingPopover = function (Item) {
            $scope.ExamFinfingNotes = Item.Notes || "";
            Item.IsShowNotesTextBox = true;
        };
        $scope.SaveExamNotesPopup = function (Item, Note) {
            Item.Notes = Note || "";
            Item.IsShowNotesTextBox = false;
        };
        $scope.anteriorPosteriorNotes = {
            templateUrl: 'anteriorPosteriorNotes.html',
        };

        $scope.CopyToOS = function (Mitem, item, organ, CategoryId) {
            var temparray = $filter("filter")($scope.FindingCheckValuesList, { "CategoryId": CategoryId }, true);
            var countList = [];
            countList = $filter("filter")(Mitem.RemarksArray, function (fitem, index) { return fitem.InvFindingId === item.InvFindingId && fitem.OrganId === organ && fitem.ActiveInd == 'Y' });

            if (organ == 1) {
                if (countList.length !== 0) {
                    alertify.error("This item already exists in the OD");
                    return false;
                }
            }
            if (organ == 2) {
                if (countList.length !== 0) {
                    alertify.error("This item already exists in the OS");
                    return false;
                }
            }


            if (Mitem.RemarksArray.length > 0) {
                angular.forEach(Mitem.RemarksArray, function (hitem, index) {
                    angular.forEach(temparray, function (tempitem) {
                        if (hitem.InvFindingId === tempitem.InvFindingId && hitem.OrganId == organ) {
                            if (hitem.RemarksId === 0) {
                                Mitem.RemarksArray.splice(index, 1);
                            }
                            else {
                                hitem.ActiveInd = 'N';
                            }
                        }
                    });
                });
            }

            if (organ == 1) {
                var obj = {
                    "RemarksId": 0,
                    "InvFindingId": item.InvFindingId || 0,
                    "FindingValue": item.FindingValue || '',
                    "OrganId": 1,
                    "FindingId": item.FindingId || 0,
                    "FindingName": item.FindingName || '',
                    "Notes": item.Notes || '',
                    "DiagnosisRiskLevel": "",
                    "ActiveInd": "Y",
                    "SubFindingList": item.SubFindingList || [],
                    "StampsArray": []
                }
                item.StampsArray = item.StampsArray || [];
                if (item.StampsArray.length > 0) {
                    var filteredStamps = item.StampsArray.filter(function (stamp) {
                        return stamp.OrganId === obj.OrganId;
                    });

                    // Assign filtered stamps to obj.StampsArray
                    obj.StampsArray = filteredStamps || [];
                }
                Mitem.RemarksArray.push(obj);
            } else if (organ == 2) {
                var obj = {
                    "RemarksId": 0,
                    "InvFindingId": item.InvFindingId || 0,
                    "FindingValue": item.FindingValue || '',
                    "OrganId": 2,
                    "FindingId": item.FindingId || 0,
                    "FindingName": item.FindingName || '',
                    "Notes": item.Notes || '',
                    "DiagnosisRiskLevel": "",
                    "ActiveInd": "Y",
                    "SubFindingList": item.SubFindingList || [],
                    "StampsArray": [],
                }
                item.StampsArray = item.StampsArray || [];
                if (item.StampsArray.length > 0) {
                    var filteredStamps = item.StampsArray.filter(function (stamp) {
                        return stamp.OrganId === obj.OrganId;
                    });

                    // Assign filtered stamps to obj.StampsArray
                    obj.StampsArray = filteredStamps || [];
                }
                Mitem.RemarksArray.push(obj);
            }

        };

        $scope.removeRightAnteriorNew = function (item, inv) {

            angular.forEach(inv.RemarksArray, function (hitem, index) {
                if (hitem.InvFindingId === item.InvFindingId && hitem.OrganId == item.OrganId) {
                    if (hitem.RemarksId === 0) {
                        inv.RemarksArray.splice(index, 1);
                    }
                    else {
                        hitem.ActiveInd = 'N';
                    }
                    if (inv.CategoryId === 5) {
                        $scope.cacheStorageItem.AnteriorODIsNormal = false;
                        //    $scope.cacheStorageItem.AnteriorOSIsNormal = false;
                    }
                    if (inv.CategoryId === 6) {
                        $scope.cacheStorageItem.PosteriorODIsNormal = false;
                        //    $scope.cacheStorageItem.PosteriorOSIsNormal = false;
                    }
                }
            });
        };

        $scope.removeLeftAnteriorNew = function (item, inv) {
            angular.forEach(inv.RemarksArray, function (hitem, index) {
                if (hitem.InvFindingId === item.InvFindingId && hitem.OrganId == item.OrganId) {
                    if (hitem.RemarksId === 0) {
                        inv.RemarksArray.splice(index, 1);
                    }
                    else {
                        hitem.ActiveInd = 'N';
                    }
                    if (inv.CategoryId === 5) {
                        //$scope.cacheStorageItem.AnteriorODIsNormal = false;
                        $scope.cacheStorageItem.AnteriorOSIsNormal = false;
                    }
                    if (inv.CategoryId === 6) {
                        //$scope.cacheStorageItem.PosteriorODIsNormal = false;
                        $scope.cacheStorageItem.PosteriorOSIsNormal = false;
                    }
                }
            });
        };

        $scope.GetFindingCheckValues = function () {
            eHnotePatientAddressDataServices.FindingCheckValues().then(function (resp) {
                $scope.FindingCheckValuesList = resp.data;
            }, function (err) {
                console.log(err);
                alertify.error("Getting FindingCheckValues Failed");
            });
        };






        // Delete
        $scope.RemovePosterioFundusData = function (item, type) {
            if (type == 'OD') {
                var index = $scope.selectedImageStudyObj.FundusFindingArray.indexOf(item);
                if (item.InterpretationFindingId === 0) {
                    if (index > -1) {
                        $scope.selectedImageStudyObj.FundusFindingArray.splice(index, 1);

                    }
                } else {
                    $scope.selectedImageStudyObj.FundusFindingArray[index].DeleteInd = 'Y';
                }
            } else {
                var index = $scope.selectedImageStudyObj.FundusFindingArray.indexOf(item);
                if (item.InterpretationFindingId === 0) {
                    if (index > -1) {
                        $scope.selectedImageStudyObj.FundusFindingArray.splice(index, 1);

                    }
                } else {
                    $scope.selectedImageStudyObj.FundusFindingArray[index].DeleteInd = 'Y';
                }

            }

        }


        $scope.RemovePosteriorFAData = function (item, type) {
            if (type == 'OD') {
                var index = $scope.selectedImageStudyObj.FAFindingArray.indexOf(item);
                if (item.InterpretationFindingId === 0) {
                    if (index > -1) {
                        $scope.selectedImageStudyObj.FAFindingArray.splice(index, 1);

                    }
                } else {
                    $scope.selectedImageStudyObj.FAFindingArray[index].DeleteInd = 'Y';
                }
            } else {
                var index = $scope.selectedImageStudyObj.FAFindingArray.indexOf(item);
                if (item.InterpretationFindingId === 0) {
                    if (index > -1) {
                        $scope.selectedImageStudyObj.FAFindingArray.splice(index, 1);

                    }
                } else {
                    $scope.selectedImageStudyObj.FAFindingArray[index].DeleteInd = 'Y';
                }

            }

        }

        $scope.RemovePosteriorICGData = function (item, type) {
            if (type == 'OD') {
                var index = $scope.selectedImageStudyObj.ICGFindingArray.indexOf(item);
                if (item.InterpretationFindingId === 0) {
                    if (index > -1) {
                        $scope.selectedImageStudyObj.ICGFindingArray.splice(index, 1);

                    }
                } else {
                    $scope.selectedImageStudyObj.ICGFindingArray[index].DeleteInd = 'Y';
                }
            } else {
                var index = $scope.selectedImageStudyObj.ICGFindingArray.indexOf(item);
                if (item.InterpretationFindingId === 0) {
                    if (index > -1) {
                        $scope.selectedImageStudyObj.ICGFindingArray.splice(index, 1);

                    }
                } else {
                    $scope.selectedImageStudyObj.ICGFindingArray[index].DeleteInd = 'Y';
                }

            }

        }


        $scope.RemovePosteriorMacuData = function (item, type) {
            if (type == 'OD') {
                var index = $scope.selectedImageStudyObj.MacularFindingArray.indexOf(item);
                if (item.InterpretationFindingId === 0) {
                    if (index > -1) {
                        $scope.selectedImageStudyObj.MacularFindingArray.splice(index, 1);

                    }
                } else {
                    $scope.selectedImageStudyObj.MacularFindingArray[index].DeleteInd = 'Y';
                }
            } else {
                var index = $scope.selectedImageStudyObj.MacularFindingArray.indexOf(item);
                if (item.InterpretationFindingId === 0) {
                    if (index > -1) {
                        $scope.selectedImageStudyObj.MacularFindingArray.splice(index, 1);

                    }
                } else {
                    $scope.selectedImageStudyObj.MacularFindingArray[index].DeleteInd = 'Y';
                }

            }

        }


        $scope.RemovePosteriorONData = function (item, type) {
            if (type == 'OD') {
                var index = $scope.selectedImageStudyObj.ONFindingArray.indexOf(item);
                if (item.InterpretationFindingId === 0) {
                    if (index > -1) {
                        $scope.selectedImageStudyObj.ONFindingArray.splice(index, 1);

                    }
                } else {
                    $scope.selectedImageStudyObj.ONFindingArray[index].DeleteInd = 'Y';
                }
            } else {
                var index = $scope.selectedImageStudyObj.ONFindingArray.indexOf(item);
                if (item.InterpretationFindingId === 0) {
                    if (index > -1) {
                        $scope.selectedImageStudyObj.ONFindingArray.splice(index, 1);

                    }
                } else {
                    $scope.selectedImageStudyObj.ONFindingArray[index].DeleteInd = 'Y';
                }
            }
        }


        $scope.selectedEyeFiles = function (files, eye) {
            if (files == null || files == "") {
                return false;
            }
            if ($scope.orderPopupObj.IsNewOrder) {
                var invId = parseFloat($scope.selectedImageStudyObj.ProcedureId) || 0;
                if (invId === 0) {
                    alertify.error("Please select an Investigation");
                    return false;
                }
                var consId = parseFloat($scope.selectedImageStudyObj.ConsultationId) || 0;
                if (consId === 0) {
                    alertify.error("Please select a Visit");
                    return false;
                }

                var modId = parseFloat($scope.selectedImageStudyObj.ModalityId) || 0;
                if (modId === 0) {
                    alertify.error("Please select a Modality");
                    return false;
                }
                var orgId = parseFloat($scope.selectedImageStudyObj.OrganId) || 0;
                if (orgId === 0) {
                    alertify.error("Please select an Organ");
                    return false;
                }
            }
            if (!$scope.orderPopupObj.IsNewOrder) {
                var orderId = parseFloat($scope.selectedImageStudyObj.PatientOrderId) || 0;
                if (orderId === 0) {
                    alertify.error("Please select an Order");
                    return false;
                }

            }
            var sorganid = 1;
            if (eye == 'OU') { sorganid = 3; } else if (eye == 'OS') { sorganid = 2; } else { sorganid = 1;};
            if (sorganid === 3) {
                $scope.ODFileupload = files;
                if ($scope.ODFileupload != null) {
                    angular.forEach($scope.ODFileupload, function (item) {
                        var pName = item.name, name = "";
                        var type = item.type.split("/")[1];
                        if (pName.length > 9) {
                            name = pName.substring(0, 9) + "..." + "." + type;
                        } else {
                            name = angular.copy(pName) + '.' + type;
                        }
                        var obj = {
                            "S3URL": "",
                            "DocumentExt": item.type,
                            "DocumentName": name,
                            "OrganId": sorganid,
                            "DeleteInd": "N",
                            "DocumentId": 0,
                            "FileTypeId": 5,
                            "file": item,
                            "IsActive": false
                        };

                        $scope.tempOUImagesArray.push(obj);
                        $scope.mainAllFilesArray.push(obj);
                    });
                }
            }
            else if (sorganid === 1) {
                $scope.ODFileupload = files;
                if ($scope.ODFileupload != null) {
                    angular.forEach($scope.ODFileupload, function (item) {
                        var pName = item.name, name = "";
                        var type = item.type.split("/")[1];
                        if (pName.length > 9) {
                            name = pName.substring(0, 9) + "..." + "." + type;
                        } else {
                            name = angular.copy(pName) + '.' + type;
                        }
                        var obj = {
                            "S3URL": "",
                            "DocumentExt": item.type,
                            "DocumentName": name,
                            "OrganId": sorganid,
                            "DeleteInd": "N",
                            "DocumentId": 0,
                            "FileTypeId": 5,
                            "file": item,
                            "IsActive": false
                        };

                        $scope.tempODImagesArray.push(obj);
                        $scope.mainAllFilesArray.push(obj);
                    });
                }
            }
            else {
                $scope.OSFileupload = files;
                if ($scope.OSFileupload != null) {
                    angular.forEach($scope.OSFileupload, function (item) {
                        var pName = item.name, name = "";
                        var type = item.type.split("/")[1];
                        if (pName.length > 9) {
                            name = pName.substring(0, 9) + "..." + "." + type;
                        } else {
                            name = angular.copy(pName) + '.' + type;
                        }
                        var obj = {
                            "S3URL": "",
                            "DocumentExt": item.type,
                            "DocumentName": name,
                            "OrganId": sorganid,
                            "DeleteInd": "N",
                            "FileTypeId": 5,
                            "DocumentId": 0,
                            "file": item,
                            "IsActive": false
                        };

                        $scope.tempOSImagesArray.push(obj);
                        $scope.mainAllFilesArray.push(obj);
                    });
                }
            }
            angular.forEach($scope.mainAllFilesArray, function (mitem, indexx) {
                mitem.IsActive = false;
                if (indexx === 0) {
                    mitem.IsActive = true;
                }
            });
            $scope.saveImageManagementStudyDetails('Notclose');
        }


        $scope.removeImage = function (item, sorganid) {
            var eye = sorganid == 1 ? 'OD' : (sorganid == 2 ? 'OS' : (sorganid == 3 ? 'OU' : ''));

            if (item.DocumentId != 0) {
                //item.DeleteInd = "Y";
                $scope.Continuetodeletefile(item, eye);
            } else {
                if (sorganid === 3) {
                    var index = $scope.tempOUImagesArray.indexOf(item);
                    $scope.tempOUImagesArray.splice(index, 1);
                    $scope.mainAllFilesArray.splice(index, 1);
                }
                else if (sorganid === 1) {
                    var index = $scope.tempODImagesArray.indexOf(item);
                    $scope.tempODImagesArray.splice(index, 1);
                    $scope.mainAllFilesArray.splice(index, 1);
                } else {
                    var index = $scope.tempOSImagesArray.indexOf(item);
                    $scope.tempOSImagesArray.splice(index, 1);
                    $scope.mainAllFilesArray.splice(index, 1);
                }
            }
        };

        $scope.Continuetodeletefile = function (item, eye) {


            var DeleteFileUploadArray = { "DocumentID": item.DocumentId, "FileName": item.DocumentName, "Remarks": "", "FileTypeId": item.FileTypeId };
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
                var params = {
                    "AppointmentID": $scope.selectedImageStudyObj.AppointmentId,
                    "DeleteIndicator": 0,
                    "ImagesArray": [],
                    "UploadType": "Delete",
                    "HospitalID": $scope.HospitalId,
                    "Remarks": "",
                    "Logs": {}
                };
                params.ImagesArray.push(DeleteFileUploadArray);
                $scope.LogObj.LogArray = [];
                var filetypeobj = "";
                if (eye == 'OU') {
                      filetypeobj = $filter('filter')($scope.tempOUImagesArray, { 'FileTypeId': item.FileTypeId }, true);
                }else if (eye == 'OD') {
                      filetypeobj = $filter('filter')($scope.tempODImagesArray, { 'FileTypeId': item.FileTypeId }, true);
                } else {
                      filetypeobj = $filter('filter')($scope.tempOSImagesArray, { 'FileTypeId': item.FileTypeId }, true);
                }
                let ActionDescription = `${filetypeobj[0].DocumentName} Files in Documents  For Appointment ID: ${$scope.selectedImageStudyObj.AppointmentId}`
                if (params.ImagesArray.length > 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": $scope.ModuleId,
                        "ModuleName": $scope.ModuleName,
                        "SubModuleId": 22,
                        "SubModuleName": "Image Study",
                        "ScreenType": "Image Management",
                        "ActionType": "Deleted",
                        //"ActionDescription": ActionDescription,
                        "OldActionDescription": "",
                        "NewActionDescription": ActionDescription,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
               // params.Logs = angular.copy($scope.LogObj);
                eHnoteDiagnosisDataServices.DeletePatientConsultationImg(params, onupdateDeletesuccess, onupdateDelerror);
            }, function () { });
            function onupdateDeletesuccess(response) {
                if (response.Status === 'Success') {
                    alertify.success("Images Deleted successfully");
                    item.DeleteInd = "Y";

                    if (eye == 'OU') {
                        var index = $scope.tempOUImagesArray.indexOf(item);
                        $scope.tempOUImagesArray.splice(index, 1);

                    } else if (eye == 'OD') {
                        var index = $scope.tempODImagesArray.indexOf(item);
                        $scope.tempODImagesArray.splice(index, 1);
                    } else {
                        var index = $scope.tempOSImagesArray.indexOf(item);
                        $scope.tempOSImagesArray.splice(index, 1);
                    }

                }

                $scope.mainAllFilesArray = $filter("filter")($scope.mainAllFilesArray, { "DeleteInd": 'N' }, true);
                if ($scope.mainAllFilesArray.length > 0) {
                    $scope.navtoShowViewer($scope.mainAllFilesArray[0]);
                } else {
                    $scope.selectedPreviewObj = {
                        "S3URL": "",
                        "FileName": "",
                        "OrganId": "",
                        "OrganName": "",
                        "FileExt": "",
                        "DocumentId": 0,
                        "IsImage": false,
                        "IsPdf": false,
                        "IsDicom": false,
                        "IsTiff": false
                    };
                }
                
            }
            function onupdateDelerror(errordata) {
                console.log(errordata);
            }
        };

        $scope.stopClosingDropDown = function (event) {
            event.stopPropagation();
        }

        $scope.chooseDoctorforImageStudy = function (item) {

            $scope.selectedImageStudyObj.DoctorObj = item;
            $scope.selectedImageStudyObj.DoctorId = item.DoctorID;
            $scope.selectedImageStudyObj.DoctorName = item.FullName || '';
        };
        $scope.chooseTechnicianforImageStudy = function (item) {

            $scope.selectedImageStudyObj.TechnicianObj = item;
            $scope.selectedImageStudyObj.TechnicianId = item.DoctorID;
            $scope.selectedImageStudyObj.TechnicianName = item.FullName || '';
        };


        $scope.processedtoCreateNewOrder = function () {
            $scope.orderPopupObj.IsNewOrder = true;

        }
        $scope.processedtoSelectExistingOrder = function () {
            $scope.orderPopupObj.IsNewOrder = false;
        }

        $scope.GetOrganizationProcedure = function (text) {



            let obj = {
                "OrganizationId": $scope.HospitalId,
                "ProcedureId": 0,
                "CPTCODE": "",
                "SearchText": text || "",
                "TypeOfServiceId": 0,
                "PageNumber": 1,
                "PageSize": 10,
                "GetAllIndicator": 0,
                "IsFrequent": "N",
                "Status": 0,
                "Type": "Investigation",
                "ParentOrganizationId": $scope.ParenthospitalId || null
            };
            if (text == "") {
                obj.IsFrequent = "Y";
            }
            return eHnoteSettingsDataService.GetOrganizationProceduresByType(obj).then(function (response) {
                if (response.data.rows.length !== 0) {
                    if (response.data.rows.length > 0) {
                        angular.forEach(response.data.rows, function (item) {
                            if (item.CPTCode == "") {
                                if (item.LoincCode != '') {
                                    item.CPTCode = item.LoincCode;
                                }
                            }
                        });
                    }

                    return response.data.rows.map(function (item) {
                        return item;
                    });
                }
            });
        };


        $scope.onInvProcedureChange = function () {
            $scope.selectedImageStudyObj.OrganizationProcedureId = "";
            $scope.selectedImageStudyObj.ProcedureId = "";
            $scope.selectedImageStudyObj.ProcedureCode = "";
            $scope.selectedImageStudyObj.ProcedureName = "";
            $scope.selectedImageStudyObj.CPTCode = "";
            $scope.selectedImageStudyObj.CategoryId = 0;

        }

        $scope.onSelectProcedureInv = function (obj) {

            console.log(obj);

            $scope.selectedImageStudyObj.OrganizationProcedureId = obj.OrganizationProcedureId;
            $scope.selectedImageStudyObj.ProcedureId = obj.ProcedureId;
            $scope.selectedImageStudyObj.ProcedureCode = obj.ProcedureCode;
            $scope.selectedImageStudyObj.ProcedureName = obj.ProcedureName;
            $scope.selectedImageStudyObj.CPTCode = obj.CPTCode;
            $scope.selectedImageStudyObj.CategoryId = obj.CategoryId || 0;
        };

        $scope.getPatientPreviousAppointments = function () {

            console.log($scope.selectedImageStudyObj.PatientId);

            eHnotePatientDataService.GetPatientBillingAppointments($scope.selectedImageStudyObj.PatientId).then(function (resp) {
                if (resp.data.Status === 1) {
                    if (resp.data.data.length > 0) {
                        resp.data.data = resp.data.data || [];
                        $scope.patientVisitsArray = resp.data.data.filter(function (visit) {
                            return new Date(visit.AppointmentDate) <= new Date();
                        });
                        //angular.forEach(resp.data.data, function (mitem) {
                        //    console.log(mitem);
                        //    $scope.patientVisitsArray.push(mitem);
                        //});

                        $scope.showAddOrderDiv = true;
                        angular.forEach($scope.patientVisitsArray, function (aitem) {
                            aitem.IschartSignoff = false;
                            if (aitem.OPChartStatus=='E') {
                                aitem.IschartSignoff = true;
                            }
                            aitem.NewAppointmentDate = $filter("date")(aitem.AppointmentDate, "MM-dd-yyyy");
                            aitem.VisitDate = $filter("date")(aitem.VisitDate, "MM-dd-yyyy");
                        });


                    } else {
                        alertify.error("No Appointments For the Patient To Create New Order");
                        return false;
                    }
                } else {
                    alertify.error("No Appointments For the Patient To Create New Order");
                    return false;
                }
            });
        }





        $scope.getPatientChartingOrdersById = function () {

            let params = {
                "PatientId": $scope.PatientId,
                "BranchId": $scope.HospitalId,
            };
            eHnoteSettingsDataService.GetChartingOrdersByPatientId(params).then(function (response) {

                console.log(response);
                if (response.data.status === 'Success') {
                    if (response.data.rows.length > 0) {
                        $scope.PatientOrdersArrayNew = response.data.rows || [];

                        angular.forEach($scope.PatientOrdersArrayNew, function (oitem) {
                            oitem.IsSelected = false;
                            oitem.isdisableOrderSelection = false;
                            //if (oitem.OrderDate === null) {
                            //    oitem.OrderDate = oitem.ConsultationDate || "";
                            //}
                            var visitDate = "";
                            if (oitem.ConsultationDate != null && oitem.ConsultationDate != undefined) {
                                visitDate = $filter("date")(oitem.ConsultationDate, "MM-dd-yyyy");
                            } else if (oitem.AppointmentDate != null && oitem.ConsultationDate != undefined) {
                                visitDate = $filter("date")(oitem.AppointmentDate, "MM-dd-yyyy");
                            }
                            oitem.OrderCompleteName = visitDate + " - " + oitem.ProcedureName + " - " + oitem.OrganName + " ( " + oitem.ModalityName + " ) - " + oitem.SecondUserFullName
                        });


                    }
                }
            });
        };

        //$scope.changeVisitOrder = function (orderId) {
           
        //    var List = $filter("filter")($scope.PatientOrdersArrayNew, { "PatientOrderId": orderId }, true)||[];
        //    if (List.length > 0) {
        //        $scope.selectedImageStudyObj.ConsultationId = List[0].ConsultationId;
        //        $scope.selectedImageStudyObj.AppointmentId = List[0].AppointmentId;
        //        $scope.selectedImageStudyObj.ModalityId = List[0].ModalityId;
        //        $scope.selectedImageStudyObj.OrganId = List[0].OrganId;
        //    }
          
        //    console.log($scope.selectedImageStudyObj.ConsultationId + "__ConsultationId");
        //    console.log($scope.selectedImageStudyObj.AppointmentId + "__AppointmentId");
        //};


        $scope.GetInventoryMasterIOLData = function () {
            let obj = {
                "ParentOrganizationId": $scope.ParenthospitalId,
            }
            InventoryService.GetInventoryMasterIOLData(obj).then(function (resp) {
                $scope.TypesofLens = resp.data.TypesofLens || [];
                $scope.Manufacturers = resp.data.Manufacturers || [];
                $scope.DiopterArray = resp.data.DiopterArray || [];
                $scope.IOLStatusArray = resp.data.IOLStatusArray || [];
                $scope.HospitalModels = resp.data.HospitalModels || [];
            });
        };

     

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
                "ParentOrganizationId": $scope.ParenthospitalId || null,
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

        $scope.TempAddDiagnosisAssesmentPlanArray = [];
        $scope.GetPatientAdvisedDiagnosisList = function (porderid) {
            var PatientOrderId = porderid || 0;
            var obj = {
                "AppointmentId": $scope.ParentObject.AppointmentId,
                "PatientID": $scope.ParentObject.PatientId,
                "PatientOrderId": PatientOrderId
            }
            eHnoteInsuranceService.GetDiagnosisAssesmentPlansListById(obj).then(function (response) {

                console.log(response);
                /*  $scope.selectedImageStudyObj.DiagnosisListArray = [];*/
                $scope.TempAddDiagnosisAssesmentPlanArray = [];
                if (response.data.Status === 'Success') {
                    if (response.data.rows.length > 0) {
                        $scope.TempAddDiagnosisAssesmentPlanArray = response.data.rows || [];
                        response.data.OrderDiagnosisList = response.data.OrderDiagnosisList || [];


                        angular.forEach($scope.TempAddDiagnosisAssesmentPlanArray, function (ditem) {
                            ditem.IsCheckedDiagnosis = false;
                            ditem.DeleteInd = "N";
                        });


                        console.log(JSON.stringify($scope.TempAddDiagnosisAssesmentPlanArray));

                        //angular.forEach($scope.selectedImageStudyObj.DiagnosisListArray, function (mitem) {
                        //    for (var i = $scope.TempAddDiagnosisAssesmentPlanArray.length - 1; i >= 0; i--) {
                        //        if ($scope.TempAddDiagnosisAssesmentPlanArray[i].DiagnosisId === mitem.DiagnosisId) {
                        //            $scope.TempAddDiagnosisAssesmentPlanArray.splice(i, 1);
                        //        }
                        //    }
                        //});
                        $scope.selectedImageStudyObj.DiagnosisListArray.forEach(mitem => {
                            let matchedItem = $scope.TempAddDiagnosisAssesmentPlanArray.find(titem => titem.DiagnosisId === mitem.DiagnosisId);
                            if (matchedItem) {
                                matchedItem.IsCheckedDiagnosis = true;
                            }
                        });
                    }
                }
            });
        };
        $scope.GetDiagnosisSearch = function (val) {
            var SearchCode = "";
            var SearchText = val;

            var object = {
                "HospitalId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "SearchText": SearchText,
                "PageSize": 10,
                "PageNumber": 1,
                "SearchICD10": SearchCode || "",
                "SearchDescription": "",
                "IsFrequent": "N",
                "ParentOrganizationId": $scope.ParenthospitalId || null
            };
            if (object.SearchText == '' || object.SearchText == undefined) {
                object.IsFrequent = 'Y';
            }
            return eHnoteSettingsDataService.getMasterDiagnosisForICD10Codes(object).then(function (response) {
                if (response.data.count !== 0) {
                    if (response.data.DiagnosisList !== undefined) {
                        angular.forEach(response.data.DiagnosisList, function (kitem) {
                            kitem.ICDCodewithDIAGDESCRIPTION = kitem.ICD10CODE + '-' + kitem.ICD10DIAGNAME;  //ICD10DIAGDESCRIPTION
                        });
                        return response.data.DiagnosisList.map(function (item) {
                            return item;
                        });
                    }
                }
            });
        };





        $scope.getCombinedList = function (viewValue) {
            if (!viewValue || viewValue.length === 0) {
                return $scope.GetPatientAdvisedDiagnosisList(0);
            } else {

                return $scope.GetDiagnosisSearch(viewValue);
            }
        };

        $scope.changeselectDiagnosisitem = function (val, item) {
            val = val || '';
            if (val == '') {
                item.DiagnosisId = 0;
                item.DiagnosisTypeId = null;
                item.ICD10CODE = '';
                item.ICD10DIAGDESCRIPTION = '';
            }
        }





        $scope.deleteDiagitem = function (obj) {
            angular.forEach($scope.selectedImageStudyObj.DiagnosisListArray, function (sitem, index) {
                if (sitem.DiagnosisId == obj.DiagnosisId) {


                    if (obj.PatientImageStudyDiagnosisId === 0) {
                        $scope.selectedImageStudyObj.DiagnosisListArray.splice(index, 1);
                    }
                    else {
                        obj.DeleteInd = 'Y';
                    }

                }
            });
        }

        $scope.GetOrgFindingValues = function (val, Catid, FindingId, Organ, type) {


            $scope.SearchText = val || "";
            $scope.CategoryId = Catid || 0;
            $scope.FindingId = FindingId || 0;
            $scope.AnteriorINVDropdownList = [];
            $scope.PosteriorINVDropdownList = [];
            $scope.selectedImageStudyObj.SelectedEye = Organ || 1;
            $scope.type = type || "";
            var params = {
                "CategoryId": $scope.CategoryId || 4,
                "FindingId": $scope.FindingId || 0,
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "PageSize": 20,
                "PageNumber": 1,
                "SearchText": $scope.SearchText || "",

            }
            return eHnotePatientDataService.GetOrgFindingValues(params).then(function (resp) {
                if (resp.data.status == "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.selectedImageStudyObj.OSMaculaShowAddNewBtn = false;
                        $scope.selectedImageStudyObj.ODMaculaShowAddNewBtn = false;
                        $scope.selectedImageStudyObj.ODDiscShowAddNewBtn = false;
                        $scope.selectedImageStudyObj.OSDiskShowAddNewBtn = false;
                        $scope.selectedImageStudyObj.ODCorneaShowAddNewBtn = false;
                        $scope.selectedImageStudyObj.OSCorneaShowAddNewBtn = false;
                        $scope.selectedImageStudyObj.ODRetinaShowAddNewBtn = false;
                        $scope.selectedImageStudyObj.OSRetinaShowAddNewBtn = false;
                        $scope.selectedImageStudyObj.ODFAShowAddNewBtn = false;
                        $scope.selectedImageStudyObj.OSFAShowAddNewBtn = false;
                        $scope.selectedImageStudyObj.ODICGShowAddNewBtn = false;
                        $scope.selectedImageStudyObj.OSICGShowAddNewBtn = false;

                        return resp.data.rows.map(function (item) {
                            return item;
                        });
                    }
                    else {
                        if ($scope.selectedImageStudyObj.SelectedEye == 1) {
                            if ($scope.CategoryId == 6) {
                                if ($scope.FindingId == 33) {
                                    $scope.selectedImageStudyObj.ODMaculaShowAddNewBtn = true;
                                }
                                else if ($scope.FindingId == 2144) {
                                    $scope.selectedImageStudyObj.ODDiscShowAddNewBtn = true;
                                }
                                else if ($scope.FindingId == 35) {
                                    $scope.selectedImageStudyObj.ODRetinaShowAddNewBtn = true;
                                }
                                else if ($scope.FindingId == 39) {
                                    if ($scope.type == 'FA') {
                                        $scope.selectedImageStudyObj.ODFAShowAddNewBtn = true;
                                    }
                                    else {
                                        $scope.selectedImageStudyObj.ODICGShowAddNewBtn = true;
                                    }
                                }

                            }
                            else {
                                if ($scope.FindingId == 26) {
                                    $scope.selectedImageStudyObj.ODCorneaShowAddNewBtn = true;
                                }
                            }
                        }
                        else {
                            if ($scope.CategoryId == 6) {
                                if ($scope.FindingId == 33) {
                                    $scope.selectedImageStudyObj.OSMaculaShowAddNewBtn = true;
                                }
                                else if ($scope.FindingId == 2144) {
                                    $scope.selectedImageStudyObj.OSDiskShowAddNewBtn = true;
                                }
                                else if ($scope.FindingId == 35) {
                                    $scope.selectedImageStudyObj.OSRetinaShowAddNewBtn = true;
                                }
                                else if ($scope.FindingId == 39) {
                                    if ($scope.type == 'FA') {
                                        $scope.selectedImageStudyObj.OSFAShowAddNewBtn = true;
                                    }
                                    else {
                                        $scope.selectedImageStudyObj.OSICGShowAddNewBtn = true;
                                    }
                                }

                            }
                            else {
                                if ($scope.FindingId == 26) {
                                    $scope.selectedImageStudyObj.OSCorneaShowAddNewBtn = true;
                                }
                            }
                        }
                    }

                }
            });
        }


        $scope.changeFundusFinding = function (selectedinv, item, type) {
            if (type == 'OD') {
                if ($scope.selectedImageStudyObj.FundusFindingArray.length > 0) {
                    var filterFundusFinding = $filter("filter")($scope.selectedImageStudyObj.FundusFindingArray, { "FindingValue": item.FindingValue, "OrganId": selectedinv.SelectedEye, "DeleteInd": item.DeleteInd }, true);
                    if (filterFundusFinding.length > 0) {
                        $scope.selectedImageStudyObj.ODFundusFindingObj = "";
                        alertify.error("Already Added");
                        return false;
                    }
                }
                if (selectedinv.SelectedEye == 1) {
                    var obj = {

                        "InterpretationFindingId": 0,
                        "FindingTemplateId": 0,
                        "FindingId": item.FindingId,
                        "FindingValue": item.FindingValue,
                        "DeleteInd": "N",
                        "OrganId": 1,
                        "TypeId": 1
                    }
                }

                $scope.selectedImageStudyObj.ODFundusFindingObj = "";
                $scope.selectedImageStudyObj.FundusFindingArray.push(obj);


            } else {
                if ($scope.selectedImageStudyObj.FundusFindingArray.length > 0) {
                    var filterFundusFinding1 = $filter("filter")($scope.selectedImageStudyObj.FundusFindingArray, { "FindingValue": item.FindingValue, "OrganId": selectedinv.SelectedEye, "DeleteInd": item.DeleteInd }, true);
                    if (filterFundusFinding1.length > 0) {
                        $scope.selectedImageStudyObj.OSFundusFindingObj = "";
                        alertify.error("Already Added");
                        return false;
                    }
                }
                if (selectedinv.SelectedEye == 2) {
                    var obj = {

                        "InterpretationFindingId": 0,
                        "FindingTemplateId": 0,
                        "FindingId": item.FindingId,
                        "FindingValue": item.FindingValue,
                        "DeleteInd": "N",
                        "OrganId": 2,
                        "TypeId": 1
                    }
                }
                $scope.selectedImageStudyObj.OSFundusFindingObj = "";
                $scope.selectedImageStudyObj.FundusFindingArray.push(obj);
            }
        }

        $scope.changeFAFinding = function (selectedinv, item, type) {

            if (type == 'OD') {
                if ($scope.selectedImageStudyObj.FAFindingArray.length > 0) {
                    var filterFAFinding = $filter("filter")($scope.selectedImageStudyObj.FAFindingArray, { "FindingValue": item.FindingValue, "OrganId": selectedinv.SelectedEye, "DeleteInd": item.DeleteInd }, true);
                    if (filterFAFinding.length > 0) {
                        $scope.selectedImageStudyObj.ODFAFindingObj = "";
                        alertify.error("Already Added");
                        return false;
                    }
                }

                if (selectedinv.SelectedEye == 1) {
                    var obj = {

                        "InterpretationFindingId": 0,
                        "FindingTemplateId": 0,
                        "FindingId": item.FindingId,
                        "FindingValue": item.FindingValue,
                        "DeleteInd": "N",
                        "OrganId": 1,
                        "TypeId": 2
                    }
                }

                $scope.selectedImageStudyObj.ODFAFindingObj = "";
                $scope.selectedImageStudyObj.FAFindingArray.push(obj);


            } else {
                if ($scope.selectedImageStudyObj.FAFindingArray.length > 0) {
                    var filterFAFinding1 = $filter("filter")($scope.selectedImageStudyObj.FAFindingArray, { "FindingValue": item.FindingValue, "OrganId": selectedinv.SelectedEye, "DeleteInd": item.DeleteInd }, true);
                    if (filterFAFinding1.length > 0) {
                        $scope.selectedImageStudyObj.OSFAFindingObj = "";
                        alertify.error("Already Added");
                        return false;
                    }
                }

                if (selectedinv.SelectedEye == 2) {
                    var obj = {

                        "InterpretationFindingId": 0,
                         "FindingTemplateId": 0,
                        "FindingId": item.FindingId,
                        "FindingValue": item.FindingValue,
                        "DeleteInd": "N",
                        "OrganId": 2,
                        "TypeId": 2
                    }

                }
                $scope.selectedImageStudyObj.OSFAFindingObj = "";
                $scope.selectedImageStudyObj.FAFindingArray.push(obj);
            }

        }



        $scope.changeICGFinding = function (selectedinv, item, type) {

            if (type == 'OD') {
                if ($scope.selectedImageStudyObj.ICGFindingArray.length > 0) {
                    var filterFAFinding = $filter("filter")($scope.selectedImageStudyObj.ICGFindingArray, { "FindingValue": item.FindingValue, "OrganId": selectedinv.SelectedEye, "DeleteInd": item.DeleteInd }, true);
                    if (filterFAFinding.length > 0) {
                        $scope.selectedImageStudyObj.ODICGFindingObj = "";
                        alertify.error("Already Added");
                        return false;
                    }
                }

                if (selectedinv.SelectedEye == 1) {
                    var obj = {

                        "InterpretationFindingId": 0,
                        "FindingTemplateId": 0,
                        "FindingId": item.FindingId,
                        "FindingValue": item.FindingValue,
                        "DeleteInd": "N",
                        "OrganId": 1,
                        "TypeId": 3
                    }
                }

                $scope.selectedImageStudyObj.ODICGFindingObj = "";
                $scope.selectedImageStudyObj.ICGFindingArray.push(obj);


            } else {
                if ($scope.selectedImageStudyObj.ICGFindingArray.length > 0) {
                    var filterFAFinding1 = $filter("filter")($scope.selectedImageStudyObj.ICGFindingArray, { "FindingValue": item.FindingValue, "OrganId": selectedinv.SelectedEye, "DeleteInd": item.DeleteInd }, true);
                    if (filterFAFinding1.length > 0) {
                        $scope.selectedImageStudyObj.OSICGFindingObj = "";
                        alertify.error("Already Added");
                        return false;
                    }
                }

                if (selectedinv.SelectedEye == 2) {
                    var obj = {

                        "InterpretationFindingId": 0,
                        "FindingTemplateId": 0,
                        "FindingId": item.FindingId,
                        "FindingValue": item.FindingValue,
                        "DeleteInd": "N",
                        "OrganId": 2,
                        "TypeId": 3

                    }

                }
                $scope.selectedImageStudyObj.OSICGFindingObj = "";
                $scope.selectedImageStudyObj.ICGFindingArray.push(obj);
            }

        }

        $scope.changeMacularFinding = function (selectedinv, item, type) {

            if (type == 'OD') {
                if ($scope.selectedImageStudyObj.MacularFindingArray.length > 0) {
                    var filterFAFinding = $filter("filter")($scope.selectedImageStudyObj.MacularFindingArray, { "FindingValue": item.FindingValue, "OrganId": selectedinv.SelectedEye, "DeleteInd": item.DeleteInd }, true);
                    if (filterFAFinding.length > 0) {
                        $scope.selectedImageStudyObj.ODMacularFindingObj = "";
                        alertify.error("Already Added");
                        return false;
                    }
                }

                if (selectedinv.SelectedEye == 1) {
                    var obj = {

                        "InterpretationFindingId": 0,
                        "FindingTemplateId": 0,
                        "FindingId": item.FindingId,
                        "FindingValue": item.FindingValue,
                        "DeleteInd": "N",
                        "OrganId": 1,
                        "TypeId": 4
                    }
                }

                $scope.selectedImageStudyObj.ODMacularFindingObj = "";
                $scope.selectedImageStudyObj.MacularFindingArray.push(obj);


            } else {
                if ($scope.selectedImageStudyObj.MacularFindingArray.length > 0) {
                    var filterFAFinding1 = $filter("filter")($scope.selectedImageStudyObj.MacularFindingArray, { "FindingValue": item.FindingValue, "OrganId": selectedinv.SelectedEye, "DeleteInd": item.DeleteInd }, true);
                    if (filterFAFinding1.length > 0) {
                        $scope.selectedImageStudyObj.OSMacularFindingObj = "";
                        alertify.error("Already Added");
                        return false;
                    }
                }
                /*    selectedinv.SelectedEye == 2*/
                if (selectedinv.SelectedEye == 2) {
                    var obj = {

                        "InterpretationFindingId": 0,
                        "FindingTemplateId": 0,
                        "FindingId": item.FindingId,
                        "FindingValue": item.FindingValue,
                        "DeleteInd": "N",
                        "OrganId": 2,
                        "TypeId": 4

                    }

                }
                $scope.selectedImageStudyObj.OSMacularFindingObj = "";
                $scope.selectedImageStudyObj.MacularFindingArray.push(obj);
            }

        }

        $scope.changeONFinding = function (selectedinv, item, type) {

            if (type == 'OD') {
                if ($scope.selectedImageStudyObj.ONFindingArray.length > 0) {
                    var filterFAFinding = $filter("filter")($scope.selectedImageStudyObj.ONFindingArray, { "FindingValue": item.FindingValue, "OrganId": selectedinv.SelectedEye, "DeleteInd": item.DeleteInd }, true);
                    if (filterFAFinding.length > 0) {
                        $scope.selectedImageStudyObj.ODONfindingObj = "";
                        alertify.error("Already Added");
                        return false;
                    }
                }

                if (selectedinv.SelectedEye == 1) {
                    var obj = {

                        "InterpretationFindingId": 0,
                        "FindingTemplateId": 0,
                        "FindingId": item.FindingId,
                        "FindingValue": item.FindingValue,
                        "DeleteInd": "N",
                        "OrganId": 1,
                        "TypeId": 5
                    }
                }

                $scope.selectedImageStudyObj.ODONfindingObj = "";
                $scope.selectedImageStudyObj.ONFindingArray.push(obj);


            } else {
                if ($scope.selectedImageStudyObj.ONFindingArray.length > 0) {
                    var filterFAFinding1 = $filter("filter")($scope.selectedImageStudyObj.ONFindingArray, { "FindingValue": item.FindingValue, "OrganId": selectedinv.SelectedEye, "DeleteInd": item.DeleteInd }, true);
                    if (filterFAFinding1.length > 0) {
                        $scope.selectedImageStudyObj.OSONfindingObj = "";
                        alertify.error("Already Added");
                        return false;
                    }
                }
                /* selectedinv.SelectedEye == 2*/
                if (selectedinv.SelectedEye == 2) {
                    var obj = {

                        "InterpretationFindingId": 0,
                        "FindingTemplateId": 0,
                        "FindingId": item.FindingId,
                        "FindingValue": item.FindingValue,
                        "DeleteInd": "N",
                        "OrganId": 2,
                        "TypeId": 5

                    }

                }
                $scope.selectedImageStudyObj.OSONfindingObj = "";
                $scope.selectedImageStudyObj.ONFindingArray.push(obj);
            }

        }



        $scope.onInvOrderProcedureChange = function () {
            $scope.selectedImageStudyObj.OrganizationProcedureId = "";
            $scope.selectedImageStudyObj.ProcedureId = "";
            $scope.selectedImageStudyObj.ProcedureCode = "";
            $scope.selectedImageStudyObj.ProcedureName = "";
            $scope.selectedImageStudyObj.CPTCode = "";
        }

        $scope.onSelectOrderProcedureInv = function (obj) {

            console.log(obj);

            $scope.selectedImageStudyObj.OrganizationProcedureId = obj.OrganizationProcedureId;
            $scope.selectedImageStudyObj.ProcedureId = obj.ProcedureId;
            $scope.selectedImageStudyObj.ProcedureCode = obj.ProcedureCode;
            $scope.selectedImageStudyObj.ProcedureName = obj.ProcedureName;
            $scope.selectedImageStudyObj.CPTCode = obj.CPTCode;
        };

        $scope.getPatientImageStudyDetailsById = function (item) {
            var params = {
                "PatientImageStudyId": item.PatientImageStudyId
            }



            eHnotePatientDataService.GetPatientImageStudyDetailsById(params).then(function (resp) {


                console.log(JSON.stringify(resp));

                if (resp.data.status == "Success") {
                    resp.data.rows = resp.data.rows || [];
                    if (resp.data.rows.length > 0) {
                        var resultdata = resp.data.rows[0];
                        $scope.selectedImageStudyObj.OPChartStatus = item.OPChartStatus || "";
                        $scope.selectedImageStudyObj.ImageQuality = resultdata.ImageQuality;
                        $scope.selectedImageStudyObj.OCTMACFindings = resultdata.OCTMACFindings;
                        $scope.selectedImageStudyObj.OCTONFindings = resultdata.OCTONFindings;
                        $scope.selectedImageStudyObj.ProviderRemarks = resultdata.ProviderRemarks;
                        $scope.selectedImageStudyObj.TechnicianRemarks = resultdata.TechnicianRemarks;

                        $scope.selectedImageStudyObj.DoctorId = resultdata.DoctorId;
                        $scope.selectedImageStudyObj.DoctorName = resultdata.DoctorName;
                        $scope.selectedImageStudyObj.DoctorObj = { "FullName": resultdata.DoctorName || "Select" };
                        $scope.selectedImageStudyObj.TechnicianId = resultdata.TechnicianId;
                        $scope.selectedImageStudyObj.TechnicianName = resultdata.TechnicianName;
                        $scope.selectedImageStudyObj.TechnicianObj = { "FullName": resultdata.TechnicianName || "Select" };
                        $scope.selectedImageStudyObj.ImagestudyReviewedDate = resultdata.ImagestudyReviewedDate;

                        $scope.selectedImageStudyObj.ImagestudyReviewedDate = $filter('date')($scope.selectedImageStudyObj.ImagestudyReviewedDate, 'MM-dd-yyyy hh:mm a') || "";

                        let tempArray = $filter('filter')($scope.ParentObject.allUserList, { 'DoctorID': $scope.selectedImageStudyObj.DoctorId }, true);
                        if (tempArray.length > 0) {


                            $scope.SuffixName = '';
                            tempArray[0].SuffixName = tempArray[0].SuffixName || '';
                            if (tempArray[0].SuffixName != "") {
                                $scope.SuffixName = tempArray[0].SuffixName;
                            }

                            $scope.LicenseNumber = "";

                            tempArray[0].LicenseNumber = tempArray[0].LicenseNumber || "";
                            if (tempArray[0].LicenseNumber != "") {
                                $scope.LicenseNumber = 'LIC :' + ' ' + tempArray[0].LicenseNumber;
                            }

                        }

                        let technicianArray = $filter('filter')($scope.ParentObject.allUserList, { 'DoctorID': $scope.selectedImageStudyObj.TechnicianId }, true);
                        if (technicianArray.length > 0) {


                            $scope.TechnicianSuffixName = '';
                            technicianArray[0].SuffixName = technicianArray[0].SuffixName || '';
                            if (technicianArray[0].SuffixName != "") {
                                $scope.TechnicianSuffixName = technicianArray[0].SuffixName;
                            }

                            $scope.TechnicianLicenseNumber = "";

                            technicianArray[0].LicenseNumber = technicianArray[0].LicenseNumber || "";
                            if (technicianArray[0].LicenseNumber != "") {
                                $scope.TechnicianLicenseNumber = 'LIC :' + ' ' + technicianArray[0].LicenseNumber;
                            }

                        }


                        $scope.selectedImageStudyObj.IOLLensValue = resultdata.IOLLensValue;
                        $scope.selectedImageStudyObj.IOLPowerValue = resultdata.IOLPowerValue;
                        $scope.selectedImageStudyObj.FrequencyValue = resultdata.FrequencyValue;
                        $scope.selectedImageStudyObj.FindingValue = resultdata.FindingValue;
                        $scope.selectedImageStudyObj.K1Value = resultdata.K1Value;
                        $scope.selectedImageStudyObj.K2Value = resultdata.K2Value;
                        $scope.selectedImageStudyObj.CYLValue = resultdata.CYLValue;
                        $scope.selectedImageStudyObj.LidsValue = resultdata.LidsValue;
                        $scope.selectedImageStudyObj.ConjunctivaValue = resultdata.ConjunctivaValue;
                        $scope.selectedImageStudyObj.ScleraValue = resultdata.ScleraValue;
                        $scope.selectedImageStudyObj.CorneaValue = resultdata.CorneaValue;
                        $scope.selectedImageStudyObj.EndothelialCellCountValue = resultdata.EndothelialCellCountValue;
                        $scope.selectedImageStudyObj.CornealThicknessValue = resultdata.CornealThicknessValue;
                        $scope.selectedImageStudyObj.EndothelialCellDensity = resultdata.EndothelialCellDensity;



                        $scope.selectedImageStudyObj.ODMacularFindingValue = resultdata.ODMacularFindingValue;
                        $scope.selectedImageStudyObj.ODMacularThickNess = resultdata.ODMacularThickNess;
                        $scope.selectedImageStudyObj.ODONfindingValue = resultdata.ODONfindingValue;
                        $scope.selectedImageStudyObj.ODRHFLThickNess = resultdata.ODRHFLThickNess;
                        $scope.selectedImageStudyObj.OSMacularFindingValue = resultdata.OSMacularFindingValue;
                        $scope.selectedImageStudyObj.OSMacularThickNess = resultdata.OSMacularThickNess;
                        $scope.selectedImageStudyObj.OSONfindingValue = resultdata.OSONfindingValue;
                        $scope.selectedImageStudyObj.OSRHFLThickNess = resultdata.OSRHFLThickNess;
                        $scope.selectedImageStudyObj.ODIOLLensValue = resultdata.ODIOLLensValue;
                        $scope.selectedImageStudyObj.ODIOLPower = resultdata.ODIOLPower;
                        $scope.selectedImageStudyObj.ODToricPower = resultdata.ODToricPower;
                        $scope.selectedImageStudyObj.ODIOLManufacturer = resultdata.ODIOLManufacturer;
                        $scope.selectedImageStudyObj.OSIOLLensValue = resultdata.OSIOLLensValue;
                        $scope.selectedImageStudyObj.OSIOLPower = resultdata.OSIOLPower;
                        $scope.selectedImageStudyObj.OSToricPower = resultdata.OSToricPower;
                        $scope.selectedImageStudyObj.OSIOLManufacturer = resultdata.OSIOLManufacturer;
                        $scope.selectedImageStudyObj.ODFrequenciesValue = resultdata.ODFrequenciesValue;
                        $scope.selectedImageStudyObj.ODFindingValue = resultdata.ODFindingValue;
                        $scope.selectedImageStudyObj.OSFrequenciesValue = resultdata.OSFrequenciesValue;
                        $scope.selectedImageStudyObj.OSFindingValue = resultdata.OSFindingValue;
                        $scope.selectedImageStudyObj.ODK1Value = resultdata.ODK1Value;
                        $scope.selectedImageStudyObj.ODK2Value = resultdata.ODK2Value;
                        $scope.selectedImageStudyObj.ODCYLValue = resultdata.ODCYLValue;
                        $scope.selectedImageStudyObj.ODCornealThicknessValue = resultdata.ODCornealThicknessValue;
                        $scope.selectedImageStudyObj.OSK1Value = resultdata.OSK1Value;
                        $scope.selectedImageStudyObj.OSK2Value = resultdata.OSK2Value;
                        $scope.selectedImageStudyObj.OSCYLValue = resultdata.OSCYLValue;
                        $scope.selectedImageStudyObj.OSCornealThicknessValue = resultdata.OSCornealThicknessValue;
                        $scope.selectedImageStudyObj.ODOCTMACFindings = resultdata.ODOCTMACFindings;
                        $scope.selectedImageStudyObj.ODLidsValue = resultdata.ODLidsValue;
                        $scope.selectedImageStudyObj.ODConjunctivaValue = resultdata.ODConjunctivaValue;
                        $scope.selectedImageStudyObj.ODScleraValue = resultdata.ODScleraValue;
                        $scope.selectedImageStudyObj.ODCorneaValue = resultdata.ODCorneaValue;
                        $scope.selectedImageStudyObj.OSOCTMACFindings = resultdata.OSOCTMACFindings;
                        $scope.selectedImageStudyObj.OSLidsValue = resultdata.OSLidsValue;
                        $scope.selectedImageStudyObj.OSConjunctivaValue = resultdata.OSConjunctivaValue;
                        $scope.selectedImageStudyObj.OSScleraValue = resultdata.OSScleraValue;
                        $scope.selectedImageStudyObj.OSCorneaValue = resultdata.OSCorneaValue;
                        $scope.selectedImageStudyObj.ODEndothelialCellCountValue = resultdata.ODEndothelialCellCountValue;
                        $scope.selectedImageStudyObj.ODEndoCornealThicknessValue = resultdata.ODEndoCornealThicknessValue;
                        $scope.selectedImageStudyObj.ODEndothelialCellDensity = resultdata.ODEndothelialCellDensity;
                        $scope.selectedImageStudyObj.OSEndothelialCellCountValue = resultdata.OSEndothelialCellCountValue;
                        $scope.selectedImageStudyObj.OSEndoCornealThicknessValue = resultdata.OSEndoCornealThicknessValue;
                        $scope.selectedImageStudyObj.OSEndothelialCellDensity = resultdata.OSEndothelialCellDensity;
                        $scope.selectedImageStudyObj.ODFixationLoss = resultdata.ODFixationLoss;
                        $scope.selectedImageStudyObj.ODFalsePositiveErrors = resultdata.ODFalsePositiveErrors;
                        $scope.selectedImageStudyObj.ODFalseNegitiveErrors = resultdata.ODFalseNegitiveErrors;
                        $scope.selectedImageStudyObj.ODTDProbabilityPlot = resultdata.ODTDProbabilityPlot;
                        $scope.selectedImageStudyObj.ODPDProbabilityPlot = resultdata.ODPDProbabilityPlot;
                        $scope.selectedImageStudyObj.ODMeanDeviation = resultdata.ODMeanDeviation;
                        $scope.selectedImageStudyObj.ODPatternStandardDeviation = resultdata.ODPatternStandardDeviation;
                        $scope.selectedImageStudyObj.ODVisualFieldIndex = resultdata.ODVisualFieldIndex;
                        $scope.selectedImageStudyObj.ODGHTValue = resultdata.ODGHTValue;
                        $scope.selectedImageStudyObj.ODHVFFindingValue = resultdata.ODHVFFindingValue;
                        $scope.selectedImageStudyObj.OSFixationLoss = resultdata.OSFixationLoss;
                        $scope.selectedImageStudyObj.OSFalsePositiveErrors = resultdata.OSFalsePositiveErrors;
                        $scope.selectedImageStudyObj.OSFalseNegitiveErrors = resultdata.OSFalseNegitiveErrors;
                        $scope.selectedImageStudyObj.OSTDProbabilityPlot = resultdata.OSTDProbabilityPlot;
                        $scope.selectedImageStudyObj.OSPDProbabilityPlot = resultdata.OSPDProbabilityPlot;
                        $scope.selectedImageStudyObj.OSMeanDeviation = resultdata.OSMeanDeviation;
                        $scope.selectedImageStudyObj.OSPatternStandardDeviation = resultdata.OSPatternStandardDeviation;
                        $scope.selectedImageStudyObj.OSVisualFieldIndex = resultdata.OSVisualFieldIndex;
                        $scope.selectedImageStudyObj.OSGHTValue = resultdata.OSGHTValue;
                        $scope.selectedImageStudyObj.OSHVFFindingValue = resultdata.OSHVFFindingValue;
                        $scope.selectedImageStudyObj.ODFundusFindingValue = resultdata.ODFundusFindingValue;
                        $scope.selectedImageStudyObj.OSFundusFindingValue = resultdata.OSFundusFindingValue;

                        $scope.selectedImageStudyObj.ODASOCTfindingValue = resultdata.ODASOCTfindingValue;
                        $scope.selectedImageStudyObj.OSASOCTfindingValue = resultdata.OSASOCTfindingValue;
                        $scope.selectedImageStudyObj.ODFAFindingValue = resultdata.ODFAFindingValue;
                        $scope.selectedImageStudyObj.OSFAFindingValue = resultdata.OSFAFindingValue;
                        $scope.selectedImageStudyObj.ODICGFindingValue = resultdata.ODICGFindingValue;
                        $scope.selectedImageStudyObj.OSICGFindingValue = resultdata.OSICGFindingValue;

                        $scope.selectedImageStudyObj.DiagnosisListArray = resultdata.DiagnosisListArray || [];
                        $scope.selectedImageStudyObj.ModalityName = resultdata.ModalityName || "";
                        $scope.selectedImageStudyObj.ModalityId = resultdata.ModalityId || 0;
                        $scope.selectedImageStudyObj.FundusFindingArray = resultdata.FundusFindingArray || [];
                        $scope.selectedImageStudyObj.FAFindingArray = resultdata.FAFindingArray || [];
                        $scope.selectedImageStudyObj.ICGFindingArray = resultdata.ICGFindingArray || [];
                        $scope.selectedImageStudyObj.MacularFindingArray = resultdata.MacularFindingArray || [];
                        $scope.selectedImageStudyObj.ONFindingArray = resultdata.ONFindingArray || [];
                        $scope.selectedImageStudyObj.OtherFindingArray = resultdata.OtherFindingArray || [];
                        $scope.selectedImageStudyObj.IsModalityId = resultdata.ModalityId || 0;

                    }

                }
            }, function (err) {
                console.log(err);
                alertify.error("Getting Failed");
            });
        }
        $scope.changeandSelectNewOrder = function (patientOrderId) {

            $scope.tempODImagesArray = [];
            $scope.tempOSImagesArray = [];
            $scope.tempOUImagesArray = [];
            
            $scope.mainAllFilesArray = [];
            let FilteredArray = $filter('filter')($scope.PatientOrdersArrayNew, { 'PatientOrderId': patientOrderId }, true) || [];

            var obj = FilteredArray[0];
            $scope.selectedImageStudyObj = getnewImageStudyDetailsAddReqObj();
            $scope.selectedImageStudyFiles.AllFiles = [];
            $scope.selectedImageStudyFiles.RightEyeFiles = [];
            $scope.selectedImageStudyFiles.LeftEyeFiles = [];
            $scope.selectedImageStudyFiles.BothEyeFiles = [];
            $scope.selectedImageStudyObj.OrderName = obj.ProcedureName;
            $scope.selectedImageStudyObj.ConnectedDiagnosisList = obj.DiagnosisList || [];
            $scope.selectedImageStudyObj.PatientImageStudyId = obj.PatientImageStudyId || 0;
            $scope.selectedImageStudyObj.PatientOrderId = obj.PatientOrderId || 0;
            $scope.selectedImageStudyObj.ModalityId = obj.ModalityId;
            $scope.selectedImageStudyObj.ModalityName = obj.ModalityName;
            $scope.selectedImageStudyObj.InvestigationId = obj.ProcedureId;
            $scope.selectedImageStudyObj.ImageQuality = obj.ImageQuality || "";
            $scope.selectedImageStudyObj.SelectedEye = obj.OrganId || null;

            $scope.selectedImageStudyObj.AppointmentId = obj.AppointmentId;
            $scope.selectedImageStudyObj.ConsultationId = obj.ConsultationId;
            $scope.selectedImageStudyObj.AppointmentDate = obj.AppointmentDate;
            $scope.selectedImageStudyObj.ConsultationDate = obj.ConsultationDate || obj.AppointmentDate;
            $scope.selectedImageStudyObj.PatientId = obj.PatientId;
            $scope.selectedImageStudyObj.OrganId = obj.OrganId;
            $scope.selectedImageStudyObj.OrderTypeId = obj.OrderTypeId;
            $scope.selectedImageStudyObj.OrderNumber = obj.OrderNumber;
            $scope.selectedImageStudyObj.OrderDate = obj.OrderDate;
            $scope.selectedImageStudyObj.StatusId = obj.StatusId;
            $scope.selectedImageStudyObj.PatientName = obj.PatientName;
            $scope.selectedImageStudyObj.ProcedureId = obj.ProcedureId;
            $scope.selectedImageStudyObj.OrganizationProcedureId = obj.OrganizationProcedureId;
            $scope.selectedImageStudyObj.ProcedureName = obj.ProcedureName;
            $scope.selectedImageStudyObj.ProcedureCode = obj.ProcedureCode || "";

            if (obj.PatientFiles.length > 0) {



                $scope.selectedImageStudyFiles.AllFiles = obj.PatientFiles || [];


                angular.forEach($scope.selectedImageStudyFiles.AllFiles, function (sitem) {
                    sitem.S3URL = sitem.S3URL || "";
                    if (sitem.OrganId === 1) {

                        var obj = {
                            "big": sitem.S3URL,
                            "small": sitem.S3URL,
                            "OrganId": sitem.OrganId,
                            "DocumentId": sitem.DocumentId,
                            "FileTypeId": sitem.FileTypeId || 0,
                            "DocumentName": sitem.DocumentName || '',
                            "isActive": false,
                            "isDicomFile": sitem.isDicomFile,
                            "FileType": sitem.DocumentExt
                        }


                        $scope.selectedImageStudyFiles.RightEyeFiles.push(obj);



                    }
                    if (sitem.OrganId === 2) {
                        var obj = {
                            "big": sitem.S3URL,
                            "small": sitem.S3URL,
                            "DocumentId": sitem.DocumentId,
                            "FileTypeId": sitem.FileTypeId || 0,
                            "DocumentName": sitem.DocumentName || '',
                            "OrganId": sitem.OrganId,
                            "isActive": false,
                            "isDicomFile": sitem.isDicomFile,
                            "FileType": sitem.DocumentExt
                        }

                        $scope.selectedImageStudyFiles.LeftEyeFiles.push(obj);
                    }
                    if (sitem.OrganId === 3) {
                        var obj = {
                            "big": sitem.S3URL,
                            "small": sitem.S3URL,
                            "DocumentId": sitem.DocumentId,
                            "FileTypeId": sitem.FileTypeId || 0,
                            "DocumentName": sitem.DocumentName || '',
                            "OrganId": sitem.OrganId,
                            "isActive": false,
                            "isDicomFile": sitem.isDicomFile,
                            "FileType": sitem.DocumentExt
                        }

                        $scope.selectedImageStudyFiles.BothEyeFiles.push(obj);
                    }
                });
            } else {
                $scope.selectedImageStudyFiles.AllFiles = [];
                $scope.selectedImageStudyFiles.RightEyeFiles = [];
                $scope.selectedImageStudyFiles.LeftEyeFiles = [];
                $scope.selectedImageStudyFiles.BothEyeFiles = [];
            }

            if ($scope.selectedImageStudyFiles.RightEyeFiles.length > 0) {
                angular.forEach($scope.selectedImageStudyFiles.RightEyeFiles, function (item) {
                    var obj1 = {
                        "S3URL": item.small,
                        "DocumentExt": item.FileType || '',
                        "DocumentName": item.DocumentName,
                        "OrganId": item.OrganId,
                        "DeleteInd": item.DeleteInd || "N",
                        "DocumentId": item.DocumentId || 0,
                        "FileTypeId": item.FileTypeId || 5,
                        "IsActive": false
                    };
                    $scope.tempODImagesArray.push(obj1);
                    $scope.mainAllFilesArray.push(obj1);
                });

            }
            if ($scope.selectedImageStudyFiles.LeftEyeFiles.length > 0) {
                angular.forEach($scope.selectedImageStudyFiles.LeftEyeFiles, function (item) {
                    var obj2 = {
                        "S3URL": item.small,
                        "DocumentExt": item.FileType || '',
                        "DocumentName": item.DocumentName,
                        "OrganId": item.OrganId,
                        "DeleteInd": item.DeleteInd || "N",
                        "DocumentId": item.DocumentId || 0,
                        "FileTypeId": item.FileTypeId || 5,
                        "IsActive": false
                    };

                    $scope.tempOSImagesArray.push(obj2);
                    $scope.mainAllFilesArray.push(obj2);
                });
            }
            if ($scope.selectedImageStudyFiles.BothEyeFiles.length > 0) {
                angular.forEach($scope.selectedImageStudyFiles.BothEyeFiles, function (item) {
                    var obj3 = {
                        "S3URL": item.small,
                        "DocumentExt": item.FileType || '',
                        "DocumentName": item.DocumentName,
                        "OrganId": item.OrganId,
                        "DeleteInd": item.DeleteInd || "N",
                        "DocumentId": item.DocumentId || 0,
                        "FileTypeId": item.FileTypeId || 5,
                        "IsActive": false
                    };

                    $scope.tempOUImagesArray.push(obj3);
                    $scope.mainAllFilesArray.push(obj3);
                });
            }
            $scope.mainAllFilesArray = $scope.mainAllFilesArray.map((mitem, index) => ({
                ...mitem,
                IsActive: index === 0
            }));

            if ($scope.mainAllFilesArray.length > 0) {
                $scope.navtoShowViewer($scope.mainAllFilesArray[0]);
            }


            if (obj.PatientImageStudyId !== 0) {
                $scope.getPatientImageStudyDetailsById(obj);
            }
        };

        $scope.selectedPreviewObj = {
            "S3URL": "",
            "FileName": "",
            "OrganId": "",
            "OrganName": "",
            "FileExt": "",
            "DocumentId": 0,
            "IsImage": false,
            "IsPdf": false,
            "IsDicom": false,
            "IsTiff": false
        };





        var canvasElU = null;
        var ctx = null;
        var reader = null;
        var overlays = [];
        var curPos = { x: 0, y: 0 };
        var directiveParentNode = null;
        var picPos = { x: 0, y: 0 };
        var mousePos = { x: 0, y: 0 };
        var canvasSize = null;
        var resize = null;



        var formatReader = new FormatReader();
        var centerPics = function () {
            // Updates canvas size before centering
            ctx.canvas.width = canvasSize.clientWidth;
            ctx.canvas.height = canvasSize.clientHeight;
            // Position to canvas center
            var centerX = ctx.canvas.width / 2;
            var centerY;
            var picPosX = 0;
            var picPosY = 0;

            if (reader.isImage) {
                centerY = ctx.canvas.height / 2;
                picPosX = centerX - (reader.width * $scope.optionspd.zoom.value) / 2;
                picPosY = centerY - (reader.height * $scope.optionspd.zoom.value) / 2;
            } else {
                picPosX = centerX - (reader.width * $scope.optionspd.zoom.value) / 2;
            }

            curPos = { x: picPosX, y: picPosY };
            picPos = { x: picPosX, y: picPosY };
        }

        $scope.isDrawingOD = false;
        $scope.isDrawingOS = false;
        var penSize = 5; // Default pen size
        var penColor = '#000000'; // Default pen color

        $uibModalInstance.rendered.then(function () {
            $scope.optionspd = {
                ctx: null,
                adsrc: null,
                zoom: {
                    value: 1.0,
                    step: 0.1,
                    min: 0.05,
                    max: 6
                },
                rotate: {
                    value: 0,
                    step: 90
                },
                controls: {
                    toolbar: true,
                    image: true,
                    sound: false,
                    fit: 'page',
                    disableZoom: false,
                    disableMove: false,
                    disableRotate: false,
                    numPage: 1,
                    totalPage: 1,
                    filmStrip: false
                },
                info: {}
            };

            canvasElU = document.getElementById("psODviewer");
            ctx = canvasElU.getContext('2d');
            $scope.optionspd.ctx = ctx;
            canvasSize = canvasElU.parentNode;
            ctx.canvas.width = canvasSize.clientWidth;
            ctx.canvas.height = canvasSize.clientHeight;
            resize = { height: canvasSize.clientHeight, width: canvasSize.clientWidth };

           var blankurl = "https://ehnotedevstorage.blob.core.windows.net/dev/1/plainBalck.jpg";
            $scope.optionspd.zoom.value = 1.0;
            $scope.optionspd.rotate.value = 0;
            curPos = { x: 0, y: 0 };
            picPos = { x: 0, y: 0 };
            
            reader = formatReader.CreateReader("image/jpeg").create(blankurl, $scope.optionspd, onloadODp, $q, $timeout);
            console.log(reader);

    


            function onMouseWheelMove($event) {
                var event = $window.event || $event; // old IE support
                var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
                if ($scope.optionspd.controls.filmStrip) {
                    picPos.y += 50 * delta;
                    // Limit range
                    if (picPos.y > 15) {
                        picPos.y = 15;
                    }
                    if (reader.images) {
                        if (picPos.y - reader.height * $scope.optionspd.zoom.value < -(reader.height + 15) * reader.images.length * $scope.optionspd.zoom.value) {
                            picPos.y = -(reader.height + 15) * reader.images.length + reader.height;
                        }
                    } else {
                        if (picPos.y - reader.height * $scope.optionspd.zoom.value < -reader.height * $scope.optionspd.zoom.value) {
                            picPos.y = -reader.height * $scope.optionspd.zoom.value;
                        }
                    }
                    //
                    $scope.$applyAsync(function () {
                        applyTransform();
                    });
                } else {
                    if (delta > 0) {
                        $scope.zoom(1);
                    } else {
                        $scope.zoom(-1);
                    }
                }
                // for IE
                event.returnValue = false;
                // for Chrome and Firefox
                if (event.preventDefault) {
                    event.preventDefault();
                }
            }

            // Resize canvas function
            function resizeCanvas() {
                $scope.$applyAsync(function () {
                    var canvasSize = canvasElU.parentNode;
                    ctx.canvas.width = canvasSize.clientWidth;
                    ctx.canvas.height = canvasSize.clientHeight;
                    applyTransform();
                });
            }

            // Parent change function
            function parentChange() {
                if (resize.width != canvasElU.parentNode.clientWidth) {
                    resize.width = canvasElU.parentNode.clientWidth;
                }

                if (resize.height != canvasElU.parentNode.clientHeight) {
                    resize.height = canvasElU.parentNode.clientHeight;
                }
                return resize;
            }

            // Initialization code or any other setup


            function applyTransform() {

                console.log(reader);
                if (reader == null) {
                    return;
                }
                if (!reader.rendered) {
                    return;
                }


                console.log("init called");
                var options = $scope.optionspd;
                var canvas = ctx.canvas;
                var centerX = reader.width * options.zoom.value / 2;
                var centerY = reader.height * options.zoom.value / 2;
                // Clean before draw
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // Save context
                ctx.save();
                // move to mouse position
                ctx.translate((picPos.x + centerX), (picPos.y + centerY));
                // Rotate canvas
                ctx.rotate(options.rotate.value * Math.PI / 180);
                // Go back
                ctx.translate(- centerX, - centerY);
                // Change scale
                if (reader.isZoom)
                    ctx.scale(options.zoom.value, options.zoom.value);
                if ((!options.controls.filmStrip) || (options.controls.totalPage == 1)) {
                    if (reader.img != null) {
                        ctx.drawImage(reader.img, 0, 0, reader.width, reader.height);
                        ctx.beginPath();
                        ctx.rect(0, 0, reader.width, reader.height);
                        ctx.lineWidth = 0.2;
                        ctx.strokeStyle = "#000000";
                        ctx.stroke();
                    }
                    // Draw image at correct position with correct scale
                    if (reader.data != null) {
                        ctx.putImageData(reader.data, picPos.x, picPos.y);
                        ctx.beginPath();
                        ctx.rect(0, 0, reader.width, reader.height);
                        ctx.lineWidth = 0.2;
                        ctx.strokeStyle = "#000000";
                        ctx.stroke();
                    }
                } else {

                    console.log(reader);
                    if (reader.images != null) {
                        angular.forEach(reader.images, function (image) {
                            ctx.drawImage(image, 0, 0, image.width, image.height);
                            ctx.beginPath();
                            ctx.rect(0, 0, image.width, image.height);
                            ctx.lineWidth = 0.2;
                            ctx.strokeStyle = "#000000";
                            ctx.stroke();
                            ctx.translate(0, image.height + 15);
                        });
                    }
                    // Draw image at correct position with correct scale
                    if (reader.data != null) {
                        var offsetY = 0;
                        angular.forEach(reader.data, function (data) {
                            ctx.putImageData(data, picPos.x, picPos.y + offsetY);
                            ctx.beginPath();
                            ctx.rect(0, 0, reader.width, reader.height);
                            ctx.lineWidth = 0.2;
                            ctx.strokeStyle = "#000000";
                            ctx.stroke();
                            offsetY += reader.height + 15;
                            ctx.translate(0, offsetY);
                        });
                    }
                }
                // Restore
                ctx.restore();

                // Draw overlays
                if (overlays.length > 0) {
                    angular.forEach(overlays, function (item) {
                        ctx.save();
                        // move to mouse position
                        ctx.translate((picPos.x + centerX), (picPos.y + centerY));
                        // Rotate canvas
                        ctx.rotate(options.rotate.value * Math.PI / 180);
                        // Go back
                        ctx.translate(- centerX, - centerY);
                        // Change scale
                        ctx.scale(options.zoom.value, options.zoom.value);
                        // Start rect draw
                        ctx.beginPath();
                        ctx.rect((item.x), (item.y), item.w, item.h);
                        ctx.fillStyle = item.color;
                        ctx.globalAlpha = 0.4;
                        ctx.fill();
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = item.color;
                        ctx.stroke();
                        ctx.restore();
                    });
                }
            }
            $scope.resizeTo = function (value) {

                console.log("resize called");
                if ((ctx.canvas == null) || (reader == null)) {
                    return;
                }

                // Updates canvas size, to guarantee that zoom value is not computed as zero
                ctx.canvas.width = canvasSize.clientWidth;
                ctx.canvas.height = canvasSize.clientHeight;
                // Compute page ratio
                var options = $scope.optionspd;
                var ratioH = ctx.canvas.height / reader.height;
                var ratioW = ctx.canvas.width / reader.width;
                // If reader render zoom itself
                // Precompute from its ratio
                if (!reader.isZoom) {
                    ratioH *= $scope.optionspd.zoom.value;
                    ratioW *= $scope.optionspd.zoom.value;
                }
                // Adjust value
                switch (value) {
                    case 'width': $scope.optionspd.zoom.value = ratioW; break;
                    case 'height': $scope.optionspd.zoom.value = ratioH; break;
                    case 'auto': $scope.optionspd.zoom.value = Math.min(ratioH, ratioW, 1); break;
                    case 'page':
                    default: $scope.optionspd.zoom.value = Math.min(ratioH, ratioW);
                }
                $scope.$applyAsync(function () {
                    // Round zoom value
                    $scope.optionspd.zoom.value = Math.round($scope.optionspd.zoom.value * 100) / 100;
                    // Update options state
                    $scope.optionspd.controls.fit = value;
                    if (!reader.isZoom) {
                        if (reader.refresh != null) {
                            reader.refresh();
                        }

                        // Re center image
                        centerPics();
                    } else {
                        // Re center image
                        centerPics();
                        applyTransform();
                    }
                });
            }
            function onloadODp() {
                if (reader == null) {
                    return;
                }

                if (reader.rendered) {
                    centerPics();
                    applyTransform();
                } else {
                    $scope.resizeTo($scope.optionspd.controls.fit);
                }
            }



            $scope.$watch('overlays', function (newarr, oldarr) {
                // initialize new overlay
                if (newarr === null || oldarr === null)
                    return;

                // new added
                overlays = [];
                angular.forEach(newarr, function (item) {
                    overlays.push(item);
                });

                applyTransform();
            }, true);

            $scope.$watch('optionspd.zoom.value', function () {
                if (!$scope.optionspd.controls.disableZoom) {
                    applyTransform();
                }
            });

            $scope.$watch('optionspd.rotate.value', function () {
                if (!$scope.optionspd.controls.disableRotate) {
                    applyTransform();
                }
            });

            $scope.$watch('optionspd.controls.fit', function (value) {
                $scope.resizeTo(value);
            });



            // Watch for changes in parent element size
            $scope.$watch(parentChange, function () {
                resizeCanvas();
            }, true);



            // Bind mousewheel
            angular.element(canvasElU).bind("DOMMouseScroll mousewheel onmousewheel", function ($event) {

                // cross-browser wheel delta
                if (!$scope.isDrawingOD) {
                    onMouseWheelMove($event);

                }
            });


            var ODisDrawing = false;
            var OSisDrawing = false;
            angular.element(canvasElU).bind('mousedown', function ($event) {
                if ($scope.isDrawingOD) {
                    ODisDrawing = true; // Start drawing
                    var x = event.offsetX;
                    var y = event.offsetY;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                } else {
                    if ($scope.optionspd.controls.disableMove) {
                        return;
                    }

                    $scope.canMove = true;
                    curPos.x = $event.offsetX;
                    curPos.y = $event.offsetY;

                    if ($scope.syncEnabled) {
                        $scope.canMoveOS = true;
                        curPosOS.x = $event.offsetX;
                        curPosOS.y = $event.offsetY;
                    }
                }



            });

            angular.element(canvasElU).bind('mouseup', function ($event) {

                if ($scope.isDrawingOD) {
                    ODisDrawing = false; // Stop drawing
                }
                else {
                    if ($scope.optionspd.controls.disableMove) {
                        return;
                    }

                    $scope.canMove = false;
                    if ($scope.syncEnabled) {
                        $scope.canMoveOS = false;
                    }
                }

            });

            angular.element(canvasElU).bind('mousemove', function ($event) {

                if ($scope.isDrawingOD) {

                    if (ODisDrawing) {
                        var x = event.offsetX;
                        var y = event.offsetY;
                        ctx.lineTo(x, y);
                        ctx.lineWidth = penSize; // Set pen size
                        ctx.strokeStyle = penColor; // Set pen color
                        ctx.stroke();
                    }

                }



            });












            let _app = null;
            let _tools = null;


            const _mode = 0;
            const _dicomWeb = false;

            function viewerSetup() {
                // logger level (optional)
                dwv.logger.level = dwv.logger.levels.WARN;

                dwv.decoderScripts.jpeg2000 =
                    './js/decoders/pdfjs/decode-jpeg2000.js';
                dwv.decoderScripts['jpeg-lossless'] =
                    './js/decoders/rii-mango/decode-jpegloss.js';
                dwv.decoderScripts['jpeg-baseline'] =
                    './js/decoders/pdfjs/decode-jpegbaseline.js';
                dwv.decoderScripts.rle =
                    './js/decoders/dwv/decode-rle.js';

                // // example private logic for roi dialog
                // dwv.customUI.openRoiDialog = function (meta, cb) {
                //   console.log('roi dialog', meta);
                //   const textExpr = prompt('[Custom dialog] Label', meta.textExpr);
                //   if (textExpr !== null) {
                //     meta.textExpr = textExpr;
                //     cb(meta);
                //   }
                // };

                // // example private logic for time value retrieval
                // dwv.TagValueExtractor.prototype.getTime = function (elements) {
                //   let value;
                //   const time = elements['ABCD0123'];
                //   if (typeof time !== 'undefined') {
                //     value = parseInt(time.value[0], 10);
                //   }
                //   return value;
                // };

                // stage options
                let dataViewConfigs;
                let viewOnFirstLoadItem = true;

                // use for concurrent load
                const numberOfDataToLoad = 1;

                if (_mode === 0) {
                    // simplest: one layer group
                    /*  dataViewConfigs = prepareAndGetSimpleDataViewConfig();*/
                } else if (_mode === 1) {
                    // MPR
                    viewOnFirstLoadItem = false;
                    dataViewConfigs = prepareAndGetMPRDataViewConfig();
                } else if (_mode === 2) {
                    // simple side by side
                    addLayerGroup('layerGroupAOD');
                    addLayerGroup('layerGroupB');
                    dataViewConfigs = {
                        0: [
                            {
                                divId: 'layerGroupAOD'
                            }
                        ],
                        1: [
                            {
                                divId: 'layerGroupB'
                            }
                        ]
                    };
                } else if (_mode === 3) {
                    // multiple data, multiple layer group
                    addLayerGroup('layerGroupAOD');
                    addLayerGroup('layerGroupB');
                    dataViewConfigs = {
                        0: [
                            {
                                divId: 'layerGroupAOD'
                            },
                            {
                                divId: 'layerGroupB'
                            }
                        ],
                        1: [
                            {
                                divId: 'layerGroupAOD'
                            }
                        ],
                        2: [
                            {
                                divId: 'layerGroupB'
                            }
                        ],
                        3: [
                            {
                                divId: 'layerGroupB'
                            }
                        ]
                    };
                }

                // tools
                _tools = {
                    Scroll: {},
                    WindowLevel: {},
                    ZoomAndPan: {},
                    Opacity: {}
                };

                // app config
                const options = new dwv.AppOptions(dataViewConfigs);
                options.tools = _tools;
                options.viewOnFirstLoadItem = viewOnFirstLoadItem;
                // app
                _app = new dwv.App();
                _app.init(options);



                _app.addEventListener('load', function (event) {
                    console.log("l1");
                    console.log(viewOnFirstLoadItem)
                    if (!viewOnFirstLoadItem) {
                        _app.render(event.loadid);
                    }
                });
                _app.addEventListener('loaditem', function (event) {
                    if (typeof event.warn !== 'undefined') {
                        console.warn('load-warn', event.warn);
                    }
                });
                _app.addEventListener('loadend', function (event) {
                    //console.timeEnd('load-data-' + event.loadid);
                });

                let dataLoad = 0;
                const firstRender = [];
                _app.addEventListener('loadend', function (event) {
                    // update UI at first render
                    if (!firstRender.includes(event.loadid)) {
                        // store data id
                        firstRender.push(event.dataid);
                        // log meta data
                        if (event.loadtype === 'image') {
                            //console.log('metadata',
                            //    getMetaDataWithNames(_app.getMetaData(event.loadid)));
                            // add data row
                            //addDataRow(event.loadid);
                            ++dataLoad;
                            // init gui
                            if (dataLoad === numberOfDataToLoad) {
                                // select tool
                                _app.setTool(getSelectedToolOD());


                            }
                        }
                    }

                    //if (event.loadtype === 'image' &&
                    //    typeof _app.getMetaData(event.loadid)['00080060'] !== 'undefined' &&
                    //    _app.getMetaData(event.loadid)['00080060'].value[0] === 'SEG') {
                    //    // log SEG details
                    //    logFramePosPats(_app.getMetaData(event.loadid));

                    //    // example usage of a dicom SEG as data mask
                    //    const useSegAsMask = false;
                    //    if (useSegAsMask) {
                    //        // image to filter
                    //        const imgDataIndex = 0;
                    //        const vls = _app.getViewLayersByDataIndex(imgDataIndex);
                    //        const vc = vls[0].getViewController();
                    //        const img = _app.getImage(imgDataIndex);
                    //        const imgGeometry = img.getGeometry();
                    //        const sliceSize = imgGeometry.getSize().getDimSize(2);
                    //        // SEG image
                    //        const segImage = _app.getImage(event.loadid);
                    //        // calculate slice difference
                    //        const segOrigin0 = segImage.getGeometry().getOrigins()[0];
                    //        const segOrigin0Point = new dwv.Point([
                    //            segOrigin0.getX(), segOrigin0.getY(), segOrigin0.getZ()
                    //        ]);
                    //        const segOriginIndex = imgGeometry.worldToIndex(segOrigin0Point);
                    //        const indexOffset = segOriginIndex.get(2) * sliceSize;
                    //        // set alpha function
                    //        vc.setViewAlphaFunction(function (value, index) {
                    //            // multiply by 3 since SEG is RGB
                    //            const segIndex = 3 * (index - indexOffset);
                    //            if (segIndex >= 0 &&
                    //                segImage.getValueAtOffset(segIndex) === 0 &&
                    //                segImage.getValueAtOffset(segIndex + 1) === 0 &&
                    //                segImage.getValueAtOffset(segIndex + 2) === 0) {
                    //                return 0;
                    //            } else {
                    //                return 0xff;
                    //            }
                    //        });
                    //    }
                    //}
                });


                var dwvElementOD = document.getElementById("dwvpsOD");
                angular.element(dwvElementOD).bind('mousedown', function ($event) {

                    console.log("2Id");
                    _app.defaultOnKeydown($event);
                    // mask segment related
                    if (!isNaN(parseInt($event.key, 10))) {
                        const vc =
                            _app.getActiveLayerGroup().getActiveViewLayer().getViewController();
                        if (!vc.isMask()) {
                            return;
                        }
                        const number = parseInt($event.key, 10);
                        const segHelper = vc.getMaskSegmentHelper();
                        if (segHelper.hasSegment(number)) {
                            const segment = segHelper.getSegment(number);
                            if ($event.ctrlKey) {
                                if ($event.altKey) {
                                    console.log('Delete segment: ' + segment.label);
                                    // delete
                                    vc.deleteSegment(number, _app.addToUndoStack);
                                } else {
                                    console.log('Show/hide segment: ' + segment.label);
                                    // show/hide the selected segment
                                    if (segHelper.isHidden(number)) {
                                        segHelper.removeFromHidden(number);
                                    } else {
                                        segHelper.addToHidden(number);
                                    }
                                    vc.applyHiddenSegments();
                                }
                            }
                        }
                    }
                });


                // default keyboard shortcuts
                //window.addEventListener('keydown', function (event) {

                //    console.log("2Id");
                //    _app.defaultOnKeydown(event);
                //    // mask segment related
                //    if (!isNaN(parseInt(event.key, 10))) {
                //        const vc =
                //            _app.getActiveLayerGroup().getActiveViewLayer().getViewController();
                //        if (!vc.isMask()) {
                //            return;
                //        }
                //        const number = parseInt(event.key, 10);
                //        const segHelper = vc.getMaskSegmentHelper();
                //        if (segHelper.hasSegment(number)) {
                //            const segment = segHelper.getSegment(number);
                //            if (event.ctrlKey) {
                //                if (event.altKey) {
                //                    console.log('Delete segment: ' + segment.label);
                //                    // delete
                //                    vc.deleteSegment(number, _app.addToUndoStack);
                //                } else {
                //                    console.log('Show/hide segment: ' + segment.label);
                //                    // show/hide the selected segment
                //                    if (segHelper.isHidden(number)) {
                //                        segHelper.removeFromHidden(number);
                //                    } else {
                //                        segHelper.addToHidden(number);
                //                    }
                //                    vc.applyHiddenSegments();
                //                }
                //            }
                //        }
                //    }
                //});
                // default on resize
                //window.addEventListener('resize', function () {
                //    _app.onResize();
                //});

                const uriOptions = {};
                // special dicom web request header
                if (_dicomWeb) {
                    uriOptions.requestHeaders = [{
                        name: 'Accept',
                        value: 'multipart/related; type="application/dicom"; transfer-syntax=*'
                    }];
                }
                // load from window location
                _app.loadFromUri(window.location.href, uriOptions);
            }


            function onDOMContentLoaded() {

                viewerSetup();


            }

            $scope.loadFroms3URL = function () {

                /*   var s3url = "https://ehnotedevstorage.blob.core.windows.net/dev/3/0002.DCM";*/
                var array = ['https://ehnotedevstorage.blob.core.windows.net/dev/3/0002.DCM']
                _app.loadURLs(array);
            }

            $scope.initOD = function () {
                onDOMContentLoaded();
            };
            $scope.initOD();

            function addLayerGroup(id) {
                console.log("layer called");
                const layerDiv = document.createElement('div');
                layerDiv.id = id;
                layerDiv.className = 'layerGroup';
                const root = document.getElementById('dwvpsOD');
                root.appendChild(layerDiv);
            }

            //function prepareAndGetSimpleDataViewConfig() {
            //    console.log("prepare called");
            //    // clean up
            //    const dwvDiv = document.getElementById('dwvpsOD');
            //    dwvDiv.innerHTML = '';
            //    // add div
            //    addLayerGroup('layerGroupAOD');
            //    return { '*': [{ divId: 'layerGroupAOD' }] };
            //}


            function prepareAndGetMPRDataViewConfig() {
                // clean up
                const dwvDiv = document.getElementById('dwvpsOD');
                dwvDiv.innerHTML = '';
                // add divs
                addLayerGroup('layerGroupAOD');
                addLayerGroup('layerGroupC');
                addLayerGroup('layerGroupS');
                return {
                    '*': [
                        {
                            divId: 'layerGroupAOD',
                            orientation: 'axial'
                        },
                        {
                            divId: 'layerGroupC',
                            orientation: 'coronal'
                        },
                        {
                            divId: 'layerGroupS',
                            orientation: 'sagittal'
                        }
                    ]
                };
            }


            function getLayerGroupDivIds(dataViewConfigs) {
                const divIds = [];
                const keys = Object.keys(dataViewConfigs);
                for (let i = 0; i < keys.length; ++i) {
                    const dataViewConfig = dataViewConfigs[keys[i]];
                    for (let j = 0; j < dataViewConfig.length; ++j) {
                        const divId = dataViewConfig[j].divId;
                        if (!divIds.includes(divId)) {
                            divIds.push(divId);
                        }
                    }
                }
                return divIds;
            }

            function getDataLayerGroupIds(dataViewConfig) {
                const divIds = [];
                for (let j = 0; j < dataViewConfig.length; ++j) {
                    divIds.push(dataViewConfig[j].divId);
                }
                return divIds;
            }

            function setupBindersCheckboxes() {
                const bindersDiv = document.getElementById('bindersOD');
                const propList = [
                    'WindowLevel',
                    'Position',
                    'Zoom',
                    'Offset',
                    'Opacity'
                ];
                const binders = [];
                // add all binders at startup
                for (let b = 0; b < propList.length; ++b) {
                    binders.push(propList[b] + 'BinderOD');
                }
                _app.setLayerGroupsBinders(binders);

                /**
                 * Add a binder.
                 *
                 * @param {string} propName The name of the property to bind.
                 */
                function addBinder(propName) {
                    binders.push(propName + 'BinderOD');
                    _app.setLayerGroupsBinders(binders);
                }
                /**
                 * Remove a binder.
                 *
                 * @param {string} propName The name of the property to bind.
                 */
                function removeBinder(propName) {
                    const index = binders.indexOf(propName + 'BinderOD');
                    if (index !== -1) {
                        binders.splice(index, 1);
                    }
                    _app.setLayerGroupsBinders(binders);
                }
                /**
                 * Get the input change handler for a binder.
                 *
                 * @param {string} propName The name of the property to bind.
                 * @returns {object} The handler.
                 */
                function getOnInputChange(propName) {
                    return function (event) {
                        if (event.target.checked) {
                            addBinder(propName);
                        } else {
                            removeBinder(propName);
                        }
                    };
                }
                // individual binders
                for (let i = 0; i < propList.length; ++i) {
                    const propName = propList[i];

                    const input = document.createElement('input');
                    input.id = 'binderOD-' + i;
                    input.type = 'checkbox';
                    input.checked = true;
                    input.onchange = getOnInputChange(propName);

                    const label = document.createElement('label');
                    label.htmlFor = input.id;
                    label.appendChild(document.createTextNode(propName));

                    bindersDiv.appendChild(input);
                    bindersDiv.appendChild(label);
                }

                // check all
                const allInput = document.createElement('input');
                allInput.id = 'binderOD-all';
                allInput.type = 'checkbox';
                allInput.checked = true;
                allInput.onchange = function () {
                    for (let j = 0; j < propList.length; ++j) {
                        document.getElementById('binderOD-' + j).click();
                    }
                };
                const allLabel = document.createElement('label');
                allLabel.htmlFor = allInput.id;
                allLabel.appendChild(document.createTextNode('all'));
                bindersDiv.appendChild(allInput);
                bindersDiv.appendChild(allLabel);
            }



            function getSelectedToolOD() {
                const toolsInput = document.getElementsByName('dtoolspOD');
                let toolIndex = null;
                for (let j = 0; j < toolsInput.length; ++j) {
                    if (toolsInput[j].checked) {
                        toolIndex = j;
                        break;
                    }
                }
                return Object.keys(_tools)[toolIndex];
            }

            function bindAppToControls() {
                _app.addEventListener('wlchange', onWLChange);
                _app.addEventListener('opacitychange', onOpacityChange);
            }

            function unbindAppToControls() {
                _app.removeEventListener('wlchange', onWLChange);
                _app.removeEventListener('opacitychange', onOpacityChange);
            }

            function onWLChange(event) {
                // width number
                let elemId = 'width-' + event.dataid + '-number';
                let elem = document.getElementById(elemId);
                if (elem) {
                    elem.value = event.value[1];
                } else {
                    console.warn('wl change: HTML not ready?');
                }
                // width range
                elemId = 'width-' + event.dataid + '-range';
                elem = document.getElementById(elemId);
                if (elem) {
                    elem.value = event.value[1];
                }
                // center number
                elemId = 'center-' + event.dataid + '-number';
                elem = document.getElementById(elemId);
                if (elem) {
                    elem.value = event.value[0];
                }
                // center range
                elemId = 'center-' + event.dataid + '-range';
                elem = document.getElementById(elemId);
                if (elem) {
                    elem.value = event.value[0];
                }
            }


            function onOpacityChange(event) {
                const value = parseFloat(event.value[0]).toPrecision(3);
                // number
                let elemId = 'opacity-' + event.dataid + '-number';
                let elem = document.getElementById(elemId);
                if (elem) {
                    elem.value = value;
                } else {
                    console.warn('opacity change: HTML not ready?');
                }
                // range
                elemId = 'opacity-' + event.dataid + '-range';
                elem = document.getElementById(elemId);
                if (elem) {
                    elem.value = value;
                }
            }


            function clearDataTable() {
                const detailsDiv = document.getElementById('layersdetailsOD');
                detailsDiv.innerHTML = '';
            }


            function getControlDiv(id, name, min, max, value, callback, precision) {
                const range = document.createElement('input');
                range.id = id + '-range';
                range.className = 'ctrl-range';
                range.type = 'range';
                range.min = min.toPrecision(precision);
                range.max = max.toPrecision(precision);
                range.step = ((max - min) * 0.01).toPrecision(precision);
                range.value = value;

                const label = document.createElement('label');
                label.id = id + '-label';
                label.className = 'ctrl-label';
                label.htmlFor = range.id;
                label.appendChild(document.createTextNode(name));

                const number = document.createElement('input');
                number.id = id + '-number';
                number.className = 'ctrl-number';
                number.type = 'number';
                number.min = range.min;
                number.max = range.max;
                number.step = range.step;
                number.value = parseFloat(value).toPrecision(precision);

                // callback and bind range and number
                number.oninput = function () {
                    range.value = this.value;
                    callback(this.value);
                };
                range.oninput = function () {
                    number.value = parseFloat(this.value).toPrecision(precision);
                    callback(this.value);
                };

                const div = document.createElement('div');
                div.id = id + '-ctrl';
                div.className = 'ctrl';
                div.appendChild(label);
                div.appendChild(range);
                div.appendChild(number);

                return div;
            }


            function addDataRow(id) {
                console.log(id + "__id");
                // bind app to controls on first id
                if (id === 0) {
                    bindAppToControls();
                }

                const dataViewConfigs = _app.getDataViewConfigs();
                const allLayerGroupDivIds = getLayerGroupDivIds(dataViewConfigs);
                // use first view layer
                const vls = _app.getViewLayersByDataIndex(id);
                const vl = vls[0];
                const vc = vl.getViewController();
                const wl = vc.getWindowLevel();

                let table = document.getElementById('layerstableOD');
                let body;
                // create table if not present
                if (!table) {
                    table = document.createElement('table');
                    table.id = 'layerstableOD';
                    const header = table.createTHead();
                    const trow = header.insertRow(0);
                    const insertTCell = function (text) {
                        const th = document.createElement('th');
                        th.innerHTML = text;
                        trow.appendChild(th);
                    };
                    insertTCell('Id');
                    for (let j = 0; j < allLayerGroupDivIds.length; ++j) {
                        insertTCell('LG' + j);
                    }
                    insertTCell('Alpha Range');
                    insertTCell('Contrast');
                    insertTCell('Alpha');
                    body = table.createTBody();
                    const div = document.getElementById('layersdetailsOD');
                    div.appendChild(table);
                } else {
                    body = table.getElementsByTagName('tbody')[0];
                }

                // add new layer row
                const row = body.insertRow();
                let cell;

                // cell: id
                cell = row.insertCell();
                cell.appendChild(document.createTextNode(id));

                // cell: radio
                let viewConfig = dataViewConfigs[id];
                if (typeof viewConfig === 'undefined') {
                    viewConfig = dataViewConfigs['*'];
                }
                const dataLayerGroupsIds = getDataLayerGroupIds(viewConfig);
                for (let l = 0; l < allLayerGroupDivIds.length; ++l) {
                    const layerGroupDivId = allLayerGroupDivIds[l];
                    cell = row.insertCell();
                    if (!dataLayerGroupsIds.includes(layerGroupDivId)) {
                        continue;
                    }
                    const radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.name = 'layerselectOD-' + l;
                    radio.id = 'layerselectOD-' + layerGroupDivId + '-' + id;
                    radio.checked = true;
                    radio.onchange = function (event) {
                        const fullId = event.target.id;
                        const split = fullId.split('-');
                        const groupDivId = split[1];
                        const dataId = split[2];
                        const lg = _app.getLayerGroupByDivId(groupDivId);
                        lg.setActiveViewLayerByDataIndex(parseInt(dataId, 10));
                    };
                    cell.appendChild(radio);
                }

                const image = _app.getImage(vl.getDataIndex());
                const dataRange = image.getDataRange();
                const rescaledDataRange = image.getRescaledDataRange();
                const floatPrecision = 4;

                // cell: alpha range
                cell = row.insertCell();
                const minId = 'value-min-' + id;
                const maxId = 'value-max-' + id;
                // callback
                const changeAlphaFunc = function () {
                    const min = parseFloat(document.getElementById(minId + '-number').value);
                    const max = parseFloat(document.getElementById(maxId + '-number').value);
                    const func = function (value) {
                        if (value >= min && value <= max) {
                            return 255;
                        }
                        return 0;
                    };
                    for (let i = 0; i < vls.length; ++i) {
                        vls[i].getViewController().setViewAlphaFunction(func);
                    }
                };
                // add controls
                cell.appendChild(getControlDiv(minId, 'min',
                    dataRange.min, dataRange.max, dataRange.min,
                    changeAlphaFunc, floatPrecision));
                cell.appendChild(getControlDiv(maxId, 'max',
                    dataRange.min, dataRange.max, dataRange.max,
                    changeAlphaFunc, floatPrecision));

                // cell: contrast
                cell = row.insertCell();
                const widthId = 'width-' + id;
                const centerId = 'center-' + id;
                // callback
                const changeContrast = function () {
                    const width =
                        parseFloat(document.getElementById(widthId + '-number').value);
                    const center =
                        parseFloat(document.getElementById(centerId + '-number').value);
                    vc.setWindowLevel(center, width);
                };
                // add controls
                cell.appendChild(getControlDiv(widthId, 'width',
                    0, rescaledDataRange.max - rescaledDataRange.min, wl.width,
                    changeContrast, floatPrecision));
                cell.appendChild(getControlDiv(centerId, 'center',
                    rescaledDataRange.min, rescaledDataRange.max, wl.center,
                    changeContrast, floatPrecision));

                // cell: opactiy
                cell = row.insertCell();
                const opacityId = 'opacity-' + id;
                // callback
                const changeOpacity = function (value) {
                    vl.setOpacity(value);
                    vl.draw();
                };
                // add controls
                cell.appendChild(getControlDiv(opacityId, 'opacity',
                    0, 1, vl.getOpacity(), changeOpacity, floatPrecision));
            }


            function comparePosPat(a, b) {
                const za = parseFloat(a.split('\\').at(-1));
                const zb = parseFloat(b.split('\\').at(-1));
                return za - zb;
            }


            function sortByPosPatKey(obj) {
                const keys = Object.keys(obj);
                keys.sort(comparePosPat);
                const sorted = new Map();
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    sorted.set(key, obj[key]);
                }
                return sorted;
            }


            function getPrecisionRound(precision) {
                return function (x) {
                    return dwv.precisionRound(x, precision);
                };
            }


            function logFramePosPats(elements) {
                // PerFrameFunctionalGroupsSequence
                const perFrame = elements['52009230'].value;
                const perPos = {};
                for (let i = 0; i < perFrame.length; ++i) {
                    // PlanePositionSequence
                    const posSq = perFrame[i]['00209113'].value;
                    // ImagePositionPatient
                    const pos = posSq[0]['00200032'].value;
                    if (typeof perPos[pos] === 'undefined') {
                        perPos[pos] = [];
                    }
                    // FrameContentSequence
                    const frameSq = perFrame[i]['00209111'].value;
                    // DimensionIndexValues
                    const dim = frameSq[0]['00209157'].value;
                    perPos[pos].push(dim);
                }
                console.log('DICOM SEG Segments', sortByPosPatKey(perPos));
            }


            function getMetaDataWithNames(metaData) {
                let meta = metaData;
                if (typeof meta['00020010'] !== 'undefined') {
                    // replace tag key with tag name for dicom
                    meta = Object.keys(meta).reduce((accumulator, currentValue) => {
                        const tag = dwv.getTagFromKey(currentValue);
                        let key = tag.getNameFromDictionary();
                        if (typeof key === 'undefined') {
                            // add 'x' to help sorting
                            key = 'x' + tag.getKey();
                        }
                        accumulator[key] = meta[currentValue];
                        return accumulator;
                    }, {});
                }
                return meta;
            }



            $scope.zoomInClick = function (val) {
                $scope.zoom(val);

            }



            $scope.navtoShowViewer = function (titem) {
                console.log(titem);
                titem.DocumentId = titem.DocumentId || 0;
                if (titem.DocumentId === 0) {
                    alertify.error("please save the file to preview");
                    return false;
                } else {
                    $scope.selectedPreviewObj.S3URL = titem.S3URL || "";
                    $scope.selectedPreviewObj.FileName = titem.DocumentName || "";
                    $scope.selectedPreviewObj.OrganId = titem.OrganId || "";
                    $scope.selectedPreviewObj.FileExt = titem.DocumentExt || "";
                    $scope.selectedPreviewObj.DocumentId = titem.DocumentId || 0;
                    const organMap = { 3: "OU", 2: "OS", 1: "OD" };
                    $scope.selectedPreviewObj.OrganName = organMap[titem.OrganId] || "OD";

                    $scope.selectedPreviewObj.IsImage = false;
                    $scope.selectedPreviewObj.IsPdf = false;
                    $scope.selectedPreviewObj.IsDicom = false;
                    $scope.selectedPreviewObj.IsTiff = false;

                    console.log(titem.DocumentExt + "__DocumentExt");

                    if (titem.DocumentExt == "image/jpeg" || titem.DocumentExt == "image/png" || titem.DocumentExt == "image/jpg" || titem.DocumentExt == "jpg" || titem.DocumentExt == "png" || titem.DocumentExt == "jpeg") {
                        $scope.selectedPreviewObj.IsImage = true;
                    }
                    else if (titem.DocumentExt == "application/pdf" || titem.DocumentExt == "application/Pdf" || titem.DocumentExt == "pdf" || titem.DocumentExt == "Pdf") {
                        $scope.selectedPreviewObj.IsPdf = true;
                    }
                    else if (titem.DocumentExt == "image/tiff" || titem.DocumentExt == "image/TIFF" || titem.DocumentExt == "tiff") {
                        $scope.selectedPreviewObj.IsTiff = true;
                    }
                    else if (titem.DocumentExt == "DCM") {
                        $scope.selectedPreviewObj.IsDicom = true;
                    }



                    angular.forEach($scope.mainAllFilesArray, function (sitem) {
                        sitem.IsActive = false;
                    });
                    titem.IsActive = true;
                    if ($scope.selectedPreviewObj.IsImage) {

                        if ($scope.selectedPreviewObj.isDicomFile) {
                            onDOMContentLoaded();
                            var array = [];
                            array.push($scope.ODImgObj.S3URL);
                            _app.loadURLs(array);
                        }
                        else {

                            canvasElU = document.getElementById("psODviewer");
                            ctx = canvasElU.getContext('2d');
                            $scope.optionspd.ctx = ctx;
                            canvasSize = canvasElU.parentNode;
                            ctx.canvas.width = canvasSize.clientWidth;
                            ctx.canvas.height = canvasSize.clientHeight;
                            resize = { height: canvasSize.clientHeight, width: canvasSize.clientWidth };


                            $scope.optionspd.zoom.value = 1.0;
                            $scope.optionspd.rotate.value = 0;
                            curPos = { x: 0, y: 0 };
                            picPos = { x: 0, y: 0 };


                       
                   
                            reader = formatReader.CreateReader("image/jpeg").create($scope.selectedPreviewObj.S3URL, $scope.optionspd, onloadODp, $q, $timeout);
                            $timeout(function () {
                                $scope.resizeTo('page');
                            }, 1000);
                        }
                    }
                    else if ($scope.selectedPreviewObj.IsPdf) {

                        $scope.getTrustedUrl = function (url) {

                            var modifiedUrl = url + "#pagemode=none&zoom=66";
                            return $sce.trustAsResourceUrl(modifiedUrl);
                        };
                    }



                }

            }

          

            $scope.init = function () {

                let params = {
                    "PatientId": $scope.selectedImageStudyObj.PatientId,
                    "BranchId": $scope.HospitalId,
                    "PageSize": 100,
                    "PageNumber": 1,
                };
                let iolobj = {
                    "ParentOrganizationId": $scope.ParenthospitalId,
                }
                $q.all([
                    eHnotePatientDataService.GetPatientBillingAppointments($scope.selectedImageStudyObj.PatientId),
                    eHnotePatientDataService.GetPatientOrderInterpretationDetails(params),
                    InventoryService.GetInventoryMasterIOLData(iolobj)
                ]).then(function (resp) {


                    if (resp[0].data.Status === 1) {
                        if (resp[0].data.data.length > 0) {
                            resp[0].data.data = resp[0].data.data || [];

                            //$scope.patientVisitsArray = resp[0].data.data.filter(function (visit) {
                            //    return new Date(visit.AppointmentDate) <= new Date();
                            //});

                            $scope.patientVisitsArray = resp[0].data.data.filter(function (visit) {
                                return (new Date(visit.AppointmentDate) <= new Date() && visit.AppointmentTypeId !== 4 && visit.AppointmentTypeId !== 14 && visit.AppointmentTypeId !== 7 && visit.StatusFlag !== "R" && visit.StatusFlag !== "C" && visit.AppointmentStatusId !== 11);
                            });

                            $scope.showAddOrderDiv = true;
                            angular.forEach($scope.patientVisitsArray, function (aitem) {
                                aitem.IschartSignoff = false;
                                if (aitem.OPChartStatus == 'E') {
                                    aitem.IschartSignoff = true;
                                }
                                aitem.NewAppointmentDate = $filter("date")(aitem.AppointmentDate, "MM-dd-yyyy");
                                aitem.VisitDate = $filter("date")(aitem.VisitDate, "MM-dd-yyyy");
                            });
                        } else {
                            alertify.error("No Appointments For the Patient To Create New Order");
                            return false;
                        }
                    }

                    if (resp[1].data.Status === 'Success') {
                        if (resp[1].data.rows.length > 0) {
                            $scope.PatientOrdersArrayNew = resp[1].data.rows || [];

                            angular.forEach($scope.PatientOrdersArrayNew, function (oitem) {
                                oitem.IsSelected = false;
                                const organMap = { 3: "OU", 2: "OS", 1: "OD" };
                                oitem.OrganName = organMap[oitem.OrganId] || "OD";
                                oitem.isdisableOrderSelection = false;
                                var visitDate = "";
                                if (oitem.ConsultationDate != null && oitem.ConsultationDate != undefined) {
                                    visitDate = $filter("date")(oitem.ConsultationDate, "MM-dd-yyyy");
                                } else if (oitem.AppointmentDate != null && oitem.ConsultationDate != undefined) {
                                    visitDate = $filter("date")(oitem.AppointmentDate, "MM-dd-yyyy");
                                }
                                //oitem.OrderCompleteName = visitDate + " - " + oitem.ProcedureName + " - " + oitem.OrganName + " ( " + oitem.ModalityName + " ) - " + oitem.SecondUserFullName
                                oitem.OrderCompleteName =visitDate + " - " +oitem.ProcedureName + " - " +oitem.OrganName +(oitem.ModalityName ? " ( " + oitem.ModalityName + " )" : "") +" - " + oitem.SecondUserFullName;
                            });


                        }
                    }
                    if (resp[2].data) {
                        $scope.TypesofLens = resp[2].data.TypesofLens || [];
                        $scope.Manufacturers = resp[2].data.Manufacturers || [];
                        $scope.DiopterArray = resp[2].data.DiopterArray || [];
                        $scope.IOLStatusArray = resp[2].data.IOLStatusArray || [];
                        $scope.HospitalModels = resp[2].data.HospitalModels || [];
                    }

                    if ($scope.ParentObject.Mode === "AddNew") {
                        $scope.selectedImageStudyObj = getnewImageStudyDetailsAddReqObj();
                        $scope.LogObj.selectedImageStudyObj = "";

                        $scope.SelectedDiagnosisArray = [];
                        $scope.InterpretationSummaryArray = [];
                        $scope.orderPopupObj.IsNewOrder = true;

                        var List = $filter("filter")($scope.patientVisitsArray, { "VisitId": $scope.selectedImageStudyObj.ConsultationId }, true) || [];
                        if (List.length>0) {
                            $scope.selectedImageStudyObj.ApptDoctorName = List[0].VisitDoctorFullName;
                            $scope.selectedImageStudyObj.ApptDoctorId = List[0].VisitDoctorId;
                            $scope.selectedImageStudyObj.IschartSignoff = false;
                            if (List[0].OPChartStatus=='E') {
                                $scope.selectedImageStudyObj.IschartSignoff = true;
                            }
                        
                        }
                    }
                    //else if ($scope.ParentObject.Mode === "AddImages")
                    //{
                    //    $scope.selectedImageStudyObj = getnewImageStudyDetailsAddReqObj();
                    //    $scope.SelectedDiagnosisArray = [];
                    //    $scope.InterpretationSummaryArray = [];
                    //    $scope.orderPopupObj.IsNewOrder = false;
                    //}
                    else {
                        $scope.orderPopupObj.IsNewOrder = false;
                        if ($scope.ParentObject.Mode === "AddImages") {
                            $scope.orderPopupObj.IsNewOrder = true;
                        }

                        var List = $filter("filter")($scope.patientVisitsArray, { "VisitId": $scope.selectedImageStudyObj.ConsultationId }, true) || [];
                        if (List.length > 0) {
                            $scope.selectedImageStudyObj.ApptDoctorName = List[0].VisitDoctorFullName;
                            $scope.selectedImageStudyObj.ApptDoctorId = List[0].VisitDoctorId;
                            $scope.selectedImageStudyObj.IschartSignoff = false;
                            if (List[0].OPChartStatus == 'E') {
                                $scope.selectedImageStudyObj.IschartSignoff = true;
                            }

                        }

                        $scope.SelectedDiagnosisArray = $scope.ParentObject.SelectedDiagnosisArray || [];
                        $scope.InterpretationSummaryArray = $scope.ParentObject.InterpretationSummaryArray || [];
                        var editObj = $scope.ParentObject.selectedImageStudyObj || "";
                        console.log(editObj.ConsultationId + "__ConsultationId");

                        $scope.selectedImageStudyObj.OPChartStatus = editObj.OPChartStatus || "";
                        $scope.selectedImageStudyObj.PatientImageStudyId = editObj.PatientImageStudyId || 0;
                        $scope.selectedImageStudyObj.PatientOrderId = editObj.PatientOrderId || 0;
                        $scope.selectedImageStudyObj.OrderName = editObj.OrderName || "";
                        $scope.selectedImageStudyObj.SelectedEye = editObj.SelectedEye || 1;
                        $scope.selectedImageStudyObj.ConnectedDiagnosisList = editObj.ConnectedDiagnosisList || [];
                        $scope.selectedImageStudyObj.InvestigationId = editObj.InvestigationId || 0;
                        $scope.selectedImageStudyObj.ModalityId = editObj.ModalityId || 0;
                        $scope.selectedImageStudyObj.HospitalId = editObj.HospitalId || $scope.HospitalId;
                        $scope.selectedImageStudyObj.OrganizationId = editObj.OrganizationId || $scope.HospitalId;
                        $scope.selectedImageStudyObj.ModalityName = editObj.ModalityName || "";
                        $scope.selectedImageStudyObj.ImageQuality = editObj.ImageQuality || "";
                        $scope.selectedImageStudyObj.AppointmentId = editObj.AppointmentId || 0;
                        $scope.selectedImageStudyObj.ConsultationId = editObj.ConsultationId || 0;
                        $scope.selectedImageStudyObj.AppointmentDate = editObj.AppointmentDate || null;
                        $scope.selectedImageStudyObj.ConsultationDate = editObj.ConsultationDate || null;
                        $scope.selectedImageStudyObj.CPTCode = editObj.CPTCode || "";
                        $scope.selectedImageStudyObj.LOINCCode = editObj.LOINCCode || "";
                        $scope.selectedImageStudyObj.ProcedureId = editObj.ProcedureId || 0;
                        $scope.selectedImageStudyObj.OrganizationProcedureId = editObj.OrganizationProcedureId || 0;
                        $scope.selectedImageStudyObj.ProcedureName = editObj.ProcedureName || "";
                        $scope.selectedImageStudyObj.ProcedureCode = editObj.ProcedureCode || "";
                        $scope.selectedImageStudyObj.OrderDate = $filter("date")(editObj.OrderDate, "MM-dd-yyyy") || null;
                        $scope.selectedImageStudyObj.OrderNumber = editObj.OrderNumber || "";
                        $scope.selectedImageStudyObj.OrderTypeId = editObj.OrderTypeId || 1;
                        $scope.selectedImageStudyObj.OrganId = editObj.OrganId || 0;
                        $scope.selectedImageStudyObj.StatusId = editObj.StatusId || 1;
                        $scope.selectedImageStudyObj.PatientId = editObj.PatientId || 0;
                        $scope.selectedImageStudyObj.PatientName = editObj.PatientName || "";
                        $scope.selectedImageStudyObj.InvestigationName = editObj.InvestigationName || "";
                        $scope.selectedImageStudyObj.IsModalityId = editObj.ModalityId || 0;


                        let tempArray = $filter('filter')($scope.ParentObject.allUserList, { 'DoctorID': editObj.DoctorId }, true);
                        if (tempArray.length > 0) {


                            $scope.SuffixName = '';
                            tempArray[0].SuffixName = tempArray[0].SuffixName || '';
                            if (tempArray[0].SuffixName != "") {
                                $scope.SuffixName = tempArray[0].SuffixName;
                            }

                            $scope.LicenseNumber = "";

                            tempArray[0].LicenseNumber = tempArray[0].LicenseNumber || "";
                            if (tempArray[0].LicenseNumber != "") {
                                $scope.LicenseNumber = 'LIC :' + ' ' + tempArray[0].LicenseNumber;
                            }

                        }

                        let technicianArray = $filter('filter')($scope.ParentObject.allUserList, { 'DoctorID': editObj.TechnicianId }, true);
                        if (technicianArray.length > 0) {


                            $scope.TechnicianSuffixName = '';
                            technicianArray[0].SuffixName = technicianArray[0].SuffixName || '';
                            if (technicianArray[0].SuffixName != "") {
                                $scope.TechnicianSuffixName = technicianArray[0].SuffixName;
                            }

                            $scope.TechnicianLicenseNumber = "";

                            technicianArray[0].LicenseNumber = technicianArray[0].LicenseNumber || "";
                            if (technicianArray[0].LicenseNumber != "") {
                                $scope.TechnicianLicenseNumber = 'LIC :' + ' ' + technicianArray[0].LicenseNumber;
                            }

                        }



                        $scope.selectedImageStudyObj.DoctorId = editObj.DoctorId;
                        $scope.selectedImageStudyObj.DoctorName = editObj.DoctorName;
                        $scope.selectedImageStudyObj.DoctorObj = { "FullName": editObj.DoctorName || "Select" };
                        $scope.selectedImageStudyObj.TechnicianId = editObj.TechnicianId;
                        $scope.selectedImageStudyObj.TechnicianName = editObj.TechnicianName;
                        $scope.selectedImageStudyObj.TechnicianObj = { "FullName": editObj.TechnicianName || "Select" };
                        $scope.selectedImageStudyObj.ProviderRemarks = editObj.ProviderRemarks || "";
                        $scope.selectedImageStudyObj.TechnicianRemarks = editObj.TechnicianRemarks || "";
                        $scope.selectedImageStudyObj.SelectedDiagObj = editObj.SelectedDiagObj || "";



                        $scope.selectedImageStudyObj.OCTMACFindings = editObj.OCTMACFindings || "";
                        $scope.selectedImageStudyObj.OCTONFindings = editObj.OCTONFindings || "";
                        $scope.selectedImageStudyObj.ODMacularFindingValue = editObj.ODMacularFindingValue || "";
                        $scope.selectedImageStudyObj.ODMacularThickNess = editObj.ODMacularThickNess || "";
                        $scope.selectedImageStudyObj.ODONfindingValue = editObj.ODONfindingValue || "";
                        $scope.selectedImageStudyObj.ODRHFLThickNess = editObj.ODRHFLThickNess || "";
                        $scope.selectedImageStudyObj.OSMacularFindingValue = editObj.OSMacularFindingValue || "";
                        $scope.selectedImageStudyObj.OSMacularThickNess = editObj.OSMacularThickNess || "";
                        $scope.selectedImageStudyObj.OSONfindingValue = editObj.OSONfindingValue || "";
                        $scope.selectedImageStudyObj.OSRHFLThickNess = editObj.OSRHFLThickNess || "";

                        $scope.selectedImageStudyObj.ODIOLLensValue = editObj.ODIOLLensValue || "";
                        $scope.selectedImageStudyObj.ODIOLPower = editObj.ODIOLPower || "";
                        $scope.selectedImageStudyObj.ODToricPower = editObj.ODToricPower || "";
                        $scope.selectedImageStudyObj.ODIOLManufacturer = editObj.ODIOLManufacturer || "";
                        $scope.selectedImageStudyObj.OSIOLLensValue = editObj.OSIOLLensValue || "";
                        $scope.selectedImageStudyObj.OSIOLPower = editObj.OSIOLPower || "";
                        $scope.selectedImageStudyObj.OSToricPower = editObj.OSToricPower || "";
                        $scope.selectedImageStudyObj.OSIOLManufacturer = editObj.OSIOLManufacturer || "";

                        $scope.selectedImageStudyObj.ODFixationLoss = editObj.ODFixationLoss || "";
                        $scope.selectedImageStudyObj.ODFalsePositiveErrors = editObj.ODFalsePositiveErrors || "";
                        $scope.selectedImageStudyObj.ODFalseNegitiveErrors = editObj.ODFalseNegitiveErrors || "";
                        $scope.selectedImageStudyObj.ODTDProbabilityPlot = editObj.ODTDProbabilityPlot || "";
                        $scope.selectedImageStudyObj.ODPDProbabilityPlot = editObj.ODPDProbabilityPlot || "";
                        $scope.selectedImageStudyObj.ODMeanDeviation = editObj.ODMeanDeviation || "";
                        $scope.selectedImageStudyObj.ODPatternStandardDeviation = editObj.ODPatternStandardDeviation || "";
                        $scope.selectedImageStudyObj.ODVisualFieldIndex = editObj.ODVisualFieldIndex || "";
                        $scope.selectedImageStudyObj.ODGHTValue = editObj.ODGHTValue || "";
                        $scope.selectedImageStudyObj.ODHVFFindingValue = editObj.ODHVFFindingValue || "";

                        $scope.selectedImageStudyObj.OSFixationLoss = editObj.OSFixationLoss || "";
                        $scope.selectedImageStudyObj.OSFalsePositiveErrors = editObj.OSFalsePositiveErrors || "";
                        $scope.selectedImageStudyObj.OSFalseNegitiveErrors = editObj.OSFalseNegitiveErrors || "";
                        $scope.selectedImageStudyObj.OSTDProbabilityPlot = editObj.OSTDProbabilityPlot || "";
                        $scope.selectedImageStudyObj.OSPDProbabilityPlot = editObj.OSPDProbabilityPlot || "";
                        $scope.selectedImageStudyObj.OSMeanDeviation = editObj.OSMeanDeviation || "";
                        $scope.selectedImageStudyObj.OSPatternStandardDeviation = editObj.OSPatternStandardDeviation || "";
                        $scope.selectedImageStudyObj.OSVisualFieldIndex = editObj.OSVisualFieldIndex || "";
                        $scope.selectedImageStudyObj.OSGHTValue = editObj.OSGHTValue || "";
                        $scope.selectedImageStudyObj.OSHVFFindingValue = editObj.OSHVFFindingValue || "";

                        $scope.selectedImageStudyObj.DiagnosisListArray = editObj.DiagnosisListArray || [];

                        $scope.selectedImageStudyObj.FundusFindingArray = editObj.FundusFindingArray || [];
                        $scope.selectedImageStudyObj.FAFindingArray = editObj.FAFindingArray || [];
                        $scope.selectedImageStudyObj.ICGFindingArray = editObj.ICGFindingArray || [];
                        $scope.selectedImageStudyObj.MacularFindingArray = editObj.MacularFindingArray || [];
                        $scope.selectedImageStudyObj.ONFindingArray = editObj.ONFindingArray || [];
                        $scope.selectedImageStudyObj.PatientFiles = editObj.PatientFiles || [];

                        $scope.selectedImageStudyObj.ODFrequenciesValue = editObj.ODFrequenciesValue || "";
                        $scope.selectedImageStudyObj.ODFindingValue = editObj.ODFindingValue || "";
                        $scope.selectedImageStudyObj.OSFrequenciesValue = editObj.OSFrequenciesValue || "";
                        $scope.selectedImageStudyObj.OSFindingValue = editObj.OSFindingValue || "";
                        $scope.selectedImageStudyObj.ODK1Value = editObj.ODK1Value || "";
                        $scope.selectedImageStudyObj.ODK2Value = editObj.ODK2Value || "";
                        $scope.selectedImageStudyObj.ODCYLValue = editObj.ODCYLValue || "";
                        $scope.selectedImageStudyObj.ODCornealThicknessValue = editObj.ODCornealThicknessValue || "";
                        $scope.selectedImageStudyObj.OSK1Value = editObj.OSK1Value || "";
                        $scope.selectedImageStudyObj.OSK2Value = editObj.OSK2Value || "";
                        $scope.selectedImageStudyObj.OSCYLValue = editObj.OSCYLValue || "";
                        $scope.selectedImageStudyObj.OSCornealThicknessValue = editObj.OSCornealThicknessValue || "";
                        $scope.selectedImageStudyObj.ODOCTMACFindings = editObj.ODOCTMACFindings || "";
                        $scope.selectedImageStudyObj.ODLidsValue = editObj.ODLidsValue || "";
                        $scope.selectedImageStudyObj.ODConjunctivaValue = editObj.ODConjunctivaValue || "";
                        $scope.selectedImageStudyObj.ODScleraValue = editObj.ODScleraValue || "";
                        $scope.selectedImageStudyObj.ODCorneaValue = editObj.ODCorneaValue || "";
                        $scope.selectedImageStudyObj.OSOCTMACFindings = editObj.OSOCTMACFindings || "";
                        $scope.selectedImageStudyObj.OSLidsValue = editObj.OSLidsValue || "";
                        $scope.selectedImageStudyObj.OSConjunctivaValue = editObj.OSConjunctivaValue || "";
                        $scope.selectedImageStudyObj.OSScleraValue = editObj.OSScleraValue || "";
                        $scope.selectedImageStudyObj.OSCorneaValue = editObj.OSCorneaValue || "";
                        $scope.selectedImageStudyObj.ODEndothelialCellCountValue = editObj.ODEndothelialCellCountValue || "";
                        $scope.selectedImageStudyObj.ODEndoCornealThicknessValue = editObj.ODEndoCornealThicknessValue || "";
                        $scope.selectedImageStudyObj.ODEndothelialCellDensity = editObj.ODEndothelialCellDensity || "";
                        $scope.selectedImageStudyObj.OSEndothelialCellCountValue = editObj.OSEndothelialCellCountValue || "";
                        $scope.selectedImageStudyObj.OSEndoCornealThicknessValue = editObj.OSEndoCornealThicknessValue || "";
                        $scope.selectedImageStudyObj.OSEndothelialCellDensity = editObj.OSEndothelialCellDensity || "";
                        $scope.selectedImageStudyObj.ODASOCTfindingValue = editObj.ODASOCTfindingValue || "";
                        $scope.selectedImageStudyObj.OSASOCTfindingValue = editObj.OSASOCTfindingValue || "";
                        $scope.selectedImageStudyObj.ODFAFindingValue = editObj.ODFAFindingValue || "";
                        $scope.selectedImageStudyObj.OSFAFindingValue = editObj.OSFAFindingValue || "";
                        $scope.selectedImageStudyObj.ODICGFindingValue = editObj.ODICGFindingValue || "";
                        $scope.selectedImageStudyObj.OSICGFindingValue = editObj.OSICGFindingValue || "";

                        $scope.selectedImageStudyObj.ImagestudyReviewedDate = editObj.ImagestudyReviewedDate || null;
                        $scope.selectedImageStudyObj.ODFundusFindingValue = editObj.ODFundusFindingValue || "";
                        $scope.selectedImageStudyObj.OSFundusFindingValue = editObj.OSFundusFindingValue || "";
                        $scope.selectedImageStudyObj.ODFundusFindingObj = editObj.ODFundusFindingObj || "";
                        $scope.selectedImageStudyObj.OSFundusFindingObj = editObj.OSFundusFindingObj || "";
                        if ($scope.InterpretationSummaryArray.length > 0) {
                            $scope.selectedImageStudyObj.FundusFindingArray = $scope.InterpretationSummaryArray[0].FundusFindingArray || [];
                            $scope.selectedImageStudyObj.FAFindingArray = $scope.InterpretationSummaryArray[0].FAFindingArray || [];
                            $scope.selectedImageStudyObj.ICGFindingArray = $scope.InterpretationSummaryArray[0].ICGFindingArray || [];
                            $scope.selectedImageStudyObj.MacularFindingArray = $scope.InterpretationSummaryArray[0].MacularFindingArray || [];
                            $scope.selectedImageStudyObj.ONFindingArray = $scope.InterpretationSummaryArray[0].ONFindingArray || [];
                            $scope.selectedImageStudyObj.OtherFindingArray = $scope.InterpretationSummaryArray[0].OtherFindingArray || [];

                        }
                        else {
                            $scope.selectedImageStudyObj.ProviderRemarks = "";
                            $scope.selectedImageStudyObj.TechnicianRemarks = "";

                        }

                        if ($scope.ParentObject.selectedImageStudyFiles.AllFiles.length > 0) {
                            $scope.selectedImageStudyFiles.AllFiles = $scope.ParentObject.selectedImageStudyFiles.AllFiles || [];
                            $scope.selectedImageStudyObj.PatientFiles = angular.copy($scope.ParentObject.selectedImageStudyFiles.AllFiles) || [];
                            angular.forEach($scope.selectedImageStudyFiles.AllFiles, function (sitem) {
                                sitem.S3URL = sitem.S3URL || "";
                                if (sitem.OrganId === 1) {
                                    var obj = {
                                        "big": sitem.S3URL,
                                        "small": sitem.S3URL,
                                        "OrganId": sitem.OrganId,
                                        "DocumentId": sitem.DocumentId,
                                        "FileTypeId": sitem.FileTypeId || 0,
                                        "DocumentName": sitem.DocumentName || '',
                                        "isActive": false,
                                        "isDicomFile": sitem.isDicomFile,
                                        "FileType": sitem.DocumentExt
                                    }
                                    $scope.selectedImageStudyFiles.RightEyeFiles.push(obj);
                                }
                                if (sitem.OrganId === 2) {
                                    var obj = {
                                        "big": sitem.S3URL,
                                        "small": sitem.S3URL,
                                        "DocumentId": sitem.DocumentId,
                                        "FileTypeId": sitem.FileTypeId || 0,
                                        "DocumentName": sitem.DocumentName || '',
                                        "OrganId": sitem.OrganId,
                                        "isActive": false,
                                        "isDicomFile": sitem.isDicomFile,
                                        "FileType": sitem.DocumentExt
                                    }

                                    $scope.selectedImageStudyFiles.LeftEyeFiles.push(obj);
                                }
                                if (sitem.OrganId === 3) {
                                    var obj = {
                                        "big": sitem.S3URL,
                                        "small": sitem.S3URL,
                                        "DocumentId": sitem.DocumentId,
                                        "FileTypeId": sitem.FileTypeId || 0,
                                        "DocumentName": sitem.DocumentName || '',
                                        "OrganId": sitem.OrganId,
                                        "isActive": false,
                                        "isDicomFile": sitem.isDicomFile,
                                        "FileType": sitem.DocumentExt
                                    }

                                    $scope.selectedImageStudyFiles.BothEyeFiles.push(obj);
                                }
                            });
                        } else {
                            $scope.selectedImageStudyFiles.AllFiles = [];
                            $scope.selectedImageStudyFiles.RightEyeFiles = [];
                            $scope.selectedImageStudyFiles.LeftEyeFiles = [];
                            $scope.selectedImageStudyFiles.BothEyeFiles = [];
                        }

                        if ($scope.selectedImageStudyFiles.RightEyeFiles.length > 0) {
                            angular.forEach($scope.selectedImageStudyFiles.RightEyeFiles, function (item) {
                                var obj1 = {
                                    "S3URL": item.small,
                                    "DocumentExt": item.FileType || '',
                                    "DocumentName": item.DocumentName || '',
                                    "OrganId": item.OrganId,
                                    "DeleteInd": item.DeleteInd || "N",
                                    "DocumentId": item.DocumentId || 0,
                                    "FileTypeId": item.FileTypeId || 5,
                                    "IsActive": false
                                };
                                $scope.tempODImagesArray.push(obj1);
                                $scope.mainAllFilesArray.push(obj1);
                            });

                        }
                        if ($scope.selectedImageStudyFiles.LeftEyeFiles.length > 0) {
                            angular.forEach($scope.selectedImageStudyFiles.LeftEyeFiles, function (item) {
                                var obj2 = {
                                    "S3URL": item.small,
                                    "DocumentExt": item.FileType || '',
                                    "DocumentName": item.DocumentName || '',
                                    "OrganId": item.OrganId,
                                    "DeleteInd": item.DeleteInd || "N",
                                    "DocumentId": item.DocumentId || 0,
                                    "FileTypeId": item.FileTypeId || 5,
                                    "IsActive": false
                                };

                                $scope.tempOSImagesArray.push(obj2);
                                $scope.mainAllFilesArray.push(obj2);
                            });
                        }
                        if ($scope.selectedImageStudyFiles.BothEyeFiles.length > 0) {
                            angular.forEach($scope.selectedImageStudyFiles.BothEyeFiles, function (item) {
                                var obj2 = {
                                    "S3URL": item.small,
                                    "DocumentExt": item.FileType || '',
                                    "DocumentName": item.DocumentName || '',
                                    "OrganId": item.OrganId,
                                    "DeleteInd": item.DeleteInd || "N",
                                    "DocumentId": item.DocumentId || 0,
                                    "FileTypeId": item.FileTypeId || 5,
                                    "IsActive": false
                                };

                                $scope.tempOUImagesArray.push(obj2);
                                $scope.mainAllFilesArray.push(obj2);
                            });
                        }
                        $scope.LogObj.selectedImageStudyObj = angular.copy($scope.selectedImageStudyObj) || "";

                        $scope.mainAllFilesArray = $scope.mainAllFilesArray.map((mitem, index) => ({
                            ...mitem,
                            IsActive: index === 0
                        }));

                        if ($scope.mainAllFilesArray.length > 0) {
                            $scope.navtoShowViewer($scope.mainAllFilesArray[0]);
                        }
                    }


                    if ($scope.FindingCheckValuesList.length === 0) {
                        $scope.GetFindingCheckValues();
                    }
                }, function (err) {
                    console.log(err);
                });





            };

           



            // Zoom function
            $scope.zoom = function (direction) {
                $scope.$applyAsync(function () {
                    var oldWidth, newWidth = 0;
                    var oldHeight, newHeight = 0;
                    // Does reader support zoom ?
                    // Compute correct width
                    if (!reader.isZoom) {
                        oldWidth = reader.oldwidth;
                        oldHeight = reader.height;
                    } else {
                        oldWidth = reader.width * $scope.optionspd.zoom.value;
                        oldHeight = reader.height * $scope.optionspd.zoom.value;
                    }

                    // Compute new zoom
                    $scope.optionspd.zoom.value += $scope.optionspd.zoom.step * direction;
                    // Round
                    $scope.optionspd.zoom.value = Math.round($scope.optionspd.zoom.value * 100) / 100;
                    if ($scope.optionspd.zoom.value >= $scope.optionspd.zoom.max) {
                        $scope.optionspd.zoom.value = $scope.optionspd.zoom.max;
                    }
                    if ($scope.optionspd.zoom.value <= $scope.optionspd.zoom.min) {
                        $scope.optionspd.zoom.value = $scope.optionspd.zoom.min;
                    }
                    // Refresh picture
                    if (reader.refresh != null) {
                        reader.refresh();
                    }


                    // Compute new image size
                    if (!reader.isZoom) {
                        newWidth = reader.width;
                        newHeight = reader.height;
                    } else {
                        newWidth = reader.width * $scope.optionspd.zoom.value;
                        newHeight = reader.height * $scope.optionspd.zoom.value;
                    }
                    // new image position after zoom
                    picPos.x = picPos.x - (newWidth - oldWidth) / 2;
                    picPos.y = picPos.y - (newHeight - oldHeight) / 2;
                });
            };

            // Rotate function
            $scope.rotate = function (direction) {
                $scope.$applyAsync(function () {
                    $scope.optionspd.rotate.value += $scope.optionspd.rotate.step * direction;
                    if (($scope.optionspd.rotate.value <= -360) || ($scope.optionspd.rotate.value >= 360)) {
                        $scope.optionspd.rotate.value = 0;
                    }
                    applyTransform();
                });
            };

            $scope.init();

        });


        $scope.changeOrderModality = function (ModalityId) {
            if ($scope.selectedImageStudyObj.IsModalityId !='') {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to change the modality? All previous interpretation data will be cleared.", function () {
                    $scope.selectedImageStudyObj.ModalityName = "";
                    var List = $filter("filter")($scope.ParentObject.MasterModalityArray, { "ModalityId": ModalityId }, true);
                    if (List.length > 0) {
                        $scope.selectedImageStudyObj.ModalityName = List[0].ModalityName;
                        $scope.selectedImageStudyObj.ModalityName = $scope.selectedImageStudyObj.ModalityName.replace(/\s+/g, '')
                    }
                    $scope.selectedImageStudyObj.IsModalityId = $scope.selectedImageStudyObj.ModalityId

                    $scope.selectedImageStudyObj.OCTMACFindings = "";
                    $scope.selectedImageStudyObj.OCTONFindings = "";
                    $scope.selectedImageStudyObj.ODMacularFindingValue = "";
                    $scope.selectedImageStudyObj.ODMacularThickNess = "";
                    $scope.selectedImageStudyObj.ODONfindingValue = "";
                    $scope.selectedImageStudyObj.ODRHFLThickNess = "";
                    $scope.selectedImageStudyObj.OSMacularFindingValue = "";
                    $scope.selectedImageStudyObj.OSMacularThickNess = "";
                    $scope.selectedImageStudyObj.OSONfindingValue = "";
                    $scope.selectedImageStudyObj.OSRHFLThickNess = "";

                    $scope.selectedImageStudyObj.ODIOLLensValue = "";
                    $scope.selectedImageStudyObj.ODIOLPower = "";
                    $scope.selectedImageStudyObj.ODToricPower = "";
                    $scope.selectedImageStudyObj.ODIOLManufacturer = "";
                    $scope.selectedImageStudyObj.OSIOLLensValue = "";
                    $scope.selectedImageStudyObj.OSIOLPower = "";
                    $scope.selectedImageStudyObj.OSToricPower = "";
                    $scope.selectedImageStudyObj.OSIOLManufacturer = "";

                    $scope.selectedImageStudyObj.ODFixationLoss = "";
                    $scope.selectedImageStudyObj.ODFalsePositiveErrors = "";
                    $scope.selectedImageStudyObj.ODFalseNegitiveErrors = "";
                    $scope.selectedImageStudyObj.ODTDProbabilityPlot = "";
                    $scope.selectedImageStudyObj.ODPDProbabilityPlot = "";
                    $scope.selectedImageStudyObj.ODMeanDeviation = "";
                    $scope.selectedImageStudyObj.ODPatternStandardDeviation = "";
                    $scope.selectedImageStudyObj.ODVisualFieldIndex = "";
                    $scope.selectedImageStudyObj.ODGHTValue = "";
                    $scope.selectedImageStudyObj.ODHVFFindingValue = "";

                    $scope.selectedImageStudyObj.OSFixationLoss = "";
                    $scope.selectedImageStudyObj.OSFalsePositiveErrors = "";
                    $scope.selectedImageStudyObj.OSFalseNegitiveErrors = "";
                    $scope.selectedImageStudyObj.OSTDProbabilityPlot = "";
                    $scope.selectedImageStudyObj.OSPDProbabilityPlot = "";
                    $scope.selectedImageStudyObj.OSMeanDeviation = "";
                    $scope.selectedImageStudyObj.OSPatternStandardDeviation = "";
                    $scope.selectedImageStudyObj.OSVisualFieldIndex = "";
                    $scope.selectedImageStudyObj.OSGHTValue = "";
                    $scope.selectedImageStudyObj.OSHVFFindingValue = "";



                    //$scope.selectedImageStudyObj.FundusFindingArray = [];
                    //$scope.selectedImageStudyObj.FAFindingArray = [];
                    //$scope.selectedImageStudyObj.ICGFindingArray = [];
                    //$scope.selectedImageStudyObj.MacularFindingArray = [];
                    //$scope.selectedImageStudyObj.ONFindingArray = [];
                    //$scope.selectedImageStudyObj.PatientFiles = [];

                    if ($scope.ParentObject.Mode == 'Edit') {
                        $scope.selectedImageStudyObj.FundusFindingArray = $scope.selectedImageStudyObj.FundusFindingArray || [];
                        if ($scope.selectedImageStudyObj.FundusFindingArray.length > 0) {
                            angular.forEach($scope.selectedImageStudyObj.FundusFindingArray, function (item) {
                                item.DeleteInd = 'Y';
                            });
                        }

                        $scope.selectedImageStudyObj.FAFindingArray = $scope.selectedImageStudyObj.FAFindingArray || [];
                        if ($scope.selectedImageStudyObj.FAFindingArray.length > 0) {
                            angular.forEach($scope.selectedImageStudyObj.FAFindingArray, function (item) {
                                item.DeleteInd = 'Y';
                            });
                        }

                        $scope.selectedImageStudyObj.ICGFindingArray = $scope.selectedImageStudyObj.ICGFindingArray || [];
                        if ($scope.selectedImageStudyObj.ICGFindingArray.length > 0) {
                            angular.forEach($scope.selectedImageStudyObj.ICGFindingArray, function (item) {
                                item.DeleteInd = 'Y';
                            });
                        }

                        $scope.selectedImageStudyObj.MacularFindingArray = $scope.selectedImageStudyObj.MacularFindingArray || [];
                        if ($scope.selectedImageStudyObj.MacularFindingArray.length > 0) {
                            angular.forEach($scope.selectedImageStudyObj.MacularFindingArray, function (item) {
                                item.DeleteInd = 'Y';
                            });
                        }

                        $scope.selectedImageStudyObj.OtherFindingArray = $scope.selectedImageStudyObj.OtherFindingArray || [];
                        if ($scope.selectedImageStudyObj.OtherFindingArray.length > 0) {
                            angular.forEach($scope.selectedImageStudyObj.OtherFindingArray, function (item) {
                                item.DeleteInd = 'Y';
                            });
                        }

                        $scope.selectedImageStudyObj.ONFindingArray = $scope.selectedImageStudyObj.ONFindingArray || [];
                        if ($scope.selectedImageStudyObj.ONFindingArray.length > 0) {
                            angular.forEach($scope.selectedImageStudyObj.ONFindingArray, function (item) {
                                item.DeleteInd = 'Y';
                            });
                        }

                        $scope.selectedImageStudyObj.PatientFiles = $scope.selectedImageStudyObj.PatientFiles || [];
                        if ($scope.selectedImageStudyObj.PatientFiles.length > 0) {
                            angular.forEach($scope.selectedImageStudyObj.PatientFiles, function (item) {
                                item.DeleteInd = 'Y';
                            });
                        }

                    } else {
                        $scope.selectedImageStudyObj.FundusFindingArray = [];
                        $scope.selectedImageStudyObj.FAFindingArray = [];
                        $scope.selectedImageStudyObj.ICGFindingArray = [];
                        $scope.selectedImageStudyObj.MacularFindingArray = [];
                        $scope.selectedImageStudyObj.ONFindingArray = [];
                        $scope.selectedImageStudyObj.PatientFiles = [];
                        $scope.selectedImageStudyObj.OtherFindingArray = [];
                    }


                    $scope.selectedImageStudyObj.ODFindingValue = "";
                    $scope.selectedImageStudyObj.ODFrequenciesValue = "";
                    $scope.selectedImageStudyObj.OSFrequenciesValue = "";
                    $scope.selectedImageStudyObj.OSFindingValue = "";
                    $scope.selectedImageStudyObj.ODK1Value = "";
                    $scope.selectedImageStudyObj.ODK2Value = "";
                    $scope.selectedImageStudyObj.ODCYLValue = "";
                    $scope.selectedImageStudyObj.ODCornealThicknessValue = "";
                    $scope.selectedImageStudyObj.OSK1Value = "";
                    $scope.selectedImageStudyObj.OSK2Value = "";
                    $scope.selectedImageStudyObj.OSCYLValue = "";
                    $scope.selectedImageStudyObj.OSCornealThicknessValue = "";
                    $scope.selectedImageStudyObj.ODOCTMACFindings = "";
                    $scope.selectedImageStudyObj.ODLidsValue = "";
                    $scope.selectedImageStudyObj.ODConjunctivaValue = "";
                    $scope.selectedImageStudyObj.ODScleraValue = "";
                    $scope.selectedImageStudyObj.ODCorneaValue = "";
                    $scope.selectedImageStudyObj.OSOCTMACFindings = "";
                    $scope.selectedImageStudyObj.OSLidsValue = "";
                    $scope.selectedImageStudyObj.OSConjunctivaValue = "";
                    $scope.selectedImageStudyObj.OSScleraValue = "";
                    $scope.selectedImageStudyObj.OSCorneaValue = "";
                    $scope.selectedImageStudyObj.ODEndothelialCellCountValue = "";
                    $scope.selectedImageStudyObj.ODEndoCornealThicknessValue = "";
                    $scope.selectedImageStudyObj.ODEndothelialCellDensity = "";
                    $scope.selectedImageStudyObj.OSEndothelialCellCountValue = "";
                    $scope.selectedImageStudyObj.OSEndoCornealThicknessValue = "";
                    $scope.selectedImageStudyObj.OSEndothelialCellDensity = "";
                    $scope.selectedImageStudyObj.ODASOCTfindingValue = "";
                    $scope.selectedImageStudyObj.OSASOCTfindingValue = "";
                    $scope.selectedImageStudyObj.ODFAFindingValue = "";
                    $scope.selectedImageStudyObj.OSFAFindingValue = "";
                    $scope.selectedImageStudyObj.ODICGFindingValue = "";
                    $scope.selectedImageStudyObj.OSICGFindingValue = "";

                    $scope.selectedImageStudyObj.ImagestudyReviewedDate = null;
                    $scope.selectedImageStudyObj.ODFundusFindingValue = "";
                    $scope.selectedImageStudyObj.OSFundusFindingValue = "";
                    $scope.selectedImageStudyObj.ODFundusFindingObj = "";
                    $scope.selectedImageStudyObj.OSFundusFindingObj = "";

                }, function () {
                    r = "You pressed Cancel!";
                    $scope.selectedImageStudyObj.ModalityId = $scope.ParentObject.selectedImageStudyObj.ModalityId;
                    $scope.selectedImageStudyObj.ModalityName = $scope.ParentObject.selectedImageStudyObj.ModalityName;
                });
            }

            $scope.selectedImageStudyObj.IsModalityId = $scope.selectedImageStudyObj.ModalityId;

            $scope.GetOrgOtherFindingsImageManagement();
        };


        $scope.changeOrderVisit = function (VisitId) {

            $scope.selectedImageStudyObj.AppointmentId = 0;
            var List = $filter("filter")($scope.patientVisitsArray, { "VisitId": VisitId }, true);
            if (List.length > 0) {
                $scope.selectedImageStudyObj.IschartSignoff = false;
                $scope.selectedImageStudyObj.ApptDoctorId = List[0].VisitDoctorId;
                $scope.selectedImageStudyObj.AppointmentId = List[0].AppointmentId;
                $scope.selectedImageStudyObj.AppointmentDate = List[0].AppointmentDate;
                if (List[0].OPChartStatus == "E") {
                    $scope.selectedImageStudyObj.IschartSignoff = true;
                    alertify.error("This appointment is signed off");
                    return false;
                }
           
                
            }

            console.log($scope.selectedImageStudyObj.AppointmentId + "__" + $scope.selectedImageStudyObj.AppointmentDate);
        };



        $scope.ContinueSignOffpassword = function (type,screen) {
            let obj = {
                "Screen": "Chart",
                "Type": type || "",
                "VisitId": $scope.selectedImageStudyObj.ConsultationId,
                "DoctorId": $scope.selectedImageStudyObj.ApptDoctorId,
                "allUserList": angular.copy($scope.ParentObject.allUserList),

            };

            let signmodalInstance = $uibModal.open({
                "templateUrl": "templates/consultation/SignOffPasswordRequired.html",
                "controller": "UsPasswordAuthenticationPopupCtrl",
                "size": "md",
                //"windowClass": "appointment-full-popup",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "obj": function () { return obj; }
                }
            });
            signmodalInstance.result.then(function (resp) {
                $scope.selectedImageStudyObj.IschartSignoff = false;
                $scope.getPatientPreviousAppointments();
                if (screen =='Summary') {
                    $scope.selectedImageStudyObj.OPChartStatus = 'D';
                }
                //var TempArray = $filter("filter")($scope.patientVisitsArray, { "VisitId": $scope.selectedImageStudyObj.ConsultationId }, true) || [];
                //if (TempArray.length > 0) {
                //    TempArray[0].OPChartStatus = "E";
                //}
            }, function (data) {

            });
        }


        /* OD => OrganId 1, OS => OrganId 2. Kept in one place so both dropdowns stay independent. */
        $scope.GetOtherFindingOrganId = function (type) {
            return type == 'OS' ? 2 : 1;
        }

        $scope.SetOtherFindingAddNewBtn = function (OrganId, ShowInd) {
            if (OrganId == 2) {
                $scope.selectedImageStudyObj.OSOtherFinShowAddNewBtn = ShowInd;
            } else {
                $scope.selectedImageStudyObj.ODOtherFinShowAddNewBtn = ShowInd;
            }
        }

        $scope.GetOtherFindingText = function (obj) {
            if (angular.isObject(obj)) {
                return (obj.FindingValue || obj.FindingDescription || "").toString().trim();
            }
            return (obj || "").toString().trim();
        }

        $scope.ChangeOtherFinding = function (selectedinv, item, type) {

            $scope.selectedImageStudyObj.OtherFindingArray = $scope.selectedImageStudyObj.OtherFindingArray || [];
            var FindingValue = $scope.GetOtherFindingText(item);

            if (type == 'OD') {
                if ($scope.selectedImageStudyObj.OtherFindingArray.length > 0) {
                    var filterOtherFinding = $filter("filter")($scope.selectedImageStudyObj.OtherFindingArray, { "FindingValue": FindingValue, "OrganId": 1, "DeleteInd": item.DeleteInd }, true);
                    if (filterOtherFinding.length > 0) {
                        $scope.selectedImageStudyObj.OtherFindingODObj = "";
                        alertify.error("Already Added");
                        return false;
                    }
                }

                var obj = {

                    "InterpretationFindingId": 0,
                    "FindingTemplateId": 0,
                    "FindingId": item.FindingId || 0,
                    "FindingValue": FindingValue,
                    "DeleteInd": "N",
                    "OrganId": 1,
                    "TypeId": 6
                }

                $scope.selectedImageStudyObj.OtherFindingODObj = "";
                $scope.SetOtherFindingAddNewBtn(1, false);
                $scope.selectedImageStudyObj.OtherFindingArray.push(obj);


            } else {
                if ($scope.selectedImageStudyObj.OtherFindingArray.length > 0) {
                    var filterOtherFinding1 = $filter("filter")($scope.selectedImageStudyObj.OtherFindingArray, { "FindingValue": FindingValue, "OrganId": 2, "DeleteInd": item.DeleteInd }, true);
                    if (filterOtherFinding1.length > 0) {
                        $scope.selectedImageStudyObj.OtherFindingOSObj = "";
                        alertify.error("Already Added");
                        return false;
                    }
                }

                var obj = {

                    "InterpretationFindingId": 0,
                    "FindingTemplateId": 0,
                    "FindingId": item.FindingId || 0,
                    "FindingValue": FindingValue,
                    "DeleteInd": "N",
                    "OrganId": 2,
                    "TypeId": 6

                }

                $scope.selectedImageStudyObj.OtherFindingOSObj = "";
                $scope.SetOtherFindingAddNewBtn(2, false);
                $scope.selectedImageStudyObj.OtherFindingArray.push(obj);
            }
        }

        $scope.RemoveOtherFindingData = function (item, type) {
            if (type == 'OD') {
                var index = $scope.selectedImageStudyObj.OtherFindingArray.indexOf(item);
                if (item.InterpretationFindingId === 0) {
                    if (index > -1) {
                        $scope.selectedImageStudyObj.OtherFindingArray.splice(index, 1);

                    }
                } else {
                    $scope.selectedImageStudyObj.OtherFindingArray[index].DeleteInd = 'Y';
                }
            } else {
                var index = $scope.selectedImageStudyObj.OtherFindingArray.indexOf(item);
                if (item.InterpretationFindingId === 0) {
                    if (index > -1) {
                        $scope.selectedImageStudyObj.OtherFindingArray.splice(index, 1);

                    }
                } else {
                    $scope.selectedImageStudyObj.OtherFindingArray[index].DeleteInd = 'Y';
                }

            }

        }

        $scope.navtoAddOtherFinNew = function (obj, type) {

            var OrganId = $scope.GetOtherFindingOrganId(type);
            var FindingValue = $scope.GetOtherFindingText(obj);

            if (FindingValue == "") {
                alertify.error("Please enter Other Finding");
                return false;
            }

            $scope.selectedImageStudyObj.OtherFindingArray = $scope.selectedImageStudyObj.OtherFindingArray || [];
            var filterOtherFinding = $filter("filter")($scope.selectedImageStudyObj.OtherFindingArray, function (fitem) {
                return fitem.OrganId == OrganId && fitem.TypeId == 4 && fitem.DeleteInd == 'N'
                    && (fitem.FindingValue || "").toString().toLowerCase() == FindingValue.toLowerCase();
            }) || [];
            if (filterOtherFinding.length > 0) {
                alertify.error("Already Added");
                return false;
            }

            var params = {
                "UserId": $scope.UserId,
                "ParentOrganizationId": $scope.ParenthospitalId,
                "OrganizationId": $scope.HospitalId,
                "FindingValue": FindingValue,
                "FindingDescription": FindingValue,
                "DeleteInd": "N",
                "TypeId": 6,
                "OtherFindingValueId": 0,
            }

            eHnotePatientDataService.AddOrgOtherFindingValuesNew(params).then(function (resp) {
                var Status = resp.data.Status || resp.data.status;
                if (Status === 'Success') {
                    var rows = resp.data.rows || [];
                    var newFinding = rows.length > 0 ? rows[0] : {};
                    var newObj = {
                        "InterpretationFindingId": 0,
                        "FindingTemplateId": 0,
                        "FindingId": newFinding.FindingId || 0,
                        "FindingValue": newFinding.FindingValue || newFinding.FindingDescription || FindingValue,
                        "DeleteInd": "N",
                        "OrganId": OrganId,
                        "TypeId": 6
                    }
                    $scope.selectedImageStudyObj.OtherFindingArray.push(newObj);
                    $scope.SetOtherFindingAddNewBtn(OrganId, false);
                    if (OrganId == 2) {
                        $scope.selectedImageStudyObj.OtherFindingOSObj = "";
                    } else {
                        $scope.selectedImageStudyObj.OtherFindingODObj = "";
                    }
                    alertify.success("Save successfully");
                } else {
                    alertify.error(resp.data.Message || "Unable to save Other Finding");
                }
            }, function () {
                alertify.error("Unable to save Other Finding");
            });
        }


        $scope.GetOrgOtherFindingsImageManagement = function (val, Catid, Organ, type) {


            $scope.SearchText = val || "";
            $scope.CategoryId = Catid || 0;

            if ($scope.CategoryId == 0) {

                if ($scope.selectedImageStudyObj.ModalityId == 1 || $scope.selectedImageStudyObj.ModalityId == 2 || $scope.selectedImageStudyObj.ModalityId == 3 || $scope.selectedImageStudyObj.ModalityId == 4) {
                    $scope.CategoryIds = "5";
                } else if ($scope.selectedImageStudyObj.ModalityId == 5 || $scope.selectedImageStudyObj.ModalityId == 6 || $scope.selectedImageStudyObj.ModalityId == 7 || $scope.selectedImageStudyObj.ModalityId == 8) {
                    $scope.CategoryIds = "6";
                } else {

                }
            }

            $scope.selectedImageStudyObj.SelectedEye = Organ || 1;
            $scope.type = type || "";

            /* Resolved per request so an OD search can never overwrite the OS dropdown state */
            var reqOrgan = Organ || 1;
            var reqSearchText = ($scope.SearchText || "").toString().trim();

            var params = {
                "CategoryId": $scope.CategoryIds,
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "PageSize": 20,
                "PageNumber": 1,
                "SearchText": $scope.SearchText || "",

            }
            return eHnotePatientDataService.GetOrgOtherFindingsImageManagement(params).then(function (resp) {
                var rows = [];
                if (resp.data.status == "Success") {
                    rows = resp.data.rows || [];
                    if (resp.data.OtherFindingArray && resp.data.OtherFindingArray.length > 0) {
                        rows.push(...resp.data.OtherFindingArray);
                    }
                }

                /* the service returns the rows unfiltered, so apply the typed text here */
                if (reqSearchText !== "") {
                    var searchText = reqSearchText.toLowerCase();
                    rows = rows.filter(function (ritem) {
                        var rdescription = (ritem.FindingDescription || "").toString().trim().toLowerCase();
                        var rvalue = (ritem.FindingValue || "").toString().trim().toLowerCase();
                        return rdescription.indexOf(searchText) !== -1 || rvalue.indexOf(searchText) !== -1;
                    });
                }

                /* Add New only when the typed text matches no existing finding at all */
                $scope.SetOtherFindingAddNewBtn(reqOrgan, reqSearchText !== "" && rows.length === 0);

                /* the typeahead only opens when a non empty array is returned */
                return rows;
            }, function () {
                $scope.SetOtherFindingAddNewBtn(reqOrgan, reqSearchText !== "");
                return [];
            });
        }



    }]);
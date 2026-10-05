"use strict";
eHnoteWebApp.controller("USAddProcedurespopupCtrl", ["$scope", "$rootScope", "$uibModalInstance", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteDbStaticDataService", "eHnotePatientDataService", "eHnoteMainAppointmentService", "eHnoteSettingsDataService", "cache", "eHnoteDiagnosisDataServices", "index", "AppointmentID", "ConsultationID", "ConsultationDate", "$uibModal", "ProcedureNotes", "allUserListForPopUps", "eHnoteUserDataService", "ParentObj", "LogObj","eHnoteSurgeryService",
    function ($scope, $rootScope, $uibModalInstance, $filter, alertify, eHnoteMasterDataService, eHnoteDbStaticDataService, eHnotePatientDataService, eHnoteMainAppointmentService, eHnoteSettingsDataService, cache, eHnoteDiagnosisDataServices, index, AppointmentID, ConsultationID, ConsultationDate, $uibModal, ProcedureNotes, allUserListForPopUps, eHnoteUserDataService, ParentObj, LogObj, eHnoteSurgeryService) {

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        };
        cache = cache || [];
        if (index == undefined) {
            index = 0;
        }
        if (cache.OPProceduresArray.length > 0) {
            var TempConsultationProcedure = $filter("filter")(cache.OPProceduresArray, { "DeleteInd": "N" }, true);
            let tempobj = TempConsultationProcedure[index];
            $scope.Index = cache.OPProceduresArray.indexOf(tempobj);
        } else {
            $scope.Index = 0;
        }
        $scope.ConsultationID = ConsultationID || 0;
        $scope.AppointmentID = AppointmentID || 0;
        $scope.ConsultationDate = ConsultationDate || "";
        $scope.OverallProcedureNotes = ProcedureNotes || "";
        $scope.PatientVisitId = cache.PatientVisitId || 0;

        // $scope.OPProceduresArray = cache || '';
        $scope.OPProceduresArray = [];
        if (cache.OPProceduresArray.length > 0) {
           
            /*$scope.OPProceduresArray.push(cache);*/
            $scope.OPProceduresArray = cache.OPProceduresArray || '';
            if ($scope.OPProceduresArray.length > 0) {
                $scope.OPProceduresArray[0].IsEdit = true;               
            }
         
           
        }
        var allUserListForPopUps = allUserListForPopUps || [];
        $scope.ParentObj = ParentObj||"";
        $scope.LogObj = LogObj||"";
        $scope.allUserList = [];
        if (allUserListForPopUps.length > 0) {

            $scope.allUserList = allUserListForPopUps || [];
            if ($scope.allUserList.length !== 0) {
                $scope.clinicDoctorList = [];
                $scope.AllCoordinatorList = angular.copy($scope.allUserList);
                $scope.AllCoordinatorList = _.uniq($scope.AllCoordinatorList, false, function (p) { return p.DoctorID; });
                $scope.AllCoordinatorList = $filter("filter")($scope.AllCoordinatorList, function (item) {
                    return item.RoleId === 1 || item.RoleId === 43;
                });

                $scope.AllNurseList = angular.copy($scope.allUserList);
                $scope.AllNurseList = _.uniq($scope.AllNurseList, false, function (p) { return p.DoctorID; });
                $scope.AllNurseList = $filter("filter")($scope.AllNurseList, function (item) {
                    return item.RoleId === 8;
                });
                $scope.AllReviewedByList = angular.copy($scope.allUserList);
                $scope.AllReviewedByList = _.uniq($scope.AllReviewedByList, false, function (p) { return p.DoctorID; });
                $scope.AllReviewedByList = $filter("filter")($scope.AllReviewedByList, function (item) {
                    return item.RoleId === 1 || item.RoleId === 43;
                });

                $scope.AllTechnicianList = angular.copy($scope.allUserList);
                $scope.AllTechnicianList = _.uniq($scope.AllTechnicianList, false, function (p) { return p.DoctorID; });
                $scope.AllTechnicianList = $filter("filter")($scope.AllTechnicianList, function (item) {
                    return item.RoleId === 10;
                });

            }

        }

        $scope.closeuib = function () {
            $uibModalInstance.dismiss("cancel");
        };
    
        $scope.ParentObj.IsIOJParentOrganization;
        $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();
        $scope.PaitentDetails = {
            "FullName": $scope.selectedPatientData.Patient[0].FullName || "",
            "PatientDisplayId": $scope.selectedPatientData.Patient[0].PatientDisplayId || "",
            "MobileNo": $scope.selectedPatientData.Patient[0].MobileNo || 0,
            "DOB": $scope.selectedPatientData.Patient[0].DOB || "",
            "AgeInYears": $scope.selectedPatientData.Patient[0].AgeInYears || 0,
            "AgeInMonths": $scope.selectedPatientData.Patient[0].AgeInMonths || 0,
            "S3URL": $scope.selectedPatientData.Patient[0].S3URL || '',
            "SocialSecurityNo": $scope.selectedPatientData.Patient[0].SocialSecurityNo || '',
            "BloodGroupName": $scope.selectedPatientData.Patient[0].PatientOtherDetails[0].BloodGroupName || '',
            "MaritalStatusName": $scope.selectedPatientData.Patient[0].PatientOtherDetails[0].MaritalStatus || '',
            "ExternalComanagerName": $scope.selectedPatientData.Patient[0].ExternalComanagerName || '',
            "InternalComanagerName": $scope.selectedPatientData.Patient[0].InternalComanagerName || '',
            "PCPDoctorName": $scope.selectedPatientData.Patient[0].PCPDoctorName || '',
            "RefferalName": $scope.selectedPatientData.Patient[0].ReferralName || '',
            "ContactInfo": {
                "EmailID": $scope.selectedPatientData.Patient[0].EmailId || '',
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

        $scope.DemographicSummaryObj = {
            "LanguageName": $scope.selectedPatientData.Patient[0].AdditionalInfo.LanguageName || "",
            "Proficiency": $scope.selectedPatientData.Patient[0].AdditionalInfo.Proficiency || "",
            "SexualOrientation": $scope.selectedPatientData.Patient[0].AdditionalInfo.SexualOrientation || "",
            "GenderIdentityStatus": $scope.selectedPatientData.Patient[0].AdditionalInfo.GenderIdentity || "",
        }

        $scope.PatientMNumber = $scope.selectedPatientData.Patient[0].Altareacode + $scope.selectedPatientData.Patient[0].PatientHomeNumber;

        var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientMNumber);
        $scope.PatientMobileNumber = obj.UsFormatMobileNumber;

        $scope.PatientOfficeNumber = $scope.selectedPatientData.Patient[0].OfficeAreaCode + $scope.selectedPatientData.Patient[0].PatientOfficeNumber;

        var obj1 = eHnoteUserDataService.UsMobileFormatChange($scope.PatientOfficeNumber);
        $scope.PatientOfficeNumber = obj1.UsFormatMobileNumber;

        $scope.ProceduresPlanobj = {
            "IsClickSaveProceduresBtn": false,
        };
        $scope.procobj = {
            'EnterOperativenotesTemplateName': "",
            'EnterPostopInstaractionsTemplateName':"",
            'EnterComplicationsTemplateName': "",
            'IsOperativenotesTemplateSavePopOver': false,
            'IsPostopTemplateSavePopOver': false,
            'IsComplicationsTemplateSavePopOver': false
        };
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
                },
            ];
        };
        $scope.GetOrganNameList = angular.copy($scope.GetOrganName());


        var Status = [
            {
                "ProcedureStatusTypeId": 1,
                "ProcedureStatusTypeName": "Active"
            },
            {
                "ProcedureStatusTypeId": 2,
                "ProcedureStatusTypeName": "Completed"
            }
        ];

        $scope.ProcedureStatus = Status;
        $scope.AddAuditLogNew = function (selectedItem) {
            $scope.LogObj.LogArray = [];
            let SubModuleName = selectedItem.SubModuleName || "";
            let SubModuleId = selectedItem.SubModuleId || 0;
            let ScreenType = selectedItem.ScreenType || "Procedures";
            let ActionType = selectedItem.ActionType || "Accessed";
            let ActionDescription = selectedItem.ActionDescription || "";
            let OldActionDescription = selectedItem.OldActionDescription || "";
            let NewActionDescription = selectedItem.NewActionDescription || "";
            let obj = {
                "LogId": 0,
                "ModuleId": 1,
                "ModuleName": "OUTPatient",
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

        $scope.GetMasterAnesthesiaTypeAndCheckLists = function () {
            eHnotePatientDataService.GetMasterAnesthesiaTypeAndCheckLists($scope.HospitalId, $scope.ParenthospitalId).then(function (resp) {
                console.log(resp);
                if (resp.data.status == "Success") {
                    $scope.AnesthesiaTypelist = resp.data.AnesthesiaTypes || [];
                    $scope.MainCheckList = resp.data.OrganizationCheckList || [];
                    $scope.AreaofTreatmentList = resp.data.AreaofTreatment || [];
                    $scope.MentalHealthList = resp.data.MentalHealth || [];
                    $scope.VitalSignsList = resp.data.VitalSigns || [];
                    $scope.VolumeInjectedList = resp.data.VolumeInjected || [];
                    if ($scope.MainCheckList.length > 0) {
                        angular.forEach($scope.MainCheckList, function (item) {
                            item.IsChecked = false;
                            if (item.ChildCheckList.length > 0) {
                                angular.forEach(item.ChildCheckList, function (Aitem) {
                                    Aitem.IsChecked = false;
                                });
                            }

                        });
                    }


                    // if ($scope.cacheStorageItem.OPProceduresArray.length > 0) {
                    //    $scope.ConsultationProcedureList = $scope.cacheStorageItem.OPProceduresArray || [];
                    if ($scope.ConsultationProcedureList.length > 0) {
                        angular.forEach($scope.ConsultationProcedureList, function (item) {
                            item.IsEdit = false;
                            item.SubType = "Notes";
                            item.SubTab = "PreMed";
                            item.DiagnosisType = "PreDx";
                            item.MainCheckList = [];
                            item.MainCheckList = angular.copy($scope.MainCheckList);
                            item.PostOPStartDate = $filter('date')(item.PostOPStartDate, "MM-dd-yyyy");
                            item.PostOPEndDate = $filter('date')(item.PostOPEndDate, "MM-dd-yyyy");
                            item.SurgeryDate = $filter('date')(item.SurgeryDate, "MM-dd-yyyy");                         
                            item.AnesthesiaTypeName = item.AnesthesiaTypeName || ""; 
                            item.AnesthesiaTypeId = parseInt(item.AnesthesiaTypeId);
                            item.ProcedureDoctorId = parseInt(item.ProcedureDoctorId);
                            item.MentalHealthId = parseInt(item.MentalHealthId);
                            item.VitalSignsId = parseInt(item.VitalSignsId);
                            item.PostOPOnSetType = item.PostOPOnSetType || "";
                            item.PostOPDurationType = item.PostOPDurationType || "Date";
                            if (item.CheckList.length > 0) {
                                if (item.MainCheckList.length > 0) {
                                    angular.forEach(item.CheckList, function (Citem) {
                                        angular.forEach(item.MainCheckList, function (Sitem) {
                                            if (Citem.OrganizationCheckListId == Sitem.OrganizationCheckListId) {
                                                Sitem.IsChecked = true;
                                            }
                                            Citem.ChildCheckListArray = Citem.ChildCheckListArray || [];
                                            if (Citem.ChildCheckListArray.length > 0) {
                                                angular.forEach(Citem.ChildCheckListArray, function (Mitem) {
                                                    angular.forEach(Sitem.ChildCheckList, function (Nitem) {
                                                        if (Mitem.ChildCheckListid == Nitem.ChildCheckListid) {
                                                            Nitem.IsChecked = true;
                                                        }
                                                    });
                                                });

                                            }
                                        });
                                    });
                                }
                            }
                        });
                        $scope.ConsultationProcedureList[$scope.Index].IsEdit = true;
                    }
                    // }                  
                }

            }, function (err) {

            });
        }






        $scope.getMasterFieldDosageData = function () {
            eHnoteDiagnosisDataServices.GetMedicineDosageFieldsMasterData().then(function (resp) {
                $scope.DoseArray = resp.data.doseArray || [];
                $scope.DoseOtherArray = resp.data.doseOtherArray || [];
                $scope.FrequencyArray = resp.data.frequencyArray || [];
                $scope.RefillsArray = resp.data.refillsArray || [];
                $scope.DurationArray = resp.data.durationArray || [];
                $scope.ActionArray = resp.data.actionArray || [];
                $scope.RouteArray = resp.data.routeArray || [];
                $scope.DoseUnitArray = resp.data.doseUnitArray || [];
                $scope.QuantityUnitArray = resp.data.quantityUnitArray || [];


            }, function (err) {
                alertify.error("Failed");
                console.log(err);
            });
        };

      

        $scope.inti = function () {
            $scope.DoseArray = [];
            $scope.DoseOtherArray = [];
            $scope.FrequencyArray = [];
            $scope.RefillsArray = [];
            $scope.DurationArray = [];
            $scope.ActionArray = [];
            $scope.RouteArray = [];
            $scope.DoseUnitArray = [];
            $scope.QuantityUnitArray = [];
            $scope.ProcedureTemplatesArray = [];
            $scope.Proobj = {
                "SelectedProcedureObj": "",
                "DiagnosisObject": "",
                "NewChecklist": "",
                "EnterProcedureTemplateName": "",
                "showaddnew": false,
                "ConsultationProcedureId": 0,

            }
            $scope.AnesthesiaTypeList = [];
            $scope.MainCheckList = [];
            $scope.ConsultationProcedureList = [];
            if ($scope.OPProceduresArray.length > 0) {
                $scope.ConsultationProcedureList = $scope.OPProceduresArray || [];
            }
            //eHnoteMainAppointmentService.getBranchSubSpecializationsById(doctorinfo.doctordata.UserAddress[0].SubOrganizationId, $scope.HospitalId).then(function (resp) {
            //    if (resp.data.status === "Success") {
            //        if (resp.data.row.length > 0) {
            //            $scope.allSubSpecializationsArray = resp.data.row;
            //            $scope.listSubSplArray = angular.copy(resp.data.row);
            //            angular.forEach($scope.allSubSpecializationsArray, function (item) {
            //                item.isChecked = true;
            //            });
            //        }
            //        var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
            //        var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");
            //        var reqObj = {
            //            "BranchId": $scope.HospitalId,
            //            "SubSpecializationIdArray": subSplArray
            //        }

            //        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
            //        function onGetUsersSuccess(resp) {
            //            if (resp.rows.length > 0) {

            //                $scope.allUserList = resp.rows;
            //                if ($scope.allUserList.length !== 0) {
            //                    $scope.clinicDoctorList = [];
            //                    $scope.AllCoordinatorList = angular.copy($scope.allUserList);
            //                    $scope.AllCoordinatorList = _.uniq($scope.AllCoordinatorList, false, function (p) { return p.DoctorID; });
            //                    $scope.AllCoordinatorList = $filter("filter")($scope.AllCoordinatorList, function (item) {
            //                        return item.RoleId === 1 || item.RoleId === 43;
            //                    });

            //                    $scope.AllNurseList = angular.copy($scope.allUserList);
            //                    $scope.AllNurseList = _.uniq($scope.AllNurseList, false, function (p) { return p.DoctorID; });
            //                    $scope.AllNurseList = $filter("filter")($scope.AllNurseList, function (item) {
            //                        return item.RoleId === 8;
            //                    });
            //                    $scope.AllReviewedByList = angular.copy($scope.allUserList);
            //                    $scope.AllReviewedByList = _.uniq($scope.AllReviewedByList, false, function (p) { return p.DoctorID; });
            //                    $scope.AllReviewedByList = $filter("filter")($scope.AllReviewedByList, function (item) {
            //                        return item.RoleId === 1 || item.RoleId === 43;
            //                    });



            //                }

            //            } else {
            //                alertify.error("No Users Found in Selected Departments");
            //            }
            //        }

            //        function onGetUsersFailure(data) {
            //        }

            //    }
            //});

            $scope.GetMasterAnesthesiaTypeAndCheckLists();
            $scope.getMasterFieldDosageData();
        }

        $scope.TonometryList = [

            {
                "InvestigationId": 19,
                "Investigation": "I Care",

            },
            {
                "InvestigationId": 20,
                "Investigation": "Diaton",

            },
            {
                "InvestigationId": 21,
                "Investigation": "Goldmann",

            },
            {
                "InvestigationId": 22,
                "Investigation": "Ora",

            },
            {
                "InvestigationId": 771,
                "Investigation": "TNC",

            },
            {
                "InvestigationId": 814,
                "Investigation": "Tonopen",

            }
        ]

        $scope.inti();

        $scope.GetOrganizationTypeOfService = function (text, Servicetype) {
            var Type = '';
            if (Servicetype == 'Investigation') {
                Type = 'Investigation';

            } else if (Servicetype == 'Surgery') {
                Type = 'Surgery';
            }
            else if (Servicetype == 'Procedure') {
                Type = 'Procedure';
            }
            var params = {
                "OrganizationId": $scope.HospitalId,
                "ProcedureId": 0,
                "PageNumber": 1,
                "PageSize": 10,
                "CPTCODE": "",  // cptcode tblorganizationprocedure
                "SearchText": text || "", // searchtext
                "TypeOfServiceId": 0,
                "Type": Type || 0,
                "IsFrequent": 'N',
                "ParentOrganizationId": $scope.ParenthospitalId || null
            };
            if (params.SearchText == '') {
                params.IsFrequent = 'Y';
            }

            return eHnoteSettingsDataService.GetOrganizationProceduresByType(params).then(function (resp) {
                if (resp.data.rows !== undefined) {
                    return resp.data.rows.map(function (item) {
                        return item;
                    });
                }
            });
        };


        $scope.ChangeProcedure = function (mainitem) {
            angular.forEach($scope.ConsultationProcedureList, function (item) {
                item.IsEdit = false;
            })
            mainitem.IsEdit = true;
            mainitem.FocusSurgeryDate = false;
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
            //if (val === "") {
            //    object.Type = 'C';
            //}
            if (object.SearchText == '') {
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

        $scope.onselectProcedureItem = function (Subitem) {
            let counter = 0;
            if ($scope.ConsultationProcedureList.length > 0) {
                angular.forEach($scope.ConsultationProcedureList, function (initem) {                    
                    if (initem.ProcedureId === Subitem.SelectedProcedureObj.ProcedureId && initem.DeleteInd === "N") {
                        counter++;
                    }
                });
            };
            if (counter > 0) {
                alertify.error('You have already entered this Procedure');
                $scope.Proobj.SelectedProcedureObj = "";
                return;
            }
            //if ($scope.ConsultationProcedureList.length==0) {
            //    $scope.ConsultationProcedureList = [];

             var item = Subitem.SelectedProcedureObj;
                if (item.ProcedureId === '') {
                    item.ProcedureName = '';
                    return false;
                }
                item.SelectedProcedureObj = item;
                var object = {
                    "OPProcedureId": 0,
                    "ProcedureCode": item.SelectedProcedureObj.ProcedureCode || "",
                    "OrgProcedureId": item.SelectedProcedureObj.OrganizationProcedureId,
                    "ProcedureId": item.SelectedProcedureObj.ProcedureId,
                    "ProcedureNurseId": null,
                    "ProcedureName": item.SelectedProcedureObj.ProcedureName,
                    "TypeOfServiceId": item.SelectedProcedureObj.TypeOfServiceId,
                    "OrganId": null,
                    "ProcedureNotes": "",
                    "DeleteInd": "N",
                    "IsEdit": true,
                    "IsEyePatch": false,
                    "EyePatchNotes": '',
                    "SurgeryDate": null,
                    "StartTime": null,
                    "EndTime": null,
                    "PostOPStartDate": null,
                    "PostOPEndDate": null,
                    "PostOPDays": "",
                    "PostOPOnSetType": "",
                    "PostOPDurationType": "Date",
                    "ReviewedBy": "",
                    "ReviewedByName": "",
                    "DiagnosisObj": "",
                    "MedicineObject": "",
                    "SubType": "Notes",
                    "SubTab": "PreMed",
                    "DiagnosisType": "PreDx",
                    "ProcedureDoctorId": "",
                    "ProcedureDoctorName": "",
                    "AnesthesiaTypeId": "",
                    "AnesthesiaTypeName": "",
                    "VitalSignsId": "",
                    "VitalName": "",
                    "MentalHealthId": "",
                    "OperativeNotes": "",
                    "PowerEnergy": "",
                    "Milliwatts": "",
                    "PostOpInstructions": "",
                    "Complications": "",
                    "PreMedicationList": [],
                    "PostMedicationList": [],
                    "IntraMedicationList": [],
                    "PreMedicationObservations": "",
                    "PreDiagnosisList": [],
                    "PostDiagnosisList": [],
                    "IOPList": [
                        {
                            "OPProcedureIOPId": null,
                            "InvestigationId": null,
                            "InvestigationName": "",
                            "OD": "",
                            "OS": "",
                            "DeleteInd": "N",
                            "DilationTime": "",
                        }
                    ],
                    "CheckList": [],
                    "MainCheckList": angular.copy($scope.MainCheckList) || [],
                    "ProcedureNurseName":"",
                    "MentalHealthName":"",
                    "AreaofTreatmentName": "",
                    "ProcedureStatusTypeId": 0,
                    "ProcedureStatusTypeName":""
                }

            if ($scope.ConsultationProcedureList.length > 0) {
                $scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].OrganId = $scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].OrganId || "";
                if ($scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].OrganId == "") {
                    alertify.error("Please select the location");
                    $scope.Proobj.SelectedProcedureObj = "";
                    return false;
                }
                if ($scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].AnesthesiaTypeId == "") {
                    alertify.error("Please select the Anesthesia");
                    $scope.Proobj.SelectedProcedureObj = "";
                    return false;
                }
                if ($scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].SurgeryDate == "") {
                    alertify.error("Please select the Surgery Date");
                    $scope.Proobj.SelectedProcedureObj = "";
                    return false;
                }
                if ($scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].ProcedureDoctorName == "") {
                    alertify.error("Please select the Doctor Name");
                    $scope.Proobj.SelectedProcedureObj = "";
                    return false;
                }
                if ($scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].ProcedureNurseName == "") {
                    alertify.error("Please select the Nurse");
                    $scope.Proobj.SelectedProcedureObj = "";
                    return false;
                }
                if ($scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].ReviewedBy == "") {
                    alertify.error("Please select the Reviewed By.");
                    $scope.Proobj.SelectedProcedureObj = "";
                    return false;
                }
            }

                var i = 0;
                $scope.ConsultationProcedureList = $scope.ConsultationProcedureList || [];
                //if ($scope.ConsultationProcedureList.length > 0) {
                //    angular.forEach($scope.ConsultationProcedureList, function (initem) {
                //        if (initem.ProcedureId === item.ProcedureId && initem.DeleteInd === "N") {
                //            alertify.error('You have already entered this Procedure');
                //            i++;
                //        }
                //    });
                //};
                if (i === 0) {
                if ($scope.ConsultationProcedureList.length !== 0) {
                    angular.forEach($scope.ConsultationProcedureList, function (item) {
                        item.IsEdit = false;
                    });
                }
            }

                if (i === 0) {
                    $scope.ConsultationProcedureList.push(object);
                }

                $scope.Proobj.SelectedProcedureObj = "";

            //} else {
            //    //var r = alertify.confirm(
            //    //    "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'> Are you sure you want to clear existing data? </h4>",
            //    //    function () {
            //            $scope.ConsultationProcedureList = [];

            //            var item = Subitem.SelectedProcedureObj;
            //            if (item.ProcedureId === '') {
            //                item.ProcedureName = '';
            //                return false;
            //            }
            //            item.SelectedProcedureObj = item;
            //            var object = {
            //                "OPProcedureId": 0,
            //                "ProcedureCode": item.SelectedProcedureObj.ProcedureCode || "",
            //                "OrgProcedureId": item.SelectedProcedureObj.OrganizationProcedureId,
            //                "ProcedureId": item.SelectedProcedureObj.ProcedureId,
            //                "ProcedureNurseId": null,
            //                "ProcedureName": item.SelectedProcedureObj.ProcedureName,
            //                "TypeOfServiceId": item.SelectedProcedureObj.TypeOfServiceId,
            //                "OrganId": null,
            //                "ProcedureNotes": "",
            //                "DeleteInd": "N",
            //                "IsEdit": true,
            //                "IsEyePatch": false,
            //                "EyePatchNotes": '',
            //                "SurgeryDate": "",
            //                "StartTime": "",
            //                "EndTime": "",
            //                "PostOPStartDate": "",
            //                "PostOPEndDate": "",
            //                "PostOPDays": "",
            //                "ReviewedBy": "",
            //                "DiagnosisObj": "",
            //                "MedicineObject": "",
            //                "SubType": "Notes",
            //                "SubTab": "PreMed",
            //                "DiagnosisType": "PreDx",
            //                "ProcedureDoctorId": "",
            //                "ProcedureDoctorName": "",
            //                "AnesthesiaTypeId": "",
            //                "VitalSignsId": "",
            //                "MentalHealthId": "",
            //                "OperativeNotes": "",
            //                "PowerEnergy": "",
            //                "Milliwatts": "",
            //                "PostOpInstructions": "",
            //                "Complications": "",
            //                "PreMedicationList": [],
            //                "PostMedicationList": [],
            //                "IntraMedicationList": [],
            //                "PreMedicationObservations": "",
            //                "PreDiagnosisList": [],
            //                "PostDiagnosisList": [],
            //                "IOPList": [
            //                    {
            //                        "OPProcedureIOPId": null,
            //                        "InvestigationId": null,
            //                        "InvestigationName": "",
            //                        "DeleteInd": "N",
            //                        "OD": "",
            //                        "OS": "",
            //                        "DilationTime": "",
            //                    }
            //                ],
            //                "CheckList": [],
            //                "MainCheckList": angular.copy($scope.MainCheckList) || [],

            //            }
            //            var i = 0;
            //            $scope.ConsultationProcedureList = $scope.ConsultationProcedureList || [];
            //            //if ($scope.ConsultationProcedureList.length > 0) {
            //            //    angular.forEach($scope.ConsultationProcedureList, function (initem) {
            //            //        if (initem.ProcedureId === item.ProcedureId && initem.DeleteInd === "N") {
            //            //            alertify.error('You have already entered this Procedure');
            //            //            i++;
            //            //        }
            //            //    });
            //            //};
            //            //if ($scope.ConsultationProcedureList.length !== 0) {
            //            //    angular.forEach($scope.ConsultationProcedureList, function (item) {
            //            //        item.IsEdit = false;
            //            //    });
            //            //}

            //            if (i === 0) {
            //                $scope.ConsultationProcedureList.push(object);

            //            }
            //            $scope.Proobj.SelectedProcedureObj = "";
            //        //}, function () {
            //        //    return false;
            //        //});
            //}
            $scope.Proobj.SelectedProcedureTemplateName = "";
        };



        $scope.onSelectDiagnosis = function (mainobject, Diagnosisitem) {
            if (Diagnosisitem.DiagnosisType == 'PreDx') {
                if (Diagnosisitem.PreDiagnosisList.length > 0) {
                    var filterdiagnosis = $filter("filter")(Diagnosisitem.PreDiagnosisList, function (Aitem, index) { return Aitem.DiagnosisId == mainobject.DiagnosisId },);
                    if (filterdiagnosis.length > 0) {
                        mainobject = "";
                        //mainobject.DiagnosisObj = "";
                        Diagnosisitem.DiagnosisObj = "";
                        alertify.error("Diagnosis Already Added");
                        return false;
                    }
                }



                var obj = {
                    "OPProcedureDiagnoisId": 0,
                    /*"TypeId": 2,*/
                    "TypeId": 1,
                    "DeleteInd": "N",
                    "DiagnosisDetailId": mainobject.DiagnosisId || 0,
                    "DiagnosisId": mainobject.DiagnosisId,
                    "DiagnosisName": mainobject.DiagnosisName,
                    "ICDCode": mainobject.ICD10CODE,
                    "ConsultationDiagnosisId": 0,
                    "AssessmentPlanId": 0,
                    "AssessmentPlan": {
                        "AssessmentPlanId": 0,
                        "PlanofDiscussionsNotes": "",
                        "PatientInstructions": "",
                        "AssessmentsNotes": "",
                        "DoctorNotes": "",
                        "ActionsTaken": ""
                    },

                    "LocationId1": 0,
                    "SeverityId1": null,
                    "Verificationstatusid1": null,
                    "DiagnosisStatusId1": 2,
                    "DiagnosisStatus1": 'Active',
                    "EndDate1": null,
                    "StartDate1": null,

                    "LocationId2": 0,
                    "SeverityId2": null,
                    "Verificationstatusid2": null,
                    "DiagnosisStatusId2": 2,
                    "DiagnosisStatus2": 'Active',
                    "EndDate2": null,
                    "StartDate2": null,
                }

                if (mainobject.OrganId == 1) {
                    obj.LocationId1 = 1;
                    obj.Location1 = 'OD';
                } else if (mainobject.OrganId == 2) {
                    obj.LocationId2 = 2;
                    obj.Location2 = 'OS';
                } else if (mainobject.OrganId == 3) {
                    obj.LocationId1 = 1;
                    obj.LocationId2 = 2;
                    obj.Location1 = 'OD';
                    obj.Location2 = 'OS';
                } else if (mainobject.OrganId == 0) {
                    obj.LocationId1 = 0;
                    obj.Location1 = '';
                } else { }

                Diagnosisitem.PreDiagnosisList.push(obj);
                Diagnosisitem.DiagnosisObj = "";
            } else {
                if (Diagnosisitem.PostDiagnosisList.length > 0) {
                    var filterdiagnosis = $filter("filter")(Diagnosisitem.PostDiagnosisList, function (Aitem, index) { return Aitem.DiagnosisId == mainobject.DiagnosisId },);
                    if (filterdiagnosis.length > 0) {
                        mainobject = "";
                        //mainobject.DiagnosisObj = "";
                        Diagnosisitem.DiagnosisObj = "";
                        alertify.error("Diagnosis Already Added");
                        return false;
                    }
                }



                var obj = {
                    "OPProcedureDiagnoisId": 0,
                    "TypeId": 2,
                    "DeleteInd": "N",
                    "DiagnosisDetailId": mainobject.DiagnosisId || 0,
                    "DiagnosisId": mainobject.DiagnosisId,
                    "DiagnosisName": mainobject.DiagnosisName,
                    "ICDCode": mainobject.ICD10CODE,
                    "ConsultationDiagnosisId": 0,
                    "AssessmentPlanId": 0,
                    "AssessmentPlan": {
                        "AssessmentPlanId": 0,
                        "PlanofDiscussionsNotes": "",
                        "PatientInstructions": "",
                        "AssessmentsNotes": "",
                        "DoctorNotes": "",
                        "ActionsTaken": ""
                    },

                    "LocationId1": 0,
                    "SeverityId1": null,
                    "Verificationstatusid1": null,
                    "DiagnosisStatusId1": 2,
                    "DiagnosisStatus1": 'Active',
                    "EndDate1": null,
                    "StartDate1": null,

                    "LocationId2": 0,
                    "SeverityId2": null,
                    "Verificationstatusid2": null,
                    "DiagnosisStatusId2": 2,
                    "DiagnosisStatus2": 'Active',
                    "EndDate2": null,
                    "StartDate2": null,
                }

                if (mainobject.OrganId == 1) {
                    obj.LocationId1 = 1;
                    obj.Location1 = 'OD';
                } else if (mainobject.OrganId == 2) {
                    obj.LocationId2 = 2;
                    obj.Location2 = 'OS';
                } else if (mainobject.OrganId == 3) {
                    obj.LocationId1 = 1;
                    obj.LocationId2 = 2;
                    obj.Location1 = 'OD';
                    obj.Location2 = 'OS';
                } else if (mainobject.OrganId == 0) {
                    obj.LocationId1 = 0;
                    obj.Location1 = '';
                } else { }

                Diagnosisitem.PostDiagnosisList.push(obj);
                Diagnosisitem.DiagnosisObj = "";
            }

        };


        $scope.clickSubTab = function (item, type) {
            item.SubType = type;
        }

        $scope.compareProcedures = function (oldList, newList) {
            let deletedCount = 0;
            let pronames = "";
            function organName(id) {
                return id == 1 ? "OD" :
                    id == 2 ? "OS" :
                        id == 3 ? "OU" :
                            id == 4 ? "General" : "";
            }

            function fmtDate(d) {
                return d ? $filter("date")(d, "MM-dd-yyyy") : "";
            }

            function fmtTime(t) {
                if (!t) return "";
                return $filter("date")(new Date("1970-01-01 " + t), "hh:mm a");
            }
            function getReturnToOfficeText(obj) {

                if (obj.PostOPStartDate) {
                    return fmtDate(obj.PostOPStartDate);
                }

                if (obj.PostOPDays && obj.PostOPOnSetType) {
                    const map = {
                        D: "Days",
                        W: "Weeks",
                        M: "Months",
                        Y: "Years",
                        SB: "Since Birth"
                    };

                    return obj.PostOPOnSetType === "SB"
                        ? "Since Birth"
                        : `${obj.PostOPDays} ${map[obj.PostOPOnSetType]}`;
                }
                return "";
            }


            function pushDiff(label, oldVal, newVal, o, n) {
                if ((oldVal || "") !== (newVal || "")) {
                    if (oldVal) o.push(`${label} : ${oldVal}`);
                    if (newVal) n.push(`${label} : ${newVal}`);
                }
            }
       

            let oldPremedLines = [];
            let deletedBlocks = [];
            let preMedDeleteCount = 0;

            /* ========= PUSH DELETED RECORD INTO OLD ONLY ========= */
            function pushDeleted(list, label, o, obj) {
                obj = obj || "";
                let sectionLines = [];
                (list || [])
                    .filter(x => x.DeleteInd === "Y")
                    .forEach(del => {

                        if (label === "Pre Med") {
                            if (!sectionLines.length) sectionLines.push("Pre Med :");
                            sectionLines.push(del.MedicineName);
                            preMedDeleteCount++;
                            //(del.MedicationDetails || []).forEach(t =>
                            //    o.push(" @" + fmtTime(t.DilationTime))
                            //);

                        }
                        if (label === "Intra Med") {
                            //oldIntramed.push(`${label} : ${del.MedicineName}`);
                            //Intrsmeddltcount++;
                            if (!sectionLines.length) sectionLines.push("Intra Med :");
                            sectionLines.push(del.MedicineName);
                            preMedDeleteCount++;
                        }

                        if (label === "Post Med") {
                            //oldPostmed.push(`${label} : ${del.MedicineName}`);
                            //Postmeddltcount++;
                            if (!sectionLines.length) sectionLines.push("Post Med :");
                            sectionLines.push(del.MedicineName);
                            preMedDeleteCount++;
                        }

                        if (label === "Pre Diagnosis" || label === "Post Diagnosis") {
                            o.push(`${label} : ${del.ICDCode} ${del.DiagnosisName}`);
                        }

                        if (label === "IOP") {
                            o.push(`${del.InvestigationName} : OD : ${del.OD}, OS : ${del.OS}, @${(del.DilationTime)}`);
                        }
                    });

                if (sectionLines.length > 0) {
                    deletedBlocks.push(
                        `Procedure Name : ${obj.ProcedureCode} ${obj.ProcedureName}\n` +
                        sectionLines.join("\n")
                    );
                }
            }

            oldList.forEach(o => {
                let exists = newList.find(n => n.ProcedureId == o.ProcedureId);
                if (!exists || exists.DeleteInd == "Y") {
                    if (deletedCount > 0) pronames += '\n ';
                    pronames += `${o.ProcedureName}`;
                    deletedCount++;

                }
            });
            let finalOld = [];
            let finalNew = [];

            /* ========== LOOP EACH PROCEDURE ============= */
            newList.forEach(newObj => {
                if (newObj.DeleteInd === "Y") return;

                let oldObj = (oldList || []).find(x => x.OPProcedureId == newObj.OPProcedureId);

                let o = [];
                let n = [];

                let header = `${newObj.ProcedureCode} ${newObj.ProcedureName}`;

                /* ---------- BASIC FIELDS ---------- */
                pushDiff("Location", oldObj ? organName(oldObj.OrganId) : "", organName(newObj.OrganId), o, n);
                pushDiff("Anesthesia", oldObj?.AnesthesiaTypeName, newObj.AnesthesiaTypeName, o, n);
                pushDiff("Status", oldObj?.ProcedureStatusTypeName, newObj.ProcedureStatusTypeName, o, n);
                pushDiff("Start Time", oldObj?.StartTime, newObj.StartTime, o, n);
                pushDiff("End Time", oldObj?.EndTime, newObj.EndTime, o, n);
                pushDiff("Surgery Date", fmtDate(oldObj?.SurgeryDate), fmtDate(newObj.SurgeryDate), o, n);
                pushDiff("End Date", fmtDate(oldObj?.PostOPEndDate), fmtDate(newObj.PostOPEndDate), o, n);
                pushDiff("Reviewed By", oldObj?.ReviewedByName, newObj.ReviewedByName, o, n);
                pushDiff("Technician", oldObj?.ProcedureNurseName, newObj.ProcedureNurseName, o, n);
                pushDiff("Surgeon", oldObj?.ProcedureDoctorName, newObj.ProcedureDoctorName, o, n);
                pushDiff("Eye Patch", oldObj?.EyePatchNotes, newObj.EyePatchNotes, o, n);
             //   pushDiff("Return To Office", fmtDate(oldObj?.PostOPStartDate), fmtDate(newObj.PostOPStartDate), o, n);
                pushDiff(
                    "Return To Office",
                    getReturnToOfficeText(oldObj || {}),
                    getReturnToOfficeText(newObj || {}),
                    o, n
                );
                pushDiff("Operative Notes", oldObj?.OperativeNotes, newObj.OperativeNotes, o, n);
                pushDiff("Post Op Instructions", oldObj?.PostOpInstructions, newObj.PostOpInstructions, o, n);
                pushDiff("Complications", oldObj?.Complications, newObj.Complications, o, n);

                /* ---------- PRE MED ---------- */
                function comparePreMed(oldArr, newArr, label) {
                    oldArr = (oldArr || []).filter(x => x.DeleteInd === "N");
                    newArr = (newArr || []).filter(x => x.DeleteInd === "N");

                    newArr.forEach(nMed => {
                        if (nMed.DeleteInd === "Y") return;
                        let oMed = oldArr.find(x => x.MedicineId == nMed.MedicineId);

                        if (!oMed) {
                            n.push(`${label} : ${nMed.MedicineName}`);
                            (nMed.MedicationDetails || []).forEach(t => n.push(" @" + fmtTime(t.DilationTime)));
                        } else {
                            let oldTimes = (oMed.MedicationDetails || []).map(t => fmtTime(t.DilationTime)).join();
                            let newTimes = (nMed.MedicationDetails || []).map(t => fmtTime(t.DilationTime)).join();

                            if (oldTimes !== newTimes) {
                                o.push(`${label} : ${oMed.MedicineName}`);
                                (oMed.MedicationDetails || []).forEach(t => o.push(" @" + fmtTime(t.DilationTime)));

                                n.push(`${label} : ${nMed.MedicineName}`);
                                (nMed.MedicationDetails || []).forEach(t => n.push(" @" + fmtTime(t.DilationTime)));
                            }
                        }
                    });
                }

                comparePreMed(oldObj?.PreMedicationList, newObj.PreMedicationList, "Pre Med");

                /* Deleted Pre Med */
                pushDeleted(newObj?.PreMedicationList, "Pre Med", o, newObj);

                /* ---------- OBSERVATIONS ---------- */
                pushDiff("Observations", oldObj?.PreMedicationObservations, newObj.PreMedicationObservations, o, n);

                /* ---------- INTRA MED ---------- */
                function compareIntra(oldArr, newArr) {
                    oldArr = (oldArr || []).filter(x => x.DeleteInd === "N");
                    newArr = (newArr || []).filter(x => x.DeleteInd === "N");

                    newArr.forEach(nMed => {
                        if (nMed.DeleteInd === "Y") return;
                        let oMed = oldArr.find(x => x.MedicineId == nMed.MedicineId);

                        if (!oMed) {
                            n.push(`Intra Med : ${nMed.MedicineName}\n`);
                            let line = "";

                            if (nMed.LOTNumber) line += ` LOT Number : ${nMed.LOTNumber}`;
                            if (nMed.InjectionTime) line += `, Injection Time : ${fmtTime(nMed.InjectionTime)}`;
                            if (nMed.MedAdministrationTime) line += `, Med. Administration Time : ${fmtTime(nMed.MedAdministrationTime)}`;

                            if (line.trim() !== "") n.push(line.trim());

                        } else {
                            if (
                                oMed.LOTNumber !== nMed.LOTNumber ||
                                oMed.InjectionTime !== nMed.InjectionTime ||
                                oMed.MedAdministrationTime !== nMed.MedAdministrationTime
                            ) {
                                o.push(`Intra Med : ${oMed.MedicineName}`);
                                o.push(` LOT Number : ${oMed.LOTNumber}, Injection Time : ${fmtTime(oMed.InjectionTime)}, Med. Administration Time : ${fmtTime(oMed.MedAdministrationTime)}`);

                                n.push(`Intra Med : ${nMed.MedicineName}`);
                                n.push(` LOT Number : ${nMed.LOTNumber}, Injection Time : ${fmtTime(nMed.InjectionTime)}, Med. Administration Time : ${fmtTime(nMed.MedAdministrationTime)}`);
                            }
                        }
                    });
                }
                compareIntra(oldObj?.IntraMedicationList, newObj.IntraMedicationList);

                /* Deleted Intra Med */
                pushDeleted(newObj?.IntraMedicationList, "Intra Med", o, newObj);

                /* ---------- POST MED ---------- */
                function comparePostMed(oldArr, newArr) {
                    oldArr = (oldArr || []).filter(x => x.DeleteInd === "N");
                    newArr = (newArr || []).filter(x => x.DeleteInd === "N");
                    function getName(list, id) {
                        if (!id) return "";
                        let obj = list.find(x => x.MedicineDosaageFieldId  == id);
                        return obj ? (obj.Description) : "";
                    } 
                    function buildDoseLine(m) {
                        let parts = [];

                        if (m.DrugActionId) parts.push(getName($scope.ActionArray, m.DrugActionId));
                        if (m.DrugDoseId) parts.push(getName($scope.DoseArray, m.DrugDoseId));
                        if (m.DoseUnitId) parts.push(getName($scope.DoseUnitArray, m.DoseUnitId));
                        if (m.DoseRouteId) parts.push(getName($scope.RouteArray, m.DoseRouteId));
                        if (m.DoseTimingId) parts.push(getName($scope.FrequencyArray, m.DoseTimingId));
                        if (m.DoseOtherId) parts.push(getName($scope.DoseOtherArray, m.DoseOtherId));
                        if (m.DoseDurationId) parts.push(getName($scope.DurationArray, m.DoseDurationId));
                        if (m.QuantityUnitId) parts.push(getName($scope.QuantityUnitArray, m.QuantityUnitId));

                        if (m.SubstitutionPermitted) parts.push(m.SubstitutionPermitted);

                        return parts.join(" ");
                    }


                    newArr.forEach(nMed => {
                        if (nMed.DeleteInd === "Y") return;
                        let oMed = oldArr.find(x => x.MedicineId == nMed.MedicineId);

                        if (!oMed) {
                            n.push(`Post Med : ${nMed.MedicineName}`);
                            let line = buildDoseLine(nMed);
                            if (line) n.push(` ${line}`);

                            if (nMed.Instructions) n.push(`Instructions : ${nMed.Instructions}`);
                            if (nMed.DoseDurationId) n.push(`Duration : ${getName($scope.DurationArray, nMed.DoseDurationId)}`);
                            if (nMed.DoseQuantity) n.push(`Quantity : ${nMed.DoseQuantity}`);
                            if (nMed.Refills) n.push(`Refills : ${nMed.Refills}`);

                            return;

                        } else if (
                            oMed.DrugActionId !== nMed.DrugActionId ||
                            oMed.DrugDoseId !== nMed.DrugDoseId ||
                            oMed.DoseUnitId !== nMed.DoseUnitId ||
                            oMed.DoseRouteId !== nMed.DoseRouteId ||
                            oMed.DoseTimingId !== nMed.DoseTimingId ||
                            oMed.DoseOtherId !== nMed.DoseOtherId ||
                            oMed.DoseDurationId !== nMed.DoseDurationId ||
                            oMed.QuantityUnitId !== nMed.QuantityUnitId ||
                            oMed.DoseQuantity !== nMed.DoseQuantity ||
                            oMed.SubstitutionPermitted !== nMed.SubstitutionPermitted ||
                            oMed.Refills !== nMed.Refills ||
                            oMed.Instructions !== nMed.Instructions
                        ) {
                            o.push(`Post Med : ${oMed.MedicineName}`);
                            let oline = buildDoseLine(oMed);
                            if (oline) o.push(` ${oline}`);

                            if (oMed.Instructions) o.push(`Instructions : ${oMed.Instructions}`);
                            if (oMed.DoseDurationId) o.push(`Duration : ${getName($scope.DurationArray, oMed.DoseDurationId)}`);
                            if (oMed.DoseQuantity) o.push(`Quantity : ${oMed.DoseQuantity}`);
                            if (oMed.Refills) o.push(`Refills : ${oMed.Refills}`);

                            n.push(`Post Med : ${nMed.MedicineName}`);
                            let nline = buildDoseLine(nMed);
                            if (nline) n.push(` ${nline}`);

                            if (nMed.Instructions) n.push(`Instructions : ${nMed.Instructions}`);
                            if (nMed.DoseDurationId) n.push(`Duration : ${getName($scope.DurationArray, nMed.DoseDurationId)}`);
                            if (nMed.DoseQuantity) n.push(`Quantity : ${nMed.DoseQuantity}`);
                            if (nMed.Refills) n.push(`Refills : ${nMed.Refills}`);
                        }
                    });
                }

                comparePostMed(oldObj?.PostMedicationList, newObj.PostMedicationList);

                /* Deleted Post Med */
                pushDeleted(newObj?.PostMedicationList, "Post Med", o, newObj);

                /* ---------- CLINICAL INFO ---------- */
               // pushDiff("Clinical Info", oldObj?.AreaofTreatmentName, newObj.AreaofTreatmentName, o, n);
                pushDiff("Mental Health", oldObj?.MentalHealthName, newObj.MentalHealthName, o, n);
               // pushDiff("Laser Details", oldObj?.PowerEnergy, newObj.PowerEnergy, o, n);

                // CLINICAL INFO  (Areas Of Treatment + Vital Signs)

                let clinOld = [];
                let clinNew = [];

                // Areas Of Treatment
                if ((oldObj?.AreaofTreatmentName || "") !== (newObj.AreaofTreatmentName || "")) {
                    if (oldObj) clinOld.push(`Areas Of Treatment : ${oldObj.AreaofTreatmentName || ""}`);
                    clinNew.push(`Areas Of Treatment : ${newObj.AreaofTreatmentName || ""}`);
                }

                // Vital Signs
                if ((oldObj?.VitalName || "") !== (newObj.VitalName || "")) {
                    if (oldObj) clinOld.push(`Vital Signs : ${oldObj.VitalName || ""}`);
                    clinNew.push(`Vital Signs : ${newObj.VitalName || ""}`);
                }

                // ADD CASE (oldObj does not exist)
                //if (!oldObj) {
                //    if (newObj.AreaofTreatmentName)
                //        clinNew.push(`Areas Of Treatment : ${newObj.AreaofTreatmentName}`);

                //    if (newObj.VitalName)
                //        clinNew.push(`Vital Signs : ${newObj.VitalName}`);
                //}

                // PUSH OLD VALUES
                if (clinOld.length > 0) {
                    o.push("Clinical Info :");
                    clinOld.forEach(x => o.push(x));
                }

                // PUSH NEW VALUES
                if (clinNew.length > 0) {
                    n.push("Clinical Info :");
                    clinNew.forEach(x => n.push(x));
                }



                  // LASER DETAILS (Power Energy + Milliwatts)

                let laserOld = [];
                let laserNew = [];

                // Power Energy
                if ((oldObj?.PowerEnergy || "") !== (newObj.PowerEnergy || "")) {
                    if (oldObj) laserOld.push(`Power Energy : ${oldObj.PowerEnergy || ""}`);
                    laserNew.push(`Power Energy : ${newObj.PowerEnergy || ""}`);
                }

                // Milliwatts
                if ((oldObj?.Milliwatts || "") !== (newObj.Milliwatts || "")) {
                    if (oldObj) laserOld.push(`Milliwatts : ${oldObj.Milliwatts || ""}`);
                    laserNew.push(`Milliwatts : ${newObj.Milliwatts || ""}`);
                }

                // ADD CASE
                //if (!oldObj) {
                //    if (newObj.PowerEnergy)
                //        laserNew.push(`Power Energy : ${newObj.PowerEnergy}`);

                //    if (newObj.Milliwatts)
                //        laserNew.push(`Milliwatts : ${newObj.Milliwatts}`);
                //}

                // PUSH OLD VALUES
                if (laserOld.length > 0) {
                    o.push("Laser Details :");
                    laserOld.forEach(x => o.push(x));
                }

                // PUSH NEW VALUES
                if (laserNew.length > 0) {
                    n.push("Laser Details :");
                    laserNew.forEach(x => n.push(x));
                }


                /* ---------- IOP ---------- */
                function compareIOP(oldArr, newArr) {
                    let iopOld = [];
                    let iopNew = [];
                    oldArr = (oldArr || []).filter(x => x.DeleteInd === "N");
                    newArr = (newArr || []).filter(x => x.DeleteInd === "N");

                    newArr.forEach(nIOP => {
                        if (nIOP.DeleteInd === "Y") return;
                        let oIOP = oldArr.find(x => x.OPProcedureIOPId == nIOP.OPProcedureIOPId);

                        let nLine = `OD : ${nIOP.OD}, OS : ${nIOP.OS}, @${(nIOP.DilationTime)}`;

                        if (!oIOP) {
                            // ADD CASE
                            iopNew.push(`${nIOP.InvestigationName} : ${nLine}`);
                        }
                        else {
                            let oLine = `OD : ${oIOP.OD}, OS : ${oIOP.OS}, @${(oIOP.DilationTime)}`;

                            // EDIT CASE
                            if (oLine !== nLine) {
                                iopOld.push(`${oIOP.InvestigationName} : ${oLine}`);
                                iopNew.push(`${nIOP.InvestigationName} : ${nLine}`);
                            }
                        }
                    });

                    // PUSH ONLY IF CHANGES EXIST
                    if (iopOld.length > 0) {
                        o.push("IOP :");
                        iopOld.forEach(x => o.push(x));
                    }

                    if (iopNew.length > 0) {
                        n.push("IOP :");
                        iopNew.forEach(x => n.push(x));
                    }
                }

                compareIOP(oldObj?.IOPList, newObj.IOPList);

                /* Deleted IOP */
                pushDeleted(newObj?.IOPList, "IOP", o, newObj);

                /* ---------- DIAGNOSIS ---------- */
                function compareDiag(oldArr, newArr, label) {
                    oldArr = (oldArr || []).filter(x => x.DeleteInd === "N");
                    newArr = (newArr || []).filter(x => x.DeleteInd === "N");

                    newArr.forEach(nD => {
                        let oD = oldArr.find(x => x.DiagnosisId == nD.DiagnosisId);

                        if (!oD) {
                            n.push(`${label} : ${nD.ICDCode} ${nD.DiagnosisName}`);
                        }
                        else if (oD.DiagnosisName !== nD.DiagnosisName) {
                            o.push(`${label} : ${oD.ICDCode} ${oD.DiagnosisName}`);
                            n.push(`${label} : ${nD.ICDCode} ${nD.DiagnosisName}`);
                        }
                    });
                }

                compareDiag(oldObj?.PreDiagnosisList, newObj.PreDiagnosisList, "Pre Diagnosis");
                compareDiag(oldObj?.PostDiagnosisList, newObj.PostDiagnosisList, "Post Diagnosis");
                /* ------------------------ CHECKLIST (WITH HEADER) ------------------------ */
                function compareCheckList(oldArr, newArr) {
                    oldArr = (oldArr || []).filter(x => x.DeleteInd === "N");
                    newArr = (newArr || []).filter(x => x.DeleteInd === "N");

                    let oldBlockArr = [];
                    let newBlockArr = [];

                    newArr.forEach(nItem => {
                        let oItem = oldArr.find(x => x.OrganizationCheckListId == nItem.OrganizationCheckListId);

                        /* -------- NEW BLOCK -------- */
                        let newBlock = "";
                        if (nItem.IsChecked) {
                            newBlock += `${nItem.CheckListName}`;

                            if (nItem.ChildCheckList && nItem.ChildCheckList.length > 0) {
                                nItem.ChildCheckList
                                    .filter(c => c.IsChecked && c.DeleteInd === "N")
                                    .forEach(c => {
                                        newBlock += `\n  • ${c.ChildCheckListName}`;
                                    });
                            }
                        }

                        /* -------- OLD BLOCK -------- */
                        let oldBlock = "";
                        if (oItem) {
                            oldBlock += `${oItem.CheckListName}`;

                            if (oItem.ChildCheckListArray && oItem.ChildCheckListArray.length > 0) {
                                oItem.ChildCheckListArray
                                    .filter(c => c.DeleteInd === "N")
                                    .forEach(c => {
                                        oldBlock += `\n  • ${c.ChildCheckListName}`;
                                    });
                            }
                        }

                        if (oldBlock.trim() !== newBlock.trim()) {
                            if (oldBlock.trim()) oldBlockArr.push(oldBlock.trim());
                            if (newBlock.trim()) newBlockArr.push(newBlock.trim());
                        }
                    });

                    if (oldBlockArr.length > 0) {
                        o.push("CheckList :");
                        o.push(...oldBlockArr);
                    }
                    if (newBlockArr.length > 0) {
                        n.push("CheckList :");
                        n.push(...newBlockArr);
                    }
                }

                compareCheckList(oldObj?.CheckList, newObj.MainCheckList);

                /* Deleted Diagnosis */
                pushDeleted(newObj?.PreDiagnosisList, "Pre Diagnosis", o, newObj);
                pushDeleted(newObj?.PostDiagnosisList, "Post Diagnosis", o, newObj);

                if (o.length > 0) finalOld.push(header + "\n" + o.join("\n"));
                if (n.length > 0) finalNew.push(header + "\n" + n.join("\n"));
            });
            if (deletedCount > 0) {
                $scope.LogObj.LogArray.push({
                    LogId: 0,
                    ModuleId: 1,
                    ModuleName: "OUTPatient",
                    SubModuleId: 57,
                    SubModuleName: "Procedures",
                    ScreenType: "Procedures",
                    ActionType: "Deleted",
                    OldActionDescription: pronames,
                    NewActionDescription: "",
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                });
            }

            if (preMedDeleteCount > 0) {
                $scope.LogObj.LogArray.push({
                    LogId: 0,
                    ModuleId: 1,
                    ModuleName: "OUTPatient",
                    SubModuleId: 57,
                    SubModuleName: "Procedures",
                    ScreenType: "Procedures",
                    ActionType: "Deleted",
                    OldActionDescription: deletedBlocks.join("\n\n"),
                    NewActionDescription: "",
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                });
            }


            return {
                old: finalOld.join("\n\n"),
                new: finalNew.join("\n\n")
            };
        };
        $scope.formatProcedureTemplateItem = function (p) {
            if (!p) return "";

            let out = [];

            out.push(`${p.ProcedureCode || ""} ${p.ProcedureName || ""}`.trim());

            const organMap = { 1: "OD", 2: "OS", 3: "OU", 4: "General" };

            if (p.OrganId) out.push(`Location : ${organMap[p.OrganId]}`);


            if (p.OperativeNotes) out.push(`Operative Notes : ${p.OperativeNotes}`);
            if (p.PostOpInstructions) out.push(`Post Op Instructions : ${p.PostOpInstructions}`);
            if (p.Complications) out.push(`Complications : ${p.Complications}`);

            let pre = (p.PreMedicationList || []).filter(x => x.DeleteInd === "N");
            if (pre.length > 0) {
                out.push(`Pre Med :`);
                pre.forEach(m => {
                    out.push(`  ${m.MedicineName}`);
                });
            }
            let intra = (p.IntraMedicationList || []).filter(x => x.DeleteInd === "N");
            if (intra.length > 0) {
                out.push(`Intra Med :`);
                intra.forEach(m => {
                    out.push(`  ${m.MedicineName}`);
                });
            }

            let post = (p.PostMedicationList || []).filter(x => x.DeleteInd === "N");
            if (post.length > 0) {
                out.push(`Post Med :`);
                post.forEach(m => {
                    out.push(`  ${m.MedicineName}`);
                });
            }

            if (p.AreaofTreatmentName || p.VitalName) {
                out.push(`Clinical Info :`);

                if (p.AreaofTreatmentName)
                    out.push(`  Areas Of Treatment : ${p.AreaofTreatmentName}`);

                if (p.VitalName)
                    out.push(`  Vital Signs : ${p.VitalName}`);
            }

            if (p.MentalHealthName)
                out.push(`Mental Health : ${p.MentalHealthName}`);

            if (p.PowerEnergy || p.Milliwatts) {
                out.push(`Laser Details :`);
                if (p.PowerEnergy) out.push(`  Power Energy : ${p.PowerEnergy}`);
                if (p.Milliwatts) out.push(`  Milliwatts : ${p.Milliwatts}`);
            }

            let iop = (p.IOPList || []).filter(x => x.DeleteInd === "N");
            if (iop.length > 0) {
                out.push(`IOP :`);
                iop.forEach(i => {
                    out.push(
                        `  ${i.InvestigationName} : OD : ${i.OD} , OS : ${i.OS}`
                    );
                });
            }

            let preDx = (p.PreDiagnosisList || []).filter(x => x.DeleteInd === "N");
            let postDx = (p.PostDiagnosisList || []).filter(x => x.DeleteInd === "N");

            if (preDx.length > 0) {
                out.push(`Pre Diagnosis :`);
                preDx.forEach(d => out.push(`  ${d.ICDCode} ${d.DiagnosisName}`));
            }

            if (postDx.length > 0) {
                out.push(`Post Diagnosis :`);
                postDx.forEach(d => out.push(`  ${d.ICDCode} ${d.DiagnosisName}`));
            }

            return out.join("\n").trim();
        };


        $scope.ProceduresPlanobj.IsClickSaveProceduresBtn = false;
        $scope.SaveProcedurepopup = function () {
            $scope.LogObj.LogArray = [];
            if ($scope.ConsultationProcedureList.length > 0) {
                $scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].OrganId = $scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].OrganId || "";
                if ($scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].OrganId == "") {
                    alertify.error("Please select the location");
                    return false;
                }
                $scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].AnesthesiaTypeId = $scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].AnesthesiaTypeId || "";
                if ($scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].AnesthesiaTypeId == "") {
                    alertify.error("Please select the Anesthesia");
                    return false;
                }
                $scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].SurgeryDate = $scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].SurgeryDate || "";
                if ($scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].SurgeryDate == "") {
                    alertify.error("Please select the Surgery Date");
                    return false;
                } 
                $scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].ProcedureDoctorName = $scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].ProcedureDoctorName || "";
                if ($scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].ProcedureDoctorName == "") {
                    alertify.error("Please select the Doctor Name");
                    return false;
                }
                $scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].ProcedureNurseName = $scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].ProcedureNurseName || "";

                //if (!$scope.ParentObj.IsIOJParentOrganization) {
                //    if ($scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].ProcedureNurseName == " ") {
                //        alertify.error("Please select the Technician");
                //        return false;
                //    }
                //}
                $scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].ProcedureStatusTypeId = $scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].ProcedureStatusTypeId || "";
                if ($scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].ProcedureStatusTypeId == "") {
                    alertify.error("Please select the Status");
                    return false;
                }

                
                $scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].ReviewedBy = $scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].ReviewedBy || "";
                if ($scope.ConsultationProcedureList[$scope.ConsultationProcedureList.length - 1].ReviewedBy == "") {
                    alertify.error("Please select the Reviewed By.");
                    return false;
                }
                $scope.ProceduresPlanobj.IsClickSaveProceduresBtn = true;
                //var Procedureobj = {
                //    "ConsultationProcedureList": $scope.ConsultationProcedureList || []
                //}
                if ($scope.ConsultationProcedureList.length > 0) {
                    angular.forEach($scope.ConsultationProcedureList, function (item) {
                        item.IOPList = item.IOPList || [];
                   /*     item.CheckList = [];*/
                        item.CheckList = $filter('filter')(item.MainCheckList, { "IsChecked": true }, true);
                        if (item.CheckList != undefined) {
                            if (item.CheckList.length > 0) {
                                angular.forEach(item.CheckList, function (Aitem) {
                                    Aitem.ChildCheckList = $filter('filter')(Aitem.ChildCheckList, { "IsChecked": true }, true);
                                });
                            }
                        }

                        item.IOPList = $filter("filter")(item.IOPList, function (sitem) { return sitem.OD != '' || sitem.OS != '';});
                    });
                }
                var Procedureobject = {
                    "VisitId": $scope.PatientVisitId,

                    //"ConsultationID": $scope.ConsultationID ||0,
                    "AppointmentID": $scope.AppointmentID ,
                    "OrganizationId": $scope.HospitalId,
                    "UserId": $scope.UserId,
                    "StatusFlag": 'D',
                    "ConsultationDate": $scope.ConsultationDate||"",
                    "OPProceduresArray": $scope.ConsultationProcedureList || [],
                    "OverallProcedureNotes": $scope.OverallProcedureNotes,
                    "Logs": {},

                }
             
                if (Procedureobject.OPProceduresArray.length > 0) {

                    let resultProc = $scope.compareProcedures(
                        $scope.LogObj.OPProceduresArray,      // OLD
                        Procedureobject.OPProceduresArray     // NEW
                    );

                    let oldDesc = "";
                    let newDesc = "";
                    if ($scope.OverallProcedureNotes != $scope.LogObj.OverallProcedureNotes) {
                            if ($scope.OverallProcedureNotes) resultProc.new += `\n Procedure Notes : ${$scope.OverallProcedureNotes}`;
                        if ($scope.LogObj.OverallProcedureNotes) resultProc.old += `\n Procedure Notes : ${$scope.LogObj.OverallProcedureNotes}`;
                    }
                    if (resultProc.old || resultProc.new) {

                        let header = "Procedures\n";

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
                            SubModuleId: 57,
                            SubModuleName: "Procedures",
                            ScreenType: "Procedures",
                            ActionType: oldDesc ? "Edited" : "Added",
                            OldActionDescription: oldDesc.trim(),
                            NewActionDescription: newDesc.trim(),
                            ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                        });
                    }
                }


                if ($scope.LogObj.LogArray.length > 0) {
                    Procedureobject.Logs = $scope.LogObj || {};
                }
                eHnoteDiagnosisDataServices.AddUpdateOPProcedureData(Procedureobject).then(function (resp) {
                    if (resp.data.status === 'Success') {

                        var Procedureobj = {
                            "ConsultationProcedureList": $scope.ConsultationProcedureList || [],
                            "OverallProcedureNotes": $scope.OverallProcedureNotes || ""
                        }

                        $scope.ProceduresPlanobj.IsClickSaveProceduresBtn = false;
                        $uibModalInstance.close(Procedureobj);
                        //var consultationid = $scope.ConsultationID;
                        //var AppointmentID = $scope.AppointmentID;
                        //var type = 0;
                        //if (consultationid === 0) {
                        //    type = 1;
                        //}
                        //var object = {
                        //    "AppointmentId": AppointmentID,
                        //    "Type": type
                        //};
                        //eHnotePatientDataService.GetPatientConsultationDetailsByApptId(object).then(function (resp) {
                        //    if (resp.data !== undefined) {
                        //        $scope.treatmentData = resp.data;
                        //        $scope.SelectedPlanArray = [];
                        //        $scope.SelectedPlanArray = $filter("filter")($scope.treatmentData, { "AppointmentId": AppointmentID }, true);



                        //        if ($scope.SelectedPlanArray[0].OPProceduresArray !== undefined) {
                        //            if ($scope.SelectedPlanArray[0].OPProceduresArray.length !== 0) {

                        //                $scope.ConsultationProcedureList = [];
                        //                $scope.SelectedPlanArray[0].OPProceduresArray.forEach(function (Citem) {
                        //                    $scope.ConsultationProcedureList.push(Citem);

                        //                });
                        //            }
                        //            else {
                        //                $scope.ConsultationProcedureList = [];
                        //            }
                        //        } else {
                        //            $scope.ConsultationProcedureList = [];
                        //        }



                        //        var Procedureobj = {
                        //            "ConsultationProcedureList": $scope.ConsultationProcedureList || [],
                        //            "OverallProcedureNotes": $scope.SelectedPlanArray[0].OverallProcedureNotes || ""
                        //        }


                        //        $uibModalInstance.close(Procedureobj);
                        //    }
                            
                        //}, function (err) {
                        //    alertify.error(err.data.ExceptionMessage);
                        //});

                    }
                    $scope.ProceduresPlanobj.IsClickSaveProceduresBtn = false;
                });
            //    $uibModalInstance.close(Procedureobj);
            }
           
        };

        $scope.DelectSelectedItem = function (item) {
            var index = $scope.ConsultationProcedureList.indexOf(item);
            if (item.OPProcedureId === 0) {
                if (index > -1) {
                    $scope.ConsultationProcedureList.splice(index, 1);
                }
            } else {
                $scope.ConsultationProcedureList[index].DeleteInd = 'Y';

            }
            if ($scope.ConsultationProcedureList.length !== 0) {
                  angular.forEach($scope.ConsultationProcedureList, function (item) {
                                item.IsEdit = false;
                  });
                $scope.ConsultationProcedureList[0].IsEdit = true;
            }
            $scope.Proobj.SelectedProcedureTemplateName = "";
        };



        $scope.savechecklist = function (val, mainitem) {
            val = val || '';
            if (val == '') {
                alertify.error('Enter Checklist');
                return false;
            }
            var obj = {
                "OrganizationCheckListId": 0,
                "HospitalId": $scope.HospitalId,
                "ParentHospitalId": $scope.ParenthospitalId,
                "UserId": $scope.UserId,
                "CheckListName": val,
                "DeleteInd": "N",
                "ChildCheckList": []
            }

            eHnotePatientDataService.AddUpdateOrganizationCheckLists(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.Proobj.showaddnew = false;
                    $scope.Proobj.NewChecklist = '';
                    $scope.GetMasterAnesthesiaTypeAndCheckLists();
                }
                if (resp.data.status === 'Failure') {
                    if (resp.data.Message === 'CheckList Already Exists') {
                        alertify.error("CheckList Already Exists");
                        $scope.selectcompliant = "";
                    }
                }

            }, function (err) {

            });
        }



        $scope.AddnewIop = function (mainitem) {
          var count = 0;
            if (mainitem.IOPList.length > 0) {
                angular.forEach(mainitem.IOPList, function (item) {
                    if (item.OD == '' && item.OS == '') {
                        count ++;
                    }
                });
            }
            if (count > 0) {
                alertify.error("Plese enter OD or OS values");
                return false;
            }
            else {
                var obj = {
                    "OPProcedureIOPId": null,
                    "InvestigationId": null,
                    "InvestigationName": "",
                    "OD": "",
                    "OS": "",
                    "DeleteInd": "N",
                    "DilationTime": "",
                }
                mainitem.IOPList.push(obj);
            }
        }



        $scope.getOrgMedicines = function (text) {
            text = text || "";
            var object = {
                "LevelType": "O",
                "HospitalId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "SearchText": text,
                "PageSize": 10,
                "PageNumber": 1,
                "Type": '',
                "ParentOrganizationId": $scope.ParenthospitalId || null
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

        }

        $scope.Addnewtime = function (item) {
            var obj = {
                "DilationTime": "",
                "TimeType": "AM",
            }
            item.MedicationDetails.push(obj);
            angular.forEach(item.MedicationDetails, function (item) {
                $scope.ShowAddnewtime = false;
            });
        }

        $scope.PushfreqMedicalItems = function (item, Type, mainitem) {

            if (Type == "PreMed") {
                mainitem.PreMedicationList = mainitem.PreMedicationList || [];
                if (mainitem.PreMedicationList.length > 0) {
                    var list = $filter("filter")(mainitem.PreMedicationList, { "MedicineId": item.MedicineId }, true);
                    if (list.length > 0) {
                        alertify.error('You have already entered this PreMedication');
                        mainitem.MedicineObject = '';
                        return;
                    }
                }
            }
            if (Type == "IntraMed") {
                mainitem.IntraMedicationList = mainitem.IntraMedicationList || [];
                if (mainitem.IntraMedicationList.length > 0) {
                    var list = $filter("filter")(mainitem.IntraMedicationList, { "MedicineId": item.MedicineId }, true);
                    if (list.length > 0) {
                        alertify.error('You have already entered this PreMedication');
                        mainitem.MedicineObject = '';
                        return;
                    }
                }
            }
            if (Type == "PostMed") {
                mainitem.PostMedicationList = mainitem.PostMedicationList || [];
                if (mainitem.IntraMedicationList.length > 0) {
                    var list = $filter("filter")(mainitem.PostMedicationList, { "MedicineId": item.MedicineId }, true);
                    if (list.length > 0) {
                        alertify.error('You have already entered this PostMedication');
                        mainitem.MedicineObject = '';
                        return;
                    }
                }
            }

            console.log(item);
            console.log(mainitem);
            if (Type =='PreMed') {
                var obj = {
                    "OPProcedureMedicationId": 0,
                    "DeleteInd": "N",
                    "OrganId": "",
                    "MedicineId": item.MedicineId,
                    "MedicineName": item.MedicineName,
                    "MedicineType": item.MedicineType,
                    "MedicationDetails": [
                        {
                            "DilationTime": "",
                            "TimeType": "AM",
                        }]
                }
                mainitem.PreMedicationList.push(obj);
                mainitem.MedicineObject = '';
            }
            if (Type == 'IntraMed') {
                var obj = {
                    "OPProcedureMedicationId": 0,
                    "DeleteInd": "N",
                    "OrganId": "",
                    "MedicineId": item.MedicineId,
                    "MedicineName": item.MedicineName,
                    "MedicineType": item.MedicineType,
                    "VolumeInjected": null,
                    "Units": null,
                    "LOTNumber": null,
                    "InjectionTime": null,
                    "MedAdministrationTime": null,
                  
                }
                mainitem.IntraMedicationList.push(obj);
                mainitem.MedicineObject = '';
            }
            if (Type == 'PostMed') {
                var obj = {
                    "OPProcedureMedicationId": 0,
                    "DeleteInd": "N",
                    "OrganId": "",
                    "MedicineId": item.MedicineId,
                    "MedicineName": item.MedicineName,
                    "MedicineType": item.MedicineType,
                    "DrugActionId": null,
                    "DrugDoseId": null,
                    "DoseUnitId": null,
                    "DoseRouteId": null,
                    "DoseTimingId": null,
                    "DoseOtherId": null,
                    "DoseDurationId": null,
                    "DoseQuantity": null,
                    "QuantityUnitId": null,
                    "Refills": null,
                    "SubstitutionPermitted": '',
                    "ShowNotes": false,
                    "Duration": "",
                    "DurationType": "D",
                    "DurationDate": "",
                    "Instructions": "",
                    "ShowDateFormat": true
                                
                }
                mainitem.PostMedicationList.push(obj);
                mainitem.MedicineObject = '';
            }
  
        }
        $scope.ShowAddnewtime = false;
        $scope.newtime = function (item) {
            $scope.currentTime = $filter("date")(new Date(), "h:mm a");
            item.DilationTime = $scope.currentTime;
            if (item.DilationTime != "") {
                $scope.ShowAddnewtime = true;
            }
            else {
                $scope.ShowAddnewtime = false;
            }
        }
        $scope.newclicktime = function (item,type) {
            $scope.currentTime = $filter("date")(new Date(), "h:mm a");
            //$scope.currentDate = $filter("date")(new Date(), "dd-MM-y");
         //   $scope.currentTime = $filter("date")(new Date(), "h:mm");
            $scope.Timetype = $filter("date")(new Date(), "a");
            if (type =='Start') {
                item.StartTime = $scope.currentTime;
            }
            if (type == 'End') {
                item.EndTime = $scope.currentTime;
            }
            //if (type == 'OPStart') {
            //    item.PostOPStartTime = $scope.currentTime;
            //}
            //if (type == 'OPEnd') {
            //    item.PostOPEndTime = $scope.currentTime;
            //}
            if (type == 'Injection') {
                item.InjectionTime = $scope.currentTime;
            }
            if (type == 'Administ') {
                item.MedAdministrationTime = $scope.currentTime;
            }
        }

        $scope.DelectPreMedicationitem = function (mainitem,item) {
            var index = mainitem.PreMedicationList.indexOf(item);
            if (item.OPProcedureMedicationId === 0 || item.OPProcedureMedicationId === null) {
                if (index > -1) {
                    mainitem.PreMedicationList.splice(index, 1);
                }
            } else {
                mainitem.PreMedicationList[index].DeleteInd = 'Y';
            }
            $scope.ShowAddnewtime = false;
        }
        $scope.DelectMedicationitem = function (mainitem, item) {
            var index = mainitem.MedicationDetails.indexOf(item);
            if (index > -1) {
                mainitem.MedicationDetails.splice(index, 1);
            }
            $scope.ShowAddnewtime = true;
        }
        $scope.DelectIntraMedicationitem = function (mainitem, item) {
            var index = mainitem.IntraMedicationList.indexOf(item);
            if (item.OPProcedureMedicationId === 0 || item.OPProcedureMedicationId === null) {
                if (index > -1) {
                    mainitem.IntraMedicationList.splice(index, 1);
                }
            } else {
                mainitem.IntraMedicationList[index].DeleteInd = 'Y';
            }
           
        }
        $scope.DelectPostMedicationitem = function (mainitem, item) {
            var index = mainitem.PostMedicationList.indexOf(item);            
            if (item.OPProcedureMedicationId === 0 || item.OPProcedureMedicationId === null) {
                if (index > -1) {
                    mainitem.PostMedicationList.splice(index, 1);
                }
            } else {
                mainitem.PostMedicationList[index].DeleteInd = 'Y';
            }
           
        }
        $scope.DelectPreDiagnosisitem = function (mainitem, item) {
            var index = mainitem.PreDiagnosisList.indexOf(item);
            if (item.OPProcedureDiagnoisId === 0 || item.OPProcedureDiagnoisId === null) {
                if (index > -1) {
                    mainitem.PreDiagnosisList.splice(index, 1);
                }
            } else {
                mainitem.PreDiagnosisList[index].DeleteInd = 'Y';
            }
           
        }
        $scope.DelectPostDiagnosisitem = function (mainitem, item) {
            var index = mainitem.PostDiagnosisList.indexOf(item);            
            if (item.OPProcedureDiagnoisId === 0 || item.OPProcedureDiagnoisId === null) {
                if (index > -1) {
                    mainitem.PostDiagnosisList.splice(index, 1);
                }
            } else {
                mainitem.PostDiagnosisList[index].DeleteInd = 'Y';
            }
          
        }
        $scope.DelectIOPitem = function (mainitem, item) {
            var index = mainitem.IOPList.indexOf(item);
            if (item.OPProcedureIOPId === 0||item.OPProcedureIOPId === null) {
                if (index > -1) {
                    mainitem.IOPList.splice(index, 1);
                }
            } else {
                mainitem.IOPList[index].DeleteInd = 'Y';
            }
           
        }


        $scope.changes = function (item) {
            console.log(item);
        }

        $scope.GetUserProcedureTemplateDetails = function () {
            var params = {
                "UserId": $scope.UserId,
                "SearchText": "",
                "PageSize": 1000,
                "PageNumber": 1,
                "OrganizationId": $scope.HospitalId,               
            }
            eHnotePatientDataService.GetUserOPProcedureTemplateDetails(params).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.ProcedureTemplatesArray = resp.data.rows || [];
                    if ($scope.ProcedureTemplatesArray.length > 0) {
                        angular.forEach($scope.ProcedureTemplatesArray, function (mitem) {
                            mitem.IsEdit = false;
                            //item.IsDescriptionEdit = false;
                        });
                        $scope.ProcedureTemplatesArray[0].IsEdit = true;
                        //}
                    }
                }
                $scope.ProcedureTemplatesArray = $scope.ProcedureTemplatesArray || [];
                if ($scope.ProcedureTemplatesArray.length>0) {
                    angular.forEach($scope.ProcedureTemplatesArray, function (item) {
                        if (item.OPProcedureDetailsArray.length > 0) {
                            angular.forEach(item.OPProcedureDetailsArray, function (pitem) {
                                pitem.PostOPStartDate ="";
                                pitem.PostOPEndDate ="";
                                //pitem.OrganId = "";
                                //pitem.AnesthesiaTypeId = "";
                                pitem.PostOPDays = "";
                                pitem.EndTime = "";
                                pitem.StartTime = "";
                                pitem.ProcedureDoctorId = "";
                                pitem.SurgeryDate = null;
                                //pitem.VitalSignsId = "";
                                //pitem.IOPList = [];
                                pitem.ReviewedBy = "";
                                //pitem.MentalHealthId = "";
                                //pitem.AreasOfTreatmentId = "";
                                pitem.PreMedicationObservations = "";
                                //pitem.Milliwatts = "";
                                //pitem.PowerEnergy = "";
                                pitem.CheckList = [];
                                pitem.PreMedicationList = pitem.PreMedicationList || [];
                                if (pitem.PreMedicationList.length > 0) {
                                    angular.forEach(pitem.PreMedicationList, function (mitem) {
                                        mitem.MedicationDetails = mitem.MedicationDetails || [];
                                        if (mitem.MedicationDetails.length > 0) {
                                            angular.forEach(mitem.MedicationDetails, function (Mitem) {
                                                Mitem.DilationTime = "";
                                                Mitem.TimeType = "";
                                            });
                                        }
                                    });                                 
                                }
                                pitem.IntraMedicationList = pitem.IntraMedicationList || [];
                                if (pitem.IntraMedicationList.length>0) {
                                    angular.forEach(pitem.IntraMedicationList, function (Iitem) {
                                        Iitem.LOTNumber = "";
                                        Iitem.InjectionTime = "";
                                        Iitem.MedAdministrationTime = "";
                                    });
                                }
                                pitem.PostMedicationList = pitem.PostMedicationList || [];
                                if (pitem.PostMedicationList.length > 0) {
                                    angular.forEach(pitem.PostMedicationList, function (Pitem) {
                                        Pitem.DoseQuantity = "";
                                        Pitem.QuantityUnitId = "";
                                        Pitem.Refills = "";
                                        Pitem.SubstitutionPermitted = "";
                                        Pitem.Duration = "";
                                        Pitem.DurationType = "";
                                        Pitem.Instructions = "";
                                    });
                                }
                                pitem.IOPList = pitem.IOPList || [];
                                if (pitem.IOPList.length > 0) {
                                    angular.forEach(pitem.IOPList, function (Pitem) {
                                        Pitem.DilationTime = "";
                                    });
                                }
                            });
                        }
                    });
                    $scope.LogObj.ProcedureTemplatesArray = angular.copy($scope.ProcedureTemplatesArray) || [];
                }

            }, function (err) {

            });
        }
        $scope.GetUserProcedureTemplateDetails();
        $scope.SaveProcedureTemplates = function () {
            $scope.LogObj.LogArray = [];
            if ($scope.Proobj.EnterProcedureTemplateName === "") {
                alertify.error("Please Enter Template Name");
                return false;
            }
            //item.PostOPStartDate = $filter("date")(new Date(item.PostOPStartDate), "yyyy-MM-dd");
            //item.PostOPEndDate = $filter("date")(new Date(item.PostOPEndDate), "yyyy-MM-dd");
            if ($scope.ConsultationProcedureList.length>0) {
                angular.forEach($scope.ConsultationProcedureList, function (item) {
                    item.CheckList = [];
                    item.CheckList = $filter('filter')(item.MainCheckList, { "IsChecked": true }, true);
                    if (item.CheckList !== undefined) {
                    if (item.CheckList.length > 0) {
                        angular.forEach(item.CheckList, function (Aitem) {
                            Aitem.ChildCheckList = $filter('filter')(Aitem.ChildCheckList, { "IsChecked": true }, true);

                        })
                        }
                    }
                });
            }
            let SelectedProcedure = $filter('filter')($scope.ConsultationProcedureList, { 'IsEdit': true }, true);
            if (SelectedProcedure != undefined) {
                if (SelectedProcedure.length > 0) {
                    var item = SelectedProcedure[0];
                }
            }
            if (item == null || item == undefined) {
                alertify.error("Please Select Atleast One Procedure");
                return false;
            }
            var params = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "DeleteInd": "N",
                "TemplateId": 0,
                "TemplateName": $scope.Proobj.EnterProcedureTemplateName,
                //"Procedureobj": $scope.ConsultationProcedureList[0],
              /*  "Procedureobj": $scope.Templatesarray || [],*/
                "Procedureobj":item,
                "Logs": {}
            }

            let newDesc = $scope.formatProcedureTemplateItem(item).trim();
                if (newDesc!== "") {
                    $scope.LogObj.LogArray.push({
                        LogId: 0,
                        ModuleId: 1,
                        ModuleName: "OUTPatient",
                        SubModuleId: 57,
                        SubModuleName: "Procedures",
                        ScreenType: "Procedures Template",
                        ActionType: "Added",
                        OldActionDescription: "",
                        NewActionDescription: `Template Name : ${$scope.Proobj.EnterProcedureTemplateName}\n\nAdded in Template :\n${newDesc}`,
                        ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                    });
                }
            //if ($scope.LogObj.LogArray.length > 0) {
            //    params.Logs = $scope.LogObj || {};
            //}

            //params.Procedureobj.OrganId = '';
            //params.Procedureobj.IsEyePatch = false;
            //params.Procedureobj.ProcedureNurseId = '';
            //params.Procedureobj.EyePatchNotes = '';
            //params.Procedureobj.SurgeryDate = '';
            //params.Procedureobj.StartTime = '';
            //params.Procedureobj.EndTime = '';
            //params.Procedureobj.PostOPDays = '';
            //params.Procedureobj.AnesthesiaTypeId = '';
            //params.Procedureobj.IOPList = [];
            //params.Procedureobj.IntraMedicationList = [];
            //params.Procedureobj.PostMedicationList = [];
            //params.Procedureobj.ProcedureDoctorId = '';
            //params.Procedureobj.ReviewedBy = '';
            //params.Procedureobj.VitalSignsId = '';
            //params.Procedureobj.MentalHealthId = '';
            eHnotePatientDataService.AddUpdateUserProcedureTemplateDetails(params).then(function (resp) {
                if (resp.data.Message === "Success") {
                    alertify.success("Save successfully");
                    $scope.Proobj.EnterProcedureTemplateName = '';
                    $scope.GetUserProcedureTemplateDetails();
                  
                } else {
                    alertify.error(resp.data.Message);
                }
            }, function (err) {

            });
        }

        $scope.ChangesForProcedureTemp = function (item) {
            var object = {
                "OPProcedureId": 0,
                "ProcedureCode": item.OPProcedureDetailsArray[0].ProcedureCode || "",
                "OrgProcedureId": item.OPProcedureDetailsArray[0].OrgProcedureId,
                "ProcedureId": item.OPProcedureDetailsArray[0].ProcedureId,
                "ProcedureNurseId": item.OPProcedureDetailsArray[0].ProcedureNurseId || null,
                "ProcedureName": item.OPProcedureDetailsArray[0].ProcedureName || null,
                "TypeOfServiceId": item.OPProcedureDetailsArray[0].TypeOfServiceId,
                "OrganId": item.OPProcedureDetailsArray[0].OrganId || null,
                "ProcedureNotes": item.OPProcedureDetailsArray[0].ProcedureNotes || "",
                "DeleteInd": item.DeleteInd || "N",
                "IsEdit": true,
                "IsEyePatch": item.OPProcedureDetailsArray[0].IsEyePatch || false,
                "EyePatchNotes": item.OPProcedureDetailsArray[0].EyePatchNotes || '',
                //"SurgeryDate": item.OPProcedureDetailsArray[0].SurgeryDate || '',
                "SurgeryDate": null,
                //"StartTime": item.OPProcedureDetailsArray[0].StartTime || '',
                "StartTime": null,
                //"EndTime": item.OPProcedureDetailsArray[0].EndTime || "",
                "EndTime": null,
                "PostOPStartTime": item.OPProcedureDetailsArray[0].PostOPStartTime || "",
                "PostOPEndTime": item.OPProcedureDetailsArray[0].PostOPEndTime || "",
                "PostOPDays": item.OPProcedureDetailsArray[0].PostOPDays || "",
                //"ReviewedBy": item.OPProcedureDetailsArray[0].ReviewedBy || "",
                "ReviewedBy": "",
                "DiagnosisObj": "",
                "MedicineObject": "",
                "SubType": "Notes",
                "SubTab": "PreMed",
                "DiagnosisType": "PreDx",
                "ProcedureDoctorId": item.OPProcedureDetailsArray[0].ProcedureDoctorId || "",
                "ProcedureDoctorName": item.OPProcedureDetailsArray[0].ProcedureDoctorName || "",
                "AnesthesiaTypeId": item.OPProcedureDetailsArray[0].AnesthesiaTypeId || "",
                "VitalSignsId": item.OPProcedureDetailsArray[0].VitalSignsId || "",
                "VitalName": item.OPProcedureDetailsArray[0].VitalName || "",
                "MentalHealthId": item.OPProcedureDetailsArray[0].VitalSignsId || "",
                "OperativeNotes": item.OPProcedureDetailsArray[0].OperativeNotes || "",
                "PowerEnergy": item.OPProcedureDetailsArray[0].PowerEnergy || "",
                "Milliwatts": item.OPProcedureDetailsArray[0].Milliwatts || "",
                "PostOpInstructions": item.OPProcedureDetailsArray[0].PostOpInstructions || "",
                "Complications": item.OPProcedureDetailsArray[0].Complications || "",
                "PreMedicationList": item.OPProcedureDetailsArray[0].PreMedicationList || [],
                "PostMedicationList": item.OPProcedureDetailsArray[0].PostMedicationList || [],
                "IntraMedicationList": item.OPProcedureDetailsArray[0].IntraMedicationList || [],
                "PreMedicationObservations": item.OPProcedureDetailsArray[0].PreMedicationObservations || "",
                "PreDiagnosisList": item.OPProcedureDetailsArray[0].PreDiagnosisList || [],
                "PostDiagnosisList": item.OPProcedureDetailsArray[0].PostDiagnosisList || [],
                "IOPList": item.OPProcedureDetailsArray[0].IOPList || [],
                "CheckList": item.OPProcedureDetailsArray[0].CheckList || [],
                "MainCheckList": angular.copy($scope.MainCheckList) || [],
                "MentalHealthName": "",
                "AreaofTreatmentName": "",
                "PostOPStartDate": item.OPProcedureDetailsArray[0].PostOPStartDate || null,
                "PostOPEndDate": item.OPProcedureDetailsArray[0].PostOPEndDate || null,

            }

            var i = 0;
            $scope.ConsultationProcedureList = $scope.ConsultationProcedureList || [];
            if ($scope.ConsultationProcedureList.length > 0) {
                angular.forEach($scope.ConsultationProcedureList, function (initem) {
                    if (initem.ProcedureId === item.OPProcedureDetailsArray[0].ProcedureId && initem.DeleteInd === "N") {
                        alertify.error('You have already entered this Procedure');
                        i++;
                    }
                });
            };
            if (i === 0) {
                if ($scope.ConsultationProcedureList.length !== 0) {
                    angular.forEach($scope.ConsultationProcedureList, function (item) {
                        item.IsEdit = false;
                    });
                }
            }
            if (i === 0) {
                $scope.ConsultationProcedureList.push(object)
            }
            $scope.Proobj.SelectedProcedureObj = "";
                
         
                
                        
            
        }


        $scope.Changedays = function (item) {
            item = item || '';
            if (item.PostOPDays != '') {
                item.PostOPStartDate = $filter('date')(new Date(), "MM-dd-yyyy");
                var numofdays = null;
                numofdays = parseInt(item.PostOPDays);
                numofdays = numofdays || 0;
                if (numofdays != 0) {
                    var today = new Date();
                    var fiveDaysLater = new Date(today.getTime() + numofdays * 24 * 60 * 60 * 1000);
                    item.PostOPEndDate = $filter('date')(new Date(fiveDaysLater), "MM-dd-yyyy");
                }

            } else {
                item.PostOPStartDate = '';
                item.PostOPEndDate = '';
            }
          
        }

        $scope.changeInvestigation = function (item) {
            var List = $filter("filter")($scope.TonometryList, { "InvestigationId": item.InvestigationId }, true);
            if (List.length > 0) {
                item.InvestigationName = List[0].Investigation;
            } else {
                item.InvestigationName = "";
            }
        }

        $scope.ChangeDoctor = function (item) {            
            var List = $filter("filter")($scope.allUserList, { "DoctorID": item.ProcedureDoctorId }, true);           
            if (List.length > 0) {
                item.ProcedureDoctorName = List[0].FullName;
            } else {
                item.ProcedureDoctorName = "";
            }
        }

        $scope.ChangeNurse = function (item) {

            item.ProcedureNurseName = item.ProcedureNurseName || "";
            var List = $filter("filter")($scope.AllTechnicianList, { "DoctorID": item.ProcedureNurseId }, true);
            if (List.length > 0) {
                item.ProcedureNurseName = List[0].FullName;
            }
            else {
                item.ProcedureNurseName = "";
            }
        }

        $scope.ChangeAnesthesiaType = function (item) {

            item.AnesthesiaTypeName = item.AnesthesiaTypeName || "";
            var List = $filter("filter")($scope.AnesthesiaTypelist, { "AnesthesiaTypeId": item.AnesthesiaTypeId }, true);
            if (List.length > 0) {
                item.AnesthesiaTypeName = List[0].AnesthesiaType;
            }
            else {
                item.AnesthesiaTypeName = "";
            }
        }

        $scope.ChangeProcedureStatus = function (item) {
            item.ProcedureStatusTypeName = item.ProcedureStatusTypeName || "";
            var List = $filter("filter")($scope.ProcedureStatus, { "ProcedureStatusTypeId": item.ProcedureStatusTypeId }, true);
            if (List.length > 0) {
                item.ProcedureStatusTypeName = List[0].ProcedureStatusTypeName;
            }
            else {
                item.ProcedureStatusTypeName = "";
            }
        }
        $scope.ChangeReview = function (item) {

            item.ReviewedByName = item.ReviewedByName || "";
            var List = $filter("filter")($scope.AllReviewedByList, { "DoctorID": item.ReviewedBy }, true);
            if (List.length > 0) {
                item.ReviewedByName = List[0].FullName;
            }
            else {
                item.ReviewedByName = "";
            }
        }

        $scope.Changefocus = function () {
            $scope.ProcedureListFocus = false;
        }

        $scope.ChecklistSelection = function (item) {
            if (item.IsChecked == false) {
                angular.forEach(item.ChildCheckList, function (Aitem) {
                    Aitem.IsChecked = true;
                });
            }
            else {
                angular.forEach(item.ChildCheckList, function (Aitem) {
                    Aitem.IsChecked = false;
                });
            }
        }

        $scope.ChangeVitalSign = function (item) {

            item.VitalName = item.VitalName || "";
            var List = $filter("filter")($scope.VitalSignsList, { "OPProcedureClinicalInfoId": item.VitalSignsId }, true);
            if (List.length > 0) {
                item.VitalName = List[0].Description;
            }
            else {
                item.VitalName = "";
            }
        }
        $scope.ChangeMentalHealth = function (item) {

            item.MentalHealthName = item.MentalHealthName || "";
            var List = $filter("filter")($scope.MentalHealthList, { "OPProcedureClinicalInfoId": item.MentalHealthId }, true);
            if (List.length > 0) {
                item.MentalHealthName = List[0].Description;
            }
            else {
                item.MentalHealthName = "";
            }
        }
        $scope.ChangeAreaofTreatment = function (item) {

            item.AreaofTreatmentName = item.AreaofTreatmentName || "";
            var List = $filter("filter")($scope.AreaofTreatmentList, { "OPProcedureClinicalInfoId": item.AreasOfTreatmentId }, true);
            if (List.length > 0) {
                item.AreaofTreatmentName = List[0].Description;
            }
            else {
                item.AreaofTreatmentName = "";
            }
        }

        $scope.DilStartTime = function (Citem) {
            $scope.DilcurrentTime = $filter("date")(new Date(), "h:mm a");
            Citem.DilationTime = $scope.DilcurrentTime;
        }

        $scope.FocusOnDate = function (item) {
            item.FocusSurgeryDate = !item.FocusSurgeryDate;
        }
        $scope.changeIOPOD = function (item, Citem) {
            item = item || ""
            if (item != '') {
                $scope.DilStartTime(Citem);
            }
            else {
                Citem.DilationTime = "";
            }
        }

        $scope.changeIOPOS = function (item, Citem) {
            item = item || ""
            if (item != '') {
                $scope.DilStartTime(Citem);
            }
            else {
                Citem.DilationTime = "";
            }
        }

        $scope.ChangePreMediDuration = function (item) {
            if (item.DurationType === "SB") {
                item.Duration = "";
            }
        }
        $scope.ChangeOnSetItem = function (item) {
            if (item.ShowDateFormat) {
                item.DurationDate = '';
            } else {
                item.Duration = '';
            }
            item.ShowDateFormat = !item.ShowDateFormat;
        };
        $scope.ChangeFormatDate = function (item) {
            item.Duration = "";
            item.DurationType = "";
        };
        $scope.clickcreatetemplateover = {
            templateUrl: 'createtemplateProcedures.html',
            isOpen: false
        };

        $scope.openProcedurePopover = function () {
            $scope.clickcreatetemplateover.isOpen = true;
        };
        $scope.clicktemplatesProcedures = function () {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/TemplatesProcedures.html",
                //"size": "lg",
                //"backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "resolve": {
               
                  /*  "AllNurseList": $scope.AllNurseList || [],*/
                    "AllNurseList": function () { return angular.copy($scope.AllNurseList) },
                    "LogObj": function () { return angular.copy($scope.LogObj) },
                },

                /* "windowClass": "templateschiefcomplaints overflow-hidden",*/

                "windowClass": "modal__popup--1 bottom-to-top-modal",

                "controller": function ($scope, $uibModal, $uibModalInstance, AllNurseList, LogObj) {
                    $scope.AllNurseList = AllNurseList || [];
                    $scope.LogObj = LogObj || "";
                    $scope.GetUserProcedureTemplateDetails = function () {
                        var params = {
                            "UserId": $scope.UserId,
                            "SearchText": "",
                            "PageSize": 1000,
                            "PageNumber": 1,
                            "OrganizationId": $scope.HospitalId,
                        }
                        eHnotePatientDataService.GetUserOPProcedureTemplateDetails(params).then(function (resp) {
                            if (resp.data.status == "Success") {
                                $scope.ProcedureTemplatesArray = [];
                                $scope.ProcedureTemplatesArray = resp.data.rows || [];
                                if ($scope.ProcedureTemplatesArray.length > 0) {
                                    angular.forEach($scope.ProcedureTemplatesArray, function (mitem) {
                                        mitem.IsEdit = false;
                                        //item.IsDescriptionEdit = false;
                                    });
                                    $scope.ProcedureTemplatesArray[0].IsEdit = true;
                                    //}
                                }
                            }
                            $scope.ProcedureTemplatesArray = $scope.ProcedureTemplatesArray || [];
                            if ($scope.ProcedureTemplatesArray.length > 0) {
                                angular.forEach($scope.ProcedureTemplatesArray, function (item) {
                                    if (item.OPProcedureDetailsArray.length > 0) {
                                        angular.forEach(item.OPProcedureDetailsArray, function (pitem) {
                                            pitem.PostOPStartDate = "";
                                            pitem.PostOPEndDate = "";
                                            //pitem.OrganId = "";
                                            //pitem.AnesthesiaTypeId = "";
                                            pitem.PostOPDays = "";
                                            pitem.EndTime = "";
                                            pitem.StartTime = "";
                                            pitem.ProcedureDoctorId = "";
                                            pitem.SurgeryDate = null;
                                            //pitem.VitalSignsId = "";
                                            //pitem.IOPList = [];
                                            pitem.ReviewedBy = "";
                                            //pitem.MentalHealthId = "";
                                            //pitem.AreasOfTreatmentId = "";
                                            pitem.PreMedicationObservations = "";
                                            //pitem.Milliwatts = "";
                                            //pitem.PowerEnergy = "";
                                            pitem.CheckList = [];
                                            pitem.PreMedicationList = pitem.PreMedicationList || [];
                                            if (pitem.PreMedicationList.length > 0) {
                                                angular.forEach(pitem.PreMedicationList, function (mitem) {
                                                    mitem.MedicationDetails = mitem.MedicationDetails || [];
                                                    if (mitem.MedicationDetails.length > 0) {
                                                        angular.forEach(mitem.MedicationDetails, function (Mitem) {
                                                            Mitem.DilationTime = "";
                                                            Mitem.TimeType = "";
                                                        });
                                                    }
                                                });
                                            }
                                            pitem.IntraMedicationList = pitem.IntraMedicationList || [];
                                            if (pitem.IntraMedicationList.length > 0) {
                                                angular.forEach(pitem.IntraMedicationList, function (Iitem) {
                                                    Iitem.LOTNumber = "";
                                                    Iitem.InjectionTime = "";
                                                    Iitem.MedAdministrationTime = "";
                                                });
                                            }
                                            pitem.PostMedicationList = pitem.PostMedicationList || [];
                                            if (pitem.PostMedicationList.length > 0) {
                                                angular.forEach(pitem.PostMedicationList, function (Pitem) {
                                                    Pitem.DoseQuantity = "";
                                                    Pitem.QuantityUnitId = "";
                                                    Pitem.Refills = "";
                                                    Pitem.SubstitutionPermitted = "";
                                                    Pitem.Duration = "";
                                                    Pitem.DurationType = "";
                                                    Pitem.Instructions = "";
                                                });
                                            }
                                            pitem.IOPList = pitem.IOPList || [];
                                            if (pitem.IOPList.length > 0) {
                                                angular.forEach(pitem.IOPList, function (Pitem) {
                                                    Pitem.DilationTime = "";
                                                });
                                            }
                                        });
                                    }
                                });
                                $scope.LogObj.ProcedureTemplatesArray = angular.copy($scope.ProcedureTemplatesArray) || [];
                            }

                        }, function (err) {

                        });
                    }
                    $scope.GetUserProcedureTemplateDetails();
                    $scope.Proobj.SelectedProcedureTemplateName = "";

                    
                    $scope.ChangeTemplate = function (item) {
                        if ($scope.ProcedureTemplatesArray.length > 0) {
                            angular.forEach($scope.ProcedureTemplatesArray, function (mitem) {
                                mitem.IsEdit = false;
                                //item.IsDescriptionEdit = false;
                            });
                        }
                        item.IsEdit = true;
                    }
                    $scope.DeleteProcedureTemplate = function (item) {
                        $scope.LogObj.LogArray = [];
                        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete this template  ?", function () {
                            var params = {
                                "UserId": $scope.UserId,
                                "OrganizationId": $scope.HospitalId,
                                "DeleteInd": "Y",
                                "TemplateID": item.TemplateID,
                                "TemplateName": item.TemplateName,
                                //"Procedureobj": $scope.ConsultationProcedureList[0],
                                /*  "Procedureobj": $scope.Templatesarray || [],*/
                                "Procedureobj": {},
                                "Logs": {}
                            }
                            if (params.DeleteInd == 'Y') {
                                let logObj = {
                                    "LogId": 0,
                                    "ModuleId": 1,
                                    "ModuleName": "OUT PATIENT",
                                    "SubModuleId": 57,
                                    "SubModuleName": "Procedures",
                                    "ScreenType": "Procedures Templates",
                                    "ActionType": "Deleted",
                                    "OldActionDescription": item.TemplateName + " Deleted.",
                                    "NewActionDescription": "",
                                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                };
                                $scope.LogObj.LogArray.push(logObj);
                            }
                            //if ($scope.LogObj.LogArray.length > 0) {
                            //    params.Logs = $scope.LogObj || {};
                            //}

                            eHnotePatientDataService.AddUpdateUserProcedureTemplateDetails(params).then(function (resp) {
                                $scope.GetUserProcedureTemplateDetails();
                                if (resp.data != undefined && resp.data != "") {
                                    alertify.success("Delete successfully");
                                };
                            }, function (err) {

                            });
                        }, function () {
                            r = "You pressed Cancel!";
                        });

                    };
                    $scope.AddFaviroteProceduretemplate = function (item) {
                        $scope.LogObj.LogArray = [];
                        item.IsTemplateFavorites = !item.IsTemplateFavorites || false;

                        var params = {
                            "UserId": $scope.UserId,
                            "OrganizationId": $scope.HospitalId,
                            "DeleteInd": "N",
                            "TemplateID": item.TemplateID,
                            "TemplateName": item.TemplateName,
                            "Procedureobj": item.OPProcedureDetailsArray[0] || [],
                            "IsTemplateFavorites": item.IsTemplateFavorites || false,
                            "Logs": {}
                        }
                        let Favourite = '';
                        let newvalue = '';
                        let Oldvalue = '';
                        if (item.IsTemplateFavorites) {
                            Favourite = `${item.TemplateName} - is favourite.`;
                            newvalue = Favourite;
                            let logObj = {
                                "LogId": 0,
                                "ModuleId": 1,
                                "ModuleName": "OUT PATIENT",
                                "SubModuleId": 57,
                                "SubModuleName": "Procedures",
                                "ScreenType": "Procedures Templates",
                                "ActionType": "Added",
                                "OldActionDescription": Oldvalue,
                                "NewActionDescription": newvalue,
                                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                            };
                            $scope.LogObj.LogArray.push(logObj);
                        } else if (!item.IsTemplateFavorites) {
                            if ($scope.LogObj.ProcedureTemplatesArray.length > 0) {
                                angular.forEach($scope.LogObj.ProcedureTemplatesArray, function (kitem) {
                                    if (kitem.TemplateID === item.TemplateID) {
                                        Oldvalue = `${item.TemplateName} -  is  favourite.`;
                                    }
                                });
                            }
                            newvalue = `${item.TemplateName} - is  unfavourite.`;
                            if (Oldvalue !== '' && newvalue !== '') {
                                let logObj = {
                                    "LogId": 0,
                                    "ModuleId": 1,
                                    "ModuleName": "OUT PATIENT",
                                    "SubModuleId": 57,
                                    "SubModuleName": "Procedures",
                                    "ScreenType": "Procedures Templates",
                                    "ActionType": "Edited",
                                    "OldActionDescription": Oldvalue,
                                    "NewActionDescription": newvalue,
                                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                };
                                $scope.LogObj.LogArray.push(logObj);
                            }
                        }
                        //if ($scope.LogObj.LogArray.length > 0) {
                        //    params.Logs = $scope.LogObj || {};
                        //}

                        eHnotePatientDataService.AddUpdateUserProcedureTemplateDetails(params).then(function (resp) {

                            if (resp.data != undefined && resp.data != "") {
                                if (item.IsTemplateFavorites) {
                                    alertify.success('Add Favorite Template Successfully');
                                } else {
                                    alertify.success('Remove Favorite Template Successfully');
                                }
                                $scope.GetUserProcedureTemplateDetails();
                            };
                        }, function (err) {

                        });
                    };

                    angular.forEach($scope.ProcedureTemplatesArray, function (Ditem) {
                        Ditem.selectedTemplateCheckbox = false;
                    });

                    $scope.ChangesForProcedureTemp = function (item) {
                        
                        var object = {
                            "OPProcedureId": 0,
                            "ProcedureCode": item.OPProcedureDetailsArray[0].ProcedureCode || "",
                            "OrgProcedureId": item.OPProcedureDetailsArray[0].OrgProcedureId,
                            "ProcedureId": item.OPProcedureDetailsArray[0].ProcedureId,
                            "ProcedureNurseId": item.OPProcedureDetailsArray[0].ProcedureNurseId || null,
                            "ProcedureName": item.OPProcedureDetailsArray[0].ProcedureName || null,
                            "TypeOfServiceId": item.OPProcedureDetailsArray[0].TypeOfServiceId,
                            "OrganId": item.OPProcedureDetailsArray[0].OrganId || null,
                            "ProcedureNotes": item.OPProcedureDetailsArray[0].ProcedureNotes || "",
                            "DeleteInd": item.DeleteInd || "N",
                            "IsEdit": true,
                            "IsEyePatch": false,
                            "EyePatchNotes": '',
                            //"SurgeryDate": item.OPProcedureDetailsArray[0].SurgeryDate || '',
                            "SurgeryDate": null,
                            //"StartTime": item.OPProcedureDetailsArray[0].StartTime || '',
                            "StartTime": null,
                            //"EndTime": item.OPProcedureDetailsArray[0].EndTime || "",
                            "EndTime": null,
                            "PostOPStartTime": item.OPProcedureDetailsArray[0].PostOPStartTime || "",
                            "PostOPEndTime": item.OPProcedureDetailsArray[0].PostOPEndTime || "",
                            "PostOPDays": item.OPProcedureDetailsArray[0].PostOPDays || "",
                            //"ReviewedBy": item.OPProcedureDetailsArray[0].ReviewedBy || "",
                            "ReviewedBy": "",
                            "DiagnosisObj": "",
                            "MedicineObject": "",
                            "SubType": "Notes",
                            "SubTab": "PreMed",
                            "DiagnosisType": "PreDx",
                            "ProcedureDoctorId": item.OPProcedureDetailsArray[0].ProcedureDoctorId || "",
                            "ProcedureDoctorName": item.OPProcedureDetailsArray[0].ProcedureDoctorName || "",
                            "AnesthesiaTypeId": item.OPProcedureDetailsArray[0].AnesthesiaTypeId || "",
                            "VitalSignsId": item.OPProcedureDetailsArray[0].VitalSignsId || "",
                            "VitalName": item.OPProcedureDetailsArray[0].VitalName || "",
                            "MentalHealthId": item.OPProcedureDetailsArray[0].VitalSignsId || "",
                            "OperativeNotes": item.OPProcedureDetailsArray[0].OperativeNotes || "",
                            "PowerEnergy": item.OPProcedureDetailsArray[0].PowerEnergy || "",
                            "Milliwatts": item.OPProcedureDetailsArray[0].Milliwatts || "",
                            "PostOpInstructions": item.OPProcedureDetailsArray[0].PostOpInstructions || "",
                            "Complications": item.OPProcedureDetailsArray[0].Complications || "",
                            "PreMedicationList": item.OPProcedureDetailsArray[0].PreMedicationList || [],
                            "PostMedicationList": item.OPProcedureDetailsArray[0].PostMedicationList || [],
                            "IntraMedicationList": item.OPProcedureDetailsArray[0].IntraMedicationList || [],
                            "PreMedicationObservations": item.OPProcedureDetailsArray[0].PreMedicationObservations || "",
                            "PreDiagnosisList": item.OPProcedureDetailsArray[0].PreDiagnosisList || [],
                            "PostDiagnosisList": item.OPProcedureDetailsArray[0].PostDiagnosisList || [],
                            "IOPList": item.OPProcedureDetailsArray[0].IOPList || [],
                            "CheckList": item.OPProcedureDetailsArray[0].CheckList || [],
                            "MainCheckList": angular.copy($scope.MainCheckList) || [],
                            "MentalHealthName": item.OPProcedureDetailsArray[0].MentalHealthName || "",
                            "MentalHealthId": item.OPProcedureDetailsArray[0].MentalHealthId || "",
                            "AreaofTreatmentName": item.OPProcedureDetailsArray[0].AreaofTreatmentName || "",
                            "AreasOfTreatmentId": item.OPProcedureDetailsArray[0].AreasOfTreatmentId || "",
                            "PostOPStartDate": item.OPProcedureDetailsArray[0].PostOPStartDate || null,
                            "PostOPEndDate": item.OPProcedureDetailsArray[0].PostOPEndDate || null,
                            "IscomingfromTemplate1": true,
                            "IscomingfromTemplate2": true,
                            "IscomingfromTemplate3": true,

                        }
                        if (object.ProcedureNurseId != 0) {
                            var List = $filter("filter")($scope.AllNurseList, { "DoctorID": object.ProcedureNurseId }, true);
                        if (List.length > 0) {
                            object.ProcedureNurseName = List[0].FullName;
                            
                        }
                        else {
                            object.ProcedureNurseName = "";
                        }
                        }
                        var i = 0;
                        $scope.ConsultationProcedureList = $scope.ConsultationProcedureList || [];
                        if ($scope.ConsultationProcedureList.length > 0) {
                            angular.forEach($scope.ConsultationProcedureList, function (initem) {
                                if (initem.ProcedureId === item.OPProcedureDetailsArray[0].ProcedureId && initem.DeleteInd === "N") {
                                    alertify.error('You have already entered this Procedure');
                                    i++;
                                }
                            });
                        };
                        if (i === 0) {
                            if ($scope.ConsultationProcedureList.length !== 0) {
                                angular.forEach($scope.ConsultationProcedureList, function (item) {
                                    item.IsEdit = false;
                                });
                            }
                        }
                        if (i === 0) {
                            $scope.ConsultationProcedureList.push(object)
                        }
                        $scope.Proobj.SelectedProcedureObj = "";

                        if (item.selectedTemplateCheckbox && i == 0) {
                            $scope.LogObj.LogArray = [];
                            let LogItem = {
                                "LogId": 0,
                                "ModuleId": 1,
                                "ModuleName": "OUTPATIENT",
                                "SubModuleId": 57,
                                "SubModuleName": "Procedures",
                                "ScreenType": "Procedures Templates",
                                "ActionType": "Accessed",
                                "OldActionDescription": "",
                                "NewActionDescription": `${item.TemplateName}  is Apply for Procedures`
                            }
                            $scope.AddAuditLogNew(LogItem);
                            alertify.success("Template is selected");
                        }



                    }
                    $scope.ShowAdditionInfo = function (item) {
                        item = item || "";
                        item.AdditionalInformation = !item.AdditionalInformation;
                    }
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };
        $scope.SaveOperativeTemplate = function (val) {
            var TempPodList = $filter("filter")($scope.ConsultationProcedureList, { "IsEdit": true }, true);
            val = TempPodList[0].OperativeNotes || '';
            if ($scope.procobj.EnterOperativenotesTemplateName == '') {
                alertify.error('Enter Template Name');
                return;
            }
            if (val == '') {
                alertify.error('Enter OperativeNotes ');
                return;
            }
            var object = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "TemplateId": 0,
                "TemplateName": $scope.procobj.EnterOperativenotesTemplateName || "",
                "Notes": val || "",
                "DeleteInd": "N",
                "TypeId": 1
            }
            eHnoteSettingsDataService.AddUpdateAllProcedureTemplateDetails(object).success(function (resp) {
                if (resp.Status === 'Success') {
                    alertify.success("Successfully Added");
                    let LogItem = {
                        "LogId": 0,
                        "ModuleId": 1,
                        "ModuleName": "OUTPatient",
                        "SubModuleId": 57,
                        "SubModuleName": "Procedures",
                        "ScreenType": "Operative Notes Template",
                        "ActionType": "Added",
                        "OldActionDescription": "",
                        "NewActionDescription": `Tempalte Name :${$scope.procobj.EnterOperativenotesTemplateName} \n Notes :${val}`,
                    }
                    $scope.AddAuditLogNew(LogItem);
                    //$scope.templatesaveclick();
                    $scope.GetAllProcedureTemplateDetails();
                    $scope.procobj.EnterOperativenotesTemplateName  = "";
                    $scope.procobj.IsOperativenotesTemplateSavePopOver = false;
                } else {
                    alertify.error(resp.Message);
                }
            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });
        }

        $scope.SavePostopInstaractionsTemplate = function (val) {
            var TempPodList = $filter("filter")($scope.ConsultationProcedureList, { "IsEdit": true }, true);
            val = TempPodList[0].PostOpInstructions || '';
            if ($scope.procobj.EnterPostopInstaractionsTemplateName == '') {
                alertify.error('Enter Template Name');
                return;
            }
            if (val == '') {
                alertify.error('Enter Post-op Instractions ');
                return;
            }
            var object = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "TemplateId": 0,
                "TemplateName": $scope.procobj.EnterPostopInstaractionsTemplateName || "",
                "Notes": val || "",
                "DeleteInd": "N",
                "TypeId": 2
            }
            eHnoteSettingsDataService.AddUpdateAllProcedureTemplateDetails(object).success(function (resp) {
                if (resp.Status === 'Success') {
                    alertify.success("Successfully Added");
                    let LogItem = {
                        "LogId": 0,
                        "ModuleId": 1,
                        "ModuleName": "OUTPatient",
                        "SubModuleId": 57,
                        "SubModuleName": "Procedures",
                        "ScreenType": "Post-Op Instructions Template",
                        "ActionType": "Added",
                        "OldActionDescription": "",
                        "NewActionDescription": `Tempalte Name :${$scope.procobj.EnterPostopInstaractionsTemplateName} \n Notes :${val}`,
                    }
                    $scope.AddAuditLogNew(LogItem);
                   // $scope.templatesaveclick();
                    $scope.GetAllProcedureTemplateDetails();
                    $scope.procobj.EnterPostopInstaractionsTemplateName = "";
                    $scope.procobj.IsPostopTemplateSavePopOver = false;
                } else {
                    alertify.error(resp.Message);
                }
            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });
        }

        $scope.SaveComplicationsTemplate = function (val) {
            var TempPodList = $filter("filter")($scope.ConsultationProcedureList, { "IsEdit": true }, true);
            val = TempPodList[0].Complications || '';
            if ($scope.procobj.EnterComplicationsTemplateName == '') {
                alertify.error('Enter Template Name');
                return;
            }
            if (val == '') {
                alertify.error('Enter Complications');
                return;
            }
            var object = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "TemplateId": 0,
                "TemplateName": $scope.procobj.EnterComplicationsTemplateName || "",
                "Notes": val || "",
                "DeleteInd": "N",
                "TypeId": 3
            }
            eHnoteSettingsDataService.AddUpdateAllProcedureTemplateDetails(object).success(function (resp) {
                if (resp.Status === 'Success') {
                    alertify.success("Successfully Added");
                    let LogItem = {
                        "LogId": 0,
                        "ModuleId": 1,
                        "ModuleName": "OUTPatient",
                        "SubModuleId": 57,
                        "SubModuleName": "Procedures",
                        "ScreenType": "Complications Template",
                        "ActionType": "Added",
                        "OldActionDescription": "",
                        "NewActionDescription": `Tempalte Name :${$scope.procobj.EnterComplicationsTemplateName} \n Notes :${val}`,
                    }
                    $scope.AddAuditLogNew(LogItem);
                   // $scope.templatesaveclick();
                     $scope.GetAllProcedureTemplateDetails();
                    $scope.procobj.EnterComplicationsTemplateName = "";
                    $scope.procobj.IsComplicationsTemplateSavePopOver = false;
                } else {
                    alertify.error(resp.Message);
                }
            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });
        }
        $scope.GetAllProcedureTemplateDetails = function () {
            var params = {
                "UserId": $scope.UserId,
                "SearchText": "",
                "OrganizationId": $scope.HospitalId,
            }
            eHnoteSettingsDataService.GetAllProcedureTemplateDetails(params).then(function (resp) {
                if (resp.data.status == "Success") {

                     $scope.OperativenotesList = $filter("filter")(resp.data.rows, { "TypeId": 1 }, true) || [];
                     $scope.PostOpInstructionsList = $filter("filter")(resp.data.rows, { "TypeId": 2 }, true) || [];
                     $scope.ComplicationsList = $filter("filter")(resp.data.rows, { "TypeId": 3 }, true) || [];

                }

            }, function (err) {

            });
        };
        $scope.GetAllProcedureTemplateDetails();

        $scope.ClearNotesDeatils = function (item, type) {
            if (type == 'Operative') {
                item.OperativeNotes = "";
               $scope.procobj.EnterOperativenotesTemplateName  = '';
            }
            else if (type == 'Postop') {
                item.PostOpInstructions = "";
                $scope.procobj.EnterPostopInstaractionsTemplateName = "";
            }
            else if (type == 'Complications') {
                item.Complications = "";
                $scope.procobj.EnterComplicationsTemplateName = "";
            }
            else {

            }

        }

        $scope.changeOperativenotesTemp = function (Subitem, mainitem) {
            if (mainitem.IscomingfromTemplate1 == true) {
                mainitem.OperativeNotes = '';
                mainitem.IscomingfromTemplate1 = false;
            }
            mainitem.OperativeNotes = mainitem.OperativeNotes || '';
            if (mainitem.OperativeNotes == '') {
                mainitem.OperativeNotes = Subitem.Notes || '';
              
            } else {
                var notes = '';
                notes = mainitem.OperativeNotes;
                mainitem.OperativeNotes = notes + '\n' + Subitem.Notes || '';
            }
            $scope.procobj.EnterOperativenotesTemplateName = '';
        }

        $scope.changePostopnotesTemp = function (Subitem, mainitem) {
            if (mainitem.IscomingfromTemplate2 == true) {
                mainitem.PostOpInstructions = '';
                mainitem.IscomingfromTemplate2 = false;
            }
            mainitem.PostOpInstructions = mainitem.PostOpInstructions || '';
            if (mainitem.PostOpInstructions == '') {
                mainitem.PostOpInstructions = Subitem.Notes || '';
            } else {
                var notes = '';
                notes = mainitem.PostOpInstructions;
                mainitem.PostOpInstructions = notes + '\n' + Subitem.Notes || '';
            }
            $scope.procobj.EnterPostopInstaractionsTemplateName = "";
        }

        $scope.changeComplicationsTemp = function (Subitem, mainitem) {
            if (mainitem.IscomingfromTemplate3 == true) {
                mainitem.Complications = '';
                mainitem.IscomingfromTemplate3 = false;
            }
            mainitem.Complications = mainitem.Complications || '';
            if (mainitem.Complications == '') {
                mainitem.Complications = Subitem.Notes || '';
            } else {
                var notes = '';
                notes = mainitem.Complications;
                mainitem.Complications = notes + '\n' + Subitem.Notes || '';
            }
            $scope.procobj.EnterComplicationsTemplateName = "";
        }
        $scope.clickOperativetemplateover = {
            templateUrl: 'AddOperativenotesTemplateSave.html',
        };
        $scope.clickPostopInstaractionspopeover = {
            templateUrl: 'AddPostopInstaractionsTemplateSave.html',
        };
        $scope.clickComplicationspopeover = {
            templateUrl: 'AddComplicationsTemplateSave.html',
        };
        $scope.Historypopupnew = function (tab, type, from) {
            var HistoryTab = tab || 1;
            type = type || 2;
            from = from || "";
            let LogItem = {
                "LogId": 0,
                "ModuleId": 1,
                "ModuleName": "OUTPATIENT",
                "SubModuleId": 57,
                "SubModuleName": "Procedures",
                "ScreenType": "History",
                "ActionType": "Accessed",
                "OldActionDescription": "",
                "NewActionDescription": `History From Procedures`,
            }
            $scope.AddAuditLogNew(LogItem);
            let mInstanceShow = $uibModal.open({
                "templateUrl": "templates/UsNewConsultation/uibpopup/Historypopupnew.html",
                "controller": "HistorypopupnewCtrl",
                "backdrop": "static",
                //"scope": $scope,
                //"size": "lg",
              /*  "windowClass": "offcanves-right  ",*/
                "windowClass": "modal__popup--1 bottom-to-top-modal  ",
                "keyboard": false,
                "resolve": {
                    "HistoryTab": function () { return HistoryTab },
                    "Patientid": function () { return angular.copy(cache.PatientID) },
                    "HospitalId": function () { return angular.copy($scope.HospitalId) },
                    "VisionObj": function () { return angular.copy($scope.VisionObj) },
                    "obj": function () { return angular.copy($scope.obj) },
                    "RefractionDetails": function () { return angular.copy($scope.PreviousInvestigationIdArray) },
                    "TonometrySubList": function () { return angular.copy($scope.TonometrySubList) },
                    "cacheStorageItem": function () { return angular.copy(cache) },
                    "type": function () { return type },
                    "Comingfrom": function () { return from },
                },

            });
            mInstanceShow.result.then(function (resp) {
                //$scope.cacheStorageItem.ChiefComplaints = angular.copy(resp.Cheifcomplaint);

            }, function () { });
        }
      
        $scope.ChangeOnSetItem1 = function (item,type) {
            if (type === 'Date') {
                item.PostOPDurationType = "Duration"                 
                item.PostOPStartDate = "";
                item.PostOPOnSetType = "";

            } else if (type === 'Duration') {
                item.PostOPDurationType = "Date"
                item.PostOPDays = null;
                item.PostOPOnSetType = "";
            }
        };
        $scope.ChangeDuration1 = function () {           
           /* console.log($scope.postOPDurationType)*/
        };
        $scope.ChangeFormatDate1 = function (item) {
            item.PostOPOnSetType = ""
        }

        $scope.selectProcedurePopup = function () {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "selectProcedurePopup.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "modal__seventy--",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };
        $scope.showClinicalInfo = false;

        $scope.toggleClinicalInfo = function () {
            $scope.showClinicalInfo = !$scope.showClinicalInfo;
        };


        $scope.onSelectDiagnosisNew = function (mainobject, Diagnosisitem, type) {
            type = type || '';
            Diagnosisitem.DiagnosisType = type;
            if (Diagnosisitem.DiagnosisType == 'PreDx') {
                if (Diagnosisitem.PreDiagnosisList.length > 0) {
                    var filterdiagnosis = $filter("filter")(Diagnosisitem.PreDiagnosisList, function (Aitem, index) { return Aitem.DiagnosisId == mainobject.DiagnosisId },);
                    if (filterdiagnosis.length > 0) {
                        mainobject = "";
                        //mainobject.DiagnosisObj = "";
                        Diagnosisitem.DiagnosisObj = "";
                        alertify.error("Diagnosis Already Added");
                        return false;
                    }
                }



                var obj = {
                    "OPProcedureDiagnoisId": 0,
                    /*"TypeId": 2,*/
                    "TypeId": 1,
                    "DeleteInd": "N",
                    "DiagnosisDetailId": mainobject.DiagnosisId || 0,
                    "DiagnosisId": mainobject.DiagnosisId,
                    "DiagnosisName": mainobject.DiagnosisName,
                    "ICDCode": mainobject.ICD10CODE,
                    "ConsultationDiagnosisId": 0,
                    "AssessmentPlanId": 0,
                    "AssessmentPlan": {
                        "AssessmentPlanId": 0,
                        "PlanofDiscussionsNotes": "",
                        "PatientInstructions": "",
                        "AssessmentsNotes": "",
                        "DoctorNotes": "",
                        "ActionsTaken": ""
                    },

                    "LocationId1": 0,
                    "SeverityId1": null,
                    "Verificationstatusid1": null,
                    "DiagnosisStatusId1": 2,
                    "DiagnosisStatus1": 'Active',
                    "EndDate1": null,
                    "StartDate1": null,

                    "LocationId2": 0,
                    "SeverityId2": null,
                    "Verificationstatusid2": null,
                    "DiagnosisStatusId2": 2,
                    "DiagnosisStatus2": 'Active',
                    "EndDate2": null,
                    "StartDate2": null,
                }

                if (mainobject.OrganId == 1) {
                    obj.LocationId1 = 1;
                    obj.Location1 = 'OD';
                } else if (mainobject.OrganId == 2) {
                    obj.LocationId2 = 2;
                    obj.Location2 = 'OS';
                } else if (mainobject.OrganId == 3) {
                    obj.LocationId1 = 1;
                    obj.LocationId2 = 2;
                    obj.Location1 = 'OD';
                    obj.Location2 = 'OS';
                } else if (mainobject.OrganId == 0) {
                    obj.LocationId1 = 0;
                    obj.Location1 = '';
                } else { }

                Diagnosisitem.PreDiagnosisList.push(obj);
                Diagnosisitem.DiagnosisObj = "";
            } else {
                if (Diagnosisitem.PostDiagnosisList.length > 0) {
                    var filterdiagnosis = $filter("filter")(Diagnosisitem.PostDiagnosisList, function (Aitem, index) { return Aitem.DiagnosisId == mainobject.DiagnosisId },);
                    if (filterdiagnosis.length > 0) {
                        mainobject = "";
                        //mainobject.DiagnosisObj = "";
                        Diagnosisitem.DiagnosisObj = "";
                        alertify.error("Diagnosis Already Added");
                        return false;
                    }
                }



                var obj = {
                    "OPProcedureDiagnoisId": 0,
                    "TypeId": 2,
                    "DeleteInd": "N",
                    "DiagnosisDetailId": mainobject.DiagnosisId || 0,
                    "DiagnosisId": mainobject.DiagnosisId,
                    "DiagnosisName": mainobject.DiagnosisName,
                    "ICDCode": mainobject.ICD10CODE,
                    "ConsultationDiagnosisId": 0,
                    "AssessmentPlanId": 0,
                    "AssessmentPlan": {
                        "AssessmentPlanId": 0,
                        "PlanofDiscussionsNotes": "",
                        "PatientInstructions": "",
                        "AssessmentsNotes": "",
                        "DoctorNotes": "",
                        "ActionsTaken": ""
                    },

                    "LocationId1": 0,
                    "SeverityId1": null,
                    "Verificationstatusid1": null,
                    "DiagnosisStatusId1": 2,
                    "DiagnosisStatus1": 'Active',
                    "EndDate1": null,
                    "StartDate1": null,

                    "LocationId2": 0,
                    "SeverityId2": null,
                    "Verificationstatusid2": null,
                    "DiagnosisStatusId2": 2,
                    "DiagnosisStatus2": 'Active',
                    "EndDate2": null,
                    "StartDate2": null,
                }

                if (mainobject.OrganId == 1) {
                    obj.LocationId1 = 1;
                    obj.Location1 = 'OD';
                } else if (mainobject.OrganId == 2) {
                    obj.LocationId2 = 2;
                    obj.Location2 = 'OS';
                } else if (mainobject.OrganId == 3) {
                    obj.LocationId1 = 1;
                    obj.LocationId2 = 2;
                    obj.Location1 = 'OD';
                    obj.Location2 = 'OS';
                } else if (mainobject.OrganId == 0) {
                    obj.LocationId1 = 0;
                    obj.Location1 = '';
                } else { }

                Diagnosisitem.PostDiagnosisList.push(obj);
                Diagnosisitem.DiagnosisObj = "";
            }

        };

    }]);
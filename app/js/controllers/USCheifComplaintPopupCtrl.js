"use strict";
eHnoteWebApp.controller("USCheifComplaintPopupCtrl", ["$scope", "$rootScope", "$uibModalInstance", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteConditionsDataService", "eHnoteSettingsDataService", "eHnoteMainAppointmentService", "eHnotePatientDataService", "cacheStorageItem", "isselectitem", "$uibModal", "eHnoteDiagnosisDataServices", "GetAssSeverityList", "GetOrganNameList", "eHnoteUserDataService", "LogObj", "eHnoteSurgeryService", "$window","GeneralCCList",
    function ($scope, $rootScope, $uibModalInstance, $filter, alertify, eHnoteMasterDataService, eHnoteConditionsDataService, eHnoteSettingsDataService, eHnoteMainAppointmentService, eHnotePatientDataService, cacheStorageItem, isselectitem, $uibModal, eHnoteDiagnosisDataServices, GetAssSeverityList, GetOrganNameList, eHnoteUserDataService, LogObj, eHnoteSurgeryService, $window, GeneralCCList) {
        $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;

        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.SubOrginactionID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.SubHospitalID;
        };
        $scope.masterComplaintsLevelType = "U";
        $scope.cacheStorageItem = cacheStorageItem || '';
        $scope.selecteditem = isselectitem;
        $scope.Selectedtemplateobj = {
            "TemplateName": "",
            "IsTemplateFavorites":false
        };

        $scope.MainCheifComplaitsObj = {
            "Type": "Custom"
        }
        //$scope.GetOrganName = function () {
        //    return [{
        //        "OrganId": 1,
        //        "OrganName": "OD"
        //    },
        //    {
        //        "OrganId": 2,
        //        "OrganName": "OS"
        //    },
        //    {
        //        "OrganId": 3,
        //        "OrganName": "OU"
        //        },
        //        {
        //            "OrganId": 4,
        //            "OrganName": "General"
        //        }
        //    ];
        //};
        //$scope.GetOrganNameList = angular.copy($scope.GetOrganName());
        var GetAssSeverityList = GetAssSeverityList || []
        $scope.GetSeverityList = GetAssSeverityList || [];
        $scope.GeneralCCList = GeneralCCList || [];
        var GetOrganNameList = GetOrganNameList || []
        $scope.LogObj = LogObj || '';
        $scope.GetOrganNameList = $filter("filter")(GetOrganNameList, function (iterator, ind) {
            return iterator.OrganId === 1 || iterator.OrganId === 2 || iterator.OrganId === 3 || iterator.OrganId === 9 || iterator.OrganId === 10 || iterator.OrganId === 4;
        }) || [];
        $scope.GetDurationEpisode = function () {
            return [
                {
                    "EyeDurationId": 1,
                    "Duration": "Constantly"
                },
                {
                    "EyeDurationId": 2,
                    "Duration": "Occasionally"
                },
                {
                    "EyeDurationId": 3,
                    "Duration": "Intermittently"
                },
                {
                    "EyeDurationId": 4,
                    "Duration": "Uncertain"
                },
                {
                    "EyeDurationId": 5,
                    "Duration": "Last long"
                },
                {
                    "EyeDurationId": 6,
                    "Duration": "Once"
                },
            ];
        };
        $scope.GetDurationEpisodeList = angular.copy($scope.GetDurationEpisode());

        //$scope.GetSeverity = function () {
        //    return [
        //        {
        //            "AllergyDescription":"Mild",
        //            "ROSAllergiesID": 38,                       
        //        },
        //        {
        //            "AllergyDescription":"Moderate",
        //            "ROSAllergiesID": 40,                       
        //        },
        //        {
        //            "AllergyDescription":"Severe",
        //            "ROSAllergiesID": 42,                       
        //        },

        //    ];
        //};
        //$scope.GetSeverityList = angular.copy($scope.GetSeverity());
        if ($scope.selecteditem !== 0) {
            angular.forEach($scope.cacheStorageItem.ChiefComplaints, function (item) {

                if (item.ChiefComplaintId === $scope.selecteditem) {
                    item.IsSelected = true;
                } else {
                    item.IsSelected = false;
                }
            });
        }
        $scope.newChiefCompaintObj = {
            "SelectedEye": '',
            "SeverityId": null,
            "SeverityName": '',
            "ChiefComplaints": [],
            "ChiefComplaintId": "",
            "ChiefComplaintName": "",
            "ChiefComplaintObj": "",
            "AddComplaints": false,
            "ComplaintsFocus": false,
            "IsClickSaveCheifComplaints": false,
            "HistoryOfPresentIllness": ""
        };

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
            "ExternalComanagerName": $scope.selectedPatientData.Patient[0].ExternalComanagerName||'',
            "InternalComanagerName": $scope.selectedPatientData.Patient[0].InternalComanagerName||'',
            "PCPDoctorName": $scope.selectedPatientData.Patient[0].PCPDoctorName||'',
            "RefferalName": $scope.selectedPatientData.Patient[0].ReferralName||'',
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
        $scope.PatientMNumber = $scope.selectedPatientData.Patient[0].Altareacode + $scope.selectedPatientData.Patient[0].PatientHomeNumber;
        $scope.PatientMNumber = $scope.PatientMNumber || '';
        if ($scope.PatientMNumber != '') {
            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientMNumber);
            $scope.PatientMobileNumber = obj.UsFormatMobileNumber;
        }

        $scope.PatientOfficeNumber = $scope.selectedPatientData.Patient[0].OfficeAreaCode + $scope.selectedPatientData.Patient[0].PatientOfficeNumber;
        $scope.PatientOfficeNumber = $scope.PatientOfficeNumber || '';
        if ($scope.PatientOfficeNumber != '') {
            var obj1 = eHnoteUserDataService.UsMobileFormatChange($scope.PatientOfficeNumber);
            $scope.PatientOfficeNumber = obj1.UsFormatMobileNumber;
        }
        $scope.AddAuditLogNew = function (selectedItem) {
            $scope.LogObj.LogArray = [];
            let SubModuleName = selectedItem.SubModuleName || "";
            let SubModuleId = selectedItem.SubModuleId || 0;
            let ScreenType = selectedItem.ScreenType || "Examination";
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

        $scope.DemographicSummaryObj = {
            "LanguageName": $scope.selectedPatientData.Patient[0].AdditionalInfo.LanguageName || "",
            "Proficiency": $scope.selectedPatientData.Patient[0].AdditionalInfo.Proficiency || "",
            "SexualOrientation": $scope.selectedPatientData.Patient[0].AdditionalInfo.SexualOrientation || "",
            "GenderIdentityStatus": $scope.selectedPatientData.Patient[0].AdditionalInfo.GenderIdentity || "",
        }

        $scope.ChangeIndividualHPIDiscription = function (ChiefComplaints) {
            var hpiList = [];
            let ChiefComplaintsArray = $filter("filter")(
                ChiefComplaints,
                { ActiveInd: 'Y' },
                true
            ) || [];

            if (ChiefComplaintsArray.length > 0) {

                let patientPrefix =
                    $scope.cacheStorageItem.PatientName + ' presents with/for ';

                let otherPrefix = 'Pt also presents with/for ';

                angular.forEach(ChiefComplaintsArray, function (item, index) {

                    // Remove existing prefixes
                    let description = item.Description || '';

                    description = description.replace(
                        patientPrefix,
                        ''
                    );

                    description = description.replace(
                        otherPrefix,
                        ''
                    );

                    // Add the correct prefix only once
                    if (index === 0) {
                        item.Description = patientPrefix + description;
                    } else {
                        item.Description = otherPrefix + description;
                    }
                    hpiList.push(item.Description);
                });
                $scope.newChiefCompaintObj.HistoryOfPresentIllness = hpiList.join('. ');
            } else {
                $scope.newChiefCompaintObj.HistoryOfPresentIllness = '';
            }
        };

        $scope.ChangeChiefCompaint = function (mainitem) {
            angular.forEach($scope.newChiefCompaintObj.ChiefComplaints, function (item) {
                item.IsEdit = false;
            })
            mainitem.IsEdit = true;
            $scope.ChangeIndividualHPIDiscription($scope.newChiefCompaintObj.ChiefComplaints);
        }

        if ($scope.cacheStorageItem.ChiefComplaints.length>0) {
            $scope.newChiefCompaintObj.ChiefComplaints = angular.copy($scope.cacheStorageItem.ChiefComplaints) || [];
            angular.forEach($scope.newChiefCompaintObj.ChiefComplaints, function (item) {
                item.IsEdit = false;
                item.IsDescriptionEdit = true;

                item.DurationDate = item.DurationDate || '';
                if (item.DurationDate != '') {
                    item.ShowDateFormat = true;
                    item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy");
                } else {
                    item.ShowDateFormat = false;
                }
                //if (item.DurationDate!='') {
                //    item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy");
                //    item.ShowDateFormat = true;
                //}
                item.ModifyFactors = item.ModifyFactors || [];
                if (item.ModifyFactors.length > 0) {
                    angular.forEach(item.ModifyFactors, function (sitem) {
                        sitem.isChecked = false;
                    });
                    if (item.SlectedModifyFactors.length > 0) {
                        angular.forEach(item.SlectedModifyFactors, function (sfitem) {
                            angular.forEach(item.ModifyFactors, function (sitem) {
                                if (sfitem.ID == sitem.ID) {
                                    sitem.isChecked = true;
                                }

                            });
                        });
                    }
                }
                item.Quality = item.Quality || [];
                if (item.Quality.length > 0) {
                    angular.forEach(item.Quality, function (sitem) {
                        sitem.isChecked = false;

                    });
                    if (item.SlectedQuality.length > 0) {
                        angular.forEach(item.SlectedQuality, function (sfitem) {
                            angular.forEach(item.Quality, function (sitem) {
                                if (sfitem.ID == sitem.ID) {
                                    sitem.isChecked = true;
                                }

                            });
                        });
                    }
                }
                item.Context = item.Context || [];
                if (item.Context.length > 0) {
                    angular.forEach(item.Context, function (sitem) {
                        sitem.isChecked = false;
                    });
                    if (item.SlectedContext.length > 0) {
                        angular.forEach(item.SlectedContext, function (sfitem) {
                            angular.forEach(item.Context, function (sitem) {
                                if (sfitem.ID == sitem.ID) {
                                    sitem.isChecked = true;
                                }

                            });
                        });
                    }
                }
                item.AssosSign = item.AssosSign || [];
                if (item.AssosSign.length > 0) {
                    angular.forEach(item.AssosSign, function (sitem) {
                        sitem.isChecked = false;
                    });
                    if (item.SlectedAssosSign.length > 0) {
                        angular.forEach(item.SlectedAssosSign, function (sfitem) {
                            angular.forEach(item.AssosSign, function (sitem) {
                                if (sfitem.ID == sitem.ID) {
                                    sitem.isChecked = true;
                                }

                            });
                        });
                    }
                }
                item.ModifyFactors = item.ModifyFactors || [];
                if (item.ModifyFactors.length > 0) {
                    angular.forEach(item.ModifyFactors, function (sitem) {
                        sitem.isChecked = false;
                    });
                    if (item.SlectedModifyFactors.length > 0) {
                        angular.forEach(item.SlectedModifyFactors, function (sfitem) {
                            angular.forEach(item.ModifyFactors, function (sitem) {
                                if (sfitem.ID == sitem.ID) {
                                    sitem.isChecked = true;
                                }

                            });
                        });
                    }
                }

            });
            $scope.cacheStorageItem.ChiefComplaints = angular.copy($scope.newChiefCompaintObj.ChiefComplaints);
            //$scope.newChiefCompaintObj.ChiefComplaints = $filter("filter")($scope.newChiefCompaintObj.ChiefComplaints, { "Type": 'Grid' }, true);
            $scope.newChiefCompaintObj.ChiefComplaints[0].IsEdit = true;
            $scope.ChangeChiefCompaint($scope.newChiefCompaintObj.ChiefComplaints[0]);
        }
        $scope.newChiefCompaintObj.HistoryOfPresentIllness = $scope.cacheStorageItem.HistoryOfPresentIllness || '';
        $scope.closeGridCheifComplaintspopup = function () {
            if ($scope.newChiefCompaintObj.ChiefComplaints.length>0) {
                angular.forEach($scope.newChiefCompaintObj.ChiefComplaints, function (item) {
                    item.IsEdit = false;
                });
            }

            $uibModalInstance.dismiss("cancel");
        };
        $scope.CheifComplaitsSection = {
            /*"ChiefComplaints":"", */
            /*"GridCheifComplaints": 2,*/
            "GridCheifComplaints": 1,
        };
        $scope.openAddComplaintsPopup = function (type) {
            let ScreenType = '';
            if (type == 1) {
                ScreenType = "Grid View";
            } else if (type == 2) {
                ScreenType = "Text Box View"
            }
            let LogItem = {
                "LogId": 0,
                "ModuleId": 1,
                "ModuleName": "OUTPATIENT",
                "SubModuleId": 47,
                "SubModuleName": "Chief Complaints",
                "ScreenType": ScreenType,
                "ActionType": "Accessed",
                "OldActionDescription": "",
                "NewActionDescription": `${ScreenType} From Chief Complaints`,
            }
            $scope.AddAuditLogNew(LogItem);
            if (type == 1) {
                $scope.Selectedtemplateobj.TemplateName = "";
                $scope.newChiefCompaintObj.ChiefComplaints = $scope.cacheStorageItem.ChiefComplaints || [];
                $scope.CheifComplaitsSection.GridCheifComplaints = 1;
                if ($scope.newChiefCompaintObj.ChiefComplaints.length > 0) {
                    angular.forEach($scope.newChiefCompaintObj.ChiefComplaints, function (item) {
                        item.IsEdit = false;
                    });
                    $scope.newChiefCompaintObj.ChiefComplaints[0].IsEdit = true;
                }

            }
            if (type == 2) {
                $scope.Selectedtemplateobj.TemplateName = "";
                $scope.cacheStorageItem.ChiefComplaints = $scope.newChiefCompaintObj.ChiefComplaints || [];
                $scope.CheifComplaitsSection.GridCheifComplaints = 2;
            }

        }

        $scope.getComplaints = function (val) {
            var object = {
                "ParentHospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID ,
                "SearchText": val,
                "PageSize": 10,
                "PageNumber": 1,
                "ChiefComplaintId": 0,
                "IsFrequent": 'N'

            };
            if (object.SearchText == '') {
                object.IsFrequent = 'Y';
            }
            return eHnoteSettingsDataService.GetMasterChiefComplaintConditionsUS(object).then(function (resp) {
                if (resp.data.count !== 0) {
                    if (resp.data.ChiefComplaint !== undefined) {
                        $scope.newChiefCompaintObj.AddComplaints = false;
                        return resp.data.ChiefComplaint.map(function (item) {
                            return item;
                        });
                    } else {
                        //$scope.obj.AddComplaints = true;
                        $scope.newChiefCompaintObj.AddComplaints = true;
                    }
                } else {
                    //$scope.obj.AddComplaints = true;
                    $scope.newChiefCompaintObj.AddComplaints = true;
                }
            });

        };

        $scope.ComplaintsBlurChange = function (selectcompliant) {

            if (selectcompliant.ChiefComplaintId === '') {
                selectcompliant.ChiefComplaintName = '';
                $scope.newChiefCompaintObj.ChiefComplaintObj = "";
                return false;
            }
            $scope.newChiefCompaintObj.ChiefComplaintObj = selectcompliant;
            var i = 0;
            $scope.DisplayDate = $filter('date')(new Date(), "dd-MMM-yyyy HH:mm:ss");
            $scope.newChiefCompaintObj.ChiefComplaintObj = $scope.newChiefCompaintObj.ChiefComplaintObj || "";
            if ($scope.newChiefCompaintObj.ChiefComplaintObj === "") {
                return;
            }
            if (angular.isObject($scope.newChiefCompaintObj.ChiefComplaintObj)) {
                var object = {
                    "IsEdit": false,
                    "showCheifInstructions": false,
                    "ActiveInd": 'Y',
                    "SeverityId": $scope.newChiefCompaintObj.SeverityId || null,
                    "SeverityName": $scope.newChiefCompaintObj.SeverityName || '',
                    "ModifyFactors": $scope.newChiefCompaintObj.ChiefComplaintObj.ModifyFactors || [],
                    "Quality": $scope.newChiefCompaintObj.ChiefComplaintObj.Quality || [],
                    "Context": $scope.newChiefCompaintObj.ChiefComplaintObj.Context || [],
                    "AssosSign": $scope.newChiefCompaintObj.ChiefComplaintObj.AssosSign || [],
                    "ModifyFactorId": null,
                    "QualityId": null,
                    "ContextId": null,
                    "AssosSignId": null,
                    "EyeDurationId": null,
                    "OrganId": $scope.newChiefCompaintObj.SelectedEye,
                    "ChiefComplaintId": $scope.newChiefCompaintObj.ChiefComplaintObj.ChiefComplaintId,
                    "ChiefComplaintName": $scope.newChiefCompaintObj.ChiefComplaintObj.ChiefComplaintName,
                    "ChiefComplaintCodeSystemName": "Custom",
                    "PatientChiefComplaintId": 0,
                    "Description": "",
                    "IsDescriptionEdit": false,
                    "ShowDateFormat": true,
                    "DurationType": 'D',
                    "Duration": 0,
                    "DurationDate": "",
                    "Remarks": ""
                };
            } else {
                object = {
                    "IsEdit": false,
                    "showCheifInstructions": false,
                    "ActiveInd": 'Y',
                    "OrganId": $scope.newChiefCompaintObj.SelectedEye,
                    "SeverityId": $scope.newChiefCompaintObj.SeverityId || null,
                    "SeverityName": $scope.newChiefCompaintObj.SeverityName || '',
                    "ModifyFactors": $scope.newChiefCompaintObj.ChiefComplaintObj.ModifyFactors || [],
                    "Quality": $scope.newChiefCompaintObj.ChiefComplaintObj.Quality || [],
                    "Context": $scope.newChiefCompaintObj.ChiefComplaintObj.Context || [],
                    "AssosSign": $scope.newChiefCompaintObj.ChiefComplaintObj.AssosSign || [],
                    "ModifyFactorId": null,
                    "QualityId": null,
                    "ContextId": null,
                    "AssosSignId": null,
                    "EyeDurationId": null,
                    "ChiefComplaintId": $scope.newChiefCompaintObj.ChiefComplaintObj,
                    "ChiefComplaintName": $scope.newChiefCompaintObj.ChiefComplaintObj,
                    "ChiefComplaintCodeSystemName": "Custom",
                    "PatientChiefComplaintId": 0,
                    "Description": "",
                    "IsDescriptionEdit": false,
                    "ShowDateFormat": false,
                    "DurationType": 'D',
                    "Duration": 0,
                    "DurationDate": "",
                    "Remarks": ""
                };
            }
            if (object.ModifyFactors.length>0) {
                angular.forEach(object.ModifyFactors, function (item) {
                    item.isChecked = false;
                });
            }
            if (object.Quality.length > 0) {
                angular.forEach(object.Quality, function (item) {
                    item.isChecked = false;
                });
            }
            if (object.Context.length > 0) {
                angular.forEach(object.Context, function (item) {
                    item.isChecked = false;
                });
            }
            if (object.AssosSign.length > 0) {
                angular.forEach(object.AssosSign, function (item) {
                    item.isChecked = false;
                });
            }

            $scope.newChiefCompaintObj.ChiefComplaints = $scope.newChiefCompaintObj.ChiefComplaints || [];
            var data = $scope.newChiefCompaintObj.ChiefComplaintObj.ChiefComplaintName ? $scope.newChiefCompaintObj.ChiefComplaintObj.ChiefComplaintName : $scope.newChiefCompaintObj.ChiefComplaintObj;

            var List = $filter("filter")($scope.newChiefCompaintObj.ChiefComplaints, function (item) {
                return (item.ChiefComplaintName === data && item.ActiveInd === 'Y');
            });
            if (List.length > 0) {
                alertify.error('You have already entered this chief complaint');
                $scope.newChiefCompaintObj.ChiefComplaintObj = "";
                return;
            }



            if ($scope.newChiefCompaintObj.ChiefComplaints.length !== 0) {
                angular.forEach($scope.newChiefCompaintObj.ChiefComplaints, function (item) {
                    item.IsEdit = false;
                });
            }
            if (i === 0) {
                object.IsEdit = true;
                $scope.newChiefCompaintObj.ChiefComplaints.push(object);
            }
            $scope.cacheStorageItem.ChiefComplaints = angular.copy($scope.newChiefCompaintObj.ChiefComplaints);

            //$scope.ChangedHPIDiscription($scope.cacheStorageItem.ChiefComplaints);
            $scope.ChangeIndividualHPIDiscription($scope.cacheStorageItem.ChiefComplaints);

            $scope.newChiefCompaintObj.ChiefComplaintObj = "";
            $scope.newChiefCompaintObj.SelectedEye = '';
            $scope.newChiefCompaintObj.SeverityId = null;
            $scope.newChiefCompaintObj.SeverityName = '';

        };

        //$scope.ChangeFormatDate = function (item) {
        //    item.Duration = "";
        //    item.DurationType = 'D';
        //    var today = new Date();
        //    var dd = today.getDate();
        //    var mm = today.getMonth() + 1; //January is 0!
        //    var yyyy = today.getFullYear();
        //    if (dd < 10) {
        //        dd = '0' + dd
        //    }
        //    if (mm < 10) {
        //        mm = '0' + mm
        //    }
        //    today = yyyy + '/' + mm + '/' + dd;
        //    var date2 = new Date(today);
        //    var todate = $filter('date')(new Date(item.DurationDate), "yyyy-MM-dd");
        //    var date1 = new Date(todate);
        //    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        //    $scope.dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
        //    item.Duration = $scope.dayDifference;
        //};

        $scope.ChangeItem = function (item) {
            if (item.ShowDateFormat) {
                item.DurationDate = '';
            } else {
                item.Duration = '';
            }
            item.ShowDateFormat = !item.ShowDateFormat;
        };

      
        //$scope.GetUserChiefComplaintTemplateDetails = function () {
        //    var obj = {
        //        "UserId": $scope.UserId,
        //        "SearchText": "",
        //        "PageSize": 10,
        //        "PageNumber": 1,
        //        "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
        //        "IsFavoriteInd": 0
        //    }
        //    eHnotePatientDataService.GetUserChiefComplaintTemplateDetails(obj).then(function (resp) {
        //        console.log(resp);
        //        if (resp.data.status == "Success") {
        //            $scope.ChiefComplaintTemplatesArray = resp.data.rows || [];
        //        }

        //    }, function (err) {

        //    });
        //}
        $scope.Templatesearch = {
            "ConsulTemplate": "",
            "DiagnosisTemplate": "",
            "Viewtemplate": true,
            "SelectedDiagnosisTemaplte": "",
            "IsCreatenewTemplatesave": false,
            "TemplateName": "",
            "TemplateId": 0,
            "IsFavorite": false,
            "searchtempl":"",
        }
        $scope.isPopoverOpen = false;
        $scope.togglePopover = function (type) {
            if (type === 'ChiefComplaints') {
                //$scope.isPopoverOpen = true;
                $scope.isPopoverOpen = !$scope.isPopoverOpen || false;
                $scope.Templatesearch.IsCreatenewTemplatesave = false;
            }
        };
        //$scope.GetUserChiefComplaintTemplateDetails();
        $scope.AddUpdateCheifComplaintTemplate = function () {
            $scope.LogObj.LogArray = [];
            let Names = "";
            let count = 0;
            if ($scope.CheifComplaitsSection.GridCheifComplaints == 1) {
                console.log(JSON.stringify($scope.newChiefCompaintObj.ChiefComplaints));
                if ($scope.newChiefCompaintObj.ChiefComplaints.length == 0) {
                    alertify.error("Add At Least One Chief Complaints ");
                    return false;
                }
                if ($scope.Selectedtemplateobj.TemplateName == "") {
                    alertify.error("Please Enter Template Name ");
                    return false;
                }
                $scope.isPopoverOpen = false;
                $scope.Templatesearch.IsCreatenewTemplatesave = false;
                $scope.ChiefComplaintsArray = [];
                angular.forEach($scope.newChiefCompaintObj.ChiefComplaints, function (item) {
                    item.DurationDate = $filter('date')(item.DurationDate, "yyyy-MM-dd");
                    item.SlectedModifyFactors = $filter("filter")(item.ModifyFactors, { "isChecked": true }, true) || [];
                    item.SlectedQuality = $filter("filter")(item.Quality, { "isChecked": true }, true) || [];
                    item.SlectedAssosSign = $filter("filter")(item.AssosSign, { "isChecked": true }, true) || [];
                    item.SlectedContext = $filter("filter")(item.Context, { "isChecked": true }, true) || [];
                    if (item.ActiveInd == 'Y') {
                        var obj = {
                            "ActiveInd": item.ActiveInd || "Y",
                            "Duration": item.Duration || 0,
                            "SeverityId": item.SeverityId || null,
                            "DurationType": item.DurationType || "D",
                            "DurationDate": item.DurationDate || "",
                            "SlectedQuality": item.SlectedQuality || [],
                            "SlectedModifyFactors": item.SlectedModifyFactors || [],
                            "SlectedAssosSign": item.SlectedAssosSign || [],
                            "SlectedContext": item.SlectedContext || [],
                            "ModifyFactorId": item.ModifyFactorId || null,
                            "QualityId": item.QualityId || null,
                            "ContextId": item.ContextId || null,
                            "AssosSignId": item.AssosSignId || null,
                            "EyeDurationId": item.EyeDurationId || null,
                            "OrganId": item.OrganId || "",
                            "ChiefComplaintId": item.ChiefComplaintId || null,
                            "Description": item.Description || '',
                            "IsDescriptionEdit": item.IsDescriptionEdit || false,
                            "TemplateChiefComplaintId": item.TemplateChiefComplaintId || 0,
                            "ChiefComplaintCodeSystemName": item.ChiefComplaintCodeSystemName ||"",
                        }
                        $scope.ChiefComplaintsArray.push(obj);
                    }

                });

                if ($scope.ChiefComplaintsArray.length > 0) {

                    angular.forEach($scope.ChiefComplaintsArray, function (item) {

                        let description = item.Description || '';

                        // Remove patient name + "presents with/for"
                        description = description.replace(
                            /^.*?\s+presents\s+with\/for\s+/i,
                            ''
                        );

                        // Remove "Pt also presents with/for"
                        description = description.replace(
                            /^Pt\s+also\s+presents\s+with\/for\s+/i,
                            ''
                        );

                        // Remove "presents with/for" if it exists alone
                        description = description.replace(
                            /^presents\s+with\/for\s+/i,
                            ''
                        );

                        item.Description = description.trim();
                    });
                }

                var param = {
                    "UserId": $scope.UserId,
                    "OrganizationId": $scope.HospitalId,
                    "TemplateId": 0,
                    "TemplateName": $scope.Selectedtemplateobj.TemplateName || "",
                    "ChiefComplaintsArray": $scope.ChiefComplaintsArray || [],
                    "DeleteInd": "N",
                    "IsTemplateFavorites": $scope.Selectedtemplateobj.IsTemplateFavorites || false,
                    "Logs": {}
                }
                if ($scope.newChiefCompaintObj.ChiefComplaints.length > 0) {
                    angular.forEach($scope.newChiefCompaintObj.ChiefComplaints, function (newItem) {
                        if (newItem.ActiveInd === 'Y') {
                            if (count > 0) Names += '\n ';
                            Names += newItem.ChiefComplaintName;
                            count++;
                        }
                    });
                   
                     if (count>0) {
                        $scope.LogObj.LogArray.push({
                            LogId: 0,
                            ModuleId: 1,
                            ModuleName: "OUTPatient",
                            SubModuleId: 47,
                            SubModuleName: "Chief Complaints",
                            ScreenType: "Chief Complaints Template",
                            ActionType: "Added",
                            OldActionDescription: "",
                            NewActionDescription: `Template Name : ${$scope.Selectedtemplateobj.TemplateName}\n\nAdded in Template :\n${Names}`,
                            ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                        });
                    }
                }

            }
            if ($scope.CheifComplaitsSection.GridCheifComplaints == 2) {
                if ($scope.cacheStorageItem.ChiefComplaints.length == 0) {
                    alertify.error("Add At Least One Chief Complaints ");
                    return false;
                }
                if ($scope.Selectedtemplateobj.TemplateName == "") {
                    alertify.error("Please Enter Template Name ");
                    return false;
                }
                $scope.isPopoverOpen = false;
                $scope.Templatesearch.IsCreatenewTemplatesave = false;
                $scope.ChiefComplaintsArray = [];
                angular.forEach($scope.cacheStorageItem.ChiefComplaints, function (item) {
                    item.DurationDate = $filter('date')(item.DurationDate, "yyyy-MM-dd");
                    item.SlectedModifyFactors = $filter("filter")(item.ModifyFactors, { "isChecked": true }, true) || [];
                    item.SlectedQuality = $filter("filter")(item.Quality, { "isChecked": true }, true) || [];
                    item.SlectedAssosSign = $filter("filter")(item.AssosSign, { "isChecked": true }, true) || [];
                    item.SlectedContext = $filter("filter")(item.Context, { "isChecked": true }, true) || [];
                    if (item.ActiveInd == 'Y') {
                        var obj = {
                            "ActiveInd": item.ActiveInd || "Y",
                            "Duration": item.Duration || 0,
                            "SeverityId": item.SeverityId || null,
                            "DurationType": item.DurationType || "D",
                            "DurationDate": item.DurationDate || "",
                            "SlectedQuality": item.SlectedQuality || [],
                            "SlectedModifyFactors": item.SlectedModifyFactors || [],
                            "SlectedAssosSign": item.SlectedAssosSign || [],
                            "SlectedContext": item.SlectedContext || [],
                            "ModifyFactorId": item.ModifyFactorId || null,
                            "QualityId": item.QualityId || null,
                            "ContextId": item.ContextId || null,
                            "AssosSignId": item.AssosSignId || null,
                            "EyeDurationId": item.EyeDurationId || null,
                            "OrganId": item.OrganId || "",
                            "ChiefComplaintId": item.ChiefComplaintId || null,
                            "Description": item.Description || '',
                            "IsDescriptionEdit": item.IsDescriptionEdit || false,
                            "TemplateChiefComplaintId": item.TemplateChiefComplaintId || 0,
                            "ChiefComplaintCodeSystemName": item.ChiefComplaintCodeSystemName || "",
                        }
                        $scope.ChiefComplaintsArray.push(obj);
                    }

                });

                if ($scope.ChiefComplaintsArray.length > 0) {

                    angular.forEach($scope.ChiefComplaintsArray, function (item) {

                        let description = item.Description || '';

                        // Remove patient name + "presents with/for"
                        description = description.replace(
                            /^.*?\s+presents\s+with\/for\s+/i,
                            ''
                        );

                        // Remove "Pt also presents with/for"
                        description = description.replace(
                            /^Pt\s+also\s+presents\s+with\/for\s+/i,
                            ''
                        );

                        // Remove "presents with/for" if it exists alone
                        description = description.replace(
                            /^presents\s+with\/for\s+/i,
                            ''
                        );

                        item.Description = description.trim();
                    });
                }


                var param = {
                    "UserId": $scope.UserId,
                    "OrganizationId": $scope.HospitalId,
                    "TemplateId": 0,
                    "TemplateName": $scope.Selectedtemplateobj.TemplateName || "",
                    "ChiefComplaintsArray": $scope.ChiefComplaintsArray || [],
                    "DeleteInd": "N",
                    "IsTemplateFavorites": $scope.Selectedtemplateobj.IsTemplateFavorites || false,
                    "Logs": {}
                }
                if ($scope.cacheStorageItem.ChiefComplaints.length > 0) {
                    angular.forEach($scope.cacheStorageItem.ChiefComplaints, function (newItem) {
                        if (newItem.ActiveInd === 'Y') {
                            if (count > 0) Names += '\n ';
                            Names += newItem.ChiefComplaintName;
                            count++;
                        }
                    });
                    if (count > 0) {
                        $scope.LogObj.LogArray.push({
                            LogId: 0,
                            ModuleId: 1,
                            ModuleName: "OUTPatient",
                            SubModuleId: 47,
                            SubModuleName: "Chief Complaints",
                            ScreenType: "Chief Complaints Template",
                            ActionType: "Added",
                            OldActionDescription: "",
                            NewActionDescription: `Template Name : ${$scope.Selectedtemplateobj.TemplateName}\n\nAdded in Template :\n${Names}`,
                            ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                        });
                    }
                }

            }
            //if ($scope.LogObj.LogArray.length > 0) {
            //    param.Logs = $scope.LogObj || {};
            //}
            //  console.log(JSON.stringify(param));
            eHnotePatientDataService.AddUpdateUserChiefComplaintTemplateDetails(param).then(function (resp) {
                if (resp.data.Status == "Success") {
                    alertify.success("Template Added Successfully");
                    $scope.Selectedtemplateobj.TemplateName = "";
                    $scope.OverallTemplate.TemplateInd = false;
                    $scope.OverallTemplate.TemplateInd1 = false;
                    $scope.Selectedtemplateobj.IsTemplateFavorites = false;
                    // $scope.GetUserChiefComplaintTemplateDetails();
                } else if (resp.data.Status == "Failure") {
                    alertify.error(resp.data.Message);
                }

            }, function (err) {

            });
            $scope.isPopoverOpen = false;
            $scope.Templatesearch.IsCreatenewTemplatesave = false;
        }
        $scope.ChangeTemplate = function (item) {
            //  $scope.Selectedtemplateobj = item.TemplateName;
            if ($scope.CheifComplaitsSection.GridCheifComplaints == 1) {
                $scope.SelectedtempChiefComplaint = angular.copy(item.ChiefComplaintsArray) || [];
                if ($scope.newChiefCompaintObj.ChiefComplaints.length == 0) {
                    angular.forEach($scope.SelectedtempChiefComplaint, function (Citem) {
                        Citem.PatientChiefComplaintId = 0;
                    });

                    $scope.newChiefCompaintObj.ChiefComplaints = $scope.SelectedtempChiefComplaint || [];
                } else {
                    if ($scope.SelectedtempChiefComplaint.length !== 0) {
                        angular.forEach($scope.SelectedtempChiefComplaint, function (Citem) {
                            Citem.PatientChiefComplaintId = 0;

                            var List = $filter("filter")($scope.newChiefCompaintObj.ChiefComplaints, function (Aitem, index) { return Aitem.ChiefComplaintId == Citem.ChiefComplaintId && Aitem.ActiveInd == "Y" }) || [];
                            if (List.length == 0) {
                                $scope.newChiefCompaintObj.ChiefComplaints.push(Citem);
                            }
                        });

                    }
                }

                if ($scope.newChiefCompaintObj.ChiefComplaints.length > 0) {
                    angular.forEach($scope.newChiefCompaintObj.ChiefComplaints, function (item) {
                        item.IsEdit = false;
                        item.IsDescriptionEdit = false;
                    });
                    // $scope.newChiefCompaintObj.ChiefComplaints[0].IsEdit = true;
                    var List = $filter("filter")($scope.newChiefCompaintObj.ChiefComplaints, function (Aitem, index) { return Aitem.ActiveInd == "Y" }) || [];
                    if (List.length !== 0) {
                        List[0].IsEdit = true;
                    }
                }
            }
            if ($scope.CheifComplaitsSection.GridCheifComplaints == 2) {
                $scope.SelectedtempChiefComplaint = angular.copy(item.ChiefComplaintsArray) || [];
                if ($scope.cacheStorageItem.ChiefComplaints.length == 0) {
                    angular.forEach($scope.SelectedtempChiefComplaint, function (Citem) {
                        Citem.PatientChiefComplaintId = 0;
                    });

                    $scope.cacheStorageItem.ChiefComplaints = $scope.SelectedtempChiefComplaint || [];
                } else {
                    if ($scope.SelectedtempChiefComplaint.length !== 0) {
                        angular.forEach($scope.SelectedtempChiefComplaint, function (Citem) {
                            Citem.PatientChiefComplaintId = 0;

                            var List = $filter("filter")($scope.cacheStorageItem.ChiefComplaints, function (Aitem, index) { return Aitem.ChiefComplaintId == Citem.ChiefComplaintId && Aitem.ActiveInd == "Y" }) || [];
                            if (List.length == 0) {
                                $scope.cacheStorageItem.ChiefComplaints.push(Citem);
                            }
                        });

                    }
                }

                if ($scope.cacheStorageItem.ChiefComplaints.length > 0) {
                    angular.forEach($scope.cacheStorageItem.ChiefComplaints, function (item) {
                        item.IsEdit = false;
                        item.IsDescriptionEdit = false;
                    });
                    // $scope.newChiefCompaintObj.ChiefComplaints[0].IsEdit = true;
                    var List = $filter("filter")($scope.cacheStorageItem.ChiefComplaints, function (Aitem, index) { return Aitem.ActiveInd == "Y" }) || [];
                    if (List.length !== 0) {
                        List[0].IsEdit = true;
                    }
                }

            }
        }

        $scope.formatChiefComplaintFull = function (item, lists) {
            if (!item) return "";
            let code = "";
            item.ChiefComplaintCodeSystemName = item.ChiefComplaintCodeSystemName || "";
            if (item.ChiefComplaintCodeSystemName != "") {
                code = `${item.ChiefComplaintCodeSystemName} -`
            }
            let block = `${code} ${item.Description}\n`;

            // Modifying Factors
            if (item.SlectedModifyFactors?.length > 0) {
                let mf = item.SlectedModifyFactors
                  
                    .map(x => x.Description)
                    .join(", ");
                if (mf) block += `Modifying Factors : ${mf}\n`;
            }

            if (item.Modifyingnotes) {
                block += `Modifying Notes : ${item.Modifyingnotes}\n`;
            }

            // Quality
            if (item.SlectedQuality?.length > 0) {
                let q = item.SlectedQuality
                    .map(x => x.Description)
                    .join(", ");

                if (q) block += `Quality : ${q}\n`;
            }

            if (item.QualityNotes) {
                block += `Quality Notes : ${item.QualityNotes}\n`;
            }

            // Associated Signs
            if (item.SlectedAssosSign?.length > 0) {
                let as = item.SlectedAssosSign
                   
                    .map(x => x.Description)
                    .join(", ");
                if (as) block += `AssosSign : ${as}\n`;
            }

            if (item.AssocSignsNotes) {
                block += `AssocSigns Notes : ${item.AssocSignsNotes}\n`;
            }
            //context //
            if (item.SlectedContext?.length > 0) {
                let q = item.SlectedContext
                    .map(x => x.Description)
                    .join(", ");

                if (q) block += `Quality : ${q}\n`;
            }
            if (item.ContextNotes) {
                block += `Context Notes : ${item.ContextNotes}\n`;
            }
            // Duration Episode
            if (item.EyeDurationId) {
                let dur = lists.DurationList?.find(x => x.EyeDurationId == item.EyeDurationId);
                if (dur) block += `Duration Of Episode : ${dur.Duration}\n`;
            }

            // Severity
            if (item.SeverityId) {
                let sev = lists.SeverityList?.find(x => x.SeverityId == item.SeverityId);
                if (sev) block += `Severity : ${sev.SeverityName}\n`;
            }

            // Onset
            item.Duration = item.Duration || '';
            item.DurationType = item.DurationType || '';
            item.DurationDate = item.DurationDate || '';
            if (item.DurationType || item.Duration) {
                let unit = '';
                switch (item.DurationType) {
                    case 'D':
                        unit = 'Days';
                        break;
                    case 'W':
                        unit = 'Weeks';
                        break;
                    case 'M':
                        unit = 'Months';
                        break;
                    case 'Y':
                        unit = 'Years';
                        break;
                    case 'SB': 
                        unit = 'Since Birth';
                        break;
                    case 'ST':
                        unit = 'Sometimes';
                        break;
                    case 'FD':
                        unit = 'Few days';
                        break;
                    case 'TD':
                        unit = 'Today';
                        break;
                    case 'FQ':
                        unit = 'Frequently';
                        break;
                    
                }

                if (item.DurationType === 'SB') {
                    block += `, Onset: Since Birth`;
                } else if (item.DurationType == 'ST') {
                    block += `, Onset: Sometimes`;
                } else if (item.DurationType == 'FD') {
                    block += `, Onset: Few days`;
                } else if (item.DurationType == 'TD') {
                    block += `, Onset: Today`;
                } else if (item.DurationType == 'FQ') {
                    block += `, Onset: Frequently`;
                }
                else if (item.Duration != '') {
                    block += `, Onset: ${item.Duration} ${unit}`;
                }
            }
            else if (item.DurationDate!='') {
                block += `Onset : ${$filter("date")(item.DurationDate, "MM-dd-yyyy")}\n`;
            }

            return block.trim();
        };
        $scope.newChiefCompaintObj.IsClickSaveCheifComplaints = false;
        $scope.SaveCheifComplaintsData = function () {
            $scope.newChiefCompaintObj.IsClickSaveCheifComplaints = true;
            $scope.LogObj.LogArray = [];
            if ($scope.CheifComplaitsSection.GridCheifComplaints == 1) {
                var ChiefComplaintNotes = [];
                if ($scope.newChiefCompaintObj.ChiefComplaints !== undefined) {
                    if ($scope.newChiefCompaintObj.ChiefComplaints.length !== 0) {

                        if ($scope.newChiefCompaintObj.ChiefComplaints.length > 0) {
                            angular.forEach($scope.newChiefCompaintObj.ChiefComplaints, function (item) {
                                item.DurationDate = $filter('date')(item.DurationDate, "yyyy-MM-dd");
                                item.SlectedModifyFactors = $filter("filter")(item.ModifyFactors, { "isChecked": true }, true) || [];
                                item.SlectedQuality = $filter("filter")(item.Quality, { "isChecked": true }, true) || [];
                                item.SlectedAssosSign = $filter("filter")(item.AssosSign, { "isChecked": true }, true) || [];
                                item.SlectedContext = $filter("filter")(item.Context, { "isChecked": true }, true) || [];
                            });
                        }
                        ChiefComplaintNotes = ChiefComplaintNotes.concat($scope.newChiefCompaintObj.ChiefComplaints);
                    }
                }
                var CheifComplaitsobject = {
                    "VisitId": $scope.cacheStorageItem.PatientVisitId,
                    //"ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,
                    "AppointmentID": $scope.cacheStorageItem.appointmentid,
                    "OrganizationId": $scope.HospitalId,
                    "UserId": $scope.UserId,
                    "ConsultationDate": $scope.cacheStorageItem.ConsultationDate || "",
                    "ChiefComplaintNotes": ChiefComplaintNotes || [],
                    "Logs": {},
                    "HistoryOfPresentIllness": $scope.newChiefCompaintObj.HistoryOfPresentIllness || '',
                    //"SlectedModifyFactors": $scope.SlectedModifyFactors || [],
                    //"SlectedQuality": $scope.SlectedQuality || [],
                    //"SlectedAssosSign": $scope.SlectedAssosSign || [],
                    //"SlectedContext": $scope.SlectedContext || [],
                }
                if ($scope.LogObj.ChiefComplaints.length > 0) {
                    let OldActionDescription = "";
                    let NewActionDescription = "";
                    let ActionType = "";
                    let dltcount = 0;
                    let dltNames = '';
                    let lists = {
                        DurationList: $scope.GetDurationEpisodeList || [],
                        SeverityList: $scope.GetSeverityList || []
                    };
                    angular.forEach(ChiefComplaintNotes, function (newItem) {
                        let code = "";
                        newItem.ChiefComplaintCodeSystemName = newItem.ChiefComplaintCodeSystemName || "";
                        if (newItem.ChiefComplaintCodeSystemName != "") {
                            code = `${newItem.ChiefComplaintCodeSystemName} -`;
                        }
                        if (newItem.ActiveInd === 'N') {
                            if (dltcount > 0) dltNames += ', ';
                            dltNames += `${code} ${newItem.Description || ""}`;
                            dltcount++;
                        } else {
                            let oldItem = $scope.LogObj.ChiefComplaints.find(x => x.PatientChiefComplaintId === newItem.PatientChiefComplaintId && newItem.ActiveInd=='Y');

                            if (oldItem) {
                                let oldBlock = $scope.formatChiefComplaintFull(oldItem, lists);
                                let newBlock = $scope.formatChiefComplaintFull(newItem, lists);

                              
                                if (oldBlock !== newBlock) {
                                    if (OldActionDescription !== "") OldActionDescription += "\n\n";
                                    if (NewActionDescription !== "") NewActionDescription += "\n\n";

                                    OldActionDescription += oldBlock;
                                    NewActionDescription += newBlock;
                                    
                                }
                                
                            } else {
                                NewActionDescription += `${code}  ${newItem.Description || ""}`;
                                $scope.formatChiefComplaintFull(newItem, lists);    
                               
                            }
                        }
                    });
                    if (CheifComplaitsobject.HistoryOfPresentIllness != "" || $scope.LogObj.HistoryOfPresentIllness != '') {
                        if (CheifComplaitsobject.HistoryOfPresentIllness != $scope.LogObj.HistoryOfPresentIllness) {
                            if (CheifComplaitsobject.HistoryOfPresentIllness)
                                NewActionDescription += `${NewActionDescription ? '\n ' : ''}\nHPI :\n ${CheifComplaitsobject.HistoryOfPresentIllness}`;
                            if ($scope.LogObj.HistoryOfPresentIllness)
                                OldActionDescription += `${OldActionDescription ? '\n' : ''}\nHPI :\n ${$scope.LogObj.HistoryOfPresentIllness}`;
                        }
                    }
                    let newDesc = "";
                    let oldDesc = "";
                    if (OldActionDescription) {
                        oldDesc += (oldDesc ? "\n\n" : "") + "Cheif Complaints :\n" + OldActionDescription;
                    }
                    if (NewActionDescription) {
                        newDesc += (newDesc ? "\n\n" : "") + "Cheif Complaints :\n" + NewActionDescription;
                    }
                    //ActionType = "Edited";
                    if (oldDesc !== "" || newDesc !== "") {
                        let obj = {
                            "LogId": 0,
                            "ModuleId": 1,
                            "ModuleName": "OUTPatient",
                            "SubModuleId": 47,
                            "SubModuleName": "Chief Complaints",
                            "ScreenType": "Chief Complaints",
                            "ActionType": (oldDesc && oldDesc.trim())
                                ? "Edited"
                                : "Added",
                            "OldActionDescription": oldDesc,
                            "NewActionDescription": newDesc,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }
                    if (dltcount > 0) {
                        let dleDesc = "";
                        if (dltNames) {
                            dleDesc += (oldDesc ? "\n\n" : "") + "Cheif Complaints :\n" + dltNames;
                        }
                        let obj = {
                            "LogId": 0,
                            "ModuleId": 1,
                            "ModuleName": "OUTPatient",
                            "SubModuleId": 47,
                            "SubModuleName": "Chief Complaints",
                            "ScreenType": "Chief Complaints",
                            "ActionType": "Deleted",
                            "OldActionDescription": dleDesc,
                            "NewActionDescription": "",
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }
                } else if (ChiefComplaintNotes.length>0){
                    var ActionDescription = '';
                    let lists = {
                        DurationList: $scope.GetDurationEpisodeList || [],
                        SeverityList: $scope.GetSeverityList || []
                    };
                    angular.forEach(ChiefComplaintNotes, function (itemA) {
                        let newBlock = $scope.formatChiefComplaintFull(itemA, lists);
                            if (ActionDescription !== '') {
                                ActionDescription += '\n\n ';
                            }
                        ActionDescription += newBlock;
                    });
                    if (CheifComplaitsobject.HistoryOfPresentIllness != "" || $scope.LogObj.HistoryOfPresentIllness != '') {
                        if (CheifComplaitsobject.HistoryOfPresentIllness != $scope.LogObj.HistoryOfPresentIllness) {
                            if (CheifComplaitsobject.HistoryOfPresentIllness)
                                ActionDescription += `${ActionDescription ? '\n ' : ''}\nHPI : \n${CheifComplaitsobject.HistoryOfPresentIllness}`;

                        }
                    }
                    let newDesc = "";
                    if (ActionDescription) {
                        newDesc += (newDesc ? "\n\n" : "") + "Cheif Complaints :\n" + ActionDescription;
                    }
                    if (newDesc != '') {
                        let obj = {
                            "LogId": 0,
                            "ModuleId": 1,
                            "ModuleName": "OUTPatient",
                            "SubModuleId": 47,
                            "SubModuleName": "Chief Complaints",
                            "ScreenType": "Chief Complaints",
                            "ActionType": "Added",
                            "OldActionDescription": "",
                            "NewActionDescription": newDesc,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }
                }

                if ($scope.LogObj.LogArray.length > 0) {
                    CheifComplaitsobject.Logs = $scope.LogObj || {};
                }
                eHnoteDiagnosisDataServices.AddUpdateChiefComplaints(CheifComplaitsobject).then(function (resp) {
                    if (resp.data.Status === 'Success') {

                        //var consultationid = $scope.cacheStorageItem.ConsultationID ;
                        //var AppointmentID = $scope.cacheStorageItem.appointmentid;
                        //var type = 0;
                        //if (consultationid === 0) {
                        //    type = 1;
                        //}
                        //var object = {
                        //    "VisitId": $scope.cacheStorageItem.PatientVisitId,
                        //   /* "AppointmentId": AppointmentID,*/
                        //    "Type": type
                        //};
                        //eHnotePatientDataService.GetPatientConsultationDetailsByApptId(object).then(function (resp) {
                        //    if (resp.data !== undefined) {
                        //        $scope.treatmentData = resp.data;
                        //        $scope.SelectedPlanArray = [];
                        //        $scope.SelectedPlanArray = $filter("filter")($scope.treatmentData, { "AppointmentId": AppointmentID }, true);
                        //        if ($scope.SelectedPlanArray[0].ChiefComplaints !== undefined) {
                        //            if ($scope.SelectedPlanArray[0].ChiefComplaints.length !== 0) {

                        //                $scope.newChiefCompaintObj.ChiefComplaints = [];
                        //                $scope.newChiefCompaintObj.ChiefComplaints = $scope.SelectedPlanArray[0].ChiefComplaints;
                        //                $scope.LogObj.ChiefComplaints = $scope.SelectedPlanArray[0].ChiefComplaints || [];
                        //                //$scope.SelectedPlanArray[0].ChiefComplaints.forEach(function (Citem) {
                        //                //    $scope.newChiefCompaintObj.ChiefComplaints.push(Citem);
                        //                //});
                        //            }
                        //            else {
                        //                $scope.newChiefCompaintObj.ChiefComplaints= [];
                        //            }
                        //        } else {
                        //            $scope.newChiefCompaintObj.ChiefComplaints = [];
                        //        }
                        //        $uibModalInstance.close($scope.newChiefCompaintObj);
                        //    }

                        //}, function (err) {
                        //    alertify.error(err.data.ExceptionMessage);
                        //});
                        $scope.newChiefCompaintObj.IsClickSaveCheifComplaints = false;
                        $uibModalInstance.close(resp.data.ChiefComplaints);

                    }
                    $scope.newChiefCompaintObj.IsClickSaveCheifComplaints = false;
                });

                /*      $uibModalInstance.close($scope.newChiefCompaintObj);*/
            }
            if ($scope.CheifComplaitsSection.GridCheifComplaints == 2) {
                var ChiefComplaintNotes = [];
                $scope.newChiefCompaintObjj.ChiefComplaints = $scope.cacheStorageItem.ChiefComplaints || [];
                if ($scope.cacheStorageItem.ChiefComplaints !== undefined) {
                    if ($scope.cacheStorageItem.ChiefComplaints.length !== 0) {
                        if ($scope.cacheStorageItem.ChiefComplaints.length > 0) {
                            angular.forEach($scope.cacheStorageItem.ChiefComplaints, function (item) {
                                item.DurationDate = $filter('date')(item.DurationDate, "yyyy-MM-dd");
                                item.SlectedModifyFactors = $filter("filter")(item.ModifyFactors, { "isChecked": true }, true) || [];
                                item.SlectedQuality = $filter("filter")(item.Quality, { "isChecked": true }, true) || [];
                                item.SlectedAssosSign = $filter("filter")(item.AssosSign, { "isChecked": true }, true) || [];
                                item.SlectedContext = $filter("filter")(item.Context, { "isChecked": true }, true) || [];
                            });
                        }
                        ChiefComplaintNotes = ChiefComplaintNotes.concat($scope.cacheStorageItem.ChiefComplaints);
                    }
                }
                var CheifComplaitsobject = {
                    "VisitId": $scope.cacheStorageItem.PatientVisitId,
                    //"ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,
                    "AppointmentID": $scope.cacheStorageItem.appointmentid,
                    "OrganizationId": $scope.HospitalId,
                    "UserId": $scope.UserId,
                    "ConsultationDate": $scope.cacheStorageItem.ConsultationDate || "",
                    "ChiefComplaintNotes": ChiefComplaintNotes || [],
                    "Logs": {},
                    "HistoryOfPresentIllness": $scope.newChiefCompaintObj.HistoryOfPresentIllness || '',
                }

                if ($scope.LogObj.ChiefComplaints.length > 0) {

                    let OldActionDescription = "";
                    let NewActionDescription = "";
                    let ActionType = "";
                    let dltcount = 0;
                    let dltNames = '';
                    let lists = {
                        DurationList: $scope.GetDurationEpisodeList || [],
                        SeverityList: $scope.GetSeverityList || []
                    };
                    angular.forEach(ChiefComplaintNotes, function (newItem) {
                        if (newItem.ActiveInd === 'N') {
                            if (dltcount > 0) dltNames += ', ';
                            dltNames += `${newItem.ChiefComplaintCodeSystemName} - ${newItem.Description || ""}`;
                            dltcount++;
                        } else {

                            let oldItem = $scope.LogObj.ChiefComplaints.find(x => x.PatientChiefComplaintId === newItem.PatientChiefComplaintId && newItem.ActiveInd=='Y');

                            if (oldItem) {
                                let oldBlock = $scope.formatChiefComplaintFull(oldItem, lists);
                                let newBlock = $scope.formatChiefComplaintFull(newItem, lists);
                                if (oldBlock !== newBlock) {
                                    if (OldActionDescription !== "") OldActionDescription += "\n\n";
                                    if (NewActionDescription !== "") NewActionDescription += "\n\n";

                                    OldActionDescription += oldBlock;
                                    NewActionDescription += newBlock;
                                    
                                }
                              
                            } else {
                                NewActionDescription += `${newItem.ChiefComplaintCodeSystemName} - ${newItem.Description || ""}`;
                                $scope.formatChiefComplaintFull(newItem, lists);
                                
                            }

                        }
                    });
                    if (CheifComplaitsobject.HistoryOfPresentIllness != "" || $scope.LogObj.HistoryOfPresentIllness != '') {
                        if (CheifComplaitsobject.HistoryOfPresentIllness != $scope.LogObj.HistoryOfPresentIllness) {
                            if (CheifComplaitsobject.HistoryOfPresentIllness)
                                NewActionDescription += `${NewActionDescription ? '\n ' : ''}\nHPI : ${CheifComplaitsobject.HistoryOfPresentIllness}`;
                            if ($scope.LogObj.HistoryOfPresentIllness)
                                OldActionDescription += `${OldActionDescription ? '\n' : ''}\nHPI : ${$scope.LogObj.HistoryOfPresentIllness}`;
                        }
                    }
                    //ActionType = "Edited";
                    let newDesc = "";
                    let oldDesc = "";
                    if (OldActionDescription) {
                        oldDesc += (oldDesc ? "\n\n" : "") + "Cheif Complaints :\n" + OldActionDescription;
                    }
                    if (NewActionDescription) {
                        newDesc += (newDesc ? "\n\n" : "") + "Cheif Complaints :\n" + NewActionDescription;
                    }
                    if (oldDesc !== "" || newDesc !== "") {
                        let obj = {
                            "LogId": 0,
                            "ModuleId": 1,
                            "ModuleName": "OUTPatient",
                            "SubModuleId": 47,
                            "SubModuleName": "Chief Complaints",
                            "ScreenType": "Chief Complaints",
                            "ActionType": (oldDesc && oldDesc.trim())
                                ? "Edited"
                                : "Added",
                            "OldActionDescription": oldDesc,
                            "NewActionDescription": newDesc,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }
                    if (dltcount > 0) {
                        let dleDesc = "";
                        if (dltNames) {
                            dleDesc += (oldDesc ? "\n\n" : "") + "Cheif Complaints :\n" + dltNames;
                        }
                        let obj = {
                            "LogId": 0,
                            "ModuleId": 1,
                            "ModuleName": "OUTPatient",
                            "SubModuleId": 47,
                            "SubModuleName": "Chief Complaints",
                            "ScreenType": "Chief Complaints",
                            "ActionType": "Deleted",
                            "OldActionDescription": dleDesc,
                            "NewActionDescription":"",
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }


                } else if (ChiefComplaintNotes.length > 0) {
                    var ActionDescription = '';
                    let lists = {
                        DurationList: $scope.GetDurationEpisodeList || [],
                        SeverityList: $scope.GetSeverityList || []
                    };
                    angular.forEach(ChiefComplaintNotes, function (itemA) {
                        let newBlock = $scope.formatChiefComplaintFull(itemA, lists);
                        if (ActionDescription !== '') {
                            ActionDescription += '\n ';
                        }
                        ActionDescription += newBlock;

                    });
                    if (CheifComplaitsobject.HistoryOfPresentIllness != "" || $scope.LogObj.HistoryOfPresentIllness != '') {
                        if (CheifComplaitsobject.HistoryOfPresentIllness != $scope.LogObj.HistoryOfPresentIllness) {
                            if (CheifComplaitsobject.HistoryOfPresentIllness)
                                ActionDescription += `${ActionDescription ? '\n ' : ''}\nHPI : ${CheifComplaitsobject.HistoryOfPresentIllness}`;
                            
                        }
                    }
                    let newDesc = "";
                    if (ActionDescription) {
                        newDesc += (newDesc ? "\n\n" : "") + "Cheif Complaints :\n" + ActionDescription;
                    }
                    if (newDesc != '') {
                        let obj = {
                            "LogId": 0,
                            "ModuleId": 1,
                            "ModuleName": "OUTPatient",
                            "SubModuleId": 47,
                            "SubModuleName": "Chief Complaints",
                            "ScreenType": "Chief Complaints",
                            "ActionType": "Added",
                            "OldActionDescription": "",
                            "NewActionDescription": newDesc,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }
                }

                if ($scope.LogObj.LogArray.length > 0) {
                    CheifComplaitsobject.Logs = $scope.LogObj || {};
                }
                eHnoteDiagnosisDataServices.AddUpdateChiefComplaints(CheifComplaitsobject).then(function (resp) {
                    if (resp.data.Status === 'Success') {

                        //var consultationid = $scope.cacheStorageItem.ConsultationID;
                        //var AppointmentID = $scope.cacheStorageItem.appointmentid;
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
                        //        if ($scope.SelectedPlanArray[0].ChiefComplaints !== undefined) {
                        //            if ($scope.SelectedPlanArray[0].ChiefComplaints.length !== 0) {

                        //                $scope.newChiefCompaintObjj.ChiefComplaints = [];
                        //                $scope.newChiefCompaintObjj.ChiefComplaints = $scope.SelectedPlanArray[0].ChiefComplaints;
                        //            }
                        //            else {
                        //                $scope.newChiefCompaintObj.ChiefComplaints = [];
                        //            }
                        //        } else {
                        //            $scope.newChiefCompaintObj.ChiefComplaints = [];
                        //        }
                        //        $uibModalInstance.close($scope.newChiefCompaintObjj);
                        //    }

                        //}, function (err) {
                        //    alertify.error(err.data.ExceptionMessage);
                        //});
                        $scope.newChiefCompaintObj.IsClickSaveCheifComplaints = false;
                        $uibModalInstance.close(resp.data.ChiefComplaints);
                    }
                    $scope.newChiefCompaintObj.IsClickSaveCheifComplaints = false;
                });
                /* $uibModalInstance.close($scope.newChiefCompaintObjj);*/
            }
        }


        $scope.DeleteCheifComplaints = function (obs) {
            if ($scope.CheifComplaitsSection.GridCheifComplaints == 1) {


                var index = $scope.newChiefCompaintObj.ChiefComplaints.indexOf(obs);
                if (index > -1) {
                    if (obs.PatientChiefComplaintId !== 0) {
                        $scope.newChiefCompaintObj.ChiefComplaints[index].ActiveInd = "N";
                    } else {
                        $scope.newChiefCompaintObj.ChiefComplaints.splice(index, 1);
                    }

                }
                $scope.cacheStorageItem.ChiefComplaints = angular.copy($scope.newChiefCompaintObj.ChiefComplaints);
                //$scope.ChangedHPIDiscription($scope.cacheStorageItem.ChiefComplaints);
                $scope.ChangeIndividualHPIDiscription($scope.cacheStorageItem.ChiefComplaints);
            }
            if ($scope.CheifComplaitsSection.GridCheifComplaints == 2) {
                var index = $scope.cacheStorageItem.ChiefComplaints.indexOf(obs);
                if (index > -1) {
                    if (obs.PatientChiefComplaintId !== 0) {
                        $scope.cacheStorageItem.ChiefComplaints[index].ActiveInd = "N";
                    } else {
                        $scope.cacheStorageItem.ChiefComplaints.splice(index, 1);
                    }
                }
                $scope.newChiefCompaintObj.ChiefComplaints = angular.copy($scope.cacheStorageItem.ChiefComplaints);
                //$scope.ChangedHPIDiscription($scope.newChiefCompaintObj.ChiefComplaints);
                $scope.ChangeIndividualHPIDiscription($scope.newChiefCompaintObj.ChiefComplaints);

                //  $scope.AddToCache();
            }

            //if (obs.PatientChiefComplaintId === 0) {
            //    if (index > -1) {
            //        $scope.cacheStorageItem.ChiefComplaints.splice(index, 1);
            //    }
            //} else {
            //    $scope.cacheStorageItem.ChiefComplaints[index].ActiveInd = 'N';
            //}
            $scope.newChiefCompaintObj.ChiefComplaints = $scope.newChiefCompaintObj.ChiefComplaints || [];
            if ($scope.newChiefCompaintObj.ChiefComplaints.length > 0) {
                $scope.newChiefCompaintObj.ChiefComplaints[0].IsEdit = true;
            }

        };

        $scope.Changevalue = function (item,Type) {
            if (Type =='Modifying') {
                item.ModifyFactorId = null;

            }
            if (Type == 'Quality') {
                item.QualityId = null;

            }
            if (Type == 'AssocSign') {
                item.AssosSignId = null;

            }
            if (Type == 'Context') {
                item.ContextId = null;

            }
            item.IsDescriptionEdit = false;
        }
        $scope.changeChiefComplaintGrid = function (item, Type, mainitem) {

            Type = Type || '';
            mainitem = mainitem || '';

            // Multiple selection
            if (Type == 'Modifying') {
                item.isChecked = !item.isChecked;
            }

            if (Type == 'Quality') {
                item.isChecked = !item.isChecked;
            }

            if (Type == 'AssocSign') {
                item.isChecked = !item.isChecked;
            }

            if (Type == 'Context') {
                item.isChecked = !item.isChecked;
            }

            // Location - Single selection
            if (Type == 'Location') {

                if (mainitem.OrganId == item.OrganId) {
                    // Click selected location again -> unselect
                    mainitem.OrganId = null;
                }
                else {
                    // Select location
                    mainitem.OrganId = item.OrganId;
                }
            }

            // Eye Duration - Single selection
            if (Type == 'EyeDuration') {

                if (mainitem.EyeDurationId == item.EyeDurationId) {
                    // Click selected duration again -> unselect
                    mainitem.EyeDurationId = null;
                }
                else {
                    // Select duration
                    mainitem.EyeDurationId = item.EyeDurationId;
                }
            }

            // Severity - Single selection
            if (Type == 'Severity') {

                if (mainitem.SeverityId == item.SeverityId) {
                    // Click selected severity again -> unselect
                    mainitem.SeverityId = null;
                }
                else {
                    // Select severity
                    mainitem.SeverityId = item.SeverityId;
                }
            }

            // Description edit
            if (mainitem != '') {
                item.IsDescriptionEdit = false;
                mainitem.IsDescriptionEdit = false;
            }
            else {
                item.IsDescriptionEdit = false;
            }
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

            if (SelectedEye === 5 || SelectedEye === "5") {
                return "Hair";
            }
            if (SelectedEye === 6 || SelectedEye === "6") {
                return "Skin";
            }
            if (SelectedEye === 7 || SelectedEye === "7") {
                return "Laser";
            }
        }
        $scope.AddNewComplaints = function (selectcompliant) {
            selectcompliant = selectcompliant || "";
            if (selectcompliant === "") {
                alertify.error("Enter Complaints");
                return;
            }
            var object = {
                "ParentHospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "UserId": $scope.UserId,
                "ActiveInd": 'Y',
                "ScreenType": $scope.masterComplaintsLevelType,
                "OrganId":4,
                "OrganName": GetEyeName(4),
                "ChiefComplaintId": 0,
                "ChiefComplaintName": selectcompliant
            };

            eHnoteSettingsDataService.AddUpdateMasterChiefComplaint(object).success(function (response) {
                if (response.status === 'Success') {
                    if (response.ChiefComplaint.length > 0) {
                        $scope.selectcompliant = "";
                        selectcompliant = "";

                        //addNewItemToCache('ComplaintsList', 'masterChiefComplaintsArray', response.ChiefComplaint[0]);
                        //  $scope.obj.AddComplaints = false;

                        if ($scope.CheifComplaitsSection.GridCheifComplaints == 2) {
                            $scope.ComplaintsBlurChangenew(response.ChiefComplaint[0])
                            $scope.newChiefCompaintObjj.AddComplaints = false;
                        } else {
                            $scope.ComplaintsBlurChange(response.ChiefComplaint[0]);
                            $scope.newChiefCompaintObj.AddComplaints = false;
                        }

                        alertify.success("Successfully Added");
                    }
                }
                if (response.status === 'Failure') {
                    if (response.Message === 'Already Exists') {
                        alertify.error("Complaint Name already exist");
                        $scope.selectcompliant = "";
                    }
                }
            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });
        };


        $scope.ClearchiefComplaint = function (item) {
            item.OrganId = "";
            item.EyeDurationId = "";
            item.SeverityId = "";
            item.Duration = "";
            item.DurationType = "D";
            item.DurationDate = "";
            item.ContextId = "";
            item.QualityId = "";
            item.ModifyFactorId = "";
            item.AssosSignId = "";
            item.Modifyingnotes = "";
            item.QualityNotes = "";
            item.AssocSignsNotes = "";
            item.ContextNotes = "";
            if (item.ModifyFactors.length > 0) {
                angular.forEach(item.ModifyFactors, function (item) {
                    item.isChecked = false;
                });
            }
            if (item.Quality.length > 0) {
                angular.forEach(item.Quality, function (item) {
                    item.isChecked = false;
                });
            }
            if (item.Context.length > 0) {
                angular.forEach(item.Context, function (item) {
                    item.isChecked = false;
                });
            }
            if (item.AssosSign.length > 0) {
                angular.forEach(item.AssosSign, function (item) {
                    item.isChecked = false;
                });
            }
        }
        $scope.changefocusOption = function () {
            $scope.newChiefCompaintObj.ComplaintsFocus = false;
        }
        $scope.GetComplaintsonFocus = function () {
            $scope.newChiefCompaintObj.ComplaintsFocus = true;
            $scope.sectionCollapse = true;
        }

        //$scope.ChangeFormatDate = function (item) {
        //    item.Duration = "";
        //    item.DurationType = "";
        //};
        $scope.ChangeTimingsDuration = function (item) {
            if (item.DurationType === "SB" || item.DurationType === "FD"|| item.DurationType === "ST"|| item.DurationType === "A"|| item.DurationType === "FQ") {
                item.Duration = "";
            }
            if (item.DurationType === "TD") {
                // item.Duration = $filter("date")(new Date(), "MM-DD-YYYY");
                //item.Duration = moment().format("MM-DD-YYYY");
                item.Duration = "";
            }
        }


        $scope.cacheStorageItem.ChiefComplaints = $scope.cacheStorageItem.ChiefComplaints || [];
        $scope.newChiefCompaintObjj = {
            "SelectedEye": '',
            "SeverityId": null,
            "SeverityName": '',
            "ChiefComplaintId": "",
            "ChiefComplaints": [],
            "ChiefComplaintName": "",
            "ChiefComplaintObj": "",
            "AddComplaints": false
        };
        $scope.Accordionobj = {
            "IsShowChiefComplaintsData": false,
            "IsShowROSData": false,
            "IsShowVisionPerceptionData": false,
            "IsShowContactLensData": false,
            "IsShowExaminationData": false,
            "IsShowAssessmentData": false,
            "IsShowOrdersData": false,
            "IsShowMedicalRXData": false,
            "IsShowGlassRXData": false,
            "IsShowProceduresData": false,
            "IsShowSuperBillData": false,
        }
        $scope.ChangeFocus = function (mainitem) {
            angular.forEach($scope.cacheStorageItem.ChiefComplaints, function (item) {
                item.IsEdit = false;
            })
            mainitem.IsEdit = true;
        }
        $scope.ComplaintsBlurChangenew = function (selectcompliant) {

            if (selectcompliant.ChiefComplaintId === '') {
                selectcompliant.ChiefComplaintName = '';
                $scope.newChiefCompaintObjj.ChiefComplaintObj = "";
                return false;
            }
            $scope.newChiefCompaintObjj.ChiefComplaintObj = selectcompliant;
            var i = 0;
            $scope.DisplayDate = $filter('date')(new Date(), "dd-MMM-yyyy HH:mm:ss");
            $scope.newChiefCompaintObjj.ChiefComplaintObj = $scope.newChiefCompaintObjj.ChiefComplaintObj || "";
            if ($scope.newChiefCompaintObjj.ChiefComplaintObj === "") {
                return;
            }
            if (angular.isObject($scope.newChiefCompaintObjj.ChiefComplaintObj)) {
                var object = {
                    "IsEdit": false,
                    "showCheifInstructions": false,
                    "ActiveInd": 'Y',
                    "Duration": 0,
                    "SeverityId": $scope.newChiefCompaintObjj.SeverityId || null,
                    "SeverityName": $scope.newChiefCompaintObjj.SeverityName || '',
                    "DurationType": 'D',
                    "ModifyFactors": $scope.newChiefCompaintObjj.ChiefComplaintObj.ModifyFactors || [],
                    "Quality": $scope.newChiefCompaintObjj.ChiefComplaintObj.Quality || [],
                    "Context": $scope.newChiefCompaintObjj.ChiefComplaintObj.Context || [],
                    "AssosSign": $scope.newChiefCompaintObjj.ChiefComplaintObj.AssosSign || [],
                    "ModifyFactorId": null,
                    "QualityId": null,
                    "ContextId": null,
                    "AssosSignId": null,
                    "EyeDurationId": null,
                    "OrganId": $scope.newChiefCompaintObjj.SelectedEye,
                    "ChiefComplaintId": $scope.newChiefCompaintObjj.ChiefComplaintObj.ChiefComplaintId,
                    "ChiefComplaintName": $scope.newChiefCompaintObjj.ChiefComplaintObj.ChiefComplaintName,
                    "ChiefComplaintType": "",
                    "ChiefComplaintCode": "",
                    "ChiefComplaintCodeSystem":"",
                    "ChiefComplaintCodeSystemName":"Custom",
                    "PatientChiefComplaintId": 0,
                    "Description": $scope.newChiefCompaintObjj.ChiefComplaintObj.ChiefComplaintName || "",
                    "IsDescriptionEdit": false,
                    "Remarks": ""
                };
            } else {
                object = {
                    "IsEdit": false,
                    "showCheifInstructions": false,
                    "ActiveInd": 'Y',
                    "OrganId": $scope.newChiefCompaintObjj.SelectedEye,
                    "Duration": 0,
                    "SeverityId": $scope.newChiefCompaintObjj.SeverityId || null,
                    "SeverityName": $scope.newChiefCompaintObjj.SeverityName || '',
                    "DurationType": 'D',
                    "ModifyFactors": $scope.newChiefCompaintObjj.ChiefComplaintObj.ModifyFactors || [],
                    "Quality": $scope.newChiefCompaintObjj.ChiefComplaintObj.Quality || [],
                    "Context": $scope.newChiefCompaintObjj.ChiefComplaintObj.Context || [],
                    "AssosSign": $scope.newChiefCompaintObjj.ChiefComplaintObj.AssosSign || [],
                    "ModifyFactorId": null,
                    "QualityId": null,
                    "ContextId": null,
                    "AssosSignId": null,
                    "EyeDurationId": null,
                    "ChiefComplaintId": $scope.newChiefCompaintObjj.ChiefComplaintObj,
                    "ChiefComplaintName": $scope.newChiefCompaintObjj.ChiefComplaintObj,
                    "PatientChiefComplaintId": 0,
                    "ChiefComplaintType": "",
                    "ChiefComplaintCode": "",
                    "ChiefComplaintCodeSystem":"",
                    "ChiefComplaintCodeSystemName": "Custom",
                    "Description": "",
                    "IsDescriptionEdit": false,
                    "Remarks": ""
                };
            }
            $scope.cacheStorageItem.ChiefComplaints = $scope.cacheStorageItem.ChiefComplaints || [];
            var data = $scope.newChiefCompaintObjj.ChiefComplaintObj.ChiefComplaintName ? $scope.newChiefCompaintObjj.ChiefComplaintObj.ChiefComplaintName : $scope.newChiefCompaintObjj.ChiefComplaintObj;

            var List = $filter("filter")($scope.cacheStorageItem.ChiefComplaints, function (item) {
                return (item.ChiefComplaintName === data && item.ActiveInd === 'Y');
            });
            if (List.length > 0) {
                alertify.error('You have already entered this chief complaint');
                $scope.newChiefCompaintObjj.ChiefComplaintObj = "";
                return;
            }


            if ($scope.cacheStorageItem.ChiefComplaints.length !== 0) {
                angular.forEach($scope.cacheStorageItem.ChiefComplaints, function (item) {
                    item.IsEdit = false;
                });
            }
            //object.IsEdit = false;
            if (i === 0) {
                object.IsEdit = true;
                $scope.cacheStorageItem.ChiefComplaints.push(object);
            }
            $scope.ChangedHPIDiscription($scope.cacheStorageItem.ChiefComplaints);
            $scope.newChiefCompaintObjj.ChiefComplaintObj = "";
            $scope.newChiefCompaintObjj.SelectedEye = '';
            $scope.newChiefCompaintObjj.SeverityId = null;
            $scope.newChiefCompaintObjj.SeverityName = '';
            /*$scope.AddToCache();*/
        };
        $scope.getNewComplaints = function (val) {
            var object = {
                "ParentHospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "SearchText": val,
                "PageSize": 10,
                "PageNumber": 1,
                "ChiefComplaintId": 0,
                "IsFrequent": 'N'

            };
            if (object.SearchText == '') {
                object.IsFrequent = 'Y';
            }
            return eHnoteSettingsDataService.GetMasterChiefComplaintConditionsUS(object).then(function (resp) {
                if (resp.data.count !== 0) {
                    if (resp.data.ChiefComplaint !== undefined) {
                        $scope.newChiefCompaintObjj.AddComplaints = false;
                        return resp.data.ChiefComplaint.map(function (item) {
                            return item;
                        });
                    } else {
                        //$scope.obj.AddComplaints = true;
                        $scope.newChiefCompaintObjj.AddComplaints = true;
                    }
                } else {
                    //$scope.obj.AddComplaints = true;
                    $scope.newChiefCompaintObjj.AddComplaints = true;
                }
            });

        };
        $scope.changeChiefComplaint = function (item) {
            item.IsDescriptionEdit = true;
            item.AssosSignId = null;
            item.ContextId = null;
            item.EyeDurationId = null;
            item.ModifyFactorId = null;
            item.OrganId = null;
            item.QualityId = null;
            item.SeverityId = null;
            item.Duration = '';
            $scope.ChangedHPIDiscription($scope.cacheStorageItem.ChiefComplaints)

        }
        //angular.forEach($scope.cacheStorageItem.ChiefComplaints, function (item) {

        //    if (item.PatientChiefComplaintId === $scope.selecteditem) {
        //        item.IsSelected = true;
        //    } else {
        //        item.IsSelected = false;
        //    }
        //});
        $scope.OverallTemplate = {
            "TemplateInd": false,
            "TemplateInd1": false
        }
        $scope.OverallDiagnosisTemplateSave = function () {
            $scope.OverallTemplate.TemplateInd = !$scope.OverallTemplate.TemplateInd;
        }

        $scope.OverallDiagnosisTemplateSave1 = function () {
            $scope.OverallTemplate.TemplateInd1 = !$scope.OverallTemplate.TemplateInd1;
        }

        $scope.clickcreatetemplateover = {
            templateUrl: 'createtemplatechiefcomplaints.html',
        };


        $scope.clicktemplateschiefcomplaints = function (type) {
            type = type || "";
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/templateschiefcomplaints.html",
                //"size": "lg",
                //"backdrop": "static",
                "keyboard": false,
                //"scope": $scope,
                "resolve": {
                    "ChiefComplaintTemplatesArray": function () { return $scope.ChiefComplaintTemplatesArray },
                    "CheifComplaitsSection": function () { return $scope.CheifComplaitsSection },
                    "SelectedtempChiefComplaint": function () { return $scope.SelectedtempChiefComplaint },
                    "Tempcheifcomplent": function () { return $scope.cacheStorageItem.ChiefComplaints },
                    "NewTempcheifcomplent": function () { return $scope.newChiefCompaintObj.ChiefComplaints },
                    "type": function () { return type },
                    //"ChangedHPIDiscription": function () { return $scope.ChangedHPIDiscription },
                    "ChangeIndividualHPIDiscription": function () { return $scope.ChangeIndividualHPIDiscription },
                    "LogObj": function () { return $scope.LogObj }

                    /* $scope.ChiefComplaintTemplatesArray*/
                },

                /*  "windowClass": "templateschiefcomplaints overflow-hidden",*/

                "windowClass": "offcanves-right modal__width--80 templates-modal",
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteMasterDataService, CheifComplaitsSection, SelectedtempChiefComplaint, Tempcheifcomplent, NewTempcheifcomplent, type, ChangeIndividualHPIDiscription, LogObj) {
                    var Tempcheifcomplent = Tempcheifcomplent || [];
                    var NewTempcheifcomplent = NewTempcheifcomplent || [];
                    var SelectedtempChiefComplaint = SelectedtempChiefComplaint || [];
                    var CheifComplaitsSection = CheifComplaitsSection || [];
                    $scope.type = type || "";
                    $scope.LogObj = LogObj || "";

                    var doctorinfo = eHnoteMasterDataService.getUserInfo();
                    $scope.AddAuditLogNew = function (selectedItem) {
                        $scope.LogObj.LogArray = [];
                        let SubModuleName = selectedItem.SubModuleName || "";
                        let SubModuleId = selectedItem.SubModuleId || 0;
                        let ScreenType = selectedItem.ScreenType || "Examination";
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

                    $scope.GetUserChiefComplaintTemplateDetails = function (index) {
                        var obj = {
                            "UserId": doctorinfo.doctorid,
                            "SearchText": "",
                            "PageSize": 10,
                            "PageNumber": 1,
                            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                            "IsFavoriteInd": 0
                        }
                        eHnotePatientDataService.GetUserChiefComplaintTemplateDetails(obj).then(function (resp) {
                            console.log(resp);
                            if (resp.data.status == "Success") {
                                $scope.ChiefComplaintTemplatesArray = resp.data.rows || [];
                                if ($scope.ChiefComplaintTemplatesArray.length > 0) {
                                    $scope.CopyChiefComplaintTemplatesArray = angular.copy($scope.ChiefComplaintTemplatesArray) || [];
                                    angular.forEach($scope.ChiefComplaintTemplatesArray, function (mitem) {
                                        mitem.IsEdit = false;
                                        mitem.selectedTemplateCheckbox = false;
                                        //item.IsDescriptionEdit = false;

                                    });
                                    if (index == undefined) {
                                        $scope.ChiefComplaintTemplatesArray[0].IsEdit = true;
                                    } else {
                                        $scope.ChiefComplaintTemplatesArray[index].IsEdit = true;
                                    }

                                    //}
                                    $scope.LogObj.ChiefComplaintTemplatesArray = $scope.ChiefComplaintTemplatesArray || [];
                                } else {
                                    $scope.LogObj.ChiefComplaintTemplatesArray = [];
                                }


                            }
                        }, function (err) {

                        });
                    }
                    $scope.GetUserChiefComplaintTemplateDetails();
                    $scope.DeleteChiefcomplaintTemplate = function (item) {
                        $scope.LogObj.LogArray = [];
                        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete this template  ?", function () {
                            var params = {
                                "UserId": $scope.doctorid,
                                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                                "TemplateId": item.TemplateId,
                                "TemplateName": item.TemplateName,
                                "ChiefComplaintsArray": [],
                                "DeleteInd": "Y",
                                "IsTemplateFavorites": false,
                                "Logs": {},
                            }
                            if (params.DeleteInd == 'Y') {
                                let logObj = {
                                    "LogId": 0,
                                    "ModuleId": 2,
                                    "ModuleName": "OUT PATIENT",
                                    "SubModuleId": 47,
                                    "SubModuleName": "Chief Complaints",
                                    "ScreenType": "Templates",
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
                            eHnotePatientDataService.AddUpdateUserChiefComplaintTemplateDetails(params).then(function (resp) {
                                $scope.GetUserChiefComplaintTemplateDetails();
                                if (resp.data != undefined && resp.data != "") {
                                    alertify.success("Delete successfully");
                                    // $scope.GetUserChiefComplaintTemplateDetails();
                                };
                                $scope.ExamAnteriorPosteriorObject.ViewAutoPlansDtls = false;
                            }, function (err) {

                            });
                        }, function () {
                            r = "You pressed Cancel!";
                        });

                    };
                    //  $scope.GetUserChiefComplaintTemplateDetails();
                    $scope.NewAddFaviroteChiefcomplainttemplate = function (item) {
                        $scope.LogObj.LogArray = [];
                        item.IsTemplateFavorites = !item.IsTemplateFavorites || false;
                        var params = {
                            "UserId": doctorinfo.doctorid,
                            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                            "TemplateId": item.TemplateId,
                            "TemplateName": item.TemplateName,
                            "ChiefComplaintsArray": item.ChiefComplaintsArray,
                            "DeleteInd": 'N',
                            "IsTemplateFavorites": item.IsTemplateFavorites || false,
                            "Logs": {},

                        }
                        let Favourite = '';
                        let newvalue = '';
                        let Oldvalue = '';
                        if (item.IsTemplateFavorites) {
                            Favourite = `${item.TemplateName} - is favourite.`;
                            newvalue = Favourite;
                            let logObj = {
                                "LogId": 0,
                                "ModuleId": 2,
                                "ModuleName": "OUT PATIENT",
                                "SubModuleId": 47,
                                "SubModuleName": "Chief Complaints",
                                "ScreenType": "Templates",
                                "ActionType": "Added",
                                "OldActionDescription": Oldvalue,
                                "NewActionDescription": newvalue,
                                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                            };
                            $scope.LogObj.LogArray.push(logObj);
                        } else if (!item.IsTemplateFavorites) {
                            if ($scope.LogObj.ChiefComplaintTemplatesArray.length > 0) {
                                angular.forEach($scope.LogObj.ChiefComplaintTemplatesArray, function (kitem) {
                                    if (kitem.TemplateId === item.TemplateId) {
                                        Oldvalue = `${item.TemplateName} -  is  favourite.`;
                                    }
                                });
                            }
                            newvalue = `${item.TemplateName} - is  unfavourite.`;
                            if (Oldvalue !== '' && newvalue !== '') {
                                let logObj = {
                                    "LogId": 0,
                                    "ModuleId": 2,
                                    "ModuleName": "OUT PATIENT",
                                    "SubModuleId": 47,
                                    "SubModuleName": "Chief Complaints",
                                    "ScreenType": "Templates",
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
                        eHnotePatientDataService.AddUpdateUserChiefComplaintTemplateDetails(params).then(function (resp) {

                            if (resp.data != undefined && resp.data != "") {
                                if (item.IsTemplateFavorites) {
                                    alertify.success('Add Favorite Template Successfully');
                                } else {
                                    alertify.success('Remove Favorite Template Successfully');
                                }
                                $scope.GetUserChiefComplaintTemplateDetails();
                            };
                        }, function (err) {

                        });
                    };

                    //angular.forEach($scope.ChiefComplaintTemplatesArray, function (Ditem) {
                    //    Ditem.selectedTemplateCheckbox = false;
                    //});

                    $scope.ChangeTemplate = function (item) {
                        if ($scope.ChiefComplaintTemplatesArray.length > 0) {
                            angular.forEach($scope.ChiefComplaintTemplatesArray, function (mitem) {
                                mitem.IsEdit = false;
                                //item.IsDescriptionEdit = false;
                            });
                        }
                        item.IsEdit = true;
                    }
                    /*  $scope.ChiefComplaintTemplatesArray = ChiefComplaintTemplatesArray || [];*/

                    $scope.ChangeTemplatecheck = function (item) {
                        $scope.LogObj.LogArray = [];
                        item.selectedTemplateCheckbox == item.selectedTemplateCheckbox || false;
                        //if (item.selectedTemplateCheckbox) {
                        //    alertify.success("Template is selected");
                        //}

                        if (item.selectedTemplateCheckbox == false) {
                            item.selectedTemplateCheckbox = true;
                        } else {
                            item.selectedTemplateCheckbox = false;
                        }
                        //  $scope.Selectedtemplateobj = item.TemplateName;
                        if (CheifComplaitsSection.GridCheifComplaints == 1) {
                            SelectedtempChiefComplaint = angular.copy(item.ChiefComplaintsArray) || [];

                            if (SelectedtempChiefComplaint.length > 0) {
                                angular.forEach(SelectedtempChiefComplaint, function (item) {
                                    item.IsEdit = false;

                                    item.DurationDate = item.DurationDate || '';
                                    if (item.DurationDate != '') {
                                        item.ShowDateFormat = true;
                                        item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy");
                                    } else {
                                        item.ShowDateFormat = false;
                                    }
                                    item.ModifyFactors = item.ModifyFactors || [];
                                    if (item.ModifyFactors.length > 0) {
                                        angular.forEach(item.ModifyFactors, function (sitem) {
                                            sitem.isChecked = false;
                                        });
                                        if (item.SlectedModifyFactors.length > 0) {
                                            angular.forEach(item.SlectedModifyFactors, function (sfitem) {
                                                angular.forEach(item.ModifyFactors, function (sitem) {
                                                    if (sfitem.ID == sitem.ID) {
                                                        sitem.isChecked = true;
                                                    }

                                                });
                                            });
                                        }
                                    }
                                    item.Quality = item.Quality || [];
                                    if (item.Quality.length > 0) {
                                        angular.forEach(item.Quality, function (sitem) {
                                            sitem.isChecked = false;

                                        });
                                        if (item.SlectedQuality.length > 0) {
                                            angular.forEach(item.SlectedQuality, function (sfitem) {
                                                angular.forEach(item.Quality, function (sitem) {
                                                    if (sfitem.ID == sitem.ID) {
                                                        sitem.isChecked = true;
                                                    }

                                                });
                                            });
                                        }
                                    }
                                    item.Context = item.Context || [];
                                    if (item.Context.length > 0) {
                                        angular.forEach(item.Context, function (sitem) {
                                            sitem.isChecked = false;
                                        });
                                        if (item.SlectedContext.length > 0) {
                                            angular.forEach(item.SlectedContext, function (sfitem) {
                                                angular.forEach(item.Context, function (sitem) {
                                                    if (sfitem.ID == sitem.ID) {
                                                        sitem.isChecked = true;
                                                    }

                                                });
                                            });
                                        }
                                    }
                                    item.AssosSign = item.AssosSign || [];
                                    if (item.AssosSign.length > 0) {
                                        angular.forEach(item.AssosSign, function (sitem) {
                                            sitem.isChecked = false;
                                        });
                                        if (item.SlectedAssosSign.length > 0) {
                                            angular.forEach(item.SlectedAssosSign, function (sfitem) {
                                                angular.forEach(item.AssosSign, function (sitem) {
                                                    if (sfitem.ID == sitem.ID) {
                                                        sitem.isChecked = true;
                                                    }

                                                });
                                            });
                                        }
                                    }
                                    item.ModifyFactors = item.ModifyFactors || [];
                                    if (item.ModifyFactors.length > 0) {
                                        angular.forEach(item.ModifyFactors, function (sitem) {
                                            sitem.isChecked = false;
                                        });
                                        if (item.SlectedModifyFactors.length > 0) {
                                            angular.forEach(item.SlectedModifyFactors, function (sfitem) {
                                                angular.forEach(item.ModifyFactors, function (sitem) {
                                                    if (sfitem.ID == sitem.ID) {
                                                        sitem.isChecked = true;
                                                    }

                                                });
                                            });
                                        }
                                    }

                                });
                            }

                            angular.forEach(SelectedtempChiefComplaint, function (Citem) {
                                Citem.PatientChiefComplaintId = 0;
                            });

                            $scope.NewTempcheifcomplent = SelectedtempChiefComplaint || [];
                            if (SelectedtempChiefComplaint.length !== 0) {
                                var count = 0
                                angular.forEach(SelectedtempChiefComplaint, function (Citem) {
                                    count++;
                                    Citem.PatientChiefComplaintId = 0;
                                    Citem.TemplateChiefComplaintId = 0;

                                    var List = $filter("filter")(NewTempcheifcomplent, function (Aitem, index) { return Aitem.ChiefComplaintId == Citem.ChiefComplaintId && Aitem.ActiveInd == "Y" }) || [];
                                    if (List.length == 0 && item.selectedTemplateCheckbox) {
                                        if (count == 1) {
                                            let LogItem = {
                                                "LogId": 0,
                                                "ModuleId": 1,
                                                "ModuleName": "OUTPATIENT",
                                                "SubModuleId": 47,
                                                "SubModuleName": "Chief Complaints",
                                                "ScreenType": "Templates",
                                                "ActionType": "Accessed",
                                                "OldActionDescription": "",
                                                "NewActionDescription": `${item.TemplateName}  is Apply for Cheif Complaints`
                                            }
                                            $scope.AddAuditLogNew(LogItem);
                                            alertify.success("Template is selected");
                                        }
                                    }
                                    if (List.length == 0) {
                                        NewTempcheifcomplent.push(Citem);
                                    }
                                });


                            }
                            //if (NewTempcheifcomplent.length > 0) {
                            //    angular.forEach(NewTempcheifcomplent, function (mitem) {
                            //        mitem.IsEdit = false;
                            //        item.IsDescriptionEdit = false;
                            //    });
                            //    item.IsEdit = true;
                            //    // $scope.newChiefCompaintObj.ChiefComplaints[0].IsEdit = true;
                            //    var List = $filter("filter")(NewTempcheifcomplent, function (Aitem, index) { return Aitem.ActiveInd == "Y" }) || [];
                            //    if (List.length !== 0) {
                            //        List[0].IsEdit = true;
                            //    }
                            //}

                            if (NewTempcheifcomplent.length > 0) {
                                NewTempcheifcomplent = $filter("filter")(
                                    NewTempcheifcomplent,
                                    { ActiveInd: 'Y' },
                                    true
                                ) || [];
                                NewTempcheifcomplent[0].IsEdit = true;
                                //ChangedHPIDiscription(NewTempcheifcomplent);
                                ChangeIndividualHPIDiscription(NewTempcheifcomplent);
                            };
                        }
                        if (CheifComplaitsSection.GridCheifComplaints == 2) {
                            SelectedtempChiefComplaint = angular.copy(item.ChiefComplaintsArray) || [];

                            if (SelectedtempChiefComplaint.length > 0) {
                                angular.forEach(SelectedtempChiefComplaint, function (item) {
                                    item.IsEdit = false;

                                    item.DurationDate = item.DurationDate || '';
                                    if (item.DurationDate != '') {
                                        item.ShowDateFormat = true;
                                        item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy");
                                    } else {
                                        item.ShowDateFormat = false;
                                    }
                                    item.ModifyFactors = item.ModifyFactors || [];
                                    if (item.ModifyFactors.length > 0) {
                                        angular.forEach(item.ModifyFactors, function (sitem) {
                                            sitem.isChecked = false;
                                        });
                                        item.SlectedModifyFactors = item.SlectedModifyFactors || [];
                                        if (item.SlectedModifyFactors.length > 0) {
                                            angular.forEach(item.SlectedModifyFactors, function (sfitem) {
                                                angular.forEach(item.ModifyFactors, function (sitem) {
                                                    if (sfitem.ID == sitem.ID) {
                                                        sitem.isChecked = true;
                                                    }

                                                });
                                            });
                                        }
                                    }
                                    item.Quality = item.Quality || [];
                                    if (item.Quality.length > 0) {
                                        angular.forEach(item.Quality, function (sitem) {
                                            sitem.isChecked = false;

                                        });
                                        item.SlectedQuality = item.SlectedQuality || [];
                                        if (item.SlectedQuality.length > 0) {
                                            angular.forEach(item.SlectedQuality, function (sfitem) {
                                                angular.forEach(item.Quality, function (sitem) {
                                                    if (sfitem.ID == sitem.ID) {
                                                        sitem.isChecked = true;
                                                    }

                                                });
                                            });
                                        }
                                    }
                                    item.Context = item.Context || [];
                                    if (item.Context.length > 0) {
                                        angular.forEach(item.Context, function (sitem) {
                                            sitem.isChecked = false;
                                        });
                                        item.SlectedContext = item.SlectedContext || [];
                                        if (item.SlectedContext.length > 0) {
                                            angular.forEach(item.SlectedContext, function (sfitem) {
                                                angular.forEach(item.Context, function (sitem) {
                                                    if (sfitem.ID == sitem.ID) {
                                                        sitem.isChecked = true;
                                                    }

                                                });
                                            });
                                        }
                                    }
                                    item.AssosSign = item.AssosSign || [];
                                    if (item.AssosSign.length > 0) {
                                        angular.forEach(item.AssosSign, function (sitem) {
                                            sitem.isChecked = false;
                                        });
                                        item.SlectedAssosSign = item.SlectedAssosSign || [];
                                        if (item.SlectedAssosSign.length > 0) {
                                            angular.forEach(item.SlectedAssosSign, function (sfitem) {
                                                angular.forEach(item.AssosSign, function (sitem) {
                                                    if (sfitem.ID == sitem.ID) {
                                                        sitem.isChecked = true;
                                                    }

                                                });
                                            });
                                        }
                                    }
                                    item.ModifyFactors = item.ModifyFactors || [];
                                    if (item.ModifyFactors.length > 0) {
                                        angular.forEach(item.ModifyFactors, function (sitem) {
                                            sitem.isChecked = false;
                                        });
                                        if (item.SlectedModifyFactors.length > 0) {
                                            angular.forEach(item.SlectedModifyFactors, function (sfitem) {
                                                angular.forEach(item.ModifyFactors, function (sitem) {
                                                    if (sfitem.ID == sitem.ID) {
                                                        sitem.isChecked = true;
                                                    }

                                                });
                                            });
                                        }
                                    }

                                });

                                //$scope.newChiefCompaintObj.ChiefComplaints = $filter("filter")($scope.newChiefCompaintObj.ChiefComplaints, { "Type": 'Grid' }, true);
                                // $scope.newChiefCompaintObj.ChiefComplaints[0].IsEdit = true;
                            }

                            angular.forEach(SelectedtempChiefComplaint, function (Citem) {
                                Citem.PatientChiefComplaintId = 0;
                            });

                            $scope.Tempcheifcomplent = SelectedtempChiefComplaint || [];
                            if (SelectedtempChiefComplaint.length !== 0) {
                                var count = 0
                                angular.forEach(SelectedtempChiefComplaint, function (Citem) {
                                    count++
                                    Citem.PatientChiefComplaintId = 0;
                                    Citem.TemplateChiefComplaintId = 0;

                                    var List = $filter("filter")(Tempcheifcomplent, function (Aitem, index) { return Aitem.ChiefComplaintId == Citem.ChiefComplaintId && Aitem.ActiveInd == "Y" }) || [];
                                    if (List.length == 0 && item.selectedTemplateCheckbox) {
                                        if (count == 1) {
                                            alertify.success("Template is selected");
                                        }
                                    }
                                    if (List.length == 0) {
                                        Tempcheifcomplent.push(Citem);
                                    }
                                });
                            }

                            //if (Tempcheifcomplent.length > 0) {
                            //    angular.forEach(Tempcheifcomplent, function (mitem) {
                            //        mitem.IsEdit = false;
                            //        mitem.IsDescriptionEdit = false;
                            //    });
                            //    item.IsEdit = true;
                            //    item.IsDescriptionEdit = true;
                            //    // $scope.newChiefCompaintObj.ChiefComplaints[0].IsEdit = true;
                            //    var List = $filter("filter")(Tempcheifcomplent, function (Aitem, index) { return Aitem.ActiveInd == "Y" }) || [];
                            //    if (List.length !== 0) {
                            //        List[0].IsEdit = true;
                            //    }
                            //}

                            if (Tempcheifcomplent.length > 0) {
                                Tempcheifcomplent[0].IsEdit = true;
                                //ChangedHPIDiscription(Tempcheifcomplent);
                                ChangeIndividualHPIDiscription(Tempcheifcomplent);
                            };
                        }
                    }
                    $scope.Templatesearch = {
                        "searchtempl":"",
                    }
                    $scope.changeDiagnosisSearchIncheif = function (searchitem) {



                        if (searchitem != "") {
                            var filtertemplate = $filter("filter")($scope.CopyChiefComplaintTemplatesArray, { "TemplateName": searchitem }) || [];
                            $scope.ChiefComplaintTemplatesArray = angular.copy(filtertemplate);
                            if ($scope.ChiefComplaintTemplatesArray.length === 0) {

                            }
                        } else {
                            $scope.ChiefComplaintTemplatesArray = angular.copy($scope.CopyChiefComplaintTemplatesArray);
                        }
                        if ($scope.ChiefComplaintTemplatesArray.length > 0) {
                            angular.forEach($scope.ChiefComplaintTemplatesArray, function (ditem) {
                                ditem.IsEdit = false;
                            });
                            $scope.ChiefComplaintTemplatesArray[0].IsEdit = true;
                        }
                    }
                    $scope.EditDiagnosisTemplate = function (templatedetails, index) {
                        index = index;
                        $scope.LogObj.LogArray = [];
                        let Names = '';
                        let count = 0;
                        $scope.AllCheifcomplaints = [];
                        if (templatedetails.ChiefComplaintsArray.length > 0) {
                            $scope.AllCheifcomplaints = angular.copy(templatedetails.ChiefComplaintsArray);
                        }
                        if ($scope.AllCheifcomplaints.length > 0) {
                            if (CheifComplaitsSection.GridCheifComplaints  == 2) {
                                if (Tempcheifcomplent.length > 0) {

                                    angular.forEach(Tempcheifcomplent, function (item) {
                                        if (item.ActiveInd == 'Y') {
                                            var filterdiagnosis = $filter("filter")($scope.AllCheifcomplaints, function (miditem) { return miditem.ChiefComplaintId == item.ChiefComplaintId; }) || [];
                                            if (filterdiagnosis.length == 0) {

                                                var object = {
                                                    "ActiveInd": item.ActiveInd || "Y",
                                                    "Duration": item.Duration || 0,
                                                    "SeverityId": item.SeverityId || null,
                                                    "DurationType": item.DurationType || "D",
                                                    "DurationDate": item.DurationDate || "",
                                                    "SlectedQuality": item.SlectedQuality || [],
                                                    "SlectedModifyFactors": item.SlectedModifyFactors || [],
                                                    "SlectedAssosSign": item.SlectedAssosSign || [],
                                                    "SlectedContext": item.SlectedContext || [],
                                                    "ModifyFactorId": item.ModifyFactorId || null,
                                                    "QualityId": item.QualityId || null,
                                                    "ContextId": item.ContextId || null,
                                                    "AssosSignId": item.AssosSignId || null,
                                                    "EyeDurationId": item.EyeDurationId || null,
                                                    "OrganId": item.OrganId || "",
                                                    "ChiefComplaintId": item.ChiefComplaintId || null,
                                                    "Description": item.Description || '',
                                                    "IsDescriptionEdit": item.IsDescriptionEdit || false,
                                                    "TemplateChiefComplaintId": item.TemplateChiefComplaintId || 0,
                                                    "Context": item.Context || [],
                                                    "AssosSign": item.AssosSign || [],
                                                    "ModifyFactors": item.ModifyFactors || [],
                                                    "Quality": item.Quality || [],
                                                    "ChiefComplaintCodeSystemName": item.ChiefComplaintCodeSystemName || "",
                                                }

                                                $scope.AllCheifcomplaints.push(object);
                                                if (item.ActiveInd === 'Y') {
                                                    if (count > 0) Names += '\n ';
                                                    Names += item.ChiefComplaintName;
                                                    count++;
                                                }
                                            }
                                            else {
                                                filterdiagnosis[0].ActiveInd = item.ActiveInd || "Y";
                                                filterdiagnosis[0].Duration = item.Duration || 0;
                                                filterdiagnosis[0].SeverityId = item.SeverityId || null;
                                                filterdiagnosis[0].DurationType = item.DurationType || "D";
                                                filterdiagnosis[0].DurationDate = item.DurationDate || "";
                                                filterdiagnosis[0].SlectedQuality = item.SlectedQuality || [];
                                                filterdiagnosis[0].SlectedModifyFactors = item.SlectedModifyFactors || [];
                                                filterdiagnosis[0].SlectedAssosSign = item.SlectedAssosSign || [];
                                                filterdiagnosis[0].SlectedContext = item.SlectedContext || [];
                                                filterdiagnosis[0].ModifyFactorId = item.ModifyFactorId || null;
                                                filterdiagnosis[0].QualityId = item.QualityId || null;
                                                filterdiagnosis[0].ContextId = item.ContextId || null;
                                                filterdiagnosis[0].AssosSignId = item.AssosSignId || null;
                                                filterdiagnosis[0].EyeDurationId = item.EyeDurationId || null;
                                                filterdiagnosis[0].OrganId = item.OrganId || "";
                                                filterdiagnosis[0].ChiefComplaintId = item.ChiefComplaintId || null;
                                                filterdiagnosis[0].Description = item.Description || '';
                                                filterdiagnosis[0].IsDescriptionEdit = item.IsDescriptionEdit || false;
                                                filterdiagnosis[0].TemplateChiefComplaintId = filterdiagnosis[0].TemplateChiefComplaintId || 0;
                                                filterdiagnosis[0].Context = item.Context || [];
                                                filterdiagnosis[0].AssosSign = item.AssosSign || [];
                                                filterdiagnosis[0].ModifyFactors = item.ModifyFactors || [];
                                                filterdiagnosis[0].Quality = item.Quality || [];
                                                filterdiagnosis[0].ChiefComplaintCodeSystemName = item.ChiefComplaintCodeSystemName || [];
                                            }
                                        }
                                    });
                                }
                                else {
                                    alertify.error("Please select cheifcomplate");
                                    return false;
                                }
                            } else if (CheifComplaitsSection.GridCheifComplaints  == 1) {
                                if (NewTempcheifcomplent.length > 0) {
                                    angular.forEach(NewTempcheifcomplent, function (item) {
                                        if (item.ActiveInd == 'Y') {
                                            var filterdiagnosis = $filter("filter")($scope.AllCheifcomplaints, function (miditem) { return miditem.ChiefComplaintId == item.ChiefComplaintId; }) || [];
                                            if (filterdiagnosis.length == 0) {
                                                var object1 = {
                                                    "ActiveInd": item.ActiveInd || "Y",
                                                    "Duration": item.Duration || 0,
                                                    "SeverityId": item.SeverityId || null,
                                                    "DurationType": item.DurationType || "D",
                                                    "DurationDate": item.DurationDate || "",
                                                    "SlectedQuality": item.SlectedQuality || [],
                                                    "SlectedModifyFactors": item.SlectedModifyFactors || [],
                                                    "SlectedAssosSign": item.SlectedAssosSign || [],
                                                    "SlectedContext": item.SlectedContext || [],
                                                    "ModifyFactorId": item.ModifyFactorId || null,
                                                    "QualityId": item.QualityId || null,
                                                    "ContextId": item.ContextId || null,
                                                    "AssosSignId": item.AssosSignId || null,
                                                    "EyeDurationId": item.EyeDurationId || null,
                                                    "OrganId": item.OrganId || "",
                                                    "ChiefComplaintId": item.ChiefComplaintId || null,
                                                    "Description": item.Description || '',
                                                    "IsDescriptionEdit": item.IsDescriptionEdit || false,
                                                    "TemplateChiefComplaintId": item.TemplateChiefComplaintId || 0,
                                                    "Context": item.Context || [],
                                                    "AssosSign": item.AssosSign || [],
                                                    "ModifyFactors": item.ModifyFactors || [],
                                                    "Quality": item.Quality || [],
                                                    "ChiefComplaintCodeSystemName": item.ChiefComplaintCodeSystemName || "",
                                                }

                                                $scope.AllCheifcomplaints.push(object1);
                                                if (item.ActiveInd === 'Y') {
                                                    if (count > 0) Names += '\n ';
                                                    Names += item.ChiefComplaintName;
                                                    count++;
                                                }
                                            }
                                            else {
                                                filterdiagnosis[0].ActiveInd = item.ActiveInd || "Y";
                                                filterdiagnosis[0].Duration = item.Duration || 0;
                                                filterdiagnosis[0].SeverityId = item.SeverityId || null;
                                                filterdiagnosis[0].DurationType = item.DurationType || "D";
                                                filterdiagnosis[0].DurationDate = item.DurationDate || "";
                                                filterdiagnosis[0].SlectedQuality = item.SlectedQuality || [];
                                                filterdiagnosis[0].SlectedModifyFactors = item.SlectedModifyFactors || [];
                                                filterdiagnosis[0].SlectedAssosSign = item.SlectedAssosSign || [];
                                                filterdiagnosis[0].SlectedContext = item.SlectedContext || [];
                                                filterdiagnosis[0].ModifyFactorId = item.ModifyFactorId || null;
                                                filterdiagnosis[0].QualityId = item.QualityId || null;
                                                filterdiagnosis[0].ContextId = item.ContextId || null;
                                                filterdiagnosis[0].AssosSignId = item.AssosSignId || null;
                                                filterdiagnosis[0].EyeDurationId = item.EyeDurationId || null;
                                                filterdiagnosis[0].OrganId = item.OrganId || "";
                                                filterdiagnosis[0].ChiefComplaintId = item.ChiefComplaintId || null;
                                                filterdiagnosis[0].Description = item.Description || '';
                                                filterdiagnosis[0].IsDescriptionEdit = item.IsDescriptionEdit || false;
                                                filterdiagnosis[0].TemplateChiefComplaintId = filterdiagnosis[0].TemplateChiefComplaintId || 0;
                                                filterdiagnosis[0].Context = item.Context || [];
                                                filterdiagnosis[0].AssosSign = item.AssosSign || [];
                                                filterdiagnosis[0].ModifyFactors = item.ModifyFactors || [];
                                                filterdiagnosis[0].Quality = item.Quality || [];
                                                filterdiagnosis[0].ChiefComplaintCodeSystemName = item.ChiefComplaintCodeSystemName || [];
                                            }
                                        }
                                    });
                                }
                                else {
                                    alertify.error("Please select cheifcomplate");
                                    return false;
                                }
                            }
                        }

                        if ($scope.AllCheifcomplaints.length > 0) {

                            angular.forEach($scope.AllCheifcomplaints, function (item) {

                                let description = item.Description || '';

                                // Remove patient name + "presents with/for"
                                description = description.replace(
                                    /^.*?\s+presents\s+with\/for\s+/i,
                                    ''
                                );

                                // Remove "Pt also presents with/for"
                                description = description.replace(
                                    /^Pt\s+also\s+presents\s+with\/for\s+/i,
                                    ''
                                );

                                // Remove "presents with/for" if it exists alone
                                description = description.replace(
                                    /^presents\s+with\/for\s+/i,
                                    ''
                                );

                                item.Description = description.trim();
                            });
                        }

                        var params = {
                            "UserId": doctorinfo.doctordata.User[0].DoctorID,
                            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                            "TemplateId": templatedetails.TemplateId,
                            "TemplateName": templatedetails.TemplateName,
                            "ChiefComplaintsArray": $scope.AllCheifcomplaints|| [],
                            "DeleteInd": "N",
                            "IsTemplateFavorites": templatedetails.IsTemplateFavorites || false,
                            "Logs": {}
                        }
                    //    let finalDesc = addArr.join("\n\n").trim();

                        if (count>0) {
                            $scope.LogObj.LogArray.push({
                                LogId: 0,
                                ModuleId: 1,
                                ModuleName: "OUTPatient",
                                SubModuleId: 47,
                                SubModuleName: "Chief Complaints",
                                ScreenType: "Template",
                                ActionType: "Add to Template",
                                OldActionDescription: "",
                                NewActionDescription: `Template Name : ${templatedetails.TemplateName}\n\nAdded in Template :\n${Names}`,
                                ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                            });

                        }

                        if ($scope.LogObj.length > 0) {

                            angular.forEach($scope.LogObj, function (item) {

                                let description = item.Description || '';

                                // Remove patient name + "presents with/for"
                                description = description.replace(
                                    /^.*?\s+presents\s+with\/for\s+/i,
                                    ''
                                );

                                // Remove "Pt also presents with/for"
                                description = description.replace(
                                    /^Pt\s+also\s+presents\s+with\/for\s+/i,
                                    ''
                                );

                                // Remove "presents with/for" if it exists alone
                                description = description.replace(
                                    /^presents\s+with\/for\s+/i,
                                    ''
                                );

                                item.Description = description.trim();
                            });
                        }

                        if ($scope.LogObj.LogArray.length > 0) {
                            params.Logs = $scope.LogObj || {};
                        }
                        eHnotePatientDataService.AddUpdateUserChiefComplaintTemplateDetails(params).then(function (resp) {

                            if (resp.data.Status == "Success") {
                                alertify.success("Template updated successfully.");
                                //$scope.Selectedtemplateobj.TemplateName = "";
                                //$scope.OverallTemplate.TemplateInd = false;
                                //$scope.OverallTemplate.TemplateInd1 = false;
                                //$scope.Selectedtemplateobj.IsTemplateFavorites = false;
                                $scope.GetUserChiefComplaintTemplateDetails(index);
                            } else if (resp.data.Status == "Failure") {
                                alertify.error(resp.data.Message);
                            }

                        }, function (err) {

                        });

                    };


                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }

            });

            if ($scope.newChiefCompaintObj.ChiefComplaints.length > 0) {
                angular.forEach($scope.newChiefCompaintObj.ChiefComplaints, function (item) {
                    item.IsEdit = false;
                });
                $scope.newChiefCompaintObj.ChiefComplaints[0].IsEdit = true;
            }

            $scope.cacheStorageItem.ChiefComplaints = $scope.newChiefCompaintObj.ChiefComplaints || '';
        };

        $scope.chiefcomplaintshistorypopup = {
            "templateUrl": "templates/UIBPopovers/chiefcomplaintshistorypopup.html",
        };
        $scope.GetPreviousChiefComplaintsPatientData = function () {

            var obj = {
                "TypeID": 1,
                "TypeName": "ChiefComplaints",
                "PatientId": $scope.cacheStorageItem.patientid,
                "HospitalId": $scope.HospitalId,
                "UserId": $scope.UserId,
            };
            eHnotePatientDataService.GetPreviousROSHistoryData(obj).then(function (resp) {
                $scope.PreviousInvestigations = [];
                if (resp.data.rows != undefined) {
                    $scope.PreviousInvestigations = resp.data.rows;
                }
            });
        };
        $scope.AddChiefComplaintsHistory = function (item) {
            $scope.newChiefCompaintObjj.ChiefComplaintObj = item;
            var object = {
                "IsEdit": false,
                "showCheifInstructions": false,
                "ActiveInd": 'Y',
                "Duration": 0,
                "SeverityId": $scope.newChiefCompaintObjj.SeverityId || null,
                "SeverityName": $scope.newChiefCompaintObjj.SeverityName || '',
                "DurationType": 'D',
                "ModifyFactors": $scope.newChiefCompaintObjj.ChiefComplaintObj.ModifyFactors || [],
                "Quality": $scope.newChiefCompaintObjj.ChiefComplaintObj.Quality || [],
                "Context": $scope.newChiefCompaintObjj.ChiefComplaintObj.Context || [],
                "AssosSign": $scope.newChiefCompaintObjj.ChiefComplaintObj.AssosSign || [],
                "ModifyFactorId": null,
                "QualityId": null,
                "ContextId": null,
                "AssosSignId": null,
                "EyeDurationId": null,
                "OrganId": $scope.newChiefCompaintObjj.SelectedEye,
                "ChiefComplaintId": $scope.newChiefCompaintObjj.ChiefComplaintObj.ChiefComplaintId,
                "ChiefComplaintName": $scope.newChiefCompaintObjj.ChiefComplaintObj.ChiefComplaintName,
                "PatientChiefComplaintId": 0,
                "Description": $scope.newChiefCompaintObjj.ChiefComplaintObj.Description || "",
                "IsDescriptionEdit": true,
                "Remarks": ""
            };
            $scope.cacheStorageItem.ChiefComplaints = $scope.cacheStorageItem.ChiefComplaints || [];
            //var data = $scope.newChiefCompaintObjj.ChiefComplaintObj.ChiefComplaintName ? $scope.newChiefCompaintObjj.ChiefComplaintObj.ChiefComplaintName : $scope.newChiefCompaintObjj.ChiefComplaintObj;

            //var List = $filter("filter")($scope.cacheStorageItem.ChiefComplaints, function (item) {
            //    return (item.ChiefComplaintName === data && item.ActiveInd === 'Y');
            //});
            //if (List.length > 0) {
            //    alertify.error('You have already entered this chief complaint');
            //    $scope.newChiefCompaintObjj.ChiefComplaintObj = "";
            //    return;
            //}
            var i = 0;
            if ($scope.cacheStorageItem.ChiefComplaints.length > 0) {
                angular.forEach($scope.cacheStorageItem.ChiefComplaints, function (citem) {
                    var index = $scope.cacheStorageItem.ChiefComplaints.indexOf(citem);
                    if (item.ChiefComplaintName == citem.ChiefComplaintName && item.ActiveInd === 'Y' && citem.ActiveInd === 'Y') {
                        i++
                        var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>This Chief Complaint will update with current data. Do you want to continue? </h4>", function () {
                            $scope.cacheStorageItem.ChiefComplaints[index] = angular.copy(item);
                        }, function () {
                            r = "You pressed Cancel!";
                        });
                    }
                });
            }
            if (i == 0) {
                $scope.cacheStorageItem.ChiefComplaints.push(object);
                item.iscopied = true;
            }
            $scope.newChiefCompaintObjj.ChiefComplaintObj = "";
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

        $scope.getSnomedCodesItem = function (val) {
            $scope.SearchText = val || "";
            var params = {
                "HospitalId": $scope.HospitalId,
                "SearchText": $scope.SearchText || '',
                "PageSize": 20,
                "PageNumber": 1,
                "SearchType": "",
                "SearchConcept": "",
                "SearchDate": "",
                "ParentOrganizationId": $scope.ParenthospitalId || null,
            }
            return eHnoteSettingsDataService.GetSnomedCodes(params).then(function (resp) {
                if (resp.data.count !== 0) {
                    if (resp.data.rows !== undefined) {
                        return resp.data.rows.map(function (item) {
                            item.ConceptId = item.ConceptId || "";
                            return item;
                        });
                    }
                }
            });
        };

        $scope.onSelectAssesmentPlannewDiagnosis = function (mainobject, type) {

            $scope.newChiefCompaintObjj.ChiefComplaintObj = mainobject;
            var i = 0;

            $scope.newChiefCompaintObjj.ChiefComplaintObj = $scope.newChiefCompaintObjj.ChiefComplaintObj || "";
            if ($scope.newChiefCompaintObjj.ChiefComplaintObj === "") {
                return;
            }

            console.log(JSON.stringify(mainobject));
            var object = {
                "IsEdit": false,
                "showCheifInstructions": false,
                "ActiveInd": 'Y',
                "Duration": 0,
                "SeverityId": $scope.newChiefCompaintObjj.SeverityId || null,
                "SeverityName": $scope.newChiefCompaintObjj.SeverityName || '',
                "DurationType": 'D',
                "ModifyFactors": $scope.newChiefCompaintObjj.ChiefComplaintObj.ModifyFactors || [],
                "Quality": $scope.newChiefCompaintObjj.ChiefComplaintObj.Quality || [],
                "Context": $scope.newChiefCompaintObjj.ChiefComplaintObj.Context || [],
                "AssosSign": $scope.newChiefCompaintObjj.ChiefComplaintObj.AssosSign || [],
                "ModifyFactorId": null,
                "QualityId": null,
                "ContextId": null,
                "AssosSignId": null,
                "EyeDurationId": null,
                "OrganId": null,
                "ChiefComplaintId":0,
                "ChiefComplaintName": "",
                "ChiefComplaintType": "",
                "ChiefComplaintCode": "",
                "ChiefComplaintCodeSystem":"",
                "ChiefComplaintCodeSystemName": "",
                "PatientChiefComplaintId": 0,
                "Description": "",
                "IsDescriptionEdit": false,
                "Remarks": ""
            };

            if (type == 'ICD-10' || type == 'SNOMED-CT') {
                object.AssosSign = $scope.GeneralCCList.GeneralCCAssosSign ||[];
                object.Context = $scope.GeneralCCList.GeneralCCContext ||[];
                object.ModifyFactors = $scope.GeneralCCList.GeneralCCModifyFactors || [];
                object.Quality = $scope.GeneralCCList.GeneralCCQuality || [];


                if (object.ModifyFactors.length > 0) {
                    angular.forEach(object.ModifyFactors, function (item) {
                        item.isChecked = false;
                    });
                }
                if (object.Quality.length > 0) {
                    angular.forEach(object.Quality, function (item) {
                        item.isChecked = false;
                    });
                }
                if (object.Context.length > 0) {
                    angular.forEach(object.Context, function (item) {
                        item.isChecked = false;
                    });
                }
                if (object.AssosSign.length > 0) {
                    angular.forEach(object.AssosSign, function (item) {
                        item.isChecked = false;
                    });
                }


            }

            if (type == 'ICD-10') {
                object.ChiefComplaintCodeSystemName = type;
                object.ChiefComplaintCodeSystem = "2.16.840.1.113883.6.90";
                object.ChiefComplaintId = mainobject.DiagnosisId;
                object.ChiefComplaintName = mainobject.DiagnosisName;
                object.Description = mainobject.DiagnosisName;
                object.ChiefComplaintCode = mainobject.ICD10CODE;

            }
            if (type == 'SNOMED-CT') {
                object.ChiefComplaintCodeSystemName = type;
                object.ChiefComplaintCodeSystem = "2.16.840.1.113883.6.96";
                object.ChiefComplaintId = mainobject.SnomedCodeId;
                object.ChiefComplaintName = mainobject.Description;
                object.Description = mainobject.Description;
                object.ChiefComplaintCode = mainobject.ConceptId;
            }


            var List = $filter("filter")($scope.cacheStorageItem.ChiefComplaints, function (item) {
                return (item.ChiefComplaintName === object.ChiefComplaintName && item.ActiveInd === 'Y');
            });
            if (List.length > 0) {
                alertify.error('You have already entered this chief complaint');
                $scope.newChiefCompaintObjj.ChiefComplaintObj = "";
                return;
            }
            if ($scope.cacheStorageItem.ChiefComplaints.length !== 0) {
                angular.forEach($scope.cacheStorageItem.ChiefComplaints, function (item) {
                    item.IsEdit = false;
                });
            }
            //object.IsEdit = false;
            if (i === 0) {
                if ($scope.newChiefCompaintObj.ChiefComplaints.length !== 0) {
                    angular.forEach($scope.newChiefCompaintObj.ChiefComplaints, function (item) {
                        item.IsEdit = false;
                    });
                }
                object.IsEdit = true;
                $scope.cacheStorageItem.ChiefComplaints = $scope.newChiefCompaintObj.ChiefComplaints;
                $scope.cacheStorageItem.ChiefComplaints.push(object);
            }
            $scope.newChiefCompaintObj.ChiefComplaints = angular.copy($scope.cacheStorageItem.ChiefComplaints);
            GetOrganNameList
            //$scope.ChangedHPIDiscription($scope.newChiefCompaintObj.ChiefComplaints);
            $scope.ChangeIndividualHPIDiscription($scope.newChiefCompaintObj.ChiefComplaints);

            $scope.newChiefCompaintObjj.ChiefComplaintObj = "";
            $scope.newChiefCompaintObjj.SelectedEye = '';
            $scope.newChiefCompaintObjj.SeverityId = null;
            $scope.newChiefCompaintObjj.SeverityName = '';
            $scope.MainCheifComplaitsObj.Type = type || "SNOMED-CT";
        }

        $scope.$watch("newChiefCompaintObj.ChiefComplaints", function (newVal, oldVal) {
            if ($scope.newChiefCompaintObj.ChiefComplaints.length == 0) {
                return false;
            }
            angular.forEach($scope.newChiefCompaintObj.ChiefComplaints, function (item) {
                if (item.IsDescriptionEdit == false) {
                    //if ($scope.newChiefCompaintObj.ChiefComplaints.length > 0) {
                    //    //  $scope.newChiefCompaintObj.ChiefComplaints = $scope.cacheStorageItem.ChiefComplaints || [];
                    //    angular.forEach($scope.newChiefCompaintObj.ChiefComplaints, function (item) {
                    //        item.IsEdit = false;
                    //        item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy");
                    //    });
                    //}
                    if (item.ShowDateFormat == true) {
                        item.Duration = null;
                        item.DurationType = "D";
                    } else {
                        item.DurationDate = "";
                    }
                    item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy");
                    var Severity = '', Quality = '', Eye = '', Timing = '', Duration = '', Context = '', Modifyingfactors = '', Associated = '', DurationDate = '';
                    item.SeverityId = item.SeverityId || null;
                    item.QualityId = item.QualityId || null;
                    item.OrganId = item.OrganId || null;
                    item.EyeDurationId = item.EyeDurationId || null;
                    item.Duration = item.Duration || null;
                    //item.Duration = item.Duration || item.DurationDate;
                    item.DurationDate = item.DurationDate;
                    item.ContextId = item.ContextId || null;
                    item.ModifyFactorId = item.ModifyFactorId || null;
                    item.AssosSignId = item.AssosSignId || null;
                    if (item.SeverityId != null) {
                        var List = $filter("filter")($scope.GetSeverityList, { "SeverityId": item.SeverityId }, true) || [];
                        if (List.length != 0) {
                            Severity = List[0].SeverityName + ' ' || '';
                        }
                    }
                    /* if (item.QualityId != null) {*/
                    //var List1 = $filter("filter")(item.Quality, { "ID": item.QualityId }, true);
                    //if (List1.length != 0) {
                    //    Quality = List1[0].Description + ' ' || '';
                    //}
                    //if (item.Modifyingnotes != undefined) {
                    //    Quality = Quality + item.QualityNotes + ' ';
                    //}
                    var List1 = $filter("filter")(item.Quality, { "isChecked": true }, true) || [];
                    if (List1.length > 0) {
                        angular.forEach(List1, function (cqitem) {
                            if (cqitem.Description != '') {
                                if (Quality !== '') {
                                    Quality += ', '; // Add separator if needed
                                }
                                Quality += cqitem.Description;
                            }
                        });
                        item.QualityNotes = item.QualityNotes || '';
                        Quality += ", " + item.QualityNotes + " ";
                        /*}*/
                    }
                    else {
                        if (item.QualityNotes != undefined) {
                            Quality = Quality + item.QualityNotes + ' ';
                        }
                    }
                    if (item.OrganId != null) {
                        var List2 = $filter("filter")($scope.GetOrganNameList, { "OrganId": item.OrganId }, true) || [];
                        if (List2.length != 0) {
                            Eye = ' located in ' + List2[0].OrganName + ' ' || '';
                        }
                    }
                    if (item.EyeDurationId != null) {
                        var List3 = $filter("filter")($scope.GetDurationEpisodeList, { "EyeDurationId": item.EyeDurationId }, true);
                        if (List3.length != 0) {
                            Timing = ' that has been occurring ' + List3[0].Duration + ' ' || '';
                        }
                    }

                    var DurationType = item.DurationType === "Y" ? "Years(s)" : (item.DurationType === "M" ? "Month(s)" : (item.DurationType === "D" ? "Day(s)" : (item.DurationType === "W" ? "Week(s)" : (item.DurationType === "ME" ? "Minutes" : (item.DurationType === "H" ? "Hours" : (item.DurationType === "A" ? "Ago" : (item.DurationType === "ST" ? "Sometimes" : (item.DurationType === "FD" ? "Fewdays" : (item.DurationType === "TD" ? "Today" : (item.DurationType === "FQ" ? "Frequently" : (item.DurationType === "SB" ? "Since Birth" : (item.DurationType === "C" ? "To Be continued" : (item.DurationType === "L" ? "Life Time" : "")))))))))))));
                    if (item.Duration != null || item.Duration == null) {
                        if ((item.Duration !== '' && item.Duration !== null) && (item.DurationType === "Y" || item.DurationType === "M" || item.DurationType === "D" || item.DurationType === "W" || item.DurationType === "ME" || item.DurationType === "H")) {
                            Duration = ' for ' + item.Duration + ' ' + DurationType + ' ' + 'Ago' + ' ';
                        }
                        else {
                            if (item.DurationType === "ST" || item.DurationType === "FD" || item.DurationType === "TD" || item.DurationType === "FQ" || item.DurationType === "SB" || item.DurationType === "C" || item.DurationType === "L" || item.DurationType === "A") {
                                Duration = ' for ' + ' ' + DurationType + ' ';
                            }
                        }
                        //if (item.Duration == "") {
                        //    item.DurationDate = "";
                        //}
                    }

                    if (item.DurationDate != null) {

                        DurationDate = ''+item.DurationDate + ' ';
                    }

                    //if (item.ContextId != null) {
                    //    var List4 = $filter("filter")(item.Context, { "ID": item.ContextId }, true);
                    //    if (List4.length != 0) {
                    //        Context = ' usually ' + List4[0].Description || '';
                    //    }
                    //    if (item.ContextNotes != undefined) {
                    //        Context = Context + item.ContextNotes+ ' ';
                    //    }
                    var List4 = $filter("filter")(item.Context, { "isChecked": true }, true) || [];
                    if (List4.length > 0) {
                        angular.forEach(List4, function (ccxitem) {
                            if (ccxitem.Description != '') {
                                if (Context !== '') {
                                    Context += ' , '; // Add separator if needed
                                }
                                Context += ' usually '+ccxitem.Description;
                            }
                        });
                        item.ContextNotes = item.ContextNotes || '';
                        if (item.ContextNotes != '') {
                            Context += " , usually " + item.ContextNotes + " ";
                        }
                        
                    }
                    else {
                        if (item.ContextNotes != undefined) {
                            if (Context == '') {
                                Context = " " + " , usually " + item.ContextNotes + " ";
                            } else {
                                Context = " " + Context + item.ContextNotes + " ";
                            }
                            
                        }
                    }
                    //if (item.ModifyFactorId != null) {
                    //    var List5 = $filter("filter")(item.ModifyFactors, { "ID": item.ModifyFactorId }, true);
                    //    if (List5.length != 0) {
                    //        Modifyingfactors = '. This condition ' + List5[0].Description + ',' || '';
                    //    }
                    //    if (item.Modifyingnotes != undefined) {
                    //        Modifyingfactors = Modifyingfactors + item.Modifyingnotes+' ';
                    //    }
                    //}
                    var List5 = $filter("filter")(item.ModifyFactors, { "isChecked": true }, true) || [];
                    if (List5.length > 0) {
                        angular.forEach(List5, function (cMitem) {
                            if (cMitem.Description != '') {
                                if (Modifyingfactors !== '') {
                                    Modifyingfactors += ''; // Add separator if needed
                                }
                                Modifyingfactors += '. This condition '+cMitem.Description;
                            }
                        });
                        item.Modifyingnotes = item.Modifyingnotes || '';
                        if (item.Modifyingnotes !='') {
                            Modifyingfactors += '. This condition ' + item.Modifyingnotes + " ";
                        }
                       
                    }
                    else {
                        if (item.Modifyingnotes != undefined) {

                            if (Modifyingfactors == '') {
                                Modifyingfactors = " " + '. This condition '  + item.Modifyingnotes + " ";
                            } else{
                                Modifyingfactors = " " + Modifyingfactors + item.Modifyingnotes + " ";
                            }
                        }

                    }

                    var List6 = $filter("filter")(item.AssosSign, { "isChecked": true }, true) || [];
                    if (List6.length > 0) {
                        angular.forEach(List6, function (caitem) {
                            if (caitem.Description != '') {
                                if (Associated !== '') {
                                    Associated += ', '; // Add separator if needed
                                }
                                Associated += ' and is associated with ' +caitem.Description;
                            }
                        });
                        item.AssocSignsNotes = item.AssocSignsNotes || '';
                        if (item.AssocSignsNotes != '') {
                            Associated += " and is associated with " + item.AssocSignsNotes + " ";
                        }
                    }
                    else {
                        if (item.AssocSignsNotes != undefined) {
                            if (Associated == '') {
                                Associated = ' and is associated with ' + item.AssocSignsNotes + " ";
                            } else {
                                Associated = Associated + item.AssocSignsNotes + " ";
                            }
                        }
                    }
                    if (item.ChiefComplaintName == "") {
                        item.Description = item.Description || "";
                    }
                    else {
                        item.Description = Severity + Quality + item.ChiefComplaintName + Eye + Timing + Duration + DurationDate + Context + Modifyingfactors + Associated;
                    }

                    //if (item.Description == "") {
                    //    item.Description = Severity + Quality + item.ChiefComplaintName + Eye + Timing + Duration + DurationDate + Context + Modifyingfactors + Associated;
                    //} else {
                    //    item.Description = item.Description || "";
                    //}

                    //$scope.ChangedHPIDiscription($scope.newChiefCompaintObj.ChiefComplaints);
                    $scope.ChangeIndividualHPIDiscription($scope.newChiefCompaintObj.ChiefComplaints);
                }
            });
        }, true);

        $scope.Historypopupnew = function (tab, type, from) {


            if ($scope.newChiefCompaintObj.ChiefComplaints.length>0) {
                $scope.cacheStorageItem.ChiefComplaints = $scope.newChiefCompaintObj.ChiefComplaints;
            }


            var HistoryTab = tab || 1;
            type = type || 1;
            from = from || "";
            let LogItem = {
                "LogId": 0,
                "ModuleId": 1,
                "ModuleName": "OUTPATIENT",
                "SubModuleId": 47,
                "SubModuleName": "Chief Complaints",
                "ScreenType": "History",
                "ActionType": "Accessed",
                "OldActionDescription": "",
                "NewActionDescription": `History From Chief Complaints`,
            }
            $scope.AddAuditLogNew(LogItem);
            let mInstanceShow = $uibModal.open({
                "templateUrl": "templates/UsNewConsultation/uibpopup/Historypopupnew.html",
                "controller": "HistorypopupnewCtrl",
                "backdrop": "static",
                //"scope": $scope,
                //"size": "lg",
                /*   "windowClass": "offcanves-right",*/
                "windowClass": "modal__popup--1 bottom-to-top-modal",
                "keyboard": false,
                "resolve": {
                    "HistoryTab": function () { return HistoryTab },
                    "Patientid": function () { return angular.copy($scope.cacheStorageItem.patientid) },
                    "HospitalId": function () { return angular.copy($scope.HospitalId) },
                    "VisionObj": function () { return angular.copy($scope.VisionObj) },
                    "obj": function () { return angular.copy($scope.obj) },
                    "RefractionDetails": function () { return angular.copy($scope.PreviousInvestigationIdArray) },
                    "TonometrySubList": function () { return angular.copy($scope.TonometrySubList) },
                    "cacheStorageItem": function () { return angular.copy($scope.cacheStorageItem) },
                    "type": function () { return type },
                    "Comingfrom": function () { return from },
                },

            });
            mInstanceShow.result.then(function (resp) {
                if ($scope.CheifComplaitsSection.GridCheifComplaints == 1) {
                    $scope.newChiefCompaintObj.ChiefComplaints = angular.copy(resp.Cheifcomplaint);
                    if ($scope.newChiefCompaintObj.ChiefComplaints.length > 0) {
                        angular.forEach($scope.newChiefCompaintObj.ChiefComplaints, function (item) {
                            item.IsEdit = false;
                        });
                    }
                    $scope.newChiefCompaintObj.ChiefComplaints[0].IsEdit = true;
                    //$scope.ChangedHPIDiscription($scope.newChiefCompaintObj.ChiefComplaints);
                    $scope.ChangeIndividualHPIDiscription($scope.newChiefCompaintObj.ChiefComplaints);
                }
                else if ($scope.CheifComplaitsSection.GridCheifComplaints == 2) {
                    $scope.cacheStorageItem.ChiefComplaints = angular.copy(resp.Cheifcomplaint);
                    //$scope.ChangedHPIDiscription($scope.cacheStorageItem.ChiefComplaints);
                    $scope.ChangeIndividualHPIDiscription($scope.cacheStorageItem.ChiefComplaints);
                }

            

            }, function () { });
        }
        $scope.IsAddtotemplatepopup = false;
        $scope.Addtotemplatepopup = function () {
            $scope.clicktemplateschiefcomplaints("Addtitemplate");
        }

        $scope.ChangedHPIDiscription = function (ChiefComplaints) {
            var hpiList = [];
            let ChiefComplaintsArray = $filter("filter")(ChiefComplaints, { "ActiveInd": 'Y' }, true) || [];
            if (ChiefComplaintsArray.length > 0) {
                angular.forEach(ChiefComplaintsArray, function (item, index) {
                    if (index === 0) {
                        hpiList.push(' presents with/for ' + item.Description);
                    } else {
                        hpiList.push('Pt also presents with/for ' + item.Description);
                    }
                });
                $scope.newChiefCompaintObj.HistoryOfPresentIllness = $scope.cacheStorageItem.PatientName + hpiList.join('. ');
            } else {
                $scope.newChiefCompaintObj.HistoryOfPresentIllness = "";
            }
        };

        $scope.ClearHistoryOfPresentIllness = function () {
            $scope.newChiefCompaintObj.HistoryOfPresentIllness = '';
        }


        //$scope.Addtotemplatepopup = function () {
        //    let mInstanceShow = $uibModal.open({
        //        "templateUrl": "templates/UsNewConsultation/uibpopup/Addtotemplatepopup.html",
        //        "backdrop": "static",
        //   /*     "scope": $scope,*/
        //        //"size": "lg",
        //        "resolve": {
        //            "Gridcheifcomplaints": function () { return angular.copy($scope.CheifComplaitsSection.GridCheifComplaints) },
        //            "Cheifcomplaints": function () { return angular.copy($scope.cacheStorageItem.ChiefComplaints) },
        //            "Newcheifcomplaints": function () { return angular.copy($scope.newChiefCompaintObj.ChiefComplaints) },
        //           // "IsCreatenewTemplatesave": function () { return angular.copy($scope.IsCreatenewTemplatesave) }
        //         },
        //         "windowClass": "offcanves-right",
        //        "keyboard": false,

        //        "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteMasterDataService, Gridcheifcomplaints, Cheifcomplaints, Newcheifcomplaints) {
        //            var Gridcheifcomplaints = Gridcheifcomplaints || [];
        //            var Cheifcomplaints = Cheifcomplaints || [];
        //            var Newcheifcomplaints = Newcheifcomplaints || [];

        //            $scope.isPopoverOpen = false;
        //            $scope.Templatesearch = {
        //                "ConsulTemplate": "",
        //                "DiagnosisTemplate": "",
        //                "Viewtemplate": true,
        //                "SelectedDiagnosisTemaplte": "",
        //                "IsCreatenewTemplatesave": false,
        //                "TemplateName": "",
        //                "TemplateId": 0,
        //                "IsFavorite": false,
        //            }
        //            $scope.Templatesearch.IsCreatenewTemplatesave = false;
        //            $scope.Uibclose = function () {
        //                $uibModalInstance.dismiss("cancel");
        //            }
        //            $scope.IsAddtotemplatepopup = false;
        //            $scope.DiagnosisTemplatesArray = [];
        //            var doctorinfo = eHnoteMasterDataService.getUserInfo();
        //            $scope.maxSize = 50;
        //            $scope.AssescurrentPage = 1;
        //            $scope.AssespageChanged = function (AssescurrentPage) {
        //                $scope.AssescurrentPage = AssescurrentPage;
        //                $scope.GetUserConsultationTemplateDetails();
        //            }
        //            $scope.GetUserConsultationTemplateDetails = function () {
        //                var params = {
        //                    "UserId": doctorinfo.doctorid,
        //                    "SearchText": "",
        //                    "PageSize": 50,
        //                    "PageNumber": $scope.AssescurrentPage||1,
        //                    "OrganizationId":doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
        //                    "IsFavoriteInd": 0
        //                }
        //                eHnotePatientDataService.GetUserConsultationTemplateDetails(params).then(function (resp) {
        //                    if (resp.data.Status == "Success") {
        //                        $scope.totalItems = resp.data.Count;
        //                        $scope.DiagnosisTemplatesArray = resp.data.AssessmentsPlanArray || [];
        //                        $scope.ActionsTakenlist = resp.data.ConsultationActionsTaken || [];
        //                        $scope.DoctorNoteslist = resp.data.DoctorNotes || [];
        //                        $scope.PatientInstructionslist = resp.data.PatientInstructions || [];
        //                        $scope.AssessmentsNoteslist = resp.data.AssessmentsNotesTemplates || [];
        //                        $scope.PlanofDiscussionTemplateslist = resp.data.DiscussionTemplates || [];


        //                        $scope.AnteriorTemplatesArray = resp.data.ExaminationTemplatesArray || [];

        //                        /*$scope.DiagnosisTemplatesArray = $scope.DiagnosisTemplatesArray.concat($scope.MultipleAssessmentsPlanArray);*/
        //                        if ($scope.DiagnosisTemplatesArray.length > 0) {
        //                            angular.forEach($scope.DiagnosisTemplatesArray, function (mitem) {
        //                                mitem.IsEdit = false;
        //                                mitem.IsActiveTemplate = false;
        //                                //item.IsDescriptionEdit = false;
        //                                mitem.ChiefComplaintsArray = mitem.ChiefComplaintsArray || [];
        //                                mitem.InvestigationsArray = mitem.InvestigationsArray || [];
        //                                mitem.ProceduresArray = mitem.ProceduresArray || [];
        //                                mitem.SurgeryArray = mitem.SurgeryArray || [];
        //                                mitem.ReferralArray = mitem.ReferralArray || [];
        //                            });
        //                            $scope.DiagnosisTemplatesArray[0].IsEdit = true;
        //                            $scope.DiagnosisTemplatesArray[0].IsActiveTemplate = true;
        //                        }
        //                        /*   $scope.uibclose = function () {*/
        //                        if ($scope.IsAddtotemplatepopup) {
        //                            $uibModalInstance.dismiss("cancel");
        //                        }
        //                        $scope.IsAddtotemplatepopup = false;
        //                        /* };*/

        //                        if ($scope.AnteriorTemplatesArray.length > 0) {
        //                            angular.forEach($scope.AnteriorTemplatesArray, function (mitem) {
        //                                mitem.IsEdit = false;
        //                                //item.IsDescriptionEdit = false;
        //                            });
        //                            $scope.AnteriorTemplatesArray[0].IsEdit = true;
        //                        }
        //                        $scope.CopyDiagnosisTemplate = angular.copy($scope.DiagnosisTemplatesArray) || [];;
        //                    } else {
        //                        $scope.DiagnosisTemplatesArray = [];

        //                        $scope.ActionsTakenlist = [];
        //                        $scope.DoctorNoteslist = [];
        //                        $scope.PatientInstructionslist = [];
        //                        $scope.AssessmentsNoteslist = [];
        //                        $scope.PlanofDiscussionTemplateslist = [];
        //                        // $scope.MultipleAssessmentsPlanArray = []
        //                        $scope.AnteriorTemplatesArray = [];
        //                        $scope.CopyDiagnosisTemplate = [];
        //                    }

        //                }, function (err) {

        //                });
        //            }
        //            $scope.GetUserConsultationTemplateDetails();
        //            //$scope.Templatesearch = {
        //            //    "ConsulTemplate": "",
        //            //    "DiagnosisTemplate": "",
        //            //    "Viewtemplate": true,
        //            //    "SelectedDiagnosisTemaplte": "",
        //            //    "IsCreatenewTemplatesave": false,
        //            //    "TemplateName": "",
        //            //    "TemplateId": 0,
        //            //    "IsFavorite": false,
        //            //}
        //            $scope.SelectAssmtTemplate = function (item) {
        //                if ($scope.DiagnosisTemplatesArray.length > 0) {
        //                    angular.forEach($scope.DiagnosisTemplatesArray, function (ditem) {
        //                        ditem.IsActiveTemplate = false;
        //                    });
        //                    item.IsActiveTemplate = true;
        //                }
        //            };
        //            $scope.changeDiagnosisSearch = function (searchitem) {



        //                if (searchitem != "") {
        //                    var filtertemplate = $filter("filter")($scope.CopyDiagnosisTemplate, { "TemplateName": searchitem })||[];
        //                    $scope.DiagnosisTemplatesArray = angular.copy(filtertemplate);
        //                    if ($scope.DiagnosisTemplatesArray.length === 0) {

        //                    }
        //                } else {
        //                    $scope.DiagnosisTemplatesArray = angular.copy($scope.CopyDiagnosisTemplate);
        //                }
        //                if ($scope.DiagnosisTemplatesArray.length > 0) {
        //                    angular.forEach($scope.DiagnosisTemplatesArray, function (ditem) {
        //                        ditem.IsActiveTemplate = false;
        //                    });
        //                    $scope.DiagnosisTemplatesArray[0].IsActiveTemplate = true;
        //                }
        //            }
        //            $scope.EditDiagnosisTemplate = function (templatedetails) {
        //                $scope.IsAddtotemplatepopup = true;
        //                $scope.Templatesearch.TemplateName = templatedetails.TemplateName;
        //                $scope.Templatesearch.TemplateId = templatedetails.TemplateId;
        //                $scope.Templatesearch.IsFavorite = templatedetails.IsTemplateFavorites || false;
        //                $scope.DiagnosisTemplateId = templatedetails.TemplateId;
        //                $scope.ConsultationTemplatepop = false;
        //                $scope.AllCheifcomplaints = [];
        //                $scope.MedicineObjArray = [];
        //                $scope.OrderInvestigation = [];
        //                $scope.OrderProceduresArray = [];
        //                $scope.OrderSurgeryArray = [];
        //                $scope.OrderReferalArray = [];
        //                $scope.TempPrescriptionDetails = [];
        //                $scope.TempAnteriorArray = [];
        //                $scope.TempPosteriorArray = [];

        //                $scope.submitDiagnosis = templatedetails.DiagnosisArray || [];
        //                $scope.ActualAnteriorValuesArray = templatedetails.AnteriorValuesArray || [];
        //                $scope.ActualPosteriorValuesArray = templatedetails.PosteriorValuesArray || [];
        //                $scope.ActualExternalExaminationsValuesArray = templatedetails.ExternalExaminationsValuesArray || [];
        //                $scope.OrderInvestigationArray = templatedetails.InvestigationsArray || [];
        //                $scope.OrderProceduresArray = templatedetails.ProceduresArray || [];
        //                $scope.OrderSurgeryArray = templatedetails.SurgeryArray || [];
        //                $scope.OrderReferalArray = templatedetails.ReferralArray || [];
        //                $scope.TempAnteriorArray = templatedetails.AnteriorValuesArray || [];
        //                $scope.TempPosteriorArray = templatedetails.PosteriorValuesArray || [];






        //                if (templatedetails.ChiefComplaintsArray.length > 0) {
        //                    $scope.AllCheifcomplaints = angular.copy(templatedetails.ChiefComplaintsArray);
        //                }
        //                if ($scope.AllCheifcomplaints.length > 0) {
        //                    if (Gridcheifcomplaints == 2) {
        //                        if (Cheifcomplaints.length > 0) {

        //                            // angular.forEach($scope.AllCheifcomplaints, function (miditem) {

        //                            //var List = $filter("filter")($scope.cacheStorageItem.ChiefComplaints, function (item) {
        //                            //    return (item.ChiefComplaintName === object.ChiefComplaintName && item.ActiveInd === 'Y');
        //                            //});

        //                            angular.forEach(Cheifcomplaints, function (citem) {
        //                                var filterdiagnosis = $filter("filter")($scope.AllCheifcomplaints, function (miditem) { return miditem.ChiefComplaintId == citem.ChiefComplaintId; }) || [];
        //                                //var i = 0
        //                                //if (miditem.ChiefComplaintId == citem.ChiefComplaintId && citem.ActiveInd == 'Y') {
        //                                //    i++
        //                                //}
        //                                if (filterdiagnosis.length == 0) {
        //                                    var object = {
        //                                        "ActiveInd": citem.ActiveInd || "",
        //                                        "Duration": citem.Duration || null,
        //                                        "SeverityId": citem.SeverityId || null,
        //                                        "DurationType": citem.DurationType || "",
        //                                        "ModifyFactorId": citem.ModifyFactorId || null,
        //                                        "QualityId": citem.QualityId || null,
        //                                        "ContextId": citem.ContextId || null,
        //                                        "AssosSignId": citem.AssosSignId || null,
        //                                        "EyeDurationId": citem.EyeDurationId || null,
        //                                        "OrganId": citem.OrganId || null,
        //                                        "ChiefComplaintId": citem.ChiefComplaintId || null,
        //                                        "TemplateChiefComplaintId": citem.TemplateChiefComplaintId || null,
        //                                        "Description": citem.Description || "",
        //                                        "IsDescriptionEdit": citem.IsDescriptionEdit || false
        //                                    }

        //                                    $scope.AllCheifcomplaints.push(object);
        //                                }
        //                            });

        //                            // });
        //                        }
        //                    } else if (Gridcheifcomplaints == 1) {
        //                        if (Newcheifcomplaints.length > 0) {

        //                            // angular.forEach($scope.AllCheifcomplaints, function (miditem) {
        //                            //var List = $filter("filter")($scope.cacheStorageItem.ChiefComplaints, function (item) {
        //                            //    return (item.ChiefComplaintName === object.ChiefComplaintName && item.ActiveInd === 'Y');
        //                            //});

        //                            angular.forEach(Newcheifcomplaints, function (citem) {
        //                                var filterdiagnosis = $filter("filter")($scope.AllCheifcomplaints, function (miditem) { return miditem.ChiefComplaintId == citem.ChiefComplaintId; }) || [];
        //                                //var i = 0
        //                                //if (miditem.ChiefComplaintId == citem.ChiefComplaintId && citem.ActiveInd == 'Y') {
        //                                //    i++
        //                                //}
        //                                if (filterdiagnosis.length > 0) {
        //                                    var object = {
        //                                        "ActiveInd": citem.ActiveInd || "",
        //                                        "Duration": citem.Duration || null,
        //                                        "SeverityId": citem.SeverityId || null,
        //                                        "DurationType": citem.DurationType || "",
        //                                        "ModifyFactorId": citem.ModifyFactorId || null,
        //                                        "QualityId": citem.QualityId || null,
        //                                        "ContextId": citem.ContextId || null,
        //                                        "AssosSignId": citem.AssosSignId || null,
        //                                        "EyeDurationId": citem.EyeDurationId || null,
        //                                        "OrganId": citem.OrganId || null,
        //                                        "ChiefComplaintId": citem.ChiefComplaintId || null,
        //                                        "TemplateChiefComplaintId": citem.TemplateChiefComplaintId || null,
        //                                        "Description": citem.Description || "",
        //                                        "IsDescriptionEdit": citem.IsDescriptionEdit || false
        //                                    }

        //                                    $scope.AllCheifcomplaints.push(object);
        //                                }
        //                            });

        //                            // });
        //                        }
        //                    }
        //                } else if ($scope.AllCheifcomplaints.length == 0) {
        //                    if (Cheifcomplaints.length > 0) {
        //                        angular.forEach(Cheifcomplaints, function (citem) {
        //                            var filterdiagnosis = $filter("filter")($scope.AllCheifcomplaints, function (miditem) { return miditem.ChiefComplaintId == citem.ChiefComplaintId; }) || [];
        //                            if (filterdiagnosis.length == 0) {
        //                                var object = {
        //                                    "ActiveInd": citem.ActiveInd || "",
        //                                    "Duration": citem.Duration || null,
        //                                    "SeverityId": citem.SeverityId || null,
        //                                    "DurationType": citem.DurationType || "",
        //                                    "ModifyFactorId": citem.ModifyFactorId || null,
        //                                    "QualityId": citem.QualityId || null,
        //                                    "ContextId": citem.ContextId || null,
        //                                    "AssosSignId": citem.AssosSignId || null,
        //                                    "EyeDurationId": citem.EyeDurationId || null,
        //                                    "OrganId": citem.OrganId || null,
        //                                    "ChiefComplaintId": citem.ChiefComplaintId || null,
        //                                    "TemplateChiefComplaintId": citem.TemplateChiefComplaintId || null,
        //                                    "Description": citem.Description || "",
        //                                    "IsDescriptionEdit": citem.IsDescriptionEdit || false
        //                                }

        //                                $scope.AllCheifcomplaints.push(object);
        //                            }
        //                        });
        //                    }
        //                } else {}
        //                $scope.TempPrescriptionDetails = templatedetails.MedicationsArray || [];
        //                angular.forEach($scope.TempPrescriptionDetails, function (miditem) {
        //                    miditem.SigObj = miditem.Sig;

        //                });

        //                var params = {
        //                    "UserId": doctorinfo.doctorid,
        //                    "OrganizationId": $scope.HospitalID,
        //                    "TemplateId": $scope.Templatesearch.TemplateId || 0,
        //                    "TemplateName": $scope.Templatesearch.TemplateName || '',
        //                    "DiagnosisArray": $scope.submitDiagnosis || [],
        //                    "MedicationsArray": $scope.TempPrescriptionDetails || [],
        //                    "AnteriorSegmentArrayNew": $scope.TempAnteriorArray || [],
        //                    "PoteriorSegmentArrayNew": $scope.TempPosteriorArray || [],
        //                    "ExternalExaminationsValuesArray": $scope.ActualExternalExaminationsValuesArray,
        //                    "DeleteInd": 0,
        //                    "IsTemplateFavorites": $scope.Templatesearch.IsFavorite || false,
        //                    "IsDiagnosisMultiple": false,
        //                    "SetasTemplate": false,
        //                    "InvestigationsArray": $scope.OrderInvestigationArray,
        //                    "ProceduresArray": $scope.OrderProceduresArray,
        //                    "SurgeryArray": $scope.OrderSurgeryArray,
        //                    "ReferralArray": $scope.OrderReferalArray,
        //                    "ChiefComplaintsArray": $scope.AllCheifcomplaints || [],
        //                }

        //                eHnotePatientDataService.AddUpdateUserConsultationTemplateDetails(params).then(function (resp) {
        //                    if (resp.data.Status === "Failure") {
        //                        $scope.message = [];
        //                        $scope.message = resp.data.Message.split(':');
        //                        if ($scope.message.length > 0) {
        //                            alertify.error($scope.message[1]);
        //                        } else {
        //                            alertify.error(resp.data.Message);
        //                        }
        //                    } else {
        //                        $scope.GetUserConsultationTemplateDetails();


        //                        if ($scope.DiagnosisTemplateId === 0) {
        //                            alertify.success("Save successfully");
        //                        } else {
        //                            alertify.success("Update successfully");
        //                        }
        //                    }
        //                }, function (err) {

        //                });

        //            };
        //        }
        //    });
        ////    $scope.DiagnosisTemplatesArray = [];
        ////    //$scope.GetUserConsultationTemplateDetails = function () {
        ////    //    var params = {
        ////    //        "UserId": $scope.UserId,
        ////    //        "SearchText": "",
        ////    //        "PageSize": 1000,
        ////    //        "PageNumber": 1,
        ////    //        "OrganizationId": $scope.HospitalId,
        ////    //        "IsFavoriteInd": 0
        ////    //    }
        ////    //    eHnotePatientDataService.GetUserConsultationTemplateDetails(params).then(function (resp) {
        ////    //        if (resp.data.Status == "Success") {
        ////    //            $scope.DiagnosisTemplatesArray = resp.data.AssessmentsPlanArray || [];
        ////    //            $scope.ActionsTakenlist = resp.data.ConsultationActionsTaken || [];
        ////    //            $scope.DoctorNoteslist = resp.data.DoctorNotes || [];
        ////    //            $scope.PatientInstructionslist = resp.data.PatientInstructions || [];
        ////    //            $scope.AssessmentsNoteslist = resp.data.AssessmentsNotesTemplates || [];
        ////    //            $scope.PlanofDiscussionTemplateslist = resp.data.DiscussionTemplates || [];


        ////    //            $scope.AnteriorTemplatesArray = resp.data.ExaminationTemplatesArray || [];

        ////    //            /*$scope.DiagnosisTemplatesArray = $scope.DiagnosisTemplatesArray.concat($scope.MultipleAssessmentsPlanArray);*/
        ////    //            if ($scope.DiagnosisTemplatesArray.length > 0) {
        ////    //                angular.forEach($scope.DiagnosisTemplatesArray, function (mitem) {
        ////    //                    mitem.IsEdit = false;
        ////    //                    mitem.IsActiveTemplate = false;
        ////    //                    //item.IsDescriptionEdit = false;
        ////    //                    mitem.ChiefComplaintsArray = mitem.ChiefComplaintsArray || [];
        ////    //                    mitem.InvestigationsArray = mitem.InvestigationsArray || [];
        ////    //                    mitem.ProceduresArray = mitem.ProceduresArray || [];
        ////    //                    mitem.SurgeryArray = mitem.SurgeryArray || [];
        ////    //                    mitem.ReferralArray = mitem.ReferralArray || [];
        ////    //                });
        ////    //                $scope.DiagnosisTemplatesArray[0].IsEdit = true;
        ////    //                $scope.DiagnosisTemplatesArray[0].IsActiveTemplate = true;
        ////    //            }

        ////    //            //if ($scope.IsAddtotemplatepopup) {
        ////    //            //    $uibModalInstance.dismiss("cancel");
        ////    //            //}
        ////    //            //$scope.IsAddtotemplatepopup = false;

        ////    //            if ($scope.AnteriorTemplatesArray.length > 0) {
        ////    //                angular.forEach($scope.AnteriorTemplatesArray, function (mitem) {
        ////    //                    mitem.IsEdit = false;
        ////    //                    //item.IsDescriptionEdit = false;
        ////    //                });
        ////    //                $scope.AnteriorTemplatesArray[0].IsEdit = true;
        ////    //            }
        ////    //            $scope.CopyDiagnosisTemplate = angular.copy($scope.DiagnosisTemplatesArray) || [];;
        ////    //        } else {
        ////    //            $scope.DiagnosisTemplatesArray = [];

        ////    //            $scope.ActionsTakenlist = [];
        ////    //            $scope.DoctorNoteslist = [];
        ////    //            $scope.PatientInstructionslist = [];
        ////    //            $scope.AssessmentsNoteslist = [];
        ////    //            $scope.PlanofDiscussionTemplateslist = [];
        ////    //            // $scope.MultipleAssessmentsPlanArray = []
        ////    //            $scope.AnteriorTemplatesArray = [];
        ////    //            $scope.CopyDiagnosisTemplate = [];
        ////    //        }

        ////    //    }, function (err) {

        ////    //    });
        ////    //}
        ////    //$scope.GetUserConsultationTemplateDetails();
        ////    $scope.Templatesearch = {
        ////        "ConsulTemplate": "",
        ////        "DiagnosisTemplate": "",
        ////        "Viewtemplate": true,
        ////        "SelectedDiagnosisTemaplte": "",
        ////        "IsCreatenewTemplatesave": false,
        ////        "TemplateName": "",
        ////        "TemplateId": 0,
        ////        "IsFavorite": false,
        ////    }
        ////    $scope.SelectAssmtTemplate = function (item) {
        ////        if ($scope.DiagnosisTemplatesArray.length > 0) {
        ////            angular.forEach($scope.DiagnosisTemplatesArray, function (ditem) {
        ////                ditem.IsActiveTemplate = false;
        ////            });
        ////            item.IsActiveTemplate = true;
        ////        }
        ////    };
        ////    $scope.changeDiagnosisSearch = function (searchitem) {



        ////        if (searchitem != "") {
        ////            var filtertemplate = $filter("filter")($scope.CopyDiagnosisTemplate, { "TemplateName": searchitem });
        ////            $scope.DiagnosisTemplatesArray = angular.copy(filtertemplate);
        ////            if ($scope.DiagnosisTemplatesArray.length === 0) {

        ////            }
        ////        } else {
        ////            $scope.DiagnosisTemplatesArray = angular.copy($scope.CopyDiagnosisTemplate);
        ////        }
        ////        if ($scope.DiagnosisTemplatesArray.length > 0) {
        ////            angular.forEach($scope.DiagnosisTemplatesArray, function (ditem) {
        ////                ditem.IsActiveTemplate = false;
        ////            });
        ////            $scope.DiagnosisTemplatesArray[0].IsActiveTemplate = true;
        ////        }
        ////    }
        ////    $scope.EditDiagnosisTemplate = function (templatedetails) {
        ////        $scope.IsAddtotemplatepopup = true;
        ////        $scope.Templatesearch.TemplateName = templatedetails.TemplateName;
        ////        $scope.Templatesearch.TemplateId = templatedetails.TemplateId;
        ////        $scope.Templatesearch.IsFavorite = templatedetails.IsTemplateFavorites || false;
        ////        $scope.DiagnosisTemplateId = templatedetails.TemplateId;
        ////        $scope.ConsultationTemplatepop = false;
        ////        $scope.AllCheifcomplaints = [];
        ////        $scope.MedicineObjArray = [];
        ////        $scope.OrderInvestigation = [];
        ////        $scope.OrderProceduresArray = [];
        ////        $scope.OrderSurgeryArray = [];
        ////        $scope.OrderReferalArray = [];
        ////        $scope.TempPrescriptionDetails = [];
        ////        $scope.TempAnteriorArray = [];
        ////        $scope.TempPosteriorArray = [];

        ////        $scope.submitDiagnosis = templatedetails.DiagnosisArray || [];
        ////        $scope.ActualAnteriorValuesArray = templatedetails.AnteriorValuesArray || [];
        ////        $scope.ActualPosteriorValuesArray = templatedetails.PosteriorValuesArray || [];
        ////        $scope.ActualExternalExaminationsValuesArray = templatedetails.ExternalExaminationsValuesArray || [];
        ////        $scope.OrderInvestigationArray = templatedetails.InvestigationsArray || [];
        ////        $scope.OrderProceduresArray = templatedetails.ProceduresArray || [];
        ////        $scope.OrderSurgeryArray = templatedetails.SurgeryArray || [];
        ////        $scope.OrderReferalArray = templatedetails.ReferralArray || [];
        ////        $scope.TempAnteriorArray = templatedetails.AnteriorValuesArray || [];
        ////        $scope.TempPosteriorArray = templatedetails.PosteriorValuesArray || [];





        ////        if (templatedetails.ChiefComplaintsArray.length > 0) {
        ////            $scope.AllCheifcomplaints = angular.copy(templatedetails.ChiefComplaintsArray);
        ////        }
        ////        if ($scope.AllCheifcomplaints.length > 0) {
        ////            if ($scope.CheifComplaitsSection.GridCheifComplaints == 2) {
        ////                if ($scope.cacheStorageItem.ChiefComplaints.length > 0) {

        ////                    // angular.forEach($scope.AllCheifcomplaints, function (miditem) {

        ////                    //var List = $filter("filter")($scope.cacheStorageItem.ChiefComplaints, function (item) {
        ////                    //    return (item.ChiefComplaintName === object.ChiefComplaintName && item.ActiveInd === 'Y');
        ////                    //});

        ////                    angular.forEach($scope.cacheStorageItem.ChiefComplaints, function (citem) {
        ////                        var filterdiagnosis = $filter("filter")($scope.AllCheifcomplaints, function (miditem,) { return miditem.ChiefComplaintId == citem.ChiefComplaintId; }) || [];
        ////                        //var i = 0
        ////                        //if (miditem.ChiefComplaintId == citem.ChiefComplaintId && citem.ActiveInd == 'Y') {
        ////                        //    i++
        ////                        //}
        ////                        if (filterdiagnosis.length == 0) {
        ////                            var object = {
        ////                                "ActiveInd": citem.ActiveInd || "",
        ////                                "Duration": citem.Duration || null,
        ////                                "SeverityId": citem.SeverityId || null,
        ////                                "DurationType": citem.DurationType || "",
        ////                                "ModifyFactorId": citem.ModifyFactorId || null,
        ////                                "QualityId": citem.QualityId || null,
        ////                                "ContextId": citem.ContextId || null,
        ////                                "AssosSignId": citem.AssosSignId || null,
        ////                                "EyeDurationId": citem.EyeDurationId || null,
        ////                                "OrganId": citem.OrganId || null,
        ////                                "ChiefComplaintId": citem.ChiefComplaintId || null,
        ////                                "TemplateChiefComplaintId": citem.TemplateChiefComplaintId || null,
        ////                                "Description": citem.Description || "",
        ////                                "IsDescriptionEdit": citem.IsDescriptionEdit || false
        ////                            }

        ////                            $scope.AllCheifcomplaints.push(object);
        ////                        }
        ////                    });

        ////                    // });
        ////                }
        ////            } else if ($scope.CheifComplaitsSection.GridCheifComplaints == 1) {
        ////                if ($scope.newChiefCompaintObj.ChiefComplaints.length > 0) {

        ////                    // angular.forEach($scope.AllCheifcomplaints, function (miditem) {
        ////                    //var List = $filter("filter")($scope.cacheStorageItem.ChiefComplaints, function (item) {
        ////                    //    return (item.ChiefComplaintName === object.ChiefComplaintName && item.ActiveInd === 'Y');
        ////                    //});

        ////                    angular.forEach($scope.newChiefCompaintObj.ChiefComplaints, function (citem) {
        ////                        var filterdiagnosis = $filter("filter")($scope.AllCheifcomplaints, function (miditem,) { return miditem.ChiefComplaintId == citem.ChiefComplaintId; }) || [];
        ////                        //var i = 0
        ////                        //if (miditem.ChiefComplaintId == citem.ChiefComplaintId && citem.ActiveInd == 'Y') {
        ////                        //    i++
        ////                        //}
        ////                        if (filterdiagnosis.length > 0) {
        ////                            var object = {
        ////                                "ActiveInd": citem.ActiveInd || "",
        ////                                "Duration": citem.Duration || null,
        ////                                "SeverityId": citem.SeverityId || null,
        ////                                "DurationType": citem.DurationType || "",
        ////                                "ModifyFactorId": citem.ModifyFactorId || null,
        ////                                "QualityId": citem.QualityId || null,
        ////                                "ContextId": citem.ContextId || null,
        ////                                "AssosSignId": citem.AssosSignId || null,
        ////                                "EyeDurationId": citem.EyeDurationId || null,
        ////                                "OrganId": citem.OrganId || null,
        ////                                "ChiefComplaintId": citem.ChiefComplaintId || null,
        ////                                "TemplateChiefComplaintId": citem.TemplateChiefComplaintId || null,
        ////                                "Description": citem.Description || "",
        ////                                "IsDescriptionEdit": citem.IsDescriptionEdit || false
        ////                            }

        ////                            $scope.AllCheifcomplaints.push(object);
        ////                        }
        ////                    });

        ////                    // });
        ////                }
        ////            }
        ////        }
        ////        $scope.TempPrescriptionDetails = templatedetails.MedicationsArray || [];
        ////        angular.forEach($scope.TempPrescriptionDetails, function (miditem) {
        ////            miditem.SigObj = miditem.Sig;

        ////        });

        ////        var params = {
        ////            "UserId": doctorinfo.doctorid,
        ////            "OrganizationId": $scope.HospitalID,
        ////            "TemplateId": $scope.Templatesearch.TemplateId || 0,
        ////            "TemplateName": $scope.Templatesearch.TemplateName || '',
        ////            "DiagnosisArray": $scope.submitDiagnosis || [],
        ////            "MedicationsArray": $scope.TempPrescriptionDetails || [],
        ////            "AnteriorSegmentArrayNew": $scope.TempAnteriorArray || [],
        ////            "PoteriorSegmentArrayNew": $scope.TempPosteriorArray || [],
        ////            "ExternalExaminationsValuesArray": $scope.ActualExternalExaminationsValuesArray,
        ////            "DeleteInd": 0,
        ////            "IsTemplateFavorites": $scope.Templatesearch.IsFavorite || false,
        ////            "IsDiagnosisMultiple": false,
        ////            "SetasTemplate": false,
        ////            "InvestigationsArray": $scope.OrderInvestigationArray,
        ////            "ProceduresArray": $scope.OrderProceduresArray,
        ////            "SurgeryArray": $scope.OrderSurgeryArray,
        ////            "ReferralArray": $scope.OrderReferalArray,
        ////            "ChiefComplaintsArray": $scope.AllCheifcomplaints || [],
        ////        }

        ////        eHnotePatientDataService.AddUpdateUserConsultationTemplateDetails(params).then(function (resp) {
        ////            if (resp.data.Status === "Failure") {
        ////                $scope.message = [];
        ////                $scope.message = resp.data.Message.split(':');
        ////                if ($scope.message.length > 0) {
        ////                    alertify.error($scope.message[1]);
        ////                } else {
        ////                    alertify.error(resp.data.Message);
        ////                }
        ////            } else {
        ////                $scope.GetUserConsultationTemplateDetails();


        ////                if ($scope.DiagnosisTemplateId === 0) {
        ////                    alertify.success("Save successfully");
        ////                } else {
        ////                    alertify.success("Update successfully");
        ////                }
        ////            }
        ////        }, function (err) {

        ////        });

        ////    };
        ////}



        //};
        $scope.sectionCollapse = true;
        $scope.collapseAndViewSection = function () {
            if ($scope.sectionCollapse == true) {
                $scope.sectionCollapse = false;
            } else {
                $scope.sectionCollapse = true;
            }

        }

        function isTouchDevice() {
            return (
                (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
                navigator.maxTouchPoints > 1 ||
                'ontouchstart' in window
            );
        }

        // screen.width is zoom-independent (browser zoom changes innerWidth, NOT screen.width)
        function getPhysicalWidth() {
            return window.screen.width || window.innerWidth;
        }

        var physicalWidth = getPhysicalWidth();
        var touch = isTouchDevice();

        // Real tablet ONLY if it's a touch device AND in the 768-1366 physical width range
        $scope.IsCCTablet = touch && physicalWidth >= 768 && physicalWidth <= 1366;

        $scope.DeleteCheifComplaintsNew = function (obs) {

            var index = $scope.newChiefCompaintObj.ChiefComplaints.indexOf(obs);

            if (index > -1) {

                var wasEditing = obs.IsEdit;

                if (obs.PatientChiefComplaintId !== 0) {
                    $scope.newChiefCompaintObj.ChiefComplaints[index].ActiveInd = "N";
                    $scope.newChiefCompaintObj.ChiefComplaints[index].IsEdit = false;
                } else {
                    $scope.newChiefCompaintObj.ChiefComplaints.splice(index, 1);
                }

                // If the deleted item was the edited one,
                // make the last active item editable.
                if (wasEditing) {

                    angular.forEach($scope.newChiefCompaintObj.ChiefComplaints, function (item) {
                        item.IsEdit = false;
                    });

                    var activeItems = $scope.newChiefCompaintObj.ChiefComplaints.filter(function (item) {
                        return item.ActiveInd === "Y";
                    });

                    if (activeItems.length > 0) {
                        activeItems[activeItems.length - 1].IsEdit = true;
                    }
                }
            }

            $scope.cacheStorageItem.ChiefComplaints = angular.copy($scope.newChiefCompaintObj.ChiefComplaints);
            //$scope.ChangedHPIDiscription($scope.cacheStorageItem.ChiefComplaints);
            $scope.ChangeIndividualHPIDiscription($scope.cacheStorageItem.ChiefComplaints);
        };


        $scope.changeChiefComplaintNew = function (item) {
            item.IsDescriptionEdit = true;
            //$scope.ChangedHPIDiscription($scope.newChiefCompaintObj.ChiefComplaints)
            $scope.ChangeIndividualHPIDiscription($scope.newChiefCompaintObj.ChiefComplaints)

        }

    }]);
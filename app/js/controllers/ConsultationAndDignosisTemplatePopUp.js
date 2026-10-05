"use strict";

eHnoteWebApp.controller("ConsultationAndDignosisTemplatePopUp", ["$scope", "$http", "$log", "$rootScope", "$compile", "$q", "$location", "$ocLazyLoad", "$uibModal", "$routeParams", "$filter", "$timeout", "eHnoteMainAppointmentService", "eHnoteLoginStatusService", "eHnoteDiagnosisDataServices", "datapersistanceFactory", "eHnoteMasterDataService", "eHnotePatientDataService", "eHnoteProcedureDataService", "alertify", "eHnoteCacheStorageService", "Lightbox", "$anchorScroll", "anchorSmoothScroll", "eHnoteSettingsDataService", "eHnoteConditionsDataService", "eHnotePatientAddressDataServices", "eHnoteMainAdminServices", "eHnoteDbStaticDataService", "SurgeryStaticDataService", "loginCookieFactory", "localStorageFactory", "eHnoteSurgeryService", "eHnoteLabService", "eHnoteUserAppointmentDataService", "eHnoteUserDataService", "eHnoteReferalDataService", "eHnotePrintService", "$interval", "DeCodeFilter", "eHnotePatientPVService", "eHnotePatientVisitReasonServices", "InventoryService", function ($scope, $http, $log, $rootScope, $compile, $q, $location, $ocLazyLoad, $uibModal, $routeParams, $filter, $timeout, eHnoteMainAppointmentService, eHnoteLoginStatusService, eHnoteDiagnosisDataServices, datapersistanceFactory, eHnoteMasterDataService, eHnotePatientDataService, eHnoteProcedureDataService, alertify, eHnoteCacheStorageService, Lightbox, $anchorScroll, anchorSmoothScroll, eHnoteSettingsDataService, eHnoteConditionsDataService, eHnotePatientAddressDataServices, eHnoteMainAdminServices, eHnoteDbStaticDataService, SurgeryStaticDataService, loginCookieFactory, localStorageFactory, eHnoteSurgeryService, eHnoteLabService, eHnoteUserAppointmentDataService, eHnoteUserDataService, eHnoteReferalDataService, eHnotePrintService, $interval, DeCodeFilter, eHnotePatientPVService, eHnotePatientVisitReasonServices, InventoryService) {

  
    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.User = {};
    $scope.User.UserId = eHnoteMasterDataService.getLoginId();
    $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    $scope.GetConsulTemplate = function () {
        var tappid = appointmentinfo.DoctorID ? appointmentinfo.DoctorID : $scope.User.UserId;
        appointmentinfo.OptometristId = appointmentinfo.OptometristId || null;
        if ($scope.RoleId === 10 || $scope.RoleId === 61) {
            tappid = appointmentinfo.OptometristId === null ? $scope.User.UserId : appointmentinfo.OptometristId;
        }
        var IsFavoriteInd = 0;
        eHnotePatientDataService.GetLatestUserConsultationMasterTemplateDtls(tappid, IsFavoriteInd).then(function (resp) {
            if (resp.data !== undefined) {
                if (resp.data.rows.length > 0) {
                    $scope.RestructuredDocInvTemplates = [];
                    $scope.RestructuredDocInvTemplates = resp.data.rows || [];
                    $scope.CopyConsultationTempale = angular.copy($scope.RestructuredDocInvTemplates);

                    angular.forEach($scope.RestructuredDocInvTemplates, function (item) {
                        item.SetAsTemplate = false;
                        if (item.IssetasDefaultTemplete) {
                            item.SetAsTemplate = true;
                        }
                    });

                } else {

                    $scope.RestructuredDocInvTemplates = [];
                }
            }
        }, function (error) {
        });
    };
    $scope.GetConsulTemplate();

    $scope.Show = {
        "DiagnosisList": []
    };
    $scope.accordionStatus = {
        'open': true
    };
    $scope.cacheStorageItem.AnteriorODIsNormal = false;
    $scope.cacheStorageItem.AnteriorOSIsNormal = false;
    $scope.cacheStorageItem.PosteriorODIsNormal = false;
    $scope.cacheStorageItem.PosteriorOSIsNormal = false;

    $scope.ConsultationTemplatepop = true;
    $scope.DiagnosisTemplatepop = false;
    $scope.CopyConsultationTempale = [];
    angular.forEach($scope.RestructuredDocInvTemplates, function (item) {
        item.SetAsTemplate = false;
        if (item.IssetasDefaultTemplete) {
            item.SetAsTemplate = true;
        }
    });
    $scope.CopyConsultationTempale = angular.copy($scope.RestructuredDocInvTemplates);
    $scope.CopyDiagnosisTemplate = [];
    angular.forEach($scope.DiagnosisTemplatesArray, function (item) {
        item.SetasTemaplte = false;
        item.IsTemplateFavorites = item.IsTemplateFavorites || false;
    });
    $scope.DiagnosisTemplatesArray = angular.copy($scope.Show.DiagnosisList);
    $scope.CopyDiagnosisTemplate = angular.copy($scope.DiagnosisTemplatesArray);
    $scope.Templatesearch = {
        "ConsulTemplate": "",
        "DiagnosisTemplate": "",
        "Viewtemplate": true,
        "SelectedDiagnosisTemaplte": ""
    }
    $scope.diagnosis = {
        "TemplateName": "",
        "TemplateId": 0,
        "IsFavorite": false,
        "IsConTemplateFavorite": false
    };
    $scope.viewlist = {
        "TemplateIsFavorite": true,
        "DiagnosisIsFavorite": true
    };

    console.log($scope.cacheStorageItem.AnteriorDetails);
    console.log($scope.cacheStorageItem.PosteriorDetails);
    console.log($scope.cacheStorageItem.ExternalExaminationDetails);

    $scope.GetAllMasterConsultationData = function () {
        eHnoteDiagnosisDataServices.GetAllMasterConsultationData().then(function (resp) {
            if (resp.data.status === "Success") {

                $scope.AssesmentPlanStatusList = resp.data.AssesmentPlanStatus || [];
                $scope.CareEpisodeList = resp.data.CareEpisode || [];
            }

        });
    }

    $scope.getSnomedCodes = function (val, item) {
        $scope.SearchText = val || "";
        var params = {
            "DiagnosisId": item.DiagnosisId || 0,
            "SearchText": $scope.SearchText,
            "PageSize": 20,
            "PageNumber": 1
        }
        return eHnoteSettingsDataService.getMasterSnomedCodes(params).then(function (resp) {
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
  

    $scope.GetAllMasterConsultationData();

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


    $scope.examinationcategories = [
        {
            "CategoryId": 5,
            "CategoryName": "Anterior Segment"
        },
        {
            "CategoryId": 6,
            "CategoryName": "Posterior Segment"
        },
        //{
        //    "CategoryId": 12,
        //    "CategoryName": "External Examinations"
        //}
    ]

    $scope.examinationObj = {
        "CategoryId": "",
        "FindingsArray": [],
        "SelectedEye": 1,
        "InvestigationId": "",
        "SubCategoryChildId": "",
        "InvestigationDesc": "",
        "DiagnosisRiskLevel": "Mild",
        "IsShowAnterior": "Y",
        "FindingValueObj": "",
        "OSFindingValueObj": "",
        "ShowAddNewBtn": false,

    };

    $scope.PosteriorexaminationObj = {
        "CategoryId": "",
        "FindingsArray": [],
        "SelectedEye": 1,
        "InvestigationId": "",
        "SubCategoryChildId": "",
        "InvestigationDesc": "",
        "DiagnosisRiskLevel": "Mild",
        "IsShowAnterior": "Y",
        "FindingValueObj": "",      
        "OSFindingValueObj": "",
        "ShowAddNewBtn": false,
    };

    $scope.onloadfunction = function () {

        if ($scope.cacheStorageItem.AnteriorDetails.length > 0) {
            $scope.examinationObj.CategoryId = $scope.cacheStorageItem.AnteriorDetails[0].CategoryId;
            angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (kitem) {
                var obj = {
                    "InvestigationDesc": kitem.InvestigationDesc,
                    "InvestigationId": kitem.InvestigationId,
                    "SubCategoryChildId": kitem.SubCategoryChildId,
                    "RightEyeRemarksArray": [],
                    "LeftEyeRemarksArray": [],
                    "BothyeRemarksArray": []
                };
                $scope.examinationObj.FindingsArray.push(obj);
            });
        }
        if ($scope.cacheStorageItem.PosteriorDetails.length > 0) {
            $scope.PosteriorexaminationObj.CategoryId = $scope.cacheStorageItem.PosteriorDetails[0].CategoryId;
            angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (kitem) {
                var obj = {
                    "InvestigationDesc": kitem.InvestigationDesc,
                    "InvestigationId": kitem.InvestigationId,
                    "SubCategoryChildId": kitem.SubCategoryChildId,
                    "RightEyeRemarksArray": [],
                    "LeftEyeRemarksArray": [],
                    "BothyeRemarksArray": []
                };
                $scope.PosteriorexaminationObj.FindingsArray.push(obj);
            });
        }

    }
    $scope.onloadfunction();

    $scope.ActualAnteriorValuesArray = [];
    $scope.ActualPosteriorValuesArray = [];
    $scope.ActualExternalExaminationsValuesArray = [];

    $scope.changeInvestigationFinding = function (mainobj,type) {

        console.log(mainobj);

        if (type == 'Anterior') {
            var filterOrderArray = $filter("filter")($scope.examinationObj.FindingsArray, { "InvestigationId": mainobj.InvestigationId }, true) || [];
            if (filterOrderArray.length > 0) {
                $scope.examinationObj.InvestigationDesc = filterOrderArray[0].InvestigationDesc;
                $scope.examinationObj.SubCategoryChildId = filterOrderArray[0].SubCategoryChildId;
            }
        } else {
            var filterOrderArray = $filter("filter")($scope.PosteriorexaminationObj.FindingsArray, { "InvestigationId": mainobj.InvestigationId }, true) || [];
            if (filterOrderArray.length > 0) {
                $scope.PosteriorexaminationObj.InvestigationDesc = filterOrderArray[0].InvestigationDesc;
                $scope.PosteriorexaminationObj.SubCategoryChildId = filterOrderArray[0].SubCategoryChildId;
            }
        }

    };

    $scope.newAnteriorObj = {
        "AnteriorSearchObj": "",
        "OSAnteriorSearchObj": "",
        "AnteriorInvSearchObj": "",
        "SelectedExaminactionINVId1": null,
        "SelectedEye": 1,
        "SelectedINVEye": 1,
        "CatId": 5,
        "SelectedAnteriorObj": '',
        "IsShowSearchBar": false,
        "RemarksArray": []
    };
    $scope.newPosteriorObj = {
        "PosteriorSearchObj": "",
        "OSPosteriorSearchObj": "",
        "PosteriorInvSearchObj": "",
        "SelectedExaminactionINVId1": null,
        "SelectedEye": 1,
        "SelectedINVEye": 1,
        "CatId": 6,
        "SelectedPosteriorObj": '',
        "IsShowSearchBar": false,
        "RemarksArray": [],
        "PosteriorDPSSelectedEye": 'OD'
    };

    $scope.AnteriorSegmentArrayNew = [];
   

    $scope.onfindingValueSelect = function (mainobject, item, Organ, CategoryId) {
        var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);

        mainobject.SelectedEye = Organ || 1;
        function getEmptyAntriorObj() {
            var object = {
                "PatientFindingAnteriorId": 0,
                "IsNormal": false,
                "CategoryId": 5,
                "CategoryDesc": "Anterior Segment",
                "InvestigationId": item.FindingId || 0,
                "InvestigationDesc": item.FindingName || "",
                "OrderBY": item.OrderBY || 0,
                "ActiveInd": "Y",
                "SelectedGlobalSearch": "",
                "SelectedRightEye": 1,
                "SelectedLeftEye": 0,
                "RemarksArray": [],
            };
            return object;
        }
        $scope.AntriorObj = getEmptyAntriorObj();
            var count = [];
            var i = 0;
            if ($scope.AnteriorSegmentArrayNew.length > 0) {
                angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.RemarksArray.length > 0) {
                        angular.forEach(Mitem.RemarksArray, function (Ritem) {
                            Ritem.IsShowNotesTextBox = false;
                        });
                    }
                });
                angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.RemarksArray.length > 0) {
                        count = $filter("filter")(Mitem.RemarksArray, function (fitem, index) { return fitem.InvFindingId === item.InvFindingId && fitem.ActiveInd == 'Y' && fitem.OrganId === mainobject.SelectedEye });
                        if (count.length !== 0) {
                            i++;
                        }
                    }
                });

                angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem, index) {
                    if (Mitem.RemarksArray.length > 0) {
                        angular.forEach(Mitem.RemarksArray, function (hitem, index) {
                            angular.forEach(temparray, function (tempitem, index1) {
                                if (hitem.OrganId == mainobject.SelectedEye && hitem.InvFindingId === tempitem.InvFindingId && item.FindingId == Mitem.InvestigationId) {
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
                });
            }

        if (i !== 0 && mainobject.SelectedEye == 1) {
                $scope.examinationObj.FindingValueObj = "";
                alertify.error("This Item is Already Added");
                return false;
        }

        if (i !== 0 && mainobject.SelectedEye == 2) {
            $scope.examinationObj.OSFindingValueObj = "";
            alertify.error("This Item is Already Added");
            return false;
        }

            /*var filteredInvArray = $filter("filter")($scope.AnteriorSegmentArrayNew, { "InvestigationId": $scope.examinationObj.InvestigationId }, true) || [];*/
        var filteredInvArray = $filter("filter")($scope.AnteriorSegmentArrayNew, { "InvestigationId": item.FindingId }, true) || [];

            if (filteredInvArray.length > 0) {
                angular.forEach($scope.AnteriorSegmentArrayNew, function (bitem) {
                    if (bitem.InvestigationId === item.FindingId) {
                        if ($scope.examinationObj.CategoryId === 5) {
                            if (mainobject.SelectedEye == 1) {
                                var obj = {
                                    "RemarksId": 0,
                                    "InvFindingId": item.InvFindingId || 0,
                                    "FindingValue": item.FindingValue || '',
                                    "OrganId": mainobject.SelectedEye || 1,
                                    "FindingId": item.FindingId || 0,
                                    "FindingName": '',
                                    "DiagnosisRiskLevel": "",
                                    "ActiveInd": "Y",
                                    "Notes": "",
                                    "IsShowNotesTextBox": false,
                                    "SubFindingList": []
                                }
                            } else if (mainobject.SelectedEye == 2) {
                                var obj = {
                                    "RemarksId": 0,
                                    "InvFindingId": item.InvFindingId || 0,
                                    "FindingValue": item.FindingValue || '',
                                    "OrganId": mainobject.SelectedEye || 2,
                                    "FindingId": item.FindingId || 0,
                                    "FindingName": '',
                                    "DiagnosisRiskLevel": "",
                                    "ActiveInd": "Y",
                                    "Notes": "",
                                    "IsShowNotesTextBox": false,
                                    "SubFindingList": []
                                }
                            }
                            if ($scope.examinationObj.SelectedEye == '1') {
                                bitem.RemarksArray.push(obj);
                            }
                            if ($scope.examinationObj.SelectedEye == '2') {
                                bitem.RemarksArray.push(obj);
                            }
                        }
                    }
                });
            }
            else {

                if (mainobject.SelectedEye == 1) {
                    var obj = {
                        "RemarksId": 0,
                        "InvFindingId": item.InvFindingId || 0,
                        "FindingValue": item.FindingValue || '',
                        "OrganId": mainobject.SelectedEye || 1,
                        "FindingId": item.FindingId || 0,
                        "FindingName": '',
                        "DiagnosisRiskLevel": "",
                        "ActiveInd": "Y",
                        "Notes": "",
                        "IsShowNotesTextBox": false,
                        "SubFindingList": []
                    }
                } else if (mainobject.SelectedEye == 2) {
                    var obj = {
                        "RemarksId": 0,
                        "InvFindingId": item.InvFindingId || 0,
                        "FindingValue": item.FindingValue || '',
                        "OrganId": mainobject.SelectedEye || 2,
                        "FindingId": item.FindingId || 0,
                        "FindingName": '',
                        "DiagnosisRiskLevel": "",
                        "ActiveInd": "Y",
                        "Notes": "",
                        "IsShowNotesTextBox": false,
                        "SubFindingList": []
                    }
                }

                if ($scope.examinationObj.SelectedEye == '1') {
                    $scope.AntriorObj.RemarksArray.push(obj);
                }
                if ($scope.examinationObj.SelectedEye == '2') {
                    $scope.AntriorObj.RemarksArray.push(obj);
                }

                $scope.AnteriorSegmentArrayNew.push($scope.AntriorObj);
            }

       
        $scope.examinationObj.FindingValueObj = "";
        $scope.examinationObj.OSFindingValueObj = "";
    }

    $scope.onfindingValueSelectPost = function (mainobject, item, organ, CategoryId) {
        var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);
        mainobject.SelectedEye = organ || 1;

        function getEmptyPostObj() {
            var object = {
                "PatientFindingAnteriorId": 0,
                "IsNormal": false,
                "CategoryId": 6,
                "CategoryDesc": "Posterior Segment",
                //"InvestigationId": mainobject.InvestigationId || 0,
                //"InvestigationDesc": mainobject.InvestigationDesc || "",
                "InvestigationId": item.FindingId || 0,
                "InvestigationDesc": item.FindingName || "",
                "ActiveInd": "Y",
                "SelectedGlobalSearch": "",
                "SelectedRightEye": 1,
                "SelectedLeftEye": 0,
                "RemarksArray": [],
            };
            return object;
        }

        $scope.PosteriorObj = getEmptyPostObj();

        var count = [];
        var i = 0;
        if (item.FindingId !== 32) {
            if ($scope.PoteriorSegmentArrayNew.length > 0) {
                angular.forEach($scope.PoteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.RemarksArray.length > 0) {
                        angular.forEach(Mitem.RemarksArray, function (Ritem) {
                            Ritem.IsShowNotesTextBox = false;
                        });
                    }
                });
                angular.forEach($scope.PoteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.RemarksArray.length > 0) {
                        count = $filter("filter")(Mitem.RemarksArray, function (fitem, index) { return fitem.InvFindingId === item.InvFindingId && fitem.OrganId === mainobject.SelectedEye && fitem.ActiveInd =='Y'});
                        if (count.length !== 0) {
                            i++;
                        }
                    }
                });
                angular.forEach($scope.PoteriorSegmentArrayNew, function (Mitem) {
                    if (Mitem.RemarksArray.length > 0) {
                        angular.forEach(Mitem.RemarksArray, function (hitem, index) {
                            angular.forEach(temparray, function (tempitem, index1) {
                                if (hitem.InvFindingId === tempitem.InvFindingId && hitem.OrganId == mainobject.SelectedEye && item.FindingId === Mitem.InvestigationId) {
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
                });
            }
        } else if (item.FindingId == 32) {
            var object = {
                "PatientFindingPosteriorId": 0,
                "ActiveInd": "Y",
                "IsNormal": false,
                "CategoryId": 6,
                "CategoryDesc": "Posterior Segment",
                "InvestigationId": 32,
                "InvestigationDesc": "CDR",
                "RHorizontal": '',
                "LHorizontal": '',
                "RVertical": '',
                "LVertical": '',
                "RDPS": '',
                "LDPS": '',
                "RemarksArray": [],
                /*"StampsArray": item.StampsArray || [],*/
            };

            var filetrarray = $filter("filter")($scope.PoteriorSegmentArrayNew, function (iterator, ind) { return iterator.InvestigationId == 32, iterator.ActiveInd == "Y" }) || [];
            if (filetrarray.length == 0) {
                $scope.PoteriorSegmentArrayNew.push(object);
            }
            item.FindingValue = item.FindingValue || "";
            var parts = item.FindingValue.split(' ');
            var value = parts[0] || "";
            var valuetype = parts[1] || "";
            angular.forEach($scope.PoteriorSegmentArrayNew, function (pitem) {

                if (pitem.InvestigationId == 32) {
                    if (mainobject.SelectedEye == 1) {
                        if (valuetype == 'HZ') {
                            pitem.RHorizontal = value || "";
                            
                        } else if (valuetype == 'V.T.') {
                            pitem.RVertical = value || "";
                            pitem.RHorizontal = value || "";
                        } else if (valuetype == 'DPS') {
                            pitem.RDPS = value || "";
                        }
                    } else if (mainobject.SelectedEye == 2) {
                        if (valuetype == 'HZ') {
                            pitem.LHorizontal = value || "";
                            
                        } else if (valuetype == 'V.T.') {
                            pitem.LVertical = value || "";
                            pitem.LHorizontal = value || "";
                        } else if (valuetype == 'DPS') {
                            pitem.LDPS = value || "";
                        }

                    }
                }
            });
        } else {}

        if (i !== 0 && mainobject.SelectedEye == 1) {
            $scope.PosteriorexaminationObj.FindingValueObj = "";
            alertify.error("This Item is Already Added");
            return false;
        }

        if (i !== 0 && mainobject.SelectedEye == 2) {
            $scope.PosteriorexaminationObj.OSFindingValueObj = "";
            alertify.error("This Item is Already Added");
            return false;
        }

            /*var filteredInvArray = $filter("filter")($scope.PoteriorSegmentArrayNew, { "InvestigationId": $scope.PosteriorexaminationObj.InvestigationId }, true) || [];*/
            var filteredInvArray = $filter("filter")($scope.PoteriorSegmentArrayNew, { "InvestigationId": item.FindingId }, true) || [];

            if (filteredInvArray.length > 0) {
                angular.forEach($scope.PoteriorSegmentArrayNew, function (bitem) {
                    if (bitem.InvestigationId === item.FindingId) {
                        if ($scope.PosteriorexaminationObj.CategoryId === 6 && mainobject.FindingValueObj.FindingId != 32) {
                            if (mainobject.SelectedEye == 1) {
                                var obj = {
                                    "RemarksId": 0,
                                    "InvFindingId": item.InvFindingId || 0,
                                    "FindingValue": item.FindingValue || '',
                                    "OrganId": mainobject.SelectedEye || 1,
                                    "FindingId": item.FindingId || 0,
                                    "FindingName": '',
                                    "DiagnosisRiskLevel": "",
                                    "ActiveInd": "Y",
                                    "Notes": "",
                                    "IsShowNotesTextBox": false,
                                    "SubFindingList": []
                                }
                            } else if (mainobject.SelectedEye == 2) {
                                var obj = {
                                    "RemarksId": 0,
                                    "InvFindingId": item.InvFindingId || 0,
                                    "FindingValue": item.FindingValue || '',
                                    "OrganId": mainobject.SelectedEye || 2,
                                    "FindingId": item.FindingId || 0,
                                    "FindingName": '',
                                    "DiagnosisRiskLevel": "",
                                    "ActiveInd": "Y",
                                    "Notes": "",
                                    "IsShowNotesTextBox": false,
                                    "SubFindingList": []
                                }
                            }
                            if ($scope.PosteriorexaminationObj.SelectedEye == '1') {
                                bitem.RemarksArray.push(obj);
                            }
                            if ($scope.PosteriorexaminationObj.SelectedEye == '2') {
                                bitem.RemarksArray.push(obj);
                            }


                        } else if ($scope.PosteriorexaminationObj.CategoryId === 6 && mainobject.FindingValueObj.FindingId == 32) {

                            item.FindingValue = item.FindingValue || "";
                            var parts = item.FindingValue.split(' ');
                            var value = parts[0] || "";
                            var valuetype = parts[1] || "";
                            angular.forEach($scope.PoteriorSegmentArrayNew, function (pitem) {

                                if (pitem.InvestigationId == 32) {
                                    if (mainobject.SelectedEye == 1) {
                                        if (valuetype == 'HZ') {
                                            pitem.RHorizontal = value || "";

                                        } else if (valuetype == 'V.T.') {
                                            pitem.RVertical = value || "";
                                            pitem.RHorizontal = value || "";
                                        } else if (valuetype == 'DPS') {
                                            pitem.RDPS = value || "";
                                        }
                                    } else if (mainobject.SelectedEye == 2) {
                                        if (valuetype == 'HZ') {
                                            pitem.LHorizontal = value || "";

                                        } else if (valuetype == 'V.T.') {
                                            pitem.LVertical = value || "";
                                            pitem.LHorizontal = value || "";
                                        } else if (valuetype == 'DPS') {
                                            pitem.LDPS = value || "";
                                        }

                                    }
                                }
                            });
                        } else {}
                    }
                });
            }
            else {
                if ($scope.PosteriorexaminationObj.CategoryId === 6 && mainobject.FindingValueObj.FindingId != 32) {
                    if (mainobject.SelectedEye == 1) {
                        var obj = {
                            "RemarksId": 0,
                            "InvFindingId": item.InvFindingId || 0,
                            "FindingValue": item.FindingValue || '',
                            "OrganId": mainobject.SelectedEye || 1,
                            "FindingId": item.FindingId || 0,
                            "FindingName": '',
                            "DiagnosisRiskLevel": "",
                            "ActiveInd": "Y",
                            "Notes": "",
                            "IsShowNotesTextBox": false,
                            "SubFindingList": []
                        }
                    } else if (mainobject.SelectedEye == 2) {
                        var obj = {
                            "RemarksId": 0,
                            "InvFindingId": item.InvFindingId || 0,
                            "FindingValue": item.FindingValue || '',
                            "OrganId": mainobject.SelectedEye || 2,
                            "FindingId": item.FindingId || 0,
                            "FindingName": '',
                            "DiagnosisRiskLevel": "",
                            "ActiveInd": "Y",
                            "Notes": "",
                            "IsShowNotesTextBox": false,
                            "SubFindingList": []
                        }
                    }
                    if ($scope.PosteriorexaminationObj.SelectedEye == '1') {
                        $scope.PosteriorObj.RemarksArray.push(obj);
                    }
                    if ($scope.PosteriorexaminationObj.SelectedEye == '2') {
                        $scope.PosteriorObj.RemarksArray.push(obj);
                    }

                    $scope.PoteriorSegmentArrayNew.push($scope.PosteriorObj);
                } else if ($scope.PosteriorexaminationObj.CategoryId === 6 && mainobject.FindingValueObj.FindingId == 32) {
                    var object = {
                        "PatientFindingPosteriorId": 0,
                        "ActiveInd": "Y",
                        "IsNormal": false,
                        "CategoryId": 6,
                        "CategoryDesc": "Posterior Segment",
                        "InvestigationId": 32,
                        "InvestigationDesc": "CDR",
                        "RHorizontal": '',
                        "LHorizontal": '',
                        "RVertical": '',
                        "LVertical": '',
                        "RDPS": '',
                        "LDPS": '',
                        "RemarksArray": [],
                        /*"StampsArray": item.StampsArray || [],*/
                    };

                    var filetrarray = $filter("filter")($scope.PoteriorSegmentArrayNew, function (iterator, ind) { return iterator.InvestigationId == 32, iterator.ActiveInd == "Y" }) || [];
                    if (filetrarray.length == 0) {
                        $scope.PoteriorSegmentArrayNew.push(object);
                    }
                    item.FindingValue = item.FindingValue || "";
                    var parts = item.FindingValue.split(' ');
                    var value = parts[0] || "";
                    var valuetype = parts[1] || "";
                    angular.forEach($scope.PoteriorSegmentArrayNew, function (pitem) {

                        if (pitem.InvestigationId == 32) {
                            if (mainobject.SelectedEye == 1) {
                                if (valuetype == 'HZ') {
                                    pitem.RHorizontal = value || "";

                                } else if (valuetype == 'V.T.') {
                                    pitem.RVertical = value || "";
                                    pitem.RHorizontal = value || "";
                                } else if (valuetype == 'DPS') {
                                    pitem.RDPS = value || "";
                                }
                            } else if (mainobject.SelectedEye == 2) {
                                if (valuetype == 'HZ') {
                                    pitem.LHorizontal = value || "";

                                } else if (valuetype == 'V.T.') {
                                    pitem.LVertical = value || "";
                                    pitem.LHorizontal = value || "";
                                } else if (valuetype == 'DPS') {
                                    pitem.LDPS = value || "";
                                }

                            }
                        }
                    });
                } else {}
            }
            $scope.PosteriorexaminationObj.FindingValueObj = "";
            $scope.PosteriorexaminationObj.OSFindingValueObj = "";
      
    }

    $scope.getTemplateFindingValues = function (val, invId) {
        console.log(invId);
        var phospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.SearchText = val || "";
        return eHnoteDbStaticDataService.GetAllInvestigationFindingValuesForNewTemplate(phospid, invId, 10, 1, $scope.SearchText).then(function (resp) {
            if (resp.data.Count !== 0) {
                if (resp.data.Rows !== undefined) {
                    return resp.data.Rows.map(function (item) {
                        return item;
                    });
                }
            }
        });
    };
   


    $scope.changeExaminationType = function (obj) {
        console.log(obj.CategoryId);
        $scope.examinationObj.FindingsArray = [];
        $scope.examinationObj.FindingValueObj = [];
        if (obj.CategoryId === 5) {
            angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (kitem) {
                var obj = {
                    "InvestigationDesc": kitem.InvestigationDesc,
                    "InvestigationId": kitem.InvestigationId,
                    "SubCategoryChildId": kitem.SubCategoryChildId,
                    "RightEyeRemarksArray": [],
                    "LeftEyeRemarksArray": [],
                    "BothyeRemarksArray": []
                };
                $scope.examinationObj.FindingsArray.push(obj);
            });

        }

        if (obj.CategoryId === 6) {
            angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (kitem) {
                if (kitem.InvestigationId !== 32) {
                    var obj = {
                        "InvestigationDesc": kitem.InvestigationDesc,
                        "InvestigationId": kitem.InvestigationId,
                        "SubCategoryChildId": kitem.SubCategoryChildId,
                        "RightEyeRemarksArray": [],
                        "LeftEyeRemarksArray": [],
                        "BothyeRemarksArray": []
                    };
                    $scope.examinationObj.FindingsArray.push(obj);
                }
            });

        }
        if (obj.CategoryId === 12) {
            angular.forEach($scope.cacheStorageItem.ExternalExaminationDetails, function (kitem) {
                var obj = {
                    "InvestigationDesc": kitem.InvestigationDesc,
                    "InvestigationId": kitem.InvestigationId,
                    "SubCategoryChildId": kitem.SubCategoryChildId,
                    "RightEyeRemarksArray": [],
                    "LeftEyeRemarksArray": [],
                    "BothyeRemarksArray": []
                };
                $scope.examinationObj.FindingsArray.push(obj);
            });

        }

    };



    $scope.clearExamination = function () {
        $scope.examinationObj.CategoryId = "";
        $scope.examinationObj.FindingsArray = [];
        $scope.examinationObj.InvestigationId = "";
        $scope.examinationObj.InvestigationDesc = "";
        $scope.examinationObj.DiagnosisRiskLevel = "Mild";
        $scope.examinationObj.FindingValueObj = "";
        $scope.examinationObj.SelectedEye = "1";
        $scope.PosteriorexaminationObj.FindingsArray = [];

    };
    
    $scope.addExaminationValue = function (mainobject) {

        var filteredInvArray = $filter("filter")($scope.AnteriorSegmentArrayNew, { "InvestigationId": $scope.examinationObj.InvestigationId }, true) || [];

        if (filteredInvArray.length > 0) {
            angular.forEach($scope.AnteriorSegmentArrayNew, function (bitem) {
                if (bitem.InvestigationId === $scope.examinationObj.InvestigationId) {
                    if ($scope.examinationObj.CategoryId === 5) {
                        if (mainobject.SelectedEye == 1) {
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": mainobject.FindingValueObj.InvFindingId || 0,
                                "FindingValue": mainobject.FindingValueObj.FindingValue || '',
                                "OrganId": mainobject.SelectedEye || 1,
                                "FindingId": mainobject.FindingValueObj.FindingId || 0,
                                "FindingName": '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }
                        } else if (mainobject.SelectedEye == 2) {
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": mainobject.FindingValueObj.InvFindingId || 0,
                                "FindingValue": mainobject.FindingValueObj.FindingValue || '',
                                "OrganId": mainobject.SelectedEye || 2,
                                "FindingId": mainobject.FindingValueObj.FindingId || 0,
                                "FindingName": '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }
                        }
                        if ($scope.examinationObj.SelectedEye == '1') {
                            bitem.RemarksArray.push(obj);
                        }
                        if ($scope.examinationObj.SelectedEye == '2') {
                            bitem.RemarksArray.push(obj);
                        }
                    }
                }
            });
        }
        else {

            if (mainobject.SelectedEye == 1) {
                var obj = {
                    "RemarksId": 0,
                    "InvFindingId": mainobject.FindingValueObj.InvFindingId || 0,
                    "FindingValue": mainobject.FindingValueObj.FindingValue || '',
                    "OrganId": mainobject.SelectedEye || 1,
                    "FindingId": mainobject.FindingValueObj.FindingId || 0,
                    "FindingName": '',
                    "DiagnosisRiskLevel": "",
                    "ActiveInd": "Y",
                    "Notes": "",
                    "IsShowNotesTextBox": true,
                    "SubFindingList": []
                }
            } else if (mainobject.SelectedEye == 2) {
                var obj = {
                    "RemarksId": 0,
                    "InvFindingId": mainobject.FindingValueObj.InvFindingId || 0,
                    "FindingValue": mainobject.FindingValueObj.FindingValue || '',
                    "OrganId": mainobject.SelectedEye || 2,
                    "FindingId": mainobject.FindingValueObj.FindingId || 0,
                    "FindingName": '',
                    "DiagnosisRiskLevel": "",
                    "ActiveInd": "Y",
                    "Notes": "",
                    "IsShowNotesTextBox": true,
                    "SubFindingList": []
                }
            }

            if ($scope.examinationObj.SelectedEye == '1') {
                $scope.AntriorObj.RemarksArray.push(obj);
            }
            if ($scope.examinationObj.SelectedEye == '2') {
                $scope.AntriorObj.RemarksArray.push(obj);
            }

            $scope.AnteriorSegmentArrayNew.push($scope.AntriorObj);
        }

       


        if ($scope.examinationObj.CategoryId === 12) {
                var filteredInvArray = $filter("filter")($scope.ActualExternalExaminationsValuesArray, { "InvestigationId": $scope.examinationObj.InvestigationId }, true) || [];

                if (filteredInvArray.length > 0) {
                    angular.forEach($scope.ActualExternalExaminationsValuesArray, function (bitem) {
                        if (bitem.InvestigationId === $scope.examinationObj.InvestigationId) {
                            var remarksObj = {
                                "RemarksId": 0,
                                "ActiveInd": 'Y',
                                "DiagnosisRiskLevel": $scope.examinationObj.DiagnosisRiskLevel,
                                "Remarks": $scope.examinationObj.FindingValueObj.FindingValue || "",
                                "InvFindingId": $scope.examinationObj.FindingValueObj.InvFindingId || 0
                            }

                            if ($scope.examinationObj.SelectedEye == '1') {
                                bitem.RightEyeRemarks.push(remarksObj);
                            }
                            if ($scope.examinationObj.SelectedEye == '2') {
                                bitem.LeftEyeRemarks.push(remarksObj);
                            }
                            if ($scope.examinationObj.SelectedEye == '3') {
                                bitem.BothEyeRemarks.push(remarksObj);
                            }
                        }
                    })
                }
                else {
                    var aObj = {
                        "CategoryId": 12,
                        "CategoryName": "External Examination",
                        "InvestigationId": $scope.examinationObj.InvestigationId,
                        "SubCategoryChildId": $scope.examinationObj.SubCategoryChildId,
                        "InvestigationDesc": $scope.examinationObj.InvestigationDesc,
                        "RightEyeRemarks": [],
                        "LeftEyeRemarks": [],
                        "BothEyeRemarks": []
                    };

                    var remarksObj = {
                        "RemarksId": 0,
                        "ActiveInd": 'Y',
                        "DiagnosisRiskLevel": $scope.examinationObj.DiagnosisRiskLevel,
                        "Remarks": $scope.examinationObj.FindingValueObj.FindingValue || "",
                        "InvFindingId": $scope.examinationObj.FindingValueObj.InvFindingId || 0
                    }
                    if ($scope.examinationObj.SelectedEye == '1') {
                        aObj.RightEyeRemarks.push(remarksObj);
                    }
                    if ($scope.examinationObj.SelectedEye == '2') {
                        aObj.LeftEyeRemarks.push(remarksObj);
                    }
                    if ($scope.examinationObj.SelectedEye == '3') {
                        aObj.BothEyeRemarks.push(remarksObj);
                    }
                    $scope.ActualExternalExaminationsValuesArray.push(aObj);
                }
        }

        $scope.examinationObj.FindingValueObj = "";


    }


    $scope.PoteriorSegmentArrayNew = [];
    $scope.addExaminationValuePost = function (mainobject) {
     
        var filteredInvArray = $filter("filter")($scope.PoteriorSegmentArrayNew, { "InvestigationId": $scope.PosteriorexaminationObj.InvestigationId }, true) || [];

        if (filteredInvArray.length > 0) {
            angular.forEach($scope.PoteriorSegmentArrayNew, function (bitem) {
                if (bitem.InvestigationId === $scope.PosteriorexaminationObj.InvestigationId) {
                    if ($scope.PosteriorexaminationObj.CategoryId === 6) {
                        if (mainobject.SelectedEye == 1) {
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": mainobject.FindingValueObj.InvFindingId || 0,
                                "FindingValue": mainobject.FindingValueObj.FindingValue || '',
                                "OrganId": mainobject.SelectedEye || 1,
                                "FindingId": mainobject.FindingValueObj.FindingId || 0,
                                "FindingName": '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }
                        } else if (mainobject.SelectedEye == 2) {
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": mainobject.FindingValueObj.InvFindingId || 0,
                                "FindingValue": mainobject.FindingValueObj.FindingValue || '',
                                "OrganId": mainobject.SelectedEye || 2,
                                "FindingId": mainobject.FindingValueObj.FindingId || 0,
                                "FindingName": '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": true,
                                "SubFindingList": []
                            }
                        }
                        if ($scope.PosteriorexaminationObj.SelectedEye == '1') {
                            bitem.RemarksArray.push(obj);
                        }
                        if ($scope.PosteriorexaminationObj.SelectedEye == '2') {
                            bitem.RemarksArray.push(obj);
                        }


                    }
                }
            });
        }
        else {
            if ($scope.PosteriorexaminationObj.CategoryId === 6) {
                if (mainobject.SelectedEye == 1) {
                    var obj = {
                        "RemarksId": 0,
                        "InvFindingId": mainobject.FindingValueObj.InvFindingId || 0,
                        "FindingValue": mainobject.FindingValueObj.FindingValue || '',
                        "OrganId": mainobject.SelectedEye || 1,
                        "FindingId": mainobject.FindingValueObj.FindingId || 0,
                        "FindingName": '',
                        "DiagnosisRiskLevel": "",
                        "ActiveInd": "Y",
                        "Notes": "",
                        "IsShowNotesTextBox": true,
                        "SubFindingList": []
                    }
                } else if (mainobject.SelectedEye == 2) {
                    var obj = {
                        "RemarksId": 0,
                        "InvFindingId": mainobject.FindingValueObj.InvFindingId || 0,
                        "FindingValue": mainobject.FindingValueObj.FindingValue || '',
                        "OrganId": mainobject.SelectedEye || 2,
                        "FindingId": mainobject.FindingValueObj.FindingId || 0,
                        "FindingName": '',
                        "DiagnosisRiskLevel": "",
                        "ActiveInd": "Y",
                        "Notes": "",
                        "IsShowNotesTextBox": true,
                        "SubFindingList": []
                    }
                }
                if ($scope.PosteriorexaminationObj.SelectedEye == '1') {
                    $scope.PosteriorObj.RemarksArray.push(obj);
                }
                if ($scope.PosteriorexaminationObj.SelectedEye == '2') {
                    $scope.PosteriorObj.RemarksArray.push(obj);
                }

                $scope.PoteriorSegmentArrayNew.push($scope.PosteriorObj);
            }
        }
        $scope.PosteriorexaminationObj.FindingValueObj = "";
    }

    

    $scope.removeAnteriorFindingValue = function (eye, obj, index,item) {

        if (eye==='OD') {
            var Index = obj.RemarksArray.findIndex(record => record.InvFindingId === item.InvFindingId);
            if (Index > -1) {
                obj.RemarksArray.splice(Index, 1);
            }
        }
        if (eye === 'OS') {
            var Index = obj.RemarksArray.findIndex(record => record.InvFindingId === item.InvFindingId);
            if (Index > -1) {
                obj.RemarksArray.splice(Index, 1);
            }
        }
        if (eye === 'OU') {
            var Index = obj.BothEyeRemarks.findIndex(record => record.InvFindingId === item.InvFindingId);
            if (Index > -1) {
                obj.BothEyeRemarks.splice(Index, 1);
            }
        }

    };

    $scope.removePosteriorFindingValue = function (eye, obj, index, item) {

        if (eye === 'OD') {
            var Index = obj.RemarksArray.findIndex(record => record.InvFindingId === item.InvFindingId);
            if (Index > -1) {
                obj.RemarksArray.splice(Index, 1);
            }
        }
        if (eye === 'OS') {
            var Index = obj.RemarksArray.findIndex(record => record.InvFindingId === item.InvFindingId);
            if (Index > -1) {
                obj.RemarksArray.splice(Index, 1);
            }
        }
        if (eye === 'OU') {
            var Index = obj.BothEyeRemarks.findIndex(record => record.InvFindingId === item.InvFindingId);
            if (Index > -1) {
                obj.BothEyeRemarks.splice(Index, 1);
            }
        }
    };


    $scope.removeExternalFindingValue = function (eye, obj, index, item) {

        if (eye === 'OD') {
            var Index = obj.RightEyeRemarks.findIndex(record => record.InvFindingId === item.InvFindingId);
            if (Index > -1) {
                obj.RightEyeRemarks.splice(Index, 1);
            }
        }
        if (eye === 'OS') {
            var Index = obj.LeftEyeRemarks.findIndex(record => record.InvFindingId === item.InvFindingId);
            if (Index > -1) {
                obj.LeftEyeRemarks.splice(Index, 1);
            }
        }
        if (eye === 'OU') {
            var Index = obj.BothEyeRemarks.findIndex(record => record.InvFindingId === item.InvFindingId);
            if (Index > -1) {
                obj.BothEyeRemarks.splice(Index, 1);
            }
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
    $scope.medicinesearch = {
        "MedicineSearchType": "General"
    }
    $scope.maxSize = 10;
    $scope.AssescurrentPage = 1;
    $scope.AssespageChanged = function (AssescurrentPage) {
        $scope.AssescurrentPage = AssescurrentPage;
        $scope.GetUserConsultationTemplateDetails();
    }
    $scope.GetUserConsultationTemplateDetails = function () {
        var params = {
            "UserId": doctorinfo.doctorid,
            "SearchText": "",
            "PageSize": 10,
            "PageNumber": $scope.AssescurrentPage||1,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "IsFavoriteInd": 0
        }
        eHnotePatientDataService.GetUserConsultationTemplateDetails(params).then(function (resp) {
            if (resp.data.Status == "Success") {
                $scope.totalItems = resp.data.Count;
                $scope.DiagnosisTemplatesArray = resp.data.AssessmentsPlanArray || [];
                $scope.Show.DiagnosisList = resp.data.AssessmentsPlanArray || [];

                $scope.CopyDiagnosisTemplate = angular.copy($scope.Show.DiagnosisList);

                if ($scope.DiagnosisTemplatesArray.length > 0) {
                    angular.forEach($scope.DiagnosisTemplatesArray, function (ditem) {
                        ditem.IsActiveTemplate = false;
                        ditem.ChiefComplaintsArray = ditem.ChiefComplaintsArray || [];
                        ditem.InvestigationsArray = ditem.InvestigationsArray || [];
                        ditem.ProceduresArray = ditem.ProceduresArray || [];
                        ditem.SurgeryArray = ditem.SurgeryArray || [];
                        ditem.ReferralArray = ditem.ReferralArray || [];
                    });
                    $scope.DiagnosisTemplatesArray[0].IsActiveTemplate = true;
                }

            } else {
                $scope.DiagnosisTemplatesArray = [];
                $scope.Show.DiagnosisList = [];
            }
            
        }, function (err) {

        });
    }
    $scope.GetUserConsultationTemplateDetails();
    
    $scope.obj = {
        "TemplateName": "",
        "IssetasDefaultTemplete": false,
        "AlreadyDefaultSelect": false
    };

    $scope.changepopup = function (Type) {
        $scope.ConsultationTemplatepop = false;
        //$scope.DiagnosisTemplatepop = true;
        if (Type === "New") {
            $scope.TemplateId = 0;
            $scope.obj = {
                "TemplateName": "",
                "IssetasDefaultTemplete": false,
                "AlreadyDefaultSelect": false
            }
            $scope.diagnosis.IsConTemplateFavorite = false;

            var l = $scope.cacheStorageItem.DefaultTemplateArray;
            var m = $scope.TemplateArray;
            if ($scope.cacheStorageItem.DefaultTemplateArray.length > 0) {
                angular.forEach($scope.cacheStorageItem.DefaultTemplateArray, function (item) {
                    item.IsCategoryChecked = false;
                    angular.forEach(item.CategoryDetails, function (mitem) {
                        mitem.IsSubCategoryChecked = false;
                        mitem.Active = 'N';
                        if (item.CategoryId === 4 || item.CategoryId === 9) {
                            if (mitem.SubCategoryDetails.length > 0) {
                                angular.forEach(mitem.SubCategoryDetails, function (kitem) {
                                    kitem.IsSubChildCategoryChecked = false;
                                });
                            }
                            mitem.IsSelectAllSubCategoryChecked = false;
                            if (item.CategoryId === 4) {
                                item.IsSelectAllSubCategoryChecked = false;
                            }
                        }

                        if (item.CategoryId === 1 || item.CategoryId === 5 || item.CategoryId === 6 || item.CategoryId === 7) { // always true
                            item.IsCategoryChecked = true;
                            mitem.IsSubCategoryChecked = true;
                            mitem.Active = 'Y';
                        }
                    });
                });
            }
        }
    }
    $scope.CheckConfirmtoUpdate = function () {
        if ($scope.RestructuredDocInvTemplates.length > 0) {
            if ($scope.obj.IssetasDefaultTemplete == true) {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>If you add any consultation data its will be cleared, do you want continue ?", function () {
                    $scope.resetAllConsultationArea2();
                    $scope.NewSaveTemplate();
                }, function () {
                    r = "You pressed Cancel!";
                });
            } else {
                $scope.NewSaveTemplate();
            }
        } else {
            $scope.NewSaveTemplate();
        }
    }
    function GetMasterCategoryDetails(categorytype) {
        eHnoteDiagnosisDataServices.GetMasterCategoryDetails().then(function (resp) {

            console.log(resp);


            $scope.TemplateList = [];
            $scope.tempConsultationArrayList = [];
            if ($scope.RoleId === 61) {
                angular.forEach(resp.data.rows, function (item) {
                    if (item.CategoryId === 1 || item.CategoryId === 2 || item.CategoryId === 3 || item.CategoryId === 4) {
                        $scope.TemplateList.push(item);
                    }
                });
            } else {
                $scope.TemplateList = resp.data.rows;
            }


            if ($scope.SpecializationId === 16) {
                $scope.TemplateList = [];
                angular.forEach(resp.data.rows, function (item) {
                    if (item.CategoryId === 1 || item.CategoryId === 2 || item.CategoryId === 5) {
                        $scope.TemplateList.push(item);
                    }
                });


                angular.forEach($scope.TemplateList, function (item) {
                    if (item.CategoryId === 5) {
                        for (var i = item.CategoryDetails.length - 1; i >= 0; i--) {
                            if (item.CategoryDetails[i].SubCategoryId === 30 || item.CategoryDetails[i].SubCategoryId === 39) {
                                item.CategoryDetails.splice(i, 1);
                            }
                        }
                    }
                });
            }
            angular.forEach($scope.TemplateList, function (item) {
                if (item.CategoryId == 3) {
                    angular.forEach(item.CategoryDetails, function (mitem) {
                        if (mitem.SubCategoryId == 60) {
                            mitem.SubCategoryName = mitem.SubCategoryName || "";
                            mitem.SubCategoryName = "IOP & Pachy";

                        }
                    });
                }
                if (item.CategoryId == 4) {
                    angular.forEach(item.CategoryDetails, function (mitem) {
                  
                        if (mitem.SubCategoryId == 24) {
                            mitem.SubCategoryName = mitem.SubCategoryName || "";
                            mitem.SubCategoryName = "Exam";
                        
                        }
                        if (mitem.SubCategoryId == 22) {
                            mitem.SubCategoryName = mitem.SubCategoryName || "";
                            mitem.SubCategoryName = "Additional";
                        }

                    });
                }
            });

            $scope.tempConsultationArrayList = $scope.TemplateList;
            angular.forEach($scope.tempConsultationArrayList, function (mitem) {
                angular.forEach(mitem.CategoryDetails, function (nitem) {
                    nitem.Active = 'N';
                    nitem.IsSubCategoryChecked = false;
                });
            });
            $scope.AddToCache();
            $scope.changesConsultationTemplate(categorytype);
        }, function (err) {
            console.log(err);
            alertify.error("Getting Categories Failed");
        });
    };
    $scope.NewSaveTemplate = function () {
        $scope.NewFinalTemplateSubmit();
        var tappid = appointmentinfo.DoctorID ? appointmentinfo.DoctorID : $scope.User.UserId;
        appointmentinfo.OptometristId = appointmentinfo.OptometristId || null;
        if ($scope.RoleId === 10 || $scope.RoleId === 61) {
            tappid = appointmentinfo.OptometristId === null ? $scope.User.UserId : appointmentinfo.OptometristId;
        }
        $scope.obj.TemplateName = $scope.obj.TemplateName || "";
        if ($scope.obj.TemplateName === "") {
            alertify.error("Enter Template Name");
            return false;
        }

        var str = $scope.obj.TemplateName;
        $scope.obj.TemplateName = str.replaceAll("'", " ");

        var str1 = $scope.obj.TemplateName;
        $scope.obj.TemplateName = str1.replaceAll('"', ' ');

        var str2 = $scope.obj.TemplateName;
        $scope.obj.TemplateName = str2.replaceAll(/\\/g, ' ');

        if ($scope.cacheStorageItem.FinalSubmitArray.length === 0) {
            alertify.error("Please select alteast one CheckBox");
            return false;
        } else {
            var categoryList = [];
            categoryList = $filter("filter")($scope.cacheStorageItem.FinalSubmitArray, function (kitem, index) { return kitem.CategoryId === 4 || kitem.CategoryId === 3 || kitem.CategoryId === 2 || kitem.CategoryId === 9 });
            if (categoryList.length === 0) {
                alertify.error("Please select alteast one CheckBox");
                return false;
            }
        }


        var object = {
            "UserId": tappid,
            "TemplateId": $scope.TemplateId || 0,
            "DeleteInd": 'N',
            "TemplateName": $scope.obj.TemplateName || "",
            "IssetasDefaultTemplete": $scope.obj.IssetasDefaultTemplete || false,
            "TemplateDetails": $scope.cacheStorageItem.FinalSubmitArray,
            "IsTemplateFavorites": $scope.diagnosis.IsConTemplateFavorite || false
        };
        eHnotePatientDataService.ModifyDocConsultationMasterTemplate(object).then(function (resp) {
            if (resp.data.status === 'Success') {
                if ($scope.TemplateId === 0) {
                    alertify.success("Template Added Successfully");
                }
                else {
                    alertify.success("Template Updated Successfully");
                }
                NewGetTemplateDetails("Save");
                // $scope.GetMasterCategoryDetails("NewCategories");
                $scope.ConsultationTemplatepop = true;
            } else {
                alertify.error(resp.data.Message);
            }
        }, function (err) {
        });
    }
    $scope.NewEditTemplate = function (tempdetails, Type) {
        $rootScope.$broadcast("loader_show");
        $("#maineHnoteLoader").show();
        $scope.maineHnoteLoader = true;
        $rootScope.mainsubeHnoteLoader = true;

        $scope.obj.TemplateName = tempdetails.TemplateName;
        $scope.diagnosis.IsConTemplateFavorite = tempdetails.IsTemplateFavorites || false;
        $scope.TemplateId = tempdetails.UserTemplateId;
        if (Type === "Delete") { }
        else {
            $scope.ConsultationTemplatepop = false;
        }
        $scope.obj.IssetasDefaultTemplete = tempdetails.IssetasDefaultTemplete;
        $scope.obj.AlreadyDefaultSelect = tempdetails.IssetasDefaultTemplete;

        if ($scope.cacheStorageItem.DefaultTemplateArray.length > 0) {
            angular.forEach($scope.cacheStorageItem.DefaultTemplateArray, function (item) {
                item.IsCategoryChecked = false;
                angular.forEach(item.CategoryDetails, function (mitem) {
                    mitem.IsSubCategoryChecked = false;
                    mitem.Active = 'N';
                    if (item.CategoryId === 4 || item.CategoryId === 9) {
                        if (mitem.SubCategoryDetails.length > 0) {
                            angular.forEach(mitem.SubCategoryDetails, function (kitem) {
                                kitem.IsSubChildCategoryChecked = false;
                            });
                        }
                        mitem.IsSelectAllSubCategoryChecked = false;
                        //if (item.CategoryId === 4) {
                        //    item.IsSelectAllSubCategoryChecked = false;
                        //}
                    }

                    if (item.CategoryId === 1 || item.CategoryId === 5 || item.CategoryId === 6 || item.CategoryId === 7) { // always true
                        mitem.IsSubCategoryChecked = true;
                        mitem.Active = 'Y';
                    }
                });
            });
        }

        if ($scope.tempConsultationArrayList != undefined && $scope.tempConsultationArrayList.length > 0) {
            angular.forEach($scope.tempConsultationArrayList, function (item) {
                item.IsCategoryChecked = false;
                angular.forEach(item.CategoryDetails, function (mitem) {
                    mitem.IsSubCategoryChecked = false;
                    mitem.Active = 'N';
                    if (item.CategoryId === 4 || item.CategoryId === 9) {
                        if (mitem.SubCategoryDetails.length > 0) {
                            angular.forEach(mitem.SubCategoryDetails, function (kitem) {
                                kitem.IsSubChildCategoryChecked = false;
                            });
                        }
                        mitem.IsSelectAllSubCategoryChecked = false;
                    }

                    if (item.CategoryId === 1 || item.CategoryId === 5 || item.CategoryId === 6 || item.CategoryId === 7) { // always true
                        item.IsCategoryChecked = true;
                        mitem.IsSubCategoryChecked = true;
                        mitem.Active = 'Y';
                    }
                });
            });
        }
        //$timeout(function () {
        //    NewtemplateDataLoad(tempdetails.TemplateDetails, "Edit");
        //}, 500);
        NewtemplateDataLoad(tempdetails.TemplateDetails, "Edit");

        $timeout(function () {
            if ($scope.cacheStorageItem.DefaultTemplateArray.length > 0) {
                angular.forEach($scope.cacheStorageItem.DefaultTemplateArray, function (sitem) {
                    if (sitem.CategoryId == 4) {
                        angular.forEach(sitem.CategoryDetails, function (xitem) {
                            if (xitem.SubCategoryId == 38) {
                                xitem.SubCategoryDetails = $filter("filter")(xitem.SubCategoryDetails, function (yitem) {
                                    return yitem.SubCategoryChildId === 57 || yitem.SubCategoryChildId === 60 || yitem.SubCategoryChildId === 79 || yitem.SubCategoryChildId === 116;
                                });
                            }
                        });
                    }
                });
            }
        }, 500);
        
    };
    $scope.SetasDefaultTemplete = function () {
        $scope.obj.IssetasDefaultTemplete = !$scope.obj.IssetasDefaultTemplete;
    }
    $scope.backTemplatelist = function () {
        $scope.ConsultationTemplatepop = true;
        $scope.DiagnosisTemplatepop = false;

        $scope.changeTemplateSearch("");
        $scope.Templatesearch.ConsulTemplate = "";
    }
    $scope.backTemplatelist1 = function () {
        $scope.ConsultationTemplatepop = true;
        $scope.DiagnosisTemplatepop = true;

        $scope.changeDiagnosisSearch("");
        //$scope.clearExamination();
        $scope.Templatesearch.DiagnosisTemplate = "";
    }
    $scope.closetemplatespopupclick = function () {
        var filterArray = $filter("filter")($scope.RestructuredDocInvTemplates, { "SetAsTemplate": true, "IssetasDefaultTemplete": false }, true);
        $scope.RestructuredDocInvTemplates = angular.copy($scope.CopyConsultationTempale);
        //$scope.DiagnosisTemplatesArray = angular.copy($scope.CopyDiagnosisTemplate);
        // $uibModalInstance.dismiss("cancel");
        $scope.Template.TemplatePOPUpShow = false;
        $scope.drawingPadPopup.IsOpen = false;

        if (filterArray.length > 0) {
            var SelectedArr = angular.copy(filterArray);
            GetMasterCategoryDetails(SelectedArr);
        } else {
            /*$scope.GetMasterCategoryDetails("NewCategories");*/
        }
    };
    $scope.closetemplatespopupclick1 = function (type) {
        //if (type!='') {
        //    angular.forEach($scope.DiagnosisTemplatesArray, function (sitem) {
        //        if (sitem.TemplateId == type.TemplateId) {
        //            sitem.SetasTemaplte = true;
        //        }
        //    });
        //}
        if (type !== "close") {
            var filterArray = $filter("filter")($scope.DiagnosisTemplatesArray, { "SetasTemaplte": true }, true);
            $scope.filterArray = [];
          $scope.filterArray.push(type)
          
            if ($scope.filterArray.length > 0) {
                var SelectedArr = angular.copy($scope.filterArray[0]);
                $scope.ChangesForDiagnosistemplateInConsultation(SelectedArr);
            }
        }
        $scope.RestructuredDocInvTemplates = angular.copy($scope.CopyConsultationTempale);
        $scope.DiagnosisTemplatesArray = angular.copy($scope.CopyDiagnosisTemplate);
        // $uibModalInstance.dismiss("cancel");
        $scope.Template.TemplatePOPUpShow = false;
        $scope.drawingPadPopup.IsOpen = false;         
        $scope.GetUserConsultationTemplateDetails();
    }
    $scope.changeTemplateSearch = function (searchitem) {

        if (searchitem != "") {
            var filtertemplate = $filter("filter")($scope.CopyConsultationTempale, { "TemplateName": searchitem });
            $scope.RestructuredDocInvTemplates = angular.copy(filtertemplate);
            if ($scope.RestructuredDocInvTemplates.length === 0) {
                //  alertify.error("Not Available Template Name");
            }
        } else {
            $scope.RestructuredDocInvTemplates = angular.copy($scope.CopyConsultationTempale);
        }
    }
    $scope.changeDiagnosisSearch = function (searchitem) {

        //var Setasfilter = $filter("filter")($scope.DiagnosisTemplatesArray, { "TemplateName": searchitem });
        //if (Setasfilter.length > 0) {
        //    $scope.Templatesearch.SelectedDiagnosisTemaplte = Setasfilter[0];
        //}

        if (searchitem != "") {
            var filtertemplate = $filter("filter")($scope.CopyDiagnosisTemplate, { "TemplateName": searchitem });
            $scope.DiagnosisTemplatesArray = angular.copy(filtertemplate);
            if ($scope.DiagnosisTemplatesArray.length === 0) {
                //  alertify.error("Not Available Template Name");
            }
        } else {
            $scope.DiagnosisTemplatesArray = angular.copy($scope.CopyDiagnosisTemplate);
        }
        if ($scope.DiagnosisTemplatesArray.length > 0) {
            angular.forEach($scope.DiagnosisTemplatesArray, function (ditem) {
                ditem.IsActiveTemplate = false;
            });
            $scope.DiagnosisTemplatesArray[0].IsActiveTemplate = true;
        }
    }
    $scope.NewDeleteTemplate = function (item) {

        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete these template  ?", function () {
            $scope.NewEditTemplate(item, "Delete");
            $scope.NewFinalTemplateSubmit();
            var tappid = appointmentinfo.DoctorID ? appointmentinfo.DoctorID : $scope.User.UserId;
            appointmentinfo.OptometristId = appointmentinfo.OptometristId || null;
            if ($scope.RoleId === 10 || $scope.RoleId === 61) {
                tappid = appointmentinfo.OptometristId === null ? $scope.User.UserId : appointmentinfo.OptometristId;
            }

            var object = {
                "UserId": tappid,
                "TemplateId": item.UserTemplateId,
                "DeleteInd": 'Y',
                "TemplateName": item.TemplateName,
                "IssetasDefaultTemplete": false,
                "TemplateDetails": $scope.cacheStorageItem.FinalSubmitArray,
                "IsTemplateFavorites": false
            };
            eHnotePatientDataService.ModifyDocConsultationMasterTemplate(object).then(function (resp) {
                if (resp.data.status === 'Success') {
                    if ($scope.TemplateId === 0) {
                        alertify.success('Deleted Successfully');
                    }
                    NewGetTemplateDetails("Save");
                }
                else {
                    alertify.error(resp.data.Message);
                }

            }, function (errorr) {

                console.log(error);
            });
        }, function () {
            r = "You pressed Cancel!";
        });
    };

    $scope.ChangeSetasDefault = function (tempdetails, Type) {
        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>If you add any consultation data its will be cleared and  set as a default template , do you want continue ?", function () {
            $scope.resetAllConsultationArea2();
            $scope.NewSetasDefault(tempdetails, Type);
        }, function () {
            r = "You pressed Cancel!";
        });
    }

    $scope.NewSetasDefault = function (tempdetails, Type) {
        $rootScope.$broadcast("loader_show");
        $("#maineHnoteLoader").show();
        $scope.maineHnoteLoader = true;
        $rootScope.mainsubeHnoteLoader = true;
        $scope.obj.TemplateName = tempdetails.TemplateName;
        $scope.TemplateId = tempdetails.UserTemplateId;
        $scope.obj.IssetasDefaultTemplete = true;

        if ($scope.cacheStorageItem.DefaultTemplateArray.length > 0) {
            angular.forEach($scope.cacheStorageItem.DefaultTemplateArray, function (item) {
                item.IsCategoryChecked = false;
                angular.forEach(item.CategoryDetails, function (mitem) {
                    mitem.IsSubCategoryChecked = false;
                    mitem.Active = 'N';
                    if (item.CategoryId === 4 || item.CategoryId === 9) {
                        if (mitem.SubCategoryDetails.length > 0) {
                            angular.forEach(mitem.SubCategoryDetails, function (kitem) {
                                kitem.IsSubChildCategoryChecked = false;
                            });
                        }
                        mitem.IsSelectAllSubCategoryChecked = false;
                    }

                    if (item.CategoryId === 1 || item.CategoryId === 5 || item.CategoryId === 6 || item.CategoryId === 7) { // always true
                        item.IsCategoryChecked = true;
                        mitem.IsSubCategoryChecked = true;
                        mitem.Active = 'Y';
                    }
                });
            });
        }

        if ($scope.tempConsultationArrayList.length > 0) {
            angular.forEach($scope.tempConsultationArrayList, function (item) {
                item.IsCategoryChecked = false;
                angular.forEach(item.CategoryDetails, function (mitem) {
                    mitem.IsSubCategoryChecked = false;
                    mitem.Active = 'N';
                    if (item.CategoryId === 4 || item.CategoryId === 9) {
                        if (mitem.SubCategoryDetails.length > 0) {
                            angular.forEach(mitem.SubCategoryDetails, function (kitem) {
                                kitem.IsSubChildCategoryChecked = false;
                            });
                        }
                        mitem.IsSelectAllSubCategoryChecked = false;
                    }

                    if (item.CategoryId === 1 || item.CategoryId === 5 || item.CategoryId === 6 || item.CategoryId === 7) { // always true
                        item.IsCategoryChecked = true;
                        mitem.IsSubCategoryChecked = true;
                        mitem.Active = 'Y';
                    }
                });
            });
        }
        $timeout(function () {
            NewtemplateDataLoad(tempdetails.TemplateDetails, "Edit", "setas", tempdetails);
        }, 500);
    };
    function getOrdersObj() {
        var obj = {
            'ShowTab': "Order",
            'SearchProcedureObj': "",
            'SearchReferralObj': "",
        }
        return obj;
    };
    $scope.GetOrdersObject = getOrdersObj();

    $scope.medicineGetObj = {
        "IsRcopiaa": true,
        "MedicineObject": "",
        "SearchText": "",
        "PageSize": 10,
        "PageNumber": 1,
        "TotalItems": 0
    };

    function getAssessObj() {
        var obj = {
            "SnomedCodeId": 0,
            "SnomedCode": "",
            "SnomedDescription":"",
            "SnomedCodeObject":"",
            "CreatedDateTime": "",
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
            "SpecializationId": $scope.SpecializationId,
            "OrganId": "1",
            "OrganName": "OD",
            "OrganName": GetEyeName($scope.SelectedEye),
            "DiagnosisId": 0,
            "DiagnosisObject": "",
            "DiagnosisRiskLevel": 'Mild',
            "FindingDiagnosisId": 0,
            "DiagnosisHistoryId": 0,
            "ICD10CODE": "",
            "ICD10DIAGDESCRIPTION": "",
            "ICD10DIAGNAME": "",
            "DiagnosisStatus": 1,
            "PlanofDiscussionsNotes": "",             
            "PatientInstructions": "",
            "DoctorNotes": "",
            "ActionsTaken": "",
            "PlanOfcareNotesArray": [],
            "ReferralArray": [],
            "ProceduresArray": [],
            "PrescriptionArray": [],
            "SurgeryArray": [],
            "InvestigationsArray": [],
            "InvestigationFindingId": 0,
            "FindingId": 0,
            "ActiveInd": "Y",
            "ProceduresAddedTime": "",
            "PrescriptionAddedTime": "",
            "PlanOfCareAddedTime": "",
            "SurgeryAddedTime": "",
            "ODSeverityId": 0,
            "OSSeverityId": 0,
            "RDiagnosisStatusId": '',
            "LDiagnosisStatusId": '',
            "DeleteInd": 'N',
            //"StatusList": [{
            //    "OrganStatusId": null,
            //    "OrganId": "1",
            //    "SeverityId": null,
            //    "Verificationstatusid": null,
            //    "DiagnosisStatus": '',
            //    "DiagnosisStatusId": 6,
            //    "EndDate": '',
            //    "StartDate": '',
            //    "DeleteInd": 'N',

            //},
            //{
            //    "OrganStatusId": null,
            //    "OrganId": "2",
            //    "SeverityId": null,
            //    "Verificationstatusid": null,
            //    "DiagnosisStatus": '',
            //    "DiagnosisStatusId": 6,
            //    "EndDate": '',
            //    "StartDate": '',
            //    "DeleteInd": 'N',

            //}
            //],
            "ICDCode": "1",
            "SnomedCodeShow": false,
            "IsRcopiaa": true,

            "LocationId1": 1,
            "SeverityId1": 0,
            "Verificationstatusid1": 0,
            "DiagnosisStatusId1": 6,
            "DiagnosisStatus1": '',
            "EndDate1": '',
            "StartDate1": '',

            "LocationId2": 1,
            "SeverityId2": 0,
            "Verificationstatusid2": 0,
            "DiagnosisStatusId2": 6,
            "DiagnosisStatus2": '',
            "EndDate2": '',
            "StartDate2": '',
            "AssessmentPlan": {
                "AssessmentPlanTemplateId": 0,
                "PlanofDiscussionsNotes": "",
                "PatientInstructions": "",
                "AssessmentsNotes": "",
                "DoctorNotes": "",
                "ActionsTaken": ""
            },
        }
        return obj;
    };

    $scope.AssessObject = getAssessObj();
    $scope.AssessmentPlanArrays = [];
    $scope.NewProcedureId = "2";
    $scope.IsGlobalinDiagosis = true;
    $scope.OrderPlanId = 2;
    $scope.NewProcedureSearch = {
        "NewProcedureObj": "",
        "NewInvestigationObj": "",
        "NewsurgeriesObj": "",
        "NewMedicineObj": "",
        "PlanOfcareobj": "",
        "MedicineObj": ""
    }
    $scope.Referralobj = {
        "referralDoctorObj": "",
        "referralDoctorId": "",
        "referralDoctorName": "",
        "SpecializationObj": 3, // "",
        "SubSpecializationObj": "",
        "SpecializationId": "",
        "SubSpecializationId": "",
        "SpecializationName": "",
        "Type": "Internal",
        "OrderDate": "",
        "Alarm": "",
        "ShowDateFormat": false,
        "DurationDate": "",
        "Duration": "",
        "DurationType": "",
    };
    $scope.OrderPlanArray = [];
    $scope.MedicineObjArray = [];
    $scope.DiagnosisTemplateId = 0;
    $scope.NewDiagnosisNewPop = function () {
        $scope.diagnosis.TemplateName = "";
        $scope.diagnosis.TemplateId = 0;
        $scope.diagnosis.IsFavorite = false;
        $scope.ConsultationTemplatepop = false;
        $scope.AssessObject = getAssessObj();
        $scope.AssessmentPlanArrays = [];
        $scope.OrderPlanArray = [];
        $scope.MedicineObjArray = [];
        $scope.AnteriorValuesArray = [];
        $scope.PosteriorValuesArray = [];
        $scope.ExternalExaminationsValuesArray = [];
        $scope.ActualAnteriorValuesArray = [];
        $scope.ActualPosteriorValuesArray = [];
        $scope.ActualExternalExaminationsValuesArray = [];
        $scope.DiagnosisTemplateId = 0;
        $scope.PoteriorSegmentArrayNew = [];
        $scope.AnteriorSegmentArrayNew = [];
        $scope.OrderInvestigationArray = [];
        $scope.OrderProceduresArray = [];
        $scope.OrderSurgeryArray = [];
        $scope.OrderReferalArray = [];
        $scope.AllCheifcomplaints = [];
        $scope.PrescriptionMainAddObj.PrescriptionDetails = [];
        $scope.cacheStorageItem.AnteriorODIsNormal = false;
        $scope.cacheStorageItem.AnteriorOSIsNormal = false;
        $scope.cacheStorageItem.PosteriorODIsNormal = false;
        $scope.cacheStorageItem.PosteriorOSIsNormal = false;
    };
    $scope.MainCheifComplaitsObj = {
        "Type": "Custom"
    }
    $scope.newChiefCompaintObjj = {
        "SelectedEye": '',
        "SeverityId": 1,
        "SeverityName": 'Mild',
        "ChiefComplaintId": "",
        "ChiefComplaints": [],
        "ChiefComplaintName": "",
        "ChiefComplaintObj": "",
        "AddComplaints": false
    };
    $scope.AllCheifcomplaints = [];
    $scope.onSelectAssesmentPlannewDiagnosis = function (mainobject, type) {

      
        $scope.newChiefCompaintObjj.ChiefComplaintObj = mainobject;
        var i = 0;

        $scope.newChiefCompaintObjj.ChiefComplaintObj = $scope.newChiefCompaintObjj.ChiefComplaintObj || "";
        if ($scope.newChiefCompaintObjj.ChiefComplaintObj === "") {
            return false;
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
            "OrganId": 4,
            "ChiefComplaintId": 0,
            "ChiefComplaintName": "",
            "ChiefComplaintType": "",
            "ChiefComplaintCode": "",
            "ChiefComplaintCodeSystem": "",
            "ChiefComplaintCodeSystemName": "",
            "PatientChiefComplaintId": 0,
            "Description": "",
            "IsDescriptionEdit": false,
            "TemplateChiefComplaintId": 0,
            "Remarks": ""
        };

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


        var List = $filter("filter")($scope.AllCheifcomplaints, function (item) {
            return (item.ChiefComplaintName === object.ChiefComplaintName && item.ActiveInd === 'Y');
        });
        if (List.length > 0) {
            alertify.error('You have already entered this chief complaint');
            $scope.newChiefCompaintObjj.ChiefComplaintObj = "";
            return;
        }
        if ($scope.AllCheifcomplaints.length !== 0) {
            angular.forEach($scope.AllCheifcomplaints, function (item) {
                item.IsEdit = false;
            });
        }
        //object.IsEdit = false;
        if (i === 0) {
            object.IsEdit = true;
            $scope.AllCheifcomplaints.push(object);
        }
        $scope.newChiefCompaintObjj.ChiefComplaintObj = "";
        $scope.newChiefCompaintObjj.SelectedEye = '';
        $scope.newChiefCompaintObjj.SeverityId = 1;
        $scope.newChiefCompaintObjj.SeverityName = 'Mild';
        $scope.MainCheifComplaitsObj.Type = $scope.MainCheifComplaitsObj.Type;
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
                "ChiefComplaintCodeSystem": "",
                "ChiefComplaintCodeSystemName": "Custom",
                "PatientChiefComplaintId": 0,
                "Description": $scope.newChiefCompaintObjj.ChiefComplaintObj.ChiefComplaintName || "",
                "IsDescriptionEdit": false,
                "TemplateChiefComplaintId": 0,
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
                "ChiefComplaintCodeSystem": "",
                "ChiefComplaintCodeSystemName": "Custom",
                "Description": "",
                "IsDescriptionEdit": false,
                "TemplateChiefComplaintId": 0,
                "Remarks": ""
            };
        }
        $scope.AllCheifcomplaints = $scope.AllCheifcomplaints || [];
        var data = $scope.newChiefCompaintObjj.ChiefComplaintObj.ChiefComplaintName ? $scope.newChiefCompaintObjj.ChiefComplaintObj.ChiefComplaintName : $scope.newChiefCompaintObjj.ChiefComplaintObj;

        var List = $filter("filter")($scope.AllCheifcomplaints, function (item) {
            return (item.ChiefComplaintName === data && item.ActiveInd === 'Y');
        });
        if (List.length > 0) {
            alertify.error('You have already entered this chief complaint');
            $scope.newChiefCompaintObjj.ChiefComplaintObj = "";
            return;
        }
        if ($scope.AllCheifcomplaints.length !== 0) {
            angular.forEach($scope.AllCheifcomplaints, function (item) {
                item.IsEdit = false;
            });
        }
        //object.IsEdit = false;
        if (i === 0) {
            object.IsEdit = true;
            $scope.AllCheifcomplaints.push(object);
        }
        $scope.newChiefCompaintObjj.ChiefComplaintObj = "";
        $scope.newChiefCompaintObjj.SelectedEye = '';
        $scope.newChiefCompaintObjj.SeverityId = 1;
        $scope.newChiefCompaintObjj.SeverityName = 'Mild';
        /*$scope.AddToCache();*/
    };

    $scope.onSelectNewAssessDiagnosis = function (mainobject, type) {

        if (type == 'ehnote') {
            if (mainobject.DiagnosisObject.DiagnosisId === '' || mainobject.DiagnosisObject.DiagnosisId === null || mainobject.DiagnosisObject.DiagnosisId === undefined) {
                $scope.AssessObject = getAssessObj();
                return false;
            }
            $scope.AssessObject.DiagnosisId = mainobject.DiagnosisObject.DiagnosisId;
            $scope.AssessObject.ICD10CODE = mainobject.DiagnosisObject.ICD10CODE;
            $scope.AssessObject.ICD10DIAGNAME = mainobject.DiagnosisObject.ICD10CODE;
            $scope.AssessObject.ICD10DIAGDESCRIPTION = mainobject.DiagnosisObject.FullName;
            // $scope.newAssessmentObj.DiagnosisName = mainobject.DiagnosisObject.DiagnosisName;
            $scope.AssessObject.DiagnosisObject = mainobject.DiagnosisObject;
            $scope.AssessObject.DiagnosisDescription = mainobject.DiagnosisObject.DiagnosisName;
            $scope.AssessObject.CreatedDateTime = $filter('date')(new Date(), "MM-dd-yyyy h:mm a");
            $scope.AssessObject.EditAssesssment = false;
            $scope.AssessObject.DeleteInd = 'N';
            $scope.AssessObject.TemplateDiagnosisId = 0;

            var i = 0;
            if ($scope.AssessmentPlanArrays.length > 0) {
                angular.forEach($scope.AssessmentPlanArrays, function (initem) {
                    if (initem.DiagnosisId === mainobject.DiagnosisId) {
                        alertify.error('You have already entered this Diagnosis');
                        i++;
                    }
                });
            };
            if (i != 0) {
                $scope.AssessObject = getAssessObj();
                return false;
            }
        } 

        if (type == 'rcopia') {
            if (mainobject.DiagnosisObject.ICD10Code === '' || mainobject.DiagnosisObject.ICD10Code === null || mainobject.DiagnosisObject.ICD10Code === undefined) {
                $scope.AssessObject = getAssessObj();
                return false;
            }

            $scope.AssessObject.ICD10CODE = mainobject.DiagnosisObject.ICD10Code;
            $scope.AssessObject.ICD10DIAGNAME = mainobject.DiagnosisObject.ICD10Description;
            $scope.AssessObject.ICD10DIAGDESCRIPTION = mainobject.DiagnosisObject.ICD10Description;
            $scope.AssessObject.DiagnosisName = mainobject.DiagnosisObject.ICD10Description;
            $scope.AssessObject.DiagnosisObject = mainobject.DiagnosisObject;
            $scope.AssessObject.DiagnosisDescription = mainobject.DiagnosisObject.ICD10Description;
            $scope.AssessObject.SnomedCode = mainobject.DiagnosisObject.SNOMEDConceptID;
            $scope.AssessObject.SnomedCodeDescription = mainobject.DiagnosisObject.SNOMEDDescription;
            $scope.AssessObject.CreatedDateTime = $filter('date')(new Date(), "MM-dd-yyyy h:mm a");
            $scope.AssessObject.EditAssesssment = false;
            $scope.AssessObject.DeleteInd = 'N';
            $scope.AssessObject.TemplateDiagnosisId = 0;
            $scope.AssessObject.CodeSystem = "ICD";

            var i = 0;
            if ($scope.AssessmentPlanArrays.length > 0) {
                angular.forEach($scope.AssessmentPlanArrays, function (initem) {
                    if (initem.ICD10CODE == mainobject.DiagnosisObject.ICD10Code) {
                        alertify.error('You have already entered this Diagnosis');
                        i++;
                    }
                });
            };
            if (i != 0) {
                $scope.AssessObject = getAssessObj();
                return false;
            }
        }
        if (type == 'Snomed') {
            if (mainobject.DiagnosisObject.SnomedCodeId === '' || mainobject.DiagnosisObject.SnomedCodeId === null || mainobject.DiagnosisObject.SnomedCodeId === undefined) {
                $scope.AssessObject = getAssessObj();
                return false;
            }
            $scope.AssessObject.SnomedCodeId = mainobject.DiagnosisObject.SnomedCodeId;
                $scope.AssessObject.OrganizationDiagnosisId = mainobject.DiagnosisObject.OrganizationDiagnosisId;
                $scope.AssessObject.ICD10CODE = mainobject.DiagnosisObject.ConceptId;
                $scope.AssessObject.ICD10DIAGNAME = mainobject.DiagnosisObject.Description;
                $scope.AssessObject.ICD10DIAGDESCRIPTION = mainobject.DiagnosisObject.Description;
                $scope.AssessObject.DiagnosisName = mainobject.DiagnosisObject.ICD10Description;
                $scope.AssessObject.DiagnosisObject = mainobject.DiagnosisObject;
                $scope.AssessObject.DiagnosisDescription = mainobject.DiagnosisObject.ICD10Description;
                $scope.AssessObject.SnomedCodeDescription = mainobject.DiagnosisObject.SNOMEDDescription;
                $scope.AssessObject.CreatedDateTime = $filter('date')(new Date(), "MM-dd-yyyy h:mm a");
                $scope.AssessObject.EditAssesssment = false;
                $scope.AssessObject.DeleteInd = 'N';
                $scope.AssessObject.TemplateDiagnosisId = 0;
                $scope.AssessObject.CodeSystem = "Snomed-CT";

                var i = 0;
                if ($scope.AssessmentPlanArrays.length > 0) {
                    angular.forEach($scope.AssessmentPlanArrays, function (initem) {
                        /*if (initem.ICD10Code === mainobject.ICD10Code) {*/
                        if (initem.ICD10CODE === mainobject.ICD10CODE) {
                            alertify.error('You have already entered this Diagnosis');
                            i++;
                        }
                    });
                };
                if (i != 0) {
                    $scope.AssessObject = getAssessObj();
                    return false;
                }
        } 
        
        $scope.AssessmentPlanArrays.push($scope.AssessObject);

        $scope.AssessObject = getAssessObj();
    }

    $scope.change = function (item) {
        item.EditAssesssment = !item.EditAssesssment;
    }
    $scope.addPlanOfCareNotesNew = function (obj, objval) {
        //  $scope.AssessObject.planOfCareText = objval || "";
        if (objval === "") {
            return false;
        }
        var object = {
            "PlanOfCareNotes": objval || "",
            "PlanOfCareId": 0,
            "DeleteInd": 'N',
            "CreatedDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a")
        }
        obj.PlanOfcareNotesArray.push(object);
        $scope.NewProcedureSearch.PlanOfcareobj = "";

    }

    function getBranchSpecializations(SubOrganizationId, BranchId) {
        $scope.OrgSpecialitiesArray = [];
        if (BranchId === 0) {
            eHnoteMainAdminServices.getAllBranchSpecialitiesById(SubOrganizationId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.OrgSpecialitiesArray = resp.data.row;
                    //var specAll = { "SpecializationId": 0, "SpecializationName": "All Specialities" };
                    //$scope.OrgSpecialitiesArray.unshift(specAll);
                }
            });
        } else {
            eHnoteMainAdminServices.getBranchSpecialitiesById(BranchId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.OrgSpecialitiesArray = resp.data.row;
                    //var specAll = { "SpecializationId": 0, "SpecializationName": "All Specialities" };
                    //$scope.OrgSpecialitiesArray.unshift(specAll);
                }

            });
        }
        console.log($scope.OrgSpecialitiesArray);
    }

    $scope.changereferalSubSpecialization = function (item) {
        item = item || "";
        if (item == "") {
            $scope.Referralobj.SubSpecializationId = "";
            $scope.Referralobj.SpecializationId = "";
            $scope.Referralobj.SpecializationName = "";
            return false;
        }
        $scope.Referralobj.SubSpecializationId = item.SubSpecializationId;
        $scope.Referralobj.SpecializationId = item.SpecializationId;
        $scope.PCPObj.SpecializationId = item.SpecializationId;
        // $scope.Referralobj.SpecializationName = item.SpecializationName;

        $scope.Referralobj.referralDoctorObj = "";
    }
    $scope.SelectSpecializationObj = true;
    $scope.changereferalSpecialization = function (item) {
        item = item || "";

        if (item == 3 || "") {
            $scope.SelectSpecializationObj = true;
        }
        else {
            $scope.SelectSpecializationObj = false;
        }

        $scope.Referralobj.referralDoctorObj = "";
    };
    $scope.SearchPCPDOClist = function (val) {
        var reqObj = {
            'LocationId': null,
            'PageNumber': 1,
            'PageSize': 1000,
            'SearchTaxt': val || "",
            "SpecializationId": $scope.SpecializationId || null,
            "DeleteInd": 'N',
            "OrganizationId": $scope.HospitalId || 0

        };
        $scope.Referralobj.SpecializationId = $scope.Referralobj.SpecializationId || "";
        if ($scope.Referralobj.SpecializationId !== "") {
            reqObj.SpecializationId = $scope.Referralobj.SpecializationId;
        }

        return eHnoteReferalDataService.GetReferalPCPDoctors(reqObj).then(function (resp) {
            return resp.data.PcpRefdetails.map(function (item) {
                return item;
            });

        });
    };

    $scope.SearchInternalDOClist = function (val) {
        $scope.AllDoctorList = angular.copy($scope.allUserList);

        if ($scope.SelectSpecializationObj == true) {

            $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                return item.RoleId === 1 || item.RoleId === 43;
            });
            $scope.Referralobj.SubSpecializationId = $scope.Referralobj.SubSpecializationId || null;
            if ($scope.Referralobj.SubSpecializationId == null || $scope.Referralobj.SubSpecializationId == 0) {
                $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                    return item.SpecialityCD != undefined && item.SpecialityCD.SpecializationId == $scope.Referralobj.SpecializationObj;
                });
            } else {
                var DoctorList = [];
                $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                    return item.SpecialityCD != undefined && item.SpecialityCD.SpecializationId == $scope.Referralobj.SpecializationObj;
                });
                angular.forEach($scope.AllDoctorList, function (ditem) {
                    ditem.UserSubSpecialization = ditem.UserSubSpecialization || [];
                    if (ditem.UserSubSpecialization.length > 0) {

                        var filtersubspe = $filter("filter")(ditem.UserSubSpecialization, function (item) {
                            return item.SubSpecializationId === $scope.Referralobj.SubSpecializationId;
                        }) || [];
                        if (filtersubspe.length > 0) {
                            DoctorList.push(ditem);
                        }
                    }
                });

                $scope.AllDoctorList = angular.copy(DoctorList);
            }

            $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, { "FullName": val });
            return $scope.AllDoctorList.map(function (item) {
                return item;

            });

        } else {
            if ($scope.Referralobj.SpecializationObj != 3 && $scope.Referralobj.SpecializationObj != 0 && $scope.Referralobj.SpecializationObj != null) {
                $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                    return item.RoleId === 1 || item.RoleId === 43;
                });
                $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                    return item.SpecialityCD != undefined && item.SpecialityCD.SpecializationId == $scope.Referralobj.SpecializationObj;
                });
            }
            else if ($scope.Referralobj.SpecializationObj == 0) {
                $scope.AllDoctorList = angular.copy($scope.allUserList);
                $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                    return item.RoleId === 1 || item.RoleId === 43;
                });
            } else {
                $scope.AllDoctorList = [];
            }

            $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, { "FullName": val });
            return $scope.AllDoctorList.map(function (item) {
                return item;

            });

        }


    }

    $scope.inti = function () {
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
                            $scope.AllDoctorList = angular.copy($scope.allUserList);
                            $scope.AllCoordinatorList = angular.copy($scope.allUserList);
                            $scope.AllDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
                            $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                                return item.RoleId === 1 || item.RoleId === 43;
                            });
                            $scope.AllCoordinatorList = _.uniq($scope.AllCoordinatorList, false, function (p) { return p.DoctorID; });
                            $scope.AllCoordinatorList = $filter("filter")($scope.AllCoordinatorList, function (item) {
                                return item.RoleId === 18; //item.RoleId === 1 || item.RoleId === 43;
                            });

                            $scope.AllInternalCoordinatorList = [];
                            $scope.AllInternalCoordinatorList = angular.copy($scope.allUserList) || [];
                            $scope.AllInternalCoordinatorList = _.uniq($scope.AllInternalCoordinatorList, false, function (p) { return p.DoctorID; });
                            $scope.AllInternalCoordinatorList = $filter("filter")($scope.AllInternalCoordinatorList, function (item) {
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
        getBranchSpecializations(0, $scope.HospitalID);
    }
    $scope.inti();

    //$scope.GetProcedures = function (val, ProcedureTypeId) {
    //    $scope.Ordersobj.searchBy = parseInt($scope.Ordersobj.searchBy);
    //    if ($scope.Ordersobj.searchBy === 1) {
    //        var object = {
    //            "LevelType": "O",
    //            "HospitalId": $scope.HospitalID,
    //            "UserId": $scope.UserId,
    //            "SpecializationId": $scope.SpecializationId,
    //            "SearchText": val,
    //            "ProcCodeSearchText": '',
    //            "PageSize": 10,
    //            "PageNumber": 1,
    //          //  "ProcedureTypeId": ProcedureTypeId,
    //            "ServicesTypeId": ProcedureTypeId,
    //            "AllBranchInd": 0,
    //            "Type": ''
    //        };
    //    }

    //    if ($scope.Ordersobj.searchBy === 2) {
    //        var object = {
    //            "LevelType": "O",
    //            "HospitalId": $scope.HospitalID,
    //            "UserId": $scope.UserId,
    //            "SpecializationId": $scope.SpecializationId,
    //            "SearchText": '',
    //            "ProcCodeSearchText": val,
    //            "PageSize": 10,
    //            "PageNumber": 1,
    //           // "ProcedureTypeId": ProcedureTypeId,
    //            "ServicesTypeId": ProcedureTypeId,
    //            "AllBranchInd": 0,
    //            "Type": ''
    //        };
    //    }
    //    if (val === "") {
    //        object.Type = 'C';
    //    }
    //    if (val !== "") {
    //        object.Type = 'O';
    //    }
    //    return eHnoteSettingsDataService.GetMasterProcedures(object).then(function (response) {
    //        if (response.data.count !== 0) {
    //            if (response.data.ProcedureList !== undefined) {
    //                $scope.obj.AddTreatment = false;
    //                if (val === "") {
    //                    var obj = {
    //                        "ProcedureId": "",
    //                        "ProcedureName": "Frequently Added"
    //                    };
    //                    response.data.ProcedureList.unshift(obj);
    //                }
    //                return response.data.ProcedureList.map(function (item) {
    //                    return item;
    //                });
    //            } else {
    //                $scope.obj.AddTreatment = true;
    //            }
    //        } else {
    //            $scope.obj.AddTreatment = false;
    //            if (val != '') {
    //                $scope.obj.AddTreatment = true;
    //            }
    //        }
    //    });
    //};

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
            "OrganizationId": $scope.HospitalID,
            "ProcedureId": 0,
            "PageNumber": 1,
            "PageSize": 10,
            "CPTCODE": "",  // cptcode tblorganizationprocedure
            "SearchText": text || "", // searchtext
            "TypeOfServiceId": 0,
            "Type": Type || 0,
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID || null
        };

        return eHnoteSettingsDataService.GetOrganizationProceduresByType(params).then(function (resp) {
            if (resp.data.rows !== undefined) {
                return resp.data.rows.map(function (item) {
                    return item;
                });
            }
        });
    };
    //$scope.GetOrgSurgeries = function (text) {

    //    if ($scope.Ordersobj.searchBy === 1) {
    //        var params = {
    //            "HospitalId": $scope.HospitalID,
    //            "AllBranchInd": 0,
    //            "PageSize": 10,
    //            "PageNumber": 1,
    //            "SearchText": text,
    //            "CPTSearchText": '',
    //            "SurgeryCategoryId": null,
    //            "Type": '',
    //            "UserId": $scope.UserId
    //        };
    //    }

    //    if ($scope.Ordersobj.searchBy === 2) {
    //        var params = {
    //            "HospitalId": $scope.HospitalID,
    //            "AllBranchInd": 0,
    //            "PageSize": 10,
    //            "PageNumber": 1,
    //            "SearchText": '',
    //            "CPTSearchText": text,
    //            "SurgeryCategoryId": null,
    //            "Type": '',
    //            "UserId": $scope.UserId
    //        };
    //    }
    //    if (text === "") {
    //        params.Type = 'C';
    //    }
    //    if (text !== "") {
    //        params.Type = 'O';
    //    }
    //    return eHnoteSurgeryService.GetOrganizationSurgeries(params, "Get").then(function (response) {
    //        if (response.data.count !== 0) {
    //            if (response.data.rows !== undefined) {
    //                if (text === "") {
    //                    var obj = {
    //                        "SurgeryId": "",
    //                        "SurgeryName": "Frequently Added"
    //                    };
    //                    response.data.rows.unshift(obj);
    //                }
    //                return response.data.rows.map(function (item) {
    //                    return item;
    //                });
    //            }
    //        }
    //    });
    //};


    $scope.onselectnewname = function (item) {
        $scope.NewProcedureSearch.NewProcedureObj = '';
        $scope.NewProcedureSearch.NewsurgeriesObj = '';
        $scope.NewProcedureSearch.NewInvestigationObj = '';
    }

    $scope.NewPushProcedures = function (obj, mainitem, objtype) {
        var item = mainitem;
        if (item.ProcedureId === '') {
            item.ProcedureName = '';
            return false;
        }
        item.SelectedProcedureObj = item;
        //var cost = "";
       // item.SelectedProcedureObj.IsProcedureCostdisable = true;
        //var object = {
        //    "PatientTreatmentId": 0,
        //    "SpecializationId": $scope.SpecializationId,
        //    "OrganId": $scope.SelectedEyeoptha,
        //    "OrganName": GetEyeName($scope.SelectedEyeoptha),          
        //    //"showProceduresTreatments": false,
        //    "CreatedDateTime": $filter('date')(new Date(), "dd-MMM-yyyy h:mm a"),
        //    "TreatmentData": {
        //        "TreatmentHistoryId": 0,
        //        "ProcedureId": item.SelectedProcedureObj.ProcedureId,
        //        "TreatmentName": item.SelectedProcedureObj.ProcedureName,
        //        "TreatmentNotes": item.SelectedProcedureObj.ProcedureNotes || "",
        //        "ProcedureMaxCost": cost || "",
        //        "TreatmentCost": 0,
        //        "Multiplyfactor": 1,
        //        "DiscountCost": 0,
        //        "TreatmentStatus": "1",
        //        "discountValue": "",
        //        "discountType": "P",
        //        "TreatmentDiscountAmt": 0,
        //        "ShowNote": false,
        //        "TreatmentFinalCost": 0,
        //        "RecommendedForSurgery": "N",
        //        "SurgeryData": {},
        //        "SurgeryStatusId": 0,
        //        "TotalSittings": 0,
        //        "ActiveInd": 'Y',
        //        "IsTreatmentInvoiced": false,
        //        "IsProcedureCostdisable": item.SelectedProcedureObj.IsProcedureCostdisable,
        //        "ModifiedBy": $scope.DisplayName,
        //        "ModifiedDt": $scope.DisplayDate,
        //        "RedoTreatmentInd": false,
        //        "RedoTreatmentRemarks": "",
        //        "BillingCode": item.SelectedProcedureObj.CPTCode || "", // item.SelectedProcedureObj.BillingCode || "",
        //        "OrgDescriptionId": item.SelectedProcedureObj.OrgProcedureId,
        //    }
        //};
        var object = {
            "PatientProcedureId": 0,
            "SpecializationId": $scope.SpecializationId,
            "ProcedureCode": item.SelectedProcedureObj.ProcedureCode || "",
            "OrgProcedureId": item.SelectedProcedureObj.OrganizationProcedureId,
            "ProcedureId": item.SelectedProcedureObj.ProcedureId,
            "ProcedureName": item.SelectedProcedureObj.ProcedureName,           
            "ProceduredDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
            "OrganId": obj.OrganId,
            "OrganName": GetEyeName(obj.OrganId),
            "ProcedureNotes": "",
            "DeleteInd": "N",
            "StatusId": "1",
            "BookingStatusId": "",         
        };
        var i = 0;
        if (obj.ProceduresArray.length > 0) {
            angular.forEach(obj.ProceduresArray, function (initem) {
                if (initem.ProcedureId === item.SelectedProcedureObj.ProcedureId) {
                    alertify.error('You have already entered this Procedure');
                    i++;
                }
            });
        };
        if (i != 0) {
            $scope.NewProcedureSearch.NewProcedureObj = "";
            return false;
        }

        obj.ProceduresArray.push(object);
          
        $scope.NewProcedureSearch.NewProcedureObj = "";
    };
    $scope.onSelectSurgeryNewDiagnosis = function (obj, item) {
        if (item.ProcedureId === '') {
            item.ProcedureName = '';
            return false;
        }
     
        var Object = {
            "PatientSurgeryId": 0,
            "ProcedureCode": item.ProcedureCode || "",
            "OrgSurgeryId": item.OrganizationProcedureId,
            "SurgeryId": item.ProcedureId,
            "SurgeryName": item.ProcedureName,
            "SpecializationId": $scope.SpecializationId,
            "SurgeryDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
            "CreatedDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
            "OrganId": obj.OrganId,
            "OrganName": GetEyeName(obj.OrganId),
            "ProcedureNotes": "",
            "DeleteInd": "N",
            "StatusId": "1",
            "BookingStatusId": "2",
        }




        var i = 0;
        if (obj.SurgeryArray.length > 0) {
            angular.forEach(obj.SurgeryArray, function (initem) {
                if (initem.OrgSurgeryId === Object.OrgSurgeryId) {
                    alertify.error('You have already entered this Surgery');
                    i++;
                }
            });
        };
        if (i != 0) {
            $scope.NewProcedureSearch.NewsurgeriesObj = "";
            return false;
        }
        Object.CPTCode = item.CPTCode;

        obj.SurgeryArray.push(Object);
      
        $scope.NewProcedureSearch.NewsurgeriesObj = "";
    };
    $scope.getCADNewOrgInvestigations = function (text, Type) {
        if (Type === 1) {
            var params = {
                "InvSpecialityId": $scope.InvSpecialityId,
                "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "GetAllIndicator": 0,
                "GetAllSpecialityInd": $scope.GetAllSpecialityInd,
                "PageSize": 10,
                "PageNumber": 1,
                "SearchText": text,
                "CPTSearchText": '',
                "Type": '',
                "UserId": doctorinfo.doctorid,
            };
        }
        if (Type === 2) {
            var params = {
                "InvSpecialityId": $scope.InvSpecialityId,
                "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "GetAllIndicator": 0,
                "GetAllSpecialityInd": $scope.GetAllSpecialityInd,
                "PageSize": 10,
                "PageNumber": 1,
                "SearchText": '',
                "CPTSearchText": text,
                "Type": '',
                "UserId": doctorinfo.doctorid,
            };
        }
        if (text === "") {
            params.Type = 'C';
            // params.Type = 'O';
        }
        if (text !== "") {
            params.Type = 'O';
        }
        return eHnoteLabService.getOrganizationInvestigationData(params).then(function (resp) {
            if (resp.data.rows !== undefined) {
                $scope.obj.AddInvestigation = false;
                if (text === "") {
                    var obj = {
                        "InvestigationId": "",
                        "InvestigationName": "Frequently Added"
                    };
                    resp.data.rows.unshift(obj);
                }
                return resp.data.rows.map(function (item) {
                    return item;
                });
            }
            else {
                $scope.obj.AddInvestigation = false;
                if (text != '') {
                    $scope.obj.AddInvestigation = true;
                }
            }
        });
    };
    $scope.onCADselectInvestigationNewdiagnosis = function (obj, InvObject, objtype) {       
        if (InvObject.InvestigationId === '') {
            InvObject.InvestigationName = '';
            return false;
        }
        $scope.obj.SelectedInvestigationItem = InvObject || "";
        if ($scope.obj.SelectedInvestigationItem === "") {
            return;
        }
        //var object = {
        //    "PatientInvestigationId": 0,
        //    "CPTCode": $scope.obj.SelectedInvestigationItem.CPTCode || "",
        //    "OrganId": $scope.SelectedEyeoptha,
        //    "OrganName": GetEyeName($scope.SelectedEyeoptha),
        //    "OrgInvestigationId": $scope.obj.SelectedInvestigationItem.OrgInvestigationId,
        //    "InvestigationId": $scope.obj.SelectedInvestigationItem.InvestigationId,
        //    "InvestigationName": $scope.obj.SelectedInvestigationItem.InvestigationName,
        //    "InvestigationNotes": $scope.obj.SelectedInvestigationItem.InvestigationNotes || "",
        //    "InvestigationDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
        //    "InvestigationTime": "",
        //    "BookingStatusId": "",
        //    "InvestigationInstruction": "",
        //    "ActiveInd": 'Y',
        //    "StatusId": $scope.obj.SelectedInvestigationItem.StatusId ? $scope.obj.SelectedInvestigationItem.StatusId : "1",
        //    "IsTreatmentInvoiced": false,
        //    "showInvestigationsplancare": false,
        //    "Cost": 0,
        //    "Discount": 0,
        //    "ShowNote": false,
        //    "InvSpecialityId": $scope.obj.SelectedInvestigationItem.InvSpecialityId,
        //    "ImagesData": [],
        //    "RedoInvestigationInd": false,
        //    "RedoInvestigationRemarks": "",
        //    "RedoInvestigationRemarksId": "",
        //    "CreatedDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a")
        //};

        var object = {
            "PatientInvestigationId": 0,
            "ProcedureCode": $scope.obj.SelectedInvestigationItem.ProcedureCode || "",
            "OrgInvestigationId": $scope.obj.SelectedInvestigationItem.OrganizationProcedureId,
            "SpecializationId": $scope.SpecializationId,
            "InvestigationId": $scope.obj.SelectedInvestigationItem.ProcedureId,
            "InvestigationName": $scope.obj.SelectedInvestigationItem.ProcedureName,
            "InvestigationDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
            "CreatedDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
            "OrganId": obj.OrganId,
            "OrganName": GetEyeName(obj.OrganId),
            "InvestigationNotes": $scope.obj.SelectedInvestigationItem.Notes || "",
            "DeleteInd": "N",
            "StatusId": "1",
            "BookingStatusId": "",
        }

        var i = 0;
        if (obj.InvestigationsArray.length > 0) {
            angular.forEach(obj.InvestigationsArray, function (initem) {
                if (initem.InvestigationId === $scope.obj.SelectedInvestigationItem.ProcedureId) {
                    alertify.error('You have already entered this Investigation');
                    i++;
                }
            });
        };
        if (i != 0) {
            $scope.NewProcedureSearch.NewInvestigationObj = "";
            return false;
        }

        obj.InvestigationsArray.push(object);
       
        $scope.NewProcedureSearch.NewInvestigationObj = "";
    }
    $scope.removeAssessclick = function (Obj, Objitem, diagType) {
        if (diagType === "PlanNotes") {
            var index = Obj.PlanOfcareNotesArray.indexOf(Objitem);
            if (index > -1) {
                Obj.PlanOfcareNotesArray.splice(index, 1);
            }
        }
        else if (diagType === "Procedure") {
            var index = Obj.ProceduresArray.indexOf(Objitem);
            if (Objitem.PatientProcedureId == 0) {
                if (index > -1) {
                    Obj.ProceduresArray.splice(index, 1);
                }
            } else {
                Obj.ProceduresArray[index].DeleteInd = 'Y';
            }
        }
        else if (diagType === "Surgery") {
            var index = Obj.SurgeryArray.indexOf(Objitem);
            if (Objitem.PatientSurgeryId == 0) {
                if (index > -1) {
                    Obj.SurgeryArray.splice(index, 1);
                }
            }
            else {
                Obj.SurgeryArray[index].DeleteInd = 'Y';
            }
        }
        else if (diagType === "Investigation") {
            var index = Obj.InvestigationsArray.indexOf(Objitem);
            if (Objitem.PatientInvestigationId == 0) {
                if (index > -1) {
                    Obj.InvestigationsArray.splice(index, 1);
                }
            } else {
                Obj.InvestigationsArray[index].DeleteInd = 'Y';
            }
        }
        else if (diagType === "OrderPlan") {
            var index = $scope.OrderPlanArray.indexOf(Objitem);
            if (index > -1) {
                $scope.OrderPlanArray.splice(index, 1);
            }
        }
        else if (diagType === "Medicine") {
            var index = $scope.MedicineObjArray.indexOf(Objitem);
            if (index > -1) {
                $scope.MedicineObjArray.splice(index, 1);
            }
        }
        else if (diagType === "AssessmentPlan") {
            var index = $scope.AssessmentPlanArrays.indexOf(Objitem);
            if (Objitem.TemplateDiagnosisId === 0) {
                if (index > -1) {
                    $scope.AssessmentPlanArrays.splice(index, 1);
                }
            } else {
                $scope.AssessmentPlanArrays[index].DeleteInd = 'Y';

                $scope.submitDiagnosis = [];
                angular.forEach($scope.AssessmentPlanArrays, function (DItem) {
                    $scope.dummyObj = {
                        "TemplateDiagnosisId": 0,
                        "DiagnosisId": 0,
                        "DiagnosisName": "",
                        "FullName": "",
                        "DiagnosisNotes": "",
                        "HospitalId": 0,
                        "UserId": 0,
                        "DiagnosisCode": "",
                        "ICD10CODE": "",
                        "SnomedCodeId": 0,
                        "SnomedCode": "",
                        "SnomedDescription": "",
                        "OrganId": "1",
                        "OrganName": "OD",
                        "DiagnosisRiskLevel": "",
                        "DiagnosisStatus": 58,
                        "PlanofDiscussionsNotes": "",
                        "PatientInstructions": "",
                        "DoctorNotes": "",
                        "ActionsTaken": "",
                        "ReferralArray": [],
                        "ProceduresArray": [],
                        "InvestigationsArray": [],
                        "SurgeriesArray": [],
                        "PlanOfCareNotesArray": [],
                        "ODSeverityId": 0,
                        "OSSeverityId": 0,
                        "RDiagnosisStatusId": '',
                        "LDiagnosisStatusId": '',
                        "AssessmentsNotes": '',
                        "DeleteInd": 'Y',
                        "SnomedCodeObject": '',
                        "StatusList": [{
                            "OrganStatusId": null,
                            "OrganId": "1",
                            "SeverityId": null,
                            "Verificationstatusid": null,
                            "DiagnosisStatus": '',
                            "DiagnosisStatusId": 6,
                            "EndDate": '',
                            "StartDate": '',
                            "DeleteInd": 'N',

                        },
                        {
                            "OrganStatusId": null,
                            "OrganId": "2",
                            "SeverityId": null,
                            "Verificationstatusid": null,
                            "DiagnosisStatus": '',
                            "DiagnosisStatusId": 6,
                            "EndDate": '',
                            "StartDate": '',
                            "DeleteInd": 'N',

                        }
                        ],
                    }
                    $scope.dummyObj.DiagnosisId = DItem.DiagnosisObject.DiagnosisId;
                    $scope.dummyObj.DiagnosisName = DItem.DiagnosisObject.DiagnosisName;
                    $scope.dummyObj.FullName = DItem.DiagnosisObject.FullName;
                    $scope.dummyObj.DiagnosisNotes = DItem.DiagnosisObject.DiagnosisNotes;
                    $scope.dummyObj.HospitalId = DItem.DiagnosisObject.HospitalId;
                    $scope.dummyObj.UserId = DItem.DiagnosisObject.UserId;
                    $scope.dummyObj.DiagnosisCode = DItem.DiagnosisObject.DiagnosisCode;
                    $scope.dummyObj.ICD10CODE = DItem.DiagnosisObject.ICD10CODE;
                    $scope.dummyObj.SnomedCodeId = DItem.SnomedCodeId;
                    $scope.dummyObj.SnomedCode = DItem.SnomedCode;
                    $scope.dummyObj.SnomedDescription = DItem.SnomedDescription;
                    $scope.dummyObj.OrganId = DItem.OrganId;
                    $scope.dummyObj.OrganName = DItem.OrganName;
                    $scope.dummyObj.DiagnosisRiskLevel = DItem.DiagnosisRiskLevel;
                    $scope.dummyObj.DiagnosisStatus = DItem.DiagnosisStatus;
                    $scope.dummyObj.PlanofDiscussionsNotes = DItem.PlanofDiscussionsNotes || '';
                    $scope.dummyObj.PatientInstructions = DItem.PatientInstructions || '';
                    $scope.dummyObj.DoctorNotes = DItem.DoctorNotes || '';
                    $scope.dummyObj.ActionsTaken = DItem.ActionsTaken || '';
                    $scope.dummyObj.ReferralArray = DItem.ReferralArray || [];
                    $scope.dummyObj.ProceduresArray = DItem.ProceduresArray || [];
                    $scope.dummyObj.InvestigationsArray = DItem.InvestigationsArray || [];
                    $scope.dummyObj.SurgeriesArray = DItem.SurgeryArray || [];
                    $scope.dummyObj.PlanOfCareNotesArray = DItem.PlanOfcareNotesArray || [];
                    $scope.dummyObj.ODSeverityId = DItem.ODSeverityId || 0;
                    $scope.dummyObj.OSSeverityId = DItem.OSSeverityId || 0;
                    $scope.dummyObj.RDiagnosisStatusId = DItem.RDiagnosisStatusId || '';
                    $scope.dummyObj.LDiagnosisStatusId = DItem.LDiagnosisStatusId || '';
                    $scope.dummyObj.TemplateDiagnosisId = DItem.TemplateDiagnosisId || '';
                    $scope.dummyObj.AssessmentsNotes = DItem.AssessmentPlan.AssessmentsNotes || '';
                    $scope.dummyObj.DeleteInd = DItem.DeleteInd;

                    $scope.submitDiagnosis.push($scope.dummyObj);
                });
                var params = {
                    "UserId": doctorinfo.doctorid,
                    "OrganizationId": $scope.HospitalID,
                    "TemplateId": $scope.diagnosis.TemplateId || 0,
                    "TemplateName": $scope.diagnosis.TemplateName,
                    "DiagnosisArray": $scope.submitDiagnosis,
                    "Medications": $scope.MedicineObjArray,
                    "AnteriorSegmentArrayNew": $scope.AnteriorSegmentArrayNew || [],
                    "PoteriorSegmentArrayNew": $scope.PoteriorSegmentArrayNew || [],
                    "ExternalExaminationsValuesArray": $scope.ExternalExaminationsValuesArray,
                    "DeleteInd": 0,
                    "IsTemplateFavorites": $scope.diagnosis.IsFavorite || false,
                    "IsDiagnosisMultiple": false,
                    "SetasTemplate": false,
                }

                console.log(JSON.stringify(params));
                eHnotePatientDataService.AddUpdateUserConsultationTemplateDetails(params).then(function (resp) {
                    if (resp.data.Status === "Failure") {
                        $scope.message = [];
                        $scope.message = resp.data.Message.split(':');
                        if ($scope.message.length > 0) {
                            alertify.error($scope.message[1]);
                        } else {
                            alertify.error(resp.data.Message);
                        }
                    } else {
                        if (diagType === "AssessmentPlan") {
                            var index = $scope.AssessmentPlanArrays.indexOf(Objitem);

                            if (index > -1) {
                                $scope.AssessmentPlanArrays.splice(index, 1);
                            }
                        }
                        $scope.GetUserConsultationTemplateDetails();
                     
                        /*$scope.AssessmentPlanArrays = [];*/
                        alertify.error("Deleted Successfully");
                        //$scope.backTemplatelist1();
                       // $scope.clearExamination();
                        //if ($scope.DiagnosisTemplateId === 0) {
                        //    alertify.success("Save successfully");
                        //} else {
                        //    alertify.success("Update successfully");
                        //}
                    }
                }, function (err) {

                });
              
            }
        }
    }

    $scope.removeOrdersclick = function (item, diagType) {

        if (diagType == 'Referal') {
            var index = $scope.OrderReferalArray.indexOf(item);
            if (item.OrderReferralTemplateId == 0) {
                if (index > -1) {
                    $scope.OrderReferalArray.splice(index, 1);
                }
            } else {
                $scope.OrderReferalArray[index].DeleteInd = 'Y';
            }
        } else if (diagType == 'Surgery') {
            var index = $scope.OrderSurgeryArray.indexOf(item);
            if (item.OrderTemplateId == 0) {
                if (index > -1) {
                    $scope.OrderSurgeryArray.splice(index, 1);
                }
            } else {
                $scope.OrderSurgeryArray[index].DeleteInd = 'Y';
            }
        } else if (diagType == 'Procedure') {
            var index = $scope.OrderProceduresArray.indexOf(item);
            if (item.OrderTemplateId == 0) {
                if (index > -1) {
                    $scope.OrderProceduresArray.splice(index, 1);
                }
            } else {
                $scope.OrderProceduresArray[index].DeleteInd = 'Y';
            }
        } else if (diagType == 'Investigation') {
            var index = $scope.OrderInvestigationArray.indexOf(item);
            if (item.OrderTemplateId == 0) {
                if (index > -1) {
                    $scope.OrderInvestigationArray.splice(index, 1);
                }
            } else {
                $scope.OrderInvestigationArray[index].DeleteInd = 'Y';
            }
        } else {}
    }

    $scope.NewPrescriptionItemPush = function (item) {
        if (item.MedicineId === '') {
            item.MedicineNameWithStock = '';
            return false;
        }
        var frqobject = $filter("filter")($scope.CustomPrescFrequency, { "FrequencyId": 18 }, true)[0];
        if (item.MedicineType !== 4 && item.MedicineType !== 19) {
            var object = {
                "PrescriptionId": 0,
                "PrescriptionType": "GenericMedicine",
                "PrescriptionData": {
                    "PrescriptionHistoryId": 0,
                    "Id": item.MedicineId,
                    "Refill": null,
                    "Name": item.MedicineName,
                    "MedicineGenericName": item.GenericName,
                    "Dosage": "", // "1",
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
                    "DirectionType": "",
                    "DurationValueInd": "",
                    "FrequencyValueInd": 3,
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
                    "ShowPrescriptiondiv": false,
                    "ModifiedBy": $scope.DisplayName,
                    "ModifiedDt": $scope.DisplayDate,
                    "TaperingArray": [],
                    "TempTaperingArray": [],
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
        }
        if (item.MedicineType == 4) {
            var object = {
                "PrescriptionId": 0,
                "PrescriptionType": "TaperDrop",
                "PrescriptionData": {
                    "PrescriptionHistoryId": 0,
                    "OrganId": $scope.SelectedEye,
                    "OrganName": GetEyeName($scope.SelectedEye),
                    "Id": item.MedicineId,
                    "Name": item.MedicineName,
                    "MedicineType": item.MedicineType,
                    "ActiveInd": 'Y',
                    "ShowTaperDropdiv": false,
                    "ModifiedDt": $scope.DisplayDate,
                    "TaperingArray": [{
                        "TaperMedicineId": 0,
                        "Frequency1": "One drop",
                        "Dosage": "",
                        "Refill": null,
                        "Frequency2": "times a day for",
                        "Duration": "",
                        "DurationType": "D",
                        "DurationTypeName": "Day(s)",
                        "ActiveInd": "Y",
                        "SNo": 0
                    }],
                    "TempTaperingArray ": [{
                        "TaperMedicineId": 0,
                        "Frequency1": "One drop",
                        "Dosage": "",
                        "Refill": null,
                        "Frequency2": "times a day for",
                        "Duration": "",
                        "DurationType": "D",
                        "DurationTypeName": "Day(s)",
                        "ActiveInd": "Y",
                        "SNo": 0
                    }]
                }
            };
        }
        if (item.MedicineType == 19) {
            var object = {
                "PrescriptionId": 0,
                "PrescriptionType": "TaperTablet",
                "PrescriptionData": {
                    "PrescriptionHistoryId": 0,
                    "OrganId": $scope.SelectedEye,
                    "OrganName": GetEyeName($scope.SelectedEye),
                    "Id": item.MedicineId,
                    "Name": item.MedicineName,
                    "MedicineType": item.MedicineType,
                    "ActiveInd": 'Y',
                    "ShowTaperTabletdiv": false,
                    "ModifiedDt": $scope.DisplayDate,
                    "TaperingArray": [{
                        "TaperMedicineId": 0,
                        "Dosage": "",
                        "Refill": null,
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
                    }],
                    "TempTaperingArray": [{
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
                    }],


                }
            };
        }
        object.EditMedicinePlan = false;
        $scope.MedicineObjArray.push(object);
        $scope.NewProcedureSearch.MedicineObj = "";
    };

    $scope.SaveDiagnosisTemplates = function () {

        if ($scope.diagnosis.TemplateName === "") {
            alertify.error("Please Enter Template Name");
            return false;
        }
        if ($scope.AssessmentPlanArrays.length === 0 && $scope.AllCheifcomplaints.length === 0 && $scope.OrderInvestigationArray.length === 0 && $scope.OrderProceduresArray.length === 0 && $scope.OrderSurgeryArray.length === 0 && $scope.AnteriorSegmentArrayNew.length === 0 && $scope.PoteriorSegmentArrayNew.length===0 ) {
            alertify.error("Please select data to create temlate");
            return false;
        }
        var count = 0;
        $scope.NewFinalSubmitArray = [];
        $scope.submitDiagnosis = [];
        $scope.AnteriorValuesArray = [];
        $scope.PosteriorValuesArray = [];
        $scope.ExternalExaminationsValuesArray = [];

        $scope.AnteriorValuesArray = angular.copy($scope.ActualAnteriorValuesArray) || [];
        $scope.PosteriorValuesArray = angular.copy($scope.ActualPosteriorValuesArray) || [];
        /*$scope.ExternalExaminationsValuesArray = angular.copy($scope.ActualExternalExaminationsValuesArray) || [];*/

        $scope.submitDiagnosis = [];
        angular.forEach($scope.AssessmentPlanArrays, function (DItem) {
            $scope.dummyObj = {
                "TemplateDiagnosisId": 0,
                "DiagnosisId": 0,
                "DiagnosisName": "",
                "FullName": "",
                "DiagnosisNotes": "",
                "HospitalId": 0,
                "UserId": 0,
                "DiagnosisCode": "",
                "ICD10CODE": "",
                "SnomedCodeId": 0,
                "SnomedCode": "",
                "SnomedDescription":"",
                "OrganId": "1",
                "OrganName": "OD",
                "DiagnosisRiskLevel": "",
                "DiagnosisStatus": 58,
                "PlanofDiscussionsNotes": "",
                "PatientInstructions": "",
                "DoctorNotes": "",
                "ActionsTaken": "",
                "ReferralArray": [],
                "ProceduresArray": [],
                "InvestigationsArray": [],
                "SurgeriesArray": [],               
                "PlanOfCareNotesArray": [],
                "ODSeverityId": 0,
                "OSSeverityId": 0,
                "RDiagnosisStatusId": '',
                "LDiagnosisStatusId": '',
                "AssessmentsNotes": '',
                "DeleteInd": 'N',
                "SnomedCodeObject": '',
                //"StatusList": [{
                //    "OrganStatusId": null,
                //    "OrganId": "1",
                //    "SeverityId": null,
                //    "Verificationstatusid": null,
                //    "DiagnosisStatus": '',
                //    "DiagnosisStatusId": 6,
                //    "EndDate": '',
                //    "StartDate": '',
                //    "DeleteInd": 'N',

                //},
                //{
                //    "OrganStatusId": null,
                //    "OrganId": "2",
                //    "SeverityId": null,
                //    "Verificationstatusid": null,
                //    "DiagnosisStatus": '',
                //    "DiagnosisStatusId": 6,
                //    "EndDate": '',
                //    "StartDate": '',
                //    "DeleteInd": 'N',

                //}
                //],
                    "LocationId1": 1,
                    "SeverityId1": 0,
                    "Verificationstatusid1": 0,
                    "DiagnosisStatusId1": 6,
                    "DiagnosisStatus1": '',
                    "EndDate1": '',
                "StartDate1": '',

                "LocationId2": 2,
                "SeverityId2": 0,
                "Verificationstatusid2": 0,
                "DiagnosisStatusId2": 6,
                "DiagnosisStatus2": '',
                "EndDate2": '',
                "StartDate2": '',

                "AssessmentPlan": {
                    "AssessmentPlanTemplateId": 0,
                    "PlanofDiscussionsNotes": "",
                    "PatientInstructions": "",
                    "AssessmentsNotes": "",
                    "DoctorNotes": "",
                    "ActionsTaken": ""
                },
            }
            $scope.dummyObj.DiagnosisId = DItem.DiagnosisObject.DiagnosisId;
            $scope.dummyObj.DiagnosisName = DItem.ICD10DIAGDESCRIPTION;
            $scope.dummyObj.FullName = DItem.DiagnosisObject.FullName;
            $scope.dummyObj.DiagnosisNotes = DItem.DiagnosisObject.DiagnosisNotes;
            $scope.dummyObj.HospitalId = DItem.DiagnosisObject.HospitalId;
            $scope.dummyObj.UserId = DItem.DiagnosisObject.UserId;
            $scope.dummyObj.DiagnosisCode = DItem.DiagnosisObject.DiagnosisCode;
            $scope.dummyObj.ICD10CODE = DItem.ICD10CODE;
            $scope.dummyObj.SnomedCodeId = DItem.SnomedCodeId; 
            $scope.dummyObj.SnomedCode = DItem.SnomedCode;
            $scope.dummyObj.SnomedDescription = DItem.SnomedDescription;
            $scope.dummyObj.OrganId = DItem.OrganId;
            $scope.dummyObj.OrganName = DItem.OrganName;
            $scope.dummyObj.DiagnosisRiskLevel = DItem.DiagnosisRiskLevel;
            $scope.dummyObj.DiagnosisStatus = DItem.DiagnosisStatus;
            $scope.dummyObj.AssessmentPlan.AssessmentPlanTemplateId = DItem.AssessmentPlan.AssessmentPlanTemplateId||0;
            $scope.dummyObj.AssessmentPlan.PlanofDiscussionsNotes = DItem.AssessmentPlan.PlanofDiscussionsNotes||'';
            $scope.dummyObj.AssessmentPlan.PatientInstructions = DItem.AssessmentPlan.PatientInstructions||'';
            $scope.dummyObj.AssessmentPlan.DoctorNotes = DItem.AssessmentPlan.DoctorNotes||'';
            $scope.dummyObj.AssessmentPlan.ActionsTaken = DItem.AssessmentPlan.ActionsTaken || '';
            $scope.dummyObj.AssessmentPlan.AssessmentsNotes = DItem.AssessmentPlan.AssessmentsNotes || '';
            $scope.dummyObj.ReferralArray = DItem.ReferralArray || [];
            $scope.dummyObj.ProceduresArray = DItem.ProceduresArray || [];
            $scope.dummyObj.InvestigationsArray = DItem.InvestigationsArray || [];
            $scope.dummyObj.SurgeriesArray = DItem.SurgeryArray || [];
            $scope.dummyObj.PlanOfCareNotesArray = DItem.PlanOfcareNotesArray || [];
            $scope.dummyObj.ODSeverityId = DItem.ODSeverityId || 0;
            $scope.dummyObj.OSSeverityId = DItem.OSSeverityId || 0;
            $scope.dummyObj.RDiagnosisStatusId = DItem.RDiagnosisStatusId || '';
            $scope.dummyObj.LDiagnosisStatusId = DItem.LDiagnosisStatusId || ''; 
            $scope.dummyObj.TemplateDiagnosisId = DItem.TemplateDiagnosisId || '';
            $scope.dummyObj.DeleteInd = DItem.DeleteInd;
            $scope.dummyObj.SeverityId1 = DItem.SeverityId1;
            $scope.dummyObj.SeverityId2 = DItem.SeverityId2;
           
            $scope.submitDiagnosis.push($scope.dummyObj);
        });
       
        $scope.InvestigationsArray = [];
        $scope.ProceduresArray = [];
        $scope.SurgeryArray = [];
        $scope.ReferralArray = [];

        if ($scope.OrderInvestigationArray.length > 0) {
            angular.forEach($scope.OrderInvestigationArray, function (OItem) {
                if (OItem.OrderTypeId == 1) {
                    $scope.InvestigationsArray.push(OItem);
                }
            });
        }
        if ($scope.OrderProceduresArray.length > 0) {
            angular.forEach($scope.OrderProceduresArray, function (OItem) {
                if (OItem.OrderTypeId == 2) {
                    $scope.ProceduresArray.push(OItem);
                }
            });
        }
        if ($scope.OrderSurgeryArray.length > 0) {
            angular.forEach($scope.OrderSurgeryArray, function (OItem) {
                if (OItem.OrderTypeId == 3) {
                    $scope.SurgeryArray.push(OItem);
                }
            });
        }
        if ($scope.OrderReferalArray.length > 0) {
            angular.forEach($scope.OrderReferalArray, function (rItem) {
                $scope.ReferralArray.push(rItem);
            });
        }
        $scope.PrescriptionMainAddObj.PrescriptionDetails = $scope.PrescriptionMainAddObj.PrescriptionDetails || [];
        var params = {
            "UserId": doctorinfo.doctorid,
            "OrganizationId": $scope.HospitalID,
            "TemplateId": $scope.diagnosis.TemplateId || 0,
            "TemplateName": $scope.diagnosis.TemplateName,
            "DiagnosisArray": $scope.submitDiagnosis,
            "MedicationsArray": $scope.PrescriptionMainAddObj.PrescriptionDetails||[],
            "AnteriorSegmentArrayNew": $scope.AnteriorSegmentArrayNew || [],
            "PoteriorSegmentArrayNew": $scope.PoteriorSegmentArrayNew || [],
            "ExternalExaminationsValuesArray": $scope.ExternalExaminationsValuesArray,
            "DeleteInd": 0,
            "IsTemplateFavorites": $scope.diagnosis.IsFavorite || false,
            "IsDiagnosisMultiple": false,
            "SetasTemplate": false,
            "InvestigationsArray": $scope.InvestigationsArray,
            "ProceduresArray": $scope.ProceduresArray,
            "SurgeryArray": $scope.SurgeryArray,
            "ReferralArray": $scope.ReferralArray,
            "ChiefComplaintsArray": $scope.AllCheifcomplaints || [],
        }

        eHnotePatientDataService.AddUpdateUserConsultationTemplateDetails(params).then(function (resp) {
            if (resp.data.data.Status === "Failure") {
                $scope.message = [];
                $scope.message = resp.data.data.Message.split(':');
                //if ($scope.message.length > 0) {
                //    alertify.error($scope.message[1]);
                //} else {
                //    alertify.error(resp.data.Message);
                //}
                alertify.error(resp.data.data.Message);
            } else {
                $scope.GetUserConsultationTemplateDetails();
                $scope.backTemplatelist1();
                $scope.clearExamination();
                $scope.onloadfunction();

                if ($scope.DiagnosisTemplateId === 0) {
                    alertify.success("Save successfully");
                } else {
                    alertify.success("Update successfully");
                }
            }
        }, function (err) {

        });
    };
    $scope.selectMedicine = "Select";
    $scope.getmedicineTemplate = function (val) {
        var params = {
            "DoctorID": doctorinfo.doctorid,
            "SearchText": val || "",
            "PageSize": 10,
            "PageNumber": 1
        };
        eHnoteDiagnosisDataServices.GetPrescriptionTemplates(params).then(function (response) {
            $scope.NewMedicineTemplateArray = response.data.rows;
        });
    };
    $scope.getmedicineTemplate();
    $scope.SelectedMedinies = function (item) {
        $scope.selectMedicine = item.TemplateName;
        var frqmainobject = {};
        if (item.TemplateDetails !== undefined) {
            angular.forEach(item.TemplateDetails, function (item1, index) {
                item1.FrequencyId = item1.FrequencyId || 0;
                if (item1.FrequencyId !== 0) {
                    var objfreq = $filter("filter")($scope.CustomPrescFrequency, { "FrequencyId": item1.FrequencyId }, true)[0];
                    frqmainobject = objfreq;
                } else {
                    if (item1.Frequency === '') {
                        var frqobject = $filter("filter")($scope.CustomPrescFrequency, { "FrequencyId": 18 }, true)[0];
                        frqmainobject = frqobject;
                    } else {
                        frqmainobject = {
                            "Name": item1.Frequency,
                            "Code": "",
                            "FrequencyId": 0,
                            "FrequencyType": '',
                            "languages": []
                        };
                    }
                }

                var TypeOfDosage = item1.TypeOfDosage || "Default";
                var intake = "";
                if (item1.Intake != undefined && item1.Intake != "" && item1.Intake != 0) {
                    intake = item1.Intake.toString();
                }
                if (item1.Intake === 0) {
                    intake = "0";
                }
                var object = {
                    "PrescriptionId": 0,
                    "PrescriptionType": "GenericMedicine",
                    "PrescriptionData": {
                        "PrescriptionHistoryId": 0,
                        "Id": item1.Id,
                        "Name": item1.Name,
                        "MedicineGenericName": item1.MedicineGenericName,
                        "Dosage": item1.Dosage ? item1.Dosage : "",
                        "TypeOfDosage": TypeOfDosage,
                        "Dosage1": item1.Dosage1 ? item1.Dosage1 : "",
                        "Dosage2": item1.Dosage2 ? item1.Dosage2 : "",
                        "Dosage3": item1.Dosage3 ? item1.Dosage3 : "",
                        "FrequencyObj": frqmainobject,
                        "Frequency": frqmainobject ? frqmainobject.Name : "",
                        "FrequencyId": frqmainobject ? frqmainobject.FrequencyId : 0,
                        "FrequencyEnglish": "",
                        "FrequencyHindhi": "",
                        "FrequencyTelugu": "",
                        "FrequencyMarathi": "",
                        "FrequencyKannada": "",
                        "Frequencypanjab": "",
                        "FrequencyTamil": "",
                        "PrintNote": "",
                        "Intake": intake,
                        "Duration": item1.Duration || "",
                        "DurationType": item1.DurationType || "D",
                        "DurationTypeName": item1.DurationType === "D" ? "Day(s)" : item1.DurationType === "M" ? "Month(s)" : item1.DurationType === "C" ? "To Be continued" : item1.DurationType === "W" ? "Week(s)" : item1.DurationType === "L" ? "Life Time" : "Year(s)",
                        "MedicineType": 1,
                        "OrganId": item1.OrganId || "1",
                        "OrganName": GetEyeName(item1.OrganId),
                        "Teethno": $scope.teethNos,
                        "Notes": item1.Notes,
                        "ActiveInd": "Y",
                        "Instructions": item1.Instructions,
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

                $scope.MedicineObjArray.push(object);
            });
        }
        $scope.searchMedicine.txt1 = "";
        $scope.selectMedicine = 'Select';
    };

    $scope.DeleteCheifComplaints = function (obs) {
            var index = $scope.AllCheifcomplaints.indexOf(obs);
            if (index > -1) {
                if (obs.TemplateChiefComplaintId !==0) {
                    $scope.AllCheifcomplaints[index].ActiveInd = "N";
                } else {
                    $scope.AllCheifcomplaints.splice(index, 1);
                }
            }
    };
    $scope.EditDiagnosisTemplate = function (templatedetails) {      
        $scope.diagnosis.TemplateName = templatedetails.TemplateName;
        $scope.diagnosis.TemplateId = templatedetails.TemplateId;
        $scope.diagnosis.IsFavorite = templatedetails.IsTemplateFavorites || false;
        $scope.DiagnosisTemplateId = templatedetails.TemplateId;
        $scope.ConsultationTemplatepop = false;
        $scope.AssessmentPlanArrays = [];
        $scope.AllCheifcomplaints = [];
        $scope.MedicineObjArray = [];
        angular.forEach(templatedetails.DiagnosisArray, function (Ditem) {
            var obj = {
                "SnomedCodeId": Ditem.SnomedCodeId,
                "SnomedCode": Ditem.SnomedCode,
                "SnomedDescription": Ditem.SnomedDescription,
                "CreatedDateTime": "",
                "ConsultationDiagnosisId": 0,
                "AssessmentPlanId": 0,
                "AssessmentPlan": {
                    "AssessmentPlanTemplateId": Ditem.AssessmentPlan.AssessmentPlanTemplateId||0,
                    "PlanofDiscussionsNotes": Ditem.AssessmentPlan.PlanofDiscussionsNotes || "",
                    "PatientInstructions": Ditem.AssessmentPlan.PatientInstructions || "",
                    "AssessmentsNotes": Ditem.AssessmentPlan.AssessmentsNotes || "",
                    "DoctorNotes": Ditem.AssessmentPlan.DoctorNotes || "",
                    "ActionsTaken": Ditem.AssessmentPlan.ActionsTaken || ""
                },
                "SpecializationId": $scope.SpecializationId,
                "OrganId": Ditem.OrganId,
                "OrganName": GetEyeName(Ditem.OrganId),
                "DiagnosisId": Ditem.DiagnosisId,
                "DiagnosisObject": {
                    "DiagnosisCode": Ditem.DiagnosisCode,
                    "DiagnosisId": Ditem.DiagnosisId,
                    "DiagnosisName": Ditem.DiagnosisName,
                    "DiagnosisNotes": Ditem.DiagnosisNotes,
                    "FullName": Ditem.FullName,
                    "HospitalId": Ditem.HospitalId,
                    "ICD10CODE": Ditem.ICD10CODE,
                    "UserId": Ditem.UserId
                },
                "DiagnosisRiskLevel": Ditem.DiagnosisRiskLevel,
                "FindingDiagnosisId": 0,
                "DiagnosisHistoryId": 0,
                "ICD10CODE": Ditem.ICD10CODE,
                "ICD10DIAGDESCRIPTION": Ditem.DiagnosisName,
                "ICD10DIAGNAME": Ditem.DiagnosisName,
                "DiagnosisStatus": Ditem.DiagnosisStatus,
                "PlanOfcareNotesArray": Ditem.PlanOfCareNotesArray,
                "PlanofDiscussionsNotes": Ditem.PlanofDiscussionsNotes || '',
                "PatientInstructions": Ditem.PatientInstructions || '',
                "DoctorNotes": Ditem.DoctorNotes || '',
                "ActionsTaken": Ditem.ActionsTaken || '',
                "ReferralArray": Ditem.ReferralArray || [],
                "ProceduresArray": Ditem.ProceduresArray,
                "PrescriptionArray": [],
                "SurgeryArray": Ditem.SurgeriesArray,
                "InvestigationsArray": Ditem.InvestigationsArray,
                "InvestigationFindingId": 0,
                "FindingId": 0,
                "ActiveInd": "Y",
                "ProceduresAddedTime": "",
                "PrescriptionAddedTime": "",
                "PlanOfCareAddedTime": "",
                "SurgeryAddedTime": "",
                "ODSeverityId": Ditem.ODSeverityId,
                "OSSeverityId": Ditem.OSSeverityId,
                "RDiagnosisStatusId": Ditem.RDiagnosisStatusId,
                "LDiagnosisStatusId": Ditem.LDiagnosisStatusId,
                "TemplateDiagnosisId": Ditem.TemplateDiagnosisId,
                "AssessmentsNotes": Ditem.AssessmentPlan.AssessmentsNotes,
                "DeleteInd": 'N',
                "SnomedCodeObject": {
                    "ConceptId": Ditem.SnomedCode,
                    "Description": Ditem.SnomedDescription,
                    "SnomedCodeId": Ditem.SnomedCodeId

                },
                "LocationId1": Ditem.LocationId1 || 0,
                "SeverityId1": Ditem.SeverityId1,
                "Verificationstatusid1": 0,
                "DiagnosisStatusId1": 2,
                "DiagnosisStatus1": 'Active',
                "EndDate1": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                "StartDate1": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),

                "LocationId2": Ditem.LocationId2 || 0,
                "SeverityId2": Ditem.SeverityId2,
                "Verificationstatusid2": 0,
                "DiagnosisStatusId2": 2,
                "DiagnosisStatus2": 'Active',
                "EndDate2": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                "StartDate2": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),

            }
            
            $scope.AssessmentPlanArrays.push(obj);
        });
        angular.forEach(templatedetails.ChiefComplaintsArray, function (mitem) {
            $scope.AllCheifcomplaints.push(mitem);
        });
        angular.forEach(templatedetails.Medications, function (mitem) {
            mitem.EditMedicinePlan = false;
            $scope.MedicineObjArray.push(mitem);
        });

        $scope.ActualAnteriorValuesArray = templatedetails.AnteriorValuesArray || [];
        $scope.ActualPosteriorValuesArray = templatedetails.PosteriorValuesArray || [];

        $scope.PoteriorSegmentArrayNew = templatedetails.PosteriorValuesArray || [];
        $scope.AnteriorSegmentArrayNew = templatedetails.AnteriorValuesArray || [];


        $scope.ActualExternalExaminationsValuesArray = templatedetails.ExternalExaminationsValuesArray || [];

        $scope.OrderInvestigationArray = templatedetails.InvestigationsArray || [];
        $scope.OrderProceduresArray = templatedetails.ProceduresArray || [];
        $scope.OrderSurgeryArray = templatedetails.SurgeryArray || [];
        $scope.OrderReferalArray = templatedetails.ReferralArray || [];

        if ($scope.OrderInvestigationArray.length > 0) {
            angular.forEach($scope.OrderInvestigationArray, function (oitem) {
                oitem.OrderTypeId = 1;
            });
        }
        if ($scope.OrderProceduresArray.length > 0) {
            angular.forEach($scope.OrderProceduresArray, function (oitem) {
                oitem.OrderTypeId = 2;
            });
        }
        if ($scope.OrderSurgeryArray.length > 0) {
            angular.forEach($scope.OrderSurgeryArray, function (oitem) {
                oitem.OrderTypeId = 3;
            });
        }
        $scope.PrescriptionMainAddObj.PrescriptionDetails = templatedetails.MedicationsArray || [];
        angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (miditem) {
            miditem.SigObj = miditem.Sig;

        });
    };
    $scope.ClearDiagnosisTemplate = function () {
        $scope.ConsultationTemplatepop = false;
        $scope.AssessmentPlanArrays = [];
        $scope.MedicineObjArray = [];
        $scope.AnteriorValuesArray = [];
        $scope.PosteriorValuesArray = [];
        $scope.ExternalExaminationsValuesArray = [];
        $scope.ActualAnteriorValuesArray = [];
        $scope.ActualPosteriorValuesArray = [];
        $scope.ActualExternalExaminationsValuesArray = [];
        $scope.PoteriorSegmentArrayNew = [];
        $scope.AnteriorSegmentArrayNew = [];
        $scope.clearExamination();
        $scope.onloadfunction();
        $scope.OrderInvestigationArray = [];
        $scope.OrderProceduresArray = [];
        $scope.OrderSurgeryArray = [];
        $scope.OrderReferalArray = [];
        $scope.PrescriptionMainAddObj.PrescriptionDetails = [];
        $scope.GetOrdersObject = getOrdersObj();
        $scope.medicineGetObj.IsRcopiaa = true;
        $scope.medicineGetObj.MedicineObject = '';
        $scope.AllCheifcomplaints= [];

        $scope.cacheStorageItem.AnteriorODIsNormal = false;
        $scope.cacheStorageItem.AnteriorOSIsNormal = false;
        $scope.cacheStorageItem.PosteriorODIsNormal = false;
        $scope.cacheStorageItem.PosteriorOSIsNormal = false;
    };
    $scope.SelectedDiaTemplate = function (Diatemplate) {
        angular.forEach($scope.DiagnosisTemplatesArray, function (item) {
            item.SetasTemaplte = false;
        });
        Diatemplate.SetasTemaplte = true;
        $scope.closetemplatespopupclick1(Diatemplate);


    };

    $scope.SelectAutoplansTemplate = function (item) {

       
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/SelectAutoplansTemplatePopup.html",
            // "size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            "windowClass": "modal__popup--1 bottom-to-top-modal in",
            "resolve": {            
                "SelectViewDetails": function () { return angular.copy(item) }
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, SelectViewDetails) {
              
                $scope.AutoPlansObjectDetails = SelectViewDetails;
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };

                $scope.AutoPlansObject = function (SelectViewDetails) {
                    $scope.SelectedDiaTemplate($scope.AutoPlansObjectDetails);
                    $scope.uibclose();
                }
                                        
            }         
        });    
    }
    $scope.DeleteDiagnosisTemplate = function (item) {



        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete these template  ?", function () {
            var params = {
                "UserId": doctorinfo.doctorid,
                "OrganizationId": $scope.HospitalID,
                "TemplateId": item.TemplateId,
                "TemplateName": item.TemplateName,
                "DiagnosisArray": item.DiagnosisArray,
                "Medications": item.Medications,
                "DeleteInd": 1,
                "IsTemplateFavorites": false,
                "IsDiagnosisMultiple": false,
                 "ChiefComplaintsArray": item.ChiefComplaintsArray ,
            }

            eHnotePatientDataService.AddUpdateUserConsultationTemplateDetails(params).then(function (resp) {
                $scope.GetUserConsultationTemplateDetails();
                if (resp.data != undefined && resp.data != "") {
                    alertify.success("Delete successfully");
                };
            }, function (err) {

            });
        }, function () {
            r = "You pressed Cancel!";
        });

    };

    $scope.NewAddFavoriteConsulTemplate = function (consuldeatils) {
        consuldeatils.IsTemplateFavorites = !consuldeatils.IsTemplateFavorites || false;
        $scope.NewEditTemplate(consuldeatils, "Delete");
        $scope.NewFinalTemplateSubmit();
        var tappid = appointmentinfo.DoctorID ? appointmentinfo.DoctorID : $scope.User.UserId;
        appointmentinfo.OptometristId = appointmentinfo.OptometristId || null;
        if ($scope.RoleId === 10 || $scope.RoleId === 61) {
            tappid = appointmentinfo.OptometristId === null ? $scope.User.UserId : appointmentinfo.OptometristId;
        }
        $timeout(function () {
            var object = {
                "UserId": tappid,
                "TemplateId": consuldeatils.UserTemplateId,
                "DeleteInd": 'N',
                "TemplateName": consuldeatils.TemplateName,
                "IssetasDefaultTemplete": consuldeatils.IssetasDefaultTemplete || false,
                "TemplateDetails": $scope.cacheStorageItem.FinalSubmitArray,
                "IsTemplateFavorites": consuldeatils.IsTemplateFavorites
            };
            eHnotePatientDataService.ModifyDocConsultationMasterTemplate(object).then(function (resp) {
                if (resp.data.status === 'Success') {
                    if (consuldeatils.IsTemplateFavorites) {
                        alertify.success('Add Favorite Template Successfully');
                    } else {
                        alertify.success('Remove Favorite Template Successfully');
                    }
                    NewGetTemplateDetails("Save");
                }
                else {
                    alertify.error(resp.data.Message);
                }

            }, function (errorr) {

                console.log(error);
            });
        }, 500);
    };
    $scope.NewAddFaviroteDiagnosistemplate = function (item) {
        item.IsTemplateFavorites = !item.IsTemplateFavorites || false;
        var params = {
            "UserId": doctorinfo.doctorid,
            "OrganizationId": $scope.HospitalID,
            "TemplateId": item.TemplateId,
            "TemplateName": item.TemplateName,
            "DiagnosisArray": item.DiagnosisArray,
            "Medications": item.Medications,
            "DeleteInd": 0,
            "IsTemplateFavorites": item.IsTemplateFavorites,
            "IsDiagnosisMultiple": false,

            "AnteriorSegmentArrayNew": item.AnteriorValuesArray || [],
            "PoteriorSegmentArrayNew": item.PosteriorValuesArray || [],
            "ChiefComplaintsArray": item.ChiefComplaintsArray || [],
        }

        eHnotePatientDataService.AddUpdateUserConsultationTemplateDetails(params).then(function (resp) {
            $scope.GetUserConsultationTemplateDetails();
            if (resp.data != undefined && resp.data != "") {
                if (item.IsTemplateFavorites) {
                    alertify.success('Add Favorite Template Successfully');
                } else {
                    alertify.success('Remove Favorite Template Successfully');
                }
            };
        }, function (err) {

        });
    };

    $scope.SearchConsulTemplateFavorite = function (Type) {
        var tappid = appointmentinfo.DoctorID ? appointmentinfo.DoctorID : $scope.User.UserId;
        appointmentinfo.OptometristId = appointmentinfo.OptometristId || null;
        if ($scope.RoleId === 10 || $scope.RoleId === 61) {
            tappid = appointmentinfo.OptometristId === null ? $scope.User.UserId : appointmentinfo.OptometristId;
        }
        var IsFavoriteInd = Type || 0;
        eHnotePatientDataService.GetLatestUserConsultationMasterTemplateDtls(tappid, IsFavoriteInd).then(function (resp) {
            if (resp.data !== undefined) {
                if (resp.data.rows.length > 0) {
                    $scope.RestructuredDocInvTemplates = [];
                    $scope.RestructuredDocInvTemplates = resp.data.rows || [];
                    $scope.CopyConsultationTempale = angular.copy($scope.RestructuredDocInvTemplates);

                    angular.forEach($scope.RestructuredDocInvTemplates, function (item) {
                        item.SetAsTemplate = false;
                        if (item.IssetasDefaultTemplete) {
                            item.SetAsTemplate = true;
                        }
                    });

                } else {

                    $scope.RestructuredDocInvTemplates = [];
                    alertify.error("Not Available Favorite Templates");
                    //Get2();
                }
                if (Type === 1) {
                    $scope.viewlist.TemplateIsFavorite = false;
                } else {
                    $scope.viewlist.TemplateIsFavorite = true;
                }
            }
        }, function (error) {
        });
    }

    $scope.SearchDiagnosisTemplateFavorite = function (Type) {
        var params = {
            "UserId": doctorinfo.doctorid,
            "SearchText": "",
            "PageSize": 10,
            "PageNumber": 1,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "IsFavoriteInd": Type || 0
        }
        eHnotePatientDataService.GetUserConsultationTemplateDetails(params).then(function (resp) {
            if (resp.data.AssessmentsPlanArray.length !== 0) {
                $scope.DiagnosisTemplatesArray = resp.data.AssessmentsPlanArray || [];
                $scope.CopyDiagnosisTemplate = angular.copy($scope.DiagnosisTemplatesArray);

            } else {
                $scope.DiagnosisTemplatesArray = [];
                alertify.error("Not Available Favorite Templates");
                //Get1();
            }
            if (Type === 1) {
                $scope.viewlist.DiagnosisIsFavorite = false;
            } else {
                $scope.viewlist.DiagnosisIsFavorite = true;
            }

        }, function (err) {

        });
    }

    function NewtemplateDataLoad (data, Type, setas, tempdetails) {
        if (data.length > 0) {
            angular.forEach(data, function (item) {
                angular.forEach($scope.tempConsultationArrayList, function (mitem) {
                    if (mitem.CategoryId === 1) {
                        angular.forEach(mitem.CategoryDetails, function (nitem) {
                            if (nitem.SubCategoryId === item.SubCategoryId) {
                                nitem.Active = 'Y';
                                nitem.IsSubCategoryChecked = true;
                                mitem.IsCategoryChecked = true;
                            }
                        });
                    }
                    else if (mitem.CategoryId === 2) {
                        angular.forEach(mitem.CategoryDetails, function (nitem) {
                            if (nitem.SubCategoryId === item.SubCategoryId) {
                                nitem.Active = 'Y';
                                nitem.IsSubCategoryChecked = true;
                            }
                        });
                    }
                    else if (mitem.CategoryId === 3) {
                        angular.forEach(mitem.CategoryDetails, function (nitem) {
                            if (nitem.SubCategoryId === item.SubCategoryId) {
                                nitem.Active = 'Y';
                                nitem.IsSubCategoryChecked = true;
                            }
                        });
                    }
                    else if (mitem.CategoryId === 4) {
                        angular.forEach(mitem.CategoryDetails, function (nitem) {
                            if (nitem.SubCategoryId === item.SubCategoryId) {
                                //if (nitem.SubCategoryId === 21) {
                                //    angular.forEach(nitem.SubCategoryDetails, function (sitem) {
                                //        if (sitem.SubCategoryChildId === item.SubCategoryChildId) {
                                //            sitem.IsSubChildCategoryChecked = true;
                                //            sitem.Active = 'Y';
                                //            nitem.Active = 'Y';
                                //            nitem.IsSubCategoryChecked = true;
                                //        }
                                //    });
                                //}
                                //if (nitem.SubCategoryId === 22 || nitem.SubCategoryId === 77 || nitem.SubCategoryId === 78) {
                                //    nitem.Active = 'Y';
                                //    nitem.IsSubCategoryChecked = true;
                                //}
                                //if (nitem.SubCategoryId === 26) {
                                //    nitem.Active = 'Y';
                                //    nitem.IsSubCategoryChecked = true;
                                //}
                                //if (nitem.SubCategoryId === 23) {
                                //    angular.forEach(nitem.SubCategoryDetails, function (sitem) {
                                //        if (sitem.SubCategoryChildId === item.SubCategoryChildId) {
                                //            sitem.IsSubChildCategoryChecked = true;
                                //            sitem.Active = 'Y';
                                //            nitem.Active = 'Y';
                                //            nitem.IsSubCategoryChecked = true;
                                //        }
                                //    });
                                //}
                                //if (nitem.SubCategoryId === 24) {
                                //    angular.forEach(nitem.SubCategoryDetails, function (sitem) {
                                //        if (sitem.SubCategoryChildId === item.SubCategoryChildId) {
                                //            sitem.IsSubChildCategoryChecked = true;
                                //            sitem.Active = 'Y';
                                //            nitem.Active = 'Y';
                                //            nitem.IsSubCategoryChecked = true;
                                //        }
                                //    });
                                //}
                                //if (nitem.SubCategoryId === 25) {
                                //    angular.forEach(nitem.SubCategoryDetails, function (sitem) {
                                //        if (sitem.SubCategoryChildId === item.SubCategoryChildId) {
                                //            sitem.IsSubChildCategoryChecked = true;
                                //            sitem.Active = 'Y';
                                //            nitem.Active = 'Y';
                                //            nitem.IsSubCategoryChecked = true;
                                //        }
                                //    });
                                //}
                                //if (nitem.SubCategoryId === 35) {
                                //    angular.forEach(nitem.SubCategoryDetails, function (sitem) {
                                //        if (sitem.SubCategoryChildId === item.SubCategoryChildId) {
                                //            sitem.IsSubChildCategoryChecked = true;
                                //            sitem.Active = 'Y';
                                //            nitem.Active = 'Y';
                                //            nitem.IsSubCategoryChecked = true;
                                //        }
                                //    });
                                //}
                                //if (nitem.SubCategoryId === 38) {
                                //    angular.forEach(nitem.SubCategoryDetails, function (sitem) {
                                //        if (sitem.SubCategoryChildId === item.SubCategoryChildId) {
                                //            sitem.IsSubChildCategoryChecked = true;
                                //            sitem.Active = 'Y';
                                //            nitem.Active = 'Y';
                                //            nitem.IsSubCategoryChecked = true;
                                //        }
                                //    });
                                //}
                                //if (nitem.SubCategoryId === 41) {
                                //    angular.forEach(nitem.SubCategoryDetails, function (sitem) {
                                //        if (sitem.SubCategoryChildId === item.SubCategoryChildId) {
                                //            sitem.IsSubChildCategoryChecked = true;
                                //            sitem.Active = 'Y';
                                //            nitem.Active = 'Y';
                                //            nitem.IsSubCategoryChecked = true;
                                //        }
                                //    });
                                //}
                                if (nitem.SubCategoryId === item.SubCategoryId) {
                                    nitem.Active = 'Y';
                                    nitem.IsSubCategoryChecked = true;
                                    if (nitem.SubCategoryId == 38) {
                                        if (nitem.SubCategoryDetails .length > 0) {
                                            angular.forEach(nitem.SubCategoryDetails, function (oitem) {
                                                if (oitem.SubCategoryChildId == item.SubCategoryChildId) {
                                                    oitem.Active = 'Y';
                                                    oitem.IsSubChildCategoryChecked = true;
                                                }
                                            });
                                            var List1 = $filter("filter")(nitem.SubCategoryDetails, { "IsSubChildCategoryChecked": true }, true) || [];
                                            if (nitem.SubCategoryDetails.length === List1.length) {
                                                nitem.IsCategoryChecked = true;
                                                nitem.IsSelectAllSubCategoryChecked = true;
                                            }
                                            else {
                                                nitem.IsCategoryChecked = false;
                                                nitem.IsSelectAllSubCategoryChecked = false;
                                            }
                                        }
                                    }
                                    if (nitem.SubCategoryId == 23) {
                                        if (nitem.SubCategoryDetails.length > 0) {
                                            angular.forEach(nitem.SubCategoryDetails, function (oitem) {
                                                if (oitem.SubCategoryChildId == item.SubCategoryChildId) {
                                                    oitem.Active = 'Y';
                                                    oitem.IsSubChildCategoryChecked = true;
                                                }
                                            });
                                            var List1 = $filter("filter")(nitem.SubCategoryDetails, { "IsSubChildCategoryChecked": true }, true) || [];
                                            if (nitem.SubCategoryDetails.length === List1.length) {
                                                nitem.IsCategoryChecked = true;
                                                nitem.IsSelectAllSubCategoryChecked = true;
                                            }
                                            else {
                                                nitem.IsCategoryChecked = false;
                                                nitem.IsSelectAllSubCategoryChecked = false;
                                            }
                                        }
                                    }
                                    if (nitem.SubCategoryId == 41) {
                                        if (nitem.SubCategoryDetails.length > 0) {
                                            angular.forEach(nitem.SubCategoryDetails, function (oitem) {
                                                if (oitem.SubCategoryChildId == item.SubCategoryChildId) {
                                                    oitem.Active = 'Y';
                                                    oitem.IsSubChildCategoryChecked = true;
                                                }
                                            });
                                            var List1 = $filter("filter")(nitem.SubCategoryDetails, { "IsSubChildCategoryChecked": true }, true) || [];
                                            if (nitem.SubCategoryDetails.length === List1.length) {
                                                nitem.IsCategoryChecked = true;
                                                nitem.IsSelectAllSubCategoryChecked = true;
                                            }
                                            else {
                                                nitem.IsCategoryChecked = false;
                                                nitem.IsSelectAllSubCategoryChecked = false;
                                            }
                                        }
                                    }
                                    if (nitem.SubCategoryId == 21) {
                                        if (nitem.SubCategoryDetails.length > 0) {
                                            angular.forEach(nitem.SubCategoryDetails, function (oitem) {
                                                if (oitem.SubCategoryChildId == item.SubCategoryChildId) {
                                                    oitem.Active = 'Y';
                                                    oitem.IsSubChildCategoryChecked = true;
                                                }
                                            });
                                            var List1 = $filter("filter")(nitem.SubCategoryDetails, { "IsSubChildCategoryChecked": true }, true) || [];
                                            if (nitem.SubCategoryDetails.length === List1.length) {
                                                nitem.IsCategoryChecked = true;
                                                nitem.IsSelectAllSubCategoryChecked = true;
                                            }
                                            else {
                                                nitem.IsCategoryChecked = false;
                                                nitem.IsSelectAllSubCategoryChecked = false;
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                    else if (mitem.CategoryId === 5 || mitem.CategoryId === 6 || mitem.CategoryId === 7 || mitem.CategoryId === 8) {
                        angular.forEach(mitem.CategoryDetails, function (nitem) {
                            if (nitem.SubCategoryId === item.SubCategoryId) {
                                nitem.Active = 'Y';
                                nitem.IsSubCategoryChecked = true;
                                mitem.IsCategoryChecked = true;
                            }
                        });
                    }
                    else if (mitem.CategoryId === 9) {
                        angular.forEach(mitem.CategoryDetails, function (nitem) {
                            if (nitem.SubCategoryId === item.SubCategoryId) {
                                if (nitem.SubCategoryId === 68) {
                                    angular.forEach(nitem.SubCategoryDetails, function (sitem) {
                                        if (sitem.SubCategoryChildId === item.SubCategoryChildId) {
                                            sitem.IsSubChildCategoryChecked = true;
                                            sitem.Active = 'Y';
                                            nitem.Active = 'Y';
                                            nitem.IsSubCategoryChecked = true;
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            });
            $scope.AddToCache();
        }

        if (Type === "Edit") {
            $scope.cacheStorageItem.DefaultTemplateArray = angular.copy($scope.tempConsultationArrayList);
            $scope.obj.IssetasDefaultTemplete = $scope.obj.IssetasDefaultTemplete || false;

            $rootScope.$broadcast("loader_hide");
            $("#maineHnoteLoader").hide();
            $scope.maineHnoteLoader = false;
            $rootScope.mainsubeHnoteLoader = false;

            if ($scope.cacheStorageItem.DefaultTemplateArray.length > 0) {
                angular.forEach($scope.cacheStorageItem.DefaultTemplateArray, function (ditem) {
                    if (ditem.CategoryId === 2 || ditem.CategoryId === 3) {
                        var filterros = $filter("filter")(ditem.CategoryDetails, function (kitem, index) { return kitem.IsSubCategoryChecked == true }) || [];
                        if (filterros.length === ditem.CategoryDetails.length) {
                            ditem.IsCategoryChecked = true;
                        }
                    }
                    if (ditem.CategoryId === 4) {
                        angular.forEach(ditem.CategoryDetails, function (subitem) {
                            if (subitem.SubCategoryId == 21 || subitem.SubCategoryId == 23 || subitem.SubCategoryId == 35 || subitem.SubCategoryId == 38 || subitem.SubCategoryId == 41) {
                                var filterexam = $filter("filter")(subitem.SubCategoryDetails, function (kitem, index) { return kitem.IsSubChildCategoryChecked == true }) || [];
                                if (filterexam.length === subitem.SubCategoryDetails.length) {
                                    subitem.IsSubCategoryChecked = true;
                                } else {
                                    subitem.IsSubCategoryChecked = false;
                                }
                            }
                        });

                        var filterros = $filter("filter")(ditem.CategoryDetails, function (kitem, index) { return kitem.IsSubCategoryChecked == true }) || [];
                        if (filterros.length === ditem.CategoryDetails.length) {
                            ditem.IsCategoryChecked = true;
                            ditem.IsSelectAllSubCategoryChecked = true;
                        }
                    }
                });
            }

            $scope.AddToCache();
            if (setas === "setas") {
                $scope.NewFinalTemplateSubmit();
                $scope.saveSetasDefault(tempdetails);
            }
        } else {
            if (($scope.RoleId === 10 || $scope.RoleId === 61) && $scope.cacheStorageItem.AppointmentType !== "Followup" && $scope.cacheStorageItem.appointmentStatus !== "B") {
                $scope.tempConsultationArrayList = $scope.tempConsultationArrayList || [];
                var list = [];
                if ($scope.tempConsultationArrayList.length > 0) {
                    angular.forEach($scope.tempConsultationArrayList, function (litem, index) {
                        if (litem.CategoryId === 5) {
                            litem.CategoryDetails = $filter("filter")(litem.CategoryDetails, function (kitem, index) { return kitem.SubCategoryId === 30 || kitem.SubCategoryId === 27 || kitem.SubCategoryId === 39 });
                        }
                    });
                }
            }
            if ($scope.SpecializationId !== 3) {
                $scope.tempConsultationArrayList = $filter("filter")($scope.tempConsultationArrayList, function (kitem, index) { return kitem.CategoryId !== 3 });
            }
            if ($scope.tempConsultationArrayList !== undefined) {
                if ($scope.tempConsultationArrayList.length > 0) {
                }
            }
            $scope.cacheStorageItem.DefaultTemplateArray = angular.copy($scope.tempConsultationArrayList);
            angular.forEach($scope.cacheStorageItem.DefaultTemplateArray, function (pitem) {

                pitem.IsActive = false;
                if (pitem.CategoryId === 1) {
                    pitem.IsActive = true;
                }
                pitem.IsOpen = true;
                $scope.cacheStorageItem.SuperBillArray = $scope.cacheStorageItem.SuperBillArray || [];
                if ($scope.cacheStorageItem.SuperBillArray.length > 0) {
                    if (pitem.CategoryId === 5) {
                        angular.forEach(pitem.CategoryDetails, function (subpitem) {
                            if (subpitem.SubCategoryId === 48) {
                                subpitem.IsSubCategoryChecked = true;
                                subpitem.Active = 'Y';
                            }
                        });
                    }

                }
            });

            if ($scope.cacheStorageItem.IsEditConsultation) {
                $scope.CheckContactLensCategory();
            } else {
                $scope.cacheStorageItem.ContactLensDetails = [];
            }

            $scope.AddToCache();
        }
    };
    function NewGetTemplateDetails(otherwise) {
        var tappid = appointmentinfo.DoctorID ? appointmentinfo.DoctorID : $scope.User.UserId;
        appointmentinfo.OptometristId = appointmentinfo.OptometristId || null;
        if ($scope.RoleId === 10 || $scope.RoleId === 61) {
            tappid = appointmentinfo.OptometristId === null ? $scope.User.UserId : appointmentinfo.OptometristId;
        }
        eHnotePatientDataService.GetLatestUserConsultationMasterTemplateDtls(tappid).then(function (resp) {
            if (resp.data !== undefined) {
                if (resp.data.rows.length > 0) {
                    $scope.RestructuredDocInvTemplates = [];
                    $scope.RestructuredDocInvTemplates = resp.data.rows || [];

                    $scope.CopyConsultationTempale = angular.copy($scope.RestructuredDocInvTemplates);

                    if (otherwise === "Save") {
                        var defaultTemplateArray = $filter("filter")(
                            resp.data.rows,
                            { "IssetasDefaultTemplete": true },
                            true
                        );

                        if (defaultTemplateArray.length > 0) {
                            var defaultTemplate = defaultTemplateArray[0];

                            // Reset current template selection
                            angular.forEach($scope.tempConsultationArrayList, function (item) {

                                item.IsCategoryChecked = false;

                                angular.forEach(item.CategoryDetails, function (mitem) {

                                    mitem.IsSubCategoryChecked = false;
                                    mitem.Active = 'N';

                                    if (mitem.SubCategoryDetails &&
                                        mitem.SubCategoryDetails.length > 0) {

                                        angular.forEach(
                                            mitem.SubCategoryDetails,
                                            function (sitem) {
                                                sitem.IsSubChildCategoryChecked = false;
                                                sitem.Active = 'N';
                                            }
                                        );
                                    }
                                });
                            });
                            // Load latest default template selections
                            NewtemplateDataLoad(
                                angular.copy(defaultTemplate.TemplateDetails || []),
                                "Edit"
                            );

                            $scope.TemplateId = defaultTemplate.UserTemplateId;
                            $scope.obj.TemplateName = defaultTemplate.TemplateName;
                            $scope.obj.IssetasDefaultTemplete =
                                defaultTemplate.IssetasDefaultTemplete;

                            $scope.selectedTemplate = defaultTemplate;
                        }

                    }
                    else {
                        $scope.TemplateArray = $filter("filter")(resp.data.rows, { "IssetasDefaultTemplete": true }, true);
                        if ($scope.TemplateArray.length > 0) {
                            $scope.obj.IssetasDefaultTemplete = $scope.TemplateArray[0].IssetasDefaultTemplete;
                            $scope.obj.TemplateName = $scope.TemplateArray[0].TemplateName;
                            $scope.selectedTemplate = $scope.TemplateArray[0];
                            $scope.TemplateArray = $scope.TemplateArray[0].TemplateDetails;
                            $scope.TemplateId = resp.data.rows[0].UserTemplateId;
                            NewtemplateDataLoad($scope.TemplateArray);
                        }
                        else {
                            $scope.TemplateArray = $scope.tempConsultationArrayList;
                            $scope.TemplateId = resp.data.rows[0].UserTemplateId;
                            angular.forEach($scope.TemplateArray, function (item) {
                                angular.forEach(item.CategoryDetails, function (mitem) {
                                    mitem.Active = 'Y';
                                    mitem.IsSubCategoryChecked = false;
                                });
                            });
                            if ($scope.RoleId === 10 || $scope.RoleId === 61) {
                                var list = [];
                                if ($scope.tempConsultationArrayList.length > 0) {
                                    angular.forEach($scope.tempConsultationArrayList, function (litem, index) {
                                        if (litem.CategoryId === 5) {
                                            litem.CategoryDetails = $filter("filter")(litem.CategoryDetails, function (kitem, index) { return kitem.SubCategoryId === 30 || kitem.SubCategoryId === 27 || kitem.SubCategoryId === 39 });
                                        }
                                    });
                                }
                            }
                            $scope.cacheStorageItem.DefaultTemplateArray = $scope.TemplateArray;
                            angular.forEach($scope.cacheStorageItem.DefaultTemplateArray, function (pitem) {
                                pitem.IsActive = false;
                                if (pitem.CategoryId === 1) {
                                    pitem.IsActive = true;
                                }
                                pitem.IsOpen = true;

                                if ($scope.cacheStorageItem.SuperBillArray.length > 0) {
                                    if (pitem.CategoryId === 5) {
                                        angular.forEach(pitem.CategoryDetails, function (subpitem) {
                                            if (subpitem.SubCategoryId === 48) {
                                                subpitem.IsSubCategoryChecked = true;
                                                subpitem.Active = 'Y';
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }, function (error) {
        });
    };
    $scope.saveSetasDefault = function (tempdetails) {
        var tappid = appointmentinfo.DoctorID ? appointmentinfo.DoctorID : $scope.User.UserId;
        appointmentinfo.OptometristId = appointmentinfo.OptometristId || null;
        if ($scope.RoleId === 10 || $scope.RoleId === 61) {
            tappid = appointmentinfo.OptometristId === null ? $scope.User.UserId : appointmentinfo.OptometristId;
        }
      //  var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to set as a default template  ?", function () {
            var object = {
                "UserId": tappid,
                "TemplateId": tempdetails.UserTemplateId || 0,
                "DeleteInd": 'N',
                "TemplateName": $scope.obj.TemplateName || "",
                "IssetasDefaultTemplete": true,
                "TemplateDetails": $scope.cacheStorageItem.FinalSubmitArray,
                "IsTemplateFavorites": tempdetails.IsTemplateFavorites || false
            };
            eHnotePatientDataService.ModifyDocConsultationMasterTemplate(object).then(function (resp) {
                if (resp.data.status === 'Success') {
                    if ($scope.TemplateId === 0) {
                        alertify.success('Set as Default Successfully');
                    }
                    NewGetTemplateDetails("Save");
                }
                else {
                    alertify.error(resp.data.Message);
                }

            }, function (errorr) {

                console.log(error);
            });
        //}, function () {
        //    r = "You pressed Cancel!";
        //});
    };
    $scope.ChangesForDiagnosistemplateInConsultation = function (DiagnosisTemplatedeatils) {
        $scope.cacheStorageItem.ChiefComplaints = [];
        if (DiagnosisTemplatedeatils.ChiefComplaintsArray != undefined && DiagnosisTemplatedeatils.ChiefComplaintsArray.length > 0) {
            var i = 0;
            if ($scope.cacheStorageItem.ChiefComplaints.length > 0) {
                angular.forEach(DiagnosisTemplatedeatils.ChiefComplaintsArray, function (nitem) {
                    angular.forEach($scope.cacheStorageItem.ChiefComplaints, function (mitem) {
                        if (nitem.ChiefComplaintId === mitem.ChiefComplaintId) {
                            i++;
                        }
                    });
                });
            }
            //if (i !== 0) {
            //    alertify.error("Diagnosis Already Added");
            //    return false;
            //}
            angular.forEach(DiagnosisTemplatedeatils.ChiefComplaintsArray, function (item) {
                if (item.ActiveInd == 'Y') {
                var obj = {
                    "ActiveInd": item.ActiveInd || "Y",
                    "Duration": item.Duration || 0,
                    "SeverityId": item.SeverityId || null,
                    "DurationType": item.DurationType || "D",
                    "ModifyFactorId": item.ModifyFactorId || null,
                    "QualityId": item.QualityId || null,
                    "ContextId": item.ContextId || null,
                    "AssosSignId": item.AssosSignId || null,
                    "EyeDurationId": item.EyeDurationId || null,
                    "OrganId": item.OrganId || "",
                    "ChiefComplaintId": item.ChiefComplaintId || null,
                    "Description": item.Description || '',
                    "ChiefComplaintName": item.ChiefComplaintName || '',
                    "IsDescriptionEdit": item.IsDescriptionEdit || false,
                }
                if (i=== 0) {
                //    obj.IsEdit = true;
                    $scope.cacheStorageItem.ChiefComplaints.push(obj);
                }
            }

        });
        }
        if (DiagnosisTemplatedeatils.DiagnosisArray != undefined && DiagnosisTemplatedeatils.DiagnosisArray.length > 0) {
            var i = 0;
            if ($scope.cacheStorageItem.AssessmentPlan.length > 0) {
                angular.forEach(DiagnosisTemplatedeatils.DiagnosisArray, function (nitem) {
                    angular.forEach($scope.cacheStorageItem.AssessmentPlan, function (mitem) {
                        if (nitem.DiagnosisId === mitem.DiagnosisId) {
                            i++;
                        }
                    });
                });
            }
            if (i !== 0) {
                alertify.error("Diagnosis Already Added");
                return false;
            }

            angular.forEach(DiagnosisTemplatedeatils.DiagnosisArray, function (Ditem) {
                
                var obj = {
                    "SnomedCodeId": Ditem.SnomedCodeId,
                    "SnomedCode": Ditem.SnomedCode,                  
                    "SnomedDescription": Ditem.SnomedDescription,
                    "CreatedDateTime": $filter('date')(new Date(), "dd-MMM-yyyy h:mm a"),
                    "ConsultationDiagnosisId": 0,
                    "AssessmentPlanId": 0,
                    "AssessmentPlan": {
                        "AssessmentPlanId": 0,
                        "PlanofDiscussionsNotes": Ditem.AssessmentPlan.PlanofDiscussionsNotes||"",
                        "PatientInstructions": Ditem.AssessmentPlan.PatientInstructions || "",
                        "AssessmentsNotes": Ditem.AssessmentPlan.AssessmentsNotes || "",
                        "DoctorNotes": Ditem.AssessmentPlan.DoctorNotes || "",
                        "ActionsTaken": Ditem.AssessmentPlan.ActionsTaken || ""
                    },
                    "SpecializationId": $scope.SpecializationId,
                    "OrganId": Ditem.OrganId || null,
                    "OrganName": GetEyeName(Ditem.OrganId),
                    "DiagnosisId": Ditem.DiagnosisId,
                    "DiagnosisName": Ditem.DiagnosisName,
                    "DiagnosisObject": {
                        "DiagnosisCode": Ditem.DiagnosisCode,
                        "DiagnosisId": Ditem.DiagnosisId,
                        "DiagnosisName": Ditem.DiagnosisName,
                        "DiagnosisNotes": Ditem.DiagnosisNotes,
                        "FullName": Ditem.FullName,
                        "HospitalId": Ditem.HospitalId,
                        "ICD10CODE": Ditem.ICD10CODE,
                        "UserId": Ditem.UserId
                    },
                    "DiagnosisRiskLevel": Ditem.DiagnosisRiskLevel,
                    "FindingDiagnosisId": 0,
                    "DiagnosisHistoryId": 0,
                    "ICD10CODE": Ditem.ICD10CODE,
                    "ICD10DIAGDESCRIPTION": Ditem.FullName,
                    "ICD10DIAGNAME": Ditem.DiagnosisName,
                    "DiagnosisStatus": Ditem.DiagnosisStatus,
                    "PlanOfcareNotesArray": Ditem.PlanOfCareNotesArray || [],
                    "PlanofDiscussionsNotes": Ditem.PlanofDiscussionsNotes ||"",
                    "PatientInstructions": Ditem.PatientInstructions || "",
                    "AssessmentsNotes": Ditem.AssessmentPlan.AssessmentsNotes || "",
                    "DoctorNotes": Ditem.DoctorNotes ||"",
                    "ActionsTaken": Ditem.ActionsTaken ||"",
                    "ReferralArray": Ditem.ReferralArray || [],
                    "ProceduresArray": Ditem.ProceduresArray || [],
                    "PrescriptionArray": [],
                    "SurgeryArray": Ditem.SurgeriesArray || [],
                    "InvestigationsArray": Ditem.InvestigationsArray || [],
                    "InvestigationFindingId": 0,
                    "FindingId": 0,
                    "ActiveInd": "Y",
                    "DeleteInd": "N",
                    "IsSummaryViewInd":true,
                    "ProceduresAddedTime": "",
                    "PrescriptionAddedTime": "",
                    "PlanOfCareAddedTime": "",
                    "SurgeryAddedTime": "",
                    "Type": 'Optha',

                    "LocationId1": Ditem.LocationId1 || 0,
                    "SeverityId1": Ditem.SeverityId1,
                    "Verificationstatusid1": 0,
                    "DiagnosisStatusId1": 2,
                    "DiagnosisStatus1": 'Active',
                    "EndDate1": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                    "StartDate1": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),

                    "LocationId2": Ditem.LocationId2|| 0,
                    "SeverityId2": Ditem.SeverityId2,
                    "Verificationstatusid2": 0,
                    "DiagnosisStatusId2": 2,
                    "DiagnosisStatus2": 'Active',
                    "EndDate2": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                    "StartDate2": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                    
                }
                obj.CreatedDateTime = $filter('date')(new Date(), "MM-dd-yyyy h:mm a");

                $scope.cacheStorageItem.AssessmentPlan.push(obj);
            });

            //$scope.AssessmentSection.isAssessmentData = true;
        }

        //if (DiagnosisTemplatedeatils.Medications != undefined && DiagnosisTemplatedeatils.Medications.length > 0) {
        //    angular.forEach(DiagnosisTemplatedeatils.Medications, function (Ditem) {
        //        Ditem.ShowPrescriptiondiv = true;
        //        if (Ditem.PrescriptionType === "GenericMedicine") {
        //            if (Ditem.PrescriptionData.Duration == "1" || Ditem.PrescriptionData.Duration == "2" || Ditem.PrescriptionData.Duration == "3") {
        //                Ditem.PrescriptionData.DurationValueInd = Ditem.PrescriptionData.Duration;
        //            } else {
        //                Ditem.PrescriptionData.DurationValueInd = "4";
        //            }
        //            Ditem.PrescriptionData.FrequencyValueInd = 3;
        //            Ditem.PrescriptionData.DosageValueInd = 4;
        //        }
        //        $scope.cacheStorageItem.Prescriptions.push(Ditem);
        //    });
        //}
        if (DiagnosisTemplatedeatils.MedicationsArray != undefined && DiagnosisTemplatedeatils.MedicationsArray.length > 0) {
            $scope.cacheStorageItem.PrescriptionDetails = [];
            angular.forEach(DiagnosisTemplatedeatils.MedicationsArray, function (Ditem) {
                if (Ditem.DeleteInd == 'N') {
                    Ditem.Type = 'MedicineOrders';
                    var object = {
                        "UserId": $scope.UserId,
                        "OrganizationId": $scope.HospitalId,
                        "PatientId": '',
                        "RcopiaPatientId": "",
                        "PatientPrescriptionId": 0,
                        "AppointmentId": '',
                        "ProviderId": '',
                        "PrescribedDate": '',
                        "RcopiaPrescriptionId": "",
                        "LastUpdateDate": '',
                        "PharmacyId": 0,
                        "RcopiaPharmacyId": "",
                        "PrescriberOrderNumber": "",
                        "RxReferenceNumber": "",
                        "PrescriptionAction": "",
                        "CompletedDate": null,
                        "SignedDate": null,
                        "StopDate": null,
                        "LastModifiedBy": $scope.UserId,
                        "LastModifiedDate": '',
                        "CompleteAction": "Created",
                        "PrescriptionSentMethod": "",
                        "PrescriptionStatus": "",
                        "RcopiaDeleted": "n",
                        "DeleteInd": 'N',
                        "PrescriptionDetails": []
                    }
                    object.PrescriptionDetails.push(Ditem);
                    $scope.cacheStorageItem.PrescriptionDetails.push(object);
                }
            });
           
        }
        DiagnosisTemplatedeatils.InvestigationsArray = DiagnosisTemplatedeatils.InvestigationsArray || [];
        if (DiagnosisTemplatedeatils.InvestigationsArray.length > 0) {
            angular.forEach(DiagnosisTemplatedeatils.InvestigationsArray, function (iitem) {
                iitem.ProcedureCode = iitem.ProcedureCode;
                iitem.Description = iitem.InvestigationName;
                iitem.DiagnosisList = iitem.DiagnosisList || [];
                let filterInv = [];
                if ($scope.cacheStorageItem.InvestigationsDetails.length > 0) {
                    filterInv = $filter("filter")($scope.cacheStorageItem.InvestigationsDetails, function (Aitem, index) { return Aitem.OrgDescriptionId == iitem.OrgDescriptionId && Aitem.DeleteInd == 'N' },);
                }
                if (filterInv.length == 0) {
                    var object = {
                        "PatientOrderId": 0,
                        "SpecializationId": $scope.SpecializationId,
                        "OrderTypeId": 1,
                        "DescriptionId": iitem.ProcedureId || "",
                        "Description": iitem.Description || "",
                        "ProcedureCode": iitem.ProcedureCode || 0,
                        "OrgDescriptionId": iitem.OrgDescriptionId || 0,
                        "Remarks": "",
                        "OrganId": iitem.OrganId || '',
                        "OrganName": iitem.OrganName || "OD",
                        "BillingCode": "",
                        "BookingStatusId": iitem.BookingStatusId || "2",
                        "CPTCode": iitem.CPTCode || '',
                        "StatusId": iitem.StatusId || '',
                        "DeleteInd": "N",
                        "InvSpecialityId": "",
                        "PatientSurgeryId": 0,
                        "SurgeryListId": 0,
                        "IsEditData": false,
                        "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                        "DurationType": iitem.DurationType || "D",
                        "CoordinatorId": iitem.CoordinatorId || 0,
                        "ExternalCoManagerId": iitem.ExternalCoManagerId || 0,
                        "InternalCoManagerId": iitem.InternalCoManagerId || 0,
                        "ShowDateFormat": true,
                        "Duration": '',
                        "DurationType": '',
                        "DurationDate": '',
                        "DiagnosisList": [],
                        "OrderType": "Investigations",
                        "ModalityId": 1,
                        "AdvicedInvestigationId": 0,
                        "PatientInvestigationId": 0,
                        "PatientProcedureId": 0,
                        "StatusId": 1,
                        "Status": "Active",
                        "CoordinatorNotes": "",
                        "CoordinatorStatusId": null,
                        "PreAdmissionDate": "",
                        "AscAppointmentDate": "",
                        "FirstFollowupDate": "",
                        "SecondFollowupDate": "",
                        "ThirdFollowupDate": "",
                        "SurgeonId": null,
                        "CoSurgeonId": null,
                        "NurseId": null,
                        "AnesthetistId": null,
                        "PatientImageStudyId": 0,
                    }
                    $scope.cacheStorageItem.InvestigationsDetails.push(object);
                }
               /* $scope.cacheStorageItem.InvestigationsDetails.push(iitem);*/
            });
        }

        DiagnosisTemplatedeatils.ProceduresArray = DiagnosisTemplatedeatils.ProceduresArray || [];
        if (DiagnosisTemplatedeatils.ProceduresArray.length > 0) {
            $scope.cacheStorageItem.ProceduresDetails = [];
            angular.forEach(DiagnosisTemplatedeatils.ProceduresArray, function (iitem) {
                iitem.ProcedureCode = iitem.ProcedureCode;
                iitem.Description = iitem.ProcedureName;
                iitem.DiagnosisList = iitem.DiagnosisList || [];
                let filterInv = [];
                if ($scope.cacheStorageItem.ProceduresDetails.length > 0) {
                    filterInv = $filter("filter")($scope.cacheStorageItem.ProceduresDetails, function (Aitem, index) { return Aitem.OrgDescriptionId == iitem.OrgDescriptionId && Aitem.DeleteInd == 'N' },);
                }
                if (filterInv.length == 0) {
                    var object = {
                        "PatientOrderId": 0,
                        "SpecializationId": $scope.SpecializationId,
                        "OrderTypeId": 2,
                        "DescriptionId": iitem.ProcedureId || "",
                        "Description": iitem.ProcedureName || "",
                        "ProcedureCode": iitem.ProcedureCode || 0,
                        "OrgDescriptionId": iitem.OrgDescriptionId || 0,
                        "Remarks": "",
                        "OrganId": iitem.OrganId || '',
                        "OrganName": iitem.OrganName || "OD",
                        "BillingCode": "",
                        "BookingStatusId": iitem.BookingStatusId || "2",
                        "CPTCode": iitem.CPTCode || '',
                        "StatusId": iitem.StatusId || '',
                        "DeleteInd": "N",
                        "InvSpecialityId": "",
                        "PatientSurgeryId": 0,
                        "SurgeryListId": 0,
                        "IsEditData": false,
                        "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                        "DurationType": iitem.DurationType || "D",
                        "CoordinatorId": iitem.CoordinatorId || 0,
                        "ExternalCoManagerId": iitem.ExternalCoManagerId || 0,
                        "InternalCoManagerId": iitem.InternalCoManagerId || 0,
                        "ShowDateFormat": true,
                        "Duration": '',
                        "DurationType": '',
                        "DurationDate": '',
                        "DiagnosisList": [],
                        "OrderType": "Procedure",
                        "ModalityId": 1,
                        "AdvicedInvestigationId": 0,
                        "PatientInvestigationId": 0,
                        "PatientProcedureId": 0,
                        "StatusId": 1,
                        "Status": "Active",
                        "CoordinatorNotes": "",
                        "CoordinatorStatusId": null,
                        "PreAdmissionDate": "",
                        "AscAppointmentDate": "",
                        "FirstFollowupDate": "",
                        "SecondFollowupDate": "",
                        "ThirdFollowupDate": "",
                        "SurgeonId": null,
                        "CoSurgeonId": null,
                        "NurseId": null,
                        "AnesthetistId": null,
                    }
                    $scope.cacheStorageItem.ProceduresDetails.push(object);
                }
                /*$scope.cacheStorageItem.ProceduresDetails.push(iitem);*/
            });
        }

        DiagnosisTemplatedeatils.SurgeryArray = DiagnosisTemplatedeatils.SurgeryArray || [];
        if (DiagnosisTemplatedeatils.SurgeryArray.length > 0) {
            $scope.cacheStorageItem.SurgeriesDetails = [];
            angular.forEach(DiagnosisTemplatedeatils.SurgeryArray, function (iitem) {
                /*iitem.ProcedureCode = iitem.OrganizationSurgeryId;*/
                iitem.ProcedureCode = iitem.ProcedureCode;
                iitem.Description = iitem.SurgeryName;
                iitem.DiagnosisList = iitem.DiagnosisList || [];
                let filterInv = [];
                if ($scope.cacheStorageItem.SurgeriesDetails.length > 0) {
                    filterInv = $filter("filter")($scope.cacheStorageItem.SurgeriesDetails, function (Aitem, index) { return Aitem.OrgDescriptionId == iitem.OrgDescriptionId && Aitem.DeleteInd == 'N' },);
                }
                if (filterInv.length == 0) {
                    var object = {
                        "PatientOrderId": 0,
                        "SpecializationId": $scope.SpecializationId,
                        "OrderTypeId": 3,
                        "DescriptionId": iitem.ProcedureId || "",
                        "Description": iitem.SurgeryName || "",
                        "ProcedureCode": iitem.ProcedureCode || 0,
                        "OrgDescriptionId": iitem.OrgDescriptionId || 0,
                        "Remarks": "",
                        "OrganId": iitem.OrganId || '',
                        "OrganName": iitem.OrganName || "OD",
                        "BillingCode": "",
                        "BookingStatusId": iitem.BookingStatusId || "2",
                        "CPTCode": iitem.CPTCode || '',
                        "StatusId": iitem.StatusId || '',
                        "DeleteInd": "N",
                        "InvSpecialityId": "",
                        "PatientSurgeryId": 0,
                        "SurgeryListId": 0,
                        "IsEditData": false,
                        "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                        "DurationType": iitem.DurationType || "D",
                        "CoordinatorId": iitem.CoordinatorId || 0,
                        "ExternalCoManagerId": iitem.ExternalCoManagerId || 0,
                        "InternalCoManagerId": iitem.InternalCoManagerId || 0,
                        "ShowDateFormat": true,
                        "Duration": '',
                        "DurationType": '',
                        "DurationDate": '',
                        "DiagnosisList": [],
                        "OrderType": "Surgery",
                        "ModalityId": 1,
                        "AdvicedInvestigationId": 0,
                        "PatientInvestigationId": 0,
                        "PatientProcedureId": 0,
                        "StatusId": 1,
                        "Status": "Active",
                        "CoordinatorNotes": "",
                        "CoordinatorStatusId": null,
                        "PreAdmissionDate": "",
                        "AscAppointmentDate": "",
                        "FirstFollowupDate": "",
                        "SecondFollowupDate": "",
                        "ThirdFollowupDate": "",
                        "SurgeonId": null,
                        "CoSurgeonId": null,
                        "NurseId": null,
                        "AnesthetistId": null,
                        "CordinatorIOLType":'',
                        "ManufacturerName":'',
                        "Power":'',
                        "PreAdmAppointmentDate":'',
                        "OTAppointmentDate":'',
                        "SurgeonName":'',
                        "CoSurgeonName":'',
                        "NurseName":'',
                        "AnesthetistName":'',
                    }
                    $scope.cacheStorageItem.SurgeriesDetails.push(object);
                }
               /* $scope.cacheStorageItem.SurgeriesDetails.push(iitem);*/
            });
        }

        DiagnosisTemplatedeatils.ReferralArray = DiagnosisTemplatedeatils.ReferralArray || [];
        if (DiagnosisTemplatedeatils.ReferralArray.length > 0) {
            $scope.cacheStorageItem.ReferralDetails = [];
            angular.forEach(DiagnosisTemplatedeatils.ReferralArray, function (iitem) {
                iitem.DiagnosisList = iitem.DiagnosisList || [];
                $scope.cacheStorageItem.ReferralDetails.push(iitem);
            });
        }

        DiagnosisTemplatedeatils.AnteriorValuesArray = DiagnosisTemplatedeatils.AnteriorValuesArray || [];
        DiagnosisTemplatedeatils.PosteriorValuesArray = DiagnosisTemplatedeatils.PosteriorValuesArray || [];
        $scope.cacheStorageItem.AnteriorSegmentArrayNew = DiagnosisTemplatedeatils.AnteriorValuesArray || [];
        $scope.cacheStorageItem.PoteriorSegmentArrayNew = DiagnosisTemplatedeatils.PosteriorValuesArray || [];
       

        var data = DiagnosisTemplatedeatils.AnteriorValuesArray || [];
        var data1 = DiagnosisTemplatedeatils.PosteriorValuesArray || [];
        $rootScope.$broadcast('myEvent', data);
        $rootScope.$broadcast('Event', data1);
        DiagnosisTemplatedeatils.ExternalExaminationsValuesArray = DiagnosisTemplatedeatils.ExternalExaminationsValuesArray || [];
        if (DiagnosisTemplatedeatils.AnteriorValuesArray.length > 0 || DiagnosisTemplatedeatils.ExternalExaminationsValuesArray.length > 0 || DiagnosisTemplatedeatils.PosteriorValuesArray.length > 0) {
            angular.forEach($scope.cacheStorageItem.DefaultTemplateArray, function (aItem) {
                console.log(aItem);
                if (aItem.CategoryId===4) {
                    aItem.IsCategoryChecked = true;
                    aItem.IsActive = true;
                    if (DiagnosisTemplatedeatils.AnteriorValuesArray.length > 0 ) {
                        angular.forEach(aItem.CategoryDetails, function (mitem) {
                            if (mitem.SubCategoryId === 24) {
                                mitem.IsSubCategoryChecked = true;
                                mitem.Active = 'Y';
                                angular.forEach(mitem.SubCategoryDetails, function (csitem) {
                                    
                                    console.log(csitem.SubCategoryChildId);


                                    var filteredSubCatArray = $filter("filter")(DiagnosisTemplatedeatils.AnteriorValuesArray, { "SubCategoryChildId": csitem.SubCategoryChildId }, true);

                                    console.log(filteredSubCatArray);

                                    if (filteredSubCatArray.length > 0) {
                                        csitem.IsSubChildCategoryChecked = true;
                                        csitem.isActive = true;  
                                        angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (casitem) {
                                            if (casitem.InvestigationId === filteredSubCatArray[0].InvestigationId) {
                                                casitem.IsSelected = true;
                                                casitem.RightEye.RemarksArray = filteredSubCatArray[0].RightEyeRemarks || [];
                                                casitem.LeftEye.RemarksArray = filteredSubCatArray[0].LeftEyeRemarks || [];
                                                casitem.BothEye.RemarksArray = filteredSubCatArray[0].BothEyeRemarks || [];
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }


                    if (DiagnosisTemplatedeatils.PosteriorValuesArray.length > 0) {
                        angular.forEach(aItem.CategoryDetails, function (mitem) {
                            if (mitem.SubCategoryId === 25) {
                                mitem.IsSubCategoryChecked = true;
                                mitem.Active = 'Y';

                                angular.forEach(mitem.SubCategoryDetails, function (csitem) {
                                    console.log(csitem.SubCategoryChildId);

                                    var filteredSubCatArray = $filter("filter")(DiagnosisTemplatedeatils.PosteriorValuesArray, { "SubCategoryChildId": csitem.SubCategoryChildId }, true);

                                    console.log(filteredSubCatArray);
                                    if (filteredSubCatArray.length > 0) {
                                        csitem.IsSubChildCategoryChecked = true;
                                        csitem.isActive = true;
                                        angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (casitem) {
                                            if (casitem.InvestigationId === filteredSubCatArray[0].InvestigationId) {
                                                casitem.IsSelected = true;
                                                casitem.RightEye.RemarksArray = filteredSubCatArray[0].RightEyeRemarks || [];
                                                casitem.LeftEye.RemarksArray = filteredSubCatArray[0].LeftEyeRemarks || [];
                                                casitem.BothEye.RemarksArray = filteredSubCatArray[0].BothEyeRemarks || [];
                                            }
                                        });

                                      

                                        
                                    }
                                });
                            }
                        });
                    }
                    if (DiagnosisTemplatedeatils.ExternalExaminationsValuesArray.length > 0) {
                        angular.forEach(aItem.CategoryDetails, function (mitem) {
                            if (mitem.SubCategoryId === 35) {
                                mitem.IsSubCategoryChecked = true;
                                mitem.Active = 'Y';

                                angular.forEach(mitem.SubCategoryDetails, function (csitem) {
                                    console.log(csitem.SubCategoryChildId);
                       var filteredSubCatArray = $filter("filter")(DiagnosisTemplatedeatils.ExternalExaminationsValuesArray, { "SubCategoryChildId": csitem.SubCategoryChildId }, true);

                                    console.log(filteredSubCatArray);
                                    if (filteredSubCatArray.length >0) {
                                        csitem.IsSubChildCategoryChecked = true;
                                        csitem.isActive = true;
                                        angular.forEach($scope.cacheStorageItem.ExternalExaminationDetails, function (casitem) {
                                            if (casitem.InvestigationId === filteredSubCatArray[0].InvestigationId) {
                                                casitem.IsSelected = true;
                                                casitem.RightEye.RemarksArray = filteredSubCatArray[0].RightEyeRemarks || [];
                                                casitem.LeftEye.RemarksArray = filteredSubCatArray[0].LeftEyeRemarks || [];
                                                casitem.BothEye.RemarksArray = filteredSubCatArray[0].BothEyeRemarks || [];
                                            }
                                        });
                                    }
                                   
                                });
                            }
                        });
                    }

                    
                }

              
            });
        }



        $scope.AddToCache();
    };
    $scope.NewFinalTemplateSubmit = function () {
        $scope.cacheStorageItem.FinalSubmitArray = [];
        $scope.TempCompliantsArray = [];
        $scope.TempROSarray = [];
        $scope.TempVandParray = [];
        $scope.TempExaminationArray = [];
        $scope.TempAssessmentarray = [];
        $scope.TempOrderarray = [];
        $scope.TempMedicalRxarray = [];
        $scope.TempGlassRxarray = [];
        $scope.TempContactRxarray = [];
        var count = 0;

        if ($scope.cacheStorageItem.DefaultTemplateArray.length > 0) {
            angular.forEach($scope.cacheStorageItem.DefaultTemplateArray, function (item) {
                angular.forEach(item.CategoryDetails, function (mitem) {
                    if (item.CategoryId === 1) {
                        if (mitem.IsSubCategoryChecked) {
                            var object = {
                                "SubCategoryId": mitem.SubCategoryId,
                                "SubCategoryName": mitem.SubCategoryName,
                                "Active": "Y",
                                "SubCategoryDetails": []
                            };
                            $scope.TempCompliantsArray.push(object);
                        }
                    }
                    if (item.CategoryId === 2) {
                        if (mitem.IsSubCategoryChecked) {
                            var object = {
                                "SubCategoryId": mitem.SubCategoryId,
                                "SubCategoryName": mitem.SubCategoryName,
                                "Active": "Y",
                                "SubCategoryDetails": []
                            };
                            $scope.TempROSarray.push(object);
                        }
                    }
                    if (item.CategoryId === 3) {
                        if (mitem.IsSubCategoryChecked) {
                            var object = {
                                "SubCategoryId": mitem.SubCategoryId,
                                "SubCategoryName": mitem.SubCategoryName,
                                "Active": "Y",
                                "SubCategoryDetails": []
                            };
                            $scope.TempVandParray.push(object);
                        }
                    }
                    if (item.CategoryId === 4) {
                        //var temparray = [];
                        //if (mitem.SubCategoryId === 21 || mitem.SubCategoryId === 23 || mitem.SubCategoryId === 24 || mitem.SubCategoryId === 25 || mitem.SubCategoryId === 35 || mitem.SubCategoryId === 38 || mitem.SubCategoryId === 41) {
                        //    if (mitem.SubCategoryDetails.length > 0) {
                        //        angular.forEach(mitem.SubCategoryDetails, function (nitem) {
                        //            if (nitem.IsSubChildCategoryChecked) {
                        //                nitem.Active = 'Y';
                        //                temparray.push(nitem);
                        //            }
                        //        });
                        //    }
                        //}
                        //if (temparray.length > 0) {
                        //    var object = {
                        //        "SubCategoryId": mitem.SubCategoryId,
                        //        "SubCategoryName": mitem.SubCategoryName,
                        //        "Active": "Y",
                        //        "SubCategoryDetails": temparray
                        //    };
                        //    $scope.TempExaminationArray.push(object);
                        //}
                        //if (mitem.SubCategoryId === 22 || mitem.SubCategoryId === 26 || mitem.SubCategoryId === 77 || mitem.SubCategoryId === 78) {
                        //    if (mitem.IsSubCategoryChecked) {
                        //        var object = {
                        //            "SubCategoryId": mitem.SubCategoryId,
                        //            "SubCategoryName": mitem.SubCategoryName,
                        //            "Active": "Y",
                        //            "SubCategoryDetails": []
                        //        };
                        //        $scope.TempExaminationArray.push(object);
                        //    }
                        //}
                        //var TempExamCheck = [];
                        //if (mitem.SubCategoryId == 38 || mitem.SubCategoryId == 23 || mitem.SubCategoryId == 41 || mitem.SubCategoryId == 21) {
                        //    var TempExamCheck = $filter("filter")(mitem.SubCategoryDetails, function (iterator, ind) { return iterator.IsSubChildCategoryChecked == true }) || [];
                        //} || TempExamCheck.length > 0


                        //if (mitem.IsSubCategoryChecked) {
                        if (mitem.SubCategoryDetails.length !== 0) {
                            var object = {
                                "SubCategoryId": mitem.SubCategoryId,
                                "SubCategoryName": mitem.SubCategoryName,
                                "Active": "Y",
                                "SubCategoryDetails": []
                            };
                            angular.forEach(mitem.SubCategoryDetails, function (oitem) {
                                if (oitem.IsSubChildCategoryChecked) {
                                    var obj = {
                                        "SubCategoryChildId": oitem.SubCategoryChildId,
                                        "SubCategoryChildName": oitem.SubCategoryChildName,
                                        "Active": "Y",
                                    };
                                    object.SubCategoryDetails.push(obj);
                                }
                                if (mitem.IsSubCategoryChecked || oitem.IsSubChildCategoryChecked) {
                                    $scope.TempExaminationArray.push(object);
                                }
                            });
                        } else {
                            if (mitem.IsSubCategoryChecked) {
                                var object = {
                                    "SubCategoryId": mitem.SubCategoryId,
                                    "SubCategoryName": mitem.SubCategoryName,
                                    "Active": "Y",
                                    "SubCategoryDetails": []
                                };
                                $scope.TempExaminationArray.push(object);
                            }
                        }
                        //}
                    }
                    if (item.CategoryId === 5) {
                        if (mitem.IsSubCategoryChecked) {
                            var object = {
                                "SubCategoryId": mitem.SubCategoryId,
                                "SubCategoryName": mitem.SubCategoryName,
                                "Active": "Y",
                                "SubCategoryDetails": []
                            };
                            $scope.TempAssessmentarray.push(object);
                        }
                    }
                    if (item.CategoryId === 6) {
                        if (mitem.IsSubCategoryChecked) {
                            var object = {
                                "SubCategoryId": mitem.SubCategoryId,
                                "SubCategoryName": mitem.SubCategoryName,
                                "Active": "Y",
                                "SubCategoryDetails": []
                            };
                            $scope.TempOrderarray.push(object);
                        }
                    }
                    if (item.CategoryId === 7) {
                        if (mitem.IsSubCategoryChecked) {
                            var object = {
                                "SubCategoryId": mitem.SubCategoryId,
                                "SubCategoryName": mitem.SubCategoryName,
                                "Active": "Y",
                                "SubCategoryDetails": []
                            };
                            $scope.TempMedicalRxarray.push(object);
                        }
                    }
                    if (item.CategoryId === 8) {
                        if (mitem.IsSubCategoryChecked) {
                            var object = {
                                "SubCategoryId": mitem.SubCategoryId,
                                "SubCategoryName": mitem.SubCategoryName,
                                "Active": "Y",
                                "SubCategoryDetails": []
                            };
                            $scope.TempGlassRxarray.push(object);
                        }
                    }
                    if (item.CategoryId === 9) {
                        //if (mitem.IsSubCategoryChecked) {
                        //    var object = {
                        //        "SubCategoryId": mitem.SubCategoryId,
                        //        "SubCategoryName": mitem.SubCategoryName,
                        //        "Active": "Y",
                        //        "SubCategoryDetails": []
                        //    };
                        //    $scope.TempContactRxarray.push(object);
                        //}

                        var temparray = [];
                        if (mitem.SubCategoryId === 68) {
                            if (mitem.SubCategoryDetails.length > 0) {
                                angular.forEach(mitem.SubCategoryDetails, function (nitem) {
                                    if (nitem.IsSubChildCategoryChecked) {
                                        nitem.Active = 'Y';
                                        temparray.push(nitem);
                                    }
                                });
                            }
                        }
                        if (temparray.length > 0) {
                            var object = {
                                "SubCategoryId": mitem.SubCategoryId,
                                "SubCategoryName": mitem.SubCategoryName,
                                "Active": "Y",
                                "SubCategoryDetails": temparray
                            };
                            $scope.TempContactRxarray.push(object);
                        }
                    }
                });
            });
        }
        if ($scope.TempCompliantsArray.length != 0) {
            var object = {
                "RowID": count++,
                "CategoryId": 1,
                "CategoryName": "ChiefComplaints",
                "CategoryDetails": $scope.TempCompliantsArray
            };
            $scope.cacheStorageItem.FinalSubmitArray.push(object);
        }
        if ($scope.TempROSarray.length != 0) {
            var object = {
                "RowID": count++,
                "CategoryId": 2,
                "CategoryName": "ROS",
                "CategoryDetails": $scope.TempROSarray
            };
            $scope.cacheStorageItem.FinalSubmitArray.push(object);
        }
        if ($scope.TempVandParray.length != 0) {
            var object = {
                "RowID": count++,
                "CategoryId": 3,
                "CategoryName": "V&P",
                "CategoryDetails": $scope.TempVandParray
            };
            $scope.cacheStorageItem.FinalSubmitArray.push(object);
        }
        if ($scope.TempExaminationArray.length != 0) {
            var object = {
                "RowID": count++,
                "CategoryId": 4,
                "CategoryName": "Examination",
                "CategoryDetails": $scope.TempExaminationArray
            };
            $scope.cacheStorageItem.FinalSubmitArray.push(object);
        }
        if ($scope.TempAssessmentarray.length != 0) {
            var object = {
                "RowID": count++,
                "CategoryId": 5,
                "CategoryName": "Assessment",
                "CategoryDetails": $scope.TempAssessmentarray
            };

            $scope.cacheStorageItem.FinalSubmitArray.push(object);
        }
        if ($scope.TempOrderarray.length != 0) {
            var object = {
                "RowID": count++,
                "CategoryId": 6,
                "CategoryName": "Orders",
                "CategoryDetails": $scope.TempOrderarray
            };

            $scope.cacheStorageItem.FinalSubmitArray.push(object);
        }
        if ($scope.TempMedicalRxarray.length != 0) {
            var object = {
                "RowID": count++,
                "CategoryId": 7,
                "CategoryName": "Medical Rx",
                "CategoryDetails": $scope.TempMedicalRxarray
            };

            $scope.cacheStorageItem.FinalSubmitArray.push(object);
        }
        if ($scope.TempGlassRxarray.length != 0) {
            var object = {
                "RowID": count++,
                "CategoryId": 8,
                "CategoryName": "Glass Rx",
                "CategoryDetails": $scope.TempGlassRxarray
            };

            $scope.cacheStorageItem.FinalSubmitArray.push(object);
        }
        if ($scope.TempContactRxarray.length != 0) {
            var object = {
                "RowID": count++,
                "CategoryId": 9,
                "CategoryName": "CL",
                "CategoryDetails": $scope.TempContactRxarray
            };

            $scope.cacheStorageItem.FinalSubmitArray.push(object);
        }
    }
    $scope.newtemplateselectall = function (category) {
        angular.forEach($scope.cacheStorageItem.DefaultTemplateArray, function (item, index) {
            if (category.IsCategoryChecked) {
                if (category.CategoryId === item.CategoryId) {
                    angular.forEach(category.CategoryDetails, function (mitem) {
                        mitem.IsSubCategoryChecked = category.IsCategoryChecked;
                        mitem.Active = 'Y';
                    });
                    if (item.CategoryId == 9) {
                        angular.forEach(category.CategoryDetails, function (mitem) {
                            mitem.IsSelectAllSubCategoryChecked = category.IsCategoryChecked;
                            //if (mitem.SubCategoryDetails.length !==0) {
                            //    mitem.SubCategoryDetails[0].IsSubChildCategoryChecked = true;
                            //}
                            if (mitem.SubCategoryDetails.length > 0) {
                                angular.forEach(mitem.SubCategoryDetails, function (clitem) {
                                    clitem.IsSubChildCategoryChecked = true;
                                    clitem.Active = 'Y';
                                });
                            }
                        });
                    }
                }
            } else {
                if (category.CategoryId === item.CategoryId) {
                    angular.forEach(category.CategoryDetails, function (mitem) {
                        mitem.IsSubCategoryChecked = category.IsCategoryChecked;
                        mitem.Active = 'N';
                    });

                    if (item.CategoryId == 9) {
                        angular.forEach(category.CategoryDetails, function (mitem) {
                            mitem.IsSelectAllSubCategoryChecked = category.IsCategoryChecked;
                            if (mitem.SubCategoryDetails.length > 0) {
                                angular.forEach(mitem.SubCategoryDetails, function (clitem) {
                                    clitem.IsSubChildCategoryChecked = false;
                                    clitem.Active = 'N';
                                });
                            }
                        });
                    }
                }
            }
        });
        $scope.AddToCache();
    }

    $scope.NewCheckAllSubCategory = function (subcategory) {
        if (subcategory.IsSelectAllSubCategoryChecked) {
            subcategory.IsCategoryChecked = subcategory.IsSelectAllSubCategoryChecked;
            subcategory.Active = 'Y';
        } else {
            subcategory.IsCategoryChecked = subcategory.IsSelectAllSubCategoryChecked;
            subcategory.Active = 'N';
        }

        if (subcategory.CategoryDetails.length > 0) {
            angular.forEach(subcategory.CategoryDetails, function (titem) {
                //if (titem.SubCategoryId === 21) {
                //    titem.IsSubCategoryChecked = subcategory.IsSelectAllSubCategoryChecked;
                //    angular.forEach(titem.SubCategoryDetails, function (sitem) {
                //        sitem.IsSubChildCategoryChecked = subcategory.IsSelectAllSubCategoryChecked
                //        sitem.Active = subcategory.Active;
                //    });
                //} else {
                //    titem.IsSubCategoryChecked = subcategory.IsSelectAllSubCategoryChecked;
                //    angular.forEach(titem.SubCategoryDetails, function (sitem) {
                //        sitem.IsSubChildCategoryChecked = subcategory.IsSelectAllSubCategoryChecked
                //        sitem.Active = subcategory.Active;
                //    });
                //}

                titem.IsSubCategoryChecked = subcategory.IsSelectAllSubCategoryChecked;
                titem.IsSelectAllSubCategoryChecked = subcategory.IsSelectAllSubCategoryChecked;
                angular.forEach(titem.SubCategoryDetails, function (sitem) {
                    sitem.IsSubChildCategoryChecked = subcategory.IsSelectAllSubCategoryChecked
                    sitem.Active = subcategory.Active;
                });

            });
        }

    }
    $scope.NewSubchange = function (subcategory, subchildcategory) {
        if (subcategory.CategoryId == 2 || subcategory.CategoryId == 3) {
            var List = $filter("filter")(subcategory.CategoryDetails, { "IsSubCategoryChecked": true }, true) || [];
            if (subcategory.CategoryDetails.length === List.length) {
                subcategory.IsCategoryChecked = true;
            }
            else {
                subcategory.IsCategoryChecked = false;
            }
            if (subchildcategory.SubCategoryId == 60) {
                var pachy = $filter("filter")(subcategory.CategoryDetails, { "SubCategoryId": 62 }, true) || [];
                if (pachy.length > 0) {
                    pachy[0].IsSubCategoryChecked = subchildcategory.IsSubCategoryChecked || false;
                }
    
            }
        }
        else if (subcategory.CategoryId == 4) {

            if (subchildcategory.SubCategoryId == 21 && subchildcategory.IsSubCategoryChecked) {
                subchildcategory.Active = 'Y';

                if (subchildcategory.SubCategoryDetails.length > 0) {
                    angular.forEach(subchildcategory.SubCategoryDetails, function (ritem) {
                        ritem.IsSubChildCategoryChecked = true;
                        ritem.Active = 'Y';
                    });
                }

            } else if (subchildcategory.SubCategoryId == 21 && !subchildcategory.IsSubCategoryChecked) {
                subchildcategory.Active = 'N';
                if (subchildcategory.SubCategoryDetails.length > 0) {
                    angular.forEach(subchildcategory.SubCategoryDetails, function (ritem) {
                        ritem.IsSubChildCategoryChecked = false;
                        ritem.Active = 'N';
                    });
                }
            }

            if (subchildcategory.SubCategoryId == 22 && subchildcategory.IsSubCategoryChecked) {
                angular.forEach(subcategory.CategoryDetails, function (aditem) {
                    if (aditem.SubCategoryId == 78 || aditem.SubCategoryId == 38 || aditem.SubCategoryId == 23 || aditem.SubCategoryId == 77 || aditem.SubCategoryId == 41) {
                        aditem.IsSubCategoryChecked = true;
                        aditem.Active = 'Y';
                        if (aditem.SubCategoryDetails.length > 0) {
                            angular.forEach(aditem.SubCategoryDetails, function (ritem) {
                                ritem.IsSubChildCategoryChecked = true;
                                ritem.Active = 'Y';
                            });
                        }
                    }

                });
            } else if (subchildcategory.SubCategoryId == 22 && !subchildcategory.IsSubCategoryChecked) {
                angular.forEach(subcategory.CategoryDetails, function (aditem) {
                    if (aditem.SubCategoryId == 78 || aditem.SubCategoryId == 38 || aditem.SubCategoryId == 23 || aditem.SubCategoryId == 77 || aditem.SubCategoryId == 41) {
                        aditem.IsSubCategoryChecked = false;
                        aditem.Active = 'N';
                        if (aditem.SubCategoryDetails.length > 0) {
                            angular.forEach(aditem.SubCategoryDetails, function (ritem) {
                                ritem.IsSubChildCategoryChecked = false;
                                ritem.Active = 'N';
                            });
                        }
                    }

                });
            } else if ((subchildcategory.SubCategoryId == 24 && !subchildcategory.IsSubCategoryChecked)) {
                angular.forEach(subcategory.CategoryDetails, function (aspitem) {
                    if (aspitem.SubCategoryId == 25) {
                        aspitem.IsSubCategoryChecked = false;
                        angular.forEach(aspitem.SubCategoryDetails, function (subitem) {
                            subitem.IsSubChildCategoryChecked = false;
                        });
                    }

                });
            }
            angular.forEach(subcategory.CategoryDetails, function (sitem) {        
                if (sitem.SubCategoryId == 21 || sitem.SubCategoryId == 23 || sitem.SubCategoryId == 35 || sitem.SubCategoryId == 38 || sitem.SubCategoryId == 41) {
                    var List = $filter("filter")(sitem.SubCategoryDetails, { "IsSubChildCategoryChecked": true }, true) || [];
                    //if (sitem.SubCategoryDetails.length === List.length) {
                    //    sitem.IsSubCategoryChecked = true;
                    //}
                    //else {
                    //    sitem.IsSubCategoryChecked = false;
                    //}
                    if (sitem.SubCategoryDetails.length === List.length) {
                        sitem.IsSelectAllSubCategoryChecked = true;
                    }
                    else {
                        sitem.IsSelectAllSubCategoryChecked = false;
                    }

                    if (List.length > 0) {
                        sitem.IsSubCategoryChecked = true;
                    }
                }
                if ((sitem.SubCategoryId == 24 && sitem.IsSubCategoryChecked) || sitem.SubCategoryId == 25 && sitem.IsSubCategoryChecked) {
                    angular.forEach(sitem.SubCategoryDetails, function (subitem) {
                        subitem.IsSubChildCategoryChecked = true;
                    });
                    angular.forEach(subcategory.CategoryDetails, function (aspitem) {
                        if (aspitem.SubCategoryId == 25) {
                            aspitem.IsSubCategoryChecked = true;
                            //angular.forEach(aspitem.SubCategoryDetails, function (subitem) {
                            //    subitem.IsSubChildCategoryChecked = true;
                            //});
                        }

                    });
                }
            });
            
            var List1 = $filter("filter")(subcategory.CategoryDetails, { "IsSubCategoryChecked": true }, true) || [];
            if (subcategory.CategoryDetails.length === List1.length) {
                subcategory.IsCategoryChecked = true;
                subcategory.IsSelectAllSubCategoryChecked = true;
            }
            else {
                subcategory.IsCategoryChecked = false;
                subcategory.IsSelectAllSubCategoryChecked = false;
            }
        }
    }
    $scope.ClearDefaultTemplate = function () {
        if ($scope.cacheStorageItem.DefaultTemplateArray.length > 0) {
            angular.forEach($scope.cacheStorageItem.DefaultTemplateArray, function (item) {
                item.IsCategoryChecked = false;
                angular.forEach(item.CategoryDetails, function (mitem) {
                    mitem.IsSubCategoryChecked = false;
                    mitem.Active = 'N';
                    if (item.CategoryId === 4 || item.CategoryId === 9) {
                        if (mitem.SubCategoryDetails.length > 0) {
                            angular.forEach(mitem.SubCategoryDetails, function (kitem) {
                                kitem.IsSubChildCategoryChecked = false;
                            });
                        }
                        item.IsSelectAllSubCategoryChecked = false;
                    }

                    if (item.CategoryId === 1 || item.CategoryId === 5 || item.CategoryId === 6 || item.CategoryId === 7) { // always true
                        item.IsCategoryChecked = true;
                        mitem.IsSubCategoryChecked = true;
                        mitem.Active = 'Y';
                    }
                });
            });
        }
    }




    $scope.CheckSubCategory = function (cat, subcategory) {
        $scope.IsDisableTemplate = true;
        var SubCategoryCheckedCount = 0;
        var Index = 0;
        if (cat.CategoryId === 1) {
            Index = cat.CategoryDetails.findIndex(record => record.SubCategoryId === subcategory.SubCategoryId);
            if (Index > -1) {
                cat.CategoryDetails[Index].IsSubCategoryChecked = subcategory.IsSubCategoryChecked;
                cat.CategoryDetails[Index].Active = 'Y';
                if (!subcategory.IsSubCategoryChecked) {
                  //  $scope.UnloadData(cat.CategoryId, subcategory.SubCategoryId, Index);
                }
            }
            SubCategoryCheckedCount = $filter("filter")($scope.cacheStorageItem.DefaultTemplateArray, { "IsSubCategoryChecked": true }, true).length;
        }
        if (cat.CategoryId === 2) {
            Index = cat.CategoryDetails.findIndex(record => record.SubCategoryId === subcategory.SubCategoryId);
            if (Index > -1) {
                cat.CategoryDetails[Index].IsSubCategoryChecked = subcategory.IsSubCategoryChecked;
                cat.CategoryDetails[Index].Active = 'Y';

                if (!subcategory.IsSubCategoryChecked) {
                  //  $scope.UnloadData(cat.CategoryId, subcategory.SubCategoryId, Index);
                }
            }
            SubCategoryCheckedCount = $filter("filter")($scope.cacheStorageItem.DefaultTemplateArray, { "IsSubCategoryChecked": true }, true).length;
        }
        if (cat.CategoryId === 3) {
            Index = cat.CategoryDetails.findIndex(record => record.SubCategoryId === subcategory.SubCategoryId);
            if (Index > -1) {
                cat.CategoryDetails[Index].IsSubCategoryChecked = subcategory.IsSubCategoryChecked;
                cat.CategoryDetails[Index].Active = 'Y';
                if (!subcategory.IsSubCategoryChecked) {
                  //  $scope.UnloadData(cat.CategoryId, subcategory.SubCategoryId, Index);
                }
                else {
                    if (subcategory.SubCategoryId === 12) {
                        angular.forEach($scope.cacheStorageItem.VisionDetails, function (kitem) {
                            if (kitem.InvestigationId === 1) {
                                kitem.ActiveInd = 'Y';
                            }
                        });
                    }
                    if (subcategory.SubCategoryId === 19) {
                        angular.forEach($scope.cacheStorageItem.VisionDetails, function (kitem) {
                            if (kitem.InvestigationId === 2) {
                                kitem.ActiveInd = 'Y';
                            }
                        });
                    }
                    if (subcategory.SubCategoryId === 20) {
                        angular.forEach($scope.cacheStorageItem.VisionDetails, function (kitem) {
                            if (kitem.InvestigationId === 3) {
                                kitem.ActiveInd = 'Y';
                            }
                        });
                    }
                    if (subcategory.SubCategoryId === 11) {
                        angular.forEach($scope.cacheStorageItem.VisionDetails, function (kitem) {
                            if (kitem.InvestigationId === 4 || kitem.InvestigationId === 5 || kitem.InvestigationId === 2071 || kitem.InvestigationId === 13 || kitem.InvestigationId === 2076 || kitem.InvestigationId === 2072 || kitem.InvestigationId === 2077) {
                                kitem.ActiveInd = 'Y';
                            }
                        });
                    }
                    if (subcategory.SubCategoryId === 15) {
                        angular.forEach($scope.cacheStorageItem.VisionDetails, function (kitem) {
                            if (kitem.InvestigationId === 8) {
                                kitem.ActiveInd = 'Y';
                            }
                        });
                    }
                    if (subcategory.SubCategoryId === 16) {
                        angular.forEach($scope.cacheStorageItem.VisionDetails, function (kitem) {
                            if (kitem.InvestigationId === 11) {
                                kitem.ActiveInd = 'Y';
                            }
                        });
                    }
                    if (subcategory.SubCategoryId === 40) {
                        angular.forEach($scope.cacheStorageItem.VisionDetails, function (kitem) {
                            if (kitem.InvestigationId === 2088) {
                                kitem.ActiveInd = 'Y';
                            }
                        });
                    }
                    if (subcategory.SubCategoryId === 36) {
                        angular.forEach($scope.cacheStorageItem.VisionDetails, function (kitem) {
                            if (kitem.InvestigationId === 2074) {
                                kitem.ActiveInd = 'Y';
                            }
                        });
                    }
                    if (subcategory.SubCategoryId === 45) { //ARDilated
                        angular.forEach($scope.cacheStorageItem.VisionDetails, function (kitem) {
                            if (kitem.InvestigationId === 2102) {
                                kitem.ActiveInd = 'Y';
                            }
                        });
                    }
                }

            }

            SubCategoryCheckedCount = $filter("filter")($scope.cacheStorageItem.DefaultTemplateArray, { "IsSubCategoryChecked": true }, true).length;
        }
        if (cat.CategoryId === 4) {
            Index = cat.CategoryDetails.findIndex(record => record.SubCategoryId === subcategory.SubCategoryId);
            if (Index > -1) {
                cat.CategoryDetails[Index].IsSubCategoryChecked = subcategory.IsSubCategoryChecked;
                cat.CategoryDetails[Index].IsSubCategoryChecked = subcategory.IsSelectAllSubCategoryChecked;
                cat.CategoryDetails[Index].Active = 'Y';
                if (subcategory.IsSubCategoryChecked) {
                    if (subcategory.SubCategoryId === 22 || subcategory.SubCategoryId === 23 || subcategory.SubCategoryId === 24 || subcategory.SubCategoryId === 25 || subcategory.SubCategoryId === 26 || subcategory.SubCategoryId === 35 || subcategory.SubCategoryId === 38 || subcategory.SubCategoryId === 41 || subcategory.SubCategoryId === 43 || subcategory.SubCategoryId === 21) {
                        if (subcategory.SubCategoryDetails.length > 0) {
                            angular.forEach(subcategory.SubCategoryDetails, function (ritem) {
                                ritem.IsSubChildCategoryChecked = true;
                                ritem.Active = 'Y';
                            });
                        }
                    }
                    if (subcategory.SubCategoryId === 38) {

                        angular.forEach(subcategory.SubCategoryDetails, function (ritem) {
                            if (ritem.SubCategoryChildId === 58 || ritem.SubCategoryChildId === 59 || ritem.SubCategoryChildId === 60 || ritem.SubCategoryChildId === 79) {
                                $scope.ShowTearMeniscusHeight = true;
                            }
                        });
                    }
                }
                else {
                    if (subcategory.SubCategoryId === 22 || subcategory.SubCategoryId === 23 || subcategory.SubCategoryId === 24 || subcategory.SubCategoryId === 25 || subcategory.SubCategoryId === 26 || subcategory.SubCategoryId === 35 || subcategory.SubCategoryId === 38 || subcategory.SubCategoryId === 41 || subcategory.SubCategoryId === 43 || subcategory.SubCategoryId === 21) {
                        if (subcategory.SubCategoryDetails.length > 0) {
                            angular.forEach(subcategory.SubCategoryDetails, function (ritem) {
                                ritem.IsSubChildCategoryChecked = false;
                                ritem.Active = 'N';
                            });
                        }
                    }
                }

                if (!subcategory.IsSubCategoryChecked) {
                 //   $scope.UnloadData(cat.CategoryId, subcategory.SubCategoryId, Index);
                }

                var List1 = $filter("filter")(cat.CategoryDetails, { "IsSubCategoryChecked": true }, true) || [];
                if (cat.CategoryDetails.length === List1.length) {
                    cat.IsCategoryChecked = true;
                    cat.IsSelectAllSubCategoryChecked = true;
                }
                else {
                    cat.IsCategoryChecked = false;
                    cat.IsSelectAllSubCategoryChecked = false;
                }
            }
            SubCategoryCheckedCount = $filter("filter")($scope.cacheStorageItem.DefaultTemplateArray, { "IsSubCategoryChecked": true }, true).length;
        }
        if (cat.CategoryId === 5) {
            Index = cat.CategoryDetails.findIndex(record => record.SubCategoryId === subcategory.SubCategoryId);
            if (Index > -1) {
                cat.CategoryDetails[Index].IsSubCategoryChecked = subcategory.IsSubCategoryChecked;
                cat.CategoryDetails[Index].Active = 'Y';
                if (!subcategory.IsSubCategoryChecked) {
                  //  $scope.UnloadData(cat.CategoryId, subcategory.SubCategoryId, Index);
                }
            }
            SubCategoryCheckedCount = $filter("filter")($scope.cacheStorageItem.DefaultTemplateArray, { "IsSubCategoryChecked": true }, true).length;
        }

        if (cat.CategoryId === 9) {
            if (subcategory.IsSubCategoryChecked) {
                subcategory.IsSelectAllSubCategoryChecked = subcategory.IsSubCategoryChecked;
                cat.IsCategoryChecked = subcategory.IsSubCategoryChecked;
                if (subcategory.SubCategoryDetails.length > 0) {
                    angular.forEach(subcategory.SubCategoryDetails, function (clitem) {
                        clitem.IsSubChildCategoryChecked = true;
                        clitem.Active = 'Y';
                    });
                }
            } else {
                subcategory.IsSelectAllSubCategoryChecked = subcategory.IsSubCategoryChecked;
                cat.IsCategoryChecked = subcategory.IsSubCategoryChecked;
                if (subcategory.SubCategoryDetails.length > 0) {
                    angular.forEach(subcategory.SubCategoryDetails, function (clitem) {
                        clitem.IsSubChildCategoryChecked = false;
                        clitem.Active = 'N';
                    });
                }
            }
        }
        $scope.AddToCache();
    };

    $scope.SelectConsultationTemplate = function (template) {
        $rootScope.tmpl.TemplateName = template.TemplateName;
        console.log("template name: ", $scope.tmpl.TemplateName);
        angular.forEach($scope.RestructuredDocInvTemplates, function (item) {
            item.SetAsTemplate = false;
        });
        template.SetAsTemplate = true;

        $scope.closetemplatespopupclick();
    };
    $scope.changesConsultationTemplate = function (templateDetails) {

        $scope.obj.IssetasDefaultTemplete = templateDetails[0].IssetasDefaultTemplete;
        $scope.obj.TemplateName = templateDetails[0].TemplateName;
        $scope.selectedTemplate = templateDetails[0];
        $scope.TemplateArray = templateDetails[0].TemplateDetails;
        $scope.TemplateId = templateDetails[0].UserTemplateId;
        NewtemplateDataLoad($scope.TemplateArray);
    }

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
            "PatientInstructions": "",
            "SurgeryStatusId": "",
            "SurgeryStatus": "",
            "SurgerySuggestedDate": "",
            "IolPower": "",
            "ActiveInd": "Y",
            "SurgeryOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
        };

        $scope.object.SurgeryStatusId = 1;

        var surgeonobj = $filter("filter")($scope.cacheStorageItem.AllDoctorsList, { "DoctorID": appointmentinfo.DoctorID }, true)[0];
        if (surgeonobj !== undefined) {
            $scope.object.SurgeryDoctorName = surgeonobj.FullName;
            $scope.object.SurgeryDoctorId = surgeonobj.DoctorID;
        }

        $scope.object.SurgerySuggestedDate = $filter("date")(new Date(), "dd-MMM-yyyy");
        return $scope.object;
    }
    $scope.GetDiagnosisList = function (val) {
        var object = {
            "LevelType": 'O',
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "UserId": doctorinfo.doctorid,
            "SpecializationId": $scope.SpecializationId,
            "SearchText": val,
            "PageSize": 10,
            "PageNumber": 1,
            "Type": '',
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID || null
        };
        //if (val === "") {
        //    object.Type = 'C';
        //}
        return eHnoteSettingsDataService.GetMasterDiagnosis(object).then(function (response) {
            if (response.data.count !== 0) {
                if (response.data.DiagnosisList !== undefined) {
                    // $scope.obj.AddDiagnosis = false;
                    //if (val === "") {
                    //    var obj = {
                    //        "DiagnosisId": "",
                    //        "DiagnosisName": "Frequently Added"
                    //    };
                    //    response.data.DiagnosisList.unshift(obj);
                    //}


                    return response.data.DiagnosisList.map(function (item) {
                        return item;
                    });
                } else {
                    // $scope.obj.AddDiagnosis = true;
                }
            } else {
                // $scope.obj.AddDiagnosis = false;
                if (val != '') {
                    // $scope.obj.AddDiagnosis = true;
                }
                if (response.data.count === 0) {
                    if (val === "") {
                        var obj = {
                            "DiagnosisId": "",
                            "DiagnosisName": "Frequently Added"
                        };
                        response.data.DiagnosisList.unshift(obj);
                        return response.data.DiagnosisList.map(function (item) {
                            return item;
                        });
                    }
                }
            }
        });

    };
    $scope.getOrgMedicines = function (text) {
        text = text || "";
        var object = {
            "LevelType": "O",
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "UserId": doctorinfo.doctorid,
            "SpecializationId": $scope.SpecializationId,
            "SearchText": text,
            "PageSize": 10,
            "PageNumber": 1,
            "Type": '',
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID || null,
        };
        if (text === "") {
            object.Type = 'C';
        }
        return eHnoteSettingsDataService.GetMasterMedicines(object).then(function (response) {
            if (response.data.count !== 0) {
                if (response.data.MedicineList !== undefined) {
                    // $scope.obj.AddPrescriptionshow = false;
                    if (text === "") {
                        var obj = {
                            "MedicineId": "",
                            "MedicineNameWithStock": "Frequently Added"
                        };
                        response.data.MedicineList.unshift(obj);
                    }
                    return response.data.MedicineList.map(function (item) {
                        return item;
                    });
                } else {
                    //  $scope.obj.AddPrescriptionshow = true;
                }
            } else {
                //$scope.showhideprecesDiv = false;
                if (text != '') {
                    // $scope.obj.AddPrescriptionshow = true;
                }
                if (response.data.count === 0) {
                    if (text === "") {
                        var obj = {
                            "MedicineId": "",
                            "MedicineNameWithStock": "Frequently Added"
                        };
                        response.data.MedicineList.unshift(obj);
                    }
                    return response.data.MedicineList.map(function (item) {
                        return item;
                    });
                }
            }
        });
    };
    $scope.GetMedicines = function (text) {
        text = text || "";
        $scope.showhideprecesDiv = false;
        var object = {
            "LevelType": "G",
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalId,
            "UserId": doctorinfo.doctorid,
            "SpecializationId": $scope.SpecializationId,
            "SearchText": text,
            "PageSize": 10,
            "PageNumber": 1,
            "Type": '',
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID || null,
        };
        if (text === "") {
            object.Type = 'C';
        }
        return eHnoteSettingsDataService.GetMasterMedicines(object).then(function (response) {
            if (response.data.count !== 0) {
                if (response.data.MedicineList !== undefined) {
                    // $scope.showhideprecesDiv = false;
                    if (text === "") {
                        var obj = {
                            "MedicineId": "",
                            "MedicineNameWithStock": "Frequently Added"
                        };
                        response.data.MedicineList.unshift(obj);
                    }
                    return response.data.MedicineList.map(function (item) {
                        return item;
                    });
                } else {
                    //  $scope.showhideprecesDiv = true;
                }
            } else {
                // $scope.showhideprecesDiv = false;
                if (text != '') {
                    //$scope.showhideprecesDiv = true;
                }
                if (response.data.count === 0) {
                    if (text === "") {
                        var obj = {
                            "MedicineId": "",
                            "MedicineNameWithStock": "Frequently Added"
                        };
                        response.data.MedicineList.unshift(obj);
                    }
                    return response.data.MedicineList.map(function (item) {
                        return item;
                    });
                }
            }
        });
    };
    $scope.changeMedicineSearch = function (medicinesearch) {
        $scope.medicinesearch.MedicineSearchType = medicinesearch;
    }
    $scope.changeGlobalMedicine = function (Globalcheck) {
        $scope.IsGlobalinDiagosis = Globalcheck;
        $scope.medicinesearch.MedicineSearchType = "General";
    }
    /*$scope.Ordersobj.searchBy = 2;*/

    if ($scope.Template.TemplateTypeBySelected === "Consultation") {
        $scope.backTemplatelist();
    }
    else if ($scope.Template.TemplateTypeBySelected === "Default Consultation") {
        $scope.ConsultationTemplatepop = false;
        $scope.DiagnosisTemplatepop = false;
        $scope.Templatesearch.ConsulTemplate = "";
        $scope.obj.IssetasDefaultTemplete = true;
        $scope.TemplateId = 0;
    }
    else {
        $scope.backTemplatelist1();
    }

    $scope.CheckContactLensCategory = function () {
        var newcontactlens = 0;
        if ($scope.cacheStorageItem.ContactLensDetails.length > 0) {
            newcontactlens++;
        }

        if ($scope.cacheStorageItem.DefaultTemplateArray.length > 0) {
            angular.forEach($scope.cacheStorageItem.DefaultTemplateArray, function (citem) {
                if (citem.CategoryId === 9) {
                    angular.forEach(citem.CategoryDetails, function (subitem) {
                        if (subitem.SubCategoryId === 68) {
                            if (newcontactlens > 0) {
                                subitem.IsSubCategoryChecked = true;
                            }
                        }
                    });
                }
            });
        }

    };

    $scope.resetAllConsultationArea2 = function (type) {
        $scope.cacheStorageItem.Diagnosis = [];
        /*$scope.cacheStorageItem.AssessmentPlan = [];*/
        $scope.cacheStorageItem.OrderDetails = [];
        $scope.cacheStorageItem.InvestigationsDetails = [];
        $scope.cacheStorageItem.ProceduresDetails = [];
        $scope.cacheStorageItem.SurgeriesDetails = [];
        $scope.cacheStorageItem.ReferralDetails = [];
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
        $scope.cacheStorageItem.AppointmentPatientUploads = [];
        $scope.cacheStorageItem.BirthHistory = [];
        $scope.cacheStorageItem.SystemicHistory = [];
        $scope.cacheStorageItem.VaccinationHistory = [];
        $scope.cacheStorageItem.FunctionalStatusHistory = [];
        $scope.cacheStorageItem.OcularSurgicalHistory = [];
        $scope.cacheStorageItem.CurrentSystemicMedicationsHistory = [];
        $scope.cacheStorageItem.FamilyHistory = [];
        $scope.cacheStorageItem.NutritionalHistory = [];
        $scope.cacheStorageItem.ImmunisationHistory = [];
        $scope.cacheStorageItem.SurgicalHistory = [];
        $scope.cacheStorageItem.PatientInstructions = [];
        $scope.cacheStorageItem.MenstrualHistory = [];
        $scope.cacheStorageItem.IsAnteriorCheckedAll = false;
        $scope.cacheStorageItem.IsAnteriorRightEyeCheckAll = false;
        $scope.cacheStorageItem.IsAnteriorLeftEyeCheckAll = false;
        $scope.cacheStorageItem.IsPosteriorCheckedAll = false;
        $scope.cacheStorageItem.IsPosteriorRightEyeCheckedAll = false;
        $scope.cacheStorageItem.IsPosteriorLeftEyeCheckedAll = false;
        $scope.cacheStorageItem.GonioscopyArray = [];
        $scope.cacheStorageItem.masterQuestions = [];
        $scope.cacheStorageItem.ContactLensDetails = [];
        $scope.cacheStorageItem.OPProceduresArray = [];
        $scope.cacheStorageItem.ContactLens = [];
        $scope.cacheStorageItem.ContactlensArray = [];
        $scope.cacheStorageItem.LacrimalPatiency = [];
        $scope.cacheStorageItem.PostDilatedExaminationArray = [];
        $scope.cacheStorageItem.VisionDetails = [];
        $scope.cacheStorageItem.DilationArray = [];

        $scope.cacheStorageItem.FileUploadImageArray = [];
        $scope.cacheStorageItem.appointmentStatus = "";
        $scope.cacheStorageItem.SelectedConsultationType = "";
        $scope.cacheStorageItem.sendPatientEmail = false;

        $scope.cacheStorageItem.ReferalId = 0;
        $scope.cacheStorageItem.ReferalDoctorType = "";
        $scope.cacheStorageItem.ReferalDoctorId = "";
        $scope.cacheStorageItem.RefeRalDoctorNotes = '';
        $scope.cacheStorageItem.ReferalOrgId = "";
        $scope.cacheStorageItem.ReferalDoctorName = "";

        $scope.cacheStorageItem.isSendCaseHistoryMail = "";
        $scope.cacheStorageItem.isSendRefLetterMail = "";
        $scope.cacheStorageItem.isSendRefSms = "";
        $scope.cacheStorageItem.OptomComments = "";
        $scope.cacheStorageItem.DoctorNotesArray = [];
        $scope.cacheStorageItem.ClinicalNotesArray = [];
        $scope.cacheStorageItem.PatientNotesArray = [];
        $scope.cacheStorageItem.OptomNotesArray = [];
        $scope.cacheStorageItem.DoctorComments = "";
        if ($scope.cacheStorageItem.Vitals.length > 0) {
            $scope.ResetAllVitals2();
        }
        $scope.cacheStorageItem.GlassPrescriptionArray = [];
        $scope.cacheStorageItem.ArRefractionArray = [];
        $scope.cacheStorageItem.FollowUpDuration = "";
        $scope.cacheStorageItem.FollowUpDurationType = "";
        $scope.cacheStorageItem.FollowUpNotes = "";
        $scope.cacheStorageItem.PatientSuggestInvestigation = [];
        $scope.cacheStorageItem.PatientInvestigations = [];
        $scope.cacheStorageItem.LabtestList = [];
        $scope.cacheStorageItem.GoniscopyList = [];
        $scope.cacheStorageItem.IsVIPInd = false;
        $scope.cacheStorageItem.IsResearchInd = false;
        $scope.cacheStorageItem.IsHighRiskInd = false;
        $scope.cacheStorageItem.IsSendForDilationInd = false;
        $scope.cacheStorageItem.IsSendForInvestigationInd = false;
        $scope.cacheStorageItem.IsSendForLabTestInd = false;
        $scope.cacheStorageItem.IsSendForRecheckInd = false;
        $scope.cacheStorageItem.IsVIPRemarks = "";
        $scope.cacheStorageItem.IsResearchRemarks = "";
        $scope.cacheStorageItem.IsHighRiskRemarks = "";
        $scope.cacheStorageItem.IsSendForDilationRemarks = "";
        $scope.cacheStorageItem.IsSendForInvestigationRemarks = "";
        $scope.cacheStorageItem.IsSendForLabTestRemarks = "";
        $scope.cacheStorageItem.ClinicalNotesComments = "";
        $scope.cacheStorageItem.IsSendForRecheckRemarks = "";
        $scope.cacheStorageItem.PatientInstructionComments = "";
        $scope.cacheStorageItem.FollowUpArray = [];
        $scope.cacheStorageItem.AnteriorRemarks = "";
        $scope.cacheStorageItem.PosteriorRemarks = "";
        $scope.cacheStorageItem.LacrimalPatencyRemarks = "";
        $scope.cacheStorageItem.AnteriorIsNormal = false;
        $scope.cacheStorageItem.PosteriorIsNormal = false;
        $scope.cacheStorageItem.AdviceOrderArray = [];
        $scope.cacheStorageItem.KeratometryDetails = [];
        $scope.cacheStorageItem.GlareDetails = [];
        $scope.cacheStorageItem.AutoRefractionDetails = [];
        $scope.cacheStorageItem.RetinoscopyRefractionDetails = [];
        $scope.cacheStorageItem.PGPRefractionDetails = [];
        $scope.cacheStorageItem.ManifestRefractionDetails = [];
        $scope.cacheStorageItem.OverRefractionDetails = [];
        $scope.cacheStorageItem.GlassRxRefractionDetails = [];
        $scope.cacheStorageItem.CycloplegicRefractionDetails = [];
        $scope.cacheStorageItem.PupilSizeRemarks = "";
        $scope.cacheStorageItem.IOPodCCValue = null;
        $scope.cacheStorageItem.IOPosCCValue = null;
        $scope.cacheStorageItem.IOPAvgODValue = "";
        $scope.cacheStorageItem.IOPAvgOSValue = "";
        $scope.cacheStorageItem.PachymetryAvgODValue = "";
        $scope.cacheStorageItem.PachymetryAvgOSValue = "";
        $scope.cacheStorageItem.SquintPossibleDiagnosis = "";
        $scope.cacheStorageItem.BVPossibleDiagnosis = "";
        $scope.cacheStorageItem.ROSAllergyRemarkDetails = [];
        $scope.cacheStorageItem.OccularHistory = [];
        $scope.cacheStorageItem.LifestyleHistory = [];
        $scope.cacheStorageItem.TonoMetryDetails = [];
        $scope.cacheStorageItem.PachymetryDetails = [];
        $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes = [];
        $scope.cacheStorageItem.PupilSizeDetails = [];

        if ($scope.cacheStorageItem.DefaultTemplateArray.length > 0) {
            angular.forEach($scope.cacheStorageItem.DefaultTemplateArray, function (item) {
                if (item.CategoryId === 4) {
                    angular.forEach(item.CategoryDetails, function (mitem) {
                        $scope.UnloadData(item.CategoryId, mitem.SubCategoryId);
                    });
                }
            });
        }

        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
    };
    $scope.ResetAllVitals2 = function () {
        $scope.cacheStorageItem.Vitals[0].Value = "";
        $scope.cacheStorageItem.Vitals[0].ConversionType = "";
        $scope.cacheStorageItem.Vitals[1].Value = "";
        $scope.cacheStorageItem.Vitals[1].ConversionType = "";
        $scope.cacheStorageItem.Vitals[2].Value = "";
        $scope.cacheStorageItem.Vitals[3].Value = "";
        $scope.cacheStorageItem.Vitals[3].Systolic = "";
        $scope.cacheStorageItem.Vitals[3].Diastolic = "";
        $scope.cacheStorageItem.Vitals[3].ConversionType = "";
        $scope.cacheStorageItem.Vitals[4].Value = "";
        $scope.cacheStorageItem.Vitals[5].Value = "";
        $scope.cacheStorageItem.Vitals[6].Value = "";
        $scope.cacheStorageItem.Vitals[7].Value = "";
        $scope.cacheStorageItem.Vitals[8].Value = "";
        $scope.cacheStorageItem.Vitals[9].Value = "";
        $scope.cacheStorageItem.Vitals[10].Value = "";
        $scope.cacheStorageItem.Vitals[10].ConversionType = "";
        $scope.cacheStorageItem.Vitals[11].Value = "";
        $scope.cacheStorageItem.Vitals[12].Percentile = "";
        $scope.cacheStorageItem.Vitals[13].Value = "";
        $scope.cacheStorageItem.Vitals[14].Value = "";
        $scope.cacheStorageItem.Vitals[16].Percentile = "";
        $scope.cacheStorageItem.Vitals[16].Value = "";
        $scope.cacheStorageItem.Vitals[17].Value = "";
        $scope.cacheStorageItem.Vitals[18].Value = "";
        $scope.cacheStorageItem.Vitals[19].Value = "";
    };

    $scope.changeODSeverity = function (item, Sitem) {
        if (item.SeverityId1 == Sitem.SeverityId) {
            item.SeverityId1 = null;
        } else {
            item.SeverityId1 = Sitem.SeverityId
        }
    }
    $scope.changeOSSeverity = function (item, Sitem) {
        if (item.SeverityId2 == Sitem.SeverityId) {
            item.SeverityId2 = null;
        } else {
            item.SeverityId2 = Sitem.SeverityId
        }
    }
    $scope.GetAssesmentPlanStatus = function () {
        return [
            {
                "ROSAllergiesID": 58,
                "ConditionID": 6,
                "ConditionName": "AssesmentPlan Status",
                "AllergyDescription": "Active"
            },
            {
                "ROSAllergiesID": 59,
                "ConditionID": 6,
                "ConditionName": "AssesmentPlan Status",
                "AllergyDescription": "Inactive"
            },
            {
                "ROSAllergiesID": 60,
                "ConditionID": 6,
                "ConditionName": "AssesmentPlan Status",
                "AllergyDescription": "Resolved"
            },
            {
                "ROSAllergiesID": 61,
                "ConditionID": 6,
                "ConditionName": "AssesmentPlan Status",
                "AllergyDescription": "RuledOut"
            },
            {
                "ROSAllergiesID": 62,
                "ConditionID": 6,
                "ConditionName": "AssesmentPlan Status",
                "AllergyDescription": "Not Examined"
            },
            {
                "ROSAllergiesID": 67,
                "ConditionID": 6,
                "ConditionName": "AssesmentPlan Status",
                "AllergyDescription": "Provisional"
            }

        ];
    };
    $scope.GetAssesmentPlanStatusList = angular.copy($scope.GetAssesmentPlanStatus());


    $scope.changeRDiagnosisStatus = function (item, id) {
        var DiagnosisststusList = $filter("filter")($scope.AssesmentPlanStatusList, function (iterator) { return iterator.AssesmentPlanStatusID === id; });
        item.RDiagnosisStatusId = id
        item.RDiagnosisStatus = DiagnosisststusList[0].AssesmentPlanStatus || '';
    }
    $scope.changeLDiagnosisStatus = function (item, id) {
        var DiagnosisststusList = $filter("filter")($scope.AssesmentPlanStatusList, function (iterator) { return iterator.AssesmentPlanStatusID === id; });
        item.LDiagnosisStatusId = id
        item.LDiagnosisStatus = DiagnosisststusList[0].AssesmentPlanStatus || '';
    }
    $scope.selectedOption = ""; // Initially no option is selected
    $scope.autocompleteValue = ""; // Initialize the autocomplete value

    $scope.showAutocomplete = function (option) {
        $scope.selectedOption = option; // Update the selected option
        $scope.autocompleteValue = ""; // Clear the autocomplete value when the option changes
    };

    $scope.onselectSnomedCode = function (item) {
        item.SnomedCodeId = item.SnomedCodeObject.SnomedCodeId;
        item.SnomedCode = item.SnomedCodeObject.ConceptId.toString();
        item.SnomedDescription = item.SnomedCodeObject.Description;
    };
    $scope.changeSnomedCode = function (item) {
        item.SnomedCodeId = 0;
        item.SnomedCode = "";
        item.SnomedDescription = '';
    }
    $scope.closetemplates=function(){
        $scope.Template.TemplatePOPUpShow = false;
        $scope.drawingPadPopup.IsOpen = false;
    }

    $scope.selectedTemplateCheckbox = false;

    $scope.AutoPlansObject = function (item) {
      /*  item.selectedTemplateCheckbox = true;*/
        $scope.SelectedDiaTemplate(item);
    }

    $scope.getMasterFindingValues = function (val, Catid) {

        var params = {
            "CategoryId": Catid || 5,
            "FindingId": 0,
            "PageSize": 20,
            "PageNumber": 1,
            "SearchText": val || "",

        }
        return eHnoteDbStaticDataService.getMasterFindingValues(params).then(function (resp) {
            if (resp.data.status == "Success") {
                if (resp.data.rows !== undefined) {
                    return resp.data.rows.map(function (item) {
                        return item;
                    });
                }
            }

        }, function (err) {

        });
    }
    $scope.GetOrgFindingValues = function (val, Catid) {
        //$scope.SearchText = val || "";
        $scope.CategoryId = Catid || 5;
        //$scope.FindingId = FindingId || 0;
        var params = {
            "CategoryId": $scope.CategoryId,
            "FindingId":  0,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "PageSize": 20,
            "PageNumber": 1,
            "SearchText": val|| "",

        }
        return eHnotePatientDataService.GetOrgFindingValues(params).then(function (resp) {
            if (resp.data.status == "Success") {



                if (resp.data.rows.length > 0) {
                    $scope.examinationObj.ShowAddNewBtn = false;
                    $scope.PosteriorexaminationObj.ShowAddNewBtn = false;
                    return resp.data.rows.map(function (item) {
                        return item;
                    });
                }
                else {
                    if ($scope.CategoryId == 5) {
                        $scope.examinationObj.ShowAddNewBtn = true;
                    }
                    else if ($scope.CategoryId == 6) {

                        $scope.PosteriorexaminationObj.ShowAddNewBtn = true;
                    }
                }
                    //if (resp.data.rows !== undefined) {
                    //    return resp.data.rows.map(function (item) {
                    //        return item;
                    //    });
                    //}
               
                
            }
        });
    }

    $scope.removeRightAnteriorNew = function (item, inv) {

        angular.forEach(inv.RemarksArray, function (hitem, index) {
            if (hitem.InvFindingId === item.InvFindingId && hitem.OrganId == item.OrganId) {
                //if (hitem.RemarksId === 0) {  //commented by durga for drawing pad findings also should delete
                //    inv.RemarksArray.splice(index, 1);
                //}
                //else {
                //    hitem.ActiveInd = 'N';
                //}
                 hitem.ActiveInd = 'N';
                 
            }
        });
    };
    $scope.removeLeftAnteriorNew = function (item, inv) {
        angular.forEach(inv.RemarksArray, function (hitem, index) {
            if (hitem.InvFindingId === item.InvFindingId && hitem.OrganId == item.OrganId) {
                //if (hitem.RemarksId === 0) { //commented by durga for drawing pad findings also should delete
                //    inv.RemarksArray.splice(index, 1);
                //}
                //else {
                //    hitem.ActiveInd = 'N';
                //}
                 hitem.ActiveInd = 'N';
                 
            }
        });
    };
    $scope.deleteRightPosterior = function (inv) {
        inv.RHorizontal = "";
        inv.RVertical = "";
        inv.RDPS = "";
        //$scope.CDRHorizantalList = GetPosteriorCDR();
        //$scope.CDRVerticalList = GetPosteriorCDR();
        //$scope.CDR_DPSList = GetPosteriorCDR();
    }
    $scope.deleteLeftPosterior = function (inv) {
        inv.LHorizontal = "";
        inv.LVertical = "";
        inv.LDPS = "";
        //$scope.CDRHorizantalList = GetPosteriorCDR();
        //$scope.CDRVerticalList = GetPosteriorCDR();
        //$scope.CDR_DPSList = GetPosteriorCDR();
    }
    $scope.CopyCDRvalues = function (item, organ) {
        if (organ == 1) {
            item.RHorizontal = item.LHorizontal || '';
            item.RVertical = item.LVertical || '';
            item.RDPS = item.LDPS || '';
        }
        if (organ == 2) {
            item.LHorizontal = item.RHorizontal || '';
            item.LVertical = item.RVertical || '';
            item.LDPS = item.RDPS || '';
        }
    };
    $scope.CopyToOS = function (Mitem, item, organ, CategoryId) {
        var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);
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
            }
            Mitem.RemarksArray.push(obj);
        }

    };

    $scope.anteriorPosteriorNotes = {
        templateUrl: 'AnteriorPosteriorNotesScript.html',
    };

    $scope.OpenFindingPopover = function (Item) {
        $scope.ExamFinfingNotes = Item.Notes || "";
        Item.IsShowNotesTextBox = true;
    };

    $scope.SaveExamNotesPopup = function (Item, Note) {
        Item.Notes = Note || "";
        Item.IsShowNotesTextBox = false;
    };

    $scope.ChangeICDcode = function (item) {
        if (item == '1') {
            $scope.AssessObject.SnomedCodeShow = false;
        } else {
            $scope.AssessObject.SnomedCodeShow = true;

        }
    }

    $scope.SnomedCodesObj = {
        "SearchType": "",
        "SearchConcept": "",
        "SearchEnteredDate": "",
        "SearchDescription": ""
    };

    $scope.getSnomedCodesItem = function (val) {
        $scope.SearchText = val || "";


        var params = {
            "HospitalId": $scope.HospitalId,
            "SearchText": $scope.SearchText || '',
            "PageSize": 20,
            "PageNumber": 1,
            "SearchType": $scope.SnomedCodesObj.SearchType || "",
            "SearchConcept": $scope.SnomedCodesObj.SearchConcept || "",
            "SearchDate": $scope.SnomedCodesObj.SearchEnteredDate || "",
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID || null,
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

    $scope.GetProblemsFromRcopia = function (val) {
        var searchvalue = val || "";

        if (searchvalue != "") {
            var req = {
                "VendorName": "Appolo Pharmacy",
                "VendorPassword": "abc123",
                "searchText": val || "nexium",
                "codeType": "ICD10",
                "UserId": $scope.UserId || null,
                "OrganizationId": $scope.HospitalId || null,
                "SearchType": "search_problem",
                "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
                "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
                "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId
            }
            return eHnoteConditionsDataService.getProblemsDataFromRcopia(req).then(function (resp) {
                console.log(resp);
                if (resp.data.ProblemList !== undefined) {
                    return resp.data.ProblemList.map(function (item) {
                        return item;
                    });
                }
            });
        }
    }

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
            "IsFrequent": "N",
            "Status": 0
        };
        if (val == "") {
            obj.IsFrequent = "Y"
        }
        return eHnoteSettingsDataService.GetOrganizationProcedures(obj).then(function (response) {
            if (response.data.Status == "Success") {
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
            }
        });
    };

    $scope.ChangeOrderType = function (type) {
        $scope.GetOrdersObject.ShowTab = type;
    };

    $scope.GetReferralMasterData = function (val) {
        var obj = {
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "UserId": $scope.UserId,
            "SearchText": val || null,
            "PageNumber": 1,
            "PageSize": 20,
        };
        return eHnoteSettingsDataService.GetReferralMasterData(obj).then(function (response) {
            if (response.data.Referral.length !== 0) {
                return response.data.Referral.map(function (item) {
                    return item;
                });

            }
        });
    };

    $scope.OrderInvestigationArray = [];
    $scope.OrderProceduresArray = [];
    $scope.OrderSurgeryArray = [];
    $scope.OrderReferalArray = [];
    $scope.OnClickOrderProcedure = function (mainitem, type) {
        if (type == 'Order') {
            if (mainitem.OrderTypeId == 1) {
                var i = 0;
                if ($scope.OrderInvestigationArray.length > 0) {
                    var filterProcedure = $filter("filter")($scope.OrderInvestigationArray, function (Aitem, index) { return Aitem.OrgDescriptionId == mainitem.OrganizationProcedureId && Aitem.DeleteInd == 'N' },);
                    if (filterProcedure.length > 0) {
                        $scope.GetOrdersObject.SearchProcedureObj = "";
                        alertify.error("Order Already Added");
                        return false;
                        i++;
                    }
                }
                if (i == 0) {
                    var object = {
                        "PatientOrderId": 0,
                        "OrderTemplateId": 0,
                        "SpecializationId": 0,
                        "OrderTypeId": mainitem.OrderTypeId,
                        /*"DescriptionId": mainitem.ProcedureId || "",*/
                        "InvestigationId": mainitem.ProcedureId || "",
                        "Description": mainitem.ProcedureName || "",
                        "InvestigationName": mainitem.ProcedureName || "",
                        "ProcedureCode": mainitem.ProcedureCode || 0,
                        "OrgDescriptionId": mainitem.OrganizationProcedureId || 0,
                        "OrgInvestigationId": mainitem.OrganizationProcedureId || 0,
                        "Remarks": "",
                        "OrganId": 1,
                        "OrganName": "OD",
                        "BillingCode": "",
                        "BookingStatusId": "2",
                        "CPTCode": mainitem.CPTCode,
                        "StatusId": "1",
                        "DeleteInd": "N",
                        "InvSpecialityId": "",
                        "PatientSurgeryId": 0,
                        "SurgeryListId": 0,
                        "IsEditData": true,
                        "InvestigationDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                        "CreatedDateTime": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                        "DurationType": mainitem.DurationType || "D",
                        "CoordinatorId": mainitem.CoordinatorId || 0,
                        "ExternalCoManagerId": mainitem.ExternalCoManagerId || 0,
                        "InternalCoManagerId": mainitem.InternalCoManagerId || 0,
                        "ShowDateFormat": true,
                        "Duration": '',
                        "DurationType": '',
                        "DurationDate": '',
                        "DiagnosisList": [],
                        "OrderType": mainitem.OrderType,
                        "ModalityId": 1,
                        "AdvicedInvestigationId": 0,
                        "PatientInvestigationId": 0,
                        "PatientProcedureId": 0,
                        "StatusId": 1,
                        "Subtab": "1",
                        "Status": "Active"
                    }
                    $scope.OrderInvestigationArray.push(object);
                }
                $scope.GetOrdersObject.SearchProcedureObj = "";
            }
            if (mainitem.OrderTypeId == 2) {
                var i = 0;
                if ($scope.OrderProceduresArray.length > 0) {
                    var filterProcedure = $filter("filter")($scope.OrderProceduresArray, function (Aitem, index) { return Aitem.OrgProcedureId == mainitem.OrganizationProcedureId && Aitem.DeleteInd == 'N' },);
                    if (filterProcedure.length > 0) {
                        $scope.GetOrdersObject.SearchProcedureObj = "";
                        alertify.error("Order Already Added");
                        return false;
                        i++;
                    }
                }
                if (i == 0) {
                    var object = {
                        "PatientOrderId": 0,
                        "OrderTemplateId": 0,
                        "SpecializationId": 0,
                        "OrderTypeId": mainitem.OrderTypeId,
                        "DescriptionId": mainitem.ProcedureId || "",
                        "ProcedureId": mainitem.ProcedureId || "",
                        "Description": mainitem.ProcedureName || "",
                        "ProcedureName": mainitem.ProcedureName || "",
                        "ProcedureCode": mainitem.ProcedureCode || 0,
                        "OrgProcedureId": mainitem.OrganizationProcedureId || 0,
                        "Remarks": "",
                        "OrganId": 1,
                        "OrganName": "OD",
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
                        "ProceduredDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                        "DurationType": mainitem.DurationType || "D",
                        "CoordinatorId": mainitem.CoordinatorId || 0,
                        "ExternalCoManagerId": mainitem.ExternalCoManagerId || 0,
                        "InternalCoManagerId": mainitem.InternalCoManagerId || 0,
                        "ShowDateFormat": true,
                        "Duration": '',
                        "DurationType": '',
                        "DurationDate": '',
                        "DiagnosisList": [],
                        "OrderType": mainitem.OrderType,
                        "ModalityId": 1,
                        "AdvicedInvestigationId": 0,
                        "PatientInvestigationId": 0,
                        "PatientProcedureId": 0,
                        "StatusId": 1,
                        "Subtab": "1",
                        "Status": "Active"
                    }
                    $scope.OrderProceduresArray.push(object);
                }
                $scope.GetOrdersObject.SearchProcedureObj = "";
            }
            if (mainitem.OrderTypeId == 3) {
                var i = 0;
                if ($scope.OrderSurgeryArray.length > 0) {
                    var filterProcedure = $filter("filter")($scope.OrderSurgeryArray, function (Aitem, index) { return Aitem.OrgDescriptionId == mainitem.OrganizationProcedureId && Aitem.DeleteInd == 'N' },);
                    if (filterProcedure.length > 0) {
                        $scope.GetOrdersObject.SearchProcedureObj = "";
                        alertify.error("Order Already Added");
                        return false;
                        i++;
                    }
                }
                if (i == 0) {
                    var object = {
                        "PatientOrderId": 0,
                        "OrderTemplateId": 0,
                        "SpecializationId": 0,
                        "OrderTypeId": mainitem.OrderTypeId,
                        "SurgeryId": mainitem.ProcedureId || 0,
                        "DescriptionId": mainitem.ProcedureId || "",
                        "Description": mainitem.ProcedureName || "",
                        "SurgeryName": mainitem.ProcedureName || "",
                        "ProcedureCode": mainitem.ProcedureCode || 0,
                        "OrgDescriptionId": mainitem.OrganizationProcedureId || 0,
                        "OrgSurgeryId": mainitem.OrganizationProcedureId || 0,
                        "Remarks": "",
                        "OrganId": 1,
                        "OrganName": "OD",
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
                        "CreatedDateTime": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                        "DurationType": mainitem.DurationType || "D",
                        "CoordinatorId": mainitem.CoordinatorId || 0,
                        "ExternalCoManagerId": mainitem.ExternalCoManagerId || 0,
                        "InternalCoManagerId": mainitem.InternalCoManagerId || 0,
                        "ShowDateFormat": true,
                        "Duration": '',
                        "DurationType": '',
                        "DurationDate": '',
                        "DiagnosisList": [],
                        "OrderType": mainitem.OrderType,
                        "ModalityId": 1,
                        "AdvicedInvestigationId": 0,
                        "PatientInvestigationId": 0,
                        "PatientProcedureId": 0,
                        "StatusId": 1,
                        "Subtab": "1",
                        "Status": "Active"
                    }
                    $scope.OrderSurgeryArray.push(object);
                }
                $scope.GetOrdersObject.SearchProcedureObj = "";
            }
        }
        if (type == 'Referral') {
            var i = 0;
            if ($scope.OrderReferalArray.length > 0) {
                var filterOrder = $filter("filter")($scope.OrderReferalArray, function (Aitem, index) { return Aitem.ReferralId == mainitem.ReferralId && Aitem.DeleteInd == 'N' },);
                if (filterOrder.length > 0) {
                    $scope.GetOrdersObject.SearchReferralObj = "";
                    alertify.error("Referal Already Added");
                    return false;
                    i++;
                }
            }
            if (i == 0) {
                var obj = {
                    "PatientOrderId": 0,
                    "PatientReferralDetailId": 0,
                    "SpecializationId": 0,
                    "Remarks": "",
                    "DeleteInd": "N",
                    "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                    "ReferralDoctorName": "",
                    "ReferralDoctorId": 0,
                    "SpecializationName": "",
                    "Alarm": "",
                    "IsUrgency": false,
                    "IsFollowUpAfterReferral": false,
                    "IsIncludeInCaseHistory": false,
                    "DurationDate": "",
                    "Duration": "",
                    "ReferralReason": "",
                    "DurationType": "",
                    "DiagnosisList": [],
                    "IsEditData": true,
                    "FinalObj": "Referral",
                    "OrderType": 'Referral',
                    "OrderTypeId": 4,
                    "Description": mainitem.Referral || "",
                    "ReferralId": mainitem.ReferralId,
                    "Referral": mainitem.Referral || "",
                    "ShowDateFormat": true,
                    "DurationDate": '',
                    "referralDoctorObj": "",
                    "Subtab": "1",
                    "Type": "Internal"
                }
                $scope.OrderReferalArray.push(obj);
            }
            $scope.GetOrdersObject.SearchReferralObj = "";
        }
    };

    $scope.GetDrugDataListFromRcopia = function (val) {
        var searchvalue = val || "";
        if (searchvalue != "") {
            var req = {
                "VendorName": "Appolo Pharmacy",
                "VendorPassword": "abc123",
                "searchText": searchvalue,
                "Maximum": 20,
                "UserId": $scope.UserId || null,
                "OrganizationId": $scope.HospitalId || null,
                "SearchType": "search_drug_detail",
                "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
                "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
                "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId
            }
            return eHnoteConditionsDataService.getDrugDetailDataFromRcopia(req).then(function (resp) {
                resp.data.DrugDetailsList = resp.data.DrugDetailsList || [];
                if (resp.data.DrugDetailsList.length > 0) {
                    return resp.data.DrugDetailsList.map(function (item) {
                        return item;
                    });
                }
            });
        }
    }

    function getNewPrescriptionDetailObj() {
        var obj = {
            "MedicationTemplateId": 0,
            "PatientPrescriptionDetailId": 0,
            "PatientPrescriptionId": 0,
            "PatientId": $scope.cacheStorageItem.patientid,
            "MedicationId": 0,
            "RcopiaDrugId": "",
            "RcopiaMedicationId": 0,
            "MedicationName": "",
            "DrugNDCID": "",
            "DrugFirstDataBankMedID": "",
            "DrugGenericId": "",
            "DrugBrandName": "",
            "DrugGenericName": "",
            "DrugForm": "",
            "DrugStrength": "",
            "DrugSchedule": "1",
            "DrugSupply": "",
            "DrugCompound": "",
            "MedicationTypeId": "",
            "MedicationTypeName": "",
            "Sig": "",
            "SigId": 0,
            "SigObj": "",
            "ActionId": "",
            "Action": "",
            "DoseId": "",
            "Dose": "",
            "DoseUnitId": "",
            "DoseUnit": "",
            "RouteId": "",
            "Route": "",
            "FrequencyId": "",
            "Frequency": "",
            "DoseOtherId": "",
            "DoseOther": "",
            "DaysSupplyId": "",
            "DaysSupply": "",
            "Quantity": "",
            "QuantityUnitId": "",
            "QuantityUnit": "",
            "RefillId": "",
            "Refills": "",
            "SubstitutionPermitted": "y",
            "PatientInstructions": "",
            "AssessmentsNotes": "",
            "DeleteInd": "N",
            "OtherNotes": "",
            "Remarks": "",
            "StartDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "StopDate": null,
            "FillDate": $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss"),
            "StopReason": "",
            "RcopiaMedicationStatus": "",
            "IsEditMode": true
        }
        return obj;
    };

    $scope.getMasterFieldDosageDataInAssesment = function () {
        eHnoteDiagnosisDataServices.GetMedicineDosageFieldsMasterData().then(function (resp) {
            console.log(JSON.stringify(resp));
            $scope.doseArray = resp.data.doseArray || [];
            $scope.doseOtherArray = resp.data.doseOtherArray || [];
            $scope.frequencyArray = resp.data.frequencyArray || [];
            $scope.refillsArray = resp.data.refillsArray || [];
            $scope.durationArray = resp.data.durationArray || [];
            $scope.actionArray = resp.data.actionArray || [];
            $scope.routeArray = resp.data.routeArray || [];
            $scope.doseUnitArray = resp.data.doseUnitArray || [];
            $scope.quantityUnitArray = resp.data.quantityUnitArray || [];
        }, function (err) {
            alertify.error("Failed");
            console.log(err);
        });
    };

    $scope.pushPrescriptionMedicationDetails1 = function (obj, type) {
        /*$scope.SigSearch.Shows = false;*/
        obj.SigFields = false;
        /*$scope.medicineGetObj.fastsig = false;*/
        $scope.adnewsigobj.IsNewSig = false;
        var newmedicationobj = getNewPrescriptionDetailObj();
        if (type === 'Rcopia') {
            newmedicationobj.RcopiaDrugId = obj.RcopiaDrugId;
            newmedicationobj.DrugNDCID = obj.RcopiaDrugNDCID;
            newmedicationobj.DrugFirstDataBankMedID = obj.FirstDataBankMedID;
            newmedicationobj.DrugGenericId = obj.GenericID;
            newmedicationobj.DrugBrandName = obj.BrandName;
            newmedicationobj.DrugGenericName = obj.GenericName;
            newmedicationobj.DrugForm = obj.Form;
            newmedicationobj.DrugStrength = obj.Strength;
            newmedicationobj.MedicationName = obj.BrandName + " " + obj.Strength;
            newmedicationobj.DrugSchedule = obj.Schedule;
            newmedicationobj.DrugSupply = obj.RouteCode;
            newmedicationobj.DrugCompound = "";
            newmedicationobj.Type = "MedicineOrders";
            newmedicationobj.fastsig = false;
            var mparams = {
                "UserId": $scope.UserId,
                "MedicineId": 0,
                "RcopiaDrugId": obj.RcopiaDrugId,
                "DrugNDCID": obj.RcopiaDrugNDCID,
                "FirstDataBankMedID": obj.FirstDataBankMedID,
                "DrugGenericID": obj.GenericID,
                "DrugName": obj.BrandName,
                "GenericName": obj.GenericName,
                "MedicineType": obj.Form,
                "Strength": obj.Strength,
                "Schedule": obj.Schedule,
                "RouteCode": obj.RouteCode,
                "RxNormList": []
            }

            if (obj.RxNormList.length > 0) {
                var filteredRxNorm = $filter("filter")(obj.RxNormList, { "Status": 'a' }, true) || [];
                if (filteredRxNorm.length > 0) {
                    newmedicationobj.DrugRxNormId = filteredRxNorm[0].RxnormID;
                    var rxNormObj = {
                        "MedicineRxNormsId": 0,
                        "RxnormID": filteredRxNorm[0].RxnormID,
                        "RxnormIDType": filteredRxNorm[0].RxnormIDType,
                        "Status": "a",
                        "Representative": "y"
                    }

                    mparams.RxNormList.push(rxNormObj)
                }
            }
            eHnoteDiagnosisDataServices.UpdateFirstBankMasterDrugDetails(mparams).then(function (response) {

                console.log(JSON.stringify(response));
                if (response.data.status === 'Success') {
                    newmedicationobj.MedicationId = response.data.MedicineId;

                    if (response.data.RxNormList.length > 0) {
                        var filteredRxNorm = $filter("filter")(obj.RxNormList, { "Status": 'a', "Representative": 'y' }, true) || [];
                        if (filteredRxNorm.length > 0) {
                            newmedicationobj.DrugRxNormId = filteredRxNorm[0].RxnormID;
                        }
                    }

                    var medi = 0;
                    if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                        angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                            if (item.MedicationId == newmedicationobj.MedicationId) {
                                medi++;
                            }
                        });
                    }


                    if (medi > 0) {
                        alertify.error('You have already entered this Drug');
                        $scope.medicineGetObj.MedicineObject = "";
                    } else {
                        $scope.PrescriptionMainAddObj.PrescriptionDetails.push(newmedicationobj);
                        $scope.medicineGetObj.MedicineObject = "";
                    }

                }
            });
        } else {
            newmedicationobj.MedicationId = obj.MedicineId;
            newmedicationobj.DrugBrandName = obj.DrugBrandName;
            newmedicationobj.MedicationName = obj.MedicineName;
            newmedicationobj.DrugSchedule = obj.ScheduleType;
            newmedicationobj.DrugStrength = obj.Strength;
            newmedicationobj.DrugGenericName = obj.GenericName;

            newmedicationobj.RcopiaDrugId = obj.RcopiaDrugId || "";
            newmedicationobj.DrugNDCID = obj.RcopiaDrugNDCID || "";
            newmedicationobj.DrugFirstDataBankMedID = obj.FirstDataBankMedID || "";
            newmedicationobj.DrugGenericId = obj.GenericID || "";
            newmedicationobj.Type = "MedicineOrders";
            var medi = 0;
            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                    if (item.MedicationId == newmedicationobj.MedicationId && item.DeleteInd == 'N') {
                        medi++;
                    }
                });
            }
            if (medi > 0) {
                alertify.error('You have already entered this Drug');
                $scope.medicineGetObj.MedicineObject = "";
            } else {
                $scope.PrescriptionMainAddObj.PrescriptionDetails.push(newmedicationobj);
                $scope.medicineGetObj.MedicineObject = "";
            }

        }
        $scope.getMasterFieldDosageDataInAssesment();
    };

    $scope.getOrgMedicines = function (text) {
        text = text || "";
        $scope.showhideprecesDiv = false;
        var object = {
            "LevelType": "G",
            "HospitalId": $scope.HospitalId,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "SearchText": text,
            "PageSize": 10,
            "PageNumber": 1,
            "Type": 'C',
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID || null,
        };
        if (text === "") {
            object.Type = 'C';
        }
        return eHnoteSettingsDataService.GetMasterMedicines(object).then(function (response) {
            if (response.data.count !== 0) {
                if (response.data.MedicineList !== undefined) {
                    $scope.showhideprecesDiv = false;
                    if (text === "") {
                        var obj = {
                            "MedicineId": "",
                            "MedicineNameWithStock": "Frequently Added"
                        };
                        response.data.MedicineList.unshift(obj);
                    }
                    return response.data.MedicineList.map(function (item) {
                        return item;
                    });
                } else {
                    $scope.showhideprecesDiv = true;
                }
            } else {
                $scope.showhideprecesDiv = false;
                if (text != '') {
                    $scope.showhideprecesDiv = true;
                }
            }
        });
    };

    $scope.RemovePrescriptionDetailObj = function (index, item) {
        item.DeleteInd = 'Y';

        item.RcopiaMedicationId = item.RcopiaMedicationId || "";


       $scope.PrescriptionMainAddObjFOrDelete = getEmptyPrescriptionObj();
        $scope.PrescriptionMainAddObjFOrDelete.PatientPrescriptionId = item.PatientPrescriptionId;

        var newmedicationobj = getNewPrescriptionDetailObj();
        newmedicationobj.PatientPrescriptionDetailId = item.PatientPrescriptionDetailId;
        newmedicationobj.PatientPrescriptionId = item.PatientPrescriptionId;
        newmedicationobj.MedicationId = item.MedicationId;
        newmedicationobj.RcopiaDrugId = item.RcopiaDrugId || 0;
        newmedicationobj.RcopiaMedicationId = item.RcopiaMedicationId || 0;
        newmedicationobj.MedicationName = item.MedicationName || 0;
        newmedicationobj.DrugNDCID = item.DrugNDCID || "";
        newmedicationobj.DrugFirstDataBankMedID = item.DrugFirstDataBankMedID || "";
        newmedicationobj.DrugGenericId = item.DrugGenericId || "";
        newmedicationobj.DrugBrandName = item.DrugBrandName || "";
        newmedicationobj.DrugGenericName = item.DrugGenericName || "";
        newmedicationobj.DrugForm = item.DrugForm || "";
        newmedicationobj.DrugStrength = item.DrugStrength || "";
        newmedicationobj.DrugSchedule = item.DrugSchedule || "";
        newmedicationobj.DrugSupply = item.DrugSupply || "";
        newmedicationobj.DrugCompound = item.DrugSupply || "";
        newmedicationobj.MedicationTypeId = item.MedicationTypeId || "";
        newmedicationobj.MedicationTypeName = item.MedicationTypeName || "";
        newmedicationobj.Sig = item.Sig || "";
        newmedicationobj.SigId = item.SigId || "";
        newmedicationobj.ActionId = item.ActionId || "";
        newmedicationobj.Action = item.Action || "";
        newmedicationobj.DoseId = item.DoseId || "";
        newmedicationobj.Dose = item.Dose || "";
        newmedicationobj.DoseUnitId = item.DoseUnitId || "";
        newmedicationobj.DoseUnit = item.DoseUnit || "";
        newmedicationobj.RouteId = item.RouteId || "";
        newmedicationobj.Route = item.Route || "";
        newmedicationobj.FrequencyId = item.FrequencyId || "";
        newmedicationobj.Frequency = item.Frequency || "";
        newmedicationobj.DoseOtherId = item.DoseOtherId || "";
        newmedicationobj.DoseOther = item.DoseOther || "";
        newmedicationobj.DaysSupplyId = item.DaysSupplyId || "";
        newmedicationobj.DaysSupply = item.DaysSupply || "";
        newmedicationobj.Quantity = item.Quantity || "";
        newmedicationobj.QuantityUnitId = item.QuantityUnitId || "";
        newmedicationobj.QuantityUnit = item.QuantityUnit || "";
        newmedicationobj.RefillId = item.RefillId || "";
        newmedicationobj.Refills = item.Refills || "";
        newmedicationobj.SubstitutionPermitted = item.SubstitutionPermitted || "";
        newmedicationobj.PatientInstructions = item.PatientInstructions || "";
        newmedicationobj.DeleteInd = "Y";
        newmedicationobj.OtherNotes = "";
        newmedicationobj.Remarks = "";
        newmedicationobj.StartDate = "";
        newmedicationobj.StopDate = "";
        newmedicationobj.FillDate = "";
        newmedicationobj.StopReason = "";
        newmedicationobj.RcopiaMedicationStatus = 0;
        newmedicationobj.IsEditMode = false;
        $scope.PrescriptionMainAddObjFOrDelete.PrescriptionDetails.push(newmedicationobj);


        eHnotePatientDataService.AddUpdatePatientPrescriptionDetails($scope.PrescriptionMainAddObjFOrDelete, OnAddSigSuccess, OnAddSigError);
        function OnAddSigSuccess(response) {
            if (response.status === "Success") {
                alertify.success("Medication Deleted  Successfully");


                if (item.RcopiaMedicationId !== "") {

                    $scope.AddNewPrescriptionObj = getnewPrescriptionObj();


                    angular.forEach($scope.PrescriptionMainAddObjFOrDelete.PrescriptionDetails, function (pitem) {

                        var scheduletype = "unknown";
                        if (pitem.DrugSchedule == "0" || pitem.DrugSchedule == "" || pitem.DrugSchedule === 0) {
                            scheduletype = "unknown";
                        } else {
                            scheduletype = pitem.DrugSchedule;
                        }
                        var obj = {
                            "PatientMedicationId": pitem.PatientPrescriptionDetailId,
                            "IsInPatientMedication": "n",
                            "HistorySource": "patient",
                            "HasScheduledDrug": "n",
                            "Deleted": "y",
                            "RcopiaMedicationId": pitem.RcopiaMedicationId,
                            "MedicationId": pitem.MedicationId,
                            "DrugRocipaId": pitem.RcopiaDrugId,
                            "DrugFirstDataBankMedID": pitem.DrugFirstDataBankMedID,
                            "DrugNDCID": pitem.DrugNDCID,
                            "DrugRxNormId": pitem.DrugRxNormId,
                            "DrugBrandName": pitem.DrugBrandName,
                            "GenericName": pitem.DrugGenericName,
                            "Form": pitem.DrugForm,
                            "Schedule": scheduletype,
                            "Strength": pitem.DrugStrength,
                            "Supply": "n",
                            "Compound": "n",
                            "Action": pitem.DrugAction,
                            "Dose": pitem.DrugDose,
                            "Route": pitem.DoseRoute,
                            "DoseUnit": pitem.DoseUnit,
                            "DoseTiming": pitem.DoseTiming,
                            "DoseOther": pitem.DoseOther,
                            "Duration": pitem.DoseDuration,
                            "Quantity": pitem.DoseQuantity,
                            "QuantityUnit": pitem.QuantityUnit,
                            "Refills": pitem.Refills,
                            "SubstitutionPermitted": pitem.SubstitutionPermitted,
                            "OtherNotes": pitem.OtherNotes,
                            "PatientNotes": pitem.PatientNotes,
                            "Comments": "",
                            "StartDate": $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss"),
                            "StopDate": pitem.StopDate,
                            "FillDate": $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss"),
                            "StopReason": pitem.MedicineStopReason,
                            "DeleteInd": pitem.DeleteInd
                        };

                        $scope.AddNewPrescriptionObj.MedicationsList.push(obj);

                    });


                    eHnoteDiagnosisDataServices.addPatientMedicationsToRcopia($scope.AddNewPrescriptionObj).then(function (response) {
                        if (response.status === 'Success') {

                        }
                    });
                }
            }
        }
        function OnAddSigError() {
            alertify.error("Creating  Failed");
        }
    };

    $scope.ClearMedicalRxItem = function (mainitem) {

        mainitem.ActionId = "";
        mainitem.Action = "";
        mainitem.Dose = "";
        mainitem.DoseUnit = "";
        mainitem.Route = "";
        mainitem.Frequency = "";
        mainitem.DoseOther = "";
        mainitem.DaysSupply = "";
        mainitem.QuantityUnit = "";
        mainitem.DoseId = "";
        mainitem.DoseUnitId = "";
        mainitem.RouteId = "";
        mainitem.FrequencyId = "";
        mainitem.DoseOtherId = "";
        mainitem.DaysSupplyId = "";
        mainitem.Quantity = "";
        mainitem.QuantityUnitId = "";
        mainitem.RefillId = "";
        mainitem.Refills = "";
        mainitem.PatientInstructions = "";
        mainitem.SigObj = '';

    }

    $scope.adnewsigobj = {
        "IsNewSig": false,
        "MedicineId": 0,
    }

    $scope.AddNewMedicineIdchange = function (item) {
        $scope.adnewsigobj.MedicineId = item.MedicationId || 0;
        $scope.adnewsigobj.IsNewSig = !$scope.adnewsigobj.IsNewSig;
        item.SigFields = false;

        $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
        angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (ditem) {
            ditem.IsPirticularAddSigIND = false;
        });
        item.IsPirticularAddSigIND = true;
    }
    $scope.changeSigForMedicine = function (item) {
        item.Sig = "";
        item.SigId = 0;
    };
    $scope.ONSigDetails = function (item, mainitem) {
        mainitem.SigFields = false;
        
        mainitem.ActionId = item.ActionId || null;
        mainitem.Action = item.Action || '';
        mainitem.Dose = item.Dose || '';
        mainitem.DoseUnit = item.DoseUnit || '';
        mainitem.Route = item.Route || '';
        mainitem.Frequency = item.Frequency || '';
        mainitem.DoseOther = item.DoseOther || '';
        mainitem.DaysSupply = item.DaysSupply || '';
        mainitem.QuantityUnit = item.QuantityUnit || '';
        mainitem.DoseId = item.DoseId || null;
        mainitem.DoseUnitId = item.DoseUnitId || null;
        mainitem.RouteId = item.RouteId || null;
        mainitem.FrequencyId = item.FrequencyId || null;
        mainitem.DoseOtherId = item.DoseOtherId || null;
        mainitem.DaysSupplyId = item.DaysSupplyId || null;
        mainitem.Quantity = item.Quantity || null;
        mainitem.QuantityUnitId = item.QuantityUnitId || null;
        mainitem.RefillId = item.RefillId || null;
        mainitem.Refills = item.Refills || null;
        mainitem.Sig = item.Sig;
        mainitem.SigId = item.OrganizationSigTemplateId;

        if (item.DaysSupplyId != 0) {
            var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": mainitem.DaysSupplyId }, true);
            if (filteredArray.length > 0) {
                var DateCode = filteredArray[0].Code;
                var currentDate = new Date();
                var futureDate = new Date(currentDate.getTime() + (parseInt(DateCode) * 24 * 60 * 60 * 1000));
                mainitem.StopDate = $filter('date')(futureDate, 'MM/dd/yyyy HH:mm:ss');
            }
        }
    }

    function getnewOrganizationSigObj() {
        var obj = {
            "UserId": $scope.UserId,
            "OrganizationSigTemplateId": 0,
            "OrganizationId": $scope.HospitalId,
            "Sig": "",
            "ActionId": "",
            "Action": "",
            "DoseId": "",
            "Dose": "",
            "DoseUnitId": "",
            "DoseUnit": "",
            "RouteId": "",
            "Route": "",
            "FrequencyId": "",
            "Frequency": "",
            "DoseOtherId": "",
            "DoseOther": "",
            "DaysSupplyId": "",
            "DaysSupply": "",
            "Quantity": "",
            "QuantityUnitId": "",
            "QuantityUnit": "",
            "RefillId": "",
            "Refills": "",
            "DeleteInd": "N",
            "IsFrequent": "N",
            "PageSize": 10,
            "PageNumber": 1,
            "MedicineId": $scope.adnewsigobj.MedicineId || 0,
            "PatientInstructions": "",
        };

        return obj;
    }
    $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();

    $scope.addSIgNameDynamically = function () {
        var dosesupplytest = "";
        if ($scope.addNewOrganizationSigObj.DaysSupply !== '') {
            dosesupplytest = " for " + $scope.addNewOrganizationSigObj.DaysSupply;
        }
        $scope.addNewOrganizationSigObj.Sig = $scope.addNewOrganizationSigObj.Action + " " + $scope.addNewOrganizationSigObj.Dose + " " + $scope.addNewOrganizationSigObj.DoseUnit + " " + $scope.addNewOrganizationSigObj.Route + " " + $scope.addNewOrganizationSigObj.Frequency + " " + $scope.addNewOrganizationSigObj.DoseOther + "" + dosesupplytest;
    }

    $scope.changePopupPrescAction = function (mainobj) {
        var filteredArray = $filter("filter")($scope.actionArray, { "MedicineDosaageFieldId": mainobj.ActionId }, true);
        if (filteredArray.length > 0) {
            mainobj.Action = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamically();
    };

    $scope.changePopupPrescDose = function (mainobj) {
        var filteredArray = $filter("filter")($scope.doseArray, { "MedicineDosaageFieldId": mainobj.DoseId }, true);
        if (filteredArray.length > 0) {
            mainobj.Dose = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamically();
    };

    $scope.changePopupPrescDoseUnit = function (mainobj) {
        var filteredArray = $filter("filter")($scope.doseUnitArray, { "MedicineDosaageFieldId": mainobj.DoseUnitId }, true);
        if (filteredArray.length > 0) {
            mainobj.DoseUnit = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamically();
    };

    $scope.changePopupPrescRoute = function (mainobj) {
        var filteredArray = $filter("filter")($scope.routeArray, { "MedicineDosaageFieldId": mainobj.RouteId }, true);
        if (filteredArray.length > 0) {
            mainobj.Route = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamically();
    };

    $scope.changePopupPrescFrequency = function (mainobj) {
        var filteredArray = $filter("filter")($scope.frequencyArray, { "MedicineDosaageFieldId": mainobj.FrequencyId }, true);
        if (filteredArray.length > 0) {
            mainobj.Frequency = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamically();
    };

    $scope.changePopupPrescDaysSupply = function (mainobj) {
        var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": mainobj.DaysSupplyId }, true);
        if (filteredArray.length > 0) {
            mainobj.DaysSupply = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamically();
    };

    $scope.changePopupPrescQuantityUnit = function (mainobj) {
        var filteredArray = $filter("filter")($scope.quantityUnitArray, { "MedicineDosaageFieldId": mainobj.QuantityUnitId }, true);
        if (filteredArray.length > 0) {
            mainobj.QuantityUnit = filteredArray[0].Code;
        };
    };

    $scope.changePopupPrescRefill = function (mainobj) {
        var filteredArray = $filter("filter")($scope.refillsArray, { "MedicineDosaageFieldId": mainobj.RefillId }, true);
        if (filteredArray.length > 0) {
            mainobj.Refills = filteredArray[0].Code;
        };
    };

    $scope.getParticularSigMedicationitems = function (text, item) {
        text = text || '';
        var params = {
            "MedicineId": item.MedicationId,
            "OrganizationId": $scope.HospitalId,
            "SearchText": text || '',
            "IsFrequent": "N",
            "PageSize": 10,
            "PageNumber": 1
        };
        if (text != "") {
            params.IsFrequent = "N";
        }
        return eHnotePatientDataService.GetOrganizationMedicationSigList(params).then(function (resp) {
            if (resp.data.rows.length !== 0) {
                if (resp.data.rows !== undefined) {
                    return resp.data.rows.map(function (item) {
                        return item;
                    });
                }
            }

        });

    };
    function getEmptyPrescriptionObj() {


        var TodayDate = $filter('date')(new Date(), "yyyy-MM-dd");

        var obj = {
            "UserId": $scope.UserId,
            "OrganizationId": $scope.HospitalId,
            "PatientId": $scope.appointmentInfo.PatientID,
            "RcopiaPatientId": $scope.RcopiaPatientObj.RcopiaPatientId,
            "PatientPrescriptionId": 0,
            "AppointmentId": $scope.appointmentInfo.AppointmentID,
            "ProviderId": $scope.appointmentInfo.DoctorID,
            "PrescribedDate": TodayDate,
            "RcopiaPrescriptionId": "",
            "LastUpdateDate": TodayDate,
            "PharmacyId": 0,
            "RcopiaPharmacyId": "",
            "PrescriberOrderNumber": "",
            "RxReferenceNumber": "",
            "PrescriptionAction": "",
            "CompletedDate": null,
            "SignedDate": null,
            "StopDate": null,
            "LastModifiedBy": $scope.UserId,
            "LastModifiedDate": TodayDate,
            "CompleteAction": "Created",
            "PrescriptionSentMethod": "",
            "PrescriptionStatus": "",
            "DeleteInd": "N",
            "RcopiaDeleted": "n",
            "PrescriptionDetails": []
        };
        return obj;
    };
    $scope.changePopupPrescDoseOther = function (mainobj) {
        var filteredArray = $filter("filter")($scope.doseOtherArray, { "MedicineDosaageFieldId": mainobj.DoseOtherId }, true);
        if (filteredArray.length > 0) {
            mainobj.DoseOther = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamically();
    };

    $scope.getOrganizationMedicationSigitems = function (text) {
        text = text || '';
        var params = {
            "OrganizationId": $scope.HospitalId,
            "SearchText": text || '',
            "IsFrequent": "Y",
            "PageSize": 10,
            "PageNumber": 1

        };
        if (text != "") {
            params.IsFrequent = "N";
        }
        return eHnotePatientDataService.GetOrganizationMedicationSigList(params).then(function (resp) {
            if (resp.data.rows.length !== 0) {
                if (resp.data.rows !== undefined) {
                    return resp.data.rows.map(function (item) {
                        return item;
                    });
                }
            }

        });
    };

    $scope.EditSigFields = function (item) {
        item.SigFields = true;
        $scope.adnewsigobj.IsNewSig = false;
        $scope.getMasterFieldDosageDataInAssesment();
    }

    $scope.changePrescAction = function (mainobj) {
        var filteredArray = $filter("filter")($scope.actionArray, { "MedicineDosaageFieldId": mainobj.ActionId }, true);
        if (filteredArray.length > 0) {
            mainobj.Action = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };
    $scope.changePrescDose = function (mainobj) {
        var filteredArray = $filter("filter")($scope.doseArray, { "MedicineDosaageFieldId": mainobj.DoseId }, true);
        if (filteredArray.length > 0) {
            mainobj.Dose = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };
    $scope.changePrescDoseUnit = function (mainobj) {
        var filteredArray = $filter("filter")($scope.doseUnitArray, { "MedicineDosaageFieldId": mainobj.DoseUnitId }, true);
        if (filteredArray.length > 0) {
            mainobj.DoseUnit = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };
    $scope.changePrescRoute = function (mainobj) {
        var filteredArray = $filter("filter")($scope.routeArray, { "MedicineDosaageFieldId": mainobj.RouteId }, true);
        if (filteredArray.length > 0) {
            mainobj.Route = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };
    $scope.changePrescFrequency = function (mainobj) {
        var filteredArray = $filter("filter")($scope.frequencyArray, { "MedicineDosaageFieldId": mainobj.FrequencyId }, true);
        if (filteredArray.length > 0) {
            mainobj.Frequency = filteredArray[0].Description;
        };
        $scope.addSIgNameDynamicallyAdded();
    };
    $scope.changePrescDoseOther = function (mainobj) {
        var filteredArray = $filter("filter")($scope.doseOtherArray, { "MedicineDosaageFieldId": mainobj.DoseOtherId }, true);
        if (filteredArray.length > 0) {
            mainobj.DoseOther = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };
    $scope.changePrescDaysSupply = function (mainobj) {
        var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": mainobj.DaysSupplyId }, true);
        if (filteredArray.length > 0) {

            mainobj.DaysSupply = filteredArray[0].Code;
            mainobj.DaysSupplyDescription = filteredArray[0].Description;
        };
        $scope.addSIgNameDynamicallyAdded();
    };
    $scope.changePrescQuantityUnit = function (mainobj) {
        var filteredArray = $filter("filter")($scope.quantityUnitArray, { "MedicineDosaageFieldId": mainobj.QuantityUnitId }, true);
        if (filteredArray.length > 0) {
            mainobj.QuantityUnit = filteredArray[0].Code;
        };
    };
    $scope.changePrescRefill = function (mainobj) {
        var filteredArray = $filter("filter")($scope.refillsArray, { "MedicineDosaageFieldId": mainobj.RefillId }, true);
        if (filteredArray.length > 0) {
            mainobj.Refills = filteredArray[0].Code;
        };
    };

    $scope.clearOrganizationSiginput = function () {
        $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
    };

    $scope.SaveOrganizationSig = function (item) {
        if ($scope.addNewOrganizationSigObj.Sig == '') {
            alertify.error("Please Enter Sig");
            return false;
        }

        if ($scope.addNewOrganizationSigObj.IsFrequent == true) {
            $scope.addNewOrganizationSigObj.IsFrequent = "Y";
        }
        item = item || ""
        if (item != "") {
            item.ActionId = $scope.addNewOrganizationSigObj.ActionId || null;
            item.Action = $scope.addNewOrganizationSigObj.Action || '';
            item.Dose = $scope.addNewOrganizationSigObj.Dose || '';
            item.DoseUnit = $scope.addNewOrganizationSigObj.DoseUnit || '';
            item.Route = $scope.addNewOrganizationSigObj.Route || '';
            item.Frequency = $scope.addNewOrganizationSigObj.Frequency || '';
            item.DoseOther = $scope.addNewOrganizationSigObj.DoseOther || '';
            item.DaysSupply = $scope.addNewOrganizationSigObj.DaysSupply || '';
            item.QuantityUnit = $scope.addNewOrganizationSigObj.QuantityUnit || '';
            item.DoseId = $scope.addNewOrganizationSigObj.DoseId || null;
            item.DoseUnitId = $scope.addNewOrganizationSigObj.DoseUnitId || null;
            item.RouteId = $scope.addNewOrganizationSigObj.RouteId || null;
            item.FrequencyId = $scope.addNewOrganizationSigObj.FrequencyId || null;
            item.DoseOtherId = $scope.addNewOrganizationSigObj.DoseOtherId || null;
            item.DaysSupplyId = $scope.addNewOrganizationSigObj.DaysSupplyId || null;
            item.Quantity = $scope.addNewOrganizationSigObj.Quantity || null;
            item.QuantityUnitId = $scope.addNewOrganizationSigObj.QuantityUnitId || null;
            item.RefillId = $scope.addNewOrganizationSigObj.RefillId || null;
            item.Refills = $scope.addNewOrganizationSigObj.Refills || null;
            item.SigObj = $scope.addNewOrganizationSigObj.Sig;
            item.SigId = $scope.addNewOrganizationSigObj.OrganizationSigTemplateId;
        }
        if (item.SigObj == "") {
            var dosesupplytest = "";
            if (item.DaysSupply !== '') {
                dosesupplytest = " for " + item.DaysSupply;
            }
            item.SigObj = item.Action + " " + item.Dose + " " + item.DoseUnit + " " + item.Route + " " + item.Frequency + " " + item.DoseOther + "" + dosesupplytest;
        }
        if ($scope.addNewOrganizationSigObj.MedicineId==0) {
            $scope.addNewOrganizationSigObj.MedicineId = $scope.adnewsigobj.MedicineId;

        }
        eHnotePatientDataService.AddUpdateOrganizationMedicationSig($scope.addNewOrganizationSigObj, OnAddSigSuccess, OnAddSigError);
        function OnAddSigSuccess(response) {
            alertify.success("Sig Added  Successfully");

            $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();

            $scope.adnewsigobj.IsNewSig = false;


        }
        function OnAddSigError() {
            alertify.error("Creating  Failed");
        }
    };

    $scope.SelectAssmtTemplate = function (item) {
        if ($scope.DiagnosisTemplatesArray.length > 0) {
            angular.forEach($scope.DiagnosisTemplatesArray, function (ditem) {
                ditem.IsActiveTemplate = false;
            });
            item.IsActiveTemplate = true;
        }
    };

    $scope.GetOrganizationMedicationlist = function (val) {

        var req = {
            "HospitalId": $scope.HospitalId,
            "PageSize": 10,
            "SearchText": val || '',
            "PageNumber": 1,
            "UserId": $scope.UserId,
            "IsFrequent": "N",
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID || null,
        };
        if (req.SearchKey == "") {
            req.IsFrequent = "Y";
        }

        return eHnoteConditionsDataService.GetOrganizationMedications(req).then(function (resp) {
            if (resp.data.count !== 0) {

                if (resp.data.MedicineList !== undefined) {
                    return resp.data.MedicineList.map(function (item) {
                        return item;
                    });
                }
            }
        });
    };

    $scope.AnteriorCopyToOs = function (OrganID) {
        var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": 5 }, true);
        
        if (OrganID == 1) {
            angular.forEach($scope.AnteriorSegmentArrayNew, function (item) {
                angular.forEach(item.RemarksArray, function (Aitem, index) {
                    var count = [];
                    count = $filter("filter")(temparray, function (fitem, index) { return fitem.InvFindingId == Aitem.InvFindingId && Aitem.OrganId == 2 });
                    if (count.length > 0) {
                        if (Aitem.RemarksId === 0) {
                            item.RemarksArray.splice(index, 1);
                        }
                        else {
                            Aitem.ActiveInd = 'N';
                        }
                    }
                });
            });
            angular.forEach($scope.AnteriorSegmentArrayNew, function (item) {
                angular.forEach(item.RemarksArray, function (Aitem) {
                    var Filter = $filter("filter")(item.RemarksArray, { "InvFindingId": Aitem.InvFindingId, "OrganId": 1 }, true) || [];
                    if (Filter.length > 0) {
                        var obj = {
                            "RemarksId": 0,
                            "InvFindingId": Aitem.InvFindingId || 0,
                            "FindingValue": Aitem.FindingValue || '',
                            "OrganId": 2,
                            "FindingId": Aitem.FindingId || 0,
                            "FindingName": Aitem.FindingName || '',
                            "Notes": Aitem.Notes || '',
                            "DiagnosisRiskLevel": "",
                            "ActiveInd": "Y",
                            "SubFindingList": Aitem.SubFindingList || [],
                        }
                        var InvFilter = $filter("filter")(item.RemarksArray, { "InvFindingId": obj.InvFindingId, "OrganId": 2 }, true) || [];
                        if (InvFilter.length == 0) {
                            item.RemarksArray.push(obj);
                        }
                    }
                });
            });
        }
        if (OrganID == 2) {
            angular.forEach($scope.AnteriorSegmentArrayNew, function (item) {
                angular.forEach(item.RemarksArray, function (Aitem, index) {
                    var count = [];
                    count = $filter("filter")(temparray, function (fitem, index) { return fitem.InvFindingId == Aitem.InvFindingId && Aitem.OrganId == 1 });
                    if (count.length > 0) {
                        if (Aitem.RemarksId === 0) {
                            item.RemarksArray.splice(index, 1);
                        }
                        else {
                            Aitem.ActiveInd = 'N';
                        }
                    }
                });
            });
            angular.forEach($scope.AnteriorSegmentArrayNew, function (item) {
                angular.forEach(item.RemarksArray, function (Aitem) {
                    var Filter = $filter("filter")(item.RemarksArray, { "InvFindingId": Aitem.InvFindingId, "OrganId": 2 }, true) || [];
                    if (Filter.length > 0) {
                        var obj = {
                            "RemarksId": 0,
                            "InvFindingId": Aitem.InvFindingId || 0,
                            "FindingValue": Aitem.FindingValue || '',
                            "OrganId": 1,
                            "FindingId": Aitem.FindingId || 0,
                            "FindingName": Aitem.FindingName || '',
                            "Notes": Aitem.Notes || '',
                            "DiagnosisRiskLevel": "",
                            "ActiveInd": "Y",
                            "SubFindingList": Aitem.SubFindingList || [],
                        }
                        var InvFilter = $filter("filter")(item.RemarksArray, { "InvFindingId": obj.InvFindingId, "OrganId": 1 }, true) || [];
                        if (InvFilter.length == 0) {
                            item.RemarksArray.push(obj);
                        }
                    }
                });
            });
        }
    };

    $scope.PosteriorCopyToOs = function (OrganID) {
        var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": 6 }, true);
        if (OrganID == 1) {
            angular.forEach($scope.PoteriorSegmentArrayNew, function (item) {
                angular.forEach(item.RemarksArray, function (Aitem, index) {
                    var count = [];
                    count = $filter("filter")(temparray, function (fitem, index) { return fitem.InvFindingId == Aitem.InvFindingId && Aitem.OrganId == 2 });
                    if (count.length > 0) {
                        if (Aitem.RemarksId === 0) {
                            item.RemarksArray.splice(index, 1);
                        }
                        else {
                            Aitem.ActiveInd = 'N';
                        }
                    }
                });
            });
            angular.forEach($scope.PoteriorSegmentArrayNew, function (item) {
                if (item.InvestigationId == 32) {
                    item.RHorizontal = item.RHorizontal || '';
                    item.RVertical = item.RVertical || '';
                    item.RDPS = item.RDPS || '';
                    if (item.RHorizontal != '' && item.RVertical != '' && item.RDPS != '') {
                        item.LHorizontal = item.RHorizontal || '';
                        item.LVertical = item.RVertical || '';
                        item.LDPS = item.RDPS || '';
                    }
                    else {
                        if (item.RHorizontal != '') {
                            item.LHorizontal = item.RHorizontal || '';
                        }
                        if (item.RVertical != '') {
                            item.LVertical = item.RVertical || '';
                        }
                        if (item.RDPS != '') {
                            item.LDPS = item.RDPS || '';
                        }
                    }
                }
                else {
                    angular.forEach(item.RemarksArray, function (Aitem) {
                        var Filter = $filter("filter")(item.RemarksArray, { "InvFindingId": Aitem.InvFindingId, "OrganId": 1 }, true) || [];
                        if (Filter.length > 0) {
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": Aitem.InvFindingId || 0,
                                "FindingValue": Aitem.FindingValue || '',
                                "OrganId": 2,
                                "FindingId": Aitem.FindingId || 0,
                                "FindingName": Aitem.FindingName || '',
                                "Notes": Aitem.Notes || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "SubFindingList": Aitem.SubFindingList || [],
                            }
                            var InvFilter = $filter("filter")(item.RemarksArray, { "InvFindingId": obj.InvFindingId, "OrganId": 2 }, true) || [];
                            if (InvFilter.length == 0) {
                                item.RemarksArray.push(obj);
                            }
                        }
                    });
                }
            });
        }
        if (OrganID == 2) {
            angular.forEach($scope.PoteriorSegmentArrayNew, function (item) {
                angular.forEach(item.RemarksArray, function (Aitem, index) {
                    var count = [];
                    count = $filter("filter")(temparray, function (fitem, index) { return fitem.InvFindingId == Aitem.InvFindingId && Aitem.OrganId == 1 });
                    if (count.length > 0) {
                        if (Aitem.RemarksId === 0) {
                            item.RemarksArray.splice(index, 1);
                        }
                        else {
                            Aitem.ActiveInd = 'N';
                        }
                    }
                });
            });
            angular.forEach($scope.PoteriorSegmentArrayNew, function (item) {
                if (item.InvestigationId == 32) {
                    item.LHorizontal = item.LHorizontal || '';
                    item.LVertical = item.LVertical || '';
                    item.LDPS = item.LDPS || '';
                    if (item.LHorizontal != '' && item.LVertical != '' && item.LDPS != '') {
                        item.RHorizontal = item.LHorizontal || '';
                        item.RVertical = item.LVertical || '';
                        item.RDPS = item.LDPS || '';
                    }
                    else {
                        if (item.LHorizontal != '') {
                            item.RHorizontal = item.LHorizontal || '';
                        }
                        if (item.LVertical != '') {
                            item.RVertical = item.LVertical || '';
                        }
                        if (item.LDPS != '') {
                            item.RDPS = item.LDPS || '';
                        }
                    }
                }
                else {
                    angular.forEach(item.RemarksArray, function (Aitem) {
                        var Filter = $filter("filter")(item.RemarksArray, { "InvFindingId": Aitem.InvFindingId, "OrganId": 2 }, true) || [];
                        if (Filter.length > 0) {
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": Aitem.InvFindingId || 0,
                                "FindingValue": Aitem.FindingValue || '',
                                "OrganId": 1,
                                "FindingId": Aitem.FindingId || 0,
                                "FindingName": Aitem.FindingName || '',
                                "Notes": Aitem.Notes || '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "SubFindingList": Aitem.SubFindingList || [],
                            }
                            var InvFilter = $filter("filter")(item.RemarksArray, { "InvFindingId": obj.InvFindingId, "OrganId": 1 }, true) || [];
                            if (InvFilter.length == 0) {
                                item.RemarksArray.push(obj);
                            }
                        }
                    });
                }
            });
        }
    };

    $scope.ChangeIsNormal = function (type, status, Organ, CategoryId) {

        if (status) {
            if (type == 'Anterior') {
                var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);
                if (Organ === 1) {
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (subitem, subindex) {
                            var object = {
                                "PatientFindingAnteriorId": 0,
                                "IsNormal": true,
                                "CategoryId": 5,
                                "CategoryDesc": "Anterior Segment",
                                "InvestigationId": subitem.InvestigationId || 0,
                                "InvestigationDesc": subitem.InvestigationDesc || "",
                                "OrderBY": subitem.OrderBY || 0,
                                "ActiveInd": "Y",
                                "SelectedGlobalSearch": "",
                                "SelectedRightEye": 1,
                                "SelectedLeftEye": 0,
                                "RemarksArray": [],

                            };
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || "",
                                "OrganId": Organ || 1,
                                "FindingId": 0,
                                "FindingName": '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": false,
                                "SubFindingList": []
                            }
                            var List = [];
                            List = $filter("filter")($scope.AnteriorSegmentArrayNew, { "InvestigationId": subitem.InvestigationId }, true);
                            if (List.length == 0) {
                                if (subitem.InvestigationId == item.InvestigationId) {
                                    object.RemarksArray.push(obj);
                                    $scope.AnteriorSegmentArrayNew.push(object);
                                }
                            } else {
                                angular.forEach(List, function (aitem) {
                                    var List1 = [];
                                    List1 = $filter("filter")(aitem.RemarksArray, { "OrganId": 1, "ActiveInd": "Y" }, true);
                                    if (List1.length == 0) {
                                        var obj = {
                                            "RemarksId": 0,
                                            "InvFindingId": item.InvFindingId || 0,
                                            "FindingValue": item.FindingValue || "",
                                            "OrganId": Organ || 1,
                                            "FindingId": 0,
                                            "FindingName": '',
                                            "DiagnosisRiskLevel": "",
                                            "ActiveInd": "Y",
                                            "Notes": "",
                                            "IsShowNotesTextBox": false,
                                            "SubFindingList": []
                                        }
                                        if (subitem.InvestigationId == item.InvestigationId) {
                                            aitem.RemarksArray.push(obj);
                                        }
                                    }
                                });
                            }
                        });
                    });
                    $scope.examinationObj.FindingValueObj = "";
                    $scope.examinationObj.OSFindingValueObj = "";
                    $scope.cacheStorageItem.AnteriorODIsNormal = true;
                }
                if (Organ === 2) {
                    angular.forEach(temparray, function (item, index) {
                        angular.forEach($scope.cacheStorageItem.AnteriorDetails, function (subitem, subindex) {

                            var object = {
                                "PatientFindingAnteriorId": 0,
                                "IsNormal": true,
                                "CategoryId": 5,
                                "CategoryDesc": "Anterior Segment",
                                "InvestigationId": subitem.InvestigationId || 0,
                                "InvestigationDesc": subitem.InvestigationDesc || "",
                                "OrderBY": subitem.OrderBY || 0,
                                "ActiveInd": "Y",
                                "SelectedGlobalSearch": "",
                                "SelectedRightEye": 1,
                                "SelectedLeftEye": 0,
                                "RemarksArray": [],

                            };
                            var obj = {
                                "RemarksId": 0,
                                "InvFindingId": item.InvFindingId || 0,
                                "FindingValue": item.FindingValue || "",
                                "OrganId": Organ || 2,
                                "FindingId": 0,
                                "FindingName": '',
                                "DiagnosisRiskLevel": "",
                                "ActiveInd": "Y",
                                "Notes": "",
                                "IsShowNotesTextBox": false,
                                "SubFindingList": []
                            }
                            var List = [];
                            List = $filter("filter")($scope.AnteriorSegmentArrayNew, { "InvestigationId": subitem.InvestigationId }, true);
                            if (List.length == 0) {
                                if (subitem.InvestigationId == item.InvestigationId) {
                                    object.RemarksArray.push(obj);
                                    $scope.AnteriorSegmentArrayNew.push(object);
                                }
                            } else {
                                angular.forEach(List, function (aitem) {
                                    var List1 = [];
                                    List1 = $filter("filter")(aitem.RemarksArray, { "OrganId": 2, "ActiveInd": "Y" }, true);
                                    if (List1.length == 0) {
                                        var obj = {
                                            "RemarksId": 0,
                                            "InvFindingId": item.InvFindingId || 0,
                                            "FindingValue": item.FindingValue || "",
                                            "OrganId": Organ || 2,
                                            "FindingId": 0,
                                            "FindingName": '',
                                            "DiagnosisRiskLevel": "",
                                            "ActiveInd": "Y",
                                            "Notes": "",
                                            "IsShowNotesTextBox": false,
                                            "SubFindingList": []
                                        }
                                        if (subitem.InvestigationId == item.InvestigationId) {
                                            aitem.RemarksArray.push(obj);
                                        }
                                    }
                                });
                            }
                        });
                    });

                    $scope.examinationObj.FindingValueObj = "";
                    $scope.examinationObj.OSFindingValueObj = "";
                    $scope.cacheStorageItem.AnteriorOSIsNormal = true;
                }
            }

            if (type == 'Posterior') {
                var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);
                if (Organ === 1) {
                    angular.forEach(temparray, function (item, index) {
                        if (item.InvestigationId !== 32) {
                            angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (subitem, subindex) {

                                var object = {
                                    "PatientFindingPosteriorId": 0,
                                    "IsNormal": true,
                                    "CategoryId": 6,
                                    "CategoryDesc": "Posterior Segment",
                                    "InvestigationId": subitem.InvestigationId || 0,
                                    "InvestigationDesc": subitem.InvestigationDesc || "",
                                    "OrderBY": subitem.OrderBY || 0,
                                    "ActiveInd": "Y",
                                    "SelectedGlobalSearch": "",
                                    "SelectedRightEye": 1,
                                    "SelectedLeftEye": 0,
                                    "RemarksArray": [],

                                };
                                var obj = {
                                    "RemarksId": 0,
                                    "InvFindingId": item.InvFindingId || 0,
                                    "FindingValue": item.FindingValue || "",
                                    "OrganId": Organ || 1,
                                    "FindingId": 0,
                                    "FindingName": '',
                                    "DiagnosisRiskLevel": "",
                                    "ActiveInd": "Y",
                                    "Notes": "",
                                    "IsShowNotesTextBox": false,
                                    "SubFindingList": []
                                }
                                var List = [];
                                List = $filter("filter")($scope.PoteriorSegmentArrayNew, { "InvestigationId": subitem.InvestigationId }, true);
                                if (List.length == 0) {
                                    if (subitem.InvestigationId == item.InvestigationId) {
                                        object.RemarksArray.push(obj);
                                        $scope.PoteriorSegmentArrayNew.push(object);
                                    }
                                } else {
                                    angular.forEach(List, function (aitem) {
                                        var List1 = [];
                                        List1 = $filter("filter")(aitem.RemarksArray, { "OrganId": 1, "ActiveInd": "Y" }, true);
                                        if (List1.length == 0) {
                                            var obj = {
                                                "RemarksId": 0,
                                                "InvFindingId": item.InvFindingId || 0,
                                                "FindingValue": item.FindingValue || "",
                                                "OrganId": Organ || 1,
                                                "FindingId": 0,
                                                "FindingName": '',
                                                "DiagnosisRiskLevel": "",
                                                "ActiveInd": "Y",
                                                "Notes": "",
                                                "IsShowNotesTextBox": false,
                                                "SubFindingList": []
                                            }
                                            if (subitem.InvestigationId == item.InvestigationId) {
                                                aitem.RemarksArray.push(obj);
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                    $scope.PosteriorexaminationObj.FindingValueObj = "";
                    $scope.PosteriorexaminationObj.OSFindingValueObj = "";
                    $scope.cacheStorageItem.PosteriorODIsNormal = true;
                }
                if (Organ === 2) {
                    angular.forEach(temparray, function (item, index) {
                        if (item.InvestigationId !== 32) {
                            angular.forEach($scope.cacheStorageItem.PosteriorDetails, function (subitem, subindex) {

                                var object = {
                                    "PatientFindingPosteriorId": 0,
                                    "IsNormal": true,
                                    "CategoryId": 6,
                                    "CategoryDesc": "Posterior Segment",
                                    "InvestigationId": subitem.InvestigationId || 0,
                                    "InvestigationDesc": subitem.InvestigationDesc || "",
                                    "OrderBY": subitem.OrderBY || 0,
                                    "ActiveInd": "Y",
                                    "SelectedGlobalSearch": "",
                                    "SelectedRightEye": 1,
                                    "SelectedLeftEye": 0,
                                    "RemarksArray": [],

                                };
                                var obj = {
                                    "RemarksId": 0,
                                    "InvFindingId": item.InvFindingId || 0,
                                    "FindingValue": item.FindingValue || "",
                                    "OrganId": 2,
                                    "FindingId": 0,
                                    "FindingName": '',
                                    "DiagnosisRiskLevel": "",
                                    "ActiveInd": "Y",
                                    "Notes": "",
                                    "IsShowNotesTextBox": false,
                                    "SubFindingList": []
                                }
                                var List = [];
                                List = $filter("filter")($scope.PoteriorSegmentArrayNew, { "InvestigationId": subitem.InvestigationId }, true);
                                if (List.length == 0) {
                                    if (subitem.InvestigationId == item.InvestigationId) {
                                        object.RemarksArray.push(obj);
                                        $scope.PoteriorSegmentArrayNew.push(object);
                                    }
                                } else {
                                    angular.forEach(List, function (aitem) {
                                        var List1 = [];
                                        List1 = $filter("filter")(aitem.RemarksArray, { "OrganId": 2, "ActiveInd": "Y" }, true);
                                        if (List1.length == 0) {
                                            var obj = {
                                                "RemarksId": 0,
                                                "InvFindingId": item.InvFindingId || 0,
                                                "FindingValue": item.FindingValue || "",
                                                "OrganId": Organ || 2,
                                                "FindingId": 0,
                                                "FindingName": '',
                                                "DiagnosisRiskLevel": "",
                                                "ActiveInd": "Y",
                                                "Notes": "",
                                                "IsShowNotesTextBox": false,
                                                "SubFindingList": []
                                            }
                                            if (subitem.InvestigationId == item.InvestigationId) {
                                                aitem.RemarksArray.push(obj);
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                    $scope.PosteriorexaminationObj.FindingValueObj = "";
                    $scope.PosteriorexaminationObj.OSFindingValueObj = "";
                    $scope.cacheStorageItem.PosteriorOSIsNormal = true;
                }
            }
        } else {
            if (type == 'Anterior') {
                var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);
                if (Organ === 1) {
                    //angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem) {
                    //    angular.forEach(subitem.RemarksArray, function (Mitem, index1) {
                    //        if (Mitem.OrganId == 1) {
                    //           subitem.RemarksArray.splice(index1, 1);
                    //        }
                    //    });

                    //});
                    angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem) {
                        angular.forEach(temparray, function (item, index) {
                            if (Mitem.RemarksArray.length > 0) {
                                angular.forEach(Mitem.RemarksArray, function (hitem, index) {
                                    if (hitem.InvFindingId == item.InvFindingId) {
                                        if (hitem.RemarksId === 0 && hitem.OrganId == 1) {
                                            Mitem.RemarksArray.splice(index, 1);
                                        }
                                        else if (hitem.OrganId == 1) {
                                            hitem.ActiveInd = 'N';
                                        }
                                    }
                                });
                            }
                        });
                    });
                    $scope.cacheStorageItem.AnteriorODIsNormal = false;
                }
                if (Organ === 2) {
                    angular.forEach($scope.AnteriorSegmentArrayNew, function (Mitem) {
                        angular.forEach(temparray, function (item, index) {
                            if (Mitem.RemarksArray.length > 0) {
                                angular.forEach(Mitem.RemarksArray, function (hitem, index) {
                                    if (hitem.InvFindingId == item.InvFindingId) {
                                        if (hitem.RemarksId === 0 && hitem.OrganId == 2) {
                                            Mitem.RemarksArray.splice(index, 1);
                                        }
                                        else if (hitem.OrganId == 2) {
                                            hitem.ActiveInd = 'N';
                                        }
                                    }
                                });
                            }
                        });
                    });
                    $scope.cacheStorageItem.AnteriorOSIsNormal = false;
                }
            }
            if (type == 'Posterior') {
                var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);
                if (Organ === 1) {
                    angular.forEach($scope.PoteriorSegmentArrayNew, function (Mitem) {
                        angular.forEach(temparray, function (item, index) {
                            if (Mitem.RemarksArray.length > 0) {
                                angular.forEach(Mitem.RemarksArray, function (hitem, index) {
                                    if (hitem.InvFindingId == item.InvFindingId) {
                                        if (hitem.RemarksId === 0 && hitem.OrganId == 1) {
                                            Mitem.RemarksArray.splice(index, 1);
                                        }
                                        else if (hitem.OrganId == 1) {
                                            hitem.ActiveInd = 'N';
                                        }
                                    }
                                });
                            }
                        });
                    });
                    $scope.cacheStorageItem.PosteriorODIsNormal = false;
                }
                if (Organ === 2) {
                    angular.forEach($scope.PoteriorSegmentArrayNew, function (Mitem) {
                        angular.forEach(temparray, function (item, index) {
                            if (Mitem.RemarksArray.length > 0) {
                                angular.forEach(Mitem.RemarksArray, function (hitem, index) {
                                    if (hitem.InvFindingId == item.InvFindingId) {
                                        if (hitem.RemarksId === 0 && hitem.OrganId == 2) {
                                            Mitem.RemarksArray.splice(index, 1);
                                        }
                                        else if (hitem.OrganId == 2) {
                                            hitem.ActiveInd = 'N';
                                        }
                                    }
                                });
                            }
                        });
                    });
                    $scope.cacheStorageItem.PosteriorOSIsNormal = false;
                }
            }
        }


    }

    $scope.GetFindingCheckValues = function () {
        eHnotePatientAddressDataServices.FindingCheckValues().then(function (resp) {
            $scope.cacheStorageItem.FindingCheckValuesList = resp.data;
            $scope.AddToCache();
        }, function (err) {
            console.log(err);
            alertify.error("Getting FindingCheckValues Failed");
        });
    };
    if ($scope.cacheStorageItem.FindingCheckValuesList != undefined) {
        if ($scope.cacheStorageItem.FindingCheckValuesList.length === 0) {
            $scope.GetFindingCheckValues();
        }
    }

    $scope.addSIgNameDynamicallyAdded = function () {

        if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
            angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (initem, index) {
                var dosesupplytest = "";
                if (initem.DaysSupply !== '') {
                    dosesupplytest = " for " + initem.DaysSupplyDescription;
                }
                initem.SigObj = initem.Action + " " + initem.Dose + " " + initem.DoseUnit + " " + initem.Route + " " + initem.Frequency + " " + initem.DoseOther + "" + dosesupplytest;
                initem.Sig = initem.Action + " " + initem.Dose + " " + initem.DoseUnit + " " + initem.Route + " " + initem.Frequency + " " + initem.DoseOther + "" + dosesupplytest;

            });
        }
    }

    $scope.$watch("DiagnosisTemplatesArray", function (newVal, oldVal) {
        if ($scope.DiagnosisTemplatesArray === undefined) { return; }
        angular.forEach($scope.DiagnosisTemplatesArray, function (Mitem) {
            Mitem.IsAnteriorRemarksIsActive = false;
            Mitem.IsPosteriorRemarksIsActive = false;
            Mitem.AnteriorValuesArray = Mitem.AnteriorValuesArray || [];
            if (Mitem.AnteriorValuesArray.length > 0) {
                angular.forEach(Mitem.AnteriorValuesArray, function (item) {
                    if (item.ActiveInd == "Y" && item.RemarksArray.length > 0) {
                        angular.forEach(item.RemarksArray, function (inv) {
                            if (inv.ActiveInd == "Y") {
                                Mitem.IsAnteriorRemarksIsActive = true;
                            }
                        });
                    }
                });
            }

            Mitem.PosteriorValuesArray = Mitem.PosteriorValuesArray || [];
            if (Mitem.PosteriorValuesArray.length > 0) {
                angular.forEach(Mitem.PosteriorValuesArray, function (item) {
                    if (item.ActiveInd == "Y" && item.RemarksArray.length > 0 && item.InvestigationId !== 32) {
                        angular.forEach(item.RemarksArray, function (inv) {
                            if (inv.ActiveInd == "Y") {
                                Mitem.IsPosteriorRemarksIsActive = true;
                            }
                        });
                    }
                });
            }
        });
    }, true);

    $scope.navtoAddNew = function (Type, obj, organ, catid) {

        $scope.AddNew = $uibModal.open({
            "templateUrl": "templates/uibpopups/AnteriorandPosteriorPopUp.html",
            "backdrop": "static",
            //  "scope": $scope,
            "size": "lg",
            "windowClass": "examination-popover-popup overflow-hidden medicinorder-stop",
            "resolve": {

                "AnteriorDetails": function () { return $scope.cacheStorageItem.AnteriorDetails },
                "PosteriorDetails": function () { return $scope.cacheStorageItem.PosteriorDetails },
                "Anteriorobj": function () { return $scope.newAnteriorObj },
                "Posteriorobj": function () { return $scope.newPosteriorObj },
                "Type": function () { return Type },
                "obj": function () { return obj },
                "organ": function () { return organ },
                "catid": function () { return catid },

            },
            "keyboard": false,
            "controller": function ($scope, $uibModal, eHnoteMasterDataService, AnteriorDetails, PosteriorDetails, Anteriorobj, Posteriorobj, Type, $uibModalInstance) {
                $scope.AnteriorDetails = AnteriorDetails || [];
                $scope.PosteriorDetails = PosteriorDetails || [];
                $scope.newAnteriorObj = Anteriorobj || '';
                $scope.newPosteriorObj = Posteriorobj || '';
                $scope.Type = Type || "";
                $scope.obj = obj || "";
                $scope.organ = organ || "";
                $scope.catid = catid || "";
                var doctorinfo = eHnoteMasterDataService.getUserInfo();
                $scope.AnteriorPosteriorObj = {
                    "ShowAddNewBtn": false,
                    "type": '',
                    "InvestigationDesc": '',
                    "FindingValue": '',
                    "FindingValuesArray": [],
                    "InvestigationId": 0,
                    "InvestigationDesc": '',
                    "CategoryId": ''
                };
                if ($scope.Type == 'Anterior' ) {
                    $scope.AnteriorPosteriorObj.CategoryId = $scope.newAnteriorObj.CatId || 5
                    $scope.AnteriorPosteriorObj.InvestigationId = 0;
                   
                    
                        $scope.AnteriorPosteriorObj.type = $scope.Type;
                    
                    $scope.AnteriorPosteriorObj.FindingValue = $scope.obj;
                    $scope.AnteriorPosteriorObj.FindingValuesArray = $scope.AnteriorDetails;
                }
                else if ($scope.Type == 'Posterior' ) {
                    $scope.AnteriorPosteriorObj.CategoryId = $scope.newPosteriorObj.CatId || 6
                    $scope.AnteriorPosteriorObj.InvestigationId = 0;
                        $scope.AnteriorPosteriorObj.type = $scope.Type;

                    $scope.AnteriorPosteriorObj.FindingValue = $scope.obj;
                   // $scope.AnteriorPosteriorObj.FindingValuesArray = $scope.PosteriorDetails;
                    $scope.AnteriorPosteriorObj.FindingValuesArray = $scope.PosteriorDetails.filter(function (item) { return item.InvestigationId !== 32 });

                }

                $scope.onSelectFindingValue = function (id, item) {
                    var TempArray = $filter("filter")($scope.AnteriorPosteriorObj.FindingValuesArray, { "InvestigationId": id }, true) || [];
                    if (TempArray.length > 0) {
                        item.InvestigationId = TempArray[0].InvestigationId;
                        item.InvestigationDesc = TempArray[0].InvestigationDesc;
                        // $scope.cacheStorageItem.FollowUpVisitreasonId = TempArray[0].ReasonId
                    }
                }
                $scope.SaveFindingValues = function () {
                    if ($scope.AnteriorPosteriorObj.InvestigationDesc == "") {
                        alertify.error("Please Select Finding");
                        return false;
                    }
                    if ($scope.AnteriorPosteriorObj.FindingValue == "") {
                        alertify.error("Please Select FindingValue");
                        return false;
                    }
                    var params = {
                        "UserId": doctorinfo.doctorid,
                        "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "OrganizationFindingValueId": 0,
                        "MasterFindingValueId": 0,
                        "DeleteInd": "N",
                        "CategoryId": $scope.AnteriorPosteriorObj.CategoryId || 0,
                        "CategoryName": $scope.AnteriorPosteriorObj.type,
                        "FindingId": $scope.AnteriorPosteriorObj.InvestigationId || 0,
                        "FindingName": $scope.AnteriorPosteriorObj.InvestigationDesc || '',
                        "OrganizationFindingId": 0,
                        "FindingValue": $scope.AnteriorPosteriorObj.FindingValue || ""

                    }
                    eHnotePatientDataService.AddUpdateOrgFindingValues(params).then(function (resp) {
                        if (resp.data.Status === 'Success') {
                            resp.data.rows = resp.data.rows || [];
                            $scope.TempArray = [];
                            if (resp.data.rows.length > 0) {
                                $scope.TempArray = resp.data.rows[0];
                            }
                            alertify.success("Save successfully");
                            $uibModalInstance.close($scope.TempArray);
                        } else {
                            alertify.error(resp.data.Message);

                        }
                    });
                 //   $scope.closeuibpopup();
                   
                }


                $scope.closeuibpopup = function () {
                    $uibModalInstance.dismiss("cancel");
                }
            }
        });
        $scope.AddNew.result.then(function (resp) {
            if (catid == 5) {
                $scope.changeFundusFinding($scope.examinationObj, resp, organ,catid )
            } else {
                $scope.onfindingValueSelectPost($scope.PosteriorexaminationObj, resp, organ, catid )
            }
            $scope.examinationObj.OSFindingValueObj= '';
            $scope.examinationObj.FindingValueObj = '';
            $scope.PosteriorexaminationObj.FindingValueObj = '';
            $scope.PosteriorexaminationObj.OSFindingValueObj = '';

        }, function () { });

    }

}]);
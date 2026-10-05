"use strict";
eHnoteWebApp.controller("USExaminationTemplatePopUpCtrl", ["$scope", "$rootScope", "$uibModalInstance", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteConditionsDataService", "eHnoteDiagnosisDataServices", "eHnoteSettingsDataService", "eHnoteMainAppointmentService","eHnoteDbStaticDataService", "Type", "cacheStorageItem",
    function ($scope, $rootScope, $uibModalInstance, $filter, alertify, eHnoteMasterDataService, eHnoteConditionsDataService, eHnoteDiagnosisDataServices, eHnoteSettingsDataService, eHnoteMainAppointmentService, eHnoteDbStaticDataService, Type, cacheStorageItem) {

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
        }

        $scope.cacheStorageItem = cacheStorageItem;
        $scope.ActualAnteriorValuesArray = [];

        $scope.closeuibpopup = function () {
            $uibModalInstance.dismiss("cancel");
        }

        $scope.examinationcategories = [
            {
                "CategoryId": 5,
                "CategoryName": "Anterior Segment"
            },
            {
                "CategoryId": 6,
                "CategoryName": "Posterior Segment"
            },
            {
                "CategoryId": 12,
                "CategoryName": "External Examinations"
            }
        ];
        $scope.examinationObj = {
            "CategoryId": "",
            "FindingsArray": [],
            "SelectedEye": "1",
            "InvestigationId": "",
            "SubCategoryChildId": "",
            "InvestigationDesc": "",
            "DiagnosisRiskLevel": "Mild",
            "IsShowAnterior": "Y",
            "FindingValueObj": ""
        };

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

        $scope.addExaminationValue = function () {

            if ($scope.examinationObj.CategoryId === 5) {
                var filteredInvArray = $filter("filter")($scope.ActualAnteriorValuesArray, { "InvestigationId": $scope.examinationObj.InvestigationId }, true) || [];

                if (filteredInvArray.length > 0) {
                    angular.forEach($scope.ActualAnteriorValuesArray, function (bitem) {
                        if (bitem.InvestigationId === $scope.examinationObj.InvestigationId) {
                            var remarksObj = {
                                "RemarksId": 0,
                                "OrganId": parseInt($scope.examinationObj.SelectedEye),
                                "ActiveInd": 'Y',
                                "DiagnosisRiskLevel": $scope.examinationObj.DiagnosisRiskLevel,
                                "Remarks": $scope.examinationObj.FindingValueObj.FindingValue || "",
                                "InvFindingId": $scope.examinationObj.FindingValueObj.InvFindingId || 0
                            }
                            aObj.Remarks = aObj.Remarks || [];
                            aObj.Remarks.push(remarksObj);
                            //if ($scope.examinationObj.SelectedEye == '1') {
                            //    bitem.RightEyeRemarks.push(remarksObj);
                            //}
                            //if ($scope.examinationObj.SelectedEye == '2') {
                            //    bitem.LeftEyeRemarks.push(remarksObj);
                            //}
                            //if ($scope.examinationObj.SelectedEye == '3') {
                            //    bitem.BothEyeRemarks.push(remarksObj);
                            //}
                        }
                    })
                } else {

                    var aObj = {
                        "CategoryId": 5,
                        "CategoryName": "Anterior Segment",
                        "InvestigationId": $scope.examinationObj.InvestigationId,
                        "SubCategoryChildId": $scope.examinationObj.SubCategoryChildId,
                        "InvestigationDesc": $scope.examinationObj.InvestigationDesc,
                        "Remarks": [],

                    };

                    var remarksObj = {
                        "RemarksId": 0,
                        "OrganId": parseInt($scope.examinationObj.SelectedEye),
                        "ActiveInd": 'Y',
                        "DiagnosisRiskLevel": $scope.examinationObj.DiagnosisRiskLevel,
                        "Remarks": $scope.examinationObj.FindingValueObj.FindingValue || "",
                        "InvFindingId": $scope.examinationObj.FindingValueObj.InvFindingId || 0
                    }
                    aObj.Remarks.push(remarksObj);
                    //if ($scope.examinationObj.SelectedEye == '1') {
                    //    aObj.RightEyeRemarks.push(remarksObj);
                    //}
                    //if ($scope.examinationObj.SelectedEye == '2') {
                    //    aObj.LeftEyeRemarks.push(remarksObj);
                    //}
                    //if ($scope.examinationObj.SelectedEye == '3') {
                    //    aObj.BothEyeRemarks.push(remarksObj);
                    //}
                    $scope.ActualAnteriorValuesArray.push(aObj);
                }
            }


            if ($scope.examinationObj.CategoryId === 6) {
                var filteredInvArray = $filter("filter")($scope.ActualPosteriorValuesArray, { "InvestigationId": $scope.examinationObj.InvestigationId }, true) || [];

                if (filteredInvArray.length > 0) {
                    angular.forEach($scope.ActualPosteriorValuesArray, function (bitem) {
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
                        "CategoryId": 6,
                        "CategoryName": "Posterior Segment",
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
                    $scope.ActualPosteriorValuesArray.push(aObj);
                }
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
                    });
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

        function GetMasterCategoryDetails() {
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

                $scope.tempConsultationArrayList = $scope.TemplateList;
                angular.forEach($scope.tempConsultationArrayList, function (mitem) {
                    angular.forEach(mitem.CategoryDetails, function (nitem) {
                        nitem.Active = 'N';
                        nitem.IsSubCategoryChecked = false;
                    });
                });
                //$scope.AddToCache();
              //  $scope.changesConsultationTemplate(categorytype);
            }, function (err) {
                console.log(err);
                alertify.error("Getting Categories Failed");
            });
        };
        GetMasterCategoryDetails();
    }]);
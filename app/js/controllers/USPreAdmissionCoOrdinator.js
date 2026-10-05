"use strict";
eHnoteWebApp.controller("USPreAdmissionCoOrdinator", ["$scope", "$rootScope", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteSurgeryService", "eHnoteCacheStorageService", "eHnoteAuditServices", "$uibModal", "eHnoteMainAppointmentService", "eHnoteDiagnosisDataServices", "datapersistanceFactory", "eHnotePatientDataService", "$q", "eHnoteSettingsDataService", "USPrintService", "eHnoteConditionsDataService",
    function ($scope, $rootScope, $filter, alertify, eHnoteMasterDataService, eHnoteSurgeryService, eHnoteCacheStorageService, eHnoteAuditServices, $uibModal, eHnoteMainAppointmentService, eHnoteDiagnosisDataServices, datapersistanceFactory, eHnotePatientDataService, $q, eHnoteSettingsDataService, USPrintService, eHnoteConditionsDataService) {

        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        var appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();
        appointmentInfo.AppointmentTypeId = 7;
        eHnoteMasterDataService.addAppointmentInfo(appointmentInfo);

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.LoginUserRoleID = doctorinfo.RoleID;
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        $scope.SelectedFile = 17;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        };

        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
        $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData") || {};
        $scope.AddToCache = function () {
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        };

        $scope.HeaderLogo = '';
        $scope.initOrgLogo = function () {
            var printobj = datapersistanceFactory.getItem("printSettingData");
            console.log(printobj);
            printobj.PrintHeaderImgUrl = printobj.PrintHeaderImgUrl || "";
            if (printobj.PrintHeaderImgUrl !== "") {
                $scope.toDataURL(printobj.PrintHeaderImgUrl, function (dataURL) {
                    $scope.HeaderLogo = dataURL;
                });
            }
        }

        $scope.CoordinatorObj = {
            'CoordinatorQuestionsList': [],
            'CoordinatorNotes': '',
            'VisionChallengesODAllCheck': '',
            'VisionChallengesOSAllCheck': '',
            'VisualDiscomfortODAllCheck': '',
            'VisualDiscomfortOSAllCheck': '',
            'IsshowCordinatorSummary': false,
            'IsshowCordinatorEdit': false,
            "CoordinatorChartStatus": "D",
            "StatusFlag": "D",
            "PreAdmCoOrdinatorId":0,
            "IsVisionChallengeDataAdded": false,
            "IsVisionDiscomfortDataAdded": false,
            "IsCounsellingDataAdded": false,
            "IsCoordinatorDataAdded": false,
            "IsCoManagerNotesAdded": false,
            "LastSignOffUserDetails": [],
            "InternalCoManagerNotes": '',
            "ExternalCoManagerNotes": '',
            "ClearanceDoctorName": '',
            "ClearanceReqDate": null,
            "ClearanceRecievedDate": null,
            "DispanseUsersList": [],
            "DispensedByUserId": null,
            "DispensedByUserName": '',
            "DispenseDate": null,
            "DispenseTime": '',
            "IsClickSaveCoordinatortBtn": false,
        };

        $scope.allUserList = $scope.allUserList || [];
        if ($scope.allUserList.length > 0) {
            $scope.CoordinatorObj.DispanseUsersList = $scope.allUserList.filter((x) => x.RoleId == 18 || x.RoleId == 8) || [];
        }

        $scope.GetDispenceTime = function () {
            $scope.CoordinatorObj.DispenseTime = $filter('date')(new Date(), "hh:mm a");
        };

        $scope.init = function () {
            let Req = {
                "ParentOrganizationId": $scope.ParenthospitalId,
                "CheckListModuleId": 4
            };
            let Req1 = {
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
                "OrganizationId": $scope.HospitalId || 0,
            };
           
            $q.all([
                eHnoteSurgeryService.GetOrganizationASCCheckListData(Req),
                eHnoteSurgeryService.GetPreAdmCoordinatorData(Req1),
            ]).then(function (resp) {

                if (resp[0].data.status === "Success") {
                    if (resp[0].data.MasterCoOrdinatorQuestions.length > 0) {
                        $scope.CoordinatorObj.CoordinatorQuestionsList = [];
                        angular.forEach(resp[0].data.MasterCoOrdinatorQuestions, function (item) {
                            var obj = {
                                'PreAdmCoOrdinatorDetailId':0,
                                'QuestionId': item.CoOrdinatorQuestionId || 0,
                                'Description': item.Description || '',
                                'TypeId': item.TypeId || 0,
                                'TypeName': item.TypeName || '',
                                'OdValue': '',
                                'OsValue': '',
                                'Notes': '',
                                'DeleteInd': 'N',
                                'ShowNotesInd': false,
                                'IsShowSubData': false,
                                'CoOrdinatorQuestionValues': [],
                            }

                            if (item.CoOrdinatorQuestionValues.length > 0) {
                                angular.forEach(item.CoOrdinatorQuestionValues, function (vitem) {
                                    var ValueObj = {
                                        'CoOrdinatorValueDetailId': 0,
                                        'QuestionId': vitem.CoOrdinatorQuestionId || 0,
                                        'QuestionValueId': vitem.CoOrdinatorQuestionValueId || 0,
                                        'Value': vitem.Value || '',
                                        'DeleteInd': 'N',
                                        'IsChecked': false,
                                    };
                                    obj.CoOrdinatorQuestionValues.push(ValueObj);
                                });
                            }
                            $scope.CoordinatorObj.CoordinatorQuestionsList.push(obj);
                        });
                    }
                }
                if (resp[1].data.status === "Success") {
                    if (resp[1].data.LastSignOffUserDetails.length > 0) {
                        $scope.CoordinatorObj.LastSignOffUserDetails = resp[1].data.LastSignOffUserDetails || [];
                    } else {
                        $scope.CoordinatorObj.LastSignOffUserDetails = [];
                    }
                    if (resp[1].data.rows.length > 0) {
                        $scope.CoordinatorObj.PreAdmCoOrdinatorId = resp[1].data.rows[0].PreAdmCoOrdinatorId || 0;
                        $scope.CoordinatorObj.CoordinatorChartStatus = resp[1].data.rows[0].CoordinatorChartStatus || 'D';
                        $scope.CoordinatorObj.StatusFlag = resp[1].data.rows[0].StatusFlag || 'D';

                        $scope.CoordinatorObj.CoordinatorNotes = resp[1].data.rows[0].CoordinatorNotes || '';
                        $scope.LogObj.CoordinatorNotes = resp[1].data.rows[0].CoordinatorNotes || '';

                        $scope.CoordinatorObj.InternalCoManagerNotes = resp[1].data.rows[0].InternalCoManagerNotes || '';
                        $scope.LogObj.InternalCoManagerNotes = resp[1].data.rows[0].InternalCoManagerNotes || '';

                        $scope.CoordinatorObj.ExternalCoManagerNotes = resp[1].data.rows[0].ExternalCoManagerNotes || '';
                        $scope.LogObj.ExternalCoManagerNotes = resp[1].data.rows[0].ExternalCoManagerNotes || '';

                        $scope.CoordinatorObj.ClearanceDoctorName = resp[1].data.rows[0].ClearanceDoctorName || '';
                        $scope.LogObj.ClearanceDoctorName = resp[1].data.rows[0].ClearanceDoctorName || '';

                        $scope.CoordinatorObj.ClearanceReqDate = resp[1].data.rows[0].ClearanceReqDate || null;
                        $scope.LogObj.ClearanceReqDate = resp[1].data.rows[0].ClearanceReqDate || null;

                        if ($scope.CoordinatorObj.ClearanceReqDate !== null) {
                            $scope.CoordinatorObj.ClearanceReqDate = $filter('date')(($scope.CoordinatorObj.ClearanceReqDate), "MM-dd-yyyy")
                            $scope.LogObj.ClearanceReqDate = $scope.CoordinatorObj.ClearanceReqDate;
                        }

                        $scope.CoordinatorObj.ClearanceRecievedDate = resp[1].data.rows[0].ClearanceRecievedDate || null;
                        $scope.LogObj.ClearanceRecievedDate = resp[1].data.rows[0].ClearanceRecievedDate || null;

                        if ($scope.CoordinatorObj.ClearanceRecievedDate !== null) {
                            $scope.CoordinatorObj.ClearanceRecievedDate = $filter('date')(($scope.CoordinatorObj.ClearanceRecievedDate), "MM-dd-yyyy")
                            $scope.LogObj.ClearanceRecievedDate = $scope.CoordinatorObj.ClearanceRecievedDate;
                        }

                        $scope.CoordinatorObj.DispensedByUserId = resp[1].data.rows[0].DispensedByUserId || null;
                        $scope.LogObj.DispensedByUserId = resp[1].data.rows[0].DispensedByUserId || null;

                        $scope.CoordinatorObj.DispenseDate = resp[1].data.rows[0].DispenseDate || null;
                        $scope.LogObj.DispenseDate = resp[1].data.rows[0].DispenseDate || null;

                        if ($scope.CoordinatorObj.DispenseDate !== null) {
                            $scope.CoordinatorObj.DispenseDate = $filter('date')(($scope.CoordinatorObj.DispenseDate), "MM-dd-yyyy");
                            $scope.LogObj.DispenseDate = $scope.CoordinatorObj.DispenseDate;
                        }

                        $scope.CoordinatorObj.DispenseTime = resp[1].data.rows[0].DispenseTime || '';
                        $scope.LogObj.DispenseTime = resp[1].data.rows[0].DispenseTime || '';

                        $scope.CoordinatorObj.DispensedByUserName = resp[1].data.rows[0].DispensedByUserName || '';

                        if ($scope.CoordinatorObj.PreAdmCoOrdinatorId !== 0) {
                            $scope.CoordinatorObj.IsshowCordinatorSummary = true;
                        } else {
                            $scope.CoordinatorObj.IsshowCordinatorSummary = false;
                        }

                        if ($scope.CoordinatorObj.IsshowCordinatorEdit) {
                            $scope.CoordinatorObj.IsshowCordinatorSummary = false;
                        };
                        if (resp[1].data.rows[0].PreAdmCoOrdinatorDetails.length > 0) {
                            $scope.LogObj.CoordinatorQuestionsList = [];
                            angular.forEach(resp[1].data.rows[0].PreAdmCoOrdinatorDetails, function (Aitem) {
                                angular.forEach($scope.CoordinatorObj.CoordinatorQuestionsList, function (Bitem) {
                                    if (Bitem.QuestionId == Aitem.CoOrdinatorQuestionId) {
                                        Bitem.PreAdmCoOrdinatorDetailId = Aitem.PreAdmCoOrdinatorDetailId || 0;
                                        Bitem.OdValue = Aitem.ODValue;
                                        Bitem.OsValue = Aitem.OSValue;
                                        Bitem.Notes = Aitem.Notes || '';

                                        if (Bitem.Notes !== '') {
                                            Bitem.IsSubDataAdded = true;
                                        }

                                        if (Bitem.Notes !== '') {
                                            Bitem.ShowNotesInd = true;
                                        }

                                        if (Aitem.CoOrdinatorQuestionValues.length > 0) {
                                            angular.forEach(Aitem.CoOrdinatorQuestionValues, function (citem) {
                                                angular.forEach(Bitem.CoOrdinatorQuestionValues, function (ditem) {
                                                    if (citem.QuestionValueId == ditem.QuestionValueId) {
                                                        ditem.CoOrdinatorValueDetailId = citem.CoOrdinatorValueDetailId || 0;
                                                        ditem.IsChecked = true;
                                                        Bitem.IsSubDataAdded = true;
                                                        if (citem.QuestionValueId == 4 || citem.QuestionValueId == 33) {
                                                            Bitem.IsShowSubData = true;
                                                        }
                                                    }
                                                })
                                                
                                            })
                                        }
                                    }
                                });
                            });
                        }
                       
                        var VisionChallengesArray1 = $filter("filter")($scope.CoordinatorObj.CoordinatorQuestionsList, function (item) { return item.TypeId == 1 && (item.OdValue !== '' || item.OsValue !== '') });
                        var VisualDiscomfortArray1 = $filter("filter")($scope.CoordinatorObj.CoordinatorQuestionsList, function (item) { return item.TypeId == 2 && (item.OdValue !== '' || item.OsValue !== '') });
                        var CounsellingDetails = $filter("filter")($scope.CoordinatorObj.CoordinatorQuestionsList, function (item) { return item.TypeId == 3});
                        var CoordinatorDetails = $filter("filter")($scope.CoordinatorObj.CoordinatorQuestionsList, function (item) { return item.TypeId == 4});

                        if (VisionChallengesArray1.length > 0) {
                            $scope.CoordinatorObj.IsVisionChallengeDataAdded = true;
                        } else {
                            $scope.CoordinatorObj.IsVisionChallengeDataAdded = false;
                        };

                        if (VisualDiscomfortArray1.length > 0) {
                            $scope.CoordinatorObj.IsVisionDiscomfortDataAdded = true;
                        } else {
                            $scope.CoordinatorObj.IsVisionDiscomfortDataAdded = false;
                        };

                        if (CounsellingDetails.length > 0) {
                            let Counsellingcount = 0;
                            angular.forEach(CounsellingDetails, function (aitem) {
                                if (aitem.Notes !== '') {
                                    Counsellingcount++;
                                }
                                if (aitem.CoOrdinatorQuestionValues.length > 0) {
                                    angular.forEach(aitem.CoOrdinatorQuestionValues, function (bitem) {
                                        if (bitem.IsChecked) {
                                            Counsellingcount++;
                                        }
                                    });
                                }
                            });
                            if (Counsellingcount > 0) {
                                $scope.CoordinatorObj.IsCounsellingDataAdded = true;
                            } else {
                                $scope.CoordinatorObj.IsCounsellingDataAdded = false;
                            };
                        } 

                        if (CoordinatorDetails.length > 0) {
                            let Coordinatorcount = 0;
                            angular.forEach(CoordinatorDetails, function (aitem) {
                                if (aitem.Notes !== '') {
                                    Coordinatorcount++;
                                }
                                if (aitem.CoOrdinatorQuestionValues.length > 0) {
                                    angular.forEach(aitem.CoOrdinatorQuestionValues, function (bitem) {
                                        if (bitem.IsChecked) {
                                            Coordinatorcount++;
                                        }
                                    });
                                }
                            });
                            if (Coordinatorcount > 0) {
                                $scope.CoordinatorObj.IsCoordinatorDataAdded = true;
                            } else {
                                $scope.CoordinatorObj.IsCoordinatorDataAdded = false;
                            };
                        }

                        if ($scope.CoordinatorObj.InternalCoManagerNotes !== '' || $scope.CoordinatorObj.ExternalCoManagerNotes !== '') {
                            $scope.CoordinatorObj.IsCoManagerNotesAdded = true;
                        }

                        let validCoordinatorChecklist = $filter('filter')(CoordinatorDetails, function (item) {
                            return item.PreAdmCoOrdinatorDetailId != 0;
                        });
                        let validCounsellingDetails = $filter('filter')(CounsellingDetails, function (item) {
                            return item.PreAdmCoOrdinatorDetailId != 0;
                        });
                        $scope.LogObj.CoordinatorVisionChallengesList = angular.copy(VisionChallengesArray1);
                        $scope.LogObj.CoordinatorVisionDiscomfortList = angular.copy(VisualDiscomfortArray1);
                        $scope.LogObj.CoordinatorChecklist = angular.copy(validCoordinatorChecklist);
                        $scope.LogObj.CounsellingDetails = angular.copy(validCounsellingDetails);
                      

                    };
                };
                $scope.initOrgLogo();
            });
        };

        $scope.init();

        $scope.OnAnswerSelect = function (item,Ans,organ) {
            if (organ == 'Od') {
                if (item.OdValue == 'Yes' && Ans == 'Yes') {
                    item.OdValue = '';
                } else if (item.OdValue == 'No' && Ans == 'No') {
                    item.OdValue = '';
                } else {
                    item.OdValue = Ans;
                }
                if (item.TypeId == 1) {
                    $scope.CoordinatorObj.VisionChallengesODAllCheck = '';
                } else if (item.TypeId == 2) {
                    $scope.CoordinatorObj.VisualDiscomfortODAllCheck = '';
                }

            } else if (organ == 'Os') {
                if (item.OsValue == 'Yes' && Ans == 'Yes') {
                    item.OsValue = '';
                } else if (item.OsValue == 'No' && Ans == 'No') {
                    item.OsValue = '';
                } else {
                    item.OsValue = Ans;
                }
                if (item.TypeId == 1) {
                    $scope.CoordinatorObj.VisionChallengesOSAllCheck = '';
                } else if (item.TypeId == 2) {
                    $scope.CoordinatorObj.VisualDiscomfortOSAllCheck = '';
                }
            }
        };

        $scope.OnSelectAllInQuestions = function (value,Organ,Type) {
            if (Type == 1) {
                if (Organ == 'OD') {
                    $scope.CoordinatorObj.VisionChallengesODAllCheck = value;
                    angular.forEach($scope.CoordinatorObj.CoordinatorQuestionsList, function (Aitem) {
                        if (Aitem.TypeId == 1) {
                            Aitem.OdValue = value;
                        }
                    });
                } else if (Organ == 'OS') {
                    $scope.CoordinatorObj.VisionChallengesOSAllCheck = value;
                    angular.forEach($scope.CoordinatorObj.CoordinatorQuestionsList, function (Bitem) {
                        if (Bitem.TypeId == 1) {
                            Bitem.OsValue = value;
                        }
                    });
                }
            } else if (Type == 2) {
                if (Organ == 'OD') {
                    $scope.CoordinatorObj.VisualDiscomfortODAllCheck = value;
                    angular.forEach($scope.CoordinatorObj.CoordinatorQuestionsList, function (Citem) {
                        if (Citem.TypeId == 2) {
                            Citem.OdValue = value;
                        }
                    });
                } else if (Organ == 'OS') {
                    $scope.CoordinatorObj.VisualDiscomfortOSAllCheck = value;
                    angular.forEach($scope.CoordinatorObj.CoordinatorQuestionsList, function (Ditem) {
                        if (Ditem.TypeId == 2) {
                            Ditem.OsValue = value;
                        }
                    });
                }
            }
        };

        $scope.SaveCoOrdinatorData = function (str) {

            $scope.LogObj.LogArray = [];
            var CoordinatorList = [];
            angular.forEach($scope.CoordinatorObj.CoordinatorQuestionsList, function (item) {
                var TempArray = [];
                //var QuestionValueId = 0;
                //var Value = '';
                if (item.CoOrdinatorQuestionValues.length > 0) {
                    angular.forEach(item.CoOrdinatorQuestionValues, function (titem) {
                        if (titem.IsChecked || titem.CoOrdinatorValueDetailId !== 0) {
                            if (!titem.IsChecked && titem.CoOrdinatorValueDetailId !== 0) {
                                titem.DeleteInd = 'Y';
                            }
                            TempArray.push(titem);
                        }
                    });
                    item.CoOrdinatorQuestionValues = angular.copy(TempArray) || [];
                }

                if (item.OdValue !== '' || item.OsValue !== '' || item.PreAdmCoOrdinatorDetailId !== 0 || TempArray.length > 0 || item.Notes !=='') {
                    CoordinatorList.push(item);
                }
            })

            $scope.CoordinatorObj.IsClickSaveCoordinatortBtn = true;
            let reqObj = {
                "VisitId": $scope.cacheStorageItem.PatientVisitId || 0,
                "PreAdmCoOrdinatorId": $scope.CoordinatorObj.PreAdmCoOrdinatorId || 0,
                "OrganizationId": $scope.HospitalId || 0,
                "UserId": $scope.UserId || 0,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
                "AppointmentDate": $filter('date')(new Date(), "yyyy-MM-dd"),
                "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId || 0,
                "CoordinatorChartStatus": (str === "SignOff") ? "E" : $scope.CoordinatorObj.CoordinatorChartStatus,
                "StatusFlag": $scope.CoordinatorObj.StatusFlag || "D",
                "CoordinatorList": CoordinatorList || [],
                "CoordinatorNotes": $scope.CoordinatorObj.CoordinatorNotes || '',
                "InternalCoManagerNotes": $scope.CoordinatorObj.InternalCoManagerNotes || '',
                "ExternalCoManagerNotes": $scope.CoordinatorObj.ExternalCoManagerNotes || '',
                "ClearanceDoctorName": $scope.CoordinatorObj.ClearanceDoctorName || '',
                "ClearanceReqDate": $scope.CoordinatorObj.ClearanceReqDate || null,
                "ClearanceRecievedDate": $scope.CoordinatorObj.ClearanceRecievedDate || null,
                "DispensedByUserId": $scope.CoordinatorObj.DispensedByUserId || null,
                "DispenseDate": $scope.CoordinatorObj.DispenseDate || null,
                "DispenseTime": $scope.CoordinatorObj.DispenseTime || '',
                "Logs": {},
            };

            var VisionChallengeslist = $filter("filter")(reqObj.CoordinatorList, function (item) { return item.TypeId == 1});
            var VisualDiscomfortlist = $filter("filter")(reqObj.CoordinatorList, function (item) { return item.TypeId == 2 });
            var CounsellingDetails = $filter("filter")(reqObj.CoordinatorList, function (item) { return item.TypeId == 3 });
            var CoordinatorChecklist = $filter("filter")(reqObj.CoordinatorList, function (item) { return item.TypeId == 4  });
        
            if (VisionChallengeslist.length > 0 || $scope.LogObj.CoordinatorVisionChallengesList.length > 0) {

                let ActionType = '';
                let OldAffecteditem = '';
                let NewAffecteditem = '';

                if ($scope.LogObj.CoordinatorVisionChallengesList.length === 0) {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }

                if ($scope.LogObj.CoordinatorVisionChallengesList.length > 0) {
                    angular.forEach(VisionChallengeslist, function (Aitem) {
                        var oldItem = $scope.LogObj.CoordinatorVisionChallengesList.find(function (Bitem) {
                            return Bitem.QuestionId === Aitem.QuestionId;
                        });

                        if (oldItem) {
                            var odChanged = Aitem.OdValue !== oldItem.OdValue;
                            var osChanged = Aitem.OsValue !== oldItem.OsValue;

                            if (odChanged || osChanged) {

                                // --- OLD LOG ---
                                var oldParts = [];
                                if (odChanged && oldItem.OdValue) oldParts.push('OD - ' + oldItem.OdValue);
                                if (osChanged && oldItem.OsValue) oldParts.push('OS - ' + oldItem.OsValue);

                                if (odChanged && !oldItem.OdValue) oldParts.push('OD -');
                                if (osChanged && !oldItem.OsValue) oldParts.push('OS -');

                                if (oldParts.length > 0) {
                                    OldAffecteditem += (oldItem.Description ? oldItem.Description + ' ' : '') + oldParts.join(', ') + '\n';
                                }

                                // --- NEW LOG ---
                                var newParts = [];
                                if (odChanged && Aitem.OdValue) newParts.push('OD - ' + Aitem.OdValue);
                                if (osChanged && Aitem.OsValue) newParts.push('OS - ' + Aitem.OsValue);

                                if (odChanged && !Aitem.OdValue) newParts.push('OD -');
                                if (osChanged && !Aitem.OsValue) newParts.push('OS -');

                                if (newParts.length > 0) {
                                    NewAffecteditem += (Aitem.Description ? Aitem.Description + ' ' : '') + newParts.join(', ') + '\n';
                                }
                            }
                        }
                        else if (Aitem.OdValue || Aitem.OsValue) {
                            var newParts = [];
                            if (Aitem.OdValue) newParts.push('OD - ' + Aitem.OdValue);
                            if (Aitem.OsValue) newParts.push('OS - ' + Aitem.OsValue);
                            NewAffecteditem += (Aitem.Description ? Aitem.Description + ' ' : '') + newParts.join(', ') + '\n';
                        }
                    });
                }
                 else if (VisionChallengeslist.length > 0) {

                    angular.forEach(VisionChallengeslist, function (Aitem) {
                        let existsInOldList = $scope.LogObj.CoordinatorVisionChallengesList.some(function (b) {
                            return b.QuestionId === Aitem.QuestionId;
                        });

                        if (!existsInOldList) {
                          
                            if (Aitem.OdValue || Aitem.OsValue) {
                                var newParts = [];
                                if (Aitem.OdValue) {
                                    newParts.push('OD - ' + Aitem.OdValue);
                                }
                                if (Aitem.OsValue) {
                                    newParts.push('OS - ' + Aitem.OsValue);
                                }
                                NewAffecteditem += ' ' + (Aitem.Description ? Aitem.Description + ' ' : '') + newParts.join(', ') + '\n';
                            }

                        }
                    });
                }

                if (NewAffecteditem !== '' || OldAffecteditem !== '') {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 3,
                        "ModuleName": "Pre Admission",
                        "SubModuleId": 36,
                        "SubModuleName": "Coordinator",
                        "ScreenType": "Vision Challenges in Daily Activities",
                        "ActionType": ActionType,
                        "OldActionDescription": OldAffecteditem,
                        "NewActionDescription": NewAffecteditem,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                    };

                    $scope.LogObj.LogArray.push(obj);
                }
            }

            if (VisualDiscomfortlist.length > 0 || $scope.LogObj.CoordinatorVisionDiscomfortList.length > 0) {

                let ActionType = '';
                let OldAffecteditem = '';
                let NewAffecteditem = '';

                if ($scope.LogObj.CoordinatorVisionDiscomfortList.length === 0) {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }

                if ($scope.LogObj.CoordinatorVisionDiscomfortList.length > 0) {
                    angular.forEach(VisualDiscomfortlist, function (Aitem) {


                        var oldItemList = $filter('filter')($scope.LogObj.CoordinatorVisionDiscomfortList, function (Bitem) {
                            return Bitem.QuestionId === Aitem.QuestionId;
                        });

                        var oldItem = oldItemList.length > 0 ? oldItemList[0] : null;

                        if (oldItem) {
                            var odChanged = Aitem.OdValue !== oldItem.OdValue;
                            var osChanged = Aitem.OsValue !== oldItem.OsValue;

                            if (odChanged || osChanged) {

                                // --- OLD LOG ---
                                var oldParts = [];
                                if (odChanged && oldItem.OdValue) {
                                    oldParts.push('OD - ' + oldItem.OdValue);
                                }
                                if (osChanged && oldItem.OsValue) {
                                    oldParts.push('OS - ' + oldItem.OsValue);
                                }

                                // If value was removed
                                if (odChanged && !oldItem.OdValue) {
                                    oldParts.push('OD -');
                                }
                                if (osChanged && !oldItem.OsValue) {
                                    oldParts.push('OS -');
                                }

                                if (oldParts.length > 0) {
                                    OldAffecteditem += (oldItem.Description ? oldItem.Description + ' ' : '') + oldParts.join(', ') + '\n';
                                }

                                // --- NEW LOG ---
                                var newParts = [];
                                if (odChanged && Aitem.OdValue) {
                                    newParts.push('OD - ' + Aitem.OdValue);
                                }
                                if (osChanged && Aitem.OsValue) {
                                    newParts.push('OS - ' + Aitem.OsValue);
                                }

                                // If value was cleared (removed)
                                if (odChanged && !Aitem.OdValue) {
                                    newParts.push('OD -');
                                }
                                if (osChanged && !Aitem.OsValue) {
                                    newParts.push('OS -');
                                }

                                if (newParts.length > 0) {
                                    NewAffecteditem += (Aitem.Description ? Aitem.Description + ' ' : '') + newParts.join(', ') + '\n';
                                }
                            }
                        }
                        // --- Newly Added Item ---
                        else if (Aitem.OdValue || Aitem.OsValue) {
                            var newParts = [];
                            if (Aitem.OdValue) {
                                newParts.push('OD - ' + Aitem.OdValue);
                            }
                            if (Aitem.OsValue) {
                                newParts.push('OS - ' + Aitem.OsValue);
                            }
                            NewAffecteditem += (Aitem.Description ? Aitem.Description + ' ' : '') + newParts.join(', ') + '\n';
                        }
                    });
                }

                else if (VisualDiscomfortlist.length > 0) {

                    angular.forEach(VisualDiscomfortlist, function (Aitem) {
                        let existsInOldList = $scope.LogObj.CoordinatorVisionDiscomfortList.some(function (b) {
                            return b.QuestionId === Aitem.QuestionId;
                        });

                        if (!existsInOldList) {
                            if (Aitem.OdValue || Aitem.OsValue) {
                                var newParts = [];

                                if (Aitem.OdValue) {
                                    newParts.push('OD - ' + Aitem.OdValue);
                                }

                                if (Aitem.OsValue) {
                                    newParts.push('OS - ' + Aitem.OsValue);
                                }

                                NewAffecteditem += ' ' +(Aitem.Description ? Aitem.Description + ' ' : '') + newParts.join(', ') + '\n';
                            }

                        }
                    });
                }

                if (NewAffecteditem !== '' || OldAffecteditem !== '') {

                    let obj = {
                        "LogId": 0,
                        "ModuleId": 3,
                        "ModuleName": "Pre Admission",
                        "SubModuleId": 36,
                        "SubModuleName": "Coordinator",
                        "ScreenType": "Visual Discomfort Symptoms",
                        "ActionType": ActionType,
                        "OldActionDescription": OldAffecteditem,
                        "NewActionDescription": NewAffecteditem,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };

                    $scope.LogObj.LogArray.push(obj);
                }
            }

            if (CoordinatorChecklist.length > 0 || $scope.LogObj.CoordinatorChecklist.length > 0) {

                var ActionType = '';
                var OldAffecteditem = '';
                var NewAffecteditem = '';

                if ($scope.LogObj.CoordinatorChecklist.length === 0) {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }

                if ($scope.LogObj.CoordinatorChecklist.length > 0) {
                    angular.forEach(CoordinatorChecklist, function (Aitem) {
                        angular.forEach($scope.LogObj.CoordinatorChecklist, function (Bitem) {
                            if (Aitem.QuestionId !== Bitem.QuestionId) return;

                            let newVals = Aitem.CoOrdinatorQuestionValues || [];
                            let oldVals = Bitem.CoOrdinatorQuestionValues || [];
                            let desc = Aitem.Description || '';

                            let newMap = {};
                            angular.forEach(newVals, function (nv) {
                                if (nv.IsChecked === true) {
                                    newMap[nv.QuestionValueId] = nv;
                                }
                            });

                            let oldMap = {};
                            angular.forEach(oldVals, function (ov) {
                                if (ov.CoOrdinatorValueDetailId != 0) {
                                    oldMap[ov.QuestionValueId] = ov;
                                }
                            });

                            let newCheckedCount = 0;
                            let oldCheckedCount = 0;

                            angular.forEach(newVals, function (v) {
                                if (v.IsChecked) newCheckedCount++;
                            });

                            angular.forEach(oldVals, function (v) {
                                if (v.CoOrdinatorValueDetailId != 0) oldCheckedCount++;
                            });

                            angular.forEach(newVals, function (nv) {
                                if (!nv.IsChecked) return;
                                var oldValueObj = oldMap[nv.QuestionValueId];
                                var newValue = nv.Value || '';
                                if (!oldValueObj) {
                                    if (NewAffecteditem) NewAffecteditem += '\n';
                                    NewAffecteditem += desc + (newValue ? ' - ' + newValue : '');
                                }
                            });

                            if (newCheckedCount === 0 && oldCheckedCount > 0) {
                                if (NewAffecteditem) NewAffecteditem += '\n';
                                NewAffecteditem += desc;
                            }

                            angular.forEach(oldVals, function (ov) {
                                if (ov.CoOrdinatorValueDetailId != 0 && !newMap[ov.QuestionValueId]) {
                                    if (OldAffecteditem) OldAffecteditem += '\n';
                                    OldAffecteditem += desc + ' - ' + (ov.Value || '');
                                }
                            });

                            let oldNotes = (Bitem.Notes || '').trim();
                            let newNotes = (Aitem.Notes || '').trim();

                            if (oldNotes !== newNotes) {
                                if (oldNotes) {
                                    if (OldAffecteditem) OldAffecteditem += '\n';
                                    OldAffecteditem += 'Notes: ' + desc + ' - ' + oldNotes;
                                }
                                if (newNotes) {
                                    if (NewAffecteditem) NewAffecteditem += '\n';
                                    NewAffecteditem += 'Notes: ' + desc + ' - ' + newNotes;
                                }
                            }
                            if (Aitem.QuestionId === 29) {

                                let oldDispensedBy = '';
                                let newDispensedBy = '';

                                if ($scope.LogObj.DispensedByUserId) {
                                    let oldUser = $scope.CoordinatorObj.DispanseUsersList.find(function (u) {
                                        return u.DoctorID === $scope.LogObj.DispensedByUserId;
                                    });
                                    if (oldUser) {
                                        oldDispensedBy = oldUser.FullName;
                                    }
                                }

                                if (reqObj.DispensedByUserId) {
                                    let newUser = $scope.CoordinatorObj.DispanseUsersList.find(function (u) {
                                        return u.DoctorID === reqObj.DispensedByUserId;
                                    });
                                    if (newUser) {
                                        newDispensedBy = newUser.FullName;
                                    }
                                }

                                let oldReqDate = ($scope.LogObj.DispenseDate || '').trim();
                                let newReqDate = (reqObj.DispenseDate || '').trim();

                                let oldRecDate = ($scope.LogObj.DispenseTime || '').trim();
                                let newRecDate = (reqObj.DispenseTime || '').trim();


                                if (oldDispensedBy !== newDispensedBy) {
                                    if (oldDispensedBy) {
                                        if (OldAffecteditem) OldAffecteditem += '\n';
                                        OldAffecteditem += 'Dispensed By: ' + oldDispensedBy;
                                    }
                                    if (newDispensedBy) {
                                        if (NewAffecteditem) NewAffecteditem += '\n';
                                        NewAffecteditem += 'Dispensed By: ' + newDispensedBy;
                                    }
                                }

                               
                                if (oldReqDate !== newReqDate) {
                                    if (oldReqDate) {
                                        if (OldAffecteditem) OldAffecteditem += '\n';
                                        OldAffecteditem += 'Dispense Date: ' + oldReqDate;
                                    }
                                    if (newReqDate) {
                                        if (NewAffecteditem) NewAffecteditem += '\n';
                                        NewAffecteditem += 'Dispense Date: ' + newReqDate;
                                    }
                                }

                                
                                if (oldRecDate !== newRecDate) {
                                    if (oldRecDate) {
                                        if (OldAffecteditem) OldAffecteditem += '\n';
                                        OldAffecteditem += 'Dispense Time: ' + oldRecDate;
                                    }
                                    if (newRecDate) {
                                        if (NewAffecteditem) NewAffecteditem += '\n';
                                        NewAffecteditem += 'Dispense Time: ' + newRecDate;
                                    }
                                }
                            }
                        });
                    });
                }
                else if (CoordinatorChecklist.length > 0) {
                    angular.forEach(CoordinatorChecklist, function (Aitem) {
                        let parts = [];

                        if (Aitem.CoOrdinatorQuestionValues && Aitem.CoOrdinatorQuestionValues.length > 0) {
                            angular.forEach(Aitem.CoOrdinatorQuestionValues, function (Aq) {
                                if (Aq.IsChecked === true) {
                                    parts.push((Aitem.Description ? Aitem.Description + ' - ' : '') + (Aq.Value || ''));
                                }
                            });
                        }

                        if (Aitem.QuestionId === 29) {
                            if (reqObj.DispensedByUserId) {
                                let user = $scope.CoordinatorObj.DispanseUsersList.find(function (u) {
                                    return u.DoctorID === reqObj.DispensedByUserId;
                                });
                                if (user) {
                                    parts.push('Dispensed By: ' + user.FullName); 
                                }
                            }

                            if (reqObj.DispenseDate) {
                                parts.push('Dispense Date: ' + reqObj.DispenseDate);
                            }
                            if (reqObj.DispenseTime) {
                                parts.push('Dispense Time: ' + reqObj.DispenseTime);
                            }
                        }

                        if (Aitem.Notes) {
                            parts.push('Notes: ' + Aitem.Description + ' - ' + Aitem.Notes);
                        }

                        if (parts.length > 0) {
                            if (NewAffecteditem) NewAffecteditem += '\n ';
                            NewAffecteditem += parts.join('\n');
                        }
                    });
                }

                if (NewAffecteditem !== '' || OldAffecteditem !== '') {
                    var obj = {
                        "LogId": 0,
                        "ModuleId": 3,
                        "ModuleName": "Pre Admission",
                        "SubModuleId": 36,
                        "SubModuleName": "Coordinator",
                        "ScreenType": "Coordinator Checklist",
                        "ActionType": ActionType,
                        "OldActionDescription": OldAffecteditem,
                        "NewActionDescription": NewAffecteditem,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                    };

                    $scope.LogObj.LogArray.push(obj);
                }
            }
            if (CounsellingDetails.length > 0 || $scope.LogObj.CounsellingDetails.length > 0) {

                let ActionType = '';
                let OldAffecteditem = '';
                let NewAffecteditem = '';

                if ($scope.LogObj.CounsellingDetails.length === 0) {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }
                // Compare and detect differences between old and new lists
                if ($scope.LogObj.CounsellingDetails.length > 0) {
                    angular.forEach(CounsellingDetails, function (Aitem) {
                        angular.forEach($scope.LogObj.CounsellingDetails, function (Bitem) {

                            if (Aitem.QuestionId !== Bitem.QuestionId) return;

                            let newVals = Aitem.CoOrdinatorQuestionValues || [];
                            let oldVals = Bitem.CoOrdinatorQuestionValues || [];
                            let desc = Aitem.Description || '';

                            let newMap = {};
                            angular.forEach(newVals, function (nv) {
                                if (nv.IsChecked === true) {
                                    newMap[nv.Value] = nv;
                                }
                            });

                            let oldMap = {};
                            angular.forEach(oldVals, function (ov) {
                                if (ov.CoOrdinatorValueDetailId != 0) {
                                    oldMap[ov.Value] = ov;
                                }
                            });

                            let newCheckedCount = 0;
                            let oldCheckedCount = 0;

                            angular.forEach(newVals, function (v) {
                                if (v.IsChecked) newCheckedCount++;
                            });

                            angular.forEach(oldVals, function (v) {
                                if (v.CoOrdinatorValueDetailId != 0) oldCheckedCount++;
                            });

                            angular.forEach(newVals, function (nv) {
                                if (!nv.IsChecked) return;

                                let oldValueObj = oldMap[nv.Value];
                                let newValue = nv.Value || '';
                                 if (!oldValueObj) {
                                    if (NewAffecteditem) NewAffecteditem += '\n';
                                    NewAffecteditem += desc + ' - ' + newValue;
                                }
                            });


                            if (newCheckedCount === 0 && oldCheckedCount > 0) {
                                if (NewAffecteditem) NewAffecteditem += '\n';
                                NewAffecteditem += desc;
                            }


                            angular.forEach(oldVals, function (ov) {
                                if (ov.CoOrdinatorValueDetailId != 0 && !newMap[ov.Value]) {
                                    if (OldAffecteditem) OldAffecteditem += '\n';
                                    OldAffecteditem += desc + ' - ' + (ov.Value || '');
                                }
                            });


                            let oldNotes = (Bitem.Notes || '').trim();
                            let newNotes = (Aitem.Notes || '').trim();

                            if (oldNotes !== newNotes) {
                                if (oldNotes) {
                                    if (OldAffecteditem) OldAffecteditem += '\n';
                                    OldAffecteditem += 'Notes: ' + desc + ' - ' + oldNotes;
                                }
                                if (newNotes) {
                                    if (NewAffecteditem) NewAffecteditem += '\n';
                                    NewAffecteditem += 'Notes: ' + desc + ' - ' + newNotes;
                                }
                            }


                            if (Aitem.QuestionId === 18) {


                                let oldDocName = ($scope.LogObj.ClearanceDoctorName || '').trim();
                                let newDocName = (reqObj.ClearanceDoctorName || '').trim();
                                
                                let oldReqDate = ($scope.LogObj.ClearanceReqDate || '').trim();
                                let newReqDate = (reqObj.ClearanceReqDate || '').trim();
                                
                                let oldRecDate = ($scope.LogObj.ClearanceRecievedDate || '').trim();
                                let newRecDate = (reqObj.ClearanceRecievedDate || '').trim();


                                if (oldDocName !== newDocName) {
                                    if (oldDocName) {
                                        if (OldAffecteditem) OldAffecteditem += '\n';
                                        OldAffecteditem += 'Doctor Name: ' + oldDocName;
                                    }
                                    if (newDocName) {
                                        if (NewAffecteditem) NewAffecteditem += '\n';
                                        NewAffecteditem += 'Doctor Name: ' + newDocName;
                                    }
                                }

                                if (oldReqDate !== newReqDate) {
                                    if (oldReqDate) {
                                        if (OldAffecteditem) OldAffecteditem += '\n';
                                        OldAffecteditem += 'Date Of Request: ' + oldReqDate;
                                    }
                                    if (newReqDate) {
                                        if (NewAffecteditem) NewAffecteditem += '\n';
                                        NewAffecteditem += 'Date Of Request: ' + newReqDate;
                                    }
                                }


                                if (oldRecDate !== newRecDate) {
                                    if (oldRecDate) {
                                        if (OldAffecteditem) OldAffecteditem += '\n';
                                        OldAffecteditem += 'Date Of Received: ' + oldRecDate;
                                    }
                                    if (newRecDate) {
                                        if (NewAffecteditem) NewAffecteditem += '\n';
                                        NewAffecteditem += 'Date Of Received: ' + newRecDate;
                                    }
                                }
                            }
                        });
                    });

                }
                else if (CounsellingDetails.length > 0) {
                    angular.forEach(CounsellingDetails, function (Aitem) {

                        var parts = []; 
                        if (Aitem.CoOrdinatorQuestionValues && Aitem.CoOrdinatorQuestionValues.length > 0) {
                            angular.forEach(Aitem.CoOrdinatorQuestionValues, function (Aq) {
                                if (Aq.IsChecked === true) {
                                    parts.push((Aitem.Description ? Aitem.Description + ' - ' : '') + (Aq.Value || ''));
                                }
                            });
                        }
                        if (Aitem.QuestionId === 18) {
                            if (reqObj.ClearanceDoctorName) {
                                parts.push('Doctor Name: ' + reqObj.ClearanceDoctorName);
                            }
                            if (reqObj.ClearanceReqDate) {
                                parts.push('Date Of Request: ' + reqObj.ClearanceReqDate);
                            }
                            if (reqObj.ClearanceRecievedDate) {
                                parts.push('Date Of Received: ' + reqObj.ClearanceRecievedDate);
                            }
                        }


                        if (Aitem.Notes) {
                            parts.push('Notes: ' + Aitem.Description + ' - ' + Aitem.Notes);
                        }


                        if (parts.length > 0) {
                            if (NewAffecteditem !== '') {
                                NewAffecteditem += '\n';
                            }
                            NewAffecteditem += parts.join('\n');
                        }

                    });
                }

                if (NewAffecteditem !== '' || OldAffecteditem !== '') {
                    var obj = {
                        "LogId": 0,
                        "ModuleId": 3,
                        "ModuleName": "Pre Admission",
                        "SubModuleId": 36,
                        "SubModuleName": "",
                        "ScreenType": "Counselling Details",
                        "ActionType": ActionType,
                        "OldActionDescription": OldAffecteditem,
                        "NewActionDescription": NewAffecteditem,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                    };

                    $scope.LogObj.LogArray.push(obj);
                }
            }

            if (reqObj.InternalCoManagerNotes != '' || $scope.LogObj.InternalCoManagerNotes !== '') {
                let ActionType = ''
                if ($scope.LogObj.InternalCoManagerNotes == '') {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }
                if (reqObj.InternalCoManagerNotes != $scope.LogObj.InternalCoManagerNotes) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 3,
                        "ModuleName": "Pre Admission",
                        "SubModuleId": 36,
                        "SubModuleName": "Co-Manager Notes",
                        "ScreenType": "Internal CoManager Notes",
                        "ActionType": ActionType,
                        "OldActionDescription": $scope.LogObj.InternalCoManagerNotes,
                        "NewActionDescription": reqObj.InternalCoManagerNotes,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }
            if (reqObj.ExternalCoManagerNotes != '' || $scope.LogObj.ExternalCoManagerNotes !== '') {
                let ActionType = ''
                if ($scope.LogObj.CoordinatorNotes == '') {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }
                if (reqObj.ExternalCoManagerNotes != $scope.LogObj.ExternalCoManagerNotes) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 3,
                        "ModuleName": "Pre Admission",
                        "SubModuleId": 36,
                        "SubModuleName": "Co-Manager Notes",
                        "ScreenType": "External CoManager Notes",
                        "ActionType": ActionType,
                        "OldActionDescription": $scope.LogObj.ExternalCoManagerNotes,
                        "NewActionDescription": reqObj.ExternalCoManagerNotes,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            if (reqObj.CoordinatorNotes != '' || $scope.LogObj.CoordinatorNotes !== '') {
                let ActionType = ''
                if ($scope.LogObj.CoordinatorNotes == '') {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }
                if (reqObj.CoordinatorNotes != $scope.LogObj.CoordinatorNotes) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 3,
                        "ModuleName": "Pre Admission",
                        "SubModuleId": 36,
                        "SubModuleName": "Coordinator",
                        "ScreenType": "Pre Admission Coordinator",
                        "ActionType": ActionType,
                        "OldActionDescription": $scope.LogObj.CoordinatorNotes,
                        "NewActionDescription": reqObj.CoordinatorNotes,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            let sighnoffforlogs = str || '';
            if (sighnoffforlogs == 'SignOff') {
                let givenByUser = '';
                if ($scope.CoordinatorSignOffUserId != 0) {
                    var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.CoordinatorSignOffUserId });
                    if (ReviewedByArraylist.length > 0) {
                        givenByUser = angular.copy(ReviewedByArraylist[0].SecondUserFullName) +
                            (ReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(ReviewedByArraylist[0].LicenseNumber) : "");
                    }

                    let obj = {
                        "LogId": 0,
                        "ModuleId": 3,
                        "ModuleName": "Pre Admission",
                        "SubModuleId": 36,
                        "SubModuleName": "Coordinator",
                        "ScreenType": "Signed off",
                        "ActionType": "Signed off",
                        "OldActionDescription": '',
                        "NewActionDescription": `Pre-Admission(Coordinator) signed off by ${givenByUser}`,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }
            if ($scope.LogObj.LogArray.length > 0) {
                reqObj.Logs = $scope.LogObj || {};
            }
            eHnoteSurgeryService.AddUpdatePreAdmCoOrdinatorDetails(reqObj).then(function (response) {
                if (response.data.status === "Success") {
                    $scope.CoordinatorObj.IsClickSaveCoordinatortBtn = false;
                    alertify.success("CoOrdinator data saved successfully!");
                    $scope.CoordinatorObj.IsshowCordinatorEdit = false;
                    $scope.init();
                } else {
                    $scope.CoordinatorObj.IsClickSaveCoordinatortBtn = false;
                    alertify.error("Some Error Occured");
                }
            }, function () {

            });
        };

        $scope.NavtoEditCoordinateData = function () {
            $scope.CoordinatorObj.IsshowCordinatorSummary = false;
            $scope.CoordinatorObj.IsshowCordinatorEdit = true;
            $scope.init();
        };

        $scope.CoordinatorPrint = function () {

            let obj = {
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId
            };

            eHnoteSurgeryService.GetOTQuickAccessDetails(obj).then(function (resp) {
                if (resp.data.status === "Success") {

                    $scope.OrganizationDetails = resp.data.OrganizationDetails || [];
                    if ($scope.OrganizationDetails.length && $scope.OrganizationDetails[0]?.OrganizationLogoUrl) {
                        $scope.toDataURL($scope.OrganizationDetails[0].OrganizationLogoUrl, function (dataURL) {
                            $scope.$applyAsync(() => {
                                $scope.OrganizationDetails[0].OrganizationLogoUrl = dataURL;
                                $scope.generateCoordinatorPrint();
                            });
                        });
                    } else {
                        $scope.generateCoordinatorPrint();
                    }
                }
            });
        };

        $scope.generateCoordinatorPrint = function () {
            let CreatedByName = "";
            var CreatedByArray = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.UserId });
            if (CreatedByArray.length > 0) {
                if (CreatedByArray[0].SuffixName !== '') {
                    CreatedByName = CreatedByName + CreatedByArray[0].FullName + ' ' + CreatedByArray[0].SuffixName || "";
                } else {
                    CreatedByName = CreatedByArray[0].FullName || "";
                }
            }
            var VisionChallengesArray = $filter("filter")($scope.CoordinatorObj.CoordinatorQuestionsList, function (item) { return item.TypeId == 1 && (item.OdValue !== '' || item.OsValue !== '')});
            var VisualDiscomfortArray = $filter("filter")($scope.CoordinatorObj.CoordinatorQuestionsList, function (item) { return item.TypeId == 2 && (item.OdValue !== '' || item.OsValue !== '')});
            var CounsellingDetailsArray = $filter("filter")($scope.CoordinatorObj.CoordinatorQuestionsList, function (item) { return item.TypeId == 3});
            var CoOrdinatorDetailsArray = $filter("filter")($scope.CoordinatorObj.CoordinatorQuestionsList, function (item) { return item.TypeId == 4});

            var CounsellingDetailsArray1 = [];
            var CoOrdinatorDetailsArray1 = [];

            if (CounsellingDetailsArray.length > 0) {
                angular.forEach(CounsellingDetailsArray, function (aitem) {
                    let Counsellingcount = 0;
                    if (aitem.Notes !== '') {
                        Counsellingcount++;
                    }
                    if (aitem.CoOrdinatorQuestionValues.length > 0) {
                        angular.forEach(aitem.CoOrdinatorQuestionValues, function (bitem) {
                            if (bitem.IsChecked) {
                                Counsellingcount++;
                            }
                        });
                    }
                    if (Counsellingcount > 0) {
                        CounsellingDetailsArray1.push(aitem);
                    };
                });
            }

            if (CoOrdinatorDetailsArray.length > 0) {
                angular.forEach(CoOrdinatorDetailsArray, function (aitem) {
                    let Coordinatorcount = 0;
                    if (aitem.Notes !== '') {
                        Coordinatorcount++;
                    }
                    if (aitem.CoOrdinatorQuestionValues.length > 0) {
                        angular.forEach(aitem.CoOrdinatorQuestionValues, function (bitem) {
                            if (bitem.IsChecked) {
                                Coordinatorcount++;
                            }
                        });
                    }
                    if (Coordinatorcount > 0) {
                        CoOrdinatorDetailsArray1.push(aitem);
                    };
                });
            }

            var Object = {
                "CreatedBy": CreatedByName,
                "Name": $scope.cacheStorageItem.PatientName || '',
                "Age": $scope.cacheStorageItem.Age || '',
                "PatientDOB": $scope.cacheStorageItem.PatientDOB || '',
                "Gender": $scope.cacheStorageItem.Gender || '',
                "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayId || '',
                "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                "EhnoteLogoURL": $scope.HeaderLogo || '',
                "VisionChallengesArray": VisionChallengesArray || [],
                "VisualDiscomfortArray": VisualDiscomfortArray || [],
                "CounsellingDetailsArray": CounsellingDetailsArray1 || [],
                "CoOrdinatorDetailsArray": CoOrdinatorDetailsArray1 || [],
                "CoordinatorNotes": $scope.CoordinatorObj.CoordinatorNotes || '',
                "InternalCoManagerNotes": $scope.CoordinatorObj.InternalCoManagerNotes || '',
                "ExternalCoManagerNotes": $scope.CoordinatorObj.ExternalCoManagerNotes || '',
                "ClearanceDoctorName": $scope.CoordinatorObj.ClearanceDoctorName || '',
                "ClearanceReqDate": $scope.CoordinatorObj.ClearanceReqDate || null,
                "ClearanceRecievedDate": $scope.CoordinatorObj.ClearanceRecievedDate || null,
                "DispensedByUserName": $scope.CoordinatorObj.DispensedByUserName || '',
                "DispenseDate": $scope.CoordinatorObj.DispenseDate || null,
                "DispenseTime": $scope.CoordinatorObj.DispenseTime || '',
                "SignOffUserDetails": $scope.CoordinatorObj.LastSignOffUserDetails || [],
                "CoordinatorChartStatus": $scope.CoordinatorObj.CoordinatorChartStatus || '',
                "OrganizationDetails": $scope.OrganizationDetails || [],
                "EhnoteOrganisationLogoUrl": $scope.OrganizationDetails?.[0]?.OrganizationLogoUrl || '',
            }
            USPrintService.GeneratePreAdmCoOrdinatorPrint(Object);
        }

        $scope.CoordinatorSignOffUserId = 0;
        $scope.CoordinatorSignOff = function (str) {
            str = str || 'SignOff';
            let obj = {
                "Screen": "Coordinator PreAdmission",
                "Type": str,
                "UserType": "Coordinator",
                "allUserList": angular.copy($scope.allUserList) || [],
            };

            let signmodalInstance = $uibModal.open({
                "templateUrl": "templates/consultation/SignOffPasswordNew.html",
                "controller": "UsSignOffPasswordPopupCtrl",
                "windowClass": " ",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "obj": function () { return obj; }
                }
            });
            signmodalInstance.result.then(function (resp) {
                $scope.CoordinatorSignOffUserId = resp.DoctorId || 0;
                $scope.SaveCoOrdinatorData(str);
            }, function (data) {

            });
        };

        $scope.UnsignCoordinatorScreen = function () {
            let obj = {
                "Screen": 'Coordinator PreAdmission',
                "Type": "Unsign",
                "UserType": "Coordinator",
                "allUserList": angular.copy($scope.allUserList) || [],
            };

            let signmodalInstance = $uibModal.open({
                "templateUrl": "templates/consultation/SignOffPasswordNew.html",
                "controller": "UsSignOffPasswordPopupCtrl",
                "size": "md",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "obj": function () { return obj; }
                }
            });
            signmodalInstance.result.then(function (resp) {
                let UnsignDoctorID = resp.DoctorId || 0;
                let givenByUser = '';
                let UnsignRemarks = resp.Remarks || '';
                $scope.LogObj.LogArray = [];
                if (UnsignDoctorID != 0) {
                    var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == UnsignDoctorID });
                    if (ReviewedByArraylist.length > 0) {
                        givenByUser = angular.copy(ReviewedByArraylist[0].SecondUserFullName) +
                            (ReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(ReviewedByArraylist[0].LicenseNumber) : "");
                    }

                    if (UnsignRemarks) {
                        givenByUser += `, Notes: ${UnsignRemarks}`;
                    }

                    $scope.LogObj.LogArray = [];
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 3,
                        "ModuleName": "Pre Admission",
                        "SubModuleId": 36,
                        "SubModuleName": "Coordinator",
                        "ScreenType": "Unsign",
                        "ActionType": "unsigned",
                        "OldActionDescription": '',
                        "NewActionDescription": `Pre-Admission(Coordinator)  Unsign  by ${givenByUser}`,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);

                    $scope.AddAuditLog($scope.LogObj);
                }
                $scope.NavtoEditCoordinateData();
            }, function (data) {

            });
        };

        $scope.LogObj = {
            "UserId": $scope.UserId || null,
            "OrganizationId": $scope.HospitalId || null,
            "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
            "PatientId": $scope.cacheStorageItem.PatientID || null,
            "LogArray": [],
            "CoordinatorNotes": '',
            "InternalCoManagerNotes": '',
            "ExternalCoManagerNotes": '',
            "ClearanceDoctorName": '',
            "ClearanceReqDate": null,
            "ClearanceRecievedDate": null,
            "DispensedByUserId": null,
            "DispenseDate": null,
            "DispenseTime": '',
            "CoordinatorVisionChallengesList": [],
            "CoordinatorVisionDiscomfortList": [],
            "CounsellingDetails": [],
            "CoordinatorChecklist": []

        };

        $scope.AddAuditLog = function (obj) {
            eHnoteSurgeryService.AddAuditLog(obj).then(function (resp) {
                if (resp.data.status === 'Success') {
                }
            }, function () {
            });
        };

        $scope.OnSelectValue = function (vitem, item) {
            if (item.QuestionId == 27) {
                if (vitem.IsChecked) {
                    vitem.IsChecked = false;
                } else {
                    vitem.IsChecked = true;
                    vitem.DeleteInd = 'N';
                }
            } else {
                if (item.CoOrdinatorQuestionValues.length > 0) {
                    if (vitem.IsChecked) {
                        vitem.IsChecked = true;
                        angular.forEach(item.CoOrdinatorQuestionValues, function (citem) {
                            citem.IsChecked = false;
                            vitem.IsChecked = false;
                        })
                    } else {
                        vitem.IsChecked = true;
                        angular.forEach(item.CoOrdinatorQuestionValues, function (citem) {
                            citem.IsChecked = false;
                            if (vitem.QuestionValueId == citem.QuestionValueId) {
                                citem.IsChecked = true;
                                vitem.IsChecked = true;
                                citem.DeleteInd = 'N';
                            }
                        })
                    }
                }
            }

            if (vitem.QuestionId == 18) {
                if (vitem.QuestionValueId == 4 && vitem.IsChecked) {
                    item.IsShowSubData = true;
                } else {
                    item.IsShowSubData = false;
                    $scope.CoordinatorObj.ClearanceDoctorName = '';
                    $scope.CoordinatorObj.ClearanceReqDate = null;
                    $scope.CoordinatorObj.ClearanceRecievedDate = null;
                }
            }

            if (item.QuestionId == 29) {
                if (vitem.QuestionValueId == 33 && vitem.IsChecked) {
                    item.IsShowSubData = true;
                } else {
                    item.IsShowSubData = false;
                    $scope.CoordinatorObj.DispensedByUserId = null;
                    $scope.CoordinatorObj.DispenseDate = null;
                    $scope.CoordinatorObj.DispenseTime = '';
                }
            }
        };

    }]).value('duScrollBottomSpy', true).value('duScrollActiveClass', 'active').value('duScrollOffset', 60);


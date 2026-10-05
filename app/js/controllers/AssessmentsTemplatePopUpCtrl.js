"use strict";
eHnoteWebApp.controller("AssessmentsTemplatePopUpCtrl", ["$scope", "$rootScope", "$uibModalInstance", "$filter", "alertify", "eHnoteMasterDataService", "eHnotePatientDataService", "eHnoteSettingsDataService", "eHnoteDiagnosisDataServices", "eHnoteConditionsDataService", "AssessmentListArray", "$uibModal", "$timeout","Mainobj",
    function ($scope, $rootScope, $uibModalInstance, $filter, alertify, eHnoteMasterDataService, eHnotePatientDataService, eHnoteSettingsDataService, eHnoteDiagnosisDataServices, eHnoteConditionsDataService, AssessmentListArray, $uibModal, $timeout, Mainobj) {
        //$scope.UserId = Mainobj.UserId||0;
        //$scope.HospitalId = Mainobj.HospitalId||0;

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
        $scope.GetAssessmentObj = function () {
            return {
                "SnomedCodeId": 0,
                "SnomedCode": "",
                "CreatedDateTime": "",
                "ConsultationDiagnosisId": 0,
                "AssessmentPlanId": 0,
                "AssessmentPlan": {
                    "AssessmentPlanId": 0,
                    "PlanofDiscussionsNotes": "",
                    "PatientInstructions": "",
                    "AssessmentsNotes": "",
                    "DoctorNotes": "",
                    "ActionsTaken": "",
                    "DeleteInd": 'N'
                },
                "SpecializationId": $scope.SpecializationId,
                "Type": "Optha",
                "PriorityId": null,
                "DiagnosisId": 0,
                "PlanofDiscussionsNotes": "",
                "PatientInstructions": "",
                "AssessmentsNotes": "",
                "SubTab": "1",
                "DoctorNotes": "",
                "DiagnosisObject": "",
                "DiagnosisRiskLevel": 'Mild',
                "FindingDiagnosisId": 0,
                "DiagnosisHistoryId": 0,
                "ICD10CODE": "",
                "ICD10DIAGDESCRIPTION": "",
                "ICD10DIAGNAME": "",
                "PlanOfcareNotesArray": [],
                "ProceduresArray": [],
                "PrescriptionArray": [],
                "SurgeryArray": [],
                "InvestigationsArray": [],
                "InvestigationFindingId": 0,
                "FindingId": 0,
                //"ActiveInd": "Y",
                "DeleteInd": "N",
                "ProceduresAddedTime": "",
                "PrescriptionAddedTime": "",
                "PlanOfCareAddedTime": "",
                "SurgeryAddedTime": "",
                "IsEditData": false,
                "SelectedInvestigationObj": "",
                "InvsearchBy": 1,
                "OPDPsearchBy": 1,
                "SurgerysearchBy": 1,
                "ProcedureSurgerysearchBy": 1,
                "ReferralArray": [],
                "ActionsTaken": "",
                "RVerificationStatusId": 1,
                "LVerificationStatusId": 1,
                "MasterCareEpisodeId": null,
                "IsCheckedDiagnosis": false,
                "MasterCareEpisodeId": null,
                "MedicalPrescriptionDetails": [],
                "CodeSystem": '',
                "LocationId1": 0,
                "Location1": "",
                "SeverityId1": 0,
                "Verificationstatusid1": 0,
                //"DiagnosisStatusId1": 6,
                //"DiagnosisStatus1": 'Not Examined',
                "DiagnosisStatusId1": 2,
                "DiagnosisStatus1": 'Active',
                "EndDate1": '',
                "StartDate1": $filter('date')(new Date(), "yyyy-MM-dd h:mm a") || '',
                "LocationId2": 0,
                "Location2": "",
                "SeverityId2": 0,
                "Verificationstatusid2": 0,
                "DiagnosisStatusId2": 0,
                "DiagnosisStatus2": '',
                "EndDate2": '',
                "StartDate2": $filter('date')(new Date(), "yyyy-MM-dd h:mm a") || '',
                "OrganId":0

            };
        };

        $scope.uibclose = function () {
            //$scope.changeDiagnosisSearch("");
            //$scope.Templatesearch.AssesmentTemplateSearch = "";
            $uibModalInstance.dismiss("cancel");
        };
        $scope.TemplateSearchObj = {
            "DiagnosisSearch": '',
        }
        $scope.GetLogObj = function () {

            return {
                "UserId": $scope.UserId || null,
                "OrganizationId": $scope.HospitalId || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "PatientId": $scope.cacheStorageItem.patientid || null,
                "LogArray": [],
                "AssesTemplatesList": [],
            }
        }
        $scope.LogObj = $scope.GetLogObj();
        $scope.AssesTemplatesList = [];
        $scope.TemplatecurrentPage = 1;
        $scope.TemplatepageChanged = function (AssescurrentPage) {
            $scope.TemplatecurrentPage = AssescurrentPage;
            $scope.GetUserVisitDiagnosisTemplates();
        };

        $scope.AssesmentMainobj = Mainobj || {};
        $scope.AssesmentMainobj.PopUpType = $scope.AssesmentMainobj.PopUpType || '';

        $scope.SelectedDignosis = "";
        var selcteddig = [];
        AssessmentListArray = AssessmentListArray || []
        if (AssessmentListArray.length > 0) {
            selcteddig = $filter("filter")(AssessmentListArray, function (Aitem, index) { return Aitem.IsEditData && Aitem.DeleteInd == 'N' },);
            if (selcteddig.length > 0) {
                $scope.SelectedDignosis = selcteddig[0].ICD10CODE || '';
                $scope.TemplateSearchObj.DiagnosisSearch = $scope.SelectedDignosis;
            }
        }

        console.log($scope.SelectedDignosis);

        $scope.SearchUserVisitDiagnosisTemplates = function (val) {
            //if (!$scope.TemplateSearchObj.DiagnosisSearch || $scope.TemplateSearchObj.DiagnosisSearch.length < 2) {
            //    //$scope.previousSearchText = "";
            //    //$scope.filteredProblemList = [];
            //    return [];
            //}
            let object = {
                "OrganizationId": $scope.HospitalId || 0,
                "UserId": $scope.UserId || 2,
                "SearchText": $scope.TemplateSearchObj.DiagnosisSearch || "",
                "PageSize": 10,
                "PageNumber": 1,
                "IsFrequentlyAddedInd": 0
            }

            if (object.SearchText == '') {
                object.IsFrequent = 'Y';
            }

            return eHnotePatientDataService.GetUserVisitDiagnosisTemplates(object).then(function (response) {
                if (response.data.Count !== 0) {
                    if (response.data.rows !== undefined) {
                        response.data.rows = response.data.rows || [];
                        if (response.data.rows.length > 0) {
                            $scope.AssesTemplatesList = response.data.rows || [];
                            angular.forEach($scope.AssesTemplatesList, function (item) {
                                item.IsAccordian = false;
                                item.Templates = item.Templates || [];
                                if (item.Templates.length > 0) {
                                    angular.forEach(item.Templates, function (tmpitem, index) {
                                        tmpitem.count = index + 1;
                                        $scope.NormalizeTemplateNotes(tmpitem);
                                        tmpitem.Isselcted = false;
                                    });
                                }
                            });
                            $scope.LogObj.AssesTemplatesList = $scope.AssesTemplatesList || [];
                        }
                        return response.data.rows.map(function (item) {
                            return item;
                        });
                    }

                }
            });

        };

        $scope.GetUserVisitDiagnosisTemplates = function () {
            var params = {
                "UserId": $scope.UserId,
                "SearchText": $scope.TemplateSearchObj.DiagnosisSearch || "",
                "PageSize": 50,
                "PageNumber": $scope.TemplatecurrentPage || 1,
                "OrganizationId": $scope.HospitalId,
                "IsFavoriteInd": 0
            }
            eHnotePatientDataService.GetUserVisitDiagnosisTemplates(params).then(function (resp) {
                if (resp.data.Status == "Success") {
                    $scope.SelectedDignosis = '';
                    resp.data.rows = resp.data.rows || [];
                    $scope.AssesTemplatesList = [];
                    if (resp.data.rows.length > 0) {
                        $scope.AssesTemplatesList = resp.data.rows || [];
                        angular.forEach($scope.AssesTemplatesList, function (item) {
                            item.IsAccordian = false;
                            item.Templates = item.Templates || [];
                            if (item.Templates.length > 0) {
                                angular.forEach(item.Templates, function (tmpitem, index) {
                                    tmpitem.count = index + 1;
                                    $scope.NormalizeTemplateNotes(tmpitem);
                                    tmpitem.Isselcted = false;
                                });
                            }
                        });
                        $scope.LogObj.AssesTemplatesList = $scope.AssesTemplatesList || [];
                        let item = $scope.AssesTemplatesList.find(item => item.DiagnosisId === $scope.resolveObj.DiagnosisId);
                        if (item) {$scope.IstemplateOpen(item);}
                    }
                }
                //console.log(resp);


            }, function (err) {

            });
        }

       

        $timeout(function () {
            $scope.GetUserVisitDiagnosisTemplates();
        }, 500);

        $scope.SelectedAssesTemplatesList = [];
        $scope.IstemplateOpen = function (item) {
            if ($scope.AssesTemplatesList.length > 0) {
                angular.forEach($scope.AssesTemplatesList, function (item, index) {
                    //tmpitem.count = index + 1;                    
                        item.IsAccordian = false;
                });
            }
                item.IsAccordian = !item.IsAccordian || false;
            $scope.SelectedAssesTemplatesList = [];
            $scope.SelectedAssesTemplatesList.push(item);
            if ($scope.SelectedAssesTemplatesList.lenght > 0) {
                angular.forEach($scope.SelectedAssesTemplatesList, function (stitem, index) {
                    stitem.IsAlltemplateItemsIsChecked = false;
                    //stitem.AllnotesIsChecked = false;
                    stitem.MedicationIsChecked = false;
                    stitem.AllReferralIsChecked = false;
                    stitem.AllProcedureIsChecked = false;
                    stitem.SurgeryArray = false;
                    stitem.AllInvIsChecked = false;

                    stitem.IsPlanofDiscussionAllNotes = false;
                    stitem.IsAssessmentAllNotes = false;
                    stitem.IsPatientInstructionsAllNotes = false;
                    stitem.IsActionTakenAllNotes = false;
                    stitem.IsDoctorNotesAllNotes = false;


                    angular.forEach(stitem.Templates, function (sitem, index) {
                        if (sitem.AssessmentNotesArray.length > 0) {
                            angular.forEach(sitem.AssessmentNotesArray, function (sanitem, index) {
                                sanitem.IsChecked = false;
                            });
                        }
                        if (sitem.InvestigationsArray.length > 0) {
                            angular.forEach(sitem.InvestigationsArray, function (sanitem, index) {
                                sanitem.IsChecked = false;
                            });
                        }
                        if (sitem.MedicationsArray.length > 0) {
                            angular.forEach(sitem.MedicationsArray, function (sanitem, index) {
                                sanitem.IsChecked = false;
                            });
                        }
                        if (sitem.ProceduresArray.length > 0) {
                            angular.forEach(sitem.ProceduresArray, function (sanitem, index) {
                                sanitem.IsChecked = false;
                            });
                        }
                        if (sitem.ReferralArray.length > 0) {
                            angular.forEach(sitem.ReferralArray, function (sanitem, index) {
                                sanitem.IsChecked = false;
                            });
                        }
                        if (sitem.SurgeryArray.length > 0) {
                            angular.forEach(sitem.SurgeryArray, function (sanitem, index) {
                                sanitem.IsChecked = false;
                            });
                        }
                    });

                });
            }
        }
        $scope.ChangeSelectionAllMedication = function (item, main) {
            //$scope.MedicationIsChecked = !$scope.MedicationIsChecked || false;
            //angular.forEach(item.Templates, function (sitem, index) {
            if (item.MedicationsArray.length > 0) {
                angular.forEach(item.MedicationsArray, function (sanitem, index) {
                    sanitem.IsChecked = item.MedicationIsChecked;
                });
            }
            /*});*/
        }

        $scope.ChangeSelectionAllReferral = function (item, main) {
            //$scope.AllReferralIsChecked = !$scope.AllReferralIsChecked || false;
            //angular.forEach(item.Templates, function (sitem, index) {
            if (item.ReferralArray.length > 0) {
                angular.forEach(item.ReferralArray, function (sanitem, index) {
                    sanitem.IsChecked = item.AllReferralIsChecked;
                });
            }
            /*});*/
        }

        $scope.ChangeSelectionAllProcedure = function (item, main) {
            //$scope.AllProcedureIsChecked = !$scope.AllProcedureIsChecked || false;
            //angular.forEach(item.Templates, function (sitem, index) {
            if (item.ProceduresArray.length > 0) {
                angular.forEach(item.ProceduresArray, function (sanitem, index) {
                    sanitem.IsChecked = item.AllProcedureIsChecked;
                });
            }
            //    });
        }

        $scope.ChangeSelectionAllsurgery = function (item, main) {
            //$scope.AllProcedureIsChecked = !$scope.AllProcedureIsChecked || false;
            //angular.forEach(item.Templates, function (sitem, index) {
            if (item.SurgeryArray.length > 0) {
                angular.forEach(item.SurgeryArray, function (sanitem, index) {
                    sanitem.IsChecked = item.AllsurgeryIsChecked;
                });
            }
            //    });
        }

        $scope.ChangeSelectionAllInv = function (item, main) {
            //$scope.AllProcedureIsChecked = !$scope.AllProcedureIsChecked || false;
            //angular.forEach(item.Templates, function (sitem, index) {
            if (item.InvestigationsArray.length > 0) {
                angular.forEach(item.InvestigationsArray, function (sanitem, index) {
                    sanitem.IsChecked = item.AllInvIsChecked;
                });
            }
            /*});*/
        }
        $scope.Notesobj = {
            'IsPlanofDiscussionAllNotes': false,
            'IsAssessmentAllNotes': false,
            'IsPatientInstructionsAllNotes': false,
            'IsActionTakenAllNotes': false,
            'IsDoctorNotesAllNotes': false,
        }
        $scope.ChangeSelectAllnotes = function (item, type) {
            //$scope.AllProcedureIsChecked = !$scope.AllProcedureIsChecked || false;
            //angular.forEach(item.Templates, function (sitem, index) {
            if (item.AssessmentNotesArray.length > 0) {
                angular.forEach(item.AssessmentNotesArray, function (sanitem, index) {
                    if (sanitem.NoteTypeId == 1 && type == 1) {
                        sanitem.IsChecked = item.IsPlanofDiscussionAllNotes;
                    }
                    else if (sanitem.NoteTypeId == 2 && type == 2) {
                        sanitem.IsChecked = item.IsAssessmentAllNotes;
                    }
                    else if (sanitem.NoteTypeId == 3 && type == 3) {
                        sanitem.IsChecked = item.IsPatientInstructionsAllNotes;
                    }
                    else if (sanitem.NoteTypeId == 4 && type == 4) {
                        sanitem.IsChecked = item.IsActionTakenAllNotes;
                    }
                    else if (sanitem.NoteTypeId == 5 && type == 5) {
                        sanitem.IsChecked = item.IsDoctorNotesAllNotes;
                    }
                });
            }
            //    });
        }

        $scope.ChangeSelectAlltmplItems = function (item, index) {
            //$scope.AllProcedureIsChecked = !$scope.AllProcedureIsChecked || false;
            item.Templates = item.Templates || [];
            let checkedtemplted = item.Templates[index] || [];
            //angular.forEach(checkedtemplted, function (sitem, index) {
            if (checkedtemplted.AssessmentNotesArray.length > 0) {
                //checkedtemplted.IsAlltemplateItemsIsChecked
                checkedtemplted.MedicationIsChecked = checkedtemplted.IsAlltemplateItemsIsChecked||false;
                checkedtemplted.AllReferralIsChecked = checkedtemplted.IsAlltemplateItemsIsChecked ||false;
                checkedtemplted.AllProcedureIsChecked = checkedtemplted.IsAlltemplateItemsIsChecked ||false;
                checkedtemplted.AllsurgeryIsChecked = checkedtemplted.IsAlltemplateItemsIsChecked ||false;
                checkedtemplted.AllInvIsChecked = checkedtemplted.IsAlltemplateItemsIsChecked || false;

                checkedtemplted.IsPlanofDiscussionAllNotes = checkedtemplted.IsAlltemplateItemsIsChecked || false;
                checkedtemplted.IsAssessmentAllNotes = checkedtemplted.IsAlltemplateItemsIsChecked || false;
                checkedtemplted.IsPatientInstructionsAllNotes = checkedtemplted.IsAlltemplateItemsIsChecked || false;
                checkedtemplted.IsActionTakenAllNotes = checkedtemplted.IsAlltemplateItemsIsChecked || false;
                checkedtemplted.IsDoctorNotesAllNotes = checkedtemplted.IsAlltemplateItemsIsChecked || false;
                angular.forEach(checkedtemplted.AssessmentNotesArray, function (sanitem, index) {
                    sanitem.IsChecked = checkedtemplted.IsAlltemplateItemsIsChecked || false;
                });
            }
            if (checkedtemplted.InvestigationsArray.length > 0) {
                angular.forEach(checkedtemplted.InvestigationsArray, function (sanitem, index) {
                    sanitem.IsChecked = checkedtemplted.IsAlltemplateItemsIsChecked || false;
                });
            }
            if (checkedtemplted.MedicationsArray.length > 0) {
                angular.forEach(checkedtemplted.MedicationsArray, function (sanitem, index) {
                    sanitem.IsChecked = checkedtemplted.IsAlltemplateItemsIsChecked || false;
                });
            }
            if (checkedtemplted.ProceduresArray.length > 0) {
                angular.forEach(checkedtemplted.ProceduresArray, function (sanitem, index) {
                    sanitem.IsChecked = checkedtemplted.IsAlltemplateItemsIsChecked || false;
                });
            }
            if (checkedtemplted.ReferralArray.length > 0) {
                angular.forEach(checkedtemplted.ReferralArray, function (sanitem, index) {
                    sanitem.IsChecked = checkedtemplted.IsAlltemplateItemsIsChecked || false;
                });
            }
            if (checkedtemplted.SurgeryArray.length > 0) {
                angular.forEach(checkedtemplted.SurgeryArray, function (sanitem, index) {
                    sanitem.IsChecked = checkedtemplted.IsAlltemplateItemsIsChecked || false;
                });
            }
            /*});*/
        }
        $scope.CheckNotesAll = function (templtitem, NoteTypeId) {
            let filterChecked = $filter("filter")(templtitem.AssessmentNotesArray, function (Aitem, index) { return Aitem.IsChecked && Aitem.NoteTypeId == NoteTypeId },);
            let filterAll = $filter("filter")(templtitem.AssessmentNotesArray, function (Aitem, index) { return Aitem.NoteTypeId == NoteTypeId },);
            if (NoteTypeId == 1) {
                if (filterChecked.length == filterAll.length) {
                    templtitem.IsPlanofDiscussionAllNotes = true;
                } else {
                    templtitem.IsPlanofDiscussionAllNotes = false
                }
            }
            else if (NoteTypeId == 2) {
                if (filterChecked.length == filterAll.length) {
                    templtitem.IsAssessmentAllNotes = true;
                } else {
                    templtitem.IsAssessmentAllNotes = false
                }
            }
            else if (NoteTypeId == 3) {
                if (filterChecked.length == filterAll.length) {
                    templtitem.IsPatientInstructionsAllNotes = true;
                } else {
                    templtitem.IsPatientInstructionsAllNotes = false
                }
            }
            else if (NoteTypeId == 4) {
                if (filterChecked.length == filterAll.length) {
                    templtitem.IsActionTakenAllNotes = true;
                } else {
                    templtitem.IsActionTakenAllNotes = false
                }
            }
            else if (NoteTypeId == 5) {
                if (filterChecked.length == filterAll.length) {
                    templtitem.IsDoctorNotesAllNotes = true;
                } else {
                    templtitem.IsDoctorNotesAllNotes = false
                }
                
            }


        }

        $scope.CheckInvAll = function (templtitem, NoteTypeId) {
            let filterChecked = $filter("filter")(templtitem.InvestigationsArray, function (Aitem, index) { return Aitem.IsChecked },);


            if (filterChecked.length == templtitem.InvestigationsArray.length) {
                templtitem.AllInvIsChecked = true;
            }
            else {
                templtitem.AllInvIsChecked = false
            }

        }

        $scope.CheckSurgeryAll = function (templtitem, NoteTypeId) {
            let filterChecked = $filter("filter")(templtitem.SurgeryArray, function (Aitem, index) { return Aitem.IsChecked },);


            if (filterChecked.length == templtitem.SurgeryArray.length) {
                templtitem.AllsurgeryIsChecked = true;
            }
            else {
                templtitem.AllsurgeryIsChecked = false
            }

        }

        $scope.CheckProceduresAll = function (templtitem, NoteTypeId) {
            let filterChecked = $filter("filter")(templtitem.ProceduresArray, function (Aitem, index) { return Aitem.IsChecked },);


            if (filterChecked.length == templtitem.ProceduresArray.length) {
                templtitem.AllProcedureIsChecked = true;
            }
            else {
                templtitem.AllProcedureIsChecked = false
            }

        }
        $scope.CheckReferralArrayAll = function (templtitem, NoteTypeId) {
            let filterChecked = $filter("filter")(templtitem.ReferralArray, function (Aitem, index) { return Aitem.IsChecked },);


            if (filterChecked.length == templtitem.ReferralArray.length) {
                templtitem.AllReferralIsChecked = true;
            }
            else {
                templtitem.AllReferralIsChecked = false
            }

        }
        $scope.CheckMedicationsArrayAll = function (templtitem, NoteTypeId) {
            let filterChecked = $filter("filter")(templtitem.MedicationsArray, function (Aitem, index) { return Aitem.IsChecked },);


            if (filterChecked.length == templtitem.MedicationsArray.length) {
                templtitem.MedicationIsChecked = true;
            }
            else {
                templtitem.MedicationIsChecked = false
            }

        }

        /* New design - the note sections of a template (NoteTypeId as in the old design) and the Preview sections */
        $scope.TemplateNoteSections = [
            { "NoteTypeId": 1, "Title": "Plan of Discussion", "PreviewTitle": "Plan", "AllKey": "IsPlanofDiscussionAllNotes" },
            { "NoteTypeId": 2, "Title": "Assessment Notes", "PreviewTitle": "Assessment", "AllKey": "IsAssessmentAllNotes" },
            { "NoteTypeId": 3, "Title": "Patient Instructions", "PreviewTitle": "Patient Instr.", "AllKey": "IsPatientInstructionsAllNotes" },
            { "NoteTypeId": 4, "Title": "Action Taken", "PreviewTitle": "Action Taken", "AllKey": "IsActionTakenAllNotes" },
            { "NoteTypeId": 5, "Title": "Doctor Notes", "PreviewTitle": "Doctor Notes", "AllKey": "IsDoctorNotesAllNotes" }
        ];
        $scope.TemplatePreviewSections = $scope.TemplateNoteSections.concat([
            { "Key": "Orders", "PreviewTitle": "Orders" },
            { "Key": "Medications", "PreviewTitle": "Medications" }
        ]);

        var templateRowArrays = ["AssessmentNotesArray", "InvestigationsArray", "SurgeryArray", "ProceduresArray", "ReferralArray", "MedicationsArray"];
        var templateAllKeys = ["IsAlltemplateItemsIsChecked", "IsPlanofDiscussionAllNotes", "IsAssessmentAllNotes", "IsPatientInstructionsAllNotes", "IsActionTakenAllNotes",
            "IsDoctorNotesAllNotes", "AllInvIsChecked", "AllsurgeryIsChecked", "AllProcedureIsChecked", "AllReferralIsChecked", "MedicationIsChecked"];

        // Rows checked in the opened templates - the same rows AddTemplatesToAssesment adds
        function checkedTemplateRows(arrayName, noteTypeId) {
            var rows = [];
            angular.forEach($scope.SelectedAssesTemplatesList, function (item) {
                angular.forEach(item.Templates, function (templtitem) {
                    angular.forEach(templtitem[arrayName], function (row) {
                        if (row.IsChecked && (noteTypeId === undefined || row.NoteTypeId == noteTypeId)) {
                            rows.push(row);
                        }
                    });
                });
            });
            return rows;
        }

        $scope.GetTemplatePreviewItems = function (sec) {
            if (sec.NoteTypeId) {
                return checkedTemplateRows("AssessmentNotesArray", sec.NoteTypeId);
            }
            if (sec.Key === "Orders") {
                return checkedTemplateRows("InvestigationsArray").concat(checkedTemplateRows("SurgeryArray"),
                    checkedTemplateRows("ProceduresArray"), checkedTemplateRows("ReferralArray"));
            }
            return checkedTemplateRows("MedicationsArray");
        };

        $scope.HasTemplatePreviewItems = function (sec) {
            return $scope.GetTemplatePreviewItems(sec).length > 0;
        };

        $scope.HasCheckedTemplateItems = function () {
            return $scope.TemplatePreviewSections.some($scope.HasTemplatePreviewItems);
        };

        // Remove: unchecks everything checked in the opened templates, so nothing of it is added to the plan
        $scope.ClearTemplateSelection = function () {
            angular.forEach($scope.SelectedAssesTemplatesList, function (item) {
                angular.forEach(item.Templates, function (templtitem) {
                    angular.forEach(templateAllKeys, function (key) {
                        templtitem[key] = false;
                    });
                    angular.forEach(templateRowArrays, function (arrayName) {
                        angular.forEach(templtitem[arrayName], function (row) {
                            row.IsChecked = false;
                        });
                    });
                });
            });
        };

        // Close (X) beside Default: unselects the opened template and empties the middle section - UI only, nothing is deleted
        $scope.ClearSelectedAssessmentTemplate = function () {
            $scope.ClearTemplateSelection();
            angular.forEach($scope.SelectedAssesTemplatesList, function (item) {
                angular.forEach(item.Templates, function (templtitem) {
                    templtitem.Isselcted = false;
                });
            });
            $scope.SelectedAssesTemplatesList = [];
        };

        $scope.AddTemplatesToAssesment = function () {
            let Dignosis = [], InvestigationsArray = [],
                MedicationsArray = [], ProceduresArray = [], ReferralArray = [], SurgeryArray = [];
            let PlanofDiscussion = '', AssessmentNotes = '', PatientInstructions = '', ActionTaken = '', DoctorNotes = '';
            let finalDesc = "";
            angular.forEach($scope.SelectedAssesTemplatesList, function (item) {

                if (item.Templates.length > 0) {
                   
                    angular.forEach(item.Templates, function (DItem, index) {
                        let logBlocks = [];

                        let tempPlanofDiscussion = '';
                        let tempAssessmentNotes = '';
                        let tempPatientInstructions = '';
                        let tempActionTaken = '';
                        let tempDoctorNotes = '';

                        let tempInvestigationsArray = [];
                        let tempProceduresArray = [];
                        let tempSurgeryArray = [];
                        let tempReferralArray = [];
                        let tempMedicationsArray = [];
                        if (DItem.AssessmentNotesArray.length > 0) {
                            //angular.forEach(DItem.AssessmentNotesArray, function (snItem) {
                            //});
                            for (var i in DItem.AssessmentNotesArray) {
                                if (DItem.AssessmentNotesArray[i].NoteTypeId == 1 && DItem.AssessmentNotesArray[i].IsChecked) {
                                    PlanofDiscussion += "\n" + DItem.AssessmentNotesArray[i].Notes;
                                }
                                if (DItem.AssessmentNotesArray[i].NoteTypeId == 2 && DItem.AssessmentNotesArray[i].IsChecked) {
                                    AssessmentNotes += "\n" + DItem.AssessmentNotesArray[i].Notes;
                                }
                                if (DItem.AssessmentNotesArray[i].NoteTypeId == 3 && DItem.AssessmentNotesArray[i].IsChecked) {
                                    PatientInstructions += "\n" + DItem.AssessmentNotesArray[i].Notes;
                                }
                                if (DItem.AssessmentNotesArray[i].NoteTypeId == 4 && DItem.AssessmentNotesArray[i].IsChecked) {
                                    ActionTaken += "\n" + DItem.AssessmentNotesArray[i].Notes;
                                }
                                if (DItem.AssessmentNotesArray[i].NoteTypeId == 5 && DItem.AssessmentNotesArray[i].IsChecked) {
                                    DoctorNotes += "\n" + DItem.AssessmentNotesArray[i].Notes;
                                }
                            }
                            if (PlanofDiscussion.charAt(0) === "\n") {
                                PlanofDiscussion = PlanofDiscussion.slice(1);
                            }
                            if (AssessmentNotes.charAt(0) === "\n") {
                                AssessmentNotes = AssessmentNotes.slice(1);
                            }
                            if (PatientInstructions.charAt(0) === "\n") {
                                PatientInstructions = PatientInstructions.slice(1);
                            }
                            if (ActionTaken.charAt(0) === "\n") {
                                ActionTaken = ActionTaken.slice(1);
                            }
                            if (DoctorNotes.charAt(0) === "\n") {
                                DoctorNotes = DoctorNotes.slice(1);
                            }
                           
                            if (DItem.AssessmentNotesArray?.length) {
                                DItem.AssessmentNotesArray.forEach(n => {
                                    if (!n.IsChecked) return;

                                    if (n.NoteTypeId == 1) tempPlanofDiscussion += ` | ${n.Notes}`;
                                    if (n.NoteTypeId == 2) tempAssessmentNotes += ` | ${n.Notes}`;
                                    if (n.NoteTypeId == 3) tempPatientInstructions += ` | ${n.Notes}`;
                                    if (n.NoteTypeId == 4) tempActionTaken += ` | ${n.Notes}`;
                                    if (n.NoteTypeId == 5) tempDoctorNotes += ` | ${n.Notes}`;
                                });
                            }
                            function pushNote(title, value) {
                                if (!value) return;
                                logBlocks.push(`${title} :\n${value.replace(/^ \| /, "")}`);
                            }

                            pushNote("Plan of Discussion", tempPlanofDiscussion);
                            pushNote("Assessment Notes", tempAssessmentNotes);
                            pushNote("Patient Instructions", tempPatientInstructions);
                            pushNote("Action Taken", tempActionTaken);
                            pushNote("Doctor Notes", tempDoctorNotes);


                        }

                        if (DItem.InvestigationsArray.length > 0) {
                            angular.forEach(DItem.InvestigationsArray, function (iitem) {
                                if (iitem.IsChecked) {
                                    iitem.OrganId = '';
                                    iitem.ShowDateFormat = true;
                                    iitem.DurationDate = null;
                                    iitem.Duration = 0;
                                    iitem.DurationType = '';
                                    if (iitem.InvestigationNotes != '') {
                                        iitem.IsEdit = true;
                                    } else {
                                        iitem.IsEdit = false;
                                    }
                                    iitem.OrganId = iitem.OrganId != '' ? parseInt(iitem.OrganId) : "";
                                    iitem.OrganName = iitem.OrganId == 1 ? 'OD' : (iitem.OrganId == 2 ? 'OS' : (iitem.OrganId == 3 ? 'OU' : ''));
                                    iitem.OrganId = iitem.OrganId.toString();
                                    iitem.StatusId = iitem.StatusId.toString();
                                    iitem.BookingStatusId = iitem.BookingStatusId.toString();

                                    /*   iitem.DurationDate = $filter('date')(iitem.DurationDate, 'MM/dd/yyyy');*/
                                    if (iitem.Duration == '' || iitem.Duration == null) {
                                        iitem.ShowDateFormat = true;
                                    } else {
                                        iitem.ShowDateFormat = false;
                                    }
                                    var filterInv = [];
                                    if (InvestigationsArray.length > 0) {
                                        filterInv = $filter("filter")(InvestigationsArray, function (Aitem, index) { return Aitem.OrgDescriptionId == iitem.OrgInvestigationId && Aitem.DeleteInd == 'N' },);
                                    }
                                    if (filterInv.length == 0) {
                                        var object = {
                                            "PatientOrderId": 0,
                                            "SpecializationId": $scope.SpecializationId,
                                            "OrderTypeId": 1,
                                            "DescriptionId": iitem.InvestigationId || "",
                                            "Description": iitem.InvestigationName || "",
                                            "ProcedureCode": iitem.ProcedureCode || 0,
                                            "OrgDescriptionId": iitem.OrgInvestigationId || 0,
                                            "Remarks": "",
                                            "OrganId": iitem.OrganId || '',
                                            "OrganName": iitem.OrganName || "",
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
                                        }
                                        InvestigationsArray.push(object);
                                        tempInvestigationsArray.push(object);
                                    }
                                }
                            });
                            pushOrderBlock("Investigations", tempInvestigationsArray,
                                x => `${x.ProcedureCode || ""} | ${x.Description || ""}`);
                        }

                        if (DItem.ProceduresArray.length > 0) {
                            angular.forEach(DItem.ProceduresArray, function (pitem) {
                                if (pitem.IsChecked) {
                                    pitem.OrganId = '';
                                    pitem.ShowDateFormat = true;
                                    pitem.DurationDate = null;
                                    pitem.Duration = 0;
                                    pitem.DurationType = '';
                                    if (pitem.InvestigationNotes != '') {
                                        pitem.IsEdit = true;
                                    } else {
                                        pitem.IsEdit = false;
                                    }
                                    pitem.OrganId = pitem.OrganId != '' ? parseInt(pitem.OrganId) : "";
                                    pitem.OrganName = pitem.OrganId == 1 ? 'OD' : (pitem.OrganId == 2 ? 'OS' : (pitem.OrganId == 3 ? 'OU' : ''));
                                    pitem.OrganId = pitem.OrganId.toString();
                                    pitem.StatusId = pitem.StatusId.toString();
                                    pitem.BookingStatusId = pitem.BookingStatusId.toString();

                                    /*   pitem.DurationDate = $filter('date')(pitem.DurationDate, 'MM/dd/yyyy');*/
                                    if (pitem.Duration == '' || pitem.Duration == null) {
                                        pitem.ShowDateFormat = true;
                                    } else {
                                        pitem.ShowDateFormat = false;
                                    }
                                    var filterInv = [];
                                    if (ProceduresArray.length > 0) {
                                        filterInv = $filter("filter")(ProceduresArray, function (Aitem, index) { return Aitem.OrgDescriptionId == pitem.OrgProcedureId && Aitem.DeleteInd == 'N' },);
                                    }
                                    if (filterInv.length == 0) {
                                        var object = {
                                            "PatientOrderId": 0,
                                            "SpecializationId": $scope.SpecializationId,
                                            "OrderTypeId": 2,
                                            "DescriptionId": pitem.ProcedureId || "",
                                            "Description": pitem.ProcedureName || "",
                                            "ProcedureCode": pitem.ProcedureCode || 0,
                                            "OrgDescriptionId": pitem.OrgProcedureId || 0,
                                            "Remarks": "",
                                            "OrganId": pitem.OrganId || '',
                                            "OrganName": pitem.OrganName || "",
                                            "BillingCode": "",
                                            "BookingStatusId": pitem.BookingStatusId || "2",
                                            "CPTCode": pitem.CPTCode || '',
                                            "StatusId": pitem.StatusId || '',
                                            "DeleteInd": "N",
                                            "InvSpecialityId": "",
                                            "PatientSurgeryId": 0,
                                            "SurgeryListId": 0,
                                            "IsEditData": false,
                                            "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                                            "DurationType": pitem.DurationType || "D",
                                            "CoordinatorId": pitem.CoordinatorId || 0,
                                            "ExternalCoManagerId": pitem.ExternalCoManagerId || 0,
                                            "InternalCoManagerId": pitem.InternalCoManagerId || 0,
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
                                        ProceduresArray.push(object);
                                        tempProceduresArray.push(object);
                                    }
                                }
                            });
                            pushOrderBlock("Procedures", tempProceduresArray,
                                x => `${x.ProcedureCode || ""} | ${x.Description || ""}`);
                        }


                        if (DItem.SurgeryArray.length > 0) {
                            angular.forEach(DItem.SurgeryArray, function (pitem) {
                                if (pitem.IsChecked) {
                                    pitem.OrganId = '';
                                    pitem.ShowDateFormat = true;
                                    pitem.DurationDate = null;
                                    pitem.Duration = 0;
                                    pitem.DurationType = '';
                                    if (pitem.InvestigationNotes != '') {
                                        pitem.IsEdit = true;
                                    } else {
                                        pitem.IsEdit = false;
                                    }
                                    pitem.OrganId = pitem.OrganId != '' ? parseInt(pitem.OrganId) : "";
                                    pitem.OrganName = pitem.OrganId == 1 ? 'OD' : (pitem.OrganId == 2 ? 'OS' : (pitem.OrganId == 3 ? 'OU' : ''));
                                    pitem.OrganId = pitem.OrganId.toString();
                                    pitem.StatusId = pitem.StatusId.toString();
                                    pitem.BookingStatusId = pitem.BookingStatusId.toString();

                                    /*   pitem.DurationDate = $filter('date')(pitem.DurationDate, 'MM/dd/yyyy');*/
                                    if (pitem.Duration == '' || pitem.Duration == null) {
                                        pitem.ShowDateFormat = true;
                                    } else {
                                        pitem.ShowDateFormat = false;
                                    }
                                    var filterInv = [];
                                    if (SurgeryArray.length > 0) {
                                        filterInv = $filter("filter")(SurgeryArray, function (Aitem, index) { return Aitem.OrgDescriptionId == pitem.OrgDescriptionId && Aitem.DeleteInd == 'N' },);
                                    }
                                    if (filterInv.length == 0) {
                                        var object = {
                                            "PatientOrderId": 0,
                                            "SpecializationId": $scope.SpecializationId,
                                            "OrderTypeId": 3,
                                            "DescriptionId": pitem.SurgeryId || "",
                                            "Description": pitem.SurgeryName || "",
                                            "ProcedureCode": pitem.ProcedureCode || 0,
                                            "OrgDescriptionId": pitem.OrgDescriptionId || 0,
                                            "Remarks": "",
                                            "OrganId": pitem.OrganId || '',
                                            "OrganName": pitem.OrganName || "",
                                            "BillingCode": "",
                                            "BookingStatusId": pitem.BookingStatusId || "2",
                                            "CPTCode": pitem.CPTCode || '',
                                            "StatusId": pitem.StatusId || '',
                                            "DeleteInd": "N",
                                            "InvSpecialityId": "",
                                            "PatientSurgeryId": 0,
                                            "SurgeryListId": 0,
                                            "IsEditData": false,
                                            "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                                            "DurationType": pitem.DurationType || "D",
                                            "CoordinatorId": pitem.CoordinatorId || 0,
                                            "ExternalCoManagerId": pitem.ExternalCoManagerId || 0,
                                            "InternalCoManagerId": pitem.InternalCoManagerId || 0,
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
                                        }
                                        SurgeryArray.push(object);
                                        tempSurgeryArray.push(object);
                                    }
                                }
                            });
                            pushOrderBlock("Surgeries", tempSurgeryArray,
                                x => `${x.ProcedureCode || ""} | ${x.Description || ""}`);
                        }


                        if (DItem.ReferralArray.length > 0) {
                            angular.forEach(DItem.ReferralArray, function (mainitem) {
                                if (mainitem.IsChecked) {
                                    var filterReferral = [];

                                    if (ReferralArray.length > 0) {
                                        var filterReferral = $filter("filter")(ReferralArray, function (Aitem, index) { return Aitem.ReferralId == mainitem.ReferralId && Aitem.DeleteInd == 'N' },);

                                    }
                                    if (filterReferral.length == 0) {
                                        var obj = {
                                            "PatientOrderId": 0,
                                            "PatientReferralDetailId": 0,
                                            "SpecializationId": 0,
                                            "Remarks": mainitem.Remarks || "",
                                            "DeleteInd": "N",
                                            "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                                            "ReferralDoctorName": mainitem.ReferralDoctorName || "",
                                            "ReferralDoctorId": mainitem.ReferralDoctorId || 0,
                                            "SpecializationName": "",
                                            "Alarm": "",
                                            "IsUrgency": false,
                                            "IsFollowUpAfterReferral": false,
                                            "IsIncludeInCaseHistory": false,
                                            "DurationDate": "",
                                            "Duration": "",
                                            "ReferralReason": mainitem.ReferralReason || "",
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
                                            "Type": "Internal"
                                        }
                                        ReferralArray.push(obj);
                                        tempReferralArray.push(obj);
                                    }
                                }
                            });
                            pushOrderBlock("Referral", ReferralArray,
                                x => x.Referral || "");
                        }


                        if (DItem.MedicationsArray != undefined && DItem.MedicationsArray.length > 0) {

                            angular.forEach(DItem.MedicationsArray, function (Dmitem) {

                                if (Dmitem.IsChecked && Dmitem.DeleteInd == 'N') {
                                    Dmitem.Type = 'MedicineOrders';
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
                                        "MedicationId": Dmitem.MedicationId || 0,
                                        "MedicationName": Dmitem.MedicationName || '',
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
                                        "DaysSupplyId": Dmitem.DaysSupplyId || 0,
                                        "DaysSupply": Dmitem.DaysSupply || '',
                                        "Action": Dmitem.Action,
                                        "ActionId": Dmitem.ActionId,
                                        "DoseId": Dmitem.DoseId,
                                        "Dose": Dmitem.Dose,
                                        "DoseOtherId": Dmitem.DoseOtherId,
                                        "DoseOther": Dmitem.DoseOther,
                                        "DoseUnitId": Dmitem.DoseUnitId,
                                        "DoseUnit": Dmitem.DoseUnit,
                                        "Quantity": Dmitem.Quantity,
                                        "QuantityUnit": Dmitem.QuantityUnit,
                                        "Route": Dmitem.Route,
                                        "FrequencyId": Dmitem.FrequencyId,
                                        "Frequency": Dmitem.Frequency,
                                        "dosesupplytest": Dmitem.dosesupplytest,
                                        "Sig": Dmitem.Sig || '',
                                        "PatientInstructions": Dmitem.PatientInstructions || ""
                                    }
                                    let i = 0;
                                    if (MedicationsArray.length > 0) {
                                        var filterInv = [];
                                        if (MedicationsArray.length > 0) {
                                            filterInv = $filter("filter")(MedicationsArray, function (Aitem, index) { return Aitem.MedicationId == Dmitem.MedicationId && Aitem.DeleteInd == 'N' },);
                                        }
                                        if (filterInv.length > 0) {
                                            i++;
                                        }
                                    }
                                    if (i == 0) {
                                        MedicationsArray.push(object);
                                        tempMedicationsArray.push(object);
                                    }
                                }
                            });
                            pushOrderBlock("Medical Rx", tempMedicationsArray,
                                x => {
                                    let s = x.MedicationName || "";
                                    if (x.Sig) s += ` | Sig : ${x.Sig}`;
                                    return s;
                                });

                        }
                        function pushOrderBlock(title, arr, formatter) {
                            if (!arr || !arr.length) return;

                            let lines = [];
                            arr.forEach(x => {
                                let txt = formatter(x);
                                if (txt) lines.push(txt);
                            });

                            if (lines.length) {
                                logBlocks.push(`${title} :\n${lines.join("\n")}`);
                            }
                        }
                        if (logBlocks.length > 0) {
                            finalDesc += (finalDesc ? "\n\n" : "") + `Template Name :${DItem.TemplateName}\n` + logBlocks.join("\n\n").trim();
                        }
                    });
                }
              
                //let i=0,
                let Finaldata = "";
                let data = "";
                if (item.DiagnosisName) {
                    data = `Diagnosis Name : ${item.ICDCODE} | ${item.DiagnosisName}`;
                }

                if (data) {
                    Finaldata += data;
                }

                if (finalDesc) {
                    Finaldata += (Finaldata ? "\n" : "") + finalDesc;
                }
                if (Finaldata) {
                    let LogItem = {
                        LogId: 0,
                        ModuleId: 1,
                        ModuleName: "OUTPatient",
                        SubModuleId: 53,
                        SubModuleName: "Assessment Plan",
                        ScreenType: "Assessment Template (Add To Plan)",
                        ActionType: "Accessed", 
                        OldActionDescription: "",
                        NewActionDescription: Finaldata,
                        ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                    };
                    $scope.AddAuditLogNew(LogItem);
                }


                let Dc = 0, filterdiagnosis = [];
                if (Dignosis.length > 0) {
                    if ((item.DiagnosisId !== null) && (item.DiagnosisId !== 0)) {
                        filterdiagnosis = $filter("filter")(Dignosis, { "DiagnosisId": item.DiagnosisId, "DeleteInd": "N" }, true);
                    }
                }

                let newAssessmentObj = $scope.GetAssessmentObj();
                if (filterdiagnosis.length > 0) {
                    newAssessmentObj.DiagnosisObject = "";
                    Dc++;
                }

                if (Dc == 0) {
                    newAssessmentObj.DiagnosisId = item.DiagnosisId;
                    newAssessmentObj.ICD10CODE = item.ICDCODE;
                    newAssessmentObj.RcopiaProblemId = item.RcopiaProblemId || "";
                    newAssessmentObj.ICD10DIAGNAME = item.DiagnosisName;
                    newAssessmentObj.ICD10DIAGDESCRIPTION = item.DiagnosisName || "";
                    newAssessmentObj.DiagnosisName = item.DiagnosisName;

                    newAssessmentObj.AssessmentPlan.PlanofDiscussionsNotes = PlanofDiscussion || '';
                    newAssessmentObj.AssessmentPlan.PatientInstructions = PatientInstructions || '';
                    newAssessmentObj.AssessmentPlan.AssessmentsNotes = AssessmentNotes || '';
                    newAssessmentObj.AssessmentPlan.ActionsTaken = ActionTaken || '';
                    newAssessmentObj.AssessmentPlan.DoctorNotes = DoctorNotes || '';
                    newAssessmentObj.DiagnosisStatus = item.DiagnosisStatus || '';
                    newAssessmentObj.PriorityId = item.PriorityId || '';
                    newAssessmentObj.SnomedCode = item.SnomedCode || '';
                    newAssessmentObj.SnomedCodeId = item.SnomedCodeId || '';
                    newAssessmentObj.SnomedCodeObject = item.SnomedCode || '';
                    newAssessmentObj.OrganId = item.OrganId || 0;

                    newAssessmentObj.IsEditData = true;
                    newAssessmentObj.SubTab = '1';

                    if (newAssessmentObj.OrganId == 1) {
                        newAssessmentObj.LocationId1 = 1;
                        newAssessmentObj.Location1 = 'OD';
                        newAssessmentObj.DiagnosisStatusId1 = 2;
                        newAssessmentObj.DiagnosisStatus1 = 'Active';
                    } else if (newAssessmentObj.OrganId == 2) {
                        newAssessmentObj.LocationId1 = 2;
                        newAssessmentObj.Location1 = 'OS';
                        newAssessmentObj.DiagnosisStatusId1 = 2;
                        newAssessmentObj.DiagnosisStatus1 = 'Active';
                    } else if (newAssessmentObj.OrganId == 3) {
                        newAssessmentObj.LocationId1 = 1;
                        newAssessmentObj.LocationId2 = 2;
                        newAssessmentObj.Location1 = 'OD';
                        newAssessmentObj.Location2 = 'OS';

                        newAssessmentObj.DiagnosisStatusId1 = 2;
                        newAssessmentObj.DiagnosisStatus1 = 'Active';
                        newAssessmentObj.DiagnosisStatusId2 = 2;
                        newAssessmentObj.DiagnosisStatus2 = 'Active';
                        newAssessmentObj.IsLocation2Added = true;
                    } else if (newAssessmentObj.OrganId == 0) {
                        newAssessmentObj.LocationId1 = 0;
                        newAssessmentObj.Location1 = '';
                    } else { }

                    //newAssessmentObj.LocationId1 = item.LocationId1 || 0;
                    //newAssessmentObj.LocationId2 = item.LocationId2 || 0;
                    newAssessmentObj.SeverityId1 = item.SeverityId1 || null;
                    newAssessmentObj.SeverityId2 = item.SeverityId2 || null;
                    //newAssessmentObj.DiagnosisStatusId1 = 2;
                    //newAssessmentObj.DiagnosisStatus1 = 'Active';
                    //newAssessmentObj.DiagnosisStatusId2 = item.DiagnosisStatusId2 || 0;

                    //newAssessmentObj.IsLocation2Added = false;
                    //if (newAssessmentObj.LocationId1 !== 0 && newAssessmentObj.LocationId2 !== 0) {
                    //    newAssessmentObj.IsLocation2Added = true;
                    //}




                    newAssessmentObj.CreatedDateTime = $filter('date')(new Date(), "MM-dd-yyyy h:mm a");

                    if (Dignosis.length !== 0) {
                        angular.forEach(Dignosis, function (item) {
                            item.IsEditData = false;
                        });
                    }


                    Dignosis.push(newAssessmentObj);
                }
            });
            let obj = {
                "ProceduresArray": ProceduresArray || [],
                "ReferralArray": ReferralArray || [],
                "SurgeryArray": SurgeryArray || [],
                "MedicationsArray": MedicationsArray || [],
                "InvestigationsArray": InvestigationsArray || [],
                "Dignosis": Dignosis || []
            }
            //console.log(obj);

            $uibModalInstance.close(obj);
        }



        $scope.ShowTemplateDetails = function (item, mainitem) {
            // After the close (X) the middle section is empty - show this template's diagnosis again
            if ($scope.SelectedAssesTemplatesList.indexOf(mainitem) === -1) {
                $scope.SelectedAssesTemplatesList = [mainitem];
            }
            mainitem.Templates = mainitem.Templates || [];
            if (mainitem.Templates.length > 0) {
                angular.forEach(mainitem.Templates, function (tmpitem, index) {
                    //tmpitem.count = index + 1;
                    tmpitem.Isselcted = false;
                });
            }
            item.Isselcted = !item.Isselcted || false;
        }
        $scope.GetAssesNewtemplate = function () {
            return {
                "TemplateName": '',
                "ICDCode": 1,
                //"SearchMode": 1,
                "DiagnosisArray": [],
                "IsRcopiaa": false,
                "AssessmentNotesArray": [],
                "PlanofDiscussionnotes": '',
                "AssessmentsNotes": '',
                "PatientInstructions": '',
                "ActionTakenNotes": '',
                "DoctorsNotes": '',
                "IsPlanofDiscussionnotes": false,
                "IsAssessmentsNotes": false,
                "IsPatientInstructions": false,
                "IsActionTakenNotes": false,
                "IsDoctorsNotes": false,
                "Orders": 1,
                "InvestigationsArray": [],
                "ProceduresArray": [],
                "SurgeryArray": [],
                "ReferralArray": [],
                "MedicationsArray": [],
                "PlanArray": [],
                "AssessmentArray": [],
                "PatientInstructionArray": [],
                "DoctorNotesArray": [],
                "ActionsTakenArray": [],
                "TemplateId": 0,
            }
        }

        /* The template's five sections: NoteTypeId as the backend uses it, and the array each section edits */
        $scope.TemplateSectionArrays = [
            { "NoteTypeId": 1, "NoteType": "Plan of Discussion", "Type": "Plan", "NotesKey": "PlanofDiscussionnotes", "ArrayKey": "PlanArray", "IdKey": "AssessmentPlanNotesId", "TextKey": "AssessmentPlanNotes" },
            { "NoteTypeId": 2, "NoteType": "Assessment", "Type": "Assessment", "NotesKey": "AssessmentsNotes", "ArrayKey": "AssessmentArray", "IdKey": "AssessmentNotesId", "TextKey": "AssessmentNotestext" },
            { "NoteTypeId": 3, "NoteType": "Patient Instructions", "Type": "PatientInstr", "NotesKey": "PatientInstructions", "ArrayKey": "PatientInstructionArray", "IdKey": "PatientInstrNotesId", "TextKey": "PatientInstrNotes" },
            { "NoteTypeId": 4, "NoteType": "Action Taken", "Type": "ActionTaken", "NotesKey": "ActionTakenNotes", "ArrayKey": "ActionsTakenArray", "IdKey": "ActionsTakenNotesId", "TextKey": "ActionsTakenNotes" },
            { "NoteTypeId": 5, "NoteType": "Doctor Notes", "Type": "DoctorNotes", "NotesKey": "DoctorsNotes", "ArrayKey": "DoctorNotesArray", "IdKey": "DoctorNotesId", "TextKey": "AssmntDoctorNotes" }
        ];

        /* A template comes back with its notes as five sections. The screens (the middle list, the preview,
           Add To Plan, editing a template) work with one list of notes, so it is flattened here - the rows
           keep their PlanNoteId, NoteTypeId, Notes and DeleteInd, and get the section's Type. */
        $scope.NormalizeTemplateNotes = function (templtitem) {
            if (!templtitem || !templtitem.AssessmentNotesArray || angular.isArray(templtitem.AssessmentNotesArray)) {
                return;
            }
            var sections = templtitem.AssessmentNotesArray;
            var notes = [];
            angular.forEach($scope.TemplateSectionArrays, function (section) {
                angular.forEach(sections[section.ArrayKey] || [], function (row) {
                    if (!row) {
                        return;
                    }
                    var text = row.Notes !== undefined ? row.Notes : row[section.TextKey];
                    if (!String(text || '').trim()) {
                        return;
                    }
                    notes.push({
                        "PlanNoteId": row.PlanNoteId || row[section.IdKey] || 0,
                        "TemplateId": row.TemplateId,
                        "NoteTypeId": row.NoteTypeId || section.NoteTypeId,
                        "NoteType": row.NoteType || section.NoteType,
                        "Notes": text,
                        "DeleteInd": row.DeleteInd === 'Y' ? 'Y' : 'N',
                        "Type": row.Type || section.Type
                    });
                });
            });
            templtitem.AssessmentNotesArray = notes;
        };

        // Saved notes -> the five section arrays the new design edits. The notes come back either as the
        // five sections (as they are saved) or as one list of notes carrying NoteTypeId (the older shape).
        $scope.SetTemplateSectionArrays = function (templateObj) {
            /* The create popup keeps its own AssestemplateObj on its scope, so the caller passes the one it edits */
            templateObj = templateObj || $scope.AssestemplateObj;
            if (!templateObj) {
                return;
            }
            var notes = templateObj.AssessmentNotesArray || [];
            angular.forEach($scope.TemplateSectionArrays, function (section) {
                var rows = [];
                if (!angular.isArray(notes)) {
                    angular.forEach(notes[section.ArrayKey] || [], function (row) {
                        /* The service names a row's text Notes and its id PlanNoteId */
                        var text = row && row.Notes !== undefined ? row.Notes : (row || {})[section.TextKey];
                        if (row && String(text || '').trim()) {
                            rows.push({
                                [section.IdKey]: row.PlanNoteId || row[section.IdKey] || 0,
                                [section.TextKey]: text,
                                "DeleteInd": row.DeleteInd === 'Y' ? 'Y' : 'N',
                                "Type": row.Type || section.Type
                            });
                        }
                    });
                    SetSectionRows(templateObj, section, rows);
                    return;
                }
                angular.forEach(notes, function (note) {
                    if (note && note.NoteTypeId == section.NoteTypeId && String(note.Notes || '').trim()) {
                        var row = {};
                        row[section.IdKey] = note.PlanNoteId || 0;
                        row[section.TextKey] = note.Notes;
                        row.DeleteInd = note.DeleteInd === 'Y' ? 'Y' : 'N';
                        row.Type = section.Type;
                        rows.push(row);
                    }
                });
                SetSectionRows(templateObj, section, rows);
            });
        };

        /* The section's points, and the notes the bullet list is bound to - the list rebuilds its points from
           the notes whenever the two disagree, so the notes are written from the same rows */
        function SetSectionRows(templateObj, section, rows) {
            var lines = [];
            angular.forEach(rows, function (row) {
                if (row.DeleteInd !== 'Y') {
                    lines.push(row[section.TextKey]);
                }
            });
            templateObj[section.ArrayKey] = rows;
            templateObj[section.NotesKey] = lines.join('\n');
        }

        // A section's rows as the save sends them: the point objects, without the empty row kept for typing
        $scope.GetTemplateSectionRows = function (arrayKey, templateObj) {
            var section = $scope.TemplateSectionArrays.filter(function (item) { return item.ArrayKey === arrayKey; })[0];
            var rows = [];
            if (!section) {
                return rows;
            }
            angular.forEach((templateObj || $scope.AssestemplateObj || {})[arrayKey] || [], function (row) {
                if (row && String(row[section.TextKey] || '').trim()) {
                    rows.push({
                        [section.IdKey]: row[section.IdKey] || 0,
                        [section.TextKey]: String(row[section.TextKey]).trim(),
                        "DeleteInd": row.DeleteInd === 'Y' ? 'Y' : 'N',
                        "Type": section.Type
                    });
                }
            });
            return rows;
        };

        // The five section arrays -> AssessmentNotesArray, the list the save sends
        $scope.SetTemplateAssessmentNotes = function (templateObj) {
            var notes = [];
            angular.forEach($scope.TemplateSectionArrays, function (section) {
                angular.forEach((templateObj || $scope.AssestemplateObj || {})[section.ArrayKey] || [], function (row) {
                    if (row && String(row[section.TextKey] || '').trim()) {
                        notes.push({
                            "PlanNoteId": row[section.IdKey] || 0,
                            "NoteTypeId": section.NoteTypeId,
                            "NoteType": section.NoteType,
                            "Notes": String(row[section.TextKey]).trim(),
                            "DeleteInd": row.DeleteInd === 'Y' ? 'Y' : 'N',
                            "Type": section.Type
                        });
                    }
                });
            });
            (templateObj || $scope.AssestemplateObj).AssessmentNotesArray = notes;
        };

        $scope.DiagnosisFromAssessmentPopup = angular.copy(AssessmentListArray) || [];
        $scope.resolveObj = {
            DiagnosisId:""
        }

        /* Delete one template of a diagnosis: templtitem is the template, item its diagnosis in AssesTemplatesList */
        $scope.DeleteAssessmentDiagTemplate = function (templtitem, item) {
            if (!templtitem || !templtitem.TemplateId) {
                return;
            }
            item = item || {};

            /* The template's row for this diagnosis - its TemplateDiagnosisId is what links the two */
            var templateDiagnosis = null;
            angular.forEach(templtitem.DiagnosisArray || [], function (ditem) {
                if (!templateDiagnosis && ditem && (!item.DiagnosisId || ditem.DiagnosisId == item.DiagnosisId)) {
                    templateDiagnosis = ditem;
                }
            });
            templateDiagnosis = templateDiagnosis || (templtitem.DiagnosisArray || [])[0] || {};

            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete the template '" + (templtitem.TemplateName || '') + "' ?", function () {
                var params = {
                    "OrganizationId": templtitem.OrganizationId || $scope.HospitalId,
                    "DiagnosisId": item.DiagnosisId || null,
                    "DiagnosisName": item.DiagnosisName || '',
                    "TemplateDiagnosisId": templateDiagnosis.TemplateDiagnosisId || null,
                    "UserId": $scope.UserId,
                    "TemplateId": templtitem.TemplateId,
                    "TemplateName": templtitem.TemplateName || '',
                };

                eHnotePatientDataService.DeleteAssessmentDiagnosisTemplate(params).then(function (resp) {
                    if (resp.data && (resp.data.Message === "Success" || resp.data.Status === "Success")) {
                        alertify.success("Delete successfully");
                        /* The template is gone from this diagnosis - the list is reloaded and nothing stays selected */
                        $scope.SelectedAssesTemplatesList = [];
                        $scope.GetUserVisitDiagnosisTemplates();
                    } else {
                        alertify.error((resp.data && resp.data.Message) || "Error Occured");
                    }
                }, function (err) {
                    alertify.error("Error Occured");
                });
            }, function () {
                r = "You pressed Cancel!";
            });
        };


        $scope.editAssessmentTemplate = function (mitem, mtempltitem) {
            let item = angular.copy(mitem);
            let templtitem = angular.copy(mtempltitem);
            $scope.resolveObj.DiagnosisId = item?.DiagnosisId;
            $scope.DiagnosisFromAssessmentPopup = [];
            $scope.AssestemplateObj = angular.copy($scope.GetAssesNewtemplate());
            $scope.AssestemplateObj.TemplateId = templtitem.TemplateId;
            $scope.AssestemplateObj.TemplateName = templtitem.TemplateName;            
            $scope.AssestemplateObj.DiagnosisArray = templtitem.DiagnosisArray || [];
            $scope.AssestemplateObj.MedicationsArray = templtitem.MedicationsArray || [];
            $scope.AssestemplateObj.InvestigationsArray = templtitem.InvestigationsArray || [];
            $scope.AssestemplateObj.ProceduresArray = templtitem.ProceduresArray || [];
            $scope.AssestemplateObj.SurgeryArray = templtitem.SurgeryArray || [];
            $scope.AssestemplateObj.ReferralArray = templtitem.ReferralArray || [];
            $scope.AssestemplateObj.AssessmentNotesArray = templtitem.AssessmentNotesArray || [];
            if ($scope.AssestemplateObj.DiagnosisArray && $scope.AssestemplateObj.DiagnosisArray.length > 0) {
                $scope.AssestemplateObj.DiagnosisArray.forEach(item => item.DeleteInd = 'N');
            }
            if ($scope.AssestemplateObj.InvestigationsArray && $scope.AssestemplateObj.InvestigationsArray.length > 0) {
                $scope.AssestemplateObj.InvestigationsArray.forEach(item => item.OrderTypeId = 1)
            }
            if ($scope.AssestemplateObj.ProceduresArray && $scope.AssestemplateObj.ProceduresArray.length > 0) {
                $scope.AssestemplateObj.ProceduresArray.forEach(item => item.OrderTypeId = 2)
            }
            if ($scope.AssestemplateObj.SurgeryArray && $scope.AssestemplateObj.SurgeryArray.length > 0) {
                $scope.AssestemplateObj.SurgeryArray.forEach(item => item.OrderTypeId = 3)
            }
            if (angular.isArray($scope.AssestemplateObj.AssessmentNotesArray) && $scope.AssestemplateObj.AssessmentNotesArray.length > 0) {
                /* The notes come back with DeleteInd 'N' / 'Y' (older data used false / true) */
                $scope.AssestemplateObj.AssessmentNotesArray.forEach(item => { item.DeleteInd = (item.DeleteInd === 'Y' || item.DeleteInd === true) ? 'Y' : 'N'; })
            }
            $scope.SetTemplateSectionArrays($scope.AssestemplateObj);
            $scope.createTemplatePopup("update");
        }
        $scope.createTemplatePopup = function (Type) {

            let mInstanceAdd = $uibModal.open({
                "templateUrl": "createNewTemplate.html",
                "size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "modal__sixty--",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    Type = Type || '';
                    $scope.TemplateType = Type;                    
                    $scope.DiagnosisFromAssessmentPopup = $scope.DiagnosisFromAssessmentPopup || [];
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                    if ($scope.TemplateType != "update") {
                        $scope.AssestemplateObj = angular.copy($scope.GetAssesNewtemplate());
                    }                    
                    $scope.ClearNewassesTemplates = function () {
                        $scope.AssestemplateObj = angular.copy($scope.GetAssesNewtemplate());
                    }
                    function pushIf(arr, txt) {
                        if (txt) arr.push(txt);
                    }

                    function formatDiagnosis(list = []) {
                        let out = [];
                        list.filter(x => x.DeleteInd === "N" || x.DeleteInd === false).forEach(d => {
                            out.push(`${d.ICD10CODE} | ${d.FullName || d.DiagnosisName}`);
                        });
                        return out.join("\n");
                    }

                    function formatAssessmentNotes(list = []) {
                        let map = {
                            1: "Plan of Discussion",
                            2: "Assessments",
                            3: "Patient Instructions",
                            4: "Action Taken",
                            5: "Doctor Notes"
                        };

                        let out = [];

                        list
                            .filter(x => x.DeleteInd === "N" && x.Notes)
                            .forEach(n => {
                                out.push(`${map[n.NoteTypeId]} :\n${n.Notes}`);
                            });

                        return out.join("\n\n");
                    }

                    function formatOrders(title, list = []) {
                        let out = [];

                        list.filter(x => x.DeleteInd === "N").forEach(o => {
                            out.push(`${o.CPTCode || ""} | ${o.Description || ""}`);
                        });

                        return out.length ? `${title} :\n${out.join("\n")}` : "";
                    }

                    function formatMedications(list = []) {
                        let out = [];
                        list.filter(x => x.DeleteInd === "N").forEach(m => {
                            pushIf(out, m.MedicationName);
                            pushIf(out, `Sig : ${m.Sig}`);
                        });
                        return out.join("\n");
                    }
                    function getOldTemplateRecord(diagnosisId, templateId) {
                        return ($scope.LogObj.AssesTemplatesList || [])
                            .flatMap(d => d.Templates || [])
                            .find(t =>
                                t.TemplateId == templateId &&
                                (t.DiagnosisArray || []).some(dx => dx.DiagnosisId == diagnosisId)
                            );
                    }

                    function buildAssessmentTemplateLog(obj) {

                        let sections = [];

                        // ---------- Diagnosis ----------
                        let diag = formatDiagnosis(obj.DiagnosisArray);
                        if (diag) sections.push(`Diagnosis :\n${diag}`);

                        // ---------- Assessment Notes ----------
                        let notes = formatAssessmentNotes(obj.AssessmentNotesArray);
                        if (notes) sections.push(`Assessment Notes \n${notes}`);

                        // ---------- Orders ----------
                        let orderBlocks = [];

                        pushIf(orderBlocks, formatOrders("Investigations",obj.InvestigationsArray));
                        pushIf(orderBlocks, formatOrders("Procedures",obj.ProceduresArray));
                        pushIf(orderBlocks, formatOrders("Surgeries",obj.SurgeryArray));
                        pushIf(orderBlocks, formatOrders("Referral",obj.ReferralArray));

                        if (orderBlocks.length) {
                            sections.push(`Orders :\n${orderBlocks.join("\n\n")}`);
                        }

                        // ---------- Medical Rx ----------
                        let meds = formatMedications(obj.MedicationsArray,"Medical Rx");
                        if (meds) sections.push(`Medical Rx :\n${meds}`);
                     

                        return sections.join("\n\n");
                    }
                    function compareAssessmentNotes(oldArr, newArr, o, n) {

                        oldArr = (oldArr || []).filter(x => x.DeleteInd === false);
                        newArr = (newArr || []).filter(x => x.DeleteInd === "N");

                        let oldBlock = [];
                        let newBlock = [];

                        // -------- ADD & EDIT --------
                        newArr.forEach(nNote => {

                            let oNote = oldArr.find(x => x.PlanNoteId === nNote.PlanNoteId);

                            let nLine = `${nNote.NoteType} : ${nNote.Notes || ""}`;

                            // ADD
                            if (!oNote) {
                                newBlock.push(nLine);
                            }
                            // EDIT
                            else if ((oNote.Notes || "") !== (nNote.Notes || "")) {
                                oldBlock.push(`${oNote.NoteType} : ${oNote.Notes || ""}`);
                                newBlock.push(nLine);
                            }
                        });

                        // -------- DELETE --------
                        oldArr.forEach(oNote => {
                            let exists = newArr.find(
                                x => x.PlanNoteId === oNote.PlanNoteId && x.DeleteInd === "N"
                            );
                            if (!exists) {
                                oldBlock.push(`${oNote.NoteType} : ${oNote.Notes || ""}`);
                            }
                        });

                        // -------- PUSH LIKE PROCEDURES --------
                        if (oldBlock.length > 0) {
                            o.push("Assessment Notes :");
                            oldBlock.forEach(x => o.push(x));
                        }

                        if (newBlock.length > 0) {
                            n.push("Assessment Notes :");
                            newBlock.forEach(x => n.push(x));
                        }
                    }

                    function compareList(
                        label,
                        oldArr,
                        newArr,
                        getId,
                        formatItem,
                        oldOut,
                        newOut
                    ) {
                        oldArr = oldArr || [];
                        newArr = newArr || [];

                        let o = [];
                        let n = [];

                        newArr.forEach(nItem => {

                            if (nItem.DeleteInd === "Y") return;

                            let oItem = oldArr.find(o => getId(o) === getId(nItem));

                            // ADD
                            if (!oItem) {
                                n.push(formatItem(nItem, label));
                                return;
                            }

                            // EDIT
                            if (formatItem(oItem, label) !== formatItem(nItem, label)) {
                                o.push(formatItem(oItem, label));
                                n.push(formatItem(nItem, label));
                            }
                        });

                        // ---------- DELETE ----------
                        oldArr.forEach(oItem => {

                            let nItem = newArr.find(n => getId(n) === getId(oItem));

                            if (nItem && nItem.DeleteInd === "Y" && oItem.DeleteInd === "N") {
                                o.push(formatItem(oItem, label));
                            }

                            if (!nItem && oItem.DeleteInd === "N") {
                                o.push(formatItem(oItem, label));
                            }
                        });

                        if (o.length) oldOut.push(`${label}\n${o.join("\n")}`);
                        if (n.length) newOut.push(`${label}\n${n.join("\n")}`);
                    }

                    function formatOrderItem(x, lable) {
                        lable = lable || "";
                        if (lable =="Investigations")
                            return `${x.ProcedureCode || ""} | ${x.InvestigationName || ""}`;
                        if (lable == "Procedures")
                            return `${x.ProcedureCode || ""} | ${x.ProcedureName || ""}`;
                        if (lable == "Surgeries")
                            return `${x.ProcedureCode || ""} | ${x.SurgeryName || ""}`;
                        if (lable == "Referral")
                            return `${x.Referral || ""}`;
                      

                    }
                    function formatMedication(x, lable) {
                        lable = lable || "";
                        let line = x.MedicineName || x.MedicationName|| "";
                        if (x.Sig) line += ` Sig : ${x.Sig}`;
                        return line;
                    }

                    function compareTemplate(oldT, DiagnosisArray, AssessmentNotesArray,
                        InvestigationsArray, ProceduresArray,
                        SurgeryArray, ReferralArray, MedicationsArray,TemplateName) {

                        let oldArr = [];
                        let newArr = [];

                        function check(label, o, n) {
                            if (label !== "Diagnosis") {
                                if ((o || "") !== (n || "")) {
                                    if (o) oldArr.push(`${label}\n${o}`);
                                    if (n) newArr.push(`${label}\n${n}`);
                                }
                            } else {
                                if (o) oldArr.push(`${label}\n${o}`);
                                if (n) newArr.push(`${label}\n${n}`);
                            }
                        }

                        check(
                            "Diagnosis",
                            formatDiagnosis(oldT.DiagnosisArray),
                            formatDiagnosis(DiagnosisArray)
                        );

                        compareAssessmentNotes(
                            oldT.AssessmentNotesArray,
                            AssessmentNotesArray,
                            oldArr,
                            newArr
                        );

                        compareList(
                            "Investigations",
                            oldT.InvestigationsArray,
                            InvestigationsArray,
                            x => x.InvestigationId || x.OrderId,
                            formatOrderItem,
                            oldArr,
                            newArr
                        );

                        // ---------- Procedures ----------
                        compareList(
                            "Procedures",
                            oldT.ProceduresArray,
                            ProceduresArray,
                            x => x.OrderTemplateId,
                            formatOrderItem,
                            oldArr,
                            newArr
                        );

                        // ---------- Surgeries ----------
                        compareList(
                            "Surgeries",
                            oldT.SurgeryArray,
                            SurgeryArray,
                            x => x.OrderTemplateId,
                            formatOrderItem,
                            oldArr,
                            newArr
                        );

                        // ---------- Referral ----------
                        compareList(
                            "Referral",
                            oldT.ReferralArray,
                            ReferralArray,
                            x => x.ReferralId,
                            formatOrderItem,
                            oldArr,
                            newArr
                        );

                        // ---------- Medical Rx ----------
                        compareList(
                            "Medical Rx",
                            oldT.MedicationsArray,
                            MedicationsArray,
                            x => x.MedicationTemplateId || x.PatientPrescriptionDetailId,
                            formatMedication,
                            oldArr,
                            newArr
                        );
                       
                        if (!oldArr.length && !newArr.length) return null;
                        let oldText = "";
                        let newText = "";

                        if (oldArr.length) {
                            oldText =
                                `Template Name : ${oldT.TemplateName}\n\n` +
                                oldArr.join("\n\n");
                        }

                        if (newArr.length) {
                            newText =
                                `Template Name : ${TemplateName}\n\n` +
                                newArr.join("\n\n");
                        }

                        return {
                            old: oldText,
                            new: newText
                        };
                        
                    }


                    $scope.AddNewAssesTemplates = function () {
                        // The five section arrays are what the new design edits - AssessmentNotesArray is built from them
                        $scope.SetTemplateAssessmentNotes($scope.AssestemplateObj);
                        if ($scope.AssestemplateObj.TemplateName === "") {
                            alertify.error("Please Enter Template Name");
                            return false;
                        }
                        if ($scope.AssestemplateObj.DiagnosisArray.length === 0) {
                            alertify.error("Please Select The Diagnosis To Create The Template");
                            return false;
                        }
                        //if ($scope.AssestemplateObj.DiagnosisArray.length === 0 && $scope.AssestemplateObj.InvestigationsArray.length === 0 && $scope.AssestemplateObj.ProceduresArray.length === 0 && $scope.AssestemplateObj.SurgeryArray.length === 0 && $scope.AssestemplateObj.ReferralArray.length === 0 && $scope.AssestemplateObj.MedicationsArray.length === 0) {
                        //    alertify.error("Please select data to create temlate");
                        //    return false;
                        //}
                        $scope.submitDiagnosis = [];
                        if ($scope.TemplateType === "update") {
                            $scope.submitDiagnosis = $scope.AssestemplateObj.DiagnosisArray;
                        }
                        else {
                            angular.forEach($scope.AssestemplateObj.DiagnosisArray, function (DItem) {
                                let dummyObj = {
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
                                    "DeleteInd": 'N',
                                    "SnomedCodeObject": '',

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
                                dummyObj.DiagnosisId = DItem.DiagnosisObject.DiagnosisId;
                                dummyObj.DiagnosisName = DItem.ICD10DIAGDESCRIPTION;
                                dummyObj.FullName = DItem.DiagnosisObject.FullName;
                                dummyObj.DiagnosisNotes = DItem.DiagnosisObject.DiagnosisNotes;
                                dummyObj.HospitalId = DItem.DiagnosisObject.HospitalId;
                                dummyObj.UserId = DItem.DiagnosisObject.UserId;
                                dummyObj.DiagnosisCode = DItem.DiagnosisObject.DiagnosisCode;
                                dummyObj.ICD10CODE = DItem.ICD10CODE;
                                dummyObj.SnomedCodeId = DItem.SnomedCodeId;
                                dummyObj.SnomedCode = DItem.SnomedCode;
                                dummyObj.SnomedDescription = DItem.SnomedDescription;
                                dummyObj.OrganId = DItem.OrganId;
                                dummyObj.OrganName = DItem.OrganName;
                                dummyObj.DiagnosisRiskLevel = DItem.DiagnosisRiskLevel;
                                dummyObj.DiagnosisStatus = DItem.DiagnosisStatus;
                                dummyObj.AssessmentPlan.AssessmentPlanTemplateId = DItem.AssessmentPlan.AssessmentPlanTemplateId || 0;
                                dummyObj.AssessmentPlan.PlanofDiscussionsNotes = DItem.AssessmentPlan.PlanofDiscussionsNotes || '';
                                dummyObj.AssessmentPlan.PatientInstructions = DItem.AssessmentPlan.PatientInstructions || '';
                                dummyObj.AssessmentPlan.DoctorNotes = DItem.AssessmentPlan.DoctorNotes || '';
                                dummyObj.AssessmentPlan.ActionsTaken = DItem.AssessmentPlan.ActionsTaken || '';
                                dummyObj.AssessmentPlan.AssessmentsNotes = DItem.AssessmentPlan.AssessmentsNotes || '';
                                dummyObj.ReferralArray = DItem.ReferralArray || [];
                                dummyObj.ProceduresArray = DItem.ProceduresArray || [];
                                dummyObj.InvestigationsArray = DItem.InvestigationsArray || [];
                                dummyObj.SurgeriesArray = DItem.SurgeryArray || [];
                                dummyObj.PlanOfCareNotesArray = DItem.PlanOfcareNotesArray || [];
                                dummyObj.ODSeverityId = DItem.ODSeverityId || 0;
                                dummyObj.OSSeverityId = DItem.OSSeverityId || 0;
                                dummyObj.RDiagnosisStatusId = DItem.RDiagnosisStatusId || '';
                                dummyObj.LDiagnosisStatusId = DItem.LDiagnosisStatusId || '';
                                dummyObj.TemplateDiagnosisId = DItem.TemplateDiagnosisId || '';
                                dummyObj.DeleteInd = DItem.DeleteInd;
                                dummyObj.SeverityId1 = DItem.SeverityId1;
                                dummyObj.SeverityId2 = DItem.SeverityId2;

                                $scope.submitDiagnosis.push(dummyObj);
                            });
                        }                        

                        $scope.InvestigationsArray = [];
                        $scope.ProceduresArray = [];
                        $scope.SurgeryArray = [];
                        $scope.ReferralArray = [];

                        if ($scope.AssestemplateObj.InvestigationsArray.length > 0) {
                            angular.forEach($scope.AssestemplateObj.InvestigationsArray, function (OItem) {
                                if (OItem.OrderTypeId == 1) {
                                    $scope.InvestigationsArray.push(OItem);
                                }
                            });
                        }
                        if ($scope.AssestemplateObj.ProceduresArray.length > 0) {
                            angular.forEach($scope.AssestemplateObj.ProceduresArray, function (OItem) {
                                if (OItem.OrderTypeId == 2) {
                                    $scope.ProceduresArray.push(OItem);
                                }
                            });
                        }
                        if ($scope.AssestemplateObj.SurgeryArray.length > 0) {
                            angular.forEach($scope.AssestemplateObj.SurgeryArray, function (OItem) {
                                if (OItem.OrderTypeId == 3) {
                                    $scope.SurgeryArray.push(OItem);
                                }
                            });
                        }
                        if ($scope.AssestemplateObj.ReferralArray.length > 0) {
                            angular.forEach($scope.AssestemplateObj.ReferralArray, function (rItem) {
                                $scope.ReferralArray.push(rItem);
                            });
                        }
                        $scope.AssestemplateObj.MedicationsArray = $scope.AssestemplateObj.MedicationsArray || [];

                        var params = {
                            "UserId": doctorinfo.doctorid,
                            "OrganizationId": $scope.HospitalId,
                            "TemplateId": $scope.AssestemplateObj.TemplateId || 0,
                            "TemplateName": $scope.AssestemplateObj.TemplateName || '',
                            "DiagnosisArray": $scope.submitDiagnosis,
                            "MedicationsArray": $scope.AssestemplateObj.MedicationsArray || [],
                            //"AnteriorSegmentArrayNew": $scope.AnteriorSegmentArrayNew || [],
                            //"PoteriorSegmentArrayNew": $scope.PoteriorSegmentArrayNew || [],
                            //"ExternalExaminationsValuesArray": $scope.ExternalExaminationsValuesArray,
                            "DeleteInd": 0,
                            "IsTemplateFavorites": $scope.diagnosis.IsFavorite || false,
                            "IsDiagnosisMultiple": false,
                            "SetasTemplate": false,
                            "InvestigationsArray": $scope.InvestigationsArray,
                            "ProceduresArray": $scope.ProceduresArray,
                            "SurgeryArray": $scope.SurgeryArray,
                            "ReferralArray": $scope.ReferralArray,
                            //    "ChiefComplaintsArray": $scope.AllCheifcomplaints || [],
                            /* The notes as five separate sections, one row per point */
                            "AssessmentNotesArray": {
                                "PlanArray": $scope.GetTemplateSectionRows("PlanArray", $scope.AssestemplateObj),
                                "AssessmentArray": $scope.GetTemplateSectionRows("AssessmentArray", $scope.AssestemplateObj),
                                "PatientInstructionArray": $scope.GetTemplateSectionRows("PatientInstructionArray", $scope.AssestemplateObj),
                                "DoctorNotesArray": $scope.GetTemplateSectionRows("DoctorNotesArray", $scope.AssestemplateObj),
                                "ActionsTakenArray": $scope.GetTemplateSectionRows("ActionsTakenArray", $scope.AssestemplateObj)
                            },
                            "Logs": {}
                        }
                        if ($scope.TemplateType !== "update") {
                            let finalDesc = "";
                            let logDesc = buildAssessmentTemplateLog(angular.extend({}, params, { "AssessmentNotesArray": $scope.AssestemplateObj.AssessmentNotesArray || [] }));
                            finalDesc += (finalDesc ? "\n\n" : "") + `Template Name : ${params.TemplateName}\n`  + logDesc;
                            if (finalDesc) {
                                $scope.LogObj.LogArray.push({
                                    LogId: 0,
                                    ModuleId: 1,
                                    ModuleName: "OUTPatient",
                                    SubModuleId: 53,
                                    SubModuleName: "Assessment Plan",
                                    ScreenType: "Assessment Template",
                                    ActionType: "Added",
                                    OldActionDescription:  "",
                                    NewActionDescription: finalDesc,
                                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                                });
                            }
                        }
                        if ($scope.TemplateType === "update") {

                            $scope.submitDiagnosis.forEach(newDx => {

                                let oldTemplate = getOldTemplateRecord(
                                    newDx.DiagnosisId,
                                    $scope.AssestemplateObj.TemplateId
                                );

                                if (!oldTemplate) return;

                                let result = compareTemplate(oldTemplate, params.DiagnosisArray, $scope.AssestemplateObj.AssessmentNotesArray || [], params.InvestigationsArray, params.ProceduresArray, params.SurgeryArray, params.ReferralArray, params.MedicationsArray, params.TemplateName);
                                if (!result) return;

                                $scope.LogObj.LogArray.push({
                                    LogId: 0,
                                    ModuleId: 1,
                                    ModuleName: "OUTPatient",
                                    SubModuleId: 70,
                                    SubModuleName: "Assessment Template",
                                    ScreenType: "Assessment Template",
                                    ActionType: "Edited",
                                    OldActionDescription: result.old,
                                    NewActionDescription: result.new,
                                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                                });
                            });
                        }

                        //if ($scope.LogObj.LogArray.length > 0) {
                        //    params.Logs = $scope.LogObj || {};
                        //}
                        eHnotePatientDataService.AddUpdateUserConsultationTemplateDetailsv2(params).then(function (resp) {
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
                                if ($scope.DiagnosisTemplateId === 0) {
                                    alertify.success("Save successfully");
                                } else {
                                    alertify.success("Update successfully");
                                }
                                $scope.AssestemplateObj = angular.copy($scope.GetAssesNewtemplate());
                                $uibModalInstance.close();
                            }
                        }, function (err) {

                        });

                    }
                    //$scope.maxSize = 50;
                    $scope.GetTemplateAssesObj = function () {
                        return {
                            "SnomedCodeId": 0,
                            "SnomedCode": "",
                            "CreatedDateTime": "",
                            "ConsultationDiagnosisId": 0,
                            "AssessmentPlanId": 0,
                            "AssessmentPlan": {
                                "AssessmentPlanId": 0,
                                "PlanofDiscussionsNotes": "",
                                "PatientInstructions": "",
                                "AssessmentsNotes": "",
                                "DoctorNotes": "",
                                "ActionsTaken": "",
                                "DeleteInd": 'N'
                            },
                            "SpecializationId": $scope.SpecializationId,
                            "Type": "Optha",
                            "PriorityId": null,
                            "DiagnosisId": 0,
                            "PlanofDiscussionsNotes": "",
                            "PatientInstructions": "",
                            "AssessmentsNotes": "",
                            "SubTab": "1",
                            "DoctorNotes": "",
                            "DiagnosisObject": "",
                            "DiagnosisRiskLevel": 'Mild',
                            "FindingDiagnosisId": 0,
                            "DiagnosisHistoryId": 0,
                            "ICD10CODE": "",
                            "ICD10DIAGDESCRIPTION": "",
                            "ICD10DIAGNAME": "",
                            "PlanOfcareNotesArray": [],
                            "ProceduresArray": [],
                            "PrescriptionArray": [],
                            "SurgeryArray": [],
                            "InvestigationsArray": [],
                            "InvestigationFindingId": 0,
                            "FindingId": 0,
                            //"ActiveInd": "Y",
                            "DeleteInd": "N",
                            "ProceduresAddedTime": "",
                            "PrescriptionAddedTime": "",
                            "PlanOfCareAddedTime": "",
                            "SurgeryAddedTime": "",
                            "IsEditData": false,
                            "SelectedInvestigationObj": "",
                            "InvsearchBy": 1,
                            "OPDPsearchBy": 1,
                            "SurgerysearchBy": 1,
                            "ProcedureSurgerysearchBy": 1,
                            "ReferralArray": [],
                            "ActionsTaken": "",
                            "RVerificationStatusId": 1,
                            "LVerificationStatusId": 1,
                            "MasterCareEpisodeId": null,
                            "IsCheckedDiagnosis": false,
                            "MasterCareEpisodeId": null,
                            "MedicalPrescriptionDetails": [],
                            "CodeSystem": '',
                            "LocationId1": 0,
                            "Location1": "",
                            "SeverityId1": 0,
                            "Verificationstatusid1": 0,
                            //"DiagnosisStatusId1": 6,
                            //"DiagnosisStatus1": 'Not Examined',
                            "DiagnosisStatusId1": 2,
                            "DiagnosisStatus1": 'Active',
                            "EndDate1": '',
                            "StartDate1": $filter('date')(new Date(), "yyyy-MM-dd h:mm a") || '',
                            "LocationId2": 0,
                            "Location2": "",
                            "SeverityId2": 0,
                            "Verificationstatusid2": 0,
                            "DiagnosisStatusId2": 0,
                            "DiagnosisStatus2": '',
                            "EndDate2": '',
                            "StartDate2": $filter('date')(new Date(), "yyyy-MM-dd h:mm a") || '',

                        };
                    };
                    $scope.TemplateAssesSelectionObj = angular.copy($scope.GetTemplateAssesObj());

                    $scope.DeletAssessmentPlan = function (item, type) {
                        var index = $scope.AssestemplateObj.DiagnosisArray.indexOf(item);
                        if (item.ConsultationDiagnosisId === 0) {
                            if (index > -1) {
                                $scope.AssestemplateObj.DiagnosisArray.splice(index, 1);

                            }
                        } else {
                            item.DeleteInd = "Y";
                        }
                    }
                    $scope.ClearNoteToAssestemplates = function (type) {
                        type = type || 0;
                        if (type == 1) {
                            $scope.AssestemplateObj.PlanofDiscussionnotes = '';
                        }
                        else if (type == 2) {
                            $scope.AssestemplateObj.AssessmentsNotes = '';

                        }
                        else if (type == 3) {
                            $scope.AssestemplateObj.PatientInstructions = '';

                        }
                        else if (type == 4) {
                            $scope.AssestemplateObj.ActionTakenNotes = '';
                        }
                        else if (type == 5) {
                            $scope.AssestemplateObj.DoctorsNotes = '';
                        }

                    }

                    //$scope.ChangetemplatAssesRcopia = function () {
                    //    if ($scope.AssestemplateObj.IsRcopiaa) {
                    //        $scope.AssestemplateObj.ICDCode = null;
                    //    }
                    //}


                    $scope.RemoveTempltAssessmentNotes = function (item, index) {
                        item.PlanNoteId = item.PlanNoteId || 0;
                        if (item.PlanNoteId == 0) {
                            if (index > -1) {
                                $scope.AssestemplateObj.AssessmentNotesArray.splice(index, 1);
                            }
                        } else {
                            item.DeleteInd = 'Y';
                        }
                    };

                    // New design: Enter adds the typed point (Shift+Enter keeps a line break) through the old design's add, then clears the input
                    $scope.AddTemplateNoteOnEnter = function (event, type, text) {
                        if (event.keyCode !== 13 || event.shiftKey) {
                            return;
                        }
                        event.preventDefault();
                        if ((text || '').trim()) {
                            $scope.AddNoteToAssestemplates(type);
                            $scope.ClearNoteToAssestemplates(type);
                        }
                    };

                    $scope.AddNoteToAssestemplatesAndShowNewAddNote = function (type) {

                        $scope.AddNoteToAssestemplates(type, 'AddNew');


                    }

                    $scope.AddNoteToAssestemplates = function (type, addtype) {
                        type = type || 0;
                        var addtype = addtype || "";
                        if (type == 1) {
                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 1,
                                "NoteType": "Plan of Discussion",
                                "Notes": $scope.AssestemplateObj.PlanofDiscussionnotes || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.PlanofDiscussionnotes != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                $scope.AssestemplateObj.IsPlanofDiscussionnotes = false;

                                if (addtype == 'AddNew') {
                                    $scope.ShowAddnewPlanofDiscussionnotes();
                                }

                            } else {
                                alertify.error("Please Enter Plan of Discussion");
                            }


                        }
                        else if (type == 2) {
                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 2,
                                "NoteType": "Assessment",
                                "Notes": $scope.AssestemplateObj.AssessmentsNotes || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.AssessmentsNotes != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);

                                $scope.AssestemplateObj.IsAssessmentsNotes = false;
                                if (addtype == 'AddNew') {
                                    $scope.ShowAddnewAssessmentsNotes();
                                }

                            } else {
                                alertify.error("Please Enter Assessment");
                            }
                        }
                        else if (type == 3) {
                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 3,
                                "NoteType": "Patient Instructions",
                                "Notes": $scope.AssestemplateObj.PatientInstructions || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.PatientInstructions != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                $scope.AssestemplateObj.IsPatientInstructions = false;

                                if (addtype == 'AddNew') {
                                    $scope.ShowAddnewPatientInstructions();
                                }
                            } else {
                                alertify.error("Please Enter Patient Instructions");
                            }
                        }
                        else if (type == 4) {
                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 4,
                                "NoteType": "Action Taken",
                                "Notes": $scope.AssestemplateObj.ActionTakenNotes || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.ActionTakenNotes != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                $scope.AssestemplateObj.IsActionTakenNotes = false;

                                if (addtype == 'AddNew') {
                                    $scope.ShowAddnewActionTakenNotes();
                                }
                            } else {
                                alertify.error("Please Enter Action Taken");
                            }
                        }
                        else if (type == 5) {

                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 5,
                                "NoteType": "Doctor Notes",
                                "Notes": $scope.AssestemplateObj.DoctorsNotes || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.DoctorsNotes != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                $scope.AssestemplateObj.IsDoctorsNotes = false;

                                if (addtype == 'AddNew') {
                                    $scope.AddNoteToAssestemplates(5);
                                }
                            } else {
                                alertify.error("Please Enter Doctor Notes");
                            }
                        }


                    }
                    $scope.ShowAddnewPlanofDiscussionnotes = function () {
                        $scope.AssestemplateObj.PlanofDiscussionnotes = '';
                        if ($scope.AssestemplateObj.IsAssessmentsNotes) {
                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 2,
                                "NoteType": "Assessment",
                                "Notes": $scope.AssestemplateObj.AssessmentsNotes || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.AssessmentsNotes != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);

                                $scope.AssestemplateObj.IsAssessmentsNotes = false;
                            } else {
                                $scope.AssestemplateObj.IsAssessmentsNotes = false;

                            //    alertify.error("Please Enter Assessment");
                            }
                        }
                        else if ($scope.AssestemplateObj.IsPatientInstructions) {
                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 3,
                                "NoteType": "Patient Instructions",
                                "Notes": $scope.AssestemplateObj.PatientInstructions || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.PatientInstructions != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                $scope.AssestemplateObj.IsPatientInstructions = false;

                            } else {
                                $scope.AssestemplateObj.IsPatientInstructions = false;

                            //    alertify.error("Please Enter Patient Instructions");
                            }
                        }
                        else if ($scope.AssestemplateObj.IsActionTakenNotes) {
                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 4,
                                "NoteType": "Action Taken",
                                "Notes": $scope.AssestemplateObj.ActionTakenNotes || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.ActionTakenNotes != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                $scope.AssestemplateObj.IsActionTakenNotes = false;


                            } else {
                                $scope.AssestemplateObj.IsActionTakenNotes = false;

                            //    alertify.error("Please Enter Action Taken");
                            }
                        }
                        else if ($scope.AssestemplateObj.IsDoctorsNotes) {

                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 5,
                                "NoteType": "Doctor Notes",
                                "Notes": $scope.AssestemplateObj.DoctorsNotes || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.DoctorsNotes != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                $scope.AssestemplateObj.IsDoctorsNotes = false;

                            } else {
                                $scope.AssestemplateObj.IsDoctorsNotes = false;

                            //    alertify.error("Please Enter Doctor Notes");
                            }
                        }
                        $scope.AssestemplateObj.IsPlanofDiscussionnotes = true;

                       
                    }
                    $scope.ShowAddnewAssessmentsNotes = function () {
                        $scope.AssestemplateObj.AssessmentsNotes = '';
                        if ($scope.AssestemplateObj.IsPlanofDiscussionnotes) {
                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 1,
                                "NoteType": "Plan of Discussion",
                                "Notes": $scope.AssestemplateObj.PlanofDiscussionnotes || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.PlanofDiscussionnotes != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                $scope.AssestemplateObj.IsPlanofDiscussionnotes = false;



                            } else {
                                $scope.AssestemplateObj.IsPlanofDiscussionnotes = false;

                            //    alertify.error("Please Enter Plan of Discussion");
                            }
                        }
                        else if ($scope.AssestemplateObj.IsPatientInstructions) {
                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 3,
                                "NoteType": "Patient Instructions",
                                "Notes": $scope.AssestemplateObj.PatientInstructions || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.PatientInstructions != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                $scope.AssestemplateObj.IsPatientInstructions = false;

                            } else {
                                $scope.AssestemplateObj.IsPatientInstructions = false;

                            //    alertify.error("Please Enter Patient Instructions");
                            }
                        }
                        else if ($scope.AssestemplateObj.IsActionTakenNotes) {
                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 4,
                                "NoteType": "Action Taken",
                                "Notes": $scope.AssestemplateObj.ActionTakenNotes || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.ActionTakenNotes != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                $scope.AssestemplateObj.IsActionTakenNotes = false;


                            } else {
                                $scope.AssestemplateObj.IsActionTakenNotes = false;

                            //    alertify.error("Please Enter Action Taken");
                            }
                        }
                        else if ($scope.AssestemplateObj.IsDoctorsNotes) {

                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 5,
                                "NoteType": "Doctor Notes",
                                "Notes": $scope.AssestemplateObj.DoctorsNotes || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.DoctorsNotes != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                $scope.AssestemplateObj.IsDoctorsNotes = false;

                            } else {
                                $scope.AssestemplateObj.IsDoctorsNotes = false;

                            //    alertify.error("Please Enter Doctor Notes");
                            }
                        }
                        $scope.AssestemplateObj.IsAssessmentsNotes = true;

                       
                    }
                    $scope.ShowAddnewPatientInstructions = function () {
                        $scope.AssestemplateObj.PatientInstructions = '';

                        if ($scope.AssestemplateObj.IsPlanofDiscussionnotes) {
                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 1,
                                "NoteType": "Plan of Discussion",
                                "Notes": $scope.AssestemplateObj.PlanofDiscussionnotes || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.PlanofDiscussionnotes != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                $scope.AssestemplateObj.IsPlanofDiscussionnotes = false;



                            } else {
                                $scope.AssestemplateObj.IsPlanofDiscussionnotes = false;
                            //    alertify.error("Please Enter Plan of Discussion");
                            }
                        }
                        else if ($scope.AssestemplateObj.IsAssessmentsNotes) {
                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 2,
                                "NoteType": "Assessment",
                                "Notes": $scope.AssestemplateObj.AssessmentsNotes || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.AssessmentsNotes != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);

                                $scope.AssestemplateObj.IsAssessmentsNotes = false;
                            } else {
                                $scope.AssestemplateObj.IsAssessmentsNotes = false;

                            //    alertify.error("Please Enter Assessment");
                            }
                        }
                        else if ($scope.AssestemplateObj.IsActionTakenNotes) {
                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 4,
                                "NoteType": "Action Taken",
                                "Notes": $scope.AssestemplateObj.ActionTakenNotes || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.ActionTakenNotes != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                $scope.AssestemplateObj.IsActionTakenNotes = false;


                            } else {
                                $scope.AssestemplateObj.IsActionTakenNotes = false;

                            //    alertify.error("Please Enter Action Taken");
                            }
                        }
                        else if ($scope.AssestemplateObj.IsDoctorsNotes) {

                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 5,
                                "NoteType": "Doctor Notes",
                                "Notes": $scope.AssestemplateObj.DoctorsNotes || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.DoctorsNotes != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                $scope.AssestemplateObj.IsDoctorsNotes = false;

                            } else {
                                $scope.AssestemplateObj.IsDoctorsNotes = false;

                            //    alertify.error("Please Enter Doctor Notes");
                            }
                        }


                        $scope.AssestemplateObj.IsPatientInstructions = true;


                    }
                    $scope.ShowAddnewActionTakenNotes = function () {
                        $scope.AssestemplateObj.ActionTakenNotes = '';

                        if ($scope.AssestemplateObj.IsPlanofDiscussionnotes) {
                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 1,
                                "NoteType": "Plan of Discussion",
                                "Notes": $scope.AssestemplateObj.PlanofDiscussionnotes || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.PlanofDiscussionnotes != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                $scope.AssestemplateObj.IsPlanofDiscussionnotes = false;



                            } else {
                                $scope.AssestemplateObj.IsPlanofDiscussionnotes = false;

                            //    alertify.error("Please Enter Plan of Discussion");
                            }
                        }
                        else if ($scope.AssestemplateObj.IsAssessmentsNotes) {
                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 2,
                                "NoteType": "Assessment",
                                "Notes": $scope.AssestemplateObj.AssessmentsNotes || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.AssessmentsNotes != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);

                                $scope.AssestemplateObj.IsAssessmentsNotes = false;
                            } else {
                                $scope.AssestemplateObj.IsAssessmentsNotes = false;

                            //    alertify.error("Please Enter Assessment");
                            }
                        }
                        else if ($scope.AssestemplateObj.IsPatientInstructions) {
                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 3,
                                "NoteType": "Patient Instructions",
                                "Notes": $scope.AssestemplateObj.PatientInstructions || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.PatientInstructions != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                $scope.AssestemplateObj.IsPatientInstructions = false;

                            } else {
                                $scope.AssestemplateObj.IsPatientInstructions = false;

                            //    alertify.error("Please Enter Patient Instructions");
                            }
                        }
                        else if ($scope.AssestemplateObj.IsDoctorsNotes) {

                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 5,
                                "NoteType": "Doctor Notes",
                                "Notes": $scope.AssestemplateObj.DoctorsNotes || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.DoctorsNotes != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                $scope.AssestemplateObj.IsDoctorsNotes = false;

                            } else {
                                $scope.AssestemplateObj.IsDoctorsNotes = false;

                            //    alertify.error("Please Enter Doctor Notes");
                            }
                        }
                        $scope.AssestemplateObj.IsActionTakenNotes = true;
                    }
                    $scope.ShowAddnewDoctorsNotes = function () {
                        $scope.AssestemplateObj.DoctorsNotes = '';
                        if ($scope.AssestemplateObj.IsPlanofDiscussionnotes) {
                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 1,
                                "NoteType": "Plan of Discussion",
                                "Notes": $scope.AssestemplateObj.PlanofDiscussionnotes || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.PlanofDiscussionnotes != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                $scope.AssestemplateObj.IsPlanofDiscussionnotes = false;



                            } else {
                                $scope.AssestemplateObj.IsPlanofDiscussionnotes = false;

                            //    alertify.error("Please Enter Plan of Discussion");
                            }
                        }
                        else if ($scope.AssestemplateObj.IsAssessmentsNotes) {
                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 2,
                                "NoteType": "Assessment",
                                "Notes": $scope.AssestemplateObj.AssessmentsNotes || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.AssessmentsNotes != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);

                                $scope.AssestemplateObj.IsAssessmentsNotes = false;
                            } else {
                                $scope.AssestemplateObj.IsAssessmentsNotes = false;

                            //    alertify.error("Please Enter Assessment");
                            }
                        }
                        else if ($scope.AssestemplateObj.IsPatientInstructions) {
                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 3,
                                "NoteType": "Patient Instructions",
                                "Notes": $scope.AssestemplateObj.PatientInstructions || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.PatientInstructions != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                $scope.AssestemplateObj.IsPatientInstructions = false;

                            } else {
                                $scope.AssestemplateObj.IsPatientInstructions = false;

                            //    alertify.error("Please Enter Patient Instructions");
                            }
                        }
                        else if ($scope.AssestemplateObj.IsActionTakenNotes) {
                            let obj = {
                                "PlanNoteId": 0,
                                "NoteTypeId": 4,
                                "NoteType": "Action Taken",
                                "Notes": $scope.AssestemplateObj.ActionTakenNotes || "",
                                "DeleteInd": "N",
                            }
                            if ($scope.AssestemplateObj.ActionTakenNotes != '') {
                                $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                $scope.AssestemplateObj.IsActionTakenNotes = false;


                            } else {
                                $scope.AssestemplateObj.IsActionTakenNotes = false;

                            //    alertify.error("Please Enter Action Taken");
                            }
                        }
                        $scope.AssestemplateObj.IsDoctorsNotes = true;
                    }

                    $scope.OnSelectAssesTemplteDiagnosis = function (mainobject, type) {

                        if (type == 'ehnote') {
                            if ($scope.AssestemplateObj.DiagnosisArray.length > 0) {
                                var filterdiagnosis = $filter("filter")($scope.AssestemplateObj.DiagnosisArray, { "DiagnosisId": mainobject.DiagnosisObject.DiagnosisId, "DeleteInd": "N" }, true);
                                if (filterdiagnosis.length > 0) {
                                    $scope.TemplateAssesSelectionObj.DiagnosisObject = "";
                                    alertify.error("Diagnosis Already Added");
                                    return false;
                                }
                            }
                            $scope.TemplateAssesSelectionObj.DiagnosisId = mainobject.DiagnosisObject.DiagnosisId;
                            $scope.TemplateAssesSelectionObj.OrganizationDiagnosisId = mainobject.DiagnosisObject.OrganizationDiagnosisId;
                            $scope.TemplateAssesSelectionObj.ICD10CODE = mainobject.DiagnosisObject.ICD10CODE;
                            $scope.TemplateAssesSelectionObj.ICD10DIAGNAME = mainobject.DiagnosisObject.DiagnosisName;
                            $scope.TemplateAssesSelectionObj.ICD10DIAGDESCRIPTION = mainobject.DiagnosisObject.FullName;
                            $scope.TemplateAssesSelectionObj.DiagnosisName = mainobject.DiagnosisObject.DiagnosisName;
                            $scope.TemplateAssesSelectionObj.DiagnosisDescription = mainobject.DiagnosisObject.FullName;
                            $scope.TemplateAssesSelectionObj.OrganizationDiagnosisId = mainobject.DiagnosisObject.OrganizationDiagnosisId;
                            $scope.TemplateAssesSelectionObj.CodeSystem = "ICD";

                        }

                        if (type == 'rcopia') {

                            if ($scope.AssestemplateObj.DiagnosisArray.length > 0) {
                                var filterdiagnosis = $filter("filter")($scope.AssestemplateObj.DiagnosisArray, { "ICD10CODE": mainobject.DiagnosisObject.ICD10Code, "DeleteInd": "N" }, true);
                                if (filterdiagnosis.length > 0) {
                                    $scope.TemplateAssesSelectionObj.DiagnosisObject = "";
                                    alertify.error("Diagnosis Already Added");
                                    return false;
                                }
                            }



                            $scope.TemplateAssesSelectionObj.ICD10CODE = mainobject.DiagnosisObject.ICD10Code;
                            $scope.TemplateAssesSelectionObj.ICD10DIAGNAME = mainobject.DiagnosisObject.ICD10Description;
                            $scope.TemplateAssesSelectionObj.ICD10DIAGDESCRIPTION = mainobject.DiagnosisObject.ICD10Description;
                            $scope.TemplateAssesSelectionObj.DiagnosisName = mainobject.DiagnosisObject.ICD10Description;
                            $scope.TemplateAssesSelectionObj.DiagnosisDescription = mainobject.DiagnosisObject.ICD10Description;
                            $scope.TemplateAssesSelectionObj.SnomedCode = mainobject.DiagnosisObject.SNOMEDConceptID;
                            $scope.TemplateAssesSelectionObj.SnomedCodeDescription = mainobject.DiagnosisObject.SNOMEDDescription;
                            $scope.TemplateAssesSelectionObj.CodeSystem = "ICD";


                            var req = {
                                "UserId": $scope.UserId,
                                "OrganizationId": $scope.HospitalId,
                                "ICD10CODE": $scope.TemplateAssesSelectionObj.ICD10CODE || "",
                                "ICD10Description": mainobject.DiagnosisObject.ICD10Description || "",
                                "SNOMEDConceptId": $scope.TemplateAssesSelectionObj.SnomedCode || "",
                                "SNOMEDDescription": $scope.TemplateAssesSelectionObj.SnomedCodeDescription || "",
                                "DiagnosisId": $scope.TemplateAssesSelectionObj.DiagnosisId || 0,
                                "OrgDiagnosisId": $scope.TemplateAssesSelectionObj.OrganizationDiagnosisId || 0
                            }
                            eHnoteSettingsDataService.UpdateDiagnosisFromRcopia(req).then(function (response) {
                                console.log(JSON.stringify(response));
                                if (response.data.status === 'Success') {
                                    mainobject.DiagnosisId = response.data.DiagnosisId;
                                    mainobject.OrganizationDiagnosisId = response.data.OrgDiagnosisId;
                                    mainobject.DiagnosisObject.DiagnosisId = response.data.DiagnosisId;
                                    mainobject.DiagnosisObject.OrganizationDiagnosisId = response.data.OrgDiagnosisId;
                                    if (type == 'rcopia') {
                                        $scope.AssestemplateObj.DiagnosisArray.push(mainobject);
                                    }
                                }

                            });
                        }
                        if (type == 'Snomed') {
                            if ($scope.AssestemplateObj.DiagnosisArray.length > 0) {
                                var filterdiagnosis = $filter("filter")($scope.AssestemplateObj.DiagnosisArray, { "SnomedCodeId": mainobject.DiagnosisObject.SnomedCodeId, "DeleteInd": "N" }, true);
                                if (filterdiagnosis.length > 0) {
                                    $scope.TemplateAssesSelectionObj.DiagnosisObject = "";
                                    alertify.error("Snomed Already Added");
                                    return false;
                                }
                            }


                            $scope.TemplateAssesSelectionObj.SnomedCodeId = mainobject.DiagnosisObject.SnomedCodeId;
                            $scope.TemplateAssesSelectionObj.OrganizationDiagnosisId = mainobject.DiagnosisObject.OrganizationDiagnosisId;

                            $scope.TemplateAssesSelectionObj.ICD10CODE = mainobject.DiagnosisObject.ConceptId;
                            $scope.TemplateAssesSelectionObj.ICD10DIAGNAME = mainobject.DiagnosisObject.Description;
                            $scope.TemplateAssesSelectionObj.ICD10DIAGDESCRIPTION = mainobject.DiagnosisObject.Description;
                            $scope.TemplateAssesSelectionObj.CodeSystem = "Snomed-CT";
                        }

                        if (mainobject.DiagnosisObject.OrganId == 1) {
                            mainobject.LocationId1 = 1;
                            mainobject.Location1 = 'OD';
                            mainobject.DiagnosisStatusId1 = 2;
                            mainobject.DiagnosisStatus1 = 'Active';
                            mainobject.OrganId = 1;
                        }
                        else if (mainobject.DiagnosisObject.OrganId == 2) {
                            mainobject.LocationId1 = 2;
                            mainobject.Location1 = 'OS';
                            mainobject.DiagnosisStatusId1 = 2;
                            mainobject.DiagnosisStatus1 = 'Active';
                            mainobject.OrganId = 2;
                        }
                        else if (mainobject.DiagnosisObject.OrganId == 3) {
                            mainobject.LocationId1 = 1;
                            mainobject.LocationId2 = 2;
                            mainobject.Location1 = 'OD';
                            mainobject.Location2 = 'OS';
                            mainobject.OrganId = 3;
                            mainobject.DiagnosisStatusId1 = 2;
                            mainobject.DiagnosisStatus1 = 'Active';
                            mainobject.DiagnosisStatusId2 = 2;
                            mainobject.DiagnosisStatus2 = 'Active';
                            mainobject.IsLocation2Added = true;
                        } else if (mainobject.DiagnosisObject.OrganId == 0) {
                            mainobject.LocationId1 = 0;
                            mainobject.Location1 = '';
                        }

                        if (type != 'rcopia') {
                            $scope.AssestemplateObj.DiagnosisArray.push(mainobject);
                        }

                        $scope.TemplateAssesSelectionObj = angular.copy($scope.GetTemplateAssesObj());
                    }

                    if (Type !== '') {
                        if ($scope.DiagnosisFromAssessmentPopup.length > 0) {
                            var TempAssessmentArray = $filter("filter")($scope.DiagnosisFromAssessmentPopup, { "IsEditData": true, "DeleteInd": "N" }, true) || [];

                            if (TempAssessmentArray.length > 0) {
                                TempAssessmentArray[0].DiagnosisObject = TempAssessmentArray[0].DiagnosisObject || '';
                                if (TempAssessmentArray[0].DiagnosisObject == '') {
                                    var DiagObj = {
                                        'DiagnosisCode': TempAssessmentArray[0].DiagnosisCode || null,
                                        'DiagnosisId': TempAssessmentArray[0].DiagnosisId || null,
                                        'DiagnosisName': TempAssessmentArray[0].DiagnosisName || '',
                                        'DiagnosisNotes': TempAssessmentArray[0].DiagnosisNotes || '',
                                        'FullName': TempAssessmentArray[0].FullName || '',
                                        'HospitalId': TempAssessmentArray[0].HospitalId || 0,
                                        'ICD10CODE': TempAssessmentArray[0].ICD10CODE || '',
                                        'OrganId': TempAssessmentArray[0].OrganId || null,
                                        'OrganizationDiagnosisId': TempAssessmentArray[0].OrganizationDiagnosisId || null,
                                        'ParentDiagnosisId': TempAssessmentArray[0].ParentDiagnosisId || 0,
                                        'SeverityId': TempAssessmentArray[0].SeverityId ||null,
                                        'UserId': TempAssessmentArray[0].UserId ||null,
                                    }
                                    TempAssessmentArray[0].DiagnosisObject = angular.copy(DiagObj);
                                }
                                TempAssessmentArray[0].AssessmentPlan.PlanofDiscussionsNotes = TempAssessmentArray[0].AssessmentPlan.PlanofDiscussionsNotes || '';
                                TempAssessmentArray[0].AssessmentPlan.AssessmentsNotes = TempAssessmentArray[0].AssessmentPlan.AssessmentsNotes || '';
                                TempAssessmentArray[0].AssessmentPlan.PatientInstructions = TempAssessmentArray[0].AssessmentPlan.PatientInstructions || '';
                                TempAssessmentArray[0].AssessmentPlan.ActionsTaken = TempAssessmentArray[0].AssessmentPlan.ActionsTaken || '';
                                TempAssessmentArray[0].AssessmentPlan.DoctorNotes = TempAssessmentArray[0].AssessmentPlan.DoctorNotes || '';
                                $scope.AssestemplateObj.AssessmentNotesArray = [];
                                //if (TempAssessmentArray[0].AssessmentPlan.PlanofDiscussionsNotes !== '') {
                                //    let obj = {
                                //        "PlanNoteId": 0,
                                //        "NoteTypeId": 1,
                                //        "NoteType": "Plan of Discussion",
                                //        "Notes": TempAssessmentArray[0].AssessmentPlan.PlanofDiscussionsNotes || "",
                                //        "DeleteInd": "N",
                                //    }
                                //    $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                //}
                                //if (TempAssessmentArray[0].AssessmentPlan.AssessmentsNotes !== '') {
                                //    let obj = {
                                //        "PlanNoteId": 0,
                                //        "NoteTypeId": 2,
                                //        "NoteType": "Assessment",
                                //        "Notes": TempAssessmentArray[0].AssessmentPlan.AssessmentsNotes || "",
                                //        "DeleteInd": "N",
                                //    }
                                //    $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                //}
                                //if (TempAssessmentArray[0].AssessmentPlan.PatientInstructions !== '') {
                                //    let obj = {
                                //        "PlanNoteId": 0,
                                //        "NoteTypeId": 3,
                                //        "NoteType": "Patient Instructions",
                                //        "Notes": TempAssessmentArray[0].AssessmentPlan.PatientInstructions || "",
                                //        "DeleteInd": "N",
                                //    }
                                //    $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                //}
                                //if (TempAssessmentArray[0].AssessmentPlan.ActionsTaken !== '') {
                                //    let obj = {
                                //        "PlanNoteId": 0,
                                //        "NoteTypeId": 4,
                                //        "NoteType": "Action Taken",
                                //        "Notes": TempAssessmentArray[0].AssessmentPlan.ActionsTaken || "",
                                //        "DeleteInd": "N",
                                //    }
                                //    $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                //}
                                //if (TempAssessmentArray[0].AssessmentPlan.DoctorNotes !== '') {
                                //    let obj = {
                                //        "PlanNoteId": 0,
                                //        "NoteTypeId": 5,
                                //        "NoteType": "Doctor Notes",
                                //        "Notes": TempAssessmentArray[0].AssessmentPlan.DoctorNotes || "",
                                //        "DeleteInd": "N",
                                //    }
                                //    $scope.AssestemplateObj.AssessmentNotesArray.push(obj);
                                //}

                                /* Every point of the visit's sections becomes its own template note, from the section's
                                  array when it has one, else from the notes string (one point per line, without its bullet) */
                                let VisitNoteSections = [
                                    { "NoteTypeId": 1, "NoteType": "Plan of Discussion", "NotesKey": "PlanofDiscussionsNotes", "ArrayKey": "PlanArray", "TextKey": "AssessmentPlanNotes" },
                                    { "NoteTypeId": 2, "NoteType": "Assessment", "NotesKey": "AssessmentsNotes", "ArrayKey": "AssessmentArray", "TextKey": "AssessmentNotestext" },
                                    { "NoteTypeId": 3, "NoteType": "Patient Instructions", "NotesKey": "PatientInstructions", "ArrayKey": "PatientInstructionArray", "TextKey": "PatientInstrNotes" },
                                    { "NoteTypeId": 4, "NoteType": "Action Taken", "NotesKey": "ActionsTaken", "ArrayKey": "ActionsTakenArray", "TextKey": "ActionsTakenNotes" },
                                    { "NoteTypeId": 5, "NoteType": "Doctor Notes", "NotesKey": "DoctorNotes", "ArrayKey": "DoctorNotesArray", "TextKey": "AssmntDoctorNotes" }
                                ];
                                angular.forEach(VisitNoteSections, function (section) {
                                    let AssessmentPlan = TempAssessmentArray[0].AssessmentPlan;
                                    let SectionRows = AssessmentPlan[section.ArrayKey];
                                    let NoteTexts = [];

                                    if (angular.isArray(SectionRows) && SectionRows.length > 0) {
                                        angular.forEach(SectionRows, function (row) {
                                            if (row && row.DeleteInd !== 'Y' && String(row[section.TextKey] || '').trim()) {
                                                NoteTexts.push(String(row[section.TextKey]).trim());
                                            }
                                        });
                                    } else {
                                        angular.forEach(String(AssessmentPlan[section.NotesKey] || '').split(/\r?\n/), function (line) {
                                            let text = line.replace(/^\s*[•·●▪◦]\s*/, '').trim();
                                            if (text) {
                                                NoteTexts.push(text);
                                            }
                                        });
                                    }

                                    angular.forEach(NoteTexts, function (text) {
                                        $scope.AssestemplateObj.AssessmentNotesArray.push({
                                            "PlanNoteId": 0,
                                            "NoteTypeId": section.NoteTypeId,
                                            "NoteType": section.NoteType,
                                            "Notes": text,
                                            "DeleteInd": "N",
                                        });
                                    });
                                });

                                $scope.SetTemplateSectionArrays($scope.AssestemplateObj);   // the new design edits the five section arrays



                                $scope.AssestemplateObj.DiagnosisArray.push(TempAssessmentArray[0]);
                            }
                        }
                    }

                    //orderstemplates
                    $scope.TemplatesOrderObj = {
                        'SearchProcedureObj': "",
                        'DiagnosisObject': "",
                        'SearchReferalObj': ""
                    };

                    $scope.OnClickTemplateOrders = function (mainitem, type) {


                        //if ($scope.AdvisedOrderDetailsArray.length > 0) {
                        //    var filterProcedure = $filter("filter")($scope.AdvisedOrderDetailsArray, function (Aitem, index) { return Aitem.OrgDescriptionId == Subitem.OrganizationProcedureId && Aitem.DeleteInd == 'N' },);
                        //    if (filterProcedure.length > 0) {
                        //        $scope.adviseObj.SearchProcedureObj = "";
                        //        alertify.error("Procedure Already Added");
                        //        return false;
                        //    }
                        //}



                        if (type == 'Order') {
                            if (mainitem.OrderTypeId == 1) {
                                var i = 0;
                                if ($scope.AssestemplateObj.InvestigationsArray.length > 0) {
                                    var filterProcedure = $filter("filter")($scope.AssestemplateObj.InvestigationsArray, function (Aitem, index) { return Aitem.OrgDescriptionId == mainitem.OrganizationProcedureId && Aitem.DeleteInd == 'N' },);
                                    if (filterProcedure.length > 0) {
                                        $scope.TemplatesOrderObj.SearchProcedureObj = '';
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
                                    $scope.AssestemplateObj.InvestigationsArray.push(object);
                                }

                            }
                            else if (mainitem.OrderTypeId == 2) {
                                var i = 0;
                                if ($scope.AssestemplateObj.ProceduresArray.length > 0) {
                                    var filterProcedure = $filter("filter")($scope.AssestemplateObj.ProceduresArray, function (Aitem, index) { return Aitem.OrgProcedureId == mainitem.OrganizationProcedureId && Aitem.DeleteInd == 'N' },);
                                    if (filterProcedure.length > 0) {
                                        $scope.TemplatesOrderObj.SearchProcedureObj = '';
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
                                    $scope.AssestemplateObj.ProceduresArray.push(object);
                                }

                            }
                            else if (mainitem.OrderTypeId == 3) {
                                var i = 0;
                                if ($scope.AssestemplateObj.SurgeryArray.length > 0) {
                                    var filterProcedure = $filter("filter")($scope.AssestemplateObj.SurgeryArray, function (Aitem, index) { return Aitem.OrgDescriptionId == mainitem.OrganizationProcedureId && Aitem.DeleteInd == 'N' },);
                                    if (filterProcedure.length > 0) {
                                        $scope.TemplatesOrderObj.SearchProcedureObj = '';
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
                                    $scope.AssestemplateObj.SurgeryArray.push(object);
                                }

                            }
                            $scope.TemplatesOrderObj.SearchProcedureObj = '';
                        }
                        else if (type == 'Referral') {
                            var i = 0;
                            if ($scope.AssestemplateObj.ReferralArray.length > 0) {
                                var filterOrder = $filter("filter")($scope.AssestemplateObj.ReferralArray, function (Aitem, index) { return Aitem.ReferralId == mainitem.ReferralId && Aitem.DeleteInd == 'N' },);
                                if (filterOrder.length > 0) {
                                    $scope.TemplatesOrderObj.SearchReferalObj = "";
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
                                $scope.AssestemplateObj.ReferralArray.push(obj);
                            }

                            $scope.TemplatesOrderObj.SearchReferalObj = "";

                        }



                    }

                    $scope.removeOrdersclick = function (item, diagType) {

                        if (diagType == 'Referal') {
                            var index = $scope.AssestemplateObj.ReferralArray.indexOf(item);
                            if (item.OrderReferralTemplateId == 0) {
                                if (index > -1) {
                                    $scope.AssestemplateObj.ReferralArray.splice(index, 1);
                                }
                            } else {
                                $scope.AssestemplateObj.ReferralArray[index].DeleteInd = 'Y';
                            }
                        } else if (diagType == 'Surgery') {
                            var index = $scope.AssestemplateObj.SurgeryArray.indexOf(item);
                            if (item.OrderTemplateId == 0) {
                                if (index > -1) {
                                    $scope.AssestemplateObj.SurgeryArray.splice(index, 1);
                                }
                            } else {
                                $scope.AssestemplateObj.SurgeryArray[index].DeleteInd = 'Y';
                            }
                        } else if (diagType == 'Procedure') {
                            var index = $scope.AssestemplateObj.ProceduresArray.indexOf(item);
                            if (item.OrderTemplateId == 0) {
                                if (index > -1) {
                                    $scope.AssestemplateObj.ProceduresArray.splice(index, 1);
                                }
                            } else {
                                $scope.AssestemplateObj.ProceduresArray[index].DeleteInd = 'Y';
                            }
                        } else if (diagType == 'Investigation') {
                            var index = $scope.AssestemplateObj.InvestigationsArray.indexOf(item);
                            if (item.OrderTemplateId == 0) {
                                if (index > -1) {
                                    $scope.AssestemplateObj.InvestigationsArray.splice(index, 1);
                                }
                            } else {
                                $scope.AssestemplateObj.InvestigationsArray[index].DeleteInd = 'Y';
                            }
                        } else { }
                    }
                    //orderstemplates

                    //medicationstemlates

                    $scope.GetTemplatemedicObj = {
                        "IsRcopiaa": true,
                        "MedicineObject": "",
                        "SearchText": "",
                        "PageSize": 10,
                        "PageNumber": 1,
                        "TotalItems": 0
                    };
                    function getTemplatesNewPrescriptionDetailObj() {
                        var obj = {
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
                    $scope.getMasterFieldDosageDataInAssesment();
                    $scope.OnselectTempaltePrescriptionMedication = function (obj, type) {
                        /*$scope.SigSearch.Shows = false;*/
                        obj.SigFields = false;
                        /*$scope.medicineGetObj.fastsig = false;*/
                        $scope.adnewsigobj.IsNewSig = false;
                        var newmedicationobj = getTemplatesNewPrescriptionDetailObj();
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
                                    if ($scope.AssestemplateObj.MedicationsArray.length > 0) {
                                        angular.forEach($scope.AssestemplateObj.MedicationsArray, function (item) {
                                            if (item.MedicationId == newmedicationobj.MedicationId && item.DeleteInd != 'Y') {
                                                medi++;
                                            }
                                        });
                                    }


                                    if (medi > 0) {
                                        alertify.error('You have already entered this Drug');
                                        $scope.GetTemplatemedicObj.MedicineObject = "";
                                    } else {
                                        $scope.AssestemplateObj.MedicationsArray.push(newmedicationobj);
                                        $scope.GetTemplatemedicObj.MedicineObject = "";
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
                            if ($scope.AssestemplateObj.MedicationsArray.length > 0) {
                                angular.forEach($scope.AssestemplateObj.MedicationsArray, function (item) {
                                    if (item.MedicationId == newmedicationobj.MedicationId && item.DeleteInd == 'N') {
                                        medi++;
                                    }
                                });
                            }
                            if (medi > 0) {
                                alertify.error('You have already entered this Drug');
                                $scope.GetTemplatemedicObj.MedicineObject = "";
                            } else {
                                $scope.AssestemplateObj.MedicationsArray.push(newmedicationobj);
                                $scope.GetTemplatemedicObj.MedicineObject = "";
                            }

                        }
                        $scope.getMasterFieldDosageDataInAssesment();
                    };

                    $scope.ONSigDetailsSig = function (item, mainitem) {
                        console.log(item);
                        console.log(mainitem);
                        mainitem.SigfieldsShows = true;

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
                                mainitem.StopDate = $filter('date')(futureDate, 'MM/dd/yyyy');/* $filter('date')(futureDate, 'MM/dd/yyyy HH:mm:ss');*/
                            }
                        }
                    };
                    $scope.changeSigForMedicine = function (item) {
                        item.Sig = "";
                        item.SigId = 0;
                    };
                    $scope.ShowSigFields = function (item) {
                        item.SigfieldsShows = !item.SigfieldsShows;
                    }
                    $scope.GetOrganizationMedicationlist = function (val) {

                        var req = {
                            "HospitalId": $scope.HospitalId,
                            "PageSize": 10,
                            "SearchText": val || '',
                            "PageNumber": 1,
                            "UserId": $scope.UserId,
                            "IsFrequent": "N",
                            "ParentOrganizationId": $scope.ParentHospitalId
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
                    $scope.addSIgNameDynamically = function () {
                        var dosesupplytest = "";
                        if ($scope.addNewOrganizationSigObj.DaysSupply !== '') {
                            dosesupplytest = " for " + $scope.addNewOrganizationSigObj.DaysSupply;
                        }
                        $scope.addNewOrganizationSigObj.Sig = $scope.addNewOrganizationSigObj.Action + " " + $scope.addNewOrganizationSigObj.Dose + " " + $scope.addNewOrganizationSigObj.DoseUnit + " " + $scope.addNewOrganizationSigObj.Route + " " + $scope.addNewOrganizationSigObj.Frequency + " " + $scope.addNewOrganizationSigObj.DoseOther + "" + dosesupplytest;
                    }
                    $scope.addnewOrganizationSig = function (item) {


                        var Obj = {
                            "UserId": $scope.UserId,
                            "HospitalId": $scope.HospitalID,
                            "doseArray": $scope.doseArray,
                            "actionArray": $scope.actionArray,
                            "refillsArray": $scope.refillsArray,
                            "doseOtherArray": $scope.doseOtherArray,
                            "frequencyArray": $scope.frequencyArray,
                            "durationArray": $scope.durationArray,
                            "routeArray": $scope.routeArray,
                            "doseUnitArray": $scope.doseUnitArray,
                            "quantityUnitArray": $scope.quantityUnitArray,
                            "MedicineId": item.MedicationId
                        }
                        var modalInstance = $uibModal.open({
                            "templateUrl": "templates/uibpopups/AddMedicationSigPopup.html",
                            "backdrop": "static",
                            "scope": $scope,
                            "windowClass": "modal__eighty--",
                            "keyboard": false,
                            //"size": "lg",
                            "resolve": {
                                "ParentObject": Obj
                            },
                            "controller": function ($scope, $uibModalInstance, eHnoteSettingsDataService, eHnotePatientDataService, ParentObject, alertify) {

                                console.log(ParentObject);





                                $scope.doseArray = [];
                                $scope.doseOtherArray = [];
                                $scope.frequencyArray = [];
                                $scope.refillsArray = [];
                                $scope.durationArray = [];
                                $scope.actionArray = [];
                                $scope.routeArray = [];
                                $scope.doseUnitArray = [];
                                $scope.quantityUnitArray = [];

                                $scope.getMasterFieldDosageData = function () {
                                    eHnoteDiagnosisDataServices.GetMedicineDosageFieldsMasterData().then(function (resp) {

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

                                $scope.getMasterFieldDosageData();



                                $scope.closeSigPopup = function () {
                                    $uibModalInstance.dismiss("cancel");
                                };


                                function getnewOrganizationSigObj() {
                                    var obj = {
                                        "UserId": $scope.UserId,
                                        "OrganizationSigTemplateId": 0,
                                        "OrganizationId": ParentObject.HospitalId,
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
                                        "DaysSupplyDescription": "",
                                        "Quantity": "",
                                        "QuantityUnitId": "",
                                        "QuantityUnit": "",
                                        "RefillId": "",
                                        "Refills": "",
                                        "DeleteInd": "N",
                                        "IsFrequent": "N",
                                        "PageSize": 10,
                                        "PageNumber": 1,
                                        "MedicineId": ParentObject.MedicineId,
                                    };

                                    return obj;
                                }


                                $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();






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
                                        mainobj.Frequency = filteredArray[0].Description;
                                    };
                                    $scope.addSIgNameDynamically();
                                };

                                $scope.changePopupPrescDoseOther = function (mainobj) {
                                    var filteredArray = $filter("filter")($scope.doseOtherArray, { "MedicineDosaageFieldId": mainobj.DoseOtherId }, true);
                                    if (filteredArray.length > 0) {
                                        mainobj.DoseOther = filteredArray[0].Code;
                                    };
                                    $scope.addSIgNameDynamically();
                                };

                                $scope.changePopupPrescDaysSupply = function (mainobj) {
                                    var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": mainobj.DaysSupplyId }, true);
                                    if (filteredArray.length > 0) {

                                        mainobj.DaysSupply = filteredArray[0].Code;
                                        mainobj.DaysSupplyDescription = filteredArray[0].Description;
                                    };
                                    $scope.addSIgNameDynamically();
                                };

                                $scope.addSIgNameDynamically = function () {
                                    var dosesupplytest = "";
                                    if ($scope.addNewOrganizationSigObj.DaysSupply !== '') {
                                        dosesupplytest = " for " + $scope.addNewOrganizationSigObj.DaysSupplyDescription;
                                    }
                                    $scope.addNewOrganizationSigObj.Sig = $scope.addNewOrganizationSigObj.Action + " " + $scope.addNewOrganizationSigObj.Dose + " " + $scope.addNewOrganizationSigObj.DoseUnit + " " + $scope.addNewOrganizationSigObj.Route + " " + $scope.addNewOrganizationSigObj.Frequency + " " + $scope.addNewOrganizationSigObj.DoseOther + "" + dosesupplytest;
                                }


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
                                $scope.changePrescDaysSupply = function (mainobj) {
                                    var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": mainobj.DaysSupplyId }, true);
                                    if (filteredArray.length > 0) {
                                        mainobj.DaysSupply = filteredArray[0].Code;
                                        var currentDate = new Date();
                                        var futureDate = new Date(currentDate.getTime() + (parseInt(mainobj.DaysSupply) * 24 * 60 * 60 * 1000));
                                        mainobj.StopDate = $filter('date')(futureDate, 'MM/dd/yyyy HH:mm:ss');
                                    }
                                    var Datecode = filteredArray[0].Code
                                    var currentDate = new Date();
                                    var futureDate = new Date(currentDate.getTime() + (parseInt(Datecode) * 24 * 60 * 60 * 1000));
                                    /*  mainobj.DaysSupply = $filter('date')(futureDate, 'MM/dd/yyyy HH:mm:ss');*/
                                    mainobj.DaysSupply = parseInt(Datecode);
                                };


                                $scope.SaveOrganizationSig = function () {
                                    console.log($scope.addNewOrganizationSigObj);
                                    if ($scope.addNewOrganizationSigObj.Sig == '') {
                                        alertify.error("Please Enter Sig");
                                        return false;
                                    }
                                    if ($scope.addNewOrganizationSigObj.Quantity == '') {
                                        alertify.error("Please Enter Quantity");
                                        return false;
                                    }

                                    if ($scope.addNewOrganizationSigObj.IsFrequent == true) {
                                        $scope.addNewOrganizationSigObj.IsFrequent = "Y";
                                    }

                                    eHnotePatientDataService.AddUpdateOrganizationMedicationSig($scope.addNewOrganizationSigObj, OnAddSigSuccess, OnAddSigError);
                                    function OnAddSigSuccess(response) {
                                        alertify.success("Sig Added  Successfully");
                                        $scope.savedSigs.push($scope.addNewOrganizationSigObj);
                                        $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
                                        //    $uibModalInstance.close('save');

                                        $scope.toggleAddSigFields();
                                        $scope.getOrganizationMedicationSig();


                                    }
                                    function OnAddSigError() {
                                        alertify.error("Creating  Failed");
                                    }
                                };

                                $scope.totalSigCount = 0;
                                $scope.getOrganizationMedicationSig = function (text) {
                                    text = text || '';
                                    var params = {
                                        "OrganizationId": $scope.HospitalID,
                                        "SearchText": text || '',
                                        "PageSize": $scope.addNewOrganizationSigObj.PageSize,
                                        "PageNumber": $scope.addNewOrganizationSigObj.PageNumber
                                    };

                                    eHnotePatientDataService.GetOrganizationMedicationSigList(params).then(function (resp) {
                                        console.log(resp);
                                        if (resp.data.Status == "Success") {
                                            $scope.GetOrganizationMedicationSigArrayList = [];
                                            $scope.GetOrganizationMedicationSigArrayList = resp.data.rows;
                                            $scope.totalSigCount = resp.data.Count;
                                        }
                                        else if (resp.data.Status == "Failure") {
                                            alertify.error("Data Updating Failed");
                                        }
                                        //if (resp.data.rows.length  > 0) {

                                        //}
                                    });
                                };
                                $scope.getOrganizationMedicationSig();
                                $scope.clearSigPopup = function () {
                                    $uibModalInstance.close('clear');
                                };
                                $scope.DeleteSig = function (item) {
                                    item = item || "";
                                    item.DeleteInd = "Y";

                                    var obj = {
                                        "OrganizationSigTemplateId": item.OrganizationSigTemplateId || 0,
                                        "OrganizationId": $scope.HospitalID,
                                        "UserId": $scope.UserId,
                                        "Sig": item.Sig,
                                        "ActionId": item.ActionId,
                                        "Action": item.Action,
                                        "DoseId": item.DoseId,
                                        "Dose": item.Dose,
                                        "DoseUnitId": item.DoseUnitId,
                                        "DoseUnit": item.DoseUnit,
                                        "RouteId": item.RouteId,
                                        "Route": item.Route,
                                        "FrequencyId": item.FrequencyId,
                                        "Frequency": item.Frequency,
                                        "DoseOtherId": item.DoseOtherId,
                                        "DoseOther": item.DoseOther,
                                        "DaysSupplyId": item.DaysSupplyId,
                                        "DaysSupply": item.DaysSupply,
                                        "Quantity": item.Quantity,
                                        "QuantityUnitId": item.QuantityUnitId,
                                        "QuantityUnit": item.QuantityUnit,
                                        "RefillId": item.RefillId,
                                        "Refills": item.Refills,
                                        "DeleteInd": "Y",
                                        "IsFrequent": item.IsFrequent,
                                        "MedicineId": item.MedicineId


                                    }
                                    /*   $scope.GetOrganizationMedicationSigArrayList = $scope.GetOrganizationMedicationSigArrayList || [];*/
                                    /* $scope.addNewOrganizationSigObj.push(obj);*/

                                    eHnotePatientDataService.AddUpdateOrganizationMedicationSig(obj, OnAddSigSuccess, OnAddSigError);
                                    function OnAddSigSuccess(response) {
                                        alertify.success("Sig Deleted  Successfully");
                                        $scope.getOrganizationMedicationSig();
                                    }
                                    function OnAddSigError() {
                                        alertify.error("Deletion  Failed");
                                    }
                                };



                                $scope.showAddSigFields = false;
                                $scope.showAddSigButton = true;
                                $scope.savedSigs = [];
                                $scope.clearOrganizationSiginput = function () {
                                    $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
                                };
                                $scope.toggleAddSigFields = function () {

                                    $scope.showAddSigFields = !$scope.showAddSigFields;

                                    $scope.showAddSigButton = !$scope.showAddSigButton;
                                };

                                $scope.allSigPagechanged = function (pagenumber) {

                                    $scope.addNewOrganizationSigObj.PageNumber = pagenumber;
                                    $scope.getOrganizationMedicationSig();
                                };
                            }

                        });

                        modalInstance.result.then(function (result) {
                            console.log(result);


                        },
                            function (cancel) {
                            });

                    }
                    //medicationstemlates


                }
            });
            mInstanceAdd.result.then(function (result) {
                //console.log(result);
               
                $scope.GetUserVisitDiagnosisTemplates();
            },

                function (cancel) {
                });
            return mInstanceAdd;
        };

        // "Save as Template" on the new Assessment design opens this popup straight in Add as Template mode:
        // the create-template popup on the visit's diagnoses, and this popup closes with it
        if ($scope.AssesmentMainobj.SelectedTemplateType === 'ExistingDataAdded') {

            var IsCreateTemplateOpened = false;

            var OpenCreateTemplatePopup = function () {
                if (IsCreateTemplateOpened) {
                    return;
                }
                IsCreateTemplateOpened = true;
                var createInstance = $scope.createTemplatePopup('ExistingDataAdded');
                if (createInstance && createInstance.result) {
                    var closeThisPopup = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    createInstance.result.then(closeThisPopup, closeThisPopup);
                }
            };

            /* createNewTemplate.html is an inline template of this popup, so it only reaches the template
               cache once this popup is rendered - the create popup is opened after that */
            if ($uibModalInstance.rendered && $uibModalInstance.rendered.then) {
                $uibModalInstance.rendered.then(function () {
                    $timeout(OpenCreateTemplatePopup);
                });
            }
            $timeout(OpenCreateTemplatePopup, 800);
        }

        $scope.SaveSetAsDefaultTemplate = function (item, templtitem) {
            item = item || null;

            if (!templtitem || !templtitem.TemplateId) {
                return;
            }
            item = item || {};

            /* The template's row for this diagnosis - its TemplateDiagnosisId is what links the two */
            var templateDiagnosis = null;
            angular.forEach(templtitem.DiagnosisArray || [], function (ditem) {
                if (!templateDiagnosis && ditem && (!item.DiagnosisId || ditem.DiagnosisId == item.DiagnosisId)) {
                    templateDiagnosis = ditem;
                }
            });
            templateDiagnosis = templateDiagnosis || (templtitem.DiagnosisArray || [])[0] || {};

                var params = {
                    "OrganizationId": templtitem.OrganizationId || $scope.HospitalId,
                    "DiagnosisId": item.DiagnosisId || null,
                    "DiagnosisName": item.DiagnosisName || '',
                    "TemplateDiagnosisId": templateDiagnosis.TemplateDiagnosisId || null,
                    "UserId": $scope.UserId,
                    "TemplateId": templtitem.TemplateId,
                    "TemplateName": templtitem.TemplateName || '',
                };
            eHnotePatientDataService.AddDefaultDiagnosisTemplate(params).then(function (resp) {
                if (resp.data.STATUS === "Success") {
                    alertify.success("Template selected Default successfully");
                    $scope.SelectedAssesTemplatesList = [];
                    $scope.GetUserVisitDiagnosisTemplates();
                } else {
                    alertify.error(( resp.data.STATUS) || "Error Occured");
                }
            }, function (err) {
                alertify.error("Error Occured");
            });

        }


    }]);
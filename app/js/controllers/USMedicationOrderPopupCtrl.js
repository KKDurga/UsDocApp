
"use strict";
 eHnoteWebApp.controller("USMedicationOrderPopupCtrl", ["$scope", "$uibModal", "datapersistanceFactory", "$uibModalInstance", "$q", "PreOpAndDialationMedications", "cacheStorageItem", "eHnoteMasterDataService", "UserAccessRights", "allUserList", "eHnoteLoginStatusService", "eHnoteSurgeryService", "$timeout", "USPrintService", "InventoryService", "$filter", "eHnoteConditionsDataService", "alertify", "eHnoteSettingsDataService", "eHnotePatientDataService", "eHnoteDiagnosisDataServices", "eHnoteAuditServices", "eHnoteCacheStorageService", "$location", "ParentObj","eHnoteUserDataService", "DropTimingGivenByService",
 function ($scope, $uibModal, datapersistanceFactory, $uibModalInstance, $q, PreOpAndDialationMedications, cacheStorageItem, eHnoteMasterDataService, UserAccessRights, allUserList, eHnoteLoginStatusService, eHnoteSurgeryService, $timeout, USPrintService, InventoryService, $filter, eHnoteConditionsDataService, alertify, eHnoteSettingsDataService, eHnotePatientDataService, eHnoteDiagnosisDataServices, eHnoteAuditServices, eHnoteCacheStorageService, $location, ParentObj, eHnoteUserDataService, DropTimingGivenByService) {




    
        $scope.Tab = 2;
        $scope.allUserList = allUserList || [];

        
        $scope.MedicationGivenByNurseArray = [];
        $scope.ReviewedByArray = [];
        $scope.MedicationGivenByNurseArray = $scope.allUserList.filter((x) => x.RoleId == 8);
        $scope.AnesthesiaGivenArray = [];
        $scope.AnesthesiaGivenArray = $scope.allUserList.filter((x) => x.RoleId == 25 || x.RoleId == 30 || x.RoleId == 8);
        $scope.ChecklistArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 43) || [];
        $scope.SurgeonArray = $scope.ChecklistArray.filter((x) => x.SuffixId == 10) || [];
        $scope.AnesthetistArray = $scope.allUserList.filter((x) => x.RoleId == 25 || x.RoleId == 30);
        $scope.AnesthesiologistArray = $scope.allUserList.filter((x) => x.RoleId == 30);
        $scope.SurgeonAnesthesiologistArray = $scope.SurgeonArray.concat($scope.AnesthesiologistArray);
        $scope.PhysicianArray = $scope.allUserList.filter((x) => x.RoleId == 72 || x.RoleId == 8);
        $scope.MedicationOnlyMDGivenByArray = $scope.SurgeonArray.concat($scope.MedicationGivenByNurseArray);
        $scope.NurseAnesthetistArray = $scope.allUserList.filter((x) => x.RoleId == 25 || x.RoleId == 8);
        $scope.MedicationGivenBy = $scope.AnesthetistArray.concat($scope.MedicationGivenByNurseArray);

        // Task 56803 - medication orders (Surgeon, Anesthesia, Pre-Admission) show AMSCA and DEA
        // next to the License ID when the reviewer is an MD.

        // A credential of 0 / "0" means "not on file" and must not be displayed.
        $scope.HasCredentialValue = function (Value) {
            return Value != null && Value !== '' && Value != 0;
        };

        $scope.GetSurgeonCredentials = function (DoctorId) {
            // The whole user list, so MD anesthesiologists / physicians resolve as well as surgeons.
            var Surgeonlist = $filter("filter")($scope.allUserList || [], function (subitem) {
                return subitem.DoctorID == DoctorId && subitem.SuffixId == 10;
            });
            if (Surgeonlist.length > 0) {
                return {
                    "LicenseNumber": $scope.HasCredentialValue(Surgeonlist[0].LicenseNumber) ? Surgeonlist[0].LicenseNumber : '',
                    "DEA": $scope.HasCredentialValue(Surgeonlist[0].DEA) ? Surgeonlist[0].DEA : '',
                    // The user list exposes this column as AMSCAA; normalised to AMSCA below.
                    "AMSCA": $scope.HasCredentialValue(Surgeonlist[0].AMSCAA) ? Surgeonlist[0].AMSCAA : ''
                };
            }
            return null;
        };

        // Resolves DEA/AMSCA for every order block with an MD reviewer. The numbers live on the
        // user list ($scope.allUserList), so the reviewer profile is the source of truth;
        // the order row is only used when the reviewer is not in the list.
        $scope.SetSurgeonCredentials = function (OrderDetails) {
            angular.forEach(OrderDetails || [], function (Mitem) {
                if (!Mitem) { return; }

                Mitem.DEA = $scope.HasCredentialValue(Mitem.DEA) ? Mitem.DEA : '';
                Mitem.AMSCA = $scope.HasCredentialValue(Mitem.AMSCA) ? Mitem.AMSCA
                            : ($scope.HasCredentialValue(Mitem.AMSCAA) ? Mitem.AMSCAA : '');

                var Credentials = $scope.GetSurgeonCredentials(Mitem.ReviewedBy);
                if (Credentials != null) {
                    Mitem.DEA = Credentials.DEA || Mitem.DEA;
                    Mitem.AMSCA = Credentials.AMSCA || Mitem.AMSCA;
                }
            });
        };
        if ($scope.allUserList.length > 0) {
            $scope.ReviewedByArray = $scope.allUserList.filter((x) => x.RoleId == 8);
            $scope.MedicationGivenByArray = $scope.allUserList.filter((x) => x.RoleId == 8 || x.RoleId == 38) || [];
        } else {
            $scope.MedicationGivenByArray = [];
            $scope.ReviewedByArray
        }

     $scope.GetIvAceessGivenByTime = function (index) {
            //$scope.PreOpObj.IvAccessGivenByTime = $filter('date')(new Date(), "hh:mm a");
            $scope.PreOpObj.IVAccessDetailsList[index].IvAccessGivenByTime = $filter('date')(new Date(), "hh:mm a");
        };

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        console.log(doctorinfo);
        $scope.UserSettingObject = datapersistanceFactory.getItem('UserSettingsData');
      

        $scope.PreOpTemplateobj = {
            "IsOpenOrderTemplate": false,
            "SelectedOrderTemplate": '',
            "TemplateName": '',
            "PreOpTemplateName": '',
            "DilationTemplateName": '',
            "IsOpenPreOpOrderTemplate": false,
            "SelectedPreopOrderTemplate": '',
        };
        $scope.show = {
            "IsAnesthesiaMedications": false,
            "IsAnesthesiaGenOrders": false,
            "IsNurseGenOrders": false,
            "IsNurseMedications": false,
     };
        $scope.GetAllorderreviewedObj = function () {
            return {
                "IsSurgeonPreopreviewed": false,
                "IsSurgeonIntraopreviewed": false,
                "IsSurgeonPostopreviewed": false,
                "IsAnesthesiaPreopreviewed": false,
                "IsAnesthesiaIntraopreviewed": false,
                "IsAnesthesiaPostopreviewed": false,
                "IsSurgeonPreopChecked": false,
                "IsSurgeonIntraopChecked": false,
                "IsSurgeonPostopChecked": false,
                "IsAnesthesiaPreopChecked": false,
                "IsAnesthesiaIntraopChecked": false,
                "IsAnesthesiaPostopChecked": false,
                "OverallAnesthesiaReviewedBy": null,
                "OverallAnesthesiaReviewedByPassword": "",
                "OverallSurgeonReviewedBy": null,
                "OverallSurgeonReviewedByPassword": "",
            };
        }

        $scope.Allorderreviewed = angular.copy($scope.GetAllorderreviewedObj());
        $scope.DiabatesNO = {
            "IsDiabetesNO": false,
            "IsHypoglycemia": false,
        };
        $scope.IspostopMedications = false;
        $scope.IsPostopGenOrders = false;
        $scope.IsIntraopMedications = false;
        $scope.IsIntraopGenOrders = false;

     $scope.IsIntraOpSurgeonOrdersCheckBox = false;
     $scope.IsIntraOpAnesthesiaOrdersCheckBox = false;
     $scope.IsPostOpMedicationAnsthesia = false;
     $scope.IsPostOpMedicationSurgeon = false;
     $scope.IspropMedicationSurgeon = false;
     $scope.IspropMedicationAnsthesia = false;
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserAccessRights = UserAccessRights;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        };
        var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.RoleId = userLoginDetails.RoleID;
        $scope.UserId = eHnoteMasterDataService.getLoginId();

        $scope.cacheStorageItem = angular.copy(cacheStorageItem);
        $scope.cacheStorageItem.CheckinStatusId = $scope.cacheStorageItem.CheckinStatusId || 0;
        $scope.cacheStorageItem.AdmissionId = $scope.cacheStorageItem.AdmissionId || 0;
        $scope.PreOpAndDialationMedications = angular.copy(PreOpAndDialationMedications);
        
      
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

        //$scope.CurrentEnv = '';

        //var currenturl = $location.absUrl().split('?')[0];

        //var currenturl12 = currenturl.split('/#')[0];

        //if (currenturl12 == "https://ioj.ehnote.com" || currenturl12 == 'https://portal.ehnote.com') {
        //    $scope.CurrentEnv = 'Prod';
        //} else if (currenturl12 == "https://stg.ehnote.com" || currenturl12 == "https://insts.ehnote.com") {
        //    $scope.CurrentEnv = 'Stg';
        //} else {
        //    $scope.CurrentEnv = 'Dev'
        //};

        //$scope.IsTecEyeCareOrg = false;

        //if (($scope.CurrentEnv == 'Dev' && $scope.ParenthospitalId == 645) || ($scope.CurrentEnv == 'Stg' && $scope.ParenthospitalId == 3) || ($scope.CurrentEnv == 'Prod' && $scope.ParenthospitalId == 3)) {
        //    $scope.IsTecEyeCareOrg = true;
        //} else {
        //    $scope.IsTecEyeCareOrg = false;
        //};
        $scope.ParentObj = ParentObj;

        $scope.GetLocationName = function () {
            return [{
                "LocationId": 1,
                "LocationName": "OD"
            },
            {
                "LocationId": 2,
                "LocationName": "OS"
            },
            {
                "LocationId": 3,
                "LocationName": "OU"
            },
            {
                "LocationId": 4,
                "LocationName": "GENERAL"
            }
            ];
        };
        $scope.GetLocationNameList = angular.copy($scope.GetLocationName());

        $scope.NoOfAttemptsArray = [

            {
                "Id": 1,
                "Value": 1
            },
            {
                "Id": 2,
                "Value": 2
            },
            {
                "Id": 3,
                "Value": 3
            },
            {
                "Id": 4,
                "Value": 4
            }
        ];

        $scope.LabInvestNotes = function (item) {
            item.IsNoteEdit = !item.IsNoteEdit;
            item.LabInvestFocus = true;
        }

        $scope.PostOpSubTab = ($scope.RoleId == 25 || $scope.RoleId == 30) ? 2 : 0;

        $scope.SubTab = 0;
        $scope.SubTabChange = function (val) {
            if ($scope.PreAdmAnesthetistObj.SubTab==1) {
                $scope.SavePhysicanMedication();
            }
            if ($scope.PreAdmAnesthetistObj.SubTab == 2) {
            
                $scope.SaveAnesthetistMedication();
            }
        

            $scope.PreAdmAnesthetistObj.SubTab = val;
            $scope.SubTab = val;
        }
        $scope.changePreopTab = function (subtab) {
            if (subtab == 1) {
                if ($scope.UserAccessRights.AllAccessRights.PreOpDilationMedications) {
                  //  $scope.PreOpAndDialationMedications.SubTabType = 1
                } else {
                   // $scope.PreOpAndDialationMedications.SubTabType = 2
                    alertify.error("No access for this user !");
                    return false;
                }
            } else {
                if ($scope.UserAccessRights.AllAccessRights.PreOpMedications) {
                  //  $scope.PreOpAndDialationMedications.SubTabType = 2
                } else {
                   // $scope.PreOpAndDialationMedications.SubTabType = 1
                    alertify.error("No access for this user !");
                    return false;
                }
            }

            if ($scope.PreOpAndDialationMedications.SubTabType == 1) {
                let i = 0;
                let j = 0;
                let FinalOrderDetails = $filter('filter')($scope.PreOpObj.OrderDetails, { 'MedTypeId': 2 }, true) || [];
                if (FinalOrderDetails.length > 0) {
                    angular.forEach(FinalOrderDetails, function (Mitem) {
                        Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                        if (Mitem.ReviewedBy != null && Mitem.IsOrderReviewed == false) {
                            if (Mitem.ReviewedByPassword == '') {
                                j++
                            }
                        }
                        if (Mitem.DilationMedications.length > 0) {
                            angular.forEach(Mitem.DilationMedications, function (item) {
                                if (item.DropTimings.length > 0) {
                                    let tempArray = $filter('filter')(item.DropTimings, { 'GivenBy': null }, true);
                                    if (tempArray.length > 0) {
                                        i++
                                    }
                                };
                            });
                        }

                    });
                }
                if (j !== 0) {
                    alertify.error("Plese Enter Password");
                    return false;
                }
                if (i !== 0) {
                    alertify.error("Plese select Givenby for Medications!");
                    return false;
                }

                $scope.PreOpDilationMedicationSave('DilationMedications');
            }
            if ($scope.PreOpAndDialationMedications.SubTabType == 2) {

                var i = 0;
                var n = 0;
               let FinalPreOrderDetails = $filter('filter')($scope.PreOpObj.OrderDetails, { 'MedTypeId': 1 }, true) || [];
                if (FinalPreOrderDetails.length > 0) {
                    angular.forEach(FinalPreOrderDetails, function (Mitem) {
                        Mitem.IsOrderReviewed = Mitem.IsOrderReviewed || false;
                        Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                        if (Mitem.ReviewedBy != null && Mitem.IsOrderReviewed == false) {
                            if (Mitem.ReviewedByPassword == '') {
                                n++
                            }
                        }
                        if (Mitem.PreOpMedications.length > 0) {
                            angular.forEach(Mitem.PreOpMedications, function (item) {
                                if (item.DropTimings.length > 0) {
                                    let tempArray = $filter('filter')(item.DropTimings, { 'GivenBy': null }, true);
                                    if (tempArray.length > 0) {
                                        i++
                                    }
                                };

                            });
                        }
                    });
                }
                if (n !== 0) {
                    alertify.error("Plese Enter Password");
                    return false;
                }
                if (i !== 0) {
                    alertify.error("Plese select Givenby for Medications!");
                    return false;
                }

                $scope.PreOpDilationMedicationSave('PreOpMedications');
            }
            //$scope.PreOpAndDialationMedications.SubTabType = ($scope.RoleId == 25 || $scope.RoleId == 30) ? 2 : 1;
            $scope.PreOpAndDialationMedications.SubTabType = subtab;
        };

        $scope.changePostOpTab = function (subtab) {
            if (subtab == 1) {
                if ($scope.UserAccessRights.AllAccessRights.PostOpMedications) {
                   
                } else {
                    alertify.error("No access for this user !");
                    return false;
                }
            };

            if ($scope.PostOpObj.SubTabType == 1) {
                let i = 0;
                let j = 0;
                let FinalOrderDetails = $filter('filter')($scope.PostOpObj.OrderDetails, { 'MedTypeId': 5 }, true) || [];
                if (FinalOrderDetails.length > 0) {
                    angular.forEach(FinalOrderDetails, function (Mitem) {
                        Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                        if (Mitem.ReviewedBy != null && Mitem.IsOrderReviewed == false) {
                            if (Mitem.ReviewedByPassword == '') {
                                j++
                            }
                        }
                        if (Mitem.PostOpMedications.length > 0) {
                            angular.forEach(Mitem.PostOpMedications, function (item) {
                                if (item.DropTimings.length > 0) {
                                    let tempArray = $filter('filter')(item.DropTimings, { 'GivenBy': null }, true);
                                    if (tempArray.length > 0) {
                                        i++
                                    }
                                };
                            });
                        }

                    });
                }
                if (j !== 0) {
                    alertify.error("Plese Enter Password");
                    return false;
                }
                if (i !== 0) {
                    alertify.error("Plese select Givenby for Medications!");
                    return false;
                }

                $scope.SavePostOpMedication();
            }
            if ($scope.PostOpObj.SubTabType == 2) {

                var i = 0;
                var n = 0;
                let FinalPreOrderDetails = $filter('filter')($scope.PostOpObj.OrderDetails, { 'MedTypeId': 8 }, true) || [];
                if (FinalPreOrderDetails.length > 0) {
                    angular.forEach(FinalPreOrderDetails, function (Mitem) {
                        Mitem.IsOrderReviewed = Mitem.IsOrderReviewed || false;
                        Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                        if (Mitem.ReviewedBy != null && Mitem.IsOrderReviewed == false) {
                            if (Mitem.ReviewedByPassword == '') {
                                n++
                            }
                        }
                        if (Mitem.PostOpMedications.length > 0) {
                            angular.forEach(Mitem.PostOpMedications, function (item) {
                                if (item.DropTimings.length > 0) {
                                    let tempArray = $filter('filter')(item.DropTimings, { 'GivenBy': null }, true);
                                    if (tempArray.length > 0) {
                                        i++
                                    }
                                };

                            });
                        }
                    });
                }
                if (n !== 0) {
                    alertify.error("Plese Enter Password");
                    return false;
                }
                if (i !== 0) {
                    alertify.error("Plese select Givenby for Medications!");
                    return false;
                }

                $scope.SavePostOpMedication();
            }

            $scope.PostOpObj.SubTabType = subtab;
            $scope.PostOpSubTab = subtab;
           ///* $scope.PostOpSubTab*/ = ($scope.RoleId == 25 || $scope.RoleId == 30) ? 2 : 1;
        };


        $scope.TabChnages = function (tab) {


            if ($scope.Tab == 4) {
                let K = 0;
                let i = 0;
                let FinalOrderDetails = [];
                FinalOrderDetails = $filter('filter')($scope.PostOpObj.OrderDetails, { 'MedTypeId': 5 }, true) || [];
                if (FinalOrderDetails.length > 0) {
                    angular.forEach(FinalOrderDetails, function (Mitem) {
                        Mitem.IsOrderReviewed = Mitem.IsOrderReviewed || false;
                        Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                        if (Mitem.ReviewedBy != null && Mitem.IsOrderReviewed == false) {
                            if (Mitem.ReviewedByPassword == '') {
                                K++
                            }
                        }
                        if (Mitem.PostOpMedications.length > 0) {
                            angular.forEach(Mitem.PostOpMedications, function (item) {
                                item.IsPostOpMed = true;
                                item.UserType = "Nurse";
                                if (item.DropTimings.length > 0) {
                                    let tempArray = $filter('filter')(item.DropTimings, { 'GivenBy': null }, true);
                                    if (tempArray.length > 0) {
                                        i++
                                    }
                                };                                
                            });
                        }
                    });
                }
                if (K !== 0) {
                    alertify.error("Plese Enter Password");
                    return false;
                }
                if (i !== 0) {
                    alertify.error("Plese select Givenby for Medications!");
                    return false;
                }
                $scope.SavePostOpMedication();
            }

            if ($scope.Tab == 3) {

                //if ($scope.IntraOpObj.IntraOpMedications.length > 0 || $scope.IntraOpObj.AnesthesiaMedications.length>0) {
                //    let i = 0;
                //    if ($scope.IntraOpObj.IntraOpMedications.length > 0) {
                //        angular.forEach($scope.IntraOpObj.IntraOpMedications, function (item) {
                //            if (item.DropTimings.length > 0) {
                //                let tempArray = $filter('filter')(item.DropTimings, { 'GivenBy': null }, true);
                //                if (tempArray.length > 0) {
                //                    i++
                //                }
                //            }
                //        });
                //    }
                //    if (i !== 0) {
                //        alertify.error("Plese select Givenby for Medications!");
                //        return false;
                //    }

                //    let j = 0;
                //    angular.forEach($scope.IntraOpObj.AnesthesiaMedications, function (item) {
                //        if (item.DropTimings.length > 0) {
                //            let tempArray = $filter('filter')(item.DropTimings, { 'GivenBy': null }, true);
                //            if (tempArray.length > 0) {
                //                j++
                //            }
                //        }
                //    });
                //    if (j != 0) {
                //        alertify.error("Plese select Givenby for Medications!");
                //        return false;
                //    }

                //    $scope.SaveIntraopMedication();
                //}

                let K = 0;
                let i = 0;
                let FinalOrderDetails = [];
                FinalOrderDetails = $filter('filter')($scope.IntraOpObj.OrderDetails, { 'MedTypeId': 4 }, true) || [];
                if (FinalOrderDetails.length > 0) {
                    angular.forEach(FinalOrderDetails, function (Mitem) {
                        Mitem.IsOrderReviewed = Mitem.IsOrderReviewed || false;
                        Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                        if (Mitem.ReviewedBy != null && Mitem.IsOrderReviewed == false) {
                            if (Mitem.ReviewedByPassword == '') {
                                K++
                            }
                        }
                        if (Mitem.IntraOpMedications.length > 0) {
                            angular.forEach(Mitem.IntraOpMedications, function (item) {
                                item.IsIntraMed = true;
                                item.UserType = "Nurse";
                                if (item.DropTimings.length > 0) {
                                    let tempArray = $filter('filter')(item.DropTimings, { 'GivenBy': null }, true);
                                    if (tempArray.length > 0) {
                                        i++
                                    }
                                };
                            });
                        }
                    });
                }
                if (K !== 0) {
                    alertify.error("Plese Enter Password");
                    return false;
                }
                if (i !== 0) {
                    alertify.error("Plese select Givenby for Medications!");
                    return false;
                }
               

                $scope.SaveIntraopMedication();


               
            }

            $scope.Tab = tab;

            if ($scope.Tab == 2) {
               // $scope.changePreopTab(PreOpAndDialationMedications.SubTabType);
            }
            if ($scope.Tab ==1) {
                $scope.SubTabChange($scope.PreAdmAnesthetistObj.SubTab);
            }

            if ($scope.Tab == 4) {
                if (!$scope.UserAccessRights.AllAccessRights.PostOpMedications) {
                
                    alertify.error("No access for this user !");
                    return false; 
                } 
            }

        
        }
        let OrderTypeId = 0, OrderTypeName = '';
        if ($scope.cacheStorageItem.AdmissionId == 0) {
            OrderTypeId = 1;
            OrderTypeName = "Standing Medications(Pre Surgery)";
        } else {
            OrderTypeId = 2;
            OrderTypeName = "Live Medications";
        }

        $scope.GetPostOpObj = function () {
            return {           
                "PatientASCPostOPId": null,
                "PostOpNurseChartStatus": '',
                "PostOpAnesthesiaChartStatus":'',
                "OrderType": 'Medications',
                "AnesthesiaOrderType": 'AnesthesiaMedications',
                "IsShowNurseSummaryViewInd": false,
                "IsShowAnesthesiaSummaryViewInd": false,
                "IsPostOpSurgeonOrdersTimeAdded": false,
                "IsPostOpAnesthesiaOrdersTimeAdded": false,
                "DisablePostOpAnesthesiaCheck": false,
                "DisablePostOpSurgeonCheck": false,
                "IsClickSavePostOPBtn": false,
                "SubTabType": 1,
                "OrderDetails": [
                    {
                        "UserOrderId": 0,
                        "UserId": $scope.UserId,
                        "DeleteInd": "N",
                        "IsOrderReviewed": false,
                        "ReviewedByDateTime": null,
                        "ReviewedByPassword": '',
                        "ReviewedBy": null,
                        "UserType": "Nurse",
                        "ScreenType": "PostOp",
                        "ScreenTypeId": 6,
                        "MedTypeId": null,
                        "MedTypeName": '',
                        "PostOpMedications": [],
                        "GeneralOrders": [],
                        "OrderTypeId": OrderTypeId||1,
                        "OrderTypeName": OrderTypeName||"Standing Medications(Pre Surgery)"
                    }
                ],           

            };
        };

        $scope.OrderTypeObj = {
            "SelectedOrderType": 1,
            "SubTab": 1,          
        };

        function getnewRcopiaPatientObj() {
            var obj = {
                "FirstName": "",
                "LastName": "",
                "ExternalID": "",
                "DeleteInd": "n",
                "MiddleName": "",
                "RcopiaPatientId": 0,
                "DOB": "",
                "Sex": "",
                "HomePhone": "",
                "Address1": "",
                "Address2": "",
                "City": "",
                "State": "",
                "Zip": "",
                "Suffix": "",
                "Prefix": "",
                "EmailId": "",
                "Race": "",
                "Ethnicity": ""
            };
            return obj;
        }
        $scope.medicineGetObj = {
            "MedicineObject": ""
        }
        $scope.RcopiaPatientObj = getnewRcopiaPatientObj();
        function getEmptyPrescriptionObj() {

            var TodayDate = $filter('date')(new Date(), "yyyy-MM-dd");
            let appointmentId;
            if ($scope.cacheStorageItem.AppointmentTypeId === 4 || $scope.cacheStorageItem.AppointmentTypeId === 14) {
                appointmentId = $scope.cacheStorageItem.PreAdmAppointmentId;
            }
            if ($scope.cacheStorageItem.AppointmentTypeId === 7 || $scope.cacheStorageItem.AppointmentTypeId === 6) {
                appointmentId = $scope.cacheStorageItem.AppointmentId;
            }
            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "RcopiaPatientId": $scope.RcopiaPatientObj.RcopiaPatientId,
                "PatientPrescriptionId": 0,
                "AppointmentId": appointmentId,
                "ProviderId": $scope.cacheStorageItem.DoctorId,
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
                "IsNKMSelected": false,
                "LastModifiedBy": $scope.UserId,
                "LastModifiedDate": TodayDate,
                "CompleteAction": "Created",
                "PrescriptionSentMethod": "",
                "PrescriptionStatus": "",
                "DeleteInd": "N",
                "RcopiaDeleted": "n",
                "PrescriptionDetails": [],
                "IsClickSavePrescriptionBtn": false,
            };
            return obj;
        };
        $scope.PrescriptionMainAddObj = getEmptyPrescriptionObj();

        $scope.GetPreAdmAnesthetistObj = function () {
            return {
                "SubTab": 1,
                "IsShowAnesthetisSummaryViewInd": false,
                "OrderName":"",
                "IsClickSavePreAdmAnesthetistBtn": false,
                "OrderDetails": [
                    {
                        "UserOrderId": 0,
                        "UserId": $scope.UserId,
                        "DeleteInd": "N",
                        "IsOrderReviewed": false,
                        "ReviewedByDateTime": null,
                        "ReviewedByPassword": '',
                        "ReviewedBy": null,
                        "ScreenType": "Anesthesia PreAdmission",
                        "ScreenTypeId": 2,
                        "MedTypeId": null,
                        "MedTypeName": '',
                        "PrescriptionMainAddObj": getEmptyPrescriptionObj() || '',
                        "GeneralOrders": [],
                        "Investigationslist": [],
                    }
                ],
               
                   

            };
        };
        $scope.PreAdmAnesthetistObj = angular.copy($scope.GetPreAdmAnesthetistObj());

        $scope.SigSearch = {
            "Shows": false
        };
        $scope.adnewsigobj = {
            "IsNewSig": false,
            "MedicineId": 0,
        }
        $scope.GetPostOpMedicationObj = function () {
            return {
                "OrderName": "",
                "MedicineObject": "",
                "MedicationId": null,
                "OrganizationMedicationId": null,
                "MedicationName": "",
                 "FrequencyId": null,
                "DoseId": null,
                "DoseUnitId": null,
                "RouteId": null,
                "ActionId": null,

                "Frequency": "",
                "Dose": "",
                "DoseUnit": "",
                "Route": "",
                "Action": "",

                "OrderDescription": "",
                "MedicationNotes": "",
                "maxDose": "",
                "IsChecked": false,
                "EditIndex": -1,
                "OrderTypeId": null,
                "OrderTypeName": "",
                "IsmedSearchDisabled":false

            };
        };
        $scope.PostOpMedicationObj = angular.copy($scope.GetPostOpMedicationObj());
     $scope.GetDilationMedicationObj = function () {
         return {
             "OrderName": "",
             "MedicineObject": "",
             "MedicationId": null,
             "OrganizationMedicationId": null,
             "MedicationName": "",
             "FrequencyId": null,
             "DoseId": null,
             "DoseUnitId": null,
             "RouteId": null,
             "ActionId": null,

             "Frequency": "",
             "Dose": "",
             "DoseUnit": "",
             "Route": "",
             "Action": "",

             "OrderDescription": "",
             "MedicationNotes": "",
             "maxDose": "",
             "IsChecked": false,
             "EditIndex": -1,
             "OrderTypeId": null,
             "OrderTypeName": "",
             "IsmedSearchDisabled": false
         };
     };
     $scope.DilationMedicationObj = angular.copy($scope.GetDilationMedicationObj());

     $scope.PreOpMedicationObj = angular.copy($scope.GetDilationMedicationObj());
        $scope.PostOpTemplateobj = {
            "IsOpenOrderTemplate": false,
            "IsOpenAnesthesiaOrderTemplate": false,
            "SelectedOrderTemplate": '',
            "TemplateName": '',
        };
        function getNewPrescriptionDetailObj() {
            var obj = {
                "PatientPrescriptionDetailId": 0,
                "PatientPrescriptionId": 0,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "MedicationId": 0,
                "RcopiaDrugId": "",
                "RcopiaMedicationId": "",
                "RcopiaPrescriptionId": "",
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
                "Quantity": null,
                "QuantityUnitId": "",
                "QuantityUnit": "",
                "RefillId": "",
                "Refills": "",
                "SubstitutionPermitted": "y",
                "HasScheduledDrug": "n",
                "PatientInstructions": "",
                "DeleteInd": "N",
                "OtherNotes": "",
                "Remarks": "",
                "StartDate": $scope.CurrentDateMMFormat,
                "StopDate": null,
                "FillDate": $scope.CurrentDateMMFormat,
                "StopReason": "",
                "RcopiaMedicationStatus": "",
                "IsEditMode": true,
                "IsAllSig": false,
                "Type": "",
                "MedicineObj": "",
                "StopReasonId": "",
                "IsMedicationStopped": false,
                "SelectedMedicationHistory": 'CurrentEyeMedication'


            }
            return obj;
        };
     $scope.GetIntraOpMedicationObj = function () {
         return {
             "SubTab": 1,
             "MedicineObject": {},
             "MedicationId": null,
             "OrganizationMedicationId": null,
             "MedicationName": "",
             "DeleteInd": "N",

             "FrequencyId": null,
             "DoseId": null,
             "DoseUnitId": null,
             "RouteId": null,
             "ActionId": null,

             "Frequency": "",
             "Dose": "",
             "DoseUnit": "",
             "Route": "",
             "Action": "",

             "OrderDescription": "",
             "MedicationNotes": "",
             "maxDose": "",
             "IsChecked": false,
             "EditIndex": -1,
             "OrderTypeId": null,
             "OrderTypeName": "",
             "IsmedSearchDisabled": false
         };
     };

        $scope.Surgeryobj = {
            'MedicineObject': '',
            'CurrentMedicationobj': '',
            'SubType': 'PreSurgery',
            'PreMedicationslist': [],
            'CurrentMedicationslist': [],
            'Investigationslist': [],
            'EnterPreSurgeryTemplateName': "",
            'SelectedPreSurgeryTemplateName': "",
            "PrescriptionDetails": ""
        }
        $scope.GetIntraOpObj = function () {
            return {
                "PatientASCIntraOPId": 0,
                "IntraOpChartStatus": "D",
                "IntraOpNurseChartStatus": "D",
                "IntraOpAnesthesiaChartStatus": "D",
               // "AnesthesiaMedications": [],
               // "IntraOpMedications": [],
                "IsShowNurseSummaryViewInd": false,
                "IsShowAnesthesiaSummaryViewInd": false,
                "IsIntraOpSurgeonOrdersTimeAdded": false,
                "IsIntraOpAnesthesiaOrdersTimeAdded": false,
                "DisableIntraopAnesthesiaCheck": false,
                "DisableIntraopSurgeonCheck": false,               
                "OrderType": 'Medications',
                "IsClickSaveIntraOpBtn": false,
                "OrderDetails": [
                    {
                        "UserOrderId": 0,
                        "UserId": $scope.UserId,
                        "DeleteInd": "N",
                        "IsOrderReviewed": false,
                        "ReviewedByDateTime": null,
                        "ReviewedByPassword": '',
                        "ReviewedBy": null,
                        "UserType": "Nurse",
                        "ScreenType": "Intra-OP",
                        "ScreenTypeId": 5,
                        "MedTypeId": null,
                        "MedTypeName": '',
                        //"AnesthesiaMedications": [],
                        "IntraOpMedications": [],
                        "GeneralOrders": [],
                        "OrderTypeId": OrderTypeId||1,
                        "OrderTypeName": OrderTypeName||"Standing Medications(Pre Surgery)"
                    }
                ],
            };
        };
        $scope.GetAnesthesiaMedicationObj = function () {
            return {
                "MedicineObject": "",
                "MedicationId": null,
                "OrganizationMedicationId": null,
                "MedicationName": "",
                
                "DeleteInd": "N",

                "FrequencyId": null,
                "DoseId": null,
                "DoseUnitId": null,
                "RouteId": null,
                "ActionId": null,

                "Frequency": "",
                "Dose": "",
                "DoseUnit": "",
                "Route": "",
                "Action": "",

                "OrderDescription": "",
                "MedicationNotes": "",
                "maxDose": "",
                "IsChecked": false,
                "EditIndex": -1,
                "OrderTypeId": null,
                "OrderTypeName": "",
            };
        };
        $scope.AnesthesiaMedicationObj = angular.copy($scope.GetAnesthesiaMedicationObj());



        $scope.GetPreAdmCardiologyObj = function () {
            return {           
                "OrganizationId": $scope.HospitalId || 0,
                "UserId": $scope.UserId,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "AppointmentId": $scope.cacheStorageItem.SelectedAppointmentId || 0,              
                "IsShowPhysicanSummaryViewInd": false,
                "OrderName": '',
                "OrderDetails": [
                    {
                        "UserOrderId": 0,
                        "UserId": $scope.UserId,
                        "DeleteInd": "N",
                        "IsOrderReviewed": false,
                        "ReviewedByDateTime": null,
                        "ReviewedByPassword": '',
                        "ReviewedBy": null,
                        "ScreenType": "Cardiologist PreAdmission",
                        "ScreenTypeId": 3,
                        "MedTypeId": null,
                        "MedTypeName": '',
                        "PrescriptionMainAddObj": getEmptyPrescriptionObj() || '',
                        "GeneralOrders": [],
                        "Investigationslist": [],
                    }
                ],
            };
        };


        $scope.GetOverallObj = function () {
            return {           
                "PreAdmsnAnesthesia": [],
                "PreAdmsnPhysician": [],
                "ASCAnesthesia": [],
                "ASCPhysician": [],
              
            };
        };

        $scope.PreAdmCardiologyObj = angular.copy($scope.GetPreAdmCardiologyObj());
     //$scope.PreOpMedicationObj = {
     //    "MedicineObject": "",
     //    "OrderName": ""
     //}
        $scope.IntraCurrentTab = 1;
        $scope.init = function () {
            
            $scope.OverallObj = angular.copy($scope.GetOverallObj());
            $scope.PostOpObj = $scope.GetPostOpObj();
            $scope.PostOpObj.SubTabType = $scope.PostOpSubTab || 1;
            $scope.IntraOpObj = $scope.GetIntraOpObj();
            $scope.IntraOpMedicationObj = angular.copy($scope.GetIntraOpMedicationObj());
            $scope.PreOpMedicationObj = angular.copy($scope.GetDilationMedicationObj());
            $scope.DilationMedicationObj = angular.copy($scope.GetDilationMedicationObj());
            $scope.AnesthesiaMedicationObj = angular.copy($scope.GetAnesthesiaMedicationObj());
            $scope.PostOpMedicationObj = angular.copy($scope.GetPostOpMedicationObj());      
            $scope.IntraOpMedicationObj.SubTab = $scope.IntraCurrentTab || 1;
            $scope.PreOpMedicationObj.MedicineObject = '';// written because some times while changing tab login username or time binding automatically in this obj 
            $scope.PostOpMedicationObj.MedicineObject = '';// written because some times while changing tab login username or time binding automatically in this obj 
            $scope.IntraOpTemplateobj = {
                "IsOpenOrderTemplate": false,
                "SelectedOrderTemplate": '',
                "TemplateName": '',
                "IsOpenIntraOpOrderTemplate": false,
                "SelectedIntraopOrderTemplate": '',
            };

            $scope.PreOpObj = {
                "OrgASCChecklist": [],
                "IVSiteArray": [],
                "IVBlockedArray": [],
                "NeedleSize": [],
                "IVSite": "",
                "IVArm": "",
                "IsDiabetes": null,
                "IsHypoglycemiaCheck": false,
                "IVNeedleSize": "",
                "PatencyStatus": "",
                "IsAllNurseCheckListChecked": "",
                "SelectStatusString": "",
                "IVSiteBlocked": false,
                "IsShowNurseSummaryViewInd": false,
                "IsShowAnesthesiaSummaryViewInd": false,
                "IsSurgeonOrdersTimeChecked": false,
                "IsAnesthesiaOrdersTimeChecked": false,
                "DisableSurgeonordersCheck ": false,
                "DisableAnesthesiaOrdersCheck ": false,             
                "OrderType": 'Medications',
                "OrderDetails": [
                    {
                        "UserOrderId": 0,
                        "UserId": $scope.UserId,
                        "DeleteInd": "N",
                        "ReviewedBy": null,
                        "IsOrderReviewed": false,
                        "ReviewedByDateTime": null,
                        "ReviewedByPassword": '',
                        "UserType": "Nurse",
                        "ScreenType": "PreOp",
                        "ScreenTypeId": 4,
                        "MedTypeId": null,
                        "MedTypeName": '',
                        "DilationMedications": [],
                        "GeneralOrders": [],
                        "PreOpMedications": [],
                        "OrderTypeId": OrderTypeId||1,
                        "OrderTypeName": OrderTypeName||"Standing Medications(Pre Surgery)"
                    }
                ],
                "IVSiteFluidsArray": [],
                "IVSiteFlushArray": [],
                "IVSiteLRArray": [],
                "IVFluidsArray": [],
                "IVSiteFluids": 41,
                "IVFluidsId": 50,
                "IVFluidsName": '',
                "IVSiteFlush": 34,
                "IVSiteLactatedRingers": null,
                "IVSiteFluidsName": '',
                "IVSiteFlushName": '',
                "IVSiteLactatedRingersName": '',
                "NoOfAttempts": null,
                "NoOfAttemptsArray": [],
                "IvAccessGivenBy": null,
                "IvAccessGivenByName": '',
                "IvAccessGivenByTime": '',
                "IsClickSavePreOpNurse": false,
                "IVAccessDetailsList": [
                    {
                        "IVAccessMainId": 0,
                        "UserId": $scope.UserId,
                        "DeleteInd": "N",
                        "IVSite": null,
                        "PatencyStatus": '',
                        "SelectStatusString": '',
                        "IVNeedleSize": null,
                        "IVSiteFluids": 41,
                        "IVSiteFluidsName": '',
                        "IVSiteFlush": 34,
                        "IVFluidsId": 50,
                        "IVSiteFlushName": '',
                        "IVSiteLactatedRingers": null,
                        "NoOfAttempts": null,
                        "IvAccessGivenBy": null,
                        "IvAccessGivenByName": null,
                        "IvAccessGivenByTime": '',
                        "IvAccessGivenByDate": null,
                        "ConditionList": [],
                        "IVBlockedArray": [],
                        "Remarks": '',
                        "IVSiteBlocked": false,
                        "IVFluidsName": '',
                        "IVSiteLactatedRingersName": '',
                        "IVArm": '',

                    }
                ],
                "IsIVAccessdata":false
            }

            //let req1 = {
            //    // "ParentOrganizationId": $scope.ParenthospitalId,
            //    "OrganizationId": $scope.HospitalId,
            //};
            let req2 = {
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": $scope.PreOpAndDialationMedications.AppointmentID || null,
                "PatientId": $scope.PreOpAndDialationMedications.PatientID || null,
                "PatientSurgeryId": $scope.PreOpAndDialationMedications.PatientSurgeryId || 0,
            };
            let req3 = {
                "ParentOrganizationId": $scope.ParenthospitalId,
                "CheckListModuleId": 1
            };
            let req4 = {
                "HospitalId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "ScreenTypeId": 0,
                "PageSize": 100,
                "SearchText": '',
                "PageNumber": 1,

            };
            $q.all([
                eHnoteSurgeryService.GetOrganizationPreOpMedications($scope.HospitalId),
                eHnoteSurgeryService.GetOrganizationASCCheckListData(req3),
                eHnoteSurgeryService.GetPreOpChartData(req2),
                eHnoteSurgeryService.GetAscUserOrderTemplates(req4),
                eHnoteSurgeryService.GetAppointmentMedications(req2),
                eHnoteDiagnosisDataServices.GetMedicineDosageFieldsMasterData(),

            ]).then(function (resp) {
                if (resp[0].data.status === "Success") {
                    angular.forEach(resp[0].data.rows, function (item) {
                        item.AscMedicationId = 0;
                        item.IsChecked = false;
                        item.DropTimings = [{ "MedicationTime": "" }, { "MedicationTime": "" }];
                    });
                    $scope.LogObj.FavouriteMedications = angular.copy(resp[0].data.rows) || [];
                    let tempPreOpMedications = $filter('filter')(resp[0].data.rows, { "MedTypeId": 1 }, true);
                    $scope.MasterPreOpMedications = angular.copy(tempPreOpMedications) || [];
                    let tempDilationMedications = $filter('filter')(resp[0].data.rows, { "MedTypeId": 2 }, true);
                    $scope.MasterDilationMedications = angular.copy(tempDilationMedications);
                    let tempanesthesiaMedications = $filter('filter')(resp[0].data.rows, { "MedTypeId": 3 }, true);
                    $scope.MasterAnesthesiaMedications = angular.copy(tempanesthesiaMedications);
                    let tempintraopMedications = $filter('filter')(resp[0].data.rows, { "MedTypeId": 4 }, true);
                    $scope.MasterIntraOpMedications = angular.copy(tempintraopMedications);
                    let temppostopMedications = $filter('filter')(resp[0].data.rows, { "MedTypeId": 5 }, true);
                    $scope.MasterPostOpMedications = angular.copy(temppostopMedications);

                     let temppostopanesthesiaMedications = $filter('filter')(resp[0].data.rows, { "MedTypeId": 8 }, true);
                    $scope.MasterPostOpAnesthesiaMedications = angular.copy(temppostopanesthesiaMedications);


                }
                if (resp[1].data.status === "Success") {

                    $scope.PreOpObj.OrgASCChecklist = angular.copy(resp[1].data.rows);
                    angular.forEach($scope.PreOpObj.OrgASCChecklist, function (item) {
                        angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                            kitem.IsChecked = false;
                        });
                    });

                    $scope.IVSiteMarkingList = resp[1].data.IVSiteMarkingList || [];


                    $scope.PreOpObj.IVSiteArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 1 }, true);

                    //if (!$scope.ParentObj.IsIOJParentOrganization) {
                    //    $scope.PreOpObj.IVBlockedArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 7 }, true) || [];
                    //} else {
                    //    $scope.PreOpObj.IVBlockedArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 2 }, true) || [];
                    //};

                    $scope.PreOpObj.IVBlockedArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 2 }, true) || [];

                    $scope.PreOpObj.NeedleSize = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 3 }, true);

                    if ($scope.PreOpObj.IVBlockedArray.length > 0) {
                        angular.forEach($scope.PreOpObj.IVBlockedArray, function (item) {
                            item.IsSelected = false;
                            item.DeleteInd = 'N';
                        })
                    }

                    angular.forEach($scope.PreOpObj.IVAccessDetailsList, function (ivItem) {
                        ivItem.IVBlockedArray = angular.copy($scope.PreOpObj.IVBlockedArray);
                    });

                    if (!$scope.ParentObj.IsIOJParentOrganization) {
                        $scope.PreOpObj.IVSiteFluidsArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 6 }, true);
                        $scope.PreOpObj.IVSiteFlushArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 4 }, true);
                        $scope.PreOpObj.IVSiteLRArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 5 }, true);
                        $scope.PreOpObj.IVFluidsArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 8 }, true);
                    };
                }
                if (resp[2].data.Status === "Success") {
                    if (resp[2].data.rows.length > 0) {
                        let PreOpMedicationInfo = resp[2].data.rows[0] || "";
                        $scope.PreOpAndDialationMedications.PatientASCPreOPId = PreOpMedicationInfo.PatientASCPreOPId || 0;
                        $scope.PreOpAndDialationMedications.ODPupilSize = PreOpMedicationInfo.ODPupilSize || "";
                        $scope.PreOpAndDialationMedications.OSPupilSize = PreOpMedicationInfo.OSPupilSize || "";
                        $scope.PreOpAndDialationMedications.PreOpMedicationRemarks = PreOpMedicationInfo.PreOpMedicationRemarks;
                        $scope.PreOpAndDialationMedications.MedicationRemarks = PreOpMedicationInfo.MedicationRemarks;
                        $scope.PreOpAndDialationMedications.IsVeinOpened = PreOpMedicationInfo.IsVeinOpened;
                        $scope.LogObj.IsVeinOpened = PreOpMedicationInfo.IsVeinOpened;
                        $scope.PreOpAndDialationMedications.IsDiabetes = PreOpMedicationInfo.IsDiabetes;
                        $scope.PreOpAndDialationMedications.IsHypoglycemiaCheck = PreOpMedicationInfo.IsHypoglycemiaCheck;
                        $scope.PreOpAndDialationMedications.DiabetesResult = PreOpMedicationInfo.DiabetesResult;
                        $scope.PreOpAndDialationMedications.DiabetesTime = PreOpMedicationInfo.DiabetesTime;
                        $scope.PreOpAndDialationMedications.DilationReviewId = PreOpMedicationInfo.DilationReviewId || null;
                        $scope.PreOpAndDialationMedications.MedicationReviewId = PreOpMedicationInfo.MedicationReviewId || null;
                        $scope.PreOpAndDialationMedications.DilationMedicationsNotes = PreOpMedicationInfo.DilationMedicationsNotes || "";
                        $scope.PreOpAndDialationMedications.DiabetesTimings = PreOpMedicationInfo.DiabetesTimings || [];

                        $scope.PreOpAndDialationMedications.PreOpNurseChartStatus = PreOpMedicationInfo.PreOpNurseChartStatus || '';
                        $scope.PreOpAndDialationMedications.PreOpAnesthesiaChartStatus = PreOpMedicationInfo.PreOpAnesthesiaChartStatus || '';

                        if ($scope.PreOpAndDialationMedications.DilationReviewId != null) {
                            var DilationArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.PreOpAndDialationMedications.DilationReviewId });
                            DilationArraylist = DilationArraylist || [];
                            if (DilationArraylist.length > 0) {
                                $scope.PreOpAndDialationMedications.DilationReviewName = angular.copy(DilationArraylist[0].FullName);
                            }
                        }

                        if ($scope.PreOpAndDialationMedications.MedicationReviewId != null) {
                            var MedicationArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.PreOpAndDialationMedications.MedicationReviewId });
                            MedicationArraylist = MedicationArraylist || [];
                            if (MedicationArraylist.length > 0) {
                                $scope.PreOpAndDialationMedications.MedicationReviewName = angular.copy(MedicationArraylist[0].FullName);
                            }
                        }
                        $scope.PreOpAndDialationMedications.MedicationRemarks = PreOpMedicationInfo.MedicationRemarks || "";
                        if ($scope.PreOpAndDialationMedications.MedicationRemarks != '') {
                            $scope.PreOpAndDialationMedications.MedicationshownotesInd = true;
                        } else {
                            $scope.PreOpAndDialationMedications.MedicationshownotesInd = false;
                        }
                        $scope.PreOpAndDialationMedications.DilationMedicationsNotes = PreOpMedicationInfo.DilationMedicationsNotes || "";
                        if ($scope.PreOpAndDialationMedications.DilationMedicationsNotes != '') {
                            $scope.PreOpAndDialationMedications.DilationMedicationsShowNotesInd = true;
                        } else {
                            $scope.PreOpAndDialationMedications.DilationMedicationsShowNotesInd = false;
                        }


                        $scope.PreOpObj.IsDiabetes = resp[2].data.rows[0].IsDiabetes;
                        $scope.LogObj.IsDiabetes = resp[2].data.rows[0].IsDiabetes;
                        $scope.PreOpObj.IsHypoglycemiaCheck = resp[2].data.rows[0].IsHypoglycemiaCheck || false;
                        $scope.LogObj.IsHypoglycemiaCheck = resp[2].data.rows[0].IsHypoglycemiaCheck || false;
                        $scope.PreOpObj.IsSurgeonOrdersTimeChecked = resp[2].data.rows[0].IsSurgeonOrdersTimeChecked || false;
                        $scope.PreOpObj.IsAnesthesiaOrdersTimeChecked = resp[2].data.rows[0].IsAnesthesiaOrdersTimeChecked || false;

                        if ($scope.PreOpObj.IsHypoglycemiaCheck == true) {
                            $scope.PreOpAndDialationMedications.IsHypoglycemiaCheck = true;
                        }

                        $scope.LogObj.DilationOrderDetails = [];
                        $scope.LogObj.PreOpOrderDetails = [];
                        if (resp[2].data.rows[0].OrderDetails.length > 0) {
                            $scope.PreOpObj.OrderDetails = resp[2].data.rows[0].OrderDetails || [];
                            $scope.SetSurgeonCredentials($scope.PreOpObj.OrderDetails);
                            //$scope.PreOpObj.OrgASCChecklist = resp[2].data.rows[0].OrgASCChecklist || [];
                            //$scope.PreOpObj.IVBlockedArray = resp[2].data.rows[0].IVBlockedArray || [];
                            $scope.PreOpObj.DiabetesTimings = resp[2].data.rows[0].DiabetesTimings || [];                          
                            $scope.PreOpObj.ODPupilSize = resp[2].data.rows[0].ODPupilSize || '';
                            $scope.PreOpObj.OSPupilSize = resp[2].data.rows[0].OSPupilSize || '';
                            $scope.PreOpObj.IVNeedleSizeName = resp[2].data.rows[0].IVNeedleSizeName || '';
                            $scope.PreOpObj.IVSiteName = resp[2].data.rows[0].IVSiteName || '';
                            $scope.PreOpObj.IVNeedleSize = resp[2].data.rows[0].IVNeedleSize || 0;
                            $scope.PreOpObj.IVSite = resp[2].data.rows[0].IVSite || 0;
                            $scope.LogObj.DilationMedications = [];
                            $scope.LogObj.GeneralOrders = [];
                            $scope.LogObj.PreOpMedications = [];
                            $scope.LogObj.PreOpMediGeneralOrders = [];

                            let templogorders = angular.copy(resp[2].data.rows[0].OrderDetails) || [];

                            if (templogorders.length > 0) {
                                let FinalDilation = $filter('filter')(templogorders, { 'MedTypeId': 2 }, true) || [];
                                $scope.IspropMedicationSurgeon = true;
                                if (FinalDilation.length > 0) {

                                    let isDilationColumnTrue = FinalDilation.some(order =>
                                        (order.DilationMedications &&
                                            order.DilationMedications.some(item => item.DeleteInd === 'N'))
                                    );
                                    if (isDilationColumnTrue) {
                                        $scope.PreOpObj.DisableSurgeonordersCheck = isDilationColumnTrue;
                                        $scope.PreOpObj.IsSurgeonOrdersTimeChecked = !isDilationColumnTrue;
                                    }
                                    $scope.IspropMedicationSurgeon = true;
                                    angular.forEach(FinalDilation, function (Mitem) {
                                        Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                                        Mitem.UserOrderId = Mitem.UserOrderId || null;
                                        Mitem.UserType = Mitem.UserType || null;
                                        Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                                        Mitem.ReviewedByName = Mitem.ReviewedByName || '';
                                        Mitem.ModifiedDt = Mitem.ModifiedDt || '';

                                        if (Mitem.DilationMedications.length > 0) {
                                            if (Mitem.DilationMedications.length > 0) {
                                                angular.forEach(Mitem.DilationMedications, function (item) {
                                                    var dateTimeString = item.ModifiedDt;
                                                    $scope.ModifiedDilationDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                                                    angular.forEach(item.DropTimings, function (kitem) {
                                                        kitem.IsEditDrop = false;
                                                        kitem.IsEditview = true;
                                                        kitem.shownotes = false;
                                                        if (kitem.GivenBy == $scope.UserId || $scope.RoleId == 73) {
                                                            kitem.IsEditDrop = true;
                                                        }
                                                    });
                                                    $scope.LogObj.DilationMedications.push(item);
                                                });
                                            }

                                        }
                                        if (Mitem.GeneralOrders.length > 0) {
                                            angular.forEach(Mitem.GeneralOrders, function (gitem) {
                                                $scope.LogObj.GeneralOrders.push(gitem);

                                            });
                                        }

                                    });
                                    $scope.LogObj.DilationOrderDetails = angular.copy(FinalDilation);
                                }
                                
                                let FinalPreOrderDetails = $filter('filter')(templogorders, { 'MedTypeId': 1 }, true) || [];
                                if (FinalPreOrderDetails.length > 0) {

                                    let isColumnTrue = FinalPreOrderDetails.some(order =>
                                        (order.PreOpMedications &&
                                            order.PreOpMedications.some(item => item.DeleteInd === 'N'))
                                    );
                                    if (isColumnTrue) {
                                        $scope.PreOpObj.DisableAnesthesiaOrdersCheck = isColumnTrue;
                                        $scope.PreOpObj.IsAnesthesiaOrdersTimeChecked = !isColumnTrue;
                                    }
                                    $scope.IspropMedicationAnsthesia = true;
                                    angular.forEach(FinalPreOrderDetails, function (Mitem) {
                                        Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                                        Mitem.UserOrderId = Mitem.UserOrderId || null;
                                        Mitem.UserType = Mitem.UserType || null;
                                        Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                                        Mitem.ReviewedByName = Mitem.ReviewedByName || '';
                                        Mitem.ModifiedDt = Mitem.ModifiedDt || '';


                                        if (Mitem.GeneralOrders.length > 0) {
                                            angular.forEach(Mitem.GeneralOrders, function (gitem) {
                                                $scope.LogObj.PreOpMediGeneralOrders.push(gitem);

                                            });
                                        }
                                        if (Mitem.PreOpMedications.length > 0) {
                                            if (Mitem.PreOpMedications.length > 0) {
                                                angular.forEach(Mitem.PreOpMedications, function (item) {
                                                    var dateTimeString = item.ModifiedDt;
                                                    $scope.ModifiedPreopMedicationDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                                                    angular.forEach(item.DropTimings, function (kitem) {
                                                        kitem.IsEditDrop = false;
                                                        kitem.IsEditview = true;
                                                        kitem.shownotes = false;
                                                        if (kitem.GivenBy == $scope.UserId || $scope.RoleId == 73) {
                                                            kitem.IsEditDrop = true;
                                                        }
                                                    });
                                                    $scope.LogObj.PreOpMedications.push(item);
                                                });
                                            }

                                        }
                                    });

                                    $scope.LogObj.PreOpOrderDetails = angular.copy(FinalPreOrderDetails);
                                }
                            }


                         

                            angular.forEach($scope.PreOpObj.OrderDetails, function (Mitem) {
                                Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                                Mitem.UserOrderId = Mitem.UserOrderId || null;
                                Mitem.UserType = Mitem.UserType || null;
                                Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                                Mitem.ReviewedByName = Mitem.ReviewedByName || '';
                                Mitem.ModifiedDt = Mitem.ModifiedDt || '';

                                if (Mitem.DilationMedications.length > 0) {
                                    if (Mitem.DilationMedications.length > 0) {
                                        angular.forEach(Mitem.DilationMedications, function (item) {
                                            var dateTimeString = item.ModifiedDt;
                                            $scope.ModifiedDilationDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                                            angular.forEach(item.DropTimings, function (kitem) {
                                                kitem.IsEditDrop = false;
                                                kitem.IsEditview = true;
                                                kitem.shownotes = false;
                                                if (kitem.GivenBy == $scope.UserId || $scope.RoleId == 73) {
                                                    kitem.IsEditDrop = true;
                                                }
                                            });
                                        });
                                    }

                                }

                                if (Mitem.PreOpMedications.length > 0) {
                                    if (Mitem.PreOpMedications.length > 0) {
                                        angular.forEach(Mitem.PreOpMedications, function (item) {
                                            var dateTimeString = item.ModifiedDt;
                                            $scope.ModifiedPreopMedicationDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                                            angular.forEach(item.DropTimings, function (kitem) {
                                                kitem.IsEditDrop = false;
                                                kitem.IsEditview = true;
                                                kitem.shownotes = false;
                                                if (kitem.GivenBy == $scope.UserId || $scope.RoleId == 73) {
                                                    kitem.IsEditDrop = true;
                                                }
                                            });
                                        });
                                    }

                                }
                            });
                            if ($scope.PreOpObj.OrderDetails.length > 0) {
                                var NurseMedCount = 0;
                                var NurseGenCount = 0;
                                var AnesthesiaGenCount = 0;
                                var AnesthesiaMedCount = 0;

                                angular.forEach($scope.PreOpObj.OrderDetails, function (item) {
                                    if (item.MedTypeId == 1) {
                                        if (item.PreOpMedications.length > 0) {
                                            AnesthesiaMedCount++;
                                        };
                                        if (item.GeneralOrders.length > 0) {
                                            AnesthesiaGenCount++;
                                        };
                                    }
                                    else if (item.MedTypeId == 2) {
                                        if (item.DilationMedications.length > 0) {
                                            NurseMedCount++;
                                        };
                                        if (item.GeneralOrders.length > 0) {
                                            NurseGenCount++;
                                        };
                                    }
                                });

                                if (NurseMedCount !== 0) {
                                    $scope.show.IsNurseMedications = true;
                                } else {
                                    $scope.show.IsNurseMedications = false;
                                };

                                if (NurseGenCount !== 0) {
                                    $scope.show.IsNurseGenOrders = true;
                                } else {
                                    $scope.show.IsNurseGenOrders = false;
                                };
                                if (AnesthesiaMedCount !== 0) {
                                    $scope.show.IsAnesthesiaMedications = true;
                                } else {
                                    $scope.show.IsAnesthesiaMedications = false;
                                };

                                if (AnesthesiaGenCount !== 0) {
                                    $scope.show.IsAnesthesiaGenOrders = true;
                                } else {
                                    $scope.show.IsAnesthesiaGenOrders = false;
                                };
                            } else {
                                $scope.PreOpObj.OrderDetails = [];

                                $scope.show.IsAnesthesiaMedications = false;
                                $scope.show.IsAnesthesiaGenOrders = false;
                                $scope.show.IsNurseGenOrders = false;
                                $scope.show.IsNurseMedications = false;
                            }


                            let NurseOrders = $filter("filter")($scope.PreOpObj.OrderDetails, { "MedTypeId": 2}, true)||[];
                            let AnesthesiaOrders = $filter("filter")($scope.PreOpObj.OrderDetails, { "MedTypeId": 1 }, true) || [];
                            if (AnesthesiaOrders.length > 0 || $scope.PreOpAndDialationMedications.IsVeinOpened !== null || $scope.PreOpAndDialationMedications.IsDiabetes !== null || $scope.PreOpObj.DiabetesTimings.length > 0) {
                                $scope.PreOpObj.IsShowAnesthesiaSummaryViewInd = true;
                            }
                            if (NurseOrders.length > 0 || $scope.PreOpObj.ODPupilSize != '' || $scope.PreOpObj.OSPupilSize != '' || $scope.PreOpObj.IsSurgeonOrdersTimeChecked) {
                                $scope.PreOpObj.IsShowNurseSummaryViewInd = true;
                            }
                        }

                        //if (resp[2].data.rows[0].PreOpMedications.length > 0) {
                        //    $scope.PreOpAndDialationMedications.PreOpMedications = resp[2].data.rows[0].PreOpMedications || [];
                        //    if ($scope.PreOpAndDialationMedications.PreOpMedications.length > 0) {
                        //        angular.forEach($scope.PreOpAndDialationMedications.PreOpMedications, function (item) {
                        //            angular.forEach(item.DropTimings, function (kitem) {
                        //                kitem.IsEditDrop = false;
                        //                kitem.IsEditview = true;
                        //                kitem.shownotes = false;
                        //                if (kitem.GivenBy == $scope.UserId || $scope.RoleId == 73) {
                        //                    kitem.IsEditDrop = true;
                        //                }
                        //            });
                        //        });
                        //    }

                        //}

                        //if (resp[2].data.rows[0].DilationMedications.length > 0) {

                        //    $scope.PreOpAndDialationMedications.DilationMedications = resp[2].data.rows[0].DilationMedications || [];
                        //    if ($scope.PreOpAndDialationMedications.DilationMedications.length > 0) {
                        //        angular.forEach($scope.PreOpAndDialationMedications.DilationMedications, function (item) {
                        //            angular.forEach(item.DropTimings, function (kitem) {
                        //                kitem.IsEditDrop = false;
                        //                kitem.IsEditview = true;
                        //                kitem.shownotes = false;
                        //                if (kitem.GivenBy == $scope.UserId || $scope.RoleId == 73) {
                        //                    kitem.IsEditDrop = true;
                        //                }
                        //            });
                        //        });
                        //    }

                        //}
                        $scope.PreOpObj.ODPupilSize = resp[2].data.rows[0].ODPupilSize || '';
                        $scope.PreOpObj.OSPupilSize = resp[2].data.rows[0].OSPupilSize || '';
                        $scope.LogObj.ODPupilSize = resp[2].data.rows[0].ODPupilSize || '';
                        $scope.LogObj.OSPupilSize = resp[2].data.rows[0].OSPupilSize || '';

                        $scope.PreOpObj.IVSite = resp[2].data.rows[0].IVSite || 0;
                        $scope.LogObj.IVSite = resp[2].data.rows[0].IVSite || 0;
                        $scope.PreOpObj.IVNeedleSize = resp[2].data.rows[0].IVNeedleSize || 0;
                        $scope.LogObj.IVNeedleSize = resp[2].data.rows[0].IVNeedleSize || 0;
                        $scope.PreOpObj.SurgicalSiteVerifiedBy = resp[2].data.rows[0].SurgicalSiteVerifiedBy || null;

                        $scope.PreOpObj.IVSiteName = resp[2].data.rows[0].IVSiteName || "";
                        $scope.LogObj.IVSiteName = resp[2].data.rows[0].IVSiteName || "";
                        $scope.PreOpObj.IVNeedleSizeName = resp[2].data.rows[0].IVNeedleSizeName || "";
                        $scope.LogObj.IVNeedleSizeName = resp[2].data.rows[0].IVNeedleSizeName || "";
                        $scope.PreOpObj.PatencyStatus = resp[2].data.rows[0].PatencyStatus || "";
                        $scope.LogObj.PatencyStatus = resp[2].data.rows[0].PatencyStatus || "";
                        $scope.PreOpObj.IVArm = resp[2].data.rows[0].IVArm || "";
                        $scope.LogObj.IVArm = resp[2].data.rows[0].IVArm || "";

                        $scope.PreOpObj.NoOfAttempts = resp[2].data.rows[0].NoOfAttempts || null;
                        $scope.LogObj.NoOfAttempts = resp[2].data.rows[0].NoOfAttempts || null;
                        $scope.PreOpObj.IvAccessGivenBy = resp[2].data.rows[0].IvAccessGivenBy || null;
                        $scope.LogObj.IvAccessGivenBy = resp[2].data.rows[0].IvAccessGivenBy || null;
                        $scope.PreOpObj.IvAccessGivenByTime = resp[2].data.rows[0].IvAccessGivenByTime || '';
                        $scope.LogObj.IvAccessGivenByTime = resp[2].data.rows[0].IvAccessGivenByTime || '';
                        $scope.PreOpObj.IvAccessGivenByName = $scope.PreOpObj.IvAccessGivenByName || '';

                        if ($scope.PreOpObj.IvAccessGivenBy !== null) {
                            let IvGivenBy = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreOpObj.IvAccessGivenBy }, true) || [];
                            if (IvGivenBy.length > 0) {
                                $scope.PreOpObj.IvAccessGivenByName = IvGivenBy[0].FullName || '';
                            }
                        } else {
                            if ($scope.RoleId == 8) {
                                $scope.PreOpObj.IvAccessGivenBy = $scope.UserId || null;
                            };
                        }

                        $scope.PreOpObj.IVSiteFluids = resp[2].data.rows[0].IVSiteFluids || null;
                        $scope.LogObj.IVSiteFluids = resp[2].data.rows[0].IVSiteFluids || null;
                        $scope.PreOpObj.IVSiteFlush = resp[2].data.rows[0].IVSiteFlush || null;
                        $scope.LogObj.IVSiteFlush = resp[2].data.rows[0].IVSiteFlush || null;
                        $scope.PreOpObj.IVFluidsId = resp[2].data.rows[0].IVFluidsId || null;
                        $scope.LogObj.IVFluidsId = resp[2].data.rows[0].IVFluidsId || null;
                        $scope.PreOpObj.IVSiteLactatedRingers = resp[2].data.rows[0].IVSiteLactatedRingers || null;
                        $scope.LogObj.IVSiteLactatedRingers = resp[2].data.rows[0].IVSiteLactatedRingers || null;
                        
                        if ($scope.PreOpObj.IVSiteFluids !== null) {
                            let FluidsArray = $filter('filter')($scope.PreOpObj.IVSiteFluidsArray, { 'IVSiteMarkingId': $scope.PreOpObj.IVSiteFluids }, true) || [];
                            if (FluidsArray.length > 0) {
                                $scope.PreOpObj.IVSiteFluidsName = FluidsArray[0].IVSiteMarkingName || '';
                            };
                        };

                        if ($scope.PreOpObj.IVSiteFlush !== null) {
                            let FlushArray = $filter('filter')($scope.PreOpObj.IVSiteFlushArray, { 'IVSiteMarkingId': $scope.PreOpObj.IVSiteFlush }, true) || [];
                            if (FlushArray.length > 0) {
                                $scope.PreOpObj.IVSiteFlushName = FlushArray[0].IVSiteMarkingName || '';
                            };
                        };

                        if ($scope.PreOpObj.IVSiteLactatedRingers !== null) {
                            let LactatedArray = $filter('filter')($scope.PreOpObj.IVSiteLRArray, { 'IVSiteMarkingId': $scope.PreOpObj.IVSiteLactatedRingers }, true) || [];
                            if (LactatedArray.length > 0) {
                                $scope.PreOpObj.IVSiteLactatedRingersName = LactatedArray[0].IVSiteMarkingName || '';
                            };
                        };

                        if ($scope.PreOpObj.IVFluidsId !== null) {
                            let Array = $filter('filter')($scope.PreOpObj.IVFluidsArray, { 'IVSiteMarkingId': $scope.PreOpObj.IVFluidsId }, true) || [];
                            if (Array.length > 0) {
                                $scope.PreOpObj.IVFluidsName = Array[0].IVSiteMarkingName || '';
                            };
                        };

                        if ($scope.PreOpObj.PatencyStatus == 'Blocked') {
                            $scope.PreOpObj.IVSiteBlocked = true;
                        } else {
                            $scope.PreOpObj.IVSiteBlocked = false;
                        }

                       // $scope.PreOpObj.OrgASCChecklist = resp[2].data.rows[0].OrgASCChecklist || [];
                       
                        
                        $scope.PreOpObj.DiabetesTimings = resp[2].data.rows[0].DiabetesTimings || [];
                        $scope.LogObj.DiabetesTimings = angular.copy(resp[2].data.rows[0].DiabetesTimings) || [];
                        $scope.LogObj.IVBlockedArray = [];

                        if (resp[2].data.rows[0].IVBlockedArray.length > 0) {
                            let IVBlockedArray = [];
                            $scope.PreOpObj.IVSiteBlocked = true;
                            angular.forEach($scope.PreOpObj.IVBlockedArray, function (hitem) {
                                angular.forEach(resp[2].data.rows[0].IVBlockedArray, function (kitem) {
                                    if (kitem.IVSiteMarkingId === hitem.IVSiteMarkingId) {
                                        kitem.IsSelected = true;
                                        hitem.IsSelected = true;
                                        hitem.DeleteInd = 'N';
                                        hitem.IVSiteMarkingName = kitem.IVSiteMarkingName;
                                        hitem.PatientIVBlockedId = kitem.PatientIVBlockedId || 0;
                                        IVBlockedArray.push(hitem);
                                    }
                                });
                            });
                            $scope.LogObj.IVBlockedArray = angular.copy(IVBlockedArray);
                        }

                        // checklists
                        if (resp[2].data.rows[0].OrgASCChecklist.length > 0) {

                            let TemparrayList = $filter("filter")(resp[2].data.rows[0].OrgASCChecklist, { 'CheckListCategoryId': 12, "IsChecked": true }, true);
                            console.log(TemparrayList);
                            angular.forEach(resp[2].data.rows[0].OrgASCChecklist, function (item) {
                                angular.forEach($scope.PreOpObj.OrgASCChecklist, function (hitem) {
                                    if (hitem.CheckListCategoryId === item.CheckListCategoryId && item.CheckListId === hitem.CheckListId) {
                                        angular.forEach(hitem.OrganizationCheckListDetails, function (kitem) {
                                            if (kitem.Value == item.Value && kitem.CheckListId === item.CheckListId) {
                                                kitem.IsChecked = true;
                                                hitem.IsChecked = true;
                                                hitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || 0;
                                                hitem.Value = item.Value || '';
                                                hitem.Score = item.Score || 0;
                                            } else {
                                                kitem.IsChecked = false;
                                            }
                                        });
                                        hitem.Remarks = item.Remarks || "";
                                        hitem.ChecklistDate = $filter("date")(item.ChecklistDate, "MM-dd-yyyy") || "";
                                        if (hitem.CheckListCategoryId === 1) {
                                            if (hitem.Value == "N/A" || hitem.Value == "No" || hitem.Value == "Not") {
                                                hitem.ChecklistDate = null;
                                            }
                                        }
                                        if (hitem.CheckListCategoryId === 5) {
                                            if (hitem.CheckListId == 40) {
                                                if (hitem.Value == "N/A" || hitem.Value == "No" || hitem.Value == "Not") {
                                                    hitem.ChecklistDate = null;
                                                }
                                            }
                                        }
                                        if (hitem.Remarks != "") {
                                            hitem.shownotes = true;
                                            hitem.IsChecked = true;
                                        }
                                        if (hitem.ChecklistDate != "") {
                                            hitem.IsChecked = true;
                                        }

                                        if (hitem.CheckListId == 170) {
                                            if (item.AscMultiCheckValueArray.length > 0) {
                                                angular.forEach(item.AscMultiCheckValueArray, function (jitem) {
                                                    angular.forEach(hitem.OrganizationCheckListDetails, function (Kitem) {
                                                        if (Kitem.OrganizationPreOpCheckListValueId == jitem.OrganizationPreOpCheckListValueId) {
                                                            Kitem.IsChecked = true;
                                                            hitem.IsChecked = true;
                                                            Kitem.PatientMultiCheckListId = jitem.PatientMultiCheckListId || null;
                                                        }
                                                    });
                                                });
                                            }
                                        }
                                    }
                                });
                            });
                        }

                        $scope.LogObj.OrgASCChecklistLogs = angular.copy(resp[2].data.rows[0].OrgASCChecklist) || [];
                        angular.forEach($scope.LogObj.OrgASCChecklistLogs, function (kitem) {
                            kitem.Remarks = kitem.Remarks || "";
                            kitem.ChecklistDate = $filter("date")(kitem.ChecklistDate, "MM-dd-yyyy") || null;

                        });

                        if ($scope.PreOpObj.PatencyStatus == 'Blocked') {
                            $scope.PreOpObj.IVSiteBlocked = true;
                        } else {
                            $scope.PreOpObj.IVSiteBlocked = false;
                        }

                        if ($scope.PreOpObj.ODPupilSize != '' || $scope.PreOpObj.OSPupilSize != '' || $scope.PreOpObj.IsSurgeonOrdersTimeChecked) {
                            $scope.PreOpObj.IsShowNurseSummaryViewInd = true;
                        }

                        $scope.PreOpObj.IVAccessDetailsList = resp[2].data.rows[0].IVAccessDetailsList || [];

                        $scope.LogObj.IVAccessDetailsList = angular.copy($scope.PreOpObj.IVAccessDetailsList) || [];

                        if ($scope.LogObj.IVAccessDetailsList.length > 0) {
                            angular.forEach($scope.LogObj.IVAccessDetailsList, function (item) {
                                if (item.IvAccessGivenByDate) {
                                    item.IvAccessGivenByDate = $filter('date')(item.IvAccessGivenByDate, "MM-dd-yyyy");
                                }
                            })
                        }

                        if ($scope.PreOpObj.IVAccessDetailsList.length == 0) {
                            let obj = {
                                "IVAccessMainId": 0,
                                "UserId": $scope.UserId,
                                "DeleteInd": "N",
                                "IVSite": "",
                                "PatencyStatus": '',
                                "SelectStatusString": '',
                                "IVNeedleSize": null,
                                "IVSiteFluids": 41,
                                "IVSiteFluidsName": '',
                                "IVSiteFlush": 34,
                                "IVFluidsId": 50,
                                "IVSiteFlushName": '',
                                "IVSiteLactatedRingers": null,
                                "NoOfAttempts": null,
                                "IvAccessGivenBy": null,
                                "IvAccessGivenByName": null,
                                "IvAccessGivenByTime": '',
                                "IvAccessGivenByDate": null,
                                "ConditionList": [],
                                "IVBlockedArray": angular.copy($scope.PreOpObj.IVBlockedArray) || [],
                                "Remarks": '',
                                "SelectStatusString": '',
                                "IVSiteBlocked": false,
                                "IVFluidsName": "",
                                "IVSiteLactatedRingersName": "",
                                "IVArm": "",

                            }
                            $scope.PreOpObj.IVAccessDetailsList.push(obj);
                        }


                        $scope.PreOpObj.IsIVAccessdata = false;
                        if ($scope.PreOpObj.IVAccessDetailsList.length > 0) {
                            angular.forEach($scope.PreOpObj.IVAccessDetailsList, function (item) {
                                item.IVSiteFluidsName = item.IVSiteFluidsName || '';
                                if (item.IVSiteFluids !== null) {
                                    let FluidsArray = $filter('filter')($scope.PreOpObj.IVSiteFluidsArray, { 'IVSiteMarkingId': item.IVSiteFluids }, true) || [];
                                    if (FluidsArray.length > 0) {
                                        item.IVSiteFluidsName = FluidsArray[0].IVSiteMarkingName || '';
                                    }
                                };
                                item.IVSiteFlushName = item.IVSiteFlushName || '';
                                if (item.IVSiteFlush !== null) {
                                    let FlushArray = $filter('filter')($scope.PreOpObj.IVSiteFlushArray, { 'IVSiteMarkingId': item.IVSiteFlush }, true) || [];
                                    if (FlushArray.length > 0) {
                                        item.IVSiteFlushName = FlushArray[0].IVSiteMarkingName || '';
                                    }
                                };
                                item.IVSiteLactatedRingersName = item.IVSiteLactatedRingersName || '';
                                if (item.IVSiteLactatedRingers !== null) {
                                    let LactatedArray = $filter('filter')($scope.PreOpObj.IVSiteLRArray, { 'IVSiteMarkingId': item.IVSiteLactatedRingers }, true) || [];
                                    if (LactatedArray.length > 0) {
                                        item.IVSiteLactatedRingersName = LactatedArray[0].IVSiteMarkingName || '';
                                    }
                                };
                                item.IVFluidsName = item.IVFluidsName || "";
                                if (item.IVFluidsId !== null) {
                                    let Array = $filter('filter')($scope.PreOpObj.IVFluidsArray, { 'IVSiteMarkingId': item.IVFluidsId }, true) || [];
                                    if (Array.length > 0) {
                                        item.IVFluidsName = Array[0].IVSiteMarkingName || '';
                                    }
                                };

                                if (item.PatencyStatus == 'Not Patent' || item.PatencyStatus == 'Blocked') {
                                    item.IVSiteBlocked = true;
                                } else {
                                    item.IVSiteBlocked = false;
                                }
                                

                                if (item.IvAccessGivenBy !== null) {
                                    let IvGivenBy = $filter('filter')($scope.allUserList, { 'DoctorID': item.IvAccessGivenBy }, true) || [];
                                    if (IvGivenBy.length > 0) {
                                        item.IvAccessGivenByName = IvGivenBy[0].FullName || '';
                                    } else {
                                        item.IvAccessGivenByName = '';
                                    }
                                } else {
                                    if ($scope.RoleId == 8) {
                                        item.IvAccessGivenBy = $scope.UserId || null;
                                    };
                                    item.IvAccessGivenByName = '';
                                }
                                item.IVNeedleSizeName = item.IVNeedleSizeName || "";
                                item.IVSiteName = item.IVSiteName || "";
                                item.IVArm = item.IVArm || "";
                                item.IvAccessGivenByDate = item.IvAccessGivenByDate || null;
                                if (item.IvAccessGivenByDate != null) {
                                    item.IvAccessGivenByDate = $filter('date')(item.IvAccessGivenByDate, "MM-dd-yyyy");
                                }
                                if (item.PatencyStatus == '' && item.IvAccessGivenBy == null && item.IVNeedleSizeName == '' && item.IVSiteName == '' && item.IVArm == '' && item.IvAccessGivenByDate == null && item.ConditionList.length == 0) {
                                    $scope.PreOpObj.IsIVAccessdata = true;
                                }
                                
                            });
                        }

                        if (!$scope.PreOpObj.IsIVAccessdata || $scope.PreOpAndDialationMedications.IsVeinOpened !== null || $scope.PreOpAndDialationMedications.IsDiabetes !== null || $scope.PreOpObj.DiabetesTimings.length > 0 || $scope.PreOpObj.IsAnesthesiaOrdersTimeChecked) {
                            $scope.PreOpObj.IsShowAnesthesiaSummaryViewInd = true;
                        }

                    }
                    else {
                        $scope.PreOpAndDialationMedications.PatientASCPreOPId = 0;
                        $scope.PreOpAndDialationMedications.ODPupilSize = "";
                        $scope.PreOpAndDialationMedications.OSPupilSize = "";
                        $scope.PreOpAndDialationMedications.PreOpMedicationRemarks = "";
                        $scope.PreOpAndDialationMedications.MedicationRemarks = "";
                        $scope.PreOpAndDialationMedications.IsVeinOpened = null;
                        $scope.PreOpAndDialationMedications.IsDiabetes = null;
                        $scope.PreOpAndDialationMedications.IsHypoglycemiaCheck = null;
                        $scope.PreOpAndDialationMedications.DiabetesResult = "";
                        $scope.PreOpAndDialationMedications.DiabetesTime = "";
                        $scope.PreOpAndDialationMedications.DilationReviewId = null;
                        $scope.PreOpAndDialationMedications.MedicationReviewId = null;
                        $scope.PreOpAndDialationMedications.DilationMedicationsNotes = "";
                        $scope.PreOpAndDialationMedications.DilationReviewId = "";
                        $scope.PreOpAndDialationMedications.DilationMedications = $scope.PreOpAndDialationMedications.DilationMedications || [];
                        $scope.PreOpAndDialationMedications.PreOpMedications = $scope.PreOpAndDialationMedications.PreOpMedications || [];
                        $scope.PreOpAndDialationMedications.DiabetesTimings = [];
                        $scope.PreOpAndDialationMedications.PreOpNurseChartStatus = '';
                        $scope.PreOpAndDialationMedications.PreOpAnesthesiaChartStatus = '';
                    }
                }
                if (resp[3].data.Status === "Success") {
                    $scope.UserOrderList = resp[3].data.rows || [];
                }
                if (resp[4].data.Status === "Success") {


                    //if (resp[4].data.PreOp.length > 0) {
                    //    $scope.PreOpObj.OrderDetails = resp[4].data.PreOp[0].OrderDetails || [];
                    //}

                    if (resp[4].data.PostOp.length>0) {
                        $scope.PostOpObj.PatientASCPostOPId = resp[4].data.PostOp[0].PatientASCPostOPId || null;
                        $scope.PostOpObj.IsPostOpAnesthesiaOrdersTimeAdded = resp[4].data.PostOp[0].IsPostOpAnesthesiaOrdersTimeAdded || false;
                        $scope.PostOpObj.IsPostOpSurgeonOrdersTimeAdded = resp[4].data.PostOp[0].IsPostOpSurgeonOrdersTimeAdded || false;
                        $scope.PostOpObj.PostOpNurseChartStatus = resp[4].data.PostOp[0].PostOpNurseChartStatus || '';
                        $scope.PostOpObj.PostOpAnesthesiaChartStatus = resp[4].data.PostOp[0].PostOpAnesthesiaChartStatus || '';
                        $scope.PostOpObj.OrderDetails = resp[4].data.PostOp[0].OrderDetails || [];
                        $scope.SetSurgeonCredentials($scope.PostOpObj.OrderDetails);

                        let PostOpOrderDetails = angular.copy(resp[4].data.PostOp[0].OrderDetails) || [];

                        $scope.LogObj.PostOpOrderDetails = $filter('filter')(PostOpOrderDetails, { "MedTypeId": 5 }, true) || [];
                        $scope.LogObj.PostOpAnesthesiaOrderDetails = $filter('filter')(PostOpOrderDetails, { "MedTypeId": 8 }, true) || [];
                        $scope.LogObj.PostOpMedications = [];
                        $scope.LogObj.PostOpGeneralOrders = [];
                        $scope.LogObj.PostOpAnesthesiaMedications = [];
                        $scope.LogObj.PostOpAnesthesiaGeneralOrders = [];

                        if ($scope.LogObj.PostOpOrderDetails.length > 0) {
                            angular.forEach($scope.LogObj.PostOpOrderDetails, function (Mitem) {
                                Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                                Mitem.UserOrderId = Mitem.UserOrderId || null;
                                Mitem.UserType = Mitem.UserType || null;
                                Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                                Mitem.ReviewedByName = Mitem.ReviewedByName || '';
                                Mitem.LicenseNumber = Mitem.LicenseNumber || '';
                                Mitem.ModifiedDt = Mitem.ModifiedDt || '';

                                if (Mitem.PostOpMedications.length > 0) {
                                    angular.forEach(Mitem.PostOpMedications, function (item) {
                                        $scope.LogObj.PostOpMedications.push(item);
                                    });
                                }
                                if (Mitem.GeneralOrders.length > 0) {
                                    angular.forEach(Mitem.GeneralOrders, function (gitem) {
                                        $scope.LogObj.PostOpGeneralOrders.push(gitem);
                                    });
                                }
                            });
                        }

                        if ($scope.LogObj.PostOpAnesthesiaOrderDetails.length > 0) {
                            angular.forEach($scope.LogObj.PostOpAnesthesiaOrderDetails, function (Mitem) {
                                Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                                Mitem.UserOrderId = Mitem.UserOrderId || null;
                                Mitem.UserType = Mitem.UserType || null;
                                Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                                Mitem.ReviewedByName = Mitem.ReviewedByName || '';
                                Mitem.LicenseNumber = Mitem.LicenseNumber || '';
                                Mitem.ModifiedDt = Mitem.ModifiedDt || '';

                                if (Mitem.PostOpMedications.length > 0) {
                                    angular.forEach(Mitem.PostOpMedications, function (item) {
                                        $scope.LogObj.PostOpAnesthesiaMedications.push(item);
                                    });
                                }
                                if (Mitem.GeneralOrders.length > 0) {
                                    angular.forEach(Mitem.GeneralOrders, function (gitem) {
                                        $scope.LogObj.PostOpAnesthesiaGeneralOrders.push(gitem);
                                    });
                                }
                            });
                        }
                        $scope.PostOpObj.IsShowNurseSummaryViewInd = false;
                        $scope.PostOpObj.IsShowAnesthesiaSummaryViewInd = false;

                        if ($scope.PostOpObj.OrderDetails.length>0) {
                            
                            let PostOpNurse = $filter('filter')($scope.PostOpObj.OrderDetails, { "MedTypeId": 5 }, true) || [];
                            let PostOpAnesthesia = $filter('filter')($scope.PostOpObj.OrderDetails, { "MedTypeId": 8 }, true) || [];

                            if (PostOpNurse.length > 0) {
                                let isPostOpColumnTrue = PostOpNurse.some(order =>
                                    (order.PostOpMedications &&
                                        order.PostOpMedications.some(item => item.DeleteInd === 'N'))
                                );
                                if (isPostOpColumnTrue) {
                                    $scope.PostOpObj.DisablePostOpSurgeonCheck = isPostOpColumnTrue;
                                    $scope.PostOpObj.IsPostOpSurgeonOrdersTimeAdded = !isPostOpColumnTrue;
                                }
                                $scope.IsPostOpMedicationSurgeon = true;
                                $scope.PostOpObj.IsShowNurseSummaryViewInd = true;
                            } else {
                                $scope.PostOpObj.IsShowNurseSummaryViewInd = false;
                                $scope.IsPostOpMedicationSurgeon = false;
                            };

                            if (PostOpAnesthesia.length > 0) {
                                let isColumnTrue = PostOpAnesthesia.some(order =>
                                    (order.PostOpMedications &&
                                        order.PostOpMedications.some(item => item.DeleteInd === 'N'))
                                );
                                if (isColumnTrue) {
                                    $scope.PostOpObj.DisablePostOpAnesthesiaCheck = isColumnTrue;
                                    $scope.PostOpObj.IsPostOpAnesthesiaOrdersTimeAdded = !isColumnTrue;
                                }
                                $scope.PostOpObj.IsShowAnesthesiaSummaryViewInd = true;
                                $scope.IsPostOpMedicationAnsthesia = true;
                            } else {
                                $scope.PostOpObj.IsShowAnesthesiaSummaryViewInd = false;
                                $scope.IsPostOpMedicationAnsthesia = false;
                            }

                            angular.forEach($scope.PostOpObj.OrderDetails, function (Mitem) {
                                Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                                Mitem.UserOrderId = Mitem.UserOrderId || null;
                                Mitem.UserType = Mitem.UserType || null;
                                Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                                Mitem.ReviewedByName = Mitem.ReviewedByName || '';
                                Mitem.LicenseNumber = Mitem.LicenseNumber || '';
                                Mitem.ModifiedDt = Mitem.ModifiedDt || '';

                                if (Mitem.PostOpMedications.length > 0) {
                                    if (Mitem.PostOpMedications.length > 0) {
                                        angular.forEach(Mitem.PostOpMedications, function (item) {
                                            var dateTimeString = item.ModifiedDt;
                                            $scope.ModifiedPostopDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                                            angular.forEach(item.DropTimings, function (kitem) {
                                                kitem.IsEditDrop = false;
                                                kitem.IsEditview = true;
                                                kitem.shownotes = false;
                                                if (kitem.GivenBy == $scope.UserId || $scope.RoleId == 73) {
                                                    kitem.IsEditDrop = true;
                                                }
                                            });
                                        });
                                    }

                                }


                            });
                        }

                        if ($scope.PostOpObj.OrderDetails.length > 0) {
                            var MedCount = 0;
                            var GenCount = 0;

                            angular.forEach($scope.PostOpObj.OrderDetails, function (item) {
                                if (item.PostOpMedications.length > 0) {
                                    MedCount++;
                                };
                                if (item.GeneralOrders.length > 0) {
                                    GenCount++;
                                };
                            });

                            if (MedCount !== 0) {
                                $scope.IspostopMedications = true;
                            } else {
                                $scope.IspostopMedications = false;
                            };

                            if (GenCount !== 0) {
                                $scope.IsPostopGenOrders = true;
                            } else {
                                $scope.IsPostopGenOrders = false;
                            };
                        } else {
                            $scope.PostOpObj.OrderDetails = [];

                            $scope.IspostopMedications = false;
                            $scope.IsPostopGenOrders = false;
                        }

                        if ($scope.PostOpObj.IsPostOpSurgeonOrdersTimeAdded) {
                            $scope.PostOpObj.IsShowNurseSummaryViewInd = true;
                        }

                        if ($scope.PostOpObj.IsPostOpAnesthesiaOrdersTimeAdded) {
                            $scope.PostOpObj.IsShowAnesthesiaSummaryViewInd = true;
                        }

                    }

                    if (resp[4].data.IntraOP.length > 0) {
                        $scope.IntraOpObj.PatientASCIntraOPId = resp[4].data.IntraOP[0].PatientASCIntraOPId || null;
                        $scope.IntraOpObj.IsIntraOpAnesthesiaOrdersTimeAdded = resp[4].data.IntraOP[0].IsIntraOpAnesthesiaOrdersTimeAdded || false;
                        $scope.IntraOpObj.IsIntraOpSurgeonOrdersTimeAdded = resp[4].data.IntraOP[0].IsIntraOpSurgeonOrdersTimeAdded || false;
                        $scope.IntraOpObj.IntraOpNurseChartStatus = resp[4].data.IntraOP[0].IntraOpNurseChartStatus || null;
                        $scope.IntraOpObj.IntraOpAnesthesiaChartStatus = resp[4].data.IntraOP[0].IntraOpAnesthesiaChartStatus || null;
                        //$scope.IntraOpObj.IntraOpMedications = resp[4].data.IntraOP[0].IntraMedications || [];
                        //$scope.IntraOpObj.AnesthesiaMedications = resp[4].data.IntraOP[0].IntraAnesthesiaMedications || [];
                        $scope.IntraOpObj.OrderDetails = resp[4].data.IntraOP[0].OrderDetails || [];
                        $scope.SetSurgeonCredentials($scope.IntraOpObj.OrderDetails);
                        let IntraOpOrderDetails = angular.copy(resp[4].data.IntraOP[0].OrderDetails) || [];
                        $scope.LogObj.IntraOpOrderDetails = $filter('filter')(IntraOpOrderDetails, { "MedTypeId": 4 }, true) || [];
                        $scope.LogObj.IntraOpAnesthesiaOrderDetails = $filter('filter')(IntraOpOrderDetails, { "MedTypeId": 3 }, true) || [];
                        $scope.LogObj.IntraOpMedications = [];
                        $scope.LogObj.IntraopGeneralOrders = [];
                        $scope.LogObj.IntraOpAnesthesiaMedications = [];
                        $scope.LogObj.IntraopAnesthesiaGeneralOrders = [];
                        if ($scope.LogObj.IntraOpOrderDetails.length > 0) {
                            angular.forEach($scope.LogObj.IntraOpOrderDetails, function (Mitem) {
                                Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                                Mitem.UserOrderId = Mitem.UserOrderId || null;
                                Mitem.UserType = Mitem.UserType || null;
                                Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                                Mitem.ReviewedByName = Mitem.ReviewedByName || '';
                                Mitem.LicenseNumber = Mitem.LicenseNumber || '';
                                Mitem.ModifiedDt = Mitem.ModifiedDt || '';

                                if (Mitem.IntraOpMedications.length > 0) {
                                    if (Mitem.IntraOpMedications.length > 0) {
                                        angular.forEach(Mitem.IntraOpMedications, function (item) {
                                            $scope.LogObj.IntraOpMedications.push(item);
                                        });
                                    }

                                }

                                if (Mitem.GeneralOrders.length > 0) {
                                    angular.forEach(Mitem.GeneralOrders, function (gitem) {
                                        $scope.LogObj.IntraopGeneralOrders.push(gitem);
                                    });
                                }
                            });
                        }

                        if ($scope.LogObj.IntraOpAnesthesiaOrderDetails.length > 0) {
                            angular.forEach($scope.LogObj.IntraOpAnesthesiaOrderDetails, function (Mitem) {
                                Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                                Mitem.UserOrderId = Mitem.UserOrderId || null;
                                Mitem.UserType = Mitem.UserType || null;
                                Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                                Mitem.ReviewedByName = Mitem.ReviewedByName || '';
                                Mitem.LicenseNumber = Mitem.LicenseNumber || '';
                                Mitem.ModifiedDt = Mitem.ModifiedDt || '';

                                if (Mitem.IntraOpMedications.length > 0) {
                                    if (Mitem.IntraOpMedications.length > 0) {
                                        angular.forEach(Mitem.IntraOpMedications, function (item) {
                                            $scope.LogObj.IntraOpAnesthesiaMedications.push(item);
                                        });
                                    }

                                }

                                if (Mitem.GeneralOrders.length > 0) {
                                    angular.forEach(Mitem.GeneralOrders, function (gitem) {
                                        $scope.LogObj.IntraopAnesthesiaGeneralOrders.push(gitem);
                                    });
                                }
                            });
                        }
                        $scope.IntraOpObj.IsShowNurseSummaryViewInd = false;
                        $scope.IntraOpObj.IsShowAnesthesiaSummaryViewInd = false;
                        if ($scope.IntraOpObj.OrderDetails.length > 0) {

                            let IntraOpNurse = $filter('filter')($scope.IntraOpObj.OrderDetails, { "MedTypeId": 4 }, true) || [];
                            let IntraOpAnesthesia = $filter('filter')($scope.IntraOpObj.OrderDetails, { "MedTypeId": 3 }, true) || [];

                            if (IntraOpNurse.length > 0) {
                                let isNurseMedicationTrue = IntraOpNurse.some(order =>
                                    (order.IntraOpMedications &&
                                        order.IntraOpMedications.some(item => item.DeleteInd === 'N'))
                                );
                                if (isNurseMedicationTrue) {
                                    $scope.IntraOpObj.DisableIntraopSurgeonCheck = isNurseMedicationTrue;
                                    $scope.IntraOpObj.IsIntraOpSurgeonOrdersTimeAdded = !isNurseMedicationTrue;
                                }

                                $scope.IntraOpObj.IsShowNurseSummaryViewInd = true;
                                $scope.IsIntraOpSurgeonOrdersCheckBox = true;
                            } else {
                                $scope.IntraOpObj.IsShowNurseSummaryViewInd = false;
                                $scope.IsIntraOpSurgeonOrdersCheckBox = false;
                            };

                            if (IntraOpAnesthesia.length > 0) {
                                let isAnesthesiaMedicationTrue = IntraOpAnesthesia.some(order =>
                                    (order.IntraOpMedications &&
                                        order.IntraOpMedications.some(item => item.DeleteInd === 'N'))
                                );
                                if (isAnesthesiaMedicationTrue) {
                                    $scope.IntraOpObj.DisableIntraopAnesthesiaCheck = isAnesthesiaMedicationTrue;
                                    $scope.IntraOpObj.IsIntraOpAnesthesiaOrdersTimeAdded = !isAnesthesiaMedicationTrue;
                                }

                                $scope.IsIntraOpAnesthesiaOrdersCheckBox = true;
                                $scope.IntraOpObj.IsShowAnesthesiaSummaryViewInd = true;
                            } else {
                                $scope.IsIntraOpAnesthesiaOrdersCheckBox = false;
                                $scope.IntraOpObj.IsShowAnesthesiaSummaryViewInd = false;
                            }

                            angular.forEach($scope.IntraOpObj.OrderDetails, function (Mitem) {
                                Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                                Mitem.UserOrderId = Mitem.UserOrderId || null;
                                Mitem.UserType = Mitem.UserType || null;
                                Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                                Mitem.ReviewedByName = Mitem.ReviewedByName || '';
                                Mitem.LicenseNumber = Mitem.LicenseNumber || '';
                                Mitem.ModifiedDt = Mitem.ModifiedDt || '';

                                if (Mitem.IntraOpMedications.length > 0) {
                                    if (Mitem.IntraOpMedications.length > 0) {
                                        angular.forEach(Mitem.IntraOpMedications, function (item) {
                                            var dateTimeString = item.ModifiedDt;
                                            $scope.ModifiedPostopDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                                            angular.forEach(item.DropTimings, function (kitem) {
                                                kitem.IsEditDrop = false;
                                                kitem.IsEditview = true;
                                                kitem.shownotes = false;
                                                if (kitem.GivenBy == $scope.UserId || $scope.RoleId == 73) {
                                                    kitem.IsEditDrop = true;
                                                }
                                            });
                                        });
                                    }

                                }


                            });
                        }
                        if ($scope.IntraOpObj.OrderDetails.length > 0) {
                            var MedCount = 0;
                           var GenCount = 0;

                            angular.forEach($scope.IntraOpObj.OrderDetails, function (item) {
                                if (item.IntraOpMedications.length > 0) {
                                    MedCount++;
                                };
                                if (item.GeneralOrders.length > 0) {
                                    GenCount++;
                                };
                            });

                            if (MedCount !== 0) {
                                $scope.IsIntraopMedications = true;
                            } else {
                                $scope.IsIntraopMedications = false;
                            };
                            if (GenCount !== 0) {
                                $scope.IsIntraopGenOrders = true;
                            } else {
                                $scope.IsIntraopGenOrders = false;
                            };
                           
                        } else {
                            $scope.IntraOpObj.OrderDetails = [];

                            $scope.IsIntraopMedications = false;
                            $scope.IsIntraopGenOrders = false;
                        }

                        if ($scope.IntraOpObj.IsIntraOpSurgeonOrdersTimeAdded) {
                            $scope.IntraOpObj.IsShowNurseSummaryViewInd = true;
                        }

                        if ($scope.IntraOpObj.IsIntraOpAnesthesiaOrdersTimeAdded) {
                            $scope.IntraOpObj.IsShowAnesthesiaSummaryViewInd = true;
                        }

                        //if ($scope.IntraOpObj.IntraOpMedications.length>0) {
                        //    $scope.IntraOpObj.IsShowNurseSummaryViewInd = true;
                        //    angular.forEach($scope.IntraOpObj.IntraOpMedications, function (item) {
                        //        angular.forEach(item.DropTimings, function (kitem) {
                        //            kitem.IsEditDrop = false;
                        //            kitem.IsEditview = true;
                        //            kitem.shownotes = false;
                        //            if (kitem.GivenBy == $scope.UserId || $scope.RoleId == 73) {
                        //                kitem.IsEditDrop = true;
                        //            }
                        //        });
                        //    });
                        //}
                        //if ($scope.IntraOpObj.AnesthesiaMedications.length > 0) {
                        //    $scope.IntraOpObj.IsShowAnesthesiaSummaryViewInd = true;
                        //    angular.forEach($scope.IntraOpObj.AnesthesiaMedications, function (item) {
                        //        angular.forEach(item.DropTimings, function (kitem) {
                        //            kitem.IsEditDrop = false;
                        //            kitem.IsEditview = true;
                        //            kitem.shownotes = false;
                        //            if (kitem.GivenBy == $scope.UserId || $scope.RoleId == 73) {
                        //                kitem.IsEditDrop = true;
                        //            }
                        //        });
                        //    });
                        //}                    
                        
                    }

                    if (resp[4].data.AnesthesiaPreAdmsn.length>0) {
                        $scope.OverallObj.PreAdmsnAnesthesia = resp[4].data.AnesthesiaPreAdmsn[0].OrderDetails || [];
                        $scope.SetSurgeonCredentials($scope.OverallObj.PreAdmsnAnesthesia);
                        angular.forEach($scope.OverallObj.PreAdmsnAnesthesia, function (Mitem) {
                            Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                            Mitem.UserOrderId = Mitem.UserOrderId || null;
                            Mitem.UserType = Mitem.UserType || null;
                            Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                            Mitem.ReviewedByName = Mitem.ReviewedByName || '';
                            Mitem.ModifiedDt = Mitem.ModifiedDt || '';
                            Mitem.IsOrderReviewed = Mitem.IsOrderReviewed || false;
                            Mitem.PreAdmAnesthetistObj = angular.copy(Mitem.PrescriptionArray) || [];
                            Mitem.PrescriptionMainAddObj = getEmptyPrescriptionObj();
                            if (Mitem.PreAdmAnesthetistObj.length > 0) {
                                Mitem.PrescriptionMainAddObj.PatientPrescriptionId = Mitem.PreAdmAnesthetistObj[0].PatientPrescriptionId;
                                Mitem.PrescriptionMainAddObj.PrescriptionDetails = angular.copy(Mitem.PreAdmAnesthetistObj[0].PrescriptionDetails) || [];

                                angular.forEach(Mitem.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                                    item.StartDate = item.StartDate || null;
                                    item.StopDate = item.StopDate || null;
                                    if (item.StartDate != null) {
                                        item.StartDate = moment(item.StartDate).format("MM-DD-YYYY");
                                    }
                                    if (item.StopDate != null) {
                                        item.StopDate = moment(item.StopDate).format("MM-DD-YYYY");
                                    }
                                    item.SigObj = item.Sig;
                                });
                            }

                            if (Mitem.Investigationslist.length > 0) {
                                angular.forEach(Mitem.Investigationslist, function (item) {
                                    item.DurationDate = item.DurationDate || '';
                                    if (item.DurationDate !== '') {
                                        item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy");
                                        item.ShowDateFormat = true;
                                    } else {
                                        item.ShowDateFormat = false;
                                    }
                                    item.InvestigationNotes = item.InvestigationNotes || '';
                                    if (item.InvestigationNotes !== '') {
                                        item.IsNoteEdit = true;
                                    }
                                });
                            }
                        });
                    }
                    if (resp[4].data.PhysicianPreAdmsn.length > 0) {
                        $scope.OverallObj.PreAdmsnPhysician = resp[4].data.PhysicianPreAdmsn[0].OrderDetails || [];
                        $scope.SetSurgeonCredentials($scope.OverallObj.PreAdmsnPhysician);
                        angular.forEach($scope.OverallObj.PreAdmsnPhysician, function (Mitem) {
                            Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                            Mitem.UserOrderId = Mitem.UserOrderId || null;
                            Mitem.UserType = Mitem.UserType || null;
                            Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                            Mitem.ReviewedByName = Mitem.ReviewedByName || '';
                            Mitem.ModifiedDt = Mitem.ModifiedDt || '';
                            Mitem.IsOrderReviewed = Mitem.IsOrderReviewed || false;
                            Mitem.PreAdmAnesthetistObj = angular.copy(Mitem.PrescriptionArray) || [];
                            Mitem.PrescriptionMainAddObj = getEmptyPrescriptionObj();
                            if (Mitem.PreAdmAnesthetistObj.length > 0) {
                                Mitem.PrescriptionMainAddObj.PatientPrescriptionId = Mitem.PreAdmAnesthetistObj[0].PatientPrescriptionId;
                                Mitem.PrescriptionMainAddObj.PrescriptionDetails = angular.copy(Mitem.PreAdmAnesthetistObj[0].PrescriptionDetails) || [];

                                angular.forEach(Mitem.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                                    item.StartDate = item.StartDate || null;
                                    item.StopDate = item.StopDate || null;
                                    if (item.StartDate != null) {
                                        item.StartDate = moment(item.StartDate).format("MM-DD-YYYY");
                                    }
                                    if (item.StopDate != null) {
                                        item.StopDate = moment(item.StopDate).format("MM-DD-YYYY");
                                    }
                                    item.SigObj = item.Sig;
                                });
                            }

                            if (Mitem.Investigationslist.length > 0) {
                                angular.forEach(Mitem.Investigationslist, function (item) {
                                    item.DurationDate = item.DurationDate || '';
                                    if (item.DurationDate !== '') {
                                        item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy");
                                        item.ShowDateFormat = true;
                                    } else {
                                        item.ShowDateFormat = false;
                                    }
                                    item.InvestigationNotes = item.InvestigationNotes || '';
                                    if (item.InvestigationNotes !== '') {
                                        item.IsNoteEdit = true;
                                    }
                                });
                            }
                        });
                    }

                    $scope.LogObj.PhysicianInvestigationslist = [];
                    $scope.LogObj.PhysicianPrescriptionDetails = [];
                    $scope.LogObj.PhysicianGeneralOrders = [];
                    $scope.LogObj.AnesthesiaInvestigationslist = [];
                    $scope.LogObj.AnesthesiaPrescriptionDetails = [];
                    $scope.LogObj.AnesthesiaGeneralOrders = [];

                    if (resp[4].data.AscOrderDetails.length>0) {
                       let ASCPhysician = $filter('filter')(resp[4].data.AscOrderDetails, { "MedTypeId": 6 }, true)||[];
                        let ASCAnesthesia = $filter('filter')(resp[4].data.AscOrderDetails, { "MedTypeId": 7 }, true) || [];

                        if (ASCPhysician.length > 0) {
                            $scope.OverallObj.PreAdmsnPhysician = [];
                            $scope.PreAdmCardiologyObj = angular.copy($scope.GetPreAdmCardiologyObj());
                            $scope.PreAdmCardiologyObj.OrderDetails = ASCPhysician;
                            $scope.SetSurgeonCredentials($scope.PreAdmCardiologyObj.OrderDetails);
                            $scope.PreAdmCardiologyObj.IsShowPhysicanSummaryViewInd = true;
                            let TempPrescriptionDetails = [];
                            let TempInvestigationslist = [];
                            let TempGeneralOrders = [];

                            angular.forEach($scope.PreAdmCardiologyObj.OrderDetails, function (Mitem) {
                                Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                                Mitem.UserOrderId = Mitem.UserOrderId || null;
                                Mitem.UserType = Mitem.UserType || null;
                                Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                                Mitem.ReviewedByName = Mitem.ReviewedByName || '';
                                Mitem.ModifiedDt = Mitem.ModifiedDt || '';
                                Mitem.IsOrderReviewed = Mitem.IsOrderReviewed || false;
                                Mitem.PreAdmCardioPopupSummaryObj = angular.copy(Mitem.PrescriptionArray) || [];
                                Mitem.PrescriptionMainAddObj = getEmptyPrescriptionObj();
                                if (Mitem.PreAdmCardioPopupSummaryObj.length > 0) {
                                    Mitem.PrescriptionMainAddObj.PatientPrescriptionId = Mitem.PreAdmCardioPopupSummaryObj[0].PatientPrescriptionId;
                                    Mitem.PrescriptionMainAddObj.PrescriptionDetails = angular.copy(Mitem.PreAdmCardioPopupSummaryObj[0].PrescriptionDetails) || [];

                                    angular.forEach(Mitem.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                                        item.StartDate = item.StartDate || null;
                                        item.StopDate = item.StopDate || null;
                                        if (item.StartDate != null) {
                                            item.StartDate = moment(item.StartDate).format("MM-DD-YYYY");
                                        }
                                        if (item.StopDate != null) {
                                            item.StopDate = moment(item.StopDate).format("MM-DD-YYYY");
                                        }
                                        item.SigObj = item.Sig;
                                        TempPrescriptionDetails.push(item);
                                    });
                                    $scope.LogObj.PhysicianPrescriptionDetails = angular.copy(TempPrescriptionDetails);
                                }

                                if (Mitem.Investigationslist.length > 0) {
                                    angular.forEach(Mitem.Investigationslist, function (item) {
                                        item.DurationDate = item.DurationDate || '';
                                        if (item.DurationDate !== '') {
                                            item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy");
                                            item.ShowDateFormat = true;
                                        } else {
                                            item.ShowDateFormat = false;
                                        }
                                        item.InvestigationNotes = item.InvestigationNotes || '';
                                        if (item.InvestigationNotes !== '') {
                                            item.IsNoteEdit = true;
                                        }
                                        TempInvestigationslist.push(item);
                                    });
                                    $scope.LogObj.PhysicianInvestigationslist = angular.copy(TempInvestigationslist);
                                }

                                if (Mitem.GeneralOrders.length > 0) {
                                    angular.forEach(Mitem.GeneralOrders, function (gitem) {
                                        TempGeneralOrders.push(gitem);

                                    });
                                    $scope.LogObj.PhysicianGeneralOrders = angular.copy(TempGeneralOrders);
                                }
                            });
                        }
                        if (ASCAnesthesia.length > 0) {
                            $scope.OverallObj.PreAdmsnAnesthesia = [];
                            $scope.PreAdmAnesthetistObj = angular.copy($scope.GetPreAdmAnesthetistObj());
                            $scope.PreAdmAnesthetistObj.SubTab = $scope.SubTab || 1;
                            $scope.PreAdmAnesthetistObj.OrderDetails = ASCAnesthesia;
                            $scope.SetSurgeonCredentials($scope.PreAdmAnesthetistObj.OrderDetails);
                            $scope.PreAdmAnesthetistObj.IsShowAnesthetisSummaryViewInd = true;
                            let TempPrescriptionDetails = [];
                            let TempInvestigationslist = [];
                            let TempGeneralOrders = [];
                            angular.forEach($scope.PreAdmAnesthetistObj.OrderDetails, function (Mitem) {
                                Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                                Mitem.UserOrderId = Mitem.UserOrderId || null;
                                Mitem.UserType = Mitem.UserType || null;
                                Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                                Mitem.ReviewedByName = Mitem.ReviewedByName || '';
                                Mitem.ModifiedDt = Mitem.ModifiedDt || '';
                                Mitem.IsOrderReviewed = Mitem.IsOrderReviewed || false;
                                Mitem.PreAdmAnesthetistObj = angular.copy(Mitem.PrescriptionArray) || [];
                                Mitem.PrescriptionMainAddObj = getEmptyPrescriptionObj();
                                if (Mitem.PreAdmAnesthetistObj.length > 0) {
                                    Mitem.PrescriptionMainAddObj.PatientPrescriptionId = Mitem.PreAdmAnesthetistObj[0].PatientPrescriptionId;
                                    Mitem.PrescriptionMainAddObj.PrescriptionDetails = angular.copy(Mitem.PreAdmAnesthetistObj[0].PrescriptionDetails) || [];

                                    angular.forEach(Mitem.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                                        item.StartDate = item.StartDate || null;
                                        item.StopDate = item.StopDate || null;
                                        if (item.StartDate != null) {
                                            item.StartDate = moment(item.StartDate).format("MM-DD-YYYY");
                                        }
                                        if (item.StopDate != null) {
                                            item.StopDate = moment(item.StopDate).format("MM-DD-YYYY");
                                        }
                                        item.SigObj = item.Sig;
                                        TempPrescriptionDetails.push(item);
                                    });
                                    $scope.LogObj.AnesthesiaPrescriptionDetails = angular.copy(TempPrescriptionDetails);
                                }

                                if (Mitem.Investigationslist.length > 0) {
                                    angular.forEach(Mitem.Investigationslist, function (item) {
                                        item.DurationDate = item.DurationDate || '';
                                        if (item.DurationDate !== '') {
                                            item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy");
                                            item.ShowDateFormat = true;
                                        } else {
                                            item.ShowDateFormat = false;
                                        }
                                        item.InvestigationNotes = item.InvestigationNotes || '';
                                        if (item.InvestigationNotes !== '') {
                                            item.IsNoteEdit = true;
                                        }
                                        TempInvestigationslist.push(item);
                                    });
                                    $scope.LogObj.AnesthesiaInvestigationslist = angular.copy(TempInvestigationslist);
                                }

                                if (Mitem.GeneralOrders.length > 0) {
                                    angular.forEach(Mitem.GeneralOrders, function (gitem) {
                                        TempGeneralOrders.push(gitem);
                                    });
                                    $scope.LogObj.AnesthesiaGeneralOrders = angular.copy(TempGeneralOrders);
                                }
                            });
                        }
                       
                    }
                }
                if (resp[5].data.status === "Success") {
                    $scope.DoseArray = resp[5].data.doseArray || [];
                    $scope.DoseOtherArray = resp[5].data.doseOtherArray || [];
                    $scope.FrequencyArray = resp[5].data.frequencyArray || [];
                    $scope.RefillsArray = resp[5].data.refillsArray || [];
                    $scope.DurationArray = resp[5].data.durationArray || [];
                    $scope.ActionArray = resp[5].data.actionArray || [];
                    $scope.RouteArray = resp[5].data.routeArray || [];
                    $scope.DoseUnitArray = resp[5].data.doseUnitArray || [];
                    $scope.QuantityUnitArray = resp[5].data.quantityUnitArray || [];

                    $scope.doseArray = resp[5].data.doseArray || [];
                    $scope.doseOtherArray = resp[5].data.doseOtherArray || [];
                    $scope.frequencyArray = resp[5].data.frequencyArray || [];
                    $scope.refillsArray = resp[5].data.refillsArray || [];
                    $scope.durationArray = resp[5].data.durationArray || [];
                    $scope.actionArray = resp[5].data.actionArray || [];
                    $scope.routeArray = resp[5].data.routeArray || [];
                    $scope.doseUnitArray = resp[5].data.doseUnitArray || [];
                    $scope.quantityUnitArray = resp[5].data.quantityUnitArray || [];
                    $scope.MedicationStopReasons = resp[5].data.MedicationStopReasons || [];
                }

                $scope.AllOrdersReviewed();
            });
        }
        $scope.init();
        $scope.ChangeMedications = function (item) {
            item.DropTimings = [];
            let object = {
                "MedicationTime": "",
                "MedicationDosage": ""
            };
            item.DropTimings.push(object);
            item.IsDosageFocus = !item.IsDosageFocus;
        }
       

     $scope.SubBlockedToggle = function (mitem, item) {

         let checkedArray = mitem.IVBlockedArray.filter(x => x.IsSelected);
         if (checkedArray.length === 0) {
             mitem.SelectStatusString = "";
         } else if (checkedArray.length === mitem.IVBlockedArray.length) {
             mitem.SelectStatusString = "All";
         } else {
             mitem.SelectStatusString = "Selected";
         }
     };

     $scope.ChangeIVSite = function (val, type, item) {
         if (val == '2') {
             item.IVSiteBlocked = true;
             item.PatencyStatus = type;

         }
         else {
             item.PatencyStatus = type;
             item.IVSiteBlocked = false;

             if (item.IVBlockedArray.length > 0) {
                 angular.forEach(item.IVBlockedArray, function (mitem) {
                     mitem.IsSelected = false;
                 });
             }


         }
     }
        $scope.OnPreOpChecklistSelect = function (obj, parentobj) {
            var CheckListInd = false;
            angular.forEach(parentobj.OrganizationCheckListDetails, function (item) {
                if (obj.IsChecked == true && item.Value == obj.Value) {
                    CheckListInd = true;
                    item.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || null;
                    if (item.PatientAscCheckListDetailId != null) {
                        item.DeleteInd = "Y";
                    }
                } else {
                    item.IsChecked = false;
                }
            })

            if (CheckListInd == true) {
                obj.IsChecked = false;
                parentobj.IsChecked = false;


                if (parentobj.CheckListCategoryId === 1) {
                    $scope.PreOpObj.IsAllNurseCheckListChecked = '';
                }
                if (parentobj.CheckListCategoryId === 5) {
                    $scope.PreOpObj.IsAllMedicineCheckListChecked = '';
                }
                if (parentobj.CheckListCategoryId === 6) {
                    $scope.PreOpObj.IsAllGeneralCheckListChecked = '';
                }


            } else {
                obj.IsChecked = true;
                parentobj.IsChecked = true;
                parentobj.Value = obj.Value || '';
                parentobj.ChecklistDate = null;
            }

            if (parentobj.CheckListCategoryId === 1) {
                if (obj.Value !== "N/A" && obj.Value !== "No" && obj.Value !== "Not") {
                    parentobj.ChecklistDate = $filter('date')(new Date(), "MM-dd-yyyy");
                }
                if (obj.Value == "Yes" || obj.Value == "Reviewed" || obj.Value == "Done") {
                    $scope.PreOpObj.IsAllNurseCheckListChecked = $scope.PreOpObj.IsAllNurseCheckListChecked == 1 ? $scope.PreOpObj.IsAllNurseCheckListChecked : '';
                }
                if (obj.Value == "No" || obj.Value == "Not") {
                    $scope.PreOpObj.IsAllNurseCheckListChecked = $scope.PreOpObj.IsAllNurseCheckListChecked == 2 ? $scope.PreOpObj.IsAllNurseCheckListChecked : '';
                }
                if (obj.Value == "N/A") {
                    $scope.PreOpObj.IsAllNurseCheckListChecked = $scope.PreOpObj.IsAllNurseCheckListChecked == 3 ? $scope.PreOpObj.IsAllNurseCheckListChecked : '';
                }
            }
            if (parentobj.CheckListCategoryId === 6) {
                if (obj.Value == "Yes" || obj.Value == "Reviewed" || obj.Value == "Done") {
                    $scope.PreOpObj.IsAllGeneralCheckListChecked = $scope.PreOpObj.IsAllGeneralCheckListChecked == 1 ? $scope.PreOpObj.IsAllGeneralCheckListChecked : '';
                    parentobj.ChecklistDate = $filter('date')(new Date(), "MM-dd-yyyy");
                }
                if (obj.Value == "No" || obj.Value == "Not") {
                    $scope.PreOpObj.IsAllGeneralCheckListChecked = $scope.PreOpObj.IsAllGeneralCheckListChecked == 2 ? $scope.PreOpObj.IsAllGeneralCheckListChecked : '';
                }
                if (obj.Value == "N/A") {
                    $scope.PreOpObj.IsAllGeneralCheckListChecked = $scope.PreOpObj.IsAllGeneralCheckListChecked == 3 ? $scope.PreOpObj.IsAllGeneralCheckListChecked : '';
                }
            }
            if (parentobj.CheckListCategoryId === 5) {
                if (obj.Value == "Yes" || obj.Value == "Reviewed" || obj.Value == "Done") {
                    $scope.PreOpObj.IsAllMedicineCheckListChecked = $scope.PreOpObj.IsAllMedicineCheckListChecked == 1 ? $scope.PreOpObj.IsAllMedicineCheckListChecked : '';
                    if (parentobj.CheckListId == 40) {
                        parentobj.ChecklistDate = $filter('date')(new Date(), "MM-dd-yyyy");
                    }
                }
                if (obj.Value == "No" || obj.Value == "Not") {
                    $scope.PreOpObj.IsAllMedicineCheckListChecked = $scope.PreOpObj.IsAllMedicineCheckListChecked == 2 ? $scope.PreOpObj.IsAllMedicineCheckListChecked : '';
                }
                if (obj.Value == "N/A") {
                    $scope.PreOpObj.IsAllMedicineCheckListChecked = $scope.PreOpObj.IsAllMedicineCheckListChecked == 3 ? $scope.PreOpObj.IsAllMedicineCheckListChecked : '';
                }
            }
            if ($scope.PreOpObj.IsAllNurseCheckListChecked === '' || $scope.PreOpObj.IsAllGeneralCheckListChecked === '' || $scope.PreOpObj.IsAllMedicineCheckListChecked === '') {
                $scope.PreOpObj.IsAllCheckListChecked = '';
            }
        };
        $scope.SelectIVArm = function (val, item) {
            if (val == 1) {
                if (item.IVArm == "" || item.IVArm == "LeftArm" || item.IVArm == "RightWrist" || item.IVArm == "LeftWrist") {
                    item.IVArm = "RightArm";
                } else {
                    item.IVArm = "";

                }
            }
            if (val == 2) {
                if (item.IVArm == "" || item.IVArm == "RightArm" || item.IVArm == "RightWrist" || item.IVArm == "LeftWrist") {
                    item.IVArm = "LeftArm";
                } else {
                    item.IVArm = "";

                }
            }
            if (val == 3) {
                if (item.IVArm == "" || item.IVArm == "RightArm" || item.IVArm == "LeftArm" || item.IVArm == "LeftWrist") {
                    item.IVArm = "RightWrist";
                } else {
                    item.IVArm = "";

                }
            }
            if (val == 4) {
                if (item.IVArm == "" || item.IVArm == "RightArm" || item.IVArm == "LeftArm" || item.IVArm == "RightWrist") {
                    item.IVArm = "LeftWrist";
                } else {
                    item.IVArm = "";

                }
            }

        }

     $scope.AddPreOpDropsTime = function (obj, type) {
        
           // let templength = obj.DropTimings.length;

            let activeTimings = obj.DropTimings.filter(x => x.DeleteInd !== "Y");
            let templength = activeTimings.length;


            if (templength > 0) {
                let value = obj.DropTimings[templength - 1].MedicationTime;
                let GivenBy = obj.DropTimings[templength - 1].GivenBy;
                if (value == "") {
                    alertify.error("Please enter time!");
                    return;
                }
                GivenBy = GivenBy || null;
                if (GivenBy == null) {
                    alertify.error("Please Select GivenBy for Medications!");
                    return;
                }
            }
           
 
             




            let GivenByOpMedications = null;
            if (type == 'PostOpMedications') {
                let loggedUser = $filter('filter')($scope.MedicationGivenBy, { 'DoctorID': $scope.UserId }, true);
                if (loggedUser.length > 0) {
                    GivenByOpMedications = loggedUser[0].DoctorID;
                }
            }
            if (type == 'DilationMedications') {
                let loggedUser = $filter('filter')($scope.MedicationGivenByNurseArray, { 'DoctorID': $scope.UserId }, true) || [];
                if (loggedUser.length > 0) {
                    GivenByOpMedications = loggedUser[0].DoctorID;
                }
            }



            let object = {
                "DropTimingId": 0,
                "MedicineId": obj.MedicineId,
                "MedicationName": obj.MedicationName,
                "GivenBy": GivenByOpMedications || null,
                "shownotes": false,
                "IsEditDrop": false,
                "IsEditview": false,
                "Remarks": "",
                "MedicationTime": "",
                "DeleteInd": "N",
                "MedicationDosage": ""
            };
            obj.DropTimings.push(object);
        };
     $scope.GetPresentMedicationTime = function (Obj, parentObj) {
         //$scope.PreOpObj.DisableSurgeonordersCheck = true;
         //$scope.PreOpObj.DisableAnesthesiaOrdersCheck = true;
         //$scope.PreOpObj.IsAnesthesiaOrdersTimeChecked = false;
         //$scope.PreOpObj.IsSurgeonOrdersTimeChecked = false;
         //$scope.IntraOpObj.IsIntraOpSurgeonOrdersTimeAdded = false;
         //$scope.IntraOpObj.IsIntraOpAnesthesiaOrdersTimeAdded = false;
         //$scope.IntraOpObj.DisableIntraopAnesthesiaCheck = true;
         //$scope.IntraOpObj.DisableIntraopSurgeonCheck = true;
         //$scope.PostOpObj.IsPostOpSurgeonOrdersTimeAdded = false;
         //$scope.PostOpObj.IsPostOpAnesthesiaOrdersTimeAdded = false;
         //$scope.PostOpObj.DisablePostOpAnesthesiaCheck = true;
         //$scope.PostOpObj.DisablePostOpSurgeonCheck = true;
            Obj.MedicationTime = $filter('date')(new Date(), "hh:mm a");
            /*  if (type == 'PostOpMedications') {*/
            /* let loggedUser = $filter('filter')($scope.MedicationGivenByArray, { 'DoctorID': $scope.UserId }, true);
             if (loggedUser.length > 0) {
                 Obj.GivenBy = loggedUser[0].DoctorID;
             }*/
            // }
        };
        // Task 13 - Given By passcode handlers for medication timing rows (templates/uibpopups/DropTimingGivenBy.html).
        DropTimingGivenByService.attach($scope);

        $scope.CopyTOTropiphen = function (Ctitem) {
            angular.forEach($scope.PreOpObj.DilationMedications, function (hitem) {
                if (hitem.MedicineId == 36565) {
                    Ctitem.DropTimings = angular.copy(hitem.DropTimings);
                    /*item.iscopied = true;*/
                }
            });
        }

     
        $scope.OnClickDiabetesOrVien = function (Type, Value) {
            if (Type == 'IsVein') {
                if (Value == 'Yes') {
                    if ($scope.PreOpAndDialationMedications.IsVeinOpened == null || $scope.PreOpAndDialationMedications.IsVeinOpened == false) {
                        $scope.PreOpAndDialationMedications.IsVeinOpened = true;
                    } else {
                        $scope.PreOpAndDialationMedications.IsVeinOpened = null;
                    }
                } else {
                    if ($scope.PreOpAndDialationMedications.IsVeinOpened == null || $scope.PreOpAndDialationMedications.IsVeinOpened == true) {
                        $scope.PreOpAndDialationMedications.IsVeinOpened = false;
                    } else {
                        $scope.PreOpAndDialationMedications.IsVeinOpened = null;
                    }

                }
            }
            if (Type == 'IsDiabetes') {
                var Diabeteslength = 0;
                if ($scope.PreOpAndDialationMedications.DiabetesTimings.length > 0) {
                    angular.forEach($scope.PreOpAndDialationMedications.DiabetesTimings, function (item) {
                        item.DiabetesResult = item.DiabetesResult || '';
                        if (item.DiabetesResult != '' && item.DeleteInd == 'N') {
                            Diabeteslength++
                        }
                    });
                }
                if (Value == 'Yes') {
                    if (Diabeteslength !== 0) {
                        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete Diabetes?</h4>", function () {
                            $scope.DiabatesNO.IsHypoglycemia = null;
                            $scope.PreOpAndDialationMedications.IsHypoglycemiaCheck = false;
                            if ($scope.PreOpAndDialationMedications.DiabetesTimings.length > 0) {
                                angular.forEach($scope.PreOpAndDialationMedications.DiabetesTimings, function (item) {
                                    item.DiabetesTimingId = item.DiabetesTimingId || 0;
                                    var index = $scope.PreOpAndDialationMedications.DiabetesTimings.indexOf(item);
                                    if (item.DiabetesTimingId != 0) {
                                        if (index > -1) {
                                            item.DeleteInd = 'Y';
                                        }
                                    } else {
                                        if (index > -1) {
                                            $scope.PreOpAndDialationMedications.DiabetesTimings.splice(index, 1);
                                        }
                                    }
                                });
                            }
                            if ($scope.PreOpAndDialationMedications.IsDiabetes == null || $scope.PreOpAndDialationMedications.IsDiabetes == false) {
                                $scope.PreOpAndDialationMedications.IsDiabetes = true;
                                let object = {
                                    "DiabetesTimingId": 0,
                                    "DiabetesResult": null,
                                    "DiabetesTime": "",
                                    "DeleteInd": 'N',
                                    "DiabetesGivenBy": 0
                                };
                                $scope.PreOpAndDialationMedications.DiabetesTimings.push(object);

                            }
                            else {
                                $scope.PreOpAndDialationMedications.IsDiabetes = null;
                                $scope.PreOpAndDialationMedications.DiabetesResult = "";
                                $scope.PreOpAndDialationMedications.DiabetesTime = "";
                                if ($scope.PreOpAndDialationMedications.DiabetesTimings.length > 0) {
                                    angular.forEach($scope.PreOpAndDialationMedications.DiabetesTimings, function (item) {
                                        item.DiabetesTimingId = item.DiabetesTimingId || 0;
                                        var index = $scope.PreOpAndDialationMedications.DiabetesTimings.indexOf(item);
                                        if (item.DiabetesTimingId != 0) {
                                            if (index > -1) {
                                                item.DeleteInd = 'Y';
                                            }
                                        } else {
                                            if (index > -1) {
                                                $scope.PreOpAndDialationMedications.DiabetesTimings.splice(index, 1);
                                            }
                                        }
                                    });
                                }
                            }
                        }, function () {

                        });
                    } else {
                        $scope.PreOpAndDialationMedications.IsDiabetes = true;
                        $scope.PreOpAndDialationMedications.IsHypoglycemiaCheck = false;
                        if ($scope.PreOpAndDialationMedications.DiabetesTimings.length > 0) {
                            angular.forEach($scope.PreOpAndDialationMedications.DiabetesTimings, function (item) {
                                item.DiabetesTimingId = item.DiabetesTimingId || 0;
                                var index = $scope.PreOpAndDialationMedications.DiabetesTimings.indexOf(item);
                                if (item.DiabetesTimingId != 0) {
                                    if (index > -1) {
                                        item.DeleteInd = 'Y';
                                    }
                                } else {
                                    if (index > -1) {
                                        $scope.PreOpAndDialationMedications.DiabetesTimings.splice(index, 1);
                                    }
                                }
                            });
                        }
                        let object = {
                            "DiabetesTimingId": 0,
                            "DiabetesResult": null,
                            "DiabetesTime": "",
                            "DeleteInd": 'N',
                            "DiabetesGivenBy": 0
                        };
                        $scope.PreOpAndDialationMedications.DiabetesTimings.push(object);
                    }


                } else {
                    if (Diabeteslength !== 0) {
                        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete Diabetes?</h4>", function () {
                            if ($scope.PreOpAndDialationMedications.IsDiabetes == null || $scope.PreOpAndDialationMedications.IsDiabetes == true) {
                                $scope.PreOpAndDialationMedications.IsDiabetes = false;
                            } else {
                                $scope.PreOpAndDialationMedications.IsDiabetes = null;
                                $scope.DiabatesNO.IsHypoglycemia = null;
                                $scope.PreOpAndDialationMedications.IsHypoglycemiaCheck = false;

                            }
                            $scope.PreOpAndDialationMedications.DiabetesResult = "";
                            $scope.PreOpAndDialationMedications.DiabetesTime = "";
                            if ($scope.PreOpAndDialationMedications.DiabetesTimings.length > 0) {
                                angular.forEach($scope.PreOpAndDialationMedications.DiabetesTimings, function (item) {
                                    item.DiabetesTimingId = item.DiabetesTimingId || 0;
                                    var index = $scope.PreOpAndDialationMedications.DiabetesTimings.indexOf(item);
                                    if (item.DiabetesTimingId != 0) {
                                        if (index > -1) {
                                            item.DeleteInd = 'Y';
                                        }
                                    } else {
                                        if (index > -1) {
                                            $scope.PreOpAndDialationMedications.DiabetesTimings.splice(index, 1);
                                        }
                                    }
                                });
                            }
                        }, function () {

                        });
                    } else {
                        $scope.PreOpAndDialationMedications.IsDiabetes = false;
                        $scope.PreOpAndDialationMedications.DiabetesResult = "";
                        $scope.PreOpAndDialationMedications.DiabetesTime = "";
                    }


                }
            }
        };

        $scope.OnClickHypoglycemia = function () {
            if ($scope.PreOpAndDialationMedications.IsHypoglycemiaCheck == true) {
                $scope.DiabatesNO.IsHypoglycemia = true;
                if ($scope.PreOpAndDialationMedications.DiabetesTimings.length > 0) {
                    angular.forEach($scope.PreOpAndDialationMedications.DiabetesTimings, function (item) {
                        item.DiabetesTimingId = item.DiabetesTimingId || 0;
                        var index = $scope.PreOpAndDialationMedications.DiabetesTimings.indexOf(item);
                        if (item.DiabetesTimingId != 0) {
                            if (index > -1) {
                                item.DeleteInd = 'Y';
                            }
                        } else {
                            if (index > -1) {
                                $scope.PreOpAndDialationMedications.DiabetesTimings.splice(index, 1);
                            }
                        }
                    });
                }

                let object = {
                    "DiabetesTimingId": 0,
                    "DiabetesResult": null,
                    "DiabetesTime": "",
                    "DeleteInd": 'N',
                    "DiabetesGivenBy": 0
                };
                $scope.PreOpAndDialationMedications.DiabetesTimings.push(object);
            }


            else {
                $scope.DiabatesNO.IsHypoglycemia = false;
                if ($scope.PreOpAndDialationMedications.DiabetesTimings.length > 0) {
                    angular.forEach($scope.PreOpAndDialationMedications.DiabetesTimings, function (item) {
                        item.DiabetesTimingId = item.DiabetesTimingId || 0;
                        var index = $scope.PreOpAndDialationMedications.DiabetesTimings.indexOf(item);
                        if (item.DiabetesTimingId != 0) {
                            if (index > -1) {
                                item.DeleteInd = 'Y';
                            }
                        } else {
                            if (index > -1) {
                                $scope.PreOpAndDialationMedications.DiabetesTimings.splice(index, 1);
                            }
                        }
                    });
                }
            }
        };
        $scope.GetPresentDiabetesTime = function (obj) {
            obj.DiabetesTime = $filter('date')(new Date(), "hh:mm a");
        };
        $scope.ChangeDiabetes = function (item, obj) {
            if (item != '') {
                obj.DiabetesTime = $filter('date')(new Date(), "hh:mm a");
            } else {
                obj.DiabetesTime = '';
            }
        }

        $scope.AddDiabetesTime = function (item) {
            let templength = item.length;
            if (templength > 0) {
                let value = item[templength - 1].DiabetesTime;
                //if (value == "") {
                //    alertify.error("Please enter time!");
                //    return;
                //}
            }
            let object = {
                "DiabetesTimingId": 0,
                "DiabetesResult": null,
                "DiabetesTime": "",
                "DeleteInd": 'N',
                "DiabetesGivenBy": 0

            };
            $scope.PreOpAndDialationMedications.DiabetesTimings.push(object);

        };
        $scope.getOrgMedicines = function (text, val) {
            val = val || null;
            let req = {
                "HospitalId": $scope.HospitalId,
                "PageSize": 20,
                "SearchText": text || '',
                "PageNumber": 1,
                "UserId": $scope.UserId,
                "IsFrequent": "N",
                "MedTypeId": val,
                "ParentOrganizationId": $scope.ParenthospitalId || null
            };
            //if (req.SearchKey == "") {
            //    req.IsFrequent = "Y";
            //}
            return eHnoteConditionsDataService.GetOrganizationMedications(req).then(function (resp) {
                if (resp.data.count !== 0) {
                    if (resp.data.MedicineList !== undefined) {
                        var list1 = [];
                        angular.forEach(resp.data.MedicineList, function (item) {
                            if (item.MedTypeId == val || item.MedTypeId == null) {
                                list1.push(item);
                            }
                        });
                        return list1.map(function (item) {
                            return item;

                        });
                    }
                }
            });
        }

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

        $scope.GetOrganizationTypeOfService = function (text) {
            var Type = 'Investigation';

            var params = {
                "OrganizationId": $scope.HospitalId,
                "ProcedureId": 0,
                "PageNumber": 1,
                "PageSize": 10,
                "CPTCODE": "",  // cptcode tblorganizationprocedure
                "SearchText": text || "", // searchtext
                "TypeOfServiceId": 0,
                "Type": Type || 0,
                /*"IsFrequent": 'N'*/
                "IsFrequent": 'N',
                "ParentOrganizationId": $scope.ParenthospitalId || null
            };

            if (params.SearchText == "") {
                params.IsFrequent = "Y";
            }

            return eHnoteSettingsDataService.GetOrganizationProceduresByType(params).then(function (resp) {
                if (resp.data.rows !== undefined) {
                    return resp.data.rows.map(function (item) {
                        return item;
                    });
                }
            });
        };
     
      
        $scope.ChangeSubTab = function (SubTabType) {
            //change the tab
            $scope.PreOpAndDialationMedications.SubTabType = SubTabType;
        }
        $scope.SelectDialtionMedicationItems = function (item, type) {

            /*let List = $filter("filter")($scope.PreOpObj.DilationMedications, { "OrganizationMedicationId": item.OrganizationPrescriptionId }, true);*/
            let List1 = $filter("filter")($scope.PreOpAndDialationMedications.DilationMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
            let List = $filter("filter")(List1, { 'DeleteInd': 'N' }, true);
            if (List.length > 0) {
                alertify.error("Medicine name already added!");
                $scope.DilationMedicationObj.MedicineObject = '';
                return false;
            }

            let DilationGivenBy = null;
            let loggedUser = $filter('filter')($scope.MedicationGivenByArray, { 'DoctorID': $scope.UserId }, true);
            if (loggedUser.length > 0) {
                DilationGivenBy = loggedUser[0].DoctorID;
            }


            if (type == 'Frequently') {
                var obj = {
                    "AscMedicationId": 0,
                    "OrganizationMedicationId": item.OrganizationPrescriptionId,
                    "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                    "ParentOrganizationId": $scope.ParenthospitalId,
                    "ASCOrganizationMedicationId": 0,
                    "MedicineId": item.MedicineId,
                    "MedicationName": item.MedicationName,
                    "IsChecked": false,
                    "IsDilationMed": false,
                    "IsIntraAnesthesiaMed": false,
                    "IsIntraMed": false,
                    "IsPreOPMed": false,
                    "MedicationDosage": "",
                    "DropTimings": [{
                        "DropTimingId": 0,
                        "MedicineId": item.MedicineId,
                        "MedicationName": item.MedicationName,
                        "GivenBy": DilationGivenBy || null,
                        "shownotes": false,
                        "IsEditDrop": false,
                        "IsEditview": false,
                        "Remarks": "",
                        "DeleteInd": "N",
                        "MedicationTime": "",
                        "MedicationDosage": ""
                    }],
                    "TypeId": 2,
                    "DeleteInd": "N"
                }
                $scope.PreOpAndDialationMedications.DilationMedications.push(obj);
                $scope.DilationMedicationObj.MedicineObject = "";
            } else {
                var obj = {
                    "AscMedicationId": 0,
                    "OrganizationMedicationId": item.OrganizationPrescriptionId,
                    "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                    "ParentOrganizationId": $scope.ParenthospitalId,
                    "ASCOrganizationMedicationId": 0,
                    "MedicineId": item.MedicineId,
                    "MedicationName": item.MedicineName,
                    "IsChecked": false,
                    "IsDilationMed": false,
                    "IsIntraAnesthesiaMed": false,
                    "IsIntraMed": false,
                    "IsPreOPMed": false,
                    "MedicationDosage": "",
                    "DropTimings": [{
                        "DropTimingId": 0,
                        "MedicineId": item.MedicineId,
                        "MedicationName": item.MedicineName,
                        "GivenBy": DilationGivenBy || null,
                        "shownotes": false,
                        "IsEditDrop": false,
                        "IsEditview": false,
                        "Remarks": "",
                        "DeleteInd": "N",
                        "MedicationTime": "",
                        "MedicationDosage": ""
                    }],
                    "TypeId": 2,
                    "DeleteInd": "N"
                }
                $scope.PreOpAndDialationMedications.DilationMedications.push(obj);
                $scope.DilationMedicationObj.MedicineObject = "";
            }


        }
        $scope.SelectMedicationItems = function (item, type) {

            /*let List = $filter("filter")($scope.PreOpObj.PreOpMedications, { "OrganizationMedicationId": item.OrganizationPrescriptionId }, true);*/
            let List1 = $filter("filter")($scope.PreOpAndDialationMedications.PreOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
            let List = $filter("filter")(List1, { 'DeleteInd': 'N' }, true);
            if (List.length > 0) {
                alertify.error("Medicine name already added!");
                $scope.PreOpMedicationObj.MedicineObject = "";
                return false;
            }

            let MedicationGivenBy = null;
            let loggedUser = $filter('filter')($scope.MedicationGivenByArray, { 'DoctorID': $scope.UserId }, true);
            if (loggedUser.length > 0) {
                MedicationGivenBy = loggedUser[0].DoctorID;
            }

            if (type == 'Frequently') {
                var obj = {
                    "AscMedicationId": 0,
                    "OrganizationMedicationId": item.OrganizationPrescriptionId,
                    "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                    "ParentOrganizationId": $scope.ParenthospitalId,
                    "ASCOrganizationMedicationId": 0,
                    "MedicineId": item.MedicineId,
                    "MedicationName": item.MedicationName,
                    "IsChecked": false,
                    "IsDilationMed": false,
                    "IsIntraAnesthesiaMed": false,
                    "IsIntraMed": false,
                    "IsPreOPMed": true,
                    "MedicationDosage": "",
                    "DropTimings": [{
                        "DropTimingId": 0,
                        "MedicineId": item.MedicineId,
                        "MedicationName": item.MedicationName,
                        "GivenBy": MedicationGivenBy || null,
                        "shownotes": false,
                        "IsEditDrop": false,
                        "IsEditview": false,
                        "Remarks": "",
                        "DeleteInd": "N",
                        "MedicationTime": "",
                        "MedicationDosage": ""
                    }],
                    "TypeId": 1,
                    "DeleteInd": "N"
                }
                $scope.PreOpAndDialationMedications.PreOpMedications.push(obj);
                $scope.PreOpMedicationObj.MedicineObject = "";
            } else {
                var obj = {
                    "AscMedicationId": 0,
                    "OrganizationMedicationId": item.OrganizationPrescriptionId,
                    "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                    "ParentOrganizationId": $scope.ParenthospitalId,
                    "ASCOrganizationMedicationId": 0,
                    "MedicineId": item.MedicineId,
                    "MedicationName": item.MedicineName,
                    "IsChecked": false,
                    "IsDilationMed": false,
                    "IsIntraAnesthesiaMed": false,
                    "IsIntraMed": false,
                    "IsPreOPMed": true,
                    "MedicationDosage": "",
                    "DropTimings": [{
                        "DropTimingId": 0,
                        "MedicineId": item.MedicineId,
                        "MedicationName": item.MedicineName,
                        "GivenBy": MedicationGivenBy || null,
                        "shownotes": false,
                        "IsEditDrop": false,
                        "IsEditview": false,
                        "Remarks": "",
                        "DeleteInd": "N",
                        "MedicationTime": "",
                        "MedicationDosage": ""
                    }],
                    "TypeId": 1,
                    "DeleteInd": "N"
                }
                $scope.PreOpAndDialationMedications.PreOpMedications.push(obj);
                $scope.PreOpMedicationObj.MedicineObject = "";
            }


        }
     $scope.ComparePreOpMediGeneralOrders = function (savedArray) {
         angular.forEach(savedArray, function (item) {
             // Find matching item from previous saved GeneralOrders (based on some ID or unique name)
             let existingItem = $scope.LogObj.PreOpMediGeneralOrders.find(e => e.GeneralOrderId == item.GeneralOrderId);

             // Case 1: Deleted
             if (item.DeleteInd === 'Y') {
                 let oldDesc =
                     (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                     (item.Status ? `Status: ${item.Status}\n` : '') +
                     (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');
                 let givenById = item.GivenBy || '';
                 let givenByUser = '';
                 if (givenById) {
                     let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                     if (user) givenByUser = user.FullName;
                 }

                 if (item.Status == 'Done' && givenByUser) {
                     oldDesc += `by @ ${givenByUser}`;
                 }
                 let obj = {
                     LogId: 0,
                     ModuleId: 2,
                     ModuleName: "ASC",
                     SubModuleId: 40,
                     SubModuleName: "All Orders",
                     ScreenType: "PreOp Anesthesia Orders",
                     ActionType: "Deleted",
                     OldActionDescription: "",
                     NewActionDescription: oldDesc.trim(),
                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                 }
                 $scope.LogObj.LogArray.push(obj);
             }

             // Case 2: Edited (field-by-field comparison)
             else if (existingItem) {
                 let oldDesc = "";
                 let newDesc = "";

                 if ((existingItem.Status || "") !== (item.Status || "") || (existingItem.MedicationTime || "") !== (item.MedicationTime || "")) {
                     if (existingItem.MedicineName) {
                         oldDesc += `Custom Order: ${existingItem.MedicineName}\n`;
                     }
                     if (item.MedicineName) {
                         newDesc += `Custom Order: ${item.MedicineName}\n`;
                     }
                 }
                 if ((existingItem.Status || "") !== (item.Status || "")) {
                     if (existingItem.Status) {
                         oldDesc += `Status: ${existingItem.Status}\n`;
                     }
                     if (item.Status) {
                         newDesc += `Status: ${item.Status}\n`;
                     }
                 }
                 if ((existingItem.MedicationTime || "") !== (item.MedicationTime || "")) {
                     if (existingItem.MedicationTime) {
                         oldDesc += `MedicationTime: ${existingItem.MedicationTime}\n`;
                     }
                     if (item.MedicationTime) {
                         newDesc += `MedicationTime: ${item.MedicationTime}\n`;
                     }
                 }
                 let oldGivenByUser = '';
                 let newGivenByUser = '';

                 if (existingItem.GivenBy) {
                     let user = $scope.allUserList.find(u => u.DoctorID == existingItem.GivenBy);
                     if (user) oldGivenByUser = user.FullName;
                 }

                 if (item.GivenBy) {
                     let user = $scope.allUserList.find(u => u.DoctorID == item.GivenBy);
                     if (user) newGivenByUser = user.FullName;
                 }

                 if ((existingItem.GivenBy || "") !== (item.GivenBy || "")) {
                     if (oldGivenByUser) {
                         oldDesc += `by @ ${oldGivenByUser}\n`;
                     }
                     if (newGivenByUser) {
                         newDesc += `by @ ${newGivenByUser}\n`;
                     }
                 }

                 if (oldDesc || newDesc) {
                     let obj = {
                         LogId: 0,
                         ModuleId: 2,
                         ModuleName: "ASC",
                         SubModuleId: 40,
                         SubModuleName: "All Orders",
                         ScreenType: "PreOp Anesthesia Orders",
                         ActionType: "Edited",
                         OldActionDescription: oldDesc.trim(),
                         NewActionDescription: newDesc.trim(),
                         ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                     }
                     $scope.LogObj.LogArray.push(obj);
                 }
             }

             // Case 3: Added
             else {
                 let newDesc =
                     (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                     (item.Status ? `Status: ${item.Status}\n` : '') +
                     (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');

                 let givenById = item.GivenBy || '';
                 let givenByUser = '';
                 if (givenById) {
                     let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                     if (user) givenByUser = user.FullName;
                 }

                 if (item.Status == 'Done' && givenByUser) {
                     newDesc += `by @ ${givenByUser}`;
                 }
                 let obj = {
                     LogId: 0,
                     ModuleId: 2,
                     ModuleName: "ASC",
                     SubModuleId: 40,
                     SubModuleName: "All Orders",
                     ScreenType: "PreOp Anesthesia Orders",
                     ActionType: "Added",
                     OldActionDescription: "",
                     NewActionDescription: newDesc.trim(),
                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                 }
                 $scope.LogObj.LogArray.push(obj);
             }
         });
     }
     $scope.CompareGeneralOrders = function (savedArray) {
         angular.forEach(savedArray, function (item) {
             // Find matching item from previous saved GeneralOrders (based on some ID or unique name)
             let existingItem = $scope.LogObj.GeneralOrders.find(e => e.GeneralOrderId == item.GeneralOrderId);

             // Case 1: Deleted
             if (item.DeleteInd === 'Y') {
                 let oldDesc =
                     (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                     (item.Status ? `Status: ${item.Status}\n` : '') +
                     (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');
                 let givenById = item.GivenBy || '';
                 let givenByUser = '';
                 if (givenById) {
                     let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                     if (user) givenByUser = user.FullName;
                 }

                 if (item.Status == 'Done' && givenByUser) {
                     oldDesc += `by @ ${givenByUser}`;
                 }

                 let obj = {
                     LogId: 0,
                     ModuleId: 2,
                     ModuleName: "ASC",
                     SubModuleId: 40,
                     SubModuleName: "All Orders",
                     ScreenType: "PreOp Surgeon Orders",
                     ActionType: "Deleted",
                     OldActionDescription:"", 
                     NewActionDescription: oldDesc.trim(),
                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                 }
                 $scope.LogObj.LogArray.push(obj);
             }

             // Case 2: Edited (field-by-field comparison)
             else if (existingItem) {
                 let oldDesc = "";
                 let newDesc = "";

                 if ((existingItem.Status || "") !== (item.Status || "") || (existingItem.MedicationTime || "") !== (item.MedicationTime || "")) {
                     if (existingItem.MedicineName) {
                         oldDesc += `Custom Order: ${existingItem.MedicineName}\n`;
                     }
                     if (item.MedicineName) {
                         newDesc += `Custom Order: ${item.MedicineName}\n`;
                     }
                 }
                 if ((existingItem.Status || "") !== (item.Status || "")) {
                     if (existingItem.Status) {
                         oldDesc += `Status: ${existingItem.Status}\n`;
                     }
                     if (item.Status) {
                         newDesc += `Status: ${item.Status}\n`;
                     }
                 }
                 if ((existingItem.MedicationTime || "") !== (item.MedicationTime || "")) {
                     if (existingItem.MedicationTime) {
                         oldDesc += `MedicationTime: ${existingItem.MedicationTime}\n`;
                     }
                     if (item.MedicationTime) {
                         newDesc += `MedicationTime: ${item.MedicationTime}\n`;
                     }
                 }
                 let oldGivenByUser = '';
                 let newGivenByUser = '';

                 if (existingItem.GivenBy) {
                     let user = $scope.allUserList.find(u => u.DoctorID == existingItem.GivenBy);
                     if (user) oldGivenByUser = user.FullName;
                 }

                 if (item.GivenBy) {
                     let user = $scope.allUserList.find(u => u.DoctorID == item.GivenBy);
                     if (user) newGivenByUser = user.FullName;
                 }

                 if ((existingItem.GivenBy || "") !== (item.GivenBy || "")) {
                     if (oldGivenByUser) {
                         oldDesc += `by @ ${oldGivenByUser}\n`;
                     }
                     if (newGivenByUser) {
                         newDesc += `by @ ${newGivenByUser}\n`;
                     }
                 }

                 if (oldDesc || newDesc) {
                     let obj = {
                         LogId: 0,
                         ModuleId: 2,
                         ModuleName: "ASC",
                         SubModuleId: 40,
                         SubModuleName: "All Orders",
                         ScreenType: "PreOp Surgeon Orders",
                         ActionType: "Edited",
                         OldActionDescription: oldDesc.trim(),
                         NewActionDescription: newDesc.trim(),
                         ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                     }
                     $scope.LogObj.LogArray.push(obj);
                 }
             }

             // Case 3: Added
             else {
                 let newDesc =
                     (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                     (item.Status ? `Status: ${item.Status}\n` : '') +
                     (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');
                 let givenById = item.GivenBy || '';
                 let givenByUser = '';
                 if (givenById) {
                     let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                     if (user) givenByUser = user.FullName;
                 }

                 if (item.Status == 'Done' && givenByUser) {
                     newDesc += `by @ ${givenByUser}`;
                 }

                 let obj = {
                     LogId: 0,
                     ModuleId: 2,
                     ModuleName: "ASC",
                     SubModuleId: 40,
                     SubModuleName: "All Orders",
                     ScreenType: "PreOp Surgeon Orders",
                     ActionType: "Added",
                     OldActionDescription: "",
                     NewActionDescription: newDesc.trim(),
                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                 }
                 $scope.LogObj.LogArray.push(obj);
             }
         });
     };

     $scope.ComparePreOpMedications = function (savedArray) {
         angular.forEach(savedArray, function (item) {
             // Case 1: Deleted
             if (item.DeleteInd === 'Y') {
                 let description = buildDescription(item, true);
                 let obj = {
                     LogId: 0,
                     ModuleId: 2,
                     ModuleName: "ASC",
                     SubModuleId: 40,
                     SubModuleName: "All Orders",
                     ScreenType: "PreOp Anesthesia Orders",
                     ActionType: "Deleted",
                     OldActionDescription: '',
                     NewActionDescription: description,
                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                 }
                 $scope.LogObj.LogArray.push(obj);
             }

             // Case 2: Added / Edited
             else {
                 let edited = $scope.LogObj.PreOpMedications.filter(eitem =>
                     eitem.OrganizationPrescriptionId == item.OrganizationPrescriptionId
                 );

                 // Newly Added
                 if (edited.length === 0) {
                     let description = buildDescription(item, true);
                     let obj = {
                         LogId: 0,
                         ModuleId: 2,
                         ModuleName: "ASC",
                         SubModuleId: 40,
                         SubModuleName: "All Orders",
                         ScreenType: "PreOp Anesthesia Orders",
                         ActionType: "Added",
                         OldActionDescription: "",
                         NewActionDescription: description,
                         ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                     }
                     $scope.LogObj.LogArray.push(obj);
                 }

                 // Edited
                 else {
                     edited.forEach(function (editedItem) {
                         if (editedItem.OrganizationPrescriptionId == item.OrganizationPrescriptionId) {

                             let actiontype = 'Edited';

                             if (editedItem.DropTimings.length == 0 && item.DropTimings.length>0) {
                                 actiontype = 'Added';
                             }
                             // Check if DropTimings changed
                             let dropTimingsEdited = editedItem.DropTimings.filter(editem =>
                                 !item.DropTimings.some(ditem =>
                                     ditem.GivenBy == editem.GivenBy &&
                                     ditem.Remarks == editem.Remarks &&
                                     ditem.MedicationDosage == editem.MedicationDosage &&
                                     ditem.MedicationTime == editem.MedicationTime
                                 )
                             );

                             let isFieldEdited =
                                 (editedItem.Action !== item.Action) ||
                                 (editedItem.Dose !== item.Dose) ||
                                 (editedItem.DoseUnit !== item.DoseUnit) ||
                                 (editedItem.Route !== item.Route) ||
                                 (editedItem.Frequency !== item.Frequency) ||
                                 (editedItem.maxDose !== item.maxDose) ||
                                 (editedItem.MedicationNotes !== item.MedicationNotes) ||
                                 (item.DropTimings.length !== editedItem.DropTimings.length);

                             if (dropTimingsEdited.length > 0 || isFieldEdited) {
                                 let oldDescription = buildDescription(editedItem, true);
                                 let newDescription = buildDescription(item, true);

                                 let obj = {
                                     LogId: 0,
                                     ModuleId: 2,
                                     ModuleName: "ASC",
                                     SubModuleId: 40,
                                     SubModuleName: "All Orders",
                                     ScreenType: "PreOp Anesthesia Orders",
                                     ActionType: actiontype,
                                     OldActionDescription: oldDescription,
                                     NewActionDescription: newDescription,
                                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                 }
                                 $scope.LogObj.LogArray.push(obj);
                             }
                         }
                     });
                 }
             }
         });
     }
     $scope.CompareDilationMedications = function (savedArray) {
         angular.forEach(savedArray, function (item) {
             // Case 1: Deleted
             if (item.DeleteInd === 'Y') {
                 let description = buildDescription(item, true);
                 let obj = {
                     LogId: 0,
                     ModuleId: 2,
                     ModuleName: "ASC",
                     SubModuleId: 40,
                     SubModuleName: "All Orders",
                     ScreenType: "PreOp Surgeon Orders",
                     ActionType: "Deleted",
                     OldActionDescription: '',
                     NewActionDescription: description,
                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                 }
                 $scope.LogObj.LogArray.push(obj);
             }

             // Case 2: Added / Edited
             else {
                 let edited = $scope.LogObj.DilationMedications.filter(eitem =>
                     eitem.OrganizationPrescriptionId == item.OrganizationPrescriptionId
                 );

                 // Newly Added
                 if (edited.length === 0) {
                     let description = buildDescription(item, true);
                     let obj = {
                         LogId: 0,
                         ModuleId: 2,
                         ModuleName: "ASC",
                         SubModuleId: 40,
                         SubModuleName: "All Orders",
                         ScreenType: "PreOp Surgeon Orders",
                         ActionType: "Added",
                         OldActionDescription: "",
                         NewActionDescription: description,
                         ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                     }
                     $scope.LogObj.LogArray.push(obj);
                 }

                 // Edited
                 else {
                     edited.forEach(function (editedItem) {
                         if (editedItem.OrganizationPrescriptionId == item.OrganizationPrescriptionId) {

                             let actiontype = 'Edited';

                             if (editedItem.DropTimings.length == 0 && item.DropTimings.length > 0) {
                                 actiontype = 'Added';
                             }
                             // Check if DropTimings changed
                             let dropTimingsEdited = editedItem.DropTimings.filter(editem =>
                                 !item.DropTimings.some(ditem =>
                                     ditem.GivenBy == editem.GivenBy &&
                                     ditem.Remarks == editem.Remarks &&
                                     ditem.MedicationDosage == editem.MedicationDosage &&
                                     ditem.MedicationTime == editem.MedicationTime
                                 )
                             );

                             let isFieldEdited =
                                 (editedItem.Action !== item.Action) ||
                                 (editedItem.Dose !== item.Dose) ||
                                 (editedItem.DoseUnit !== item.DoseUnit) ||
                                 (editedItem.Route !== item.Route) ||
                                 (editedItem.Frequency !== item.Frequency) ||
                                 (editedItem.maxDose !== item.maxDose) ||
                                 (editedItem.MedicationNotes !== item.MedicationNotes) ||
                                 (item.DropTimings.length !== editedItem.DropTimings.length);

                             if (dropTimingsEdited.length > 0 || isFieldEdited) {
                                 let oldDescription = buildDescription(editedItem, true);
                                 let newDescription = buildDescription(item, true);

                                 let obj = {
                                     LogId: 0,
                                     ModuleId: 2,
                                     ModuleName: "ASC",
                                     SubModuleId: 40,
                                     SubModuleName: "All Orders",
                                     ScreenType: "PreOp Surgeon Orders",
                                     ActionType: actiontype,
                                     OldActionDescription: oldDescription,
                                     NewActionDescription: newDescription,
                                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                 }
                                 $scope.LogObj.LogArray.push(obj);
                             }
                         }
                     });
                 }
             }
         });
     };


     function buildDescription(item, includeTimings = true) {
         let timingDescriptions = includeTimings ? buildTimingDescriptions(item.DropTimings) : [];
         return [
             item.OrderDescription || '',
             item.MedicationNotes ? `Notes: ${item.MedicationNotes}` : '',
             timingDescriptions.length > 0 ? timingDescriptions.join(', ') : ''
         ].filter(Boolean).join('\n');
     }

     function buildTimingDescriptions(dropTimings) {
         if (!dropTimings || dropTimings.length === 0) return [];
         return dropTimings.map(dt => {
             let medicationTime = dt.MedicationTime || '';
             let givenById = dt.GivenBy || '';
             let medicationDosage = dt.MedicationDosage || '';
             let Remarks = dt.Remarks || '';

             let givenByUser = '';
             if (givenById) {
                 let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                 if (user) givenByUser = user.FullName;
             }
             let Notes = '';
             if (Remarks) {
                 Notes = 'Notes: '+Remarks;
             }

             return `${medicationDosage} at ${medicationTime} by @ ${givenByUser} ${Notes}`;
         });
     }

     $scope.CompareIntraOpMedications = function (savedArray) {
         angular.forEach(savedArray, function (item) {
             // Case 1: Deleted
             if (item.DeleteInd === 'Y') {
                 let description = buildDescription(item, true);
                 let obj = {
                     LogId: 0,
                     ModuleId: 2,
                     ModuleName: "ASC",
                     SubModuleId: 40,
                     SubModuleName: "All Orders",
                     ScreenType: "IntraOp Consumables",
                     ActionType: "Deleted",
                     OldActionDescription: '',
                     NewActionDescription: description,
                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                 }
                 $scope.LogObj.LogArray.push(obj);
             }

             // Case 2: Added / Edited
             else {
                 let edited = $scope.LogObj.IntraOpMedications.filter(eitem =>
                     eitem.OrganizationPrescriptionId == item.OrganizationPrescriptionId
                 );

                 // Newly Added
                 if (edited.length === 0) {
                     let description = buildDescription(item, true);
                     let obj = {
                         LogId: 0,
                         ModuleId: 2,
                         ModuleName: "ASC",
                         SubModuleId: 40,
                         SubModuleName: "All Orders",
                         ScreenType: "IntraOp Consumables",
                         ActionType: "Added",
                         OldActionDescription: "",
                         NewActionDescription: description,
                         ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                     }
                     $scope.LogObj.LogArray.push(obj);
                 }

                 // Edited
                 else {
                     edited.forEach(function (editedItem) {
                         if (editedItem.OrganizationPrescriptionId == item.OrganizationPrescriptionId) {

                             let actiontype = 'Edited';
                             item.DropTimings = item.DropTimings || [];
                             editedItem.DropTimings = editedItem.DropTimings || [];
                             if (editedItem.DropTimings.length == 0 && item.DropTimings.length > 0) {
                                 actiontype = 'Added';
                             }
                             // Check if DropTimings changed
                             let dropTimingsEdited = editedItem.DropTimings.filter(editem =>
                                 !item.DropTimings.some(ditem =>
                                     ditem.GivenBy == editem.GivenBy &&
                                     ditem.Remarks == editem.Remarks &&
                                     ditem.MedicationDosage == editem.MedicationDosage &&
                                     ditem.MedicationTime == editem.MedicationTime
                                 )
                             );

                             let isFieldEdited =
                                 (editedItem.Action !== item.Action) ||
                                 (editedItem.Dose !== item.Dose) ||
                                 (editedItem.DoseUnit !== item.DoseUnit) ||
                                 (editedItem.Route !== item.Route) ||
                                 (editedItem.Frequency !== item.Frequency) ||
                                 (editedItem.maxDose !== item.maxDose) ||
                                 (editedItem.MedicationNotes !== item.MedicationNotes) ||
                                 (item.DropTimings.length !== editedItem.DropTimings.length);

                             if (dropTimingsEdited.length > 0 || isFieldEdited) {
                                 let oldDescription = buildDescription(editedItem, true);
                                 let newDescription = buildDescription(item, true);

                                 let obj = {
                                     LogId: 0,
                                     ModuleId: 2,
                                     ModuleName: "ASC",
                                     SubModuleId: 40,
                                     SubModuleName: "All Orders",
                                     ScreenType: "IntraOp Consumables",
                                     ActionType: actiontype,
                                     OldActionDescription: oldDescription,
                                     NewActionDescription: newDescription,
                                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                 }
                                 $scope.LogObj.LogArray.push(obj);
                             }
                         }
                     });
                 }
             }
         });
     };


     $scope.CompareIntraOpGeneralOrders = function (savedArray) {
         angular.forEach(savedArray, function (item) {
             // Find matching item from previous saved GeneralOrders (based on some ID or unique name)
             let existingItem = $scope.LogObj.IntraopGeneralOrders.find(e => e.GeneralOrderId == item.GeneralOrderId);

             // Case 1: Deleted
             if (item.DeleteInd === 'Y') {
                 let oldDesc =
                     (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                     (item.Status ? `Status: ${item.Status}\n` : '') +
                     (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');
                 let givenById = item.GivenBy || '';
                 let givenByUser = '';
                 if (givenById) {
                     let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                     if (user) givenByUser = user.FullName;
                 }

                 if (item.Status == 'Done' && givenByUser) {
                     oldDesc += `by @ ${givenByUser}`;
                 }

                 let obj = {
                     LogId: 0,
                     ModuleId: 2,
                     ModuleName: "ASC",
                     SubModuleId: 40,
                     SubModuleName: "All Orders",
                     ScreenType: "IntraOp Consumables",
                     ActionType: "Deleted",
                     OldActionDescription: "",
                     NewActionDescription: oldDesc.trim(),
                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                 }
                 $scope.LogObj.LogArray.push(obj);
             }

             // Case 2: Edited (field-by-field comparison)
             else if (existingItem) {
                 let oldDesc = "";
                 let newDesc = "";

                 if ((existingItem.Status || "") !== (item.Status || "") || (existingItem.MedicationTime || "") !== (item.MedicationTime || "")) {
                     if (existingItem.MedicineName) {
                         oldDesc += `Custom Order: ${existingItem.MedicineName}\n`;
                     }
                     if (item.MedicineName) {
                         newDesc += `Custom Order: ${item.MedicineName}\n`;
                     }
                 }
                 if ((existingItem.Status || "") !== (item.Status || "")) {
                     if (existingItem.Status) {
                         oldDesc += `Status: ${existingItem.Status}\n`;
                     }
                     if (item.Status) {
                         newDesc += `Status: ${item.Status}\n`;
                     }
                 }
                 if ((existingItem.MedicationTime || "") !== (item.MedicationTime || "")) {
                     if (existingItem.MedicationTime) {
                         oldDesc += `MedicationTime: ${existingItem.MedicationTime}\n`;
                     }
                     if (item.MedicationTime) {
                         newDesc += `MedicationTime: ${item.MedicationTime}\n`;
                     }
                 }
                 let oldGivenByUser = '';
                 let newGivenByUser = '';

                 if (existingItem.GivenBy) {
                     let user = $scope.allUserList.find(u => u.DoctorID == existingItem.GivenBy);
                     if (user) oldGivenByUser = user.FullName;
                 }

                 if (item.GivenBy) {
                     let user = $scope.allUserList.find(u => u.DoctorID == item.GivenBy);
                     if (user) newGivenByUser = user.FullName;
                 }

                 if ((existingItem.GivenBy || "") !== (item.GivenBy || "")) {
                     if (oldGivenByUser) {
                         oldDesc += `by @ ${oldGivenByUser}\n`;
                     }
                     if (newGivenByUser) {
                         newDesc += `by @ ${newGivenByUser}\n`;
                     }
                 }

                 if (oldDesc || newDesc) {
                     let obj = {
                         LogId: 0,
                         ModuleId: 2,
                         ModuleName: "ASC",
                         SubModuleId: 40,
                         SubModuleName: "All Orders",
                         ScreenType: "IntraOp Consumables",
                         ActionType: "Edited",
                         OldActionDescription: oldDesc.trim(),
                         NewActionDescription: newDesc.trim(),
                         ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                     }
                     $scope.LogObj.LogArray.push(obj);
                 }
             }

             // Case 3: Added
             else {
                 let newDesc =
                     (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                     (item.Status ? `Status: ${item.Status}\n` : '') +
                     (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');
                 let givenById = item.GivenBy || '';
                 let givenByUser = '';
                 if (givenById) {
                     let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                     if (user) givenByUser = user.FullName;
                 }

                 if (item.Status == 'Done' && givenByUser) {
                     newDesc += `by @ ${givenByUser}`;
                 }
                 let obj = {
                     LogId: 0,
                     ModuleId: 2,
                     ModuleName: "ASC",
                     SubModuleId: 40,
                     SubModuleName: "All Orders",
                     ScreenType: "IntraOp Consumables",
                     ActionType: "Added",
                     OldActionDescription: "",
                     NewActionDescription: newDesc.trim(),
                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                 }
                 $scope.LogObj.LogArray.push(obj);
             }
         });
     };


     $scope.CompareIntraOpAnesthesiaMedications = function (savedArray) {
         angular.forEach(savedArray, function (item) {
             // Case 1: Deleted
             if (item.DeleteInd === 'Y') {
                 let description = buildDescription(item, true);
                 let obj = {
                     LogId: 0,
                     ModuleId: 2,
                     ModuleName: "ASC",
                     SubModuleId: 40,
                     SubModuleName: "All Orders",
                     ScreenType: "IntraOp Anesthesia Medications",
                     ActionType: "Deleted",
                     OldActionDescription: '',
                     NewActionDescription: description,
                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                 }
                 $scope.LogObj.LogArray.push(obj);
             }

             // Case 2: Added / Edited
             else {
                 let edited = $scope.LogObj.IntraOpAnesthesiaMedications.filter(eitem =>
                     eitem.OrganizationPrescriptionId == item.OrganizationPrescriptionId
                 );

                 // Newly Added
                 if (edited.length === 0) {
                     let description = buildDescription(item, true);
                     let obj = {
                         LogId: 0,
                         ModuleId: 2,
                         ModuleName: "ASC",
                         SubModuleId: 40,
                         SubModuleName: "All Orders",
                         ScreenType: "IntraOp Anesthesia Medications",
                         ActionType: "Added",
                         OldActionDescription: "",
                         NewActionDescription: description,
                         ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                     }
                     $scope.LogObj.LogArray.push(obj);
                 }

                 // Edited
                 else {
                     edited.forEach(function (editedItem) {
                         if (editedItem.OrganizationPrescriptionId == item.OrganizationPrescriptionId) {

                             let actiontype = 'Edited';
                             item.DropTimings = item.DropTimings || [];
                             editedItem.DropTimings = editedItem.DropTimings || [];
                             if (editedItem.DropTimings.length == 0 && item.DropTimings.length > 0) {
                                 actiontype = 'Added';
                             }
                             // Check if DropTimings changed
                             let dropTimingsEdited = editedItem.DropTimings.filter(editem =>
                                 !item.DropTimings.some(ditem =>
                                     ditem.GivenBy == editem.GivenBy &&
                                     ditem.Remarks == editem.Remarks &&
                                     ditem.MedicationDosage == editem.MedicationDosage &&
                                     ditem.MedicationTime == editem.MedicationTime
                                 )
                             );

                             let isFieldEdited =
                                 (editedItem.Action !== item.Action) ||
                                 (editedItem.Dose !== item.Dose) ||
                                 (editedItem.DoseUnit !== item.DoseUnit) ||
                                 (editedItem.Route !== item.Route) ||
                                 (editedItem.Frequency !== item.Frequency) ||
                                 (editedItem.maxDose !== item.maxDose) ||
                                 (editedItem.MedicationNotes !== item.MedicationNotes) ||
                                 (item.DropTimings.length !== editedItem.DropTimings.length);

                             if (dropTimingsEdited.length > 0 || isFieldEdited) {
                                 let oldDescription = buildDescription(editedItem, true);
                                 let newDescription = buildDescription(item, true);

                                 let obj = {
                                     LogId: 0,
                                     ModuleId: 2,
                                     ModuleName: "ASC",
                                     SubModuleId: 40,
                                     SubModuleName: "All Orders",
                                     ScreenType: "IntraOp Anesthesia Medications",
                                     ActionType: actiontype,
                                     OldActionDescription: oldDescription,
                                     NewActionDescription: newDescription,
                                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                 }
                                 $scope.LogObj.LogArray.push(obj);
                             }
                         }
                     });
                 }
             }
         });
     };


     $scope.CompareIntraOpAnesthesiaGeneralOrders = function (savedArray) {
         angular.forEach(savedArray, function (item) {
             // Find matching item from previous saved GeneralOrders (based on some ID or unique name)
             let existingItem = $scope.LogObj.IntraopAnesthesiaGeneralOrders.find(e => e.GeneralOrderId == item.GeneralOrderId);

             // Case 1: Deleted
             if (item.DeleteInd === 'Y') {
                 let oldDesc =
                     (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                     (item.Status ? `Status: ${item.Status}\n` : '') +
                     (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');

                 let givenById = item.GivenBy || '';
                 let givenByUser = '';
                 if (givenById) {
                     let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                     if (user) givenByUser = user.FullName;
                 }

                 if (item.Status == 'Done' && givenByUser) {
                     oldDesc += `by @ ${givenByUser}`;
                 }
                 let obj = {
                     LogId: 0,
                     ModuleId: 2,
                     ModuleName: "ASC",
                     SubModuleId: 40,
                     SubModuleName: "All Orders",
                     ScreenType: "IntraOp Anesthesia Medications",
                     ActionType: "Deleted",
                     OldActionDescription: "",
                     NewActionDescription: oldDesc.trim(),
                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                 }
                 $scope.LogObj.LogArray.push(obj);
             }

             // Case 2: Edited (field-by-field comparison)
             else if (existingItem) {
                 let oldDesc = "";
                 let newDesc = "";

                 if ((existingItem.Status || "") !== (item.Status || "") || (existingItem.MedicationTime || "") !== (item.MedicationTime || "")) {
                     if (existingItem.MedicineName) {
                         oldDesc += `Custom Order: ${existingItem.MedicineName}\n`;
                     }
                     if (item.MedicineName) {
                         newDesc += `Custom Order: ${item.MedicineName}\n`;
                     }
                 }
                 if ((existingItem.Status || "") !== (item.Status || "")) {
                     if (existingItem.Status) {
                         oldDesc += `Status: ${existingItem.Status}\n`;
                     }
                     if (item.Status) {
                         newDesc += `Status: ${item.Status}\n`;
                     }
                 }
                 if ((existingItem.MedicationTime || "") !== (item.MedicationTime || "")) {
                     if (existingItem.MedicationTime) {
                         oldDesc += `MedicationTime: ${existingItem.MedicationTime}\n`;
                     }
                     if (item.MedicationTime) {
                         newDesc += `MedicationTime: ${item.MedicationTime}\n`;
                     }
                 }
                 let oldGivenByUser = '';
                 let newGivenByUser = '';

                 if (existingItem.GivenBy) {
                     let user = $scope.allUserList.find(u => u.DoctorID == existingItem.GivenBy);
                     if (user) oldGivenByUser = user.FullName;
                 }

                 if (item.GivenBy) {
                     let user = $scope.allUserList.find(u => u.DoctorID == item.GivenBy);
                     if (user) newGivenByUser = user.FullName;
                 }

                 if ((existingItem.GivenBy || "") !== (item.GivenBy || "")) {
                     if (oldGivenByUser) {
                         oldDesc += `by @ ${oldGivenByUser}\n`;
                     }
                     if (newGivenByUser) {
                         newDesc += `by @ ${newGivenByUser}\n`;
                     }
                 }

                 if (oldDesc || newDesc) {
                     let obj = {
                         LogId: 0,
                         ModuleId: 2,
                         ModuleName: "ASC",
                         SubModuleId: 40,
                         SubModuleName: "All Orders",
                         ScreenType: "IntraOp Anesthesia Medications",
                         ActionType: "Edited",
                         OldActionDescription: oldDesc.trim(),
                         NewActionDescription: newDesc.trim(),
                         ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                     }
                     $scope.LogObj.LogArray.push(obj);
                 }
             }

             // Case 3: Added
             else {
                 let newDesc =
                     (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                     (item.Status ? `Status: ${item.Status}\n` : '') +
                     (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');
                 let givenById = item.GivenBy || '';
                 let givenByUser = '';
                 if (givenById) {
                     let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                     if (user) givenByUser = user.FullName;
                 }

                 if (item.Status == 'Done' && givenByUser) {
                     newDesc += `by @ ${givenByUser}`;
                 }
                 let obj = {
                     LogId: 0,
                     ModuleId: 2,
                     ModuleName: "ASC",
                     SubModuleId: 40,
                     SubModuleName: "All Orders",
                     ScreenType: "IntraOp Anesthesia Medications",
                     ActionType: "Added",
                     OldActionDescription: "",
                     NewActionDescription: newDesc.trim(),
                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                 }
                 $scope.LogObj.LogArray.push(obj);
             }
         });
     };


     $scope.ComparePostOpMedications = function (savedArray) {
         angular.forEach(savedArray, function (item) {
             // Case 1: Deleted
             if (item.DeleteInd === 'Y') {
                 let description = buildDescription(item, true);
                 let obj = {
                     LogId: 0,
                     ModuleId: 2,
                     ModuleName: "ASC",
                     SubModuleId: 40,
                     SubModuleName: "All Orders",
                     ScreenType: "PostOp Orders",
                     ActionType: "Deleted",
                     OldActionDescription: '',
                     NewActionDescription: description,
                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                 }
                 $scope.LogObj.LogArray.push(obj);
             }

             // Case 2: Added / Edited
             else {
                 let edited = $scope.LogObj.PostOpMedications.filter(eitem =>
                     eitem.OrganizationPrescriptionId == item.OrganizationPrescriptionId
                 );

                 // Newly Added
                 if (edited.length === 0) {
                     let description = buildDescription(item, true);
                     let obj = {
                         LogId: 0,
                         ModuleId: 2,
                         ModuleName: "ASC",
                         SubModuleId: 40,
                         SubModuleName: "All Orders",
                         ScreenType: "PostOp Orders",
                         ActionType: "Added",
                         OldActionDescription: "",
                         NewActionDescription: description,
                         ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                     }
                     $scope.LogObj.LogArray.push(obj);
                 }

                 // Edited
                 else {
                     edited.forEach(function (editedItem) {
                         if (editedItem.OrganizationPrescriptionId == item.OrganizationPrescriptionId) {

                             let actiontype = 'Edited';
                             item.DropTimings = item.DropTimings || [];
                             editedItem.DropTimings = editedItem.DropTimings || [];
                             if (editedItem.DropTimings.length == 0 && item.DropTimings.length > 0) {
                                 actiontype = 'Added';
                             }
                             // Check if DropTimings changed
                             let dropTimingsEdited = editedItem.DropTimings.filter(editem =>
                                 !item.DropTimings.some(ditem =>
                                     ditem.GivenBy == editem.GivenBy &&
                                     ditem.Remarks == editem.Remarks &&
                                     ditem.MedicationDosage == editem.MedicationDosage &&
                                     ditem.MedicationTime == editem.MedicationTime
                                 )
                             );

                             let isFieldEdited =
                                 (editedItem.Action !== item.Action) ||
                                 (editedItem.Dose !== item.Dose) ||
                                 (editedItem.DoseUnit !== item.DoseUnit) ||
                                 (editedItem.Route !== item.Route) ||
                                 (editedItem.Frequency !== item.Frequency) ||
                                 (editedItem.maxDose !== item.maxDose) ||
                                 (editedItem.MedicationNotes !== item.MedicationNotes) ||
                                 (item.DropTimings.length !== editedItem.DropTimings.length);

                             if (dropTimingsEdited.length > 0 || isFieldEdited) {
                                 let oldDescription = buildDescription(editedItem, true);
                                 let newDescription = buildDescription(item, true);

                                 let obj = {
                                     LogId: 0,
                                     ModuleId: 2,
                                     ModuleName: "ASC",
                                     SubModuleId: 40,
                                     SubModuleName: "All Orders",
                                     ScreenType: "PostOp Orders",
                                     ActionType: actiontype,
                                     OldActionDescription: oldDescription,
                                     NewActionDescription: newDescription,
                                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                 }
                                 $scope.LogObj.LogArray.push(obj);
                             }
                         }
                     });
                 }
             }
         });
     };

     $scope.ComparePostOpGeneralOrders = function (savedArray) {
         angular.forEach(savedArray, function (item) {
             // Find matching item from previous saved GeneralOrders (based on some ID or unique name)
             let existingItem = $scope.LogObj.PostOpGeneralOrders.find(e => e.GeneralOrderId == item.GeneralOrderId);

             // Case 1: Deleted
             if (item.DeleteInd === 'Y') {
                 let oldDesc =
                     (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                     (item.Status ? `Status: ${item.Status}\n` : '') +
                     (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');
                 let givenById = item.GivenBy || '';
                 let givenByUser = '';
                 if (givenById) {
                     let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                     if (user) givenByUser = user.FullName;
                 }

                 if (item.Status == 'Done' && givenByUser) {
                     oldDesc += `by @ ${givenByUser}`;
                 }

                 let obj = {
                     LogId: 0,
                     ModuleId: 2,
                     ModuleName: "ASC",
                     SubModuleId: 40,
                     SubModuleName: "All Orders",
                     ScreenType: "PostOp Orders",
                     ActionType: "Deleted",
                     OldActionDescription: "",
                     NewActionDescription: oldDesc.trim(),
                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                 }
                 $scope.LogObj.LogArray.push(obj);
             }

             // Case 2: Edited (field-by-field comparison)
             else if (existingItem) {
                 let oldDesc = "";
                 let newDesc = "";

                 if ((existingItem.Status || "") !== (item.Status || "") || (existingItem.MedicationTime || "") !== (item.MedicationTime || "")) {
                     if (existingItem.MedicineName) {
                         oldDesc += `Custom Order: ${existingItem.MedicineName}\n`;
                     }
                     if (item.MedicineName) {
                         newDesc += `Custom Order: ${item.MedicineName}\n`;
                     }
                 }
                 if ((existingItem.Status || "") !== (item.Status || "")) {
                     if (existingItem.Status) {
                         oldDesc += `Status: ${existingItem.Status}\n`;
                     }
                     if (item.Status) {
                         newDesc += `Status: ${item.Status}\n`;
                     }
                 }
                 if ((existingItem.MedicationTime || "") !== (item.MedicationTime || "")) {
                     if (existingItem.MedicationTime) {
                         oldDesc += `MedicationTime: ${existingItem.MedicationTime}\n`;
                     }
                     if (item.MedicationTime) {
                         newDesc += `MedicationTime: ${item.MedicationTime}\n`;
                     }
                 }
                 let oldGivenByUser = '';
                 let newGivenByUser = '';

                 if (existingItem.GivenBy) {
                     let user = $scope.allUserList.find(u => u.DoctorID == existingItem.GivenBy);
                     if (user) oldGivenByUser = user.FullName;
                 }

                 if (item.GivenBy) {
                     let user = $scope.allUserList.find(u => u.DoctorID == item.GivenBy);
                     if (user) newGivenByUser = user.FullName;
                 }

                 if ((existingItem.GivenBy || "") !== (item.GivenBy || "")) {
                     if (oldGivenByUser) {
                         oldDesc += `by @ ${oldGivenByUser}\n`;
                     }
                     if (newGivenByUser) {
                         newDesc += `by @ ${newGivenByUser}\n`;
                     }
                 }
                 if (oldDesc || newDesc) {
                     let obj = {
                         LogId: 0,
                         ModuleId: 2,
                         ModuleName: "ASC",
                         SubModuleId: 40,
                         SubModuleName: "All Orders",
                         ScreenType: "PostOp Orders",
                         ActionType: "Edited",
                         OldActionDescription: oldDesc.trim(),
                         NewActionDescription: newDesc.trim(),
                         ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                     }
                     $scope.LogObj.LogArray.push(obj);
                 }
             }

             // Case 3: Added
             else {
                 let newDesc =
                     (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                     (item.Status ? `Status: ${item.Status}\n` : '') +
                     (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');
                 let givenById = item.GivenBy || '';
                 let givenByUser = '';
                 if (givenById) {
                     let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                     if (user) givenByUser = user.FullName;
                 }

                 if (item.Status == 'Done' && givenByUser) {
                     newDesc += `by @ ${givenByUser}`;
                 }

                 let obj = {
                     LogId: 0,
                     ModuleId: 2,
                     ModuleName: "ASC",
                     SubModuleId: 40,
                     SubModuleName: "All Orders",
                     ScreenType: "PostOp Orders",
                     ActionType: "Added",
                     OldActionDescription: "",
                     NewActionDescription: newDesc.trim(),
                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                 }
                 $scope.LogObj.LogArray.push(obj);
             }
         });
     };

     $scope.ComparePostOpAnesthesiaMedications = function (savedArray) {
         angular.forEach(savedArray, function (item) {
             // Case 1: Deleted
             if (item.DeleteInd === 'Y') {
                 let description = buildDescription(item, true);
                 let obj = {
                     LogId: 0,
                     ModuleId: 2,
                     ModuleName: "ASC",
                     SubModuleId: 40,
                     SubModuleName: "All Orders",
                     ScreenType: "PostOp Anesthesia Orders",
                     ActionType: "Deleted",
                     OldActionDescription: '',
                     NewActionDescription: description,
                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                 }
                 $scope.LogObj.LogArray.push(obj);
             }

             // Case 2: Added / Edited
             else {
                 let edited = $scope.LogObj.PostOpAnesthesiaMedications.filter(eitem =>
                     eitem.OrganizationPrescriptionId == item.OrganizationPrescriptionId
                 );

                 // Newly Added
                 if (edited.length === 0) {
                     let description = buildDescription(item, true);
                     let obj = {
                         LogId: 0,
                         ModuleId: 2,
                         ModuleName: "ASC",
                         SubModuleId: 40,
                         SubModuleName: "All Orders",
                         ScreenType: "PostOp Anesthesia Orders",
                         ActionType: "Added",
                         OldActionDescription: "",
                         NewActionDescription: description,
                         ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                     }
                     $scope.LogObj.LogArray.push(obj);
                 }

                 // Edited
                 else {
                     edited.forEach(function (editedItem) {
                         if (editedItem.OrganizationPrescriptionId == item.OrganizationPrescriptionId) {

                             let actiontype = 'Edited';
                             item.DropTimings = item.DropTimings || [];
                             editedItem.DropTimings = editedItem.DropTimings || [];
                             if (editedItem.DropTimings.length == 0 && item.DropTimings.length > 0) {
                                 actiontype = 'Added';
                             }
                             // Check if DropTimings changed
                             let dropTimingsEdited = editedItem.DropTimings.filter(editem =>
                                 !item.DropTimings.some(ditem =>
                                     ditem.GivenBy == editem.GivenBy &&
                                     ditem.Remarks == editem.Remarks &&
                                     ditem.MedicationDosage == editem.MedicationDosage &&
                                     ditem.MedicationTime == editem.MedicationTime
                                 )
                             );

                             let isFieldEdited =
                                 (editedItem.Action !== item.Action) ||
                                 (editedItem.Dose !== item.Dose) ||
                                 (editedItem.DoseUnit !== item.DoseUnit) ||
                                 (editedItem.Route !== item.Route) ||
                                 (editedItem.Frequency !== item.Frequency) ||
                                 (editedItem.maxDose !== item.maxDose) ||
                                 (editedItem.MedicationNotes !== item.MedicationNotes) ||
                                 (item.DropTimings.length !== editedItem.DropTimings.length);

                             if (dropTimingsEdited.length > 0 || isFieldEdited) {
                                 let oldDescription = buildDescription(editedItem, true);
                                 let newDescription = buildDescription(item, true);

                                 let obj = {
                                     LogId: 0,
                                     ModuleId: 2,
                                     ModuleName: "ASC",
                                     SubModuleId: 40,
                                     SubModuleName: "All Orders",
                                     ScreenType: "PostOp Anesthesia Orders",
                                     ActionType: actiontype,
                                     OldActionDescription: oldDescription,
                                     NewActionDescription: newDescription,
                                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                 }
                                 $scope.LogObj.LogArray.push(obj);
                             }
                         }
                     });
                 }
             }
         });
     };

     $scope.ComparePostOpAnesthesiaGeneralOrders = function (savedArray) {
         angular.forEach(savedArray, function (item) {
             // Find matching item from previous saved GeneralOrders (based on some ID or unique name)
             let existingItem = $scope.LogObj.PostOpAnesthesiaGeneralOrders.find(e => e.GeneralOrderId == item.GeneralOrderId);

             // Case 1: Deleted
             if (item.DeleteInd === 'Y') {
                 let oldDesc =
                     (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                     (item.Status ? `Status: ${item.Status}\n` : '') +
                     (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');
                 let givenById = item.GivenBy || '';
                 let givenByUser = '';
                 if (givenById) {
                     let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                     if (user) givenByUser = user.FullName;
                 }

                 if (item.Status == 'Done' && givenByUser) {
                     oldDesc += `by @ ${givenByUser}`;
                 }

                 let obj = {
                     LogId: 0,
                     ModuleId: 2,
                     ModuleName: "ASC",
                     SubModuleId: 40,
                     SubModuleName: "All Orders",
                     ScreenType: "PostOp Anesthesia Orders",
                     ActionType: "Deleted",
                     OldActionDescription: "",
                     NewActionDescription: oldDesc.trim(),
                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                 }
                 $scope.LogObj.LogArray.push(obj);
             }

             // Case 2: Edited (field-by-field comparison)
             else if (existingItem) {
                 let oldDesc = "";
                 let newDesc = "";

                 if ((existingItem.Status || "") !== (item.Status || "") || (existingItem.MedicationTime || "") !== (item.MedicationTime || "")) {
                     if (existingItem.MedicineName) {
                         oldDesc += `Custom Order: ${existingItem.MedicineName}\n`;
                     }
                     if (item.MedicineName) {
                         newDesc += `Custom Order: ${item.MedicineName}\n`;
                     }
                 }
                 if ((existingItem.Status || "") !== (item.Status || "")) {
                     if (existingItem.Status) {
                         oldDesc += `Status: ${existingItem.Status}\n`;
                     }
                     if (item.Status) {
                         newDesc += `Status: ${item.Status}\n`;
                     }
                 }
                 if ((existingItem.MedicationTime || "") !== (item.MedicationTime || "")) {
                     if (existingItem.MedicationTime) {
                         oldDesc += `MedicationTime: ${existingItem.MedicationTime}\n`;
                     }
                     if (item.MedicationTime) {
                         newDesc += `MedicationTime: ${item.MedicationTime}\n`;
                     }
                 }
                 let oldGivenByUser = '';
                 let newGivenByUser = '';

                 if (existingItem.GivenBy) {
                     let user = $scope.allUserList.find(u => u.DoctorID == existingItem.GivenBy);
                     if (user) oldGivenByUser = user.FullName;
                 }

                 if (item.GivenBy) {
                     let user = $scope.allUserList.find(u => u.DoctorID == item.GivenBy);
                     if (user) newGivenByUser = user.FullName;
                 }

                 if ((existingItem.GivenBy || "") !== (item.GivenBy || "")) {
                     if (oldGivenByUser) {
                         oldDesc += `by @ ${oldGivenByUser}\n`;
                     }
                     if (newGivenByUser) {
                         newDesc += `by @ ${newGivenByUser}\n`;
                     }
                 }

                 if (oldDesc || newDesc) {
                     let obj = {
                         LogId: 0,
                         ModuleId: 2,
                         ModuleName: "ASC",
                         SubModuleId: 40,
                         SubModuleName: "All Orders",
                         ScreenType: "PostOp Anesthesia Orders",
                         ActionType: "Edited",
                         OldActionDescription: oldDesc.trim(),
                         NewActionDescription: newDesc.trim(),
                         ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                     }
                     $scope.LogObj.LogArray.push(obj);
                 }
             }

             // Case 3: Added
             else {
                 let newDesc =
                     (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                     (item.Status ? `Status: ${item.Status}\n` : '') +
                     (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');
                 let givenById = item.GivenBy || '';
                 let givenByUser = '';
                 if (givenById) {
                     let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                     if (user) givenByUser = user.FullName;
                 }

                 if (item.Status == 'Done' && givenByUser) {
                     newDesc += `by @ ${givenByUser}`;
                 }

                 let obj = {
                     LogId: 0,
                     ModuleId: 2,
                     ModuleName: "ASC",
                     SubModuleId: 40,
                     SubModuleName: "All Orders",
                     ScreenType: "PostOp Anesthesia Orders",
                     ActionType: "Added",
                     OldActionDescription: "",
                     NewActionDescription: newDesc.trim(),
                     ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                 }
                 $scope.LogObj.LogArray.push(obj);
             }
         });
     };

        $scope.LogObj = {
            "UserId": $scope.UserId || null,
            "OrganizationId": $scope.HospitalId || null,
            "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
            "PatientId": $scope.cacheStorageItem.PatientID || null,
            "LogArray": [],
            "GeneralOrders": [],
            "PreOpMedications": [],
            "DilationMedications": [],
            "PreOpMediGeneralOrders":[], 
            "OSPupilSize": "",
            "ODPupilSize": "",
            "DilationOrderDetails": [],
            "PreOpOrderDetails": [],
            "IsDiabetes": null,
            "DiabetesTimings": [],
            "IsHypoglycemiaCheck": false,
            "IntraOpOrderDetails": [],
            "IntraOpAnesthesiaOrderDetails": [],
            "IntraOpMedications": [],
            "IntraopGeneralOrders": [],
            "IntraOpAnesthesiaMedications": [],
            "IntraopAnesthesiaGeneralOrders": [],
            "PostOpOrderDetails": [],
            "PostOpAnesthesiaOrderDetails": [],
            "PostOpMedications": [],
            "PostOpGeneralOrders": [],
            "PostOpAnesthesiaMedications": [],
            "PostOpAnesthesiaGeneralOrders": [],
            "OrgASCChecklistLogs": [],
            "IVBlockedArray": [],
            "IVSiteLactatedRingers": null,
            "IVFluidsId": null,
            "IVSiteFlush": null,
            "IVSiteFluids": null,
            "IVSite": null,
            "IVNeedleSize": null,
            "PatencyStatus": '',
            "IVArm": '',
            "NoOfAttempts": null,
            "IvAccessGivenBy": null,
            "IvAccessGivenByTime": '',
            "IsVeinOpened":null,
            "PhysicianInvestigationslist": [],
            "PhysicianPrescriptionDetails": [],
            "PhysicianGeneralOrders": [],
            "AnesthesiaInvestigationslist": [],
            "AnesthesiaPrescriptionDetails": [],
            "AnesthesiaGeneralOrders":[],
            "FavouriteMedications":[],
            "IVAccessDetailsList":[],
     }
     $scope.PreOpObj.IsClickSavePreOpNurse = false;

     function formatIVAccessArray(array, indices, isAddCase, compareArray = [], masters = {}) {
         let result = [];

         indices.forEach(index => {
             const current = array[index];
             if (!current) return;

             const compare = compareArray[index] || {};
             const isDeleted = current.DeleteInd === 'Y';
             let parts = [];

             function addIfChanged(label, field, idField, masterList, keyName = "Name", matchField = "Id") {
                 let currentId = current[idField];
                 let compareId = compare[idField];

                 let currentVal = getName(masterList, currentId, keyName, matchField);
                 let compareVal = getName(masterList, compareId, keyName, matchField);

                 if (!currentVal) currentVal = current[field] || "";
                 if (!compareVal) compareVal = compare[field] || "";

                 if (isAddCase || currentId !== compareId || currentVal !== compareVal || isDeleted) {
                     if (currentVal) parts.push(`${label}: ${currentVal}`);
                 }
             }

             function getName(list, id, keyName = "Name", matchField = "Id") {
                 if (!id || !list) return "";
                 let found = list.find(x => x[matchField] == id);
                 return found ? found[keyName] : "";
             }

             addIfChanged('Site', 'IVSiteName', 'IVSite', masters.sites, "IVSiteMarkingName", "IVSiteMarkingId");
             let conds = (current.ConditionList || []).filter(c => c.DeleteInd === 'N').map(c => c.Value).join(', ');
             let compConds = (compare.ConditionList || []).filter(c => c.DeleteInd === 'N').map(c => c.Value).join(', ');
             if (isAddCase || conds !== compConds || isDeleted) {
                 if (conds) parts.push(`Condition : ${conds}`);
             }

             addIfChanged('Patency', 'PatencyStatus');
             if (current.PatencyStatus === 'Blocked') {
                 let blocked = (current.IVBlockedArray || []).filter(b => b.IsSelected).map(b => b.IVSiteMarkingName).join(', ');
                 let compBlocked = (compare.IVBlockedArray || []).filter(b => b.IsSelected).map(b => b.IVSiteMarkingName).join(', ');
                 if (isAddCase || blocked !== compBlocked || isDeleted) {
                     if (blocked) parts.push(`Blocked: ${blocked}`);
                 }
             }

             addIfChanged('Size of the canula', 'IVNeedleSizeName', 'IVNeedleSize', masters.needles, "IVSiteMarkingName", "IVSiteMarkingId");
             addIfChanged('Type', 'IVSiteFluidsName', 'IVSiteFluids', masters.Type, "IVSiteMarkingName", "IVSiteMarkingId");
             addIfChanged('Iv Fluids', 'IVFluidsName', 'IVFluidsId', masters.fluids, "IVSiteMarkingName", "IVSiteMarkingId");
             addIfChanged('Volume', 'IVSiteFlushName', 'IVSiteFlush', masters.flushes, "IVSiteMarkingName", "IVSiteMarkingId");
             addIfChanged('No of Attempts', 'NoOfAttempts');
             addIfChanged('Location', 'IVArm');
             addIfChanged('User', 'IvAccessGivenByName', 'IvAccessGivenBy', masters.staff, "FullName", "DoctorID");
             addIfChanged('Time', 'IvAccessGivenByTime');
             addIfChanged('Date', 'IvAccessGivenByDate');
             addIfChanged('Notes', 'Remarks');



             if (parts.length > 0) {
                 let line = `(IV${index + 1}) :  ${parts.join(', ')}`;
                 if (isDeleted) line = `Deleted ${line}`;
                 result.push(line);
             }
         });

         return result.join('\n\n\n');
     }
      
     function getChangedIVAccessIndices(oldArray, newArray) {
         let indices = [];
         for (let i = 0; i < newArray.length; i++) {
             const oldItem = oldArray[i] || {};
             const newItem = newArray[i] || {};

             if (JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
                 indices.push(i);
             }
         }
         return indices;
     }

     function hasRealIVAccessData(list) {
         if (!Array.isArray(list) || !list.length) return false;

         return list.some(item =>
             (item.IVSite && item.IVSite !== 0) ||
             (item.PatencyStatus && item.PatencyStatus !== '') ||
             (item.IVNeedleSize && item.IVNeedleSize !== 0) ||
             (item.IVArm && item.IVArm !== '') ||
             (item.IvAccessGivenBy && item.IvAccessGivenBy !== 0) ||
             (item.IvAccessGivenByTime && item.IvAccessGivenByTime !== '') ||
             (Array.isArray(item.ConditionList) && item.ConditionList.length > 0)
         );
     }

        $scope.PreOpDilationMedicationSave = function (type) {
            let OrgASCChecklist = [];
            $scope.LogObj.LogArray = [];
            if ($scope.PreOpObj.OrgASCChecklist.length > 0) {

                angular.forEach($scope.PreOpObj.OrgASCChecklist, function (item) {
                    item.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || 0;
                    if (item.CheckListId !== 170) {
                        if (item.IsChecked || (item.PatientAscCheckListDetailId != 0 && item.IsChecked == false)) {
                            let DeleteInd = 'N';
                            if (item.PatientAscCheckListDetailId != 0 && item.IsChecked == false) {
                                DeleteInd = 'Y';
                            }
                            let obj = {
                                "PatientAscCheckListDetailId": item.PatientAscCheckListDetailId || 0,
                                "CheckListId": item.CheckListId,
                                "CheckListName": item.CheckListName,
                                "CheckListModuleId": item.CheckListModuleId,
                                "CheckListCategoryId": item.CheckListCategoryId,
                                "CheckListSubTypeId": item.CheckListSubTypeId,
                                "ParentOrganizationId": item.ParentOrganizationId,
                                "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                                "OrganizationPreOpCheckListValueId": null,
                                "Value": item.Value || "",
                                "SubCheckList": [],
                                "Remarks": item.Remarks || "",
                                /*"OrganizationCheckListDetails": [],*/
                                "DeleteInd": DeleteInd || "N",
                                "Score": item.Score || 0,
                            };
                            item.SubCheckList = item.SubCheckList || [];
                            if (item.SubCheckList.length > 0) {
                                angular.forEach(item.SubCheckList, function (hitem) {
                                    hitem.PatientAscSubCheckListId = hitem.PatientAscSubCheckListId || 0;
                                    if (hitem.IsChecked || (hitem.PatientAscSubCheckListId != 0 && hitem.IsChecked == false)) {
                                        hitem.DeleteInd = 'N';
                                        if (hitem.PatientAscSubCheckListId != 0 && hitem.IsChecked == false) {
                                            hitem.DeleteInd = 'Y';
                                        }
                                        obj.SubCheckList.push(hitem);
                                    }
                                });
                            }
                            OrgASCChecklist.push(obj);
                        }
                    } else {
                        let checkedvaluearray = $filter("filter")(item.OrganizationCheckListDetails, function (kitem, index) { return (kitem.IsChecked == true) || (kitem.IsChecked == false && kitem.DeleteInd == 'Y'); });
                        let checkedvalue;
                        if (checkedvaluearray.length > 0) {
                            checkedvalue = checkedvaluearray[0];
                        }
                        if (checkedvalue !== undefined) {
                            let obj = {
                                "PatientAscCheckListDetailId": item.PatientAscCheckListDetailId || 0,
                                "CheckListId": item.CheckListId,
                                "CheckListName": item.CheckListName,
                                "CheckListModuleId": item.CheckListModuleId,
                                "CheckListCategoryId": item.CheckListCategoryId,
                                "CheckListSubTypeId": item.CheckListSubTypeId,
                                "ParentOrganizationId": item.ParentOrganizationId,
                                "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                                "OrganizationPreOpCheckListValueId": null,
                                "Value": item.Value || "",
                                "SubCheckList": [],
                                "Remarks": item.Remarks || "",
                                "DeleteInd": item.DeleteInd || "N",
                                "Score": item.Score || 0,
                                "AscMultiCheckValueArray": []
                            };

                            if (item.OrganizationCheckListDetails.length > 0) {
                                angular.forEach(item.OrganizationCheckListDetails, function (hitem) {
                                    hitem.PatientMultiCheckListId = hitem.PatientMultiCheckListId || 0;
                                    hitem.IsChecked = hitem.IsChecked || false;
                                    if (hitem.PatientMultiCheckListId != 0 && hitem.IsChecked == false) {
                                        hitem.DeleteInd = "Y";
                                    }

                                    if (hitem.IsChecked == true || hitem.PatientMultiCheckListId != 0) {
                                        let object = {
                                            "CheckListId": hitem.CheckListId,
                                            "PatientMultiCheckListId": hitem.PatientMultiCheckListId || 0,
                                            "DeleteInd": hitem.DeleteInd,
                                            "OrganizationPreOpCheckListValueId": hitem.OrganizationPreOpCheckListValueId,
                                            "Value": hitem.Value,
                                            "OrganizationPreOpCheckListId": hitem.OrganizationPreOpCheckListId,
                                        };
                                        obj.AscMultiCheckValueArray.push(object);
                                    }
                                });
                            }
                            if (obj.AscMultiCheckValueArray.length > 0) {
                                OrgASCChecklist.push(obj);
                            }
                        }
                    }
                });
            }

            let IVblockedarray = [];

            if ($scope.PreOpObj.IVBlockedArray.length > 0) {
                angular.forEach($scope.PreOpObj.IVBlockedArray, function (kitem) {
                    kitem.PatientIVBlockedId = kitem.PatientIVBlockedId || 0;
                    if (kitem.IsSelected || (kitem.PatientIVBlockedId != 0 && kitem.IsSelected == false)) {
                        kitem.DeleteInd = 'N';
                        if (kitem.PatientIVBlockedId != 0 && kitem.IsSelected == false) {
                            kitem.DeleteInd = 'Y';
                        }
                        let obj = {
                            "PatientIVBlockedId": kitem.PatientIVBlockedId || 0,
                            "IVSiteMarkingId": kitem.IVSiteMarkingId,
                            "IVSiteMarkingName": kitem.IVSiteMarkingName,
                            "DeleteInd": kitem.DeleteInd || 'N',
                        };
                        IVblockedarray.push(obj);
                    }
                });
            }

            var Param = {
                "VisitId": $scope.cacheStorageItem.PatientVisitId,
                "PatientASCPreOPId": $scope.PreOpAndDialationMedications.PatientASCPreOPId || 0,
                "AppointmentId": $scope.PreOpAndDialationMedications.AppointmentID || 0,
                "PatientId": $scope.PreOpAndDialationMedications.PatientID || 0,
                "HospitalId": $scope.HospitalId || null,
                "UserId": $scope.PreOpAndDialationMedications.DoctorID || 0,
                "DilationMedicationsNotes": $scope.PreOpAndDialationMedications.DilationMedicationsNotes || "",
                "OSPupilSize": $scope.PreOpAndDialationMedications.OSPupilSize || "",
                "ODPupilSize": $scope.PreOpAndDialationMedications.ODPupilSize || "",
                "MedicationRemarks": $scope.PreOpAndDialationMedications.MedicationRemarks || "",
                "DilationReviewId": $scope.PreOpAndDialationMedications.DilationReviewId || 0,
                "IsVeinOpened": $scope.PreOpAndDialationMedications.IsVeinOpened === true ? true : $scope.PreOpAndDialationMedications.IsVeinOpened === false ? false : null,
                "MedicationReviewId": $scope.PreOpAndDialationMedications.MedicationReviewId || 0,
                "DiabetesResult": $scope.PreOpAndDialationMedications.DiabetesResult || "",
                "DiabetesTime": $scope.PreOpAndDialationMedications.DiabetesTime || "",
                "IsDiabetes": $scope.PreOpAndDialationMedications.IsDiabetes === true ? true : $scope.PreOpAndDialationMedications.IsDiabetes === false ? false : null,
                "IsHypoglycemiaCheck": $scope.PreOpAndDialationMedications.IsHypoglycemiaCheck === true ? true : $scope.PreOpAndDialationMedications.IsHypoglycemiaCheck === false ? false : false,
                "DilationMedicationsNotes": $scope.PreOpAndDialationMedications.DilationMedicationsNotes || "",
                "MedicationStartTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss") || "",
                "MedicationStopTime": null,
                "OrderDetails": [],
                "PreOpMedications": [],
                "DilationMedications": [],
                "DiabetesTimings": $scope.PreOpAndDialationMedications.DiabetesTimings || [],
                "PreOpNurseChartStatus": $scope.PreOpAndDialationMedications.PreOpNurseChartStatus || 'D',
                "PreOpAnesthesiaChartStatus": $scope.PreOpAndDialationMedications.PreOpAnesthesiaChartStatus || 'D',
                "PatientSurgeryId": $scope.PreOpAndDialationMedications.PatientSurgeryId || 0,
                "IVSite": $scope.PreOpObj.IVSite || null,
                "IVBlockedArray": IVblockedarray || [],
                "IVNeedleSize": $scope.PreOpObj.IVNeedleSize || null,
                "PatencyStatus": $scope.PreOpObj.PatencyStatus || "",
                "IVArm": $scope.PreOpObj.IVArm || "",
                "OrgASCChecklist": OrgASCChecklist || [],
                "IVSiteFluids": $scope.PreOpObj.IVSiteFluids || null,
                "IVSiteFlush": $scope.PreOpObj.IVSiteFlush || null,
                "IVFluidsId": $scope.PreOpObj.IVFluidsId || null,
                "IVSiteLactatedRingers": $scope.PreOpObj.IVSiteLactatedRingers || null,
                "NoOfAttempts": $scope.PreOpObj.NoOfAttempts || null,
                "IvAccessGivenBy": $scope.PreOpObj.IvAccessGivenBy || null,
                "IvAccessGivenByTime": $scope.PreOpObj.IvAccessGivenByTime || '',
                "IsSurgeonOrdersTimeChecked": $scope.PreOpObj.IsSurgeonOrdersTimeChecked || false,
                "IsAnesthesiaOrdersTimeChecked": $scope.PreOpObj.IsAnesthesiaOrdersTimeChecked || false,
                "IVAccessDetailsList": $scope.PreOpObj.IVAccessDetailsList || [],

            }
            $scope.PreOpAndDialationMedications.PreOpMedications = $scope.PreOpAndDialationMedications.PreOpMedications.map(function (item) {
                item.IsPreOPMed = true;
                item.IsDilationMed = false;
                item.IsIntraAnesthesiaMed = false;
                item.IsIntraMed = false;
                return item;
            });
            $scope.PreOpAndDialationMedications.DilationMedications = $scope.PreOpAndDialationMedications.DilationMedications.map(function (item) {
                item.IsPreOPMed = false;
                item.IsDilationMed = true;
                item.IsIntraAnesthesiaMed = false;
                item.IsIntraMed = false;
                return item;
            });


            if (type == 'PreOpMedications') {
                //var i = 0;
                //angular.forEach($scope.PreOpAndDialationMedications.PreOpMedications, function (item) {                         
                //    if (item.DropTimings.length > 0) {
                //        let tempArray = $filter('filter')(item.DropTimings, { 'GivenBy': null }, true);
                //        if (tempArray.length > 0) {
                //            i++
                //        }
                //    }                        
                //});
                //if (i !== 0) {
                //    alertify.error("Plese select Givenby for Medications!");
                //    return false;
                //}


                var j = 0;
                angular.forEach($scope.PreOpAndDialationMedications.DiabetesTimings, function (item) {
                    if (item.DeleteInd == 'N') {
                        item.DiabetesGivenBy = item.DiabetesGivenBy || 0;
                        if (item.DiabetesGivenBy == 0) {
                            j++
                        }
                    }
                });
                if (j !== 0) {
                    alertify.error("Plese select Givenby for Medications!");
                    return false;
                }
                let preopmedications = [];
                if ($scope.PreOpAndDialationMedications.PreOpMedications.length > 0) {
                    angular.forEach($scope.PreOpAndDialationMedications.PreOpMedications, function (item) {
                        item.UserType = "Anesthesia";
                        preopmedications.push(item);

                    });
                }

            }







            let FinalOrderDetails = [], logdilationmedications = [], DilationMedicationsGeneralOrders=[];
            if (type == 'DilationMedications') {
                let i = 0;
                let j = 0;
                let g = 0;
                let v = 0;
                let gv = 0;

                FinalOrderDetails = $filter('filter')($scope.PreOpObj.OrderDetails, { 'MedTypeId': 2 }, true) || [];
                if (FinalOrderDetails.length > 0) {
                    angular.forEach(FinalOrderDetails, function (Mitem) {
                        if (Mitem.IsOrderReviewed == false) {
                            Mitem.ReviewedBy = null;
                            Mitem.ReviewedByName = '';
                        }
                        Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                        if (Mitem.ReviewedBy != null && Mitem.IsOrderReviewed == false) {
                            if (Mitem.ReviewedByPassword == '') {
                                j++
                            }
                        }
                        if (Mitem.DilationMedications.length > 0) {
                            angular.forEach(Mitem.DilationMedications, function (item) {
                                item.IsDilationMed = true;
                                item.UserType = "Nurse";
                                if (item.DropTimings.length > 0) {
                                    let tempArray = $filter('filter')(item.DropTimings, { 'GivenBy': null }, true);
                                    if (tempArray.length > 0) {
                                        i++
                                    }
                                    // Task 13 - every timing must be validated with the Given By passcode before saving.
                                    if (DropTimingGivenByService.GetNotValidatedCount(item.DropTimings) > 0) {
                                        v++
                                    }
                                };
                                logdilationmedications.push(item);
                            });
                        }
                        if (Mitem.GeneralOrders.length > 0) {
                            // Task 13 - custom orders marked Done need the Given By passcode too.
                            gv += DropTimingGivenByService.GetNotValidatedGeneralOrdersCount(Mitem.GeneralOrders);
                            angular.forEach(Mitem.GeneralOrders, function (item) {
                                if (item.Status == 'Done' && !item.GivenBy) {
                                    g++;
                                }
                                DilationMedicationsGeneralOrders.push(item);
                            });

                        }
                    });
                }
                if (j !== 0) {
                    alertify.error("Plese Enter Password");
                    return false;
                }
                if (i !== 0) {
                    alertify.error("Plese select Givenby for Medications!");
                    return false;
                }
                if (v !== 0) {
                    alertify.error("Please validate Given By password for Medications!");
                    return false;
                }
                if (gv !== 0) {
                    alertify.error("Please validate Given By password for Custom Orders!");
                    return false;
                }
                if (g !== 0) {
                    alertify.error("Plese select Givenby for General Orders!");
                    //$rootScope.$broadcast("loader_hide");
                    return false;
                }


            }
            let k = 0;
            if (FinalOrderDetails.length > 0) {
                angular.forEach(FinalOrderDetails, function (item) {
                    if (item.DilationMedications.length > 0 || item.GeneralOrders.length > 0) {
                        k++
                    }
                })
            }
            if (k != 0) {
                Param.OrderDetails = FinalOrderDetails || [];

                if ($scope.LogObj.DilationMedications.length > 0) {
                    $scope.CompareDilationMedications(logdilationmedications);
                }else {
                    angular.forEach(logdilationmedications, function (item) {
                        let description = '';
                        let timingDescriptions = [];
                        if (item.DropTimings && item.DropTimings.length > 0) {
                            angular.forEach(item.DropTimings, function (dt) {
                                let medicationTime = dt.MedicationTime || '';
                                let givenById = dt.GivenBy || '';
                                let medicationDosage = dt.MedicationDosage || '';
                                let Remarks = dt.Remarks || '';

                                let givenByUser = '';
                                if (givenById) {
                                    let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                                    if (user) givenByUser = user.FullName;
                                }

                                let Notes = '';
                                if (Remarks) {
                                    Notes = 'Notes: ' + Remarks;
                                }

                                let timingDescription = `${medicationDosage} at ${medicationTime} by @ ${givenByUser} ${Notes}`;
                                timingDescriptions.push(timingDescription);
                            });

                            // Build conditional description
                            description =
                                (item.OrderDescription ? ` ${item.OrderDescription}\n` : '') +
                                (item.MedicationNotes ? `Notes: ${item.MedicationNotes}\n` : '') +
                                (timingDescriptions.length > 0 ? timingDescriptions.join(', ') : '');
                        } else {
                            description =
                                (item.OrderDescription ? ` ${item.OrderDescription}\n` : '') +
                                (item.MedicationNotes ? `Notes: ${item.MedicationNotes}\n` : '');
                            
                        }
                        let obj = {
                            LogId: 0,
                            ModuleId: 2,
                            ModuleName: "ASC",
                            SubModuleId: 40,
                            SubModuleName: "All Orders",
                            ScreenType: "PreOp Surgeon Orders",
                            ActionType: "Added",
                            OldActionDescription: "",
                            NewActionDescription: description.trim(),
                            ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    });
                }

                // General orders
                if (DilationMedicationsGeneralOrders.length > 0) {
                    if ($scope.LogObj.GeneralOrders.length > 0) {
                        $scope.CompareGeneralOrders(DilationMedicationsGeneralOrders);
                    } else {
                        angular.forEach(DilationMedicationsGeneralOrders, function (item) {
                            let givenById = item.GivenBy || '';
                            let givenByUser = '';
                            if (givenById) {
                                let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                                if (user) givenByUser = user.FullName;
                            }
                         
                            let description =
                                (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                                (item.Status ? `Status: ${item.Status}\n` : '') +
                                (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');
                            if (item.Status == 'Done' && givenByUser) {
                                description += `by @ ${givenByUser}`;
                            }

                            let obj = {
                                LogId: 0,
                                ModuleId: 2,
                                ModuleName: "ASC",
                                SubModuleId: 40,
                                SubModuleName: "All Orders",
                                ScreenType: "PreOp Surgeon Orders",
                                ActionType: "Added",
                                OldActionDescription: "",
                                NewActionDescription: description,
                                ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                            };
                            $scope.LogObj.LogArray.push(obj);
                        });
                    }
                }
            }


            $scope.LogObj.DilationOrderDetails = $scope.LogObj.DilationOrderDetails || [];
            if (FinalOrderDetails.length > 0 || $scope.LogObj.DilationOrderDetails.length > 0) {
                angular.forEach(FinalOrderDetails, function (currentItem) {
                    currentItem.IsOrderReviewed = currentItem.IsOrderReviewed || false;
                    var edited = $scope.LogObj.DilationOrderDetails.find(function (prev) {
                        return prev.UserOrderId === currentItem.UserOrderId;
                    });

                    if (currentItem.IsOrderReviewed && (!edited || edited.ReviewedBy !== currentItem.ReviewedBy)) {
                        let actionType = "Added";
                        let obj = {
                            LogId: 0,
                            ModuleId: 2,
                            ModuleName: "ASC",
                            SubModuleId: 40,
                            SubModuleName: "All Orders",
                            ScreenType: "PreOp Surgeon Orders",
                            ActionType: actionType,
                            OldActionDescription: "",
                            NewActionDescription: `Pre-Op Surgeon Orders Signed By ${currentItem.ReviewedByName}`,
                            ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }
                });
            }

            //if (Param.OrderDetails.length > 0 || $scope.PreOpAndDialationMedications.PreOpNurseChartStatus != '') {
            //    Param.PreOpNurseChartStatus = "D";
            //}

            let FinalPreOrderDetails = [], logPreOpMedications = [], PreOpMedicationsGeneralOrders = [];
            if (type == 'PreOpMedications') {
                var i = 0;
                var n = 0;
                let g = 0;
                let v = 0;
                let gv = 0;
                FinalPreOrderDetails = $filter('filter')($scope.PreOpObj.OrderDetails, { 'MedTypeId': 1 }, true) || [];
                if (FinalPreOrderDetails.length > 0) {
                    angular.forEach(FinalPreOrderDetails, function (Mitem) {
                        if (Mitem.IsOrderReviewed == false) {
                            Mitem.ReviewedBy = null;
                            Mitem.ReviewedByName = '';
                        }
                        Mitem.IsOrderReviewed = Mitem.IsOrderReviewed || false;
                        Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                        if (Mitem.ReviewedBy != null && Mitem.IsOrderReviewed == false) {
                            if (Mitem.ReviewedByPassword == '') {
                                n++
                            }
                        }
                        if (Mitem.PreOpMedications.length > 0) {
                            angular.forEach(Mitem.PreOpMedications, function (item) {
                                item.IsPreOPMed = true;
                                item.UserType = "Anesthesia";
                                if (item.DropTimings.length > 0) {
                                    let tempArray = $filter('filter')(item.DropTimings, { 'GivenBy': null }, true);
                                    if (tempArray.length > 0) {
                                        i++
                                    }
                                    // Task 13 - every timing must be validated with the Given By passcode before saving.
                                    if (DropTimingGivenByService.GetNotValidatedCount(item.DropTimings) > 0) {
                                        v++
                                    }
                                };
                                logPreOpMedications.push(item);
                            });
                        }
                        if (Mitem.GeneralOrders.length > 0) {
                            // Task 13 - custom orders marked Done need the Given By passcode too.
                            gv += DropTimingGivenByService.GetNotValidatedGeneralOrdersCount(Mitem.GeneralOrders);
                            angular.forEach(Mitem.GeneralOrders, function (item) {
                                if (item.Status == 'Done' && !item.GivenBy) {
                                    g++;
                                }
                                PreOpMedicationsGeneralOrders.push(item);
                            });

                        }
                    });
                }
                if (n !== 0) {
                    alertify.error("Plese Enter Password");
                    return false;
                }
                if (i !== 0) {
                    alertify.error("Plese select Givenby for Medications!");
                    return false;
                }
                if (v !== 0) {
                    alertify.error("Please validate Given By password for Medications!");
                    return false;
                }
                if (gv !== 0) {
                    alertify.error("Please validate Given By password for Custom Orders!");
                    return false;
                }
                if (g !== 0) {
                    alertify.error("Plese select Givenby for General Orders!");
                    //$rootScope.$broadcast("loader_hide");
                    return false;
                }

            }
            let z = 0;
            if (FinalPreOrderDetails.length > 0) {
                angular.forEach(FinalPreOrderDetails, function (item) {
                    if (item.PreOpMedications.length > 0 || item.GeneralOrders.length > 0) {
                        z++
                    }
                })
            }
            if (z != 0) {
                Param.OrderDetails = FinalPreOrderDetails || [];

                if ($scope.LogObj.PreOpMedications.length > 0) {
                    $scope.ComparePreOpMedications(logPreOpMedications);
                }
                else {
                    angular.forEach(logPreOpMedications, function (item) {
                        let description = '';
                        let timingDescriptions = [];
                        if (item.DropTimings && item.DropTimings.length > 0) {
                            angular.forEach(item.DropTimings, function (dt) {
                                let medicationTime = dt.MedicationTime || '';
                                let givenById = dt.GivenBy || '';
                                let medicationDosage = dt.MedicationDosage || '';
                                let Remarks = dt.Remarks || '';

                                let givenByUser = '';
                                if (givenById) {
                                    let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                                    if (user) givenByUser = user.FullName;
                                }

                                let Notes = '';
                                if (Remarks) {
                                    Notes = 'Notes: ' + Remarks;
                                }

                                let timingDescription = `${medicationDosage} at ${medicationTime} by @ ${givenByUser} ${Notes}`;
                                timingDescriptions.push(timingDescription);
                            });

                            // Build conditional description
                            description =
                                (item.OrderDescription ? ` ${item.OrderDescription}\n` : '') +
                                (item.MedicationNotes ? `Notes: ${item.MedicationNotes}\n` : '') +
                                (timingDescriptions.length > 0 ? timingDescriptions.join(', ') : '');
                        } else {
                            description =
                                (item.OrderDescription ? ` ${item.OrderDescription}\n` : '') +
                                (item.MedicationNotes ? `Notes: ${item.MedicationNotes}\n` : '');

                        }

                        let obj = {
                            LogId: 0,
                            ModuleId: 2,
                            ModuleName: "ASC",
                            SubModuleId: 40,
                            SubModuleName: "All Orders",
                            ScreenType: "PreOp Anesthesia Orders",
                            ActionType: "Added",
                            OldActionDescription: "",
                            NewActionDescription: description.trim(),
                            ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    });
                }

                if (PreOpMedicationsGeneralOrders.length > 0) {
                    if ($scope.LogObj.PreOpMediGeneralOrders.length > 0) {
                        $scope.ComparePreOpMediGeneralOrders(PreOpMedicationsGeneralOrders);
                    } else {
                        angular.forEach(PreOpMedicationsGeneralOrders, function (item) {
                            let description =
                                (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                                (item.Status ? `Status: ${item.Status}\n` : '') +
                                (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');
                            let givenById = item.GivenBy || '';
                            let givenByUser = '';
                            if (givenById) {
                                let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                                if (user) givenByUser = user.FullName;
                            }

                            if (item.Status == 'Done' && givenByUser) {
                                description += `by @ ${givenByUser}`;
                            }
                            let obj = {
                                "LogId": 0,
                                "ModuleId": 2,
                                "ModuleName": "ASC",
                                "SubModuleId": 40,
                                "SubModuleName": "All Orders",
                                "ScreenType": "PreOp Anesthesia Orders",
                                "ActionType": "Added",
                                "OldActionDescription": "",
                                "NewActionDescription": description,
                                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                            };
                            $scope.LogObj.LogArray.push(obj);
                        });

                    }
                }
            }

            $scope.LogObj.PreOpOrderDetails = $scope.LogObj.PreOpOrderDetails || [];
            if (FinalPreOrderDetails.length > 0 || $scope.LogObj.PreOpOrderDetails.length > 0) {
                angular.forEach(FinalPreOrderDetails, function (currentItem) {
                    currentItem.IsOrderReviewed = currentItem.IsOrderReviewed || false;
                    var edited = $scope.LogObj.PreOpOrderDetails.find(function (prev) {
                        return prev.UserOrderId === currentItem.UserOrderId;
                    });

                    if (currentItem.IsOrderReviewed && (!edited || edited.ReviewedBy !== currentItem.ReviewedBy)) {
                        let actionType = "Added";
                        let obj = {
                            LogId: 0,
                            ModuleId: 2,
                            ModuleName: "ASC",
                            SubModuleId: 40,
                            SubModuleName: "All Orders",
                            ScreenType: "PreOp Anesthesia Orders",
                            ActionType: actionType,
                            OldActionDescription: "",
                            NewActionDescription: `Pre-Op Anesthesia Orders Signed By ${currentItem.ReviewedByName}`,
                            ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }
                });
            }

            Param.ODPupilSize = Param.ODPupilSize || '';
            Param.OSPupilSize = Param.OSPupilSize || '';
            $scope.LogObj.ODPupilSize = $scope.LogObj.ODPupilSize || '';
            $scope.LogObj.OSPupilSize = $scope.LogObj.OSPupilSize || '';

            if (Param.ODPupilSize !== '' || Param.OSPupilSize !== '' || $scope.LogObj.ODPupilSize !== '' || $scope.LogObj.OSPupilSize !== '') {

                if ($scope.LogObj.ODPupilSize === '' && $scope.LogObj.OSPupilSize === '') {
                    // Case: Added
                    let newDesc = '';
                    if (Param.ODPupilSize) {
                        newDesc += "OD Pupil Size Value: " + Param.ODPupilSize;
                    }
                    if (Param.OSPupilSize) {
                        newDesc += (newDesc ? "\n" : "") + "OS Pupil Size Value: " + Param.OSPupilSize;
                    }
                    if (newDesc) {
                        let obj = {
                            "LogId": 0,
                            "ModuleId": 2,
                            "ModuleName": "ASC",
                            "SubModuleId": 40,
                            "SubModuleName": "All Orders",
                            "ScreenType": "Pupil Size",
                            "ActionType": "Added",
                            "OldActionDescription": '',
                            "NewActionDescription": newDesc,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        }
                        $scope.LogObj.LogArray.push(obj);
                    }
                } else {
                    // Case: Edited
                    let newDesc = '';
                    let oldDesc = '';

                    if (Param.ODPupilSize !== $scope.LogObj.ODPupilSize) {
                        if ($scope.LogObj.ODPupilSize) {
                            oldDesc += "OD Pupil Size Value: " + $scope.LogObj.ODPupilSize;
                        }
                        if (Param.ODPupilSize) {
                            newDesc += "OD Pupil Size Value: " + Param.ODPupilSize;
                        }
                    }

                    if (Param.OSPupilSize !== $scope.LogObj.OSPupilSize) {
                        if (oldDesc) oldDesc += "\n";
                        if (newDesc) newDesc += "\n";

                        if ($scope.LogObj.OSPupilSize) {
                            oldDesc += "OS Pupil Size Value: " + $scope.LogObj.OSPupilSize;
                        }
                        if (Param.OSPupilSize) {
                            newDesc += "OS Pupil Size Value: " + Param.OSPupilSize;
                        }
                    }

                    if (newDesc || oldDesc) {
                        let obj = {
                            "LogId": 0,
                            "ModuleId": 2,
                            "ModuleName": "ASC",
                            "SubModuleId": 40,
                            "SubModuleName": "All Orders",
                            "ScreenType": "Pupil Size",
                            "ActionType": "Edited",
                            "OldActionDescription": oldDesc,
                            "NewActionDescription": newDesc,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        }
                        $scope.LogObj.LogArray.push(obj);
                    }
                }
            }

          
            Param.DiabetesTimings = Param.DiabetesTimings || [];
            $scope.LogObj.DiabetesTimings = $scope.LogObj.DiabetesTimings || [];
            

            if (Param.IsDiabetes != null || $scope.LogObj.IsDiabetes != null) {
                let ActionType = ($scope.LogObj.IsDiabetes == null) ? 'Added' : 'Edited';

                let oldVals = [], newVals = [], deletedVals = [];

                // Compare main IsDiabetes flag
                if (Param.IsDiabetes != $scope.LogObj.IsDiabetes) {
                    if ($scope.LogObj.IsDiabetes != null)
                        oldVals.push("Diabetes: " + ($scope.LogObj.IsDiabetes ? "Yes" : "No"));
                    if (Param.IsDiabetes != null)
                        newVals.push("Diabetes: " + (Param.IsDiabetes ? "Yes" : "No"));
                }

                if (Param.IsHypoglycemiaCheck != $scope.LogObj.IsHypoglycemiaCheck) {
                    if ($scope.LogObj.IsHypoglycemiaCheck)
                        oldVals.push("Hypoglycemia");
                    if (Param.IsHypoglycemiaCheck)
                        newVals.push("Hypoglycemia");
                }

                let oldArr = $scope.LogObj.DiabetesTimings || [];
                let newArr = Param.DiabetesTimings || [];

                // deleted items
                newArr.forEach(item => {
                    if (item.DeleteInd === 'Y') {
                        let oldUser = '';
                        if (item.DiabetesGivenBy) {
                            let user = $scope.allUserList.find(u => u.DoctorID == item.DiabetesGivenBy);
                            if (user) oldUser = user.FullName;
                        }
                        let desc = "Diabetes Result & Time: " +
                            (item.DiabetesResult ? item.DiabetesResult + " mg/dL at " : "") +
                            item.DiabetesTime + " " + (oldUser ? oldUser : "");
                        deletedVals.push(desc);
                    }
                });

                // edited items
                newArr.forEach(newItem => {
                    if (newItem.DeleteInd === 'Y') return; // skip deleted

                    let match = oldArr.find(oldItem =>
                        oldItem.DiabetesTimingId === newItem.DiabetesTimingId
                    );

                    let newUser = '';
                    if (newItem.DiabetesGivenBy) {
                        let user = $scope.allUserList.find(u => u.DoctorID == newItem.DiabetesGivenBy);
                        if (user) newUser = user.FullName;
                    }
                    let newDesc = "Diabetes Result & Time: " +
                        (newItem.DiabetesResult ? newItem.DiabetesResult + " mg/dL at " : "") +
                        newItem.DiabetesTime + " " + (newUser ? newUser : "");

                    if (match) {
                        if (match.DiabetesResult !== newItem.DiabetesResult ||
                            match.DiabetesGivenBy !== newItem.DiabetesGivenBy ||
                            match.DiabetesTime !== newItem.DiabetesTime) {
                            let oldUser = '';
                            if (match.DiabetesGivenBy) {
                                let user = $scope.allUserList.find(u => u.DoctorID == match.DiabetesGivenBy);
                                if (user) oldUser = user.FullName;
                            }
                            let oldDesc = "Diabetes Result & Time: " +
                                (match.DiabetesResult ? match.DiabetesResult + " mg/dL at " : "") +
                                match.DiabetesTime + " " + (oldUser ? oldUser : "");
                            oldVals.push(oldDesc);
                            newVals.push(newDesc);
                        }
                       
                    } else {
                        // Added
                        newVals.push(newDesc);
                    }
                });

                
                if (oldVals.length > 0 || newVals.length > 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 40,
                        "SubModuleName": "All Orders",
                        "ScreenType": "Diabetes",
                        "ActionType": ActionType,
                        "OldActionDescription": oldVals.join("\n"),
                        "NewActionDescription": newVals.join("\n"),
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    }
                    $scope.LogObj.LogArray.push(obj);
                }

                
                if (deletedVals.length > 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 40,
                        "SubModuleName": "All Orders",
                        "ScreenType": "Diabetes",
                        "ActionType": "Deleted",
                        "OldActionDescription": "",
                        "NewActionDescription": deletedVals.join("\n"),
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    }
                    $scope.LogObj.LogArray.push(obj);
                }
            }


            //let IVCondition = $filter("filter")(Param.OrgASCChecklist, function (item) {
            //    return item.CheckListId === 170;
            //}) || [];
            //let editedIVCondition = $filter("filter")($scope.LogObj.OrgASCChecklistLogs, function (item) {
            //    return item.CheckListId === 170;
            //}) || [];

            //$scope.LogObj.IVSite = $scope.LogObj.IVSite || null;
            //Param.IVSite = Param.IVSite || null;
            //Param.PatencyStatus = Param.PatencyStatus || '';
            //$scope.LogObj.PatencyStatus = $scope.LogObj.PatencyStatus || '';
            //Param.IVNeedleSize = Param.IVNeedleSize || null;
            //$scope.LogObj.IVNeedleSize = $scope.LogObj.IVNeedleSize || null;
            //Param.IVArm = Param.IVArm || '';
            //$scope.LogObj.IVArm = $scope.LogObj.IVArm || '';
            //Param.IVFluidsId = Param.IVFluidsId || null;
            //$scope.LogObj.IVFluidsId = $scope.LogObj.IVFluidsId || null;
            //Param.IVSiteFluids = Param.IVSiteFluids || null;
            //$scope.LogObj.IVSiteFluids = $scope.LogObj.IVSiteFluids || null;
            //Param.IVSiteFlush = Param.IVSiteFlush || null;
            //$scope.LogObj.IVSiteFlush = $scope.LogObj.IVSiteFlush || null;
            //Param.NoOfAttempts = Param.NoOfAttempts || null;
            //$scope.LogObj.NoOfAttempts = $scope.LogObj.NoOfAttempts || null;
            //Param.IvAccessGivenBy = Param.IvAccessGivenBy || null;
            //$scope.LogObj.IvAccessGivenBy = $scope.LogObj.IvAccessGivenBy || null;
            //Param.IvAccessGivenByTime = Param.IvAccessGivenByTime || '';
            //$scope.LogObj.IvAccessGivenByTime = $scope.LogObj.IvAccessGivenByTime || '';

            //if (Param.IVSite || $scope.LogObj.IVSite || Param.PatencyStatus || $scope.LogObj.PatencyStatus || Param.IVNeedleSize || $scope.LogObj.IVNeedleSize || Param.IVArm || $scope.LogObj.IVArm || Param.IVFluidsId || $scope.LogObj.IVFluidsId || Param.IVSiteFluids || $scope.LogObj.IVSiteFluids || Param.IVSiteFlush || $scope.LogObj.IVSiteFlush || Param.NoOfAttempts || $scope.LogObj.NoOfAttempts || Param.IvAccessGivenBy || $scope.LogObj.IvAccessGivenBy || Param.IvAccessGivenByTime || $scope.LogObj.IvAccessGivenByTime || (Param.IVBlockedArray && Param.IVBlockedArray.length > 0) || ($scope.LogObj.IVBlockedArray && $scope.LogObj.IVBlockedArray.length > 0) || (IVCondition && IVCondition.length > 0) || (editedIVCondition && editedIVCondition.length>0)) {

               
            //    let count = 0;
            //    var Affecteditem = '';
            //    var OLDAffecteditem = '';

            //    let isNew = !$scope.LogObj.IVArm &&
            //        !$scope.LogObj.IVNeedleSize &&
            //        !$scope.LogObj.PatencyStatus &&
            //        !$scope.LogObj.IVSite &&
            //        (!$scope.LogObj.IVBlockedArray || $scope.LogObj.IVBlockedArray.length === 0) &&
            //        (!editedIVCondition ||editedIVCondition.length == 0) &&
            //        !$scope.LogObj.IvAccessGivenByTime &&
            //        !$scope.LogObj.IvAccessGivenBy &&
            //        !$scope.LogObj.NoOfAttempts &&
            //        !$scope.LogObj.IVSiteFlush &&
            //        !$scope.LogObj.IVSiteFluids &&
            //        !$scope.LogObj.IVFluidsId;

            //    let ActionType = isNew ? "Added" : "Edited";

            //    if (Param.IVSite != $scope.LogObj.IVSite) {
            //        if (Param.IVSite) {
            //            let FilterIVSiteArray = $filter('filter')($scope.PreOpObj.IVSiteArray, { 'IVSiteMarkingId': Param.IVSite }, true) || [];
            //            if (FilterIVSiteArray.length != 0) {
            //                Affecteditem = "Site: " + FilterIVSiteArray[0].IVSiteMarkingName || '';
            //            }  
            //        }
            //        if ($scope.LogObj.IVSite) {
            //            let FilterIVSiteArray1 = $filter('filter')($scope.PreOpObj.IVSiteArray, { 'IVSiteMarkingId': $scope.LogObj.IVSite }, true) || [];
            //            if (FilterIVSiteArray1.length != 0) {
            //                OLDAffecteditem = "Site: " + FilterIVSiteArray1[0].IVSiteMarkingName || '';
            //            }
            //        }
            //        count++;
            //    }

            //    if (Param.PatencyStatus != $scope.LogObj.PatencyStatus) {
            //        if (Param.PatencyStatus) {
            //            Affecteditem += "\nPatency Status: " + Param.PatencyStatus || '';
            //        }
            //        if ($scope.LogObj.PatencyStatus) {
            //            OLDAffecteditem += "\nPatency Status: " + $scope.LogObj.PatencyStatus || '';
            //        }
            //        count++;
            //    }


            //    if (Param.IVNeedleSize != $scope.LogObj.IVNeedleSize) {
            //        if (Param.IVNeedleSize) {
            //            let FilterniddleArray = $filter('filter')($scope.PreOpObj.NeedleSize, { 'IVSiteMarkingId': Param.IVNeedleSize }, true) || [];
            //            if (FilterniddleArray.length > 0) {
            //                Affecteditem += "\nSize of the canula: " + FilterniddleArray[0].IVSiteMarkingName || '';
            //            }
            //        }
            //        if ($scope.LogObj.IVNeedleSize) {
            //            let FilterniddleArray2 = $filter('filter')($scope.PreOpObj.NeedleSize, { 'IVSiteMarkingId': $scope.LogObj.IVNeedleSize }, true) || [];
            //            if (FilterniddleArray2.length > 0) {
            //                OLDAffecteditem += "\nSize of the canula: " + FilterniddleArray2[0].IVSiteMarkingName || '';
            //            }
            //        }
            //        count++;
            //    }

            //    if (Param.IVArm != $scope.LogObj.IVArm) {
            //        if (Param.IVArm) {
            //            Affecteditem += "\nLocation: " + Param.IVArm || '';
            //        }
            //        if ($scope.LogObj.IVArm) {
            //            OLDAffecteditem += "\nLocation: " + $scope.LogObj.IVArm || '';
            //        }
            //        count++;
            //    }

            //    if (Param.IVSiteFluids != $scope.LogObj.IVSiteFluids) {
            //        if (Param.IVSiteFluids) {
            //            let FilterfluidArray = $filter('filter')($scope.PreOpObj.IVSiteFluidsArray, { 'IVSiteMarkingId': Param.IVSiteFluids }, true) || [];
            //            if (FilterfluidArray.length > 0) {
            //                Affecteditem += "\nType: " + FilterfluidArray[0].IVSiteMarkingName || '';
            //            }
            //        }

            //        if ($scope.LogObj.IVSiteFluids) {
            //            let FilterfluidArray3 = $filter('filter')($scope.PreOpObj.IVSiteFluidsArray, { 'IVSiteMarkingId': $scope.LogObj.IVSiteFluids }, true) || [];
            //            if (FilterfluidArray3.length > 0) {
            //                OLDAffecteditem += "\nType: " + FilterfluidArray3[0].IVSiteMarkingName || '';
            //            }
            //        }
            //        count++;
            //    }
            //    if (Param.IVFluidsId != $scope.LogObj.IVFluidsId) {
            //        if (Param.IVFluidsId) {
            //            let FilterfluidArray1 = $filter('filter')($scope.PreOpObj.IVFluidsArray, { 'IVSiteMarkingId': Param.IVFluidsId }, true) || [];
            //            if (FilterfluidArray1.length > 0) {
            //                Affecteditem += "\nIv Fluids: " + FilterfluidArray1[0].IVSiteMarkingName || '';
            //            }
            //        }
            //        if ($scope.LogObj.IVFluidsId) {
            //            let FilterfluidArray4 = $filter('filter')($scope.PreOpObj.IVFluidsArray, { 'IVSiteMarkingId': $scope.LogObj.IVFluidsId }, true) || [];
            //            if (FilterfluidArray4.length > 0) {
            //                OLDAffecteditem += "\nIv Fluids: " + FilterfluidArray4[0].IVSiteMarkingName || '';
            //            }
            //        }
            //        count++;
            //    }
            //    if (Param.IVSiteFlush != $scope.LogObj.IVSiteFlush) {
            //        if (Param.IVSiteFlush) {
            //            let Filtervolume = $filter('filter')($scope.PreOpObj.IVSiteFlushArray, { 'IVSiteMarkingId': Param.IVSiteFlush }, true) || [];
            //            if (Filtervolume.length > 0) {
            //                Affecteditem += "\nVolume: " + Filtervolume[0].IVSiteMarkingName || '';
            //            }
            //        }
                        
            //        if ($scope.LogObj.IVSiteFlush) {
            //            let Filtervolume1 = $filter('filter')($scope.PreOpObj.IVSiteFlushArray, { 'IVSiteMarkingId': $scope.LogObj.IVSiteFlush }, true) || [];
            //            if (Filtervolume1.length > 0) {
            //                OLDAffecteditem += "\nVolume: " + Filtervolume1[0].IVSiteMarkingName || '';
            //            }
            //        }
                    
            //        count++;
            //    }
            //    if (Param.NoOfAttempts != $scope.LogObj.NoOfAttempts) {
            //        if (Param.NoOfAttempts) {
            //            let FilterAttempts = $filter('filter')($scope.NoOfAttemptsArray, { 'Id': Param.NoOfAttempts }, true) || [];
            //            if (FilterAttempts.length > 0) {
            //                Affecteditem += "\nNo. Of Attempts: " + FilterAttempts[0].Value || '';
            //            }
            //        }
            //        if ($scope.LogObj.NoOfAttempts) {
            //            let FilterAttempts1 = $filter('filter')($scope.NoOfAttemptsArray, { 'Id': $scope.LogObj.NoOfAttempts }, true) || [];
            //            if (FilterAttempts1.length > 0) {
            //                OLDAffecteditem += "\nNo. Of Attempts: " + FilterAttempts1[0].Value || '';
            //            }
            //        }
            //        count++;
            //    }
            //    if (Param.IvAccessGivenBy != $scope.LogObj.IvAccessGivenBy) {
            //        if (Param.IvAccessGivenBy) {
            //            let Filterusers = $filter('filter')($scope.ReviewedByArray, { 'DoctorID': Param.IvAccessGivenBy }, true) || [];
            //            if (Filterusers.length > 0) {
            //                Affecteditem += "\nUser: " + Filterusers[0].FullName || '';
            //            }
            //        }
            //        if ($scope.LogObj.IvAccessGivenBy) {
            //            let Filterusers1 = $filter('filter')($scope.ReviewedByArray, { 'DoctorID': $scope.LogObj.IvAccessGivenBy }, true) || [];
            //            if (Filterusers1.length > 0) {
            //                OLDAffecteditem += "\nUser: " + Filterusers1[0].FullName || '';
            //            }
            //        }
            //        count++;
            //    }
            //    if (Param.IvAccessGivenByTime != $scope.LogObj.IvAccessGivenByTime) {
            //        if (Param.IvAccessGivenByTime) {
            //            Affecteditem += "\nat " + Param.IvAccessGivenByTime || '';
            //        }
            //        if ($scope.LogObj.IvAccessGivenByTime) {
            //            OLDAffecteditem += "\nat " + $scope.LogObj.IvAccessGivenByTime || '';
            //        }
            //        count++;
            //    }

            //    if (editedIVCondition.length > 0) {
            //        let IVConditionitem = [];
            //        let IVConditionitemold = [];

            //        angular.forEach(IVCondition, function (ivItem) {
            //            angular.forEach(ivItem.AscMultiCheckValueArray || [], function (itemB) {
            //                // Look for same value in ALL edited arrays
            //                let existsInEdited = false;
            //                angular.forEach(editedIVCondition, function (editItem) {
            //                    let found = $filter('filter')(editItem.AscMultiCheckValueArray || [], {
            //                        "OrganizationPreOpCheckListValueId": itemB.OrganizationPreOpCheckListValueId
            //                    }, true);
            //                    if (found.length > 0) {
            //                        existsInEdited = true;
            //                    }
            //                });

            //                // Newly added (present in IVCondition, not in edited, and not deleted)
            //                if (!existsInEdited && itemB.DeleteInd === 'N') {
            //                    IVConditionitem.push(itemB.Value);
            //                }

            //                // Removed (present in both but marked deleted)
            //                if (existsInEdited && itemB.DeleteInd === 'Y') {
            //                    IVConditionitemold.push(itemB.Value);
            //                }
            //            });
            //        });

            //        if (IVConditionitem.length > 0) {
            //            Affecteditem += "\nCondition: " + IVConditionitem.join(", ");
            //            count++;
            //        }
            //        if (IVConditionitemold.length > 0) {
            //            OLDAffecteditem += "\nCondition: " + IVConditionitemold.join(", ");
            //            count++;
            //        }

            //    } else if (IVCondition.length > 0) {
            //        let IVConditionitem = [];

            //        angular.forEach(IVCondition, function (ivItem) {
            //            let selected = $filter('filter')(ivItem.AscMultiCheckValueArray || [], { "DeleteInd": 'N' }, true);
            //            angular.forEach(selected, function (itemA) {
            //                IVConditionitem.push(itemA.Value);
            //            });
            //        });

            //        if (IVConditionitem.length > 0) {
            //            Affecteditem += "\nCondition: " + IVConditionitem.join(", ");
            //        }
            //    }

                

            //    if (count > 0) {

            //        let obj = {
            //            "LogId": 0,
            //            "ModuleId": 2,
            //            "ModuleName": "ASC",
            //            "SubModuleId": 40,
            //            "SubModuleName": "All Orders",
            //            "ScreenType": "IV Access",
            //            "ActionType": ActionType,
            //            "OldActionDescription": OLDAffecteditem,
            //            "NewActionDescription": Affecteditem,
            //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            //        };
            //        $scope.LogObj.LogArray.push(obj);

            //    }
            //}


            if (($scope.PreOpObj.IVAccessDetailsList || []).length > 0 || ($scope.LogObj.IVAccessDetailsList || []).length>0) {
                let ActionType = '';
                let OldDescription = '';
                let NewDescription = '';
                const oldHasData = hasRealIVAccessData($scope.LogObj.IVAccessDetailsList);
                const newHasData = hasRealIVAccessData($scope.PreOpObj.IVAccessDetailsList);

                if (!oldHasData && newHasData) {
                    let indices = $scope.PreOpObj.IVAccessDetailsList.map((_, i) => i);
                    NewDescription = formatIVAccessArray($scope.PreOpObj.IVAccessDetailsList, indices, true, [], {
                        sites: $scope.PreOpObj.IVSiteArray,//Site
                        needles: $scope.PreOpObj.NeedleSize,//Size of the canula 
                        fluids: $scope.PreOpObj.IVFluidsArray,//Iv Fluids
                        Type: $scope.PreOpObj.IVSiteFluidsArray,//Type
                        flushes: $scope.PreOpObj.IVSiteFlushArray,//Volume
                        staff: $scope.ReviewedByArray//User
                    });
                    if (NewDescription !== '') {
                        ActionType = 'Added';
                    }
                }
                else {
                    // Edit case
                    const changedIndices = getChangedIVAccessIndices($scope.LogObj.IVAccessDetailsList, $scope.PreOpObj.IVAccessDetailsList);
                    if (changedIndices.length > 0) {
                        ActionType = 'Edited';
                        OldDescription = formatIVAccessArray($scope.LogObj.IVAccessDetailsList, changedIndices, false, $scope.PreOpObj.IVAccessDetailsList, {
                            sites: $scope.PreOpObj.IVSiteArray,//Site
                            needles: $scope.PreOpObj.NeedleSize,//Size of the canula 
                            fluids: $scope.PreOpObj.IVFluidsArray,//Iv Fluids
                            Type: $scope.PreOpObj.IVSiteFluidsArray,//Type
                            flushes: $scope.PreOpObj.IVSiteFlushArray,//Volume
                            staff: $scope.ReviewedByArray//User
                        });
                       
                        NewDescription = formatIVAccessArray($scope.PreOpObj.IVAccessDetailsList, changedIndices, false, $scope.LogObj.IVAccessDetailsList, {
                            sites: $scope.PreOpObj.IVSiteArray,//Site
                            needles: $scope.PreOpObj.NeedleSize,//Size of the canula 
                            fluids: $scope.PreOpObj.IVFluidsArray,//Iv Fluids
                            Type: $scope.PreOpObj.IVSiteFluidsArray,//Type
                            flushes: $scope.PreOpObj.IVSiteFlushArray,//Volume
                            staff: $scope.ReviewedByArray//User
                        });
                    }
                }

               

                if (OldDescription || NewDescription) {
                    let obj = {
                        LogId: 0,
                        ModuleId: 2,
                        ModuleName: "ASC",
                        SubModuleId: 40,
                        SubModuleName: "All Orders",
                        ScreenType: "IV Access",
                        ActionType: ActionType,
                        OldActionDescription: OldDescription,
                        NewActionDescription: NewDescription,
                        ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }


            if (Param.IsVeinOpened != null || $scope.LogObj.IsVeinOpened != null) {
                let ActionType = '';
                let OldAffecteditem = '';
                let Affecteditem = '';
                if ($scope.LogObj.IsVeinOpened == null) {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }
                let count = 0;
                if (Param.IsVeinOpened != $scope.LogObj.IsVeinOpened) {
                    count++
                    if (Param.IsVeinOpened != null) {
                        Affecteditem = "Is Vein Opened: " + (Param.IsVeinOpened ? "Yes" : "No");
                    }
                    if ($scope.LogObj.IsVeinOpened != null) {
                        OldAffecteditem = "Is Vein Opened: " + ($scope.LogObj.IsVeinOpened ? "Yes" : "No");
                    }
                }
                if (count != 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 40,
                        "SubModuleName": "All Orders",
                        "ScreenType": "Is Vein Opened",
                        "ActionType": ActionType,
                        "OldActionDescription": OldAffecteditem,
                        "NewActionDescription": Affecteditem,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            //if (Param.OrderDetails.length > 0 || $scope.PreOpAndDialationMedications.PreOpAnesthesiaChartStatus != '') {
            //    Param.PreOpAnesthesiaChartStatus = "D";
            //}





            //if (type == 'DilationMedications') {
            //    var i = 0;
            //    angular.forEach($scope.PreOpAndDialationMedications.DilationMedications, function (item) {

            //        if (item.DropTimings.length > 0) {
            //            let tempArray = $filter('filter')(item.DropTimings, { 'GivenBy': null }, true);
            //            if (tempArray.length > 0) {
            //                i++
            //            }
            //        }

            //    });
            //    if (i !== 0) {
            //        alertify.error("Plese select Givenby for Medications!");
            //        return false;
            //    }
            //    let dilationmedications = [];
            //    if ($scope.PreOpAndDialationMedications.DilationMedications.length > 0) {
            //        angular.forEach($scope.PreOpAndDialationMedications.DilationMedications, function (item) {
            //            item.UserType = "Anesthesia";
            //            dilationmedications.push(item);
            //        });
            //    }
            //}

            //Param.DilationMedications = dilationmedications || [];
            //if (Param.DilationMedications.length > 0 || $scope.PreOpAndDialationMedications.PreOpNurseChartStatus != '') {
            //    Param.PreOpNurseChartStatus = "D";
            //}

            //Param.PreOpMedications = preopmedications || [];
            //if (Param.PreOpMedications.length > 0 || $scope.PreOpAndDialationMedications.PreOpAnesthesiaChartStatus != '') {
            //    Param.PreOpAnesthesiaChartStatus = "D";
            //}
            if ($scope.LogObj.LogArray.length > 0) {
                Param.Logs = $scope.LogObj || {};
            }
            //if ($scope.cacheStorageItem.CheckinStatusId == 1) {
            //    Param.PreOpNurseChartStatus = '';
            //    Param.PreOpAnesthesiaChartStatus = '';
            //}
            if ($scope.cacheStorageItem.AdmissionId == 0) {
                Param.PreOpNurseChartStatus = '';
                Param.PreOpAnesthesiaChartStatus = '';
            }
            $scope.PreOpObj.IsClickSavePreOpNurse = true;
            eHnoteConditionsDataService.AddUpdatePreOpAndDialationMedications(Param).then(function (resp) {
                if (resp.data.Status == "Success") {
                    alertify.success("Medications Successfully Added");
                    $scope.PreOpAndDialationMedications.PatientASCPreOPId = resp.data.PatientASCPreOPId || 0;
                    $scope.init();
                    $scope.PreOpObj.IsClickSavePreOpNurse = false;
                   // $scope.uibclose();
            
                }
            });
        }

        $scope.ClickIntraopOrderTemplate = {
            templateUrl: 'AddIntraopOrderTemplate.html',
        };
        $scope.ClickAnesthesiaOrderTemplate = {
            templateUrl: 'AddAnesthesiaOrderTemplate.html',
        };
        $scope.IsOpenOrderPopup = function () {
            $scope.PreOpTemplateobj.IsOpenOrderTemplate = !$scope.PreOpTemplateobj.IsOpenOrderTemplate;
        }
        $scope.IsIntraopOpenOrderPopup = function () {
            $scope.IntraOpTemplateobj.IsOpenIntraopOrderTemplate = !$scope.IntraOpTemplateobj.IsOpenIntraopOrderTemplate;
        }
        $scope.IsIntraAnesthesiaOpenOrderPopup = function () {
            $scope.IntraOpTemplateobj.IsOpenOrderTemplate = !$scope.IntraOpTemplateobj.IsOpenOrderTemplate;
        }
        $scope.ClickOrderTemplate = {
            templateUrl: 'AddOrderTemplate.html',
        };
        $scope.ClickPostopOrderTemplate = {
            templateUrl: 'AddPostopOrderTemplate.html',
        };
        $scope.ClickPostOpAnesthesiaOrderTemplate = {
            templateUrl: 'AddPostOpAnesthesiaOrderTemplate.html',
        };
        $scope.IsOpenPreopOrderPopup = function () {
            $scope.PreOpTemplateobj.IsOpenPreopOrderTemplate = !$scope.PreOpTemplateobj.IsOpenPreopOrderTemplate;
        }
        $scope.ClickPreopOrderTemplate = {
            templateUrl: 'AddPreopOrderTemplate.html',
        };
        $scope.GetOrderTemplates = function () {

            let req = {
                "HospitalId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "ScreenTypeId": 0,
                "PageSize": 100,
                "SearchText": '',
                "PageNumber": 1,

            };
            eHnoteSurgeryService.GetAscUserOrderTemplates(req).then(function (resp) {
                if (resp.data.Status === "Success") {
                    $scope.UserOrderList = resp.data.rows || [];
                }

            }, function (err) {
                console.log(err);
            });
        };


     $scope.AddUpdateOrderTemplate = function (medtype) {
         $scope.LogObj.LogArray = [];
         var ActionName = '';
            if (medtype == 1) {
                var MedTypeName = 'PreOP Medication';
                ActionName = 'Pre-OP-Anesthesia';
            }
         
            else {
                var MedTypeName = 'Dilation Medication';
                ActionName = 'Pre-OP-Nurse';
            }

            if ($scope.PreOpTemplateobj.TemplateName == '') {
                alertify.error("Please enter template name!");
                return false;
            }

         let templateReq = {
             "UserId": $scope.UserId || "",
             "HospitalId": $scope.HospitalId || "",
             "RoleId": $scope.RoleId || null,
             "TemplateId": 0,
             "TemplateName": $scope.PreOpTemplateobj.TemplateName || "",
             "DeleteInd": "N",
             "ScreenType": "Pre-OP",
             "ScreenTypeId": 4,
             "MedTypeId": medtype,
             "MedTypeName": MedTypeName,
             "DilationMedications": [],
             "GeneralOrders": [],
             "Logs": {},
             "PreOpMedications": [],
             "PostOpMedications": [],
            };



            let FinalOrderDetails = [];
            if (medtype == 1) {
                FinalOrderDetails = $filter('filter')(angular.copy($scope.PreOpObj.OrderDetails), { 'MedTypeId': 1 }, true) || [];
                var count = 0
                angular.forEach(FinalOrderDetails, function (Mitem) {
                    let templist = $filter("filter")(Mitem.PreOpMedications, { "DeleteInd": 'N' }, true) || [];
                    let templist1 = $filter("filter")(Mitem.GeneralOrders, { "DeleteInd": 'N' }, true) || [];
                    if (templist.length !== 0 || templist1.length !== 0) {
                        count++;
                    }
                });
                if (count == 0) {
                    alertify.error("Please add any orders data!");
                    return false;
                }
                if (FinalOrderDetails.length > 0) {
                    angular.forEach(FinalOrderDetails, function (Mitem) {
                        if (Mitem.PreOpMedications.length > 0) {
                            angular.forEach(Mitem.PreOpMedications, function (item) {
                                item.IsPreOPMed = true;
                                item.UserType = "Nurse";
                                item.DropTimings = [];
                                if (item.DeleteInd == 'N') {
                                    templateReq.PreOpMedications.push(item);
                                }

                            });
                        }
                        if (Mitem.GeneralOrders.length > 0) {
                            angular.forEach(Mitem.GeneralOrders, function (item) {
                                if (item.DeleteInd == 'N') {
                                    templateReq.GeneralOrders.push(item);
                                }
                            });
                           // templateReq.GeneralOrders = Mitem.GeneralOrders || [];
                        }
                    });
                }
            }
            else {
                FinalOrderDetails = $filter('filter')(angular.copy($scope.PreOpObj.OrderDetails), { 'MedTypeId': 2 }, true) || [];
                var count = 0
                angular.forEach(FinalOrderDetails, function (Mitem) {
                    let templist = $filter("filter")(Mitem.DilationMedications, { "DeleteInd": 'N' }, true) || [];
                    let templist1 = $filter("filter")(Mitem.GeneralOrders, { "DeleteInd": 'N' }, true) || [];
                    if (templist.length !== 0 || templist1.length !== 0) {
                        count++;
                    }
                });
                if (count == 0) {
                    alertify.error("Please add any orders data!");
                    return false;
                }
                if (FinalOrderDetails.length > 0) {
                    angular.forEach(FinalOrderDetails, function (Mitem) {
                        if (Mitem.DilationMedications.length > 0) {
                            angular.forEach(Mitem.DilationMedications, function (item) {
                                item.IsPreOPMed = true;
                                item.UserType = "Nurse";
                                item.DropTimings = [];
                                if (item.DeleteInd == 'N') {
                                    templateReq.DilationMedications.push(item);
                                }

                            });
                        }
                        if (Mitem.GeneralOrders.length > 0) {
                            angular.forEach(Mitem.GeneralOrders, function (item) {
                                if (item.DeleteInd == 'N') {
                                    templateReq.GeneralOrders.push(item);
                                }
                            });
                            //templateReq.GeneralOrders = Mitem.GeneralOrders || [];
                        }
                    });
                }
            }
            //console.log(JSON.stringify(templateReq));
            //return false;
            if ($scope.PreOpObj.OrderDetails.length > 0) {
                let description = '';   
                $scope.PreOpTemplateobj.TemplateName = $scope.PreOpTemplateobj.TemplateName || '';
                if ($scope.PreOpTemplateobj.TemplateName && $scope.PreOpTemplateobj.TemplateName !== '') {
                    description += `Template Name: ${$scope.PreOpTemplateobj.TemplateName}\n`;
                }


                if (medtype === 2) {
                    var FinalOrderDetails2 = [];
                    FinalOrderDetails2 = $filter('filter')(angular.copy($scope.PreOpObj.OrderDetails), { 'MedTypeId': 2 }, true) || [];
                 
                    angular.forEach(FinalOrderDetails2, function (item) {                      
                        if (item.DilationMedications && item.DilationMedications.length > 0) {
                            angular.forEach(item.DilationMedications, function (kitem) {
                                let timingDescriptions = [];
                                if (kitem.DropTimings && kitem.DropTimings.length > 0) {
                                    angular.forEach(kitem.DropTimings, function (dt) {
                                        let medicationTime = dt.MedicationTime || '';
                                        let givenById = dt.GivenBy || '';
                                        let medicationDosage = dt.MedicationDosage || '';
                                        let Remarks = dt.Remarks || '';

                                        let givenByUser = '';
                                        if (givenById) {
                                            let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                                            if (user) givenByUser = user.FullName;
                                        }

                                        let parts = [];

                                        if (medicationDosage) {
                                            parts.push(`Dosage: ${medicationDosage}`);
                                        }
                                        if (medicationTime) {
                                            parts.push(`Medication Time: ${medicationTime}`);
                                        }
                                        if (givenByUser) {
                                            parts.push(`Given By: ${givenByUser}`);
                                        }
                                        if (Remarks) {
                                            parts.push(`Notes: ${Remarks}`);
                                        }

                                        let timingDescription = parts.join('\n');
                                        timingDescriptions.push(timingDescription);
                                    });
                                }
                                let parts = [];

                                if (kitem.MedicationName) parts.push(`Medicine Name:-- ${kitem.MedicationName}`);
                                if (kitem.Action) parts.push(`Action: ${kitem.Action}`);
                                if (kitem.Dose) parts.push(`Dose: ${kitem.Dose}`);
                                if (kitem.DoseUnit) parts.push(`Dose Unit: ${kitem.DoseUnit}`);
                                if (kitem.Route) parts.push(`Route: ${kitem.Route}`);
                                if (kitem.Frequency) parts.push(`Frequency: ${kitem.Frequency}`);
                                if (kitem.maxDose) parts.push(`Max Dose: ${kitem.maxDose}`);
                                if (kitem.MedicationNotes) parts.push(`Notes: ${kitem.MedicationNotes}`);

                                if (timingDescriptions && timingDescriptions.length > 0) {
                                    parts.push(timingDescriptions.join(', '));
                                }

                                description += parts.join(', ') + '\n';

                            });
                        }


                        if (item.GeneralOrders && item.GeneralOrders.length > 0) {
                            angular.forEach(item.GeneralOrders, function (sitem) {
                                description += `Custom Order - "${sitem.MedicineName}"\n`;
                            });

                        }
                    });

                } else {

                    var FinalOrderDetails1 = [];
                    FinalOrderDetails1 = $filter('filter')(angular.copy($scope.PreOpObj.OrderDetails), { 'MedTypeId': 1 }, true) || [];
                    angular.forEach(FinalOrderDetails1, function (item) {
                       
                        if (item.PreOpMedications && item.PreOpMedications.length > 0) {
                            angular.forEach(item.PreOpMedications, function (kitem) {
                                let timingDescriptions = [];
                                if (kitem.DropTimings && kitem.DropTimings.length > 0) {
                                    angular.forEach(kitem.DropTimings, function (dt) {
                                        let medicationTime = dt.MedicationTime || '';
                                        let givenById = dt.GivenBy || '';
                                        let medicationDosage = dt.MedicationDosage || '';
                                        let Remarks = dt.Remarks || '';

                                        let givenByUser = '';
                                        if (givenById) {
                                            let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                                            if (user) givenByUser = user.FullName;
                                        }

                                        let parts = [];

                                        if (medicationDosage) {
                                            parts.push(`Dosage: ${medicationDosage}`);
                                        }
                                        if (medicationTime) {
                                            parts.push(`Medication Time: ${medicationTime}`);
                                        }
                                        if (givenByUser) {
                                            parts.push(`Given By: ${givenByUser}`);
                                        }
                                        if (Remarks) {
                                            parts.push(`Notes: ${Remarks}`);
                                        }

                                        let timingDescription = parts.join('\n');
                                        timingDescriptions.push(timingDescription);
                                    });
                                }
                                let parts = [];

                                if (kitem.MedicationName) parts.push(`Medicine Name:-- ${kitem.MedicationName}`);
                                if (kitem.Action) parts.push(`Action: ${kitem.Action}`);
                                if (kitem.Dose) parts.push(`Dose: ${kitem.Dose}`);
                                if (kitem.DoseUnit) parts.push(`Dose Unit: ${kitem.DoseUnit}`);
                                if (kitem.Route) parts.push(`Route: ${kitem.Route}`);
                                if (kitem.Frequency) parts.push(`Frequency: ${kitem.Frequency}`);
                                if (kitem.maxDose) parts.push(`Max Dose: ${kitem.maxDose}`);
                                if (kitem.MedicationNotes) parts.push(`Notes: ${kitem.MedicationNotes}`);

                                if (timingDescriptions && timingDescriptions.length > 0) {
                                    parts.push(timingDescriptions.join(', '));
                                }

                                description += parts.join(', ') + '\n';

                            });
                        }
                        if (item.GeneralOrders && item.GeneralOrders.length > 0) {
                            angular.forEach(item.GeneralOrders, function (sitem) {
                                description += `Custom Order - "${sitem.MedicineName}"\n`;

                            });
                        }
                    });
                }

                if (description) {
                    let obj = {
                        LogId: 0,
                        ModuleId: 2,
                        ModuleName: "ASC",
                        SubModuleId: 40,
                        SubModuleName: "All Orders",
                        ScreenType: ActionName,
                        ActionType: "Added",
                        OldActionDescription: "",
                        NewActionDescription: description.trim(),
                        ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }

            }

            if ($scope.LogObj.LogArray.length > 0) {
                templateReq.Logs = $scope.LogObj || {};
            }

            eHnoteSurgeryService.AddUpdateAscUserOrderTemplates(templateReq).then(function (resp) {
                if (resp.data.status === "Success") {
                    alertify.success("Template saved successfully!");
                    $scope.GetOrderTemplates();
                    if (medtype == 1) {
                        $scope.PreOpTemplateobj.IsOpenPreopOrderTemplate = false;
                        $scope.PreOpTemplateobj.TemplateName = '';
                    }
                    else {
                        $scope.PreOpTemplateobj.IsOpenOrderTemplate = false;
                        $scope.PreOpTemplateobj.TemplateName = '';
                    }
                }
                if (resp.data.status === "Failure") {
                    alertify.error('TemplateName Already Exists')
                }
            }, function (err) {
                console.log(err);
            });

        };


        $scope.OnSelectOrderTemplate = function (Mainitem, medtype) {
            console.log(Mainitem);
            if (medtype == 1) {

                //let templist = $filter("filter")($scope.PreOpObj.OrderDetails, { "MedTypeId": 1, 'IsOrderReviewed': false, 'DeleteInd': 'N' }, true);
                let templist = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                    return oitem.MedTypeId === 1 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                }) || [];
                if (templist.length > 0) {
                    if (Mainitem.PreOpMedications.length > 0) {

                        angular.forEach(Mainitem.PreOpMedications, function (item) {
                            var i = 0;
                            angular.forEach($scope.PreOpObj.OrderDetails, function (mitem) {

                                angular.forEach(mitem.PreOpMedications, function (citem) {
                                    if (citem.MedicineId == item.MedicineId && citem.DeleteInd == "N") {
                                        i++
                                    }
                                });

                            });
                            if (i == 0) {
                                let List1 = $filter("filter")(templist[0].PreOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                                let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                                //if (List.length > 0) {
                                //    alertify.error("Medicine name already added!");
                                //    $scope.PostOpMedicationObj.MedicineObject = '';
                                //    return false;
                                //}
                                if (List.length == 0) {
                                    let GivenBy = null;
                                    let loggedUser = $filter('filter')($scope.MedicationGivenBy, { 'DoctorID': $scope.UserId }, true) || [];
                                    if (loggedUser.length > 0) {
                                        GivenBy = loggedUser[0].DoctorID;
                                    }


                                    var obj = {
                                        "AscMedicationId": 0,
                                        "OrganizationMedicationId": item.OrganizationPrescriptionId,
                                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                                        "ParentOrganizationId": $scope.ParenthospitalId,
                                        "ASCOrganizationMedicationId": 0,
                                        "Strength": item.Strength || '',
                                        "IsFrequent": item.IsFrequent || 'N',
                                        "MedicineId": item.MedicineId,
                                        "MedicationName": item.MedicationName,
                                        "IsChecked": false,
                                        "IsDilationMed": false,
                                        "IsIntraAnesthesiaMed": false,
                                        "IsIntraMed": false,
                                        "IsPreOPMed": false,
                                        "MedicationDosage": "",
                                        "DropTimings": [],
                                        //"DropTimings": [{
                                        //    "DropTimingId": 0,
                                        //    "MedicineId": item.MedicineId,
                                        //    "MedicationName": item.MedicationName,
                                        //    "GivenBy": GivenBy || null,
                                        //    "shownotes": false,
                                        //    "IsEditDrop": false,
                                        //    "IsEditview": false,
                                        //    "Remarks": "",
                                        //    "DeleteInd": "N",
                                        //    "MedicationTime": "",
                                        //    "MedicationDosage": ""
                                        //}],
                                        "TypeId": 4,
                                        "DeleteInd": "N",

                                        "Action": item.Action,
                                        "Dose": item.Dose,
                                        "DoseUnit": item.DoseUnit,
                                        "Route": item.Route,
                                        "Frequency": item.Frequency,
                                        "ActionId": item.ActionId,
                                        "DoseId": item.DoseId,
                                        "DoseUnitId": item.DoseUnitId,
                                        "RouteId": item.RouteId,
                                        "FrequencyId": item.FrequencyId,
                                        "OrderDescription": item.OrderDescription,
                                        "MedicationNotes": item.MedicationNotes,
                                        "maxDose": item.maxDose,
                                        "OrderTypeId": item.OrderTypeId,
                                        "OrderTypeName": item.OrderTypeName
                                    }
                                    templist[0].PreOpMedications.push(obj);
                                    $scope.DilationMedicationObj.MedicineObject = "";
                                }
                            }
                        });
                    }
                    if (Mainitem.GeneralOrders.length > 0) {

                        angular.forEach(Mainitem.GeneralOrders, function (item) {
                            var j = 0;
                            angular.forEach($scope.PreOpObj.OrderDetails, function (mitem) {

                                angular.forEach(mitem.GeneralOrders, function (citem) {
                                    if (citem.MedicineName == item.MedicineName && citem.DeleteInd == "N") {
                                        j++
                                    }
                                });

                            });
                            if (j == 0) {
                                let Gobj = {
                                    "GeneralOrderId": null,
                                    "MedicineName": item.MedicineName || '',
                                    "DeleteInd": "N",
                                    "Status": "",

                                }
                                templist[0].GeneralOrders.push(Gobj);
                            }
                        });
                    }




                }
                else {

                    //let templist2 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                    let templist2 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist2.length > 0) {
                        templist2[0].MedTypeId = 1;
                        templist2[0].MedTypeName = 'PreOP Medication';
                        templist2[0].UserType = 'Anesthesia';
                    } else {
                        //let templist3 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 1, 'DeleteInd': 'N' }, true) || [];
                        let templist3 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                            return oitem.MedTypeId === 1 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                        }) || [];
                        if (templist3.length > 0) {

                        } else {
                            var obj = {
                                "UserOrderId": 0,
                                "UserId": $scope.UserId,
                                "DeleteInd": "N",
                                "ReviewedBy": null,
                                "UserType": "Anesthesia",
                                "ScreenType": "Pre-Op",
                                "ScreenTypeId": 4,
                                "MedTypeId": 1,
                                "MedTypeName": 'PreOP Medication',
                                "PreOpMedications": [],
                                "GeneralOrders": [],
                                "DilationMedications": [],
                                "OrderTypeId": OrderTypeId || 1,
                                "OrderTypeName": OrderTypeName || "Standing Medications(Pre Surgery)",
                                "IsOrderReviewed":false
                            }
                            $scope.PreOpObj.OrderDetails.push(obj);
                        }

                    }
                    //let templist1 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 1, 'DeleteInd': 'N' }, true) || [];
                    let templist1 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === 1 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist1.length > 0) {

                        if (Mainitem.PreOpMedications.length > 0) {
                            angular.forEach(Mainitem.PreOpMedications, function (item) {
                                var i = 0;
                                angular.forEach($scope.PreOpObj.OrderDetails, function (mitem) {

                                    angular.forEach(mitem.PreOpMedications, function (citem) {
                                        if (citem.MedicineId == item.MedicineId && citem.DeleteInd == "N") {
                                            i++
                                        }
                                    });

                                });
                                if (i == 0) {
                                    let List = $filter("filter")(templist1[0].PreOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId, 'DeleteInd': 'N' }, true) || [];
                                    //let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                                    //if (List.length > 0) {
                                    //    alertify.error("Medicine name already added!");
                                    //    $scope.PostOpMedicationObj.MedicineObject = "";
                                    //    return false;
                                    //}

                                    if (List.length == 0) {
                                        let GivenBy = null;
                                        let loggedUser = $filter('filter')($scope.MedicationGivenBy, { 'DoctorID': $scope.UserId }, true) || [];
                                        if (loggedUser.length > 0) {
                                            GivenBy = loggedUser[0].DoctorID;
                                        }


                                        var obj = {
                                            "AscMedicationId": 0,
                                            "OrganizationMedicationId": item.OrganizationPrescriptionId,
                                            "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                                            "ParentOrganizationId": $scope.ParenthospitalId,
                                            "ASCOrganizationMedicationId": 0,
                                            "Strength": item.Strength || '',
                                            "IsFrequent": item.IsFrequent || 'N',
                                            "MedicineId": item.MedicineId,
                                            "MedicationName": item.MedicationName,
                                            "IsChecked": false,
                                            "IsDilationMed": false,
                                            "IsIntraAnesthesiaMed": false,
                                            "IsIntraMed": false,
                                            "IsPreOPMed": false,
                                            "MedicationDosage": "",
                                            "DropTimings": [],
                                            //"DropTimings": [{
                                            //    "DropTimingId": 0,
                                            //    "MedicineId": item.MedicineId,
                                            //    "MedicationName": item.MedicationName,
                                            //    "GivenBy": GivenBy || null,
                                            //    "shownotes": false,
                                            //    "IsEditDrop": false,
                                            //    "IsEditview": false,
                                            //    "Remarks": "",
                                            //    "DeleteInd": "N",
                                            //    "MedicationTime": "",
                                            //    "MedicationDosage": ""
                                            //}],
                                            "TypeId": 4,
                                            "DeleteInd": "N",

                                            "Action": item.Action,
                                            "Dose": item.Dose,
                                            "DoseUnit": item.DoseUnit,
                                            "Route": item.Route,
                                            "Frequency": item.Frequency,
                                            "ActionId": item.ActionId,
                                            "DoseId": item.DoseId,
                                            "DoseUnitId": item.DoseUnitId,
                                            "RouteId": item.RouteId,
                                            "FrequencyId": item.FrequencyId,
                                            "OrderDescription": item.OrderDescription,
                                            "MedicationNotes": item.MedicationNotes,
                                            "maxDose": item.maxDose,
                                            "OrderTypeId": item.OrderTypeId,
                                            "OrderTypeName": item.OrderTypeName
                                        }
                                        templist1[0].PreOpMedications.push(obj);
                                        $scope.PreOpMedicationObj.MedicineObject = "";
                                    }
                                }
                            });
                        }
                        if (Mainitem.GeneralOrders.length > 0) {
                            angular.forEach(Mainitem.GeneralOrders, function (item) {
                                var j = 0;
                                angular.forEach($scope.PreOpObj.OrderDetails, function (mitem) {

                                    angular.forEach(mitem.GeneralOrders, function (citem) {
                                        if (citem.MedicineName == item.MedicineName && citem.DeleteInd == "N") {
                                            j++
                                        }
                                    });

                                });
                                if (j == 0) {
                                    let Gobj = {
                                        "GeneralOrderId": null,
                                        "MedicineName": item.MedicineName || '',
                                        "DeleteInd": "N",
                                        "Status": "",

                                    }
                                    templist1[0].GeneralOrders.push(Gobj);
                                    //$scope.PostOpMedicationObj.OrderName = "";
                                }
                            });
                        }
                    }


                }

                let activeOrders = ($scope.PreOpObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 1);

                let isColumnTrue = activeOrders.some(order =>
                    (order.PreOpMedications &&
                        order.PreOpMedications.some(item => item.DeleteInd === 'N'))
                );

                if (isColumnTrue) {
                    $scope.PreOpObj.DisableAnesthesiaOrdersCheck = isColumnTrue;
                    $scope.PreOpObj.IsAnesthesiaOrdersTimeChecked = !isColumnTrue;
                }
                
            }
            else {
                //let templist = $filter("filter")($scope.PreOpObj.OrderDetails, { "MedTypeId": 2, 'IsOrderReviewed': false, 'DeleteInd': 'N'  }, true);
                let templist = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                    return oitem.MedTypeId === 2 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                }) || [];
                if (templist.length > 0) {
                    if (Mainitem.DilationMedications.length > 0) {
                        angular.forEach(Mainitem.DilationMedications, function (item) {
                            var i = 0;
                            angular.forEach($scope.PreOpObj.OrderDetails, function (mitem) {

                                angular.forEach(mitem.DilationMedications, function (citem) {
                                    if (citem.MedicineId == item.MedicineId && citem.DeleteInd == "N") {
                                        i++
                                    }
                                });

                            });
                            if (i == 0) {
                                let List1 = $filter("filter")(templist[0].DilationMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                                let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                                //if (List.length > 0) {
                                //    alertify.error("Medicine name already added!");
                                //    $scope.PostOpMedicationObj.MedicineObject = '';
                                //    return false;
                                //}
                                if (List.length == 0) {
                                    let GivenBy = null;
                                    let loggedUser = $filter('filter')($scope.MedicationGivenByNurseArray, { 'DoctorID': $scope.UserId }, true) || [];
                                    if (loggedUser.length > 0) {
                                        GivenBy = loggedUser[0].DoctorID;
                                    }


                                    var obj = {
                                        "AscMedicationId": 0,
                                        "OrganizationMedicationId": item.OrganizationPrescriptionId,
                                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                                        "ParentOrganizationId": $scope.ParenthospitalId,
                                        "ASCOrganizationMedicationId": 0,
                                        "Strength": item.Strength || '',
                                        "IsFrequent": item.IsFrequent || 'N',
                                        "MedicineId": item.MedicineId,
                                        "MedicationName": item.MedicationName,
                                        "IsChecked": false,
                                        "IsDilationMed": false,
                                        "IsIntraAnesthesiaMed": false,
                                        "IsIntraMed": false,
                                        "IsPreOPMed": false,
                                        "MedicationDosage": "",
                                        "DropTimings": [],
                                        //"DropTimings": [{
                                        //    "DropTimingId": 0,
                                        //    "MedicineId": item.MedicineId,
                                        //    "MedicationName": item.MedicationName,
                                        //    "GivenBy": GivenBy || null,
                                        //    "shownotes": false,
                                        //    "IsEditDrop": false,
                                        //    "IsEditview": false,
                                        //    "Remarks": "",
                                        //    "DeleteInd": "N",
                                        //    "MedicationTime": "",
                                        //    "MedicationDosage": ""
                                        //}],
                                        "TypeId": 4,
                                        "DeleteInd": "N",

                                        "Action": item.Action,
                                        "Dose": item.Dose,
                                        "DoseUnit": item.DoseUnit,
                                        "Route": item.Route,
                                        "Frequency": item.Frequency,
                                        "ActionId": item.ActionId,
                                        "DoseId": item.DoseId,
                                        "DoseUnitId": item.DoseUnitId,
                                        "RouteId": item.RouteId,
                                        "FrequencyId": item.FrequencyId,
                                        "OrderDescription": item.OrderDescription,
                                        "MedicationNotes": item.MedicationNotes,
                                        "maxDose": item.maxDose,
                                        "OrderTypeId": item.OrderTypeId,
                                        "OrderTypeName": item.OrderTypeName
                                    }
                                    templist[0].DilationMedications.push(obj);
                                    $scope.PreOpMedicationObj.MedicineObject = "";
                                }
                            }
                        });
                    }
                    if (Mainitem.GeneralOrders.length > 0) {
                        angular.forEach(Mainitem.GeneralOrders, function (item) {
                            var j = 0;
                            angular.forEach($scope.PreOpObj.OrderDetails, function (mitem) {

                                angular.forEach(mitem.GeneralOrders, function (citem) {
                                    if (citem.MedicineName == item.MedicineName && citem.DeleteInd == "N") {
                                        j++
                                    }
                                });

                            });
                            if (j == 0) {
                                let Gobj = {
                                    "GeneralOrderId": null,
                                    "MedicineName": item.MedicineName || '',
                                    "DeleteInd": "N",
                                    "Status": "",

                                }
                                templist[0].GeneralOrders.push(Gobj);
                            }
                        });
                    }




                }
                else {

                    //let templist2 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                    let templist2 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist2.length > 0) {
                        templist2[0].MedTypeId = 2;
                        templist2[0].MedTypeName = 'Dilation Medication';
                    } else {
                        //let templist3 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 2, 'DeleteInd': 'N' }, true) || [];
                        let templist3 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                            return oitem.MedTypeId === 2 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                        }) || [];
                        if (templist3.length > 0) {

                        } else {
                            var obj = {
                                "UserOrderId": 0,
                                "UserId": $scope.UserId,
                                "DeleteInd": "N",
                                "ReviewedBy": null,
                                "UserType": "Nurse",
                                "ScreenType": "Pre-Op",
                                "ScreenTypeId": 4,
                                "MedTypeId": 2,
                                "MedTypeName": 'Dilation Medication',
                                "DilationMedications": [],
                                "PreOpMedications": [],
                                "GeneralOrders": [],
                                "OrderTypeId": OrderTypeId || 1,
                                "OrderTypeName": OrderTypeName || "Standing Medications(Pre Surgery)",
                                "IsOrderReviewed":false
                            }
                            $scope.PreOpObj.OrderDetails.push(obj);
                        }

                    }
                    //let templist1 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 2, 'DeleteInd': 'N' }, true) || [];
                    let templist1 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === 2 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist1.length > 0) {

                        if (Mainitem.DilationMedications.length > 0) {
                            angular.forEach(Mainitem.DilationMedications, function (item) {
                                var i = 0;
                                angular.forEach($scope.PreOpObj.OrderDetails, function (mitem) {

                                    angular.forEach(mitem.DilationMedications, function (citem) {
                                        if (citem.MedicineId == item.MedicineId && citem.DeleteInd == "N") {
                                            i++
                                        }
                                    });

                                });
                                if (i == 0) {
                                    let List = $filter("filter")(templist1[0].DilationMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId, 'DeleteInd': 'N' }, true) || [];
                                    //let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                                    //if (List.length > 0) {
                                    //    alertify.error("Medicine name already added!");
                                    //    $scope.PostOpMedicationObj.MedicineObject = "";
                                    //    return false;
                                    //}

                                    if (List.length == 0) {
                                        let GivenBy = null;
                                        let loggedUser = $filter('filter')($scope.MedicationGivenByNurseArray, { 'DoctorID': $scope.UserId }, true) || [];
                                        if (loggedUser.length > 0) {
                                            GivenBy = loggedUser[0].DoctorID;
                                        }


                                        var obj = {
                                            "AscMedicationId": 0,
                                            "OrganizationMedicationId": item.OrganizationPrescriptionId,
                                            "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                                            "ParentOrganizationId": $scope.ParenthospitalId,
                                            "ASCOrganizationMedicationId": 0,
                                            "Strength": item.Strength || '',
                                            "IsFrequent": item.IsFrequent || 'N',
                                            "MedicineId": item.MedicineId,
                                            "MedicationName": item.MedicationName,
                                            "IsChecked": false,
                                            "IsDilationMed": false,
                                            "IsIntraAnesthesiaMed": false,
                                            "IsIntraMed": false,
                                            "IsPreOPMed": false,
                                            "MedicationDosage": "",
                                            "DropTimings": [],
                                            //"DropTimings": [{
                                            //    "DropTimingId": 0,
                                            //    "MedicineId": item.MedicineId,
                                            //    "MedicationName": item.MedicationName,
                                            //    "GivenBy": GivenBy || null,
                                            //    "shownotes": false,
                                            //    "IsEditDrop": false,
                                            //    "IsEditview": false,
                                            //    "Remarks": "",
                                            //    "DeleteInd": "N",
                                            //    "MedicationTime": "",
                                            //    "MedicationDosage": ""
                                            //}],
                                            "TypeId": 4,
                                            "DeleteInd": "N",

                                            "Action": item.Action,
                                            "Dose": item.Dose,
                                            "DoseUnit": item.DoseUnit,
                                            "Route": item.Route,
                                            "Frequency": item.Frequency,
                                            "ActionId": item.ActionId,
                                            "DoseId": item.DoseId,
                                            "DoseUnitId": item.DoseUnitId,
                                            "RouteId": item.RouteId,
                                            "FrequencyId": item.FrequencyId,
                                            "OrderDescription": item.OrderDescription,
                                            "MedicationNotes": item.MedicationNotes,
                                            "maxDose": item.maxDose,
                                            "OrderTypeId": item.OrderTypeId,
                                            "OrderTypeName": item.OrderTypeName
                                        }
                                        templist1[0].DilationMedications.push(obj);
                                        $scope.DilationMedicationObj.MedicineObject = "";
                                    }
                                }
                            });
                        }
                        if (Mainitem.GeneralOrders.length > 0) {
                            angular.forEach(Mainitem.GeneralOrders, function (item) {
                                var j = 0;
                                angular.forEach($scope.PreOpObj.OrderDetails, function (mitem) {

                                    angular.forEach(mitem.GeneralOrders, function (citem) {
                                        if (citem.MedicineName == item.MedicineName && citem.DeleteInd == "N") {
                                            j++
                                        }
                                    });

                                });
                                if (j == 0) {
                                    let Gobj = {
                                        "GeneralOrderId": null,
                                        "MedicineName": item.MedicineName || '',
                                        "DeleteInd": "N",
                                        "Status": "",

                                    }
                                    templist1[0].GeneralOrders.push(Gobj);
                                    //$scope.PostOpMedicationObj.OrderName = "";
                                }
                            });
                        }
                    }


                }

                let activeOrders = ($scope.PreOpObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 2);

                let isColumnTrue = activeOrders.some(order =>
                    (order.DilationMedications &&
                        order.DilationMedications.some(item => item.DeleteInd === 'N'))
                );
                if (isColumnTrue) {
                    $scope.PreOpObj.DisableSurgeonordersCheck = isColumnTrue;
                    $scope.PreOpObj.IsSurgeonOrdersTimeChecked = !isColumnTrue;
                }
                
            }

        }

        $scope.uibclose = function () {
           // $uibModalInstance.dismiss("cancel");
            $uibModalInstance.close();
        };


        $scope.DeleteDiabetes = function (Aitem) {
            Aitem.DiabetesTimingId = Aitem.DiabetesTimingId || 0;
            var index = $scope.PreOpAndDialationMedications.DiabetesTimings.indexOf(Aitem);
            if (Aitem.DiabetesTimingId != 0) {
                alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {
                    if (index > -1) {
                        Aitem.DeleteInd = 'Y';
                        let tempArray = $filter('filter')($scope.PreOpAndDialationMedications.DiabetesTimings, { 'DeleteInd': 'N' }, true);
                        if (tempArray.length == 0) {
                            $scope.PreOpAndDialationMedications.IsDiabetes = null;
                            if ($scope.PreOpAndDialationMedications.IsHypoglycemiaCheck == true) {
                                $scope.PreOpAndDialationMedications.IsHypoglycemiaCheck = false;
                                $scope.PreOpAndDialationMedications.IsDiabetes = false;
                            }
                        }
                    }
                    $scope.$digest();
                }, function () {

                });

            } else {
                if (index > -1) {
                    $scope.PreOpAndDialationMedications.DiabetesTimings.splice(index, 1);
                    let tempArray = $filter('filter')($scope.PreOpAndDialationMedications.DiabetesTimings, { 'DeleteInd': 'N' }, true);
                    if (tempArray.length == 0) {
                        $scope.PreOpAndDialationMedications.IsDiabetes = null;
                        $scope.PreOpAndDialationMedications.DiabetesTimings.splice(index, 1);
                        if ($scope.PreOpAndDialationMedications.IsHypoglycemiaCheck == true) {
                            $scope.PreOpAndDialationMedications.IsHypoglycemiaCheck = false;
                            $scope.PreOpAndDialationMedications.IsDiabetes = false;
                        }
                    }
                }
            }

        };



     $scope.DeleteDrop = function (item, Aitem, type) {
         //$scope.PreOpObj.DisableSurgeonordersCheck = false;
         //$scope.PreOpObj.IsSurgeonOrdersTimeChecked = false;
         //$scope.PreOpObj.DisableAnesthesiaOrdersCheck = false;
         //$scope.PreOpObj.IsAnesthesiaOrdersTimeChecked = false;
             //$scope.IntraOpObj.IsIntraOpSurgeonOrdersTimeAdded = false,
             //$scope.IntraOpObj.IsIntraOpAnesthesiaOrdersTimeAdded = false,
                 //$scope.IntraOpObj.DisableIntraopAnesthesiaCheck = false,
                 //$scope.IntraOpObj.DisableIntraopSurgeonCheck = false,
                 //$scope.PostOpObj.IsPostOpSurgeonOrdersTimeAdded = false,
                 //$scope.PostOpObj.IsPostOpAnesthesiaOrdersTimeAdded =  false,
                 //$scope.PostOpObj.DisablePostOpAnesthesiaCheck = false,
                 //$scope.PostOpObj.DisablePostOpSurgeonCheck = false,
            Aitem.DropTimingId = Aitem.DropTimingId || 0;
            var index = item.DropTimings.indexOf(Aitem);
            if (Aitem.DropTimingId == 0) {
                if (index > -1) {
                    item.DropTimings.splice(index, 1);
                    if (type == 'PreOpMedications') {
                        var index1 = $scope.PreOpAndDialationMedications.PreOpMedications.indexOf(item);
                        angular.forEach($scope.PreOpAndDialationMedications.PreOpMedications, function (hitem) {
                            if (hitem.MedicineId == item.MedicineId) {
                                let tempArray = $filter('filter')(hitem.DropTimings, { 'DeleteInd': 'N' }, true);
                                if (tempArray.length == 0) {
                                    $scope.PreOpAndDialationMedications.PreOpMedications.splice(index1, 1);
                                }
                            }

                        });

                    }
                    if (type == 'DilationMedications') {
                        var index2 = $scope.PreOpAndDialationMedications.DilationMedications.indexOf(item);
                        angular.forEach($scope.PreOpAndDialationMedications.DilationMedications, function (hitem) {
                            if (hitem.MedicineId == item.MedicineId) {
                                let tempArray = $filter('filter')(hitem.DropTimings, { 'DeleteInd': 'N' }, true);
                                if (tempArray.length == 0) {
                                    $scope.PreOpAndDialationMedications.DilationMedications.splice(index2, 1);
                                }
                            }

                        });

                    }
                }
            } else {
                alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {
                    Aitem.DeleteInd = 'Y';
                    let tempArray = $filter('filter')(item.DropTimings, { 'DeleteInd': 'N' }, true);
                    if (tempArray.length == 0) {
                        item.DeleteInd = 'Y';
                    }
                    $scope.$digest();
                }, function () {

                });
            }


        }

        $scope.stopClosingDropDown = function (event) {
            event.stopPropagation();
        }




        $scope.AddGeneralOrder = function () {
            if ($scope.DilationMedicationObj.OrderName == '') {
                alertify.error("Please Enter General Orders!");
                return false;
            }
            //let templist = $filter("filter")($scope.PreOpObj.OrderDetails, {  "MedTypeId": 2, 'IsOrderReviewed': false  }, true);
            let templist = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                return oitem.MedTypeId === 2 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
            }) || [];
            if (templist.length > 0) {
                let Gobj = {
                    "GeneralOrderId": null,
                    "MedicineName": $scope.DilationMedicationObj.OrderName || '',
                    "DeleteInd": "N",
                    "Status": "",
                    "MedicationTime": "",

                }
                templist[0].GeneralOrders.push(Gobj);
                $scope.DilationMedicationObj.OrderName = "";
            } else {
                //let templist2 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                let templist2 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                    return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                }) || [];
                if (templist2.length > 0) {
                    templist2[0].MedTypeId = 2;
                    templist2[0].MedTypeName = 'Dilation Medication';
                } else {
                    //let templist3 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 2 }, true) || [];
                    let templist3 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === 2 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist3.length > 0) {

                    } else {
                        var obj = {
                            "UserOrderId": 0,
                            "UserId": $scope.UserId,
                            "DeleteInd": "N",
                            "IsOrderReviewed": false,
                            "ReviewedByPassword": '',
                            "ReviewedByDateTime": null,
                            "ReviewedBy": null,
                            "UserType": "Nurse",
                            "ScreenType": "PreOp",
                            "ScreenTypeId": 4,
                            "MedTypeId": 2,
                            "OrderTypeId": OrderTypeId || 1,
                            "OrderTypeName": OrderTypeName || "Standing Medications(Pre Surgery)",
                            "MedTypeName": 'Dilation Medication',
                            "DilationMedications": [],
                            "PreOpMedications": [],
                            "GeneralOrders": [],
                        }
                        $scope.PreOpObj.OrderDetails.push(obj);
                    }

                }


                //let templist1 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 2 }, true) || [];
                let templist1 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                    return oitem.MedTypeId === 2 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                }) || [];

                if (templist1.length > 0) {
                    let Gobj = {
                        "GeneralOrderId": null,
                        "MedicineName": $scope.DilationMedicationObj.OrderName || '',
                        "DeleteInd": "N",
                        "Status": "",
                        "MedicationTime": "",

                    }
                    templist1[0].GeneralOrders.push(Gobj);
                    $scope.DilationMedicationObj.OrderName = "";
                } else {

                }
            }

            let activeOrders = ($scope.PreOpObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 2);

            let isColumnTrue = activeOrders.some(order =>
                (order.DilationMedications &&
                    order.DilationMedications.some(item => item.DeleteInd === 'N'))
            );

            if (isColumnTrue) {
                $scope.PreOpObj.DisableSurgeonordersCheck = isColumnTrue;
                $scope.PreOpObj.IsSurgeonOrdersTimeChecked = !isColumnTrue;
            }
            
        }

        $scope.AddAnesthesiaGeneralOrder = function () {
            if ($scope.PreOpMedicationObj.OrderName == '') {
                alertify.error("Please Enter General Orders!");
                return false;
            }
            //let templist = $filter("filter")($scope.PreOpObj.OrderDetails, { "MedTypeId": 1, 'IsOrderReviewed': false }, true);
            let templist = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                return oitem.MedTypeId === 1 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
            }) || [];
            if (templist.length > 0) {
                let Gobj = {
                    "GeneralOrderId": null,
                    "MedicineName": $scope.PreOpMedicationObj.OrderName || '',
                    "DeleteInd": "N",
                    "Status": "",
                    "MedicationTime": "",
                }
                templist[0].GeneralOrders.push(Gobj);
                $scope.PreOpMedicationObj.OrderName = "";
            } else {
                //let templist2 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                let templist2 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                    return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                }) || [];
                if (templist2.length > 0) {
                    templist2[0].MedTypeId = 1;
                    templist2[0].MedTypeName = 'PreOp Medication';
                    templist2[0].UserType = 'Anesthesia';
                } else {

                    //let templist3 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 1 }, true) || [];
                    let templist3 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === 1 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist3.length > 0) {

                    } else {
                        var obj = {
                            "UserOrderId": 0,
                            "UserId": $scope.UserId,
                            "DeleteInd": "N",
                            "ReviewedBy": null,
                            "IsOrderReviewed": false,
                            "ReviewedByDateTime": null,
                            "ReviewedByPassword": '',
                            "UserType": "Anesthesia",
                            "ScreenType": "PreOp",
                            "ScreenTypeId": 4,
                            "MedTypeId": 1,
                            "MedTypeName": 'PreOp Medication',
                            "DilationMedications": [],
                            "PreOpMedications": [],
                            "GeneralOrders": [],
                            "OrderTypeId": OrderTypeId || 1,
                            "OrderTypeName": OrderTypeName || "Standing Medications(Pre Surgery)",
                        }
                        $scope.PreOpObj.OrderDetails.push(obj);
                    }


                }


                //let templist1 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 1 }, true) || [];
                let templist1 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                    return oitem.MedTypeId === 1 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                }) || [];

                if (templist1.length > 0) {
                    let Gobj = {
                        "GeneralOrderId": null,
                        "MedicineName": $scope.PreOpMedicationObj.OrderName || '',
                        "DeleteInd": "N",
                        "Status": "",
                        "MedicationTime": "",
                    }
                    templist1[0].GeneralOrders.push(Gobj);
                    $scope.PreOpMedicationObj.OrderName = "";
                } else {

                }
            }

            let activeOrders = ($scope.PreOpObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 1);

            let isColumnTrue = activeOrders.some(order =>
                (order.PreOpMedications &&
                    order.PreOpMedications.some(item => item.DeleteInd === 'N'))
            );
            if (isColumnTrue) {
                $scope.PreOpObj.DisableAnesthesiaOrdersCheck = isColumnTrue;
                $scope.PreOpObj.IsAnesthesiaOrdersTimeChecked = !isColumnTrue;
            }
            
        }

     


        //$scope.SelectDialtionMedicationItems1 = function (item, type) {

        //    //let templist = $filter("filter")($scope.PreOpObj.OrderDetails, {  "MedTypeId": 2, 'IsOrderReviewed': false, 'DeleteInd': 'N'}, true);
        //    let templist = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
        //        return oitem.MedTypeId === 2 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
        //    }) || [];
        //    let i = 0;
        //    angular.forEach($scope.PreOpObj.OrderDetails, function (mitem) {
        //        angular.forEach(mitem.DilationMedications, function (Aitem) {
        //            if (Aitem.MedicineId == item.MedicineId  && Aitem.DeleteInd == 'N') {
        //                i++;
        //            }
        //        });
        //    });

        //    if (i > 0) {
        //        alertify.error('You have already entered this Medication');
        //        $scope.DilationMedicationObj.MedicineObject = "";
        //        return false;
        //    }
        //    if (templist.length > 0) {

        //        let List1 = $filter("filter")(templist[0].DilationMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
        //        let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
        //        if (List.length > 0) {
        //            alertify.error("Medicine name already added!");
        //            $scope.DilationMedicationObj.MedicineObject = '';
        //            return false;
        //        }
        //        let GivenBy = null;
        //        let loggedUser = $filter('filter')($scope.MedicationGivenByNurseArray, { 'DoctorID': $scope.UserId }, true) || [];
        //        if (loggedUser.length > 0) {
        //            GivenBy = loggedUser[0].DoctorID;
        //        }

        //        if (type == 'Frequently') {
        //            var obj = {
        //                "AscMedicationId": 0,
        //                "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                "ParentOrganizationId": $scope.ParenthospitalId,
        //                "ASCOrganizationMedicationId": 0,
        //                "Strength": item.Strength || '',
        //                "IsFrequent": item.IsFrequent || 'N',
        //                "MedicineId": item.MedicineId,
        //                "MedicationName": item.MedicationName,
        //                "IsChecked": false,
        //                "IsDilationMed": false,
        //                "IsIntraAnesthesiaMed": false,
        //                "IsIntraMed": false,
        //                "IsPreOPMed": false,
        //                "MedicationDosage": "",
        //                "DropTimings": [],
        //                //"DropTimings": [{
        //                //    "DropTimingId": 0,
        //                //    "MedicineId": item.MedicineId,
        //                //    "MedicationName": item.MedicationName,
        //                //    "GivenBy": GivenBy || null,
        //                //    "shownotes": false,
        //                //    "IsEditDrop": false,
        //                //    "IsEditview": false,
        //                //    "Remarks": "",
        //                //    "DeleteInd": "N",
        //                //    "MedicationTime": "",
        //                //    "MedicationDosage": ""
        //                //}],
        //                "TypeId": 2,
        //                "DeleteInd": "N"
        //            }
        //            templist[0].DilationMedications.push(obj);
        //            $scope.DilationMedicationObj.MedicineObject = "";
        //        } else {
        //            var obj = {
        //                "AscMedicationId": 0,
        //                "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                "ParentOrganizationId": $scope.ParenthospitalId,
        //                "ASCOrganizationMedicationId": 0,
        //                "Strength": item.Strength || '',
        //                "IsFrequent": item.IsFrequent || 'N',
        //                "MedicineId": item.MedicineId,
        //                "MedicationName": item.MedicineName,
        //                "IsChecked": false,
        //                "IsDilationMed": false,
        //                "IsIntraAnesthesiaMed": false,
        //                "IsIntraMed": false,
        //                "IsPreOPMed": false,
        //                "MedicationDosage": "",
        //                "DropTimings": [],
        //                //"DropTimings": [{
        //                //    "DropTimingId": 0,
        //                //    "MedicineId": item.MedicineId,
        //                //    "MedicationName": item.MedicineName,
        //                //    "GivenBy": GivenBy || null,
        //                //    "shownotes": false,
        //                //    "IsEditDrop": false,
        //                //    "IsEditview": false,
        //                //    "Remarks": "",
        //                //    "DeleteInd": "N",
        //                //    "MedicationTime": "",
        //                //    "MedicationDosage": ""
        //                //}],
        //                "TypeId": 2,
        //                "DeleteInd": "N"
        //            }
        //            templist[0].DilationMedications.push(obj);
        //            $scope.DilationMedicationObj.MedicineObject = "";
        //        }




        //    } else {

        //        //let templist2 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
        //        let templist2 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
        //            return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
        //        }) || [];
        //        if (templist2.length > 0) {
        //            templist2[0].MedTypeId = 2;
        //            templist2[0].MedTypeName = 'Dilation Medication';
        //        } else {

        //            //let templist3 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 2, 'DeleteInd': 'N' }, true) || [];
        //            let templist3 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
        //                return oitem.MedTypeId === 2 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
        //            }) || [];
        //            if (templist3.length > 0) {

        //            } else {
        //                var obj = {
        //                    "UserOrderId": 0,
        //                    "UserId": $scope.UserId,
        //                    "DeleteInd": "N",
        //                    "ReviewedBy": null,
        //                    "IsOrderReviewed": false,
        //                    "ReviewedByDateTime": null,
        //                    "ReviewedByPassword": '',
        //                    "UserType": "Nurse",
        //                    "ScreenType": "PreOp",
        //                    "ScreenTypeId": 4,
        //                    "MedTypeId": 2,
        //                    "MedTypeName": 'Dilation Medication',
        //                    "DilationMedications": [],
        //                    "PreOpMedications": [],
        //                    "GeneralOrders": [],
        //                    "OrderTypeId": OrderTypeId||0,
        //                    "OrderTypeName": OrderTypeName||'',                            
        //                }
        //                $scope.PreOpObj.OrderDetails.push(obj);
        //            }

        //        }
        //        //let templist1 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 2, 'DeleteInd': 'N' }, true) || [];
        //        let templist1 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
        //            return oitem.MedTypeId === 2 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
        //        }) || [];
        //        if (templist1.length > 0) {
        //            let List1 = $filter("filter")(templist1[0].DilationMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
        //            let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
        //            if (List.length > 0) {
        //                alertify.error("Medicine name already added!");
        //                $scope.DilationMedicationObj.MedicineObject = '';
        //                return false;
        //            }
        //            let GivenBy = null;
        //            let loggedUser = $filter('filter')($scope.MedicationGivenByNurseArray, { 'DoctorID': $scope.UserId }, true) || [];
        //            if (loggedUser.length > 0) {
        //                GivenBy = loggedUser[0].DoctorID;
        //            }

        //            if (type == 'Frequently') {
        //                var obj = {
        //                    "AscMedicationId": 0,
        //                    "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                    "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                    "ParentOrganizationId": $scope.ParenthospitalId,
        //                    "ASCOrganizationMedicationId": 0,
        //                    "Strength": item.Strength || '',
        //                    "IsFrequent": item.IsFrequent || 'N',
        //                    "MedicineId": item.MedicineId,
        //                    "MedicationName": item.MedicationName,
        //                    "IsChecked": false,
        //                    "IsDilationMed": false,
        //                    "IsIntraAnesthesiaMed": false,
        //                    "IsIntraMed": false,
        //                    "IsPreOPMed": false,
        //                    "MedicationDosage": "",
        //                    "DropTimings": [],
        //                    //"DropTimings": [{
        //                    //    "DropTimingId": 0,
        //                    //    "MedicineId": item.MedicineId,
        //                    //    "MedicationName": item.MedicationName,
        //                    //    "GivenBy": GivenBy || null,
        //                    //    "shownotes": false,
        //                    //    "IsEditDrop": false,
        //                    //    "IsEditview": false,
        //                    //    "Remarks": "",
        //                    //    "DeleteInd": "N",
        //                    //    "MedicationTime": "",
        //                    //    "MedicationDosage": ""
        //                    //}],
        //                    "TypeId": 2,
        //                    "DeleteInd": "N"
        //                }
        //                templist1[0].DilationMedications.push(obj);
        //                $scope.DilationMedicationObj.MedicineObject = "";
        //            } else {
        //                var obj = {
        //                    "AscMedicationId": 0,
        //                    "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                    "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                    "ParentOrganizationId": $scope.ParenthospitalId,
        //                    "ASCOrganizationMedicationId": 0,
        //                    "Strength": item.Strength || '',
        //                    "IsFrequent": item.IsFrequent || 'N',
        //                    "MedicineId": item.MedicineId,
        //                    "MedicationName": item.MedicineName,
        //                    "IsChecked": false,
        //                    "IsDilationMed": false,
        //                    "IsIntraAnesthesiaMed": false,
        //                    "IsIntraMed": false,
        //                    "IsPreOPMed": false,
        //                    "MedicationDosage": "",
        //                    "DropTimings": [],
        //                    //"DropTimings": [{
        //                    //    "DropTimingId": 0,
        //                    //    "MedicineId": item.MedicineId,
        //                    //    "MedicationName": item.MedicineName,
        //                    //    "GivenBy": GivenBy || null,
        //                    //    "shownotes": false,
        //                    //    "IsEditDrop": false,
        //                    //    "IsEditview": false,
        //                    //    "Remarks": "",
        //                    //    "DeleteInd": "N",
        //                    //    "MedicationTime": "",
        //                    //    "MedicationDosage": ""
        //                    //}],
        //                    "TypeId": 2,
        //                    "DeleteInd": "N"
        //                }
        //                templist1[0].DilationMedications.push(obj);
        //                $scope.DilationMedicationObj.MedicineObject = "";
        //            }



        //        } else {




        //        }
        //    }

        //    /*let List = $filter("filter")($scope.PreOpObj.DilationMedications, { "OrganizationMedicationId": item.OrganizationPrescriptionId }, true);*/


        //}
        //$scope.SelectMedicationItems1 = function (item, type) {

        //    //let templist = $filter("filter")($scope.PreOpObj.OrderDetails, { "MedTypeId": 1, 'IsOrderReviewed': false, 'DeleteInd': 'N'}, true);
        //    let templist = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
        //        return oitem.MedTypeId === 1 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
        //    }) || [];
        //    let i = 0;
        //    angular.forEach($scope.PreOpObj.OrderDetails, function (mitem) {
        //        angular.forEach(mitem.PreOpMedications, function (Aitem) {
        //            if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
        //                i++;
        //            }
        //        });
        //    });

        //    if (i > 0) {
        //        alertify.error('You have already entered this Medication');
        //        $scope.PreOpMedicationObj.MedicineObject = "";
        //        return false;
        //    }
        //    if (templist.length > 0) {

        //        let List1 = $filter("filter")(templist[0].PreOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
        //        let List = $filter("filter")(List1, { 'DeleteInd': 'N' }, true);
        //        if (List.length > 0) {
        //            alertify.error("Medicine name already added!");
        //            $scope.PreOpMedicationObj.MedicineObject = "";
        //            return false;
        //        }

        //        let GivenByn = null;
        //        let loggedUser = $filter('filter')($scope.MedicationGivenBy, { 'DoctorID': $scope.UserId }, true) || [];
        //        if (loggedUser.length > 0) {
        //            GivenByn = loggedUser[0].DoctorID;
        //        }


        //        if (type == 'Frequently') {
        //            var obj = {
        //                "AscMedicationId": 0,
        //                "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                "ParentOrganizationId": $scope.ParenthospitalId,
        //                "ASCOrganizationMedicationId": 0,
        //                "Strength": item.Strength || '',
        //                "IsFrequent": item.IsFrequent || 'N',
        //                "MedicineId": item.MedicineId,
        //                "MedicationName": item.MedicationName,
        //                "IsChecked": false,
        //                "IsDilationMed": false,
        //                "IsIntraAnesthesiaMed": false,
        //                "IsIntraMed": false,
        //                "IsPreOPMed": true,
        //                "MedicationDosage": "",
        //                "DropTimings": [],
        //                //"DropTimings": [{
        //                //    "DropTimingId": 0,
        //                //    "MedicineId": item.MedicineId,
        //                //    "MedicationName": item.MedicationName,
        //                //    "GivenBy": GivenByn || null,
        //                //    "shownotes": false,
        //                //    "IsEditDrop": false,
        //                //    "IsEditview": false,
        //                //    "Remarks": "",
        //                //    "DeleteInd": "N",
        //                //    "MedicationTime": "",
        //                //    "MedicationDosage": ""
        //                //}],
        //                "TypeId": 1,
        //                "DeleteInd": "N"
        //            }
        //        } else {
        //            var obj = {
        //                "AscMedicationId": 0,
        //                "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                "ParentOrganizationId": $scope.ParenthospitalId,
        //                "ASCOrganizationMedicationId": 0,
        //                "Strength": item.Strength || '',
        //                "IsFrequent": item.IsFrequent || 'N',
        //                "MedicineId": item.MedicineId,
        //                "MedicationName": item.MedicineName,
        //                "IsChecked": false,
        //                "IsDilationMed": false,
        //                "IsIntraAnesthesiaMed": false,
        //                "IsIntraMed": false,
        //                "IsPreOPMed": true,
        //                "MedicationDosage": "",
        //                "DropTimings": [],
        //                //"DropTimings": [{
        //                //    "DropTimingId": 0,
        //                //    "MedicineId": item.MedicineId,
        //                //    "MedicationName": item.MedicineName,
        //                //    "GivenBy": GivenByn || null,
        //                //    "shownotes": false,
        //                //    "IsEditDrop": false,
        //                //    "IsEditview": false,
        //                //    "Remarks": "",
        //                //    "DeleteInd": "N",
        //                //    "MedicationTime": "",
        //                //    "MedicationDosage": ""
        //                //}],
        //                "TypeId": 1,
        //                "DeleteInd": "N"
        //            }
        //        }

        //        templist[0].PreOpMedications.push(obj);
        //        $scope.PreOpMedicationObj.MedicineObject = "";

        //    } else {
        //        //let templist2 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
        //        let templist2 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
        //            return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
        //        }) || [];
        //        if (templist2.length > 0) {
        //            templist2[0].MedTypeId = 1;
        //            templist2[0].MedTypeName = 'PreOp Medication';
        //        } else {

        //            //let templist3 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 1, 'DeleteInd': 'N' }, true) || [];
        //            let templist3 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
        //                return oitem.MedTypeId === 1 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
        //            }) || [];
        //            if (templist3.length > 0) {

        //            }
        //            else {
        //                var obj = {
        //                    "UserOrderId": 0,
        //                    "UserId": $scope.UserId,
        //                    "DeleteInd": "N",
        //                    "ReviewedBy": null,
        //                    "IsOrderReviewed": false,
        //                    "ReviewedByDateTime": null,
        //                    "ReviewedByPassword": '',
        //                    "UserType": "Nurse",
        //                    "ScreenType": "PreOp",
        //                    "ScreenTypeId": 4,
        //                    "MedTypeId": 1,
        //                    "MedTypeName": 'PreOp Medication',
        //                    "DilationMedications": [],
        //                    "PreOpMedications": [],
        //                    "GeneralOrders": [],
        //                    "OrderTypeId": OrderTypeId || 0,
        //                    "OrderTypeName": OrderTypeName || '',
        //                }
        //                $scope.PreOpObj.OrderDetails.push(obj);
        //            }

        //        }

        //        //let templist1 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 1, 'DeleteInd': 'N' }, true) || [];
        //        let templist1 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
        //            return oitem.MedTypeId === 1 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
        //        }) || [];
        //        if (templist1.length > 0) {
        //            let List1 = $filter("filter")(templist1[0].PreOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
        //            let List = $filter("filter")(List1, { 'DeleteInd': 'N' }, true);
        //            if (List.length > 0) {
        //                alertify.error("Medicine name already added!");
        //                $scope.PreOpMedicationObj.MedicineObject = "";
        //                return false;
        //            }

        //            let GivenByn = null;
        //            let loggedUser = $filter('filter')($scope.MedicationGivenBy, { 'DoctorID': $scope.UserId }, true) || [];
        //            if (loggedUser.length > 0) {
        //                GivenByn = loggedUser[0].DoctorID;
        //            }


        //            if (type == 'Frequently') {
        //                var obj = {
        //                    "AscMedicationId": 0,
        //                    "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                    "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                    "ParentOrganizationId": $scope.ParenthospitalId,
        //                    "ASCOrganizationMedicationId": 0,
        //                    "Strength": item.Strength || '',
        //                    "IsFrequent": item.IsFrequent || 'N',
        //                    "MedicineId": item.MedicineId,
        //                    "MedicationName": item.MedicationName,
        //                    "IsChecked": false,
        //                    "IsDilationMed": false,
        //                    "IsIntraAnesthesiaMed": false,
        //                    "IsIntraMed": false,
        //                    "IsPreOPMed": true,
        //                    "MedicationDosage": "",
        //                    "DropTimings": [],
        //                    //"DropTimings": [{
        //                    //    "DropTimingId": 0,
        //                    //    "MedicineId": item.MedicineId,
        //                    //    "MedicationName": item.MedicationName,
        //                    //    "GivenBy": GivenByn || null,
        //                    //    "shownotes": false,
        //                    //    "IsEditDrop": false,
        //                    //    "IsEditview": false,
        //                    //    "Remarks": "",
        //                    //    "DeleteInd": "N",
        //                    //    "MedicationTime": "",
        //                    //    "MedicationDosage": ""
        //                    //}],
        //                    "TypeId": 1,
        //                    "DeleteInd": "N"
        //                }
        //            } else {
        //                var obj = {
        //                    "AscMedicationId": 0,
        //                    "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                    "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                    "ParentOrganizationId": $scope.ParenthospitalId,
        //                    "ASCOrganizationMedicationId": 0,
        //                    "Strength": item.Strength || '',
        //                    "IsFrequent": item.IsFrequent || 'N',
        //                    "MedicineId": item.MedicineId,
        //                    "MedicationName": item.MedicineName,
        //                    "IsChecked": false,
        //                    "IsDilationMed": false,
        //                    "IsIntraAnesthesiaMed": false,
        //                    "IsIntraMed": false,
        //                    "IsPreOPMed": true,
        //                    "MedicationDosage": "",
        //                    "DropTimings": [],
        //                    //"DropTimings": [{
        //                    //    "DropTimingId": 0,
        //                    //    "MedicineId": item.MedicineId,
        //                    //    "MedicationName": item.MedicineName,
        //                    //    "GivenBy": GivenByn || null,
        //                    //    "shownotes": false,
        //                    //    "IsEditDrop": false,
        //                    //    "IsEditview": false,
        //                    //    "Remarks": "",
        //                    //    "DeleteInd": "N",
        //                    //    "MedicationTime": "",
        //                    //    "MedicationDosage": ""
        //                    //}],
        //                    "TypeId": 1,
        //                    "DeleteInd": "N"
        //                }
        //            }

        //            templist1[0].PreOpMedications.push(obj);
        //            $scope.PreOpMedicationObj.MedicineObject = "";
        //        }
        //        else {

        //        }
        //    }
        //    /*let List = $filter("filter")($scope.PreOpObj.PreOpMedications, { "OrganizationMedicationId": item.OrganizationPrescriptionId }, true);*/
          
        //}


        $scope.GetOrganizationPreOpMedications = function () {
            //let reqObj = {
            //    // "ParentOrganizationId": $scope.ParenthospitalId,
            //    "OrganizationId": $scope.HospitalId
            //};
            eHnoteSurgeryService.GetOrganizationPreOpMedications($scope.HospitalId).then(function (resp) {
                if (resp.data.status === "Success") {
                    angular.forEach(resp.data.rows, function (item) {
                        item.AscMedicationId = 0;
                        item.IsChecked = false;
                        item.DropTimings = [{ "MedicationTime": "" }, { "MedicationTime": "" }];
                    });
                    $scope.LogObj.FavouriteMedications = angular.copy(resp.data.rows) || [];
                    let tempPreOpMedications = $filter('filter')(resp.data.rows, { "MedTypeId": 1 }, true);
                    $scope.MasterPreOpMedications = angular.copy(tempPreOpMedications) || [];                   

                    let tempDilationMedications = $filter('filter')(resp.data.rows, { "MedTypeId": 2 }, true);
                    $scope.MasterDilationMedications = angular.copy(tempDilationMedications);



                    let tempIntraMedications = $filter('filter')(resp.data.rows, { "MedTypeId": 4 }, true);
                    $scope.MasterIntraOpMedications = angular.copy(tempIntraMedications) || [];

                    let tempIntraAnesMedications = $filter('filter')(resp.data.rows, { "MedTypeId": 3 }, true);
                    $scope.MasterAnesthesiaMedications = angular.copy(tempIntraAnesMedications);


                    let tempPostMedications = $filter('filter')(resp.data.rows, { "MedTypeId": 5 }, true);
                    $scope.MasterPostOpMedications = angular.copy(tempPostMedications);

                    let temppostopanesthesiaMedications = $filter('filter')(resp.data.rows, { "MedTypeId": 8 }, true);
                    $scope.MasterPostOpAnesthesiaMedications = angular.copy(temppostopanesthesiaMedications);

                    //let tempIntraAnesMedications = $filter('filter')(resp.data.rows, { "MedTypeId": 8 }, true);
                    //$scope.MasterPostOpMedications = angular.copy(tempIntraAnesMedications);
                    //$scope.PreOpObj.PreOpMedications = angular.copy(resp.data.rows);
                }
            }, function (err) {
                alertify.error("Fetching data failed!");
            });
        };
     $scope.AddFrequentlyMed = function (item, MedTypeId, ScreenTypeId) {
         $scope.LogObj.LogArray = [];
         var ActiontypeName = '';
            if (item.IsFrequent == "N") {
                var Frequentval = "Y"
            } else {
                var Frequentval = "N"
            }
            let MedTypeName = '';
            if (MedTypeId == 1) {
                MedTypeName = 'PreOp Medication';
                ActiontypeName = 'Pre-Op -Anesthesia';
            }
            else if (MedTypeId == 2) {
                MedTypeName = 'Dilation Medication';
                ActiontypeName = 'Pre-Op -Nurse';
            }
            else if (MedTypeId == 3) {
                MedTypeName = 'IntraAnesthesia Medication';
                ActiontypeName = 'Intra-Op -Anesthesia';
            }
        
            else if (MedTypeId == 4) {
                MedTypeName = 'Intra Medication';
                ActiontypeName = 'Intra-Op -Nurse';
            }
         
            else if (MedTypeId ==5) {
                MedTypeName = 'PostOp Medication';
                ActiontypeName = 'Post-Op -Nurse';
            } else {
                MedTypeName = 'Postop Anesthesia Medications';
                ActiontypeName = 'Post-Op -Anesthesia';
            }

            let ScreenTypeName = '';
            if (ScreenTypeId == 4) {
                ScreenTypeName = 'Pre-Op';
            }
            else if (ScreenTypeId == 5) {
                ScreenTypeName = 'Intra-Op';
            }
            else if (ScreenTypeId ==6) {
                ScreenTypeName = 'Post-Op';
            } else {
              
            }

            if (item.IsFrequent == "Y") {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Do you want to Remove this From the frequently added list", function () {
                    var obj = {
                        "ParentOrganizationId": $scope.ParenthospitalId,
                        "OrganizationId": $scope.HospitalId,
                        "UserId": $scope.UserId,
                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                        "MedicineId": item.MedicineId,
                        "MedicineName": item.MedicationName,
                        "UserType": "Nurse",
                        "ScreenTypeId": ScreenTypeId,
                        "ScreenTypeName": ScreenTypeName,
                        "MedTypeId": MedTypeId || null,
                        "MedTypeName": MedTypeName || '',
                        "DeleteInd": 'N',
                        "IsFrequent": "N",
                        "Action": item.Action,
                        "Dose": item.Dose,
                        "DoseUnit": item.DoseUnit,
                        "Route": item.Route,
                        "Frequency": item.Frequency,
                        "ActionId": item.ActionId,
                        "DoseId": item.DoseId,
                        "DoseUnitId": item.DoseUnitId,
                        "RouteId": item.RouteId,
                        "FrequencyId": item.FrequencyId,
                        "OrderDescription": item.OrderDescription,
                        "MedicationNotes": item.MedicationNotes,
                        "maxDose": item.maxDose,
                    }                 

                    $scope.LogObj.FavouriteMedications = $scope.LogObj.FavouriteMedications || [];
                  
                    let newvalue = '';
                    let Oldvalue = '';

                    if ($scope.LogObj.FavouriteMedications.length > 0) {
                        angular.forEach($scope.LogObj.FavouriteMedications, function (kitem) {
                            if (kitem.MedicineId === item.MedicineId) {
                                Oldvalue = `${obj.OrderDescription} - This medication is a favourite.`;
                            }
                        });
                    }
                   
                    if (obj.IsFrequent == "N") {
                        newvalue = `${obj.OrderDescription} - This medication is a unfavourite.`;
                    }

                    if (Oldvalue !== '' && newvalue !== '') {
                        let logObj = {
                            "LogId": 0,
                            "ModuleId": 2,
                            "ModuleName": "ASC",
                            "SubModuleId": 40,
                            "SubModuleName": "All Orders",
                            "ScreenType": ActiontypeName,
                            "ActionType": "Added",
                            "OldActionDescription": Oldvalue,
                            "NewActionDescription": newvalue,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(logObj);
                    }                     
                    if ($scope.LogObj.LogArray.length > 0) {
                        obj.Logs = $scope.LogObj || {};
                    }
                  
                    eHnoteSurgeryService.AddUpdateFrequentMedications(obj).then(function (resp) {
                        if (resp.data.Status === "Success") {                          
                            $scope.GetOrganizationPreOpMedications();
                            item.IsFrequent = Frequentval
                        }
                    }, function (err) {
                        console.log(err);
                    });

                }, function () {
                    r = "You pressed Cancel!";

                });
            }
            if (item.IsFrequent == "N") {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Do you want to add this to the frequently added list", function () {

                    var obj = {
                        "ParentOrganizationId": $scope.ParenthospitalId,
                        "OrganizationId": $scope.HospitalId,
                        "UserId": $scope.UserId,
                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                        "MedicineId": item.MedicineId,
                        "MedicineName": item.MedicationName,
                        "UserType": "Nurse",
                        "ScreenTypeId": ScreenTypeId,
                        "ScreenTypeName": ScreenTypeName,
                        "MedTypeId": MedTypeId || null,
                        "MedTypeName": MedTypeName || '',
                        "DeleteInd": 'N',
                        "IsFrequent": "Y",
                        "Action": item.Action,
                        "Dose": item.Dose,
                        "DoseUnit": item.DoseUnit,
                        "Route": item.Route,
                        "Frequency": item.Frequency,
                        "ActionId": item.ActionId,
                        "DoseId": item.DoseId,
                        "DoseUnitId": item.DoseUnitId,
                        "RouteId": item.RouteId,
                        "FrequencyId": item.FrequencyId,
                        "OrderDescription": item.OrderDescription,
                        "MedicationNotes": item.MedicationNotes,
                        "maxDose": item.maxDose,
                    }                   
                    obj.OrderDescription = obj.OrderDescription || '';
                    let Favourite = '';
                    let newvalue = '';

                    if (obj.IsFrequent == "Y") {
                        Favourite = `${obj.OrderDescription} - This medication is a favourite.`;
                        newvalue = Favourite;
                    }

                    if (newvalue !== '') {
                        let logObj = {
                            "LogId": 0,
                            "ModuleId": 2,
                            "ModuleName": "ASC",
                            "SubModuleId": 40,
                            "SubModuleName": "All Orders",
                            "ScreenType": ActiontypeName,
                            "ActionType": "Added",
                            "OldActionDescription": '',
                            "NewActionDescription": newvalue,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(logObj);
                    }                  
                    if ($scope.LogObj.LogArray.length > 0) {
                        obj.Logs = $scope.LogObj || {};
                    }
                   
                    eHnoteSurgeryService.AddUpdateFrequentMedications(obj).then(function (resp) {
                        if (resp.data.Status === "Success") {
                            // console.log(resp);
                            $scope.GetOrganizationPreOpMedications();
                            item.IsFrequent = Frequentval
                        }
                    }, function (err) {
                        console.log(err);
                    });

                }, function () {
                    r = "You pressed Cancel!";

                });
            }

        }



        $scope.PreopOrderinit = function (Type) {
           
                let FinalNurseOrderDetails = $filter('filter')($scope.PreOpObj.OrderDetails, { 'MedTypeId': 2 }, true) || [];
                if (FinalNurseOrderDetails.length > 0) {
                    angular.forEach(FinalNurseOrderDetails, function (Mitem) {
                        let temp = $filter('filter')(Mitem.DilationMedications, { 'DeleteInd': 'N' }, true) || [];
                        let temp1 = $filter('filter')(Mitem.GeneralOrders, { 'DeleteInd': 'N' }, true) || [];
                        if (temp.length == 0 && temp1.length == 0) {
                            Mitem.DeleteInd = 'Y';
                        }
                    });
                }
          
                let FinalAnesthisiaOrderDetails = $filter('filter')($scope.PreOpObj.OrderDetails, { 'MedTypeId': 1 }, true) || [];
                if (FinalAnesthisiaOrderDetails.length > 0) {
                    angular.forEach(FinalAnesthisiaOrderDetails, function (Mitem) {
                        let temp = $filter('filter')(Mitem.PreOpMedications, { 'DeleteInd': 'N' }, true) || [];
                        let temp1 = $filter('filter')(Mitem.GeneralOrders, { 'DeleteInd': 'N' }, true) || [];
                        if (temp.length == 0 && temp1.length == 0) {
                            Mitem.DeleteInd = 'Y';
                        }
                    });
            }
            $scope.AllOrdersReviewed();
     }


     $scope.updatePreopOrderCheckbox = function (Type) {

         if (Type == 'DilationMedication') {
             let activeOrders = ($scope.PreOpObj.OrderDetails || [])
                 .filter(order => order.DeleteInd === 'N' && order.MedTypeId == 2);

             if (activeOrders.length === 0) {
                 $scope.PreOpObj.DisableSurgeonordersCheck = false;
                 return;
             }

             let isAllDeleted = activeOrders.every(order => {

                 let dilation = order.DilationMedications || [];

                 let noActiveDilation =
                     dilation.length === 0 ||
                     dilation.every(item => item.DeleteInd === 'Y');

                 return noActiveDilation;
             });

             $scope.PreOpObj.DisableSurgeonordersCheck = !isAllDeleted;
         }
         else if (Type == 'PreOpMediacation') {
             let activeOrders = ($scope.PreOpObj.OrderDetails || [])
                 .filter(order => order.DeleteInd === 'N' && order.MedTypeId == 1);

             if (activeOrders.length === 0) {
                 $scope.PreOpObj.DisableAnesthesiaOrdersCheck = false;
                 return;
             }

             let isAllDeleted = activeOrders.every(order => {

                 let dilation = order.PreOpMedications || [];

                 let noActiveDilation =
                     dilation.length === 0 ||
                     dilation.every(item => item.DeleteInd === 'Y');

                 return noActiveDilation;
             });

             $scope.PreOpObj.DisableAnesthesiaOrdersCheck = !isAllDeleted;
         }
     };
       

     $scope.DeleteMainMediacation = function (item, Aitem, Type) {      
            if (Type == 'DilationMedication') {
                var index = Aitem.DilationMedications.indexOf(item);
            }
            if (Type == 'PreOpMediacation') {
                var index = Aitem.PreOpMedications.indexOf(item);
            }
          
            if (item.AscMedicationId != 0) {
                alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {
                    if (index > -1) {
                        item.DeleteInd = 'Y';
                    }
                    $scope.updatePreopOrderCheckbox(Type);
                    $scope.$digest();
                    $scope.PreopOrderinit(Type);
                }, function () {

                });
            }
            else {
                if (index > -1) {
                    if (Type == 'DilationMedication') {
                        Aitem.DilationMedications.splice(index, 1);
                    }
                    if (Type == 'PreOpMediacation') {
                        Aitem.PreOpMedications.splice(index, 1);
                    }
                   
                }
                $scope.updatePreopOrderCheckbox(Type);
            }

            $scope.PreopOrderinit(Type);
     }


     $scope.updateIntraopOrderCheckbox = function (Type) {

         if (Type == 'IntraopMedications') {
             let activeOrders = ($scope.IntraOpObj.OrderDetails || [])
                 .filter(order => order.DeleteInd === 'N' && order.MedTypeId == 4);

             if (activeOrders.length === 0) {
                 $scope.IntraOpObj.DisableIntraopSurgeonCheck = false;
                 return;
             }

             let isAllDeleted = activeOrders.every(order => {

                 let dilation = order.IntraOpMedications || [];

                 let noActiveDilation =
                     dilation.length === 0 ||
                     dilation.every(item => item.DeleteInd === 'Y');

                 return noActiveDilation;
             });

             $scope.IntraOpObj.DisableIntraopSurgeonCheck = !isAllDeleted;
         }
         else if (Type == 'AnesthesiaMedications') {
             let activeOrders = ($scope.IntraOpObj.OrderDetails || [])
                 .filter(order => order.DeleteInd === 'N' && order.MedTypeId == 3);

             if (activeOrders.length === 0) {
                 $scope.IntraOpObj.DisableIntraopAnesthesiaCheck = false;
                 return;
             }

             let isAllDeleted = activeOrders.every(order => {

                 let dilation = order.IntraOpMedications || [];

                 let noActiveDilation =
                     dilation.length === 0 ||
                     dilation.every(item => item.DeleteInd === 'Y');


                 return noActiveDilation;
             });

             $scope.IntraOpObj.DisableIntraopAnesthesiaCheck = !isAllDeleted;
         }
     };


     $scope.DeleteIntraMainMediacation = function (item, Aitem, Type) {
          
            if (Type == 'IntraopMedications') {
                var index = Aitem.IntraOpMedications.indexOf(item);
            } else {
                var index = Aitem.IntraOpMedications.indexOf(item);
            }

            if (item.AscMedicationId != 0) {
                alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {
                    if (index > -1) {
                        item.DeleteInd = 'Y';
                    }
                    $scope.updateIntraopOrderCheckbox(Type);
                    $scope.$digest();
                    $scope.IntraOrdersInit(Type);
                }, function () {

                });
            }
            else {
                if (index > -1) {
                   
                    if (Type == 'IntraopMedications') {
                        Aitem.IntraOpMedications.splice(index, 1);
                    } else {
                        Aitem.IntraOpMedications.splice(index, 1);
                    }

                }
                $scope.updateIntraopOrderCheckbox(Type);
            }

            $scope.IntraOrdersInit(Type);
        }

        $scope.GetValidateUserPassword = function (item,type) {

            item.ReviewedBy = item.ReviewedBy || null;
            if (item.ReviewedBy == null) {
                alertify.error("Please Select ReviewedBy");
                return false;
            }
            item.ReviewedByPassword = item.ReviewedByPassword || '';
            if (item.ReviewedByPassword == '') {
                alertify.error("Please Enter Password");
                return false;
            }
            let reqObj = {
                "Password": item.ReviewedByPassword,
                "UserId": $scope.UserId,
                "ReviewedBy": item.ReviewedBy,
                "OrganizationId": $scope.HospitalId
            };
            eHnoteSurgeryService.GetUserValidatePassword(reqObj).then(function (resp) {
                if (resp.data.status === "Success") {
                    alertify.success("Successfully Validated!");
                    item.IsOrderReviewed = true;
                    item.ReviewedByDateTime = $filter("date")(new Date(), "MM-dd-yyyy hh:mm a");
                    if (type == 'Physician') {
                        angular.forEach($scope.PhysicianArray, function (subitem) {
                            if (subitem.DoctorID == item.ReviewedBy) {
                                item.ReviewedByName = subitem.UserFullName;
                                item.LicenseNumber = subitem.LicenseNumber;
                            }
                        });
                    }
                    else if (type =='Anesthetist') {
                        angular.forEach($scope.AnesthetistArray, function (subitem) {
                            if (subitem.DoctorID == item.ReviewedBy) {
                                item.ReviewedByName = subitem.UserFullName;
                                item.LicenseNumber = subitem.LicenseNumber;
                            }
                        });
                    }
                    else if (type == 'DilationMedications') {
                        angular.forEach($scope.SurgeonArray, function (subitem) {
                            if (subitem.DoctorID == item.ReviewedBy) {
                                item.ReviewedByName = subitem.UserFullName;
                                item.LicenseNumber = subitem.LicenseNumber;
                               
                                if (subitem.SuffixId == 10) {
                                    item.DEA = $scope.HasCredentialValue(subitem.DEA) ? subitem.DEA : '';
                                    item.AMSCA = $scope.HasCredentialValue(subitem.AMSCAA) ? subitem.AMSCAA : '';
                                }
                            }
                        });
                    }
                    else if (type == 'PreOpMedications') {
                        angular.forEach($scope.AnesthesiologistArray, function (subitem) {
                            if (subitem.DoctorID == item.ReviewedBy) {
                                item.ReviewedByName = subitem.UserFullName;
                                item.LicenseNumber = subitem.LicenseNumber;
                            }
                        });
                    }
                    else if (type == 'PostOpMedications') {
                        angular.forEach($scope.SurgeonArray, function (subitem) {
                            if (subitem.DoctorID == item.ReviewedBy) {
                                item.ReviewedByName = subitem.UserFullName;
                                item.LicenseNumber = subitem.LicenseNumber;
                                // Task 56803 - Surgeon (MD) reviewers also carry DEA and AMSCA.
                                if (subitem.SuffixId == 10) {
                                    item.DEA = $scope.HasCredentialValue(subitem.DEA) ? subitem.DEA : '';
                                    item.AMSCA = $scope.HasCredentialValue(subitem.AMSCAA) ? subitem.AMSCAA : '';
                                }
                            }
                        });
                    }
                    else if (type == 'PostAnesthetist') {
                        angular.forEach($scope.AnesthesiologistArray, function (subitem) {
                            if (subitem.DoctorID == item.ReviewedBy) {
                                item.ReviewedByName = subitem.UserFullName;
                                item.LicenseNumber = subitem.LicenseNumber;
                            }
                        });
                    }
                    else if (type == 'IntraopMedications') {
                        angular.forEach($scope.SurgeonArray, function (subitem) {
                            if (subitem.DoctorID == item.ReviewedBy) {
                                item.ReviewedByName = subitem.UserFullName;
                                item.LicenseNumber = subitem.LicenseNumber;
                                // Task 56803 - Surgeon (MD) reviewers also carry DEA and AMSCA.
                                if (subitem.SuffixId == 10) {
                                    item.DEA = $scope.HasCredentialValue(subitem.DEA) ? subitem.DEA : '';
                                    item.AMSCA = $scope.HasCredentialValue(subitem.AMSCAA) ? subitem.AMSCAA : '';
                                }
                            }
                        });
                    }
                    else if (type == 'AnesthesiaMedications') {
                        angular.forEach($scope.AnesthesiologistArray, function (subitem) {
                            if (subitem.DoctorID == item.ReviewedBy) {
                                item.ReviewedByName = subitem.UserFullName;
                                item.LicenseNumber = subitem.LicenseNumber;
                            }
                        });
                    }
                    // Task 56803 - every order type: re-resolve AMSCA / DEA for the reviewer just validated.
                    item.DEA = '';
                    item.AMSCA = '';
                    $scope.SetSurgeonCredentials([item]);
                    $scope.AllOrdersReviewed();

                } else {
                    alertify.error("Invalid Password!");
                }
            }, function (err) {
                alertify.error("Fetching data failed!");

            });

        };

        //$scope.SelectPostOpMedicationItems1 = function (item, type) {
        //    //let templist = $filter("filter")($scope.PostOpObj.OrderDetails, { "MedTypeId": 5, 'IsOrderReviewed': false, 'DeleteInd': 'N' }, true);
        //    let templist = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
        //        return oitem.MedTypeId === 5 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
        //    }) || [];
        //    let i = 0;
        //    angular.forEach($scope.PostOpObj.OrderDetails, function (mitem) {
        //        if (mitem.MedTypeId == 5) {
        //            angular.forEach(mitem.PostOpMedications, function (Aitem) {
        //                if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
        //                    i++;
        //                }
        //            });
        //        }
        //    });

        //    if (i > 0) {
        //        alertify.error('You have already entered this Medication');
        //        $scope.PostOpMedicationObj.MedicineObject = "";
        //        return false;
        //    }
        //   // let templist = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": $scope.UserId, "MedTypeId": 5, 'IsOrderReviewed': false }, true);

        //    if (templist.length > 0) {

        //        let List1 = $filter("filter")(templist[0].PostOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
        //        let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
        //        if (List.length > 0) {
        //            alertify.error("Medicine name already added!");
        //            $scope.PostOpMedicationObj.MedicineObject = '';
        //            return false;
        //        }
        //        let GivenBy = null;
        //        let loggedUser = $filter('filter')($scope.NurseAnesthetistArray, { 'DoctorID': $scope.UserId }, true) || [];
        //        if (loggedUser.length > 0) {
        //            GivenBy = loggedUser[0].DoctorID;
        //        }

        //        if (type == 'Frequently') {
        //            var obj = {
        //                "AscMedicationId": 0,
        //                "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                "ParentOrganizationId": $scope.ParenthospitalId,
        //                "ASCOrganizationMedicationId": 0,
        //                "Strength": item.Strength || '',
        //                "IsFrequent": item.IsFrequent || 'N',
        //                "MedicineId": item.MedicineId,
        //                "MedicationName": item.MedicationName,
        //                "IsChecked": false,
        //                "IsDilationMed": false,
        //                "IsIntraAnesthesiaMed": false,
        //                "IsIntraMed": false,
        //                "IsPreOPMed": false,
        //                "MedicationDosage": "",
        //                "DropTimings": [],             
        //                "TypeId": 4,
        //                "DeleteInd": "N"
        //            }
        //            templist[0].PostOpMedications.push(obj);
        //            $scope.PostOpMedicationObj.MedicineObject = "";
        //        } else {
        //            var obj = {
        //                "AscMedicationId": 0,
        //                "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                "ParentOrganizationId": $scope.ParenthospitalId,
        //                "ASCOrganizationMedicationId": 0,
        //                "Strength": item.Strength || '',
        //                "IsFrequent": item.IsFrequent || 'N',
        //                "MedicineId": item.MedicineId,
        //                "MedicationName": item.MedicineName,
        //                "IsChecked": false,
        //                "IsDilationMed": false,
        //                "IsIntraAnesthesiaMed": false,
        //                "IsIntraMed": false,
        //                "IsPreOPMed": false,
        //                "MedicationDosage": "",
        //                "DropTimings": [],                  
        //                "TypeId": 4,
        //                "DeleteInd": "N"
        //            }
        //            templist[0].PostOpMedications.push(obj);
        //            $scope.PostOpMedicationObj.MedicineObject = "";
        //        }
        //    } else {

        //        //let templist2 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
        //        let templist2 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
        //            return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
        //        }) || [];
        //        if (templist2.length > 0) {
        //            templist2[0].MedTypeId = 5;
        //            templist2[0].MedTypeName = 'PostOp Medication';
        //        } else {

        //            //let templist3 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 5, 'DeleteInd': 'N'}, true) || [];
        //            let templist3 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
        //                return oitem.MedTypeId === 5 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
        //            }) || [];
        //            if (templist3.length > 0) {

        //            } else {
        //                var obj = {
        //                    "UserOrderId": 0,
        //                    "UserId": $scope.UserId,
        //                    "DeleteInd": "N",
        //                    "IsOrderReviewed": false,
        //                    "ReviewedByPassword": '',
        //                    "ReviewedBy": null,
        //                    "UserType": "Nurse",
        //                    "ScreenType": "PostOp",
        //                    "ScreenTypeId": 6,
        //                    "MedTypeId": 5,
        //                    "MedTypeName": 'PostOp Medication',
        //                    "PostOpMedications": [],
        //                    "GeneralOrders": [],
        //                    "OrderTypeId": OrderTypeId || 0,
        //                    "OrderTypeName": OrderTypeName || '',
        //                }
        //                $scope.PostOpObj.OrderDetails.push(obj);
        //            }

        //        }
        //        //let templist1 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 5, 'DeleteInd': 'N' }, true) || [];
        //        let templist1 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
        //            return oitem.MedTypeId === 5 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
        //        }) || [];
        //        if (templist1.length > 0) {
        //            let List1 = $filter("filter")(templist1[0].PostOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
        //            let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
        //            if (List.length > 0) {
        //                alertify.error("Medicine name already added!");
        //                $scope.PostOpMedicationObj.MedicineObject = "";
        //                return false;
        //            }
        //            let GivenBy = null;
        //            let loggedUser = $filter('filter')($scope.NurseAnesthetistArray, { 'DoctorID': $scope.UserId }, true) || [];
        //            if (loggedUser.length > 0) {
        //                GivenBy = loggedUser[0].DoctorID;
        //            }

        //            if (type == 'Frequently') {
        //                var obj = {
        //                    "AscMedicationId": 0,
        //                    "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                    "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                    "ParentOrganizationId": $scope.ParenthospitalId,
        //                    "ASCOrganizationMedicationId": 0,
        //                    "Strength": item.Strength || '',
        //                    "IsFrequent": item.IsFrequent || 'N',
        //                    "MedicineId": item.MedicineId,
        //                    "MedicationName": item.MedicationName,
        //                    "IsChecked": false,
        //                    "IsDilationMed": false,
        //                    "IsIntraAnesthesiaMed": false,
        //                    "IsIntraMed": false,
        //                    "IsPreOPMed": false,
        //                    "MedicationDosage": "",
        //                    "DropTimings": [],                    
        //                    "TypeId": 4,
        //                    "DeleteInd": "N"
        //                }
        //                templist1[0].PostOpMedications.push(obj);
        //                $scope.PostOpMedicationObj.MedicineObject = "";
        //            } else {
        //                var obj = {
        //                    "AscMedicationId": 0,
        //                    "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                    "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                    "ParentOrganizationId": $scope.ParenthospitalId,
        //                    "ASCOrganizationMedicationId": 0,
        //                    "Strength": item.Strength || '',
        //                    "IsFrequent": item.IsFrequent || 'N',
        //                    "MedicineId": item.MedicineId,
        //                    "MedicationName": item.MedicineName,
        //                    "IsChecked": false,
        //                    "IsDilationMed": false,
        //                    "IsIntraAnesthesiaMed": false,
        //                    "IsIntraMed": false,
        //                    "IsPreOPMed": false,
        //                    "MedicationDosage": "",
        //                    "DropTimings": [],                       
        //                    "TypeId": 4,
        //                    "DeleteInd": "N"
        //                }
        //                templist1[0].PostOpMedications.push(obj);
        //                $scope.PostOpMedicationObj.MedicineObject = "";
        //            }

        //        } 
        //    }

            
        //}
        //$scope.SelectPostOpAnesthesiaMedications = function (item, type) {
        //    //let templist = $filter("filter")($scope.PostOpObj.OrderDetails, { "MedTypeId": 8, 'IsOrderReviewed': false,'DeleteInd': 'N' }, true);
        //    let templist = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
        //        return oitem.MedTypeId === 8 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
        //    }) || [];
        //    let i = 0;
        //    angular.forEach($scope.PostOpObj.OrderDetails, function (mitem) {
        //        if (mitem.MedTypeId == 8) {
        //            angular.forEach(mitem.PostOpMedications, function (Aitem) {
        //                if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
        //                    i++;
        //                }
        //            });
        //        }
        //    });

        //    if (i > 0) {
        //        alertify.error('You have already entered this Medication');
        //        $scope.PostOpMedicationObj.MedicineObject = "";
        //        return false;
        //    }
           
        //    if (templist.length > 0) {

        //        let List1 = $filter("filter")(templist[0].PostOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
        //        let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
        //        if (List.length > 0) {
        //            alertify.error("Medicine name already added!");
        //            $scope.PostOpMedicationObj.MedicineObject = '';
        //            return false;
        //        }
        //        let GivenBy = null;
        //        let loggedUser = $filter('filter')($scope.NurseAnesthetistArray, { 'DoctorID': $scope.UserId }, true) || [];
        //        if (loggedUser.length > 0) {
        //            GivenBy = loggedUser[0].DoctorID;
        //        }

        //        if (type == 'Frequently') {
        //            var obj = {
        //                "AscMedicationId": 0,
        //                "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                "ParentOrganizationId": $scope.ParenthospitalId,
        //                "ASCOrganizationMedicationId": 0,
        //                "Strength": item.Strength || '',
        //                "IsFrequent": item.IsFrequent || 'N',
        //                "MedicineId": item.MedicineId,
        //                "MedicationName": item.MedicationName,
        //                "IsChecked": false,
        //                "IsDilationMed": false,
        //                "IsIntraAnesthesiaMed": false,
        //                "IsIntraMed": false,
        //                "IsPreOPMed": false,
        //                "MedicationDosage": "",
        //                "DropTimings": [],
        //                "TypeId": 4,
        //                "DeleteInd": "N"
        //            }
        //            templist[0].PostOpMedications.push(obj);
        //            $scope.PostOpMedicationObj.MedicineObject = "";
        //        } else {
        //            var obj = {
        //                "AscMedicationId": 0,
        //                "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                "ParentOrganizationId": $scope.ParenthospitalId,
        //                "ASCOrganizationMedicationId": 0,
        //                "Strength": item.Strength || '',
        //                "IsFrequent": item.IsFrequent || 'N',
        //                "MedicineId": item.MedicineId,
        //                "MedicationName": item.MedicineName,
        //                "IsChecked": false,
        //                "IsDilationMed": false,
        //                "IsIntraAnesthesiaMed": false,
        //                "IsIntraMed": false,
        //                "IsPreOPMed": false,
        //                "MedicationDosage": "",
        //                "DropTimings": [],
        //                "TypeId": 4,
        //                "DeleteInd": "N"
        //            }
        //            templist[0].PostOpMedications.push(obj);
        //            $scope.PostOpMedicationObj.MedicineObject = "";


        //        }

        //    } else {

        //        //let templist2 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
        //        let templist2 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
        //            return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
        //        }) || [];
        //        if (templist2.length > 0) {
        //            templist2[0].MedTypeId = 8;
        //            templist2[0].MedTypeName = 'Postop Anesthesia Medications';
        //        } else {

        //            //let templist3 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 8, 'DeleteInd': 'N' }, true) || [];
        //            let templist3 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
        //                return oitem.MedTypeId === 8 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
        //            }) || [];
        //            if (templist3.length > 0) {

        //            } else {
        //                var obj = {
        //                    "UserOrderId": 0,
        //                    "UserId": $scope.UserId,
        //                    "DeleteInd": "N",
        //                    "IsOrderReviewed": false,
        //                    "ReviewedByPassword": '',
        //                    "ReviewedBy": null,
        //                    "UserType": "Anesthesia",
        //                    "ScreenType": "PostOp",
        //                    "ScreenTypeId": 6,
        //                    "MedTypeId": 8,
        //                    "MedTypeName": 'Postop Anesthesia Medications',
        //                    "PostOpMedications": [],
        //                    "GeneralOrders": [],
        //                    "OrderTypeId": OrderTypeId || 0,
        //                    "OrderTypeName": OrderTypeName || '',
        //                }
        //                $scope.PostOpObj.OrderDetails.push(obj);
        //            }

        //        }
        //        //let templist1 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 8, 'DeleteInd': 'N' }, true) || [];
        //        let templist1 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
        //            return oitem.MedTypeId === 8 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
        //        }) || [];
        //        if (templist1.length > 0) {
        //            let List1 = $filter("filter")(templist1[0].PostOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
        //            let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
        //            if (List.length > 0) {
        //                alertify.error("Medicine name already added!");
        //                $scope.PostOpMedicationObj.MedicineObject = "";
        //                return false;
        //            }
        //            let GivenBy = null;
        //            let loggedUser = $filter('filter')($scope.NurseAnesthetistArray, { 'DoctorID': $scope.UserId }, true) || [];
        //            if (loggedUser.length > 0) {
        //                GivenBy = loggedUser[0].DoctorID;
        //            }

        //            if (type == 'Frequently') {
        //                var obj = {
        //                    "AscMedicationId": 0,
        //                    "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                    "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                    "ParentOrganizationId": $scope.ParenthospitalId,
        //                    "ASCOrganizationMedicationId": 0,
        //                    "Strength": item.Strength || '',
        //                    "IsFrequent": item.IsFrequent || 'N',
        //                    "MedicineId": item.MedicineId,
        //                    "MedicationName": item.MedicationName,
        //                    "IsChecked": false,
        //                    "IsDilationMed": false,
        //                    "IsIntraAnesthesiaMed": false,
        //                    "IsIntraMed": false,
        //                    "IsPreOPMed": false,
        //                    "MedicationDosage": "",
        //                    "DropTimings": [],
        //                    "TypeId": 4,
        //                    "DeleteInd": "N"
        //                }
        //                templist1[0].PostOpMedications.push(obj);
        //                $scope.PostOpMedicationObj.MedicineObject = "";
        //            } else {
        //                var obj = {
        //                    "AscMedicationId": 0,
        //                    "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                    "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                    "ParentOrganizationId": $scope.ParenthospitalId,
        //                    "ASCOrganizationMedicationId": 0,
        //                    "Strength": item.Strength || '',
        //                    "IsFrequent": item.IsFrequent || 'N',
        //                    "MedicineId": item.MedicineId,
        //                    "MedicationName": item.MedicineName,
        //                    "IsChecked": false,
        //                    "IsDilationMed": false,
        //                    "IsIntraAnesthesiaMed": false,
        //                    "IsIntraMed": false,
        //                    "IsPreOPMed": false,
        //                    "MedicationDosage": "",
        //                    "DropTimings": [],
        //                    "TypeId": 4,
        //                    "DeleteInd": "N"
        //                }
        //                templist1[0].PostOpMedications.push(obj);
        //                $scope.PostOpMedicationObj.MedicineObject = "";
        //            }

        //        }
        //    }

        //   // $scope.AllOrdersReviewed();
        //}

        $scope.AddPostOpDropsTime = function (obj, type) {

            //let templength = obj.DropTimings.length;

            let activeTimings = obj.DropTimings.filter(x => x.DeleteInd !== "Y");
            let templength = activeTimings.length;

            if (templength > 0) {
                let value = obj.DropTimings[templength - 1].MedicationTime;
                let GivenBy = obj.DropTimings[templength - 1].GivenBy;
                if (value == "") {
                    alertify.error("Please enter time!");
                    return;
                }
                GivenBy = GivenBy || null;
                if (GivenBy == null) {
                    alertify.error("Please Select GivenBy for Medications!");
                    return;
                }
            }


           
            let PostGivenby = null;
            if (type == 'PostOpMedications') {
                let loggedUser = $filter('filter')($scope.NurseAnesthetistArray, { 'DoctorID': $scope.UserId }, true);
                if (loggedUser.length > 0) {
                    PostGivenby = loggedUser[0].DoctorID;
                }
            }
            if (type == 'PostOpAnesthesiaMedications') {
                let loggedUser = $filter('filter')($scope.AnesthesiaGivenArray, { 'DoctorID': $scope.UserId }, true);
                if (loggedUser.length > 0) {
                    PostGivenby = loggedUser[0].DoctorID;
                }
            }
            let object = {
                "DropTimingId": 0,
                "MedicineId": obj.MedicineId,
                "MedicationName": obj.MedicationName,
                "GivenBy": PostGivenby || null,
                "shownotes": false,
                "IsEditDrop": false,
                "IsEditview": false,
                "Remarks": "",
                "DeleteInd": "N",
                "MedicationTime": null,
                "MedicationDosage": ""
            };
            obj.DropTimings.push(object);
        };

        $scope.AddPostOpGeneralOrder = function (Type) {
            if (Type == 'Nurse') {
                if ($scope.PostOpMedicationObj.OrderName == '') {
                    alertify.error("Please Enter General Orders!");
                    return false;
                }

                //let templist = $filter("filter")($scope.PostOpObj.OrderDetails, { "MedTypeId": 5, 'IsOrderReviewed': false }, true);
                let templist = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                    return oitem.MedTypeId === 5 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                }) || [];
                if (templist.length > 0) {
                    let Gobj = {
                        "GeneralOrderId": null,
                        "MedicineName": $scope.PostOpMedicationObj.OrderName || '',
                        "DeleteInd": "N",
                        "Status": "",
                        "MedicationTime": "",
                    }
                    templist[0].GeneralOrders.push(Gobj);
                    $scope.PostOpMedicationObj.OrderName = "";
                } else {
                    //let templist2 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                    let templist2 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist2.length > 0) {
                        templist2[0].MedTypeId = 5;
                        templist2[0].MedTypeName = 'PostOp Medication';
                    } else {

                        //let templist3 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 5 }, true) || [];
                        let templist3 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                            return oitem.MedTypeId === 5 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                        }) || [];
                        if (templist3.length > 0) {

                        } else {
                            var obj = {
                                "UserOrderId": 0,
                                "UserId": $scope.UserId,
                                "DeleteInd": "N",
                                "IsOrderReviewed": false,
                                "ReviewedByDateTime": null,
                                "ReviewedByPassword": '',
                                "ReviewedBy": null,
                                "UserType": "Nurse",
                                "ScreenType": "PostOp",
                                "ScreenTypeId": 6,
                                "MedTypeId": 5,
                                "MedTypeName": 'PostOp Medication',
                                "PostOpMedications": [],
                                "GeneralOrders": [],
                                "OrderTypeId": OrderTypeId || 0,
                                "OrderTypeName": OrderTypeName || '',
                            }
                            $scope.PostOpObj.OrderDetails.push(obj);
                        }

                    }


                    //let templist1 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 5 }, true) || [];
                    let templist1 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === 5 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist1.length > 0) {
                        let Gobj = {
                            "GeneralOrderId": null,
                            "MedicineName": $scope.PostOpMedicationObj.OrderName || '',
                            "DeleteInd": "N",
                            "Status": "",
                            "MedicationTime": "",
                        }
                        templist1[0].GeneralOrders.push(Gobj);
                        $scope.PostOpMedicationObj.OrderName = "";
                    } else {

                    }
                }

                let activeOrders = ($scope.PostOpObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 5);

                let isColumnTrue = activeOrders.some(order =>
                    (order.PostOpMedications &&
                        order.PostOpMedications.some(item => item.DeleteInd === 'N'))
                );

                if (isColumnTrue) {
                    $scope.PostOpObj.DisablePostOpSurgeonCheck = isColumnTrue;
                    $scope.PostOpObj.IsPostOpSurgeonOrdersTimeAdded = !isColumnTrue;
                }
                
            } else {
                if ($scope.PostOpMedicationObj.OrderName == '') {
                    alertify.error("Please Enter General Orders!");
                    return false;
                }

                //let templist = $filter("filter")($scope.PostOpObj.OrderDetails, { "MedTypeId": 8, 'IsOrderReviewed': false }, true);
                let templist = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                    return oitem.MedTypeId === 8 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                }) || [];
                if (templist.length > 0) {
                    let Gobj = {
                        "GeneralOrderId": null,
                        "MedicineName": $scope.PostOpMedicationObj.OrderName || '',
                        "DeleteInd": "N",
                        "Status": "",
                        "MedicationTime": "",
                    }
                    templist[0].GeneralOrders.push(Gobj);
                    $scope.PostOpMedicationObj.OrderName = "";
                } else {
                    //let templist2 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                    let templist2 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist2.length > 0) {
                        templist2[0].MedTypeId = 8;
                        templist2[0].MedTypeName = 'Postop Anesthesia Medications';
                    } else {

                        //let templist3 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 8 }, true) || [];
                        let templist3 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                            return oitem.MedTypeId === 8 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                        }) || [];
                        if (templist3.length > 0) {

                        } else {
                            var obj = {
                                "UserOrderId": 0,
                                "UserId": $scope.UserId,
                                "DeleteInd": "N",
                                "IsOrderReviewed": false,
                                "ReviewedByDateTime": null,
                                "ReviewedByPassword": '',
                                "ReviewedBy": null,
                                "UserType": "Anesthesia",
                                "ScreenType": "PostOp",
                                "ScreenTypeId": 6,
                                "MedTypeId": 8,
                                "MedTypeName": 'Postop Anesthesia Medications',
                                "PostOpMedications": [],
                                "GeneralOrders": [],
                                "OrderTypeId": OrderTypeId || 0,
                                "OrderTypeName": OrderTypeName || '',
                            }
                            $scope.PostOpObj.OrderDetails.push(obj);
                        }

                    }


                    //let templist1 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 8 }, true) || [];
                    let templist1 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === 8 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];

                    if (templist1.length > 0) {
                        let Gobj = {
                            "GeneralOrderId": null,
                            "MedicineName": $scope.PostOpMedicationObj.OrderName || '',
                            "DeleteInd": "N",
                            "Status": "",
                            "MedicationTime": "",
                        }
                        templist1[0].GeneralOrders.push(Gobj);
                        $scope.PostOpMedicationObj.OrderName = "";
                    } else {

                    }
                }

                let activeOrders = ($scope.PostOpObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 8);

                let isColumnTrue = activeOrders.some(order =>
                    (order.PostOpMedications &&
                        order.PostOpMedications.some(item => item.DeleteInd === 'N'))
                );
                if (isColumnTrue) {
                    $scope.PostOpObj.DisablePostOpAnesthesiaCheck = isColumnTrue;
                    $scope.PostOpObj.IsPostOpAnesthesiaOrdersTimeAdded = !isColumnTrue;
                }
            }
        }

        $scope.AddIntraOpGeneralOrder = function (Type) {
            if (Type == 'Nurse') {
                if ($scope.IntraOpMedicationObj.OrderName == '') {
                    alertify.error("Please Enter General Orders!");
                    return false;
                }   

                //let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, { "MedTypeId": 4, 'IsOrderReviewed': false }, true);
                let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                    return oitem.MedTypeId === 4 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                }) || [];
                if (templist.length > 0) {
                    let Gobj = {
                        "GeneralOrderId": null,
                        "MedicineName": $scope.IntraOpMedicationObj.OrderName || '',
                        "DeleteInd": "N",
                        "Status": "",
                        "MedicationTime": "",
                    }
                    templist[0].GeneralOrders.push(Gobj);
                    $scope.IntraOpMedicationObj.OrderName = "";
                } else {
                    //let templist2 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                    let templist2 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist2.length > 0) {
                        templist2[0].MedTypeId = 4;
                        templist2[0].MedTypeName = 'Intra Medications';
                    } else {

                        //let templist3 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 4 }, true) || [];
                        let templist3 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                            return oitem.MedTypeId === 4 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                        }) || [];
                        if (templist3.length > 0) {

                        } else {
                            var obj = {
                                "UserOrderId": 0,
                                "UserId": $scope.UserId,
                                "DeleteInd": "N",
                                "IsOrderReviewed": false,
                                "ReviewedByDateTime": null,
                                "ReviewedByPassword": '',
                                "ReviewedBy": null,
                                "UserType": "Nurse",
                                "ScreenType": "Intra-OP",
                                "ScreenTypeId": 5,
                                "MedTypeId": 4,
                                "MedTypeName": 'Intra Medication',
                                "IntraOpMedications": [],
                                "GeneralOrders": [],
                                "OrderTypeId": OrderTypeId || 1,
                                "OrderTypeName": OrderTypeName || "Standing Medications(Pre Surgery)",
                            }
                            $scope.IntraOpObj.OrderDetails.push(obj);
                        }

                    }


                    //let templist1 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 4 }, true) || [];
                    let templist1 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === 4 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];

                    if (templist1.length > 0) {
                        let Gobj = {
                            "GeneralOrderId": null,
                            "MedicineName": $scope.IntraOpMedicationObj.OrderName || '',
                            "DeleteInd": "N",
                            "Status": "",
                            "MedicationTime": "",
                        }
                        templist1[0].GeneralOrders.push(Gobj);
                        $scope.IntraOpMedicationObj.OrderName = "";
                    } else {

                    }
                }

                let activeOrders = ($scope.IntraOpObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 4);

                let isColumnTrue = activeOrders.some(order =>
                    (order.IntraOpMedications &&
                        order.IntraOpMedications.some(item => item.DeleteInd === 'N'))
                );

                if (isColumnTrue) {
                    $scope.IntraOpObj.DisableIntraopSurgeonCheck = isColumnTrue;
                    $scope.IntraOpObj.IsIntraOpSurgeonOrdersTimeAdded = !isColumnTrue;
                }
                

            } else {
                if ($scope.AnesthesiaMedicationObj.OrderName == '') {
                    alertify.error("Please Enter General Orders!");
                    return false;
                }

                //let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, { "MedTypeId": 3, 'IsOrderReviewed': false }, true);
                let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                    return oitem.MedTypeId === 3 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                }) || [];
                if (templist.length > 0) {
                    let Gobj = {
                        "GeneralOrderId": null,
                        "MedicineName": $scope.AnesthesiaMedicationObj.OrderName || '',
                        "DeleteInd": "N",
                        "Status": "",
                        "MedicationTime": "",
                    }
                    templist[0].GeneralOrders.push(Gobj);
                    $scope.AnesthesiaMedicationObj.OrderName = "";
                } else {
                    //let templist2 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                    let templist2 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist2.length > 0) {
                        templist2[0].MedTypeId = 8;
                        templist2[0].MedTypeName = 'Postop Anesthesia Medications';
                    } else {

                        //let templist3 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 3 }, true) || [];
                        let templist3 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                            return oitem.MedTypeId === 3 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                        }) || [];
                        if (templist3.length > 0) {

                        } else {
                            var obj = {
                                "UserOrderId": 0,
                                "UserId": $scope.UserId,
                                "DeleteInd": "N",
                                "IsOrderReviewed": false,
                                "ReviewedByDateTime": null,
                                "ReviewedByPassword": '',
                                "ReviewedBy": null,
                                "UserType": "Anesthesia",
                                "ScreenType": "PostOp",
                                "ScreenTypeId": 5,
                                "MedTypeId": 3,
                                "MedTypeName": 'IntraAnesthesia Medications',
                                "IntraOpMedications": [],
                                "GeneralOrders": [],
                                "OrderTypeId": OrderTypeId || 1,
                                "OrderTypeName": OrderTypeName || "Standing Medications(Pre Surgery)",
                            }
                            $scope.IntraOpObj.OrderDetails.push(obj);
                        }

                    }


                    //let templist1 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 3 }, true) || [];
                    let templist1 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === 3 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];

                    if (templist1.length > 0) {
                        let Gobj = {
                            "GeneralOrderId": null,
                            "MedicineName": $scope.AnesthesiaMedicationObj.OrderName || '',
                            "DeleteInd": "N",
                            "Status": "",
                            "MedicationTime": "",
                        }
                        templist1[0].GeneralOrders.push(Gobj);
                        $scope.AnesthesiaMedicationObj.OrderName = "";
                    } else {

                    }
                }

                let activeOrders = ($scope.IntraOpObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 3);

                let isColumnTrue = activeOrders.some(order =>
                    (order.IntraOpMedications &&
                        order.IntraOpMedications.some(item => item.DeleteInd === 'N'))
                );

                if (isColumnTrue) {
                    $scope.IntraOpObj.DisableIntraopAnesthesiaCheck = isColumnTrue;
                    $scope.IntraOpObj.IsIntraOpAnesthesiaOrdersTimeAdded = !isColumnTrue;
                }
                
            }
        }


        $scope.IsOpenPostOrderPopup = function () {
            $scope.PostOpTemplateobj.IsOpenOrderTemplate = !$scope.PostOpTemplateobj.IsOpenOrderTemplate;
        };
        $scope.IsOpenAnesthesiaOrderPopup = function () {
            $scope.PostOpTemplateobj.IsOpenAnesthesiaOrderTemplate = !$scope.PostOpTemplateobj.IsOpenAnesthesiaOrderTemplate;
        }
        $scope.AddUpdatePostopOrderTemplate = function (MedtypeId) {
            var MedtypeId = MedtypeId;
            var Medtype = '';
            var ActionName = '';
            $scope.LogObj.LogArray = [];
            if (MedtypeId == 5) {
                Medtype = 'PostOp Medication';
                ActionName = 'Post-Op -Nurse';
            } else {
                Medtype = 'Postop Anesthesia Medications';
                ActionName = 'Post-Op -Anesthesia';
            }

            if ($scope.PostOpTemplateobj.TemplateName == '') {
                alertify.error("Please enter template name!");
                return false;
            }

            let templateReq = {
                "UserId": $scope.UserId || "",
                "HospitalId": $scope.HospitalId || "",
                "RoleId": $scope.RoleId || null,
                "TemplateId": 0,
                "TemplateName": $scope.PostOpTemplateobj.TemplateName || "",
                "DeleteInd": "N",
                "ScreenType": "PostOp",
                "ScreenTypeId": 6,
                "MedTypeId": MedtypeId,
                "MedTypeName": Medtype,
                "DilationMedications": [],
                "GeneralOrders": [],
                "PreOpMedications": [],
                "PostOpMedications": [],
                "Logs": {},
            };
           


               let FinalOrderDetails = $scope.PostOpObj.OrderDetails || [];           
               /*FinalOrderDetails = $filter('filter')(angular.copy($scope.PostOpObj.OrderDetails), { 'MedTypeId': 5 }, true) || [];*/           
            if (FinalOrderDetails.length > 0) {
                angular.forEach(FinalOrderDetails, function (Mitem) {
                    if (Mitem.MedTypeId == 5) {
                        Mitem.UserType = "Nurse";
                    } else {
                        Mitem.UserType = "Anesthesia";
                    }
                    if (Mitem.PostOpMedications.length > 0) {
                        angular.forEach(Mitem.PostOpMedications, function (item) {
                            if (item.MedTypeId == 5) {
                                item.UserType = "Nurse";
                            } else {
                                item.UserType = "Anesthesia";
                            }
                            item.IsPostOpMed = true;
                            
                            item.DropTimings = [];
                            templateReq.PostOpMedications.push(item);

                        });
                    }
                    if (Mitem.GeneralOrders.length > 0) {
                        templateReq.GeneralOrders = Mitem.GeneralOrders || [];
                    }
                });
            }
            if ($scope.PostOpObj.OrderDetails.length > 0) {
                let description = '';
                $scope.PostOpTemplateobj.TemplateName = $scope.PostOpTemplateobj.TemplateName || '';
                if ($scope.PostOpTemplateobj.TemplateName && $scope.PostOpTemplateobj.TemplateName !== '') {
                    description += `Template Name: ${$scope.PostOpTemplateobj.TemplateName}\n`;
                }


                if (MedtypeId === 5) {
                    var FinalOrderDetails2 = [];
                    FinalOrderDetails2 = $filter('filter')(angular.copy($scope.PostOpObj.OrderDetails), { 'MedTypeId': 5 }, true) || [];

                    angular.forEach(FinalOrderDetails2, function (item) {


                        if (item.PostOpMedications && item.PostOpMedications.length > 0) {
                            angular.forEach(item.PostOpMedications, function (kitem) {
                                let timingDescriptions = [];
                                if (kitem.DropTimings && kitem.DropTimings.length > 0) {
                                    angular.forEach(kitem.DropTimings, function (dt) {
                                        let medicationTime = dt.MedicationTime || '';
                                        let givenById = dt.GivenBy || '';
                                        let medicationDosage = dt.MedicationDosage || '';
                                        let Remarks = dt.Remarks || '';

                                        let givenByUser = '';
                                        if (givenById) {
                                            let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                                            if (user) givenByUser = user.FullName;
                                        }

                                        let parts = [];

                                        if (medicationDosage) {
                                            parts.push(`Dosage: ${medicationDosage}`);
                                        }
                                        if (medicationTime) {
                                            parts.push(`Medication Time: ${medicationTime}`);
                                        }
                                        if (givenByUser) {
                                            parts.push(`Given By: ${givenByUser}`);
                                        }
                                        if (Remarks) {
                                            parts.push(`Notes: ${Remarks}`);
                                        }

                                        let timingDescription = parts.join('\n');

                                        timingDescriptions.push(timingDescription);
                                    });
                                }
                                let parts = [];

                                if (kitem.MedicationName) parts.push(`Medicine Name:-- ${kitem.MedicationName}`);
                                if (kitem.Action) parts.push(`Action: ${kitem.Action}`);
                                if (kitem.Dose) parts.push(`Dose: ${kitem.Dose}`);
                                if (kitem.DoseUnit) parts.push(`Dose Unit: ${kitem.DoseUnit}`);
                                if (kitem.Route) parts.push(`Route: ${kitem.Route}`);
                                if (kitem.Frequency) parts.push(`Frequency: ${kitem.Frequency}`);
                                if (kitem.maxDose) parts.push(`Max Dose: ${kitem.maxDose}`);
                                if (kitem.MedicationNotes) parts.push(`Notes: ${kitem.MedicationNotes}`);

                                if (timingDescriptions && timingDescriptions.length > 0) {
                                    parts.push(timingDescriptions.join(', '));
                                }

                                description += parts.join(', ') + '\n';

                            });
                        }
                        if (item.GeneralOrders && item.GeneralOrders.length > 0) {
                            angular.forEach(item.GeneralOrders, function (sitem) {
                                description += `Custom Order - "${sitem.MedicineName}"\n`;
                            });
                        }
                    });
                } else {

                    var FinalOrderDetails1 = [];
                    FinalOrderDetails1 = $filter('filter')(angular.copy($scope.PostOpObj.OrderDetails), { 'MedTypeId': 8 }, true) || [];
                    angular.forEach(FinalOrderDetails1, function (item) {
                    

                            if (item.PostOpMedications && item.PostOpMedications.length > 0) {
                                angular.forEach(item.PostOpMedications, function (kitem) {
                                    let timingDescriptions = [];
                                    if (kitem.DropTimings && kitem.DropTimings.length > 0) {
                                        angular.forEach(kitem.DropTimings, function (dt) {
                                            let medicationTime = dt.MedicationTime || '';
                                            let givenById = dt.GivenBy || '';
                                            let medicationDosage = dt.MedicationDosage || '';
                                            let Remarks = dt.Remarks || '';

                                            let givenByUser = '';
                                            if (givenById) {
                                                let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                                                if (user) givenByUser = user.FullName;
                                            }

                                            let parts = [];

                                            if (medicationDosage) {
                                                parts.push(`Dosage: ${medicationDosage}`);
                                            }
                                            if (medicationTime) {
                                                parts.push(`Medication Time: ${medicationTime}`);
                                            }
                                            if (givenByUser) {
                                                parts.push(`Given By: ${givenByUser}`);
                                            }
                                            if (Remarks) {
                                                parts.push(`Notes: ${Remarks}`);
                                            }

                                            let timingDescription = parts.join('\n');
                                            timingDescriptions.push(timingDescription);
                                        });
                                    }
                                    let parts = [];

                                    if (kitem.MedicationName) parts.push(`Medicine Name:--s ${kitem.MedicationName}`);
                                    if (kitem.Action) parts.push(`Action: ${kitem.Action}`);
                                    if (kitem.Dose) parts.push(`Dose: ${kitem.Dose}`);
                                    if (kitem.DoseUnit) parts.push(`Dose Unit: ${kitem.DoseUnit}`);
                                    if (kitem.Route) parts.push(`Route: ${kitem.Route}`);
                                    if (kitem.Frequency) parts.push(`Frequency: ${kitem.Frequency}`);
                                    if (kitem.maxDose) parts.push(`Max Dose: ${kitem.maxDose}`);
                                    if (kitem.MedicationNotes) parts.push(`Notes: ${kitem.MedicationNotes}`);

                                    if (timingDescriptions && timingDescriptions.length > 0) {
                                        parts.push(timingDescriptions.join(', '));
                                    }

                                    description += parts.join(', ') + '\n';

                                });
                            }
                       
                        if (item.GeneralOrders && item.GeneralOrders.length > 0) {
                            angular.forEach(item.GeneralOrders, function (sitem) {
                                description += `Custom Order - "${sitem.MedicineName}"\n`;
                            });
                        }

                    });
                }

                if (description) {
                    let obj = {
                        LogId: 0,
                        ModuleId: 2,
                        ModuleName: "ASC",
                        SubModuleId: 40,
                        SubModuleName: "All Orders",
                        ScreenType: ActionName,
                        ActionType: "Added",
                        OldActionDescription: "",
                        NewActionDescription: description.trim(),
                        ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }

            }

            if ($scope.LogObj.LogArray.length > 0) {
                templateReq.Logs = $scope.LogObj || {};
            }




            eHnoteSurgeryService.AddUpdateAscUserOrderTemplates(templateReq).then(function (resp) {
                if (resp.data.status === "Success") {
                    alertify.success("Template saved successfully!");
                    $scope.GetOrderTemplates();
                    $scope.PostOpTemplateobj.IsOpenOrderTemplate = false;
                    $scope.PostOpTemplateobj.IsOpenAnesthesiaOrderTemplate = false;
                    $scope.PostOpTemplateobj.TemplateName = '';

                }
                if (resp.data.status === "Failure") {
                    alertify.error('TemplateName Already Exists')
                }
            }, function (err) {
                console.log(err);
            });

        };

     $scope.AddUpdateIntraopOrderTemplate = function (medtype) {
         $scope.LogObj.LogArray = [];
         var ActionName = '';
            if (medtype == 3) {
                var MedTypeName = 'IntraAnesthesia Medications';
                ActionName = 'Intra-Op-Anesthesia';
            }
            else {
                var MedTypeName = 'Intra Medications';
                ActionName = 'Intra-Op-Nurse';
            }


            if ($scope.IntraOpTemplateobj.TemplateName == '') {
                alertify.error("Please enter template name!");
                return false;
            }

            let templateReq = {
                "UserId": $scope.UserId || "",
                "HospitalId": $scope.HospitalId || "",
                "RoleId": $scope.RoleId || null,
                "TemplateId": 0,
                "TemplateName": $scope.IntraOpTemplateobj.TemplateName || "",
                "DeleteInd": "N",
                "ScreenType": "Intra-OP",
                "ScreenTypeId": 5,
                "MedTypeId": medtype,
                "MedTypeName": MedTypeName,
                // "DilationMedications": [],
                "GeneralOrders": [],
                // "PreOpMedications": [],
                "IntraOpMedications": [],
                "Logs": {},
                //"AnesthesiaMedications": [],

            };


            let FinalOrderDetails = [];
            if (medtype == 3) {
                FinalOrderDetails = $filter('filter')(angular.copy($scope.IntraOpObj.OrderDetails), { 'MedTypeId': 3 }, true) || [];
                var count = 0
                angular.forEach(FinalOrderDetails, function (Mitem) {
                    let templist = $filter("filter")(Mitem.IntraOpMedications, { "DeleteInd": 'N' }, true) || [];
                    let templist1 = $filter("filter")(Mitem.GeneralOrders, { "DeleteInd": 'N' }, true) || [];
                    if (templist.length !== 0 || templist1.length !== 0) {
                        count++;
                    }
                });
                if (count == 0) {
                    alertify.error("Please add any orders data!");
                    return false;
                }
                if (FinalOrderDetails.length > 0) {
                    angular.forEach(FinalOrderDetails, function (Mitem) {
                        if (Mitem.IntraOpMedications.length > 0) {
                            angular.forEach(Mitem.IntraOpMedications, function (item) {
                                item.IsIntraMed = true;
                                item.UserType = "Nurse";
                                item.DropTimings = [];
                                if (item.DeleteInd == 'N') {
                                    templateReq.IntraOpMedications.push(item);
                                }

                            });
                        }
                        if (Mitem.GeneralOrders.length > 0) {
                            angular.forEach(Mitem.GeneralOrders, function (item) {
                                if (item.DeleteInd == 'N') {
                                    templateReq.GeneralOrders.push(item);
                                }
                            });
                            // templateReq.GeneralOrders = Mitem.GeneralOrders || [];
                        }
                    });
                }
            }
            else {
                FinalOrderDetails = $filter('filter')(angular.copy($scope.IntraOpObj.OrderDetails), { 'MedTypeId': 4 }, true) || [];
                var count = 0
                angular.forEach(FinalOrderDetails, function (Mitem) {
                    let templist = $filter("filter")(Mitem.IntraOpMedications, { "DeleteInd": 'N' }, true) || [];
                    let templist1 = $filter("filter")(Mitem.GeneralOrders, { "DeleteInd": 'N' }, true) || [];
                    if (templist.length !== 0 || templist1.length !== 0) {
                        count++;
                    }
                });
                if (count == 0) {
                    alertify.error("Please add any orders data!");
                    return false;
                }
                if (FinalOrderDetails.length > 0) {
                    angular.forEach(FinalOrderDetails, function (Mitem) {
                        if (Mitem.IntraOpMedications.length > 0) {
                            angular.forEach(Mitem.IntraOpMedications, function (item) {
                                item.IsIntraMed = true;
                                item.UserType = "Nurse";
                                item.DropTimings = [];
                                if (item.DeleteInd == 'N') {
                                    templateReq.IntraOpMedications.push(item);
                                }

                            });
                        }
                        if (Mitem.GeneralOrders.length > 0) {
                            angular.forEach(Mitem.GeneralOrders, function (item) {
                                if (item.DeleteInd == 'N') {
                                    templateReq.GeneralOrders.push(item);
                                }
                            });
                            //templateReq.GeneralOrders = Mitem.GeneralOrders || [];
                        }
                    });
                }
            }

            //let FinalOrderDetails = [];
            //if (medtype == 3) {
            //    FinalOrderDetails = $filter('filter')(angular.copy($scope.IntraOpObj.AnesthesiaMedications)) || [];
            //    if (FinalOrderDetails.length > 0) {
            //        angular.forEach(FinalOrderDetails, function (Mitem) {
            //            Mitem.IsIntraMed = true;
            //            Mitem.UserType = "Nurse";
            //            Mitem.DropTimings = [];
            //            templateReq.AnesthesiaMedications.push(Mitem);
            //        });
            //    }
            //}
            //else {
            //    FinalOrderDetails = $filter('filter')(angular.copy($scope.IntraOpObj.IntraOpMedications)) || [];
            //    if (FinalOrderDetails.length > 0) {
            //        angular.forEach(FinalOrderDetails, function (Mitem) {
            //            Mitem.IsIntraMed = true;
            //            Mitem.UserType = "Nurse";
            //            Mitem.DropTimings = [];
            //            templateReq.IntraOpMedications.push(Mitem);

            //        });
            //    }
            //}
            //console.log(JSON.stringify(templateReq));
            //return false;

            if ($scope.IntraOpObj.OrderDetails.length > 0) {
                let description = '';
                $scope.IntraOpTemplateobj.TemplateName = $scope.IntraOpTemplateobj.TemplateName || '';
                if ($scope.IntraOpTemplateobj.TemplateName && $scope.IntraOpTemplateobj.TemplateName  !== '') {
                    description += `Template Name: ${$scope.IntraOpTemplateobj.TemplateName }\n`;
                }


                if (medtype === 3) {
                    var FinalOrderDetails2 = [];
                    FinalOrderDetails2 = $filter('filter')(angular.copy($scope.IntraOpObj.OrderDetails), { 'MedTypeId': 3 }, true) || [];

                    angular.forEach(FinalOrderDetails2, function (item) {                      
                        if (item.IntraOpMedications && item.IntraOpMedications.length > 0) {
                            angular.forEach(item.IntraOpMedications, function (kitem) {
                                let timingDescriptions = [];
                                if (kitem.DropTimings && kitem.DropTimings.length > 0) {
                                    angular.forEach(kitem.DropTimings, function (dt) {
                                        let medicationTime = dt.MedicationTime || '';
                                        let givenById = dt.GivenBy || '';
                                        let medicationDosage = dt.MedicationDosage || '';
                                        let Remarks = dt.Remarks || '';

                                        let givenByUser = '';
                                        if (givenById) {
                                            let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                                            if (user) givenByUser = user.FullName;
                                        }

                                        let parts = [];

                                        if (medicationDosage) {
                                            parts.push(`Dosage: ${medicationDosage}`);
                                        }
                                        if (medicationTime) {
                                            parts.push(`Medication Time: ${medicationTime}`);
                                        }
                                        if (givenByUser) {
                                            parts.push(`Given By: ${givenByUser}`);
                                        }
                                        if (Remarks) {
                                            parts.push(`Notes: ${Remarks}`);
                                        }

                                        let timingDescription = parts.join('\n');

                                        timingDescriptions.push(timingDescription);
                                    });
                                }
                                let parts = [];

                                if (kitem.MedicationName) parts.push(`Medicine Name:-- ${kitem.MedicationName}`);
                                if (kitem.Action) parts.push(`Action: ${kitem.Action}`);
                                if (kitem.Dose) parts.push(`Dose: ${kitem.Dose}`);
                                if (kitem.DoseUnit) parts.push(`Dose Unit: ${kitem.DoseUnit}`);
                                if (kitem.Route) parts.push(`Route: ${kitem.Route}`);
                                if (kitem.Frequency) parts.push(`Frequency: ${kitem.Frequency}`);
                                if (kitem.maxDose) parts.push(`Max Dose: ${kitem.maxDose}`);
                                if (kitem.MedicationNotes) parts.push(`Notes: ${kitem.MedicationNotes}`);

                                if (timingDescriptions && timingDescriptions.length > 0) {
                                    parts.push(timingDescriptions.join(', '));
                                }

                                description += parts.join(', ') + '\n';

                            });
                        }


                        if (item.GeneralOrders && item.GeneralOrders.length > 0) {
                            angular.forEach(item.GeneralOrders, function (sitem) {
                                description += `Custom Order - "${sitem.MedicineName}"\n`;
                            });
                        }
                    });
                } else {

                    var FinalOrderDetails1 = [];
                    FinalOrderDetails1 = $filter('filter')(angular.copy($scope.IntraOpObj.OrderDetails), { 'MedTypeId': 4 }, true) || [];
                    angular.forEach(FinalOrderDetails1, function (item) {

                        if (item.IntraOpMedications && item.IntraOpMedications.length > 0) {
                            angular.forEach(item.IntraOpMedications, function (kitem) {
                                let timingDescriptions = [];
                                if (kitem.DropTimings && kitem.DropTimings.length > 0) {
                                    angular.forEach(kitem.DropTimings, function (dt) {
                                        let medicationTime = dt.MedicationTime || '';
                                        let givenById = dt.GivenBy || '';
                                        let medicationDosage = dt.MedicationDosage || '';
                                        let Remarks = dt.Remarks || '';

                                        let givenByUser = '';
                                        if (givenById) {
                                            let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                                            if (user) givenByUser = user.FullName;
                                        }

                                        let parts = [];

                                        if (medicationDosage) {
                                            parts.push(`Dosage: ${medicationDosage}`);
                                        }
                                        if (medicationTime) {
                                            parts.push(`Medication Time: ${medicationTime}`);
                                        }
                                        if (givenByUser) {
                                            parts.push(`Given By: ${givenByUser}`);
                                        }
                                        if (Remarks) {
                                            parts.push(`Notes: ${Remarks}`);
                                        }

                                        let timingDescription = parts.join('\n');
                                        timingDescriptions.push(timingDescription);
                                    });
                                }
                                let parts = [];

                                if (kitem.MedicationName) parts.push(`Medicine Name:--s ${kitem.MedicationName}`);
                                if (kitem.Action) parts.push(`Action: ${kitem.Action}`);
                                if (kitem.Dose) parts.push(`Dose: ${kitem.Dose}`);
                                if (kitem.DoseUnit) parts.push(`Dose Unit: ${kitem.DoseUnit}`);
                                if (kitem.Route) parts.push(`Route: ${kitem.Route}`);
                                if (kitem.Frequency) parts.push(`Frequency: ${kitem.Frequency}`);
                                if (kitem.maxDose) parts.push(`Max Dose: ${kitem.maxDose}`);
                                if (kitem.MedicationNotes) parts.push(`Notes: ${kitem.MedicationNotes}`);

                                if (timingDescriptions && timingDescriptions.length > 0) {
                                    parts.push(timingDescriptions.join(', '));
                                }

                                description += parts.join(', ') + '\n';

                            });
                        }
                        if (item.GeneralOrders && item.GeneralOrders.length > 0) {
                            angular.forEach(item.GeneralOrders, function (sitem) {
                                description += `Custom Order - "${sitem.MedicineName}"\n`;
                            });
                        }
                    });
                }

                if (description) {
                    let obj = {
                        LogId: 0,
                        ModuleId: 2,
                        ModuleName: "ASC",
                        SubModuleId: 40,
                        SubModuleName: "All Orders",
                        ScreenType: ActionName,
                        ActionType: "Added",
                        OldActionDescription: "",
                        NewActionDescription: description.trim(),
                        ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }

            }

            if ($scope.LogObj.LogArray.length > 0) {
                templateReq.Logs = $scope.LogObj || {};
            }

            eHnoteSurgeryService.AddUpdateAscUserOrderTemplates(templateReq).then(function (resp) {
                if (resp.data.status === "Success") {
                    alertify.success("Template saved successfully!");
                    $scope.GetOrderTemplates();

                    if (medtype == 3) {
                        $scope.IntraOpTemplateobj.IsOpenIntraopOrderTemplate = false;
                        $scope.IntraOpTemplateobj.TemplateName = '';
                    }
                    else {
                        $scope.IntraOpTemplateobj.IsOpenOrderTemplate = false;
                        $scope.IntraOpTemplateobj.TemplateName = '';
                    }
                }
                if (resp.data.status === "Failure") {
                    alertify.error('TemplateName Already Exists')
                }
            }, function (err) {
                console.log(err);
            });

        };

        $scope.OnPostopSelectOrderTemplate = function (Mainitem) {
            //let templist = $filter("filter")($scope.PostOpObj.OrderDetails, {  "MedTypeId": 5, 'IsOrderReviewed': false, 'DeleteInd': 'N' }, true);
            let templist = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                return oitem.MedTypeId === 5 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
            }) || [];
            if (templist.length > 0) {
                if (Mainitem.PostOpMedications.length > 0) {
                    angular.forEach(Mainitem.PostOpMedications, function (item) {
                        var i = 0;
                        angular.forEach($scope.PostOpObj.OrderDetails, function (mitem) {
                            if (mitem.MedTypeId == 5) {
                                angular.forEach(mitem.PostOpMedications, function (citem) {
                                    if (citem.MedicineId == item.MedicineId && citem.DeleteInd == "N") {
                                        i++
                                    }
                                });
                            }

                        });
                        if (i == 0) {
                            let List1 = $filter("filter")(templist[0].PostOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                            let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                            if (List.length == 0) {
                                let GivenBy = null;
                                let loggedUser = $filter('filter')($scope.NurseAnesthetistArray, { 'DoctorID': $scope.UserId }, true) || [];
                                if (loggedUser.length > 0) {
                                    GivenBy = loggedUser[0].DoctorID;
                                }


                                var obj = {
                                    "AscMedicationId": 0,
                                    "OrganizationMedicationId": item.OrganizationPrescriptionId,
                                    "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                                    "ParentOrganizationId": $scope.ParenthospitalId,
                                    "ASCOrganizationMedicationId": 0,
                                    "Strength": item.Strength || '',
                                    "IsFrequent": item.IsFrequent || 'N',
                                    "MedicineId": item.MedicineId,
                                    "MedicationName": item.MedicationName,
                                    "IsChecked": false,
                                    "IsDilationMed": false,
                                    "IsIntraAnesthesiaMed": false,
                                    "IsIntraMed": false,
                                    "IsPreOPMed": false,
                                    "MedicationDosage": "",
                                    "DropTimings": [],
                                    "TypeId": 4,
                                    "DeleteInd": "N",
                                    "Action": item.Action,
                                    "Dose": item.Dose,
                                    "DoseUnit": item.DoseUnit,
                                    "Route": item.Route,
                                    "Frequency": item.Frequency,
                                    "ActionId": item.ActionId,
                                    "DoseId": item.DoseId,
                                    "DoseUnitId": item.DoseUnitId,
                                    "RouteId": item.RouteId,
                                    "FrequencyId": item.FrequencyId,
                                    "OrderDescription": item.OrderDescription,
                                    "MedicationNotes": item.MedicationNotes,
                                    "maxDose": item.maxDose,
                                    "OrderTypeId": item.OrderTypeId,
                                    "OrderTypeName": item.OrderTypeName
                                }
                                templist[0].PostOpMedications.push(obj);
                                $scope.PostOpMedicationObj.MedicineObject = "";

                            }
                        }
                    });
                }
                if (Mainitem.GeneralOrders.length > 0) {
                    angular.forEach(Mainitem.GeneralOrders, function (item) {
                        var j = 0;
                        angular.forEach($scope.PostOpObj.OrderDetails, function (mitem) {
                          
                                angular.forEach(mitem.GeneralOrders, function (citem) {
                                    if (citem.MedicineName == item.MedicineName && citem.DeleteInd == "N") {
                                        j++
                                    }
                                });

                        });
                        if (j == 0) {
                            let Gobj = {
                                "GeneralOrderId": null,
                                "MedicineName": item.MedicineName || '',
                                "DeleteInd": "N",
                                "Status": "",

                            }
                            templist[0].GeneralOrders.push(Gobj);
                        }
                    });
                }
            }
            else {

                //let templist2 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                let templist2 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                    return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                }) || [];
                if (templist2.length > 0) {
                    templist2[0].MedTypeId = 5;
                    templist2[0].MedTypeName = 'PostOp Medication';
                } else {
                    //let templist3 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 5, 'DeleteInd': 'N' }, true) || [];
                    let templist3 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === 5 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist3.length > 0) {

                    } else {
                        var obj = {
                            "UserOrderId": 0,
                            "UserId": $scope.UserId,
                            "DeleteInd": "N",
                            "ReviewedBy": null,
                            "IsOrderReviewed": false,
                            "ReviewedByDateTime": null,
                            "ReviewedByPassword": '',
                            "UserType": "Nurse",
                            "ScreenType": "PostOp",
                            "ScreenTypeId": 6,
                            "MedTypeId": 5,
                            "MedTypeName": 'PostOp Medication',
                            "PostOpMedications": [],
                            "GeneralOrders": [],
                            "OrderTypeId": OrderTypeId || 0,
                            "OrderTypeName": OrderTypeName || '',
                        }
                        $scope.PostOpObj.OrderDetails.push(obj);
                    }

                }
                //let templist1 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 5, 'DeleteInd': 'N' }, true) || [];\
                let templist1 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                    return oitem.MedTypeId === 5 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                }) || [];
                if (templist1.length > 0) {

                    if (Mainitem.PostOpMedications.length > 0) {
                        angular.forEach(Mainitem.PostOpMedications, function (item) {
                            var i = 0;
                            angular.forEach($scope.PostOpObj.OrderDetails, function (mitem) {
                                if (mitem.MedTypeId == 5) {
                                angular.forEach(mitem.PostOpMedications, function (citem) {
                                    if (citem.MedicineId == item.MedicineId && citem.DeleteInd == "N") {
                                        i++
                                    }
                                });
                                    }
                            });
                            if (i == 0) {
                                let List = $filter("filter")(templist1[0].PostOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId, 'DeleteInd': 'N' }, true) || [];

                                if (List.length == 0) {
                                    let GivenBy = null;
                                    let loggedUser = $filter('filter')($scope.NurseAnesthetistArray, { 'DoctorID': $scope.UserId }, true) || [];
                                    if (loggedUser.length > 0) {
                                        GivenBy = loggedUser[0].DoctorID;
                                    }


                                    var obj = {
                                        "AscMedicationId": 0,
                                        "OrganizationMedicationId": item.OrganizationPrescriptionId,
                                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                                        "ParentOrganizationId": $scope.ParenthospitalId,
                                        "ASCOrganizationMedicationId": 0,
                                        "Strength": item.Strength || '',
                                        "IsFrequent": item.IsFrequent || 'N',
                                        "MedicineId": item.MedicineId,
                                        "MedicationName": item.MedicationName,
                                        "IsChecked": false,
                                        "IsDilationMed": false,
                                        "IsIntraAnesthesiaMed": false,
                                        "IsIntraMed": false,
                                        "IsPreOPMed": false,
                                        "MedicationDosage": "",
                                        "DropTimings": [],
                                        "TypeId": 4,
                                        "DeleteInd": "N",
                                        "Action": item.Action,
                                        "Dose": item.Dose,
                                        "DoseUnit": item.DoseUnit,
                                        "Route": item.Route,
                                        "Frequency": item.Frequency,
                                        "ActionId": item.ActionId,
                                        "DoseId": item.DoseId,
                                        "DoseUnitId": item.DoseUnitId,
                                        "RouteId": item.RouteId,
                                        "FrequencyId": item.FrequencyId,
                                        "OrderDescription": item.OrderDescription,
                                        "MedicationNotes": item.MedicationNotes,
                                        "maxDose": item.maxDose,
                                        "OrderTypeId": item.OrderTypeId,
                                        "OrderTypeName": item.OrderTypeName
                                    }
                                    templist1[0].PostOpMedications.push(obj);
                                    $scope.PostOpMedicationObj.MedicineObject = "";


                                }
                            }
                        });
                    }

                    if (Mainitem.GeneralOrders.length > 0) {
                        angular.forEach(Mainitem.GeneralOrders, function (item) {
                            var j = 0;
                            angular.forEach($scope.PostOpObj.OrderDetails, function (mitem) {

                                angular.forEach(mitem.GeneralOrders, function (citem) {
                                    if (citem.MedicineName == item.MedicineName && citem.DeleteInd == "N") {
                                        j++
                                    }
                                });

                            });
                            if (j == 0) {
                                let Gobj = {
                                    "GeneralOrderId": null,
                                    "MedicineName": item.MedicineName || '',
                                    "DeleteInd": "N",
                                    "Status": "",

                                }
                                templist1[0].GeneralOrders.push(Gobj);
                                //$scope.PostOpMedicationObj.OrderName = "";
                            }
                        });
                    }
                }


            }

            let activeOrders = ($scope.PostOpObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 5);

            let isColumnTrue = activeOrders.some(order =>
                (order.PostOpMedications &&
                    order.PostOpMedications.some(item => item.DeleteInd === 'N'))
            );

            if (isColumnTrue) {
                $scope.PostOpObj.DisablePostOpSurgeonCheck = isColumnTrue;
                $scope.PostOpObj.IsPostOpSurgeonOrdersTimeAdded = !isColumnTrue;
            }
            
        }
        $scope.OnPostopAnesthesiaOrderTemplate = function (Mainitem) {
            //let templist = $filter("filter")($scope.PostOpObj.OrderDetails, { "MedTypeId": 8, 'IsOrderReviewed': false, 'DeleteInd': 'N' }, true);
            let templist = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                return oitem.MedTypeId === 8 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
            }) || [];
            if (templist.length > 0) {
                if (Mainitem.PostOpMedications.length > 0) {
                    angular.forEach(Mainitem.PostOpMedications, function (item) {
                        var i = 0;
                        angular.forEach($scope.PostOpObj.OrderDetails, function (mitem) {
                            if (mitem.MedTypeId == 8) {
                                angular.forEach(mitem.PostOpMedications, function (citem) {
                                    if (citem.MedicineId == item.MedicineId && citem.DeleteInd == "N") {
                                        i++
                                    }
                                });
                            }
                        });
                        if (i == 0) {
                            let List1 = $filter("filter")(templist[0].PostOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                            let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                            if (List.length == 0) {
                                let GivenBy = null;
                                let loggedUser = $filter('filter')($scope.NurseAnesthetistArray, { 'DoctorID': $scope.UserId }, true) || [];
                                if (loggedUser.length > 0) {
                                    GivenBy = loggedUser[0].DoctorID;
                                }


                                var obj = {
                                    "AscMedicationId": 0,
                                    "OrganizationMedicationId": item.OrganizationPrescriptionId,
                                    "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                                    "ParentOrganizationId": $scope.ParenthospitalId,
                                    "ASCOrganizationMedicationId": 0,
                                    "Strength": item.Strength || '',
                                    "IsFrequent": item.IsFrequent || 'N',
                                    "MedicineId": item.MedicineId,
                                    "MedicationName": item.MedicationName,
                                    "IsChecked": false,
                                    "IsDilationMed": false,
                                    "IsIntraAnesthesiaMed": false,
                                    "IsIntraMed": false,
                                    "IsPreOPMed": false,
                                    "MedicationDosage": "",
                                    "DropTimings": [],
                                    "TypeId": 4,
                                    "DeleteInd": "N",
                                    "Action": item.Action,
                                    "Dose": item.Dose,
                                    "DoseUnit": item.DoseUnit,
                                    "Route": item.Route,
                                    "Frequency": item.Frequency,
                                    "ActionId": item.ActionId,
                                    "DoseId": item.DoseId,
                                    "DoseUnitId": item.DoseUnitId,
                                    "RouteId": item.RouteId,
                                    "FrequencyId": item.FrequencyId,
                                    "OrderDescription": item.OrderDescription,
                                    "MedicationNotes": item.MedicationNotes,
                                    "maxDose": item.maxDose,
                                    "OrderTypeId": item.OrderTypeId,
                                    "OrderTypeName": item.OrderTypeName
                                }
                                templist[0].PostOpMedications.push(obj);
                                $scope.PostOpMedicationObj.MedicineObject = "";

                            }
                        }
                    });
                }
                if (Mainitem.GeneralOrders.length > 0) {
                    angular.forEach(Mainitem.GeneralOrders, function (item) {
                        var j = 0;
                        angular.forEach($scope.PostOpObj.OrderDetails, function (mitem) {

                            angular.forEach(mitem.GeneralOrders, function (citem) {
                                if (citem.MedicineName == item.MedicineName && citem.DeleteInd == "N") {
                                    j++
                                }
                            });

                        });
                        if (j == 0) {
                            let Gobj = {
                                "GeneralOrderId": null,
                                "MedicineName": item.MedicineName || '',
                                "DeleteInd": "N",
                                "Status": "",

                            }
                            templist[0].GeneralOrders.push(Gobj);
                        }
                    });
                }
            }
            else {

                //let templist2 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                let templist2 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                    return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                }) || [];
                if (templist2.length > 0) {
                    templist2[0].MedTypeId = 8;
                    templist2[0].MedTypeName = 'Postop Anesthesia Medications';
                } else {
                    //let templist3 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 8, 'DeleteInd': 'N' }, true) || [];
                    let templist3 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === 8 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist3.length > 0) {

                    } else {
                        var obj = {
                            "UserOrderId": 0,
                            "UserId": $scope.UserId,
                            "DeleteInd": "N",
                            "ReviewedBy": null,
                            "IsOrderReviewed": false,
                            "ReviewedByDateTime": null,
                            "ReviewedByPassword": '',
                            "UserType": "Anesthesia",
                            "ScreenType": "PostOp",
                            "ScreenTypeId": 6,
                            "MedTypeId": 8,
                            "MedTypeName": 'Postop Anesthesia Medications',
                            "PostOpMedications": [],
                            "GeneralOrders": [],
                            "OrderTypeId": OrderTypeId || 0,
                            "OrderTypeName": OrderTypeName || '',
                        }
                        $scope.PostOpObj.OrderDetails.push(obj);
                    }

                }
                //let templist1 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 8, 'DeleteInd': 'N' }, true) || [];
                let templist1 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                    return oitem.MedTypeId === 8 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                }) || [];
                if (templist1.length > 0) {

                    if (Mainitem.PostOpMedications.length > 0) {
                        angular.forEach(Mainitem.PostOpMedications, function (item) {
                            var i = 0;
                            angular.forEach($scope.PostOpObj.OrderDetails, function (mitem) {
                                if (mitem.MedTypeId == 8) {
                                    angular.forEach(mitem.PostOpMedications, function (citem) {
                                        if (citem.MedicineId == item.MedicineId && citem.DeleteInd == "N") {
                                            i++
                                        }
                                    });
                                }
                            });
                            if (i == 0) {
                                let List = $filter("filter")(templist1[0].PostOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId, 'DeleteInd': 'N' }, true) || [];

                                if (List.length == 0) {
                                    let GivenBy = null;
                                    let loggedUser = $filter('filter')($scope.NurseAnesthetistArray, { 'DoctorID': $scope.UserId }, true) || [];
                                    if (loggedUser.length > 0) {
                                        GivenBy = loggedUser[0].DoctorID;
                                    }


                                    var obj = {
                                        "AscMedicationId": 0,
                                        "OrganizationMedicationId": item.OrganizationPrescriptionId,
                                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                                        "ParentOrganizationId": $scope.ParenthospitalId,
                                        "ASCOrganizationMedicationId": 0,
                                        "Strength": item.Strength || '',
                                        "IsFrequent": item.IsFrequent || 'N',
                                        "MedicineId": item.MedicineId,
                                        "MedicationName": item.MedicationName,
                                        "IsChecked": false,
                                        "IsDilationMed": false,
                                        "IsIntraAnesthesiaMed": false,
                                        "IsIntraMed": false,
                                        "IsPreOPMed": false,
                                        "MedicationDosage": "",
                                        "DropTimings": [],
                                        "TypeId": 4,
                                        "DeleteInd": "N",
                                        "Action": item.Action,
                                        "Dose": item.Dose,
                                        "DoseUnit": item.DoseUnit,
                                        "Route": item.Route,
                                        "Frequency": item.Frequency,
                                        "ActionId": item.ActionId,
                                        "DoseId": item.DoseId,
                                        "DoseUnitId": item.DoseUnitId,
                                        "RouteId": item.RouteId,
                                        "FrequencyId": item.FrequencyId,
                                        "OrderDescription": item.OrderDescription,
                                        "MedicationNotes": item.MedicationNotes,
                                        "maxDose": item.maxDose,
                                        "OrderTypeId": item.OrderTypeId,
                                        "OrderTypeName": item.OrderTypeName
                                    }
                                    templist1[0].PostOpMedications.push(obj);
                                    $scope.PostOpMedicationObj.MedicineObject = "";


                                }
                            }
                        });
                    }

                    if (Mainitem.GeneralOrders.length > 0) {
                        angular.forEach(Mainitem.GeneralOrders, function (item) {
                            var j = 0;
                            angular.forEach($scope.PostOpObj.OrderDetails, function (mitem) {

                                angular.forEach(mitem.GeneralOrders, function (citem) {
                                    if (citem.MedicineName == item.MedicineName && citem.DeleteInd == "N") {
                                        j++
                                    }
                                });

                            });
                            if (j == 0) {
                                let Gobj = {
                                    "GeneralOrderId": null,
                                    "MedicineName": item.MedicineName || '',
                                    "DeleteInd": "N",
                                    "Status": "",

                                }
                                templist1[0].GeneralOrders.push(Gobj);
                                //$scope.PostOpMedicationObj.OrderName = "";
                            }
                        });
                    }
                }


            }

            let activeOrders = ($scope.PostOpObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 8);

            let isColumnTrue = activeOrders.some(order =>
                (order.PostOpMedications &&
                    order.PostOpMedications.some(item => item.DeleteInd === 'N'))
            );

            if (isColumnTrue) {
                $scope.PostOpObj.DisablePostOpAnesthesiaCheck = isColumnTrue;
                $scope.PostOpObj.IsPostOpAnesthesiaOrdersTimeAdded = !isColumnTrue;
            }
            
        }

        $scope.OrdersInit = function () {
            let FinalOrderDetails = $filter('filter')($scope.PostOpObj.OrderDetails, { 'MedTypeId': 5 }, true) || [];
            if (FinalOrderDetails.length > 0) {
                angular.forEach(FinalOrderDetails, function (Mitem) {
                    let temp = $filter('filter')(Mitem.PostOpMedications, { 'DeleteInd': 'N'}, true) || [];
                    let temp1 = $filter('filter')(Mitem.GeneralOrders, { 'DeleteInd': 'N'}, true) || [];
                    if (temp.length == 0 && temp1.length == 0) {
                        Mitem.DeleteInd = 'Y';
                    }
                });
            }

            let PostFinalOrderDetails = $filter('filter')($scope.PostOpObj.OrderDetails, { 'MedTypeId': 8 }, true) || [];
            if (PostFinalOrderDetails.length > 0) {
                angular.forEach(PostFinalOrderDetails, function (Mitem) {
                    let temp = $filter('filter')(Mitem.PostOpMedications, { 'DeleteInd': 'N' }, true) || [];
                    let temp1 = $filter('filter')(Mitem.GeneralOrders, { 'DeleteInd': 'N' }, true) || [];
                    if (temp.length == 0 && temp1.length == 0) {
                        Mitem.DeleteInd = 'Y';
                    }
                });
            }
            $scope.AllOrdersReviewed();
        }
        $scope.IntraOrdersInit = function () {
            let FinalOrderDetails = $filter('filter')($scope.IntraOpObj.OrderDetails, { 'MedTypeId': 3 }, true) || [];
            if (FinalOrderDetails.length > 0) {
                angular.forEach(FinalOrderDetails, function (Mitem) {
                    let temp = $filter('filter')(Mitem.IntraOpMedications, { 'DeleteInd': 'N' }, true) || [];
                    let temp1 = $filter('filter')(Mitem.GeneralOrders, { 'DeleteInd': 'N' }, true) || [];
                    if (temp.length == 0 && temp1.length == 0) {
                        Mitem.DeleteInd = 'Y';
                    }
                });
            }
            let IntraFinalOrderDetails = $filter('filter')($scope.IntraOpObj.OrderDetails, { 'MedTypeId': 4 }, true) || [];
            if (IntraFinalOrderDetails.length > 0) {
                angular.forEach(IntraFinalOrderDetails, function (Mitem) {
                    let temp = $filter('filter')(Mitem.IntraOpMedications, { 'DeleteInd': 'N' }, true) || [];
                    let temp1 = $filter('filter')(Mitem.GeneralOrders, { 'DeleteInd': 'N' }, true) || [];
                    if (temp.length == 0 && temp1.length == 0) {
                        Mitem.DeleteInd = 'Y';
                    }
                });
            }
            $scope.AllOrdersReviewed();
     }

     $scope.updatePostopOrderCheckbox = function (Type) {

         if (Type == 'PostOpMedications') {
             let activeOrders = ($scope.PostOpObj.OrderDetails || [])
                 .filter(order => order.DeleteInd === 'N' && order.MedTypeId == 5);

             if (activeOrders.length === 0) {
                 $scope.PostOpObj.DisablePostOpSurgeonCheck = false;
                 return;
             }

             let isAllDeleted = activeOrders.every(order => {

                 let dilation = order.PostOpMedications || [];

                 let noActiveDilation =
                     dilation.length === 0 ||
                     dilation.every(item => item.DeleteInd === 'Y');


                 return noActiveDilation;
             });

             $scope.PostOpObj.DisablePostOpSurgeonCheck = !isAllDeleted;
         }
         else if (Type == 'PostOpAnesthesiaMedications') {
             let activeOrders = ($scope.PostOpObj.OrderDetails || [])
                 .filter(order => order.DeleteInd === 'N' && order.MedTypeId == 8);

             if (activeOrders.length === 0) {
                 $scope.PostOpObj.DisablePostOpAnesthesiaCheck = false;
                 return;
             }

             let isAllDeleted = activeOrders.every(order => {

                 let dilation = order.PostOpMedications || [];

                 let noActiveDilation =
                     dilation.length === 0 ||
                     dilation.every(item => item.DeleteInd === 'Y');


                 return noActiveDilation;
             });

             $scope.PostOpObj.DisablePostOpAnesthesiaCheck = !isAllDeleted;
         }
     };

        $scope.DeleteMainPostopMediacation = function (item, Aitem, Type) {

            var index = Aitem.PostOpMedications.indexOf(item);
            if (item.AscMedicationId != 0) {
                alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {
                    if (index > -1) {
                        item.DeleteInd = 'Y';
                    }
                    $scope.updatePostopOrderCheckbox(Type);
                    $scope.$digest();
                    $scope.OrdersInit();
                }, function () {

                });
            }
            else {
                if (index > -1) {
                    Aitem.PostOpMedications.splice(index, 1);

                }
                $scope.updatePostopOrderCheckbox(Type);
            }
            $scope.OrdersInit();
        }
        $scope.DeleteGeneralOrder = function (Mitem, item,type) {
            var index = Mitem.GeneralOrders.indexOf(item);
            if (item.GeneralOrderId === 0 || item.GeneralOrderId === null) {
                if (index > -1) {
                    Mitem.GeneralOrders.splice(index, 1);
                }
            } else {
                item.DeleteInd = "Y";
            }

            if (type == 'PostOpMedications' || type == 'PostOpAnesthesiaMedications') {
                $scope.OrdersInit();
            }
            if (type == 'DilationMedication' || type == 'PreOpMediacation') {
                $scope.PreopOrderinit();
            }
            if (type == 'Physician') {
                $scope.PresurgeryOrderinit();
            }
            if (type == 'Anesthetist') {
                $scope.PresurgeryOrderinit();
            }
            if (type == 'IntraopMedications' || type == 'AnesthesiaMedications') {
                $scope.IntraOrdersInit();
            }
         
     }
     $scope.PostOpObj.IsClickSavePostOPBtn = false;
        $scope.SavePostOpMedication = function (str) {
            $scope.LogObj.LogArray = [];
            var i = 0;

            //let logdilationmedications = [];

            let K = 0;
            let g = 0;
            let v = 0;
            let gv = 0;
            let FinalOrderDetails = $scope.PostOpObj.OrderDetails || [];
            /*FinalOrderDetails = $filter('filter')($scope.PostOpObj.OrderDetails, { 'MedTypeId': 5 }, true) || [];*/
            if (FinalOrderDetails.length > 0) {
                angular.forEach(FinalOrderDetails, function (Mitem) {
                    Mitem.IsOrderReviewed = Mitem.IsOrderReviewed || false;
                    Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                    if (Mitem.MedTypeId == 5) {
                        Mitem.UserType = "Nurse";
                    } else {
                        Mitem.UserType = "Anesthesia";
                    }
                    if (Mitem.ReviewedBy != null && Mitem.IsOrderReviewed == false) {
                        if (Mitem.ReviewedByPassword == '') {
                            K++
                        }
                    }
                    if (Mitem.PostOpMedications.length > 0) {
                        angular.forEach(Mitem.PostOpMedications, function (item) {
                            item.IsPostOpMed = true;
                            if (item.MedTypeId == 5) {
                                item.UserType = "Nurse";
                            } else {
                                item.UserType = "Anesthesia";
                            }

                            if (item.DropTimings.length > 0) {
                                let tempArray = $filter('filter')(item.DropTimings, { 'GivenBy': null }, true);
                                if (tempArray.length > 0) {
                                    i++
                                }
                                // Task 13 - every timing must be validated with the Given By passcode before saving.
                                if (DropTimingGivenByService.GetNotValidatedCount(item.DropTimings) > 0) {
                                    v++
                                }
                            };
                            //logdilationmedications.push(item);
                        });
                    }
                    if (Mitem.GeneralOrders.length > 0) {
                        // Task 13 - custom orders marked Done need the Given By passcode too.
                        gv += DropTimingGivenByService.GetNotValidatedGeneralOrdersCount(Mitem.GeneralOrders);
                        angular.forEach(Mitem.GeneralOrders, function (item) {
                            if (item.Status == 'Done' && !item.GivenBy) {
                                g++;
                            }
                        });

                    }
                });
            }
            if (K !== 0) {
                alertify.error("Plese Enter Password");
                return false;
            }
            if (i !== 0) {
                alertify.error("Plese select Givenby for Medications!");
                return false;
            }
            if (v !== 0) {
                alertify.error("Please validate Given By password for Medications!");
                return false;
            }
            if (gv !== 0) {
                alertify.error("Please validate Given By password for Custom Orders!");
                return false;
            }
            if (g !== 0) {
                alertify.error("Plese select Givenby for General Orders!");
                //$rootScope.$broadcast("loader_hide");
                return false;
            }

            let j = 0;
            let logPostOpmedications = [], PostOpGeneralOrders = [];
            let PostOpOrderDetailsArray = $filter('filter')(FinalOrderDetails, { 'MedTypeId': 5 }, true) || [];

            if (PostOpOrderDetailsArray.length > 0) {
                angular.forEach(PostOpOrderDetailsArray, function (Mitem) {
                    if (Mitem.PostOpMedications.length > 0) {
                        angular.forEach(Mitem.PostOpMedications, function (item) {
                            logPostOpmedications.push(item);
                        })
                    }

                    if (Mitem.GeneralOrders.length > 0) {
                        angular.forEach(Mitem.GeneralOrders, function (item) {
                            PostOpGeneralOrders.push(item);
                        });

                    }

                    if ((Mitem.PostOpMedications && Mitem.PostOpMedications.length > 0) ||
                        (Mitem.GeneralOrders && Mitem.GeneralOrders.length > 0)) {
                        j++;
                    }
                })
            }
            if (j != 0) {
                if ($scope.LogObj.PostOpMedications.length > 0) {
                    $scope.ComparePostOpMedications(logPostOpmedications);
                } else {
                    angular.forEach(logPostOpmedications, function (item) {
                        let description = '';
                        let timingDescriptions = [];
                        if (item.DropTimings && item.DropTimings.length > 0) {
                            angular.forEach(item.DropTimings, function (dt) {
                                let medicationTime = dt.MedicationTime || '';
                                let givenById = dt.GivenBy || '';
                                let medicationDosage = dt.MedicationDosage || '';
                                let Remarks = dt.Remarks || '';

                                let givenByUser = '';
                                if (givenById) {
                                    let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                                    if (user) givenByUser = user.FullName;
                                }

                                let Notes = '';
                                if (Remarks) {
                                    Notes = 'Notes: ' + Remarks;
                                }

                                let timingDescription = `${medicationDosage} at ${medicationTime} by @ ${givenByUser} ${Notes}`;
                                timingDescriptions.push(timingDescription);
                            });

                            // Build conditional description
                            description =
                                (item.OrderDescription ? ` ${item.OrderDescription}\n` : '') +
                                (item.MedicationNotes ? `Notes: ${item.MedicationNotes}\n` : '') +
                                (timingDescriptions.length > 0 ? timingDescriptions.join(', ') : '');
                        } else {
                            description =
                                (item.OrderDescription ? ` ${item.OrderDescription}\n` : '') +
                                (item.MedicationNotes ? `Notes: ${item.MedicationNotes}\n` : '');

                        }

                        let obj = {
                            LogId: 0,
                            ModuleId: 2,
                            ModuleName: "ASC",
                            SubModuleId: 40,
                            SubModuleName: "All Orders",
                            ScreenType: "PostOp Orders",
                            ActionType: "Added",
                            OldActionDescription: "",
                            NewActionDescription: description.trim(),
                            ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    });
                }

                // General orders
                if (PostOpGeneralOrders.length > 0) {
                    if ($scope.LogObj.PostOpGeneralOrders.length > 0) {
                        $scope.ComparePostOpGeneralOrders(PostOpGeneralOrders);
                    } else {
                        angular.forEach(PostOpGeneralOrders, function (item) {

                            let description =
                                (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                                (item.Status ? `Status: ${item.Status}\n` : '') +
                                (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');
                            let givenById = item.GivenBy || '';
                            let givenByUser = '';
                            if (givenById) {
                                let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                                if (user) givenByUser = user.FullName;
                            }

                            if (item.Status == 'Done' && givenByUser) {
                                description += `by @ ${givenByUser}`;
                            }

                            let obj = {
                                LogId: 0,
                                ModuleId: 2,
                                ModuleName: "ASC",
                                SubModuleId: 40,
                                SubModuleName: "All Orders",
                                ScreenType: "PostOp Orders",
                                ActionType: "Added",
                                OldActionDescription: "",
                                NewActionDescription: description,
                                ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                            };
                            $scope.LogObj.LogArray.push(obj);
                        });
                    }
                }
            }

            $scope.LogObj.PostOpOrderDetails = $scope.LogObj.PostOpOrderDetails || [];
            if (PostOpOrderDetailsArray.length > 0 || $scope.LogObj.PostOpOrderDetails.length > 0) {
                angular.forEach(PostOpOrderDetailsArray, function (currentItem) {
                    currentItem.IsOrderReviewed = currentItem.IsOrderReviewed || false;
                    var edited = $scope.LogObj.PostOpOrderDetails.find(function (prev) {
                        return prev.UserOrderId === currentItem.UserOrderId;
                    });

                    if (currentItem.IsOrderReviewed && (!edited || edited.ReviewedBy !== currentItem.ReviewedBy)) {
                        let actionType = "Added";
                        let obj = {
                            LogId: 0,
                            ModuleId: 2,
                            ModuleName: "ASC",
                            SubModuleId: 40,
                            SubModuleName: "All Orders",
                            ScreenType: "PostOp Orders",
                            ActionType: actionType,
                            OldActionDescription: "",
                            NewActionDescription: `PostOp Orders Signed By ${currentItem.ReviewedByName}`,
                            ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }
                });
            }



            let M = 0;
            let logPostOpAnesthesiamedications = [], PostOpAnesthesiaGeneralOrders = [];
            let PostOpAnesthesiaOrderDetailsArray = $filter('filter')(FinalOrderDetails, { 'MedTypeId': 8 }, true) || [];

            if (PostOpAnesthesiaOrderDetailsArray.length > 0) {
                angular.forEach(PostOpAnesthesiaOrderDetailsArray, function (Mitem) {
                    if (Mitem.PostOpMedications.length > 0) {
                        angular.forEach(Mitem.PostOpMedications, function (item) {
                            logPostOpAnesthesiamedications.push(item);
                        })
                    }

                    if (Mitem.GeneralOrders.length > 0) {
                        angular.forEach(Mitem.GeneralOrders, function (item) {
                            PostOpAnesthesiaGeneralOrders.push(item);
                        });

                    }

                    if ((Mitem.PostOpMedications && Mitem.PostOpMedications.length > 0) ||
                        (Mitem.GeneralOrders && Mitem.GeneralOrders.length > 0)) {
                        M++;
                    }
                })
            }
            if (M != 0) {
                if ($scope.LogObj.PostOpAnesthesiaMedications.length > 0) {
                    $scope.ComparePostOpAnesthesiaMedications(logPostOpAnesthesiamedications);
                } else {
                    angular.forEach(logPostOpAnesthesiamedications, function (item) {
                        let description = '';
                        let timingDescriptions = [];
                        if (item.DropTimings && item.DropTimings.length > 0) {
                            angular.forEach(item.DropTimings, function (dt) {
                                let medicationTime = dt.MedicationTime || '';
                                let givenById = dt.GivenBy || '';
                                let medicationDosage = dt.MedicationDosage || '';
                                let Remarks = dt.Remarks || '';

                                let givenByUser = '';
                                if (givenById) {
                                    let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                                    if (user) givenByUser = user.FullName;
                                }

                                let Notes = '';
                                if (Remarks) {
                                    Notes = 'Notes: ' + Remarks;
                                }

                                let timingDescription = `${medicationDosage} at ${medicationTime} by @ ${givenByUser} ${Notes}`;
                                timingDescriptions.push(timingDescription);
                            });

                            // Build conditional description
                            description =
                                (item.OrderDescription ? ` ${item.OrderDescription}\n` : '') +
                                (item.MedicationNotes ? `Notes: ${item.MedicationNotes}\n` : '') +
                                (timingDescriptions.length > 0 ? timingDescriptions.join(', ') : '');
                        } else {
                            description =
                                (item.OrderDescription ? ` ${item.OrderDescription}\n` : '') +
                                (item.MedicationNotes ? `Notes: ${item.MedicationNotes}\n` : '');

                        }

                        let obj = {
                            LogId: 0,
                            ModuleId: 2,
                            ModuleName: "ASC",
                            SubModuleId: 40,
                            SubModuleName: "All Orders",
                            ScreenType: "PostOp Anesthesia Orders",
                            ActionType: "Added",
                            OldActionDescription: "",
                            NewActionDescription: description.trim(),
                            ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    });
                }

                // General orders
                if (PostOpAnesthesiaGeneralOrders.length > 0) {
                    if ($scope.LogObj.PostOpAnesthesiaGeneralOrders.length > 0) {
                        $scope.ComparePostOpAnesthesiaGeneralOrders(PostOpAnesthesiaGeneralOrders);
                    } else {
                        angular.forEach(PostOpAnesthesiaGeneralOrders, function (item) {

                            let description =
                                (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                                (item.Status ? `Status: ${item.Status}\n` : '') +
                                (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');
                            let givenById = item.GivenBy || '';
                            let givenByUser = '';
                            if (givenById) {
                                let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                                if (user) givenByUser = user.FullName;
                            }

                            if (item.Status == 'Done' && givenByUser) {
                                description += `by @ ${givenByUser}`;
                            }

                            let obj = {
                                LogId: 0,
                                ModuleId: 2,
                                ModuleName: "ASC",
                                SubModuleId: 40,
                                SubModuleName: "All Orders",
                                ScreenType: "PostOp Anesthesia Orders",
                                ActionType: "Added",
                                OldActionDescription: "",
                                NewActionDescription: description,
                                ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                            };
                            $scope.LogObj.LogArray.push(obj);
                        });
                    }
                }
            }

            $scope.LogObj.PostOpAnesthesiaOrderDetails = $scope.LogObj.PostOpAnesthesiaOrderDetails || [];
            if (PostOpAnesthesiaOrderDetailsArray.length > 0 || $scope.LogObj.PostOpAnesthesiaOrderDetails.length > 0) {
                angular.forEach(PostOpAnesthesiaOrderDetailsArray, function (currentItem) {
                    currentItem.IsOrderReviewed = currentItem.IsOrderReviewed || false;
                    var edited = $scope.LogObj.PostOpAnesthesiaOrderDetails.find(function (prev) {
                        return prev.UserOrderId === currentItem.UserOrderId;
                    });

                    if (currentItem.IsOrderReviewed && (!edited || edited.ReviewedBy !== currentItem.ReviewedBy)) {
                        let actionType = "Added";
                        let obj = {
                            LogId: 0,
                            ModuleId: 2,
                            ModuleName: "ASC",
                            SubModuleId: 40,
                            SubModuleName: "All Orders",
                            ScreenType: "PostOp Anesthesia Orders",
                            ActionType: actionType,
                            OldActionDescription: "",
                            NewActionDescription: `PostOp Anesthesia Orders Signed By ${currentItem.ReviewedByName}`,
                            ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }
                });
            }

            let Req = {
                "VisitId": $scope.cacheStorageItem.PatientVisitId,
                //"ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,
                "PatientASCPostOPId": $scope.PostOpObj.PatientASCPostOPId || null,
                "UserId": $scope.UserId || null,
                "HospitalId": $scope.HospitalId || null,
                "PatientId": $scope.cacheStorageItem.PatientID || null,             
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "PostOpNurseChartStatus": $scope.PostOpObj.PostOpNurseChartStatus || "D",
                "PostOpChartStatus": (str === "SignOff") ? "E" : "D",               
                "PostOpAnesthesiaChartStatus": $scope.PostOpObj.PostOpAnesthesiaChartStatus || "D",
                "OrderDetails": FinalOrderDetails || [],
                "Logs": {},
                "IsPostOpSurgeonOrdersTimeAdded": $scope.PostOpObj.IsPostOpSurgeonOrdersTimeAdded ||false ,
                "IsPostOpAnesthesiaOrdersTimeAdded": $scope.PostOpObj.IsPostOpAnesthesiaOrdersTimeAdded ||false ,
            
            }

            //if ($scope.cacheStorageItem.CheckinStatusId == 1) {
            //    Req.PostOpNurseChartStatus = '';
            //    Req.PostOpAnesthesiaChartStatus = '';
            //    Req.PostOpChartStatus = '';
            //}

            if ($scope.LogObj.LogArray.length > 0) {
                Req.Logs = $scope.LogObj || {};
            }

            if ($scope.cacheStorageItem.AdmissionId == 0) {
                Req.PostOpNurseChartStatus = '';
                Req.PostOpAnesthesiaChartStatus = '';
                Req.PostOpChartStatus = '';
            }
            $scope.PostOpObj.IsClickSavePostOPBtn = true;
            eHnoteSurgeryService.AddUpdatePostOPMedications(Req).then(function (resp) {
                if (resp.data.Status === "Success") {
                    alertify.success("Data Submitted successfully!");
                    $scope.init();
                    $scope.PostOpObj.IsClickSavePostOPBtn = false;
                }
            }, function (err) {
                $scope.PostOpObj.IsClickSavePostOPBtn = false;
                console.log(err);
            });
         
        }

   


        //$scope.SelectIntraOpMedicationItems = function (item, type) {          
        //    let List1 = $filter("filter")($scope.IntraOpObj.IntraOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
        //    let List = $filter("filter")(List1, { 'DeleteInd': 'N' }, true);
        //    if (List.length > 0) {
        //        alertify.error("Medicine name already added!");
        //        $scope.IntraOpMedicationObj.MedicineObject = "";
        //        return false;
        //    }

        //    let GivenByintraop = null;
        //    let loggedUser = $filter('filter')($scope.MedicationOnlyMDGivenByArray, { 'DoctorID': $scope.UserId }, true);
        //    if (loggedUser.length > 0) {
        //        GivenByintraop = loggedUser[0].DoctorID;
        //    }

        //    if (type == 'Frequently') {
        //        var obj = {
        //            "AscMedicationId": 0,
        //            "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //            "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //            "ParentOrganizationId": $scope.ParenthospitalId,
        //            "ASCOrganizationMedicationId": 0,
        //            "MedicineId": item.MedicineId,
        //            "MedicationName": item.MedicationName,
        //            "IsFrequent": item.IsFrequent || 'N',
        //            "IsChecked": false,
        //            "MedicationDosage": "",
        //            "Strength": item.Strength || '',
        //            "DropTimings": [],
        //            //"DropTimings": [{
        //            //    "DropTimingId": 0,
        //            //    "MedicineId": item.MedicineId,
        //            //    "MedicationName": item.MedicationName,
        //            //    "GivenBy": GivenByintraop || null,
        //            //    "shownotes": false,
        //            //    "IsEditDrop": false,
        //            //    "IsEditview": false,
        //            //    "Remarks": "",
        //            //    "DeleteInd": "N",
        //            //    "MedicationTime": "",
        //            //    "MedicationDosage": ""
        //            //}],
        //            "TypeId": 4,
        //            "DeleteInd": "N"
        //        }
        //        $scope.IntraOpObj.IntraOpMedications.push(obj);
        //        $scope.IntraOpMedicationObj.MedicineObject = "";
        //    } else {
        //        var obj = {
        //            "AscMedicationId": 0,
        //            "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //            "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //            "ParentOrganizationId": $scope.ParenthospitalId,
        //            "ASCOrganizationMedicationId": 0,
        //            "IsFrequent": item.IsFrequent || 'N',
        //            "MedicineId": item.MedicineId,
        //            "MedicationName": item.MedicineName,
        //            "IsChecked": false,
        //            "MedicationDosage": "",
        //            "Strength": item.Strength || '',
        //            "DropTimings": [],
        //            //"DropTimings": [{
        //            //    "DropTimingId": 0,
        //            //    "MedicineId": item.MedicineId,
        //            //    "MedicationName": item.MedicineName,
        //            //    "GivenBy": GivenByintraop || null,
        //            //    "shownotes": false,
        //            //    "IsEditDrop": false,
        //            //    "IsEditview": false,
        //            //    "Remarks": "",
        //            //    "DeleteInd": "N",
        //            //    "MedicationTime": "",
        //            //    "MedicationDosage": ""
        //            //}],
        //            "TypeId": 4,
        //            "DeleteInd": "N"
        //        }
        //        $scope.IntraOpObj.IntraOpMedications.push(obj);
        //        $scope.IntraOpMedicationObj.MedicineObject = "";
        //    }

        //}


        //new intraop medicaion/// 

        //$scope.SelectIntraOpMedicationItems = function (item, type) {
        //    //let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, { "MedTypeId": 4, 'IsOrderReviewed': false, 'DeleteInd': 'N' }, true);
        //    let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
        //        return oitem.MedTypeId === 4 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
        //    }) || [];
        //    let i = 0;
        //    angular.forEach($scope.IntraOpObj.OrderDetails, function (mitem) {
        //        if (mitem.MedTypeId == 4) {
        //            angular.forEach(mitem.IntraOpMedications, function (Aitem) {
        //                if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
        //                    i++;
        //                }
        //            });
        //        }
        //    });

        //    if (i > 0) {
        //        alertify.error('You have already entered this Medication');
        //        $scope.IntraOpMedicationObj.MedicineObject = "";
        //        return false;
        //    }
        //    // let templist = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": $scope.UserId, "MedTypeId": 5, 'IsOrderReviewed': false }, true);

        //    if (templist.length > 0) {

        //        let List1 = $filter("filter")(templist[0].IntraOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
        //        let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
        //        if (List.length > 0) {
        //            alertify.error("Medicine name already added!");
        //            $scope.IntraOpMedicationObj.MedicineObject = '';
        //            return false;
        //        }
        //        let GivenBy = null;
        //        let loggedUser = $filter('filter')($scope.SurgeonArray, { 'DoctorID': $scope.UserId }, true) || [];
        //        if (loggedUser.length > 0) {
        //            GivenBy = loggedUser[0].DoctorID;
        //        }

        //        if (type == 'Frequently') {
        //            var obj = {
        //                "AscMedicationId": 0,
        //                "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                "ParentOrganizationId": $scope.ParenthospitalId,
        //                "ASCOrganizationMedicationId": 0,
        //                "Strength": item.Strength || '',
        //                "IsFrequent": item.IsFrequent || 'N',
        //                "MedicineId": item.MedicineId,
        //                "MedicationName": item.MedicationName,
        //                "IsChecked": false,
        //                "IsDilationMed": false,
        //                "IsIntraAnesthesiaMed": false,
        //                "IsIntraMed": false,
        //                "IsPreOPMed": false,
        //                "MedicationDosage": "",
        //                "DropTimings": [],
        //                "TypeId": 4,
        //                "DeleteInd": "N"
        //            }
        //            templist[0].IntraOpMedications.push(obj);
        //            $scope.IntraOpMedicationObj.MedicineObject = "";
        //        } else {
        //            var obj = {
        //                "AscMedicationId": 0,
        //                "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                "ParentOrganizationId": $scope.ParenthospitalId,
        //                "ASCOrganizationMedicationId": 0,
        //                "Strength": item.Strength || '',
        //                "IsFrequent": item.IsFrequent || 'N',
        //                "MedicineId": item.MedicineId,
        //                "MedicationName": item.MedicineName,
        //                "IsChecked": false,
        //                "IsDilationMed": false,
        //                "IsIntraAnesthesiaMed": false,
        //                "IsIntraMed": false,
        //                "IsPreOPMed": false,
        //                "MedicationDosage": "",
        //                "DropTimings": [],
        //                "TypeId": 4,
        //                "DeleteInd": "N"
        //            }
        //            templist[0].IntraOpMedications.push(obj);
        //            $scope.IntraOpMedicationObj.MedicineObject = "";

                   
        //        }
        //    } else {

        //        //let templist2 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
        //        let templist2 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
        //            return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
        //        }) || [];
        //        if (templist2.length > 0) {
        //            templist2[0].MedTypeId = 4;
        //            templist2[0].MedTypeName = 'Intra Medications';
        //        } else {

        //            //let templist3 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 4, 'DeleteInd': 'N' }, true) || [];
        //            let templist3 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
        //                return oitem.MedTypeId === 4 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
        //            }) || [];
        //            if (templist3.length > 0) {

        //            } else {
        //                var obj = {
        //                    "UserOrderId": 0,
        //                    "UserId": $scope.UserId,
        //                    "DeleteInd": "N",
        //                    "IsOrderReviewed": false,
        //                    "ReviewedByPassword": '',
        //                    "ReviewedBy": null,
        //                    "UserType": "Nurse",
        //                    "ScreenType": "Intra-OP",
        //                    "ScreenTypeId": 5,
        //                    "MedTypeId": 4,
        //                    "MedTypeName": 'Intra Medication',
        //                    "IntraOpMedications": [],
        //                    "GeneralOrders": [],
        //                    "OrderTypeId": OrderTypeId || 0,
        //                    "OrderTypeName": OrderTypeName || '',
        //                }
        //                $scope.IntraOpObj.OrderDetails.push(obj);
        //            }

        //        }
        //        //let templist1 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 4, 'DeleteInd': 'N' }, true) || [];
        //        let templist1 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
        //            return oitem.MedTypeId === 4 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
        //        }) || [];
        //        if (templist1.length > 0) {
        //            let List1 = $filter("filter")(templist1[0].IntraOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
        //            let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
        //            if (List.length > 0) {
        //                alertify.error("Medicine name already added!");
        //                $scope.IntraOpMedicationObj.MedicineObject = "";
        //                return false;
        //            }
        //            let GivenBy = null;
        //            let loggedUser = $filter('filter')($scope.SurgeonArray, { 'DoctorID': $scope.UserId }, true) || [];
        //            if (loggedUser.length > 0) {
        //                GivenBy = loggedUser[0].DoctorID;
        //            }

        //            if (type == 'Frequently') {
        //                var obj = {
        //                    "AscMedicationId": 0,
        //                    "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                    "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                    "ParentOrganizationId": $scope.ParenthospitalId,
        //                    "ASCOrganizationMedicationId": 0,
        //                    "Strength": item.Strength || '',
        //                    "IsFrequent": item.IsFrequent || 'N',
        //                    "MedicineId": item.MedicineId,
        //                    "MedicationName": item.MedicationName,
        //                    "IsChecked": false,
        //                    "IsDilationMed": false,
        //                    "IsIntraAnesthesiaMed": false,
        //                    "IsIntraMed": false,
        //                    "IsPreOPMed": false,
        //                    "MedicationDosage": "",
        //                    "DropTimings": [],
        //                    "TypeId": 4,
        //                    "DeleteInd": "N"
        //                }
        //                templist1[0].IntraOpMedications.push(obj);
        //                $scope.IntraOpMedicationObj.MedicineObject = "";
        //            } else {
        //                var obj = {
        //                    "AscMedicationId": 0,
        //                    "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                    "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                    "ParentOrganizationId": $scope.ParenthospitalId,
        //                    "ASCOrganizationMedicationId": 0,
        //                    "Strength": item.Strength || '',
        //                    "IsFrequent": item.IsFrequent || 'N',
        //                    "MedicineId": item.MedicineId,
        //                    "MedicationName": item.MedicineName,
        //                    "IsChecked": false,
        //                    "IsDilationMed": false,
        //                    "IsIntraAnesthesiaMed": false,
        //                    "IsIntraMed": false,
        //                    "IsPreOPMed": false,
        //                    "MedicationDosage": "",
        //                    "DropTimings": [],
        //                    "TypeId": 4,
        //                    "DeleteInd": "N"
        //                }
        //                templist1[0].IntraOpMedications.push(obj);
        //                $scope.IntraOpMedicationObj.MedicineObject = "";
        //            }

        //        }
        //    }
           
        //}


        //$scope.SelectAnesthesiaMedicationItems = function (item, type) {      
        //    let List1 = $filter("filter")($scope.IntraOpObj.AnesthesiaMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
        //    let List = $filter("filter")(List1, { 'DeleteInd': 'N' }, true);
        //    if (List.length > 0) {
        //        alertify.error("Medicine name already added!");
        //        $scope.AnesthesiaMedicationObj.MedicineObject = "";
        //        return false;
        //    }

        //    let GivenByAnesthesia = null;
        //    let loggedUser = $filter('filter')($scope.AnesthetistArray, { 'DoctorID': $scope.UserId }, true);
        //    if (loggedUser.length > 0) {
        //        GivenByAnesthesia = loggedUser[0].DoctorID;
        //    }


        //    if (type == 'Frequently') {
        //        var obj = {
        //            "AscMedicationId": 0,
        //            "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //            "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //            "ParentOrganizationId": $scope.ParenthospitalId,
        //            "ASCOrganizationMedicationId": 0,
        //            "MedicineId": item.MedicineId,
        //            "MedicationName": item.MedicationName,
        //            "IsFrequent": item.IsFrequent || 'N',
        //            "IsChecked": false,
        //            "MedicationDosage": "",
        //            "Strength": item.Strength || '',
        //            "DropTimings": [],
        //            //"DropTimings": [{
        //            //    "DropTimingId": 0,
        //            //    "MedicineId": item.MedicineId,
        //            //    "MedicationName": item.MedicationName,
        //            //    "GivenBy": GivenByAnesthesia || null,
        //            //    "shownotes": false,
        //            //    "IsEditDrop": false,
        //            //    "IsEditview": false,
        //            //    "Remarks": "",
        //            //    "DeleteInd": "N",
        //            //    "MedicationTime": "",
        //            //    "MedicationDosage": ""
        //            //}],
        //            "TypeId": 3,
        //            "DeleteInd": "N"
        //        }
        //        $scope.IntraOpObj.AnesthesiaMedications.push(obj);
        //        $scope.AnesthesiaMedicationObj.MedicineObject = "";
        //    } else {
        //        var obj = {
        //            "AscMedicationId": 0,
        //            "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //            "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //            "ParentOrganizationId": $scope.ParenthospitalId,
        //            "ASCOrganizationMedicationId": 0,
        //            "MedicineId": item.MedicineId,
        //            "MedicationName": item.MedicineName,
        //            "IsFrequent": item.IsFrequent || 'N',
        //            "IsChecked": false,
        //            "MedicationDosage": "",
        //           "Strength": item.Strength || '',
        //            "DropTimings": [],
        //            //"DropTimings": [{
        //            //    "DropTimingId": 0,
        //            //    "MedicineId": item.MedicineId,
        //            //    "MedicationName": item.MedicineName,
        //            //    "GivenBy": GivenByAnesthesia || null,
        //            //    "shownotes": false,
        //            //    "IsEditDrop": false,
        //            //    "IsEditview": false,
        //            //    "Remarks": "",
        //            //    "DeleteInd": "N",
        //            //    "MedicationTime": "",
        //            //    "MedicationDosage": ""
        //            //}],
        //            "TypeId": 3,
        //            "DeleteInd": "N"
        //        }
        //        $scope.IntraOpObj.AnesthesiaMedications.push(obj);
        //        $scope.AnesthesiaMedicationObj.MedicineObject = "";
        //    }

        //};

       


     $scope.AddIntraOpDropsTime = function (obj, type) {

         

         //let templength = obj.DropTimings.length;


         let activeTimings = obj.DropTimings.filter(x => x.DeleteInd !== "Y");
         let templength = activeTimings.length;

            if (templength > 0) {
                let value = obj.DropTimings[templength - 1].MedicationTime;
                let GivenBy = obj.DropTimings[templength - 1].GivenBy;
                if (value == "") {
                    alertify.error("Please enter time!");
                    return;
                }
                GivenBy = GivenBy || null;
                if (GivenBy == null) {
                    alertify.error("Please Select GivenBy for Medications!");
                    return;
                }
            }


            let IntraGivenBy = null;
            if (type == 'IntraopMedications') {
                let loggedUser = $filter('filter')($scope.MedicationOnlyMDGivenByArray, { 'DoctorID': $scope.UserId }, true);
                if (loggedUser.length > 0) {
                    IntraGivenBy = loggedUser[0].DoctorID;
                }
            }
            if (type == 'AnesthesiaMedications') {
                let loggedUser = $filter('filter')($scope.AnesthetistArray, { 'DoctorID': $scope.UserId }, true);
                if (loggedUser.length > 0) {
                    IntraGivenBy = loggedUser[0].DoctorID;
                }
            }
            let object = {
                "DropTimingId": 0,
                "MedicineId": obj.MedicineId,
                "MedicationName": obj.MedicationName,
                "GivenBy": IntraGivenBy || null,
                "shownotes": false,
                "IsEditDrop": false,
                "IsEditview": false,
                "Remarks": "",
                "DeleteInd": "N",
                "MedicationTime": "",
                "MedicationDosage": ""
            };
            obj.DropTimings.push(object);
        };

        //$scope.DeleteMainMediacation = function (item, Type) {
        //    if (Type == 'IntraOpMedications') {
        //        var index = $scope.IntraOpObj.IntraOpMedications.indexOf(item);
        //    } else {
        //        var index = $scope.IntraOpObj.AnesthesiaMedications.indexOf(item);
        //    }


        //    if (item.AscMedicationId != 0) {
        //        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {
        //            if (index > -1) {
        //                item.DeleteInd = 'Y';
        //            }
        //            $scope.$digest();
        //            // $scope.PreopOrderinit(Type);
        //        }, function () {

        //        });
        //    }
        //    else {
        //        if (index > -1) {
        //            if (Type == 'IntraOpMedications') {
        //                $scope.IntraOpObj.IntraOpMedications.splice(index, 1);
        //            } else {
        //                $scope.IntraOpObj.AnesthesiaMedications.splice(index, 1);
        //            }


        //        }
        //    }

        //    // $scope.PreopOrderinit(Type);
        //}

        $scope.DeleteIntraOpDrop = function (item, Aitem) {
            Aitem.DropTimingId = Aitem.DropTimingId || 0;
            var index = item.DropTimings.indexOf(Aitem);
            if (Aitem.DropTimingId != 0) {
                alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {

                    if (index > -1) {
                        Aitem.DeleteInd = 'Y';
                        //let tempArray = $filter('filter')(item.DropTimings, { 'DeleteInd': 'N' }, true);
                        //if (tempArray.length == 0) {
                        //    item.DeleteInd = 'Y';
                        //}
                    }

                    $scope.$digest();
                }, function () {
                });
            }
            else {
                if (index > -1) {
                    item.DropTimings.splice(index, 1);
                    //let tempArray = $filter('filter')(item.DropTimings, { 'DeleteInd': 'N' }, true);
                    //if (tempArray.length == 0) {
                    //    $scope.PostOpObj.PostOpMedications.splice(index1, 1);
                    //}
                }
            }

        }


        //$scope.OnIntraOpSelectOrderTemplate = function (Mainitem, medtype) {
        //    console.log(Mainitem);
        //    if (medtype == 3) {
        //        if (Mainitem.AnesthesiaMedications.length > 0) {
        //            angular.forEach(Mainitem.AnesthesiaMedications, function (item) {

        //                var List = $filter("filter")($scope.IntraOpObj.AnesthesiaMedications, function (Aitem, index) { return Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == "N" }) || [];
        //                if (List.length == 0) {
        //                    let GivenBy = null;
        //                    let loggedUser = $filter('filter')($scope.AnesthetistArray, { 'DoctorID': $scope.UserId }, true) || [];
        //                    if (loggedUser.length > 0) {
        //                        GivenBy = loggedUser[0].DoctorID;
        //                    }
        //                    var obj = {
        //                        "AscMedicationId": 0,
        //                        "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                        "ParentOrganizationId": $scope.ParenthospitalId,
        //                        "ASCOrganizationMedicationId": 0,
        //                        "Strength": item.Strength || '',
        //                        "IsFrequent": item.IsFrequent || 'N',
        //                        "MedicineId": item.MedicineId,
        //                        "MedicationName": item.MedicationName,
        //                        "IsChecked": false,
        //                        "IsDilationMed": false,
        //                        "IsIntraAnesthesiaMed": false,
        //                        "IsIntraMed": false,
        //                        "IsPreOPMed": false,
        //                        "MedicationDosage": "",
        //                        // "DropTimings": [],
        //                        "DropTimings": [{
        //                            "DropTimingId": 0,
        //                            "MedicineId": item.MedicineId,
        //                            "MedicationName": item.MedicationName,
        //                            "GivenBy": GivenBy || null,
        //                            "shownotes": false,
        //                            "IsEditDrop": false,
        //                            "IsEditview": false,
        //                            "Remarks": "",
        //                            "DeleteInd": "N",
        //                            "MedicationTime": "",
        //                            "MedicationDosage": ""
        //                        }],
        //                        "TypeId": 4,
        //                        "DeleteInd": "N"
        //                    }

        //                    $scope.IntraOpObj.AnesthesiaMedications.push(obj);
        //                    $scope.IntraOpMedicationObj.MedicineObject = "";
        //                }



        //            });
        //        }

        //    }
        //    else {
        //        if (Mainitem.IntraOpMedications.length > 0) {
        //            angular.forEach(Mainitem.IntraOpMedications, function (item) {

        //                var List = $filter("filter")($scope.IntraOpObj.IntraOpMedications, function (Aitem, index) { return Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == "N" }) || [];
        //                if (List.length == 0) {
        //                    let GivenBy = null;
        //                    let loggedUser = $filter('filter')($scope.MedicationOnlyMDGivenByArray, { 'DoctorID': $scope.UserId }, true) || [];
        //                    if (loggedUser.length > 0) {
        //                        GivenBy = loggedUser[0].DoctorID;
        //                    }
        //                    var obj = {
        //                        "AscMedicationId": 0,
        //                        "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                        "ParentOrganizationId": $scope.ParenthospitalId,
        //                        "ASCOrganizationMedicationId": 0,
        //                        "Strength": item.Strength || '',
        //                        "IsFrequent": item.IsFrequent || 'N',
        //                        "MedicineId": item.MedicineId,
        //                        "MedicationName": item.MedicationName,
        //                        "IsChecked": false,
        //                        "IsDilationMed": false,
        //                        "IsIntraAnesthesiaMed": false,
        //                        "IsIntraMed": false,
        //                        "IsPreOPMed": false,
        //                        "MedicationDosage": "",
        //                        // "DropTimings": [],
        //                        "DropTimings": [{
        //                            "DropTimingId": 0,
        //                            "MedicineId": item.MedicineId,
        //                            "MedicationName": item.MedicationName,
        //                            "GivenBy": GivenBy || null,
        //                            "shownotes": false,
        //                            "IsEditDrop": false,
        //                            "IsEditview": false,
        //                            "Remarks": "",
        //                            "DeleteInd": "N",
        //                            "MedicationTime": "",
        //                            "MedicationDosage": ""
        //                        }],
        //                        "TypeId": 4,
        //                        "DeleteInd": "N"
        //                    }

        //                    $scope.IntraOpObj.IntraOpMedications.push(obj);
        //                    $scope.IntraOpMedicationObj.MedicineObject = "";
        //                }



        //            });
        //        }
        //    }
        //}

        $scope.OnIntraOpSelectOrderTemplate = function (Mainitem, medtype) {
            if (medtype == 4) {
                //let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, { "MedTypeId": 4, 'IsOrderReviewed': false, 'DeleteInd': 'N'  }, true);
                let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                    return oitem.MedTypeId === 4 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                }) || [];
                if (templist.length > 0) {
                    if (Mainitem.IntraOpMedications.length > 0) {
                        angular.forEach(Mainitem.IntraOpMedications, function (item) {
                            var i = 0;
                            angular.forEach($scope.IntraOpObj.OrderDetails, function (mitem) {
                                if (mitem.MedTypeId == 4) {
                                    angular.forEach(mitem.IntraOpMedications, function (citem) {
                                        if (citem.MedicineId == item.MedicineId && citem.DeleteInd == "N") {
                                            i++
                                        }
                                    });
                                }

                            });
                            if (i == 0) {
                                let List1 = $filter("filter")(templist[0].IntraOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                                let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                                if (List.length == 0) {
                                    let GivenBy = null;
                                    let loggedUser = $filter('filter')($scope.MedicationOnlyMDGivenByArray, { 'DoctorID': $scope.UserId }, true) || [];
                                    if (loggedUser.length > 0) {
                                        GivenBy = loggedUser[0].DoctorID;
                                    }


                                    var obj = {
                                        "AscMedicationId": 0,
                                        "OrganizationMedicationId": item.OrganizationPrescriptionId,
                                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                                        "ParentOrganizationId": $scope.ParenthospitalId,
                                        "ASCOrganizationMedicationId": 0,
                                        "Strength": item.Strength || '',
                                        "IsFrequent": item.IsFrequent || 'N',
                                        "MedicineId": item.MedicineId,
                                        "MedicationName": item.MedicationName,
                                        "IsChecked": false,
                                        "IsDilationMed": false,
                                        "IsIntraAnesthesiaMed": false,
                                        "IsIntraMed": false,
                                        "IsPreOPMed": false,
                                        "MedicationDosage": "",
                                        "DropTimings": [],
                                        "TypeId": 4,
                                        "DeleteInd": "N",
                                        "Action": item.Action,
                                        "Dose": item.Dose,
                                        "DoseUnit": item.DoseUnit,
                                        "Route": item.Route,
                                        "Frequency": item.Frequency,
                                        "ActionId": item.ActionId,
                                        "DoseId": item.DoseId,
                                        "DoseUnitId": item.DoseUnitId,
                                        "RouteId": item.RouteId,
                                        "FrequencyId": item.FrequencyId,
                                        "OrderDescription": item.OrderDescription,
                                        "MedicationNotes": item.MedicationNotes,
                                        "maxDose": item.maxDose,
                                        "OrderTypeId": item.OrderTypeId,
                                        "OrderTypeName": item.OrderTypeName
                                    }
                                    templist[0].IntraOpMedications.push(obj);
                                    $scope.IntraOpMedicationObj.MedicineObject = "";

                                }
                            }
                        });
                    }

                    if (Mainitem.GeneralOrders.length > 0) {
                        angular.forEach(Mainitem.GeneralOrders, function (item) {
                            var j = 0;
                            angular.forEach($scope.IntraOpObj.OrderDetails, function (mitem) {

                                angular.forEach(mitem.GeneralOrders, function (citem) {
                                    if (citem.MedicineName == item.MedicineName && citem.DeleteInd == "N") {
                                        j++
                                    }
                                });

                            });
                            if (j == 0) {
                                let Gobj = {
                                    "GeneralOrderId": null,
                                    "MedicineName": item.MedicineName || '',
                                    "DeleteInd": "N",
                                    "Status": "",

                                }
                                templist[0].GeneralOrders.push(Gobj);
                            }
                        });
                    }
                }
                else {

                    //let templist2 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                    let templist2 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist2.length > 0) {
                        templist2[0].MedTypeId = 4;
                        templist2[0].MedTypeName = 'PostOp Medication';
                    } else {
                        //let templist3 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 4, 'DeleteInd': 'N' }, true) || [];
                        let templist3 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                            return oitem.MedTypeId === 4 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                        }) || [];
                        if (templist3.length > 0) {

                        } else {

                            var obj = {
                                "UserOrderId": 0,
                                "UserId": $scope.UserId,
                                "DeleteInd": "N",
                                "IsOrderReviewed": false,
                                "ReviewedByPassword": '',
                                "ReviewedBy": null,
                                "UserType": "Nurse",
                                "ScreenType": "Intra-OP",
                                "ScreenTypeId": 5,
                                "MedTypeId": 4,
                                "MedTypeName": 'Intra Medications',
                                "IntraOpMedications": [],
                                "GeneralOrders": [],
                                "OrderTypeId": OrderTypeId || 1,
                                "OrderTypeName": OrderTypeName || "Standing Medications(Pre Surgery)",
                            }
                            $scope.IntraOpObj.OrderDetails.push(obj);
                        }

                    }
                    //let templist1 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 4, 'DeleteInd': 'N' }, true) || [];
                    let templist1 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === 4 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist1.length > 0) {

                        if (Mainitem.IntraOpMedications.length > 0) {
                            angular.forEach(Mainitem.IntraOpMedications, function (item) {
                                var i = 0;
                                angular.forEach($scope.IntraOpObj.OrderDetails, function (mitem) {
                                    if (mitem.MedTypeId == 4) {
                                        angular.forEach(mitem.IntraOpMedications, function (citem) {
                                            if (citem.MedicineId == item.MedicineId && citem.DeleteInd == "N") {
                                                i++
                                            }
                                        });
                                    }

                                });
                                if (i == 0) {
                                    let List = $filter("filter")(templist1[0].IntraOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId, 'DeleteInd': 'N' }, true) || [];

                                    if (List.length == 0) {
                                        let GivenBy = null;
                                        let loggedUser = $filter('filter')($scope.NurseAnesthetistArray, { 'DoctorID': $scope.UserId }, true) || [];
                                        if (loggedUser.length > 0) {
                                            GivenBy = loggedUser[0].DoctorID;
                                        }


                                        var obj = {
                                            "AscMedicationId": 0,
                                            "OrganizationMedicationId": item.OrganizationPrescriptionId,
                                            "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                                            "ParentOrganizationId": $scope.ParenthospitalId,
                                            "ASCOrganizationMedicationId": 0,
                                            "Strength": item.Strength || '',
                                            "IsFrequent": item.IsFrequent || 'N',
                                            "MedicineId": item.MedicineId,
                                            "MedicationName": item.MedicationName,
                                            "IsChecked": false,
                                            "IsDilationMed": false,
                                            "IsIntraAnesthesiaMed": false,
                                            "IsIntraMed": false,
                                            "IsPreOPMed": false,
                                            "MedicationDosage": "",
                                            "DropTimings": [],
                                            "TypeId": 4,
                                            "DeleteInd": "N",
                                            "Action": item.Action,
                                            "Dose": item.Dose,
                                            "DoseUnit": item.DoseUnit,
                                            "Route": item.Route,
                                            "Frequency": item.Frequency,
                                            "ActionId": item.ActionId,
                                            "DoseId": item.DoseId,
                                            "DoseUnitId": item.DoseUnitId,
                                            "RouteId": item.RouteId,
                                            "FrequencyId": item.FrequencyId,
                                            "OrderDescription": item.OrderDescription,
                                            "MedicationNotes": item.MedicationNotes,
                                            "maxDose": item.maxDose,
                                            "OrderTypeId": item.OrderTypeId,
                                            "OrderTypeName": item.OrderTypeName
                                        }
                                        templist1[0].IntraOpMedications.push(obj);
                                        $scope.IntraOpMedicationObj.MedicineObject = "";


                                    }
                                }
                            });
                        }
                        if (Mainitem.GeneralOrders.length > 0) {
                            angular.forEach(Mainitem.GeneralOrders, function (item) {
                                var j = 0;
                                angular.forEach($scope.IntraOpObj.OrderDetails, function (mitem) {
                                        angular.forEach(mitem.GeneralOrders, function (citem) {
                                            if (citem.MedicineName == item.MedicineName && citem.DeleteInd == "N") {
                                                j++
                                            }
                                        });
                                });
                                if (j == 0) {
                                    let Gobj = {
                                        "GeneralOrderId": null,
                                        "MedicineName": item.MedicineName || '',
                                        "DeleteInd": "N",
                                        "Status": "",

                                    }
                                    templist1[0].GeneralOrders.push(Gobj);
                                }
                            });
                        }

                    }


                }

                let activeOrders = ($scope.IntraOpObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 4);

                let isColumnTrue = activeOrders.some(order =>
                    (order.IntraOpMedications &&
                        order.IntraOpMedications.some(item => item.DeleteInd === 'N'))
                );

                if (isColumnTrue) {
                    $scope.IntraOpObj.DisableIntraopSurgeonCheck = isColumnTrue;
                    $scope.IntraOpObj.IsIntraOpSurgeonOrdersTimeAdded = !isColumnTrue;
                }
                
            } else {
                //let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, { "MedTypeId": 3, 'IsOrderReviewed': false, 'DeleteInd': 'N'  }, true);
                let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                    return oitem.MedTypeId === 3 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                }) || [];
                if (templist.length > 0) {
                    if (Mainitem.IntraOpMedications.length > 0) {
                        angular.forEach(Mainitem.IntraOpMedications, function (item) {
                            var i = 0;
                            angular.forEach($scope.IntraOpObj.OrderDetails, function (mitem) {
                                if (mitem.MedTypeId == 3) {
                                    angular.forEach(mitem.IntraOpMedications, function (citem) {
                                        if (citem.MedicineId == item.MedicineId && citem.DeleteInd == "N") {
                                            i++
                                        }
                                    });
                                }
                            });
                            if (i == 0) {
                                let List1 = $filter("filter")(templist[0].IntraOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                                let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                                if (List.length == 0) {
                                    let GivenBy = null;
                                    let loggedUser = $filter('filter')($scope.MedicationOnlyMDGivenByArray, { 'DoctorID': $scope.UserId }, true) || [];
                                    if (loggedUser.length > 0) {
                                        GivenBy = loggedUser[0].DoctorID;
                                    }


                                    var obj = {
                                        "AscMedicationId": 0,
                                        "OrganizationMedicationId": item.OrganizationPrescriptionId,
                                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                                        "ParentOrganizationId": $scope.ParenthospitalId,
                                        "ASCOrganizationMedicationId": 0,
                                        "Strength": item.Strength || '',
                                        "IsFrequent": item.IsFrequent || 'N',
                                        "MedicineId": item.MedicineId,
                                        "MedicationName": item.MedicationName,
                                        "IsChecked": false,
                                        "IsDilationMed": false,
                                        "IsIntraAnesthesiaMed": false,
                                        "IsIntraMed": false,
                                        "IsPreOPMed": false,
                                        "MedicationDosage": "",
                                        "DropTimings": [],
                                        "TypeId": 4,
                                        "DeleteInd": "N",
                                        "Action": item.Action,
                                        "Dose": item.Dose,
                                        "DoseUnit": item.DoseUnit,
                                        "Route": item.Route,
                                        "Frequency": item.Frequency,
                                        "ActionId": item.ActionId,
                                        "DoseId": item.DoseId,
                                        "DoseUnitId": item.DoseUnitId,
                                        "RouteId": item.RouteId,
                                        "FrequencyId": item.FrequencyId,
                                        "OrderDescription": item.OrderDescription,
                                        "MedicationNotes": item.MedicationNotes,
                                        "maxDose": item.maxDose,
                                        "OrderTypeId": item.OrderTypeId,
                                        "OrderTypeName": item.OrderTypeName
                                    }
                                    templist[0].IntraOpMedications.push(obj);
                                    $scope.AnesthesiaMedicationObj.MedicineObject = "";

                                }
                            }
                        });
                    }
                    if (Mainitem.GeneralOrders.length > 0) {
                        angular.forEach(Mainitem.GeneralOrders, function (item) {
                            var j = 0;
                            angular.forEach($scope.IntraOpObj.OrderDetails, function (mitem) {
                                    angular.forEach(mitem.GeneralOrders, function (citem) {
                                        if (citem.MedicineName == item.MedicineName && citem.DeleteInd == "N") {
                                            j++
                                        }
                                    });
                            });
                            if (j == 0) {
                                let Gobj = {
                                    "GeneralOrderId": null,
                                    "MedicineName": item.MedicineName || '',
                                    "DeleteInd": "N",
                                    "Status": "",

                                }
                                templist[0].GeneralOrders.push(Gobj);
                            }
                        });
                    }

                }
                else {

                    //let templist2 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                    let templist2 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist2.length > 0) {
                        templist2[0].MedTypeId = 3;
                        templist2[0].MedTypeName = 'IntraAnesthesia Medications';
                    } else {
                        //let templist3 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 3, 'DeleteInd': 'N' }, true) || [];
                        let templist3 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                            return oitem.MedTypeId === 3 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                        }) || [];
                        if (templist3.length > 0) {

                        } else {
                            var obj = {
                                "UserOrderId": 0,
                                "UserId": $scope.UserId,
                                "DeleteInd": "N",
                                "ReviewedBy": null,
                                "IsOrderReviewed": false,
                                "ReviewedByDateTime": null,
                                "ReviewedByPassword": '',
                                "UserType": "Anesthesia",
                                "ScreenType": "Intra-OP",
                                "ScreenTypeId": 5,
                                "MedTypeId": 3,
                                "MedTypeName": 'IntraAnesthesia Medications',
                                "IntraOpMedications": [],
                                "GeneralOrders": [],
                                "OrderTypeId": OrderTypeId || 1,
                                "OrderTypeName": OrderTypeName || "Standing Medications(Pre Surgery)",
                            }
                            $scope.IntraOpObj.OrderDetails.push(obj);
                        }

                    }
                    //let templist1 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 3, 'DeleteInd': 'N' }, true) || [];
                    let templist1 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === 3 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist1.length > 0) {

                        if (Mainitem.IntraOpMedications.length > 0) {
                            angular.forEach(Mainitem.IntraOpMedications, function (item) {
                                var i = 0;
                                angular.forEach($scope.IntraOpObj.OrderDetails, function (mitem) {
                                    if (mitem.MedTypeId == 3) {
                                        angular.forEach(mitem.IntraOpMedications, function (citem) {
                                            if (citem.MedicineId == item.MedicineId && citem.DeleteInd == "N") {
                                                i++
                                            }
                                        });
                                    }
                                });
                                if (i == 0) {
                                    let List = $filter("filter")(templist1[0].IntraOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId, 'DeleteInd': 'N' }, true) || [];

                                    if (List.length == 0) {
                                        let GivenBy = null;
                                        let loggedUser = $filter('filter')($scope.MedicationOnlyMDGivenByArray, { 'DoctorID': $scope.UserId }, true) || [];
                                        if (loggedUser.length > 0) {
                                            GivenBy = loggedUser[0].DoctorID;
                                        }


                                        var obj = {
                                            "AscMedicationId": 0,
                                            "OrganizationMedicationId": item.OrganizationPrescriptionId,
                                            "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                                            "ParentOrganizationId": $scope.ParenthospitalId,
                                            "ASCOrganizationMedicationId": 0,
                                            "Strength": item.Strength || '',
                                            "IsFrequent": item.IsFrequent || 'N',
                                            "MedicineId": item.MedicineId,
                                            "MedicationName": item.MedicationName,
                                            "IsChecked": false,
                                            "IsDilationMed": false,
                                            "IsIntraAnesthesiaMed": false,
                                            "IsIntraMed": false,
                                            "IsPreOPMed": false,
                                            "MedicationDosage": "",
                                            "DropTimings": [],
                                            "TypeId": 4,
                                            "DeleteInd": "N",
                                            "Action": item.Action,
                                            "Dose": item.Dose,
                                            "DoseUnit": item.DoseUnit,
                                            "Route": item.Route,
                                            "Frequency": item.Frequency,
                                            "ActionId": item.ActionId,
                                            "DoseId": item.DoseId,
                                            "DoseUnitId": item.DoseUnitId,
                                            "RouteId": item.RouteId,
                                            "FrequencyId": item.FrequencyId,
                                            "OrderDescription": item.OrderDescription,
                                            "MedicationNotes": item.MedicationNotes,
                                            "maxDose": item.maxDose,
                                            "OrderTypeId": item.OrderTypeId,
                                            "OrderTypeName": item.OrderTypeName
                                        }
                                        templist1[0].IntraOpMedications.push(obj);
                                        $scope.AnesthesiaMedicationObj.MedicineObject = "";


                                    }
                                }
                            });
                        }
                        if (Mainitem.GeneralOrders.length > 0) {
                            angular.forEach(Mainitem.GeneralOrders, function (item) {
                                var j = 0;
                                angular.forEach($scope.IntraOpObj.OrderDetails, function (mitem) {
                                        angular.forEach(mitem.GeneralOrders, function (citem) {
                                            if (citem.MedicineName == item.MedicineName && citem.DeleteInd == "N") {
                                                j++
                                            }
                                        });
                                });
                                if (j == 0) {
                                    let Gobj = {
                                        "GeneralOrderId": null,
                                        "MedicineName": item.MedicineName || '',
                                        "DeleteInd": "N",
                                        "Status": "",

                                    }
                                    templist1[0].GeneralOrders.push(Gobj);
                                }
                            });
                        }

                    }


                }

                let activeOrders = ($scope.IntraOpObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 3);

                let isColumnTrue = activeOrders.some(order =>
                    (order.IntraOpMedications &&
                        order.IntraOpMedications.some(item => item.DeleteInd === 'N'))
                );

                if (isColumnTrue) {
                    $scope.IntraOpObj.DisableIntraopAnesthesiaCheck = isColumnTrue;
                    $scope.IntraOpObj.IsIntraOpAnesthesiaOrdersTimeAdded = !isColumnTrue;
                }
                
            }
            
        }

     $scope.IntraOpObj.IsClickSaveIntraOpBtn = false;
        $scope.SaveIntraopMedication = function (str) {
            //let i = 0;
            //if ($scope.IntraOpObj.IntraOpMedications.length>0) {
            //    angular.forEach($scope.IntraOpObj.IntraOpMedications, function (item) {
            //        if (item.DropTimings.length > 0) {
            //            let tempArray = $filter('filter')(item.DropTimings, { 'GivenBy': null }, true);
            //            if (tempArray.length > 0) {
            //                i++
            //            }
            //        }

            //    });
            //}
            //if (i !== 0) {
            //    alertify.error("Plese select Givenby for Medications!");
            //    return false;
            //}

            //let intraopmedications = [];
            //if ($scope.IntraOpObj.IntraOpMedications.length > 0) {
            //    angular.forEach($scope.IntraOpObj.IntraOpMedications, function (item) {
            //        item.IsIntraMed = true;
            //        item.UserType = "Nurse";
            //        intraopmedications.push(item);
                
            //    });
            //}


            //let j = 0;
            //angular.forEach($scope.IntraOpObj.AnesthesiaMedications, function (item) {                
            //    if (item.DropTimings.length > 0) {
            //        let tempArray = $filter('filter')(item.DropTimings, { 'GivenBy': null }, true);
            //        if (tempArray.length > 0) {
            //            j++
            //        }
            //    }               
            //});
            //if (j!= 0) {
            //    alertify.error("Plese select Givenby for Medications!");
            //    return false;
            //}

            //let anesthesiamedications = [];
            //let IntraOpAnesthesiaChartStatus = "";
            //if ($scope.IntraOpObj.AnesthesiaMedications.length > 0) {
            //    IntraOpAnesthesiaChartStatus = 'D';
            //    angular.forEach($scope.IntraOpObj.AnesthesiaMedications, function (item) {
            //        item.IsIntraAnesthesiaMed = true;
            //        item.UserType = "Anesthesia";
            //        anesthesiamedications.push(item);          
            //    });
            //}

            $scope.LogObj.LogArray = [];

            let K = 0;
            let i = 0;
            let g = 0;
            let v = 0;
            let gv = 0;

            let FinalOrderDetails = $scope.IntraOpObj.OrderDetails || [];
            /*FinalOrderDetails = $filter('filter')($scope.PostOpObj.OrderDetails, { 'MedTypeId': 5 }, true) || [];*/
            if (FinalOrderDetails.length > 0) {
                angular.forEach(FinalOrderDetails, function (Mitem) {
                    Mitem.IsOrderReviewed = Mitem.IsOrderReviewed || false;
                    Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                    if (Mitem.MedTypeId == 4) {
                        Mitem.UserType = "Nurse";
                    } else {
                        Mitem.UserType = "Anesthesia";
                    }
                    if (Mitem.ReviewedBy != null && Mitem.IsOrderReviewed == false) {
                        if (Mitem.ReviewedByPassword == '') {
                            K++
                        }
                    }
                    if (Mitem.IntraOpMedications.length > 0) {
                        angular.forEach(Mitem.IntraOpMedications, function (item) {
                            item.IsIntraMed = true;
                            if (item.MedTypeId == 4) {
                                item.UserType = "Nurse";
                            } else {
                                item.UserType = "Anesthesia";
                            }

                            if (item.DropTimings.length > 0) {
                                let tempArray = $filter('filter')(item.DropTimings, { 'GivenBy': null }, true);
                                if (tempArray.length > 0) {
                                    i++
                                }
                                // Task 13 - every timing must be validated with the Given By passcode before saving.
                                if (DropTimingGivenByService.GetNotValidatedCount(item.DropTimings) > 0) {
                                    v++
                                }
                            };
                            //  logdilationmedications.push(item);
                        });
                    }
                    if (Mitem.GeneralOrders.length > 0) {
                        // Task 13 - custom orders marked Done need the Given By passcode too.
                        gv += DropTimingGivenByService.GetNotValidatedGeneralOrdersCount(Mitem.GeneralOrders);
                        angular.forEach(Mitem.GeneralOrders, function (item) {
                            if (item.Status == 'Done' && !item.GivenBy) {
                                g++;
                            }
                        });

                    }
                });
            }
            if (K !== 0) {
                alertify.error("Plese Enter Password");
                return false;
            }
            if (i !== 0) {
                alertify.error("Plese select Givenby for Medications!");
                return false;
            }
            if (v !== 0) {
                alertify.error("Please validate Given By password for Medications!");
                return false;
            }
            if (gv !== 0) {
                alertify.error("Please validate Given By password for Custom Orders!");
                return false;
            }


            let j = 0;
            let logIntraOpmedications = [], IntraOpGeneralOrders = [];
            let IntraOpOrderDetailsArray = $filter('filter')(FinalOrderDetails, { 'MedTypeId': 4 }, true) || [];

            if (IntraOpOrderDetailsArray.length > 0) {
                angular.forEach(IntraOpOrderDetailsArray, function (Mitem) {
                    if (Mitem.IntraOpMedications.length > 0) {
                        angular.forEach(Mitem.IntraOpMedications, function (item) {
                            logIntraOpmedications.push(item);
                        })
                    }

                    if (Mitem.GeneralOrders.length > 0) {
                        angular.forEach(Mitem.GeneralOrders, function (item) {
                            if (item.Status == 'Done' && !item.GivenBy) {
                                g++;
                            }
                            IntraOpGeneralOrders.push(item);
                        });

                    }

                    if ((Mitem.IntraOpMedications && Mitem.IntraOpMedications.length > 0) ||
                        (Mitem.GeneralOrders && Mitem.GeneralOrders.length > 0)) {
                        j++;
                    }
                })
                if (g !== 0) {
                    alertify.error("Plese select Givenby for General Orders!");
                    //$rootScope.$broadcast("loader_hide");
                    return false;
                }
            }
            if (j != 0) {
                if ($scope.LogObj.IntraOpMedications.length > 0) {
                    $scope.CompareIntraOpMedications(logIntraOpmedications);
                } else {
                    angular.forEach(logIntraOpmedications, function (item) {
                        let description = '';
                        let timingDescriptions = [];
                        if (item.DropTimings && item.DropTimings.length > 0) {
                            angular.forEach(item.DropTimings, function (dt) {
                                let medicationTime = dt.MedicationTime || '';
                                let givenById = dt.GivenBy || '';
                                let medicationDosage = dt.MedicationDosage || '';
                                let Remarks = dt.Remarks || '';

                                let givenByUser = '';
                                if (givenById) {
                                    let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                                    if (user) givenByUser = user.FullName;
                                }

                                let Notes = '';
                                if (Remarks) {
                                    Notes = 'Notes: ' + Remarks;
                                }

                                let timingDescription = `${medicationDosage} at ${medicationTime} by @ ${givenByUser} ${Notes}`;
                                timingDescriptions.push(timingDescription);
                            });

                            // Build conditional description
                            description =
                                (item.OrderDescription ? ` ${item.OrderDescription}\n` : '') +
                                (item.MedicationNotes ? `Notes: ${item.MedicationNotes}\n` : '') +
                                (timingDescriptions.length > 0 ? timingDescriptions.join(', ') : '');
                        } else {
                            description =
                                (item.OrderDescription ? ` ${item.OrderDescription}\n` : '') +
                                (item.MedicationNotes ? `Notes: ${item.MedicationNotes}\n` : '');

                        }

                        let obj = {
                            LogId: 0,
                            ModuleId: 2,
                            ModuleName: "ASC",
                            SubModuleId: 40,
                            SubModuleName: "All Orders",
                            ScreenType: "IntraOp Consumables",
                            ActionType: "Added",
                            OldActionDescription: "",
                            NewActionDescription: description.trim(),
                            ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    });
                }

                // General orders
                if (IntraOpGeneralOrders.length > 0) {
                    if ($scope.LogObj.IntraopGeneralOrders.length > 0) {
                        $scope.CompareIntraOpGeneralOrders(IntraOpGeneralOrders);
                    } else {
                        angular.forEach(IntraOpGeneralOrders, function (item) {

                            let description =
                                (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                                (item.Status ? `Status: ${item.Status}\n` : '') +
                                (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');
                            let givenById = item.GivenBy || '';
                            let givenByUser = '';
                            if (givenById) {
                                let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                                if (user) givenByUser = user.FullName;
                            }

                            if (item.Status == 'Done' && givenByUser) {
                                description += `by @ ${givenByUser}`;
                            }

                            let obj = {
                                LogId: 0,
                                ModuleId: 2,
                                ModuleName: "ASC",
                                SubModuleId: 40,
                                SubModuleName: "All Orders",
                                ScreenType: "IntraOp Consumables",
                                ActionType: "Added",
                                OldActionDescription: "",
                                NewActionDescription: description,
                                ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                            };
                            $scope.LogObj.LogArray.push(obj);
                        });
                    }
                }
            }


            $scope.LogObj.IntraOpOrderDetails = $scope.LogObj.IntraOpOrderDetails || [];
            if (IntraOpOrderDetailsArray.length > 0 || $scope.LogObj.IntraOpOrderDetails.length > 0) {
                angular.forEach(IntraOpOrderDetailsArray, function (currentItem) {
                    currentItem.IsOrderReviewed = currentItem.IsOrderReviewed || false;
                    var edited = $scope.LogObj.IntraOpOrderDetails.find(function (prev) {
                        return prev.UserOrderId === currentItem.UserOrderId;
                    });

                    if (currentItem.IsOrderReviewed && (!edited || edited.ReviewedBy !== currentItem.ReviewedBy)) {
                        let actionType = "Added";
                        let obj = {
                            LogId: 0,
                            ModuleId: 2,
                            ModuleName: "ASC",
                            SubModuleId: 40,
                            SubModuleName: "All Orders",
                            ScreenType: "IntraOp Consumables",
                            ActionType: actionType,
                            OldActionDescription: "",
                            NewActionDescription: `IntraOp Consumables Signed By ${currentItem.ReviewedByName}`,
                            ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }
                });
            }

            let M = 0;
            let logIntraOpAnesthesiamedications = [], IntraOpAnesthesiaGeneralOrders = [];
            let IntraOpAnesthesiaOrderDetailsArray = $filter('filter')(FinalOrderDetails, { 'MedTypeId': 3 }, true) || [];

            if (IntraOpAnesthesiaOrderDetailsArray.length > 0) {
                angular.forEach(IntraOpAnesthesiaOrderDetailsArray, function (Mitem) {
                    if (Mitem.IntraOpMedications.length > 0) {
                        angular.forEach(Mitem.IntraOpMedications, function (item) {
                            logIntraOpAnesthesiamedications.push(item);
                        })
                    }

                    if (Mitem.GeneralOrders.length > 0) {
                        angular.forEach(Mitem.GeneralOrders, function (item) {
                            IntraOpAnesthesiaGeneralOrders.push(item);
                        });

                    }

                    if ((Mitem.IntraOpMedications && Mitem.IntraOpMedications.length > 0) ||
                        (Mitem.GeneralOrders && Mitem.GeneralOrders.length > 0)) {
                        M++;
                    }
                })
            }
            if (M != 0) {
                if ($scope.LogObj.IntraOpAnesthesiaMedications.length > 0) {
                    $scope.CompareIntraOpAnesthesiaMedications(logIntraOpAnesthesiamedications);
                } else {
                    angular.forEach(logIntraOpAnesthesiamedications, function (item) {
                        let description = '';
                        let timingDescriptions = [];
                        if (item.DropTimings && item.DropTimings.length > 0) {
                            angular.forEach(item.DropTimings, function (dt) {
                                let medicationTime = dt.MedicationTime || '';
                                let givenById = dt.GivenBy || '';
                                let medicationDosage = dt.MedicationDosage || '';
                                let Remarks = dt.Remarks || '';

                                let givenByUser = '';
                                if (givenById) {
                                    let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                                    if (user) givenByUser = user.FullName;
                                }

                                let Notes = '';
                                if (Remarks) {
                                    Notes = 'Notes: ' + Remarks;
                                }

                                let timingDescription = `${medicationDosage} at ${medicationTime} by @ ${givenByUser} ${Notes}`;
                                timingDescriptions.push(timingDescription);
                            });

                            // Build conditional description
                            description =
                                (item.OrderDescription ? ` ${item.OrderDescription}\n` : '') +
                                (item.MedicationNotes ? `Notes: ${item.MedicationNotes}\n` : '') +
                                (timingDescriptions.length > 0 ? timingDescriptions.join(', ') : '');
                        } else {
                            description =
                                (item.OrderDescription ? ` ${item.OrderDescription}\n` : '') +
                                (item.MedicationNotes ? `Notes: ${item.MedicationNotes}\n` : '');

                        }

                        let obj = {
                            LogId: 0,
                            ModuleId: 2,
                            ModuleName: "ASC",
                            SubModuleId: 40,
                            SubModuleName: "All Orders",
                            ScreenType: "IntraOp Anesthesia Medications",
                            ActionType: "Added",
                            OldActionDescription: "",
                            NewActionDescription: description.trim(),
                            ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    });
                }

                // General orders
                if (IntraOpAnesthesiaGeneralOrders.length > 0) {
                    if ($scope.LogObj.IntraopAnesthesiaGeneralOrders.length > 0) {
                        $scope.CompareIntraOpAnesthesiaGeneralOrders(IntraOpAnesthesiaGeneralOrders);
                    } else {
                        angular.forEach(IntraOpAnesthesiaGeneralOrders, function (item) {

                            let description =
                                (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                                (item.Status ? `Status: ${item.Status}\n` : '') +
                                (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');
                            let givenById = item.GivenBy || '';
                            let givenByUser = '';
                            if (givenById) {
                                let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                                if (user) givenByUser = user.FullName;
                            }

                            if (item.Status == 'Done' && givenByUser) {
                                description += `by @ ${givenByUser}`;
                            }

                            let obj = {
                                LogId: 0,
                                ModuleId: 2,
                                ModuleName: "ASC",
                                SubModuleId: 40,
                                SubModuleName: "All Orders",
                                ScreenType: "IntraOp Anesthesia Medications",
                                ActionType: "Added",
                                OldActionDescription: "",
                                NewActionDescription: description,
                                ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                            };
                            $scope.LogObj.LogArray.push(obj);
                        });
                    }
                }
            }

            $scope.LogObj.IntraOpAnesthesiaOrderDetails = $scope.LogObj.IntraOpAnesthesiaOrderDetails || [];
            if (IntraOpAnesthesiaOrderDetailsArray.length > 0 || $scope.LogObj.IntraOpAnesthesiaOrderDetails.length > 0) {
                angular.forEach(IntraOpAnesthesiaOrderDetailsArray, function (currentItem) {
                    currentItem.IsOrderReviewed = currentItem.IsOrderReviewed || false;
                    var edited = $scope.LogObj.IntraOpAnesthesiaOrderDetails.find(function (prev) {
                        return prev.UserOrderId === currentItem.UserOrderId;
                    });

                    if (currentItem.IsOrderReviewed && (!edited || edited.ReviewedBy !== currentItem.ReviewedBy)) {
                        let actionType = "Added";
                        let obj = {
                            LogId: 0,
                            ModuleId: 2,
                            ModuleName: "ASC",
                            SubModuleId: 40,
                            SubModuleName: "All Orders",
                            ScreenType: "IntraOp Anesthesia Medications",
                            ActionType: actionType,
                            OldActionDescription: "",
                            NewActionDescription: `IntraOp Anesthesia Medications Signed By ${currentItem.ReviewedByName}`,
                            ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }
                });
            }

          

            let Req = {
                "VisitId": $scope.cacheStorageItem.PatientVisitId,
                //"ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,
                "PatientASCIntraOPId": $scope.PostOpObj.PatientASCIntraOPId || null,
                "UserId": $scope.UserId || null,
                "HospitalId": $scope.HospitalId || null,
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "IntraOpChartStatus": (str === 'SignOff') ? "E" : "D",
                "IntraOpNurseChartStatus": $scope.IntraOpObj.IntraOpNurseChartStatus || "D",
                "IntraOpAnesthesiaChartStatus": $scope.IntraOpObj.IntraOpAnesthesiaChartStatus || 'D',
               // "IntraOpMedications": intraopmedications || [],
                //"AnesthesiaMedications": anesthesiamedications || [],
                "OrderDetails": FinalOrderDetails|| [],
                "IsIntraOpSurgeonOrdersTimeAdded": $scope.IntraOpObj.IsIntraOpSurgeonOrdersTimeAdded || false,
                 "IsIntraOpAnesthesiaOrdersTimeAdded": $scope.IntraOpObj.IsIntraOpAnesthesiaOrdersTimeAdded || false,
             

            }

            //if ($scope.cacheStorageItem.CheckinStatusId == 1) {
            //    Req.IntraOpChartStatus = '';
            //    Req.IntraOpNurseChartStatus = '';
            //    Req.IntraOpAnesthesiaChartStatus = '';
            //}

            if ($scope.LogObj.LogArray.length > 0) {
                Req.Logs = $scope.LogObj || {};
            }

            if ($scope.cacheStorageItem.AdmissionId == 0) {
                Req.IntraOpChartStatus = '';
                Req.IntraOpNurseChartStatus = '';
                Req.IntraOpAnesthesiaChartStatus = '';
            }
            $scope.IntraOpObj.IsClickSaveIntraOpBtn =true;
            eHnoteSurgeryService.AddUpdateIntraOPMedications(Req).then(function (resp) {
                if (resp.data.Status === "Success") {
                    alertify.success("Data Submitted successfully!");
                    //$scope.IntraCurrentTab = ($scope.RoleId == 25 || $scope.RoleId == 30) ? 2 : 1;
                    $scope.IntraCurrentTab = angular.copy($scope.IntraOpMedicationObj.SubTab) || 1;
                    $scope.init();
                    $scope.IntraOpObj.IsClickSaveIntraOpBtn = false;
                }
            }, function (err) {
                $scope.IntraOpObj.IsClickSaveIntraOpBtn = false;
                console.log(err);
            });

        }
        $scope.CardiologyPrescription = [];
        $scope.CardiologyInvestigations = [];
        $scope.OnpushPrescriptionMedicationDetails = function (obj, type, type1) {


            let templist = $filter("filter")($scope.PreAdmAnesthetistObj.OrderDetails, {  "MedTypeId": 7, 'IsOrderReviewed': false }, true);
            if (templist.length > 0) {
                $scope.SigSearch.Shows = false;
                obj.SigfieldsShows = false;
                obj.ShowsEditSigfields = false;
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
                    newmedicationobj.Type = type1;
                    newmedicationobj.IsMedicationStopped = false;
                    newmedicationobj.SigFormationFields = false;
                    newmedicationobj.isEditFocused = false;
                    newmedicationobj.isAddFocused = false;
                    newmedicationobj.SelectedMedicationHistory = 'CurrentEyeMedication';
                    newmedicationobj.TypeId = 2;

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
                            if (templist[0].PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                                angular.forEach(templist[0].PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                                    if (item.MedicationId == newmedicationobj.MedicationId) {
                                        medi++;
                                    }
                                });
                            }


                            // when showing cardiology orders separately for display

                            if ($scope.CardiologyPrescription.length > 0) {
                                angular.forEach($scope.CardiologyPrescription, function (kitem) {
                                    angular.forEach(kitem.PrescriptionDetails, function (item) {
                                        if (item.MedicationId == newmedicationobj.MedicationId) {
                                            medi++;
                                        }
                                    });
                                });
                            }

                            if (medi > 0) {
                                alertify.error('You have already entered this Drug');
                                $scope.medicineGetObj.MedicineObject = "";
                            } else {
                                templist[0].PrescriptionMainAddObj.PrescriptionDetails.unshift(newmedicationobj);
                                $scope.medicineGetObj.MedicineObject = "";
                            }

                        }
                    });
                }
                else {
                    newmedicationobj.MedicationId = obj.MedicineId;
                    newmedicationobj.DrugBrandName = obj.MedicineName;
                    newmedicationobj.MedicationName = obj.MedicineName;
                    newmedicationobj.DrugSchedule = obj.ScheduleType;
                    newmedicationobj.DrugStrength = obj.Strength;
                    newmedicationobj.DrugGenericName = obj.GenericName;

                    newmedicationobj.RcopiaDrugId = obj.RcopiaDrugId || "";
                    newmedicationobj.DrugNDCID = obj.RcopiaDrugNDCID || "";
                    newmedicationobj.DrugFirstDataBankMedID = obj.FirstDataBankMedID || "";
                    newmedicationobj.DrugGenericId = obj.GenericID || "";
                    newmedicationobj.Type = type1;
                    newmedicationobj.IsMedicationStopped = false;
                    newmedicationobj.RxNormList = obj.RxNormList || [];
                    newmedicationobj.SigFormationFields = false;
                    newmedicationobj.isEditFocused = false;
                    newmedicationobj.isAddFocused = false;
                    newmedicationobj.SelectedMedicationHistory = 'CurrentEyeMedication';
                    newmedicationobj.TypeId = 2;

                    if (obj.RxNormList.length > 0) {
                        let filteredRxNorm = $filter("filter")(obj.RxNormList, { "Status": 'a', "Representative": 'y' }, true) || [];
                        if (filteredRxNorm.length > 0) {
                            newmedicationobj.DrugRxNormId = filteredRxNorm[0].RXNormId;
                        }
                    }
                    var medi = 0;
                    if (templist[0].PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                        angular.forEach(templist[0].PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                            if (item.MedicationId == newmedicationobj.MedicationId) {
                                medi++;
                            }
                        });
                    }

                    // when showing cardiology orders separately for display

                    if ($scope.CardiologyPrescription.length > 0) {
                        angular.forEach($scope.CardiologyPrescription, function (kitem) {
                            angular.forEach(kitem.PrescriptionDetails, function (item) {
                                if (item.MedicationId == newmedicationobj.MedicationId) {
                                    medi++;
                                }
                            });
                        });
                    }


                    if (medi > 0) {
                        alertify.error('You have already entered this Drug');
                        $scope.medicineGetObj.MedicineObject = "";
                    } else {
                        templist[0].PrescriptionMainAddObj.PrescriptionDetails.unshift(newmedicationobj);
                        $scope.medicineGetObj.MedicineObject = "";
                    }
                }

                if (templist[0].PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                    $scope.PrescriptionMainAddObj.IsNKMSelected = false;
                }

            }
            else {
                let templist2 = $filter("filter")($scope.PreAdmAnesthetistObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                if (templist2.length > 0) {
                    templist2[0].MedTypeId = 7;
                    templist2[0].MedTypeName = 'Anesthesia Medication';
                } else {

                    let templist3 = $filter("filter")($scope.PreAdmAnesthetistObj.OrderDetails, { "ReviewedBy": null, "MedTypeId":7 }, true) || [];
                    if (templist3.length > 0) {

                    } else {
                        let obj = {
                            "UserOrderId": 0,
                            "UserId": $scope.UserId,
                            "DeleteInd": "N",
                            "ReviewedBy": null,
                            "IsOrderReviewed": false,
                            "ReviewedByDateTime": null,
                            "ReviewedByPassword": '',
                            "UserType": "Nurse",
                            "ScreenType": "Anesthesia PreAdmission",
                            "ScreenTypeId": 2,
                            "MedTypeId": 7,
                            "MedTypeName": 'Anesthesia Medication',
                            "PrescriptionMainAddObj": getEmptyPrescriptionObj() || '',
                            "GeneralOrders": [],
                            "Investigationslist": [],
                        }
                        $scope.PreAdmAnesthetistObj.OrderDetails.push(obj);
                    }

                }


                let templist1 = $filter("filter")($scope.PreAdmAnesthetistObj.OrderDetails, { "ReviewedBy": null, "MedTypeId":7 }, true) || [];

                if (templist1.length > 0) {
                    console.log(JSON.stringify(obj));
                    $scope.SigSearch.Shows = false;
                    obj.SigfieldsShows = false;
                    obj.ShowsEditSigfields = false;
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
                        newmedicationobj.Type = type1;
                        newmedicationobj.IsMedicationStopped = false;
                        newmedicationobj.SigFormationFields = false;
                        newmedicationobj.isEditFocused = false;
                        newmedicationobj.isAddFocused = false;
                        newmedicationobj.SelectedMedicationHistory = 'CurrentEyeMedication';
                        newmedicationobj.TypeId = 2;

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
                                if (templist1[0].PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                                    angular.forEach(templist1[0].PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                                        if (item.MedicationId == newmedicationobj.MedicationId) {
                                            medi++;
                                        }
                                    });
                                }


                                // when showing cardiology orders separately for display

                                if ($scope.CardiologyPrescription.length > 0) {
                                    angular.forEach($scope.CardiologyPrescription, function (kitem) {
                                        angular.forEach(kitem.PrescriptionDetails, function (item) {
                                            if (item.MedicationId == newmedicationobj.MedicationId) {
                                                medi++;
                                            }
                                        });
                                    });
                                }

                                if (medi > 0) {
                                    alertify.error('You have already entered this Drug');
                                    $scope.medicineGetObj.MedicineObject = "";
                                } else {
                                    templist1[0].PrescriptionMainAddObj.PrescriptionDetails.unshift(newmedicationobj);
                                    $scope.medicineGetObj.MedicineObject = "";
                                }

                            }
                        });
                    }
                    else {
                        newmedicationobj.MedicationId = obj.MedicineId;
                        newmedicationobj.DrugBrandName = obj.MedicineName;
                        newmedicationobj.MedicationName = obj.MedicineName;
                        newmedicationobj.DrugSchedule = obj.ScheduleType;
                        newmedicationobj.DrugStrength = obj.Strength;
                        newmedicationobj.DrugGenericName = obj.GenericName;

                        newmedicationobj.RcopiaDrugId = obj.RcopiaDrugId || "";
                        newmedicationobj.DrugNDCID = obj.RcopiaDrugNDCID || "";
                        newmedicationobj.DrugFirstDataBankMedID = obj.FirstDataBankMedID || "";
                        newmedicationobj.DrugGenericId = obj.GenericID || "";
                        newmedicationobj.Type = type1;
                        newmedicationobj.IsMedicationStopped = false;
                        newmedicationobj.RxNormList = obj.RxNormList || [];
                        newmedicationobj.SigFormationFields = false;
                        newmedicationobj.isEditFocused = false;
                        newmedicationobj.isAddFocused = false;
                        newmedicationobj.SelectedMedicationHistory = 'CurrentEyeMedication';
                        newmedicationobj.TypeId = 2;

                        if (obj.RxNormList.length > 0) {
                            let filteredRxNorm = $filter("filter")(obj.RxNormList, { "Status": 'a', "Representative": 'y' }, true) || [];
                            if (filteredRxNorm.length > 0) {
                                newmedicationobj.DrugRxNormId = filteredRxNorm[0].RXNormId;
                            }
                        }
                        var medi = 0;
                        if (templist1[0].PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                            angular.forEach(templist1[0].PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                                if (item.MedicationId == newmedicationobj.MedicationId) {
                                    medi++;
                                }
                            });
                        }

                        // when showing cardiology orders separately for display

                        if ($scope.CardiologyPrescription.length > 0) {
                            angular.forEach($scope.CardiologyPrescription, function (kitem) {
                                angular.forEach(kitem.PrescriptionDetails, function (item) {
                                    if (item.MedicationId == newmedicationobj.MedicationId) {
                                        medi++;
                                    }
                                });
                            });
                        }


                        if (medi > 0) {
                            alertify.error('You have already entered this Drug');
                            $scope.medicineGetObj.MedicineObject = "";
                        } else {
                            templist1[0].PrescriptionMainAddObj.PrescriptionDetails.unshift(newmedicationobj);
                            $scope.medicineGetObj.MedicineObject = "";
                        }
                    }

                    if (templist1[0].PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                        $scope.PrescriptionMainAddObj.IsNKMSelected = false;
                    }

                } else {

                }
            }







        };
        $scope.onpushselectInvestigation = function (InvObject) {

            let templist = $filter("filter")($scope.PreAdmAnesthetistObj.OrderDetails, {  "MedTypeId":7, 'IsOrderReviewed': false }, true);
            if (templist.length > 0) {
                if (InvObject.ProcedureId === '') {
                    InvObject.InvestigationName = '';
                    return false;
                }
                $scope.Surgeryobj.InvestigationObj = InvObject || "";
                if ($scope.Surgeryobj.InvestigationObj === "") {
                    return;
                }
                var object = {
                    "PatientInvestigationId": 0,
                    "ProcedureCode": $scope.Surgeryobj.InvestigationObj.ProcedureCode || "",
                    "OrgInvestigationId": $scope.Surgeryobj.InvestigationObj.OrganizationProcedureId,
                    "InvestigationId": $scope.Surgeryobj.InvestigationObj.ProcedureId,
                    "InvestigationName": $scope.Surgeryobj.InvestigationObj.ProcedureName,
                    "InvestigationDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
                    "OrganId": "",
                    "InvestigationNotes": $scope.Surgeryobj.InvestigationObj.Notes || "",
                    "DeleteInd": "N",
                    "IsEdit": false,
                    "IsNoteEdit": false,
                    "ShowDateFormat": false,
                    "DurationDate": null,
                    "Duration": null,
                    "DurationType": "",
                    "Remarks": "",
                    "LocationId": null,
                    "LabInvestFocus": false,
                    "TypeId": 2
                };
                var i = 0;
                templist[0].Investigationslist = templist[0].Investigationslist || [];
                if (templist[0].Investigationslist.length > 0) {
                    angular.forEach(templist[0].Investigationslist, function (item) {
                        if (item.InvestigationId === $scope.Surgeryobj.InvestigationObj.ProcedureId && item.DeleteInd === 'N') {
                            i++;
                        }
                    });
                }

                if (i > 0) {
                    alertify.error('You already entered this Investigation');
                    $scope.Surgeryobj.InvestigationObj = "";
                }
                if (i === 0) {
                    templist[0].Investigationslist.push(object);
                    $scope.Surgeryobj.InvestigationObj = "";
                }

            }
            else {
                let templist2 = $filter("filter")($scope.PreAdmAnesthetistObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                if (templist2.length > 0) {
                    templist2[0].MedTypeId = 7;
                    templist2[0].MedTypeName = 'Anesthesia PreAdmission';
                } else {

                    let templist3 = $filter("filter")($scope.PreAdmAnesthetistObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 7 }, true) || [];
                    if (templist3.length > 0) {

                    } else {
                        let obj = {
                            "UserOrderId": 0,
                            "UserId": $scope.UserId,
                            "DeleteInd": "N",
                            "ReviewedBy": null,
                            "IsOrderReviewed": false,
                            "ReviewedByDateTime": null,
                            "ReviewedByPassword": '',
                            "UserType": "Nurse",
                            "ScreenType": "Anesthesia PreAdmission",
                            "ScreenTypeId": 2,
                            "MedTypeId": 7,
                            "MedTypeName": 'Anesthesia PreAdmission',
                            "PrescriptionMainAddObj": getEmptyPrescriptionObj() || '',
                            "GeneralOrders": [],
                            "Investigationslist": [],
                        }
                        $scope.PreAdmAnesthetistObj.OrderDetails.push(obj);
                    }

                }


                let templist1 = $filter("filter")($scope.PreAdmAnesthetistObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 7 }, true) || [];

                if (templist1.length > 0) {
                    if (InvObject.ProcedureId === '') {
                        InvObject.InvestigationName = '';
                        return false;
                    }
                    $scope.Surgeryobj.InvestigationObj = InvObject || "";
                    if ($scope.Surgeryobj.InvestigationObj === "") {
                        return;
                    }
                    var object = {
                        "PatientInvestigationId": 0,
                        "ProcedureCode": $scope.Surgeryobj.InvestigationObj.ProcedureCode || "",
                        "OrgInvestigationId": $scope.Surgeryobj.InvestigationObj.OrganizationProcedureId,
                        "InvestigationId": $scope.Surgeryobj.InvestigationObj.ProcedureId,
                        "InvestigationName": $scope.Surgeryobj.InvestigationObj.ProcedureName,
                        "InvestigationDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
                        "OrganId": "",
                        "InvestigationNotes": $scope.Surgeryobj.InvestigationObj.Notes || "",
                        "DeleteInd": "N",
                        "IsEdit": false,
                        "IsNoteEdit": false,
                        "ShowDateFormat": false,
                        "DurationDate": null,
                        "Duration": null,
                        "DurationType": "",
                        "Remarks": "",
                        "LocationId": null,
                        "LabInvestFocus": false,
                        "TypeId": 2
                    };
                    var i = 0;
                    templist1[0].Investigationslist = templist1[0].Investigationslist || [];
                    if (templist1[0].Investigationslist.length > 0) {
                        angular.forEach(templist1[0].Investigationslist, function (item) {
                            if (item.InvestigationId === $scope.Surgeryobj.InvestigationObj.ProcedureId && item.DeleteInd === 'N') {
                                i++;
                            }
                        });
                    }

                    if (i > 0) {
                        alertify.error('You already entered this Investigation');
                        $scope.Surgeryobj.InvestigationObj = "";
                    }
                    if (i === 0) {
                        templist1[0].Investigationslist.push(object);
                        $scope.Surgeryobj.InvestigationObj = "";
                    }

                } else {

                }
            }




















        };
        $scope.AddPreGeneralOrder = function () {
            if ($scope.PreAdmAnesthetistObj.OrderName == '') {
                alertify.error("Please Enter General Orders!");
                return false;
            }
            let templist = $filter("filter")($scope.PreAdmAnesthetistObj.OrderDetails, {  "MedTypeId":7, 'IsOrderReviewed': false }, true);
            if (templist.length > 0) {
                let Gobj = {
                    "GeneralOrderId": null,
                    "MedicineName": $scope.PreAdmAnesthetistObj.OrderName || '',
                    "DeleteInd": "N",
                    "Status": "",

                }
                templist[0].GeneralOrders.push(Gobj);
                $scope.PreAdmAnesthetistObj.OrderName = "";
            }
            else {
                let templist2 = $filter("filter")($scope.PreAdmAnesthetistObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                if (templist2.length > 0) {
                    templist2[0].MedTypeId = 7;
                    templist2[0].MedTypeName = 'Anesthesia PreAdmission';
                } else {

                    let templist3 = $filter("filter")($scope.PreAdmAnesthetistObj.OrderDetails, { "ReviewedBy": null, "MedTypeId":7}, true) || [];
                    if (templist3.length > 0) {

                    } else {
                        let obj = {
                            "UserOrderId": 0,
                            "UserId": $scope.UserId,
                            "DeleteInd": "N",
                            "ReviewedBy": null,
                            "IsOrderReviewed": false,
                            "ReviewedByDateTime": null,
                            "ReviewedByPassword": '',
                            "UserType": "Nurse",
                            "ScreenType": "Anesthesia PreAdmission",
                            "ScreenTypeId": 2,
                            "MedTypeId": 7,
                            "MedTypeName": 'Anesthesia Medication',
                            "PrescriptionMainAddObj": getEmptyPrescriptionObj() || '',
                            "GeneralOrders": [],
                            "Investigationslist": [],
                        }
                        $scope.PreAdmAnesthetistObj.OrderDetails.push(obj);
                    }

                }


                let templist1 = $filter("filter")($scope.PreAdmAnesthetistObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 7 }, true) || [];

                if (templist1.length > 0) {
                    let Gobj = {
                        "GeneralOrderId": null,
                        "MedicineName": $scope.PreAdmAnesthetistObj.OrderName || '',
                        "DeleteInd": "N",
                        "Status": "",

                    }
                    templist1[0].GeneralOrders.push(Gobj);
                    $scope.PreAdmAnesthetistObj.OrderName = "";
                } else {

                }
            }
        }


     $scope.PreAdmAnesthetistObj.IsClickSavePreAdmAnesthetistBtn = false;

        $scope.SaveAnesthetistMedication = function () {
       

            if ($scope.PreAdmAnesthetistObj.OrderDetails.length > 0) {
                angular.forEach($scope.PreAdmAnesthetistObj.OrderDetails, function (item) {
                    if (item.IsOrderReviewed == false) {
                        item.ReviewedBy = null;
                        item.ReviewedByName = '';
                    }
                    if (item.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                        item.PrescriptionArray = [];
                        let tempPrescriptionArray = $filter('filter')(item.PrescriptionMainAddObj.PrescriptionDetails, { 'TypeId': 2 }, true);
                        let tempObj = angular.copy(item.PrescriptionMainAddObj);
                        if (tempPrescriptionArray.length > 0) {
                            tempObj.PrescriptionArray = angular.copy(tempPrescriptionArray);
                            item.PrescriptionArray.push(tempObj);
                        }

                    }

                })
            }
            let Req = {
                "VisitId": $scope.cacheStorageItem.PatientVisitId,

                //"ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,               
                "UserId": $scope.UserId || null,
                "OrganizationId": $scope.HospitalId || null,
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "PatientSurgeryId": $scope.PreOpAndDialationMedications.PatientSurgeryId || 0,
                "TypeId":2,
                "OrderDetails": $scope.PreAdmAnesthetistObj.OrderDetails || [],
     
            
            }
            $scope.PreAdmAnesthetistObj.IsClickSavePreAdmAnesthetistBtn = true;
            eHnoteSurgeryService.AddUpdatePreSurgeryOrders(Req).then(function (resp) {
                if (resp.data.Status === "Success") {
                    alertify.success("Data Submitted successfully!");                   
                    $scope.init();
                    $scope.PreAdmAnesthetistObj.IsClickSavePreAdmAnesthetistBtn = false;
                }
            }, function (err) {
                $scope.PreAdmAnesthetistObj.IsClickSavePreAdmAnesthetistBtn = false;
                console.log(err);
            });

        }
     $scope.PreAdmCardiologyObj.IsClickSavePrescriptionBtn = false;
        $scope.SavePhysicanMedication = function () {
            $scope.LogObj.LogArray = [];
            var PrescriptionDetailslog = [], Investigationslistlog = [], GeneralOrderslog = []
            if ($scope.PreAdmCardiologyObj.OrderDetails.length > 0) {
                angular.forEach($scope.PreAdmCardiologyObj.OrderDetails, function (item) {
                    if (item.IsOrderReviewed == false) {
                        item.ReviewedBy = null;
                        item.ReviewedByName = '';
                    }
                    if (item.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                        item.PrescriptionArray = [];
                        let tempPrescriptionArray = $filter('filter')(item.PrescriptionMainAddObj.PrescriptionDetails, { 'TypeId': 3 }, true);
                        let tempObj = angular.copy(item.PrescriptionMainAddObj);
                        if (tempPrescriptionArray.length > 0) {
                            tempObj.PrescriptionArray = angular.copy(tempPrescriptionArray);
                            item.PrescriptionArray.push(tempObj);
                        }
                        angular.forEach(item.PrescriptionMainAddObj.PrescriptionDetails, function (Titem) {
                            PrescriptionDetailslog.push(Titem);
                        });   

                    }

                    if (item.Investigationslist.length > 0) {
                        angular.forEach(item.Investigationslist, function (Titem) {
                            Titem.LocationId = Titem.LocationId || 0;
                            if (Titem.LocationId == 0) {
                                Count++
                            };
                            Investigationslistlog.push(Titem);
                        });
                    };

                    if (item.GeneralOrders.length > 0) {
                        angular.forEach(item.GeneralOrders, function (Titem) {
                            GeneralOrderslog.push(Titem);
                        });
                    };
                })
            }
            let Req = {
                "VisitId": $scope.cacheStorageItem.PatientVisitId,
                //"ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,               
                "UserId": $scope.UserId || null,
                "OrganizationId": $scope.HospitalId || null,
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "PatientSurgeryId": $scope.PreOpAndDialationMedications.PatientSurgeryId || 0,
                "TypeId":3,
                "OrderDetails": $scope.PreAdmCardiologyObj.OrderDetails || [],
                "Logs": {},
            
            }

            //----Orders----
            if (PrescriptionDetailslog.length > 0) {
                let tempPrescriptionArray = PrescriptionDetailslog || []
                if ($scope.LogObj.PhysicianPrescriptionDetails.length > 0) {
                    let count = 0, MedicationNames = '', DifferenceItem = [];
                    let dltcount = 0;
                    let dltMedicationNames = '';
                    let GivenByUser = '';

                    var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (eitem) { return eitem.DoctorID == $scope.UserId });
                    if (ReviewedByArraylist.length > 0) {
                        GivenByUser = angular.copy(ReviewedByArraylist[0].SecondUserFullName) +
                            (ReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(ReviewedByArraylist[0].LicenseNumber) : "");
                    }

                    angular.forEach(tempPrescriptionArray, function (item) {
                        let Sig = '', dltSig = '';
                        if (item.DeleteInd == 'Y') {
                            item.Sig = item.Sig || '';
                            if (item.Sig != '') {
                                dltSig = ' Sig:' + item.Sig;
                            }
                            if (dltcount > 0) {
                                dltMedicationNames += ', ';
                            }
                            dltMedicationNames += item.MedicationName + dltSig;
                            dltcount++;

                        } else {
                            item.Sig = item.Sig || '';
                            var edited = $scope.LogObj.PhysicianPrescriptionDetails.filter(function (eitem) {
                                eitem.Sig = eitem.Sig || '';
                                return ((eitem.MedicationId == item.MedicationId) && (eitem.Remarks == item.Remarks) && (eitem.ActionId == item.ActionId) &&
                                    (eitem.DaysSupplyId == item.DaysSupplyId) && (eitem.DoseId == item.DoseId) && (eitem.DoseOtherId == item.DoseOtherId) && (eitem.DoseUnitId == item.DoseUnitId) && (eitem.FrequencyId == item.FrequencyId) && (eitem.RouteId == item.RouteId)
                                    && (eitem.Quantity == item.Quantity) && (eitem.QuantityUnitId == item.QuantityUnitId) && (eitem.RefillId == item.RefillId) && (eitem.SubstitutionPermitted == item.SubstitutionPermitted) && (eitem.PatientInstructions == item.PatientInstructions) && (eitem.Sig == item.Sig));
                            }) || [];

                            if (item.Sig != '') {
                                Sig = ' Sig:' + item.Sig;
                            }
                            if (edited.length == 0) {
                                if (count > 0) {
                                    MedicationNames += ', ';
                                }
                                MedicationNames += item.MedicationName + Sig;
                                count++;
                                DifferenceItem.push(item);
                            }
                        }
                    });
                    if (count != 0) {
                        var Affecteditem = '';
                        var OldAffecteditem = '';
                        angular.forEach(DifferenceItem, function (itemA) {
                            Affecteditem += `\nMedications - ${itemA.MedicationName.toUpperCase()} In Physician In Orders, By User: ${GivenByUser}`;
                            angular.forEach($scope.LogObj.PhysicianPrescriptionDetails, function (itemB) {
                                if (itemA.MedicationId === itemB.MedicationId) {
                                    OldAffecteditem += `\nMedications - ${itemB.MedicationName.toUpperCase()} In Physician In Orders, By User: ${GivenByUser}`;
                                }
                            });
                        });
                        let obj = {
                            "LogId": 0,
                            "ModuleId": 2,
                            "ModuleName": "ASC",
                            "SubModuleId": 40,
                            "SubModuleName": "All Orders",
                            "ScreenType": "Physician",
                            "ActionType": "Edited",
                            "OldActionDescription": OldAffecteditem,
                            "NewActionDescription": Affecteditem,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }

                    if (dltcount != 0) {
                        let description = '';
                        if (dltcount === 1) {
                            //description = `Medications - ${dltMedicationNames.toUpperCase()} In Pre-Op(Anesthesia) For Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
                            description = `Medications - ${dltMedicationNames.toUpperCase()} In Physician`;
                        } else {
                            description = `Medications - ${dltMedicationNames.toUpperCase()} In Physician`;
                        }
                        let obj = {
                            "LogId": 0,
                            "ModuleId": 2,
                            "ModuleName": "ASC",
                            "SubModuleId": 40,
                            "SubModuleName": "All Orders",
                            "ScreenType": "Physician",
                            "ActionType": "Deleted",
                            "OldActionDescription": '',
                            "NewActionDescription": description,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }
                }

                else if (tempPrescriptionArray.length > 0) {

                    let MedicationNames = tempPrescriptionArray.map(function (item) {
                        let medicineInfo = item.MedicationName;
                        item.Sig = item.Sig || '';
                        if (item.Sig !== '') {
                            medicineInfo += ' Sig:' + item.Sig;
                        }
                        return medicineInfo;
                    }).join(',');
                    let description = '';
                    if (tempPrescriptionArray.length > 1) {
                        description = `Medications - ${MedicationNames.toUpperCase()} In Physician - Orders`;
                    } else if (tempPrescriptionArray.length === 1) {
                        description = `Medications - ${MedicationNames.toUpperCase()} In Physician - Orders`;
                    }
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 40,
                        "SubModuleName": "All Orders",
                        "ScreenType": "Physician",
                        "ActionType": "Added",
                        "OldActionDescription": '',
                        "NewActionDescription": description,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }
            if (Investigationslistlog.length > 0) {
                if ($scope.LogObj.PhysicianInvestigationslist.length > 0) {
                    let count = 0, InvestigationNames = '', DifferenceItem = [];
                    let dltcount = 0, dltInvestigationNames = '';
                    let GivenByUser = '';

                    var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (eitem) { return eitem.DoctorID == $scope.UserId });
                    if (ReviewedByArraylist.length > 0) {
                        GivenByUser = angular.copy(ReviewedByArraylist[0].SecondUserFullName) +
                            (ReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(ReviewedByArraylist[0].LicenseNumber) : "");
                    }
                    angular.forEach(Investigationslistlog, function (item) {
                        if (item.DeleteInd == 'Y') {
                            if (dltcount > 0) {
                                dltInvestigationNames += ', ';
                            }
                            dltInvestigationNames += item.InvestigationName;
                            dltcount++;

                        } else {
                            var edited = $scope.LogObj.PhysicianInvestigationslist.filter(function (eitem) {
                                return ((eitem.InvestigationId == item.InvestigationId) && (eitem.InvestigationNotes == item.InvestigationNotes) && (eitem.DurationDate == item.DurationDate) &&
                                    (eitem.Duration == item.Duration) && (eitem.LocationId == item.LocationId) && (eitem.Remarks == item.Remarks));
                            }) || [];


                            if (edited.length == 0) {
                                if (count > 0) {
                                    InvestigationNames += ', ';
                                }
                                InvestigationNames += item.InvestigationName;
                                count++;
                                DifferenceItem.push(item);
                            }
                        }
                    });
                    if (count != 0) {
                        var Affecteditem = '';
                        var OldAffecteditem = '';
                        angular.forEach(DifferenceItem, function (itemA) {
                            Affecteditem += `\nInvestigations - ${itemA.InvestigationName.toUpperCase()} In Physician Orders, By User: ${GivenByUser}`;
                            angular.forEach($scope.LogObj.PhysicianInvestigationslist, function (itemB) {
                                if (itemA.InvestigationId === itemB.InvestigationId) {
                                    OldAffecteditem += `\nInvestigations - ${itemB.InvestigationName.toUpperCase()} In Physician Orders, By User: ${GivenByUser}`;
                                }
                            });
                        });
                        let obj = {
                            "LogId": 0,
                            "ModuleId": 2,
                            "ModuleName": "ASC",
                            "SubModuleId": 40,
                            "SubModuleName": "All Orders",
                            "ScreenType": "Physician",
                            "ActionType": "Edited",
                            "OldActionDescription": OldAffecteditem,
                            "NewActionDescription": Affecteditem,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }

                    if (dltcount != 0) {
                        let description = '';
                        if (dltcount === 1) {
                            description = `Investigations - ${dltInvestigationNames.toUpperCase()} In Physician Orders`;
                        } else {
                            description = `Investigations - ${dltInvestigationNames.toUpperCase()} In Physician Orders`;
                        }
                        let obj = {
                            "LogId": 0,
                            "ModuleId": 2,
                            "ModuleName": "ASC",
                            "SubModuleId": 40,
                            "SubModuleName": "All Orders",
                            "ScreenType": "Physician",
                            "ActionType": "Deleted",
                            "OldActionDescription": '',
                            "NewActionDescription": description,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }
                }
                else if (Investigationslistlog.length > 0) {
                    let InvestigationNames = Investigationslistlog.map(function (item) {
                        return item.InvestigationName;
                    }).join(',');
                    let description='';
                    if (Investigationslistlog.length > 1) {
                        description = `Investigations - ${InvestigationNames.toUpperCase()} In Physician Orders`;
                    } else if (Investigationslistlog.length === 1) {
                        description = `Investigations - ${InvestigationNames.toUpperCase()} In Physician Orders`;
                    }
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 40,
                        "SubModuleName": "All Orders",
                        "ScreenType": "Physician",
                        "ActionType": "Added",
                        "OldActionDescription": '',
                        "NewActionDescription": description,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                    //    ordersaddcount++;
                }
            }
            if (GeneralOrderslog.length > 0) {
                if ($scope.LogObj.PhysicianGeneralOrders.length > 0) {
                    var DifferenceItem = [], Affecteditem = '', OldAffecteditem = '';
                    angular.forEach(GeneralOrderslog, function (item) {
                        if (item.DeleteInd == 'Y') {
                            let description = '';
                            description = `Custom Order - "${item.MedicineName}" In Physician Orders`;
                            let obj = {
                                "LogId": 0,
                                "ModuleId": 2,
                                "ModuleName": "ASC",
                                "SubModuleId": 40,
                                "SubModuleName": "All Orders",
                                "ScreenType": "Physician",
                                "ActionType": "Deleted",
                                "OldActionDescription": '',
                                "NewActionDescription": description,
                                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                            };
                            $scope.LogObj.LogArray.push(obj);
                        } else {
                            var edited = $scope.LogObj.PhysicianGeneralOrders.filter(function (eitem) {
                                return ((eitem.MedicineName == item.MedicineName) && (item.Status == eitem.Status));
                            }) || [];


                            if (edited.length == 0) {
                                DifferenceItem.push(item);
                            }
                        }
                    });

                    if (DifferenceItem.length > 0) {
                        var Affecteditem = '';
                        var OldAffecteditem = '';
                        angular.forEach(DifferenceItem, function (itemA) {
                            let GivenByUser = '';
                            var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (eitem) { return eitem.DoctorID == $scope.UserId });
                            if (ReviewedByArraylist.length > 0) {
                                GivenByUser = angular.copy(ReviewedByArraylist[0].SecondUserFullName) +
                                    (ReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(ReviewedByArraylist[0].LicenseNumber) : "");
                            }

                            Affecteditem += `\nCustom Order - "${itemA.MedicineName}" Physician, By User: ${GivenByUser}`;
                            angular.forEach($scope.LogObj.PhysicianGeneralOrders, function (itemB) {
                                if (itemA.MedicineName === itemB.MedicineName) {
                                    OldAffecteditem += `\nCustom Order - "${itemB.MedicineName}" In Physician, By User: ${GivenByUser}`;
                                }
                            });
                        });

                        let obj = {
                            "LogId": 0,
                            "ModuleId": 2,
                            "ModuleName": "ASC",
                            "SubModuleId": 40,
                            "SubModuleName": "All Orders",
                            "ScreenType": "Physician",
                            "ActionType": "Edited",
                            "OldActionDescription": OldAffecteditem,
                            "NewActionDescription": Affecteditem,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }
                }
                else if (GeneralOrderslog.length > 0) {
                    angular.forEach(GeneralOrderslog, function (item) {
                        let description = '';
                        description = `Custom Order - "${item.MedicineName}" in Physician Orders`;
                        let obj = {
                            "LogId": 0,
                            "ModuleId": 2,
                            "ModuleName": "ASC",
                            "SubModuleId": 40,
                            "SubModuleName": "All Orders",
                            "ScreenType": "Physician",
                            "ActionType": "Added",
                            "OldActionDescription": '',
                            "NewActionDescription": description,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    });
                }
            }
            //----Orders----

            if ($scope.LogObj.LogArray.length > 0) {
                Req.Logs = $scope.LogObj || {};
            }
            $scope.PreAdmCardiologyObj.IsClickSavePrescriptionBtn = true;
            eHnoteSurgeryService.AddUpdatePreSurgeryOrders(Req).then(function (resp) {
                if (resp.data.Status === "Success") {
                    alertify.success("Data Submitted successfully!");                   
                    $scope.init();
                    $scope.PreAdmCardiologyObj.IsClickSavePrescriptionBtn = false;
                }
            }, function (err) {
                $scope.PreAdmCardiologyObj.IsClickSavePrescriptionBtn = false;
                console.log(err);
            });

        }


        $scope.AddPhysicanGeneralOrder = function () {
            if ($scope.PreAdmCardiologyObj.OrderName == '') {
                alertify.error("Please Enter General Orders!");
                return false;
            }
            let templist = $filter("filter")($scope.PreAdmCardiologyObj.OrderDetails, {  "MedTypeId": 6, 'IsOrderReviewed': false }, true);
            if (templist.length > 0) {
                let Gobj = {
                    "GeneralOrderId": null,
                    "MedicineName": $scope.PreAdmCardiologyObj.OrderName || '',
                    "DeleteInd": "N",
                    "Status": "",

                }
                templist[0].GeneralOrders.push(Gobj);
                $scope.PreAdmCardiologyObj.OrderName = "";
            }
            else {
                let templist2 = $filter("filter")($scope.PreAdmCardiologyObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                if (templist2.length > 0) {
                    templist2[0].MedTypeId = 6;
                    templist2[0].MedTypeName = 'Physician Medication';
                } else {

                    let templist3 = $filter("filter")($scope.PreAdmCardiologyObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 6 }, true) || [];
                    if (templist3.length > 0) {

                    } else {
                        let obj = {
                            "UserOrderId": 0,
                            "UserId": $scope.UserId,
                            "DeleteInd": "N",
                            "ReviewedBy": null,
                            "IsOrderReviewed": false,
                            "ReviewedByDateTime": null,
                            "ReviewedByPassword": '',
                            "UserType": "Nurse",
                            "ScreenType": "Cardiologist PreAdmission",
                            "ScreenTypeId": 3,
                            "MedTypeId": 6,
                            "MedTypeName": 'Physician Medication',
                            "PrescriptionMainAddObj": getEmptyPrescriptionObj() || '',
                            "GeneralOrders": [],
                            "Investigationslist": [],
                        }
                        $scope.PreAdmCardiologyObj.OrderDetails.push(obj);
                    }

                }


                let templist1 = $filter("filter")($scope.PreAdmCardiologyObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 6 }, true) || [];

                if (templist1.length > 0) {
                    let Gobj = {
                        "GeneralOrderId": null,
                        "MedicineName": $scope.PreAdmCardiologyObj.OrderName || '',
                        "DeleteInd": "N",
                        "Status": "",

                    }
                    templist1[0].GeneralOrders.push(Gobj);
                    $scope.PreAdmCardiologyObj.OrderName = "";
                } else {

                }
            }
        };

        $scope.onPhysicanselectInvestigation = function (InvObject) {

            let templist = $filter("filter")($scope.PreAdmCardiologyObj.OrderDetails, {  "MedTypeId": 6, 'IsOrderReviewed': false }, true);
            if (templist.length > 0) {

                if (InvObject.ProcedureId === '') {
                    InvObject.InvestigationName = '';
                    return false;
                }
                $scope.Surgeryobj.InvestigationObj = InvObject || "";
                if ($scope.Surgeryobj.InvestigationObj === "") {
                    return;
                }
                var object = {
                    "PatientInvestigationId": 0,
                    "ProcedureCode": $scope.Surgeryobj.InvestigationObj.ProcedureCode || "",
                    "OrgInvestigationId": $scope.Surgeryobj.InvestigationObj.OrganizationProcedureId,
                    "InvestigationId": $scope.Surgeryobj.InvestigationObj.ProcedureId,
                    "InvestigationName": $scope.Surgeryobj.InvestigationObj.ProcedureName,
                    "InvestigationDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
                    "OrganId": "",
                    "InvestigationNotes": $scope.Surgeryobj.InvestigationObj.Notes || "",
                    "DeleteInd": "N",
                    "IsEdit": false,
                    "IsNoteEdit": false,
                    "ShowDateFormat": false,
                    "DurationDate": null,
                    "Duration": null,
                    "DurationType": "",
                    "Remarks": "",
                    "LocationId": null,
                    "LabInvestFocus": false,
                    "TypeId": 3
                };
                var i = 0;
                templist[0].Investigationslist = templist[0].Investigationslist || [];
                if (templist[0].Investigationslist.length > 0) {
                    angular.forEach(templist[0].Investigationslist, function (item) {
                        if (item.InvestigationId === $scope.Surgeryobj.InvestigationObj.ProcedureId && item.DeleteInd === 'N') {
                            i++;
                        }
                    });
                }

                if (i > 0) {
                    alertify.error('You already entered this Investigation');
                    $scope.Surgeryobj.InvestigationObj = "";
                }
                if (i === 0) {
                    templist[0].Investigationslist.push(object);
                    $scope.Surgeryobj.InvestigationObj = "";
                }

            }
            else {
                let templist2 = $filter("filter")($scope.PreAdmCardiologyObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                if (templist2.length > 0) {
                    templist2[0].MedTypeId = 6;
                    templist2[0].MedTypeName = 'Physician Medication';
                } else {

                    let templist3 = $filter("filter")($scope.PreAdmCardiologyObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 6 }, true) || [];
                    if (templist3.length > 0) {

                    } else {
                        let obj = {
                            "UserOrderId": 0,
                            "UserId": $scope.UserId,
                            "DeleteInd": "N",
                            "ReviewedBy": null,
                            "IsOrderReviewed": false,
                            "ReviewedByDateTime": null,
                            "ReviewedByPassword": '',
                            "UserType": "Nurse",
                            "ScreenType": "Cardiologist PreAdmission",
                            "ScreenTypeId": 3,
                            "MedTypeId": 6,
                            "MedTypeName": 'Physician Medication',
                            "PrescriptionMainAddObj": getEmptyPrescriptionObj() || '',
                            "GeneralOrders": [],
                            "Investigationslist": [],
                        }
                        $scope.PreAdmCardiologyObj.OrderDetails.push(obj);
                    }

                }


                let templist1 = $filter("filter")($scope.PreAdmCardiologyObj.OrderDetails, { "ReviewedBy": null, "MedTypeId":6}, true) || [];

                if (templist1.length > 0) {
                    if (InvObject.ProcedureId === '') {
                        InvObject.InvestigationName = '';
                        return false;
                    }
                    $scope.Surgeryobj.InvestigationObj = InvObject || "";
                    if ($scope.Surgeryobj.InvestigationObj === "") {
                        return;
                    }
                    var object = {
                        "PatientInvestigationId": 0,
                        "ProcedureCode": $scope.Surgeryobj.InvestigationObj.ProcedureCode || "",
                        "OrgInvestigationId": $scope.Surgeryobj.InvestigationObj.OrganizationProcedureId,
                        "InvestigationId": $scope.Surgeryobj.InvestigationObj.ProcedureId,
                        "InvestigationName": $scope.Surgeryobj.InvestigationObj.ProcedureName,
                        "InvestigationDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
                        "OrganId": "",
                        "InvestigationNotes": $scope.Surgeryobj.InvestigationObj.Notes || "",
                        "DeleteInd": "N",
                        "IsEdit": false,
                        "IsNoteEdit": false,
                        "ShowDateFormat": false,
                        "DurationDate": null,
                        "Duration": null,
                        "DurationType": "",
                        "Remarks": "",
                        "LocationId": null,
                        "LabInvestFocus": false,
                        "TypeId": 3,
                        "MedTypeId": 6,
                        "MedTypeName": 'Physician Medication',
                    };
                    var i = 0;
                    templist1[0].Investigationslist = templist1[0].Investigationslist || [];
                    if (templist1[0].Investigationslist.length > 0) {
                        angular.forEach(templist1[0].Investigationslist, function (item) {
                            if (item.InvestigationId === $scope.Surgeryobj.InvestigationObj.ProcedureId && item.DeleteInd === 'N') {
                                i++;
                            }
                        });
                    }

                    if (i > 0) {
                        alertify.error('You already entered this Investigation');
                        $scope.Surgeryobj.InvestigationObj = "";
                    }
                    if (i === 0) {
                        templist1[0].Investigationslist.push(object);
                        $scope.Surgeryobj.InvestigationObj = "";
                    }

                } else {

                }
            }


        };
        $scope.AnesthesiaPrescription = [];
        $scope.AnesthesiaInvestigations = [];

        $scope.OnPhysicanPrescriptionMedicationDetails = function (obj, type, type1) {


            let templist = $filter("filter")($scope.PreAdmCardiologyObj.OrderDetails, {  "MedTypeId": 6, 'IsOrderReviewed': false }, true);
            if (templist.length > 0) {
                $scope.SigSearch.Shows = false;
                obj.SigfieldsShows = false;
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
                    newmedicationobj.Type = type1;
                    newmedicationobj.IsMedicationStopped = false;
                    newmedicationobj.SigFormationFields = false;
                    newmedicationobj.isEditFocused = false;
                    newmedicationobj.isAddFocused = false;
                    newmedicationobj.SelectedMedicationHistory = 'CurrentEyeMedication';
                    newmedicationobj.TypeId = 3;


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

                    console.log(mparams);


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
                            if (templist[0].PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                                angular.forEach(templist[0].PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                                    if (item.MedicationId == newmedicationobj.MedicationId) {
                                        medi++;
                                    }
                                });
                            }

                            // when showing anesthesia orders separately for display

                            if ($scope.AnesthesiaPrescription.length > 0) {
                                angular.forEach($scope.AnesthesiaPrescription, function (kitem) {
                                    angular.forEach(kitem.PrescriptionDetails, function (item) {
                                        if (item.MedicationId == newmedicationobj.MedicationId) {
                                            medi++;
                                        }
                                    });
                                });
                            }


                            if (medi > 0) {
                                alertify.error('You have already entered this Drug');
                                $scope.medicineGetObj.MedicineObject = "";
                            } else {
                                templist[0].PrescriptionMainAddObj.PrescriptionDetails.unshift(newmedicationobj);
                                $scope.medicineGetObj.MedicineObject = "";
                            }

                        }
                    });


                }
                else {
                    newmedicationobj.MedicationId = obj.MedicineId;
                    newmedicationobj.DrugBrandName = obj.MedicineName;
                    newmedicationobj.MedicationName = obj.MedicineName;
                    newmedicationobj.DrugSchedule = obj.ScheduleType;
                    newmedicationobj.DrugStrength = obj.Strength;
                    newmedicationobj.DrugGenericName = obj.GenericName;

                    newmedicationobj.RcopiaDrugId = obj.RcopiaDrugId || "";
                    newmedicationobj.DrugNDCID = obj.RcopiaDrugNDCID || "";
                    newmedicationobj.DrugFirstDataBankMedID = obj.FirstDataBankMedID || "";
                    newmedicationobj.DrugGenericId = obj.GenericID || "";
                    newmedicationobj.Type = type1;
                    newmedicationobj.IsMedicationStopped = false;
                    newmedicationobj.RxNormList = obj.RxNormList || [];
                    newmedicationobj.SigFormationFields = false;
                    newmedicationobj.isEditFocused = false;
                    newmedicationobj.isAddFocused = false;
                    newmedicationobj.SelectedMedicationHistory = 'CurrentEyeMedication';
                    newmedicationobj.TypeId = 3;

                    if (obj.RxNormList.length > 0) {
                        let filteredRxNorm = $filter("filter")(obj.RxNormList, { "Status": 'a', "Representative": 'y' }, true) || [];
                        if (filteredRxNorm.length > 0) {
                            newmedicationobj.DrugRxNormId = filteredRxNorm[0].RXNormId;
                        }
                    }
                    var medi = 0;
                    if (templist[0].PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                        angular.forEach(templist[0].PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                            if (item.MedicationId == newmedicationobj.MedicationId) {
                                medi++;
                            }
                        });
                    }

                    // when showing anesthesia orders separately for display

                    if ($scope.AnesthesiaPrescription.length > 0) {
                        angular.forEach($scope.AnesthesiaPrescription, function (kitem) {
                            angular.forEach(kitem.PrescriptionDetails, function (item) {
                                if (item.MedicationId == newmedicationobj.MedicationId) {
                                    medi++;
                                }
                            });
                        });
                    }


                    if (medi > 0) {
                        alertify.error('You have already entered this Drug');
                        $scope.medicineGetObj.MedicineObject = "";
                    } else {
                        templist[0].PrescriptionMainAddObj.PrescriptionDetails.unshift(newmedicationobj);
                        $scope.medicineGetObj.MedicineObject = "";
                    }
                }

                if (templist[0].PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                    $scope.PrescriptionMainAddObj.IsNKMSelected = false;
                }
            }
            else {
                let templist2 = $filter("filter")($scope.PreAdmCardiologyObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                if (templist2.length > 0) {
                    templist2[0].MedTypeId =6;
                    templist2[0].MedTypeName = 'Physician PreAdmission';
                } else {

                    let templist3 = $filter("filter")($scope.PreAdmCardiologyObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 6 }, true) || [];
                    if (templist3.length > 0) {

                    } else {
                        let obj = {
                            "UserOrderId": 0,
                            "UserId": $scope.UserId,
                            "DeleteInd": "N",
                            "ReviewedBy": null,
                            "IsOrderReviewed": false,
                            "ReviewedByDateTime": null,
                            "ReviewedByPassword": '',
                            "UserType": "Nurse",
                            "ScreenType": "Cardiologist PreAdmission",
                            "ScreenTypeId": 3,
                            "MedTypeId": 6,
                            "MedTypeName": 'Physician Medications',
                            "PrescriptionMainAddObj": getEmptyPrescriptionObj() || '',
                            "GeneralOrders": [],
                            "Investigationslist": [],
                        }
                        $scope.PreAdmCardiologyObj.OrderDetails.push(obj);
                    }

                }


                let templist1 = $filter("filter")($scope.PreAdmCardiologyObj.OrderDetails, { "ReviewedBy": null, "MedTypeId":6 }, true) || [];

                if (templist1.length > 0) {
                    console.log(JSON.stringify(obj));
                    $scope.SigSearch.Shows = false;
                    obj.SigfieldsShows = false;
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
                        newmedicationobj.Type = type1;
                        newmedicationobj.IsMedicationStopped = false;
                        newmedicationobj.SigFormationFields = false;
                        newmedicationobj.isEditFocused = false;
                        newmedicationobj.isAddFocused = false;
                        newmedicationobj.SelectedMedicationHistory = 'CurrentEyeMedication';
                        newmedicationobj.TypeId = 3;


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

                        console.log(mparams);


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
                                if (templist1[0].PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                                    angular.forEach(templist1[0].PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                                        if (item.MedicationId == newmedicationobj.MedicationId) {
                                            medi++;
                                        }
                                    });
                                }

                                // when showing anesthesia orders separately for display

                                if ($scope.AnesthesiaPrescription.length > 0) {
                                    angular.forEach($scope.AnesthesiaPrescription, function (kitem) {
                                        angular.forEach(kitem.PrescriptionDetails, function (item) {
                                            if (item.MedicationId == newmedicationobj.MedicationId) {
                                                medi++;
                                            }
                                        });
                                    });
                                }


                                if (medi > 0) {
                                    alertify.error('You have already entered this Drug');
                                    $scope.medicineGetObj.MedicineObject = "";
                                } else {
                                    templist1[0].PrescriptionMainAddObj.PrescriptionDetails.unshift(newmedicationobj);
                                    $scope.medicineGetObj.MedicineObject = "";
                                }

                            }
                        });


                    }
                    else {
                        newmedicationobj.MedicationId = obj.MedicineId;
                        newmedicationobj.DrugBrandName = obj.MedicineName;
                        newmedicationobj.MedicationName = obj.MedicineName;
                        newmedicationobj.DrugSchedule = obj.ScheduleType;
                        newmedicationobj.DrugStrength = obj.Strength;
                        newmedicationobj.DrugGenericName = obj.GenericName;

                        newmedicationobj.RcopiaDrugId = obj.RcopiaDrugId || "";
                        newmedicationobj.DrugNDCID = obj.RcopiaDrugNDCID || "";
                        newmedicationobj.DrugFirstDataBankMedID = obj.FirstDataBankMedID || "";
                        newmedicationobj.DrugGenericId = obj.GenericID || "";
                        newmedicationobj.Type = type1;
                        newmedicationobj.IsMedicationStopped = false;
                        newmedicationobj.RxNormList = obj.RxNormList || [];
                        newmedicationobj.SigFormationFields = false;
                        newmedicationobj.isEditFocused = false;
                        newmedicationobj.isAddFocused = false;
                        newmedicationobj.SelectedMedicationHistory = 'CurrentEyeMedication';
                        newmedicationobj.TypeId = 3;

                        if (obj.RxNormList.length > 0) {
                            let filteredRxNorm = $filter("filter")(obj.RxNormList, { "Status": 'a', "Representative": 'y' }, true) || [];
                            if (filteredRxNorm.length > 0) {
                                newmedicationobj.DrugRxNormId = filteredRxNorm[0].RXNormId;
                            }
                        }
                        var medi = 0;
                        if (templist1[0].PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                            angular.forEach(templist1[0].PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                                if (item.MedicationId == newmedicationobj.MedicationId) {
                                    medi++;
                                }
                            });
                        }

                        // when showing anesthesia orders separately for display

                        if ($scope.AnesthesiaPrescription.length > 0) {
                            angular.forEach($scope.AnesthesiaPrescription, function (kitem) {
                                angular.forEach(kitem.PrescriptionDetails, function (item) {
                                    if (item.MedicationId == newmedicationobj.MedicationId) {
                                        medi++;
                                    }
                                });
                            });
                        }


                        if (medi > 0) {
                            alertify.error('You have already entered this Drug');
                            $scope.medicineGetObj.MedicineObject = "";
                        } else {
                            templist1[0].PrescriptionMainAddObj.PrescriptionDetails.unshift(newmedicationobj);
                            $scope.medicineGetObj.MedicineObject = "";
                        }
                    }

                    if (templist1[0].PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                        $scope.PrescriptionMainAddObj.IsNKMSelected = false;
                    }

                } else {

                }
            }







        };


        if (UserAccessRights.AllAccessRights.PreOpDilationMedications) {
            $scope.PreOpAndDialationMedications.SubTabType = 1;
        }
        
        if (UserAccessRights.AllAccessRights.IntraOpMedications) {
            $scope.IntraOpMedicationObj.SubTab = 1;
        }else if (UserAccessRights.AllAccessRights.IntraOpAnesthesiaMedications) {
            $scope.IntraOpMedicationObj.SubTab = 2;
        }



        $scope.changeIntratab = function (subtab) {
            if (subtab == 1) {
                if ($scope.UserAccessRights.AllAccessRights.IntraOpMedications) {
                    $scope.IntraOpMedicationObj.SubTab = 1; 
                } else {
                    $scope.IntraOpMedicationObj.SubTab = 2;
                    alertify.error("No access for this user !");
                    return false;
                }
            } else {
                if ($scope.UserAccessRights.AllAccessRights.IntraOpAnesthesiaMedications) {
                    $scope.IntraOpMedicationObj.SubTab = 2; 
                } else {
                    $scope.IntraOpMedicationObj.SubTab = 1;
                    alertify.error("No access for this user !");
                    return false;
                }
            }


            if ($scope.IntraOpMedicationObj.SubTab == 1) {
                let i = 0;
                let j = 0;
                let FinalOrderDetails = $filter('filter')($scope.IntraOpObj.OrderDetails, { 'MedTypeId': 4 }, true) || [];
                if (FinalOrderDetails.length > 0) {
                    angular.forEach(FinalOrderDetails, function (Mitem) {
                        Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                        if (Mitem.ReviewedBy != null && Mitem.IsOrderReviewed == false) {
                            if (Mitem.ReviewedByPassword == '') {
                                j++
                            }
                        }
                        if (Mitem.IntraOpMedications.length > 0) {
                            angular.forEach(Mitem.IntraOpMedications, function (item) {
                                if (item.DropTimings.length > 0) {
                                    let tempArray = $filter('filter')(item.DropTimings, { 'GivenBy': null }, true);
                                    if (tempArray.length > 0) {
                                        i++
                                    }
                                };
                            });
                        }

                    });
                }
                if (j !== 0) {
                    alertify.error("Plese Enter Password");
                    return false;
                }
                if (i !== 0) {
                    alertify.error("Plese select Givenby for Medications!");
                    return false;
                }

                $scope.SaveIntraopMedication();
            }
            if ($scope.IntraOpMedicationObj.SubTab == 2) {

                var i = 0;
                var n = 0;
                let FinalPreOrderDetails = $filter('filter')($scope.IntraOpObj.OrderDetails, { 'MedTypeId': 3 }, true) || [];
                if (FinalPreOrderDetails.length > 0) {
                    angular.forEach(FinalPreOrderDetails, function (Mitem) {
                        Mitem.IsOrderReviewed = Mitem.IsOrderReviewed || false;
                        Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                        if (Mitem.ReviewedBy != null && Mitem.IsOrderReviewed == false) {
                            if (Mitem.ReviewedByPassword == '') {
                                n++
                            }
                        }
                        if (Mitem.IntraOpMedications.length > 0) {
                            angular.forEach(Mitem.IntraOpMedications, function (item) {
                                if (item.DropTimings.length > 0) {
                                    let tempArray = $filter('filter')(item.DropTimings, { 'GivenBy': null }, true);
                                    if (tempArray.length > 0) {
                                        i++
                                    }
                                };

                            });
                        }
                    });
                }
                if (n !== 0) {
                    alertify.error("Plese Enter Password");
                    return false;
                }
                if (i !== 0) {
                    alertify.error("Plese select Givenby for Medications!");
                    return false;
                }

                $scope.SaveIntraopMedication();
            }

        };

        $scope.PresurgeryOrderinit = function (Type) {
           
                let FinalPhysicianOrderDetails = $filter('filter')($scope.PreAdmCardiologyObj.OrderDetails, { 'MedTypeId': 6 }, true) || [];
                if (FinalPhysicianOrderDetails.length > 0) {
                    angular.forEach(FinalPhysicianOrderDetails, function (Mitem) {
                        let temp = $filter('filter')(Mitem.PrescriptionMainAddObj.PrescriptionDetails, { 'DeleteInd': 'N' }, true) || [];
                        let temp1 = $filter('filter')(Mitem.Investigationslist, { 'DeleteInd': 'N' }, true) || [];
                        let temp2 = $filter('filter')(Mitem.GeneralOrders, { 'DeleteInd': 'N' }, true) || [];
                        if (temp.length == 0 && temp1.length == 0 && temp2.length == 0) {
                            Mitem.DeleteInd = 'Y';
                        }
                    });
                }
           
                let FinalAnesthetistOrderDetails = $filter('filter')($scope.PreAdmCardiologyObj.OrderDetails, { 'MedTypeId': 7 }, true) || [];
                if (FinalAnesthetistOrderDetails.length > 0) {
                    angular.forEach(FinalAnesthetistOrderDetails, function (Mitem) {
                        let temp = $filter('filter')(Mitem.PrescriptionMainAddObj.PrescriptionDetails, { 'DeleteInd': 'N' }, true) || [];
                        let temp1 = $filter('filter')(Mitem.Investigationslist, { 'DeleteInd': 'N' }, true) || [];
                        let temp2 = $filter('filter')(Mitem.GeneralOrders, { 'DeleteInd': 'N' }, true) || [];
                        if (temp.length == 0 && temp1.length == 0 && temp2.length == 0) {
                            Mitem.DeleteInd = 'Y';
                        }
                    });
                }
            }
        
        $scope.DelectInvestigation = function (Mitem, Aitem,Type) {
            var index = Mitem.Investigationslist.indexOf(Aitem);
            if (Type === 'Physician') {
                if (Aitem.PatientInvestigationId === 0) {
                    if (index > -1) {
                        angular.forEach($scope.PreAdmCardiologyObj.OrderDetails, function (Mitem) {
                            if (Mitem.Investigationslist.length > 0) {
                                angular.forEach(Mitem.Investigationslist, function (item) {
                                    if (item.InvestigationId == Aitem.InvestigationId) {
                                        Mitem.Investigationslist.splice(index, 1);
                                    }
                                });
                            }
                        })
                    }
                } else {
                    angular.forEach($scope.PreAdmCardiologyObj.OrderDetails, function (Nitem) {
                        if (Nitem.Investigationslist.length > 0) {
                            angular.forEach(Nitem.Investigationslist, function (item) {
                                if (item.InvestigationId == Aitem.InvestigationId) {
                                    Nitem.Investigationslist[index].DeleteInd = 'Y';
                                }
                            });
                        }
                    })
                }
            } else {
                if (Aitem.PatientInvestigationId === 0) {
                    if (index > -1) {
                        angular.forEach($scope.PreAdmAnesthetistObj.OrderDetails, function (Mitem) {
                            if (Mitem.Investigationslist.length > 0) {
                                angular.forEach(Mitem.Investigationslist, function (item) {
                                    if (item.InvestigationId == Aitem.InvestigationId) {
                                        Mitem.Investigationslist.splice(index, 1);
                                    }
                                });
                            }
                        })
                    }
                } else {
                    angular.forEach($scope.PreAdmAnesthetistObj.OrderDetails, function (Nitem) {
                        if (Nitem.Investigationslist.length > 0) {
                            angular.forEach(Nitem.Investigationslist, function (item) {
                                if (item.InvestigationId == Aitem.InvestigationId) {
                                    Nitem.Investigationslist[index].DeleteInd = 'Y';
                                }
                            });
                        }
                    })
                }
            }
            if (Type == 'Physician') {
                $scope.PresurgeryOrderinit('Physician');
            }
            else {
                $scope.PresurgeryOrderinit('Anesthetist');
            }
        };

        $scope.RemovePhysicanMedicationDetails = function (Mitem, item) {
            var index = Mitem.PrescriptionMainAddObj.PrescriptionDetails.indexOf(item);
            item.PatientPrescriptionDetailId = item.PatientPrescriptionDetailId || null;
            if (item.PatientPrescriptionDetailId === null) {
                if (index > -1) {
                    angular.forEach($scope.PreAdmCardiologyObj.OrderDetails, function (citem) {
                        if (citem.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                            angular.forEach(citem.PrescriptionMainAddObj.PrescriptionDetails, function (aitem) {
                                if (aitem.MedicationId == item.MedicationId) {
                                    citem.PrescriptionMainAddObj.PrescriptionDetails.splice(index, 1);
                                }
                            });
                        }
                    })
                }
            } else {
                angular.forEach($scope.PreAdmCardiologyObj.OrderDetails, function (Bitem) {
                    if (Bitem.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                        angular.forEach(Bitem.PrescriptionMainAddObj.PrescriptionDetails, function (aitem) {
                            if (aitem.MedicationId == item.MedicationId) {
                                Bitem.PrescriptionMainAddObj.PrescriptionDetails[index].DeleteInd = 'Y';
                            }
                        });
                    }
                })
            }
            $scope.PresurgeryOrderinit('Physician');
        };

        $scope.RemoveMedicationDetails = function (Mitem, item) {
            var index = Mitem.PrescriptionMainAddObj.PrescriptionDetails.indexOf(item);
            item.PatientPrescriptionDetailId = item.PatientPrescriptionDetailId || null;
            if (item.PatientPrescriptionDetailId === null) {
                if (index > -1) {
                    angular.forEach($scope.PreAdmAnesthetistObj.OrderDetails, function (citem) {
                        if (citem.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                            angular.forEach(citem.PrescriptionMainAddObj.PrescriptionDetails, function (aitem) {
                                if (aitem.MedicationId == item.MedicationId) {
                                    citem.PrescriptionMainAddObj.PrescriptionDetails.splice(index, 1);
                                }
                            });

                        }
                    })
                }
            } else {
                angular.forEach($scope.PreAdmAnesthetistObj.OrderDetails, function (Bitem) {
                    if (Bitem.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                        angular.forEach(Bitem.PrescriptionMainAddObj.PrescriptionDetails, function (aitem) {
                            if (aitem.MedicationId == item.MedicationId) {
                                Bitem.PrescriptionMainAddObj.PrescriptionDetails[index].DeleteInd = 'Y';
                            }
                        });

                    }
                })
            }
            $scope.PresurgeryOrderinit('Anesthetist');
        };

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
                "Quantity": null,
                "QuantityUnitId": "",
                "QuantityUnit": "",
                "RefillId": "",
                "Refills": "",
                "DeleteInd": "N",
                "IsFrequent": "N",
                "PageSize": 10,
                "PageNumber": 1,
                "MedicineId": $scope.adnewsigobj.MedicineId || 0
            };
            return obj;
        }
        $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
        $scope.clearOrganizationSiginput = function () {
            $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
        };

        $scope.getParticularSigMedicationitems = function (text, item) {
            text = text || '';
            if (item.IsAllSig) {
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
            } else {
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
            }
        };
        $scope.savedSigs = [];
        $scope.SaveOrganizationSig = function () {
            console.log($scope.addNewOrganizationSigObj);
            if ($scope.addNewOrganizationSigObj.Action == '' && $scope.addNewOrganizationSigObj.DaysSupply == '' && $scope.addNewOrganizationSigObj.Dose == '' && $scope.addNewOrganizationSigObj.DoseOther == '' && $scope.addNewOrganizationSigObj.DoseUnit == '' && $scope.addNewOrganizationSigObj.Frequency == '' && $scope.addNewOrganizationSigObj.Route == '') {
                alertify.error("Please Select any sig value");
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
                $scope.adnewsigobj.IsNewSig = false;

            }
            function OnAddSigError() {
                alertify.error("Creating  Failed");
            }
        };
        $scope.ShowSigFields = function (item) {
            item.SigFields = !item.SigFields;
            $scope.adnewsigobj.IsNewSig = false;
            item.isEditFocused = true;
            item.isAddFocused = false;
        }
        $scope.AddNewMedicineIdchange = function (item) {

            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                    item.SigFormationFields = false;
                    item.isAddFocused = false;
                });
            }

            item.MedicineObj = '';
            item.SigObj = '';
            $scope.adnewsigobj.MedicineId = item.MedicationId || 0;
            $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
            item.SigFields = false;
            $scope.adnewsigobj.IsNewSig = true;
            item.SigFormationFields = !item.SigFormationFields;
            item.isEditFocused = false;
            item.isAddFocused = true;

            item.ActionId = 0;
            item.Action = '';
            item.Dose = '';
            item.DoseUnit = '';
            item.Route = '';
            item.Frequency = '';
            item.DoseOther = '';
            item.DaysSupply = '';
            item.DoseId = 0;
            item.DoseUnitId = 0;
            item.RouteId = 0;
            item.FrequencyId = 0;
            item.DoseOtherId = 0;
            item.DaysSupplyId = 0;
            //item.Quantity = null;
            //item.QuantityUnitId = 0;
            //item.QuantityUnit = '';
            //item.RefillId = 0;
            //item.Refills = '';
        }
        $scope.ONSigDetailsMedOrders = function (item, mainitem) {
            console.log(item);
            console.log(mainitem);
            $scope.adnewsigobj.IsNewSig = false;
            mainitem.isAddFocused = false;
            mainitem.isEditFocused = false;
            mainitem.SigfieldsShows = true;
            //mainitem.SigFields = true;
            mainitem.ActionId = item.ActionId || null;
            mainitem.Action = item.Action || '';
            mainitem.Dose = item.Dose || '';
            mainitem.DoseUnit = item.DoseUnit || '';
            mainitem.Route = item.Route || '';
            mainitem.Frequency = item.Frequency || '';
            mainitem.DoseOther = item.DoseOther || '';
            mainitem.DaysSupply = item.DaysSupply || '';
            mainitem.DoseId = item.DoseId || null;
            mainitem.DoseUnitId = item.DoseUnitId || null;
            mainitem.RouteId = item.RouteId || null;
            mainitem.FrequencyId = item.FrequencyId || null;
            mainitem.DoseOtherId = item.DoseOtherId || null;
            mainitem.DaysSupplyId = item.DaysSupplyId || null;
            mainitem.Sig = item.Sig;
            mainitem.SigId = item.OrganizationSigTemplateId;
            mainitem.MedicineObj = ''

            if (item.DaysSupplyId != 0) {
                var filteredArray = $filter("filter")($scope.DurationArray, { "MedicineDosaageFieldId": mainitem.DaysSupplyId }, true) || [];
                if (filteredArray.length > 0) {
                    var DateCode = filteredArray[0].Code;
                    var currentDate = new Date();
                    var futureDate = new Date(currentDate.getTime() + (parseInt(DateCode) * 24 * 60 * 60 * 1000));
                    mainitem.StopDate = $filter('date')(futureDate, 'MM/dd/yyyy');
                }
            }
        };

        $scope.changePrescAction = function (mainobj) {
            var filteredArray = $filter("filter")($scope.actionArray, { "MedicineDosaageFieldId": mainobj.ActionId }, true);
            if (filteredArray.length > 0) {
                mainobj.Action = filteredArray[0].Code;
            };
            $scope.addSIgNameDynamicallyAdded(mainobj.TypeId);
        };
        $scope.changePrescDose = function (mainobj) {
            var filteredArray = $filter("filter")($scope.doseArray, { "MedicineDosaageFieldId": mainobj.DoseId }, true);
            if (filteredArray.length > 0) {
                mainobj.Dose = filteredArray[0].Code;
            };
            $scope.addSIgNameDynamicallyAdded(mainobj.TypeId);
        };
        $scope.changePrescDoseUnit = function (mainobj) {
            var filteredArray = $filter("filter")($scope.doseUnitArray, { "MedicineDosaageFieldId": mainobj.DoseUnitId }, true);
            if (filteredArray.length > 0) {
                mainobj.DoseUnit = filteredArray[0].Code;
            };
            $scope.addSIgNameDynamicallyAdded(mainobj.TypeId);
        };
        $scope.changePrescRoute = function (mainobj) {
            var filteredArray = $filter("filter")($scope.routeArray, { "MedicineDosaageFieldId": mainobj.RouteId }, true);
            if (filteredArray.length > 0) {
                mainobj.Route = filteredArray[0].Code;
            };
            $scope.addSIgNameDynamicallyAdded(mainobj.TypeId);
        };
        $scope.changePrescFrequency = function (mainobj) {
            var filteredArray = $filter("filter")($scope.frequencyArray, { "MedicineDosaageFieldId": mainobj.FrequencyId }, true);
            if (filteredArray.length > 0) {
                mainobj.Frequency = filteredArray[0].Description;
            };
            $scope.addSIgNameDynamicallyAdded(mainobj.TypeId);
        };
        $scope.changePrescDoseOther = function (mainobj) {
            var filteredArray = $filter("filter")($scope.doseOtherArray, { "MedicineDosaageFieldId": mainobj.DoseOtherId }, true);
            if (filteredArray.length > 0) {
                mainobj.DoseOther = filteredArray[0].Code;
            };
            $scope.addSIgNameDynamicallyAdded(mainobj.TypeId);
        };
        $scope.changePrescDaysSupply = function (mainobj) {
            var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": mainobj.DaysSupplyId }, true);
            if (filteredArray.length > 0) {
                mainobj.DaysSupply = filteredArray[0].Code;
                mainobj.DaysSupplyDescription = filteredArray[0].Description;
            };
            if (mainobj.DaysSupplyId != 0) {
                var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": mainobj.DaysSupplyId }, true);
                if (filteredArray.length > 0) {
                    var DateCode = filteredArray[0].Code;
                    //var currentDate = new Date(mainobj.StartDate);
                    var currentDate = new Date();
                    var futureDate = new Date(currentDate.getTime() + (parseInt(DateCode) * 24 * 60 * 60 * 1000));
                    mainobj.StopDate = $filter('date')(futureDate, 'MM/dd/yyyy');
                }
            } else {
                mainobj.StopDate = null;
                mainobj.DaysSupply = '';
                mainobj.DaysSupplyDescription = '';
            }

            $scope.addSIgNameDynamicallyAdded(mainobj.TypeId);
        };
        $scope.changePrescQuantityUnit = function (mainobj) {
            var filteredArray = $filter("filter")($scope.quantityUnitArray, { "MedicineDosaageFieldId": mainobj.QuantityUnitId }, true);
            if (filteredArray.length > 0) {
                mainobj.QuantityUnit = filteredArray[0].Code;
            };
            /*$scope.addSIgNameDynamicallyAdded();*/
        };
        $scope.changePrescRefill = function (mainobj) {
            var filteredArray = $filter("filter")($scope.refillsArray, { "MedicineDosaageFieldId": mainobj.RefillId }, true);
            if (filteredArray.length > 0) {
                mainobj.Refills = filteredArray[0].Description;
            };
            /*$scope.addSIgNameDynamicallyAdded();*/
        };
        $scope.addSIgNameDynamicallyAdded = function (TypeId) {

            if (TypeId==2) {
                if ($scope.PreAdmAnesthetistObj.OrderDetails.length > 0) {
                    angular.forEach($scope.PreAdmAnesthetistObj.OrderDetails, function (item, index) {
                        if (item.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                            angular.forEach(item.PrescriptionMainAddObj.PrescriptionDetails, function (initem, index) {
                                var dosesupplytest = "";

                                if (initem.DaysSupply !== '') {
                                    var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": initem.DaysSupplyId }, true);
                                    if (filteredArray.length > 0) {
                                        initem.DaysSupply = filteredArray[0].Code;
                                        dosesupplytest = " for " + filteredArray[0].Description;
                                    }
                                }
                                dosesupplytest = dosesupplytest || ""
                                initem.SigObj = initem.Action + " " + initem.Dose + " " + initem.DoseUnit + " " + initem.Route + " " + initem.Frequency + " " + initem.DoseOther + "" + dosesupplytest;
                                initem.Sig = initem.Action + " " + initem.Dose + " " + initem.DoseUnit + " " + initem.Route + " " + initem.Frequency + " " + initem.DoseOther + "" + dosesupplytest;
                            });
                        };
                    });
                }

            }

           else {
                if ($scope.PreAdmCardiologyObj.OrderDetails.length > 0) {
                    angular.forEach($scope.PreAdmCardiologyObj.OrderDetails, function (item, index) {
                        if (item.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                            angular.forEach(item.PrescriptionMainAddObj.PrescriptionDetails, function (initem, index) {
                                var dosesupplytest = "";

                                if (initem.DaysSupply !== '') {
                                    var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": initem.DaysSupplyId }, true);
                                    if (filteredArray.length > 0) {
                                        initem.DaysSupply = filteredArray[0].Code;
                                        dosesupplytest = " for " + filteredArray[0].Description;
                                    }
                                }
                                dosesupplytest = dosesupplytest || ""
                                initem.SigObj = initem.Action + " " + initem.Dose + " " + initem.DoseUnit + " " + initem.Route + " " + initem.Frequency + " " + initem.DoseOther + "" + dosesupplytest;
                                initem.Sig = initem.Action + " " + initem.Dose + " " + initem.DoseUnit + " " + initem.Route + " " + initem.Frequency + " " + initem.DoseOther + "" + dosesupplytest;
                            });
                        };
                    });
                }
            }


        }


        //print starts from here
        $scope.GetSurgeryDiagnosisObj = function () {
            return {
                "DiagnosisName": "",
                "AnesthesistName": "",
                "NurseName": "",
                "SurgeryDate": "",
                "OperativeProcedure": "",
                "SurgeonName": "",
                "SurgeryName": "",
                "AscAppointmentDate": "",
            };
        };

        $scope.SurgeryDiagnosisObj = angular.copy($scope.GetSurgeryDiagnosisObj());
        $scope.AscPreopObj = {
            
            "PreOpMedications": [],
            "DilationMedications": [],
            "OrgASCChecklist": [],
            "IsVeinOpened": null,
            "IsDiabetes": null,
            "IsHypoglycemiaCheck": false,
            "DiabetesResult": "",
            "DiabetesTime": "",
            "OSPupilSize": "",
            "ODPupilSize":"",
            "DiabetesTimings": [],
            "PreOpNotes": "",
            "PreOpAnesthesiaNotes": null,
            "OrderDetails": [],
            "IVAccessDetailsList":[],
        }
        $scope.AscPostOp = {
            
            "OrgASCChecklist": [],
            "OrderDetails": []
        }
        $scope.AscIntraOp = {

            "OrgASCChecklist": [],
            "OrderDetails": []
        }
        $scope.AscIntraopOrders = {
            "AnesthesiaMedications":  [],
            "IntraOpMedications": [],
        }
        $scope.GetSurgeryStaffListDetails = function () {

            var obj = {
                "AppointmentID": $scope.cacheStorageItem.AppointmentId,
                "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId
            };

            eHnoteSurgeryService.GetASCAppointmentSurgeryStaff(obj).then(function (response) {
                if (response.data.Status === "Success") {
                    $scope.ApptSurgeryList = angular.copy(response.data.SurgeryList);
                    $scope.ExternalPreadmissionDocuments = angular.copy(response.data.DocumentDetails);
                    $scope.SurgeryDiagnosisObj = angular.copy($scope.GetSurgeryDiagnosisObj());

                    if ($scope.ApptSurgeryList.length > 0) {
                        angular.forEach($scope.ApptSurgeryList, function (item) {

                            if ($scope.ApptSurgeryList[0].DiagnosisList.length > 0) {
                                $scope.SurgeryDiagnosisObj.DiagnosisName = $scope.ApptSurgeryList[0].DiagnosisList[0].DiagnosisName;
                            }
                      
                            $scope.SurgeryDiagnosisObj.SurgeryName = $scope.ApptSurgeryList[0].SurgeryName;
                            $scope.SurgeryDiagnosisObj.AscAppointmentDate = $scope.ApptSurgeryList[0].AscAppointmentDate;
                            

               

                            if (item.AnesthetistId != null) {
                                let Anesthesistlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.AnesthetistId }, true);
                                if (Anesthesistlist.length > 0) {
                                    $scope.ApptSurgeryList[0].AnesthesistName = Anesthesistlist[0].FullName;
                                    $scope.SurgeryDiagnosisObj.AnesthesistName = Anesthesistlist[0].UserFullName || "";
                                    
                                } else {
                                    $scope.ApptSurgeryList[0].AnesthesistName = '';
                                }
                            }

                            if (item.NurseId != null) {
                                let Nurselist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.NurseId }, true);
                                if (Nurselist.length > 0) {
                                    $scope.ApptSurgeryList[0].NurseName = Nurselist[0].FullName;
                                    $scope.SurgeryDiagnosisObj.NurseName = Nurselist[0].FullName;
                                } else {
                                    $scope.ApptSurgeryList[0].NurseName = '';
                                }
                            }

                            if (item.SurgeonId != null) {
                                let Surgeonlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.SurgeonId }, true);
                                if (Surgeonlist.length > 0) {
                                    $scope.ApptSurgeryList[0].SurgeonName = Surgeonlist[0].FullName;
                                    $scope.SurgeryDiagnosisObj.SurgeonName = Surgeonlist[0].UserFullName;
                                } else {
                                    $scope.ApptSurgeryList[0].SurgeonName = '';
                                }
                            }
                        });
                    }

                }
            });
        }
        $scope.GetSurgeryStaffListDetails();

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
        $scope.initOrgLogo();
        $scope.PrintAscDetails = function () {
            let req = {
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "PatientId": $scope.cacheStorageItem.PatientID || null
            };

            $q.all([
                eHnoteSurgeryService.GetpatientAscSummary(req),
            ]).then(function (resp) {

                if (resp[0].data.Status === "Success") {

                    $scope.OrganizationDetails = resp[0].data.OrganizationDetails || [];
                    if ($scope.OrganizationDetails.length && $scope.OrganizationDetails[0]?.OrganizationLogoUrl) {
                        $scope.toDataURL($scope.OrganizationDetails[0].OrganizationLogoUrl, function (dataURL) {
                            $scope.$applyAsync(() => {
                                $scope.OrganizationDetails[0].OrganizationLogoUrl = dataURL;
                                $scope.generateAllOrderPrint(resp);
                            });
                        });
                    } else {
                        $scope.generateAllOrderPrint(resp);
                    }
                }
            });
        }
     /* Orders reaching the print must carry an exact OrderTypeId of 1 (Standing) or 2 (Live): the print renderer
     (USPrintService getDilationMedicationsPIP) counts and renders only those two values, so an order whose
     OrderTypeId is null, 0 or the string "1" falls through both branches and prints nothing at all - which is
     why Standing Surgeon Medications were missing from the PDF while Standing Custom Orders still printed.
     The Admit print already repairs this (USPrintService.GetAdmitSurgeonOrdersFromAdmission -> orderTypeOf);
     this does the same for the All Orders "Print All". It works on a copy, so nothing held on
     $scope.AscPreopObj is modified and only the print output changes. */
     $scope.NormalizeOrdersForPrint = function (OrderDetails) {
         return angular.copy(OrderDetails || []).map(function (Mitem) {
             Mitem.DilationMedications = (Mitem.DilationMedications && Mitem.DilationMedications.length)
                 ? Mitem.DilationMedications
                 : (Mitem.AscMedications || []);
             Mitem.GeneralOrders = Mitem.GeneralOrders || [];

             var typeId = Number(Mitem.OrderTypeId) || 0;
             if (!typeId) {
                 var typed = Mitem.DilationMedications.concat(Mitem.GeneralOrders).filter(function (x) {
                     return Number(x.OrderTypeId) > 0;
                 })[0];
                 typeId = typed ? Number(typed.OrderTypeId) : 0;
             }
             if (!typeId && Mitem.OrderTypeName) {
                 typeId = /live/i.test(Mitem.OrderTypeName) ? 2 : 1;
             }
             Mitem.OrderTypeId = typeId == 2 ? 2 : 1;
             return Mitem;
         });
     };
        $scope.generateAllOrderPrint = function (resp) {

            $scope.SurgeryDiagnosisObj.SurgeryList = resp[0].data.SurgeryList || [];
            $scope.CurrentAppointmentVital = resp[0].data.CurrentAppointmentVital || {};
            let Surgeonlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.cacheStorageItem.DoctorID }, true) || [];
            if (Surgeonlist.length > 0) {
                $scope.SurgeryDiagnosisObj.SurgeonName = Surgeonlist[0].UserFullName;
            } else {
                $scope.SurgeryDiagnosisObj.SurgeonName = '';
            }

            $scope.ReviewedByanethelogist = [];
            if ($scope.allUserList.length > 0) {
                $scope.ReviewedByanethelogist = $scope.allUserList.filter((x) => x.RoleId == 30);
            }
            else {
                $scope.ReviewedByanethelogist = [];
            }

            var DiagnosisName = '';
            var AdditionalSurgeryName = '';
            if ($scope.SurgeryDiagnosisObj.SurgeryList.length > 0) {
                $scope.SurgeryDiagnosisObj.SurgeryList[0].DiagnosisList = $scope.SurgeryDiagnosisObj.SurgeryList[0].DiagnosisList || [];
                if ($scope.SurgeryDiagnosisObj.SurgeryList[0].DiagnosisList.length > 0) {
                    angular.forEach($scope.SurgeryDiagnosisObj.SurgeryList[0].DiagnosisList, function (sitem) {
                        var IcdCode = '';
                        sitem.ICDCode = sitem.ICDCode || '';
                        if (sitem.ICDCode !== '') {
                            IcdCode = sitem.ICDCode;
                        }
                        DiagnosisName += "," + IcdCode + '-' + sitem.DiagnosisName;
                    });
                    if (DiagnosisName.charAt(0) === ",") {
                        DiagnosisName = DiagnosisName.slice(1);
                    }
                } else {
                    DiagnosisName = '';
                }

                var Description = "";
                $scope.SurgeryDiagnosisObj.SurgeryList[0].AdditionalSurgery = $scope.SurgeryDiagnosisObj.SurgeryList[0].AdditionalSurgery || [];
                if ($scope.SurgeryDiagnosisObj.SurgeryList[0].AdditionalSurgery.length > 0) {
                    angular.forEach($scope.SurgeryDiagnosisObj.SurgeryList[0].AdditionalSurgery, function (sitem) {

                        let OrganName = '';
                        sitem.OrganId = sitem.OrganId || null;
                        if (sitem.OrganId !== null) {
                            if (sitem.OrganId == 1) {
                                OrganName = "(OD)";
                            } else if (sitem.OrganId == 2) {
                                OrganName = "(OS)";
                            } else if (sitem.OrganId == 3) {
                                OrganName = "(OU)";
                            } else if (sitem.OrganId == 4) {
                                OrganName = "General";
                            }
                        }

                        Description += "," + sitem.Description + OrganName;
                    });
                    if (Description.charAt(0) === ",") {
                        Description = Description.slice(1);
                    }
                }
                if (Description != '') {
                    AdditionalSurgeryName = Description;
                }
            }

            var Organ = '';
            var OrganId = '';
            if ($scope.SurgeryDiagnosisObj.SurgeryList.length > 0) {
                OrganId = $scope.SurgeryDiagnosisObj.SurgeryList[0].OrganId || '';
                if (OrganId !== '' && OrganId !== null) {
                    if (OrganId == 1) {
                        Organ = "OD";
                    } else if (OrganId == 2) {
                        Organ = "OS";
                    } else if (OrganId == 3) {
                        Organ = "OU";
                    } else if (OrganId == 4) {
                        Organ = "General";
                    }
                }
            }



            $scope.CreatedByName = "";
            if (doctorinfo.doctordata.User.length > 0) {
                if (doctorinfo.doctordata.User[0].Suffix !== '') {
                    $scope.CreatedByName = doctorinfo.doctordata.User[0].FullName + ' ' + doctorinfo.doctordata.User[0].Suffix || "";
                } else {
                    $scope.CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
                }
            }


            /* Pre-op-Anesthesia Print - Start */

            let Preopindex = resp[0].data.PreOP.length;
            if (resp[0].data.PreOP.length > 0) {

                var preopresp = angular.copy(resp[0].data.PreOP[0]);

                preopresp.PreOpCallDetails = preopresp.PreOpCallDetails || [];

                $scope.AscPreopObj.IsVeinOpened = preopresp.IsVeinOpened;
                $scope.AscPreopObj.IsDiabetes = preopresp.IsDiabetes;
                $scope.AscPreopObj.IsSurgeonOrdersTimeChecked = preopresp.IsSurgeonOrdersTimeChecked || false;
                $scope.AscPreopObj.IsAnesthesiaOrdersTimeChecked = preopresp.IsAnesthesiaOrdersTimeChecked || false;
                $scope.AscPreopObj.IsHypoglycemiaCheck = preopresp.IsHypoglycemiaCheck || false;
                $scope.AscPreopObj.ODPupilSize = preopresp.ODPupilSize || "";
                $scope.AscPreopObj.OSPupilSize = preopresp.OSPupilSize || "";
                $scope.AscPreopObj.DiabetesTimings = preopresp.DiabetesTimings || [];

                var isVeinOpened = '';
                if ($scope.AscPreopObj.IsVeinOpened == true || $scope.AscPreopObj.IsVeinOpened == false) {
                    isVeinOpened = $scope.AscPreopObj.IsVeinOpened;
                }
                var isDiabetes = '';
                if ($scope.AscPreopObj.IsDiabetes == true || $scope.AscPreopObj.IsDiabetes == false) {
                    isDiabetes = $scope.AscPreopObj.IsDiabetes;
                }
                var isHypoglycemiaCheck = '';
                if ($scope.AscPreopObj.IsHypoglycemiaCheck == true || $scope.AscPreopObj.IsHypoglycemiaCheck == false) {
                    isHypoglycemiaCheck = $scope.AscPreopObj.IsHypoglycemiaCheck;
                }



                $scope.AscPreopObj.DilationMedications = preopresp.DilationMedications || [];
                if ($scope.AscPreopObj.DilationMedications.length > 0) {
                    angular.forEach($scope.AscPreopObj.DilationMedications, function (hitem) {
                        var dateTimeString = hitem.ModifiedDt;
                        $scope.ModifiedDilationDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                    });
                }


                $scope.AscPreopObj.OrderDetails = preopresp.OrderDetails || [];


                var PreOpDialationMedicationListArray = [];
                PreOpDialationMedicationListArray = $filter('filter')($scope.AscPreopObj.OrderDetails, { 'MedTypeId': 2 }, true) || [];
                $scope.SetSurgeonCredentials(PreOpDialationMedicationListArray);
                /* Standing / Live has to be exact for the print renderer - see NormalizeOrdersForPrint. */
                PreOpDialationMedicationListArray = $scope.NormalizeOrdersForPrint(PreOpDialationMedicationListArray);

                var PreOpMedicationListArray = [];
                PreOpMedicationListArray = $filter('filter')($scope.AscPreopObj.OrderDetails, { 'MedTypeId': 1 }, true) || [];

             

                preopresp.IVAccessDetailsList = preopresp.IVAccessDetailsList || [];
                $scope.AscPreopObj.IVAccessDetailsList = preopresp.IVAccessDetailsList || [];
                if ($scope.AscPreopObj.IVAccessDetailsList.length > 0) {
                    angular.forEach($scope.AscPreopObj.IVAccessDetailsList, function (item) {
                        item.IVSiteFluidsName = item.IVSiteFluidsName || '';
                        if (item.IVSiteFluids !== null) {
                            let FluidsArray = $filter('filter')($scope.PreOpObj.IVSiteFluidsArray, { 'IVSiteMarkingId': item.IVSiteFluids }, true) || [];
                            if (FluidsArray.length > 0) {
                                item.IVSiteFluidsName = FluidsArray[0].IVSiteMarkingName || '';
                            }
                        };
                        item.IVSiteFlushName = item.IVSiteFlushName || '';
                        if (item.IVSiteFlush !== null) {
                            let FlushArray = $filter('filter')($scope.PreOpObj.IVSiteFlushArray, { 'IVSiteMarkingId': item.IVSiteFlush }, true) || [];
                            if (FlushArray.length > 0) {
                                item.IVSiteFlushName = FlushArray[0].IVSiteMarkingName || '';
                            }
                        };
                        item.IVSiteLactatedRingersName = item.IVSiteLactatedRingersName || '';
                        if (item.IVSiteLactatedRingers !== null) {
                            let LactatedArray = $filter('filter')($scope.PreOpObj.IVSiteLRArray, { 'IVSiteMarkingId': item.IVSiteLactatedRingers }, true) || [];
                            if (LactatedArray.length > 0) {
                                item.IVSiteLactatedRingersName = LactatedArray[0].IVSiteMarkingName || '';
                            }
                        };
                        item.IVFluidsName = item.IVFluidsName || "";
                        if (item.IVFluidsId !== null) {
                            let Array = $filter('filter')($scope.PreOpObj.IVFluidsArray, { 'IVSiteMarkingId': item.IVFluidsId }, true) || [];
                            if (Array.length > 0) {
                                item.IVFluidsName = Array[0].IVSiteMarkingName || '';
                            }
                        };

                        if (item.PatencyStatus == 'Not Patent' || item.PatencyStatus == 'Blocked') {
                            item.IVSiteBlocked = true;
                        } else {
                            item.IVSiteBlocked = false;
                        }

                        if (item.IvAccessGivenBy !== null) {
                            let IvGivenBy = $filter('filter')($scope.allUserList, { 'DoctorID': item.IvAccessGivenBy }, true) || [];
                            if (IvGivenBy.length > 0) {
                                item.IvAccessGivenByName = IvGivenBy[0].FullName || '';
                            } else {
                                item.IvAccessGivenByName = '';
                            }
                        } else {
                            if ($scope.RoleId == 8) {
                                item.IvAccessGivenBy = $scope.UserId || null;
                            };
                            item.IvAccessGivenByName = '';
                        }
                        item.IVNeedleSizeName = item.IVNeedleSizeName || "";
                        item.IVSiteName = item.IVSiteName || "";
                        item.IVArm = item.IVArm || "";
                    });
                }

                

                var IVCondition = $filter("filter")($scope.PreOpObj.OrgASCChecklist, function (item) {
                    return item.CheckListId === 170;
                }) || [];

            }

            /* Pre-op-Anesthesia Print - End */

            /* Intra-op-Anesthesia Print - Start */

            let Intraopindex = resp[0].data.IntraOP.length;
            if (resp[0].data.IntraOP.length > 0) {


                $scope.AscIntraopOrders = angular.copy(resp[0].data.IntraOP[0]);
                $scope.AscIntraOp.OrderDetails = $scope.AscIntraopOrders.OrderDetails || [];
                $scope.AscIntraOp.IsIntraOpSurgeonOrdersTimeAdded = $scope.AscIntraopOrders.IsIntraOpSurgeonOrdersTimeAdded || false;
                $scope.AscIntraOp.IsIntraOpAnesthesiaOrdersTimeAdded = $scope.AscIntraopOrders.IsIntraOpAnesthesiaOrdersTimeAdded || false;
                /* postopresp.OrgAscChecklist = postopresp.OrgAscChecklist || [];*/
                var IntraOpOrderListArray = [];
                IntraOpOrderListArray = $filter('filter')($scope.AscIntraOp.OrderDetails, { 'MedTypeId': 4 }, true) || [];
                $scope.SetSurgeonCredentials(IntraOpOrderListArray);

                var IntraOpOrderAnesthesia = [];
                IntraOpOrderAnesthesia = $filter('filter')($scope.AscIntraOp.OrderDetails, { 'MedTypeId': 3 }, true) || [];
                //var AscIntraopanesthesiaTypeList = [];
                //AscIntraopanesthesiaTypeList = angular.copy($scope.AscIntraopOrders.AnesthesiaTypelist) || [];
                //if ($scope.AscIntraopOrders.AnesthesiaMedications.length > 0) {
                //    angular.forEach($scope.AscIntraopOrders.AnesthesiaMedications, function (hitem) {
                //        var dateTimeString = hitem.ModifiedDt;
                //        $scope.ModifiedAnesthesiaDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');

                //    });
                //}

                //if ($scope.AscIntraopOrders.IntraOpMedications.length > 0) {
                //    angular.forEach($scope.AscIntraopOrders.IntraOpMedications, function (hitem) {
                //        var dateTimeString = hitem.ModifiedDt;
                //        $scope.ModifiedIntraopDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                //    });
                //}



                /*  ----- *  ----- */
            }

            /* Intra-op-Anesthesia Print - End */

            /* Post-op - Start */


            let Postopindex = resp[0].data.PostOP.length;
            if (resp[0].data.PostOP.length > 0) {

                var postopresp = angular.copy(resp[0].data.PostOP[0]);
                $scope.AscPostOp.OrderDetails = postopresp.OrderDetails || [];
                $scope.AscPostOp.IsPostOpAnesthesiaOrdersTimeAdded = postopresp.IsPostOpAnesthesiaOrdersTimeAdded || false;
                $scope.AscPostOp.IsPostOpSurgeonOrdersTimeAdded = postopresp.IsPostOpSurgeonOrdersTimeAdded || false;

                postopresp.OrgAscChecklist = postopresp.OrgAscChecklist || [];
                var PostOpOrderListArray = [];
                PostOpOrderListArray = $filter('filter')($scope.AscPostOp.OrderDetails, { 'MedTypeId': 5 }, true) || [];
                $scope.SetSurgeonCredentials(PostOpOrderListArray);
                //var PostOpGeneralOrderArray = [];
                //PostOpGeneralOrderArray = $filter('filter')(postopresp.OrgAscChecklist, { 'CheckListModuleId': 3, 'CheckListSubTypeId': 19 }, true) || [];

                var PostOpOrderAnesthesia = [];
                PostOpOrderAnesthesia = $filter('filter')($scope.AscPostOp.OrderDetails, { 'MedTypeId': 8 }, true) || [];
                /* ----- * ----- */
            }
            /* Post-op - End */

            $timeout(function () {

                var Object = {
                    "CreatedBy": $scope.CreatedByName || '',              // Admit Object
                    'Surgeon': $scope.SurgeryDiagnosisObj.SurgeonName || '',
                    "Anesthetist": $scope.SurgeryDiagnosisObj.AnesthesistName || '',
                    "Diagnosis": DiagnosisName || '',
                    "Name": $scope.cacheStorageItem.PatientName || '',
                    "Age": $scope.cacheStorageItem.Age || '',
                    "Gender": $scope.cacheStorageItem.Gender || '',
                    "PatientDOB": $scope.cacheStorageItem.PatientDOB || '',
                    "OrganName": Organ || '',
                    "AppointmentTime": $scope.cacheStorageItem.AppointmentTime || '',
                    "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayId || '',
                    "VisitType": $scope.cacheStorageItem.AppointmentType || '',
                    "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                    "SurgeryDate": $scope.cacheStorageItem.AppointmentDate || '',
                    "SurgeryName": $scope.SurgeryDiagnosisObj.SurgeryName || '',
                    "AdditionalSurgeryName": AdditionalSurgeryName || '',
                    "EhnoteLogoURL": $scope.HeaderLogo || '',
                    //preop
                    "PreOpDialationMedicationDetails": PreOpDialationMedicationListArray || [],
                    "ODPupilSize": $scope.AscPreopObj.ODPupilSize || '',
                    "OSPupilSize": $scope.AscPreopObj.OSPupilSize || '',
                    "IsVeinOpened": isVeinOpened,
                    "IsDiabetes": isDiabetes,
                    "IsHypoglycemiaCheck": isHypoglycemiaCheck,
                    "DiabetesTimings": $scope.AscPreopObj.DiabetesTimings || [],
                    "PreOpMedicationDetails": PreOpMedicationListArray || [],
                    //intraop
                    "AscPreOpMedications": $scope.AscPreopObj.PreOpMedications || [],
                    // "IntraopAnesthesiaTypelist": AscIntraopanesthesiaTypeList || [],
                    "AnesthesiaMedications": $scope.AscIntraopOrders.AnesthesiaMedications || [],
                    "IntraOpMedications": $scope.AscIntraopOrders.IntraOpMedications || [],
                    //Post Op
                    "PostOpMedicationDetails": PostOpOrderListArray || [],
                    //"PostOpGeneralOrder": PostOpGeneralOrderArray || [],
                    "AscPreOPIndex": Preopindex || 0,
                    "AscIntraopIndex": Intraopindex || 0,
                    "AscPostopIndex": Postopindex || 0,
                    "PostOpOrderAnesthesia": PostOpOrderAnesthesia || [],
                    "IntraOpOrderAnesthesia": IntraOpOrderAnesthesia || [],
                    "IntraOpMedicationDetails": IntraOpOrderListArray || [],
                    "CurrentAppointmentVital": $scope.CurrentAppointmentVital || {},
                    "IsPostOpSurgeonOrdersTimeAdded": $scope.AscPostOp.IsPostOpSurgeonOrdersTimeAdded || false,
                    "IsPostOpAnesthesiaOrdersTimeAdded": $scope.AscPostOp.IsPostOpAnesthesiaOrdersTimeAdded || false,
                    "IsSurgeonOrdersTimeChecked": $scope.AscPreopObj.IsSurgeonOrdersTimeChecked || false,
                    "IsAnesthesiaOrdersTimeChecked": $scope.AscPreopObj.IsAnesthesiaOrdersTimeChecked || false,
                    "IsIntraOpSurgeonOrdersTimeAdded": $scope.AscIntraOp.IsIntraOpSurgeonOrdersTimeAdded || false,
                    "IsIntraOpAnesthesiaOrdersTimeAdded": $scope.AscIntraOp.IsIntraOpAnesthesiaOrdersTimeAdded || false,
                    "OrganizationDetails": $scope.OrganizationDetails || [],
                    "EhnoteOrganisationLogoUrl": $scope.OrganizationDetails?.[0]?.OrganizationLogoUrl || '',
                    "IVAccessDetailsList": $scope.AscPreopObj.IVAccessDetailsList || [],
                    "IVCondition": IVCondition || []

                }
                USPrintService.GeneratePIPASCPrints(Object);
            }, 500);
        }

        $scope.AddToCache = function () {
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        };
        $scope.Patientdetails = function () {
            let patientId = $scope.cacheStorageItem.PatientID || 0;
            eHnoteAuditServices.getPatientDetailsById(patientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
            function ongetPatientDetailsSuccess(data) {
                if (data !== undefined) {
                    var patientitem = data;                 
                    $scope.cacheStorageItem.PatientTagList = patientitem.Patient[0].PatientTagList;
                   
                }
            }
            function ongetPatientDetailsError(error) {
                console.log(error);
            }
        }
        $scope.Patientdetails();


        $scope.OnIVAccessChecklistSelect = function (sitem, MItem) {
            if (sitem.IsChecked == true) {
                sitem.PatientMultiCheckListId = sitem.PatientMultiCheckListId || 0;
                if (sitem.PatientMultiCheckListId !== 0) {
                    sitem.DeleteInd = 'Y';
                }
                MItem.IsChecked = false;
                sitem.IsChecked = false;
            } else {
                MItem.IsChecked = true;
                sitem.IsChecked = true;
            }
        };

        $scope.Changetypeitem = function (Id) {
            if (Id == 41 || Id == 45) {
                $scope.PreOpObj.IVFluidsId = 50;
                if (Id == 41) {
                    $scope.PreOpObj.IVSiteFlush = 34;
                } else {
                    $scope.PreOpObj.IVSiteFlush = null;
                }

            } else if (Id == 40) {
                $scope.PreOpObj.IVFluidsId = 51;
                $scope.PreOpObj.IVSiteFlush = null;
            } else {
                $scope.PreOpObj.IVSiteFlush = null;
            }

        };

        $scope.ChangeFluidsitem = function (Id) {
            if (Id == 50) {
                $scope.PreOpObj.IVSiteFlush = 34;
            } else {
                $scope.PreOpObj.IVSiteFlush = null;
            }
        };
        $scope.GetCustomOrdersTime = function (item) {
            item.MedicationTime = $filter('date')(new Date(), "hh:mm a");
        };
     $scope.ChangeGeneralMedicationStatus = function (item, Id, type) {
         if (Id == 1) {
             item.Status = 'Done';
             item.MedicationTime = $filter('date')(new Date(), "hh:mm a");
             if (type == 1) {

                 let loggedUser = $filter('filter')($scope.MedicationGivenByNurseArray, { 'DoctorID': $scope.UserId }, true) || [];
                 if (loggedUser.length > 0) {
                     item.GivenBy = item.GivenBy || null;
                     if (item.GivenBy == null) {
                         item.GivenBy = loggedUser[0].DoctorID;
                     }
                 }
             }
             else if (type == 2) {

                 let loggedUser = $filter('filter')($scope.MedicationOnlyMDGivenByArray, { 'DoctorID': $scope.UserId }, true) || [];
                 if (loggedUser.length > 0) {
                     item.GivenBy = item.GivenBy || null;
                     if (item.GivenBy == null) {
                         item.GivenBy = loggedUser[0].DoctorID;
                     }
                 }
             }

             else if (type == 3) {

                 let loggedUser = $filter('filter')($scope.MedicationGivenBy, { 'DoctorID': $scope.UserId }, true) || [];
                 if (loggedUser.length > 0) {
                     item.GivenBy = item.GivenBy || null;
                     if (item.GivenBy == null) {
                         item.GivenBy = loggedUser[0].DoctorID;
                     }
                 }
             }
             else if (type == 4) {

                 let loggedUser = $filter('filter')($scope.AnesthetistArray, { 'DoctorID': $scope.UserId }, true) || [];
                 if (loggedUser.length > 0) {
                     item.GivenBy = item.GivenBy || null;
                     if (item.GivenBy == null) {
                         item.GivenBy = loggedUser[0].DoctorID;
                     }
                 }
             }

             else if (type == 5) {
                 let loggedUser = $filter('filter')($scope.NurseAnesthetistArray, { 'DoctorID': $scope.UserId }, true) || [];
                 if (loggedUser.length > 0) {
                     item.GivenBy = item.GivenBy || null;
                     if (item.GivenBy == null) {
                         item.GivenBy = loggedUser[0].DoctorID;
                     }
                 }
             }

         } else {
             item.Status = 'NotDone';
             item.MedicationTime = '';
             item.GivenBy = null;
         }
         /* Task 13 - Done re-opens the row so the Given By passcode can be validated,
            Not Done clears the recorded Given By and its validated state. */
         $scope.ResetGeneralOrderValidation(item, Id == 1);
     };


        $scope.AllOrdersReviewed = function () {
            var spcount = 0, sicount = 0, sptcount = 0, apcount = 0, aicount = 0, aptcount = 0
            
            if ($scope.PreOpObj.OrderDetails.length > 0) {
                angular.forEach($scope.PreOpObj.OrderDetails, function (hitem) {
                    if (hitem.DilationMedications.length > 0 || hitem.GeneralOrders.length > 0) {
                        let TempList = $filter("filter")(hitem.DilationMedications, function (kitem) { return kitem.DeleteInd == 'N' }, true);
                        let GeneralList = $filter("filter")(hitem.GeneralOrders, function (gitem) { return gitem.DeleteInd == 'N' }, true);
                        if (TempList.length > 0 || GeneralList.length > 0) {
                            if (hitem.IsOrderReviewed == false && hitem.MedTypeId == 2 && hitem.UserOrderId !== 0 && hitem.DeleteInd == 'N') {
                                spcount++;
                            }
                        }
                    }
                });
            }
            if ($scope.PreOpObj.OrderDetails.length > 0) {
                angular.forEach($scope.PreOpObj.OrderDetails, function (hitem) {
                    if (hitem.PreOpMedications.length > 0 || hitem.GeneralOrders.length > 0) {
                        let TempList = $filter("filter")(hitem.PreOpMedications, function (kitem) { return kitem.DeleteInd == 'N' }, true);
                        let GeneralList = $filter("filter")(hitem.GeneralOrders, function (gitem) { return gitem.DeleteInd == 'N' }, true);
                        if (TempList.length > 0 || GeneralList.length > 0) {
                            if (hitem.IsOrderReviewed == false && hitem.MedTypeId == 1 && hitem.UserOrderId !== 0 && hitem.DeleteInd == 'N') {
                                apcount++;
                            }
                        }
                    }
                });
            }
            
            if ($scope.IntraOpObj.OrderDetails.length > 0) {
                angular.forEach($scope.IntraOpObj.OrderDetails, function (hitem) {
                    if (hitem.IntraOpMedications.length > 0 || hitem.GeneralOrders.length > 0) {
                        let TempList = $filter("filter")(hitem.IntraOpMedications, function (kitem) { return kitem.DeleteInd == 'N' }, true);
                        let GeneralList = $filter("filter")(hitem.GeneralOrders, function (gitem) { return gitem.DeleteInd == 'N' }, true);
                        if (TempList.length > 0 || GeneralList.length > 0) {
                            if (hitem.IsOrderReviewed == false && hitem.MedTypeId == 4 && hitem.UserOrderId !== 0 && hitem.DeleteInd == 'N') {
                                sicount++;
                            }
                        }
                    }
                });
            }
            if ($scope.IntraOpObj.OrderDetails.length > 0) {
                angular.forEach($scope.IntraOpObj.OrderDetails, function (hitem) {
                    if (hitem.IntraOpMedications.length > 0 || hitem.GeneralOrders.length > 0) {
                        let TempList = $filter("filter")(hitem.IntraOpMedications, function (kitem) { return kitem.DeleteInd == 'N' }, true);
                        let GeneralList = $filter("filter")(hitem.GeneralOrders, function (gitem) { return gitem.DeleteInd == 'N' }, true);
                        if (TempList.length > 0 || GeneralList.length > 0) {
                            if (hitem.IsOrderReviewed == false && hitem.MedTypeId == 3 && hitem.UserOrderId !== 0 && hitem.DeleteInd == 'N') {
                                aicount++;
                            }
                        }
                    }
                });
            }
            if ($scope.PostOpObj.OrderDetails.length > 0) {
                angular.forEach($scope.PostOpObj.OrderDetails, function (hitem) {
                    if (hitem.PostOpMedications.length > 0 || hitem.GeneralOrders.length > 0) {
                        let TempList = $filter("filter")(hitem.PostOpMedications, function (kitem) { return kitem.DeleteInd == 'N' }, true);
                        let GeneralList = $filter("filter")(hitem.GeneralOrders, function (gitem) { return gitem.DeleteInd == 'N' }, true);
                        if (TempList.length > 0 || GeneralList.length > 0) {
                            if (hitem.IsOrderReviewed == false && hitem.MedTypeId == 5 && hitem.UserOrderId !== 0 && hitem.DeleteInd == 'N') {
                                sptcount++;
                            }
                        }
                    }
                });
            }
            if ($scope.PostOpObj.OrderDetails.length > 0) {
                angular.forEach($scope.PostOpObj.OrderDetails, function (hitem) {
                    if (hitem.PostOpMedications.length > 0 || hitem.GeneralOrders.length > 0) {
                        let TempList = $filter("filter")(hitem.PostOpMedications, function (kitem) { return kitem.DeleteInd == 'N' }, true);
                        let GeneralList = $filter("filter")(hitem.GeneralOrders, function (gitem) { return gitem.DeleteInd == 'N' }, true);
                        if (TempList.length > 0 || GeneralList.length > 0) {
                            if (hitem.IsOrderReviewed == false && hitem.MedTypeId == 8 && hitem.UserOrderId !== 0 && hitem.DeleteInd == 'N') {
                                aptcount++;
                            }
                        }
                    }
                });
            }

            if (spcount > 0) {
                $scope.Allorderreviewed.IsSurgeonPreopreviewed = true;
                $scope.Allorderreviewed.IsSurgeonPreopChecked = true;
            } else {
                $scope.Allorderreviewed.IsSurgeonPreopreviewed = false;
            }

            if (sicount > 0) {
                $scope.Allorderreviewed.IsSurgeonIntraopreviewed = true;
                $scope.Allorderreviewed.IsSurgeonIntraopChecked = true;
            } else {
                $scope.Allorderreviewed.IsSurgeonIntraopreviewed = false;
            }

            if (sptcount > 0) {
                $scope.Allorderreviewed.IsSurgeonPostopreviewed = true;
                $scope.Allorderreviewed.IsSurgeonPostopChecked = true;
            } else {
                $scope.Allorderreviewed.IsSurgeonPostopreviewed = false;
            }

            if (apcount > 0) {
                $scope.Allorderreviewed.IsAnesthesiaPreopreviewed = true;
                $scope.Allorderreviewed.IsAnesthesiaPreopChecked = true;
            } else {
                $scope.Allorderreviewed.IsAnesthesiaPreopreviewed = false;
            }

            if (aicount > 0) {
                $scope.Allorderreviewed.IsAnesthesiaIntraopreviewed = true;
                $scope.Allorderreviewed.IsAnesthesiaIntraopChecked = true;
            } else {
                $scope.Allorderreviewed.IsAnesthesiaIntraopreviewed = false;
            }

            if (aptcount > 0) {
                $scope.Allorderreviewed.IsAnesthesiaPostopreviewed = true;
                $scope.Allorderreviewed.IsAnesthesiaPostopChecked = true;
            } else {
                $scope.Allorderreviewed.IsAnesthesiaPostopreviewed = false;
            }

        }


        $scope.GetValidateSurgeonPasswordOverAllReviewed = function (item) {
            $scope.Allorderreviewed.OverallSurgeonReviewedBy = $scope.Allorderreviewed.OverallSurgeonReviewedBy || null;
            if ($scope.Allorderreviewed.OverallSurgeonReviewedBy == null) {
                alertify.error("Please Select ReviewedBy");
                return false;
            }
            $scope.Allorderreviewed.OverallSurgeonReviewedByPassword = $scope.Allorderreviewed.OverallSurgeonReviewedByPassword || '';
            if ($scope.Allorderreviewed.OverallSurgeonReviewedByPassword == '') {
                alertify.error("Please Enter Password");
                return false;
            }
            if (!$scope.Allorderreviewed.IsSurgeonPreopChecked && !$scope.Allorderreviewed.IsSurgeonIntraopChecked && !$scope.Allorderreviewed.IsSurgeonPostopChecked) {
                alertify.error("Please Select Section");
                return false;
            }
            let reqObj = {
                "Password": $scope.Allorderreviewed.OverallSurgeonReviewedByPassword,
                "UserId": $scope.UserId,
                "ReviewedBy": $scope.Allorderreviewed.OverallSurgeonReviewedBy,
                "OrganizationId": $scope.HospitalId
            };
            eHnoteSurgeryService.GetUserValidatePassword(reqObj).then(function (resp) {
                if (resp.data.status === "Success") {
                    alertify.success("Successfully Validated!");
                    $scope.Allorderreviewed.IsOrderReviewed = true;
                    $scope.Allorderreviewed.ReviewedByDateTime = $filter("date")(new Date(), "MM-dd-yyyy hh:mm a");

                    $scope.LogObj.LogArray = [];
                    $scope.SurgeonOrders = [];
                    if ($scope.Allorderreviewed.IsSurgeonPreopChecked) {
                        if ($scope.PreOpObj.OrderDetails.length > 0) {
                            angular.forEach($scope.PreOpObj.OrderDetails, function (hitem) {
                                if (hitem.IsOrderReviewed == false && hitem.MedTypeId == 2 && hitem.UserOrderId !== 0 && hitem.DeleteInd == 'N') {
                                    $scope.SurgeonOrders.push(hitem);
                                }
                            });
                        }
                    }
                    if ($scope.Allorderreviewed.IsSurgeonIntraopChecked) {
                        if ($scope.IntraOpObj.OrderDetails.length > 0) {
                            angular.forEach($scope.IntraOpObj.OrderDetails, function (hitem) {
                                if (hitem.IsOrderReviewed == false && hitem.MedTypeId == 4 && hitem.UserOrderId !== 0 && hitem.DeleteInd == 'N') {
                                    $scope.SurgeonOrders.push(hitem);
                                }
                            });
                        }
                    }
                    if ($scope.Allorderreviewed.IsSurgeonPostopChecked) {
                        if ($scope.PostOpObj.OrderDetails.length > 0) {
                            angular.forEach($scope.PostOpObj.OrderDetails, function (hitem) {
                                if (hitem.IsOrderReviewed == false && hitem.MedTypeId == 5 && hitem.UserOrderId !== 0 && hitem.DeleteInd == 'N') {
                                    $scope.SurgeonOrders.push(hitem);
                                }
                            });
                        }
                    }
                    if ($scope.SurgeonOrders.length > 0) {
                        $scope.FinalSurgeonOrders = [];
let Admissiondatetime= $scope.cacheStorageItem.Admissiondatetime||null;
let ReviewedByDateTime= $scope.Allorderreviewed.ReviewedByDateTime || null;
if(Admissiondatetime){
ReviewedByDateTime=$filter('date')(Admissiondatetime, "MM-dd-yyyy hh:mm a")||null;
}
                        angular.forEach($scope.SurgeonOrders, function (sitem) {
                            var obj = {
                                "ReviewedBy": $scope.Allorderreviewed.OverallSurgeonReviewedBy || null,
                                "ReviewedByDateTime":ReviewedByDateTime ||$scope.Allorderreviewed.ReviewedByDateTime|| null,
                                /* "UserType": sitem.UserType || "Nurse",*/
                                "ScreenTypeName": sitem.ScreenTypeName,
                                "ScreenTypeId": sitem.ScreenTypeId,
                                "MedTypeName": sitem.MedTypeName,
                                "MedTypeId": sitem.MedTypeId,
                                "UserOrderId": sitem.UserOrderId,
                                "IsOrderReviewed": $scope.Allorderreviewed.IsOrderReviewed,
                            }
                            $scope.FinalSurgeonOrders.push(obj);
                        });
                    } 
                    

                   let submitObj = {
                        "VisitId": $scope.cacheStorageItem.PatientVisitId,
                        //  "PatientASCPostOPId": $scope.PostOpObj.PatientASCPostOPId || null,
                        "UserId": $scope.UserId || null,
                        "HospitalId": $scope.HospitalId || null,
                        "PatientId": $scope.cacheStorageItem.PatientID || null,
                        "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                       "FinalSurgeonOrders": $scope.FinalSurgeonOrders || [],
                       "Logs": $scope.LogObj || {},

                    }
                    let FinalPreOpMedications = $filter('filter')($scope.FinalSurgeonOrders, { 'MedTypeId': 2 }, true) || [];
                    let FinalIntraOpMedications = $filter('filter')($scope.FinalSurgeonOrders, { 'MedTypeId': 4 }, true) || [];
                    let FinalPostOpMedications = $filter('filter')($scope.FinalSurgeonOrders, { 'MedTypeId': 5 }, true) || [];
                    if (FinalPreOpMedications.length > 0) {
                        angular.forEach(FinalPreOpMedications, function (currentItem) {
                            currentItem.IsOrderReviewed = currentItem.IsOrderReviewed || false;
                            let TempReviewedByArray = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == currentItem.ReviewedBy });
                            
                            if (TempReviewedByArray.length > 0) {
                                currentItem.ReviewedByName = angular.copy(TempReviewedByArray[0].FullName);
                            }
                           
                            if (currentItem.IsOrderReviewed) {
                                let obj = {
                                    LogId: 0,
                                    ModuleId: 2,
                                    ModuleName: "ASC",
                                    SubModuleId: 40,
                                    SubModuleName: "All Orders",
                                    ScreenType: "Pre-Op Orders",
                                    ActionType: "Added",
                                    OldActionDescription: '',
                                    NewActionDescription: `Pre-Op Orders Signed By ${currentItem.ReviewedByName}`,
                                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                };
                                $scope.LogObj.LogArray.push(obj);
                            }
                        })
                    }

                    if (FinalIntraOpMedications.length > 0) {
                        angular.forEach(FinalIntraOpMedications, function (currentItem) {
                            currentItem.IsOrderReviewed = currentItem.IsOrderReviewed || false;

                            let TempReviewedByArray = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == currentItem.ReviewedBy });

                            if (TempReviewedByArray.length > 0) {
                                currentItem.ReviewedByName = angular.copy(TempReviewedByArray[0].FullName);
                            }
                            if (currentItem.IsOrderReviewed) {
                                let obj = {
                                    LogId: 0,
                                    ModuleId: 2,
                                    ModuleName: "ASC",
                                    SubModuleId: 40,
                                    SubModuleName: "All Orders",
                                    ScreenType: "Intra-Op Orders",
                                    ActionType: "Added",
                                    OldActionDescription: '',
                                    NewActionDescription: `Intra-Op Orders Signed By ${currentItem.ReviewedByName}`,
                                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                };
                                $scope.LogObj.LogArray.push(obj);
                            }
                        })
                    }

                    if (FinalPostOpMedications.length > 0) {
                        angular.forEach(FinalPostOpMedications, function (currentItem) {
                            currentItem.IsOrderReviewed = currentItem.IsOrderReviewed || false;

                            let TempReviewedByArray = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == currentItem.ReviewedBy });

                            if (TempReviewedByArray.length > 0) {
                                currentItem.ReviewedByName = angular.copy(TempReviewedByArray[0].FullName);
                            }

                            if (currentItem.IsOrderReviewed) {
                                let obj = {
                                    LogId: 0,
                                    ModuleId: 2,
                                    ModuleName: "ASC",
                                    SubModuleId: 40,
                                    SubModuleName: "All Orders",
                                    ScreenType: "Post-Op Orders",
                                    ActionType: "Added",
                                    OldActionDescription: '',
                                    NewActionDescription: `Post-Op Orders Signed By ${currentItem.ReviewedByName}`,
                                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                };
                                $scope.LogObj.LogArray.push(obj);
                            }
                        })
                    }

                    if ($scope.LogObj.LogArray.length > 0) {
                        submitObj.Logs = angular.copy($scope.LogObj) || {};
                    }

                    eHnoteSurgeryService.AddUpdateAllOrderReviewedby(submitObj).then(function (resp) {
                        if (resp.data.Status === "Success") {
                        alertify.success("Pre-op data successfully submitted!");

                        //  $scope.GetPreOpChartData();

                            $scope.init();
                            $scope.Allorderreviewed = angular.copy($scope.GetAllorderreviewedObj());
                    } else {
                        alertify.error("Some Error Occured");
                        }
                    }, function (err) {
                        alertify.error("Fetching data failed!");

                    });

                } else {
                    alertify.error("Invalid Password!");
                }
            }, function (err) {
                alertify.error("Fetching data failed!");

            });

        };


        $scope.GetValidateAnesthesiaPasswordOverAllReviewed = function (item) {
            $scope.Allorderreviewed.OverallAnesthesiaReviewedBy = $scope.Allorderreviewed.OverallAnesthesiaReviewedBy || null;
            if ($scope.Allorderreviewed.OverallAnesthesiaReviewedBy == null) {
                alertify.error("Please Select ReviewedBy");
                return false;
            }
            $scope.Allorderreviewed.OverallAnesthesiaReviewedByPassword = $scope.Allorderreviewed.OverallAnesthesiaReviewedByPassword || '';
            if ($scope.Allorderreviewed.OverallAnesthesiaReviewedByPassword == '') {
                alertify.error("Please Enter Password");
                return false;
            }
            if (!$scope.Allorderreviewed.IsAnesthesiaPreopChecked && !$scope.Allorderreviewed.IsAnesthesiaIntraopChecked && !$scope.Allorderreviewed.IsAnesthesiaPostopChecked) {
                alertify.error("Please Select Section");
                return false;
            }

            let reqObj = {
                "Password": $scope.Allorderreviewed.OverallAnesthesiaReviewedByPassword,
                "UserId": $scope.UserId,
                "ReviewedBy": $scope.Allorderreviewed.OverallAnesthesiaReviewedBy,
                "OrganizationId": $scope.HospitalId
            };
            eHnoteSurgeryService.GetUserValidatePassword(reqObj).then(function (resp) {
                if (resp.data.status === "Success") {
                    alertify.success("Successfully Validated!");
                    $scope.Allorderreviewed.IsOrderReviewed = true;
                    $scope.Allorderreviewed.ReviewedByDateTime = $filter("date")(new Date(), "MM-dd-yyyy hh:mm a");


                    $scope.AnesthesiaOrders = [];
                    $scope.LogObj.LogArray = [];
                    if ($scope.Allorderreviewed.IsAnesthesiaPreopChecked) {
                        if ($scope.PreOpObj.OrderDetails.length > 0) {
                            angular.forEach($scope.PreOpObj.OrderDetails, function (hitem) {
                                if (hitem.IsOrderReviewed == false && hitem.MedTypeId == 1 && hitem.UserOrderId !== 0 && hitem.DeleteInd == 'N') {
                                    $scope.AnesthesiaOrders.push(hitem);
                                }
                            });
                        }
                    }
                    if ($scope.Allorderreviewed.IsAnesthesiaIntraopChecked) {
                        if ($scope.IntraOpObj.OrderDetails.length > 0) {
                            angular.forEach($scope.IntraOpObj.OrderDetails, function (hitem) {
                                if (hitem.IsOrderReviewed == false && hitem.MedTypeId == 3 && hitem.UserOrderId !== 0 && hitem.DeleteInd == 'N') {
                                    $scope.AnesthesiaOrders.push(hitem);
                                }
                            });
                        }
                    }
                    if ($scope.Allorderreviewed.IsAnesthesiaPostopChecked) {
                        if ($scope.PostOpObj.OrderDetails.length > 0) {
                            angular.forEach($scope.PostOpObj.OrderDetails, function (hitem) {
                                if (hitem.IsOrderReviewed == false && hitem.MedTypeId == 8 && hitem.UserOrderId !== 0 && hitem.DeleteInd == 'N') {
                                    $scope.AnesthesiaOrders.push(hitem);
                                }
                            });
                        }
                    }
                    if ($scope.AnesthesiaOrders.length > 0) {
                        $scope.FinalAnesthesiaOrders = [];
                        angular.forEach($scope.AnesthesiaOrders, function (sitem) {
                            var obj = {
                                "ReviewedBy": $scope.Allorderreviewed.OverallAnesthesiaReviewedBy || null,
                                "ReviewedByDateTime": $scope.Allorderreviewed.ReviewedByDateTime || null,
                                /* "UserType": sitem.UserType || "Nurse",*/
                                "ScreenTypeName": sitem.ScreenTypeName,
                                "ScreenTypeId": sitem.ScreenTypeId,
                                "MedTypeName": sitem.MedTypeName,
                                "MedTypeId": sitem.MedTypeId,
                                "UserOrderId": sitem.UserOrderId,
                                "IsOrderReviewed": $scope.Allorderreviewed.IsOrderReviewed,
                            }
                            $scope.FinalAnesthesiaOrders.push(obj);
                        });
                    } 

                    let submitObj = {
                        "VisitId": $scope.cacheStorageItem.PatientVisitId,
                        //  "PatientASCPostOPId": $scope.PostOpObj.PatientASCPostOPId || null,
                        "UserId": $scope.UserId || null,
                        "HospitalId": $scope.HospitalId || null,
                        "PatientId": $scope.cacheStorageItem.PatientID || null,
                        "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                        "FinalSurgeonOrders": $scope.FinalAnesthesiaOrders || [],
                        "Logs": $scope.LogObj || {},
                    }


                    let FinalPreOpMedications = $filter('filter')($scope.FinalAnesthesiaOrders, { 'MedTypeId': 1 }, true) || [];
                    let FinalIntraOpMedications = $filter('filter')($scope.FinalAnesthesiaOrders, { 'MedTypeId': 3 }, true) || [];
                    let FinalPostOpMedications = $filter('filter')($scope.FinalAnesthesiaOrders, { 'MedTypeId': 8 }, true) || [];
                    if (FinalPreOpMedications.length > 0) {
                        angular.forEach(FinalPreOpMedications, function (currentItem) {
                            currentItem.IsOrderReviewed = currentItem.IsOrderReviewed || false;
                            let TempReviewedByArray = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == currentItem.ReviewedBy });

                            if (TempReviewedByArray.length > 0) {
                                currentItem.ReviewedByName = angular.copy(TempReviewedByArray[0].FullName);
                            }

                            if (currentItem.IsOrderReviewed) {
                                let obj = {
                                    LogId: 0,
                                    ModuleId: 2,
                                    ModuleName: "ASC",
                                    SubModuleId: 40,
                                    SubModuleName: "All Orders",
                                    ScreenType: "Pre-Op Orders",
                                    ActionType: "Added",
                                    OldActionDescription: '',
                                    NewActionDescription: `Pre-Op Anesthesia Orders Signed By ${currentItem.ReviewedByName}`,
                                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                };
                                $scope.LogObj.LogArray.push(obj);
                            }
                        })
                    }

                    if (FinalIntraOpMedications.length > 0) {
                        angular.forEach(FinalIntraOpMedications, function (currentItem) {
                            currentItem.IsOrderReviewed = currentItem.IsOrderReviewed || false;

                            let TempReviewedByArray = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == currentItem.ReviewedBy });

                            if (TempReviewedByArray.length > 0) {
                                currentItem.ReviewedByName = angular.copy(TempReviewedByArray[0].FullName);
                            }
                            if (currentItem.IsOrderReviewed) {
                                let obj = {
                                    LogId: 0,
                                    ModuleId: 2,
                                    ModuleName: "ASC",
                                    SubModuleId: 40,
                                    SubModuleName: "All Orders",
                                    ScreenType: "Intra-Op Orders",
                                    ActionType: "Added",
                                    OldActionDescription: '',
                                    NewActionDescription: `Intra-Op Anesthesia Orders Signed By ${currentItem.ReviewedByName}`,
                                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                };
                                $scope.LogObj.LogArray.push(obj);
                            }
                        })
                    }

                    if (FinalPostOpMedications.length > 0) {
                        angular.forEach(FinalPostOpMedications, function (currentItem) {
                            currentItem.IsOrderReviewed = currentItem.IsOrderReviewed || false;

                            let TempReviewedByArray = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == currentItem.ReviewedBy });

                            if (TempReviewedByArray.length > 0) {
                                currentItem.ReviewedByName = angular.copy(TempReviewedByArray[0].FullName);
                            }

                            if (currentItem.IsOrderReviewed) {
                                let obj = {
                                    LogId: 0,
                                    ModuleId: 2,
                                    ModuleName: "ASC",
                                    SubModuleId: 40,
                                    SubModuleName: "All Orders",
                                    ScreenType: "Post-Op Orders",
                                    ActionType: "Added",
                                    OldActionDescription: '',
                                    NewActionDescription: `Post-Op Anesthesia Orders Signed By ${currentItem.ReviewedByName}`,
                                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                };
                                $scope.LogObj.LogArray.push(obj);
                            }
                        })
                    }

                    if ($scope.LogObj.LogArray.length > 0) {
                        submitObj.Logs = angular.copy($scope.LogObj) || {};
                    }


                    eHnoteSurgeryService.AddUpdateAllOrderReviewedby(submitObj).then(function (resp) {
                        if (resp.data.Status === "Success") {
                        alertify.success("Pre-op data successfully submitted!");

                        //  $scope.GetPreOpChartData();

                        $scope.init();
                    } else {
                        alertify.error("Some Error Occured");
                    }
                    }, function (err) {
                        alertify.error("Fetching data failed!");

                    });



                } else {
                    alertify.error("Invalid Password!");
                }
            }, function (err) {
                alertify.error("Fetching data failed!");

            });




        };



        $scope.OnclickCheckbox = function (item,main,type) {
            if (main == 'Surgeon') {
                if (type == 'Preop') {
                    if (item == true) {
                        $scope.Allorderreviewed.IsSurgeonPreopChecked = false;
                    } else {
                        $scope.Allorderreviewed.IsSurgeonPreopChecked = true;
                    }
                }
                if (type == 'Intraop') {
                    if (item == true) {
                        $scope.Allorderreviewed.IsSurgeonIntraopChecked = false;
                    } else {
                        $scope.Allorderreviewed.IsSurgeonIntraopChecked = true;
                    }
                }
                if (type == 'Postop') {
                    if (item == true) {
                        $scope.Allorderreviewed.IsSurgeonPostopChecked = false;
                    } else {
                        $scope.Allorderreviewed.IsSurgeonPostopChecked = true;
                    }
                }
            }
            if (main == 'Anesthesia') {
                if (type == 'Preop') {
                    if (item == true) {
                        $scope.Allorderreviewed.IsAnesthesiaPreopChecked = false;
                    } else {
                        $scope.Allorderreviewed.IsAnesthesiaPreopChecked = true;
                    }
                }
                if (type == 'Intraop') {
                    if (item == true) {
                        $scope.Allorderreviewed.IsAnesthesiaIntraopChecked = false;
                    } else {
                        $scope.Allorderreviewed.IsAnesthesiaIntraopChecked = true;
                    }
                }
                if (type == 'Postop') {
                    if (item == true) {
                        $scope.Allorderreviewed.IsAnesthesiaPostopChecked = false;
                    } else {
                        $scope.Allorderreviewed.IsAnesthesiaPostopChecked = true;
                    }
                }
            }
        }


        $scope.cacheStorageItem.FullName = $scope.cacheStorageItem.PatientName || '';
        $scope.cacheStorageItem.PatientDisplayId = $scope.cacheStorageItem.PatientDisplayId || '';

     $scope.patiendetilsopen = function () {
         let patientId = $scope.cacheStorageItem.PatientID || 0;
         eHnoteAuditServices.getPatientDetailsById(patientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
         function ongetPatientDetailsSuccess(data) {
             if (data !== undefined) {
                 var selectedPatientData = data;

                 $scope.PaitentDetails = {
                     "FullName": selectedPatientData.Patient[0].FullName || "",
                     "PatientDisplayId": selectedPatientData.Patient[0].PatientDisplayId || "",
                     "MobileNo": selectedPatientData.Patient[0].MobileNo || 0,
                     "DOB": selectedPatientData.Patient[0].DOB || "",
                     "AgeInYears": selectedPatientData.Patient[0].AgeInYears || 0,
                     "AgeInMonths": selectedPatientData.Patient[0].AgeInMonths || 0,
                     "S3URL": selectedPatientData.Patient[0].S3URL || "",
                     "SocialSecurityNo": selectedPatientData.Patient[0].SocialSecurityNo || "",
                     "BloodGroupName": selectedPatientData.Patient[0].PatientOtherDetails[0].BloodGroupName || "",
                     "MaritalStatusName": selectedPatientData.Patient[0].PatientOtherDetails[0].MaritalStatus || "",
                     "ExternalComanagerName": selectedPatientData.Patient[0].ExternalComanagerName || '',
                     "InternalComanagerName": selectedPatientData.Patient[0].InternalComanagerName || '',
                     "PCPDoctorName": selectedPatientData.Patient[0].PCPDoctorName || '',
                     "RefferalName": selectedPatientData.Patient[0].ReferralName || '',
                     "ContactInfo": {
                         "EmailID": selectedPatientData.Patient[0].EmailId || "",
                     }
                 }

                 $scope.PostalAddressSummaryObj = {
                     "AddressId": selectedPatientData.PatientAddress.PostalAddress.AddressId || 0,
                     "AddressLine1": selectedPatientData.PatientAddress.PostalAddress.AddressLine1 || "",
                     "AddressLine2": selectedPatientData.PatientAddress.PostalAddress.AddressLine2 || "",
                     "ZipCode": selectedPatientData.PatientAddress.PostalAddress.ZipCode || "",
                     "CountyId": selectedPatientData.PatientAddress.PostalAddress.CountyId || 0,
                     "CountyName": selectedPatientData.PatientAddress.PostalAddress.CountyName || "",
                     "CityName": selectedPatientData.PatientAddress.PostalAddress.CityName || "",
                     "CityId": selectedPatientData.PatientAddress.PostalAddress.CityId || 0,
                     "StateName": selectedPatientData.PatientAddress.PostalAddress.StateName || "",
                     "StateId": selectedPatientData.PatientAddress.PostalAddress.StateId || 0,
                     "CountryName": selectedPatientData.PatientAddress.PostalAddress.CountryName || "",
                     "CountryId": selectedPatientData.PatientAddress.PostalAddress.CountryId || 0,
                 }

                 $scope.PermanentAddressSummaryObj = {
                     "AddressId": selectedPatientData.PatientAddress.PermanentAddress.AddressId || 0,
                     "AddressLine1": selectedPatientData.PatientAddress.PermanentAddress.AddressLine1 || "",
                     "AddressLine2": selectedPatientData.PatientAddress.PermanentAddress.AddressLine2 || "",
                     "ZipCode": selectedPatientData.PatientAddress.PermanentAddress.ZipCode || "",
                     "CountyId": selectedPatientData.PatientAddress.PermanentAddress.CountyId || 0,
                     "CountyName": selectedPatientData.PatientAddress.PermanentAddress.CountyName || "",
                     "CityName": selectedPatientData.PatientAddress.PermanentAddress.CityName || "",
                     "CityId": selectedPatientData.PatientAddress.PermanentAddress.CityId || 0,
                     "StateName": selectedPatientData.PatientAddress.PermanentAddress.StateName || "",
                     "StateId": selectedPatientData.PatientAddress.PermanentAddress.StateId || 0,
                     "CountryName": selectedPatientData.PatientAddress.PermanentAddress.CountryName || "",
                     "CountryId": selectedPatientData.PatientAddress.PermanentAddress.CountryId || 0,
                 }

                 $scope.PatientOfficeNumber = selectedPatientData.Patient[0].OfficeAreaCode + selectedPatientData.Patient[0].PatientOfficeNumber;
                 var obj1 = eHnoteUserDataService.UsMobileFormatChange($scope.PatientOfficeNumber);
                 $scope.PatientOfficeNumber = obj1.UsFormatMobileNumber;

                 $scope.PatientMobileNumber = selectedPatientData.Patient[0].MobileNo;
                 var obj2 = eHnoteUserDataService.UsMobileFormatChange($scope.PatientMobileNumber);
                 $scope.PatientMobileNumber = obj2.UsFormatMobileNumber;

                 $scope.DemographicSummaryObj = {
                     "LanguageName": selectedPatientData.Patient[0].AdditionalInfo.LanguageName || "",
                     "Proficiency": selectedPatientData.Patient[0].AdditionalInfo.Proficiency || "",
                     "SexualOrientation": selectedPatientData.Patient[0].AdditionalInfo.SexualOrientation || "",
                     "GenderIdentityStatus": selectedPatientData.Patient[0].AdditionalInfo.GenderIdentity || "",
                 }

             }
         }
         function ongetPatientDetailsError(error) {
             console.log(error);
         }
     };
     $scope.PreOpAndDialationMedications.SubTabType = ($scope.RoleId == 25 || $scope.RoleId == 30) ? 2 : 1;
     $scope.IntraOpMedicationObj.SubTab = ($scope.RoleId == 25 || $scope.RoleId == 30) ? 2 : 1;
     $scope.PostOpObj.SubTabType = ($scope.RoleId == 25 || $scope.RoleId == 30) ? 2 : 1;
     


 // New Changes 


     $scope.maxDoseList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

     $scope.SelectDialtionMedicationItems1 = function (item, type) {
        
         let i = 0;
         angular.forEach($scope.PreOpObj.OrderDetails, function (mitem) {
             angular.forEach(mitem.DilationMedications, function (Aitem) {
                 if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
                     i++;
                 }
             });
         });

         if (i > 0) {
             alertify.error('You have already entered this Medication');
             $scope.DilationMedicationObj.MedicineObject = {};
             $scope.DilationMedicationObj.MedicationName = '';
             return false;
         }
         
         $scope.DilationMedicationObj.MedicineObject = item;    
         $scope.DilationMedicationObj.MedicationName = item.MedicineName;

         if ($scope.DilationMedicationObj.AscMedicationId != 0) {
             item.AscMedicationId = $scope.DilationMedicationObj.AscMedicationId;
         }


         $scope.updateOrderDescription(2);
     };



     $scope.AddDilationMedication = function () {
         $scope.IspropMedicationSurgeon = true;
         let item = $scope.DilationMedicationObj.MedicineObject;

        
         if (!item || !item.OrganizationPrescriptionId) {
             alertify.error('Please select a Medicine');
             return false;
         }


         if ($scope.DilationMedicationObj.OrderTypeName == "" && $scope.DilationMedicationObj.OrderTypeId == null) {
             OrderTypeId = OrderTypeId;
             OrderTypeName = OrderTypeName;
         } else {
             OrderTypeId = $scope.DilationMedicationObj.OrderTypeId;
             OrderTypeName = $scope.DilationMedicationObj.OrderTypeName;
         }
        
         let obj = {
             "AscMedicationId": item.AscMedicationId ||  0,
             "OrganizationMedicationId": item.OrganizationPrescriptionId,
             "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
             "ParentOrganizationId": $scope.ParenthospitalId,
             "ASCOrganizationMedicationId": 0,
             "Strength": item.Strength || '',
             "IsFrequent": item.IsFrequent || 'N',
             "MedicineId": item.MedicineId,
             "MedicationName": $scope.DilationMedicationObj.MedicationName,

             "Action": $scope.DilationMedicationObj.Action,
             "Dose": $scope.DilationMedicationObj.Dose,
             "DoseUnit": $scope.DilationMedicationObj.DoseUnit,
             "Route": $scope.DilationMedicationObj.Route,
             "Frequency": $scope.DilationMedicationObj.Frequency,
             "ActionId": $scope.DilationMedicationObj.ActionId,
             "DoseId": $scope.DilationMedicationObj.DoseId,
             "DoseUnitId": $scope.DilationMedicationObj.DoseUnitId,
             "RouteId": $scope.DilationMedicationObj.RouteId,
             "FrequencyId": $scope.DilationMedicationObj.FrequencyId,
             "OrderDescription": $scope.DilationMedicationObj.OrderDescription,
             "MedicationNotes": $scope.DilationMedicationObj.MedicationNotes,
             "maxDose": $scope.DilationMedicationObj.maxDose,
             "IsChecked": false,
             "IsDilationMed": false,
             "IsIntraAnesthesiaMed": false,
             "IsIntraMed": false,
             "IsPreOPMed": false,
             "MedicationDosage": "",
             "DropTimings": $scope.DilationMedicationObj.DropTimings || [],
             "TypeId": 2,
             "DeleteInd": "N",
             "OrderTypeId": OrderTypeId,
             "OrderTypeName": OrderTypeName,
         };

        
         let templist = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
             return oitem.MedTypeId === 2 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
         }) || [];

  
         if ($scope.DilationMedicationObj.EditIndex >= 0) {
            
             if (templist.length > 0 && templist[0].DilationMedications.length > $scope.DilationMedicationObj.EditIndex) {
                 templist[0].DilationMedications[$scope.DilationMedicationObj.EditIndex] = obj;
                 alertify.success('Updated successfully');
             }
         } else {
           
             if (templist.length > 0) {
                 templist[0].DilationMedications.push(obj);
             } else {
               
                 let newObj = {
                     "UserOrderId": 0,
                     "UserId": $scope.UserId,
                     "DeleteInd": "N",
                     "ReviewedBy": null,
                     "IsOrderReviewed": false,
                     "ReviewedByDateTime": null,
                     "ReviewedByPassword": '',
                     "UserType": "Nurse",
                     "ScreenType": "PreOp",
                     "ScreenTypeId": 4,
                     "MedTypeId": 2,
                     "MedTypeName": 'Dilation Medication',
                     "DilationMedications": [obj],
                     "PreOpMedications": [],
                     "GeneralOrders": [],
                     "OrderTypeId": OrderTypeId || 0,
                     "OrderTypeName": OrderTypeName || '',
                 };
                 $scope.PreOpObj.OrderDetails.push(newObj);
             }
             alertify.success('Added successfully');
         }


         let activeOrders = ($scope.PreOpObj.OrderDetails || [])
             .filter(order => order.DeleteInd === 'N' && order.MedTypeId == 2);

         let isColumnTrue = activeOrders.some(order =>
             (order.DilationMedications &&
                 order.DilationMedications.some(item => item.DeleteInd === 'N'))
         );

         $scope.PreOpObj.DisableSurgeonordersCheck = isColumnTrue;
         $scope.PreOpObj.IsSurgeonOrdersTimeChecked = !isColumnTrue;
      
         $scope.DilationMedicationObj = angular.copy($scope.GetDilationMedicationObj());
     };



     $scope.changePreopAction = function (Id, type) {
         if (type == 2) {
             var filteredArray = $filter("filter")($scope.actionArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.DilationMedicationObj.Action = filteredArray[0].Code;
                 $scope.DilationMedicationObj.ActionId = filteredArray[0].MedicineDosaageFieldId;
             };


             $scope.updateOrderDescription(2);
         } else if (type == 1) {
             var filteredArray = $filter("filter")($scope.actionArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.PreOpMedicationObj.Action = filteredArray[0].Code;
                 $scope.PreOpMedicationObj.ActionId = filteredArray[0].MedicineDosaageFieldId;
             };

             $scope.updateOrderDescription(1);
         }


         else if (type == 4) {
             var filteredArray = $filter("filter")($scope.actionArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.IntraOpMedicationObj.Action = filteredArray[0].Code;
                 $scope.IntraOpMedicationObj.ActionId = filteredArray[0].MedicineDosaageFieldId;
             };


             $scope.updateOrderDescription(4);
         } else if (type == 3) {
             var filteredArray = $filter("filter")($scope.actionArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.AnesthesiaMedicationObj.Action = filteredArray[0].Code;
                 $scope.AnesthesiaMedicationObj.ActionId = filteredArray[0].MedicineDosaageFieldId;
             };


             $scope.updateOrderDescription(3);
         }
         else if (type == 8) {

             var filteredArray = $filter("filter")($scope.actionArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.PostOpMedicationObj.Action = filteredArray[0].Code;
                 $scope.PostOpMedicationObj.ActionId = filteredArray[0].MedicineDosaageFieldId;
             };

             $scope.updateOrderDescription(8);
         } else if (type == 5) {
             var filteredArray = $filter("filter")($scope.actionArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.PostOpMedicationObj.Action = filteredArray[0].Code;
                 $scope.PostOpMedicationObj.ActionId = filteredArray[0].MedicineDosaageFieldId;
             };

             $scope.updateOrderDescription(5);
         }
     };

     $scope.changePreopDose = function (Id, type) {
         if (type == 2) {
             var filteredArray = $filter("filter")($scope.doseArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.DilationMedicationObj.Dose = filteredArray[0].Code;
                 $scope.DilationMedicationObj.DoseId = filteredArray[0].MedicineDosaageFieldId;
             };

             $scope.updateOrderDescription(2);
         } else if (type == 1) {
             var filteredArray = $filter("filter")($scope.doseArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.PreOpMedicationObj.Dose = filteredArray[0].Code;
                 $scope.PreOpMedicationObj.DoseId = filteredArray[0].MedicineDosaageFieldId;
             };
             $scope.updateOrderDescription(1);
         }


         else if (type == 4) {
             var filteredArray = $filter("filter")($scope.doseArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.IntraOpMedicationObj.Dose = filteredArray[0].Code;
                 $scope.IntraOpMedicationObj.DoseId = filteredArray[0].MedicineDosaageFieldId;
             };
             $scope.updateOrderDescription(4);
         } else if (type == 3) {

             var filteredArray = $filter("filter")($scope.doseArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.AnesthesiaMedicationObj.Dose = filteredArray[0].Code;
                 $scope.AnesthesiaMedicationObj.DoseId = filteredArray[0].MedicineDosaageFieldId;
             };
             $scope.updateOrderDescription(3);
         }
         else if (type == 8 ) {

             var filteredArray = $filter("filter")($scope.doseArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.PostOpMedicationObj.Dose = filteredArray[0].Code;
                 $scope.PostOpMedicationObj.DoseId = filteredArray[0].MedicineDosaageFieldId;
             };

             $scope.updateOrderDescription(8);
         } else if (type == 5) {
             var filteredArray = $filter("filter")($scope.doseArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.PostOpMedicationObj.Dose = filteredArray[0].Code;
                 $scope.PostOpMedicationObj.DoseId = filteredArray[0].MedicineDosaageFieldId;
             };

             $scope.updateOrderDescription(5);
         }
     };

     $scope.changePreopDoseUnit = function (Id, type) {
         if (type == 2) {
             var filteredArray = $filter("filter")($scope.doseUnitArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.DilationMedicationObj.DoseUnit = filteredArray[0].Code;
                 $scope.DilationMedicationObj.DoseUnitId = filteredArray[0].MedicineDosaageFieldId;
             };
             $scope.updateOrderDescription(2);
         } else if (type == 1) {
             var filteredArray = $filter("filter")($scope.doseUnitArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.PreOpMedicationObj.DoseUnit = filteredArray[0].Code;
                 $scope.PreOpMedicationObj.DoseUnitId = filteredArray[0].MedicineDosaageFieldId;
             };
             $scope.updateOrderDescription(1);
         }

         else if (type == 4) {
             var filteredArray = $filter("filter")($scope.doseUnitArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.IntraOpMedicationObj.DoseUnit = filteredArray[0].Code;
                 $scope.IntraOpMedicationObj.DoseUnitId = filteredArray[0].MedicineDosaageFieldId;
             };
             $scope.updateOrderDescription(4);
         } else if (type == 3) {

             var filteredArray = $filter("filter")($scope.doseUnitArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.AnesthesiaMedicationObj.DoseUnit = filteredArray[0].Code;
                 $scope.AnesthesiaMedicationObj.DoseUnitId = filteredArray[0].MedicineDosaageFieldId;
             };
             $scope.updateOrderDescription(3);
         } else if (type == 8) {

             var filteredArray = $filter("filter")($scope.doseUnitArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.PostOpMedicationObj.DoseUnit = filteredArray[0].Code;
                 $scope.PostOpMedicationObj.DoseUnitId = filteredArray[0].MedicineDosaageFieldId;
             };
             $scope.updateOrderDescription(8);
         } else if (type == 5) {
             var filteredArray = $filter("filter")($scope.doseUnitArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.PostOpMedicationObj.DoseUnit = filteredArray[0].Code;
                 $scope.PostOpMedicationObj.DoseUnitId = filteredArray[0].MedicineDosaageFieldId;
             };
             $scope.updateOrderDescription(5);
         }
        
     };

     $scope.changePreopRoute = function (Id, type) {
         if (type == 2) {
             var filteredArray = $filter("filter")($scope.routeArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.DilationMedicationObj.Route = filteredArray[0].Code;
                 $scope.DilationMedicationObj.RouteId = filteredArray[0].MedicineDosaageFieldId;
             };
             $scope.updateOrderDescription(2);
         } else if (type == 1) {
             var filteredArray = $filter("filter")($scope.routeArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.PreOpMedicationObj.Route = filteredArray[0].Code;
                 $scope.PreOpMedicationObj.RouteId = filteredArray[0].MedicineDosaageFieldId;
             };
             $scope.updateOrderDescription(1);
         }


         else if (type == 4) {
             var filteredArray = $filter("filter")($scope.routeArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.IntraOpMedicationObj.Route = filteredArray[0].Code;
                 $scope.IntraOpMedicationObj.RouteId = filteredArray[0].MedicineDosaageFieldId;
             };
             $scope.updateOrderDescription(4);
         } else if (type == 3) {

             var filteredArray = $filter("filter")($scope.routeArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.AnesthesiaMedicationObj.Route = filteredArray[0].Code;
                 $scope.AnesthesiaMedicationObj.RouteId = filteredArray[0].MedicineDosaageFieldId;
             };
             $scope.updateOrderDescription(3);
         }
         else if (type == 8 ) {

             var filteredArray = $filter("filter")($scope.routeArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.PostOpMedicationObj.Route = filteredArray[0].Code;
                 $scope.PostOpMedicationObj.RouteId = filteredArray[0].MedicineDosaageFieldId;
             };
             $scope.updateOrderDescription(8);
         } else if (type == 5) {
             var filteredArray = $filter("filter")($scope.routeArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.PostOpMedicationObj.Route = filteredArray[0].Code;
                 $scope.PostOpMedicationObj.RouteId = filteredArray[0].MedicineDosaageFieldId;
             };
             $scope.updateOrderDescription(5);
         }
     };

     $scope.changePreopFrequency = function (Id, type) {
         if (type == 2) {
             var filteredArray = $filter("filter")($scope.frequencyArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.DilationMedicationObj.Frequency = filteredArray[0].Description;
                 $scope.DilationMedicationObj.FrequencyId = filteredArray[0].MedicineDosaageFieldId;
             };

             $scope.updateOrderDescription(2);
         } else if (type == 1) {
             var filteredArray = $filter("filter")($scope.frequencyArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.PreOpMedicationObj.Frequency = filteredArray[0].Description;
                 $scope.PreOpMedicationObj.FrequencyId = filteredArray[0].MedicineDosaageFieldId;
             };

             $scope.updateOrderDescription(1);
         }


         else if (type == 4) {
             var filteredArray = $filter("filter")($scope.frequencyArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.IntraOpMedicationObj.Frequency = filteredArray[0].Description;
                 $scope.IntraOpMedicationObj.FrequencyId = filteredArray[0].MedicineDosaageFieldId;
             };
             $scope.updateOrderDescription(4);
         } else if (type == 3) {

             var filteredArray = $filter("filter")($scope.frequencyArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.AnesthesiaMedicationObj.Frequency = filteredArray[0].Description;
                 $scope.AnesthesiaMedicationObj.FrequencyId = filteredArray[0].MedicineDosaageFieldId;
             };
             $scope.updateOrderDescription(3);
         } else if (type == 8) {

             var filteredArray = $filter("filter")($scope.frequencyArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.PostOpMedicationObj.Frequency = filteredArray[0].Description;
                 $scope.PostOpMedicationObj.FrequencyId = filteredArray[0].MedicineDosaageFieldId;
             };
             $scope.updateOrderDescription(8);
         } else if (type == 5) {
             var filteredArray = $filter("filter")($scope.frequencyArray, { "MedicineDosaageFieldId": Id }, true);
             if (filteredArray.length > 0) {
                 $scope.PostOpMedicationObj.Frequency = filteredArray[0].Description;
                 $scope.PostOpMedicationObj.FrequencyId = filteredArray[0].MedicineDosaageFieldId;
             };
             $scope.updateOrderDescription(5);
         }
     };

     

     $scope.updateOrderDescription = function (id) {

         if (id == 2) {
             $scope.DilationMedicationObj.OrderDescription = $scope.DilationMedicationObj.Action + " " + $scope.DilationMedicationObj.MedicationName + " " + $scope.DilationMedicationObj.Dose + " " + $scope.DilationMedicationObj.DoseUnit + " " + $scope.DilationMedicationObj.Route + " " + $scope.DilationMedicationObj.Frequency + " " +($scope.DilationMedicationObj.maxDose ? " for " + $scope.DilationMedicationObj.maxDose + " times." : "");

         } else if (id == 1) {
             $scope.PreOpMedicationObj.OrderDescription = $scope.PreOpMedicationObj.Action + " " + $scope.PreOpMedicationObj.MedicationName + " " + $scope.PreOpMedicationObj.Dose + " " + $scope.PreOpMedicationObj.DoseUnit + " " + $scope.PreOpMedicationObj.Route + " " + $scope.PreOpMedicationObj.Frequency + " " + ($scope.PreOpMedicationObj.maxDose ? " for  " + $scope.PreOpMedicationObj.maxDose + " times." : "");

         }


         else if (id == 4) {
             $scope.IntraOpMedicationObj.OrderDescription = $scope.IntraOpMedicationObj.Action + " " + $scope.IntraOpMedicationObj.MedicationName + " " + $scope.IntraOpMedicationObj.Dose + " " + $scope.IntraOpMedicationObj.DoseUnit + " " + $scope.IntraOpMedicationObj.Route + " " + $scope.IntraOpMedicationObj.Frequency + " " + ($scope.IntraOpMedicationObj.maxDose ? " for " + $scope.IntraOpMedicationObj.maxDose + " times." : "");

         } else if (id == 3) {
             $scope.AnesthesiaMedicationObj.OrderDescription = $scope.AnesthesiaMedicationObj.Action + " " + $scope.AnesthesiaMedicationObj.MedicationName + " " + $scope.AnesthesiaMedicationObj.Dose + " " + $scope.AnesthesiaMedicationObj.DoseUnit + " " + $scope.AnesthesiaMedicationObj.Route + " " + $scope.AnesthesiaMedicationObj.Frequency + " " + ($scope.AnesthesiaMedicationObj.maxDose ? " for " + $scope.AnesthesiaMedicationObj.maxDose + " times." : "");

         } else if (id == 5) {
             $scope.PostOpMedicationObj.OrderDescription = $scope.PostOpMedicationObj.Action + " " + $scope.PostOpMedicationObj.MedicationName + " " + $scope.PostOpMedicationObj.Dose + " " + $scope.PostOpMedicationObj.DoseUnit + " " + $scope.PostOpMedicationObj.Route + " " + $scope.PostOpMedicationObj.Frequency + " " + ($scope.PostOpMedicationObj.maxDose ? " for " + $scope.PostOpMedicationObj.maxDose + " times." : "");
         } else if (id == 8) {
             $scope.PostOpMedicationObj.OrderDescription = $scope.PostOpMedicationObj.Action + " " + $scope.PostOpMedicationObj.MedicationName + " " + $scope.PostOpMedicationObj.Dose + " " + $scope.PostOpMedicationObj.DoseUnit + " " + $scope.PostOpMedicationObj.Route + " " + $scope.PostOpMedicationObj.Frequency + " " + ($scope.PostOpMedicationObj.maxDose ? " for " + $scope.PostOpMedicationObj.maxDose + " times." : "");
         }

     }



     $scope.editDilationMedication = function (item, index) {
         $scope.DilationMedicationObj.MedicineObject = {
             MedicationName: item.MedicationName,
             MedicineId: item.MedicineId,
             OrganizationPrescriptionId: item.OrganizationPrescriptionId,
             Strength: item.Strength || '',
             IsFrequent: item.IsFrequent || 'N',
             AscMedicationId: item.AscMedicationId || 0
           
         };    
     
         $scope.DilationMedicationObj.MedicationName = item.MedicationName;
      
         $scope.DilationMedicationObj.Action = item.Action;
         $scope.DilationMedicationObj.Dose = item.Dose;
         $scope.DilationMedicationObj.DoseUnit = item.DoseUnit;
         $scope.DilationMedicationObj.Route = item.Route;
         $scope.DilationMedicationObj.Frequency = item.Frequency;

         $scope.DilationMedicationObj.ActionId = item.ActionId;
         $scope.DilationMedicationObj.DoseId = item.DoseId;
         $scope.DilationMedicationObj.DoseUnitId = item.DoseUnitId;
         $scope.DilationMedicationObj.RouteId = item.RouteId;
         $scope.DilationMedicationObj.FrequencyId = item.FrequencyId;

         $scope.DilationMedicationObj.MedicationNotes = item.MedicationNotes;
         $scope.DilationMedicationObj.maxDose = item.maxDose;

         $scope.DilationMedicationObj.OrderDescription = item.OrderDescription; 
         $scope.DilationMedicationObj.DropTimings = item.DropTimings || [];
         $scope.DilationMedicationObj.EditIndex = index;

         $scope.DilationMedicationObj.OrderTypeId = item.OrderTypeId;
         $scope.DilationMedicationObj.OrderTypeName = item.OrderTypeName;
         $scope.DilationMedicationObj.AscMedicationId = item.AscMedicationId;
         $scope.DilationMedicationObj.IsmedSearchDisabled = true;
         $scope.PreOpObj.OrderType = 'Medications';

       
     };

    
     //$scope.isMaxDoseReached = function (item) {

     //    (item.DropTimings?.length || 0) >= (item.MaxDose || 0)
             
     //};



     $scope.SelectDialtionMedicationItemsFrequent1 = function (item, type) {


         //let templist = $filter("filter")($scope.PreOpObj.OrderDetails, {  "MedTypeId": 2, 'IsOrderReviewed': false, 'DeleteInd': 'N'}, true);
         let templist = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
             return oitem.MedTypeId === 2 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
         }) || [];
         let i = 0;
         angular.forEach($scope.PreOpObj.OrderDetails, function (mitem) {
             angular.forEach(mitem.DilationMedications, function (Aitem) {
                 if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
                     i++;
                 }
             });
         });

         if (i > 0) {
             alertify.error('You have already entered this Medication');
             $scope.DilationMedicationObj.MedicineObject = "";
             return false;
         }
         if (templist.length > 0) {

             let List1 = $filter("filter")(templist[0].DilationMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
             let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
             if (List.length > 0) {
                 alertify.error("Medicine name already added!");
                 $scope.DilationMedicationObj.MedicineObject = '';
                 return false;
             }
             let GivenBy = null;
             let loggedUser = $filter('filter')($scope.MedicationGivenByNurseArray, { 'DoctorID': $scope.UserId }, true) || [];
             if (loggedUser.length > 0) {
                 GivenBy = loggedUser[0].DoctorID;
             }

             if (type == 'Frequently') {
                 var obj = {
                     "AscMedicationId": 0,
                     "OrganizationMedicationId": item.OrganizationPrescriptionId,
                     "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                     "ParentOrganizationId": $scope.ParenthospitalId,
                     "ASCOrganizationMedicationId": 0,
                     "Strength": item.Strength || '',
                     "IsFrequent": item.IsFrequent || 'N',
                     "MedicineId": item.MedicineId,
                     "MedicationName": item.MedicationName,
                     "IsChecked": false,
                     "IsDilationMed": false,
                     "IsIntraAnesthesiaMed": false,
                     "IsIntraMed": false,
                     "IsPreOPMed": false,
                     "MedicationDosage": "",
                     "DropTimings": [],

                     "TypeId": 2,
                     "DeleteInd": "N",
                     "Action": item.Action,
                     "Dose": item.Dose,
                     "DoseUnit": item.DoseUnit,
                     "Route": item.Route,
                     "Frequency": item.Frequency,
                     "ActionId": item.ActionId,
                     "DoseId": item.DoseId,
                     "DoseUnitId": item.DoseUnitId,
                     "RouteId": item.RouteId,
                     "FrequencyId": item.FrequencyId,
                     "MedicationNotes": item.MedicationNotes || "",
                     "maxDose": item.maxDose,
                     "OrderDescription": item.OrderDescription,
                     "OrderTypeId": OrderTypeId,
                     "OrderTypeName": OrderTypeName
                 }
                 templist[0].DilationMedications.push(obj);
                 $scope.DilationMedicationObj.MedicineObject = "";
             } else {
                 var obj = {
                     "AscMedicationId": 0,
                     "OrganizationMedicationId": item.OrganizationPrescriptionId,
                     "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                     "ParentOrganizationId": $scope.ParenthospitalId,
                     "ASCOrganizationMedicationId": 0,
                     "Strength": item.Strength || '',
                     "IsFrequent": item.IsFrequent || 'N',
                     "MedicineId": item.MedicineId,
                     "MedicationName": item.MedicineName,
                     "IsChecked": false,
                     "IsDilationMed": false,
                     "IsIntraAnesthesiaMed": false,
                     "IsIntraMed": false,
                     "IsPreOPMed": false,
                     "MedicationDosage": "",
                     "DropTimings": [],

                     "TypeId": 2,
                     "DeleteInd": "N",
                     "Action": item.Action,
                     "Dose": item.Dose,
                     "DoseUnit": item.DoseUnit,
                     "Route": item.Route,
                     "Frequency": item.Frequency,
                     "MedicationNotes": item.MedicationNotes || "",
                     "maxDose": item.maxDose,
                     "ActionId": item.ActionId,
                     "DoseId": item.DoseId,
                     "DoseUnitId": item.DoseUnitId,
                     "RouteId": item.RouteId,
                     "FrequencyId": item.FrequencyId,

                     "OrderDescription": item.OrderDescription,
                     "OrderTypeId": OrderTypeId,
                     "OrderTypeName": OrderTypeName
                 }
                 templist[0].DilationMedications.push(obj);
                 $scope.DilationMedicationObj.MedicineObject = "";
             }




         } else {

             //let templist2 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
             let templist2 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                 return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
             }) || [];
             if (templist2.length > 0) {
                 templist2[0].MedTypeId = 2;
                 templist2[0].MedTypeName = 'Dilation Medication';
             } else {

                 //let templist3 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 2, 'DeleteInd': 'N' }, true) || [];
                 let templist3 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                     return oitem.MedTypeId === 2 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                 }) || [];
                 if (templist3.length > 0) {

                 } else {
                     var obj = {
                         "UserOrderId": 0,
                         "UserId": $scope.UserId,
                         "DeleteInd": "N",
                         "ReviewedBy": null,
                         "IsOrderReviewed": false,
                         "ReviewedByDateTime": null,
                         "ReviewedByPassword": '',
                         "UserType": "Nurse",
                         "ScreenType": "PreOp",
                         "ScreenTypeId": 4,
                         "MedTypeId": 2,
                         "MedTypeName": 'Dilation Medication',
                         "DilationMedications": [],
                         "PreOpMedications": [],
                         "GeneralOrders": [],
                         "OrderTypeId": OrderTypeId || 0,
                         "OrderTypeName": OrderTypeName || '',
                     }
                     $scope.PreOpObj.OrderDetails.push(obj);
                 }

             }
             //let templist1 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 2, 'DeleteInd': 'N' }, true) || [];
             let templist1 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                 return oitem.MedTypeId === 2 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
             }) || [];
             if (templist1.length > 0) {
                 let List1 = $filter("filter")(templist1[0].DilationMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                 let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                 if (List.length > 0) {
                     alertify.error("Medicine name already added!");
                     $scope.DilationMedicationObj.MedicineObject = '';
                     return false;
                 }
                 let GivenBy = null;
                 let loggedUser = $filter('filter')($scope.MedicationGivenByNurseArray, { 'DoctorID': $scope.UserId }, true) || [];
                 if (loggedUser.length > 0) {
                     GivenBy = loggedUser[0].DoctorID;
                 }

                 if (type == 'Frequently') {
                     var obj = {
                         "AscMedicationId": 0,
                         "OrganizationMedicationId": item.OrganizationPrescriptionId,
                         "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                         "ParentOrganizationId": $scope.ParenthospitalId,
                         "ASCOrganizationMedicationId": 0,
                         "Strength": item.Strength || '',
                         "IsFrequent": item.IsFrequent || 'N',
                         "MedicineId": item.MedicineId,
                         "MedicationName": item.MedicationName,
                         "IsChecked": false,
                         "IsDilationMed": false,
                         "IsIntraAnesthesiaMed": false,
                         "IsIntraMed": false,
                         "IsPreOPMed": false,
                         "MedicationDosage": "",
                         "DropTimings": [],
                         "Action": item.Action,
                         "Dose": item.Dose,
                         "DoseUnit": item.DoseUnit,
                         "Route": item.Route,
                         "Frequency": item.Frequency,
                         "MedicationNotes": item.MedicationNotes ||  "",
                         "maxDose": item.maxDose,
                         "ActionId": item.ActionId,
                         "DoseId": item.DoseId,
                         "DoseUnitId": item.DoseUnitId,
                         "RouteId": item.RouteId,
                         "FrequencyId": item.FrequencyId,

                         "OrderDescription": item.OrderDescription,
                         "TypeId": 2,
                         "DeleteInd": "N",
                         "OrderTypeId": OrderTypeId,
                         "OrderTypeName": OrderTypeName
                     }
                     templist1[0].DilationMedications.push(obj);
                     $scope.DilationMedicationObj.MedicineObject = "";
                 } else {
                     var obj = {
                         "AscMedicationId": 0,
                         "OrganizationMedicationId": item.OrganizationPrescriptionId,
                         "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                         "ParentOrganizationId": $scope.ParenthospitalId,
                         "ASCOrganizationMedicationId": 0,
                         "Strength": item.Strength || '',
                         "IsFrequent": item.IsFrequent || 'N',
                         "MedicineId": item.MedicineId,
                         "MedicationName": item.MedicineName,
                         "IsChecked": false,
                         "IsDilationMed": false,
                         "IsIntraAnesthesiaMed": false,
                         "IsIntraMed": false,
                         "IsPreOPMed": false,
                         "MedicationDosage": "",
                         "DropTimings": [],
                         "Action": item.Action,
                         "Dose": item.Dose,
                         "DoseUnit": item.DoseUnit,
                         "Route": item.Route,
                         "Frequency": item.Frequency,

                         "ActionId": item.ActionId,
                         "DoseId": item.DoseId,
                         "DoseUnitId": item.DoseUnitId,
                         "RouteId": item.RouteId,
                         "FrequencyId": item.FrequencyId,
                         "MedicationNotes": item.MedicationNotes || "",
                         "maxDose": item.maxDose,
                         "OrderDescription": item.OrderDescription,
                         "TypeId": 2,
                         "DeleteInd": "N",
                         "OrderTypeId": OrderTypeId,
                         "OrderTypeName": OrderTypeName
                     }
                     templist1[0].DilationMedications.push(obj);
                     $scope.DilationMedicationObj.MedicineObject = "";
                 }



             } else {




             }
         }

       
         let activeOrders = ($scope.PreOpObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 2);

         let isColumnTrue = activeOrders.some(order =>
             (order.DilationMedications &&
                 order.DilationMedications.some(item => item.DeleteInd === 'N'))
         );

         $scope.PreOpObj.DisableSurgeonordersCheck = isColumnTrue;
         $scope.PreOpObj.IsSurgeonOrdersTimeChecked = !isColumnTrue;

     }


     //Preop Medication


     $scope.SelectPreOpMedicationItems1 = function (item, type) {       
         let i = 0;
         angular.forEach($scope.PreOpObj.OrderDetails, function (mitem) {
             angular.forEach(mitem.PreOpMedications, function (Aitem) {
                 if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
                     i++;
                 }
             });
         });

         if (i > 0) {
             alertify.error('You have already entered this Medication');
             $scope.PreOpMedicationObj.MedicineObject = {};
             $scope.PreOpMedicationObj.MedicationName = '';
             return false;
         }  
         $scope.PreOpMedicationObj.MedicineObject = item;         
         $scope.PreOpMedicationObj.MedicationName = item.MedicineName;


         if ($scope.PreOpMedicationObj.AscMedicationId != 0) {
             item.AscMedicationId = $scope.PreOpMedicationObj.AscMedicationId;
         }

         $scope.updateOrderDescription(1);
     };




    


     $scope.SelectPreOpMedicationItemsFrequent1 = function (item, type) {

         //let templist = $filter("filter")($scope.PreOpObj.OrderDetails, { "MedTypeId": 1, 'IsOrderReviewed': false, 'DeleteInd': 'N'}, true);
         let templist = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
             return oitem.MedTypeId === 1 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
         }) || [];
         let i = 0;
         angular.forEach($scope.PreOpObj.OrderDetails, function (mitem) {
             angular.forEach(mitem.PreOpMedications, function (Aitem) {
                 if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
                     i++;
                 }
             });
         });

         if (i > 0) {
             alertify.error('You have already entered this Medication');
             $scope.PreOpMedicationObj.MedicineObject = "";
             return false;
         }
         if (templist.length > 0) {

             let List1 = $filter("filter")(templist[0].PreOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
             let List = $filter("filter")(List1, { 'DeleteInd': 'N' }, true);
             if (List.length > 0) {
                 alertify.error("Medicine name already added!");
                 $scope.PreOpMedicationObj.MedicineObject = "";
                 return false;
             }

             let GivenByn = null;
             let loggedUser = $filter('filter')($scope.MedicationGivenBy, { 'DoctorID': $scope.UserId }, true) || [];
             if (loggedUser.length > 0) {
                 GivenByn = loggedUser[0].DoctorID;
             }


             if (type == 'Frequently') {
                 var obj = {
                     "AscMedicationId": 0,
                     "OrganizationMedicationId": item.OrganizationPrescriptionId,
                     "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                     "ParentOrganizationId": $scope.ParenthospitalId,
                     "ASCOrganizationMedicationId": 0,
                     "Strength": item.Strength || '',
                     "IsFrequent": item.IsFrequent || 'N',
                     "MedicineId": item.MedicineId,
                     "MedicationName": item.MedicationName,
                     "IsChecked": false,
                     "IsDilationMed": false,
                     "IsIntraAnesthesiaMed": false,
                     "IsIntraMed": false,
                     "IsPreOPMed": true,
                     "MedicationDosage": "",
                     "DropTimings": [],                 
                     "TypeId": 1,
                     "DeleteInd": "N",
                     "Action": item.Action,
                     "Dose": item.Dose,
                     "DoseUnit": item.DoseUnit,
                     "Route": item.Route,
                     "Frequency": item.Frequency,
                     "ActionId": item.ActionId,
                     "DoseId": item.DoseId,
                     "DoseUnitId": item.DoseUnitId,
                     "RouteId": item.RouteId,
                     "FrequencyId": item.FrequencyId,
                     "MedicationNotes": item.MedicationNotes || "",
                     "maxDose": item.maxDose,
                     "OrderDescription": item.OrderDescription,
                     "OrderTypeId": OrderTypeId,
                     "OrderTypeName": OrderTypeName
                 }
             } else {
                 var obj = {
                     "AscMedicationId": 0,
                     "OrganizationMedicationId": item.OrganizationPrescriptionId,
                     "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                     "ParentOrganizationId": $scope.ParenthospitalId,
                     "ASCOrganizationMedicationId": 0,
                     "Strength": item.Strength || '',
                     "IsFrequent": item.IsFrequent || 'N',
                     "MedicineId": item.MedicineId,
                     "MedicationName": item.MedicineName,
                     "IsChecked": false,
                     "IsDilationMed": false,
                     "IsIntraAnesthesiaMed": false,
                     "IsIntraMed": false,
                     "IsPreOPMed": true,
                     "MedicationDosage": "",
                     "DropTimings": [],
                   
                     "TypeId": 1,
                     "DeleteInd": "N",
                     "Action": item.Action,
                     "Dose": item.Dose,
                     "DoseUnit": item.DoseUnit,
                     "Route": item.Route,
                     "Frequency": item.Frequency,
                     "ActionId": item.ActionId,
                     "DoseId": item.DoseId,
                     "DoseUnitId": item.DoseUnitId,
                     "RouteId": item.RouteId,
                     "FrequencyId": item.FrequencyId,
                     "MedicationNotes": item.MedicationNotes || "",
                     "maxDose": item.maxDose,
                     "OrderDescription": item.OrderDescription,
                     "OrderTypeId": OrderTypeId,
                     "OrderTypeName": OrderTypeName
                 }
             }

             templist[0].PreOpMedications.push(obj);
             $scope.PreOpMedicationObj.MedicineObject = "";

         } else {
             //let templist2 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
             let templist2 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                 return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
             }) || [];
             if (templist2.length > 0) {
                 templist2[0].MedTypeId = 1;
                 templist2[0].MedTypeName = 'PreOp Medication';
                 templist2[0].UserType = 'Anesthesia';
             } else {

                 //let templist3 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 1, 'DeleteInd': 'N' }, true) || [];
                 let templist3 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                     return oitem.MedTypeId === 1 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                 }) || [];
                 if (templist3.length > 0) {

                 }
                 else {
                     var obj = {
                         "UserOrderId": 0,
                         "UserId": $scope.UserId,
                         "DeleteInd": "N",
                         "ReviewedBy": null,
                         "IsOrderReviewed": false,
                         "ReviewedByDateTime": null,
                         "ReviewedByPassword": '',
                         "UserType": "Anesthesia",
                         "ScreenType": "PreOp",
                         "ScreenTypeId": 4,
                         "MedTypeId": 1,
                         "MedTypeName": 'PreOp Medication',
                         "DilationMedications": [],
                         "PreOpMedications": [],
                         "GeneralOrders": [],
                         "OrderTypeId": OrderTypeId || 0,
                         "OrderTypeName": OrderTypeName || '',
                     }
                     $scope.PreOpObj.OrderDetails.push(obj);
                 }

             }

             //let templist1 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 1, 'DeleteInd': 'N' }, true) || [];
             let templist1 = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                 return oitem.MedTypeId === 1 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
             }) || [];
             if (templist1.length > 0) {
                 let List1 = $filter("filter")(templist1[0].PreOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                 let List = $filter("filter")(List1, { 'DeleteInd': 'N' }, true);
                 if (List.length > 0) {
                     alertify.error("Medicine name already added!");
                     $scope.PreOpMedicationObj.MedicineObject = "";
                     return false;
                 }

                 let GivenByn = null;
                 let loggedUser = $filter('filter')($scope.MedicationGivenBy, { 'DoctorID': $scope.UserId }, true) || [];
                 if (loggedUser.length > 0) {
                     GivenByn = loggedUser[0].DoctorID;
                 }


                 if (type == 'Frequently') {
                     var obj = {
                         "AscMedicationId": 0,
                         "OrganizationMedicationId": item.OrganizationPrescriptionId,
                         "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                         "ParentOrganizationId": $scope.ParenthospitalId,
                         "ASCOrganizationMedicationId": 0,
                         "Strength": item.Strength || '',
                         "IsFrequent": item.IsFrequent || 'N',
                         "MedicineId": item.MedicineId,
                         "MedicationName": item.MedicationName,
                         "IsChecked": false,
                         "IsDilationMed": false,
                         "IsIntraAnesthesiaMed": false,
                         "IsIntraMed": false,
                         "IsPreOPMed": true,
                         "MedicationDosage": "",
                         "DropTimings": [],
                       
                         "TypeId": 1,
                         "DeleteInd": "N",
                         "Action": item.Action,
                         "Dose": item.Dose,
                         "DoseUnit": item.DoseUnit,
                         "Route": item.Route,
                         "Frequency": item.Frequency,
                         "ActionId": item.ActionId,
                         "DoseId": item.DoseId,
                         "DoseUnitId": item.DoseUnitId,
                         "RouteId": item.RouteId,
                         "FrequencyId": item.FrequencyId,
                         "MedicationNotes": item.MedicationNotes || "",
                         "maxDose": item.maxDose,
                         "OrderDescription": item.OrderDescription,
                         "OrderTypeId": OrderTypeId,
                         "OrderTypeName": OrderTypeName
                     }
                 } else {
                     var obj = {
                         "AscMedicationId": 0,
                         "OrganizationMedicationId": item.OrganizationPrescriptionId,
                         "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                         "ParentOrganizationId": $scope.ParenthospitalId,
                         "ASCOrganizationMedicationId": 0,
                         "Strength": item.Strength || '',
                         "IsFrequent": item.IsFrequent || 'N',
                         "MedicineId": item.MedicineId,
                         "MedicationName": item.MedicineName,
                         "IsChecked": false,
                         "IsDilationMed": false,
                         "IsIntraAnesthesiaMed": false,
                         "IsIntraMed": false,
                         "IsPreOPMed": true,
                         "MedicationDosage": "",
                         "DropTimings": [],
                        
                         "TypeId": 1,
                         "DeleteInd": "N",
                         "Action": item.Action,
                         "Dose": item.Dose,
                         "DoseUnit": item.DoseUnit,
                         "Route": item.Route,
                         "Frequency": item.Frequency,
                         "ActionId": item.ActionId,
                         "DoseId": item.DoseId,
                         "DoseUnitId": item.DoseUnitId,
                         "RouteId": item.RouteId,
                         "FrequencyId": item.FrequencyId,
                         "MedicationNotes": item.MedicationNotes || "",
                         "maxDose": item.maxDose,
                         "OrderDescription": item.OrderDescription,
                         "OrderTypeId": OrderTypeId,
                         "OrderTypeName": OrderTypeName
                     }
                 }

                 templist1[0].PreOpMedications.push(obj);
                 $scope.PreOpMedicationObj.MedicineObject = "";
             }
             else {

             }
         }
       
         let activeOrders = ($scope.PreOpObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 1);

         let isColumnTrue = activeOrders.some(order =>
             (order.PreOpMedications &&
                 order.PreOpMedications.some(item => item.DeleteInd === 'N'))
         );

         if (isColumnTrue) {
             $scope.PreOpObj.DisableAnesthesiaOrdersCheck = isColumnTrue;
             $scope.PreOpObj.IsAnesthesiaOrdersTimeChecked = !isColumnTrue;
         }
     }
  
    
     $scope.editPreopMedication = function (item, index) {
         $scope.PreOpMedicationObj.MedicineObject = {
             MedicationName: item.MedicationName,
             MedicineId: item.MedicineId,
             OrganizationPrescriptionId: item.OrganizationPrescriptionId,
             Strength: item.Strength || '',
             IsFrequent: item.IsFrequent || 'N',
             AscMedicationId: item.AscMedicationId || 0
         };

    
         $scope.PreOpMedicationObj.MedicationName = item.MedicationName;
         $scope.PreOpMedicationObj.Action = item.Action;
         $scope.PreOpMedicationObj.Dose = item.Dose;
         $scope.PreOpMedicationObj.DoseUnit = item.DoseUnit;
         $scope.PreOpMedicationObj.Route = item.Route;
         $scope.PreOpMedicationObj.Frequency = item.Frequency;
         $scope.PreOpMedicationObj.ActionId = item.ActionId;
         $scope.PreOpMedicationObj.DoseId = item.DoseId;
         $scope.PreOpMedicationObj.DoseUnitId = item.DoseUnitId;
         $scope.PreOpMedicationObj.RouteId = item.RouteId;
         $scope.PreOpMedicationObj.FrequencyId = item.FrequencyId;

         $scope.PreOpMedicationObj.OrderDescription = item.OrderDescription;

         $scope.PreOpMedicationObj.MedicationNotes = item.MedicationNotes;

         $scope.PreOpMedicationObj.DropTimings = item.DropTimings || [];


         $scope.PreOpMedicationObj.maxDose = item.maxDose;


         $scope.PreOpMedicationObj.OrderTypeId = item.OrderTypeId;
         $scope.PreOpMedicationObj.OrderTypeName = item.OrderTypeName;
         $scope.PreOpMedicationObj.AscMedicationId = item.AscMedicationId;

         $scope.PreOpMedicationObj.EditIndex = index;
         $scope.PreOpMedicationObj.IsmedSearchDisabled = true;
         $scope.PreOpObj.OrderType = 'Medications';
     };


     $scope.AddPreopMedication = function () {
         $scope.IspropMedicationAnsthesia = true;
         let item = $scope.PreOpMedicationObj.MedicineObject;

       
         if (!item || !item.OrganizationPrescriptionId) {
             alertify.error('Please select a Medicine');
             return false;
         }



         if ($scope.PreOpMedicationObj.OrderTypeName == "" && $scope.PreOpMedicationObj.OrderTypeId == null) {
             OrderTypeId = OrderTypeId;
             OrderTypeName = OrderTypeName;
         } else {
             OrderTypeId = $scope.PreOpMedicationObj.OrderTypeId;
             OrderTypeName = $scope.PreOpMedicationObj.OrderTypeName;
         }
     
         let obj = {
             "AscMedicationId": item.AscMedicationId || 0,
             "OrganizationMedicationId": item.OrganizationPrescriptionId,
             "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
             "ParentOrganizationId": $scope.ParenthospitalId,
             "ASCOrganizationMedicationId": 0,
             "Strength": item.Strength || '',
             "IsFrequent": item.IsFrequent || 'N',
             "MedicineId": item.MedicineId,
             "MedicationName": $scope.PreOpMedicationObj.MedicationName,

             "Action": $scope.PreOpMedicationObj.Action,
             "Dose": $scope.PreOpMedicationObj.Dose,
             "DoseUnit": $scope.PreOpMedicationObj.DoseUnit,
             "Route": $scope.PreOpMedicationObj.Route,
             "Frequency": $scope.PreOpMedicationObj.Frequency,

             "ActionId": $scope.PreOpMedicationObj.ActionId,
             "DoseId": $scope.PreOpMedicationObj.DoseId,
             "DoseUnitId": $scope.PreOpMedicationObj.DoseUnitId,
             "RouteId": $scope.PreOpMedicationObj.RouteId,
             "FrequencyId": $scope.PreOpMedicationObj.FrequencyId,
             "OrderDescription": $scope.PreOpMedicationObj.OrderDescription,
             "MedicationNotes": $scope.PreOpMedicationObj.MedicationNotes,
             "maxDose":$scope.PreOpMedicationObj.maxDose,
             "IsChecked": false,
             "IsDilationMed": false,
             "IsIntraAnesthesiaMed": false,
             "IsIntraMed": false,
             "IsPreOPMed": true,  
             "MedicationDosage": "",
             "DropTimings": $scope.PreOpMedicationObj.DropTimings || [],
             "TypeId": 1,          
             "DeleteInd": "N",
             "OrderTypeId": OrderTypeId,
             "OrderTypeName": OrderTypeName,
         };

      
         let templist = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
             return oitem.MedTypeId === 1 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
         }) || [];



         
         if ($scope.PreOpMedicationObj.EditIndex >= 0) {
            
             if (templist.length > 0 && templist[0].PreOpMedications.length > $scope.PreOpMedicationObj.EditIndex) {
                 templist[0].PreOpMedications[$scope.PreOpMedicationObj.EditIndex] = obj;
                 alertify.success('Updated successfully');
             }
         } else { 
             if (templist.length > 0) {
                 templist[0].PreOpMedications.push(obj);
             } else {
              
                 let newObj = {
                     "UserOrderId": 0,
                     "UserId": $scope.UserId,
                     "DeleteInd": "N",
                     "ReviewedBy": null,
                     "IsOrderReviewed": false,
                     "ReviewedByDateTime": null,
                     "ReviewedByPassword": '',
                     "UserType": "Anesthesia",
                     "ScreenType": "PreOp",
                     "ScreenTypeId": 4,
                     "MedTypeId": 1, 
                     "MedTypeName": 'PreOp Medication',
                     "DilationMedications": [],
                     "PreOpMedications": [obj],
                     "GeneralOrders": [],
                     "OrderTypeId": OrderTypeId || 0,
                     "OrderTypeName": OrderTypeName || '',
                 };
                 $scope.PreOpObj.OrderDetails.push(newObj);
             }
             alertify.success('Added successfully');
         }

         let activeOrders = ($scope.PreOpObj.OrderDetails || [])
             .filter(order => order.DeleteInd === 'N' && order.MedTypeId == 1);

         let isColumnTrue = activeOrders.some(order =>
             (order.PreOpMedications &&
                 order.PreOpMedications.some(item => item.DeleteInd === 'N'))
         );

         $scope.PreOpObj.DisableAnesthesiaOrdersCheck = isColumnTrue;
         $scope.PreOpObj.IsAnesthesiaOrdersTimeChecked = !isColumnTrue;
      
         $scope.PreOpMedicationObj = angular.copy($scope.GetDilationMedicationObj());
     };



     //IntraOp

     $scope.SelectIntraOpMedicationItemsFrequent1 = function (item, type) {
         //let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, { "MedTypeId": 4, 'IsOrderReviewed': false, 'DeleteInd': 'N' }, true);
         let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
             return oitem.MedTypeId === 4 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
         }) || [];
         let i = 0;
         angular.forEach($scope.IntraOpObj.OrderDetails, function (mitem) {
             if (mitem.MedTypeId == 4) {
                 angular.forEach(mitem.IntraOpMedications, function (Aitem) {
                     if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
                         i++;
                     }
                 });
             }
         });

         if (i > 0) {
             alertify.error('You have already entered this Medication');
             $scope.IntraOpMedicationObj.MedicineObject = "";
             return false;
         }
         // let templist = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": $scope.UserId, "MedTypeId": 5, 'IsOrderReviewed': false }, true);

         if (templist.length > 0) {

             let List1 = $filter("filter")(templist[0].IntraOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
             let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
             if (List.length > 0) {
                 alertify.error("Medicine name already added!");
                 $scope.IntraOpMedicationObj.MedicineObject = '';
                 return false;
             }
             let GivenBy = null;
             let loggedUser = $filter('filter')($scope.SurgeonArray, { 'DoctorID': $scope.UserId }, true) || [];
             if (loggedUser.length > 0) {
                 GivenBy = loggedUser[0].DoctorID;
             }

             if (type == 'Frequently') {
                 var obj = {
                     "AscMedicationId": 0,
                     "OrganizationMedicationId": item.OrganizationPrescriptionId,
                     "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                     "ParentOrganizationId": $scope.ParenthospitalId,
                     "ASCOrganizationMedicationId": 0,
                     "Strength": item.Strength || '',
                     "IsFrequent": item.IsFrequent || 'N',
                     "MedicineId": item.MedicineId,
                     "MedicationName": item.MedicationName,
                     "IsChecked": false,
                     "IsDilationMed": false,
                     "IsIntraAnesthesiaMed": false,
                     "IsIntraMed": false,
                     "IsPreOPMed": false,
                     "MedicationDosage": "",
                     "DropTimings": [],
                     "TypeId": 4,
                     "DeleteInd": "N",
                     "Action": item.Action,
                     "Dose": item.Dose,
                     "DoseUnit": item.DoseUnit,
                     "Route": item.Route,
                     "Frequency": item.Frequency,
                     "ActionId": item.ActionId,
                     "DoseId": item.DoseId,
                     "DoseUnitId": item.DoseUnitId,
                     "RouteId": item.RouteId,
                     "FrequencyId": item.FrequencyId,
                     "OrderDescription": item.OrderDescription,
                     "MedicationNotes": item.MedicationNotes || "",
                     "maxDose": item.maxDose,
                     "OrderTypeId": OrderTypeId,
                     "OrderTypeName": OrderTypeName
                 }
                 templist[0].IntraOpMedications.push(obj);
                 $scope.IntraOpMedicationObj.MedicineObject = "";
             } else {
                 var obj = {
                     "AscMedicationId": 0,
                     "OrganizationMedicationId": item.OrganizationPrescriptionId,
                     "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                     "ParentOrganizationId": $scope.ParenthospitalId,
                     "ASCOrganizationMedicationId": 0,
                     "Strength": item.Strength || '',
                     "IsFrequent": item.IsFrequent || 'N',
                     "MedicineId": item.MedicineId,
                     "MedicationName": item.MedicineName,
                     "IsChecked": false,
                     "IsDilationMed": false,
                     "IsIntraAnesthesiaMed": false,
                     "IsIntraMed": false,
                     "IsPreOPMed": false,
                     "MedicationDosage": "",
                     "DropTimings": [],
                     "TypeId": 4,
                     "DeleteInd": "N",
                     "Action": item.Action,
                     "Dose": item.Dose,
                     "DoseUnit": item.DoseUnit,
                     "Route": item.Route,
                     "Frequency": item.Frequency,
                     "ActionId": item.ActionId,
                     "DoseId": item.DoseId,
                     "DoseUnitId": item.DoseUnitId,
                     "RouteId": item.RouteId,
                     "FrequencyId": item.FrequencyId,
                     "OrderDescription": item.OrderDescription,
                     "MedicationNotes": item.MedicationNotes || "",
                     "maxDose": item.maxDose,
                     "OrderTypeId": OrderTypeId,
                     "OrderTypeName": OrderTypeName
                 }
                 templist[0].IntraOpMedications.push(obj);
                 $scope.IntraOpMedicationObj.MedicineObject = "";


             }
         } else {

             //let templist2 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
             let templist2 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                 return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
             }) || [];
             if (templist2.length > 0) {
                 templist2[0].MedTypeId = 4;
                 templist2[0].MedTypeName = 'Intra Medications';
             } else {

                 //let templist3 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 4, 'DeleteInd': 'N' }, true) || [];
                 let templist3 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                     return oitem.MedTypeId === 4 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                 }) || [];
                 if (templist3.length > 0) {

                 } else {
                     var obj = {
                         "UserOrderId": 0,
                         "UserId": $scope.UserId,
                         "DeleteInd": "N",
                         "IsOrderReviewed": false,
                         "ReviewedByPassword": '',
                         "ReviewedBy": null,
                         "UserType": "Nurse",
                         "ScreenType": "Intra-OP",
                         "ScreenTypeId": 5,
                         "MedTypeId": 4,
                         "MedTypeName": 'Intra Medication',
                         "IntraOpMedications": [],
                         "GeneralOrders": [],
                         "OrderTypeId": OrderTypeId || 0,
                         "OrderTypeName": OrderTypeName || '',
                     }
                     $scope.IntraOpObj.OrderDetails.push(obj);
                 }

             }
             //let templist1 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 4, 'DeleteInd': 'N' }, true) || [];
             let templist1 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                 return oitem.MedTypeId === 4 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
             }) || [];
             if (templist1.length > 0) {
                 let List1 = $filter("filter")(templist1[0].IntraOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                 let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                 if (List.length > 0) {
                     alertify.error("Medicine name already added!");
                     $scope.IntraOpMedicationObj.MedicineObject = "";
                     return false;
                 }
                 let GivenBy = null;
                 let loggedUser = $filter('filter')($scope.SurgeonArray, { 'DoctorID': $scope.UserId }, true) || [];
                 if (loggedUser.length > 0) {
                     GivenBy = loggedUser[0].DoctorID;
                 }

                 if (type == 'Frequently') {
                     var obj = {
                         "AscMedicationId": 0,
                         "OrganizationMedicationId": item.OrganizationPrescriptionId,
                         "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                         "ParentOrganizationId": $scope.ParenthospitalId,
                         "ASCOrganizationMedicationId": 0,
                         "Strength": item.Strength || '',
                         "IsFrequent": item.IsFrequent || 'N',
                         "MedicineId": item.MedicineId,
                         "MedicationName": item.MedicationName,
                         "IsChecked": false,
                         "IsDilationMed": false,
                         "IsIntraAnesthesiaMed": false,
                         "IsIntraMed": false,
                         "IsPreOPMed": false,
                         "MedicationDosage": "",
                         "DropTimings": [],
                         "TypeId": 4,
                         "DeleteInd": "N",
                         "Action": item.Action,
                         "Dose": item.Dose,
                         "DoseUnit": item.DoseUnit,
                         "Route": item.Route,
                         "Frequency": item.Frequency,
                         "ActionId": item.ActionId,
                         "DoseId": item.DoseId,
                         "DoseUnitId": item.DoseUnitId,
                         "RouteId": item.RouteId,
                         "FrequencyId": item.FrequencyId,
                         "OrderDescription": item.OrderDescription,
                         "MedicationNotes": item.MedicationNotes || "",
                         "maxDose": item.maxDose,
                         "OrderTypeId": OrderTypeId,
                         "OrderTypeName": OrderTypeName
                     }
                     templist1[0].IntraOpMedications.push(obj);
                     $scope.IntraOpMedicationObj.MedicineObject = "";
                 } else {
                     var obj = {
                         "AscMedicationId": 0,
                         "OrganizationMedicationId": item.OrganizationPrescriptionId,
                         "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                         "ParentOrganizationId": $scope.ParenthospitalId,
                         "ASCOrganizationMedicationId": 0,
                         "Strength": item.Strength || '',
                         "IsFrequent": item.IsFrequent || 'N',
                         "MedicineId": item.MedicineId,
                         "MedicationName": item.MedicineName,
                         "IsChecked": false,
                         "IsDilationMed": false,
                         "IsIntraAnesthesiaMed": false,
                         "IsIntraMed": false,
                         "IsPreOPMed": false,
                         "MedicationDosage": "",
                         "DropTimings": [],
                         "TypeId": 4,
                         "DeleteInd": "N",
                         "Action": item.Action,
                         "Dose": item.Dose,
                         "DoseUnit": item.DoseUnit,
                         "Route": item.Route,
                         "Frequency": item.Frequency,
                         "ActionId": item.ActionId,
                         "DoseId": item.DoseId,
                         "DoseUnitId": item.DoseUnitId,
                         "RouteId": item.RouteId,
                         "FrequencyId": item.FrequencyId,
                         "OrderDescription": item.OrderDescription,
                         "MedicationNotes": item.MedicationNotes || "",
                         "maxDose": item.maxDose,
                         "OrderTypeId": OrderTypeId,
                         "OrderTypeName": OrderTypeName
                     }
                     templist1[0].IntraOpMedications.push(obj);
                     $scope.IntraOpMedicationObj.MedicineObject = "";
                 }

             }
         }

         let activeOrders = ($scope.IntraOpObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 4);

         let isColumnTrue = activeOrders.some(order =>
             (order.IntraOpMedications &&
                 order.IntraOpMedications.some(item => item.DeleteInd === 'N'))
         );

         $scope.IntraOpObj.DisableIntraopSurgeonCheck = isColumnTrue;
         $scope.IntraOpObj.IsIntraOpSurgeonOrdersTimeAdded = !isColumnTrue;
     }


     $scope.SelectIntraOpMedicationItems = function (item, type) {
         let i = 0;
         angular.forEach($scope.IntraOpObj.OrderDetails, function (mitem) {
             angular.forEach(mitem.IntraOpMedications, function (Aitem) {
                 if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
                     i++;
                 }
             });
         });

         if (i > 0) {
             alertify.error('You have already entered this Medication');
             $scope.IntraOpMedicationObj.MedicineObject = {};
             $scope.IntraOpMedicationObj.MedicationName = '';
             return false;
         }
         $scope.IntraOpMedicationObj.MedicineObject = item;
         $scope.IntraOpMedicationObj.MedicationName = item.MedicineName;

         if ($scope.IntraOpMedicationObj.AscMedicationId != 0) {
             item.AscMedicationId = $scope.IntraOpMedicationObj.AscMedicationId;
         } 
         $scope.updateOrderDescription(4);
     };


    

     $scope.AddIntraopMedication = function () {
         $scope.IsIntraOpSurgeonOrdersCheckBox = true;
         let item = $scope.IntraOpMedicationObj.MedicineObject;

         if (!item || !item.OrganizationPrescriptionId) {
             alertify.error('Please select a Medicine');
             return false;
         }


         if ($scope.IntraOpMedicationObj.OrderTypeName == "" && $scope.IntraOpMedicationObj.OrderTypeId == null) {
             OrderTypeId = OrderTypeId;
             OrderTypeName = OrderTypeName;
         } else {
             OrderTypeId = $scope.IntraOpMedicationObj.OrderTypeId;
             OrderTypeName = $scope.IntraOpMedicationObj.OrderTypeName;
         }

         let obj = {
             AscMedicationId: item.AscMedicationId || 0,
             OrganizationMedicationId: item.OrganizationPrescriptionId,
             OrganizationPrescriptionId: item.OrganizationPrescriptionId,
             ParentOrganizationId: $scope.ParenthospitalId,
             ASCOrganizationMedicationId: 0,
             Strength: item.Strength || '',
             IsFrequent: item.IsFrequent || 'N',
             MedicineId: item.MedicineId,
             MedicationName: $scope.IntraOpMedicationObj.MedicationName,

             Action: $scope.IntraOpMedicationObj.Action,
             Dose: $scope.IntraOpMedicationObj.Dose,
             DoseUnit: $scope.IntraOpMedicationObj.DoseUnit,
             Route: $scope.IntraOpMedicationObj.Route,
             Frequency: $scope.IntraOpMedicationObj.Frequency,

             ActionId: $scope.IntraOpMedicationObj.ActionId,
             DoseId: $scope.IntraOpMedicationObj.DoseId,
             DoseUnitId: $scope.IntraOpMedicationObj.DoseUnitId,
             RouteId: $scope.IntraOpMedicationObj.RouteId,
             FrequencyId: $scope.IntraOpMedicationObj.FrequencyId,
             OrderDescription: $scope.IntraOpMedicationObj.OrderDescription,
             MedicationNotes: $scope.IntraOpMedicationObj.MedicationNotes,
             maxDose: $scope.IntraOpMedicationObj.maxDose,

             IsChecked: false,
             IsDilationMed: false,
             IsIntraAnesthesiaMed: false,
             IsIntraMed: true,
             IsPreOPMed: false,
             MedicationDosage: '',
             DropTimings: $scope.IntraOpMedicationObj.DropTimings || [],
             TypeId: 4,
             DeleteInd: 'N',
             OrderTypeId: OrderTypeId,
             OrderTypeName: OrderTypeName,
         };

         let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
             return oitem.MedTypeId === 4 && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
         }) || [];

         if ($scope.IntraOpMedicationObj.EditIndex >= 0) {
             // Edit mode
             if (templist.length > 0 && templist[0].IntraOpMedications.length > $scope.IntraOpMedicationObj.EditIndex) {
                 templist[0].IntraOpMedications[$scope.IntraOpMedicationObj.EditIndex] = obj;
                 alertify.success('Updated successfully');
             }
         } else {
             // Add new medication
             if (templist.length > 0) {
                 templist[0].IntraOpMedications.push(obj);
             } else {
                 let newObj = {
                     UserOrderId: 0,
                     UserId: $scope.UserId,
                     DeleteInd: 'N',
                     ReviewedBy: null,
                     IsOrderReviewed: false,
                     ReviewedByDateTime: null,
                     ReviewedByPassword: '',
                     UserType: 'Nurse',
                     ScreenType: 'Intra-OP',
                     ScreenTypeId: 5,
                     MedTypeId: 4,
                     MedTypeName: 'Intra Medication',
                     IntraOpMedications: [obj],
                     GeneralOrders: [],
                     OrderTypeId: OrderTypeId || 0,
                     OrderTypeName: OrderTypeName || '',
                 };
                 $scope.IntraOpObj.OrderDetails.push(newObj);
             }
             alertify.success('Added successfully');
         }

         let activeOrders = ($scope.IntraOpObj.OrderDetails || [])
             .filter(order => order.DeleteInd === 'N' && order.MedTypeId == 4);

         let isColumnTrue = activeOrders.some(order =>
             (order.IntraOpMedications &&
                 order.IntraOpMedications.some(item => item.DeleteInd === 'N'))
         );

         $scope.IntraOpObj.DisableIntraopSurgeonCheck = isColumnTrue;
         $scope.IntraOpObj.IsIntraOpSurgeonOrdersTimeAdded = !isColumnTrue;

         // Clear the form after add/update
         $scope.IntraOpMedicationObj = angular.copy($scope.GetIntraOpMedicationObj());
     };


     $scope.editIntraOpMedication = function (item, index, Id) {
         if (Id == 3) {
             $scope.IntraOpMedicationObj.MedicineObject = {
                 MedicationName: item.MedicationName,
                 MedicineId: item.MedicineId,
                 OrganizationPrescriptionId: item.OrganizationPrescriptionId,
                 Strength: item.Strength || '',
                 IsFrequent: item.IsFrequent || 'N',
                 AscMedicationId: item.AscMedicationId || 0
             };

             $scope.IntraOpMedicationObj.MedicationName = item.MedicationName;
             $scope.IntraOpMedicationObj.Action = item.Action;
             $scope.IntraOpMedicationObj.Dose = item.Dose;
             $scope.IntraOpMedicationObj.DoseUnit = item.DoseUnit;
             $scope.IntraOpMedicationObj.Route = item.Route;
             $scope.IntraOpMedicationObj.Frequency = item.Frequency;

             $scope.IntraOpMedicationObj.ActionId = item.ActionId;
             $scope.IntraOpMedicationObj.DoseId = item.DoseId;
             $scope.IntraOpMedicationObj.DoseUnitId = item.DoseUnitId;
             $scope.IntraOpMedicationObj.RouteId = item.RouteId;
             $scope.IntraOpMedicationObj.FrequencyId = item.FrequencyId;

             $scope.IntraOpMedicationObj.OrderDescription = item.OrderDescription;
             $scope.IntraOpMedicationObj.MedicationNotes = item.MedicationNotes;

             $scope.IntraOpMedicationObj.DropTimings = item.DropTimings || [];

             $scope.IntraOpMedicationObj.OrderTypeId = item.OrderTypeId;
             $scope.IntraOpMedicationObj.OrderTypeName = item.OrderTypeName;
             $scope.IntraOpMedicationObj.AscMedicationId = item.AscMedicationId;
             
             $scope.IntraOpMedicationObj.maxDose = item.maxDose;

             $scope.IntraOpMedicationObj.EditIndex = index;

             $scope.IntraOpMedicationObj.IsmedSearchDisabled = true;
             $scope.IntraOpObj.OrderType = 'Medications';
         } else if (Id == 4) {
             $scope.AnesthesiaMedicationObj.MedicineObject = {
                 MedicationName: item.MedicationName,
                 MedicineId: item.MedicineId,
                 OrganizationPrescriptionId: item.OrganizationPrescriptionId,
                 Strength: item.Strength || '',
                 IsFrequent: item.IsFrequent || 'N',
                 AscMedicationId: item.AscMedicationId || 0
             };

             $scope.AnesthesiaMedicationObj.MedicationName = item.MedicationName;
             $scope.AnesthesiaMedicationObj.Action = item.Action;
             $scope.AnesthesiaMedicationObj.Dose = item.Dose;
             $scope.AnesthesiaMedicationObj.DoseUnit = item.DoseUnit;
             $scope.AnesthesiaMedicationObj.Route = item.Route;
             $scope.AnesthesiaMedicationObj.Frequency = item.Frequency;

             $scope.AnesthesiaMedicationObj.ActionId = item.ActionId;
             $scope.AnesthesiaMedicationObj.DoseId = item.DoseId;
             $scope.AnesthesiaMedicationObj.DoseUnitId = item.DoseUnitId;
             $scope.AnesthesiaMedicationObj.RouteId = item.RouteId;
             $scope.AnesthesiaMedicationObj.FrequencyId = item.FrequencyId;

             $scope.AnesthesiaMedicationObj.OrderDescription = item.OrderDescription;
             $scope.AnesthesiaMedicationObj.MedicationNotes = item.MedicationNotes;
             $scope.AnesthesiaMedicationObj.maxDose = item.maxDose;
             $scope.AnesthesiaMedicationObj.DropTimings = item.DropTimings || [];


             $scope.AnesthesiaMedicationObj.OrderTypeId = item.OrderTypeId;
             $scope.AnesthesiaMedicationObj.OrderTypeName = item.OrderTypeName;
             $scope.AnesthesiaMedicationObj.AscMedicationId = item.AscMedicationId;

             $scope.AnesthesiaMedicationObj.EditIndex = index;
             $scope.AnesthesiaMedicationObj.IsmedSearchDisabled = true;
             $scope.IntraOpObj.OrderType = 'Medications';
         }
     };

     // Intra Op Anesthesia Medication 
     $scope.SelectAnesthesiaMedicationItemsFrequently = function (item, type) {
         //let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, { "MedTypeId": 3, 'IsOrderReviewed': false, 'DeleteInd': 'N' }, true);
         let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
             return oitem.MedTypeId === 3 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
         }) || [];
         let i = 0;
         angular.forEach($scope.IntraOpObj.OrderDetails, function (mitem) {
             if (mitem.MedTypeId == 3) {
                 angular.forEach(mitem.IntraOpMedications, function (Aitem) {
                     if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
                         i++;
                     }
                 });
             }
         });

         if (i > 0) {
             alertify.error('You have already entered this Medication');
             $scope.IntraOpMedicationObj.MedicineObject = "";
             return false;
         }
         // let templist = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": $scope.UserId, "MedTypeId": 5, 'IsOrderReviewed': false }, true);

         if (templist.length > 0) {

             let List1 = $filter("filter")(templist[0].IntraOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
             let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
             if (List.length > 0) {
                 alertify.error("Medicine name already added!");
                 $scope.IntraOpMedicationObj.MedicineObject = '';
                 return false;
             }
             let GivenBy = null;
             let loggedUser = $filter('filter')($scope.NurseAnesthetistArray, { 'DoctorID': $scope.UserId }, true) || [];
             if (loggedUser.length > 0) {
                 GivenBy = loggedUser[0].DoctorID;
             }

             if (type == 'Frequently') {
                 var obj = {
                     "AscMedicationId": 0,
                     "OrganizationMedicationId": item.OrganizationPrescriptionId,
                     "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                     "ParentOrganizationId": $scope.ParenthospitalId,
                     "ASCOrganizationMedicationId": 0,
                     "Strength": item.Strength || '',
                     "IsFrequent": item.IsFrequent || 'N',
                     "MedicineId": item.MedicineId,
                     "MedicationName": item.MedicationName,
                     "IsChecked": false,
                     "IsDilationMed": false,
                     "IsIntraAnesthesiaMed": false,
                     "IsIntraMed": false,
                     "IsPreOPMed": false,
                     "MedicationDosage": "",
                     "DropTimings": [],
                     "TypeId": 4,
                     "DeleteInd": "N",
                     "Action": item.Action,
                     "Dose": item.Dose,
                     "DoseUnit": item.DoseUnit,
                     "Route": item.Route,
                     "Frequency": item.Frequency,
                     "ActionId": item.ActionId,
                     "DoseId": item.DoseId,
                     "DoseUnitId": item.DoseUnitId,
                     "RouteId": item.RouteId,
                     "FrequencyId": item.FrequencyId,
                     "OrderDescription": item.OrderDescription,
                     "MedicationNotes": item.MedicationNotes || "",
                     "maxDose": item.maxDose,
                     "OrderTypeId": OrderTypeId,
                     "OrderTypeName": OrderTypeName
                 }
                 templist[0].IntraOpMedications.push(obj);
                 $scope.AnesthesiaMedicationObj.MedicineObject = "";
             } else {
                 var obj = {
                     "AscMedicationId": 0,
                     "OrganizationMedicationId": item.OrganizationPrescriptionId,
                     "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                     "ParentOrganizationId": $scope.ParenthospitalId,
                     "ASCOrganizationMedicationId": 0,
                     "Strength": item.Strength || '',
                     "IsFrequent": item.IsFrequent || 'N',
                     "MedicineId": item.MedicineId,
                     "MedicationName": item.MedicineName,
                     "IsChecked": false,
                     "IsDilationMed": false,
                     "IsIntraAnesthesiaMed": false,
                     "IsIntraMed": false,
                     "IsPreOPMed": false,
                     "MedicationDosage": "",
                     "DropTimings": [],
                     "TypeId": 5,
                     "DeleteInd": "N",
                     "Action": item.Action,
                     "Dose": item.Dose,
                     "DoseUnit": item.DoseUnit,
                     "Route": item.Route,
                     "Frequency": item.Frequency,
                     "ActionId": item.ActionId,
                     "DoseId": item.DoseId,
                     "DoseUnitId": item.DoseUnitId,
                     "RouteId": item.RouteId,
                     "FrequencyId": item.FrequencyId,
                     "OrderDescription": item.OrderDescription,
                     "MedicationNotes": item.MedicationNotes || "",
                     "maxDose": item.maxDose,
                     "OrderTypeId": OrderTypeId,
                     "OrderTypeName": OrderTypeName
                 }
                 templist[0].IntraOpMedications.push(obj);
                 $scope.AnesthesiaMedicationObj.MedicineObject = "";
             }
         } else {

             //let templist2 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
             let templist2 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                 return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
             }) || [];
             if (templist2.length > 0) {
                 templist2[0].MedTypeId = 3;
                 templist2[0].MedTypeName = 'IntraAnesthesia Medications';
             } else {

                 //let templist3 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 3, 'DeleteInd': 'N' }, true) || [];
                 let templist3 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                     return oitem.MedTypeId === 3 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                 }) || [];
                 if (templist3.length > 0) {

                 } else {
                     var obj = {
                         "UserOrderId": 0,
                         "UserId": $scope.UserId,
                         "DeleteInd": "N",
                         "IsOrderReviewed": false,
                         "ReviewedByPassword": '',
                         "ReviewedBy": null,
                         "UserType": "Anesthesia",
                         "ScreenType": "Intra-OP",
                         "ScreenTypeId": 5,
                         "MedTypeId": 3,
                         "MedTypeName": 'IntraAnesthesia Medications',
                         "IntraOpMedications": [],
                         "GeneralOrders": [],
                         "OrderTypeId": OrderTypeId || 0,
                         "OrderTypeName": OrderTypeName || '',
                     }
                     $scope.IntraOpObj.OrderDetails.push(obj);
                 }

             }
             //let templist1 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 3, 'DeleteInd': 'N' }, true) || [];
             let templist1 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                 return oitem.MedTypeId === 3 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
             }) || [];
             if (templist1.length > 0) {
                 let List1 = $filter("filter")(templist1[0].IntraOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                 let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                 if (List.length > 0) {
                     alertify.error("Medicine name already added!");
                     $scope.IntraOpMedicationObj.MedicineObject = "";
                     return false;
                 }
                 let GivenBy = null;
                 let loggedUser = $filter('filter')($scope.NurseAnesthetistArray, { 'DoctorID': $scope.UserId }, true) || [];
                 if (loggedUser.length > 0) {
                     GivenBy = loggedUser[0].DoctorID;
                 }

                 if (type == 'Frequently') {
                     var obj = {
                         "AscMedicationId": 0,
                         "OrganizationMedicationId": item.OrganizationPrescriptionId,
                         "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                         "ParentOrganizationId": $scope.ParenthospitalId,
                         "ASCOrganizationMedicationId": 0,
                         "Strength": item.Strength || '',
                         "IsFrequent": item.IsFrequent || 'N',
                         "MedicineId": item.MedicineId,
                         "MedicationName": item.MedicationName,
                         "IsChecked": false,
                         "IsDilationMed": false,
                         "IsIntraAnesthesiaMed": false,
                         "IsIntraMed": false,
                         "IsPreOPMed": false,
                         "MedicationDosage": "",
                         "DropTimings": [],
                         "TypeId": 4,
                         "DeleteInd": "N",
                         "Action": item.Action,
                         "Dose": item.Dose,
                         "DoseUnit": item.DoseUnit,
                         "Route": item.Route,
                         "Frequency": item.Frequency,
                         "ActionId": item.ActionId,
                         "DoseId": item.DoseId,
                         "DoseUnitId": item.DoseUnitId,
                         "RouteId": item.RouteId,
                         "FrequencyId": item.FrequencyId,
                         "OrderDescription": item.OrderDescription,
                         "MedicationNotes": item.MedicationNotes || "",
                         "maxDose": item.maxDose,
                         "OrderTypeId": OrderTypeId,
                         "OrderTypeName": OrderTypeName
                     }
                     templist1[0].IntraOpMedications.push(obj);
                     $scope.AnesthesiaMedicationObj.MedicineObject = "";
                 } else {
                     var obj = {
                         "AscMedicationId": 0,
                         "OrganizationMedicationId": item.OrganizationPrescriptionId,
                         "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                         "ParentOrganizationId": $scope.ParenthospitalId,
                         "ASCOrganizationMedicationId": 0,
                         "Strength": item.Strength || '',
                         "IsFrequent": item.IsFrequent || 'N',
                         "MedicineId": item.MedicineId,
                         "MedicationName": item.MedicineName,
                         "IsChecked": false,
                         "IsDilationMed": false,
                         "IsIntraAnesthesiaMed": false,
                         "IsIntraMed": false,
                         "IsPreOPMed": false,
                         "MedicationDosage": "",
                         "DropTimings": [],
                         "TypeId": 4,
                         "DeleteInd": "N",
                         "Action": item.Action,
                         "Dose": item.Dose,
                         "DoseUnit": item.DoseUnit,
                         "Route": item.Route,
                         "Frequency": item.Frequency,
                         "ActionId": item.ActionId,
                         "DoseId": item.DoseId,
                         "DoseUnitId": item.DoseUnitId,
                         "RouteId": item.RouteId,
                         "FrequencyId": item.FrequencyId,
                         "OrderDescription": item.OrderDescription,
                         "MedicationNotes": item.MedicationNotes || "",
                         "maxDose": item.maxDose,
                         "OrderTypeId": OrderTypeId,
                         "OrderTypeName": OrderTypeName
                     }
                     templist1[0].IntraOpMedications.push(obj);
                     $scope.AnesthesiaMedicationObj.MedicineObject = "";
                 }

             }
         }

         let activeOrders = ($scope.IntraOpObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 3);

         let isColumnTrue = activeOrders.some(order =>
             (order.IntraOpMedications &&
                 order.IntraOpMedications.some(item => item.DeleteInd === 'N'))
         );

         $scope.IntraOpObj.DisableIntraopAnesthesiaCheck = isColumnTrue;
         $scope.IntraOpObj.IsIntraOpAnesthesiaOrdersTimeAdded = !isColumnTrue;
     }

     $scope.AddIntraopAnesthesiaMedication = function () {
         $scope.IsIntraOpAnesthesiaOrdersCheckBox = true;
         let item = $scope.AnesthesiaMedicationObj.MedicineObject;

         if (!item || !item.OrganizationPrescriptionId) {
             alertify.error('Please select a Medicine');
             return false;
         }

         if ($scope.AnesthesiaMedicationObj.OrderTypeName == "" && $scope.AnesthesiaMedicationObj.OrderTypeId == null) {
             OrderTypeId = OrderTypeId;
             OrderTypeName = OrderTypeName;
         } else {
             OrderTypeId = $scope.AnesthesiaMedicationObj.OrderTypeId;
             OrderTypeName = $scope.AnesthesiaMedicationObj.OrderTypeName;
         }

         let obj = {
             "AscMedicationId": item.AscMedicationId || 0,
             "OrganizationMedicationId": item.OrganizationPrescriptionId,
             "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
             "ParentOrganizationId": $scope.ParenthospitalId,
             "ASCOrganizationMedicationId": 0,
             "Strength": item.Strength || '',
             "IsFrequent": item.IsFrequent || 'N',
             "MedicineId": item.MedicineId,
             "MedicationName": $scope.AnesthesiaMedicationObj.MedicationName,

             "Action": $scope.AnesthesiaMedicationObj.Action,
             "Dose": $scope.AnesthesiaMedicationObj.Dose,
             "DoseUnit": $scope.AnesthesiaMedicationObj.DoseUnit,
             "Frequency": $scope.AnesthesiaMedicationObj.Frequency,
             "Route": $scope.AnesthesiaMedicationObj.Route,

             "ActionId": $scope.AnesthesiaMedicationObj.ActionId,
             "DoseId": $scope.AnesthesiaMedicationObj.DoseId,
             "DoseUnitId": $scope.AnesthesiaMedicationObj.DoseUnitId,
             "RouteId": $scope.AnesthesiaMedicationObj.RouteId,
             "FrequencyId": $scope.AnesthesiaMedicationObj.FrequencyId,

             "OrderDescription": $scope.AnesthesiaMedicationObj.OrderDescription,
             "MedicationNotes": $scope.AnesthesiaMedicationObj.MedicationNotes,
             "maxDose": $scope.AnesthesiaMedicationObj.maxDose,

             "IsChecked": false,
             "IsDilationMed": false,
             "IsIntraAnesthesiaMed": true,
             "IsIntraMed": false,
             "IsPreOPMed": false,

             "MedicationDosage": '',
             "DropTimings": $scope.AnesthesiaMedicationObj.DropTimings || [],
             "TypeId": 4,
             "DeleteInd": 'N',
             "OrderTypeId": OrderTypeId,
             "OrderTypeName": OrderTypeName,
         };

         let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
             return oitem.MedTypeId === 3 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
         }) || [];

         if ($scope.AnesthesiaMedicationObj.EditIndex >= 0) {
                    
             if (templist.length > 0 && templist[0].IntraOpMedications.length > $scope.AnesthesiaMedicationObj.EditIndex) {
                 templist[0].IntraOpMedications[$scope.AnesthesiaMedicationObj.EditIndex] = obj;
                 alertify.success('Updated successfully');
             }


         } else {
             if (templist.length > 0) {
                 templist[0].IntraOpMedications.push(obj);
             } else {
                 let newObj = {
                     "UserOrderId": 0,
                     "UserId": $scope.UserId,
                     "DeleteInd": 'N',
                     "ReviewedBy": null,
                     "IsOrderReviewed": false,
                     "ReviewedByDateTime": null,
                     "ReviewedByPassword": '',
                     "UserType": "Anesthesia",
                     "ScreenType": "Intra-OP",
                     "ScreenTypeId": 5,
                     "MedTypeId": 3,
                     "MedTypeName": 'IntraAnesthesia Medications',
                    
                     "IntraOpMedications": [obj],
                     "GeneralOrders": [],
                     "OrderTypeId": OrderTypeId || 0,
                     "OrderTypeName": OrderTypeName || ''
                 };
                 $scope.IntraOpObj.OrderDetails.push(newObj);
             }
             alertify.success('Added successfully');
         }

         let activeOrders = ($scope.IntraOpObj.OrderDetails || [])
             .filter(order => order.DeleteInd === 'N' && order.MedTypeId == 3);

         let isColumnTrue = activeOrders.some(order =>
             (order.IntraOpMedications &&
                 order.IntraOpMedications.some(item => item.DeleteInd === 'N'))
         );

         $scope.IntraOpObj.DisableIntraopAnesthesiaCheck = isColumnTrue;
         $scope.IntraOpObj.IsIntraOpAnesthesiaOrdersTimeAdded = !isColumnTrue;

         $scope.AnesthesiaMedicationObj = angular.copy($scope.GetAnesthesiaMedicationObj());
     };


     $scope.SelectAnesthesiaMedicationItems = function (item, type) {
         let i = 0;

         angular.forEach($scope.IntraOpObj.OrderDetails, function (mitem) {
             angular.forEach(mitem.IntraOpMedications, function (Aitem) {
                 if (
                     Aitem.MedicineId === item.MedicineId &&
                     Aitem.DeleteInd === 'N' &&
                     Aitem.IsIntraAnesthesiaMed === true
                 ) {
                     i++;
                 }
             });
         });

         if (i > 0) {
             alertify.error('You have already entered this Anesthesia Medication');
             $scope.AnesthesiaMedicationObj.MedicineObject = {};
             $scope.AnesthesiaMedicationObj.MedicationName = '';
             return false;
         }

         $scope.AnesthesiaMedicationObj.MedicineObject = item;
         $scope.AnesthesiaMedicationObj.MedicationName = item.MedicineName;

         if ($scope.AnesthesiaMedicationObj.AscMedicationId != 0) {
             item.AscMedicationId = $scope.AnesthesiaMedicationObj.AscMedicationId;
         }

        
         $scope.updateOrderDescription(3);
     };

     // 

     $scope.SelectPostOpMedicationItemsFrequent1 = function (item, type) {
         //let templist = $filter("filter")($scope.PostOpObj.OrderDetails, { "MedTypeId": 5, 'IsOrderReviewed': false, 'DeleteInd': 'N' }, true);
         let templist = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
             return oitem.MedTypeId === 5 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
         }) || [];
         let i = 0;
         angular.forEach($scope.PostOpObj.OrderDetails, function (mitem) {
             if (mitem.MedTypeId == 5) {
                 angular.forEach(mitem.PostOpMedications, function (Aitem) {
                     if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
                         i++;
                     }
                 });
             }
         });

         if (i > 0) {
             alertify.error('You have already entered this Medication');
             $scope.PostOpMedicationObj.MedicineObject = "";
             return false;
         }
         // let templist = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": $scope.UserId, "MedTypeId": 5, 'IsOrderReviewed': false }, true);

         if (templist.length > 0) {

             let List1 = $filter("filter")(templist[0].PostOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
             let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
             if (List.length > 0) {
                 alertify.error("Medicine name already added!");
                 $scope.PostOpMedicationObj.MedicineObject = '';
                 return false;
             }
             let GivenBy = null;
             let loggedUser = $filter('filter')($scope.NurseAnesthetistArray, { 'DoctorID': $scope.UserId }, true) || [];
             if (loggedUser.length > 0) {
                 GivenBy = loggedUser[0].DoctorID;
             }

             if (type == 'Frequently') {
                 var obj = {
                     "AscMedicationId": 0,
                     "OrganizationMedicationId": item.OrganizationPrescriptionId,
                     "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                     "ParentOrganizationId": $scope.ParenthospitalId,
                     "ASCOrganizationMedicationId": 0,
                     "Strength": item.Strength || '',
                     "IsFrequent": item.IsFrequent || 'N',
                     "MedicineId": item.MedicineId,
                     "MedicationName": item.MedicationName,
                     "IsChecked": false,
                     "IsDilationMed": false,
                     "IsIntraAnesthesiaMed": false,
                     "IsIntraMed": false,
                     "IsPreOPMed": false,
                     "MedicationDosage": "",
                     "DropTimings": [],
                     "TypeId": 4,
                     "DeleteInd": "N",
                     "Action": item.Action,
                     "Dose": item.Dose,
                     "DoseUnit": item.DoseUnit,
                     "Route": item.Route,
                     "Frequency": item.Frequency,
                     "ActionId": item.ActionId,
                     "DoseId": item.DoseId,
                     "DoseUnitId": item.DoseUnitId,
                     "RouteId": item.RouteId,
                     "FrequencyId": item.FrequencyId,
                     "OrderDescription": item.OrderDescription,
                     "MedicationNotes": item.MedicationNotes || "",
                     "maxDose": item.maxDose,
                     "OrderTypeId": OrderTypeId,
                     "OrderTypeName": OrderTypeName
                 }
                 templist[0].PostOpMedications.push(obj);
                 $scope.PostOpMedicationObj.MedicineObject = "";
             } else {
                 var obj = {
                     "AscMedicationId": 0,
                     "OrganizationMedicationId": item.OrganizationPrescriptionId,
                     "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                     "ParentOrganizationId": $scope.ParenthospitalId,
                     "ASCOrganizationMedicationId": 0,
                     "Strength": item.Strength || '',
                     "IsFrequent": item.IsFrequent || 'N',
                     "MedicineId": item.MedicineId,
                     "MedicationName": item.MedicineName,
                     "IsChecked": false,
                     "IsDilationMed": false,
                     "IsIntraAnesthesiaMed": false,
                     "IsIntraMed": false,
                     "IsPreOPMed": false,
                     "MedicationDosage": "",
                     "DropTimings": [],
                     "TypeId": 4,
                     "DeleteInd": "N",
                     "Action": item.Action,
                     "Dose": item.Dose,
                     "DoseUnit": item.DoseUnit,
                     "Route": item.Route,
                     "Frequency": item.Frequency,
                     "ActionId": item.ActionId,
                     "DoseId": item.DoseId,
                     "DoseUnitId": item.DoseUnitId,
                     "RouteId": item.RouteId,
                     "FrequencyId": item.FrequencyId,
                     "OrderDescription": item.OrderDescription,
                     "MedicationNotes": item.MedicationNotes || "",
                     "maxDose": item.maxDose,
                     "OrderTypeId": OrderTypeId,
                     "OrderTypeName": OrderTypeName
                 }
                 templist[0].PostOpMedications.push(obj);
                 $scope.PostOpMedicationObj.MedicineObject = "";
             }
         } else {

             //let templist2 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
             let templist2 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                 return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
             }) || [];
             if (templist2.length > 0) {
                 templist2[0].MedTypeId = 5;
                 templist2[0].MedTypeName = 'PostOp Medication';
             } else {

                 //let templist3 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 5, 'DeleteInd': 'N'}, true) || [];
                 let templist3 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                     return oitem.MedTypeId === 5 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                 }) || [];
                 if (templist3.length > 0) {

                 } else {
                     var obj = {
                         "UserOrderId": 0,
                         "UserId": $scope.UserId,
                         "DeleteInd": "N",
                         "IsOrderReviewed": false,
                         "ReviewedByPassword": '',
                         "ReviewedBy": null,
                         "UserType": "Nurse",
                         "ScreenType": "PostOp",
                         "ScreenTypeId": 6,
                         "MedTypeId": 5,
                         "MedTypeName": 'PostOp Medication',
                         "PostOpMedications": [],
                         "GeneralOrders": [],
                         "OrderTypeId": OrderTypeId || 0,
                         "OrderTypeName": OrderTypeName || '',
                     }
                     $scope.PostOpObj.OrderDetails.push(obj);
                 }

             }
             //let templist1 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 5, 'DeleteInd': 'N' }, true) || [];
             let templist1 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                 return oitem.MedTypeId === 5 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
             }) || [];
             if (templist1.length > 0) {
                 let List1 = $filter("filter")(templist1[0].PostOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                 let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                 if (List.length > 0) {
                     alertify.error("Medicine name already added!");
                     $scope.PostOpMedicationObj.MedicineObject = "";
                     return false;
                 }
                 let GivenBy = null;
                 let loggedUser = $filter('filter')($scope.NurseAnesthetistArray, { 'DoctorID': $scope.UserId }, true) || [];
                 if (loggedUser.length > 0) {
                     GivenBy = loggedUser[0].DoctorID;
                 }

                 if (type == 'Frequently') {
                     var obj = {
                         "AscMedicationId": 0,
                         "OrganizationMedicationId": item.OrganizationPrescriptionId,
                         "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                         "ParentOrganizationId": $scope.ParenthospitalId,
                         "ASCOrganizationMedicationId": 0,
                         "Strength": item.Strength || '',
                         "IsFrequent": item.IsFrequent || 'N',
                         "MedicineId": item.MedicineId,
                         "MedicationName": item.MedicationName,
                         "IsChecked": false,
                         "IsDilationMed": false,
                         "IsIntraAnesthesiaMed": false,
                         "IsIntraMed": false,
                         "IsPreOPMed": false,
                         "MedicationDosage": "",
                         "DropTimings": [],
                         "TypeId": 4,
                         "DeleteInd": "N",
                         "Action": item.Action,
                         "Dose": item.Dose,
                         "DoseUnit": item.DoseUnit,
                         "Route": item.Route,
                         "Frequency": item.Frequency,
                         "ActionId": item.ActionId,
                         "DoseId": item.DoseId,
                         "DoseUnitId": item.DoseUnitId,
                         "RouteId": item.RouteId,
                         "FrequencyId": item.FrequencyId,
                         "OrderDescription": item.OrderDescription,
                         "MedicationNotes": item.MedicationNotes || "",
                         "maxDose": item.maxDose,
                         "OrderTypeId": OrderTypeId,
                         "OrderTypeName": OrderTypeName
                     }
                     templist1[0].PostOpMedications.push(obj);
                     $scope.PostOpMedicationObj.MedicineObject = "";
                 } else {
                     var obj = {
                         "AscMedicationId": 0,
                         "OrganizationMedicationId": item.OrganizationPrescriptionId,
                         "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                         "ParentOrganizationId": $scope.ParenthospitalId,
                         "ASCOrganizationMedicationId": 0,
                         "Strength": item.Strength || '',
                         "IsFrequent": item.IsFrequent || 'N',
                         "MedicineId": item.MedicineId,
                         "MedicationName": item.MedicineName,
                         "IsChecked": false,
                         "IsDilationMed": false,
                         "IsIntraAnesthesiaMed": false,
                         "IsIntraMed": false,
                         "IsPreOPMed": false,
                         "MedicationDosage": "",
                         "DropTimings": [],
                         "TypeId": 4,
                         "DeleteInd": "N",
                         "Action": item.Action,
                         "Dose": item.Dose,
                         "DoseUnit": item.DoseUnit,
                         "Route": item.Route,
                         "Frequency": item.Frequency,
                         "ActionId": item.ActionId,
                         "DoseId": item.DoseId,
                         "DoseUnitId": item.DoseUnitId,
                         "RouteId": item.RouteId,
                         "FrequencyId": item.FrequencyId,
                         "OrderDescription": item.OrderDescription,
                         "MedicationNotes": item.MedicationNotes || "",
                         "maxDose": item.maxDose,
                         "OrderTypeId": OrderTypeId,
                         "OrderTypeName": OrderTypeName
                     }
                     templist1[0].PostOpMedications.push(obj);
                     $scope.PostOpMedicationObj.MedicineObject = "";
                 }

             }
         }

         let activeOrders = ($scope.PostOpObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 5);

         let isColumnTrue = activeOrders.some(order =>
             (order.PostOpMedications &&
                 order.PostOpMedications.some(item => item.DeleteInd === 'N'))
         );

         $scope.PostOpObj.DisablePostOpSurgeonCheck = isColumnTrue;
         $scope.PostOpObj.IsPostOpSurgeonOrdersTimeAdded = !isColumnTrue;
     }
     $scope.SelectPostOpAnesthesiaMedicationsFrequent1 = function (item, type) {
         //let templist = $filter("filter")($scope.PostOpObj.OrderDetails, { "MedTypeId": 8, 'IsOrderReviewed': false,'DeleteInd': 'N' }, true);
         let templist = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
             return oitem.MedTypeId === 8 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
         }) || [];
         let i = 0;
         angular.forEach($scope.PostOpObj.OrderDetails, function (mitem) {
             if (mitem.MedTypeId == 8) {
                 angular.forEach(mitem.PostOpMedications, function (Aitem) {
                     if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
                         i++;
                     }
                 });
             }
         });

         if (i > 0) {
             alertify.error('You have already entered this Medication');
             $scope.PostOpMedicationObj.MedicineObject = "";
             return false;
         }

         if (templist.length > 0) {

             let List1 = $filter("filter")(templist[0].PostOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
             let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
             if (List.length > 0) {
                 alertify.error("Medicine name already added!");
                 $scope.PostOpMedicationObj.MedicineObject = '';
                 return false;
             }
             let GivenBy = null;
             let loggedUser = $filter('filter')($scope.NurseAnesthetistArray, { 'DoctorID': $scope.UserId }, true) || [];
             if (loggedUser.length > 0) {
                 GivenBy = loggedUser[0].DoctorID;
             }

             if (type == 'Frequently') {
                 var obj = {
                     "AscMedicationId": 0,
                     "OrganizationMedicationId": item.OrganizationPrescriptionId,
                     "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                     "ParentOrganizationId": $scope.ParenthospitalId,
                     "ASCOrganizationMedicationId": 0,
                     "Strength": item.Strength || '',
                     "IsFrequent": item.IsFrequent || 'N',
                     "MedicineId": item.MedicineId,
                     "MedicationName": item.MedicationName,
                     "IsChecked": false,
                     "IsDilationMed": false,
                     "IsIntraAnesthesiaMed": false,
                     "IsIntraMed": false,
                     "IsPreOPMed": false,
                     "MedicationDosage": "",
                     "DropTimings": [],
                     "TypeId": 4,
                     "DeleteInd": "N",
                     "Action": item.Action,
                     "Dose": item.Dose,
                     "DoseUnit": item.DoseUnit,
                     "Route": item.Route,
                     "Frequency": item.Frequency,
                     "ActionId": item.ActionId,
                     "DoseId": item.DoseId,
                     "DoseUnitId": item.DoseUnitId,
                     "RouteId": item.RouteId,
                     "FrequencyId": item.FrequencyId,
                     "OrderDescription": item.OrderDescription,
                     "MedicationNotes": item.MedicationNotes || "",
                     "maxDose": item.maxDose,
                     "OrderTypeId": OrderTypeId,
                     "OrderTypeName": OrderTypeName
                 }
                 templist[0].PostOpMedications.push(obj);
                 $scope.PostOpMedicationObj.MedicineObject = "";
             } else {
                 var obj = {
                     "AscMedicationId": 0,
                     "OrganizationMedicationId": item.OrganizationPrescriptionId,
                     "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                     "ParentOrganizationId": $scope.ParenthospitalId,
                     "ASCOrganizationMedicationId": 0,
                     "Strength": item.Strength || '',
                     "IsFrequent": item.IsFrequent || 'N',
                     "MedicineId": item.MedicineId,
                     "MedicationName": item.MedicineName,
                     "IsChecked": false,
                     "IsDilationMed": false,
                     "IsIntraAnesthesiaMed": false,
                     "IsIntraMed": false,
                     "IsPreOPMed": false,
                     "MedicationDosage": "",
                     "DropTimings": [],
                     "TypeId": 4,
                     "DeleteInd": "N",
                     "Action": item.Action,
                     "Dose": item.Dose,
                     "DoseUnit": item.DoseUnit,
                     "Route": item.Route,
                     "Frequency": item.Frequency,
                     "ActionId": item.ActionId,
                     "DoseId": item.DoseId,
                     "DoseUnitId": item.DoseUnitId,
                     "RouteId": item.RouteId,
                     "FrequencyId": item.FrequencyId,
                     "OrderDescription": item.OrderDescription,
                     "MedicationNotes": item.MedicationNotes || "",
                     "maxDose": item.maxDose,
                     "OrderTypeId": OrderTypeId,
                     "OrderTypeName": OrderTypeName
                 }
                 templist[0].PostOpMedications.push(obj);
                 $scope.PostOpMedicationObj.MedicineObject = "";


             }

         } else {

             //let templist2 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
             let templist2 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                 return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
             }) || [];
             if (templist2.length > 0) {
                 templist2[0].MedTypeId = 8;
                 templist2[0].MedTypeName = 'Postop Anesthesia Medications';
             } else {

                 //let templist3 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 8, 'DeleteInd': 'N' }, true) || [];
                 let templist3 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                     return oitem.MedTypeId === 8 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                 }) || [];
                 if (templist3.length > 0) {

                 } else {
                     var obj = {
                         "UserOrderId": 0,
                         "UserId": $scope.UserId,
                         "DeleteInd": "N",
                         "IsOrderReviewed": false,
                         "ReviewedByPassword": '',
                         "ReviewedBy": null,
                         "UserType": "Anesthesia",
                         "ScreenType": "PostOp",
                         "ScreenTypeId": 6,
                         "MedTypeId": 8,
                         "MedTypeName": 'Postop Anesthesia Medications',
                         "PostOpMedications": [],
                         "GeneralOrders": [],
                         "OrderTypeId": OrderTypeId || 0,
                         "OrderTypeName": OrderTypeName || '',
                     }
                     $scope.PostOpObj.OrderDetails.push(obj);
                 }

             }
             //let templist1 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 8, 'DeleteInd': 'N' }, true) || [];
             let templist1 = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                 return oitem.MedTypeId === 8 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
             }) || [];
             if (templist1.length > 0) {
                 let List1 = $filter("filter")(templist1[0].PostOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                 let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                 if (List.length > 0) {
                     alertify.error("Medicine name already added!");
                     $scope.PostOpMedicationObj.MedicineObject = "";
                     return false;
                 }
                 let GivenBy = null;
                 let loggedUser = $filter('filter')($scope.NurseAnesthetistArray, { 'DoctorID': $scope.UserId }, true) || [];
                 if (loggedUser.length > 0) {
                     GivenBy = loggedUser[0].DoctorID;
                 }

                 if (type == 'Frequently') {
                     var obj = {
                         "AscMedicationId": 0,
                         "OrganizationMedicationId": item.OrganizationPrescriptionId,
                         "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                         "ParentOrganizationId": $scope.ParenthospitalId,
                         "ASCOrganizationMedicationId": 0,
                         "Strength": item.Strength || '',
                         "IsFrequent": item.IsFrequent || 'N',
                         "MedicineId": item.MedicineId,
                         "MedicationName": item.MedicationName,
                         "IsChecked": false,
                         "IsDilationMed": false,
                         "IsIntraAnesthesiaMed": false,
                         "IsIntraMed": false,
                         "IsPreOPMed": false,
                         "MedicationDosage": "",
                         "DropTimings": [],
                         "TypeId": 4,
                         "DeleteInd": "N",
                         "Action": item.Action,
                         "Dose": item.Dose,
                         "DoseUnit": item.DoseUnit,
                         "Route": item.Route,
                         "Frequency": item.Frequency,
                         "ActionId": item.ActionId,
                         "DoseId": item.DoseId,
                         "DoseUnitId": item.DoseUnitId,
                         "RouteId": item.RouteId,
                         "FrequencyId": item.FrequencyId,
                         "OrderDescription": item.OrderDescription,
                         "MedicationNotes": item.MedicationNotes || "",
                         "maxDose": item.maxDose,
                         "OrderTypeId": OrderTypeId,
                         "OrderTypeName": OrderTypeName
                     }
                     templist1[0].PostOpMedications.push(obj);
                     $scope.PostOpMedicationObj.MedicineObject = "";
                 } else {
                     var obj = {
                         "AscMedicationId": 0,
                         "OrganizationMedicationId": item.OrganizationPrescriptionId,
                         "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                         "ParentOrganizationId": $scope.ParenthospitalId,
                         "ASCOrganizationMedicationId": 0,
                         "Strength": item.Strength || '',
                         "IsFrequent": item.IsFrequent || 'N',
                         "MedicineId": item.MedicineId,
                         "MedicationName": item.MedicineName,
                         "IsChecked": false,
                         "IsDilationMed": false,
                         "IsIntraAnesthesiaMed": false,
                         "IsIntraMed": false,
                         "IsPreOPMed": false,
                         "MedicationDosage": "",
                         "DropTimings": [],
                         "TypeId": 4,
                         "DeleteInd": "N",
                         "Action": item.Action,
                         "Dose": item.Dose,
                         "DoseUnit": item.DoseUnit,
                         "Route": item.Route,
                         "Frequency": item.Frequency,
                         "ActionId": item.ActionId,
                         "DoseId": item.DoseId,
                         "DoseUnitId": item.DoseUnitId,
                         "RouteId": item.RouteId,
                         "FrequencyId": item.FrequencyId,
                         "OrderDescription": item.OrderDescription,
                         "MedicationNotes": item.MedicationNotes || "",
                         "maxDose": item.maxDose,
                         "OrderTypeId": OrderTypeId,
                         "OrderTypeName": OrderTypeName
                     }
                     templist1[0].PostOpMedications.push(obj);
                     $scope.PostOpMedicationObj.MedicineObject = "";
                 }

             }
         }


         let activeOrders = ($scope.PostOpObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 8);

         let isColumnTrue = activeOrders.some(order =>
             (order.PostOpMedications &&
                 order.PostOpMedications.some(item => item.DeleteInd === 'N'))
         );

         $scope.PostOpObj.DisablePostOpAnesthesiaCheck = isColumnTrue;
         $scope.PostOpObj.IsPostOpAnesthesiaOrdersTimeAdded = !isColumnTrue;
         // $scope.AllOrdersReviewed();
     }



     $scope.SelectPostMedicationItems1 = function (item, type) {
         let i = 0;

         angular.forEach($scope.PostOpObj.OrderDetails, function (mitem) {
             angular.forEach(mitem.PostOpMedications, function (Aitem) {
                 if (
                     Aitem.MedicineId === item.MedicineId &&
                     Aitem.DeleteInd === 'N' 
                 ) {
                     i++;
                 }
             });
         });

         if (i > 0) {
             alertify.error('You have already entered this Anesthesia Medication');
             $scope.PostOpMedicationObj.MedicineObject = {};
             $scope.PostOpMedicationObj.MedicationName = '';
             return false;
         }

         $scope.PostOpMedicationObj.MedicineObject = item;
         $scope.PostOpMedicationObj.MedicationName = item.MedicineName;


         if ($scope.PostOpMedicationObj.AscMedicationId != 0) {
             item.AscMedicationId = $scope.PostOpMedicationObj.AscMedicationId;
         }

         $scope.updateOrderDescription(5);
     };


     $scope.SelectPostOpAnesthesiaMedications = function (item, type) {
         let i = 0;

         angular.forEach($scope.PostOpObj.OrderDetails, function (mitem) {
             angular.forEach(mitem.PostOpMedications, function (Aitem) {
                 if (
                     Aitem.MedicineId === item.MedicineId &&
                     Aitem.DeleteInd === 'N' 
                 ) {
                     i++;
                 }
             });
         });

         if (i > 0) {
             alertify.error('You have already entered this Anesthesia Medication');
             $scope.PostOpMedicationObj.MedicineObject = {};
             $scope.PostOpMedicationObj.MedicationName = '';
             return false;
         }

         $scope.PostOpMedicationObj.MedicineObject = item;
         $scope.PostOpMedicationObj.MedicationName = item.MedicineName;

         if ($scope.PostOpMedicationObj.AscMedicationId != 0) {
             item.AscMedicationId = $scope.PostOpMedicationObj.AscMedicationId;
         }

         $scope.updateOrderDescription(8);
     };



     $scope.editPostMedication = function (item, index, Id) {

         if (Id == 5) {
             $scope.PostOpMedicationObj.MedicineObject = {
                 MedicationName: item.MedicationName,
                 MedicineId: item.MedicineId,
                 OrganizationPrescriptionId: item.OrganizationPrescriptionId,
                 Strength: item.Strength || '',
                 IsFrequent: item.IsFrequent || 'N',
                 AscMedicationId: item.AscMedicationId || 0
             };

             $scope.PostOpMedicationObj.MedicationName = item.MedicationName;
             $scope.PostOpMedicationObj.Action = item.Action;
             $scope.PostOpMedicationObj.Dose = item.Dose;
             $scope.PostOpMedicationObj.DoseUnit = item.DoseUnit;
             $scope.PostOpMedicationObj.Route = item.Route;
             $scope.PostOpMedicationObj.Frequency = item.Frequency;

             $scope.PostOpMedicationObj.ActionId = item.ActionId;
             $scope.PostOpMedicationObj.DoseId = item.DoseId;
             $scope.PostOpMedicationObj.DoseUnitId = item.DoseUnitId;
             $scope.PostOpMedicationObj.RouteId = item.RouteId;
             $scope.PostOpMedicationObj.FrequencyId = item.FrequencyId;

             $scope.PostOpMedicationObj.OrderDescription = item.OrderDescription;
             $scope.PostOpMedicationObj.MedicationNotes = item.MedicationNotes;
             $scope.PostOpMedicationObj.maxDose = item.maxDose;

             $scope.PostOpMedicationObj.OrderTypeId = item.OrderTypeId;
             $scope.PostOpMedicationObj.OrderTypeName = item.OrderTypeName;
             $scope.PostOpMedicationObj.AscMedicationId = item.AscMedicationId;

             $scope.PostOpMedicationObj.DropTimings = item.DropTimings || [];
             $scope.PostOpMedicationObj.EditIndex = index;
             $scope.PostOpMedicationObj.IsmedSearchDisabled = true;
             $scope.PostOpObj.OrderType = 'Medications';

            
         } else if (Id == 8) {
             $scope.PostOpMedicationObj.MedicineObject = {
                 MedicationName: item.MedicationName,
                 MedicineId: item.MedicineId,
                 OrganizationPrescriptionId: item.OrganizationPrescriptionId,
                 Strength: item.Strength || '',
                 IsFrequent: item.IsFrequent || 'N',
                 AscMedicationId: item.AscMedicationId || 0
             };

             $scope.PostOpMedicationObj.MedicationName = item.MedicationName;
             $scope.PostOpMedicationObj.Action = item.Action;
             $scope.PostOpMedicationObj.Dose = item.Dose;
             $scope.PostOpMedicationObj.DoseUnit = item.DoseUnit;
             $scope.PostOpMedicationObj.Route = item.Route;
             $scope.PostOpMedicationObj.Frequency = item.Frequency;

             $scope.PostOpMedicationObj.ActionId = item.ActionId;
             $scope.PostOpMedicationObj.DoseId = item.DoseId;
             $scope.PostOpMedicationObj.DoseUnitId = item.DoseUnitId;
             $scope.PostOpMedicationObj.RouteId = item.RouteId;
             $scope.PostOpMedicationObj.FrequencyId = item.FrequencyId;

             $scope.PostOpMedicationObj.OrderTypeId = item.OrderTypeId;
             $scope.PostOpMedicationObj.OrderTypeName = item.OrderTypeName;
             $scope.PostOpMedicationObj.AscMedicationId = item.AscMedicationId;

             $scope.PostOpMedicationObj.OrderDescription = item.OrderDescription;
             $scope.PostOpMedicationObj.MedicationNotes = item.MedicationNotes;
             $scope.PostOpMedicationObj.maxDose = item.maxDose;
             $scope.PostOpMedicationObj.DropTimings = item.DropTimings || [];

             $scope.PostOpMedicationObj.EditIndex = index;
             $scope.PostOpMedicationObj.IsmedSearchDisabled = true;
             $scope.PostOpObj.AnesthesiaOrderType = 'AnesthesiaMedications';
         }
     };

     $scope.AddPostopMedication = function () {

         $scope.IsPostOpMedicationSurgeon = true;
         let item = $scope.PostOpMedicationObj.MedicineObject;


         if (!item || !item.OrganizationPrescriptionId) {
             alertify.error('Please select a Medicine');
             return false;
         }


     
         if ($scope.PostOpMedicationObj.OrderTypeName == "" && $scope.PostOpMedicationObj.OrderTypeId == null) {
             OrderTypeId = OrderTypeId;
             OrderTypeName = OrderTypeName;
         } else {
             OrderTypeId = $scope.PostOpMedicationObj.OrderTypeId;
             OrderTypeName = $scope.PostOpMedicationObj.OrderTypeName;
         }


         let obj = {
             "AscMedicationId": item.AscMedicationId || 0,
             "OrganizationMedicationId": item.OrganizationPrescriptionId,
             "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
             "ParentOrganizationId": $scope.ParenthospitalId,
             "ASCOrganizationMedicationId": 0,
             "Strength": item.Strength || '',
             "IsFrequent": item.IsFrequent || 'N',
             "MedicineId": item.MedicineId,
             "MedicationName": $scope.PostOpMedicationObj.MedicationName,

             "Action": $scope.PostOpMedicationObj.Action, 
             "Dose": $scope.PostOpMedicationObj.Dose,
             "DoseUnit": $scope.PostOpMedicationObj.DoseUnit,
             "Route": $scope.PostOpMedicationObj.Route,
             "Frequency": $scope.PostOpMedicationObj.Frequency,

             "ActionId": $scope.PostOpMedicationObj.ActionId,
             "DoseId": $scope.PostOpMedicationObj.DoseId,
             "DoseUnitId": $scope.PostOpMedicationObj.DoseUnitId,
             "RouteId": $scope.PostOpMedicationObj.RouteId,
             "FrequencyId": $scope.PostOpMedicationObj.FrequencyId,
             "OrderDescription": $scope.PostOpMedicationObj.OrderDescription,
             "MedicationNotes": $scope.PostOpMedicationObj.MedicationNotes,
             "maxDose": $scope.PostOpMedicationObj.maxDose,
             "IsChecked": false,
             "IsDilationMed": false,
             "IsIntraAnesthesiaMed": false,
             "IsIntraMed": true,
             "IsPreOPMed": false,
             "MedicationDosage": "",
             "DropTimings": $scope.PostOpMedicationObj.DropTimings || [],
             "TypeId": 4,
             "DeleteInd": "N",
             "OrderTypeId": OrderTypeId,
             "OrderTypeName": OrderTypeName,

         };


         let templist = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
             return oitem.MedTypeId === 5 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId == OrderTypeId;
         }) || [];

         
         if ($scope.PostOpMedicationObj.EditIndex >= 0) {          
             if (templist.length > 0 && templist[0].PostOpMedications.length > $scope.PostOpMedicationObj.EditIndex) {
                 templist[0].PostOpMedications[$scope.PostOpMedicationObj.EditIndex] = obj;
                 alertify.success('Updated successfully');
             }
         } else {
             if (templist.length > 0) {
                 templist[0].PostOpMedications.push(obj);
             } else {

                 let newObj = {
                     "UserOrderId": 0,
                     "UserId": $scope.UserId,
                     "DeleteInd": "N",
                     "ReviewedBy": null,
                     "IsOrderReviewed": false,
                     "ReviewedByDateTime": null,
                     "ReviewedByPassword": '',
                     "UserType": "Nurse",
                     "ScreenType": "PostOp",
                     "ScreenTypeId": 6,
                     "MedTypeId": 5,
                     "MedTypeName":
                         "PostOp Medication",

                     "PostOpMedications": [obj],
                     "GeneralOrders": [],
                     "OrderTypeId": OrderTypeId || 0,
                     "OrderTypeName": OrderTypeName || '',
                 };
                 $scope.PostOpObj.OrderDetails.push(newObj);
             }
             alertify.success('Added successfully');
         }

         let activeOrders = ($scope.PostOpObj.OrderDetails || [])
             .filter(order => order.DeleteInd === 'N' && order.MedTypeId == 5);

         let isColumnTrue = activeOrders.some(order =>
             (order.PostOpMedications &&
                 order.PostOpMedications.some(item => item.DeleteInd === 'N'))
         );

         $scope.PostOpObj.DisablePostOpSurgeonCheck = isColumnTrue;
         $scope.PostOpObj.IsPostOpSurgeonOrdersTimeAdded = !isColumnTrue;

         $scope.PostOpMedicationObj = angular.copy($scope.GetPostOpMedicationObj());

     }



     $scope.AddPostopAnesthesiaMedication = function () {

         $scope.IsPostOpMedicationAnsthesia = true;
         let item = $scope.PostOpMedicationObj.MedicineObject;


         if (!item || !item.OrganizationPrescriptionId) {
             alertify.error('Please select a Medicine');
             return false;
         }


        
         if ($scope.PostOpMedicationObj.OrderTypeName == "" && $scope.PostOpMedicationObj.OrderTypeId == null ) {
             OrderTypeId = OrderTypeId ;
             OrderTypeName = OrderTypeName;
         } else {
             OrderTypeId = $scope.PostOpMedicationObj.OrderTypeId;
             OrderTypeName = $scope.PostOpMedicationObj.OrderTypeName;
         }


         let obj = {
             "AscMedicationId": item.AscMedicationId || 0,
             "OrganizationMedicationId": item.OrganizationPrescriptionId,
             "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
             "ParentOrganizationId": $scope.ParenthospitalId,
             "ASCOrganizationMedicationId": 0,
             "Strength": item.Strength || '',
             "IsFrequent": item.IsFrequent || 'N',
             "MedicineId": item.MedicineId,
             "MedicationName": $scope.PostOpMedicationObj.MedicationName,

             "Action": $scope.PostOpMedicationObj.Action,
             "Dose": $scope.PostOpMedicationObj.Dose,
             "DoseUnit": $scope.PostOpMedicationObj.DoseUnit,
             "Route": $scope.PostOpMedicationObj.Route,
             "Frequency": $scope.PostOpMedicationObj.Frequency,

             "ActionId": $scope.PostOpMedicationObj.ActionId,
             "DoseId": $scope.PostOpMedicationObj.DoseId,
             "DoseUnitId": $scope.PostOpMedicationObj.DoseUnitId,
             "RouteId": $scope.PostOpMedicationObj.RouteId,
             "FrequencyId": $scope.PostOpMedicationObj.FrequencyId,
             "OrderDescription": $scope.PostOpMedicationObj.OrderDescription,
             "MedicationNotes": $scope.PostOpMedicationObj.MedicationNotes,
             "maxDose": $scope.PostOpMedicationObj.maxDose,
             "IsChecked": false,
             "IsDilationMed": false,
             "IsIntraAnesthesiaMed": false,
             "IsIntraMed": true,
             "IsPreOPMed": false,
             "MedicationDosage": "",
             "DropTimings": $scope.PostOpMedicationObj.DropTimings || [],
             "TypeId": 4,
             "DeleteInd": "N",
             "OrderTypeId": OrderTypeId,
             "OrderTypeName": OrderTypeName,

         };


         let templist = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
             return oitem.MedTypeId === 8 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId == OrderTypeId ;
         }) || [];


        


         if ($scope.PostOpMedicationObj.EditIndex >= 0) {
           
             if (templist.length > 0 && templist[0].PostOpMedications.length > $scope.PostOpMedicationObj.EditIndex) {
                 templist[0].PostOpMedications[$scope.PostOpMedicationObj.EditIndex] = obj;
                 alertify.success('Updated successfully');
             }
         } else {
             if (templist.length > 0) {
                 templist[0].PostOpMedications.push(obj);
             } else {

                 let newObj = {
                     "UserOrderId": 0,
                     "UserId": $scope.UserId,
                     "DeleteInd": "N",
                     "ReviewedBy": null,
                     "IsOrderReviewed": false,
                     "ReviewedByDateTime": null,
                     "ReviewedByPassword": '',
                     "UserType": "Nurse",
                     "ScreenType": "PostOp",
                     "ScreenTypeId": 6,
                     "MedTypeId": 8,
                     "MedTypeName": "Postop Anesthesia Medications",

                     "PostOpMedications": [obj],
                     "GeneralOrders": [],
                     "OrderTypeId": OrderTypeId || 0,
                     "OrderTypeName": OrderTypeName || '',
                 };
                 $scope.PostOpObj.OrderDetails.push(newObj);
             }
             alertify.success('Added successfully');
         }

         let activeOrders = ($scope.PostOpObj.OrderDetails || [])
             .filter(order => order.DeleteInd === 'N' && order.MedTypeId == 8);

         let isColumnTrue = activeOrders.some(order =>
             (order.PostOpMedications &&
                 order.PostOpMedications.some(item => item.DeleteInd === 'N'))
         );

         $scope.PostOpObj.DisablePostOpAnesthesiaCheck = isColumnTrue;
         $scope.PostOpObj.IsPostOpAnesthesiaOrdersTimeAdded = !isColumnTrue;

         $scope.PostOpMedicationObj = angular.copy($scope.GetPostOpMedicationObj());
     }





     $scope.onMaxDoseChange = function (id, item, type) {
             
         if (type == 1) {
             $scope.PreOpMedicationObj.maxDose = id;
             $scope.updateOrderDescription(1);
         } else if (type == 2) {
             $scope.DilationMedicationObj.maxDose = id;
             $scope.updateOrderDescription(2);
         } else if (type == 3) {
             $scope.AnesthesiaMedicationObj.maxDose = id;
             $scope.updateOrderDescription(3);
         } else if (type == 4) {
             $scope.IntraOpMedicationObj.maxDose = id;
             $scope.updateOrderDescription(4);
         } else if (type == 5) {
             $scope.PostOpMedicationObj.maxDose = id;
             $scope.updateOrderDescription(5);
         } else if (type == 8) {
             $scope.PostOpMedicationObj.maxDose = id;
             $scope.updateOrderDescription(8);
         }
     };


     $scope.ClearMedicationData = function (type) {

         if (type == 1) {
             $scope.PreOpMedicationObj = angular.copy($scope.GetDilationMedicationObj());
         } else if (type == 2) {
             $scope.DilationMedicationObj = angular.copy($scope.GetDilationMedicationObj());
         }
         else if (type == 3) {
             $scope.AnesthesiaMedicationObj = angular.copy($scope.GetAnesthesiaMedicationObj());
         }
         else if (type == 4) {
             $scope.IntraOpMedicationObj = angular.copy($scope.GetIntraOpMedicationObj());
         }
         else if (type == 5) {
             $scope.PostOpMedicationObj = angular.copy($scope.GetPostOpMedicationObj());
         }
         else if (type == 8) {
             $scope.PostOpMedicationObj = angular.copy($scope.GetPostOpMedicationObj());
         }
     }
     $scope.IsmedicationHide = false;
     $scope.MedicantionHideCcheck = function () {
         $scope.PreOpObj.IsSurgeonOrdersTimeChecked = $scope.PreOpObj.IsSurgeonOrdersTimeChecked;
         $scope.IsmedicationHide = true;
     }

     $scope.ToggleCondition = function (kitem, ivObj) {
         if (!ivObj.ConditionList) {
             ivObj.ConditionList = [];
         }

         let idx = ivObj.ConditionList.findIndex(x => x.Id === kitem.OrganizationPreOpCheckListValueId && x.DeleteInd == 'N');
         if (idx > -1) {

             let selectedItem = ivObj.ConditionList[idx];

             if (selectedItem.ConditionId != 0) {
                 // Already saved in DB → soft delete
                 selectedItem.DeleteInd = 'Y';
             } else {
                 // New (not saved yet) → remove from array
                 ivObj.ConditionList.splice(idx, 1);
             }
         } else {
             // add new selection
             ivObj.ConditionList.push({
                 ConditionId: 0,
                 DeleteInd: 'N',
                 Id: kitem.OrganizationPreOpCheckListValueId,
                 CheckListId: kitem.CheckListId,
                 Value: kitem.Value,
             });
         }
     };

     $scope.AddIvNewData = function () {
         const ivList = ($scope.PreOpObj.IVAccessDetailsList || []).filter(iv => iv.DeleteInd === 'N');
         if (ivList.length == 5) {
             alertify.error(`You have already added 5 IV Access.`);
             return false;
         }
         if (ivList.length > 0) {

             //  Track which IVs are incomplete
             let emptyIVs = [];

             ivList.forEach((iv, index) => {
                 const isEmpty =
                     (iv.IVSite == null || iv.IVSite === '') &&
                     (iv.PatencyStatus == null || iv.PatencyStatus === '') &&
                     (iv.IVNeedleSize == null || iv.IVNeedleSize === '') &&
                     (iv.IvAccessGivenBy == null || iv.IvAccessGivenBy === '') &&
                     (iv.IvAccessGivenByTime == null || iv.IvAccessGivenByTime === '') &&
                     (iv.IVArm == null || iv.IVArm === '');

                 const hasActiveConditions =
                     iv.ConditionList && iv.ConditionList.some(c => c.DeleteInd === 'N');

                 const hasSelectedBlocked =
                     iv.IVBlockedArray && iv.IVBlockedArray.some(b => b.IsSelected === true);

                 if (isEmpty && !hasActiveConditions && !hasSelectedBlocked) {
                     emptyIVs.push(index + 1); // +1 to make IV1-based index
                 }
             });

             if (emptyIVs.length > 0) {
                 const ivNames = emptyIVs.map(n => "IV" + n).join(", ");
                 alertify.error(`Please enter ${ivNames} details before adding a new IV.`);
                 return;
             }
         }

         if ($scope.PreOpObj.IVBlockedArray.length > 0) {
             angular.forEach($scope.PreOpObj.IVBlockedArray, function (hitem) {
                 hitem.IsSelected = false;
                 hitem.PatientIVBlockedId = 0;
             });
         }

         let obj = {
             "IVAccessMainId": 0,
             "UserId": $scope.UserId,
             "DeleteInd": "N",
             "IVSite": "",
             "PatencyStatus": '',
             "SelectStatusString": '',
             "IVNeedleSize": null,
             "IVSiteFluids": 41,
             "IVSiteFluidsName": '',
             "IVSiteFlush": 34,
             "IVFluidsId": 50,
             "IVSiteFlushName": '',
             "IVSiteLactatedRingers": null,
             "NoOfAttempts": null,
             "IvAccessGivenBy": null,
             "IvAccessGivenByName": null,
             "IvAccessGivenByTime": '',
             "IvAccessGivenByDate": null,
             "ConditionList": [],
             "IVBlockedArray": angular.copy($scope.PreOpObj.IVBlockedArray) || [],
             "Remarks": '',
             "IVSiteBlocked": false,
             "IVFluidsName": "",
             "IVSiteLactatedRingersName": "",
             "IVArm": "",
         };

         $scope.PreOpObj.IVAccessDetailsList.push(obj);
         const tempivList = ($scope.PreOpObj.IVAccessDetailsList || []).filter(iv => iv.DeleteInd === 'N');
         $scope.PreOpObj.NoOfAttempts = tempivList.length || null;
         if (tempivList.length >= 5) {
             $scope.ISAddnewIVdisble = true;
         } else {
             $scope.ISAddnewIVdisble = false;
         }
     };


     $scope.ClearIvAccessData = function (item) {
         item.IVSite = null;
         item.PatencyStatus = '';
         item.IVNeedleSize = null;
         item.IVSiteFluids = null;
         item.IVFluidsId = null;
         item.IVSiteFlush = null;
         item.NoOfAttempts = null;
         item.IvAccessGivenBy = null;
         item.IvAccessGivenByTime = '';
         item.IvAccessGivenByDate = null;
         //item.ConditionList = [];
         item.Remarks = '';
         item.IVFluidsName = '';
         item.IVNeedleSizeName = '';
         item.IVSiteFluidsName = '';
         item.IVSiteFlushName = '';
         item.IVSiteName = '';
         item.IvAccessGivenByName = '';
         item.IVSiteBlocked = false;
         item.IVArm = "";

         if (item.ConditionList && item.ConditionList.length > 0) {
             for (let i = item.ConditionList.length - 1; i >= 0; i--) {
                 let mitem = item.ConditionList[i];
                 if (mitem.ConditionId != 0) {
                     mitem.DeleteInd = 'Y';   // mark existing records
                 } else {
                     item.ConditionList.splice(i, 1); // remove newly added records
                 }
             }
         }

         if (item.IVBlockedArray.length > 0) {
             angular.forEach(item.IVBlockedArray, function (mitem) {
                 mitem.IsSelected = false;
             });
         }
     }

     $scope.RemoveIvAccessData = function (item) {
         if (item.IVAccessMainId == 0) {
             var index = $scope.PreOpObj.IVAccessDetailsList.indexOf(item);
             if (index > -1) {
                 $scope.PreOpObj.IVAccessDetailsList.splice(index, 1);
             }
         } else {
             var index = $scope.PreOpObj.IVAccessDetailsList.indexOf(item);
             $scope.PreOpObj.IVAccessDetailsList[index].DeleteInd = 'Y';
         }

         const tempivList = ($scope.PreOpObj.IVAccessDetailsList || []).filter(iv => iv.DeleteInd === 'N');
         $scope.PreOpObj.NoOfAttempts = tempivList.length || null;
         $scope.ISAddnewIVdisble = false;
     }

    
   
}]);
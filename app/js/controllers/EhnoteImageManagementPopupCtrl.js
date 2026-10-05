
eHnoteWebApp.controller('EhnoteImageManagementPopupCtrl', ['$scope', '$rootScope', '$filter', '$q', 'eHnoteProcedureDataService', 'eHnoteMasterDataService', 'datacookieFactory', 'eHnoteCacheStorageService', 'eHnoteValidateUsersDataService', 'eHnotePatientDataService', '$location', 'alertify', 'eHnoteLoginStatusService', 'eHnotePrintService', 'eHnoteMainAppointmentService', '$window', 'eHnoteDiagnosisDataServices', "Lightbox", "eHnoteSettingsDataService", "textAngularManager", "taRegisterTool", "$timeout", "$uibModal", "localStorageFactory", "eHnoteUserAppointmentDataService", "$uibModalInstance", "ModalitiesArray", "AllDoctorList", "IsComingFrom", "eHnoteInsuranceService", "PatientOrderId", "$http", "eHnoteDbStaticDataService", "InventoryService", "eHnotePatientAddressDataServices", "datapersistanceFactory", "eHnoteSurgeryService", "eHnoteAuditServices", "$sce", "eHnoteUserDataService", function ($scope, $rootScope, $filter, $q, eHnoteProcedureDataService, eHnoteMasterDataService, datacookieFactory, eHnoteCacheStorageService, eHnoteValidateUsersDataService, eHnotePatientDataService, $location, alertify, eHnoteLoginStatusService, eHnotePrintService, eHnoteMainAppointmentService, $window, eHnoteDiagnosisDataServices, Lightbox, eHnoteSettingsDataService, textAngularManager, taRegisterTool, $timeout, $uibModal, localStorageFactory, eHnoteUserAppointmentDataService, $uibModalInstance, ModalitiesArray, AllDoctorList, IsComingFrom, eHnoteInsuranceService, PatientOrderId, $http, eHnoteDbStaticDataService, InventoryService, eHnotePatientAddressDataServices, datapersistanceFactory, eHnoteSurgeryService, eHnoteAuditServices, $sce, eHnoteUserDataService) {







    $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.RoleId = $scope.userLoginDetails.RoleID;

    console.log(appointmentinfo);
    $scope.emptyblackImage = "https://ehnotedevstorage.blob.core.windows.net/dev/1/plainBalck.jpg";
    $scope.emptyblackImageOS = "https://ehnotedevstorage.blob.core.windows.net/dev/1/plainBalck.jpg";
    $scope.screenFrom = IsComingFrom || "";
    var docid = doctorinfo.doctorid;
    $scope.ConsentSettingsDataArray = [];
    $scope.addDoctorConsentForm = [];
    $scope.doctorConsentFormList = [];
    $scope.printConsentArray = [];
    $scope.consentFormArray = [];
    $scope.ConsultationPatientOrderId = PatientOrderId || 0;
    $scope.AllDoctorList = AllDoctorList || [];
    $scope.MasterModalityArray = [];

    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
        $scope.hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    }

    console.log($scope.doctorinfo);

    $scope.AddToCache = function () {
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
    };

    $scope.ImageObj = {
        "PatientImageInd": true
    }

    // $scope.AllDoctorPList = $scope.Main.clinicDoctorList || [];

    console.log(appointmentinfo.AppointmentID);
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    $scope.cacheStorageItem.appointmentid = $scope.cacheStorageItem.appointmentid || 0;
    $scope.InterpretationArrayNew = angular.copy($scope.cacheStorageItem.InterpretationArrayNew) || [];

    console.log($scope.cacheStorageItem.appointmentid);

    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.organsArray = [
        {
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
    ]



    $scope.PatientId = appointmentinfo.PatientID;
    /*$scope.PatientId = $scope.cacheStorageItem.PatientID;*/
    $scope.PatientName = appointmentinfo.PatientName || "";
    $scope.AppointmentDate = appointmentinfo.ConsultationDt || $filter("date")(new Date(), "yyyy-MM-dd");

    $scope.AppointmentId = appointmentinfo.AppointmentID ? appointmentinfo.AppointmentID : $scope.cacheStorageItem.appointmentid;

    $scope.imageMainTab = 1;
    $scope.DiagnosisTab = 1



    $scope.getPatientLatestDiagnosisdata = function () {
        var object = {
            "PatientId": $scope.PatientId,
            "AppointmentId": $scope.AppointmentId
        }
        eHnotePatientDataService.GetPatientLatestDiagnosisListById(object).then(function (resp) {
            $scope.LatestDiagnosisArray = [];
            console.log(resp);

            if (resp.Status = "Success") {
                $scope.LatestDiagnosisArray = resp.data.rows || [];
                if ($scope.LatestDiagnosisArray.length > 0) {
                    angular.forEach($scope.LatestDiagnosisArray, function (sitem) {
                        sitem.IsChecked = false;
                    })
                }
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });

    }

    $scope.getPatientLatestDiagnosisdata();
    $scope.ImagesTabObj = {
        "allPatientImagesArray": [{
            "AppointmentDate": null,
            "AppointmentId": 0,
            "HospitalId": 0,
            "IsActive": false,
            "PatientFiles": [],
            "PatientId": 0,
            "StatusId": 0,
            "ModalityId": 0,
            "ModalityName": ""
        }]
    };
    $scope.SelectedDiagnosisArray = [];
    $scope.changeaddDiagnosis = function () {

        if ($scope.LatestDiagnosisArray.length > 0) {
            $scope.SelectedDiagnosisArray = $filter("filter")($scope.LatestDiagnosisArray, { "IsChecked": true }, true) || [];
        }
        $scope.DiagnosisTab = 1
    }

    $scope.navtoDiagnosisTab = function (tab) {
        $scope.DiagnosisTab = tab;
        if ($scope.DiagnosisTab === 2) {
            $scope.getPatientLatestDiagnosisdata();

            if ($scope.LatestDiagnosisArray.length > 0) {
                angular.forEach($scope.LatestDiagnosisArray, function (citem) {
                    citem.IsChecked = false;
                });
            }
        }
    }


    $scope.getPatientAppointmentInvestigationFiles = function (id) {



        var params = {
            "PatientId": $scope.PatientId,
            "ModalityId": id || 0
        };


        eHnotePatientDataService.getPatientInvestigationApptFiles(params).then(function (resp) {
            $scope.ImagesTabObj.allPatientImagesArray = [];
            console.log(resp);
            if (resp.data.rows.length > 0) {
                resp.data.rows = resp.data.rows || [];
                angular.forEach(resp.data.rows, function (citem) {
                    citem.IsActive = false;
                    citem.PatientFiles = citem.PatientFiles || [];
                    angular.forEach(citem.PatientFiles, function (sitem) {
                        sitem.IsActive = false;
                    });
                });

                angular.forEach(resp.data.rows, function (mitem) {
                    if (mitem.PatientFiles.length > 0) {
                        $scope.ImagesTabObj.allPatientImagesArray.push(mitem);
                    }
                });
            } else {
                $scope.ImagesTabObj.allPatientImagesArray = [];
            }


        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    }


    $scope.getPatientVisitInvestagationfiles = function (id) {


        var params = {
            "PatientId": $scope.PatientId,
            "ModalityId": id || 0
        };


        eHnotePatientDataService.getPatientVisitInvestagationfiles(params).then(function (resp) {
            $scope.ImagesTabObj.allPatientImagesArray = [];
            console.log(resp);
            if (resp.data.rows.length > 0) {
                resp.data.rows = resp.data.rows || [];
                resp.data.rows.forEach(function (item) {
                    if (item.PatientFiles && item.PatientFiles.length > 0) {
                        item.PatientFiles = item.PatientFiles.filter(function (file) {
                            return file.S3URL !== null && file.S3URL !== '';
                        });
                    }
                });


                angular.forEach(resp.data.rows, function (citem) {
                    citem.IsActive = false;
                    citem.PatientFiles = citem.PatientFiles || [];
                    angular.forEach(citem.PatientFiles, function (sitem) {
                        sitem.IsActive = false;
                    });
                });

                var groupedByDateAndModality = {};

                // Iterate over rows and group files by CreatedDt and ModalityId
                angular.forEach(resp.data.rows, function (mitem) {
                    if (mitem.PatientFiles.length > 0) {
                        var CreatedDt = mitem.CreatedDt;
                        // Ensure the group for this CreatedDt exists
                        if (!groupedByDateAndModality[CreatedDt]) {
                            groupedByDateAndModality[CreatedDt] = {
                                CreatedDt: CreatedDt,
                                ModilityTypes: [],
                                TotalFilesCount: 0
                            };
                        }

                        var modalityMap = {};

                        angular.forEach(mitem.PatientFiles, function (file) {
                            var modalityId = file.ModalityId || 0;
                            var modalityName = file.ModalityName || "General";

                            // If this modality hasn't been seen for this CreatedDt, create the group
                            if (!modalityMap[modalityId]) {
                                modalityMap[modalityId] = {
                                    ModalityId: modalityId,
                                    ModalityName: modalityName,
                                    PatientFiles: []
                                };
                            }

                            // Add the file to the corresponding modality group
                            modalityMap[modalityId].PatientFiles.push(file);


                            // Increment the total files count for this date
                            groupedByDateAndModality[CreatedDt].TotalFilesCount += 1;
                        });


                        // Convert modalityMap to an array and push to ModilityTypes
                        angular.forEach(modalityMap, function (modalityGroup) {
                            groupedByDateAndModality[CreatedDt].ModilityTypes.push(modalityGroup);
                        });
                    }
                });

                // Now you can push each groupedByDateAndModality entry to your final array
                angular.forEach(groupedByDateAndModality, function (dateGroup) {

                    // Sub-heading shown under the date in the Investigation Files list
                    var mnames = [];
                    angular.forEach(dateGroup.ModilityTypes, function (m) {
                        if (m.ModalityName && mnames.indexOf(m.ModalityName) === -1) {
                            mnames.push(m.ModalityName);
                        }
                    });
                    dateGroup.ModalityNamesLabel = mnames.join(', ');

                    $scope.ImagesTabObj.allPatientImagesArray.push(dateGroup);

                });

                //if ($scope.ImagesTabObj.allPatientImagesArray.length > 0 && $scope.ImagesTabObj.allPatientImagesArray[0].ModilityTypes.length > 0) {
                //    $scope.ImagesTabObj.allPatientImagesArray[0].ModalityId = $scope.ImagesTabObj.allPatientImagesArray[0].ModilityTypes[0].PatientFiles[0].ModalityId;
                //    $scope.ImagesTabObj.allPatientImagesArray[0].ModalityName = $scope.ImagesTabObj.allPatientImagesArray[0].ModilityTypes[0].PatientFiles[0].ModalityName;
                //    $scope.showOrderInterpretation($scope.ImagesTabObj.allPatientImagesArray[0].ModilityTypes[0]);
                //}

            } else {
                $scope.ImagesTabObj.allPatientImagesArray = [];
            }


        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    };


    $scope.changeModalityForImagesGet = function (Id) {
        $scope.selectedImageStudyObj = getnewImageStudyDetailsAddReqObj();
        $scope.InterpretationSummaryArray = [];
        $scope.selectedImageStudyFiles.LeftEyeFiles = [];
        $scope.selectedImageStudyFiles.RightEyeFiles = [];
        $scope.selectedImageStudyFiles.BothEyeFiles = [];
        $scope.selectedImageStudyFiles.AllFiles = [];


        canvasEl = document.getElementById("ODviewer");
        ctx = canvasEl.getContext('2d');
        $scope.options.ctx = ctx;
        canvasSize = canvasEl.parentNode;
        ctx.canvas.width = canvasSize.clientWidth;
        ctx.canvas.height = canvasSize.clientHeight;
        resize = { height: canvasSize.clientHeight, width: canvasSize.clientWidth };

        $scope.fileInputOD = $scope.emptyblackImage;
        $scope.options.zoom.value = 1.0;
        $scope.options.rotate.value = 0;
        $scope.options.flip = { h: 1, v: 1 };
        curPos = { x: 0, y: 0 };
        picPos = { x: 0, y: 0 };


        reader = formatReader.CreateReader("image/jpeg").create($scope.fileInputOD, $scope.options, onload, $q, $timeout);

        console.log(reader);



        canvasOSEl = document.getElementById("OSviewer");
        ctxOS = canvasOSEl.getContext('2d');
        $scope.optionsOS.ctx = ctxOS;
        canvasSizeOS = canvasOSEl.parentNode;
        ctxOS.canvas.width = canvasSizeOS.clientWidth;
        ctxOS.canvas.height = canvasSizeOS.clientHeight;
        resizeOS = { height: canvasSizeOS.clientHeight, width: canvasSizeOS.clientWidth };


        $scope.fileInputOS = $scope.emptyblackImageOS;
        $scope.optionsOS.zoom.value = 1.0;
        $scope.optionsOS.rotate.value = 0;
        $scope.optionsOS.flip = { h: 1, v: 1 };
        curPosOS = { x: 0, y: 0 };
        picPosOS = { x: 0, y: 0 };
        readerOS = formatReader.CreateReader("image/jpeg").create($scope.fileInputOS, $scope.optionsOS, onloadOS, $q, $timeout);


        $timeout(function () {
            $scope.resizeTo('page');
            $scope.resizeToOS('page');
        }, 1000);
        //$scope.getPatientAppointmentInvestigationFiles(Id);
        $scope.getPatientVisitInvestagationfiles(Id);
    }
    $scope.ActiveCollapseId = 0;
    $scope.ActiveCollapsebar = function (obj) {

        obj.IsActive = !obj.IsActive;
    };

    function getaddnewImageStudyObj() {
        var objj = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "PatientImageStudyId": 0,
            "ImageStudyName": "",
            "ImageStudyDescription": "",
            "DOSDate": $filter("date")(new Date(), "yyyy-MM-dd"),
            "StatusId": 1,
            "ControlId": 1,
            "ModalityId": 1,
            "DoctorId": 0,
            "TechnicianId": 0,
            "AppointmentId": $scope.AppointmentId,
            "PatientId": $scope.PatientId,
            "DoctorNotes": "",
            "TechnicianNotes": "",
            "DeleteInd": "N",
            "StudyImagesArray": [

            ],
            "StudyDiagnosisArray": [

            ],
            "PatientOrderId": 0,
            "InvestigationId": 0,
            "InvestigationObj": "",
            "InvestigationName": "",
            "CPTCode": "",
            "ProcedureCode": "",
            "DoctorObj": "",
            "DoctorName": "",
            "OrganizationInvestigationId": 0
        }

        return objj;
    }

    $scope.addupdateImgStudyReqObj = getaddnewImageStudyObj();

    $scope.checkAllImagesOfAppointment = function (mainobj) {
        if (mainobj.IsCheckAll) {
            angular.forEach(mainobj.ModilityTypes, function (sitem) {
                angular.forEach(sitem.PatientFiles, function (item) {
                    item.IsActive = true;
                })

            });
        } else {
            angular.forEach(mainobj.ModilityTypes, function (sitem) {
                angular.forEach(sitem.PatientFiles, function (item) {
                    item.IsActive = false;
                })

            });
        }
        $scope.PirticulardayImagesArray = [];
        angular.forEach($scope.ImagesTabObj.allPatientImagesArray, function (Mainitem) {
            angular.forEach(Mainitem.ModilityTypes, function (Mitem) {
                angular.forEach(Mitem.PatientFiles, function (sitem) {
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
                    if (sitem.IsActive) {
                        $scope.PirticulardayImagesArray.push(obj);
                    }
                });
            });
        });

        //angular.forEach($scope.ImagesTabObj.allPatientImagesArray, function (mitem) {
        //    mitem.IsCheckAll = false;
        //    angular.forEach(mitem.ModilityTypes, function (sitem) {
        //        angular.forEach(sitem.PatientFiles, function (item) {
        //            item.IsActive = false;
        //        })
        //    });
        //})
        //mainobj.IsCheckAll = true;
        //angular.forEach(mainobj.ModilityTypes, function (sitem) {
        //    angular.forEach(sitem.PatientFiles, function (item) {
        //        item.IsActive = true;
        //    })

        //});

        $scope.navtoInvestigationPreview(mainobj);
    }

    $scope.checkEachImageFile = function (sitem) {
        if (sitem.IsActive) {
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
            $scope.PirticulardayImagesArray.push(obj);
        } else {
            const index = $scope.PirticulardayImagesArray.findIndex(function (image) {
                return image.DocumentId === sitem.DocumentId;
            });
            if (index !== -1) {
                $scope.PirticulardayImagesArray.splice(index, 1);
            }
        }
        $scope.ImagesTabObj.allPatientImagesArray.forEach(item => {
            let isAllFilesChecked = item.ModilityTypes.every(modality => {
                return modality.PatientFiles.every(file => file.IsActive === true);
            });

            item.IsCheckAll = isAllFilesChecked;
        });
        $scope.navtoInvestigationPreview();       
    };

    $scope.getOrderImagesObj = {
        "ModalityId": 0,
        "showSyncButton": false,
        "imagesArray": []
    }


    $scope.studyViewGetObj = {
        "ModalityId": 0,
        "imageStudyListArray": []
    };

    //$scope.MasterModalityArray = [
    //    {
    //        "ModalityId": 0,
    //        "ModalityName": "All",
    //        "ModalityShortName": "All"
    //    },
    //    {
    //        "IModalityIdd": 1,
    //        "ModalityName": "Corneal Topo",
    //        "ModalityShortName": "Corneal Topo"
    //    },
    //    {
    //        "ModalityId": 2,
    //        "ModalityName": "ECC",
    //        "ModalityShortName": "ECC"
    //    },
    //    {
    //        "ModalityId": 3,
    //        "ModalityName": "External Camera",
    //        "ModalityShortName": "External Camera"
    //    },
    //    {
    //        "ModalityId": 4,
    //        "ModalityName": "IOL",
    //        "ModalityShortName": "IOL"
    //    },
    //    {
    //        "ModalityId": 5,
    //        "ModalityName": "OCT/HRT",
    //        "ModalityShortName": "OCT/HRT"
    //    },
    //    {
    //        "ModalityId": 6,
    //        "ModalityName": "Opthalmic Photography",
    //        "ModalityShortName": "Opthalmic Photography"
    //    },
    //    {
    //        "ModalityId": 7,
    //        "ModalityName": "UltraSound",
    //        "ModalityShortName": "UltraSound"
    //    },
    //    {
    //        "ModalityId": 8,
    //        "ModalityName": "Visual Field",
    //        "ModalityShortName": "Visual Field"
    //    },
    //    {
    //        "ModalityId": 9,
    //        "ModalityName": "Other",
    //        "ModalityShortName": "Other"
    //    }
    //];

    console.log(ModalitiesArray);
    $scope.GetLogObj = function () {
        return {
            "UserId": $scope.UserId || null,
            "OrganizationId": $scope.HospitalId || null,
            "AppointmentId": $scope.AppointmentId || null,
            "PatientId": $scope.PatientId || null,
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
        }
    }

    $scope.LogObj = $scope.GetLogObj();

    $scope.AddAuditLog = function (selectedItem) {
        $scope.LogObj.LogArray = [];
        let SubModuleName = selectedItem.SubModuleName || "";
        let SubModuleId = selectedItem.SubModuleId || 0;
        let ScreenType = selectedItem.ScreenType || "ASC List";
        let ActionType = selectedItem.ActionType || "Accessed";
        let ActionDescription = selectedItem.ActionDescription || "";
        let obj = {
            "LogId": 0,
            "ModuleId": 2,
            "ModuleName": "ASC",
            "SubModuleId": SubModuleId,
            "SubModuleName": SubModuleName,
            "ScreenType": ScreenType,
            "ActionType": ActionType,
            "ActionDescription": ActionDescription,
            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
        };
        $scope.LogObj.LogArray.push(obj);
        eHnoteSurgeryService.AddAuditLog($scope.LogObj).then(function (resp) {
            if (resp.data.status == "Success") {
                console.log("Added");
            }
        });
    }





    $scope.imageStudyListArray = [];

    $scope.getOrderSearchReq = {
        "PatientId": $scope.PatientId,
        "SearchText": "",
        "PageSize": 10,
        "PageNumber": 1,
        "ModalityId": 0,
        "InvestigationId": 0
    };

    $scope.getPatientImageStudyList = function () {



        var params = {
            "PatientId": $scope.PatientId,
            "ModalityId": "",
            "SearchName": ""
        }


        eHnotePatientDataService.GetPatientImageStudyList(params).then(function (resp) {

            console.log(resp);
            if (resp.data.rows.length > 0) {
                $scope.studyViewGetObj.imageStudyListArray = resp.data.rows || [];

                angular.forEach($scope.studyViewGetObj.imageStudyListArray, function (iitem) {
                    iitem.IsActive = false;
                    iitem.ModalityName = "";
                    var filteredArray = $filter("filter")($scope.MasterModalityArray, function (item, index) { return item.Id === iitem.ModalityId }) || [];

                    if (filteredArray.length > 0) {
                        iitem.ModalityName = filteredArray[0].Name;
                    }

                });
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    }


    //$scope.getPatientImageStudyList();


    $scope.PatientAllOrdersList = [];








    $scope.modalityfilterData = function (item) {

        if ($scope.studyViewGetObj.ModalityId === 0) {
            return item;
        }
        else {
            return item.ModalityId === $scope.studyViewGetObj.ModalityId;
        }

    }

    function getnewImageStudyDetailsAddReqObj() {
        var obj = {
            "OPChartStatus": "",
            "UserId": $scope.UserId,
            "PatientImageStudyId": 0,
            "PatientOrderId": 0,
            "OrderName": "",
            "SelectedEye": 1,
            "ConnectedDiagnosisList": [],
            "InvestigationId": 0,
            "ModalityId": 0,
            "HospitalId": $scope.HospitalId,
            "OrganizationId": $scope.HospitalId,
            "ModalityName": "",
            "ImageQuality": "",
            "AppointmentId": $scope.cacheStorageItem.appointmentid || 0,
            "ConsultationId": $scope.cacheStorageItem.ConsultationID || 0,
            "AppointmentDate": "",
            "ConsultationDate": "",
            "CPTCode": "",
            "LOINCCode": "",
            "ProcedureId": 0,
            "OrganizationProcedureId": 0,
            "ProcedureName": "",
            "ProcedureCode": "",
            "OrderDate": null,
            "OrderNumber": "",
            "OrderTypeId": 0,
            "OrganId": 0,
            "StatusId": 1,
            "PatientId": $scope.PatientId || 0,
            "PatientName": "",
            "InvestigationName": "OCT",
            "OCTMACFindings": "",
            "OCTONFindings": "",
            "DoctorObj": {
                "FullName": "Select"
            },
            "DoctorName": "",
            "DoctorId": 0,
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
            /*"ODOCTMACFindings": "some findings",*/
            "ODOCTMACFindings": "",
            "ODLidsValue": "",
            "ODConjunctivaValue": "",
            "ODScleraValue": "",
            "ODCorneaValue": "",
            /*"OSOCTMACFindings": "some findings",*/
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
            "PatientFiles": []


        };

        return obj;
    }

    $scope.selectedImageStudyObj = getnewImageStudyDetailsAddReqObj();

    $scope.selectedImageStudyFiles = {
        "RightEyeFiles": [],
        "LeftEyeFiles": [],
        "BothEyeFiles": [],
        "AllFiles": []
    };

    $scope.InvestigationMainsArray = [
        {
            "InvestigationId": 1,
            "InvestigationName": "OCT"
        },
        {
            "InvestigationId": 2,
            "InvestigationName": "A SCAN"
        },
        {
            "InvestigationId": 3,
            "InvestigationName": "B SCAN"
        },
        {
            "InvestigationId": 4,
            "InvestigationName": "Corneal Topography"
        },
        {
            "InvestigationId": 5,
            "InvestigationName": "Slit Lamp"
        },
        {
            "InvestigationId": 6,
            "InvestigationName": "AS OCT"
        },
        {
            "InvestigationId": 7,
            "InvestigationName": "Fundus Photots"
        },
        {
            "InvestigationId": 8,
            "InvestigationName": "Endothelial Cell Count"
        },
        {
            "InvestigationId": 9,
            "InvestigationName": "General"
        }
    ];

    $scope.changeModalityForStudies = function (modalityId) {

        modalityId = modalityId || 0;
        if (modalityId === 0) {
            $scope.getOrderSearchReq.ModalityId = 0;
        }
        $scope.selectedImageStudyObj = getnewImageStudyDetailsAddReqObj();

        $scope.InterpretationSummaryArray = [];
        $scope.selectedImageStudyFiles.LeftEyeFiles = [];
        $scope.selectedImageStudyFiles.RightEyeFiles = [];
        $scope.selectedImageStudyFiles.BothEyeFiles = [];
        $scope.selectedImageStudyFiles.AllFiles = [];


        canvasEl = document.getElementById("ODviewer");
        ctx = canvasEl.getContext('2d');
        $scope.options.ctx = ctx;
        canvasSize = canvasEl.parentNode;
        ctx.canvas.width = canvasSize.clientWidth;
        ctx.canvas.height = canvasSize.clientHeight;
        resize = { height: canvasSize.clientHeight, width: canvasSize.clientWidth };

        $scope.fileInputOD = $scope.emptyblackImage;
        $scope.options.zoom.value = 1.0;
        $scope.options.rotate.value = 0;
        $scope.options.flip = { h: 1, v: 1 };
        curPos = { x: 0, y: 0 };
        picPos = { x: 0, y: 0 };


        reader = formatReader.CreateReader("image/jpeg").create($scope.fileInputOD, $scope.options, onload, $q, $timeout);

        console.log(reader);



        canvasOSEl = document.getElementById("OSviewer");
        ctxOS = canvasOSEl.getContext('2d');
        $scope.optionsOS.ctx = ctxOS;
        canvasSizeOS = canvasOSEl.parentNode;
        ctxOS.canvas.width = canvasSizeOS.clientWidth;
        ctxOS.canvas.height = canvasSizeOS.clientHeight;
        resizeOS = { height: canvasSizeOS.clientHeight, width: canvasSizeOS.clientWidth };


        $scope.fileInputOS = $scope.emptyblackImageOS;
        $scope.optionsOS.zoom.value = 1.0;
        $scope.optionsOS.rotate.value = 0;
        $scope.optionsOS.flip = { h: 1, v: 1 };
        curPosOS = { x: 0, y: 0 };
        picPosOS = { x: 0, y: 0 };
        readerOS = formatReader.CreateReader("image/jpeg").create($scope.fileInputOS, $scope.optionsOS, onloadOS, $q, $timeout);


        $timeout(function () {
            $scope.resizeTo('page');
            $scope.resizeToOS('page');
        }, 1000);

        $scope.getPatientOrderDetailsList();
    };
    $scope.getPatientImageStudyDetailsById = function (item) {
        var params = {
            "PatientImageStudyId": item.PatientImageStudyId
        }



        eHnotePatientDataService.GetPatientImageStudyDetailsById(params).then(function (resp) {


            console.log(JSON.stringify(resp));

            if (resp.data.status == "Success") {
                resp.data.rows = resp.data.rows || [];
                $scope.InterpretationSummaryArray = [];
                if (resp.data.rows.length > 0) {
                    var resultdata = resp.data.rows[0];
                    $scope.InterpretationSummaryArray.push(resultdata);
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

                    let tempArray = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.selectedImageStudyObj.DoctorId }, true);
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

                    let technicianArray = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.selectedImageStudyObj.TechnicianId }, true);
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
                    // log obj accessing 

                    $scope.LogObj.FundusFindingArray = angular.copy($scope.InterpretationSummaryArray[0].FundusFindingArray) || [];
                    $scope.LogObj.ICGFindingArray = angular.copy($scope.InterpretationSummaryArray[0].ICGFindingArray) || [];
                    $scope.LogObj.FAFindingArray = angular.copy($scope.InterpretationSummaryArray[0].FAFindingArray) || [];
                    $scope.LogObj.DoctorId = $scope.selectedImageStudyObj.DoctorId || 0;
                    $scope.LogObj.TechnicianId = $scope.selectedImageStudyObj.TechnicianId || 0;
                    $scope.LogObj.TechnicianRemarks = $scope.selectedImageStudyObj.TechnicianRemarks || "";
                    $scope.LogObj.ProviderRemarks = $scope.selectedImageStudyObj.ProviderRemarks || "";
                    $scope.LogObj.DiagnosisListArray = $scope.selectedImageStudyObj.DiagnosisListArray || [];

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
                }

            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    }






    $scope.checkDicomFile = function (url) {
        var isDicomFile = false;
        var Url = url || "";
        if (Url != "") {
            isDicomFile = Url.toLowerCase().endsWith(".dcm") || Url.toLowerCase().endsWith(".DCM");
        }
        return isDicomFile;
    };

    $scope.changeadvicedDiagnosisForImageStudy = function (obj) {

        if (obj.IsCheckedDiagnosis) {
            var List = $filter("filter")($scope.selectedImageStudyObj.DiagnosisListArray, function (Aitem) {
                return (Aitem.DiagnosisId === obj.DiagnosisId && Aitem.DeleteInd == "N");
            });

            if (List.length > 0) {
                alertify.error('You have already Selected this Diagnosis');
                $scope.newSelectedDiagObj = "";
                return false;
            }
            else {

                var newobj = {
                    "PatientImageStudyDiagnosisId": 0,
                    "DeleteInd": "N",
                    "DiagnosisId": obj.DiagnosisId || 0,
                    "DiagnosisTypeId": obj.DiagnosisTypeId || 0,
                    "ICD10CODE": obj.ICD10CODE || "",
                    "ICD10DIAGDESCRIPTION": obj.ICD10DIAGDESCRIPTION || "",
                    "ICD10DIAGNAME": obj.ICD10DIAGNAME || "",
                }

                $scope.selectedImageStudyObj.DiagnosisListArray.push(newobj);
                $scope.newSelectedDiagObj = "";

            }
        } else {

            angular.forEach($scope.selectedImageStudyObj.DiagnosisListArray, function (sitem, index) {
                if (sitem.DiagnosisId == obj.DiagnosisId) {
                    $scope.selectedImageStudyObj.DiagnosisListArray.splice(index, 1);
                }
            });



        }
    }


    $scope.removedSelectedDiagnosis = function (obj) {
        angular.forEach($scope.selectedImageStudyObj.DiagnosisListArray, function (sitem, index) {
            if (sitem.DiagnosisId == obj.DiagnosisId) {
                if (obj.DiagnosisDetailId === 0) {
                    $scope.selectedImageStudyObj.DiagnosisListArray.splice(index, 1);
                }
                else {
                    obj.DeleteInd = 'Y';
                }

            }
        });

        angular.forEach($scope.advisedDiagnosisArray, function (aitem) {
            if (aitem.DiagnosisId === obj.DiagnosisId) {
                aitem.IsCheckedDiagnosis = false;
            }
        });
    }


    $scope.showImageStudyDetails = function (obj) {


        angular.forEach($scope.studyViewGetObj.imageStudyListArray, function (mitem) {
            mitem.IsActive = false;
        });
        obj.IsActive = true;
        $scope.getPatientImageStudyDetailsById(obj);

    };

    $scope.clearComapredArray = function () {
        $scope.compareImagesArray = [];
        angular.forEach($scope.allPatientImagesArray, function (citem) {
            angular.forEach(citem.PatientFiles, function (sitem) {
                sitem.IsActive = false;
            });
        });
    };


    $scope.openCreateNewOrderPopup = function (addvalue) {
        $scope.openImageUploadForOrderPopup(addvalue, 0);
    }



    $scope.openImageUploadForOrderPopup = function (addvalue, PatientOrderId) {





        var Obj = {
            "HospitalId": $scope.HospitalId,
            "PatientId": $scope.PatientId,
            "UserId": $scope.UserId,
            "AppointmentId": $scope.AppointmentId,
            "AppointmentDate": $scope.AppointmentDate,
            "PatientName": $scope.PatientName,
            "AppointmentList": [],
            "MasterModalityArray": $scope.MasterModalityArray,
            "addvalue": addvalue,
            "PatientOrderId": PatientOrderId,
            "ParenthospitalId": $scope.ParenthospitalId || null
        }

        var modalInstance = $uibModal.open({
            "templateUrl": "templates/uibpopups/PatientAddUpdateOrderDetails.html",
            "backdrop": "static",
            "scope": $scope,
            "windowClass": "zindexpopup",
            "keyboard": false,
            "size": "lg",
            "resolve": {
                "ParentObject": Obj
            },
            "controller": function ($scope, $uibModalInstance, eHnoteDiagnosisDataServices, eHnoteSettingsDataService, eHnoteInsuranceService, ParentObject, alertify) {

                console.log(ParentObject);
                $scope.selectedPatientObj = ParentObject;

                $scope.selectedPatientOrderId = ParentObject.PatientOrderId || 0;

                $scope.ParenthospitalId = ParentObject.ParenthospitalId || null;

                $scope.previousAppointmentsList = [];


                $scope.PatientOrdersArray = [];

                $scope.addUpdatePatientOrderImageDetailsReq = getAddPatientOrderImageDetailsReq();


                $scope.advisedDiagnosisArray = [];

                $scope.selectedDiagnosisOrderArray = [];


                $scope.showAddOrderDiv = false;


                $scope.getPatientPreviousAppointments = function () {

                    eHnotePatientDataService.GetPatientBillingAppointments($scope.selectedPatientObj.PatientId).then(function (resp) {
                        if (resp.data.Status === 1) {
                            if (resp.data.data.length > 0) {
                                resp.data.data = resp.data.data || [];

                                angular.forEach(resp.data.data, function (mitem) {
                                    console.log(mitem);
                                    // if (mitem.AppointmentDate <= $scope.currentdate) {
                                    $scope.previousAppointmentsList.push(mitem);
                                    //}
                                });

                                $scope.showAddOrderDiv = true;
                                angular.forEach($scope.previousAppointmentsList, function (aitem) {
                                    aitem.NewAppointmentDate = $filter("date")(aitem.AppointmentDate, "MM-dd-yyyy");
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

                if ($scope.selectedPatientObj.addvalue) {
                    $scope.showAddOrderDiv = true;
                    $scope.getPatientPreviousAppointments();
                } else {
                    $scope.showAddOrderDiv = false;
                }


                $scope.getPatientAdvisedDiagnosisList = function () {

                    var obj = {
                        "AppointmentId": ParentObject.AppointmentId,
                        "PatientID": ParentObject.PatientId,
                        "PatientOrderId": 0
                    }
                    eHnoteInsuranceService.GetDiagnosisAssesmentPlansListById(obj).then(function (response) {

                        console.log(response);
                        if (response.data.Status === 'Success') {
                            if (response.data.rows.length > 0) {
                                $scope.advisedDiagnosisArray = response.data.rows || [];
                                angular.forEach($scope.advisedDiagnosisArray, function (ditem) {
                                    ditem.IsCheckedDiagnosis = false;
                                });
                            }
                        }
                    });
                };


                $scope.changeOrderSelected = function (item) {

                    console.log(item)
                    if (item.IsSelected) {
                        angular.forEach($scope.PatientOrdersArray, function (oitem) {
                            oitem.IsSelected = false;
                        });
                        item.IsSelected = true;
                        $scope.getPatientAdvisedDiagnosisList(item.PatientOrderId);
                        $scope.addUpdatePatientOrderImageDetailsReq.PatientOrderId = item.PatientOrderId;
                        $scope.addUpdatePatientOrderImageDetailsReq.OrganizationProcedureId = item.OrgProcedureId;
                        $scope.addUpdatePatientOrderImageDetailsReq.ProcedureId = item.ProcedureId;
                        $scope.addUpdatePatientOrderImageDetailsReq.ProcedureCode = item.ProcedureCode;
                        $scope.addUpdatePatientOrderImageDetailsReq.ProcedureName = item.ProcedureName;
                        $scope.addUpdatePatientOrderImageDetailsReq.CPTCode = item.CPTCode;
                        $scope.addUpdatePatientOrderImageDetailsReq.ModalityId = item.ModalityId;


                    } else {
                        $scope.addUpdatePatientOrderImageDetailsReq.PatientOrderId = 0;
                        $scope.addUpdatePatientOrderImageDetailsReq.OrganizationProcedureId = 0;
                        $scope.addUpdatePatientOrderImageDetailsReq.ProcedureId = 0;
                        $scope.addUpdatePatientOrderImageDetailsReq.ProcedureCode = ""
                        $scope.addUpdatePatientOrderImageDetailsReq.ProcedureName = "";
                        $scope.addUpdatePatientOrderImageDetailsReq.CPTCode = "";
                        $scope.addUpdatePatientOrderImageDetailsReq.DoctorId = "";
                        $scope.addUpdatePatientOrderImageDetailsReq.ModalityId = 0;
                    }
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
                                $scope.PatientOrdersArray = response.data.rows || [];

                                angular.forEach($scope.PatientOrdersArray, function (oitem) {
                                    oitem.IsSelected = false;
                                    oitem.isdisableOrderSelection = false;
                                });


                                if ($scope.selectedPatientOrderId != 0) {

                                    angular.forEach($scope.PatientOrdersArray, function (oitem) {
                                        oitem.isdisableOrderSelection = true;
                                        if (oitem.PatientOrderId == $scope.selectedPatientOrderId) {
                                            oitem.IsSelected = true;
                                            $scope.changeOrderSelected(oitem);
                                        }
                                    });



                                }
                            }
                        }
                    });
                };

                $scope.getPatientChartingOrdersById();








                //$scope.getPatientAdvisedDiagnosisList(0);



                function getAddPatientOrderImageDetailsReq() {
                    var objj = {
                        "UserId": ParentObject.UserId,
                        "HospitalId": ParentObject.HospitalId,
                        "PatientOrderId": 0,
                        "ConsultationId": $scope.cacheStorageItem.ConsultationID || 0,
                        "AppointmentId": ParentObject.AppointmentId,
                        "AppointmentDate": ParentObject.AppointmentDate,
                        "PatientId": ParentObject.PatientId,
                        "PatientName": ParentObject.PatientName,
                        "CPTCode": "",
                        "LOINCCode": "",
                        "ProcedureId": 0,
                        "OrganizationProcedureId": 0,
                        "ProcedureName": "",
                        "ProcedureCode": "",
                        "OrderDate": null,
                        "OrderNumber": "",
                        "OrderTypeId": 1,
                        "OrganId": 0,//4
                        "StatusId": 1,
                        "ModalityId": 0,
                        "ModalityName": "",
                        "DiagnosisList": [],
                        "PatientFiles": [],
                    }

                    return objj;
                }







                $scope.navtoCreateNewOrder = function () {
                    $scope.addUpdatePatientOrderImageDetailsReq = getAddPatientOrderImageDetailsReq();

                    $scope.getPatientPreviousAppointments();

                };
                $scope.navtoSelectExistingOrders = function () {
                    $scope.addUpdatePatientOrderImageDetailsReq = getAddPatientOrderImageDetailsReq();
                    $scope.showAddOrderDiv = false;
                };








                function getDiagnosisOrderObj() {
                    var obj = {
                        "DiagnosisDetailId": 0,
                        "DiagnosisId": 1,
                        "DiagnosisName": "",
                        "ICDCode": "",
                        "DeleteInd": "",
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
                        "SeverityId1": 0,
                        "DiagnosisStatusId1": 0,
                        "EndDate1": null,
                        "StartDate1": null,

                        "LocationId2": 0,
                        "SeverityId2": 0,
                        "DiagnosisStatusId2": 0,
                        "EndDate2": null,
                        "StartDate2": null,
                    };

                    return obj;
                }

                $scope.ModalityArray = angular.copy(ParentObject.MasterModalityArray);

                angular.forEach($scope.ModalityArray, function (kitem, index) {
                    if (kitem.ModalityId === 0) {
                        $scope.ModalityArray.splice(index, 1);
                    }
                });


                $scope.imguploadReqObj = {
                    "UserId": $scope.selectedPatientObj.UserId,
                    "HospitalId": $scope.selectedPatientObj.HospitalId,
                    "AppointmentId": $scope.selectedPatientObj.AppointmentId,
                    "AppointmentDate": $scope.AppointmentDate,
                    "PatientId": $scope.selectedPatientObj.PatientId,
                    "PatientName": $scope.selectedPatientObj.PatientName,
                    "ProcedureId": "",
                    "OrganizationProcedureId": "",
                    "ProcedureName": "",
                    "ProcedureCode": "",
                    "CPTCode": "",
                    "ProcedureObj": "",
                    "OrganId": "",
                    "CategoryId": 0,
                    "ModalityId": 0,
                    "ModalityName": "",
                    "PatientFiles": []
                };


                $scope.closeImagePopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };


                $scope.SavePatientOrderDetails = function () {


                    console.log($scope.addUpdatePatientOrderImageDetailsReq);

                    $scope.addUpdatePatientOrderImageDetailsReq.PatientFiles = $scope.imguploadReqObj.PatientFiles || [];



                    if ($scope.tempODImagesArray.length > 0) {
                        angular.forEach($scope.tempODImagesArray, function (item) {
                            $scope.addUpdatePatientOrderImageDetailsReq.PatientFiles.push(item);
                        });
                    };

                    if ($scope.tempOSImagesArray.length > 0) {
                        angular.forEach($scope.tempOSImagesArray, function (item) {
                            $scope.addUpdatePatientOrderImageDetailsReq.PatientFiles.push(item);
                        });
                    };


                    console.log($scope.addUpdatePatientOrderImageDetailsReq);

                    eHnotePatientDataService.AddUpdatePatientOrderDetails($scope.addUpdatePatientOrderImageDetailsReq, OnAddPatientSuccess, OnAddPatientError);
                    function OnAddPatientSuccess(response) {
                        console.log(response);

                        alertify.success("Files Added  Successfully");
                        $uibModalInstance.close('save');

                    }
                    function OnAddPatientError() {
                        alertify.error("Creating  Failed");
                    }



                }
                $scope.clearImagePopup = function () {


                    $scope.tempODImagesArray = [];
                    $scope.tempOSImagesArray = [];
                    $scope.ODFileupload = [];
                    $scope.OSFileupload = [];
                    $uibModalInstance.close('clear');
                };





                $scope.uploadPatientFiles = function ($files) {
                    // $scope.imguploadReqObj.PatientFiles = $files;
                    angular.forEach($files, function (fitem) {
                        var obj = { "file": fitem };
                        $scope.imguploadReqObj.PatientFiles.push(obj)
                    });
                };


                $scope.tempODImagesArray = [];
                $scope.tempOSImagesArray = [];
                $scope.ODFileupload = [];
                $scope.OSFileupload = [];
                $scope.Fileupload = "";
                $scope.selectedEyeFiles = function (files, eye) {
                    if (files == null || files == "") {
                        return false;
                    }

                    var sorganid = 1;
                    if (eye == 'OS') { sorganid = 2; } else { sorganid = 1; };
                    if (sorganid === 1) {
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
                                    "file": item
                                };

                                $scope.tempODImagesArray.push(obj);

                            });
                        }
                    } else {
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
                                    "file": item
                                };

                                $scope.tempOSImagesArray.push(obj);

                            });
                        }
                    }
                    angular.element("input[type='file']").val(null);



                }


                $scope.removeImage = function (item, eye) {

                    var sorganid = 1;
                    if (eye == 'OS') { sorganid = 2; } else { sorganid = 1; };

                    if (item.DocumentId != 0) {
                        item.DeleteInd = "Y";
                    } else {
                        if (sorganid === 1) {
                            var index = $scope.tempODImagesArray.indexOf(item);
                            $scope.tempODImagesArray.splice(index, 1);
                        } else {
                            var index = $scope.tempOSImagesArray.indexOf(item);
                            $scope.tempOSImagesArray.splice(index, 1);
                        }
                    }
                };


                $scope.GetOrganizationProcedure = function (text) {

                    //var params = {
                    //    "OrganizationId": $scope.HospitalId,
                    //    "ProcedureId": 0,
                    //    "CPTCODE": "",  // cptcode tblorganizationprocedure
                    //    "SearchText": text || "", // searchtext
                    //    "TypeOfServiceId": 0,
                    //    "PageNumber": 1,
                    //    "PageSize": 10,
                    //    "Status": 1,
                    //    "IsFrequent": "N"
                    //};
                    //if (params.SearchText == '') {
                    //    params.IsFrequent = 'Y';
                    //}

                    //return eHnoteSettingsDataService.GetOrganizationProcedures(params).then(function (resp) {
                    //    if (resp.data.rows !== undefined) {
                    //        return resp.data.rows.map(function (item) {
                    //            return item;
                    //        });
                    //    }
                    //});


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
                        "ParentOrganizationId": $scope.ParenthospitalId
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
                    $scope.addUpdatePatientOrderImageDetailsReq.OrganizationProcedureId = "";
                    $scope.addUpdatePatientOrderImageDetailsReq.ProcedureId = "";
                    $scope.addUpdatePatientOrderImageDetailsReq.ProcedureCode = "";
                    $scope.addUpdatePatientOrderImageDetailsReq.ProcedureName = "";
                    $scope.addUpdatePatientOrderImageDetailsReq.CPTCode = "";
                    $scope.addUpdatePatientOrderImageDetailsReq.CategoryId = 0;

                }

                $scope.onSelectProcedureInv = function (obj) {

                    console.log(obj);

                    $scope.addUpdatePatientOrderImageDetailsReq.OrganizationProcedureId = obj.OrganizationProcedureId;
                    $scope.addUpdatePatientOrderImageDetailsReq.ProcedureId = obj.ProcedureId;
                    $scope.addUpdatePatientOrderImageDetailsReq.ProcedureCode = obj.ProcedureCode;
                    $scope.addUpdatePatientOrderImageDetailsReq.ProcedureName = obj.ProcedureName;
                    $scope.addUpdatePatientOrderImageDetailsReq.CPTCode = obj.CPTCode;
                    $scope.addUpdatePatientOrderImageDetailsReq.CategoryId = obj.CategoryId || 0;
                };


                $scope.changeselectOrderDiagnosisitem = function (obj) {

                    console.log(obj);

                };

                $scope.onselectOrderDiagnosisitem = function (val) {


                    var List = $filter("filter")($scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList, function (Aitem) {
                        return (Aitem.DiagnosisId === val.DiagnosisId && Aitem.DeleteInd == "N");
                    });
                    if (List.length > 0) {
                        alertify.error('You have already Selected this Diagnosis');
                        $scope.newSelectedDiagObj = "";
                        return false;
                    }
                    else {


                        var obj = getDiagnosisOrderObj();
                        obj.ConsultationDiagnosisId = 0;
                        obj.DiagnosisDetailId = 0;
                        obj.DiagnosisId = val.DiagnosisId;
                        obj.DiagnosisName = val.ICD10DIAGNAME;
                        obj.ICDCode = val.ICD10CODE;
                        obj.DeleteInd = "N";
                        obj.CreatedDateTime = $filter('date')(new Date(), "MM-dd-yyyy h:mm a");
                        $scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList.push(obj);
                        $scope.newSelectedDiagObj = "";

                    }



                }

                $scope.changeadvicedDiagnosis = function (obj) {

                    if (obj.IsCheckedDiagnosis) {
                        var List = $filter("filter")($scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList, function (Aitem) {
                            return (Aitem.DiagnosisId === obj.DiagnosisId && Aitem.DeleteInd == "N");
                        });

                        if (List.length > 0) {
                            alertify.error('You have already Selected this Diagnosis');
                            $scope.newSelectedDiagObj = "";
                            return false;
                        }
                        else {

                            var newobj = getDiagnosisOrderObj();
                            newobj.ConsultationDiagnosisId = 0;
                            newobj.DiagnosisDetailId = 0;
                            newobj.DiagnosisId = obj.DiagnosisId;
                            newobj.DiagnosisName = obj.ICD10DIAGNAME;
                            newobj.ICDCode = obj.ICD10CODE;
                            newobj.DeleteInd = "N";
                            $scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList.push(newobj);
                            $scope.newSelectedDiagObj = "";

                        }
                    } else {

                        angular.forEach($scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList, function (sitem, index) {
                            if (sitem.DiagnosisId == obj.DiagnosisId) {
                                $scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList.splice(index, 1);
                            }
                        });

                    }
                }


                $scope.removedSelectedDiagnosis = function (obj) {
                    angular.forEach($scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList, function (sitem, index) {
                        if (sitem.DiagnosisId == obj.DiagnosisId) {
                            if (obj.DiagnosisDetailId === 0) {
                                $scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList.splice(index, 1);
                            }
                            else {
                                obj.DeleteInd = 'Y';
                            }

                        }
                    });
                }



                $scope.onInvOrderProcedureChange = function () {
                    $scope.addUpdatePatientOrderImageDetailsReq.OrganizationInvestigationId = "";
                    $scope.addUpdatePatientOrderImageDetailsReq.InvestigationId = "";
                    $scope.addUpdatePatientOrderImageDetailsReq.ProcedureCode = "";
                    $scope.addUpdatePatientOrderImageDetailsReq.InvestigationName = "";
                    $scope.addUpdatePatientOrderImageDetailsReq.CPTCode = "";
                }

                $scope.onSelectOrderProcedureInv = function (obj) {

                    console.log(obj);

                    $scope.addUpdatePatientOrderImageDetailsReq.OrganizationProcedureId = obj.OrganizationProcedureId;
                    $scope.addUpdatePatientOrderImageDetailsReq.ProcedureId = obj.ProcedureId;
                    $scope.addUpdatePatientOrderImageDetailsReq.ProcedureCode = obj.ProcedureCode;
                    $scope.addUpdatePatientOrderImageDetailsReq.ProcedureName = obj.ProcedureName;
                    $scope.addUpdatePatientOrderImageDetailsReq.CPTCode = obj.CPTCode;
                };

            }
        });
        modalInstance.result.then(function (result) {
            console.log(result);
            $scope.navtoMainImageTab(2);

        }, function (cancel) {
        });



    }


    $scope.navtoAddOrderDiagnosisImages = function (selectedObj) {

        console.log(selectedObj);

        $scope.AddUpdateorderimagespopup(false, selectedObj.PatientOrderId)
    }


    function getnewImgemptyObj() {
        var obj = {
            "Index": 0,
            "S3URL": "",
            "DocumentId": "",
            "wrapper": "",
            "viewer": "",
            "total": "",
            "curSpan": "",
            "isDicomFile": false,
            "RightEyeIcon": false,
            "IsImage": false,
            "IsDicom": false,
            "IsPdf": false,
            "IsTiff": false
        };
        return obj;
    }

    $scope.ODImgObj = getnewImgemptyObj();

    $scope.OSImgObj = getnewImgemptyObj();

    var canvasEl = null;
    var ctx = null;
    var reader = null;
    var overlays = [];
    var curPos = { x: 0, y: 0 };
    var directiveParentNode = null;
    var picPos = { x: 0, y: 0 };
    var mousePos = { x: 0, y: 0 };
    var canvasSize = null;
    var resize = null;



    var canvasOSEl = null;
    var ctxOS = null;
    var directiveParentNodeOS = null;
    var readerOS = null;
    var overlaysOS = [];
    var curPosOS = { x: 0, y: 0 };
    var picPosOS = { x: 0, y: 0 };
    var mousePosOS = { x: 0, y: 0 };
    var resizeOS = null;
    var canvasSizeOS = null;
    var formatReader = new FormatReader();










    $scope.options = {
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
        flip: {
            h: 1,
            v: 1
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

    function getoption() {
        return $scope.options;
    }




    $scope.optionsOS = {
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
        flip: {
            h: 1,
            v: 1
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


    function onload() {
        if (reader == null) {
            return;
        }

        if (reader.rendered) {
            centerPics();
            applyTransform();
        } else {
            $scope.resizeTo($scope.options.controls.fit);
        }
    }


    $scope.resizeTo = function (value) {
        if ((ctx.canvas == null) || (reader == null)) {
            return;
        }

        // While the modal is still animating in, the panel measures 0x0. Fitting
        // against that yields a zero zoom and the image never becomes visible.
        // Bail out - the parentChange watcher re-fits once real dimensions exist.
        if (!canvasSize.clientWidth || !canvasSize.clientHeight) {
            return;
        }

        // Updates canvas size, to guarantee that zoom value is not computed as zero
        ctx.canvas.width = canvasSize.clientWidth;
        ctx.canvas.height = canvasSize.clientHeight;
        // Compute page ratio
        var options = $scope.options;
        var ratioH = ctx.canvas.height / reader.height;
        var ratioW = ctx.canvas.width / reader.width;
        // If reader render zoom itself
        // Precompute from its ratio
        if (!reader.isZoom) {
            ratioH *= $scope.options.zoom.value;
            ratioW *= $scope.options.zoom.value;
        }
        // Adjust value
        switch (value) {
            case 'width': $scope.options.zoom.value = ratioW; break;
            case 'height': $scope.options.zoom.value = ratioH; break;
            case 'auto': $scope.options.zoom.value = Math.min(ratioH, ratioW, 1); break;
            case 'page':
            default: $scope.options.zoom.value = Math.min(ratioH, ratioW);
        }
        $scope.$applyAsync(function () {
            // Round zoom value
            $scope.options.zoom.value = Math.round($scope.options.zoom.value * 100) / 100;
            // Update options state
            $scope.options.controls.fit = value;
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



    function onloadOS() {
        if (readerOS == null) {
            return;
        }
        console.log(readerOS.rendered + "__readerOS.rendered");
        if (readerOS.rendered) {
            centerPicsOS();
            applyTransformOS();
        } else {
            $scope.resizeToOS($scope.optionsOS.controls.fit);
        }
    }


    $scope.resizeToOS = function (value) {
        if ((ctxOS.canvas == null) || (readerOS == null)) {
            return;
        }

        // See resizeTo: fitting against a 0x0 panel yields a zero zoom.
        if (!canvasSizeOS.clientWidth || !canvasSizeOS.clientHeight) {
            return;
        }

        // Updates canvas size, to guarantee that zoom value is not computed as zero
        ctxOS.canvas.width = canvasSizeOS.clientWidth;
        ctxOS.canvas.height = canvasSizeOS.clientHeight;
        // Compute page ratio
        var options = $scope.optionsOS;
        var ratioHos = ctxOS.canvas.height / readerOS.height;
        var ratioWos = ctxOS.canvas.width / readerOS.width;
        // If readerOS render zoom itself
        // Precompute from its ratio
        if (!readerOS.isZoom) {
            ratioHos *= $scope.optionsOS.zoom.value;
            ratioWos *= $scope.optionsOS.zoom.value;
        }
        // Adjust value
        switch (value) {
            case 'width': $scope.optionsOS.zoom.value = ratioWos; break;
            case 'height': $scope.optionsOS.zoom.value = ratioHos; break;
            case 'auto': $scope.optionsOS.zoom.value = Math.min(ratioHos, ratioWos, 1); break;
            case 'page':
            default: $scope.optionsOS.zoom.value = Math.min(ratioHos, ratioWos);
        }
        $scope.$applyAsync(function () {
            // Round zoom value
            $scope.optionsOS.zoom.value = Math.round($scope.optionsOS.zoom.value * 100) / 100;
            // Update options state
            $scope.optionsOS.controls.fit = value;
            if (!readerOS.isZoom) {
                if (readerOS.refresh != null) {
                    readerOS.refresh();
                }

                // Re center image
                centerPicsOS();
            } else {
                // Re center image
                centerPicsOS();
                applyTransformOS();
            }
        });
    };




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
            picPosX = centerX - (reader.width * $scope.options.zoom.value) / 2;
            picPosY = centerY - (reader.height * $scope.options.zoom.value) / 2;
        } else {
            picPosX = centerX - (reader.width * $scope.options.zoom.value) / 2;
        }

        curPos = { x: picPosX, y: picPosY };
        picPos = { x: picPosX, y: picPosY };
    }






    var centerPicsOS = function () {
        // Updates canvas size before centering
        ctxOS.canvas.width = canvasSizeOS.clientWidth;
        ctxOS.canvas.height = canvasSizeOS.clientHeight;
        // Position to canvas center
        var centerXOS = ctxOS.canvas.width / 2;
        var centerYOS;
        var picPosXOS = 0;
        var picPosYOS = 0;

        if (readerOS.isImage) {
            centerYOS = ctxOS.canvas.height / 2;
            picPosXOS = centerXOS - (readerOS.width * $scope.optionsOS.zoom.value) / 2;
            picPosYOS = centerYOS - (readerOS.height * $scope.optionsOS.zoom.value) / 2;
        } else {
            picPosXOS = centerXOS - (readerOS.width * $scope.optionsOS.zoom.value) / 2;
        }

        curPosOS = { x: picPosXOS, y: picPosYOS };
        picPosOS = { x: picPosXOS, y: picPosYOS };
    };

    $scope.isDrawingOD = false;
    $scope.isDrawingOS = false;
    var penSize = 5; // Default pen size
    var penColor = '#000000'; // Default pen color

    // Annotation palette (new Image Management design). The chosen colour is
    // painted straight onto the viewer canvas, and saveCanvasDrawingDetails
    // persists that canvas via toDataURL() - so the colour is baked into the
    // saved PNG and needs no extra storage.
    $scope.penColorPalette = ['#EF4444', '#F59E0B', '#1D5558', '#2563EB', '#111827', '#FFFFFF'];
    $scope.penColor = penColor;

    $scope.setPenColor = function (color) {
        $scope.penColor = color;
        penColor = color;
    };

    $uibModalInstance.rendered.then(function () {


        canvasEl = document.getElementById("ODviewer");
        ctx = canvasEl.getContext('2d');
        $scope.options.ctx = ctx;
        canvasSize = canvasEl.parentNode;
        ctx.canvas.width = canvasSize.clientWidth;
        ctx.canvas.height = canvasSize.clientHeight;
        resize = { height: canvasSize.clientHeight, width: canvasSize.clientWidth };

        $scope.fileInputOD = $scope.emptyblackImage;
        $scope.options.zoom.value = 1.0;
        $scope.options.rotate.value = 0;
        $scope.options.flip = { h: 1, v: 1 };
        curPos = { x: 0, y: 0 };
        picPos = { x: 0, y: 0 };


        reader = formatReader.CreateReader("image/jpeg").create($scope.fileInputOD, $scope.options, onload, $q, $timeout);

        console.log(reader);



        canvasOSEl = document.getElementById("OSviewer");
        ctxOS = canvasOSEl.getContext('2d');
        $scope.optionsOS.ctx = ctxOS;
        canvasSizeOS = canvasOSEl.parentNode;
        ctxOS.canvas.width = canvasSizeOS.clientWidth;
        ctxOS.canvas.height = canvasSizeOS.clientHeight;
        resizeOS = { height: canvasSizeOS.clientHeight, width: canvasSizeOS.clientWidth };


        $scope.fileInputOS = $scope.emptyblackImageOS;
        $scope.optionsOS.zoom.value = 1.0;
        $scope.optionsOS.rotate.value = 0;
        $scope.optionsOS.flip = { h: 1, v: 1 };
        curPosOS = { x: 0, y: 0 };
        picPosOS = { x: 0, y: 0 };
        readerOS = formatReader.CreateReader("image/jpeg").create($scope.fileInputOS, $scope.optionsOS, onloadOS, $q, $timeout);


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

        $scope.$watch('options.zoom.value', function () {
            if (!$scope.options.controls.disableZoom) {
                applyTransform();
            }
        });

        $scope.$watch('options.rotate.value', function () {
            if (!$scope.options.controls.disableRotate) {
                applyTransform();
            }
        });

        $scope.$watch('options.controls.fit', function (value) {
            $scope.resizeTo(value);
        });



        // Watch for changes in parent element size
        $scope.$watch(parentChange, function () {
            resizeCanvas();
        }, true);







        $scope.$watch('overlaysOS', function (newarr, oldarr) {
            // initialize new overlay
            if (newarr === null || oldarr === null)
                return;

            // new added
            overlaysOS = [];
            angular.forEach(newarr, function (item) {
                overlaysOS.push(item);
            });

            applyTransformOS();
        }, true);

        $scope.$watch('optionsOS.zoom.value', function () {
            if (!$scope.optionsOS.controls.disableZoom) {
                applyTransformOS();
            }
        });

        $scope.$watch('optionsOS.rotate.value', function () {
            if (!$scope.optionsOS.controls.disableRotate) {
                applyTransformOS();
            }
        });

        $scope.$watch('optionsOS.controls.fit', function (value) {
            $scope.resizeToOS(value);
        });

        // Watch for changes in parent element size
        $scope.$watch(parentChangeOS, function () {
            resizeCanvasOS();
        }, true);

        $timeout(function () {
            $scope.resizeTo('page');
            $scope.resizeToOS('page');
        }, 1000);
        //$scope.ODImgObj.Index = 1;
        //$scope.ODImgObj.wrapper = document.querySelector("#image-gallery");
        //$scope.ODImgObj.viewer = new ImageViewer($scope.ODImgObj.wrapper.querySelector(".image-container"));
        //window.viewer = $scope.ODImgObj.viewer;

        //$scope.OSImgObj.Index = 1;
        //$scope.OSImgObj.wrapper = document.querySelector("#rimage-gallery");
        //$scope.OSImgObj.viewer = new ImageViewer($scope.OSImgObj.wrapper.querySelector(".image-container"));
        //window.viewer = $scope.OSImgObj.viewer;



        // Bind mousewheel
        angular.element(canvasEl).bind("DOMMouseScroll mousewheel onmousewheel", function ($event) {

            // cross-browser wheel delta
            if (!$scope.isDrawingOD) {
                onMouseWheelMove($event);
                if ($scope.syncEnabled) {
                    onMouseWheelMoveOS($event);
                }
            }
        });


        var ODisDrawing = false;
        var OSisDrawing = false;
        angular.element(canvasEl).bind('mousedown', function ($event) {
            if ($scope.isDrawingOD) {
                ODisDrawing = true; // Start drawing
                var x = event.offsetX;
                var y = event.offsetY;
                ctx.beginPath();
                ctx.moveTo(x, y);
            } else {
                if ($scope.options.controls.disableMove) {
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

        angular.element(canvasEl).bind('mouseup', function ($event) {

            if ($scope.isDrawingOD) {
                ODisDrawing = false; // Stop drawing
            }
            else {
                if ($scope.options.controls.disableMove) {
                    return;
                }

                $scope.canMove = false;
                if ($scope.syncEnabled) {
                    $scope.canMoveOS = false;
                }
            }

        });

        angular.element(canvasEl).bind('mousemove', function ($event) {

            if ($scope.isDrawingOD) {

                if (ODisDrawing) {
                    var x = event.offsetX;
                    var y = event.offsetY;
                    ctx.lineTo(x, y);
                    ctx.lineWidth = penSize; // Set pen size
                    ctx.strokeStyle = $scope.penColor || penColor; // Set pen color
                    ctx.stroke();
                }

            } else {
                mousePos.x = $event.offsetX;
                mousePos.y = $event.offsetY;
                if ($scope.options.controls.disableMove) {
                    return;
                }

                if ((reader !== null) && ($scope.canMove)) {
                    var coordX = $event.offsetX;
                    var coordY = $event.offsetY;
                    var translateX = coordX - curPos.x;
                    var translateY = coordY - curPos.y;
                    picPos.x += translateX;
                    picPos.y += translateY;
                    applyTransform();
                    curPos.x = coordX;
                    curPos.y = coordY;
                }

                if ($scope.syncEnabled) {
                    mousePosOS.x = $event.offsetX;
                    mousePosOS.y = $event.offsetY;
                    if ($scope.optionsOS.controls.disableMove) {
                        return;
                    }

                    if ((readerOS !== null) && ($scope.canMoveOS)) {
                        var coordX = $event.offsetX;
                        var coordY = $event.offsetY;
                        var translateX = coordX - curPosOS.x;
                        var translateY = coordY - curPosOS.y;
                        picPosOS.x += translateX;
                        picPosOS.y += translateY;
                        applyTransformOS();
                        curPosOS.x = coordX;
                        curPosOS.y = coordY;
                    }
                }
            }


        });

        // Bind mousewheel
        angular.element(canvasOSEl).bind("DOMMouseScroll mousewheel onmousewheel", function ($event) {

            if (!$scope.isDrawingOS) {
                // cross-browser wheel delta
                onMouseWheelMoveOS($event);

                if ($scope.syncEnabled) {
                    onMouseWheelMove($event);
                }
            }
        });




        angular.element(canvasOSEl).bind('mousedown', function ($event) {
            if ($scope.isDrawingOS) {
                OSisDrawing = true;
                var x = $event.offsetX;
                var y = $event.offsetY;
                ctxOS.beginPath();
                ctxOS.moveTo(x, y);
            } else {

                if ($scope.optionsOS.controls.disableMove) {
                    return;
                }

                $scope.canMoveOS = true;
                curPosOS.x = $event.offsetX;
                curPosOS.y = $event.offsetY;

                if ($scope.syncEnabled) {
                    $scope.canMove = true;
                    curPos.x = $event.offsetX;
                    curPos.y = $event.offsetY;
                }
            }

        });

        angular.element(canvasOSEl).bind('mouseup', function ($event) {
            if ($scope.isDrawingOS) {
                OSisDrawing = false; // Stop drawing
            }
            else {
                if ($scope.optionsOS.controls.disableMove) {
                    return;
                }

                $scope.canMoveOS = false;
                if ($scope.syncEnabled) {
                    $scope.canMove = false;
                }
            }
        });

        angular.element(canvasOSEl).bind('mousemove', function ($event) {

            if ($scope.isDrawingOS) {
                if (OSisDrawing) {
                    var x = $event.offsetX;
                    var y = $event.offsetY;
                    ctxOS.lineTo(x, y);
                    ctxOS.lineWidth = penSize; // Set pen size
                    ctxOS.strokeStyle = $scope.penColor || penColor; // Set pen color
                    ctxOS.stroke();
                }
            }
            else {
                mousePosOS.x = $event.offsetX;
                mousePosOS.y = $event.offsetY;
                if ($scope.optionsOS.controls.disableMove) {
                    return;
                }

                if ((readerOS !== null) && ($scope.canMoveOS)) {
                    var coordX = $event.offsetX;
                    var coordY = $event.offsetY;
                    var translateX = coordX - curPosOS.x;
                    var translateY = coordY - curPosOS.y;
                    picPosOS.x += translateX;
                    picPosOS.y += translateY;
                    applyTransformOS();
                    curPosOS.x = coordX;
                    curPosOS.y = coordY;
                }


                if ($scope.syncEnabled) {
                    mousePos.x = $event.offsetX;
                    mousePos.y = $event.offsetY;
                    if ($scope.options.controls.disableMove) {
                        return;
                    }

                    if ((reader !== null) && ($scope.canMove)) {
                        var coordX = $event.offsetX;
                        var coordY = $event.offsetY;
                        var translateX = coordX - curPos.x;
                        var translateY = coordY - curPos.y;
                        picPos.x += translateX;
                        picPos.y += translateY;
                        applyTransform();
                        curPos.x = coordX;
                        curPos.y = coordY;
                    }
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
                dataViewConfigs = prepareAndGetSimpleDataViewConfig();
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

                            const resetLayoutButton = document.getElementById('resetlayoutOD');
                            resetLayoutButton.disabled = false;
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


            var dwvElementOD = document.getElementById("dwvOD");
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
            // setup
            viewerSetup();

            //const positionInput = document.getElementById('position');
            //positionInput.addEventListener('change', function () {
            //    const vls = _app.getViewLayersByDataIndex(0);
            //    const vc = vls[0].getViewController();
            //    const values = this.value.split(',');
            //    vc.setCurrentPosition(new dwv.Point([
            //        parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])
            //    ])
            //    );
            //});

            const resetLayoutButton = document.getElementById('resetlayoutOD');
            if (resetLayoutButton) {
                resetLayoutButton.addEventListener('click', function () {
                    _app.resetLayout();
                });
            }



            //setupBindersCheckboxes();

            setupToolsCheckboxes();

            // bind app to input files
            //const fileinput = document.getElementById('fileinput');
            //fileinput.addEventListener('change', function (event) {
            //    console.log('%c ----------------', 'color: teal;');
            //    console.log(event.target.files);
            //    _app.loadFiles(event.target.files);
            //});
        }

        $scope.loadFroms3URL = function () {
            var array = []
            _app.loadURLs(array);
        }

        $scope.initOD = function () {
            onDOMContentLoaded();
        };
        $scope.initOD();
        /**
         * Append a layer div in the root 'dwv' one.
         *
         * @param {string} id The id of the layer.
         */
        function addLayerGroup(id) {
            console.log("layer called");
            const layerDiv = document.createElement('div');
            layerDiv.id = id;
            layerDiv.className = 'layerGroup';
            const root = document.getElementById('dwvOD');
            root.appendChild(layerDiv);
        }

        function prepareAndGetSimpleDataViewConfig() {
            console.log("prepare called");
            // clean up
            const dwvDiv = document.getElementById('dwvOD');
            dwvDiv.innerHTML = '';
            // add div
            addLayerGroup('layerGroupAOD');
            return { '*': [{ divId: 'layerGroupAOD' }] };
        }


        function prepareAndGetMPRDataViewConfig() {
            // clean up
            const dwvDiv = document.getElementById('dwvOD');
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

        function setupToolsCheckboxes() {
            const toolsDiv = document.getElementById('toolsOD');
            if (!toolsDiv) { return; }
            var element = angular.element(toolsDiv);
            element.empty();
            const keys = Object.keys(_tools);

            const getChangeTool = function (tool) {
                return function () {
                    _app.setTool(tool);
                    if (tool === 'Draw') {
                        _app.setToolFeatures({ shapeName: 'Rectangle' });
                    }
                };
            };

            const getKeyCheck = function (char, input) {
                return function (event) {
                    if (!event.ctrlKey &&
                        !event.altKey &&
                        !event.shiftKey &&
                        event.key === char) {
                        input.click();
                    }
                };
            };

            for (let i = 0; i < keys.length; ++i) {
                const key = keys[i];

                const input = document.createElement('input');
                input.id = 'toolOD-' + i;
                input.name = 'toolsOD';
                input.type = 'radio';
                input.onchange = getChangeTool(key);

                if (key === 'Scroll') {
                    input.checked = true;
                }

                const label = document.createElement('label');
                label.htmlFor = input.id;
                label.appendChild(document.createTextNode(key));

                toolsDiv.appendChild(input);
                toolsDiv.appendChild(label);

                // keyboard shortcut
                window.addEventListener(
                    'keydown', getKeyCheck(key[0].toLowerCase(), input));
            }
        }

        function getSelectedToolOD() {
            const toolsInput = document.getElementsByName('toolsOD');
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










        let _appOS = null;
        let _toolsOS = null;


        const _modeOS = 0;
        const _dicomWebOS = false;

        function viewerSetupOS() {
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
            let dataViewConfigsOS;
            let viewOnFirstLoadItemOS = true;

            // use for concurrent load
            const numberOfDataToLoadOS = 1;

            if (_modeOS === 0) {
                // simplest: one layer group
                dataViewConfigsOS = prepareAndGetSimpleDataViewConfigOS();
            } else if (_modeOS === 1) {
                // MPR
                viewOnFirstLoadItemOS = false;
                dataViewConfigsOS = prepareAndGetMPRDataViewConfigOS();
            } else if (_modeOS === 2) {
                // simple side by side
                addLayerGroupOS('layerGroupAOS');
                addLayerGroupOS('layerGroupB');
                dataViewConfigsOS = {
                    0: [
                        {
                            divId: 'layerGroupAOS'
                        }
                    ],
                    1: [
                        {
                            divId: 'layerGroupB'
                        }
                    ]
                };
            } else if (_modeOS === 3) {
                // multiple data, multiple layer group
                addLayerGroupOS('layerGroupAOS');
                addLayerGroupOS('layerGroupB');
                dataViewConfigsOS = {
                    0: [
                        {
                            divId: 'layerGroupAOS'
                        },
                        {
                            divId: 'layerGroupB'
                        }
                    ],
                    1: [
                        {
                            divId: 'layerGroupAOS'
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
            _toolsOS = {
                Scroll: {},
                WindowLevel: {},
                ZoomAndPan: {},
                Opacity: {}
            };

            // app config
            const optionsOS = new dwv.AppOptions(dataViewConfigsOS);
            optionsOS.tools = _toolsOS;
            optionsOS.viewOnFirstLoadItem = viewOnFirstLoadItemOS;
            // app
            _appOS = new dwv.App();
            _appOS.init(optionsOS);




            _appOS.addEventListener('loaditem', function (event) {
                if (typeof event.warn !== 'undefined') {
                    console.warn('load-warn', event.warn);
                }
            });
            _appOS.addEventListener('loadend', function (event) {
                //console.timeEnd('load-data-' + event.loadid);
            });

            let dataLoadOS = 0;
            const firstRenderOS = [];
            _appOS.addEventListener('loadend', function (event) {
                // update UI at first render
                if (!firstRenderOS.includes(event.loadid)) {
                    // store data id
                    firstRenderOS.push(event.dataid);
                    // log meta data
                    if (event.loadtype === 'image') {
                        //console.log('metadata',
                        //    getMetaDataWithNamesOS(_appOS.getMetaData(event.loadid)));
                        // add data row
                        //addDataRowOS(event.loadid);
                        ++dataLoadOS;
                        // init gui
                        if (dataLoadOS === numberOfDataToLoadOS) {
                            // select tool
                            _appOS.setTool(getSelectedToolOS());


                            const resetLayoutButton = document.getElementById('resetlayoutOS');
                            resetLayoutButton.disabled = false;
                        }
                    }
                }

                console.log(event.loadtype);
                console.log(event.loadid);
                //if (event.loadtype === 'image') {
                //    // log SEG details
                //   // logFramePosPatsOS(_appOS.getMetaData(event.loadid));

                //    // example usage of a dicom SEG as data mask
                //    const useSegAsMaskOS = false;
                //    if (useSegAsMaskOS) {
                //        // image to filter
                //        const imgDataIndex = 0;
                //        const vls = _appOS.getViewLayersByDataIndex(imgDataIndex);
                //        const vc = vls[0].getViewController();
                //        const img = _appOS.getImage(imgDataIndex);
                //        const imgGeometry = img.getGeometry();
                //        const sliceSize = imgGeometry.getSize().getDimSize(2);
                //        // SEG image
                //        const segImage = _appOS.getImage(event.loadid);
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

            var dwvElementOS = document.getElementById("dwvOS");
            angular.element(dwvElementOS).bind('mousedown', function ($event) {

                _appOS.defaultOnKeydown($event);
                // mask segment related
                if (!isNaN(parseInt($event.key, 10))) {
                    const vc =
                        _appOS.getActiveLayerGroup().getActiveViewLayer().getViewController();
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
                                vc.deleteSegment(number, _appOS.addToUndoStack);
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
            //    _appOS.defaultOnKeydown(event);
            //    // mask segment related
            //    if (!isNaN(parseInt(event.key, 10))) {
            //        const vc =
            //            _appOS.getActiveLayerGroup().getActiveViewLayer().getViewController();
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
            //                    vc.deleteSegment(number, _appOS.addToUndoStack);
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
            //    _appOS.onResize();
            //});

            const uriOptionsOS = {};
            // special dicom web request header
            if (_dicomWebOS) {
                uriOptionsOS.requestHeaders = [{
                    name: 'Accept',
                    value: 'multipart/related; type="application/dicom"; transfer-syntax=*'
                }];
            }
            // load from window location
            _appOS.loadFromUri(window.location.href, uriOptionsOS);
        }


        function onDOMContentLoadedOS() {
            // setup
            viewerSetupOS();


            const resetLayoutButton = document.getElementById('resetlayoutOS');
            if (resetLayoutButton) {
                resetLayoutButton.addEventListener('click', function () {
                    _appOS.resetLayout();
                });
            }



            // setupBindersCheckboxesOS();

            setupToolsCheckboxesOS();



        }


        $scope.initOS = function () {
            onDOMContentLoadedOS();
        };
        $scope.initOS();

        function addLayerGroupOS(id) {
            const layerDiv = document.createElement('div');
            layerDiv.id = id;
            layerDiv.className = 'layerGroup';
            const root = document.getElementById('dwvOS');
            root.appendChild(layerDiv);
        }

        function prepareAndGetSimpleDataViewConfigOS() {
            // clean up
            const dwvDiv = document.getElementById('dwvOS');
            dwvDiv.innerHTML = '';
            // add div
            addLayerGroupOS('layerGroupAOS');
            return { '*': [{ divId: 'layerGroupAOS' }] };
        }


        function prepareAndGetMPRDataViewConfigOS() {
            // clean up
            const dwvDiv = document.getElementById('dwvOS');
            dwvDiv.innerHTML = '';
            // add divs
            addLayerGroupOS('layerGroupAOS');
            addLayerGroupOS('layerGroupC');
            addLayerGroupOS('layerGroupS');
            return {
                '*': [
                    {
                        divId: 'layerGroupAOS',
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


        function getLayerGroupDivIdsOS(dataViewConfigs) {
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

        function getDataLayerGroupIdsOS(dataViewConfig) {
            const divIds = [];
            for (let j = 0; j < dataViewConfig.length; ++j) {
                divIds.push(dataViewConfig[j].divId);
            }
            return divIds;
        }

        function setupBindersCheckboxesOS() {
            const bindersDiv = document.getElementById('bindersOS');
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
                binders.push(propList[b] + 'BinderOS');
            }
            _appOS.setLayerGroupsBinders(binders);

            /**
             * Add a binder.
             *
             * @param {string} propName The name of the property to bind.
             */
            function addBinder(propName) {
                binders.push(propName + 'BinderOS');
                _appOS.setLayerGroupsBinders(binders);
            }
            /**
             * Remove a binder.
             *
             * @param {string} propName The name of the property to bind.
             */
            function removeBinder(propName) {
                const index = binders.indexOf(propName + 'BinderOS');
                if (index !== -1) {
                    binders.splice(index, 1);
                }
                _appOS.setLayerGroupsBinders(binders);
            }
            /**
             * Get the input change handler for a binder.
             *
             * @param {string} propName The name of the property to bind.
             * @returns {object} The handler.
             */
            function getOnInputChangeOS(propName) {
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
                input.id = 'binderOS-' + i;
                input.type = 'checkbox';
                input.checked = true;
                input.onchange = getOnInputChangeOS(propName);

                const label = document.createElement('label');
                label.htmlFor = input.id;
                label.appendChild(document.createTextNode(propName));

                bindersDiv.appendChild(input);
                bindersDiv.appendChild(label);
            }

            // check all
            const allInput = document.createElement('input');
            allInput.id = 'binderOS-all';
            allInput.type = 'checkbox';
            allInput.checked = true;
            allInput.onchange = function () {
                for (let j = 0; j < propList.length; ++j) {
                    document.getElementById('binderOS-' + j).click();
                }
            };
            const allLabel = document.createElement('label');
            allLabel.htmlFor = allInput.id;
            allLabel.appendChild(document.createTextNode('all'));
            bindersDiv.appendChild(allInput);
            bindersDiv.appendChild(allLabel);
        }

        function setupToolsCheckboxesOS() {
            const toolsDiv = document.getElementById('toolsOS');
            if (!toolsDiv) { return; }
            var element = angular.element(toolsDiv);
            element.empty();
            const keys = Object.keys(_tools);

            const getChangeTool = function (tool) {
                return function () {
                    _appOS.setTool(tool);
                    if (tool === 'Draw') {
                        _appOS.setToolFeatures({ shapeName: 'Rectangle' });
                    }
                };
            };

            const getKeyCheck = function (char, input) {
                return function (event) {
                    if (!event.ctrlKey &&
                        !event.altKey &&
                        !event.shiftKey &&
                        event.key === char) {
                        input.click();
                    }
                };
            };

            for (let i = 0; i < keys.length; ++i) {
                const key = keys[i];

                const input = document.createElement('input');
                input.id = 'toolOS-' + i;
                input.name = 'toolsOS';
                input.type = 'radio';
                input.onchange = getChangeTool(key);

                if (key === 'Scroll') {
                    input.checked = true;
                }

                const label = document.createElement('label');
                label.htmlFor = input.id;
                label.appendChild(document.createTextNode(key));

                toolsDiv.appendChild(input);
                toolsDiv.appendChild(label);

                // keyboard shortcut
                window.addEventListener(
                    'keydown', getKeyCheck(key[0].toLowerCase(), input));
            }
        }

        function getSelectedToolOS() {
            const toolsInput = document.getElementsByName('toolsOS');
            let toolIndex = null;
            for (let j = 0; j < toolsInput.length; ++j) {
                if (toolsInput[j].checked) {
                    toolIndex = j;
                    break;
                }
            }
            return Object.keys(_toolsOS)[toolIndex];
        }

        function bindAppToControlsOS() {
            _appOS.addEventListener('wlchange', onWLChangeOS);
            _appOS.addEventListener('opacitychange', onOpacityChangeOS);
        }

        function unbindAppToControlsOS() {
            _appOS.removeEventListener('wlchange', onWLChangeOS);
            _appOS.removeEventListener('opacitychange', onOpacityChangeOS);
        }

        function onWLChangeOS(event) {
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


        function onOpacityChangeOS(event) {
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


        function clearDataTableOS() {
            const detailsDiv = document.getElementById('layersdetailsOS');
            detailsDiv.innerHTML = '';
        }


        function getControlDivOS(id, name, min, max, value, callback, precision) {
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


        function addDataRowOS(id) {
            // bind app to controls on first id
            if (id === 0) {
                bindAppToControlsOS();
            }

            const dataViewConfigs = _appOS.getDataViewConfigs();
            const allLayerGroupDivIds = getLayerGroupDivIdsOS(dataViewConfigs);
            // use first view layer
            const vls = _appOS.getViewLayersByDataIndex(id);
            const vl = vls[0];
            const vc = vl.getViewController();
            const wl = vc.getWindowLevel();

            let table = document.getElementById('layerstableOS');
            let body;
            // create table if not present
            if (!table) {
                table = document.createElement('table');
                table.id = 'layerstableOS';
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
                const div = document.getElementById('layersdetailsOS');
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
            const dataLayerGroupsIds = getDataLayerGroupIdsOS(viewConfig);
            for (let l = 0; l < allLayerGroupDivIds.length; ++l) {
                const layerGroupDivId = allLayerGroupDivIds[l];
                cell = row.insertCell();
                if (!dataLayerGroupsIds.includes(layerGroupDivId)) {
                    continue;
                }
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = 'layerselectOS-' + l;
                radio.id = 'layerselectOS-' + layerGroupDivId + '-' + id;
                radio.checked = true;
                radio.onchange = function (event) {
                    const fullId = event.target.id;
                    const split = fullId.split('-');
                    const groupDivId = split[1];
                    const dataId = split[2];
                    const lg = _appOS.getLayerGroupByDivId(groupDivId);
                    lg.setActiveViewLayerByDataIndex(parseInt(dataId, 10));
                };
                cell.appendChild(radio);
            }

            const image = _appOS.getImage(vl.getDataIndex());
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
            cell.appendChild(getControlDivOS(minId, 'min',
                dataRange.min, dataRange.max, dataRange.min,
                changeAlphaFunc, floatPrecision));
            cell.appendChild(getControlDivOS(maxId, 'max',
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
            cell.appendChild(getControlDivOS(widthId, 'width',
                0, rescaledDataRange.max - rescaledDataRange.min, wl.width,
                changeContrast, floatPrecision));
            cell.appendChild(getControlDivOS(centerId, 'center',
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
            cell.appendChild(getControlDivOS(opacityId, 'opacity',
                0, 1, vl.getOpacity(), changeOpacity, floatPrecision));
        }


        function comparePosPatOS(a, b) {
            const za = parseFloat(a.split('\\').at(-1));
            const zb = parseFloat(b.split('\\').at(-1));
            return za - zb;
        }


        function sortByPosPatKeyOS(obj) {
            const keys = Object.keys(obj);
            keys.sort(comparePosPatOS);
            const sorted = new Map();
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                sorted.set(key, obj[key]);
            }
            return sorted;
        }


        function getPrecisionRoundOS(precision) {
            return function (x) {
                return dwv.precisionRound(x, precision);
            };
        }


        function logFramePosPatsOS(elements) {
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


        function getMetaDataWithNamesOS(metaData) {
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


        $scope.getPatientOrderDetailsList = function (spatientOrderId) {

            var spatientOrderId = spatientOrderId || 0;

            console.log($scope.getOrderSearchReq);

            eHnotePatientDataService.GetPatientOrderInterpretationDetails($scope.getOrderSearchReq).then(function (resp) {

                console.log(resp);
                if (resp.data.rows.length > 0) {
                    $scope.PatientAllOrdersList = resp.data.rows || [];
                    $scope.PatientAllOrdersList = (resp.data.rows || []).map(function (item) {
                        // Filter PatientFiles with valid (non-empty) S3URL
                        if (Array.isArray(item.PatientFiles)) {
                            item.PatientFiles = item.PatientFiles.filter(function (file) {
                                return file.S3URL && file.S3URL.trim() !== '';
                            });
                        }

                        return item;
                    }).filter(function (item) {
                        // Keep only items that have PatientFiles after filtering
                        return item.PatientFiles && item.PatientFiles.length > 0;
                    });


                    angular.forEach($scope.PatientAllOrdersList, function (iitem) {
                        iitem.IsActive = false;
                        iitem.IsImagesAvailable = false;
                        iitem.PatientFiles = iitem.PatientFiles || [];
                        if (iitem.PatientFiles.length > 0) {
                            iitem.IsImagesAvailable = true;
                        }
                        angular.forEach(iitem.PatientFiles, function (pitem) {
                            pitem.IsChecked = false;
                        });
                    });


                    if ($scope.PatientAllOrdersList.length > 0) {

                        $scope.ConsultationPatientOrderId = $scope.ConsultationPatientOrderId || 0;
                        spatientOrderId = spatientOrderId || 0;
                        var sfilteredArray = $filter("filter")($scope.PatientAllOrdersList, { "PatientOrderId": $scope.ConsultationPatientOrderId }, true);
                        var filteredArray = $filter("filter")($scope.PatientAllOrdersList, { "PatientOrderId": spatientOrderId }, true);
                        if ($scope.ConsultationPatientOrderId !== 0 && sfilteredArray.length > 0) {


                            if (sfilteredArray.length > 0) {

                                angular.forEach($scope.PatientAllOrdersList, function (iitem) {
                                    if (sfilteredArray[0].PatientOrderId == iitem.PatientOrderId) {
                                        iitem.IsActive = true;
                                    }

                                });
                                $scope.showOrderInterpretation(sfilteredArray[0]);
                            }

                        }
                        else if (spatientOrderId !== 0 && filteredArray.length > 0) {
                            $scope.showOrderInterpretation(filteredArray[0]);
                        }
                        else {
                            $scope.showOrderInterpretation($scope.PatientAllOrdersList[0]);
                        }
                    }
                }

            }, function (err) {
                console.log(err);
                alertify.error("Getting Failed");
            });
        }
        $scope.showOrderInterpretation = function (obj, Mobj) {

            //if (!obj.IsActive) {
            //    return;
            //}

            $scope.selectedImageStudyFiles.LeftEyeFiles = [];
            $scope.selectedImageStudyFiles.RightEyeFiles = [];
            $scope.selectedImageStudyFiles.BothEyeFiles = [];
            $scope.selectedImageStudyFiles.AllFiles = [];
            $scope.InterpretationSummaryArray = [];



            $scope.selectedImageStudyObj = getnewImageStudyDetailsAddReqObj();
            $scope.selectedImageStudyObj.OrderName = obj.ProcedureName;
            $scope.selectedImageStudyObj.ConnectedDiagnosisList = obj.DiagnosisList || [];
            $scope.selectedImageStudyObj.PatientImageStudyId = obj.PatientImageStudyId || 0;
            $scope.selectedImageStudyObj.PatientOrderId = obj.PatientOrderId || 0;
            $scope.selectedImageStudyObj.ModalityId = obj.ModalityId;
            $scope.selectedImageStudyObj.ModalityName = obj.ModalityName;
            $scope.selectedImageStudyObj.InvestigationId = obj.ProcedureId;
            $scope.selectedImageStudyObj.ImageQuality = obj.ImageQuality || "";
            $scope.selectedImageStudyObj.SelectedEye = obj.OrganId || null;

            $scope.selectedImageStudyObj.OPChartStatus = obj.OPChartStatus||"";
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

            console.log($scope.selectedImageStudyObj.ConsultationId + "__ConsultationId");




            canvasEl = document.getElementById("ODviewer");
            ctx = canvasEl.getContext('2d');
            $scope.options.ctx = ctx;
            canvasSize = canvasEl.parentNode;
            ctx.canvas.width = canvasSize.clientWidth;
            ctx.canvas.height = canvasSize.clientHeight;
            resize = { height: canvasSize.clientHeight, width: canvasSize.clientWidth };

            $scope.fileInputOD = $scope.emptyblackImage;
            $scope.options.zoom.value = 1.0;
            $scope.options.rotate.value = 0;
            $scope.options.flip = { h: 1, v: 1 };
            curPos = { x: 0, y: 0 };
            picPos = { x: 0, y: 0 };


            reader = formatReader.CreateReader("image/jpeg").create($scope.fileInputOD, $scope.options, onload, $q, $timeout);

            console.log(reader);



            canvasOSEl = document.getElementById("OSviewer");
            ctxOS = canvasOSEl.getContext('2d');
            $scope.optionsOS.ctx = ctxOS;
            canvasSizeOS = canvasOSEl.parentNode;
            ctxOS.canvas.width = canvasSizeOS.clientWidth;
            ctxOS.canvas.height = canvasSizeOS.clientHeight;
            resizeOS = { height: canvasSizeOS.clientHeight, width: canvasSizeOS.clientWidth };


            $scope.fileInputOS = $scope.emptyblackImageOS;
            $scope.optionsOS.zoom.value = 1.0;
            $scope.optionsOS.rotate.value = 0;
            $scope.optionsOS.flip = { h: 1, v: 1 };
            curPosOS = { x: 0, y: 0 };
            picPosOS = { x: 0, y: 0 };
            readerOS = formatReader.CreateReader("image/jpeg").create($scope.fileInputOS, $scope.optionsOS, onloadOS, $q, $timeout);


            $timeout(function () {
                $scope.resizeTo('page');
                $scope.resizeToOS('page');
            }, 1000);


            if (ctx != undefined) {
                let canvas = ctx.canvas;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();
            }
            if (ctxOS != undefined) {
                let canvasos = ctxOS.canvas;
                ctxOS.clearRect(0, 0, canvasos.width, canvasos.height);
                ctxOS.save();
            }
            if (obj.PatientFiles.length > 0) {

                //$scope.OSImgObj.LeftEyeIcon = false;
                //$scope.ODImgObj.RightEyeIcon = false;

                $scope.selectedImageStudyFiles.AllFiles = obj.PatientFiles || [];


                angular.forEach($scope.selectedImageStudyFiles.AllFiles, function (sitem) {
                    sitem.S3URL = sitem.S3URL || "";
                    $scope.isDicomFile = $scope.checkDicomFile(sitem.S3URL);
                    sitem.isDicomFile = $scope.isDicomFile;
                    if (sitem.OrganId === 1 || sitem.OrganId === 3) {

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

                        if (sitem.DocumentExt == 'image/jpeg' || sitem.DocumentExt == 'image/png' || sitem.DocumentExt == 'png' || sitem.DocumentExt == 'pdf' || sitem.DocumentExt == 'Pdf' || sitem.DocumentExt == 'jpg' || sitem.DocumentExt == 'tif' || sitem.DocumentExt == 'image/tiff' || sitem.DocumentExt == 'application/pdf') {

                            $scope.ODImgObj.RightEyeIcon = false;
                            $scope.clickonParticularImage($scope.selectedImageStudyFiles.RightEyeFiles[0], 0, 'onLoad');
                        } else {

                            $scope.ODImgObj.RightEyeIcon = true;
                        }

                    }
                    if (sitem.OrganId === 2 || sitem.OrganId === 3) {



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
                        if (sitem.DocumentExt == 'image/jpeg' || sitem.DocumentExt == 'image/png' || sitem.DocumentExt == 'png' || sitem.DocumentExt == 'pdf' || sitem.DocumentExt == 'Pdf' || sitem.DocumentExt == 'jpg' || sitem.DocumentExt == 'tif' || sitem.DocumentExt == 'image/tiff' || sitem.DocumentExt == 'application/pdf') {
                            $scope.OSImgObj.LeftEyeIcon = false;
                            $scope.clickonRParticularImage($scope.selectedImageStudyFiles.LeftEyeFiles[0], 0, 'onLoad');

                        } else {
                            $scope.OSImgObj.LeftEyeIcon = true;
                        }


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
                $scope.selectedImageStudyFiles.LeftEyeFiles = [];
                $scope.selectedImageStudyFiles.RightEyeFiles = [];
                $scope.selectedImageStudyFiles.BothEyeFiles = [];
                $scope.selectedImageStudyFiles.AllFiles = [];
            }


            let LogItem = {
                "SubModuleId": 7,
                "SubModuleName": "Image Management",
                "ScreenType": "ASC List",
                "ActionType": "Accessed",
                "ActionDescription": ` Images of order ${obj.ProcedureName} for Appointment ID: ${obj.AppointmentId}`,
            }
           // $scope.AddAuditLog(LogItem);

            if (obj.PatientImageStudyId !== 0) {
                $scope.getPatientImageStudyDetailsById(obj);
            }

            if ($scope.ImageObj.PatientImageInd == true) {
                $scope.getPatientAdvisedDiagnosisList($scope.selectedImageStudyObj.PatientOrderId);
            }

            //$scope.navtoInvestigationPreview();

        }


        $scope.navtoMainImageTab = function (tabno) {
            $scope.getOrderSearchReq.ModalityId = 0;
            $scope.getOrderImagesObj.ModalityId = 0;

            $scope.imageMainTab = tabno;
            $scope.selectedImageStudyObj = getnewImageStudyDetailsAddReqObj();

            $scope.ODImgObj = getnewImgemptyObj();

            $scope.OSImgObj = getnewImgemptyObj();

            $scope.selectedImageStudyFiles.LeftEyeFiles = [];
            $scope.selectedImageStudyFiles.RightEyeFiles = [];
            $scope.selectedImageStudyFiles.BothEyeFiles = [];
            $scope.selectedImageStudyFiles.AllFiles = [];
            $scope.selectionImageData.SelectedFiles = [];
            $scope.PirticulardayImagesArray = [];



            if ($scope.imageMainTab === 2) {
                $scope.ImageObj.PatientImageInd = true;
                $scope.ODinvImgObj = getnewImgemptyObj();
                $scope.getPatientVisitInvestagationfiles(0);


            }

            if ($scope.imageMainTab === 1) {
                //$scope.getPatientImageStudyList();
                $scope.getPatientOrderDetailsList();
            }

        };

        $scope.clickonParticularImage = function (obj, index, typpe) {

            console.log("clickonParticularImage called");


            $scope.ODImgObj.Index = index;
            $scope.ODImgObj.S3URL = obj.small;
            $scope.ODImgObj.DocumentId = obj.DocumentId;
            $scope.ODImgObj.isDicomFile = obj.isDicomFile;


            $scope.ODImgObj.IsImage = false;
            $scope.ODImgObj.IsPdf = false;
            $scope.ODImgObj.IsDicom = false;
            $scope.ODImgObj.IsTiff = false;

            console.log(obj.FileType + "__FileType");

            if (obj.FileType == "image/jpeg" || obj.FileType == "image/png" || obj.FileType == "image/jpg" || obj.FileType == "jpg" || obj.FileType == "png" || obj.FileType == "jpeg") {
                $scope.ODImgObj.IsImage = true;
            }
            else if (obj.FileType == "application/pdf" || obj.FileType == "application/Pdf" || obj.FileType == "pdf" || obj.FileType == "Pdf") {
                $scope.ODImgObj.IsPdf = true;
            }
            else if (obj.FileType == "image/tiff" || obj.FileType == "image/TIFF" || obj.FileType == "tiff" || obj.FileType == "tif") {
                $scope.ODImgObj.IsTiff = true;
            }
            else if (obj.FileType == "DCM" || obj.FileType == "dcm") {
                $scope.ODImgObj.IsDicom = true;
            }

            console.log($scope.ODImgObj.IsImage + "_IsImage_");
            angular.forEach($scope.selectedImageStudyFiles.RightEyeFiles, function (sitem) {
                sitem.isActive = false;
            });
            obj.isActive = true;
            if ($scope.ODImgObj.IsImage) {
                var oloadType = typpe || "";

                // $scope.showODImage();


                if ($scope.ODImgObj.isDicomFile) {

                    /*  if (oloadType != 'onLoad') {*/

                    onDOMContentLoaded();
                    var array = [];
                    array.push($scope.ODImgObj.S3URL);
                    _app.loadURLs(array);
                    //  }

                }
                else {
                    $scope.fileInputOD = obj.small;
                    $scope.options.zoom.value = 1.0;
                    $scope.options.rotate.value = 0;
                    $scope.options.flip = { h: 1, v: 1 };
                    curPos = { x: 0, y: 0 };
                    picPos = { x: 0, y: 0 };
                    reader = formatReader.CreateReader("image/jpeg").create($scope.fileInputOD, $scope.options, onload, $q, $timeout);
                    // applyTransform();
                    $timeout(function () {
                        $scope.resizeTo('page');
                    }, 1000);
                }
            }
            else if ($scope.ODImgObj.IsPdf) {

                $scope.getTrustedUrl = function (url) {

                    var modifiedUrl = url + "#pagemode=none&zoom=52";
                    return $sce.trustAsResourceUrl(modifiedUrl);
                };
            }


            $scope.checkSyncButton();


        }

        $scope.clickonRParticularImage = function (obj, index, typpe) {
            console.log("clickonRParticularImage called");
            console.log(obj.small);

            $scope.OSImgObj.Index = index;
            $scope.OSImgObj.S3URL = obj.small;
            $scope.OSImgObj.DocumentId = obj.DocumentId;
            $scope.OSImgObj.isDicomFile = obj.isDicomFile;
            var oloadType = typpe || "";
            angular.forEach($scope.selectedImageStudyFiles.LeftEyeFiles, function (sitem) {
                sitem.isActive = false;
            });
            obj.isActive = true;


            $scope.OSImgObj.IsImage = false;
            $scope.OSImgObj.IsPdf = false;
            $scope.OSImgObj.IsDicom = false;
            $scope.OSImgObj.IsTiff = false;



            if (obj.FileType == "image/jpeg" || obj.FileType == "image/png" || obj.FileType == "image/jpg" || obj.FileType == "jpg" || obj.FileType == "jpeg" || obj.FileType == "png") {
                $scope.OSImgObj.IsImage = true;

            }
            else if (obj.FileType == "application/pdf" || obj.FileType == "application/Pdf" || obj.FileType == "pdf" || obj.FileType == "Pdf") {
                $scope.OSImgObj.IsPdf = true;
            }
            else if (obj.FileType == "image/tiff" || obj.FileType == "image/TIFF" || obj.FileType == "tiff" || obj.FileType == "tif") {
                $scope.OSImgObj.IsTiff = true;
            }
            else if (obj.FileType == "DCM") {
                $scope.OSImgObj.IsDicom = true;
            }
            // $scope.showOSImage();

            if ($scope.OSImgObj.IsImage) {
                if ($scope.OSImgObj.isDicomFile) {
                    onDOMContentLoadedOS();
                    var array = [];
                    array.push($scope.OSImgObj.S3URL);
                    _appOS.loadURLs(array);
                }
                else {

                    $scope.fileInputOS = obj.small;
                    $scope.optionsOS.zoom.value = 1.0;
                    $scope.optionsOS.rotate.value = 0;
                    $scope.optionsOS.flip = { h: 1, v: 1 };
                    curPosOS = { x: 0, y: 0 };
                    picPosOS = { x: 0, y: 0 };
                    readerOS = formatReader.CreateReader("image/jpeg").create($scope.fileInputOS, $scope.optionsOS, onloadOS, $q, $timeout);
                    $timeout(function () {
                        $scope.resizeToOS('page');
                    }, 2000);
                }
            }
            else if ($scope.OSImgObj.IsPdf) {

                $scope.getTrustedUrl = function (url) {

                    var modifiedUrl = url + "#pagemode=none&zoom=52";
                    return $sce.trustAsResourceUrl(modifiedUrl);
                };
            }

            $scope.checkSyncButton();
        };


        $timeout(function () {
            $scope.getPatientOrderDetailsList();
        }, 2000);


        $scope.MasterModalityArray = ModalitiesArray || [];

        if ($scope.MasterModalityArray.length > 0) {
            var mobj = {
                "ModalityId": 0,
                "ModalityName": "All",
                "ModalityShortName": "All"
            };
            $scope.MasterModalityArray.unshift(mobj);
        } else {
            eHnoteDiagnosisDataServices.GetAllMasterConsultationData().then(function (resp) {
                if (resp.data.Modalities.length > 0) {
                    $scope.MasterModalityArray = resp.data.Modalities || [];
                    var mobj = {
                        "ModalityId": 0,
                        "ModalityName": "All",
                        "ModalityShortName": "All"
                    };
                    $scope.MasterModalityArray.unshift(mobj);
                }
            }, function (err) {
                console.log(err);
            });
        }


        console.log($scope.MasterModalityArray);
        console.log("modalities");
    });

    $scope.checkSyncButton = function () {
        $scope.getOrderImagesObj.showSyncButton = true;
        if ($scope.ODImgObj.isDicomFile || $scope.OSImgObj.isDicomFile) {
            $scope.getOrderImagesObj.showSyncButton = false;
        }
    }
    //$scope.ODImgObj.wrapper = document.querySelector("#image-gallery");
    //$scope.ODImgObj.viewer = new ImageViewer($scope.ODImgObj.wrapper.querySelector(".image-container"));
    //window.viewer = $scope.ODImgObj.viewer;

    //$scope.OSImgObj.Index = 1;
    //$scope.OSImgObj.wrapper = document.querySelector("#rimage-gallery");
    //$scope.OSImgObj.viewer = new ImageViewer($scope.OSImgObj.wrapper.querySelector(".image-container"));
    //window.viewer = $scope.OSImgObj.viewer;


    $scope.showODimageViewer = function () {
        $scope.showODImage()
    }
    $scope.showODImage = function () {


        console.log($scope.selectedImageStudyFiles.RightEyeFiles);
        console.log($scope.ODImgObj.Index);
        const imgObj = $scope.selectedImageStudyFiles.RightEyeFiles[$scope.ODImgObj.Index - 1];
        console.log(imgObj);



        if ($scope.selectedImageStudyFiles.RightEyeFiles.length > 0) {
            $scope.ODImgObj.viewer.load(imgObj.small, imgObj.big);
        } else {
            $scope.ODImgObj.viewer.load("", "");
        }

    }
    $scope.nextODimgClick = function () {
        $scope.ODImgObj.Index++;
        if ($scope.ODImgObj.Index > $scope.ODImgObj.total) { $scope.ODImgObj.Index = 1 };
        $scope.showODImage()
    }
    $scope.previousODClick = function () {
        $scope.ODImgObj.Index--;
        if ($scope.ODImgObj.Index < 0) $scope.ODImgObj.Index = $scope.ODImgObj.total;
        $scope.showODImage()
    }



    $scope.showOSimageViewer = function () {


        // $scope.OSImgObj.wrapper.querySelector(".total").innerHTML = $scope.OSImgObj.total;
        $scope.showOSImage()
    }
    $scope.showOSImage = function () {

        var imgrObj = $scope.selectedImageStudyFiles.LeftEyeFiles[$scope.OSImgObj.Index - 1];

        if ($scope.selectedImageStudyFiles.LeftEyeFiles.length > 0) {
            $scope.OSImgObj.viewer.load(imgrObj.small, imgrObj.big);
        } else {
            $scope.OSImgObj.viewer.load("", "");
        }

        // $scope.OSImgObj.curSpan.innerHTML = $scope.OSImgObj.Index;
    }
    $scope.nextOSimgClick = function () {
        $scope.OSImgObj.Index++;
        if ($scope.OSImgObj.Index > $scope.OSImgObj.total) $scope.OSImgObj.Index = 1;
        $scope.showOSImage()
    }
    $scope.previousOSClick = function () {
        $scope.OSImgObj.Index--;
        if ($scope.OSImgObj.Index < 0) $scope.OSImgObj.Index = $scope.OSImgObj.total;
        $scope.showOSImage()
    }

    $scope.compareImagesArray = [];


    $scope.addImagetoCompare = function () {


        $scope.selectedImages = [];

        angular.forEach($scope.allPatientImagesArray, function (citem) {
            angular.forEach(citem.PatientFiles, function (sitem) {
                if (sitem.IsActive) {
                    var obj = sitem;
                    $scope.selectedImages.push(obj);
                }
            });
        });

        if ($scope.selectedImages.length === 0) {
            alertify.error("please select images to compare");
            return false;
        }




        $scope.compareImagesArray = angular.copy($scope.selectedImages);





    }




    $scope.clinicDoctorList = [];
    $scope.AllTecniciansList = [];
    function getDoctorsbySubSpecializations(branchId) {

        console.log(branchId);

        $scope.clinicDoctorList = [];
        $scope.AllTecniciansList = [];
        $scope.allUserList = [];
        $scope.selectedDoctor = "";


        var reqObj = {
            "BranchId": $scope.HospitalId,
        }


        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {
            console.log(resp);
            if (resp.rows.length > 0) {
                $scope.allUserList = resp.rows;

                $scope.clinicDoctorAllList = angular.copy($scope.allUserList);
                $scope.clinicDoctorList = [];
                angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                    if (Aitem.RoleId === 1 || Aitem.RoleId === 3 || Aitem.RoleId === 4 || Aitem.RoleId === 43 || Aitem.RoleId === 16 || Aitem.RoleId === 56 || Aitem.RoleId === 57) {
                        $scope.clinicDoctorList.push(Aitem);
                    }
                });
                $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });

                angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                    if (Aitem.RoleId === 10) {
                        $scope.AllTecniciansList.push(Aitem);
                    }
                });
                $scope.AllTecniciansList = _.uniq($scope.AllTecniciansList, false, function (p) { return p.DoctorID; });




            } else {
                alertify.error("No Users Found in Selected Departments");
                $scope.mainBookedAppointmentList = [];
            }


        }

        function onGetUsersFailure(data) {
        }
    }


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

    $scope.init = function () {
        getDoctorsbySubSpecializations($scope.HospitalId);
        $scope.GetInventoryMasterIOLData();
    };




    $scope.init();
    $scope.mainadvisedDiagnosisArray = [];

    $scope.getPatientAdvisedDiagnosisList = function (porderid) {
        var PatientOrderId = porderid || 0;
        var obj = {
            "AppointmentId": $scope.AppointmentId,
            "PatientID": $scope.PatientId,
            "PatientOrderId": PatientOrderId
        }
        eHnoteInsuranceService.GetDiagnosisAssesmentPlansListById(obj).then(function (response) {

            console.log(response);
            $scope.selectedImageStudyObj.DiagnosisListArray = [];
            $scope.mainadvisedDiagnosisArray = [];
            if (response.data.Status === 'Success') {
                if (response.data.rows.length > 0) {
                    $scope.mainadvisedDiagnosisArray = response.data.rows || [];
                    response.data.OrderDiagnosisList = response.data.OrderDiagnosisList || [];

                    if (response.data.OrderDiagnosisList.length > 0) {

                        angular.forEach(response.data.OrderDiagnosisList, function (mitem) {
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
                        });

                    }


                    angular.forEach($scope.mainadvisedDiagnosisArray, function (ditem) {
                        ditem.IsCheckedDiagnosis = false;
                    });


                    console.log(JSON.stringify($scope.mainadvisedDiagnosisArray));

                    angular.forEach($scope.selectedImageStudyObj.DiagnosisListArray, function (mitem) {
                        for (var i = $scope.mainadvisedDiagnosisArray.length - 1; i >= 0; i--) {
                            if ($scope.mainadvisedDiagnosisArray[i].DiagnosisId === mitem.DiagnosisId) {
                                $scope.mainadvisedDiagnosisArray.splice(i, 1);
                            }
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

            return $scope.GetPatientAdvisedDiagnosisList();
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

    $scope.InterpretationbottomPopover = function () {
        $scope.mInstanceAddC = $uibModal.open({
            "templateUrl": "InterpretationbottomPopover.html",
            //"size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            "windowClass": "filterSideViewPopup",
            "resolve": {
                "InterpretationSummaryArray": function () { return $scope.InterpretationSummaryArray; },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, InterpretationSummaryArray) {

                $scope.InterpretationSummaryArray = InterpretationSummaryArray || [];

                if ($scope.InterpretationSummaryArray.length > 0) {
                    $scope.selectedImageStudyObj.FundusFindingArray = $scope.InterpretationSummaryArray[0].FundusFindingArray || [];
                    $scope.selectedImageStudyObj.FAFindingArray = $scope.InterpretationSummaryArray[0].FAFindingArray || [];
                    $scope.selectedImageStudyObj.ICGFindingArray = $scope.InterpretationSummaryArray[0].ICGFindingArray || [];
                    $scope.selectedImageStudyObj.MacularFindingArray = $scope.InterpretationSummaryArray[0].MacularFindingArray || [];
                    $scope.selectedImageStudyObj.ONFindingArray = $scope.InterpretationSummaryArray[0].ONFindingArray || [];
                } else {
                    $scope.selectedImageStudyObj.ProviderRemarks = "";
                    $scope.selectedImageStudyObj.TechnicianRemarks = "";
                }

                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
                $scope.saveImageManagementStudyDetails = function () {

                    if ($scope.SelectedDiagnosisArray.length > 0) {
                        angular.forEach($scope.SelectedDiagnosisArray, function (item) {
                            $scope.selectedImageStudyObj.DiagnosisListArray.push(item);
                        });
                    }
                    var ReviewedDate = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
                    var params = angular.copy($scope.selectedImageStudyObj);
                    params.DoctorObj = "";
                    params.TechnicianObj = "";
                    params.ImagestudyReviewedDate = ReviewedDate;
                    console.log(JSON.stringify($scope.selectedImageStudyObj));
                    params.InterpretationArrayNew = $scope.InterpretationArrayNew || [];
                    params.AppointmentId = $scope.AppointmentId || 0;
                    params.PatientId = $scope.PatientId || 0;
                    if (params.PatientImageStudyId == 0) {
                        let obj = {
                            "LogId": 0,
                            "ModuleId": 2,
                            "ModuleName": "ASC",
                            "SubModuleId": 7,
                            "SubModuleName": "Image Management",
                            "ScreenType": "ASC List",
                            "ActionType": 'Added',
                            "ActionDescription": `Interpretation for order ${params.OrderName} for Appointment ID: 46800: ${$scope.LogObj.AppointmentId}`,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }
                    else {
                        let count = compareInterpretationOrder(params, $scope.LogObj);
                        if (count > 0) {
                            let obj = {
                                "LogId": 0,
                                "ModuleId": 2,
                                "ModuleName": "ASC",
                                "SubModuleId": 7,
                                "SubModuleName": "Image Management",
                                "ScreenType": "ASC List",
                                "ActionType": 'Edited',
                                "ActionDescription": `Interpretation for order ${params.OrderName} for Appointment ID: 46800: ${$scope.LogObj.AppointmentId}`,
                                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                            };
                            $scope.LogObj.LogArray.push(obj);
                        }
                    }

                    eHnotePatientDataService.UpdatePatientOrderImageStudyDetails(params).then(function (resp) {



                        console.log(resp);

                        if (resp.data.Status == "Success") {
                            alertify.success("Added Successfully");
                            //$scope.SelectedDiagnosisArray = [];

                            //$scope.selectedImageStudyObj = getnewImageStudyDetailsAddReqObj();
                            //$scope.selectedImageStudyFiles.LeftEyeFiles = [];
                            //$scope.selectedImageStudyFiles.RightEyeFiles = [];
                            //$scope.selectedImageStudyFiles.AllFiles = [];
                            //$scope.getPatientOrderDetailsList(); 
                            $uibModalInstance.close("save");
                        }

                    }, function (err) {
                        console.log(err);
                        alertify.error("Getting Failed");
                    });
                }

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

                    $scope.TempObj.ImageManagementTemplateName = $scope.TempObj.ImageManagementTemplateName || "";

                    if ($scope.TempObj.ImageManagementTemplateName == "") {
                        alertify.error("please enter template name");
                        return;
                    }
                    $scope.selectedImageStudyObj.ProviderRemarks = $scope.selectedImageStudyObj.ProviderRemarks || "";
                    $scope.selectedImageStudyObj.TechnicianRemarks = $scope.selectedImageStudyObj.TechnicianRemarks || "";
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
                        "TechnicianNotes": $scope.selectedImageStudyObj.TechnicianRemarks,
                        "DeleteInd": "N",
                        "DiagnosisList": [],
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

                    $scope.selectedImageStudyObj.ProviderRemarks = obj.ProviderNotes;
                    $scope.selectedImageStudyObj.TechnicianRemarks = obj.TechnicianNotes;

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
                    /*$scope.TempObj.IsImagemanagementTempaltePopOver = true;*/
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

                //$scope.changeODMacularFinding = function (selectedinv, item, CategoryId) {

                //    $scope.selectedImageStudyObj.ODFundusFindingObj = '';
                //    $scope.selectedImageStudyObj.ODFAFindingObj = '';
                //    $scope.selectedImageStudyObj.ODICGFindingObj = '';

                //    $scope.selectedImageStudyObj.OSFundusFindingObj = '';
                //    $scope.selectedImageStudyObj.OSFAFindingObj = '';
                //    $scope.selectedImageStudyObj.OSICGFindingObj = '';

                //    var count = [];
                //    var i = 0;
                //    var temparray = $filter("filter")($scope.cacheStorageItem.FindingCheckValuesList, { "CategoryId": CategoryId }, true);

                //    if ($scope.InterpretationArrayNew.length > 0) {
                //        if (item.FindingId != 32) {
                //            angular.forEach($scope.InterpretationArrayNew, function (Mitem) {
                //                if (Mitem.RemarksArray.length > 0) {
                //                    angular.forEach(Mitem.RemarksArray, function (Ritem) {
                //                        Ritem.IsShowNotesTextBox = false;
                //                    });
                //                }
                //            });
                //            angular.forEach($scope.InterpretationArrayNew, function (Mitem) {
                //                if (Mitem.RemarksArray.length > 0) {
                //                    count = $filter("filter")(Mitem.RemarksArray, function (fitem, index) { return fitem.InvFindingId === item.InvFindingId && fitem.OrganId === selectedinv.SelectedEye && fitem.ActiveInd == 'Y' });
                //                    if (count.length !== 0) {
                //                        i++;
                //                    }
                //                }
                //            });
                //            angular.forEach($scope.InterpretationArrayNew, function (Mitem) {
                //                if (Mitem.RemarksArray.length > 0) {
                //                    angular.forEach(Mitem.RemarksArray, function (hitem, index) {
                //                        angular.forEach(temparray, function (tempitem, index1) {
                //                            if (hitem.InvFindingId === tempitem.InvFindingId && hitem.OrganId == selectedinv.SelectedEye && item.FindingId === Mitem.InvestigationId) {
                //                                if (hitem.RemarksId === 0) {
                //                                    Mitem.RemarksArray.splice(index, 1);
                //                                }
                //                                else {
                //                                    hitem.ActiveInd = 'N';
                //                                }
                //                            }
                //                        });
                //                    });
                //                }
                //            });
                //        } else if (item.FindingId == 32) {
                //            var object = {
                //                "PatientFindingPosteriorId": 0,
                //                "ActiveInd": "Y",
                //                "IsNormal": false,
                //                "CategoryId": 6,
                //                "CategoryDesc": "Posterior Segment",
                //                "InvestigationId": 32,
                //                "InvestigationDesc": "CDR",
                //                "RHorizontal": '',
                //                "LHorizontal": '',
                //                "RVertical": '',
                //                "LVertical": '',
                //                "RDPS": '',
                //                "LDPS": '',
                //                "RemarksArray": [],
                //                "StampsArray": item.StampsArray || [],

                //            };

                //            var filetrarray = $filter("filter")($scope.InterpretationArrayNew, function (iterator, ind) { return iterator.InvestigationId == 32, iterator.ActiveInd == "Y" }) || [];
                //            if (filetrarray.length == 0) {
                //                $scope.InterpretationArrayNew.push(object);
                //            }
                //            item.FindingValue = item.FindingValue || "";
                //            var parts = item.FindingValue.split(' ');
                //            var value = parts[0] || "";
                //            var valuetype = parts[1] || "";
                //            angular.forEach($scope.InterpretationArrayNew, function (pitem) {

                //                if (pitem.InvestigationId == 32) {
                //                    if (selectedinv.SelectedEye == 1) {
                //                        if (valuetype == 'HZ') {
                //                            pitem.RHorizontal = value || "";

                //                        } else if (valuetype == 'V.T.') {
                //                            pitem.RVertical = value || "";
                //                            pitem.RHorizontal = value || "";
                //                        } else if (valuetype == 'DPS') {
                //                            pitem.RDPS = value || "";
                //                        }
                //                    } else if (selectedinv.SelectedEye == 2) {
                //                        if (valuetype == 'HZ') {
                //                            pitem.LHorizontal = value || "";

                //                        } else if (valuetype == 'V.T.') {
                //                            pitem.LVertical = value || "";
                //                            pitem.LHorizontal = value || "";
                //                        } else if (valuetype == 'DPS') {
                //                            pitem.LDPS = value || "";
                //                        }

                //                    }
                //                }
                //            });
                //        }

                //    }

                //    if (i !== 0) {
                //        $scope.selectedImageStudyObj.ODFundusFindingObj = '';
                //        alertify.error("This Item is Already Added");
                //        return false;
                //    }

                //    var filetrarray = $filter("filter")($scope.InterpretationArrayNew, function (iterator, ind) { return iterator.InvestigationId == item.FindingId }) || [];
                //    if (filetrarray.length == 0) {
                //        if (item.FindingId != 32) {
                //            var object = {
                //                "PatientFindingPosteriorId": 0,
                //                "IsNormal": false,
                //                "CategoryId": 6,
                //                "CategoryDesc": "Posterior Segment",
                //                "InvestigationId": item.FindingId || 0,
                //                "InvestigationDesc": item.FindingName || "",
                //                "ActiveInd": "Y",
                //                "SelectedGlobalSearch": "",
                //                "SelectedRightEye": 1,
                //                "SelectedLeftEye": 0,
                //                "RemarksArray": [],
                //                /* "StampsArray": item.StampsArray || [],*/

                //            };

                //            if (selectedinv.SelectedEye == 1) {
                //                var obj = {
                //                    "RemarksId": 0,
                //                    "InvFindingId": item.InvFindingId || 0,
                //                    "FindingValue": item.FindingValue || '',
                //                    "OrganId": selectedinv.SelectedEye || 1,
                //                    "FindingId": item.FindingId || 0,
                //                    "FindingName": item.FindingName || '',
                //                    "DiagnosisRiskLevel": "",
                //                    "ActiveInd": "Y",
                //                    "Notes": "",
                //                    "IsShowNotesTextBox": false,
                //                    "SubFindingList": [],
                //                    "StampsArray": [],
                //                }
                //                $scope.cacheStorageItem.PosteriorODIsNormal = false;
                //                // Filter stamps based on the OrganId
                //                if (item.StampsArray.length > 0) {
                //                    var filteredStamps = item.StampsArray.filter(function (stamp) {
                //                        return stamp.OrganId === obj.OrganId;
                //                    });

                //                    // Assign filtered stamps to obj.StampsArray
                //                    obj.StampsArray = filteredStamps || [];
                //                }
                //            } else if (selectedinv.SelectedEye == 2) {
                //                var obj = {
                //                    "RemarksId": 0,
                //                    "InvFindingId": item.InvFindingId || 0,
                //                    "FindingValue": item.FindingValue || '',
                //                    "OrganId": selectedinv.SelectedEye || 2,
                //                    "FindingId": item.FindingId || 0,
                //                    "FindingName": item.FindingName || '',
                //                    "DiagnosisRiskLevel": "",
                //                    "ActiveInd": "Y",
                //                    "Notes": "",
                //                    "IsShowNotesTextBox": false,
                //                    "SubFindingList": [],
                //                    "StampsArray": [],
                //                }
                //                $scope.cacheStorageItem.PosteriorOSIsNormal = false;
                //                if (item.StampsArray.length > 0) {
                //                    var filteredStamps = item.StampsArray.filter(function (stamp) {
                //                        return stamp.OrganId === obj.OrganId;
                //                    });

                //                    // Assign filtered stamps to obj.StampsArray
                //                    obj.StampsArray = filteredStamps || [];
                //                }
                //            }
                //            object.RemarksArray.push(obj);
                //            $scope.InterpretationArrayNew.push(object);
                //        } else if (item.FindingId == 32) {
                //            /*if (item.InvestigationId == 32) {*/

                //            var object = {
                //                "PatientFindingPosteriorId": 0,
                //                "ActiveInd": "Y",
                //                "IsNormal": false,
                //                "CategoryId": 6,
                //                "CategoryDesc": "Posterior Segment",
                //                "InvestigationId": 32,
                //                "InvestigationDesc": "CDR",
                //                "RHorizontal": '',
                //                "LHorizontal": '',
                //                "RVertical": '',
                //                "LVertical": '',
                //                "RDPS": '',
                //                "LDPS": '',
                //                "RemarksArray": [],
                //                "StampsArray": item.StampsArray || [],

                //            };

                //            var filetrarray = $filter("filter")($scope.InterpretationArrayNew, function (iterator, ind) { return iterator.InvestigationId == 32 }) || [];
                //            if (filetrarray.length == 0) {
                //                $scope.InterpretationArrayNew.push(object);
                //            }
                //            item.FindingValue = item.FindingValue || "";
                //            var parts = item.FindingValue.split(' ');
                //            var value = parts[0] || "";
                //            var valuetype = parts[1] || "";
                //            angular.forEach($scope.InterpretationArrayNew, function (pitem) {

                //                if (pitem.InvestigationId == 32) {
                //                    if (selectedinv.SelectedEye == 1) {
                //                        if (valuetype == 'HZ') {
                //                            pitem.RHorizontal = value || "";
                //                            /*pitem.RVertical = value || "";*/

                //                        } else if (valuetype == 'V.T.') {
                //                            pitem.RVertical = value || "";
                //                            pitem.RHorizontal = value || "";
                //                        } else if (valuetype == 'DPS') {
                //                            pitem.RDPS = value || "";
                //                        }
                //                    } else if (selectedinv.SelectedEye == 2) {
                //                        if (valuetype == 'HZ') {
                //                            pitem.LHorizontal = value || "";
                //                            /*pitem.LVertical = value || "";*/

                //                        } else if (valuetype == 'V.T.') {
                //                            pitem.LVertical = value || "";
                //                            pitem.LHorizontal = value || "";
                //                        } else if (valuetype == 'DPS') {
                //                            pitem.LDPS = value || "";
                //                        }

                //                    }
                //                }
                //            });
                //            /*}*/
                //        }



                //    } else {
                //        angular.forEach($scope.InterpretationArrayNew, function (Mitem) {
                //            if (Mitem.InvestigationId == item.FindingId && Mitem.InvestigationId != 32) {
                //                if (selectedinv.SelectedEye == 1) {
                //                    var obj = {
                //                        "RemarksId": 0,
                //                        "InvFindingId": item.InvFindingId || 0,
                //                        "FindingValue": item.FindingValue || '',
                //                        "OrganId": selectedinv.SelectedEye || 1,
                //                        "FindingId": item.FindingId || 0,
                //                        "FindingName": item.FindingName || '',
                //                        "DiagnosisRiskLevel": "",
                //                        "ActiveInd": "Y",
                //                        "Notes": "",
                //                        "IsShowNotesTextBox": false,
                //                        "SubFindingList": [],
                //                        "StampsArray": [],
                //                    }
                //                    $scope.cacheStorageItem.PosteriorODIsNormal = false;
                //                    if (item.StampsArray.length > 0) {
                //                        var filteredStamps = item.StampsArray.filter(function (stamp) {
                //                            return stamp.OrganId === obj.OrganId;
                //                        });

                //                        // Assign filtered stamps to obj.StampsArray
                //                        obj.StampsArray = filteredStamps || [];

                //                    }
                //                } else if (selectedinv.SelectedEye == 2) {
                //                    var obj = {
                //                        "RemarksId": 0,
                //                        "InvFindingId": item.InvFindingId || 0,
                //                        "FindingValue": item.FindingValue || '',
                //                        "OrganId": selectedinv.SelectedEye || 2,
                //                        "FindingId": item.FindingId || 0,
                //                        "FindingName": item.FindingName || '',
                //                        "DiagnosisRiskLevel": "",
                //                        "ActiveInd": "Y",
                //                        "Notes": "",
                //                        "IsShowNotesTextBox": false,
                //                        "SubFindingList": [],
                //                        "StampsArray": [],
                //                    }
                //                    $scope.cacheStorageItem.PosteriorOSIsNormal = false;
                //                    if (item.StampsArray.length > 0) {
                //                        var filteredStamps = item.StampsArray.filter(function (stamp) {
                //                            return stamp.OrganId === obj.OrganId;
                //                        });

                //                        // Assign filtered stamps to obj.StampsArray
                //                        obj.StampsArray = filteredStamps || [];
                //                    }
                //                }
                //                Mitem.RemarksArray.push(obj);
                //            }

                //        });
                //    }

                //};

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
            }
        });
        $scope.mInstanceAddC.result.then(function (resp) {
            console.log(resp);

            $scope.ImageObj.PatientImageInd = false;

            $scope.getPatientOrderDetailsList();

        }, function (cancel) {
        });

    };

    $scope.navtoAddOrderIntepretation = function () {
        $scope.mInstanceAddC = $uibModal.open({
            "templateUrl": "templates/UsNewConsultation/uibpopup/OrderInterpretationpopup.html",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            "windowClass": "modal__ninetynine--",
            "resolve": {
                "InterpretationSummaryArray": function () { return $scope.InterpretationSummaryArray; },
                "selectedImageStudyObj": function () { return $scope.selectedImageStudyObj; },
                "SelectedDiagnosisArray": function () { return $scope.SelectedDiagnosisArray; }
            },
            "controller": "UsOrderInterpretationPopup",
        });
        $scope.mInstanceAddC.result.then(function (resp) {
            console.log(resp);

            $scope.ImageObj.PatientImageInd = false;

            $scope.getPatientOrderDetailsList();

        }, function (cancel) {
        });

    };


    $scope.GOTOConsultation = function () {
        $uibModalInstance.close($scope.cacheStorageItem);
    };


    $scope.deleteImageManagementStudy = function () {

        function getaddnewImageStudyObj() {
            var objj = {
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "PatientImageStudyId": 0,
                "ImageStudyName": "",
                "ImageStudyDescription": "",
                "DOSDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                "StatusId": 1,
                "ControlId": 1,
                "ModalityId": 0,
                "DoctorId": 0,
                "TechnicianId": "",
                "AppointmentId": $scope.AppointmentId,
                "PatientId": $scope.PatientId,
                "DoctorNotes": "",
                "TechnicianNotes": "",
                "DeleteInd": "N",
                "StudyImagesArray": [],
                "StudyDiagnosisArray": [

                ],
                "PatientOrderId": 0,
                "InvestigationId": 0,
                "InvestigationObj": "",
                "InvestigationName": "",
                "CPTCode": "",
                "ProcedureCode": "",
                "DoctorObj": "",
                "DoctorName": "",
                "OrganizationInvestigationId": 0
            }

            return objj;
        }




        $scope.addupdateImgStudyReqObj = getaddnewImageStudyObj();

        $scope.addupdateImgStudyReqObj.PatientImageStudyId = $scope.selectedImageStudyObj.PatientImageStudyId;
        $scope.addupdateImgStudyReqObj.StudyImagesArray = [];

        $scope.addupdateImgStudyReqObj.DeleteInd = "Y";


        angular.forEach($scope.selectedImageStudyFiles.AllFiles, function (imgitem) {
            var obj = {
                "PatientImageStudyDetailId": imgitem.PatientImageStudyDetailId,
                "S3URL": imgitem.S3URL || "",
                "OrganId": imgitem.OrganId,
                "DeleteInd": "Y"
            }
            $scope.addupdateImgStudyReqObj.StudyImagesArray.push(obj);
        });


        console.log($scope.addupdateImgStudyReqObj);

        eHnotePatientDataService.AddUpdatePatientImageStudyDetails($scope.addupdateImgStudyReqObj).then(function (resp) {

            console.log(resp);
            alertify.success("Image Study Created  Successfully");
            $uibModalInstance.close('save');

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
        $scope.GetSeverity = function () {
            return [
                {
                    "AllergyDescription": "Mild",
                    "ROSAllergiesID": 38,
                },
                {
                    "AllergyDescription": "Moderate",
                    "ROSAllergiesID": 40,
                },
                {
                    "AllergyDescription": "Severe",
                    "ROSAllergiesID": 42,
                },

            ];
        };
        $scope.GetSeverityList = angular.copy($scope.GetSeverity());
    }



    $scope.ImageManagementTabsObj = {
        "SelectedImageTab": 1,
        "SelectedImageSubTab": 1
    }
    $scope.imgcomparisionpopup = function () {

        $scope.selectedImages = [];

        angular.forEach($scope.ImagesTabObj.allPatientImagesArray, function (citem) {
            angular.forEach(citem.PatientFiles, function (sitem) {
                if (sitem.IsActive && (sitem.FileExt == 'image/jpeg' || sitem.FileExt == 'image/png')) {
                    var obj = sitem;
                    $scope.selectedImages.push(obj);
                }
            });
        });

        if ($scope.selectedImages.length === 0) {
            alertify.error("please select images to compare");
            return false;
        }




        $scope.compareImagesArray = angular.copy($scope.selectedImages);



        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/imgcomparisionpopup.html",
            "backdrop": "static",
            "keyboard": false,
            // "windowClass": "modal__popup--1 bottom-to-top-modal in",
            "windowClass": "offcanves-right",
            "scope": $scope,
            "resolve": {
                "compareImagesArray": function () { return $scope.compareImagesArray; },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, compareImagesArray) {
                $scope.SubTab = 1;

                $scope.compareImagesArray = compareImagesArray || [];
                $scope.closeuib = function () {
                    $uibModalInstance.dismiss("cancel");
                };

            }
        });


        $scope.mInstanceAdd.result.then(function (resp) {
            console.log(resp);

            $scope.compareImagesArray = [];

        }, function (cancel) {
        });
    };

    $scope.selectionImageData = {
        SelectedModalityId: 0,
        SelectedVisitId: 0,
        SelectedAppointmentId: 0,
        SelectedFiles: []
    };
    $scope.tempODImagesArray = [];
    $scope.tempOSImagesArray = [];
    $scope.AddUpdateorderimagespopup = function (addvalue, PatientOrderId, typpe) {
        var addvalue = addvalue || false;
        var typpe = typpe || "Old";
        var PatientOrderId = PatientOrderId || 0;
        $scope.selectedImages = [];
        $scope.selectionImageData.SelectedFiles = [];
        if ($scope.imageMainTab == 2) {
            angular.forEach($scope.ImagesTabObj.allPatientImagesArray, function (citem) {
                angular.forEach(citem.PatientFiles, function (sitem) {
                    if (sitem.IsActive) {
                        var obj = sitem;
                        $scope.selectionImageData.SelectedFiles.push(obj);
                    }
                });
            });

        }


        console.log($scope.HospitalId + "__$scope.HospitalId");

        var Obj = {
            "HospitalId": $scope.HospitalId,
            "PatientId": $scope.PatientId,
            "UserId": $scope.UserId,
            "AppointmentId": $scope.AppointmentId,
            "AppointmentDate": $scope.AppointmentDate,
            "PatientName": $scope.PatientName,
            "AppointmentList": [],
            "MasterModalityArray": $scope.MasterModalityArray,
            "addvalue": addvalue,
            "PatientOrderId": PatientOrderId,
            "selectionImageData": $scope.selectionImageData,
            "ParenthospitalId": $scope.ParenthospitalId || null
        };

        var templateUrls = "templates/uibpopups/Addorderimagespopup.html";
        var windowsclasses = "offcanves-right  ";

        if (typpe == 'New') {
            templateUrls = "templates/uibpopups/AddorderimagespopupNew.html";
            windowsclasses = "modal__eighty--   ";
        }

        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": templateUrls,
            "backdrop": "static",
            "keyboard": false,
            "windowClass": windowsclasses,
            "scope": $scope,
            "resolve": {
                "ParentObject": Obj
            },
            "controller": function ($scope, $uibModalInstance, eHnoteDiagnosisDataServices, eHnoteSettingsDataService, eHnoteInsuranceService, ParentObject, alertify) {

                console.log(ParentObject);
                $scope.selectedPatientObj = ParentObject;
                $scope.tempODImagesArray = [];
                $scope.tempOSImagesArray = [];

                $scope.selectedPatientOrderId = ParentObject.PatientOrderId || 0;
                $scope.ParenthospitalId = ParentObject.ParenthospitalId || null;
                $scope.previousAppointmentsList = [];


                $scope.PatientOrdersArray = [];

                $scope.addUpdatePatientOrderImageDetailsReq = getAddPatientOrderImageDetailsReq();
                $scope.DisplayName = "";
                if ($scope.selectedPatientObj.selectionImageData?.SelectedFiles?.length) {
                    $scope.selectedPatientObj.selectionImageData.SelectedFiles.forEach(item => {
                        if (item.OrganId === 1 || item.OrganId === 3) {
                            if (item.FileName.length > 9) {
                                $scope.DisplayName = item.FileName.substring(0, 9) + "..." + "." + item.FileExt;
                            } else {
                                $scope.DisplayName = angular.copy(item.FileName) + '.' + item.FileExt;
                            }
                            var obj = {
                                "S3URL": item.S3URL,
                                "DocURL": item.S3URL,
                                "DocumentExt": item.FileExt,
                                "DocumentName": item.FileName,
                                "OrganId": item.OrganId,
                                "DeleteInd": "N",
                                "FileTypeId": 5,
                                "DocumentId": item.DocumentId,
                                "file": item,
                                "DisplayName": $scope.DisplayName
                            };
                            // OD (Right Eye)
                            $scope.tempODImagesArray.push(obj);
                        }
                        else {
                            if (item.FileName.length > 9) {
                                $scope.DisplayName = item.FileName.substring(0, 9) + "..." + "." + item.FileExt;
                            } else {
                                $scope.DisplayName = angular.copy(item.FileName) + '.' + item.FileExt;
                            }
                            var obj = {
                                "S3URL": item.S3URL,
                                "DocURL": item.S3URL,
                                "DocumentExt": item.FileExt,
                                "DocumentName": item.FileName,
                                "OrganId": item.OrganId,
                                "DeleteInd": "N",
                                "FileTypeId": 5,
                                "DocumentId": item.DocumentId,
                                "file": item,
                                "DisplayName": $scope.DisplayName
                            };
                            // OS (Left Eye) or OU (Both Eyes)
                            $scope.tempOSImagesArray.push(obj);
                        }
                    });
                }
                var modalityIds = new Set($scope.selectedPatientObj.selectionImageData.SelectedFiles.map(item => item.ModalityId));

                var ModalityId = modalityIds.size === 1 ? [...modalityIds][0] : 0;
                $scope.addUpdatePatientOrderImageDetailsReq.ModalityId = ModalityId || 0;
                $scope.ModalityArray = $scope.selectedPatientObj.MasterModalityArray || [];
                var List = $filter("filter")($scope.ModalityArray, { "ModalityId": ModalityId }, true);
                if (List.length > 0) {
                    $scope.addUpdatePatientOrderImageDetailsReq.ModalityName = List[0].ModalityName;

                    $scope.addUpdatePatientOrderImageDetailsReq.ModalityName = $scope.addUpdatePatientOrderImageDetailsReq.ModalityName.replace(/\s+/g, '')
                }


                var Organids = new Set($scope.selectedPatientObj.selectionImageData.SelectedFiles.map(item => item.OrganId));

                var Organid = Organids.size === 1 ? [...Organids][0] : 0;
                $scope.addUpdatePatientOrderImageDetailsReq.OrganId = Organid;
                var ConsultationIds = new Set($scope.selectedPatientObj.selectionImageData.SelectedFiles.map(item => item.ConsultationId));

                var ConsultationId = ConsultationIds.size === 1 ? [...ConsultationIds][0] : 0;

                $scope.addUpdatePatientOrderImageDetailsReq.ConsultationId = ConsultationId;


                $scope.advisedDiagnosisArray = [];

                $scope.selectedDiagnosisOrderArray = [];


                $scope.showAddOrderDiv = false;


                $scope.getPatientPreviousAppointments = function () {

                    eHnotePatientDataService.GetPatientBillingAppointments($scope.selectedPatientObj.PatientId).then(function (resp) {
                        if (resp.data.Status === 1) {
                            if (resp.data.data.length > 0) {
                                resp.data.data = resp.data.data || [];
                                //$scope.previousAppointmentsList = $scope.previousAppointmentsList || [];
                                $scope.showAddOrderDiv = true;
                                $scope.currentdate = $filter('date')(new Date(), "yyyy-MM-dd");


                                angular.forEach(resp.data.data, function (mitem) {
                                    console.log(mitem);
                                    if (mitem.AppointmentTypeId !== 7 && mitem.AppointmentTypeId !== 6) {
                                        // if (mitem.AppointmentDate <= $scope.currentdate) {
                                        $scope.previousAppointmentsList.push(mitem);
                                        //}
                                    }
                                });

                                angular.forEach($scope.previousAppointmentsList, function (aitem) {
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

                //if ($scope.selectedPatientObj.addvalue) {
                //    $scope.showAddOrderDiv = true;

                //} else {
                //    $scope.showAddOrderDiv = false;
                //}
                $scope.getPatientPreviousAppointments();

                $scope.OrderDiagnosisListArray = [];

                $scope.getPatientAdvisedDiagnosisList = function (item) {

                    var obj = {
                        "AppointmentId": item.AppointmentId,
                        "PatientID": ParentObject.PatientId,
                        "PatientOrderId": item.PatientOrderId || 0
                    }
                    eHnoteInsuranceService.GetDiagnosisAssesmentPlansListById(obj).then(function (response) {

                        console.log(response);
                        if (response.data.Status === 'Success') {
                            if (response.data.rows.length > 0) {
                                $scope.advisedDiagnosisArray = response.data.rows || [];
                                response.data.OrderDiagnosisList = response.data.OrderDiagnosisList || [];

                                $scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList = [];
                                if (response.data.OrderDiagnosisList.length > 0) {
                                    angular.forEach(response.data.OrderDiagnosisList, function (citem) {
                                        var obj = getDiagnosisOrderObj();
                                        obj.ConsultationDiagnosisId = citem.ConsultationDiagnosisId || 0;
                                        obj.AssessmentPlan.AssessmentPlanId = citem.AssessmentPlanId || 0;
                                        obj.DiagnosisDetailId = citem.DiagnosisDetailId || 0;
                                        obj.DiagnosisId = citem.DiagnosisId || 0;
                                        obj.DiagnosisName = citem.ICD10DIAGNAME || "";
                                        obj.ICDCode = citem.ICD10CODE || "";
                                        obj.DeleteInd = "N";
                                        obj.LocationId1 = citem.LocationId1 || 0;
                                        obj.LocationId2 = citem.LocationId2 || 0;
                                        obj.DiagnosisStatusId1 = citem.DiagnosisStatusId1 || 0;
                                        obj.DiagnosisStatusId2 = citem.DiagnosisStatusId2 || 0;
                                        obj.SeverityId1 = citem.SeverityId1 || 0;
                                        obj.SeverityId2 = citem.SeverityId2 || 0;
                                        obj.StartDate1 = citem.StartDate1 || null;
                                        obj.StartDate2 = citem.StartDate2 || null;
                                        obj.EndDate1 = citem.EndDate1 || null;
                                        obj.EndDate2 = citem.EndDate2 || null;
                                        $scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList.push(obj);
                                    });
                                }


                                angular.forEach($scope.advisedDiagnosisArray, function (ditem) {
                                    ditem.IsCheckedDiagnosis = false;
                                });
                                if ($scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList.length > 0) {
                                    $scope.LogObj.DiagnosisList = angular.copy($scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList) || [];
                                }
                                angular.forEach($scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList, function (mitem) {
                                    for (var i = $scope.advisedDiagnosisArray.length - 1; i >= 0; i--) {
                                        if ($scope.advisedDiagnosisArray[i].DiagnosisId === mitem.DiagnosisId) {
                                            $scope.advisedDiagnosisArray.splice(i, 1);
                                        }
                                    }
                                });
                            }
                        }
                    });
                };


                $scope.changeOrderSelected = function (item) {

                    console.log(item)
                    if (item.IsSelected) {
                        $scope.showAddOrderDiv = true;
                        angular.forEach($scope.PatientOrdersArray, function (oitem) {
                            oitem.IsSelected = false;
                        });
                        item.IsSelected = true;
                        /*$scope.getPatientAdvisedDiagnosisList(item.PatientOrderId);*/
                        $scope.getPatientAdvisedDiagnosisList(item);
                        $scope.addUpdatePatientOrderImageDetailsReq.PatientOrderId = item.PatientOrderId;
                        $scope.addUpdatePatientOrderImageDetailsReq.OrganizationProcedureId = item.OrgProcedureId;
                        $scope.addUpdatePatientOrderImageDetailsReq.ProcedureId = item.ProcedureId;
                        $scope.addUpdatePatientOrderImageDetailsReq.ProcedureCode = item.ProcedureCode;
                        $scope.addUpdatePatientOrderImageDetailsReq.ProcedureName = item.ProcedureName;
                        $scope.addUpdatePatientOrderImageDetailsReq.ProcedureObj = item.ProcedureName;
                        $scope.addUpdatePatientOrderImageDetailsReq.CPTCode = item.CPTCode;
                        $scope.addUpdatePatientOrderImageDetailsReq.ModalityId = item.ModalityId;
                        $scope.addUpdatePatientOrderImageDetailsReq.ModalityName = item.ModalityName;

                        if ($scope.addUpdatePatientOrderImageDetailsReq.ModalityName != "") {
                            $scope.addUpdatePatientOrderImageDetailsReq.ModalityName = $scope.addUpdatePatientOrderImageDetailsReq.ModalityName.replace(/\s+/g, '');
                        }
                        console.log($scope.addUpdatePatientOrderImageDetailsReq.ModalityName);
                        $scope.addUpdatePatientOrderImageDetailsReq.OrganId = item.OrganId;
                        $scope.addUpdatePatientOrderImageDetailsReq.OrderNumber = item.OrderNumber;

                        $scope.addUpdatePatientOrderImageDetailsReq.AppointmentId = item.AppointmentId;
                        $scope.addUpdatePatientOrderImageDetailsReq.AppointmentDate = item.AppointmentDate;
                        console.log($scope.addUpdatePatientOrderImageDetailsReq.AppointmentDate + "__AppointmentDate");
                    } else {
                        $scope.showAddOrderDiv = false;
                        $scope.addUpdatePatientOrderImageDetailsReq.PatientOrderId = 0;
                        $scope.addUpdatePatientOrderImageDetailsReq.OrganizationProcedureId = 0;
                        $scope.addUpdatePatientOrderImageDetailsReq.ProcedureId = 0;
                        $scope.addUpdatePatientOrderImageDetailsReq.ProcedureCode = ""
                        $scope.addUpdatePatientOrderImageDetailsReq.ProcedureName = "";
                        $scope.addUpdatePatientOrderImageDetailsReq.ProcedureObj = "";
                        $scope.addUpdatePatientOrderImageDetailsReq.CPTCode = "";
                        $scope.addUpdatePatientOrderImageDetailsReq.DoctorId = "";
                        $scope.addUpdatePatientOrderImageDetailsReq.ModalityId = 0;
                        $scope.addUpdatePatientOrderImageDetailsReq.AppointmentId = "";
                    }
                    // log info assign to paramter 
                    $scope.LogObj.PatientOrderId = $scope.addUpdatePatientOrderImageDetailsReq.PatientOrderId || 0;
                    $scope.LogObj.OrganizationProcedureId = $scope.addUpdatePatientOrderImageDetailsReq.OrganizationProcedureId || 0;
                    $scope.LogObj.ProcedureId = $scope.addUpdatePatientOrderImageDetailsReq.ProcedureId || 0;
                    $scope.LogObj.ProcedureCode = $scope.addUpdatePatientOrderImageDetailsReq.ProcedureCode || "";
                    $scope.LogObj.ProcedureName = $scope.addUpdatePatientOrderImageDetailsReq.ProcedureName || "";
                    $scope.LogObj.ProcedureObj = $scope.addUpdatePatientOrderImageDetailsReq.ProcedureObj || "";
                    $scope.LogObj.CPTCode = $scope.addUpdatePatientOrderImageDetailsReq.CPTCode || "";
                    $scope.LogObj.ModalityId = $scope.addUpdatePatientOrderImageDetailsReq.ModalityId || 0;
                    $scope.LogObj.ModalityName = $scope.addUpdatePatientOrderImageDetailsReq.ModalityName || "";
                    $scope.LogObj.OrganId = $scope.addUpdatePatientOrderImageDetailsReq.OrganId || "";
                    $scope.LogObj.OrderNumber = $scope.addUpdatePatientOrderImageDetailsReq.OrderNumber || "";
                    $scope.LogObj.AppointmentId = $scope.addUpdatePatientOrderImageDetailsReq.AppointmentId || "";
                    $scope.LogObj.AppointmentDate = $scope.addUpdatePatientOrderImageDetailsReq.AppointmentDate || "";

                }


                $scope.changeOrderAppointment = function (VisitId) {
                    $scope.addUpdatePatientOrderImageDetailsReq.AppointmentDate = "";
                    var List = $filter("filter")($scope.previousAppointmentsList, { "AppointmentId": VisitId }, true);
                    if (List.length > 0) {
                        $scope.addUpdatePatientOrderImageDetailsReq.AppointmentDate = List[0].AppointmentDate;
                    }
                };


                $scope.changeOrderModality = function (ModalityId) {
                    $scope.addUpdatePatientOrderImageDetailsReq.ModalityName = "";
                    var List = $filter("filter")($scope.ModalityArray, { "ModalityId": ModalityId }, true);
                    if (List.length > 0) {
                        $scope.addUpdatePatientOrderImageDetailsReq.ModalityName = List[0].ModalityName;

                        $scope.addUpdatePatientOrderImageDetailsReq.ModalityName = $scope.addUpdatePatientOrderImageDetailsReq.ModalityName.replace(/\s+/g, '')
                    }
                };


                $scope.getPatientChartingOrdersById = function () {

                    let params = {
                        "PatientId": $scope.PatientId,
                        "BranchId": $scope.HospitalId,
                    };
                    eHnoteSettingsDataService.GetChartingOrdersByPatientId(params).then(function (response) {

                        console.log(response);
                        if (response.data.status === 'Success') {
                            if (response.data.rows.length > 0) {
                                $scope.PatientOrdersArray = response.data.rows || [];

                                angular.forEach($scope.PatientOrdersArray, function (oitem) {
                                    oitem.IsSelected = false;
                                    oitem.isdisableOrderSelection = false;
                                });


                                if ($scope.selectedPatientOrderId != 0) {

                                    angular.forEach($scope.PatientOrdersArray, function (oitem) {
                                        oitem.isdisableOrderSelection = true;
                                        if (oitem.PatientOrderId == $scope.selectedPatientOrderId) {
                                            oitem.IsSelected = true;
                                            $scope.changeOrderSelected(oitem);
                                        }
                                    });



                                }
                            }
                        }
                    });
                };

                $scope.getPatientChartingOrdersById();

                //$scope.getPatientAdvisedDiagnosisList(0);

                function getAddPatientOrderImageDetailsReq() {
                    var objj = {
                        "UserId": ParentObject.UserId,
                        "HospitalId": ParentObject.HospitalId,
                        "PatientOrderId": 0,
                        "AppointmentId": ParentObject.AppointmentId,
                        "AppointmentDate": ParentObject.AppointmentDate,
                        "PatientId": ParentObject.PatientId,
                        "PatientName": ParentObject.PatientName,
                        "CPTCode": "",
                        "LOINCCode": "",
                        "ProcedureId": 0,
                        "OrganizationProcedureId": 0,
                        "ProcedureName": "",
                        "ProcedureCode": "",
                        "OrderDate": null,
                        "OrderNumber": "",
                        "OrderTypeId": 1,
                        "OrganId": 0, //4
                        "StatusId": 1,
                        "ModalityId": 0,
                        "DiagnosisList": [],
                        "PatientFiles": [],
                        "ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,
                    }

                    return objj;
                }
                $scope.navtoCreateNewOrder = function () {
                    $scope.addUpdatePatientOrderImageDetailsReq = getAddPatientOrderImageDetailsReq();

                    $scope.getPatientPreviousAppointments();

                };
                $scope.navtoSelectExistingOrders = function () {
                    $scope.addUpdatePatientOrderImageDetailsReq = getAddPatientOrderImageDetailsReq();
                    $scope.showAddOrderDiv = false;
                };
                $scope.navtoSelectExistingOrders = function () {
                    $scope.addUpdatePatientOrderImageDetailsReq = getAddPatientOrderImageDetailsReq();
                    $scope.showAddOrderDiv = false;
                };








                function getDiagnosisOrderObj() {
                    var obj = {
                        "DiagnosisDetailId": 0,
                        "DiagnosisId": 1,
                        "DiagnosisName": "",
                        "ICDCode": "",
                        "DeleteInd": "",
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
                        "CreatedDateTime": null,

                        "LocationId1": 0,
                        "SeverityId1": 0,
                        "DiagnosisStatusId1": 0,
                        "EndDate1": null,
                        "StartDate1": null,

                        "LocationId2": 0,
                        "SeverityId2": 0,
                        "DiagnosisStatusId2": 0,
                        "EndDate2": null,
                        "StartDate2": null,
                    };

                    return obj;
                }

                $scope.ModalityArray = angular.copy(ParentObject.MasterModalityArray);

                angular.forEach($scope.ModalityArray, function (kitem, index) {
                    if (kitem.ModalityId === 0) {
                        $scope.ModalityArray.splice(index, 1);
                    }
                });


                $scope.imguploadReqObj = {
                    "UserId": $scope.selectedPatientObj.UserId,
                    "HospitalId": $scope.selectedPatientObj.HospitalId,
                    "AppointmentId": $scope.selectedPatientObj.AppointmentId,
                    "AppointmentDate": $scope.AppointmentDate,
                    "PatientId": $scope.selectedPatientObj.PatientId,
                    "PatientName": $scope.selectedPatientObj.PatientName,
                    "ProcedureId": "",
                    "OrganizationProcedureId": "",
                    "ProcedureName": "",
                    "ProcedureCode": "",
                    "CPTCode": "",
                    "ProcedureObj": "",
                    "OrganId": "",
                    "CategoryId": 0,
                    "ModalityId": 0,
                    "ModalityName": "",
                    "PatientFiles": []
                };


                $scope.closeImagePopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };


                $scope.SavePatientOrderDetails = function () {

                    /*console.log($scope.addUpdatePatientOrderImageDetailsReq);*/

                    $scope.addUpdatePatientOrderImageDetailsReq.AppointmentId = $scope.addUpdatePatientOrderImageDetailsReq.AppointmentId || '';
                    if ($scope.addUpdatePatientOrderImageDetailsReq.AppointmentId == '') {
                        alertify.error("Please select the Appointment");
                        return false;
                    }
                    $scope.addUpdatePatientOrderImageDetailsReq.ModalityId = $scope.addUpdatePatientOrderImageDetailsReq.ModalityId || 0;
                    if ($scope.addUpdatePatientOrderImageDetailsReq.ModalityId == 0) {
                        alertify.error("Please select the Modality");
                        return false;
                    }
                    $scope.addUpdatePatientOrderImageDetailsReq.ProcedureObj = $scope.addUpdatePatientOrderImageDetailsReq.ProcedureObj || '';
                    if ($scope.addUpdatePatientOrderImageDetailsReq.ProcedureObj == '') {
                        alertify.error("Please select the Investigation");
                        return false;
                    }

                    $scope.addUpdatePatientOrderImageDetailsReq.PatientFiles = $scope.imguploadReqObj.PatientFiles || [];



                    if ($scope.tempODImagesArray.length > 0) {
                        angular.forEach($scope.tempODImagesArray, function (item) {
                            $scope.addUpdatePatientOrderImageDetailsReq.PatientFiles.push(item);
                        });
                    };

                    if ($scope.tempOSImagesArray.length > 0) {
                        angular.forEach($scope.tempOSImagesArray, function (item) {
                            $scope.addUpdatePatientOrderImageDetailsReq.PatientFiles.push(item);
                        });
                    };


                    console.log($scope.addUpdatePatientOrderImageDetailsReq);

                    $scope.LogObj.LogArray = [];
                    console.log($scope.addUpdatePatientOrderImageDetailsReq);
                    if ($scope.addUpdatePatientOrderImageDetailsReq != undefined) {
                        if ($scope.addUpdatePatientOrderImageDetailsReq.PatientOrderId == 0) {
                            let obj = {
                                "LogId": 0,
                                "ModuleId": 2,
                                "ModuleName": "ASC",
                                "SubModuleId": 7,
                                "SubModuleName": "Image Management",
                                "ScreenType": "ASC List",
                                "ActionType": 'Added',
                                "ActionDescription": `Order in Image studies for Appointment ID: ${$scope.LogObj.AppointmentId}`,
                                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                            };
                            $scope.LogObj.LogArray.push(obj);
                        }
                        else {
                            let count = comparePatientOrderImageDetails($scope.addUpdatePatientOrderImageDetailsReq, $scope.LogObj);
                            if (count > 0) {
                                let obj = {
                                    "LogId": 0,
                                    "ModuleId": 2,
                                    "ModuleName": "ASC",
                                    "SubModuleId": 7,
                                    "SubModuleName": "Image Management",
                                    "ScreenType": "ASC List",
                                    "ActionType": 'Edited',
                                    "ActionDescription": `Order in Image studies for Appointment ID: ${$scope.LogObj.AppointmentId}`,
                                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                };
                                $scope.LogObj.LogArray.push(obj);
                            }
                        }
                    }
                    $scope.addUpdatePatientOrderImageDetailsReq.Logs = {};
                    $scope.addUpdatePatientOrderImageDetailsReq.Logs = angular.copy($scope.LogObj);


                    eHnotePatientDataService.AddUpdatePatientOrderDetails($scope.addUpdatePatientOrderImageDetailsReq, OnAddPatientSuccess, OnAddPatientError);
                    function OnAddPatientSuccess(response) {
                        console.log(response);

                        alertify.success("Files Added  Successfully");
                        $uibModalInstance.close('save');

                    }
                    function OnAddPatientError() {
                        alertify.error("Creating  Failed");
                    }



                }

                $scope.clearImagePopup = function () {
                    if ($scope.addUpdatePatientOrderImageDetailsReq.PatientOrderId == 0) {
                        $scope.addUpdatePatientOrderImageDetailsReq.AppointmentId = 0;
                        $scope.addUpdatePatientOrderImageDetailsReq.ProcedureObj = "";
                    }
                    $scope.addUpdatePatientOrderImageDetailsReq.ModalityId = 0;
                    $scope.addUpdatePatientOrderImageDetailsReq.OrganId = 0;
                    $scope.addUpdatePatientOrderImageDetailsReq.OrderNumber = "";
                    $scope.addUpdatePatientOrderImageDetailsReq.OrderDate = null;
                    if ($scope.addUpdatePatientOrderImageDetailsReq.PatientOrderId == 0) {
                        $scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList = [];
                    }
                    else {
                        if ($scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList.length > 0) {
                            angular.forEach($scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList, function (item, index) {
                                if (item.DiagnosisDetailId !== 0) {
                                    item.DeleteInd = 'Y';
                                }
                            });
                        }
                    }
                    if ($scope.advisedDiagnosisArray.length > 0) {
                        angular.forEach($scope.advisedDiagnosisArray, function (item) {
                            item.IsCheckedDiagnosis = false;
                        });
                    }
                    //$scope.tempODImagesArray = [];
                    //$scope.tempOSImagesArray = [];
                    $scope.ODFileupload = [];
                    $scope.OSFileupload = [];
                    //  $uibModalInstance.close('clear');
                };
                function comparePatientOrderImageDetails(NewValue, OldValue) {
                    let count = 0;
                    if (NewValue.PatientOrderId != OldValue.PatientOrderId) {
                        count++;
                    }
                    if (NewValue.OrganizationProcedureId != OldValue.OrganizationProcedureId) {
                        count++;
                    }
                    if (NewValue.ProcedureId != OldValue.ProcedureId) {
                        count++;
                    }
                    if (NewValue.ProcedureCode != OldValue.ProcedureCode) {
                        count++;
                    }
                    if (NewValue.ProcedureName != OldValue.ProcedureName) {
                        count++;
                    }
                    if (NewValue.ProcedureObj != OldValue.ProcedureObj) {
                        count++;
                    }
                    if (NewValue.CPTCode != OldValue.CPTCode) {
                        count++;
                    }
                    if (NewValue.ModalityId != OldValue.ModalityId) {
                        count++;
                    }
                    if (NewValue.ModalityName != OldValue.ModalityName) {
                        count++;
                    }
                    if (NewValue.OrganId != OldValue.OrganId) {
                        count++;
                    }
                    if (NewValue.OrderNumber != OldValue.OrderNumber) {
                        count++;
                    }
                    if (NewValue.AppointmentId != OldValue.AppointmentId) {
                        count++;
                    }
                    NewValue.DiagnosisList.forEach(function (Newitem) {
                        var differentItem4 = OldValue.DiagnosisList.filter(function (olditem) {
                            return ((olditem.DeleteInd == Newitem.DeleteInd) && (olditem.PatientImageStudyDiagnosisId == Newitem.PatientImageStudyDiagnosisId) && (olditem.DiagnosisId == Newitem.DiagnosisId) && (olditem.ICD10CODE == Newitem.ICD10CODE))
                        }) || [];
                        if (differentItem4.length == 0) {
                            count++;
                        }
                    });
                    return count;
                }




                $scope.uploadPatientFiles = function ($files) {
                    // $scope.imguploadReqObj.PatientFiles = $files;
                    angular.forEach($files, function (fitem) {
                        var obj = { "file": fitem };
                        $scope.imguploadReqObj.PatientFiles.push(obj)
                    });
                };


                //$scope.tempODImagesArray = [];
                //$scope.tempOSImagesArray = [];
                $scope.ODFileupload = [];
                $scope.OSFileupload = [];
                $scope.Fileupload = "";
                $scope.selectedEyeFiles = function (files, eye) {
                    if (files == null || files == "") {
                        return false;
                    }

                    var sorganid = 1;
                    if (eye == 'OS') { sorganid = 2; } else { sorganid = 1; };
                    if (sorganid === 1) {
                        $scope.ODFileupload = files;
                        if ($scope.ODFileupload != null) {
                            angular.forEach($scope.ODFileupload, function (item) {
                                var pName = item.name, name = "", type = "", exttname = "";

                                if (item.type == "") {
                                    exttname = "dcm";
                                    name = angular.copy(pName);
                                } else {
                                    exttname = item.type;
                                    type = item.type.split("/")[1];
                                    if (pName.length > 9) {
                                        name = pName.substring(0, 9) + "..." + "." + type;
                                    } else {
                                        name = angular.copy(pName) + '.' + type;
                                    }

                                }


                                var obj = {
                                    "S3URL": "",
                                    "DocumentExt": exttname,
                                    "DocumentName": name,
                                    "OrganId": sorganid,
                                    "DeleteInd": "N",
                                    "DocumentId": 0,
                                    "FileTypeId": 5,
                                    "file": item,
                                    "DisplayName": name
                                };

                                $scope.tempODImagesArray.push(obj);

                            });
                        }
                    }
                    else {
                        $scope.OSFileupload = files;
                        if ($scope.OSFileupload != null) {
                            angular.forEach($scope.OSFileupload, function (item) {
                                var pName = item.name, name = "", type = "", exttname = "";

                                if (item.type == "") {
                                    exttname = "dcm";
                                    name = angular.copy(pName);
                                } else {
                                    exttname = item.type;
                                    type = item.type.split("/")[1];
                                    if (pName.length > 9) {
                                        name = pName.substring(0, 9) + "..." + "." + type;
                                    } else {
                                        name = angular.copy(pName) + '.' + type;
                                    }

                                }
                                var obj = {
                                    "S3URL": "",
                                    "DocumentExt": exttname,
                                    "DocumentName": name,
                                    "OrganId": sorganid,
                                    "DeleteInd": "N",
                                    "FileTypeId": 5,
                                    "DocumentId": 0,
                                    "file": item,
                                    "DisplayName": name
                                };

                                $scope.tempOSImagesArray.push(obj);

                            });
                        }
                    }

                    angular.element("input[type='file']").val(null);

                    console.log($scope.tempODImagesArray);
                    console.log($scope.tempOSImagesArray);

                }


                $scope.removeImage = function (item, eye) {

                    var sorganid = 1;
                    if (eye == 'OS') { sorganid = 2; } else { sorganid = 1; };

                    if (item.DocumentId != 0) {
                        item.DeleteInd = "Y";
                    } else {
                        if (sorganid === 1) {
                            var index = $scope.tempODImagesArray.indexOf(item);
                            $scope.tempODImagesArray.splice(index, 1);
                        } else {
                            var index = $scope.tempOSImagesArray.indexOf(item);
                            $scope.tempOSImagesArray.splice(index, 1);
                        }
                    }

                };


                $scope.GetOrganizationProcedure = function (text) {

                    //var params = {
                    //    "OrganizationId": $scope.HospitalId,
                    //    "ProcedureId": 0,
                    //    "CPTCODE": "",  // cptcode tblorganizationprocedure
                    //    "SearchText": text || "", // searchtext
                    //    "TypeOfServiceId": 0,
                    //    "PageNumber": 1,
                    //    "PageSize": 10,
                    //    "Status": 1,
                    //    "IsFrequent": "N"
                    //};
                    //if (params.SearchText == '') {
                    //    params.IsFrequent = 'Y';
                    //}

                    //return eHnoteSettingsDataService.GetOrganizationProcedures(params).then(function (resp) {
                    //    if (resp.data.rows !== undefined) {
                    //        return resp.data.rows.map(function (item) {
                    //            return item;
                    //        });
                    //    }
                    //});
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
                        "ParentOrganizationId": $scope.ParenthospitalId
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
                    $scope.addUpdatePatientOrderImageDetailsReq.OrganizationProcedureId = "";
                    $scope.addUpdatePatientOrderImageDetailsReq.ProcedureId = "";
                    $scope.addUpdatePatientOrderImageDetailsReq.ProcedureCode = "";
                    $scope.addUpdatePatientOrderImageDetailsReq.ProcedureName = "";
                    $scope.addUpdatePatientOrderImageDetailsReq.CPTCode = "";
                    $scope.addUpdatePatientOrderImageDetailsReq.CategoryId = 0;

                }

                $scope.onSelectProcedureInv = function (obj) {

                    console.log(obj);

                    $scope.addUpdatePatientOrderImageDetailsReq.OrganizationProcedureId = obj.OrganizationProcedureId;
                    $scope.addUpdatePatientOrderImageDetailsReq.ProcedureId = obj.ProcedureId;
                    $scope.addUpdatePatientOrderImageDetailsReq.ProcedureCode = obj.ProcedureCode;
                    $scope.addUpdatePatientOrderImageDetailsReq.ProcedureName = obj.ProcedureName;
                    $scope.addUpdatePatientOrderImageDetailsReq.CPTCode = obj.CPTCode;
                    $scope.addUpdatePatientOrderImageDetailsReq.CategoryId = obj.CategoryId || 0;
                };


                $scope.changeselectOrderDiagnosisitem = function (obj) {

                    console.log(obj);

                };

                $scope.onselectOrderDiagnosisitem = function (val) {


                    var List = $filter("filter")($scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList, function (Aitem) {
                        return (Aitem.DiagnosisId === val.DiagnosisId && Aitem.DeleteInd == "N");
                    });
                    if (List.length > 0) {
                        alertify.error('You have already Selected this Diagnosis');
                        $scope.newSelectedDiagObj = "";
                        return false;
                    }
                    else {


                        var obj = getDiagnosisOrderObj();
                        obj.ConsultationDiagnosisId = 0;
                        obj.DiagnosisDetailId = 0;
                        obj.DiagnosisId = val.DiagnosisId;
                        obj.DiagnosisName = val.ICD10DIAGNAME;
                        obj.ICDCode = val.ICD10CODE;
                        obj.DeleteInd = "N";
                        obj.CreatedDateTime = $filter('date')(new Date(), "MM-dd-yyyy h:mm a");

                        if (val.OrganId == 1) {
                            obj.LocationId1 = 1;
                            obj.Location1 = 'OD';
                            obj.DiagnosisStatusId1 = 2;
                        } else if (val.OrganId == 2) {
                            obj.LocationId2 = 2;
                            obj.Location2 = 'OS';
                            obj.DiagnosisStatusId2 = 2;
                        } else if (val.OrganId == 3) {
                            obj.LocationId1 = 1;
                            obj.LocationId2 = 2;
                            obj.Location1 = 'OD';
                            obj.Location2 = 'OS';
                            obj.DiagnosisStatusId1 = 2;
                            obj.DiagnosisStatusId2 = 2;
                        } else if (val.OrganId == 0) {
                            obj.LocationId1 = 0;
                            obj.Location1 = '';
                        } else { }
                        $scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList.push(obj);
                        $scope.newSelectedDiagObj = "";

                    }



                }

                $scope.changeadvicedDiagnosis = function (obj) {

                    if (obj.IsCheckedDiagnosis) {
                        var List = $filter("filter")($scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList, function (Aitem) {
                            return (Aitem.DiagnosisId === obj.DiagnosisId && Aitem.DeleteInd == "N");
                        });

                        if (List.length > 0) {
                            alertify.error('You have already Selected this Diagnosis');
                            $scope.newSelectedDiagObj = "";
                            return false;
                        }
                        else {

                            var newobj = getDiagnosisOrderObj();
                            newobj.ConsultationDiagnosisId = 0;
                            newobj.DiagnosisDetailId = 0;
                            newobj.DiagnosisId = obj.DiagnosisId;
                            newobj.DiagnosisName = obj.ICD10DIAGNAME;
                            newobj.ICDCode = obj.ICD10CODE;
                            newobj.DeleteInd = "N";

                            $scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList.push(newobj);
                            $scope.newSelectedDiagObj = "";

                        }
                    } else {

                        angular.forEach($scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList, function (sitem, index) {
                            if (sitem.DiagnosisId == obj.DiagnosisId) {
                                $scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList.splice(index, 1);
                            }
                        });



                    }
                }


                $scope.removedSelectedDiagnosis = function (obj) {
                    angular.forEach($scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList, function (sitem, index) {
                        if (sitem.DiagnosisId == obj.DiagnosisId) {



                            if (obj.DiagnosisDetailId === 0) {
                                $scope.addUpdatePatientOrderImageDetailsReq.DiagnosisList.splice(index, 1);
                            }
                            else {
                                obj.DeleteInd = 'Y';
                            }

                        }
                    });

                    angular.forEach($scope.advisedDiagnosisArray, function (aitem) {
                        if (aitem.DiagnosisId === obj.DiagnosisId) {
                            aitem.IsCheckedDiagnosis = false;
                        }
                    });
                }



                $scope.onInvOrderProcedureChange = function () {
                    $scope.addUpdatePatientOrderImageDetailsReq.OrganizationInvestigationId = "";
                    $scope.addUpdatePatientOrderImageDetailsReq.InvestigationId = "";
                    $scope.addUpdatePatientOrderImageDetailsReq.ProcedureCode = "";
                    $scope.addUpdatePatientOrderImageDetailsReq.InvestigationName = "";
                    $scope.addUpdatePatientOrderImageDetailsReq.CPTCode = "";
                }

                $scope.onSelectOrderProcedureInv = function (obj) {

                    console.log(obj);

                    $scope.addUpdatePatientOrderImageDetailsReq.OrganizationProcedureId = obj.OrganizationProcedureId;
                    $scope.addUpdatePatientOrderImageDetailsReq.ProcedureId = obj.ProcedureId;
                    $scope.addUpdatePatientOrderImageDetailsReq.ProcedureCode = obj.ProcedureCode;
                    $scope.addUpdatePatientOrderImageDetailsReq.ProcedureName = obj.ProcedureName;
                    $scope.addUpdatePatientOrderImageDetailsReq.CPTCode = obj.CPTCode;
                };

            }
        });

        $scope.mInstanceAdd.result.then(function (result) {
            console.log(result);
            $scope.ImageObj.PatientImageInd = true;

            if (PatientOrderId === 0) {
                $scope.navtoMainImageTab(1);
            } else {
                /*  $scope.getPatientAppointmentInvestigationFiles(0);*/
                $scope.getPatientVisitInvestagationfiles(0);
                $scope.getPatientOrderDetailsList($scope.selectedImageStudyObj.PatientOrderId);
            }


        }, function (cancel) {
        });
    };




    function onMouseWheelMove($event) {
        var event = $window.event || $event; // old IE support
        var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
        if ($scope.options.controls.filmStrip) {
            picPos.y += 50 * delta;
            // Limit range
            if (picPos.y > 15) {
                picPos.y = 15;
            }
            if (reader.images) {
                if (picPos.y - reader.height * $scope.options.zoom.value < -(reader.height + 15) * reader.images.length * $scope.options.zoom.value) {
                    picPos.y = -(reader.height + 15) * reader.images.length + reader.height;
                }
            } else {
                if (picPos.y - reader.height * $scope.options.zoom.value < -reader.height * $scope.options.zoom.value) {
                    picPos.y = -reader.height * $scope.options.zoom.value;
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
                oldWidth = reader.width * $scope.options.zoom.value;
                oldHeight = reader.height * $scope.options.zoom.value;
            }

            // Compute new zoom
            $scope.options.zoom.value += $scope.options.zoom.step * direction;
            // Round
            $scope.options.zoom.value = Math.round($scope.options.zoom.value * 100) / 100;
            if ($scope.options.zoom.value >= $scope.options.zoom.max) {
                $scope.options.zoom.value = $scope.options.zoom.max;
            }
            if ($scope.options.zoom.value <= $scope.options.zoom.min) {
                $scope.options.zoom.value = $scope.options.zoom.min;
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
                newWidth = reader.width * $scope.options.zoom.value;
                newHeight = reader.height * $scope.options.zoom.value;
            }
            // new image position after zoom
            picPos.x = picPos.x - (newWidth - oldWidth) / 2;
            picPos.y = picPos.y - (newHeight - oldHeight) / 2;
        });
    };

    // Rotate function
    $scope.rotate = function (direction) {
        $scope.$applyAsync(function () {
            $scope.options.rotate.value += $scope.options.rotate.step * direction;
            if (($scope.options.rotate.value <= -360) || ($scope.options.rotate.value >= 360)) {
                $scope.options.rotate.value = 0;
            }
            applyTransform();
        });
    };

    // Flip the OD/OS image. axis: 'h' = horizontal (mirror left-right), 'v' = vertical.
    // Mirrors zoomInClick's behaviour: when Sync Images is on, both eyes flip together.
    $scope.flipImage = function (organ, axis) {
        var key = (axis === 'v') ? 'v' : 'h';

        function flipOD() {
            if (!$scope.options.flip) { $scope.options.flip = { h: 1, v: 1 }; }
            $scope.options.flip[key] = $scope.options.flip[key] * -1;
            applyTransform();
        }

        function flipOS() {
            if (!$scope.optionsOS.flip) { $scope.optionsOS.flip = { h: 1, v: 1 }; }
            $scope.optionsOS.flip[key] = $scope.optionsOS.flip[key] * -1;
            applyTransformOS();
        }

        $scope.$applyAsync(function () {
            if (organ === 'OS') {
                flipOS();
                if ($scope.syncEnabled) { flipOD(); }
            } else {
                flipOD();
                if ($scope.syncEnabled) { flipOS(); }
            }
        });
    };

    // Resize canvas function
    function resizeCanvas() {
        $scope.$applyAsync(function () {
            var canvasSize = canvasEl.parentNode;
            // Going from unmeasured (modal animating) to measured means the fit
            // zoom was never computed against real dimensions - re-fit instead of
            // just redrawing, otherwise the image stays invisible until the user
            // zooms or picks a thumbnail.
            var wasUnmeasured = (!ctx.canvas.width || !ctx.canvas.height);
            ctx.canvas.width = canvasSize.clientWidth;
            ctx.canvas.height = canvasSize.clientHeight;
            if (wasUnmeasured && canvasSize.clientWidth && canvasSize.clientHeight) {
                $scope.resizeTo($scope.options.controls.fit);
            } else {
                applyTransform();
            }
        });
    }

    // Parent change function
    function parentChange() {
        if (resize.width != canvasEl.parentNode.clientWidth) {
            resize.width = canvasEl.parentNode.clientWidth;
        }

        if (resize.height != canvasEl.parentNode.clientHeight) {
            resize.height = canvasEl.parentNode.clientHeight;
        }
        return resize;
    }



    // Play function
    $scope.play = function () {
        if ($scope.options.adsrc != null) {
            $scope.options.adsrc.start(0);
        }
    }

    // Stop function
    $scope.stop = function () {
        if ($scope.options.adsrc != null) {
            $scope.options.adsrc.stop(0);
        }
    }

    // Initialization code or any other setup


    function applyTransform() {


        if (reader == null) {
            return;
        }
        if (!reader.rendered) {
            return;
        }


        console.log("init called");
        var options = $scope.options;
        var canvas = ctx.canvas;
        var centerX = reader.width * $scope.options.zoom.value / 2;
        var centerY = reader.height * $scope.options.zoom.value / 2;
        // Clean before draw
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Save context
        ctx.save();
        // move to mouse position
        ctx.translate((picPos.x + centerX), (picPos.y + centerY));
        // Rotate canvas
        ctx.rotate($scope.options.rotate.value * Math.PI / 180);
        // Go back
        ctx.translate(- centerX, - centerY);
        // Change scale
        if (reader.isZoom)
            ctx.scale($scope.options.zoom.value, $scope.options.zoom.value);
        // Flip horizontally / vertically about the image centre
        if ($scope.options.flip && ($scope.options.flip.h === -1 || $scope.options.flip.v === -1)) {
            ctx.translate($scope.options.flip.h === -1 ? reader.width : 0,
                          $scope.options.flip.v === -1 ? reader.height : 0);
            ctx.scale($scope.options.flip.h, $scope.options.flip.v);
        }
        if ((!$scope.options.controls.filmStrip) || ($scope.options.controls.totalPage == 1)) {
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
                ctx.rotate($scope.options.rotate.value * Math.PI / 180);
                // Go back
                ctx.translate(- centerX, - centerY);
                // Change scale
                ctx.scale($scope.options.zoom.value, $scope.options.zoom.value);
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





    $scope.zoomInClick = function (val) {
        $scope.zoom(val);
        if ($scope.syncEnabled) {
            $scope.zoomOS(val);
        }
    }













    //OSEyeInitialization








    function onMouseWheelMoveOS($event) {
        var event = $window.event || $event; // old IE support
        var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

        console.log($scope.optionsOS.controls.filmStrip);

        if ($scope.optionsOS.controls.filmStrip) {
            picPosOS.y += 50 * delta;
            // Limit range
            if (picPosOS.y > 15) {
                picPosOS.y = 15;
            }
            if (readerOS.images) {
                if (picPosOS.y - readerOS.height * $scope.optionsOS.zoom.value < -(readerOS.height + 15) * readerOS.images.length * $scope.optionsOS.zoom.value) {
                    picPosOS.y = -(readerOS.height + 15) * readerOS.images.length + readerOS.height;
                }
            } else {
                if (picPosOS.y - readerOS.height * $scope.optionsOS.zoom.value < -readerOS.height * $scope.optionsOS.zoom.value) {
                    picPosOS.y = -readerOS.height * $scope.optionsOS.zoom.value;
                }
            }
            //
            $scope.$applyAsync(function () {
                applyTransformOS();
            });
        } else {
            if (delta > 0) {
                $scope.zoomOS(1);
            } else {
                $scope.zoomOS(-1);
            }
        }
        // for IE
        event.returnValue = false;
        // for Chrome and Firefox
        if (event.preventDefault) {
            event.preventDefault();
        }
    }



    // Zoom function
    $scope.zoomOS = function (direction) {
        $scope.$applyAsync(function () {
            var oldWidth, newWidth = 0;
            var oldHeight, newHeight = 0;
            // Does readerOS support zoom ?
            // Compute correct width
            if (!readerOS.isZoom) {
                oldWidth = readerOS.oldwidth;
                oldHeight = readerOS.height;
            } else {
                oldWidth = readerOS.width * $scope.optionsOS.zoom.value;
                oldHeight = readerOS.height * $scope.optionsOS.zoom.value;
            }

            // Compute new zoom
            $scope.optionsOS.zoom.value += $scope.optionsOS.zoom.step * direction;
            // Round
            $scope.optionsOS.zoom.value = Math.round($scope.optionsOS.zoom.value * 100) / 100;
            if ($scope.optionsOS.zoom.value >= $scope.optionsOS.zoom.max) {
                $scope.optionsOS.zoom.value = $scope.optionsOS.zoom.max;
            }
            if ($scope.optionsOS.zoom.value <= $scope.optionsOS.zoom.min) {
                $scope.optionsOS.zoom.value = $scope.optionsOS.zoom.min;
            }
            // Refresh picture
            if (readerOS.refresh != null) {
                readerOS.refresh();
            }


            // Compute new image size
            if (!readerOS.isZoom) {
                newWidth = readerOS.width;
                newHeight = readerOS.height;
            } else {
                newWidth = readerOS.width * $scope.optionsOS.zoom.value;
                newHeight = readerOS.height * $scope.optionsOS.zoom.value;
            }
            // new image position after zoom
            picPosOS.x = picPosOS.x - (newWidth - oldWidth) / 2;
            picPosOS.y = picPosOS.y - (newHeight - oldHeight) / 2;
        });
    };

    // Rotate function
    $scope.rotateOS = function (direction) {
        $scope.$applyAsync(function () {
            $scope.optionsOS.rotate.value += $scope.optionsOS.rotate.step * direction;
            if (($scope.optionsOS.rotate.value <= -360) || ($scope.optionsOS.rotate.value >= 360)) {
                $scope.optionsOS.rotate.value = 0;
            }
            applyTransformOS();
        });
    };

    // Resize canvas function
    function resizeCanvasOS() {
        $scope.$applyAsync(function () {
            var canvasSizeOS = canvasOSEl.parentNode;
            // See resizeCanvas: re-fit when the panel first gains real dimensions.
            var wasUnmeasured = (!ctxOS.canvas.width || !ctxOS.canvas.height);
            ctxOS.canvas.width = canvasSizeOS.clientWidth;
            ctxOS.canvas.height = canvasSizeOS.clientHeight;
            if (wasUnmeasured && canvasSizeOS.clientWidth && canvasSizeOS.clientHeight) {
                $scope.resizeToOS($scope.optionsOS.controls.fit);
            } else {
                applyTransformOS();
            }
        });
    }

    // Parent change function
    function parentChangeOS() {
        if (resizeOS.width != canvasOSEl.parentNode.clientWidth) {
            resizeOS.width = canvasOSEl.parentNode.clientWidth;
        }

        if (resizeOS.height != canvasOSEl.parentNode.clientHeight) {
            resizeOS.height = canvasOSEl.parentNode.clientHeight;
        }
        return resizeOS;
    }


    // Play function
    $scope.playOS = function () {
        if ($scope.optionsOS.adsrc != null) {
            $scope.optionsOS.adsrc.start(0);
        }
    }

    // Stop function
    $scope.stopOS = function () {
        if ($scope.optionsOS.adsrc != null) {
            $scope.optionsOS.adsrc.stop(0);
        }
    }

    // Initialization code or any other setup


    function applyTransformOS() {
        console.log("apply called");
        if (readerOS == null) {
            return;
        }
        if (!readerOS.rendered) {
            return;
        }



        var options = $scope.optionsOS;
        var canvasOS = ctxOS.canvas;
        var centerXOS = readerOS.width * $scope.optionsOS.zoom.value / 2;
        var centerYOS = readerOS.height * $scope.optionsOS.zoom.value / 2;
        // Clean before draw
        ctxOS.clearRect(0, 0, canvasOS.width, canvasOS.height);
        // Save context
        ctxOS.save();
        // move to mouse position
        ctxOS.translate((picPosOS.x + centerXOS), (picPosOS.y + centerYOS));
        // Rotate canvas
        ctxOS.rotate($scope.optionsOS.rotate.value * Math.PI / 180);
        // Go back
        ctxOS.translate(- centerXOS, - centerYOS);
        // Change scale
        if (readerOS.isZoom)
            ctxOS.scale($scope.optionsOS.zoom.value, $scope.optionsOS.zoom.value);
        // Flip horizontally / vertically about the image centre
        if ($scope.optionsOS.flip && ($scope.optionsOS.flip.h === -1 || $scope.optionsOS.flip.v === -1)) {
            ctxOS.translate($scope.optionsOS.flip.h === -1 ? readerOS.width : 0,
                            $scope.optionsOS.flip.v === -1 ? readerOS.height : 0);
            ctxOS.scale($scope.optionsOS.flip.h, $scope.optionsOS.flip.v);
        }
        if ((!$scope.optionsOS.controls.filmStrip) || ($scope.optionsOS.controls.totalPage == 1)) {
            if (readerOS.img != null) {
                ctxOS.drawImage(readerOS.img, 0, 0, readerOS.width, readerOS.height);
                ctxOS.beginPath();
                ctxOS.rect(0, 0, readerOS.width, readerOS.height);
                ctxOS.lineWidth = 0.2;
                ctxOS.strokeStyle = "#000000";
                ctxOS.stroke();
            }
            // Draw image at correct position with correct scale
            if (readerOS.data != null) {
                ctxOS.putImageData(readerOS.data, picPosOS.x, picPosOS.y);
                ctxOS.beginPath();
                ctxOS.rect(0, 0, readerOS.width, readerOS.height);
                ctxOS.lineWidth = 0.2;
                ctxOS.strokeStyle = "#000000";
                ctxOS.stroke();
            }
        } else {

            console.log(readerOS);
            if (readerOS.images != null) {
                angular.forEach(readerOS.images, function (image) {
                    ctxOS.drawImage(image, 0, 0, image.width, image.height);
                    ctxOS.beginPath();
                    ctxOS.rect(0, 0, image.width, image.height);
                    ctxOS.lineWidth = 0.2;
                    ctxOS.strokeStyle = "#000000";
                    ctxOS.stroke();
                    ctxOS.translate(0, image.height + 15);
                });
            }
            // Draw image at correct position with correct scale
            if (readerOS.data != null) {
                var offsetY = 0;
                angular.forEach(readerOS.data, function (data) {
                    ctxOS.putImageData(data, picPosOS.x, picPosOS.y + offsetY);
                    ctxOS.beginPath();
                    ctxOS.rect(0, 0, readerOS.width, readerOS.height);
                    ctxOS.lineWidth = 0.2;
                    ctxOS.strokeStyle = "#000000";
                    ctxOS.stroke();
                    offsetY += readerOS.height + 15;
                    ctxOS.translate(0, offsetY);
                });
            }
        }
        // Restore
        ctxOS.restore();

        // Draw overlays
        if (overlaysOS.length > 0) {
            angular.forEach(overlaysOS, function (item) {
                ctxOS.save();
                // move to mouse position
                ctxOS.translate((picPosOS.x + centerXOS), (picPosOS.y + centerYOS));
                // Rotate canvas
                ctxOS.rotate($scope.optionsOS.rotate.value * Math.PI / 180);
                // Go back
                ctxOS.translate(- centerXOS, - centerYOS);
                // Change scale
                ctxOS.scale($scope.optionsOS.zoom.value, $scope.optionsOS.zoom.value);
                // Start rect draw
                ctxOS.beginPath();
                ctxOS.rect((item.x), (item.y), item.w, item.h);
                ctxOS.fillStyle = item.color;
                ctxOS.globalAlpha = 0.4;
                ctxOS.fill();
                ctxOS.lineWidth = 1;
                ctxOS.strokeStyle = item.color;
                ctxOS.stroke();
                ctxOS.restore();
            });
        }
    }





    $scope.zoomInClickOS = function (val) {
        $scope.zoomOS(val);
        if ($scope.syncEnabled) {
            $scope.zoom(val);
        }
    }
    $scope.syncEnabled = false;
    $scope.syncZoom = function () {
        $scope.syncEnabled = !$scope.syncEnabled;

        $scope.resizeToOS('page');
        $scope.resizeTo('page');
    };

    $scope.navDocumentToOtherSection = function (organ) {

        var params = {
            "UserId": $scope.UserId,
            "PatientOrderId": 0,
            "PatientImageStudyId": 0,
            "DocumentId": 0,
            "OrganId": 0
        }
        if (organ == "OD") {

            console.log($scope.OSImgObj);
            angular.forEach($scope.selectedImageStudyFiles.LeftEyeFiles, function (sitem, index) {
                var obj = {
                    "big": sitem.small,
                    "small": sitem.small,
                    "OrganId": sitem.OrganId,
                    "DocumentId": sitem.DocumentId,
                    "isActive": false,
                    "isDicomFile": sitem.isDicomFile
                }
                if (index == $scope.OSImgObj.Index) {
                    $scope.selectedImageStudyFiles.RightEyeFiles.push(obj);
                }
            });
            $scope.selectedImageStudyFiles.LeftEyeFiles.splice($scope.OSImgObj.Index, 1);
            $scope.clickonParticularImage($scope.selectedImageStudyFiles.RightEyeFiles[0], 0);

            if ($scope.selectedImageStudyFiles.LeftEyeFiles.length > 0) {
                $scope.clickonRParticularImage($scope.selectedImageStudyFiles.LeftEyeFiles[0], 0);
            } else {

                //var ctx = canvasODEl.getContext('2d');
                //ctx.clearRect(0, 0, canvasODEl.width, canvasODEl.height);
                let canvas = ctxOS.canvas;
                ctxOS.clearRect(0, 0, canvas.width, canvas.height);
                ctxOS.save();
                readerOS = null

            }


            params.DocumentId = $scope.OSImgObj.DocumentId;
            params.OrganId = 1;


        }

        else if (organ == "OS") {

            console.log($scope.ODImgObj);

            angular.forEach($scope.selectedImageStudyFiles.RightEyeFiles, function (sitem, index) {
                var obj = {
                    "big": sitem.small,
                    "small": sitem.small,
                    "OrganId": sitem.OrganId,
                    "DocumentId": sitem.DocumentId,
                    "isActive": false,
                    "isDicomFile": sitem.isDicomFile
                }
                if (index == $scope.ODImgObj.Index) {
                    $scope.selectedImageStudyFiles.LeftEyeFiles.push(obj);
                }
            });
            $scope.selectedImageStudyFiles.RightEyeFiles.splice($scope.ODImgObj.Index, 1);
            if ($scope.selectedImageStudyFiles.RightEyeFiles.length > 0) {
                $scope.clickonParticularImage($scope.selectedImageStudyFiles.RightEyeFiles[0], 0);
            } else {
                //var ctxOS = canvasEl.getContext('2d');
                //ctxOS.clearRect(0, 0, canvasEl.width, canvasEl.height);
                let canvas = ctx.canvas;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();
                reader = null;
            }

            $scope.clickonRParticularImage($scope.selectedImageStudyFiles.LeftEyeFiles[0], 0);
            params.DocumentId = $scope.ODImgObj.DocumentId;
            params.OrganId = 1;
        }

        eHnotePatientDataService.UpdateImagestudyFile(params).then(function (resp) {
            console.log(resp);
            if (resp.data.status == "Success") {
                $scope.getPatientOrderDetailsList($scope.selectedImageStudyObj.PatientOrderId);
            }
        }, function (err) {
            alertify.error(err.Messege);
        });
    }







    $scope.enableDrawing = function (organ) {

        if (organ == 'OD') {
            $scope.isDrawingOD = !$scope.isDrawingOD;
            //$scope.resizeTo('page');
        }

        if (organ == 'OS') {
            $scope.isDrawingOS = !$scope.isDrawingOS;
            //$scope.resizeToOS('page');
        }
    };

    $scope.clearDrawing = function (organ) {
        if (organ == 'OD') {
            applyTransform();
        }
        if (organ == 'OS') {
            applyTransformOS();
        }
    };


    $scope.saveCanvasDrawingDetails = function (organ) {


        var canvass = null; var dataURL = "";
        var organId = 0;
        var docId = 0;
        var s3url = "";
        var filename = "";
        if (organ == "OD") {
            canvass = document.getElementById("ODviewer");
            dataURL = canvass.toDataURL();
            organId = 1;
            docId = $scope.ODImgObj.DocumentId;
            s3url = $scope.ODImgObj.S3URL;
        } else {
            canvass = document.getElementById("OSviewer");
            dataURL = canvass.toDataURL();
            organId = 2;
            docId = $scope.OSImgObj.DocumentId;
            s3url = $scope.OSImgObj.S3URL;
        };


        if (s3url != "") {
            filename = s3url.substring(s3url.lastIndexOf("/") + 1);
        }


        var params = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "PatientOrderId": $scope.selectedImageStudyObj.PatientOrderId,
            "PatientDocumentId": docId,
            "PatientId": $scope.PatientId,
            "PatientName": $scope.PatientName,
            "Base64": dataURL,
            "S3URL": s3url,
            "OrganId": organId,
            "FileName": filename,
            "FileExt": "png"
        };

        console.log(JSON.stringify(params));



        eHnotePatientDataService.AddUpdatePatientImageStudyDrawing(params).then(function (resp) {
            console.log(resp);
            if (resp.data.status == "Success") {
                $scope.getPatientOrderDetailsList($scope.selectedImageStudyObj.PatientOrderId);
            }
        }, function (err) {
            alertify.error(err.Messege);
        });

        $scope.isDrawingOD = false;
        $scope.isDrawingOS = false;
    };




    $scope.navtoOpenCustomImageManagementPopup = function (organ, viewtype) {


        console.log($scope.ODImgObj);
        console.log($scope.OSImgObj);


        var rightfiles = [], leftfiles = [], rightobj = "", leftobj = "", isDicomViewer = false;
        if (viewtype == 'single') {
            if (organ == 'OD') {
                rightfiles = $scope.selectedImageStudyFiles.RightEyeFiles;
                rightobj = $scope.ODImgObj;
            } else {
                leftfiles = $scope.selectedImageStudyFiles.LeftEyeFiles;
                leftobj = $scope.OSImgObj;
            }
            if (rightobj.isDicomFile) {
                isDicomViewer = true;
            }

        }
        else {
            rightfiles = $scope.selectedImageStudyFiles.RightEyeFiles;
            rightobj = $scope.ODImgObj;
            leftfiles = $scope.selectedImageStudyFiles.LeftEyeFiles;
            leftobj = $scope.OSImgObj;
        }

        var obj = {
            "PatientId": $scope.PatientId,
            "AppointmentId": $scope.cacheStorageItem.appointmentid,
            "PatientName": $scope.PatientName,
            "Organ": organ || 'OD',
            "RightEyeFiles": rightfiles || [],
            "LeftEyeFiles": leftfiles || [],
            "AllFiles": [],
            "selectedImageStudyObj": $scope.selectedImageStudyObj,
            "viewType": viewtype,
            "imgODObj": rightobj,
            "imgOSObj": leftobj,
            "isCompareViewShow": false,
            "showDicomViewer": isDicomViewer
        };




        $scope.customModelInstance = $uibModal.open({
            "templateUrl": "templates/uibpopups/customImageManagementViewer.html",
            "backdrop": "static",
            "backdropClass": "customimgmanagementpopupback",
            "keyboard": false,
            "resolve": {
                "parentObj": function () { return obj; },
            },
            "windowClass": "modal-full-popup overflow-hidden",
            "controller": "EhnotePopupImageManagementViewer"
        });
        $scope.customModelInstance.result.then(function (resp) {
            console.log(resp);
            $scope.getPatientOrderDetailsList($scope.selectedImageStudyObj.PatientOrderId);
        }, function () { });
    }


    $scope.navtoOpenProgressionPopup = function (organ, viewtype) {





        var rightfiles = [], leftfiles = [], rightobj = "", leftobj = "", cnewtype = "single", iscompareshow = false, isDicomViewer = false;
        if (viewtype == 'compare') {
            if (organ == 'OD') {
                rightfiles = $scope.selectedImageStudyFiles.RightEyeFiles;
                rightobj = $scope.ODImgObj;
            } else {
                rightfiles = $scope.selectedImageStudyFiles.LeftEyeFiles;
                rightobj = $scope.OSImgObj;
            }
            iscompareshow = true;
            if (rightobj.isDicomFile) {
                isDicomViewer = true;
            }
        }
        else {

            if (organ == 'OD') {
                rightfiles = $scope.selectedImageStudyFiles.RightEyeFiles;
                rightobj = $scope.ODImgObj;
            } else {
                rightfiles = $scope.selectedImageStudyFiles.LeftEyeFiles;
                rightobj = $scope.OSImgObj;
            }
            //rightobj = $scope.ODImgObj;
            //leftobj = $scope.OSImgObj;
            cnewtype = "grid";
        }

        var obj = {
            "PatientId": $scope.PatientId,
            "AppointmentId": $scope.cacheStorageItem.appointmentid,
            "PatientName": $scope.PatientName,
            "Organ": 'OD',
            "RightEyeFiles": rightfiles || [],
            "LeftEyeFiles": leftfiles || [],
            "AllFiles": $scope.selectedImageStudyFiles.AllFiles || [],
            "selectedImageStudyObj": $scope.selectedImageStudyObj,
            "viewType": cnewtype,
            "imgODObj": rightobj,
            "imgOSObj": leftobj,
            "isCompareViewShow": iscompareshow,
            "showDicomViewer": isDicomViewer
        };


        $scope.customModelInstance = $uibModal.open({
            "templateUrl": "templates/uibpopups/customImageManagementViewer.html",
            "backdrop": "static",
            "backdropClass": "customimgmanagementpopupback",
            "keyboard": false,
            "resolve": {
                "parentObj": function () { return obj; },
            },
            "windowClass": "modal__popup--1 bottom-to-top-modal in",
            "controller": "EhnotePopupImageManagementViewer"
        });
        $scope.customModelInstance.result.then(function (resp) {
            console.log(resp);

        }, function () { });
    }

    $scope.saveDrawingCanvas = function (orgn) {
        var params = "";
        if (orgn == 'OD') {
            //var canvas = document.querySelector('#dwvOD canvas');
            //var imageData = canvas.toDataURL();

            var elementToCapture = document.querySelector('#layerGroupAOD');

            // Use html2canvas to capture the element
            html2canvas(elementToCapture).then(function (canvas) {
                // Convert the captured canvas to base64 data URL
                var imageData = canvas.toDataURL();

                console.log(imageData); // You can log it or further process it as needed

                params = {
                    "UserId": $scope.UserId,
                    "HospitalId": $scope.HospitalId,
                    "PatientOrderId": $scope.selectedImageStudyObj.PatientOrderId,
                    "PatientDocumentId": 0,
                    "PatientId": $scope.PatientId,
                    "PatientName": $scope.PatientName,
                    "Base64": imageData,
                    "S3URL": "",
                    "OrganId": 1,
                    "FileName": "",
                    "FileExt": "png"
                }


                console.log(JSON.stringify(params));


                eHnotePatientDataService.AddUpdatePatientImageStudyDrawing(params).then(function (resp) {
                    console.log(resp);
                    if (resp.data.status == "Success") {
                        $scope.getPatientOrderDetailsList($scope.selectedImageStudyObj.PatientOrderId);
                    }
                }, function (err) {
                    alertify.error(err.Messege);
                });
            });



        }
        if (orgn == 'OS') {

            var elementToCapture = document.querySelector('#layerGroupAOS');

            // Use html2canvas to capture the element
            html2canvas(elementToCapture).then(function (canvas) {
                // Convert the captured canvas to base64 data URL
                var imageData = canvas.toDataURL();

                console.log(imageData); // You can log it or further process it as needed

                params = {
                    "UserId": $scope.UserId,
                    "HospitalId": $scope.HospitalId,
                    "PatientOrderId": $scope.selectedImageStudyObj.PatientOrderId,
                    "PatientDocumentId": 0,
                    "PatientId": $scope.PatientId,
                    "PatientName": $scope.PatientName,
                    "Base64": imageData,
                    "S3URL": "",
                    "OrganId": 2,
                    "FileName": "",
                    "FileExt": "png"
                }


                console.log(JSON.stringify(params));


                eHnotePatientDataService.AddUpdatePatientImageStudyDrawing(params).then(function (resp) {
                    console.log(resp);
                    if (resp.data.status == "Success") {
                        $scope.getPatientOrderDetailsList($scope.selectedImageStudyObj.PatientOrderId);
                    }
                }, function (err) {
                    alertify.error(err.Messege);
                });
            });
        }



    }

    $scope.ClearImgFindingObj = function (item) {
        /*$scope.selectedImageStudyObj = getnewImageStudyDetailsAddReqObj();*/
        item.DoctorId = '';
        item.DoctorName = '';
        item.DoctorObj.FullName = 'Select';
        item.TechnicianId = '';
        item.TechnicianName = '';
        item.TechnicianObj.FullName = 'Select';
        item.ProviderRemarks = '';
        item.TechnicianRemarks = '';

        if (item.ModalityId == 1) {
            item.ODK1Value = '';
            item.ODK2Value = '';
            item.ODCYLValue = '';
            item.ODCornealThicknessValue = '';

            item.OSK1Value = '';
            item.OSK2Value = '';
            item.OSCYLValue = '';
            item.OSCornealThicknessValue = '';
        }
        else if (item.ModalityId == 2) {
            item.ODEndothelialCellCountValue = '';
            item.ODEndothelialCellDensity = '';
            item.ODEndoCornealThicknessValue = '';

            item.OSEndothelialCellCountValue = '';
            item.OSEndothelialCellDensity = '';
            item.OSEndoCornealThicknessValue = '';
        }
        else if (item.ModalityId == 3) {
            item.ODOCTMACFindings = '';
            item.OSOCTMACFindings = '';
        }
        else if (item.ModalityId == 4) {
            item.ODIOLLensValue = '';
            item.ODIOLPower = '';
            item.ODToricPower = '';
            item.ODIOLManufacturer = '';

            item.OSIOLLensValue = '';
            item.OSIOLPower = '';
            item.OSToricPower = '';
            item.OSIOLManufacturer = '';
        }
        else if (item.ModalityId == 5) {
            item.ODMacularFindingValue = '';
            item.ODMacularThickNess = '';
            item.ODONfindingValue = '';
            item.ODRHFLThickNess = '';
            item.ODASOCTfindingValue = '';

            item.OSMacularFindingValue = '';
            item.OSMacularThickNess = '';
            item.OSONfindingValue = '';
            item.OSRHFLThickNess = '';
            item.OSASOCTfindingValue = '';
        }
        else if (item.ModalityId == 6) {
            item.ODFundusFindingValue = '';
            item.ODFAFindingValue = '';
            item.ODICGFindingValue = '';
            item.OSFundusFindingValue = '';
            item.OSFAFindingValue = '';
            item.OSICGFindingValue = '';
        }
        else if (item.ModalityId == 7) {
            item.ODFrequenciesValue = '';
            item.OSFrequenciesValue = '';
            item.ODFindingValue = '';
            item.OSFindingValue = '';
        }
        else if (item.ModalityId == 8) {
            item.ODFixationLoss = '';
            item.ODFalsePositiveErrors = '';
            item.ODFalseNegitiveErrors = '';
            item.ODTDProbabilityPlot = '';
            item.ODPDProbabilityPlot = '';
            item.ODMeanDeviation = '';
            item.ODPatternStandardDeviation = '';
            item.ODVisualFieldIndex = '';
            item.ODGHTValue = '';
            item.ODHVFFindingValue = '';

            item.OSFixationLoss = '';
            item.OSFalsePositiveErrors = '';
            item.OSFalseNegitiveErrors = '';
            item.OSTDProbabilityPlot = '';
            item.OSPDProbabilityPlot = '';
            item.OSMeanDeviation = '';
            item.OSPatternStandardDeviation = '';
            item.OSVisualFieldIndex = '';
            item.OSGHTValue = '';
            item.OSHVFFindingValue = '';
        }
        else { }
    };

    $scope.$watch("selectedImageStudyObj", function (newVal, oldVal) {
        $scope.IsInterpretationDigHeaderOD = false;
        $scope.IsInterpretationDigHeaderOS = false;
        if ($scope.selectedImageStudyObj === undefined) { return; }
        if ($scope.selectedImageStudyObj.ODMacularFindingValue != '' || $scope.selectedImageStudyObj.ODMacularThickNess != '' || $scope.selectedImageStudyObj.ODONfindingValue != '' || $scope.selectedImageStudyObj.ODRHFLThickNess != '' || $scope.selectedImageStudyObj.ODIOLLensValue != '' || $scope.selectedImageStudyObj.ODIOLPower != '' ||
            $scope.selectedImageStudyObj.ODToricPower != '' || $scope.selectedImageStudyObj.ODIOLManufacturer != '' || $scope.selectedImageStudyObj.ODFrequenciesValue != '' || $scope.selectedImageStudyObj.ODFindingValue != '' || $scope.selectedImageStudyObj.ODK1Value != '' || $scope.selectedImageStudyObj.ODK2Value != '' || $scope.selectedImageStudyObj.ODCYLValue != '' ||
            $scope.selectedImageStudyObj.ODCornealThicknessValue != '' || $scope.selectedImageStudyObj.ODOCTMACFindings != '' || $scope.selectedImageStudyObj.ODLidsValue != '' || $scope.selectedImageStudyObj.ODConjunctivaValue != '' || $scope.selectedImageStudyObj.ODScleraValue != '' || $scope.selectedImageStudyObj.ODCorneaValue != '' ||
            $scope.selectedImageStudyObj.ODEndothelialCellCountValue != '' || $scope.selectedImageStudyObj.ODEndoCornealThicknessValue != '' || $scope.selectedImageStudyObj.ODEndothelialCellDensity != '' || $scope.selectedImageStudyObj.ODFixationLoss != '' || $scope.selectedImageStudyObj.ODFalsePositiveErrors != '' ||
            $scope.selectedImageStudyObj.ODFalseNegitiveErrors != '' || $scope.selectedImageStudyObj.ODTDProbabilityPlot != '' || $scope.selectedImageStudyObj.ODMeanDeviation != '' || $scope.selectedImageStudyObj.ODPatternStandardDeviation != '' || $scope.selectedImageStudyObj.ODVisualFieldIndex != '' || $scope.selectedImageStudyObj.ODGHTValue != '' ||
            $scope.selectedImageStudyObj.ODHVFFindingValue != '' || $scope.selectedImageStudyObj.ODFundusFindingValue != '' || $scope.selectedImageStudyObj.ODASOCTfindingValue != '' || $scope.selectedImageStudyObj.ODFAFindingValue != '' || $scope.selectedImageStudyObj.ODICGFindingValue != '') {
            $scope.IsInterpretationDigHeaderOD = true;
        }

        if ($scope.selectedImageStudyObj.OSMacularFindingValue != '' || $scope.selectedImageStudyObj.OSMacularThickNess != '' || $scope.selectedImageStudyObj.OSONfindingValue != '' || $scope.selectedImageStudyObj.OSRHFLThickNess != '' || $scope.selectedImageStudyObj.OSIOLLensValue != '' || $scope.selectedImageStudyObj.OSIOLPower != '' ||
            $scope.selectedImageStudyObj.OSToricPower != '' || $scope.selectedImageStudyObj.OSIOLManufacturer != '' || $scope.selectedImageStudyObj.OSFrequenciesValue != '' || $scope.selectedImageStudyObj.OSFindingValue != '' || $scope.selectedImageStudyObj.OSK1Value != '' || $scope.selectedImageStudyObj.OSK2Value != '' || $scope.selectedImageStudyObj.OSCYLValue != '' ||
            $scope.selectedImageStudyObj.OSCornealThicknessValue != '' || $scope.selectedImageStudyObj.OSOCTMACFindings != '' || $scope.selectedImageStudyObj.OSLidsValue != '' || $scope.selectedImageStudyObj.OSConjunctivaValue != '' || $scope.selectedImageStudyObj.OSScleraValue != '' || $scope.selectedImageStudyObj.OSCorneaValue != '' ||
            $scope.selectedImageStudyObj.OSEndothelialCellCountValue != '' || $scope.selectedImageStudyObj.OSEndoCornealThicknessValue != '' || $scope.selectedImageStudyObj.OSEndothelialCellDensity != '' || $scope.selectedImageStudyObj.OSFixationLoss != '' || $scope.selectedImageStudyObj.OSFalsePositiveErrors != '' ||
            $scope.selectedImageStudyObj.OSFalseNegitiveErrors != '' || $scope.selectedImageStudyObj.OSTDProbabilityPlot != '' || $scope.selectedImageStudyObj.OSMeanDeviation != '' || $scope.selectedImageStudyObj.OSPatternStandardDeviation != '' || $scope.selectedImageStudyObj.OSVisualFieldIndex != '' || $scope.selectedImageStudyObj.OSGHTValue != '' ||
            $scope.selectedImageStudyObj.OSHVFFindingValue != '' || $scope.selectedImageStudyObj.OSFundusFindingValue != '' || $scope.selectedImageStudyObj.OSASOCTfindingValue != '' || $scope.selectedImageStudyObj.OSFAFindingValue != '' || $scope.selectedImageStudyObj.OSICGFindingValue != '') {
            $scope.IsInterpretationDigHeaderOS = true;
        }
    }, true);

    $scope.getMasterFindingValues = function (val, Catid, FindingId, Organ) {
        $scope.SearchText = val || "";
        $scope.CategoryId = Catid || 0;
        $scope.FindingId = FindingId || 0;
        $scope.AnteriorINVDropdownList = [];
        $scope.PosteriorINVDropdownList = [];
        $scope.selectedImageStudyObj.SelectedEye = Organ || 1;

        var params = {
            "CategoryId": $scope.CategoryId || 4,
            "FindingId": $scope.FindingId || 0,
            "PageSize": 20,
            "PageNumber": 1,
            "SearchText": $scope.SearchText || "",

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
        "RemarksArray": [],

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
        "PosteriorDPSSelectedEye": 'OD',

    };


    $scope.navtoAddNew = function (Type, obj, catId, FindingId, organ, type) {
        // $scope.eObj = getEmailReqObj();

        if ($scope.cacheStorageItem.AnteriorDetails.length == 0 && $scope.cacheStorageItem.PosteriorDetails == 0) {
            var mObj = datapersistanceFactory.getItem("masterDataArrays");
            $scope.AllInvestigationData = angular.copy(mObj.masterFindings);
            $scope.sampleAnterior = $filter("filter")($scope.AllInvestigationData, { "CategoryId": 5 }, true);
            $scope.samplePosterior = $filter("filter")($scope.AllInvestigationData, { "CategoryId": 6 }, true);
            formAnteriorDetails($scope.sampleAnterior);
            formPosteriorDetails($scope.samplePosterior);
            function formAnteriorDetails(data) {
                $scope.tempAnteriorDetails = [];
                if (data !== undefined) {
                    if (data.length > 0) {
                        angular.forEach(data, function (item, index) {
                            var object = {
                                "PatientFindingAnteriorId": 0,
                                "InvestigationId": item.InvestigationId,
                                "CategoryId": item.CategoryId,
                                "CategoryDesc": "Anterior Segment",
                                "InvestigationDesc": item.Investigation,
                                "SubCategoryChildId": item.SubCategoryChildId,
                                "OrderBY": item.OrderBY,
                                "ActiveInd": "Y",
                                "RightEye": {
                                    "RemarksArray": [],
                                    "ImagesArray": [],
                                    "CdRatio": "",
                                    "Frequency": ""
                                },
                                "LeftEye": {
                                    "RemarksArray": [],
                                    "ImagesArray": [],
                                    //"DiagnosisArray": [],
                                    "CdRatio": "",
                                    "Frequency": ""
                                },
                                "BothEye": {
                                    "RemarksArray": [],
                                    "ImagesArray": [],
                                    "CdRatio": "",
                                    "Frequency": ""
                                },
                                "RightTemplateUrl": item.RightTemplateUrl || "",
                                "LeftTemplateUrl": item.LeftTemplateUrl || "",
                                "RightPwCanvas": "RightPwCanvas" + item.InvestigationId,
                                "LeftPwCanvas": "LeftPwCanvas" + item.InvestigationId,
                                "RightEyeUndoCount": 0,
                                "LeftEyeUndoCount": 0,
                                "FrequencyValuesInd": item.FrequencyValuesInd,
                                "CdRatioValuesInd": item.CdRatioValuesInd,
                                "RemarksInd": item.RemarksInd,
                                "LeftEyeEdit": item.LeftEyeEdit,
                                "IsSubChildCategoryChecked": false,
                                "IsNormal": false,
                                "IsSelected": false,
                                "SelectedRightEyeRemarksObj": "",
                                "SelectedLeftEyeRemarksObj": "",
                                "SelectedBothEyeRemarksObj": "",
                                "SelectedEye": "1",
                                //"showinPopupOver": true
                                "IsShowAnterior": "N"
                            };
                            $scope.tempAnteriorDetails.push(object);
                        });
                    }
                }
                $scope.cacheStorageItem.AnteriorDetails = $scope.tempAnteriorDetails;

            }

            function formPosteriorDetails(data) {
                $scope.tempPosteriorDetails = [];
                if (data !== undefined) {
                    if (data.length > 0) {
                        angular.forEach(data, function (item, index) {
                            var object = {
                                "PatientFindingAnteriorId": 0,
                                "InvestigationId": item.InvestigationId,
                                "CategoryId": item.CategoryId,
                                "CategoryDesc": "Posterior Segment",
                                "InvestigationDesc": item.Investigation,
                                "SubCategoryChildId": item.SubCategoryChildId,
                                "OrderBY": item.OrderBY,
                                "ActiveInd": "Y",
                                "RightEye": {
                                    "RemarksArray": [],
                                    "DiagnosisArray": [],
                                    "ImagesArray": [],
                                    "CdRatio": "",
                                    "Frequency": "",
                                    "Horizontal": "",
                                    "Vertical": "",
                                    "DPS": ""
                                },
                                "LeftEye": {
                                    "RemarksArray": [],
                                    "DiagnosisArray": [],
                                    "ImagesArray": [],
                                    "CdRatio": "",
                                    "Frequency": "",
                                    "Horizontal": "",
                                    "Vertical": "",
                                    "DPS": ""
                                },
                                "BothEye": {
                                    "RemarksArray": [],
                                    "DiagnosisArray": [],
                                    "ImagesArray": [],
                                    "CdRatio": "",
                                    "Frequency": "",
                                    "Horizontal": "",
                                    "Vertical": "",
                                    "DPS": ""
                                },
                                "RightTemplateUrl": item.RightTemplateUrl || "",
                                "LeftTemplateUrl": item.LeftTemplateUrl || "",
                                "RightPwCanvas": "RightPwCanvas" + item.InvestigationId,
                                "LeftPwCanvas": "LeftPwCanvas" + item.InvestigationId,
                                "RightEyeUndoCount": 0,
                                "LeftEyeUndoCount": 0,
                                "FrequencyValuesInd": item.FrequencyValuesInd,
                                "CdRatioValuesInd": item.CdRatioValuesInd,
                                "RemarksInd": item.RemarksInd,
                                "LeftEyeEdit": item.LeftEyeEdit,
                                "IsSubChildCategoryChecked": false,
                                "IsSelected": false,
                                "IsNormal": false,
                                "SelectedRightEyeRemarksObj": "",
                                "SelectedLeftEyeRemarksObj": "",
                                "SelectedEye": "1",
                                "SelectedBothEyeRemarksObj": "",
                                //"showinPopupOver": true
                                "IsShowPosterior": "N"
                            };
                            $scope.tempPosteriorDetails.push(object);
                        });
                    }
                }
                $scope.cacheStorageItem.PosteriorDetails = $scope.tempPosteriorDetails;

            }

        }

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
                "catId": function () { return catId },
                "FindingId": function () { return FindingId },
                "organ": function () { return organ },
                "type": function () { return type }

            },
            "keyboard": false,
            "controller": function ($scope, $uibModal, eHnoteMasterDataService, AnteriorDetails, PosteriorDetails, Anteriorobj, Posteriorobj, Type, FindingId, catId, $uibModalInstance) {
                $scope.AnteriorDetails = AnteriorDetails || [];
                $scope.PosteriorDetails = PosteriorDetails || [];
                $scope.newAnteriorObj = Anteriorobj || '';
                $scope.newPosteriorObj = Posteriorobj || '';
                $scope.Type = Type || "";
                $scope.obj = obj || "";
                $scope.organ = organ || "";
                $scope.type = type || "";
                $scope.catId = catId || 0;
                $scope.FindingId = FindingId || 0;
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

                if ($scope.Type == 'Posterior') {
                    $scope.AnteriorPosteriorObj.CategoryId = $scope.catId || 6
                    $scope.AnteriorPosteriorObj.InvestigationId = 0;
                    $scope.AnteriorPosteriorObj.type = $scope.Type;


                    $scope.AnteriorPosteriorObj.FindingValue = $scope.obj;
                    //$scope.AnteriorPosteriorObj.FindingValuesArray = $scope.PosteriorDetails;
                    $scope.AnteriorPosteriorObj.FindingValuesArray = $scope.PosteriorDetails.filter(function (item) { return item.InvestigationId !== 32 });
                    var TempArray = $filter("filter")($scope.AnteriorPosteriorObj.FindingValuesArray, { "InvestigationId": $scope.FindingId }, true) || [];
                    if (TempArray.length > 0) {
                        $scope.AnteriorPosteriorObj.InvestigationId = TempArray[0].InvestigationId;
                        $scope.AnteriorPosteriorObj.InvestigationDesc = TempArray[0].InvestigationDesc;

                    }
                }
                else {
                    $scope.AnteriorPosteriorObj.CategoryId = $scope.catId || 5
                    $scope.AnteriorPosteriorObj.InvestigationId = 0;
                    $scope.AnteriorPosteriorObj.type = $scope.Type;


                    $scope.AnteriorPosteriorObj.FindingValue = $scope.obj;
                    $scope.AnteriorPosteriorObj.FindingValuesArray = $scope.AnteriorDetails;
                    var TempArray = $filter("filter")($scope.AnteriorPosteriorObj.FindingValuesArray, { "InvestigationId": $scope.FindingId }, true) || [];
                    if (TempArray.length > 0) {
                        $scope.AnteriorPosteriorObj.InvestigationId = TempArray[0].InvestigationId;
                        $scope.AnteriorPosteriorObj.InvestigationDesc = TempArray[0].InvestigationDesc;

                    }
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
                    // $scope.closeuibpopup();
                }


                $scope.closeuibpopup = function () {
                    $uibModalInstance.dismiss("cancel");
                }
            }
        });
        $scope.AddNew.result.then(function (resp) {
            if (FindingId == 35) {
                $scope.changeFundusFinding($scope.selectedImageStudyObj, resp, organ)
            } else if (FindingId == 39) {
                if (type == 'FA') {
                    $scope.changeFAFinding($scope.selectedImageStudyObj, resp, organ)
                } else {
                    $scope.changeICGFinding($scope.selectedImageStudyObj, resp, organ)
                }
            }
            else if (FindingId == 33) {
                $scope.changeMacularFinding($scope.selectedImageStudyObj, resp, organ)
            }
            else if (FindingId == 2144) {
                $scope.changeONFinding($scope.selectedImageStudyObj, resp, organ)
            }
            else if (FindingId == 26) {
                if (organ == 'OD') {
                    $scope.selectedImageStudyObj.ODASOCTfindingValue = resp.FindingDescription;
                } else {
                    $scope.selectedImageStudyObj.OSASOCTfindingValue = resp.FindingDescription;
                }
                $scope.selectedImageStudyObj.OSCorneaShowAddNewBtn = false
                $scope.selectedImageStudyObj.ODCorneaShowAddNewBtn = false
            }
            else {

            }
        }, function () { });

    }

    $scope.Patientdetails = function () {
        let patientId = $scope.cacheStorageItem.PatientID || 0;
        eHnoteAuditServices.getPatientDetailsById(patientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
        function ongetPatientDetailsSuccess(data) {
            if (data !== undefined) {
                var patientitem = data;
                $scope.cacheStorageItem.PatientTagList = patientitem.Patient[0].PatientTagList;
                $scope.cacheStorageItem.Age = patientitem.Patient[0].Age;
                $scope.selectedPatientData = data;

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
        }
        function ongetPatientDetailsError(error) {
            console.log(error);
        }
    }
    $scope.Patientdetails();


    $scope.NavtoCreateNewOrderNew = function () {


        if ($scope.screenFrom === 'OP') {
            console.log(appointmentinfo.AppointmentStatusId + "_AppointmentStatusId__BookingTypeId_" + appointmentinfo.BookingTypeId)
            if (appointmentinfo.BookingTypeId == 2) {
                alertify.error("Patient in waiting! Confirm appointment first. ");
                return false;
            }
            if (appointmentinfo.AppointmentStatusId == 1 || appointmentinfo.AppointmentStatusId == null) {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>The patient isn't Checked In!<br> Do you want to Check In the patient? </h4>", function () {



                    var CurrentTime = $filter("date")(new Date(), "HH:mm:ss");

                    var params = {
                        "UserId": $scope.UserId,
                        "HospitalId": $scope.HospitalId,
                        "AppointmentId": appointmentinfo.AppointmentID,
                        "AppointmentTrackerDetailId": 0,
                        "RoleId": $scope.RoleId,
                        "VisitReason": "",
                        "AttenderName": "",
                        "DoctorId": null,
                        "DoctorRoleId": null,
                        "RoomTypeId": 1,
                        "RoomId": null,
                        "CurrentTime": CurrentTime,
                        "IsSendTo": "N",
                        "IsCheckedIn": "Y",
                        "IsCheckedOut": "N",
                        "IsReCheckIn": "N",
                        "IsReCheckOut": "N",
                        "AppointmentStatusId": 2,
                        "BookingStatusId": appointmentinfo.BookingStatusId || 1,
                        "VisitTypeId": appointmentinfo.VisitTypeId,
                        "HospitalEquipmentId": appointmentinfo.PatientTagList || []
                    }
                    if ($scope.RoleId === 1 || $scope.RoleId === 43 || $scope.RoleId === 16) {
                        params.RoomTypeId = 1;
                    }
                    else if ($scope.RoleId === 10) {
                        params.RoomTypeId = 2;
                    }
                    else if ($scope.RoleId === 18) {
                        params.RoomTypeId = 4;
                    }

                    eHnoteMainAppointmentService.AddUpdateAppointmentCheckInTrackerDetails(params).then(function (resp) {
                        if (resp.data.Status == "Success") {
                            alertify.success("Patient CheckIn Successfully");
                            continuetocreateOrder();

                        }
                    }, function (err) {
                        alertify.error("Getting Failed");
                    });

                }, function () {
                    r = "You pressed Cancel!";

                });
            } else {
                continuetocreateOrder();
            }
        } else {
            continuetocreateOrder();
        }


    };

    function continuetocreateOrder() {
        var oMode = "AddNew";
        var oConsultationId = $scope.cacheStorageItem.ConsultationID || 0; 

        var oAppointmentId = $scope.cacheStorageItem.AppointmentId || 0;
        $scope.emptyImageStudyObj = getnewImageStudyDetailsAddReqObj();
        $scope.selectedImageStudyObj = getnewImageStudyDetailsAddReqObj();
    


        var filterModalityArray = $filter("filter")($scope.MasterModalityArray, function (item, index) { return item.ModalityId !== 0 }) || [];



        $scope.selectionImageData.SelectedFiles = [];

        if ($scope.imageMainTab == 2) {
            angular.forEach($scope.ImagesTabObj.allPatientImagesArray, function (citem) {
                angular.forEach(citem.ModilityTypes, function (aitem) {
                    angular.forEach(aitem.PatientFiles, function (sitem) {
                        if (sitem.IsActive) {
                            var obj = sitem;
                            $scope.selectionImageData.SelectedFiles.push(obj);
                        }
                    });
                });
            });

        }



        if ($scope.selectionImageData.SelectedFiles.length > 0) {
            oMode = "AddImages";



            $scope.selectedImageStudyFiles.LeftEyeFiles = [];
            $scope.selectedImageStudyFiles.RightEyeFiles = [];
            $scope.selectedImageStudyFiles.BothEyeFiles = [];
            $scope.selectedImageStudyFiles.AllFiles = [];
            $scope.selectedImageStudyFiles.AllFiles = angular.copy($scope.selectionImageData.SelectedFiles) || [];
            angular.forEach($scope.selectedImageStudyFiles.AllFiles, function (sitem) {
                sitem.S3URL = sitem.S3URL || "";
                if (sitem.OrganId === 1) {

                    var obj = {
                        "big": sitem.S3URL,
                        "small": sitem.S3URL,
                        "OrganId": sitem.OrganId,
                        "DocumentId": sitem.DocumentId,
                        "FileTypeId": 5 || 0,
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



            var modalityIds = new Set($scope.selectionImageData.SelectedFiles.map(item => item.ModalityId));

            var ModalityId = modalityIds.size === 1 ? [...modalityIds][0] : 0;
            $scope.selectedImageStudyObj.ModalityId = ModalityId || 0;
            $scope.ModalityArray = $scope.selectionImageData.MasterModalityArray || [];
            var List = $filter("filter")($scope.ModalityArray, { "ModalityId": ModalityId }, true);
            if (List.length > 0) {
                $scope.selectedImageStudyObj.ModalityName = List[0].ModalityName;
                $scope.selectedImageStudyObj.ModalityName = $scope.addUpdatePatientOrderImageDetailsReq.ModalityName.replace(/\s+/g, '')
            }


            var Organids = new Set($scope.selectionImageData.SelectedFiles.map(item => item.OrganId));

            var Organid = Organids.size === 1 ? [...Organids][0] : 0;
            $scope.selectedImageStudyObj.OrganId = Organid;

            oConsultationId = 0;
            oAppointmentId = 0;
            $scope.AppointmentDate = null;
            //var ConsultationIds = new Set($scope.selectionImageData.SelectedFiles.map(item => item.ConsultationId));

            //oConsultationId = ConsultationIds.size === 1 ? [...ConsultationIds][0] : 0;

            //var AppointmentIds = new Set($scope.selectionImageData.SelectedFiles.map(item => item.AppointmentId));

            //oAppointmentId = AppointmentIds.size === 1 ? [...AppointmentIds][0] : 0;

            $scope.selectedImageStudyObj.AppointmentId = oAppointmentId || 0;
            $scope.selectedImageStudyObj.ConsultationId = oConsultationId || 0;
        }


        console.log(oAppointmentId + "__" + oConsultationId);
        var parentObj = {
            "Mode": oMode,
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "AppointmentId": oAppointmentId,
            "AppointmentDate": $scope.AppointmentDate || "",
            "ConsultationId": oConsultationId,
            "PatientId": $scope.PatientId,
            "PatientName": $scope.PatientName || "",
            "PatientOrderId": $scope.ConsultationPatientOrderId || 0,
            "selectedImageStudyObj": $scope.selectedImageStudyObj,
            "SelectedDiagnosisArray": $scope.SelectedDiagnosisArray,
            "InterpretationSummaryArray": $scope.InterpretationSummaryArray || [],
            "allUserList": $scope.allUserList || [],
            "MasterModalityArray": filterModalityArray || [],
            "selectedImageStudyFiles": $scope.selectedImageStudyFiles || [],
            "selectedPatientData": $scope.selectedPatientData || {},
            "IsFrom": $scope.screenFrom || ""

        }
        $scope.mInstanceAddC = $uibModal.open({
            "templateUrl": "templates/UsNewConsultation/uibpopup/OrderInterpretationpopup.html",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": "modal__ninetynine--",
            "resolve": {
                "ParentObj": function () { return parentObj; }
            },
            "controller": "UsOrderInterpretationPopup",
        });
        $scope.mInstanceAddC.result.then(function (resp) {
            console.log(resp);

            $scope.ImageObj.PatientImageInd = false;

            $scope.getPatientOrderDetailsList();

        }, function (cancel) {
        });
    }

    $scope.navtoupdateInterpretation = function () {
        $scope.emptyImageStudyObj = getnewImageStudyDetailsAddReqObj();

        console.log($scope.selectedImageStudyObj.ConsultationId + "__ConsultationId");
        var filterModalityArray = $filter("filter")($scope.MasterModalityArray, function (item, index) { return item.ModalityId !== 0 }) || [];


        var parentObj = {
            "Mode": "Edit",
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "AppointmentId": $scope.selectedImageStudyObj.AppointmentId || 0,
            "AppointmentDate": $scope.selectedImageStudyObj.AppointmentDate || "",
            "ConsultationId": $scope.selectedImageStudyObj.ConsultationId || 0,
            "PatientId": $scope.PatientId,
            "PatientName": $scope.PatientName || "",
            "PatientOrderId": $scope.selectedImageStudyObj.PatientOrderId || 0,
            "selectedImageStudyObj": $scope.selectedImageStudyObj,
            "SelectedDiagnosisArray": $scope.SelectedDiagnosisArray,
            "InterpretationSummaryArray": $scope.InterpretationSummaryArray || [],
            "allUserList": $scope.allUserList || [],
            "MasterModalityArray": filterModalityArray || [],
            "selectedImageStudyFiles": $scope.selectedImageStudyFiles || [],
            "selectedPatientData": $scope.selectedPatientData || {},
            "IsFrom": $scope.screenFrom || ""
        }


        $scope.mInstanceAddC = $uibModal.open({
            "templateUrl": "templates/UsNewConsultation/uibpopup/OrderInterpretationpopup.html",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": "modal__ninetynine--",
            "resolve": {
                "ParentObj": function () { return parentObj; }
            },
            "controller": "UsOrderInterpretationPopup",
        });
        $scope.mInstanceAddC.result.then(function (resp) {
            console.log(resp);

            $scope.ImageObj.PatientImageInd = false;

            $scope.getPatientOrderDetailsList();

        }, function (cancel) {
        });

    };


    $uibModalInstance.rendered.then(function () {



        var canvasInv = null;
        var ctxInv = null;
        var readerinv = null;
        var overlayInv = [];
        var curPosinv = { x: 0, y: 0 };
        var picPosinv = { x: 0, y: 0 };
        var canvasinvSize = null;
        var resizeinv = null;

        $scope.ODinvImgObj = getnewImgemptyObj();





        $scope.optionsInv = {
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
        $scope.resizeToinv = function (value) {
            if ((ctxInv.canvas == null) || (readerinv == null)) {
                return;
            }
            ctxInv.canvas.width = canvasinvSize.clientWidth;
            ctxInv.canvas.height = canvasinvSize.clientHeight;
            var optionsInv = $scope.optionsInv;
            var ratioHinv = ctxInv.canvas.height / readerinv.height;
            var ratioWinv = ctxInv.canvas.width / readerinv.width;
            if (!readerinv.isZoom) {
                ratioHinv *= $scope.optionsInv.zoom.value;
                ratioWinv *= $scope.optionsInv.zoom.value;
            }
            switch (value) {
                case 'width': $scope.optionsInv.zoom.value = ratioWinv; break;
                case 'height': $scope.optionsInv.zoom.value = ratioHinv; break;
                case 'auto': $scope.optionsInv.zoom.value = Math.min(ratioHinv, ratioWinv, 1); break;
                case 'page':
                default: $scope.optionsInv.zoom.value = Math.min(ratioHinv, ratioWinv);
            }
            $scope.$applyAsync(function () {
                $scope.optionsInv.zoom.value = Math.round($scope.optionsInv.zoom.value * 100) / 100;
                $scope.optionsInv.controls.fit = value;
                if (!readerinv.isZoom) {
                    if (readerinv.refresh != null) {
                        readerinv.refresh();
                    }
                    centerPicsins();
                } else {
                    centerPicsins();
                    applyTransforminv();
                }
            });
        };


        canvasInv = document.getElementById("Imgviewer");
        ctxInv = canvasInv.getContext('2d');
        $scope.optionsInv.ctx = ctxInv;
        canvasinvSize = canvasInv.parentNode;
        ctxInv.canvas.width = canvasinvSize.clientWidth;
        ctxInv.canvas.height = canvasinvSize.clientHeight;
        resizeinv = { height: canvasinvSize.clientHeight, width: canvasinvSize.clientWidth };

        $scope.fileInputinv = $scope.emptyblackImage;
        $scope.optionsInv.zoom.value = 1.0;
        $scope.optionsInv.rotate.value = 0;
        curPosinv = { x: 0, y: 0 };
        picPosinv = { x: 0, y: 0 };
        readerinv = formatReader.CreateReader("image/jpeg").create($scope.fileInputinv, $scope.optionsInv, onloadinv, $q, $timeout);
        $timeout(function () {
            $scope.resizeToinv('page');
        }, 1000);

        function onloadinv() {
            if (readerinv == null) {
                return;
            }

            if (readerinv.rendered) {
                centerPicsins();
                applyTransforminv();
            } else {
                $scope.resizeToinv($scope.optionsInv.controls.fit);
            }
        }



        var centerPicsins = function () {
            ctxInv.canvas.width = canvasinvSize.clientWidth;
            ctxInv.canvas.height = canvasinvSize.clientHeight;
            var centerXInv = ctxInv.canvas.width / 2;
            var centerYInv;
            var picPosXinv = 0;
            var picPosYinv = 0;

            if (readerinv.isImage) {
                centerYInv = ctxInv.canvas.height / 2;
                picPosXinv = centerXInv - (readerinv.width * $scope.optionsInv.zoom.value) / 2;
                picPosYinv = centerYInv - (readerinv.height * $scope.optionsInv.zoom.value) / 2;
            } else {
                picPosXinv = centerXInv - (readerinv.width * $scope.optionsInv.zoom.value) / 2;
            }

            curPosinv = { x: picPosXinv, y: picPosYinv };
            picPosinv = { x: picPosXinv, y: picPosYinv };

        };

        $scope.isDrawinginv = false;

        function applyTransforminv() {

            if (readerinv == null) {
                return;
            }
            if (!readerinv.rendered) {
                return;
            }



            var optionsInv = $scope.optionsInv;
            var canvasInv = ctxInv.canvas;
            var centerXInv = readerinv.width * optionsInv.zoom.value / 2;
            var centerYInv = readerinv.height * optionsInv.zoom.value / 2;
            // Clean before draw
            ctxInv.clearRect(0, 0, canvasInv.width, canvasInv.height);
            // Save context
            ctxInv.save();
            // move to mouse position
            ctxInv.translate((picPosinv.x + centerXInv), (picPosinv.y + centerYInv));
            // Rotate canvas
            ctxInv.rotate($scope.optionsInv.rotate.value * Math.PI / 180);
            // Go back
            ctxInv.translate(- centerXInv, - centerYInv);
            // Change scale
            if (readerinv.isZoom)
                ctxInv.scale($scope.optionsInv.zoom.value, $scope.optionsInv.zoom.value);
            if ((!$scope.optionsInv.controls.filmStrip) || ($scope.optionsInv.controls.totalPage == 1)) {
                if (readerinv.img != null) {
                    ctxInv.drawImage(readerinv.img, 0, 0, readerinv.width, readerinv.height);
                    ctxInv.beginPath();
                    ctxInv.rect(0, 0, readerinv.width, readerinv.height);
                    ctxInv.lineWidth = 0.2;
                    ctxInv.strokeStyle = "#000000";
                    ctxInv.stroke();
                }
                // Draw image at correct position with correct scale
                if (readerinv.data != null) {
                    ctxInv.putImageData(readerinv.data, picPosinv.x, picPosinv.y);
                    ctxInv.beginPath();
                    ctxInv.rect(0, 0, readerinv.width, readerinv.height);
                    ctxInv.lineWidth = 0.2;
                    ctxInv.strokeStyle = "#000000";
                    ctxInv.stroke();
                }
            } else {

                if (readerinv.images != null) {
                    angular.forEach(readerinv.images, function (image) {
                        ctxInv.drawImage(image, 0, 0, image.width, image.height);
                        ctxInv.beginPath();
                        ctxInv.rect(0, 0, image.width, image.height);
                        ctxInv.lineWidth = 0.2;
                        ctxInv.strokeStyle = "#000000";
                        ctxInv.stroke();
                        ctxInv.translate(0, image.height + 15);
                    });
                }
                // Draw image at correct position with correct scale
                if (readerinv.data != null) {
                    var offsetinvY = 0;
                    angular.forEach(readerinv.data, function (data) {
                        ctxInv.putImageData(data, picPosinv.x, picPosinv.y + offsetinvY);
                        ctxInv.beginPath();
                        ctxInv.rect(0, 0, readerinv.width, readerinv.height);
                        ctxInv.lineWidth = 0.2;
                        ctxInv.strokeStyle = "#000000";
                        ctxInv.stroke();
                        offsetinvY += readerinv.height + 15;
                        ctxInv.translate(0, offsetinvY);
                    });
                }
            }
            // Restore
            ctxInv.restore();

            // Draw overlays
            if (overlayInv.length > 0) {
                angular.forEach(overlayInv, function (item) {
                    ctxInv.save();
                    ctxInv.translate((picPosinv.x + centerXInv), (picPosinv.y + centerYInv));
                    // Rotate canvas
                    ctxInv.rotate($scope.optionsInv.rotate.value * Math.PI / 180);
                    // Go back
                    ctxInv.translate(- centerXInv, - centerYInv);
                    // Change scale
                    ctxInv.scale($scope.optionsInv.zoom.value, $scope.optionsInv.zoom.value);
                    // Start rect draw
                    ctxInv.beginPath();
                    ctxInv.rect((item.x), (item.y), item.w, item.h);
                    ctxInv.fillStyle = item.color;
                    ctxInv.globalAlpha = 0.4;
                    ctxInv.fill();
                    ctxInv.lineWidth = 1;
                    ctxInv.strokeStyle = item.color;
                    ctxInv.stroke();
                    ctxInv.restore();
                });
            }
        }

        $scope.PirticulardayImagesArray = [];

        $scope.navtoInvestigationPreview = function (mainobj) {           

            $scope.ODinvImgObj = getnewImgemptyObj();

            canvasInv = document.getElementById("Imgviewer");
            ctxInv = canvasInv.getContext('2d');
            bindInvWheel(); // canvasInv was just re-fetched - reattach wheel zoom
            $scope.optionsInv.ctx = ctxInv;
            canvasinvSize = canvasInv.parentNode;
            ctxInv.canvas.width = canvasinvSize.clientWidth;
            ctxInv.canvas.height = canvasinvSize.clientHeight;
            resizeinv = { height: canvasinvSize.clientHeight, width: canvasinvSize.clientWidth };

            $scope.fileInputinv = $scope.emptyblackImage;
            $scope.optionsInv.zoom.value = 1.0;
            $scope.optionsInv.rotate.value = 0;
            curPosinv = { x: 0, y: 0 };
            picPosinv = { x: 0, y: 0 };
            readerinv = formatReader.CreateReader("image/jpeg").create($scope.fileInputinv, $scope.optionsInv, onloadinv, $q, $timeout);
            //$timeout(function () {
            //    $scope.resizeToinv('page');
            //}, 1000);

            if ($scope.PirticulardayImagesArray.length > 0) {
                let lastImage = $scope.PirticulardayImagesArray[$scope.PirticulardayImagesArray.length - 1];
                $scope.clickonParticularinvImage(lastImage);
            }
        }

        $scope.getTrustedUrl = function (url) {

            var modifiedUrl = url;
            return $sce.trustAsResourceUrl(modifiedUrl);
        };

        $scope.clickonParticularinvImage = function (obj, index, typpe) {

            $scope.ODinvImgObj.Index = index;
            $scope.ODinvImgObj.S3URL = obj.small;
            $scope.ODinvImgObj.DocumentId = obj.DocumentId;
            $scope.ODinvImgObj.isDicomFile = obj.isDicomFile;


            $scope.ODinvImgObj.IsImage = false;
            $scope.ODinvImgObj.IsPdf = false;
            $scope.ODinvImgObj.IsDicom = false;
            $scope.ODinvImgObj.IsTiff = false;

            if (obj.FileType == "image/jpeg" || obj.FileType == "image/png" || obj.FileType == "image/jpg" || obj.FileType == "jpg" || obj.FileType == "png" || obj.FileType == "jpeg") {
                $scope.ODinvImgObj.IsImage = true;
            }
            else if (obj.FileType == "application/pdf" || obj.FileType == "application/Pdf" || obj.FileType == "pdf" || obj.FileType == "Pdf") {
                $scope.ODinvImgObj.IsPdf = true;
            }
            else if (obj.FileType == "image/tiff" || obj.FileType == "image/TIFF" || obj.FileType == "tiff" || obj.FileType == "tif") {
                $scope.ODinvImgObj.IsTiff = true;
            }
            else if (obj.FileType == "DCM" || obj.FileType == "dcm") {
                $scope.ODinvImgObj.IsDicom = true;
            }
            angular.forEach($scope.PirticulardayImagesArray, function (sitem) {
                sitem.isActive = false;
            });
            obj.isActive = true;
            if ($scope.ODinvImgObj.IsImage) {
                var oloadType = typpe || "";

                if ($scope.ODinvImgObj.isDicomFile) {

                    onDOMContentLoadedINV();
                    var array = [];
                    array.push($scope.ODinvImgObj.S3URL);
                    _app.loadURLs(array);

                }
                else {
                    $scope.fileInputinv = obj.small;
                    $scope.optionsInv.zoom.value = 1.0;
                    $scope.optionsInv.rotate.value = 0;
                    curPosinv = { x: 0, y: 0 };
                    picPosinv = { x: 0, y: 0 };
                    readerinv = formatReader.CreateReader("image/jpeg").create($scope.fileInputinv, $scope.optionsInv, onloadinv, $q, $timeout);
                    $timeout(function () {
                        $scope.resizeToinv('page');
                    }, 1000);
                }
            }
            else if ($scope.ODinvImgObj.IsPdf) {

                $scope.getTrustedUrl = function (url) {

                    var modifiedUrl = url + "#pagemode=none&zoom=52";
                    return $sce.trustAsResourceUrl(modifiedUrl);
                };
            }


            //$scope.checkSyncButton();


        }



        $scope.rotateInvImg = function (direction) {
            $scope.$applyAsync(function () {
                $scope.optionsInv.rotate.value += $scope.optionsInv.rotate.step * direction;
                if (($scope.optionsInv.rotate.value <= -360) || ($scope.optionsInv.rotate.value >= 360)) {
                    $scope.optionsInv.rotate.value = 0;
                }
                applyTransforminv();
            });
        };

        // Zoom function
        $scope.ZoomIninvClick = function (direction) {
            $scope.$applyAsync(function () {
                var oldWidthinv, newWidthinv = 0;
                var oldHeightinv, newHeightinv = 0;
                // Does readerOS support zoom ?
                // Compute correct width
                if (!readerinv.isZoom) {
                    oldWidthinv = readerinv.width;
                    oldHeightinv = readerinv.height;
                } else {
                    oldWidthinv = readerinv.width * $scope.optionsInv.zoom.value;
                    oldHeightinv = readerinv.height * $scope.optionsInv.zoom.value;
                }

                // Compute new zoom
                $scope.optionsInv.zoom.value += $scope.optionsInv.zoom.step * direction;
                // Round
                $scope.optionsInv.zoom.value = Math.round($scope.optionsInv.zoom.value * 100) / 100;
                if ($scope.optionsInv.zoom.value >= $scope.optionsInv.zoom.max) {
                    $scope.optionsInv.zoom.value = $scope.optionsInv.zoom.max;
                }
                if ($scope.optionsInv.zoom.value <= $scope.optionsInv.zoom.min) {
                    $scope.optionsInv.zoom.value = $scope.optionsInv.zoom.min;
                }
                // Refresh picture
                if (readerinv.refresh != null) {
                    readerinv.refresh();
                }


                // Compute new image size
                if (!readerinv.isZoom) {
                    newWidthinv = readerinv.width;
                    newHeightinv = readerinv.height;
                } else {
                    newWidthinv = readerinv.width * $scope.optionsInv.zoom.value;
                    newHeightinv = readerinv.height * $scope.optionsInv.zoom.value;
                }
                // new image position after zoom
                picPosinv.x = picPosinv.x - (newWidthinv - oldWidthinv) / 2;
                picPosinv.y = picPosinv.y - (newHeightinv - oldHeightinv) / 2;
            });
        };

        $scope.$watch('optionsInv.zoom.value', function () {
            if (!$scope.optionsInv.controls.disableZoom) {
                applyTransforminv();
            }
        });

        $scope.$watch('optionsInv.rotate.value', function () {
            if (!$scope.optionsInv.controls.disableRotate) {
                applyTransforminv();
            }
        });

        $scope.$watch('optionsInv.controls.fit', function (value) {
            if ($scope.PirticulardayImagesArray.length > 0) {
                $scope.resizeToinv(value);
            }

        });

        $scope.$watch('overlayInv', function (newarr, oldarr) {
            if (newarr === null || oldarr === null)
                return;
            overlayInv = [];
            angular.forEach(newarr, function (item) {
                overlayInv.push(item);
            });

            applyTransforminv();
        }, true);

        $scope.$watch(parentChangeIns, function () {
            if ($scope.PirticulardayImagesArray.length > 0) {
                resizeCanvasIns();
            }
        }, true);


        //$timeout(function () {
        //    $scope.resizeToinv('page');
        //}, 1000);
        function onMouseWheelMoveinInv($event) {
            var event = $event || $window.event; // old IE support
            // jQuery wraps the native event; deltaY only exists on the original.
            var native = event.originalEvent || event;
            // Normalise across legacy (wheelDelta / detail) and standard (deltaY) wheel events.
            var raw = native.wheelDelta;
            if (raw === undefined || raw === null) {
                if (native.deltaY !== undefined && native.deltaY !== null) {
                    raw = -native.deltaY;
                } else {
                    raw = -native.detail;
                }
            }
            var delta = Math.max(-1, Math.min(1, raw));
            if (delta === 0) { return; }
            if ($scope.optionsInv.controls.filmStrip) {
                picPosinv.y += 50 * delta;
                // Limit range
                if (picPosinv.y > 15) {
                    picPosinv.y = 15;
                }
                if (readerinv.images) {
                    if (picPosinv.y - readerinv.height * $scope.optionsInv.zoom.value < -(readerinv.height + 15) * readerinv.images.length * $scope.optionsInv.zoom.value) {
                        picPosinv.y = -(readerinv.height + 15) * readerinv.images.length + readerinv.height;
                    }
                } else {
                    if (picPosinv.y - readerinv.height * $scope.optionsInv.zoom.value < -readerinv.height * $scope.optionsInv.zoom.value) {
                        picPosinv.y = -readerinv.height * $scope.optionsInv.zoom.value;
                    }
                }
                //
                $scope.$applyAsync(function () {
                    applyTransforminv();
                });
            } else {
                if (delta > 0) {
                    $scope.ZoomIninvClick(1);
                } else {
                    $scope.ZoomIninvClick(-1);
                }
            }
            // for IE
            event.returnValue = false;
            // for Chrome and Firefox
            if (event.preventDefault) {
                event.preventDefault();
            }
        }

        // Rebindable so it survives canvasInv being re-fetched in navtoInvestigationPreview.
        function bindInvWheel() {
            // "wheel" is the standard event; the others are legacy fallbacks.
            var INV_WHEEL_EVENTS = "wheel DOMMouseScroll mousewheel onmousewheel";
            if (!canvasInv) { return; }
            var el = angular.element(canvasInv);
            if (el.off) { el.off(INV_WHEEL_EVENTS); }
            el.on(INV_WHEEL_EVENTS, function ($event) {
                // cross-browser wheel delta
                onMouseWheelMoveinInv($event);
            });
        }

        $scope.bindInvWheel = bindInvWheel;

        bindInvWheel();

        // Parent change function
        function parentChangeIns() {
            if ($scope.PirticulardayImagesArray.length > 0) {
                if (resizeinv.width != canvasInv.parentNode.clientWidth) {
                    resizeinv.width = canvasInv.parentNode.clientWidth;
                }

                if (resizeinv.height != canvasInv.parentNode.clientHeight) {
                    resizeinv.height = canvasInv.parentNode.clientHeight;
                }
                return resizeinv;
            }
        }

        // Resize canvas function
        function resizeCanvasIns() {
            $scope.$applyAsync(function () {
                var canvasinvSize = canvasInv.parentNode;
                ctxInv.canvas.width = canvasinvSize.clientWidth;
                ctxInv.canvas.height = canvasinvSize.clientHeight;
                applyTransforminv();
            });
        }


    });

    $scope.showOrderInvestigations = false;
$scope.ODtoolBar = false;
$scope.OStoolBar = false;
$scope.isFullView = false;

$scope.openCloseOrderInvestigationsOverlay = function () {
    $scope.showOrderInvestigations = !$scope.showOrderInvestigations;
};

$scope.viewToolBar = function (eye) {
    if (eye === 'od') {
        $scope.ODtoolBar = !$scope.ODtoolBar;
    } else if (eye === 'os') {
        $scope.OStoolBar = !$scope.OStoolBar;
    }
};


$scope.toggleFullViewImages = function () {
    $scope.isFullView = !$scope.isFullView;
};

/* ------------------------------------------------------------------
   Compare selection (Orders View + Investigation Files)
   Orders View files are flagged with IsChecked, Investigation Files
   with IsActive (kept as-is so the legacy check handlers still work).
   ------------------------------------------------------------------ */
$scope.compareCount = 0;

$scope.getCompareSelectedFiles = function () {
    var picked = [];

    angular.forEach($scope.PatientAllOrdersList, function (aitem) {
        angular.forEach(aitem.PatientFiles || [], function (sitem) {
            if (sitem.IsChecked) { picked.push(sitem); }
        });
    });

    angular.forEach($scope.ImagesTabObj.allPatientImagesArray, function (aitem) {
        angular.forEach(aitem.ModilityTypes || [], function (mitem) {
            angular.forEach(mitem.PatientFiles || [], function (sitem) {
                if (sitem.IsActive && picked.indexOf(sitem) === -1) { picked.push(sitem); }
            });
        });
    });

    return picked;
};

$scope.refreshCompareCount = function () {
    $scope.compareCount = $scope.getCompareSelectedFiles().length;
};

$scope.onCompareSelectionChange = function () {
    $scope.refreshCompareCount();
};

$scope.clearCompareSelection = function () {
    angular.forEach($scope.PatientAllOrdersList, function (aitem) {
        angular.forEach(aitem.PatientFiles || [], function (sitem) {
            sitem.IsChecked = false;
        });
    });

    angular.forEach($scope.ImagesTabObj.allPatientImagesArray, function (aitem) {
        aitem.IsCheckAll = false;
        angular.forEach(aitem.ModilityTypes || [], function (mitem) {
            angular.forEach(mitem.PatientFiles || [], function (sitem) {
                sitem.IsActive = false;
            });
        });
    });

    // checkEachImageFile maintains PirticulardayImagesArray (the left preview rail)
    // as files are ticked/unticked. Clearing the checkboxes directly bypasses that,
    // so empty the rail here too - otherwise re-ticking pushes duplicate thumbnails.
    $scope.PirticulardayImagesArray = [];
    $scope.navtoInvestigationPreview();

    $scope.refreshCompareCount();
};

/* ------------------------------------------------------------------
   Compare view - renders the checked files into a 4-up grid.
   Fewer than 4 selected leaves the remaining slots empty; more than 4
   keeps filling further rows, which scroll. Each tile carries its own
   zoom / rotate / flip state applied as a CSS transform, so tiles are
   independent of the OD/OS canvas machinery.
   ------------------------------------------------------------------ */
$scope.isCompareView = false;
$scope.compareTiles = [];

function buildCompareTile(file) {
    return {
        File: file,
        Url: (file && (file.small || file.S3URL)) || "",
        DocumentName: (file && file.DocumentName) || "",
        OrganName: (file && file.OrganName) || "",
        ModalityName: (file && file.ModalityName) || "",
        zoom: 1,
        rotate: 0,
        flipH: 1,
        flipV: 1,
        panX: 0,
        panY: 0
    };
}

$scope.openCompareView = function () {
    var picked = $scope.getCompareSelectedFiles();
    if (picked.length === 0) { return; }

    $scope.compareTiles = [];
    angular.forEach(picked, function (f) {
        $scope.compareTiles.push(buildCompareTile(f));
    });

    // Pad out to a full row of 4 so empty slots render as placeholders
    var remainder = $scope.compareTiles.length % 4;
    var pad = (remainder === 0) ? 0 : (4 - remainder);
    for (var i = 0; i < pad; i++) {
        $scope.compareTiles.push(null);
    }

    // Leave the Orders/Investigations panel open - it only closes when the
    // user closes it, so the selection stays visible alongside the comparison.
    $scope.isCompareView = true;
};

$scope.closeCompareView = function () {
    $scope.isCompareView = false;
    $scope.compareTiles = [];
};

$scope.compareTileStyle = function (tile) {
    if (!tile) { return {}; }
    // translate first so the drag tracks the pointer in screen space, rather
    // than being scaled/rotated along with the image.
    return {
        transform: 'translate(' + tile.panX + 'px,' + tile.panY + 'px) ' +
                   'scale(' + (tile.zoom * tile.flipH) + ',' + (tile.zoom * tile.flipV) + ') ' +
                   'rotate(' + tile.rotate + 'deg)'
    };
};

$scope.comparePan = function (tile, dx, dy) {
    if (!tile) { return; }
    tile.panX += dx;
    tile.panY += dy;
};

$scope.compareZoom = function (tile, direction) {
    if (!tile) { return; }
    var next = tile.zoom + (0.1 * direction);
    if (next < 0.1) { next = 0.1; }
    if (next > 6) { next = 6; }
    tile.zoom = next;
};

$scope.compareRotate = function (tile, direction) {
    if (!tile) { return; }
    tile.rotate += 90 * direction;
    if (tile.rotate <= -360 || tile.rotate >= 360) { tile.rotate = 0; }
};

$scope.compareFlip = function (tile, axis) {
    if (!tile) { return; }
    if (axis === 'v') { tile.flipV = tile.flipV * -1; }
    else { tile.flipH = tile.flipH * -1; }
};

$scope.compareReset = function (tile) {
    if (!tile) { return; }
    tile.zoom = 1;
    tile.rotate = 0;
    tile.flipH = 1;
    tile.flipV = 1;
    tile.panX = 0;
    tile.panY = 0;
};

function onEscKeyForFullView(event) {
    if (event.keyCode !== 27) { return; }
    // Compare sits on top of Full View, so it closes first
    if ($scope.isCompareView) {
        $scope.$apply(function () {
            $scope.closeCompareView();
        });
        return;
    }
    if ($scope.isFullView) {
        $scope.$apply(function () {
            $scope.isFullView = false;
        });
    }
}
angular.element($window).on('keydown', onEscKeyForFullView);

$scope.$on('$destroy', function () {
    angular.element($window).off('keydown', onEscKeyForFullView);
});
}]);

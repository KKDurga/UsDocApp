
eHnoteWebApp.controller('EhnoteImageManagementParentCtrl', ['$scope', '$rootScope', '$filter', 'eHnoteProcedureDataService', 'eHnoteMasterDataService', 'datacookieFactory', 'eHnoteCacheStorageService', 'eHnoteValidateUsersDataService', 'eHnotePatientDataService', '$location', 'alertify', 'eHnoteLoginStatusService', 'eHnotePrintService', 'eHnoteMainAppointmentService', '$window', 'eHnoteDiagnosisDataServices', "Lightbox", "eHnoteSettingsDataService", "textAngularManager", "taRegisterTool", "$timeout", "$uibModal", "localStorageFactory", "eHnoteUserAppointmentDataService", function ($scope, $rootScope, $filter, eHnoteProcedureDataService, eHnoteMasterDataService, datacookieFactory, eHnoteCacheStorageService, eHnoteValidateUsersDataService, eHnotePatientDataService, $location, alertify, eHnoteLoginStatusService, eHnotePrintService, eHnoteMainAppointmentService, $window, eHnoteDiagnosisDataServices, Lightbox, eHnoteSettingsDataService, textAngularManager, taRegisterTool, $timeout, $uibModal, localStorageFactory, eHnoteUserAppointmentDataService) {



   

  

    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();

    var docid = doctorinfo.doctorid;
    $scope.ConsentSettingsDataArray = [];
    $scope.addDoctorConsentForm = [];
    $scope.doctorConsentFormList = [];
    $scope.printConsentArray = [];
    $scope.consentFormArray = [];
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
        $scope.hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    }

    console.log($scope.doctorinfo);




    // $scope.AllDoctorPList = $scope.Main.clinicDoctorList || [];

    console.log(appointmentinfo.AppointmentID);
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    $scope.cacheStorageItem.appointmentid = $scope.cacheStorageItem.appointmentid || 0;

    console.log($scope.cacheStorageItem.appointmentid);

    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.mainImages = {
        "RightEyeFiles": [
            {
                "DocumentID": 9566,
                "TreatmentPlanId": 17952,
                "ConsultationId": 426874,
                "DocURL": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_45075_0.jpg",
                "small": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_45075_0.jpg",
                "big": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_45075_0.jpg",
                "DocName": "Sumanthk_P443766_2023_02_02_12_00_30_45075_0.jpg",
                "FileName": "Sumanthk_P443766_2023_02_02_12_00_30_45075_0.jpg",
                "FileExt": "image/jpeg",
                "Remarks": "",
                "FileTypeId": 1,
                "OrgConsentFormId": 0,
                "SignedDate": "2023-02-02",
                "ProcedureId": null,
                "AppointmentId": 1219855,
                "IsPartiallyUploaded": false,
                "SubmitInd": false,
                "LabTestId": null,
                "PatientDisplayId": "PRD0102713"
            },
            {
                "DocumentID": 9567,
                "TreatmentPlanId": 17952,
                "ConsultationId": 426874,
                "DocURL": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_49762_1.jpg",
                "small": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_49762_1.jpg",
                "big": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_49762_1.jpg",
                "DocName": "Sumanthk_P443766_2023_02_02_12_00_30_49762_1.jpg",
                "FileName": "Sumanthk_P443766_2023_02_02_12_00_30_49762_1.jpg",
                "FileExt": "image/jpeg",
                "Remarks": "",
                "FileTypeId": 1,
                "OrgConsentFormId": 0,
                "SignedDate": "2023-02-02",
                "ProcedureId": null,
                "AppointmentId": 1219855,
                "IsPartiallyUploaded": false,
                "SubmitInd": false,
                "LabTestId": null,
                "PatientDisplayId": "PRD0102713"
            },
            {
                "DocumentID": 9568,
                "TreatmentPlanId": 17952,
                "ConsultationId": 426874,
                "DocURL": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_51322_2.jpg",
                "small": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_51322_2.jpg",
                "big": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_51322_2.jpg",
                "DocName": "Sumanthk_P443766_2023_02_02_12_00_30_51322_2.jpg",
                "FileName": "Sumanthk_P443766_2023_02_02_12_00_30_51322_2.jpg",
                "FileExt": "image/jpeg",
                "Remarks": "",
                "FileTypeId": 1,
                "OrgConsentFormId": 0,
                "SignedDate": "2023-02-02",
                "ProcedureId": null,
                "AppointmentId": 1219855,
                "IsPartiallyUploaded": false,
                "SubmitInd": false,
                "LabTestId": null,
                "PatientDisplayId": "PRD0102713"
            },
            {
                "DocumentID": 9569,
                "TreatmentPlanId": 17952,
                "ConsultationId": 426874,
                "DocURL": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_52884_3.jpg",
                "small": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_52884_3.jpg",
                "big": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_52884_3.jpg",
                "DocName": "Sumanthk_P443766_2023_02_02_12_00_30_52884_3.jpg",
                "FileName": "Sumanthk_P443766_2023_02_02_12_00_30_52884_3.jpg",
                "FileExt": "image/jpeg",
                "Remarks": "",
                "FileTypeId": 1,
                "OrgConsentFormId": 0,
                "SignedDate": "2023-02-02",
                "ProcedureId": null,
                "AppointmentId": 1219855,
                "IsPartiallyUploaded": false,
                "SubmitInd": false,
                "LabTestId": null,
                "PatientDisplayId": "PRD0102713"
            },
            {
                "DocumentID": 9570,
                "TreatmentPlanId": 17952,
                "ConsultationId": 426874,
                "DocURL": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_54450_4.jpg",
                "small": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_54450_4.jpg",
                "big": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_54450_4.jpg",
                "DocName": "Sumanthk_P443766_2023_02_02_12_00_30_54450_4.jpg",
                "FileName": "Sumanthk_P443766_2023_02_02_12_00_30_54450_4.jpg",
                "FileExt": "image/jpeg",
                "Remarks": "",
                "FileTypeId": 1,
                "OrgConsentFormId": 0,
                "SignedDate": "2023-02-02",
                "ProcedureId": null,
                "AppointmentId": 1219855,
                "IsPartiallyUploaded": false,
                "SubmitInd": false,
                "LabTestId": null,
                "PatientDisplayId": "PRD0102713"
            }
        ],
        "LeftEyeFiles": [
            {
                "DocumentID": 9571,
                "TreatmentPlanId": 17952,
                "ConsultationId": 426874,
                "DocURL": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_54450_5.jpg",
                "big": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_54450_5.jpg",
                "small": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_54450_5.jpg",
                "DocName": "Sumanthk_P443766_2023_02_02_12_00_30_54450_5.jpg",
                "FileName": "Sumanthk_P443766_2023_02_02_12_00_30_54450_5.jpg",
                "FileExt": "image/jpeg",
                "Remarks": "",
                "FileTypeId": 1,
                "OrgConsentFormId": 0,
                "SignedDate": "2023-02-02",
                "ProcedureId": null,
                "AppointmentId": 1219855,
                "IsPartiallyUploaded": false,
                "SubmitInd": false,
                "LabTestId": null,
                "PatientDisplayId": "PRD0102713"
            },
            {
                "DocumentID": 9572,
                "TreatmentPlanId": 17952,
                "ConsultationId": 426874,
                "DocURL": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_56010_6.jpg",
                "big": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_56010_6.jpg",
                "small": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_56010_6.jpg",
                "DocName": "Sumanthk_P443766_2023_02_02_12_00_30_56010_6.jpg",
                "FileName": "Sumanthk_P443766_2023_02_02_12_00_30_56010_6.jpg",
                "FileExt": "image/jpeg",
                "Remarks": "",
                "FileTypeId": 1,
                "OrgConsentFormId": 0,
                "SignedDate": "2023-02-02",
                "ProcedureId": null,
                "AppointmentId": 1219855,
                "IsPartiallyUploaded": false,
                "SubmitInd": false,
                "LabTestId": null,
                "PatientDisplayId": "PRD0102713"
            },
            {
                "DocumentID": 9573,
                "TreatmentPlanId": 17952,
                "ConsultationId": 426874,
                "DocURL": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_57572_7.jpg",
                "big": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_57572_7.jpg",
                "small": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_57572_7.jpg",
                "DocName": "Sumanthk_P443766_2023_02_02_12_00_30_57572_7.jpg",
                "FileName": "Sumanthk_P443766_2023_02_02_12_00_30_57572_7.jpg",
                "FileExt": "image/jpeg",
                "Remarks": "",
                "FileTypeId": 1,
                "OrgConsentFormId": 0,
                "SignedDate": "2023-02-02",
                "ProcedureId": null,
                "AppointmentId": 1219855,
                "IsPartiallyUploaded": false,
                "SubmitInd": false,
                "LabTestId": null,
                "PatientDisplayId": "PRD0102713"
            },
            {
                "DocumentID": 9574,
                "TreatmentPlanId": 17952,
                "ConsultationId": 426874,
                "DocURL": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_57572_8.jpg",
                "big": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_57572_8.jpg",
                "small": "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/FileUploads/Sumanthk_P443766_2023_02_02_12_00_30_57572_8.jpg",
                "DocName": "Sumanthk_P443766_2023_02_02_12_00_30_57572_8.jpg",
                "FileName": "Sumanthk_P443766_2023_02_02_12_00_30_57572_8.jpg",
                "FileExt": "image/jpeg",
                "Remarks": "",
                "FileTypeId": 1,
                "OrgConsentFormId": 0,
                "SignedDate": "2023-02-02",
                "ProcedureId": null,
                "AppointmentId": 1219855,
                "IsPartiallyUploaded": false,
                "SubmitInd": false,
                "LabTestId": null,
                "PatientDisplayId": "PRD0102713"
            }
        ]
    };

    $scope.PatientId = appointmentinfo.PatientID;
    $scope.PatientName = appointmentinfo.PatientName || "";
    $scope.AppointmentDate = appointmentinfo.ConsultationDt || $filter("date")(new Date(), "yyyy-MM-dd");

    $scope.AppointmentId = appointmentinfo.AppointmentID ? appointmentinfo.AppointmentID : $scope.cacheStorageItem.appointmentid;

    $scope.imageMainTab = 1;

    $scope.navtoMainImageTab = function (tabno) {
        $scope.imageMainTab = tabno;


        if ($scope.imageMainTab === 2) {
            $scope.getPatientAppointmentInvestigationFiles();
        }

        if ($scope.imageMainTab === 1) {
            $scope.getPatientImageStudyList();
        }
    };



    $scope.allPatientImagesArray = [];
    $scope.getPatientAppointmentInvestigationFiles = function () {



        var params = {
            "PatientId": $scope.PatientId
        };


        eHnotePatientDataService.getPatientInvestigationApptFiles(params).then(function (resp) {

            console.log(resp);
            if (resp.data.rows.length > 0) {
                $scope.allPatientImagesArray = resp.data.rows || [];

                angular.forEach($scope.allPatientImagesArray, function (citem) {
                    citem.IsActive = false;
                    angular.forEach(citem.PatientFiles, function (sitem) {
                        sitem.IsActive = false;
                    });
                });
            } else {
                $scope.allPatientImagesArray = [];
            }


        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
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
            "DoctorId": "",
            "TechnicianId": "",
            "AppointmentId": $scope.AppointmentId,
            "PatientId": $scope.PatientId,
            "DoctorNotes": "",
            "TechnicianNotes": "",
            "DeleteInd": "N",
            "StudyImagesArray": [
                {
                    "PatientImageStudyDetailId": 0,
                    "S3URL": "",
                    "OrganId": 1,
                    "DeleteInd": "N"
                },
                {
                    "PatientImageStudyDetailId": 0,
                    "S3URL": "",
                    "OrganId": 2,
                    "DeleteInd": "N"
                }
            ],
            "StudyDiagnosisArray": [
                {
                    "PatientImageStudyDiagnosisId": 0,
                    "DiagnosisId": 0,
                    "OrganizationDiagnosisId": 0,
                    "DeleteInd": "N"
                }
            ]
        }

        return objj;
    }

    $scope.addupdateImgStudyReqObj = getaddnewImageStudyObj();

    $scope.checkAllImagesOfAppointment = function (mainobj) {
        console.log(mainobj.IsCheckAll)
        if (mainobj.IsCheckAll) {
            angular.forEach(mainobj.PatientFiles, function (sitem) {
                sitem.IsActive = true;
            });
        } else {
            angular.forEach(mainobj.PatientFiles, function (sitem) {
                sitem.IsActive = false;
            });
        }
    }


    $scope.studyViewGetObj = {
        "ModalityId": 0,
        "imageStudyListArray":[]
    };
    $scope.MasterModalityArray = [
        {
            "Id": 0,
            "Name": "All"
        },
        {
            "Id": 1,
            "Name": "Corneal Topo"
        },
        {
            "Id": 2,
            "Name": "ECC"
        },
        {
            "Id": 3,
            "Name": "External Camera"
        },
        {
            "Id": 4,
            "Name": "IOL"
        },
        {
            "Id": 5,
            "Name": "OCT/HRT"
        },
        {
            "Id": 6,
            "Name": "Opthalmic Photography"
        },
        {
            "Id": 7,
            "Name": "UltraSound"
        },
        {
            "Id": 8,
            "Name": "Visual Field"
        },
        {
            "Id": 9,
            "Name": "Other"
        }
    ];


    $scope.imageStudyListArray = [];

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


    $scope.getPatientImageStudyList();



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
            "UserId": $scope.UserId,
            "PatientImageStudyId": 0,
            "InvestigationId": 1,
            "ImageQuality": "",
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
            "TechnicianId": "",
            "ProviderRemarks": "",
            "TechnicianRemarks": "",
            "SelectedDiagObj": "",
            "IOLLensValue": "",
            "IOLPowerValue": "",
            "FrequencyValue": "",
            "FindingValue": "",
            "K1Value": "",
            "K2Value": "",
            "CYLValue": "",
            "LidsValue": "",
            "ConjunctivaValue": "",
            "ScleraValue": "",
            "CorneaValue": "",
            "EndothelialCellCountValue": "",
            "CornealThicknessValue": "",
            "EndothelialCellDensity": "",
            "DiagnosisListArray": []
        };

        return obj;
    }

    $scope.selectedImageStudyObj = getnewImageStudyDetailsAddReqObj();

    $scope.selectedImageStudyFiles = {
        "RightEyeFiles": [],
        "LeftEyeFiles": [],
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

    $scope.changeModalityForStudies = function () {
        $scope.selectedImageStudyObj = getnewImageStudyDetailsAddReqObj();

        $scope.selectedImageStudyFiles.LeftEyeFiles = [];
        $scope.selectedImageStudyFiles.RightEyeFiles = [];
        $scope.selectedImageStudyFiles.AllFiles = [];
    };
    $scope.getPatientImageStudyDetailsById = function (item) {


        $scope.selectedImageStudyObj = getnewImageStudyDetailsAddReqObj();
        var params = {
            "PatientImageStudyId": item.PatientImageStudyId
        }

        $scope.selectedImageStudyObj.PatientImageStudyId = item.PatientImageStudyId;
        $scope.selectedImageStudyObj.InvestigationId = item.InvestigationId;


        var filtarray = $filter("filter")($scope.InvestigationMainsArray, { "InvestigationId": item.InvestigationId }, true);
        if (filtarray.length > 0) {
            $scope.selectedImageStudyObj.InvestigationName = filtarray[0].InvestigationName;
        }




        eHnotePatientDataService.GetPatientImageStudyDetailsById(params).then(function (resp) {


            $scope.selectedImageStudyFiles.LeftEyeFiles = [];
            $scope.selectedImageStudyFiles.RightEyeFiles = [];
            $scope.selectedImageStudyFiles.AllFiles = [];

            if (resp.data.rows.length > 0) {
                $scope.selectedImageStudyFiles.AllFiles = resp.data.rows[0].StudyDetailsArray || [];

                angular.forEach($scope.selectedImageStudyFiles.AllFiles, function (sitem) {
                    if (sitem.OrganId === 1) {

                        var obj = {
                            "big": sitem.S3URL,
                            "small": sitem.S3URL,
                            "OrganId": sitem.OrganId
                        }

                        $scope.selectedImageStudyFiles.RightEyeFiles.push(obj);

                    }
                    if (sitem.OrganId === 2) {

                        var obj = {
                            "big": sitem.S3URL,
                            "small": sitem.S3URL,
                            "OrganId": sitem.OrganId
                        }

                        $scope.selectedImageStudyFiles.LeftEyeFiles.push(obj);

                    }
                });

                //if ($scope.selectedImageStudyFiles.LeftEyeFiles.length > 0) {

                //}

                //if ($scope.selectedImageStudyFiles.RightEyeFiles.length > 0) {

                //}
                $scope.showODimageViewer();
                $scope.showOSimageViewer();


            } else {
                $scope.selectedImageStudyFiles = {
                    "RightEyeFiles": [],
                    "LeftEyeFiles": [],
                    "AllFiles": []
                };
            }



        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
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

    $scope.openImageUploadForStudyPopup = function () {



        eHnotePatientDataService.GetPatientBillingAppointments($scope.PatientId).then(function (resp) {
            if (resp.data.Status === 1) {
                if (resp.data.data.length > 0) {

                
                    $scope.previousAppointmentsList = resp.data.data;
                    $scope.previousAppointmentsList = $scope.previousAppointmentsList || [];

                    angular.forEach($scope.previousAppointmentsList, function (aitem) {
                        aitem.NewAppointmentDate = $filter("date")(aitem.AppointmentDate, "MM-dd-yyyy");
                    });

                    if ($scope.previousAppointmentsList.length > 0) {
                        var Obj = {
                            "HospitalId": $scope.HospitalId,
                            "PatientId": $scope.PatientId,
                            "UserId": $scope.UserId,
                            "AppointmentId": $scope.AppointmentId,
                            "AppointmentDate": $scope.AppointmentDate,
                            "PatientName": $scope.PatientName,
                            "AppointmentList": $scope.previousAppointmentsList
                        }

                        var modalInstance = $uibModal.open({
                            "templateUrl": "templates/uibpopups/UploadImagesForCaseStudy.html",
                            "backdrop": "static",
                            "scope": $scope,
                            "keyboard": false,
                            "size": "lg",
                            "resolve": {
                                "ParentObject": Obj
                            },
                            "controller": function ($scope, $uibModalInstance, eHnoteDiagnosisDataServices, eHnoteSettingsDataService, ParentObject, alertify) {

                                console.log(ParentObject);
                                $scope.selectedPatientObj = ParentObject;



                                $scope.previousAppointmentsList = $scope.selectedPatientObj.AppointmentList;


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
                                    "PatientFiles": []
                                };


                                $scope.closeImagePopup = function () {
                                    $uibModalInstance.dismiss("cancel");
                                };


                                $scope.SaveImagePopup = function () {



                                    var obj = {
                                        "UserId": $scope.imguploadReqObj.UserId,
                                        "HospitalId": $scope.imguploadReqObj.HospitalId,
                                        "AppointmentId": $scope.imguploadReqObj.AppointmentId,
                                        "AppointmentDate": $scope.AppointmentDate,
                                        "PatientId": $scope.imguploadReqObj.PatientId,
                                        "PatientName": $scope.imguploadReqObj.PatientName,
                                        "ProcedureId": $scope.imguploadReqObj.ProcedureId,
                                        "OrganizationProcedureId": $scope.imguploadReqObj.OrganizationProcedureId,
                                        "CPTCode": $scope.imguploadReqObj.CPTCode,
                                        "ProcedureName": $scope.imguploadReqObj.ProcedureName,
                                        "ProcedureCode": $scope.imguploadReqObj.ProcedureCode,
                                        "OrganId": parseFloat($scope.imguploadReqObj.OrganId) || 0,
                                        "StatusId": 1,
                                        "PatientFiles": $scope.imguploadReqObj.PatientFiles
                                    }


                                    if ($scope.tempODImagesArray.length > 0) {
                                        angular.forEach($scope.tempODImagesArray, function (item) {
                                            obj.PatientFiles.push(item);
                                        });
                                    };

                                    if ($scope.tempOSImagesArray.length > 0) {
                                        angular.forEach($scope.tempOSImagesArray, function (item) {
                                            obj.PatientFiles.push(item);
                                        });
                                    };

                                    eHnotePatientDataService.SavePatientInvestigationApptFiles(obj, OnAddPatientSuccess, OnAddPatientError);
                                    function OnAddPatientSuccess(data) {
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

                                //$scope.getBase64 = function (file) {
                                //    var reader = new FileReader();
                                //    reader.readAsDataURL(file);
                                //    reader.onload = function () {
                                //        //  console.log("base64" + reader.result);
                                //        $scope.Sign.SignatureOfUser = reader.result;
                                //    };
                                //    reader.onerror = function (error) {
                                //        console.log('Error: ', error);
                                //    };
                                //}

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
                                                    "DocumentId": 0,
                                                    "file": item
                                                };

                                                $scope.tempOSImagesArray.push(obj);

                                            });
                                        }
                                    }



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

                                    var params = {
                                        "OrganizationId": $scope.HospitalId,
                                        "ProcedureId": 0,
                                        "CPTCODE": "",  // cptcode tblorganizationprocedure
                                        "SearchText": text || "", // searchtext
                                        "TypeOfServiceId": 0,
                                        "PageNumber": 1,
                                        "PageSize": 10,
                                        "Status": 1,
                                        "IsFrequent": "N"
                                    };
                                    if (params.SearchText == '') {
                                        params.IsFrequent = 'Y';
                                    }

                                    return eHnoteSettingsDataService.GetOrganizationProcedures(params).then(function (resp) {
                                        if (resp.data.rows !== undefined) {
                                            return resp.data.rows.map(function (item) {
                                                return item;
                                            });
                                        }
                                    });
                                };


                                $scope.onInvProcedureChange = function () {
                                    $scope.imguploadReqObj.OrganizationProcedureId = "";
                                    $scope.imguploadReqObj.ProcedureId = "";
                                    $scope.imguploadReqObj.ProcedureCode = "";
                                    $scope.imguploadReqObj.ProcedureName = "";
                                    $scope.imguploadReqObj.CPTCode = "";
                                }

                                $scope.onSelectProcedureInv = function (obj) {

                                    console.log(obj);

                                    $scope.imguploadReqObj.OrganizationProcedureId = obj.OrganizationProcedureId;
                                    $scope.imguploadReqObj.ProcedureId = obj.ProcedureId;
                                    $scope.imguploadReqObj.ProcedureCode = obj.ProcedureCode;
                                    $scope.imguploadReqObj.ProcedureName = obj.ProcedureName;
                                    $scope.imguploadReqObj.CPTCode = obj.CPTCode;
                                };
                            }
                        });
                        modalInstance.result.then(function (result) {
                            console.log(result);
                            $scope.navtoMainImageTab(2);

                        }, function (cancel) {
                        });
                    }
                    else {
                        alertify.error("No Appointments For the Patient To Image Study");
                        return false;
                    }

                }
            }
        });




        //eHnoteDiagnosisDataServices.GetPatientFollowupAppointments($scope.PatientId, $scope.SpecializationId).then(function (resp) {

        //    console.log(resp);

        //    if (resp.data !== undefined) {
        //        if (resp.data.length > 0) {

        //            $scope.previousAppointmentsList = resp.data;
        //            $scope.previousAppointmentsList = $scope.previousAppointmentsList || [];

        //            if ($scope.previousAppointmentsList.length > 0) {
        //                var Obj = {
        //                    "HospitalId": $scope.HospitalId,
        //                    "PatientId": $scope.PatientId,
        //                    "UserId": $scope.UserId,
        //                    "AppointmentId": $scope.AppointmentId,
        //                    "AppointmentDate": $scope.AppointmentDate,
        //                    "PatientName": $scope.PatientName,
        //                    "AppointmentList": $scope.previousAppointmentsList
        //                }

        //                var modalInstance = $uibModal.open({
        //                    "templateUrl": "templates/uibpopups/UploadImagesForCaseStudy.html",
        //                    "backdrop": "static",
        //                    "scope": $scope,
        //                    "keyboard": false,
        //                    "size": "lg",
        //                    "resolve": {
        //                        "ParentObject": Obj
        //                    },
        //                    "controller": function ($scope, $uibModalInstance, eHnoteDiagnosisDataServices, eHnoteSettingsDataService, ParentObject, alertify) {

        //                        console.log(ParentObject);
        //                        $scope.selectedPatientObj = ParentObject;



        //                        $scope.previousAppointmentsList = $scope.selectedPatientObj.AppointmentList;


        //                        $scope.imguploadReqObj = {
        //                            "UserId": $scope.selectedPatientObj.UserId,
        //                            "HospitalId": $scope.selectedPatientObj.HospitalId,
        //                            "AppointmentId": $scope.selectedPatientObj.AppointmentId,
        //                            "AppointmentDate": $scope.AppointmentDate,
        //                            "PatientId": $scope.selectedPatientObj.PatientId,
        //                            "PatientName": $scope.selectedPatientObj.PatientName,
        //                            "ProcedureId": "",
        //                            "OrganizationProcedureId": "",
        //                            "ProcedureName": "",
        //                            "ProcedureCode": "",
        //                            "CPTCode": "",
        //                            "ProcedureObj": "",
        //                            "OrganId": "",
        //                            "PatientFiles": []
        //                        };


        //                        $scope.closeImagePopup = function () {
        //                            $uibModalInstance.dismiss("cancel");
        //                        };


        //                        $scope.SaveImagePopup = function () {



        //                            var obj = {
        //                                "UserId": $scope.imguploadReqObj.UserId,
        //                                "HospitalId": $scope.imguploadReqObj.HospitalId,
        //                                "AppointmentId": $scope.imguploadReqObj.AppointmentId,
        //                                "AppointmentDate": $scope.AppointmentDate,
        //                                "PatientId": $scope.imguploadReqObj.PatientId,
        //                                "PatientName": $scope.imguploadReqObj.PatientName,
        //                                "ProcedureId": $scope.imguploadReqObj.ProcedureId,
        //                                "OrganizationProcedureId": $scope.imguploadReqObj.OrganizationProcedureId,
        //                                "CPTCode": $scope.imguploadReqObj.CPTCode,
        //                                "ProcedureName": $scope.imguploadReqObj.ProcedureName,
        //                                "ProcedureCode": $scope.imguploadReqObj.ProcedureCode,
        //                                "OrganId": parseFloat($scope.imguploadReqObj.OrganId) || 0,
        //                                "StatusId": 1,
        //                                "PatientFiles": $scope.imguploadReqObj.PatientFiles
        //                            }


        //                            if ($scope.tempODImagesArray.length > 0) {
        //                                angular.forEach($scope.tempODImagesArray, function (item) {
        //                                    obj.PatientFiles.push(item);
        //                                });
        //                            };

        //                            if ($scope.tempOSImagesArray.length > 0) {
        //                                angular.forEach($scope.tempOSImagesArray, function (item) {
        //                                    obj.PatientFiles.push(item);
        //                                });
        //                            };

        //                            eHnotePatientDataService.SavePatientInvestigationApptFiles(obj, OnAddPatientSuccess, OnAddPatientError);
        //                            function OnAddPatientSuccess(data) {
        //                                alertify.success("Files Added  Successfully");
        //                                $uibModalInstance.close('save');

        //                            }
        //                            function OnAddPatientError() {
        //                                alertify.error("Creating  Failed");
        //                            }



        //                        }
        //                        $scope.clearImagePopup = function () {


        //                            $scope.tempODImagesArray = [];
        //                            $scope.tempOSImagesArray = [];
        //                            $scope.ODFileupload = [];
        //                            $scope.OSFileupload = [];
        //                            $uibModalInstance.close('clear');
        //                        };

        //                        //$scope.getBase64 = function (file) {
        //                        //    var reader = new FileReader();
        //                        //    reader.readAsDataURL(file);
        //                        //    reader.onload = function () {
        //                        //        //  console.log("base64" + reader.result);
        //                        //        $scope.Sign.SignatureOfUser = reader.result;
        //                        //    };
        //                        //    reader.onerror = function (error) {
        //                        //        console.log('Error: ', error);
        //                        //    };
        //                        //}

        //                        $scope.uploadPatientFiles = function ($files) {
        //                            // $scope.imguploadReqObj.PatientFiles = $files;
        //                            angular.forEach($files, function (fitem) {
        //                                var obj = { "file": fitem };
        //                                $scope.imguploadReqObj.PatientFiles.push(obj)
        //                            });
        //                        };


        //                        $scope.tempODImagesArray = [];
        //                        $scope.tempOSImagesArray = [];
        //                        $scope.ODFileupload = [];
        //                        $scope.OSFileupload = [];
        //                        $scope.Fileupload = "";
        //                        $scope.selectedEyeFiles = function (files, eye) {
        //                            if (files == null || files == "") {
        //                                return false;
        //                            }

        //                            var sorganid = 1;
        //                            if (eye == 'OS') { sorganid = 2; } else { sorganid = 1; };
        //                            if (sorganid === 1) {
        //                                $scope.ODFileupload = files;
        //                                if ($scope.ODFileupload != null) {
        //                                    angular.forEach($scope.ODFileupload, function (item) {
        //                                        var pName = item.name, name = "";
        //                                        var type = item.type.split("/")[1];
        //                                        if (pName.length > 9) {
        //                                            name = pName.substring(0, 9) + "..." + "." + type;
        //                                        } else {
        //                                            name = angular.copy(pName) + '.' + type;
        //                                        }
        //                                        var obj = {
        //                                            "S3URL": "",
        //                                            "DocumentExt": item.type,
        //                                            "DocumentName": name,
        //                                            "OrganId": sorganid,
        //                                            "DeleteInd": "N",
        //                                            "DocumentId": 0,
        //                                            "file": item
        //                                        };

        //                                        $scope.tempODImagesArray.push(obj);

        //                                    });
        //                                }
        //                            } else {
        //                                $scope.OSFileupload = files;
        //                                if ($scope.OSFileupload != null) {
        //                                    angular.forEach($scope.OSFileupload, function (item) {
        //                                        var pName = item.name, name = "";
        //                                        var type = item.type.split("/")[1];
        //                                        if (pName.length > 9) {
        //                                            name = pName.substring(0, 9) + "..." + "." + type;
        //                                        } else {
        //                                            name = angular.copy(pName) + '.' + type;
        //                                        }
        //                                        var obj = {
        //                                            "S3URL": "",
        //                                            "DocumentExt": item.type,
        //                                            "DocumentName": name,
        //                                            "OrganId": sorganid,
        //                                            "DeleteInd": "N",
        //                                            "DocumentId": 0,
        //                                            "file": item
        //                                        };

        //                                        $scope.tempOSImagesArray.push(obj);

        //                                    });
        //                                }
        //                            }



        //                        }


        //                        $scope.removeImage = function (item, eye) {

        //                            var sorganid = 1;
        //                            if (eye == 'OS') { sorganid = 2; } else { sorganid = 1; };

        //                            if (item.DocumentId != 0) {
        //                                item.DeleteInd = "Y";
        //                            } else {
        //                                if (sorganid === 1) {
        //                                    var index = $scope.tempODImagesArray.indexOf(item);
        //                                    $scope.tempODImagesArray.splice(index, 1);
        //                                } else {
        //                                    var index = $scope.tempOSImagesArray.indexOf(item);
        //                                    $scope.tempOSImagesArray.splice(index, 1);
        //                                }
        //                            }
        //                        };


        //                        $scope.GetOrganizationProcedure = function (text) {

        //                            var params = {
        //                                "OrganizationId": $scope.HospitalId,
        //                                "ProcedureId": 0,
        //                                "CPTCODE": "",  // cptcode tblorganizationprocedure
        //                                "SearchText": text || "", // searchtext
        //                                "TypeOfServiceId": 0,
        //                                "PageNumber": 1,
        //                                "PageSize": 10,
        //                                "Status": 1,
        //                                "IsFrequent": "N"
        //                            };
        //                            if (params.SearchText == '') {
        //                                params.IsFrequent = 'Y';
        //                            }

        //                            return eHnoteSettingsDataService.GetOrganizationProcedures(params).then(function (resp) {
        //                                if (resp.data.rows !== undefined) {
        //                                    return resp.data.rows.map(function (item) {
        //                                        return item;
        //                                    });
        //                                }
        //                            });
        //                        };


        //                        $scope.onInvProcedureChange = function () {
        //                            $scope.imguploadReqObj.OrganizationProcedureId = "";
        //                            $scope.imguploadReqObj.ProcedureId = "";
        //                            $scope.imguploadReqObj.ProcedureCode = "";
        //                            $scope.imguploadReqObj.ProcedureName = "";
        //                            $scope.imguploadReqObj.CPTCode = "";
        //                        }

        //                        $scope.onSelectProcedureInv = function (obj) {

        //                            console.log(obj);

        //                            $scope.imguploadReqObj.OrganizationProcedureId = obj.OrganizationProcedureId;
        //                            $scope.imguploadReqObj.ProcedureId = obj.ProcedureId;
        //                            $scope.imguploadReqObj.ProcedureCode = obj.ProcedureCode;
        //                            $scope.imguploadReqObj.ProcedureName = obj.ProcedureName;
        //                            $scope.imguploadReqObj.CPTCode = obj.CPTCode;
        //                        };
        //                    }
        //                });
        //                modalInstance.result.then(function (result) {
        //                    console.log(result);
        //                    $scope.navtoMainImageTab(2);

        //                }, function (cancel) {
        //                });
        //            }
        //            else {
        //                alertify.error("No Appointments For the Patient To Image Study");
        //                return false;
        //            }

        //        }
        //    }

        //});



    }



    $scope.addImageStudy = function () {



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
            alertify.error("please select images to create an Image Study");
            return false;
        }


        var Obj = {
            "HospitalId": $scope.HospitalId,
            "PatientId": $scope.PatientId,
            "UserId": $scope.UserId,
            "AppointmentId": $scope.AppointmentId,
            "AppointmentDate": $scope.AppointmentDate,
            "PatientName": $scope.PatientName,
            "ImagesList": $scope.selectedImages
        }

        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/AddImagestudypopup.html",
            "backdrop": "static",
            "scope": $scope,
            "resolve": {
                "ParentObject": Obj
            },
            "keyboard": false,
            "windowClass": "newassessmentspopupuib",
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, ParentObject) {

                console.log(ParentObject);

                $scope.selectedFiles = ParentObject.ImagesList || [];


                $scope.closeuib = function () {
                    $uibModalInstance.dismiss("cancel");
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
                        "ModalityId": "",
                        "DoctorId": "",
                        "TechnicianId": "",
                        "AppointmentId": $scope.AppointmentId,
                        "PatientId": $scope.PatientId,
                        "DoctorNotes": "",
                        "TechnicianNotes": "",
                        "DeleteInd": "N",
                        "StudyImagesArray": [],
                        "StudyDiagnosisArray": [

                        ]
                    }

                    return objj;
                }

                //    {
                //        "PatientImageStudyDetailId": 0,
                //            "S3URL": "",
                //                "OrganId": 1,
                //                    "DeleteInd": "N"
                //    },
                //                {
                //    "PatientImageStudyDetailId": 0,
                //    "S3URL": "",
                //    "OrganId": 2,
                //    "DeleteInd": "N"
                //}

                //{
                //    "PatientImageStudyDiagnosisId": 0,
                //        "DiagnosisId": 0,
                //            "OrganizationDiagnosisId": 0,
                //                "DeleteInd": "N"
                //}


                $scope.addupdateImgStudyReqObj = getaddnewImageStudyObj();

                $scope.ModalityArray = [
                    {
                        "Id": 1,
                        "Name": "Corneal Topo"
                    },
                    {
                        "Id": 2,
                        "Name": "ECC"
                    },
                    {
                        "Id": 3,
                        "Name": "External Camera"
                    },
                    {
                        "Id": 4,
                        "Name": "IOL"
                    },
                    {
                        "Id": 5,
                        "Name": "OCT/HRT"
                    },
                    {
                        "Id": 6,
                        "Name": "Opthalmic Photography"
                    },
                    {
                        "Id": 7,
                        "Name": "UltraSound"
                    },
                    {
                        "Id": 8,
                        "Name": "Visual Field"
                    },
                    {
                        "Id": 9,
                        "Name": "Other"
                    }
                ];

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
                ]

                $scope.addUpdatePatientImageStudy = function () {


                    console.log($scope.addupdateImgStudyReqObj);
                    $scope.addupdateImgStudyReqObj.ModalityId = $scope.addupdateImgStudyReqObj.ModalityId || "";
                    if ($scope.addupdateImgStudyReqObj.ModalityId == "") {
                        alertify.error("Please Select Modality");
                        return false;
                    }

                    $scope.addupdateImgStudyReqObj.InvestigationId = $scope.addupdateImgStudyReqObj.InvestigationId || "";
                    if ($scope.addupdateImgStudyReqObj.InvestigationId == "") {
                        alertify.error("Please Select Investigation");
                        return false;
                    }

                    angular.forEach($scope.selectedFiles, function (imgitem) {


                        var obj = {
                            "PatientImageStudyDetailId": 0,
                            "S3URL": imgitem.S3URL,
                            "OrganId": imgitem.OrganId,
                            "DeleteInd": "N"
                        }


                        $scope.addupdateImgStudyReqObj.StudyImagesArray.push(obj);


                    });



                    eHnotePatientDataService.AddUpdatePatientImageStudyDetails($scope.addupdateImgStudyReqObj).then(function (resp) {

                        console.log(resp);
                        alertify.success("Inage Study Created  Successfully");
                        $uibModalInstance.close('save');

                    }, function (err) {
                        console.log(err);
                        alertify.error("Getting Failed");
                    });


                }
            }
        });
        $scope.mInstanceAdd.result.then(function (result) {
            console.log(result);
            $scope.navtoMainImageTab(1);

        }, function (cancel) {
        });
    }



    $scope.ODImgObj = {
        "Index": 1,
        "wrapper": "",
        "viewer": "",
        "total": "",
        "curSpan": ""
    }

    $scope.OSImgObj = {
        "Index": 1,
        "wrapper": "",
        "viewer": "",
        "total": "",
        "curSpan": ""
    }
    $scope.ODImgObj.Index = 1;


    //$uibModalInstance.opened.then(function () {
      
    //    $scope.ODImgObj.wrapper = document.querySelector("#image-gallery");
    //    $scope.ODImgObj.viewer = new ImageViewer($scope.ODImgObj.wrapper.querySelector(".image-container"));
    //    window.viewer = $scope.ODImgObj.viewer;

    //    $scope.OSImgObj.Index = 1;
    //    $scope.OSImgObj.wrapper = document.querySelector("#rimage-gallery");
    //    $scope.OSImgObj.viewer = new ImageViewer($scope.OSImgObj.wrapper.querySelector(".image-container"));
    //    window.viewer = $scope.OSImgObj.viewer;
    //});
 
    $scope.ODImgObj.wrapper = document.querySelector("#image-gallery");
    $scope.ODImgObj.viewer = new ImageViewer($scope.ODImgObj.wrapper.querySelector(".image-container"));
    window.viewer = $scope.ODImgObj.viewer;

    $scope.OSImgObj.Index = 1;
    $scope.OSImgObj.wrapper = document.querySelector("#rimage-gallery");
    $scope.OSImgObj.viewer = new ImageViewer($scope.OSImgObj.wrapper.querySelector(".image-container"));
    window.viewer = $scope.OSImgObj.viewer;

    $scope.showODimageViewer = function () {


        //  $scope.ODImgObj.wrapper.querySelector(".total").innerHTML = $scope.ODImgObj.total;
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
        // $scope.ODImgObj.curSpan.innerHTML = $scope.ODImgObj.Index;
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



    $scope.clickonParticularImage = function (obj, index) {
        $scope.ODImgObj.Index = index + 1;
        $scope.showODImage();
    }

    $scope.clickonRParticularImage = function (obj, index) {
        $scope.OSImgObj.Index = index + 1;
        $scope.showOSImage();
    };




    $scope.chooseDoctorforImageStudy = function (item) {
        console.log(item);

        $scope.selectedImageStudyObj.DoctorObj = item;
        $scope.selectedImageStudyObj.DoctorId = item.DoctorID;
    };
    $scope.chooseTechnicianforImageStudy = function (item) {
        console.log(item);

        $scope.selectedImageStudyObj.TechnicianObj = item;
        $scope.selectedImageStudyObj.TechnicianId = item.DoctorID;
    };
















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
            "SubSpecializationIdArray": ""
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
                $scope.AllTecniciansList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });




            } else {
                alertify.error("No Users Found in Selected Departments");
                $scope.mainBookedAppointmentList = [];
            }


        }

        function onGetUsersFailure(data) {
        }
    }
    

    $scope.init = function () {

        getDoctorsbySubSpecializations($scope.HospitalId);
    };




    $scope.init();




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
                        kitem.ICDCodewithDIAGDESCRIPTION = kitem.ICD10CODE + '-' + kitem.ICD10DIAGDESCRIPTION;
                    });
                    return response.data.DiagnosisList.map(function (item) {
                        return item;
                    });
                }
            }
        });
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
            }



            $scope.selectedImageStudyObj.DiagnosisListArray.push(obj);
            $scope.selectedImageStudyObj.SelectedDiagObj = "";

        }



    }

    $scope.deleteDiagitem = function (item, indx) {
        $scope.selectedImageStudyObj.DiagnosisListArray.splice(indx, 1);
    };


    $scope.saveImageManagementStudyDetails = function () {


        console.log(JSON.stringify($scope.selectedImageStudyObj));



        var params = angular.copy($scope.selectedImageStudyObj);
        params.DoctorObj = "";
        params.TechnicianObj = "";
        eHnotePatientDataService.UpdatePatientImageStudyDetailsById(params).then(function (resp) {


            if (resp.data.Status == "Success") {
                alertify.success("Added Successfully");
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    }


    function zoomImage() {
        var scale = 1,
            panning = false,
            pointX = 0,
            pointY = 0,
            start = { x: 0, y: 0 },
            zoom = document.getElementById("zoom");

        function setTransform() {
            zoom.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
        }

        zoom.onmousedown = function (e) {
            e.preventDefault();
            start = { x: e.clientX - pointX, y: e.clientY - pointY };
            panning = true;
        }

        zoom.onmouseup = function (e) {
            panning = false;
        }

        zoom.onmousemove = function (e) {
            e.preventDefault();
            if (!panning) {
                return;
            }
            pointX = (e.clientX - start.x);
            pointY = (e.clientY - start.y);
            setTransform();
        }

        zoom.onwheel = function (e) {
            e.preventDefault();
            var xs = (e.clientX - pointX) / scale,
                ys = (e.clientY - pointY) / scale,
                delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
            (delta > 0) ? (scale *= 1.2) : (scale /= 1.2);
            pointX = e.clientX - xs * scale;
            pointY = e.clientY - ys * scale;

            setTransform();
        }
    }

    $scope.scrollparticularImg = function (ind) {
        var idvalue = "zoom" + ind;
        var scale = 1,
            panning = false,
            pointX = 0,
            pointY = 0,
            start = { x: 0, y: 0 },
            zoom = document.getElementById(idvalue);

        function setTransform() {
            zoom.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
        }

        zoom.onmousedown = function (e) {
            e.preventDefault();
            start = { x: e.clientX - pointX, y: e.clientY - pointY };
            panning = true;
        }

        zoom.onmouseup = function (e) {
            panning = false;
        }

        zoom.onmousemove = function (e) {
            e.preventDefault();
            if (!panning) {
                return;
            }
            pointX = (e.clientX - start.x);
            pointY = (e.clientY - start.y);
            setTransform();
        }

        zoom.onwheel = function (e) {
            e.preventDefault();
            var xs = (e.clientX - pointX) / scale,
                ys = (e.clientY - pointY) / scale,
                delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
            (delta > 0) ? (scale *= 1.2) : (scale /= 1.2);
            pointX = e.clientX - xs * scale;
            pointY = e.clientY - ys * scale;

            setTransform();
        }
    }

 
  
}]);
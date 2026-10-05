"use strict";
eHnoteWebApp.controller("USASCVitalsPopUpCtrl", ["$scope", "$rootScope", "$uibModalInstance", "$filter", "alertify", "VitalsArrayList", "PerformedByArray", "allUserList", "eHnoteMasterDataService", "eHnoteCacheStorageService", "eHnoteSurgeryService", "DocumentDetails", "eHnoteDiagnosisDataServices", "$uibModal", "VitalInd", "TypeObj", "eHnoteAuditServices","eHnoteUserDataService",
    function ($scope, $rootScope, $uibModalInstance, $filter, alertify, VitalsArrayList, PerformedByArray, allUserList, eHnoteMasterDataService, eHnoteCacheStorageService, eHnoteSurgeryService, DocumentDetails, eHnoteDiagnosisDataServices, $uibModal, VitalInd, TypeObj, eHnoteAuditServices, eHnoteUserDataService) {

        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;

        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        };
        $scope.LogObj = {
            "UserId": $scope.UserId || null,
            "OrganizationId": $scope.HospitalId || null,
            "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
            "PatientId": $scope.cacheStorageItem.PatientID || null,
            "LogArray": [],
            "VitalsArray": [],
        }
        $scope.allUserList = angular.copy(allUserList);
        $scope.AllVitalsArray = angular.copy(VitalsArrayList) || [];
        $scope.LogObj.VitalsArray = angular.copy(VitalsArrayList) || [];
        $scope.PerformedByArray = PerformedByArray;
        $scope.VitalInd = VitalInd || false;

        if ($scope.VitalInd) {
            $scope.AllVitalsArray = $filter('filter')($scope.AllVitalsArray, { "TypeId": 7 }, true);
        }

        $scope.GetFilesObj = function () {
            return {
                "DocumentDetails": [],
                "TempImagesArray": []
            };
        };
       
        $scope.FilesObj = angular.copy($scope.GetFilesObj());
        $scope.FilesObj.DocumentDetails = DocumentDetails || [];
        $scope.TemperatureUnits = [
            {
                "Unit": "°F",
                "UnitId": 1
            },
            {
                "Unit": "°C",
                "UnitId": 2
            }
        ];



        $scope.ECGUnits = [
            {
                "Unit": "mV",
                "UnitId": 13
            },
            {
                "Unit": "sec",
                "UnitId": 14
            },
            {
                "Unit": "ms",
                "UnitId": 15
            },
            {
                "Unit": "Hz",
                "UnitId": 16
            },
            {
                "Unit": "BPM",
                "UnitId": 17
            }
        ];

        $scope.subVitallist = function () {
            return [
                {
                    "AppointmentVitalDataId": 0,
                    "VitalId": 11,
                    "VitalDesc": "Temperature",
                    "Value": "",
                    "UnitTypeId": 1,
                    "UnitTypeName": "°F",
                    "OrderType": 1
                },
                {
                    "AppointmentVitalDataId": 0,
                    "VitalId": 12,
                    "VitalDesc": "Pulse",
                    "Value": "",
                    "UnitTypeId": 3,
                    "UnitTypeName": "BPM",
                    "OrderType": 2
                },
                {
                    "AppointmentVitalDataId": 0,
                    "VitalId": 4,
                    "VitalDesc": "BP-Systolic",
                    "Value": "",
                    "UnitTypeId": 5,
                    "UnitTypeName": "mmHg",
                    "OrderType": 3
                },
                {
                    "AppointmentVitalDataId": 0,
                    "VitalId": 5,
                    "VitalDesc": "BP-Diastolic",
                    "Value": "",
                    "UnitTypeId": 5,
                    "UnitTypeName": "mmHg",
                    "OrderType": 4
                },
                {
                    "AppointmentVitalDataId": 0,
                    "VitalId": 14,
                    "VitalDesc": "Respiratory Rate",
                    "Value": "",
                    "UnitTypeId": 4,
                    "UnitTypeName": "BPM",
                    "OrderType": 5
                },
                {
                    "AppointmentVitalDataId": 0,
                    "VitalId": 15,
                    "VitalDesc": "SpO2",
                    "Value": "",
                    "UnitTypeId": 6,
                    "UnitTypeName": "%",
                    "OrderType": 6
                },
                {
                    "AppointmentVitalDataId": 0,
                    "VitalId": 8,
                    "VitalDesc": "Blood Glucose Level",
                    "Value": "",
                    "UnitTypeId": 11,
                    "UnitTypeName": "mg/dL",
                    "OrderType": 8
                },
                {
                    "AppointmentVitalDataId": 0,
                    "VitalId": 36,
                    "VitalDesc": "ECG",
                    "Value": "",
                    "UnitTypeId": 17,
                    "UnitTypeName": "BPM",
                    "OrderType": 9
                },
            ]

        }

        $scope.VitalsObj = function () {
            return {
                "VitalSummaryId": 0,
                "AppointmentId": 0,
                "VitalAddDate": moment().format("YYYY-MM-DD"),
                "VitalAddTime": "",
                "DoctorId": 0,
                "UserName": "",
                "DeleteInd": "N",
                "IsEditVitalInd": false,
                "VitalRemarks":"",
                "Vitals": angular.copy($scope.subVitallist())||[]
            };

        }

        $scope.onSelectTemperature = function (item, id) {
            if (id == 2) {
                item.UnitTypeName = "°C";
            } else {
                item.UnitTypeName = "°F";
            }
        };
        $scope.TypeId = null;
        $scope.TypeName = null;
        var TypeObj = TypeObj || '';
        if (TypeObj!='') {
            $scope.TypeId = TypeObj.TypeId || null
            $scope.TypeName = TypeObj.TypeName || null;
            $scope.IsComingfrom = TypeObj.IsComingfrom || '';
            $scope.AdmitVitalsArray = TypeObj.AdmitVitalsArray || [];
        }
        function getChangedVitalsIndices(array1, array2) {
            let changedIndices = [];

            const length = Math.max(array1.length, array2.length);
            for (let i = 0; i < length; i++) {
                const a = array1[i] || {};
                const b = array2[i] || {};

                if (
                    a.VitalAddTime !== b.VitalAddTime ||
                    a.DoctorId !== b.DoctorId ||
                    a.VitalRemarks !== b.VitalRemarks ||
                    a.DeleteInd !== b.DeleteInd
                ) {
                    changedIndices.push(i);
                    continue;
                }

                const aVitals = a.Vitals || [];
                const bVitals = b.Vitals || [];

                if (aVitals.length !== bVitals.length) {
                    changedIndices.push(i);
                    continue;
                }

                for (let j = 0; j < aVitals.length; j++) {
                    const va = aVitals[j] || {};
                    const vb = bVitals[j] || {};

                    if (va.Value !== vb.Value || va.UnitTypeId !== vb.UnitTypeId) {
                        changedIndices.push(i);
                        break;
                    }
                }
            }

            return [...new Set(changedIndices)];
        }


        function formatVitalsArray(array, indices, isAddCase, compareArray = []) {
            let result = "";

            indices.forEach(index => {
                const current = array[index];
                if (!current) return;

                const compare = compareArray.find((_, i) => i === index) || {};
                let vitalsString = "";

                const currentVitals = current.Vitals || [];
                const compareVitals = compare.Vitals || [];

                const isDeleted = current.DeleteInd === 'Y';

                // Compare individual vital values
                for (let i = 0; i < currentVitals.length; i++) {
                    const v = currentVitals[i] || {};
                    const c = compareVitals[i] || {};

                    const valueChanged = v.Value !== c.Value || v.UnitTypeId !== c.UnitTypeId;

                    if (isAddCase || valueChanged || isDeleted) {
                        if (v.Value !== undefined && v.Value !== null && v.Value !== "") {
                            vitalsString += `${v.VitalDesc}: ${v.Value}, `;
                        }
                    }
                }

                vitalsString = vitalsString.trim().replace(/,\s*$/, '');

                // Construct line
                let line = `(Vitals)V${index + 1}`;
                if (vitalsString) line += ` ${vitalsString}`;

                // Remarks
                if (isAddCase || current.VitalRemarks !== compare.VitalRemarks || isDeleted) {
                    if (current.VitalRemarks) {
                        line += ` | Remarks: ${current.VitalRemarks}`;
                    }
                }

                // Performed By
                if (isAddCase || current.DoctorId !== compare.DoctorId || isDeleted) {
                    if (current.DoctorId) {
                        line += ` | Performed By: ${current.UserName}`;
                    }
                }

                // Time
                if (isAddCase || current.VitalAddTime !== compare.VitalAddTime || isDeleted) {
                    if (current.VitalAddTime) {
                        line += ` | Time: ${current.VitalAddTime}`;
                    }
                }

                // If DeleteInd is 'Y', prefix "Deleted"
                if (isDeleted) {
                    line = `Deleted ${line}`;
                }

                // Only push if meaningful
                if (line !== `(Vitals)V${index + 1}`) {
                    result += line + '\n';
                }
            });

            return result.trim();
        }

        $scope.IsClickSaveASCVitalsBtn = false;
        $scope.SaveVitals = function () {
            $scope.LogObj.LogArray = [];
            if ($scope.AllVitalsArray.length > 0) {
                let VitalCount = 0;
                let vitalarray = $filter('filter')($scope.AllVitalsArray, { "DeleteInd": "N" }, true);
                vitalarray = vitalarray || [];

                let index = $scope.AllVitalsArray.length - 1;
                let counter = 0;
                angular.forEach($scope.AllVitalsArray[index].Vitals, function (hitem) {
                    if (hitem.Value != "") {
                        counter++;
                    }
                });
                if (counter === 0) {
                    alertify.error("Please enter Any  Vitals Value To Save!");
                    return;
                }

                if ($scope.VitalInd) {

                    if (vitalarray.length > 0) {

                        var isEmptyValue = false;

                        angular.forEach(vitalarray, function (item) {
                            angular.forEach(item.Vitals, function (hitem) {
                                if (hitem.VitalId == 4 || hitem.VitalId == 5) {
                                    if (hitem.Value === "") {
                                        isEmptyValue = true;
                                    }
                                }
                            });
                        });

                        if (isEmptyValue) {
                            alertify.error("Please enter BP values!");
                            return false;
                        }
                    }
                }

                if (vitalarray.length > 0) {
                    angular.forEach(vitalarray, function (item) {
                        item.DoctorId = item.DoctorId || null;
                        item.VitalAddTime = item.VitalAddTime || "";
                        if (item.DoctorId == null) {
                            VitalCount++;
                        }
                    });
                }
                if (VitalCount > 0) {
                    /*alertify.error("Please enter vitals!");*/
                    alertify.error("Please select the Performed By");
                    return false;
                }
            }

            if ($scope.IsComingfrom == 'Admin') {
                var Obj = {
                    "VitalsArray": $scope.AllVitalsArray || [],
                    "TempImagesArray": $scope.FilesObj.TempImagesArray || [],
                    "DocumentDetails": $scope.FilesObj.DocumentDetails || [],
                }
                $uibModalInstance.close(Obj);
                return false;
            }

            if ($scope.IsComingfrom == 'Pre-op') {
                var Obj = {
                    "VitalsArray": $scope.AllVitalsArray || [],
                    "TempImagesArray": $scope.FilesObj.TempImagesArray || [],
                    "DocumentDetails": $scope.FilesObj.DocumentDetails || [],
                }
                $uibModalInstance.close(Obj);
                return false;
            }

            let PatientSurgeryId = null;
            if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
                $scope.cacheStorageItem.SurgeryList[0] = $scope.cacheStorageItem.SurgeryList[0] || [];
                PatientSurgeryId = $scope.cacheStorageItem.SurgeryList[0].PatientSurgeryId;
            }
            let ModuleId = 0;
            let ModuleName = "";
            if ($scope.cacheStorageItem.AppointmentTypeId == 7) {
                $scope.cacheStorageItem.PreAdmSurgeryList[0] = $scope.cacheStorageItem.PreAdmSurgeryList[0] || [];
                PatientSurgeryId = $scope.cacheStorageItem.PreAdmSurgeryList[0].PatientSurgeryId;
                ModuleId = 3;
                ModuleName = "Pre Admission";
            } else {
                ModuleId = 2;
                ModuleName = "ASC";
            }

            $scope.currentDate = moment().format("YYYY-MM-DD");
            let reqObj = {
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                //"PatientName": $scope.MainObj.PatientDetails.FullName || '',
                "Tab": "PreAdmission Vitals",
                "TypeId": $scope.TypeId || null,
                "TypeName": $scope.TypeName || '',
                "SignedDate": $scope.currentDate,
                "VitalsArray": $scope.AllVitalsArray||[],
                "TempDocumentDetails": [],
                "DocumentDetails": [],
                "PatientSurgeryId": PatientSurgeryId || null,
                "Logs": {},
            }

            $scope.FilesObj.TempImagesArray = $scope.FilesObj.TempImagesArray || [];
            if ($scope.FilesObj.TempImagesArray.length > 0) {
                angular.forEach($scope.FilesObj.TempImagesArray, function (item) {
                    item.DocumentID = item.DocumentID || 0;
                    var object = {
                        "file": item.file,
                        "S3URL": item.S3URL || '',
                        "DeleteInd": item.DeleteInd,
                        "DocumentID": item.DocumentID,
                        "DocumentName": item.DocumentName,
                        "FileName": item.FileName,
                        "FileExt": item.FileExt,
                        "FileTypeId": item.FileTypeId,
                        "DisplayName": item.DisplayName,
                    };
                    if (item.DocumentID === 0) {
                        reqObj.TempDocumentDetails.push(object);
                        reqObj.DocumentDetails.push(object);
                    }
                    else {
                        reqObj.DocumentDetails.push(object);
                    }
                });
                if (reqObj.TempDocumentDetails.length > 0) {

                        let obj = {
                            "LogId": 0,
                            "ModuleId": ModuleId || 2,
                            "ModuleName": ModuleName || "ASC",
                            "SubModuleId": 13,
                            "SubModuleName": "Vitals",
                            "ScreenType": "QuickAccess" || '',
                            "ActionType": "Imported",
                            "OldActionDescription": "",
                            "NewActionDescription": `Files in Vitals ${ModuleName} `,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                   
                }
            }

            if (($scope.AllVitalsArray || []).length > 0) {
                let ActionType = '';
                let OldDescription = '';
                let NewDescription = '';

                if (($scope.LogObj.VitalsArray || []).length === 0) {
                    // First-time add
                    let indices = $scope.AllVitalsArray.map((_, i) => i);
                    NewDescription = formatVitalsArray($scope.AllVitalsArray, indices, true);
                    if (NewDescription != '') {
                        ActionType = 'Added';
                    }
                } else {
                    // Edit case
                    const changedIndices = getChangedVitalsIndices($scope.LogObj.VitalsArray, $scope.AllVitalsArray);

                    if (changedIndices.length > 0) {
                        ActionType = 'Edited';
                        OldDescription = formatVitalsArray($scope.LogObj.VitalsArray, changedIndices, false, $scope.AllVitalsArray);
                        NewDescription = formatVitalsArray($scope.AllVitalsArray, changedIndices, false, $scope.LogObj.VitalsArray);
                    }
                }

                if (ActionType !== '') {
                    let obj = {
                        LogId: 0,
                        ModuleId: ModuleId || 2,
                        ModuleName: ModuleName || "ASC",
                        SubModuleId: 13,
                        SubModuleName: "Vitals",
                        ScreenType: "QuickAccess" || '',
                        ActionType: ActionType,
                        OldActionDescription: OldDescription,
                        NewActionDescription: NewDescription,
                        ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            //if ($scope.AllVitalsArray.length > 0) {
            //    if ($scope.LogObj.VitalsArray.length > 0) {

            //        var isVitalsEdited = compareVitalsArrays($scope.LogObj.VitalsArray, $scope.AllVitalsArray) || false;


            //        if (isVitalsEdited) {
            //            let obj = {
            //                "LogId": 0,
            //                "ModuleId": ModuleId||2,
            //                "ModuleName": ModuleName||"ASC",
            //                "SubModuleId": 13,
            //                "SubModuleName": "Vitals",
            //                "ScreenType": "QuickAccess" || '',
            //                "ActionType": "Edited",
            //                "ActionDescription": `Vitals in ${ModuleName}  for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
            //                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            //            };
            //            $scope.LogObj.LogArray.push(obj);
            //        }

      
            //    } else {
            //        let obj = {
            //            "LogId": 0,
            //            "ModuleId": ModuleId || 2,
            //            "ModuleName": ModuleName || "ASC",
            //            "SubModuleId": 13,
            //            "SubModuleName": "Vitals",
            //            "ScreenType": "QuickAccess" || '',
            //            "ActionType": "Added",
            //            "ActionDescription": `Vitals in ${ModuleName} for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
            //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            //        };
            //        $scope.LogObj.LogArray.push(obj);
            //    }
            //}
            if ($scope.LogObj.LogArray.length > 0) {
                reqObj.Logs = $scope.LogObj || {};
            }
            $scope.IsClickSaveASCVitalsBtn = true;
            eHnoteSurgeryService.AddUpdateASCVitalsQuickAccess(reqObj, callbackSuccess, callbackError);
            /*console.log(response);*/
            function callbackSuccess(response) {
                if (response.Status === "Success") {
                    alertify.success("saved successfully!");
                    $scope.IsClickSaveASCVitalsBtn = false;
                    //$uibModalInstance.close($scope.AllVitalsArray);
                    $uibModalInstance.close();
                } else {
                    $scope.IsClickSaveASCVitalsBtn = false;
                    alertify.error("Some Error Occured");
                }
            };
            function callbackError(err) {
                $scope.IsClickSaveASCVitalsBtn = false;
                alertify.error("Uploading Failed");
            }
       
        };
        function compareVitalsArrays(array1, array2) {
            if (array1.length !== array2.length) return true;

            for (let i = 0; i < array1.length; i++) {
                const originalData = array1[i];
                const newData = array2[i];


                if (originalData.VitalAddTime !== newData.VitalAddTime ||
                    originalData.DeleteInd !== newData.DeleteInd ||
                    originalData.VitalRemarks !== newData.VitalRemarks) {
                    return true;
                }


                const originalVitals = originalData.Vitals;
                const newVitals = newData.Vitals;

                if (originalVitals.length !== newVitals.length) return true;

                for (let j = 0; j < originalVitals.length; j++) {
                    const originalVital = originalVitals[j];
                    const newVital = newVitals[j];
                    if (originalVital.Value !== newVital.Value ||
                        originalVital.UnitTypeId !== newVital.UnitTypeId) {
                        return true;
                    }
                }
            }


            return false;
        }
        $scope.IsCopyAdmitVitalsVisible = false;
        if ($scope.AllVitalsArray.length == 0) {
            $scope.IsCopyAdmitVitalsVisible = true;
            let vitalsobj = angular.copy($scope.VitalsObj());
            $scope.AllVitalsArray.push(vitalsobj);
        }

        $scope.PerformedByName = function (id, PerformedByArray, item) {
            var vitallist = [];
            var vitallist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.DoctorId });
            if (vitallist.length > 0) {
                item.UserName = angular.copy(vitallist[0].FullName);
            }
        }
        $scope.changePerformedBy = function (item) {
            var vitallist = [];
            var vitallist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.DoctorId });
            if (vitallist.length > 0) {
                item.UserName = angular.copy(vitallist[0].FullName);
            }
        }
        $scope.RemoveVitals = function (item) {
            if (item.VitalSummaryId == 0) {
                var index = $scope.AllVitalsArray.indexOf(item);
                if (index > -1) {
                    $scope.AllVitalsArray.splice(index, 1);
                }
            } else {
                var index = $scope.AllVitalsArray.indexOf(item);
                $scope.AllVitalsArray[index].DeleteInd = 'Y';
            }
        }

        $scope.ClearVitals = function (item) {
            item.VitalAddTime = "";
            item.DoctorId = null;
            item.VitalRemarks = "";
            angular.forEach(item.Vitals, function (vitem) {
                if (vitem.VitalId == 11) {
                    vitem.Value = '';
                    vitem.UnitTypeId = 1;
                    vitem.UnitTypeName = "°F";
                }
                if (vitem.VitalId == 12) {
                    vitem.Value = '';
                    vitem.UnitTypeId = 3;
                    vitem.UnitTypeName = "/min";
                }
                if (vitem.VitalId == 4) {
                    vitem.Value = '';
                    vitem.UnitTypeId = 5;
                    vitem.UnitTypeName = "mmHg";
                }
                if (vitem.VitalId == 5) {
                    vitem.Value = '';
                    vitem.UnitTypeId = 5;
                    vitem.UnitTypeName = "mmHg";
                }
                if (vitem.VitalId == 14) {
                    vitem.Value = '';
                    vitem.UnitTypeId = 3;
                    vitem.UnitTypeName = "/min";
                }
                if (vitem.VitalId == 15) {
                    vitem.Value = '';
                    vitem.UnitTypeId = 6;
                    vitem.UnitTypeName = "%";
                }
                if (vitem.VitalId == 8) {
                    vitem.Value = '';
                    vitem.UnitTypeId = 11;
                    vitem.UnitTypeName = "mg/dL";
                }
                if (vitem.VitalId == 36) {
                    vitem.Value = '';
                    vitem.UnitTypeId = null;
                    vitem.UnitTypeName = '';
                }
            });
        }


        $scope.CopyVitals = function (item, index) {
            if (index > 0) {
                index = index - 1;
                let vitallist = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.UserId }, true);
                let TempArray = $filter('filter')($scope.PerformedByArray, { 'DoctorID': $scope.UserId }, true);
                if (TempArray.length > 0) {
                    if (vitallist.length > 0) {
                        item.UserName = angular.copy(vitallist[0].FullName);
                        item.DoctorId = angular.copy(vitallist[0].DoctorID);
                    }
                }
                item.VitalAddTime = $filter('date')(new Date(), "hh:mm a");
                angular.forEach($scope.AllVitalsArray[index].Vitals, function (hitem) {
                    angular.forEach(item.Vitals, function (vitem) {
                        if (hitem.VitalId == 11 && vitem.VitalId == 11) {
                            vitem.Value = hitem.Value;
                            vitem.UnitTypeId = hitem.UnitTypeId;
                            vitem.UnitTypeName = hitem.UnitTypeName;
                        }
                        if (hitem.VitalId == 12 && vitem.VitalId == 12) {
                            vitem.Value = hitem.Value;
                        }
                        if (hitem.VitalId === 4 && vitem.VitalId == 4) {
                            vitem.Value = hitem.Value;
                        }
                        if (hitem.VitalId === 5 && vitem.VitalId == 5) {
                            vitem.Value = hitem.Value;
                        }
                        if (hitem.VitalId == 14 && vitem.VitalId == 14) {
                            vitem.Value = hitem.Value;
                        }
                        if (hitem.VitalId == 15 && vitem.VitalId == 15) {
                            vitem.Value = hitem.Value;
                        }
                        if (hitem.VitalId === 8 && vitem.VitalId == 8) {
                            vitem.Value = hitem.Value;
                        }
                        if (hitem.VitalId === 36 && vitem.VitalId == 36) {
                            vitem.Value = hitem.Value;
                            vitem.UnitTypeId = hitem.UnitTypeId;
                            vitem.UnitTypeName = hitem.UnitTypeName;
                        }
                    });
                });
            }
        }

        $scope.AddVitals = function () {
            if ($scope.AllVitalsArray.length > 0) {
                let index = $scope.AllVitalsArray.length - 1;
                let counter = 0;
                angular.forEach($scope.AllVitalsArray[index].Vitals, function (hitem) {
                    if (hitem.Value != "") {
                        counter++;
                    }
                });
                if (counter == 0) {
                    alertify.error("Please enter vitals!");
                    return;
                }
            }
            let vitalsobj = angular.copy($scope.VitalsObj());
            $scope.AllVitalsArray.push(vitalsobj);

        };

        $scope.GetPresentTime = function (index) {
            $scope.AllVitalsArray[index].VitalAddTime = $filter('date')(new Date(), "hh:mm a");
        };

        $scope.TimeStamp = function (index, item) {
            let VitalInfo = $filter('filter')(item.Vitals, function (item) {
                return item.Value != ''
            });
            if (VitalInfo.length > 0) {
                item.VitalAddTime = moment().format("hh:mm A");
                if (doctorinfo.RoleID == 1 || doctorinfo.RoleID == 8 || doctorinfo.RoleID == 30 || doctorinfo.RoleID == 43 || doctorinfo.RoleID == 56 || doctorinfo.RoleID == 57 || doctorinfo.RoleID == 66) {
                    item.DoctorId = doctorinfo.doctorid;
                }
                var vitallist = [];
                var vitallist = $filter("filter")(PerformedByArray, function (kitem) { return kitem.DoctorID == doctorinfo.doctorid });
                if (vitallist.length > 0) {
                    item.UserName = angular.copy(vitallist[0].FullName);
                }
            }
            else {
                item.DoctorId = null;
                item.VitalAddTime = '';
            }
        }


        $scope.ClosePopup = function () {
            $uibModalInstance.dismiss("cancel");
        };









        $scope.selectedHandP = function (files) {

            files = files || [];
            if (files.length > 0) {
                angular.forEach(files, function (item) {
                    files = item || [];
                    $scope.file = item;
                    if ($scope.file != null) {

                        var pName = $scope.file.name, name = "";
                        var type = $scope.file.type.split("/")[1];
                        if (pName.length > 9) {
                            name = pName.substring(0, 9) + "..." + "." + type;
                        } else {
                            name = angular.copy(pName) + '.' + type;
                        }
                        let FileTypeId = 32;

                        var obj = {
                            "file": $scope.file,
                            "S3URL": "",
                            "DeleteInd": false,
                            "DocumentID": 0,
                            "DocumentName": $scope.file.name || "",
                            "FileName": $scope.file.name || "",
                            "FileExt": $scope.file.type,
                            "FileTypeId": FileTypeId,
                            "DisplayName": $scope.file.name || ""
                        };

                        $scope.FilesObj.TempImagesArray.push(obj);


                        angular.element("input[type='file']").val(null);
                    }
                });
            }
        };

        $scope.DeleteUploadedFileNew = function (item, index, mainitem) {
            if (item.DocumentID == 0) {
                $scope.FilesObj.TempImagesArray.splice(index, 1);
            }
        }


        $scope.scanFiles = function (type) {

            $scope.SelectedFile = 32;            

            let PatientSurgeryId = null;
            if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
                if ($scope.cacheStorageItem.SurgeryList.length > 0) {
                    PatientSurgeryId = $scope.cacheStorageItem.SurgeryList[0].PatientSurgeryId;
                }
            }
            if ($scope.cacheStorageItem.AppointmentTypeId == 7) {
                if ($scope.cacheStorageItem.PreAdmSurgeryList.length > 0) {
                    PatientSurgeryId = $scope.cacheStorageItem.PreAdmSurgeryList[0].PatientSurgeryId;
                }
            }

            var obj = {
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "PatientName": $scope.cacheStorageItem.PatientName || '',
                "Tab": "ASCFileUploads",
                "SignedDate": $filter('date')($scope.currentDate, "yyyy-MM-dd"),
                "FileTypeId": parseInt($scope.SelectedFile),
                "FileName": '',
                "DisplayName": '',
                "PatientSurgeryId": PatientSurgeryId,
            }

            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsNewConsultation/uibpopup/PatientDocumentScanner.html",
                "backdrop": "static",
                "scope": $scope,
                "size": "lg",
                "resolve": {
                    "mainObject": function () { return obj; }
                },
                "windowClass": "modal__eighty--  ",
                "keyboard": false,
                "controller": "DocumentScannerCtrl",
            });
            $scope.mInstanceAdd.result.then(function (data) {
                console.log(data);
                $scope.GetOTQuickAccessDetails();
               // $scope.init();

            }, function (cancel) {
            });

        }
        $scope.DeletePreAdmDocumentlist = function (item, index, mainitem) {

            $scope.DeleteFileUploadArray = { "DocumentID": item.DocumentID, "FileName": item.DocumentName, "Remarks": "" };
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
                $scope.LogObj.LogArray = [];
                var params = {
                    "AppointmentID": mainitem.AppointmentId,
                    "DeleteIndicator": 0,
                    "ImagesArray": [],
                    "UploadType": "Delete",
                    "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "Remarks": "",
                    "Logs": {},
                };
               let ModuleId = 0;
               let  ModuleName = "";
                if ($scope.cacheStorageItem.AppointmentTypeId == 7) {
                    ModuleId = 3;
                    ModuleName = "Pre Admission";
                } else {
                    ModuleId = 2;
                    ModuleName = "ASC";
                }
                let obj = {
                    "LogId": 0,
                    "ModuleId": ModuleId||3,
                    "ModuleName": ModuleName||"Pre Admission",
                    "SubModuleId": 13,
                    "SubModuleName": "Vitals",
                    "ScreenType": "QuickAccess" || '',
                    "ActionType": "Deleted",
                    "OldActionDescription": `Files in Vitals (Quick Access ${ModuleName}).`,
                    "NewActionDescription": '',
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
                if ($scope.LogObj.LogArray.length > 0) {
                    params.Logs = $scope.LogObj || {};
                }

                params.ImagesArray.push($scope.DeleteFileUploadArray);
                eHnoteDiagnosisDataServices.DeleteASCDocumentList(params, onupdateDeletesuccess, onupdateDelerror);
            }, function () { });
            function onupdateDeletesuccess(response) {
                if (response.Status === 'Success') {
                    /* $scope.init();*/
                    // $scope.GetPatientPreAdmissionDetailsForDocument();
                    //$uibModalInstance.close();
                    $scope.GetOTQuickAccessDetails();
                }
            }
            function onupdateDelerror(errordata) {
                console.log(errordata);
            }
        }

        $scope.onSelectECG = function (item,id) {
            if (id == 13) {
                item.UnitTypeName = "mV";
            }
            if (id == 14) {
                item.UnitTypeName = "sec";
            }

            if (id == 15) {
                item.UnitTypeName = "ms";
            }

            if (id == 16) {
                item.UnitTypeName = "Hz";
            }
            if (id == 17) {
                item.UnitTypeName = "BPM";
            }
          
        }

        $scope.GetOTQuickAccessDetails = function () {

            let req = {
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId,
            };

            eHnoteSurgeryService.GetOTQuickAccessDetails(req).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.FilesObj.DocumentDetails = angular.copy(resp.data.DocumentDetails);
                }
            });
        };



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
        }

        $scope.CopyAdmitVitals = function () {

            if (!$scope.AdmitVitalsArray || !$scope.AdmitVitalsArray.length) {
                return;
            }

             // Remove default empty row
            $scope.AllVitalsArray = [];

            var UserId = 0;
            var UserName = '';

            let DoctorArray = $filter('filter')(
                $scope.PerformedByArray,
                { 'DoctorID': $scope.UserId },
                true
            );

            if (DoctorArray.length > 0) {
                UserId = DoctorArray[0].DoctorID;
                UserName = DoctorArray[0].FullName;
            }

            var orderTypeMap = {
                11: 1, // Temperature
                12: 2, // Pulse
                4: 3,  // BP-Systolic
                5: 4,  // BP-Diastolic
                14: 5, // Respiratory Rate
                15: 6, // SpO2
                8: 8,  // Blood Glucose Level
                36: 9  // ECG
            };

            angular.forEach($scope.AdmitVitalsArray, function (admitObj) {

                var newVitalObj = {
                    VitalSummaryId: 0,
                    AppointmentId: 0,
                    VitalAddDate: moment().format('YYYY-MM-DD'),
                    VitalAddTime: moment().format('hh:mm A'),
                    DoctorId: UserId,
                    UserName: UserName,
                    DeleteInd: 'N',
                    IsEditVitalInd: false,
                    VitalRemarks: admitObj.VitalRemarks,
                    Vitals: [],
                    VitalshowNotesInd: !!(admitObj.VitalRemarks && admitObj.VitalRemarks.trim())
                };

                angular.forEach(admitObj.Vitals, function (vital) {

                    newVitalObj.Vitals.push({
                        AppointmentVitalDataId: 0,
                        VitalId: vital.VitalId,
                        VitalDesc: vital.VitalDesc,
                        Value: vital.Value,
                        UnitTypeId: vital.UnitTypeId,
                        UnitTypeName: vital.UnitTypeName,
                        OrderType: orderTypeMap[vital.VitalId] || 0
                    });
                });

                $scope.AllVitalsArray.push(newVitalObj);
            });
            $scope.IsCopyAdmitVitalsVisible = false;
        }
    }]);
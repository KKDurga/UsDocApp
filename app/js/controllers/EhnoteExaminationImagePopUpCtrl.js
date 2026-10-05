
eHnoteWebApp.controller("EhnoteExaminationImagePopUpCtrl", ["$scope", "eHnotePatientDataService", "$timeout", "alertify", "Investigation", "$uibModalInstance", "cache", "eHnoteMasterDataService", "eHnoteCacheStorageService", "Appointmentinfo", function ($scope, eHnotePatientDataService, $timeout, alertify, Investigation, $uibModalInstance, cache, eHnoteMasterDataService, eHnoteCacheStorageService, Appointmentinfo) {


    $scope.Investigation = angular.copy(Investigation);

    console.log($scope.Investigation);
    $scope.cache = angular.copy(cache);
    $scope.fileReaderSupported = window.FileReader !== null;
    $scope.RightEyefileName = "";
    $scope.LeftEyefileName = "";

    $scope.Investigation.SelectedEye = "1";
    //if (!$scope.cache.IsAnteriorLeftEyeCheckAll) {
    //    $scope.Investigation.SelectedEye = "2";
    //}
    //if ($scope.cache.IsPosteriorLeftEyeCheckedAll) {
    //    $scope.Investigation.SelectedEye = "1";
    //}
    $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.PatientData = eHnoteMasterDataService.getpatientData();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.Investigation.RightEyefileName = "";
    $scope.Investigation.LeftEyefileName = "";


    $scope.Investigation.thumbnailRightEye = "";
    $scope.Investigation.thumbnailLeftEye = "";

    $scope.Investigation.RightEyediv = false;
    $scope.Investigation.LeftEyediv = false;
    $scope.Appointmentinfo = Appointmentinfo || {};



    var object = {};
    $scope.toDataURL = function (url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.send();
    };
    $scope.cancel = function () {
        $uibModalInstance.close($scope.Investigation);
    };
    $scope.Save = function () {
        $uibModalInstance.close({});
    };
    $scope.GetTemplate = function (type, item) {
        if (type === "Right") {
            if (item.RightTemplateUrl === "") {
                alertify.log("No Images Found");
            } else {
                item.RightOrganDocUrl = item.RightTemplateUrl;
                item.RightEyefileName = item.RightTemplateUrl.substring(item.LeftTemplateUrl.lastIndexOf("/") + 1);
                $("#maineHnoteLoader").show();
                $scope.toDataURL(item.RightTemplateUrl, function (dataURL) {
                    item.RightEyediv = true;
                    item.thumbnailRightEye = dataURL;
                    $("#maineHnoteLoader").hide();
                });
            }
        }
        if (type === "Left") {
            if (item.LeftTemplateUrl === "") {
                alertify.log("No Images Found");
            } else {
                item.LeftOrganDocUrl = item.LeftTemplateUrl;
                item.LeftEyefileName = item.LeftTemplateUrl.substring(item.LeftTemplateUrl.lastIndexOf("/") + 1);
                $("#maineHnoteLoader").show();
                $scope.toDataURL(item.LeftTemplateUrl, function (dataURL) {
                    item.LeftEyediv = true;
                    item.thumbnailLeftEye = dataURL;
                    $("#maineHnoteLoader").hide();
                });
            }
        }
    };



    //Checking Template
    if ($scope.Investigation.RightTemplateUrl !== "") {
        $scope.Investigation.RightOrganDocUrl = $scope.Investigation.RightTemplateUrl;
        $scope.Investigation.RightEyefileName = $scope.Investigation.RightTemplateUrl.substring($scope.Investigation.RightTemplateUrl.lastIndexOf("/") + 1);
        $("#maineHnoteLoader").show();
        if ($scope.Investigation.RightTemplateUrl.indexOf("https://") == 0) {
            $scope.Investigation.RightEyediv = true;
            $scope.Investigation.thumbnailRightEye = $scope.Investigation.RightTemplateUrl;
            $("#maineHnoteLoader").hide();
        }
        else {
            $scope.toDataURL($scope.Investigation.RightTemplateUrl, function (dataURL) {
                $scope.Investigation.RightEyediv = true;
                $scope.Investigation.thumbnailRightEye = dataURL;
                $("#maineHnoteLoader").hide();
            });
        }
    }

    if ($scope.Investigation.LeftTemplateUrl !== "") {
        $scope.Investigation.LeftOrganDocUrl = $scope.Investigation.LeftTemplateUrl;
        $scope.Investigation.LeftEyefileName = $scope.Investigation.LeftTemplateUrl.substring($scope.Investigation.LeftTemplateUrl.lastIndexOf("/") + 1);
        $("#maineHnoteLoader").show();
        if ($scope.Investigation.LeftTemplateUrl.indexOf("https://") == 0) {
            $scope.Investigation.LeftEyediv = true;
            $scope.Investigation.thumbnailLeftEye = $scope.Investigation.LeftTemplateUrl;
            $("#maineHnoteLoader").hide();
        }
        else {
            $scope.toDataURL($scope.Investigation.LeftTemplateUrl, function (dataURL) {
                $scope.Investigation.LeftEyediv = true;
                $scope.Investigation.thumbnailLeftEye = dataURL;
                $("#maineHnoteLoader").hide();
            });
        }
    }




    $scope.syncImages = function (type, item) {
        if (type === "Right") {
            object = {
                "AppointmentId": $scope.cache.appointmentid,
                "CategoryId": item.CategoryId,
                "InvestigationID": item.InvestigationId,
                "OrganId": 1
            };
            eHnotePatientDataService.GetPatientInvestigationImages(object).then(function (resp) {
                if (resp.data.length === 0) {
                    alertify.log("No Images Found");
                } else {
                    item.RightEye.ImagesArray = resp.data;
                }
            }, function (err) {
                alertify.error(err.Messege);
            });
        }
        if (type === "Left") {
            object = {
                "AppointmentId": $scope.cache.appointmentid,
                "CategoryId": item.CategoryId,
                "InvestigationID": item.InvestigationId,
                "OrganId": 2
            };
            eHnotePatientDataService.GetPatientInvestigationImages(object).then(function (resp) {
                if (resp.data.length === 0) {
                    alertify.log("No Images Found");
                } else {
                    item.LeftEye.ImagesArray = resp.data;
                }
            }, function (err) {
                alertify.error(err.Messege);
            });
        }
    };
    $scope.FileChange = function (files, type, item) {
        var file = "";
        if (type === "Right") {
            if (files !== null) {
                file = files[0];
                item.RightEyefileName = file.name;
                item.ContentType = file.type;
                $scope.RightEyefileName = file.name;
                if ($scope.fileReaderSupported && file.type.indexOf("image") > -1) {
                    $timeout(function () {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function (e) {
                            item.thumbnailRightEye = "";
                            item.RightEyediv = true;
                            $timeout(function () {

                                item.thumbnailRightEye = e.target.result;
                            });
                        };
                    });
                }
            }
        }
        if (type === "Left") {
            if (files !== null) {
                file = files[0];
                item.LeftEyefileName = file.name;
                item.ContentType = file.type;
                $scope.LeftEyefileName = file.name;
                if ($scope.fileReaderSupported && file.type.indexOf("image") > -1) {
                    $timeout(function () {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function (e) {
                            item.thumbnailLeftEye = "";
                            item.LeftEyediv = true;
                            $timeout(function () {
                                item.thumbnailLeftEye = e.target.result;
                            });
                        };
                    });
                }
            }
        }
    };
    $scope.undoEyeCount = function (item, type) {
        //item.IsUndoClicked = true;
        if (type === "Right") {
            item.RightEyeUndoCount--;
        }
        if (type === "Left") {
            item.LeftEyeUndoCount--;
        }
    };
    $scope.savecanvas = function (type, item, isTemplate, whichCat) {
        var RightId = item.RightPwCanvas;
        var LeftId = item.LeftPwCanvas;

        if (type === "Right") {
            item.RightEyediv = false;
            var canvas = document.getElementById(RightId);
            var dataURL = canvas.toDataURL();
            object = {
                "USRId": $scope.UserId,
                "HospitalID": $scope.doctorinfo.hospitalID,
                "PatientID": $scope.cache.patientid,
                "PatientName": $scope.Appointmentinfo.PatientName,    // $scope.PatientData.FullName,
                "AppointmentID": $scope.cache.appointmentid,
                "CategoryID": item.CategoryId,
                "InvestigationID": item.InvestigationId,
                "OrganID": 1,
                "Base64": dataURL,
                "FileName": item.RightEyefileName,
                "DocumentID": 0,
                "ContentType": item.ContentType
            };

            eHnotePatientDataService.AddUpdatePatientInvestigationImage(object).then(function (resp) {
                var result = resp.data[0];
                result.DocumentId = 0;
                item.RightEye.ImagesArray.push(result);
                alertify.success("Image Uploaded Successfully");
                item.thumbnailRightEye = "";
                item.RightEyeUndoCount = 0;
                $scope.RightEyefileName = "";
            }, function (err) {
                alertify.error(err.Messege);
            });
        }
        if (type === "Left") {
            item.LeftEyediv = false;
            var canvas = document.getElementById(LeftId);
            var dataURL = canvas.toDataURL();
            object = {
                "USRId": $scope.UserId,
                "HospitalID": $scope.doctorinfo.hospitalID,
                "PatientID": $scope.cache.patientid,
                "PatientName": $scope.Appointmentinfo.PatientName,    // $scope.PatientData.FullName,
                "AppointmentID": $scope.cache.appointmentid,
                "CategoryID": item.CategoryId,
                "InvestigationID": item.InvestigationId,
                "OrganID": 2,
                "Base64": dataURL,
                "FileName": item.LeftEyefileName,
                "DocumentID": 0,
                "ContentType": item.ContentType
            };
            eHnotePatientDataService.AddUpdatePatientInvestigationImage(object).then(function (resp) {
                var result = resp.data[0];
                result.DocumentId = 0;
                item.LeftEye.ImagesArray.push(result);
                alertify.success("Image Uploaded Successfully");
                item.thumbnailLeftEye = "";
                item.LeftEyeUndoCount = 0;
                $scope.LeftEyefileName = "";
            }, function (err) {
                alertify.error(err.Messege);
            });
        }

    };
    $scope.updatecanvas = function (type, item, isTemplate, whichCat) {
        var RightId = item.RightPwCanvas;
        var LeftId = item.LeftPwCanvas;

        if (type === "Right") {
            item.RightEyeEdit = false;
            item.RightEyediv = false;
            var canvas = document.getElementById(RightId);
            var dataURL = canvas.toDataURL();
            S3URL = item.RightOrganDocUrl || "";
            object = {
                "USRId": $scope.UserId,
                "HospitalID": $scope.doctorinfo.hospitalID,
                "PatientID": $scope.cache.patientid,
                "PatientName": $scope.PatientData.FullName,
                "AppointmentID": $scope.cache.appointmentid,
                "CategoryID": item.CategoryId,
                "InvestigationID": item.InvestigationId,
                "OrganID": 1,
                "Base64": dataURL,
                "FileName": item.RightOrganDocUrl.substring(item.RightOrganDocUrl.lastIndexOf("/") + 1),
                "DocumentID": item.RightOrganDocId,
                "ContentType": item.ContentType,
                "S3URL": S3URL
            };
            eHnotePatientDataService.AddUpdatePatientInvestigationImage(object).then(function (resp) {
                var ind = -1;
                item.RightEye.ImagesArray.some(function (obj, i) {
                    return obj.DocumentId === item.RightOrganDocId ? ind = i : false;
                });
                var result = resp.data[0];
                item.RightEye.ImagesArray[ind] = result;
                item.RightOrganDocId = 0;
                item.thumbnailRightEye = "";
                item.RightEyeUndoCount = 0;
                $scope.RightEyefileName = "";
                alertify.success("Image Updated Successfully");
            }, function (err) {
                alertify.error(err.Messege);
            });
        }
        if (type === "Left") {
            item.LeftEyeEdit = false;
            item.LeftEyediv = false;
            var canvas = document.getElementById(LeftId);
            var dataURL = canvas.toDataURL();
            S3URL = item.LeftOrganDocUrl || "";
            object = {
                "USRId": $scope.UserId,
                "HospitalID": $scope.doctorinfo.hospitalID,
                "PatientID": $scope.cache.patientid,
                "PatientName": $scope.PatientData.FullName,
                "AppointmentID": $scope.cache.appointmentid,
                "CategoryID": item.CategoryId,
                "InvestigationID": item.InvestigationId,
                "OrganID": 2,
                "Base64": dataURL,
                "FileName": item.LeftOrganDocUrl.substring(item.LeftOrganDocUrl.lastIndexOf("/") + 1),
                "DocumentID": item.LeftOrganDocId,
                "ContentType": item.ContentType,
                "S3URL": S3URL
            };
            eHnotePatientDataService.AddUpdatePatientInvestigationImage(object).then(function (resp) {
                var ind = -1;
                item.LeftEye.ImagesArray.some(function (obj, i) {
                    return obj.DocumentId === item.LeftOrganDocId ? ind = i : false;
                });
                var result = resp.data[0];
                item.LeftEye.ImagesArray[ind] = result;
                item.LeftOrganDocId = 0;
                item.thumbnailLeftEye = "";
                item.LeftEyeUndoCount = 0;
                $scope.LeftEyefileName = "";
                alertify.success("Image Updated Successfully");
            }, function (err) {
                alertify.error(err.Messege);
            });
        }

    };
    $scope.EditImage = function (parentItem, childItem, type) {
        if (type === "Right") {
            $scope.RightEyefileName = childItem.DocURL.substring(childItem.DocURL.lastIndexOf("/") + 1);
            parentItem.RightOrganDocId = childItem.DocumentId;
            parentItem.RightOrganDocUrl = childItem.DocURL;
            $("#maineHnoteLoader").show();
            $scope.toDataURL(childItem.DocURL, function (dataURL) {
                parentItem.RightEyediv = true;
                parentItem.RightEyeEdit = true;
                parentItem.thumbnailRightEye = dataURL;
                $timeout(function () {
                    $("#maineHnoteLoader").hide();
                }, 200);
            });
            parentItem.RightEyeUndoCount = 0;
        }
        if (type === "Left") {
            $scope.LeftEyefileName = childItem.DocURL.substring(childItem.DocURL.lastIndexOf("/") + 1);
            parentItem.LeftOrganDocId = childItem.DocumentId;
            parentItem.LeftOrganDocUrl = childItem.DocURL;
            $("#maineHnoteLoader").show();
            $scope.toDataURL(childItem.DocURL, function (dataURL) {
                parentItem.LeftEyediv = true;
                parentItem.LeftEyeEdit = true;
                parentItem.thumbnailLeftEye = dataURL;
                $timeout(function () {
                    $("#maineHnoteLoader").hide();
                }, 200);
            });
            parentItem.LeftEyeUndoCount = 0;
        }
    };
    $scope.removeImage = function (subitem, type, DeleteIndicator, ParentItem) {
        object = {
            "AppointmentID": $scope.cache.appointmentid,
            "DeleteIndicator": DeleteIndicator,
            "HospitalID": $scope.doctorinfo.hospitalID,
            "ImagesArray": []
        };
        if (DeleteIndicator === 0) {//Single Image Deletion
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
                object.ImagesArray.push({ "DocumentID": subitem.DocumentId, "FileName": subitem.DocURL.substring(subitem.DocURL.lastIndexOf("/") + 1) });
                removeImage(subitem.DocumentId, type, object, ParentItem);
            }, function () {
                return;
            });
        }
    };
    function removeImage(docid, type, object, ParentItem) {
        eHnotePatientDataService.DeletePatientInvImg(object).then(function (resp) {
            if (resp.data.Status === "Success") {
                if (type !== "") {
                    var ind = -1;
                    if (type === "Right") {
                        ParentItem.RightEye.ImagesArray.some(function (obj, i) {
                            return obj.DocumentId === docid ? ind = i : false;
                        });
                        ParentItem.RightEye.ImagesArray.splice(ind, 1);
                        ParentItem.RightEyefileName = "";
                        ParentItem.RightOrganDocUrl = "";
                        ParentItem.thumbnailRightEye = "";
                        ParentItem.RightEyediv = false;
                        ParentItem.RightEyeUndoCount = 0;
                        ParentItem.RightEyeEdit = false;
                    }
                    if (type === "Left") {
                        ParentItem.LeftEye.ImagesArray.some(function (obj, i) {
                            return obj.DocumentId === docid ? ind = i : false;
                        });
                        ParentItem.LeftEye.ImagesArray.splice(ind, 1);
                        ParentItem.LeftEyefileName = "";
                        ParentItem.LeftOrganDocUrl = "";
                        ParentItem.thumbnailLeftEye = "";
                        ParentItem.LeftEyediv = false;
                        ParentItem.LeftEyeUndoCount = 0;
                        ParentItem.LeftEyeEdit = false;
                    }
                    alertify.success("Image Deleted Successfully");
                }
            }
        }, function (err) {
            alertify.error(err.Messege);
        });
    }
    $scope.ClearCanvas = function (type, Investigation) {
        if (type === "Right") {
            Investigation.RightEyediv = false;
            Investigation.RightEyeUndoCount = 0;
            Investigation.thumbnailRightEye = "";
            $scope.RightEyefileName = "";
            $scope.Investigation.RightEyeEdit = false;
        }
        if (type === "Left") {
            Investigation.LeftEyediv = false;
            Investigation.LeftEyeUndoCount = 0;
            Investigation.thumbnailLeftEye = "";
            $scope.LeftEyefileName = "";
            $scope.Investigation.LeftEyeEdit = false;
        }
    };
    $scope.onInvestigationSelect = function (obj, type) {
        if (type === "Right") {
            obj.RightEyeRemarks = obj.RightEyeRemarks.FindingValue;
        }
        if (type === "Left") {
            obj.LeftEyeRemarks = obj.LeftEyeRemarks.FindingValue;
        }
    };
}]);
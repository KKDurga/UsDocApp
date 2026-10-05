
eHnoteWebApp.controller('EhnotePopupImageManagementViewer', ['$scope', '$rootScope', '$filter', '$q', 'eHnoteMasterDataService', 'eHnoteCacheStorageService', 'eHnotePatientDataService', 'alertify', '$window', "$timeout", "$uibModal", "$uibModalInstance", "parentObj", "$sce", function ($scope, $rootScope, $filter, $q, eHnoteMasterDataService, eHnoteCacheStorageService, eHnotePatientDataService, alertify, $window, $timeout, $uibModal, $uibModalInstance, parentObj, $sce) {



    console.log(parentObj);
    $scope.selectedobjFiles = {
        "LeftEyeFiles": [],
        "RightEyeFiles": [],
        "AllFiles": []
    }


    $scope.selectedobjFiles.LeftEyeFiles = parentObj.LeftEyeFiles || [];
    $scope.selectedobjFiles.RightEyeFiles = parentObj.RightEyeFiles || [];

    $scope.uibclose = function () {
        $uibModalInstance.dismiss("cancel");
    };

    $scope.mainViewerObj = {
        "isODFullscreen": false,
        "isOSFullscreen": false,
        "isHalfScreen": false,
        "isGridScreen": false,
        "isShowCompareView": parentObj.isCompareViewShow || false,
        "ODs3url": parentObj.imgODObj.S3URL,
        "OSs3url": parentObj.imgOSObj.S3URL,
        "numDivs": 1,
        "PatientId": parentObj.PatientId,
        "AppointmentId": parentObj.AppointmentId,
        "PatientOrderId": parentObj.selectedImageStudyObj.PatientOrderId,
        "ModalityId": parentObj.selectedImageStudyObj.ModalityId,
        "InvestigationId": parentObj.selectedImageStudyObj.InvestigationId,
        "invSearchType": "3",
        "isRightDicomViewer": parentObj.showDicomViewer || false,
        "isLeftDicomViewer": false,
        "showSyncButton": false
    }

    console.log(parentObj.viewType);

    console.log(parentObj.selectedImageStudyObj.AllFiles);

    $scope.getOrderSearchReq = {
        "PatientId": $scope.mainViewerObj.PatientId,
        "SearchText": "",
        "PageSize": 50,
        "PageNumber": 1,
        "ModalityId": 0,
        "InvestigationId": 0
    };

    $scope.AllInvestigationsArray = [];

    $scope.OrdersObj = {
        "allinvestigations": [],
        "filteredinvestigations": []
    };

    $scope.getPatientOrderDetailsList = function (invid) {

        var investigationid = invid || 0;
        $scope.getOrderSearchReq.InvestigationId = investigationid || 0;
        console.log($scope.getOrderSearchReq);

        eHnotePatientDataService.GetPatientOrderInterpretationDetails($scope.getOrderSearchReq).then(function (resp) {

            console.log(resp);
            if (resp.data.rows.length > 0) {
                $scope.OrdersObj.allinvestigations = resp.data.rows || [];



                angular.forEach($scope.OrdersObj.allinvestigations, function (oitem, inddex) {
                    console.log(oitem.PatientOrderId + "__" + $scope.mainViewerObj.PatientOrderId);
                    if (oitem.PatientOrderId == $scope.mainViewerObj.PatientOrderId) {
                        $scope.OrdersObj.allinvestigations.splice(inddex, 1);
                    }
                });


                $scope.OrdersObj.filteredinvestigations = [];
                angular.forEach($scope.OrdersObj.allinvestigations, function (iitem) {
                    iitem.IsActive = false;
                    iitem.IsImagesAvailable = false;
                    iitem.PatientFiles = iitem.PatientFiles || [];
                    if (iitem.PatientFiles.length > 0) {
                        iitem.IsImagesAvailable = true;
                    }
                });


                if ($scope.OrdersObj.allinvestigations.length > 0) {
                    var filteredArray = $filter("filter")($scope.OrdersObj.allinvestigations, { "ProcedureId": $scope.mainViewerObj.InvestigationId }, true);
                    if (filteredArray.length > 0) {
                        $scope.OrdersObj.filteredinvestigations = filteredArray || [];
                    }

                }

                if (investigationid !== 0) {
                    angular.forEach($scope.OrdersObj.allinvestigations, function (kitem) {
                        angular.forEach(kitem.PatientFiles, function (nitem) {
                            $scope.selectedobjFiles.AllFiles.push(nitem);
                        });
                    });

                }
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    }

    if (parentObj.viewType == 'grid') {
        $scope.mainViewerObj.isGridScreen = true;

        if (parentObj.RightEyeFiles.length > 0) {
            $scope.selectedobjFiles.AllFiles = angular.copy(parentObj.RightEyeFiles) || [];

            angular.forEach($scope.selectedobjFiles.AllFiles, function (sitem) {
                sitem.S3URL = sitem.big;
            });
            
        }

        $scope.getPatientOrderDetailsList(parentObj.selectedImageStudyObj.InvestigationId);
    }
    else if (parentObj.viewType == 'single') {
        $scope.mainViewerObj.isHalfScreen = true;
        if (parentObj.Organ == 'OD') {
            $scope.mainViewerObj.isODFullscreen = true;
            $scope.mainViewerObj.numDivs = 1;
        } else {
            $scope.mainViewerObj.isOSFullscreen = true;
            $scope.mainViewerObj.numDivs = 1;
        }
    }
    else {
        $scope.mainViewerObj.isHalfScreen = true;
        $scope.mainViewerObj.isODFullscreen = true;
        $scope.mainViewerObj.isOSFullscreen = true;
        $scope.mainViewerObj.numDivs = 2;
    }


    $scope.showSingleOD = function () {
        $scope.mainViewerObj.isODFullscreen = true;
        $scope.mainViewerObj.isOSFullscreen = false;
        $scope.mainViewerObj.isHalfScreen = true;
        $scope.mainViewerObj.isGridScreen = false;
        $scope.mainViewerObj.numDivs = 1;

        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        canvasEl = document.getElementById("pODviewer");
        ctx = canvasEl.getContext('2d');
        $scope.optionsp.ctx = ctx;
        canvasSize = canvasEl.parentNode;
        ctx.canvas.width = canvasSize.clientWidth;
        ctx.canvas.height = canvasSize.clientHeight;
        resize = { height: canvasSize.clientHeight, width: canvasSize.clientWidth };


        $scope.optionsp.zoom.value = 1.0;
        $scope.optionsp.rotate.value = 0;
        curPos = { x: 0, y: 0 };
        picPos = { x: 0, y: 0 };
        reader = formatReader.CreateReader("image/jpeg").create($scope.mainViewerObj.ODs3url, $scope.optionsp, onloadODp, $q, $timeout);
        $timeout(function () {
            $scope.resizeTo('page');
        }, 1000);
    };

    $scope.showSingleOS = function () {
        $scope.mainViewerObj.isODFullscreen = false;
        $scope.mainViewerObj.isHalfScreen = true;
        $scope.mainViewerObj.isOSFullscreen = true;
        $scope.mainViewerObj.isGridScreen = false;
        $scope.mainViewerObj.numDivs = 1;

        ctxOS.clearRect(0, 0, canvasOSEl.width, canvasOSEl.height);
        canvasOSEl = document.getElementById("pOSviewer");
        ctxOS = canvasOSEl.getContext('2d');
        $scope.optionsOSp.ctx = ctxOS;
        canvasSizeOS = canvasOSEl.parentNode;
        ctxOS.canvas.width = canvasSizeOS.clientWidth;
        ctxOS.canvas.height = canvasSizeOS.clientHeight;
        resizeOS = { height: canvasSizeOS.clientHeight, width: canvasSizeOS.clientWidth };
        $scope.optionsOSp.zoom.value = 1.0;
        $scope.optionsOSp.rotate.value = 0;
        curPosOS = { x: 0, y: 0 };
        picPosOS = { x: 0, y: 0 };
        readerOS = formatReader.CreateReader("image/jpeg").create($scope.mainViewerObj.OSs3url, $scope.optionsOSp, onloadOSp, $q, $timeout);
        $timeout(function () {
            $scope.resizeToOS('page');
        }, 1000);
    }

    $scope.showMultipleIimages = function () {
        $scope.mainViewerObj.isODFullscreen = true;
        $scope.mainViewerObj.isOSFullscreen = true;
        $scope.mainViewerObj.isHalfScreen = true;
        $scope.mainViewerObj.isGridScreen = false;
        $scope.mainViewerObj.numDivs = 2;



        canvasEl = document.getElementById("pODviewer");
        ctx = canvasEl.getContext('2d');
        $scope.optionsp.ctx = ctx;
        canvasSize = canvasEl.parentNode;
        ctx.canvas.width = canvasSize.clientWidth;
        ctx.canvas.height = canvasSize.clientHeight;
        resize = { height: canvasSize.clientHeight, width: canvasSize.clientWidth };


        $scope.optionsp.zoom.value = 1.0;
        $scope.optionsp.rotate.value = 0;
        curPos = { x: 0, y: 0 };
        picPos = { x: 0, y: 0 };
        reader = formatReader.CreateReader("image/jpeg").create($scope.mainViewerObj.ODs3url, $scope.optionsp, onloadODp, $q, $timeout);

        canvasOSEl = document.getElementById("pOSviewer");
        ctxOS = canvasOSEl.getContext('2d');
        $scope.optionsOSp.ctx = ctxOS;
        canvasSizeOS = canvasOSEl.parentNode;
        ctxOS.canvas.width = canvasSizeOS.clientWidth;
        ctxOS.canvas.height = canvasSizeOS.clientHeight;
        resizeOS = { height: canvasSizeOS.clientHeight, width: canvasSizeOS.clientWidth };
        $scope.optionsOSp.zoom.value = 1.0;
        $scope.optionsOSp.rotate.value = 0;
        curPosOS = { x: 0, y: 0 };
        picPosOS = { x: 0, y: 0 };
        readerOS = formatReader.CreateReader("image/jpeg").create($scope.mainViewerObj.OSs3url, $scope.optionsOSp, onloadOSp, $q, $timeout);

        $timeout(function () {
            $scope.resizeToOS('page');
            $scope.resizeTo('page');
        }, 1000);
    }
    $scope.showGridIimages = function () {
        $scope.mainViewerObj.isODFullscreen = false;
        $scope.mainViewerObj.isOSFullscreen = false;
        $scope.mainViewerObj.isHalfScreen = false;
        $scope.mainViewerObj.isGridScreen = true;
        $scope.mainViewerObj.numDivs = 1;
    }




    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    var doctorinfo = eHnoteMasterDataService.getUserInfo();


    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
        $scope.hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    }


    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    $scope.cacheStorageItem.appointmentid = $scope.cacheStorageItem.appointmentid || 0;



    $scope.UserId = eHnoteMasterDataService.getLoginId();


    $scope.PatientId = appointmentinfo.PatientID;
    $scope.PatientName = appointmentinfo.PatientName || "";
    $scope.AppointmentDate = appointmentinfo.ConsultationDt || $filter("date")(new Date(), "yyyy-MM-dd");

    $scope.AppointmentId = appointmentinfo.AppointmentID ? appointmentinfo.AppointmentID : $scope.cacheStorageItem.appointmentid;



    $scope.ODImgObj = {
        "Index": 0,
        "S3URL": "",
        "DocumentId": "",
        "wrapper": "",
        "viewer": "",
        "total": "",
        "curSpan": "",
        "isDicomFile": false,
        "IsImage": false,
        "IsDicom": false,
        "IsPdf": false,
        "IsTiff": false
    }

    $scope.OSImgObj = {
        "Index": 0,
        "S3URL": "",
        "DocumentId": "",
        "wrapper": "",
        "viewer": "",
        "total": "",
        "curSpan": "",
        "isDicomFile": false,
        "IsImage": false,
        "IsDicom": false,
        "IsPdf": false,
        "IsTiff": false
    }


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
            picPosX = centerX - (reader.width * $scope.optionsp.zoom.value) / 2;
            picPosY = centerY - (reader.height * $scope.optionsp.zoom.value) / 2;
        } else {
            picPosX = centerX - (reader.width * $scope.optionsp.zoom.value) / 2;
        }

        curPos = { x: picPosX, y: picPosY };
        picPos = { x: picPosX, y: picPosY };
    }






    var centerPicsOS = function () {
        // Updates canvas size before centering
        ctxOS.canvas.width = canvasSizeOS.clientWidth;
        ctxOS.canvas.height = canvasSizeOS.clientHeight;
        // Position to canvas center
        var centerX = ctxOS.canvas.width / 2;
        var centerY;
        var picPosX = 0;
        var picPosY = 0;

        if (readerOS.isImage) {
            centerY = ctxOS.canvas.height / 2;
            picPosX = centerX - (readerOS.width * $scope.optionsOSp.zoom.value) / 2;
            picPosY = centerY - (readerOS.height * $scope.optionsOSp.zoom.value) / 2;
        } else {
            picPosX = centerX - (readerOS.width * $scope.optionsOSp.zoom.value) / 2;
        }

        curPosOS = { x: picPosX, y: picPosY };
        picPosOS = { x: picPosX, y: picPosY };
    };

    $scope.isDrawingOD = false;
    $scope.isDrawingOS = false;
    var penSize = 5; // Default pen size
    var penColor = '#000000'; // Default pen color

    $uibModalInstance.rendered.then(function () {
        $scope.optionsp = {
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

        canvasEl = document.getElementById("pODviewer");
        ctx = canvasEl.getContext('2d');
        $scope.optionsp.ctx = ctx;
        canvasSize = canvasEl.parentNode;
        ctx.canvas.width = canvasSize.clientWidth;
        ctx.canvas.height = canvasSize.clientHeight;
        resize = { height: canvasSize.clientHeight, width: canvasSize.clientWidth };


        $scope.optionsp.zoom.value = 1.0;
        $scope.optionsp.rotate.value = 0;
        curPos = { x: 0, y: 0 };
        picPos = { x: 0, y: 0 };







        $scope.optionsOSp = {
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


        canvasOSEl = document.getElementById("pOSviewer");
        ctxOS = canvasOSEl.getContext('2d');
        $scope.optionsOSp.ctx = ctxOS;
        canvasSizeOS = canvasOSEl.parentNode;
        ctxOS.canvas.width = canvasSizeOS.clientWidth;
        ctxOS.canvas.height = canvasSizeOS.clientHeight;
        resizeOS = { height: canvasSizeOS.clientHeight, width: canvasSizeOS.clientWidth };
        $scope.optionsOSp.zoom.value = 1.0;
        $scope.optionsOSp.rotate.value = 0;
        curPosOS = { x: 0, y: 0 };
        picPosOS = { x: 0, y: 0 };




        //$timeout(function () {
        //    $scope.resizeTo('page');
        //    $scope.resizeToOS('page');
        //}, 1000);
















        function onloadOSp() {
            if (readerOS == null) {
                return;
            }

            if (readerOS.rendered) {
                centerPicsOS();
                applyTransformOS();
            } else {
                $scope.resizeToOS($scope.optionsOSp.controls.fit);
            }
        }


        $scope.resizeToOS = function (value) {
            if ((ctxOS.canvas == null) || (readerOS == null)) {
                return;
            }

            // Updates canvas size, to guarantee that zoom value is not computed as zero
            ctxOS.canvas.width = canvasSizeOS.clientWidth;
            ctxOS.canvas.height = canvasSizeOS.clientHeight;
            // Compute page ratio
            var options = $scope.optionsOSp;
            var ratioH = ctxOS.canvas.height / readerOS.height;
            var ratioW = ctxOS.canvas.width / readerOS.width;
            // If readerOS render zoom itself
            // Precompute from its ratio
            if (!readerOS.isZoom) {
                ratioH *= $scope.optionsOSp.zoom.value;
                ratioW *= $scope.optionsOSp.zoom.value;
            }
            // Adjust value
            switch (value) {
                case 'width': $scope.optionsOSp.zoom.value = ratioW; break;
                case 'height': $scope.optionsOSp.zoom.value = ratioH; break;
                case 'auto': $scope.optionsOSp.zoom.value = Math.min(ratioH, ratioW, 1); break;
                case 'page':
                default: $scope.optionsOSp.zoom.value = Math.min(ratioH, ratioW);
            }
            $scope.$applyAsync(function () {
                // Round zoom value
                $scope.optionsOSp.zoom.value = Math.round($scope.optionsOSp.zoom.value * 100) / 100;
                // Update options state
                $scope.optionsOSp.controls.fit = value;
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

        function onMouseWheelMove($event) {
            var event = $window.event || $event; // old IE support
            var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
            if ($scope.optionsp.controls.filmStrip) {
                picPos.y += 50 * delta;
                // Limit range
                if (picPos.y > 15) {
                    picPos.y = 15;
                }
                if (reader.images) {
                    if (picPos.y - reader.height * $scope.optionsp.zoom.value < -(reader.height + 15) * reader.images.length * $scope.optionsp.zoom.value) {
                        picPos.y = -(reader.height + 15) * reader.images.length + reader.height;
                    }
                } else {
                    if (picPos.y - reader.height * $scope.optionsp.zoom.value < -reader.height * $scope.optionsp.zoom.value) {
                        picPos.y = -reader.height * $scope.optionsp.zoom.value;
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

        // Resize canvas function
        function resizeCanvas() {
            $scope.$applyAsync(function () {
                var canvasSize = canvasEl.parentNode;
                ctx.canvas.width = canvasSize.clientWidth;
                ctx.canvas.height = canvasSize.clientHeight;
                applyTransform();
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

        // Initialization code or any other setup


        function applyTransform() {

            console.log(reader);
            if (reader == null) {
                return;
            }
            if (!reader.rendered) {
                return;
            }


            console.log("init called");
            var options = $scope.optionsp;
            var canvas = ctx.canvas;
            var centerX = reader.width * options.zoom.value / 2;
            var centerY = reader.height * options.zoom.value / 2;
            // Clean before draw
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Save context
            ctx.save();
            // move to mouse position
            ctx.translate((picPos.x + centerX), (picPos.y + centerY));
            // Rotate canvas
            ctx.rotate(options.rotate.value * Math.PI / 180);
            // Go back
            ctx.translate(- centerX, - centerY);
            // Change scale
            if (reader.isZoom)
                ctx.scale(options.zoom.value, options.zoom.value);
            if ((!options.controls.filmStrip) || (options.controls.totalPage == 1)) {
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
                    ctx.rotate(options.rotate.value * Math.PI / 180);
                    // Go back
                    ctx.translate(- centerX, - centerY);
                    // Change scale
                    ctx.scale(options.zoom.value, options.zoom.value);
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
        $scope.resizeTo = function (value) {

            console.log("resize called");
            if ((ctx.canvas == null) || (reader == null)) {
                return;
            }

            // Updates canvas size, to guarantee that zoom value is not computed as zero
            ctx.canvas.width = canvasSize.clientWidth;
            ctx.canvas.height = canvasSize.clientHeight;
            // Compute page ratio
            var options = $scope.optionsp;
            var ratioH = ctx.canvas.height / reader.height;
            var ratioW = ctx.canvas.width / reader.width;
            // If reader render zoom itself
            // Precompute from its ratio
            if (!reader.isZoom) {
                ratioH *= $scope.optionsp.zoom.value;
                ratioW *= $scope.optionsp.zoom.value;
            }
            // Adjust value
            switch (value) {
                case 'width': $scope.optionsp.zoom.value = ratioW; break;
                case 'height': $scope.optionsp.zoom.value = ratioH; break;
                case 'auto': $scope.optionsp.zoom.value = Math.min(ratioH, ratioW, 1); break;
                case 'page':
                default: $scope.optionsp.zoom.value = Math.min(ratioH, ratioW);
            }
            $scope.$applyAsync(function () {
                // Round zoom value
                $scope.optionsp.zoom.value = Math.round($scope.optionsp.zoom.value * 100) / 100;
                // Update options state
                $scope.optionsp.controls.fit = value;
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
        function onloadODp() {
            if (reader == null) {
                return;
            }

            if (reader.rendered) {
                centerPics();
                applyTransform();
            } else {
                $scope.resizeTo($scope.optionsp.controls.fit);
            }
        }



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

        $scope.$watch('optionsp.zoom.value', function () {
            if (!$scope.optionsp.controls.disableZoom) {
                applyTransform();
            }
        });

        $scope.$watch('optionsp.rotate.value', function () {
            if (!$scope.optionsp.controls.disableRotate) {
                applyTransform();
            }
        });

        $scope.$watch('optionsp.controls.fit', function (value) {
            $scope.resizeTo(value);
        });



        // Watch for changes in parent element size
        $scope.$watch(parentChange, function () {
            resizeCanvas();
        }, true);



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
                if ($scope.optionsp.controls.disableMove) {
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
                if ($scope.optionsp.controls.disableMove) {
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
                    ctx.strokeStyle = penColor; // Set pen color
                    ctx.stroke();
                }

            } else {
                mousePos.x = $event.offsetX;
                mousePos.y = $event.offsetY;
                if ($scope.optionsp.controls.disableMove) {
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
                    if ($scope.optionsOSp.controls.disableMove) {
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

                if ($scope.optionsOSp.controls.disableMove) {
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
                if ($scope.optionsOSp.controls.disableMove) {
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
                    ctxOS.strokeStyle = penColor; // Set pen color
                    ctxOS.stroke();
                }
            }
            else {
                mousePosOS.x = $event.offsetX;
                mousePosOS.y = $event.offsetY;
                if ($scope.optionsOSp.controls.disableMove) {
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
                    if ($scope.optionsp.controls.disableMove) {
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

        $scope.$watch('optionsOSp.zoom.value', function () {
            if (!$scope.optionsOSp.controls.disableZoom) {
                applyTransformOS();
            }
        });

        $scope.$watch('optionsOSp.rotate.value', function () {
            if (!$scope.optionsOSp.controls.disableRotate) {
                applyTransform();
            }
        });

        $scope.$watch('optionsOSp.controls.fit', function (value) {
            $scope.resizeToOS(value);
        });

        // Watch for changes in parent element size
        $scope.$watch(parentChangeOS, function () {
            resizeCanvasOS();
        }, true);






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

                            const resetLayoutButton = document.getElementById('resetlayoutpOD');
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


            var dwvElementOD = document.getElementById("dwvpOD");
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

            const resetLayoutButton = document.getElementById('resetlayoutpOD');
            resetLayoutButton.addEventListener('click', function () {
                _app.resetLayout();
            });



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

            /*   var s3url = "https://ehnotedevstorage.blob.core.windows.net/dev/3/0002.DCM";*/
            var array = ['https://ehnotedevstorage.blob.core.windows.net/dev/3/0002.DCM']
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
            const root = document.getElementById('dwvpOD');
            root.appendChild(layerDiv);
        }

        function prepareAndGetSimpleDataViewConfig() {
            console.log("prepare called");
            // clean up
            const dwvDiv = document.getElementById('dwvpOD');
            dwvDiv.innerHTML = '';
            // add div
            addLayerGroup('layerGroupAOD');
            return { '*': [{ divId: 'layerGroupAOD' }] };
        }


        function prepareAndGetMPRDataViewConfig() {
            // clean up
            const dwvDiv = document.getElementById('dwvpOD');
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
            const toolsDiv = document.getElementById('toolspOD');
            var element = angular.element(document.getElementById('toolspOD'));
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
                input.id = 'toolpOD-' + i;
                input.name = 'toolspOD';
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
            const toolsInput = document.getElementsByName('toolspOD');
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
        let _toolspOS = null;


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
            _toolspOS = {
                Scroll: {},
                WindowLevel: {},
                ZoomAndPan: {},
                Opacity: {}
            };

            // app config
            const optionsOS = new dwv.AppOptions(dataViewConfigsOS);
            optionsOS.tools = _toolspOS;
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


                            const resetLayoutButton = document.getElementById('resetlayoutpOS');
                            resetLayoutButton.disabled = false;
                        }
                    }
                }

                if (event.loadtype === 'image' &&
                    typeof _appOS.getMetaData(event.loadid)['00080060'] !== 'undefined' &&
                    _appOS.getMetaData(event.loadid)['00080060'].value[0] === 'SEG') {
                    // log SEG details
                    logFramePosPatsOS(_appOS.getMetaData(event.loadid));

                    // example usage of a dicom SEG as data mask
                    const useSegAsMaskOS = false;
                    if (useSegAsMaskOS) {
                        // image to filter
                        const imgDataIndex = 0;
                        const vls = _appOS.getViewLayersByDataIndex(imgDataIndex);
                        const vc = vls[0].getViewController();
                        const img = _appOS.getImage(imgDataIndex);
                        const imgGeometry = img.getGeometry();
                        const sliceSize = imgGeometry.getSize().getDimSize(2);
                        // SEG image
                        const segImage = _appOS.getImage(event.loadid);
                        // calculate slice difference
                        const segOrigin0 = segImage.getGeometry().getOrigins()[0];
                        const segOrigin0Point = new dwv.Point([
                            segOrigin0.getX(), segOrigin0.getY(), segOrigin0.getZ()
                        ]);
                        const segOriginIndex = imgGeometry.worldToIndex(segOrigin0Point);
                        const indexOffset = segOriginIndex.get(2) * sliceSize;
                        // set alpha function
                        vc.setViewAlphaFunction(function (value, index) {
                            // multiply by 3 since SEG is RGB
                            const segIndex = 3 * (index - indexOffset);
                            if (segIndex >= 0 &&
                                segImage.getValueAtOffset(segIndex) === 0 &&
                                segImage.getValueAtOffset(segIndex + 1) === 0 &&
                                segImage.getValueAtOffset(segIndex + 2) === 0) {
                                return 0;
                            } else {
                                return 0xff;
                            }
                        });
                    }
                }
            });

            var dwvElementOS = document.getElementById("dwvpOS");
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


            const resetLayoutButton = document.getElementById('resetlayoutpOS');
            resetLayoutButton.addEventListener('click', function () {
                _appOS.resetLayout();
            });



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
            const root = document.getElementById('dwvpOS');
            root.appendChild(layerDiv);
        }

        function prepareAndGetSimpleDataViewConfigOS() {
            // clean up
            const dwvDiv = document.getElementById('dwvpOS');
            dwvDiv.innerHTML = '';
            // add div
            addLayerGroupOS('layerGroupAOS');
            return { '*': [{ divId: 'layerGroupAOS' }] };
        }


        function prepareAndGetMPRDataViewConfigOS() {
            // clean up
            const dwvDiv = document.getElementById('dwvpOS');
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
            const toolsDiv = document.getElementById('toolspOS');
            var element = angular.element(document.getElementById('toolspOS'));
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
                input.id = 'toolpOS-' + i;
                input.name = 'toolspOS';
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
            const toolsInput = document.getElementsByName('toolspOS');
            let toolIndex = null;
            for (let j = 0; j < toolsInput.length; ++j) {
                if (toolsInput[j].checked) {
                    toolIndex = j;
                    break;
                }
            }
            return Object.keys(_toolspOS)[toolIndex];
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






        $scope.clickonParticularImage = function (obj, index) {
            $scope.ODImgObj.Index = index;
            $scope.ODImgObj.S3URL = obj.small;
            $scope.ODImgObj.DocumentId = obj.DocumentId;
            $scope.ODImgObj.isDicomFile = obj.isDicomFile;
            angular.forEach($scope.selectedobjFiles.RightEyeFiles, function (sitem) {
                sitem.isActive = false;
            });
            obj.isActive = true;


            $scope.ODImgObj.IsImage = false;
            $scope.ODImgObj.IsPdf = false;
            $scope.ODImgObj.IsDicom = false;
            $scope.ODImgObj.IsTiff = false;

            console.log(obj.FileType + "__FileType");

            if (obj.FileType == "image/jpeg" || obj.FileType == "image/png" || obj.FileType == "image/jpg" || obj.FileType == "jpg" || obj.FileType == "jpeg" || obj.FileType == "png") {
                $scope.ODImgObj.IsImage = true;
            }
            else if (obj.FileType == "application/pdf" || obj.FileType == "application/Pdf" || obj.FileType == "pdf") {
                $scope.ODImgObj.IsPdf = true;
            }
            else if (obj.FileType == "image/tiff" || obj.FileType == "image/TIFF" || obj.FileType == "tiff") {
                $scope.ODImgObj.IsTiff = true;
            }
            else if (obj.FileType == "DCM") {
                $scope.ODImgObj.IsDicom = true;
            }



            $scope.mainViewerObj.ODs3url = obj.small;

            if ($scope.ODImgObj.IsPdf) {

                $scope.getTrustedUrl = function (url) {

                    var modifiedUrl = url;
                    return $sce.trustAsResourceUrl(modifiedUrl);
                };
            }
            else if ($scope.ODImgObj.isDicomFile) {
                onDOMContentLoaded();
                var array = [];
                array.push($scope.ODImgObj.S3URL);
                _app.loadURLs(array);
            } else {
                $scope.optionsp.zoom.value = 1.0;
                $scope.optionsp.rotate.value = 0;
                curPos = { x: 0, y: 0 };
                picPos = { x: 0, y: 0 };
                reader = formatReader.CreateReader("image/jpeg").create($scope.mainViewerObj.ODs3url, $scope.optionsp, onloadODp, $q, $timeout);
                // applyTransform();
                $timeout(function () {
                    $scope.resizeTo('page');
                }, 1000);
            }
            $scope.checkSyncButton();
        }

        $scope.clickonRParticularImage = function (obj, index) {
            $scope.OSImgObj.Index = index;
            $scope.OSImgObj.S3URL = obj.small;
            $scope.OSImgObj.DocumentId = obj.DocumentId;
            $scope.OSImgObj.isDicomFile = obj.isDicomFile;
            angular.forEach($scope.selectedobjFiles.LeftEyeFiles, function (sitem) {
                sitem.isActive = false;
            });
            obj.isActive = true;
            $scope.OSImgObj.IsImage = false;
            $scope.OSImgObj.IsPdf = false;
            $scope.OSImgObj.IsDicom = false;
            $scope.OSImgObj.IsTiff = false;

            console.log(obj.FileType + "__FileType");

            if (obj.FileType == "image/jpeg" || obj.FileType == "image/png" || obj.FileType == "image/jpg" || obj.FileType == "jpg" || obj.FileType == "jpeg" || obj.FileType == "png") {
                $scope.OSImgObj.IsImage = true;

            }
            else if (obj.FileType == "application/pdf" || obj.FileType == "application/Pdf" || obj.FileType == "pdf") {
                $scope.OSImgObj.IsPdf = true;
            }
            else if (obj.FileType == "image/tiff" || obj.FileType == "image/TIFF" || obj.FileType == "tiff") {
                $scope.OSImgObj.IsTiff = true;
            }
            else if (obj.FileType == "DCM") {
                $scope.OSImgObj.IsDicom = true;
            }
            $scope.mainViewerObj.OSs3url = obj.small;
            $scope.mainViewerObj.isLeftDicomViewer = false;

            if ($scope.OSImgObj.IsPdf) {

                $scope.getTrustedUrl = function (url) {

                    var modifiedUrl = url;
                    return $sce.trustAsResourceUrl(modifiedUrl);
                };
            }
            else if ($scope.OSImgObj.isDicomFile) {
                onDOMContentLoadedOS();
                var array = [];
                array.push($scope.OSImgObj.S3URL);
                _appOS.loadURLs(array);
                $scope.mainViewerObj.isLeftDicomViewer = true;
            } else {
                $scope.optionsOSp.zoom.value = 1.0;
                $scope.optionsOSp.rotate.value = 0;
                curPosOS = { x: 0, y: 0 };
                picPosOS = { x: 0, y: 0 };
                readerOS = formatReader.CreateReader("image/jpeg").create($scope.mainViewerObj.OSs3url, $scope.optionsOSp, onloadOSp, $q, $timeout);

                $timeout(function () {
                    $scope.resizeTo('page');
                    $scope.resizeToOS('page');
                }, 1000);
            }
            $scope.checkSyncButton();
        };

        $scope.checkSyncButton = function () {
            $scope.mainViewerObj.showSyncButton = true;
            if ($scope.ODImgObj.isDicomFile || $scope.OSImgObj.isDicomFile) {
                $scope.mainViewerObj.showSyncButton = false;
            }
        }



        if ($scope.selectedobjFiles.RightEyeFiles.length > 0) {

            var filteredArray = $filter("filter")($scope.selectedobjFiles.RightEyeFiles, { "DocumentId": parentObj.imgODObj.DocumentId }, true) || [];
            $scope.clickonParticularImage(filteredArray[0]);
        }


        if ($scope.selectedobjFiles.LeftEyeFiles.length > 0) {
            var filteredArray = $filter("filter")($scope.selectedobjFiles.LeftEyeFiles, { "DocumentId": parentObj.imgOSObj.DocumentId }, true) || [];
            $scope.clickonRParticularImage(filteredArray[0]);
        }

    });











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
                oldWidth = reader.width * $scope.optionsp.zoom.value;
                oldHeight = reader.height * $scope.optionsp.zoom.value;
            }

            // Compute new zoom
            $scope.optionsp.zoom.value += $scope.optionsp.zoom.step * direction;
            // Round
            $scope.optionsp.zoom.value = Math.round($scope.optionsp.zoom.value * 100) / 100;
            if ($scope.optionsp.zoom.value >= $scope.optionsp.zoom.max) {
                $scope.optionsp.zoom.value = $scope.optionsp.zoom.max;
            }
            if ($scope.optionsp.zoom.value <= $scope.optionsp.zoom.min) {
                $scope.optionsp.zoom.value = $scope.optionsp.zoom.min;
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
                newWidth = reader.width * $scope.optionsp.zoom.value;
                newHeight = reader.height * $scope.optionsp.zoom.value;
            }
            // new image position after zoom
            picPos.x = picPos.x - (newWidth - oldWidth) / 2;
            picPos.y = picPos.y - (newHeight - oldHeight) / 2;
        });
    };

    // Rotate function
    $scope.rotate = function (direction) {
        $scope.$applyAsync(function () {
            $scope.optionsp.rotate.value += $scope.optionsp.rotate.step * direction;
            if (($scope.optionsp.rotate.value <= -360) || ($scope.optionsp.rotate.value >= 360)) {
                $scope.optionsp.rotate.value = 0;
            }
            applyTransform();
        });
    };



    // Play function
    $scope.play = function () {
        if ($scope.optionsp.adsrc != null) {
            $scope.optionsp.adsrc.start(0);
        }
    }

    // Stop function
    $scope.stop = function () {
        if ($scope.optionsp.adsrc != null) {
            $scope.optionsp.adsrc.stop(0);
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



        if ($scope.optionsOSp.controls.filmStrip) {
            picPosOS.y += 50 * delta;
            // Limit range
            if (picPosOS.y > 15) {
                picPosOS.y = 15;
            }
            if (readerOS.images) {
                if (picPosOS.y - readerOS.height * $scope.optionsOSp.zoom.value < -(readerOS.height + 15) * readerOS.images.length * $scope.optionsOSp.zoom.value) {
                    picPosOS.y = -(readerOS.height + 15) * readerOS.images.length + readerOS.height;
                }
            } else {
                if (picPosOS.y - readerOS.height * $scope.optionsOSp.zoom.value < -readerOS.height * $scope.optionsOSp.zoom.value) {
                    picPosOS.y = -readerOS.height * $scope.optionsOSp.zoom.value;
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
                oldWidth = readerOS.width * $scope.optionsOSp.zoom.value;
                oldHeight = readerOS.height * $scope.optionsOSp.zoom.value;
            }

            // Compute new zoom
            $scope.optionsOSp.zoom.value += $scope.optionsOSp.zoom.step * direction;
            // Round
            $scope.optionsOSp.zoom.value = Math.round($scope.optionsOSp.zoom.value * 100) / 100;
            if ($scope.optionsOSp.zoom.value >= $scope.optionsOSp.zoom.max) {
                $scope.optionsOSp.zoom.value = $scope.optionsOSp.zoom.max;
            }
            if ($scope.optionsOSp.zoom.value <= $scope.optionsOSp.zoom.min) {
                $scope.optionsOSp.zoom.value = $scope.optionsOSp.zoom.min;
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
                newWidth = readerOS.width * $scope.optionsOSp.zoom.value;
                newHeight = readerOS.height * $scope.optionsOSp.zoom.value;
            }
            // new image position after zoom
            picPosOS.x = picPosOS.x - (newWidth - oldWidth) / 2;
            picPosOS.y = picPosOS.y - (newHeight - oldHeight) / 2;
        });
    };

    // Rotate function
    $scope.rotateOS = function (direction) {
        $scope.$applyAsync(function () {
            $scope.optionsOSp.rotate.value += $scope.optionsOSp.rotate.step * direction;
            if (($scope.optionsOSp.rotate.value <= -360) || ($scope.optionsOSp.rotate.value >= 360)) {
                $scope.optionsOSp.rotate.value = 0;
            }
            applyTransformOS();
        });
    };

    // Resize canvas function
    function resizeCanvasOS() {
        $scope.$applyAsync(function () {
            var canvasSizeOS = canvasOSEl.parentNode;
            ctxOS.canvas.width = canvasSizeOS.clientWidth;
            ctxOS.canvas.height = canvasSizeOS.clientHeight;
            applyTransformOS();
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
        if ($scope.optionsOSp.adsrc != null) {
            $scope.optionsOSp.adsrc.start(0);
        }
    }

    // Stop function
    $scope.stopOS = function () {
        if ($scope.optionsOSp.adsrc != null) {
            $scope.optionsOSp.adsrc.stop(0);
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



        var options = $scope.optionsOSp;
        var canvas = ctxOS.canvas;
        var centerX = readerOS.width * options.zoom.value / 2;
        var centerY = readerOS.height * options.zoom.value / 2;
        // Clean before draw
        ctxOS.clearRect(0, 0, canvas.width, canvas.height);
        // Save context
        ctxOS.save();
        // move to mouse position
        ctxOS.translate((picPosOS.x + centerX), (picPosOS.y + centerY));
        // Rotate canvas
        ctxOS.rotate(options.rotate.value * Math.PI / 180);
        // Go back
        ctxOS.translate(- centerX, - centerY);
        // Change scale
        if (readerOS.isZoom)
            ctxOS.scale(options.zoom.value, options.zoom.value);
        if ((!options.controls.filmStrip) || (options.controls.totalPage == 1)) {
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
                ctxOS.putImageData(readerOS.data, picPos.x, picPos.y);
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
                    ctxOS.putImageData(data, picPos.x, picPos.y + offsetY);
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
                ctxOS.translate((picPosOS.x + centerX), (picPosOS.y + centerY));
                // Rotate canvas
                ctxOS.rotate(options.rotate.value * Math.PI / 180);
                // Go back
                ctxOS.translate(- centerX, - centerY);
                // Change scale
                ctxOS.scale(options.zoom.value, options.zoom.value);
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
        if (organ == "OD") {

            console.log($scope.OSImgObj);
            angular.forEach($scope.selectedobjFiles.LeftEyeFiles, function (sitem, index) {
                var obj = {
                    "big": sitem.small,
                    "small": sitem.small,
                    "OrganId": sitem.OrganId,
                    "DocumentId": sitem.DocumentId,
                    "FileType": sitem.DocumentExt,
                    "isActive": false
                }
                $scope.selectedobjFiles.RightEyeFiles.push(obj);
                $scope.selectedobjFiles.LeftEyeFiles.splice($scope.OSImgObj.Index, 1);
            });

            $scope.clickonParticularImage($scope.selectedobjFiles.RightEyeFiles[0]);
            $scope.clickonRParticularImage($scope.selectedobjFiles.LeftEyeFiles[0]);
        }

        if (organ == "OS") {

            console.log($scope.ODImgObj);

            angular.forEach($scope.selectedobjFiles.RightEyeFiles, function (sitem, index) {
                var obj = {
                    "big": sitem.small,
                    "small": sitem.small,
                    "OrganId": sitem.OrganId,
                    "DocumentId": sitem.DocumentId,
                    "FileType": sitem.DocumentExt,
                    "isActive": false,
                    "isDicomFile": sitem.isDicomFile || false
                }
                $scope.selectedobjFiles.LeftEyeFiles.push(obj);
                $scope.selectedobjFiles.RightEyeFiles.splice($scope.ODImgObj.Index, 1);
            });
            $scope.clickonParticularImage($scope.selectedobjFiles.RightEyeFiles[0]);
            $scope.clickonRParticularImage($scope.selectedobjFiles.LeftEyeFiles[0]);
        }
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
    function clearapplyTransform() {

        console.log(reader);
        if (reader == null) {
            return;
        }



        console.log("init called");
        var options = $scope.optionsp;
        var canvas = ctx.canvas;
        var centerX = reader.width * options.zoom.value / 2;
        var centerY = reader.height * options.zoom.value / 2;
        // Clean before draw
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Save context
        ctx.save();
        // move to mouse position
        ctx.translate((picPos.x + centerX), (picPos.y + centerY));
        // Rotate canvas
        ctx.rotate(options.rotate.value * Math.PI / 180);
        // Go back
        ctx.translate(- centerX, - centerY);
        // Change scale
        if (reader.isZoom)
            ctx.scale(options.zoom.value, options.zoom.value);
        if ((!options.controls.filmStrip) || (options.controls.totalPage == 1)) {
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
                ctx.rotate(options.rotate.value * Math.PI / 180);
                // Go back
                ctx.translate(- centerX, - centerY);
                // Change scale
                ctx.scale(options.zoom.value, options.zoom.value);
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

    function clearapplyTransformOS() {
        console.log("apply called");
        if (readerOS == null) {
            return;
        }
        if (!readerOS.rendered) {
            return;
        }



        var options = $scope.optionsOSp;
        var canvas = ctxOS.canvas;
        var centerX = readerOS.width * options.zoom.value / 2;
        var centerY = readerOS.height * options.zoom.value / 2;
        // Clean before draw
        ctxOS.clearRect(0, 0, canvas.width, canvas.height);
        // Save context
        ctxOS.save();
        // move to mouse position
        ctxOS.translate((picPosOS.x + centerX), (picPosOS.y + centerY));
        // Rotate canvas
        ctxOS.rotate(options.rotate.value * Math.PI / 180);
        // Go back
        ctxOS.translate(- centerX, - centerY);
        // Change scale
        if (readerOS.isZoom)
            ctxOS.scale(options.zoom.value, options.zoom.value);
        if ((!options.controls.filmStrip) || (options.controls.totalPage == 1)) {
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
                ctxOS.putImageData(readerOS.data, picPos.x, picPos.y);
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
                    ctxOS.putImageData(data, picPos.x, picPos.y + offsetY);
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
                ctxOS.translate((picPosOS.x + centerX), (picPosOS.y + centerY));
                // Rotate canvas
                ctxOS.rotate(options.rotate.value * Math.PI / 180);
                // Go back
                ctxOS.translate(- centerX, - centerY);
                // Change scale
                ctxOS.scale(options.zoom.value, options.zoom.value);
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
    $scope.clearDrawing = function (organ) {
        if (organ == 'OD') {
            clearapplyTransform();
        }
        if (organ == 'OS') {
            clearapplyTransformOS();
        }
    };


    $scope.saveCanvasDrawingDetails = function (organ) {


        var canvass = null; var dataURL = "";
        var organId = 0;
        var docId = 0;
        var s3url = "";
        var filename = "";
        if (organ == "OD") {
            canvass = document.getElementById("pODviewer");
            dataURL = canvass.toDataURL();
            organId = 1;
            docId = $scope.ODImgObj.DocumentId;
            s3url = $scope.ODImgObj.S3URL;
        } else {
            canvass = document.getElementById("pOSviewer");
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
            "PatientOrderId": $scope.mainViewerObj.PatientOrderId,
            "PatientDocumentId": docId,
            "PatientId": $scope.mainViewerObj.PatientId,
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
                /*$scope.getPatientOrderDetailsList($scope.mainViewerObj.PatientOrderId);*/
                $uibModalInstance.close();
            }
        }, function (err) {
            alertify.error(err.Messege);
        });
    };


    $scope.currentImageIndex = 0;

    // Function to load the previous image
    $scope.loadPreviousImage = function () {
        if ($scope.currentImageIndex > 0) {
            $scope.currentImageIndex--;
            $scope.clickonParticularImage($scope.selectedobjFiles.RightEyeFiles[$scope.currentImageIndex]);
        }
    };

    // Function to load the next image
    $scope.loadNextImage = function () {
        if ($scope.currentImageIndex < $scope.selectedobjFiles.RightEyeFiles.length - 1) {
            $scope.currentImageIndex++;
            $scope.clickonParticularImage($scope.selectedobjFiles.RightEyeFiles[$scope.currentImageIndex]);
        }
    };

    $scope.currentImageIndexOS = 0;

    // Function to load the previous image
    $scope.loadPreviousImageOS = function () {
        if ($scope.currentImageIndexOS > 0) {
            $scope.currentImageIndexOS--;
            $scope.clickonRParticularImage($scope.selectedobjFiles.LeftEyeFiles[$scope.currentImageIndexOS]);
        }
    };

    // Function to load the next image
    $scope.loadNextImageOS = function () {
        if ($scope.currentImageIndexOS < $scope.selectedobjFiles.LeftEyeFiles.length - 1) {
            $scope.currentImageIndexOS++;
            $scope.clickonRParticularImage($scope.selectedobjFiles.LeftEyeFiles[$scope.currentImageIndexOS]);
        }
    };



    //$scope.rangeObj = {
    //    "current": 1,
    //    "previous": 1,
    //    "currentOS": 1,
    //    "previousOS": 1
    //}
    //$scope.changezooomfromrange = function (crrent) {
    //    console.log(crrent + "__" + $scope.rangeObj.current);
    //    var direction = $scope.rangeObj.current > $scope.rangeObj.previous ? 1 : -1;
    //    $scope.zoom(direction);
    //    $scope.rangeObj.previous = $scope.rangeObj.current;

    //};

    //$scope.changezooomfromrangeOS = function (crrent) {
    //    console.log(crrent + "__" + $scope.rangeObj.currentOS);
    //    var direction = $scope.rangeObj.currentOS > $scope.rangeObj.previousOS ? 1 : -1;
    //    $scope.zoomOS(direction);
    //    $scope.rangeObj.previousOS = $scope.rangeObj.currentOS;
    //};




    $scope.openInvOrdersDropdown = function () {
        $scope.getPatientOrderDetailsList();
        $scope.activeInvTab = 1;
        $scope.mainViewerObj.invSearchType = 3;
        ctxOS.clearRect(0, 0, canvasOSEl.width, canvasOSEl.height);
    }


    $scope.checkDicomFile = function (url) {
        var isDicomFile = false;
        var Url = url || "";
        if (Url != "") {
            isDicomFile = Url.toLowerCase().endsWith(".dcm") || Url.toLowerCase().endsWith(".DCM");
        }
        return isDicomFile;
    };

    $scope.selectInvestigationObj = function (mitem) {
        console.log(mitem);
        $scope.mainViewerObj.isOSFullscreen = true;
        $scope.mainViewerObj.numDivs = 2;
        $scope.selectedobjFiles.LeftEyeFiles = [];

        angular.forEach(mitem.PatientFiles, function (sitem) {
            sitem.S3URL = sitem.S3URL || "";
            $scope.isDicomFile = $scope.checkDicomFile(sitem.S3URL);
            var obj = {
                "big": sitem.S3URL || "",
                "small": sitem.S3URL || "",
                "DocumentId": sitem.DocumentId,
                "FileType": sitem.DocumentExt,
                "OrganId": sitem.OrganId,
                "isActive": false,
                "isDicomFile": $scope.isDicomFile
            }
            $scope.selectedobjFiles.LeftEyeFiles.push(obj);
        });

        $scope.clickonRParticularImage($scope.selectedobjFiles.LeftEyeFiles[0]);

    };

    $scope.investigationOrderspopover = {
        templateUrl: 'templates/uibpopups/investigationordermanagement-popover.html',
    };

    $scope.activeInvTab = 1;
    $scope.switchtoActiveInvTab = function (tabno) {
        $scope.activeInvTab = tabno;

        if ($scope.activeInvTab === 2) {
            $scope.mainViewerObj.invSearchType = 3;
            $scope.OrdersObj.filteredinvestigations = angular.copy($scope.OrdersObj.allinvestigations);
        } else {
            $scope.mainViewerObj.invSearchType = 3;
            var filteredArray = $filter("filter")($scope.OrdersObj.allinvestigations, { "ProcedureId": $scope.mainViewerObj.InvestigationId }, true);
            $scope.OrdersObj.filteredinvestigations = [];
            if (filteredArray.length > 0) {
                $scope.OrdersObj.filteredinvestigations = filteredArray || [];
            }
        }
    };


    $scope.changeOrderData = function (typeo) {
        $scope.mainViewerObj.invSearchType = typeo;
        var organId = parseInt(typeo);

        if (organId === 3) {
            if ($scope.activeInvTab === 1) {
                $scope.OrdersObj.filteredinvestigations = angular.copy($scope.OrdersObj.allinvestigations);
                var filteredArray = $filter("filter")($scope.OrdersObj.allinvestigations, { "ProcedureId": $scope.mainViewerObj.InvestigationId }, true);
                if (filteredArray.length > 0) {
                    $scope.OrdersObj.filteredinvestigations = filteredArray || [];
                }
            } else {
                $scope.OrdersObj.filteredinvestigations = angular.copy($scope.OrdersObj.allinvestigations);
            }
        } else {

            if ($scope.activeInvTab === 1) {

                var filteredArray = $filter("filter")($scope.OrdersObj.allinvestigations, { "OrganId": organId, "ProcedureId": $scope.mainViewerObj.InvestigationId }, true);
                $scope.OrdersObj.filteredinvestigations = [];
                if (filteredArray.length > 0) {
                    $scope.OrdersObj.filteredinvestigations = filteredArray || [];
                }
            } else {
                var filteredArray = $filter("filter")($scope.OrdersObj.allinvestigations, { "OrganId": organId }, true);
                $scope.OrdersObj.filteredinvestigations = [];
                if (filteredArray.length > 0) {
                    $scope.OrdersObj.filteredinvestigations = filteredArray || [];
                }
            }

        }
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
                    "PatientOrderId": $scope.mainViewerObj.PatientOrderId,
                    "PatientDocumentId": 0,
                    "PatientId": $scope.mainViewerObj.PatientId,
                    "PatientName": $scope.mainViewerObj.PatientName,
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
                    "PatientOrderId": $scope.mainViewerObj.PatientOrderId,
                    "PatientDocumentId": 0,
                    "PatientId": $scope.mainViewerObj.PatientId,
                    "PatientName": $scope.mainViewerObj.PatientName,
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






    $scope.getTrustedUrl = function (url) {

        var modifiedUrl = url;
        return $sce.trustAsResourceUrl(modifiedUrl);
    };




    
}]);
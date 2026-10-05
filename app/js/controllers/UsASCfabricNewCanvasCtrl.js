"use strict";
eHnoteWebApp.controller('UsASCfabricNewCanvasCtrl', ['$scope', '$location', '$uibModal', '$uibModalInstance', 'datapersistanceFactory', 'EhnoteAutoCompleteHelper', 'eHnoteCacheStorageService', 'eHnoteUserDataService', 'eHnoteMasterDataService', 'datacookieFactory', 'eHnoteProcedureDataService', 'eHnotePatientDataService', "eHnoteDbStaticDataService", '$filter', 'alertify', 'Lightbox', 'Upload', '$window', "eHnoteMainAdminServices", "$rootScope", "$timeout", "eHnoteSettingsDataService", "eHnoteMainAppointmentService","eHnoteAuditServices", function ($scope, $location, $uibModal, $uibModalInstance, datapersistanceFactory, EhnoteAutoCompleteHelper, eHnoteCacheStorageService, eHnoteUserDataService, eHnoteMasterDataService, datacookieFactory, eHnoteProcedureDataService, eHnotePatientDataService, eHnoteDbStaticDataService, $filter, alertify, Lightbox, Upload, $window, eHnoteMainAdminServices, $rootScope, $timeout, eHnoteSettingsDataService, eHnoteMainAppointmentService, eHnoteAuditServices) {


    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.PatientData = eHnoteMasterDataService.getpatientData();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
   


    if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
        && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
        $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.HospitalID = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;

    }
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    console.log($scope.cacheStorageItem);
    console.log($scope.PatientData);

    $scope.selectedBorderColorNew = "";
    $scope.IsNewStampCreation = false;
    $scope.IsShowStampList = true;
    $scope.IsBodyPartDisabled = false;

    var canvas = null;
    $scope.UserStampsArray = [];
    $uibModalInstance.rendered.then(function () {

        canvas = new fabric.Canvas('canvasascFabric');
        function renderVieportBorders() {
            var ctx = canvas.getContext();
            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect(
                canvas.viewportTransform[4],
                canvas.viewportTransform[5],
                canvas.getWidth() * canvas.getZoom(),
                canvas.getHeight() * canvas.getZoom());
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(
                canvas.viewportTransform[4],
                canvas.viewportTransform[5],
                canvas.getWidth() * canvas.getZoom(),
                canvas.getHeight() * canvas.getZoom());
            ctx.restore();
        }

        canvas.on('object:selected', function (opt) {
            var target = opt.target;
            if (target._cacheCanvas) {
                // Implement as needed
            }
        });

        canvas.on('mouse:wheel', function (opt) {
            var e = opt.e;
            if (!e.ctrlKey) {
                return;
            }
            var newZoom = canvas.getZoom() + e.deltaY / 300;
            canvas.zoomToPoint({ x: e.offsetX, y: e.offsetY }, newZoom);
            renderVieportBorders();
            e.preventDefault();
            return false;
        });

        var viewportLeft = 0,
            viewportTop = 0,
            mouseLeft,
            mouseTop,
            _drawSelection = canvas._drawSelection,
            isDown = false;

        canvas.on('mouse:down', function (options) {
            if (options.e.altKey) {
                isDown = true;
                viewportLeft = canvas.viewportTransform[4];
                viewportTop = canvas.viewportTransform[5];
                mouseLeft = options.e.x;
                mouseTop = options.e.y;
                _drawSelection = canvas._drawSelection;
                canvas._drawSelection = function () { };
                renderVieportBorders();
            }
        });

        canvas.on('mouse:move', function (options) {
            if (options.e.altKey && isDown) {
                var currentMouseLeft = options.e.x;
                var currentMouseTop = options.e.y;
                var deltaLeft = currentMouseLeft - mouseLeft;
                var deltaTop = currentMouseTop - mouseTop;
                canvas.viewportTransform[4] = viewportLeft + deltaLeft;
                canvas.viewportTransform[5] = viewportTop + deltaTop;
                canvas.renderAll();
                renderVieportBorders();
            }
        });

        canvas.on('mouse:up', function () {
            canvas._drawSelection = _drawSelection;
            isDown = false;
        });
        function initCanvasOffset() {
            var canvas = this.__canvas || this.canvas,
                canvases = this.__canvases || this.canvases;

            canvas && canvas.calcOffset && canvas.calcOffset();

            if (canvases && canvases.length) {
                for (var i = 0, len = canvases.length; i < len; i++) {
                    canvases[i].calcOffset();
                }
            }
        }

        // Listen for window load event to initialize canvas offset
        angular.element(window).on('load', initCanvasOffset);
        $scope.canvas1 = canvas;


        $scope.canvas1.on('object:moving', function (options) {
            var movedObject = options.target;
            updateImagePosition1(movedObject, $scope.canvas1);
        });


        $scope.canvas1.on('object:scaling', function (options) {
            var movedObject = options.target;
            updateImagePosition1(movedObject, $scope.canvas1);
        });

        // Canvas click handling
        $scope.canvas1.on('mouse:down', function (event) {
            var pointer = $scope.canvas1.getPointer(event.e);
            if ($scope.addUpdateExaminationDrawingReqObj.copiedImage) {
                $scope.addUpdateExaminationDrawingReqObj.copiedImage.clone(function (cloned) {
                    $scope.canvas1.add(cloned.set({
                        top: pointer.y,
                        left: pointer.x
                    }));
                });
            }
            if ($scope.canvas1) {
                $scope.changeColor($scope.ShapesObj.isFillColor);
                if ($scope.ShapesObj.isAddingCircle) {
                    var pointer = $scope.canvas1.getPointer(event.e);
                    var circle = new fabric.Circle({
                        name: 'circle_' + Date.now(),
                        left: pointer.x,
                        top: pointer.y,
                        stroke: $scope.ShapesObj.isBorderColor,
                        fill: $scope.ShapesObj.isFillColor,
                        radius: 50,
                        objectCaching: false,
                        strokeWidth: 4
                    });

                    $scope.canvas1.add(circle);
                    $scope.ShapesObj.isAddingCircle = false;
                } else if ($scope.ShapesObj.isAddingRect) {
                    var pointer = $scope.canvas1.getPointer(event.e);
                    var Rect = new fabric.Rect({
                        name: 'rect' + Date.now(),
                        left: pointer.x,
                        top: pointer.y,
                        stroke: $scope.ShapesObj.isBorderColor,
                        fill: $scope.ShapesObj.isFillColor,
                        width: 200,
                        height: 100,
                        objectCaching: false,
                        strokeWidth: 4,
                    });

                    $scope.canvas1.add(Rect);
                    $scope.ShapesObj.isAddingRect = false;
                } else if ($scope.ShapesObj.isAddingTriangle) {
                    var pointer = $scope.canvas1.getPointer(event.e);
                    var Triangle = new fabric.Triangle({
                        name: 'triangle' + Date.now(),
                        left: pointer.x,
                        top: pointer.y,
                        stroke: $scope.ShapesObj.isBorderColor,
                        fill: $scope.ShapesObj.isFillColor,
                        width: 50,
                        height: 50,
                        objectCaching: false,
                        strokeWidth: 4
                    });

                    $scope.canvas1.add(Triangle);
                    $scope.ShapesObj.isAddingTriangle = false;
                } else if ($scope.ShapesObj.isAddingLine) {
                    var pointer = $scope.canvas1.getPointer(event.e);
                    var Line = new fabric.Line([50, 100, 200, 200], {
                        name: 'line' + Date.now(),
                        left: pointer.x,
                        top: pointer.y,
                        stroke: $scope.ShapesObj.isBorderColor,
                        fill: $scope.ShapesObj.isFillColor,
                        objectCaching: false,
                        strokeWidth: 4
                    });
                    $scope.canvas1.add(Line);
                    $scope.ShapesObj.isAddingLine = false;
                } else if ($scope.ShapesObj.isAddingArrow) {
                    var pointer = $scope.canvas1.getPointer(event.e);
                    var fromX = 70; var fromY = 70; var toX = 100; var toY = 100;

                    var headLength = 15; // Length of arrow head
                    var angle = Math.atan2(toY - fromY, toX - fromX);

                    var pathData = `M ${fromX} ${fromY} L ${toX} ${toY} 
                        L ${toX - headLength * Math.cos(angle - Math.PI / 6)} ${toY - headLength * Math.sin(angle - Math.PI / 6)}
                        M ${toX} ${toY}
                        L ${toX - headLength * Math.cos(angle + Math.PI / 6)} ${toY - headLength * Math.sin(angle + Math.PI / 6)}`;

                    var arrow = new fabric.Path(pathData, {
                        name: 'arrow' + Date.now(),
                        left: pointer.x,
                        top: pointer.y,
                        stroke: $scope.ShapesObj.isBorderColor,
                        fill: '',
                        strokeWidth: 2,
                        selectable: true,
                        evented: true
                    });
                    $scope.canvas1.add(arrow);
                    $scope.ShapesObj.isAddingArrow = false;
                } else if ($scope.ShapesObj.isTextDraw) {
                    var pointer = $scope.canvas1.getPointer(event.e);
                    var text = 'Sample Text';

                    var textSample = new fabric.Textbox(text.slice(0, getRandomInt(0, text.length)), {
                        fontSize: 20,
                        left: getRandomInt(350, 400),
                        top: getRandomInt(350, 400),
                        fontFamily: 'helvetica',
                        angle: getRandomInt(-10, 10),
                        fill: '#000000',
                        fontWeight: '',
                        originX: 'left',
                        stroke: $scope.ShapesObj.isBorderColor,
                        width: 300,
                        hasRotatingPoint: true,
                        centerTransform: true
                    });

                    $scope.canvas1.add(textSample);
                    $scope.ShapesObj.isTextDraw = false;
                }
            }
        });
        $scope.watchCanvas = function () {

            function updateScope() {
                $scope.$$phase || $scope.$digest();
                $scope.canvas1.renderAll();

            }

            $scope.canvas1.on('object:selected', updateScope)
                .on('path:created', updateScope)
                .on('selection:cleared', updateScope);


        }

        $scope.watchCanvas();



        $scope.canvas1.on('object:added', function () {
            if (!$scope.isRedoing) {
                $scope.history = [];
            }
            $scope.isRedoing = false;
        });
        $scope.canvas1.on('object:modified', function () {
            if (!$scope.isRedoing) {
                $scope.history = [];
            }
            $scope.isRedoing = false;
        });


        function initBrushes() {
            if (!fabric.PatternBrush) return;

            initVLinePatternBrush();
            initHLinePatternBrush();
            initSquarePatternBrush();
            initDiamondPatternBrush();
            initImagePatternBrush();
        }
        initBrushes();

        function initImagePatternBrush() {
            var img = new Image();
            img.src = 'js/fabric/assets/honey_im_subtle.png';

            $scope.texturePatternBrush = new fabric.PatternBrush(canvas);
            $scope.texturePatternBrush.source = img;
        }

        function initDiamondPatternBrush() {
            $scope.diamondPatternBrush = new fabric.PatternBrush(canvas);
            $scope.diamondPatternBrush.getPatternSrc = function () {

                var squareWidth = 10, squareDistance = 5;
                var patternCanvas = fabric.document.createElement('canvas');
                var rect = new fabric.Rect({
                    width: squareWidth,
                    height: squareWidth,
                    angle: 45,
                    fill: this.color
                });

                var canvasWidth = rect.getBoundingRect().width;

                patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
                rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

                var ctx = patternCanvas.getContext('2d');
                rect.render(ctx);

                return patternCanvas;
            };
        }

        function initSquarePatternBrush() {
            $scope.squarePatternBrush = new fabric.PatternBrush(canvas);
            $scope.squarePatternBrush.getPatternSrc = function () {

                var squareWidth = 10, squareDistance = 2;

                var patternCanvas = fabric.document.createElement('canvas');
                patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
                var ctx = patternCanvas.getContext('2d');

                ctx.fillStyle = this.color;
                ctx.fillRect(0, 0, squareWidth, squareWidth);

                return patternCanvas;
            };
        }

        function initVLinePatternBrush() {
            $scope.vLinePatternBrush = new fabric.PatternBrush(canvas);
            $scope.vLinePatternBrush.getPatternSrc = function () {

                var patternCanvas = fabric.document.createElement('canvas');
                patternCanvas.width = patternCanvas.height = 10;
                var ctx = patternCanvas.getContext('2d');

                ctx.strokeStyle = this.color;
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(0, 5);
                ctx.lineTo(10, 5);
                ctx.closePath();
                ctx.stroke();

                return patternCanvas;
            };
        }

        function initHLinePatternBrush() {
            $scope.hLinePatternBrush = new fabric.PatternBrush(canvas);
            $scope.hLinePatternBrush.getPatternSrc = function () {

                var patternCanvas = fabric.document.createElement('canvas');
                patternCanvas.width = patternCanvas.height = 10;
                var ctx = patternCanvas.getContext('2d');

                ctx.strokeStyle = this.color;
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(5, 0);
                ctx.lineTo(5, 10);
                ctx.closePath();
                ctx.stroke();

                return patternCanvas;
            };
        }


        $scope.patternify = function () {
            var obj = canvas.getActiveObject();

            if (!obj) return;

            if (obj.fill instanceof fabric.Pattern) {
                obj.set('fill', null);
            }
            else {
                obj.set('fill', pattern);
            }
            canvas.renderAll();
        };

        $scope.play = function () {
            var obj = canvas.getActiveObject();

            if (!obj || !obj.getElement || !obj.getElement().play) return;
            obj.getElement().play();
            renderLoop();
        };

        function renderLoop() {
            canvas.requestRenderAll();
            window.requestAnimationFrame(renderLoop);
        }

        $scope.clip = function () {
            var obj = canvas.getActiveObject();
            if (!obj) return;

            if (obj.clipTo) {
                obj.clipTo = null;
            }
            else {
                var radius = obj.width < obj.height ? (obj.width / 2) : (obj.height / 2);
                obj.clipTo = function (ctx) {
                    ctx.arc(0, 0, radius, 0, Math.PI * 2, true);
                };
            }
            canvas.renderAll();
        };

        $scope.shadowify = function () {
            var obj = canvas.getActiveObject();
            if (!obj) return;

            if (obj.shadow) {
                obj.shadow = null;
            }
            else {
                obj.setShadow({
                    color: 'rgba(0,0,0,0.3)',
                    blur: 10,
                    offsetX: 10,
                    offsetY: 10
                });
            }
            canvas.renderAll();
        };

        $scope.gradientify = function () {
            var obj = canvas.getActiveObject();
            if (!obj) return;

            obj.setGradient('fill', {
                x1: 0,
                y1: 0,
                x2: (getRandomInt(0, 1) ? 0 : obj.width),
                y2: (getRandomInt(0, 1) ? 0 : obj.height),
                colorStops: {
                    0: '#' + getRandomColor(),
                    1: '#' + getRandomColor()
                }
            });
            canvas.renderAll();
        };

        $scope.execute = function () {
            if (!(/^\s+$/).test(consoleValue)) {
                eval(consoleValue);
            }
        };

        var consoleSVGValue = (
            '<?xml version="1.0" standalone="no"?>' +
            '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
            '<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
            '<rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)"/>' +
            '</svg>'
        );

        var consoleValue = (
            '// clear canvas\n' +
            'canvas.clear();\n\n' +
            '// remove currently selected object\n' +
            'canvas.remove(canvas.getActiveObject());\n\n' +
            '// add red rectangle\n' +
            'canvas.add(new fabric.Rect({\n' +
            '  width: 50,\n' +
            '  height: 50,\n' +
            '  left: 50,\n' +
            '  top: 50,\n' +
            "  fill: 'rgb(255,0,0)'\n" +
            '}));\n\n' +
            '// add green, half-transparent circle\n' +
            'canvas.add(new fabric.Circle({\n' +
            '  radius: 40,\n' +
            '  left: 50,\n' +
            '  top: 50,\n' +
            "  fill: 'rgb(0,255,0)',\n" +
            '  opacity: 0.5\n' +
            '}));\n'
        );

        var consoleJSONValue = (
            '{"objects":[{"type":"i-text","originX":"left","originY":"top","left":51,"top":282,"width":230.05,"height":235.94,"fill":"#333","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"text":"lorem ipsum\ndolor\nsit Amet\nconsectetur","fontSize":40,"fontWeight":"normal","fontFamily":"Helvetica","fontStyle":"","lineHeight":1.16,"textDecoration":"","textAlign":"left","textBackgroundColor":"","styles":{"0":{"0":{"fill":"red","fontSize":20,"fontFamily":"Helvetica","fontWeight":"normal","fontStyle":""},"1":{"fill":"red","fontSize":30,"fontFamily":"Helvetica","fontWeight":"normal","fontStyle":""},"2":{"fill":"red","fontSize":40,"fontFamily":"Helvetica","fontWeight":"normal","fontStyle":""},"3":{"fill":"red","fontSize":50,"fontFamily":"Helvetica","fontWeight":"normal","fontStyle":""},"4":{"fill":"red","fontSize":60,"fontFamily":"Helvetica","fontWeight":"normal","fontStyle":""},"6":{"textBackgroundColor":"yellow"},"7":{"textBackgroundColor":"yellow"},"8":{"textBackgroundColor":"yellow"},"9":{"textBackgroundColor":"yellow","fontFamily":"Helvetica","fontSize":40,"fontWeight":"normal","fontStyle":""}},"1":{"0":{"textDecoration":"underline"},"1":{"textDecoration":"underline","fontFamily":"Helvetica","fontSize":40,"fontWeight":"normal","fontStyle":""},"2":{"fill":"green","fontStyle":"italic","textDecoration":"underline"},"3":{"fill":"green","fontStyle":"italic","textDecoration":"underline"},"4":{"fill":"green","fontStyle":"italic","textDecoration":"underline","fontFamily":"Helvetica","fontSize":40,"fontWeight":"normal"}},"2":{"0":{"fill":"blue","fontWeight":"bold"},"1":{"fill":"blue","fontWeight":"bold"},"2":{"fill":"blue","fontWeight":"bold","fontFamily":"Helvetica","fontSize":40,"fontStyle":""},"4":{"fontFamily":"Courier","textDecoration":"line-through"},"5":{"fontFamily":"Courier","textDecoration":"line-through"},"6":{"fontFamily":"Courier","textDecoration":"line-through"},"7":{"fontFamily":"Courier","textDecoration":"line-through","fontSize":40,"fontWeight":"normal","fontStyle":""}},"3":{"0":{"fontFamily":"Impact","fill":"#666","textDecoration":"line-through"},"1":{"fontFamily":"Impact","fill":"#666","textDecoration":"line-through"},"2":{"fontFamily":"Impact","fill":"#666","textDecoration":"line-through"},"3":{"fontFamily":"Impact","fill":"#666","textDecoration":"line-through"},"4":{"fontFamily":"Impact","fill":"#666","textDecoration":"line-through","fontSize":40,"fontWeight":"normal","fontStyle":""}}}},{"type":"i-text","originX":"left","originY":"top","left":486,"top":343,"width":124.53,"height":157.3,"fill":"#333","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"text":"foo bar\nbaz\nquux","fontSize":40,"fontWeight":"normal","fontFamily":"Helvetica","fontStyle":"","lineHeight":1.16,"textDecoration":"","textAlign":"left","textBackgroundColor":"","styles":{"0":{"0":{"fill":"red"},"1":{"fill":"red"},"2":{"fill":"red","fontFamily":"Helvetica","fontSize":40,"fontWeight":"normal","fontStyle":""}},"2":{"0":{"fill":"blue"},"1":{"fill":"blue"},"2":{"fill":"blue"},"3":{"fill":"blue","fontFamily":"Helvetica","fontSize":40,"fontWeight":"normal","fontStyle":""}}}},{"type":"rect","originX":"left","originY":"top","left":317.5,"top":342,"width":50,"height":50,"fill":{"type":"linear","coords":{"x1":0,"y1":0,"x2":0,"y2":50},"colorStops":[{"offset":"0","color":"rgb(163,168,82)","opacity":1},{"offset":"1","color":"rgb(49,176,244)","opacity":1}],"offsetX":0,"offsetY":0},"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":2.48,"scaleY":2.48,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"circle","originX":"left","originY":"top","left":401,"top":246,"width":80,"height":80,"fill":{"type":"linear","coords":{"x1":0,"y1":0,"x2":80,"y2":0},"colorStops":[{"offset":"0","color":"rgb(49,74,121)","opacity":1},{"offset":"1","color":"rgb(249,168,238)","opacity":1}],"offsetX":0,"offsetY":0},"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":0.5,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"radius":40,"startAngle":0,"endAngle":6.283185307179586},{"type":"text","originX":"left","originY":"top","left":137,"top":32,"width":598.13,"height":367.02,"fill":"#dfea95","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.5,"scaleY":0.5,"angle":6,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"text":"Lorem ipsum dolor sit amet,\nconsectetur adipisicing elit,\nsed do eiusmod tempor incididunt\nut labore et dolore magna aliqua.\nUt enim ad minim veniam,\nquis nostrud exercitation ullamco\nla","fontSize":40,"fontWeight":"","fontFamily":"helvetica","fontStyle":"","lineHeight":1.16,"textDecoration":" underline","textAlign":"left","textBackgroundColor":""},{"type":"path","originX":"center","originY":"center","left":561.5,"top":150.5,"width":183,"height":189,"fill":null,"stroke":"rgb(0, 0, 0)","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"round","strokeLineJoin":"round","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"path":[["M",538.5,95],["Q",538.5,95,539,95],["Q",539.5,95,538.75,95],["Q",538,95,531,99.5],["Q",524,104,522.5,105.5],["Q",521,107,519.5,109],["Q",518,111,517.5,112],["Q",517,113,515.5,117.5],["Q",514,122,514,124],["Q",514,126,514,127.5],["Q",514,129,514.5,130.5],["Q",515,132,515,132.5],["Q",515,133,516,133.5],["Q",517,134,517.5,135],["Q",518,136,519,136.5],["Q",520,137,520,137.5],["Q",520,138,521,138],["Q",522,138,523,138],["Q",524,138,524.5,138],["Q",525,138,525,138.5],["Q",525,139,526,139],["Q",527,139,528,139],["Q",529,139,529.5,139],["Q",530,139,530.5,139],["Q",531,139,531.5,139],["Q",532,139,533,138.5],["Q",534,138,535,137.5],["Q",536,137,536.5,136.5],["Q",537,136,538,135.5],["Q",539,135,539.5,134.5],["Q",540,134,540.5,133.5],["Q",541,133,541.5,132.5],["Q",542,132,542,131.5],["Q",542,131,542,130.5],["Q",542,130,542,129.5],["Q",542,129,542,128.5],["Q",542,128,541.5,128],["Q",541,128,540.5,127.5],["Q",540,127,539.5,127],["Q",539,127,538,127],["Q",537,127,535.5,127],["Q",534,127,533,127.5],["Q",532,128,530.5,129.5],["Q",529,131,528.5,133],["Q",528,135,527.5,136],["Q",527,137,527,138.5],["Q",527,140,527,141.5],["Q",527,143,527,146],["Q",527,149,527.5,150.5],["Q",528,152,528.5,155],["Q",529,158,530.5,161],["Q",532,164,533,165.5],["Q",534,167,534.5,168],["Q",535,169,536.5,172],["Q",538,175,539,176],["Q",540,177,541,178],["Q",542,179,543,179.5],["Q",544,180,544.5,181],["Q",545,182,546,182],["Q",547,182,548,182.5],["Q",549,183,549.5,183.5],["Q",550,184,551,184],["Q",552,184,553,184],["Q",554,184,555,184],["Q",556,184,558,183],["Q",560,182,562.5,179],["Q",565,176,565.5,174],["Q",566,172,566,171],["Q",566,170,566,169],["Q",566,168,566,167.5],["Q",566,167,565.5,166],["Q",565,165,564,164.5],["Q",563,164,562.5,163.5],["Q",562,163,561,163],["Q",560,163,559.5,163],["Q",559,163,558,163.5],["Q",557,164,556.5,164.5],["Q",556,165,555.5,166.5],["Q",555,168,554.5,170],["Q",554,172,553.5,172.5],["Q",553,173,553,175.5],["Q",553,178,553,179],["Q",553,180,553.5,180.5],["Q",554,181,555.5,184.5],["Q",557,188,558.5,191],["Q",560,194,562,196.5],["Q",564,199,565,200.5],["Q",566,202,567.5,203],["Q",569,204,570,205],["Q",571,206,572,207.5],["Q",573,209,576.5,211],["Q",580,213,582,213.5],["Q",584,214,585,214],["Q",586,214,588,214.5],["Q",590,215,592,214.5],["Q",594,214,597,212],["Q",600,210,601,208],["Q",602,206,602.5,204],["Q",603,202,603,199.5],["Q",603,197,603,195],["Q",603,193,602.5,192],["Q",602,191,601,190],["Q",600,189,599.5,189],["Q",599,189,598.5,189],["Q",598,189,597.5,189],["Q",597,189,596.5,189],["Q",596,189,595,190.5],["Q",594,192,593.5,192.5],["Q",593,193,592.5,194.5],["Q",592,196,591.5,198],["Q",591,200,591,202.5],["Q",591,205,591.5,207],["Q",592,209,593,211.5],["Q",594,214,595.5,216],["Q",597,218,598,219.5],["Q",599,221,599.5,221.5],["Q",600,222,601.5,223.5],["Q",603,225,606.5,226],["Q",610,227,613,227],["Q",616,227,617.5,227],["Q",619,227,622,227],["Q",625,227,628,225],["Q",631,223,634,220.5],["Q",637,218,638,216],["Q",639,214,640.5,212],["Q",642,210,642,207.5],["Q",642,205,642.5,201],["Q",643,197,643,192],["Q",643,187,642.5,185.5],["Q",642,184,641.5,182.5],["Q",641,181,640,180],["Q",639,179,639,178.5],["Q",639,178,638,177],["Q",637,176,637,175.5],["Q",637,175,636.5,175],["Q",636,175,635.5,175.5],["Q",635,176,635,176.5],["Q",635,177,635,177.5],["Q",635,178,635,179],["Q",635,180,635,181],["Q",635,182,635,183],["Q",635,184,635,185],["Q",635,186,636,186.5],["Q",637,187,637.5,187.5],["Q",638,188,639.5,189],["Q",641,190,641.5,190],["Q",642,190,643.5,190.5],["Q",645,191,647.5,191],["Q",650,191,651,191],["Q",652,191,653.5,191],["Q",655,191,658,191],["Q",661,191,666,190],["Q",671,189,672,188.5],["Q",673,188,674,187.5],["Q",675,187,675.5,186.5],["Q",676,186,676.5,185],["Q",677,184,677.5,183],["Q",678,182,678,181.5],["Q",678,181,678,179],["Q",678,177,678,174.5],["Q",678,172,676.5,169],["Q",675,166,673,162.5],["Q",671,159,668,154.5],["Q",665,150,661.5,146],["Q",658,142,653,138],["Q",648,134,644,131],["Q",640,128,638,127],["Q",636,126,634.5,125],["Q",633,124,629.5,123.5],["Q",626,123,625,123],["Q",624,123,623.5,123.5],["Q",623,124,623,124.5],["Q",623,125,623,126],["Q",623,127,622.5,127.5],["Q",622,128,622,130],["Q",622,132,622,132.5],["Q",622,133,622,133.5],["Q",622,134,622.5,135.5],["Q",623,137,623.5,138],["Q",624,139,624.5,139],["Q",625,139,625.5,139.5],["Q",626,140,626,140.5],["Q",626,141,626.5,141],["Q",627,141,627.5,141],["Q",628,141,628.5,141],["Q",629,141,630,141],["Q",631,141,631.5,141],["Q",632,141,633,141],["Q",634,141,636,140.5],["Q",638,140,640,138.5],["Q",642,137,643.5,135],["Q",645,133,645.5,131.5],["Q",646,130,646.5,128],["Q",647,126,647,123],["Q",647,120,647,116.5],["Q",647,113,647,111.5],["Q",647,110,646.5,107.5],["Q",646,105,643.5,99],["Q",641,93,639.5,90.5],["Q",638,88,631,78],["Q",624,68,622,66.5],["Q",620,65,617,63.5],["Q",614,62,611,61.5],["Q",608,61,606.5,61],["Q",605,61,604.5,61],["Q",604,61,601.5,61],["Q",599,61,598,62],["Q",597,63,596.5,63.5],["Q",596,64,595,66],["Q",594,68,594,69],["Q",594,70,593.5,71.5],["Q",593,73,593,74.5],["Q",593,76,593,77],["Q",593,78,593,80],["Q",593,82,594,84],["Q",595,86,595.5,86.5],["Q",596,87,597,87.5],["Q",598,88,598.5,88],["Q",599,88,599.5,88.5],["Q",600,89,600.5,89],["Q",601,89,601.5,89],["Q",602,89,603.5,88.5],["Q",605,88,606.5,87.5],["Q",608,87,609.5,85.5],["Q",611,84,612,82.5],["Q",613,81,613.5,80],["Q",614,79,614.5,78],["Q",615,77,615,74],["Q",615,71,615,68.5],["Q",615,66,613.5,62.5],["Q",612,59,610.5,57.5],["Q",609,56,608,55],["Q",607,54,605.5,53.5],["Q",604,53,601,51.5],["Q",598,50,594,48.5],["Q",590,47,586,47],["Q",582,47,576.5,46],["Q",571,45,566.5,45],["Q",562,45,558.5,45],["Q",555,45,553,45],["Q",551,45,549,45.5],["Q",547,46,546,48],["Q",545,50,544.5,50.5],["Q",544,51,543.5,53.5],["Q",543,56,542.5,58.5],["Q",542,61,542,63.5],["Q",542,66,542.5,68.5],["Q",543,71,544,73.5],["Q",545,76,545.5,77.5],["Q",546,79,547,79.5],["Q",548,80,549,80.5],["Q",550,81,550.5,81],["Q",551,81,552,81],["Q",553,81,554,81],["Q",555,81,557,80],["Q",559,79,561,76.5],["Q",563,74,563.5,71.5],["Q",564,69,564,67],["Q",564,65,564,63.5],["Q",564,62,563.5,61],["Q",563,60,561.5,58.5],["Q",560,57,559,55.5],["Q",558,54,557,53],["Q",556,52,553.5,50.5],["Q",551,49,548,47],["Q",545,45,542.5,44],["Q",540,43,537,42],["Q",534,41,528.5,39.5],["Q",523,38,519,38],["Q",515,38,511,38],["Q",507,38,505.5,38],["Q",504,38,503,38],["Q",502,38,501.5,39.5],["Q",501,41,500.5,42.5],["Q",500,44,499,46],["Q",498,48,498,50.5],["Q",498,53,497.5,55],["Q",497,57,497,58],["Q",497,59,496.5,60.5],["Q",496,62,495.5,63.5],["Q",495,65,495,67],["Q",495,69,495,70],["Q",495,71,495,73],["Q",495,75,495.5,77],["Q",496,79,497,80.5],["Q",498,82,500,84.5],["Q",502,87,503,87.5],["Q",504,88,504.5,88.5],["Q",505,89,506.5,90],["Q",508,91,511,92],["Q",514,93,514.5,93],["Q",515,93,516.5,93],["Q",518,93,519,93],["Q",520,93,521,93],["Q",522,93,523,93],["Q",524,93,525,92.5],["Q",526,92,527,91.5],["Q",528,91,528.5,91],["Q",529,91,529,90.5],["L",529,90]],"pathOffset":{"x":586.5,"y":132.5}}],"background":""}'
        );

        $scope.getConsoleJSON = function () {
            return consoleJSONValue;
        };
        $scope.setConsoleJSON = function (value) {
            consoleJSONValue = value;
        };
        $scope.getConsoleSVG = function () {
            return consoleSVGValue;
        };
        $scope.setConsoleSVG = function (value) {
            consoleSVGValue = value;
        };
        $scope.getConsole = function () {
            return consoleValue;
        };
        $scope.setConsole = function (value) {
            consoleValue = value;
        };

        $scope.loadSVGWithoutGrouping = function () {
            _loadSVGWithoutGrouping(consoleSVGValue);
        };
        $scope.loadSVG = function () {
            _loadSVG(consoleSVGValue);
        };

        var _loadSVG = function (svg) {
            fabric.loadSVGFromString(svg, function (objects, options) {
                var obj = fabric.util.groupSVGElements(objects, options);
                canvas.add(obj).centerObject(obj).renderAll();
                obj.setCoords();
            });
        };

        var _loadSVGWithoutGrouping = function (svg) {
            fabric.loadSVGFromString(svg, function (objects) {
                canvas.renderOnAddRemove = false;
                canvas.add.apply(canvas, objects);
                canvas.renderOnAddRemove = true;
                canvas.renderAll();
            });
        };

        $scope.saveJSON = function () {
            _saveJSON(JSON.stringify(canvas));
        };

        var _saveJSON = function (json) {
            $scope.setConsoleJSON(json);
        };

        $scope.loadJSON = function () {
            _loadJSON(consoleJSONValue);
        };

        var _loadJSON = function (json) {
            canvas.loadFromJSON(json, function () {
                canvas.renderAll();
            });
        };

        function initCustomization() {
            if (typeof Cufon !== 'undefined' && Cufon.fonts.delicious) {
                Cufon.fonts.delicious.offsetLeft = 75;
                Cufon.fonts.delicious.offsetTop = 25;
            }

            if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
                fabric.Object.prototype.cornerSize = 30;
            }

            fabric.Object.prototype.transparentCorners = false;

            if (document.location.search.indexOf('guidelines') > -1) {
                initCenteringGuidelines(canvas);
                initAligningGuidelines(canvas);
            }
        }

        initCustomization();




        $scope.getPreserveObjectStacking = function () {
            return canvas.preserveObjectStacking;
        };
        $scope.setPreserveObjectStacking = function (value) {
            return canvas.preserveObjectStacking = value;
        };

        $scope.getEnableRetinaScaling = function () {
            return canvas.enableRetinaScaling;
        };
        $scope.setEnableRetinaScaling = function (value) {
            canvas.enableRetinaScaling = value;
            canvas.setDimensions({
                width: canvas.width,
                height: canvas.height
            });
            return value
        };

        $scope.getSkipOffscreen = function () {
            return canvas.skipOffscreen;
        };
        $scope.setSkipOffscreen = function (value) {
            return canvas.skipOffscreen = value;
        };

        $scope.getFreeDrawingMode = function () {
            return canvas.isDrawingMode;
        };
        $scope.setFreeDrawingMode = function (value) {
            $scope.setDrawingMode('Pencil');
            canvas.isDrawingMode = !!value;
            canvas.freeDrawingBrush.width = 1;
            $scope.$$phase || $scope.$digest();
        };

        $scope.freeDrawingMode = 'Pencil';

        $scope.getDrawingMode = function () {
            return $scope.freeDrawingMode;
        };
        $scope.setDrawingMode = function (type) {
            canvas.isDrawingMode = true;
            $scope.freeDrawingMode = type;

            if (type === 'hline') {
                canvas.freeDrawingBrush = $scope.vLinePatternBrush;
            }
            else if (type === 'vline') {
                canvas.freeDrawingBrush = $scope.hLinePatternBrush;
            }
            else if (type === 'square') {
                canvas.freeDrawingBrush = $scope.squarePatternBrush;
            }
            else if (type === 'diamond') {
                canvas.freeDrawingBrush = $scope.diamondPatternBrush;
            }
            else if (type === 'texture') {
                canvas.freeDrawingBrush = $scope.texturePatternBrush;
            }
            else {
                canvas.freeDrawingBrush = new fabric[type + 'Brush'](canvas);
            }
            canvas.freeDrawingBrush.width = 50;
            $scope.$$phase || $scope.$digest();
        };


        $scope.getDrawingLineColor = function () {
            if (canvas.freeDrawingBrush) {
                return canvas.freeDrawingBrush.color;
            }
        };
        $scope.setDrawingLineColor = function (value) {
            if (canvas.freeDrawingBrush) {
                canvas.freeDrawingBrush.color = value;
            }
        };

        $scope.getDrawingLineShadowWidth = function () {
            if (canvas.freeDrawingBrush && canvas.freeDrawingBrush.shadow) {
                return canvas.freeDrawingBrush.shadow.blur || 1;
            }
            else {
                return 0
            }
        };
        $scope.setDrawingLineShadowWidth = function (value) {
            if (canvas.freeDrawingBrush) {
                var blur = parseInt(value, 10) || 1;
                if (blur > 0) {
                    canvas.freeDrawingBrush.shadow = new fabric.Shadow({ blur: blur, offsetX: 10, offsetY: 10 });
                }
                else {
                    canvas.freeDrawingBrush.shadow = null;
                }
            }
        };



    });
    $scope.GetLogObj = function () {
        return {
            "UserId": $scope.UserId || null,
            "OrganizationId": $scope.HospitalId || null,
            "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
            "PatientId": $scope.cacheStorageItem.PatientID || null,
            "LogArray": [],
        }
    }
    $scope.LogObj = $scope.GetLogObj();
    $scope.getDrawingLineWidth = function () {
        if (canvas.freeDrawingBrush) {
            return canvas.freeDrawingBrush.width;
        }
    };
    $scope.setDrawingLineWidth = function (value) {
        if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.width = parseInt(value, 10) || 1;
        }
    };

    $scope.getActiveStyle = getActiveStyle;

    $scope.selectedColor = '';

    $scope.selectedBorderColor = '';


    var pattern = new fabric.Pattern({
        source: 'js/fabric/assets/ladybug.png',
        repeat: 'repeat'
    });

    $scope.getOpacity = function () {
        return getActiveStyle('opacity') * 100;
    };
    $scope.setOpacity = function (value) {
        setActiveStyle('opacity', parseInt(value, 10) / 100);
    };

    $scope.getFill = function () {
        return getActiveStyle('fill');
    };
    $scope.setFill = function (value) {
        setActiveStyle('fill', value);
    };

    $scope.isBold = function () {
        return getActiveStyle('fontWeight') === 'bold';
    };
    $scope.toggleBold = function () {
        setActiveStyle('fontWeight',
            getActiveStyle('fontWeight') === 'bold' ? '' : 'bold');
    };
    $scope.isItalic = function () {
        return getActiveStyle('fontStyle') === 'italic';
    };
    $scope.toggleItalic = function () {
        setActiveStyle('fontStyle',
            getActiveStyle('fontStyle') === 'italic' ? '' : 'italic');
    };

    $scope.isUnderline = function () {
        return getActiveStyle('textDecoration').indexOf('underline') > -1 || getActiveStyle('underline');
    };
    $scope.toggleUnderline = function () {
        var value = $scope.isUnderline()
            ? getActiveStyle('textDecoration').replace('underline', '')
            : (getActiveStyle('textDecoration') + ' underline');

        setActiveStyle('textDecoration', value);
        setActiveStyle('underline', !getActiveStyle('underline'));
    };

    $scope.isLinethrough = function () {
        return getActiveStyle('textDecoration').indexOf('line-through') > -1 || getActiveStyle('linethrough');
    };
    $scope.toggleLinethrough = function () {
        var value = $scope.isLinethrough()
            ? getActiveStyle('textDecoration').replace('line-through', '')
            : (getActiveStyle('textDecoration') + ' line-through');

        setActiveStyle('textDecoration', value);
        setActiveStyle('linethrough', !getActiveStyle('linethrough'));
    };
    $scope.isOverline = function () {
        return getActiveStyle('textDecoration').indexOf('overline') > -1 || getActiveStyle('overline');
    };
    $scope.toggleOverline = function () {
        var value = $scope.isOverline()
            ? getActiveStyle('textDecoration').replace('overline', '')
            : (getActiveStyle('textDecoration') + ' overline');

        setActiveStyle('textDecoration', value);
        setActiveStyle('overline', !getActiveStyle('overline'));
    };

    $scope.getText = function () {
        return getActiveProp('text');
    };
    $scope.setText = function (value) {
        setActiveProp('text', value);
    };

    $scope.getTextAlign = function () {
        return capitalize(getActiveProp('textAlign'));
    };
    $scope.setTextAlign = function (value) {
        setActiveProp('textAlign', value.toLowerCase());
    };

    $scope.getFontFamily = function () {
        return getActiveProp('fontFamily').toLowerCase();
    };
    $scope.setFontFamily = function (value) {
        setActiveProp('fontFamily', value.toLowerCase());
    };

    $scope.getBgColor = function () {
        return getActiveProp('backgroundColor');
    };
    $scope.setBgColor = function (value) {
        setActiveProp('backgroundColor', value);
    };

    $scope.getTextBgColor = function () {
        return getActiveProp('textBackgroundColor');
    };
    $scope.setTextBgColor = function (value) {
        setActiveProp('textBackgroundColor', value);
    };

    $scope.getStroke = function () {
        return getActiveStyle('stroke');
    };
    $scope.setStroke = function (value) {
        setActiveStyle('stroke', value);
    };

    $scope.getStrokeWidth = function () {
        return getActiveStyle('strokeWidth');
    };
    $scope.setStrokeWidth = function (value) {
        setActiveStyle('strokeWidth', parseInt(value, 10));
    };

    $scope.getFontSize = function () {
        return getActiveStyle('fontSize');
    };
    $scope.setFontSize = function (value) {
        setActiveStyle('fontSize', parseInt(value, 10));
    };

    $scope.getLineHeight = function () {
        return getActiveStyle('lineHeight');
    };
    $scope.setLineHeight = function (value) {
        setActiveStyle('lineHeight', parseFloat(value, 10));
    };
    $scope.getCharSpacing = function () {
        return getActiveStyle('charSpacing');
    };
    $scope.setCharSpacing = function (value) {
        setActiveStyle('charSpacing', value);
    };

    $scope.getBold = function () {
        return getActiveStyle('fontWeight');
    };
    $scope.setBold = function (value) {
        setActiveStyle('fontWeight', value ? 'bold' : '');
    };

    $scope.setPatternStyle = function (value) {
        var obj = canvas.getActiveObject();
        if (obj && obj.fill instanceof fabric.Pattern) {
            obj.fill.repeat = value;
            obj.dirty = true;
            canvas.requestRenderAll();
        }
    };

    $scope.hasPattern = function () {
        return getActiveStyle('fill') instanceof fabric.Pattern;
    };

    $scope.getPatternRepeat = function () {
        if ($scope.hasPattern()) {
            return getActiveStyle('fill').repeat;
        }
    };

    $scope.addResizeFilter = function () {
        setActiveStyle('resizeFilter', new fabric.Image.filters.Resize());
        canvas.requestRenderAll();
    }

    $scope.addInvertFilter = function () {
        setActiveStyle('filters', [new fabric.Image.filters.Invert()]);
        var obj = canvas.getActiveObject();
        obj.applyFilters && obj.applyFilters();
    }

    $scope.addContrastFilter = function () {
        setActiveStyle('filters', [new fabric.Image.filters.Contrast({ contrast: 0.7 })]);
        var obj = canvas.getActiveObject();
        obj.applyFilters && obj.applyFilters();
    }

    $scope.getCanvasBgColor = function () {
        return canvas.backgroundColor;
    };
    $scope.setCanvasBgColor = function (value) {
        canvas.backgroundColor = value;
        canvas.renderAll();
    };

    $scope.getCanvasBgColor = function () {
        return canvas.backgroundColor;
    };
    $scope.setCanvasBgColor = function (value) {
        canvas.backgroundColor = value;
        canvas.renderAll();
    };

    $scope.setSubScript = function () {
        var obj = canvas.getActiveObject();
        obj.setSubScript();
    };

    $scope.setSuperScript = function () {
        var obj = canvas.getActiveObject();
        obj.setSuperScript();
    };

    function getActiveStyle(styleName, object) {
        object = object || canvas.getActiveObject();
        if (!object) return '';

        return (object.getSelectionStyles && object.isEditing)
            ? (object.getSelectionStyles()[styleName] || '')
            : (object[styleName] || '');
    };

    function setActiveStyle(styleName, value, object) {
        object = object || canvas.getActiveObject();
        if (!object) return;

        if (object.setSelectionStyles && object.isEditing) {
            var style = {};
            style[styleName] = value;
            object.setSelectionStyles(style);
            object.setCoords();
        }
        else {
            object.set(styleName, value);
        }

        object.setCoords();
        canvas.requestRenderAll();
    };

    function getActiveProp(name) {
        var object = canvas.getActiveObject();
        if (!object) return '';

        return object[name] || '';
    }

    function setActiveProp(name, value) {
        var object = canvas.getActiveObject();
        if (!object) return;
        object.set(name, value).setCoords();
        canvas.renderAll();
    }

    //$scope.onFileChanged = function () {
    //    console.log("ABC");
    //    var canvas = document.getElementById("canvas");
    //    var ctxt = canvas.getContext("2d");
    //    var background = new Image();
    //    background.src = "https://ehnotedevstorage.blob.core.windows.net/dev/3/Patient/Insurance/_P324598_2024_01_18_16_12_11_13152_1.jpg";
    //    background.onload = function () {
    //        ctxt.drawImage(background, 0, 0, canvas.width, canvas.height);
    //    };
    //};
    $scope.setBackgroundImage = function (imageUrl, canvas) {
        //if (imageUrl) {
        //    fabric.Image.fromURL(imageUrl, function (img) {
        //        img.set({
        //            crossOrigin: 'anonymous'
        //        });
        //        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        //    });
        //}

        convertImageUrlToBase64(imageUrl, function (base64Image) {
            fabric.Image.fromURL(base64Image, function (img) {
                img.set({
                    crossOrigin: 'anonymous', // Ensure CORS is set appropriately
                    scaleX: canvas.width / img.width,
                    scaleY: canvas.height / img.height
                });
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
            });
        });
    };

    function convertImageUrlToBase64(imageUrl, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', imageUrl);
        xhr.responseType = 'blob';
        xhr.send();
    }






    //canvas.on('mouse:down', function (event) {
    //    var target = event.target;

    //    if (target) {
    //        // Update the fill color of the clicked shape
    //        target.set('fill', $scope.selectedColor);
    //        canvas.renderAll();
    //    }
    //});







    var addShape = function (shapeName) {

        console.log('adding shape', shapeName);

        var coord = getRandomLeftTop();

        fabric.loadSVGFromURL('js/fabric/assets/' + shapeName + '.svg', function (objects, options) {

            var loadedObject = fabric.util.groupSVGElements(objects, options);

            loadedObject.set({
                left: coord.left,
                top: coord.top,
                angle: getRandomInt(-10, 10)
            })
                .setCoords();

            canvas.add(loadedObject);
        });
    };

    $scope.addPatternRect = function () {
        var coord = getRandomLeftTop();
        var rect = new fabric.Rect({
            width: 300,
            height: 300,
            left: coord.left,
            top: coord.top,
            angle: getRandomInt(-10, 10),
            fill: pattern,
        });
        canvas.add(rect);
    };

    $scope.maybeLoadShape = function (e) {
        var $el = $(e.target).closest('button.shape');
        if (!$el[0]) return;

        var id = $el.prop('id'), match;
        if (match = /\d+$/.exec(id)) {
            addShape(match[0]);
        }
    };





    $scope.rasterize3x = function (canvas, canvasId) {
        $scope.rasterize(canvas, canvasId, 3);
    }

    $scope.rasterize = function (canvas, canvasId, multiplier) {
        $scope.newStampAddUpdateReqObj.Base64 = "";
        if (!fabric.Canvas.supports('toDataURL')) {
            alert('This browser doesn\'t provide means to serialize canvas to an image');
        }
        else {
            var data = canvas.toDataURL({ multiplier: multiplier, format: 'png' });
            $scope.newStampAddUpdateReqObj.Base64 = data;
            if (canvasId == 2) {
                document.getElementById('canvasRasterizer2').src = data;
            } else {
                document.getElementById('canvasRasterizer1').src = data;
            }

        }
    };


    $scope.rasterizewithOutBg = function (canvas, canvasId, multiplier) {

        canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));

        if (!fabric.Canvas.supports('toDataURL')) {
            alert('This browser doesn\'t provide means to serialize canvas to an image');
        }
        else {
            var data = canvas.toDataURL({ multiplier: multiplier, format: 'png' });

            if (canvasId == 2) {
                document.getElementById('canvasRasterizer2').src = data;
            } else {
                document.getElementById('canvasRasterizer1').src = data;
            }

        }
    };

    $scope.rasterizeSVG = function (canvas, canvasId) {
        document.getElementById('SVGRasterizer').innerHTML = canvas.toSVG();
    };

    $scope.rasterizeJSON = function (canvas) {
        $scope.setConsoleJSON(JSON.stringify(canvas));
    };

    $scope.getSelected = function (canvas) {
        return canvas.getActiveObject();
    };

    $scope.removeSelected = function (canvas) {
        var activeObjects = canvas.getActiveObjects();
        canvas.discardActiveObject()
        if (activeObjects.length) {
            canvas.remove.apply(canvas, activeObjects);
        }
    };

    $scope.getLockScalingFlip = function () {
        return getActiveProp('lockScalingFlip');
    };
    $scope.setLockScalingFlip = function (value) {
        setActiveProp('lockScalingFlip', value);
    };

    $scope.getHorizontalLock = function () {
        return getActiveProp('lockMovementX');
    };
    $scope.setHorizontalLock = function (value) {
        setActiveProp('lockMovementX', value);
    };

    $scope.getVerticalLock = function () {
        return getActiveProp('lockMovementY');
    };
    $scope.setVerticalLock = function (value) {
        setActiveProp('lockMovementY', value);
    };

    $scope.getScaleLockX = function () {
        return getActiveProp('lockScalingX');
    },
        $scope.setScaleLockX = function (value) {
            setActiveProp('lockScalingX', value);
        };

    $scope.getScaleLockY = function () {
        return getActiveProp('lockScalingY');
    };
    $scope.setScaleLockY = function (value) {
        setActiveProp('lockScalingY', value);
    };

    $scope.getRotationLock = function () {
        return getActiveProp('lockRotation');
    };
    $scope.setRotationLock = function (value) {
        setActiveProp('lockRotation', value);
    };

    $scope.getOriginX = function () {
        return getActiveProp('originX') + '';
    };

    $scope.setOriginX = function (value) {
        var num = parseFloat(value);
        setActiveProp('originX', isNaN(num) ? value : num);
    };

    $scope.setCenteredRotation = function (value) {
        setActiveProp('centeredRotation', value);
    };

    $scope.getCenteredRotation = function (value) {
        return getActiveProp('centeredRotation');
    };

    $scope.getOriginY = function () {
        return getActiveProp('originY') + '';
    };
    $scope.setOriginY = function (value) {
        var num = parseFloat(value);
        setActiveProp('originY', isNaN(num) ? value : num);
    };

    $scope.getObjectCaching = function () {
        return getActiveProp('objectCaching');
    };

    $scope.setObjectCaching = function (value) {
        return setActiveProp('objectCaching', value);
    };

    $scope.getNoScaleCache = function () {
        return getActiveProp('noScaleCache');
    };

    $scope.setNoScaleCache = function (value) {
        return setActiveProp('noScaleCache', value);
    };

    $scope.getTransparentCorners = function () {
        return getActiveProp('transparentCorners');
    };

    $scope.setTransparentCorners = function (value) {
        return setActiveProp('transparentCorners', value);
    };

    $scope.getHasBorders = function () {
        return getActiveProp('hasBorders');
    };

    $scope.setHasBorders = function (value) {
        return setActiveProp('hasBorders', value);
    };

    $scope.getHasControls = function () {
        return getActiveProp('hasControls');
    };

    $scope.setHasControls = function (value) {
        return setActiveProp('hasControls', value);
    };

    $scope.sendBackwards = function () {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.sendBackwards(activeObject);
        }
    };

    $scope.sendToBack = function () {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.sendToBack(activeObject);
        }
    };

    $scope.bringForward = function () {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.bringForward(activeObject);
        }
    };

    $scope.bringToFront = function () {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.bringToFront(activeObject);
        }
    };




    $scope.history = [];
    $scope.isRedoing = false;







    $scope.undoCanvas = function () {
        if ($scope.canvas1._objects.length > 0) {
            $scope.history.push($scope.canvas1._objects.pop());
            $scope.canvas1.renderAll();
        }
    };

    $scope.redoCanvas = function () {
        if ($scope.history.length > 0) {
            $scope.isRedoing = true;
            $scope.canvas1.add($scope.history.pop());
        }
    };




    $scope.changeColor = function (color) {

        $scope.selectedColor = color;

        var activeObject = $scope.canvas1.getActiveObject();

        // Check if there is an active object and if the color is selected
        if (activeObject && color) {
            // Update the fill color of the active object
            activeObject.set('fill', color);

            // Render the canvas to reflect the changes
            $scope.canvas1.renderAll();
        }
    };

    $scope.changeBorderColor = function (color) {

        $scope.selectedBorderColor = color;

        var activeObject = $scope.canvas1.getActiveObject();

        // Check if there is an active object and if the color is selected
        if (activeObject && color) {
            // Update the fill color of the active object
            activeObject.set('stroke', color);

            // Render the canvas to reflect the changes
            $scope.canvas1.renderAll();
        }
    };

    angular.element(document.body).on('keydown', function (event) {
        // Check if the pressed key is the delete key (keyCode 46)
        if (event.keyCode === 46) {
            // Get the active object on the canvas
            var activeObject = $scope.canvas1.getActiveObject();

            // Check if there is an active object
            if (activeObject) {
                // Remove the active object from the canvas
                $scope.canvas1.remove(activeObject);

                // Render the canvas to reflect the changes
                $scope.canvas1.renderAll();
            }
        }
    });

    //$scope.addRect = function (canvas) {
    //    var coord = getRandomLeftTop();
    //    var time = new Date();
    //    var hms = time.getHours() + "" + time.getMinutes() + "" + time.getSeconds();
    //    console.log(hms);
    //    $scope.canvas1.add(new fabric.Rect({
    //        name: 'rect' + hms,
    //        left: 100,
    //        top: 50,
    //        fill: '',
    //        width: 200,
    //        height: 100,
    //        objectCaching: false,
    //        stroke: 'black',
    //        strokeWidth: 4,
    //    }));
    //};

    //$scope.addCircle = function (canvas) {
    //    var coord = getRandomLeftTop();
    //    var time = new Date();
    //    var hms = time.getHours() + "" + time.getMinutes() + "" + time.getSeconds();
    //    console.log(hms);
    //    $scope.canvas1.add(new fabric.Circle({
    //        name: 'circle' + hms,
    //        left: coord.left,
    //        top: coord.top,
    //        fill: '',
    //        radius: 50,
    //        objectCaching: false,
    //        stroke: 'black',
    //        strokeWidth: 4
    //    }));


    //};

    //$scope.addTriangle = function (canvas) {
    //    var coord = getRandomLeftTop();
    //    var time = new Date();
    //    var hms = time.getHours() + "" + time.getMinutes() + "" + time.getSeconds();
    //    console.log(hms);
    //    $scope.canvas1.add(new fabric.Triangle({
    //        name: 'triangle' + hms,
    //        left: coord.left,
    //        top: coord.top,
    //        fill: '',
    //        width: 50,
    //        height: 50,
    //        objectCaching: false,
    //        stroke: 'black',
    //        strokeWidth: 4
    //    }));
    //};

    //$scope.addLine = function (canvas) {
    //    var coord = getRandomLeftTop();
    //    var time = new Date();
    //    var hms = time.getHours() + "" + time.getMinutes() + "" + time.getSeconds();
    //    console.log(hms);
    //    $scope.canvas1.add(new fabric.Line([50, 100, 200, 200], {
    //        name: 'line' + hms,
    //        left: coord.left,
    //        top: coord.top,
    //        strokeWidth:3,
    //        stroke: '#000000'
    //    }));
    //};

    //$scope.addPolygon = function (canvas) {
    //    var coord = getRandomLeftTop();
    //    var time = new Date();
    //    var hms = time.getHours() + "" + time.getMinutes() + "" + time.getSeconds();
    //    console.log(hms);
    //    $scope.canvas1.add(new fabric.Polygon([
    //        { x: 185, y: 0 },
    //        { x: 250, y: 100 },
    //        { x: 385, y: 170 },
    //        { x: 0, y: 245 }], {
    //        name: 'poly' + hms,
    //        left: coord.left,
    //        top: coord.top,
    //        fill: '',
    //        objectCaching: false,
    //        stroke: 'black',
    //        strokeWidth: 4
    //    }));
    //};

    //$scope.addText = function () {
    //    var text = 'Sample Text';
    //   /* fill: '#' + getRandomColor(),*/
    //    var textSample = new fabric.Text(text.slice(0, getRandomInt(0, text.length)), {
    //        left: getRandomInt(350, 400),
    //        top: getRandomInt(350, 400),
    //        fontFamily: 'helvetica',
    //        angle: getRandomInt(-10, 10),
    //        fill: '#000000',
    //        scaleX: 0.5,
    //        scaleY: 0.5,
    //        fontWeight: '',
    //        originX: 'left',
    //        hasRotatingPoint: true,
    //        centerTransform: true
    //    });

    //    $scope.canvas1.add(textSample);
    //};

    //$scope.addTextbox = function (canvas) {
    //    var text = 'Sample Text';

    //    var textSample = new fabric.Textbox(text.slice(0, getRandomInt(0, text.length)), {
    //        fontSize: 20,
    //        left: getRandomInt(350, 400),
    //        top: getRandomInt(350, 400),
    //        fontFamily: 'helvetica',
    //        angle: getRandomInt(-10, 10),
    //        fill: '#000000',
    //        fontWeight: '',
    //        originX: 'left',
    //        width: 300,
    //        hasRotatingPoint: true,
    //        centerTransform: true
    //    });

    //    $scope.canvas1.add(textSample);
    //};

    //$scope.addIText = function (canvas) {
    //    var text = 'Lorem ipsum dolor sit amet,\nconsectetur adipisicing elit,\nsed do eiusmod tempor incididunt\nut labore et dolore magna aliqua.\n' +
    //        'Ut enim ad minim veniam,\nquis nostrud exercitation ullamco\nlaboris nisi ut aliquip ex ea commodo consequat.';

    //    var textSample = new fabric.IText(text.slice(0, getRandomInt(0, text.length)), {
    //        left: getRandomInt(350, 400),
    //        top: getRandomInt(350, 400),
    //        fontFamily: 'helvetica',
    //        angle: getRandomInt(-10, 10),
    //        fill: '#' + getRandomColor(),
    //        scaleX: 0.5,
    //        scaleY: 0.5,
    //        fontWeight: '',
    //        originX: 'left',
    //        hasRotatingPoint: true,
    //        centerTransform: true
    //    });

    //    $scope.canvas1.add(textSample);
    //};









    function addImage(imageName, minScale, maxScale, canvas) {
        var coord = getRandomLeftTop();
        var snamearray = imageName.split('.');
        console.log(snamearray);

        fabric.Image.fromURL('js/fabric/assets/' + imageName, function (image) {

            //image.set({
            //    left: coord.left,
            //    top: coord.top,
            //    angle: getRandomInt(-10, 10)
            //})
            //    .scale(getRandomNum(minScale, maxScale))
            //    .setCoords();
            image.set({ name: snamearray[0], top: 100, left: 150 });
            canvas.add(image);
        });
    };

    function adddynamicImage(imageName, topP, leftP, widthP, HeightP) {

        var snamearray = imageName.split('.');
        console.log(snamearray);

        fabric.Image.fromURL('js/fabric/assets/' + imageName, function (image) {
            image.set({
                name: snamearray[0],
                top: 100,
                left: 150,
                scaleX: 100 / 300,
                scaleY: 150 / 500,
                selectable: true
            });
            canvas.add(image);
        });

        $scope.selectedcanvasImage = "";
        $scope.canvastop = "";
        $scope.canvasleft = "";
        $scope.canvaswidth = "";
        $scope.canvasheight = "";
    };
    $scope.activeObjectTopcanvas1 = '';
    $scope.activeObjectLeftcanvas1 = '';

    $scope.selectedcanvasImage = "";
    $scope.canvastop = "";
    $scope.canvasleft = "";
    $scope.canvaswidth = "";
    $scope.canvasheight = "";
    $scope.setImagePosition = function () {


        adddynamicImage($scope.selectedcanvasImage, $scope.canvastop, $scope.canvasleft, $scope.canvaswidth, $scope.canvasheight);
    }

    $scope.addImage1 = function (canvas) {
        addImage('pug.jpg', 0.1, 0.25, canvas);
    };

    $scope.addImage2 = function (canvas) {
        addImage('logo.png', 0.1, 1, canvas);
    };

    $scope.addImage3 = function (canvas) {
        addImage('printio.png', 0.5, 0.75, canvas);
    };

    $scope.addImage4 = function (canvas) {
        var src = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
        var video1El = document.createElement('video');
        video1El.crossOrigin = 'anonymous';
        video1El.src = src;
        video1El.addEventListener('loadeddata', function () {
            // Video is loaded and can be played
            var coord = getRandomLeftTop();
            var video = new fabric.Image(video1El, {
                left: coord.left,
                top: coord.top,
                angle: getRandomInt(-10, 10)
            });
            canvas.add(video);
        }, false);
        video1El.width = 384;
        video1El.height = 206;
        //video1El.style.display = 'none';
        document.body.appendChild(video1El);
        video1El.load();
    };




    $scope.bringToFrontCanvas1 = function () {
        var activeObject = $scope.canvas1.getActiveObject();
        if (activeObject) {
            $scope.canvas1.bringToFront(activeObject);
            $scope.canvas1.renderAll();
        }
    };


    $scope.sendToBackCanvas1 = function () {
        var activeObject = $scope.canvas1.getActiveObject();
        if (activeObject) {
            $scope.canvas1.sendToBack(activeObject);
            $scope.canvas1.renderAll();
        }
    };





    $scope.imagePositions1 = [];







    function updateImagePosition1(movedObject, canvas) {
        $scope.$apply(function () {
            var existingIndex = $scope.imagePositions1.findIndex(function (obj) {
                return obj.name === movedObject.get('name');
            });

            if (existingIndex !== -1) {
                // Update existing entry
                $scope.imagePositions1[existingIndex] = {
                    name: movedObject.get('name'),
                    position: {
                        top: movedObject.top,
                        left: movedObject.left
                    },
                    size: {
                        width: movedObject.width * movedObject.scaleX,
                        height: movedObject.height * movedObject.scaleY
                    },
                    scale: {
                        scaleX: movedObject.scaleX,
                        scaleY: movedObject.scaleY
                    }
                };
            } else {
                // Add new entry
                $scope.imagePositions1.push({
                    name: movedObject.get('name'),
                    position: {
                        top: movedObject.top,
                        left: movedObject.left
                    },
                    size: {
                        width: movedObject.width * movedObject.scaleX,
                        height: movedObject.height * movedObject.scaleY
                    },
                    scale: {
                        scaleX: movedObject.scaleX,
                        scaleY: movedObject.scaleY
                    }
                });
            }


        });
        if (canvas.getActiveObject() === movedObject) {
            $scope.activeObjectTopcanvas1 = movedObject.top;
            $scope.activeObjectLeftcanvas1 = movedObject.left;


            if ($scope.IsNewStampCreation) {
                $scope.newStampAddUpdateReqObj.StampTop = movedObject.top;
                $scope.newStampAddUpdateReqObj.StampLeft = movedObject.left;
                $scope.newStampAddUpdateReqObj.StampHeight = movedObject.height;
                $scope.newStampAddUpdateReqObj.StampWidth = movedObject.width;
                $scope.newStampAddUpdateReqObj.StampsaxisX == movedObject.scaleX;
                $scope.newStampAddUpdateReqObj.StampsaxisY == movedObject.scaleY;
            } else {
                $scope.selectedCanvasTop = movedObject.top;
                $scope.selectedCanvasLeft = movedObject.left;
                $scope.selectedCanvasHeight = movedObject.height;
                $scope.selectedCanvasWidth = movedObject.width;
                $scope.selectedCanvasscaleX = movedObject.scaleX;
                $scope.selectedCanvasscaleY = movedObject.scaleY;
            }
        }
        $scope.$apply();
    }



    function getNewStampObj() {
        var obj = {
            "UserId": $scope.UserId,
            "OrganizationId": $scope.HospitalId,
            "StampId": 0,
            "StampName": "",
            "S3URL": "",
            "Base64": "",
            "FileName": "",
            "FileExt": "",
            "FindingCategoryId": 0,
            "FindingCategoryName": "",
            "FindingCategoryObj": "",
            "InvestigationId": 0,
            "InvestigationName": "",
            "InvestigationObj": "",
            "FindingValueId": 0,
            "FindingValue": "",
            "StampTop": "",
            "StampLeft": "",
            "StampWidth": "",
            "StampHeight": "",
            "StampsaxisX": "",
            "StampsaxisY": "",
            "DeleteInd": "N",
            "IsPositionChanges": false,
            "CategoryId": 0,
            "CategoryName": "",
            "IsFavorite": false,
            "ConnectFindingValue": false,
            "IsEditUserStamp": false

        };

        return obj;
    }
    $scope.newStampAddUpdateReqObj = getNewStampObj();

    $scope.findingCategorys = [
        {
            "FindingCategoryId": 1,
            "FindingCategoryName": "External Exam"
        },
        {
            "FindingCategoryId": 2,
            "FindingCategoryName": "SLE"
        },
        {
            "FindingCategoryId": 3,
            "FindingCategoryName": "Cross Sectional"
        },
        {
            "FindingCategoryId": 4,
            "FindingCategoryName": "Fundus"
        },
        {
            "FindingCategoryId": 5,
            "FindingCategoryName": "Disc"
        }
    ];

    $scope.changeFindingCategory = function (obj) {
        $scope.newStampAddUpdateReqObj.FindingCategoryId = obj.FindingCategoryId;
        $scope.newStampAddUpdateReqObj.FindingCategoryName = obj.FindingCategoryName;
    };
    $scope.changeFindingInvestigation = function (obj) {
        $scope.newStampAddUpdateReqObj.InvestigationId = obj.InvestigationId;
        $scope.newStampAddUpdateReqObj.InvestigationName = obj.InvestigationName;
    };

    $scope.findingInvestigations = [
        {
            "InvestigationId": 1,
            "CategoryId": 1,
            "InvestigationName": "Lids",
        },
        {
            "InvestigationId": 2,
            "CategoryId": 1,
            "InvestigationName": "Lashes",
        },
        {
            "InvestigationId": 3,
            "CategoryId": 1,
            "InvestigationName": "Adnexa",
        },
        {
            "InvestigationId": 4,
            "CategoryId": 2,
            "InvestigationName": "Conjuctiva",
        },
        {
            "InvestigationId": 5,
            "CategoryId": 2,
            "InvestigationName": "Sclera",
        },
        {
            "InvestigationId": 6,
            "CategoryId": 3,
            "InvestigationName": "Cornea",
        },
        {
            "InvestigationId": 7,
            "CategoryId": 4,
            "InvestigationName": "Macula",
        }
    ]

    $scope.IsMandatoryFinding = true;
    $scope.saveStamp = function (canvas, valbol) {


        var data = "";
        if ($scope.newStampAddUpdateReqObj.StampId === 0) {


            var boundingBox = $scope.canvas1.getObjects().reduce(function (acc, obj) {
                var rect = obj.getBoundingRect();
                acc.left = Math.min(acc.left, rect.left);
                acc.top = Math.min(acc.top, rect.top);
                acc.width = Math.max(acc.width, rect.left + rect.width);
                acc.height = Math.max(acc.height, rect.top + rect.height);
                return acc;
            }, { left: Infinity, top: Infinity, width: -Infinity, height: -Infinity });


            // Create a new canvas with the dimensions of the bounding box
            var shapeCanvas = new fabric.StaticCanvas(null, { width: boundingBox.width, height: boundingBox.height });

            // Iterate through the objects on the original canvas and copy them to the new canvas
            $scope.canvas1.forEachObject(function (obj) {
                var clonedObj = obj.clone(function (clone) {
                    shapeCanvas.add(clone.set({
                        left: obj.left - boundingBox.left,
                        top: obj.top - boundingBox.top
                    }));
                });
            });
            data = shapeCanvas.toDataURL({ format: 'png', multiplier: 1 });

            $scope.newStampAddUpdateReqObj.StampName = $scope.newStampAddUpdateReqObj.StampName || "";
            $scope.newStampAddUpdateReqObj.FindingCategoryId = $scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryId || "";
            $scope.newStampAddUpdateReqObj.FindingCategoryName = $scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryName || "";
            if ($scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryObj == "") {
                alertify.error("Please Select Body Part");
                return false;
            }
            if ($scope.newStampAddUpdateReqObj.StampName == "") {
                alertify.error("Please enter stamp name");
                return false;
            }
            //if ($scope.newStampAddUpdateReqObj.ConnectFindingValue) {
            //    if ($scope.newStampAddUpdateReqObj.FindingCategoryId == "") {
            //        alertify.error("Please select category");
            //        return false;
            //    }
            //    //if ($scope.newStampAddUpdateReqObj.InvestigationId == 0) {
            //    //    alertify.error("please select Investigation");
            //    //    return false;
            //    //}

            //    if ($scope.newStampAddUpdateReqObj.FindingValue == "") {
            //        alertify.error("Please select finding value");
            //        return false;
            //    }
            //}

        } else {
            $scope.canvas1.setBackgroundImage(null, $scope.canvas1.renderAll.bind($scope.canvas1));
            data = $scope.canvas1.toDataURL({ multiplier: null, format: 'png' });
            $scope.newStampAddUpdateReqObj.IsPositionChanges = true;
        }



        console.log($scope.newStampAddUpdateReqObj);



        $scope.newStampAddUpdateReqObj.Base64 = data;
        $scope.newStampAddUpdateReqObj.FileName = $scope.newStampAddUpdateReqObj.StampName.replace(/[^a-zA-Z0-9]/g, '') + ".png";
        $scope.newStampAddUpdateReqObj.FileExt = ".png";
        $scope.newStampAddUpdateReqObj.FindingCategoryObj = "";
        $scope.newStampAddUpdateReqObj.FindingValueObj = "";
        $scope.newStampAddUpdateReqObj.InvestigationObj = "";



        eHnotePatientDataService.addUpdateOrganizationFindingStamps($scope.newStampAddUpdateReqObj).then(function (resp) {
            console.log(resp);
            if (resp.data.Status == "Success") {
                alertify.success("Stamp saved successfully")
                $scope.newStampAddUpdateReqObj = getNewStampObj();
                $scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryId = "";
                $scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryName = "";
                $scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryObj = '';
                $scope.activateCursorTab();
                $scope.getOrganizationFindingStamps();
                $scope.getUserFavoriteStamps();
                $scope.IsNewStampCreation = false;
                $scope.IsShowStampList = true;
                $scope.newStampAddUpdateReqObj.IsEditUserStamp = false;
                $scope.canvas1.clear();
            } else {
                alertify.error('Stamp Already Created for this Finding');
            }
        }, function (err) {
            alertify.error(err.Messege);
        });
    };



    $scope.getMasterFindingValues = function (val) {

        $scope.SearchText = val || "";
        //$scope.CategoryId = $scope.newStampAddUpdateReqObj.FindingCategoryId || 0;
        //$scope.FindingId = $scope.newStampAddUpdateReqObj.InvestigationId || 0;

        $scope.CategoryId = 0;
        $scope.FindingId = 0;
        var params = {
            "CategoryId": $scope.CategoryId || 0,
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

    $scope.maxSize = 10;
    $scope.OrgFindStampsPage = 1;
    $scope.getOrgFindStampsReq = {
        "OrganizationId": $scope.HospitalId,
        "PageSize": 500,
        "PageNumber": 1,
        "SearchText": "",
        "FindingCategoryId": 0,
        "InvestigationId": 0
    };

    $scope.OrgStampsArray = [];
    $scope.ExaminationCategoryIdFilter = 0;
    $scope.getOrganizationFindingStamps = function () {
        if ($scope.ExaminationCategoryIdFilter != 0) {
            $scope.getOrgFindStampsReq.FindingCategoryId = $scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryId || 0;
        } else {
            $scope.getOrgFindStampsReq.FindingCategoryId = 0;
        }
        if ($scope.OrgFindStampsPage != 1) {
            $scope.getOrgFindStampsReq.PageNumber = $scope.OrgFindStampsPage || 1;
        }
        console.log($scope.getOrgFindStampsReq);

        eHnotePatientDataService.GetOrganizationFindingStamps($scope.getOrgFindStampsReq).then(function (resp) {
            console.log(resp);
            if (resp.data.Status == "Success") {
                $scope.totalItems = resp.data.count;
                $scope.ExaminationCategoryIdFilter = 0;
                $scope.OrgStampsArray = resp.data.rows || [];
                if ($scope.OrgStampsArray.length > 0) {
                    angular.forEach($scope.OrgStampsArray, function (ositem) {
                        ositem.isChecked = false;
                        ositem.IsFavoriteInd = ositem.IsFavoriteInd || false;
                    });
                    if ($scope.UserStampsArray.length > 0) {
                        angular.forEach($scope.UserStampsArray, function (ssitem) {
                            angular.forEach($scope.OrgStampsArray, function (ositem) {
                                if (ositem.StampId == ssitem.StampId) {/*ositem.isChecked = false;*/
                                    ositem.IsFavoriteInd = true;
                                }
                            });
                        });
                    }
                    $scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryId = $scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryId || 0;
                    if ($scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryId !== 0) {
                        $scope.UserStampsArray = $filter("filter")($scope.UserStampsArray, function (fitem, index) { return fitem.FindingCategoryId === $scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryId }) || [];
                    }
                }
            }
        }, function (err) {
            alertify.error(err.Messege);
        });
    };


    $scope.patientAllFindingsArray = [];
    $scope.GetPatientAdvisedInvestigationStamps = function () {

        //var params = { "AppointmentId": 1240816, "PatientId": 442035 };

        var params = { "AppointmentId": $scope.cacheStorageItem.AppointmentId, "PatientId": $scope.cacheStorageItem.PatientID };


        eHnotePatientDataService.GetPatientAdvisedInvestigationStamps(params).then(function (resp) {
            console.log(resp);

            if (resp.data.Status == "Success") {
                resp.data.rows = resp.data.rows || [];
                if (resp.data.rows.length > 0) {
                    $scope.patientAllFindingsArray = resp.data.rows;


                }
            }
        }, function (err) {
            alertify.error(err.Messege);
        });
    };



    $scope.patientExaminationImagesArray = [];
    $scope.GetpatientExaminationImagesArray = function () {



        var params = { "AppointmentId": $scope.cacheStorageItem.AppointmentId, "PatientId": $scope.cacheStorageItem.PatientID };


        eHnotePatientDataService.GetPatientApptExaminationFiles(params).then(function (resp) {
            console.log(resp);
            $scope.patientExaminationImagesArray = [];
            if (resp.data.status == "Success") {
                resp.data.rows = resp.data.rows || [];
                if (resp.data.rows.length > 0) {
                    $scope.patientExaminationImagesArray = resp.data.rows;


                }
            }
        }, function (err) {
            alertify.error(err.Messege);
        });
    };


    $scope.mainExaminationArray = [];


    $scope.getMasterExaminationCategoryData = function () {

        var object = {
            "OrganizationId": $scope.HospitalId
        }
        eHnoteSettingsDataService.GetMasterExaminationCategoryData(object).success(function (response) {

            console.log(response);
            if (response.rows.length > 0) {
                $scope.mainExaminationArray = response.rows || [];
            }

        }).error(function (error) {
            console.log(error);
        });
    };


    $scope.getUserFavoriteStamps = function () {
        $scope.UserStampsArray = [];
        var params = {
            "UserId": $scope.UserId
        };

        eHnotePatientDataService.GetUserFavFindingStamps(params).then(function (resp) {
            console.log(resp);
            if (resp.data.status == "Success") {
                $scope.UserStampsArray = resp.data.rows || [];
                if ($scope.UserStampsArray.length > 0 && $scope.OrgStampsArray.length > 0) {
                    angular.forEach($scope.OrgStampsArray, function (ositem) {
                        ositem.IsFavoriteInd = false;
                    })
                    angular.forEach($scope.UserStampsArray, function (ssitem) {
                        angular.forEach($scope.OrgStampsArray, function (ositem) {
                            if (ositem.StampId == ssitem.StampId) {/*ositem.isChecked = false;*/
                                ositem.IsFavoriteInd = true;
                            }
                        });
                    });
                }
            }
        }, function (err) {
            alertify.error(err.Messege);
        });
    }

    $scope.init = function () {
        $scope.getMasterExaminationCategoryData();
        $scope.getOrganizationFindingStamps();
        $scope.GetPatientAdvisedInvestigationStamps();
        $scope.GetpatientExaminationImagesArray();
        $scope.getUserFavoriteStamps();
    }

    $scope.init();

    $scope.changeSelectedStampObj = function (mainobj) {

        console.log(mainobj);

        var ttop = "100";
        mainobj.StampTop = mainobj.StampTop || "";
        mainobj.Top = mainobj.Top || "";

        if (mainobj.StampTop != "" || mainobj.Top !== "") {
            if (mainobj.StampTop == "" && mainobj.Top !== "") {
                ttop = mainobj.Top;
            } else {
                ttop = mainobj.StampTop;
            }
        }




        var tLeft = "150";
        mainobj.StampLeft = mainobj.StampLeft || "";
        mainobj.Left = mainobj.Left || "";

        if (mainobj.StampLeft !== "" || mainobj.Left !== "") {
            if (mainobj.StampLeft == "" && mainobj.Left !== "") {
                tLeft = mainobj.Left;
            } else {
                tLeft = mainobj.StampLeft;
            }
        }


        ttop = parseInt(ttop);
        tLeft = parseInt(tLeft);
        convertImageUrlToBase64(mainobj.S3URL, function (base64Image) {
            fabric.Image.fromURL(base64Image, function (image) {

                //image.set({
                //    left: coord.left,
                //    top: coord.top,
                //    angle: getRandomInt(-10, 10)
                //})
                //    .scale(getRandomNum(minScale, maxScale))
                //    .setCoords();
                image.set({ name: mainobj.FileName, top: ttop, left: tLeft });
                $scope.canvas1.add(image);
                updateImagePosition1(image, $scope.canvas1);
            });
        });
    };


    $scope.changebgImage = function (mainobj) {

        console.log(mainobj);
        canvas.clear();
        convertImageUrlToBase64(mainobj.S3URL, function (base64Image) {
            fabric.Image.fromURL(base64Image, function (img) {
                img.set({
                    crossOrigin: 'anonymous', // Ensure CORS is set appropriately
                    scaleX: $scope.canvas1.width / img.width,
                    scaleY: $scope.canvas1.height / img.height
                });
                $scope.canvas1.setBackgroundImage(img, $scope.canvas1.renderAll.bind($scope.canvas1));
            });
        });



    };

    function convertImageUrlToBase64(imageUrl, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', imageUrl);
        xhr.responseType = 'blob';
        xhr.send();
    }





    $scope.saveCanvasPosition = function (mainobj, canvas) {

        $scope.newStampAddUpdateReqObj = getNewStampObj();
        $scope.newStampAddUpdateReqObj.UserId = $scope.UserId;
        $scope.newStampAddUpdateReqObj.StampId = mainobj.StampId;
        $scope.newStampAddUpdateReqObj.StampName = mainobj.StampName;
        $scope.newStampAddUpdateReqObj.S3URL = mainobj.S3URL;
        $scope.newStampAddUpdateReqObj.Base64 = "";
        $scope.newStampAddUpdateReqObj.FileName = mainobj.FileName;
        $scope.newStampAddUpdateReqObj.FileExt = mainobj.FileExt;
        $scope.newStampAddUpdateReqObj.FindingCategoryId = mainobj.FindingCategoryId;
        $scope.newStampAddUpdateReqObj.FindingCategoryName = mainobj.FindingCategoryName;
        $scope.newStampAddUpdateReqObj.InvestigationId = mainobj.InvestigationId;
        $scope.newStampAddUpdateReqObj.InvestigationName = mainobj.InvestigationName;
        $scope.newStampAddUpdateReqObj.FindingValueId = mainobj.FindingValueId;
        $scope.newStampAddUpdateReqObj.FindingValue = mainobj.FindingValue;
        $scope.newStampAddUpdateReqObj.StampTop = $scope.selectedCanvasTop;
        $scope.newStampAddUpdateReqObj.StampLeft = $scope.selectedCanvasLeft;
        $scope.newStampAddUpdateReqObj.StampHeight = $scope.selectedCanvasHeight;
        $scope.newStampAddUpdateReqObj.StampWidth = $scope.selectedCanvasWidth;
        $scope.newStampAddUpdateReqObj.StampsaxisX = $scope.selectedCanvasscaleX;
        $scope.newStampAddUpdateReqObj.StampsaxisY = $scope.selectedCanvasscaleY;
        $scope.newStampAddUpdateReqObj.DeleteInd = "N";






        canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));



        var data = canvas.toDataURL({ multiplier: null, format: 'png' });
        $scope.newStampAddUpdateReqObj.Base64 = data;
        $scope.newStampAddUpdateReqObj.IsPositionChanges = true;
        console.log($scope.newStampAddUpdateReqObj);

        eHnotePatientDataService.addUpdateOrganizationFindingStamps($scope.newStampAddUpdateReqObj).then(function (resp) {
            console.log(resp);
            if (resp.data.Status == "Success") {
                alertify.success("Stamp saved successfully")
                $scope.newStampAddUpdateReqObj = getNewStampObj();
            }
        }, function (err) {
            alertify.error(err.Messege);
        });
    }







    // Keyboard shortcut handling
    window.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.key === 'c') {
            $scope.copyObjectImage();
        }
    });


    // Keyboard shortcut handling
    window.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.key === 'v') {
            var pointer = $scope.canvas1.getPointer(event.e);

            console.log($scope.addUpdateExaminationDrawingReqObj.copiedImage);

            if ($scope.addUpdateExaminationDrawingReqObj.copiedImage) {
                $scope.addUpdateExaminationDrawingReqObj.copiedImage.clone(function (cloned) {
                    $scope.canvas1.add(cloned.set({
                        top: pointer.y,
                        left: pointer.x
                    }));
                });
            }
        }
    });


    $scope.copyObjectImage = function () {
        var activeObject = $scope.canvas1.getActiveObject();

        console.log(activeObject);
        // activeObject.type === 'image'
        if (activeObject) {
            $scope.addUpdateExaminationDrawingReqObj.copiedImage = activeObject;

            console.log($scope.addUpdateExaminationDrawingReqObj.copiedImage);
        }
    };




    $scope.activeFindingTab = 2;
    $scope.switchtoActiveFindingTab = function (tabno) {
        $scope.activeFindingTab = tabno;

        if ($scope.activeFindingTab === 2) {
            $scope.getUserFavoriteStamps();
        }
    }

    //$scope.Createnewstamp = function () {

    //    var Obj = {
    //        "UserId": 3,
    //        "HospitalId": 3,
    //        "AppointmentId": 1,
    //        "PatientId": 1
    //    }
    //    $scope.addUpdateExaminationDrawingReqObj = getnewAddUpdateExamDrawingobj();
    //    $scope.canvas1.clear();
    //    $scope.mInstanceAdd = $uibModal.open({
    //        "templateUrl": "templates/uibpopups/Createnewstamp.html",
    //        "backdrop": "static",
    //        "keyboard": false,
    //        "scope": $scope,
    //        "windowClass": "offcanves-right   active",
    //        "resolve": {
    //            "ParentObj": function () { return Obj; },
    //        },
    //        "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
    //            $scope.closeuib = function () {
    //                $uibModalInstance.dismiss("cancel");
    //                $scope.addUpdateExaminationDrawingReqObj = getnewAddUpdateExamDrawingobj();
    //                $scope.canvas1.clear();
    //            };
    //        }
    //    });
    //    $scope.mInstanceAdd.result.then(function (resp) {
    //        console.log("stamp popup close");
    //    }, function (cancel) {
    //    });
    //};

    $scope.cursorActiveTab = 1;
    $scope.swiitchCursorActiveTab = function (tabno) {

        $scope.cursorActiveTab = tabno;
        $scope.setFreeDrawingMode(false);
        if ($scope.cursorActiveTab === 2) {//Rectangle
            $scope.addUpdateExaminationDrawingReqObj.copiedImage = null;
            $scope.addShapes('Rectangle');
        }
        else if ($scope.cursorActiveTab === 3) {//Circle
            $scope.addUpdateExaminationDrawingReqObj.copiedImage = null;
            $scope.addShapes('Circle');
        }
        else if ($scope.cursorActiveTab === 4) {//Line
            $scope.addUpdateExaminationDrawingReqObj.copiedImage = null;
            $scope.addShapes('Line');
        }
        else if ($scope.cursorActiveTab === 5) {//Text
            $scope.addUpdateExaminationDrawingReqObj.copiedImage = null;
            $scope.addShapes('Text');
        }
        else if ($scope.cursorActiveTab === 6) {//Draw Pencil

            $scope.addUpdateExaminationDrawingReqObj.copiedImage = null;
            $scope.setFreeDrawingMode(true);
        }
        else if ($scope.cursorActiveTab === 7) {//Fill Color
            $scope.addUpdateExaminationDrawingReqObj.copiedImage = null;
            $scope.AddFillcolor();
        }
        else if ($scope.cursorActiveTab === 8) {//Triangle
            $scope.addUpdateExaminationDrawingReqObj.copiedImage = null;
            $scope.addShapes('Triangle')
        }

        else if ($scope.cursorActiveTab === 9) {//Undo
            $scope.addUpdateExaminationDrawingReqObj.copiedImage = null;
            $scope.undoCanvas();
        }
        else if ($scope.cursorActiveTab === 10) {//Redo
            $scope.addUpdateExaminationDrawingReqObj.copiedImage = null;
            $scope.redoCanvas();
        }
        else if ($scope.cursorActiveTab === 11) {//Bring to Front
            $scope.addUpdateExaminationDrawingReqObj.copiedImage = null;
            $scope.bringToFrontCanvas1();
        }
        else if ($scope.cursorActiveTab === 12) {//Send to Back
            $scope.addUpdateExaminationDrawingReqObj.copiedImage = null;
            $scope.sendToBackCanvas1();
        }
        else if ($scope.cursorActiveTab === 13) {//Copy
            $scope.addUpdateExaminationDrawingReqObj.copiedImage = null;
            $scope.copyObjectImage();
        }
        else if ($scope.cursorActiveTab === 14) {//Clear

            $scope.clearCanvasTotal();
        }
        else if ($scope.cursorActiveTab === 15) {//Erase
            $scope.addUpdateExaminationDrawingReqObj.copiedImage = null;
            $scope.AddEraser();
        }
        else if ($scope.cursorActiveTab === 16) {//Arrow
            $scope.addUpdateExaminationDrawingReqObj.copiedImage = null;
            $scope.addShapes('Arrow');
        }
        else {//Cursor
            $scope.activateCursorTab();
        }
    };

    $scope.ShapesObj = {
        'isAddingCircle': false,
        'isAddingRect': false,
        'isAddingTriangle': false,
        'isAddingLine': false,
        'isAddingArrow': false,
        'isPencilDraw': false,
        'isTextDraw': false,
        "isBorderColorEnabled": true,
        "isFillColorEnabled": false,
        "isBorderColor": 'black',
        "isFillColor": ''
    };


    $scope.AddFillcolor = function () {
        $scope.ShapesObj.isFillColorEnabled = true;
        $scope.ShapesObj.isBorderColorEnabled = false;
    };

    $scope.changeSelectedBorderColor = function (color) {
        $scope.selectedBorderColorNew = color || "";

        if ($scope.ShapesObj.isBorderColorEnabled) {
            $scope.ShapesObj.isBorderColor = $scope.selectedBorderColorNew;
        } else {
            $scope.ShapesObj.isFillColor = $scope.selectedBorderColorNew;
        }
        $scope.setDrawingLineColor($scope.selectedBorderColorNew);
    };

    $scope.addShapes = function (Shape) {
        if (Shape == 'Circle') {
            $scope.ShapesObj.isAddingCircle = true;
        } else {
            $scope.ShapesObj.isAddingCircle = false;
        }
        if (Shape == 'Rectangle') {
            $scope.ShapesObj.isAddingRect = true;
        } else {
            $scope.ShapesObj.isAddingRect = false;
        }
        if (Shape == 'Triangle') {
            $scope.ShapesObj.isAddingTriangle = true;
        } else {
            $scope.ShapesObj.isAddingTriangle = false;
        }
        if (Shape == 'Line') {
            $scope.ShapesObj.isAddingLine = true;
        } else {
            $scope.ShapesObj.isAddingLine = false;
        }
        if (Shape == 'Arrow') {
            $scope.ShapesObj.isAddingArrow = true;
        } else {
            $scope.ShapesObj.isAddingArrow = false;
        }
        if (Shape == 'Text') {
            $scope.ShapesObj.isTextDraw = true;
        } else {
            $scope.ShapesObj.isTextDraw = false;
        }
        $scope.ShapesObj.isFillColorEnabled = false;
        $scope.ShapesObj.isBorderColorEnabled = true;
        $scope.ShapesObj.isFillColor = '';
        $scope.ShapesObj.isBorderColor = 'black';
    };



    $scope.AddEraser = function () {
        $scope.canvas1.on('path:created', function (opt) {
            const path = opt.path;
            path.selectable = false;
        });

        $scope.canvas1.freeDrawingBrush = new fabric.PencilBrush($scope.canvas1);
        $scope.canvas1.freeDrawingBrush.width = 10;
        $scope.canvas1.freeDrawingBrush.color = 'white';
        $scope.canvas1.isDrawingMode = true;

    };

    $scope.activateCursorTab = function () {
        $scope.setFreeDrawingMode(false);
        $scope.addUpdateExaminationDrawingReqObj.copiedImage = null;
        $scope.selectedColor = "";
        $scope.selectedBorderColor = "";
        //$timeout(function () {
        //    $scope.canvas1.discardActiveObject();
        //    $scope.canvas1.renderAll();
        //});
    }

    function getnewAddUpdateExamDrawingobj() {
        var obj = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "ExaminationCategoryId": "",
            "ExaminationCategoryObj": "",
            "ExaminationCategoryName": "",
            "FindingValueSearchObj": "",
            "Base64": "",
            "PatientFileId": 0,
            "FileTypeId": 16,
            "S3URL": "",
            "FileName": "",
            "FileExt": "",
            "FileDeleteInd": "N",
            "FindingList": [],
            "SelectedFindingValues": [],
            "SelectedFindingObj": "",
            "AppointmentId": $scope.cacheStorageItem.AppointmentId,
            "PatientId": $scope.cacheStorageItem.PatientID,
            "ConsultationId": $scope.cacheStorageItem.ConsultationID,
            "PatientFindingValues": [],
            "LFindingValueSearchObj": "",
            "copiedImage": "",
            "IsClickSaveAscDrawingpadBtn": false,
        };
        return obj;
    }

    $scope.addUpdateExaminationDrawingReqObj = getnewAddUpdateExamDrawingobj();





    $scope.SearchExaminationCategoryFindingValues = function (val) {


        if ($scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryId == "") {
            alertify.error("please select a category");
            return;
        }
        var val = val || "";


        var findingIdLists = "";
        //for (var i in $scope.addUpdateExaminationDrawingReqObj.FindingList) {
        //    findingIdLists += "," + $scope.addUpdateExaminationDrawingReqObj.FindingList[i].FindingId;
        //}

        angular.forEach($scope.addUpdateExaminationDrawingReqObj.FindingList, function (eobj) {
            findingIdLists += "," + eobj.FindingId;
        });
        if (findingIdLists.charAt(0) === ",") {
            findingIdLists = findingIdLists.slice(1);
        }



        var params = {
            "OrganizationId": 3,
            "FindingIdList": findingIdLists,
            "PageSize": 20,
            "PageNumber": 1,
            "SearchText": val
        }
        return eHnoteMainAppointmentService.SearchCategoryWiseFindingValues(params).then(function (resp) {
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
    /* $scope.SearchExaminationCategoryFindingValues();*/

    $scope.onSelectFindingValues = function (item, organid) {
        console.log(item);

        var obj = {
            "PatientFinding_AnteriorSegmentId": 0,
            "PatientFindingValueId": 0,
            "CategoryId": item.CategoryId,
            "CategoryName": item.CategoryName,
            "FindingId": item.FindingId,
            "FindingName": item.FindingName,
            "FindingValueId": item.InvFindingId,
            "FindingValueName": item.FindingValue,
            "StampId": item.StampId || 0,
            "S3URL": item.StampS3URL || "",
            "Top": item.StampTop || "",
            "Left": item.StampLeft || "",
            "Width": item.StampWidth || "",
            "Height": item.StampHeight || "",
            "Xaxis": item.StampsaxisX || "",
            "Yaxis": item.StampsaxisY || "",
            "OrganId": organid,
            "OrganName": "",
            "DeleteInd": "N"
        };
        $scope.newStampAddUpdateReqObj.CategoryId = item.CategoryId || 0;
        $scope.newStampAddUpdateReqObj.CategoryName = item.CategoryName || '';

        var filterpossiable = $filter("filter")(item.StampsArray, { "OrganId": organid }, true) || [];
        if (filterpossiable.length > 0) {
            obj.StampId = filterpossiable[0].StampId || 0;
            obj.S3URL = filterpossiable[0].StampS3URL || "";
            obj.Top = filterpossiable[0].StampTop || "";
            obj.Left = filterpossiable[0].StampLeft || "";
            obj.Width = filterpossiable[0].StampWidth || "";
            obj.Height = filterpossiable[0].StampHeight || "";
            obj.Xaxis = filterpossiable[0].StampsaxisX || "";
            obj.Yaxis = filterpossiable[0].StampsaxisY || "";
        }

        if (organid === 1) { obj.OrganName = "OD"; } else { obj.OrganName = "OS"; }
        var count = [];
        if ($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues.length > 0) {
            count = $filter("filter")($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues, function (fitem, index) { return fitem.FindingValueId === item.InvFindingId && fitem.OrganId === organid }) || [];
            //"FindingValueId": 14,
            //    InvFindingId
        }
        if (count.length == 0) {
            $scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues.push(obj)
            if (obj.S3URL != "") {
                $scope.changeSelectedStampObj(obj);
            }
        } else {
            alertify.error("This Item is Already Added");
        }
        $scope.addUpdateExaminationDrawingReqObj.FindingValueSearchObj = "";
        $scope.addUpdateExaminationDrawingReqObj.LFindingValueSearchObj = "";



    };

    $scope.CurentappointmentAnteriorSegmentArrayNew = [];
    $scope.CurentappointmentPoteriorSegmentArrayNew = [];
    $scope.selectedCategoryFindingsList = [];
    $scope.changeMainExaminationCategory = function (mainobj) {
        console.log(mainobj);
        if (!$scope.newStampAddUpdateReqObj.IsEditUserStamp) {
            $scope.newStampAddUpdateReqObj = getNewStampObj();
            $scope.canvas1.clear();
        }
        $scope.addUpdateExaminationDrawingReqObj.S3URL = mainobj.S3URL;

        $scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryId = mainobj.ExaminationCategoryId;
        $scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryName = mainobj.ExaminationCategoryName;
        $scope.addUpdateExaminationDrawingReqObj.FindingList = [];
        $scope.CurentappointmentAnteriorSegmentArrayNew = [];
        $scope.CurentappointmentPoteriorSegmentArrayNew = [];
        $scope.addUpdateExaminationDrawingReqObj.FindingList = mainobj.Findinds || [];
        $scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues = [];
        $scope.ExaminationCategoryIdFilter = mainobj.ExaminationCategoryId || 0;
        $scope.getUserFavoriteStamps();
        $scope.getOrganizationFindingStamps();
        $scope.changebgImage($scope.addUpdateExaminationDrawingReqObj);
        //if ($scope.AnteriorSegmentArrayNew.length > 0) {
        //    angular.forEach($scope.addUpdateExaminationDrawingReqObj.FindingList, function (fitem) {
        //        angular.forEach($scope.AnteriorSegmentArrayNew, function (aitem) {
        //            if (aitem.ActiveInd == "Y") {
        //                if (aitem.InvestigationId == fitem.FindingId) {
        //                    /* filteredFindings.push(aitem);*/
        //                    /* var count = $filter("filter")(filteredFindings, function (fitem, index) { return fitem.FindingValueId === item.InvFindingId && fitem.OrganId === aitem.OrganId }) || [];*/
        //                    $scope.CurentappointmentAnteriorSegmentArrayNew.push(aitem);
        //                }
        //            }
        //        });
        //    });
        //    if ($scope.CurentappointmentAnteriorSegmentArrayNew.length > 0) {
        //        angular.forEach($scope.CurentappointmentAnteriorSegmentArrayNew, function (caitem) {
        //            var organid = 0
        //            if (caitem.RemarksArray.length > 0) {
        //                angular.forEach(caitem.RemarksArray, function (caritem) {
        //                    organid = caritem.OrganId
        //                    var obj = {
        //                        "PatientFinding_AnteriorSegmentId": caritem.PatientFinding_AnteriorSegmentId ||0,
        //                        "PatientFindingValueId": caritem.RemarksId || 0,
        //                        "CategoryId": caitem.CategoryId,
        //                        "CategoryName": caitem.CategoryDesc,
        //                        "FindingId": caitem.InvestigationId,
        //                        "FindingName": caitem.InvestigationDesc,
        //                        "FindingValueId": caritem.InvFindingId,
        //                        "FindingValueName": caritem.FindingValue,
        //                        "StampId": caitem.StampId || 0,
        //                        "S3URL": caitem.StampS3URL || "",
        //                        "Top": caitem.StampTop || "",
        //                        "Left": caitem.StampLeft || "",
        //                        "Width": caitem.StampWidth || "",
        //                        "Height": caitem.StampHeight || "",
        //                        "Xaxis": caitem.StampsaxisX || "",
        //                        "Yaxis": caitem.StampsaxisY || "",
        //                        "OrganId": organid,
        //                        "OrganName": "",
        //                        "DeleteInd": "N"
        //                    };

        //                    if (caritem.ActiveInd=="N") {
        //                        obj.DeleteInd = "Y";
        //                    }
        //                    var filterpossiable = $filter("filter")(caritem.StampsArray, { "OrganId": organid }, true) || [];
        //                    if (filterpossiable.length > 0) {
        //                        obj.StampId = filterpossiable[0].StampId || 0;
        //                        obj.S3URL = filterpossiable[0].StampS3URL || "";
        //                        obj.Top = filterpossiable[0].StampTop || "";
        //                        obj.Left = filterpossiable[0].StampLeft || "";
        //                        obj.Width = filterpossiable[0].StampWidth || "";
        //                        obj.Height = filterpossiable[0].StampHeight || "";
        //                        obj.Xaxis = filterpossiable[0].StampsaxisX || "";
        //                        obj.Yaxis = filterpossiable[0].StampsaxisY || "";



        //                    }

        //                    if ($scope.patientAllFindingsArray.length > 0) {

        //                        var filteredFindingValArray = $filter("filter")($scope.patientAllFindingsArray, function (fitem) {
        //                            return fitem.FindingValueId === caritem.InvFindingId && fitem.OrganId === caritem.OrganId;
        //                        });
        //                        filteredFindingValArray = filteredFindingValArray || [];
        //                        console.log(filteredFindingValArray);
        //                        console.log("inside filter");
        //                        if (filteredFindingValArray.length > 0) {
        //                            obj.FindingName = filteredFindingValArray[0].InvestigationDesc || "";
        //                            obj.S3URL = filteredFindingValArray[0].S3URL || "";
        //                            obj.Top = filteredFindingValArray[0].StampTop || "";
        //                            obj.Left = filteredFindingValArray[0].StampLeft || "";
        //                            obj.Width = filteredFindingValArray[0].StampWidth || "";
        //                            obj.Height = filteredFindingValArray[0].StampHeight || "";
        //                            obj.Xaxis = filteredFindingValArray[0].StampsaxisX || "";
        //                            obj.Yaxis = filteredFindingValArray[0].StampsaxisY || "";
        //                        }
        //                    }

        //                    var pcount = [];
        //                    if ($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues.length > 0) {
        //                        //pcount = $filter("filter")($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues, function (fitem, index) { return (fitem.FindingValueId === caritem.InvFindingId && fitem.OrganId === organid) || (fitem.StampId === obj.StampId) }) || [];
        //                        pcount = $filter("filter")($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues, function (fitem, index) {
        //                            if (obj.StampId === 0) {

        //                                return (fitem.FindingValueId === caritem.InvFindingId && fitem.OrganId === organid);
        //                            } else {
        //                                return (fitem.FindingValueId === caritem.InvFindingId && fitem.OrganId === organid) ||(fitem.StampId === obj.StampId);
        //                            }
        //                        }) || [];

        //                    }
        //                    if (pcount.length == 0) {
        //                        //$timeout(function () {
        //                        //    $scope.changeSelectedStampObj(obj);
        //                        //}, 500);
        //                        $scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues.push(obj)
        //                    }
        //                });
        //            }




        //        });
        //    }
        //}

        //if ($scope.PoteriorSegmentArrayNew.length > 0) {
        //    angular.forEach($scope.addUpdateExaminationDrawingReqObj.FindingList, function (fitem) {
        //        angular.forEach($scope.PoteriorSegmentArrayNew, function (aitem) {
        //            if (aitem.ActiveInd == "Y") {
        //                if (aitem.InvestigationId == fitem.FindingId) {
        //                    /* filteredFindings.push(pitem);*/
        //                    $scope.CurentappointmentPoteriorSegmentArrayNew.push(aitem);
        //                }
        //            }
        //        });
        //    });
        //    if ($scope.CurentappointmentPoteriorSegmentArrayNew.length > 0) {
        //        angular.forEach($scope.CurentappointmentPoteriorSegmentArrayNew, function (cpitem) {
        //            var organid = 0
        //            if (cpitem.RemarksArray.length > 0) {
        //                angular.forEach(cpitem.RemarksArray, function (cpritem) {
        //                    organid = cpritem.OrganId
        //                    var obj = {
        //                        "PatientFinding_AnteriorSegmentId": caritem.PatientFinding_AnteriorSegmentId || 0,
        //                        "PatientFindingValueId": caritem.RemarksId || 0,
        //                        "CategoryId": cpitem.CategoryId,
        //                        "CategoryName": cpitem.CategoryDesc,
        //                        "FindingId": cpitem.InvestigationId,
        //                        "FindingName": cpitem.InvestigationDesc,
        //                        "FindingValueId": cpritem.InvFindingId,
        //                        "FindingValueName": cpritem.FindingValue,
        //                        "StampId": cpitem.StampId || 0,
        //                        "S3URL": cpitem.StampS3URL || "",
        //                        "Top": cpitem.StampTop || "",
        //                        "Left": cpitem.StampLeft || "",
        //                        "Width": cpitem.StampWidth || "",
        //                        "Height": cpitem.StampHeight || "",
        //                        "Xaxis": cpitem.StampsaxisX || "",
        //                        "Yaxis": cpitem.StampsaxisY || "",
        //                        "OrganId": organid,
        //                        "OrganName": "",
        //                        "DeleteInd": "N"
        //                    };
        //                    var filterpossiable = $filter("filter")(cpritem.StampsArray, { "OrganId": organid }, true) || [];
        //                    if (filterpossiable.length > 0) {
        //                        obj.StampId = filterpossiable[0].StampId || 0;
        //                        obj.S3URL = filterpossiable[0].StampS3URL || "";
        //                        obj.Top = filterpossiable[0].StampTop || "";
        //                        obj.Left = filterpossiable[0].StampLeft || "";
        //                        obj.Width = filterpossiable[0].StampWidth || "";
        //                        obj.Height = filterpossiable[0].StampHeight || "";
        //                        obj.Xaxis = filterpossiable[0].StampsaxisX || "";
        //                        obj.Yaxis = filterpossiable[0].StampsaxisY || "";



        //                    }

        //                    if ($scope.patientAllFindingsArray.length > 0) {

        //                        var filteredFindingValArray = $filter("filter")($scope.patientAllFindingsArray, function (fitem) {
        //                            return fitem.FindingValueId === caritem.InvFindingId && fitem.OrganId === caritem.OrganId;
        //                        });
        //                        filteredFindingValArray = filteredFindingValArray || [];
        //                        console.log(filteredFindingValArray);
        //                        console.log("inside filter");
        //                        if (filteredFindingValArray.length > 0) {

        //                            obj.FindingName = filteredFindingValArray[0].InvestigationDesc || "";
        //                            obj.S3URL = filteredFindingValArray[0].S3URL || "";
        //                            obj.Top = filteredFindingValArray[0].StampTop || "";
        //                            obj.Left = filteredFindingValArray[0].StampLeft || "";
        //                            obj.Width = filteredFindingValArray[0].StampWidth || "";
        //                            obj.Height = filteredFindingValArray[0].StampHeight || "";
        //                            obj.Xaxis = filteredFindingValArray[0].StampsaxisX || "";
        //                            obj.Yaxis = filteredFindingValArray[0].StampsaxisY || "";
        //                        }
        //                    }
        //                    var pcount = [];
        //                    if ($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues.length > 0) {
        //                        //pcount = $filter("filter")($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues, function (fitem, index) { return (fitem.FindingValueId === cpritem.InvFindingId && fitem.OrganId === organid) || (fitem.StampId === obj.StampId) }) || [];
        //                        pcount = $filter("filter")($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues, function (fitem, index) {
        //                            if (obj.StampId === 0) {

        //                                return (fitem.FindingValueId === cpritem.InvFindingId && fitem.OrganId === organid);
        //                            } else {
        //                                return (fitem.FindingValueId === cpritem.InvFindingId && fitem.OrganId === organid) || (fitem.StampId === obj.StampId);
        //                            }
        //                        }) || [];

        //                    }
        //                    if (pcount.length == 0) {
        //                        //$timeout(function () {
        //                        //    $scope.changeSelectedStampObj(obj);
        //                        //}, 500);
        //                        $scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues.push(obj)
        //                    }
        //                });
        //            }




        //        });
        //    }
        //}

        console.log($scope.patientAllFindingsArray);

        if ($scope.patientAllFindingsArray.length > 0) {

            $scope.fillPatientStampsOnCanvas();

        } else if ($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues.length > 0) {
            angular.forEach($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues, function (ssitem) {
                $timeout(function () {
                    $scope.changeSelectedStampObj(ssitem);
                }, 500);
            });
        }
    };


    $scope.fillPatientStampsOnCanvas = function () {

        var filteredFindings = [];

        angular.forEach($scope.addUpdateExaminationDrawingReqObj.FindingList, function (fitem) {
            angular.forEach($scope.patientAllFindingsArray, function (pitem) {
                if (pitem.InvestigationId == fitem.FindingId) {
                    filteredFindings.push(pitem);
                }
            });
        });


        console.log(filteredFindings);
        console.log("filtered invs")
        //if (filteredFindings.length > 0) {
        //    angular.forEach(filteredFindings, function (maobj) {
        //        var obj = {
        //            "PatientFinding_AnteriorSegmentId": maobj.PatientFinding_AnteriorSegmentId,
        //            "PatientFindingValueId": maobj.PatientFindingValueId,
        //            "CategoryId": maobj.CategoryId,
        //            "CategoryName": maobj.CategoryName,
        //            "FindingId": maobj.InvestigationId,
        //            "FindingName": maobj.InvestigationDesc,
        //            "FindingValueId": maobj.FindingValueId,
        //            "FindingValueName": maobj.FindingValueName,
        //            "StampId": maobj.StampId || 0,
        //            "S3URL": maobj.S3URL || "",
        //            "Top": maobj.StampTop || "",
        //            "Left": maobj.StampLeft || "",
        //            "Width": maobj.StampWidth || "",
        //            "Height": maobj.StampHeight || "",
        //            "Xaxis": maobj.StampsaxisX || "",
        //            "Yaxis": maobj.StampsaxisY || "",
        //            "OrganId": maobj.OrganId,
        //            "OrganName": maobj.OrganName,
        //            "DeleteInd": "N"
        //        }
        //        var pcount = [];
        //        if ($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues.length > 0) {
        //            pcount = $filter("filter")($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues, function (fitem, index) { return fitem.FindingValueId === obj.FindingValueId && fitem.OrganId === obj.OrganId }) || [];
        //        }
        //        if (pcount.length == 0) {
        //            $scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues.push(obj)
        //        }
        //    })
        //}

        if ($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues.length > 0) {
            angular.forEach($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues, function (ssitem) {
                $timeout(function () {
                    $scope.changeSelectedStampObj(ssitem);
                }, 500);
            });
        }


    }
    $scope.clearCanvasTotal = function () {

        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to Clear Drawing", function () {
            canvas.clear();
            //$scope.canvas1.clear();
            /*$scope.addUpdateExaminationDrawingReqObj = getnewAddUpdateExamDrawingobj();*/
            $scope.changeMainExaminationCategory($scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryObj);
            $scope.IsBodyPartDisabled = false;
            $scope.$digest();
        }, function () {
            r = "You pressed Cancel!";
        });


    };

    $scope.deletefindingValueId = function (sitem, organid) {
        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete Finding", function () {



            //angular.forEach($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues, function (aitem, inddex) {
            //    if (sitem.PatientFindingValueId === 0) {
            //        $scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues.splice(inddex, 1);
            //    } else {
            //        if (sitem.FindingValueId === aitem.FindingValueId && aitem.OrganId == organid) {
            //            aitem.DeleteInd = "Y";
            //        }
            //    }
            //});

            if (sitem.PatientFindingValueId === 0) {
                angular.forEach($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues, function (aitem, inddex) {
                    if (sitem.FindingValueId === aitem.FindingValueId && aitem.OrganId == organid) {
                        $scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues.splice(inddex, 1);
                    }
                });
            } else {
                angular.forEach($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues, function (aitem, inddex) {
                    if (sitem.FindingValueId === aitem.FindingValueId && aitem.OrganId == organid) {
                        aitem.DeleteInd = "Y";
                    }
                });
            }
            //let tempArray = $filter('filter')($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues, { 'DeleteInd': 'N' }, true)||[];
            //if (tempArray.length==0) {
            //    $scope.canvas1.clear();
            //}
            //$scope.$digest();
        }, function () {
            r = "You pressed Cancel!";
        });
    }
    $scope.Checktoaddstamp = function (st) {
        if ($scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryObj == "") {
            alertify.error("Please Select Image");
            st.isChecked = false;
            return false;

        }
    }
    $scope.morestamps = function () {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/morestampspopup.html",
            "backdrop": "static",
            "scope": $scope,
            //"size": "lg",
            "windowClass": "offcanves-right  ",
            "keyboard": false,
            "controller": function ($scope, $uibModal, $uibModalInstance, alertify) {
                $scope.Uibclose = function () {
                    $uibModalInstance.close("cancel");
                }
                $scope.OrgStampsArray = $scope.OrgStampsArray || [];
                if ($scope.OrgStampsArray.length > 0) {
                    angular.forEach($scope.OrgStampsArray, function (ositem) {
                        ositem.isChecked = false;
                    });
                }
                $scope.AddSelectedFindingValues = function () {
                    if ($scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryObj == "") {
                        alertify.error("Please Select Image");
                        return false;
                        angular.forEach($scope.OrgStampsArray, function (ositem) {
                            ositem.isChecked = false;
                        });
                    } else {
                        var checkedfindingvalues = $filter("filter")($scope.OrgStampsArray, function (fitem, index) { return fitem.isChecked }) || [];
                        if (checkedfindingvalues.length > 0) {
                            angular.forEach(checkedfindingvalues, function (cpitem) {
                                var obj = {
                                    "PatientFinding_AnteriorSegmentId": 0,
                                    "PatientFindingValueId": 0,
                                    "CategoryId": cpitem.CategoryId || 0,
                                    "CategoryName": cpitem.CategoryName || '',
                                    "FindingId": cpitem.InvestigationId,
                                    "FindingName": cpitem.InvestigationName,
                                    "FindingValueId": cpitem.FindingValueId,
                                    "FindingValueName": cpitem.FindingValue,
                                    "StampId": cpitem.StampId || 0,
                                    "S3URL": cpitem.S3URL || "",
                                    "Top": cpitem.StampTop || "",
                                    "Left": cpitem.StampLeft || "",
                                    "Width": cpitem.StampWidth || "",
                                    "Height": cpitem.StampHeight || "",
                                    "Xaxis": cpitem.StampsaxisX || "",
                                    "Yaxis": cpitem.StampsaxisY || "",
                                    "OrganId": cpitem.OrganId,
                                    "OrganName": cpitem.OrganName || "",
                                    "DeleteInd": "N"
                                };
                                //var filterpossiable = $filter("filter")(cpitem.StampsArray, { "OrganId": organid }, true) || [];
                                //if (filterpossiable.length > 0) {
                                //    obj.StampId = filterpossiable[0].StampId || 0;
                                //    obj.S3URL = filterpossiable[0].StampS3URL || "";
                                //    obj.Top = filterpossiable[0].StampTop || "";
                                //    obj.Left = filterpossiable[0].StampLeft || "";
                                //    obj.Width = filterpossiable[0].StampWidth || "";
                                //    obj.Height = filterpossiable[0].StampHeight || "";
                                //    obj.Xaxis = filterpossiable[0].StampsaxisX || "";
                                //    obj.Yaxis = filterpossiable[0].StampsaxisY || "";


                                var pcount = [];
                                if ($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues.length > 0) {
                                    pcount = $filter("filter")($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues, function (fitem, index) { return fitem.FindingValueId === obj.FindingValueId && fitem.OrganId === cpitem.OrganId }) || [];

                                }
                                if (pcount.length == 0) {
                                    $scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues.push(obj)
                                }
                                /* }*/
                            });

                            if ($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues.length > 0) {

                                //canvas.getObjects().forEach(function (object) {
                                //    canvas.remove(object);
                                //});
                                angular.forEach($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues, function (ssitem) {
                                    $timeout(function () {
                                        $scope.changeSelectedStampObj(ssitem);
                                    }, 500);
                                });
                            }
                        }
                        $uibModalInstance.dismiss("cancel");
                    }
                }

                $scope.changeOrgStamps = function (searchval) {
                    var searchtext = searchval

                    var params = {
                        "OrganizationId": $scope.HospitalId,
                        "PageSize": 10,
                        "PageNumber": 1,
                        "SearchText": searchtext || "",
                        "FindingCategoryId": 0,
                        "InvestigationId": 0
                    }
                    eHnotePatientDataService.GetOrganizationFindingStamps(params).then(function (resp) {
                        console.log(resp);
                        if (resp.data.Status == "Success") {
                            $scope.totalItems = resp.data.count;
                            $scope.OrgStampsArray = resp.data.rows || [];
                            if ($scope.OrgStampsArray.length > 0) {
                                angular.forEach($scope.OrgStampsArray, function (ositem) {
                                    ositem.isChecked = false;
                                    ositem.IsFavoriteInd = ositem.IsFavoriteInd || false;

                                });
                                $scope.UserStampsArray = $scope.UserStampsArray || [];
                                if ($scope.UserStampsArray.length > 0) {
                                    angular.forEach($scope.UserStampsArray, function (ssitem) {
                                        angular.forEach($scope.OrgStampsArray, function (ositem) {
                                            if (ositem.StampId == ssitem.StampId) {/*ositem.isChecked = false;*/
                                                ositem.IsFavoriteInd = true;
                                            }
                                        });
                                    });
                                }
                            }

                        }
                    }, function (err) {
                        alertify.error(err.Messege);
                    });
                }

                $scope.RemoveOrgStampData = function (item, index) {

                    var params = {
                        "UserId": $scope.AddUpdateUserStampobjReq.UserId,
                        "OrganizationId": $scope.AddUpdateUserStampobjReq.OrganizationId,
                        "StampId": item.StampId,
                        "DeleteInd": "N",
                        "StampDeleteInd": "Y"
                    }

                    eHnotePatientDataService.AddUpdaeOrgUserFindingStamps(params).then(function (resp) {
                        console.log(resp);
                        if (resp.data.Status == "Success") {
                            /*  $scope.UserStampsArray = resp.data.rows;*/
                            $scope.OrgStampsArray.splice(index, 1);
                            alertify.success("deleted successfully");
                            $scope.getOrganizationFindingSpageChanged();
                            $scope.getUserFavoriteStamps();
                        }
                    }, function (err) {
                        alertify.error(err.Messege);
                    });
                }
                $scope.OrgFindStampsPage = 1;
                $scope.maxSize = 10;
                $scope.getOrgFindStampsReqs = {
                    "OrganizationId": $scope.HospitalId,
                    "PageSize": 10,
                    "PageNumber": 1,
                    "SearchText": "",
                    "FindingCategoryId": 0,
                    "InvestigationId": 0
                };
                $scope.getOrganizationFindingSpageChanged = function () {
                    if ($scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryId != 0) {
                        $scope.getOrgFindStampsReqs.FindingCategoryId = $scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryId || 0;
                    }
                    if ($scope.OrgFindStampsPage != 0) {
                        $scope.getOrgFindStampsReqs.PageNumber = $scope.OrgFindStampsPage || 1;
                    }
                    console.log($scope.getOrgFindStampsReqs);

                    eHnotePatientDataService.GetOrganizationFindingStamps($scope.getOrgFindStampsReqs).then(function (resp) {
                        console.log(resp);
                        if (resp.data.Status == "Success") {
                            $scope.totalItems = resp.data.count;
                            /*$scope.ExaminationCategoryIdFilter = 0;*/
                            $scope.OrgStampsArray = resp.data.rows || [];
                            if ($scope.OrgStampsArray.length > 0) {
                                angular.forEach($scope.OrgStampsArray, function (ositem) {
                                    ositem.isChecked = false;
                                    ositem.IsFavoriteInd = ositem.IsFavoriteInd || false;
                                });
                                if ($scope.UserStampsArray.length > 0) {
                                    angular.forEach($scope.UserStampsArray, function (ssitem) {
                                        angular.forEach($scope.OrgStampsArray, function (ositem) {
                                            if (ositem.StampId == ssitem.StampId) {/*ositem.isChecked = false;*/
                                                ositem.IsFavoriteInd = true;
                                            }
                                        });
                                    });
                                }
                            }

                        }
                    }, function (err) {
                        alertify.error(err.Messege);
                    });
                };
                $scope.OrgStamppageChanged = function (OrgFindStampsPage) {
                    $scope.OrgFindStampsPage = OrgFindStampsPage;
                    $scope.getOrganizationFindingSpageChanged();
                }
            }
        });
        $scope.mInstanceAdd.result.then(function (data) {
            console.log(data);
            $scope.getUserFavoriteStamps();

        }, function (cancel) {
        });
    }








    function getNewModifyUserStampReqobj() {
        var obj = {
            "UserStampId": 0,
            "UserId": $scope.UserId,
            "OrganizationId": $scope.HospitalId,
            "StampId": 0,
            "DeleteInd": "N",
            "StampDeleteInd": "N"
        };

        return obj;
    }
    $scope.AddUpdateUserStampobjReq = getNewModifyUserStampReqobj();

    $scope.saveAddUpdateUserStampData = function (st) {
        st.IsFavoriteInd = !st.IsFavoriteInd || false;
        if (st.IsFavoriteInd) {
            $scope.AddUpdateUserStampobjReq.DeleteInd = 'N'
        } else {
            $scope.AddUpdateUserStampobjReq.DeleteInd = 'Y'
        }
        //if ($scope.UserStampsArray.length > 0) {
        //    var List = $filter("filter")($scope.UserStampsArray, { "StampId": st.StampId }, true) || [];
        //    if (List.length > 0) {
        //        $scope.AddUpdateUserStampobjReq.UserStampId = List[0].UserStampId || 0;
        //    }
        //}
        var params = {
            "UserStampId": $scope.AddUpdateUserStampobjReq.UserStampId,
            "UserId": $scope.AddUpdateUserStampobjReq.UserId,
            "OrganizationId": $scope.AddUpdateUserStampobjReq.OrganizationId,
            "StampId": st.StampId,
            "DeleteInd": $scope.AddUpdateUserStampobjReq.DeleteInd,
            "StampDeleteInd": $scope.AddUpdateUserStampobjReq.StampDeleteInd
        }

        eHnotePatientDataService.AddUpdaeOrgUserFindingStamps(params).then(function (resp) {
            console.log(resp);
            if (resp.data.Status == "Success") {
                /*$scope.AddUpdateUserStampobjReq.UserStampId = 0;*/
                /*  $scope.UserStampsArray = resp.data.rows;*/
                /*                $scope.getOrganizationFindingStamps();*/
                $scope.getUserFavoriteStamps();

                if (st.IsFavoriteInd) {
                    alertify.success("Favorite Added Successfully");
                } else {
                    alertify.success("Favorite Removed Successfully");
                }

            }
        }, function (err) {
            alertify.error(err.Messege);
        });
    }
    $scope.RemoveUserStampData = function (item, type) {
        if (type == 'user') {
            var params = {
                "UserStampId": item.UserStampId,
                "UserId": $scope.AddUpdateUserStampobjReq.UserId,
                "OrganizationId": $scope.AddUpdateUserStampobjReq.OrganizationId,
                "StampId": item.StampId,
                "DeleteInd": "Y",
                /*"StampDeleteInd": "Y"*/
            }
        } else {
            var params = {
                /*  "UserStampId": item.UserStampId,*/
                "UserId": $scope.AddUpdateUserStampobjReq.UserId,
                "OrganizationId": $scope.AddUpdateUserStampobjReq.OrganizationId,
                "StampId": item.StampId,
                "DeleteInd": "N",
                "StampDeleteInd": "Y"
            }
        }
        eHnotePatientDataService.AddUpdaeOrgUserFindingStamps(params).then(function (resp) {
            console.log(resp);
            if (resp.data.Status == "Success") {
                /*  $scope.UserStampsArray = resp.data.rows;*/

                $scope.getOrganizationFindingStamps();
                $scope.getUserFavoriteStamps();
            }
        }, function (err) {
            alertify.error(err.Messege);
        });
    }



    $scope.closeCanvasMain = function () {
        $uibModalInstance.close("cancel");
    }

    $scope.emitEvent = function () {
        $scope.$emit('Fromdrawingpad');
    };

    $scope.addUpdateExaminationDrawingReqObj.IsClickSaveAscDrawingpadBtn = false;
    $scope.saveCanvasDetails = function () {


        console.log(JSON.stringify($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues));

        if ($scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryId == 0) {
            alertify.error("Please Select a Body Part");
            return;
        }

        //if ($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues.length == 0) {
        //    alertify.error("please select a category");
        //    return;
        //}

        $scope.addUpdateExaminationDrawingReqObj.PatientFindingValues = [];

        $scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues.forEach(function (item) {
            var key = item.FindingId;
            if (!$scope.addUpdateExaminationDrawingReqObj.PatientFindingValues[key]) {
                $scope.addUpdateExaminationDrawingReqObj.PatientFindingValues[key] = {
                    PatientFinding_AnteriorSegmentId: item.PatientFinding_AnteriorSegmentId,
                    CategoryId: item.CategoryId,
                    InvestigationId: item.FindingId,
                    RemarksArray: []
                };
            }
            $scope.addUpdateExaminationDrawingReqObj.PatientFindingValues[key].RemarksArray.push({
                PatientFindingValueId: item.PatientFindingValueId,
                FindingValueId: item.FindingValueId,
                OrganId: item.OrganId,
                OrganName: item.OrganName,
                DeleteInd: item.DeleteInd
            });



        });

        $scope.addUpdateExaminationDrawingReqObj.PatientFindingValues = $scope.addUpdateExaminationDrawingReqObj.PatientFindingValues.filter(function (value) {
            return value !== null;
        });

        console.log($scope.addUpdateExaminationDrawingReqObj.PatientFindingValues);

        var canvas = null;
        canvas = document.getElementById("canvasascFabric");
        var dataURL = canvas.toDataURL();

        var fileName = $scope.generateFileName($scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryName, $scope.addUpdateExaminationDrawingReqObj.PatientId);

        console.log(fileName);

        var params = {
            "ConsultationId": $scope.cacheStorageItem.ConsultationID || 0,
            "VisitId": $scope.cacheStorageItem.ConsultationID || 0,
            "UserId": $scope.addUpdateExaminationDrawingReqObj.UserId,
            "HospitalId": $scope.addUpdateExaminationDrawingReqObj.HospitalId,
            "AppointmentId": $scope.addUpdateExaminationDrawingReqObj.AppointmentId,
            "AppointmentDate": $scope.cacheStorageItem.AppointmentDate,
            "PatientId": $scope.addUpdateExaminationDrawingReqObj.PatientId,
            "PatientName": $scope.cacheStorageItem.PatientName || "",
            //"ConsultationId": 0,
            "Base64": dataURL,
            "S3URL": "",
            "FileTypeId": 16,
            "PatientFileId": $scope.addUpdateExaminationDrawingReqObj.PatientFileId,
            "FileName": fileName,
            "FileExt": "png",
            "FileDeleteInd": "N",
            "ExaminationCategoryId": $scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryId,
            "ExaminationCategoryName": $scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryName,
            "PatientFindingValues": $scope.addUpdateExaminationDrawingReqObj.PatientFindingValues,
            "DisplayName": fileName,
            "Logs": {}
        };
        $scope.LogObj.LogArray = [];
        if (params.PatientFileId == 0) {
            if (params.Base64 != "") {
                let obj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 18,
                    "SubModuleName": "Drawing Pad",
                    "ScreenType": "ASC List",
                    "ActionType": "Added",
                    "ActionDescription": ` Drawing pad images ${params.DisplayName} for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        } else {
            if (params.Base64 != "") {
                let obj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 18,
                    "SubModuleName": "Drawing Pad",
                    "ScreenType": "ASC List",
                    "ActionType": "Edited",
                    "ActionDescription": ` Drawing pad images ${params.DisplayName} for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }
       console.log(JSON.stringify(params));
        params.Logs = angular.copy($scope.LogObj) || {};
        $scope.addUpdateExaminationDrawingReqObj.IsClickSaveAscDrawingpadBtn = true;
        eHnotePatientDataService.AddUpdatePatientFindingsDataFromStamps(params).then(function (resp) {
            console.log(resp);
            if (resp.data.Status == "Success") {
                alertify.success("Saved Successfully");
                $scope.clearCanvasMain();
                $scope.GetpatientExaminationImagesArray();
                $scope.GetPatientAdvisedInvestigationStamps();
                $scope.IsBodyPartDisabled = false;
                $scope.addUpdateExaminationDrawingReqObj.IsClickSaveAscDrawingpadBtn = false;
                $scope.addUpdateExaminationDrawingReqObj.PatientFileId = 0;

            }
        }, function (err) {
            $scope.addUpdateExaminationDrawingReqObj.IsClickSaveAscDrawingpadBtn = false;
            alertify.error(err.Messege);
        });
    };

    $scope.generateFileName = function (categoryName, patientID) {
        // Remove spaces from the category name
        var sanitizedCategoryName = categoryName.replace(/\s+/g, '');

        // Get the current date and time
        var currentDate = new Date();
        var formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, ''); // Remove dashes from date
        var formattedTime = currentDate.toTimeString().slice(0, 8).replace(/:/g, ''); // Remove colons from time

        // Combine sanitized category name, patient ID, date, and time
        var fileName = sanitizedCategoryName + '_' + patientID + '_' + formattedDate + formattedTime + ".png";

        return fileName;
    };

    $scope.clearCanvasMain = function () {
        //var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to Go  Examinantion.  Without Saving Current Data", function () {

        $scope.canvas1.clear();
        $scope.changeMainExaminationCategory($scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryObj);
        $scope.IsBodyPartDisabled = false;

        /*$scope.addUpdateExaminationDrawingReqObj = getnewAddUpdateExamDrawingobj();*/
        //$scope.getOrganizationFindingStamps();
        //$scope.getUserFavoriteStamps();
        /*   $scope.$digest();*/
        // $scope.$emit('Fromdrawingpad');
        //}, function () {
        //    r = "You pressed Cancel!";
        //});
    }
    $scope.searchText = '';
    $scope.AddUserStampSelectedFindingValues = function (cpitem, type) {
        if ($scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryObj == "") {
            alertify.error("Please Select Body Part");
            return false;
        } else {
            var cat = 0, catName = '';
            if (cpitem.FindingCategoryId == 1 || cpitem.FindingCategoryId == 2 || cpitem.FindingCategoryId == 3) {
                cat = 5
                catName = "Anterior Segment";
            }
            if (cpitem.FindingCategoryId == 4 || cpitem.FindingCategoryId == 5) {
                cat = 6
                catName = "Posterior Segment";
            }

            var findinfId = 0, findingnames = "", StampURL = '';
            if (type === 1) {
                findinfId = cpitem.FindingId;
                findingnames = cpitem.FindingName;
                StampURL = cpitem.StampS3URL;
            } else {
                findinfId = cpitem.InvestigationId;
                findingnames = cpitem.InvestigationName;
                StampURL = cpitem.S3URL;
            }

            var obj = {
                "PatientFinding_AnteriorSegmentId": 0,
                "PatientFindingValueId": 0,
                "CategoryId": cat,
                "CategoryName": catName || '',
                "FindingId": findinfId,
                "FindingName": findingnames,
                "FindingValueId": cpitem.FindingValueId,
                "FindingValueName": cpitem.FindingValue,
                "FileName": cpitem.FileName || "",
                "StampId": cpitem.StampId || 0,
                "S3URL": StampURL,
                "Top": cpitem.StampTop || "",
                "Left": cpitem.StampLeft || "",
                "Width": cpitem.StampWidth || "",
                "Height": cpitem.StampHeight || "",
                "Xaxis": cpitem.StampsaxisX || "",
                "Yaxis": cpitem.StampsaxisY || "",
                "OrganId": cpitem.OrganId,
                "OrganName": cpitem.OrganName || "",
                "DeleteInd": "N"
            };
            $timeout(function () {
                $scope.changeSelectedStampObj(obj);
            }, 2000);
            var pcount = [];
            if ($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues.length > 0) {
                pcount = $filter("filter")($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues, function (fitem, index) { return fitem.FindingValueId === obj.FindingValueId && fitem.OrganId === cpitem.OrganId }) || [];

            }
            if (pcount.length == 0) {
                $scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues.push(obj)
            }
            //else {
            //    alertify.error("Already This Stamp Is added to Image Please select Another Stamp");
            //    return false;
            //}
            //if ($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues.length > 0) {
            //    angular.forEach($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues, function (ssitem) {
            //        $timeout(function () {
            //            $scope.changeSelectedStampObj(ssitem);
            //        }, 500);
            //    });
            //}
        }
    }

    $scope.editPatientExaminationImage = function (item) {
        console.log(item);


        $scope.canvas1.clear();
        $scope.addUpdateExaminationDrawingReqObj = getnewAddUpdateExamDrawingobj();
        $scope.addUpdateExaminationDrawingReqObj.PatientFileId = item.PatientFileId;
        $scope.addUpdateExaminationDrawingReqObj.FileExt = item.FileExt;
        $scope.addUpdateExaminationDrawingReqObj.FileName = item.FileName;

        $scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryId = item.ExaminationCategoryId;


        var List = $filter("filter")($scope.mainExaminationArray, { "ExaminationCategoryId": $scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryId }, true);
        if (List.length > 0) {
            $scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryObj = List[0];

            $scope.addUpdateExaminationDrawingReqObj.FindingList = List[0].Findinds || [];

            var filteredFindings = [];

            angular.forEach($scope.addUpdateExaminationDrawingReqObj.FindingList, function (fitem) {
                angular.forEach($scope.patientAllFindingsArray, function (pitem) {
                    console.log(pitem.InvestigationId + "__" + fitem.FindingId);
                    if (pitem.InvestigationId == fitem.FindingId) {
                        filteredFindings.push(pitem);
                    }
                });
            });

            if (filteredFindings.length > 0) {

                angular.forEach(filteredFindings, function (maobj) {
                    var obj = {
                        "PatientFinding_AnteriorSegmentId": maobj.PatientFinding_AnteriorSegmentId,
                        "PatientFindingValueId": maobj.PatientFindingValueId,
                        "CategoryId": maobj.CategoryId,
                        "CategoryName": maobj.CategoryName,
                        "FindingId": maobj.InvestigationId,
                        "FindingName": maobj.InvestigationDesc,
                        "FindingValueId": maobj.FindingValueId,
                        "FindingValueName": maobj.FindingValueName,
                        "StampId": maobj.StampId || 0,
                        "S3URL": maobj.S3URL || "",
                        "Top": maobj.StampTop || "",
                        "Left": maobj.StampLeft || "",
                        "Width": maobj.StampWidth || "",
                        "Height": maobj.StampHeight || "",
                        "Xaxis": maobj.StampsaxisX || "",
                        "Yaxis": maobj.StampsaxisY || "",
                        "OrganId": maobj.OrganId,
                        "OrganName": maobj.OrganName,
                        "DeleteInd": "N"
                    }

                    var pcount = [];
                    if ($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues.length > 0) {
                        pcount = $filter("filter")($scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues, function (fitem, index) { return fitem.FindingValueId === obj.FindingValueId && fitem.OrganId === obj.OrganId }) || [];

                    }
                    if (pcount.length == 0) {
                        $scope.addUpdateExaminationDrawingReqObj.SelectedFindingValues.push(obj)
                    }
                })

            }
        };
        $scope.IsBodyPartDisabled = true;
        $scope.changebgImage(item);
    }


    var scaleFactor = 1.1;
    $scope.zoominCanvas = function () {
        var newZoom = canvas.getZoom() * scaleFactor;
        canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, newZoom);
        canvas.requestRenderAll();
    };

    $scope.zoomoutCanvas = function () {
        var newZoom = canvas.getZoom() / scaleFactor;
        canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, newZoom);
        canvas.requestRenderAll();
    };
    $scope.isFindingMatch = function (findingId) {

        // Check if findingId exists in ExaminationCategoryObj.Findinds
        return true;
    };

    $scope.onSelectStampFindingValues = function (item) {
        console.log(item);
        $scope.newStampAddUpdateReqObj.InvestigationId = item.FindingId;
        $scope.newStampAddUpdateReqObj.InvestigationName = item.FindingName;
        $scope.newStampAddUpdateReqObj.FindingValueId = item.InvFindingId;
        $scope.newStampAddUpdateReqObj.FindingValue = item.FindingValue;
        $scope.newStampAddUpdateReqObj.CategoryId = item.CategoryId || 0;
        $scope.newStampAddUpdateReqObj.CategoryName = item.CategoryName || '';

        $scope.newStampAddUpdateReqObj.FindingValueSearchObj = "";
    };

    $scope.DeletefindingValue = function () {

        $scope.newStampAddUpdateReqObj.FindingValue = "";
        $scope.newStampAddUpdateReqObj.FindingValueId = "";
        $scope.newStampAddUpdateReqObj.FindingId = "";
        $scope.newStampAddUpdateReqObj.InvestigationName = "";
    }

    $scope.CreateNewstamp = function () {
        $scope.IsNewStampCreation = true;
        $scope.IsShowStampList = false;
        //$scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryObj = '';
        //$scope.canvas1.clear();
    };
    $scope.CancelStampCreation = function () {
        $scope.IsNewStampCreation = false;
        $scope.IsShowStampList = true;
        $scope.newStampAddUpdateReqObj = getNewStampObj();
        $scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryObj = '';
        $scope.newStampAddUpdateReqObj.IsEditUserStamp = false;
        $scope.getOrganizationFindingStamps();
        $scope.getUserFavoriteStamps();
        $scope.canvas1.clear();
    };

    $scope.IsSearchText = false;

    $scope.changeOrgStamps = function (searchval) {

        if (searchval !== '') {
            $scope.IsSearchText = true;
        } else {
            $scope.IsSearchText = false;
        }

        var searchtext = searchval

        var params = {
            "OrganizationId": $scope.HospitalId,
            "PageSize": 500,
            "PageNumber": 1,
            "SearchText": searchtext || "",
            "FindingCategoryId": $scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryId || 0,
            "InvestigationId": 0
        }
        eHnotePatientDataService.GetOrganizationFindingStamps(params).then(function (resp) {
            console.log(resp);
            if (resp.data.Status == "Success") {
                $scope.totalItems = resp.data.count;
                $scope.OrgStampsArray = resp.data.rows || [];
                if ($scope.OrgStampsArray.length > 0) {
                    angular.forEach($scope.OrgStampsArray, function (ositem) {
                        ositem.isChecked = false;
                        ositem.IsFavoriteInd = ositem.IsFavoriteInd || false;

                    });
                    $scope.UserStampsArray = $scope.UserStampsArray || [];
                    if ($scope.UserStampsArray.length > 0) {
                        angular.forEach($scope.UserStampsArray, function (ssitem, index) {
                            angular.forEach($scope.OrgStampsArray, function (ositem) {
                                if (ositem.StampId == ssitem.StampId) {/*ositem.isChecked = false;*/
                                    ositem.IsFavoriteInd = true;
                                    $scope.UserStampsArray[index].IsFavoriteInd = true;
                                }
                            });
                        });
                    }
                }

            }
        }, function (err) {
            alertify.error(err.Messege);
        });
    }
    $scope.clearCanvasStamp = function () {
        $scope.newStampAddUpdateReqObj = getNewStampObj();
        $scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryObj = '';
        $scope.newStampAddUpdateReqObj.IsEditUserStamp = false;
        $scope.canvas1.clear();
    };

    $scope.EditUserStampData = function (item, type) {
        $scope.IsNewStampCreation = true;
        $scope.IsShowStampList = false;
        var findigId = 0, findingnames = "", StampURL = '';
        if (type === 1) {
            findigId = item.FindingId;
            findingnames = item.FindingName;
            StampURL = item.StampS3URL;
        } else {
            findigId = item.InvestigationId;
            findingnames = item.InvestigationName;
            StampURL = item.S3URL;
        }
        $scope.newStampAddUpdateReqObj.IsEditUserStamp = true;
        $scope.newStampAddUpdateReqObj.UserId = $scope.UserId;
        $scope.newStampAddUpdateReqObj.UserStampId = item.UserStampId;
        $scope.newStampAddUpdateReqObj.StampId = item.StampId;
        $scope.newStampAddUpdateReqObj.FindingId = findigId || 0;
        $scope.newStampAddUpdateReqObj.FindingName = findingnames || '';
        $scope.newStampAddUpdateReqObj.OrganId = item.OrganId || 0;
        $scope.newStampAddUpdateReqObj.OrganName = item.OrganName || '';
        $scope.newStampAddUpdateReqObj.StampName = item.StampName;
        $scope.newStampAddUpdateReqObj.S3URL = StampURL;
        $scope.newStampAddUpdateReqObj.Base64 = "";
        $scope.newStampAddUpdateReqObj.FileName = item.FileName;
        $scope.newStampAddUpdateReqObj.FileExt = item.FileExt;
        $scope.newStampAddUpdateReqObj.FindingCategoryId = item.FindingCategoryId;
        $scope.newStampAddUpdateReqObj.FindingCategoryName = item.FindingCategoryName || '';
        $scope.newStampAddUpdateReqObj.InvestigationId = item.InvestigationId;
        $scope.newStampAddUpdateReqObj.InvestigationName = item.InvestigationName || '';
        $scope.newStampAddUpdateReqObj.FindingValueId = item.FindingValueId || 0;
        $scope.newStampAddUpdateReqObj.FindingValue = item.FindingValue || '';
        $scope.newStampAddUpdateReqObj.StampTop = item.StampTop;
        $scope.newStampAddUpdateReqObj.StampLeft = item.StampLeft;
        $scope.newStampAddUpdateReqObj.StampHeight = item.StampHeight;
        $scope.newStampAddUpdateReqObj.StampWidth = item.StampWidth;
        $scope.newStampAddUpdateReqObj.StampsaxisX = item.StampsaxisX;
        $scope.newStampAddUpdateReqObj.StampsaxisY = item.StampsaxisY;
        $scope.newStampAddUpdateReqObj.IsFavorite = item.IsFavorite;
        $scope.newStampAddUpdateReqObj.DeleteInd = "N";

        //if ($scope.newStampAddUpdateReqObj.FindingValueId !== 0) {
        //    $scope.newStampAddUpdateReqObj.ConnectFindingValue = true;
        //} else {
        //    $scope.newStampAddUpdateReqObj.ConnectFindingValue = false;
        //}


        $scope.canvas1.clear();
        $scope.addUpdateExaminationDrawingReqObj = getnewAddUpdateExamDrawingobj();

        if ($scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryId !== 0) {
            var List = $filter("filter")($scope.mainExaminationArray, { "ExaminationCategoryId": item.FindingCategoryId }, true);
            if (List.length > 0) {
                $scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryObj = List[0];
                $scope.changeMainExaminationCategory($scope.addUpdateExaminationDrawingReqObj.ExaminationCategoryObj);

                var cat = 0, catName = '';
                if (item.FindingCategoryId == 1 || item.FindingCategoryId == 2 || item.FindingCategoryId == 3) {
                    cat = 5
                    catName = "Anterior Segment";
                }
                if (item.FindingCategoryId == 4 || item.FindingCategoryId == 5) {
                    cat = 6
                    catName = "Posterior Segment";
                }

                var obj = {
                    "PatientFinding_AnteriorSegmentId": 0,
                    "PatientFindingValueId": 0,
                    "CategoryId": cat,
                    "CategoryName": catName || '',
                    "FindingId": findigId,
                    "FindingName": findingnames,
                    "FindingValueId": item.FindingValueId,
                    "FindingValueName": item.FindingValue,
                    "FileName": item.FileName || "",
                    "StampId": item.StampId || 0,
                    "S3URL": StampURL,
                    "Top": item.StampTop || "",
                    "Left": item.StampLeft || "",
                    "Width": item.StampWidth || "",
                    "Height": item.StampHeight || "",
                    "Xaxis": item.StampsaxisX || "",
                    "Yaxis": item.StampsaxisY || "",
                    "OrganId": item.OrganId,
                    "OrganName": item.OrganName || "",
                    "DeleteInd": "N"
                };
                $timeout(function () {
                    $scope.changeSelectedStampObj(obj);
                }, 2000);
            }
        }
    };

    $scope.RemoveStampData = function (item) {
        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete the Stamp", function () {
            item.DeleteInd = 'Y';
            item.UserId = $scope.UserId || 0;
            eHnotePatientDataService.addUpdateOrganizationFindingStamps(item).then(function (resp) {
                console.log(resp);
                if (resp.data.Status == "Success") {
                    alertify.success("deleted successfully");
                    $scope.getUserFavoriteStamps();
                }
            }, function (err) {
                alertify.error(err.Messege);
            });
            $scope.$digest();
        }, function () {
            r = "You pressed Cancel!";
        });
    };

    $scope.DeletePatientExaminationImage = function (Ditem) {
        var canvas = null;
        canvas = document.getElementById("canvasascFabric");
        var dataURL = canvas.toDataURL();

        var params = {
            "ConsultationId": $scope.cacheStorageItem.ConsultationID || 0,
            "VisitId": $scope.cacheStorageItem.ConsultationID || 0,
            "UserId": $scope.addUpdateExaminationDrawingReqObj.UserId,
            "HospitalId": $scope.addUpdateExaminationDrawingReqObj.HospitalId,
            "AppointmentId": Ditem.AppointmentId,
            "AppointmentDate": $scope.cacheStorageItem.AppointmentDate,
            "PatientId": Ditem.PatientId,
            "PatientName": $scope.cacheStorageItem.PatientName,
            "Base64": dataURL,
            "S3URL": Ditem.S3URL,
            "FileTypeId": Ditem.FileTypeId,
            "PatientFileId": Ditem.PatientFileId,
            "FileName": Ditem.FileName,
            "FileExt": Ditem.FileExt,
            "FileDeleteInd": "Y",
            "ExaminationCategoryId": Ditem.ExaminationCategoryId,
            "ExaminationCategoryName": Ditem.ExaminationCategoryName,
            "PatientFindingValues": [],
            "Logs": {}
        };
        $scope.LogObj.LogArray = [];
        if (params.Base64 != "") {
            let obj = {
                "LogId": 0,
                "ModuleId": 2,
                "ModuleName": "ASC",
                "SubModuleId": 18,
                "SubModuleName": "Drawing Pad",
                "ScreenType": "ASC List",
                "ActionType": "Deleted ",
                "ActionDescription": ` Drawing pad images ${params.DisplayName} for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            };
            $scope.LogObj.LogArray.push(obj);
        }
        eHnotePatientDataService.AddUpdatePatientFindingsDataFromStamps(params).then(function (resp) {
            console.log(resp);
            if (resp.data.Status == "Success") {
                alertify.success("Deleted Successfully");
                $scope.GetpatientExaminationImagesArray();
                $scope.GetPatientAdvisedInvestigationStamps();
                $scope.clearCanvasMain();
                $scope.IsBodyPartDisabled = false;
            }
        }, function (err) {
            alertify.error(err.Messege);
        });
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
    }


}]);
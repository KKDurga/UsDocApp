 

eHnoteWebApp.controller('EhnoteOHIFPopupCtrl', ['$scope', '$rootScope', '$filter', 'eHnoteProcedureDataService', 'eHnoteMasterDataService', 'datacookieFactory', 'eHnoteCacheStorageService', 'eHnoteValidateUsersDataService', 'eHnotePatientDataService', '$location', 'alertify', 'eHnoteLoginStatusService', 'eHnotePrintService', 'eHnoteMainAppointmentService', '$window', 'eHnoteDiagnosisDataServices', "Lightbox", "eHnoteSettingsDataService", "textAngularManager", "taRegisterTool", "$timeout", "$uibModal", "localStorageFactory", "eHnoteUserAppointmentDataService", "$uibModalInstance", "$http", function ($scope, $rootScope, $filter, eHnoteProcedureDataService, eHnoteMasterDataService, datacookieFactory, eHnoteCacheStorageService, eHnoteValidateUsersDataService, eHnotePatientDataService, $location, alertify, eHnoteLoginStatusService, eHnotePrintService, eHnoteMainAppointmentService, $window, eHnoteDiagnosisDataServices, Lightbox, eHnoteSettingsDataService, textAngularManager, taRegisterTool, $timeout, $uibModal, localStorageFactory, eHnoteUserAppointmentDataService, $uibModalInstance, $http) {





     
    $scope.closeuib = function () {
        $uibModalInstance.dismiss("cancel");
    };


    $uibModalInstance.rendered.then(function () {

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
                Opacity: {},
                Draw: { options: ['Rectangle'] }
            };

            // app config
            const options = new dwv.AppOptions(dataViewConfigs);
            options.tools = _tools;
            options.viewOnFirstLoadItem = viewOnFirstLoadItem;
            // app
            _app = new dwv.App();
            _app.init(options);

         
        
            _app.addEventListener('load', function (event) {
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
                        console.log('metadata',
                            getMetaDataWithNames(_app.getMetaData(event.loadid)));
                        // add data row
                        addDataRow(event.loadid);
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

                if (event.loadtype === 'image' &&
                    typeof _app.getMetaData(event.loadid)['00080060'] !== 'undefined' &&
                    _app.getMetaData(event.loadid)['00080060'].value[0] === 'SEG') {
                    // log SEG details
                    logFramePosPats(_app.getMetaData(event.loadid));

                    // example usage of a dicom SEG as data mask
                    const useSegAsMask = false;
                    if (useSegAsMask) {
                        // image to filter
                        const imgDataIndex = 0;
                        const vls = _app.getViewLayersByDataIndex(imgDataIndex);
                        const vc = vls[0].getViewController();
                        const img = _app.getImage(imgDataIndex);
                        const imgGeometry = img.getGeometry();
                        const sliceSize = imgGeometry.getSize().getDimSize(2);
                        // SEG image
                        const segImage = _app.getImage(event.loadid);
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

           

            // default keyboard shortcuts
            window.addEventListener('keydown', function (event) {
                _app.defaultOnKeydown(event);
                // mask segment related
                if (!isNaN(parseInt(event.key, 10))) {
                    const vc =
                        _app.getActiveLayerGroup().getActiveViewLayer().getViewController();
                    if (!vc.isMask()) {
                        return;
                    }
                    const number = parseInt(event.key, 10);
                    const segHelper = vc.getMaskSegmentHelper();
                    if (segHelper.hasSegment(number)) {
                        const segment = segHelper.getSegment(number);
                        if (event.ctrlKey) {
                            if (event.altKey) {
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
            // default on resize
            window.addEventListener('resize', function () {
                _app.onResize();
            });

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
            resetLayoutButton.addEventListener('click', function () {
                _app.resetLayout();
            });

          

            setupBindersCheckboxes();

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

        $scope.init = function () {
            onDOMContentLoaded();
        };
        $scope.init();
        /**
         * Append a layer div in the root 'dwv' one.
         *
         * @param {string} id The id of the layer.
         */
        function addLayerGroup(id) {
            const layerDiv = document.createElement('div');
            layerDiv.id = id;
            layerDiv.className = 'layerGroup';
            const root = document.getElementById('dwvOD');
            root.appendChild(layerDiv);
        }
 
        function prepareAndGetSimpleDataViewConfig() {
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
                Opacity: {},
                Draw: { options: ['Rectangle'] }
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
                        console.log('metadata',
                            getMetaDataWithNamesOS(_appOS.getMetaData(event.loadid)));
                        // add data row
                        addDataRowOS(event.loadid);
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
 

            // default keyboard shortcuts
            window.addEventListener('keydown', function (event) {
                _appOS.defaultOnKeydown(event);
                // mask segment related
                if (!isNaN(parseInt(event.key, 10))) {
                    const vc =
                        _appOS.getActiveLayerGroup().getActiveViewLayer().getViewController();
                    if (!vc.isMask()) {
                        return;
                    }
                    const number = parseInt(event.key, 10);
                    const segHelper = vc.getMaskSegmentHelper();
                    if (segHelper.hasSegment(number)) {
                        const segment = segHelper.getSegment(number);
                        if (event.ctrlKey) {
                            if (event.altKey) {
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
            // default on resize
            window.addEventListener('resize', function () {
                _appOS.onResize();
            });

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
            resetLayoutButton.addEventListener('click', function () {
                _appOS.resetLayout();
            });

          

            setupBindersCheckboxesOS();

            setupToolsCheckboxesOS();

            
          
        }

        $scope.loadFroms3URLOS = function () {

            /*   var s3url = "https://ehnotedevstorage.blob.core.windows.net/dev/3/0002.DCM";*/
            var array = ['https://ehnotedevstorage.blob.core.windows.net/dev/1/sample3.dcm']
            _appOS.loadURLs(array);
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
    });


    $scope.saveDrawingCanvas = function (orgn) {
        var params = "";
        if (orgn == 'OD') {
            //var canvas = document.querySelector('#dwvOD canvas');
            //var imageData = canvas.toDataURL();

            var elementToCapture = document.querySelector('#layerGroupAOD');
   
            // Use html2canvas to capture the element
            html2canvas(elementToCapture).then(function (canvas) {
                // Convert the captured canvas to base64 data URL
                var  imageData = canvas.toDataURL();

                console.log(imageData); // You can log it or further process it as needed

                params = {
                    "UserId": 3,
                    "HospitalId": 3,
                    "PatientOrderId": 24757,
                    "PatientDocumentId": 0,
                    "PatientId": 519815,
                    "PatientName": "Pravallika Reddy Kolla",
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
                    "UserId": 3,
                    "HospitalId": 3,
                    "PatientOrderId": 24757,
                    "PatientDocumentId": 0,
                    "PatientId": 519815,
                    "PatientName": "Pravallika Reddy Kolla",
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
}]);

eHnoteWebApp.controller('USConsentNewEditor', ['$scope', '$rootScope', '$filter', 'eHnoteProcedureDataService', 'eHnoteMasterDataService', 'datacookieFactory', 'eHnoteCacheStorageService', 'eHnoteValidateUsersDataService', 'eHnotePatientDataService', '$location', 'alertify', 'eHnoteLoginStatusService', 'eHnotePrintService', 'eHnoteMainAppointmentService', '$window', 'eHnoteDiagnosisDataServices', "Lightbox", "eHnoteSettingsDataService", "textAngularManager", "taRegisterTool", "$timeout", "$uibModal", "$compile", "eHnoteSurgeryService", "eHnotePatientVisitReasonServices", "datapersistanceFactory", "eHnoteUserAppointmentDataService", "localStorageFactory", function ($scope, $rootScope, $filter, eHnoteProcedureDataService, eHnoteMasterDataService, datacookieFactory, eHnoteCacheStorageService, eHnoteValidateUsersDataService, eHnotePatientDataService, $location, alertify, eHnoteLoginStatusService, eHnotePrintService, eHnoteMainAppointmentService, $window, eHnoteDiagnosisDataServices, Lightbox, eHnoteSettingsDataService, textAngularManager, taRegisterTool, $timeout, $uibModal, $compile, eHnoteSurgeryService, eHnotePatientVisitReasonServices, datapersistanceFactory, eHnoteUserAppointmentDataService, localStorageFactory) {

    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    var docid = doctorinfo.doctorid;
    $scope.ConsentSettingsDataArray = [];
    $scope.addDoctorConsentForm = [];
    $scope.doctorConsentFormList = [];
    $scope.printConsentArray = [];
    $scope.consentFormArray = [];

    $scope.mainConsentObj = {
        "HtmlContent": "",
        "IsSideBarAddFieldsShow": false,
        "IsSideBarAddSignatureShow": false,
        "IsSideBarUploadFilesShow": false,
        "IsShowTemplates": true,
        "IsNewEmptyDoc": false,
        "IsTemplateEmptyDoc": false,
        "IsDirectSave": true,
        "IsFromPatient": true,
        "IsFontName": false,
        "IsFontSize": false,
        "OrganizationLogoUrl": "",
        "OrganizationBase64": ""
    };

    $scope.check_location = $location.url();

    console.log($scope.check_location + "__Url");

    if ($scope.check_location === "/settings") {
        $scope.mainConsentObj.IsFromPatient = false;
    }


    if ($scope.doctorinfo !== undefined) {
        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        }
    }
    var printobj = datapersistanceFactory.getItem("printSettingData");
    console.log(printobj);
    $scope.previewForm = function () {

        $timeout(function () {
            var innerContents = $scope.mainConsentObj.HtmlContent;
            var popupWinindow = window.open('', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWinindow.document.open();
            popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
            popupWinindow.document.close();
        }, 500);
    };


    $scope.editorToolbarButtonConfig = [];
    textAngularManager.unregisterToolbar($scope.editorToolbarButtonConfig);


    $scope.mainConsentObj.HtmlContent = '';

    //// Register custom tool and toolbar
    $scope.editorToolbarButtonConfig = [
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
        ['bold', 'italics', 'underline', 'ul', 'ol', 'justifyLeft', 'justifyCenter', 'justifyRight', 'html'],
        ['undo', 'redo', 'clear', 'insertPageBreak', 'insertLogo', 'insertDynamicText', 'printPreview'],
    ];

    //$scope.$on('$destroy', function () {
    //    textAngularManager.unregisterEditor('htmlcontentconsent');
    //});

    /*    textAngularManager.unregisterEditor('htmlcontentconsent');*/
    /*    document.getElementById("htmlcontentconsent").remove();*/
    var Ediotor = null;
    /*  ['html', 'insertSignature']*/
    taRegisterTool('testTool', {
        buttontext: 'Test',
        tooltiptext: 'Test Tool',
        action: function ($deferred, restoreSelection) {
            this.$editor().wrapSelection('insertHTML', '<span class="test-span">Foo</span>');
        },
        activeState: function (commonElement) {
            if (commonElement) {
                return $(commonElement).hasClass('test-span');
            }
        }
    });


    $scope.checkEnterKey = function () {
        console.log(this);
    };

    //Let the editor initialise..
    //$timeout(function () {

    //    // Grab a reference..
    //    var $editor = $('.ta-editor [contenteditable="true"]');
    //    console.log($editor);

    //    $editor.find('.test-span').keyup(function (e) {
    //        console.log('foo');
    //        // Process ENTER key
    //        if (e.which == 13) {

    //            // Get the current cursor position
    //            var range = window.getSelection().getRangeAt(0);

    //            post_range = document.createRange();
    //            post_range.selectNodeContents(this);
    //            post_range.setStart(range.endContainer, range.endOffset);
    //            next_text = post_range.cloneContents();

    //            console.log(next_text);

    //            at_end = next_text.textContent.length === 0;

    //            if (at_end) {
    //                console.log('At end!');
    //            }

    //        }

    //    });

    //}, 200);


    $scope.tabno = 1;
    $scope.SelectedFieldItem = "";


    function initializeAllBranches() {
        var data = localStorageFactory.getItem("allBranchesData") || [];
        var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.SummaryAllBranchesReports, data, doctorinfo) || [];
        var EmptyClinicObj = {
            "ClinicName": "All Locations",
            "BranchName": "All Locations",
            "ClinicId": 0,
            "Address1": "",
            "Address2": "",
            "Location": "",
            "StateId": "",
            "PinCode": "",
            "CountryId": "",
            "CityId": "",
            "DistrictRegion": "",
            "Latitude": "",
            "Longitude": "",
            "BranchEmail": "",
            "CountryCode": "",
            "mobilenum": "",
            "Active": "Y",
            "Doctors": []

        };
        clinicAddress.unshift(EmptyClinicObj);

        clinicAddress = _.uniq(clinicAddress, false, function (p) {
            return p.ClinicId;
        });

        $scope.AllUserBranchesList = clinicAddress;
        $scope.AllHospitalsList = clinicAddress;
    }
    initializeAllBranches()



    function getSelectedTextFromEditor() {
        var text = "";
        var selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            var range = selection.getRangeAt(0);
            var container = document.createElement("div");
            container.appendChild(range.cloneContents());
            text = container.innerText;
        }
        return text;
    }

    //taRegisterTool('fontname', {
    //    tooltiptext: 'Font Name',
    //    display: "<span class='bar-btn-dropdown dropdown'>" +
    //        "<button class='btn btn-blue dropdown-toggle' type='button' ng-disabled='showHtml()' style='padding-top: 4px'><i class='fa fa-font'></i><i class='fa fa-caret-down'></i></button>" +
    //        "<ul class='dropdown-menu'><li ng-repeat='o in options'><button class='btn btn-blue checked-dropdown' style='font-family: {{o.css}}; width: 100%' type='button' ng-click='action($event, o.css)'><i ng-if='o.active' class='fa fa-check'></i>{{o.name}}</button></li></ul></span>",
    //    action: function (event, font) {
    //        Ediotor = this;
    //        $scope.mainConsentObj.IsSideBarAddFieldsShow = false;
    //        $scope.mainConsentObj.IsSideBarAddSignatureShow = false;
    //        $scope.mainConsentObj.IsSideBarUploadFilesShow = false;
    //        $scope.mainConsentObj.IsShowTemplates = false;
    //        $scope.mainConsentObj.IsTemplateEmptyDoc = false;
    //        $scope.mainConsentObj.IsFontName = true;
    //        $scope.mainConsentObj.IsFontSize = false;


    //       return this.$editor().wrapSelection('fontname', font); 

    //    },
    //    options: [
    //        { name: 'Sans-Serif', css: 'Arial, Helvetica, sans-serif' },
    //        { name: 'Serif', css: "'times new roman', serif" },
    //        { name: 'Wide', css: "'arial black', sans-serif" },
    //        { name: 'Narrow', css: "'arial narrow', sans-serif" },
    //        { name: 'Comic Sans MS', css: "'comic sans ms', sans-serif" },
    //        { name: 'Courier New', css: "'courier new', monospace" },
    //        { name: 'Garamond', css: 'garamond, serif' },
    //        { name: 'Georgia', css: 'georgia, serif' },
    //        { name: 'Tahoma', css: 'tahoma, sans-serif' },
    //        { name: 'Trebuchet MS', css: "'trebuchet ms', sans-serif" },
    //        { name: "Helvetica", css: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
    //        { name: 'Verdana', css: 'verdana, sans-serif' },
    //        { name: 'Proxima Nova', css: 'proxima_nova_rgregular' }
    //    ]
    //});

    //taRegisterTool('fontsize', {
    //    tooltiptext: 'Font Size',
    //    display: "<span class='bar-btn-dropdown dropdown'>" +
    //        "<button class='btn btn-blue dropdown-toggle' type='button' ng-disabled='showHtml()' style='padding-top: 4px'><i class='fa fa-text-height'></i><i class='fa fa-caret-down'></i></button>" +
    //        "<ul class='dropdown-menu'><li ng-repeat='o in options'><button class='btn btn-blue checked-dropdown' style='font-size: {{o.css}}; width: 100%' type='button' ng-click='action($event, o.value)'><i ng-if='o.active' class='fa fa-check'></i> {{o.name}}</button></li></ul>" +
    //        "</span>",
    //    action: function (event, size) {
    //        Ediotor = this;
    //        $scope.mainConsentObj.IsSideBarAddFieldsShow = false;
    //        $scope.mainConsentObj.IsSideBarAddSignatureShow = false;
    //        $scope.mainConsentObj.IsSideBarUploadFilesShow = false;
    //        $scope.mainConsentObj.IsShowTemplates = false;
    //        $scope.mainConsentObj.IsTemplateEmptyDoc = false;
    //        $scope.mainConsentObj.IsFontName = false;
    //        $scope.mainConsentObj.IsFontSize = true;


    //        /*         this.$editor().wrapSelection('fontsize', size);*/
    //        var selectedText = this.$editor().displayElements.text[0].innerText; // Get selected text
    //        var updatedText = '<span style="font-size: ' + size + 'px">' + selectedText + '</span>';

    //        if (selectedText) {
    //            var range = document.getSelection().getRangeAt(0); // Get the range of the selection
    //            range.deleteContents(); // Remove the contents of the range

    //            return this.$editor().wrapSelection('insertHTML', updatedText);
    //        }

    //    },
    //    options: [
    //        { name: 'xx-small', css: 'xx-small', value: 1 },
    //        { name: 'x-small', css: 'x-small', value: 2 },
    //        { name: 'small', css: 'small', value: 3 },
    //        { name: 'medium', css: 'medium', value: 4 },
    //        { name: 'large', css: 'large', value: 5 },
    //        { name: 'x-large', css: 'x-large', value: 6 },
    //        { name: 'xx-large', css: 'xx-large', value: 7 }

    //    ]
    //});

    taRegisterTool('insertDynamicText', {
        buttontext: 'Add Field',
        tooltiptext: 'Add Custom Field',
        action: function () {
            Ediotor = this;
            $scope.mainConsentObj.IsSideBarAddFieldsShow = true;
            $scope.mainConsentObj.IsSideBarAddSignatureShow = false;
            $scope.mainConsentObj.IsSideBarUploadFilesShow = false;
            $scope.mainConsentObj.IsShowTemplates = false;
            $scope.mainConsentObj.IsTemplateEmptyDoc = false;



            //var mInstanceAdd = $uibModal.open({
            //    "templateUrl": "templates/settings/AdditionalFieldsPopup.html",
            //    "backdrop": "static",
            //    "keyboard": false,
            //    "size": "lg",
            //    "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteSettingsDataService) {
            //        $scope.tabno = 1;
            //        $scope.SelectedFieldItem = "";
            //        $scope.PatientFieldsArray = [
            //            {
            //                "Id": 1,
            //                "Name": "PatientName",
            //                "Value": "#PatientName#"
            //            },
            //            {
            //                "Id": 2,
            //                "Name": "PatientMrNo",
            //                "Value": "#PatientMrNo#"
            //            },
            //            {
            //                "Id": 3,
            //                "Name": "PatientMobile",
            //                "Value": "#PatientMobile#"
            //            }
            //        ];

            //        $scope.DoctorFieldsArray = [
            //            {
            //                "Id": 1,
            //                "Name": "Doctor Name",
            //                "Value": "#DoctorName#"
            //            },
            //            {
            //                "Id": 2,
            //                "Name": "Doctor Mobile",
            //                "Value": "#DoctorMobile#"
            //            },
            //            {
            //                "Id": 3,
            //                "Name": "Doctor Specialization",
            //                "Value": "#DoctorSpecialization#"
            //            }
            //        ];

            //        $scope.HospitalFieldsArray = [
            //            {
            //                "Id": 1,
            //                "Name": "Hospital Name",
            //                "Value": "#HospitalName#"
            //            },
            //            {
            //                "Id": 2,
            //                "Name": "Hospital Mobile",
            //                "Value": "#HospitalMobile#"
            //            },
            //            {
            //                "Id": 3,
            //                "Name": "Hospital Address",
            //                "Value": "#HospitalAddress#"
            //            }
            //        ];

            //        $scope.changeFieldValue = function (text) {
            //            console.log(text);
            //            $scope.SelectedFieldItem = text;
            //        };


            //        $scope.SaveFieldDetails = function (resp) {
            //            console.log(resp);
            //            $uibModalInstance.close(resp);
            //        }

            //        $scope.ClearDetails = function () {
            //            $uibModalInstance.close("Close");
            //        };


            //        $scope.createfeeuibclose = function () {
            //            $uibModalInstance.dismiss("cancel");
            //        };

            //        $scope.MainFieldsArray = [];
            //        $scope.GetMasterConsentFields = function () {
            //            $scope.FieldCategoriesArray = [];
            //            $scope.FieldValuesArray = [];
            //            $scope.MainFieldsArray = [];
            //            eHnoteSettingsDataService.GetMasterConsentFields().success(function (data) {
            //                $scope.MainFieldsArray = data.FieldsArray;
            //            }).error(function (error) {
            //                alertify.error("Getting MasterConsentFields failed");
            //            });


            //        };
            //        $scope.GetMasterConsentFields();
            //    }
            //});

            //mInstanceAdd.result.then(function (resp) {
            //    console.log(resp);


            //    var htmltext = "<span id='N" + resp + "'> #" + resp + "# </span>";




            //    var tsthis = textAngularManager.retrieveEditor('htmlcontentconsent');
            //    console.log(tsthis)




            //    var element = $compile(htmltext)(tsthis.scope.$parent);

            //    tsthis.scope.displayElements.text[0].focus();
            //    insertNodeAtCursor(element[0]);
            //    return placeCaretAtEnd(element[0])

            //}, function (cancel) {
            //    console.log(cancel);
            //});


            function insertTextAtCursor(text) {
                var sel, range;
                if (window.getSelection) {
                    sel = window.getSelection();
                    if (sel.getRangeAt && sel.rangeCount) {
                        range = sel.getRangeAt(0);
                        range.deleteContents();
                        range.insertNode(document.createTextNode(text));
                    }
                } else if (document.selection && document.selection.createRange) {
                    document.selection.createRange().text = text;
                }
            }

            function moveCaret(charCount) {
                var sel, range;
                if (window.getSelection) {
                    sel = window.getSelection();
                    if (sel.rangeCount > 0) {
                        var textNode = sel.focusNode;
                        sel.collapse(textNode.nextSibling, charCount);
                    }
                } else if ((sel = window.document.selection)) {
                    if (sel.type != "Control") {
                        range = sel.createRange();
                        range.move("character", charCount);
                        range.select();
                    }
                }
            }


            function insertNodeAtCursor(node) {
                var sel, range, html;
                if (window.getSelection) {
                    sel = window.getSelection();
                    if (sel.getRangeAt && sel.rangeCount) {
                        sel.getRangeAt(0).insertNode(node);
                    }
                } else if (document.selection && document.selection.createRange) {
                    range = document.selection.createRange();
                    html = (node.nodeType == 3) ? node.data : node.outerHTML;
                    range.pasteHTML(html);
                }
            }
            function placeCaretAtEnd(el) {
                el.focus();
                if (typeof window.getSelection != "undefined"
                    && typeof document.createRange != "undefined") {
                    var range = document.createRange();
                    range.setStartAfter(el);
                    range.setEndAfter(el);
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (typeof document.body.createTextRange != "undefined") {
                    var textRange = document.body.createTextRange();
                    textRange.moveToElementText(el);
                    textRange.collapse(false);
                    textRange.select();
                }
            }


        },
    });

    taRegisterTool('insertSignature', {
        buttontext: 'Add Sign',
        tooltiptext: 'Add Signature From Topaz',
        action: function () {
            // Ediotor = this;
            //$scope.mainConsentObj.IsSideBarAddFieldsShow = false;
            //$scope.mainConsentObj.IsSideBarAddSignatureShow = true;
            //$scope.mainConsentObj.IsSideBarUploadFilesShow = false;


            var mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/settings/AdditionalSigantureFieldPopup.html",
                "backdrop": "static",
                "keyboard": false,
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.tabno = 1;
                    $scope.SelectedFieldItem = "";



                    var tmr;

                    var resetIsSupported = false;




                    function onLoadSIg() {
                        if (IsSigWebInstalled()) {
                            resetIsSupported = GetResetSupported();
                            if (!resetIsSupported) {
                                var sigweb_link = document.createElement("a");
                                sigweb_link.href = "https://www.topazsystems.com/software/sigweb.exe";
                                sigweb_link.innerHTML = "https://www.topazsystems.com/software/sigweb.exe";

                                var note = document.getElementById("sigWebVrsnNote");
                                note.innerHTML = "There is a newer version of SigWeb available here: ";
                                note.appendChild(sigweb_link);
                            }
                        }
                        else {
                            alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
                        }
                    }
                    onLoadSIg();


                    function GetResetSupported() {
                        var minSigWebVersionResetSupport = "1.6.4.0";

                        if (isOlderSigWebVersionInstalled(minSigWebVersionResetSupport)) {
                            console.log("Old SigWeb version installed.");
                            return false;
                        }
                        return true;
                    }

                    function isOlderSigWebVersionInstalled(cmprVer) {
                        var sigWebVer = GetSigWebVersion();
                        if (sigWebVer != "") {
                            return isOlderVersion(cmprVer, sigWebVer);
                        } else {
                            return false;
                        }
                    }

                    function isOlderVersion(oldVer, newVer) {
                        const oldParts = oldVer.split('.')
                        const newParts = newVer.split('.')
                        for (var i = 0; i < newParts.length; i++) {
                            const a = parseInt(newParts[i]) || 0
                            const b = parseInt(oldParts[i]) || 0
                            if (a < b) return true
                            if (a > b) return false
                        }
                        return false;
                    }

                    $scope.signPlusObj = {
                        "readyToSign": false,
                        "SignString": ""
                    }



                    $scope.OnSign = function () {
                        if (IsSigWebInstalled()) {
                            var ctx = document.getElementById('signPadUD').getContext('2d');
                            SetDisplayXSize(500);
                            SetDisplayYSize(100);
                            SetTabletState(0, tmr);
                            SetJustifyMode(0);
                            ClearTablet();
                            SetKeyString("0000000000000000");
                            SetEncryptionMode(0);
                            if (tmr == null) {
                                tmr = SetTabletState(1, ctx, 50);
                            }
                            else {
                                SetTabletState(0, tmr);
                                tmr = null;
                                tmr = SetTabletState(1, ctx, 50);
                            }
                            $scope.signPlusObj.readyToSign = true;
                        } else {
                            alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
                        }
                    };

                    $scope.OnClear = function () {
                        ClearTablet();
                        $uibModalInstance.close("Close");
                        //var ctx = document.getElementById('cnv').getContext('2d');
                        //ClearTablet();
                        //ctx.clearReact(0,0,50,50)

                        //SetTabletState(0, tmr);

                    }


                    $scope.saveDrawNew = function () {
                        if (NumberOfTabletPoints() == 0) {
                            alert("Please sign before continuing");
                        }
                        else {
                            SetTabletState(0, tmr);


                            //NOW, EXTRACT THE SIGNATURE IN THE TOPAZ BIOMETRIC FORMAT -- SIGSTRING
                            //OR AS A BASE64-ENCODED PNG IMAGE
                            //OR BOTH

                            //********************USE THIS SECTION IF YOU WISH TO APPLY AUTOKEY TO YOUR TOPAZ SIGNATURE
                            //READ ABOUT AUTOKEY AND THE TOPAZ SIGNATURE FORMAT HERE: http://topazsystems.com/links/robustsignatures.pdf
                            //AUTOKEY IS CRITICAL TO SAVING AN eSIGN-COMPLIANT SIGNATURE
                            //AUTOKEY ONLY APPLIES TO THE TOPAZ-FORMAT SIGSTRING AND DOES NOT APPLY TO AN IMAGE OF THE SIGNATURE
                            //AUTOKEY ALLOWS THE DEVELOPER TO CRYPTOGRAPHICALLY BIND THE TOPAZ SIGNATURE TO A SET OF DATA
                            //THE PURPOSE OF THIS IS TO SHOW THAT THE SIGNATURE IS BEING APPLIED TO THE DATA YOU PASS IN USING AutoKeyAddData()
                            //IN GENERAL TOPAZ RECOMMENDS REPLICATING A TRADITIONAL 'PAPER AND PEN' APPROACH
                            //IN OTHER WORDS, IF YOU WERE TO PRINT OUT ON PAPER THE TERMS/INFORMATION THE SIGNER IS SUPPOSED TO READ AND AGREE WITH
                            //THE DATA ON THIS PAPER IS WHAT SHOULD IN WHOLE BE PASSED INTO AUTOKEYADDANSIDATA() DIGITALLY
                            //THE TOPAZ SIGSTRING IS THEN BOUND TO THIS DATA, AND CAN ONLY BE SUCCESSFULLY DECRYPTED LATER USING THIS DATA
                            //AUTOKEYADDDATA IS DEPRECATED AND REPLACED BY AUTOKEYADDANSIDATA

                            var CryptoData = "";
                            CryptoData = "This represents sample data the signer reads and is agreeing to when signing.";
                            CryptoData = CryptoData + "Concatenate all this data into a single variable.";
                            AutoKeyAddANSIData(CryptoData);
                            SetEncryptionMode(2);

                            //*******END AUTOKEY SECTION


                            //NOTE THAT THE AUTOKEY SECTION ABOVE IS NOT REQUIRED TO RETURN A TOPAZ SIGSTRING
                            //BUT IT IS STRONGLY RECOMMENDED IF YOU REQUIRE eSIGN COMPLIANCE
                            //RETURN THE TOPAZ-FORMAT SIGSTRING
                            SetSigCompressionMode(1);
                            //alert("KEYSTRING:" + GetKeyString());
                            $scope.signPlusObj.SignString = GetSigString();
                            //THIS RETURNS THE SIGNATURE IN TOPAZ'S OWN FORMAT WITH BIOMETRIC INFORMATION


                            //TO RETURN THIS SIGSTRING LATER TO A NEW WEB PAGE USING SIGWEB, REPEAT THE CODE FROM THIS FUNCTION ABOVE STARTING AFTER SetTabletState(0, tmr)
                            //BUT AT THE END USE SetSigString() INSTEAD OF GetSigString()
                            //NOTE THAT SetSigString() TAKES 2 ARGUMENTS
                            //SetSigString(str SigString, context canvas)

                            //TO RETURN A BASE64-ENCODED PNG IMAGE OF THE SIGNATURE
                            SetImageXSize(500);
                            SetImageYSize(100);
                            SetImagePenWidth(5);
                            GetSigImageB64(SignedImageCallback);
                            function SignedImageCallback(str) {

                                var convertedSignatureObj = "data:image/png;base64," + str;



                                $scope.signPlusObj.readyToSign = false;
                                // ClearTablet();
                                const canvas = document.getElementById("signPadUD");
                                const ctx = canvas.getContext("2d");
                                ctx.clearRect(0, 0, canvas.width, canvas.height);

                                var resp = '<img src="' + convertedSignatureObj + '">';
                                console.log(resp);
                                $uibModalInstance.close(resp);

                            }


                        }
                    }











                }
            });

            mInstanceAdd.result.then(function (resp) {
                console.log(resp);
                //var text = resp;

                //insertTextAtCursor(text);
                //return moveCaret(1);
                var tsthis = textAngularManager.retrieveEditor('htmlcontentconsent');
                console.log(tsthis)




                var element = $compile(resp)(tsthis.scope.$parent);

                tsthis.scope.displayElements.text[0].focus();
                insertNodeAtCursor(element[0]);
                return placeCaretAtEnd(element[0])


                /*   return tsthis.scope.wrapSelection('insertHtml', resp);*/

            }, function (cancel) {
                console.log(cancel);
            });







            function insertNodeAtCursor(node) {
                var sel, range, html;
                if (window.getSelection) {
                    sel = window.getSelection();
                    if (sel.getRangeAt && sel.rangeCount) {
                        sel.getRangeAt(0).insertNode(node);
                    }
                } else if (document.selection && document.selection.createRange) {
                    range = document.selection.createRange();
                    html = (node.nodeType == 3) ? node.data : node.outerHTML;
                    range.pasteHTML(html);
                }
            }
            function placeCaretAtEnd(el) {
                el.focus();
                if (typeof window.getSelection != "undefined"
                    && typeof document.createRange != "undefined") {
                    var range = document.createRange();
                    range.setStartAfter(el);
                    range.setEndAfter(el);
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (typeof document.body.createTextRange != "undefined") {
                    var textRange = document.body.createTextRange();
                    textRange.moveToElementText(el);
                    textRange.collapse(false);
                    textRange.select();
                }
            }

            var text = "Date";
            /*      insertTextAtCursor(String.fromCharCode(169));*/
            insertTextAtCursor(text);
            return moveCaret(1);
        },
    });


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

    taRegisterTool('insertLogo', {
        buttontext: 'Add Logo',
        tooltiptext: 'Add Organization Logo',
        action: function () {
            $scope.mainConsentObj.OrganizationBase64 = $scope.mainConsentObj.OrganizationBase64 || "";
            if ($scope.mainConsentObj.OrganizationBase64 == "") {
                alertify.error("please add organization logo");
                return;
            }
            var resp = '<img id ="imgOrgLogo" style="height:60px;width:170px" src="' + $scope.mainConsentObj.OrganizationBase64 + '">';
            this.$editor().wrapSelection('insertHTML', resp);

        },
    });

    taRegisterTool('insertPageBreak', {
        buttontext: 'Page Break',
        tooltiptext: 'Insert Page Break',
        class: 'fa fa-file-o',
        action: function () {
            /*  var resp = '<h1 class="pdf-pagebreak-before">&nbsp;</h1>';*/
            var resp = '<div  class="pdf-pagebreak-before" style="width:100%; border-top:#999 1px dotted; border-bottom:#999 1px dotted; padding:0; height:7px; cursor:default; page-break-after: always;"><span style="display:none">&nbsp;</span></div>';
            this.$editor().wrapSelection('insertHTML', resp);


        },
    });
    taRegisterTool('printPreview', {
        buttontext: 'Print Preview',
        tooltiptext: 'Print Preview',
        class: 'btn btn-danger',
        action: function () {
            ///*  var resp = '<h1 class="pdf-pagebreak-before">&nbsp;</h1>';*/
            //var resp = '<div  class="pdf-pagebreak-before" style="width:100%; border-top:#999 1px dotted; border-bottom:#999 1px dotted; padding:0; height:7px; cursor:default; page-break-after: always;"><span style="display:none">&nbsp;</span></div>';
            //this.$editor().wrapSelection('insertHTML', resp);
            $scope.openPrintPreview();

        },
    });


    //textAngularManager.registerEditor('pageBreakEditor', textAngularManager.factories['taTextEditor'], [
    //    {
    //        name: 'insertPageBreak',
    //        action: function () {
    //            // Insert a page break into the editor content
    //            this.$editor().wrapSelection('insertHTML', '<div style="page-break-after: always;"></div>');
    //        },
    //        class: 'fa fa-file-o',
    //        title: 'Insert Page Break'
    //    }
    //]);

    $scope.addtexttoEditor1 = function (item) {

        console.log(item)
        var random4DigitNumber = getRandom4DigitNumber();
        var htmltext = "<span id='N" + item.FieldVariable + random4DigitNumber + "' > ##" + item.FieldVariable + "## </span>";
        Ediotor.$editor().wrapSelection('insertHTML', htmltext);

        if (item.ConsentFieldId === 6) { $scope.ConsentFormsDatareq.IsPatientSignRequired = true; }
        else if (item.ConsentFieldId === 7) { $scope.ConsentFormsDatareq.IsDoctorSignRequired = true; }
        else if (item.ConsentFieldId === 10) { $scope.ConsentFormsDatareq.IsAnesthesistSignRequired = true; }
        else if (item.ConsentFieldId === 18) { $scope.ConsentFormsDatareq.IsCounselorSignRequired = true; }
        else if (item.ConsentFieldId === 17) { $scope.ConsentFormsDatareq.IsStaffSignRequired = true; }
        else if (item.ConsentFieldId === 19) { $scope.ConsentFormsDatareq.IsGuardianSignRequired = true; }

    };

    function getRandom4DigitNumber() {
        return Math.floor(Math.random() * 9000) + 1000; // Generates a random 4-digit number
    }




    //$scope.fillCustomValues = function () {

    //    var PatientName = "Durgareddy", PatientMobile = "9700056151", PatientMRno = "WMV098767", Date = "WMV098767";

    //    var mainhtmlstring = $scope.mainConsentObj.HtmlContent;

    //    let elep = document.getElementById('NPatientName');
    //    elep.innerHTML = PatientName;

    //    let elem = document.getElementById('NPatientMrNo');
    //    elem.innerHTML = PatientMRno;

    //    let elen = document.getElementById('NPatientMobile');
    //    elen.innerHTML = PatientMobile;

    //    //mainhtmlstring.replace(/#PatientMobile#/g, PatientMobile);
    //    //mainhtmlstring.replace(/#PatientName#/g, PatientName);
    //    //mainhtmlstring.replace(/#PatientMrNo#/g, PatientMRno);

    //}

    $scope.uploadpopoverconsents = {
        templateUrl: 'vuploadpopoverconsentsTemplate.html',
    };

    $scope.addsignatuurepopover = {
        templateUrl: 'addsignatuurepopovertemplate.html',
    };



    $scope.restructureFieldsData = function (data) {
        $scope.MainFieldsArray = [];


        angular.forEach(data.FieldCategoriesArray, function (citem) {

            var obj = {
                "FieldCategoryId": citem.FieldCategoryId,
                "FieldCategoryName": citem.FieldCategoryName,
                "IsSelected": false,
                "IsActive": false,
                "SubFields": []
            };

            var List = $filter("filter")($scope.allfieldsArray, { "FieldCategoryId": citem.FieldCategoryId }, true);
            if (List.length > 0) {
                angular.forEach(List, function (fitem) {

                    var sobj = {
                        "ConsentFieldId": fitem.ConsentFieldId,
                        "FieldName": fitem.FieldName,
                        "FieldVariable": fitem.FieldVariable,
                        "IsSelected": false
                    }
                    obj.SubFields.push(sobj);
                });
            }

            $scope.MainFieldsArray.push(obj);

        });


    }

    $scope.allfieldsArray = [];
    $scope.AllCategories = [];
    $scope.GetMasterConsentFields = function () {
        $scope.MainFieldsArray = [];
        eHnoteSettingsDataService.GetMasterConsentFields().success(function (data) {
            $scope.allfieldsArray = data.FieldsArray;
            $scope.AllCategories = data.FieldCategoriesArray;
            $scope.restructureFieldsData(data);

        }).error(function (error) {
            alertify.error("Getting MasterConsentFields failed");
        });
    };
    $scope.GetMasterConsentFields();

    $scope.showDIvCategory = function (item) {
        if ($scope.MainFieldsArray.length > 0) {
            angular.forEach($scope.MainFieldsArray, function (mitem) {
                mitem.IsActive = false;
            });
        }
        item.IsActive = !item.IsActive;
    };


    function getnewConsentAddObj() {
        var obj = {
            "ParentOrganizationId": $scope.ParentHospitalId,
            "UserId": $scope.UserId,
            "ConsentTypeId": 0,
            "ConsentSubTypeId": 0,
            "OrganisationConsentFormId": 0,
            "ProcedureId": 0,
            "OrganizationProcedureId": 0,
            "ProcedureObj": "",
            "ConsentName": "",
            "PDfcontent": "",
            "IsPatientSignRequired": false,
            "IsDoctorSignRequired": false,
            "IsAnesthesistSignRequired": false,
            "IsCounselorSignRequired": false,
            "IsStaffSignRequired": false,
            "IsGuardianSignRequired": false,
            "IsSignRequiredForEachVisit": false,
            'ExpiredDay': null
        };
        return obj;
    }


    $scope.ConsentFormsDatareq = getnewConsentAddObj();
    //$scope.ConsentTypes = [
    //    { "ConsentTypeName": "Appointment", "Id": 1 },
    //    { "ConsentTypeName": "Hippa", "Id": 3 },
    //    { "ConsentTypeName": "Dilation", "Id": 4 },
    //    { "ConsentTypeName": "Surgery", "Id": 2 },
    //    { "ConsentTypeName": "General", "Id": 5 },
    //];

    $scope.ConsentTypes = [
        { "ConsentTypeName": "Appointment", "ConsentTypeId": 1 },
        { "ConsentTypeName": "Surgery", "ConsentTypeId": 2 },
        { "ConsentTypeName": "Procedure", "ConsentTypeId": 3 },
        { "ConsentTypeName": "Referral", "ConsentTypeId": 4 },
        { "ConsentTypeName": "Patient", "ConsentTypeId": 5 },
        { "ConsentTypeName": "General", "ConsentTypeId": 6 },
    ];

    $scope.ConsentSubTypes = [
        {
            "ConsentSubTypeId": 1,
            "ConsentSubTypeName": "Appointment Consent",
            "ConsentTypeId": 1
        },
        {
            "ConsentSubTypeId": 2,
            "ConsentSubTypeName": "Hippa Consent",
            "ConsentTypeId": 1
        },
        {
            "ConsentSubTypeId": 3,
            "ConsentSubTypeName": "Dilation Consent",
            "ConsentTypeId": 1
        }
    ];


    $scope.masterConsentTypes = [];
    $scope.masterConsentSubTypes = [];
    $scope.GetMasterConsentTypes = function () {

        $scope.masterConsentTypes = [];
        eHnoteSettingsDataService.GetMasterConsentDocumentTypes().success(function (resp) {
            console.log(resp)

            $scope.masterConsentTypes = resp.ConsentTypes || [];
            $scope.masterConsentSubTypes = resp.ConsentSubTypes || [];
        }).error(function (error) {
            alertify.error("Getting MasterConsentFields failed");
        });
    };
    $scope.GetMasterConsentTypes();

    //$scope.getSurgerySpecializations = function () {
    //    eHnoteSurgeryService.GetMasterSurgerySpecializations(callbacksuccess, callbackerror);
    //    function callbacksuccess(data) {
    //        if (data !== undefined) {
    //            if (data.length > 0) {
    //                $scope.masterSurgerySpecializationArray = data;


    //                SurgerySpecializationId

    //                angular.forEach($scope.masterSurgerySpecializationArray, function (mitem) {
    //                    var obj = {
    //                        "ConsentSubTypeId": 1,
    //                        "ConsentSubTypeName": Name,
    //                        "ConsentTypeId": 2
    //                    }
    //                });
    //                $scope.ConsentSubTypes.push()
    //            }
    //        }
    //    }
    //    function callbackerror(error) {
    //        console.log(error);
    //    }
    //};
    //$scope.getSurgerySpecializations();


    $scope.saveConsentDocument = function () {
        $scope.Letterslist = $scope.Letterslist || [];
        $scope.Consentformlist = $scope.Consentformlist || [];
        if ($scope.ConsentFormsDatareq.ConsentName == "") {
            alertify.error("Enter Consent Form Name");
            return false;
        }

        if ($scope.ConsentFormsDatareq.OrganisationConsentFormId == 0) {
            if ($scope.ConsentFormsDatareq.ConsentTypeId !== 7) {
                if ($scope.Consentformlist.length > 0) {
                    var filterdiagnosis = $filter("filter")($scope.Consentformlist, { "DocumentName": $scope.ConsentFormsDatareq.ConsentName }, true);
                    if (filterdiagnosis.length > 0) {
                        $scope.ConsentFormsDatareq.ConsentName = "";
                        alertify.error("Document Name Already Added");
                        return false;
                    }
                }
            }
            else if ($scope.ConsentFormsDatareq.ConsentTypeId == 7) {
                if ($scope.Letterslist.length > 0) {
                    var filterdiagnosis = $filter("filter")($scope.Letterslist, { "DocumentName": $scope.ConsentFormsDatareq.ConsentName }, true);
                    if (filterdiagnosis.length > 0) {
                        $scope.ConsentFormsDatareq.ConsentName = "";
                        alertify.error("Document Name Already Added");
                        return false;
                    }
                }
            }
        }





        if (window.CKEDITOR && CKEDITOR.instances.consentEditor) {
            CKEDITOR.instances.consentEditor.updateElement();
            $scope.mainConsentObj.HtmlContent =
                CKEDITOR.instances.consentEditor.getData();
        }

        if (!$scope.mainConsentObj.HtmlContent ||
            $scope.mainConsentObj.HtmlContent.trim() === '') {
            alertify.error("Enter  html content");
            return false;
        }

       

        if ($scope.ConsentFormsDatareq.ConsentTypeId === 0) {
            alertify.error("Please Select Document Name");
            return false;
        }

        if ($scope.ConsentFormsDatareq.ConsentTypeId === 2 || $scope.ConsentFormsDatareq.ConsentTypeId === 1) {
            if ($scope.ConsentFormsDatareq.ConsentSubTypeId === 0) {
                alertify.error("Select  Consent Sub Type");
                return false;
            }
        }

        if ($scope.ConsentFormsDatareq.ConsentTypeId === 3) {
            if ($scope.ConsentFormsDatareq.ProcedureId === 0) {
                alertify.error("Select  Procedure");
                return false;
            }
        }

        var req = {
            "ParentOrganizationId": $scope.ParentHospitalId,
            "UserId": $scope.userId,
            "OrganisationConsentFormId": $scope.ConsentFormsDatareq.OrganisationConsentFormId || 0,
            "ConsentName": $scope.ConsentFormsDatareq.ConsentName || '',
            "ConsentTypeId": $scope.ConsentFormsDatareq.ConsentTypeId || null,
            "ConsentSubTypeId": $scope.ConsentFormsDatareq.ConsentSubTypeId || null,
            "DeleteInd": "N",
            "ProcedureId": $scope.ConsentFormsDatareq.ProcedureId || 0,
            "OrganizationProcedure": $scope.ConsentFormsDatareq.OrganizationProcedure || 0,
            "PDfcontent": $scope.mainConsentObj.HtmlContent || "",
            "Type": 1,
            "IsPatientSignRequired": $scope.ConsentFormsDatareq.IsPatientSignRequired,
            "IsDoctorSignRequired": $scope.ConsentFormsDatareq.IsDoctorSignRequired,
            "IsAnesthesistSignRequired": $scope.ConsentFormsDatareq.IsAnesthesistSignRequired,
            "IsCounselorSignRequired": $scope.ConsentFormsDatareq.IsCounselorSignRequired,
            "IsStaffSignRequired": $scope.ConsentFormsDatareq.IsStaffSignRequired,
            "IsGuardianSignRequired": $scope.ConsentFormsDatareq.IsGuardianSignRequired,
            "IsSignRequiredForEachVisit": $scope.ConsentFormsDatareq.IsSignRequiredForEachVisit,
            "ExpiredDay": $scope.ConsentFormsDatareq.ExpiredDay || null
        };

        eHnoteSettingsDataService.AddUpdateOrganizationConsents(req).then(function (resp) {
            console.log(resp);

            if (resp.data.status === "Success") {
                alertify.success("Added Successfully");
                $scope.clearEmptyData();
                $scope.mainConsentObj.HtmlContent = "";
                $scope.mainConsentObj.IsSideBarAddFieldsShow = false;
                $scope.mainConsentObj.IsSideBarAddSignatureShow = false;
                $scope.mainConsentObj.IsSideBarUploadFilesShow = false;
                $scope.GetConsentsByOrganizationAndType();
            } else {
                alertify.error(resp.data.Message);
                return false;
            }


        }, function (err) {
            alertify.success("Updating Failed");
        });
    };

    $scope.GetConsenForm = {
        "masterConsentsPageSize": 500,
        "masterConsentsPageNumber": 1,
        "masterConsentsSearchText": "",
        "ServiceTypeId": 0,
        "TotalCount": 0
    };

    $scope.masterConsentsPagechanged = function (pagenumber) {
        $scope.GetConsenForm.masterConsentsPageNumber = pagenumber;
        $scope.GetConsentsByOrganizationAndType();
    };


    $scope.Consentformlist = [];
    $scope.GetConsentsByOrganizationAndType = function (P_id, Id) {
        P_id = P_id || 0;
        Id = Id || 0;
        if (P_id != 0) {
            $scope.GetConsenForm.masterConsentsPageNumber = P_id;
        }
        //var obj = {
        //    "ParentOrganizationId": $scope.ParentHospitalId,
        //    "Type": 1,
        //    "ConsentTypeId": 0,
        //    "SearchText": $scope.GetConsenForm.masterConsentsSearchText,
        //    "PageSize": $scope.GetConsenForm.masterConsentsPageSize,
        //    "PageNumber": $scope.GetConsenForm.masterConsentsPageNumber
        //};

        var obj = {
            "ParentOrganizationId": $scope.ParentHospitalId,
            "Type": 1,
            "ConsentTypeId": Id || 0,
            "SearchText": $scope.GetConsenForm.masterConsentsSearchText,
            "PageSize": $scope.GetConsenForm.masterConsentsPageSize,
            "PageNumber": $scope.GetConsenForm.masterConsentsPageNumber
        };

        eHnoteSettingsDataService.GetConsentsByOrganizationAndType(obj).then(function (resp) {
            $scope.Consentformlist = [];
            if (resp.data.rows.length > 0) {
                $scope.Consentformlist = resp.data.rows || [];
                // $scope.Letterslist = resp.data.LetterArray || [];
                $scope.GetConsenForm.masterConsentsItems = resp.data.count;
                angular.forEach($scope.Consentformlist, function (mitem) {
                    mitem.IsSelected = false;
                });

                //$scope.masterMedicinePageSize = Math.ceil(resp.data.count/50) || 10;
            }
            if (resp.data.LetterArray.length > 0) {
                $scope.Letterslist = resp.data.LetterArray || [];
                $scope.GetConsenForm.masterLetterItems = resp.data.LetterCount;
                angular.forEach($scope.Letterslist, function (mitem) {
                    mitem.IsSelected = false;
                });
                //$scope.masterMedicinePageSize = Math.ceil(resp.data.count/50) || 10;
            }
        }, function (err) {
            console.log(err);
        });
    }
    $scope.GetConsentsByOrganizationAndType();

    $scope.masterMedicinePageSize = 10;
    $scope.getConsentTemplateObj = {
        "OrganizationId": $scope.HospitalId,
        "PageSize": 500,
        "PageNumber": 1,
        "SearchText": "",
        "ServiceTypeId": 0,
        "TotalCount": 0
    };

    $scope.consentTemplatesArray = [];
    $scope.GetConsentsTemplateByOrganization = function (P_id) {
        P_id = P_id || 0;
        if (P_id != 0) {
            $scope.getConsentTemplateObj.PageNumber = P_id;
        }
        var obj = {
            "OrganizationId": $scope.getConsentTemplateObj.OrganizationId,
            "PageSize": $scope.getConsentTemplateObj.PageSize,
            "PageNumber": $scope.getConsentTemplateObj.PageNumber,
            "SearchText": $scope.getConsentTemplateObj.SearchText,
            "ServiceTypeId": $scope.getConsentTemplateObj.ServiceTypeId
        };

        eHnoteSettingsDataService.GetOrganizationConsentTemplates(obj).then(function (resp) {

            console.log(JSON.stringify(resp));
            $scope.consentTemplatesArray = [];
            if (resp.data.rows.length > 0) {
                $scope.consentTemplatesArray = resp.data.rows || [];

                $scope.getConsentTemplateObj.TotalCount = resp.data.count || 0;
            }
        }, function (err) {
            console.log(err);
        });
    }

    $scope.masterConsentTemplatePagechanged = function (pagenumber) {
        $scope.getConsentTemplateObj.PageNumber = pagenumber || 0;
        $scope.GetConsentsTemplateByOrganization();
    };

    $scope.showMultiSelectedDocuments = false;
    $scope.changeMultiSelectDocuments = function (item) {
        console.log(item);

        $scope.showMultiSelectedDocuments = false;
        var filteredArray = $filter('filter')($scope.Consentformlist, { 'IsSelected': true }, true);
        if (filteredArray.length > 1) {
            $scope.showMultiSelectedDocuments = true;
        }
    };

    $scope.navtoFillDocuments = function () {

        var filteredArray = $filter('filter')($scope.Consentformlist, { 'IsSelected': true }, true);
        if (filteredArray.length > 0) {


            var MainObj = {
                "selectedArray": filteredArray,
                "selectedObj": filteredArray[0]
            }

            $scope.mainConsentObj.HtmlContent = filteredArray[0].PDFcontent;
            $rootScope.$emit("selectedMultipleConsentsObj", MainObj);
        }
    }

    $scope.showSelectedTemplateContent = function (item) {

        $scope.mainConsentObj.HtmlContent = item.PDFcontent;
        $scope.mainConsentObj.IsSideBarAddFieldsShow = false;
        $scope.mainConsentObj.IsSideBarAddSignatureShow = false;
        $scope.mainConsentObj.IsSideBarUploadFilesShow = false;
        $scope.mainConsentObj.IsShowTemplates = false;
        $scope.mainConsentObj.IsNewEmptyDoc = false;
        $scope.mainConsentObj.IsTemplateEmptyDoc = true;
        $scope.mainConsentObj.IsFontName = false;
        $scope.mainConsentObj.IsFontSize = false;

    };

    $scope.clearEmptyData = function () {
        $scope.mainConsentObj.IsSideBarAddFieldsShow = false;
        $scope.mainConsentObj.IsSideBarAddSignatureShow = false;
        $scope.mainConsentObj.IsSideBarUploadFilesShow = false;
        $scope.mainConsentObj.IsShowTemplates = true;
        $scope.mainConsentObj.IsNewEmptyDoc = false;
        $scope.mainConsentObj.IsTemplateEmptyDoc = false;

        $scope.mainConsentObj.IsFontName = false;
        $scope.mainConsentObj.IsFontSize = false;
        $scope.ConsentFormsDatareq = getnewConsentAddObj();
    }

    $scope.showNewEditorFields = function () {
        $scope.mainConsentObj.IsSideBarAddFieldsShow = false;
        $scope.mainConsentObj.IsSideBarAddSignatureShow = false;
        $scope.mainConsentObj.IsSideBarUploadFilesShow = false;
        $scope.mainConsentObj.IsShowTemplates = false;
        $scope.mainConsentObj.IsNewEmptyDoc = true;
        $scope.mainConsentObj.IsTemplateEmptyDoc = false;

        $scope.mainConsentObj.HtmlContent = "";
        $scope.mainConsentObj.IsFontName = false;
        $scope.mainConsentObj.IsFontSize = false;
        $scope.ConsentFormsDatareq = getnewConsentAddObj();
        var editorScope = textAngularManager.retrieveEditor('htmlcontentconsent').scope;
        $timeout(function () {
            editorScope.displayElements.text[0].focus();
            var innerTaTextElementId = editorScope.displayElements.text[0].id;
            placeCaretAtEnd(document.getElementById(innerTaTextElementId));
        });
    };

    function placeCaretAtEnd(el) {
        el.focus();
        if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    }

    $scope.hideAddNewFields = function () {
        $scope.mainConsentObj.IsSideBarAddFieldsShow = false;
        var editorScope = textAngularManager.retrieveEditor('htmlcontentconsent').scope;
        $timeout(function () {
            editorScope.displayElements.text[0].focus();
            var innerTaTextElementId = editorScope.displayElements.text[0].id;
            placeCaretAtEnd(document.getElementById(innerTaTextElementId));
        });
    };


    $scope.UseCurrentDocument = function (item) {

        $scope.mainConsentObj.HtmlContent = item.PDFcontent;
        $rootScope.$emit("selectedDocumentConsentobj", item);
    };



    $scope.EditCurrentDocument = function (item) {

        // 🔥 Same screen open cheyyi
        $scope.mainConsentObj.IsSideBarAddFieldsShow = false;
        $scope.mainConsentObj.IsSideBarAddSignatureShow = false;
        $scope.mainConsentObj.IsSideBarUploadFilesShow = false;
        $scope.mainConsentObj.IsShowTemplates = false;
        $scope.mainConsentObj.IsNewEmptyDoc = true;
        $scope.mainConsentObj.IsTemplateEmptyDoc = false;

        // 🔥 Right side form values
        $scope.ConsentFormsDatareq.ConsentTypeId = item.ConsentTypeId;
        $scope.ConsentFormsDatareq.ConsentSubTypeId = item.ConsentSubTypeId;
        $scope.ConsentFormsDatareq.ConsentName = item.DocumentName;
        $scope.ConsentFormsDatareq.OrganisationConsentFormId = item.DocId;
        $scope.ConsentFormsDatareq.IsPatientSignRequired = item.IsPatientSignRequired;
        $scope.ConsentFormsDatareq.IsDoctorSignRequired = item.IsDoctorSignRequired;
        $scope.ConsentFormsDatareq.IsAnesthesistSignRequired = item.IsAnesthesistSignRequired;
        $scope.ConsentFormsDatareq.IsCounselorSignRequired = item.IsCounselorSignRequired;
        $scope.ConsentFormsDatareq.IsStaffSignRequired = item.IsStaffSignRequired;
        $scope.ConsentFormsDatareq.IsGuardianSignRequired = item.IsGuardianSignRequired;
        $scope.ConsentFormsDatareq.IsSignRequiredForEachVisit = item.IsSignRequiredForEachVisit;
        $scope.ConsentFormsDatareq.ExpiredDay = item.ExpiredDay;

        // 🔥 SAME editor screen + DATA
        $scope.initConsentEditor(item.PDFcontent);
    };


    $scope.deleteCurrentDocument = function (item) {
        var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>Are you sure you want to Delete? </h4>",
            function () {
                var req = {
                    "ParentOrganizationId": $scope.ParentHospitalId,
                    "UserId": $scope.userId,
                    "OrganisationConsentFormId": item.DocId || 0,
                    "ConsentName": item.DocumentName || '',
                    "ConsentTypeId": item.ConsentTypeId || null,
                    "ConsentSubTypeId": item.ConsentSubTypeId || null,
                    "DeleteInd": "Y",
                    "PDfcontent": item.PDFcontent || "",
                    "Type": 1,

                };

                eHnoteSettingsDataService.AddUpdateOrganizationConsents(req).then(function (resp) {
                    console.log(resp);
                    alertify.success("Deleted Successfully");
                    $scope.clearEmptyData();
                    $scope.mainConsentObj.HtmlContent = "";
                    $scope.mainConsentObj.IsSideBarAddFieldsShow = false;
                    $scope.mainConsentObj.IsSideBarAddSignatureShow = false;
                    $scope.mainConsentObj.IsSideBarUploadFilesShow = false;
                    $scope.GetConsentsByOrganizationAndType();

                }, function (err) {
                    alertify.success("Updating Failed");
                });
            }, function () {
                return false;
            });

    }

    $scope.saveasNewDocument = function () {
        $scope.mainConsentObj.IsDirectSave = false;
        $scope.ConsentFormsDatareq.OrganisationConsentFormId = 0;
        $scope.ConsentFormsDatareq.ConsentTypeId = 0;
        $scope.ConsentFormsDatareq.ConsentSubTypeId = 0;
        $scope.ConsentFormsDatareq.ConsentName = "";
    };

    $scope.clearConsentDocument = function () {
        $scope.ConsentFormsDatareq.ConsentTypeId = 0;
        $scope.ConsentFormsDatareq.ConsentSubTypeId = 0;
        $scope.ConsentFormsDatareq.ConsentName = "";
        $scope.ConsentFormsDatareq.PDfcontent = "";
        $scope.mainConsentObj.HtmlContent = "";
        $scope.mainConsentObj.IsDirectSave = true;
        $scope.ConsentFormsDatareq.ProcedureId = "";
        $scope.ConsentFormsDatareq.OrganizationProcedureId = "";
        $scope.ConsentFormsDatareq.OrganisationConsentFormId = "";
    };


    $scope.GetOrganizationProcedure = function (val) {

        var obj = {
            "OrganizationId": $scope.HospitalId,
            "ProcedureId": 0,
            "CPTCODE": "",  // cptcode tblorganizationprocedure
            "SearchText": val || "", // searchtext
            "TypeOfServiceId": 0,
            "PageNumber": 1,
            "PageSize": 10,
            "GetAllIndicator": 0,
            "ParentOrganizationId": $scope.ParentHospitalId,
            "Status": 1
        };
        return eHnoteSettingsDataService.GetOrganizationProcedures(obj).then(function (response) {
            console.log(response);
            if (response.data.Status == "Success") {
                if (response.data.rows !== undefined) {
                    return response.data.rows.map(function (item) {
                        return item;
                    });
                }
            }
        });
    };

    $scope.onClickProcedure = function (Obj, MainObj) {
        MainObj.OrganizationProcedureId = Obj.OrganizationProcedureId;
        MainObj.ProcedureId = Obj.ProcedureId;
    };
    $scope.ChangeProcedure = function (MainObj) {
        MainObj = MainObj || "";
        if (MainObj == "") {
            MainObj.OrganizationProcedureId = 0;
            MainObj.ProcedureId = 0;
        }

    };
    $scope.AllHospitalsList.forEach(item => {
        item.IsChecked = false;
        if (item.ClinicId === $scope.HospitalId) {
            item.IsChecked = true;
            $scope.selectedLocationString = item.ClinicName;
        }
    })
    $scope.selectedHospitalId = $scope.HospitalId;
    $scope.changeAppointmentBranch = function (obj) {
        obj.IsChecked = !obj.IsChecked;
        angular.forEach($scope.AllHospitalsList, function (mitem) {
            mitem.IsChecked = false;
        });
        obj.IsChecked = true;
        $scope.getConsentTemplateObj.OrganizationId = obj.ClinicId;
        $scope.getConsentTemplateObj.SearchText = "";
        $scope.getConsentTemplateObj.PageNumber = 1;
        $scope.selectedHospitalId = obj.ClinicId;
        $scope.selectedBranch = obj;
        // $scope.GetConsentsTemplateByOrganization();
        updateLocationString();
    };

    function updateLocationString() {
        const selectedLocations = $scope.AllHospitalsList.filter(mitem => mitem.IsChecked && mitem.ClinicId !== 0);

        if (selectedLocations.length === 0) {
            $scope.selectedLocationString = "Select Location";
        } else {
            $scope.selectedLocationString = selectedLocations[0].ClinicName;
        }
    }


    $scope.subChildConsentTab = 1;
    $scope.switchChildConsentSubTab = function (val) {
        $scope.subChildConsentTab = val;
        if ($scope.subChildConsentTab === 1) {
            $scope.GetConsenForm.masterConsentsSearchText = '';
            $scope.GetConsenForm.masterConsentsPageNumber = 1;
            $scope.GetConsentsByOrganizationAndType();
        } else if ($scope.subChildConsentTab == 2) {
            $scope.getConsentTemplateObj.SearchText = '';
            $scope.getConsentTemplateObj.PageNumber = 1;
            $scope.GetConsentsTemplateByOrganization();
            getAllServiceTypes()
        } else {
            $scope.GetConsenForm.masterConsentsSearchText = '';
            $scope.GetConsenForm.masterConsentsPageNumber = 1;
            $scope.GetConsentsByOrganizationAndType();
        }

    };
    $scope.consentFormObj = {
        "Reason": '',
    };
    $scope.selectdServiceType = "";
    $scope.AllApptVisitReasons = [];
    function getAllServiceTypes() {
        let hospitalIdList = $scope.AllUserBranchesList.filter(item => item.ClinicId !== 0).map(item => item.ClinicId).join(',')
        console.log(hospitalIdList);
        var obj = {
            "OrganizationId": hospitalIdList,
            "ReasonTypeId": 1,
            "SearchText": "",
            "VisitTypeId": null
        };
        eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(obj).then(function (resp) {
            if (resp.data.rows.length > 0) {
                $scope.AllApptVisitReasons = resp.data.rows || [];
            }

        }, function (err) {
            console.log(err);
        });
    }
    $scope.onSelectApptVisitReason = function (item) {
        $scope.selectdServiceType = item.Reason;
        $scope.getConsentTemplateObj.ServiceTypeId = item.ReasonId;
    };
    $scope.navtoCreateConsentTemplatePopup = function (mainobj) {

        if (mainobj == undefined) {
            var H_id = $scope.HospitalId;
        } else {
            var H_id = mainobj.OrganizationId;
        }

        var tempitem = mainobj || "";


        var sobj = {
            "selectedObj": "",
            "ConsentTemplateId": 0
        }

        if (tempitem != "") {
            sobj.selectedObj = tempitem;
            sobj.ConsentTemplateId = mainobj.ConsentTemplateId
        }
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/AddUpdateConsentTemplate.html",
            "backdrop": "static",
            "size": "lg",
            //"windowClass": " ",
            "windowClass": "modal__sixty--",
            "scope": $scope,
            "keyboard": false,
            "resolve": {
                "ParentObj": function () { return sobj; },
                "AllUserBranchesList": function () { return $scope.AllUserBranchesList; },
                /*"userLocationId": function () { return $scope.HospitalId; }*/
                "userLocationId": function () { return H_id; }
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, ParentObj, AllUserBranchesList, userLocationId) {

                //$scope.selectedLocationString;
                $scope.parentObj = ParentObj;
                //$scope.allBranches = AllUserBranchesList.map(item => {
                //    item.IsChecked = false;
                //    if (userLocationId === item.ClinicId) {
                //        item.IsChecked = true;
                //        $scope.selectedLocationString = item.ClinicName;
                //    }
                //    return item;
                //});
                $scope.allBranches = AllUserBranchesList || [];
                if ($scope.allBranches.length > 0) {
                    if ($scope.parentObj.ConsentTemplateId == 0) {
                        angular.forEach($scope.allBranches, function (bitem) {
                            bitem.IsChecked = true;
                        });
                    } else {
                        angular.forEach($scope.allBranches, function (bitem) {
                            bitem.IsChecked = (bitem.BranchId === userLocationId);
                        });
                    }
                    updateLocationString();
                }
                //multi check visit reasons
                $scope.selectedVisitReason = 'Select Visit Reasons';
                $scope.AllVisitReasonObj = {
                    "AllVisitReasonsCheck": false
                }
                $scope.searchHospital.visitRsnName = "";
                $scope.checkAllVisitReasons = function (val) {
                    if (val) {
                        angular.forEach($scope.AllVisitReasons, function (item) {
                            item.isChecked = true;
                        });
                        $scope.selectedVisitReason = 'All Visit Reasons';
                    } else {
                        angular.forEach($scope.AllVisitReasons, function (item) {
                            item.isChecked = false;
                        });
                        $scope.selectedVisitReason = 'Select Visit Reasons';
                    }
                    var checkedArray = _.where($scope.AllVisitReasons, { isChecked: true });
                    $scope.AllVisitReasonObj.AllVisitReasonsCheck = checkedArray.length > 0 && $scope.AllVisitReasons.length === checkedArray.length ? true : false;
                };
                $scope.selectedConsents = [];
                $scope.AllVisitReasons = [];
                $scope.servicetypeidlist = [];
                function getNewAddUpdateConsentObj() {
                    var obj = {
                        "ConsentTemplateId": 0,
                        "ConsentTemplateName": "",
                        "ConsentFormObj": "",
                        "ServiceTypeId": 0,
                        "ServiceTypeName": "",
                        "ServiceTypeObj": "",
                        "DeleteInd": "N",
                        "IsPrimary": "N",
                        "TemplateDetails": []
                    };
                    /*var obj = {
                        "UserId": $scope.UserId,
                        "OrganizationTemplates": [
                            {
                                "OrganizationId": 3,
                                "ConsentTemplateId": 0,
                                "ConsentTemplateName": "wudgyuwd",
                                "ConsentFormObj": "",
                                "ServiceTypeId": 5104,
                                "ServiceTypeName": "cataract.",
                                "ServiceTypeObj": "",
                                "DeleteInd": "N",
                                "IsPrimary": "N",
                                "TemplateDetails": []
                            }
                        ]
                    }*/
                    return obj;
                };

                function templateDetailObj() {
                    var obj = {
                        "ConsentTemplateDetailId": 0,
                        "ConsentTemplateId": 0,
                        "DocumentName": "",
                        "OrganisationConsentFormId": 10,
                        "DeleteInd": "N"
                    };
                    return obj;
                }


                $scope.addUpdateConsentTemplateObj = getNewAddUpdateConsentObj();


                if ($scope.parentObj.ConsentTemplateId !== 0) {
                    $scope.addUpdateConsentTemplateObj.ConsentTemplateId = $scope.parentObj.selectedObj.ConsentTemplateId;
                    $scope.addUpdateConsentTemplateObj.ConsentTemplateName = $scope.parentObj.selectedObj.ConsentTemplateName;
                    $scope.addUpdateConsentTemplateObj.IsPrimary = $scope.parentObj.selectedObj.IsPrimary || "N";
                    $scope.addUpdateConsentTemplateObj.ServiceTypeId = $scope.parentObj.selectedObj.ServiceTypeId;
                    $scope.addUpdateConsentTemplateObj.ServiceTypeName = $scope.parentObj.selectedObj.ServiceTypeName;
                    $scope.addUpdateConsentTemplateObj.ServiceTypeObj = $scope.parentObj.selectedObj.ServiceTypeObj;
                    angular.forEach($scope.parentObj.selectedObj.TemplateDetails, function (citem) {
                        var obj = templateDetailObj();
                        obj.ConsentTemplateId = citem.ConsentTemplateId;
                        obj.ConsentTemplateDetailId = citem.ConsentTemplateDetailId;
                        obj.OrganisationConsentFormId = citem.OrganisationConsentFormId
                        obj.DocumentName = citem.DocumentName;
                        $scope.selectedConsents.push(obj);
                    });
                    // visit reasons
                    let ServiceTypeobj = {
                        "ServiceTypeId": $scope.addUpdateConsentTemplateObj.ServiceTypeId || 0,
                        "ServiceTypeName": $scope.addUpdateConsentTemplateObj.ServiceTypeName || ""
                    }
                    $scope.selectedVisitReason = $scope.addUpdateConsentTemplateObj.ServiceTypeName;
                    $scope.servicetypeidlist.push(ServiceTypeobj);
                }

                $scope.changeAppointmentBranch = function (obj) {
                    if (obj.ClinicId === 0) {
                        angular.forEach($scope.allBranches, function (mitem) {
                            mitem.IsChecked = obj.IsChecked;
                        });
                    } else {
                        const allChecked = $scope.allBranches.every(mitem => mitem.IsChecked || mitem.ClinicId === 0);
                        $scope.allBranches.find(mitem => mitem.ClinicId === 0).IsChecked = allChecked;
                    }

                    if (obj.IsChecked) {
                        $scope.selectedBranch = obj;
                    }
                    updateLocationString();
                    $scope.getAllVisitReasons();
                };

                function updateVisitReasonString() {
                    const selectedVisitReaaon = $scope.AllVisitReasons.filter(mitem => mitem.isChecked && mitem.ReasonId !== 0);
                    if (selectedVisitReaaon.length === 0) {
                        $scope.selectedVisitReason = "Select Visit Reason";
                    } else if (selectedVisitReaaon.length === 1) {
                        $scope.selectedVisitReason = selectedVisitReaaon[0].Reason;
                    } else if (selectedVisitReaaon.length === $scope.AllVisitReasons.length) {
                        $scope.selectedVisitReason = "All Visit Reasons";
                    } else {
                        $scope.selectedVisitReason = "Selected";
                    }
                }
                function updateLocationString() {
                    const selectedLocations = $scope.allBranches.filter(mitem => mitem.IsChecked && mitem.ClinicId !== 0);

                    if (selectedLocations.length === 0) {
                        $scope.selectedLocationString = "Select Location";
                    } else if (selectedLocations.length === 1) {
                        $scope.selectedLocationString = selectedLocations[0].ClinicName;
                    } else if (selectedLocations.length === $scope.allBranches.length - 1) {
                        $scope.selectedLocationString = "All Locations";
                    } else {
                        $scope.selectedLocationString = "Selected";
                    }
                }
                $scope.SaveAddUpdateConsentTemplateDetails = function () {
                    let hospitalIdsList = ($scope.allBranches || []).filter(item => item.IsChecked === true && item.ClinicId !== 0).map(item => item.ClinicId) || [];
                    if (hospitalIdsList.length === 0) {
                        alertify.error("Please Select Location");
                        return false;
                    }
                    $scope.addUpdateConsentTemplateObj.TemplateDetails = $scope.selectedConsents || [];
                    if ($scope.addUpdateConsentTemplateObj.ConsentTemplateId === 0) {
                        if ($scope.addUpdateConsentTemplateObj.ConsentTemplateName === "") {
                            alertify.error("Please Enter Template Name");
                            return false;
                        }
                        //if ($scope.addUpdateConsentTemplateObj.ServiceTypeObj === "") {
                        //    alertify.error("Please Enter Service Type");
                        //    return false;
                        //}
                        let VisitReasonList = ($scope.AllVisitReasons || []).filter(item => item.isChecked === true && item.ReasonId !== 0).map(item => item.ReasonId) || [];
                        if (VisitReasonList.length === 0) {
                            alertify.error("Please Select Visit Reason");
                            return false;
                        }
                        if ($scope.addUpdateConsentTemplateObj.TemplateDetails.length === 0) {
                            alertify.error("Please Select Consent Form");
                            return false;
                        }
                    }
                    console.log($scope.addUpdateConsentTemplateObj);
                    $scope.addUpdateConsentTemplateObj.ServiceTypeObj = "";
                    let servicetypeidlist = angular.copy($scope.servicetypeidlist) || [];
                    let OrganizationTemplates = [];
                    hospitalIdsList.forEach(orgId => {
                        servicetypeidlist.forEach(serviceItem => {
                            let newTemplate = angular.copy($scope.addUpdateConsentTemplateObj);
                            newTemplate.OrganizationId = orgId;
                            newTemplate.ServiceTypeId = serviceItem.ServiceTypeId;
                            newTemplate.ServiceTypeName = serviceItem.ServiceTypeName;
                            OrganizationTemplates.push(newTemplate);
                        });
                    });
                    console.log("OrganizationTemplates", OrganizationTemplates)
                    let consentTemplateParamObjForMultipleLocations = {
                        "UserId": $scope.UserId,
                        "OrganizationTemplates": OrganizationTemplates
                    }
                    console.log("consentTemplateParemObjForMultipleLocations", consentTemplateParamObjForMultipleLocations)
                    eHnoteSettingsDataService.AddUpdateOrganizationConsentTemplatesNew(consentTemplateParamObjForMultipleLocations).then(function (response) {
                        if (response.data.Status == "Success") {
                            $scope.addUpdateConsentTemplateObj = getNewAddUpdateConsentObj();
                            var obj = {
                                Status: 'Close',
                            }
                            $uibModalInstance.close(obj);
                        } else {
                            alertify.error(response.data.Message);
                        }
                    }, function (error) {

                    });
                }

                $scope.ClearDetails = function () {
                    if ($scope.addUpdateConsentTemplateObj.ConsentTemplateId == 0) {
                        $scope.addUpdateConsentTemplateObj = getNewAddUpdateConsentObj();
                    } else {
                        $scope.addUpdateConsentTemplateObj.ConsentFormObj = '';
                    }
                    $scope.changesearchConsentForm($scope.addUpdateConsentTemplateObj.ConsentFormObj);
                };


                $scope.changesearchConsentForm = function (val) {
                    var value = val || "";
                    //if (value == "") {

                    //} else {

                    //}
                    var obj = {
                        "ParentOrganizationId": $scope.ParentHospitalId,
                        "Type": 1,
                        "ConsentTypeId": 0,
                        "SearchText": value,
                        "PageSize": 10,
                        "PageNumber": 1
                    };
                    eHnoteSettingsDataService.GetConsentsByOrganizationAndType(obj).then(function (resp) {
                        $scope.Consentformlist = [];
                        if (resp.data.rows.length > 0) {
                            $scope.Consentformlist = resp.data.rows || [];
                            angular.forEach($scope.Consentformlist, function (mitem) {
                                mitem.IsSelected = false;
                            });
                        }
                        if (resp.data.rows.LetterArray > 0) {
                            $scope.Letterslist = resp.data.LetterArray || [];
                            angular.forEach($scope.Letterslist, function (mitem) {
                                mitem.IsSelected = false;
                            });
                        }
                    }, function (err) {
                        console.log(err);
                    });
                }

                $scope.removeConsentTemplateitem = function (item) {
                    if (item.ConsentTemplateDetailId == 0) {
                        angular.forEach($scope.selectedConsents, function (pitem, index) {
                            if (pitem.OrganisationConsentFormId == item.OrganisationConsentFormId) {
                                $scope.selectedConsents.splice(index, 1);
                            }
                        });
                    } else {
                        item.DeleteInd = "Y";
                    }

                }


                $scope.pushConsentItem = function (item) {
                    if (item.IsSelected) {
                        var filteredArray = $filter("filter")($scope.selectedConsents, { "OrganisationConsentFormId": item.ConsentFormId, "DeleteInd": 'N' }, true);

                        if (filteredArray.length > 0) {
                            alertify.error("Already Added");
                            item.IsSelected = false;
                            return false;
                        }
                        var obj = templateDetailObj();
                        obj.OrganisationConsentFormId = item.ConsentFormId
                        obj.ConsentTemplateId = $scope.addUpdateConsentTemplateObj.ConsentTemplateId || 0;
                        obj.DocumentName = item.DocumentName;
                        $scope.selectedConsents.push(obj);
                    } else {
                        angular.forEach($scope.selectedConsents, function (mitem, index) {
                            if (item.ConsentFormId === mitem.OrganisationConsentFormId) {
                                if (mitem.ConsentTemplateDetailId == 0) {
                                    $scope.selectedConsents.splice(index, 1);
                                }
                            }
                        });
                    }

                }

                $scope.cancelUib = function () {
                    var obj = {
                        Status: 'Close',
                    }
                    /*$uibModalInstance.dismiss("cancel");*/
                    $uibModalInstance.close(obj);
                };
                $scope.changesearchConsentForm("");


                $scope.getAllVisitReasons = function () {
                    let hospitalIdList = $scope.allBranches.filter(item => item.IsChecked === true && item.ClinicId !== 0).map(item => item.ClinicId).join(',')
                    console.log(hospitalIdList);
                    var obj = {
                        "OrganizationId": hospitalIdList,
                        "ReasonTypeId": 1,
                        "SearchText": "",
                        "VisitTypeId": null
                    };
                    eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(obj).then(function (resp) {
                        if (resp.data.rows.length > 0) {
                            $scope.AllVisitReasons = resp.data.rows || [];
                            updateLocationString();
                            if ($scope.parentObj.ConsentTemplateId !== 0) {

                                //var filteredArray = $filter("filter")($scope.AllVisitReasons, { "ReasonId": $scope.parentObj.selectedObj.ServiceTypeId }, true);
                                //if (filteredArray.length > 0) {
                                //    $scope.addUpdateConsentTemplateObj.ServiceTypeObj = filteredArray[0];
                                //}
                                // visit reason
                                $scope.AllVisitReasons.forEach(item => {
                                    item.isChecked = false;
                                    if (item.ReasonId === $scope.parentObj.selectedObj.ServiceTypeId) {
                                        item.isChecked = true;
                                    }
                                });
                            }
                        }

                    }, function (err) {
                        console.log(err);
                    });
                }

                $scope.onSelectVisitReason = function (item) {
                    console.log(item);
                    //$scope.addUpdateConsentTemplateObj.ServiceTypeId = item.ReasonId;
                    //$scope.addUpdateConsentTemplateObj.ServiceTypeName = item.Reason;
                    if (item.isChecked) {
                        let obj = {
                            "ServiceTypeId": item.ReasonId || 0,
                            "ServiceTypeName": item.Reason || ""
                        }
                        $scope.servicetypeidlist.push(obj);
                    }
                    else {
                        let index = $scope.servicetypeidlist.findIndex(function (sitem) {
                            return sitem.ServiceTypeId == item.ReasonId;
                        });
                        if (index > -1) {
                            $scope.servicetypeidlist.splice(index, 1);
                        }
                    }
                    updateVisitReasonString();
                };
                $scope.getAllVisitReasons();
            }
        });

        $scope.mInstanceAdd.result.then(function (resp) {
            if (resp.Status == "Close") {
                $scope.GetConsentsTemplateByOrganization();
            }
        }, function (cancel) {
            console.log(cancel);
        });
    }

    $scope.EditConsentTemplateItem = function (item) {
        console.log(item)
        $scope.navtoCreateConsentTemplatePopup(item);
    };

    $scope.deleteConsentTemplateItem = function (item) {


        var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>Are you sure you want to Delete? </h4>",
            function () {
                var obj = {
                    "UserId": $scope.UserId,
                    "OrganizationId": $scope.HospitalId,
                    "ConsentTemplateId": item.ConsentTemplateId,
                    "ConsentTemplateName": item.ConsentTemplateName,
                    "ConsentFormObj": "",
                    "ServiceTypeId": item.ServiceTypeId,
                    "ServiceTypeName": item.ServiceTypeName,
                    "ServiceTypeObj": "",
                    "DeleteInd": "Y",
                    "TemplateDetails": []
                };

                /*angular.forEach($scope.parentObj.selectedObj.TemplateDetails, function (citem) {*/
                $scope.selectedConsents = [];

                item.TemplateDetails = item.TemplateDetails || [];
                if (item.TemplateDetails.length > 0) {
                    angular.forEach(item.TemplateDetails, function (citem) {
                        var cobj = {
                            "ConsentTemplateDetailId": citem.ConsentTemplateDetailId,
                            "ConsentTemplateId": item.ConsentTemplateId,
                            "DocumentName": "",
                            "OrganisationConsentFormId": citem.OrganisationConsentFormId,
                            "DeleteInd": "Y"
                        }
                        $scope.selectedConsents.push(cobj);
                    });
                }

                eHnoteSettingsDataService.AddUpdateOrganizationConsentTemplates(obj).then(function (response) {
                    if (response.data.Status == "Success") {
                        alertify.success("Deleted Successfully");
                        $scope.GetConsentsTemplateByOrganization();
                    } else {
                        alertify.error(response.data.Message);
                    }
                }, function (error) {

                });
            }, function () {
                return false;
            });



    }

    $scope.initOrgLogo = function () {

        $scope.mainConsentObj.OrganizationLogoUrl = printobj.PrintHeaderImgUrl;
        $scope.toDataURL($scope.mainConsentObj.OrganizationLogoUrl, function (dataURL) {
            $scope.mainConsentObj.OrganizationBase64 = dataURL;
        });
    }

    $scope.ClearConsentTabSearch = function () {
        $scope.GetConsenForm.masterConsentsSearchText = '';
        $scope.GetConsenForm.masterConsentsPageNumber = 1;
        $scope.GetConsentsByOrganizationAndType();
    };

    $scope.ClearConsentTemplateSearch = function () {
        $scope.getConsentTemplateObj.SearchText = '';
        $scope.getConsentTemplateObj.ServiceTypeId = '';
        $scope.selectdServiceType = ""
        $scope.getConsentTemplateObj.PageNumber = 1;
        $scope.GetConsentsTemplateByOrganization();
    };


    $scope.initOrgLogo();

    $scope.openPrintPreview = function () {
        //var htmlContent = $scope.mainConsentObj.HtmlContent; // Get the HTML content from TextAngular

        //// Create a new window
        //var printWindow = window.open('', '_blank');

        //// Write HTML content to the new window
        //printWindow.document.write('<html><head><title>Print Preview</title></head><body>');
        //printWindow.document.write(htmlContent); // Write HTML content
        //printWindow.document.write('</body></html>');

        //// Close the document writing
        //printWindow.document.close();

        //// Print the content
        //printWindow.print();

        var htmlContent = $scope.mainConsentObj.HtmlContent; // Get the HTML content from TextAngular
        console.log(JSON.stringify(htmlContent));
        var pdfContent = htmlToPdfmake(htmlContent);

        console.log(JSON.stringify(pdfContent));
        var docdefination = {
            content: [
                pdfContent // Include PDFMake-compatible content
            ],
            pageBreakBefore: function (currentNode) {
                return currentNode.style && currentNode.style.indexOf('pdf-pagebreak-before') > -1;
            },
            defaultStyle: {
                font: "Roboto"
            },
            pageSize: 'A4',
            pageOrientation: 'portrait',//portrait landscape
            pageMargins: [40, 20, 40, 60],
            styles: {
                tableExample: {
                    margin: [0, 5, 0, 5]
                }
            }
        };

        pdfMake.createPdf(docdefination).print();
    };



    $scope.openEditor = function () {

        $scope.mainConsentObj.IsSideBarAddFieldsShow = false;
        $scope.mainConsentObj.IsSideBarAddSignatureShow = false;
        $scope.mainConsentObj.IsSideBarUploadFilesShow = false;
        $scope.mainConsentObj.IsShowTemplates = false;
        $scope.mainConsentObj.IsNewEmptyDoc = true;
        $scope.mainConsentObj.IsTemplateEmptyDoc = false;

        $scope.mainConsentObj.HtmlContent = "";

        // 🔥 SAME screen + EMPTY editor
        $scope.initConsentEditor("");
    };



    $scope.initConsentEditor = function (html) {

        $timeout(function () {

            if (window.CKEDITOR && CKEDITOR.instances.consentEditor) {
                CKEDITOR.instances.consentEditor.destroy(true);
            }
            // ✅ Register custom "AddHeader" plugin BEFORE replace()
            if (!CKEDITOR.plugins.registered['addheader']) {
                CKEDITOR.plugins.add('addheader', {
                    icons: 'addheader',
                    init: function (editor) {
                        editor.addCommand('insertHeaderBlock', {
                            exec: function (editor) {

                                // ✅ Only ONE header block allowed
                                var existing = editor.document.findOne('.consent-header-block');
                                if (existing) {
                                    alert('A header block already exists. Remove it first.');
                                    return;
                                }

                                // ✅ Insert the header placeholder block
                                var headerHtml = `
                                <div class="consent-header-block" 
                                     style="border:2px dashed #4a90d9;
                                            background:#f0f7ff;
                                            padding:10px 15px;
                                            margin-bottom:12px;
                                            border-radius:4px;">
                                    <p style="margin:0;font-size:11px;
                                              color:#4a90d9;font-weight:bold;">
                                        📌 HEADER — repeats on every PDF page
                                    </p>
                                    <p style="margin:4px 0 0 0;">
                                        ##HeaderClinicName## &nbsp;|&nbsp; ##HeaderFormTitle##
                                    </p>
                                </div>
                            `;
                                editor.insertHtml(headerHtml);
                            }
                        });

                        // ✅ Add toolbar button
                        editor.ui.addButton('AddHeader', {
                            label: 'Add Header',
                            command: 'insertHeaderBlock',
                            toolbar: 'insert'
                            // ✅ just remove icon line completely
                        });
                    }
                });
            }

      $scope.consentEditorInstance = CKEDITOR.replace('consentEditor', {
    height: 500,
    allowedContent: true,

    // ✅ ONLY BUILT-IN PLUGINS
          extraPlugins: 'addfield,addlogo,addheader,table,tabletools,horizontalrule,pagebreak,print',

// 🔥 ONLY THESE TWO LINES ARE NEEDED
    pasteFromWordRemoveFontStyles: false,
    pasteFromWordRemoveStyles: false,

    removePlugins: 'elementspath',
    versionCheck: false,

    toolbar: [
        { name: 'document', items: ['Print', 'PageBreak'] },
        { name: 'clipboard', items: ['Undo', 'Redo'] },
        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
        { name: 'paragraph', items: ['NumberedList', 'BulletedList'] },
        { name: 'insert', items: ['AddLogo', 'AddField', 'AddHeader', 'Table', 'HorizontalRule'] },

        { name: 'styles', items: ['Format', 'FontSize'] }
    ]
});

// sidebar insert kosam
$scope.ckEditorRef = $scope.consentEditorInstance;
            // 🔥 Sync editor → angular
            $scope.consentEditorInstance.on('change', function () {
                $scope.$applyAsync(function () {
                    $scope.mainConsentObj.HtmlContent =
                        $scope.consentEditorInstance.getData();
                });
            });

            // 🔥 LOAD DATA (Create = empty, Edit = content)
            if (html) {
                $scope.consentEditorInstance.setData(html);
                $scope.mainConsentObj.HtmlContent = html;
            }

        }, 0);
    };

$scope.addtexttoEditor = function (item) {
    var random4DigitNumber = getRandom4DigitNumber();

    var htmltext =
        "<span id='N" + item.FieldVariable + random4DigitNumber + "'>" +
        " ##" + item.FieldVariable + "## " +
        "</span>";

    // 🔥 Insert into CKEditor
    if ($scope.ckEditorRef) {
        $scope.ckEditorRef.insertHtml(htmltext);
    }

    // Signature flags (same logic)
    if (item.ConsentFieldId === 6)
        $scope.ConsentFormsDatareq.IsPatientSignRequired = true;
    else if (item.ConsentFieldId === 7)
        $scope.ConsentFormsDatareq.IsDoctorSignRequired = true;
    else if (item.ConsentFieldId === 10)
        $scope.ConsentFormsDatareq.IsAnesthesistSignRequired = true;
    else if (item.ConsentFieldId === 18)
        $scope.ConsentFormsDatareq.IsCounselorSignRequired = true;
    else if (item.ConsentFieldId === 17)
        $scope.ConsentFormsDatareq.IsStaffSignRequired = true;
    else if (item.ConsentFieldId === 19)
        $scope.ConsentFormsDatareq.IsGuardianSignRequired = true;
};


function getRandom4DigitNumber() {
    return Math.floor(Math.random() * 9000) + 1000;
}


$scope.openAddFieldSidebar = function () { 
    $scope.mainConsentObj.IsSideBarAddFieldsShow = true;
    $scope.mainConsentObj.IsSideBarAddSignatureShow = false;
    $scope.mainConsentObj.IsSideBarUploadFilesShow = false;
};


}]);
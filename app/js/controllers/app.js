"use strict";

var eHnoteWebApp = angular.module("eHnoteWebApp", [
    "ngRoute",
    "eHnoteDoctorWebAnimations",
    "eHnoteServices",
    "LocalStorageModule",
    "ngCookies",
    "ngAnimate",
    "ui.bootstrap",
    "bootstrapLightbox",
    "ngAutocomplete",
    "nvd3",
    "ngAlertify",
    "ui.calendar",
    "ngMap",
    "colorpicker.module",
    "infinite-scroll",
    "ngMaterial",
    "textAngular",
    "ngSanitize",
    "ui.select",
    "angucomplete-alt",
    "mwl.calendar",
    "ui.bootstrap.datepicker",
    "oc.lazyLoad",
    "angular-barcode",
    "ngFileUpload",
    "webcam",
    "duScroll",
    "multipleDatePicker",
    'ui.grid',
    'ui.grid.expandable',
    'ui.grid.selection',
    'ui.grid.pinning',
    'ui.multiselect',
    'ng-fusioncharts',
    'pascalprecht.translate',
    'dndLists'
    
]);
eHnoteWebApp.directive("tooltip", [function () {
    return {
        "restrict": "A",
        "link": function (scope, element, attrs) {
            $(element).hover(function () {
                $(element).tooltip("show");
            }, function () {
                $(element).tooltip("hide");
            });
        }
    };
}]); 

eHnoteWebApp.run(["$rootScope", "$location", "eHnoteMasterDataService", "$templateCache", "$window", "$interval", "$uibModalStack", "datapersistanceFactory", "eHnoteDiagnosisDataServices", "eHnoteSettingsDataService", "eHnoteLoginStatusService", "alertify", "loginCookieFactory", function ($rootScope, $location, eHnoteMasterDataService, $templateCache, $window, $interval, $uibModalStack, datapersistanceFactory, eHnoteDiagnosisDataServices, eHnoteSettingsDataService, eHnoteLoginStatusService, alertify, loginCookieFactory) {
    $rootScope.IsValidOAuth = false;
    //Global alert delay in seconds -- 3.5sec  --Pavan1616
    alertify._$alertify.delay = 3500;

    //Spell checker start
    /*$rootScope.spellSuggestion = {
        visible: false,
        words: [],
        position: {},
        target: '',
        inputRef: null
    };

    $rootScope.replaceWord = function (wrongWord, suggestion) {
        if (!$rootScope.spellSuggestion.inputRef) return;

        const input = $rootScope.spellSuggestion.inputRef[0];
        const value = input.value;
        const updated = value.replace(new RegExp('\\b' + wrongWord + '\\b', 'g'), suggestion);
        input.value = updated;

        $rootScope.spellSuggestion.visible = false;
    };*/
    //Spell checker end
    window.addEventListener('storage', function (event) {
        if (event.key === 'forceLogout') {
            // Auto logout when other tab logs out
            datapersistanceFactory.clearAll();
            $location.path("/login"); // Or your logout route
        }
    });
    var newUserId = $location.search().UserId || "";

    $rootScope.$on('$routeChangeStart', function (event, next, current) {

       

        //added by sandya 11-09-2025
       // var token = datapersistanceFactory.getItemString('JWTToken');

       //added by durga as we are mainiting overall 1 obj 

        var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        var token = userLoginDetails.JToken || [];

        console.log(token +"__Jtoken");

        if (!token || token === '[]' || token === '0' || token === '""' || token === "" || token === "\"\"" || token.length === 0) {
            token = '';
            datapersistanceFactory.remove("JWTToken");
            localStorage.removeItem("JWTToken");
         
            datapersistanceFactory.set("USerLoginTime", "");
            datapersistanceFactory.set('RefreshToken', "");
            localStorage.clear();
            sessionStorage.clear();
            datapersistanceFactory.clearAll();
            loginCookieFactory.remove('loginData');
            loginCookieFactory.remove('loggedInfo');
            datapersistanceFactory.set('doctorinfo', {});
            loginCookieFactory.clearAll();
                
        }
        if (!token) {
            if (next && next.$$route && next.$$route.originalPath !== "/login") {
                event.preventDefault();
                $location.path("/login");
                return;
            }
        }
        var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();
        if (current && current.$$route) {
            
            console.log(current.$$route + "__" + next.$$route + "__" + newUserId);

            next.$$route = next.$$route || undefined;

            if ((current.$$route.originalPath === "/summaryresult" && next.$$route.originalPath === "/main") || next.$$route == undefined) {
                $location.path("/op");
            }
            //if (next.$$route !== undefined) {

            //    console.log(current.$$route.originalPath + "__" + next.$$route.originalPath);

            //    if (current.$$route.originalPath === "/login" && next.$$route.originalPath === "/op") {
            //        $location.path("/op");
            //    }
            //}
            var userLoginDetailsnew = eHnoteLoginStatusService.getUserLoginDetails();

            if (next.$$route.originalPath === "/login" && current.$$route.originalPath === "/op" && userLoginDetailsnew.UserId!=="") {
                newUserId = userLoginDetailsnew.UserId;
            }

            if (newUserId === "") {

            } else {
                if (next.$$route.originalPath === "/op" && current.$$route.originalPath === "/login") {
                    current.$$route.originalPath = "/op";
                    next.$$route.originalPath = "/login";
                }
            }

        }
        if (typeof (current) !== "undefined") {
            $templateCache.remove(current.templateUrl);
        }
    });
    $rootScope.$on('duScrollspy:becameActive', function ($event, $element, $target) {
        //Automaticly update location
        var hash = $element.prop('hash');
        if (hash) {
            //history.replaceState(null, null, hash);
            $rootScope.ConsultationActiveId = hash;
        }

    });

    // code for when user is idle for 1 hour automatical logout.  --1616
    var IDLE_LIMIT = 60 * 60 * 1000;
    var lastActivityTime = Date.now();
    // Update activity timestamp
    function updateActivity() {
        lastActivityTime = Date.now();
    }

    // Attach events to detect user activity in app
    var activityEvents = [
        'mousemove', 'mousedown', 'keydown', 'scroll',
        'touchstart', 'touchmove'
    ].join(' ');

    angular.element($window.document).on(activityEvents, updateActivity);

    // Check every 1 minute if user is idle
    $interval(function () {
        var currentTime = Date.now();
        if ((currentTime - lastActivityTime) > IDLE_LIMIT) {
            logoutUser();
        }
    }, 60 * 1000); // every 1 minute

    function logoutUser() {
        // An idle session is still a session: drop the calling client with it, or the
        // browser keeps ringing for someone who was logged out an hour ago.
        $rootScope.$broadcast('telnyxForceOffline');
        sessionStorage.clear();
        eHnoteDiagnosisDataServices.ClearMasterConsultationCache();
        eHnoteSettingsDataService.ClearMasterClaimCache();
        angular.element('.modal-dialog').hide();
        angular.element('.modal').hide();
        angular.element('.modal-backdrop').hide();
        angular.element('.viewer-backdrop').hide();
        //hide any open bootstrap modals
        angular.element('.inmodal').hide();
        angular.element('.alertify-logs').hide();
        datapersistanceFactory.clearAll();
        datapersistanceFactory.set("JWTToken", "");
        datapersistanceFactory.set("USerLoginTime", "");
        datapersistanceFactory.set('RefreshToken', "");
        if ($window.location.host == "ioj.ehnote.com") {
            $window.location.href = "https://portal.ehnote.com/#/login";
        } else if ($window.location.host == 'insts.ehnote.com') {
            $window.location.href = "https://stage.ehnote.com/#/login";
        } else {
            $location.path("/login");
        }
        $uibModalStack.dismissAll('logout');
        if (!$rootScope.$$phase) {
            $rootScope.$apply();
        }
    }

    updateActivity();
}]);
eHnoteWebApp.config(["$routeProvider", "localStorageServiceProvider", "$httpProvider", "LightboxProvider", "$provide", "$mdDateLocaleProvider", function ($routeProvider, localStorageServiceProvider, $httpProvider, LightboxProvider, $provide, $mdDateLocaleProvider) {




    $mdDateLocaleProvider.formatDate = function (date) {
        return moment(date).format("DD/MM/YYYY");
    };

    var jspath = "app/js/controllers/";
    var jstype = ".js";

    LightboxProvider.fullScreenMode = true;
    function loadScript(path) {
        var result = $.Deferred(), script = document.createElement("script");
        script.async = "async";
        script.type = "text/javascript";
        script.src = path;
        script.onload = script.onreadystatechange = function (_, isAbort) {
            if (!script.readyState || /loaded|complete/.test(script.readyState)) {
                if (isAbort) {
                    result.reject();
                } else {
                    result.resolve();
                }
            }
        };
        script.onerror = function () {
            result.reject();
        };
        document.querySelector("head").appendChild(script);
        return result.promise();
    }
    function loader(arrayName) {
        return {
            load: function ($q) {
                var deferred = $q.defer(),
                    map = arrayName.map(function (name) {
                        return loadScript(jspath + name + jstype);
                    });
                $q.all(map).then(function (resp) {
                    deferred.resolve();
                }, function (err) { console.log(err); });
                return deferred.promise;
            }
        };
    }
    $provide.decorator("$exceptionHandler", ["$delegate", function ($delegate) {
        return function (exception, cause) {
            $delegate(exception, cause);

        };
    }]);


    $httpProvider.interceptors.push("httpInterceptor");
    $routeProvider
        .when("/login", {
            templateUrls: ["templates/login.html"]
        })
        .when("/comingbilling", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/coming-soon/billing.html"]
        })



        .when("/appointmentbilling", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/consultation/billing/Appointmentbilling.html"],
            activetab: "Claim"
        })



        .when("/appointmentFileUploads", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/appointment/AppointmentFileUploads.html"]

        })

        .when("/ApptTeleConsultation", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/appointment/TeleConsultation.html"]

        })
        .when("/OnlinePayment", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/appointment/OnlinePayment.html"]

        })
        .when("/dashboard", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/dashboard/dashboard.html"],
            activetab: "dashBoradScreen"
        })

        .when("/settings", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/settings/settings.html"],
            activetab: "settingsScreen"
        })


        .when("/crm", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/UsCrm/crmMain.html"],
            activetab: "crm"
        })



        .when("/audit", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/Audit/AuditMain.html"],
            activetab: "auditScreen"
        })

        .when("/insurance", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/Insurance/InsuranceMain.html"],
            activetab: "InsuranceScreen"
        })
        .when("/Biller", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/UsNewConsultation/MainBillerParent.html"],
            activetab: "Biller"
        })
        .when("/NewBiller", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/UsNewConsultation/NewMainBillerParent.html"],
            activetab: "NewBiller"
        })
        .when("/Biller/:tabId", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/UsNewConsultation/MainBillerParent.html"],
            activetab: "Biller"
        })
        .when("/claim/:claimId", {
            templateUrls: ["templates/UsClaims/AddUpdateClaimPopup.html"],
            activetab: "BillingScreen",
            controller: "UsClaimsParent"
        })
        .when("/ModelTest", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/consultation/ModelTest.html"]

        })





        .when("/superAdminlogin", {
            templateUrls: ["templates/superAdminlogin.html"]
        })
        .when("/SuperOranization", {
            templateUrls: ["templates/SuperOranization.html"]
        })




        .when("/docRegister", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/doctor/DocRegister.html"]

        })

        .when("/Dsip", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/Dsip.html"]

        })


        .when("/doctorprofile", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/doctor/profile-new.html"]

        })




        .when("/appointmentlist", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/appointment/appointmentlist.html"]

        })




        .when("/appointment", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/appointment/appointments.html"],
            activetab: 'appointmentScreen'
        })





        .when("/homepage", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/patient/phonenumber.html"]

        })




        .when("/phonenumber", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/patient/phonenumber.html"],
            permission: 'CONSULTATN'
        })




        .when("/patientlist", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/patient/patientlist.html"]

        })



        .when("/registerPatient", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/patient/USRegisterPatient.html"]

        })



        .when("/addpatient", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/patient/addpatient.html"]

        })

        .when("/patientemergencycontact", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/patient/patientemergencycontact.html"]

        })

        .when("/patientotherdetails", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/patient/patientotherdetails.html"]

        })





        .when("/searchpatient", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/patient/search.html"],
            activetab: 'patientsScreen'
        })





       
        .when("/op", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/Op/OP.html"],
            activetab: "op"
        })
       

        //.when("/OT", {
        //    templateUrls: ["templates/OpthaDentalHome.html", "templates/Ot/OT.html"],
        //    activetab: "ot"
        //})
        .when("/OT", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/ASC/ASCParent.html"],
            activetab: "ot"
        })

        .when("/ascprofile", {
            templateUrls: ["templates/ASC/AscModuleParent.html", "templates/patient/UsPatientProfile.html"],
            activetab: "ot"
        })
        //.when("/CounsellorList", {
        //    templateUrls: ["templates/OpthaDentalHome.html", "templates/counsellor/UsCounsellor.html"],
        //    activetab: "Counsellor"
        //})
        //.when("/Counsellor", {
        //    templateUrls: ["templates/OpthaDentalHome.html", "templates/counsellor/UsCounsellor.html"],
        //    activetab: "Counsellor"
        //})

        .when("/Coordinator", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/Coordinator/CoordinatorMain.html"],
            activetab: "Coordinator"
        })
        //.when("/Counsellor", {
        //    templateUrls: ["templates/OpthaDentalHome.html", "templates/counsellor/Counsellor.html"],
        //    activetab: "Counsellor"
        //})
        .when("/IP", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/ip/IP.html"],
            activetab: "ip"
        })


        .when("/casehistory", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/consultation/patient-summary.html"],
            activetab: "op"
        })
        .when("/Pastvisit", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/NewConsultation/NewPastvisit.html"],
            activetab: "op"
        })

        .when("/PastVisitList", {
            templateUrls: ["templates/UsNewConsultation/UsCaseHistory.html"],
            activetab: "op"
        })
        //.when("/NewOpthaConsultation", {
        //    templateUrls: ["templates/OpthaDentalHome.html", "templates/NewConsultation/NewQuickConsultation.html"],
        //    activetab: "op"
        //})
        // newconsulation_version1 and version2
        //.when("/NewOpthaConsultation", {
        //    templateUrls: ["templates/OpthaDentalHome.html", "templates/NewConsultation/NewQuickConsultation.html"],
        //    activetab: "op"
        //})
        .when("/USNewOpthaConsultation", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/NewConsultation/NewQuickConsultationV2.html"],
            activetab: "op"
        })
        .when("/NewOpthaConsultation", {
            templateUrls: ["templates/DoctorWorkUpParent.html"],
            activetab: "op"
        })
        .when("/profile", {
            templateUrls: ["templates/UsNewConsultation/PatientProfilev2.html"],
            activetab: "op"
        })
        .when("/paymentSuccess", {
            templateUrls: ["templates/UsNewConsultation/PaymentSuccess.html"],
            activetab: "op"
        })
        .when("/paymentFailure", {
            templateUrl: ["templates/UsNewConsultation/PaymentFailure.html"],
            activetab: "op"
        })
        .when("/Investigation", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/NewConsultation/investigationsConsultation.html"],
            activetab: "op"
        })
       
        //.when("/PatientProfile", {
        //    templateUrls: ["templates/OpthaDentalHome.html", "templates/NewConsultation/ProfileScreen.html"],
        //    activetab: "op"
        //})




        .when("/OtPastvisit", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/NewConsultation/NewPastvisit.html"],
            activetab: "ot"
        })




       

        //.when("/TempSurgery", {
        //    templateUrls: ["templates/OpthaDentalHome.html", "templates/Ot/TempSurgery.html"],
        //    activetab: "ot"
        //})


        //.when("/SurgeryAdmission", {
        //    templateUrls: ["templates/OpthaDentalHome.html", "templates/Ot/CreateSurgeryAdmission.html"],
        //    activetab: "ot"
        //})
        .when("/AscModule", {
            templateUrls: ["templates/ASC/AscModuleParent.html"],
            activetab: "ot"
        })

        //.when("/SurgeryBilling", {
        //    templateUrls: ["templates/OpthaDentalHome.html", "templates/Ot/SurgeryBilling.html"],
        //    activetab: "ot"
        //})
        //.when("/Counsler", {
        //    templateUrls: ["templates/OpthaDentalHome.html", "templates/Ot/Counsler.html"],
        //    activetab: 'ot'
        //})



        //.when("/Consumables", {
        //    templateUrls: ["templates/OpthaDentalHome.html", "templates/Ot/Consumables.html"]

        //})

        //.when("/OTSurgery", {
        //    templateUrls: ["templates/OpthaDentalHome.html", "templates/Ot/OTSurgery.html"]

        //})
        //.when("/DischargeSummary", {
        //    templateUrls: ["templates/OpthaDentalHome.html", "templates/Ot/DischargeSummary.html"]

        //})
        
       
        .when("/Communication", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/communication/EhnoteCommunication.html"],
            activetab: "ehnotecommunication"
        })
        .when("/Pettycash", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/Accounts/Ehnoteparentpeetycash.html"],
            activetab: "ehnotepettycash"
        })
        .when("/Diagnosis", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/consultation/Diagnosis.html"],
            activetab: 'Diagnosis'
        })
        .when("/labtest", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/consultation/lab/labTest.html"]

        })
        .when("/scantest", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/consultation/scan/scan-main.html"]

        })

        .when("/summary", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/consultation/summary.html"]

        })

        //.when("/summaryresult", {
        //    templateUrls: ["templates/OpthaDentalHome.html", "templates/consultation/consultation-result.html"],
        //    permission: 'SURE1'
        //})


        .when("/patientsearch", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/appointment/patient-app.html"]
        })

        .when("/appointmentedit/:startDate", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/appointment/appointment-edit.html"]

        })

        .when("/appointmentcancel/:getappointmentid", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/appointment/appointment-cancel.html"]

        })

        .when("/adminbranch", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/admin/admin-branch.html"],
            activetab: 'adminbranch'
        })


        .when("/admin", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/admin/admin.html"],
            activetab: "adminScreen"
        })


        .when("/manageusers", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/admin/manage-users.html"],
            activetab: 'adminbranch'
        })


        .when("/profilesettings", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/admin/profile-settings.html"],
            activetab: 'adminbranch'
        })

        .when("/unauthorized", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/admin/unauthorized.html"],
            activetab: 'adminbranch'
        })


        .when("/appointment-book", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/appointment/appointment-book.html"]

        })






        .when("/Referal", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/NewConsultation/Referal.html"],
            activetab: "Referal"
        })




        .when("/Pharmacy", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/Inevntory/Inventory.html"],
            "activetab": "Pharmacy"
        })


        .when("/Inventory", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/HInventory/InventoryParent.html"],
            activetab: "Inventory"
        })



        .when("/Consent", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/UsNewConsultation/ConsentParent.html"],
            activetab: "ConsentScreen"
        })




        .when("/Optical", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/Optical/OpticalParent.html"],
            activetab: "Opticals"
        })




        //Lab Routing
        .when("/LabHome", {

            templateUrls: ["templates/Lab/LabHome.html"]
        })

        .when("/LabDashBoard", {

            templateUrls: ["templates/Lab/LabHome.html", "templates/Lab/DashBoard.html"]
        })

        .when("/LabRegistration", {

            templateUrls: ["templates/Lab/LabHome.html", "templates/Lab/Registration.html"]
        })


        .when("/LabBilling", {

            templateUrls: ["templates/Lab/LabHome.html", "templates/Lab/LabEntryBilling.html"]
        })

        .when("/LabSampleCollection", {

            templateUrls: ["templates/Lab/LabHome.html", "templates/Lab/SampleCollection.html"]
        })

        .when("/LabOperations", {

            templateUrls: ["templates/Lab/LabHome.html", "templates/Lab/Operations.html"]
        })

        .when("/LabSettings", {

            templateUrls: ["templates/Lab/LabHome.html", "templates/Lab/Settings.html"]
        })

        //.when("/NewCaseHistory", {
        //    templateUrls: ["templates/OpthaDentalHome.html", "templates/CaseHistory/NewCaseHistory.html"],
        //    activetab: "op"
        //})

        //.when("/Biller", {
        //    templateUrls: ["templates/OpthaDentalHome.html", "templates/UsNewConsultation/MainBillerParent.html"],
        //    activetab: "Biller"
        //})
        //.when("/newbiller", {
        //    templateUrls: ["templates/UsNewConsultation/PatientProfile.html"],
        //    activetab: "Biller"
        //})
        .when("/Logs", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/Logs/LogsModule.html"],
            activetab: "Logs"
        })

        .when("/mips", {
            templateUrls: ["templates/OpthaDentalHome.html", "templates/mips/mipsParent.html"],
            activetab: "mips"
        })


        //.when("/profile", {
        //    templateUrls: ["templates/UsNewConsultation/PatientProfile.html"],
        //    activetab: "op"
        //})

        .otherwise({
            redirectTo: '/login'
        });
    localStorageServiceProvider
        .setPrefix('eHnoteWeb')
        .setStorageType('localStorage')
        .setNotify(true, true);
}]);

eHnoteWebApp.run(['$rootScope', 'eHnoteLoginStatusService',
function ($rootScope, eHnoteLoginStatusService) {
    // EhnoteOpthaDentalParentCtrl owns the credential lookup (it runs on every reload)
    // and sets telnyxUserAuthAvailable once the cookie is in place.
    $rootScope.$on('$routeChangeSuccess', function () {
        var t = eHnoteLoginStatusService.getTelynxUserLoginDetails();

console.log(t);
console.log("route changes");
        $rootScope.telnyxUserAuthAvailable = !!(t && t.loggedinStatus);
    });
}]);

//eHnoteWebApp.config(['$translateProvider', function ($translateProvider) {
//    $translateProvider.useStaticFilesLoader({
//        prefix: '/js/translations/',
//        suffix: '.json'
//    }).preferredLanguage('en');

//}]);

//These lines don't need to be changed after deployment. 
eHnoteWebApp.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: '/js/translations/',
        suffix: '.json'
    }).preferredLanguage('en');
}]);

eHnoteWebApp.directive("jqdobpicker", [function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            $(function () {
                element.datepicker({
                    dateFormat: 'yy-mm-dd',
                    yearRange: '1900:+0',
                    changeYear: true,
                    maxDate: 0,
                    onSelect: function (date) {
                        ngModelCtrl.$setViewValue(date);
                        scope.$apply();
                    }
                });
            });
        }
    };
}]);
eHnoteWebApp.directive("datepickerappointment", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: 'yy-mm-dd',
                minDate: 0,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);
eHnoteWebApp.directive("mypatientspicker", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: 'dd-MM-yy',
                maxDate: 0,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);
eHnoteWebApp.directive("datepickerapnlus", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "mm-dd-yy",
                minDate: 0,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);

eHnoteWebApp.directive("datepickermondaysdates", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            $(elem).datepicker({
                dateFormat: "mm-dd-yy",
                changeYear: true,
                changeMonth: true,
                minDate: 0,
                beforeShowDay: function (date) {
                    var currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0);
                    date.setHours(0, 0, 0, 0);
                    var day = date.getDay();
                    return [(date.getTime() >= currentDate.getTime() && day === 1), ''];
                }
            });
        }
    };
}]);
eHnoteWebApp.directive("datepickertuesdates", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            $(elem).datepicker({
                dateFormat: "mm-dd-yy",
                changeYear: true,
                changeMonth: true,
                minDate: 0,
                beforeShowDay: function (date) {
                    var currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0);
                    date.setHours(0, 0, 0, 0);
                    var day = date.getDay();
                    return [(date.getTime() >= currentDate.getTime() && day === 2), ''];
                }
            });
        }
    };
}]);
eHnoteWebApp.directive("datepickerwedsdates", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            $(elem).datepicker({
                dateFormat: "mm-dd-yy",
                changeYear: true,
                changeMonth: true,
                minDate: 0,
                beforeShowDay: function (date) {
                    var currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0);
                    date.setHours(0, 0, 0, 0);
                    var day = date.getDay();
                    return [(date.getTime() >= currentDate.getTime() && day === 3), ''];
                }
            });
        }
    };
}]);
eHnoteWebApp.directive("datepickerthursdates", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            $(elem).datepicker({
                dateFormat: "mm-dd-yy",
                changeYear: true,
                changeMonth: true,
                minDate: 0,
                beforeShowDay: function (date) {
                    var currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0);
                    date.setHours(0, 0, 0, 0);
                    var day = date.getDay();
                    return [(date.getTime() >= currentDate.getTime() && day === 4), ''];
                }
            });
        }
    };
}]);
eHnoteWebApp.directive("datepickerfrisdates", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            $(elem).datepicker({
                dateFormat: "mm-dd-yy",
                changeYear: true,
                changeMonth: true,
                minDate: 0,
                beforeShowDay: function (date) {
                    var currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0);
                    date.setHours(0, 0, 0, 0);
                    var day = date.getDay();
                    return [(date.getTime() >= currentDate.getTime() && day === 5), ''];
                }
            });
        }
    };
}]);
eHnoteWebApp.directive("datepickersatsdates", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            $(elem).datepicker({
                dateFormat: "mm-dd-yy",
                changeYear: true,
                changeMonth: true,
                minDate: 0,
                beforeShowDay: function (date) {
                    var currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0);
                    date.setHours(0, 0, 0, 0);
                    var day = date.getDay();
                    return [(date.getTime() >= currentDate.getTime() && day === 6), ''];
                }
            });
        }
    };
}]);



eHnoteWebApp.directive("datepickerapnl", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "dd-M-yy",
                minDate: 0,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);


eHnoteWebApp.directive("datepickerapnlus", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "m-dd-yy",
                minDate: 0,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);

eHnoteWebApp.directive("usdatepickerapnl", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "MM-dd-yy",
                minDate: 0,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);

eHnoteWebApp.directive("toDatepicker", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        "scope": {
            "mindate": "=",
            "maxdate": "=",
            "changeyear": "=",
            "changemonth": "="
        },
        link: function (scope, elem, attrs, ngModelCtrl) {


            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "dd-mm-yy",
                minDate: scope.mindate,
                maxDate: scope.maxdate,
                changeYear: scope.changeyear,
                changeMonth: scope.changemonth,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);



            scope.$watch("mindate", function (newVal, oldvalue) {

                //24-Jan-2020


                newVal = newVal || null;

                if (newVal === null) {
                    return;
                }

                var datearray = newVal.split("-");


                elem.datepicker("destroy");

                options.minDate = new Date(parseInt(datearray[2]), parseInt(datearray[1]) - 1, parseInt(datearray[0]));

                elem.datepicker(options);



            });




        }
    };
}]);
eHnoteWebApp.directive("otDatepicker", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        "scope": {
            "mindate": "=",
            "maxdate": "=",
            "changeyear": "=",
            "changemonth": "="
        },
        link: function (scope, elem, attrs, ngModelCtrl) {


            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "dd-M-yy",
                minDate: scope.mindate,
                maxDate: scope.maxdate,
                changeYear: scope.changeyear,
                changeMonth: scope.changemonth,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);



            scope.$watch("mindate", function (newVal, oldvalue) {

                //24-Jan-2020


                newVal = newVal || null;

                if (newVal === null) {
                    return;
                }

                var datearray = newVal.split("-");


                elem.datepicker("destroy");

                options.minDate = new Date(parseInt(datearray[2]), parseInt(datearray[1]) - 1, parseInt(datearray[0]));

                elem.datepicker(options);



            });




        }
    };
}]);



eHnoteWebApp.directive("customDatepicker", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        "scope": {
            "mindate": "=",
            "maxdate": "=",
            "changeyear": "=",
            "changemonth": "="
        },
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "dd-mm-yy",
                minDate: scope.mindate,
                maxDate: scope.maxdate,
                changeYear: scope.changeyear,
                changeMonth: scope.changemonth,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);



eHnoteWebApp.directive("datepickerforapplist", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "mm-dd-yy", //"M-dd-yy", //"dd-M-yy",
                onSelect: function (dateText) {
                    updateModel(dateText);
                },
                beforeShow: function (input, inst) {
                    setTimeout(function () {
                        inst.dpDiv.on('click', function (e) {
                            e.stopPropagation();
                        });
                    }, 0);
                },
                onClose: function () {
                    $(".ui-datepicker").off("click");
                }
            };
            elem.datepicker(options);
        }
    };
}]);
eHnoteWebApp.directive("datepickerforusformat", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "m-dd-yy",
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);

eHnoteWebApp.directive("clickedDisable", [function () {
    return {
        restrict: "A",
        link: function (scope, ele, attrs) {
            $(ele).click(function () {
                $(ele).attr('disabled', true);
            });
        }
    };
}]);




eHnoteWebApp.directive("datepickerforweekandday", [function (item) {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };

            var options = {
                // dateFormat: "D-M-yy",
                dateFormat: 'DD, dd-MM-yy',
                showWeek: true,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };

            elem.datepicker(options);
        }
    };
}]);

eHnoteWebApp.directive("datepickerforinventoryfulldts", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "dd-mm-yy",
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);

eHnoteWebApp.directive("datepickerforfulldtsinus", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "m-dd-yy",
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);
eHnoteWebApp.directive("datepickerforinventoryfulldtsdash", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "mm-dd-yy",
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);

eHnoteWebApp.directive("toDatepickerdash", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        "scope": {
            "changemonth": "=",
            "mindate": "=",
            "maxdate": "=",
            "changeyear": "=",

        },
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "mm-dd-yy",
                changeMonth: scope.changemonth,
                minDate: scope.mindate,
                maxDate: scope.maxdate,
                changeYear: scope.changeyear,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
            scope.$watch("mindate", function (newVal, oldvalue) {
                newVal = newVal || null;
                if (newVal === null) {
                    return;
                }
                var datearray = newVal.split("-");
                elem.datepicker("destroy");
                options.minDate = new Date(parseInt(datearray[2]), parseInt(datearray[0]) - 1, parseInt(datearray[1]));
                elem.datepicker(options);
            });
        }
    };
}]);
eHnoteWebApp.directive("toDatepickerdash1", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        "scope": {
            "changemonth": "=",
            "mindate": "=",
            "maxdate": "=",
            "changeyear": "=",


        },
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "mm-dd-yy",
                changeMonth: scope.changemonth,
                minDate: scope.mindate,
                maxDate: 0,
                changeYear: true,
                changeMonth: true,
                yearRange: '1900:+0',
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
            scope.$watch("mindate", function (newVal, oldvalue) {
                newVal = newVal || null;
                if (newVal === null) {
                    return;
                }
                var datearray = newVal.split("-");
                elem.datepicker("destroy");
                options.minDate = new Date(parseInt(datearray[2]), parseInt(datearray[0]) - 1, parseInt(datearray[1]));
                elem.datepicker(options);
            });
        }
    };
}]);
eHnoteWebApp.directive("datepickerforcrm", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "yy-mm-dd",
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);
eHnoteWebApp.directive("datepickerforinventory", [function () {
    return {
        "restrict": "A",
        "require": "ngModel",
        "link": function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "dd-mm-yy",
                maxDate: 0,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
            //ngModelCtrl.$viewChangeListeners.push(function () {
            //    scope.$eval(attrs.ngChange);
            //});
        }
    };
}]);


eHnoteWebApp.directive("datepickerforinventoryus", [function () {
    return {
        "restrict": "A",
        "require": "ngModel",
        "link": function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "m-dd-yy",
                maxDate: 0,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
            //ngModelCtrl.$viewChangeListeners.push(function () {
            //    scope.$eval(attrs.ngChange);
            //});
        }
    };
}]);


eHnoteWebApp.directive("datepickerforpastdays", [function () {
    return {
        "restrict": "A",
        "require": "ngModel",
        "link": function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var myDate = new Date();
            var previousDay = new Date(myDate);
            previousDay.setDate(myDate.getDate() - 14);

            var options = {
                dateFormat: "dd-mm-yy",
                minDate: previousDay,
                maxDate: 0,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);

eHnoteWebApp.directive("datepickerformonth", [function () {
    return {
        "restrict": "A",
        "require": "ngModel",
        "link": function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var myDate = new Date();
            var previousDay = new Date(myDate);
            previousDay.setDate(myDate.getDate() - 30);


            var currentdate = new Date(myDate);
            currentdate.setDate(myDate.getDate());

            var options = {
                dateFormat: "dd-mm-yy",
                minDate: previousDay,
                maxDate: currentdate,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);

eHnoteWebApp.directive("datepickerfordashboard", [function () {
    return {
        "restrict": "A",
        "require": "ngModel",
        "link": function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "dd-M-yy",
                maxDate: 0,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
            //ngModelCtrl.$viewChangeListeners.push(function () {
            //    scope.$eval(attrs.ngChange);
            //});
        }
    };
}]);

eHnoteWebApp.directive("datepickerfororder", [function () {
    return {
        "restrict": "A",
        "require": "ngModel",
        "link": function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "dd-mm-yy",
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);

eHnoteWebApp.directive("datepickerforexpiry", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "m/yy",
                onSelect: function (dateText) {
                    updateModel(dateText);
                },
                minDate: 0
            };
            elem.datepicker(options);
            //ngModelCtrl.$viewChangeListeners.push(function () {
            //    scope.$eval(attrs.ngChange);
            //});
        }
    };
}]);

eHnoteWebApp.directive("datepickerforinvoice", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "dd-mm-yy",
                maxDate: 0,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
            ngModelCtrl.$viewChangeListeners.push(function () {
                scope.$eval(attrs.ngChange);
            });
        }
    };
}]);

eHnoteWebApp.directive("datepickerfordeliverydate", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "dd-mm-yy",
                minDate: 0,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
            ngModelCtrl.$viewChangeListeners.push(function () {
                scope.$eval(attrs.ngChange);
            });
        }
    };
}]);

eHnoteWebApp.directive("datepickerapprls", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: 'dd-MM-yy',
                minDate: 0,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);

eHnoteWebApp.directive("datepickerapprlsetreminder", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: 'mm-dd-yy',
                minDate: 0,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);


eHnoteWebApp.directive("pwCanvas", [function () {
    return {
        "restrict": "AE",
        "scope": {
            "options": "=",
            "version": "=",
            "undoclicked": "="
        },
        "link": function postLink(scope, elm) {
            var watchcount = 0;
            var isTouch = !!("ontouchstart" in window);
            var PAINT_START = isTouch ? "touchstart" : "mousedown";
            var PAINT_MOVE = isTouch ? "touchmove" : "mousemove";
            var PAINT_END = isTouch ? "touchend" : "mouseup";
            var options = scope.options;
            options.canvasId = options.customCanvasId || "pwCanvasMain";
            options.tmpCanvasId = options.customCanvasId ? options.canvasId + "Tmp" : "pwCanvasTmp";
            options.width = options.width || 500;
            options.height = options.height || 500;
            options.color = options.color || "#000";
            options.undoEnabled = options.undoEnabled || false;
            options.opacity = options.opacity || 0.9;
            options.lineWidth = options.lineWidth || 1;
            options.undo = options.undo || false;
            //options.imageSrc = 'img/banner1.jpg';
            var canvas = document.createElement("canvas");
            canvas.id = options.canvasId;
            var canvasTmp = document.createElement("canvas");
            canvasTmp.id = options.tmpCanvasId;
            var ctx = canvas.getContext("2d");
            var ctxTmp = canvasTmp.getContext("2d");
            angular.element(canvasTmp).css({ "position": "absolute", "top": 0, "left": "inherit" });
            elm.find("div").append(canvas);
            elm.find("div").append(canvasTmp);
            var point = { "x": 0, "y": 0 };
            var ppts = [];
            canvas.width = canvasTmp.width = options.width;
            canvas.height = canvasTmp.height = options.height;
            ctx.fillStyle = options.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctxTmp.globalAlpha = options.opacity;
            ctxTmp.lineJoin = ctxTmp.lineCap = "round";
            ctxTmp.lineWidth = 5;
            ctxTmp.strokeStyle = options.color;
            if (options.imageSrc) {
                var image = new Image();
                image.onload = function () {
                    scope.version = 0;
                    var canvas = ctx.canvas;
                    var hRatio = canvas.width / image.width;
                    var vRatio = canvas.height / image.height;
                    var ratio = Math.min(hRatio, vRatio);
                    var centerShift_x = (canvas.width - image.width * ratio) / 2;
                    var centerShift_y = (canvas.height - image.height * ratio) / 2;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(image, 0, 0, image.width, image.height, centerShift_x, centerShift_y, image.width * ratio, image.height * ratio);
                };
                image.crossOrigin = "anonymous";
                image.src = options.imageSrc;
                scope.$watch(function () {
                    return options.imageSrc;
                }, function (newVal) {
                    scope.options.imageSrc = newVal;
                });
            }
            scope.$watch("options.imageSrc", function (newVal) {
                if (newVal === undefined || newVal === "" || newVal === null) {
                    return;
                }
                var n = newVal.startsWith("http:");
                if (n) {
                    toDataURL(newVal, function (dataURL) {
                        scope.options.imageSrc = dataURL;
                        var image = new Image();
                        image.onload = function () {
                            var canvas = ctx.canvas;
                            var hRatio = canvas.width / image.width;
                            var vRatio = canvas.height / image.height;
                            var ratio = Math.min(hRatio, vRatio);
                            var centerShift_x = (canvas.width - image.width * ratio) / 2;
                            var centerShift_y = (canvas.height - image.height * ratio) / 2;
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            ctx.drawImage(image, 0, 0, image.width, image.height, centerShift_x, centerShift_y, image.width * ratio, image.height * ratio);
                        };
                        image.crossOrigin = "anonymous";
                        image.src = newVal;
                    });
                } else {
                    scope.options.imageSrc = newVal;
                    var image = new Image();
                    image.onload = function () {
                        var canvas = ctx.canvas;
                        var hRatio = canvas.width / image.width;
                        var vRatio = canvas.height / image.height;
                        var ratio = Math.min(hRatio, vRatio);
                        var centerShift_x = (canvas.width - image.width * ratio) / 2;
                        var centerShift_y = (canvas.height - image.height * ratio) / 2;
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(image, 0, 0, image.width, image.height, centerShift_x, centerShift_y, image.width * ratio, image.height * ratio);
                    };
                    image.crossOrigin = "anonymous";
                    image.src = newVal;
                }
            });
            function toDataURL(url, callback) {
                var xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        callback(reader.result);
                    };
                    reader.readAsDataURL(xhr.response);
                };
                xhr.open("GET", url);
                xhr.responseType = "blob";
                xhr.send();
            }
            if (options.undo) {
                var undoCache = [];
                scope.$watch(function () {
                    return undoCache.length;
                }, function (newVal) {
                    watchcount = 0;
                    //scope.undoclicked = false;
                    scope.version = newVal;
                });
                //scope.$watch("version", function (newVal) {
                //    if (scope.undoclicked) {
                //        watchcount = 0;
                //        scope.undoclicked = false;
                //    }
                //    if (watchcount === 0) {
                //        watchcount = 1;
                //        if (newVal < 0) {
                //            scope.version = 0;
                //            return;
                //        }
                //        if (newVal >= undoCache.length) {
                //            scope.version = undoCache.length;
                //            return;
                //        }
                //        undo(newVal);
                //    }
                //});
                scope.$watch("version", function (newVal) {
                    if (newVal < 0) {
                        scope.version = 0;
                        return;
                    }
                    if (newVal >= undoCache.length) {
                        scope.version = undoCache.length;
                        return;
                    }
                    undo(newVal);
                });
            }
            scope.$watch("options.lineWidth", function (newValue) {
                if (typeof newValue === "string") {
                    newValue = parseInt(newValue, 10);
                }
                if (newValue && typeof newValue === "number") {
                    ctxTmp.lineWidth = options.lineWidth = newValue;
                }
            });
            scope.$watch("options.color", function (newValue) {
                if (newValue) {
                    ctxTmp.strokeStyle = ctxTmp.fillStyle = newValue;
                }
            });
            scope.$watch("options.opacity", function (newValue) {
                if (newValue) {
                    ctxTmp.globalAlpha = newValue;
                }
            });
            var getOffset = function (elem) {
                var bbox = elem.getBoundingClientRect();
                return { left: bbox.left, top: bbox.top };
            };
            var setPointFromEvent = function (point, e) {
                if (isTouch) {
                    point.x = e.changedTouches[0].pageX - getOffset(e.target).left;
                    point.y = e.changedTouches[0].pageY - getOffset(e.target).top;
                } else {
                    var rect = canvas.getBoundingClientRect();
                    var scaleX = canvas.width / rect.width;
                    var scaleY = canvas.height / rect.height;
                    point.x = (e.clientX - rect.left) * scaleX;
                    point.y = (e.clientY - rect.top) * scaleY;
                }
            };
            var paint = function (e) {
                if (e) {
                    e.preventDefault();
                    setPointFromEvent(point, e);
                }
                ppts.push({
                    x: point.x,
                    y: point.y
                });
                if (ppts.length === 3) {
                    var b = ppts[0];
                    ctxTmp.beginPath();
                    ctxTmp.arc(b.x, b.y, ctxTmp.lineWidth / 2, 0, Math.PI * 2, !0);
                    ctxTmp.fill();
                    ctxTmp.closePath();
                    return;
                }
                ctxTmp.clearRect(0, 0, canvasTmp.width, canvasTmp.height);
                ctxTmp.beginPath();
                ctxTmp.moveTo(ppts[0].x, ppts[0].y);
                for (var i = 1; i < ppts.length - 2; i++) {
                    var c = (ppts[i].x + ppts[i + 1].x) / 2;
                    var d = (ppts[i].y + ppts[i + 1].y) / 2;
                    ctxTmp.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
                }
                ctxTmp.quadraticCurveTo(
                    ppts[i].x,
                    ppts[i].y,
                    ppts[i + 1].x,
                    ppts[i + 1].y
                );
                ctxTmp.stroke();
            };
            var copyTmpImage = function () {
                if (options.undo) {
                    scope.$apply(function () {
                        undoCache.push(ctx.getImageData(0, 0, canvasTmp.width, canvasTmp.height));
                        if (angular.isNumber(options.undo) && options.undo > 0) {
                            undoCache = undoCache.slice(-1 * options.undo);
                        }
                    });
                }
                canvasTmp.removeEventListener(PAINT_MOVE, paint, false);
                ctx.drawImage(canvasTmp, 0, 0);
                ctxTmp.clearRect(0, 0, canvasTmp.width, canvasTmp.height);
                ppts = [];
            };
            var startTmpImage = function (e) {
                e.preventDefault();
                canvasTmp.addEventListener(PAINT_MOVE, paint, false);
                setPointFromEvent(point, e);
                ppts.push({
                    "x": point.x,
                    "y": point.y
                });
                ppts.push({
                    "x": point.x,
                    "y": point.y
                });
                paint();
            };
            var initListeners = function () {
                canvasTmp.addEventListener(PAINT_START, startTmpImage, false);
                canvasTmp.addEventListener(PAINT_END, copyTmpImage, false);
                if (!isTouch) {
                    var MOUSE_DOWN;
                    document.body.addEventListener("mousedown", mousedown);
                    document.body.addEventListener("mouseup", mouseup);
                    scope.$on("$destroy", removeEventListeners);
                    canvasTmp.addEventListener("mouseenter", mouseenter);
                    canvasTmp.addEventListener("mouseleave", mouseleave);
                }
                function mousedown() {
                    MOUSE_DOWN = true;
                }
                function mouseup() {
                    MOUSE_DOWN = false;
                }
                function removeEventListeners() {
                    document.body.removeEventListener("mousedown", mousedown);
                    document.body.removeEventListener("mouseup", mouseup);
                }
                function mouseenter(e) {
                    if (MOUSE_DOWN) {
                        startTmpImage(e);
                    }
                }
                function mouseleave(e) {
                    if (MOUSE_DOWN) {
                        copyTmpImage(e);
                    }
                }
            };
            var undo = function (version) {
                if (undoCache.length > 0) {
                    //scope.undoclicked = false;
                    ctx.putImageData(undoCache[version], 0, 0);
                    undoCache = undoCache.slice(0, version);
                }
            };
            initListeners();
        }
    };
}]);

eHnoteWebApp.directive("showHideDirective", [function () {
    return {
        "restrict": "A",
        "scope": {
            "list": "=",
            "show": "=",
            "type": "&"
            //text: "@myText",
            //twoWayBind: "=myTwoWayBind",
            //oneWayBind: "&myOneWayBind"
        },
        "link": function postLink(scope, elm, attr) {
            scope.$watch(function ($scope) {
                if (attr.type === "vitals") {
                    return scope.list.map(function (obj) {
                        return obj.Value;
                    });
                }
                if (attr.type === "NewGlasses" || attr.type === "OldGlasses") {
                    if (scope.list === undefined || scope.list.length === 0) {
                        return false;
                    }
                    var tempaObject = scope.list[0];
                    return Object.keys(tempaObject).map(key => {
                        return scope.list[0][key];
                    });
                }
            }, function (newVal) {
                var ShowCount = 0;

                for (var propt in newVal) {
                    if (propt !== "unique") {

                        if (newVal[propt] !== "" && newVal[propt] !== null) {
                            if (newVal[propt] !== "Distance" && (newVal[propt].indexOf('object:') === -1)) {

                                ShowCount++;
                            }
                        }

                    }
                }
                if (attr.type === "vitals") {
                    if (ShowCount > 0) {
                        scope.show = true;
                    } else {
                        scope.show = false;
                    }
                }
                if (attr.type === "NewGlasses" || attr.type === "OldGlasses") {
                    if (ShowCount > 0) {

                        scope.show = true;
                    } else {

                        scope.show = false;
                    }
                }
            }, true);
        }
    };
}]);

eHnoteWebApp.directive("focusDirective", [function () {
    return {
        "restrict": "A",
        "scope": {
            "focus": "="
        },
        "link": function postLink(scope, elm, attr) {
            scope.$watch(scope.focus, function (newValue, oldValue) {
                if (newValue === undefined) {
                    return;
                }
                if (newValue) {
                    elm.find("input")[0].focus();
                }
            });
        }
    };
}]);

eHnoteWebApp.directive('sortable', function () {
    return {
        restrict: 'A',
        scope: {
            itemList: '=',
            itemIdField: '@',
            onBeforeReorder: '&?'
        },
        link: function (scope, element) {
            const tagName = element.prop("tagName").toLowerCase();
            const isUL = tagName === 'ul';

            const sortableOptions = {
                placeholder: 'sortable-placeholder',
                helper: 'clone',
                scroll: true,
                scrollSensitivity: 60,
                scrollSpeed: 10,
                revert: 150,
                tolerance: 'pointer',
                forcePlaceholderSize: true,
                axis: isUL ? 'x' : 'y',

                helper: function (event, ui) {
                    const clone = ui.clone();
                    clone.addClass('sortable-dragging');
                    return clone;
                },

                start: function (event, ui) {
                    const draggedTag = ui.item.prop("tagName").toLowerCase();

                    if (draggedTag === 'tbody') {
                        ui.item.addClass('sortable-dragging');
                    }

                    if (draggedTag === 'li') {
                        ui.item.closest('ul').addClass('sortable-active');
                    }

                    if (scope.onBeforeReorder) {
                        scope.$apply(() => scope.onBeforeReorder());
                    }
                },

                stop: function (event, ui) {
                    ui.item.removeClass('sortable-dragging');
                    if (ui.item.prop("tagName").toLowerCase() === 'li') {
                        ui.item.closest('ul').removeClass('sortable-active');
                    }
                },
                update: function (event, ui) {
                    // const idField = scope.itemIdField;
                    const reordered = [];
                    const newOrderKeys = element.find('[data-key]').map(function () {
                        return $(this).attr('data-key');
                    }).get();
                    if (!newOrderKeys || newOrderKeys.length === 0) return;
                    const keyMap = scope.itemList.map((item, index) => {
                        return {
                            key: `${index}_${item[scope.itemIdField]}`,
                            item: item
                        };
                    });
                    for (let i = 0; i < newOrderKeys.length; i++) {
                        const key = newOrderKeys[i];
                        const match = keyMap.find(entry => entry.key === key);
                        if (match) reordered.push(match.item);
                    }
                    //const newOrderIds = element.find('[data-id]').map(function () {
                    //    return $(this).attr('data-id');
                    //}).get();

                    //if (!newOrderIds || newOrderIds.length === 0) return;
                    //for (let i = 0; i < newOrderIds.length; i++) {
                    //    const id = newOrderIds[i];
                    //    const match = scope.itemList.find(item => String(item[idField]) === String(id));
                    //    if (match) reordered.push(match);
                    //}
                    scope.$apply(function () {
                        scope.itemList.length = 0;
                        reordered.forEach((it, idx) => {
                            it.SortOrder = idx + 1;
                            scope.itemList.push(it);
                        });
                    });
                }
            };

            if (tagName === 'table') {
                sortableOptions.items = '> tbody';
            } else if (tagName === 'ul') {
                sortableOptions.items = '> li';
            }

            $(element).sortable(sortableOptions);
        }
    };
});


eHnoteWebApp.directive('sortorder', function () {
    return {
        restrict: 'A',
        scope: {
            itemList: '=',
            itemIdField: '@',
            onBeforeReorder: '&?'
        },
        link: function (scope, element) {
            const tagName = element.prop("tagName").toLowerCase();
            const isUL = tagName === 'ul';

            const sortableOptions = {
                placeholder: 'sortable-placeholder',
                helper: function (event, ui) {
                    const clone = ui.clone();
                    clone.addClass('sortable-dragging');
                    clone.css('width', ui.outerWidth());
                    return clone;
                },
                forcePlaceholderSize: true,
                scroll: true,
                scrollSensitivity: 60,
                scrollSpeed: 10,
                revert: 150,
                distance: 5,
                delay: 100,
                tolerance: 'intersect',
                axis: isUL ? 'x' : 'y',

                start: function (event, ui) {
                    const draggedTag = ui.item.prop("tagName").toLowerCase();

                    // Optional smooth collapse effect for placeholder
                    ui.placeholder.height(ui.item.outerHeight());
                    ui.placeholder.css('visibility', 'visible');

                    ui.item.css({
                        transition: 'transform 0.15s ease-in-out',
                    });

                    if (draggedTag === 'tbody') {
                        ui.item.addClass('sortable-dragging');
                    }

                    if (draggedTag === 'li') {
                        ui.item.closest('ul').addClass('sortable-active');
                    }

                    if (scope.onBeforeReorder) {
                        scope.$apply(() => scope.onBeforeReorder());
                    }
                },

                stop: function (event, ui) {
                    ui.item.removeClass('sortable-dragging');
                    ui.item.css('transition', '');
                    if (ui.item.prop("tagName").toLowerCase() === 'li') {
                        ui.item.closest('ul').removeClass('sortable-active');
                    }
                },

                update: function (event, ui) {
                    const idField = scope.itemIdField;
                    const reordered = [];

                    // Detach zero row before processing sort order
                    const $zeroRow = element.children('tr[data-id="0"]');
                    $zeroRow.detach();

                    const newOrderIds = element.children('tr').map(function () {
                        return $(this).attr('data-id');
                    }).get();

                    if (!newOrderIds || newOrderIds.length === 0) return;
                    for (let i = 0; i < newOrderIds.length; i++) {
                        const id = newOrderIds[i];
                        const match = scope.itemList.find(item => String(item[idField]) === String(id));
                        if (match && match[idField] != 0) {
                            reordered.push(match);
                        }
                    }
                    const zeroItem = scope.itemList.find(item => item[idField] == 0);
                    if (zeroItem) reordered.push(zeroItem);

                    scope.$apply(function () {
                        const clonedList = reordered.map(obj => angular.copy(obj));
                        scope.itemList.length = 0;
                        scope.itemList.push(...clonedList);
                    });

                    if ($zeroRow.length) {
                        element.append($zeroRow);
                    }
                }
            };
           
            if (tagName === 'table') {
                sortableOptions.items = '> tbody';
            } else if (tagName === 'ul') {
                sortableOptions.items = '> li';
            }
            if (tagName === 'tbody') {
                sortableOptions.items = '> tr:not([data-id="0"])';
            }
            $(element).sortable(sortableOptions);
        }
    };
});

eHnoteWebApp.directive("fileInput", ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var model = $parse(attrs.fileInput);

            element.bind("change", function (event) {
                scope.$apply(function () {

                    var files = Array.from(event.target.files);
                    console.log("Directive updated:", files);

                    model.assign(scope, files);   // store the file

                    // 🔥 Trigger import immediately
                    if (files.length > 0) {
                        scope.importExcel(files[0]);
                    }

                });
            });
        }
    };
}]);



eHnoteWebApp.constant("msdElasticConfig", {
    append: ""
});

eHnoteWebApp.directive('msdElastic', ['$timeout', '$window', 'msdElasticConfig', function ($timeout, $window, config) {
    'use strict';
    return {
        require: 'ngModel',
        restrict: 'A, C',
        link: function (scope, element, attrs, ngModel) {

            var ta = element[0],
                $ta = element;

            if (ta.nodeName !== 'TEXTAREA' || !$window.getComputedStyle) return;

            // Set initial styles to avoid scrollbars
            $ta.css({
                'overflow': 'hidden',
                'overflow-y': 'hidden',
                'word-wrap': 'break-word',
                'min-height': '40px'
            });

            // Trigger reflow
            var text = ta.value || '';
            ta.value = '';
            ta.value = text;

            var append = attrs.msdElastic ? attrs.msdElastic.replace(/\\n/g, '\n') : config.append,
                $win = angular.element($window),

                mirrorInitStyle = 'position: absolute; top: -999px; right: auto; bottom: auto;' +
                    'left: 0; overflow: hidden; -webkit-box-sizing: content-box;' +
                    '-moz-box-sizing: content-box; box-sizing: content-box;' +
                    'min-height: 0 !important; height: 0 !important; padding: 0;' +
                    'word-wrap: break-word; border: 0;',

                $mirror = angular.element('<textarea aria-hidden="true" tabindex="-1" ' +
                    'style="' + mirrorInitStyle + '"/>').data('elastic', true),
                mirror = $mirror[0],
                taStyle = getComputedStyle(ta),
                resize = taStyle.getPropertyValue('resize'),
                borderBox = taStyle.getPropertyValue('box-sizing') === 'border-box' ||
                    taStyle.getPropertyValue('-moz-box-sizing') === 'border-box' ||
                    taStyle.getPropertyValue('-webkit-box-sizing') === 'border-box',
                boxOuter = !borderBox ? { width: 0, height: 0 } : {
                    width: parseInt(taStyle.getPropertyValue('border-right-width'), 10) +
                        parseInt(taStyle.getPropertyValue('padding-right'), 10) +
                        parseInt(taStyle.getPropertyValue('padding-left'), 10) +
                        parseInt(taStyle.getPropertyValue('border-left-width'), 10),
                    height: parseInt(taStyle.getPropertyValue('border-top-width'), 10) +
                        parseInt(taStyle.getPropertyValue('padding-top'), 10) +
                        parseInt(taStyle.getPropertyValue('padding-bottom'), 10) +
                        parseInt(taStyle.getPropertyValue('border-bottom-width'), 10)
                },
                minHeightValue = parseInt(taStyle.getPropertyValue('min-height'), 10),
                heightValue = parseInt(taStyle.getPropertyValue('height'), 10),
                minHeight = Math.max(minHeightValue, heightValue) - boxOuter.height,
                maxHeight = parseInt(taStyle.getPropertyValue('max-height'), 10),
                mirrored,
                active,
                copyStyle = [
                    'font-family',
                    'font-size',
                    'font-weight',
                    'font-style',
                    'letter-spacing',
                    'line-height',
                    'text-transform',
                    'word-spacing',
                    'text-indent'
                ];

            if ($ta.data('elastic')) return;

            maxHeight = maxHeight && maxHeight > 0 ? maxHeight : 90000;

            if (mirror.parentNode !== document.body) {
                angular.element(document.body).append(mirror);
            }

            $ta.css({
                'resize': (resize === 'none' || resize === 'vertical') ? 'none' : 'horizontal'
            }).data('elastic', true);

            function initMirror() {
                var mirrorStyle = mirrorInitStyle;
                mirrored = ta;
                taStyle = getComputedStyle(ta);

                angular.forEach(copyStyle, function (val) {
                    mirrorStyle += val + ':' + taStyle.getPropertyValue(val) + ';';
                });

                mirror.setAttribute('style', mirrorStyle);
            }

            function adjust() {
                var taHeight,
                    taComputedStyleWidth,
                    mirrorHeight,
                    width,
                    overflow;

                if (mirrored !== ta) {
                    initMirror();
                }

                if (!active) {
                    active = true;

                    mirror.value = ta.value + append;
                    mirror.style.overflowY = ta.style.overflowY;

                    taHeight = ta.style.height === '' ? 'auto' : parseInt(ta.style.height, 10);
                    taComputedStyleWidth = getComputedStyle(ta).getPropertyValue('width');

                    if (taComputedStyleWidth.endsWith('px')) {
                        width = parseInt(taComputedStyleWidth, 10) - boxOuter.width;
                        mirror.style.width = width + 'px';
                    }

                    mirrorHeight = mirror.scrollHeight;

                    if (mirrorHeight > maxHeight) {
                        mirrorHeight = maxHeight;
                        overflow = 'scroll';
                    } else if (mirrorHeight < minHeight) {
                        mirrorHeight = minHeight;
                    }
                    mirrorHeight += boxOuter.height;

                    ta.style.overflowY = overflow || 'hidden';

                    if (taHeight !== mirrorHeight) {
                        scope.$emit('elastic:resize', $ta, taHeight, mirrorHeight);
                        ta.style.height = mirrorHeight + 'px';
                    }

                    $timeout(() => active = false, 1, false);
                }
            }

            function forceAdjust() {
                active = false;
                adjust();
            }
            initMirror();
            $timeout(forceAdjust, 0, false);

            // Setup watchers and listeners
            if ('onpropertychange' in ta && 'oninput' in ta) {
                ta['oninput'] = ta.onkeyup = adjust; // IE9
            } else {
                ta['oninput'] = adjust;
            }

            $win.bind('resize', forceAdjust);

            scope.$watch(() => ngModel.$modelValue, forceAdjust);
            scope.$watch(() => element.is(':visible'), forceAdjust);

            scope.$on('elastic:adjust', () => {
                initMirror();
                forceAdjust();
            });

            scope.$on('$destroy', function () {
                $mirror.remove();
                $win.unbind('resize', forceAdjust);
            });
        }
    };
}]);

eHnoteWebApp.directive("pwColorSelector", [function () {
    return {
        restrict: 'AE',
        scope: {
            colorList: '=pwColorSelector',
            selectedColor: '=color'
        },
        templateUrl: 'templates/consultation/notes/color-selector.html',
        link: function (scope) {
            scope.setColor = function (col) {
                scope.selectedColor = col;
            };
        }
    };
}]);
eHnoteWebApp.directive("pwLineSelector", [function () {
    return {
        link: function (scope) {
            scope.setline = function (col) {
                var canvas = document.createElement("canvas");
                var canvasTmp = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                var ctxTmp = canvasTmp.getContext("2d");
                ctxTmp.lineWidth = col;
                scope.selectedLineWidth = col;



            };
        }
    };
}]);
eHnoteWebApp.directive("datepickerappreschedule", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: 'dd-MM-yy',
                minDate: 1,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);
eHnoteWebApp.directive("jqdatepicker", [function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            $(function () {
                element.datepicker({
                    dateFormat: 'dd/mm/yy',
                    onSelect: function (date) {
                        ngModelCtrl.$setViewValue(date);
                        scope.$apply();
                    }
                });
            });
        }
    };
}]);
eHnoteWebApp.directive("ngIncludeTemplate", [function () {
    return {
        templateUrl: function (elem, attrs) {
            return attrs.ngIncludeTemplate;
        },
        restrict: 'A',
        scope: {
            'ngIncludeVariables': '&'
        },
        link: function (scope, elem, attrs) {
            var vars = scope.ngIncludeVariables();
            Object.keys(vars).forEach(function (key) {
                scope[key] = vars[key];
            });
        }
    };
}]);
eHnoteWebApp.directive("toggle", [function () {
    return function (scope, elem, attrs) {
        scope.$on('event:toggle', function (ev, num) {
            if (num === attrs.toggle) {
                elem.slideToggle();
            }
        });
    };
}]);
eHnoteWebApp.directive("numbersOnly", [function () {
    return {
        "require": "ngModel",
        "link": function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) {
                    return "";
                }
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);
eHnoteWebApp.directive("expDate", [function () {
    return {
        "require": "ngModel",
        "link": function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) {
                    return "";
                }
                var transformedInput = inputValue.replace(/[^0-9/]/g, '');
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);
eHnoteWebApp.directive("quotesRestrict", [function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return "";
                var transformedInput = inputValue.replace(/['"]*/g, '');
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);
eHnoteWebApp.directive("cardName", [function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return '';
                var transformedInput = inputValue.replace(/[^a-zA-Z ]/g, '');
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);
eHnoteWebApp.directive("numbersSlashOnly", [function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return '';
                var transformedInput = inputValue.replace(/[^0-9\.+-/]/g, '');
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);
eHnoteWebApp.directive("noSpecialChar", [function () {
    return {
        require: "ngModel",
        restrict: 'A',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === null) {
                    return "";
                }
                var cleanInputValue = inputValue.replace(/[^\w\s]/gi, '');
                if (cleanInputValue !== inputValue) {
                    modelCtrl.$setViewValue(cleanInputValue);
                    modelCtrl.$render();
                }
                return cleanInputValue;
            });
        }
    };
}]);
eHnoteWebApp.directive("glassAllow", [function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return '';
                var transformedInput = inputValue.replace(/[^0-9\.+-/a-zA-Z]/g, '');
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);
eHnoteWebApp.directive("acceptanceAllow", [function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return '';
                var transformedInput = inputValue.replace(/[^0-9.+-]/g, '');
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);
eHnoteWebApp.directive("discountRange", [function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return '';
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                var newValue = transformedInput;
                if (transformedInput !== inputValue) {
                    newValue = transformedInput;
                }
                if (parseInt(transformedInput) < 0 || transformedInput === "00") {
                    newValue = "0";
                }
                else if (parseInt(transformedInput) > 100) {
                    newValue = transformedInput.slice(0, -1);
                }
                else if (transformedInput.indexOf("0") === 0 && transformedInput.length > 1) {
                    newValue = transformedInput.substr(1);
                }
                modelCtrl.$setViewValue(newValue);
                modelCtrl.$render();
                return newValue;
            });
        }
    };
}]);
eHnoteWebApp.filter("wordwraptext", [function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';
        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;
        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace !== -1) {
                value = value.substr(0, lastspace);
            }
        }
        return value + (tail || ' ?');
    };
}]);
eHnoteWebApp.filter('nl2br', ['$sce', function ($sce) {
    return function (text) {
        if (!text) return ''; 
        return $sce.trustAsHtml(text.replace(/\n/g, '<br>'));
    };
}]);
eHnoteWebApp.directive("numbersdotsplusminusOnly", [function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return '';
                var transformedInput = inputValue.replace(/[^0-9\.+-]/g, '');
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);

eHnoteWebApp.directive("usnumbersdotsplusminusOnly", [function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return '';

                // Only allow a single optional + or - at the start, followed by numbers and optional one dot
                var transformedInput = inputValue.replace(/[^0-9.\-+]/g, '');
                // Now validate format using regex
                var match = transformedInput.match(/^[-+]?\d*\.?\d*$/);
                if (match) {
                    return transformedInput;
                } else {
                    // If invalid, revert the last entry
                    modelCtrl.$setViewValue(modelCtrl.$modelValue || '');
                    modelCtrl.$render();
                    return modelCtrl.$modelValue || '';
                }
            });
        }
    };
}]);



eHnoteWebApp.directive("numbersdotsOnly", [function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return '';
                var transformedInput = inputValue.replace(/[^0-9\.]/g, '');
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);
eHnoteWebApp.directive("numbersOnlyTemp", [function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return '';
                var transformedInput = inputValue.replace(/[^0-9\.]/g, '');
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                var intInput = parseInt(transformedInput);
                if ((intInput < 90 || intInput > 108 || parseFloat(transformedInput) > 108 || inputValue === "108.") && (intInput > 10 || (intInput > 1 && intInput < 9))) {
                    transformedInput = transformedInput.slice(0, -1);
                    if (parseFloat(transformedInput) > 108 || inputValue === "108.") {
                        transformedInput = intInput + "";
                    }
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);
eHnoteWebApp.directive("awLimitLength", [function () {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            attrs.$set("ngTrim", "false");
            var limitLength = parseInt(attrs.awLimitLength, 10);
            scope.$watch(attrs.ngModel, function (newValue) {
                if (ngModel.$viewValue) {
                    if (ngModel.$viewValue.length > limitLength) {
                        ngModel.$setViewValue(ngModel.$viewValue.substring(0, limitLength));
                        ngModel.$render();
                    }
                }
            });
        }
    };
}]);


eHnoteWebApp.directive("toggleSwitch", [function () {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {


            scope.$watch(attrs.ngModel, function (newValue) {

                if (ngModel.$viewValue && attrs.value) {
                    attrs.$set("checked", "checked");
                } else {

                    element.removeAttr("checked");
                }
            });
        }
    };
}]);

eHnoteWebApp.directive("datepickeruniversaldatewithmax", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        scope: {
            mindate: "=",
            maxdate: "="
        },
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };

            var currentDate = new Date();

            scope.$watchGroup(["mindate", "maxdate"], function (newValues) {
                var minDate = newValues[0] || null;
                var maxDate = newValues[1] || null;
                elem.datepicker("option", {
                    minDate: minDate,
                    maxDate: maxDate
                });
            });

            var options = {
                dateFormat: "mm-dd-yy",
                changeYear: true,
                changeMonth: true,
                yearRange: "-25:+25",
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };

            elem.datepicker(options);
        }
    };
}]);


eHnoteWebApp.directive("focusMe", ["$timeout", "$parse", function ($timeout, $parse) {
    return {
        link: function (scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function (value) {
                if (value) {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
        }
    };
}]);

eHnoteWebApp.directive('customAutofocus', function () {
    return {
        restrict: 'A',

        link: function (scope, element, attrs) {
            scope.$watch(function () {
                return scope.$eval(attrs.customAutofocus);
            }, function (newValue) {
                if (newValue === true) {
                    element[0].focus();//use focus function instead of autofocus attribute to avoid cross browser problem. And autofocus should only be used to mark an element to be focused when page loads.
                }
            });
        }
    };
});
eHnoteWebApp.directive('autoFocusItems', function ($timeout) {
    return {
        restrict: 'A',
        scope: {
            items: '=',
            onSelect: '&'
        },
        link: function (scope, element) {
            scope.activeIndex = 0;

            function updateActiveClass() {
                var children = element[0].querySelectorAll('li');
                angular.element(children).removeClass('active-item');
                if (children[scope.activeIndex]) {
                    angular.element(children[scope.activeIndex]).addClass('active-item');
                    children[scope.activeIndex].scrollIntoView({ block: 'nearest' });
                }
            }

            function focusContainer() {
                $timeout(function () {
                    element.attr('tabindex', 0);
                    element[0].focus();
                }, 0);
            }
            scope.$watch('items', function (val) {
                if (val && val.length) {
                    scope.activeIndex = 0;
                    $timeout(updateActiveClass, 0);
                    focusContainer();
                }
            });

            var $dropdown = angular.element(element).closest('.dropdown');
            if ($dropdown && $dropdown.on) {
                $dropdown.on('shown.bs.dropdown', function () {
                    focusContainer();
                    $timeout(updateActiveClass, 0);
                });
                scope.$on('$destroy', function () {
                    $dropdown.off('shown.bs.dropdown');
                });
            }

            element.on('keydown', function (event) {
                scope.$apply(function () {
                    var len = (scope.items && scope.items.length) || 0;
                    if (!len) return;

                    switch (event.key) {
                        case 'ArrowDown':
                            if (scope.activeIndex < len - 1) scope.activeIndex++;
                            updateActiveClass(); event.preventDefault(); break;
                        case 'ArrowUp':
                            if (scope.activeIndex > 0) scope.activeIndex--;
                            updateActiveClass(); event.preventDefault(); break;
                        case 'Enter':
                            var selected = scope.items[scope.activeIndex];
                            if (selected) scope.onSelect({ item: selected, index: scope.activeIndex });
                            event.preventDefault(); break;
                    }
                });
            });

            element.on('mousemove', function (evt) {
                var li = evt.target && evt.target.closest ? evt.target.closest('li') : null;
                if (!li) return;
                var nodes = element[0].querySelectorAll('li');
                var idx = Array.prototype.indexOf.call(nodes, li);
                if (idx !== -1 && idx !== scope.activeIndex) {
                    scope.$apply(function () {
                        scope.activeIndex = idx;
                        updateActiveClass();
                    });
                }
            });

            scope.$on('$destroy', function () {
                element.off('keydown');
                element.off('mousemove');
            });
        }
    };
});




eHnoteWebApp.directive("jqdatepicker", [function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            $(function () {
                element.datepicker({
                    dateFormat: 'dd-mm-yy',
                    onSelect: function (date) {
                        ngModelCtrl.$setViewValue(date);
                        scope.$apply();
                    }
                });
            });
        }
    };
}]);
eHnoteWebApp.directive("datepickerminmaxdate", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        scope: { mindate: '@' },
        link: function (scope, elem, attrs, ngModelCtrl) {
            var max = ""; var min = new Date();
            scope.$watch('mindate', function (val) {
                if (val) {
                    min = new Date(val);
                    elem.datepicker('option', 'minDate', min);
                    max = new Date(new Date(new Date(val).getTime() + 15 * 1000 * 3600 * 24));
                    elem.datepicker('option', 'maxDate', max);
                }
            }, true);
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: 'dd-MM-yy',
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);
eHnoteWebApp.directive("glassacceptanceAllow", [function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return '';
                var transformedInput = inputValue.replace(/[^a-zA-Z0-9+./ /-]/g, "");
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);
eHnoteWebApp.directive("dateFormatInput", ['$filter', function ($filter) {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, ngModelCtrl) {
            ngModelCtrl.$formatters.push(function (value) {
                // Format the date value for display
                return $filter('date')(value, 'MM-dd-yyyy');
            });
            // This is necessary to handle changes from the view to the model
            ngModelCtrl.$parsers.push(function (value) {
                // Return the value unchanged (in "YYYY-MM-DD" format)
                return value;
            });
        }
    };
}]);
eHnoteWebApp.filter("dateFilter", [function () {
    return function (item) {
        if (item !== null) {
            return new Date(parseInt(item));
        }
        return "";
    };
}]);

eHnoteWebApp.filter("InvFilter", ["$filter", function ($filter) {
    return function (items) {
        return $filter("filter")(items, function (iterator) {
            return iterator.CategoryId !== 1 && iterator.CategoryId !== 2 && iterator.CategoryId !== 3 && iterator.CategoryId !== 4 && iterator.CategoryId !== 5 && iterator.CategoryId !== 6 && iterator.CategoryId !== 7;
        }, true);
    };
}]);
eHnoteWebApp.filter("GetAvialbleBarCodes", ["$filter", function ($filter) {
    return function (BarCodesArray, Type) {



        if (Type === "Purchase" || Type === "Sale") {
            return $filter("filter")(BarCodesArray, function (iterator) {
                return iterator.SaleId === null && iterator.PurchaseReturnId === null && iterator.TransferId === null;
            }, true);
        }
        if (Type === "Transfer") {
            return BarCodesArray;
        }







    };
}]);






eHnoteWebApp.filter("ConcatTeethIds", ["$filter", function ($filter) {
    return function (teetharray) {
        var TeethName = "", IndexArray = [];
        teetharray = _.pluck(teetharray, "value");
        teetharray = _.sortBy(teetharray, function (num) { return num; });


        if (teetharray.length > 1) {
            //Checking Right Upper Adult
            IndexArray = [];
            for (var i = 0; i < teetharray.length; i++) {
                if (teetharray[i] >= 21 && teetharray[i] <= 28) {
                    IndexArray.push(i);
                }
            }
            if (IndexArray.length === 8) {
                teetharray = $filter("filter")(teetharray, function (iterator, ind) {
                    if (!(iterator >= 21 && iterator <= 28)) {
                        return iterator;
                    }
                }) || [];
                TeethName += TeethName === "" ? "Right Upper(Adult)" : ",Right Upper(Adult)";
            }




            //Checking  Left Upper Adult
            IndexArray = [];
            for (var i = 0; i < teetharray.length; i++) {
                if (teetharray[i] >= 11 && teetharray[i] <= 18) {
                    IndexArray.push(i);
                }
            }
            if (IndexArray.length === 8) {
                teetharray = $filter("filter")(teetharray, function (iterator, ind) {
                    if (!(iterator >= 11 && iterator <= 18)) {
                        return iterator;
                    }
                }) || [];
                TeethName += TeethName === "" ? "Left Upper(Adult)" : ",Left Upper(Adult)";
            }




            //Checking  Right Lower Adult
            IndexArray = [];
            for (var i = 0; i < teetharray.length; i++) {
                if (teetharray[i] >= 31 && teetharray[i] <= 38) {
                    IndexArray.push(i);
                }
            }
            if (IndexArray.length === 8) {
                teetharray = $filter("filter")(teetharray, function (iterator, ind) {
                    if (!(iterator >= 31 && iterator <= 38)) {
                        return iterator;
                    }
                }) || [];
                TeethName += TeethName === "" ? "Right Lower(Adult)" : ",Right Lower(Adult)";
            }




            //Checking  Left Lower Adult
            IndexArray = [];
            for (var i = 0; i < teetharray.length; i++) {
                if (teetharray[i] >= 41 && teetharray[i] <= 48) {
                    IndexArray.push(i);
                }
            }
            if (IndexArray.length === 8) {
                teetharray = $filter("filter")(teetharray, function (iterator, ind) {
                    if (!(iterator >= 41 && iterator <= 48)) {
                        return iterator;
                    }
                }) || [];
                TeethName += TeethName === "" ? "Left Lower(Adult)" : ",Left Lower(Adult)";
            }




            //Checking  Right Upper Child
            IndexArray = [];
            for (var i = 0; i < teetharray.length; i++) {
                if (teetharray[i] >= 61 && teetharray[i] <= 65) {
                    IndexArray.push(i);
                }
            }
            if (IndexArray.length === 5) {
                teetharray = $filter("filter")(teetharray, function (iterator, ind) {
                    if (!(iterator >= 61 && iterator <= 65)) {
                        return iterator;
                    }
                }) || [];
                TeethName += TeethName === "" ? "Right Upper(Child)" : ",Right Upper(Child)";
            }



            //Checking  Left Upper Child
            IndexArray = [];
            for (var i = 0; i < teetharray.length; i++) {
                if (teetharray[i] >= 51 && teetharray[i] <= 55) {
                    IndexArray.push(i);
                }
            }
            if (IndexArray.length === 5) {
                teetharray = $filter("filter")(teetharray, function (iterator, ind) {
                    if (!(iterator >= 51 && iterator <= 55)) {
                        return iterator;
                    }
                }) || [];
                TeethName += TeethName === "" ? "Left Upper(Child)" : ",Left Upper(Child)";
            }



            //Checking  Right Lower Child
            IndexArray = [];
            for (var i = 0; i < teetharray.length; i++) {
                if (teetharray[i] >= 71 && teetharray[i] <= 75) {
                    IndexArray.push(i);
                }
            }
            if (IndexArray.length === 5) {
                teetharray = $filter("filter")(teetharray, function (iterator, ind) {
                    if (!(iterator >= 71 && iterator <= 75)) {
                        return iterator;
                    }
                }) || [];
                TeethName += TeethName === "" ? "Right Lower(Child)" : ",Right Lower(Child)";
            }


            //Checking  Left Lower Child
            IndexArray = [];
            for (var i = 0; i < teetharray.length; i++) {
                if (teetharray[i] >= 81 && teetharray[i] <= 85) {
                    IndexArray.push(i);
                }
            }
            if (IndexArray.length === 5) {
                teetharray = $filter("filter")(teetharray, function (iterator, ind) {
                    if (!(iterator >= 81 && iterator <= 85)) {
                        return iterator;
                    }
                }) || [];
                TeethName += TeethName === "" ? "Left Lower(Child)" : ",Left Lower(Child)";
            }
            if (teetharray.length > 0) {
                TeethName = teetharray.join(",") + (TeethName !== "" ? "," + TeethName : "");
            }
        } else {
            TeethName += teetharray.join(",");
        }
        return TeethName;
    };
}]);






eHnoteWebApp.filter("IsReturnQuantityExist", ["$filter", function ($filter) {
    return function (stockdetailsarray, type) {
        var Tempstockdetailsarray = angular.copy(stockdetailsarray);
        var ReturnQuantityCount = 0, ExcessRetrunQuantityCount = 0;
        angular.forEach(Tempstockdetailsarray, function (item, index) {
            item.ReturnQuantity = parseFloat(item.ReturnQuantity) || 0;
            if (item.ReturnQuantity > 0) {
                ReturnQuantityCount++;
            }
            if (type === "Pharmacy" && item.ReturnQuantity > item.AvailableQuantity) {
                ExcessRetrunQuantityCount++;
            }
            if (type === "Opticals" && item.ReturnQuantity > (item.Quantity - item.SaleQuantityReturned)) {
                ExcessRetrunQuantityCount++;
            }
        });
        if (ReturnQuantityCount > 0 && ExcessRetrunQuantityCount === 0) {
            return true;
        } else {
            return false;
        }
    };
}]);






eHnoteWebApp.filter("dateFormatter", ["$filter", function ($filter) {
    return function (input, seperator) {
        input = input || null;
        if (input !== null) {
            var dateParts = input.split(seperator);
            return $filter("date")(new Date(dateParts[2], dateParts[1] - 1, dateParts[0]), "yyyy-MM-dd");
        }
        return null;
    };
}]);



eHnoteWebApp.filter("usdateFormatter", ["$filter", function ($filter) {
    return function (input, seperator) {
        input = input || null;
        if (input !== null) {
            var dateParts = input.split(seperator);
            return $filter("date")(new Date(dateParts[2], dateParts[0] - 1, dateParts[1]), "yyyy-MM-dd");
        }
        return null;
    };
}]);

eHnoteWebApp.directive("scrollToItem", [function () {
    return {
        restrict: 'A',
        scope: {
            scrollTo: "@"
        },
        link: function (scope, $elm, attr) {
            $elm.on('click', function () {
                $('html,body').animate({ scrollTop: $(scope.scrollTo).offset().top }, "slow");
            });
        }
    };
}]);


eHnoteWebApp.directive("whenScrolled", function () {
    return {

        restrict: 'A',
        link: function (scope, elem, attrs) {
            var raw = elem[0];
            console.log(raw.offsetHeight);
            console.log(raw.scrollHeight);

            elem.bind("scroll", function () {
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                    // scope.loading = true;
                    scope.$apply(attrs.whenScrolled);
                }
            });
        }
    }
});
//eHnoteWebApp.factory("httpInterceptor", ["$q", "$rootScope", "localStorageFactory", function ($q, $rootScope, localStorageFactory) {
//    return {
//        // optional method
//        "request": function (config) {
//            config.headers = config.headers || {};
//            $rootScope.$broadcast("loader_show");
//            if (!(config.url.includes("ValidateUserLogin"))) {
//                var abc = "Bearer " + localStorageFactory.getItemString('JWTToken');
//                config.headers.Authorization = abc.replace(/"/g, '');
//            }
//            return config;
//        },
//        // optional method
//        "requestError": function (rejection) {
//            // do something on error
//            $rootScope.$broadcast("loader_hide");
//            if (canRecover(rejection)) {
//                return responseOrNewPromise;
//            }

//            return $q.reject(rejection);
//        },
//        // optional method
//        "response": function (response) {
//            // do something on success
//            $rootScope.$broadcast("loader_hide");
//            return response;
//        },
//        // optional method
//        "responseError": function (rejection) {
//            if (rejection.status === 450) {                
//                localStorageFactory.set("JWTToken", "");
//                //toastr.info("Session timed out");
//                $injector.get("$state").transitionTo("Login");
//            }
//            return $q.reject(rejection);
//        }
//    };
//}]);

//Spell checker start
/*eHnoteWebApp.factory('SpellcheckService', function ($http, $q) {
    let typoInstance = null;

    function loadTypo() {
        const affReq = $http.get('typo/en_US.aff', { responseType: 'text' });
        const dicReq = $http.get('typo/en_US.dic', { responseType: 'text' });

        return $q.all([affReq, dicReq]).then(function (responses) {
            const affData = responses[0].data;
            const dicData = responses[1].data;
            typoInstance = new Typo("en_US", affData, dicData);
            return typoInstance;
        });
    }

    return {
        getTypo: function () {
            return typoInstance ? $q.resolve(typoInstance) : loadTypo();
        }
    };
});*/
//Spell checker end

eHnoteWebApp.factory('httpInterceptor', ["$q", "$rootScope", "localStorageFactory", "datapersistanceFactory", "$location", "alertify", "$injector", "$window", "eHnoteLoginStatusService", function ($q, $rootScope, localStorageFactory, datapersistanceFactory, $location, alertify, $injector, $window, eHnoteLoginStatusService) {
var numLoadings = 0;
var isRefreshingToken = false;
var refreshTokenPromise = null;
var failedQueue = [];
function retryFailedRequests(newToken) {
    failedQueue.forEach(function (req) {
        let BearerToken = 'Bearer ' + newToken;
        req.config.headers.Authorization = BearerToken.replace(/"/g, '');
        $injector.get('$http')(req.config).then(req.resolve, req.reject);
    });
    failedQueue = [];
};
return {
    "request": function (config) {

        if (!navigator.onLine) {
            alertify.log("check your internet connectivity");
            return;
        }
        var IsBlobUrl = false;
        if (config.url.indexOf("ehnotedevstorage.blob.core.windows.net") > -1) { IsBlobUrl = true; }

        var Bearer = "";
        if (config.data !== undefined) {
            if (config.data.loaderStatus === undefined) {
                numLoadings++;
                if (!config.skipLoader) {
                    $rootScope.$broadcast("loader_show");
                }
                //if (!(config.url.includes("ValidateUserLogin"))) {
                datapersistanceFactory.set("USerLoginTime", new Date());
                Bearer = "Bearer " + datapersistanceFactory.getItemString('JWTToken');
                if (!IsBlobUrl) {//if it is not blob url add Authorization header
                    config.headers.Authorization = Bearer.replace(/"/g, '');
                }

                //}
               // config.data = { payload: EncryptionService.encryptData(config.data) }
                return config || $q.when(config);

            } else {
                numLoadings++;
                //if (!(config.url.includes("ValidateUserLogin"))) {
                datapersistanceFactory.set("USerLoginTime", new Date());
                Bearer = "Bearer " + datapersistanceFactory.getItemString('JWTToken');
                if (!IsBlobUrl) {//if it is not blob url add Authorization header
                    config.headers.Authorization = Bearer.replace(/"/g, '');
                }
                //}
                return config || $q.when(config);
            }
        } else {
            numLoadings++;
            $rootScope.$broadcast("loader_show");
            //if (!(config.url.includes("ValidateUserLogin"))) {
            datapersistanceFactory.set("USerLoginTime", new Date());
            Bearer = "Bearer " + datapersistanceFactory.getItemString('JWTToken');
            if (!IsBlobUrl) {//if it is not blob url add Authorization header
                config.headers.Authorization = Bearer.replace(/"/g, '');
            }
            //}
            return config || $q.when(config);
        }
    },
    "response": function (response) {
        if ((--numLoadings) === 0) {
            $rootScope.$broadcast("loader_hide");
        }
        return response || $q.when(response);
    },
    "responseError": function (response) {
          if (!(--numLoadings)) {
              $rootScope.$broadcast("loader_hide");
          }

        if (response.status === 500 && (response.data.Status === 4 || response.data.Message?.includes("Lifetime validation failed"))) {
                    /* datapersistanceFactory.set("JWTToken", "");*/
                    let userRefreshTokenObj = datapersistanceFactory.getItem('userRefreshTokenObj') || {};
                    var refreshTokenObj = {
                        "RefreshToken": "",
                        "FirstName": userRefreshTokenObj.FirstName||"",
                        "DoctorId": userRefreshTokenObj.DoctorId||0,
                        "RoleId": userRefreshTokenObj.RoleId||0,
                        "DeviceType": "49EBEEB3"
                    }
             // refreshTokenObj.RefreshToken = sessionStorage.getItem('RefreshToken');
             // refreshTokenObj.RefreshToken = localStorage.getItem('RefreshToken');
            refreshTokenObj.RefreshToken = datapersistanceFactory.getItem('RefreshToken');

                    //refreshTokenObj.refreshToken = datapersistanceFactory.getItem('RefreshToken');
                    if (!refreshTokenObj.RefreshToken) {
                        if ($window.location.host == "ioj.ehnote.com") {
                            $window.location.href = "https://portal.ehnote.com/#/login";
                        } else if ($window.location.host == 'insts.ehnote.com') {
                            $window.location.href = "https://stage.ehnote.com/#/login";
                        } else {
                            $location.path("/login");
                        }
                        return $q.reject(response);
                    }
                    var deferred = $q.defer();
                    failedQueue.push({ config: response.config, resolve: deferred.resolve, reject: deferred.reject });

                    if (!isRefreshingToken) {
                        console.log(window.url);
                        isRefreshingToken = true;
                        var $http = $injector.get('$http'); // Inject $http dynamically
                        response.config.headers['Authorization'] = 'Bearer ' + token;
                        $http.post(window.url + '/Admin/RefreshToken', refreshTokenObj)
                            .then(function (response) {
                                console.log(response);

                                let newToken = response.data.AccessToken;
                                let newRefreshToken = response.data.RefreshToken;
                                let newTokenExpireTime = response.data.TokenExpireTime;
                                datapersistanceFactory.set('JWTToken', newToken);
                                datapersistanceFactory.set('RefreshToken', newRefreshToken);
                                datapersistanceFactory.set("TokenExpireTime", newTokenExpireTime);
                                var userLoginDetailsnew = eHnoteLoginStatusService.getUserLoginDetails();
                                userLoginDetailsnew.JToken = newToken;
                                userLoginDetailsnew.RToken = newRefreshToken;
                                userLoginDetailsnew.TokenExpiry = newTokenExpireTime;
                                userLoginDetailsnew.loggedinStatus = true;
                                eHnoteLoginStatusService.addUserLoginDetails(userLoginDetailsnew);
                                retryFailedRequests(newToken);
                            })
                            .catch(function (error) {

                                alertify.error(error);
                                console.log('Error while generating refresh token :', error);
                                datapersistanceFactory.clearAll();
                                datapersistanceFactory.set("JWTToken", "");
                                datapersistanceFactory.set("USerLoginTime", "");
                                angular.element('.modal-dialog').hide();
                                angular.element('.modal').hide();
                                angular.element('.modal-backdrop').hide();
                                angular.element('.viewer-backdrop').hide();
                                //hide any open bootstrap modals
                                angular.element('.inmodal').hide();
                                angular.element('.alertify-logs').hide();
                                var $uibModalStack = $injector.get('$uibModalStack');
                                $uibModalStack.dismissAll('logout');
                                if ($window.location.host == "ioj.ehnote.com") {
                                    $window.location.href = "https://portal.ehnote.com/#/login";
                                } else if ($window.location.host == 'insts.ehnote.com') {
                                    $window.location.href = "https://stage.ehnote.com/#/login";
                                } else {
                                    $location.path("/login");
                                }
                            })
                            .finally(function () {
                                isRefreshingToken = false;
                                console.log('Refresh Token API call completed.');
                            });
                    }
                    return deferred.promise;

                }
          else if (response.status === 500 && response.data.Status === 5) {
                    datapersistanceFactory.set("JWTToken", "");
                    datapersistanceFactory.set("USerLoginTime", "");
                    //eHnoteValidateUsersDataService.deleteAllCookies();
                    datapersistanceFactory.clearAll();
                    //$rootScope.showMainPageHeader = false;
                    //$rootScope.patientdetailesConsultation = false;
                    angular.element('.modal-dialog').hide();
                    angular.element('.modal').hide();
                    angular.element('.modal-backdrop').hide();
                    angular.element('.viewer-backdrop').hide();
                    //hide any open bootstrap modals
                    angular.element('.inmodal').hide();
                    angular.element('.alertify-logs').hide();
                    angular.element('.viewer-backdrop').hide();
                    var $uibModalStack = $injector.get('$uibModalStack');
                    $uibModalStack.dismissAll('logout');
                    if ($window.location.host == "ioj.ehnote.com") {
                        $window.location.href = "https://portal.ehnote.com/#/login";
                    } else if ($window.location.host == 'insts.ehnote.com') {
                        $window.location.href = "https://stage.ehnote.com/#/login";
                    } else {
                        $location.path("/login");
                    }
                }

          if (response.status === 401) {

                    let userRefreshTokenObj = datapersistanceFactory.getItem('userRefreshTokenObj') || {};
                    var refreshTokenObj = {
                        "RefreshToken": "",
                        "FirstName": userRefreshTokenObj.FirstName || "",
                        "DoctorId": userRefreshTokenObj.DoctorId || 0,
                        "RoleId": userRefreshTokenObj.RoleId || 0,
                        "DeviceType": "49EBEEB3"
                    }
                    datapersistanceFactory.set("JWTToken", "");
                   //refreshTokenObj.RefreshToken = sessionStorage.getItem('RefreshToken');
                   refreshTokenObj.RefreshToken = datapersistanceFactory.getItem('RefreshToken');
                    //refreshTokenObj.RefreshToken = datapersistanceFactory.getItem('RefreshToken');
                    if (!refreshTokenObj.RefreshToken) {
                        if ($window.location.host == "ioj.ehnote.com") {
                            $window.location.href = "https://portal.ehnote.com/#/login";
                        } else if ($window.location.host == 'insts.ehnote.com') {
                            $window.location.href = "https://stage.ehnote.com/#/login";
                        } else {
                            $location.path("/login");
                        }
                        return $q.reject(response);
                    }
                    var deferred = $q.defer();
                    failedQueue.push({ config: response.config, resolve: deferred.resolve, reject: deferred.reject });

                    if (!isRefreshingToken) {
                        console.log(window.url);
                        isRefreshingToken = true;
                        var $http = $injector.get('$http'); // Inject $http dynamically
                        $http({
                            method: 'POST',
                            url: window.url + '/Admin/RefreshToken',
                            data: refreshTokenObj,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': ""
                            }
                        }).then(function (response) {
                            let newToken = response.data.AccessToken;
                            let newRefreshToken = response.data.RefreshToken;
                            let newTokenExpireTime = response.data.TokenExpireTime;
                            datapersistanceFactory.set('JWTToken', newToken);
                            datapersistanceFactory.set('RefreshToken', newRefreshToken);
                            datapersistanceFactory.set("TokenExpireTime", newTokenExpireTime);
                            var userLoginDetailsnew = eHnoteLoginStatusService.getUserLoginDetails();
                            userLoginDetailsnew.JToken = newToken;
                            userLoginDetailsnew.RToken = newRefreshToken;
                            userLoginDetailsnew.TokenExpiry = newTokenExpireTime;
                            userLoginDetailsnew.loggedinStatus = true;
                            eHnoteLoginStatusService.addUserLoginDetails(userLoginDetailsnew);
                            retryFailedRequests(newToken);

                        }).catch(function (error) {
                            console.log(error);
                            alertify.error(error);
                            console.log('Error while generating refresh token :', error);
                            datapersistanceFactory.clearAll();
                            datapersistanceFactory.set("JWTToken", "");
                            datapersistanceFactory.set("USerLoginTime", "");
                            angular.element('.modal-dialog').hide();
                            angular.element('.modal').hide();
                            angular.element('.modal-backdrop').hide();
                            angular.element('.viewer-backdrop').hide();
                            //hide any open bootstrap modals
                            angular.element('.inmodal').hide();
                            angular.element('.alertify-logs').hide();
                            angular.element('.viewer-backdrop').hide();
                            var $uibModalStack = $injector.get('$uibModalStack');
                            $uibModalStack.dismissAll('logout');
                            if ($window.location.host == "ioj.ehnote.com") {
                                $window.location.href = "https://portal.ehnote.com/#/login";
                            } else if ($window.location.host == 'insts.ehnote.com') {
                                $window.location.href = "https://stage.ehnote.com/#/login";
                            } else {
                                $location.path("/login");
                            }
                        }).finally(function () {
                            isRefreshingToken = false;
                            console.log('Refresh Token API call completed.');
                        });
                    }
                    return deferred.promise;
                }
          return $q.reject(response);

          }
        };
    }]);
eHnoteWebApp.directive("loader", [function () {
    return function ($scope, element, attrs) {
        $scope.$on("loader_show", function () {
            return element.show();
        });
        return $scope.$on("loader_hide", function () {
            return element.hide();
        });
    };
}]);



eHnoteWebApp.directive("hidejob", ["$interval", function ($interval) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {

            function ShowHideLogic() {
                var Hours = new Date().getHours();
                if (Hours >= 17) {
                    element.show();
                } else if (Hours <= 8) {
                    element.show();
                } else {
                    element.hide();
                }
            }

            ShowHideLogic();


            $interval(function () {
                ShowHideLogic();
            }, 300000);
        }
    };
}]);







eHnoteWebApp.directive('placesAutoComplete', ["Attr2MapOptions", "$timeout", function (Attr2MapOptions, $timeout) {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (attrs.placesAutoComplete === 'false') {
                return false;
            }
            var filtered = Attr2MapOptions.filter(attrs);
            var options = Attr2MapOptions.getOptions(filtered, {
                scope: scope
            });
            var events = Attr2MapOptions.getEvents(scope, filtered);
            var autocomplete = new google.maps.places.Autocomplete(element[0], options);
            for (var eventName in events) {
                google.maps.event.addListener(autocomplete, eventName, events[eventName]);
            }
            var updateModel = function () {
                $timeout(function () {
                    ngModelCtrl && ngModelCtrl.$setViewValue(element.val());
                }, 100);
            };
            google.maps.event.addListener(autocomplete, 'place_changed', updateModel);
            element[0].addEventListener('change', updateModel);
            attrs.$observe('types', function (val) {
                if (val) {
                    var optionValue = Attr2MapOptions.toOptionValue(val, {
                        key: 'types'
                    });
                    autocomplete.setTypes(optionValue);
                }
            });
        }
    };
}]);

//eHnoteWebApp.filter('searchFindings', function () {
//    return function (items, query) {
//        if (!query || query.trim() === '') return items;
//        var q = query.toLowerCase().trim();
//        return (items || []).filter(function (x) {
          
//            var name = x.FindingDescription || x.FindingName || x.Name || '';
//            return name.toLowerCase().indexOf(q) !== -1;
//        });
//    };
//});

eHnoteWebApp.filter('searchFindings', function () {
    return function (items, query) {
        if (!query || query.trim() === '') return items;
        var q = query.toLowerCase().trim();
        return (items || []).filter(function (x) {
            var name = x.FindingDescription || x.FindingName || x.Name || '';
            return name.toLowerCase().indexOf(q) !== -1;
        });
    };
});

eHnoteWebApp.directive("datepickerdobpatient", [function () {

    return {

        restrict: "A",

        require: "ngModel",

        link: function (scope, elem, attrs, ngModelCtrl) {

            // update model
            var updateModel = function (dateText) {

                scope.$apply(function () {

                    ngModelCtrl.$setViewValue(dateText);

                });

            };

            // datepicker
            elem.datepicker({

                dateFormat: "mm-dd-yy",

                yearRange: "1900:+0",

                maxDate: 0,

                changeYear: true,

                changeMonth: true,

                onSelect: function (dateText) {

                    updateModel(dateText);

                }

            });

            // FIX
            scope.$watch(function () {

                return ngModelCtrl.$modelValue;

            }, function (newValue) {

                if (!newValue) return;

                if (scope.PatientSearchObj &&
                    scope.PatientSearchObj.SearchTypeId == 5) {

                    elem.val(newValue);

                }

            });

            // manual typing
            elem.on("change", function () {

                var value = elem.val();

                scope.$apply(function () {

                    ngModelCtrl.$setViewValue(value);

                });

            });

        }

    };

}]);

//eHnoteWebApp.directive("datepickerdobpatient", [function () {
//    return {
//        restrict: "A",
//        require: "ngModel",
//        link: function (scope, elem, attrs, ngModelCtrl) {
//            // Function to update the model with the selected date
//            var updateModel = function (dateText) {
//                scope.$apply(function () {
//                    ngModelCtrl.$setViewValue(dateText);
//                });

//                // Trigger the search function when a date is selected
//                if (typeof scope.onSearchDateChange === "function") {
//                    scope.onSearchDateChange(dateText);
//                } else {
//                    console.warn("Search function not defined.");
//                }
//            };

//            // Initialize datepicker with options
//            var options = {
//                dateFormat: "mm-dd-yy", // Correct format for MM-DD-YYYY
//                yearRange: "1900:+0",
//                maxDate: 0,
//                changeYear: true,
//                changeMonth: true,
//                onSelect: function (dateText) {
//                    updateModel(dateText); // Update the model and trigger search
//                }
//            };

//            // Initialize datepicker
//            elem.datepicker(options);

//            // Watch for changes in the model to set the date picker value
//            scope.$watch(function () {
//                return ngModelCtrl.$modelValue;
//            }, function (newValue) {
//                if (newValue) {
//                    elem.datepicker("setDate", newValue); // Update datepicker value
//                }
//            });

//            // Trigger search on manual input
//            elem.on("change", function () {
//                var value = elem.val();
//                scope.$apply(function () {
//                    ngModelCtrl.$setViewValue(value);
//                });

//                // Trigger the search function if defined
//                if (typeof scope.onSearchDateChange === "function") {
//                    scope.onSearchDateChange(value);
//                } else {
//                    console.warn("Search function not defined.");
//                }
//            });
//        }
//    };
//}]);

eHnoteWebApp.directive("datepickerregpatient", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: 'm-dd-yy',
                yearRange: '1900:+0',
                maxDate: 0,
                changeYear: true,
                changeMonth: true,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);

eHnoteWebApp.directive("datepickerryearmonthchange", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: 'm-dd-yy',
                yearRange: '2023:+50',
                changeYear: true,
                changeMonth: true,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);
eHnoteWebApp.directive("datepickerpreauthpatient", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: 'm-dd-yy', // Format: month-day-year
                yearRange: '-100:+60', // Allows selecting years from 100 years ago to 60 years in the future
                maxDate: '+60y',       // Maximum date is 60 years in the future
                minDate: '-100y',      // Minimum date is 100 years in the past
                changeYear: true,      // Enables the year dropdown
                changeMonth: true,     // Enables the month dropdown
                onSelect: function (dateText) {
                    updateModel(dateText); // Update the ngModel value when a date is selected
                }
            };
            elem.datepicker(options); // Initialize jQuery UI datepicker with the options
        }
    };
}]);


eHnoteWebApp.directive("datepickerregpatientus", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: 'mm-dd-yy',
                yearRange: '1900:+0',
                maxDate: 0,
                changeYear: true,
                changeMonth: true,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);

/* ---------------------------------------------------------------------------
   ocularOdOsDatepicker  —  companion for the Ocular / Ocular Surgery OD and OS date fields in ROSpopupadding.html. Opt-in: only inputs that carry the ocular-od-os-datepicker attribute are affected.
   --------------------------------------------------------------------------- */
eHnoteWebApp.directive("ocularOdOsDatepicker", [function () {
    var ocularDpSeq = 0;

    return {
        restrict: "A",
        priority: 100,
        link: {
            pre: function (scope, elem, attrs) {
                var existingId = elem.attr('id');

                // An explicit, non-interpolated id from the markup always wins.
                if (existingId && existingId.indexOf('{{') === -1) {
                    return;
                }

                var uniqueId;
                do {
                    uniqueId = 'ocularDp_' + (++ocularDpSeq);
                } while (document.getElementById(uniqueId));

                attrs.$set('id', uniqueId);
            }
        }
    };
}]);

eHnoteWebApp.directive("datepickerManualAndCalSelection", ["alertify", function (alertify) {
    var dpUniqueCounter = 0;
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {

            if (!elem.attr('id') || elem.attr('id').indexOf('{{') !== -1) {
                var baseId = (attrs.id || 'dp').replace(/\{\{.*\}\}/g, '');
                elem.attr('id', baseId + '_' + (++dpUniqueCounter));
            }

            const isDob = attrs.hasOwnProperty('isDob');
            let lastValue = '';
            let dashTypedManually = false;
            let isDeleting = false;

            /* ---------------- Datepicker ---------------- */
            elem.datepicker({
                dateFormat: 'mm-dd-yy',
                yearRange: isDob ? '1900:+0' : '1900:+10',
                maxDate: isDob ? 0 : null,
                changeYear: true,
                changeMonth: true,
                showOn: 'none',
                onSelect: function (dateText) {
                    previousMonth = parseInt(dateText.slice(0, 2), 10);
                    scope.$applyAsync(function () {
                        ngModelCtrl.$setViewValue(dateText);
                        ngModelCtrl.$render();
                        lastValue = dateText;
                    });
                },
                onClose: function () {
                    elem.prop('readonly', false);
                }
            });

            const calendarIcon = elem.parent().find('.calender__w16--o');

            calendarIcon.on('mousedown touchstart', function (e) {
                e.preventDefault();
            });

            calendarIcon.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                if (document.activeElement === elem[0]) {
                    elem.blur();
                }

                elem.prop('readonly', true);
                elem.datepicker('show');
            });

            let previousMonth = null;

            function isLeapYear(year) {
                return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
            }

            function getMaxDays(month, year) {
                if (month === 2) {
                    if (!year) return 29;
                    return year && isLeapYear(year) ? 29 : 28;
                }
                return [4, 6, 9, 11].includes(month) ? 30 : 31;
            }

            function resetDateFlow() {
                lastValue = '';
                previousMonth = null;
                dashTypedManually = false;
                isDeleting = false;
            }
            function isValidMonth(mm) {
                return mm.length === 2 && +mm >= 1 && +mm <= 12;
            }
            function getRawMonth(value) {
                const parts = value.split('-');
                return parts[0] || '';
            }

            function isMonthIncomplete(raw) {
                const parts = raw.split('-');
                return !parts[0] || parts[0].length < 2;
            }

            function isDayIncomplete(raw) {
                const parts = raw.split('-');
                return parts.length >= 2 && (!parts[1] || parts[1].length < 2);
            }


            /* ---------------- KEYDOWN ---------------- */
            elem.on('keydown', function (e) {
                const key = e.key;
                const value = elem.val() || '';
                let dashIndex = -1;
                const caretPos = elem[0].selectionStart || 0;
                const digits = value.replace(/\D/g, '');
                const digitsBeforeCaret = value.slice(0, caretPos).replace(/\D/g, '').length;

                if ((caretPos === 0 && value[0] === "1" && key >= 2) || (caretPos === 0 && value[0] === "2" && key >= 2)) {
                    e.preventDefault();
                    alertify.error("Invalid month. Month must be between 1 and 12");
                    return;
                }

                /* DELETE / BACKSPACE */
                if (key === 'Backspace' || key === 'Delete') {
                    isDeleting = true;
                    const rawMonth = getRawMonth(value);
                    if (rawMonth.length < 2) {
                        if ((key === 'Backspace' && caretPos >= 3 && caretPos <= 5) ||
                            (key === 'Delete' && caretPos >= 2 && caretPos < 4)) {
                            e.preventDefault();
                            alertify.error("Please enter a valid month before entering the day.");
                            return;
                        }
                    }

                    if (value.length >= 2 && value[0] === '0' && value[1] > '2' && value[1] <= '9' && caretPos === 1) {
                        e.preventDefault();
                        alertify.error("You are not allowed to remove '0' from month");
                        return;
                    }

                    if (key === 'Backspace' && value[caretPos - 1] === '-') {
                        dashIndex = caretPos - 1;
                    }

                    if (key === 'Delete' && value[caretPos] === '-') {
                        dashIndex = caretPos;
                    }

                    if (dashIndex !== -1) {
                        const afterDash = value.slice(dashIndex + 1).replace(/-/g, '');
                        if (afterDash.length > 0) {
                            e.preventDefault();
                            alertify.error("Invalid date format. ‘-’ is required between month, day, and year.");
                            return;
                        }
                    }
                    return;
                }

                if (["ArrowLeft", "ArrowRight", "Tab"].includes(key)) return;

                if (!/^\d$/.test(key) && key !== '-') {
                    e.preventDefault();
                    return;
                }

                if (digitsBeforeCaret === 0 && key >= '2' && key <= '9') {
                    e.preventDefault();
                    const newValue = value.slice(0, caretPos) + '0' + key + value.slice(caretPos);
                    elem.val(newValue);
                    elem.triggerHandler('input');
                }

                if (value.indexOf('-') === 2 && digits.slice(0, 2).length === 2 && caretPos <= 2) {
                    e.preventDefault();
                    alertify.error("Invalid month. Only two digits are allowed for the month.");
                    return;
                }

                if (value.lastIndexOf('-') === 5 && digits.slice(2, 4).length === 2 && caretPos > 2 && caretPos <= 5) {
                    e.preventDefault();
                    alertify.error("Invalid day. Only two digits are allowed for the day.");
                    return;
                }

                if (digitsBeforeCaret === 1 && digits[0] === '0' && key === '0') {
                    e.preventDefault();
                    alertify.error("Invalid month format. Leading zero is required for single-digit month.");
                    return;
                }
                if (digitsBeforeCaret === 2 && digits[2] === '0' && key === '0') {
                    e.preventDefault();
                    alertify.error("Invalid day format. Leading zero is required for single-digit day.");
                    return;
                }

                if (key === '-') {
                    if (caretPos === 2 || caretPos === 5) {
                        dashTypedManually = true;
                        return;
                    }
                    e.preventDefault();
                    return;
                }

                /* ---------- MONTH ---------- */
                if (digitsBeforeCaret === 1) {
                    if (digits[0] === '1' && +key > 2) {
                        e.preventDefault();
                        alertify.error("Invalid month. Month must be between 1 and 12");
                        return;
                    }

                    if (digits[0] === '2' && +key >= 0) {
                        e.preventDefault();
                        alertify.error("Invalid month. Month must be between 1 and 12");
                        return;
                    }
                }

                /* ---------- DAY: CARET-AWARE FIRST DIGIT RE-ENTRY and FIRST DIGIT RULE---------- */
                if (digitsBeforeCaret === 2) {
                    const rawMonth = getRawMonth(value);

                    if (rawMonth.length !== 2 || !isValidMonth(rawMonth)) {
                        return;
                    }

                    const month = parseInt(rawMonth, 10);

                    if (key >= '4' && key <= '9') {
                        e.preventDefault();
                        elem.val(value.slice(0, caretPos) + '0' + key + value.slice(caretPos));
                        elem.triggerHandler('input');
                        return;
                    }

                    if (month === 2 && key === '3') {
                        e.preventDefault();
                        elem.val(value.slice(0, caretPos) + '03' + value.slice(caretPos));
                        elem.triggerHandler('input');
                        return;
                    }
                    return;
                }



                /* ---------- DAY: SECOND DIGIT STRICT VALIDATION ---------- */
                if (digitsBeforeCaret === 3) {
                    const rawMonth = getRawMonth(value);
                    const month = parseInt(rawMonth, 10);
                    const firstDayDigit = digits[2];
                    const secondDigit = key;
                    const year = digits.length >= 7 ? parseInt(digits.slice(4, 8), 10) : null;
                    const dayCandidate = parseInt(firstDayDigit + secondDigit, 10);
                    const maxDays = getMaxDays(month, year);

                    if (rawMonth.length !== 2 || !isValidMonth(rawMonth)) {
                        return;
                    }

                    if (dayCandidate > maxDays) {
                        e.preventDefault();
                        alertify.error(`Invalid day. This month has only ${maxDays} days.`);
                        return;
                    }
                }


                /* ---------- YEAR ---------- */
                if (digitsBeforeCaret === 4 && key !== '1' && key !== '2') {
                    if (key === '0' || (key >= '3' && isDob)) {
                        e.preventDefault();
                        if (key === '0') {
                            alertify.error("Invalid year. Year cannot be earlier than 1900.");
                        }
                        if (key >= '3' && isDob) {
                            alertify.error("Future dates are not allowed for Date of Birth.");
                        }
                        return;
                    }
                }
                if (digitsBeforeCaret === 5 && digits[4] === '2' && key !== '0') {
                    if (isDob) {
                        e.preventDefault();
                        alertify.error("Future dates are not allowed for Date of Birth.");
                        return;
                    }
                }
                if (digitsBeforeCaret === 5 && digits[4] === '1' && key !== '9') {
                    e.preventDefault();
                    alertify.error("Invalid year. Year cannot be earlier than 1900.");
                    return;
                }
                if (digitsBeforeCaret === 6 && digits[5] === '0' && +key >= '3') {
                    if (isDob) {
                        e.preventDefault();
                        alertify.error("Future dates are not allowed for Date of Birth.");
                        return;
                    }
                }

                /* ---------- FEB 29 → STRICT LEAP YEAR BLOCK ---------- */
                if (digitsBeforeCaret >= 4) {
                    const mm = digits.slice(0, 2);
                    const dd = digits.slice(2, 4);

                    // Build the year incrementally
                    const partialYear =
                        digits.slice(4, digitsBeforeCaret) + key;

                    // Apply ONLY when Feb 29
                    if (mm === '02' && dd === '29' && partialYear.length >= 1) {
                        const yearNum = parseInt(partialYear, 10);

                        // When year becomes 4 digits → validate leap year
                        if (partialYear.length === 4 && !isLeapYear(yearNum)) {
                            e.preventDefault();
                            alertify.error("The entered year is not a leap year.");
                            return;
                        }
                    }
                }


                /* ---------- FUTURE DATE BLOCK ---------- */
                const nextDigits = digits.slice(0, digitsBeforeCaret) + key + digits.slice(digitsBeforeCaret);

                /* ---------- FUTURE DATE BLOCK (DOB ONLY) ---------- */
                if (isDob) {
                    const today = new Date();
                    const mm = +nextDigits.slice(0, 2);
                    const dd = +nextDigits.slice(2, 4);
                    const yyyy = +nextDigits.slice(4, 8);

                    today.setHours(0, 0, 0, 0);

                    if (yyyy > today.getFullYear()) {
                        e.preventDefault();
                        alertify.error("Future dates are not allowed. Please select a valid date.");
                        return;
                    }

                    if (yyyy === today.getFullYear() && mm) {
                        if (mm - 1 > today.getMonth()) {
                            e.preventDefault();
                            alertify.error("Future dates are not allowed. Please select a valid date.");
                            return;
                        }
                        if (dd) {
                            const d = new Date(yyyy, mm - 1, dd);
                            if (d > today) {
                                e.preventDefault();
                                alertify.error("Future dates are not allowed. Please select a valid date.");
                                return;
                            }
                        }
                    }
                }
            });

            /* ---------------- INPUT ---------------- */
            elem.on('input', function () {
                const raw = elem.val() || '';
                const digits = raw.replace(/\D/g, '');

                if (isMonthIncomplete(raw)) {
                    scope.$applyAsync(() => {
                        ngModelCtrl.$setViewValue(raw);
                        ngModelCtrl.$render();
                    });

                    lastValue = raw;
                    previousMonth = null;
                    return;
                }

                /* ---------- DAY INCOMPLETE (PREVENT YEAR SHIFT) ---------- */
                if (isDayIncomplete(raw)) {
                    scope.$applyAsync(() => {
                        ngModelCtrl.$setViewValue(raw);
                        ngModelCtrl.$render();
                    });

                    lastValue = raw;
                    return;
                }


                /* ---------- MONTH RE-ENTRY AFTER FULL DELETE ---------- */
                if (raw.startsWith('-')) {
                    const match = raw.match(/^-(\d)$/);
                    if (match) {
                        const digit = match[1];
                        if (+digit >= 2) {
                            const fixed = '0' + digit + raw.slice(2);
                            scope.$applyAsync(() => {
                                ngModelCtrl.$setViewValue(fixed);
                                ngModelCtrl.$render();
                            });
                            lastValue = fixed;
                            previousMonth = parseInt('0' + digit, 10);
                            return;
                        }
                    }
                    scope.$applyAsync(() => {
                        ngModelCtrl.$setViewValue(raw);
                        ngModelCtrl.$render();
                    });

                    lastValue = raw;
                    return;
                }

                if (digits.length === 1 && digits[0] >= '2' && digits[0] <= '9') {
                    const fixed = '0' + digits[0];
                    elem.val(fixed);
                    ngModelCtrl.$setViewValue(fixed);
                    lastValue = fixed;
                    previousMonth = parseInt(fixed, 10);
                    dashTypedManually = false;
                    isDeleting = false;
                    return;
                }

                if (raw === '') {
                    resetDateFlow();
                    return;
                }

                /* ---------- DAY: BLOCK 00 ---------- */
                if (digits.length >= 4) {
                    const day = digits.slice(2, 4); // DD

                    if (day === '00') {
                        scope.$applyAsync(() => {
                            ngModelCtrl.$setViewValue('');
                            ngModelCtrl.$render();
                        });

                        previousMonth = null;
                        lastValue = '';
                        alertify.error("Invalid day format. Leading zero is required for single-digit day.");
                        return;
                    }
                }
                /* ---------- DAY: BLOCK 00 ---------- */
                if (digits.length >= 2) {
                    const month = digits.slice(0, 2); // DD

                    if (month === '00') {
                        scope.$applyAsync(() => {
                            ngModelCtrl.$setViewValue('');
                            ngModelCtrl.$render();
                        });

                        previousMonth = null;
                        lastValue = '';
                        alertify.error("Invalid month format. Leading zero is required for single-digit month.");
                        return;
                    }
                }

                let mm = digits.slice(0, 2);
                const dd = digits.slice(2, 4);
                const yyyy = digits.slice(4, 8);

                /* ---------- MONTH CHANGE → HARD DAY REVALIDATION ---------- */
                if (isValidMonth(mm) && dd.length === 2) {
                    const monthNum = parseInt(mm, 10);
                    const dayNum = parseInt(dd, 10);
                    const yearNum = yyyy.length === 4 ? parseInt(yyyy, 10) : null;

                    const maxDays = getMaxDays(monthNum, yearNum);

                    if (dayNum > maxDays) {
                        scope.$applyAsync(() => {
                            ngModelCtrl.$setViewValue('');
                            ngModelCtrl.$render();
                        });

                        previousMonth = null;
                        lastValue = '';
                        alertify.error(`Invalid date, This month has only ${maxDays} days.`);
                        return;
                    }
                }

                /* ---------- FEB 29 LEAP YEAR FINAL VALIDATION ---------- */
                if (isValidMonth(mm) && mm === '02' && dd === '29' && yyyy.length === 4) {
                    const yearNum = parseInt(yyyy, 10);

                    if (!isLeapYear(yearNum)) {
                        scope.$applyAsync(() => {
                            ngModelCtrl.$setViewValue('');
                            ngModelCtrl.$render();
                        });

                        previousMonth = null;
                        lastValue = '';
                        alertify.error("Invalid date. The entered year is not a leap year");
                        return;
                    }
                }

                /* ---------- DELETE FLOW ---------- */
                if (isDeleting) {
                    let value = raw;

                    const prevDigits = (lastValue || '').replace(/\D/g, '');
                    const currDigits = digits;

                    if (isDeleting && prevDigits.length >= 2 && currDigits.length === 1) {
                        scope.$applyAsync(() => {
                            ngModelCtrl.$setViewValue('');
                            ngModelCtrl.$render();
                        });
                        previousMonth = null;
                        lastValue = '';
                        return;
                    }

                    if (value.endsWith('-')) {
                        value = value.slice(0, -1);
                    }
                    scope.$applyAsync(() => {
                        ngModelCtrl.$setViewValue(value);
                        ngModelCtrl.$render();
                    });

                    lastValue = value;
                    isDeleting = false;
                    return;
                }

                const manualDashUsed = dashTypedManually;
                dashTypedManually = false;

                if (mm.length === 1 && +mm >= 2) mm = '0' + mm;

                if (mm.length === 2 && (+mm < 1 || +mm > 12)) return;

                if (isValidMonth(mm)) {
                    const newMonth = parseInt(mm, 10);
                    const day = dd.length === 2 ? parseInt(dd, 10) : null;
                    const year = yyyy.length === 4 ? parseInt(yyyy, 10) : null;

                    if (previousMonth === null) {
                        previousMonth = newMonth;
                    } else if (previousMonth !== newMonth && day !== null) {
                        const maxDays = getMaxDays(newMonth, year);
                        if (day > maxDays) {
                            scope.$applyAsync(() => {
                                ngModelCtrl.$setViewValue('');
                                ngModelCtrl.$render();
                            });
                            previousMonth = null;
                            lastValue = '';
                            alertify.error("Invalid date format. Please enter the date in MM-DD-YYYY format");
                            return;
                        }
                        previousMonth = newMonth;
                    }
                }

                /* ---------- FORMAT VALUE (NO SHIFTING) ---------- */
                let formatted;

                if (manualDashUsed) {
                    formatted = raw;
                } else {
                    formatted = mm;
                    if (dd) formatted += '-' + dd;
                    if (yyyy) formatted += '-' + yyyy;
                }

                scope.$applyAsync(() => {
                    ngModelCtrl.$setViewValue(formatted);
                    ngModelCtrl.$render();
                });

                lastValue = formatted;
            });

            /* ---------------- BLUR ---------------- */
            elem.on('blur', function () {
                const value = elem.val() || '';
                const digits = value.replace(/\D/g, '');

                if (digits.length !== 8 && digits.length !== 0) {
                    scope.$applyAsync(() => {
                        ngModelCtrl.$setViewValue('');
                        ngModelCtrl.$render();
                    });

                    previousMonth = null;
                    lastValue = '';
                    alertify.error("Invalid date format. Please enter the date in MM-DD-YYYY format");
                }
            });

            ngModelCtrl.$render = function () {
                elem.val(ngModelCtrl.$viewValue || '');
            };
        }
    };
}]);


eHnoteWebApp.directive("datepickerregpatientus1", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {

            // Prevent repeated initialization in ng-repeat
            if (elem.data('datepicker-initialized')) {
                return;
            }
            elem.data('datepicker-initialized', true);

            var updateModel = function (dateText) {
                scope.$applyAsync(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };

            var options = {
                dateFormat: 'mm-dd-yy',
                yearRange: '1900:+0',
                maxDate: 0,
                changeYear: true,
                changeMonth: true,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };

            // Initialize jQuery UI datepicker safely
            setTimeout(function () {
                elem.datepicker(options);
            });
        }
    };
}]);

eHnoteWebApp.directive("datepickeryearmonthchangeinforward", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: 'm-dd-yy',
                yearRange: '2023:+50',
                minDate: 0,
                changeYear: true,
                changeMonth: true,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);

eHnoteWebApp.directive("alphaNumeric", [function () {
    return {
        "require": "ngModel",
        "link": function (scope, element, attrs, modelCtrl) {
            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) {
                    return '';
                }
                var transformedInput = inputValue.replace(/[^0-9a-zA-Z]/g, "");
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);
eHnoteWebApp.directive('onlyAlphaText', [function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                var transformedInput = text.replace(/[^a-zA-Z]/g, '');
                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }
                return transformedInput;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
}]);
eHnoteWebApp.directive("onlyAlphabets", [function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                var transformedInput = text.replace(/[^0-9a-zA-Z]/g, '');
                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }
                return transformedInput;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
}]);
eHnoteWebApp.directive("onlyAlphafori", [function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                var transformedInput = text.replace(/[^a-zA-Z]/g, '');
                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }
                return transformedInput;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
}]);
eHnoteWebApp.directive("jqdatepickerformv", [function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            $(function () {
                element.datepicker({
                    yearRange: '1900:+0',
                    dateFormat: 'dd-MM-yy',
                    maxDate: 0,
                    changeYear: true,
                    changeMonth: true,
                    onSelect: function (date) {
                        ngModelCtrl.$setViewValue(date);
                        scope.$apply();
                    }
                });
            });
        }
    };
}]);
eHnoteWebApp.directive("datepickerforab", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: 'dd-M-yy',
                maxDate: 0,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);
eHnoteWebApp.filter("textUpperCase", [function () {
    return function (input, scope) {
        return input ? input.substring(0, 1).toUpperCase() + input.substring(1) : "";
    };
}]);
eHnoteWebApp.filter("amPm", [function () {
    return function (time) {
        return moment(time, ["HH:mm"]).format("hh:mm A");
    };
}]);
eHnoteWebApp.filter("hour", [function () {
    return function (time) {
        return moment(time, ["HH:mm"]).format("hh:mm");
    };
}]);
eHnoteWebApp.filter('maskSensitive', function () {
    return function (input) {
        if (!input) return '';

        // Handle email
        if (input.includes('@')) {
            const [user, domain] = input.split('@');
            if (!user || !domain) return input;

            const start = user.substring(0, 2);
            const end = user.substring(user.length - 2);
            const maskedUser = start + '*'.repeat(user.length - 4) + end;

            return maskedUser + '@' + domain;
        }

        // Handle phone numbers (keep formatting and country code)
        const digits = input.replace(/\D/g, ''); // remove all non-digits
        if (digits.length < 3) return input;

        const visibleDigits = digits.slice(-3);
        const maskedDigits = '*'.repeat(digits.length - 3);
        const maskedFull = maskedDigits + visibleDigits;

        let digitIndex = 0;
        let maskedFormatted = '';

        // Reconstruct the original format with masked digits
        for (let i = 0; i < input.length; i++) {
            if (/\d/.test(input[i])) {
                maskedFormatted += maskedFull[digitIndex++];
            } else {
                maskedFormatted += input[i];
            }
        }

        return maskedFormatted;
    };
});

eHnoteWebApp.directive('validatePassword', [function () {
    return {
        require: "ngModel",
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = "#" + attrs.validatePassword;
            elem.add(firstPassword).on("keyup", function () {
                scope.$apply(function () {
                    ctrl.$setValidity('passMatch', elem.val() === $(firstPassword).val());
                });
            });
        }
    };
}]);
eHnoteWebApp.directive("modifyPercentval", [function () {
    return {
        "restrict": "A",
        "link": function (scope, elem, attrs) {
            elem.bind('keydown', function (e) {
                var value = elem[0].value;
                var char = e.key;
                if (parseFloat(value + char) > 100 && e.keyCode !== 8) {
                    e.preventDefault();
                    return false;
                }
                return true;
            });
        }
    };
}]);
eHnoteWebApp.directive("findingRemarks", [function () {
    return {
        "restrict": "A",
        "link": function (scope, elem, attrs) {
            elem.bind('keydown', function (e) {
                if (e.keyCode === 188 || e.keyCode === 190) {
                    e.preventDefault();
                    return false;
                }
                return true;
            });
        }
    };
}]);
eHnoteWebApp.directive("restrictSingleQuote", [function () {
    return {
        "restrict": "A",
        "link": function (scope, elem, attrs) {
            elem.bind('keydown', function (e) {
                if (e.keyCode === 222) {
                    e.preventDefault();
                    return false;
                }
                return true;
            });
        }
    };
}]);
eHnoteWebApp.filter("startFrom", [function () {
    return function (input, start) {
        start = +start;
        if (input !== undefined && input.length !== 0) {
            return input.slice(start);
        }
    };
}]);
eHnoteWebApp.filter("groupBy", ["$timeout", function ($timeout) {
    return function (data, key) {
        if (!key) return data;
        var outputPropertyName = '__groupBy__' + key;
        if (!data[outputPropertyName]) {
            var result = {};
            for (var i = 0; i < data.length; i++) {
                if (!result[data[i][key]])
                    result[data[i][key]] = [];
                result[data[i][key]].push(data[i]);
            }
            Object.defineProperty(data, outputPropertyName, {
                enumerable: false, configurable: true, writable: false, value: result
            });
            $timeout(function () { delete data[outputPropertyName]; }, 0, false);
        }
        return data[outputPropertyName];
    };
}]);
eHnoteWebApp.filter("getType", [function () {
    return function (obj) {
        return typeof obj;
    };
}]);
//crm directives
eHnoteWebApp.filter("priceGreaterThan", ["$filter", function ($filter) {
    return function (input, price) {
        var output = [];
        if (price === "" || price === undefined) {
            output = input;
        } else {
            if (isNaN(price)) {
                output = $filter("filter")(input, {
                    "Name": price
                });
            } else {
                output = $filter("filter")(input, {
                    "Mobile": price
                });
            }
        }
        return output;
    };
}]);
eHnoteWebApp.directive("datepickersearchpast", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                // call $apply to bring stuff to angular model
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: 'dd-MM-yy',
                maxDate: 0,
                // handle jquery date change
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            // jqueryfy the element
            elem.datepicker(options);
        }
    };
}]);
eHnoteWebApp.directive("datepickersearchall", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                // call $apply to bring stuff to angular model
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: 'dd-MM-yy',
                // handle jquery date change
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            // jqueryfy the element
            elem.datepicker(options);
        }
    };
}]);
eHnoteWebApp.directive("focus", ["$timeout", "$window", function ($timeout, $window) {
    return function (id) {
        $timeout(function () {
            var element = $window.document.getElementById(id);
            if (element)
                element.focus();
        });
    };
}]);
eHnoteWebApp.directive("eventFocus", ["focus", function (focus) {
    return function (scope, elem, attr) {
        elem.on(attr.eventFocus, function () {
            focus(attr.eventFocusId);
        });
        scope.$on('$destroy', function () {
            elem.off(attr.eventFocus);
        });
    };
}]);
eHnoteWebApp.directive("resize", ["$window", function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return {
                'h': w.height()
                //'w': w.width()
            };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            //scope.windowWidth = newValue.w;
            //'width': (newValue.w - 100) + 'px'

            scope.heightCG = function () {
                return {
                    'height': (newValue.h - 38) + 'px'
                };
            };
            scope.heightEO = function () {
                return {
                    'height': (newValue.h - 50) + 'px'
                };
            };
            scope.heightFE = function () {
                return {
                    'height': (newValue.h - 65) + 'px'
                };
            };
            scope.heightGO = function () {
                return {
                    'height': (newValue.h - 70) + 'px'
                };
            };
            scope.heightGB = function () {
                return {
                    'height': (newValue.h - 72) + 'px'
                };
            };
            scope.heightGD = function () {
                return {
                    'height': (newValue.h - 74) + 'px'
                };
            };
            scope.heightGE = function () {
                return {
                    'height': (newValue.h - 75) + 'px'
                };
            };
            scope.heightHO = function () {
                return {
                    'height': (newValue.h - 80) + 'px'
                };
            };
            scope.heightHB = function () {
                return {
                    'height': (newValue.h - 82) + 'px'
                };
            };
            scope.heightHD = function () {
                return {
                    'height': (newValue.h - 84) + 'px'
                };
            };
            scope.heightIO = function () {
                return {
                    'height': (newValue.h - 90) + 'px'
                };
            };
            scope.heightIE = function () {
                return {
                    'height': (newValue.h - 95) + 'px'
                };
            };
            scope.heightAOO = function () {
                return {
                    'height': (newValue.h - 100) + 'px'
                };
            };
            scope.heightAOC = function () {
                return {
                    'height': (newValue.h - 103) + 'px'
                };
            };
            scope.heightAOH = function () {
                return {
                    'height': (newValue.h - 108) + 'px'
                };
            };
            scope.heightAAC = function () {
                return {
                    'height': (newValue.h - 113) + 'px'
                };
            };
            scope.heightAAD = function () {
                return {
                    'height': (newValue.h - 114) + 'px'
                };
            };
            scope.heightAAE = function () {
                return {
                    'height': (newValue.h - 115) + 'px'
                };
            };
            scope.heightABO = function () {
                return {
                    'height': (newValue.h - 120) + 'px'
                };
            };
            scope.heightABB = function () {
                return {
                    'height': (newValue.h - 122) + 'px'
                };
            };
            scope.heightABD = function () {
                return {
                    'height': (newValue.h - 124) + 'px'
                };
            };
            scope.heightABE = function () {
                return {
                    'height': (newValue.h - 125) + 'px'
                };
            };
            scope.heightABG = function () {
                return {
                    'height': (newValue.h - 127) + 'px'
                };
            };
            scope.heightACO = function () {
                return {
                    'height': (newValue.h - 130) + 'px'
                };
            };
            scope.heightACE = function () {
                return {
                    'height': (newValue.h - 135) + 'px'
                };
            };
            scope.heightACH = function () {
                return {
                    'height': (newValue.h - 138) + 'px'
                };
            };
            scope.heightACI = function () {
                return {
                    'height': (newValue.h - 139) + 'px'
                };
            };
            scope.heightADO = function () {
                return {
                    'height': (newValue.h - 140) + 'px'
                };
            };
            scope.heightADG = function () {
                return {
                    'height': (newValue.h - 147) + 'px'
                };
            };
            scope.heightAEO = function () {
                return {
                    'height': (newValue.h - 150) + 'px'
                };
            };
            scope.heightAEE = function () {
                return {
                    'height': (newValue.h - 155) + 'px'
                };
            };
            scope.heightAEH = function () {
                return {
                    'height': (newValue.h - 158) + 'px'
                };
            };
            scope.heightAFO = function () {
                return {
                    'height': (newValue.h - 160) + 'px'
                };
            };
            scope.heightAFI = function () {
                return {
                    'height': (newValue.h - 164) + 'px'
                };
            };
            scope.heightAGO = function () {
                return {
                    'height': (newValue.h - 170) + 'px'
                };
            };
            scope.heightAGB = function () {
                return {
                    'height': (newValue.h - 172) + 'px'
                };
            };
            scope.heightAGD = function () {
                return {
                    'height': (newValue.h - 174) + 'px'
                };
            };
            scope.heightAHO = function () {
                return {
                    'height': (newValue.h - 180) + 'px'
                };
            };
            scope.heightAHC = function () {
                return {
                    'height': (newValue.h - 183) + 'px'
                };
            };
            scope.heightAHD = function () {
                return {
                    'height': (newValue.h - 184) + 'px'
                };
            };
            scope.heightAHF = function () {
                return {
                    'height': (newValue.h - 186) + 'px'
                };
            };
            scope.heightAIO = function () {
                return {
                    'height': (newValue.h - 190) + 'px'
                };
            };
            scope.heightAIE = function () {
                return {
                    'height': (newValue.h - 195) + 'px'
                };
            };
            scope.heightAIF = function () {
                return {
                    'height': (newValue.h - 196) + 'px'
                };
            };
            scope.heightAIG = function () {
                return {
                    'height': (newValue.h - 197) + 'px'
                };
            };
            scope.heightBOO = function () {
                return {
                    'height': (newValue.h - 200) + 'px'
                };
            };
            scope.heightBOD = function () {
                return {
                    'height': (newValue.h - 204) + 'px'
                };
            };
            scope.heightBAO = function () {
                return {
                    'height': (newValue.h - 210) + 'px'
                };
            };
            scope.heightBAB = function () {
                return {
                    'height': (newValue.h - 212) + 'px'
                };
            };
            scope.heightBAF = function () {
                return {
                    'height': (newValue.h - 216) + 'px'
                };
            };
            scope.heightBBO = function () {
                return {
                    'height': (newValue.h - 220) + 'px'
                };
            };
            scope.heightBBG = function () {
                return {
                    'height': (newValue.h - 227) + 'px'
                };
            };
            scope.heightBCO = function () {
                return {
                    'height': (newValue.h - 230) + 'px'
                };
            };
            scope.heightBCC = function () {
                return {
                    'height': (newValue.h - 233) + 'px'
                };
            };
            scope.heightBCD = function () {
                return {
                    'height': (newValue.h - 234) + 'px'
                };
            };
            scope.heightBCI = function () {
                return {
                    'height': (newValue.h - 239) + 'px'
                };
            };
            scope.heightBDO = function () {
                return {
                    'height': (newValue.h - 240) + 'px'
                };
            };
            scope.heightADE = function () {
                return {
                    'height': (newValue.h - 245) + 'px'
                };
            };
            scope.heightBEO = function () {
                return {
                    'height': (newValue.h - 250) + 'px'
                };
            };
            scope.heightBED = function () {
                return {
                    'height': (newValue.h - 254) + 'px'
                };
            };
            scope.heightBEE = function () {
                return {
                    'height': (newValue.h - 255) + 'px'
                };
            };
            scope.heightBFO = function () {
                return {
                    'height': (newValue.h - 260) + 'px'
                };
            };
            scope.heightBGO = function () {
                return {
                    'height': (newValue.h - 270) + 'px'
                };
            };
            scope.heightBGG = function () {
                return {
                    'height': (newValue.h - 277) + 'px'
                };
            };
            scope.heightBHO = function () {
                return {
                    'height': (newValue.h - 280) + 'px'
                };
            };
            scope.heightBHE = function () {
                return {
                    'height': (newValue.h - 285) + 'px'
                };
            };
            scope.heightBIO = function () {
                return {
                    'height': (newValue.h - 290) + 'px'
                };
            };
            scope.heightBIH = function () {
                return {
                    'height': (newValue.h - 298) + 'px'
                };
            };
            scope.heightBOE = function () {
                return {
                    'height': (newValue.h - 305) + 'px'
                };
            };
            scope.heightCBB = function () {
                return {
                    'height': (newValue.h - 322) + 'px'
                };
            };
            scope.heightCBD = function () {
                return {
                    'height': (newValue.h - 324) + 'px'
                };
            };
            scope.heightCBE = function () {
                return {
                    'height': (newValue.h - 325) + 'px'
                };
            };
            scope.heightCCO = function () {
                return {
                    'height': (newValue.h - 330) + 'px'
                };
            };
            scope.heightCEE = function () {
                return {
                    'height': (newValue.h - 335) + 'px'
                };
            };
            scope.heightCEO = function () {
                return {
                    'height': (newValue.h - 350) + 'px'
                };
            };
            scope.heightCCI = function () {
                return {
                    'height': (newValue.h - 339) + 'px'
                };
            };
            scope.heightCFE = function () {
                return {
                    'height': (newValue.h - 365) + 'px'
                };
            };
            scope.heightCGO = function () {
                return {
                    'height': (newValue.h - 370) + 'px'
                };
            };
            scope.heightCHO = function () {
                return {
                    'height': (newValue.h - 380) + 'px'
                };
            };
            scope.heightCHE = function () {
                return {
                    'height': (newValue.h - 385) + 'px'
                };
            };
            scope.heightDOO = function () {
                return {
                    'height': (newValue.h - 400) + 'px'
                };
            };
            scope.heightDCO = function () {
                return {
                    'height': (newValue.h - 430) + 'px'
                };
            };
           

            scope.heightDEO = function () {
                return {
                    'height': (newValue.h - 450) + 'px'
                };
            };
            scope.heightDHO = function () {
                return {
                    'height': (newValue.h - 480) + 'px'
                };
            };
          
            scope.heightEOO = function () {
                return {
                    'height': (newValue.h - 500) + 'px'
                };
            };
            scope.heightEBO = function () {
                return {
                    'height': (newValue.h - 520) + 'px'
                };
            };
            scope.heightEBB = function () {
                return {
                    'height': (newValue.h - 522) + 'px'
                };
            };

           

            scope.heightFDE = function () {
                return {
                    'height': (newValue.h - 560) + 'px'
                };
            };
            scope.heightFFH = function () {
                return {
                    'height': (newValue.h - 568) + 'px'
                };
            };
            scope.heightGFF = function () {
                return {
                    'height': (newValue.h - 766) + 'px'
                };
            };



        }, true);
        w.bind('resize', function () {
            scope.$apply();
        });
    };
}]);
eHnoteWebApp.directive('multiselectdropdown', ['$timeout', function (timeout) {
    return {
        link: function (scope, element, attrs) {
            timeout(function () {
                element.multiselect({
                    buttonWidth: 'auto',
                    inheritClass: true,
                    includeSelectAllOption: true,
                    disableIfEmpty: true,
                    nonSelectedText: 'Any',
                    allSelectedText: 'All Selected',
                    selectAllText: 'Check all!',
                    enableFiltering: true,
                    enableCaseInsensitiveFiltering: true,
                    filterPlaceholder: 'Type To Search',
                    buttonContainer: '<div class="btn-group" />',
                    maxHeight: true,
                    enableClickableOptGroups: true,
                    height: 200,
                    onDropdownHidden: function (event) {
                        //alert(attrs.blurevent + '(' + attrs.ngModel + ')');
                        //eval(attrs.blurevent + '(' + attrs.ngModel + ')')
                    }
                });
            }, 1000);
            // Watch for any changes to the length of our select element
            //scope.$watch(function () {
            //    element.multiselect('select', scope.ngModel);
            //    return element[0].length;
            //}, function () {
            //    scope.$applyAsync(element.multiselect('rebuild'));
            //    element.multiselect('select', scope.ngModel);
            //});
            //scope.$watch(attrs.ngModel, function () {
            //    element.multiselect('refresh');
            //});
        }
    };
}]);

eHnoteWebApp.directive("inevntoryPatientSearch", ["eHnoteMasterDataService", "InventoryService", "alertify", "eHnotePatientDataService", "$location", "eHnoteProcedureDataService", "OpticalService", "$filter", "datapersistanceFactory", "eHnoteSettingsDataService", "$uibModal", "eHnoteDbStaticDataService", "eHnoteOrgReferralDataServices", function (eHnoteMasterDataService, InventoryService, alertify, eHnotePatientDataService, $location, eHnoteProcedureDataService, OpticalService, $filter, datapersistanceFactory, eHnoteSettingsDataService, $uibModal, eHnoteDbStaticDataService, eHnoteOrgReferralDataServices) {
    return {
        "templateUrl": "templates/Inevntory/PatientSearch.html",

        "link": function ($scope, element, attrs) {
            var object = {};
            $scope.InvDoctorsList = [];
            $scope.InvDoctorsPharmacyList = [];
            $scope.Sale.selectedPatient = "";
            $scope.PatientType = $scope.Sale.PatientType;
            $scope.showNewPatientRegPopUP = false;
            $scope.SaveGST = "Add";
            var doctorinfo = eHnoteMasterDataService.getUserInfo();
            var parenthospid;
            var hospid;
            var ScreenType = null;
            $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin31daysArray();
            $scope.IsPatientSelected = false;
            $scope.NullValues = "N/A";
            //$scope.Patient = { "SelectedPatientWithName": null, "SelectedPatientWithMobile": null, "SelectedPatientWithId": null };

            if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
                hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                parenthospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            }
            $scope.isObjectEmpty = function (card) {
                return Object.keys(card).length === 0;
            };

            $scope.RadioSearchtype = "1";
            $scope.RadioSearchShow = false;


            $scope.RadioSearch = function () {


                $scope.Patient.SelectedPatientWithName = "";
                $scope.Patient.SelectedPatientWithId = "";
                $scope.Patient.SelectedPatientWithMobile = "";
                $scope.Patient.PatientGSTNo = "";
                $scope.Patient.selectedPatient.fullname = "";
                $scope.Patient.selectedPatient.PatientId = "";
                $scope.Patient.selectedPatient.PatientDisplayId = "";
                $scope.Patient.selectedPatient.MobileNo = "";
                $scope.Patient.selectedPatient.AgeInYears = "";
                $scope.Patient.selectedPatient.AgeInMonths = "";
                $scope.Patient.selectedPatient.Sex = "";
                $scope.Sale.PatientId = "";
                $scope.Sale.AppointmentList = [];
                $scope.IskitPrescription = 1;
                $scope.RadioSearchShow = false;

            };




            $scope.ChangePatient = function (obj, type) {
                if (!angular.isObject(obj) && type === "Name") {
                    $scope.Patient.SelectedPatientWithMobile = null;
                    $scope.Patient.SelectedPatientWithId = null;
                    $scope.Sale.selectedPatient = "";
                    $scope.Sale.PatientId = "";
                }
                if (!angular.isObject(obj) && type === "Mobile") {
                    $scope.Patient.SelectedPatientWithName = null;
                    $scope.Patient.SelectedPatientWithId = null;
                    $scope.Sale.selectedPatient = "";
                    $scope.Sale.PatientId = "";
                }
                if (!angular.isObject(obj) && type === "PatientId") {
                    $scope.Patient.SelectedPatientWithName = null;
                    $scope.Patient.SelectedPatientWithMobile = null;
                    $scope.Sale.selectedPatient = "";
                    $scope.Sale.PatientId = "";
                }
                $scope.Patient.ReferralSouceMaster = "";
                $scope.Patient.Referral = "";
                $scope.Patient.ReferralNumber = null;
                $scope.Patient.Title = "";
                $scope.Patient.selectedPatient.fullname = "";
                $scope.Patient.selectedPatient.PatientDisplayId = "";
                $scope.Patient.selectedPatient.MobileNo = "";
                $scope.Patient.selectedPatient.AgeInYears = "";
                $scope.Patient.selectedPatient.AgeInMonths = "";
                $scope.Patient.selectedPatient.Sex = "";
                $scope.RadioSearchShow = false;

                $scope.Sale.PatientId = "";
                $scope.Sale.AppointmentList = [];
                $scope.IskitPrescription = 1;
            };

            $scope.SearchPatientAutoComplete = function (val, type) {







                if (type === "Name") {
                    object = {
                        "ParentOrganizationId": parenthospid,
                        "Name": val,
                        "Mobile": null,
                        "PatientId": null,
                        "PageSize": 10,
                        "PageNo": 1
                    };
                }
                if (type === "Mobile") {
                    object = {
                        "ParentOrganizationId": parenthospid,
                        "Name": null,
                        "Mobile": val,
                        "PatientId": null,
                        "PageSize": 10,
                        "PageNo": 1
                    };
                }
                if (type === "PatientId") {
                    object = {
                        "ParentOrganizationId": parenthospid,
                        "Name": null,
                        "Mobile": null,
                        "PatientId": val,
                        "PageSize": 10,
                        "PageNo": 1
                    };
                }

                return InventoryService.SearchInvPatient(object).then(function (resp) {
                    if (resp.data.data.length !== 0) {
                        return resp.data.data.map(function (item) {
                            if (item.MobileNo === 0) {
                                item.MobileNo = "";
                            }
                            return item;
                        });
                    } else {
                        $scope.isregisterBtnShowHide = true;
                    }
                }, function (err) { console.log(err); alertify.error("Search Patient Failed"); });
            };
            $scope.onPatientSelect = function (selectedPatient, type) {
                if (type === "Name") {
                    $scope.Patient.SelectedPatientWithMobile = angular.copy(selectedPatient);
                    $scope.Patient.SelectedPatientWithId = angular.copy(selectedPatient);
                    $scope.RadioSearchShow = true;
                }
                if (type === "Mobile") {
                    $scope.Patient.SelectedPatientWithName = angular.copy(selectedPatient);
                    $scope.Patient.SelectedPatientWithId = angular.copy(selectedPatient);
                    $scope.RadioSearchShow = true;
                }
                if (type === "PatientId") {
                    $scope.Patient.SelectedPatientWithName = angular.copy(selectedPatient);
                    $scope.Patient.SelectedPatientWithMobile = angular.copy(selectedPatient);
                    $scope.RadioSearchShow = true;

                }


                $scope.Patient.selectedPatient = angular.copy(selectedPatient);

                //$scope.Sale.patientMobile = angular.copy(selectedPatient.MobileNo);
                //$scope.Sale.PatientDisplayId = selectedPatient.PatientDisplayId;
                $scope.Sale.PatientId = selectedPatient.PatientId;
                //$scope.Sale.PatientGSTNo = selectedPatient.GSTNo ? selectedPatient.GSTNo : "";


                $scope.Patient.PatientGSTNo = selectedPatient.GSTNo ? selectedPatient.GSTNo : "";

                $scope.Patient.ReferralSouceMaster = selectedPatient.MasterReferralSource;
                $scope.Patient.Referral = selectedPatient.ReferralSource;
                $scope.Patient.ReferralNumber = null;
                $scope.mobile = "";
                $scope.conactNo = "";
                $scope.mobile = selectedPatient.ReferralMobileNo;
                if ($scope.mobile != 0 && $scope.mobile != null) {
                    $scope.Patient.ReferralNumber = $scope.mobile;
                }
                $scope.conactNo = selectedPatient.ReferralContactNo;
                if ($scope.conactNo != 0 && $scope.conactNo != null) {
                    $scope.Patient.ReferralNumber = $scope.conactNo;
                }
                $scope.Patient.Title = selectedPatient.Title;

                if ($scope.Patient.PatientGSTNo === "") {
                    $scope.SaveGST = "Add";
                } else {
                    $scope.SaveGST = "Update";
                }
                if ($scope.Sale.ScreenType === "EyeCheckUp") {
                    $scope.GetOpticalGlass(selectedPatient);
                }
                $scope.GetAppointments();
            };
            $scope.GetOpticalGlass = function (selectedPatient) {
                OpticalService.GetOpticalGlassInfo(selectedPatient.PatientId).then(function (resp) {
                    $scope.OpticalGlassList = {};
                    if (resp.data.Status === 2) {
                        alertify.error(resp.data.Message);
                        return;
                    }

                }, function (err) {
                    alertify.error("Getting Glasses Failed");
                    console.log(err);
                });
            };
            $scope.GetInvDoctors = function () {
                InventoryService.GetInvDoctors(parenthospid).then(function (resp) {
                    if (resp.data.Status !== 1) {
                        alertify.error(resp.data.Message);
                        return;
                    }
                    $scope.InvDoctorsList = resp.data.data;
                    if ($scope.Sale.IsSaleEdit) {
                        if ($scope.Sale.DoctorId === 0) {
                            //$scope.Sale.SelectedDoctor = { "DoctorId": 0, "DoctorName": "--Select--" };
                        } else {
                            //$scope.Sale.SelectedDoctor = $filter("filter")($scope.InvDoctorsList, { "UserId": $scope.Sale.DoctorId }, true)[0];
                        }
                    } else {
                        //$scope.Sale.SelectedDoctor = { "DoctorId": 0, "DoctorName": "--Select--" };
                    }
                }, function (err) {
                    console.log(err);
                    $scope.InvDoctorsList = [];
                    alertify.error("Get Doctors Failed");
                });
            };
            $scope.GetInvDoctorsPharmacy = function () {
                InventoryService.GetInvDoctorsPharmacy(parenthospid).then(function (resp) {
                    if (resp.data.Status !== 1) {
                        alertify.error(resp.data.Message);
                        return;
                    }
                    $scope.InvDoctorsPharmacyList = resp.data.data;
                    if ($scope.Sale.IsSaleEdit) {
                        if ($scope.Sale.DoctorId === 0) {
                            //$scope.Sale.SelectedDoctor = { "DoctorId": 0, "DoctorName": "--Select--" };
                        } else {
                            //$scope.Sale.SelectedDoctor = $filter("filter")($scope.InvDoctorsList, { "UserId": $scope.Sale.DoctorId }, true)[0];
                        }
                    } else {
                        //$scope.Sale.SelectedDoctor = { "DoctorId": 0, "DoctorName": "--Select--" };
                    }
                }, function (err) {
                    console.log(err);
                    $scope.InvDoctorsPharmacyList = [];
                    alertify.error("Get Doctors Failed");
                });
            };
            $scope.ChangeDoctor = function (SelectedDoctor) {
                $scope.Sale.DoctorId = null;
                $scope.Sale.DoctorName = SelectedDoctor;
            };
            $scope.ChangePDoctor = function (SelectedDoctor, item) {
                //console.log(item);
                $scope.Sale.DoctorId = item.SelectedDoctor.UserId || null;
                $scope.Sale.DoctorName = SelectedDoctor;
                $scope.Sale.MedRegNo = item.MedRegNo || null;
            };
            $scope.OnSelectedDoctor = function (SelectedDoctor) {
                SelectedDoctor = SelectedDoctor || null;
                if (SelectedDoctor !== null) {
                    $scope.Sale.DoctorId = SelectedDoctor.UserId;
                    $scope.Sale.DoctorName = SelectedDoctor.DoctorName;
                    $scope.Sale.MedRegNo = SelectedDoctor.MedRegNo || null;
                } else {
                    $scope.Sale.DoctorId = null;
                    $scope.Sale.DoctorName = null;
                }
            };

            $scope.GetInvDoctors();
            $scope.GetInvDoctorsPharmacy();

            function clearPatientDetails() {
                $scope.patientMobile = '';
                $scope.PatientId = 0;
                $scope.PatientDisplayId = '';
                $scope.patientMobile = '';

                $scope.Patient = {
                    "SelectedPatientWithName": "",
                    "SelectedPatientWithId": "",
                    "SelectedPatientWithId": "",
                    "SelectedPatientWithMobile": "",
                    "selectedPatient": {
                        "fullname": "",
                        "PatientDisplayId": "",
                        "MobileNo": "",
                        "AgeInYears": "",
                        "AgeInMonths": "",
                        "Sex": ""
                    }
                };
                $scope.appointmentList = [];
                $scope.DoctorName = '';
            }
            $scope.SearchCustomerByText = function () {
                clearPatientDetails();
                var name = $scope.Sale.selectedPatient || "";
                if (name === "") {
                    $scope.Sale.patientMobile = "";
                    $scope.Sale.PatientDisplayId = "";
                    $scope.Sale.PatientGSTNo = "";
                    $scope.SaveGST = "Add";
                }
                if (name && name.length >= 3) {
                    object = {
                        "ParentOrganizationId": parenthospid,
                        "PatSearchText": name,
                        "MobSearchText": null,
                        "IdSearchText": null,
                        "PageSize": 500,
                        "PageNo": 1
                    };
                    return InventoryService.SearchInvPatient(object).then(function (resp) {
                        if (resp.data.data.length !== 0) {
                            return resp.data.data.map(function (item) {
                                if (item.MobileNo === 0) {
                                    item.MobileNo = "";
                                }
                                return item;
                            });
                        } else {
                            $scope.isregisterBtnShowHide = true;
                        }
                    }, function (err) { console.log(err); alertify.error("Search Patient Failed"); });
                } else {
                    $scope.isregisterBtnShowHide = false;
                }
            };
            $scope.registerLinkinventory = function (name) {
                var patientinfo = eHnoteMasterDataService.getNewPatientInfo();
                patientinfo.hasphone = false;
                patientinfo.patType = true;
                patientinfo.firstname = name;
                patientinfo.doctorid = eHnoteMasterDataService.getLoginId();
                patientinfo.pageType = 'inventory';
                eHnoteMasterDataService.Addpatientvalconsult('Start Consultation');
                eHnoteMasterDataService.addNewPatientInfo(patientinfo);
                eHnoteMasterDataService.addAddPatientwithoutConsult(false);
                $scope.selectedPatientObj.PatientName = '';
                var url = "/registerPatient";
                $location.url(url);
            };
            $scope.SearchPatient = function (Searchval, patientMobile, PatientDisplayId) {
                Searchval = Searchval || null;
                patientMobile = patientMobile || null;
                PatientDisplayId = PatientDisplayId || null;
                if (patientMobile === null && PatientDisplayId === null) {
                    alertify.error("Enter Mobile/PatientId");
                    return;
                }
                if (Searchval !== null) {
                    if (Searchval.length <= 2) {
                        alertify.error("Name Required Min 3 Letters");
                        return;
                    }
                }
                if (patientMobile !== null) {
                    if (patientMobile.toString().length !== 10) {
                        alertify.error("Mobile  Required 10 digits");
                        return;
                    }
                }
                object = {
                    "ParentOrganizationId": parenthospid,
                    "PatSearchText": Searchval,
                    "MobSearchText": patientMobile,
                    "IdSearchText": PatientDisplayId,
                    "PageSize": 500,
                    "PageNo": 1
                };
                InventoryService.SearchInvPatient(object).then(function (resp) {
                    if (resp.data.Status !== 1) {
                        alertify.error(resp.data.Message);
                        return;
                    }
                    if (resp.data.data.length !== 0) {
                        $scope.Sale.patientMobile = resp.data.data[0].MobileNo;
                        $scope.Sale.PatientDisplayId = resp.data.data[0].PatientDisplayId;
                        $scope.Sale.PatientId = resp.data.data[0].PatientId;
                        $scope.Patient.selectedPatient = {};
                        $scope.Patient.selectedPatient.MobileNo = resp.data.data[0].MobileNo;
                        $scope.Patient.selectedPatient.fullname = resp.data.data[0].firstname;
                        $scope.Patient.selectedPatient.PatientId = resp.data.data[0].PatientId;
                        $scope.Patient.selectedPatient.PatientDisplayId = resp.data.data[0].PatientDisplayId;
                        $scope.Patient.selectedPatient.Age = resp.data.data[0].Age;
                        $scope.Patient.selectedPatient.Sex = resp.data.data[0].Sex;
                        $scope.Patient.selectedPatient.EmailId = resp.data.data[0].EmailId;
                        //$scope.Patient.selectedPatient.GSTNo = resp.data.data[0].GSTNO;
                        $scope.Patient.PatientGSTNo = resp.data.data[0].GSTNO || "";



                    } else {
                        alertify.alert("No Patient Found");
                    }
                }, function (err) {
                    console.log(err);
                    alertify.error("Search Patient Failed");
                });
            };
            $scope.ClearPatient = function () {
                $scope.Patient.SelectedPatientWithName = null;
                $scope.Patient.SelectedPatientWithMobile = null;
                $scope.Patient.SelectedPatientWithId = null;
                $scope.Patient.PatientGSTNo = null;
                $scope.Patient = {
                    "SelectedPatientWithName": "",
                    "SelectedPatientWithId": "",
                    "SelectedPatientWithId": "",
                    "SelectedPatientWithMobile": "",
                    "selectedPatient": {
                        "fullname": "",
                        "PatientDisplayId": "",
                        "MobileNo": "",
                        "AgeInYears": "",
                        "AgeInMonths": "",
                        "Sex": ""
                    }
                };
                $scope.Searchval = "";
                $scope.Sale.patientMobile = "";
                $scope.Sale.PatientId = 0;
                $scope.Sale.PatientDisplayId = "";
                $scope.Patient.selectedPatient = "";
                $scope.Sale.AppointmentList = [];
                $scope.Sale.SelectedDoctor = {};
                $scope.Sale.SelectedDoctor.DoctorName = "";
                $scope.Sale.DoctorId = 0;
                $scope.Sale.PatientGSTNo = "";
                //  $scope.PharmaKitsList = [];
                $scope.IskitPrescription = 1;
                $scope.Patient.ReferralSouceMaster = "";
                $scope.Patient.Referral = "";
                $scope.Patient.ReferralNumber = null;
                $scope.RadioSearchShow = null;
            };
            $scope.SalePatgetDate = function (Tmpfromdate) {
                var todate = new Date();
                var age = [];
                var fromdate = new Date(Tmpfromdate);
                var y = [todate.getFullYear(), fromdate.getFullYear()];
                var ydiff = y[0] - y[1];
                var m = [todate.getMonth(), fromdate.getMonth()];
                var mdiff = m[0] - m[1];
                var d = [todate.getDate(), fromdate.getDate()];
                var ddiff = d[0] - d[1];
                if (mdiff < 0 || (mdiff === 0 && ddiff < 0)) --ydiff;
                if (mdiff < 0) mdiff += 12;
                if (ddiff < 0) {
                    fromdate.setMonth(m[1] + 1, 0);
                    ddiff = fromdate.getDate() - d[1] + d[0];
                    --mdiff;
                }
                if (ydiff > 0) age.push(ydiff + ' year' + (ydiff > 1 ? 's ' : ' '));
                if (mdiff > 0) age.push(mdiff + ' month' + (mdiff > 1 ? 's' : ''));
                if (ddiff > 0) age.push(ddiff + ' day' + (ddiff > 1 ? 's' : ''));
                if (age.length > 1) age.splice(age.length - 1, 0, ' and ');
                $scope.ageinYears = ydiff.toString();
                $scope.ageinMonths = mdiff.toString();
                $scope.ageinDays = ddiff.toString();
                if ($scope.ageinMonths === "-1") {
                    $scope.ageinMonths = "";
                }
                var curAge = $scope.ageinYears + '.' + $scope.ageinMonths;
                $scope.SalePatient.CurrentAge = curAge;
            };
            $scope.setAgeandMonth = function (ageinYears, ageinMonths, ageinDays) {
                var curAge = ageinYears + "." + ageinMonths;
                $scope.SalePatient.CurrentAge = curAge;
                var dob = $scope.getDateOfBirth(ageinYears, ageinMonths, ageinDays);
                $scope.SalePatient.dob = moment(dob).format("DD-MMM-YYYY");
                daysInMonth(ageinMonths, ageinDays);
            };



            $scope.getDateOfBirth = function (year, month, day) {
                year = parseInt(year) || 0;
                month = parseInt(month) || 0;
                day = parseInt(day) || 0;
                var today = new Date();
                var todayYear = today.getFullYear();
                var todaymonth = today.getMonth() + 1;
                var dateNow = today.getDate();
                var dobyear = todayYear - year;
                if (todaymonth > month) {
                    var dobmonth = todaymonth - month;
                }
                if (todaymonth <= month) {
                    dobyear = dobyear - 1;
                    dobmonth = todaymonth - month;
                    dobmonth = 12 + dobmonth;
                }
                if (dateNow >= day)
                    var dateAge = dateNow - day;
                else {
                    dobmonth--;
                    dateAge = 30 + dateNow - day;

                    if (dobmonth < 0) {
                        dobmonth = 11;
                        dobyear--;
                    }
                }
                dobmonth = dobmonth < 10 ? "0" + dobmonth : dobmonth;
                dateAge = dateAge < 10 ? "0" + dateAge : dateAge;
                if (dateAge === "00") {
                    dateAge = "01";

                }
                return dobmonth + "/" + dateAge + "/" + dobyear;

            };


            $scope.SalePatient = {
                "firstname": "",
                "Titile": "Mr",
                "dob": "",
                "PhNumber": "",
                "GST": "",
                "gender": "Male",
                "Location": "",
                "Email": "",
                "lastname": "",
                "TitleId": "",
                "Selectedtitle": "",
                "referralSource": "",
                "ReferralSource": "",
                "othDetailreferralsourceName": "",
                "ReferralMobileNo": "",
                "ReferralContactNo": "",
                "ReferralPhoneType": "Mobile"
            };

            eHnoteDbStaticDataService.GetAllTitlesByParentId(parenthospid).then(function (resp) {
                $scope.TitlesList = resp.data;
                $scope.SalePatient.Selectedtitle = $scope.TitlesList[0];
                $scope.SelectedTitle = $scope.TitlesList[0];
            }, function (err) {
                console.log(err);
                alertify.error("Getting Titles Failed");
            });
            var modalInstance;
            $scope.AddNewpatient = function () {
                //$scope.SalePatient.firstname = $scope.Patient.SelectedPatientWithName;
                modalInstance = $uibModal.open({
                    "templateUrl": "showNewPatientRegPopUP.html",
                    "size": "lg",
                    "backdrop": "static",
                    "scope": $scope,
                    "keyboard": false
                });
                modalInstance.result.then(function () {
                }, function (cancel) {

                });
            };

            $scope.cancel = function () {
                modalInstance.dismiss("cancel");
            };

            $scope.CancelPopup = function () {
                $scope.SalePatient.PhNumber = "";
                $scope.SalePatient.firstname = "";
                $scope.SalePatient.Titile = "Mr";
                $scope.SalePatient.dob = "";
                $scope.SalePatient.CurrentAge = "";
                $scope.SalePatient.Location = "";
                $scope.SalePatient.gender = "Male";
                $scope.SalePatient.Email = "";
                $scope.SalePatient.GST = "";
                $scope.ageinYears = "";
                $scope.ageinMonths = "";
                $scope.SalePatient.lastname = "";
                $scope.SalePatient.referralSource = "";
                $scope.SalePatient.ReferralSource = "";
                $scope.SalePatient.othDetailreferralsourceName = "";
                $scope.SalePatient.ReferralMobileNo = "";
                $scope.SalePatient.ReferralContactNo = "";
                $scope.SalePatient.ReferralPhoneType = "Mobile";
                $scope.dynamicPopover2.isRefferalPopOverOpen2 = false;
                modalInstance.dismiss("cancel");
            };

            $scope.GetInvAreaSearch = function (text) {
                text = text || "";
                return eHnoteSettingsDataService.GetAreaSearch(text).then(function (response) {
                    if (response.data !== undefined) {
                        return response.data;
                    }
                });
            };
            $scope.onInvAreaChange = function (item) {
                $scope.SalePatient.Location = item.Area;
            };

            $scope.ChangePatientGenderByTitle = function (item) {
                if (item === "Mr" || item === "Master") {
                    $scope.SalePatient.gender = 'Male';
                }
                else if (item === "Mrs" || item === "Miss" || item === "Baby" || item === "Ms") {
                    $scope.SalePatient.gender = 'Female';
                }
                else {
                    $scope.SalePatient.gender = "";
                }
            };

            $scope.RegisterPatient = function () {
                console.log(JSON.stringify($scope.SalePatient));
                $scope.SalePatient.Titile = $scope.SalePatient.Selectedtitle.Name;
                $scope.SalePatient.TitleId = $scope.SalePatient.Selectedtitle.Id;
                if ($scope.SalePatient.dob === "" && $scope.ageinYears === "" && $scope.ageinMonths === "") {
                    alertify.error("DOB / Age Is Mandatory");
                    return false;
                }
                else if ($scope.SalePatient.dob !== "") {

                    var todat = $filter("date")(new Date(), "dd-MMM-yyyy");
                    if ($scope.SalePatient.dob === todat) {
                        alertify.error("Future Dates Not Allowed");
                        return false;
                    }
                }

                if (doctorinfo.doctordata.UserAddress[0].SubOrganizationId !== 43) {
                    if ($scope.SalePatient.PhNumber === "") {
                        alertify.error("Mobile Number is manadatory");
                        return false;
                    }
                }

                var PatientSource = "";
                if ($scope.ScreenType === "InvSale") {
                    PatientSource = "P";
                }
                if ($scope.ScreenType === "OptSale") {
                    PatientSource = "O";
                }


                var param = {
                    "Name": $scope.SalePatient.firstname,
                    "Title": $scope.SalePatient.Titile,
                    "UserId": eHnoteMasterDataService.getLoginId(),
                    "DOB": $scope.SalePatient.dob,
                    "Age": $scope.SalePatient.CurrentAge,
                    "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "Mobile": $scope.SalePatient.PhNumber,
                    "Gender": $scope.SalePatient.gender,
                    "GST": $scope.SalePatient.GST,
                    "PatientSource": PatientSource,
                    "Location": $scope.SalePatient.Location,
                    "Email": $scope.SalePatient.Email,
                    "LastName": $scope.SalePatient.lastname,
                    "TitleId": $scope.SalePatient.TitleId,
                    "ReferralID": $scope.SalePatient.ReferralSource.ReferralID,
                    "ReferralMobileNo": $scope.SalePatient.ReferralMobileNo != "" ? $scope.SalePatient.ReferralMobileNo : null,
                    "ReferralContactNo": $scope.SalePatient.ReferralContactNo != "" ? $scope.SalePatient.ReferralContactNo : null
                };
                console.log(JSON.stringify(param));
                eHnotePatientDataService.SaleRegisterPatient(param, OnPatientSuccess, OnPatientError);
                function OnPatientSuccess(resp) {

                    if (resp.data.MobileNo === 0 || resp.data.MobileNo === null) {
                        resp.data.MobileNo = "";
                    }
                    $scope.Sale.patientMobile = resp.data.MobileNo;
                    $scope.Sale.PatientDisplayId = resp.data.PatientDisplayId;
                    $scope.Sale.PatientId = resp.data.patientid;

                    $scope.Patient.PatientGSTNo = resp.data.GSTNO;
                    if ($scope.Patient.PatientGSTNo !== "") {
                        $scope.SaveGST = 'Update';
                    }
                    $scope.Patient.selectedPatient = {};
                    $scope.Patient.selectedPatient.MobileNo = resp.data.MobileNo;
                    $scope.Patient.selectedPatient.fullname = resp.data.FullName;
                    $scope.Patient.selectedPatient.PatientId = resp.data.patientid;
                    $scope.Patient.selectedPatient.PatientDisplayId = resp.data.PatientDisplayId;
                    $scope.Patient.selectedPatient.Age = resp.data.age;
                    $scope.Patient.selectedPatient.AgeInYears = resp.data.AgeInYears;
                    $scope.Patient.selectedPatient.AgeInMonths = resp.data.AgeInMonths;
                    $scope.Patient.selectedPatient.AgeInDays = resp.data.AgeInDays;
                    $scope.Patient.selectedPatient.Sex = resp.data.Sex;
                    $scope.Patient.selectedPatient.EmailId = resp.data.Email;

                    //$scope.Patient.selectedPatient.GSTNo = resp.data.GSTNO;


                    $scope.Patient.SelectedPatientWithName = {
                        "PatientId": resp.data.patientid,
                        "firstname": resp.data.FirstName,
                        "PatientDisplayId": resp.data.PatientDisplayId,
                        "MobileNo": resp.data.MobileNo,
                        "Age": resp.data.age,
                        "Sex": resp.data.Sex,
                        "EmailId": resp.data.Email || null,
                        "GSTNo": resp.data.GSTNO,
                        "fullname": resp.data.FullName
                    };
                    $scope.Patient.SelectedPatientWithMobile = resp.data.MobileNo;

                    $scope.Patient.ReferralSouceMaster = resp.data.MasterReferralSource;
                    $scope.Patient.Referral = resp.data.ReferralSource;
                    $scope.Patient.ReferralNumber = null;
                    $scope.mobile = "";
                    $scope.conactNo = "";
                    $scope.mobile = resp.data.ReferralMobileNo;
                    if ($scope.mobile != "" && $scope.mobile != null) {
                        $scope.Patient.ReferralNumber = $scope.mobile;
                    }
                    $scope.conactNo = resp.data.ReferralContactNo;
                    if ($scope.conactNo != "" && $scope.conactNo != null) {
                        $scope.Patient.ReferralNumber = $scope.conactNo;
                    }
                    $scope.Patient.Title = resp.data.Title;


                    $scope.CancelPopup();
                }
                function OnPatientError(err) {
                    console.log(err);
                    alertify.error("Register Patient Failed");
                }
                $scope.RadioSearchShow = true;
            };
            $scope.GetAppointments = function () {
                $scope.Sale.AppointmentList = [];

                if ($scope.Sale.ScreenType === "OptSale") {
                    ScreenType = "Glass";
                }
                if ($scope.Sale.ScreenType === "InvSale") {
                    ScreenType = "Prescription";
                }

                object = { "PatientId": $scope.Sale.PatientId, "Type": ScreenType };
                eHnoteProcedureDataService.GetAppointmnetsByPatientId(object).then(function (response) {
                    $scope.Sale.AppointmentList = response.data;
                    if ($scope.Sale.AppointmentList.length !== 0) {
                        $scope.Sale.SelectedDoctor = $filter("filter")($scope.InvDoctorsPharmacyList, { "UserId": $scope.Sale.AppointmentList[0].DoctorId }, true)[0];
                        console.log($scope.Sale.SelectedDoctor);
                    } else {
                        $scope.Sale.SelectedDoctor = "";
                    }
                    angular.forEach($scope.Sale.AppointmentList, function (item, index) {
                        item.AppointmentDate = $filter("date")(item.AppointmentDate, "dd-MM-yyyy");
                        item.Prescriptions = [];
                        if (item.IsConverted) {
                            item.AppointmentDate = item.AppointmentDate + "(Sold)";
                        }
                    });
                }, function (err) {
                    console.log(err);
                    $scope.Sale.AppointmentList = [];
                    alertify.error("Getting Appointments Failed");
                });
            };
            $scope.ChangeApptDate = function (SelectedAppointmentId) {
                SelectedAppointmentId = SelectedAppointmentId || null;
                if ($scope.Sale.ScreenType === "OptSale") {
                    ScreenType = "Glass";
                    if ($scope.Sale.AppointmentList.length !== 0) {
                        $scope.Sale.SelectedDoctor = $filter("filter")($scope.InvDoctorsPharmacyList, { "UserId": $scope.Sale.AppointmentList[0].DoctorId }, true)[0];
                        console.log($scope.Sale.SelectedDoctor);
                    } else {
                        $scope.Sale.SelectedDoctor = "";
                    }
                    if (SelectedAppointmentId === null) {
                        $scope.GlassObject = {};
                        $scope.Sale.NewOrOldGlass = "";
                        $scope.Product.EyeCheckUpObject = angular.copy($scope.GetVisionDataObject());
                        return;
                    }
                }
                if ($scope.Sale.ScreenType === "InvSale") {
                    ScreenType = "Prescription";
                }
                if (SelectedAppointmentId === null) {
                    return;
                }

                var IsExist = $filter("filter")($scope.Sale.AppointmentList, function (iterator, ind) { return iterator.AppointmentId === SelectedAppointmentId && iterator.IsConverted; }) || [];
                if (IsExist.length > 0) {
                    return;
                }

                object = { "AppointmentId": parseFloat(SelectedAppointmentId), "Type": ScreenType, "OrganizationId": null };
                eHnoteProcedureDataService.GetGlassAndPresByAptId(object).then(function (resp) {

                    resp.data.InvestiGations = resp.data.InvestiGations || [];

                    if ($scope.Sale.ScreenType === "OptSale") {
                        if (resp.data.InvestiGations.length !== 0) {
                            $scope.GlassObject = $filter("filter")(resp.data.InvestiGations, { "CategoryID": 7 }, true);
                            //if ($scope.GlassObject.length > 0) {
                            //    $scope.GlassObject = $scope.GlassObject[0];
                            //    $scope.GlassObject = $scope.CheckNewOrOldGlass($scope.GlassObject.CategoryConditions);
                            //    $scope.Product.EyeCheckUpObject.Lens.Attributes.RUVa = $scope.GlassObject.Attributes.RUVa || "";
                            //    $scope.Product.EyeCheckUpObject.Lens.Attributes.RSphere = $scope.GlassObject.Attributes.RSphere || "";
                            //    $scope.Product.EyeCheckUpObject.Lens.Attributes.RCylinder = $scope.GlassObject.Attributes.RCylinder || "";
                            //    $scope.Product.EyeCheckUpObject.Lens.Attributes.RAxis = $scope.GlassObject.Attributes.RAxis || "";
                            //    $scope.Product.EyeCheckUpObject.Lens.Attributes.RPrism = $scope.GlassObject.Attributes.RPrism || "";
                            //    $scope.Product.EyeCheckUpObject.Lens.Attributes.RBase = $scope.GlassObject.Attributes.RBase || "";
                            //    $scope.Product.EyeCheckUpObject.Lens.Attributes.RAdd = $scope.GlassObject.Attributes.RAdd || "";
                            //    $scope.Product.EyeCheckUpObject.Lens.Attributes.RVa = $scope.GlassObject.Attributes.RVa || "";
                            //    $scope.Product.EyeCheckUpObject.Lens.Attributes.RBcva = $scope.GlassObject.Attributes.RBcva || "";
                            //    $scope.Product.EyeCheckUpObject.Lens.Attributes.RIPD = $scope.GlassObject.Attributes.RIPD || "";
                            //    $scope.Product.EyeCheckUpObject.Lens.Attributes.LUVa = $scope.GlassObject.Attributes.LUVa || "";
                            //    $scope.Product.EyeCheckUpObject.Lens.Attributes.LSphere = $scope.GlassObject.Attributes.LSphere || "";
                            //    $scope.Product.EyeCheckUpObject.Lens.Attributes.LCylinder = $scope.GlassObject.Attributes.LCylinder || "";
                            //    $scope.Product.EyeCheckUpObject.Lens.Attributes.LAxis = $scope.GlassObject.Attributes.LAxis || "";
                            //    $scope.Product.EyeCheckUpObject.Lens.Attributes.LPrism = $scope.GlassObject.Attributes.LPrism || "";
                            //    $scope.Product.EyeCheckUpObject.Lens.Attributes.LBase = $scope.GlassObject.Attributes.LBase || "";
                            //    $scope.Product.EyeCheckUpObject.Lens.Attributes.LAdd = $scope.GlassObject.Attributes.LAdd || "";
                            //    $scope.Product.EyeCheckUpObject.Lens.Attributes.LVa = $scope.GlassObject.Attributes.LVa || "";
                            //    $scope.Product.EyeCheckUpObject.Lens.Attributes.LBcva = $scope.GlassObject.Attributes.LBcva || "";
                            //    $scope.Product.EyeCheckUpObject.Lens.Attributes.LIPD = $scope.GlassObject.Attributes.LIPD || "";

                            //    $scope.Product.EyeCheckUpObject.Lens.LensType = $scope.GlassObject.LensType;
                            //    $scope.Product.EyeCheckUpObject.Lens.LensCoating = $scope.GlassObject.LensCoating;

                            //    $scope.Product.EyeCheckUpObject.Lens.FrameMaterial = $scope.GlassObject.FrameMaterial || [];
                            //    $scope.Product.EyeCheckUpObject.Lens.LensMaterial = $scope.GlassObject.LensMaterial || [];
                            //    $scope.Product.EyeCheckUpObject.Lens.LensTint = $scope.GlassObject.LensTint || [];
                            //    $scope.Product.EyeCheckUpObject.Lens.Modeofwear = $scope.GlassObject.Modeofwear || [];
                            //    $scope.Product.EyeCheckUpObject.Lens.SpecialityLens = $scope.GlassObject.SpecialityLens || [];
                            //    $scope.Product.EyeCheckUpObject.Lens.SpecialInstruction = $scope.GlassObject.SpecialInstruction || [];

                            //    $scope.Product.EyeCheckUpObject.Lens.RightEyeRemarks = $scope.GlassObject.Remarks || "";
                            //    $scope.Product.EyeCheckUpObject.Lens.LeftEyeRemarks = $scope.GlassObject.Remarks || "";
                            //    $scope.Sale.NewOrOldGlass = $scope.GlassObject.Type;
                            //    $scope.Product.SelectedQuantityId = 3;
                            //    datapersistanceFactory.set("TempEyeCheckUpObject", $scope.Product.EyeCheckUpObject);
                            //    $scope.Sale.CashAmount = "";
                            //    $scope.Sale.CardAmount = "";
                            //    $scope.Sale.ChequeAmount = "";
                            //    // var DoctorsList = $filter("filter")($scope.InvDoctorsList, { "UserId": resp.data.DoctorId }, true);
                            //    var DoctorsList = $filter("filter")($scope.InvDoctorsPharmacyList, { "UserId": resp.data.DoctorId }, true);
                            //    if (DoctorsList.length > 0) {
                            //        $scope.Sale.SelectedDoctor = DoctorsList[0];
                            //        $scope.Sale.DoctorId = $scope.Sale.SelectedDoctor.UserId;
                            //    }
                            //}
                            if ($scope.GlassObject.length > 0) {
                                $scope.GlassObject = $scope.GlassObject[0];
                                //$scope.GlassObject = $scope.CheckNewOrOldGlass($scope.GlassObject.CategoryConditions);
                                $scope.Product.EyeCheckUpObject.Lens.Attributes.RUVa = $scope.GlassObject.RightEyeValues.UVa || "";
                                $scope.Product.EyeCheckUpObject.Lens.Attributes.RSphere = $scope.GlassObject.RightEyeValues.Spherical || "";
                                $scope.Product.EyeCheckUpObject.Lens.Attributes.RCylinder = $scope.GlassObject.RightEyeValues.Cylindrical || "";
                                $scope.Product.EyeCheckUpObject.Lens.Attributes.RAxis = $scope.GlassObject.RightEyeValues.Axis || "";
                                $scope.Product.EyeCheckUpObject.Lens.Attributes.RPrism = $scope.GlassObject.RightEyeValues.Prism || "";
                                $scope.Product.EyeCheckUpObject.Lens.Attributes.RBase = $scope.GlassObject.RightEyeValues.Base || "";
                                $scope.Product.EyeCheckUpObject.Lens.Attributes.RAdd = $scope.GlassObject.RightEyeValues.Adition || "";
                                $scope.Product.EyeCheckUpObject.Lens.Attributes.RVa = $scope.GlassObject.RightEyeValues.BCVA || "";
                                $scope.Product.EyeCheckUpObject.Lens.Attributes.RBcva = $scope.GlassObject.RightEyeValues.BCNVA || "";
                                $scope.Product.EyeCheckUpObject.Lens.Attributes.RIPD = $scope.GlassObject.RightEyeValues.IPD || "";
                                $scope.Product.EyeCheckUpObject.Lens.Attributes.LUVa = $scope.GlassObject.LeftEyeValues.UVa || "";
                                $scope.Product.EyeCheckUpObject.Lens.Attributes.LSphere = $scope.GlassObject.LeftEyeValues.Spherical || "";
                                $scope.Product.EyeCheckUpObject.Lens.Attributes.LCylinder = $scope.GlassObject.LeftEyeValues.Cylindrical || "";
                                $scope.Product.EyeCheckUpObject.Lens.Attributes.LAxis = $scope.GlassObject.LeftEyeValues.Axis || "";
                                $scope.Product.EyeCheckUpObject.Lens.Attributes.LPrism = $scope.GlassObject.LeftEyeValues.Prism || "";
                                $scope.Product.EyeCheckUpObject.Lens.Attributes.LBase = $scope.GlassObject.LeftEyeValues.Base || "";
                                $scope.Product.EyeCheckUpObject.Lens.Attributes.LAdd = $scope.GlassObject.LeftEyeValues.Adition || "";
                                $scope.Product.EyeCheckUpObject.Lens.Attributes.LVa = $scope.GlassObject.LeftEyeValues.BCVA || "";
                                $scope.Product.EyeCheckUpObject.Lens.Attributes.LBcva = $scope.GlassObject.LeftEyeValues.BCNVA || "";
                                $scope.Product.EyeCheckUpObject.Lens.Attributes.LIPD = $scope.GlassObject.LeftEyeValues.IPD || "";

                                $scope.Product.EyeCheckUpObject.Lens.LensType = $scope.GlassObject.LensType;
                                $scope.Product.EyeCheckUpObject.Lens.LensCoating = $scope.GlassObject.LensCoating;

                                $scope.Product.EyeCheckUpObject.Lens.FrameMaterial = $scope.GlassObject.FrameMaterial || "";
                                $scope.Product.EyeCheckUpObject.Lens.LensMaterial = $scope.GlassObject.LensMaterial || "";
                                $scope.Product.EyeCheckUpObject.Lens.LensTint = $scope.GlassObject.LensTint || "";
                                $scope.Product.EyeCheckUpObject.Lens.Modeofwear = $scope.GlassObject.Modeofwear || "";
                                $scope.Product.EyeCheckUpObject.Lens.SpecialityLens = $scope.GlassObject.SpecialityLens || "";
                                $scope.Product.EyeCheckUpObject.Lens.SpecialInstruction = $scope.GlassObject.SpecialInstruction || "";

                                $scope.Product.EyeCheckUpObject.Lens.RightEyeRemarks = $scope.GlassObject.Remarks || "";
                                $scope.Product.EyeCheckUpObject.Lens.LeftEyeRemarks = $scope.GlassObject.Remarks || "";
                                $scope.Sale.NewOrOldGlass = $scope.GlassObject.Type;
                                $scope.Product.SelectedQuantityId = 3;
                                datapersistanceFactory.set("TempEyeCheckUpObject", $scope.Product.EyeCheckUpObject);
                                $scope.Sale.CashAmount = "";
                                $scope.Sale.CardAmount = "";
                                $scope.Sale.ChequeAmount = "";
                                // var DoctorsList = $filter("filter")($scope.InvDoctorsList, { "UserId": resp.data.DoctorId }, true);
                                var DoctorsList = $filter("filter")($scope.InvDoctorsPharmacyList, { "UserId": resp.data.DoctorId }, true);
                                if (DoctorsList.length > 0) {
                                    $scope.Sale.SelectedDoctor = DoctorsList[0];
                                    $scope.Sale.DoctorId = $scope.Sale.SelectedDoctor.UserId;
                                }
                            }
                            else {
                                $scope.GlassObject = {};
                                $scope.Sale.NewOrOldGlass = "";
                                $scope.Product.EyeCheckUpObject = angular.copy($scope.GetVisionDataObject());
                                $scope.Sale.SelectedDoctor = "";
                                alertify.alert("No Glasses Found");
                            }
                        } else {
                            $scope.Sale.SelectedDoctor = "";
                            alertify.alert("No Glasses Found");
                        }
                    }
                    if ($scope.Sale.ScreenType === "InvSale") {
                        resp.data = resp.data || [];

                    }

                }, function (err) { console.log(err); alertify.error("Getting Glass Details Failed"); });
            };
            $scope.CheckNewOrOldGlass = function (array) {
                var NewGlassArray = $filter("filter")(array, { "InvestigationId": 43 }, true);
                var OldGlassArray = $filter("filter")(array, { "InvestigationId": 44 }, true);
                if (NewGlassArray.length > 0) {
                    if ($scope.CheckAttributes(NewGlassArray[0].Attributes)) {
                        return {
                            "Attributes": NewGlassArray[0].Attributes,
                            "LensCoating": NewGlassArray[0].LensCoating,
                            "LensType": NewGlassArray[0].LensType,

                            "FrameMaterial": NewGlassArray[0].FrameMaterial || [],
                            "LensMaterial": NewGlassArray[0].LensMaterial || [],
                            "LensTint": NewGlassArray[0].LensTint || [],
                            "Modeofwear": NewGlassArray[0].Modeofwear || [],
                            "SpecialityLens": NewGlassArray[0].SpecialityLens || [],
                            "SpecialInstruction": NewGlassArray[0].SpecialInstruction || [],

                            "Remarks": NewGlassArray[0].Remarks,
                            "Type": "New Glass"
                        };
                    }
                } else {
                    if (OldGlassArray.length > 0) {
                        if ($scope.CheckAttributes(OldGlassArray[0].Attributes)) {
                            return {
                                "Attributes": OldGlassArray[0].Attributes,
                                "LensCoating": OldGlassArray[0].LensCoating,
                                "LensType": OldGlassArray[0].LensType,
                                "Remarks": OldGlassArray[0].Remarks,
                                "Type": "Old Glass"
                            };
                        }
                    }
                }
            };
            $scope.CheckAttributes = function (obj) {
                var count = 0;
                for (var prop in obj) {
                    if (obj[prop] !== "" && obj[prop] !== "Distance") {
                        count++;
                    }
                }
                return count !== 0;
            };

            $scope.AddGst = function (item) {
                item.PatientGSTNo = item.PatientGSTNo || "";

                item.SelectedPatientWithName = item.SelectedPatientWithName || null;

                if (item.SelectedPatientWithName === null) {
                    return;
                }

                if (item.PatientGSTNo === "") {
                    return;
                }

                var param = { "PatientId": item.SelectedPatientWithName.PatientId, "GST": item.PatientGSTNo };
                param.PatientId = param.PatientId || "";
                param.GST = param.GST || "";
                if (param.PatientId === "") {
                    alertify.error("Please Select Patient");
                    return false;
                }
                if (param.GST === "") {
                    alertify.error("Please add GSTNo");
                    return false;
                }
                eHnotePatientDataService.SaleRegisterPatient(param, OnAddPatientSuccess, OnAddPatientError);
                function OnAddPatientSuccess(resp) {
                    if (resp.data.MobileNo === 0 || resp.data.MobileNo === null) {
                        resp.data.MobileNo = "";
                    }
                    if ($scope.SaveGST === "Update") {
                        alertify.success("GSTNo Updated Successfully");
                    } else {
                        alertify.success("GSTNo Added Successfully");
                    }

                    $scope.SaveGST = "Update";
                    $scope.Sale.patientMobile = resp.data.MobileNo;
                    $scope.Sale.PatientDisplayId = resp.data.PatientDisplayId;
                    $scope.Sale.PatientId = resp.data.patientid;
                    //$scope.Sale.PatientGSTNo = resp.data.GSTNO;

                    $scope.Patient.selectedPatient = {};
                    $scope.Patient.selectedPatient.MobileNo = resp.data.MobileNo;
                    $scope.Patient.selectedPatient.fullname = resp.data.FirstName;
                    $scope.Patient.selectedPatient.PatientId = resp.data.patientid;
                    $scope.Patient.selectedPatient.PatientDisplayId = resp.data.PatientDisplayId;
                    $scope.Patient.selectedPatient.Age = resp.data.age;
                    $scope.Patient.selectedPatient.Sex = resp.data.Sex;
                    $scope.Patient.selectedPatient.EmailId = resp.data.Email;
                    $scope.Patient.selectedPatient.GSTNo = resp.data.GSTNO || "";
                    $scope.showNewPatientRegPopUP = false;

                }
                function OnAddPatientError(err) {
                    console.log(err);
                }


            };

            function getdateslist(d) {
                if (d === 31) {
                    $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin31daysArray();
                }
                else if (d === 30) {
                    $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin30daysArray();
                }
                else if (d === 28) {
                    $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin30daysArray();
                }
                else if (d === 29) {
                    $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin29daysArray();
                }
                else {
                    $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin31daysArray();
                }


            };
            function daysInMonth(month, year) {
                var today = new Date();
                var todayYear = today.getFullYear();
                var todaymonth = today.getMonth() + 1;
                var dobyear = todayYear - year;
                if (todaymonth > month) {
                    var dobmonth = todaymonth - month;
                }
                if (todaymonth <= month) {
                    dobyear = dobyear - 1;
                    dobmonth = todaymonth - month;
                    dobmonth = 12 + dobmonth;
                }
                var d = new Date(dobyear, dobmonth, 0).getDate();
                getdateslist(d);
                return d;

            }

            $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData");
            $scope.IsRefferalSourceMandatory = false;
            if ($scope.OrganizationSettingsData !== undefined) {
                if ($scope.OrganizationSettingsData.PatientRegistration !== undefined) {
                    if ($scope.OrganizationSettingsData.PatientRegistration.IsRefferalSourceMandatory === 1) {
                        $scope.IsRefferalSourceMandatory = true;
                    }
                }
            }
            $scope.MasterReferralSource = function () {
                eHnoteOrgReferralDataServices.GetMasterReferralSource(doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID).then(function (response) {
                    $scope.ReferralSouceMaster = response.data.rows;
                });
            }

            $scope.MasterReferralSource();

            $scope.ChangeRefferalSource = function () {
                $scope.SalePatient.ReferralSource = "";
                $scope.SalePatient.othDetailreferralsourceName = "";
                if ($scope.SalePatient.referralSource != "") {
                    if ($scope.SalePatient.referralSource.ShowType == 'D') {
                        GetrefferalSource("");
                    }
                }
            }
            $scope.IsbindindData = false;
            function GetrefferalSource(Searchtext) {
                hospid = undefined;
                var getParams = {
                    "DoctorID": doctorinfo.doctorid,
                    "USRType": "DOCTOR",
                    "PageSize": 1000,
                    "SearchText": Searchtext,
                    "PageNumber": 1,
                    "USRId": doctorinfo.doctorid,
                    "MasterReferralSourceId": $scope.SalePatient.referralSource.MasterReferralSourceId,
                    "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
                };
                if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                    hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
                    eHnoteOrgReferralDataServices.getReferralServicesList(getParams, hospid, onreadSuccess, onreadFailed);
                } else {
                    hospid = undefined;
                    eHnoteOrgReferralDataServices.getReferralServicesList(getParams, hospid, onreadSuccess, onreadFailed);
                }
                function onreadSuccess(data) {
                    $scope.ReferralList = data[0].rows;
                    $scope.totalItems = data[0].count;
                    if ($scope.IsbindindData) {

                        $scope.SalePatient.ReferralSource = $filter("filter")($scope.ReferralList, { "ReferralID": $scope.SalePatient.othDetailreferralsource }, true)[0];

                        if ($scope.SalePatient.ReferralSource !== undefined) {
                            $scope.SalePatient.othDetailreferralsource = $scope.SalePatient.ReferralSource.ReferralID;
                            $scope.SalePatient.othDetailreferralsourceName = $scope.SalePatient.ReferralSource.ReferralTitle;
                            $scope.referralTitle = "";
                        }
                        $scope.IsbindindData = false;
                    }

                }
                function onreadFailed(data) {
                }

            }

            $scope.dynamicPopover2 = {
                "RefferalTemplateUrl2": "AddRefferalTemplate2.html",
                "Templatetitle": "Add Refferal",
                "isRefferalPopOverOpen2": false
            };
            $scope.changeReferral = function (selectedReferral) {
                selectedReferral = selectedReferral || null;
                $scope.SalePatient.ReferralMobileNo = "";
                $scope.SalePatient.ReferralContactNo = "";
                $scope.ShowRefferallist = false;
                if (selectedReferral === null) {
                    $scope.SalePatient.othDetailreferralsource = "";
                    $scope.SalePatient.othDetailreferralsourceName = "";
                } else {
                    $scope.SalePatient.ReferralSource = selectedReferral;
                    $scope.SalePatient.othDetailreferralsource = selectedReferral.ReferralID;
                    $scope.SalePatient.othDetailreferralsourceName = selectedReferral.ReferralTitle;
                    $scope.SalePatient.ReferralMobileNo = selectedReferral.ReferralMobileNo;
                    $scope.SalePatient.ReferralContactNo = selectedReferral.ReferralContactNo;
                }
            };
            $scope.SearchByReferralSource = function () {
                if ($scope.SalePatient.referralSource != "") {
                    $scope.Refferalserachname = $scope.SalePatient.othDetailreferralsourceName;
                    if ($scope.Refferalserachname === "" || $scope.Refferalserachname.length < 2) {
                        $scope.ShowRefferallist = false;
                        $scope.SalePatient.othDetailreferralsource = "";
                        return false;
                    } else {
                        $scope.ShowRefferallist = true;
                        GetrefferalSource($scope.Refferalserachname);
                    }
                } else {
                    alertify.error("Please Choose Referral Resource");
                    return false;
                }
            };
            $scope.referralTitle1 = "";

            $scope.addReferral = function (ref) {
                $scope.referralTitle1 = ref;

                if ($scope.referralTitle1 === undefined || $scope.referralTitle1 === "") {
                    alertify.error("Please Enter Referral Source");
                    return;
                }
                $scope.SalePatient.referralSource = $scope.SalePatient.referralSource || "";
                if ($scope.SalePatient.referralSource === "") {
                    alertify.error("Please Choose Referral");
                    $scope.addRefferelPopup = false;
                    return;
                }
                var params = {
                    "DoctorID": doctorinfo.doctorid,
                    "USRType": "DOCTOR",
                    "ReferralDesc": "Referral Description",
                    "PageSize": 1000,
                    "PageNumber": 1,
                    "ActiveIND": "Y",
                    "USRId": doctorinfo.doctorid,
                    "ReferralTitle": $scope.referralTitle1,
                    "MasterReferralSourceId": $scope.SalePatient.referralSource.MasterReferralSourceId,
                    "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
                };

                eHnoteOrgReferralDataServices.AddUpdateReferralServicesList(params, onSuccess, onFailed);
                function onSuccess(data) {
                    if (data.status === "Failure") {
                        alertify.error("Referral Source already exist");
                        $scope.referralTitle1 = "";
                    } else {
                        alertify.success('Added Successfully');
                        if (data[0].rows.length > 0) {
                            $scope.referralTitle1 = "";
                            $scope.SalePatient.othDetailreferralsourceName = data[0].rows[0].ReferralTitle;
                            $scope.SalePatient.othDetailreferralsource = data[0].rows[0].ReferralID;
                            $scope.addRefferelPopup = false;
                            $scope.IsbindindData = true;
                            $scope.dynamicPopover2.isRefferalPopOverOpen2 = false;
                            GetrefferalSource("");
                        }

                    }
                }
                function onFailed(err) {
                    console.log(err);
                    alertify.error("Referral Source already exist");
                }
            };

            $scope.changeReferralPhoneType = function (type, item) {
                if (type === 'Mobile') {
                    $scope.SalePatient.ReferralContactNo = "";
                }
                if (type === 'LandLine') {
                    $scope.SalePatient.ReferralMobileNo = "";
                }
            }

        }
    };
}]);
eHnoteWebApp.directive("dragAndDrop", ["$filter", function ($filter) {

    return {
        "templateUrl": "templates/DragAndDrop.html",
        "link": function ($scope, element, attr) {
            //Ag grid Drag & Drop Code
            var rowIdSequence = 100;

            var leftColumnDefs = [
                { field: "id", rowDrag: true },
                { field: "color" },
                { field: "value1" },
                { field: "value2" }
            ];

            var rightColumnDefs = [
                { field: "id", rowDrag: true },
                { field: "color" },
                { field: "value1" },
                { field: "value2" }
            ];

            var leftGridOptions = {
                defaultColDef: {
                    flex: 1,
                    minWidth: 100,
                    sortable: true,
                    filter: true,
                    resizable: true
                },
                rowClassRules: {
                    "red-row": 'data.color == "Red"',
                    "green-row": 'data.color == "Green"',
                    "blue-row": 'data.color == "Blue"',
                },
                getRowNodeId: function (data) { return data.id },
                rowData: createRowBlock(2),
                rowDragManaged: true,
                suppressMoveWhenRowDragging: true,
                columnDefs: leftColumnDefs,
                animateRows: true,
                onGridReady: function (params) {
                    addBinZone(params);
                    addGridDropZone(params, 'Right');
                }
            };

            var rightGridOptions = {
                defaultColDef: {
                    flex: 1,
                    minWidth: 100,
                    sortable: true,
                    filter: true,
                    resizable: true
                },
                rowClassRules: {
                    "red-row": 'data.color == "Red"',
                    "green-row": 'data.color == "Green"',
                    "blue-row": 'data.color == "Blue"',
                },
                getRowNodeId: function (data) { return data.id },
                rowData: createRowBlock(2),
                rowDragManaged: true,
                suppressMoveWhenRowDragging: true,
                columnDefs: rightColumnDefs,
                animateRows: true,
                onGridReady: function (params) {
                    addBinZone(params);
                    addGridDropZone(params, 'Left');
                }
            };

            function createRowBlock(blocks) {
                blocks = blocks || 1;

                var output = [];

                for (var i = 0; i < blocks; i++) {
                    output = output.concat(['Red', 'Green', 'Blue'].map(function (color) {
                        return createDataItem(color);
                    }));
                }

                return output;
            }

            function createDataItem(color) {
                return {
                    id: rowIdSequence++,
                    color: color,
                    value1: Math.floor(Math.random() * 100),
                    value2: Math.floor(Math.random() * 100)
                };
            }

            function addRecordToGrid(side, data) {
                // if data missing or data has no it, do nothing
                if (!data || data.id == null) { return; }

                var api = side == 'left' ? leftGridOptions.api : rightGridOptions.api,
                    // do nothing if row is already in the grid, otherwise we would have duplicates
                    rowAlreadyInGrid = !!api.getRowNode(data.id),
                    transaction;

                if (rowAlreadyInGrid) {
                    console.log('not adding row to avoid duplicates in the grid');
                    return;
                }

                transaction = {
                    add: [data]
                };

                api.applyTransaction(transaction);
            }

            function onFactoryButtonClick(e) {
                var button = e.currentTarget,
                    buttonColor = button.getAttribute('data-color'),
                    side = button.getAttribute('data-side'),
                    data = createDataItem(buttonColor);

                addRecordToGrid(side, data);
            }

            function binDrop(data) {
                // if data missing or data has no id, do nothing
                if (!data || data.id == null) { return; }

                var transaction = {
                    remove: [data]
                };

                [leftGridOptions, rightGridOptions].forEach(function (option) {
                    rowsInGrid = !!option.api.getRowNode(data.id);

                    if (rowsInGrid) {
                        option.api.applyTransaction(transaction);
                    }
                });
            }

            function addBinZone(params) {
                var eBin = document.querySelector('.bin'),
                    icon = eBin.querySelector('i');
                dropZone = {
                    getContainer: function () { return eBin; },
                    onDragEnter: function () {
                        eBin.style.color = 'blue';
                        icon.style.transform = 'scale(1.5)';
                    },
                    onDragLeave: function () {
                        eBin.style.color = 'black';
                        icon.style.transform = 'scale(1)';
                    },
                    onDragStop: function (params) {
                        binDrop(params.node.data);
                        eBin.style.color = 'black';
                        icon.style.transform = 'scale(1)';
                    }
                };

                params.api.addRowDropZone(dropZone);
            }

            function addGridDropZone(params, side) {
                var gridApi = (side === 'Left' ? leftGridOptions : rightGridOptions).api;
                var dropZone = gridApi.getRowDropZoneParams();

                params.api.addRowDropZone(dropZone);
            }

            function loadGrid(side) {
                var grid = document.querySelector('#e' + side + 'Grid');
                new agGrid.Grid(grid, side === 'Left' ? leftGridOptions : rightGridOptions);
            }

            // setup the grid after the page has finished loading
            //document.addeventlistener('domcontentloaded', function () {
            console.log("grid init called");
            var buttons = document.queryselectorall('button.factory');

            for (var i = 0; i < buttons.length; i++) {
                buttons[i].addeventlistener('click', onfactorybuttonclick);
            }

            loadgrid('left');
            loadgrid('right');
            //});


        }
    };
}]);
eHnoteWebApp.directive('focusFollowup', function ($timeout) {
    return {
        link: function (scope, element, attrs) {
            scope.$watch(attrs.focusFollowup, function (value) {
                if (value === true) {
                    console.log('value=', value);
                    //$timeout(function() {
                    element[0].focus();
                    scope[attrs.focusFollowup] = false;
                    console.log('value=', value);
                    //});
                }
            });
        }
    };
});
eHnoteWebApp.filter("EnCode", [function () {
    return function (input) {
        return window.encodeURIComponent(input);
    };
}]);
eHnoteWebApp.filter("DeCode", [function () {
    return function (input) {
        try {
            //input = window.decodeURIComponent(input);
            input = decodeURIComponent(input);
        }
        catch (e) {
            input = unescape(input);
        }
        return input;
    };
}]);

eHnoteWebApp.directive("validtwodecimalNumber", [function () {

    return {

        "require": "?ngModel",

        "link": function (scope, element, attrs, ngModelCtrl) {

            if (!ngModelCtrl) {

                return;

            }

            ngModelCtrl.$parsers.push(function (val) {

                var clean = "";

                if (val === ".") {

                    clean = val.replace(/./g, "");

                    if (val !== clean) {

                        ngModelCtrl.$setViewValue(clean);

                        ngModelCtrl.$render();

                    }

                    return clean;

                } else {

                    if (val === null) {

                        val = "";

                    }

                    if (!isNaN(val)) {

                        val = val.toString();

                    }

                    clean = val.replace(/[^0-9.]+/g, "");

                    var negativeCheck = clean.split("-");

                    var decimalCheck = clean.split(".");

                    if (!angular.isUndefined(decimalCheck[1])) {

                        decimalCheck[1] = decimalCheck[1].slice(0, 2);

                        clean = decimalCheck[0] + "." + decimalCheck[1];

                    }

                    if (val !== clean) {

                        ngModelCtrl.$setViewValue(clean);

                        ngModelCtrl.$render();

                    }

                    return clean;

                }

            });

            element.bind("keypress", function (event) {

                if (event.keyCode === 32) {

                    event.preventDefault();

                }

            });

        }

    };

}]);






eHnoteWebApp.directive("validNumber", [function () {
    return {
        "require": "?ngModel",
        "link": function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }
            ngModelCtrl.$parsers.push(function (val) {
                var clean = "";
                if (val === ".") {
                    clean = val.replace(/./g, "");
                    if (val !== clean) {
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }
                    return clean;
                } else {
                    if (val === null) {
                        val = "";
                    }
                    if (!isNaN(val)) {
                        val = val.toString();
                    }
                    clean = val.replace(/[^0-9.]+/g, "");
                    var negativeCheck = clean.split("-");
                    var decimalCheck = clean.split(".");
                    if (!angular.isUndefined(decimalCheck[1])) {
                        decimalCheck[1] = decimalCheck[1].slice(0, 2);
                        clean = decimalCheck[0] + "." + decimalCheck[1];
                    }
                    if (val !== clean) {
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }
                    return clean;
                }
            });
            element.bind("keypress", function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
}]);
eHnoteWebApp.directive("validNumberPrecision", [function () {
    return {
        "require": "?ngModel",
        "link": function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }
            ngModelCtrl.$parsers.push(function (val) {
                var clean = "";
                if (val === ".") {
                    clean = val.replace(/./g, "");
                    if (val !== clean) {
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }
                    return clean;
                } else {
                    if (val === null) {
                        val = "";
                    }
                    if (!isNaN(val)) {
                        val = val.toString();
                    }
                    clean = val.replace(/[^0-9.]+/g, "");
                    var negativeCheck = clean.split("-");
                    var decimalCheck = clean.split(".");
                    if (!angular.isUndefined(decimalCheck[1])) {
                        decimalCheck[1] = decimalCheck[1].slice(0, 3);
                        clean = decimalCheck[0] + "." + decimalCheck[1];
                    }
                    if (val !== clean) {
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }
                    return clean;
                }
            });
            element.bind("keypress", function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
}]);

eHnoteWebApp.directive("expDate1", [function () {
    return {
        "require": "?ngModel",
        "link": function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }
            ngModelCtrl.$parsers.push(function (val) {
                var clean = "";
                if (val === ".") {
                    clean = val.replace(/./g, "");
                    if (val !== clean) {
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }
                    return clean;
                } else {
                    if (val === null) {
                        val = "";
                    }
                    if (!isNaN(val)) {
                        val = val.toString();
                    }
                    clean = val.replace(/[^0-9./]+/g, "");
                    var negativeCheck = clean.split("-");
                    var decimalCheck = clean.split(".");
                    if (!angular.isUndefined(decimalCheck[1])) {
                        decimalCheck[1] = decimalCheck[1].slice(0, 2);
                        clean = decimalCheck[0] + "." + decimalCheck[1];
                    }
                    if (val !== clean) {
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }
                    return clean;
                }
            });
            element.bind("keypress", function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
}]);

eHnoteWebApp.directive("dobFormat", function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, ngModelCtrl) {
            ngModelCtrl.$parsers.push(function (val) {
                // Format input while typing
                var formatted = formatDob(val);
                ngModelCtrl.$setViewValue(formatted);
                ngModelCtrl.$render();

                // Return the cleaned value without slashes
                return formatted.replace(/\//g, '');
            });

            element.bind("keypress", function (event) {
                // Prevent spaces
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });

            // Helper function to format DOB
            function formatDob(value) {
                // Remove non-numeric characters
                var numericValue = value.replace(/[^0-9]/g, '');

                // Format as MM/DD/YYYY
                var formatted = '';
                for (var i = 0; i < numericValue.length; i++) {
                    if (i === 2 || i === 4) {
                        formatted += '-';
                    }
                    formatted += numericValue[i];
                }

                return formatted;
            }
        }
    };
});


eHnoteWebApp.directive("alphaNumericForDosage", [function () {
    return {
        "require": "ngModel",
        "link": function (scope, element, attrs, modelCtrl) {
            element.bind("keypress", function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) {
                    return "";
                }
                var transformedInput = inputValue.replace(/[^0-9a-zA-Z./]/g, "");
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);

eHnoteWebApp.directive("onlycharacter", [function () {
    return {
        "require": "ngModel",
        "link": function (scope, element, attrs, modelCtrl) {
            element.bind("keypress", function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) {
                    return "";
                }
                inputValue = inputValue.toUpperCase();
                var transformedInput = inputValue.replace(/[^A-L]/g, "");
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }
    };
}]);

eHnoteWebApp.directive("alphaNumericForMotility", [function () {
    return {
        "require": "ngModel",
        "link": function (scope, element, attrs, modelCtrl) {
            element.bind("keypress", function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) {
                    return "";
                }
                var transformedInput = inputValue.replace(/[^0-9./]/g, "");
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);

eHnoteWebApp.directive("numericDuration", [function () {
    return {
        "require": "ngModel",
        "link": function (scope, element, attrs, modelCtrl) {
            element.bind("keypress", function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) {
                    return "";
                }
                var transformedInput = inputValue.replace(/[^0-9]/g, "");
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);

eHnoteWebApp.directive("numericMinus", [function () {
    return {
        "require": "ngModel",
        "link": function (scope, element, attrs, modelCtrl) {
            element.bind("keypress", function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) {
                    return "";
                }
                var transformedInput = inputValue.replace(/[^0-9-]/g, "");
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);


eHnoteWebApp.directive("ngFocus", ["$timeout", function ($timeout) {
    return {
        link: function (scope, element, attrs) {

            scope.$watch(attrs.ngFocus, function (val) {
                if (angular.isDefined(val) && val) {
                    $timeout(function () {
                        element[0].focus();
                    }, 10);
                }
            }, true);

            element.bind('blur', function () {
                if (angular.isDefined(attrs.ngFocusLost)) {
                    scope.$apply(attrs.ngFocusLost);
                }
            });
        }
    };
}]);
eHnoteWebApp.directive("alphaNumericForVision", [function () {
    return {
        "require": "ngModel",
        "link": function (scope, element, attrs, modelCtrl) {
            element.bind("keypress", function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) {
                    return "";
                }
                //      var transformedInput = inputValue.replace(/[^a-zA-Z0-9+./-]/g, "");
                var transformedInput = inputValue.replace("/[a-zA-Z0-9^ ]/");
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);
eHnoteWebApp.directive('typeaheadShowOnFocus', function () {
    return {
        require: 'ngModel',
        link: function ($scope, element, attrs, ngModel) {
            element.bind('focus', function () {
                ngModel.$setViewValue();
                $(element).trigger('input');
                $(element).trigger('change');
            });
        }
    };
});
eHnoteWebApp.directive("alphaNumericForVisionSpace", [function () {
    return {
        "require": "ngModel",
        "link": function (scope, element, attrs, modelCtrl) {
            element.bind("keypress", function (event) {
                //if (event.keyCode === 32) {
                //    event.preventDefault();
                //}
            });
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) {
                    return "";
                }
                //      var transformedInput = inputValue.replace(/[^a-zA-Z0-9+./-]/g, "");
                var transformedInput = inputValue.replace("/[a-zA-Z0-9^ ]/");
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);
eHnoteWebApp.directive("alphaNumericWithSpace", [function () {
    return {
        "require": "ngModel",
        "link": function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) {
                    return "";
                }
                var transformedInput = inputValue.replace(/[^0-9a-zA-Z\s]/g, '');
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);

eHnoteWebApp.directive("alphaNumericForUnaided", [function () {
    return {
        "require": "ngModel",
        "link": function (scope, element, attrs, modelCtrl) {
            element.bind("keypress", function (event) {
                //if (event.keyCode === 32) {
                //    event.preventDefault();
                //}
            });
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) {
                    return "";
                }
                var transformedInput = inputValue.replace(/[^0-9/+-.]/g, "");
                //var transformedInput = inputValue.replace(/[^a-zA-Z0-9+./-]/g, "");
                //var transformedInput = inputValue.replace("/[a-zA-Z0-9^ ]/");
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }

    };
}]);

eHnoteWebApp.directive('allowNumbersAndSpecialChars', [function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                var regex = /^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?-]*$/;

                ngModelCtrl.$parsers.push(function (value) {
                    if (value && !regex.test(value)) {
                        ngModelCtrl.$setViewValue(ngModelCtrl.$modelValue);
                        ngModelCtrl.$render();
                        return ngModelCtrl.$modelValue;
                    }
                    return value;
                });
            }
        };
    }]);

//text is nore display button
eHnoteWebApp.directive('textOverflowCheck', function ($timeout) {
return {
    restrict: 'A',
    scope: {
        item: '='
    },
    link: function (scope, element) {
        function checkOverflow() {
            const span = element[0].querySelector('.text-content');
            if (span && span.scrollWidth && span.clientWidth) {
                const isOverflowing = span.scrollWidth > span.clientWidth;
                scope.item.showAlertButton = isOverflowing;
                scope.$applyAsync();
            }
        }
        function delayedCheck(attempts = 5) {
            if (attempts <= 0) return;
            requestAnimationFrame(() => {
                checkOverflow();
                const span = element[0].querySelector('.text-content');
                if (span && (span.scrollWidth === 0 || span.clientWidth === 0)) {
                    $timeout(() => delayedCheck(attempts - 1), 50); 
                }
            });
        }
        $timeout(() => {
            delayedCheck();
        }, 50);
    }
};
});

eHnoteWebApp.directive("numbersCommaOnly", [function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return '';
                var transformedInput = inputValue.replace(/[^0-9\,]/g, '');
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);


eHnoteWebApp.directive("usMobileNumberSepicalCharacters", [function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return '';
                // var transformedInput = inputValue.replace(/[^0-9-()]/g,''); 
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);

eHnoteWebApp.directive("enterDirective", [function () {
    return {
        link: function (scope, element, attrs) {
            $(element).keypress(function (e) {
                if (e.keyCode === 13) {
                    event.preventDefault(); // Doesn't work at all
                    window.stop(); // Works in all browsers but IE...                    
                    return false; // Don't even know why it's here. D
                }
            });
        }
    };
}]);
eHnoteWebApp.directive('myDirective', function () {
    function link(scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function (viewValue) {
            var reg = /^[^'"]*$/;
            // if view values matches regexp, update model value
            $(element).keypress(function (e) {
                if (e.keyCode === 13) {
                    event.preventDefault(); // Doesn't work at all
                    window.stop(); // Works in all browsers but IE...                    
                    return false; // Don't even know why it's here. D
                }
            });
            if (viewValue.match(reg)) {
                return viewValue;
            }
            var transformedValue = ngModel.$modelValue;
            ngModel.$setViewValue(transformedValue);
            ngModel.$render();
            return transformedValue;
        });
    }

    return {
        restrict: 'A',
        require: 'ngModel',
        link: link
    };
});
eHnoteWebApp.directive("twoDecimal", [function () {
    return {
        "restrict": "A",
        "require": "ngModel",
        "link": function (scope, element, attrs, ngModel) {
            ngModel.$formatters.push(function (value) {
                value = value || 0;
                value = (value).toFixed(2);
                return value;
            });
        }
    };
}]);
eHnoteWebApp.filter("toFixed", [function () {
    return function (val, decimal) {
        val = parseFloat(val) || 0;
        val = val.toFixed(decimal);
        val = parseFloat(val);
        return val;
    };
}]);
eHnoteWebApp.filter("trusted", ['$sce', function ($sce) {
    return function (url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);
eHnoteWebApp.filter("numberpad", [function () {
    return function (input, places) {
        var out = "";
        if (places) {
            var placesLength = parseInt(places, 10);
            if (input !== undefined) {
                var inputLength = input.toString().length;
                for (var i = 0; i < (placesLength - inputLength); i++) {
                    out = '0' + out;
                }
                out = out + input;
            }
        }
        return out;
    };
}]);
eHnoteWebApp.directive("imageViewer", ["$timeout", function ($timeout) {
    return {
        "restrict": "A",
        "scope": {
            "isarraychanged": "=",
            "timeout": "="
        },
        "link": function ($scope, $elem, attrs) {
            var timeout = $scope.timeout || 0;
            var ImageContainer = "";
            var viewerinstance = "";
            $scope.$watch("isarraychanged", function (newvalue, oldvalue) {
                if (newvalue > oldvalue) {
                    $timeout(function () {
                        viewerinstance.update();
                    }, timeout);
                }
            });
            $timeout(function () {
                ImageContainer = $($elem);
                ImageContainer.viewer({ "loop": false, "interval": 2500 });
                viewerinstance = ImageContainer.data("viewer");
            }, timeout);
        }
    };
}]);

eHnoteWebApp.directive("dentalimageViewer", ["$timeout", function ($timeout) {
    return {
        "restrict": "A",
        "scope": {
            "isarraychanged": "=",
            "timeout": "="
        },
        "link": function ($scope, $elem, attrs) {
            var timeout = $scope.timeout || 0;
            var ImageContainer = "";
            var viewerinstance = "";
            $scope.$watch("isarraychanged", function (newvalue, oldvalue) {
                if (newvalue > oldvalue) {
                    $timeout(function () {
                        viewerinstance.update();
                    }, timeout);
                }
            });
            $timeout(function () {
                ImageContainer = $($elem);
                ImageContainer.viewer({ "loop": false, "interval": 2500 });
                viewerinstance = ImageContainer.data("viewer");
            }, timeout);
        }
    };
}]);

eHnoteWebApp.directive("imageViewer1", ["$timeout", function ($timeout) {
    return {
        "restrict": "A",
        "scope": {
            "isarraychanged": "=",
            "timeout": "="
        },
        "link": function ($scope, $elem, attrs) {
            var timeout = $scope.timeout || 0;
            var ImageContainer = "";
            var viewerinstance = "";
            $scope.$watch("isarraychanged", function (newvalue, oldvalue) {
                if (newvalue > oldvalue) {
                    $timeout(function () {
                        viewerinstance.update();
                    }, timeout);
                }
            });
            $timeout(function () {
                ImageContainer = $($elem);
                ImageContainer.viewer1({ "loop": false, "interval": 2500 });
                viewerinstance = ImageContainer.data("viewer1");
            }, timeout);
        }
    };
}]);
eHnoteWebApp.directive('lazyLoad', lazyLoad);
function lazyLoad() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            const observer = new IntersectionObserver(loadImg);
            const img = angular.element(element)[0];
            observer.observe(img);
            function loadImg(changes) {
                changes.forEach(change => {
                    if (change.intersectionRatio > 0 && change.target.getAttribute('tempData')) {
                        change.target.src = change.target.getAttribute('tempData');
                    }
                });
            }
        }
    };
}
eHnoteWebApp.filter("startFrom", [function () {
    return function (input, start) {
        if (input !== undefined) {
            start = +start; //parse to int
            return input.slice(start);
        }
    };
}]);
eHnoteWebApp.filter("glassfilter1", ["$filter", function ($filter) {

    return function (array, search1, search2) {

        var status = false;
        var count = 0;
        var coatarray = [];
        var typearray = [];
        var remarks = "";
        var ipd = "";
        if (array !== undefined) {
            if (array.length === 0) {
                return status;
            }
        } else {
            if (search1 === "new") {
                var NewGlassArray = $filter("filter")(array, { "InvestigationId": 43 }, true) || [];
                if (search2 === "attrib") {
                    if (NewGlassArray.length > 0) {
                        for (var property in NewGlassArray[0].Attributes) {

                            if (NewGlassArray[0].Attributes.hasOwnProperty(property)) {

                                if (property === "distanceVision" || property === "NearVision" || property === "RightEye" || property === "LeftEye" || property === "NotesRightEye" || property === "NotesLeftEye") {
                                    delete NewGlassArray[0].Attributes[property];
                                }
                                if (NewGlassArray[0].Attributes[property] !== "") {
                                    count++;
                                }
                            }
                        }
                        if (count > 1) {
                            status = true;
                        }
                    }
                }
                if (search2 === "coat") {
                    if (NewGlassArray.length > 0) {
                        coatarray = $filter("filter")(NewGlassArray[0].LensCoating, { "IsActive": true }, true) || [];
                    }
                    if (coatarray.length > 0) {
                        status = true;
                    }
                }
                if (search2 === "type") {
                    if (NewGlassArray.length > 0) {
                        typearray = $filter("filter")(NewGlassArray[0].LensType, { "IsActive": true }, true) || [];
                    }
                    if (typearray.length > 0) {
                        status = true;
                    }
                }
                if (search2 === 'Remarks') {
                    if (NewGlassArray.length > 0) {
                        if (NewGlassArray[0].Remarks) {
                            remarks = NewGlassArray[0].Remarks;
                        }
                    }
                    if (remarks !== "") {
                        status = true;
                    }
                }
                if (search2 === 'IPD') {
                    if (NewGlassArray.length > 0) {
                        if (NewGlassArray[0].IPD) {
                            ipd = NewGlassArray[0].IPD;
                        }
                    }
                    if (ipd !== "") {
                        status = true;
                    }
                }
            }
            if (search1 === "old") {
                var OldGlassArray = $filter("filter")(array, { "InvestigationId": 44 }, true) || [];
                if (search2 === "attrib") {
                    if (OldGlassArray.length > 0) {
                        for (var property in OldGlassArray[0].Attributes) {

                            if (OldGlassArray[0].Attributes.hasOwnProperty(property)) {
                                if (property === "distanceVision" || property === "NearVision" || property === "RightEye" || property === "LeftEye" || property === "NotesRightEye" || property === "NotesLeftEye") {
                                    delete OldGlassArray[0].Attributes[property];
                                }
                                if (OldGlassArray[0].Attributes[property] !== "") {
                                    count++;
                                }
                            }
                        }
                        if (count > 1) {
                            status = true;
                        }
                    }
                }
                if (search2 === "coat") {
                    if (OldGlassArray.length > 0) {
                        coatarray = $filter("filter")(OldGlassArray[0].LensCoating, { "IsActive": true }, true) || [];
                    }
                    if (coatarray.length > 0) {
                        status = true;
                    }
                }
                if (search2 === "type") {
                    if (OldGlassArray.length > 0) {
                        typearray = $filter("filter")(OldGlassArray[0].LensType, { "IsActive": true }, true) || [];
                    }
                    if (typearray.length > 0) {
                        status = true;
                    }
                }
                if (search2 === 'Remarks') {
                    if (OldGlassArray.length > 0) {
                        if (OldGlassArray[0].Remarks) {
                            remarks = OldGlassArray[0].Remarks;
                        }
                    }
                    if (remarks !== "") {
                        status = true;
                    }
                }
            }
        }
        return status;
    };
}]);

eHnoteWebApp.filter("glassDetailsfilter", ["$filter", function ($filter) {

    return function (array, search1, search2) {

        var status = false;
        var count = 0;
        var coatarray = [];
        var typearray = [];
        var remarks = "";
        var ipd = "";
        if (array !== undefined) {
            if (array.length === 0) {
                return status;
            }
        } else {
            if (search1 === "new") {
                var NewGlassArray = $filter("filter")(array, { "InvestigationId": 43 }, true) || [];
                if (search2 === "right") {
                    if (NewGlassArray.length > 0) {
                        for (var property in NewGlassArray[0].RightEyeValues) {

                            if (NewGlassArray[0].RightEyeValues.hasOwnProperty(property)) {
                                if (NewGlassArray[0].RightEyeValues[property] !== "") {
                                    count++;
                                }
                            }
                        }
                        if (count > 1) {
                            status = true;
                        }
                    }
                }
                if (search2 === "left") {
                    if (NewGlassArray.length > 0) {
                        for (var property in NewGlassArray[0].LeftEyeValues) {

                            if (NewGlassArray[0].LeftEyeValues.hasOwnProperty(property)) {
                                if (NewGlassArray[0].LeftEyeValues[property] !== "") {
                                    count++;
                                }
                            }
                        }
                        if (count > 1) {
                            status = true;
                        }
                    }
                }
                if (search2 === "coat") {
                    if (NewGlassArray.length > 0) {
                        coatarray = $filter("filter")(NewGlassArray[0].LensCoating, { "IsActive": true }, true) || [];
                    }
                    if (coatarray.length > 0) {
                        status = true;
                    }
                }
                if (search2 === "type") {
                    if (NewGlassArray.length > 0) {
                        typearray = $filter("filter")(NewGlassArray[0].LensType, { "IsActive": true }, true) || [];
                    }
                    if (typearray.length > 0) {
                        status = true;
                    }
                }
                if (search2 === 'Remarks') {
                    if (NewGlassArray.length > 0) {
                        if (NewGlassArray[0].Remarks) {
                            remarks = NewGlassArray[0].Remarks;
                        }
                    }
                    if (remarks !== "") {
                        status = true;
                    }
                }

            }
            if (search1 === "old") {
                var OldGlassArray = $filter("filter")(array, { "InvestigationId": 44 }, true) || [];
                if (search2 === "right") {
                    if (OldGlassArray.length > 0) {
                        for (var property in OldGlassArray[0].RightEyeValues) {

                            if (OldGlassArray[0].RightEyeValues.hasOwnProperty(property)) {
                                if (OldGlassArray[0].RightEyeValues[property] !== "") {
                                    count++;
                                }
                            }
                        }
                        if (count > 1) {
                            status = true;
                        }
                    }
                }
                if (search2 === "left") {
                    if (OldGlassArray.length > 0) {
                        for (var property in OldGlassArray[0].LeftEyeValues) {

                            if (OldGlassArray[0].LeftEyeValues.hasOwnProperty(property)) {
                                if (OldGlassArray[0].LeftEyeValues[property] !== "") {
                                    count++;
                                }
                            }
                        }
                        if (count > 1) {
                            status = true;
                        }
                    }
                }
                if (search2 === "coat") {
                    if (OldGlassArray.length > 0) {
                        coatarray = $filter("filter")(OldGlassArray[0].LensCoating, { "IsActive": true }, true) || [];
                    }
                    if (coatarray.length > 0) {
                        status = true;
                    }
                }
                if (search2 === "type") {
                    if (OldGlassArray.length > 0) {
                        typearray = $filter("filter")(OldGlassArray[0].LensType, { "IsActive": true }, true) || [];
                    }
                    if (typearray.length > 0) {
                        status = true;
                    }
                }
                if (search2 === 'Remarks') {
                    if (OldGlassArray.length > 0) {
                        if (OldGlassArray[0].Remarks) {
                            remarks = OldGlassArray[0].Remarks;
                        }
                    }
                    if (remarks !== "") {
                        status = true;
                    }
                }
            }
        }
        return status;
    };
}]);

eHnoteWebApp.filter("glassfilter", ["$filter", function ($filter) {

    return function (array, search1, search2) {
        array = array || [];
        var status = false;
        var count = 0;
        var coatarray = [];
        var typearray = [];
        var remarks = "";
        var ipd = "";

        if (array.length === 0) {
            return status;
        } else {
            if (search1 === "new") {
                var NewGlassArray = $filter("filter")(array, { "InvestigationId": 43 }, true) || [];
                if (search2 === "attrib") {
                    if (NewGlassArray.length > 0) {
                        for (var property in NewGlassArray[0].Attributes) {

                            if (NewGlassArray[0].Attributes.hasOwnProperty(property)) {

                                if (property === "distanceVision" || property === "NearVision" || property === "RightEye" || property === "LeftEye" || property === "NotesRightEye" || property === "NotesLeftEye") {
                                    delete NewGlassArray[0].Attributes[property];
                                }
                                if (NewGlassArray[0].Attributes[property] !== "") {
                                    count++;
                                }
                            }
                        }
                        if (count > 1) {
                            status = true;
                        }
                    }
                }
                if (search2 === "coat") {
                    if (NewGlassArray.length > 0) {
                        coatarray = $filter("filter")(NewGlassArray[0].LensCoating, { "IsActive": true }, true) || [];
                    }
                    if (coatarray.length > 0) {
                        status = true;
                    }
                }
                if (search2 === "type") {
                    if (NewGlassArray.length > 0) {
                        typearray = $filter("filter")(NewGlassArray[0].LensType, { "IsActive": true }, true) || [];
                    }
                    if (typearray.length > 0) {
                        status = true;
                    }
                }
                if (search2 === 'Remarks') {
                    if (NewGlassArray.length > 0) {
                        if (NewGlassArray[0].Remarks) {
                            remarks = NewGlassArray[0].Remarks;
                        }
                    }
                    if (remarks !== "") {
                        status = true;
                    }
                }
                if (search2 === 'IPD') {
                    if (NewGlassArray.length > 0) {
                        if (NewGlassArray[0].IPD) {
                            ipd = NewGlassArray[0].IPD;
                        }
                    }
                    if (ipd !== "") {
                        status = true;
                    }
                }
            }
            if (search1 === "old") {
                var OldGlassArray = $filter("filter")(array, { "InvestigationId": 44 }, true) || [];
                if (search2 === "attrib") {
                    if (OldGlassArray.length > 0) {
                        for (var property in OldGlassArray[0].Attributes) {

                            if (OldGlassArray[0].Attributes.hasOwnProperty(property)) {
                                if (property === "distanceVision" || property === "NearVision" || property === "RightEye" || property === "LeftEye" || property === "NotesRightEye" || property === "NotesLeftEye") {
                                    delete OldGlassArray[0].Attributes[property];
                                }
                                if (OldGlassArray[0].Attributes[property] !== "") {
                                    count++;
                                }
                            }
                        }
                        if (count > 1) {
                            status = true;
                        }
                    }
                }
                if (search2 === "coat") {
                    if (OldGlassArray.length > 0) {
                        coatarray = $filter("filter")(OldGlassArray[0].LensCoating, { "IsActive": true }, true) || [];
                    }
                    if (coatarray.length > 0) {
                        status = true;
                    }
                }
                if (search2 === "type") {
                    if (OldGlassArray.length > 0) {
                        typearray = $filter("filter")(OldGlassArray[0].LensType, { "IsActive": true }, true) || [];
                    }
                    if (typearray.length > 0) {
                        status = true;
                    }
                }
                if (search2 === 'Remarks') {
                    if (OldGlassArray.length > 0) {
                        if (OldGlassArray[0].Remarks) {
                            remarks = OldGlassArray[0].Remarks;
                        }
                    }
                    if (remarks !== "") {
                        status = true;
                    }
                }
            }
        }
        return status;
    };
}]);


eHnoteWebApp.filter("hideglassfilter", ["$filter", function ($filter) {

    return function (array, search1, search2) {
        var status = false;
        var count = 0;
        var coatarray = [];
        var typearray = [];
        var remarks = "";

        if (array.length === 0) {
            return true;
        } else {
            if (search1 === "new") {
                var NewGlassArray = $filter("filter")(array, { "InvestigationId": 43 }, true) || [];
                if (search2 === "attrib") {
                    if (NewGlassArray.length > 0) {
                        for (var property in NewGlassArray[0].Attributes) {

                            if (NewGlassArray[0].Attributes.hasOwnProperty(property)) {

                                if (property === "distanceVision" || property === "NearVision" || property === "RightEye" || property === "LeftEye" || property === "NotesRightEye" || property === "NotesLeftEye") {
                                    delete NewGlassArray[0].Attributes[property];
                                }
                                if (property !== "type") {
                                    if (NewGlassArray[0].Attributes[property] !== "") {
                                        count++;
                                    }
                                }
                            }
                        }
                        if (count === 0) {//writen by bharath
                            status = true;
                        }
                    }
                }
                if (search2 === "coat") {
                    if (NewGlassArray.length > 0) {
                        coatarray = $filter("filter")(NewGlassArray[0].LensCoating, { "IsActive": true }, true) || [];
                    }
                    if (coatarray.length > 0) {
                        status = true;
                    }
                }
                if (search2 === "type") {
                    if (NewGlassArray.length > 0) {
                        typearray = $filter("filter")(NewGlassArray[0].LensType, { "IsActive": true }, true) || [];
                    }
                    if (typearray.length > 0) {
                        status = true;
                    }
                }
                if (search2 === 'Remarks') {
                    if (NewGlassArray.length > 0) {
                        if (NewGlassArray[0].Remarks) {
                            remarks = NewGlassArray[0].Remarks;
                        }
                    }
                    if (remarks !== "") {
                        status = true;
                    }
                }
            }
            if (search1 === "old") {
                var OldGlassArray = $filter("filter")(array, { "InvestigationId": 44 }, true) || [];
                if (OldGlassArray.length > 0) {
                    if (search2 === "attrib") {
                        if (OldGlassArray.length > 0) {
                            for (var property in OldGlassArray[0].Attributes) {

                                if (OldGlassArray[0].Attributes.hasOwnProperty(property)) {
                                    if (property === "distanceVision" || property === "NearVision" || property === "RightEye" || property === "LeftEye" || property === "NotesRightEye" || property === "NotesLeftEye") {
                                        delete OldGlassArray[0].Attributes[property];
                                    }
                                    if (property !== "type") {
                                        if (OldGlassArray[0].Attributes[property] !== "") {
                                            count++;
                                        }
                                    }

                                }
                            }
                            if (count <= 0) {//writen by bharath for all are empty
                                status = true;
                            }
                        }
                    }
                    if (search2 === "coat") {
                        if (OldGlassArray.length > 0) {
                            coatarray = $filter("filter")(OldGlassArray[0].LensCoating, { "IsActive": true }, true) || [];
                        }
                        if (coatarray.length > 0) {
                            status = true;
                        }
                    }
                    if (search2 === "type") {
                        if (OldGlassArray.length > 0) {
                            typearray = $filter("filter")(OldGlassArray[0].LensType, { "IsActive": true }, true) || [];
                        }
                        if (typearray.length > 0) {
                            status = true;
                        }
                    }
                    if (search2 === 'Remarks') {
                        if (OldGlassArray.length > 0) {
                            if (OldGlassArray[0].Remarks) {
                                remarks = OldGlassArray[0].Remarks;
                            }
                        }
                        if (remarks === "") {//writen by bharath
                            status = true;
                        }
                    }
                } else {
                    status = true;
                }
            }
        }
        return status;
    };
}]);

eHnoteWebApp.filter("hidemedicine", ["$filter", function ($filter) {

    return function (array, search1) {
        var status = true;
        var count = 0;

        var MedicineList = $filter("filter")(array, { "SurgeryListId": search1, ActiveInd: 'Y' }, true) || [];

        if (array.length === 0) {
            return false;
        } else {

            //foreach(item  MedicineList) {
            //    if (item.MedicineId === 0) {
            //        count++ 
            //    }
            //}
            //angular.forEach(MedicineList, function (item) {
            //    if (item.MedicineId === 0) {
            //        count++
            //    }
            //});
            if (MedicineList.length === 1) {
                status = false;
            }

        }
        return status;
    };
}]);
eHnoteWebApp.filter("isObject", [function () {
    return function (input) {
        return typeof input === "object" && input !== null ? true : false;
    };
}]);





eHnoteWebApp.filter("isObjectEmpty", [function () {
    return function (object) {
        return Object.keys(object).length === 0;
    };
}]);


eHnoteWebApp.directive("convertToNumber", function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (val) {
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function (val) {
                return "" + val;
            });
        }
    };
});


eHnoteWebApp.filter("Categoryfilter", ["$filter", function ($filter) {
    return function (array, search1) {
        var status = false;
        var count = 0;
        var coatarray = [];
        if (array.length === 0) {
            return status;
        } else {
            if (search1 === "Category") {
                coatarray = $filter("filter")(array, { "TempIsCategoryChecked": true }, true);
                if (coatarray.length > 0) {
                    status = true;
                }
            }
        }
        return status;
    };
}]);
eHnoteWebApp.directive('setClassWhenAtTop', function ($window) {
    var $win = angular.element($window); // wrap window object as jQuery object

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var topClass = attrs.setClassWhenAtTop, // get CSS class from directive's attribute value
                offsetTop = element.offset().top; // get element's top relative to the document

            $win.on('scroll', function (e) {
                if ($win.scrollTop() >= offsetTop) {
                    element.addClass(topClass);
                } else {
                    element.removeClass(topClass);
                }
            });
        }
    };
});
eHnoteWebApp.filter("Investigationfilter", ["$filter", function ($filter) {
    return function (array, search1) {
        var status = false;
        var count = 0;
        var typearray = [];
        if (array.length === 0) {
            return status;
        } else {
            if (search1 === "Investigation") {
                typearray = $filter("filter")(array, { "IsInvestigationChecked": true }, true);
                if (typearray.length > 0) {
                    status = true;
                }
            }
        }
        return status;
    };
}]);
eHnoteWebApp.filter("SurgeryFieldfilter", ["$filter", function ($filter) {
    return function (array, SurgeryFieldId, subarray) {


        var FieldValue = "";
        array = $filter("filter")(array, { "SurgeryFieldId": SurgeryFieldId }, true);
        if (array.length !== 0) {
            FieldValue = array[0].FieldValue || "";
        }

        FieldValue = FieldValue || "--";

        if (FieldValue !== "" && FieldValue === "true") {
            FieldValue = "Yes";
        }
        if (FieldValue !== "" && FieldValue === "false") {
            FieldValue = "No";
        }

        //if (angular.isArray(FieldValue)) {
        //    angular.forEach(FieldValue, function (item, index) {
        //        item.Value = item.Value ? "Yes" : "No";
        //    });
        //}

        if (SurgeryFieldId === 5 || SurgeryFieldId === 6) {
            var temparray = $filter("filter")(subarray, { "DoctorID": parseInt(FieldValue) }, true);
            if (temparray.length > 0) {
                FieldValue = temparray[0].FullName;
            }
        }
        if (SurgeryFieldId === 13) {
            var temparray = $filter("filter")(subarray, { "Id": parseInt(FieldValue) }, true);
            if (temparray.length > 0) {
                FieldValue = temparray[0].Description;
            }
        }

        if (SurgeryFieldId === 7) {//Eye Operated
            if (parseInt(FieldValue) === 1) {
                FieldValue = "Right";
            } else if (parseInt(FieldValue) === 2) {
                FieldValue = "Left";
            } else {
                FieldValue = "Both";
            }
        }
        return FieldValue;
    };
}]);
eHnoteWebApp.directive("limitToMax", function () {
    return {
        link: function (scope, element, attributes) {
            element.on("keydown keyup", function (e) {
                if (Number(element.val()) > Number(attributes.max) &&
                    e.keyCode !== 46 // delete
                    &&
                    e.keyCode !== 8 // backspace
                ) {
                    e.preventDefault();
                    element.val(attributes.max);
                }
            });
        }
    };
});

eHnoteWebApp.directive("addSlash", function () {
    return {
        link: function (scope, element, attributes) {
            element.on("keydown keyup", function (e) {
                if (element.val().length === 2) {
                    if (!e.ctrlKey && !e.metaKey && (e.keyCode === 32 || e.keyCode > 46)) {
                        element.val(element.val() + "/");
                    }
                }
            });
        }
    };
});


eHnoteWebApp.directive("addDash", function () {
    return {
        link: function (scope, element, attributes) {
            element.on("keydown keyup", function (e) {
                if (element.val().length === 3) {
                    if (!e.ctrlKey && !e.metaKey && (e.keyCode === 32 || e.keyCode > 46)) {
                        element.val(element.val() + "-");
                    }
                }
                if (element.val().length === 7) {
                    if (!e.ctrlKey && !e.metaKey && (e.keyCode === 32 || e.keyCode > 46)) {
                        element.val(element.val() + "-");
                    }
                }
            });
        }
    };
});




eHnoteWebApp.directive("restrictZero", [function () {
    return {
        "require": "ngModel",
        "link": function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) {
                    return "";
                }
                var transformedInput = inputValue.replace(/[^0-9]/g, "");
                transformedInput = parseInt(transformedInput) === 0 ? inputValue.replace(/0/g, "") : transformedInput;
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);
eHnoteWebApp.filter("Round", function () {
    return function (input) {
        input = parseFloat(input) || 0;
        return Math.round(input);
    };
});
//Nested View Directives
eHnoteWebApp.directive("sjbNestedView", ["$route", "$anchorScroll", "$animate", "$sce", "$http", "$templateCache", function viewDrtvFactory($route, $anchorScroll, $animate, $sce, $http, $templateCache) {
    return {
        restrict: "EA",
        terminal: true,
        priority: 400,
        transclude: "element",
        link: function (scope, $element, attr, ctrl, $transclude) {
            var currentScope,
                currentElement,
                currentTemplate,
                currentController,
                previousElement,
                autoScrollExp = attr.autoscroll,
                onloadExp = attr.onload || '';

            scope.$on("$routeChangeSuccess", update);
            update();

            function cleanupLastView() {
                if (previousElement) {
                    previousElement.remove();
                    previousElement = null;
                }
                if (currentScope) {
                    currentScope.$destroy();
                    currentScope = null;
                }
                if (currentElement) {
                    $animate.leave(currentElement, function () {
                        previousElement = null;
                    });
                    previousElement = currentElement;
                    currentElement = null;
                }
            }

            // Here is a major change from ngView
            // Since we use templateUrls and not templateUrl route.js won't get the
            // template for us. We need to go get it ourselves.
            function update() {
                var templateUrls = $route.current && $route.current.templateUrls,
                    controllers = $route.current && $route.current.controllers,
                    level = parseInt(attr.sjbNestedView, 10);

                if (templateUrls) {
                    var thisTemplate = templateUrls[level];
                    var thisController = controllers ? controllers[level] : null;

                    // if either the templateUrl or the controller look different, then make the changes
                    if (thisTemplate !== currentTemplate || thisController !== currentController) {
                        currentTemplate = thisTemplate;
                        currentController = thisController;

                        var newScope = scope.$new();
                        var current = $route.current;

                        var templateUrl = $sce.getTrustedResourceUrl(thisTemplate), template;
                        if (angular.isDefined(templateUrl)) {
                            $http.get(templateUrl, { cache: $templateCache }).
                                then(function (response) {
                                    template = response.data;
                                    $route.current.locals.$template = template;

                                    // Note: This will also link all children of ng-view that were contained in the original
                                    // html. If that content contains controllers, ... they could pollute/change the scope.
                                    // However, using ng-view on an element with additional content does not make sense...
                                    // Note: We can't remove them in the cloneAttchFn of $transclude as that
                                    // function is called before linking the content, which would apply child
                                    // directives to non existing elements.
                                    var clone = $transclude(newScope, function (clone) {
                                        $animate.enter(clone, null, currentElement || $element, function onNgViewEnter() {
                                            if (angular.isDefined(autoScrollExp) &&
                                                (!autoScrollExp || scope.$eval(autoScrollExp))) {
                                                $anchorScroll();
                                            }
                                        });
                                        cleanupLastView();
                                    });
                                    currentElement = clone;
                                    currentScope = current.scope = newScope;
                                    currentScope.$emit("$viewContentLoaded");
                                    currentScope.$eval(onloadExp);
                                });
                        }
                    }
                } else {
                    currentTemplate = null;
                    cleanupLastView();
                }
            }
        }
    };
}]);
eHnoteWebApp.directive("sjbNestedView", ["$compile", "$controller", "$route", function viewFillContentFactory($compile, $controller, $route) {
    return {
        restrict: "ECA",
        priority: -400,
        link: function (scope, $element, attrs) {
            var current = $route.current,
                locals = current.locals,
                level = parseInt(attrs.sjbNestedView, 10);
            $element.html(locals.$template);
            var link = $compile($element.contents());
            if (current.controllers && current.controllers[level]) {
                locals.$scope = scope;
                var controller = $controller(current.controllers[level], locals);
                if (current.controllersAs && current.controllersAs[level]) {
                    scope[current.controllersAs[level]] = controller;
                }
                $element.data("$ngControllerController", controller);
                $element.children().data("$ngControllerController", controller);
            }
            link(scope);
        }
    };
}]);
eHnoteWebApp.directive("copyToClipboard", function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.click(function () {
                if (attrs.copyToClipboard) {
                    var $temp_input = $("<input>");
                    $("body").append($temp_input);
                    $temp_input.val(attrs.copyToClipboard).select();
                    document.execCommand("copy");
                    $temp_input.remove();
                }
            });
        }
    };
});
eHnoteWebApp.directive("barcodeScanner", function () {
    return {
        restrict: "A",
        scope: {
            callback: "=barcodeScanner"
        },
        link: function postLink(scope, iElement, iAttrs) {
            // Settings
            var zeroCode = 48;
            var nineCode = 57;
            var enterCode = 13;
            var minLength = 3;
            var delay = 300; // ms

            // Variables
            var pressed = false;
            var chars = [];
            var enterPressedLast = false;

            // Timing
            var startTime = undefined;
            var endTime = undefined;

            jQuery(document).keypress(function (e) {

                if (chars.length === 0) {
                    startTime = new Date().getTime();
                } else {
                    endTime = new Date().getTime();
                }

                // Register characters and enter key
                if (e.which >= zeroCode && e.which <= nineCode) {
                    chars.push(String.fromCharCode(e.which));
                }

                enterPressedLast = (e.which === enterCode);

                if (pressed === false) {
                    setTimeout(function () {
                        if (chars.length >= minLength && enterPressedLast) {


                            //var barcode = chars.join('');
                            //var barcode = chars;





                            if (angular.isFunction(scope.callback)) {
                                scope.$apply(function () {
                                    scope.callback(chars);
                                });
                            }
                        }
                        chars = [];
                        pressed = false;
                    }, delay);
                }
                pressed = true;
            });
        }
    };
});

eHnoteWebApp.directive("validateExpiryDate", ["InventoryService", function (InventoryService) {
    return {
        require: "ngModel",
        link: function (scope, elem, attr, ngModel) {

            //For DOM -> model validation
            ngModel.$parsers.unshift(function (value) {

                value = value || null;


                var ExpDateVaildate = InventoryService.ValidateExpDate(value);
                if (ExpDateVaildate.IsInValid) {
                    //alertify.error("Invalid Expiry Date");
                    //return;

                    ngModel.$setValidity("InvalidDate", false);
                } else if (!ExpDateVaildate.IsProper) {
                    //alertify.error("Enter proper expiry date");
                    //return;

                    ngModel.$setValidity("InvalidDate", false);
                } else if (ExpDateVaildate.IsPastExpDate) {
                    //alertify.error("Past Expiry Date Not Allowed");
                    //return;

                    ngModel.$setValidity("InvalidDate", false);
                } else if (ExpDateVaildate.IsCurrentMonth) {
                    //alertify.error("Current Month Exp Date Not Allowed");
                    //return;

                    ngModel.$setValidity("InvalidDate", false);
                } else {
                    ngModel.$setValidity("InvalidDate", true);
                }


                if (value === null) {
                    ngModel.$setValidity("InvalidDate", true);
                }
                return value;
            });

            //For model -> DOM validation

            ngModel.$formatters.unshift(function (value) {
                ngModel.$setValidity("InvalidDate", true);
                return value;
            });
        }
    };
}]);

eHnoteWebApp.directive("validateMfgDate", ["InventoryService", function (InventoryService) {
    return {
        require: "ngModel",
        link: function (scope, elem, attr, ngModel) {

            //For DOM -> model validation
            ngModel.$parsers.unshift(function (value) {

                value = value || null;


                var ExpDateVaildate = InventoryService.ValidateExpDate(value);




                if (ExpDateVaildate.IsInValid) {
                    //alertify.error("Invalid Expiry Date");
                    //return;

                    ngModel.$setValidity("InvalidDate", false);
                } else if (!ExpDateVaildate.IsProper) {
                    //alertify.error("Enter proper expiry date");
                    //return;

                    ngModel.$setValidity("InvalidDate", false);
                } else if (ExpDateVaildate.IsPastExpDate) {
                    //alertify.error("Past Expiry Date Not Allowed");
                    //return;

                    ngModel.$setValidity("InvalidDate", true);
                } else if (ExpDateVaildate.IsCurrentMonth) {
                    //alertify.error("Current Month Exp Date Not Allowed");
                    //return;

                    ngModel.$setValidity("InvalidDate", true);
                } else {
                    ngModel.$setValidity("InvalidDate", false);
                }


                if (value === null) {
                    ngModel.$setValidity("InvalidDate", true);
                }
                return value;
            });

            //For model -> DOM validation

            ngModel.$formatters.unshift(function (value) {
                ngModel.$setValidity("InvalidDate", true);
                return value;
            });
        }
    };
}]);
eHnoteWebApp.filter('trustAsResourceUrl', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);
//eHnoteWebApp.directive('scrollSpy', function ($window) {
//    return {
//        restrict: 'A',
//        controller: function ($scope) {
//            $scope.spies = [];
//            this.addSpy = function (spyObj) {
//                $scope.spies.push(spyObj);
//            };
//        },
//        link: function (scope, elem, attrs) {
//            var spyElems;
//            spyElems = [];

//            scope.$watch('spies', function (spies) {
//                var spy, _i, _len, _results;
//                _results = [];

//                for (_i = 0, _len = spies.length; _i < _len; _i++) {
//                    spy = spies[_i];

//                    if (spyElems[spy.id] == null) {
//                        _results.push(spyElems[spy.id] = elem.find('#' + spy.id));
//                    }
//                }
//                return _results;
//            });

//            $($window).scroll(function () {
//                var highlightSpy, pos, spy, _i, _len, _ref;
//                highlightSpy = null;
//                _ref = scope.spies;

//                // cycle through `spy` elements to find which to highlight
//                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
//                    spy = _ref[_i];
//                    spy.out();

//                    // catch case where a `spy` does not have an associated `id` anchor
//                    if (spyElems[spy.id].offset() === undefined) {
//                        continue;
//                    }

//                    if ((pos = spyElems[spy.id].offset().top) - $window.scrollY <= 0) {
//                        // the window has been scrolled past the top of a spy element
//                        spy.pos = pos;

//                        if (highlightSpy == null) {
//                            highlightSpy = spy;
//                        }
//                        if (highlightSpy.pos < spy.pos) {
//                            highlightSpy = spy;
//                        }
//                    }
//                }

//                // select the last `spy` if the scrollbar is at the bottom of the page
//                if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
//                    spy.pos = pos;
//                    highlightSpy = spy;
//                }

//                return highlightSpy != null ? highlightSpy["in"]() : void 0;
//            });
//        }
//    };
//});

//eHnoteWebApp.directive('spy', function ($location, $anchorScroll) {
//    return {
//        restrict: "A",
//        require: "^scrollSpy",
//        link: function (scope, elem, attrs, affix) {
//            elem.click(function () {
//                $location.hash(attrs.spy);
//                $anchorScroll();
//            });

//            affix.addSpy({
//                id: attrs.spy,
//                in: function () {
//                    elem.addClass('active');
//                },
//                out: function () {
//                    elem.removeClass('active');
//                }
//            });
//        }
//    };
//});
eHnoteWebApp.directive("ngEnter", function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };


});


eHnoteWebApp.directive('scrollSpy', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            var offset = parseInt(attr.scrollOffset, 10)
            if (!offset) offset = 10;
            console.log("offset:  " + offset);
            elem.scrollspy({ "offset": offset });
            scope.$watch(attr.scrollSpy, function (value) {
                $timeout(function () {
                    elem.scrollspy('refresh', { "offset": offset })
                }, 1);
            }, true);
        }
    }
});

eHnoteWebApp.directive('mdSelectMaxSelection', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, ngModel) {
            scope.$watch(function () {
                return ngModel.$modelValue;
            }, function (newValue, oldValue) {
                if (newValue && newValue.length > attrs.mdSelectMaxSelection) {
                    ngModel.$setViewValue(oldValue);
                    ngModel.$render();
                }
            });
        }
    }
});

eHnoteWebApp.directive('preventDefault', function () {
    return function (scope, element, attrs) {
        jQuery(element).click(function (event) {
            event.preventDefault();
        });
    }
});


eHnoteWebApp.directive('hcChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            options: '='
        },
        link: function (scope, element) {
            Highcharts.chart(element[0], scope.options);
        }
    };
})
// Directive for pie charts, pass in title and data only    
eHnoteWebApp.directive('hcPieChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            title: '@',
            data: '='
        },
        link: function (scope, element) {
            Highcharts.chart(element[0], {
                chart: {
                    type: 'pie'
                },
                title: {
                    text: scope.title
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        }
                    }
                },
                series: [{
                    data: scope.data
                }]
            });
        }
    };
})

eHnoteWebApp.directive('clickAnywhereButHere', function ($document) {
    return {
        restrict: 'A',
        scope: {
            callback: '=clickAnywhereButHere'
        },
        link: function (scope, element, attr, ctrl) {
            var handler = function (event) {
                if (!element[0].contains(event.target)) {
                    scope.callback(event);
                }
            };

            $document.on('click', handler);
            scope.$on('$destroy', function () {
                $document.off('click', handler);
            });
        }
    }
});

//eHnoteWebApp.directive("masonry", function ($scope, $element, $attrs) {
//    return {
//        restrict: 'AC',
//        scope: false,
//        link: function (scope, element, attrs) {
//            scope.masonry = new Masonry();
//            scope.$watch("e", function () {
//                scope.masonry = new Masonry()[0];
//                $scope.masonry.reloadItems();
//                $scope.masonry.layout();
//            })
//}

//    };
//});

eHnoteWebApp.directive("masonry", function ($parse) {
    return {
        restrict: 'AC',
        link: function (scope, elem, attrs) {
            elem.masonry({ itemSelector: '.masonry-brick' });
        }
    };
});
//eHnoteWebApp.directive('masonryBrick', function ($compile) {
//    return {
//        restrict: 'AC',
//        link: function (scope, elem, attrs) {
//            scope.$watch('$index', function (v) {
//                //elem.imagesLoaded(function () {
//                //    elem.parents('.masonry').masonry('reload');
//                //});
//                elem.parents('.masonry').masonry('reload');
//            });
//        }
//    };
//});

eHnoteWebApp.directive('clickDetectInDiv', function ($document) {
    return {
        restrict: 'A',
        scope: {
            callback: '=clickDetectInDiv'
        },
        link: function (scope, element, attr, ctrl) {
            var handler = function (event) {
                if (element[0].contains(event.target)) {
                    scope.callback(event);
                }
            };
            //link: function(scope, element, attr) {
            //    element.on('click', function (event) {
            //        scope.callback(event);
            //    })
            //};

            $document.on('click', handler);
            scope.$on('$destroy', function () {
                $document.off('click', handler);
            });
        }
    }
});

//eHnoteWebApp.directive('clickDetectDiv', function ($document) {
//    return {
//        restrict: 'A',
//        scope: {
//            callback: '=clickDetectDiv'
//        },
//        link: function (scope, elem, attrs) {
//            var handler = function (event, attrs) {
//                //if (elem[0].contains(event.target)) {
//                //    scope.callback(event);
//                //}
//                if (event.target.localName == "button" || event.target.localName == "i" || event.target.localName == "a") {
//                    scope.callback(event);
//                }
//            };
//            //elem.bind('click', function () {
//            //    scope.$apply(function () {
//            //        if ($(elem).is('div.ng-scope.ng-isolate-scope')) {
//            //            alert('matches div.clickable');
//            //        } else {
//            //            alert('does NOT matche div.clickable');
//            //        }
//            //    });
//            //});

//            $document.on('click', handler);
//            scope.$on('$destroy', function () {
//                $document.off('click', handler);
//            });
//        }
//    }
//});

//eHnoteWebApp.directive('clickDetectDiv', function ($document) {
//    return {
//        restrict: 'A',
//        scope: {
//            callback: '=clickDetectDiv'
//        },
//        link: function (scope, element, attr, ctrl) {
//            if (attr.ngClick != undefined) {
//                var fn = attr.ngClick;
//            }
//            el.on('click', function (event) {
//                scope.$apply(function () {

//                    // If no property on scope matches the passed in fn, return. 
//                    if (!scope[fn]) {
//                        return;
//                    }

//                    // Throw an error if we misused the new ngClick directive.
//                    if (typeof scope[fn] !== 'function') {
//                        throw new Error('Property ' + fn + ' is not a function on ' + scope);
//                    }

//                    // Call the passed in function with the event.
//                    scope[fn].call(null, event);
//                    scope.callback(event);
//                   });
//                });
//            var handler = function (event) {

//            };

//            $document.on('click', handler);
//            scope.$on('$destroy', function () {
//                $document.off('click', handler);
//            });
//        }
//    }
//});

eHnoteWebApp.directive("pwCanvas1", [function () {
    return {
        "restrict": "AE",
        "scope": {
            "options": "=",
            "version": "=",
            "undoclicked": "="
        },
        "link": function postLink(scope, elm) {
            var watchcount = 0;
            var isTouch = !!("ontouchstart" in window);
            var PAINT_START = isTouch ? "touchstart" : "mousedown";
            var PAINT_MOVE = isTouch ? "touchmove" : "mousemove";
            var PAINT_END = isTouch ? "touchend" : "mouseup";
            var options = scope.options;
            options.canvasId = options.customCanvasId || "pwCanvasMain";
            options.tmpCanvasId = options.customCanvasId ? options.canvasId + "Tmp" : "pwCanvasTmp";
            options.width = options.width || 500;
            options.height = options.height || 500;
            options.color = options.color || "#000";
            options.undoEnabled = options.undoEnabled || false;
            options.opacity = options.opacity || 0.9;
            options.lineWidth = options.lineWidth || 1;
            options.undo = options.undo || false;
            //options.imageSrc = 'img/banner1.jpg';
            var canvas = document.createElement("canvas");
            canvas.id = options.canvasId;
            var canvasTmp = document.createElement("canvas");
            canvasTmp.id = options.tmpCanvasId;
            var ctx = canvas.getContext("2d");
            var ctxTmp = canvasTmp.getContext("2d");
            /*angular.element(canvasTmp).css({ "position": "absolute", "top": 10, "left": 10 });*/
            angular.element(canvasTmp).css({ "position": "absolute", "top": 0, "left": 0 });
            elm.find("div").append(canvas);
            elm.find("div").append(canvasTmp);
            var point = { "x": 0, "y": 0 };
            var ppts = [];
            canvas.width = canvasTmp.width = options.width;
            canvas.height = canvasTmp.height = options.height;
            ctx.fillStyle = options.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctxTmp.globalAlpha = options.opacity;
            ctxTmp.lineJoin = ctxTmp.lineCap = "round";
            ctxTmp.lineWidth = 5;
            ctxTmp.strokeStyle = options.color;
            if (options.imageSrc) {
                var image = new Image();
                image.onload = function () {
                    scope.version = 0;
                    var canvas = ctx.canvas;
                    var hRatio = canvas.width / image.width;
                    var vRatio = canvas.height / image.height;
                    var ratio = Math.min(hRatio, vRatio);
                    var centerShift_x = (canvas.width - image.width * ratio) / 2;
                    var centerShift_y = (canvas.height - image.height * ratio) / 2;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(image, 0, 0, image.width, image.height, centerShift_x, centerShift_y, image.width * ratio, image.height * ratio);
                };
                image.crossOrigin = "anonymous";
                image.src = options.imageSrc;
                scope.$watch(function () {
                    return options.imageSrc;
                }, function (newVal) {
                    scope.options.imageSrc = newVal;
                });
            }
            scope.$watch("options.imageSrc", function (newVal) {
                if (newVal === undefined || newVal === "" || newVal === null) {
                    return;
                }
                var n = newVal.startsWith("http:");
                if (n) {
                    toDataURL(newVal, function (dataURL) {
                        scope.options.imageSrc = dataURL;
                        var image = new Image();
                        image.onload = function () {
                            var canvas = ctx.canvas;
                            var hRatio = canvas.width / image.width;
                            var vRatio = canvas.height / image.height;
                            var ratio = Math.min(hRatio, vRatio);
                            var centerShift_x = (canvas.width - image.width * ratio) / 2;
                            var centerShift_y = (canvas.height - image.height * ratio) / 2;
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            ctx.drawImage(image, 0, 0, image.width, image.height, centerShift_x, centerShift_y, image.width * ratio, image.height * ratio);
                        };
                        image.crossOrigin = "anonymous";
                        image.src = newVal;
                    });
                } else {
                    scope.options.imageSrc = newVal;
                    var image = new Image();
                    image.onload = function () {
                        var canvas = ctx.canvas;
                        var hRatio = canvas.width / image.width;
                        var vRatio = canvas.height / image.height;
                        var ratio = Math.min(hRatio, vRatio);
                        var centerShift_x = (canvas.width - image.width * ratio) / 2;
                        var centerShift_y = (canvas.height - image.height * ratio) / 2;
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(image, 0, 0, image.width, image.height, centerShift_x, centerShift_y, image.width * ratio, image.height * ratio);
                    };
                    image.crossOrigin = "anonymous";
                    image.src = newVal;
                }
            });
            function toDataURL(url, callback) {
                var xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        callback(reader.result);
                    };
                    reader.readAsDataURL(xhr.response);
                };
                xhr.open("GET", url);
                xhr.responseType = "blob";
                xhr.send();
            }
            if (options.undo) {
                var undoCache = [];
                scope.$watch(function () {
                    return undoCache.length;
                }, function (newVal) {
                    watchcount = 0;
                    //scope.undoclicked = false;
                    scope.version = newVal;
                });
                //scope.$watch("version", function (newVal) {
                //    if (scope.undoclicked) {
                //        watchcount = 0;
                //        scope.undoclicked = false;
                //    }
                //    if (watchcount === 0) {
                //        watchcount = 1;
                //        if (newVal < 0) {
                //            scope.version = 0;
                //            return;
                //        }
                //        if (newVal >= undoCache.length) {
                //            scope.version = undoCache.length;
                //            return;
                //        }
                //        undo(newVal);
                //    }
                //});
                scope.$watch("version", function (newVal) {
                    if (newVal < 0) {
                        scope.version = 0;
                        return;
                    }
                    if (newVal >= undoCache.length) {
                        scope.version = undoCache.length;
                        return;
                    }
                    undo(newVal);
                });
            }
            scope.$watch("options.lineWidth", function (newValue) {
                if (typeof newValue === "string") {
                    newValue = parseInt(newValue, 10);
                }
                if (newValue && typeof newValue === "number") {
                    ctxTmp.lineWidth = options.lineWidth = newValue;
                }
            });
            scope.$watch("options.color", function (newValue) {
                if (newValue) {
                    ctxTmp.strokeStyle = ctxTmp.fillStyle = newValue;
                }
            });
            scope.$watch("options.opacity", function (newValue) {
                if (newValue) {
                    ctxTmp.globalAlpha = newValue;
                }
            });
            var getOffset = function (elem) {
                var bbox = elem.getBoundingClientRect();
                return { left: bbox.left, top: bbox.top };
            };
            var setPointFromEvent = function (point, e) {
                if (isTouch) {
                    point.x = e.changedTouches[0].pageX - getOffset(e.target).left;
                    point.y = e.changedTouches[0].pageY - getOffset(e.target).top;
                } else {
                    var rect = canvas.getBoundingClientRect();
                    var scaleX = canvas.width / rect.width;
                    var scaleY = canvas.height / rect.height;
                    point.x = (e.clientX - rect.left) * scaleX;
                    point.y = (e.clientY - rect.top) * scaleY;
                }
            };
            var paint = function (e) {
                if (e) {
                    e.preventDefault();
                    setPointFromEvent(point, e);
                }
                ppts.push({
                    x: point.x,
                    y: point.y
                });
                if (ppts.length === 3) {
                    var b = ppts[0];
                    ctxTmp.beginPath();
                    ctxTmp.arc(b.x, b.y, ctxTmp.lineWidth / 2, 0, Math.PI * 2, !0);
                    ctxTmp.fill();
                    ctxTmp.closePath();
                    return;
                }
                ctxTmp.clearRect(0, 0, canvasTmp.width, canvasTmp.height);
                ctxTmp.beginPath();
                ctxTmp.moveTo(ppts[0].x, ppts[0].y);
                for (var i = 1; i < ppts.length - 2; i++) {
                    var c = (ppts[i].x + ppts[i + 1].x) / 2;
                    var d = (ppts[i].y + ppts[i + 1].y) / 2;
                    ctxTmp.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
                }
                ctxTmp.quadraticCurveTo(
                    ppts[i].x,
                    ppts[i].y,
                    ppts[i + 1].x,
                    ppts[i + 1].y
                );
                ctxTmp.stroke();
            };
            var copyTmpImage = function () {
                if (options.undo) {
                    scope.$apply(function () {
                        undoCache.push(ctx.getImageData(0, 0, canvasTmp.width, canvasTmp.height));
                        if (angular.isNumber(options.undo) && options.undo > 0) {
                            undoCache = undoCache.slice(-1 * options.undo);
                        }
                    });
                }
                canvasTmp.removeEventListener(PAINT_MOVE, paint, false);
                ctx.drawImage(canvasTmp, 0, 0);
                ctxTmp.clearRect(0, 0, canvasTmp.width, canvasTmp.height);
                ppts = [];
            };
            var startTmpImage = function (e) {
                e.preventDefault();
                canvasTmp.addEventListener(PAINT_MOVE, paint, false);
                setPointFromEvent(point, e);
                ppts.push({
                    "x": point.x,
                    "y": point.y
                });
                ppts.push({
                    "x": point.x,
                    "y": point.y
                });
                paint();
            };
            var initListeners = function () {
                canvasTmp.addEventListener(PAINT_START, startTmpImage, false);
                canvasTmp.addEventListener(PAINT_END, copyTmpImage, false);
                if (!isTouch) {
                    var MOUSE_DOWN;
                    document.body.addEventListener("mousedown", mousedown);
                    document.body.addEventListener("mouseup", mouseup);
                    scope.$on("$destroy", removeEventListeners);
                    canvasTmp.addEventListener("mouseenter", mouseenter);
                    canvasTmp.addEventListener("mouseleave", mouseleave);
                }
                function mousedown() {
                    MOUSE_DOWN = true;
                }
                function mouseup() {
                    MOUSE_DOWN = false;
                }
                function removeEventListeners() {
                    document.body.removeEventListener("mousedown", mousedown);
                    document.body.removeEventListener("mouseup", mouseup);
                }
                function mouseenter(e) {
                    if (MOUSE_DOWN) {
                        startTmpImage(e);
                    }
                }
                function mouseleave(e) {
                    if (MOUSE_DOWN) {
                        copyTmpImage(e);
                    }
                }
            };
            var undo = function (version) {
                if (undoCache.length > 0) {
                    ctx.putImageData(undoCache[version], 0, 0);
                    undoCache = undoCache.slice(0, version);
                }
            };
            initListeners();
        }
    };
}]);


eHnoteWebApp.directive("commasplit", function () {
    return {
        "require": "ngModel",
        "link": function (scope, element, attrs, modelCtrl) {

            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return '';
                var transformedInput = inputValue;
                var List = transformedInput.split(',') || [];
                if (List.length < 6) {

                } else if (List.length > 5) {
                    transformedInput = List[0] + ',' + List[1] + ',' + List[2] + ',' + List[3] + ',' + List[4];
                }

                modelCtrl.$setViewValue(transformedInput);
                modelCtrl.$render();
                return transformedInput;
            });
        }
    };
});


//eHnoteWebApp.config(function ($provide) {
//    $provide.decorator('taOptions', ['taRegisterTool', 'taSelection', '$delegate', '$uibModal', '$compile', 'textAngularManager', function (taRegisterTool, taSelection, taOptions, $uibModal, $compile, textAngularManager) {
//        // $delegate is the taOptions we are decorating
//        // register the tool with textAngular

//        taRegisterTool('backgroundColor', {
//            display: "<div spectrum-colorpicker ng-model='color' on-change='!!color && action(color)' format='\"hex\"' options='options'></div>",
//            action: function (color) {
//                var me = this;
//                if (!this.$editor().wrapSelection) {
//                    setTimeout(function () {
//                        me.action(color);
//                    }, 100)
//                } else {
//                    return this.$editor().wrapSelection('backColor', color);
//                }
//            },
//            options: {
//                replacerClassName: 'fa fa-paint-brush', showButtons: false
//            },
//            color: "#fff"
//        });
//        taRegisterTool('fontColor', {
//            display: "<spectrum-colorpicker trigger-id='{{trigger}}' ng-model='color' on-change='!!color && action(color)' format='\"hex\"' options='options'></spectrum-colorpicker>",
//            action: function (color) {
//                var me = this;
//                if (!this.$editor().wrapSelection) {
//                    setTimeout(function () {
//                        me.action(color);
//                    }, 100)
//                } else {
//                    return this.$editor().wrapSelection('foreColor', color);
//                }
//            },
//            options: {
//                replacerClassName: 'fa fa-font', showButtons: false
//            },
//            color: "#000"
//        });


//        taRegisterTool('fontName', {
//            display: "<span class='bar-btn-dropdown dropdown'>" +
//                "<button class='btn btn-blue dropdown-toggle' type='button' ng-disabled='showHtml()' style='padding-top: 4px'><i class='fa fa-font'></i><i class='fa fa-caret-down'></i></button>" +
//                "<ul class='dropdown-menu'><li ng-repeat='o in options'><button class='btn btn-blue checked-dropdown' style='font-family: {{o.css}}; width: 100%' type='button' ng-click='action($event, o.css)'><i ng-if='o.active' class='fa fa-check'></i>{{o.name}}</button></li></ul></span>",
//            action: function (event, font) {
//                //Ask if event is really an event.
//                if (!!event.stopPropagation) {
//                    //With this, you stop the event of textAngular.
//                    event.stopPropagation();
//                    //Then click in the body to close the dropdown.
//                    $("body").trigger("click");
//                }
//                return this.$editor().wrapSelection('fontName', font);
//            },
//            options: [
//                { name: 'Sans-Serif', css: 'Arial, Helvetica, sans-serif' },
//                { name: 'Serif', css: "'times new roman', serif" },
//                { name: 'Wide', css: "'arial black', sans-serif" },
//                { name: 'Narrow', css: "'arial narrow', sans-serif" },
//                { name: 'Comic Sans MS', css: "'comic sans ms', sans-serif" },
//                { name: 'Courier New', css: "'courier new', monospace" },
//                { name: 'Garamond', css: 'garamond, serif' },
//                { name: 'Georgia', css: 'georgia, serif' },
//                { name: 'Tahoma', css: 'tahoma, sans-serif' },
//                { name: 'Trebuchet MS', css: "'trebuchet ms', sans-serif" },
//                { name: "Helvetica", css: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
//                { name: 'Verdana', css: 'verdana, sans-serif' },
//                { name: 'Proxima Nova', css: 'proxima_nova_rgregular' }
//            ]
//        });


//        taRegisterTool('fontSize', {
//            display: "<span class='bar-btn-dropdown dropdown'>" +
//                "<button class='btn btn-blue dropdown-toggle' type='button' ng-disabled='showHtml()' style='padding-top: 4px'><i class='fa fa-text-height'></i><i class='fa fa-caret-down'></i></button>" +
//                "<ul class='dropdown-menu'><li ng-repeat='o in options'><button class='btn btn-blue checked-dropdown' style='font-size: {{o.css}}; width: 100%' type='button' ng-click='action($event, o.value)'><i ng-if='o.active' class='fa fa-check'></i> {{o.name}}</button></li></ul>" +
//                "</span>",
//            action: function (event, size) {
//                //Ask if event is really an event.
//                if (!!event.stopPropagation) {
//                    //With this, you stop the event of textAngular.
//                    event.stopPropagation();
//                    //Then click in the body to close the dropdown.
//                    $("body").trigger("click");
//                }
//                return this.$editor().wrapSelection('fontSize', parseInt(size));
//            },
//            options: [
//                { name: 'xx-small', css: 'xx-small', value: 1 },
//                { name: 'x-small', css: 'x-small', value: 2 },
//                { name: 'small', css: 'small', value: 3 },
//                { name: 'medium', css: 'medium', value: 4 },
//                { name: 'large', css: 'large', value: 5 },
//                { name: 'x-large', css: 'x-large', value: 6 },
//                { name: 'xx-large', css: 'xx-large', value: 7 }

//            ]
//        });
//        /* taOptions.toolbar[1].push('backgroundColor', 'fontColor', 'fontName', 'fontSize');*/

//        taRegisterTool('insertDynamicFields', {
//            buttontext: 'Add Field',
//            tooltiptext: 'Add Custom Field',
//            action: function () {


//                var mInstanceAdd = $uibModal.open({
//                    "templateUrl": "templates/settings/AdditionalFieldsPopup.html",
//                    "backdrop": "static",
//                    "keyboard": false,
//                    "size": "lg",
//                    "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteSettingsDataService) {
//                        $scope.tabno = 1;
//                        $scope.SelectedFieldItem = "";
//                        $scope.PatientFieldsArray = [
//                            {
//                                "Id": 1,
//                                "Name": "PatientName",
//                                "Value": "#PatientName#"
//                            },
//                            {
//                                "Id": 2,
//                                "Name": "PatientMrNo",
//                                "Value": "#PatientMrNo#"
//                            },
//                            {
//                                "Id": 3,
//                                "Name": "PatientMobile",
//                                "Value": "#PatientMobile#"
//                            }
//                        ];

//                        $scope.DoctorFieldsArray = [
//                            {
//                                "Id": 1,
//                                "Name": "Doctor Name",
//                                "Value": "#DoctorName#"
//                            },
//                            {
//                                "Id": 2,
//                                "Name": "Doctor Mobile",
//                                "Value": "#DoctorMobile#"
//                            },
//                            {
//                                "Id": 3,
//                                "Name": "Doctor Specialization",
//                                "Value": "#DoctorSpecialization#"
//                            }
//                        ];

//                        $scope.HospitalFieldsArray = [
//                            {
//                                "Id": 1,
//                                "Name": "Hospital Name",
//                                "Value": "#HospitalName#"
//                            },
//                            {
//                                "Id": 2,
//                                "Name": "Hospital Mobile",
//                                "Value": "#HospitalMobile#"
//                            },
//                            {
//                                "Id": 3,
//                                "Name": "Hospital Address",
//                                "Value": "#HospitalAddress#"
//                            }
//                        ];

//                        $scope.changeFieldValue = function (text) {
//                            console.log(text);
//                            $scope.SelectedFieldItem = text;
//                        };


//                        $scope.SaveFieldDetails = function (resp) {
//                            console.log(resp);
//                            $uibModalInstance.close(resp);
//                        }

//                        $scope.ClearDetails = function () {
//                            $uibModalInstance.close("Close");
//                        };


//                        $scope.createfeeuibclose = function () {
//                            $uibModalInstance.dismiss("cancel");
//                        };

//                        $scope.MainFieldsArray = [];
//                        $scope.GetMasterConsentFields = function () {
//                            $scope.FieldCategoriesArray = [];
//                            $scope.FieldValuesArray = [];
//                            $scope.MainFieldsArray = [];
//                            eHnoteSettingsDataService.GetMasterConsentFields().success(function (data) {
//                                $scope.MainFieldsArray = data.FieldsArray;
//                            }).error(function (error) {
//                                alertify.error("Getting MasterConsentFields failed");
//                            });


//                        };
//                        $scope.GetMasterConsentFields();
//                    }
//                });

//                mInstanceAdd.result.then(function (resp) {
//                    console.log(resp);


//                    var htmltext = "<span id='N" + resp + "'> #" + resp + "# </span>";




//                    var tsthis = textAngularManager.retrieveEditor('htmlcontentFrom');
//                    console.log(tsthis)




//                    var element = $compile(htmltext)(tsthis.scope.$parent);

//                    tsthis.scope.displayElements.text[0].focus();
//                    insertNodeAtCursor(element[0]);
//                    return placeCaretAtEnd(element[0])

//                }, function (cancel) {
//                    console.log(cancel);
//                });


//                function insertTextAtCursor(text) {
//                    var sel, range;
//                    if (window.getSelection) {
//                        sel = window.getSelection();
//                        if (sel.getRangeAt && sel.rangeCount) {
//                            range = sel.getRangeAt(0);
//                            range.deleteContents();
//                            range.insertNode(document.createTextNode(text));
//                        }
//                    } else if (document.selection && document.selection.createRange) {
//                        document.selection.createRange().text = text;
//                    }
//                }

//                function moveCaret(charCount) {
//                    var sel, range;
//                    if (window.getSelection) {
//                        sel = window.getSelection();
//                        if (sel.rangeCount > 0) {
//                            var textNode = sel.focusNode;
//                            sel.collapse(textNode.nextSibling, charCount);
//                        }
//                    } else if ((sel = window.document.selection)) {
//                        if (sel.type != "Control") {
//                            range = sel.createRange();
//                            range.move("character", charCount);
//                            range.select();
//                        }
//                    }
//                }


//                function insertNodeAtCursor(node) {
//                    var sel, range, html;
//                    if (window.getSelection) {
//                        sel = window.getSelection();
//                        if (sel.getRangeAt && sel.rangeCount) {
//                            sel.getRangeAt(0).insertNode(node);
//                        }
//                    } else if (document.selection && document.selection.createRange) {
//                        range = document.selection.createRange();
//                        html = (node.nodeType == 3) ? node.data : node.outerHTML;
//                        range.pasteHTML(html);
//                    }
//                }
//                function placeCaretAtEnd(el) {
//                    el.focus();
//                    if (typeof window.getSelection != "undefined"
//                        && typeof document.createRange != "undefined") {
//                        var range = document.createRange();
//                        range.setStartAfter(el);
//                        range.setEndAfter(el);
//                        var sel = window.getSelection();
//                        sel.removeAllRanges();
//                        sel.addRange(range);
//                    } else if (typeof document.body.createTextRange != "undefined") {
//                        var textRange = document.body.createTextRange();
//                        textRange.moveToElementText(el);
//                        textRange.collapse(false);
//                        textRange.select();
//                    }
//                }


//                //var text = "Date";
//                ///*      insertTextAtCursor(String.fromCharCode(169));*/
//                //insertTextAtCursor(text);
//                //return moveCaret(1);
//            },
//        });


//        taRegisterTool('insertDynamicSignature', {
//            buttontext: 'Add Sign',
//            tooltiptext: 'Add Signature From Topaz',
//            action: function () {


//                var mInstanceAdd = $uibModal.open({
//                    "templateUrl": "templates/settings/AdditionalSigantureFieldPopup.html",
//                    "backdrop": "static",
//                    "keyboard": false,
//                    "controller": function ($scope, $uibModal, $uibModalInstance) {
//                        $scope.tabno = 1;
//                        $scope.SelectedFieldItem = "";



//                        var tmr;

//                        var resetIsSupported = false;

//                        console.log(taSelection)


//                        function onLoadSIg() {
//                            if (IsSigWebInstalled()) {
//                                resetIsSupported = GetResetSupported();
//                                if (!resetIsSupported) {
//                                    var sigweb_link = document.createElement("a");
//                                    sigweb_link.href = "https://www.topazsystems.com/software/sigweb.exe";
//                                    sigweb_link.innerHTML = "https://www.topazsystems.com/software/sigweb.exe";

//                                    var note = document.getElementById("sigWebVrsnNote");
//                                    note.innerHTML = "There is a newer version of SigWeb available here: ";
//                                    note.appendChild(sigweb_link);
//                                }
//                            }
//                            else {
//                                alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
//                            }
//                        }
//                        onLoadSIg();


//                        function GetResetSupported() {
//                            var minSigWebVersionResetSupport = "1.6.4.0";

//                            if (isOlderSigWebVersionInstalled(minSigWebVersionResetSupport)) {
//                                console.log("Old SigWeb version installed.");
//                                return false;
//                            }
//                            return true;
//                        }

//                        function isOlderSigWebVersionInstalled(cmprVer) {
//                            var sigWebVer = GetSigWebVersion();
//                            if (sigWebVer != "") {
//                                return isOlderVersion(cmprVer, sigWebVer);
//                            } else {
//                                return false;
//                            }
//                        }

//                        function isOlderVersion(oldVer, newVer) {
//                            const oldParts = oldVer.split('.')
//                            const newParts = newVer.split('.')
//                            for (var i = 0; i < newParts.length; i++) {
//                                const a = parseInt(newParts[i]) || 0
//                                const b = parseInt(oldParts[i]) || 0
//                                if (a < b) return true
//                                if (a > b) return false
//                            }
//                            return false;
//                        }

//                        $scope.signPlusObj = {
//                            "readyToSign": false,
//                            "SignString": ""
//                        }



//                        $scope.OnSign = function () {
//                            if (IsSigWebInstalled()) {
//                                var ctx = document.getElementById('signPadUD').getContext('2d');
//                                SetDisplayXSize(500);
//                                SetDisplayYSize(100);
//                                SetTabletState(0, tmr);
//                                SetJustifyMode(0);
//                                ClearTablet();
//                                SetKeyString("0000000000000000");
//                                SetEncryptionMode(0);
//                                if (tmr == null) {
//                                    tmr = SetTabletState(1, ctx, 50);
//                                }
//                                else {
//                                    SetTabletState(0, tmr);
//                                    tmr = null;
//                                    tmr = SetTabletState(1, ctx, 50);
//                                }
//                                $scope.signPlusObj.readyToSign = true;
//                            } else {
//                                alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
//                            }
//                        };

//                        $scope.OnClear = function () {
//                            ClearTablet();
//                            $uibModalInstance.close("Close");
//                        }


//                        $scope.saveDrawNew = function () {
//                            if (NumberOfTabletPoints() == 0) {
//                                alert("Please sign before continuing");
//                            }
//                            else {
//                                SetTabletState(0, tmr);


//                                //NOW, EXTRACT THE SIGNATURE IN THE TOPAZ BIOMETRIC FORMAT -- SIGSTRING
//                                //OR AS A BASE64-ENCODED PNG IMAGE
//                                //OR BOTH

//                                //********************USE THIS SECTION IF YOU WISH TO APPLY AUTOKEY TO YOUR TOPAZ SIGNATURE
//                                //READ ABOUT AUTOKEY AND THE TOPAZ SIGNATURE FORMAT HERE: http://topazsystems.com/links/robustsignatures.pdf
//                                //AUTOKEY IS CRITICAL TO SAVING AN eSIGN-COMPLIANT SIGNATURE
//                                //AUTOKEY ONLY APPLIES TO THE TOPAZ-FORMAT SIGSTRING AND DOES NOT APPLY TO AN IMAGE OF THE SIGNATURE
//                                //AUTOKEY ALLOWS THE DEVELOPER TO CRYPTOGRAPHICALLY BIND THE TOPAZ SIGNATURE TO A SET OF DATA
//                                //THE PURPOSE OF THIS IS TO SHOW THAT THE SIGNATURE IS BEING APPLIED TO THE DATA YOU PASS IN USING AutoKeyAddData()
//                                //IN GENERAL TOPAZ RECOMMENDS REPLICATING A TRADITIONAL 'PAPER AND PEN' APPROACH
//                                //IN OTHER WORDS, IF YOU WERE TO PRINT OUT ON PAPER THE TERMS/INFORMATION THE SIGNER IS SUPPOSED TO READ AND AGREE WITH
//                                //THE DATA ON THIS PAPER IS WHAT SHOULD IN WHOLE BE PASSED INTO AUTOKEYADDANSIDATA() DIGITALLY
//                                //THE TOPAZ SIGSTRING IS THEN BOUND TO THIS DATA, AND CAN ONLY BE SUCCESSFULLY DECRYPTED LATER USING THIS DATA
//                                //AUTOKEYADDDATA IS DEPRECATED AND REPLACED BY AUTOKEYADDANSIDATA

//                                var CryptoData = "";
//                                CryptoData = "This represents sample data the signer reads and is agreeing to when signing.";
//                                CryptoData = CryptoData + "Concatenate all this data into a single variable.";
//                                AutoKeyAddANSIData(CryptoData);
//                                SetEncryptionMode(2);

//                                //*******END AUTOKEY SECTION


//                                //NOTE THAT THE AUTOKEY SECTION ABOVE IS NOT REQUIRED TO RETURN A TOPAZ SIGSTRING
//                                //BUT IT IS STRONGLY RECOMMENDED IF YOU REQUIRE eSIGN COMPLIANCE
//                                //RETURN THE TOPAZ-FORMAT SIGSTRING
//                                SetSigCompressionMode(1);
//                                //alert("KEYSTRING:" + GetKeyString());
//                                $scope.signPlusObj.SignString = GetSigString();
//                                //THIS RETURNS THE SIGNATURE IN TOPAZ'S OWN FORMAT WITH BIOMETRIC INFORMATION


//                                //TO RETURN THIS SIGSTRING LATER TO A NEW WEB PAGE USING SIGWEB, REPEAT THE CODE FROM THIS FUNCTION ABOVE STARTING AFTER SetTabletState(0, tmr)
//                                //BUT AT THE END USE SetSigString() INSTEAD OF GetSigString()
//                                //NOTE THAT SetSigString() TAKES 2 ARGUMENTS
//                                //SetSigString(str SigString, context canvas)

//                                //TO RETURN A BASE64-ENCODED PNG IMAGE OF THE SIGNATURE
//                                SetImageXSize(500);
//                                SetImageYSize(100);
//                                SetImagePenWidth(5);
//                                GetSigImageB64(SignedImageCallback);
//                                function SignedImageCallback(str) {

//                                    var convertedSignatureObj = "data:image/png;base64," + str;



//                                    $scope.signPlusObj.readyToSign = false;
//                                    // ClearTablet();
//                                    const canvas = document.getElementById("signPadUD");
//                                    const ctx = canvas.getContext("2d");
//                                    ctx.clearRect(0, 0, canvas.width, canvas.height);

//                                    var resp = '<img src="' + convertedSignatureObj + '">';
//                                    console.log(resp);
//                                    $uibModalInstance.close(resp);

//                                }


//                            }
//                        }











//                    }
//                });

//                mInstanceAdd.result.then(function (resp) {
//                    console.log(resp);
//                    //var text = resp;

//                    //insertTextAtCursor(text);
//                    //return moveCaret(1);
//                    var tsthis = textAngularManager.retrieveEditor('htmlcontents');
//                    console.log(tsthis)




//                    var element = $compile(resp)(tsthis.scope.$parent);

//                    tsthis.scope.displayElements.text[0].focus();
//                    insertNodeAtCursor(element[0]);
//                    return placeCaretAtEnd(element[0])


//                    /*   return tsthis.scope.wrapSelection('insertHtml', resp);*/

//                }, function (cancel) {
//                    console.log(cancel);
//                });







//                function insertNodeAtCursor(node) {
//                    var sel, range, html;
//                    if (window.getSelection) {
//                        sel = window.getSelection();
//                        if (sel.getRangeAt && sel.rangeCount) {
//                            sel.getRangeAt(0).insertNode(node);
//                        }
//                    } else if (document.selection && document.selection.createRange) {
//                        range = document.selection.createRange();
//                        html = (node.nodeType == 3) ? node.data : node.outerHTML;
//                        range.pasteHTML(html);
//                    }
//                }
//                function placeCaretAtEnd(el) {
//                    el.focus();
//                    if (typeof window.getSelection != "undefined"
//                        && typeof document.createRange != "undefined") {
//                        var range = document.createRange();
//                        range.setStartAfter(el);
//                        range.setEndAfter(el);
//                        var sel = window.getSelection();
//                        sel.removeAllRanges();
//                        sel.addRange(range);
//                    } else if (typeof document.body.createTextRange != "undefined") {
//                        var textRange = document.body.createTextRange();
//                        textRange.moveToElementText(el);
//                        textRange.collapse(false);
//                        textRange.select();
//                    }
//                }

//                //var text = "Date";
//                ///*      insertTextAtCursor(String.fromCharCode(169));*/
//                //insertTextAtCursor(text);
//                //return moveCaret(1);
//            },
//        });

//        taOptions.toolbar[1].push('backgroundColor', 'fontColor', 'fontName', 'fontSize', 'insertDynamicFields', 'insertDynamicSignature');

//        return taOptions;
//    }]);
//});

eHnoteWebApp.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];
        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var keys = Object.keys(props);
                var prop = keys[0];
                var text = props[prop].toLowerCase();
                if (item[prop].toString().toLowerCase().indexOf(text) === 0) {
                    out.push(item);
                }
            });
        } else {
            out = items;
        }
        return out;
    };
});

eHnoteWebApp.directive('dropdownToggle', ['$document', '$location', function ($document, $location) {
    var openElement = null,
        closeMenu = angular.noop;
    return {
        restrict: 'CA',
        link: function (scope, element, attrs) {
            scope.$watch('$location.path', function () { closeMenu(); });
            element.parent().bind('click', function () { closeMenu(); });
            element.bind('click', function (event) {

                var elementWasOpen = (element === openElement);

                event.preventDefault();
                event.stopPropagation();

                if (!!openElement) {
                    closeMenu();
                }

                if (!elementWasOpen && !element.hasClass('disabled') && !element.prop('disabled')) {
                    element.parent().addClass('open');
                    openElement = element;
                    closeMenu = function (event) {
                        if (event) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        $document.unbind('click', closeMenu);
                        element.parent().removeClass('open');
                        closeMenu = angular.noop;
                        openElement = null;
                    };
                    $document.bind('click', closeMenu);
                }
            });
        }
    };
}]);

eHnoteWebApp.directive("specialOnly", ["alertify", function (alertify) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return '';
                var transformedInput = inputValue.replace(/[^a-zA-Z0-9 ()/,&. /-]/g, "");
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                    alertify.error("Only Characters Allowed are & ,.()/ A-Z ,0-9 ");
                }  
                return transformedInput;
            });
        }
    };
}]);

/* Task 13 - passcode boxes inside a form.
   Chrome pops its saved-credential list over any type="password" field, which is wrong for an
   inline passcode box and hides the row behind it. Where the browser can mask a plain text input
   (-webkit-text-security: every Chromium and Safari) we switch to that, so the value is still
   hidden but the password manager never engages. Where it is not supported the field is left as a
   real password box, so the code is never shown in the clear. */
eHnoteWebApp.directive("maskedCode", [function () {
    return {
        restrict: "A",
        link: function (scope, element) {
            var el = element[0];
            var CanMaskText = !!(window.CSS && CSS.supports &&
                (CSS.supports("-webkit-text-security", "disc") || CSS.supports("text-security", "disc")));
            if (!CanMaskText) { el.type = "password"; return; }
            el.type = "text";
            el.setAttribute("autocomplete", "off");
            el.setAttribute("autocorrect", "off");
            el.setAttribute("autocapitalize", "off");
            el.setAttribute("spellcheck", "false");
            el.style.webkitTextSecurity = "disc";
            el.style.textSecurity = "disc";
        }
    };
}]);

eHnoteWebApp.directive("allowhyphen", [function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return '';
                var transformedInput = inputValue.replace(/[^a-zA-Z0-9\s.-]/g, "");
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);


eHnoteWebApp.directive("eprescriptionSplchars", [function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return '';
                var transformedInput = inputValue.replace(/[^a-zA-Z0-9\s.-]/g, "");
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);

eHnoteWebApp.directive("datepickeruniversal", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "mm-dd-yy", //"M-dd-yy", //"dd-M-yy",
                changeYear: true,
                changeMonth: true,
                yearRange: "-25:+25",
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);


eHnoteWebApp.directive("datepickeruniversalfromandtodate", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        scope: {
            mindate: "@",  // Binding for minimum date
        },
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };

            var parseDate = function (dateStr) {
                var parts = dateStr.split("-");
                return new Date(parts[2], parts[0] - 1, parts[1]);  // Convert string to Date object
            };

            // Watch for changes in the mindate (From Date)
            scope.$watch("mindate", function (newValue) {
                var minDate = newValue ? parseDate(newValue) : null;
                if (minDate) {
                    elem.datepicker("option", "minDate", minDate);  // Set minDate for the datepicker
                }
            });

            var options = {
                dateFormat: "mm-dd-yy",   // Date format
                changeYear: true,         // Allow year changes
                changeMonth: true,        // Allow month changes
                onSelect: function (dateText) {
                    updateModel(dateText);  // Update the model when date is selected
                }
            };

            elem.datepicker(options);  // Initialize the datepicker
        }
    };
}]);

eHnoteWebApp.directive('defaultDateRange', function () {
    return {
        restrict: 'A',
        scope: {
            fromModel: '=',
            toModel: '='
        },
        link: function (scope) {
            function setDefaultDates() {
                const today = new Date();

                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

                if (!scope.fromModel) {
                    scope.fromModel = formatDate(firstDay);
                }

                if (!scope.toModel) {
                    scope.toModel = formatDate(lastDay);
                }
            }

            function formatDate(date) {
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const dd = String(date.getDate()).padStart(2, '0');
                const yyyy = date.getFullYear();
                return mm + '-' + dd + '-' + yyyy;
            }

            setDefaultDates();
        }
    };
});


eHnoteWebApp.directive("datepickeruniversaldate", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        scope: {
            mindate: "=" 
        },
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };

            var currentDate = new Date();

            scope.$watch("mindate", function (newValue) {
                var minDate = newValue || currentDate;
                elem.datepicker("option", "minDate", minDate);
            });

            var options = {
                dateFormat: "mm-dd-yy",
                changeYear: true,
                changeMonth: true,
                minDate: currentDate, // initial value
                yearRange: "-25:+25",
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };

            elem.datepicker(options);
        }
    };
}]);
eHnoteWebApp.directive("datepickeruniversaldateNew", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        scope: {
            appointmentdate: "="  // pass appointment date
        },
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };

            function getMinAndMaxDates() {
                var today = new Date();
                var appointment = scope.appointmentdate ? new Date(scope.appointmentdate) : today;

                var minDate = appointment < today ? appointment : today;
                var maxDate = appointment > today ? appointment : today;

                return {
                    minDate: minDate,
                    maxDate: maxDate
                };
            }

            var dateRange = getMinAndMaxDates();

            var options = {
                dateFormat: "mm-dd-yy",
                changeYear: true,
                changeMonth: true,
                minDate: dateRange.minDate,
                maxDate: dateRange.maxDate,
                yearRange: "-25:+25",
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };

            // Initialize datepicker
            elem.datepicker(options);

            // Watch for changes in appointment date
            scope.$watch("appointmentdate", function () {
                var updatedRange = getMinAndMaxDates();
                elem.datepicker("option", "minDate", updatedRange.minDate);
                elem.datepicker("option", "maxDate", updatedRange.maxDate);
            });
        }
    };
}]);


eHnoteWebApp.directive("datepickeruniversaldatelogs", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        scope: {
            mindate: "@"
        },
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };

            var parseDate = function (dateStr) {
                var parts = dateStr.split("-");
                return new Date(parts[2], parts[0] - 1, parts[1]); // Parsing in mm-dd-yyyy format
            };

            var currentDate = new Date();

            scope.$watch("mindate", function (newValue) {
                var minDate = newValue ? parseDate(newValue) : null;
                elem.datepicker("option", "minDate", minDate);
            });

            var options = {
                dateFormat: "mm-dd-yy", // Setting the format to mm-dd-yy
                changeYear: true,
                changeMonth: true,
                maxDate: currentDate, // Disable future dates
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    };
}]);



eHnoteWebApp.directive('bindValueTo', function () {
    return {
        restrict: 'A',

        link: function ($scope, $element, $attrs) {

            var prop = capitalize($attrs.bindValueTo),
                getter = 'get' + prop,
                setter = 'set' + prop;

            $element.on('change keyup select', function () {
                if ($element[0].type !== 'checkbox') {
                    $scope[setter] && $scope[setter](this.value);
                }
            });

            $element.on('click', function () {
                if ($element[0].type === 'checkbox') {
                    if ($element[0].checked) {
                        $scope[setter] && $scope[setter](true);
                    }
                    else {
                        $scope[setter] && $scope[setter](false);
                    }
                }
            })

            $scope.$watch($scope[getter], function (newVal) {
                if ($element[0].type === 'radio') {
                    var radioGroup = document.getElementsByName($element[0].name);
                    for (var i = 0, len = radioGroup.length; i < len; i++) {
                        radioGroup[i].checked = radioGroup[i].value === newVal;
                    }
                }
                else if ($element[0].type === 'checkbox') {
                    $element[0].checked = newVal;
                }
                else {
                    $element.val(newVal);
                }
            });
        }
    };
});

eHnoteWebApp.directive('objectButtonsEnabled', function () {
    return {
        restrict: 'A',

        link: function ($scope, $element, $attrs) {
            $scope.$watch($attrs.objectButtonsEnabled, function (newVal) {

                $($element).find('.btn-object-action')
                    .prop('disabled', !newVal);
            });
        }
    };
});

eHnoteWebApp.directive("drawing", function () {
    return {
        restrict: "A",
        link: function (scope, element) {
            var ctx = element[0].getContext('2d');
            scope.drawingCanvas = element.find('canvas')[1];

            var drawing = false;

            var lastX;
            var lastY;
            var currentX;
            var currentY;

            element.bind('mousedown', function (event) {
                if (event.offsetX !== undefined) {
                    lastX = event.offsetX;
                    lastY = event.offsetY;
                } else {
                    lastX = event.layerX - event.currentTarget.offsetLeft;
                    lastY = event.layerY - event.currentTarget.offsetTop;
                }

                ctx.beginPath();

                drawing = true;
            });
            element.bind('mousemove', function (event) {
                if (drawing) {

                    if (event.offsetX !== undefined) {
                        currentX = event.offsetX;
                        currentY = event.offsetY;
                    } else {
                        currentX = event.layerX - event.currentTarget.offsetLeft;
                        currentY = event.layerY - event.currentTarget.offsetTop;
                    }

                    draw(lastX, lastY, currentX, currentY);

                    lastX = currentX;
                    lastY = currentY;
                }

            });
            element.bind('mouseup', function (event) {
                drawing = false;
            });

            function draw(lX, lY, cX, cY) {

                /*  ctx.moveTo(lX, lY);
  
                  ctx.lineTo(cX, cY);
  
                  ctx.strokeStyle = "#4bf";
  
                  ctx.stroke();
  
                  var objMoveTo;
                  var objLineTo;
  
                  objMoveTo = { "lx": lX, "ly": lY };
                  objLineTo = { "cx": cX, "cy": cY };
  
                  scope.moveToList.push(objMoveTo);
                  scope.lineToList.push(objLineTo);*/
                // line from
                ctx.moveTo(lX, lY);
                // to
                ctx.lineTo(cX, cY);
                // color
                ctx.strokeStyle = "#000000"; //"#32f819";//"#4bf";
                // draw it
                ctx.stroke();
            }





        }

    };

});

 
eHnoteWebApp.directive("touchDrawing", function () {
    return {
        restrict: "A",
        link: function (scope, element) {
            const canvas = element[0];
            const context = canvas.getContext('2d');
            let offsetX;
            let offsetY;
            const ongoingTouches = [];

            canvas.addEventListener('touchstart', handleStart);
            canvas.addEventListener('touchend', handleEnd);
            canvas.addEventListener('touchcancel', handleCancel);
            canvas.addEventListener('touchmove', handleMove);

            function handleStart(evt) {
                evt.preventDefault();
                const touches = evt.changedTouches;
                offsetX = canvas.getBoundingClientRect().left;
                offsetY = canvas.getBoundingClientRect().top;
                for (let i = 0; i < touches.length; i++) {
                    ongoingTouches.push(copyTouch(touches[i]));
                }
            }

            function handleMove(evt) {
                evt.preventDefault();
                const touches = evt.changedTouches;
                for (let i = 0; i < touches.length; i++) {
                    const color = scope.selColor || '#000000'; // Default color if not set
                    const idx = ongoingTouchIndexById(touches[i].identifier);
                    if (idx >= 0) {
                        context.beginPath();
                        context.moveTo(ongoingTouches[idx].clientX - offsetX, ongoingTouches[idx].clientY - offsetY);
                        context.lineTo(touches[i].clientX - offsetX, touches[i].clientY - offsetY);
                        context.lineWidth = scope.selWidth || 2; // Default width if not set
                        context.strokeStyle = color;
                        context.lineJoin = "round";
                        context.closePath();
                        context.stroke();
                        ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
                    }
                }
            }

            function handleEnd(evt) {
                evt.preventDefault();
                const touches = evt.changedTouches;
                for (let i = 0; i < touches.length; i++) {
                    const color = scope.selColor || '#000000'; // Default color if not set
                    let idx = ongoingTouchIndexById(touches[i].identifier);
                    if (idx >= 0) {
                        context.lineWidth = scope.selWidth || 2; // Default width if not set
                        context.fillStyle = color;
                        ongoingTouches.splice(idx, 1);  // remove it; we're done
                    }
                }
            }

            function handleCancel(evt) {
                evt.preventDefault();
                const touches = evt.changedTouches;
                for (let i = 0; i < touches.length; i++) {
                    let idx = ongoingTouchIndexById(touches[i].identifier);
                    ongoingTouches.splice(idx, 1);  // remove it; we're done
                }
            }

            function copyTouch({ identifier, clientX, clientY }) {
                return { identifier, clientX, clientY };
            }

            function ongoingTouchIndexById(idToFind) {
                for (let i = 0; i < ongoingTouches.length; i++) {
                    const id = ongoingTouches[i].identifier;
                    if (id === idToFind) {
                        return i;
                    }
                }
                return -1;    // not found
            }

            function clearArea() {
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            }
        }
    };
});

/*
 * canvas-touch-draw="<enabledExpr>"
 *      touch-draw-color="<colourExpr>"   (optional, default #000000)
 *      touch-draw-width="<widthExpr>"    (optional, default 5)
 *
 * Finger/stylus drawing for the image-viewer canvases (iPad).
 *
 * Distinct from the `touchDrawing` signature-pad directive: that one draws on
 * every touch and always swallows the gesture, which is right for a signature
 * box but wrong here - these canvases must only draw while the pen tool is
 * active, and must leave pinch/scroll alone otherwise. It also scales client
 * coordinates into the canvas backing store, which the viewers resize at runtime.
 */
eHnoteWebApp.directive('canvasTouchDraw', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var canvas = element[0];
            if (!canvas || !canvas.getContext) { return; }

            var ctx = canvas.getContext('2d');
            var ongoing = {}; // touch identifier -> last point

            function isEnabled() {
                if (!attrs.canvasTouchDraw) { return true; }
                return !!scope.$eval(attrs.canvasTouchDraw);
            }

            function penColor() {
                var c = attrs.touchDrawColor ? scope.$eval(attrs.touchDrawColor) : null;
                return c || '#000000';
            }

            function penWidth() {
                var w = attrs.touchDrawWidth ? scope.$eval(attrs.touchDrawWidth) : null;
                return w || 5;
            }

            // Client coords -> canvas backing-store coords. The viewer sets
            // canvas.width/height from the panel size, so CSS and backing size
            // can diverge; without this the stroke lags behind the finger.
            function toCanvasPoint(touch) {
                var rect = canvas.getBoundingClientRect();
                var scaleX = rect.width ? (canvas.width / rect.width) : 1;
                var scaleY = rect.height ? (canvas.height / rect.height) : 1;
                return {
                    x: (touch.clientX - rect.left) * scaleX,
                    y: (touch.clientY - rect.top) * scaleY
                };
            }

            function handleStart(evt) {
                if (!isEnabled()) { return; }
                // Single finger only. A second finger means the user is pinching,
                // not drawing - tracking it would leave stray strokes on the image.
                if (evt.touches && evt.touches.length !== 1) {
                    ongoing = {};
                    return;
                }
                evt.preventDefault();
                var touches = evt.changedTouches;
                for (var i = 0; i < touches.length; i++) {
                    ongoing[touches[i].identifier] = toCanvasPoint(touches[i]);
                }
            }

            function handleMove(evt) {
                if (!isEnabled()) { return; }
                if (evt.touches && evt.touches.length !== 1) {
                    ongoing = {};
                    return;
                }
                evt.preventDefault();
                var touches = evt.changedTouches;
                for (var i = 0; i < touches.length; i++) {
                    var prev = ongoing[touches[i].identifier];
                    if (!prev) { continue; }
                    var next = toCanvasPoint(touches[i]);
                    ctx.beginPath();
                    ctx.moveTo(prev.x, prev.y);
                    ctx.lineTo(next.x, next.y);
                    ctx.lineWidth = penWidth();
                    ctx.strokeStyle = penColor();
                    ctx.lineJoin = 'round';
                    ctx.lineCap = 'round';
                    ctx.stroke();
                    ctx.closePath();
                    ongoing[touches[i].identifier] = next;
                }
            }

            function handleEnd(evt) {
                var touches = evt.changedTouches;
                for (var i = 0; i < touches.length; i++) {
                    delete ongoing[touches[i].identifier];
                }
            }

            // passive:false is required or iOS Safari ignores preventDefault()
            // and scrolls the page instead of drawing.
            canvas.addEventListener('touchstart', handleStart, { passive: false });
            canvas.addEventListener('touchmove', handleMove, { passive: false });
            canvas.addEventListener('touchend', handleEnd);
            canvas.addEventListener('touchcancel', handleEnd);

            // Stop the browser claiming the gesture while the pen tool is active.
            if (attrs.canvasTouchDraw) {
                scope.$watch(function () { return isEnabled(); }, function (on) {
                    canvas.style.touchAction = on ? 'none' : '';
                });
            }

            scope.$on('$destroy', function () {
                canvas.removeEventListener('touchstart', handleStart);
                canvas.removeEventListener('touchmove', handleMove);
                canvas.removeEventListener('touchend', handleEnd);
                canvas.removeEventListener('touchcancel', handleEnd);
            });
        }
    };
});

/*
 * on-pinch="<expr using $delta>"
 *      pinch-disabled="<expr>"   (optional - suppresses pinch, e.g. while drawing)
 *
 * Two-finger pinch zoom for the image-viewer canvases (iPad).
 *
 * Without this the browser owns the gesture and pans/zooms the whole popup
 * instead of the image. Deliberately requires EXACTLY two touches, so a single
 * finger still pans/draws, and stays inert while the pen tool is active.
 * Emits $delta = +1 (spread / zoom in) or -1 (pinch / zoom out) per step, so it
 * drives the same zoom handlers as the toolbar buttons.
 */
eHnoteWebApp.directive('onPinch', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var el = element[0];
            if (!el) { return; }

            var STEP_THRESHOLD = 8; // px of spread before emitting one zoom step
            var tracking = false;
            var lastDistance = 0;

            function isDisabled() {
                return attrs.pinchDisabled ? !!scope.$eval(attrs.pinchDisabled) : false;
            }

            function distanceBetween(touches) {
                var dx = touches[0].clientX - touches[1].clientX;
                var dy = touches[0].clientY - touches[1].clientY;
                return Math.sqrt((dx * dx) + (dy * dy));
            }

            function onTouchStart(evt) {
                if (isDisabled() || evt.touches.length !== 2) {
                    tracking = false;
                    return;
                }
                tracking = true;
                lastDistance = distanceBetween(evt.touches);
                evt.preventDefault();
            }

            function onTouchMove(evt) {
                if (!tracking || isDisabled()) { return; }
                if (evt.touches.length !== 2) { return; }

                evt.preventDefault();

                var distance = distanceBetween(evt.touches);
                var change = distance - lastDistance;
                if (Math.abs(change) < STEP_THRESHOLD) { return; }

                lastDistance = distance;
                var delta = (change > 0) ? 1 : -1;

                scope.$applyAsync(function () {
                    scope.$eval(attrs.onPinch, { $delta: delta });
                });
            }

            function onTouchEnd(evt) {
                if (!evt.touches || evt.touches.length < 2) {
                    tracking = false;
                }
            }

            // The canvas owns touch gestures here; otherwise iOS Safari scrolls
            // or page-zooms the popup rather than letting us handle the pinch.
            el.style.touchAction = 'none';

            el.addEventListener('touchstart', onTouchStart, { passive: false });
            el.addEventListener('touchmove', onTouchMove, { passive: false });
            el.addEventListener('touchend', onTouchEnd);
            el.addEventListener('touchcancel', onTouchEnd);

            scope.$on('$destroy', function () {
                el.removeEventListener('touchstart', onTouchStart);
                el.removeEventListener('touchmove', onTouchMove);
                el.removeEventListener('touchend', onTouchEnd);
                el.removeEventListener('touchcancel', onTouchEnd);
            });
        }
    };
});

/*
 * touch-pan   touch-pan-disabled="<expr>"   (optional)
 *
 * One-finger drag-to-pan for the image-viewer canvases (iPad), matching the
 * existing click-and-drag pan on web.
 *
 * The pan itself is implemented in the controllers' mousedown/mousemove/mouseup
 * bindings on the canvas (they track curPos/picPos, honour options.controls
 * .disableMove, and mirror the move to the other eye when Sync is on). Rather
 * than duplicate that maths - and risk it drifting from the mouse behaviour -
 * this translates a single-finger drag into those same mouse events. offsetX/
 * offsetY are derived by the browser from clientX/clientY against the target,
 * so the existing handlers receive exactly what they expect.
 *
 * Requires exactly one touch, so two-finger pinch (see onPinch) is untouched,
 * and stays inert while the pen tool is active.
 */
eHnoteWebApp.directive('touchPan', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var el = element[0];
            if (!el) { return; }

            var panning = false;

            function isDisabled() {
                return attrs.touchPanDisabled ? !!scope.$eval(attrs.touchPanDisabled) : false;
            }

            function fireMouseEvent(type, touch) {
                if (!touch) { return; }
                var evt;
                try {
                    evt = new MouseEvent(type, {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        clientX: touch.clientX,
                        clientY: touch.clientY,
                        buttons: (type === 'mouseup') ? 0 : 1
                    });
                } catch (e) {
                    // older WebKit
                    evt = document.createEvent('MouseEvents');
                    evt.initMouseEvent(type, true, true, window, 0,
                        touch.screenX, touch.screenY, touch.clientX, touch.clientY,
                        false, false, false, false, 0, null);
                }
                el.dispatchEvent(evt);
            }

            function stopPan(touch) {
                if (!panning) { return; }
                panning = false;
                fireMouseEvent('mouseup', touch);
            }

            function onTouchStart(evt) {
                if (isDisabled() || evt.touches.length !== 1) {
                    // a second finger means pinch - hand the gesture over
                    stopPan(evt.changedTouches[0]);
                    return;
                }
                panning = true;
                evt.preventDefault();
                fireMouseEvent('mousedown', evt.touches[0]);
            }

            function onTouchMove(evt) {
                if (!panning || isDisabled()) { return; }
                if (evt.touches.length !== 1) {
                    stopPan(evt.changedTouches[0]);
                    return;
                }
                evt.preventDefault();
                fireMouseEvent('mousemove', evt.touches[0]);
            }

            function onTouchEnd(evt) {
                stopPan(evt.changedTouches && evt.changedTouches[0]);
            }

            el.style.touchAction = 'none';

            el.addEventListener('touchstart', onTouchStart, { passive: false });
            el.addEventListener('touchmove', onTouchMove, { passive: false });
            el.addEventListener('touchend', onTouchEnd);
            el.addEventListener('touchcancel', onTouchEnd);

            scope.$on('$destroy', function () {
                el.removeEventListener('touchstart', onTouchStart);
                el.removeEventListener('touchmove', onTouchMove);
                el.removeEventListener('touchend', onTouchEnd);
                el.removeEventListener('touchcancel', onTouchEnd);
            });
        }
    };
});

/*
 * on-pan="<expr using $dx / $dy>"
 *      pan-disabled="<expr>"   (optional)
 *
 * Drag-to-pan for surfaces that are moved with a CSS transform rather than
 * drawn on a canvas (e.g. the Compare tiles), where there are no existing
 * mouse handlers for touchPan to translate into.
 *
 * Handles mouse drag and single-finger touch with one implementation, emitting
 * the movement delta since the previous event. Two-finger gestures are ignored
 * so onPinch keeps the pinch.
 */
eHnoteWebApp.directive('onPan', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var el = element[0];
            if (!el) { return; }

            var panning = false;
            var lastX = 0;
            var lastY = 0;

            function isDisabled() {
                return attrs.panDisabled ? !!scope.$eval(attrs.panDisabled) : false;
            }

            function emit(x, y) {
                var dx = x - lastX;
                var dy = y - lastY;
                lastX = x;
                lastY = y;
                if (!dx && !dy) { return; }
                scope.$applyAsync(function () {
                    scope.$eval(attrs.onPan, { $dx: dx, $dy: dy });
                });
            }

            // ----- mouse -----
            function onMouseDown(evt) {
                if (isDisabled() || evt.button !== 0) { return; }
                panning = true;
                lastX = evt.clientX;
                lastY = evt.clientY;
                evt.preventDefault();
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            }

            function onMouseMove(evt) {
                if (!panning) { return; }
                emit(evt.clientX, evt.clientY);
            }

            function onMouseUp() {
                panning = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            // ----- touch -----
            function onTouchStart(evt) {
                if (isDisabled() || evt.touches.length !== 1) {
                    panning = false;
                    return;
                }
                panning = true;
                lastX = evt.touches[0].clientX;
                lastY = evt.touches[0].clientY;
                evt.preventDefault();
            }

            function onTouchMove(evt) {
                if (!panning || isDisabled()) { return; }
                if (evt.touches.length !== 1) { panning = false; return; }
                evt.preventDefault();
                emit(evt.touches[0].clientX, evt.touches[0].clientY);
            }

            function onTouchEnd() {
                panning = false;
            }

            el.style.touchAction = 'none';

            el.addEventListener('mousedown', onMouseDown);
            el.addEventListener('touchstart', onTouchStart, { passive: false });
            el.addEventListener('touchmove', onTouchMove, { passive: false });
            el.addEventListener('touchend', onTouchEnd);
            el.addEventListener('touchcancel', onTouchEnd);

            scope.$on('$destroy', function () {
                el.removeEventListener('mousedown', onMouseDown);
                el.removeEventListener('touchstart', onTouchStart);
                el.removeEventListener('touchmove', onTouchMove);
                el.removeEventListener('touchend', onTouchEnd);
                el.removeEventListener('touchcancel', onTouchEnd);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            });
        }
    };
});

eHnoteWebApp.directive("quotesandspaceRestrict", [function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return "";
                var transformedInput = inputValue.replace(/['" ]*/g, '');
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}]);

eHnoteWebApp.directive('filterPanel', ['$document', function ($document) {
     return {
         restrict: 'A',
         link: function (scope, element, attrs) {
             var body = $document[0].body;
             var openClass = 'opfilter-open';

             scope.$watch(attrs.popoverIsOpen, function (isOpen) {
                 if (isOpen) {
                     body.classList.add(openClass);
                 } else {
                     body.classList.remove(openClass);
                 }
             });

             scope.$on('$destroy', function () {
                 body.classList.remove(openClass);
             });
         }
     };
 }]);

eHnoteWebApp.directive('dynamicPopoverPlacement', ['$window', '$document', function ($window, $document) {
    return {
        restrict: 'A',
        scope: {
            popoverTemplate: '@',
            popoverClass:'@',
            popoverData: '=' // Bind the data dynamically
        },
        link: function (scope, element) {
            scope.adjustPopoverPlacement = function (event) {
                const popoverElement = document.createElement('div');
                popoverElement.className = scope.popoverClass;
                document.body.appendChild(popoverElement);

                const computedStyle = getComputedStyle(popoverElement);
                const minWidth = parseInt(computedStyle.minWidth) || 600;
                const maxHeight = parseInt(computedStyle.maxHeight) || 300;

                document.body.removeChild(popoverElement);

                const imgRect = event.target.getBoundingClientRect();
                const availableRightSpace = $window.innerWidth - imgRect.right;
                const availableLeftSpace = imgRect.left;
                const availableBottomSpace = $window.innerHeight - imgRect.bottom;
                const availableTopSpace = imgRect.top;

                if (availableBottomSpace >= maxHeight) {
                    scope.popoverPlacement = "auto bottom";
                } else if (availableTopSpace >= maxHeight) {
                    scope.popoverPlacement = "auto top";
                } else if (availableRightSpace >= minWidth) {
                    scope.popoverPlacement = "auto right";
                } else {
                    scope.popoverPlacement = "auto left";
                }
            };

            scope.popoverPlacement = 'auto right';
            scope.isPopoverOpen = false;

            element.on('mouseenter', function (event) {
                scope.$apply(function () {
                    scope.adjustPopoverPlacement(event);
                    scope.isPopoverOpen = true;
                });
            });

            element.on('mouseleave', function () {
                scope.$apply(function () {
                    scope.isPopoverOpen = false;
                });
            });

            const popoverElement = angular.element('<div></div>');
            popoverElement.on('mouseenter', function () {
                scope.$apply(function () {
                    scope.isPopoverOpen = true;
                });
            });

            popoverElement.on('mouseleave', function () {
                scope.$apply(function () {
                    scope.isPopoverOpen = false;
                });
            });

            angular.element(document.body).append(popoverElement);

            scope.$on('$destroy', function () {
                popoverElement.remove();
                element.off('mouseenter');
                element.off('mouseleave');
            });
        },
        template: `
             <div uib-popover-template="{{popoverTemplate}}"
                 popover-trigger="none"
                 popover-placement="{{popoverPlacement}}"
                 popover-class="{{popoverClass}}"
                 popover-is-open="isPopoverOpen"
                 popover-append-to-body="true"
                 popover-animation="false">
                <ng-transclude></ng-transclude>
            </div>
        `,
        transclude: true
    };
}]);

eHnoteWebApp.directive('dynamicClickPopoverPlacement', ['$window', '$document', function ($window, $document) {
    return {
        restrict: 'A',
        scope: {
            popoverTemplate: '@',
            popoverClass: '@',
            popoverData: '='
        },
        link: function (scope, element) {
            scope.adjustPopoverPlacement = function (event) {
                const popoverElement = document.createElement('div');
                popoverElement.className = scope.popoverClass;
                document.body.appendChild(popoverElement);

                const computedStyle = getComputedStyle(popoverElement);
                const minWidth = parseInt(computedStyle.minWidth) || 600;
                const maxHeight = parseInt(computedStyle.maxHeight) || 300;

                document.body.removeChild(popoverElement);

                const imgRect = event.target.getBoundingClientRect();
                const availableRightSpace = $window.innerWidth - imgRect.right;
                const availableLeftSpace = imgRect.left;
                const availableBottomSpace = $window.innerHeight - imgRect.bottom;
                const availableTopSpace = imgRect.top;

                if (availableBottomSpace >= maxHeight) {
                    scope.popoverPlacement = "auto bottom";
                } else if (availableTopSpace >= maxHeight) {
                    scope.popoverPlacement = "auto top";
                } else if (availableRightSpace >= minWidth) {
                    scope.popoverPlacement = "auto right";
                } else {
                    scope.popoverPlacement = "auto left";
                }
            };

            scope.popoverPlacement = 'auto right';
            scope.isPopoverOpen = false;

            function closePopover() {
                scope.$apply(function () {
                    scope.isPopoverOpen = false;
                });
            }

            element.on('click', function (event) {
                event.stopPropagation();
                scope.$apply(function () {
                    if (scope.isPopoverOpen) {
                        scope.isPopoverOpen = false;
                    } else {
                        scope.adjustPopoverPlacement(event);
                        scope.isPopoverOpen = true;
                    }
                });
            });

            $document.on('click', function (event) {
                if (!element[0].contains(event.target)) {
                    closePopover();
                }
            });
            element.on('click', '.popover-content', function (event) {
                event.stopPropagation();
            });

            element.on('click', '.close-popover-btn', function (event) {
                event.stopPropagation();
                closePopover();
            });

            // Only links rendered inside the popover content should swallow the click.
            // A blanket 'a' selector also matched links in the trigger itself (e.g. the
            // info icon), which stopped propagation before the toggle handler above ran.
            element.on('click', '.popover a', function (event) {
                event.stopPropagation();
            });

            scope.$on('$destroy', function () {
                $document.off('click', closePopover);
            });
        },
        template: `
            <div uib-popover-template="{{popoverTemplate}}"
                 popover-trigger="none"
                 popover-placement="{{popoverPlacement}}"
                 popover-class="{{popoverClass}}"
                 popover-is-open="isPopoverOpen">
                <ng-transclude></ng-transclude>
            </div>
        `,
        transclude: true
    };
}]);
eHnoteWebApp.directive('dynamicClickPopoverPlacementOp', [
    '$window', '$document', '$timeout', 'eHnoteMainAppointmentService',
    function ($window, $document, $timeout, eHnoteMainAppointmentService) {

        let currentPopoverScope = null;
        let documentClickHandlerBound = false;
        let isOpening = false;
        let latestPopoverEl = null;

        return {
            restrict: 'A',
            scope: {
                popoverTemplate: '@',
                popoverClass: '@',
                popoverData: '=',
                onClick: '&'
            },
            link: function (scope, element, attrs) {
                const forceTopOnly = attrs.forceTopPopover !== undefined;

                scope.popoverPlacement = 'auto right';
                scope.isPopoverOpen = false;

                scope.adjustPopoverPlacement = function (event) {
                    if (forceTopOnly) {
                        scope.popoverPlacement = 'top';
                        scope.popoverAlign = 'center';
                        return;
                    }
                    const rect = event.target.getBoundingClientRect();
                    const vw = $window.innerWidth;
                    const vh = $window.innerHeight;

                    const spaceRight = vw - rect.right;
                    const spaceLeft = rect.left;
                    const spaceTop = rect.top;
                    const spaceBottom = vh - rect.bottom;

                    const maxSpace = Math.max(spaceRight, spaceLeft, spaceTop, spaceBottom);
                    if (maxSpace === spaceBottom) scope.popoverPlacement = 'auto bottom';
                    else if (maxSpace === spaceTop) scope.popoverPlacement = 'auto top';
                    else if (maxSpace === spaceRight) scope.popoverPlacement = 'auto right';
                    else scope.popoverPlacement = 'auto left';
                };

                function markLatestPopoverDom() {
                    $timeout(function () {
                        const popovers = document.querySelectorAll('.popover');
                        if (popovers && popovers.length) {
                            latestPopoverEl = popovers[popovers.length - 1];
                        } else {
                            latestPopoverEl = null;
                        }
                    }, 0);
                }

                function closePopover() {
                    scope.isPopoverOpen = false;
                    latestPopoverEl = null;

                    if (currentPopoverScope === scope) {
                        currentPopoverScope = null;
                    }
                    if (documentClickHandlerBound) {
                        document.removeEventListener('click', onDocumentClick, true);

                        documentClickHandlerBound = false;
                    }
                }

                function onDocumentClick(event) {
                    const clickedOnIcon = element[0].contains(event.target);
                    const popovers = document.querySelectorAll('.popover');
                    const latestPopover = popovers.length ? popovers[popovers.length - 1] : null;

                    const clickedInsidePopover = latestPopover && latestPopover.contains(event.target);

                    if (!clickedOnIcon && !clickedInsidePopover) {
                        scope.$applyAsync(closePopover);
                    }
                }

                function forceCloseOtherPopovers() {
                    if (currentPopoverScope && currentPopoverScope !== scope) {
                        currentPopoverScope.isPopoverOpen = false;
                        currentPopoverScope = null;
                        latestPopoverEl = null;
                    }
                }

                function openPopover(event) {
                    scope.adjustPopoverPlacement(event);
                    scope.isPopoverOpen = true;
                    currentPopoverScope = scope;
                    document.removeEventListener('click', onDocumentClick, true);
                    document.addEventListener('click', onDocumentClick, true);
                    documentClickHandlerBound = true;
                }


                element.on('click', function (event) {
                    event.preventDefault();
                    if (isOpening) return;
                    isOpening = true;

                    $timeout(function () {
                        try {
                            if (currentPopoverScope && currentPopoverScope !== scope) {
                                currentPopoverScope.isPopoverOpen = false;
                                currentPopoverScope = null;
                                latestPopoverEl = null;
                            }
                            if (scope.isPopoverOpen) {
                                closePopover();
                                return;
                            }

                            let s3url = scope.popoverData?.PatientDetails?.S3URL || '';

                            if (!s3url) {
                                openPopover(event);
                                return;
                            }

                            const reqobj = {
                                UserId: 0,
                                FilesList: [{
                                    DocumentId: 0,
                                    FullBlobName: s3url
                                }]
                            };

                            eHnoteMainAppointmentService.GetSasFilesById(reqobj)
                                .then(response => {
                                    if (response && response.data && response.data.StatusId == 1) {
                                        scope.popoverData.PatientDetails.S3URL = response.data.FilesList[0].SASUrl;
                                    }
                                    openPopover(event);
                                })
                                .catch(err => {
                                    console.error("Error fetching insurance info:", err);
                                    openPopover(event);
                                })
                                .finally(() => {
                                    isOpening = false;
                                });

                        } finally {
                            if (isOpening) {
                                const s3urlCheck = scope.popoverData?.PatientDetails?.S3URL || '';
                                if (!s3urlCheck) {
                                    isOpening = false;
                                }
                            }
                        }
                    });
                });

                scope.$on('$destroy', function () {
                    if (documentClickHandlerBound) {
                        document.removeEventListener('click', onDocumentClick, true);

                        documentClickHandlerBound = false;
                    }
                    element.off('click');
                });
            },
            template: `
                <div uib-popover-template="{{popoverTemplate}}"
                     popover-trigger="none"
                     popover-placement="{{popoverPlacement}}"
                     popover-class="{{popoverClass}}"
                     popover-is-open="isPopoverOpen"
                     popover-append-to-body="true"
                     popover-animation="false">
                  <ng-transclude></ng-transclude>
                </div>
            `,
            transclude: true
        };
    }
]);



eHnoteWebApp.directive('dynamicUsPatientProfileBasicPopover', ['$window', '$document', '$timeout', "eHnoteMainAppointmentService", "eHnoteUserDataService", function ($window, $document, $timeout, eHnoteMainAppointmentService, eHnoteUserDataService) {
    let currentPopoverElement = null;

    return {
        restrict: 'A',
        scope: {
            popoverTemplate: '@',
            popoverClass: '@',
            popoverData: '=',
            onClick: '&'

        },
        link: function (scope, element) {
            scope.adjustPopoverPlacement = function (event) {
                const popoverElement = document.createElement('div');
                popoverElement.className = scope.popoverClass;
                document.body.appendChild(popoverElement);

                const computedStyle = getComputedStyle(popoverElement);
                const minWidth = parseInt(computedStyle.minWidth) || 400;
                const maxHeight = parseInt(computedStyle.maxHeight) || 300;

                document.body.removeChild(popoverElement);

                const imgRect = event.target.getBoundingClientRect();
                const availableRightSpace = $window.innerWidth - imgRect.right;
                const availableLeftSpace = imgRect.left;
                const availableBottomSpace = $window.innerHeight - imgRect.bottom;
                const availableTopSpace = imgRect.top;

                if (availableBottomSpace >= maxHeight) {
                    scope.popoverPlacement = "auto bottom";
                } else if (availableTopSpace >= maxHeight) {
                    scope.popoverPlacement = "auto top";
                } else if (availableRightSpace >= minWidth) {
                    scope.popoverPlacement = "auto right";
                } else {
                    scope.popoverPlacement = "auto left";
                }
            };

            scope.popoverPlacement = 'auto right';
            scope.isPopoverOpen = false;

            function closePopover() {
                scope.isPopoverOpen = false;
                currentPopoverElement = null;
            }

            element.on('click', function (event) {
                event.stopPropagation();
                $timeout(function () {
                    if (scope.isPopoverOpen) {
                        closePopover();
                    } else {
                        if (currentPopoverElement) {
                            currentPopoverElement.isPopoverOpen = false;
                        }
                        let openPopover = function () {
                            scope.adjustPopoverPlacement(event);
                            scope.isPopoverOpen = true;
                            currentPopoverElement = scope;
                        };
                        if (scope.popoverData != undefined) {
                            const assignIfEmpty = (target, source, key, defaultValue = "") => {
                                if (!target[key]) {
                                    let value = source[key] || defaultValue;
                                    switch (key) {
                                        case 'MobileNo':
                                            if (value && value.trim() !== "") {
                                                let formateno = eHnoteUserDataService.UsMobileFormatChange(value);
                                                value = (formateno?.UsFormatMobileNumber && formateno.UsFormatMobileNumber.trim() !== "")
                                                    ? formateno.UsFormatMobileNumber
                                                    : value;
                                            }
                                            break;
                                        case 'DOB':
                                            break;
                                    }
                                    target[key] = value;
                                }
                            };
                            if (scope.popoverData != undefined) {
                                    let obj = {
                                        "FullName": "",
                                        "Gender": "",
                                        "MobileNo": "",
                                        "Title": "",
                                        "PatientDisplayId": "",
                                        "DOB": "",
                                        "PatientTagList": [],
                                        "S3URL": ""
                                    };
                                    scope.popoverData.PatientDetails = scope.popoverData.PatientDetails || obj;
                                    const source = scope.popoverData;
                                    const target = scope.popoverData.PatientDetails;
                                    assignIfEmpty(target, source, 'FullName');
                                    assignIfEmpty(target, source, 'Gender');
                                    assignIfEmpty(target, source, 'MobileNo');
                                    assignIfEmpty(target, source, 'Title');
                                    assignIfEmpty(target, source, 'PatientDisplayId');
                                    assignIfEmpty(target, source, 'DOB');
                                    assignIfEmpty(target, source, 'PatientTagList', []);
                                    assignIfEmpty(target, source, 'S3URL', "");
                                }
                               
                                let s3url = scope.popoverData.PatientDetails.S3URL || "";
                                if (s3url !== "") {
                                    let reqobj = {
                                        "UserId": 0,
                                        "FilesList": [{
                                            "DocumentId": 0,
                                            "FullBlobName": s3url
                                        }]
                                    }
                                    eHnoteMainAppointmentService.GetSasFilesById(reqobj).then(function (response) {
                                        if (response.data.StatusId == 1) {
                                            scope.popoverData.PatientDetails.S3URL = response.data.FilesList[0].SASUrl;
                                        }
                                        openPopover();
                                    }).catch(function (err) {
                                        openPopover();
                                        console.error("Error fetching insurance info:", err);
                                    })
                                        .finally(function () {
                                            openPopover();
                                        });
                                } else {
                                    openPopover();
                                }
                            }
                        }
                });
            });

            $document.on('click', function (event) {
                if (!element[0].contains(event.target)) {
                    $timeout(function () {
                        closePopover();
                    });
                }
            });

            scope.$on('$destroy', function () {
                $document.off('click', closePopover);
            });
        },
        template: `
             <div uib-popover-template="{{popoverTemplate}}"
                 popover-trigger="none"
                 popover-placement="{{popoverPlacement}}"
                 popover-class="{{popoverClass}}"
                 popover-is-open="isPopoverOpen"
                 popover-append-to-body="true"
                 popover-animation="false">
                <ng-transclude></ng-transclude>
            </div>
        `,
        transclude: true
    };
}]);


eHnoteWebApp.directive('scrollOnChange', ['$timeout', function ($timeout) {
    return {
        restrict: 'A', 
        link: function (scope, element, attrs) {           
            var targetId = attrs.targetId;
            scope.$watch(attrs.scrollOnChange, function (newValue, oldValue) {               
                if (newValue) {                    
                    $timeout(function () {
                        const accordionElement = document.getElementById(targetId);
                        if (accordionElement) {
                            accordionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        } 
                    }, 200);
                }
            });
        }
    };
}]);
eHnoteWebApp.directive('focusInput', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            function focusFirstInput() {
                var inputs = document.querySelectorAll(
                    'input[type="text"]:not([disabled]):not([readonly]):not([uib-typeahead]):not([datepickerregpatient]), ' +
                    'textarea:not([disabled]):not([readonly])'
                );
                if (inputs.length === 0) {
                } else {
                    var currentlyFocusedElement = document.activeElement;
                    if (currentlyFocusedElement && currentlyFocusedElement.tagName === 'INPUT' && currentlyFocusedElement.offsetParent !== null) {
                        return;
                    }
                    for (var i = 0; i < inputs.length; i++) {
                        let input = inputs[i];
                        if (input.offsetParent !== null) {
                            input.focus();                            
                            break;
                        }
                    }
                }
            }
            $timeout(function () {
                focusFirstInput();
                var observer = new MutationObserver(function (mutationsList) {
                    for (var mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            focusFirstInput();
                        }
                    }
                });
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

            }, 100);
        }
    };
}]);

eHnoteWebApp.directive('draggableRow', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.attr('draggable', true);

            element.on('dragstart', function (event) {
                scope.handleDragStart(scope.$index);
            });

            element.on('dragover', function (event) {
                event.preventDefault(); // Allow drop
                scope.hoveredIndex = scope.$index;
                scope.$apply();
            });

            element.on('dragleave', function () {
                scope.hoveredIndex = null;
                scope.$apply();
            });

            element.on('drop', function () {
                scope.handleDrop(scope.$index);
            });
        }
    };
});

/*Input dropdown direction based on screen size - 14/05/2025-mahendra*/
eHnoteWebApp.directive('inputDropdownDirection', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var inputField = angular.element(element.find('input'));
            var dropdownMenu = angular.element(element.find('.dropdown-menu'));

            inputField.on('click', function () {
                var windowHeight = $window.innerHeight;
                var scrollTop = $window.scrollY;
                var inputFieldRect = inputField[0].getBoundingClientRect();
                var inputFieldTop = inputFieldRect.top + scrollTop;
                var inputFieldBottom = windowHeight - inputFieldRect.bottom;
                var dropdownMenuHeight = dropdownMenu.outerHeight();
                var threshold = 0;

                if (inputFieldBottom < dropdownMenuHeight + threshold) {
                    dropdownMenu.addClass('dropdown-up');
                } else if (inputFieldTop < dropdownMenuHeight + threshold) {
                    dropdownMenu.removeClass('dropdown-up');
                } else {
                    dropdownMenu.removeClass('dropdown-up');
                }
            });
        }
    };
});

/*Button dropdown direction based on screen size- 14/05/2025-mahendra*/
eHnoteWebApp.directive('buttonDropdownDirection', function ($window, $timeout, $document) {
    return {
        restrict: 'A',
        scope: {
            appendBody: '@?'
        },
        link: function (scope, element) {
            var appendBody = element.attr('append-body');
            var dropdownButton = element.find('button, a[data-toggle="dropdown"]');
            var scrollCleanup = null;
            var appendedMenu = null;

            // ─── Non-appended mode ────────────────────────────────────────
            function applyDirection() {
                var dropdownMenu = angular.element(element.find('.dropdown-menu'));
                if (!dropdownMenu.length) return;

                var windowHeight = $window.innerHeight;
                var buttonRect = dropdownButton[0].getBoundingClientRect();
                var spaceBelow = windowHeight - buttonRect.bottom;
                var spaceAbove = buttonRect.top;
                var menuHeight = dropdownMenu[0].offsetHeight || 200;

                if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
                    dropdownMenu.addClass('dropdown-up').removeClass('dropdown-down');
                } else {
                    dropdownMenu.addClass('dropdown-down').removeClass('dropdown-up');
                }
            }

            function attachScrollListener() {
                $document[0].addEventListener('scroll', applyDirection, true);
                angular.element($window).on('resize', applyDirection);
                scrollCleanup = function () {
                    $document[0].removeEventListener('scroll', applyDirection, true);
                    angular.element($window).off('resize', applyDirection);
                };
            }

            function detachScrollListener() {
                if (scrollCleanup) {
                    scrollCleanup();
                    scrollCleanup = null;
                }
            }

            // ─── Appended-to-body mode ────────────────────────────────────
            function repositionMenu() {
                if (!appendedMenu || !appendedMenu.length) return;

                var buttonRect = dropdownButton[0].getBoundingClientRect();
                var scrollTop = $window.pageYOffset || document.documentElement.scrollTop;
                var scrollLeft = $window.pageXOffset || document.documentElement.scrollLeft;
                var menuHeight = appendedMenu[0].offsetHeight;
                var windowHeight = $window.innerHeight;
                var spaceBelow = windowHeight - buttonRect.bottom;
                var spaceAbove = buttonRect.top;
                var topPosition;

                if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
                    topPosition = buttonRect.top + scrollTop - menuHeight;
                } else {
                    topPosition = buttonRect.top + scrollTop + buttonRect.height;
                }

                appendedMenu.css({
                    position: 'absolute',
                    top: topPosition + 'px',
                    left: (buttonRect.left + scrollLeft) + 'px',
                    right: 'auto'
                });
            }

            function attachAppendedScrollListener() {
                $document[0].addEventListener('scroll', repositionMenu, true);
                angular.element($window).on('resize', repositionMenu);
            }

            function detachAppendedScrollListener() {
                $document[0].removeEventListener('scroll', repositionMenu, true);
                angular.element($window).off('resize', repositionMenu);
            }

            // ─── Single click handler ─────────────────────────────────────
            dropdownButton.on('click', function () {
                if (appendBody === "true") {
                    // FIX: use a slightly longer timeout so the appended
                    // menu is fully painted and has a real offsetHeight
                    $timeout(function () {
                        var isOpen = element.hasClass('open');

                        if (isOpen) {
                            var buttonId = dropdownButton.attr('id');
                            appendedMenu = angular.element(
                                document.querySelector('.dropdown-menu[aria-labelledby="' + buttonId + '"]')
                            );
                            repositionMenu();
                            attachAppendedScrollListener();
                        } else {
                            appendedMenu = null;
                            detachAppendedScrollListener();
                        }
                    }, 50); // ← small delay ensures menu is rendered
                } else {
                    $timeout(function () {
                        var isOpen = element.hasClass('open');
                        if (isOpen) {
                            applyDirection();
                            attachScrollListener();
                        } else {
                            detachScrollListener();
                        }
                    }, 0);
                }
            });

            scope.$on('$destroy', function () {
                detachScrollListener();
                detachAppendedScrollListener();
                dropdownButton.off('click');
            });
        }
    };
});

/*Typehead dropdown direction based on screen size- 14/05/2025-mahendra*/
eHnoteWebApp.directive('typeheadDropdownDirection', function ($window, $timeout, $rootScope, typeaheadTabletOverlayService, $parse) {
    function readTypeaheadAttr(inputField, name) {
        return inputField.attr(name) || inputField.attr('data-' + name) || inputField.attr('x-' + name) || null;
    }
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var inputField = element.find('input');
            const minLength = inputField.attr('typeahead-min-length');

            var uibTypeaheadExpr = readTypeaheadAttr(inputField, 'uib-typeahead');
            var ngModelExpr = readTypeaheadAttr(inputField, 'ng-model');

            if (typeaheadTabletOverlayService.isTabletDevice($window) && attrs.typeaheadOverlayDisable !== 'true') {
                if (uibTypeaheadExpr && ngModelExpr) {
                    var openTabletOverlay = function (event) {
                        event.preventDefault();
                        var parsedMinLength = parseInt(minLength, 10);
                        typeaheadTabletOverlayService.open({
                            scope: scope,
                            inputField: inputField,
                            uibTypeaheadExpr: uibTypeaheadExpr,
                            ngModelExpr: ngModelExpr,
                            onSelectExpr: readTypeaheadAttr(inputField, 'typeahead-on-select'),
                            addNewExpr: readTypeaheadAttr(inputField, 'typeahead-overlay-add-new'), // NEW
                            minLength: isNaN(parsedMinLength) ? 1 : parsedMinLength
                        });
                    };
                    inputField[0].addEventListener('touchstart', openTabletOverlay, { passive: false });
                    inputField.on('mousedown', openTabletOverlay);
                    scope.$on('$destroy', function () {
                        inputField[0].removeEventListener('touchstart', openTabletOverlay, { passive: false });
                        inputField.off('mousedown', openTabletOverlay);
                    });
                    return;
                }
            }

            var middleSection = angular.element(document.querySelector('#container'));
            var debounceTimeoutId = null;
            inputField.on('input', function () {
                var inputValue = inputField.val();
                if (inputValue.length >= minLength) {
                    if (debounceTimeoutId) {
                        $timeout.cancel(debounceTimeoutId);
                    }
                    debounceTimeoutId = $timeout(adjustDropdownPosition, 100);
                }
            });
            var typeheadClose = $rootScope.$on('buttonDropdownOpened', function () {
                var dropdownMenu = element[0].querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.classList.add('d__n--');
                }
            });

            middleSection.on('scroll', adjustDropdownPosition);
            function adjustDropdownPosition() {
                var dropdownMenu = element.find('.dropdown-menu');
                var windowHeight = $window.innerHeight;
                var scrollTop = $window.scrollY;
                var inputFieldRect = inputField[0].getBoundingClientRect();
                var inputFieldTop = inputFieldRect.top + scrollTop;
                var inputFieldBottom = windowHeight - inputFieldRect.bottom - 20;
                var dropdownMenuHeight = dropdownMenu.outerHeight();
                var threshold = 0;

                if (inputFieldBottom < dropdownMenuHeight + threshold) {
                    dropdownMenu.addClass('dropdown-up').css('top', '');
                } else {
                    dropdownMenu.removeClass('dropdown-up');
                }
            };

            angular.element($window).on('resize', adjustDropdownPosition);
            angular.element($window).on('scroll', adjustDropdownPosition);

            element.on('click', function () {
                adjustDropdownPosition();
            });
            inputField.on('focus', function () {
                var dropdownMenu = element[0].querySelector('.dropdown-menu');
                if (dropdownMenu && dropdownMenu.classList.contains('d__n--')) {
                    dropdownMenu.classList.remove('d__n--');
                }
                adjustDropdownPosition();
            });
            element.on('mousedown', function () {
                adjustDropdownPosition();
            });
            element.on('mouseover', function () {
                adjustDropdownPosition();
            });
            element.on('mouseup', function () {
                adjustDropdownPosition();
            });
            element.on('mouseout', function () {
                adjustDropdownPosition();
            });
            element.on('touchstart', function () {
                adjustDropdownPosition();
            });
            element.on('touchend', function () {
                adjustDropdownPosition();
            });
            element.on('pointerdown', function () {
                adjustDropdownPosition();
            });
            element.on('pointerup', function () {
                adjustDropdownPosition();
            });
            scope.$on('$destroy', function () {
                typeheadClose();
                inputField.off('input keydown');
                angular.element($window).off('resize', adjustDropdownPosition);
                middleSection.off('scroll', adjustDropdownPosition);
                angular.element($window).off('scroll', adjustDropdownPosition);
            });
        }
    };
});

eHnoteWebApp.directive('ngRightClick', function ($parse) {
    return function (scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function (event) {
            scope.$apply(function () {
                event.preventDefault(); // stops browser default menu
                fn(scope, { $event: event });
            });
        });
    };
});



eHnoteWebApp.directive('agChart', function () {
    return {
        restrict: 'A',
        scope: {
            chartOptions: '='
        },
        link: function (scope, element) {
            let chartInstance = null;

            scope.$watch('chartOptions', function (newOptions) {
                if (!newOptions || typeof window.AgCharts === 'undefined') {
                    console.warn('AgCharts is not loaded or chartOptions missing');
                    return;
                }

                // Assign container dynamically
                newOptions.container = element[0];

                // Destroy previous chart to avoid duplication
                if (chartInstance && typeof chartInstance.destroy === 'function') {
                    chartInstance.destroy();
                }

                // Create new chart
                chartInstance = window.AgCharts.create(newOptions);
            }, true);

            // Optional cleanup
            scope.$on('$destroy', function () {
                if (chartInstance && typeof chartInstance.destroy === 'function') {
                    chartInstance.destroy();
                }
            });
        }
    };
});

eHnoteWebApp.directive('stickyScroll', function ($timeout) {
    return {
        restrict: 'A',
        scope: {
            triggerPoint: '@',
            stickyFlag: '='
        },
        link: function (scope, element) {
            var trigger = parseInt(scope.triggerPoint) || 100;

            function onScroll() {
                scope.stickyFlag = element[0].scrollTop >= trigger;
                scope.$applyAsync();
            }

            element.on('scroll', onScroll);

            element.on('$destroy', function () {
                element.off('scroll', onScroll);
            });
        }
    };
});



//eHnoteWebApp.directive('agChart', function () {
//    return {
//        restrict: 'A',
//        scope: {
//            chartOptions: '='
//        },
//        link: function (scope, element) {
//            scope.$watch('chartOptions', function (newOptions) {
//                if (!newOptions) return;

//                // ✅ Confirm AgCharts is available
//                if (typeof AgCharts === 'undefined') {
//                    console.error("AgCharts is not loaded.");
//                    return;
//                }

//                newOptions.container = element[0];
//                AgCharts.create(newOptions);
//            }, true);
//        }
//    };
//});









//Spell checker Directive [Mahendra](Commented cause of performance issue)
//eHnoteWebApp.directive('spellcheck', function ($timeout, SpellcheckService, $document, $compile) {
//    return {
//        restrict: 'A',
//        scope: {
//            singleLine: '@spellcheckSingleLine',
//            placeholder: '@'
//        },
//        require: 'ngModel',
//        link: function (scope, element, attrs, ngModelCtrl) {
//            let isTyping = false;
//            const wrapper = angular.element('<div class="spellcheck-wrapper" style="position: relative;"></div>');
//            const overlay = angular.element('<div class="editable-area" contenteditable="true"></div>');
//            const realInput = element;
//            realInput.css({
//                position: 'absolute',
//                top: 0,
//                left: 0,
//                opacity: 0,
//                zIndex: -1,
//                pointerEvents: 'none'
//            });
//            element.after(wrapper);
//            wrapper.append(overlay);
//            wrapper.append(realInput);
//            const suggestionMenu = angular.element(`
//                <ul class="suggestion-menu" ng-show="visible"
//                    ng-style="{ top: menuPosition.top, left: menuPosition.left }">
//                    <li ng-repeat="s in suggestions" ng-click="replaceWord(s)" ng-if="suggestions.length > 0">
//                        {{ s }}
//                    </li>
//                    <li ng-if="suggestions.length == 0">
//                        No Suggestions
//                    </li>
//                </ul>
//            `);
//            wrapper.append(suggestionMenu);
//            $compile(suggestionMenu)(scope);
//            let typo, wordRange;
//            SpellcheckService.getTypo().then(function (_typo) {
//                typo = _typo;

//                ngModelCtrl.$render = function () {
//                    const value = ngModelCtrl.$viewValue || '';
//                    if (!isTyping) {
//                        overlay.text(value);
//                        $timeout(() => {
//                            highlight(value);
//                            $timeout(() => {
//                                moveCaretToEnd(overlay[0]);
//                                updatePlaceholder();
//                            });
//                        });
//                    }
//                };

//                ngModelCtrl.$render();
//                $timeout(() => {
//                    const initialValue = overlay.text();
//                    highlight(initialValue);
//                });
//                overlay.on('keyup', (e) => {
//                    isTyping = true;
//                    const text = overlay.text();
//                    ngModelCtrl.$setViewValue(text);
//                    updatePlaceholder();
//                    const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
//                    const ignoredKeys = [
//                        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
//                        'Shift', 'Alt', 'Control', 'Meta', 'CapsLock',
//                        'Escape', 'Enter', 'Backspace', 'Delete'
//                    ];

//                    if (isModifierKey || ignoredKeys.includes(e.key)) {
//                        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
//                            $timeout(() => {
//                                scope.visible = false;
//                            });
//                        }
//                        return;
//                    }

//                    $timeout(() => {
//                        scope.visible = false;
//                        if (!isModifierKey && !ignoredKeys.includes(e.key)) {
//                            saveState();
//                        }
//                        const lastChar = text.slice(-1);
//                        if (/\s|[.,;!?]/.test(lastChar)) {
//                            highlight(text);
//                        }

//                        if (wordRange && scope.contextWord) {
//                            const updatedWord = getCaretWord().trim();

//                            if (updatedWord === '') {
//                                scope.visible = false;
//                            } else if (updatedWord !== scope.contextWord && !typo.check(updatedWord)) {
//                                scope.suggestions = typo.suggest(updatedWord)
//                                    .filter(s => levenshtein(s, updatedWord) <= 2)
//                                    .sort((a, b) => levenshtein(a, updatedWord) - levenshtein(b, updatedWord))
//                                    .slice(0, 5);
//                                scope.contextWord = updatedWord;
//                            } else if (typo.check(updatedWord)) {
//                                scope.visible = false;
//                            }

//                            scope.$applyAsync();
//                        }
//                    });
//                    $timeout(() => {
//                        isTyping = false;
//                    });
//                });


//                overlay.on('paste', () => {
//                    $timeout(() => {
//                        let pasted = overlay.text();
//                        updatePlaceholder();
//                        if (scope.singleLine === 'true') {
//                            // Remove line breaks
//                            pasted = pasted.replace(/[\r\n]+/g, ' ');
//                            overlay.text(pasted);
//                        }

//                        ngModelCtrl.$setViewValue(pasted);
//                        highlight(pasted);
//                        overlay[0].focus();
//                        moveCaretToEnd(overlay[0]);
//                        scope.$apply();
//                    });
//                });

//                overlay.on('keydown', function (e) {
//                    if (scope.singleLine === 'true' && (e.key === 'Enter' || e.keyCode === 13)) {
//                        e.preventDefault();
//                    }
//                    if (e.ctrlKey && e.key === 'z') {
//                        e.preventDefault();
//                        if (undoStack.length > 0) {
//                            const currentState = overlay.html();
//                            redoStack.push(currentState);
//                            const prevState = undoStack.pop();
//                            restoreState(prevState);
//                        }
//                    }

//                    // Redo (Ctrl + Y)
//                    if (e.ctrlKey && e.key === 'y') {
//                        e.preventDefault();
//                        if (redoStack.length > 0) {
//                            const nextState = redoStack.pop();
//                            undoStack.push(overlay.html());
//                            restoreState(nextState);
//                        }
//                    }
//                });

//                overlay.on('contextmenu', (e) => {
//                    const sel = window.getSelection();
//                    if (sel.rangeCount === 0) return;
//                    const range = sel.getRangeAt(0);
//                    wordRange = getWordRange(range);
//                    if (!wordRange) return;
//                    const word = wordRange.toString().trim();

//                    try {
//                        if (!typo.check(word)) {
//                            e.preventDefault();
//                            e.stopPropagation();

//                            scope.contextWord = word;
//                            scope.suggestions = typo.suggest(word)
//                                .filter(s => levenshtein(s, word) <= 2)
//                                .sort((a, b) => levenshtein(a, word) - levenshtein(b, word))
//                                .slice(0, 5);

//                            const rects = wordRange.getClientRects();
//                            const rect = rects.length > 0 ? rects[0] : wordRange.getBoundingClientRect();
//                            scope.menuPosition = {
//                                top: (rect.bottom + window.scrollY + 5) + 'px',
//                                left: rect.left + window.scrollX + 'px'
//                            };
//                            scope.visible = true;
//                            scope.$apply();
//                        } else {
//                            scope.visible = false;
//                            scope.$apply();
//                        }
//                    } catch (err) {
//                        console.error('Error in contextmenu:', err);
//                    }

//                });

//                $document.off('click.spellcheck');
//                $document.on('click.spellcheck', (e) => {
//                    const clickedInsideWrapper = wrapper[0].contains(e.target);
//                    if (!clickedInsideWrapper) {
//                        scope.$evalAsync(() => {
//                            scope.visible = false;
//                        });
//                    }
//                });

//                scope.$on('$destroy', () => {
//                    $document.off('click.spellcheck');
//                });

//                scope.replaceWord = function (newWord) {
//                    if (wordRange) {
//                        const textNode = document.createTextNode(newWord);
//                        wordRange.deleteContents();
//                        wordRange.insertNode(textNode);

//                        const newRange = document.createRange();
//                        newRange.setStartAfter(textNode);
//                        newRange.collapse(true);

//                        const sel = window.getSelection();
//                        sel.removeAllRanges();
//                        sel.addRange(newRange);

//                        scope.visible = false;

//                        $timeout(() => {
//                            highlight(overlay.text());
//                        });
//                    }
//                };

//            });

//            function getCaretWord() {
//                const sel = window.getSelection();
//                if (sel.rangeCount === 0) return '';

//                const range = sel.getRangeAt(0);
//                const wordRange = getWordRange(range);
//                return wordRange ? wordRange.toString() : '';
//            }

//            function highlight(_) {
//                const caretOffset = saveCaretPosition(overlay[0]);
//                const nodes = Array.from(overlay[0].childNodes);
//                const processed = nodes.map(node => {
//                    if (node.nodeType === Node.TEXT_NODE) {
//                        return wrapMisspelledWords(node.textContent);
//                    } else if (node.nodeName === 'BR') {
//                        return '<br>';
//                    } else if (node.nodeType === Node.ELEMENT_NODE && node.innerHTML) {
//                        const inner = wrapMisspelledWords(node.innerText || node.textContent);
//                        return `<${node.nodeName.toLowerCase()}>${inner}</${node.nodeName.toLowerCase()}>`;
//                    } else {
//                        return node.outerHTML || '';
//                    }
//                });

//                overlay.html(processed.join(''));
//                restoreCaretPosition(overlay[0], caretOffset);
//            }

//            /*function wrapMisspelledWords(text) {
//                const words = text.split(/(\s+)/);
//                return words.map(word => {
//                    const safeWord = word.replace(/</g, '&lt;').replace(/>/g, '&gt;');
//                    return !typo.check(word.trim()) && word.trim() !== ''
//                        ? `<span class="misspelled">${safeWord}</span>`
//                        : safeWord;
//                }).join('');
//            }*/
//            function isNumeric(word) {
//                return /^\d+$/.test(word); // skip pure numbers
//            }

//            // Leading special characters to skip (exclude brackets, period, and comma)
//            function hasLeadingIgnoredSpecialChar(word) {
//                return /^[!@#$%^&*_+=:;'"<>?/\\|-]+[a-zA-Z0-9]/.test(word);
//            }

//            // Strip brackets from start/end for spellcheck
//            function stripBrackets(word) {
//                return word.replace(/^[\[\]{}()]+|[\[\]{}()]+$/g, '');
//            }

//            function wrapMisspelledWords(text) {
//                const words = text.split(/(\s+)/); // split by spaces and keep spaces

//                return words.map(word => {
//                    const trimmed = word.trim();
//                    const safeWord = word.replace(/</g, '&lt;').replace(/>/g, '&gt;');

//                    // Skip empty
//                    if (trimmed === '') return safeWord;

//                    // 1. Skip numbers
//                    if (isNumeric(trimmed)) return safeWord;

//                    // 2. Skip leading special characters (but not brackets, period, comma)
//                    if (hasLeadingIgnoredSpecialChar(trimmed)) return safeWord;

//                    // 3. Remove brackets for spellcheck
//                    let wordForCheck = stripBrackets(trimmed);

//                    // 4. Check for period
//                    if (wordForCheck.endsWith('.')) {
//                        return `<span class="misspelled">${safeWord}</span>`;
//                    }
//                    if (wordForCheck.startsWith('.')) {
//                        // remove leading period before spellcheck
//                        wordForCheck = wordForCheck.replace(/^\.+/, '');
//                    }

//                    // 5. Handle comma
//                    let hasLeadingComma = wordForCheck.startsWith(',');
//                    let hasTrailingComma = wordForCheck.endsWith(',');
//                    wordForCheck = wordForCheck.replace(/^,+|,+$/g, ''); // strip commas for checking

//                    // 6. If word is empty after stripping (only special chars)
//                    if (wordForCheck === '') return safeWord;

//                    // 7. Spellcheck logic:
//                    if (!typo.check(wordForCheck)) {
//                        // Word misspelled → mark error
//                        return `<span class="misspelled">${safeWord}</span>`;
//                    } else {
//                        // Word is correct
//                        if (hasTrailingComma || hasLeadingComma) {
//                            // If correct, ignore commas (don't mark error)
//                            return safeWord;
//                        }
//                        return safeWord;
//                    }
//                }).join('');
//            }



//            function saveCaretPosition(container) {
//                const sel = window.getSelection();
//                if (sel.rangeCount === 0) return 0;
//                const range = sel.getRangeAt(0);
//                const preRange = range.cloneRange();
//                preRange.selectNodeContents(container);
//                preRange.setEnd(range.endContainer, range.endOffset);
//                const brCount = container.querySelectorAll('br').length;
//                return preRange.toString().length + brCount;
//            }

//            function restoreCaretPosition(container, offset) {
//                const nodeIterator = document.createNodeIterator(container, NodeFilter.SHOW_TEXT);
//                let currentNode;
//                let currentOffset = 0;

//                while ((currentNode = nodeIterator.nextNode())) {
//                    const nextOffset = currentOffset + currentNode.length;
//                    if (offset <= nextOffset) {
//                        const range = document.createRange();
//                        const sel = window.getSelection();
//                        range.setStart(currentNode, offset - currentOffset);
//                        range.collapse(true);
//                        sel.removeAllRanges();
//                        sel.addRange(range);
//                        break;
//                    }
//                    currentOffset = nextOffset;
//                }

//                const brs = container.querySelectorAll('br');
//                if (brs.length > 0) {
//                    const brOffset = Math.min(brs.length, offset);
//                    const range = document.createRange();
//                    const sel = window.getSelection();
//                    range.setStartAfter(brs[brOffset - 1]);
//                    range.collapse(true);
//                    sel.removeAllRanges();
//                    sel.addRange(range);
//                }
//            }

//            function moveCaretToEnd(el) {
//                el.focus();
//                const range = document.createRange();
//                const sel = window.getSelection();
//                range.collapse(false);
//                range.selectNodeContents(el);
//                range.collapse(false); // move to end
//                sel.removeAllRanges();
//                sel.addRange(range);
//            }


//            function getWordRange(range) {
//                let node = range.startContainer;
//                if (!node) return null;
//                if (node.nodeType !== 3 && node.firstChild && node.firstChild.nodeType === 3) {
//                    node = node.firstChild; // handle <span> elements wrapping text
//                }
//                if (node.nodeType !== 3) return null;

//                const text = node.textContent;
//                const offset = range.startOffset;
//                const left = text.slice(0, offset).search(/\b\S+$/);
//                const right = text.slice(offset).search(/\s/);
//                const start = left >= 0 ? left : 0;
//                const end = right >= 0 ? offset + right : text.length;
//                const wordRange = document.createRange();
//                wordRange.setStart(node, start);
//                wordRange.setEnd(node, end);
//                return wordRange;
//            }

//            $timeout(() => {
//                const computedStyle = window.getComputedStyle(realInput[0]);

//                const commonStyles = {
//                    width: computedStyle.width,
//                    height: computedStyle.height,
//                    fontSize: computedStyle.fontSize,
//                    fontFamily: computedStyle.fontFamily,
//                    lineHeight: computedStyle.lineHeight,
//                    padding: computedStyle.padding,
//                    margin: computedStyle.margin,
//                    borderRadius: computedStyle.borderRadius,
//                    boxSizing: computedStyle.boxSizing,
//                    overflow: 'auto',
//                    overflowX: 'auto',
//                    overflowY: 'hidden'
//                };

//                if (scope.singleLine === 'true') {
//                    overlay.addClass('spellcheck-singleline');
//                } else {
//                    overlay.addClass('spellcheck-multiline');
//                }
//                overlay.css(commonStyles);
//                updatePlaceholder();
//                /*ngModelCtrl.$render = function () {
//                    const value = ngModelCtrl.$viewValue || '';
//                    if (!isTyping) {
//                        overlay.text(value);
//                        highlight(value);
//                        $timeout(() => {
//                            updatePlaceholder();
//                        });
//                    }
//                };*/
//            });

//            /*Undo and Redo*/
//            let undoStack = [];
//            let redoStack = [];
//            function saveState() {
//                undoStack.push(overlay.html());
//                // Limit stack size if needed
//                if (undoStack.length > 100) undoStack.shift();
//                redoStack = []; // Clear redo stack on new input
//            }
//            function restoreState(state) {
//                overlay.html(state);
//                const plainText = overlay.text();
//                ngModelCtrl.$setViewValue(plainText);
//                moveCaretToEnd(overlay[0]);
//                scope.$applyAsync();
//            }

//            /*For better suggestions*/
//            function levenshtein(a, b) {
//                const matrix = [];
//                for (let i = 0; i <= b.length; i++) matrix[i] = [i];
//                for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

//                for (let i = 1; i <= b.length; i++) {
//                    for (let j = 1; j <= a.length; j++) {
//                        matrix[i][j] = b.charAt(i - 1) === a.charAt(j - 1)
//                            ? matrix[i - 1][j - 1]
//                            : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
//                    }
//                }
//                return matrix[b.length][a.length];
//            }

//            /*Placeholder*/
//            function updatePlaceholder() {
//                const rawText = overlay.text().replace(/\u200B/g, '').trim();
//                const isVisuallyEmpty = rawText === '';

//                if (isVisuallyEmpty) {
//                    overlay.addClass('has-placeholder');
//                    overlay.attr('data-placeholder', scope.placeholder || '');
//                } else {
//                    overlay.removeClass('has-placeholder');
//                    overlay.removeAttr('data-placeholder');
//                }
//            }
//        }
//    };


//});

eHnoteWebApp.directive('dragScroll', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            var isDown = false, dragged = false;
            var startX, startY, scrollLeft, scrollTop;
            function onPointerDown(e) {
                isDown = true;
                dragged = false;
                startX = (e.pageX !== undefined ? e.pageX : e.clientX);
                startY = (e.pageY !== undefined ? e.pageY : e.clientY);
                scrollLeft = element[0].scrollLeft;
                scrollTop = element[0].scrollTop;
                element.addClass('active');
                e.preventDefault && e.preventDefault();
            }

            function onPointerMove(e) {
                if (!isDown) return;
                var x = (e.pageX !== undefined ? e.pageX : e.clientX);
                var y = (e.pageY !== undefined ? e.pageY : e.clientY);
                var dx = x - startX;
                var dy = y - startY;
                element[0].scrollLeft = scrollLeft - dx;
                element[0].scrollTop = scrollTop - dy;

                if (Math.abs(element[0].scrollLeft - scrollLeft) > 3 ||
                    Math.abs(element[0].scrollTop - scrollTop) > 3) {
                    dragged = true;
                }
                e.preventDefault && e.preventDefault();
            }
            function onPointerUp() {
                isDown = false;
                element.removeClass('active');
                setTimeout(function () { dragged = false; }, 0);
            }
            function onClickCapture(e) {
                if (dragged) {
                    e.preventDefault && e.preventDefault();
                    e.stopPropagation && e.stopPropagation();
                    e.stopImmediatePropagation && e.stopImmediatePropagation();
                    dragged = false;
                    return false;
                }
            }
            element[0].addEventListener('mousedown', onPointerDown);
            document.addEventListener('mousemove', onPointerMove);
            document.addEventListener('mouseup', onPointerUp);
            element[0].addEventListener('click', onClickCapture, true);
            document.addEventListener('click', onClickCapture, true);

            scope.$on('$destroy', function () {
                element[0].removeEventListener('mousedown', onPointerDown);
                document.removeEventListener('mousemove', onPointerMove);
                document.removeEventListener('mouseup', onPointerUp);
                element[0].removeEventListener('click', onClickCapture, true);
                document.removeEventListener('click', onClickCapture, true);
            });
        }
    };
});

// 🔹 Global HTTP interceptor for encoding request data
eHnoteWebApp.factory('encodeInterceptor', function () {

    // helper to check if string is already Base64
    function isBase64(str) {
        try {
            return btoa(atob(str)) === str;
        } catch (err) {
            return false;
        }
    }

    // recursive encoder
    function encodeValue(val) {

        //if (val && typeof val === 'object') {
        //    for (const key in val) {
        //        if (val.hasOwnProperty(key)) {
        //            const value = val[key];
        //            if (typeof value === 'string' && value.includes('?') && value.startsWith('http')) {
        //                // Remove query params
        //                let cleaned = value.split('?')[0];
        //                // Encode the URL after cleaning
        //                let encoded = btoa(unescape(encodeURIComponent(cleaned)));
        //                val[key] = encoded;
        //            }
        //        }
        //    }
        //}

        if (typeof val === "string") {
            if (val.startsWith('http') && val.includes('?')) {
                // Remove query params
                let cleaned = val.split('?')[0];
                // Encode the cleaned URL
                let encoded = btoa(unescape(encodeURIComponent(cleaned)));
                val = encoded;
            }
            // Only encode if it has special chars AND not already base64
            else if (/[><=&;'"`]/.test(val) && !isBase64(val)) {
                let encoded = btoa(unescape(encodeURIComponent(val)));

                // ✅ Ensure proper padding (= or ==)
                let padding = encoded.length % 4;
                if (padding > 0) {
                    encoded += '='.repeat(4 - padding);
                }

                return encoded;
            }
        }
        else if (typeof val === "object" && val !== null) {
            for (var key in val) {
                if (val.hasOwnProperty(key)) {
                    val[key] = encodeValue(val[key]);
                }
            }
        }
        return val;
    }

    return {
        request: function (config) {
            // 🔹 Skip login APIs (to avoid double encryption/decryption issues)
            //if (config.url &&
            //    (config.url.indexOf("/ValidateUserLogin") !== -1 ||
            //        config.url.indexOf("/NewValidateUserLogin") !== -1)) {
            //    return config; // don't encode login requests
            //}

            // Encode request body if present
            //if (config.data) {
            //    config.data = encodeValue(config.data);
            //}

            const base64Apis = [
                //"/api/Consultation/AddUpdateChiefComplaints",
                ////"/api/Patient/AddUpdatePatientSignedConsentDocuments",
                //"/api/Insurance/AddUpdatePatientNoteandAlertData",
                //"/api/Patient/AddSetRemainderDetailsById",
                ////"/api/patient/modifypatientinsurancedetails",
                // "/api/Patient/AddUpdatePatientNewRegister",
                // "/api/Patient/AddUpdatePatientAddressDeatils",
                //// //"/api/patient/addupdatepatientfamilydetails",
                //"/api/Insurance/AddUpdatePatientDepositAmount",
                //"/api/Consultation/AddupdateROSData",
                // //"/api/Setting/AddupdateOrganizationServiceFacilities",
                // //"/api/Admin/AddUpdateOrganizationClearingHouseDetails",
                // //"/api/Admin/AddUpdateGroupsNew",
                // "/api/Admin/AddUpdateUserBasicInfo",
                // //"/api/MasterAdmins/ModifyUserBranchDetailsnew",
                // //"/api/Admin/AddupdateUserSlotSchedule",
                "/api/MasterAdmins/AddUpdateUserLeaves",
                // "/api/Surgery/AddUpdateAscAdmissionDetails",
                 // "/api/Surgery/AddUpdateASCHandPQuickAccess",
               // "/api/Surgery/AddUpdatePatientPreOpCallDetails",
               // // "/api/Surgery/AddUpdatePreSurgeryOrders",
               // // "/api/Surgery/AddUpdatePreOpAndDialationMedications",
               // // "/api/Surgery/AddUpdateIntraOPMedications",
               // // "/api/Surgery/AddUpdateAscUserOrderTemplates",
               // // "/api/Surgery/AddUpdatePostOPMedications",
               // // "/api/Surgery/AddUpdateASCVitalsQuickAccess",
               // // "/api/Surgery/AddUpdatePreOpChartData",
               // // "/api/Surgery/AddUpdateIntraOpChartData",
               // // "/api/Surgery/AddUpdatePreAdmissionDetails",
               // // "/api/Surgery/AddUpdatePostOpChartData",
               // // "/api/Surgery/AddUpdatePatientFacesheet",
               // // "/api/Surgery/AddUpdateOperativeDischargeTemplates",
               // // "/api/Surgery/AddUpdateOperativeNotesDetails",
               // // "/api/Surgery/AddUpdatePostOpDischargeDetails",
               // // "/api/Surgery/UpdatePatientSurgeryData",
               // // "/api/Surgery/AddUpdatePreAdmChecklistDetails",
               // // "/api/Surgery/AddUpdatePreAdmissionCardiologistDetails",
               // // "/api/Surgery/AddUpdatePreAdmCoOrdinatorDetails",
               // "/api/Consultation/AddUpdateVisionPerceptionDetails",
               // // "/api/Patient/AddUpdatePatientProfileStatus",
               //  "/api/Patient/ModifyAscPreAuthorizationDetails",
               // // //"/api/CareTeam/ModifyReferalPCPDoctor",
               // "/api/Patient/ModifyAppointmentNotesById",
               // // "/api/Patient/AddUpdateAppointmentNew",
               // // //"/api/Patient/ASCPatientScannedImages",
               // // "/api/Consultation/AddUpdateAppointmentAssessmentplanDetails",
               // "/api/Patient/UpdatePatientOrderImageStudyDetailsAndFiles",
               // // //"/api/Surgery/AddAuditLog",
               // // //"/api/Insurance/AddUpdatePatientClaimv2",
               // "/api/Consultation/AddUpdateDilationMedicationDetails",
               // "/api/Consultation/AddUpdateContactLensDetails",
               //"/api/Consultation/AddUpdateOPProcedureData",
               // // "/api/Consultation/ModifyConsultation",
               // "/api/Patient/AddUpdatePatientNotes",
               // "/api/Consultation/AddUpdatePatientPrescriptionDetails",
            ];

            // Only encode if URL matches
            if (config.url && base64Apis.some(api => config.url.indexOf(api) !== -1)) {
                if (config.data) {
                    config.data = encodeValue(config.data);
                }
            }
            return config;
        }
    };
});

 
eHnoteWebApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('encodeInterceptor');
});
eHnoteWebApp.directive('autoScrollActiveCard', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var container = element[0];

            scope.$on('duScrollspy:becameActive', function (event, activeLink) {

                $timeout(function () {

                    var li = activeLink.closest('li.appointment__card--');
                    if (!li || !li.length) return;

                    var card = li[0];

                    var cardTop = card.offsetTop;
                    var cardHeight = card.offsetHeight;
                    var containerHeight = container.clientHeight;

                    container.scrollTo({
                        top: cardTop - 10,
                        behavior: 'smooth'
                    });

                }, 0);
            });
        }
    };
});

eHnoteWebApp.directive('svgIcon', function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            svgIcon: '@',
            size: '@'
        },
        template: function (elem, attrs) {
            return '<svg class="ui-icon" width="' + (attrs.size || 20) +
                '" height="' + (attrs.size || 20) + '">' +
                '<use xlink:href="img/sprite-sheet/action__iconsheet.svg#' +
                attrs.svgIcon + '"></use>' +
                '</svg>';
        }
    };
});

/*
 * on-wheel="expression"
 * Mouse-wheel handler that normalises legacy (wheelDelta / detail) and standard
 * (deltaY) wheel events, including the jQuery-wrapped case where deltaY only
 * exists on originalEvent. Exposes $delta as +1 (up / zoom in) or -1 (down /
 * zoom out) to the expression. Used for wheel-zoom in the image viewers.
 */
eHnoteWebApp.directive('onWheel', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var WHEEL_EVENTS = 'wheel DOMMouseScroll mousewheel onmousewheel';

            function handler(event) {
                var native = event.originalEvent || event;
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

                scope.$applyAsync(function () {
                    scope.$eval(attrs.onWheel, { $delta: delta, $event: event });
                });

                if (event.preventDefault) { event.preventDefault(); }
                event.returnValue = false;
            }

            element.on(WHEEL_EVENTS, handler);
            scope.$on('$destroy', function () {
                element.off(WHEEL_EVENTS, handler);
            });
        }
    };
});





//eHnoteWebApp.directive("encodeInterceptor", [function () {
//    return {
//        restrict: "A",
//        require: "ngModel",
//        link: function (scope, elem, attrs, ngModelCtrl) {

//            // 🔹 Check if string is Base64
//            function isBase64(str) {
//                try {
//                    return btoa(atob(str)) === str;
//                } catch (e) {
//                    return false;
//                }
//            }

//            // 🔹 view → model (encode before sending to API)
//            ngModelCtrl.$parsers.push(function (viewValue) {
//                if (viewValue && !isBase64(viewValue)) {
//                    return btoa(unescape(encodeURIComponent(viewValue))); // encode always
//                }
//                return viewValue;
//            });

//            // 🔹 model → view (decode for displaying in input)
//            ngModelCtrl.$formatters.push(function (modelValue) {
//                if (modelValue && isBase64(modelValue)) {
//                    try {
//                        return decodeURIComponent(escape(atob(modelValue))); // decode
//                    } catch (e) {
//                        return modelValue; // fallback if not valid
//                    }
//                }
//                return modelValue;
//            });
//        }
//    };
//}]);


eHnoteWebApp.directive("dateRangeOneYear", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {

            function updateModel(dateText) {
                scope.$applyAsync(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            }

            // ---------- 1️⃣ Initialize datepicker ----------
            elem.datepicker({
                dateFormat: "mm-dd-yy",
                maxDate: new Date(), // 🚫 disable future dates
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            });

            // ---------- 2️⃣ DEFAULT From Date range (based on TODAY) ----------
            if (attrs.dateRangeOneYear) {

                var today = new Date();

                // First day of current month
                var firstDayOfCurrentMonth =
                    new Date(today.getFullYear(), today.getMonth(), 1);

                // Go back 11 months → total 12 months window
                var defaultMinDate = new Date(firstDayOfCurrentMonth);
                defaultMinDate.setMonth(defaultMinDate.getMonth() - 11);

                // Apply default restriction
                elem.datepicker("option", {
                    minDate: defaultMinDate,
                    maxDate: today
                });

                // ---------- 3️⃣ Update From Date when To Date changes ----------
                scope.$watch(attrs.dateRangeOneYear, function (newVal) {
                    if (!newVal) return;

                    var parts = newVal.split("-");
                    var toDate = new Date(parts[2], parts[0] - 1, parts[1]);

                    // First day of To Date month
                    var firstDayOfToMonth =
                        new Date(toDate.getFullYear(), toDate.getMonth(), 1);

                    // 12-month window
                    var minDate = new Date(firstDayOfToMonth);
                    minDate.setMonth(minDate.getMonth() - 11);

                    var maxSelectableDate = toDate > today ? today : toDate;

                    elem.datepicker("option", {
                        minDate: minDate,
                        maxDate: maxSelectableDate
                    });
                });
            }
        }
    };
});


eHnoteWebApp.directive('autoScroll', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {

            element.on('scroll', function () {

                var el = element[0];

                // Update active visit while scrolling
                if (scope.updateVisibleVisit) {
                    scope.$applyAsync(function () {
                        scope.updateVisibleVisit();
                    });
                }

                // Prevent duplicate API calls
                if (scope.ScrollLoading || scope.ScrollNoMoreData) {
                    return;
                }

                var reachedBottom =
                    el.scrollTop + el.clientHeight >= el.scrollHeight - 2;

                if (reachedBottom) {

                    scope.$applyAsync(function () {
                        scope.loadNextVisit();
                    });

                }
            });

            scope.$on('$destroy', function () {
                element.off('scroll');
            });
        }
    };
});




eHnoteWebApp.directive("denialdatepicker", [function () {
    return {
        restrict: "A",
        require: "ngModel",
        scope: {
            mindate: "="
        },
        link: function (scope, elem, attrs, ngModelCtrl) {

            function updateModel(dateText) {
                scope.$applyAsync(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            }

            var options = {
                dateFormat: "mm-dd-yy",  
                minDate: scope.mindate,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };

            elem.datepicker(options);

            ngModelCtrl.$render = function () {
                if (ngModelCtrl.$viewValue) {
                    elem.datepicker("setDate", ngModelCtrl.$viewValue);
                }
            };

            scope.$watch("mindate", function (newVal) {
                elem.datepicker("option", "minDate", newVal);
            });
        }
    };
}]);


eHnoteWebApp.directive('percentageInput', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attrs, ctrl) {
            ctrl.$parsers.unshift(function (inputValue) {
                var cleaned = inputValue ? inputValue.replace(/[^0-9.]/g, '') : '';
                var parts = cleaned.split('.');
                if (parts.length > 2) cleaned = parts[0] + '.' + parts.slice(1).join('');
                var num = parseFloat(cleaned);
                if (!isNaN(num) && num > 100) {
                    cleaned = '100';
                }
                if (cleaned !== inputValue) {
                    ctrl.$setViewValue(cleaned);
                    ctrl.$render();
                }
                return cleaned;
            });
        }
    };
});

eHnoteWebApp.filter('noRound2', function () {
    return function (value) {
        if (!value) return '0.00';
        return (Math.floor(value * 100) / 100).toFixed(2);
    };
});
eHnoteWebApp.directive('hoverSubMenu', function ($timeout) {

    return {

        restrict: 'A',

        link: function (scope, element) {

            var subMenu = element[0].querySelector('.sub-menu');

            if (!subMenu) return;

            function positionSubMenu() {

                var itemRect = element[0].getBoundingClientRect();

                var subWidth = subMenu.offsetWidth || 160;

                var spaceRight = window.innerWidth - itemRect.right;

                var spaceLeft = itemRect.left;

                subMenu.classList.remove('to-left', 'to-right', 'sub-menu--open');

                if (spaceRight >= subWidth + 8) {

                    subMenu.classList.add('to-right');

                } else if (spaceLeft >= subWidth + 8) {

                    subMenu.classList.add('to-left');

                } else {

                    subMenu.classList.add(spaceRight >= spaceLeft ? 'to-right' : 'to-left');

                }

                subMenu.classList.add('sub-menu--open');

            }

            function hideSubMenu() {

                subMenu.classList.remove('sub-menu--open', 'to-left', 'to-right');

            }

            element.on('mouseenter', function () {

                $timeout(function () {

                    positionSubMenu();

                }, 0);

            });

            element.on('mouseleave', function (e) {

                if (!subMenu.contains(e.relatedTarget)) {

                    hideSubMenu();

                }

            });

            angular.element(subMenu).on('mouseleave', function (e) {

                if (!element[0].contains(e.relatedTarget)) {

                    hideSubMenu();

                }

            });

            scope.$on('$destroy', function () {

                element.off('mouseenter mouseleave');

                angular.element(subMenu).off('mouseleave');

            });

        }

    };

});



eHnoteWebApp.directive('ipadReadonly', ['$timeout', '$rootScope', function ($timeout, $rootScope) {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {

            var isIpad =
                /iPad/.test(navigator.userAgent) ||
                (/Macintosh/.test(navigator.userAgent) &&
                    navigator.maxTouchPoints > 1);

            var isAndroidTablet =
                /Android/.test(navigator.userAgent) &&
                !/Mobile/.test(navigator.userAgent);

            if (isIpad || isAndroidTablet) {
                element.attr('inputmode', 'none');
                element.css('caret-color', 'transparent');

                // Watch global keyboard toggle — update this input when state changes
                scope.$watch(function () { return $rootScope.ipadKeyboardEnabled; }, function (enabled) {
                    if (enabled) {
                        element.removeAttr('inputmode');
                        element.css('caret-color', '');
                    } else {
                        element.attr('inputmode', 'none');
                        element.css('caret-color', 'transparent');
                    }
                });

                element[0].addEventListener('touchend', function () {
                    if ($rootScope.ipadKeyboardEnabled) return;
                    $timeout(function () {
                        if (ngModel) {
                            ngModel.$setViewValue('');
                            ngModel.$render();
                        } else {
                            element[0].value = '';
                        }
                        element[0].focus();
                    }, 50);
                }, { passive: true });
            }
        }
    };
}]);

eHnoteWebApp.directive('fromToDatePicker', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        scope: true,
        link: function (scope, element, attrs) {
            var fromDateGetter = $parse(attrs.fromDate);
            var fromDateSetter = fromDateGetter.assign;

            var toDateGetter = $parse(attrs.toDate);
            var toDateSetter = toDateGetter.assign;

            scope.fromDateModel = attrs.fromDate;
            scope.toDateModel = attrs.toDate;
            scope.pickerId = attrs.pickerId;

            var tabsConfig = [];
            if (attrs.drpTabs) {
                try { tabsConfig = JSON.parse(attrs.drpTabs); } catch (e) { tabsConfig = []; }
            }

            var tabModelGetter = attrs.tabModel ? $parse(attrs.tabModel) : null;
            var tabModelSetter = tabModelGetter ? tabModelGetter.assign : null;

            var blockFuture = attrs.hasOwnProperty('blockFuture');
            var blockPast = attrs.hasOwnProperty('blockPast');

            var MONTHS = [
                { val: 0, label: 'January' }, { val: 1, label: 'February' },
                { val: 2, label: 'March' }, { val: 3, label: 'April' },
                { val: 4, label: 'May' }, { val: 5, label: 'June' },
                { val: 6, label: 'July' }, { val: 7, label: 'August' },
                { val: 8, label: 'September' }, { val: 9, label: 'October' },
                { val: 10, label: 'November' }, { val: 11, label: 'December' }
            ];

            var today = new Date(); today.setHours(0, 0, 0, 0);
            var currentYear = today.getFullYear();
            var years = [];
            for (var y = currentYear - 5; y <= currentYear + 5; y++) years.push(y);

            // ── POINT 1: filtered month/year lists based on block flags ──
            function getAllowedMonths(year) {
                return MONTHS.filter(function (m) {
                    if (blockPast) {
                        // month must be >= today's month if same year
                        if (year < today.getFullYear()) return false;
                        if (year === today.getFullYear() && m.val < today.getMonth()) return false;
                    }
                    if (blockFuture) {
                        if (year > today.getFullYear()) return false;
                        if (year === today.getFullYear() && m.val > today.getMonth()) return false;
                    }
                    return true;
                });
            }

            function getAllowedYears() {
                return years.filter(function (y) {
                    if (blockPast && y < today.getFullYear()) return false;
                    if (blockFuture && y > today.getFullYear()) return false;
                    return true;
                });
            }

            var drp = scope.drp = {
                tabs: tabsConfig,
                activeTab: tabsConfig.length ? tabsConfig[0].key : null,
                dayNames: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                months: MONTHS,
                years: years,
                leftMonths: getAllowedMonths(today.getFullYear()),
                rightMonths: getAllowedMonths(today.getFullYear()),
                allowedYears: getAllowedYears(),
                leftYear: today.getFullYear(),
                leftMonth: today.getMonth(),
                rightYear: today.getFullYear(),
                rightMonth: today.getMonth(),
                from: null,
                to: null,
                hover: null,
                leftWeeks: [],
                rightWeeks: [],
                blockFuture: blockFuture,
                blockPast: blockPast
            };

            var drp = scope.drp;

            // Accepts Date objects and MM-dd-yyyy strings (new Date('MM-dd-yyyy') is invalid in Safari/Firefox).
            function toPickerDate(v) {
                if (!v) return null;
                if (typeof v === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(v)) {
                    var p = v.split('-');
                    return new Date(+p[2], +p[0] - 1, +p[1]);
                }
                return new Date(v);
            }

            if (tabModelSetter && drp.activeTab) tabModelSetter(scope, drp.activeTab);

            scope.drpSetTab = function (key) {
                drp.activeTab = key;
                if (tabModelSetter) tabModelSetter(scope, key);
            };

            function sameDay(a, b) {
                return a && b &&
                    a.getFullYear() === b.getFullYear() &&
                    a.getMonth() === b.getMonth() &&
                    a.getDate() === b.getDate();
            }

            function isBlocked(dt) {
                if (!dt) return false;
                if (blockFuture && dt > today) return true;
                if (blockPast && dt < today) return true;
                return false;
            }

            function buildWeeks(year, month) {
                var weeks = [], row = [];
                var first = new Date(year, month, 1).getDay();
                var total = new Date(year, month + 1, 0).getDate();
                for (var i = 0; i < first; i++) row.push({ num: '', date: null, empty: true });
                for (var d = 1; d <= total; d++) {
                    var dt = new Date(year, month, d);
                    row.push({
                        num: d,
                        date: dt,
                        past: blockPast && dt < today,
                        future: blockFuture && dt > today,
                        isToday: sameDay(dt, today)  // point 3
                    });
                    if (row.length === 7) { weeks.push(row); row = []; }
                }
                if (row.length) {
                    while (row.length < 7) row.push({ num: '', date: null, empty: true });
                    weeks.push(row);
                }
                return weeks;
            }

            function render() {
                drp.leftWeeks = buildWeeks(drp.leftYear, drp.leftMonth);
                drp.rightWeeks = buildWeeks(drp.rightYear, drp.rightMonth);
                drp.leftMonths = getAllowedMonths(drp.leftYear);
                drp.rightMonths = getAllowedMonths(drp.rightYear);
            }

            scope.drpShowLeftPrev = function () {
                if (blockPast) {
                    return !(drp.leftYear === today.getFullYear() && drp.leftMonth === today.getMonth());
                }
                return true;
            };

            scope.drpShowLeftNext = function () {
                if (blockFuture) {
                    var nextM = drp.leftMonth === 11 ? 0 : drp.leftMonth + 1;
                    var nextY = drp.leftMonth === 11 ? drp.leftYear + 1 : drp.leftYear;
                    return !(nextY > today.getFullYear() ||
                        (nextY === today.getFullYear() && nextM > today.getMonth()));
                }
                return true;
            };

            scope.drpShowRightPrev = function () {
                if (blockPast) {
                    return !(drp.rightYear === today.getFullYear() && drp.rightMonth === today.getMonth());
                }
                return true;
            };

            scope.drpShowRightNext = function () {
                if (blockFuture) {
                    var nextM = drp.rightMonth === 11 ? 0 : drp.rightMonth + 1;
                    var nextY = drp.rightMonth === 11 ? drp.rightYear + 1 : drp.rightYear;
                    return !(nextY > today.getFullYear() ||
                        (nextY === today.getFullYear() && nextM > today.getMonth()));
                }
                return true;
            };

            scope.drpPrevMonth = function () {
                if (!scope.drpShowLeftPrev()) return;
                if (drp.leftMonth === 0) { drp.leftMonth = 11; drp.leftYear--; }
                else drp.leftMonth--;
                render();
            };

            scope.drpLeftNextMonth = function () {
                if (!scope.drpShowLeftNext()) return;
                if (drp.leftMonth === 11) { drp.leftMonth = 0; drp.leftYear++; }
                else drp.leftMonth++;
                render();
            };

            scope.drpRightPrevMonth = function () {
                if (!scope.drpShowRightPrev()) return;
                if (drp.rightMonth === 0) { drp.rightMonth = 11; drp.rightYear--; }
                else drp.rightMonth--;
                render();
            };

            scope.drpNextMonth = function () {
                if (!scope.drpShowRightNext()) return;
                if (drp.rightMonth === 11) { drp.rightMonth = 0; drp.rightYear++; }
                else drp.rightMonth++;
                render();
            };

            scope.drpOnLeftMonthChange = function () { render(); };
            scope.drpOnLeftYearChange = function () { render(); };
            scope.drpOnRightMonthChange = function () { render(); };
            scope.drpOnRightYearChange = function () { render(); };

            scope.drpSelectDay = function (day, side) {
                if (!day || !day.date || day.empty) return;
                if (isBlocked(day.date)) return;
                if (side === 'from' && drp.to && day.date > drp.to) return;
                if (side === 'to' && drp.from && day.date < drp.from) return;

                if (side === 'from') {
                    drp.from = (drp.from && sameDay(drp.from, day.date)) ? null : day.date;
                } else {
                    drp.to = (drp.to && sameDay(drp.to, day.date)) ? null : day.date;
                }

                fromDateSetter(scope.$parent, drp.from || null);
                toDateSetter(scope.$parent, drp.to || null);

                drp.hover = null;
                render();
            };

            scope.drpRefresh = function () { };

            scope.drpGetCellClass = function (day) {
                if (!day || day.empty || !day.date) return '';
                if (!drp.from || !drp.to) return '';
                if (day.date >= drp.from && day.date <= drp.to) {
                    return 'bg__1D55581A--';
                }
                return '';
            };

            scope.drpGetSpanClass = function (day, side) {
                if (!day || !day.date || day.empty) return '';

                var blocked = isBlocked(day.date);
                if (!blocked && side === 'from' && drp.to && day.date > drp.to) blocked = true;
                if (!blocked && side === 'to' && drp.from && day.date < drp.from) blocked = true;

                if (blocked || day.past || day.future) return 'tc__9CA3AF--';
                var isSelected = (side === 'from')
                    ? (drp.from && sameDay(day.date, drp.from))
                    : (drp.to && sameDay(day.date, drp.to));

                if (isSelected) return 'c__p-- bg__1D5558-- tc__FFFFFF--';

                if (day.isToday) return 'c__p-- today__ring--';

                return 'c__p-- hover__F9FAFB--bg';
            };

            scope.drpClear = function () {
                drp.from = null; drp.to = null; drp.hover = null;
                fromDateSetter(scope.$parent, null);
                toDateSetter(scope.$parent, null);
                render();
            };

            /* scope.drpApply = function () {
                 if (drp.from) fromDateSetter(scope, drp.from);
                 if (drp.to) toDateSetter(scope, drp.to);
                 element[0].click();
             };*/

            scope.drpClose = function () {
                if (scope.pickerId === 'postingDatePicker') {
                    scope.$parent.postingPopoverOpen = false;
                }

                if (scope.pickerId === 'depositDatePicker') {
                    scope.$parent.depositPopoverOpen = false;
                }

                // Generic close for any other screen: clear whatever popover-is-open expression the element declares.
                var popoverIsOpenSetter = attrs.popoverIsOpen ? $parse(attrs.popoverIsOpen).assign : null;
                if (popoverIsOpenSetter) {
                    popoverIsOpenSetter(scope, false);
                }
            };

            scope.$watch(function () {
                return fromDateGetter(scope.$parent);
            }, function (v) {
                drp.from = toPickerDate(v);
            });

            // Watch the bound to-date model (was scope.toDate, which never matched the attribute).
            scope.$watch(function () {
                return toDateGetter(scope.$parent);
            }, function (v) {
                drp.to = toPickerDate(v);
            });
            scope.$watch('drp.activeTab', function (v) {
                if (tabModelSetter && v) tabModelSetter(scope, v);
            });

            render();
        }
    };
}]);

 
eHnoteWebApp.factory('typeaheadTabletOverlayService', ['$q', '$parse', '$timeout',
    function ($q, $parse, $timeout) {

    function isTabletDevice($window) {
        var nav = $window.navigator || {};
        var ua = nav.userAgent || nav.vendor || '';
        var isIpad = /iPad/i.test(ua) || (nav.platform === 'MacIntel' && nav.maxTouchPoints > 1);
        var isAndroidTablet = /Android/i.test(ua) && !/Mobile/i.test(ua);
        return !!(isIpad || isAndroidTablet);
    }

    var TYPEAHEAD_OVERLAY_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([$\w][$\w\d]*))\s+in\s+(.*)$/;

    function parseExpression(expression) {
        var match = expression.match(TYPEAHEAD_OVERLAY_REGEXP);
        if (!match) {
            return null;
        }
        return {
            itemName: match[3],
            source: $parse(match[4]),
            viewMapper: $parse(match[2] || match[1]),
            modelMapper: $parse(match[1])
        };
    }

    var overlayCurrentlyOpen = false;

    function open(config) {
        if (overlayCurrentlyOpen) {
            return;
        }
        var parserResult = parseExpression(config.uibTypeaheadExpr);
        if (!parserResult) {
            return;
        }
        overlayCurrentlyOpen = true;

        var openedAt = new Date().getTime();
        var savedScrollY = window.scrollY;
        var savedBodyOverflow = document.body.style.overflow;
        var savedBodyPosition = document.body.style.position;
        var savedBodyTop = document.body.style.top;
        var savedBodyWidth = document.body.style.width;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = (-savedScrollY) + 'px';
        document.body.style.width = '100%';

        var backdrop = angular.element(
            '<div class="typeahead-overlay-backdrop">' +
                '<div class="typeahead-overlay-panel">' +
                    '<div class="typeahead-overlay-header">' +
                        '<input type="text" class="typeahead-overlay-input" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" />' +
                        '<button type="button" class="typeahead-overlay-close" aria-label="Close">&times;</button>' +
                    '</div>' +
                    '<div class="typeahead-overlay-body">'+
                        '<div class="adjustable-position">' +
                            '<ul class="typeahead-overlay-results"></ul>' +
                        '</div>'+
                    '</div>'+
                    '<div class="typeahead-overlay-empty d__n--">No matches found</div>' +
                '</div>' +
            '</div>'
        );
        angular.element(document.body).append(backdrop);

        var overlayInput = backdrop.find('input');
        var resultsList = backdrop.find('.typeahead-overlay-results');
        var emptyMsg = backdrop.find('.typeahead-overlay-empty');
        var closeBtn = backdrop.find('.typeahead-overlay-close');

        overlayInput.val(config.inputField.val() || '');
        overlayInput[0].focus();

        $timeout(function () {
            backdrop.addClass('typeahead-overlay-open');
        }, 0);

        var debounceId = null;
        var latestRequestId = 0;
        var closed = false;

        var hadInitialValue = (config.inputField.val() || '') !== '';

        function renderMatches(matches, term) {
            resultsList.empty();
            emptyMsg.addClass('d__n--');

            var hasMatches = !!(matches && matches.length);
            var trimmedTerm = (term || '').trim();
            var canAddNew = !!(config.addNewExpr && trimmedTerm && !hasMatches);

            if (hasMatches) {
                matches.forEach(function (match) {
                    var locals = {};
                    locals[parserResult.itemName] = match;
                    var label = parserResult.viewMapper(config.scope, locals);
                    var li = angular.element('<li class="typeahead-overlay-result"><a></a></li>');
                    li.find('a').text(label);
                    li.on('click', function () {
                        selectMatch(match, label);
                    });
                    resultsList.append(li);
                });
            } else if (canAddNew) {
                var addNewLi = angular.element(
                    '<li class="typeahead-overlay-result typeahead-overlay-add-new"><a>+ Add New</a></li>'
                );
                addNewLi.on('click', function () {
                    selectionMade = true;
                    config.scope.$apply(function () {
                        config.scope.$eval(config.addNewExpr, { $viewValue: trimmedTerm, $value: trimmedTerm });
                    });
                    close();
                });
                resultsList.append(addNewLi);
            } else {
                var noItemsLi = angular.element(
                    '<li class="typeahead-overlay-result typeahead-overlay-no-items"><span>No items found</span></li>'
                );
                resultsList.append(noItemsLi);
            }

            if (hadInitialValue) {
                var clearLi = angular.element('<li class="typeahead-overlay-result typeahead-overlay-clear bg__C71D271A-- tc__C71D27--"><a>✕ Clear selection</a></li>');
                clearLi.on('click', function () {
                    selectionMade = true;
                    config.scope.$apply(function () {
                        $parse(config.ngModelExpr).assign(config.scope, null);
                        if (config.onSelectExpr) {
                            config.scope.$eval(config.onSelectExpr, { $item: null, $model: null, $label: '' });
                        }
                    });
                    close();
                });
                resultsList.append(clearLi);
            }
        }

        function runSearch(term) {
            var requestId = ++latestRequestId;
            var locals = { $viewValue: term };
            $q.when(parserResult.source(config.scope, locals)).then(function (matches) {
                if (closed || requestId !== latestRequestId) {
                    return;
                }
                renderMatches(matches, term); // was: renderMatches(matches)
            });
        }

        overlayInput.on('input', function () {
            var term = overlayInput.val();
            if (debounceId) {
                $timeout.cancel(debounceId);
            }
            if (term.length < config.minLength) {
                resultsList.empty();
                emptyMsg.addClass('d__n--');
                return;
            }
            debounceId = $timeout(function () {
                runSearch(term);
            }, 100);
        });

        if ((config.inputField.val() || '').length >= config.minLength) {
            runSearch(config.inputField.val());
        }

        var closed = false;
        var selectionMade = false;   // NEW

        function selectMatch(match, label) {
            var model = parserResult.modelMapper(config.scope, (function () {
                var locals = {};
                locals[parserResult.itemName] = match;
                return locals;
            })());
            selectionMade = true;   // NEW — mark before close() runs
            config.scope.$apply(function () {
                $parse(config.ngModelExpr).assign(config.scope, model);
                if (config.onSelectExpr) {
                    config.scope.$eval(config.onSelectExpr, { $item: match, $model: model, $label: label });
                }
            });
            close();
        }

        function close() {
            closed = true;
            overlayCurrentlyOpen = false;
            if (debounceId) {
                $timeout.cancel(debounceId);
            }

            var currentVal = overlayInput.val();
            var hadOriginalValue = (config.inputField.val() || '') !== '';
            // NEW: only auto-deselect if the user actually cleared text and closed —
            // never when a genuine selection was just made.
            if (!selectionMade && currentVal === '' && hadOriginalValue) {
                config.scope.$apply(function () {
                    $parse(config.ngModelExpr).assign(config.scope, null);
                    config.inputField.val('');
                    if (config.onSelectExpr) {
                        config.scope.$eval(config.onSelectExpr, { $item: null, $model: null, $label: '' });
                    }
                });
            }

            backdrop.removeClass('typeahead-overlay-open');
            overlayInput.off('input');
            closeBtn.off('click');
            backdrop.off('click');
            document.body.style.overflow = savedBodyOverflow;
            document.body.style.position = savedBodyPosition;
            document.body.style.top = savedBodyTop;
            document.body.style.width = savedBodyWidth;
            window.scrollTo(0, savedScrollY);
            $timeout(function () {
                backdrop.remove();
            }, 200);
        }

        closeBtn.on('click', function () {
            close();
        });
        /*Tap on the dimmed backdrop itself (not the panel/results inside it) closes without
          changing the selected value - event.target === backdrop[0] only when the tap landed
          directly on the backdrop, not on any child. The 350ms grace period guards against a
          "ghost click": the SAME physical tap that opened the overlay (on the real input) can
          produce a trailing click event shortly after, which lands on the backdrop (now
          covering the entire screen at that exact spot) and would otherwise immediately close
          the overlay it just opened - this is what caused "opens and closes, works after a
          few tries".*/
        backdrop.on('click', function (event) {
            if (event.target === backdrop[0] && (new Date().getTime() - openedAt) > 350) {
                close();
            }
        });
    }

    return {
        isTabletDevice: isTabletDevice,
        open: open
    };
}]);

eHnoteWebApp.directive('bulletTextarea', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {

            var prefix = '•\u2003'; // Bullet + EM Space

            function setCursor(pos) {
                $timeout(function () {
                    element[0].selectionStart = pos;
                    element[0].selectionEnd = pos;
                });
            }

            element.on('keydown', function (e) {

                var textarea = element[0];
                var value = textarea.value;

                // Ignore Ctrl/Cmd shortcuts
                if (e.ctrlKey || e.metaKey || e.altKey) {
                    return;
                }

                // Add first bullet only when user starts typing
                if (!value && e.key.length === 1) {
                    e.preventDefault();

                    var newValue = prefix + e.key;

                    textarea.value = newValue;
                    ngModel.$setViewValue(newValue);
                    ngModel.$render();

                    setCursor(newValue.length);
                    return;
                }

                // Enter key - Add next bullet
                if (e.key === 'Enter') {

                    var start = textarea.selectionStart;
                    var end = textarea.selectionEnd;

                    var lines = value.substring(0, start).split('\n');
                    var currentLine = lines[lines.length - 1];

                    // Remove bullet from current line
                    var text = currentLine.replace(prefix, '').trim();

                    // Don't create another bullet if current one is empty
                    if (!text) {
                        e.preventDefault();
                        return;
                    }

                    e.preventDefault();

                    var insert = '\n' + prefix;

                    var newValue =
                        value.substring(0, start) +
                        insert +
                        value.substring(end);

                    textarea.value = newValue;
                    ngModel.$setViewValue(newValue);
                    ngModel.$render();

                    setCursor(start + insert.length);
                    return;
                }

                // Backspace
                if (e.key === 'Backspace') {

                    var cursor = textarea.selectionStart;

                    // Remove last empty bullet
                    if (value === prefix) {
                        e.preventDefault();

                        textarea.value = '';
                        ngModel.$setViewValue('');
                        ngModel.$render();

                        setCursor(0);
                        return;
                    }

                    var beforeCursor = value.substring(0, cursor);

                    if (beforeCursor.endsWith('\n' + prefix)) {

                        e.preventDefault();

                        var removeLength = ('\n' + prefix).length;

                        var newValue =
                            value.substring(0, cursor - removeLength) +
                            value.substring(cursor);

                        textarea.value = newValue;
                        ngModel.$setViewValue(newValue);
                        ngModel.$render();

                        setCursor(cursor - removeLength);
                    }
                }
            });

            scope.$on('$destroy', function () {
                element.off('keydown');
            });
        }
    };
}]);

/*Multiple textareas in single div requirement from durga and added by mahendra on 11/09/2026*/
eHnoteWebApp.directive('bulletPointList', ['$timeout', '$document', function ($timeout, $document) {

    var prefix = '•\u2003';
    var lastPointId = 0;

    return {
        restrict: 'A',
        require: '?ngModel',
        scope: {
            placeholder: '@pointPlaceholder',
            pointArray: '=?'            // Optional array of point objects - one object per bullet point
        },
        template:
            '<div class="bullet__point--list" ng-mousedown="focusFromList($event)">' +
            '<div class="bullet__point--row" ng-repeat="point in points track by point.id" ng-class="{\'has__text\': isFilled(point)}">' +
            '<span class="bullet__point--bullet lh__25--" aria-hidden="true">' + prefix + '</span>' +
            '<textarea class="bullet__point--input border__none-- w__100p-- outline__none-- lh__25--" rows="1" msd-elastic data-point-id="{{point.id}}" ng-model="point.item[textKey]" ng-trim="false"' +
            ' ng-attr-placeholder="{{$first && !hasText ? placeholder : \'\'}}" ng-change="onChange(point)" ng-keydown="onKeydown($event, point)"' +
            ' ng-blur="onBlur($event, point)"></textarea>' +
            '<a class="bullet__point--remove w__16-- h__16-- d__f-- ai__c-- jc__c-- c__p-- flex__shrink--0 tc__111827-- hover__EF444--tc"' +
            ' ng-mousedown="onRemoveMousedown($event)" ng-click="removePoint(point)" uib-tooltip="Remove" tooltip-append-to-body="true">' +
            '<i svg-icon="icon__crosscircle--" size="16"></i>' +
            '</a>' +
            '</div>' +
            '</div>',
        link: function (scope, element, attrs, ngModel) {

            var renderedValue;          // Model string the points were last rendered from or written as
            var pointerDown = false;    // A mouse / touch press is in progress
            var collapsePending = false;
            var pressedAwayFrom = null; // Blank point a press outside it is leaving

            // With point-array every point is an object of that array: its text is item[point-text-key],
            // its record id item[point-id-key] (0 = not saved yet) and DeleteInd 'Y' hides a saved point.
            // Without it the points are the directive's own { text } objects.
            var idKey = attrs.pointIdKey;
            scope.textKey = attrs.pointTextKey || 'text';
            var pointType = attrs.pointType;    // Type carried by every object of the section's array

            // Saved data without the array yet: start one (bound back to the model) and fill it from the notes
            if (attrs.pointArray && !angular.isArray(scope.pointArray)) {
                scope.pointArray = [];
            }

            scope.points = [];          // Visible points: { id: element id, item: point object }
            scope.hasText = false;
            scope.activePoint = null;   // The point holding the caret - null when the caret is outside this list

            function arrayMode() {
                return angular.isArray(scope.pointArray);
            }

            function textOf(point) {
                return point.item[scope.textKey] || '';
            }

            function setText(point, text) {
                point.item[scope.textKey] = text;
            }

            function isBlank(point) {
                return !textOf(point).trim();
            }

            // A point already saved in the backend - removing it only marks it DeleteInd 'Y'
            function isSaved(point) {
                return arrayMode() && Number(point.item[idKey]) > 0;
            }

            function makePoint(item) {
                return { id: ++lastPointId, item: item };
            }

            // Type of this section: the point-type attribute, else the one the array was created with
            function typeOf() {
                var type = pointType;
                angular.forEach(scope.pointArray, function (item) {
                    if (!type && item && item.Type) {
                        type = item.Type;
                    }
                });
                return type;
            }

            // Every object of the array carries the section's Type, not only the one it started with,
            // and DeleteInd stays the 'N' / 'Y' the backend expects - data loaded with a boolean
            // (false = still there, true = deleted) would otherwise be sent back as it came in.
            function normalizeItems() {
                var type = typeOf();
                angular.forEach(scope.pointArray, function (item) {
                    if (!item) {
                        return;
                    }
                    if (type && !item.Type) {
                        item.Type = type;
                    }
                    if (item.DeleteInd !== 'N' && item.DeleteInd !== 'Y') {
                        item.DeleteInd = (item.DeleteInd === true || item.DeleteInd === 'true' || item.DeleteInd === 'y') ? 'Y' : 'N';
                    }
                });
            }

            function newItem(text) {
                var item = {};
                if (arrayMode()) {
                    item[idKey] = 0;
                    item[scope.textKey] = text || '';
                    item.DeleteInd = 'N';
                    var type = typeOf();
                    if (type) {
                        item.Type = type;
                    }
                } else {
                    item.text = text || '';
                }
                return item;
            }

            // New point after `after` (at the end when null) - added to the section's array as well
            function insertPoint(text, after) {
                var point = makePoint(newItem(text));
                scope.points.splice(after ? scope.points.indexOf(after) + 1 : scope.points.length, 0, point);
                if (arrayMode()) {
                    scope.pointArray.splice(after ? scope.pointArray.indexOf(after.item) + 1 : scope.pointArray.length, 0, point.item);
                }
                return point;
            }

            // Point leaves the list - an unsaved object leaves the array, a saved one stays with DeleteInd 'Y'
            function dropPoint(point) {
                scope.points.splice(scope.points.indexOf(point), 1);
                if (isSaved(point)) {
                    point.item.DeleteInd = 'Y';
                } else if (arrayMode() && scope.pointArray.indexOf(point.item) > -1) {
                    scope.pointArray.splice(scope.pointArray.indexOf(point.item), 1);
                }
            }

            // '•\u2003One\n•\u2003Two' -> ['One', 'Two'] (lines without a bullet are kept as points)
            function parse(value) {
                var lines = [];
                angular.forEach(value ? String(value).split(/\r?\n/) : [], function (line) {
                    // A leading bullet is the list's own marker, whatever spacing follows it (notes
                    // written elsewhere - a saved template, the old design - use their own spacing)
                    var text = String(line).replace(/^\s*[•·●▪◦]\s*/, '');
                    if (text.trim()) {
                        lines.push(text);
                    }
                });
                return lines;
            }

            // Visible points -> '•\u2003One\n•\u2003Two' (blank / whitespace-only points are not written)
            function serialize() {
                var lines = [];
                angular.forEach(scope.points, function (point) {
                    if (!isBlank(point)) {
                        lines.push(prefix + textOf(point));
                    }
                });
                return lines.join('\n');
            }

            // An empty list is still one input
            function ensureOnePoint() {
                if (!scope.points.length) {
                    insertPoint('', null);
                }
            }

            function updateHasText() {
                scope.hasText = scope.points.some(function (point) { return textOf(point) !== ''; });
            }

            // Write to ng-model only when the notes really changed - focusing and leaving writes nothing
            function commit() {
                updateHasText();
                var value = serialize();
                if (value !== renderedValue) {
                    renderedValue = value;
                    if (ngModel) {
                        ngModel.$setViewValue(value);
                    }
                }
            }

            // Visible points from the section's array: its objects not marked DeleteInd 'Y', keeping each row's element
            function pointsFromArray() {
                normalizeItems();
                var previous = scope.points;
                scope.points = [];
                angular.forEach(scope.pointArray, function (item) {
                    if (item.DeleteInd === 'Y') {
                        return;
                    }
                    var point = null;
                    for (var i = 0; i < previous.length && !point; i++) {
                        point = previous[i].item === item ? previous[i] : null;
                    }
                    scope.points.push(point || makePoint(item));
                });
                if (scope.activePoint && scope.points.indexOf(scope.activePoint) < 0) {
                    scope.activePoint = null;
                }
            }

            // Notes string set from outside (saved data, template) -> the section's array: a visible object
            // whose text is still a line is kept (with its id), the others are dropped, new lines get new objects
            function arrayFromText(value) {
                var lines = parse(value);
                var remaining = scope.points.slice();
                var points = [];
                angular.forEach(lines, function (line) {
                    var match = null;
                    for (var i = 0; i < remaining.length && !match; i++) {
                        match = textOf(remaining[i]) === line ? remaining.splice(i, 1)[0] : null;
                    }
                    points.push(match || makePoint(newItem(line)));
                });
                angular.forEach(remaining, dropPoint);
                var hidden = scope.pointArray.filter(function (item) { return item.DeleteInd === 'Y'; });
                scope.pointArray.length = 0;
                angular.forEach(hidden.concat(points.map(function (point) { return point.item; })), function (item) {
                    scope.pointArray.push(item);
                });
                scope.points = points;
            }

            function getTextarea(point) {
                return point ? element[0].querySelector('textarea[data-point-id="' + point.id + '"]') : null;
            }

            // Last point with text - the first point when the list has none
            function lastPointWithText() {
                for (var i = scope.points.length - 1; i > 0; i--) {
                    if (!isBlank(scope.points[i])) {
                        return scope.points[i];
                    }
                }
                return scope.points[0];
            }

            // Point of a textarea in this list, null for anything else (including other lists)
            function pointOf(node) {
                var id = node && node.getAttribute ? Number(node.getAttribute('data-point-id')) : 0;
                for (var i = 0; id && i < scope.points.length; i++) {
                    if (scope.points[i].id === id) {
                        return scope.points[i];
                    }
                }
                return null;
            }

            function placeCaret(textarea, caret) {
                var position = caret === undefined ? textarea.value.length : caret;
                textarea.focus();
                textarea.setSelectionRange(position, position);
            }

            // After a key action in this list: focus the point once it is rendered. Never takes the
            // caret back from an element outside this list (the user may have clicked away meanwhile).
            function focusPoint(point, caret) {
                $timeout(function () {
                    var textarea = getTextarea(point);
                    var active = $document[0].activeElement;
                    if (!textarea || (active && active !== $document[0].body && !element[0].contains(active))) {
                        return;
                    }
                    placeCaret(textarea, caret);
                });
            }

            // Caret left a point: blank points are removed - except the one now holding the caret - and the points below move up
            function collapseBlankPoints() {
                collapsePending = false;
                var blank = scope.points.filter(function (point) {
                    return isBlank(point) && point !== scope.activePoint;
                });
                // An empty list keeps one input - an unsaved blank point stays as that input
                if (blank.length === scope.points.length) {
                    var input = blank.filter(function (point) { return !isSaved(point); })[0];
                    if (input) {
                        blank.splice(blank.indexOf(input), 1);
                        setText(input, '');
                    }
                }
                angular.forEach(blank, dropPoint);
                ensureOnePoint();
                commit();
            }

            // Mid-click the rows must not move under the pointer, so wait for the release
            function onPointerDown(e) {
                pointerDown = true;

                // A press anywhere but the blank point being typed in leaves it - also when that press
                // moves no focus (scrollbar, a remove icon, an element cancelling mousedown)
                var textarea = scope.activePoint && isBlank(scope.activePoint) ? getTextarea(scope.activePoint) : null;
                if (textarea && !textarea.parentNode.contains(e.target)) {
                    pressedAwayFrom = scope.activePoint;
                    collapsePending = true;
                }
            }

            function onPointerUp() {
                pointerDown = false;
                if (pressedAwayFrom && scope.activePoint === pressedAwayFrom) {
                    scope.activePoint = null;
                }
                pressedAwayFrom = null;
                if (collapsePending) {
                    $timeout(collapseBlankPoints);
                }
            }

            // Pasted / dropped text with line breaks -> one point per line
            function splitLines(point) {
                var textarea = getTextarea(point);
                var afterCaret = textarea ? textOf(point).length - textarea.selectionEnd : 0;
                var lines = textOf(point).split(/\r?\n/);
                var target = point;

                setText(point, lines[0]);
                for (var i = 1; i < lines.length; i++) {
                    if (lines[i].trim() || i === lines.length - 1) {
                        target = insertPoint(lines[i], target);
                    }
                }
                scope.activePoint = target;
                focusPoint(target, Math.max(textOf(target).length - afterCaret, 0));
            }

            // Notes string set from outside (only with ng-model)
            function render() {
                if (arrayMode()) {
                    pointsFromArray();
                    // Already showing these notes (the array was loaded, or this is our own write)
                    if (parse(ngModel.$viewValue).join('\n') !== parse(serialize()).join('\n')) {
                        arrayFromText(ngModel.$viewValue);
                    }
                } else {
                    scope.points = parse(ngModel.$viewValue).map(function (text) { return makePoint(newItem(text)); });
                }
                ensureOnePoint();
                scope.activePoint = null;
                renderedValue = serialize();
                updateHasText();
            }

            if (ngModel) {
                ngModel.$render = render;
            }

            // The section's array loaded or replaced from outside - the notes string follows it
            // (not before ng-model's first render, so opening the popup writes nothing)
            scope.$watchCollection('pointArray', function () {
                if (arrayMode()) {
                    pointsFromArray();
                    ensureOnePoint();
                    if (renderedValue === undefined && ngModel) {
                        updateHasText();
                    } else {
                        commit();
                    }
                }
            });

            scope.isFilled = function (point) {
                return !isBlank(point);
            };

            scope.onChange = function (point) {
                if (/\r?\n/.test(textOf(point))) {
                    splitLines(point);
                }
                commit();
            };

            // Caret entering a point. Not ng-focus: this app has its own "ngFocus" directive that evaluates
            // the attribute on every digest (to auto-focus), which would mark every point active in turn.
            function onFocusIn(e) {
                var point = pointOf(e.target);
                if (point) {
                    scope.$evalAsync(function () {
                        scope.activePoint = point;
                    });
                }
            }

            scope.onBlur = function (e, point) {

                // The point receiving the caret (when it is in this list) is the only blank point kept
                var next = pointOf((e.originalEvent || e).relatedTarget);
                if (next || scope.activePoint === point) {
                    scope.activePoint = next;
                }

                if (pointerDown) {
                    collapsePending = true;
                } else {
                    collapseBlankPoints();
                }
            };

            scope.onKeydown = function (e, point) {

                var event = e.originalEvent || e;
                var textarea = e.target;
                var index = scope.points.indexOf(point);
                var start = textarea.selectionStart;
                var end = textarea.selectionEnd;

                // Ignore Ctrl/Cmd shortcuts and IME composition
                if (e.ctrlKey || e.metaKey || e.altKey || event.isComposing) {
                    return;
                }

                // Enter key - Split into the next point
                if (event.key === 'Enter') {

                    e.preventDefault();

                    var before = textOf(point).substring(0, start);
                    var after = textOf(point).substring(end);

                    // Don't create another point if the current one is empty before the caret
                    if (!before.trim()) {
                        return;
                    }

                    setText(point, before);

                    // Reuse a blank point right below instead of stacking empty points
                    var next = scope.points[index + 1];
                    if (after || !next || !isBlank(next)) {
                        next = insertPoint(after, point);
                    }
                    scope.activePoint = next;

                    commit();
                    focusPoint(next, 0);
                    return;
                }

                // Backspace at the start of a point - Join it into the point above
                if (event.key === 'Backspace' && start === 0 && end === 0 && index > 0) {

                    e.preventDefault();

                    var previous = scope.points[index - 1];
                    var caret = textOf(previous).length;

                    setText(previous, textOf(previous) + textOf(point));
                    dropPoint(point);
                    scope.activePoint = previous;

                    commit();
                    focusPoint(previous, caret);
                    return;
                }

                // Arrow keys at the edge of a point - Move into the neighbouring point
                if (e.shiftKey) {
                    return;
                }
                if ((event.key === 'ArrowUp' || event.key === 'ArrowLeft') && start === 0 && end === 0 && index > 0) {
                    e.preventDefault();
                    focusPoint(scope.points[index - 1]);
                }
                else if ((event.key === 'ArrowDown' || event.key === 'ArrowRight') && start === textOf(point).length && end === start && index < scope.points.length - 1) {
                    e.preventDefault();
                    focusPoint(scope.points[index + 1], 0);
                }
            };

            // While the caret is in this list, removing a point keeps it here. With the caret in
            // another list the click behaves normally and that list simply loses the caret.
            scope.onRemoveMousedown = function (e) {
                if (scope.activePoint) {
                    e.preventDefault();
                }
            };

            // Remove (x): an unsaved point leaves the array, a saved one is kept with DeleteInd 'Y' and hidden
            scope.removePoint = function (point) {

                var index = scope.points.indexOf(point);
                if (index < 0) {
                    return;
                }

                var wasActive = scope.activePoint === point;

                dropPoint(point);
                ensureOnePoint();

                // Continue in the point that moved up, else the one above
                if (wasActive) {
                    scope.activePoint = scope.points[index] || scope.points[index - 1];
                    focusPoint(scope.activePoint);
                }

                commit();
            };

            // Mouse down on this list outside a textarea / remove icon - bullet, row gap or the free space
            // below the points - puts the caret in that row, or at the end of the last point with text
            // (so an empty point left below it is removed like any other point the caret leaves)
            scope.focusFromList = function (e) {

                var list = e.currentTarget;
                var node = e.target;

                while (node && node !== list && !node.classList.contains('bullet__point--row')) {
                    if (node.nodeName === 'TEXTAREA' || node.classList.contains('bullet__point--remove')) {
                        return;
                    }
                    node = node.parentNode;
                }

                e.preventDefault();

                var textarea = node && node !== list ? node.querySelector('textarea') : getTextarea(lastPointWithText());
                if (textarea) {
                    placeCaret(textarea);
                }
            };

            element[0].addEventListener('focusin', onFocusIn);
            $document[0].addEventListener('mousedown', onPointerDown, true);
            $document[0].addEventListener('touchstart', onPointerDown, true);
            $document[0].addEventListener('mouseup', onPointerUp, true);
            $document[0].addEventListener('touchend', onPointerUp, true);
            $document[0].addEventListener('touchcancel', onPointerUp, true);

            scope.$on('$destroy', function () {
                element[0].removeEventListener('focusin', onFocusIn);
                $document[0].removeEventListener('mousedown', onPointerDown, true);
                $document[0].removeEventListener('touchstart', onPointerDown, true);
                $document[0].removeEventListener('mouseup', onPointerUp, true);
                $document[0].removeEventListener('touchend', onPointerUp, true);
                $document[0].removeEventListener('touchcancel', onPointerUp, true);
            });
        }
    };
}]);

eHnoteWebApp.directive("datepickerFgrxManualAndCalSelection", ["alertify", function (alertify) {
    return {
        restrict: "A",
        require: "ngModel",

        scope: {
            appointmentdate: "="
        },

        link: function (scope, elem, attrs, ngModelCtrl) {

            function parseDate(value) {

                if (!value) {
                    return null;
                }

                if (
                    Object.prototype.toString.call(value) ===
                    "[object Date]"
                ) {

                    if (isNaN(value.getTime())) {
                        return null;
                    }

                    var dateObject =
                        new Date(value.getTime());

                    dateObject.setHours(
                        0,
                        0,
                        0,
                        0
                    );

                    return dateObject;
                }


                var valueString =
                    String(value).trim();


                var dateObject = null;


                /*
                 * YYYY-MM-DD
                 */
                if (
                    /^\d{4}-\d{2}-\d{2}$/
                        .test(valueString)
                ) {

                    var ymd =
                        valueString.split("-");

                    dateObject = new Date(
                        parseInt(ymd[0], 10),
                        parseInt(ymd[1], 10) - 1,
                        parseInt(ymd[2], 10)
                    );
                }


                /*
                 * MM-DD-YYYY
                 */
                else if (
                    /^\d{2}-\d{2}-\d{4}$/
                        .test(valueString)
                ) {

                    var mdy =
                        valueString.split("-");

                    dateObject = new Date(
                        parseInt(mdy[2], 10),
                        parseInt(mdy[0], 10) - 1,
                        parseInt(mdy[1], 10)
                    );
                }


                /*
                 * MM/DD/YYYY
                 */
                else if (
                    /^\d{2}\/\d{2}\/\d{4}$/
                        .test(valueString)
                ) {

                    var slashDate =
                        valueString.split("/");

                    dateObject = new Date(
                        parseInt(slashDate[2], 10),
                        parseInt(slashDate[0], 10) - 1,
                        parseInt(slashDate[1], 10)
                    );
                }


                /*
                 * Fallback
                 */
                else {

                    dateObject =
                        new Date(valueString);
                }


                if (
                    !dateObject ||
                    isNaN(dateObject.getTime())
                ) {
                    return null;
                }


                dateObject.setHours(
                    0,
                    0,
                    0,
                    0
                );


                return dateObject;
            }

            function getAppointmentDate() {

                var appointmentDate =
                    parseDate(
                        scope.appointmentdate
                    );

                return appointmentDate;
            }

            function getMinAndMaxDates() {

                var today = new Date();
                today.setHours(0, 0, 0, 0);


                var appointment =
                    getAppointmentDate();

                if (!appointment) {

                    appointment =
                        new Date(
                            today.getTime()
                        );
                }


                var minDate =
                    appointment < today
                        ? appointment
                        : today;


                var maxDate =
                    appointment > today
                        ? appointment
                        : today;


                return {

                    minDate: minDate,

                    maxDate: maxDate,

                    appointmentDate: appointment
                };
            }



            var dateRange =
                getMinAndMaxDates();


            elem.datepicker({

                dateFormat: "mm-dd-yy",

                changeYear: true,

                changeMonth: true,

                minDate: dateRange.minDate,

                maxDate: dateRange.maxDate,

                
                defaultDate:
                    dateRange.appointmentDate,

                yearRange: "-25:+25",

                showOn: "none",

                onSelect: function (dateText) {

                    scope.$applyAsync(function () {

                        ngModelCtrl.$setViewValue(
                            dateText
                        );

                        ngModelCtrl.$render();
                    });
                },

                onClose: function () {

                    elem.prop(
                        "readonly",
                        false
                    );
                }
            });

            scope.$watch(
                "appointmentdate",
                function () {

                    var updatedRange =
                        getMinAndMaxDates();

                    elem.datepicker(
                        "option",
                        "minDate",
                        updatedRange.minDate
                    );

                    elem.datepicker(
                        "option",
                        "maxDate",
                        updatedRange.maxDate
                    );
                    elem.datepicker(
                        "option",
                        "defaultDate",
                        updatedRange.appointmentDate
                    );
                }
            );

            var calendarIcon =
                elem.parent().find(
                    ".calender__w16--o"
                );


            calendarIcon.on(
                "mousedown touchstart",
                function (e) {

                    e.preventDefault();
                }
            );


            calendarIcon.on(
                "click",
                function (e) {

                    e.preventDefault();

                    e.stopPropagation();


                    var currentValue =
                        ngModelCtrl.$viewValue;


                    if (currentValue) {

                        var selectedDate =
                            parseDate(
                                currentValue
                            );


                        if (selectedDate) {

                            elem.datepicker(
                                "setDate",
                                selectedDate
                            );
                        }
                    }

                    else {

                        var range =
                            getMinAndMaxDates();


                        if (
                            range.appointmentDate
                        ) {

                            elem.datepicker(
                                "option",
                                "defaultDate",
                                range.appointmentDate
                            );
                        }
                    }

                    elem.prop(
                        "readonly",
                        true
                    );

                    elem.datepicker("show");
                }
            );


            function isLeapYear(year) {

                return (
                    (
                        year % 4 === 0 &&
                        year % 100 !== 0
                    ) ||
                    year % 400 === 0
                );
            }

            function getMaxDays(month, year) {

                if (month === 2) {

                    if (!year) {
                        return 29;
                    }

                    return isLeapYear(year)
                        ? 29
                        : 28;
                }

                return [4, 6, 9, 11]
                    .includes(month)
                    ? 30
                    : 31;
            }

            function isValidMonth(month) {

                return (
                    month.length === 2 &&
                    +month >= 1 &&
                    +month <= 12
                );
            }


            function getEnteredDate(value) {

                if (!value) {
                    return null;
                }


                var parts =
                    value.split("-");

                if (parts.length !== 3) {
                    return null;
                }

                var month =
                    parseInt(parts[0], 10);

                var day =
                    parseInt(parts[1], 10);

                var year =
                    parseInt(parts[2], 10);

                if (
                    !month ||
                    !day ||
                    !year
                ) {
                    return null;
                }

                var date =
                    new Date(
                        year,
                        month - 1,
                        day
                    );

                if (
                    date.getFullYear() !== year ||
                    date.getMonth() !==
                    month - 1 ||
                    date.getDate() !== day
                ) {
                    return null;
                }

                date.setHours(0, 0, 0, 0);

                return date;
            }


            function isDateWithinRange(date) {

                var range =
                    getMinAndMaxDates();

                return (
                    date >= range.minDate &&
                    date <= range.maxDate
                );
            }

            

            function formatDate(date) {

                if (!date) {
                    return "";
                }


                var month =
                    String(
                        date.getMonth() + 1
                    ).padStart(
                        2,
                        "0"
                    );


                var day =
                    String(
                        date.getDate()
                    ).padStart(
                        2,
                        "0"
                    );


                var year =
                    date.getFullYear();


                return (
                    month +
                    "-" +
                    day +
                    "-" +
                    year
                );
            }


            
            elem.on(
                "keydown",
                function (e) {

                    var key = e.key;

                    var value =
                        elem.val() || "";

                    var caretPos =
                        elem[0]
                            .selectionStart || 0;


                    var digits =
                        value.replace(
                            /\D/g,
                            ""
                        );


                    var digitsBeforeCaret =
                        value
                            .slice(
                                0,
                                caretPos
                            )
                            .replace(
                                /\D/g,
                                ""
                            )
                            .length;


                    /* -----------------------------------------------
                       NAVIGATION
                    ----------------------------------------------- */

                    if (
                        [
                            "ArrowLeft",
                            "ArrowRight",
                            "Tab"
                        ].includes(key)
                    ) {

                        return;
                    }


                    /* -----------------------------------------------
                       DELETE
                    ----------------------------------------------- */

                    if (
                        key === "Backspace" ||
                        key === "Delete"
                    ) {

                        return;
                    }


                    /* -----------------------------------------------
                       ONLY NUMBER / DASH
                    ----------------------------------------------- */

                    if (
                        !/^\d$/.test(key) &&
                        key !== "-"
                    ) {

                        e.preventDefault();

                        return;
                    }


                    /* -----------------------------------------------
                       MONTH AUTO ZERO
                       8 -> 08
                    ----------------------------------------------- */

                    if (
                        digitsBeforeCaret === 0 &&
                        key >= "2" &&
                        key <= "9"
                    ) {

                        e.preventDefault();


                        var newValue =
                            value.slice(
                                0,
                                caretPos
                            ) +
                            "0" +
                            key +
                            value.slice(
                                caretPos
                            );


                        elem.val(
                            newValue
                        );


                        elem.triggerHandler(
                            "input"
                        );


                        return;
                    }


                    /* -----------------------------------------------
                       MONTH SECOND DIGIT
                    ----------------------------------------------- */

                    if (
                        digitsBeforeCaret === 1
                    ) {

                        if (
                            digits[0] === "1" &&
                            +key > 2
                        ) {

                            e.preventDefault();


                            alertify.error(
                                "Invalid month. Month must be between 1 and 12"
                            );


                            return;
                        }


                        if (
                            digits[0] === "2"
                        ) {

                            e.preventDefault();


                            alertify.error(
                                "Invalid month. Month must be between 1 and 12"
                            );


                            return;
                        }
                    }


                    /* -----------------------------------------------
                       DASH
                    ----------------------------------------------- */

                    if (key === "-") {

                        if (
                            caretPos === 2 ||
                            caretPos === 5
                        ) {

                            return;
                        }


                        e.preventDefault();

                        return;
                    }


                    /* -----------------------------------------------
                       DAY FIRST DIGIT
                    ----------------------------------------------- */

                    if (
                        digitsBeforeCaret === 2
                    ) {

                        var month =
                            digits.slice(
                                0,
                                2
                            );


                        if (
                            !isValidMonth(
                                month
                            )
                        ) {

                            return;
                        }


                        /*
                         * 11 + 4
                         * => 11-04
                         */
                        if (
                            key >= "4" &&
                            key <= "9"
                        ) {

                            e.preventDefault();


                            elem.val(
                                value.slice(
                                    0,
                                    caretPos
                                ) +
                                "0" +
                                key +
                                value.slice(
                                    caretPos
                                )
                            );


                            elem.triggerHandler(
                                "input"
                            );


                            return;
                        }
                    }


                    /* -----------------------------------------------
                       DAY SECOND DIGIT
                    ----------------------------------------------- */

                    if (
                        digitsBeforeCaret === 3
                    ) {

                        var monthNumber =
                            parseInt(
                                digits.slice(
                                    0,
                                    2
                                ),
                                10
                            );


                        var firstDayDigit =
                            digits[2];


                        var dayCandidate =
                            parseInt(
                                firstDayDigit +
                                key,
                                10
                            );


                        var yearNumber =
                            digits.length >= 7
                                ? parseInt(
                                    digits.slice(
                                        4,
                                        8
                                    ),
                                    10
                                )
                                : null;


                        var maxDays =
                            getMaxDays(
                                monthNumber,
                                yearNumber
                            );


                        if (
                            dayCandidate >
                            maxDays
                        ) {

                            e.preventDefault();


                            alertify.error(
                                "Invalid day. This month has only " +
                                maxDays +
                                " days."
                            );


                            return;
                        }
                    }


                    /* -----------------------------------------------
                       FEB 29
                    ----------------------------------------------- */

                    if (
                        digitsBeforeCaret >= 4
                    ) {

                        var monthText =
                            digits.slice(
                                0,
                                2
                            );


                        var dayText =
                            digits.slice(
                                2,
                                4
                            );


                        var partialYear =
                            digits.slice(
                                4,
                                digitsBeforeCaret
                            ) + key;


                        if (
                            monthText === "02" &&
                            dayText === "29" &&
                            partialYear.length === 4
                        ) {

                            var yearValue =
                                parseInt(
                                    partialYear,
                                    10
                                );


                            if (
                                !isLeapYear(
                                    yearValue
                                )
                            ) {

                                e.preventDefault();


                                alertify.error(
                                    "The entered year is not a leap year."
                                );


                                return;
                            }
                        }
                    }
                }
            );


            elem.on(
                "input",
                function () {

                    var raw =
                        elem.val() || "";


                    /*
                     * Remove anything other than
                     * numbers.
                     */
                    var digits =
                        raw.replace(
                            /\D/g,
                            ""
                        );


                    /*
                     * Maximum:
                     * MMDDYYYY = 8 digits
                     */
                    digits =
                        digits.substring(
                            0,
                            8
                        );


                    if (!digits) {

                        ngModelCtrl
                            .$setViewValue("");

                        return;
                    }


                    /* -----------------------------------------------
                       MONTH
                    ----------------------------------------------- */

                    var month =
                        digits.substring(
                            0,
                            2
                        );


                    /*
                     * 8 -> 08
                     */
                    if (
                        digits.length === 1 &&
                        +digits[0] >= 2
                    ) {

                        digits =
                            "0" + digits;

                        month = digits;
                    }


                    if (
                        month.length === 2 &&
                        !isValidMonth(
                            month
                        )
                    ) {

                        elem.val("");

                        ngModelCtrl
                            .$setViewValue("");

                        alertify.error(
                            "Invalid month. Month must be between 1 and 12"
                        );

                        return;
                    }


                    /* -----------------------------------------------
                       DAY
                    ----------------------------------------------- */

                    if (
                        digits.length >= 3
                    ) {

                        var monthNumber =
                            parseInt(
                                digits.substring(
                                    0,
                                    2
                                ),
                                10
                            );


                        var dayFirstDigit =
                            digits.substring(
                                2,
                                3
                            );


                        /*
                         * 11 + 4
                         * => 11-04
                         */
                        if (
                            +dayFirstDigit >= 4 &&
                            +dayFirstDigit <= 9
                        ) {

                            digits =
                                digits.substring(
                                    0,
                                    2
                                ) +
                                "0" +
                                digits.substring(
                                    2
                                );
                        }
                    }


                    if (
                        digits.length >= 4
                    ) {

                        var monthNumber =
                            parseInt(
                                digits.substring(
                                    0,
                                    2
                                ),
                                10
                            );


                        var dayNumber =
                            parseInt(
                                digits.substring(
                                    2,
                                    4
                                ),
                                10
                            );


                        var yearNumber =
                            digits.length >= 8
                                ? parseInt(
                                    digits.substring(
                                        4,
                                        8
                                    ),
                                    10
                                )
                                : null;


                        var maxDays =
                            getMaxDays(
                                monthNumber,
                                yearNumber
                            );


                        if (
                            dayNumber < 1 ||
                            dayNumber > maxDays
                        ) {

                            elem.val("");

                            ngModelCtrl
                                .$setViewValue("");


                            alertify.error(
                                "Invalid day. This month has only " +
                                maxDays +
                                " days."
                            );


                            return;
                        }
                    }


                    /* -----------------------------------------------
                       FORMAT
                       MM-DD-YYYY
                    ----------------------------------------------- */

                    var formatted = "";


                    if (
                        digits.length <= 2
                    ) {

                        formatted =
                            digits;
                    }


                    else if (
                        digits.length <= 4
                    ) {

                        formatted =
                            digits.substring(
                                0,
                                2
                            ) +
                            "-" +
                            digits.substring(
                                2
                            );
                    }


                    else {

                        formatted =
                            digits.substring(
                                0,
                                2
                            ) +
                            "-" +
                            digits.substring(
                                2,
                                4
                            ) +
                            "-" +
                            digits.substring(
                                4,
                                8
                            );
                    }


                    elem.val(
                        formatted
                    );


                    ngModelCtrl
                        .$setViewValue(
                            formatted
                        );
                }
            );


            elem.on(
                "blur",
                function () {

                    var value =
                        elem.val() || "";


                    var digits =
                        value.replace(
                            /\D/g,
                            ""
                        );


                    /*
                     * Incomplete date
                     */
                    if (
                        digits.length !== 8 &&
                        digits.length !== 0
                    ) {

                        elem.val("");

                        ngModelCtrl
                            .$setViewValue("");


                        alertify.error(
                            "Invalid date format. Please enter the date in MM-DD-YYYY format"
                        );


                        return;
                    }


                    /*
                     * Complete date
                     */
                    if (
                        digits.length === 8
                    ) {

                        var enteredDate =
                            getEnteredDate(
                                value
                            );


                        /*
                         * Invalid calendar date
                         */
                        if (!enteredDate) {

                            elem.val("");

                            ngModelCtrl
                                .$setViewValue("");


                            alertify.error(
                                "Please enter a valid date."
                            );


                            return;
                        }


                        /*
                         * Appointment date range
                         */
                        if (
                            !isDateWithinRange(
                                enteredDate
                            )
                        ) {

                            var range =
                                getMinAndMaxDates();


                            elem.val("");

                            ngModelCtrl
                                .$setViewValue("");


                            alertify.error(
                                "Please enter a date between " +
                                formatDate(
                                    range.minDate
                                ) +
                                " and " +
                                formatDate(
                                    range.maxDate
                                )
                            );


                            return;
                        }
                    }
                }
            );


            /* =========================================================
               ANGULAR RENDER
            ========================================================= */

            ngModelCtrl.$render =
                function () {

                    elem.val(
                        ngModelCtrl
                            .$viewValue || ""
                    );
                };


            /* =========================================================
               CLEANUP
            ========================================================= */

            scope.$on(
                "$destroy",
                function () {

                    calendarIcon.off(
                        "mousedown touchstart"
                    );

                    calendarIcon.off(
                        "click"
                    );

                    elem.off("keydown");
                    elem.off("input");
                    elem.off("blur");

                    if (
                        elem.hasClass(
                            "hasDatepicker"
                        )
                    ) {

                        elem.datepicker(
                            "destroy"
                        );
                    }
                }
            );
        }
    };
}]);
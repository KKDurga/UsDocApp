"use strict";

eHnoteWebApp.controller("EhnoteLoginCtrl", ["$scope", "$filter", "$location", "eHnoteValidateUsersDataService", "eHnoteUserDataService", "eHnoteMasterDataService", "datacookieFactory", "alertify", "$rootScope", "eHnoteSettingsDataService", "loginCookieFactory", "eHnotePatientAddressDataServices", "eHnoteMainAppointmentService", "eHnoteDbStaticDataService", "datapersistanceFactory", "localStorageFactory", "eHnoteDiagnosisDataServices", "eHnoteLoginStatusService", "$window", '$timeout', 'eHnoteSurgeryService', '$interval', function ($scope, $filter, $location, eHnoteValidateUsersDataService, eHnoteUserDataService, eHnoteMasterDataService, datacookieFactory, alertify, $rootScope, eHnoteSettingsDataService, loginCookieFactory, eHnotePatientAddressDataServices, eHnoteMainAppointmentService, eHnoteDbStaticDataService, datapersistanceFactory, localStorageFactory, eHnoteDiagnosisDataServices, eHnoteLoginStatusService, $window, $timeout, eHnoteSurgeryService, $interval) {


    var printdetailsArray = [
        {
            "PageName": "Billing",
            "LetterHeadValue": "No",
            "PageSettings": {
                "PageSize": "A4",
                "PageOrientation": "Portrait",
                "MarginTop": 10,
                "MarginBottom": 20,
                "MarginLeft": 30,
                "MarginRight": 30
            },
            "CustomPrintSettings": {
                "HeaderSettings": "",
                "ContentSettings": "",
                "FooterSettings": ""
            }
        },
        {
            "PageName": "Summary",
            "LetterHeadValue": "No",
            "PageSettings": {
                "PageSize": "A4",
                "PageOrientation": "Portrait",
                "MarginTop": 10,
                "MarginBottom": 20,
                "MarginLeft": 30,
                "MarginRight": 30
            },
            "CustomPrintSettings": {
                "HeaderSettings": "",
                "ContentSettings": "",
                "FooterSettings": ""
            }
        },
        {
            "PageName": "Prescription",
            "LetterHeadValue": "No",
            "PageSettings": {
                "PageSize": "A4",
                "PageOrientation": "Portrait",
                "MarginTop": 10,
                "MarginBottom": 20,
                "MarginLeft": 30,
                "MarginRight": 30
            },
            "CustomPrintSettings": {
                "HeaderSettings": "",
                "ContentSettings": "",
                "FooterSettings": ""
            }
        },
        {
            "PageName": "Lab",
            "LetterHeadValue": "No",
            "PageSettings": {
                "PageSize": "A4",
                "PageOrientation": "Portrait",
                "MarginTop": 10,
                "MarginBottom": 20,
                "MarginLeft": 30,
                "MarginRight": 30
            },
            "CustomPrintSettings": {
                "HeaderSettings": "",
                "ContentSettings": "",
                "FooterSettings": ""
            }
        },
        {
            "PageName": "ViewCaseHistory",
            "LetterHeadValue": "No",
            "PageSettings": {
                "PageSize": "A4",
                "PageOrientation": "Portrait",
                "MarginTop": 10,
                "MarginBottom": 20,
                "MarginLeft": 30,
                "MarginRight": 30
            },
            "CustomPrintSettings": {
                "HeaderSettings": "",
                "ContentSettings": "",
                "FooterSettings": ""
            }
        },
        {
            "PageName": "ParthaBilling",
            "LetterHeadValue": "No",
            "PageSettings": {
                "PageSize": "A6",
                "PageOrientation": "Portrait",
                "MarginTop": 10,
                "MarginBottom": 20,
                "MarginLeft": 30,
                "MarginRight": 30
            },
            "CustomPrintSettings": {
                "HeaderSettings": "",
                "ContentSettings": "",
                "FooterSettings": ""
            }
        },
        {
            "PageName": "Optical",
            "LetterHeadValue": "No",
            "PageSettings": {
                "PageSize": "A4",
                "PageOrientation": "Portrait",
                "MarginTop": 10,
                "MarginBottom": 20,
                "MarginLeft": 30,
                "MarginRight": 30
            },
            "CustomPrintSettings": {
                "HeaderSettings": "",
                "ContentSettings": "",
                "FooterSettings": ""
            }
        },
        {
            "PageName": "Pharmacy",
            "LetterHeadValue": "No",
            "PageSettings": {
                "PageSize": "A4",
                "PageOrientation": "Portrait",
                "MarginTop": 10,
                "MarginBottom": 20,
                "MarginLeft": 30,
                "MarginRight": 30
            },
            "CustomPrintSettings": {
                "HeaderSettings": "",
                "ContentSettings": "",
                "FooterSettings": ""
            }
        },
        {
            "PageName": "Inventory",
            "LetterHeadValue": "No",
            "PageSettings": {
                "PageSize": "A4",
                "PageOrientation": "Portrait",
                "MarginTop": 10,
                "MarginBottom": 20,
                "MarginLeft": 30,
                "MarginRight": 30
            },
            "CustomPrintSettings": {
                "HeaderSettings": "",
                "ContentSettings": "",
                "FooterSettings": ""
            }
        },
        {
            "PageName": "OT",
            "LetterHeadValue": "No",
            "PageSettings": {
                "PageSize": "A4",
                "PageOrientation": "Portrait",
                "MarginTop": 10,
                "MarginBottom": 20,
                "MarginLeft": 30,
                "MarginRight": 30
            },
            "CustomPrintSettings": {
                "HeaderSettings": "",
                "ContentSettings": "",
                "FooterSettings": ""
            }
        },
        {
            "PageName": "ConsultationEntryForm",
            "LetterHeadValue": "No",
            "PageSettings": {
                "PageSize": "A4",
                "PageOrientation": "Portrait",
                "MarginTop": 10,
                "MarginBottom": 20,
                "MarginLeft": 30,
                "MarginRight": 30
            },
            "CustomPrintSettings": {
                "HeaderSettings": "",
                "ContentSettings": "",
                "FooterSettings": ""
            }
        }
    ];

    $scope.TwoWayVerifactionObj = {
        "UserId": "",
        "UserName": "",
        "MobileNo": "",
        /*  "SMSTextBoxFirst": "",
          "SMSTextBoxSecond": "",
          "SMSTextBoxThird": "",
          "SMSTextBoxFourth": "",*/
        "SMSOTP": '',
    }

    function getnewMFAVerificationObj() {
        var obj = {
            "DoctorID": "",
            "MFAOTP": "",
            /* "OtpTextBoxFirst": "",
             "OtpTextBoxSecond": "",
             "OtpTextBoxThird": "",
             "OtpTextBoxFourth": "",
             "OtpTextBoxFifth": "",
             "OtpTextBoxSixth": "",*/
            "RefreshToken": "",
            "ExpiryDate": "",
            "TypeOfDevice": ""
        };
        return obj;
    }
    $scope.MFAVerifactionObj = getnewMFAVerificationObj();


    $scope.TwoWayVerifaction = false;


    var newUserId = $location.search().UserId || 0;
    var newBranchId = $location.search().BranchId || 0;
    var newtoken = $location.search().Token || "";
    var newRefreshToken = $location.search().RefreshToken || "";
    var newTokenExpireTime = $location.search().TokenExpireTime;




    $scope.logininfoObj = {
        "JToken": "",
        "RToken": "",
        "TokenExpiry": "",
        "UserId": "",
        "UserName": "",
        "HashPassword": "",
        "loggedinStatus": false,
        "LoginTab": "",
        "LoginBranchId": "",
        "displayName": "",
        "RoleID": "",
        "RememberCredentials": "",
        "SubOrganizationId": ""
    }
    $scope.searchHospital = { txt1: '' };


    $scope.allBranchesArray = [];
    $scope.allSubSpecializationsArray = [];
    $scope.getAllBranchesBySubOrganizationId = function (subOrganizationId, UserRoleId, OrganizationTypeId) {

        eHnoteMainAppointmentService.getAllBranchesBySubOrganizationId(subOrganizationId, onHospitalListSuccess, OnHospitalListFailed);
        function onHospitalListSuccess(data) {

            if (data.rows.length > 0) {
                $scope.allBranchesArray = data.rows;
                localStorageFactory.set("allBranchesData", $scope.allBranchesArray);
                $rootScope.$broadcast("loader_hide");

                if (OrganizationTypeId === 4) {
                    $location.path("/LabOperations");
                } else {
                    var Location = eHnoteSettingsDataService.NewGetLandingScreen();
                    var LoginDetails = eHnoteLoginStatusService.getUserLoginDetails();

                    $scope.logininfoObj.LoginTab = Location;
                    $scope.logininfoObj.RoleID = LoginDetails.RoleID;

                    console.log(JSON.stringify($scope.logininfoObj));

                    eHnoteLoginStatusService.addUserLoginDetails($scope.logininfoObj);
                    $location.url(Location);
                }
                angular.forEach($scope.allBranchesArray, function (item) {
                    if (item.HospitalInfo.HospitalDetails.BranchId === doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
                        $rootScope.main.IsGSTInd = item.HospitalInfo.HospitalDetails.OpticalGSTInd;
                        $rootScope.main.OpticalGlassPrintInd = item.HospitalInfo.HospitalDetails.OpticalGlassPrintInd;
                        $rootScope.main.PharmacyGSTInd = item.HospitalInfo.HospitalDetails.PharmacyGSTInd;
                    }
                });
            }
        }
        function OnHospitalListFailed(error) {
            console.log(error);
        }
    };

    if (newUserId === 0 && newtoken === "") {
        var userLoginDetailsnew = eHnoteLoginStatusService.getUserLoginDetails();

        console.log(JSON.stringify(userLoginDetailsnew));

        if (userLoginDetailsnew.loggedinStatus == true && userLoginDetailsnew.JToken != "" && userLoginDetailsnew.UserId != "") {
            $scope.logininfoObj.JToken = userLoginDetailsnew.JToken;
            $scope.logininfoObj.RToken = userLoginDetailsnew.RToken;
            $scope.logininfoObj.TokenExpiry = userLoginDetailsnew.TokenExpiry;
            $scope.logininfoObj.UserId = userLoginDetailsnew.UserId;
            $scope.logininfoObj.UserName = userLoginDetailsnew.UserName;
            $scope.logininfoObj.HashPassword = userLoginDetailsnew.HashPassword;
            $scope.logininfoObj.loggedinStatus = userLoginDetailsnew.loggedinStatus;
            $scope.logininfoObj.LoginTab = userLoginDetailsnew.LoginTab;
            $scope.logininfoObj.LoginBranchId = userLoginDetailsnew.LoginBranchId;
            $scope.logininfoObj.RememberCredentials = userLoginDetailsnew.RememberCredentials;
            $scope.logininfoObj.SubOrganizationId = userLoginDetailsnew.SubOrganizationId;
            $scope.logininfoObj.displayName = userLoginDetailsnew.displayName;
            $scope.logininfoObj.RoleID = userLoginDetailsnew.RoleID;


            autologin($scope.logininfoObj.UserId, $scope.logininfoObj.JToken, $scope.logininfoObj.RToken, $scope.logininfoObj.TokenExpiry);

            //var Location = eHnoteSettingsDataService.NewGetLandingScreen();
            //console.log(Location);
            //$location.url(Location);



            //let loginUserObj = {
            //    "FirstName": userLoginDetailsnew.FullName || "",
            //    "DoctorId": userLoginDetailsnew.UserId || 0,
            //    "RoleId": userLoginDetailsnew.RoleId || 0,
            //}
            //datapersistanceFactory.set("userRefreshTokenObj", loginUserObj);


            ////$scope.getAllBranchesBySubOrganizationId($scope.logininfoObj.SubOrganizationId);

            //datapersistanceFactory.set("JWTToken", userLoginDetailsnew.JToken);
            //datapersistanceFactory.set("USerLoginTime", new Date());
            //localStorage.setItem('RefreshToken', userLoginDetailsnew.RToken);
            //localStorage.setItem('TokenExpireTime', userLoginDetailsnew.TokenExpiry);

            //var Location = eHnoteSettingsDataService.NewGetLandingScreen();
            //console.log(Location);
            //$location.url(Location);
            //$scope.showSubOrganizationPopUp = true;
            //$scope.dynamicPopoverSub = { templateUrl: "ChooseSubOrganizationPopUp.html" };
        } else {
            init();
        }

    }
    else {
        init();
    }
    loginCookieFactory.remove('telnyxloggedInfo');
    $rootScope.telnyxUserAuthAvailable = false;
    // reset to "not deactivated" - ContinueLogin sets the real value once the
    // credential comes back, and a stale false must not leak into the next session
    $rootScope.telnyxCredentialActive = true;
    $rootScope.telnyxCredentialResolved = false;   // let the next session look it up again
    $rootScope.main = {
        'OpticalGlassPrintInd': false,
        'IsGSTInd': false,
        'PharmacyGSTInd': false,
    }
    $scope.SubOrganizationName = "";
    $scope.SubOrganizationId = "";

    var modalInstance;



    //$rootScope.showSwitchAnother = false;
    $scope.selectedUserBranchRoomObj = "";

    //$scope.userId = eHnoteMasterDataService.getLoginId();
    function UpdateLoginDetailsOfUser() {
        var userId = eHnoteMasterDataService.getLoginId();
        userId = userId || null;
        if (userId !== null) {
            var doctorinfo = eHnoteMasterDataService.getUserInfo();

            let HospitalID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID || null;
            //if (datapersistanceFactory === null || "") {
            eHnoteValidateUsersDataService.UpdateLoginDetailsOfUser($scope.Lat, $scope.Lon, userId, HospitalID, callbackSuccess, callbackError);
            function callbackSuccess(resp) {
                if (resp.status === "Success") {
                    datapersistanceFactory.clearAll();
                    datapersistanceFactory.set("JWTToken", "");
                    eHnoteMasterDataService.addLoginId('');
                    eHnoteMasterDataService.addUserInfo('');
                }

            }
            function callbackError(error) {
                console.error(error);
                $rootScope.IsValidOAuth = false;
                $scope.ShowLoginScreen = true;
                $rootScope.IsDuplicateLogin = false;
                datapersistanceFactory.clearAll();
                datapersistanceFactory.set("JWTToken", "");
            }

            //.then(function (sucess) { }, function (error) { });
            // eHnoteMasterDataService.addLoginId('');
            //  }

        }
        //eHnoteValidateUsersDataService.UpdateLoginDetailsOfUser(callbackSuccess, callbackError)

    }



    function init() {
        $scope.error = false;
        $scope.showBranchList = true;
        $scope.showSubOrganizationList = false;
        $scope.ShowLoginScreen = true;
        $scope.showUserBranchRoomsPopUp = false;
        $scope.showUserBranchRoomsdiv = false;
        $scope.showMFAAuthenticationScreen = false;
        $scope.isMFAauthEnabled = false;
        $rootScope.showMainPageHeader = false;
        $scope.mfaQRCode = "";
        $scope.tryAnotherWay = false;
        $scope.emptyScreen = false;

        var UserLogin = datapersistanceFactory.getItem("SuperAdminUserLoginData") || [];
        if (UserLogin.length !== 0) {
            $scope.validateInfo = { "userName": UserLogin.DoctorLoginID, "passWord": "Ehnote@123", "rememberMe": false, "IsFromAdmin": true };
        } else {
            $scope.validateInfo = { "userName": "", "passWord": "", "rememberMe": false, "IsFromAdmin": false };
            var storedUserName = datacookieFactory.getItem("rememberUser");
            var remembercheck = datacookieFactory.getItem("rememberme");
            if (storedUserName !== undefined) {
                //  $scope.validateInfo.userName = storedUserName;  // username getting encrypted. so need to update .
            }
            if (remembercheck !== undefined) {
                $scope.validateInfo.rememberMe = remembercheck;
            }
        }

        var emailfilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        $scope.emailpattern = emailfilter;



        $rootScope.showSwitchAnother = $rootScope.showSwitchAnother || false;
        console.log($rootScope.showSwitchAnother + "__$rootScope.showSwitchAnother");

        var obj = {
            "SelectedDoctorsList": [],
            "OPFromDate": moment().format("MM-DD-YYYY"),
            "BookingTypesArray": [],
            "AppointmentStatusArray": [],
            "BookedstatusFilterList": [],
            "ProfileStatusList": [],
            "selectedPatientTagList": [],
            "SelectedBranchesList": []
        };
        eHnoteMasterDataService.addSelectedOPUsers(obj);
        if ($rootScope.showSwitchAnother === true) {
            $scope.ShowLoginScreen = false;
            //if ($rootScope.user1 !=='') {
            //    OnLoginSuccess1($rootScope.user1);
            //}

            var doctorinfo = eHnoteMasterDataService.getUserInfo();
            OnLoginSuccess1(doctorinfo.doctordata);
        }
        else {
            var userSelectedDocId = newUserId || 0;
            var userSelectedToken = newtoken || "";
            var userRefreshToken = newRefreshToken || "";
            var userTokenExpireTime = newTokenExpireTime || "";


            $scope.logininfoObj.JToken = userSelectedToken;
            $scope.logininfoObj.RToken = userRefreshToken;
            $scope.logininfoObj.TokenExpiry = userTokenExpireTime;
            $scope.logininfoObj.UserId = userSelectedDocId;
            $scope.logininfoObj.UserName = "";
            $scope.logininfoObj.HashPassword = "";
            $scope.logininfoObj.loggedinStatus = true;
            $scope.logininfoObj.LoginTab = "";
            $scope.logininfoObj.LoginBranchId = "";
            $scope.logininfoObj.RememberCredentials = "";
            $scope.logininfoObj.displayName = "";
            $scope.logininfoObj.RoleID = "";


            eHnoteLoginStatusService.addUserLoginDetails($scope.logininfoObj);


            if (userSelectedDocId === 0 && userSelectedToken === "") {
                if (!$rootScope.showSwitchAnother) {
                    UpdateLoginDetailsOfUser();
                }
            } else {
                autologin(userSelectedDocId, userSelectedToken, userRefreshToken, userTokenExpireTime);
            }
        }
    }

    function autologin(doctorId, token, userRefreshToken, userTokenExpireTime) {

        console.log(token);
        datapersistanceFactory.set("JWTToken", token);
        datapersistanceFactory.set("USerLoginTime", new Date());
        let RefreshToken = userRefreshToken;
        let TokenExpireTime = $filter('date')(userTokenExpireTime, 'yyyy-MM-dd') || "";
        var params = {
            "DoctorID": doctorId,
            "RefreshToken": RefreshToken || "",
            "ExpiryDate": TokenExpireTime || ""
        }

        eHnoteSettingsDataService.getValidUserResp(params).success(function (data) {
            if (data.status === "Success") {
                data.Token = token;
                var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
                userLoginDetails.UserId = data.User[0].UserLoginID;
                userLoginDetails.password = "";
                userLoginDetails.rememberme = false;
                userLoginDetails.setStatus = "true";
                userLoginDetails.loggedinStatus = true;
                userLoginDetails.RoleID = data.User[0].RoleId;

                loginCookieFactory.set('loggedInfo', userLoginDetails);
                localStorage.setItem('RefreshToken', userRefreshToken);
                localStorage.setItem('TokenExpireTime', userTokenExpireTime);
                data.RefreshToken = userRefreshToken || "";
                data.TokenExpireTime = userTokenExpireTime || "";

                OnLoginMFANormalSuccess(data)
                //OnLoginSuccess(data);
            }
            else {
                alertify.error(data.Message);
                datapersistanceFactory.clearAll();
                $scope.ShowLoginScreen = true;

            }

        }).error(function (error) {
            console.log("error getvalid doctor service");
            datapersistanceFactory.clearAll();
            $scope.ShowLoginScreen = true;
        });
    }

    function generateRandomIV() {
        return CryptoJS.lib.WordArray.random(16); // 16 bytes (128-bit) IV
    }

    $scope.ValidateUser = function (validateUserForm, validateInfo) {

        if ($window.location.host == "ioj.ehnote.com" || $window.location.host == 'insts.ehnote.com') {
            alertify.error("You are not allowed to login into the portal, please wait while we redirect to our parent URL");
            if ($window.location.host == 'insts.ehnote.com') {
                $window.location.href = "https://stage.ehnote.com/#/login";
            } else {
                $window.location.href = "https://portal.ehnote.com/#/login";
            }

        } else {
            angular.element('.alertify-logs').show();
            $scope.error = false;
            $rootScope.$broadcast("loader_show");
            $scope.rememberme = true;

            // for Encryption username and password
            let secretKey = CryptoJS.enc.Utf8.parse("123456789012345678901234");
            let iv = generateRandomIV();
            let userName = angular.copy($scope.validateInfo.userName) || "";
            let passWord = angular.copy($scope.validateInfo.passWord) || "";
            let encryptedUserName = CryptoJS.AES.encrypt(userName, secretKey, {
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
                iv: iv
            }).ciphertext.toString(CryptoJS.enc.Base64);

            let encryptedPassword = CryptoJS.AES.encrypt(passWord, secretKey, {
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
                iv: iv
            }).ciphertext.toString(CryptoJS.enc.Base64);
            let ivBase64 = CryptoJS.enc.Base64.stringify(iv);

            eHnoteValidateUsersDataService.ValidateUser(encryptedUserName, encryptedPassword, $scope.validateInfo.rememberMe, $scope.Lat, $scope.Lon, $scope.validateInfo.IsFromAdmin, ivBase64, OnLoginMFANormalSuccess, OnLoginError);

          
        }

    };
    $scope.Rolelist = [];


    //function loadJsonLoad(script) {
    //    //new Promise((resolve, reject) => {
    //    //    try {
    //    //        var scriptElement = document.createElement("script");
    //    //        var head = document.querySelector("head");
    //    //        scriptElement.src = script;
    //    //        scriptElement.onload = e => resolve(e);
    //    //        scriptElement.onerror = e => reject(e);
    //    //        head.appendChild(scriptElement);
    //    //    } catch (error) {
    //    //        reject(error);
    //    //    }
    //    //});
    //           //var scriptElement = document.createElement("script");
    //           // var head = document.querySelector("head");
    //           // scriptElement.src = script;
    //           // scriptElement.onload = e => resolve(e);
    //           // scriptElement.onerror = e => reject(e);
    //           // head.appendChild(scriptElement);
    //    const node = document.createElement('script');
    //    node.src = script;
    //    node.type = 'text/javascript';
    //    node.async = false;
    //    document.getElementsByTagName('head')[0].appendChild(node);
    //}


    function OnLoginMFANormalSuccess(data) {
        if (data.status === "Success") {
            $scope.doctorBranchList = data;
            if ($scope.doctorBranchList.UserAddress.length > 0) {
                if ($scope.doctorBranchList.UserAddress[0].IsMFAAuthenticationEnabled) {
                    OnLoginSuccessMFA(data);
                } else {
                    OnLoginSuccess(data)
                }
            }
        } else {
            alertify.error(data.Message);
        }
    }

    function OnLoginSuccessMFA(data) {
        if (data.status === "Success") {
            $rootScope.newAllBranchesData = [];
            $rootScope.$broadcast("loader_hide");



            $scope.DoctorBranchName = "";
            $scope.RoleBranchName = "";
            $scope.SubOrganizationName = "";
            $scope.SubOrganizationId = "";
            $scope.doctorBranchList = data;



            $scope.showBranchList = false;
            $scope.showSubOrganizationList = false;
            $scope.showRoleGroupList = false;
            $scope.showListofbranchrole = false;

            $scope.isMFAauthEnabled = $scope.doctorBranchList.User[0].IsMFAEnrolled || false;

            console.log($scope.isMFAauthEnabled);

            $scope.TwoWayVerifaction = $scope.doctorBranchList.User[0].IsTwoWayVarificationInd || false;

            $scope.showMFAAuthenticationScreen = true;
            $scope.MFAVerifactionObj.MFAOTP = '';


            $scope.ShowLoginScreen = false;

            $scope.TwoWayVerifaction = false;
            console.log($scope.doctorBranchList.QrCodeString);
            if (!$scope.isMFAauthEnabled) {
                $scope.mfaQRCode = $scope.doctorBranchList.QrCodeString;
            }
           
            $scope.MFAVerifactionObj.DoctorID = data.User[0].DoctorID;
            $scope.MFAVerifactionObj.RefreshToken = data.RefreshToken;
            $scope.MFAVerifactionObj.ExpiryDate = data.TokenExpireTime;
            $scope.MFAVerifactionObj.TypeOfDevice = "49EBEEB3";


            datapersistanceFactory.set("JWTToken", data.Token);
            datapersistanceFactory.set("RefreshToken", data.RefreshToken);
            datapersistanceFactory.set("TokenExpireTime", data.TokenExpireTime);
            datapersistanceFactory.set("USerLoginTime", new Date());
            $scope.TwoWayVerifactionObj.SMSOTP = '';
            let loginUserObj = {
                "FirstName": data.User[0].FullName || "",
                "DoctorId": data.User[0].DoctorID || 0,
                "RoleId": data.User[0].RoleId || 0,
            }
            datapersistanceFactory.set("userRefreshTokenObj", loginUserObj);
            datapersistanceFactory.set("masterQuestions", data.MasterQuestions);
            $scope.getIPAddress();

            $scope.logininfoObj.JToken = data.Token;
            $scope.logininfoObj.RToken = data.RefreshToken;
            $scope.logininfoObj.TokenExpiry = data.TokenExpireTime;
            $scope.logininfoObj.UserId = data.User[0].DoctorID;
            $scope.logininfoObj.UserName = data.User[0].UserLoginID;
            $scope.logininfoObj.HashPassword = "";
            $scope.logininfoObj.loggedinStatus = true;
            $scope.logininfoObj.LoginTab = "";
            $scope.logininfoObj.LoginBranchId = "";
            $scope.logininfoObj.RememberCredentials = "";
            $scope.logininfoObj.displayName = data.User[0].FullName;
            $scope.logininfoObj.RoleID = data.User[0].RoleId;

            $scope.logininfoObj.SubOrganizationId = data.UserAddress[0].ExtDetails.HospitalInfo.SubOrganizationId;
            eHnoteLoginStatusService.addUserLoginDetails($scope.logininfoObj);

            $scope.GetPrintSettings(data.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID, data.UserAddress[0].ExtDetails.HospitalInfo.SubHospitalID, data.User[0].DoctorID);

            $scope.GetLanguage();



        }
        else {
            alertify.error(data.Message);
        }
    }


    function OnLoginErrorMFA(data, no) {
        $rootScope.$broadcast("loader_hide");

        if (no === 0) {
            return;
        } else if (no === 1) {
            $scope.error = true;
            alertify.error("Invalid User Name / Password");
        } else {
            alertify.error("Invalid User Name / Password");
        }

        $scope.ShowLoginScreen = true;
    }
    function OnLoginSuccess(data, isCallingFrom) {

        var isCallingFrom = isCallingFrom || "";
        if (data.status === "Success") {
            $rootScope.newAllBranchesData = [];
            $rootScope.$broadcast("loader_hide");



            getLocation();


            var currenturl = $location.absUrl().split('?')[0];
            data.MocCredentials = data.MocCredentials || [];
            // data.MocCredentials = [];


            if (data.MocCredentials.length > 0 && (currenturl === 'https://stage.ehnote.com/#/login' || currenturl === 'https://portal.ehnote.com/#/login')) {
                var switchUrl = "";
                switchUrl = data.MocCredentials[0].ApplicationURL;
                var tUserId = data.User[0].DoctorID;
                datapersistanceFactory.set("JWTToken", data.Token);
                datapersistanceFactory.set("RefreshToken", data.RefreshToken);
                datapersistanceFactory.set("TokenExpireTime", data.TokenExpireTime);
                //sessionStorage.setItem('RefreshToken', data.RefreshToken);
                //sessionStorage.setItem('TokenExpireTime', data.TokenExpireTime);
                localStorage.setItem("UserId", tUserId);
                localStorage.setItem("JWTToken", data.Token);
                localStorage.setItem('RefreshToken', data.RefreshToken);
                localStorage.setItem('TokenExpireTime', data.TokenExpireTime);
                let loginUserObj = {
                    "FirstName": data.User[0].FullName || "",
                    "DoctorId": data.User[0].DoctorID || 0,
                    "RoleId": data.User[0].RoleId || 0,
                }
                datapersistanceFactory.set("userRefreshTokenObj", loginUserObj);
                var token = datapersistanceFactory.getItemString('JWTToken');
                let tRefreshtoken = angular.copy(data.RefreshToken);
                let tTokenExpireTime = angular.copy(data.TokenExpireTime);




                $window.location.href = switchUrl + "?UserId=" + tUserId + "&Token=" + token + "" + "&RefreshToken=" + tRefreshtoken + "" + "&TokenExpireTime=" + tTokenExpireTime + "";


            }
            else {

                datapersistanceFactory.clearAll();
                localStorageFactory.clearAll();


                $scope.DoctorBranchName = "";
                $scope.RoleBranchName = "";
                $scope.SubOrganizationName = "";
                $scope.SubOrganizationId = "";
                $scope.doctorBranchList = data;


                $scope.showMFAAuthenticationScreen = false;
                $scope.showBranchList = false;
                $scope.showSubOrganizationList = false;
                $scope.showRoleGroupList = false;
                $scope.showListofbranchrole = false;


                if ($scope.doctorBranchList.UserAddress.length > 0) {
                    $scope.showBranchList = true;
                    $scope.showRoleGroupList = false;
                    $scope.showSubOrganizationList = false;
                }

                if ($scope.doctorBranchList.UserAddress.length > 0 && $scope.showSubOrganizationList === false && $scope.showBranchList === false) {
                    angular.forEach($scope.doctorBranchList.UserAddress, function (item) {

                        if (item.UserBranchRoles.length !== 0) {
                            $scope.showBranchList = false;
                            $scope.showSubOrganizationList = false;
                            $scope.showRoleGroupList = true;
                        }
                    });

                }
                if ($scope.doctorBranchList.UserSubOrganization.length > 0 && $scope.doctorBranchList.User[0].UserType === 'ParentUser') {
                    $scope.showBranchList = false;
                    $scope.showRoleGroupList = false;
                    $scope.showSubOrganizationList = true;
                }
                if ($scope.doctorBranchList.UserAddress.length > 1) {
                    $scope.showBranchList = true;

                }


                $scope.TwoWayVerifaction = $scope.doctorBranchList.User[0].IsTwoWayVarificationInd || false;

                console.log("isCallingFrom " + isCallingFrom);
                console.log("TwoWayVerifaction " + $scope.TwoWayVerifaction);
                if (isCallingFrom == "MFA") {
                    $scope.TwoWayVerifaction = false;
                }
                if ($scope.TwoWayVerifaction && isCallingFrom == "") {
                    if (data.User != undefined) {
                        $scope.Email = data.User[0].UserEmailId || "";
                    }
                    $scope.ShowLoginScreen = false;
                    $scope.showListofbranchrole = false
                    $scope.TwoWayVerifactionOTPGenarating();
                } else {
                    $scope.doctorBranchList.UserSubOrganization = $scope.doctorBranchList.UserSubOrganization || [];
                    if ($scope.doctorBranchList.UserSubOrganization.length === 1) {
                        $scope.doctorBranchList.UserAddress = $scope.doctorBranchList.UserAddress || [];
                        if ($scope.doctorBranchList.UserAddress.length === 1) {
                            $scope.emptyScreen = true;
                            $scope.showListofbranchrole = true;
                        }
                    }
                    if ($scope.showListofbranchrole === false) {
                        $scope.ShowLoginScreen = false;
                        if ($scope.showSubOrganizationList) {
                            $scope.showSubOrganizationPopUp = true;
                            $scope.dynamicPopoverSub = { templateUrl: "ChooseSubOrganizationPopUp.html" };
                        }
                        else if ($scope.showRoleGroupList) {
                            $scope.Rolelist = $scope.doctorBranchList.UserAddress[0].UserBranchRoles || [];
                            $scope.showRoleGroupPopUp = true;
                            //$scope.dynamicPopoverRole = { templateUrl: "ChooseRoleGroupPopUp.html" };
                            $scope.dynamicPopover = { templateUrl: "ChooseRoleGroupPopUp.html" };
                        } else {
                            $scope.showBranchPopup = true;
                            $scope.dynamicPopoverBranch = { templateUrl: "ChooseDoctorBranchPopUp.html" };
                        }

                    }
                }


                datapersistanceFactory.set("JWTToken", data.Token);
                datapersistanceFactory.set("RefreshToken", data.RefreshToken);
                datapersistanceFactory.set("TokenExpireTime", data.TokenExpireTime);
                datapersistanceFactory.set("USerLoginTime", new Date());
                /* $scope.TwoWayVerifactionObj.SMSTextBoxFirst = '';
                 $scope.TwoWayVerifactionObj.SMSTextBoxSecond = '';
                 $scope.TwoWayVerifactionObj.SMSTextBoxThird = '';
                 $scope.TwoWayVerifactionObj.SMSTextBoxFourth = '';*/
                $scope.TwoWayVerifactionObj.SMSOTP = '';
                let loginUserObj = {
                    "FirstName": data.User[0].FullName || "",
                    "DoctorId": data.User[0].DoctorID || 0,
                    "RoleId": data.User[0].RoleId || 0,
                }
                datapersistanceFactory.set("userRefreshTokenObj", loginUserObj);
                datapersistanceFactory.set("masterQuestions", data.MasterQuestions);
                $scope.getIPAddress();

                $scope.logininfoObj.JToken = data.Token;
                $scope.logininfoObj.RToken = data.RefreshToken;
                $scope.logininfoObj.TokenExpiry = data.TokenExpireTime;
                $scope.logininfoObj.UserId = data.User[0].DoctorID;
                $scope.logininfoObj.UserName = data.User[0].UserLoginID;
                $scope.logininfoObj.HashPassword = "";
                $scope.logininfoObj.loggedinStatus = true;
                $scope.logininfoObj.LoginTab = "";
                $scope.logininfoObj.LoginBranchId = "";
                $scope.logininfoObj.RememberCredentials = "";
                $scope.logininfoObj.displayName = data.User[0].FullName;
                $scope.logininfoObj.RoleID = data.User[0].RoleId;

                $scope.logininfoObj.SubOrganizationId = data.UserAddress[0].ExtDetails.HospitalInfo.SubOrganizationId;
                eHnoteLoginStatusService.addUserLoginDetails($scope.logininfoObj);
                //Get OrganizationSettings
                $scope.GetOrganizationSettings(data.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID);


                $scope.GetPrintSettings(data.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID, data.UserAddress[0].ExtDetails.HospitalInfo.SubHospitalID, data.User[0].DoctorID);


                $scope.GetLanguage();


            }

        } else {

            alertify.error(data.Message);
            // alertify.error("Invalid User Name / Password");
        }
    }
    function OnLoginError(data, no) {



        $rootScope.$broadcast("loader_hide");

        if (no === 0) {
            return;
        } else if (no === 1) {
            $scope.error = true;
            alertify.error("Invalid User Name / Password");
        } else {
            alertify.error("Invalid User Name / Password");
        }

        $scope.ShowLoginScreen = true;
    }


    $scope.GetOrganizationSettings = function (ParentHospitalID) {
        //eHnoteSettingsDataService.GetOrganizationSettings({ "ParentOrganizationId": ParentHospitalID }).then(function (resp) {
        eHnoteSettingsDataService.GetOrganizationSettings(ParentHospitalID).then(function (resp) {
            eHnoteSettingsDataService.RestructureOrganizationSettings(resp.data.SettingDetails, resp.data);

            $scope.doctorBranchList.UserSubOrganization = $scope.doctorBranchList.UserSubOrganization || [];
            if ($scope.doctorBranchList.UserSubOrganization.length === 1 && !$scope.TwoWayVerifaction) {
                $scope.doctorBranchList.UserAddress = $scope.doctorBranchList.UserAddress || [];
                if ($scope.doctorBranchList.UserAddress.length === 1) {
                    $scope.ChangeDoctorBranch($scope.doctorBranchList.UserAddress[0]);
                }
            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting oganization settings failed");
        });
    };


    $scope.GetClinicDoctors = function (ParentHospitalID, UserRoleId, OrganizationTypeId) {
        var docParams = {
            "PageSize": 1000,
            "PageNumber": 1,
            "HospitalID": ParentHospitalID,
            "ActiveDoctors": "Y"
        };
        var allhospitaldocdata = [];
        eHnoteMainAppointmentService.getClinicDoctors(docParams, onListDocSuccess, OnListDocFailed);
        function onListDocSuccess(data) {
            allhospitaldocdata = angular.copy(data);
            localStorageFactory.set("allHospitalsDoctorsData", allhospitaldocdata);

            $rootScope.$broadcast("loader_hide");

            if (OrganizationTypeId === 4) {
                $location.path("/LabOperations");
            } else {





                var Location = eHnoteSettingsDataService.GetLandingScreen(UserRoleId);
                $location.url(Location);
            }
            //$rootScope.$broadcast("reloadMainController"); // commented by sabarish , need to discuss with durga.
        }
        function OnListDocFailed(error) {
            console.log(error);
        }
    };


    $rootScope.$on("changeSwitchAnother", function (event, data) {

        $scope.ShowLoginScreen = false;
        $scope.IsValidOAuth = false;
        $rootScope.user1 = data.doctordata;
        $rootScope.showSwitchAnother = true;
        //eHnoteMasterDataService.addSelectedOPUsers('');
        //$scope.dynamicPopover = { templateUrl: "ChooseDoctorBranchPopUp.html" };

        //$timeout(function () {
        //    $scope.ShowLoginScreen = false;
        //    $scope.IsValidOAuth = false;

        //}, 500);

    });




    $scope.GetBranchSubSpecializations = function (SubOrganizationId, BranchId) {

        eHnoteMainAppointmentService.getBranchSubSpecializationsById(SubOrganizationId, BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsArray = resp.data.row;
                localStorageFactory.set("allSubSpecializationsData", $scope.allSubSpecializationsArray);
            }

        });
    };

    $scope.GetAppointmentTypes = function () {
        eHnotePatientAddressDataServices.getAppointmentTypes(onTypesSuccess, onTypesFailed);
        function onTypesSuccess(data) {
            $scope.appointmentTypes = data || [];
            loginCookieFactory.set("masteAppointmentTypes", $scope.appointmentTypes);
        }
        function onTypesFailed(err) {
            console.log(err);
        }
    };


    $scope.GetDoctorComments = function () {
        eHnoteDiagnosisDataServices.GetDoctorComments().then(function (resp) {
            $scope.DoctorCommentList = resp.data || [];
            loginCookieFactory.set("masterDoctorComments", $scope.DoctorCommentList);
        });
    };


    $scope.GetOptomComments = function () {
        eHnoteDiagnosisDataServices.GetOptomComments().then(function (resp) {
            $scope.OptomList = resp.data || [];
            loginCookieFactory.set("masterOptomComments", $scope.OptomList);
        });
    };


    $scope.GetLanguage = function () {
        eHnoteSettingsDataService.GetLanguage()
            .success(function (data) {
                $scope.AllLanguageData = data || [];
                loginCookieFactory.set("masterLanguageList", $scope.AllLanguageData);
            })
            .error(function (error) {
                alertify.log("Check internet connectivity");
            });
    }

    function OnLoginSuccess1(data) {

        $rootScope.$broadcast("loader_hide");

        $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();

        //if (data.User[0].RoleId !== 24) {
        //if (data.UserAddress[0].ExtDetails.HospitalInfo.OrganizationTypeId === 4) {
        //    if (data.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
        //        eHnoteMasterDataService.addUserPreferences(data.UserAddress[0].ExtDetails.HospitalInfo);
        //    }
        //    $scope.loggedinStatus = true;
        //    var isUserValidate = eHnoteUserDataService.EvaluateUserInfo(data);
        //    if (isUserValidate) {
        //        $scope.ContinueLogin(data, data.UserAddress[0].ExtDetails.HospitalInfo.OrganizationTypeId);

        //    }
        //}
        //else {
        datapersistanceFactory.clearAll();
        localStorageFactory.clearAll();
        $scope.DoctorBranchName = "";
        $scope.RoleBranchName = "";
        $scope.SubOrganizationName = "";
        $scope.SubOrganizationId = "";
        $scope.doctorBranchList = data;



        $scope.showBranchList = false;
        $scope.showSubOrganizationList = false;
        $scope.showRoleGroupList = false;
        $scope.showListofbranchrole = false;

        if ($scope.doctorBranchList.UserAddress.length > 1) {
            $scope.showBranchList = true;
            $scope.showRoleGroupList = false;
            $scope.showSubOrganizationList = false;
        }
        if ($scope.doctorBranchList.UserAddress.length > 0 && $scope.showSubOrganizationList === false && $scope.showBranchList === false) {
            angular.forEach($scope.doctorBranchList.UserAddress, function (item) {
                //angular.forEach(item.UserBranchRoles, function () {
                //});
                if (item.UserBranchRoles.length !== 0) {
                    $scope.showBranchList = false;
                    $scope.showSubOrganizationList = false;
                    $scope.showRoleGroupList = true;
                }
            });

        }
        if ($scope.doctorBranchList.UserAddress.length > 1) {
            $scope.showBranchList = true;

        }
        if ($scope.doctorBranchList.UserSubOrganization.length > 0 && $scope.doctorBranchList.User[0].UserType === 'ParentUser') {
            $scope.showBranchList = false;
            $scope.showRoleGroupList = false;
            $scope.showSubOrganizationList = true;
        }


        if (data.UserAddress.length === 1) {
            angular.forEach($scope.doctorBranchList.UserAddress, function (item) {

                if (item.UserBranchRoles.length === 1) {
                    $scope.showListofbranchrole = true;
                    $scope.ContinueLogin(data, data.UserAddress[0].ExtDetails.HospitalInfo.OrganizationTypeId);
                }
            });


        }
        if ($scope.showListofbranchrole === false) {
            $scope.ShowLoginScreen = false;
            if ($scope.showSubOrganizationList) {
                $scope.showSubOrganizationPopUp = true;
                $scope.dynamicPopoverSub = { templateUrl: "ChooseSubOrganizationPopUp.html" };
            }
            else if ($scope.showRoleGroupList) {
                $scope.Rolelist = $scope.doctorBranchList.UserAddress[0].UserBranchRoles || [];
                $scope.showRoleGroupPopUp = true;
                //  $scope.dynamicPopoverRole = { templateUrl: "ChooseRoleGroupPopUp.html" };
                $scope.dynamicPopover = { templateUrl: "ChooseRoleGroupPopUp.html" };
            } else {
                $scope.showBranchPopup = true;
                $scope.dynamicPopoverBranch = { templateUrl: "ChooseDoctorBranchPopUp.html" };
            }

        }




        /*}*/

        datapersistanceFactory.set("JWTToken", data.Token);
        datapersistanceFactory.set("USerLoginTime", new Date());


        datapersistanceFactory.set("masterQuestions", data.MasterQuestions);
        $scope.ParentHospitalID = data.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID || 0;

        eHnoteSettingsDataService.GetOrganizationSettings({ "ParentOrganizationId": $scope.ParentHospitalID }).then(function (resp) {
            eHnoteSettingsDataService.RestructureOrganizationSettings(resp.data.SettingDetails, resp.data);
        }, function (err) {
            console.log(err);
            alertify.error("Getting oganization settings failed");
        });

        $scope.GetAppointmentTypes = function () {
            eHnotePatientAddressDataServices.getAppointmentTypes(onTypesSuccess, onTypesFailed);
            function onTypesSuccess(data) {
                $scope.appointmentTypes = data || [];
                loginCookieFactory.set("masteAppointmentTypes", $scope.appointmentTypes);
            }
            function onTypesFailed(err) {
                console.log(err);
            }
        };



        $scope.GetPrintSettings = function (ParentHospitalID, SubOrganizationId, DoctorID) {
            var reqObj = { "SubOrganizationId": SubOrganizationId, "BranchId": 0 };
            var printsettingObj = {
                "ParentOrganizationId": ParentHospitalID,
                "SubOrganizationId": SubOrganizationId,
                "BranchId": 0,
                "UserId": DoctorID,
                "Printdetails": printdetailsArray,
                "PrintHeaderImgUrl": "",
                "PrintHeaderImgblob": "",
                "PrintHeaderImgAlignment": "center",
                "PrintImageHeaderUrl": "",
                "PrintImageHeaderBlob": "",
                "PrintImageFooterUrl": "",
                "PrintImageFooterBlob": "",
                "PrintOpticalHeaderImgUrl": "",
                "PrintOpticalHeaderImgBlob": "",
                "PrintOpticalFooterImgUrl": "",
                "PrintOpticalFooterImgBlob": "",
                "PrintPharmacyHeaderImgUrl": "",
                "PrintPharmacyHeaderImgBlob": "",
                "PrintPharmacyFooterImgUrl": "",
                "PrintPharmacyFooterImgBlob": "",
                "Language": 1

            };

            loginCookieFactory.set("printSettingData", printsettingObj);
            eHnoteSettingsDataService.GetPrintSettings(reqObj).success(function (response) {
                if (response.status !== "Failure") {

                    if (Object.keys(response.data).length === 0) {

                    } else {
                        $scope.printsettingObj = response.data;

                        $scope.printsettingObj.PrintHeaderImgblob = $scope.printsettingObj.PrintHeaderImgblob || "";
                        $scope.printsettingObj.PrintHeaderImgAlignment = $scope.printsettingObj.PrintHeaderImgAlignment || "center";
                        if ($scope.printsettingObj.Printdetails !== undefined) {

                            var Index = $scope.printsettingObj.Printdetails.findIndex(record => record.PageName === "Consultation Entry Form");
                            if (Index > -1) {
                                $scope.printsettingObj.Printdetails.splice(Index, 1);
                            }
                        }

                        if ($scope.printsettingObj.PrintHeaderImgUrl !== "") {
                            $scope.toDataURL($scope.printsettingObj.PrintHeaderImgUrl, function (dataURL) {

                                $scope.printsettingObj.PrintHeaderImgblob = dataURL;

                                $scope.RestructurePrintSettings(dataURL);

                            });
                        } else {
                            $scope.RestructurePrintSettings();
                        }


                        if ($scope.printsettingObj.PrintImageHeaderUrl !== "") {
                            $scope.toDataURL($scope.printsettingObj.PrintImageHeaderUrl, function (dataURL) {
                                $scope.printsettingObj.PrintImageHeaderBlob = dataURL;
                                loginCookieFactory.set("printSettingData", $scope.printsettingObj);
                            });
                        }
                        if ($scope.printsettingObj.PrintImageFooterUrl !== "") {
                            $scope.toDataURL($scope.printsettingObj.PrintImageFooterUrl, function (dataURL) {
                                $scope.printsettingObj.PrintImageFooterBlob = dataURL;
                                loginCookieFactory.set("printSettingData", $scope.printsettingObj);
                            });
                        }

                        if ($scope.printsettingObj.PrintOpticalHeaderImgUrl !== "") {
                            $scope.toDataURL($scope.printsettingObj.PrintOpticalHeaderImgUrl, function (dataURL) {
                                $scope.printsettingObj.PrintOpticalHeaderImgBlob = dataURL;
                                loginCookieFactory.set("printSettingData", $scope.printsettingObj);
                            });
                        }
                        if ($scope.printsettingObj.PrintOpticalFooterImgUrl !== "") {
                            $scope.toDataURL($scope.printsettingObj.PrintOpticalFooterImgUrl, function (dataURL) {
                                $scope.printsettingObj.PrintOpticalFooterImgBlob = dataURL;
                                loginCookieFactory.set("printSettingData", $scope.printsettingObj);
                            });
                        }

                        if ($scope.printsettingObj.PrintPharmacyHeaderImgUrl !== "") {
                            $scope.toDataURL($scope.printsettingObj.PrintPharmacyHeaderImgUrl, function (dataURL) {
                                $scope.printsettingObj.PrintPharmacyHeaderImgBlob = dataURL;
                                loginCookieFactory.set("printSettingData", $scope.printsettingObj);
                            });
                        }
                        if ($scope.printsettingObj.PrintPharmacyFooterImgUrl !== "") {
                            $scope.toDataURL($scope.printsettingObj.PrintPharmacyFooterImgUrl, function (dataURL) {
                                $scope.printsettingObj.PrintPharmacyFooterImgBlob = dataURL;
                                loginCookieFactory.set("printSettingData", $scope.printsettingObj);
                            });
                        }

                    }






                }
            }).error(function (error) {
                console.log("error log print");
            });
        };


        $scope.GetPrintSettings(data.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID, data.UserAddress[0].ExtDetails.HospitalInfo.SubHospitalID, data.User[0].DoctorID);

        $scope.GetDoctorComments = function () {
            eHnoteDiagnosisDataServices.GetDoctorComments().then(function (resp) {
                $scope.DoctorCommentList = resp.data || [];
                loginCookieFactory.set("masterDoctorComments", $scope.DoctorCommentList);
            });
        };


        $scope.GetOptomComments = function () {
            eHnoteDiagnosisDataServices.GetOptomComments().then(function (resp) {
                $scope.OptomList = resp.data || [];
                loginCookieFactory.set("masterOptomComments", $scope.OptomList);
            });
        };
        $scope.GetLanguage = function () {
            eHnoteSettingsDataService.GetLanguage()
                .success(function (data) {
                    $scope.AllLanguageData = data || [];
                    loginCookieFactory.set("masterLanguageList", $scope.AllLanguageData);
                })
                .error(function (error) {
                    alertify.log("Check internet connectivity");
                });
        }
        $scope.GetAppointmentTypes();
        //$scope.GetDoctorComments();
        //$scope.GetOptomComments();
        $scope.GetLanguage();
        /*}*/

        //else {
        //    alertify.error("You Can't Login Into These Appilication");
        //}

    }


    $scope.GetPrintSettings = function (ParentHospitalID, SubOrganizationId, DoctorID) {
        var reqObj = { "SubOrganizationId": SubOrganizationId, "BranchId": 0 };
        var printsettingObj = {
            "ParentOrganizationId": ParentHospitalID,
            "SubOrganizationId": SubOrganizationId,
            "BranchId": 0,
            "UserId": DoctorID,
            "Printdetails": printdetailsArray,
            "PrintHeaderImgUrl": "",
            "PrintHeaderImgblob": "",
            "PrintHeaderImgAlignment": "center",
            "PrintImageHeaderUrl": "",
            "PrintImageHeaderBlob": "",
            "PrintImageFooterUrl": "",
            "PrintImageFooterBlob": "",
            "PrintOpticalHeaderImgUrl": "",
            "PrintOpticalHeaderImgBlob": "",
            "PrintOpticalFooterImgUrl": "",
            "PrintOpticalFooterImgBlob": "",
            "PrintPharmacyHeaderImgUrl": "",
            "PrintPharmacyHeaderImgBlob": "",
            "PrintPharmacyFooterImgUrl": "",
            "PrintPharmacyFooterImgBlob": "",
            "Language": 1
        };

        loginCookieFactory.set("printSettingData", printsettingObj);
        eHnoteSettingsDataService.GetPrintSettings(reqObj).success(function (response) {
            if (response.status !== "Failure") {

                if (Object.keys(response.data).length === 0) {

                } else {
                    $scope.printsettingObj = response.data;


                    $scope.printsettingObj.PrintHeaderImgblob = $scope.printsettingObj.PrintHeaderImgblob || "";
                    $scope.printsettingObj.PrintHeaderImgAlignment = $scope.printsettingObj.PrintHeaderImgAlignment || "center";

                    if ($scope.printsettingObj.Printdetails !== undefined) {
                        var Index = $scope.printsettingObj.Printdetails.findIndex(record => record.PageName === "Consultation Entry Form");
                        if (Index > -1) {
                            $scope.printsettingObj.Printdetails.splice(Index, 1);
                        }
                    }

                    if ($scope.printsettingObj.PrintHeaderImgUrl !== "") {
                        $scope.toDataURL($scope.printsettingObj.PrintHeaderImgUrl, function (dataURL) {

                            $scope.printsettingObj.PrintHeaderImgblob = dataURL;

                            $scope.RestructurePrintSettings(dataURL);

                        });
                    }
                    else {

                        $scope.RestructurePrintSettings();



                    }

                    if ($scope.printsettingObj.PrintImageHeaderUrl !== "") {
                        $scope.toDataURL($scope.printsettingObj.PrintImageHeaderUrl, function (dataURL) {
                            $scope.printsettingObj.PrintImageHeaderBlob = dataURL;
                            loginCookieFactory.set("printSettingData", $scope.printsettingObj);
                        });
                    }
                    if ($scope.printsettingObj.PrintImageFooterUrl !== "") {
                        $scope.toDataURL($scope.printsettingObj.PrintImageFooterUrl, function (dataURL) {
                            $scope.printsettingObj.PrintImageFooterBlob = dataURL;
                            loginCookieFactory.set("printSettingData", $scope.printsettingObj);
                        });
                    }


                    if ($scope.printsettingObj.PrintOpticalHeaderImgUrl !== "") {
                        $scope.toDataURL($scope.printsettingObj.PrintOpticalHeaderImgUrl, function (dataURL) {
                            $scope.printsettingObj.PrintOpticalHeaderImgBlob = dataURL;
                            loginCookieFactory.set("printSettingData", $scope.printsettingObj);
                        });
                    }

                    if ($scope.printsettingObj.PrintOpticalFooterImgUrl !== "") {
                        $scope.toDataURL($scope.printsettingObj.PrintOpticalFooterImgUrl, function (dataURL) {
                            $scope.printsettingObj.PrintOpticalFooterImgBlob = dataURL;
                            loginCookieFactory.set("printSettingData", $scope.printsettingObj);
                        });
                    }

                    if ($scope.printsettingObj.PrintPharmacyHeaderImgUrl !== "") {
                        $scope.toDataURL($scope.printsettingObj.PrintPharmacyHeaderImgUrl, function (dataURL) {
                            $scope.printsettingObj.PrintPharmacyHeaderImgBlob = dataURL;
                            loginCookieFactory.set("printSettingData", $scope.printsettingObj);
                        });
                    }
                    if ($scope.printsettingObj.PrintPharmacyFooterImgUrl !== "") {
                        $scope.toDataURL($scope.printsettingObj.PrintPharmacyFooterImgUrl, function (dataURL) {
                            $scope.printsettingObj.PrintPharmacyFooterImgBlob = dataURL;
                            loginCookieFactory.set("printSettingData", $scope.printsettingObj);
                        });
                    }

                }
            }
        }).error(function (error) {
            console.log("error log print");
        });
    };


    $scope.RestructurePrintSettings = function (dataURL) {
        $scope.printsettingObj.PrintHeaderImgblob = dataURL || "";
        //var printarray = [];


        angular.forEach(printdetailsArray, function (mitem) {
            if ($scope.printsettingObj.Printdetails === undefined) {
                $scope.printsettingObj.Printdetails = [];
                $scope.printsettingObj.Printdetails.push(mitem);
            } else {
                var TempPageArray = $filter("filter")($scope.printsettingObj.Printdetails, { "PageName": mitem.PageName }, true);
                if (TempPageArray.length === 0) {
                    $scope.printsettingObj.Printdetails.push(angular.copy(mitem));
                }
            }
        });


        loginCookieFactory.set("printSettingData", $scope.printsettingObj);
    };



    $scope.ShowPopOver = function () {
        $scope.showBranchPopup = true;
        $scope.showSubOrganizationPopUp = false;
        $scope.showRoleGroupPopUp = false;
    };
    $scope.ShowPopOverRole = function () {
        $scope.showRoleGroupPopUp = true;
        $scope.showSubOrganizationPopUp = false;
        $scope.showBranchPopup = false;
        // $scope.dynamicPopoverRole = { templateUrl: "ChooseRoleGroupPopUp.html" };
        $scope.dynamicPopover = { templateUrl: "ChooseRoleGroupPopUp.html" };
    };

    $scope.ShowPopOverRoomSelection = function () {
        $scope.showUserBranchRoomsdiv = true;
        $scope.showUserBranchRoomsPopUp = true;
        $scope.showSubOrganizationPopUp = false;
        $scope.showBranchPopup = false;
        // $scope.dynamicPopoverRole = { templateUrl: "ChooseRoleGroupPopUp.html" };
        $scope.dynamicPopover = { templateUrl: "ChooseBranchRoomPopUp.html" };
    };

    $scope.ShowPopOverSub = function () {
        $scope.showSubOrganizationPopUp = true;
        $scope.showBranchPopup = false;
        $scope.showRoleGroupPopUp = false;
    };

    $scope.navtoShowOTPScreen = function () {

        $scope.TwoWayVerifaction = $scope.doctorBranchList.User[0].IsTwoWayVarificationInd || false;
        if ($scope.TwoWayVerifaction) {
            if ($scope.doctorBranchList.User != undefined) {
                $scope.Email = $scope.doctorBranchList.User[0].UserEmailId || "";
            }
            $scope.tryAnotherWay = true;
            $scope.showMFAAuthenticationScreen = false;
            $scope.TwoWayVerifaction = false;
            $scope.ShowLoginScreen = false;
            $scope.showListofbranchrole = false;
            $scope.moveBackScreen === 'OTPauth'
            //$scope.TwoWayVerifactionOTPGenarating();
            //$scope.startOtpTimer();
        } else {
            alertify.error("SMS Verification not enabled for this User,please contact administrator");
            return false;
        }
    }


    $scope.userbranchRoomsArray = [];
    $scope.ChangeUserBranchRoom = function (item) {
        $scope.selectedUserBranchRoomObj = item;

        $scope.showUserBranchRoomsPopUp = false;
        console.log($scope.DoctorBranchName);

        var params = {
            "UserId": $scope.doctorBranchList.User[0].DoctorID,
            "BranchId": $scope.DoctorBranchName.ClinicId,
            "RoomId": item.RoomId,
            "IsDefaultInd": "N"
        }

        eHnoteSettingsDataService.updateUserBranchActiveRoom(params).success(function (data) {
            console.log(data);

            if (data.Status === "Success") {
                $scope.DoctorBranchName.ActiveRoomId = item.RoomId;
                $scope.DoctorBranchName.ActiveRoomName = item.RoomName;
            } else {

            }
        }).error(function (error) {

        });

    };

    function parseTime(timeString) {
        const timePattern = /^(\d{1,2}):(\d{2})\s(am|pm)$/i;
        const match = timeString.match(timePattern);

        if (match) {
            let hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            const meridiem = match[3].toLowerCase();

            if (hours === 12) {
                hours = meridiem === 'am' ? 0 : 12;
            } else {
                hours += meridiem === 'pm' ? 12 : 0;
            }

            const date = new Date();
            date.setHours(hours);
            date.setMinutes(minutes);
            date.setSeconds(0);
            date.setMilliseconds(0);

            return date;
        } else {
            return null;
        }
    }
    $scope.ChangeDoctorBranch = function (item) {
        $scope.RoleBranchName = "";

        $scope.DoctorBranchName = item;
        $scope.DoctorBranchName.UserBranchRoomsArray = [];
        var UserId = $scope.doctorBranchList.User[0].DoctorID;
        var currentip = $scope.currentip.toString();

        console.log(currentip);

        //if (item.TimeOut != 0) {
        //    SessionTimeOut = item.TimeOut;
        //} else {
        //    SessionTimeOut = 30;
        //}



        if ($scope.currentip.length < 10) {
            currentip = null;
        }


        eHnoteMainAppointmentService.getUserBranchAccessDetailsById(UserId, item.ClinicId, currentip).then(function (resp) {

            if (resp.data.status === "Success") {
                if (resp.data.UseAccessDetails.length > 0) {
                    $scope.doctorBranchList.UserBranchRoles = resp.data.UseAccessDetails;
                    $scope.DoctorBranchName.UserBranchRoles = resp.data.UseAccessDetails;
                    $scope.Rolelist = resp.data.UseAccessDetails || [];
                    $scope.userbranchRoomsArray = resp.data.UserBranchRooms || [];
                    $scope.DoctorBranchName.UserBranchRoomsArray = resp.data.UserBranchRooms || [];
                    var defaultTabId = $scope.DoctorBranchName.UserBranchRoles[0].DefaultTabId || 1;
                    if (resp.data.EmergencyUseAccessDetails[0].IsEmergencyRightActiveInd) {
                        var TodayDate = $filter('date')(new Date(), 'yyyy-MM-dd');
                        if (TodayDate == resp.data.EmergencyUseAccessDetails[0].EmergencyAccessRightsDate) {
                            var currentTime = new Date();
                            var t = $filter('date')(new Date(currentTime), 'HH:mm a');
                            if (t == resp.data.EmergencyUseAccessDetails[0].EmergencyAccessRightsStratTime || (t > resp.data.EmergencyUseAccessDetails[0].EmergencyAccessRightsStratTime && t < resp.data.EmergencyUseAccessDetails[0].EmergencyAccessRightsEndTime)) {
                                $scope.doctorBranchList.UserBranchRoles = resp.data.EmergencyUseAccessDetails;
                                $scope.DoctorBranchName.UserBranchRoles = resp.data.EmergencyUseAccessDetails;
                                $scope.Rolelist = resp.data.EmergencyUseAccessDetails || [];
                                $scope.userbranchRoomsArray = resp.data.UserBranchRooms || [];
                                $scope.DoctorBranchName.UserBranchRoomsArray = resp.data.UserBranchRooms || [];
                                var defaultTabId = $scope.DoctorBranchName.UserBranchRoles[0].DefaultTabId || 1;
                                if ((t < resp.data.EmergencyUseAccessDetails[0].EmergencyAccessRightsStratTime) || (t == resp.data.EmergencyUseAccessDetails[0].EmergencyAccessRightsStratTime)) {
                                    $scope.startTime = resp.data.EmergencyUseAccessDetails[0].EmergencyAccessRightsStratTime;
                                }
                                else if (t > resp.data.EmergencyUseAccessDetails[0].EmergencyAccessRightsStratTime && t < resp.data.EmergencyUseAccessDetails[0].EmergencyAccessRightsEndTime) {
                                    $scope.startTime = t;
                                }
                                else {
                                    $scope.startTime = resp.data.EmergencyUseAccessDetails[0].EmergencyAccessRightsStratTime;
                                }
                                $scope.endTime = resp.data.EmergencyUseAccessDetails[0].EmergencyAccessRightsEndTime;

                                const startTime = parseTime($scope.startTime);
                                const endTime = parseTime($scope.endTime);
                                if (startTime === null || endTime === null) {
                                    $scope.timeDifference = null;
                                } else {
                                    const difference = endTime.getTime() - startTime.getTime();
                                    $scope.timeDifferenceInMillisec = Math.abs(difference);
                                }
                                if ($scope.timeDifferenceInMillisec != 0 || $scope.timeDifferenceInMillisec != 'NaN') {
                                    var AlertForExpiredEmergencyAccessRightsTime = $scope.timeDifferenceInMillisec - 300000;
                                    var AlertforEmergencyAccessRightsLogOutTime = $scope.timeDifferenceInMillisec - 5000;
                                }

                                var EmergencyAccessRightsDate = resp.data.EmergencyUseAccessDetails[0].EmergencyAccessRightsDate;
                                var EmergencyAccessRightsStratTime = resp.data.EmergencyUseAccessDetails[0].EmergencyAccessRightsStratTime;
                                var EmergencyAccessRightsEndTime = resp.data.EmergencyUseAccessDetails[0].EmergencyAccessRightsEndTime;
                                var IsEmergencyRightActiveInd = resp.data.EmergencyUseAccessDetails[0].IsEmergencyRightActiveInd;
                                var EmergencyAccessSetObj = {
                                    "EmergencyAccessRightsDate": EmergencyAccessRightsDate || "",
                                    "EmergencyAccessRightsStratTime": EmergencyAccessRightsStratTime || "",
                                    "EmergencyAccessRightsEndTime": EmergencyAccessRightsEndTime || "",
                                    "IsEmergencyRightActiveInd": IsEmergencyRightActiveInd || "",
                                    "IsActive": false || "",
                                    "AlertForExpiredEmergencyAccessRightsTime": AlertForExpiredEmergencyAccessRightsTime || "",
                                    "AlertforEmergencyAccessRightsLogOutTime": AlertforEmergencyAccessRightsLogOutTime || "",
                                    "ExpiredEmergencyAccessRightsTime": $scope.timeDifferenceInMillisec || ""
                                }
                                datapersistanceFactory.set("EmergencyAccessSetObj", EmergencyAccessSetObj);

                            }
                        }
                    }

                    eHnoteUserDataService.EvaluateUserAccessRights($scope.DoctorBranchName.UserBranchRoles[0], defaultTabId);
                    console.log($scope.Rolelist);
                    if ($scope.Rolelist.length > 1) {
                        $scope.showRoleGroupPopUp = true;
                        $scope.showRoleGroupList = true;
                    }
                    console.log(item.IsEnableQueueManagement);
                    if (item.IsEnableQueueManagement) {
                        if ($scope.userbranchRoomsArray.length > 0) {
                            var filteresRoomsArray = $filter("filter")($scope.userbranchRoomsArray, { "IsDefaultRoom": true });
                            filteresRoomsArray = filteresRoomsArray || [];
                            console.log(filteresRoomsArray);
                            if (filteresRoomsArray.length > 0) {
                                $scope.showUserBranchRoomsdiv = true;
                                $scope.ChangeUserBranchRoom(filteresRoomsArray[0]);
                            } else {
                                $scope.showUserBranchRoomsdiv = true;
                                $scope.showUserBranchRoomsPopUp = true;
                                $scope.dynamicPopover = { templateUrl: "ChooseBranchRoomPopUp.html" };
                            }

                        } else {
                            $scope.showUserBranchRoomsdiv = false;
                        }
                    }
                }
                $scope.DoctorBranchName.UserBranchRoomsArray = resp.data.UserBranchRooms || [];
                $scope.BranchSettingsData = {
                    "HospitalID": item.ClinicId,
                    "UserId": UserId,
                    "IsRestrictAppointmentSlot": item.IsRestrictAppointmentSlot ? true : false,
                    "IsEnableBillinAppointment": item.IsEnableBillinAppointment ? true : false,
                    "FeedBackURL": item.FeedBackURL || "",
                    "NavigationURL": item.NavigationURL || "",
                    "IsPrintInsturctions": item.IsPrintInsturctions || "",
                    "IsSurgeryCostRestricted": item.IsSurgeryCostRestricted ? true : false,
                    "IsAllowUserStockUsage": item.IsAllowUserStockUsage ? true : false,
                    "IsForumApptRequired": item.IsForumApptRequired ? true : false,
                    "IsEnableQueueManagement": item.IsEnableQueueManagement ? true : false,
                    "CheckInAvgTime": item.CheckInAvgTime,
                    "AgingByType": item.AgingByType,
                    "StatementDuration": item.StatamentDuration || 'ServiceDate',
                    "IsShowEmptyASCChecklist": item.IsShowEmptyASCChecklist ? true : false,
                };
                datapersistanceFactory.set("BranchSettingsData", $scope.BranchSettingsData);

                if ($scope.doctorBranchList.UserAddress.length === 1) {
                    if ($scope.DoctorBranchName !== '') {
                        $scope.ContinueToBranchLogin($scope.DoctorBranchName, $scope.RoleBranchName);
                    }
                }
                if (resp.data.TelnyxSmsSenderMobileNo != "") {
                    let telnyxobj = {
                        "TelnyxSmsSenderMobileNo": resp.data.TelnyxSmsSenderMobileNo || "",
                        "ParentOrganizationId": resp.data.ParentOrganizationId || 0
                    }
                    datapersistanceFactory.set("TelnyxSmsInfoObj", telnyxobj);
                }
            }
            else {
                // alertify.error("IP not matched,you dont have access to continue");
                alertify.error("IP Address Unmatched; Authorization Failed!");
                datapersistanceFactory.clearAll();
                localStorageFactory.clearAll();
                $scope.ShowLoginScreen = true;
                $scope.showBranchPopup = false;
                if ($window.location.host == "ioj.ehnote.com") {
                    $window.location.href = "https://portal.ehnote.com/#/login";
                } else if ($window.location.host == 'insts.ehnote.com') {
                    $window.location.href = "https://stage.ehnote.com/#/login";
                } else {
                    $location.path("/login");
                }
                return false;
            }
        });
        $scope.showBranchPopup = false;
    };
    $scope.ChangeRoleGroup = function (item) {
        $scope.RoleBranchName = item;
        $scope.showRoleGroupPopUp = false;
    };






    $scope.ChangeSubOrganization = function (item) {
        $scope.DoctorBranchName = "";

        $scope.SubOrganizationName = item.SubOrganizationName;
        $scope.SubOrganizationId = item.SubOrganizationId;
        $scope.logininfoObj.SubOrganizationId = item.SubOrganizationId;
        $scope.showSubOrganizationPopUp = false;
        $scope.newAllBranchesData = [];
        var UserId = $scope.doctorBranchList.User[0].DoctorID;


        eHnoteMainAppointmentService.getUserBranchAddressById(item.SubOrganizationId, UserId).then(function (resp) {

            if (resp.data != undefined) {
                if (resp.data.UserAddress.length > 0) {
                    $scope.doctorBranchList.UserAddress = [];
                    $scope.doctorBranchList.UserAddress = resp.data.UserAddress;
                }
            }
            //commented by durga as after login success we are calling this service again no need to call this.
            /*    $scope.GetPrintSettings(resp.data.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID, item.SubOrganizationId, UserId);*/
            $scope.showBranchList = true;
            $scope.showBranchPopup = true;
            $scope.dynamicPopoverBranch = { templateUrl: "ChooseDoctorBranchPopUp.html" };
        });



        //$scope.doctorBranchList.UserAddress
    };

    function getLocation() {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }
    var position = null;

    //function getLocation1() {
    //    if (navigator.geolocation1 && !position) {
    //        navigator.geolocation1.watchPosition(function (currentPosition) {
    //            position = currentPosition;
    //        }, function (error) {
    //            alert(error)
    //        });
    //    }
    //};

    //function showPosition() {

    //    if (position) {
    //        x.innerHTML = "Latitude: " + position.coords.latitude +
    //            "<br>Longitude: " + position.coords.longitude;
    //    } else {
    //        x.innerHTML = "Geolocation is not supported or authorized.";
    //    }
    //};



    $scope.currentip = "";


    $scope.getIPAddress = function () {
        eHnotePatientAddressDataServices.getCurrentIp(onTypesSuccess, onTypesFailed);
        function onTypesSuccess(resp) {
            $scope.currentip = "";
            if (resp !== undefined) {
                $scope.currentip = resp;
            }
        }
        function onTypesFailed(err) {
            console.log(err);
        }
    }

    $scope.getIPAddress();
    $scope.ContinueToBranchLogin = function (DoctorBranchName, RoleBranchName) {
        $scope.emptyScreen = true;

        var index = $scope.doctorBranchList.UserAddress.indexOf(DoctorBranchName);
        $scope.doctorBranchList.UserAddress.splice(index, 1);
        $scope.doctorBranchList.UserAddress.unshift(DoctorBranchName);

        $scope.doctorBranchList.User[0].RoleName = DoctorBranchName.UserBranchRoles[0].RoleName;
        $scope.doctorBranchList.User[0].RoleId = DoctorBranchName.UserBranchRoles[0].RoleId;
        $scope.doctorBranchList.User[0].GroupId = DoctorBranchName.UserBranchRoles[0].GroupId;
        $scope.doctorBranchList.User[0].UseAccessDetails = DoctorBranchName.UserBranchRoles[0].AccessDetails;

        $scope.doctorBranchList.UserAddress[0].ExtDetails.GroupID = DoctorBranchName.UserBranchRoles[0].GroupId;
        $scope.doctorBranchList.UserAddress[0].ExtDetails.RoleName = DoctorBranchName.UserBranchRoles[0].RoleName;
        $scope.doctorBranchList.UserAddress[0].ExtDetails.RoleID = DoctorBranchName.UserBranchRoles[0].RoleId;
        $scope.doctorBranchList.UserAddress[0].ExtDetails.GroupName = DoctorBranchName.UserBranchRoles[0].GroupName;
        eHnoteUserDataService.EvaluateUserInfo($scope.doctorBranchList);
        $scope.ContinueLogin($scope.doctorBranchList);

    };


    $scope.LogObj = {
        "UserId": null,
        "OrganizationId": null,
        "AppointmentId": null,
        "PatientId": null,
        "LogArray": [],
    }
    $scope.AddAuditLog = function (selectedItem) {
        eHnoteSurgeryService.AddAuditLog($scope.LogObj).then(function (resp) {
            if (resp.data.status == "Success") {
                console.log('Login');
            }
        });
    }

    $scope.ContinueLogin = function (data, OrganizationTypeId) {


        $rootScope.$broadcast("loader_show");

        if (data.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
            eHnoteMasterDataService.addUserPreferences(data.UserAddress[0].ExtDetails.HospitalInfo);
        }
        $scope.loggedinStatus = true;
        console.log(data.UserAddress[0]);
     


        
        $scope.IsEnabledForParentOrg = data.UserAddress[0].IsTelnyxCallingEnabled || false;
        console.log($scope.IsEnabledForParentOrg);
        if ($scope.IsEnabledForParentOrg) {
            
            eHnoteMainAppointmentService.GetTelnyxUserCredentialsByBranchId(data.User[0].DoctorID, data.UserAddress[0].ExtDetails.HospitalInfo.HospitalID).then(function (resp) {
                console.log(resp);

                // The credential is ALWAYS stored when it exists, active or not, so
                // EhnoteTelnyxCallingCtrl keeps running and its heartbeat can bring
                // the call bar back the moment an admin re-activates the user. Only
                // telnyxCredentialActive decides what is visible - gating the storage
                // itself would strand a user who happened to be inactive at login, with
                // no way back except logging out and in again.
                $rootScope.telnyxCredentialActive = (resp.data.IsActive !== false);

                if (resp.data.Status == "Success") {
                    console.log(resp.data.UserCredentialId);
                    var newtelynxUserLoginDetailsObj = {
                        "JToken": $scope.logininfoObj.JToken,
                        "UserId": $scope.logininfoObj.UserId,
                        "loggedinStatus": $scope.logininfoObj.UserId,
                        "LoginTab": $scope.logininfoObj.LoginTab,
                        "LoginBranchId": $scope.logininfoObj.LoginBranchId,
                        "UserCredentialId": resp.data.UserCredentialId,
                        "FromNumber": resp.data.TelePhoneNumber,
                        "RoleId": $scope.logininfoObj.RoleID
                    }
                    eHnoteLoginStatusService.addTelynxUserLoginDetails(newtelynxUserLoginDetailsObj);
                }

                $scope.continuetoLandingScreen(data, OrganizationTypeId);
            }, function (err) {
                console.log(err);
                alertify.error("Getting oganization settings failed");
            });

        } else {
            // calling is off for the whole org - nothing is deactivated, so the
            // Communication Logs tab behaves exactly as it did before Telnyx
            $rootScope.telnyxCredentialActive = true;
            $scope.continuetoLandingScreen(data, OrganizationTypeId);
        }



    };

    $scope.continuetoLandingScreen = function (data, OrganizationTypeId) {
        var isUserValidate = eHnoteUserDataService.EvaluateUserInfo(data);


        if (isUserValidate) {
            var doctorinfo = eHnoteMasterDataService.getUserInfo();
            $scope.logininfoObj.LoginBranchId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID || null;
            $scope.LogObj = {
                "UserId": doctorinfo.doctorid || null,
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID || null,
                "AppointmentId": null,
                "PatientId": null,
                "LogArray": [],
            }
            let ip = $scope.currentip || '';
            let platform = "WinNT" || '';

            let description = (ip != '' ? ", IP provided:" + ip + " " + platform : "");

            let ActionDescription = `Successful login from Web ${description}`;

            let logobj = {
                "LogId": 0,
                "ActionType": "Login",
                "OldActionDescription": "",
                "NewActionDescription": ActionDescription,
                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            };
            $scope.LogObj.LogArray.push(logobj);



            $scope.UserSettingObject = "";
            $scope.UserSettingObject = {
                "DiagnosisListSettings": [],
                "TreatmentListSettings": [],
                "MedicinesListSettings": [],
                "PrinterHeaderSettings": [],
                "CommunicationsSettings": [],
                "ComplaintsListSettings": [],
                "ObservationListSettings": [],
                "ClinicalNotesListSettings": [],
                "IsFreeFollowup": false
            };
            $scope.DeafultDiagnosisSetting = [
                {
                    "Id": 1,
                    "Name": "All Diagnosis",
                    "Type": "G",
                    "Status": true
                },
                {
                    "Id": 2,
                    "Name": "Organization Diagnosis",
                    "Type": "O",
                    "Status": false
                },
                {
                    "Id": 3,
                    "Name": "My Diagnosis",
                    "Type": "U",
                    "Status": false
                }
            ];
            $scope.DeafultTreatmentSetting = [
                {
                    "Id": 1,
                    "Name": "All Treatments",
                    "Type": "G",
                    "Status": true
                },
                {
                    "Id": 2,
                    "Name": "Organization Treatments",
                    "Type": "O",
                    "Status": false
                },
                {
                    "Id": 3,
                    "Name": "My Treatments",
                    "Type": "U",
                    "Status": false
                }
            ];
            $scope.DeafultMedicineSetting = [
                {
                    "Id": 1,
                    "Name": "All Medicines",
                    "Type": "G",
                    "Status": true
                },
                {
                    "Id": 2,
                    "Name": "Organization Medicines",
                    "Type": "O",
                    "Status": false
                },
                {
                    "Id": 3,
                    "Name": "My Medicines",
                    "Type": "U",
                    "Status": false
                }
            ];
            $scope.DefaultCommunicationSettings = [
                {
                    "Mode": "doctor",
                    "SmsSettingsObj": {
                        "Appointment": false,
                        "Billing": false,
                        "Consultation": false,
                        "Prescription": false,
                        "SurgeryAppointment": false
                    },
                    "EmailSettingObj": {
                        "Appointment": false,
                        "Billing": false,
                        "Consultation": false,
                        "Prescription": false,
                        "SurgeryAppointment": false
                    }
                },
                {
                    "Mode": "patient",
                    "SmsSettingsObj": {
                        "Appointment": false,
                        "Billing": false,
                        "Consultation": false,
                        "Prescription": false,
                        "SurgeryAppointment": false
                    },
                    "EmailSettingObj": {
                        "Appointment": false,
                        "Billing": false,
                        "Consultation": false,
                        "Prescription": false,
                        "SurgeryAppointment": false
                    }
                }
            ];
            $scope.DefaultComplaintsListSettings = [
                {
                    "Id": 1,
                    "Name": "Organization Complaints",
                    "Type": "O",
                    "Status": true
                },
                {
                    "Id": 2,
                    "Name": "My Complaints",
                    "Type": "U",
                    "Status": false
                }
            ];
            $scope.DefaultObservationListSettings = [
                {
                    "Id": 1,
                    "Name": "Organization Observation Notes",
                    "Type": "O",
                    "Status": true
                },
                {
                    "Id": 2,
                    "Name": "My Observation Notes",
                    "Type": "U",
                    "Status": false
                }
            ];
            $scope.DefaultInvTemplateSettings = [{ "TemplateId": 0 }];
            $scope.DefaultClinicalNotesListSettings = [
                {
                    "Id": 1,
                    "Name": "Organization Clinical Notes",
                    "Type": "O",
                    "Status": true
                },
                {
                    "Id": 2,
                    "Name": "My Clinical Notes",
                    "Type": "U",
                    "Status": false
                }
            ];
            $scope.DefaultBillingSettings = [
                {
                    "Id": 1,
                    "Name": "Discount",
                    "Status": false
                },
                {
                    "Id": 2,
                    "Name": "GST",
                    "Status": false
                }
            ];

            $scope.DefaultIsFreeFollowup = false;

            $scope.UserSettingObject.DiagnosisListSettings = $scope.DeafultDiagnosisSetting;
            $scope.UserSettingObject.TreatmentListSettings = $scope.DeafultTreatmentSetting;
            $scope.UserSettingObject.MedicinesListSettings = $scope.DeafultMedicineSetting;
            $scope.UserSettingObject.CommunicationsSettings = $scope.DefaultCommunicationSettings;
            $scope.UserSettingObject.ComplaintsListSettings = $scope.DefaultComplaintsListSettings;
            $scope.UserSettingObject.ObservationListSettings = $scope.DefaultObservationListSettings;
            $scope.UserSettingObject.ClinicalNotesListSettings = $scope.DefaultClinicalNotesListSettings;
            $scope.UserSettingObject.DefaultInvTemplateSettings = $scope.DefaultInvTemplateSettings;
            $scope.UserSettingObject.DefaultBillingSettings = $scope.DefaultBillingSettings;
            $scope.UserSettingObject.IsFreeFollowup = $scope.DefaultIsFreeFollowup;

            data.SettingsData = data.SettingsData || {};

            if (angular.equals(data.SettingsData, {})) {
                data.SettingsData.CommunicationsSettings = [];
                data.SettingsData.ComplaintsListSettings = [];
                data.SettingsData.ObservationListSettings = [];
                data.SettingsData.ClinicalNotesListSettings = [];
                data.SettingsData.DefaultInvTemplateSettings = [];
                data.SettingsData.DiagnosisListSettings = [];
                data.SettingsData.TreatmentListSettings = [];
                data.SettingsData.MedicinesListSettings = [];
                data.SettingsData.BillingSettings = [];
                data.SettingsData.IsFreeFollowup = false;
            }
            else {
                data.SettingsData.CommunicationsSettings = data.SettingsData.CommunicationsSettings || [];
                data.SettingsData.ComplaintsListSettings = data.SettingsData.ComplaintsListSettings || [];
                data.SettingsData.ObservationListSettings = data.SettingsData.ObservationListSettings || [];
                data.SettingsData.ClinicalNotesListSettings = data.SettingsData.ClinicalNotesListSettings || [];
                data.SettingsData.DefaultInvTemplateSettings = data.SettingsData.DefaultInvTemplateSettings || [];
                data.SettingsData.DiagnosisListSettings = data.SettingsData.DiagnosisListSettings || [];
                data.SettingsData.TreatmentListSettings = data.SettingsData.TreatmentListSettings || [];
                data.SettingsData.MedicinesListSettings = data.SettingsData.MedicinesListSettings || [];
                data.SettingsData.BillingSettings = data.SettingsData.BillingSettings || [];
                data.SettingsData.IsFreeFollowup = data.SettingsData.IsFreeFollowup;
            }



            if (data.SettingsData === null) {
                datapersistanceFactory.set("UserSettingsData", $scope.UserSettingObject);
            }
            else {
                if (data.SettingsData.CommunicationsSettings.length === 0) {
                    data.SettingsData.CommunicationsSettings = $scope.DefaultCommunicationSettings;
                }
                if (data.SettingsData.ComplaintsListSettings.length === 0) {
                    data.SettingsData.ComplaintsListSettings = $scope.DefaultComplaintsListSettings;
                }
                if (data.SettingsData.ObservationListSettings.length === 0) {
                    data.SettingsData.ObservationListSettings = $scope.DefaultObservationListSettings;
                }
                if (data.SettingsData.ClinicalNotesListSettings.length === 0) {
                    data.SettingsData.ClinicalNotesListSettings = $scope.DefaultClinicalNotesListSettings;
                }
                if (data.SettingsData.DefaultInvTemplateSettings.length === 0) {
                    data.SettingsData.DefaultInvTemplateSettings = $scope.DefaultInvTemplateSettings;
                }
                if (data.SettingsData.DiagnosisListSettings.length === 0) {
                    data.SettingsData.DiagnosisListSettings = $scope.DeafultDiagnosisSetting;
                }
                if (data.SettingsData.TreatmentListSettings.length === 0) {
                    data.SettingsData.TreatmentListSettings = $scope.DeafultTreatmentSetting;
                }
                if (data.SettingsData.MedicinesListSettings.length === 0) {
                    data.SettingsData.MedicinesListSettings = $scope.DeafultMedicineSetting;
                }
                if (data.SettingsData.BillingSettings.length === 0) {
                    data.SettingsData.BillingSettings = $scope.DefaultBillingSettings;
                }

                if (data.SettingsData.IsFreeFollowup === undefined) {
                    data.SettingsData.IsFreeFollowup = $scope.DefaultIsFreeFollowup;
                }
                datapersistanceFactory.set("UserSettingsData", data.SettingsData);
            }


            eHnoteSettingsDataService.GetUserConsultationitems(doctorinfo.doctorid, doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID).success(function (response) {

                if (response.status === "Success") {
                    $scope.AddAuditLog();
                    loginCookieFactory.set("masterDataArrays", []);


                    var masterdataObj = {
                        "masterChiefComplaintsArray": [],
                        "masterClinicalNotesArray": [],
                        "masterObservationsArray": [],
                        "masterDiagnosisArray": [],
                        "masterProceduresArray": [],
                        "masterMedicinesArray": [],
                        "masterLabTestArray": [],
                        "masterInvestigations": [],
                        "masterInvCategories": [],
                        "masterMedicineTemplatesArray": [],
                        "masterInvestigationTemplatesArray": [],
                        "PrescriptionFrequencies": [],
                        "PaymentModes": [],
                        "SettlementStatus": [],
                        "DepositStatus": [],
                        "DepositTypes": [],
                        "LeadProblems": [],
                        "masterNewLabTestArray": [],
                        "masterCurrentTreatmentArray": [],
                        "masterAllergyArray": [],
                        "masterSurgeryArray": [],
                        "masterMedicalHistoryArray": [],
                        "masterBirthHistoryArray": [],
                        "masterFamilyHistoryArray": [],
                        "masterNutritionalHistoryArray": [],
                        "masterImmunisationHistoryArray": [],
                        "masterSurgicalHistoryArray": [],
                        "masterMenstrualHistoryArray": [],
                        "masterLifestyleHistoryArray": [],
                        "masterPatientInstructionsArray": [],
                        "masterFindings": [],
                        "masterOccularHistoryArray": [],
                        "masterRelationTypes": [],
                        "masterNationalitiesList": [],
                        "masterMartialStatusList": [],
                        "masterBloodGroupList": [],
                        "masterEducationsList": [],
                        "masterOccupationsList": [],
                        "masterClaimSendViaList": [],
                        "masterClaimStatusList": [],
                        "masterInsurancePlansList": [],
                        "masterPOSCodesList": [],
                        "masterTOSCODEList": [],
                        "masterModifierList": [],
                        "masterClaimActionList": [],
                        "masterConfirmationStatusList": [],
                        "masterAppointmentStatus": [],
                        "masterBookingTypes": [],
                        "masterOperativeNoteAddendumReasons": [],
                    };
                    if (response.ClaimAction && response.ClaimAction.length > 0) {
                        masterdataObj.masterClaimActionList = response.ClaimAction;
                    }
                    if (response.ClaimSendViaList && response.ClaimSendViaList.length > 0) {
                        masterdataObj.masterClaimSendViaList = response.ClaimSendViaList;
                    }
                    if (response.ClaimStatusList && response.ClaimStatusList.length > 0) {
                        masterdataObj.masterClaimStatusList = response.ClaimStatusList;
                    }
                    if (response.InsurancePlansList && response.InsurancePlansList.length > 0) {
                        masterdataObj.masterInsurancePlansList = response.InsurancePlansList;
                    }
                    if (response.POSCodesList && response.POSCodesList.length > 0) {
                        masterdataObj.masterPOSCodesList = response.POSCodesList;
                    }
                    if (response.TOSCODEList && response.TOSCODEList.length > 0) {
                        masterdataObj.masterTOSCODEList = response.TOSCODEList;
                    }
                    if (response.ModifierList && response.ModifierList.length > 0) {
                        masterdataObj.masterModifierList = response.ModifierList;
                    }
                    if (response.RelationTypes && response.RelationTypes.length > 0) {
                        masterdataObj.masterRelationTypes = response.RelationTypes;
                    }
                    if (response.NationalitiesList && response.NationalitiesList.length > 0) {
                        masterdataObj.masterNationalitiesList = response.NationalitiesList;
                    }
                    if (response.MartialStatusList && response.MartialStatusList.length > 0) {
                        masterdataObj.masterMartialStatusList = response.MartialStatusList;
                    }
                    if (response.BloodGroupList && response.BloodGroupList.length > 0) {
                        masterdataObj.masterBloodGroupList = response.BloodGroupList;
                    }
                    if (response.EducationsList && response.EducationsList.length > 0) {
                        masterdataObj.masterEducationsList = response.EducationsList;
                    }
                    if (response.OccupationsList && response.OccupationsList.length > 0) {
                        masterdataObj.masterOccupationsList = response.OccupationsList;
                    }

                    if (response.ChiefComplaints && response.ChiefComplaints.length > 0) {
                        masterdataObj.masterChiefComplaintsArray = response.ChiefComplaints;
                    }
                    if (response.ClinicalNotes && response.ClinicalNotes.length > 0) {
                        masterdataObj.masterClinicalNotesArray = response.ClinicalNotes;
                    }
                    if (response.Observations && response.Observations.length > 0) {
                        masterdataObj.masterObservationsArray = response.Observations;
                    }
                    if (response.Diagnosis && response.Diagnosis.length > 0) {
                        masterdataObj.masterDiagnosisArray = response.Diagnosis;
                    }
                    if (response.Procedures && response.Procedures.length > 0) {
                        masterdataObj.masterProceduresArray = response.Procedures;
                    }
                    if (response.Medicines && response.Medicines.length > 0) {
                        masterdataObj.masterMedicinesArray = response.Medicines;
                    }
                    if (response.LabTest && response.LabTest.length > 0) {
                        masterdataObj.masterLabTestArray = response.LabTest;
                    }
                    if (response.Investigations && response.Investigations.length > 0) {
                        masterdataObj.masterInvestigations = response.Investigations;

                        angular.forEach(masterdataObj.masterInvestigations, function (item, index) {
                            item.IsInvestigationChecked = false;
                        });
                    }
                    if (response.MasterConfirmationStatusArray && response.MasterConfirmationStatusArray.length > 0) {
                        masterdataObj.masterConfirmationStatusList = response.MasterConfirmationStatusArray;
                        angular.forEach(masterdataObj.masterConfirmationStatusList, function (item, index) {
                            item.IsChecked = true;
                        });
                    }
                    if (response.AppointmentStatus.length > 0) {
                        masterdataObj.masterAppointmentStatus = response.AppointmentStatus;
                        angular.forEach(masterdataObj.masterAppointmentStatus, function (item, index) {
                            item.IsChecked = true;
                        });
                    }
                    if (response.BookingTypes.length > 0) {
                        masterdataObj.masterBookingTypes = response.BookingTypes;
                        angular.forEach(masterdataObj.masterBookingTypes, function (item, index) {
                            item.IsChecked = true;
                        });
                    }





                    if (response.InvCategories && response.InvCategories.length > 0) {

                        masterdataObj.masterInvCategories = response.InvCategories;

                        angular.forEach(masterdataObj.masterInvCategories, function (item, index) {
                            item.TempIsCategoryChecked = false;
                            item.IsCategoryChecked = false;
                        });
                    }
                    if (response.MedicineTemplates && response.MedicineTemplates.length > 0) {
                        masterdataObj.masterMedicineTemplatesArray = response.MedicineTemplates;
                    }
                    if (response.InvestigationTemplates && response.InvestigationTemplates.length > 0) {
                        masterdataObj.masterInvestigationTemplatesArray = response.InvestigationTemplates;
                    }
                    if (response.PrescriptionFrequencies && response.PrescriptionFrequencies.length > 0) {
                        masterdataObj.PrescriptionFrequencies = response.PrescriptionFrequencies;
                    }

                    if (response.PaymentModes && response.PaymentModes.length > 0) {
                        masterdataObj.PaymentModes = response.PaymentModes;
                    }
                    if (response.LeadProblems && response.LeadProblems.length > 0) {
                        masterdataObj.LeadProblems = response.LeadProblems;
                    }

                    if (response.NewLabTestList && response.NewLabTestList.length > 0) {
                        masterdataObj.masterNewLabTestArray = response.NewLabTestList;
                    }


                    if (response.CurrentTreatmentList && response.CurrentTreatmentList.length > 0) {
                        masterdataObj.masterCurrentTreatmentArray = response.CurrentTreatmentList;
                    }

                    if (response.AllergiesList && response.AllergiesList.length > 0) {
                        masterdataObj.masterAllergyArray = response.AllergiesList;
                    }
                    if (response.SurgeryList && response.SurgeryList.length > 0) {
                        masterdataObj.masterSurgeryArray = response.SurgeryList;
                    }
                    if (response.BirthHistoryList && response.BirthHistoryList.length > 0) {
                        masterdataObj.masterBirthHistoryArray = response.BirthHistoryList;
                    }
                    if (response.OccularHistoryList && response.OccularHistoryList.length > 0) {
                        masterdataObj.masterOccularHistoryArray = response.OccularHistoryList;
                    }
                    if (response.MedicalHistoryList && response.MedicalHistoryList.length > 0) {
                        masterdataObj.masterMedicalHistoryArray = response.MedicalHistoryList;
                    }
                    if (response.FamilyHistoryList && response.FamilyHistoryList.length > 0) {
                        masterdataObj.masterFamilyHistoryArray = response.FamilyHistoryList;
                    }
                    if (response.NutritionalHistoryList && response.NutritionalHistoryList.length > 0) {
                        masterdataObj.masterNutritionalHistoryArray = response.NutritionalHistoryList;
                    }
                    if (response.ImmunisationHistoryList && response.ImmunisationHistoryList.length > 0) {
                        masterdataObj.masterImmunisationHistoryArray = response.ImmunisationHistoryList;
                    }
                    if (response.SurgicalHistoryList && response.SurgicalHistoryList.length > 0) {
                        masterdataObj.masterSurgicalHistoryArray = response.SurgicalHistoryList;
                    }

                    if (response.MenstrualHistoryList && response.MenstrualHistoryList.length > 0) {
                        masterdataObj.masterMenstrualHistoryArray = response.MenstrualHistoryList;
                    }
                    if (response.LifestyleHistoryList && response.LifestyleHistoryList.length > 0) {
                        masterdataObj.masterLifestyleHistoryArray = response.LifestyleHistoryList;
                    }
                    if (response.PatientGeneralInstructionList && response.PatientGeneralInstructionList.length > 0) {
                        masterdataObj.masterPatientInstructionsArray = response.PatientGeneralInstructionList;
                    }
                    if (response.Findings && response.Findings.length > 0) {
                        masterdataObj.masterFindings = response.Findings;

                        angular.forEach(masterdataObj.masterFindings, function (item, index) {
                            item.IsInvestigationChecked = false;
                        });
                    }
                    if (response.SettlementStatus && response.SettlementStatus.length > 0) {
                        masterdataObj.SettlementStatus = response.SettlementStatus;
                    }
                    if (response.DepositStatus && response.DepositStatus.length > 0) {
                        masterdataObj.DepositStatus = response.DepositStatus;
                    }
                    if (response.DepositTypes && response.DepositTypes.length > 0) {
                        masterdataObj.DepositTypes = response.DepositTypes;
                    }
                    if (response.OperativeNoteAddendumReasons && response.OperativeNoteAddendumReasons.length > 0) {
                        masterdataObj.masterOperativeNoteAddendumReasons = response.OperativeNoteAddendumReasons;
                    }

                    loginCookieFactory.set("masterDataArrays", masterdataObj);
                    datapersistanceFactory.set("masterDataArrays", masterdataObj);
                }
            }).error(function (error) {
                console.log("error log print");
            });



            $scope.DocFreqItems = [];
            var obj = { "DoctorID": doctorinfo.doctorid };
            loginCookieFactory.set("DoctorFrequenctItems", $scope.DocFreqItems);




            var status = false;
            loginCookieFactory.set("IsAllBranchesServiceinitialized", status);



            var UserRoleId = 0;

            if (doctorinfo.RoleID !== undefined) {
                UserRoleId = doctorinfo.RoleID;
            }

            if (data.UserAddress[0].ExtDetails.HospitalInfo.RoleID !== undefined) {
                UserRoleId = data.UserAddress[0].ExtDetails.HospitalInfo.RoleID;
            }



            $scope.getAllBranchesBySubOrganizationId(data.UserAddress[0].SubOrganizationId, UserRoleId, OrganizationTypeId);

        } else {
            $scope.error = true;
            $scope.errordesc = "Invalid User Name / Password";
        }
    }
    $scope.closeurlPopup = function () {
        $scope.urlPopup = false;
    };
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

    $scope.TwoWayVerifactionOTPGenarating = function (type, IsOtpFromDeviceInd) {
        if (type == 'Resend') {
            if (IsOtpFromDeviceInd == 1) {
                $scope.sendotptomail();
            } else {
                if ($scope.TwoWayVerifactionObj != '') {
                    /*$scope.TwoWayVerifactionObj.SMSTextBoxFirst = '';
                    $scope.TwoWayVerifactionObj.SMSTextBoxSecond = '';
                    $scope.TwoWayVerifactionObj.SMSTextBoxThird = '';
                    $scope.TwoWayVerifactionObj.SMSTextBoxFourth = '';*/
                    $scope.TwoWayVerifactionObj.SMSOTP = '';
                }
                if ($scope.doctorBranchList != '') {
                    let MobileNumber = $scope.doctorBranchList.UserPhone[0].PhCntryCD + $scope.doctorBranchList.UserPhone[0].PhAreaCD + $scope.doctorBranchList.UserPhone[0].PhMobileNo || "";
                    let EmailId = $scope.doctorBranchList.UserPhone[0].EmailId || "";
                    let TelnyxSmsSenderMobileNo = $scope.doctorBranchList.UserAddress[0].TelnyxSmsSenderMobileNo || "";
                    // for Showing Mobile Number
                    if (MobileNumber.length > 0) {
                        var UsMobileNumber = '';
                        var obj = eHnoteUserDataService.UsMobileFormatChange(MobileNumber);
                        UsMobileNumber = obj.UsFormatMobileNumber;
                    }
                    var CountryCode = $scope.doctorBranchList.UserPhone[0].PhCntryCD || "";
                    $scope.TwoWayVerifactionObj.MobileNo = (CountryCode + ' ' + UsMobileNumber) || 0;
                    // end


                 
                    let reqobj = {
                        "EmailId": EmailId || "",
                        "MobileNo": MobileNumber || "",
                        "TelnyxSmsSenderMobileNo": TelnyxSmsSenderMobileNo || ""
                    }
                    eHnoteDbStaticDataService.GenerateVerificationCodeForTwoWayAuth(reqobj).then(function (response) {
                        if (response.data.Status == 'Success') {
                            $scope.TwoWayVerifaction = true;
                            $scope.startOtpTimer();
                            alertify.success('Successfully OTP is Resend to Your Mobile No')
                        }
                        if (response.data == "Failure") {
                            alertify.error("Oops! Unable to send the OTP. Please reach out to the administrator.");
                            return false;
                        }

                    }, function (err) {
                        console.log(err);
                    });
                }
            }

        }
        if ($scope.doctorBranchList != '') {
            let MobileNumber = $scope.doctorBranchList.UserPhone[0].PhCntryCD + $scope.doctorBranchList.UserPhone[0].PhAreaCD + $scope.doctorBranchList.UserPhone[0].PhMobileNo || "";
            let EmailId = $scope.doctorBranchList.UserPhone[0].EmailId || "";
            let TelnyxSmsSenderMobileNo = $scope.doctorBranchList.UserAddress[0].TelnyxSmsSenderMobileNo || 0;
            // for Showing Mobile Number
            if (MobileNumber.length > 0) {
                var UsMobileNumber = '';
                var obj = eHnoteUserDataService.UsMobileFormatChange(MobileNumber);
                UsMobileNumber = obj.UsFormatMobileNumber;
            }
            var CountryCode = $scope.doctorBranchList.UserPhone[0].PhCntryCD || "";
            $scope.TwoWayVerifactionObj.MobileNo = (CountryCode + ' ' + UsMobileNumber) || 0;
            // end
            let reqobj = {
                "EmailId": EmailId || "",
                "MobileNo": MobileNumber,
                "TelnyxSmsSenderMobileNo": TelnyxSmsSenderMobileNo || ""
            }
            eHnoteDbStaticDataService.GenerateVerificationCodeForTwoWayAuth(reqobj).then(function (response) {
                if (response.data.Status == 'Success') {
                    $scope.TwoWayVerifaction = true;
                    $scope.startOtpTimer();
                }
                if (response.data == 'Failure') {
                    alertify.error("Oops! Unable to send the OTP. Please reach out to the administrator.");
                    return false;
                }
            }, function (err) {
                console.log(err);
            });
        }
    }
    $scope.CheckingTwoWayVerification = function (OtpData, typevalue) {
        /* OtpData.SMSTextBoxFirst = OtpData.SMSTextBoxFirst || "";
         OtpData.SMSTextBoxSecond = OtpData.SMSTextBoxSecond || "";
         OtpData.SMSTextBoxThird = OtpData.SMSTextBoxThird || "";
         OtpData.SMSTextBoxFourth = OtpData.SMSTextBoxFourth || "";
         if (OtpData.SMSTextBoxFirst == "" && OtpData.SMSTextBoxSecond == '' && OtpData.SMSTextBoxThird == "" && OtpData.SMSTextBoxFourth == "") {
             alertify.error('Please Enter OTP');
             return false;
         }
         if (OtpData.SMSTextBoxFirst == "" || OtpData.SMSTextBoxSecond == '' || OtpData.SMSTextBoxThird == "" || OtpData.SMSTextBoxFourth == "") {
             alertify.error('Please Enter Valid OTP');
             return false;
         }*/
        OtpData.SMSOTP = OtpData.SMSOTP || '';

        if (OtpData.SMSOTP === '') {
            alertify.error('Please Enter OTP');
            return false;
        }

        if (OtpData.SMSOTP.length !== 4) {
            alertify.error('Please Enter Valid OTP');
            return false;
        }
        if (OtpData != '') {
            var OTP = OtpData.SMSOTP;
            // var OTP = (OtpData.SMSTextBoxFirst + OtpData.SMSTextBoxSecond + OtpData.SMSTextBoxThird + OtpData.SMSTextBoxFourth) || "";
            var MobileNumber = $scope.doctorBranchList.UserPhone[0].PhCntryCD + $scope.doctorBranchList.UserPhone[0].PhAreaCD + $scope.doctorBranchList.UserPhone[0].PhMobileNo || "";
            var CountryCode = $scope.doctorBranchList.UserPhone[0].PhCntryCD || "";
            var SubOrganizationId = $scope.doctorBranchList.UserAddress[0].ParentOrganizationId || 0;
            let EmailId = $scope.Email || " ";
            let type = typevalue || 1;
            if (typevalue == 2) {
                MobileNumber = "";
            }
            let MobileNo = encodeURIComponent(MobileNumber);

            var doctorid = "249";

            doctorid = $scope.logininfoObj.UserId;

            console.log(doctorid);

            eHnoteDbStaticDataService.TwoWayVerificationValidateUserOTP(MobileNo, OTP, SubOrganizationId, EmailId, type, doctorid).then(function (response) {
                if (response.data.status == 'Success') {
                    OtpData.SMSOTP = '',
                        /* OtpData.SMSTextBoxFirst = '';
                         OtpData.SMSTextBoxSecond = '';
                         OtpData.SMSTextBoxThird = '';
                         OtpData.SMSTextBoxFourth = '';*/
                        $scope.TwoWayVerifaction = false;
                    $scope.ShowLoginScreen = false;
                    $scope.IsValidOAuth = false;
                    $scope.IsSendOtptoEmailscr = false;
                    $scope.IsVerifyOtpEmailscr = false;
                    $scope.IsMailSendOpen = false;

                    console.log(response.data.Token);
                    response.data.Token = response.data.Token || "";
                    if (response.data.Token != "") {
                        datapersistanceFactory.set("JWTToken", response.data.Token);
                        localStorage.setItem("JWTToken", response.data.Token);
                    }




                    $scope.GetOrganizationSettings($scope.doctorBranchList.UserAddress[0].ParentOrganizationId);
                    if ($window.location.host == "ioj.ehnote.com" || $window.location.host == 'insts.ehnote.com') {
                        $scope.ChangeDoctorBranch($scope.doctorBranchList.UserAddress[0]);
                    } else {
                        if ($scope.doctorBranchList.UserAddress.length === 1) {
                            $scope.ChangeDoctorBranch($scope.doctorBranchList.UserAddress[0]);
                        } else {
                            if ($scope.showSubOrganizationList) {
                                $scope.showSubOrganizationPopUp = true;
                                $scope.dynamicPopoverSub = { templateUrl: "ChooseSubOrganizationPopUp.html" };
                            }
                            else if ($scope.showRoleGroupList) {
                                $scope.Rolelist = $scope.doctorBranchList.UserAddress[0].UserBranchRoles || [];
                                $scope.showRoleGroupPopUp = true;
                                $scope.dynamicPopover = { templateUrl: "ChooseRoleGroupPopUp.html" };
                            } else {
                                $scope.showBranchPopup = true;
                                $scope.dynamicPopoverBranch = { templateUrl: "ChooseDoctorBranchPopUp.html" };
                            }
                        }
                    }

                }
                else {
                    alertify.error('Please Enter Valid OTP');
                }
            }, function (err) {
                alertify.error('Please Enter Valid OTP');
            });

        }


    }
    //$scope.FirstOtpFocus = true;
    $scope.next = function (item, val) {
        $scope.FirstOtpFocus = false;
        // val = val || "";
        if (val != undefined) {
            angular.element("#" + item).focus()
        }
        else {
            $scope.FirstOtpFocus = false;
        }
    };
    $scope.navToLogout = function () {
        // Going offline has to happen before the session is torn down: it is an
        // authenticated call, and the token lives in the storage cleared below.
        $rootScope.$broadcast('telnyxForceOffline');
        datapersistanceFactory.clearAll();
        localStorageFactory.clearAll();
        $scope.ShowLoginScreen = true;
        $scope.showBranchPopup = false;
        $scope.tryAnotherWay = false;
        eHnoteDiagnosisDataServices.ClearMasterConsultationCache();
        eHnoteSettingsDataService.ClearMasterClaimCache();
        if ($window.location.host == "ioj.ehnote.com") {
            $window.location.href = "https://portal.ehnote.com/#/login";
        } else if ($window.location.host == 'insts.ehnote.com') {
            $window.location.href = "https://stage.ehnote.com/#/login";
        } else {
            $location.path("/login");
        }
    };
    $scope.IsMailSendOpen = false;
    $scope.NavtoEmailScreen = function () {
        $scope.IsMailSendOpen = true;
        $scope.TwoWayVerifaction = false;
        $scope.ShowLoginScreen = true;
        $scope.IsValidOAuth = true;
        $scope.IsSendOtptoEmailscr = true;
        $scope.tryAnotherWay = false;
        /*  $scope.TwoWayVerifactionObj.SMSTextBoxFirst = '';
          $scope.TwoWayVerifactionObj.SMSTextBoxSecond = '';
          $scope.TwoWayVerifactionObj.SMSTextBoxThird = '';
          $scope.TwoWayVerifactionObj.SMSTextBoxFourth = '';*/
        $scope.TwoWayVerifactionObj.SMSOTP = '';
        $scope.sendotptomail();
        $scope.startOtpTimer();
    }
    $scope.NavtoMobileScreen = function () {
        $scope.IsMailSendOpen = false;
        $scope.TwoWayVerifaction = true;
        $scope.ShowLoginScreen = false;
        $scope.IsValidOAuth = false;
        $scope.IsSendOtptoEmailscr = true;
        $scope.tryAnotherWay = false;
        $scope.TwoWayVerifactionObj.SMSOTP = '';
        $scope.TwoWayVerifactionOTPGenarating();
        $scope.startOtpTimer();
    }
    $scope.IsSendOtptoEmailscr = false;
    $scope.IsVerifyOtpEmailscr = false;
    $scope.moveBackScreen = null;
    $scope.backtologin = function () {
        $scope.IsMailSendOpen = false;
        $scope.TwoWayVerifaction = false;
        $scope.IsValidOAuth = false;
        $scope.IsSendOtptoEmailscr = false;
        $scope.IsVerifyOtpEmailscr = false;

        switch ($scope.moveBackScreen) {

            case 'selectOTP':
                $scope.verificationMethod = { method: null };
                $scope.moveBackScreen = 'OTPauth';
                $scope.ShowLoginScreen = false;
                $scope.showMFAAuthenticationScreen = false;
                $scope.tryAnotherWay = true;
                break;

            case 'OTPauth':
                $scope.moveBackScreen = null;
                $scope.ShowLoginScreen = false;
                $scope.showMFAAuthenticationScreen = true;
                $scope.tryAnotherWay = false;
                break;

            default:
                $scope.moveBackScreen = null;
                $scope.ShowLoginScreen = true;
                $scope.showMFAAuthenticationScreen = false;
                $scope.tryAnotherWay = false;
                $scope.navToLogout();
                break;
        }
    };
    $scope.Gotobackscr = function () {
        $scope.ShowLoginScreen = true;
        $scope.IsMailSendOpen = false;
        $scope.TwoWayVerifaction = false;
        $scope.IsValidOAuth = false;
        $scope.IsSendOtptoEmailscr = false;
        $scope.IsVerifyOtpEmailscr = false;
        $scope.tryAnotherWay = false;
    }
    $scope.sendotptomail = function () {
        $scope.doctorBranchList.UserAddress = $scope.doctorBranchList.UserAddress || [];
        var IsEmailCommunicationEnabledInd = false;
        var ClinicId = 0;
        if ($scope.doctorBranchList.UserAddress.length > 0) {
            angular.forEach($scope.doctorBranchList.UserAddress, function (item) {
                if (item.EmailCommunicationEnabled) {
                    IsEmailCommunicationEnabledInd = true;
                    ClinicId = item.ClinicId;
                }
            });
            $scope.startOtpTimer();
        }
        if (!IsEmailCommunicationEnabledInd) {
            alertify.error("No Access For this Orginizaction's to send an OTP");
            return false;
        }

        var reqobj = {
            "EmailId": $scope.Email || "",
            "EmailCommunicationEnabled": IsEmailCommunicationEnabledInd || false,
            "ClinicId": ClinicId || false,
        }
        eHnoteDbStaticDataService.GetTwowayverificationCodeToEmail(reqobj).then(function (response) {
            if (response.data.Status == 'Success') {
                $scope.TwoWayVerifaction = true;
                $scope.IsSendOtptoEmailscr = false;
                $scope.IsVerifyOtpEmailscr = true;
            }
        }, function (err) {
            console.log(err);
            $scope.TwoWayVerifaction = true;
            $scope.IsSendOtptoEmailscr = false;
            $scope.IsVerifyOtpEmailscr = true;
        });
    }
    $scope.navToSessionLogin = function () {
        $rootScope.IsValidOAuth = false;
        $scope.ShowLoginScreen = true;
        $rootScope.IsDuplicateLogin = false;
        console.log($window.location.host + "__Host");
        //if ($window.location.host == 'insts.ehnote.com') {
        //    $window.location.href = "https://stage.ehnote.com/#/login";
        //} else {
        //    $window.location.href = "https://portal.ehnote.com/#/login";
        //}
        if ($window.location.host == "ioj.ehnote.com") {
            $window.location.href = "https://portal.ehnote.com/#/login";
        } else if ($window.location.host == 'insts.ehnote.com') {
            $window.location.href = "https://stage.ehnote.com/#/login";
        } else {
            $location.path("/login");
        }

    };



    // logout service

    function showPosition(position) {
        if (position != 0) {

            $scope.Lat = position.coords.latitude;
            $scope.Lon = position.coords.longitude;


        }
        else {
            const exit = e => {
                const shouldExit =
                    [...e.target.classList].includes('exit-intent-popup') ||
                    e.target.className === 'close';

                if (shouldExit) {
                    document.querySelector('.exit-intent-popup').classList.remove('visible');
                }
            };
        }
    }

    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
            //console.log("User denied the request for Geolocation.");

            case error.POSITION_UNAVAILABLE:
            //console.log("Location information is unavailable.");

            case error.TIMEOUT:
            //console.log("The request to get user location timed out.");

            case error.UNKNOWN_ERROR:
            //console.log("An unknown error occurred.");
        }
    }
    getLocation();

    $scope.movePrevious = function (event, currentId, previousId) {
        if (event.keyCode === 8) {
            var currentValue = $('#' + currentId).val();
            if (!currentValue && previousId) {
                $('#' + previousId).focus();
            }
        }
    };


    $scope.navtovalidateMFAOtpUser = function () {


        console.log($scope.MFAVerifactionObj);
        /*For single input 6 Digits OTP*/

        if (!$scope.MFAVerifactionObj.MFAOTP || $scope.MFAVerifactionObj.MFAOTP.length !== 6) {
            alertify.error("Please enter a valid 6-digit OTP.");
            return;
        }
        /* if (
             !$scope.MFAVerifactionObj.OtpTextBoxFirst ||
             !$scope.MFAVerifactionObj.OtpTextBoxSecond ||
             !$scope.MFAVerifactionObj.OtpTextBoxThird ||
             !$scope.MFAVerifactionObj.OtpTextBoxFourth ||
             !$scope.MFAVerifactionObj.OtpTextBoxFifth ||
             !$scope.MFAVerifactionObj.OtpTextBoxSixth
         ) {
             alertify.error("Please enter all 6 digits of the OTP.");
         return;
         }*/


        /*   $scope.MFAVerifactionObj.MFAOTP =
              ($scope.MFAVerifactionObj.OtpTextBoxFirst || '') +
              ($scope.MFAVerifactionObj.OtpTextBoxSecond || '') +
              ($scope.MFAVerifactionObj.OtpTextBoxThird || '') +
            ($scope.MFAVerifactionObj.OtpTextBoxFourth || '') +
             ($scope.MFAVerifactionObj.OtpTextBoxFifth || '') +
            ($scope.MFAVerifactionObj.OtpTextBoxSixth || '');*/

        console.log("Final OTP:", $scope.MFAVerifactionObj.MainOTP);
        console.log($scope.MFAVerifactionObj);

        if ($window.location.host == "ioj.ehnote.com" || $window.location.host == 'insts.ehnote.com') {
            console.log(newUserId + "__newUserId");
            if (newUserId !== 0) {
                $scope.MFAVerifactionObj.DoctorID = newUserId || 0;
            }
        }

        eHnoteValidateUsersDataService.validateMFAOtpAuth($scope.MFAVerifactionObj, OnMFAAuthSuccess, OnMFAAuthError);

        function OnMFAAuthSuccess(data) {


            if (data.status === "Success") {
                OnLoginSuccess(data, "MFA")
            } else {
                alertify.error(data.Message);
                // alertify.error("Invalid User Name / Password");
            }
        }
        function OnMFAAuthError(error) {

        }
    };

    $scope.nextMFAOTPAuth = function (item, val) {

        if (val != undefined) {
            angular.element("#" + item).focus()
        }

    };

    /* $scope.clearMFAOtp = function () {
         $scope.MFAVerifactionObj.OtpTextBoxFirst = "";
         $scope.MFAVerifactionObj.OtpTextBoxSecond = "";
         $scope.MFAVerifactionObj.OtpTextBoxThird = "";
         $scope.MFAVerifactionObj.OtpTextBoxFourth = "";
         $scope.MFAVerifactionObj.OtpTextBoxFifth = "";
         $scope.MFAVerifactionObj.OtpTextBoxSixth = "";
     };*/

    $scope.helpPopover = {
        templateUrl: "helpPopover.html"
    }

    $scope.verificationMethod = { method: null };

    $scope.selectVerificationMethod = function (method) {
        $scope.verificationMethod.method = method;
    };

    $scope.sendVerificationcode = function () {
        $scope.moveBackScreen = 'selectOTP';
        switch ($scope.verificationMethod.method) {
            case 'mobile':
                $scope.NavtoMobileScreen();
                break;
            case 'email':
                $scope.NavtoEmailScreen();
                break;
        }
    };
    //added dynamic color
    $scope.colorMap = $scope.colorMap || {};

    $scope.getItemColor = function (key) {
        if (!$scope.colorMap[key]) {

            var hue = Math.floor(Math.random() * 360);
            var saturation = 55 + Math.random() * 15;
            var lightness = 30 + Math.random() * 20;

            var color = 'hsl(' + hue + ', ' + saturation + '%, ' + lightness + '%)';
            $scope.colorMap[key] = color;
        }
        return $scope.colorMap[key];
    };

    $scope.showPassword = false;
    //OTP Expire time
    $scope.otpDuration = 120;
    $scope.otpTimeLeft = 0;
    $scope.otpExpired = false;
    let otpTimerPromise = null;
    $scope.startOtpTimer = function () {
        if (otpTimerPromise) {
            $interval.cancel(otpTimerPromise);
        }

        $scope.otpTimeLeft = $scope.otpDuration;
        $scope.otpExpired = false;

        otpTimerPromise = $interval(function () {
            $scope.otpTimeLeft--;

            if ($scope.otpTimeLeft <= 0) {
                $scope.otpExpired = true;
                $interval.cancel(otpTimerPromise);
            }
        }, 1000);
    };
    $scope.formatOtpTime = function () {
        var min = Math.floor($scope.otpTimeLeft / 60);
        var sec = $scope.otpTimeLeft % 60;
        return (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;
    };

    $scope.branchSearch = function (item) {
        if (!$scope.searchHospital.txt1) return true;

        var Filter = $scope.searchHospital.txt1.toLowerCase();

        return item.ClinicName.toLowerCase().includes(Filter) ||
            item.Location.toLowerCase().includes(Filter);
    };

}]);
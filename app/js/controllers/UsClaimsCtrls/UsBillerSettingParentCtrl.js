"use strict";
eHnoteWebApp.controller("UsBillerSettingParentCtrl", ["$scope", "$rootScope", "$filter", "alertify", "$uibModal", "datapersistanceFactory", "$q", "$timeout", "eHnoteMasterDataService","eHnoteInsuranceService",
    function ($scope, $rootScope, $filter, alertify, $uibModal, datapersistanceFactory, $q, $timeout, eHnoteMasterDataService, eHnoteInsuranceService) {


        $scope.UserId = eHnoteMasterDataService.getLoginId();

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        };


        $scope.SettingSubTab = 1;
        $scope.SettingsMainTabClick = function (tabchange) {
            $scope.SettingSubTab = tabchange;

            if ($scope.SettingSubTab == 1) {
                $scope.getERAFtpdetailsData();
            }
        }

        $scope.getEraFtpDetails = function () {
            var Obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "EraFTPDetailId": 0,
                "FTPName": "",
                "FTPHostName": "",
                "ProtocolType": "",
                "ProtocolTypeId": 0,
                "FTPUserName": "",
                "FTPPassword": "",
                "PortNumber": null,
                "FolderPath": "",
                "IsActive": false,
                "DeleteInd": "N",
                "PageSize": 10,
                "PageNumber": 1,
                "Count": 0,
            }
            return Obj;
        }
        $scope.AddEraFtpDetails = $scope.getEraFtpDetails();

        $scope.ChangeFtpOrSftp = function () {

            if ($scope.AddEraFtpDetails.ProtocolType == "FTP") {
                $scope.AddEraFtpDetails.ProtocolTypeId = 1;
            }
            if ($scope.AddEraFtpDetails.ProtocolType == "SFTP") {
                $scope.AddEraFtpDetails.ProtocolTypeId = 2;
            }
        }

        $scope.SaveERAFtpDetails = function () {



            $scope.UserId = $scope.UserId;
            $scope.HospitalId = $scope.HospitalId;
            $scope.AddEraFtpDetails.EraFTPDetailId = $scope.AddEraFtpDetails.EraFTPDetailId;
            $scope.AddEraFtpDetails.FTPName = $scope.AddEraFtpDetails.FTPName;
            $scope.AddEraFtpDetails.FTPHostName = $scope.AddEraFtpDetails.FTPHostName;
            $scope.AddEraFtpDetails.ProtocolType = $scope.AddEraFtpDetails.ProtocolType;
            $scope.AddEraFtpDetails.ProtocolTypeId = $scope.AddEraFtpDetails.ProtocolTypeId;
            $scope.AddEraFtpDetails.FTPUserName = $scope.AddEraFtpDetails.FTPUserName;
            $scope.AddEraFtpDetails.FTPPassword = $scope.AddEraFtpDetails.FTPPassword;
            $scope.AddEraFtpDetails.PortNumber = $scope.AddEraFtpDetails.PortNumber;
            $scope.AddEraFtpDetails.FolderPath = $scope.AddEraFtpDetails.FolderPath;
            $scope.AddEraFtpDetails.DeleteInd = $scope.AddEraFtpDetails.DeleteInd;
            $scope.AddEraFtpDetails.IsActive = $scope.AddEraFtpDetails.IsActive;
            if ($scope.AddEraFtpDetails.IsActive == true) {
                var IsActive = "Y";
            } else {
                var IsActive = "N";
            }


            var param = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "EraFTPDetailId": $scope.AddEraFtpDetails.EraFTPDetailId,
                "FTPName": $scope.AddEraFtpDetails.FTPName,
                "FTPHostName": $scope.AddEraFtpDetails.FTPHostName,
                "ProtocolType": $scope.AddEraFtpDetails.ProtocolType,
                "ProtocolTypeId": $scope.AddEraFtpDetails.ProtocolTypeId,
                "FTPUserName": $scope.AddEraFtpDetails.FTPUserName,
                "FTPPassword": $scope.AddEraFtpDetails.FTPPassword,
                "PortNumber": $scope.AddEraFtpDetails.PortNumber,
                "FolderPath": $scope.AddEraFtpDetails.FolderPath,
                "IsActive": IsActive,
            }

            eHnoteInsuranceService.AddUpdateEraFtpDetails(param, onsuccess, onerror);
            function onsuccess(resp) {
                console.log(resp);
                if (resp.data.Status == "Success") {
                    $scope.getERAFtpdetailsData();
                    $scope.ClearERAFtpDetails();
                }
            }
            function onerror(err) {
                console.log(err);
            }

            $scope.mInstanceAdd.result.then(function (response) {

                console.log(response);
                $scope.getERAFtpdetailsData();
                $scope.AddEraFtpDetails.PageNumber = 1;

            }, function () { });
        }

        

        $scope.init = function () {
            $scope.EraFtfDataList = [];
            var param = {
                "OrganizationId": $scope.HospitalId,
                "PageSize": $scope.AddEraFtpDetails.PageSize,
                "PageNumber": $scope.AddEraFtpDetails.PageNumber,
                "ActiveInd":0
            }

            $q.all([
                eHnoteInsuranceService.GetOrgEraFtpDetails(param)
            ]).then(function (resp) {
                console.log(resp);
                if (resp[0].data.rows != undefined) {
                    console.log(resp[0].data.rows);
                    $scope.EraFtfDataList = resp[0].data.rows || [];
                    $scope.AddEraFtpDetails.Count = resp[0].data.count || 0;
                }

            });
        }
        $scope.init();

        $scope.getERAFtpdetailsData = function (pageno, type) {
            $scope.AddEraFtpDetails.PageNumber = pageno || 1;
            var type = (type === undefined || type === '') ? 'All' : type;
            var param = {
                "OrganizationId": $scope.HospitalId,
                "PageSize": $scope.AddEraFtpDetails.PageSize,
                "PageNumber": $scope.AddEraFtpDetails.PageNumber,
            }
            eHnoteInsuranceService.GetOrgEraFtpDetails(param).then(function (resp) {
                console.log(resp);
                $scope.EraFtfDataList = [];
                if (resp.data.rows.length > 0) {
                    $scope.EraFtfDataList = resp.data.rows || [];
                    $scope.AddEraFtpDetails.Count = resp.data.count || 0;
                }

            }, function (err) {


            });

        }

        $scope.EditERAFtpDetails = function (item) {
            item = item || null;

            $scope.AddEraFtpDetails.EraFTPDetailId = item.EraFTPDetailId;
            $scope.AddEraFtpDetails.FTPName = item.FTPName;
            $scope.AddEraFtpDetails.FTPHostName = item.FTPHostName;
            $scope.AddEraFtpDetails.ProtocolType = item.ProtocolType;
            $scope.AddEraFtpDetails.ProtocolTypeId = item.ProtocolTypeId;
            $scope.AddEraFtpDetails.FTPUserName = item.FTPUserName;
            $scope.AddEraFtpDetails.FTPPassword = item.FTPPassword;
            $scope.AddEraFtpDetails.PortNumber = item.PortNumber;
            $scope.AddEraFtpDetails.FolderPath = item.FolderPath;

            if (item.IsActive == "Y") {
                $scope.AddEraFtpDetails.IsActive = true;
            } else {
                $scope.AddEraFtpDetails.IsActive = false;
            }

        }

        $scope.ClearERAFtpDetails = function () {

            $scope.AddEraFtpDetails.EraFTPDetailId = 0;
            $scope.AddEraFtpDetails.FTPName = "";
            $scope.AddEraFtpDetails.FTPHostName = "";
            $scope.AddEraFtpDetails.ProtocolType = "";
            $scope.AddEraFtpDetails.ProtocolTypeId = 0;
            $scope.AddEraFtpDetails.FTPUserName = "";
            $scope.AddEraFtpDetails.FTPPassword = "";
            $scope.AddEraFtpDetails.PortNumber = "";
            $scope.AddEraFtpDetails.FolderPath = "";
            $scope.AddEraFtpDetails.IsActive = false;

            //if (item.IsFrequent == "Y") {
            //    $scope.DiagnosisObj.IsFrequent = true;
            //} else {
            //    $scope.DiagnosisObj.IsFrequent = false;
            //}

        }

        $scope.DeleteERAFtpDetails = function (item) {

                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete this ERA/FTP Details? </h4>", function () {
                    var param = {
                        "UserId": $scope.UserId,
                        "OrganizationId": $scope.HospitalId,
                        "EraFTPDetailId": item.EraFTPDetailId,
                        "FTPName": item.FTPName,
                        "FTPHostName": item.FTPHostName,
                        "ProtocolType": item.ProtocolType,
                        "ProtocolTypeId": item.ProtocolTypeId,
                        "FTPUserName": item.FTPUserName,
                        "FTPPassword": item.FTPPassword,
                        "PortNumber": item.PortNumber,
                        "FolderPath": item.FolderPath,
                        "IsActive": "Y",
                        "DeleteInd": "Y",
                    }

                    eHnoteInsuranceService.AddUpdateEraFtpDetails(param, onsuccess, onerror);
                    function onsuccess(resp) {
                        console.log(resp);
                        if (resp.data.Status == "Success") {
                            $scope.getERAFtpdetailsData();
                            alertify.success("Successfully Deleted!");
                        }
                    }
                    function onerror(err) {
                        console.log(err);
                    }

                }, function () {
                    r = "You pressed Cancel!";
                });

           
        }

        $scope.changeEraFtpisActive = function (item) {
            if (item.IsActive == 'N') {
                var param = {
                    "UserId": $scope.UserId,
                    "OrganizationId": $scope.HospitalId,
                    "EraFTPDetailId": item.EraFTPDetailId,
                    "FTPName": item.FTPName,
                    "FTPHostName": item.FTPHostName,
                    "ProtocolType": item.ProtocolType,
                    "ProtocolTypeId": item.ProtocolTypeId,
                    "FTPUserName": item.FTPUserName,
                    "FTPPassword": item.FTPPassword,
                    "PortNumber": item.PortNumber,
                    "FolderPath": item.FolderPath,
                    "IsActive": "Y",
                }
                eHnoteInsuranceService.AddUpdateEraFtpDetails(param, onsuccess, onerror);
                function onsuccess(resp) {
                    console.log(resp);
                    if (resp.data.Status == "Success") {
                        $scope.getERAFtpdetailsData();
                        alertify.success('Diagnosis Activated!');
                    }
                }
                function onerror(err) {
                    console.log(err);
                }

            }
            if (item.IsActive == 'Y') {
                var param = {
                    "UserId": $scope.UserId,
                    "OrganizationId": $scope.HospitalId,
                    "EraFTPDetailId": item.EraFTPDetailId,
                    "FTPName": item.FTPName,
                    "FTPHostName": item.FTPHostName,
                    "ProtocolType": item.ProtocolType,
                    "ProtocolTypeId": item.ProtocolTypeId,
                    "FTPUserName": item.FTPUserName,
                    "FTPPassword": item.FTPPassword,
                    "PortNumber": item.PortNumber,
                    "FolderPath": item.FolderPath,
                    "IsActive": "N",
                }

                eHnoteInsuranceService.AddUpdateEraFtpDetails(param, onsuccess, onerror);
                function onsuccess(resp) {
                    console.log(resp);
                    if (resp.data.Status == "Success") {
                        $scope.getERAFtpdetailsData();
                        alertify.success('Diagnosis Deactivated!');
                    }
                }
                function onerror(err) {
                    console.log(err);
                }

            }

        }

    


    }]);
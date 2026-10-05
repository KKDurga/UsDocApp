"use strict";
eHnoteWebApp.controller("UsERAParsingLogsCtrl", ["$scope", "$rootScope", "$filter", "alertify", "$uibModal", "datapersistanceFactory", "$q", "$timeout", "eHnoteMasterDataService", "eHnoteInsuranceService","$http",
    function ($scope, $rootScope, $filter, alertify, $uibModal, datapersistanceFactory, $q, $timeout, eHnoteMasterDataService, eHnoteInsuranceService, $http) {


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

        $scope.ChangeDateFormat = function () {
            $scope.EditERAParsingLogs.FromDate = $scope.EditERAParsingLogs.FromDate;
        }


        $scope.DateRangeArray = [
            { Id: 1, Name: 'Today' },
            { Id: 2, Name: 'Yesterday' },
            { Id: 3, Name: 'Last week' },
            { Id: 4, Name: 'This month' },
            { Id: 5, Name: 'Last month' },
            { Id: 6, Name: 'Last 2 months' },
            { Id: 7, Name: 'Last 6 months' },
            { Id: 8, Name: 'This year' },
            { Id: 9, Name: 'Last year' }
        ];

        $scope.ERAStatusArray = [
            { StatuId: 0, Name: 'All' },
            { StatuId: 1, Name: 'Pending' },
            { StatuId: 2, Name: 'Parsed' },
            { StatuId: 3, Name: 'Partially Parsed' },
            { StatuId: 4, Name: 'Failed' },
        ]

        $scope.ERAParsingSource = [
            { SourceTypeId: 0, Name: 'All' },
            { SourceTypeId: 1, Name: 'FTP' },
            { SourceTypeId: 2, Name: 'Upload ERA' },
        ]

        $scope.GetERAParsingLogs = function () {
            var Obj = {
                "OrganizationId": $scope.HospitalId,
                "FromDate": null,
                "ToDate": null,
                "EDIFileName": "",
                "StatuId": 0,
                "SourceTypeId": 0,
                "PageSize": 50,
                "PageNumber": 1,
                "Count":0,
            }
            return Obj;
        }

        $scope.EditERAParsingLogs = $scope.GetERAParsingLogs();

        $scope.setDateRange = function (selectedRangeId) {
            var currentDate = new Date();

            switch (selectedRangeId) {
                case 1: // Today
                    $scope.EditERAParsingLogs.FromDate = new Date(currentDate);
                    $scope.EditERAParsingLogs.ToDate = new Date(currentDate);
                    break;
                case 2: // Yesterday
                    $scope.EditERAParsingLogs.FromDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
                    $scope.EditERAParsingLogs.ToDate = new Date(); // Reset to current date
                    break;
                case 3: // Last week
                    $scope.EditERAParsingLogs.FromDate= new Date(currentDate.setDate(currentDate.getDate() - 7));
                    $scope.EditERAParsingLogs.ToDate = new Date(); // Reset to current date
                    break;
                case 4: // This month
                    $scope.EditERAParsingLogs.FromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    $scope.EditERAParsingLogs.ToDate = new Date(); // Reset to current date
                    break;
                case 5: // Last month
                    $scope.EditERAParsingLogs.FromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                    $scope.EditERAParsingLogs.ToDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // Last day of the previous month
                    break;
                case 6: // Last 2 months
                    $scope.EditERAParsingLogs.FromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
                    $scope.EditERAParsingLogs.ToDate = new Date(); // Reset to current date
                    break;
                case 7: // Last 6 months
                    $scope.EditERAParsingLogs.FromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
                    $scope.EditERAParsingLogs.ToDate = new Date(); // Reset to current date
                    break;
                case 8: // This year
                    $scope.EditERAParsingLogs.FromDate = new Date(currentDate.getFullYear(), 0, 1); // January 1st of current year
                    $scope.EditERAParsingLogs.ToDate = new Date(); // Reset to current date
                    break;
                case 9: // Last year
                    $scope.EditERAParsingLogs.FromDate = new Date(currentDate.getFullYear() - 1, 0, 1); // January 1st of last year
                    $scope.EditERAParsingLogs.ToDate = new Date(currentDate.getFullYear() - 1, 11, 31); // December 31st of last year
                    break;
                default:
                    $scope.EditERAParsingLogs.FromDate = null;
                    $scope.EditERAParsingLogs.ToDate = null;
            }

            $scope.EditERAParsingLogs.FromDate = $scope.EditERAParsingLogs.FromDate;
            $scope.EditERAParsingLogs.ToDate = $scope.EditERAParsingLogs.ToDate;

            if ($scope.EditERAParsingLogs.FromDate != '') {
                $scope.EditERAParsingLogs.FromDate = $filter('date')($scope.EditERAParsingLogs.FromDate, "MM-dd-yyyy");
            }
            if ($scope.EditERAParsingLogs.ToDate != '') {
                $scope.EditERAParsingLogs.ToDate = $filter('date')($scope.EditERAParsingLogs.ToDate, "MM-dd-yyyy");
            }
            
        };

        var currentDate = new Date();
        $scope.EditERAParsingLogs.FromDate = new Date(currentDate);
        $scope.EditERAParsingLogs.ToDate = new Date(currentDate);
        if ($scope.EditERAParsingLogs.FromDate != '') {
            $scope.EditERAParsingLogs.FromDate = $filter('date')($scope.EditERAParsingLogs.FromDate, "MM-dd-yyyy");
        }
        if ($scope.EditERAParsingLogs.ToDate != '') {
            $scope.EditERAParsingLogs.ToDate = $filter('date')($scope.EditERAParsingLogs.ToDate, "MM-dd-yyyy");
        }
        $scope.EditERAParsingLogs.StatuId = 0;
        $scope.EditERAParsingLogs.SourceTypeId = 0;

        $scope.SelectParsingStatus = function () {
            if ($scope.EditERAParsingLogs.StatuId == 0) {
                $scope.EditERAParsingLogs.ParsingStatus = 'All';
            }
        }

        $scope.SearchERAParsingList = function (pageno, type) {

            $scope.EditERAParsingLogs.PageNumber = pageno || 1;
            var type = (type === undefined || type === '') ? 'All' : type;

            var Frezobj = {
                "selectedRangeId": $scope.selectedRangeId || '',
                "FromDate": $scope.EditERAParsingLogs.FromDate || '',
                "ToDate": $scope.EditERAParsingLogs.ToDate || '',
                "EDIFileName": $scope.EditERAParsingLogs.EDIFileName || '',
                "StatuId": $scope.EditERAParsingLogs.StatuId || 0,
                "SourceTypeId": $scope.EditERAParsingLogs.SourceTypeId || 0,
                
            };
            eHnoteMasterDataService.addERAParsingLogsList(Frezobj);

            var param = {
                "OrganizationId": $scope.HospitalId,
                "FromDate": $scope.EditERAParsingLogs.FromDate,
                "ToDate": $scope.EditERAParsingLogs.ToDate,
                "EDIFileName": $scope.EditERAParsingLogs.EDIFileName,
                "StatuId": $scope.EditERAParsingLogs.StatuId,
                "SourceTypeId": $scope.EditERAParsingLogs.SourceTypeId,
                "PageSize": $scope.EditERAParsingLogs.PageSize,
                "PageNumber": $scope.EditERAParsingLogs.PageNumber
            }

            eHnoteInsuranceService.GetOrganizationERAJobFiles(param).then(function (resp) {
                console.log(resp);
                $scope.ERAParsingLogsList = [];
                if (resp.data.rows.length > 0) {
                    $scope.ERAParsingLogsList = resp.data.rows || [];
                    $scope.EditERAParsingLogs.Count = resp.data.count || 0;
                    $scope.SelectParsingStatus();
                }

            }, function (err) {


            });

        }
        $scope.selectedERA_ParsingLogsList = eHnoteMasterDataService.getERAParsingLogsList();
        if ($scope.selectedERA_ParsingLogsList != '') {
            $scope.selectedRangeId = $scope.selectedERA_ParsingLogsList.selectedRangeId || '';
            $scope.EditERAParsingLogs.FromDate = $scope.selectedERA_ParsingLogsList.FromDate || null;
            $scope.EditERAParsingLogs.ToDate = $scope.selectedERA_ParsingLogsList.ToDate || null;
            $scope.EditERAParsingLogs.EDIFileName = $scope.selectedERA_ParsingLogsList.EDIFileName || '';
            $scope.EditERAParsingLogs.StatuId = $scope.selectedERA_ParsingLogsList.StatuId || 0;
            $scope.EditERAParsingLogs.SourceTypeId = $scope.selectedERA_ParsingLogsList.SourceTypeId || 0;

        } else {
            $scope.selectedRangeId = '',
                $scope.EditERAParsingLogs = {
                    FromDate: moment().format("MM-DD-YYYY"),
                    ToDate: moment().format("MM-DD-YYYY"),
                    EDIFileName: '',
                    StatuId: 0,
                    SourceTypeId: 0,
                }
        }
        $scope.SearchERAParsingList();


        $scope.RefreshERAParsingList = function () {

            $scope.selectedRangeId = "";
            //var currentDate = new Date();
            //$scope.EditERAParsingLogs.FromDate = new Date(currentDate);
            //$scope.EditERAParsingLogs.ToDate = new Date(currentDate);
            //if ($scope.EditERAParsingLogs.FromDate != '') {
            //    $scope.EditERAParsingLogs.FromDate = $filter('date')($scope.EditERAParsingLogs.FromDate, "MM-dd-yyyy");
            //}
            //if ($scope.EditERAParsingLogs.ToDate != '') {
            //    $scope.EditERAParsingLogs.ToDate = $filter('date')($scope.EditERAParsingLogs.ToDate, "MM-dd-yyyy");
            //}

            //$scope.EditERAParsingLogs.EDIFileName = "";
            //$scope.EditERAParsingLogs.StatuId = 0;
            //$scope.EditERAParsingLogs.SourceTypeId = 0;

            $scope.EditERAParsingLogs = $scope.GetERAParsingLogs();
            $scope.SearchERAParsingList();

        }


        $scope.ViewPArsingLogs = function (item) {
            $scope.ERAParsingDetails = item;
            $scope.ERAParsing3UrlData = "";
            $scope.ERAParsing3UrlData = $scope.ERAParsingDetails.LogFileURL;
            if ($scope.ERAParsing3UrlData) {
                if (!$scope.ERAParsing3UrlData || $scope.ERAParsing3UrlData === "") {
                    alertify.error("There is no ERA Parsing Log View");
                }
                else {
                    $scope.mInstanceAdd = $uibModal.open({
                        "templateUrl": "ViewParsingLogPreview.html",
                        "size": "md",
                        "keyboard": false,
                        "windowClass": "modal__ninety--",
                        "scope": $scope,

                        "resolve": {
                            "ERAParsingDetails": function () { return $scope.ERAParsing3UrlData; },
                        },
                        "http": $http,
                        "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientDataService, ERAParsingDetails, $http) {

                            $scope.uibclose = function () {
                                $uibModalInstance.dismiss("cancel");
                            };
                            $scope.ERAParsing3UrlData = ERAParsingDetails;
                            if ($scope.ERAParsing3UrlData) {

                                loadFileContent($scope.ERAParsing3UrlData);
                            }
                            function loadFileContent(LogFileURL) {
                                if (LogFileURL) {
                                    $http.get(LogFileURL)
                                        .then(function (response) {
                                            $scope.fileContent = response.data;
                                        });
                                } else {
                                    $scope.fileContent = "";
                                }
                            }
                        }


                    });

                    $scope.mInstanceAdd.result.then(function (response) {
                    }, function () { });
                }


            }
            else {
                alertify.error("There is no ERA Parsing Log View");
            }
        }

        $scope.UploadEra = function () {
         
            $scope.EraFtfDataList = [];
            var param = {
                "OrganizationId": $scope.HospitalId,
                "PageSize": 10,
                "PageNumber": 1,
                "ActiveInd": 1
            }

          
                eHnoteInsuranceService.GetOrgEraFtpDetails(param)
           .then(function (resp) {
                console.log(resp);
                if (resp.data.rows != undefined) {
                    console.log(resp.data.rows);
                    $scope.EraFtfDataList = resp.data.rows[0] || [];
                    console.log($scope.EraFtfDataList);
                  
                }

            });
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "UploadEra.html",
                "size": "md",
                "keyboard": false,
                "windowClass": "modal__ninety--",
                "scope": $scope,

                "resolve": {
                },
                "http": $http,
                "controller": function ($scope, $uibModal, $uibModalInstance) {

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                        $scope.clearera();
                      
                    };
                    $scope.GetFilesObj = function () {
                        return {
                            "TempEraFilesArray": [],
                        };
                    };
                    $scope.FilesObj = angular.copy($scope.GetFilesObj());
                    $scope.selectedfiles = function (files) {
                        files = files || [];
                        // Check for maximum file count
                        if (files.length > 20) {
                            alertify.error("You can upload a maximum of 20 files.");
                            angular.element("input[type='file']").val(null); // Clear the input
                            return; // Exit the function
                        }
                        if (files.length > 0) {
                            //let validfiles = true;
                            //angular.forEach(files, function (item) {
                            //    if (item.type !== 'text/plain') {
                            //        validfiles = false;
                            //        return;
                            //    }
                            //})
                            //if (!validfiles) {

                            //    alertify.error("Please upload only .txt files.");
                            //    angular.element("input[type='file']").val(null);
                            //    return;
                            //}
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
                                    var obj = {
                                        "file": $scope.file,
                                        "FileTypeId": parseInt($scope.SelectedFile),
                                        "S3URL": "",
                                        "DisplayName": $scope.file.name || "",
                                        "FileName": $scope.file.name || "",
                                        "FileExt": $scope.file.type,

                                    };

                                    $scope.FilesObj.TempEraFilesArray.push(obj);


                                    angular.element("input[type='file']").val(null);
                                }
                            });
                        }
                        $scope.IsDisabled = false;
                    };
                  
                    $scope.DeleteERAFile = function (item) {
                        var index = $scope.FilesObj.TempEraFilesArray.indexOf(item);
                        if (index !== -1) {
                            $scope.FilesObj.TempEraFilesArray.splice(index, 1);
                        }
                    };
                    $scope.UploadManualEra = function (item) {
                        if (item) {
                            $scope.IsParsed = item;
                        }
                        else {
                            $scope.IsParsed = item;
                        }
                        console.log($scope.EraFtfDataList)
                        var obj = {
                            "ParentOrganizationId": $scope.ParenthospitalId || 0,
                            "UserID": eHnoteMasterDataService.getLoginId(),
                            "OrganizationId": $scope.HospitalId,
                            "EraFTPDetailId": $scope.EraFtfDataList.EraFTPDetailId,
                            "EraFTPUserName": $scope.EraFtfDataList.FTPUserName,
                            "EraFTPPassword": $scope.EraFtfDataList.FTPPassword,
                            "EraFiles": $scope.FilesObj.TempEraFilesArray,
                            "IsParsed": $scope.IsParsed
                        }
                        eHnoteInsuranceService.AddManualEraFileUploads(obj, OnFilesObjSuccess, OnFilesObjError)
                        console.log(obj);
                    }
                    function OnFilesObjSuccess(data) {
                        alertify.success("Era Files uploaded successfully");
                        $scope.SearchERAParsingList();
                        $scope.uibclose();
                    }

                    function OnFilesObjError(data) {
                        alertify.success("An error occured");
                        console.log(data);
                    }
                    $scope.clearera = function () {
                        $scope.FilesObj = angular.copy($scope.GetFilesObj());
                    }
                }


            });

            $scope.mInstanceAdd.result.then(function (response) {
            }, function () { });
           
        }
       
        
}]);
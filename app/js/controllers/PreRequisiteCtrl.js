
eHnoteWebApp.controller("PreRequisiteCtrl", ["$scope", "$state", "$stateParams", "toastr", "CacheService", "$timeout", "$rootScope", "datapersistanceFactory", "$filter", "eHnotePatientPreRequisiteService", "$sce", function ($scope, $state, $stateParams, toastr, CacheService, $timeout, $rootScope, datapersistanceFactory, $filter, eHnotePatientPreRequisiteService, $sce) {
    $scope.currentDate = new Date();


    $scope.SelectedPatientAppoitment = CacheService.getAppointmentData();
    $scope.GetPreRequisiteImageObject = function () {

        return [{
            "AppointmentId": "",
            "DeleteAllImgInd": false,
            "ImagesArray": [],
            "DoctorName": "",
            "DoctorId": "",
            "FileDate": "",
            "MasterPatientId": "",
            "PatientName": "",
            "VectorTypeId": 1,
            "VectorType": "Right",
            "OrganId": "",
            "UserId": 0,
            "File": ""

        },
        {
            "AppointmentId": "",
            "DeleteAllImgInd": false,
            "ImagesArray": [],
            "DoctorName": "",
            "DoctorId": "",
            "FileDate": "",
            "MasterPatientId": "",
            "PatientName": "",
            "VectorTypeId": 2,
            "VectorType": "Top",
            "OrganId": "",
            "UserId": 0,
            "File": ""

        },
        {
            "AppointmentId": "",
            "DeleteAllImgInd": false,
            "ImagesArray": [],
            "DoctorName": "",
            "DoctorId": "",
            "FileDate": "",
            "MasterPatientId": "",
            "PatientName": "",
            "VectorTypeId": 3,
            "VectorType": "Left",
            "OrganId": "",
            "UserId": 0,
            "File": ""

        },
        {
            "AppointmentId": "",
            "DeleteAllImgInd": false,
            "ImagesArray": [],
            "DoctorName": "",
            "DoctorId": "",
            "FileDate": "",
            "MasterPatientId": "",
            "PatientName": "",
            "VectorTypeId": 4,
            "VectorType": "Bottom",
            "OrganId": "",
            "UserId": 0,
            "File": ""

        }
        ];
    };
    $scope.OtherImagePreRequisiteobj = function () {
        return {
            "AppointmentId": $scope.SelectedPatientAppoitment.AppointmentId,
            "DeleteAllImgInd": false,
            "ImagesArray": [],
            "DoctorName": $scope.SelectedPatientAppoitment.DoctorName,
            "DoctorId": $scope.SelectedPatientAppoitment.DoctorId,
            "FileDate": new Date(),
            "MasterPatientId": $scope.MasterPatientData.MasterPatientId,
            "PatientName": $scope.MasterPatientData.FirstName,
            "VectorTypeId": 5,
            "OrganId": 4,
            "UserId": 0,
            "File": ""

        }
    };

    $scope.OtherVideoPreRequisiteobj = function () {
        return {
            "AppointmentId": $scope.SelectedPatientAppoitment.AppointmentId,
            "DeleteAllImgInd": false,
            "ImagesArray": [],
            "DoctorName": $scope.SelectedPatientAppoitment.DoctorName,
            "DoctorId": $scope.SelectedPatientAppoitment.DoctorId,
            "FileDate": new Date(),
            "MasterPatientId": $scope.MasterPatientData.MasterPatientId,
            "PatientName": $scope.MasterPatientData.FirstName,
            "VectorTypeId": 6,
            "OrganId": 4,
            "UserId": 0,
            "File": ""

        }
    };



    $scope.files = "";
    $scope.uploadPatientFiles = function (file, item) {
        console.log(file);
        console.log(item);
    }



    $scope.PreRequisiteRightEyeImage = angular.copy($scope.GetPreRequisiteImageObject());
    $scope.PreRequisiteLeftEyeImage = angular.copy($scope.GetPreRequisiteImageObject());


    angular.forEach($scope.PreRequisiteRightEyeImage, function (item, index) {
        item.OrganId = 1;
        item.AppointmentId = $scope.SelectedPatientAppoitment.AppointmentId;
        item.DoctorName = $scope.SelectedPatientAppoitment.DoctorName;
        item.DoctorId = $scope.SelectedPatientAppoitment.DoctorId;
        item.FileDate = new Date();
        item.MasterPatientId = $scope.MasterPatientData.MasterPatientId;
        item.PatientName = $scope.MasterPatientData.FirstName;
    });

    angular.forEach($scope.PreRequisiteLeftEyeImage, function (item, index) {
        item.OrganId = 2;
        item.AppointmentId = $scope.SelectedPatientAppoitment.AppointmentId;
        item.DoctorName = $scope.SelectedPatientAppoitment.DoctorName;
        item.FileDate = new Date();
        item.MasterPatientId = $scope.MasterPatientData.MasterPatientId;
        item.PatientName = $scope.MasterPatientData.FirstName;
    });
    $scope.OtherImagePreRequisite = angular.copy($scope.OtherImagePreRequisiteobj());
    $scope.OtherVideoPreRequisite = angular.copy($scope.OtherVideoPreRequisiteobj());


    $scope.uploadPreRequisiteImg = function (file, item) {

        var fd = new FormData();
        fd.append("UserID", item.DoctorId);
        //fd.append("HospitalID", item.HospitalID);
        fd.append("DoctorName", item.DoctorName);
        fd.append("MasterPatientId", item.MasterPatientId);
        fd.append("PatientName", item.PatientName);
        fd.append("AppointmentId", item.AppointmentId);
        fd.append("DeleteAllImgInd", item.DeleteAllImgInd);
        fd.append("VectorTypeId", item.VectorTypeId);
        fd.append("OrganId", item.OrganId);
        fd.append("DeleteInd", 'N');
        fd.append("PreRequisiteId", 0);
        fd.append("FileDate", $filter('date')(new Date($scope.currentDate), "yyyy-MM-dd"));
        angular.forEach(file, function (value, key) {
            fd.append(key, value);
        });


        eHnotePatientPreRequisiteService.UploadPatientPreRequisiteRecords(fd, onuploadfilesuccess, onuploadFileerror);
        function onuploadfilesuccess(resp) {

            toastr.success("File Uploading Successfully");
            $('#noFile').html('No file chosen...');
            resp.data.rows[0].ImagesArray[0].PreRequisiteId = resp.data.rows[0].PreRequisiteId;
            resp.data.rows[0].ImagesArray[0].AppointmentId = resp.data.rows[0].AppointmentId;
            item.ImagesArray.push(resp.data.rows[0].ImagesArray[0]);
        }
        function onuploadFileerror(err) {
            console.log(err);
            toastr.error("Uploading Failed");
        }
    }

    $scope.DeleteUploadedFile = function (item, type) {

        var params = {
            "AppointmentId": item.AppointmentId,
            "DeleteAllImgInd": false,
            "ImagesArray": [],
            "DoctorName": item.DoctorName,
            "FileDate": new Date(),
            "MasterPatientId": $scope.MasterPatientData.MasterPatientId,
            "PatientName": $scope.MasterPatientData.FirstName,
            "VectorTypeId": item.VectorTypeId,
            "OrganId": item.OrganId,
            "UserId": 0,
            "DeleteInd": 'Y',
            "PreRequisiteId": item.PreRequisiteId

        };



        if (angular.isObject(item)) {
            item.DeleteInd = 'Y';
            params.ImagesArray.push(item);
        }


        eHnotePatientPreRequisiteService.DeletePatientPreRequisiteImg(params, onupdateDeletesuccess, onupdateDelerror);
        function onupdateDeletesuccess(response) {
            if (response.data.status == "Success") {
                $scope.GetPatientAppointmnetPreRequisite();
                toastr.success("Deleted successfully");
            }

        }
        function onupdateDelerror(errordata) {
            console.log(errordata);
        }
    };

    $scope.GetPatientAppointmnetPreRequisite = function () {
        eHnotePatientPreRequisiteService.GetPatientAppointmnetPreRequisite($scope.MasterPatientData.MasterPatientId, $scope.SelectedPatientAppoitment.AppointmentId).then(function (data, status) {


            $scope.PatientAppointmentsPreRequisiteList = data.data.rows;

            var imagesarray = [];
            angular.forEach($scope.PatientAppointmentsPreRequisiteList, function (item, index) {
                if (item.ImagesArray.length !== 0) {
                    item.ImagesArray[0].PreRequisiteId = item.PreRequisiteId || "";
                    item.ImagesArray[0].AppointmentId = item.AppointmentId || "";
                    imagesarray.push(item.ImagesArray[0]);
                }

            });

            angular.forEach(imagesarray, function (item) {
                if (item.OrganId == 1) {
                    angular.forEach($scope.PreRequisiteRightEyeImage, function (subitem, index) {
                        if (item.VectorTypeId == subitem.VectorTypeId) {
                            subitem.ImagesArray.push(item);
                        }
                    });
                }
                if (item.OrganId == 2) {
                    angular.forEach($scope.PreRequisiteLeftEyeImage, function (subitem, index) {
                        if (item.VectorTypeId == subitem.VectorTypeId) {
                            subitem.ImagesArray.push(item);
                        }
                    });
                }

                if (item.OrganId == 4) {
                    if (item.VectorTypeId == 6) {
                        item.S3URL = $sce.trustAsResourceUrl(item.S3URL);
                        $scope.OtherVideoPreRequisite.ImagesArray.push(item);
                    } else {
                        $scope.OtherImagePreRequisite.ImagesArray.push(item);
                    }



                }
            });


        }, function (data) {

        });
    }
    $scope.Init = function () {

        $scope.GetPatientAppointmnetPreRequisite();

    }
    $scope.Init();

    $scope.uploadVideo = function (item) {
        console.log($scope.myFile);
        var fd = new FormData();
        fd.append("UserID", item.DoctorId);
        //fd.append("HospitalID", item.HospitalID);
        fd.append("DoctorName", item.DoctorName);
        fd.append("MasterPatientId", item.MasterPatientId);
        fd.append("PatientName", item.PatientName);
        fd.append("AppointmentId", item.AppointmentId);
        fd.append("DeleteAllImgInd", item.DeleteAllImgInd);
        fd.append("VectorTypeId", item.VectorTypeId);
        fd.append("OrganId", item.OrganId);
        fd.append("DeleteInd", 'N');
        fd.append("PreRequisiteId", 0);
        fd.append("FileDate", $filter('date')(new Date($scope.currentDate), "yyyy-MM-dd"));
        fd.append('file', $scope.myFile);



        eHnotePatientPreRequisiteService.UploadPatientPreRequisiteRecords(fd, onuploadfilesuccess, onuploadFileerror);
        function onuploadfilesuccess(resp) {

            toastr.success("Video Uploading Successfully");
            $scope.myFile = "";
            resp.data.rows[0].ImagesArray[0].PreRequisiteId = resp.data.rows[0].PreRequisiteId;
            resp.data.rows[0].ImagesArray[0].AppointmentId = resp.data.rows[0].AppointmentId;
            item.ImagesArray.push(resp.data.rows[0].ImagesArray[0]);
        }
        function onuploadFileerror(err) {
            console.log(err);
            toastr.error("Uploading Failed");
        }
    }
}]);
"use strict"; eHnoteWebApp.controller("UsEhnoteAmbientAiVoicetoTextCtrl", ["$scope", "$rootScope", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteLoginStatusService", "eHnoteMainAppointmentService", "eHnotePatientDataService", "$location", "eHnoteCacheStorageService", "datapersistanceFactory", "eHnoteUserDataService", "localStorageFactory", "eHnotePatientAddressDataServices", "$uibModal", "$uibModalInstance", "$sce", "mainObject", function ($scope, $rootScope, $filter, alertify, eHnoteMasterDataService, eHnoteLoginStatusService, eHnoteMainAppointmentService, eHnotePatientDataService, $location, eHnoteCacheStorageService, datapersistanceFactory, eHnoteUserDataService, localStorageFactory, eHnotePatientAddressDataServices, $uibModal, $uibModalInstance, $sce, mainObject) {
    var doctorinfo = eHnoteMasterDataService.getUserInfo(); $scope.UserId = eHnoteMasterDataService.getLoginId(); if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) { $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID; }

    $scope.AmbientUrl = mainObject.AmbientUrl || "";
    $scope.SessionToken = mainObject.SessionToken || "";
    $scope.isLoading = true;
    $scope.loadError = false;
    $scope.errorMessage = "";

    console.log(mainObject);
    console.log($scope.SessionToken);

    if (!$scope.AmbientUrl || !$scope.SessionToken) {
        alertify.error("Invalid Ambient Session");
        $scope.isLoading = false;
        $scope.loadError = true;
        $scope.errorMessage = "Invalid Ambient Session. Missing URL or token.";
        return;
    }
    // ── Build correct launch URL ───────────────────────────────────────────
    var API_URL ="https://app-ehnote-ai-api.azurewebsites.net";


    var qs = [

        "token=" +
        encodeURIComponent($scope.SessionToken),

        "patient-id=" +
        encodeURIComponent(
            mainObject.AppointmentItem.PatientID || ""
        ),

        "doctor-id=" +
        encodeURIComponent(
            mainObject.AppointmentItem.DoctorID || ""
        ),

        "appointment-id=" +
        encodeURIComponent(
            mainObject.AppointmentItem.AppointmentID || ""
        ),

        "encounter-type=FollowUp",

        "api-url=" +
        encodeURIComponent(API_URL),

        "language=en-US"

    ].join("&");



    $scope.IframeUrl =
        $scope.AmbientUrl.replace(/\/$/, "") +
        "/launch.html?" + qs;

    $scope.IframeUrl = $scope.AmbientUrl + "/launch.html?" + qs;
    $scope.SafeIframeUrl = $sce.trustAsResourceUrl($scope.IframeUrl);
    $scope.isLoading = false;

    // ── Listen for events from iframe ─────────────────────────────────────
    var ambientOrigin = new URL($scope.AmbientUrl).origin;

    function receiveAmbientMessage(event) {
        console.log(event);
        if (event.origin !== ambientOrigin) return;

        var type = event.data && event.data.type;
        var sessionId = event.data && event.data.sessionId;

        if (type === "ambient:noteReady") {
            $rootScope.ambientSessionId = sessionId;

            var noteUrl = API_URL + "/api/sessions/" + sessionId + "/structured-notes/latest";
            fetch(noteUrl, {
                headers: { "Authorization": "Bearer " + $scope.SessionToken }
            })
                .then(function (r) {
                    if (!r.ok) throw new Error("HTTP " + r.status);
                    return r.json();
                })
                .then(function (noteResp) {
                    $rootScope.$broadcast("ambientNoteReady", {
                        sessionId: sessionId,
                        note: noteResp.note,
                        noteId: noteResp.noteId
                    });
                    alertify.success("Voice charting note is ready.");
                    $uibModalInstance.close({ sessionId: sessionId, note: noteResp.note });
                })
                .catch(function (err) {
                    console.error("Failed to fetch ambient note:", err);
                    alertify.error("Note is ready but could not be retrieved: " + err.message);
                });
        }

        if (type === "ambient:closed") {
            $uibModalInstance.dismiss("cancel");
        }
    }

    window.addEventListener("message", receiveAmbientMessage);

    function onBackdropClick(event) {
        if (event.target && angular.element(event.target).hasClass("modal-backdrop")) {
            $scope.$apply(function () {
                $scope.closeuibpopup();
            });
        }
    }
    document.addEventListener("click", onBackdropClick);

    $scope.IsAmbientMinimized = false;
    $scope.ToggleAmbientMinimize = function () {
        $scope.IsAmbientMinimized = !$scope.IsAmbientMinimized;
    };

    $scope.closeuibpopup = function () {
        window.removeEventListener("message", receiveAmbientMessage);
        document.removeEventListener("click", onBackdropClick);
        $uibModalInstance.dismiss("cancel");
    };

    $scope.$on("$destroy", function () {
        window.removeEventListener("message", receiveAmbientMessage);
        document.removeEventListener("click", onBackdropClick);
    });
}]);
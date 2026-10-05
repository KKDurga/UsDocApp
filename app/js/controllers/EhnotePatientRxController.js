
"use strict";
eHnoteWebApp.controller("EhnotePatientRxController", ["$scope", "$rootScope", "$filter", "eHnoteMasterDataService", "eHnoteCacheStorageService", "eHnotePatientDataService", "alertify", "eHnotePrintService", "eHnoteDiagnosisDataServices", "Lightbox", "eHnoteSettingsDataService", "$timeout", "$uibModal", "eHnoteUserAppointmentDataService", "eHnoteInsuranceService", "eHnotePatientAddressDataServices", "datapersistanceFactory",
    function ($scope, $rootScope, $filter, eHnoteMasterDataService, eHnoteCacheStorageService, eHnotePatientDataService, alertify, eHnotePrintService, eHnoteDiagnosisDataServices, Lightbox, eHnoteSettingsDataService, $timeout, $uibModal, eHnoteUserAppointmentDataService, eHnoteInsuranceService, eHnotePatientAddressDataServices, datapersistanceFactory) {

        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();

        var patientInfo = eHnoteMasterDataService.getpatientData();

        console.log(patientInfo);

        $scope.PatientId = patientInfo.Patient[0].PatientID;
        $scope.PatientRcopiaID = patientInfo.Patient[0].RcopiaPatientId;
        $scope.AppId = appointmentinfo.AppointmentID;
        $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.MainSpecialization = {
            "SpecializationId": $scope.doctorinfo.doctordata.User[0].SpecializationId
        }
        $scope.ShowNewConsultation = 'N';
        $scope.UserSettingObject = datapersistanceFactory.getItem('UserSettingsData');
        if ($scope.UserSettingObject !== undefined) {
            if ($scope.UserSettingObject.ShowNewConsultation) {
                $scope.ShowNewConsultation = 'Y';
            }
        }


        if ($scope.doctorinfo.RoleID === 1) {
            $scope.DoctorId = $scope.doctorinfo.doctorid;
        } else {
            $scope.DoctorId = 0;
        }
        $rootScope.patientdetailesConsultation = true;
        $scope.$emit("patientInfoDetails", appointmentinfo);
        $scope.currentDate = appointmentinfo.ConsultationDt;
        $scope.SelectedConsertFromId = 0;
        $scope.SelectedConsertFrom = "";
        var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();

        $scope.MedicalConditionsPageNumber = 1;
        $scope.MedicalConditionsPageSize = 10;


        $scope.rxTab = 3;


        $scope.PrescriptionsArray = [];


        $scope.getPatientactiveReqObj = {
            "PatientId": appointmentinfo.PatientID,
            "OrganizationId": appointmentinfo.HospitalId,
            "PageSize": 20,
            "PageNumber": 1,
            "TotalCount":0
        }


        $scope.GetPatientCurrentActiveMedicationsList = function () {
            // $scope.AppId
            var obj = {
                "PatientId": $scope.getPatientactiveReqObj.PatientId,
                "OrganizationId": $scope.getPatientactiveReqObj.OrganizationId,
                "PageSize": $scope.getPatientactiveReqObj.PageSize,
                "PageNumber": $scope.getPatientactiveReqObj.PageNumber
            }

            eHnoteDiagnosisDataServices.GetPatientActiveMedicationsList(obj).then(function (resp) {

                console.log(JSON.stringify(resp));

              
             
                $scope.PrescriptionsArray = [];
                if (resp.data.Status == "Success") {
                    $scope.PrescriptionsArray = resp.data.rows || [];
                    angular.forEach($scope.PrescriptionsArray, function (pitem) {
                        pitem.IsSelected = false;
                    });
                }
            }, function (err) {

            });
        }


        $scope.changePageNumber = function (PageNumber) {
            $scope.MedicalConditionsPageNumber = PageNumber;
            $scope.GetPatientCurrentActiveMedicationsList();
        };


        $scope.AppointmentPrescriptionsList = [];
        $scope.getPatientPrescriptionsById = function () {
            var params = {
                "PatientId": appointmentinfo.PatientID
            }

            eHnotePatientDataService.GetPrescriptionAppointmentsByPatientId(params).then(function (response) {

                console.log(response);
                response.data.rows = response.data.rows || [];
                if (response.data.rows.length > 0) {
                    $scope.AppointmentPrescriptionsList = response.data.rows;

                    angular.forEach($scope.AppointmentPrescriptionsList, function (sitem) {
                        sitem.Prescription = sitem.Prescription || [];
                        sitem.PrescriptionDetails = [];
                        if (sitem.Prescription.length > 0) {
                            sitem.PrescriptionDetails = sitem.Prescription[0].Prescriptiondetails;
                        }
                    });
                } else {
                    $scope.AppointmentPrescriptionsList = [];
                }

            }, function (err) {
                console.log(err);
                alertify.error("Getting Patient Billing Failed");
            });
        }

        $scope.init = function () {

            $scope.GetPatientCurrentActiveMedicationsList();

        };

        $scope.init();

        $scope.navtoEPrescribe = function () {
            console.log($scope.PrescriptionsArray);
            var tempArray = $filter('filter')($scope.PrescriptionsArray, { 'IsSelected': true });
            if (tempArray.length === 0) {
                alertify.error("please select a medication to continue");
                return false;
            }
            else {

                var obj = {
                    "UserId": $scope.UserId,
                    "HospitalId": $scope.HospitalId,
                    "AppointmentInfo": appointmentinfo,
                    "Prescriptions": tempArray
                }
                $scope.mInstanceAdd = $uibModal.open({
                    "templateUrl": "templates/uibpopups/RxAppointmentConfirmation.html",
                    "backdrop": "static",
                    "scope": $scope,
                    "keyboard": false,
                    "size": "lg",
                    "resolve": {
                        "mainObject": function () { return obj; }
                    },
                    "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, mainObject) {

                        console.log(mainObject);


                        $scope.prescriptionArray = mainObject.Prescriptions || [];

                        angular.forEach($scope.prescriptionArray, function (pitem) {
                            pitem.PrescriptionId = 0;
                            pitem.PrescriptionHistoryId = 0;
                        });


                        $scope.currentformattedDate = moment().format('YYYY-MM-DD');
                        var currentStartTime = moment().format('HH:mm:ss');
                        var formattedStartTime = moment().format('HH:mm');

                        var endTime = moment().add(15, 'minutes');
                        var formattedEndTime = endTime.format('HH:mm');


                        var dayabbrevation = moment().format('ddd').toUpperCase();
                        var formattedDateTime = moment().format('YYYY-MM-DD HH:mm:ss');



                        function getEmptyPrescriptionObj() {


                            var TodayDate = $filter('date')(new Date(), "yyyy-MM-dd");

                            var obj = {
                                "UserId": mainObject.UserId,
                                "OrganizationId": mainObject.HospitalId,
                                "PatientId": mainObject.AppointmentInfo.PatientID,
                                "RcopiaPatientId": $scope.PatientRcopiaID,
                                "PatientPrescriptionId": 0,
                                "AppointmentId": "",
                                "ProviderId": "",
                                "PrescribedDate": TodayDate,
                                "RcopiaPrescriptionId": "",
                                "LastUpdateDate": TodayDate,
                                "PharmacyId": 0,
                                "RcopiaPharmacyId": "",
                                "PrescriberOrderNumber": "",
                                "RxReferenceNumber": "",
                                "PrescriptionAction": "",
                                "CompletedDate": null,
                                "SignedDate": null,
                                "StopDate": null,
                                "LastModifiedBy": mainObject.UserId,
                                "LastModifiedDate": TodayDate,
                                "CompleteAction": "Created",
                                "PrescriptionSentMethod": "",
                                "PrescriptionStatus": "",
                                "DeleteInd": "N",
                                "RcopiaDeleted": "n",
                                "PrescriptionDetails": []
                            };
                            return obj;
                        };

                        $scope.PrescriptionMainAddObj = getEmptyPrescriptionObj();

                        angular.forEach($scope.prescriptionArray, function (pitem) {

                            var obj = {
                                "PatientPrescriptionDetailId": 0,
                                "PatientPrescriptionId": 0,
                                "PatientId": mainObject.AppointmentInfo.PatientID,
                                "MedicationId": pitem.MedicationId,
                                "RcopiaDrugId": pitem.RcopiaDrugId,
                                "RcopiaMedicationId": 0,
                                "MedicationName": pitem.MedicationName,
                                "DrugNDCID": pitem.DrugNDCID,
                                "DrugFirstDataBankMedID": pitem.DrugFirstDataBankMedID,
                                "DrugGenericId": pitem.DrugGenericId,
                                "DrugBrandName": pitem.DrugBrandName,
                                "DrugGenericName": pitem.DrugGenericName,
                                "DrugForm": pitem.DrugForm,
                                "DrugStrength": pitem.DrugStrength,
                                "DrugSchedule": "1",
                                "DrugSupply": pitem.DrugSupply,
                                "DrugCompound": pitem.DrugCompound,
                                "MedicationTypeId": pitem.MedicationTypeId,
                                "MedicationTypeName": pitem.MedicationTypeName,
                                "Sig": pitem.Sig,
                                "SigId": pitem.SigId,
                                "ActionId": pitem.ActionId,
                                "Action": pitem.Action,
                                "DoseId": pitem.DoseId,
                                "Dose": pitem.Dose,
                                "DoseUnitId": pitem.DoseUnitId,
                                "DoseUnit": pitem.DoseUnit,
                                "RouteId": pitem.RouteId,
                                "Route": pitem.Route,
                                "FrequencyId": pitem.FrequencyId,
                                "Frequency": pitem.Frequency,
                                "DoseOtherId": pitem.DoseOtherId,
                                "DoseOther": pitem.DoseOther,
                                "DaysSupplyId": pitem.DaysSupplyId,
                                "DaysSupply": pitem.DaysSupply,
                                "Quantity": pitem.Quantity,
                                "QuantityUnitId": pitem.QuantityUnitId,
                                "QuantityUnit": pitem.QuantityUnit,
                                "RefillId": pitem.RefillId,
                                "Refills": pitem.Refills,
                                "SubstitutionPermitted": pitem.SubstitutionPermitted,
                                "PatientInstructions": pitem.PatientInstructions,
                                "DeleteInd": "N",
                                "OtherNotes": pitem.OtherNotes,
                                "Remarks": pitem.Remarks,
                                "StartDate": $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss"),
                                "StopDate": null,
                                "FillDate": $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss"),
                                "StopReason": "",
                                "RcopiaMedicationStatus": "",
                                "IsEditMode": true
                            };

                            $scope.PrescriptionMainAddObj.PrescriptionDetails.push(obj);
                        });

                        $scope.addNewApptPrescriptionObj = {
                            "UserId": mainObject.UserId,
                            "AppointmentId": 0,
                            "PatientID": mainObject.AppointmentInfo.PatientID,
                            "PatientRcopiaID": $scope.PatientRcopiaID,
                            "ParentAppointmentId": 0,
                            "OrganizationId": mainObject.HospitalId,
                            "ParentOrganizationId": 3,
                            "ConsultationId": 0,
                            "AppointmentStatus": "B",
                            "CurrentTime": currentStartTime,
                            "StartTime": formattedStartTime,
                            "EndTime": formattedEndTime,
                            "DoctorID": 3,
                            "DayCD": dayabbrevation,
                            "VisitRemarks": "Rx Appointment",
                            "IsConfirmedAppointment": true,
                            "IsWaitingListAppointment": false,
                            "IsNoShowAppointment": false,
                            "AppointmentDate": $scope.currentformattedDate,
                            "UserBranchId": 0,
                            "AppointmentTypeId": 9,
                            "AppointmentPatientTypeId": 2,
                            "SubSpecializationId": 1,
                            "BranchSubSpecializationId": 1,
                            "PatientTypeId": 1,
                            "IsConsultationFollowUp": false,
                            "IsCheckedIn": 1,
                            "PaymentTypeId": 1,
                            "DeviceEntityTypeId": 2,
                            "VisitReasonId": 1,
                            "ConfirmationStatusId": 2,
                            "SpecializationId": 1,
                            "ConsultationStartTime": formattedDateTime,
                            "ConsultationEndTime": formattedDateTime,
                            "Prescription": $scope.PrescriptionMainAddObj,
                            "DocObj": "",
                            "UserFullName": "",
                            "Mode":"eRx"
                        }


                    
                     


                        console.log(JSON.stringify($scope.addNewApptPrescriptionObj));

                        $scope.closeuibpopup = function () {
                            $uibModalInstance.dismiss("cancel");

                        };

                     

                        $scope.ClearDetails = function () {
                            $uibModalInstance.close("save");
                        };


                        $scope.changeAppointmentRxDoctor = function (item) {
                            console.log(item);
                            $scope.addNewApptPrescriptionObj.DoctorID = item.DoctorID;
                            $scope.addNewApptPrescriptionObj.UserBranchId = item.UserBranchId;
                            $scope.addNewApptPrescriptionObj.Prescription.ProviderId = item.DoctorID;
                            if (item.UserSubSpecialization.length > 0) {
                                angular.forEach(item.UserSubSpecialization, function (mitem) {
                                    if (mitem.IsPrimarySubSpecialization === true) {
                                        $scope.addNewApptPrescriptionObj.SubSpecializationId = mitem.SubSpecializationId;
                                        $scope.addNewApptPrescriptionObj.BranchSubSpecializationId = mitem.BranchSubSpecializationId;
                                    }
                                });
                            }
                        };

                        $scope.continuetoBookAppointment = function () {

                            var Appparams = $scope.addNewApptPrescriptionObj;

                            console.log(JSON.stringify(Appparams));


                            eHnoteUserAppointmentDataService.AddAppointmentAndCreatePrescription(Appparams, OnAddApointmentSuccess, onAddAppointmentError);
                            function OnAddApointmentSuccess(response) {

                                console.log(response);

                                if (response.Status === "Success") {

                                    response.Prescription.PatientPrescriptionId = response.Prescription.PatientPrescriptionId || 0;

                                    if (response.Prescription.PatientPrescriptionId!==0) {
                                        $scope.addNewApptPrescriptionObj.Prescription.PatientPrescriptionId = response.Prescription.PatientPrescriptionId;
                                        $scope.addNewApptPrescriptionObj.PrescribedDate = response.Prescription.PrescribedDate;
                                    }

                                    response.Prescription.PrescriptionDetails = response.Prescription.PrescriptionDetails || [];
                                    if (response.Prescription.PrescriptionDetails.length > 0) {
                                        angular.forEach($scope.addNewApptPrescriptionObj.Prescription.PrescriptionDetails, function (pitem) {


                                            var filteredarray = [];
                                            if (pitem.MedicationId === 0) {
                                                if (pitem.RcopiaDrugId !== "") {
                                                    filteredarray = $filter("filter")(response.Prescription.PrescriptionDetails, { "RcopiaDrugId": pitem.RcopiaDrugId }, true) || [];
                                                } else {
                                                    filteredarray = $filter("filter")(response.Prescription.PrescriptionDetails, { "MedicationName": pitem.MedicationName }, true) || [];
                                                }

                                            } else {
                                                filteredarray = $filter("filter")(response.Prescription.PrescriptionDetails, { "MedicationId": pitem.MedicationId }, true) || [];
                                            }

                                            if (filteredarray.length > 0) {
                                                pitem.PatientPrescriptionDetailId = filteredarray[0].PatientPrescriptionDetailId;
                                                pitem.PatientPrescriptionId = filteredarray[0].PatientPrescriptionId;
                                            }

                                        });
                                    }
                                    



                                    $uibModalInstance.close($scope.addNewApptPrescriptionObj);
                                }
                                if (response.Status == "Failure") {
                                    alertify.error(response.Message);
                                }
                            }

                            function onAddAppointmentError() {

                            }
                        };

                    }
                });
                $scope.mInstanceAdd.result.then(function (resp) {


                    console.log(resp);

                    if ($scope.PatientRcopiaID !== 0) {
                        $scope.medicalrxsUIB(resp);
                    } else {
                        $scope.continuetoAddPatientToRcopia(resp);
                    }
                    

                }, function (cancel) {
                });

            }
        };


       

        $scope.switchRxTab = function (tabno) {
            console.log(tabno);

            $scope.rxTab = tabno;

            if ($scope.rxTab === 1) {
                $scope.getPatientPrescriptionsById();
            }
            if ($scope.rxTab === 3) {
                $scope.GetPatientCurrentActiveMedicationsList();

            }
        }


        $scope.continuetoAddPatientToRcopia = function (apptresponse) {



            $scope.addUpdatePatientToRcopiaReqObj = {
                "VendorName": $scope.doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
                "VendorPassword": $scope.doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
                "PracticeUserName": $scope.doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId,
                "ProviderUserName": $scope.doctorinfo.doctordata.UserAddress[0].RcopiaProviderUserName,
                "PatientList": []
            };

            $scope.addUpdatePatientToRcopiaReqObj.PatientList = [];


            function getnewRcopiaPatientObj() {
                var obj = {
                    "FirstName": "",
                    "LastName": "",
                    "ExternalID": "",
                    "RcopiaPatientId": $scope.PatientRcopiaID || 0,
                    "DOB": "",
                    "Sex": "",
                    "HomePhone": "",
                    "Address1": "",
                    "Address2": "",
                    "City": "",
                    "State": "",
                    "Zip": ""
                };
                return obj;
            }

            $scope.RcopiaPatientObj = getnewRcopiaPatientObj();

            $scope.RcopiaPatientObj.FirstName = patientInfo.Patient[0].FirstName;
            $scope.RcopiaPatientObj.LastName = patientInfo.Patient[0].LastName || "";
            $scope.RcopiaPatientObj.ExternalID = patientInfo.Patient[0].PatientID;
            $scope.RcopiaPatientObj.DOB = $scope.DisplayDate = $filter('date')(new Date(patientInfo.Patient[0].DOB), "MM/dd/yyyy");
            var cGender = "M";
            if (patientInfo.Patient[0].Gender == 'Female') {
                cGender = "F";
            };

            $scope.RcopiaPatientObj.Sex = cGender;
            $scope.RcopiaPatientObj.HomePhone = patientInfo.Patient[0].MobileNo;
            $scope.RcopiaPatientObj.Address1 = patientInfo.PatientAddress.PermanentAddress.AddressLine1;
            $scope.RcopiaPatientObj.Address2 = patientInfo.PatientAddress.PermanentAddress.AddressLine2;
            $scope.RcopiaPatientObj.City = patientInfo.PatientAddress.PermanentAddress.CityName;
            $scope.RcopiaPatientObj.State = patientInfo.PatientAddress.PermanentAddress.StateName;
            $scope.RcopiaPatientObj.Zip = patientInfo.PatientAddress.PermanentAddress.ZipCode;




            $scope.addUpdatePatientToRcopiaReqObj.PatientList.push($scope.RcopiaPatientObj);


            eHnoteDiagnosisDataServices.addPatientToRcopia($scope.addUpdatePatientToRcopiaReqObj).then(function (response) {

                console.log(JSON.stringify(response));

                if (response.data.status === 'Success') {
                    if (response.data.rows.length > 0) {
                        $scope.RcopiaPatientObj.RcopiaPatientId = response.data.rows[0].RcopiaPatientId;
                        $scope.selectedPatientData.Patient[0].RcopiaPatientId = response.data.rows[0].RcopiaPatientId;
                        $scope.PatientRcopiaID = response.data.rows[0].RcopiaPatientId;
                    }
                };




                $scope.medicalrxsUIB(apptresponse);

            });

        };



        $scope.medicalrxsUIB = function (response) {



            console.log(response);

          
            function getnewPrescriptionObj() {
                var obj = {
                    "UserId": $scope.UserId,
                    "DoctorId": response.DoctorId,
                    "PatientId": response.PatientId,
                    "OrganizationId": response.OrganizationId,
                    "AppointmentId": response.AppointmentId,
                    "ConsultationId": response.ConsultationId,
                    "PatientRcopiaId": $scope.PatientRcopiaID,
                    "VendorName": null,
                    "VendorPassword": null,
                    "PatientPrescriptionId": 0,
                    "PrescribedDate": $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss"),
                    "LastUpdateDate": $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss"),
                    "RcopiaPrescriptionId": "",
                    "EncounterDate": $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss"),
                    "EncounterActionTaken": "created",
                    "EncounterExternalId": "provider1_fo1650",
                    "EncounterUserName": "ksuggs",
                    "EncounterUserRcopiaId": null,
                    "EncounterUserExternalId": "provider1_fo1650",
                    "ProviderRcopiaId": null,
                    "ProviderUserName": null,
                    "ProviderExternalId": null,
                    "PreparerRcopiaId": null,
                    "PreparerUserName": null,
                    "PreparerExternalId": null,
                    "PharmacyNCPDPID": null,
                    "PharmacyRcopiaId": null,
                    "PharmacyExternalId": "",
                    "MedicationsList": []
                }

                return obj;
            }

            $scope.AddNewPrescriptionObj = getnewPrescriptionObj();

          



            angular.forEach(response.Prescription.PrescriptionDetails, function (pitem) {

                var obj = {
                    "PatientMedicationId": pitem.PatientPrescriptionDetailId,
                    "IsInPatientMedication": "n",
                    "HistorySource": "patient",
                    "HasScheduledDrug": "n",
                    "Deleted": "n",
                    "RcopiaMedicationId": "",
                    "MedicationId": pitem.MedicationId,
                    "DrugRocipaId": pitem.RcopiaDrugId,
                    "DrugFirstDataBankMedID": pitem.DrugFirstDataBankMedID,
                    "DrugNDCID": pitem.DrugNDCID,
                    "DrugRxNormId": "",
                    "DrugBrandName": pitem.DrugBrandName,
                    "GenericName": pitem.DrugGenericName,
                    "Form": pitem.DrugForm,
                    "Schedule": pitem.DrugSchedule,
                    "Strength": pitem.DrugStrength,
                    "Supply": "n",
                    "Compound": "n",
                    "Action": pitem.Action,
                    "Dose": pitem.Dose,
                    "Route": pitem.Route,
                    "DoseUnit": pitem.DoseUnit,
                    "DoseTiming": pitem.DoseTiming,
                    "DoseOther": pitem.DoseOther,
                    "Duration": pitem.DoseDuration,
                    "Quantity": pitem.Quantity,
                    "QuantityUnit": pitem.QuantityUnit,
                    "Refills": pitem.Refills,
                    "SubstitutionPermitted": pitem.SubstitutionPermitted,
                    "OtherNotes": pitem.OtherNotes,
                    "PatientNotes": pitem.PatientNotes,
                    "Comments": "",
                    "StartDate": $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss"),
                    "StopDate": "",
                    "FillDate": $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss"),
                    "StopReason": pitem.MedicineStopReason,
                    "DeleteInd": pitem.DeleteInd
                };


                $scope.AddNewPrescriptionObj.MedicationsList.push(obj);

            });





            console.log($scope.AddNewPrescriptionObj);
          

            eHnoteDiagnosisDataServices.addPatientMedicationsToRcopia($scope.AddNewPrescriptionObj).then(function (response) {

                console.log(JSON.stringify(response));


               

                $scope.openEPrescribe();


            });




        };



        $scope.RcopiaLocalPrescribeObj = {
            "PortalSystemName": $scope.doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
            "PracticeUserName": $scope.doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId,
            "RcopiaUserId": $scope.doctorinfo.doctordata.User[0].RcopiaProviderUserName,
            "UserExternalId": $scope.doctorinfo.doctordata.User[0].RcopiaProviderUserExternalId,
            "Service": "rcopia",
            "Action": "login",
            "StartUpScreen": "patient",
            "RcopiaPatientId": $scope.PatientRcopiaID,
            "RcopiaPatientName": "",
            "RcopiaPatientExternalId": "",
            "Time": "",
            "SecretKey": $scope.doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
            "MAC": ""
        };


        var hex_chr = "0123456789abcdef";
        function rhex(num) {
            var str = "";
            for (var j = 0; j <= 3; j++)
                str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
                    hex_chr.charAt((num >> (j * 8)) & 0x0F);
            return str;
        }

        function str2blks_MD5(str) {
            var nblk = ((str.length + 8) >> 6) + 1;
            var blks = new Array(nblk * 16);
            for (var i = 0; i < nblk * 16; i++) blks[i] = 0;
            for (i = 0; i < str.length; i++)
                blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
            blks[i >> 2] |= 0x80 << ((i % 4) * 8);
            blks[nblk * 16 - 2] = str.length * 8;
            return blks;
        }
        function add(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }

        function rol(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        }
        function cmn(q, a, b, x, s, t) {
            return add(rol(add(add(a, q), add(x, t)), s), b);
        }
        function ff(a, b, c, d, x, s, t) {
            return cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }
        function gg(a, b, c, d, x, s, t) {
            return cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }
        function hh(a, b, c, d, x, s, t) {
            return cmn(b ^ c ^ d, a, b, x, s, t);
        }
        function ii(a, b, c, d, x, s, t) {
            return cmn(c ^ (b | (~d)), a, b, x, s, t);
        }

        function gmtTime() {

            var GMTTime = new Date();
            var month = GMTTime.getUTCMonth() + 1;
            var day = GMTTime.getUTCDate();
            var year = GMTTime.getUTCFullYear() - 2000;
            var hour = GMTTime.getUTCHours();
            var min = GMTTime.getUTCMinutes();
            var sec = GMTTime.getUTCSeconds();

            if (month < 10) { month = "0" + month; }
            if (day < 10) { day = "0" + day; }
            if (hour < 10) { hour = "0" + hour; }
            if (hour < 1) { hour = "00"; }
            if (min < 10) { min = "0" + min; }
            if (min < 1) { min = "00"; }
            if (sec < 10) { sec = "0" + sec; }
            if (sec < 1) { sec = "00"; }

            var GMTime = month.toString() + day.toString() + year.toString() + hour.toString() + min.toString() + sec.toString();
            return GMTime;
        }

        function calcMD5(str) {
            var x = str2blks_MD5(str);
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;

            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;

                a = ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = ff(c, d, a, b, x[i + 10], 17, -42063);
                b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = ff(b, c, d, a, x[i + 15], 22, 1236535329);

                a = gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = gg(b, c, d, a, x[i + 12], 20, -1926607734);

                a = hh(a, b, c, d, x[i + 5], 4, -378558);
                d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = hh(b, c, d, a, x[i + 2], 23, -995338651);

                a = ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = ii(b, c, d, a, x[i + 9], 21, -343485551);

                a = add(a, olda);
                b = add(b, oldb);
                c = add(c, oldc);
                d = add(d, oldd);
            }

            var finalstring = rhex(a) + rhex(b) + rhex(c) + rhex(d);
            var capitalFinalString = angular.uppercase(finalstring);
            return capitalFinalString;
        }
        $scope.openEPrescribe = function () {


            $scope.RcopiaLocalPrescribeObj.RcopiaPatientId = $scope.PatientRcopiaID;
            var serviceUrl = "https://web.staging.drfirst.com/sso/portalServices?";




            $scope.RcopiaLocalPrescribeObj.Time = gmtTime();

            var subUrl = "rcopia_portal_system_name=" + $scope.RcopiaLocalPrescribeObj.PortalSystemName + "&rcopia_practice_user_name=" + $scope.RcopiaLocalPrescribeObj.PracticeUserName + "&rcopia_user_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaUserId + "&rcopia_user_external_id=" + $scope.RcopiaLocalPrescribeObj.UserExternalId + "&service=" + $scope.RcopiaLocalPrescribeObj.Service + "&action=" + $scope.RcopiaLocalPrescribeObj.Action + "&startup_screen=" + $scope.RcopiaLocalPrescribeObj.StartUpScreen + "&rcopia_patient_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaPatientId + "&rcopia_patient_external_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaPatientExternalId + "&time=" + $scope.RcopiaLocalPrescribeObj.Time + $scope.RcopiaLocalPrescribeObj.SecretKey;




            $scope.RcopiaLocalPrescribeObj.MAC = "";
            $scope.RcopiaLocalPrescribeObj.MAC = calcMD5(subUrl);



            var MainUrl = serviceUrl + "rcopia_portal_system_name=" + $scope.RcopiaLocalPrescribeObj.PortalSystemName + "&rcopia_practice_user_name=" + $scope.RcopiaLocalPrescribeObj.PracticeUserName + "&rcopia_user_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaUserId + "&rcopia_user_external_id=" + $scope.RcopiaLocalPrescribeObj.UserExternalId + "&service=" + $scope.RcopiaLocalPrescribeObj.Service + "&action=" + $scope.RcopiaLocalPrescribeObj.Action + "&startup_screen=" + $scope.RcopiaLocalPrescribeObj.StartUpScreen + "&rcopia_patient_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaPatientId + "&rcopia_patient_external_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaPatientExternalId + "&time=" + $scope.RcopiaLocalPrescribeObj.Time + "&MAC=" + $scope.RcopiaLocalPrescribeObj.MAC;


            console.log(JSON.stringify(MainUrl));


            $scope.mainIframeSrcUrl = MainUrl;




            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsNewConsultation/uibpopup/medicalrxRcopia.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "resolve": {
                    "mainIframeSrcUrl": function () { return $scope.mainIframeSrcUrl; },
                },
                "windowClass": "newconsultationpopup overflow-y-hideen",
                "controller": function ($scope, $uibModal, $uibModalInstance, $sce, eHnotePatientPVService, mainIframeSrcUrl) {


                    console.log(mainIframeSrcUrl);

                    $scope.mainIframeSrcUrl = $sce.trustAsResourceUrl(mainIframeSrcUrl);

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };

                    $scope.medicalrxrcopiasuibclose = function () {
                        var responsedata = {
                            "status": ""
                        };
                        $uibModalInstance.close(responsedata);
                        //  $uibModalInstance.dismiss("cancel");

                    };

                    $scope.medicalrxsuibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                    $scope.savePrescription = function () {
                        var responsedata = {
                            "status": "Success"
                        };
                        $uibModalInstance.close(responsedata);
                    };

                }
            });

            $scope.mInstanceAdd.result.then(function (resp) {
                console.log(resp);
                if (resp.status === "Success") {
                    $scope.getPrescriptionsFromRcopia();
                    $scope.getMedicationsFromRcopia();
                }

            }, function (cancel) {
            });



        };


        $scope.navtoOpenChart = function () {

            console.log($scope.PrescriptionsArray);
            var tempArray = $filter('filter')($scope.PrescriptionsArray, { 'IsSelected': true });
            if (tempArray.length === 0) {
                alertify.error("please select a medication to continue");
                return false;
            }
            else {

                var obj = {
                    "UserId": $scope.UserId,
                    "HospitalId": $scope.HospitalId,
                    "AppointmentInfo": appointmentinfo,
                    "Prescriptions": tempArray
                }
                $scope.mInstanceAdd = $uibModal.open({
                    "templateUrl": "templates/uibpopups/RxAppointmentConfirmation.html",
                    "backdrop": "static",
                    "scope": $scope,
                    "keyboard": false,
                    "size": "lg",
                    "resolve": {
                        "mainObject": function () { return obj; }
                    },
                    "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, mainObject) {

                        console.log(mainObject);


                        $scope.prescriptionArray = mainObject.Prescriptions || [];

                        angular.forEach($scope.prescriptionArray, function (pitem) {
                            pitem.PrescriptionId = 0;
                            pitem.PrescriptionHistoryId = 0;
                        });


                        $scope.currentformattedDate = moment().format('YYYY-MM-DD');
                        var currentStartTime = moment().format('HH:mm:ss');
                        var formattedStartTime = moment().format('HH:mm');

                        var endTime = moment().add(15, 'minutes');
                        var formattedEndTime = endTime.format('HH:mm');


                        var dayabbrevation = moment().format('ddd').toUpperCase();
                        var formattedDateTime = moment().format('YYYY-MM-DD HH:mm:ss');



                        //function getEmptyPrescriptionObj() {


                        //    var TodayDate = $filter('date')(new Date(), "yyyy-MM-dd");

                        //    var obj = {
                        //        "UserId": mainObject.UserId,
                        //        "OrganizationId": mainObject.HospitalId,
                        //        "PatientId": mainObject.AppointmentInfo.PatientID,
                        //        "RcopiaPatientId": $scope.PatientRcopiaID,
                        //        "PatientPrescriptionId": 0,
                        //        "AppointmentId": "",
                        //        "ProviderId": "",
                        //        "PrescribedDate": TodayDate,
                        //        "RcopiaPrescriptionId": "",
                        //        "LastUpdateDate": TodayDate,
                        //        "PharmacyId": 0,
                        //        "RcopiaPharmacyId": "",
                        //        "PrescriberOrderNumber": "",
                        //        "RxReferenceNumber": "",
                        //        "PrescriptionAction": "",
                        //        "CompletedDate": null,
                        //        "SignedDate": null,
                        //        "StopDate": null,
                        //        "LastModifiedBy": mainObject.UserId,
                        //        "LastModifiedDate": TodayDate,
                        //        "CompleteAction": "Created",
                        //        "PrescriptionSentMethod": "",
                        //        "PrescriptionStatus": "",
                        //        "DeleteInd": "N",
                        //        "RcopiaDeleted": "n",
                        //        "PrescriptionDetails": []
                        //    };
                        //    return obj;
                        //};

                        //$scope.PrescriptionMainAddObj = getEmptyPrescriptionObj();

                        //angular.forEach($scope.prescriptionArray, function (pitem) {

                        //    var obj = {
                        //        "PatientPrescriptionDetailId": 0,
                        //        "PatientPrescriptionId": 0,
                        //        "PatientId": mainObject.AppointmentInfo.PatientID,
                        //        "MedicationId": pitem.MedicationId,
                        //        "RcopiaDrugId": pitem.RcopiaDrugId,
                        //        "RcopiaMedicationId": 0,
                        //        "MedicationName": pitem.MedicationName,
                        //        "DrugNDCID": pitem.DrugNDCID,
                        //        "DrugFirstDataBankMedID": pitem.DrugFirstDataBankMedID,
                        //        "DrugGenericId": pitem.DrugGenericId,
                        //        "DrugBrandName": pitem.DrugBrandName,
                        //        "DrugGenericName": pitem.DrugGenericName,
                        //        "DrugForm": pitem.DrugForm,
                        //        "DrugStrength": pitem.DrugStrength,
                        //        "DrugSchedule": "1",
                        //        "DrugSupply": pitem.DrugSupply,
                        //        "DrugCompound": pitem.DrugCompound,
                        //        "MedicationTypeId": pitem.MedicationTypeId,
                        //        "MedicationTypeName": pitem.MedicationTypeName,
                        //        "Sig": pitem.Sig,
                        //        "SigId": pitem.SigId,
                        //        "ActionId": pitem.ActionId,
                        //        "Action": pitem.Action,
                        //        "DoseId": pitem.DoseId,
                        //        "Dose": pitem.Dose,
                        //        "DoseUnitId": pitem.DoseUnitId,
                        //        "DoseUnit": pitem.DoseUnit,
                        //        "RouteId": pitem.RouteId,
                        //        "Route": pitem.Route,
                        //        "FrequencyId": pitem.FrequencyId,
                        //        "Frequency": pitem.Frequency,
                        //        "DoseOtherId": pitem.DoseOtherId,
                        //        "DoseOther": pitem.DoseOther,
                        //        "DaysSupplyId": pitem.DaysSupplyId,
                        //        "DaysSupply": pitem.DaysSupply,
                        //        "Quantity": pitem.Quantity,
                        //        "QuantityUnitId": pitem.QuantityUnitId,
                        //        "QuantityUnit": pitem.QuantityUnit,
                        //        "RefillId": pitem.RefillId,
                        //        "Refills": pitem.Refills,
                        //        "SubstitutionPermitted": pitem.SubstitutionPermitted,
                        //        "PatientInstructions": pitem.PatientInstructions,
                        //        "DeleteInd": "N",
                        //        "OtherNotes": pitem.OtherNotes,
                        //        "Remarks": pitem.Remarks,
                        //        "StartDate": $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss"),
                        //        "StopDate": null,
                        //        "FillDate": $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss"),
                        //        "StopReason": "",
                        //        "RcopiaMedicationStatus": "",
                        //        "IsEditMode": true
                        //    };

                        //    $scope.PrescriptionMainAddObj.PrescriptionDetails.push(obj);
                        //});

                        $scope.addNewApptPrescriptionObj = {
                            "UserId": mainObject.UserId,
                            "AppointmentId": 0,
                            "PatientID": mainObject.AppointmentInfo.PatientID,
                            "PatientRcopiaID": $scope.PatientRcopiaID,
                            "ParentAppointmentId": 0,
                            "OrganizationId": mainObject.HospitalId,
                            "ParentOrganizationId": 3,
                            "ConsultationId": 0,
                            "AppointmentStatus": "B",
                            "CurrentTime": currentStartTime,
                            "StartTime": formattedStartTime,
                            "EndTime": formattedEndTime,
                            "DoctorID": 3,
                            "DayCD": dayabbrevation,
                            "VisitRemarks": "Rx Appointment",
                            "IsConfirmedAppointment": true,
                            "IsWaitingListAppointment": false,
                            "IsNoShowAppointment": false,
                            "AppointmentDate": $scope.currentformattedDate,
                            "UserBranchId": 0,
                            "AppointmentTypeId": 9,
                            "AppointmentPatientTypeId": 2,
                            "SubSpecializationId": 1,
                            "BranchSubSpecializationId": 1,
                            "PatientTypeId": 1,
                            "IsConsultationFollowUp": false,
                            "IsCheckedIn": 1,
                            "PaymentTypeId": 1,
                            "DeviceEntityTypeId": 2,
                            "VisitReasonId": 1,
                            "ConfirmationStatusId": 2,
                            "SpecializationId": 1,
                            "ConsultationStartTime": formattedDateTime,
                            "ConsultationEndTime": formattedDateTime,
                            "Prescription": "",
                            "DocObj": "",
                            "UserFullName": "",
                            "Mode": "chart"
                        }






                        console.log(JSON.stringify($scope.addNewApptPrescriptionObj));

                        $scope.closeuibpopup = function () {
                            $uibModalInstance.dismiss("cancel");

                        };



                        $scope.ClearDetails = function () {
                            $uibModalInstance.close("save");
                        };


                        $scope.changeAppointmentRxDoctor = function (item) {
                            console.log(item);
                            $scope.addNewApptPrescriptionObj.DoctorID = item.DoctorID;
                            $scope.addNewApptPrescriptionObj.UserBranchId = item.UserBranchId;
                       
                            if (item.UserSubSpecialization.length > 0) {
                                angular.forEach(item.UserSubSpecialization, function (mitem) {
                                    if (mitem.IsPrimarySubSpecialization === true) {
                                        $scope.addNewApptPrescriptionObj.SubSpecializationId = mitem.SubSpecializationId;
                                        $scope.addNewApptPrescriptionObj.BranchSubSpecializationId = mitem.BranchSubSpecializationId;
                                    }
                                });
                            }
                        };

                        $scope.continuetoBookAppointment = function () {

                            var Appparams = $scope.addNewApptPrescriptionObj;

                            console.log(JSON.stringify(Appparams));


                            eHnoteUserAppointmentDataService.AddAppointmentAndCreatePrescription(Appparams, OnAddApointmentSuccess, onAddAppointmentError);
                            function OnAddApointmentSuccess(response) {
                                console.log(response);
                               
                                if (response.Status==="Success") {
                                    $uibModalInstance.close(response);
                                }

                                if (response.Status == "Failure") {
                                    alertify.error(response.Message);
                                }
                            }

                            function onAddAppointmentError() {

                            }
                        };

                    }
                });
                $scope.mInstanceAdd.result.then(function (resp) {


                    console.log(JSON.stringify(resp));
                    $rootScope.$broadcast('continuetoOpenChartFromPatientRx', resp);

                }, function (cancel) {
                });

            }

        }
    }]);





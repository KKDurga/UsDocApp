eHnoteWebApp.controller('CCDAResourceConfiguration', ["$scope", "$filter", "alertify", "mainObject", "eHnoteMainAppointmentService", "eHnoteMasterDataService", "eHnotePatientDataService", "eHnoteUserDataService", "$uibModal", "$uibModalInstance", function ($scope, $filter, alertify, mainObject, eHnoteMainAppointmentService, eHnoteMasterDataService, eHnotePatientDataService, eHnoteUserDataService, $uibModal, $uibModalInstance) {
     

    $scope.ActualResourcesArray = [
        {
            "ResourceId": 1,
            "ResourceName": "Allergies"
        },
        {
            "ResourceId": 2,
            "ResourceName": "Encounters"
        },
        {
            "ResourceId": 3,
            "ResourceName": "Medications"
        },
        {
            "ResourceId": 4,
            "ResourceName": "Immunizations"
        },
        {
            "ResourceId": 5,
            "ResourceName": "Assessment Plan"
        },
        {
            "ResourceId": 6,
            "ResourceName": "Careplan"
        },
        {
            "ResourceId": 7,
            "ResourceName": "Treatmentplan"
        },
        {
            "ResourceId": 8,
            "ResourceName": "Reason For Referral"
        },
        {
            "ResourceId": 9,
            "ResourceName": "Problems"
        },
        {
            "ResourceId": 10,
            "ResourceName": "Procedures"
        },
        {
            "ResourceId": 11,
            "ResourceName": "Functional Status"
        },
        {
            "ResourceId": 12,
            "ResourceName": "Congitive Status"
        },
        {
            "ResourceId": 13,
            "ResourceName": "Results"
        },
        {
            "ResourceId": 14,
            "ResourceName": "SocialHistory"
        },
        {
            "ResourceId": 15,
            "ResourceName": "Vital Signs"
        },
        {
            "ResourceId": 16,
            "ResourceName": "Health Goals"
        },
        {
            "ResourceId": 17,
            "ResourceName": "Health Concerns"
        }, {
            "ResourceId": 18,
            "ResourceName": "Progress Note"
        },
        {
            "ResourceId": 19,
            "ResourceName": "Health & Physical Note"
        },
        {
            "ResourceId": 20,
            "ResourceName": "Consultation Note"
        },
        {
            "ResourceId": 21,
            "ResourceName": "Device/Implant"
        },
        {
            "ResourceId": 22,
            "ResourceName": "Labaratory Note"
        },
        {
            "ResourceId": 23,
            "ResourceName": "Procedure Note"
        },
        {
            "ResourceId": 24,
            "ResourceName": "Discharge Instructions"
        }
    ]






    $scope.selectedResourcesArray = [
        {
            "ResourceTemplateId": 0,
            "ResourceId": 1,
            "ResourceName": "Allergies",
            "DeleteInd": "N",
            "Order": 0
        },
        {
            "ResourceTemplateId": 0,
            "ResourceId": 2,
            "ResourceName": "Encounters",
            "DeleteInd": "N",
            "Order": 0
        },
        {
            "ResourceTemplateId": 0,
            "ResourceId": 3,
            "ResourceName": "Medications",
            "DeleteInd": "N",
            "Order": 0
        },
        {
            "ResourceTemplateId": 0,
            "ResourceId": 4,
            "ResourceName": "Immunizations",
            "DeleteInd": "N",
            "Order": 0
        },
        {
            "ResourceTemplateId": 0,
            "ResourceId": 5,
            "ResourceName": "Assessment Plan",
            "DeleteInd": "N",
            "Order": 0
        },
        {
            "ResourceTemplateId": 0,
            "ResourceId": 6,
            "ResourceName": "Careplan",
            "DeleteInd": "N",
            "Order": 0
        },
        {
            "ResourceTemplateId": 0,
            "ResourceId": 7,
            "ResourceName": "Treatmentplan",
            "DeleteInd": "N",
            "Order": 0
        },
        {
            "ResourceTemplateId": 0,
            "ResourceId": 8,
            "ResourceName": "Reason For Referral",
            "DeleteInd": "N",
            "Order": 0
        },
        {
            "ResourceTemplateId": 0,
            "ResourceId": 9,
            "ResourceName": "Problems",
            "DeleteInd": "N",
            "Order": 0
        },
        {
            "ResourceTemplateId": 0,
            "ResourceId": 10,
            "ResourceName": "Procedures",
            "DeleteInd": "N",
            "Order": 0
        },
        {
            "ResourceTemplateId": 0,
            "ResourceId": 11,
            "ResourceName": "Functional Status",
            "DeleteInd": "N",
            "Order": 0
        },
        {
            "ResourceTemplateId": 0,
            "ResourceId": 12,
            "ResourceName": "Congitive Status",
            "DeleteInd": "N",
            "Order": 0
        },
        {
            "ResourceTemplateId": 0,
            "ResourceId": 13,
            "ResourceName": "Results",
            "DeleteInd": "N",
            "Order": 0
        },
        {
            "ResourceTemplateId": 0,
            "ResourceId": 14,
            "ResourceName": "SocialHistory",
            "DeleteInd": "N",
            "Order": 0
        },
        {
            "ResourceTemplateId": 0,
            "ResourceId": 15,
            "ResourceName": "Vital Signs",
            "DeleteInd": "N",
            "Order": 0
        },
        {
            "ResourceTemplateId": 0,
            "ResourceId": 16,
            "ResourceName": "Health Goals",
            "DeleteInd": "N",
            "Order": 0
        },
        {
            "ResourceTemplateId": 0,
            "ResourceId": 17,
            "ResourceName": "Health Concerns",
            "DeleteInd": "N",
            "Order": 0
        },
        {
            "ResourceTemplateId": 0,
            "ResourceId": 18,
            "ResourceName": "Progress Note",
            "DeleteInd": "N",
            "Order": 0
        },
        {
            "ResourceTemplateId": 0,
            "ResourceId": 19,
            "ResourceName": "Physical Note",
            "DeleteInd": "N",
            "Order": 0
        },
        {
            "ResourceTemplateId": 0,
            "ResourceId": 20,
            "ResourceName": "Consultation Note",
            "DeleteInd": "N",
            "Order": 0
        },
        {
            "ResourceTemplateId": 0,
            "ResourceId": 21,
            "ResourceName": "Device/Implant",
            "DeleteInd": "N",
            "Order": 0
        },
        {
            "ResourceTemplateId": 0,
            "ResourceId": 22,
            "ResourceName": "Labaratory Note",
            "DeleteInd": "N",
            "Order": 0
        },
        {
            "ResourceId": 23,
            "ResourceTemplateId": 0,
            "ResourceName": "Procedure Note",
            "DeleteInd": "N",
            "Order": 0
        },
        {
            "ResourceId": 24,
            "ResourceTemplateId": 0,
            "ResourceName": "Discharge Instructions",
            "DeleteInd": "N",
            "Order": 0
        }
    ]


    $scope.configurationResourceArray = [];
    angular.forEach($scope.ActualResourcesArray, function (ditem, index) {
        var obj = {
            "ResourceTemplateId": 0,
            "ResourceId": ditem.ResourceId,
            "ResourceName": ditem.ResourceName,
            "DeleteInd": "N",
            "Order": index + 1,
            "IsShow": false
        };
        $scope.configurationResourceArray.push(obj);
    });

    $scope.changeActualResourceHideandShow = function (item) {
        console.log(item.IsShow);

        angular.forEach($scope.configurationResourceArray, function (citem) {
            if (citem.ResourceId == item.ResourceId) {
                citem.IsShow = item.IsShow;
            }
        });
    };

    $scope.$watch('configurationResourceArray', function (newVal, oldVal) {
        angular.forEach($scope.configurationResourceArray, function (sitem, index) {
            //if (sitem.IsShow) {
            sitem.Order = index + 1;
            //}
        });
    }, true);



    $scope.models = {
        selected: null,
        lists: { "ActualResources": $scope.ActualResourcesArray, "UserTemplate": $scope.selectedResourcesArray }
    };
    $scope.userSelectedDoctorId = mainObject.UserId;


    $scope.userSelectedTemplateId = 0;
    $scope.TemplateName = "";
    $scope.templateActiveInd = false;

    $scope.addUpdateCCDATemplate = {
        "ActiveInd": false
    };

    $scope.showAddNew = false;
    $scope.addNewCCDATemplate = function () {
        $scope.showAddNew = !$scope.showAddNew;
        $scope.userSelectedTemplateId = 0;
        $scope.TemplateName = "";
        $scope.addUpdateCCDATemplate.ActiveInd = false;
        $scope.selectedResourcesArray = [];

        $scope.configurationResourceArray = [];
        angular.forEach($scope.ActualResourcesArray, function (ditem, index) {
            var obj = {
                "ResourceTemplateId": 0,
                "ResourceId": ditem.ResourceId,
                "ResourceName": ditem.ResourceName,
                "DeleteInd": "N",
                "Order": index + 1,
                "IsShow": true
            };
            $scope.configurationResourceArray.push(obj);
        });
    };

    $scope.redoAllresources = function () {
        $scope.selectedResourcesArray = [];
        $scope.addUpdateCCDATemplate.ActiveInd = false;
        angular.forEach($scope.ActualResourcesArray, function (aitem) {
            var obj = {
                "ResourceTemplateId": 0,
                "ResourceId": aitem.ResourceId,
                "ResourceName": aitem.ResourceName,
                "DeleteInd": "N",
                "Order": 0,
                "IsShow": true
            };
            $scope.selectedResourcesArray.push(obj);
        });
        $scope.models.lists.UserTemplate = angular.copy($scope.selectedResourcesArray);
    }



    $scope.removeItemlist = function (temp, ResourcesArray, index) {
        console.log(temp);
        angular.forEach($scope.models.lists.UserTemplate, function (sitem, sindex) {
            if (sitem.ResourceId == temp.ResourceId) {
                $scope.models.lists.UserTemplate.splice(sindex, 1);
            }
        });
    }

    $scope.AddToListlist = function (item) {
        console.log(item);

        var filteredArray = $filter("filter")($scope.models.lists.UserTemplate, function (iterator, ind) { return iterator.ResourceId === item.ResourceId; });

        if (filteredArray.length > 0) {
            alertify.error("Resource already exists");
            return false;
        }
        var obj = {
            "ResourceTemplateId": 0,
            "ResourceId": item.ResourceId,
            "ResourceName": item.ResourceName,
            "DeleteInd": "N",
            "Order": 0
        };

        $scope.models.lists.UserTemplate.push(obj);
    };

    // Generate initial model
    //for (var i = 1; i <= 3; ++i) {
    //    $scope.models.lists.A.push({ label: "Item A" + i });
    //    $scope.models.lists.B.push({ label: "Item B" + i });
    //}

    // Model to JSON for demo purpose
    //$scope.$watch('models', function (model) {
    //    console.log(model.lists);
    //    $scope.modelAsJson = angular.toJson(model, true);
    //    angular.forEach(model.lists.UserTemplate, function (sitem, index) {
    //        sitem.Order = index + 1;
    //    });
    //}, true);

    $scope.closeuibpopup = function () {
        $uibModalInstance.dismiss("cancel");
    };


    $scope.ClearDetails = function () {
        $uibModalInstance.close("save");
    }

    $scope.GetUserCCDATemplateDetails = function (DeleteTemplate) {
        var obj = {
            "DoctorId": $scope.userSelectedDoctorId
        }
        eHnoteMainAppointmentService.GetUserCCDATemplateDetails(obj).then(function (resp) {
            if (resp.data.status == "success") {
                $scope.TemplatesList = [];
                $scope.TemplatesList = resp.data.TemplatesList;
                $scope.ResourcesArrayList = [];
                if ($scope.TemplatesList.length > 0) {
                    angular.forEach($scope.TemplatesList, function (item) {

                        item.NewTemplateName = "";
                        if (item.ActiveInd) {
                            item.NewTemplateName = item.TemplateName + ' (Active)';
                            $scope.userSelectedTemplateId = item.TemplateId;
                            $scope.addUpdateCCDATemplate.ActiveInd = true;
                            $scope.models.lists.UserTemplate = item.ResourcesArray;
                            //angular.forEach($scope.configurationResourceArray, function (citem) {
                            //    var filteredArrays = $filter("filter")(item.ResourcesArray, { "ResourceId": citem.ResourceId }, true);
                            //    if (filteredArrays.length > 0) {
                            //        citem.Order = filteredArrays[0].Order;
                            //        citem.IsShow = filteredArrays[0].ActiveInd;
                            //    }
                            //});
                            $scope.configurationResourceArray = [];
                            angular.forEach(item.ResourcesArray, function (citem) {
                                if (citem.ActiveInd) {
                                    citem.IsShow = true;
                                } else {
                                    citem.IsShow = false;
                                }
                                $scope.configurationResourceArray.push(citem);
                            });
                        } else {
                            item.NewTemplateName = item.TemplateName;
                        }


                    });
                } else {
                    $scope.models.lists.UserTemplate = angular.copy($scope.selectedResourcesArray);
                    $scope.addNewCCDATemplate();
                }





            }
        });
    }
    $scope.GetUserCCDATemplateDetails();
    $scope.ChangeDoctor = function () {
        $scope.GetUserCCDATemplateDetails();
        $scope.ResourcesArrayList = [];
    }
    $scope.ChangeTemplate = function (tempid, templist) {
        $scope.userSelectedTemplateId = tempid || 0;
        $scope.ResourcesArrayList = [];
        if ($scope.userSelectedTemplateId != 0) {
            var filteredArray = $filter("filter")(templist, function (item) { return item.TemplateId === tempid; });
            filteredArray = filteredArray || [];
            if (filteredArray.length > 0) {
                $scope.TemplateName = filteredArray[0].TemplateName;
                $scope.ResourcesArrayList = filteredArray[0].ResourcesArray || [];
            }
        }
    };

    $scope.NewTemplateName = function (templatename) {
        $scope.TemplatesList = $scope.TemplatesList || [];
        if ($scope.TemplatesList.length > 0) {
            var tempArray = $filter("filter")($scope.TemplatesList, function (item) { return item.TemplateName === templatename; });
        }
        tempArray = tempArray || [];
        if (tempArray.length > 0) {
            alertify.error("This Template name is already existed");
            return false;
        }
    }

    $scope.ChangeExistingTemplate = function (tempid, templist) {
        var filteredArray = $filter("filter")(templist, function (item) { return item.TemplateId === tempid; });
        $scope.TemplateName = "";
        filteredArray = filteredArray || [];
        $scope.addUpdateCCDATemplate.ActiveInd = false;
        if (filteredArray.length > 0) {

            $scope.showAddNew = false;
            $scope.TemplateName = filteredArray[0].TemplateName;


            if (filteredArray[0].ActiveInd) {
                $scope.addUpdateCCDATemplate.ActiveInd = true;
            }
            //$scope.selectedResourcesArray = [];
            //angular.forEach(filteredArray[0].ResourcesArray, function (aitem) {
            //    var obj = {
            //        "ResourceTemplateId": 0,
            //        "ResourceId": aitem.ResourceId,
            //        "ResourceName": aitem.ResourceName,
            //        "DeleteInd": "N",
            //        "Order": 0
            //    };
            //    $scope.selectedResourcesArray.push(obj);
            //});
            //$scope.models.lists.UserTemplate = angular.copy($scope.selectedResourcesArray);

            //angular.forEach($scope.configurationResourceArray, function (citem) {
            //    var resourceFilteredArray = $filter("filter")(filteredArray[0].ResourcesArray, { "ResourceId": citem.ResourceId }, true);
            //    if (resourceFilteredArray.length > 0) {
            //        citem.Order = resourceFilteredArray[0].Order;
            //        citem.IsShow = resourceFilteredArray[0].ActiveInd;
            //    }
            //});
            $scope.configurationResourceArray = [];
            angular.forEach(filteredArray[0].ResourcesArray, function (citem) {
                if (citem.ActiveInd) {
                    citem.IsShow = true;
                } else {
                    citem.IsShow = false;
                }
                $scope.configurationResourceArray.push(citem);
            });
        }
    }


    $scope.SaveUserCCDATemplate = function () {
        console.log("2");
        $scope.userSelectedDoctorId = $scope.userSelectedDoctorId || 0;
        $scope.userSelectedTemplateId = $scope.userSelectedTemplateId || 0;
        if ($scope.userSelectedDoctorId == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }

        if ($scope.showAddNew) {
            if ($scope.TemplateName == "") {
                alertify.error("Please Enter Template Name");
                return false;
            };
        } else {
            if ($scope.userSelectedTemplateId == 0) {
                alertify.error("Please Select a Template");
                return false;
            };
        }

        if ($scope.models.lists.UserTemplate.length == 0) {
            alertify.error("Please add atleast one resource");
            return false;
        }



        var activeINd = "Y"
        if ($scope.addUpdateCCDATemplate.ActiveInd) {
            activeINd = "Y";
        } else {
            activeINd = "N";
        }





        angular.forEach($scope.configurationResourceArray, function (mitem) {
            mitem.ActiveInd = "N";
            if (mitem.IsShow) {
                mitem.ActiveInd = "Y";
            }
        });


        var obj = {
            "UserId": $scope.UserId,
            "DoctorId": $scope.userSelectedDoctorId,
            "TemplateId": $scope.userSelectedTemplateId || 0,
            "ActiveInd": activeINd,
            "TemplateName": $scope.TemplateName || "",
            "DeleteInd": "N",
            "ResourcesArray": $scope.configurationResourceArray
        }

        eHnoteMainAppointmentService.AddUpdateUserCCDATemplate(obj).then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.userSelectedDoctorId = resp.data.DoctorId;
                $scope.GetUserCCDATemplateDetails();
                if ($scope.userSelectedTemplateId == 0) {
                    alertify.success("Template Created Successfully");
                } else {
                    alertify.success("Template Updated Successfully");
                }
                $uibModalInstance.close("save");
            } else {
                alertify.error("Appointment Already Exists For This Patient");
            }
        }, function (err) {
            alertify.error("Getting Failed");
        })
    }
}]);
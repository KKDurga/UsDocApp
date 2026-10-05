"use strict";
eHnoteWebApp.controller("AdvancedHealthPopUpCtrl", ["$scope", "$rootScope", "$uibModalInstance", "$filter", "alertify", "cacheStorageItem",
    function ($scope, $rootScope, $uibModalInstance, $filter, alertify, cacheStorageItem) {

        $scope.cacheStorageItem = angular.copy(cacheStorageItem);
        $scope.closeuib = function () {
            $uibModalInstance.dismiss("cancel");
        };
        $scope.HealthAvancedPopUpSave = function () {
            $uibModalInstance.close($scope.cacheStorageItem);
        };

        $scope.OnSelectNormal = function (item) {
            if (item === "All") {
                if ($scope.cacheStorageItem.IsAllHealthWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        kitem.IsChecked = false;
                    });
                    $scope.cacheStorageItem.IsCardiacWNL = true;
                    $scope.cacheStorageItem.IsPulmonaryWNL = true;
                    $scope.cacheStorageItem.IsHepaticWNL = true;
                    $scope.cacheStorageItem.IsEndocrineWNL = true;
                    $scope.cacheStorageItem.IsNeurologicWNL = true;
                    $scope.cacheStorageItem.IsHemeOncWNL = true;
                    $scope.cacheStorageItem.IsNervousSystemWNL = true;
                    $scope.cacheStorageItem.IsKidneyDiseaseWNL = true;
                    $scope.cacheStorageItem.IsMusculoSkeletalSystemWNL = true;
                    $scope.cacheStorageItem.IsAutoImmuneDisordersWNL = true;
                    $scope.cacheStorageItem.IsPsychosisWNL = true;
                    $scope.cacheStorageItem.IsOthersWNL = true;
                    $scope.cacheStorageItem.IsHeentWNL = true;
                    $scope.cacheStorageItem.IsLungsWNL = true;
                } else {
                    $scope.cacheStorageItem.IsCardiacWNL = false;
                    $scope.cacheStorageItem.IsPulmonaryWNL = false;
                    $scope.cacheStorageItem.IsHepaticWNL = false;
                    $scope.cacheStorageItem.IsEndocrineWNL = false;
                    $scope.cacheStorageItem.IsNeurologicWNL = false;
                    $scope.cacheStorageItem.IsHemeOncWNL = false;
                    $scope.cacheStorageItem.IsNervousSystemWNL = false;
                    $scope.cacheStorageItem.IsKidneyDiseaseWNL = false;
                    $scope.cacheStorageItem.IsMusculoSkeletalSystemWNL = false;
                    $scope.cacheStorageItem.IsAutoImmuneDisordersWNL = false;
                    $scope.cacheStorageItem.IsPsychosisWNL = false;
                    $scope.cacheStorageItem.IsOthersWNL = false;
                    $scope.cacheStorageItem.IsHeentWNL = false;
                    $scope.cacheStorageItem.IsLungsWNL = false;
                }
            }
            if (item === "Cardiac") {
                if ($scope.cacheStorageItem.IsCardiacWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 1) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "Pulmonary") {
                if ($scope.cacheStorageItem.IsPulmonaryWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 2) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "Hepatic") {
                if ($scope.cacheStorageItem.IsHepaticWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 3) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "Endocrine") {
                if ($scope.cacheStorageItem.IsEndocrineWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 4) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "Neurologic") {
                if ($scope.cacheStorageItem.IsNeurologicWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 5) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "HemeOnc") {
                if ($scope.cacheStorageItem.IsHemeOncWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 6) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "Nervous System") {
                if ($scope.cacheStorageItem.IsNervousSystemWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 7) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "Kidney") {
                if ($scope.cacheStorageItem.IsKidneyDiseaseWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 8) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "MusculoSkeletal") {
                if ($scope.cacheStorageItem.IsMusculoSkeletalSystemWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 9) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "AutoImmune") {
                if ($scope.cacheStorageItem.IsAutoImmuneDisordersWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 10) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "Psychosis") {
                if ($scope.cacheStorageItem.IsPsychosisWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 11) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "Others") {
                if ($scope.cacheStorageItem.IsOthersWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 12) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "Heent") {
                if ($scope.cacheStorageItem.IsHeentWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 16) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "Lungs") {
                if ($scope.cacheStorageItem.IsLungsWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 17) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }

            if ($scope.cacheStorageItem.IsCardiacWNL && $scope.cacheStorageItem.IsPulmonaryWNL && $scope.cacheStorageItem.IsHepaticWNL && $scope.cacheStorageItem.IsEndocrineWNL && $scope.cacheStorageItem.IsNeurologicWNL && $scope.cacheStorageItem.IsHemeOncWNL && $scope.cacheStorageItem.IsNervousSystemWNL && $scope.cacheStorageItem.IsKidneyDiseaseWNL && $scope.cacheStorageItem.IsMusculoSkeletalSystemWNL && $scope.cacheStorageItem.IsAutoImmuneDisordersWNL && $scope.cacheStorageItem.IsPsychosisWNL && $scope.cacheStorageItem.IsOthersWNL && $scope.cacheStorageItem.IsHeentWNL && $scope.cacheStorageItem.IsLungsWNL) {
                $scope.cacheStorageItem.IsAllHealthWNL = true;
            } else {
                $scope.cacheStorageItem.IsAllHealthWNL = false;
            }

        };

        $scope.$watch("cacheStorageItem.HealthArray", function (newVal, oldVal) {
            let CardiacCounter = 0;
            let PulmonaryCounter = 0;
            let HepaticCounter = 0;
            let EndocrineCounter = 0;
            let NeurologicCounter = 0;
            let HemeOncCounter = 0;
            let NervousSystemCounter = 0;
            let KidneyDiseaseCounter = 0;
            let MusculoSkeletalSystemCounter = 0;
            let AutoImmuneDisordersCounter = 0;
            let PsychosisCounter = 0;
            let OthersCounter = 0;
            let RespiratoryCounter = 0;
            let HeentCounter = 0;
            let LungsCounter = 0;

            angular.forEach($scope.cacheStorageItem.HealthArray, function (item) {
                if (item.CategoryId == 1 && item.IsChecked) {
                    CardiacCounter++;
                }
                if (item.CategoryId == 2 && item.IsChecked) {
                    PulmonaryCounter++;
                }
                if (item.CategoryId == 3 && item.IsChecked) {
                    HepaticCounter++;
                }
                if (item.CategoryId == 4 && item.IsChecked) {
                    EndocrineCounter++;
                }
                if (item.CategoryId == 5 && item.IsChecked) {
                    NeurologicCounter++;
                }
                if (item.CategoryId == 6 && item.IsChecked) {
                    HemeOncCounter++;
                }
                if (item.CategoryId == 7 && item.IsChecked) {
                    NervousSystemCounter++;
                }
                if (item.CategoryId == 8 && item.IsChecked) {
                    KidneyDiseaseCounter++;
                }
                if (item.CategoryId == 9 && item.IsChecked) {
                    MusculoSkeletalSystemCounter++;
                }
                if (item.CategoryId == 10 && item.IsChecked) {
                    AutoImmuneDisordersCounter++;
                }
                if (item.CategoryId == 11 && item.IsChecked) {
                    PsychosisCounter++;
                }
                if (item.CategoryId == 12 && item.IsChecked) {
                    OthersCounter++;
                }
                if (item.CategoryId == 13 && item.IsChecked) {
                    RespiratoryCounter++;
                }
                if (item.CategoryId == 16 && item.IsChecked) {
                    HeentCounter++;
                }
                if (item.CategoryId == 17 && item.IsChecked) {
                    LungsCounter++;
                }
            });
            if (CardiacCounter > 0) {
                $scope.cacheStorageItem.IsCardiacWNL = false;
                $scope.cacheStorageItem.IsAllHealthWNL = false;
            }
            if (PulmonaryCounter > 0) {
                $scope.cacheStorageItem.IsPulmonaryWNL = false;
                $scope.cacheStorageItem.IsAllHealthWNL = false;
            }
            if (HepaticCounter > 0) {
                $scope.cacheStorageItem.IsHepaticWNL = false;
                $scope.cacheStorageItem.IsAllHealthWNL = false;
            }
            if (EndocrineCounter > 0) {
                $scope.cacheStorageItem.IsEndocrineWNL = false;
                $scope.cacheStorageItem.IsAllHealthWNL = false;
            }
            if (NeurologicCounter > 0) {
                $scope.cacheStorageItem.IsNeurologicWNL = false;
                $scope.cacheStorageItem.IsAllHealthWNL = false;
            }
            if (HemeOncCounter > 0) {
                $scope.cacheStorageItem.IsHemeOncWNL = false;
                $scope.cacheStorageItem.IsAllHealthWNL = false;
            }
            if (NervousSystemCounter > 0) {
                $scope.cacheStorageItem.IsNervousSystemWNL = false;
                $scope.cacheStorageItem.IsAllHealthWNL = false;
            }
            if (KidneyDiseaseCounter > 0) {
                $scope.cacheStorageItem.IsKidneyDiseaseWNL = false;
                $scope.cacheStorageItem.IsAllHealthWNL = false;
            }
            if (MusculoSkeletalSystemCounter > 0) {
                $scope.cacheStorageItem.IsMusculoSkeletalSystemWNL = false;
                $scope.cacheStorageItem.IsAllHealthWNL = false;
            }
            if (AutoImmuneDisordersCounter > 0) {
                $scope.cacheStorageItem.IsAutoImmuneDisordersWNL = false;
                $scope.cacheStorageItem.IsAllHealthWNL = false;
            }
            if (PsychosisCounter > 0) {
                $scope.cacheStorageItem.IsPsychosisWNL = false;
                $scope.cacheStorageItem.IsAllHealthWNL = false;
            }
            if (OthersCounter > 0) {
                $scope.cacheStorageItem.IsOthersWNL = false;
                $scope.cacheStorageItem.IsAllHealthWNL = false;
            }
            if (RespiratoryCounter > 0) {
                $scope.cacheStorageItem.IsRespiratoryNormal = false;
                $scope.cacheStorageItem.IsAllHealthWNL = false;
            }
            if (HeentCounter > 0) {
                $scope.cacheStorageItem.IsHeentWNL = false;
                $scope.cacheStorageItem.IsAllHealthWNL = false;
            }
            if (LungsCounter > 0) {
                $scope.cacheStorageItem.IsLungsWNL = false;
                $scope.cacheStorageItem.IsAllHealthWNL = false;
            }

        }, true);
       

    }]);
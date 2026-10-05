"use strict";
eHnoteWebApp.controller("EhnoteGlassAutoFillPopUpCtrl", ["$scope", "eHnotePatientDataService", "$timeout", "alertify", "Investigation", "$uibModalInstance", "cache", "eHnoteMasterDataService", "eHnoteCacheStorageService", "$filter", "unaidedInvestigation", "aidedInvestigation", "pinholeInvestigation", function ($scope, eHnotePatientDataService, $timeout, alertify, Investigation, $uibModalInstance, cache, eHnoteMasterDataService, eHnoteCacheStorageService, $filter, unaidedInvestigation, aidedInvestigation, pinholeInvestigation) {

    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    $scope.SelectedList = cache.visions;
    $scope.SelectedInvestigation = Investigation;
    $scope.SelectedunaidedInvestigation = unaidedInvestigation;
    $scope.SelectedaidedInvestigation = aidedInvestigation;
    $scope.SelectedpinholeInvestigation = pinholeInvestigation;


    $scope.SelectedInvestigationIdArray = [];

    $scope.SelectedInvestigationIdArray.push($scope.SelectedInvestigation.InvestigationId);

    $scope.SphericalRadio = 'sphericalplus';
    $scope.CylRadio = 'cylplus';
    $scope.AddRadio = 'addplus';
    $scope.AxisRadio = 'axisplus';
    $scope.UCVARadio = 'ucvaplus';
    $scope.BCVARadio = 'bcvaplus';
    $scope.PHradio = 'phplus';
    $scope.Bcnvaradio = 'bcnvaplus';
    $scope.NearRadio = "Nearplus";
    $scope.DistanceRadio = "Distanceplus";
    $scope.UnaidedDistanceRadio = "UnaidedDistanceplus";
    $scope.UnaidedNearRadio = "UnaidedNearplus";
    $scope.PinholeRadio = "Pinholeplus";
    $scope.BaseRadio = 'baseplus';
    $scope.PrismRadio = 'prismplus';

    $scope.SelectedEye = 1;

    $scope.cancel = function (type) {
        if (type === "cancel") {
            $uibModalInstance.dismiss(type);
        } else {
            $uibModalInstance.close($scope.SelectedInvestigationIdArray);
        }
    };

    //$scope.Sphericalrange = function (min, max, step) {
    //    step = step || 0.25;
    //    var input = [];
    //    for (var i = min; i <= max; i += step) input.push(i);
    //    return input;
    //};

    //$scope.Cylindricalrange = function (min, max, step) {
    //    step = step || 0.25;
    //    var input = [];
    //    for (var i = min; i <= max; i += step) input.push(i);
    //    return input;
    //};
    //$scope.Addrange = function (min, max, step) {
    //    step = step || 0.25;
    //    var input = [];
    //    for (var i = min; i <= max; i += step) input.push(i);
    //    return input;
    //};

    //$scope.Axisrange = function (min, max, step) {
    //    step = step || 5;
    //    var input = [];
    //    for (var i = min; i <= max; i += step) input.push(i);
    //    return input;
    //};

    $scope.GetUcvaList = function () {
        return [{ "Value": "6/60", "selected": false }, { "Value": "6/36", "selected": false }, { "Value": "6/24", "selected": false },
        { "Value": "6/18", "selected": false }, { "Value": "6/12", "selected": false }, { "Value": "6/9", "selected": false }, { "Value": "6/6", "selected": false },
        { "Value": "+6/5", "selected": false }, { "Value": "+6/4", "selected": false }, { "Value": "20/16", "selected": false }, { "Value": "20/20", "selected": false }, { "Value": "20/20p", "selected": false }, { "Value": "20/25", "selected": false }, { "Value": "20/25p", "selected": false }, { "Value": "20/30", "selected": false }, { "Value": "20/30p", "selected": false }, { "Value": "20/40", "selected": false }, { "Value": "20/40p", "selected": false }, { "Value": "20/50", "selected": false }, { "Value": "20/50p", "selected": false }, { "Value": "20/60", "selected": false }, { "Value": "20/60p", "selected": false }, { "Value": "20/80", "selected": false }, { "Value": "20/80p", "selected": false }, { "Value": "20/100", "selected": false }, { "Value": "20/100p", "selected": false }, { "Value": "20/125", "selected": false }, { "Value": "20/125p", "selected": false }, { "Value": "20/200", "selected": false }, { "Value": "20/320", "selected": false }, { "Value": "20/400", "selected": false }, { "Value": "20/500", "selected": false }, { "Value": "20/600", "selected": false }, { "Value": "20/800", "selected": false }, { "Value": "HM", "selected": false }, { "Value": "HM+", "selected": false }, { "Value": "PL", "selected": false }, { "Value": "NPL", "selected": false }, { "Value": "CF CF", "selected": false }, { "Value": "CF 1/2", "selected": false }, { "Value": "CF 1", "selected": false }, { "Value": "CF 1", "selected": false }, { "Value": "CF 3", "selected": false }, { "Value": "CF 3m", "selected": false }, { "Value": "CF 2m", "selected": false }, { "Value": "CF 1m", "selected": false }, { "Value": "CSM", "selected": false }, { "Value": "CSM", "selected": false }, { "Value": "FFL", "selected": false }, { "Value": "Defer", "selected": false }, { "Value": "PL + PR Accurate", "selected": false }, { "Value": "PL + PR Inaccurate", "selected": false }];
    };
    $scope.GetnewUcvaList = function () {
        return [{ "Value": "+HM", "selected": false }, { "Value": "+CFCF", "selected": false }, { "Value": "+CF 1/2", "selected": false },
        { "Value": "+CF 1", "selected": false }, { "Value": "+CF 2", "selected": false }, { "Value": "+CF 3", "selected": false }, { "Value": "+6/60", "selected": false },
        { "Value": "+6/36", "selected": false }, { "Value": "+6/24", "selected": false }, { "Value": "+6/18", "selected": false }, { "Value": "+6/12", "selected": false }, { "Value": "+6/9", "selected": false }, { "Value": "+6/6", "selected": false }, { "Value": "+6/5", "selected": false }, { "Value": "+6/4", "selected": false }];
    };
    $scope.GetBcnvaList = function () {
        return [{ "Value": "N6", "selected": false }, { "Value": "N8", "selected": false }, { "Value": "N10", "selected": false },
        { "Value": "N12", "selected": false }, { "Value": "N18", "selected": false }, { "Value": "N24", "selected": false }, { "Value": "N36", "selected": false }];
    };
    $scope.GetNearList = function () {
        return [{ "Value": "N6", "selected": false }, { "Value": "N8", "selected": false }, { "Value": "N10", "selected": false },
        { "Value": "N12", "selected": false }, { "Value": "N18", "selected": false }, { "Value": "N24", "selected": false }, { "Value": "N36", "selected": false }, { "Value": "<N36", "selected": false }];
    };

    $scope.GetDistanceList = function () {
        return [{ "Value": "HM", "selected": false }, { "Value": "CFCF", "selected": false }, { "Value": "CF 1/2", "selected": false },
        { "Value": "CF 1", "selected": false }, { "Value": "CF 2", "selected": false }, { "Value": "CF 3", "selected": false }, { "Value": "6/60", "selected": false },
        { "Value": "6/36", "selected": false }, { "Value": "6/24", "selected": false }, { "Value": "6/18", "selected": false }, { "Value": "6/12", "selected": false }, { "Value": "6/9", "selected": false }, { "Value": "6/6", "selected": false },
        { "Value": "6/5", "selected": false }, { "Value": "6/4", "selected": false }];
    };

    $scope.GetnewRefBcvaList = function () {
        return [{ "Value": "HM", "selected": false }, { "Value": "CFCF", "selected": false }, { "Value": "CF 1/2", "selected": false },
        { "Value": "CF 1", "selected": false }, { "Value": "CF 2", "selected": false }, { "Value": "CF 3", "selected": false }, { "Value": "6/60", "selected": false },
        { "Value": "6/36", "selected": false }, { "Value": "6/24", "selected": false }, { "Value": "6/18", "selected": false }, { "Value": "6/12", "selected": false }, { "Value": "6/9", "selected": false }, { "Value": "6/6", "selected": false }, { "Value": "6/5", "selected": false }, { "Value": "6/4", "selected": false }];
    };

    $scope.GetRefBcvaList = function () {
        return [{ "Value": "6/60", "selected": false }, { "Value": "6/36", "selected": false }, { "Value": "6/24", "selected": false },
        { "Value": "6/18", "selected": false }, { "Value": "6/12", "selected": false }, { "Value": "6/9", "selected": false }, { "Value": "6/6", "selected": false },
        { "Value": "+6/5", "selected": false }, { "Value": "+6/4", "selected": false }, { "Value": "20/16", "selected": false }, { "Value": "20/20", "selected": false }, { "Value": "20/20p", "selected": false }, { "Value": "20/25", "selected": false }, { "Value": "20/25p", "selected": false }, { "Value": "20/30", "selected": false }, { "Value": "20/30p", "selected": false }, { "Value": "20/40", "selected": false }, { "Value": "20/40p", "selected": false }, { "Value": "20/50", "selected": false }, { "Value": "20/50p", "selected": false }, { "Value": "20/60", "selected": false }, { "Value": "20/60p", "selected": false }, { "Value": "20/80", "selected": false }, { "Value": "20/80p", "selected": false }, { "Value": "20/100", "selected": false }, { "Value": "20/100p", "selected": false }, { "Value": "20/125", "selected": false }, { "Value": "20/125p", "selected": false }, { "Value": "20/200", "selected": false }, { "Value": "20/320", "selected": false }, { "Value": "20/400", "selected": false }, { "Value": "20/500", "selected": false }, { "Value": "20/600", "selected": false }, { "Value": "20/800", "selected": false }, { "Value": "HM", "selected": false }, { "Value": "HM+", "selected": false }, { "Value": "PL", "selected": false }, { "Value": "NPL", "selected": false }, { "Value": "CF CF", "selected": false }, { "Value": "CF 1/2", "selected": false }, { "Value": "CF 1", "selected": false }, { "Value": "CF 1", "selected": false }, { "Value": "CF 3", "selected": false }, { "Value": "CF 3m", "selected": false }, { "Value": "CF 2m", "selected": false }, { "Value": "CF 1m", "selected": false }, { "Value": "CSM", "selected": false }, { "Value": "CSM", "selected": false }, { "Value": "FFL", "selected": false }, { "Value": "Defer", "selected": false }, { "Value": "PL + PR Accurate", "selected": false }, { "Value": "PL + PR Inaccurate", "selected": false }];
    }
    $scope.GetBaseList = function () {
        return [{ "Value": "BU", "selected": false }, { "Value": "BD", "selected": false }, { "Value": "BI", "selected": false },
        { "Value": "BO", "selected": false }];
    };

    $scope.GetPrismList = function () {
        return [{ "Value": "0.5", "selected": false }, { "Value": "1.0", "selected": false }, { "Value": "1.5", "selected": false },
        { "Value": "2.0", "selected": false }, { "Value": "2.5", "selected": false }, { "Value": "3.0", "selected": false }, { "Value": "3.5", "selected": false },
        { "Value": "4.0", "selected": false }, { "Value": "4.5", "selected": false }, { "Value": "5.0", "selected": false }, { "Value": "5.5", "selected": false }, { "Value": "6.0", "selected": false }, { "Value": "6.5", "selected": false }, { "Value": "7.0", "selected": false }, { "Value": "7.5", "selected": false }, { "Value": "8.0", "selected": false }, { "Value": "8.5", "selected": false }, { "Value": "9.0", "selected": false },
        { "Value": "9.5", "selected": false }, { "Value": "10.0", "selected": false }, { "Value": "10.5", "selected": false }, { "Value": "11.0", "selected": false },
        { "Value": "11.5", "selected": false }, { "Value": "12.0", "selected": false }];
    };

    $scope.BaseList = angular.copy($scope.GetBaseList());

    $scope.PrismList = angular.copy($scope.GetPrismList());



    $scope.UcvaList = angular.copy($scope.GetUcvaList());
    //  $scope.refBcvaList = angular.copy($scope.GetUcvaList());
    $scope.refBcvaList = angular.copy($scope.GetRefBcvaList());
    $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
    $scope.refPHList = angular.copy($scope.GetUcvaList());
    //$scope.CrefUcvaList = angular.copy($scope.GetUcvaList());
    //  $scope.CrefBcvaList = angular.copy($scope.GetUcvaList());
    $scope.CrefBcvaList = angular.copy($scope.GetRefBcvaList());
    //$scope.CrefPHList = angular.copy($scope.GetUcvaList());
    //$scope.DistancePlusList = angular.copy($scope.GetUcvaList());
    $scope.DistancePlusList = angular.copy($scope.GetDistanceList());
    $scope.NearPlusList = angular.copy($scope.GetNearList());
    //$scope.UnaidedDistancePlusList = angular.copy($scope.GetUcvaList());
    $scope.UnaidedDistancePlusList = angular.copy($scope.GetDistanceList());
    $scope.UnaidedNearPlusList = angular.copy($scope.GetNearList());
    //  $scope.PinholePlusList = angular.copy($scope.GetUcvaList());
    $scope.PinholePlusList = angular.copy($scope.GetDistanceList());

    $scope.GetUcvaMinusList = function () {
        return [{ "Value": "-HM", "selected": false }, { "Value": "-CFCF", "selected": false }, { "Value": "-CF 1/2", "selected": false },
        { "Value": "-CF 1", "selected": false }, { "Value": "-CF 2", "selected": false }, { "Value": "-CF 3", "selected": false }, { "Value": "-6/60", "selected": false },
        { "Value": "-6/36", "selected": false }, { "Value": "-6/24", "selected": false }, { "Value": "-6/18", "selected": false }, { "Value": "-6/12", "selected": false }, { "Value": "-6/9", "selected": false }, { "Value": "-6/6", "selected": false }, { "Value": "-6/5", "selected": false }, { "Value": "-6/4", "selected": false }];
    };
    $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
    $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
    $scope.refBcnvaMinusList = angular.copy($scope.GetUcvaMinusList());
    $scope.refPHMinusList = angular.copy($scope.GetUcvaMinusList());
    //$scope.CrefUcvaMinusList = angular.copy($scope.GetUcvaMinusList());
    $scope.CrefBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
    //$scope.CrefPHMinusList = angular.copy($scope.GetUcvaMinusList());
    $scope.DistanceMinusList = angular.copy($scope.GetUcvaMinusList());
    $scope.NearMinusList = angular.copy($scope.GetUcvaMinusList());
    $scope.UnaidedDistanceMinusList = angular.copy($scope.GetUcvaMinusList());
    $scope.UnaidedNearMinusList = angular.copy($scope.GetUcvaMinusList());
    $scope.PinholeMinusList = angular.copy($scope.GetUcvaMinusList());


    $scope.GetSphericalPlusList = function () {
        return [
            { "Value": "+0.25", "selected": false }, { "Value": "+0.50", "selected": false }, { "Value": "+0.75", "selected": false }, { "Value": "+1.00", "selected": false },
            { "Value": "+1.25", "selected": false }, { "Value": "+1.50", "selected": false }, { "Value": "+1.75", "selected": false }, { "Value": "+2.00", "selected": false },
            { "Value": "+2.25", "selected": false }, { "Value": "+2.50", "selected": false }, { "Value": "+2.75", "selected": false }, { "Value": "+3.00", "selected": false },
            { "Value": "+3.25", "selected": false }, { "Value": "+3.50", "selected": false }, { "Value": "+3.75", "selected": false }, { "Value": "+4.0", "selected": false },
            { "Value": "+4.25", "selected": false }, { "Value": "+4.50", "selected": false }, { "Value": "+4.75", "selected": false }, { "Value": "+5.00", "selected": false },
            { "Value": "+5.25", "selected": false }, { "Value": "+5.50", "selected": false }, { "Value": "+5.75", "selected": false }, { "Value": "+6.00", "selected": false },
            { "Value": "+6.25", "selected": false }, { "Value": "+6.50", "selected": false }, { "Value": "+6.75", "selected": false }, { "Value": "+7.00", "selected": false },
            { "Value": "+7.25", "selected": false }, { "Value": "+7.50", "selected": false }, { "Value": "+7.75", "selected": false }, { "Value": "+8.00", "selected": false },
            { "Value": "+8.25", "selected": false }, { "Value": "+8.50", "selected": false }, { "Value": "+8.75", "selected": false }, { "Value": "+9.00", "selected": false },
            { "Value": "+9.25", "selected": false }, { "Value": "+9.50", "selected": false }, { "Value": "+9.75", "selected": false }, { "Value": "+10.00", "selected": false },
            { "Value": "+10.25", "selected": false }, { "Value": "+10.50", "selected": false }, { "Value": "+10.75", "selected": false }, { "Value": "+11.00", "selected": false },
            { "Value": "+11.25", "selected": false }, { "Value": "+11.50", "selected": false }, { "Value": "+11.75", "selected": false }, { "Value": "+12.00", "selected": false },
            { "Value": "+12.25", "selected": false }, { "Value": "+12.50", "selected": false }, { "Value": "+12.75", "selected": false }, { "Value": "+13.00", "selected": false },
            { "Value": "+13.25", "selected": false }, { "Value": "+13.50", "selected": false }, { "Value": "+13.75", "selected": false }, { "Value": "+14.00", "selected": false },
            { "Value": "+14.25", "selected": false }, { "Value": "+14.50", "selected": false }, { "Value": "+14.75", "selected": false }, { "Value": "+15.00", "selected": false },
            { "Value": "+15.25", "selected": false }, { "Value": "+15.50", "selected": false }, { "Value": "+15.75", "selected": false }, { "Value": "+16.00", "selected": false },
            { "Value": "+16.25", "selected": false }, { "Value": "+16.50", "selected": false }, { "Value": "+16.75", "selected": false }, { "Value": "+17.00", "selected": false },
            { "Value": "+17.25", "selected": false }, { "Value": "+17.50", "selected": false }, { "Value": "+17.75", "selected": false }, { "Value": "+18.00", "selected": false },
            { "Value": "+18.25", "selected": false }, { "Value": "+18.50", "selected": false }, { "Value": "+18.75", "selected": false }, { "Value": "+19.00", "selected": false },
            { "Value": "+19.25", "selected": false }, { "Value": "+19.50", "selected": false }, { "Value": "+19.75", "selected": false }, { "Value": "+20.0", "selected": false }];
    };

    $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
    $scope.RefSphericalList = angular.copy($scope.GetSphericalPlusList());
    $scope.CRefSphericalList = angular.copy($scope.GetSphericalPlusList());
    $scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
    $scope.LCVASphericalList = angular.copy($scope.GetSphericalPlusList());

    $scope.GetSphericalMinusList = function () {
        return [
            { "Value": "-0.25", "selected": false }, { "Value": "-0.50", "selected": false }, { "Value": "-0.75", "selected": false }, { "Value": "-1.00", "selected": false }, { "Value": "-1.25", "selected": false }, { "Value": "-1.50", "selected": false }, { "Value": "-1.75", "selected": false }, { "Value": "-2.00", "selected": false }, { "Value": "-2.25", "selected": false }, { "Value": "-2.50", "selected": false }, { "Value": "-2.75", "selected": false }, { "Value": "-3.00", "selected": false }, { "Value": "-3.25", "selected": false }, { "Value": "-3.50", "selected": false }, { "Value": "-3.75", "selected": false }, { "Value": "-4.00", "selected": false }, { "Value": "-4.25", "selected": false }, { "Value": "-4.50", "selected": false }, { "Value": "-4.75", "selected": false }, { "Value": "-5.00", "selected": false }, { "Value": "-5.25", "selected": false }, { "Value": "-5.5", "selected": false }, { "Value": "-5.75", "selected": false }, { "Value": "-6.0", "selected": false }, { "Value": "-6.25", "selected": false }, { "Value": "-6.5", "selected": false }, { "Value": "-6.75", "selected": false }, { "Value": "-7.00", "selected": false }, { "Value": "-7.25", "selected": false }, { "Value": "-7.50", "selected": false }, { "Value": "-7.75", "selected": false }, { "Value": "-8.00", "selected": false }, { "Value": "-8.25", "selected": false }, { "Value": "-8.50", "selected": false }, { "Value": "-8.75", "selected": false }, { "Value": "-9.00", "selected": false }, { "Value": "-9.25", "selected": false }, { "Value": "-9.50", "selected": false }, { "Value": "-9.75", "selected": false }, { "Value": "-10.00", "selected": false }, { "Value": "-10.25", "selected": false }, { "Value": "-10.50", "selected": false }, { "Value": "-10.75", "selected": false }, { "Value": "-11.00", "selected": false }, { "Value": "-11.25", "selected": false }, { "Value": "-11.50", "selected": false }, { "Value": "-11.75", "selected": false }, { "Value": "-12.00", "selected": false }, { "Value": "-12.25", "selected": false }, { "Value": "-12.50", "selected": false }, { "Value": "-12.75", "selected": false }, { "Value": "-13.00", "selected": false }, { "Value": "-13.25", "selected": false }, { "Value": "-13.50", "selected": false }, { "Value": "-13.75", "selected": false }, { "Value": "-14.00", "selected": false }, { "Value": "-14.25", "selected": false }, { "Value": "-14.50", "selected": false }, { "Value": "-14.75", "selected": false }, { "Value": "-15.00", "selected": false }, { "Value": "-15.25", "selected": false }, { "Value": "-15.50", "selected": false }, { "Value": "-15.75", "selected": false }, { "Value": "-16.00", "selected": false }, { "Value": "-16.25", "selected": false }, { "Value": "-16.50", "selected": false }, { "Value": "-16.75", "selected": false }, { "Value": "-17.00", "selected": false }, { "Value": "-17.25", "selected": false }, { "Value": "-17.50", "selected": false }, { "Value": "-17.75", "selected": false }, { "Value": "-18.0", "selected": false }, { "Value": "-18.25", "selected": false }, { "Value": "-18.5", "selected": false }, { "Value": "-18.75", "selected": false }, { "Value": "-19.00", "selected": false }, { "Value": "-19.25", "selected": false }, { "Value": "-19.50", "selected": false }, { "Value": "-19.75", "selected": false }, { "Value": "-20.00", "selected": false }];
    };

    $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
    $scope.RefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
    $scope.CRefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
    $scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
    $scope.LCVASphericalMinusList = angular.copy($scope.GetSphericalMinusList());

    $scope.GetCylindricalList = function () {
        return [
            { "Value": "+0.25", "selected": false }, { "Value": "+0.50", "selected": false }, { "Value": "+0.75", "selected": false }, { "Value": "+1.00", "selected": false },
            { "Value": "+1.25", "selected": false }, { "Value": "+1.50", "selected": false }, { "Value": "+1.75", "selected": false }, { "Value": "+2.00", "selected": false },
            { "Value": "+2.25", "selected": false }, { "Value": "+2.50", "selected": false }, { "Value": "+2.75", "selected": false }, { "Value": "+3.00", "selected": false },
            { "Value": "+3.25", "selected": false }, { "Value": "+3.50", "selected": false }, { "Value": "+3.75", "selected": false }, { "Value": "+4.00", "selected": false },
            { "Value": "+4.25", "selected": false }, { "Value": "+4.50", "selected": false }, { "Value": "+4.75", "selected": false }, { "Value": "+5.00", "selected": false },
            { "Value": "+5.25", "selected": false }, { "Value": "+5.50", "selected": false }, { "Value": "+5.75", "selected": false }, { "Value": "+6.00", "selected": false }];
    };

    $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
    $scope.RefCylindricalList = angular.copy($scope.GetCylindricalList());
    $scope.CRefCylindricalList = angular.copy($scope.GetCylindricalList());
    $scope.BBCylindricalList = angular.copy($scope.GetCylindricalList());
    $scope.LCVACylindricalList = angular.copy($scope.GetCylindricalList());

    $scope.GetCylMinusList = function () {
        return [{ "Value": "-0.25", "selected": false }, { "Value": "-0.50", "selected": false }, { "Value": "-0.75", "selected": false }, { "Value": "-1.00", "selected": false },
        { "Value": "-1.25", "selected": false }, { "Value": "-1.50", "selected": false }, { "Value": "-1.75", "selected": false }, { "Value": "-2.00", "selected": false },
        { "Value": "-2.25", "selected": false }, { "Value": "-2.50", "selected": false }, { "Value": "-2.75", "selected": false }, { "Value": "-3.00", "selected": false },
        { "Value": "-3.25", "selected": false }, { "Value": "-3.50", "selected": false }, { "Value": "-3.75", "selected": false }, { "Value": "-4.00", "selected": false },
        { "Value": "-4.25", "selected": false }, { "Value": "-4.50", "selected": false }, { "Value": "-4.75", "selected": false }, { "Value": "-5.00", "selected": false },
        { "Value": "-5.25", "selected": false }, { "Value": "-5.50", "selected": false }, { "Value": "-5.75", "selected": false }, { "Value": "-6.00", "selected": false }
        ]
    };
    $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
    $scope.RefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
    $scope.CRefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
    $scope.BBCylindricalMinusList = angular.copy($scope.GetCylMinusList());
    $scope.LCVACylindricalMinusList = angular.copy($scope.GetCylMinusList());

    $scope.GetAxisList = function () {
        return [{ "Value": "0", "selected": false }, { "Value": "5", "selected": false }, { "Value": "10", "selected": false }, { "Value": "15", "selected": false },
        { "Value": "20", "selected": false }, { "Value": "25", "selected": false }, { "Value": "30", "selected": false }, { "Value": "35", "selected": false },
        { "Value": "40", "selected": false }, { "Value": "45", "selected": false }, { "Value": "50", "selected": false }, { "Value": "55", "selected": false },
        { "Value": "60", "selected": false }, { "Value": "65", "selected": false }, { "Value": "70", "selected": false }, { "Value": "75", "selected": false },
        { "Value": "80", "selected": false }, { "Value": "85", "selected": false }, { "Value": "90", "selected": false }, { "Value": "95", "selected": false },
        { "Value": "100", "selected": false }, { "Value": "105", "selected": false }, { "Value": "110", "selected": false }, { "Value": "115", "selected": false },
        { "Value": "120", "selected": false }, { "Value": "125", "selected": false }, { "Value": "130", "selected": false }, { "Value": "135", "selected": false }, { "Value": "140", "selected": false },
        { "Value": "145", "selected": false }, { "Value": "150", "selected": false }, { "Value": "155", "selected": false }, { "Value": "160", "selected": false },
        { "Value": "165", "selected": false }, { "Value": "170", "selected": false }, { "Value": "175", "selected": false }, { "Value": "180", "selected": false }]
    };
    $scope.AxisList = angular.copy($scope.GetAxisList());
    $scope.RefAxisList = angular.copy($scope.GetAxisList());
    $scope.CRefAxisList = angular.copy($scope.GetAxisList());
    $scope.BBAxisList = angular.copy($scope.GetAxisList());
    $scope.LCVAAxisList = angular.copy($scope.GetAxisList());

    $scope.GetAxisMinusList = function () {
        return [{ "Value": "-0", "selected": false }, { "Value": "-5", "selected": false }, { "Value": "-10", "selected": false }, { "Value": "-15", "selected": false },
        { "Value": "-20", "selected": false }, { "Value": "-25", "selected": false }, { "Value": "-30", "selected": false }, { "Value": "-35", "selected": false },
        { "Value": "-40", "selected": false }, { "Value": "-45", "selected": false }, { "Value": "-50", "selected": false }, { "Value": "-55", "selected": false },
        { "Value": "-60", "selected": false }, { "Value": "-65", "selected": false }, { "Value": "-70", "selected": false }, { "Value": "-75", "selected": false },
        { "Value": "-80", "selected": false }, { "Value": "-85", "selected": false }, { "Value": "-90", "selected": false }, { "Value": "-95", "selected": false },
        { "Value": "-100", "selected": false }, { "Value": "-105", "selected": false }, { "Value": "-110", "selected": false }, { "Value": "-115", "selected": false },
        { "Value": "-120", "selected": false }, { "Value": "-125", "selected": false }, { "Value": "-130", "selected": false }, { "Value": "-135", "selected": false }, { "Value": "-140", "selected": false },
        { "Value": "-145", "selected": false }, { "Value": "-150", "selected": false }, { "Value": "-155", "selected": false }, { "Value": "-160", "selected": false },
        { "Value": "-165", "selected": false }, { "Value": "-170", "selected": false }, { "Value": "-175", "selected": false }, { "Value": "-180", "selected": false }]
    };

    $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
    $scope.RefAxisMinusList = angular.copy($scope.GetAxisMinusList());
    $scope.CRefAxisMinusList = angular.copy($scope.GetAxisMinusList());
    $scope.BBAxisMinusList = angular.copy($scope.GetAxisMinusList());
    $scope.LCVAAxisMinusList = angular.copy($scope.GetAxisMinusList());

    $scope.GetAddList = function () {

        return [{ "Value": "+0.25", "selected": false }, { "Value": "+0.5", "selected": false }, { "Value": "+0.75", "selected": false }, { "Value": "+1.0", "selected": false }, { "Value": "+1.25", "selected": false }, { "Value": "+1.5", "selected": false }, { "Value": "+1.75", "selected": false }, { "Value": "+2.0", "selected": false }, { "Value": "+2.25", "selected": false }, { "Value": "+2.5", "selected": false }, { "Value": "+2.75", "selected": false }, { "Value": "+3.0", "selected": false }, { "Value": "+3.25", "selected": false }, { "Value": "+3.5", "selected": false }, { "Value": "+3.75", "selected": false }, { "Value": "+4.0", "selected": false }];
    };

    $scope.AddList = angular.copy($scope.GetAddList());
    $scope.RefAddList = angular.copy($scope.GetAddList());
    $scope.CRefAddList = angular.copy($scope.GetAddList());
    $scope.BBAddList = angular.copy($scope.GetAddList());
    $scope.LCVAAddList = angular.copy($scope.GetAddList());

    $scope.GetAddMinusList = function () {

        return [{ "Value": "-0.25", "selected": false }, { "Value": "-0.5", "selected": false }, { "Value": "-0.75", "selected": false }, { "Value": "-1.0", "selected": false }, { "Value": "-1.25", "selected": false }, { "Value": "-1.5", "selected": false }, { "Value": "-1.75", "selected": false }, { "Value": "-2.0", "selected": false }, { "Value": "-2.25", "selected": false }, { "Value": "-2.5", "selected": false }, { "Value": "-2.75", "selected": false }, { "Value": "-3.0", "selected": false }, { "Value": "-3.25", "selected": false }, { "Value": "-3.5", "selected": false }, { "Value": "-3.75", "selected": false }, { "Value": "-4.0", "selected": false }];
    };
    $scope.AddMinusList = angular.copy($scope.GetAddMinusList());
    $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
    $scope.CRefAddMinusList = angular.copy($scope.GetAddMinusList());
    $scope.BBAddMinusList = angular.copy($scope.GetAddMinusList());
    $scope.LCVAAddMinusList = angular.copy($scope.GetAddMinusList());


    $scope.Clear = function () {
        $scope.UcvaList = angular.copy($scope.GetUcvaList());
        // $scope.refBcvaList = angular.copy($scope.GetUcvaList());
        $scope.refBcvaList = angular.copy($scope.GetRefBcvaList());
        $scope.refPHList = angular.copy($scope.GetUcvaList());
        //$scope.CrefUcvaList = angular.copy($scope.GetUcvaList());
        // $scope.CrefBcvaList = angular.copy($scope.GetUcvaList());
        $scope.CrefBcvaList = angular.copy($scope.GetRefBcvaList());
        //$scope.CrefPHList = angular.copy($scope.GetUcvaList());
        //  $scope.DistancePlusList = angular.copy($scope.GetUcvaList());
        $scope.DistancePlusList = angular.copy($scope.GetDistanceList());
        $scope.NearPlusList = angular.copy($scope.GetNearList());
        $scope.UnaidedDistanceMinusList = angular.copy($scope.GetUcvaMinusList());
        $scope.UnaidedNearMinusList = angular.copy($scope.GetUcvaMinusList());
        // $scope.UnaidedDistancePlusList = angular.copy($scope.GetUcvaList());
        $scope.UnaidedDistancePlusList = angular.copy($scope.GetDistanceList());
        $scope.UnaidedNearPlusList = angular.copy($scope.GetNearList());
        $scope.PinholeMinusList = angular.copy($scope.GetUcvaMinusList());
        // $scope.PinholePlusList = angular.copy($scope.GetUcvaList());
        $scope.PinholePlusList = angular.copy($scope.GetDistanceList());

        $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
        $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
        $scope.refPHMinusList = angular.copy($scope.GetUcvaMinusList());
        $scope.DistanceMinusList = angular.copy($scope.GetUcvaMinusList());
        $scope.NearMinusList = angular.copy($scope.GetUcvaMinusList());


        //$scope.CrefUcvaMinusList = angular.copy($scope.GetUcvaMinusList());
        $scope.CrefBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
        //$scope.CrefPHMinusList = angular.copy($scope.GetUcvaMinusList());
        $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
        $scope.refBcnvaMinusList = angular.copy($scope.GetUcvaMinusList());

        $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
        $scope.RefSphericalList = angular.copy($scope.GetSphericalPlusList());
        $scope.CRefSphericalList = angular.copy($scope.GetSphericalPlusList());
        $scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
        $scope.LCVASphericalList = angular.copy($scope.GetSphericalPlusList());

        $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
        $scope.RefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
        $scope.CRefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
        $scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
        $scope.LCVASphericalMinusList = angular.copy($scope.GetSphericalMinusList());
        $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
        $scope.RefCylindricalList = angular.copy($scope.GetCylindricalList());
        $scope.CRefCylindricalList = angular.copy($scope.GetCylindricalList());
        $scope.BBCylindricalList = angular.copy($scope.GetCylindricalList());
        $scope.LCVACylindricalList = angular.copy($scope.GetCylindricalList());
        $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
        $scope.RefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
        $scope.CRefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
        $scope.BBCylindricalMinusList = angular.copy($scope.GetCylMinusList());
        $scope.LCVACylindricalMinusList = angular.copy($scope.GetCylMinusList());
        $scope.AxisList = angular.copy($scope.GetAxisList());
        $scope.RefAxisList = angular.copy($scope.GetAxisList());
        $scope.CRefAxisList = angular.copy($scope.GetAxisList());
        $scope.BBAxisList = angular.copy($scope.GetAxisList());
        $scope.LCVAAxisList = angular.copy($scope.GetAxisList());
        $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
        $scope.RefAxisMinusList = angular.copy($scope.GetAxisMinusList());
        $scope.CRefAxisMinusList = angular.copy($scope.GetAxisMinusList());
        $scope.BBAxisMinusList = angular.copy($scope.GetAxisMinusList());
        $scope.LCVAAxisMinusList = angular.copy($scope.GetAxisMinusList());
        $scope.AddList = angular.copy($scope.GetAddList());
        $scope.RefAddList = angular.copy($scope.GetAddList());
        $scope.CRefAddList = angular.copy($scope.GetAddList());
        $scope.BBAddList = angular.copy($scope.GetAddList());
        $scope.LCVAAddList = angular.copy($scope.GetAddList());
        $scope.AddMinusList = angular.copy($scope.GetAddMinusList());
        $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
        $scope.CRefAddMinusList = angular.copy($scope.GetAddMinusList());
        $scope.BBAddMinusList = angular.copy($scope.GetAddMinusList());
        $scope.LCVAAddMinusList = angular.copy($scope.GetAddMinusList());
        $scope.BaseList = angular.copy($scope.GetBaseList());
        $scope.PrismList = angular.copy($scope.GetPrismList());
    };



    $scope.GetSelectedList = function () {
        $scope.Clear();
        if ($scope.SelectedInvestigation.InvestigationId === 1) {
            angular.forEach($scope.SelectedInvestigation.InvestigationOrgans, function (sitem) {
                angular.forEach($scope.SphericalList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                                mitem.selected = true;
                                $scope.SphericalRadio = 'sphericalplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                                mitem.selected = true;
                                $scope.SphericalRadio = 'sphericalplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Spherical = sitem.InvestigationAttributes.Spherical;
                        if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                            mitem.selected = true;
                            $scope.SphericalRadio = 'sphericalplus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Spherical = sitem.InvestigationAttributes.Spherical;
                    }
                });
                angular.forEach($scope.CylindricalList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                                mitem.selected = true;
                                $scope.CylRadio = 'cylplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                                mitem.selected = true;
                                $scope.CylRadio = 'cylplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = sitem.InvestigationAttributes.Cylindrical;
                        if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                            mitem.selected = true;
                            $scope.CylRadio = 'cylplus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = sitem.InvestigationAttributes.Cylindrical;
                    }
                });
                angular.forEach($scope.AxisList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                                mitem.selected = true;
                                $scope.AxisRadio = 'axisplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                                mitem.selected = true;
                                $scope.AxisRadio = 'axisplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Axis = sitem.InvestigationAttributes.Axis;
                        if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                            mitem.selected = true;
                            $scope.AxisRadio = 'axisplus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Axis = sitem.InvestigationAttributes.Axis;
                    }

                });
                //minus list
                angular.forEach($scope.SphericalMinusList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                                mitem.selected = true;
                                $scope.SphericalRadio = 'sphericalminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                                mitem.selected = true;
                                $scope.SphericalRadio = 'sphericalminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Spherical = sitem.InvestigationAttributes.Spherical;
                        if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                            mitem.selected = true;
                            $scope.SphericalRadio = 'sphericalminus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Spherical = sitem.InvestigationAttributes.Spherical;
                    }
                });
                angular.forEach($scope.CylindricalMinusList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                                mitem.selected = true;
                                $scope.CylRadio = 'cylminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                                mitem.selected = true;
                                $scope.CylRadio = 'cylminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = sitem.InvestigationAttributes.Cylindrical;
                        if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                            mitem.selected = true;
                            $scope.CylRadio = 'cylminus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = sitem.InvestigationAttributes.Cylindrical;
                    }
                });
                angular.forEach($scope.AxisMinusList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                                mitem.selected = true;
                                $scope.AxisRadio = 'axisminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                                mitem.selected = true;
                                $scope.AxisRadio = 'axisminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Axis = sitem.InvestigationAttributes.Axis;
                        if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                            mitem.selected = true;
                            $scope.AxisRadio = 'axisminus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Axis = sitem.InvestigationAttributes.Axis;
                    }
                });
            });
        }
        if ($scope.SelectedInvestigation.InvestigationId === 2) {
            angular.forEach($scope.SelectedInvestigation.InvestigationOrgans, function (sitem) {
                angular.forEach($scope.RefSphericalList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                                mitem.selected = true;
                                $scope.SphericalRadio = 'sphericalplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                                mitem.selected = true;
                                $scope.SphericalRadio = 'sphericalplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Spherical = sitem.InvestigationAttributes.Spherical;
                        if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                            mitem.selected = true;
                            $scope.SphericalRadio = 'sphericalplus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Spherical = sitem.InvestigationAttributes.Spherical;
                    }
                });
                angular.forEach($scope.RefCylindricalList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                                mitem.selected = true;
                                $scope.CylRadio = 'cylplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                                mitem.selected = true;
                                $scope.CylRadio = 'cylplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = sitem.InvestigationAttributes.Cylindrical;
                        if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                            mitem.selected = true;
                            $scope.CylRadio = 'cylplus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = sitem.InvestigationAttributes.Cylindrical;
                    }
                });
                angular.forEach($scope.RefAxisList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                                mitem.selected = true;
                                $scope.AxisRadio = 'axisplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                                mitem.selected = true;
                                $scope.AxisRadio = 'axisplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Axis = sitem.InvestigationAttributes.Axis;
                        if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                            mitem.selected = true;
                            $scope.AxisRadio = 'axisplus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Axis = sitem.InvestigationAttributes.Axis;
                    }
                });
                angular.forEach($scope.RefAddList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Adition === mitem.Value) {
                                mitem.selected = true;
                                $scope.AddRadio = 'addplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Adition === mitem.Value) {
                                mitem.selected = true;
                                $scope.AddRadio = 'addplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Adition = sitem.InvestigationAttributes.Adition;
                        if (sitem.InvestigationAttributes.Adition === mitem.Value) {
                            mitem.selected = true;
                            $scope.AddRadio = 'addplus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Adition = sitem.InvestigationAttributes.Adition;
                    }
                });
                angular.forEach($scope.UcvaList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.UCVA === mitem.Value) {
                                mitem.selected = true;
                                $scope.UCVARadio = 'ucvaplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.UCVA === mitem.Value) {
                                mitem.selected = true;
                                $scope.UCVARadio = 'ucvaplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.UCVA = sitem.InvestigationAttributes.UCVA;
                        if (sitem.InvestigationAttributes.UCVA === mitem.Value) {
                            mitem.selected = true;
                            $scope.UCVARadio = 'ucvaplus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.UCVA = sitem.InvestigationAttributes.UCVA;
                    }
                });
                angular.forEach($scope.refBcvaList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.BCVA === mitem.Value) {
                                mitem.selected = true;
                                $scope.BCVARadio = 'bcvaplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.BCVA === mitem.Value) {
                                mitem.selected = true;
                                $scope.BCVARadio = 'bcvaplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.BCVA = sitem.InvestigationAttributes.BCVA;
                        if (sitem.InvestigationAttributes.BCVA === mitem.Value) {
                            mitem.selected = true;
                            $scope.BCVARadio = 'bcvaplus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.BCVA = sitem.InvestigationAttributes.BCVA;
                    }
                });
                angular.forEach($scope.refBcnvaList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.BCNVA === mitem.Value) {
                                mitem.selected = true;
                                $scope.Bcnvaradio = 'bcnvaplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.BCNVA === mitem.Value) {
                                mitem.selected = true;
                                $scope.Bcnvaradio = 'bcnvaplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.BCNVA = sitem.InvestigationAttributes.BCNVA;
                        if (sitem.InvestigationAttributes.BCNVA === mitem.Value) {
                            mitem.selected = true;
                            $scope.Bcnvaradio = 'bcnvaplus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.BCNVA = sitem.InvestigationAttributes.BCNVA;
                    }
                });
                angular.forEach($scope.refPHList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.PH === mitem.Value) {
                                mitem.selected = true;
                                $scope.PHradio = 'phplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.PH === mitem.Value) {
                                mitem.selected = true;
                                $scope.PHradio = 'phplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.PH = sitem.InvestigationAttributes.PH;
                        if (sitem.InvestigationAttributes.PH === mitem.Value) {
                            mitem.selected = true;
                            $scope.PHradio = 'phplus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.PH = sitem.InvestigationAttributes.PH;
                    }
                });

                //minus list
                angular.forEach($scope.RefSphericalMinusList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                                mitem.selected = true;
                                $scope.SphericalRadio = 'sphericalminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                                mitem.selected = true;
                                $scope.SphericalRadio = 'sphericalminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Spherical = sitem.InvestigationAttributes.Spherical;
                        if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                            mitem.selected = true;
                            $scope.SphericalRadio = 'sphericalminus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Spherical = sitem.InvestigationAttributes.Spherical;
                    }
                });
                angular.forEach($scope.RefCylindricalMinusList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                                mitem.selected = true;
                                $scope.CylRadio = 'cylminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                                mitem.selected = true;
                                $scope.CylRadio = 'cylminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = sitem.InvestigationAttributes.Cylindrical;
                        if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                            mitem.selected = true;
                            $scope.CylRadio = 'cylminus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = sitem.InvestigationAttributes.Cylindrical;
                    }
                });
                angular.forEach($scope.RefAxisMinusList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                                mitem.selected = true;
                                $scope.AxisRadio = 'axisminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                                mitem.selected = true;
                                $scope.AxisRadio = 'axisminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Axis = sitem.InvestigationAttributes.Axis;
                        if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                            mitem.selected = true;
                            $scope.AxisRadio = 'axisminus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Axis = sitem.InvestigationAttributes.Axis;
                    }
                });
                angular.forEach($scope.RefAddMinusList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Adition === mitem.Value) {
                                mitem.selected = true;
                                $scope.AddRadio = 'addminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Adition === mitem.Value) {
                                mitem.selected = true;
                                $scope.AddRadio = 'addminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Adition = sitem.InvestigationAttributes.Adition;
                        if (sitem.InvestigationAttributes.Adition === mitem.Value) {
                            mitem.selected = true;
                            $scope.AddRadio = 'addminus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Adition = sitem.InvestigationAttributes.Adition;
                    }
                });
                angular.forEach($scope.UcvaMinusList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.UCVA === mitem.Value) {
                                mitem.selected = true;
                                $scope.UCVARadio = 'ucvaminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.UCVA === mitem.Value) {
                                mitem.selected = true;
                                $scope.UCVARadio = 'ucvaminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.UCVA = sitem.InvestigationAttributes.UCVA;
                        if (sitem.InvestigationAttributes.UCVA === mitem.Value) {
                            mitem.selected = true;
                            $scope.UCVARadio = 'ucvaminus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.UCVA = sitem.InvestigationAttributes.UCVA;
                    }
                });
                angular.forEach($scope.refBcvaMinusList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.BCVA === mitem.Value) {
                                mitem.selected = true;
                                $scope.BCVARadio = 'bcvaminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.BCVA === mitem.Value) {
                                mitem.selected = true;
                                $scope.BCVARadio = 'bcvaminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.BCVA = sitem.InvestigationAttributes.BCVA;
                        if (sitem.InvestigationAttributes.BCVA === mitem.Value) {
                            mitem.selected = true;
                            $scope.BCVARadio = 'bcvaminus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.BCVA = sitem.InvestigationAttributes.BCVA;
                    }
                });
                angular.forEach($scope.refBcnvaMinusList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.BCNVA === mitem.Value) {
                                mitem.selected = true;
                                $scope.Bcnvaradio = 'bcnvaminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.BCNVA === mitem.Value) {
                                mitem.selected = true;
                                $scope.Bcnvaradio = 'bcnvaminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.BCNVA = sitem.InvestigationAttributes.BCNVA;
                        if (sitem.InvestigationAttributes.BCNVA === mitem.Value) {
                            mitem.selected = true;
                            $scope.Bcnvaradio = 'bcnvaminus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.BCNVA = sitem.InvestigationAttributes.BCNVA;
                    }
                });

                angular.forEach($scope.refPHMinusList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.PH === mitem.Value) {
                                mitem.selected = true;
                                $scope.PHradio = 'phminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.PH === mitem.Value) {
                                mitem.selected = true;
                                $scope.PHradio = 'phminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.PH = sitem.InvestigationAttributes.PH;
                        if (sitem.InvestigationAttributes.PH === mitem.Value) {
                            mitem.selected = true;
                            $scope.PHradio = 'phminus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.PH = sitem.InvestigationAttributes.PH;
                    }
                });
            });
        }
        if ($scope.SelectedInvestigation.InvestigationId === 3) {
            angular.forEach($scope.SelectedInvestigation.InvestigationOrgans, function (sitem) {
                angular.forEach($scope.CRefSphericalList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                                mitem.selected = true;
                                $scope.SphericalRadio = 'sphericalplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                                mitem.selected = true;
                                $scope.SphericalRadio = 'sphericalplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Spherical = sitem.InvestigationAttributes.Spherical;
                        if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                            mitem.selected = true;
                            $scope.SphericalRadio = 'sphericalplus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Spherical = sitem.InvestigationAttributes.Spherical;
                    }
                });
                angular.forEach($scope.CRefCylindricalList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                                mitem.selected = true;
                                $scope.CylRadio = 'cylplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                                mitem.selected = true;
                                $scope.CylRadio = 'cylplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = sitem.InvestigationAttributes.Cylindrical;
                        if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                            mitem.selected = true;
                            $scope.CylRadio = 'cylplus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = sitem.InvestigationAttributes.Cylindrical;
                    }
                });

                angular.forEach($scope.CRefAxisList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                                mitem.selected = true;
                                $scope.AxisRadio = 'axisplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                                mitem.selected = true;
                                $scope.AxisRadio = 'axisplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Axis = sitem.InvestigationAttributes.Axis;
                        if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                            mitem.selected = true;
                            $scope.AxisRadio = 'axisplus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Axis = sitem.InvestigationAttributes.Axis;
                    }
                });
                angular.forEach($scope.CRefAddList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Adition === mitem.Value) {
                                mitem.selected = true;
                                $scope.AddRadio = 'addplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Adition === mitem.Value) {
                                mitem.selected = true;
                                $scope.AddRadio = 'addplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Adition = sitem.InvestigationAttributes.Adition;
                        if (sitem.InvestigationAttributes.Adition === mitem.Value) {
                            mitem.selected = true;
                            $scope.AddRadio = 'addplus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Adition = sitem.InvestigationAttributes.Adition;
                    }
                });
                //angular.forEach($scope.CrefUcvaList, function (mitem, index) {
                //    if ($scope.SelectedEye === 1) {
                //        if (sitem.InvestigationOrganID == 1) {
                //            if (sitem.InvestigationAttributes.UCVA === mitem.Value) {
                //                mitem.selected = true;
                //                $scope.UCVARadio = 'ucvaplus';
                //            }
                //        }
                //    }
                //    if ($scope.SelectedEye === 2) {
                //        if (sitem.InvestigationOrganID == 2) {
                //            if (sitem.InvestigationAttributes.UCVA === mitem.Value) {
                //                mitem.selected = true;
                //                $scope.UCVARadio = 'ucvaplus';
                //            }
                //        }
                //    }
                //    if ($scope.SelectedEye === 3) {
                //        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.UCVA = sitem.InvestigationAttributes.UCVA;
                //        if (sitem.InvestigationAttributes.UCVA === mitem.Value) {
                //            mitem.selected = true;
                //            $scope.UCVARadio = 'ucvaplus';
                //        }
                //        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.UCVA = sitem.InvestigationAttributes.UCVA;
                //    }
                //});

                angular.forEach($scope.CrefBcvaList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.BCVA === mitem.Value) {
                                mitem.selected = true;
                                $scope.BCVARadio = 'bcvaplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.BCVA === mitem.Value) {
                                mitem.selected = true;
                                $scope.BCVARadio = 'bcvaplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.BCVA = sitem.InvestigationAttributes.BCVA;
                        if (sitem.InvestigationAttributes.BCVA === mitem.Value) {
                            mitem.selected = true;
                            $scope.BCVARadio = 'bcvaplus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.BCVA = sitem.InvestigationAttributes.BCVA;
                    }
                });
                //angular.forEach($scope.CrefPHList, function (mitem, index) {
                //    if ($scope.SelectedEye === 1) {
                //        if (sitem.InvestigationOrganID == 1) {
                //            if (sitem.InvestigationAttributes.PH === mitem.Value) {
                //                mitem.selected = true;
                //                $scope.PHradio = 'phplus';
                //            }
                //        }
                //    }
                //    if ($scope.SelectedEye === 2) {
                //        if (sitem.InvestigationOrganID == 2) {
                //            if (sitem.InvestigationAttributes.PH === mitem.Value) {
                //                mitem.selected = true;
                //                $scope.PHradio = 'phplus';
                //            }
                //        }
                //    }
                //    if ($scope.SelectedEye === 3) {
                //        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.PH = sitem.InvestigationAttributes.PH;
                //        if (sitem.InvestigationAttributes.PH === mitem.Value) {
                //            mitem.selected = true;
                //            $scope.PHradio = 'phplus';
                //        }
                //        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.PH = sitem.InvestigationAttributes.PH;
                //    }
                //});
                //minus list

                angular.forEach($scope.CRefSphericalMinusList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                                mitem.selected = true;
                                $scope.SphericalRadio = 'sphericalminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                                mitem.selected = true;
                                $scope.SphericalRadio = 'sphericalminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Spherical = sitem.InvestigationAttributes.Spherical;
                        if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                            mitem.selected = true;
                            $scope.SphericalRadio = 'sphericalminus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Spherical = sitem.InvestigationAttributes.Spherical;
                    }
                });
                angular.forEach($scope.CRefCylindricalMinusList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                                mitem.selected = true;
                                $scope.CylRadio = 'cylminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                                mitem.selected = true;
                                $scope.CylRadio = 'cylminus';
                            }
                        }
                    }

                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = sitem.InvestigationAttributes.Cylindrical;
                        if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                            mitem.selected = true;
                            $scope.CylRadio = 'cylminus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = sitem.InvestigationAttributes.Cylindrical;
                    }
                });
                angular.forEach($scope.CRefAxisMinusList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                                mitem.selected = true;
                                $scope.AxisRadio = 'axisminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                                mitem.selected = true;
                                $scope.AxisRadio = 'axisminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Axis = sitem.InvestigationAttributes.Axis;
                        if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                            mitem.selected = true;
                            $scope.AxisRadio = 'axisminus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Axis = sitem.InvestigationAttributes.Axis;
                    }
                });
                angular.forEach($scope.CRefAddMinusList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Adition === mitem.Value) {
                                mitem.selected = true;
                                $scope.AddRadio = 'addminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Adition === mitem.Value) {
                                mitem.selected = true;
                                $scope.AddRadio = 'addminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Adition = sitem.InvestigationAttributes.Adition;
                        if (sitem.InvestigationAttributes.Adition === mitem.Value) {
                            mitem.selected = true;
                            $scope.AddRadio = 'addminus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Adition = sitem.InvestigationAttributes.Adition;
                    }
                });
                //angular.forEach($scope.CrefUcvaMinusList, function (mitem, index) {
                //    if ($scope.SelectedEye === 1) {
                //        if (sitem.InvestigationOrganID == 1) {
                //            if (sitem.InvestigationAttributes.UCVA === mitem.Value) {
                //                mitem.selected = true;
                //                $scope.UCVARadio = 'ucvaminus';
                //            }
                //        }
                //    }
                //    if ($scope.SelectedEye === 2) {
                //        if (sitem.InvestigationOrganID == 2) {
                //            if (sitem.InvestigationAttributes.UCVA === mitem.Value) {
                //                mitem.selected = true;
                //                $scope.UCVARadio = 'ucvaminus';
                //            }
                //        }
                //    }
                //    if ($scope.SelectedEye === 3) {
                //        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.UCVA = sitem.InvestigationAttributes.UCVA;
                //        if (sitem.InvestigationAttributes.UCVA === mitem.Value) {
                //            mitem.selected = true;
                //            $scope.UCVARadio = 'ucvaminus';
                //        }
                //        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.UCVA = sitem.InvestigationAttributes.UCVA;
                //    }
                //});
                angular.forEach($scope.CrefBcvaMinusList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.BCVA === mitem.Value) {
                                mitem.selected = true;
                                $scope.BCVARadio = 'bcvaminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.BCVA === mitem.Value) {
                                mitem.selected = true;
                                $scope.BCVARadio = 'bcvaminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.BCVA = sitem.InvestigationAttributes.BCVA;
                        if (sitem.InvestigationAttributes.BCVA === mitem.Value) {
                            mitem.selected = true;
                            $scope.BCVARadio = 'bcvaminus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.BCVA = sitem.InvestigationAttributes.BCVA;
                    }
                });
                //angular.forEach($scope.CrefPHMinusList, function (mitem, index) {
                //    if ($scope.SelectedEye === 1) {
                //        if (sitem.InvestigationOrganID == 1) {
                //            if (sitem.InvestigationAttributes.PH === mitem.Value) {
                //                mitem.selected = true;
                //                $scope.PHradio = 'phminus';
                //            }
                //        }
                //    }
                //    if ($scope.SelectedEye === 2) {
                //        if (sitem.InvestigationOrganID == 2) {
                //            if (sitem.InvestigationAttributes.PH === mitem.Value) {
                //                mitem.selected = true;
                //                $scope.PHradio = 'phminus';
                //            }
                //        }
                //    }
                //    if ($scope.SelectedEye === 3) {
                //        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.PH = sitem.InvestigationAttributes.PH;
                //        if (sitem.InvestigationAttributes.PH === mitem.Value) {
                //            mitem.selected = true;
                //            $scope.PHradio = 'phminus';
                //        }
                //        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.PH = sitem.InvestigationAttributes.PH;
                //    }
                //});
            });
        }
        if ($scope.SelectedInvestigation.InvestigationId === 10) {
            angular.forEach($scope.SelectedInvestigation.InvestigationOrgans, function (sitem) {
                angular.forEach($scope.BBSphericalList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                                mitem.selected = true;
                                $scope.SphericalRadio = 'sphericalplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                                mitem.selected = true;
                                $scope.SphericalRadio = 'sphericalplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Spherical = sitem.InvestigationAttributes.Spherical;
                        if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                            mitem.selected = true;
                            $scope.SphericalRadio = 'sphericalplus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Spherical = sitem.InvestigationAttributes.Spherical;
                    }
                });
                angular.forEach($scope.BBCylindricalList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                                mitem.selected = true;
                                $scope.CylRadio = 'cylplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                                mitem.selected = true;
                                $scope.CylRadio = 'cylplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = sitem.InvestigationAttributes.Cylindrical;
                        if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                            mitem.selected = true;
                            $scope.CylRadio = 'cylplus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = sitem.InvestigationAttributes.Cylindrical;
                    }
                });
                angular.forEach($scope.BBAxisList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                                mitem.selected = true;
                                $scope.AxisRadio = 'axisplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                                mitem.selected = true;
                                $scope.AxisRadio = 'axisplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Axis = sitem.InvestigationAttributes.Axis;
                        if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                            mitem.selected = true;
                            $scope.AxisRadio = 'axisplus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Axis = sitem.InvestigationAttributes.Axis;
                    }
                });
                angular.forEach($scope.BBAddList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Adition === mitem.Value) {
                                mitem.selected = true;
                                $scope.AddRadio = 'addplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Adition === mitem.Value) {
                                mitem.selected = true;
                                $scope.AddRadio = 'addplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Adition = sitem.InvestigationAttributes.Adition;
                        if (sitem.InvestigationAttributes.Adition === mitem.Value) {
                            mitem.selected = true;
                            $scope.AddRadio = 'addplus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Adition = sitem.InvestigationAttributes.Adition;
                    }
                });

                // minus list
                angular.forEach($scope.BBSphericalMinusList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                                mitem.selected = true;
                                $scope.SphericalRadio = 'sphericalminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                                mitem.selected = true;
                                $scope.SphericalRadio = 'sphericalminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Spherical = sitem.InvestigationAttributes.Spherical;
                        if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                            mitem.selected = true;
                            $scope.SphericalRadio = 'sphericalminus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Spherical = sitem.InvestigationAttributes.Spherical;
                    }
                });
                angular.forEach($scope.BBCylindricalMinusList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                                mitem.selected = true;
                                $scope.CylRadio = 'cylminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                                mitem.selected = true;
                                $scope.CylRadio = 'cylminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = sitem.InvestigationAttributes.Cylindrical;
                        if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                            mitem.selected = true;
                            $scope.CylRadio = 'cylminus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = sitem.InvestigationAttributes.Cylindrical;
                    }
                });
                angular.forEach($scope.BBAxisMinusList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                                mitem.selected = true;
                                $scope.AxisRadio = 'axisminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                                mitem.selected = true;
                                $scope.AxisRadio = 'axisminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Axis = sitem.InvestigationAttributes.Axis;
                        if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                            mitem.selected = true;
                            $scope.AxisRadio = 'axisminus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Axis = sitem.InvestigationAttributes.Axis;
                    }
                });
                angular.forEach($scope.BBAddMinusList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Adition === mitem.Value) {
                                mitem.selected = true;
                                $scope.AddRadio = 'addminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Adition === mitem.Value) {
                                mitem.selected = true;
                                $scope.AddRadio = 'addminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Adition = sitem.InvestigationAttributes.Adition;
                        if (sitem.InvestigationAttributes.Adition === mitem.Value) {
                            mitem.selected = true;
                            $scope.AddRadio = 'addminus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Adition = sitem.InvestigationAttributes.Adition;
                    }
                });
            });
        }
        if ($scope.SelectedInvestigation.InvestigationId === 8) {
            angular.forEach($scope.SelectedInvestigation.InvestigationOrgans, function (sitem) {
                angular.forEach($scope.LCVASphericalList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                                mitem.selected = true;
                                $scope.SphericalRadio = 'sphericalplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                                mitem.selected = true;
                                $scope.SphericalRadio = 'sphericalplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Spherical = sitem.InvestigationAttributes.Spherical;
                        if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                            mitem.selected = true;
                            $scope.SphericalRadio = 'sphericalplus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Spherical = sitem.InvestigationAttributes.Spherical;
                    }
                });
                angular.forEach($scope.LCVACylindricalList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                                mitem.selected = true;
                                $scope.CylRadio = 'cylplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                                mitem.selected = true;
                                $scope.CylRadio = 'cylplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = sitem.InvestigationAttributes.Cylindrical;
                        if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                            mitem.selected = true;
                            $scope.CylRadio = 'cylplus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = sitem.InvestigationAttributes.Cylindrical;
                    }
                });
                angular.forEach($scope.LCVAAxisList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                                mitem.selected = true;
                                $scope.AxisRadio = 'axisplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                                mitem.selected = true;
                                $scope.AxisRadio = 'axisplus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Axis = sitem.InvestigationAttributes.Axis;
                        if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                            mitem.selected = true;
                            $scope.AxisRadio = 'axisplus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Axis = sitem.InvestigationAttributes.Axis;
                    }
                });

                //minus list
                angular.forEach($scope.LCVASphericalMinusList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                                mitem.selected = true;
                                $scope.SphericalRadio = 'sphericalminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                                mitem.selected = true;
                                $scope.SphericalRadio = 'sphericalminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Spherical = sitem.InvestigationAttributes.Spherical;
                        if (sitem.InvestigationAttributes.Spherical === mitem.Value) {
                            mitem.selected = true;
                            $scope.SphericalRadio = 'sphericalminus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Spherical = sitem.InvestigationAttributes.Spherical;
                    }

                });
                angular.forEach($scope.LCVACylindricalMinusList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                                mitem.selected = true;
                                $scope.CylRadio = 'cylminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                                mitem.selected = true;
                                $scope.CylRadio = 'cylminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = sitem.InvestigationAttributes.Cylindrical;
                        if (sitem.InvestigationAttributes.Cylindrical === mitem.Value) {
                            mitem.selected = true;
                            $scope.CylRadio = 'cylminus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = sitem.InvestigationAttributes.Cylindrical;
                    }
                });
                angular.forEach($scope.LCVAAxisMinusList, function (mitem, index) {
                    if ($scope.SelectedEye === 1) {
                        if (sitem.InvestigationOrganID == 1) {
                            if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                                mitem.selected = true;
                                $scope.AxisRadio = 'axisminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 2) {
                        if (sitem.InvestigationOrganID == 2) {
                            if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                                mitem.selected = true;
                                $scope.AxisRadio = 'axisminus';
                            }
                        }
                    }
                    if ($scope.SelectedEye === 3) {
                        $scope.SelectedInvestigation.InvestigationOrgans[0].InvestigationAttributes.Axis = sitem.InvestigationAttributes.Axis;
                        if (sitem.InvestigationAttributes.Axis === mitem.Value) {
                            mitem.selected = true;
                            $scope.AxisRadio = 'axisminus';
                        }
                        $scope.SelectedInvestigation.InvestigationOrgans[1].InvestigationAttributes.Axis = sitem.InvestigationAttributes.Axis;
                    }
                });
            });
        }

        if ($scope.SelectedaidedInvestigation.InvestigationId === 5) {
            //angular.forEach($scope.SelectedInvestigation.Attributes, function (sitem) {
            angular.forEach($scope.DistancePlusList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    //if (sitem.InvestigationOrganID == 1) {
                    if ($scope.SelectedaidedInvestigation.Attributes.distanceVision.RightEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.DistanceRadio = 'Distanceplus';
                    }
                    // }
                }
                if ($scope.SelectedEye === 2) {
                    //if (sitem.InvestigationOrganID == 2) {
                    if ($scope.SelectedaidedInvestigation.Attributes.distanceVision.LeftEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.DistanceRadio = 'Distanceplus';
                    }
                    //}
                }
                if ($scope.SelectedEye === 3) {

                    if ($scope.SelectedaidedInvestigation.Attributes.distanceVision.RightEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.DistanceRadio = 'Distanceplus';
                        $scope.SelectedaidedInvestigation.Attributes.distanceVision.RightEye = mitem.Value;
                        $scope.SelectedaidedInvestigation.Attributes.distanceVision.LeftEye = mitem.Value;
                    }

                }
            });
            angular.forEach($scope.DistanceMinusList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    //if (sitem.InvestigationOrganID == 1) {
                    if ($scope.SelectedaidedInvestigation.Attributes.distanceVision.RightEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.DistanceRadio = 'Distanceminus';
                    }
                    // }
                }
                if ($scope.SelectedEye === 2) {
                    //if (sitem.InvestigationOrganID == 2) {
                    if ($scope.SelectedaidedInvestigation.Attributes.distanceVision.LeftEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.DistanceRadio = 'Distanceminus';
                    }
                    //}
                }
                if ($scope.SelectedEye === 3) {

                    if ($scope.SelectedaidedInvestigation.Attributes.distanceVision.RightEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.DistanceRadio = 'Distanceminus';
                        $scope.SelectedaidedInvestigation.Attributes.distanceVision.RightEye = mitem.Value;
                        $scope.SelectedaidedInvestigation.Attributes.distanceVision.LeftEye = mitem.Value;
                    }

                }
            });


            //minus list
            angular.forEach($scope.NearPlusList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    //if (sitem.InvestigationOrganID == 1) {
                    if ($scope.SelectedaidedInvestigation.Attributes.NearVision.RightEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.NearRadio = 'Nearplus';
                    }
                    // }
                }
                if ($scope.SelectedEye === 2) {
                    //if (sitem.InvestigationOrganID == 2) {
                    if ($scope.SelectedaidedInvestigation.Attributes.NearVision.LeftEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.NearRadio = 'Nearplus';
                    }
                    //}
                }
                if ($scope.SelectedEye === 3) {

                    if ($scope.SelectedaidedInvestigation.Attributes.NearVision.RightEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.NearRadio = 'Nearplus';
                        $scope.SelectedaidedInvestigation.Attributes.NearVision.RightEye = mitem.Value;
                        $scope.SelectedaidedInvestigation.Attributes.NearVision.LeftEye = mitem.Value;
                    }

                }

            });
            angular.forEach($scope.NearMinusList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    //if (sitem.InvestigationOrganID == 1) {
                    if ($scope.SelectedaidedInvestigation.Attributes.NearVision.RightEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.NearRadio = 'Nearminus';
                    }
                    // }
                }
                if ($scope.SelectedEye === 2) {
                    //if (sitem.InvestigationOrganID == 2) {
                    if ($scope.SelectedaidedInvestigation.Attributes.NearVision.LeftEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.NearRadio = 'Nearminus';
                    }
                    //}
                }
                if ($scope.SelectedEye === 3) {

                    if ($scope.SelectedaidedInvestigation.Attributes.NearVision.RightEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.NearRadio = 'Nearminus';
                        $scope.SelectedaidedInvestigation.Attributes.NearVision.RightEye = mitem.Value;
                        $scope.SelectedaidedInvestigation.Attributes.NearVision.LeftEye = mitem.Value;
                    }

                }
            });

            //});
        }
        if ($scope.SelectedunaidedInvestigation.InvestigationId === 4) {
            //angular.forEach($scope.SelectedInvestigation.Attributes, function (sitem) {
            angular.forEach($scope.UnaidedDistancePlusList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    //if (sitem.InvestigationOrganID == 1) {
                    if ($scope.SelectedunaidedInvestigation.Attributes.distanceVision.RightEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.UnaidedDistanceRadio = 'UnaidedDistanceplus';
                    }
                    // }
                }
                if ($scope.SelectedEye === 2) {
                    //if (sitem.InvestigationOrganID == 2) {
                    if ($scope.SelectedunaidedInvestigation.Attributes.distanceVision.LeftEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.UnaidedDistanceRadio = 'UnaidedDistanceplus';
                    }
                    //}
                }
                if ($scope.SelectedEye === 3) {

                    if ($scope.SelectedunaidedInvestigation.Attributes.distanceVision.RightEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.UnaidedDistanceRadio = 'UnaidedDistanceplus';
                        $scope.SelectedunaidedInvestigation.Attributes.distanceVision.RightEye = mitem.Value;
                        $scope.SelectedunaidedInvestigation.Attributes.distanceVision.LeftEye = mitem.Value;
                    }

                }
            });
            angular.forEach($scope.UnaidedDistanceMinusList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    //if (sitem.InvestigationOrganID == 1) {
                    if ($scope.SelectedunaidedInvestigation.Attributes.distanceVision.RightEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.UnaidedDistanceRadio = 'UnaidedDistanceminus';
                    }
                    // }
                }
                if ($scope.SelectedEye === 2) {
                    //if (sitem.InvestigationOrganID == 2) {
                    if ($scope.SelectedunaidedInvestigation.Attributes.distanceVision.LeftEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.UnaidedDistanceRadio = 'UnaidedDistanceminus';
                    }
                    //}
                }
                if ($scope.SelectedEye === 3) {

                    if ($scope.SelectedunaidedInvestigation.Attributes.distanceVision.RightEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.UnaidedDistanceRadio = 'UnaidedDistanceminus';
                        $scope.SelectedunaidedInvestigation.Attributes.distanceVision.RightEye = mitem.Value;
                        $scope.SelectedunaidedInvestigation.Attributes.distanceVision.LeftEye = mitem.Value;
                    }

                }
            });


            //minus list
            angular.forEach($scope.UnaidedNearPlusList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    //if (sitem.InvestigationOrganID == 1) {
                    if ($scope.SelectedunaidedInvestigation.Attributes.NearVision.RightEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.UnaidedNearRadio = 'UnaidedNearplus';
                    }
                    // }
                }
                if ($scope.SelectedEye === 2) {
                    //if (sitem.InvestigationOrganID == 2) {
                    if ($scope.SelectedunaidedInvestigation.Attributes.NearVision.LeftEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.UnaidedNearRadio = 'UnaidedNearplus';
                    }
                    //}
                }
                if ($scope.SelectedEye === 3) {

                    if ($scope.SelectedunaidedInvestigation.Attributes.NearVision.RightEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.UnaidedNearRadio = 'UnaidedNearplus';
                        $scope.SelectedunaidedInvestigation.Attributes.NearVision.RightEye = mitem.Value;
                        $scope.SelectedunaidedInvestigation.Attributes.NearVision.LeftEye = mitem.Value;
                    }

                }

            });
            angular.forEach($scope.UnaidedNearMinusList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    //if (sitem.InvestigationOrganID == 1) {
                    if ($scope.SelectedunaidedInvestigation.Attributes.NearVision.RightEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.UnaidedNearRadio = 'UnaidedNearminus';
                    }
                    // }
                }
                if ($scope.SelectedEye === 2) {
                    //if (sitem.InvestigationOrganID == 2) {
                    if ($scope.SelectedunaidedInvestigation.Attributes.NearVision.LeftEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.UnaidedNearRadio = 'UnaidedNearminus';
                    }
                    //}
                }
                if ($scope.SelectedEye === 3) {

                    if ($scope.SelectedunaidedInvestigation.Attributes.NearVision.RightEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.UnaidedNearRadio = 'UnaidedNearminus';
                        $scope.SelectedunaidedInvestigation.Attributes.NearVision.RightEye = mitem.Value;
                        $scope.SelectedunaidedInvestigation.Attributes.NearVision.LeftEye = mitem.Value;
                    }

                }
            });

            //});
        }

        if ($scope.SelectedpinholeInvestigation.InvestigationId === 13) {
            //angular.forEach($scope.SelectedInvestigation.Attributes, function (sitem) {
            angular.forEach($scope.PinholePlusList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    //if (sitem.InvestigationOrganID == 1) {
                    if ($scope.SelectedpinholeInvestigation.Attributes.RightEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.PinholeRadio = "Pinholeplus";
                    }
                    // }
                }
                if ($scope.SelectedEye === 2) {
                    //if (sitem.InvestigationOrganID == 2) {
                    if ($scope.SelectedpinholeInvestigation.Attributes.LeftEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.PinholeRadio = "Pinholeplus";
                    }
                    //}
                }
                if ($scope.SelectedEye === 3) {

                    if ($scope.SelectedpinholeInvestigation.Attributes.RightEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.PinholeRadio = "Pinholeplus";
                        $scope.SelectedpinholeInvestigation.Attributes.RightEye = mitem.Value;
                        $scope.SelectedpinholeInvestigation.Attributes.LeftEye = mitem.Value;
                    }

                }
            });
            angular.forEach($scope.PinholeMinusList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    //if (sitem.InvestigationOrganID == 1) {
                    if ($scope.SelectedpinholeInvestigation.Attributes.RightEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.PinholeRadio = "Pinholeminus";
                    }
                    // }
                }
                if ($scope.SelectedEye === 2) {
                    //if (sitem.InvestigationOrganID == 2) {
                    if ($scope.SelectedpinholeInvestigation.Attributes.LeftEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.PinholeRadio = "Pinholeminus";
                    }
                    //}
                }
                if ($scope.SelectedEye === 3) {

                    if ($scope.SelectedpinholeInvestigation.Attributes.RightEye === mitem.Value) {
                        mitem.selected = true;
                        $scope.PinholeRadio = "Pinholeminus";
                        $scope.SelectedpinholeInvestigation.Attributes.RightEye = mitem.Value;
                        $scope.SelectedpinholeInvestigation.Attributes.LeftEye = mitem.Value;
                    }

                }
            });



        }

        if ($scope.SelectedInvestigation.InvestigationId === 43 || $scope.SelectedInvestigation.InvestigationId === 44) {

            angular.forEach($scope.UcvaList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    if ($scope.SelectedInvestigation.RightEyeValues.UVa === mitem.Value) {
                        mitem.selected = true;
                        $scope.UCVARadio = 'ucvaplus';
                    }
                }
                if ($scope.SelectedEye === 2) {
                    if ($scope.SelectedInvestigation.LeftEyeValues.UVa === mitem.Value) {
                        mitem.selected = true;
                        $scope.UCVARadio = 'ucvaplus';
                    }
                }
                if ($scope.SelectedEye === 3) {
                    if ($scope.SelectedInvestigation.RightEyeValues.UVa === mitem.Value) {
                        mitem.selected = true;
                        $scope.UCVARadio = 'ucvaplus';
                    }
                    $scope.SelectedInvestigation.LeftEyeValues.UVa = $scope.SelectedInvestigation.RightEyeValues.UVa;
                }
            });

            angular.forEach($scope.SphericalList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    if ($scope.SelectedInvestigation.RightEyeValues.Spherical === mitem.Value) {
                        mitem.selected = true;
                        $scope.SphericalRadio = 'sphericalplus';
                    }

                }
                if ($scope.SelectedEye === 2) {
                    if ($scope.SelectedInvestigation.LeftEyeValues.Spherical === mitem.Value) {
                        mitem.selected = true;
                        $scope.SphericalRadio = 'sphericalplus';
                    }
                }
                if ($scope.SelectedEye === 3) {
                    if ($scope.SelectedInvestigation.RightEyeValues.Spherical === mitem.Value) {
                        mitem.selected = true;
                        $scope.SphericalRadio = 'sphericalplus';
                    }

                    $scope.SelectedInvestigation.LeftEyeValues.Spherical = $scope.SelectedInvestigation.RightEyeValues.Spherical;
                }
            });
            angular.forEach($scope.CylindricalList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {

                    if ($scope.SelectedInvestigation.RightEyeValues.Cylindrical === mitem.Value) {
                        mitem.selected = true;
                        $scope.CylRadio = 'cylplus';
                    }

                }
                if ($scope.SelectedEye === 2) {
                    if ($scope.SelectedInvestigation.LeftEyeValues.Cylindrical === mitem.Value) {
                        mitem.selected = true;
                        $scope.CylRadio = 'cylplus';
                    }
                }
                if ($scope.SelectedEye === 3) {
                    if ($scope.SelectedInvestigation.RightEyeValues.Cylindrical === mitem.Value) {
                        mitem.selected = true;
                        $scope.CylRadio = 'cylplus';
                    }
                    $scope.SelectedInvestigation.LeftEyeValues.Cylindrical = $scope.SelectedInvestigation.RightEyeValues.Cylindrical;
                }
            });

            angular.forEach($scope.AxisList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    if ($scope.SelectedInvestigation.RightEyeValues.Axis === mitem.Value) {
                        mitem.selected = true;
                        $scope.AxisRadio = 'axisplus';
                    }
                }
                if ($scope.SelectedEye === 2) {
                    if ($scope.SelectedInvestigation.LeftEyeValues.Axis === mitem.Value) {
                        mitem.selected = true;
                        $scope.AxisRadio = 'axisplus';
                    }
                }
                if ($scope.SelectedEye === 3) {
                    if ($scope.SelectedInvestigation.RightEyeValues.Axis === mitem.Value) {
                        mitem.selected = true;
                        $scope.AxisRadio = 'axisplus';
                    }
                    $scope.SelectedInvestigation.LeftEyeValues.Axis = $scope.SelectedInvestigation.RightEyeValues.Axis;
                }
            });
            angular.forEach($scope.RefAddList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {

                    if ($scope.SelectedInvestigation.RightEyeValues.Adition === mitem.Value) {
                        mitem.selected = true;
                        $scope.AddRadio = 'addplus';
                    }
                }
                if ($scope.SelectedEye === 2) {
                    if ($scope.SelectedInvestigation.LeftEyeValues.Adition === mitem.Value) {
                        mitem.selected = true;
                        $scope.AddRadio = 'addplus';
                    }
                }
                if ($scope.SelectedEye === 3) {
                    if ($scope.SelectedInvestigation.RightEyeValues.Adition === mitem.Value) {
                        mitem.selected = true;
                        $scope.AddRadio = 'addplus';
                    }
                    $scope.SelectedInvestigation.LeftEyeValues.Adition = $scope.SelectedInvestigation.RightEyeValues.Adition;
                }
            });

            angular.forEach($scope.refBcvaList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    if ($scope.SelectedInvestigation.RightEyeValues.BCVA === mitem.Value) {
                        mitem.selected = true;
                        $scope.BCVARadio = 'bcvaplus';
                    }
                }
                if ($scope.SelectedEye === 2) {

                    if ($scope.SelectedInvestigation.LeftEyeValues.BCVA === mitem.Value) {
                        mitem.selected = true;
                        $scope.BCVARadio = 'bcvaplus';
                    }
                }
                if ($scope.SelectedEye === 3) {
                    if ($scope.SelectedInvestigation.RightEyeValues.BCVA === mitem.Value) {
                        mitem.selected = true;
                        $scope.BCVARadio = 'bcvaplus';
                    }
                    $scope.SelectedInvestigation.LeftEyeValues.BCVA = $scope.SelectedInvestigation.RightEyeValues.BCVA;
                }
            });
            angular.forEach($scope.refBcnvaList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    if ($scope.SelectedInvestigation.RightEyeValues.BCNVA === mitem.Value) {
                        mitem.selected = true;
                        $scope.Bcnvaradio = 'bcnvaplus';
                    }

                }
                if ($scope.SelectedEye === 2) {
                    if ($scope.SelectedInvestigation.LeftEyeValues.BCNVA === mitem.Value) {
                        mitem.selected = true;
                        $scope.Bcnvaradio = 'bcnvaplus';
                    }
                }
                if ($scope.SelectedEye === 3) {
                    if ($scope.SelectedInvestigation.RightEyeValues.BCNVA === mitem.Value) {
                        mitem.selected = true;
                        $scope.Bcnvaradio = 'bcnvaplus';
                    }
                    $scope.SelectedInvestigation.LeftEyeValues.BCNVA = $scope.SelectedInvestigation.RightEyeValues.BCNVA;
                }
            });


            angular.forEach($scope.BaseList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    if ($scope.SelectedInvestigation.RightEyeValues.Base === mitem.Value) {
                        mitem.selected = true;
                        $scope.BaseRadio = 'baseplus';
                    }

                }
                if ($scope.SelectedEye === 2) {
                    if ($scope.SelectedInvestigation.LeftEyeValues.Base === mitem.Value) {
                        mitem.selected = true;
                        $scope.BaseRadio = 'baseplus';
                    }
                }
                if ($scope.SelectedEye === 3) {
                    if ($scope.SelectedInvestigation.RightEyeValues.Base === mitem.Value) {
                        mitem.selected = true;
                        $scope.BaseRadio = 'baseplus';
                    }
                    $scope.SelectedInvestigation.LeftEyeValues.Base = $scope.SelectedInvestigation.RightEyeValues.Base;
                }
            });


            angular.forEach($scope.PrismList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    if ($scope.SelectedInvestigation.RightEyeValues.Prism === mitem.Value) {
                        mitem.selected = true;
                        $scope.PrismRadio = 'prismplus';
                    }

                }
                if ($scope.SelectedEye === 2) {
                    if ($scope.SelectedInvestigation.LeftEyeValues.Prism === mitem.Value) {
                        mitem.selected = true;
                        $scope.PrismRadio = 'prismplus';
                    }
                }
                if ($scope.SelectedEye === 3) {
                    if ($scope.SelectedInvestigation.RightEyeValues.Prism === mitem.Value) {
                        mitem.selected = true;
                        $scope.PrismRadio = 'prismplus';
                    }
                    $scope.SelectedInvestigation.LeftEyeValues.Prism = $scope.SelectedInvestigation.RightEyeValues.Prism;
                }
            });


            angular.forEach($scope.UcvaMinusList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    if ($scope.SelectedInvestigation.RightEyeValues.UVa === mitem.Value) {
                        mitem.selected = true;
                        $scope.UCVARadio = 'ucvaminus';
                    }
                }
                if ($scope.SelectedEye === 2) {
                    if ($scope.SelectedInvestigation.LeftEyeValues.UVa === mitem.Value) {
                        mitem.selected = true;
                        $scope.UCVARadio = 'ucvaminus';
                    }
                }
                if ($scope.SelectedEye === 3) {
                    if ($scope.SelectedInvestigation.RightEyeValues.UVa === mitem.Value) {
                        mitem.selected = true;
                        $scope.UCVARadio = 'ucvaminus';
                    }
                    $scope.SelectedInvestigation.LeftEyeValues.UVa = $scope.SelectedInvestigation.RightEyeValues.UVa;
                }
            });

            angular.forEach($scope.SphericalMinusList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    if ($scope.SelectedInvestigation.RightEyeValues.Spherical === mitem.Value) {
                        mitem.selected = true;
                        $scope.SphericalRadio = 'sphericalminus';
                    }
                }
                if ($scope.SelectedEye === 2) {
                    if ($scope.SelectedInvestigation.LeftEyeValues.Spherical === mitem.Value) {
                        mitem.selected = true;
                        $scope.SphericalRadio = 'sphericalminus';
                    }
                }
                if ($scope.SelectedEye === 3) {
                    if ($scope.SelectedInvestigation.RightEyeValues.Spherical === mitem.Value) {
                        mitem.selected = true;
                        $scope.SphericalRadio = 'sphericalminus';
                    }
                    $scope.SelectedInvestigation.LeftEyeValues.Spherical = $scope.SelectedInvestigation.RightEyeValues.Spherical;
                }
            });
            angular.forEach($scope.CylindricalList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    if ($scope.SelectedInvestigation.RightEyeValues.Cylindrical === mitem.Value) {
                        mitem.selected = true;
                        $scope.CylRadio = 'cylminus';
                    }
                }
                if ($scope.SelectedEye === 2) {
                    if ($scope.SelectedInvestigation.LeftEyeValues.Cylindrical === mitem.Value) {
                        mitem.selected = true;
                        $scope.CylRadio = 'cylminus';
                    }
                }

                if ($scope.SelectedEye === 3) {
                    if ($scope.SelectedInvestigation.RightEyeValues.Cylindrical === mitem.Value) {
                        mitem.selected = true;
                        $scope.CylRadio = 'cylminus';
                    }
                    $scope.SelectedInvestigation.LeftEyeValues.Cylindrical = $scope.SelectedInvestigation.RightEyeValues.Cylindrical;
                }
            });
            angular.forEach($scope.AxisMinusList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    if ($scope.SelectedInvestigation.RightEyeValues.Axis === mitem.Value) {
                        mitem.selected = true;
                        $scope.AxisRadio = 'axisminus';
                    }
                }
                if ($scope.SelectedEye === 2) {
                    if ($scope.SelectedInvestigation.LeftEyeValues.Axis === mitem.Value) {
                        mitem.selected = true;
                        $scope.AxisRadio = 'axisminus';
                    }
                }
                if ($scope.SelectedEye === 3) {
                    if ($scope.SelectedInvestigation.RightEyeValues.Axis === mitem.Value) {
                        mitem.selected = true;
                        $scope.AxisRadio = 'axisminus';
                    }
                    $scope.SelectedInvestigation.LeftEyeValues.Axis = $scope.SelectedInvestigation.RightEyeValues.Axis;
                }
            });
            angular.forEach($scope.RefAddMinusList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    if ($scope.SelectedInvestigation.RightEyeValues.Adition === mitem.Value) {
                        mitem.selected = true;
                        $scope.AddRadio = 'addminus';
                    }
                }
                if ($scope.SelectedEye === 2) {
                    if ($scope.SelectedInvestigation.LeftEyeValues.Adition === mitem.Value) {
                        mitem.selected = true;
                        $scope.AddRadio = 'addminus';
                    }
                }
                if ($scope.SelectedEye === 3) {
                    if ($scope.SelectedInvestigation.RightEyeValues.Adition === mitem.Value) {
                        mitem.selected = true;
                        $scope.AddRadio = 'addminus';
                    }
                    $scope.SelectedInvestigation.LeftEyeValues.Adition = $scope.SelectedInvestigation.RightEyeValues.Adition;
                }
            });

            angular.forEach($scope.refBcvaMinusList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    if ($scope.SelectedInvestigation.RightEyeValues.BCVA === mitem.Value) {
                        mitem.selected = true;
                        $scope.BCVARadio = 'bcvaminus';
                    }
                }
                if ($scope.SelectedEye === 2) {
                    if ($scope.SelectedInvestigation.LeftEyeValues.BCVA === mitem.Value) {
                        mitem.selected = true;
                        $scope.BCVARadio = 'bcvaminus';
                    }
                }
                if ($scope.SelectedEye === 3) {
                    if ($scope.SelectedInvestigation.RightEyeValues.BCVA === mitem.Value) {
                        mitem.selected = true;
                        $scope.BCVARadio = 'bcvaminus';
                    }
                    $scope.SelectedInvestigation.LeftEyeValues.BCVA = $scope.SelectedInvestigation.RightEyeValues.BCVA;
                }
            });

            angular.forEach($scope.refBcnvaMinusList, function (mitem, index) {
                if ($scope.SelectedEye === 1) {
                    if ($scope.SelectedInvestigation.RightEyeValues.BCNVA === mitem.Value) {
                        mitem.selected = true;
                        $scope.BCVARadio = 'bcvaminus';
                    }
                }
                if ($scope.SelectedEye === 2) {
                    if ($scope.SelectedInvestigation.LeftEyeValues.BCNVA === mitem.Value) {
                        mitem.selected = true;
                        $scope.BCVARadio = 'bcvaminus';
                    }
                }
                if ($scope.SelectedEye === 3) {
                    if ($scope.SelectedInvestigation.RightEyeValues.BCNVA === mitem.Value) {
                        mitem.selected = true;
                        $scope.BCVARadio = 'bcvaminus';
                    }
                    $scope.SelectedInvestigation.LeftEyeValues.BCNVA = $scope.SelectedInvestigation.RightEyeValues.BCNVA;
                }
            });

        }
    };

    $scope.GetSelectedList();

    $scope.ChangeSelectedEye = function (val) {
        $scope.SelectedEye = val;

        $scope.GetSelectedList();
    };

    $scope.ChangeAidedSelectedEye = function (val, val2) {
        // $scope.Clear();
        $scope.SelectedEye = val;
        if (val === 3 && val2 === 5) {
            if ($scope.SelectedaidedInvestigation != undefined) {
                $scope.SelectedaidedInvestigation.InvestigationId = val2;
                if ($scope.SelectedaidedInvestigation.InvestigationId === 5) {
                    angular.forEach($scope.DistancePlusList, function (mitem, index) {
                        if ($scope.SelectedEye === 3) {

                            if ($scope.SelectedaidedInvestigation.Attributes.distanceVision.RightEye === mitem.Value) {
                                mitem.selected = true;
                                $scope.DistanceRadio = 'Distanceplus';
                                $scope.SelectedaidedInvestigation.Attributes.distanceVision.RightEye = mitem.Value;
                                $scope.SelectedaidedInvestigation.Attributes.distanceVision.LeftEye = mitem.Value;
                                $scope.SelectedaidedInvestigation.IsInvestigationChecked = true;
                            }
                            else {
                                mitem.selected = false;
                            }

                        }
                    });


                    //minus list
                    angular.forEach($scope.NearPlusList, function (mitem, index) {
                        if ($scope.SelectedEye === 3) {

                            if ($scope.SelectedaidedInvestigation.Attributes.NearVision.RightEye === mitem.Value) {
                                mitem.selected = true;
                                $scope.NearRadio = 'Nearplus';
                                $scope.SelectedaidedInvestigation.Attributes.NearVision.RightEye = mitem.Value;
                                $scope.SelectedaidedInvestigation.Attributes.NearVision.LeftEye = mitem.Value;
                                $scope.SelectedaidedInvestigation.IsInvestigationChecked = true;
                            }
                            else {
                                mitem.selected = false;
                            }
                        }

                    });
                }
            }
        }
        if (val === 3 && val2 === 4) {
            if ($scope.SelectedunaidedInvestigation != undefined) {
                $scope.SelectedunaidedInvestigation.InvestigationId = val2;
                if ($scope.SelectedunaidedInvestigation.InvestigationId === 4) {
                    angular.forEach($scope.UnaidedDistancePlusList, function (mitem, index) {
                        if ($scope.SelectedEye === 3) {

                            if ($scope.SelectedunaidedInvestigation.Attributes.distanceVision.RightEye === mitem.Value) {
                                mitem.selected = true;
                                $scope.UnaidedDistanceRadio = 'UnaidedDistanceplus';
                                $scope.SelectedunaidedInvestigation.Attributes.distanceVision.RightEye = mitem.Value;
                                $scope.SelectedunaidedInvestigation.Attributes.distanceVision.LeftEye = mitem.Value;
                                $scope.SelectedunaidedInvestigation.IsInvestigationChecked = true;
                            }
                            else {
                                mitem.selected = false;
                            }
                        }
                    });

                    angular.forEach($scope.UnaidedNearPlusList, function (mitem, index) {
                        if ($scope.SelectedEye === 3) {

                            if ($scope.SelectedunaidedInvestigation.Attributes.NearVision.RightEye === mitem.Value) {
                                mitem.selected = true;
                                $scope.UnaidedNearRadio = 'UnaidedNearplus';
                                $scope.SelectedunaidedInvestigation.Attributes.NearVision.RightEye = mitem.Value;
                                $scope.SelectedunaidedInvestigation.Attributes.NearVision.LeftEye = mitem.Value;
                                $scope.SelectedunaidedInvestigation.IsInvestigationChecked = true;
                            }
                            else {
                                mitem.selected = false;
                            }
                        }
                    });
                }
            }
        }
        if (val === 3 && val2 === 13) {
            if ($scope.SelectedpinholeInvestigation != undefined) {
                $scope.SelectedpinholeInvestigation.InvestigationId = val2;
                if ($scope.SelectedpinholeInvestigation.InvestigationId === 13) {
                    angular.forEach($scope.PinholePlusList, function (mitem, index) {
                        if ($scope.SelectedEye === 3) {
                            if ($scope.SelectedpinholeInvestigation.Attributes.RightEye === mitem.Value) {
                                mitem.selected = true;
                                $scope.PinholeRadio = "Pinholeplus";
                                $scope.SelectedpinholeInvestigation.Attributes.RightEye = mitem.Value;
                                $scope.SelectedpinholeInvestigation.Attributes.LeftEye = mitem.Value;
                                $scope.SelectedpinholeInvestigation.IsInvestigationChecked = true;
                            }
                            else {
                                mitem.selected = false;
                            }
                        }
                    });
                }
            }
        }
        $scope.SelectedEye = 1;


    };


    $scope.SelectedItem = function (item, type, data, ind) {
        var index;
        var list = "";
        var mlist = "";
        if ($scope.SelectedEye === 1) {
            // $scope.Clear();
            if (data.InvestigationId === 1) {
                if (data.InvestigationOrgans.length > 0) {
                    if (type === 'Sph') {
                        //$scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.InvestigationOrgans[0].InvestigationAttributes.Spherical = item.Value;
                        list = $filter("filter")($scope.SphericalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //var index = $scope.SphericalList.indexOf(list[0]);
                            //$scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                            if (list[0].selected) {
                                $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.SphericalList.indexOf(list[0]);
                                $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.SphericalList[index].selected = true;
                            }
                            //list[0].selected = !list[0].selected;
                        }
                        mlist = $filter("filter")($scope.SphericalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = !mlist[0].selected;
                            if (mlist[0].selected) {
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.SphericalMinusList.indexOf(mlist[0]);
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.SphericalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Cyl') {
                        //$scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                        //$scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                        data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = item.Value;
                        list = $filter("filter")($scope.CylindricalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.CylindricalList.indexOf(list[0]);
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.CylindricalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.CylindricalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            ///mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.CylindricalMinusList.indexOf(mlist[0]);
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CylindricalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Axis') {
                        //$scope.AxisList = angular.copy($scope.GetAxisList());
                        //$scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                        data.InvestigationOrgans[0].InvestigationAttributes.Axis = item.Value;
                        list = $filter("filter")($scope.AxisList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.AxisList.indexOf(list[0]);
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.AxisList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.AxisMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.AxisMinusList.indexOf(mlist[0]);
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.AxisMinusList[index].selected = true;
                            }
                        }
                    }
                    $scope.SelectedInvestigation = data;
                }
            }
            if (data.InvestigationId === 2) {
                if (data.InvestigationOrgans.length > 0) {
                    if (type === 'UCVA') {
                        //$scope.UcvaList = angular.copy($scope.GetUcvaList());
                        //$scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                        data.InvestigationOrgans[0].InvestigationAttributes.UCVA = item.Value;
                        list = $filter("filter")($scope.UcvaList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.UCVA = "";
                            } else {
                                index = $scope.UcvaList.indexOf(list[0]);
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UcvaList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.UcvaMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.UCVA = "";
                            } else {
                                index = $scope.UcvaMinusList.indexOf(mlist[0]);
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UcvaMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Sph') {
                        //$scope.RefSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.RefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.InvestigationOrgans[0].InvestigationAttributes.Spherical = item.Value;
                        list = $filter("filter")($scope.RefSphericalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.RefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.RefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.RefSphericalList.indexOf(list[0]);
                                $scope.RefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.RefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.RefSphericalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.RefSphericalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.RefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.RefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.RefSphericalMinusList.indexOf(mlist[0]);
                                $scope.RefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.RefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.RefSphericalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Cyl') {
                        //$scope.RefCylindricalList = angular.copy($scope.GetCylindricalList());
                        //$scope.RefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                        data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = item.Value;
                        list = $filter("filter")($scope.RefCylindricalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.RefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.RefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.RefCylindricalList.indexOf(list[0]);
                                $scope.RefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.RefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.RefCylindricalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.RefCylindricalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.RefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.RefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.RefCylindricalMinusList.indexOf(mlist[0]);
                                $scope.RefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.RefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.RefCylindricalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Axis') {
                        //$scope.RefAxisList = angular.copy($scope.GetAxisList());
                        //$scope.RefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                        data.InvestigationOrgans[0].InvestigationAttributes.Axis = item.Value;
                        list = $filter("filter")($scope.RefAxisList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.RefAxisList = angular.copy($scope.GetAxisList());
                                $scope.RefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.RefAxisList.indexOf(list[0]);
                                $scope.RefAxisList = angular.copy($scope.GetAxisList());
                                $scope.RefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.RefAxisList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.RefAxisMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.RefAxisList = angular.copy($scope.GetAxisList());
                                $scope.RefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.RefAxisMinusList.indexOf(mlist[0]);
                                $scope.RefAxisList = angular.copy($scope.GetAxisList());
                                $scope.RefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.RefAxisMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Add') {
                        //$scope.RefAddList = angular.copy($scope.GetAddList());
                        //$scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                        data.InvestigationOrgans[0].InvestigationAttributes.Adition = item.Value;
                        list = $filter("filter")($scope.RefAddList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Adition = "";
                            } else {
                                index = $scope.RefAddList.indexOf(list[0]);
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.RefAddList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.RefAddMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Adition = "";
                            } else {
                                index = $scope.RefAddMinusList.indexOf(mlist[0]);
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.RefAddMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'BCVA') {
                        //$scope.refBcvaList = angular.copy($scope.GetUcvaList());
                        //$scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                        data.InvestigationOrgans[0].InvestigationAttributes.BCVA = item.Value;
                        list = $filter("filter")($scope.refBcvaList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                // $scope.refBcvaList = angular.copy($scope.GetUcvaList());
                                $scope.refBcvaList = angular.copy($scope.GetRefBcvaList());
                                // $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.BCVA = "";
                            } else {
                                index = $scope.refBcvaList.indexOf(list[0]);
                                $scope.refBcvaList = angular.copy($scope.GetRefBcvaList());
                                // $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcvaList[index].selected = true;
                            }

                        }
                        mlist = $filter("filter")($scope.refBcvaMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                //  $scope.refBcvaList = angular.copy($scope.GetUcvaList());
                                $scope.refBcvaList = angular.copy($scope.GetRefBcvaList());
                                $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.BCVA = "";
                            } else {
                                index = $scope.refBcvaMinusList.indexOf(mlist[0]);
                                //  $scope.refBcvaList = angular.copy($scope.GetUcvaList());
                                $scope.refBcvaList = angular.copy($scope.GetRefBcvaList());
                                $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcvaMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'BCNVA') {
                        //$scope.refBcvaList = angular.copy($scope.GetUcvaList());
                        //$scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                        data.InvestigationOrgans[0].InvestigationAttributes.BCNVA = item.Value;
                        list = $filter("filter")($scope.refBcnvaList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                                $scope.refBcnvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.BCNVA = "";
                            } else {
                                index = $scope.refBcnvaList.indexOf(list[0]);
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                                $scope.refBcnvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcnvaList[index].selected = true;
                            }

                        }
                        mlist = $filter("filter")($scope.refBcnvaMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                                $scope.refBcnvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.BCNVA = "";
                            } else {
                                index = $scope.refBcnvaMinusList.indexOf(mlist[0]);
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                                $scope.refBcnvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcnvaMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'PH') {
                        //$scope.refPHList = angular.copy($scope.GetUcvaList());
                        //$scope.refPHMinusList = angular.copy($scope.GetUcvaMinusList());
                        data.InvestigationOrgans[0].InvestigationAttributes.PH = item.Value;
                        list = $filter("filter")($scope.refPHList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.refPHList = angular.copy($scope.GetUcvaList());
                                $scope.refPHMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.PH = "";
                            } else {
                                index = $scope.refPHList.indexOf(list[0]);
                                $scope.refPHList = angular.copy($scope.GetUcvaList());
                                $scope.refPHMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refPHList[index].selected = true;
                            }

                        }
                        mlist = $filter("filter")($scope.refPHMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.refPHList = angular.copy($scope.GetUcvaList());
                                $scope.refPHMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.PH = "";
                            } else {
                                index = $scope.refPHMinusList.indexOf(mlist[0]);
                                $scope.refPHList = angular.copy($scope.GetUcvaList());
                                $scope.refPHMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refPHMinusList[index].selected = true;
                            }
                        }
                    }
                    $scope.SelectedInvestigation = data;
                }
            }
            if (data.InvestigationId === 3) {
                if (data.InvestigationOrgans.length > 0) {
                    //   if (type === 'UCVA') {
                    //    //$scope.CrefUcvaList = angular.copy($scope.GetUcvaList());
                    //    //$scope.CrefUcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                    //    data.InvestigationOrgans[0].InvestigationAttributes.UCVA = item.Value;
                    //    list = $filter("filter")($scope.CrefUcvaList, { "Value": item.Value }, true);
                    //    if (list.length > 0) {
                    //        //list[0].selected = ind;
                    //        if (list[0].selected) {
                    //            $scope.CrefUcvaList = angular.copy($scope.GetUcvaList());
                    //            data.InvestigationOrgans[0].InvestigationAttributes.UCVA = "";
                    //        } else {
                    //            index = $scope.CrefUcvaList.indexOf(list[0]);
                    //            $scope.CrefUcvaList = angular.copy($scope.GetUcvaList());
                    //            $scope.CrefUcvaList[index].selected = true;
                    //        }
                    //    }
                    //    mlist = $filter("filter")($scope.CrefUcvaMinusList, { "Value": item.Value }, true);
                    //    if (mlist.length > 0) {
                    //        //mlist[0].selected = ind;
                    //        if (mlist[0].selected) {
                    //            $scope.CrefUcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                    //            data.InvestigationOrgans[0].InvestigationAttributes.UCVA = "";
                    //        } else {
                    //            index = $scope.CrefUcvaMinusList.indexOf(mlist[0]);
                    //            $scope.CrefUcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                    //            $scope.CrefUcvaMinusList[index].selected = true;
                    //        }
                    //    }
                    //}
                    if (type === 'Sph') {
                        //$scope.CRefSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.CRefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.InvestigationOrgans[0].InvestigationAttributes.Spherical = item.Value;
                        list = $filter("filter")($scope.CRefSphericalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.CRefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.CRefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.CRefSphericalList.indexOf(list[0]);
                                $scope.CRefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.CRefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.CRefSphericalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.CRefSphericalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.CRefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.CRefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.CRefSphericalMinusList.indexOf(mlist[0]);
                                $scope.CRefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.CRefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.CRefSphericalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Cyl') {
                        //$scope.CRefCylindricalList = angular.copy($scope.GetCylindricalList());
                        // $scope.CRefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                        data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = item.Value;
                        list = $filter("filter")($scope.CRefCylindricalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.CRefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CRefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.CRefCylindricalList.indexOf(list[0]);
                                $scope.CRefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CRefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.CRefCylindricalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.CRefCylindricalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.CRefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CRefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.CRefCylindricalMinusList.indexOf(mlist[0]);
                                $scope.CRefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CRefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.CRefCylindricalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Axis') {
                        //$scope.CRefAxisList = angular.copy($scope.GetAxisList());
                        //$scope.CRefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                        data.InvestigationOrgans[0].InvestigationAttributes.Axis = item.Value;
                        list = $filter("filter")($scope.CRefAxisList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.CRefAxisList = angular.copy($scope.GetAxisList());
                                $scope.CRefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.CRefAxisList.indexOf(list[0]);
                                $scope.CRefAxisList = angular.copy($scope.GetAxisList());
                                $scope.CRefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.CRefAxisList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.CRefAxisMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.CRefAxisList = angular.copy($scope.GetAxisList());
                                $scope.CRefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.CRefAxisMinusList.indexOf(mlist[0]);
                                $scope.CRefAxisList = angular.copy($scope.GetAxisList());
                                $scope.CRefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.CRefAxisMinusList[index].selected = true;
                            }
                        }

                    }
                    if (type === 'Add') {
                        //$scope.CRefAddList = angular.copy($scope.GetAddList());
                        // $scope.CRefAddMinusList = angular.copy($scope.GetAddMinusList());
                        data.InvestigationOrgans[0].InvestigationAttributes.Adition = item.Value;
                        list = $filter("filter")($scope.CRefAddList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            // list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.CRefAddList = angular.copy($scope.GetAddList());
                                $scope.CRefAddMinusList = angular.copy($scope.GetAddMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Adition = "";
                            } else {
                                index = $scope.CRefAddList.indexOf(list[0]);
                                $scope.CRefAddList = angular.copy($scope.GetAddList());
                                $scope.CRefAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.CRefAddList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.CRefAddMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            // mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.CRefAddList = angular.copy($scope.GetAddList());
                                $scope.CRefAddMinusList = angular.copy($scope.GetAddMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Adition = "";
                            } else {
                                index = $scope.CRefAddMinusList.indexOf(mlist[0]);
                                $scope.CRefAddList = angular.copy($scope.GetAddList());
                                $scope.CRefAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.CRefAddMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'BCVA') {
                        //$scope.CrefBcvaList = angular.copy($scope.GetUcvaList());
                        //$scope.CrefBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                        data.InvestigationOrgans[0].InvestigationAttributes.BCVA = item.Value;
                        list = $filter("filter")($scope.CrefBcvaList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                //  $scope.CrefBcvaList = angular.copy($scope.GetUcvaList());
                                $scope.CrefBcvaList = angular.copy($scope.GetRefBcvaList());
                                data.InvestigationOrgans[0].InvestigationAttributes.BCVA = "";
                            } else {
                                index = $scope.CrefBcvaList.indexOf(list[0]);
                                // $scope.CrefBcvaList = angular.copy($scope.GetUcvaList());
                                $scope.CrefBcvaList = angular.copy($scope.GetRefBcvaList());
                                $scope.CrefBcvaList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.CrefBcvaMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.CrefBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.BCVA = "";
                            } else {
                                index = $scope.CrefBcvaMinusList.indexOf(mlist[0]);
                                $scope.CrefBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.CrefBcvaMinusList[index].selected = true;
                            }
                        }
                    }
                    //if (type === 'PH') {
                    //    //$scope.CrefPHList = angular.copy($scope.GetUcvaList());
                    //    //$scope.CrefPHMinusList = angular.copy($scope.GetUcvaMinusList());
                    //    data.InvestigationOrgans[0].InvestigationAttributes.PH = item.Value;
                    //    list = $filter("filter")($scope.CrefPHList, { "Value": item.Value }, true);
                    //    if (list.length > 0) {
                    //        //list[0].selected = ind;
                    //        if (list[0].selected) {
                    //            $scope.CrefPHList = angular.copy($scope.GetUcvaList());
                    //            data.InvestigationOrgans[0].InvestigationAttributes.PH = "";
                    //        } else {
                    //            index = $scope.CrefPHList.indexOf(list[0]);
                    //            $scope.CrefPHList = angular.copy($scope.GetUcvaList());
                    //            $scope.CrefPHList[index].selected = true;
                    //        }
                    //    }
                    //    mlist = $filter("filter")($scope.CrefPHMinusList, { "Value": item.Value }, true);
                    //    if (mlist.length > 0) {
                    //        //mlist[0].selected = ind;
                    //        if (mlist[0].selected) {
                    //            $scope.CrefPHMinusList = angular.copy($scope.GetUcvaMinusList());
                    //            data.InvestigationOrgans[0].InvestigationAttributes.PH = "";
                    //        } else {
                    //            index = $scope.CrefPHMinusList.indexOf(mlist[0]);
                    //            $scope.CrefPHMinusList = angular.copy($scope.GetUcvaMinusList());
                    //            $scope.CrefPHMinusList[index].selected = true;
                    //        }
                    //    }

                    //}
                    $scope.SelectedInvestigation = data;

                }
            }
            if (data.InvestigationId === 8) {
                if (data.InvestigationOrgans.length > 0) {
                    if (type === 'Sph') {
                        //$scope.LCVASphericalList = angular.copy($scope.GetSphericalPlusList());
                        // $scope.LCVASphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.InvestigationOrgans[0].InvestigationAttributes.Spherical = item.Value;
                        list = $filter("filter")($scope.LCVASphericalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.LCVASphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.LCVASphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.LCVASphericalList.indexOf(list[0]);
                                $scope.LCVASphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.LCVASphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.LCVASphericalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.LCVASphericalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.LCVASphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.LCVASphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.LCVASphericalMinusList.indexOf(mlist[0]);
                                $scope.LCVASphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.LCVASphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.LCVASphericalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Cyl') {
                        //$scope.LCVACylindricalList = angular.copy($scope.GetCylindricalList());
                        //$scope.LCVACylindricalMinusList = angular.copy($scope.GetCylMinusList());
                        data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = item.Value;
                        list = $filter("filter")($scope.LCVACylindricalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.LCVACylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.LCVACylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.LCVACylindricalList.indexOf(list[0]);
                                $scope.LCVACylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.LCVACylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.LCVACylindricalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.LCVACylindricalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.LCVACylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.LCVACylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.LCVACylindricalMinusList.indexOf(mlist[0]);
                                $scope.LCVACylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.LCVACylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.LCVACylindricalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Axis') {
                        //$scope.LCVAAxisList = angular.copy($scope.GetAxisList());
                        //$scope.LCVAAxisMinusList = angular.copy($scope.GetAxisMinusList());
                        data.InvestigationOrgans[0].InvestigationAttributes.Axis = item.Value;
                        list = $filter("filter")($scope.LCVAAxisList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.LCVAAxisList = angular.copy($scope.GetAxisList());
                                $scope.LCVAAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.LCVAAxisList.indexOf(list[0]);
                                $scope.LCVAAxisList = angular.copy($scope.GetAxisList());
                                $scope.LCVAAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.LCVAAxisList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.LCVAAxisMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            // mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.LCVAAxisList = angular.copy($scope.GetAxisList());
                                $scope.LCVAAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.LCVAAxisMinusList.indexOf(mlist[0]);
                                $scope.LCVAAxisList = angular.copy($scope.GetAxisList());
                                $scope.LCVAAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.LCVAAxisMinusList[index].selected = true;
                            }
                        }
                    }
                    $scope.SelectedInvestigation = data;
                }
            }

            if (data.InvestigationId === 10) {
                if (data.InvestigationOrgans.length > 0) {
                    if (type === 'Sph') {
                        //$scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.InvestigationOrgans[0].InvestigationAttributes.Spherical = item.Value;
                        list = $filter("filter")($scope.BBSphericalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.BBSphericalList.indexOf(list[0]);
                                $scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.BBSphericalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.BBSphericalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.BBSphericalMinusList.indexOf(mlist[0]);
                                $scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.BBSphericalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Cyl') {
                        //$scope.BBCylindricalList = angular.copy($scope.GetCylindricalList());
                        //$scope.BBCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                        data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = item.Value;
                        list = $filter("filter")($scope.BBCylindricalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.BBCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.BBCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.BBCylindricalList.indexOf(list[0]);
                                $scope.BBCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.BBCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.BBCylindricalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.BBCylindricalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.BBCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.BBCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.BBCylindricalMinusList.indexOf(mlist[0]);
                                $scope.BBCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.BBCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.BBCylindricalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Axis') {
                        //$scope.BBAxisList = angular.copy($scope.GetAxisList());
                        //$scope.BBAxisMinusList = angular.copy($scope.GetAxisMinusList());
                        data.InvestigationOrgans[0].InvestigationAttributes.Axis = item.Value;
                        list = $filter("filter")($scope.BBAxisList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.BBAxisList = angular.copy($scope.GetAxisList());
                                $scope.BBAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.BBAxisList.indexOf(list[0]);
                                $scope.BBAxisList = angular.copy($scope.GetAxisList());
                                $scope.BBAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.BBAxisList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.BBAxisMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.BBAxisList = angular.copy($scope.GetAxisList());
                                $scope.BBAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.BBAxisMinusList.indexOf(mlist[0]);
                                $scope.BBAxisList = angular.copy($scope.GetAxisList());
                                $scope.BBAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.BBAxisMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Add') {
                        //$scope.BBAddList = angular.copy($scope.GetAddList());
                        //$scope.BBAddMinusList = angular.copy($scope.GetAddMinusList());
                        data.InvestigationOrgans[0].InvestigationAttributes.Adition = item.Value;
                        list = $filter("filter")($scope.BBAddList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.BBAddList = angular.copy($scope.GetAddList());
                                $scope.BBAddMinusList = angular.copy($scope.GetAddMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Adition = "";
                            } else {
                                index = $scope.BBAddList.indexOf(list[0]);
                                $scope.BBAddList = angular.copy($scope.GetAddList());
                                $scope.BBAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.BBAddList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.BBAddMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.BBAddList = angular.copy($scope.GetAddList());
                                $scope.BBAddMinusList = angular.copy($scope.GetAddMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Adition = "";
                            } else {
                                index = $scope.BBAddMinusList.indexOf(mlist[0]);
                                $scope.BBAddList = angular.copy($scope.GetAddList());
                                $scope.BBAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.BBAddMinusList[index].selected = true;
                            }
                        }
                    }
                    $scope.SelectedInvestigation = data;
                }
            }

            if (data.InvestigationId === 5) {
                if (data.Attributes != undefined) {
                    if (type === 'Distance') {
                        //$scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.Attributes.distanceVision.RightEye = item.Value;
                        list = $filter("filter")($scope.DistancePlusList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                //  $scope.DistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.DistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.DistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.distanceVision.RightEye = "";
                            } else {
                                index = $scope.DistancePlusList.indexOf(list[0]);
                                //  $scope.DistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.DistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.DistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.DistancePlusList[index].selected = true;
                                data.IsInvestigationChecked = true;
                            }
                        }
                        mlist = $filter("filter")($scope.DistanceMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                // $scope.DistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.DistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.DistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.distanceVision.RightEye = "";
                            } else {
                                index = $scope.DistanceMinusList.indexOf(mlist[0]);
                                //  $scope.DistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.DistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.DistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.DistanceMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Near') {
                        //$scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.Attributes.NearVision.RightEye = item.Value;
                        list = $filter("filter")($scope.NearPlusList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.NearPlusList = angular.copy($scope.GetNearList());
                                $scope.NearMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.NearVision.RightEye = "";
                            } else {
                                index = $scope.NearPlusList.indexOf(list[0]);
                                $scope.NearPlusList = angular.copy($scope.GetNearList());
                                $scope.NearMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.NearPlusList[index].selected = true;
                                data.IsInvestigationChecked = true;
                            }
                        }
                        mlist = $filter("filter")($scope.NearMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.NearPlusList = angular.copy($scope.GetNearList());
                                $scope.NearMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.NearVision.RightEye = "";
                            } else {
                                index = $scope.NearMinusList.indexOf(mlist[0]);
                                $scope.NearPlusList = angular.copy($scope.GetNearList());
                                $scope.NearMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.NearMinusList[index].selected = true;
                            }
                        }
                    }

                    $scope.SelectedInvestigation = data;
                }
            }
            if (data.InvestigationId === 4) {
                if (data.Attributes != undefined) {
                    if (type === 'Distance') {
                        //$scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.Attributes.distanceVision.RightEye = item.Value;
                        list = $filter("filter")($scope.UnaidedDistancePlusList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                // $scope.UnaidedDistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.UnaidedDistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.UnaidedDistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.distanceVision.RightEye = "";
                            } else {
                                index = $scope.UnaidedDistancePlusList.indexOf(list[0]);
                                // $scope.UnaidedDistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.UnaidedDistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.UnaidedDistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UnaidedDistancePlusList[index].selected = true;
                                data.IsInvestigationChecked = true;
                            }
                        }
                        mlist = $filter("filter")($scope.UnaidedDistanceMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                // $scope.UnaidedDistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.UnaidedDistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.UnaidedDistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.distanceVision.RightEye = "";
                            } else {
                                index = $scope.UnaidedDistanceMinusList.indexOf(mlist[0]);
                                // $scope.UnaidedDistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.UnaidedDistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.UnaidedDistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UnaidedDistanceMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Near') {
                        //$scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.Attributes.NearVision.RightEye = item.Value;
                        list = $filter("filter")($scope.UnaidedNearPlusList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.UnaidedNearPlusList = angular.copy($scope.GetNearList());
                                $scope.UnaidedNearMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.NearVision.RightEye = "";
                            } else {
                                index = $scope.UnaidedNearPlusList.indexOf(list[0]);
                                $scope.UnaidedNearPlusList = angular.copy($scope.GetNearList());
                                $scope.UnaidedNearMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UnaidedNearPlusList[index].selected = true;
                                data.IsInvestigationChecked = true;
                            }
                        }
                        mlist = $filter("filter")($scope.UnaidedNearMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.UnaidedNearPlusList = angular.copy($scope.GetNearList());
                                $scope.UnaidedNearMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.NearVision.RightEye = "";
                            } else {
                                index = $scope.UnaidedNearMinusList.indexOf(mlist[0]);
                                $scope.UnaidedNearPlusList = angular.copy($scope.GetNearList());
                                $scope.UnaidedNearMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UnaidedNearMinusList[index].selected = true;
                            }
                        }
                    }

                    $scope.SelectedInvestigation = data;
                }
            }
            if (data.InvestigationId === 13) {
                if (data.Attributes != undefined) {
                    if (type === 'Pinhole') {
                        //$scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.Attributes.RightEye = item.Value;
                        list = $filter("filter")($scope.PinholePlusList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                //$scope.PinholePlusList = angular.copy($scope.GetUcvaList());
                                $scope.PinholePlusList = angular.copy($scope.GetDistanceList());
                                data.Attributes.RightEye = "";
                            } else {
                                index = $scope.PinholePlusList.indexOf(list[0]);
                                // $scope.PinholePlusList = angular.copy($scope.GetUcvaList());
                                $scope.PinholePlusList = angular.copy($scope.GetDistanceList());
                                $scope.PinholePlusList[index].selected = true;
                                data.IsInvestigationChecked = true;
                            }
                        }
                        mlist = $filter("filter")($scope.PinholeMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.PinholeMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.RightEye = "";
                            } else {
                                index = $scope.PinholeMinusList.indexOf(mlist[0]);
                                $scope.PinholeMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.PinholeMinusList[index].selected = true;
                            }
                        }
                    }


                    $scope.SelectedInvestigation = data;
                }
            }

            if (data.InvestigationId === 43 || data.InvestigationId === 44) {
                    if (type === 'UCVA') {
                        data.RightEyeValues.UVa = item.Value;
                        list = $filter("filter")($scope.UcvaList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.RightEyeValues.UVa = "";
                            } else {
                                index = $scope.UcvaList.indexOf(list[0]);
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UcvaList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.UcvaMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            if (mlist[0].selected) {
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                data.RightEyeValues.UVa = "";
                            } else {
                                index = $scope.UcvaMinusList.indexOf(mlist[0]);
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                $scope.UcvaMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Sph') {
                        data.RightEyeValues.Spherical = item.Value;
                        list = $filter("filter")($scope.SphericalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.RightEyeValues.Spherical = "";
                            } else {
                                index = $scope.SphericalList.indexOf(list[0]);
                                $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.SphericalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.SphericalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            if (mlist[0].selected) {
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                                data.RightEyeValues.Spherical = "";
                            } else {
                                index = $scope.SphericalMinusList.indexOf(mlist[0]);
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.SphericalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Cyl') {
                        data.RightEyeValues.Cylindrical = item.Value;
                        list = $filter("filter")($scope.CylindricalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.RightEyeValues.Cylindrical = "";
                            } else {
                                index = $scope.CylindricalList.indexOf(list[0]);
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.CylindricalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.CylindricalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            if (mlist[0].selected) {
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                data.RightEyeValues.Cylindrical = "";
                            } else {
                                index = $scope.CylindricalMinusList.indexOf(mlist[0]);
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CylindricalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Axis') {
                        data.RightEyeValues.Axis = item.Value;
                        list = $filter("filter")($scope.AxisList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.RightEyeValues.Axis = "";
                            } else {
                                index = $scope.AxisList.indexOf(list[0]);
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.AxisList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.AxisMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            if (mlist[0].selected) {
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                data.RightEyeValues.Axis = "";
                            } else {
                                index = $scope.AxisMinusList.indexOf(mlist[0]);
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                $scope.AxisMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Add') {
                        data.RightEyeValues.Adition = item.Value;
                        list = $filter("filter")($scope.RefAddList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                data.RightEyeValues.Adition = "";
                            } else {
                                index = $scope.RefAddList.indexOf(list[0]);
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.RefAddList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.RefAddMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            if (mlist[0].selected) {
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                data.RightEyeValues.Adition = "";
                            } else {
                                index = $scope.RefAddMinusList.indexOf(mlist[0]);
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                $scope.RefAddMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'BCVA') {
                        data.RightEyeValues.BCVA = item.Value;
                        list = $filter("filter")($scope.refBcvaList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.refBcvaList = angular.copy($scope.GetRefBcvaList());
                                $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.RightEyeValues.BCVA = "";
                            } else {
                                index = $scope.refBcvaList.indexOf(list[0]);
                                $scope.refBcvaList = angular.copy($scope.GetRefBcvaList());
                                $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcvaList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.refBcvaMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            if (mlist[0].selected) {
                                $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcvaList = angular.copy($scope.GetRefBcvaList());
                                data.RightEyeValues.BCVA = "";
                            } else {
                                index = $scope.refBcvaMinusList.indexOf(mlist[0]);
                                $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcvaList = angular.copy($scope.GetRefBcvaList());
                                $scope.refBcvaMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'BCNVA') {
                        data.RightEyeValues.BCNVA = item.Value;
                        list = $filter("filter")($scope.refBcnvaList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                                $scope.refBcnvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.RightEyeValues.BCNVA = "";
                            } else {
                                index = $scope.refBcnvaList.indexOf(list[0]);
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                                // $scope.refBcnvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcnvaList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.refBcnvaMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            if (mlist[0].selected) {
                                $scope.refBcnvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                                data.RightEyeValues.BCNVA = "";
                            } else {
                                index = $scope.refBcnvaMinusList.indexOf(mlist[0]);
                                $scope.refBcnvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                                $scope.refBcnvaMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Prism') {
                        data.RightEyeValues.Prism = item.Value;
                        list = $filter("filter")($scope.PrismList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.PrismList = angular.copy($scope.GetPrismList());
                                data.RightEyeValues.Prism = "";
                            } else {
                                index = $scope.PrismList.indexOf(list[0]);
                                $scope.PrismList = angular.copy($scope.GetPrismList());
                                $scope.PrismList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'BASE') {
                        data.RightEyeValues.Base = item.Value;
                        list = $filter("filter")($scope.BaseList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.BaseList = angular.copy($scope.GetBaseList());
                                data.RightEyeValues.Base = "";
                            } else {
                                index = $scope.BaseList.indexOf(list[0]);
                                $scope.BaseList = angular.copy($scope.GetBaseList());
                                $scope.BaseList[index].selected = true;
                            }
                        }
                    }
                    $scope.SelectedInvestigation = data;
               
            }
        }

        if ($scope.SelectedEye === 2) {
            if (data.InvestigationId === 1) {
                if (data.InvestigationOrgans.length > 0) {
                    if (type === 'Sph') {
                        // $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.InvestigationOrgans[1].InvestigationAttributes.Spherical = item.Value;
                        list = $filter("filter")($scope.SphericalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.SphericalList.indexOf(list[0]);
                                $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.SphericalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.SphericalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.SphericalMinusList.indexOf(mlist[0]);
                                $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.SphericalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Cyl') {
                        //$scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                        //$scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                        data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = item.Value;
                        list = $filter("filter")($scope.CylindricalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.CylindricalList.indexOf(list[0]);
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.CylindricalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.CylindricalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.CylindricalMinusList.indexOf(mlist[0]);
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.CylindricalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Axis') {
                        //$scope.AxisList = angular.copy($scope.GetAxisList());
                        ///$scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                        data.InvestigationOrgans[1].InvestigationAttributes.Axis = item.Value;
                        list = $filter("filter")($scope.AxisList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.AxisList.indexOf(list[0]);
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.AxisList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.AxisMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.AxisMinusList.indexOf(mlist[0]);
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.AxisMinusList[index].selected = true;
                            }
                        }
                    }
                    $scope.SelectedInvestigation = data;
                }
            }
            if (data.InvestigationId === 2) {
                if (data.InvestigationOrgans.length > 0) {
                    if (type === 'UCVA') {
                        //$scope.UcvaList = angular.copy($scope.GetUcvaList());
                        //$scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                        data.InvestigationOrgans[1].InvestigationAttributes.UCVA = item.Value;
                        list = $filter("filter")($scope.UcvaList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            ///list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.UCVA = "";
                            } else {
                                index = $scope.UcvaList.indexOf(list[0]);
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UcvaList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.UcvaMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.UcvaMinusList.indexOf(mlist[0]);
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UcvaMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Sph') {
                        //$scope.RefSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.RefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.InvestigationOrgans[1].InvestigationAttributes.Spherical = item.Value;
                        list = $filter("filter")($scope.RefSphericalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.RefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.RefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.RefSphericalList.indexOf(list[0]);
                                $scope.RefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.RefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.RefSphericalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.RefSphericalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.RefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.RefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.RefSphericalMinusList.indexOf(mlist[0]);
                                $scope.RefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.RefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.RefSphericalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Cyl') {
                        //$scope.RefCylindricalList = angular.copy($scope.GetCylindricalList());
                        //$scope.RefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                        data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = item.Value;
                        list = $filter("filter")($scope.RefCylindricalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.RefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.RefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.RefCylindricalList.indexOf(list[0]);
                                $scope.RefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.RefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.RefCylindricalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.RefCylindricalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.RefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.RefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.RefCylindricalMinusList.indexOf(mlist[0]);
                                $scope.RefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.RefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.RefCylindricalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Axis') {
                        //$scope.RefAxisList = angular.copy($scope.GetAxisList());
                        //$scope.RefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                        data.InvestigationOrgans[1].InvestigationAttributes.Axis = item.Value;
                        list = $filter("filter")($scope.RefAxisList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.RefAxisList = angular.copy($scope.GetAxisList());
                                $scope.RefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.RefAxisList.indexOf(list[0]);
                                $scope.RefAxisList = angular.copy($scope.GetAxisList());
                                $scope.RefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.RefAxisList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.RefAxisMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.RefAxisList = angular.copy($scope.GetAxisList());
                                $scope.RefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.RefAxisMinusList.indexOf(mlist[0]);
                                $scope.RefAxisList = angular.copy($scope.GetAxisList());
                                $scope.RefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.RefAxisMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Add') {
                        // $scope.RefAddList = angular.copy($scope.GetAddList());
                        //$scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                        data.InvestigationOrgans[1].InvestigationAttributes.Adition = item.Value;
                        list = $filter("filter")($scope.RefAddList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Adition = "";
                            } else {
                                index = $scope.RefAddList.indexOf(list[0]);
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.RefAddList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.RefAddMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Adition = "";
                            } else {
                                index = $scope.RefAddMinusList.indexOf(mlist[0]);
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.RefAddMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'BCVA') {
                        //$scope.refBcvaList = angular.copy($scope.GetUcvaList());
                        //$scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                        data.InvestigationOrgans[1].InvestigationAttributes.BCVA = item.Value;
                        list = $filter("filter")($scope.refBcvaList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                //  $scope.refBcvaList = angular.copy($scope.GetUcvaList());
                                $scope.refBcvaList = angular.copy($scope.GetRefBcvaList());
                                // $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.BCVA = "";
                            } else {
                                index = $scope.refBcvaList.indexOf(list[0]);
                                // $scope.refBcvaList = angular.copy($scope.GetUcvaList());
                                $scope.refBcvaList = angular.copy($scope.GetRefBcvaList());
                                //$scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcvaList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.refBcvaMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            // mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                //  $scope.refBcvaList = angular.copy($scope.GetUcvaList());
                                $scope.refBcvaList = angular.copy($scope.GetRefBcvaList());
                                $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.BCVA = "";
                            } else {
                                index = $scope.refBcvaMinusList.indexOf(mlist[0]);
                                // $scope.refBcvaList = angular.copy($scope.GetUcvaList());
                                $scope.refBcvaList = angular.copy($scope.GetRefBcvaList());
                                $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcvaMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'BCNVA') {
                        //$scope.refBcvaList = angular.copy($scope.GetUcvaList());
                        //$scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                        data.InvestigationOrgans[1].InvestigationAttributes.BCNVA = item.Value;
                        list = $filter("filter")($scope.refBcnvaList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                                $scope.refBcnvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.BCNVA = "";
                            } else {
                                index = $scope.refBcnvaList.indexOf(list[0]);
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                                $scope.refBcnvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcnvaList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.refBcnvaMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            // mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                                $scope.refBcnvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.BCNVA = "";
                            } else {
                                index = $scope.refBcnvaMinusList.indexOf(mlist[0]);
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                                $scope.refBcnvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcnvaMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'PH') {
                        //$scope.refPHList = angular.copy($scope.GetUcvaList());
                        //$scope.refPHMinusList = angular.copy($scope.GetUcvaMinusList());
                        data.InvestigationOrgans[1].InvestigationAttributes.PH = item.Value;
                        list = $filter("filter")($scope.refPHList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.refPHList = angular.copy($scope.GetUcvaList());
                                $scope.refPHMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.PH = "";
                            } else {
                                index = $scope.refPHList.indexOf(list[0]);
                                $scope.refPHList = angular.copy($scope.GetUcvaList());
                                $scope.refPHMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refPHList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.refPHMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.refPHList = angular.copy($scope.GetUcvaList());
                                $scope.refPHMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.PH = "";
                            } else {
                                index = $scope.refPHMinusList.indexOf(mlist[0]);
                                $scope.refPHList = angular.copy($scope.GetUcvaList());
                                $scope.refPHMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refPHMinusList[index].selected = true;
                            }
                        }
                    }
                    $scope.SelectedInvestigation = data;
                }
            }

            if (data.InvestigationId === 3) {

                if (data.InvestigationOrgans.length > 0) {
                    //if (type === 'UCVA') {
                    //    //$scope.CrefUcvaList = angular.copy($scope.GetUcvaList());
                    //    //$scope.CrefUcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                    //    data.InvestigationOrgans[1].InvestigationAttributes.UCVA = item.Value;
                    //    list = $filter("filter")($scope.CrefUcvaList, { "Value": item.Value }, true);
                    //    if (list.length > 0) {
                    //        //list[0].selected = ind;
                    //        if (list[0].selected) {
                    //            $scope.CrefUcvaList = angular.copy($scope.GetUcvaList());
                    //            data.InvestigationOrgans[1].InvestigationAttributes.UCVA = "";
                    //        } else {
                    //            index = $scope.CrefUcvaList.indexOf(list[0]);
                    //            $scope.CrefUcvaList = angular.copy($scope.GetUcvaList());
                    //            $scope.CrefUcvaList[index].selected = true;
                    //        }
                    //    }
                    //    mlist = $filter("filter")($scope.CrefUcvaMinusList, { "Value": item.Value }, true);
                    //    if (mlist.length > 0) {
                    //        //mlist[0].selected = ind;
                    //        if (mlist[0].selected) {
                    //            $scope.CrefUcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                    //            data.InvestigationOrgans[1].InvestigationAttributes.UCVA = "";
                    //        } else {
                    //            index = $scope.CrefUcvaMinusList.indexOf(mlist[0]);
                    //            $scope.CrefUcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                    //            $scope.CrefUcvaMinusList[index].selected = true;
                    //        }
                    //    }
                    //}
                    if (type === 'Sph') {
                        // $scope.CRefSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.CRefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.InvestigationOrgans[1].InvestigationAttributes.Spherical = item.Value;
                        list = $filter("filter")($scope.CRefSphericalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.CRefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.CRefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.CRefSphericalList.indexOf(list[0]);
                                $scope.CRefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.CRefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.CRefSphericalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.CRefSphericalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.CRefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.CRefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.CRefSphericalMinusList.indexOf(mlist[0]);
                                $scope.CRefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.CRefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.CRefSphericalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Cyl') {
                        //$scope.CRefCylindricalList = angular.copy($scope.GetCylindricalList());
                        //$scope.CRefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                        data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = item.Value;
                        list = $filter("filter")($scope.CRefCylindricalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.CRefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CRefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.CRefCylindricalList.indexOf(list[0]);
                                $scope.CRefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CRefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.CRefCylindricalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.CRefCylindricalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.CRefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CRefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.CRefCylindricalMinusList.indexOf(mlist[0]);
                                $scope.CRefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CRefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.CRefCylindricalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Axis') {
                        //$scope.CRefAxisList = angular.copy($scope.GetAxisList());
                        //$scope.CRefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                        data.InvestigationOrgans[1].InvestigationAttributes.Axis = item.Value;
                        list = $filter("filter")($scope.CRefAxisList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.CRefAxisList = angular.copy($scope.GetAxisList());
                                $scope.CRefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.CRefAxisList.indexOf(list[0]);
                                $scope.CRefAxisList = angular.copy($scope.GetAxisList());
                                $scope.CRefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.CRefAxisList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.CRefAxisMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.CRefAxisList = angular.copy($scope.GetAxisList());
                                $scope.CRefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.CRefAxisMinusList.indexOf(mlist[0]);
                                $scope.CRefAxisList = angular.copy($scope.GetAxisList());
                                $scope.CRefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.CRefAxisMinusList[index].selected = true;
                            }
                        }

                    }
                    if (type === 'Add') {
                        //$scope.CRefAddList = angular.copy($scope.GetAddList());
                        //$scope.CRefAddMinusList = angular.copy($scope.GetAddMinusList());
                        data.InvestigationOrgans[1].InvestigationAttributes.Adition = item.Value;
                        list = $filter("filter")($scope.CRefAddList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.CRefAddList = angular.copy($scope.GetAddList());
                                $scope.CRefAddMinusList = angular.copy($scope.GetAddMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Adition = "";
                            } else {
                                index = $scope.CRefAddList.indexOf(list[0]);
                                $scope.CRefAddList = angular.copy($scope.GetAddList());
                                $scope.CRefAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.CRefAddList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.CRefAddMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.CRefAddList = angular.copy($scope.GetAddList());
                                $scope.CRefAddMinusList = angular.copy($scope.GetAddMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Adition = "";
                            } else {
                                index = $scope.CRefAddMinusList.indexOf(mlist[0]);
                                $scope.CRefAddList = angular.copy($scope.GetAddList());
                                $scope.CRefAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.CRefAddMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'BCVA') {
                        //$scope.CrefBcvaList = angular.copy($scope.GetUcvaList());
                        //$scope.CrefBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                        data.InvestigationOrgans[1].InvestigationAttributes.BCVA = item.Value;
                        list = $filter("filter")($scope.CrefBcvaList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                //$scope.CrefBcvaList = angular.copy($scope.GetUcvaList());
                                $scope.CrefBcvaList = angular.copy($scope.GetRefBcvaList());
                                data.InvestigationOrgans[1].InvestigationAttributes.BCVA = "";
                            } else {
                                index = $scope.CrefBcvaList.indexOf(list[0]);
                                // $scope.CrefBcvaList = angular.copy($scope.GetUcvaList());
                                $scope.CrefBcvaList = angular.copy($scope.GetRefBcvaList());
                                $scope.CrefBcvaList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.CrefBcvaMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.CrefBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.BCVA = "";
                            } else {
                                index = $scope.CrefBcvaMinusList.indexOf(mlist[0]);
                                $scope.CrefBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.CrefBcvaMinusList[index].selected = true;
                            }
                        }
                    }
                    //if (type === 'PH') {
                    //    //$scope.CrefPHList = angular.copy($scope.GetUcvaList());
                    //    //$scope.CrefPHMinusList = angular.copy($scope.GetUcvaMinusList());
                    //        data.InvestigationOrgans[1].InvestigationAttributes.PH = item.Value;
                    //        list = $filter("filter")($scope.CrefPHList, { "Value": item.Value }, true);
                    //        if (list.length > 0) {
                    //            //list[0].selected = ind;
                    //            if (list[0].selected) {
                    //                $scope.CrefPHList = angular.copy($scope.GetUcvaList());
                    //                data.InvestigationOrgans[1].InvestigationAttributes.PH = "";
                    //            } else {
                    //                index = $scope.CrefPHList.indexOf(list[0]);
                    //                $scope.CrefPHList = angular.copy($scope.GetUcvaList());
                    //                $scope.CrefPHList[index].selected = true;
                    //            }
                    //        }
                    //        mlist = $filter("filter")($scope.CrefPHMinusList, { "Value": item.Value }, true);
                    //        if (mlist.length > 0) {
                    //            //mlist[0].selected = ind;
                    //            if (mlist[0].selected) {
                    //                $scope.CrefPHMinusList = angular.copy($scope.GetUcvaMinusList());
                    //                data.InvestigationOrgans[1].InvestigationAttributes.PH = "";
                    //            } else {
                    //                index = $scope.CrefPHMinusList.indexOf(mlist[0]);
                    //                $scope.CrefPHMinusList = angular.copy($scope.GetUcvaMinusList());
                    //                $scope.CrefPHMinusList[index].selected = true;
                    //            }
                    //        }

                    //    }
                    $scope.SelectedInvestigation = data;
                }
            }


            if (data.InvestigationId === 8) {
                if (data.InvestigationOrgans.length > 0) {
                    if (type === 'Sph') {
                        // $scope.LCVASphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.LCVASphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.InvestigationOrgans[1].InvestigationAttributes.Spherical = item.Value;
                        list = $filter("filter")($scope.LCVASphericalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.LCVASphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.LCVASphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.LCVASphericalList.indexOf(list[0]);
                                $scope.LCVASphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.LCVASphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.LCVASphericalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.LCVASphericalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.LCVASphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.LCVASphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.LCVASphericalMinusList.indexOf(mlist[0]);
                                $scope.LCVASphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.LCVASphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.LCVASphericalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Cyl') {
                        //$scope.LCVACylindricalList = angular.copy($scope.GetCylindricalList());
                        //$scope.LCVACylindricalMinusList = angular.copy($scope.GetCylMinusList());
                        data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = item.Value;
                        list = $filter("filter")($scope.LCVACylindricalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.LCVACylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.LCVACylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.LCVACylindricalList.indexOf(list[0]);
                                $scope.LCVACylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.LCVACylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.LCVACylindricalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.LCVACylindricalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.LCVACylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.LCVACylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.LCVACylindricalMinusList.indexOf(mlist[0]);
                                $scope.LCVACylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.LCVACylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.LCVACylindricalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Axis') {
                        //$scope.LCVAAxisList = angular.copy($scope.GetAxisList());
                        //$scope.LCVAAxisMinusList = angular.copy($scope.GetAxisMinusList());
                        data.InvestigationOrgans[1].InvestigationAttributes.Axis = item.Value;
                        list = $filter("filter")($scope.LCVAAxisList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.LCVAAxisList = angular.copy($scope.GetAxisList());
                                $scope.LCVAAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.LCVAAxisList.indexOf(list[0]);
                                $scope.LCVAAxisList = angular.copy($scope.GetAxisList());
                                $scope.LCVAAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.LCVAAxisList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.LCVAAxisMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.LCVAAxisList = angular.copy($scope.GetAxisList());
                                $scope.LCVAAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.LCVAAxisMinusList.indexOf(mlist[0]);
                                $scope.LCVAAxisList = angular.copy($scope.GetAxisList());
                                $scope.LCVAAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.LCVAAxisMinusList[index].selected = true;
                            }
                        }
                    }
                    $scope.SelectedInvestigation = data;
                }
            }

            if (data.InvestigationId === 10) {
                if (data.InvestigationOrgans.length > 0) {
                    if (type === 'Sph') {
                        // $scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.InvestigationOrgans[1].InvestigationAttributes.Spherical = item.Value;
                        list = $filter("filter")($scope.BBSphericalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.BBSphericalList.indexOf(list[0]);
                                $scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.BBSphericalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.BBSphericalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.BBSphericalMinusList.indexOf(mlist[0]);
                                $scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.BBSphericalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Cyl') {
                        //$scope.BBCylindricalList = angular.copy($scope.GetCylindricalList());
                        //$scope.BBCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                        data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = item.Value;
                        list = $filter("filter")($scope.BBCylindricalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.BBCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.BBCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.BBCylindricalList.indexOf(list[0]);
                                $scope.BBCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.BBCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.BBCylindricalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.BBCylindricalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.BBCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.BBCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.BBCylindricalMinusList.indexOf(mlist[0]);
                                $scope.BBCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.BBCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.BBCylindricalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Axis') {
                        //$scope.BBAxisList = angular.copy($scope.GetAxisList());
                        //$scope.BBAxisMinusList = angular.copy($scope.GetAxisMinusList());
                        data.InvestigationOrgans[1].InvestigationAttributes.Axis = item.Value;
                        list = $filter("filter")($scope.BBAxisList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.BBAxisList = angular.copy($scope.GetAxisList());
                                $scope.BBAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.BBAxisList.indexOf(list[0]);
                                $scope.BBAxisList = angular.copy($scope.GetAxisList());
                                $scope.BBAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.BBAxisList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.BBAxisMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.BBAxisList = angular.copy($scope.GetAxisList());
                                $scope.BBAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.BBAxisMinusList.indexOf(mlist[0]);
                                $scope.BBAxisList = angular.copy($scope.GetAxisList());
                                $scope.BBAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.BBAxisMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Add') {
                        //$scope.BBAddList = angular.copy($scope.GetAddList());
                        //$scope.BBAddMinusList = angular.copy($scope.GetAddMinusList());
                        data.InvestigationOrgans[1].InvestigationAttributes.Adition = item.Value;
                        list = $filter("filter")($scope.BBAddList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.BBAddList = angular.copy($scope.GetAddList());
                                $scope.BBAddMinusList = angular.copy($scope.GetAddMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Adition = "";
                            } else {
                                index = $scope.BBAddList.indexOf(list[0]);
                                $scope.BBAddList = angular.copy($scope.GetAddList());
                                $scope.BBAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.BBAddList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.BBAddMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.BBAddList = angular.copy($scope.GetAddList());
                                $scope.BBAddMinusList = angular.copy($scope.GetAddMinusList());
                                data.InvestigationOrgans[1].InvestigationAttributes.Adition = "";
                            } else {
                                index = $scope.BBAddMinusList.indexOf(mlist[0]);
                                $scope.BBAddList = angular.copy($scope.GetAddList());
                                $scope.BBAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.BBAddMinusList[index].selected = true;
                            }
                        }
                    }
                    $scope.SelectedInvestigation = data;
                }
            }


            if (data.InvestigationId === 5) {
                if (data.Attributes != undefined) {
                    if (type === 'Distance') {
                        //$scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.Attributes.distanceVision.LeftEye = item.Value;
                        list = $filter("filter")($scope.DistancePlusList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                // $scope.DistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.DistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.DistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.distanceVision.LeftEye = "";
                            } else {
                                index = $scope.DistancePlusList.indexOf(list[0]);
                                // $scope.DistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.DistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.DistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.DistancePlusList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.DistanceMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                // $scope.DistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.DistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.DistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.distanceVision.LeftEye = "";
                            } else {
                                index = $scope.DistanceMinusList.indexOf(mlist[0]);
                                // $scope.DistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.DistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.DistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.DistanceMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Near') {
                        //$scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.Attributes.NearVision.LeftEye = item.Value;
                        list = $filter("filter")($scope.NearPlusList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.NearPlusList = angular.copy($scope.GetNearList());
                                $scope.NearMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.NearVision.LeftEye = "";
                            } else {
                                index = $scope.NearPlusList.indexOf(list[0]);
                                $scope.NearPlusList = angular.copy($scope.GetNearList());
                                $scope.NearMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.NearPlusList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.NearMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.NearPlusList = angular.copy($scope.GetNearList());
                                $scope.NearMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.NearVision.LeftEye = "";
                            } else {
                                index = $scope.NearMinusList.indexOf(mlist[0]);
                                $scope.NearPlusList = angular.copy($scope.GetNearList());
                                $scope.NearMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.NearMinusList[index].selected = true;
                            }
                        }
                    }

                    $scope.SelectedInvestigation = data;
                }
            }
            if (data.InvestigationId === 4) {
                if (data.Attributes != undefined) {
                    if (type === 'Distance') {
                        //$scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.Attributes.distanceVision.LeftEye = item.Value;
                        list = $filter("filter")($scope.UnaidedDistancePlusList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                //  $scope.UnaidedDistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.UnaidedDistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.UnaidedDistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.distanceVision.LeftEye = "";
                            } else {
                                index = $scope.UnaidedDistancePlusList.indexOf(list[0]);
                                // $scope.UnaidedDistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.UnaidedDistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.UnaidedDistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UnaidedDistancePlusList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.UnaidedDistanceMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                // $scope.UnaidedDistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.UnaidedDistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.UnaidedDistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.distanceVision.LeftEye = "";
                            } else {
                                index = $scope.UnaidedDistanceMinusList.indexOf(mlist[0]);
                                // $scope.UnaidedDistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.UnaidedDistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.UnaidedDistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UnaidedDistanceMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Near') {
                        //$scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.Attributes.NearVision.LeftEye = item.Value;
                        list = $filter("filter")($scope.UnaidedNearPlusList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.UnaidedNearPlusList = angular.copy($scope.GetNearList());
                                $scope.UnaidedNearMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.NearVision.LeftEye = "";
                            } else {
                                index = $scope.UnaidedNearPlusList.indexOf(list[0]);
                                $scope.UnaidedNearPlusList = angular.copy($scope.GetNearList());
                                $scope.UnaidedNearMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UnaidedNearPlusList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.UnaidedNearMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.UnaidedNearPlusList = angular.copy($scope.GetNearList());
                                $scope.UnaidedNearMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.NearVision.LeftEye = "";
                            } else {
                                index = $scope.UnaidedNearMinusList.indexOf(mlist[0]);
                                $scope.UnaidedNearPlusList = angular.copy($scope.GetNearList());
                                $scope.UnaidedNearMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UnaidedNearMinusList[index].selected = true;
                            }
                        }
                    }

                    $scope.SelectedInvestigation = data;
                }
            }
            if (data.InvestigationId === 13) {
                if (data.Attributes != undefined) {
                    if (type === 'Pinhole') {
                        //$scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.Attributes.LeftEye = item.Value;
                        list = $filter("filter")($scope.PinholePlusList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                // $scope.PinholePlusList = angular.copy($scope.GetUcvaList());
                                $scope.PinholePlusList = angular.copy($scope.GetDistanceList());
                                $scope.PinholeMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.LeftEye = "";
                            } else {
                                index = $scope.PinholePlusList.indexOf(list[0]);
                                //$scope.PinholePlusList = angular.copy($scope.GetUcvaList());
                                $scope.PinholePlusList = angular.copy($scope.GetDistanceList());
                                $scope.PinholeMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.PinholePlusList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.PinholeMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                //$scope.PinholePlusList = angular.copy($scope.GetUcvaList());
                                $scope.PinholePlusList = angular.copy($scope.GetDistanceList());
                                $scope.PinholeMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.LeftEye = "";
                            } else {
                                index = $scope.PinholeMinusList.indexOf(mlist[0]);
                                //$scope.PinholePlusList = angular.copy($scope.GetUcvaList());
                                $scope.PinholePlusList = angular.copy($scope.GetDistanceList());
                                $scope.PinholeMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.PinholeMinusList[index].selected = true;
                            }
                        }
                    }


                    $scope.SelectedInvestigation = data;
                }
            }

            if (data.InvestigationId === 43 || data.InvestigationId === 44) {
                
                    if (type === 'UCVA') {
                        data.LeftEyeValues.UVa = item.Value;
                        list = $filter("filter")($scope.UcvaList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.LeftEyeValues.UVa = "";
                            } else {
                                index = $scope.UcvaList.indexOf(list[0]);
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UcvaList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.UcvaMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            if (mlist[0].selected) {
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                data.LeftEyeValues.UVa = "";
                            } else {
                                index = $scope.UcvaMinusList.indexOf(mlist[0]);
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                $scope.UcvaMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Sph') {
                        data.LeftEyeValues.Spherical = item.Value;
                        list = $filter("filter")($scope.SphericalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.LeftEyeValues.Spherical = "";
                            } else {
                                index = $scope.SphericalList.indexOf(list[0]);
                                $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.SphericalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.SphericalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            if (mlist[0].selected) {
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                                data.LeftEyeValues.Spherical = "";
                            } else {
                                index = $scope.SphericalMinusList.indexOf(mlist[0]);
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.UcvaList = angular.copy($scope.GetSphericalPlusList());
                                $scope.SphericalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Cyl') {
                        data.LeftEyeValues.Cylindrical = item.Value;
                        list = $filter("filter")($scope.CylindricalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.LeftEyeValues.Cylindrical = "";
                            } else {
                                index = $scope.CylindricalList.indexOf(list[0]);
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.CylindricalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.CylindricalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            if (mlist[0].selected) {
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                data.LeftEyeValues.Cylindrical = "";
                            } else {
                                index = $scope.CylindricalMinusList.indexOf(mlist[0]);
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CylindricalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Axis') {
                        data.LeftEyeValues.Axis = item.Value;
                        list = $filter("filter")($scope.AxisList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.LeftEyeValues.Axis = "";
                            } else {
                                index = $scope.AxisList.indexOf(list[0]);
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.AxisList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.AxisMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            if (mlist[0].selected) {
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                data.LeftEyeValues.Axis = "";
                            } else {
                                index = $scope.AxisMinusList.indexOf(mlist[0]);
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                $scope.AxisMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Add') {
                        data.LeftEyeValues.Adition = item.Value;
                        list = $filter("filter")($scope.RefAddList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                data.LeftEyeValues.Adition = "";
                            } else {
                                index = $scope.RefAddList.indexOf(list[0]);
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.RefAddList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.RefAddMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            if (mlist[0].selected) {
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                data.LeftEyeValues.Adition = "";
                            } else {
                                index = $scope.RefAddMinusList.indexOf(mlist[0]);
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                $scope.RefAddMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'BCVA') {
                        data.LeftEyeValues.BCVA = item.Value;
                        list = $filter("filter")($scope.refBcvaList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.refBcvaList = angular.copy($scope.GetRefBcvaList());
                                $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.LeftEyeValues.BCVA = "";
                            } else {
                                index = $scope.refBcvaList.indexOf(list[0]);
                                $scope.refBcvaList = angular.copy($scope.GetRefBcvaList());
                                $scope.refBcvaList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.refBcvaMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            if (mlist[0].selected) {
                                $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcvaList = angular.copy($scope.GetRefBcvaList());
                                data.LeftEyeValues.BCVA = "";
                            } else {
                                index = $scope.refBcvaMinusList.indexOf(mlist[0]);
                                $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcvaList = angular.copy($scope.GetRefBcvaList());
                                $scope.refBcvaMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'BCNVA') {
                        data.LeftEyeValues.BCNVA = item.Value;
                        list = $filter("filter")($scope.refBcnvaList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                                $scope.refBcnvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.LeftEyeValues.BCNVA = "";
                            } else {
                                index = $scope.refBcnvaList.indexOf(list[0]);
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                                $scope.refBcnvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcnvaList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.refBcnvaMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            if (mlist[0].selected) {
                                $scope.refBcnvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                                data.LeftEyeValues.BCNVA = "";
                            } else {
                                index = $scope.refBcnvaMinusList.indexOf(mlist[0]);
                                $scope.refBcnvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                                $scope.refBcnvaMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Prism') {
                        data.LeftEyeValues.Prism = item.Value;
                        list = $filter("filter")($scope.PrismList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.PrismList = angular.copy($scope.GetPrismList());
                                data.LeftEyeValues.Prism = "";
                            } else {
                                index = $scope.PrismList.indexOf(list[0]);
                                $scope.PrismList = angular.copy($scope.GetPrismList());
                                $scope.PrismList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'BASE') {
                        data.LeftEyeValues.Base = item.Value;
                        list = $filter("filter")($scope.BaseList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.BaseList = angular.copy($scope.GetBaseList());
                                data.LeftEyeValues.Base = "";
                            } else {
                                index = $scope.BaseList.indexOf(list[0]);
                                $scope.BaseList = angular.copy($scope.GetBaseList());
                                $scope.BaseList[index].selected = true;
                            }
                        }
                    }
                    $scope.SelectedInvestigation = data;
                
            }
        }

        if ($scope.SelectedEye === 3) {
            if (data.InvestigationId === 1) {
                if (data.InvestigationOrgans.length > 0) {
                    if (type === 'Sph') {

                        data.InvestigationOrgans[0].InvestigationAttributes.Spherical = item.Value;
                        data.InvestigationOrgans[1].InvestigationAttributes.Spherical = item.Value;
                        list = $filter("filter")($scope.SphericalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.SphericalList.indexOf(list[0]);
                                $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.SphericalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.SphericalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.SphericalMinusList.indexOf(mlist[0]);
                                $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.SphericalMinusList[index].selected = true;
                            }
                        }






                        //if (item.selected) {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                        //    item.selected = !item.selected;
                        //} else {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Spherical = item.Value;
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Spherical = item.Value;
                        //    //item.selected = !item.selected;
                        //    index = $scope.SphericalList.indexOf(item);
                        //    $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                        //    $scope.SphericalList[index].selected = true;
                        //}

                    }
                    if (type === 'Cyl') {
                        //data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = item.Value;
                        //data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = item.Value;
                        //item.selected = ind;


                        data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = item.Value;
                        data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = item.Value;
                        list = $filter("filter")($scope.CylindricalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.CylindricalList.indexOf(list[0]);
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.CylindricalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.CylindricalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.CylindricalMinusList.indexOf(mlist[0]);
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.CylindricalMinusList[index].selected = true;
                            }
                        }



                        //if (item.selected) {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                        //data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                        //    item.selected = !item.selected;
                        //} else {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = item.Value;
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = item.Value;
                        //    //item.selected = !item.selected;
                        //    index = $scope.CylindricalList.indexOf(item);
                        //    $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                        //    $scope.CylindricalList[index].selected = true;
                        //}
                    }
                    if (type === 'Axis') {
                        //data.InvestigationOrgans[0].InvestigationAttributes.Axis = item.Value;
                        //data.InvestigationOrgans[1].InvestigationAttributes.Axis = item.Value;
                        //item.selected = ind;


                        data.InvestigationOrgans[0].InvestigationAttributes.Axis = item.Value;
                        data.InvestigationOrgans[1].InvestigationAttributes.Axis = item.Value;
                        list = $filter("filter")($scope.AxisList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.AxisList.indexOf(list[0]);
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.AxisList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.AxisMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.AxisMinusList.indexOf(mlist[0]);
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.AxisMinusList[index].selected = true;
                            }
                        }




                        //if (item.selected) {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                        //    item.selected = !item.selected;
                        //} else {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Axis = item.Value;
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Axis = item.Value;
                        //    //item.selected = !item.selected;
                        //    index = $scope.AxisList.indexOf(item);
                        //    $scope.AxisList = angular.copy($scope.GetAxisList());
                        //    $scope.AxisList[index].selected = true;
                        //}
                    }
                    $scope.SelectedInvestigation = data;
                }
            }
            if (data.InvestigationId === 2) {
                if (data.InvestigationOrgans.length > 0) {
                    if (type === 'UCVA') {
                        //data.InvestigationOrgans[0].InvestigationAttributes.UCVA = item.Value;
                        //data.InvestigationOrgans[1].InvestigationAttributes.UCVA = item.Value;
                        //item.selected = ind;



                        data.InvestigationOrgans[0].InvestigationAttributes.UCVA = item.Value;
                        data.InvestigationOrgans[1].InvestigationAttributes.UCVA = item.Value;
                        list = $filter("filter")($scope.UcvaList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.UCVA = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.UCVA = "";
                            } else {
                                index = $scope.UcvaList.indexOf(list[0]);
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UcvaList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.UcvaMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.UCVA = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.UCVA = "";
                            } else {
                                index = $scope.UcvaMinusList.indexOf(mlist[0]);
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UcvaMinusList[index].selected = true;
                            }
                        }




                        //if (item.selected) {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.UCVA = "";
                        //    data.InvestigationOrgans[1].InvestigationAttributes.UCVA = "";
                        //    item.selected = !item.selected;
                        //} else {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.UCVA = item.Value;
                        //    data.InvestigationOrgans[1].InvestigationAttributes.UCVA = item.Value;
                        //    //item.selected = !item.selected;
                        //    index = $scope.UcvaList.indexOf(item);
                        //    $scope.UcvaList = angular.copy($scope.GetUcvaList());
                        //    $scope.UcvaList[index].selected = true;
                        //}

                    }
                    if (type === 'Sph') {

                        data.InvestigationOrgans[0].InvestigationAttributes.Spherical = item.Value;
                        data.InvestigationOrgans[1].InvestigationAttributes.Spherical = item.Value;
                        list = $filter("filter")($scope.RefSphericalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.RefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.RefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.RefSphericalList.indexOf(list[0]);
                                $scope.RefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.RefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.RefSphericalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.RefSphericalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.RefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.RefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.RefSphericalMinusList.indexOf(mlist[0]);
                                $scope.RefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.RefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.RefSphericalMinusList[index].selected = true;
                            }
                        }



                        //if (item.selected) {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                        //    item.selected = !item.selected;
                        //} else {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Spherical = item.Value;
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Spherical = item.Value;
                        //    //item.selected = !item.selected;
                        //    index = $scope.RefSphericalList.indexOf(item);
                        //    $scope.RefSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //    $scope.RefSphericalList[index].selected = true;
                        //}
                        //data.InvestigationOrgans[0].InvestigationAttributes.Spherical = item.Value;
                        //data.InvestigationOrgans[1].InvestigationAttributes.Spherical = item.Value;
                        //item.selected = ind;
                    }
                    if (type === 'Cyl') {


                        data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = item.Value;
                        data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = item.Value;
                        list = $filter("filter")($scope.RefCylindricalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.RefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.RefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.RefCylindricalList.indexOf(list[0]);
                                $scope.RefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.RefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.RefCylindricalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.RefCylindricalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.RefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.RefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.RefCylindricalMinusList.indexOf(mlist[0]);
                                $scope.RefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.RefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.RefCylindricalMinusList[index].selected = true;
                            }
                        }



                        //if (item.selected) {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                        //    item.selected = !item.selected;
                        //} else {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = item.Value;
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = item.Value;
                        //    //item.selected = !item.selected;
                        //    index = $scope.RefCylindricalList.indexOf(item);
                        //    $scope.RefCylindricalList = angular.copy($scope.GetCylindricalList());
                        //    $scope.RefCylindricalList[index].selected = true;
                        //}


                        //data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = item.Value;
                        //data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = item.Value;
                        //item.selected = ind;
                    }
                    if (type === 'Axis') {
                        data.InvestigationOrgans[0].InvestigationAttributes.Axis = item.Value;
                        data.InvestigationOrgans[1].InvestigationAttributes.Axis = item.Value;
                        list = $filter("filter")($scope.RefAxisList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.RefAxisList = angular.copy($scope.GetAxisList());
                                $scope.RefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.RefAxisList.indexOf(list[0]);
                                $scope.RefAxisList = angular.copy($scope.GetAxisList());
                                $scope.RefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.RefAxisList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.RefAxisMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.RefAxisList = angular.copy($scope.GetAxisList());
                                $scope.RefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.RefAxisMinusList.indexOf(mlist[0]);
                                $scope.RefAxisList = angular.copy($scope.GetAxisList());
                                $scope.RefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.RefAxisMinusList[index].selected = true;
                            }
                        }
                        //if (item.selected) {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                        //    item.selected = !item.selected;
                        //} else {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Axis = item.Value;
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Axis = item.Value;
                        //    //item.selected = !item.selected;
                        //    index = $scope.RefAxisList.indexOf(item);
                        //    $scope.RefAxisList = angular.copy($scope.GetAxisList());
                        //    $scope.RefAxisList[index].selected = true;
                        //}
                        //data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = item.Value;
                        //data.InvestigationOrgans[1].InvestigationAttributes.Axis = item.Value;
                        //item.selected = ind;
                    }
                    if (type === 'Add') {

                        data.InvestigationOrgans[0].InvestigationAttributes.Adition = item.Value;
                        data.InvestigationOrgans[1].InvestigationAttributes.Adition = item.Value;
                        list = $filter("filter")($scope.RefAddList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Adition = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Adition = "";
                            } else {
                                index = $scope.RefAddList.indexOf(list[0]);
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.RefAddList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.RefAddMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Adition = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Adition = "";
                            } else {
                                index = $scope.RefAddMinusList.indexOf(mlist[0]);
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.RefAddMinusList[index].selected = true;
                            }
                        }


                        //if (item.selected) {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Adition = "";
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Adition = "";
                        //    item.selected = !item.selected;
                        //} else {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Adition = item.Value;
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Adition = item.Value;
                        //    //item.selected = !item.selected;
                        //    index = $scope.RefAddList.indexOf(item);
                        //    $scope.RefAddList = angular.copy($scope.GetAddList());
                        //    $scope.RefAddList[index].selected = true;
                        //}


                        //data.InvestigationOrgans[0].InvestigationAttributes.Adition = item.Value;
                        //data.InvestigationOrgans[1].InvestigationAttributes.Adition = item.Value;
                        //item.selected = ind;
                    }
                    if (type === 'BCVA') {

                        data.InvestigationOrgans[0].InvestigationAttributes.BCVA = item.Value;
                        data.InvestigationOrgans[1].InvestigationAttributes.BCVA = item.Value;
                        list = $filter("filter")($scope.refBcvaList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                // $scope.refBcvaList = angular.copy($scope.GetUcvaList());
                                $scope.refBcvaList = angular.copy($scope.GetRefBcvaList());
                                $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.BCVA = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.BCVA = "";
                            } else {
                                index = $scope.refBcvaList.indexOf(list[0]);
                                //  $scope.refBcvaList = angular.copy($scope.GetUcvaList());
                                $scope.refBcvaList = angular.copy($scope.GetRefBcvaList());
                                $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcvaList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.refBcvaMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                // $scope.refBcvaList = angular.copy($scope.GetUcvaList());
                                $scope.refBcvaList = angular.copy($scope.GetRefBcvaList());
                                $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.BCVA = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.BCVA = "";
                            } else {
                                index = $scope.refBcvaMinusList.indexOf(mlist[0]);
                                // $scope.refBcvaList = angular.copy($scope.GetUcvaList());
                                $scope.refBcvaList = angular.copy($scope.GetRefBcvaList());
                                $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcvaMinusList[index].selected = true;
                            }
                        }
                        //if (item.selected) {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.BCVA = "";
                        //    data.InvestigationOrgans[1].InvestigationAttributes.BCVA = "";
                        //    item.selected = !item.selected;
                        //} else {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.BCVA = item.Value;
                        //    data.InvestigationOrgans[1].InvestigationAttributes.BCVA = item.Value;
                        //    //item.selected = !item.selected;
                        //    index = $scope.refBcvaList.indexOf(item);
                        //    $scope.refBcvaList = angular.copy($scope.GetUcvaList());
                        //    $scope.refBcvaList[index].selected = true;
                        //}

                        //data.InvestigationOrgans[0].InvestigationAttributes.BCVA = item.Value;
                        //data.InvestigationOrgans[1].InvestigationAttributes.BCVA = item.Value;
                        //item.selected = ind;
                    }
                    if (type === 'BCNVA') {

                        data.InvestigationOrgans[0].InvestigationAttributes.BCNVA = item.Value;
                        data.InvestigationOrgans[1].InvestigationAttributes.BCNVA = item.Value;
                        list = $filter("filter")($scope.refBcnvaList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                                $scope.refBcnvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.BCNVA = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.BCNVA = "";
                            } else {
                                index = $scope.refBcnvaList.indexOf(list[0]);
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                                $scope.refBcnvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcnvaList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.refBcnvaMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                                $scope.refBcnvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.BCNVA = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.BCNVA = "";
                            } else {
                                index = $scope.refBcnvaMinusList.indexOf(mlist[0]);
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                                $scope.refBcnvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcnvaMinusList[index].selected = true;
                            }
                        }
                        //if (item.selected) {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.BCVA = "";
                        //    data.InvestigationOrgans[1].InvestigationAttributes.BCVA = "";
                        //    item.selected = !item.selected;
                        //} else {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.BCVA = item.Value;
                        //    data.InvestigationOrgans[1].InvestigationAttributes.BCVA = item.Value;
                        //    //item.selected = !item.selected;
                        //    index = $scope.refBcvaList.indexOf(item);
                        //    $scope.refBcvaList = angular.copy($scope.GetUcvaList());
                        //    $scope.refBcvaList[index].selected = true;
                        //}

                        //data.InvestigationOrgans[0].InvestigationAttributes.BCVA = item.Value;
                        //data.InvestigationOrgans[1].InvestigationAttributes.BCVA = item.Value;
                        //item.selected = ind;
                    }
                    if (type === 'PH') {

                        data.InvestigationOrgans[0].InvestigationAttributes.PH = item.Value;
                        data.InvestigationOrgans[1].InvestigationAttributes.PH = item.Value;
                        list = $filter("filter")($scope.refPHList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.refPHList = angular.copy($scope.GetUcvaList());
                                $scope.refPHMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.PH = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.PH = "";
                            } else {
                                index = $scope.refPHList.indexOf(list[0]);
                                $scope.refPHList = angular.copy($scope.GetUcvaList());
                                $scope.refPHMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refPHList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.refPHMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.refPHList = angular.copy($scope.GetUcvaList());
                                $scope.refPHMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.PH = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.PH = "";
                            } else {
                                index = $scope.refPHMinusList.indexOf(mlist[0]);
                                $scope.refPHList = angular.copy($scope.GetUcvaList());
                                $scope.refPHMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refPHMinusList[index].selected = true;
                            }
                        }


                        //if (item.selected) {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.PH = "";
                        //    data.InvestigationOrgans[1].InvestigationAttributes.PH = "";
                        //    item.selected = !item.selected;
                        //} else {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.PH = item.Value;
                        //    data.InvestigationOrgans[1].InvestigationAttributes.PH = item.Value;
                        //    //item.selected = !item.selected;
                        //    index = $scope.refPHList.indexOf(item);
                        //    $scope.refPHList = angular.copy($scope.GetUcvaList());
                        //    $scope.refPHList[index].selected = true;
                        //}



                        //data.InvestigationOrgans[0].InvestigationAttributes.PH = item.Value;
                        //data.InvestigationOrgans[1].InvestigationAttributes.PH = item.Value;
                        //item.selected = ind;
                    }
                    $scope.SelectedInvestigation = data;
                }
            }
            if (data.InvestigationId === 3) {
                if (data.InvestigationOrgans.length > 0) {
                    //if (type === 'UCVA') {
                    //    data.InvestigationOrgans[0].InvestigationAttributes.UCVA = item.Value;
                    //    data.InvestigationOrgans[1].InvestigationAttributes.UCVA = item.Value;
                    //    list = $filter("filter")($scope.CrefUcvaList, { "Value": item.Value }, true);
                    //    if (list.length > 0) {
                    //        //list[0].selected = ind;
                    //        if (list[0].selected) {
                    //            $scope.CrefUcvaList = angular.copy($scope.GetUcvaList());
                    //            data.InvestigationOrgans[0].InvestigationAttributes.UCVA = "";
                    //            data.InvestigationOrgans[1].InvestigationAttributes.UCVA = "";
                    //        } else {
                    //            index = $scope.CrefUcvaList.indexOf(list[0]);
                    //            $scope.CrefUcvaList = angular.copy($scope.GetUcvaList());
                    //            $scope.CrefUcvaList[index].selected = true;
                    //        }
                    //    }
                    //    mlist = $filter("filter")($scope.CrefUcvaMinusList, { "Value": item.Value }, true);
                    //    if (mlist.length > 0) {
                    //        //mlist[0].selected = ind;
                    //        if (mlist[0].selected) {
                    //            $scope.CrefUcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                    //            data.InvestigationOrgans[0].InvestigationAttributes.UCVA = "";
                    //            data.InvestigationOrgans[1].InvestigationAttributes.UCVA = "";
                    //        } else {
                    //            index = $scope.CrefUcvaMinusList.indexOf(mlist[0]);
                    //            $scope.CrefUcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                    //            $scope.CrefUcvaMinusList[index].selected = true;
                    //        }
                    //    }


                    //    //if (item.selected) {
                    //    //    data.InvestigationOrgans[0].InvestigationAttributes.UCVA = "";
                    //    //    data.InvestigationOrgans[1].InvestigationAttributes.UCVA = "";
                    //    //    item.selected = !item.selected;
                    //    //} else {
                    //    //    data.InvestigationOrgans[0].InvestigationAttributes.UCVA = item.Value;
                    //    //    data.InvestigationOrgans[1].InvestigationAttributes.UCVA = item.Value;
                    //    //    //item.selected = !item.selected;
                    //    //    index = $scope.CrefUcvaList.indexOf(item);
                    //    //    $scope.CrefUcvaList = angular.copy($scope.GetUcvaList());
                    //    //    $scope.CrefUcvaList[index].selected = true;
                    //    //}


                    //    //data.InvestigationOrgans[0].InvestigationAttributes.UCVA = item.Value;
                    //    //data.InvestigationOrgans[1].InvestigationAttributes.UCVA = item.Value;
                    //    //item.selected = ind;
                    //}
                    if (type === 'Sph') {

                        data.InvestigationOrgans[0].InvestigationAttributes.Spherical = item.Value;
                        data.InvestigationOrgans[1].InvestigationAttributes.Spherical = item.Value;
                        list = $filter("filter")($scope.CRefSphericalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.CRefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.CRefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.CRefSphericalList.indexOf(list[0]);
                                $scope.CRefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.CRefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.CRefSphericalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.CRefSphericalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.CRefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.CRefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.CRefSphericalMinusList.indexOf(mlist[0]);
                                $scope.CRefSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.CRefSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.CRefSphericalMinusList[index].selected = true;
                            }
                        }


                        //if (item.selected) {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                        //    item.selected = !item.selected;
                        //} else {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Spherical = item.Value;
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Spherical = item.Value;
                        //    //item.selected = !item.selected;
                        //    index = $scope.CRefSphericalList.indexOf(item);
                        //    $scope.CRefSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //    $scope.CRefSphericalList[index].selected = true;
                        //}



                        //data.InvestigationOrgans[0].InvestigationAttributes.Spherical = item.Value;
                        //data.InvestigationOrgans[1].InvestigationAttributes.Spherical = item.Value;
                        //item.selected = ind;
                    }
                    if (type === 'Cyl') {

                        data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = item.Value;
                        data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = item.Value;
                        list = $filter("filter")($scope.CRefCylindricalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.CRefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CRefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.CRefCylindricalList.indexOf(list[0]);
                                $scope.CRefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CRefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.CRefCylindricalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.CRefCylindricalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.CRefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CRefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.CRefCylindricalMinusList.indexOf(mlist[0]);
                                $scope.CRefCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CRefCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.CRefCylindricalMinusList[index].selected = true;
                            }
                        }
                        //if (item.selected) {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                        //    item.selected = !item.selected;
                        //} else {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = item.Value;
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = item.Value;
                        //    //item.selected = !item.selected;
                        //    index = $scope.CRefCylindricalList.indexOf(item);
                        //    $scope.CRefCylindricalList = angular.copy($scope.GetCylindricalList());
                        //    $scope.CRefCylindricalList[index].selected = true;
                        //}

                        //data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = item.Value;
                        //data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = item.Value;
                        //item.selected = ind;
                    }
                    if (type === 'Axis') {

                        data.InvestigationOrgans[0].InvestigationAttributes.Axis = item.Value;
                        data.InvestigationOrgans[1].InvestigationAttributes.Axis = item.Value;
                        list = $filter("filter")($scope.CRefAxisList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.CRefAxisList = angular.copy($scope.GetAxisList());
                                $scope.CRefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.CRefAxisList.indexOf(list[0]);
                                $scope.CRefAxisList = angular.copy($scope.GetAxisList());
                                $scope.CRefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.CRefAxisList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.CRefAxisMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.CRefAxisList = angular.copy($scope.GetAxisList());
                                $scope.CRefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.CRefAxisMinusList.indexOf(mlist[0]);
                                $scope.CRefAxisList = angular.copy($scope.GetAxisList());
                                $scope.CRefAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.CRefAxisMinusList[index].selected = true;
                            }
                        }
                        //if (item.selected) {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                        //    item.selected = !item.selected;
                        //} else {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Axis = item.Value;
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Axis = item.Value;
                        //    //item.selected = !item.selected;
                        //    index = $scope.CRefAxisList.indexOf(item);
                        //    $scope.CRefAxisList = angular.copy($scope.GetAxisList());
                        //    $scope.CRefAxisList[index].selected = true;
                        //}


                        //data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = item.Value;
                        //data.InvestigationOrgans[1].InvestigationAttributes.Axis = item.Value;
                        //item.selected = ind;
                    }
                    if (type === 'Add') {
                        data.InvestigationOrgans[0].InvestigationAttributes.Adition = item.Value;
                        data.InvestigationOrgans[1].InvestigationAttributes.Adition = item.Value;
                        list = $filter("filter")($scope.CRefAddList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.CRefAddList = angular.copy($scope.GetAddList());
                                $scope.CRefAddMinusList = angular.copy($scope.GetAddMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Adition = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Adition = "";
                            } else {
                                index = $scope.CRefAddList.indexOf(list[0]);
                                $scope.CRefAddList = angular.copy($scope.GetAddList());
                                $scope.CRefAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.CRefAddList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.CRefAddMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.CRefAddList = angular.copy($scope.GetAddList());
                                $scope.CRefAddMinusList = angular.copy($scope.GetAddMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Adition = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Adition = "";
                            } else {
                                index = $scope.CRefAddMinusList.indexOf(mlist[0]);
                                $scope.CRefAddList = angular.copy($scope.GetAddList());
                                $scope.CRefAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.CRefAddMinusList[index].selected = true;
                            }
                        }


                        //if (item.selected) {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Adition = "";
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Adition = "";
                        //    item.selected = !item.selected;
                        //} else {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Adition = item.Value;
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Adition = item.Value;
                        //    //item.selected = !item.selected;
                        //    index = $scope.CRefAddList.indexOf(item);
                        //    $scope.CRefAddList = angular.copy($scope.GetAddList());
                        //    $scope.CRefAddList[index].selected = true;
                        //}



                        //data.InvestigationOrgans[0].InvestigationAttributes.Adition = item.Value;
                        //data.InvestigationOrgans[1].InvestigationAttributes.Adition = item.Value;
                        //item.selected = ind;
                    }
                    if (type === 'BCVA') {
                        data.InvestigationOrgans[0].InvestigationAttributes.BCVA = item.Value;
                        data.InvestigationOrgans[1].InvestigationAttributes.BCVA = item.Value;
                        list = $filter("filter")($scope.CrefBcvaList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                // $scope.CrefBcvaList = angular.copy($scope.GetUcvaList());
                                $scope.CrefBcvaList = angular.copy($scope.GetRefBcvaList());
                                data.InvestigationOrgans[0].InvestigationAttributes.BCVA = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.BCVA = "";
                            } else {
                                index = $scope.CrefBcvaList.indexOf(list[0]);
                                // $scope.CrefBcvaList = angular.copy($scope.GetUcvaList());
                                $scope.CrefBcvaList = angular.copy($scope.GetRefBcvaList());
                                $scope.CrefBcvaList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.CrefBcvaMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.CrefBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.BCVA = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.BCVA = "";
                            } else {
                                index = $scope.CrefBcvaMinusList.indexOf(mlist[0]);
                                $scope.CrefBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.CrefBcvaMinusList[index].selected = true;
                            }
                        }

                        //if (item.selected) {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.BCVA = "";
                        //    data.InvestigationOrgans[1].InvestigationAttributes.BCVA = "";
                        //    item.selected = !item.selected;
                        //} else {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.BCVA = item.Value;
                        //    data.InvestigationOrgans[1].InvestigationAttributes.BCVA = item.Value;
                        //    //item.selected = !item.selected;
                        //    index = $scope.CrefBcvaList.indexOf(item);
                        //    $scope.CrefBcvaList = angular.copy($scope.GetUcvaList());
                        //    $scope.CrefBcvaList[index].selected = true;
                        //}



                        //data.InvestigationOrgans[0].InvestigationAttributes.BCVA = item.Value;
                        //data.InvestigationOrgans[1].InvestigationAttributes.BCVA = item.Value;
                        //item.selected = ind;
                    }
                    //if (type === 'PH') {
                    //    data.InvestigationOrgans[0].InvestigationAttributes.PH = item.Value;
                    //    data.InvestigationOrgans[1].InvestigationAttributes.PH = item.Value;
                    //    list = $filter("filter")($scope.CrefPHList, { "Value": item.Value }, true);
                    //    if (list.length > 0) {
                    //        //list[0].selected = ind;
                    //        if (list[0].selected) {
                    //            $scope.CrefPHList = angular.copy($scope.GetUcvaList());
                    //            data.InvestigationOrgans[0].InvestigationAttributes.PH = "";
                    //            data.InvestigationOrgans[1].InvestigationAttributes.PH = "";
                    //        } else {
                    //            index = $scope.CrefPHList.indexOf(list[0]);
                    //            $scope.CrefPHList = angular.copy($scope.GetUcvaList());
                    //            $scope.CrefPHList[index].selected = true;
                    //        }
                    //    }
                    //    mlist = $filter("filter")($scope.CrefPHMinusList, { "Value": item.Value }, true);
                    //    if (mlist.length > 0) {
                    //        //mlist[0].selected = ind;
                    //        if (mlist[0].selected) {
                    //            $scope.CrefPHMinusList = angular.copy($scope.GetUcvaMinusList());
                    //            data.InvestigationOrgans[0].InvestigationAttributes.PH = "";
                    //            data.InvestigationOrgans[1].InvestigationAttributes.PH = "";
                    //        } else {
                    //            index = $scope.CrefPHMinusList.indexOf(mlist[0]);
                    //            $scope.CrefPHMinusList = angular.copy($scope.GetUcvaMinusList());
                    //            $scope.CrefPHMinusList[index].selected = true;
                    //        }
                    //    }
                    //    //if (item.selected) {
                    //    //    data.InvestigationOrgans[0].InvestigationAttributes.PH = "";
                    //    //    data.InvestigationOrgans[1].InvestigationAttributes.PH = "";
                    //    //    item.selected = !item.selected;
                    //    //} else {
                    //    //    data.InvestigationOrgans[0].InvestigationAttributes.PH = item.Value;
                    //    //    data.InvestigationOrgans[1].InvestigationAttributes.PH = item.Value;
                    //    //    //item.selected = !item.selected;
                    //    //    index = $scope.CrefPHList.indexOf(item);
                    //    //    $scope.CrefPHList = angular.copy($scope.GetUcvaList());
                    //    //    $scope.CrefPHList[index].selected = true;
                    //    //}



                    //    //data.InvestigationOrgans[0].InvestigationAttributes.PH = item.Value;
                    //    //data.InvestigationOrgans[1].InvestigationAttributes.PH = item.Value;
                    //    //item.selected = ind;
                    //}
                    $scope.SelectedInvestigation = data;
                }
            }
            if (data.InvestigationId === 8) {
                if (data.InvestigationOrgans.length > 0) {
                    if (type === 'Sph') {
                        data.InvestigationOrgans[0].InvestigationAttributes.Spherical = item.Value;
                        data.InvestigationOrgans[1].InvestigationAttributes.Spherical = item.Value;
                        list = $filter("filter")($scope.LCVASphericalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.LCVASphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.LCVASphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.LCVASphericalList.indexOf(list[0]);
                                $scope.LCVASphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.LCVASphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.LCVASphericalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.LCVASphericalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.LCVASphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.LCVASphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.LCVASphericalMinusList.indexOf(mlist[0]);
                                $scope.LCVASphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.LCVASphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.LCVASphericalMinusList[index].selected = true;
                            }
                        }


                        //if (item.selected) {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                        //    item.selected = !item.selected;
                        //} else {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Spherical = item.Value;
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Spherical = item.Value;
                        //    //item.selected = !item.selected;
                        //    index = $scope.LCVASphericalList.indexOf(item);
                        //    $scope.LCVASphericalList = angular.copy($scope.GetSphericalPlusList());
                        //    $scope.LCVASphericalList[index].selected = true;
                        //}


                        //data.InvestigationOrgans[0].InvestigationAttributes.Spherical = item.Value;
                        //data.InvestigationOrgans[1].InvestigationAttributes.Spherical = item.Value;
                        //item.selected = ind;
                    }
                    if (type === 'Cyl') {
                        data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = item.Value;
                        data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = item.Value;
                        list = $filter("filter")($scope.LCVACylindricalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.LCVACylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.LCVACylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.LCVACylindricalList.indexOf(list[0]);
                                $scope.LCVACylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.LCVACylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.LCVACylindricalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.LCVACylindricalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.LCVACylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.LCVACylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.LCVACylindricalMinusList.indexOf(mlist[0]);
                                $scope.LCVACylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.LCVACylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.LCVACylindricalMinusList[index].selected = true;
                            }
                        }

                        //if (item.selected) {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                        //    item.selected = !item.selected;
                        //} else {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = item.Value;
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = item.Value;
                        //    //item.selected = !item.selected;
                        //    index = $scope.LCVACylindricalList.indexOf(item);
                        //    $scope.LCVACylindricalList = angular.copy($scope.GetCylindricalList());
                        //    $scope.LCVACylindricalList[index].selected = true;
                        //}


                        //data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = item.Value;
                        //data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = item.Value;
                        //item.selected = ind;
                    }
                    if (type === 'Axis') {
                        data.InvestigationOrgans[0].InvestigationAttributes.Axis = item.Value;
                        data.InvestigationOrgans[1].InvestigationAttributes.Axis = item.Value;
                        list = $filter("filter")($scope.LCVAAxisList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.LCVAAxisList = angular.copy($scope.GetAxisList());
                                $scope.LCVAAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.LCVAAxisList.indexOf(list[0]);
                                $scope.LCVAAxisList = angular.copy($scope.GetAxisList());
                                $scope.LCVAAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.LCVAAxisList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.LCVAAxisMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.LCVAAxisList = angular.copy($scope.GetAxisList());
                                $scope.LCVAAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.LCVAAxisMinusList.indexOf(mlist[0]);
                                $scope.LCVAAxisList = angular.copy($scope.GetAxisList());
                                $scope.LCVAAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.LCVAAxisMinusList[index].selected = true;
                            }
                        }
                        //if (item.selected) {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                        //    item.selected = !item.selected;
                        //} else {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Axis = item.Value;
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Axis = item.Value;
                        //    //item.selected = !item.selected;
                        //    index = $scope.LCVAAxisList.indexOf(item);
                        //    $scope.LCVAAxisList = angular.copy($scope.GetAxisList());
                        //    $scope.LCVAAxisList[index].selected = true;
                        //}


                        //data.InvestigationOrgans[0].InvestigationAttributes.Axis = item.Value;
                        //data.InvestigationOrgans[1].InvestigationAttributes.Axis = item.Value;
                        //item.selected = ind;
                    }
                    $scope.SelectedInvestigation = data;
                }
            }
            if (data.InvestigationId === 10) {
                if (data.InvestigationOrgans.length > 0) {
                    if (type === 'Sph') {

                        data.InvestigationOrgans[0].InvestigationAttributes.Spherical = item.Value;
                        data.InvestigationOrgans[1].InvestigationAttributes.Spherical = item.Value;
                        list = $filter("filter")($scope.BBSphericalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.BBSphericalList.indexOf(list[0]);
                                $scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.BBSphericalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.BBSphericalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                            } else {
                                index = $scope.BBSphericalMinusList.indexOf(mlist[0]);
                                $scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.BBSphericalMinusList[index].selected = true;
                            }
                        }
                        //if (item.selected) {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Spherical = "";
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Spherical = "";
                        //    item.selected = !item.selected;
                        //} else {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Spherical = item.Value;
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Spherical = item.Value;
                        //    //item.selected = !item.selected;
                        //    index = $scope.BBSphericalList.indexOf(item);
                        //    $scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //    $scope.BBSphericalList[index].selected = true;
                        //}


                        //data.InvestigationOrgans[0].InvestigationAttributes.Spherical = item.Value;
                        //data.InvestigationOrgans[1].InvestigationAttributes.Spherical = item.Value;
                        //item.selected = ind;
                    }
                    if (type === 'Cyl') {

                        data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = item.Value;
                        data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = item.Value;
                        list = $filter("filter")($scope.BBCylindricalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.BBCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.BBCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.BBCylindricalList.indexOf(list[0]);
                                $scope.BBCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.BBCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.BBCylindricalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.BBCylindricalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.BBCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.BBCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                            } else {
                                index = $scope.BBCylindricalMinusList.indexOf(mlist[0]);
                                $scope.BBCylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.BBCylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.BBCylindricalMinusList[index].selected = true;
                            }
                        }
                        //if (item.selected) {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = "";
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = "";
                        //    item.selected = !item.selected;
                        //} else {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = item.Value;
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = item.Value;
                        //    //item.selected = !item.selected;
                        //    index = $scope.BBCylindricalList.indexOf(item);
                        //    $scope.BBCylindricalList = angular.copy($scope.GetCylindricalList());
                        //    $scope.BBCylindricalList[index].selected = true;
                        //}




                        //data.InvestigationOrgans[0].InvestigationAttributes.Cylindrical = item.Value;
                        //data.InvestigationOrgans[1].InvestigationAttributes.Cylindrical = item.Value;
                        //item.selected = ind;
                    }
                    if (type === 'Axis') {
                        data.InvestigationOrgans[0].InvestigationAttributes.Axis = item.Value;
                        data.InvestigationOrgans[1].InvestigationAttributes.Axis = item.Value;
                        list = $filter("filter")($scope.BBAxisList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.BBAxisList = angular.copy($scope.GetAxisList());
                                $scope.BBAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.BBAxisList.indexOf(list[0]);
                                $scope.BBAxisList = angular.copy($scope.GetAxisList());
                                $scope.BBAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.BBAxisList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.BBAxisMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.BBAxisList = angular.copy($scope.GetAxisList());
                                $scope.BBAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                            } else {
                                index = $scope.BBAxisMinusList.indexOf(mlist[0]);
                                $scope.BBAxisList = angular.copy($scope.GetAxisList());
                                $scope.BBAxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.BBAxisMinusList[index].selected = true;
                            }
                        }
                        //if (item.selected) {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Axis = "";
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Axis = "";
                        //    item.selected = !item.selected;
                        //} else {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Axis = item.Value;
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Axis = item.Value;
                        //    //item.selected = !item.selected;
                        //    index = $scope.BBAxisList.indexOf(item);
                        //    $scope.BBAxisList = angular.copy($scope.GetAxisList());
                        //    $scope.BBAxisList[index].selected = true;
                        //}
                        //data.InvestigationOrgans[0].InvestigationAttributes.Axis = item.Value;
                        //data.InvestigationOrgans[1].InvestigationAttributes.Axis = item.Value;
                        //item.selected = ind;
                    }
                    if (type === 'Add') {

                        data.InvestigationOrgans[0].InvestigationAttributes.Adition = item.Value;
                        data.InvestigationOrgans[1].InvestigationAttributes.Adition = item.Value;
                        list = $filter("filter")($scope.BBAddList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.BBAddList = angular.copy($scope.GetAddList());
                                $scope.BBAddMinusList = angular.copy($scope.GetAddMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Adition = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Adition = "";
                            } else {
                                index = $scope.BBAddList.indexOf(list[0]);
                                $scope.BBAddList = angular.copy($scope.GetAddList());
                                $scope.BBAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.BBAddList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.BBAddMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.BBAddList = angular.copy($scope.GetAddList());
                                $scope.BBAddMinusList = angular.copy($scope.GetAddMinusList());
                                data.InvestigationOrgans[0].InvestigationAttributes.Adition = "";
                                data.InvestigationOrgans[1].InvestigationAttributes.Adition = "";
                            } else {
                                index = $scope.BBAddMinusList.indexOf(mlist[0]);
                                $scope.BBAddList = angular.copy($scope.GetAddList());
                                $scope.BBAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.BBAddMinusList[index].selected = true;
                            }
                        }
                        //if (item.selected) {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Adition = "";
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Adition = "";
                        //    item.selected = !item.selected;
                        //} else {
                        //    data.InvestigationOrgans[0].InvestigationAttributes.Adition = item.Value;
                        //    data.InvestigationOrgans[1].InvestigationAttributes.Adition = item.Value;
                        //    //item.selected = !item.selected;
                        //    index = $scope.BBAddList.indexOf(item);
                        //    $scope.BBAddList = angular.copy($scope.GetAddList());
                        //    $scope.BBAddList[index].selected = true;
                        //}
                    }
                    $scope.SelectedInvestigation = data;
                }
            }
            if (data.InvestigationId === 5) {
                if (data.Attributes != undefined) {
                    if (type === 'Distance') {
                        //$scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.Attributes.distanceVision.LeftEye = item.Value;
                        data.Attributes.distanceVision.RightEye = item.Value;
                        list = $filter("filter")($scope.DistancePlusList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                // $scope.DistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.DistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.DistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.distanceVision.LeftEye = "";
                                data.Attributes.distanceVision.RightEye = "";
                            } else {
                                index = $scope.DistancePlusList.indexOf(list[0]);
                                // $scope.DistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.DistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.DistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.DistancePlusList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.DistanceMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                //$scope.DistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.DistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.DistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.distanceVision.LeftEye = "";
                                data.Attributes.distanceVision.RightEye = "";
                            } else {
                                index = $scope.DistanceMinusList.indexOf(mlist[0]);
                                //$scope.DistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.DistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.DistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.DistanceMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Near') {
                        //$scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.Attributes.NearVision.LeftEye = item.Value;
                        data.Attributes.NearVision.RightEye = item.Value;
                        list = $filter("filter")($scope.NearPlusList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.NearPlusList = angular.copy($scope.GetNearList());
                                $scope.NearMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.NearVision.LeftEye = "";
                                data.Attributes.NearVision.RightEye = "";
                            } else {
                                index = $scope.NearPlusList.indexOf(list[0]);
                                $scope.NearPlusList = angular.copy($scope.GetNearList());
                                $scope.NearMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.NearPlusList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.NearMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.NearPlusList = angular.copy($scope.GetNearList());
                                $scope.NearMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.NearVision.LeftEye = "";
                                data.Attributes.NearVision.RightEye = "";
                            } else {
                                index = $scope.NearMinusList.indexOf(mlist[0]);
                                $scope.NearPlusList = angular.copy($scope.GetNearList());
                                $scope.NearMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.NearMinusList[index].selected = true;
                            }
                        }
                    }

                    $scope.SelectedInvestigation = data;
                }
            }
            if (data.InvestigationId === 4) {
                if (data.Attributes != undefined) {
                    if (type === 'Distance') {
                        //$scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.Attributes.distanceVision.LeftEye = item.Value;
                        data.Attributes.distanceVision.RightEye = item.Value;
                        list = $filter("filter")($scope.UnaidedDistancePlusList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                // $scope.UnaidedDistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.UnaidedDistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.UnaidedDistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.distanceVision.LeftEye = "";
                                data.Attributes.distanceVision.RightEye = "";
                            } else {
                                index = $scope.UnaidedDistancePlusList.indexOf(list[0]);
                                // $scope.UnaidedDistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.UnaidedDistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.UnaidedDistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UnaidedDistancePlusList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.UnaidedDistanceMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                // $scope.UnaidedDistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.UnaidedDistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.UnaidedDistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.distanceVision.LeftEye = "";
                                data.Attributes.distanceVision.RightEye = "";
                            } else {
                                index = $scope.UnaidedDistanceMinusList.indexOf(mlist[0]);
                                // $scope.UnaidedDistancePlusList = angular.copy($scope.GetUcvaList());
                                $scope.UnaidedDistancePlusList = angular.copy($scope.GetDistanceList());
                                $scope.UnaidedDistanceMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UnaidedDistanceMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Near') {
                        //$scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.Attributes.NearVision.LeftEye = item.Value;
                        data.Attributes.NearVision.RightEye = item.Value;
                        list = $filter("filter")($scope.UnaidedNearPlusList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                $scope.UnaidedNearPlusList = angular.copy($scope.GetNearList());
                                $scope.UnaidedNearMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.NearVision.LeftEye = "";
                                data.Attributes.NearVision.RightEye = "";
                            } else {
                                index = $scope.UnaidedNearPlusList.indexOf(list[0]);
                                $scope.UnaidedNearPlusList = angular.copy($scope.GetNearList());
                                $scope.UnaidedNearMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UnaidedNearPlusList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.UnaidedNearMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                $scope.UnaidedNearPlusList = angular.copy($scope.GetNearList());
                                $scope.UnaidedNearMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.NearVision.LeftEye = "";
                                data.Attributes.NearVision.RightEye = "";
                            } else {
                                index = $scope.UnaidedNearMinusList.indexOf(mlist[0]);
                                $scope.UnaidedNearPlusList = angular.copy($scope.GetNearList());
                                $scope.UnaidedNearMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UnaidedNearMinusList[index].selected = true;
                            }
                        }
                    }

                    $scope.SelectedInvestigation = data;
                }
            }
            if (data.InvestigationId === 13) {
                if (data.Attributes != undefined) {
                    if (type === 'Pinhole') {
                        //$scope.BBSphericalList = angular.copy($scope.GetSphericalPlusList());
                        //$scope.BBSphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                        data.Attributes.LeftEye = item.Value;
                        data.Attributes.RightEye = item.Value;
                        list = $filter("filter")($scope.PinholePlusList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            //list[0].selected = ind;
                            if (list[0].selected) {
                                //$scope.PinholePlusList = angular.copy($scope.GetUcvaList());
                                $scope.PinholePlusList = angular.copy($scope.GetDistanceList());
                                $scope.PinholeMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.LeftEye = "";
                                data.Attributes.RightEye = "";
                            } else {
                                index = $scope.PinholePlusList.indexOf(list[0]);
                                //$scope.PinholePlusList = angular.copy($scope.GetUcvaList());
                                $scope.PinholePlusList = angular.copy($scope.GetDistanceList());
                                $scope.PinholeMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.PinholePlusList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.PinholeMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            //mlist[0].selected = ind;
                            if (mlist[0].selected) {
                                // $scope.PinholePlusList = angular.copy($scope.GetUcvaList());
                                $scope.PinholePlusList = angular.copy($scope.GetDistanceList());
                                $scope.PinholeMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.Attributes.LeftEye = "";
                                data.Attributes.RightEye = "";
                            } else {
                                index = $scope.PinholeMinusList.indexOf(mlist[0]);
                                //$scope.PinholePlusList = angular.copy($scope.GetUcvaList());
                                $scope.PinholePlusList = angular.copy($scope.GetDistanceList());
                                $scope.PinholeMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.PinholeMinusList[index].selected = true;
                            }
                        }
                    }


                    $scope.SelectedInvestigation = data;
                }
            }
            if (data.InvestigationId === 43 || data.InvestigationId === 44) {
              
                    if (type === 'UCVA') {
                        data.RightEyeValues.UVa = item.Value;
                        data.LeftEyeValues.UVa = item.Value;
                        list = $filter("filter")($scope.UcvaList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.RightEyeValues.UVa = "";
                                data.LeftEyeValues.UVa = "";
                            } else {
                                index = $scope.UcvaList.indexOf(list[0]);
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UcvaList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.UcvaMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            if (mlist[0].selected) {
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.RightEyeValues.UVa = "";
                                data.LeftEyeValues.UVa = "";
                            } else {
                                index = $scope.UcvaMinusList.indexOf(mlist[0]);
                                $scope.UcvaList = angular.copy($scope.GetUcvaList());
                                $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.UcvaMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Sph') {
                        data.RightEyeValues.Spherical = item.Value;
                        data.LeftEyeValues.Spherical = item.Value;
                        list = $filter("filter")($scope.SphericalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.RightEyeValues.Spherical = "";
                                data.LeftEyeValues.Spherical = "";
                            } else {
                                index = $scope.SphericalList.indexOf(list[0]);
                                $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.SphericalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.SphericalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            if (mlist[0].selected) {
                                $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                data.RightEyeValues.Spherical = "";
                                data.LeftEyeValues.Spherical = "";
                            } else {
                                index = $scope.SphericalMinusList.indexOf(mlist[0]);
                                $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
                                $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
                                $scope.SphericalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Cyl') {
                        data.RightEyeValues.Cylindrical = item.Value;
                        data.LeftEyeValues.Cylindrical = item.Value;
                        list = $filter("filter")($scope.CylindricalList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.RightEyeValues.Cylindrical = "";
                                data.LeftEyeValues.Cylindrical = "";
                            } else {
                                index = $scope.CylindricalList.indexOf(list[0]);
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.CylindricalList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.CylindricalMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            if (mlist[0].selected) {
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                data.RightEyeValues.Cylindrical = "";
                                data.LeftEyeValues.Cylindrical = "";
                            } else {
                                index = $scope.CylindricalMinusList.indexOf(mlist[0]);
                                $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
                                $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
                                $scope.CylindricalMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Axis') {

                        data.RightEyeValues.Axis = item.Value;
                        data.LeftEyeValues.Axis = item.Value;
                        list = $filter("filter")($scope.AxisList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.RightEyeValues.Axis = "";
                                data.LeftEyeValues.LAxis = "";
                            } else {
                                index = $scope.AxisList.indexOf(list[0]);
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.AxisList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.AxisMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            if (mlist[0].selected) {
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                data.RightEyeValues.Axis = "";
                                data.LeftEyeValues.LAxis = "";
                            } else {
                                index = $scope.AxisMinusList.indexOf(mlist[0]);
                                $scope.AxisList = angular.copy($scope.GetAxisList());
                                $scope.AxisMinusList = angular.copy($scope.GetAxisMinusList());
                                $scope.AxisMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'Add') {

                        data.RightEyeValues.Adition = item.Value;
                        data.LeftEyeValues.Adition = item.Value;
                        list = $filter("filter")($scope.RefAddList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                data.RightEyeValues.Adition = "";
                                data.LeftEyeValues.Adition = "";
                            } else {
                                index = $scope.RefAddList.indexOf(list[0]);
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.RefAddList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.RefAddMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            if (mlist[0].selected) {
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                data.RightEyeValues.Adition = "";
                                data.LeftEyeValues.Adition = "";
                            } else {
                                index = $scope.AxisMinusList.indexOf(mlist[0]);
                                $scope.RefAddList = angular.copy($scope.GetAddList());
                                $scope.RefAddMinusList = angular.copy($scope.GetAddMinusList());
                                $scope.RefAddMinusList[index].selected = true;
                            }
                        }
                    }
                    if (type === 'BCVA') {
                        data.RightEyeValues.BCVA = item.Value;
                        data.LeftEyeValues.BCVA = item.Value;
                        list = $filter("filter")($scope.refBcvaList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.refBcvaList = angular.copy($scope.GetUcvaList());
                                $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.RightEyeValues.BCVA = "";
                                data.LeftEyeValues.BCVA = "";
                            } else {
                                index = $scope.refBcvaList.indexOf(list[0]);
                                $scope.refBcvaList = angular.copy($scope.GetUcvaList());
                                $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcvaList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.refBcvaMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            if (mlist[0].selected) {
                                $scope.refBcvaList = angular.copy($scope.GetUcvaList());
                                $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                data.RightEyeValues.BCVA = "";
                                data.LeftEyeValues.BCVA = "";
                            } else {
                                index = $scope.refBcvaMinusList.indexOf(mlist[0]);
                                $scope.refBcvaList = angular.copy($scope.GetUcvaList());
                                $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
                                $scope.refBcvaMinusList[index].selected = true;
                            }
                        }
                    }

                    if (type === 'BCNVA') {
                        data.RightEyeValues.BCNVA = item.Value;
                        data.LeftEyeValues.BCNVA = item.Value;
                        list = $filter("filter")($scope.refBcnvaList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                                data.RightEyeValues.BCNVA = "";
                                data.LeftEyeValues.BCNVA = "";
                            } else {
                                index = $scope.refBcvaList.indexOf(list[0]);
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                                $scope.refBcnvaList[index].selected = true;
                            }
                        }
                        mlist = $filter("filter")($scope.refBcnvaMinusList, { "Value": item.Value }, true);
                        if (mlist.length > 0) {
                            if (mlist[0].selected) {
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                                data.RightEyeValues.BCNVA = "";
                                data.LeftEyeValues.BCNVA = "";
                            } else {
                                index = $scope.refBcnvaMinusList.indexOf(mlist[0]);
                                $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
                               
                                $scope.refBcnvaMinusList[index].selected = true;
                            }
                        }
                    }

                    if (type === 'Prism') {
                        data.RightEyeValues.Prism = item.Value;
                        data.LeftEyeValues.Prism = item.Value;
                        list = $filter("filter")($scope.PrismList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.PrismList = angular.copy($scope.GetPrismList());
                                data.RightEyeValues.Prism = "";
                                data.LeftEyeValues.Prism = "";
                            } else {
                                index = $scope.PrismList.indexOf(list[0]);
                                $scope.PrismList = angular.copy($scope.GetPrismList());
                                $scope.PrismList[index].selected = true;
                            }
                        }
                    }

                    if (type === 'BASE') {
                        data.RightEyeValues.Base = item.Value;
                        data.LeftEyeValues.Base = item.Value;
                        list = $filter("filter")($scope.BaseList, { "Value": item.Value }, true);
                        if (list.length > 0) {
                            if (list[0].selected) {
                                $scope.BaseList = angular.copy($scope.GetBaseList());
                                data.RightEyeValues.Base = "";
                                data.LeftEyeValues.Base = "";
                            } else {
                                index = $scope.BaseList.indexOf(list[0]);
                                $scope.BaseList = angular.copy($scope.GetBaseList());
                                $scope.BaseList[index].selected = true;
                            }
                        }
                    }
                    $scope.SelectedInvestigation = data;
                
            }
        }
        if (data.InvestigationId === 1 || data.InvestigationId === 2 || data.InvestigationId === 3 || data.InvestigationId === 8) {
            var ind = $scope.SelectedInvestigationIdArray.findIndex(x => x === $scope.SelectedInvestigation.InvestigationId);
            if (ind === -1) {
                $scope.SelectedInvestigationIdArray.push($scope.SelectedInvestigation.InvestigationId);
            }
        } else if (data.InvestigationId === 5) {
            var ind = $scope.SelectedInvestigationIdArray.findIndex(x => x === $scope.SelectedaidedInvestigation.InvestigationId);
            if (ind === -1) {
                $scope.SelectedInvestigationIdArray.push($scope.SelectedaidedInvestigation.InvestigationId);
            }
        } else if (data.InvestigationId === 4) {
            var ind = $scope.SelectedInvestigationIdArray.findIndex(x => x === $scope.SelectedunaidedInvestigation.InvestigationId);
            if (ind === -1) {
                $scope.SelectedInvestigationIdArray.push($scope.SelectedunaidedInvestigation.InvestigationId);
            }
        } else if (data.InvestigationId === 13) {
            var ind = $scope.SelectedInvestigationIdArray.findIndex(x => x === $scope.SelectedpinholeInvestigation.InvestigationId);
            if (ind === -1) {
                $scope.SelectedInvestigationIdArray.push($scope.SelectedpinholeInvestigation.InvestigationId);
            }
        }
        if (data.InvestigationId === 43 || data.InvestigationId === 44) {
            var ind = $scope.SelectedInvestigationIdArray.findIndex(x => x === $scope.SelectedInvestigation.InvestigationId);
            if (ind === -1) {
                $scope.SelectedInvestigationIdArray.push($scope.SelectedInvestigation.InvestigationId);
            }
        }
    }

    $scope.SaveVision = function (item, mitem) {
        $scope.cacheStorageItem.visions = item;
        //angular.forEach($scope.cacheStorageItem.InvGlasses, function (litem) {
        //    if (litem.InvestigationId == mitem.InvestigationId) {
        //        litem.Attributes = mitem.Attributes;
        //    }
        //});
        angular.forEach($scope.cacheStorageItem.GlassDetails, function (litem) {
            if (litem.InvestigationId == mitem.InvestigationId) {
                litem.RightEyeValues = mitem.RightEyeValues;
                litem.LeftEyeValues = mitem.LeftEyeValues;
            }
        });

        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        //$uibModalInstance.close();
        $scope.cancel("Ok");
    };
    $scope.CancelVision = function () {
        $scope.cancel("Ok");
    };
    $scope.ChangeTab = function (type, item) {
        $scope.SelectedEye = 1;
        var list = $filter("filter")(item, { "InvestigationId": type }, true)[0];
        if (type == 5) {
            var list1 = $filter("filter")(item, { "InvestigationId": 4 }, true)[0];
            list1.IsInvestigationChecked = true;
            var list2 = $filter("filter")(item, { "InvestigationId": 5 }, true)[0];
            list2.IsInvestigationChecked = true;
            var list3 = $filter("filter")(item, { "InvestigationId": 13 }, true)[0];
            list3.IsInvestigationChecked = true;
            $scope.SelectedunaidedInvestigation = list1;
            $scope.SelectedaidedInvestigation = list2;
            $scope.SelectedpinholeInvestigation = list3;
        }
        list.IsInvestigationChecked = true;
        $scope.SelectedInvestigation = list;
        $scope.GetSelectedList();
    }
    $scope.ChangeText = function (inv, Value, type) {
        if (type == 'AidedDistance') {
            if ($scope.SelectedEye === 1) {
                inv.Attributes.distanceVision.RightEye = Value;
            }
            if ($scope.SelectedEye === 2) {
                inv.Attributes.distanceVision.LeftEye = Value;
            }
            if ($scope.SelectedEye === 3) {
                iinv.Attributes.distanceVision.RightEye = Value;
                inv.Attributes.distanceVision.LeftEye = Value;
            }

            $scope.DistanceMinusList = angular.copy($scope.GetUcvaMinusList());
            //$scope.DistancePlusList = angular.copy($scope.GetUcvaList());
            $scope.DistancePlusList = angular.copy($scope.GetDistanceList());
        }
        if (type == 'UnAidedDistance') {
            if ($scope.SelectedEye === 1) {
                inv.Attributes.distanceVision.RightEye = Value;
            }
            if ($scope.SelectedEye === 2) {
                inv.Attributes.distanceVision.LeftEye = Value;
            }
            if ($scope.SelectedEye === 3) {
                iinv.Attributes.distanceVision.RightEye = Value;
                inv.Attributes.distanceVision.LeftEye = Value;
            }

            $scope.UnaidedDistanceMinusList = angular.copy($scope.GetUcvaMinusList());
            //$scope.UnaidedDistancePlusList = angular.copy($scope.GetUcvaList());
            $scope.UnaidedDistancePlusList = angular.copy($scope.GetDistanceList());
        }


        if (type == 'AidedNear') {
            if ($scope.SelectedEye === 1) {
                inv.Attributes.NearVision.RightEye = Value;
            }
            if ($scope.SelectedEye === 2) {
                inv.Attributes.NearVision.LeftEye = Value;
            }
            if ($scope.SelectedEye === 3) {
                iinv.Attributes.NearVision.RightEye = Value;
                inv.Attributes.NearVision.LeftEye = Value;
            }

            $scope.NearMinusList = angular.copy($scope.GetUcvaMinusList());


            $scope.NearPlusList = angular.copy($scope.GetNearList());

        }
        if (type == 'UnAidedNear') {
            if ($scope.SelectedEye === 1) {
                inv.Attributes.NearVision.RightEye = Value;
            }
            if ($scope.SelectedEye === 2) {
                inv.Attributes.NearVision.LeftEye = Value;
            }
            if ($scope.SelectedEye === 3) {
                iinv.Attributes.NearVision.RightEye = Value;
                inv.Attributes.NearVision.LeftEye = Value;
            }
            $scope.UnaidedNearMinusList = angular.copy($scope.GetUcvaMinusList());

            $scope.UnaidedNearPlusList = angular.copy($scope.GetNearList());


        }
        if (type == 'Pinhole') {
            if ($scope.SelectedEye === 1) {
                inv.Attributes.RightEye = Value;
            }
            if ($scope.SelectedEye === 2) {
                inv.Attributes.LeftEye = Value;
            }
            if ($scope.SelectedEye === 3) {
                iinv.Attributes.RightEye = Value;
                inv.Attributes.LeftEye = Value;
            }
            $scope.PinholeMinusList = angular.copy($scope.GetUcvaMinusList());
            // $scope.PinholePlusList = angular.copy($scope.GetUcvaList());
            $scope.PinholePlusList = angular.copy($scope.GetDistanceList());
        }

    }


    $scope.ClearSelectedInvestigation = function (item) {
        if (item.InvestigationId == 43) {

            item.RightEyeValues.UVa = "";
            item.RightEyeValues.Spherical = "";
            item.RightEyeValues.Cylindrical = "";
            item.RightEyeValues.Axis = "";
            item.RightEyeValues.BCVA = "";
            item.RightEyeValues.Adition = "";
            item.RightEyeValues.BCNVA = "";
            item.RightEyeValues.Prism = "";
            item.RightEyeValues.Base = "";


            item.LeftEyeValues.UVa = "";
            item.LeftEyeValues.Spherical = "";
            item.LeftEyeValues.Cylindrical = "";
            item.LeftEyeValues.Axis = "";
            item.LeftEyeValues.BCVA = "";
            item.LeftEyeValues.Adition = "";
            item.LeftEyeValues.BCNVA = "";
            item.LeftEyeValues.Prism = "";
            item.LeftEyeValues.Base = "";



            $scope.UcvaList = angular.copy($scope.GetUcvaList());
            $scope.UcvaMinusList = angular.copy($scope.GetUcvaMinusList());
            $scope.SphericalList = angular.copy($scope.GetSphericalPlusList());
            $scope.SphericalMinusList = angular.copy($scope.GetSphericalMinusList());
            $scope.CylindricalList = angular.copy($scope.GetCylindricalList());
            $scope.CylindricalMinusList = angular.copy($scope.GetCylMinusList());
            $scope.AxisList = angular.copy($scope.GetAxisList());
            $scope.RefAddList = angular.copy($scope.GetAddList());
            $scope.refBcvaList = angular.copy($scope.GetRefBcvaList());
            $scope.refBcnvaList = angular.copy($scope.GetBcnvaList());
            $scope.refBcvaMinusList = angular.copy($scope.GetUcvaMinusList());
            $scope.refBcnvaMinusList = angular.copy($scope.GetUcvaMinusList());
            $scope.PrismList = angular.copy($scope.GetPrismList());
            $scope.BaseList = angular.copy($scope.GetBaseList());





        }
    }



}]);
"use strict";
eHnoteWebApp.controller("UsInventoryParentCtrl", ["$scope", "eHnoteMasterDataService", "InventoryService", "HInventoryService", "alertify", "$uibModal", "eHnoteUserAppointmentDataService", "localStorageFactory", "eHnoteSurgeryService", "$q", "$filter", "$rootScope", function ($scope, eHnoteMasterDataService, InventoryService, HInventoryService, alertify, $uibModal, eHnoteUserAppointmentDataService, localStorageFactory, eHnoteSurgeryService, $q, $filter, $rootScope) {
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    var hospid = null;
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined &&
        doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.LanguageIndicator = doctorinfo.doctordata.UserAddress[0].IsLanguageInd;
    }
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
   
    $scope.SearchObj = {
        "SearchTextValue": ""
    }

    $scope.TabsObj = {
        "selectedTab": 1
    }
    $scope.IOLOrganizationId = null;
    $scope.OnSelectTab = function (val) {
        $scope.TabsObj.selectedTab = val;
    }
 
    function getnewInventoryObj() {
        var obj = {
            "ItemMasterId": null,
            "UserId": doctorinfo.doctorid,
            "ParentOrganizationId": $scope.ParentHospitalId,
            "OrganizationId": hospid,
            "OrganizationItemId": 0,
            "CategoryId": 7,
            "SubCategoryId": null,
            "ProductName": "",
            "ModelName":"",
            "ChildMasterId": 0,
            "ProductId": 0,
            "TypeOfLens": null,
            "Manufacturer": null,
            "ManufacturingDate": null,
            "IolModelId": null,
            "IolOpticId": null,
            "IolLengthId": null,
            "IolAConstId": null,
            "IsEdit": false,
            "DeleteInd": "N",
            "SerialNo": "",
            "Power": "",
            "ImplantName": "",
            "Location": doctorinfo.hospitalID || 0,
            "StatusId": 4,
            "StatusName": "Available",
            "ShippingDate": null,
        };

        return obj;
    }
    $scope.addNewInvenetoryObj = getnewInventoryObj();

    function getnewIOLInventoryObj() {
        var obj = {
            "SerialNumberSearch": '',
            "Manufacturer": null,
            "Locationid": doctorinfo.hospitalID || 0,
            "PowerRange": '',
            "PageNumber": 1,
            "PageSize": 100,
        };
        return obj;
    }
    $scope.NewIOLInventory = getnewIOLInventoryObj();

    

    $scope.IOLStatusObj = {
        "SelectStatusString": "Select Status",
        "Name": "",
        "AllStatusCheck": true
    };
    $scope.IOLLocationObj = {
        "SelectString": "Selected Location",
        "Name": "",
        "AllCheck": false
    };

    $scope.AddUpdateIOLInventoryProduct = function () {
        if ($scope.addNewInvenetoryObj.ProductName === "") {
            alertify.error("Enter Product Name");
            return;
        };

        $scope.addNewInvenetoryObj.SubCategoryId = $scope.addNewInvenetoryObj.SubCategoryId || null;
        if ($scope.addNewInvenetoryObj.SubCategoryId === null) {
            alertify.error("Select SubCategory");
            return;
        };

        $scope.addNewInvenetoryObj.ModelName = $scope.addNewInvenetoryObj.ModelName || '';
        if ($scope.addNewInvenetoryObj.ModelName === "") {
            alertify.error("Enter Model No");
            return;
        };

        HInventoryService.AddUpdateInventoryOrganizationItem($scope.addNewInvenetoryObj).then(function (resp) {
            if (resp.data.Status === "Success") {
                if ($scope.addNewInvenetoryObj.IsEdit == true) {
                    alertify.success("Product Updated");
                } else {
                    alertify.success("Product Added");
                }
                $scope.SearchObj.SearchTextValue = "";
                $scope.getIOLInventoryProducts();
                $scope.addNewInvenetoryObj = getnewInventoryObj();
            } else {
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            console.log(err);
            alertify.error("Product Adding failed");
        });
    };

    $scope.getIOLInventoryProducts = function () {
        
        var params = {
            "PatientName": '',
            "MRNumber":  null,
            "HospitalId": 3,
            "Manufacture":  "",
            "PageNumber":  1,
            "PageSize":  10,
            "Power":  10,
            "StatusName":  '',
        }
        HInventoryService.getIOLInventoryProducts(params).then(function (resp) {
            if (resp.data.Status == "Success") {
                $scope.GetIOLInventoryArrayList = [];
                $scope.GetIOLInventoryArrayList = resp.data.rows;
            }
            else if (resp.data.Status == "Failure") {
                alertify.error("Data Updating Failed");
            }
        });
    };

    function InitializeBranches(data, pagetype) {
        var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.APPListAllBranchesAppointments, data, doctorinfo) || [];
        
        $scope.BranchesListArray = clinicAddress;
        if ($scope.BranchesListArray.length > 0) {
            angular.forEach($scope.BranchesListArray, function (item) {
                item.IsChecked = false;
                if (item.BranchId == doctorinfo.hospitalID) {
                    item.IsChecked = true;
                }
            });
        }
    }

    $scope.getIOLInventoryData = function () {

        var IOLStatusNames = $scope.IOLStatusArray
            .filter(pitem => pitem.IsChecked)
            .map(pitem => pitem.Name)
            .join(",");

        var HospitalIds = $scope.BranchesListArray
            .filter(pitem => pitem.IsChecked)
            .map(pitem => pitem.ClinicId)
            .join(",");

        HospitalIds = HospitalIds || '';
        if (HospitalIds == '') {
            alertify.error('Please Select Any Branch');
            return false;
        }

        var params = {
            "SerialNumber": $scope.NewIOLInventory.SerialNumberSearch||'',
            "HospitalId": HospitalIds,
            "Manufacture": $scope.NewIOLInventory.Manufacturer || '',
            "StatusName": IOLStatusNames,
            "PageNumber": $scope.NewIOLInventory.PageNumber || 1,
            "PageSize": $scope.NewIOLInventory.PageSize || 100
        }
        HInventoryService.getIOLInventoryData(params).then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.getIOLInventoryArray = resp.data.rows || [];
                $scope.IOLInventoryArrayCount = resp.data.count || 0;
            }
            else if (resp.data.status == "Failure") {
                alertify.error("Data Updating Failed");
            }
        });
    };

    $scope.init = function () {
        var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
        InitializeBranches(NewBranchList, "PageLoad");
        
        //$scope.getIOLInventoryProducts();
        
        var params = {
            "ParentOrganizationId": $scope.ParentHospitalId
        }
        $q.all([
            HInventoryService.GetInventoryMasterIOLData(params),
        ]).then(function (resp) {
            if (resp[0] != undefined) {
                $scope.GetIolAConsts = [];
                $scope.GetIolOptics = [];
                $scope.GetIolModels = [];
                $scope.GetIolLengths = [];
                $scope.GetIolTypes = [];
                $scope.GetIolTypeOfLens = [];
                $scope.GetIolManufacturers = [];
                $scope.GetIolSubCategory = [];
                $scope.GetIolAConsts = resp[0].data.AConstants;
                $scope.GetIolOptics = resp[0].data.Opticdiameters;
                $scope.GetIolModels = resp[0].data.HospitalModels;
                $scope.GetIolLengths = resp[0].data.AxialLengths;
                $scope.GetIolManufacturers = resp[0].data.Manufacturers;
                if ($scope.GetIolManufacturers.length > 0) {
                    angular.forEach($scope.GetIolManufacturers, function (item) {
                        item.IsChecked = true;
                    });
                }

                $scope.GetIolTypes = resp[0].data.IOLTypes;
                $scope.GetIolTypeOfLens = resp[0].data.TypesofLens;
                $scope.GetIolSubCategory = resp[0].data.Subcategory;
                $scope.DiopterArray = resp[0].data.DiopterArray || [];

                $scope.IOLStatusArray = resp[0].data.IOLStatusArray || [];
                if ($scope.IOLStatusArray.length > 0) {
                    angular.forEach($scope.IOLStatusArray, function (item) {
                        item.IsChecked = true;
                    });
                }

                $scope.getIOLInventoryData();
            }
        });
    }

    $scope.init();


    $scope.editIOLInventoryProducts = function (item) {
        $scope.addNewInvenetoryObj.IsEdit = true;
        $scope.addNewInvenetoryObj.SerialNo = item.SerialNo;
        $scope.addNewInvenetoryObj.ItemMasterId = item.ItemMasterId || 0;
        $scope.addNewInvenetoryObj.BarCodeDetailId = item.BarCodeDetailId || 0;
        $scope.addNewInvenetoryObj.BarCodeId = item.BarCodeId;
        $scope.addNewInvenetoryObj.StockDetailId = item.StockDetailId;
        $scope.addNewInvenetoryObj.OrganizationItemId = item.OrganizationItemId;
        $scope.addNewInvenetoryObj.ChildMasterId = item.ChildMasterId;
        $scope.addNewInvenetoryObj.ManufacturerId = item.ManufacturerId;
        $scope.addNewInvenetoryObj.ModelNumber = item.ModelName;
        $scope.addNewInvenetoryObj.IolOpticId = item.IOLOpticId;
        $scope.addNewInvenetoryObj.IolLengthId = item.IOLLengthId;
        $scope.addNewInvenetoryObj.IolAConstId = item.IOLAConstantId;
        $scope.addNewInvenetoryObj.SubCategoryId = item.SubCategoryId;
        $scope.addNewInvenetoryObj.TypeOfLens = item.LensId;
        $scope.addNewInvenetoryObj.ProductName = item.ProductName;
        $scope.addNewInvenetoryObj.DipoterId = item.DipoterId;
        $scope.addNewInvenetoryObj.ImplantName = item.ImplantName;
        $scope.addNewInvenetoryObj.ManufacturingDate = $filter('date')(new Date(item.ManufacturingDate), "MM-dd-yyyy");
        $scope.addNewInvenetoryObj.ShippingDate = $filter('date')(new Date(item.ShippingDate), "MM-dd-yyyy");
        $scope.addNewInvenetoryObj.StatusId = item.StatusId;
        $scope.addNewInvenetoryObj.Location = item.OrganizationId;

        $scope.AddIolUibPopup();
    }

    $scope.deleteIOLInventoryProduct = function (item) {
        var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
            
            let req = {
                "ItemMasterId": item.ItemMasterId,
                "UserId": doctorinfo.doctorid,
                "OrganizationId": item.OrganizationId,
                "ParentOrganizationId": item.ParentOrganizationId,
                "ChildMasterId": item.ChildMasterId || null,
                "OrganizationItemId": item.OrganizationItemId || null,
                "SerialNumber": item.SerialNo || "",
                "CategoryId": 7,
                "SubCategoryId": 3,
                "ItemName": item.ImplantName,
                "LensTypeId": item.LensId,
                "ManufacturerId": item.ManufacturerId || null,
                "IolModelId": item.ModelId || null,
                "DipoterId": item.DipoterId || null,
                "BatchNumber": item.SerialNo || "",
                "ModelNumber": item.ModelName || "",
                "ManufacturingDate": item.ManufacturingDate || null,
                "ShippingDate": item.ShippingDate || null,
                "BarCodeDetailId": item.BarCodeDetailId,
                "BarCodeId": item.BarCodeId,
                "StockDetailId": item.StockDetailId,
                "DeleteInd": "Y",
                "StatusId": 5,
                "StatusName": "Delete",
                "Remarks": '',
            };

            eHnoteSurgeryService.AddUpdateIolOrganizationItem(req).then(function (resp) {

                if (resp.data.Status == "Success") {
                    alertify.success("Deleted Successfully");
                    $scope.getIOLInventoryData();
                } else {
                    alertify.error("Add IOl service failed!");
                    return;
                }


            }, function (err) {

            });

        }, function () {
            return;
        });
    }

    $scope.ClearIOLData = function () {
        $scope.addNewInvenetoryObj = getnewInventoryObj();
    }

    $scope.AddIolUibPopup = function () {
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "AddIolUibPopup.html",
            //"size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            "windowClass": "right-to-left-modal offcanves-right modal__width--30",
            "controller": function ($scope, $uibModal, $uibModalInstance) {
                if (!$scope.addNewInvenetoryObj.IsEdit) {
                    $scope.addNewInvenetoryObj = getnewInventoryObj();
                }

                $scope.uibclose = function () {
                    //$uibModalInstance.dismiss("cancel");
                    $uibModalInstance.close();
                };

                $scope.AddNewIOLOrganizationItem = function () {
                    if ($scope.addNewInvenetoryObj.SerialNo == "") {
                        alertify.error("Please add serial number!");
                        return;
                    }

                    $scope.addNewInvenetoryObj.ModelNumber = $scope.addNewInvenetoryObj.ModelNumber || "";
                    if ($scope.addNewInvenetoryObj.ModelNumber == "") {
                        alertify.error("Please add model number!");
                        return;
                    }

                    $scope.addNewInvenetoryObj.TypeOfLens = $scope.addNewInvenetoryObj.TypeOfLens || null;
                    if ($scope.addNewInvenetoryObj.TypeOfLens == null) {
                        alertify.error("Please select Lens type!");
                        return;
                    }

                    $scope.addNewInvenetoryObj.ManufacturerId = $scope.addNewInvenetoryObj.ManufacturerId || null;
                    if ($scope.addNewInvenetoryObj.ManufacturerId == null) {
                        alertify.error("Please select manufacturer!");
                        return;
                    }

                    $scope.addNewInvenetoryObj.DipoterId = $scope.addNewInvenetoryObj.DipoterId || null;
                    if ($scope.addNewInvenetoryObj.DipoterId == null) {
                        alertify.error("Please select power!");
                        return;
                    }

                    if ($scope.addNewInvenetoryObj.ImplantName == "") {
                        alertify.error("Please add implant name!");
                        return;
                    }

                    $scope.addNewInvenetoryObj.StatusId = $scope.addNewInvenetoryObj.StatusId || null;
                    if ($scope.addNewInvenetoryObj.StatusId == null) {
                        alertify.error("Please select status!");
                        return;
                    }

                    let req = {
                        "ItemMasterId": $scope.addNewInvenetoryObj.ItemMasterId || 0,
                        "BarCodeDetailId": $scope.addNewInvenetoryObj.BarCodeDetailId || 0,
                        "BarCodeId": $scope.addNewInvenetoryObj.BarCodeId || 0,
                        "StockDetailId": $scope.addNewInvenetoryObj.StockDetailId || 0,
                        "UserId": doctorinfo.doctorid,
                        "OrganizationId": $scope.addNewInvenetoryObj.Location,
                        "ParentOrganizationId": $scope.ParenthospitalId,
                        "ChildMasterId": $scope.addNewInvenetoryObj.ChildMasterId || null,
                        "OrganizationItemId": $scope.addNewInvenetoryObj.OrganizationItemId || null,
                        "SerialNumber": $scope.addNewInvenetoryObj.SerialNo || "",
                        "CategoryId": 7,
                        "SubCategoryId": 3,
                        "ItemName": $scope.addNewInvenetoryObj.ImplantName,
                        "LensTypeId": $scope.addNewInvenetoryObj.TypeOfLens,
                        "ManufacturerId": $scope.addNewInvenetoryObj.ManufacturerId || null,
                        "StatusId": $scope.addNewInvenetoryObj.StatusId || null,
                        "StatusName": $scope.addNewInvenetoryObj.StatusName || null,
                        "IolModelId": $scope.addNewInvenetoryObj.ModelId || null,
                        "DipoterId": $scope.addNewInvenetoryObj.DipoterId || null,
                        "BatchNumber": $scope.addNewInvenetoryObj.BatchNumber || "",
                        "DeleteInd": "N",
                        "ModelNumber": $scope.addNewInvenetoryObj.ModelNumber || "",
                        "ManufacturingDate": $scope.addNewInvenetoryObj.ManufacturingDate || null,
                        "Location": $scope.addNewInvenetoryObj.OrganizationId || null,
                        "ShippingDate": $scope.addNewInvenetoryObj.ShippingDate || null
                    };

                    eHnoteSurgeryService.AddUpdateIolOrganizationItem(req).then(function (resp) {

                        if (resp.data.Status == "Success") {
                            alertify.success("Add IOl Successfully");
                            $scope.uibclose();
                        } else if (resp.data.Status == "Failure") {
                            alertify.error(resp.data.Message);
                        } else {
                            alertify.error("Add IOl service failed!");
                            return;
                        }


                    }, function (err) {

                    });

                };
            }
        });
        mInstanceAdd.result.then(function (resp) {
            $scope.addNewInvenetoryObj = getnewInventoryObj();
            $scope.getIOLInventoryData();
        }, function (cancel) {
        });
    };

    $scope.UploadIolUibPopup = function () {
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "UploadIolUibPopup.html",
            //"size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            "windowClass": "offcanves-right modal__width--30",
            "controller": function ($scope, $uibModal, $uibModalInstance) {
                $scope.uibclose = function () {
                    $uibModalInstance.close();
                };

                
                $scope.onFileSelectConsent = function ($files) {
                    if ($files.length > 0) {
                        let UserId = eHnoteMasterDataService.getLoginId();
                        if ($scope.IOLOrganizationId == null) {
                            alertify.error("Please Select Branch");
                            return false;
                        }
                        var formData = new FormData();
                        formData.append("file", $files[0]);
                        formData.append("UserId", UserId);
                        formData.append("OrganizationId", $scope.IOLOrganizationId);
                        formData.append("ParentOrganizationId", $scope.ParentHospitalId);
                        formData.append("AllHospitalIndicator", 0);
                        if ($files.length > 0) {
                            eHnoteSurgeryService.UploadExcelIOLInfo(formData).then(function (resp) {
                                if (resp.data.Status == "Success") {
                                    if (resp.data.InsertedCount > 0) {
                                        alertify.success("IOL successfully uploaded a total of " + resp.data.InsertedCount + " IOL");
                                    }
                                    if (resp.data.AlreadyExistsCount > 0) {
                                        if (resp.data.InsertedCount > 0) {
                                            setTimeout(function () {
                                                alertify.error("Failed to upload IOL due to duplicate records." + resp.data.InsertedCount + " records were found.");
                                            }, 2000);
                                        } else {
                                            alertify.error("Failed to upload IOL due to duplicate records." + resp.data.InsertedCount + " records were found.");
                                        }
                                    }
                                    if ($scope.mIOLInstancepoup) {
                                        $scope.mIOLInstancepoup.dismiss("cancel");
                                    }

                                }
                                if (resp.data.Status === 2) {
                                    alertify.error(resp.data.Message, "", 20);
                                }
                                if (resp.data.Status == 'Failure') {
                                    alertify.error(resp.data.Message);
                                }
                                $scope.uibclose();
                            }, function (err) {
                                console.log(err);
                                alertify.error(err.data.ExceptionMessage);
                            });
                        }
                    }
                }
                $scope.IOLOrganizationId = doctorinfo.hospitalID;
                $scope.selectBranch = function (IOLOrganizationId) {
                    $scope.IOLOrganizationId = IOLOrganizationId;
                }
            }
        });
        mInstanceAdd.result.then(function (resp) {
            $scope.getIOLInventoryData();
        }, function (cancel) {
        });
    };

    $scope.checkAllIOLType = function (val) {
        if (val) {
            angular.forEach($scope.IOLStatusArray, function (item) {
                item.IsChecked = true;
            });

            $scope.IOLStatusObj.SelectStatusString = 'All';
        }
        else {
            angular.forEach($scope.IOLStatusArray, function (item) {
                item.IsChecked = false;
            });

            $scope.IOLStatusObj.SelectStatusString = 'Select Status';
        }

    };
    $scope.IOLTypeToggle = function (obj) {
        var checkedArray = _.where($scope.IOLStatusArray, { IsChecked: true });
        $scope.IOLStatusObj.AllStatusCheck = checkedArray.length > 0 && $scope.IOLStatusArray.length === checkedArray.length ? true : false;
        if ($scope.IOLStatusObj.AllStatusCheck) {
            $scope.IOLStatusObj.SelectStatusString = 'All';
            $scope.IOLStatusObj.AllStatusCheck = true;
        } else {
            $scope.IOLStatusObj.AllStatusCheck = false;
        }

        if (!$scope.IOLStatusObj.AllStatusCheck && checkedArray.length > 0) {
            $scope.IOLStatusObj.SelectStatusString = 'Selected';
        }
    };

    $scope.checkAllLocations = function (val) {
        if (val) {
            angular.forEach($scope.BranchesListArray, function (item) {
                item.IsChecked = true;
            });
            $scope.IOLLocationObj.SelectString = 'All';
        }
        else {
            angular.forEach($scope.BranchesListArray, function (item) {
                item.IsChecked = false;
            });
            $scope.IOLLocationObj.SelectString = 'Select Status';
        }
    };

    $scope.IOLLocationToggle = function () {
        var checkedArray = _.where($scope.BranchesListArray, { IsChecked: true });
        $scope.IOLLocationObj.AllCheck = checkedArray.length > 0 && $scope.BranchesListArray.length === checkedArray.length ? true : false;
        if ($scope.IOLLocationObj.AllCheck) {
            $scope.IOLLocationObj.SelectString = 'All';
            $scope.IOLLocationObj.AllCheck = true;
        } else {
            $scope.IOLLocationObj.AllCheck = false;
        }

        if (!$scope.IOLLocationObj.AllCheck && checkedArray.length > 0) {
            $scope.IOLLocationObj.SelectString = 'Selected';
        }
    };

    $scope.GetIOLDataTemplate = function () {
        eHnoteSurgeryService.GetIOLDataMasterTemplate().then(function (resp) {
            window.open(resp.data, "_blank");
        }, function (err) {
            console.log(err);
        });
    };

    $scope.ChangeIOLPagination = function (pagenumber) {
        $scope.NewIOLInventory.PageNumber = pagenumber;
        $scope.getIOLInventoryData();

    }

    $scope.ReLoadIOLInventory = function () {
        $scope.NewIOLInventory = getnewIOLInventoryObj();
        if ($scope.IOLStatusArray.length > 0) {
            angular.forEach($scope.IOLStatusArray, function (item) {
                item.IsChecked = true;
            });
            $scope.IOLStatusObj.AllStatusCheck = true;
        }
        $scope.IOLTypeToggle();

        if ($scope.BranchesListArray.length > 0) {
            angular.forEach($scope.BranchesListArray, function (item) {
                item.IsChecked = false;
                if (item.BranchId == doctorinfo.hospitalID) {
                    item.IsChecked = true;
                }
            });
            
        }
        $scope.IOLLocationToggle();
        $scope.getIOLInventoryData();
    }

    $scope.ClearSerialNumbersearch = function () {
        $scope.NewIOLInventory.SerialNumberSearch = '';
    }

    var orgMap = {};
    $scope.BranchesListArray.forEach(b => {
        orgMap[String(b.BranchId)] = b.BranchName;
    });

    $scope.setConsumedItem = function (item) {
        $rootScope.Item = item;
    };

    function GenerateIOLReportData(jsonData) {

        let ReportName = "IOL Stock Reports";

        if (!jsonData || jsonData.length === 0) {
            return;
        }

        // -----------------------------
        // GROUP DATA BY OrganizationId
        // -----------------------------
        let groupedData = {};
        jsonData.forEach(item => {
            let orgId = item.OrganizationId || 'Unknown';
            if (!groupedData[orgId]) {
                groupedData[orgId] = [];
            }
            groupedData[orgId].push(item);
        });

        // -----------------------------
        // TABLE & HEADER SETUP
        // -----------------------------
        let Appdata = [{
            'SNO': '',
            'Created Date': '',
            'Serial Number': '',
            'Manufaturer': '',
            'Model': '',
            'Power': '',
            'Status': '',
            'Appt Date': '',
            'Patient': '',
            'Mr.No': '',
            'Procedure': '',
            'Doctor': '',
            'Organ': '',
            'Added by': ''
        }];

        let col = [];
        for (let key in Appdata[0]) {
            col.push(key);
        }

        let table = document.createElement("table");
        table.style = "border: 1px solid #000;";

        let tr = table.insertRow(-1);
        let cell = tr.insertCell(-1);
        cell.colSpan = col.length;
        cell.innerHTML = ReportName;
        cell.style = "border:1px solid #000;text-align:center;font-weight:bold";

        //// Clinic Name
        //tr = table.insertRow(-1);
        //cell = tr.insertCell(-1);
        //cell.colSpan = col.length;
        //cell.innerHTML = doctorinfo.doctordata.UserAddress[0].ClinicName;
        //cell.style = "border:1px solid #000;text-align:center;font-weight:bold";

        // Column Headers
        tr = table.insertRow(-1);
        tr.style = "background:#1e977c;color:#fff;";
        col.forEach(c => {
            let th = document.createElement("th");
            th.innerHTML = c;
            th.style = "border:1px solid #000";
            tr.appendChild(th);
        });

        // ORGANIZATION-WISE LOOP
        for (let orgId in groupedData) {

            // Organization Header Row
            let orgRow = table.insertRow(-1);
            let orgCell = orgRow.insertCell(-1);
            orgCell.colSpan = col.length;
            orgCell.innerHTML +=  (orgMap[orgId] || '');
            orgCell.style = "border:1px solid #000;text-align:center;font-weight:bold";

            let orgData = groupedData[orgId];

            // Data Rows
            for (let i = 0; i < orgData.length; i++) {

                let trData = table.insertRow(-1);
                trData.style = "border:1px solid #000;background:#FFFFE0;font-weight:bold";

                for (let u = 0; u < col.length; u++) {
                    let dcCell = trData.insertCell(-1);

                    if (u === 0) dcCell.innerHTML = i + 1;
                    else if (u === 1) dcCell.innerHTML = $filter('date')(orgData[i].Createddate, 'MM/dd/yyyy');
                    else if (u === 2) dcCell.innerHTML = orgData[i].SerialNo;
                    else if (u === 3) dcCell.innerHTML = orgData[i].Manufacturer;
                    else if (u === 4) dcCell.innerHTML = orgData[i].ModelName;
                    else if (u === 5) dcCell.innerHTML = orgData[i].Power;
                    else if (u === 6) dcCell.innerHTML = orgData[i].StatusName;
                    else if (u === 7) dcCell.innerHTML = orgData[i].AppointmentDate;
                    else if (u === 8) dcCell.innerHTML = orgData[i].PatientName;
                    else if (u === 9) dcCell.innerHTML = orgData[i].MRNO;
                    else if (u === 10) dcCell.innerHTML = orgData[i].ProcedureName;
                    else if (u === 11) dcCell.innerHTML = orgData[i].DoctorName;
                    else if (u === 12) dcCell.innerHTML = orgData[i].OrganName;
                    else if (u === 13) dcCell.innerHTML = orgData[i].AddedByUser;

                    dcCell.style = "border:1px solid #000";
                }
            }
        }

        download(table);
    }


    function download(table) {
        tableToExcel(table, "Sheet 1", "" + "IOL Inventory" + "Report.xls");
    }

    var tableToExcel = (function () {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
            base64 = function (s) {
                return window.btoa(unescape(encodeURIComponent(s)));
            }, format = function (s, c) {
                return s.replace(/{(\w+)}/g, function (m, p) {
                    return c[p];
                });
            };
        return function (table, name, filename) {
            if (!table.nodeType) table = document.getElementById(table);
            var ctx = {
                worksheet: name || 'Worksheet',
                table: table.innerHTML
            };
            var link = document.createElement("a");
            link.href = uri + base64(format(template, ctx));
            link.style = "visibility:hidden";
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    })();

    $scope.returnIOLPopup = function (item, type) {
        let mInstanceAdd = $uibModal.open({
            templateUrl: 'returnIOLPopup.html',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            "scope": $scope,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

                
                $scope.returnIOLObj = angular.copy(item);
                $scope.returnIOLObj.Remarks = '';
                $scope.returnIOLObj.type = type;
                if (type == 'Return') {
                    $scope.returnIOLObj.StatusId = 0;
                    $scope.returnIOLObj.StatusName = '';

                    $scope.returnStatusArray = $scope.IOLStatusArray.filter(function (item) {
                        return [1, 2, 6].includes(item.Id);
                    });
                } else if (type == 'Delete') {
                    $scope.returnIOLObj.StatusId = 5;
                    $scope.returnIOLObj.StatusName = 'Delete';

                    $scope.returnStatusArray = $scope.IOLStatusArray.filter(function (item) {
                        return [5].includes(item.Id);
                    });
                } else { }

                $scope.SaveIolReturn = function () {
                    $scope.returnIOLObj.StatusId = $scope.returnIOLObj.StatusId || 0;
                    if ($scope.returnIOLObj.StatusId == 0) {
                        alertify.error("Please Select Status");
                        return false;
                    }
                    if ($scope.returnIOLObj.Remarks == '') {
                        alertify.error("Please Enter Remarks");
                        return false;
                    }

                    let req = {
                        "ItemMasterId": $scope.returnIOLObj.ItemMasterId,
                        "UserId": doctorinfo.doctorid,
                        "OrganizationId": $scope.returnIOLObj.OrganizationId,
                        "ParentOrganizationId": $scope.returnIOLObj.ParentOrganizationId,
                        "ChildMasterId": $scope.returnIOLObj.ChildMasterId || null,
                        "OrganizationItemId": $scope.returnIOLObj.OrganizationItemId || null,
                        "SerialNumber": $scope.returnIOLObj.SerialNo || "",
                        "CategoryId": 7,
                        "SubCategoryId": 3,
                        "ItemName": $scope.returnIOLObj.ImplantName,
                        "LensTypeId": $scope.returnIOLObj.LensId,
                        "ManufacturerId": $scope.returnIOLObj.ManufacturerId || null,
                        "IolModelId": $scope.returnIOLObj.ModelId || null,
                        "DipoterId": $scope.returnIOLObj.DipoterId || null,
                        "BatchNumber": $scope.returnIOLObj.SerialNo || "",
                        "ModelNumber": $scope.returnIOLObj.ModelName || "",
                        "ManufacturingDate": $scope.returnIOLObj.ManufacturingDate || null,
                        "ShippingDate": $scope.returnIOLObj.ShippingDate || null,
                        "BarCodeDetailId": $scope.returnIOLObj.BarCodeDetailId,
                        "BarCodeId": $scope.returnIOLObj.BarCodeId,
                        "StockDetailId": $scope.returnIOLObj.StockDetailId,
                        "DeleteInd": "N",
                        "StatusId": $scope.returnIOLObj.StatusId,
                        "StatusName": $scope.returnIOLObj.StatusName,
                        "Remarks": $scope.returnIOLObj.Remarks,
                    };

                    eHnoteSurgeryService.AddUpdateIolOrganizationItem(req).then(function (resp) {

                        if (resp.data.Status == "Success") {
                            if ($scope.returnIOLObj.type == 'Delete') {
                                alertify.success("IOL deleted successfully!");
                            } else {
                                alertify.success("IOL status updated successfully!");
                            }
                            $scope.uibIolPopupclose();
                        } else {
                            alertify.error("Add IOl service failed!");
                            return;
                        }


                    }, function (err) {

                    });
                }
                $scope.uibIolPopupclose = function () {
                    $uibModalInstance.close();
                };

                $scope.onStatusChange = function (id) {
                    var StatusInfo = $filter('filter')($scope.returnStatusArray, { 'Id': id }, true);
                    $scope.returnIOLObj.StatusName = StatusInfo[0].Name
                }
                $scope.selectStatus = function (item) {
                    $scope.returnIOLObj.StatusId = item.Id;
                    $scope.onStatusChange(item.Id);
                };
                $scope.getSelectedStatusName = function () {
                    return $scope.returnIOLObj.StatusName;
                };

            }]
        });
        mInstanceAdd.result.then(function (resp) {
            $scope.getIOLInventoryData();
        }, function (cancel) {
        });
    };

    $scope.ExportIOLInventoryData = function () {
        var IOLStatusNames = $scope.IOLStatusArray
            .filter(pitem => pitem.IsChecked)
            .map(pitem => pitem.Name)
            .join(",");

        var HospitalIds = $scope.BranchesListArray
            .filter(pitem => pitem.IsChecked)
            .map(pitem => pitem.ClinicId)
            .join(",");

        HospitalIds = HospitalIds || '';
        if (HospitalIds == '') {
            alertify.error('Please Select Any Branch');
            return false;
        }

        var params = {
            "SerialNumber": $scope.NewIOLInventory.SerialNumberSearch || '',
            "HospitalId": HospitalIds,
            "Manufacture": $scope.NewIOLInventory.Manufacturer || '',
            "StatusName": IOLStatusNames,
        }
        HInventoryService.getExportIOLInventory(params).then(function (resp) {
            if (resp.data.status == "Success") {
                GenerateIOLReportData(resp.data.rows);
            }
            else if (resp.data.status == "Failure") {
                alertify.error("Data Updating Failed");
            }
        });
    }

    
}]);
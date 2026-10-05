(function (window, angular, undefined) {
    'use strict';
    var isDefined = angular.isDefined, isUndefined = angular.isUndefined, isNumber = angular.isNumber, isObject = angular.isObject, isArray = angular.isArray, extend = angular.extend, toJson = angular.toJson;
    var angularLocalStorage = angular.module('LocalStorageModule', []);
    angularLocalStorage.provider('localStorageService', function () {
        this.prefix = 'ls';
        this.storageType = 'localStorage';
        this.cookie = {
            expiry: 30,
            path: '/'
        };
        this.notify = {
            setItem: true,
            removeItem: false
        };
        this.setPrefix = function (prefix) {
            this.prefix = prefix; return this;
        };
        this.setStorageType = function (storageType) {
            this.storageType = storageType; return this;
        };
        this.setStorageCookie = function (exp, path) {
            this.cookie.expiry = exp; this.cookie.path = path; return this;
        };
        this.setStorageCookieDomain = function (domain) {
            this.cookie.domain = domain; return this;
        };
        this.setNotify = function (itemSet, itemRemove) {
            this.notify = { setItem: itemSet, removeItem: itemRemove };
            return this;
        };
        this.$get = ['$rootScope', '$window', '$document', '$parse', function ($rootScope, $window, $document, $parse) {
            var self = this; var prefix = self.prefix;
            var cookie = self.cookie;
            var notify = self.notify;
            var storageType = self.storageType;
            var webStorage;
            if (!$document) {
                $document = document;
            } else if ($document[0]) {
                $document = $document[0];
            }
            if (prefix.substr(-1) !== '.') {
                prefix = !!prefix ? prefix + '.' : '';
            }
            var deriveQualifiedKey = function (key) {
                return prefix + key;
            };
            var browserSupportsLocalStorage = (function () {
                try {
                    var supported = (storageType in $window && $window[storageType] !== null);
                    var key = deriveQualifiedKey('__' + Math.round(Math.random() * 1e7));
                    if (supported) {
                        webStorage = $window[storageType];
                        webStorage.setItem(key, '');
                        webStorage.removeItem(key);
                    }
                    return supported;
                } catch (e) {
                    storageType = 'cookie';
                    $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
                    return false;
                }
            }());
            var addToLocalStorage = function (key, value) {
                if (isUndefined(value)) {
                    value = null;
                } else {
                    value = toJson(value);
                }
                if (!browserSupportsLocalStorage || self.storageType === 'cookie') {
                    if (!browserSupportsLocalStorage) {
                        $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
                    }
                    if (notify.setItem) {
                        $rootScope.$broadcast('LocalStorageModule.notification.setitem', { key: key, newvalue: value, storageType: 'cookie' });
                    }
                    return addToCookies(key, value);
                }
                try {
                    if (webStorage) {
                        webStorage.setItem(deriveQualifiedKey(key), value)
                    };
                    if (notify.setItem) {
                        $rootScope.$broadcast('LocalStorageModule.notification.setitem', { key: key, newvalue: value, storageType: self.storageType });
                    }
                } catch (e) {
                    $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
                    return addToCookies(key, value);
                }
                return true;
            };
            var getFromLocalStorage = function (key) {
                if (!browserSupportsLocalStorage || self.storageType === 'cookie') {
                    if (!browserSupportsLocalStorage) { $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED'); }
                    return getFromCookies(key);
                }
                var item = webStorage ? webStorage.getItem(deriveQualifiedKey(key)) : null; if (!item || item === 'null') { return null; }
                try { return JSON.parse(item); } catch (e) { return item; }
            };
            var removeFromLocalStorage = function () {
                var i, key; for (i = 0; i < arguments.length; i++) {
                    key = arguments[i]; if (!browserSupportsLocalStorage || self.storageType === 'cookie') {
                        if (!browserSupportsLocalStorage) { $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED'); }
                        if (notify.removeItem) { $rootScope.$broadcast('LocalStorageModule.notification.removeitem', { key: key, storageType: 'cookie' }); }
                        removeFromCookies(key);
                    }
                    else { try { webStorage.removeItem(deriveQualifiedKey(key)); if (notify.removeItem) { $rootScope.$broadcast('LocalStorageModule.notification.removeitem', { key: key, storageType: self.storageType }); } } catch (e) { $rootScope.$broadcast('LocalStorageModule.notification.error', e.message); removeFromCookies(key); } }
                }
            };
            var getKeysForLocalStorage = function () {
                if (!browserSupportsLocalStorage) { $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED'); return false; }
                var prefixLength = prefix.length; var keys = []; for (var key in webStorage) { if (key.substr(0, prefixLength) === prefix) { try { keys.push(key.substr(prefixLength)); } catch (e) { $rootScope.$broadcast('LocalStorageModule.notification.error', e.Description); return []; } } }
                return keys;
            };
            var clearAllFromLocalStorage = function (regularExpression) {
                var prefixRegex = !!prefix ? new RegExp('^' + prefix) : new RegExp(); var testRegex = !!regularExpression ? new RegExp(regularExpression) : new RegExp(); if (!browserSupportsLocalStorage || self.storageType === 'cookie') {
                    if (!browserSupportsLocalStorage) { $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED'); }
                    return clearAllFromCookies();
                }
                var prefixLength = prefix.length; for (var key in webStorage) { if (prefixRegex.test(key) && testRegex.test(key.substr(prefixLength))) { try { removeFromLocalStorage(key.substr(prefixLength)); } catch (e) { $rootScope.$broadcast('LocalStorageModule.notification.error', e.message); return clearAllFromCookies(); } } }
                return true;
            };
            var browserSupportsCookies = (function () {
                try {
                    return $window.navigator.cookieEnabled || ("cookie" in $document && ($document.cookie.length > 0 || ($document.cookie = "test").indexOf.call($document.cookie, "test") > -1));
                } catch (e) {
                    $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
                    return false;
                }
            }());
            var addToCookies = function (key, value, daysToExpiry) {
                if (isUndefined(value)) {
                    return false;
                } else if (isArray(value) || isObject(value)) {
                    value = toJson(value);
                }
                if (!browserSupportsCookies) {
                    $rootScope.$broadcast('LocalStorageModule.notification.error', 'COOKIES_NOT_SUPPORTED');
                    return false;
                }
                try {
                    var expiry = '', expiryDate = new Date(), cookieDomain = '';
                    if (value === null) {
                        expiryDate.setTime(expiryDate.getTime() + (-1 * 24 * 60 * 60 * 1000));
                        expiry = "; expires=" + expiryDate.toGMTString();
                        value = '';
                    } else if (isNumber(daysToExpiry) && daysToExpiry !== 0) {
                        expiryDate.setTime(expiryDate.getTime() + (daysToExpiry * 24 * 60 * 60 * 1000));
                        expiry = "; expires=" + expiryDate.toGMTString();
                    } else if (cookie.expiry !== 0) {
                        expiryDate.setTime(expiryDate.getTime() + (cookie.expiry * 24 * 60 * 60 * 1000)); expiry = "; expires=" + expiryDate.toGMTString();
                    }
                    if (!!key) {
                        var cookiePath = "; path=" + cookie.path;
                        if (cookie.domain) {
                            cookieDomain = "; domain=" + cookie.domain;
                        }
                        $document.cookie = deriveQualifiedKey(key) + "=" + encodeURIComponent(value) + expiry + cookiePath + cookieDomain;
                    }
                } catch (e) { $rootScope.$broadcast('LocalStorageModule.notification.error', e.message); return false; }
                return true;
            };
            var getFromCookies = function (key) {
                if (!browserSupportsCookies) { $rootScope.$broadcast('LocalStorageModule.notification.error', 'COOKIES_NOT_SUPPORTED'); return false; }
                var cookies = $document.cookie && $document.cookie.split(';') || []; for (var i = 0; i < cookies.length; i++) {
                    var thisCookie = cookies[i]; while (thisCookie.charAt(0) === ' ') { thisCookie = thisCookie.substring(1, thisCookie.length); }
                    if (thisCookie.indexOf(deriveQualifiedKey(key) + '=') === 0) {
                        var storedValues = decodeURIComponent(thisCookie.substring(prefix.length + key.length + 1, thisCookie.length))
                        try { return JSON.parse(storedValues); } catch (e) { return storedValues }
                    }
                }
                return null;
            };
            var removeFromCookies = function (key) { addToCookies(key, null); }; var clearAllFromCookies = function () {
                var thisCookie = null, thisKey = null; var prefixLength = prefix.length; var cookies = $document.cookie.split(';'); for (var i = 0; i < cookies.length; i++) {
                    thisCookie = cookies[i]; while (thisCookie.charAt(0) === ' ') { thisCookie = thisCookie.substring(1, thisCookie.length); }
                    var key = thisCookie.substring(prefixLength, thisCookie.indexOf('=')); removeFromCookies(key);
                }
            };
            var getStorageType = function () { return storageType; }; var bindToScope = function (scope, key, def, lsKey) {
                lsKey = lsKey || key; var value = getFromLocalStorage(lsKey); if (value === null && isDefined(def)) { value = def; } else if (isObject(value) && isObject(def)) { value = extend(def, value); }
                $parse(key).assign(scope, value); return scope.$watch(key, function (newVal) { addToLocalStorage(lsKey, newVal); }, isObject(scope[key]));
            };
            var lengthOfLocalStorage = function () {
                var count = 0; var storage = $window[storageType]; for (var i = 0; i < storage.length; i++) { if (storage.key(i).indexOf(prefix) === 0) { count++; } }
                return count;
            };
            return {
                isSupported: browserSupportsLocalStorage,
                getStorageType: getStorageType,
                set: addToLocalStorage,
                add: addToLocalStorage,
                get: getFromLocalStorage,
                keys: getKeysForLocalStorage,
                remove: removeFromLocalStorage,
                clearAll: clearAllFromLocalStorage,
                bind: bindToScope,
                deriveKey: deriveQualifiedKey,
                length: lengthOfLocalStorage,
                cookie: {
                    isSupported: browserSupportsCookies,
                    set: addToCookies,
                    add: addToCookies,
                    get: getFromCookies,
                    remove: removeFromCookies,
                    clearAll: clearAllFromCookies
                }
            };
        }];
    });
})(window, window.angular);
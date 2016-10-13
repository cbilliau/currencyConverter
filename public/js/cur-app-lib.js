angular.module('curAppLib', [])

// dataShare service
    .factory('dataShare', function($rootScope, $timeout) {
    var service = {};
    service.data = false;
    service.sendData = function(data) {
        this.data = data;
        $timeout(function() {
            $rootScope.$broadcast('data_shared');
        }, 100);
    };
    service.getData = function() {
        return this.data;
    };
    return service;
})

// call api with user's curr codes / recieve rates
    .factory('getCurQuotes', [
    '$http',
    '$q',
    function($http, $q) {
        return function() {
            return $http.get('/api').success(function(response) {
                console.log(response);
                return response;
            });
        };
    }
]).factory('putCurrencyArray', [
    '$http',
    '$q',
    function($http, $q) {
        return function(currencyArray) {
            return $http.put('/user/addCurency', {
              currencyArray: currencyArray
            }).success(function(response) {
                console.log(response);
                return response;
            })
        }
    }
])

// add currency to cache
    .factory('addCurency', [
    'pullUsersCurCodes',
    'updateCurrencies',
    'setUserQuotes',
    'putCurrencyArray',
    function(pullUsersCurCodes, updateCurrencies, setUserQuotes, putCurrencyArray) {

        // return updated userData to $scope after adding currency
        return function(currencyItem, data, currencyList) {
            // define var
            let currency = currencyItem.substring(3);
            let flag = currencyItem.slice(0, 3);
            let currencyToAdd = {
                flag: flag,
                currency: currency,
                history30Day: '...',
                rate: null
            };
            // push the new currency obj into the data obj's userCurrencies arr
            data.userCurrencies.push(currencyToAdd);
            // get the 3 ltr currency codes from data obj
            let newCodes = pullUsersCurCodes(data.userCurrencies);
            // update userCurrencies with latest rates
            let quotes = updateCurrencies(newCodes, data.userCurrencies, currencyList);
            let updatedData = setUserQuotes(quotes, data.userCurrencies);
            console.log(updatedData);
            // add userCurrencies arr to user account in
            putCurrencyArray(updatedData);
            userData = updatedData;
        };
    }
])

// get user's saved three letter currency code choices
    .factory('pullUsersCurCodes', function() {
    return function(data) {
        // console.log(data);
        var codes = [];
        if (data !== null) {
            for (index in data) {
                codes.push(data[index].flag);
            }
        }
        // console.log(codes);
        return codes;
    }
})

// update currencies function
    .factory('updateCurrencies', [
    'setUserQuotes',
    function(getCurQuotes, setUserQuotes) {
        return function(currencyCodes, userCurrencies, currencyList) {

            var quotes = [];
            for (i = 0; i < currencyCodes.length; i++) {
                for (val in currencyList) {
                    if (val == currencyCodes[i]) {
                        quotes.push(currencyList[val]);
                    }
                }
            }
            // console.log(quotes);
            return quotes;
            // updatedData = setUserQuotes(quotes, userCurrencies);
            // return updatedData;
        }
    }
])

// combine recieved rates with user data
    .factory('setUserQuotes', function() {
    return function(quotes, userCurrencies) {
        for (index in userCurrencies) {
            userCurrencies[index].rate = quotes[index];
        }
        // console.log(userCurrencies);
        return userCurrencies;
    }
})

// remove currency from cache
    .factory('removeCurrency', [
    'pullUsersCurCodes',
    'updateCurrencies',
    function(pullUsersCurCodes, updateCurrencies) {
        return function(currencyItem, data) {
            for (index in data.userCurrencies) {
                if (data.userCurrencies[index].flag.indexOf(currencyItem.flag) == 0) {
                    data.userCurrencies.splice(index, 1);
                    let newCodes = pullUsersCurCodes(data.userCurrencies);
                    updateCurrencies(newCodes, data.userCurrencies).then(function(response) {
                        return userData = response;
                    });
                }
            }
        }
    }
])

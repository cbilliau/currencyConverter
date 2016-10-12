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

// add currency to cache
    .factory('addCurency', [
    'pullUsersCurCodes',
    'updateCurrencies',
    function(pullUsersCurCodes, updateCurrencies) {

        // currency obj constructor
        function userCurrency(flag, currency) {
            this.flag = flag,
            this.currency = currency,
            this.history30Day = '...',
            this.rate = null
        }
        // return updated userData to $scope after adding currency
        return function(currencyItem, data) {
            // define var
            let currency = currencyItem.substring(3);
            let flag = currencyItem.slice(0, 3);
            let currencyToAdd = {
                flag : flag,
                currency : currency,
                history30Day : '...',
                rate : null
            };
            // push the new currency obj into the data obj's userCurrencies arr
            data.userCurrencies.push(currencyToAdd);
            // get the 3 ltr currency codes from data obj
            let newCodes = pullUsersCurCodes(data.userCurrencies);
            // update userCurrencies with latest rates
            updateCurrencies(newCodes, data).then(function(response) {
                console.log(response);
                userData = response;
            });
        }
    }
])

// get user's saved three letter currency code choices
    .factory('pullUsersCurCodes', function() {
    return function(data) {
        var codes = [];
        if (data !== null) {
            for (index in data) {
                codes.push(data[index].flag);
            }
        }
        return codes;
    }
})

// update currencies function
    .factory('updateCurrencies', [
    'getCurQuotes',
    'setUserQuotes',
    function(getCurQuotes, setUserQuotes) {
        return function(currencyCodes, data) {
            // call api with 3 ltr currency codes
            return getCurQuotes(currencyCodes).then(function(quotesRes) {
                quotes = quotesRes;
                updatedData = setUserQuotes(quotes, data);
                return updatedData;
            })
        }
    }
])

// call api with user's curr codes / recieve rates
    .factory('getCurQuotes', [
    '$http',
    '$q',
    function($http, $q) {
        return function(codes) {
            return $http.get('/api/' + codes ).success(function(response) {
                var quotes = [];
                for (val in response.quotes) {
                    quotes.push(response.quotes[val]);
                }
                return $q.when(quotes);
            });
        };
    }
])

// combine recieved rates with user data
    .factory('setUserQuotes', function() {
    return function(quotes, data) {
        for (index in data.userCurrencies) {
            data.userCurrencies[index].rate = quotes[index];
        }
        return data;
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

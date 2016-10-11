angular.module('curAppLib', [])

// API constants
    .constant('CUR_API_PREFIX', 'http://apilayer.net/api/')
    .constant('CUR_API_ENDPOINT_LIVE', 'live')
    .constant('CUR_API_ENDPOINT_HISTORICAL', 'historical')
    .constant('CUR_API_KEY', '?access_key=6bd7e9293254526403d839455fcb946c')
    .constant('CUR_COUNTRIES_LIST', './countriesList.json')

// get countries list from json file
    .factory('curCountriesList', [
    '$http',
    '$q',
    'CUR_COUNTRIES_LIST',
    function($http, $q, CUR_COUNTRIES_LIST) {
        return function() {
            return $http.get('CUR_COUNTRIES_LIST', {cache: true}).then(function(response) {
                return $q.when(response.data);
            })
        }
    }
])

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

// get user's saved three letter currency code choices
    .factory('pullUsersCurCodes', function() {
    return function(data) {
        console.log(data);
        var codes = [];
        if (data !== null) {
            for (index in data) {
                codes.push(data[index].flag);
            }
        }
        console.log(codes);
        return codes;
    }
})

// call api with user's curr codes / recieve rates
    .factory('getCurQuotes', [
    '$http',
    '$q',
    'CUR_API_PREFIX',
    'CUR_API_ENDPOINT_LIVE',
    'CUR_API_KEY',
    function($http, $q, CUR_API_PREFIX, CUR_API_ENDPOINT_LIVE, CUR_API_KEY) {
        return function(codes) {
            return $http({
                method: 'GET',
                url: CUR_API_PREFIX + CUR_API_ENDPOINT_LIVE + CUR_API_KEY + '&currencies=' + codes + '&format=1',
                datatype: 'jsonp'
            }).then(function(response) {
                // push quotes obj into 'quotes' arr
                var quotes = [];
                for (val in response.data.quotes) {
                    quotes.push(response.data.quotes[val]);
                }
                return $q.when(quotes);
            });
        };
    }
])

// combine recieved rates with user data
    .factory('setUserQuotes', function() {
    return function(quotes, userCurrencies) {
        for (index in userCurrencies) {
            userCurrencies[index].rate = quotes[index];
        }
        console.log(userCurrencies);
        return userCurrencies;
    }
})

// update currencies function
    .factory('updateCurrencies', [
    'getCurQuotes',
    'setUserQuotes',
    function(getCurQuotes, setUserQuotes) {
        return function(currencyCodes, userCurrencies) {

            // call api with 3 ltr currency codes
            return getCurQuotes(currencyCodes).then(function(quotesRes) {
                quotes = quotesRes;
                updatedData = setUserQuotes(quotes, userCurrencies);
                return updatedData;
            })
        }
    }
])

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
            let currencyToAdd = new userCurrency(flag, currency);
            console.log(currencyToAdd);

            // push the new currency obj into the data obj's userCurrencies arr
            data.userCurrencies.push(currencyToAdd);
            console.log(data.userCurrencies);

            // get the 3 ltr currency codes from data obj
            let newCodes = pullUsersCurCodes(data.userCurrencies);

            updateCurrencies(newCodes, data.userCurrencies).then(function(response) {
                console.log('ping');
                $scope.userData = response;
            });
        }
    }
])

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

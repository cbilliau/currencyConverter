angular.module('curAppLib', [])

// API constants
    .constant('CUR_API_PREFIX', 'http://apilayer.net/api/')
    .constant('CUR_API_ENDPOINT_LIVE', 'live')
    .constant('CUR_API_ENDPOINT_HISTORICAL', 'historical')
    .constant('CUR_API_KEY', '?access_key=6bd7e9293254526403d839455fcb946c&currencies=AUD,EUR,GBP,PLN&format=1')
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

// get user's saved three letter currency code choices
    .factory('pullUsersCurCodes', function() {
    return function(data) {
        var codes = [];
        for (index in data) {
            codes.push(data[index].flag);
        }
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
                url: CUR_API_PREFIX + CUR_API_ENDPOINT_LIVE + CUR_API_KEY + '&currencies=' + codes,
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
    return function(quotes, data) {
        for (index in data) {
            data[index].rate = quotes[index];
        }
        return data;
    }
})

// update currencies function
    .factory('updateCurrencies', [
    'getCurQuotes',
    'setUserQuotes',
    function(getCurQuotes, setUserQuotes) {
        return function(currencyCodes, data) {
            return getCurQuotes(currencyCodes).then(function(quotesRes) {
                quotes = quotesRes;
                updatedData = setUserQuotes(quotes, data);
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
            this._id = null,
            this.flag = flag,
            this.currency = currency,
            this.history30Day = '...',
            this.rate = null
        }

        // return updated userData to $scope after adding currency
        return function(currencyItem, Data) {
            console.log(currencyItem);
            let newCurrency = currencyItem;
            let currency = newCurrency.substring(3);
            let flag = newCurrency.slice(0, 3);
            let currencyToAdd = new userCurrency(flag, currency);
            console.log(currencyToAdd);
            Data.userCurrencies.push(currencyToAdd);
            let newCodes = pullUsersCurCodes(Data.userCurrencies);
            updateCurrencies(newCodes, Data.userCurrencies).then(function(response) {
                userData = response;
            });
        }
    }
])

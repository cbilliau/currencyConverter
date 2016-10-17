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
    function($http) {
        return function() {
            return $http.get('/api').success(function(response) {
                console.log(response);
                return response;
            });
        };
    }
])

// call api for history currency rates
    .factory('getCurQuotesHistory', [
    '$http',
    function($http) {
        return function(date) {
            return $http.get('/api/' + date).success(function(response) {
                console.log(response);
                return response;
            });
        };
    }
])

// update user account with selected/removed currencies
    .factory('putCurrencyArray', [
    '$http',
    function($http) {
        return function(currencyArray) {
    // reseaching way to prevent saving rates but app uses db to store rates for display
          // for (index in currencyArray) {
          //     currencyArray[index].rate = null;
          //     currencyArray[index].history = null;
          // }
            return $http.put('/user/addCurency', {currencyArray: currencyArray}).success(function(response) {
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
                history: null,
                rate: null
            };
            // get the 3 ltr currency codes from data obj
            let oldCodes = pullUsersCurCodes(data.userCurrencies);
            for (i = 0; i < data.userCurrencies.length; i++) {
                if (flag == data.userCurrencies[i].flag){
                  return;
                }
            }
            // push the new currency obj into the data obj's userCurrencies arr
            data.userCurrencies.push(currencyToAdd);
            // get the 3 ltr currency codes from data obj
            let newCodes = pullUsersCurCodes(data.userCurrencies);
            // update userCurrencies with latest rates
            let quotes = updateCurrencies(newCodes, data.userCurrencies, currencyList);
            let updatedData = setUserQuotes(quotes, data.userCurrencies);
            console.log(updatedData);
            // update userCurrencies arr to user account in
            putCurrencyArray(updatedData);
            userData = updatedData;
        };
    }
])

// remove currency from cache
    .factory('removeCurrency', [
    'pullUsersCurCodes',
    'updateCurrencies',
    'setUserQuotes',
    'putCurrencyArray',
    function(pullUsersCurCodes, updateCurrencies, setUserQuotes, putCurrencyArray) {
        return function(currencyItem, data, currencyList) {
            for (index in data.userCurrencies) {
                if (data.userCurrencies[index].flag.indexOf(currencyItem.flag) == 0) {
                    data.userCurrencies.splice(index, 1);
                    let newCodes = pullUsersCurCodes(data.userCurrencies);
                    // console.log(newCodes);
                    let quotes = updateCurrencies(newCodes, data.userCurrencies, currencyList);
                    let updatedData = setUserQuotes(quotes, data.userCurrencies);
                    // console.log(updatedData);
                    // update userCurrencies arr to user account in
                    putCurrencyArray(updatedData);
                    userData = updatedData;
                }
            }
        }
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
            return quotes;
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

// change date of historical change column
    .factory('changeDate', [
    'getCurQuotesHistory',
    function(getCurQuotesHistory) {
        return function(dateObj, data) {
            // var userCurrencies = data.userCurrencies;
            let monthsBack = dateObj.value;

            // set new date n
            let d = new Date();
            d.setMonth(d.getMonth() - monthsBack);
            let d1 = d.toISOString();
            let n = d1.slice(0, 10);

            // get historical rates for n
            getCurQuotesHistory(n).then(function(response) {

                // parse historical rates into user userCurrencies
                let rate = response.data;
                for (i = 0; i < data.userCurrencies.length; i++) {
                    for (val in rate.rates) {
                        if (val == data.userCurrencies[i].flag) {
                            data.userCurrencies[i].history = rate.rates[val];
                        }
                    }
                }
                console.log(data);
                userData = data;
            });
        }
    }
]);

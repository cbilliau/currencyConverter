angular.module('curAppLib', [])

// API constants
    .constant('CUR_API_PREFIX', 'http://apilayer.net/api/')
    .constant('CUR_API_ENDPOINT_LIVE', 'live')
    .constant('CUR_API_ENDPOINT_HISTORICAL', 'historical')
    .constant('CUR_API_KEY', '?access_key=6bd7e9293254526403d839455fcb946c&currencies=AUD,EUR,GBP,PLN&format=1')

/* Steps to getting a user's rates
  1. get user's saved three letter currency code choices (factory)
  2. call api with user's curr codes / recieve rates (factory)
  3. combine recieved rates with user data (controller)
  4. expose user data to scope (controller)
  */

// 1. get user's saved three letter currency code choices (factory)
    .factory('pullUsersCountryCodes', function() {
    return function(data) {
        var codes = [];
        for (index in data) {
            codes.push(data[index].flag);
        }
        return codes;
    }
})

// 2. call api with user's curr codes / recieve rates (factory)
    .factory('getCurrencyQuotes', [
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
          }).
          then(function(response) {
            console.log(response);
            return $q.when(response.data);
          });
        };
    }
]);

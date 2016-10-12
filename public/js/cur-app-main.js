viewsModule.controller('MainController', [
    '$scope',
    'pullUsersCurCodes',
    'getCurQuotes',
    'setUserQuotes',
    'updateCurrencies',
    'addCurency',
    'removeCurrency',
    'dataShare',
    function($scope, pullUsersCurCodes, getCurQuotes, setUserQuotes, updateCurrencies, addCurency, removeCurrency, dataShare) {

        var countriesList = {
            AUD: "Australian Dollar",
            BGN: "Bulgarian Lev",
            BRL: "Brazilian Real",
            CAD: "Canadian Dollar",
            CHF: "Swiss Franc",
            CNY: "Chinese Yuan",
            CZK: "Czech Republic Koruna",
            DKK: "Danish Krone",
            EUR: 'Euro',
            GBP: "British Pound Sterling",
            HKD: "Hong Kong Dollar",
            HRK: "Croatian Kuna",
            HUF: "Hungarian Forint",
            IDR: "Indonesian Rupiah",
            ILS: "Israeli New Sheqel",
            INR: "Indian Rupee",
            JPY: "Japanese Yen",
            KRW: "South Korean Won",
            MXN: "Mexican Peso",
            MYR: "Malaysian Ringgit",
            MZN: "Mozambican Metical",
            NOK: "Norwegian Krone",
            NPR: "Nepalese Rupee",
            NZD: "New Zealand Dollar",
            PHP: "Philippine Peso",
            PLN: "Polish Zloty",
            RON: "Romanian Leu",
            RUB: "Russian Ruble",
            RWF: "Rwandan Franc",
            SEK: "Swedish Krona",
            SGD: "Singapore Dollar",
            THB: "Thai Baht",
            TRY: "Turkish Lira",
            ZAR: "South African Rand",
        }; //
        // ================ View =========================

        // recieve user data from login controller via dataShare service
        $scope.$on('data_shared', function(){
          $scope.data = dataShare.getData();
          console.log($scope.data);

          // countries list
          $scope.countries = countriesList;

          if ($scope.data.userCurrencies == null) {
            console.log('loading currencies...');
            var curCodes = pullUsersCurCodes($scope.data.userCurrencies);
            $scope.updateCur = updateCurrencies(curCodes, $scope.data.userCurrencies).then(function(response) {
                $scope.userData = response;
            });
          }

          // add currency to Data cache
          $scope.currencyAdd = function($event) {
              addCurency($scope.currencyItemAdd, $scope.data);
          }

          // remove currency from Data cache
          $scope.currencyRemove = function(currencyItem) {
              removeCurrency(currencyItem, Data);
          }
        })


    }
]);

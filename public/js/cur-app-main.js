viewsModule.controller('MainController', [
    '$scope',
    '$location',
    'pullUsersCurCodes',
    'getCurQuotes',
    'setUserQuotes',
    'updateCurrencies',
    'addCurency',
    'removeCurrency',
    'dataShare',
    'ApiService',
    'changeDate',
    function($scope, $location, pullUsersCurCodes, getCurQuotes, setUserQuotes, updateCurrencies, addCurency, removeCurrency, dataShare, ApiService, changeDate) {

        // var
        var currencyRates;

        var countriesList = {
            AUD: "Australian Dollar",
            BGN: "Bulgarian Lev",
            BRL: "Brazilian Real",
            CAD: "Canadian Dollar",
            CHF: "Swiss Franc",
            CNY: "Chinese Yuan",
            CZK: "Czech Republic Koruna",
            DKK: "Danish Krone",
            EUR: "Euro",
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
            ZAR: "South African Rand"
        }; //

        var historyList = [
            {
                date: '6mos',
                value: 6
            }, {
                date: '12mos',
                value: 12
            }, {
                date: '18mos',
                value: 18
            }, {
                date: '24mos',
                value: 24
            }
        ];

        // $scope

        // recieve user data from login controller via dataShare service
        $scope.$on('data_shared', function() {

            // load in user's currency schema
            $scope.data = dataShare.getData();
            // console.log($scope.data);

            $scope.loggedIn = true;
            // expose user's userCurrencies arr to scope
            $scope.userData = $scope.data.userCurrencies;
            // console.log($scope.userData);

            // countries list
            $scope.countries = countriesList;
            $scope.dates = historyList;

            // get currency quotes
            var currencyList = getCurQuotes().then(function(response) {
                // console.log(response.data);
                currencyRates = response.data.rates;
            });

            // change history
            $scope.changeDate = function($event) {
                // console.log($scope.selectedDate);
                changeDate($scope.selectedDate, $scope.data);
                $scope.historyDate = $scope.selectedDate;
                $scope.selectedDate = '';
            };

            // add currency to
            $scope.currencyAdd = function($event) {
                addCurency($scope.currencyItemAdd, $scope.data, currencyRates);
                $scope.currencyItemAdd = '';
                // console.log($scope.userData);
            };

            // remove currency from Data cache
            $scope.currencyRemove = function(currencyItem) {
                removeCurrency(currencyItem, $scope.data, currencyRates);
            };

            // logout
            $scope.logout = function() {
                ApiService.ClearCredentials();
                $scope.loggedIn = false;
                $scope.userData = null;
                $location.path('/login');
            }
        });
    }
]);

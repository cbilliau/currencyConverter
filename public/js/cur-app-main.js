viewsModule.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/main', {
            templateUrl: './main.html',
            controller: 'MainController'
        }).when('/error', {template: '<p>Error - Page Not Found</p>'}).otherwise('/error');
    }
]);

viewsModule.controller('MainController', [
    '$scope',
    'curCountriesList',
    'pullUsersCurCodes',
    'getCurQuotes',
    'setUserQuotes',
    'updateCurrencies',
    'addCurency',
    'removeCurrency',
    function($scope, curCountriesList, pullUsersCurCodes, getCurQuotes, setUserQuotes, updateCurrencies, addCurency, removeCurrency) {

        // Grab json file of countries list
        // Isuue with express serving json file.
        // curCountriesList()
        //   .then(function(countriesList) {
        //     $scope.countries = countriesList;
        //     console.log($scope.countries);
        //   });

        // create cache object
        Data = {
            userCurrencies: [],
            username: ''
        }

        // ================= Mock ========================
        var MOCK_DATA = [
            {
                'id': '11111',
                'flag': 'AMD',
                'currency': 'Armenian Dram',
                'history30Day': '...',
                'rate': ''
            }, {
                'id': '22222',
                'flag': 'PYG',
                'currency': 'Paraguayan Guarani',
                'history30Day': '...',
                'rate': ''
            }, {
                'id': '33333',
                'flag': 'UGX',
                'currency': 'Ugandan Shilling',
                'history30Day': '...',
                'rate': ''
            }
        ];
        var countriesList = {
            AED: "United Arab Emirates Dirham",
            AFN: "Afghan Afghani",
            ALL: "Albanian Lek",
            AMD: "Armenian Dram",
            ANG: "Netherlands Antillean Guilder",
            AOA: "Angolan Kwanza",
            ARS: "Argentine Peso",
            AUD: "Australian Dollar",
            AWG: "Aruban Florin",
            AZN: "Azerbaijani Manat",
            BAM: "Bosnia-Herzegovina Convertible Mark",
            BBD: "Barbadian Dollar",
            BDT: "Bangladeshi Taka",
            BGN: "Bulgarian Lev",
            BHD: "Bahraini Dinar",
            BIF: "Burundian Franc",
            BMD: "Bermudan Dollar",
            BND: "Brunei Dollar",
            BOB: "Bolivian Boliviano",
            BRL: "Brazilian Real",
            BSD: "Bahamian Dollar",
            BTC: "Bitcoin",
            BTN: "Bhutanese Ngultrum",
            BWP: "Botswanan Pula",
            BYR: "Belarusian Ruble",
            BZD: "Belize Dollar",
            CAD: "Canadian Dollar",
            CDF: "Congolese Franc",
            CHF: "Swiss Franc",
            CLF: "Chilean Unit of Account (UF)",
            CLP: "Chilean Peso",
            CNY: "Chinese Yuan",
            COP: "Colombian Peso",
            CRC: "Costa Rican Colón",
            CUC: "Cuban Convertible Peso",
            CUP: "Cuban Peso",
            CVE: "Cape Verdean Escudo",
            CZK: "Czech Republic Koruna",
            DJF: "Djiboutian Franc",
            DKK: "Danish Krone",
            DOP: "Dominican Peso",
            DZD: "Algerian Dinar",
            EEK: "Estonian Kroon",
            EGP: "Egyptian Pound",
            ERN: "Eritrean Nakfa",
            ETB: "Ethiopian Birr",
            EUR: "Euro",
            FJD: "Fijian Dollar",
            FKP: "Falkland Islands Pound",
            GBP: "British Pound Sterling",
            GEL: "Georgian Lari",
            GGP: "Guernsey Pound",
            GHS: "Ghanaian Cedi",
            GIP: "Gibraltar Pound",
            GMD: "Gambian Dalasi",
            GNF: "Guinean Franc",
            GTQ: "Guatemalan Quetzal",
            GYD: "Guyanaese Dollar",
            HKD: "Hong Kong Dollar",
            HNL: "Honduran Lempira",
            HRK: "Croatian Kuna",
            HTG: "Haitian Gourde",
            HUF: "Hungarian Forint",
            IDR: "Indonesian Rupiah",
            ILS: "Israeli New Sheqel",
            IMP: "Manx pound",
            INR: "Indian Rupee",
            IQD: "Iraqi Dinar",
            IRR: "Iranian Rial",
            ISK: "Icelandic Króna",
            JEP: "Jersey Pound",
            JMD: "Jamaican Dollar",
            JOD: "Jordanian Dinar",
            JPY: "Japanese Yen",
            KES: "Kenyan Shilling",
            KGS: "Kyrgystani Som",
            KHR: "Cambodian Riel",
            KMF: "Comorian Franc",
            KPW: "North Korean Won",
            KRW: "South Korean Won",
            KWD: "Kuwaiti Dinar",
            KYD: "Cayman Islands Dollar",
            KZT: "Kazakhstani Tenge",
            LAK: "Laotian Kip",
            LBP: "Lebanese Pound",
            LKR: "Sri Lankan Rupee",
            LRD: "Liberian Dollar",
            LSL: "Lesotho Loti",
            LTL: "Lithuanian Litas",
            LVL: "Latvian Lats",
            LYD: "Libyan Dinar",
            MAD: "Moroccan Dirham",
            MDL: "Moldovan Leu",
            MGA: "Malagasy Ariary",
            MKD: "Macedonian Denar",
            MMK: "Myanma Kyat",
            MNT: "Mongolian Tugrik",
            MOP: "Macanese Pataca",
            MRO: "Mauritanian Ouguiya",
            MUR: "Mauritian Rupee",
            MVR: "Maldivian Rufiyaa",
            MWK: "Malawian Kwacha",
            MXN: "Mexican Peso",
            MYR: "Malaysian Ringgit",
            MZN: "Mozambican Metical",
            NAD: "Namibian Dollar",
            NGN: "Nigerian Naira",
            NIO: "Nicaraguan Córdoba",
            NOK: "Norwegian Krone",
            NPR: "Nepalese Rupee",
            NZD: "New Zealand Dollar",
            OMR: "Omani Rial",
            PAB: "Panamanian Balboa",
            PEN: "Peruvian Nuevo Sol",
            PGK: "Papua New Guinean Kina",
            PHP: "Philippine Peso",
            PKR: "Pakistani Rupee",
            PLN: "Polish Zloty",
            PYG: "Paraguayan Guarani",
            QAR: "Qatari Rial",
            RON: "Romanian Leu",
            RSD: "Serbian Dinar",
            RUB: "Russian Ruble",
            RWF: "Rwandan Franc",
            SAR: "Saudi Riyal",
            SBD: "Solomon Islands Dollar",
            SCR: "Seychellois Rupee",
            SDG: "Sudanese Pound",
            SEK: "Swedish Krona",
            SGD: "Singapore Dollar",
            SHP: "Saint Helena Pound",
            SLL: "Sierra Leonean Leone",
            SOS: "Somali Shilling",
            SRD: "Surinamese Dollar",
            STD: "São Tomé and Príncipe Dobra",
            SVC: "Salvadoran Colón",
            SYP: "Syrian Pound",
            SZL: "Swazi Lilangeni",
            THB: "Thai Baht",
            TJS: "Tajikistani Somoni",
            TMT: "Turkmenistani Manat",
            TND: "Tunisian Dinar",
            TOP: "Tongan Paʻanga",
            TRY: "Turkish Lira",
            TTD: "Trinidad and Tobago Dollar",
            TWD: "New Taiwan Dollar",
            TZS: "Tanzanian Shilling",
            UAH: "Ukrainian Hryvnia",
            UGX: "Ugandan Shilling",
            USD: "United States Dollar",
            UYU: "Uruguayan Peso",
            UZS: "Uzbekistan Som",
            VEF: "Venezuelan Bolívar Fuerte",
            VND: "Vietnamese Dong",
            VUV: "Vanuatu Vatu",
            WST: "Samoan Tala",
            XAF: "CFA Franc BEAC",
            XAG: "Silver (troy ounce)",
            XAU: "Gold (troy ounce)",
            XCD: "East Caribbean Dollar",
            XDR: "Special Drawing Rights",
            XOF: "CFA Franc BCEAO",
            XPF: "CFP Franc",
            YER: "Yemeni Rial",
            ZAR: "South African Rand",
            ZMK: "Zambian Kwacha (pre-2013)",
            ZMW: "Zambian Kwacha",
            ZWL: "Zimbabwean Dollar"
        }; //

        function pushMockToDataCache(data) {
            for (i = 0; i < data.length; i++) {
                Data.userCurrencies.push(data[i]);
            }
        }
        function pushDataToScope(data, countries) {
            $scope.userRawData = data.userCurrencies;
            $scope.countries = countries;
        }
        // put mockdata into cache
        pushMockToDataCache(MOCK_DATA);
        // expose cache to scope
        pushDataToScope(Data, countriesList);
        // ===============================================

        // ================ View =========================

        // PLACEHOLDER to get user data from db

        // set up initial view
        $scope.curCodes = pullUsersCurCodes($scope.userRawData);
        $scope.updateCur = updateCurrencies($scope.curCodes, $scope.userRawData).then(function(response) {
            $scope.userData = response;
        });

        // add currency to Data cache
        $scope.currencyAdd = function($event) {
            addCurency($scope.currencyItemAdd, Data);
        }

        // remove currency from Data cache
        $scope.currencyRemove = function(currencyItem) {
          console.log(currencyItem);
            removeCurrency(currencyItem, Data);
        }
    }
]);

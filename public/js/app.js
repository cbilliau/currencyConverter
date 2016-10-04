var currencyApp = angular.module('currencyApp', []).controller('mainController', mainController);

var MOCK_DATA = {
    'userCurrencies': [
        {
            'id': '11111',
            'flag': 'flagID',
            'currency': 'Eur',
            'history30Day': '...',
            'rate': '1.064'
        }, {
            'id': '22222',
            'flag': 'flagID',
            'currency': 'Rup',
            'history30Day': '...',
            'rate': '0.974'
        }, {
            'id': '33333',
            'flag': 'flagID',
            'currency': 'Pon',
            'history30Day': '...',
            'rate': '1.299'
        }
    ]
};

function mainController($scope, $http) {
    $scope.formData = {};

    // gather MOCK_DATA - replace with get
    function pushMockDataToScope(data) {
        console.log(data.userCurrencies);
        $scope.userData = data.userCurrencies;
    }

    pushMockDataToScope(MOCK_DATA);

}

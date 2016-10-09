viewsModule.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: './login.html'
        })

        .when('/', {
            controller: 'MainController',
            templateUrl: './main.html'
        })

        .otherwise({ redirectTo: '/' });
}])

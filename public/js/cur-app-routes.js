viewsModule.config([
    '$routeProvider',
    function($routeProvider) {

        $routeProvider.when('/login', {
            controller: 'LoginController',
            templateUrl: './login.html'
        }).when('/', {
            controller: 'MainController',
            templateUrl: './main.html'
        }).when('/error', {
            template: '<p>Error - Page Not Found</p>'
        }).otherwise('/error');
    }

]).run(function($rootScope, $location, $timeout) {
    $rootScope.$on('$routeChangeError', function() {
        $location.path("/error");
    });
    $rootScope.$on('$routeChangeStart', function() {
        $rootScope.isLoading = true;
    });
    $rootScope.$on('$routeChangeSuccess', function() {
            $rootScope.isLoading = false;
    });
});

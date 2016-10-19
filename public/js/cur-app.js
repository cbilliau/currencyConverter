var currencyApp = angular.module('curApp', ['curAppViews', 'ngRoute', 'ngCookies', 'ngAnimate']).config(function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: '/'});
});

currencyApp.run([
    '$rootScope',
    '$location',
    '$cookies',
    '$http',
    'ApiService',
    'dataShare',
    function($rootScope, $location, $cookies, $http, ApiService, dataShare) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) { // successfull entry point
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
            ApiService.GetData(function(response) {
                dataShare.sendData(response); // share data with app
            });
        }

        $rootScope.$on('$locationChangeStart', function(event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
    }
]);

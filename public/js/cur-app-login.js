// routing and controller for login
viewsModule.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
          templateUrl: './login.html',
          controller: 'LoginCtrl'
        })
        .when('/error', {
            template: '<p>Error - Page Not Found</p>'
        })
        .otherwise('/error');
}]);

viewsModule.controller('LoginCtrl', ['$scope', function($scope) {

}]);

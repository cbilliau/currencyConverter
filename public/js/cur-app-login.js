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

viewsModule.controller('LoginCtrl', ['$scope', '$location', function($scope, $location) {
  $scope.submit = function(){
    var username = $scope.username;
    var password = $scope.password;
    if($scope.username == 'admin' && $scope.password == 'admin') {
      $location.path('/main');
    }
  }
}]);

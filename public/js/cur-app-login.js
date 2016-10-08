// routing and controller for login
viewsModule.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: './login.html',
            controller: 'LoginCtrl'
        }).when('/error', {template: '<p>Error - Page Not Found</p>'}).otherwise('/error');
    }
]);

viewsModule.controller('LoginCtrl', [
    '$scope',
    '$http',
    function($scope, $http) {

        $scope.submit = function() {
            var username = $scope.username;
            var password = $scope.password;

            $http({
                url: '/users/' + username,
                method: 'get',
                dataType: 'json',
                data: {
                    username: username,
                    password: password
                }
            }).success(function(data) {
                console.log(data);
                // How do I take the page sent back and render it?
                $scope.main = data;
            })
        }
    }
]);

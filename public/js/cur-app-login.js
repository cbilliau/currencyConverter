viewsModule.controller('LoginController', [
    '$scope',
    '$rootScope',
    '$location',
    'AuthenticationService',
    function($scope, $rootScope, $location, AuthenticationService) {

        // reset login status
        AuthenticationService.ClearCredentials();

        $scope.login = function() {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, function(response) {
                console.log(response.success);
                if (response.success) {
                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                    AuthenticationService.GetData(function(response) {
                      console.log(response.success);
                      $location.path('/main');
                    });
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            })
        }
    }
]);

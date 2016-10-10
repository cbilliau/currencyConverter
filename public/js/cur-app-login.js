viewsModule.controller('LoginController', [
    '$scope',
    '$rootScope',
    '$location',
    'AuthenticationService',
    'dataShare',
    function($scope, $rootScope, $location, AuthenticationService, dataShare) {

        // reset login status
        AuthenticationService.ClearCredentials();

        $scope.login = function() {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, function(response) {
                if (response.success) {
                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                    AuthenticationService.GetData(function(response) {
                      dataShare.sendData(response); // share data with app
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

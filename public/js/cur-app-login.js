viewsModule.controller('LoginController', [
    '$scope',
    '$rootScope',
    '$location',
    'ApiService',
    'dataShare',
    function($scope, $rootScope, $location, ApiService, dataShare) {

        // reset login status
        ApiService.ClearCredentials();

        // validation
        $scope.formInvalid = false;

        // login
        $scope.login = function() {
            $scope.dataLoading = true;
            ApiService.SetCredentials($scope.username, $scope.password);
            ApiService.Login($scope.username, $scope.password, function(response) {
                if (response.success) {
                    ApiService.GetData(function(response) {
                        dataShare.sendData(response); // share data with app
                        $location.path('/main');
                    });
                } else {
                    ApiService.ClearCredentials();
                    $scope.formInvalid = true;
                    $scope.loginMsg = "Username not found or password may be incorrect";
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            })
        }

        // signup
        $scope.signup = function() {
            $scope.dataLoading = true;
            ApiService.Signup($scope.username, $scope.password, function(response) {
                if (response.success) {
                    ApiService.SetCredentials($scope.username, $scope.password);
                    ApiService.GetData(function(response) {
                        dataShare.sendData(response); // share data with app
                        $location.path('/main');
                    });
                } else {
                    $scope.formInvalid = true;
                    $scope.loginMsg = "User already exists";
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            })
        }
    }
]);

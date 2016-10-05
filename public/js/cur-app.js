var currencyApp = angular.module('curApp', ['curAppViews', 'ngRoute'])
      .config(function($locationProvider, $routeProvider) {
          $locationProvider.hashPrefix('!');
          $routeProvider.otherwise({
              redirectTo: '/'
          });
      });

var app = angular.module('fontDB', ['ui.router']);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl'
		});

		$urlRouterProvider.otherwise('home');
	}
]);

app.controller('MainCtrl', [
	'$scope',
	'fontsService',
	function($scope, fontsService){
		$scope.fonts = fontsService.fonts; 
		
		$scope.addFont = function() {
			if(!$scope.name || $scope.name === '') {
				return;
			}
			$scope.isTrueType = $scope.isTrueType || false;
			$scope.fonts.push({name: $scope.name, isTrueType: $scope.isTrueType});
			$scope.name = '';
		};
		
		$scope.removeFont = function(index) {
			$scope.fonts.splice(index, 1);
		};
	}
]);

app.factory('fontsService', [function(){
	var fonts = {
		fonts: []
	};
	return fonts;
}]);
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
	
		function copyFont(from, to) {
			to.name = from.name;
			to.isTrueType = from.isTrueType;
			to.original = from;
		}
		
		$scope.saveFont = function() {
			if(!$scope.selectedFont || $scope.selectedFont.name === '') {
				return;
			}
			
			var original = $scope.selectedFont.original;
			if(!$scope.selectedFont.original) {
				$scope.fonts.push($scope.selectedFont);
			} else {
				copyFont($scope.selectedFont, original);
			}
			$scope.newFont();
			
			$('#fontEditDialog').modal('hide');
		};
		
		$scope.editFont = function(index) {
			$scope.selectedFont = {
				name: '',
				isTrueType: true,
				original: null
			};
			if(index >= 0) {
				var original = $scope.fonts[index];
				copyFont(original, $scope.selectedFont);
			}
		};
		
		$scope.newFont = function() {
			$scope.editFont(-1);
		};
		
		$scope.removeFont = function(index, event) {
			if(event) {
				event.stopPropagation();
			}
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
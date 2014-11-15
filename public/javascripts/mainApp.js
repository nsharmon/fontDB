var app = angular.module('fontDB', ['ui.router']);

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
				fontsService.create($scope.selectedFont);
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

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	'fontsService',
	function($stateProvider, $urlRouterProvider, fontsService) {
		$stateProvider.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl',
			resolve: {
				fontPromise: ['fonts', function(fontsService) {
					return fontsService.getAll();
				}]
			}
		});

		$urlRouterProvider.otherwise('home');
	}
]);

app.factory('fontsService', ['$http', function($http){
	var service = {
		fonts: []
	};
	service.getAll = function() {
		return $http.get('/fonts').success(function(data){
			angular.copy(data, service.fonts);
		});
	};
	service.create = function() {
		return $http.post('/fonts', font).success(function(data){
			service.fonts.push(data);
		});
	};
	return service;
}]);
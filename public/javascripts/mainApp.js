var app = angular.module('fontDB', ['ui.router']);

function copyFont(from, to) {
	to.name = from.name;
	to.isTrueType = from.isTrueType;
	to.original = from;
	to._id = from._id;
}

app.factory('fontsService', ['$http', function($http){
	var service = {
		fonts: []
	};
	service.getAll = function() {
		return $http.get('/fonts').success(function(data){
			angular.copy(data, service.fonts);
		});
	};
	service.create = function(font) {
		return $http.post('/fonts', font).success(function(data){
			service.fonts.push(data);
		});
	};
	service.save = function(font) {
		return $http.put('/fonts/'+font._id, font).success(function(data){
			copyFont(font, font.original);
		});
	};
	service.remove = function(index) {
		var font = service.fonts[index];
		return $http.delete('/fonts/'+font._id, font).success(function(data){
			service.fonts.splice(index, 1);
		});
	};
				
	return service;
}]);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl',
			resolve: {
				fontPromise: ['fontsService', function(fontsService) {
					return fontsService.getAll();
				}]
			}
		});

		$urlRouterProvider.otherwise('home');
	}
]);

app.controller('MainCtrl', [
	'$scope',
	'fontsService',
	function($scope, fontsService){
		$scope.fonts = fontsService.fonts; 
		
		$scope.saveFont = function() {
			if(!$scope.selectedFont || $scope.selectedFont.name === '') {
				return;
			}
			
			var original = $scope.selectedFont.original;
			if(!$scope.selectedFont.original) {
				fontsService.create($scope.selectedFont);
			} else {
				fontsService.save($scope.selectedFont);
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
			fontsService.remove(index);
		};
	}
]);
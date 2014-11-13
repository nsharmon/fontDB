angular.module('fontDB', []).controller('MainCtrl', [
	'$scope',
	function($scope){
		$scope.fonts = [
			{name: 'Times New Roman', isTrueType: false},
			{name: 'Comic Sans MS', isTrueType: false},
			{name: 'Courier New', isTrueType: false},
			{name: 'Sans Serif', isTrueType: false},
			{name: 'Wingdings', isTrueType: true}
		]; 
		
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
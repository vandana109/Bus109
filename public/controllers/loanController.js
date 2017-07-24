
scotchToDo.controller("loanController", function($scope, $http,loanService){
	$scope.todoObj = loanService.getProperty();
	$scope.formData = {}; $scope.user = {};
	$scope.formData.name = $scope.todoObj.name;
	$scope.formData.father = $scope.todoObj.fatherName;
	$scope.formData.depositAmount = $scope.todoObj.depositAmount;
	$scope.user.personId = $scope.todoObj._id;
	$scope.formData.personId = $scope.todoObj._id;

	$scope.createLoan = function(){
		$http.post('/api/takeLoan', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
	};
});
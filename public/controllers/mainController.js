scotchToDo.controller("mainController", function($scope, $http,loanService){

    $scope.formData = {};

    // when landing on the page, get all todos and show them
    $http.get('/api/todos')
        .success(function(data) {
            $scope.todos = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
        console.log( $scope.formData);
        $scope.formData.maturityAmount= 2*$scope.formData.depositAmount;
        var maturityDate = new Date($scope.formData.depositDate);
        maturityDate.setFullYear(maturityDate.getFullYear() + 1);
        $scope.formData.maturityDate= new Date(maturityDate.setDate(maturityDate.getDate() - 1));
        $http.post('/api/todos', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        };

    // delete a todo after checking it
        $scope.deleteTodo = function(id) {
            $http.delete('/api/todos/' + id)
                .success(function(data) {
                    $scope.todos = data;
                    console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        };

        $scope.takeLoan = function(todo){
            loanService.setProperty(todo);
        };


        $scope.writeFile = function(){
             $http.get('/writeFileTodo')
                .success(function(data) {
                    console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        };

});
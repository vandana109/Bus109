// public/core.js
var scotchToDo = angular.module('scotchTodo', []);

scotchToDo.config(function ($routeProvider,$locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: '../pages/addUser.html',
        controller: 'mainController'
      })
       .when('/usersList', {
        templateUrl: '../pages/usersList.html',
        controller: 'mainController'
      })
      .when('/takeLoan', {
        templateUrl: '../pages/takeLoan.html',
        controller: 'loanController'
      });
  });



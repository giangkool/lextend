/**
 * AngularJS Tutorial 1
 * @author Nick Kaye <nick.c.kaye@gmail.com>
 */

/**
 * Main AngularJS Web Application
 */
angular.module('Lextend', ['ngRoute','Lextend.controller','Lextend.services'])

// .run( function($rootScope, $location) {

//     // register listener to watch route changes
//     $rootScope.$on( "$routeChangeStart", function(event, next, current) {
//       if ( $rootScope.loggedUser == null ) {
//         // no logged user, we should be going to #login
//         if ( next.templateUrl == "partials/login.html" ) {
//           // already going to #login, no redirect needed
//         } else {
//           // not going to #login, we should redirect now
//           $location.path( "/login" );
//         }
//       }         
//     });
//  })
/**
 * Configure the Routes
 */
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/home.html", controllerUrl: "HomeCtrl"})
    // Pages
    .when("/word", {templateUrl: "partials/word.html", controller:"WordCtrl"})
    .when("/wordbook-detail/:keys", {templateUrl: "partials/wordbook_detail.html", controller:"Wordbookdetail"})
    .when("/add-system-wordbook", {templateUrl: "partials/addsystem.html", controller:"AddsyswordbookCtrl"})
    .when("/create-new-bookbook", {templateUrl: "partials/addword.html", controller:"CreateWordbookCtrl"})
    .when("/material", {templateUrl: "partials/material.html"})
    .when("/material-detail/:uri", {templateUrl: "partials/materialdetail.html", controller:"MaterialdetailCtrl"})
    .when("/add-material", {templateUrl: "partials/addmaterial.html", controller:"CreateMaterialCtrl"})
    .when("/other", {templateUrl: "partials/other.html", controller:"OtherCtrl"})
    .when("/search/:keys", {templateUrl: "partials/search.html", controller:"SearchCtrl"})
    .when("/flash-card", {templateUrl: "partials/flashcard.html"})
    
    .when("/login", {templateUrl: "partials/login.html", controller: "LoginCtrl"})
    .when("/register", {templateUrl: "partials/register.html", controller: "RegisterCtrl"})
    // Blog
    .when("/forgot-password", {templateUrl: "partials/forgot-password.html", controller: "ForgotCtrl"})
    // else 404
    .otherwise({ redirectTo: '/login' });
}]);

/**
 * Controls the Blog
 */

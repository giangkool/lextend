app
    .controller('DictionaryCtrl', function ($scope, $rootScope, $location, $http, apiService, $localStorage, $state, $window, facebook) {

        //Lay auth_token;
        // var auth_token = $localStorage.auth_token;
        var auth_token = window.localStorage.getItem('auth_token');

        //Ham lay danh sach cac tu goi y
        $scope.lookup = function (keyword) {
            $scope.loadding = true;
            apiService.postSuggestions(auth_token, keyword).then(function (response) {
                $scope.suggestions = response.data.data;
                console.log($scope.suggestions);
                $scope.loadding = false;
                $scope.key = keyword;
            });
        }

        $scope.search_click = function () {
            window.setTimeout(function () {
                $localStorage.keywords =  $scope.key;
                window.location.href = '#/search/' + $scope.key;
            }, 600);
        }
    });
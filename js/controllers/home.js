app
    .controller('HomeCtrl', function ($scope, $rootScope, $location, $http, $localStorage, $window, apiService) {
        //var auth_token = window.localStorage.getItem('auth_token');
        var auth_token = window.localStorage.getItem('auth_token');
        console.log('auth_token:', auth_token);
        function get_supported_languages() {
            apiService.getSupportlanguage('').then(function (response) {
                if (!response.data || !response.data.response_code || response.data.response_code != '00') {
                    $localStorage.supported_languages = null;
                }
                $localStorage.supported_languages = response.data.data;
            });
        };

        if (!$localStorage.supported_languages) {
            get_supported_languages();
        }
        if (!auth_token) {
            window.location.href = '#/login';
            return;
        }

        apiService.getProfile(auth_token).then(function (response) {
            $scope.result = response.data;
            console.log($scope.result);
        });
    });
app.controller('SearchCtrl', function ($scope, $timeout, $location, $http, apiService, speech, $localStorage, $routeParams) {
        // var auth_token = $localStorage.auth_token;
        var auth_token = window.localStorage.getItem('auth_token');
        if (!auth_token) {
            window.location.href = '#/login';
        }
        else {
            console.log($routeParams.keys);
            $scope.key = $routeParams.keys;

            //text to speech
            $scope.support= false;
            if(window.speechSynthesis) {
                $scope.support = true;                                    
            
                $timeout(function () {
                $scope.voices = speech.getVoices();          
                }, 500);  
            }

            $scope.pitch = 1;
            $scope.rate = 1;           
            $scope.volume = 1;

            $scope.submitEntry = function () {
                var voiceIdx = $scope.voices.indexOf($scope.optionSelected),
                    config = {
                    voiceIndex: voiceIdx,
                    rate: $scope.rate,
                    pitch: $scope.pitch,
                    volume: $scope.volume
                    };

                if(window.speechSynthesis) {
                    speech.sayText($scope.key, config);
                }
            };

            //search dictionary
            apiService.postDictionarylook(auth_token, $scope.key).then(function (response) {
                if (response.data.response_code == "00") {
                    $scope.lookdictionary = response.data.data;
                }
                else {
                    $scope.nonword = true;
                }
                console.log(response.data.data);
            });
        }
    });
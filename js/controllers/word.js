app
    .controller('WordCtrl', function ($scope, $rootScope, $location, $http, apiService, speech, $timeout, $localStorage, $state, $window, facebook) {


        //Lay auth_token;
        // var auth_token = $localStorage.auth_token;
        var auth_token = window.localStorage.getItem('auth_token');
        // console.log('list today words');

        //list wordbook
            apiService.postUserwordbook(auth_token).then(function (response) {
                $scope.result = response.data.data;
                // console.log($scope.result);
            });
        // get uri    
        $scope._detail = function(uri){
            localStorage.setItem('wburi', uri);
        };
        
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

            $scope.submitEntry = function (word) {
                var voiceIdx = $scope.voices.indexOf($scope.optionSelected),
                    config = {
                    voiceIndex: voiceIdx,
                    rate: $scope.rate,
                    pitch: $scope.pitch,
                    volume: $scope.volume
                    };

                if(window.speechSynthesis) {
                    speech.sayText(word, config);
                }
            };

        //flash card
        $scope.hint = true;
        $scope.phint = false;
        $scope.difinition = false;
        $scope.pdifinition = false;
        $scope.hide1 = function () {
            $scope.hint = false;
            $scope.phint = true;
            $scope.difinition = true;
        }
        $scope.hide2 = function () {
            $scope.hint = false;
            $scope.phint = false;
            $scope.difinition = true;
            $scope.pdifinition = true;
        }
        $scope.hideall = function () {
            $scope.hint = true;
            $scope.phint = false;
            $scope.difinition = false;
            $scope.pdifinition = false;
        }


        //Ham lay danh sach cac tu
        apiService.word_today(auth_token, 'eng', 'vie').then(function (response) {
            $scope.today_wordsub = response.data.data;
            $scope.today_words = response.data.data;
            $scope.first_today_word =null;
            $scope.number_today_words = $scope.today_wordsub.length;
            if($scope.number_today_words > 0) $scope.first_today_word = $scope.today_wordsub[0];
            $scope.today_wordsub.splice(0,1);

            
            // $scope.hai.splice(0,0, $scope.first_today_word);
            console.log($scope.first_today_word);
            $scope.show = function(word){
                $scope.hidefirst = true;
                if($scope.today_words.length < $scope.number_today_words)
                {
                    $scope.today_words.splice(0,0, $scope.first_today_word);
                }
                for(var i=0; i<$scope.today_words.length; i++)
                {
                    if(word == $scope.today_words[i].word)
                    {
                        $scope.w_detail = $scope.today_words[i];
                    }
                }
            };
            console.log($scope.today_words);
            // console.log($scope.first_today_word);
        });

    })

    .controller('Wordbookdetail', function($scope, $rootScope, $location, $http, apiService, speech, $timeout, $localStorage, $state, $window){
        //Lay auth_token;
        // var auth_token = $localStorage.auth_token;
        var auth_token = window.localStorage.getItem('auth_token');
        var uri = localStorage.getItem('wburi');

        $scope.newwordbook = {};
        $scope.newwordbook.title = "";
        $scope.newwordbook.description = "";
        $scope.word = {};
        var words = [];
        $scope.langid;
        $scope.wordbookUri;
        $scope.title;
        //wordbook detail
            apiService.word_detail(auth_token, uri).then(function(response){
                $scope.wordbook_detail = response.data.data;
                words = response.data.data.words;
                $scope.langid = response.data.data.langid;
                $scope.wordbookUri = response.data.data.wordbookUri;
                $scope.title = response.data.data.title;
                console.log(response);
            });
        
        //update wordbook
         $scope.hide = true;
          //edit word from wordbook
            $scope.wordedit = function (idx) {
                index = idx;
                $scope.word.words = $scope.wordbook_detail.words[idx];
            };

          //delete word from wordbook
            $scope.worddelete = function (idx) {
                $scope.wordbook_detail.words.splice(idx, 1);
                console.log($scope.wordbook_detail.words)
                if ($scope.wordbook_detail.words.length == 0) {
                    $scope.hide = false;
                }
            };

            //update word to wordbook
            $scope.wordupdate = function (word) {
                 $scope.wordbook_detail.words.splice(index, 1);
                 $scope.wordbook_detail.words.splice(0, 0, word.words);
            };

             //save word to wordbook
            $scope.wordsave = function (word) {
                words.push(word.words);
                word.words = "";
                $scope.hide = true;
                console.log(words);
            };

             //save wordbook to server
            $scope.save = function (newwordbook) {
                var new_wordbook = {};
                if (newwordbook.title == "") {
                    new_wordbook.title = $scope.title;
                }
                else {
                    new_wordbook.title = newwordbook.title;
                }
                new_wordbook.description = new_wordbook.title + " Description";
                new_wordbook.words = words.toString();
                if (new_wordbook.words.length == 0) {
                    alert("You must add a least 1 word");
                }
                else {
                    // console.log($scope.langid, $scope.wordbookUri, new_wordbook);
                    apiService.wordbook_update(auth_token, $scope.wordbookUri, $scope.langid, new_wordbook).then(function (response) {
                        $scope.result = response.data;
                        if ($scope.result.response_code == "00") {
                            newwordbook.title = "";
                            newwordbook.description = "";
                            $scope.wordbook_detail.words = "";
                            words = "";
                            $scope.complete = true;
                            window.setTimeout(function () {
                                window.location.href = '#/word';
                            }, 1300);
                        }
                        else
                        {
                            alert($scope.result.response_message);
                        }
                    });
                }
            };

    });
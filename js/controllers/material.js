app
    .controller('MaterialCtrl', function ($scope, $sce, $rootScope, $location, $http, apiService, speech, $timeout, $localStorage, $state, $window, facebook) {

        //Lay auth_token;
        // var auth_token = $localStorage.auth_token;
        var auth_token = window.localStorage.getItem('auth_token');
        console.log('list material');

        $scope.model = {
            word: ""
        };

        //format url
        $scope.url = function (src) {
            return $sce.trustAsResourceUrl(src);
        }

        //  $scope.murl = {src:result.url_redirect};

        //text to speech
        $scope.support = false;
        if (window.speechSynthesis) {
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

            if (window.speechSynthesis) {
                speech.sayText(word, config);
            }
        };


        //Ham lay danh sach cac tu goi y
        apiService.material_user(auth_token, 'eng', 'vie', -1, 5).then(function (response) {
            $scope.user_materials = response.data.data.materials;
            console.log($scope.user_materials);
        });

        apiService.material_recommend(auth_token, 'eng', 'vie').then(function (response) {
            $scope.recommended_materials = response.data.data;
            console.log($scope.recommended_materials);
        });

        // modal audio
        $scope.getmaterial = function (title) {
            // console.log($scope.recommended_materials);
            for (var i = 0; i < $scope.recommended_materials.length; i++) {
                if (title == $scope.recommended_materials[i].title) {
                    $scope.modal = $scope.recommended_materials[i];
                    console.log($scope.modal);
                }
            }
        };


        //get uri
        $scope.m_detail = "";
        $scope.getdetail = function (uri) {
            localStorage.setItem('m_uri', uri);
        };
        // like material
        $scope.like = function (material_uri) {
            apiService.material_like(auth_token, material_uri).then(function (response) {
                apiService.material_recommend(auth_token, 'eng', 'vie').then(function (response) {
                    $scope.recommended_materials = response.data.data;
                });

                apiService.material_user(auth_token, 'eng', 'vie', -1, 5).then(function (response) {
                    $scope.user_materials = response.data.data.materials;
                });

            });
        };
        // comment material
        $scope.comment = function (material_uri, message) {
            apiService.material_comment(auth_token, material_uri, message).then(function (response) {
                console.log(response);
            });
        };
    })
    .controller('MaterialdetailCtrl', function ($scope, $sce, $rootScope, $location, $http, apiService, $localStorage, $state, $window, facebook) {
        var uri = localStorage.getItem('m_uri');
        var auth_token = window.localStorage.getItem('auth_token');
        $scope.username = localStorage.getItem('user_name');
        console.log($scope.username);

        //server
        function postDictionary(auth_token, keyword) {
            apiService.postDictionarylook(auth_token, keyword).then(function (response) {
                console.log(response.data);
                if (response.data.response_code == "00") {
                    $scope.nonword = false;
                    $scope.loadding = false;
                    $scope.lookdictionary = response.data.data;
                }
                else {
                    $scope.nonword = true;
                    $scope.loadding = false;
                }
                console.log(response.data.data);
            });
        };
        function postSuggestion(auth_token, keyword) {
            apiService.postSuggestions(auth_token, keyword).then(function (response) {
                $scope.suggestions = response.data.data;
                console.log($scope.suggestions);
                $scope.loadding = false;
                $scope.key = keyword;
            });
        }
        apiService.material_detail(auth_token, uri).then(function (response) {
            $scope.m_detail = response.data.data;
            Get_listcomment(auth_token, uri);
            console.log($scope.m_detail);
        });
        function material_Like(auth_token, material_uri) {
            apiService.material_like(auth_token, material_uri).then(function (response) {
                getlike();
            });
        }
        function getlike() {
            apiService.material_detail(auth_token, uri).then(function (response) {
                $scope.m_detail = response.data.data;
            });
        }
        function Get_listcomment(auth_token, material_uri) {
            apiService.material_listcomment(auth_token, material_uri).then(function (response) {
                $scope.list_comment = response.data.data.comments;
            });
        };



        //Client

        $scope.hoverIn = function () {
            $scope.hover = true;
            $scope.loadding = true;
            annot = $scope.m_detail.annot.langidToContentWords.eng.annotations;
            // for(var i=0; i < annot.length; i++)
            //         {
            //             if(annot[i].annotation == "``" || annot[i].annotation == "''")
            //             {
            //                 annot.splice(i, 1);
            //             }
            //         }
            //         console.log(annot.length);

            // alert($scope.model.word);  
            console.log($scope.model.word, $scope.model.id);
            if ($scope.m_detail.annot == null) {
                postDictionary(auth_token, $scope.model.word);
            }
            else{
                 postDictionary(auth_token, $scope.model.word);
                // if($scope.m_detail.annot.langidToContentWords.eng.annotations.length > 0)
                // {
                //     for(var i=0; i < annot.length; i++)
                //     {
                //         if($scope.model.id == i)
                //         {
                //             console.log(annot[i].annotation);
                //         }
                //     }
                // }
            }
            $scope.hidedefi = false;
        };

        //lookup material
        $scope.hidedefi = true;
        $scope.lookupm = function (keyword) {
            console.log(keyword);
            $scope.loadding = true;
            $scope.hover = false;
             apiService.postSuggestions(auth_token, keyword).then(function (response) {
                $scope.suggestions = response.data.data;
                console.log($scope.suggestions);
                $scope.loadding = false;
                $scope.key = keyword;
            });
        };

       
        $scope.search_click = function () {
            console.log($scope.key);
            $scope.loadding = true;
            postDictionary(auth_token, $scope.key);
            $scope.hidedefi = false;
            $scope.loadding = false;
        }

        //format url
        $scope.url = function (src) {
            return $sce.trustAsResourceUrl(src);
        }

        // modal audio
        $scope.getmaterial = function (title) {
            $scope.modal = $scope.m_detail;
            console.log($scope.modal);
        };

        // like material
        $scope.like = function (material_uri) {
            material_Like(auth_token, material_uri);
        };

        $scope.showedit = false;
        $scope.showcomment = false;

        //edit coment
        $scope.editcomment = function (index) {
            $scope.icomment = $scope.list_comment[index];
            $scope.save = function () {
                apiService.material_edit(auth_token, $scope.icomment.commentUri, $scope.icomment.message).then(function (response) {
                    console.log(response);
                });
            };
        };

        //add_comment
        $scope.add_comment = function (message, material_uri) {
            if (message == null || message == "") {
                alert("Content message not null");
            }
            else {
                apiService.material_comment(auth_token, material_uri, message).then(function (response) {
                    Get_listcomment(auth_token, uri);
                    getlike();
                });
            }
        };
    });
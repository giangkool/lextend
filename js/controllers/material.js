app
    .controller('MaterialCtrl', function ($scope, $sce, $rootScope, $location, $http, apiService, speech, $timeout, $localStorage, $state, $window, facebook) {

        //Lay auth_token;
        // var auth_token = $localStorage.auth_token;
        var auth_token = window.localStorage.getItem('auth_token');
        console.log('list material');

        //format url
        $scope.url = function(src){
            return $sce.trustAsResourceUrl(src);                               
        }

        //  $scope.murl = {src:result.url_redirect};

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


        //Ham lay danh sach cac tu goi y
        apiService.material_user(auth_token, 'eng', 'vie', -1, 5).then(function (response) {
            $scope.user_materials = response.data.data.materials;
            console.log($scope.user_materials);
        });

        apiService.material_recommend(auth_token, 'eng', 'vie').then(function (response) {
            $scope.recommended_materials = response.data.data;
            // console.log($scope.recommended_materials);
        });

        // modal audio
        $scope.getmaterial = function (title) {
            // console.log($scope.recommended_materials);
            for(var i=0; i<$scope.recommended_materials.length; i++)
            {
                if(title == $scope.recommended_materials[i].title)
                {
                    $scope.modal = $scope.recommended_materials[i];
                    console.log($scope.modal);
                }
            }
        };


        //get uri
        $scope.m_detail="";
        $scope.getdetail = function (uri) {
            localStorage.setItem('m_uri', uri);
        };
        // like material
        $scope.like = function (material_uri) {
            apiService.material_like(auth_token, material_uri). then(function (response) {
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
    .controller('MaterialdetailCtrl', function ($scope, $sce,  $rootScope, $location, $http, apiService, $localStorage, $state, $window, facebook) {
        var uri = localStorage.getItem('m_uri');
        var auth_token = window.localStorage.getItem('auth_token');
        $scope.username = localStorage.getItem('user_name');
        console.log($scope.username);
        //format url
        $scope.url = function(src){
            return $sce.trustAsResourceUrl(src);                               
        }

       // modal audio
        $scope.getmaterial = function (title) {
                    $scope.modal = $scope.m_detail;
                    console.log($scope.modal);
        };

        //detail material
            apiService.material_detail(auth_token, uri).then(function (response) {
                $scope.m_detail = response.data.data;
                Get_listcomment(auth_token, uri);
                    console.log($scope.m_detail);
            });
        
        // like material
        $scope.like = function (material_uri) {
            apiService.material_like(auth_token, material_uri). then(function (response) {
                getlike();
            });
        };

        //get like
         function getlike() {
              apiService.material_detail(auth_token, uri).then(function (response) {
                $scope.m_detail = response.data.data;
            });
         }
         $scope.showedit = false;
         $scope.showcomment = false;
        //list_comment material
        function Get_listcomment(auth_token, material_uri) {
            apiService.material_listcomment(auth_token, material_uri).then(function (response) {
                $scope.list_comment = response.data.data.comments;
            });
        };

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
            apiService.material_comment(auth_token, material_uri, message).then(function (response) {
                Get_listcomment(auth_token, uri);
                getlike();
            });
        };

    });
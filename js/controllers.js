String.prototype.replaceAll = function( token, newToken, ignoreCase ) {
    var _token;
    var str = this + "";
    var i = -1;

    if ( typeof token === "string" ) {

        if ( ignoreCase ) {

            _token = token.toLowerCase();

            while( (
                i = str.toLowerCase().indexOf(
                    _token, i >= 0 ? i + newToken.length : 0
                ) ) !== -1
            ) {
                str = str.substring( 0, i ) +
                    newToken +
                    str.substring( i + token.length );
            }

        } else {
            return this.split( token ).join( newToken );
        }

    }
return str;
};

var app  = angular.module('Lextend.controller', ['ngRoute', 'ngStorage', 'dataServices', 'ui.router', 'ngSanitize', 'bnx.module.facebook', 'directive.g+signin']);
app
    

    /**
     * Controls all other Pages
     */
    
    .controller('RegisterCtrl', function ($scope, $location, $http, apiService, $localStorage, $window) {
        function isEmail(email) {
            var isValid = false;
            var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (regex.test(email)) {
                isValid = true;
            }
            return isValid;
        };
        $scope.Register = function (user) {
            if (isEmail(user.email)) {
                if (user.password_1 == user.password_2) {
                    apiService.postRegister(user.username, user.email, user.password_2).then(function (response) {
                        $scope.result = response.data;
                        console.log(response);
                        if ($scope.result.auth_token) {
                            $scope.isLogin = true;
                            $scope.success = true;
                            $scope.nof = "Account registration successful!";
                            alert("Account registration successful! please choose new language to start");
                            window.localStorage.setItem('auth_token', $scope.result.auth_token);
                            window.setTimeout(function () {


                                //get setting
                                apiService.getSettings($scope.result.auth_token).then(function (response) {
                                    $scope.isLogin = true;
                                    var langmap
                                    apiService.getSupportlanguage($scope.result.auth_token).then(function (response) {
                                        $scope.result = response.data;
                                        langmap = response.data.data.langMap;
                                        var languagepairs = response.data.data.languagePairs;
                                        var langid = [];
                                        var vialangid = [];
                                        var arraylang = [];
                                        $scope.lang = arraylang;
                                        for (var i = 0; i < languagepairs.length; i++) {
                                            var key;
                                            var value;
                                            for (var keyName in langmap) {
                                                key = keyName;
                                                value = langmap[keyName];
                                                if (languagepairs[i].langid == key) {
                                                    langid = value;
                                                }
                                                if (languagepairs[i].vialangid == key) {
                                                    vialangid = value;
                                                }
                                            }
                                            arraylang.push({ langid, vialangid });

                                        }

                                        for (var a = 0; a < arraylang.length; a++) {
                                            if (arraylang[a].langid == null) {
                                                arraylang.splice(a, 1);
                                            }
                                            if (arraylang[a].vialangid == null) {
                                                arraylang.splice(a, 2);
                                            }
                                        }
                                    });
                                    $scope.ln = "";
                                    $scope.new = function (ln) {
                                        auth_token = window.localStorage.getItem('auth_token');
                                        for (var keyName in langmap) {
                                            key = keyName;
                                            value = langmap[keyName];
                                            if (ln.langid == value) {
                                                lang = keyName;
                                            }
                                            if (ln.vialangid == value) {
                                                vialang = keyName;
                                            }
                                        }
                                        console.log(auth_token);
                                        apiService.postNewlanguage(auth_token, lang, vialang).then(function (response) {
                                            $scope.settings = response.data;
                                            if ($scope.settings.settings) {
                                                $scope.success2 = true;
                                                window.setTimeout(function () {
                                                    $window.location.href = '#/';
                                                    $window.location.reload(true);
                                                }, 5000);
                                            }
                                        });
                                    }

                                });


                            }, 3000);
                        }
                    }, function (error) {
                        $scope.error = true;
                        $scope.nof = error;
                        console.log($scope.nof)
                        console.log('opsssss' + error);
                        $scope.error_message = "Có lỗi trong quá trình xử lý";
                    });
                }
                else {
                    $scope.error = true;
                    $scope.nof = "incorrect re-password";
                    console.log($scope.nof);
                    user.password_1 = "";
                    user.password_2 = "";
                }
            }
            else {
                $scope.error = true;
                $scope.nof = "incorrect Email";
                console.log($scope.nof)
                user.email = "";
            }
        }
    })
    .controller('WordCtrl', function ($scope, $location, $http, apiService, $localStorage) {
        var auth_token = window.localStorage.getItem('auth_token');
        if (!auth_token) {
            window.location.href = '#/login';
        }
        else {
            apiService.postUserwordbook(auth_token).then(function (response) {
                $scope.result = response.data.data;
                console.log($scope.result);
            });
        }

    })
    .controller('CreateWordbookCtrl', function ($scope, $location, $http, apiService, $localStorage) {
        var auth_token = window.localStorage.getItem('auth_token');
        $scope.newwordbook = {};
        $scope.newwordbook.title = "";
        $scope.newwordbook.description = "";

        var words = [];
        var index = "";
        $scope.listwords = words;

        $scope.word = {};
        if (!auth_token) {
            window.location.href = '#/login';
        }
        else {
            //edit word from wordbook
            $scope.wordedit = function (idx) {
                index = idx;
                $scope.word.words = $scope.listwords[idx];
                // $scope.listwords.splice(idx, 1);
                console.log($scope.listwords[idx]);
            }
            //delete word from wordbook
            $scope.worddelete = function (idx) {
                $scope.listwords.splice(idx, 1);
                if ($scope.listwords.length == 0) {
                    $scope.hide = false;
                }
                console.log($scope.listwords);
            };
            //update word to wordbook
            $scope.wordupdate = function (word) {
                words.splice(index, 1);
                words.splice(0, 0, word.words);
                console.log(words);
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
                    new_wordbook.title = "Lextend";
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
                    apiService.postCreateWordbook(auth_token, new_wordbook).then(function (response) {
                        $scope.result = response.data.data;
                        if ($scope.result) {
                            newwordbook.title = "";
                            newwordbook.description = "";
                            $scope.listwords = "";
                            words = "";
                            $scope.complete = true;
                            window.setTimeout(function () {
                                window.location.href = '#/word';
                            }, 900);
                        }
                        console.log($scope.result);
                    });
                }
            }
        }
    })
    .controller('AddsyswordbookCtrl', function ($scope, $location, $http, apiService, $localStorage) {
        var auth_token = window.localStorage.getItem('auth_token');
        if (!auth_token) {
            window.location.href = '#/login';
        }
        else {

            // get setting
            apiService.getSettings(auth_token).then(function (response) {
                for(var i=0; i<response.data.settings.length; i++)
                {
                    $scope.lang = response.data.settings[i].langid;
                }
                console.log($scope.lang);
            });
            
            //get syswordbook
            apiService.postSystemwordbook(auth_token, $scope.lang).then(function (response) {
                $scope.result = response.data.data;
                // console.log($scope.result);
            });
            
            //add syswordbook
            $scope.add = function (uri) {
                //get detail
                 apiService.word_detail(auth_token, uri).then(function(response){
                        var new_wordbook ={};
                        $scope.wordbook_detail = response.data.data;
                        new_wordbook.title = response.data.data.title;
                        new_wordbook.description = response.data.data.description;
                        new_wordbook.words = response.data.data.words.toString();
                        
                        console.log(new_wordbook)
                        
                        // create wordbook
                        apiService.postCreateWordbook(auth_token, new_wordbook).then(function (response) {
                        $scope.result = response.data;
                        if ($scope.result.response_code == "00") {
                            alert("Add system wordbook to user wordbook complete !");
                            window.setTimeout(function () {
                                window.location.href = '#/word';
                            }, 100);
                        }
                        else
                        {
                            alert($scope.result.response_message);
                        }
                        console.log($scope.result);
                    });

                });
            };
        }
    })
    .controller('CreateMaterialCtrl', function ($scope, $location, $http, apiService, $localStorage){
             var auth_token = window.localStorage.getItem('auth_token');
        if (!auth_token) {
            window.location.href = '#/login';
        }
        else
        {
             // get setting
            apiService.getSettings(auth_token).then(function (response) {
                for(var i=0; i<response.data.settings.length; i++)
                {
                    $scope.lang = response.data.settings[i].langid;
                    console.log(response);
                     for (var vialangid in response.data.settings[i].viaLangids) {
                            var value = response.data.settings[i].viaLangids[vialangid];
                            $scope.vialang = value;
                    }
                }
            });

            $scope.creatematerial = function (material) {
                apiService.postCreateMaterial(auth_token, $scope.lang, $scope.vialang, material).then(function (response) {
                    if(response.data.response_code == "00")
                    {
                         alert("Create material complete !");
                            window.setTimeout(function () {
                                window.location.href = '#/material';
                            }, 100);
                    }
                    else
                    {
                        alert($scope.result.response_message);
                    }
                    console.log(response);
                });
            };
        }
    })
    .controller('EditMaterialCtrl',  function ($scope, $location, $http, apiService, $localStorage){
        var auth_token = window.localStorage.getItem('auth_token');
        var uri = localStorage.getItem('m_uri');
        if (!auth_token) {
            window.location.href = '#/login';
        }
        else
        {
            //detail material
            apiService.material_detail(auth_token, uri).then(function (response) {
                $scope.m_detail = response.data.data;
                console.log($scope.m_detail);
                
                $scope.materials=[];
                $scope.materials.title = "";
                $scope.materials.content = $scope.m_detail.material.content;
                $scope.updatematerial = function (material) {
                    material = [];
                    if($scope.materials.title == "")
                    {
                        material.title = $scope.m_detail.material.title;
                    }
                    else{
                         material.title = $scope.materials.title;
                    }
                    material.content = $scope.materials.content;
                    material.uri = uri;
                    apiService.postUpdateMaterial(auth_token, $scope.lang, $scope.vialang, material).then(function (response) {
                        if(response.data.response_code == "00")
                        {
                             alert("Update material complete !");
                                window.setTimeout(function () {
                                    window.location.href = '#/material-detail/'+material.title;
                                }, 100);
                        }
                        else
                        {
                            alert($scope.result.response_message);
                        }
                        console.log(response);
                    });
                };
            });

             // get setting
            apiService.getSettings(auth_token).then(function (response) {
                for(var i=0; i<response.data.settings.length; i++)
                {
                    $scope.lang = response.data.settings[i].langid;
                    console.log(response);
                     for (var vialangid in response.data.settings[i].viaLangids) {
                            var value = response.data.settings[i].viaLangids[vialangid];
                            $scope.vialang = value;
                    }
                }
            });
        }
    })
    .controller('OtherCtrl', function ($scope, $location, $http, apiService, $localStorage) {
        var auth_token = window.localStorage.getItem('auth_token');
        if (!auth_token) {
            window.location.href = '#/login';
        }
        else {

            //get setting
            apiService.getSettings(auth_token).then(function (response) {
                $scope.settings = response.data.settings;
                console.log($scope.settings)
                var langmap
                apiService.getSupportlanguage(auth_token).then(function (response) {
                    $scope.result = response.data;
                    langmap = response.data.data.langMap;
                    var langid = [];
                    var vialangid = [];
                    var arraylang = [];
                    $scope.lang3 = arraylang;
                    for (var i = 0; i < $scope.settings.length; i++) {
                        var key;
                        var value;
                        for (var keyName in langmap) {
                            key = keyName;
                            value = langmap[keyName];
                            if ($scope.settings[i].langid == key) {
                                langid = value;
                            }
                            for (var langkey in $scope.settings[i].viaLangids) {
                                var key2 = langkey;
                                var value2 = $scope.settings[i].viaLangids[langkey];
                                if (value2 == key) {
                                    vialangid = value;
                                }
                            }
                        }
                        arraylang.push({ langid, vialangid });

                    }

                    for (var a = 0; a < arraylang.length; a++) {
                        if (arraylang[a].langid == null) {
                            arraylang.splice(a, 1);
                        }
                        if (arraylang[a].vialangid == null) {
                            arraylang.splice(a, 2);
                        }
                    }
                });
            });

            $scope.getsupport = function () {
                //get setting
                apiService.getSettings(auth_token).then(function (response) {
                    $scope.settings = response.data.settings;
                    console.log($scope.settings)
                    var langmap
                    apiService.getSupportlanguage(auth_token).then(function (response) {
                        $scope.result = response.data;
                        langmap = response.data.data.langMap;
                        var langid = [];
                        var vialangid = [];
                        var startLevel = "";
                        var arraylang = [];
                        $scope.lang2 = arraylang;
                        $scope.ln1 = "";
                        $scope.demo = function (ln1) {
                            $scope.level = ln1.startLevel;
                        }
                        for (var i = 0; i < $scope.settings.length; i++) {
                            var key;
                            var value;
                            startLevel = $scope.settings[i].startLevel;
                            for (var keyName in langmap) {
                                key = keyName;
                                value = langmap[keyName];
                                if ($scope.settings[i].langid == key) {
                                    langid = value;
                                }
                                for (var langkey in $scope.settings[i].viaLangids) {
                                    var key2 = langkey;
                                    var value2 = $scope.settings[i].viaLangids[langkey];
                                    if (value2 == key) {
                                        vialangid = value;
                                    }
                                }
                            }
                            arraylang.push({ langid, vialangid, startLevel });
                        }

                        for (var a = 0; a < arraylang.length; a++) {
                            if (arraylang[a].langid == null) {
                                arraylang.splice(a, 1);
                            }
                            if (arraylang[a].vialangid == null) {
                                arraylang.splice(a, 2);
                            }
                        }
                        console.log(vialangid);
                        console.log($scope.lang2);
                    });
                });

                apiService.getSupportlanguage(auth_token).then(function (response) {
                    $scope.result = response.data;
                    angular.forEach($scope.result, function (item) {
                        $scope.lan = item.languagePairs;
                    });
                    console.log($scope.result);

                    var langmap
                    apiService.getSupportlanguage($scope.result.auth_token).then(function (response) {
                        $scope.result = response.data;
                        langmap = response.data.data.langMap;
                        var languagepairs = response.data.data.languagePairs;
                        var langid = [];
                        var vialangid = [];
                        var arraylang = [];
                        $scope.lang = arraylang;
                        for (var i = 0; i < languagepairs.length; i++) {
                            var key;
                            var value;
                            for (var keyName in langmap) {
                                key = keyName;
                                value = langmap[keyName];
                                if (languagepairs[i].langid == key) {
                                    langid = value;
                                }
                                if (languagepairs[i].vialangid == key) {
                                    vialangid = value;
                                }
                            }
                            arraylang.push({ langid, vialangid });

                        }

                        for (var a = 0; a < arraylang.length; a++) {
                            if (arraylang[a].langid == null) {
                                arraylang.splice(a, 1);
                            }
                            if (arraylang[a].vialangid == null) {
                                arraylang.splice(a, 2);
                            }
                        }
                        console.log($scope.lang);
                    });
                    $scope.ln = "";
                    $scope.new = function (ln) {
                        console.log(ln);
                        auth_token = window.localStorage.getItem('auth_token');
                        for (var keyName in langmap) {
                            key = keyName;
                            value = langmap[keyName];
                            if (ln.langid == value) {
                                lang = keyName;
                            }
                            if (ln.vialangid == value) {
                                vialang = keyName;
                            }
                        }
                        console.log(auth_token);
                        apiService.postNewlanguage(auth_token, lang, vialang).then(function (response) {
                            $scope.settings = response.data;
                            if ($scope.settings.settings) {
                                $scope.success2 = true;
                                console.log($scope.settings);
                                $window.location.reload(true);
                                // window.setTimeout(function () {
                                //     // $window.location.href = '#/';
                                //     // $window.location.reload(true);
                                // }, 5000);
                            }
                        });

                    }
                });
            }
        }
    })
    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });
    
                    event.preventDefault();
                }
            });
        };
    })
    .directive('wordUnderCursor', function() {
  return {
    scope: {
      wordUnderCursor: "=",
      wordUnderId: "=",
      wordUnderCursorContent: "="
    },
    link: function(scope, elment) {

      scope.$watch('wordUnderCursorContent', function(newValue) {
        // console.log(newValue);
        newValue2 = "";
        if (newValue) {
          var $element = $(elment);

        $element.html(newValue.replace(/\b(\w+)\b/g, "<span>$1</span>"));
        //   $element.find('span').hover(
        //     function() {
        //       var $span = $(this);
        //       $span.css('background-color', '#ffff66');
        //       scope.$apply(function() {
        //         scope.wordUnderCursor = $span.text();
        //         console.log($span.text());
        //       });
        //     },
        //     function() {
        //       var $span = $(this);
        //       $span.css('background-color', '');
        //       scope.$apply(function() {
        //         scope.wordUnderCursor = "";
        //       });
        //     }
        //   );

          $element.find('span').click(
              function(){
                 var $span = $(this);
            //   $span.css('background-color', '#ffff66');
              scope.$apply(function() {
                scope.wordUnderCursor = $span.text();
                scope.wordUnderId = $span.index();
              });
            }); 



        }
      });
    }
  }
});
    
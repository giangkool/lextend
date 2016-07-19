app
    .controller('LoginCtrl', function ($scope, $rootScope, $location, $http, apiService, $localStorage, $timeout, $state, $window, facebook) {
        //logout
        window.localStorage.clear();
        console.log("Clean storage");

        function Postlogin(user, password) {
            apiService.postLogin(user, password).then(function (response) {
                if (!response || !response.data.response_code || response.data.response_code != '00') {
                    $scope.error = true;
                    //auto hide
                    $timeout(function () { $scope.error = false; }, 3000);  
                    user.username = "";
                    user.password = "";
                    console.log(response);
                    return;
                };

                console.log('Login success');
                $scope.isLogin = false;
                // $localStorage.auth_token = response.data.auth_token;
                localStorage.setItem('user_name', user);
                window.localStorage.setItem('auth_token', response.data.auth_token);
                console.log('auth_token - login:', $localStorage.auth_token);
                window.location.href = '#/';
                $window.location.reload(true);
            });
        };

        

        function Postregister(user, email, password) {
            apiService.postRegister(user, email, password).then(function (response) {
                $scope.result = response.data;
                console.log(response);
                if (response.data.response_code == "00") {
                    $scope.isLogin = true;
                    $scope.success = false;
                    $scope.nof = "Account registration successful!";
                    alert("Account registration successful! please choose new language to start");
                    window.localStorage.setItem('auth_token', $scope.result.auth_token);
                    window.setTimeout(function () {
                        Getsetting();
                    }, 3000);
                }
                else {
                    Postlogin(user, password);
                }
            }, function (error) {
                $scope.error = true;
                $scope.nof = error;
                console.log($scope.nof)
                console.log('opsssss' + error);
                $scope.error_message = "Có lỗi trong quá trình xử lý";
            });
        };

        function Getsetting() {
            //get setting
            apiService.getSettings($scope.result.auth_token).then(function (response) {
                $scope.isLogin = true;
                var langmap;
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
                            $scope.success = true;
                            window.setTimeout(function () {
                                $window.location.href = '#/';
                                $window.location.reload(true);
                            }, 5000);
                        }
                    });
                }

            });
        };

        //facebook login
        //logout
        $scope.$on('fb.auth.authResponseChange', function (event, response) {
            $scope.$apply(function () {
                $scope.connected = (response.status == 'connected');
                if ($scope.connected) {
                    facebook.logout();
                }
            });
        });

        //login
        $scope.$on('fb.auth.authResponseChange', function (event, response) {
            $scope.$apply(function () {
                facebook.api('me').then(function (result) {
                    userf = result.id;
                    mailf = "lextend@gmail.com";
                    passwordf = "123456";
                    Postregister(userf, mailf, passwordf);
                });
            });
        });


        //google login
        //logout
        $scope.$on('event:google-plus-signin-success', function (event, authResult) {
            gapi.auth2.getAuthInstance().disconnect();
        });

        //login
        $scope.$on('event:google-plus-signin-success', function (event, authResult) {
            $scope.resultg = authResult;
            angular.forEach($scope.resultg, function (item) {
                userg = item.hg;
            });
            password = "123456";
            Postregister(userg, userg, password);
        });

        //Login with user name and password
        $scope.signIn = function (user) {
            if (!user.username || !user.password) {
                return;
            }
            //Call service
            Postlogin(user.username, user.password);
        };

        var get_profile = function (auth_token) {

        };
    })
    .controller('RegisterCtrl', function ($scope, $location, $http, apiService, $localStorage, $window) {
        function isEmail(email) {
            var isValid = false;
            var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (regex.test(email)) {
                isValid = true;
            }
            return isValid;
        };
        function Getsetting() {
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
        }

        function Postregister(user) {
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
                        Getsetting();
                    }, 3000);
                }
            }, function (error) {
                $scope.error = true;
                $scope.nof = error;
                console.log($scope.nof)
                console.log('opsssss' + error);
                $scope.error_message = "Có lỗi trong quá trình xử lý";
            });
        };


        $scope.Register = function (user) {
            if (isEmail(user.email)) {
                if (user.password_1 == user.password_2) {
                    console.log("OK");
                    Postregister(user);
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
        };
    })
    .controller('ForgotCtrl', function ($scope, $location, $http, apiService, $localStorage, $window) {
        $scope.username="";
        $scope.success = false;
        $scope.error = false;

        $scope.forgot = function(){
            apiService.postForgot($scope.username).then(function (response){
                var result = response.data;
                console.log(result);
                if(result.response_code == "00")
                {
                    $scope.success = true;
                }
                else
                {
                    $scope.error = true;
                }

            });
        };
    });
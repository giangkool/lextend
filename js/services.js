angular.module('Lextend.services', []);
angular.module('dataServices', [])
    .factory('speech', function(){
        if(window.speechSynthesis) {
            var msg = new SpeechSynthesisUtterance();
        }
        function getVoices() {
       
            window.speechSynthesis.getVoices();
          return window.speechSynthesis.getVoices();
        }
        function sayIt(text, config) {
            var voices = getVoices();
         
            //choose voice. Fallback to default
            msg.voice = config && config.voiceIndex ? voices[config.voiceIndex] : voices[0];
            msg.volume = config && config.volume ? config.volume : 1;
            msg.rate = config && config.rate ? config.rate : 1;
            msg.pitch = config && config.pitch ? config.pitch : 1;

            //message for speech
            msg.text = text;

            speechSynthesis.speak(msg);
        }
        return {
            sayText: sayIt,
            getVoices: getVoices
        };
    })

    .factory('apiService', function ($http, $rootScope) {
        // var api_gateway_url ='http://192.168.99.100:3000/api/';
        var api_gateway_url ='http://210.211.116.19:4000/api/';

        return {
            //Material APIs
            material_recommend: function (auth_token, lang_id, lang_via) {
                var parameter = JSON.stringify({ lang_id: lang_id, lang_via_id: lang_via });
                var url = api_gateway_url + 'material/recommended';
                var header = { headers: { 'Content-Type': 'application/json', 'app_id': 'lextenweb_1.0.0.0', auth_token: auth_token } };
                return $http.post(url, parameter, header);
            },

            material_user: function (auth_token, lang_id, lang_via, page_index, page_size) {
                if (!page_index) page_index = -1;
                if (!page_size) page_size = 10;
                var parameter = JSON.stringify({ lang_id: lang_id, lang_via_id: lang_via, page: page_index, limit: page_size });
                var url = api_gateway_url + 'material/user_material';
                var header = { headers: { 'Content-Type': 'application/json', 'app_id': 'lextenweb_1.0.0.0', auth_token: auth_token } };
                return $http.post(url, parameter, header);
            },

            material_detail: function (auth_token, material_uri) {
                var parameter = JSON.stringify({material_uri});
                var url = api_gateway_url + 'material/detail';
                var header = { headers: { 'Content-Type': 'application/json', 'app_id': 'lextenweb_1.0.0.0', auth_token: auth_token } };
                return $http.post(url, parameter, header);
            },

            material_like: function (auth_token, material_uri) {
                var parameter = JSON.stringify({material_uri});
                var url = api_gateway_url + 'material/like';
                var header = { headers: { 'Content-Type': 'application/json', 'app_id': 'lextenweb_1.0.0.0', auth_token: auth_token } };
                return $http.post(url, parameter, header);
            },

            material_comment: function (auth_token, material_uri, message) {
                var parameter = JSON.stringify({material_uri, message});
                var url = api_gateway_url + 'material/add_comment';
                var header = { headers: { 'Content-Type': 'application/json', 'app_id': 'lextenweb_1.0.0.0', auth_token: auth_token } };
                return $http.post(url, parameter, header);
            },

            material_edit: function (auth_token, comment_uri, message) {
                var parameter = JSON.stringify({comment_uri: comment_uri, message: message});
                var url = api_gateway_url + 'material/edit_comment';
                var header = { headers: { 'Content-Type': 'application/json', 'app_id': 'lextenweb_1.0.0.0', auth_token: auth_token } };
                return $http.post(url, parameter, header);
            },

            material_listcomment: function (auth_token, material_uri) {
                var parameter = JSON.stringify({material_uri:material_uri, page:-2});
                var url = api_gateway_url + 'material/list_comments';
                var header = { headers: { 'Content-Type': 'application/json', 'app_id': 'lextenweb_1.0.0.0', auth_token: auth_token } };
                return $http.post(url, parameter, header);
            },
            //Word APIs
            word_today: function (auth_token, lang_id, lang_via) {
                var parameter = JSON.stringify({ lang_id: lang_id, lang_via_id: lang_via});
                var url = api_gateway_url + 'word/today_words';
                var header = { headers: { 'Content-Type': 'application/json', 'app_id': 'lextenweb_1.0.0.0', auth_token: auth_token } };
                return $http.post(url, parameter, header);
            },

            word_detail: function (auth_token, wordbook_uri) {
                var parameter = JSON.stringify({wordbook_uri:wordbook_uri});
                var url = api_gateway_url + 'learn/get_wordbook';
                var header = { headers: { 'Content-Type': 'application/json', 'app_id': 'lextenweb_1.0.0.0', auth_token: auth_token } };
                return $http.post(url, parameter, header);
            },

            wordbook_update: function (auth_token, wordbook_uri, lang_id, wordbook) {
                var parameter = JSON.stringify({wordbook_uri:wordbook_uri, lang:lang_id, title:wordbook.title, description:wordbook.description, words:wordbook.words});
                var url = api_gateway_url + 'learn/update_wordbook';
                var header = { headers: { 'Content-Type': 'application/json', 'app_id': 'lextenweb_1.0.0.0', auth_token: auth_token } };
                return $http.post(url, parameter, header);
            },

            postLogin: function (username, password) {
                var parameter = JSON.stringify({ username: username, password: password });
                var url = api_gateway_url + "auth/internal";
                return $http.post(url, parameter, { headers: { 'Content-Type': 'application/json', 'app_id': 'lextenweb_1.0.0.0' } });
            },
            postRegister: function (username, email, password) {
                var parameter = JSON.stringify({ username: username, email: email, password: password });
                var url = api_gateway_url + "profile/register";
                return $http.post(url, parameter, { headers: { 'Content-Type': 'application/json', 'app_id': 'lextenweb_1.0.0.0' } });
            },
            postForgot: function (username) {
                var parameter = JSON.stringify({username:username});
                var url = api_gateway_url + "auth/forgot_password";
                return $http.post(url, parameter, {headers: {'Content-Type': 'application/json', 'app_id': 'lextenweb_1.0.0.0'} });
            },
            postSuggestions: function (auth_token, word) {
                console.log(word);
                var parameter = JSON.stringify({ from_lang: 'eng', to_lang: 'vie', word: word });
                var url = api_gateway_url + "dictionary/lookup_suggestions";
                return $http.post(url, parameter, { headers: { 'Content-Type': 'application/json', 'app_id': 'lextenweb_1.0.0.0', 'auth_token': auth_token } });
            },
            postDictionarylook: function (auth_token, word) {
                var parameter = JSON.stringify({ from_lang: 'eng', to_lang: 'vie', word: word, show_example: true });
                var url = api_gateway_url + "dictionary/lookup";
                return $http.post(url, parameter, { headers: { 'Content-Type': 'application/json', 'app_id': 'lextenweb_1.0.0.0', 'auth_token': auth_token } });
            },
            postSystemwordbook: function (auth_token, lang) {
                var parameter = JSON.stringify({ lang: lang, page_index: -1, page_size: 10 });
                var url = api_gateway_url + "learn/system_wordbooks";
                return $http.post(url, parameter, { headers: { 'Content-Type': 'application/json', 'app_id': 'lextenweb_1.0.0.0', 'auth_token': auth_token } });
            },
            postUserwordbook: function (auth_token) {
                var parameter = JSON.stringify({ page_index: -1, page_size: 10 });
                var url = api_gateway_url + "learn/user_wordbooks";
                return $http.post(url, parameter, { headers: { 'Content-Type': 'application/json', 'app_id': 'lextenweb_1.0.0.0', 'auth_token': auth_token } });
            },
            postCreateWordbook: function (auth_token, newwordbook) {
                var parameter = JSON.stringify({ lang: 'eng', title: newwordbook.title, description: newwordbook.description, words: newwordbook.words });
                var url = api_gateway_url + "learn/create_wordbook";
                return $http.post(url, parameter, { headers: { 'Content-Type': 'application/json', 'app_id': 'lextenweb_1.0.0.0', 'auth_token': auth_token } });
            },
            postCreateMaterial: function (auth_token, lang, vialang, material) {
                var parameter = JSON.stringify({ lang_id: lang, lang_via_id: vialang, title: material.title, content: material.content});
                var url = api_gateway_url + "material/create";
                return $http.post(url, parameter, { headers: { 'Content-Type': 'application/json', 'app_id': 'lextenweb_1.0.0.0', 'auth_token': auth_token } });
            },
            postNewlanguage: function (auth_token, lang, vialang) {
                var parameter = JSON.stringify({ lang: lang, vialang: vialang });
                var url = api_gateway_url + "learn/language_new";
                return $http.post(url, parameter, { headers: { 'Content-Type': 'application/json', 'app_id': 'lextenweb_1.0.0.0', 'auth_token': auth_token } });
            },
            getProfile: function (auth_token) {
                var url = api_gateway_url + "profile";
                return $http.get(url, { headers: { 'Content-Type': 'application/json', 'app_id': 'lextenweb_1.0.0.0', 'auth_token': auth_token } });
            },
            getSupportlanguage: function (auth_token) {
                var url = api_gateway_url + "learn/supported_languages";
                return $http.get(url, { headers: { 'Content-Type': 'application/json', 'app_id': 'lextenweb_1.0.0.0', 'auth_token': auth_token } });
            },
            getSettings: function (auth_token) {
                var url = api_gateway_url + "learn/language_settings";
                return $http.get(url, { headers: { 'Content-Type': 'application/json', 'app_id': 'lextenweb_1.0.0.0', 'auth_token': auth_token } });
            }
        }
    });
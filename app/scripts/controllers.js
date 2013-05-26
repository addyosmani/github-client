'use strict';

/* Controllers */

var MyCtrlAuth = ['$scope', '$http', '$location', function ($scope, $http, $location) {
    function onGetToken (msg) {
        var code = msg && msg.data ? (msg.data || '').split("=")[1] || null : null;
        if (code) {
            $http.post('http://vc.zz.mu/proxy.php?url=https://github.com/login/oauth/access_token', {client_id: app.id, client_secret: app.secret, code: code})
                .success(function (data) {
                    var token = null;

                    switch (typeof (data && data.contents || undefined)) {
                        case 'string':
                            data = data.contents.indexOf(/\r\n\r\n/) !== -1 ? data.contents.split(/\r\n\r\n/)[1] || null : data.contents;
                            if (data) {
                                var params = data.split('&'), param;
                                data = {};
                                for (var i = params.length; i--;) {
                                    param = params[i].split('=');
                                    param.length === 2 ? data[param[0]] = param[1] : null;
                                }
                                token = data['access_token'] || null;
                            }
                            break;
                        case 'object':
                            token = data.contents['access_token'] || null;
                            break;
                    }
                    if (token) {
                        app.token = token;
                        $http.defaults.headers.common['Authorization'] = 'token ' + app.token;
                        // $location.path('/list') invalid

                        if(!!navigator.mozNotification && !!navigator.vibrate){
                            var notification = navigator.mozNotification.createNotification(
                                "See this", 
                                "Login successful!"
                            );
                             notification.show();
                            var vibrating =  navigator.vibrate(2000);
                        }

                        location.hash = '/list';
                    } else {
                        console.error("parse token");
                    }
                })
                .error(function () {
                    console.error("get token");
                });
        }
    }

    // unbind & one so invalid
    if (!window['angular-post-message']) {
        window['angular-post-message'] = true;
        angular.element(window).bind("message", angular.bind(this, onGetToken));
    }

    $scope.auth = function (href) {
        var h = window.open(href, 'authWindow', 'width=800,height=600,menubar=0,status=0,titlebar=0,toolbar=0');
        h.focus();
	};
}];

var MyCtrlRepList = ['$scope', '$location', 'Repos', function ($scope, $location, Repos) {
    if (!app.token) {
        $location.path('/auth');
        return undefined;
    }

    $scope.repos = Repos.query();
}];

var MyCtrlRepEdit = ['$scope', '$location', '$routeParams', 'Repos', function ($scope, $location, $routeParams, Repos) {
    if (!app.token) {
        $location.path('/auth');
        return undefined;
    }

    $scope.item = Repos.get({owner: $routeParams.user, id: $routeParams.id});

    $scope.save = function () {
		$scope.item.$save({owner: $scope.item.owner.login, id: $scope.item.name}, function(){ $location.path('/list'); });
	};
}];
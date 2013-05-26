'use strict';

angular.module('myApp.services', ['ngResource'])
    .value('version', '0.1')
    .config(function ($httpProvider) {
        //
    })
	.factory('Repos', function ($resource) {
		return $resource(app.prefix + ':prefix/repos/:owner/:id', {}, {
            query: {method: 'GET', params: {prefix: 'user'}, isArray: true},
            get: {method: 'GET', params:{owner: '@owner', id: '@id'}}
        });
	});
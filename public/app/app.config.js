(function() {
	'use strict';

	angular
		.module('app')
		.config(config);

	config.$inject = ['$routeProvider', '$locationProvider'];

	function config($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				templateUrl: '/app/home/home.html',
				controller: 'HomeController',
				controllerAs: 'vm'
			})
			.otherwise({
				redirectTo: '/'
			}); //$routeProvider()

		// $locationProvider.html5Mode({enable: true, requireBase: true}).hashPrefix('!');
		$locationProvider.html5Mode(true);
	} //config()

}()); //IIFE
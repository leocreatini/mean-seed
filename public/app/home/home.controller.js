(function(){
	'use strict';

	angular
		.module('app')
		.controller('HomeController', HomeController);

	HomeController.$inject = ['$scope', '$log'];

	function HomeController($scope, $log) {
		/*jshint validthis: true*/
		var vm = this;

		vm.link = 'Home Controller is Linked.';

		vm.message = 'Use the view model \'vm\' to two-way bind the controller with the view.';

	} //HomeController()

}()); //IIFE
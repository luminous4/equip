function config($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/index/calendar");


	$stateProvider

		.state('index', {
			abstract: true,
			url: "/index",
			templateUrl: "components/common/content.html"
		})
		.state('index.calendar', {
			url: "/calendar",
			templateUrl: "components/calendar/calendar.html",
			data: { pageTitle: 'Example view' }
		})
}
angular
	.module('equip')
	.config(config)
	.run(function($rootScope, $state) {
		$rootScope.$state = $state;
	});

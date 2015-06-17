function config($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/index/home");


	$stateProvider

		.state('index', {
			abstract: true,
			url: "/index",
			templateUrl: "components/common/content.html"
		})
		.state('index.home', {
			url: "/home",
			templateUrl: "components/home/home.html",
			data: { pageTitle: 'Home' }
		})
		.state('index.calendar', {
			url: "/calendar",
			templateUrl: "components/calendar/calendar.html",
			data: { pageTitle: 'Calendar' }
		})
		.state('index.chat', {
			url: "/chat",
			templateUrl: "components/chat/chat.html",
			data: { pageTitle: 'Chat' }
		})
		.state('index.projects', {
			url: "/projects",
			templateUrl: "components/projects/projects.html",
			data: { pageTitle: 'Projects' }
		})
		.state('index.team', {
			url: "/team",
			templateUrl: "components/team/team.html",
			data: { pageTitle: 'Team Directory' }
		})
		.state('index.documents', {
			url: "/documents",
			templateUrl: "components/documents/documents.html",
			data: { pageTitle: 'Documents' }
		})
		.state('index.texteditor', {
			url: "/texteditor",
			templateUrl: "components/texteditor/texteditor.html",
			data: { pageTitle: 'Text Editor' }
		})
}
angular
	.module('equip')
	.config(config)
	.run(function($rootScope, $state) {
		$rootScope.$state = $state;
	});

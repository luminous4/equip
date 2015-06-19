function config($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/login');

	$stateProvider

		.state('login', {
			url:'/login',
			templateUrl: '/login.html',
			controller: 'loginCtrl as userLogin',
			data: { pageTitle: 'login' }
		})
		.state('register', {
			url:'/register',
			templateUrl: '/register.html',
			controller: 'registerCtrl as userRegister',
			data: { pageTitle: 'register' }
		})
		.state('index', {
			abstract: true,
			url: '/index',
			templateUrl: 'components/common/content.html',
		})
		.state('index.home', {
			url: '/home',
			params: {
				authData: null
			},
			templateUrl: 'components/home/home.html',
			controller: 'homeCtrl as home',
			data: { pageTitle: 'Home' }
		})
		.state('index.calendar', {
			url: '/calendar',
			params: {
				authData: null
			},
			templateUrl: 'components/calendar/calendar.html',
			data: { pageTitle: 'Calendar' }
		})
		.state('index.chat', {
			url: '/chat',
			params: {
				authData: null
			},
			templateUrl: 'components/chat/chat.html',
			data: { pageTitle: 'Chat' }
		})
		.state('index.projects', {
			url: '/projects',
			params: {
				authData: null
			},
			templateUrl: 'components/projects/projects.html',
			data: { pageTitle: 'Projects' }
		})
		.state('index.team', {
			url: '/team',
			params: {
				authData: null
			},
			templateUrl: 'components/team/team.html',
			data: { pageTitle: 'Team Directory' }
		})
		.state('index.documents', {
			url: '/documents',
			params: {
				authData: null
			},
			templateUrl: 'components/documents/documents.html',
			data: { pageTitle: 'Documents' }
		})
		.state('index.texteditor', {
			url: '/texteditor',
			params: {
				authData: null
			},
			templateUrl: 'components/texteditor/texteditor.html',
			data: { pageTitle: 'Text Editor' }
		})
		.state('index.settings', {
			url: '/settings',
			params: {
				authData: null
			},
			controller: 'SettingsCtrl as settings',
			templateUrl: 'components/settings/settings.html',
			data: {pageTitle: 'Settings'}
		})
}
angular
	.module('equip')
	// constant variables are available throughout app
  .constant('refUrl', 'https://mksequip.firebaseIO.com')
	.config(config)
	.run(function($rootScope, $state) {
		$rootScope.$state = $state;
	});


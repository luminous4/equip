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
			url: "/index",
			templateUrl: "components/common/content.html",
			// controller: "indexCtrl as index",
			// resolve: {
   //    // controller will not be loaded until $requireAuth resolves
   //    	currentAuth: function() {
	  //     	var ref = new Firebase(refUrl);
	  //       // $requireAuth returns a promise so the resolve waits for it to complete
	  //       // If the promise is rejected, it will throw a $stateChangeError (see below)
	  //       return ref.$requireAuth();
	  //     }
   //  	}
		})
		.state('index.home', {
			url: "/home",
			params: {
				authData: null
			},
			templateUrl: "components/home/home.html",
			controller: "homeCtrl as home",
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
			controller: "ProjectController as projectCtrl",
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
		.state('index.settings', {
			url: "/settings",
			controller: "SettingsCtrl as settings",
			templateUrl: "components/settings/settings.html",
			data: {pageTitle: 'Settings'}
		})
}
angular
	.module('equip')
  .constant('refUrl', 'https://mksequip.firebaseIO.com')
	.config(config)
	// constant variables are available throughout app
	.run(function($rootScope, $state) {
		$rootScope.$state = $state;
		// $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
 	//  		// We can catch the error thrown when the $requireAuth promise is rejected
  // 		// and redirect the user back to the home page
  // 		if (error === "AUTH_REQUIRED") {
  //   		$state.go("login");
  // 		}
		// });
	});


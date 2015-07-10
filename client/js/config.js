function config($stateProvider, $urlRouterProvider) {
	// Add CSS for main app (index/login/register) here
	var mainCSS = [
		'built/styles.min.css',
		'bower_components/bootstrap/dist/css/bootstrap.min.css',
		'bower_components/animate.css/animate.min.css',
		'bower_components/font-awesome/css/font-awesome.min.css',
		'bower_components/fullcalendar/dist/fullcalendar.css',
		'http://fonts.googleapis.com/css?family=Open+Sans:400,600,300,700',
		'bower_components/summernote/dist/summernote.css',
		'bower_components/summernote/dist/summernote-bs3.css',
		'bower_components/metisMenu/dist/metisMenu.min.css',
		'bower_components/blueimp-gallery/css/blueimp-gallery.min.css',
		'bower_components/nouislider/jquery.nouislider.css'

	];

	$urlRouterProvider.otherwise('/index');
	$stateProvider
		.state('landing', {
			url:'/landing',
			templateUrl: '/landing.html',
			data: {
				css: [
					'css/landing/landing.css',
					'bower_components/bootstrap/dist/css/bootstrap.min.css',
					'bower_components/animate.css/animate.min.css',
					'bower_components/font-awesome/css/font-awesome.min.css'
					]
			}
		})
		.state('login', {
			url:'/login',
			templateUrl: '/login.html',
			controller: 'LoginCtrl as userLogin',
			data: {
				css: mainCSS
			}
		})
		.state('register', {
			url:'/register',
			templateUrl: '/register.html',
			controller: 'RegisterCtrl as userRegister',
			data: {
				css: mainCSS
			}
		})
		.state('index', {
			abstract: true,
			url: '/index',
			templateUrl: 'components/common/content.html',
			authenticate: true,
			data: {
				css: mainCSS
			}
		})
		.state('index.todo', {
			url: '/todo',
			templateUrl: 'components/todo/todo.html',
			authenticate: true
		})
		.state('index.home', {
			url: '',
			templateUrl: 'components/home/home.html',
			data: { pageTitle: 'Home' },
			authenticate: true
		})
		.state('index.calendar', {
			url: '/calendar',
			templateUrl: 'components/calendar/calendar.html',
			controller: 'CalendarCtrl as calendar',
			data: { pageTitle: 'Calendar' },
			authenticate: true
		})
		.state('index.chat', {
			url: '/chat',
			templateUrl: 'components/chat/chat.html',
			controller: 'ChatCtrl as chat',
			data: { pageTitle: 'Chat' },
			authenticate: true
		})
		.state('index.teamedit', {
			url: '/team',
			templateUrl: 'components/teamEdit/teamEdit.html',
			controller: 'TeamController',
			data: { pageTitle: 'Edit Your Teams' },
			authenticate: true
		})
		.state('index.contactlist', {
			url: '/contactlist',
			templateUrl: 'components/contactList/contactList.html',
			controller: "ContactController as contactCtrl",
			data: { pageTitle: 'Contact List' },
			authenticate: true
		})
		.state('index.documents', {
			url: '/documents',
			templateUrl: 'components/documents/documents.html',
			data: { pageTitle: 'Documents' },
			authenticate: true
			//resolve: {
			//	uploader: ['$ocLazyLoad', function($ocLazyLoad) {
			//		// you can lazy load files for an existing module
			//		return $ocLazyLoad.load('/components/documents/documents.jq.js');
			//	}]
			//}
		})
		.state('index.texteditor', {
			url: '/texteditor',
			templateUrl: 'components/texteditor/texteditor.html',
			data: { pageTitle: 'Text Editor' },
			controller: "TextEditorCtrl as TextEditorCtrl",
			params: { documentId: null, documentTitle: null, documentBody: null },
			authenticate: true
		})
		.state('index.settings', {
			url: '/settings',
			controller: 'SettingsCtrl as settings',
			templateUrl: 'components/settings/settings.html',
			data: { pageTitle: 'Settings'},
			authenticate: true
		})
}
angular
	.module('equip')
	// constant variables are available throughout app
  .constant('refUrl', 'https://mksequip.firebaseIO.com')
	.config(config)
	.run(function($rootScope, $state, $location, User) {
		$rootScope.$state = $state;
 		$rootScope.$on('$stateChangeStart', function (evt, next, current) {
   		if (next && next.authenticate && !User.isAuth()) {
 				evt.preventDefault();
 				$rootScope.$evalAsync(function() {
 				  $location.path('/landing');
 				});
   		}
 		});
	});



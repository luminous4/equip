describe('LoginCtrl', function() {
  var $scope, $rootScope, $location, createController, User;

  beforeEach(module('equip'));

  beforeEach(inject(function($injector) {
    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    User = $injector.get('User');
    $location = $injector.get('$location');
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    // instantiate the controller
    createController = function () {
      return $controller('LoginCtrl', {
        $scope: $scope,
        $location: $location,
        User: User
      });
    };
  }));


  it('should have a loading property on $scope', function() {
    createController();
    expect($scope.loading).toBeDefined();
  });

  it('should initalize loading property as false', function() {
    createController();
    expect($scope.loading).toBe(false);
  });
});
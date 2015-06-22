angular.module('equip')

.directive('dropDown', function() {
  return {
    restrict: 'E',
    template: '<div class="dropdown">Team 1</div>',
    link: function(scope, elem, attrs) {
      elem.bind('click', function() {
      elem.css('background-color', 'white');
      scope.$apply(function() {
        scope.color = "white";
      });
    });
    elem.bind('mouseover', function() {
      elem.css('cursor', 'pointer');
    });
  }
  }
})
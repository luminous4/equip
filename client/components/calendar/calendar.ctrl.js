angular.module('equip')

  .controller('CalendarCtrl', function($scope, User) {
    console.log('in CalendarCtrl');

    /* alert on eventClick */
    this.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = (date.title + ' was clicked ');
    };
    /* alert on Drop */
    this.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    this.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };


    $scope.events = {
      events: [
        {
          title: 'Event1',
          start: '2015 06 20 14:30',
          end: '2015 06 20 16:00',
          id: '1',
          url: '#/index/projects',
          className: 'test',
          allDay: false,
          stick: true
        },
        {
          title: 'Event2',
          start: '2015 06 21 11:30',
          end: '2015 06 21 12:00',
          id: '2',
          url: '#/index/projects',
          className: 'anotherTest',
          allDay: false,
          stick: true
        },
      ],
      color: 'lightblue',   // optional
      textColor: 'black' // optional
    };

    console.log('$scope.events.events[0].end', $scope.events.events[0].end);
    console.log('$scope.events.events[0].className', $scope.events.events[0].className);


    this.uiConfig = {
      calendar:{
        height: 600,
        editable: true,
        header:{
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: this.alertEventOnClick,
        eventDrop: this.alertOnDrop,
        eventResize: this.alertOnResize
      }
    };
    /* event sources array*/
    this.eventSources = [$scope.events];
    console.log('eventSources', this.eventSources);
});
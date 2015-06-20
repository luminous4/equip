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
            start: '2015-06-19'
        },
        {
            title: 'Event2',
            start: '2015-06-20'
        }
      ],
      color: 'lightblue',   // optional
      textColor: 'black' // optional
    };

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
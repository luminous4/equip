angular.module('equip')

  .controller('CalendarCtrl', function($scope, User) {
    // console.log('in CalendarCtrl');

    this.saveNewEvent = function() {
      // console.log('add event clicked');
      var newEvent = {};
      newEvent['title'] = this.title;
      newEvent['start'] = this.startYear + ' ' + this.startMonth  + ' ' + this.startDay  + ' ' + this.startHour  + ':' + this.startMinutes;
      newEvent['end'] = this.endYear + ' ' + this.endMonth  + ' ' + this.endDay  + ' ' + this.endHour  + ':' + this.endMinutes;
      newEvent['id'] = 3;
      newEvent['className'] = 'test';
      newEvent['allDay'] = false;
      newEvent['stick'] = true;

      // console.log('newEvent', newEvent);
      $scope.events.events.push(newEvent);
      console.log('eventSources after adding event', this.eventSources);
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

    this.uiConfig = {
      calendar:{
        height: 600,
        editable: true,
        header:{
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        }
      }
  };
    /* event sources array*/

    this.eventSources = [$scope.events];
    console.log('eventSources', this.eventSources);
});
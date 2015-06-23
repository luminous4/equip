angular.module('equip')

  .controller('CalendarCtrl', function($scope, FirebaseFactory, User, refUrl) {
    console.log('in CalendarCtrl');

    var allUsers = FirebaseFactory.getCollection('users');
    // console.log('all users', allUsers);
    var currentUser = FirebaseFactory.getCurrentUser;
    //currentUser.uid;
    var allEvents = FirebaseFactory.getCollection('events');
    // console.log('all events', allEvents);

    this.saveNewEvent = function() {
      // console.log('add event clicked');
      var newEvent = {};
      newEvent['title'] = this.title;
      newEvent['start'] = this.startYear + ' ' + this.startMonth  + ' ' + this.startDay  + ' ' + this.startHour  + ':' + this.startMinutes;
      newEvent['end'] = this.endYear + ' ' + this.endMonth  + ' ' + this.endDay  + ' ' + this.endHour  + ':' + this.endMinutes;
      newEvent['allDay'] = false;
      newEvent['stick'] = true;
      newEvent['users'] = [];
      newEvent['projects'] = [];

      // console.log('newEvent', newEvent);
      allEvents.$add(newEvent);
      // console.log('eventSources after adding event', this.eventSources);
      allEvents.child('users').$add({userId: userId});
      // allEvents.child('projects').$add({projectId: projectId});
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

    this.eventSources = [allEvents];
    console.log('eventSources', this.eventSources);
});
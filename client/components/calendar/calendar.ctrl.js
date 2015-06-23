angular.module('equip')

  .controller('CalendarCtrl', function($scope, FirebaseFactory) {
    // console.log('in CalendarCtrl');
    var allUsers = FirebaseFactory.getCollection('users');
    var currentUser = FirebaseFactory.getCurrentUser();

    //TODO (select from drop down)
    var eventProjectId = this.project;

    this.saveNewEvent = function() {
      // console.log('add event clicked');
      var newEvent = {};
      newEvent['title'] = this.title;
      newEvent['start'] = this.startYear + ' ' + this.startMonth  + ' ' + this.startDay  + ' ' + this.startHour  + ':' + this.startMinutes;
      newEvent['end'] = this.endYear + ' ' + this.endMonth  + ' ' + this.endDay  + ' ' + this.endHour  + ':' + this.endMinutes;
      newEvent['allDay'] = false;
      newEvent['stick'] = true;
      newEvent['userId'] = currentUser.uid;
      newEvent['projectId'] = eventProjectId || 'Test Project';

      FirebaseFactory.addToCollection('events', newEvent);
      console.log('added event:', newEvent.title);
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

  var allEvents = FirebaseFactory.getCollection('events');
  this.eventSources = [allEvents];
  // console.log('eventSources', this.eventSources);
});
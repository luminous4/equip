angular.module('equip')

  .controller('CalendarCtrl', function($scope, FirebaseFactory) {
    // console.log('in CalendarCtrl');
    var allUsers = FirebaseFactory.getCollection('users', true);
    var currentUser = FirebaseFactory.getCurrentUser();

    //TODO (select from drop down)
    var eventProjectId = this.project;

    var getDate = function(dateObj) {
      var date;
      console.log('in getDate: dateObj', dateObj);
      var year = dateObj.getFullYear();
      var month = dateObj.getMonth() + 1;
      var day = dateObj.getDate();

      date = year + ' ' + month + ' ' + day;
      return date;
    };

    var getTime = function(timeObj, isDefault) {
      isDefault = isDefault || false;
      var time;

      // TODO
      // if (isDefault) {
      //   // add 30 min to current hours:time
      // }

      var hours = timeObj.getHours();
      var minutes = timeObj.getMinutes();

      // check if is padding neccessary
      if (hours < 10) {
        hours = '0' + hours;
      }

      if (minutes < 10) {
        minutes = '0' + minutes
      }

      time = hours + ':' + minutes;
      return time;
    };

    this.saveNewEvent = function() {
      // console.log('add event clicked');
      var eventStart;
      var eventEnd;
      var newEvent = {};

      var startDate = getDate(this.startDate);
      var startTime = getTime(this.startTime);
      eventStart = startDate + ' ' + startTime;

      var endDate;
      var endTime;

      if (this.endDate === undefined && this.endTime === undefined) {
        endDate = startDate;
        endTime = getTime(this.startTime, true);
        eventEnd = endDate + ' ' + endTime;
      } else if (this.endDate === undefined) {
        endDate = startDate;
        endTime = getTime(this.endTime);
        eventEnd = endDate + ' ' + endTime;
      } else {
        endDate = getDate(this.endDate);
        endTime = getTime(this.endTime);
        eventEnd = endDate + ' ' +  endTime;
      }

      newEvent.title = this.title;
      newEvent.start = eventStart;
      newEvent.end = eventEnd;
      // newEvent['allDay'] = false;
      newEvent.stick = true;
      newEvent.userId = currentUser.uid;
      newEvent.projectId = eventProjectId || 'Test Project';
      
      // at current moment, events are top level, so must pass true
      // when events move to teams, take true out!
      FirebaseFactory.addToCollection('events', newEvent, true);
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

  // at current moment, events are top level, so must pass true
  // when events move to teams, take true out!
  var allEvents = FirebaseFactory.getCollection('events', true);
  this.eventSources = [allEvents];
  // console.log('eventSources', this.eventSources);
});
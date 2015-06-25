angular.module('equip')

  .controller('CalendarCtrl', function($scope, FirebaseFactory) {
    // console.log('in CalendarCtrl');
    var allUsers = FirebaseFactory.getCollection('users', true);
    var currentUser = FirebaseFactory.getCurrentUser();

    this.setInputDefaults = function() {
      this.fulldayEvent = true;
      this.sameDay = true;
      this.title = '';
      this.startDate = '';
      this.startTime = '';
      this.endDate = '';
      this.endTime = '';
    }

    this.setInputDefaults();

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
      console.log('add event clicked');
      var newEvent = {};

      var startDate = getDate(this.startDate);
      var startTime;

      var endDate;
      var endTime;

      var eventStart;
      var eventEnd;

      // full day event
      if (this.fulldayEvent === true) {
        startTime = this.startTime = '09:00';
        endTime = this.endTime = '20:00';
      } else {
        startTime = getTime(this.startTime);
        endTime = getTime(this.endTime);
      }

      eventStart = startDate + ' ' + startTime;

      // no end date entered
      if (this.endDate.length === 0) {
        endDate = startDate;
      } else {
        endDate = getDate(this.endDate);
      }

      // end time not set yet
      if (!endTime) {
        endTime = getTime(this.endTime);
      }

      eventEnd = endDate + ' ' +  endTime;

      // ui-calendar event properties
      newEvent.title = this.title;
      newEvent.start = eventStart;
      newEvent.end = eventEnd;
      newEvent.allDay = this.fulldayEvent;
      newEvent.stick = true;
      // custom event properties
      newEvent.userId = currentUser.uid;
      newEvent.startDate = startDate;
      newEvent.startTime = startTime;
      newEvent.endDate =  endDate;
      newEvent.endTime = endTime;

      // if events should be added to db top level, add true as third arg
      FirebaseFactory.addToCollection('events', newEvent);
      this.setInputDefaults();
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
  });
angular.module('equip')

  .controller('CalendarCtrl', function($scope, FirebaseFactory) {
    // console.log('in CalendarCtrl');
    var allUsers = FirebaseFactory.getCollection('users', true);
    var currentUser = FirebaseFactory.getCurrentUser();

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

    // var fullDay = this.fulldayEvent;
      // console.log('fullDay', fullDay);

    this.saveNewEvent = function() {
      console.log('add event clicked');
      var eventStart;
      var eventEnd;
      var newEvent = {};

      console.log('this.startDate after click', this.startDate);

      var startDate = getDate(this.startDate); // called twice after first time adding an event
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
      newEvent.allDay = this.fulldayEvent;
      newEvent.stick = true;
      newEvent.userId = currentUser.uid;

      // if events should be added to db top level, add true as third arg
      FirebaseFactory.addToCollection('events', newEvent);

      // empty input fields
      this.title = '';
      this.startDate = '';
      this.startTime = '';
      this.endDate = '';
      this.endTime = '';
      this.fulldayEvent = '';
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
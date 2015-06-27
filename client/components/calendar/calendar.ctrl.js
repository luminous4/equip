angular.module('equip')


  .controller('CalendarCtrl', function($scope, $rootScope, $compile, uiCalendarConfig, FirebaseFactory) {
    // console.log('in CalendarCtrl');
    var allUsers = FirebaseFactory.getCollection('users', true);
    var currentUser = FirebaseFactory.getCurrentUser();

    var milToStandard = function (value) {
      if (value !== null && value !== undefined) { //If value is passed in
        if (value.length === 5) {
        var hour = value.substring ( 0,2 ); //Extract hour
        var minutes = value.substring ( 3,5 ); //Extract minutes
        var identifier = 'AM'; //Initialize AM PM identifier

        if (hour === 12){ //If hour is 12 then should set AM PM identifier to PM
          identifier = 'PM';
        }
        if (hour === 0){ //If hour is 0 then set to 12 for standard time 12 AM
          hour = 12;
        }
        if (hour > 12){ //If hour is greater than 12 then convert to standard 12 hour format and set the AM PM identifier to PM
          hour = hour - 12;
          identifier = 'PM';
        }
        return hour + ':' + minutes + ' ' + identifier; //Return the constructed standard time
        } else { //If value is not the expected length than just return the value as is
          return value;
        }
      }
    };

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
      newEvent.startTime = milToStandard(startTime);
      newEvent.endDate =  endDate;
      newEvent.endTime = milToStandard(endTime);

      // if events should be added to db top level, add true as third arg
      FirebaseFactory.addToCollection('events', newEvent);
      this.setInputDefaults();
    };

    /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) {
      element.attr({'tooltip': event.title + ' ' + milToStandard(this.startTime) + ' - ' + milToStandard(this.endTime),
                     'tooltip-append-to-body': true});
      $compile(element)($scope);
    };

    $scope.uiConfig = {
      calendar:{
        height: 600,
        editable: true,
        header:{
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        eventRender: $scope.eventRender
      }
    };

    var currTeam = JSON.parse(localStorage.selectedTeam).$value;

    $scope.allEvents = FirebaseFactory.getCollection(['teams', currTeam, 'events'], true);
    this.eventSources = [$scope.allEvents];

    $rootScope.$watch('selectedTeam', function() {
      if ($rootScope.selectedTeam) {
        $scope.allEvents = FirebaseFactory.getCollection(['teams', currTeam, 'events'], true)
          .$loaded().then(function (data) {
            $scope.allEvents = data;
            var year = moment().year();
            var date = moment().date();
            var month = moment().month() + 1;
            var today = "" + year + " " + +month + " " + date;
            var results = [];
            _.each(data, function (value) {
              if (value.startDate === today) {
                results.push(value);
              }
            });
            $scope.allEvents = results;
          });
      }
    });
  });
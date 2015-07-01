(function() {
   angular.module('equip')

  .controller('CalendarCtrl', function($scope, $rootScope, $compile, uiCalendarConfig, User, FirebaseFactory) {

    var allUsers = FirebaseFactory.getCollection('users', true);
    var currentUser = User.getCurrentUser();
    var currentTeam = JSON.parse(localStorage.selectedTeam).$value;

    this.setInputDefaults = function() {
      this.fulldayEvent = true;
      this.sameDay = true;
      this.title = '';
      this.startDate = '';
      this.startTime = '';
      this.endDate = '';
      this.endTime = '';
    }

    // on page load
    this.setInputDefaults();

    var milToStandard = function (value) {
      // if value is passed in
      if (value !== null && value !== undefined) {
        if (value.length === 5) {
          var hour = value.substring ( 0,2 );
          var minutes = value.substring ( 3,5 );
          var identifier = 'AM';

          if (hour == 12){
            identifier = 'PM';
          }
          if (hour == 00){
            // identifier remains AM
            hour = 12;
          }
          if (hour > 12){
            hour = hour - 12;
            identifier = 'PM';
          }
          return hour + ':' + minutes + ' ' + identifier;
        } else {
          return value;
        }
      }
    };

    var getDate = function(dateObj) {
      var date;
      var year = dateObj.getFullYear();
      var month = dateObj.getMonth() + 1;
      var day = dateObj.getDate();

      date = year + ' ' + month + ' ' + day;
      return date;
    };

    var getTime = function(timeObj) {
      var time;
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

      FirebaseFactory.addToCollection('events', newEvent);
      this.setInputDefaults();
    };

    /* event entry on mouseover*/
    $scope.eventRender = function(event, element, view) {
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

    $scope.allEvents = FirebaseFactory.getCollection(['teams', currentTeam, 'events'], true);

    // events on calendar
    $scope.eventSources = [$scope.allEvents];

    $rootScope.$watch('selectedTeam', function() {
      if ($rootScope.selectedTeam) {
        $scope.dashboardEvents = FirebaseFactory.getCollection('events')
          .$loaded().then(function (data) {
            var year = moment().year();
            var date = moment().date();
            var month = moment().month() + 1;
            var today = year + " " + month + " " + date;
            var results = [];

            angular.forEach(data, function (value) {
              if (value.startDate === today) {
                results.push(value);
              }
            });
            $scope.dashboardEvents = results;
          });
      }
    });
  });
})();
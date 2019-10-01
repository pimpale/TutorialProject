"use strict"

async function loadData() {
  var apiKey = Cookies.getJSON('apiKey');
  var searchParams = new URLSearchParams(window.location.search);

  if (!searchParams.has('userId')) {
    giveAlert('No user query')
    return;
  }

  var userId = searchParams.get('userId');
  const position = {
    0:'Administrator',
    1:'Teacher'
  }
  var userPosition;
  request(thisUrl() + '/user/' +
    '?userId=' + userId +
    '&apiKey=' + apiKey.key,
    function (xhr) {
      var userResponse = JSON.parse(xhr.responseText)[0];
      document.getElementById('user-name').innerHTML = userResponse.name;
      document.getElementById('user-email').innerHTML = 'Email: ' + userResponse.email;
      document.getElementById('user-position').innerHTML = position[userResponse.ring];
      userPosition = userResponse.ring;
    },
    function (xhr) {
      //failure
      giveAlert('Failed to connect to server.', 'alert-danger');
      return
    }
  );
  if (userPosition === undefined) {
    await sleep(500);
  }

  if (userPosition == 0){
    var element = document.getElementById('user-courses-table');
    element.parentNode.removeChild(element);
  }
  else {
    request(thisUrl() + '/course/' +
      '?teacherId=' + userId +
      '&apiKey=' + apiKey.key,
      function (xhr) {
        var teacherCourses = JSON.parse(xhr.responseText);
        var coursePeriods = [];
        for (var p = 1; p <= 7; p++) {
          var currentPeriodList = teacherCourses.filter(c => c.period == p);
          coursePeriods.push(currentPeriodList.length == 0 ? null : currentPeriodList[0])
        }
        var classTable = document.getElementById('user-courses');
        console.log(coursePeriods);
        coursePeriods.sort(function (a, b) {
          if (a != null && b != null) {
            return b.period-a.period
          } else {
            return -1
          };
        });
        coursePeriods.forEach(function (course) {
          if (course != null) {
            var newrow = classTable.insertRow(0);
            newrow.innerHTML =
              ('<td>' + course.period + '</td>' +
                '<td>' + course.subject + '</td>' +
                '<td>' + course.location.name + '</td>');
          }
        });
      },
      function (xhr) {
        //failure
        giveAlert('Failed to connect to server.', 'alert-danger');
        return;
      }
    );
  }
};

$(document).ready(function() {
  loadData();
})
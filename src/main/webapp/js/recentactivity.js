"use strict"

//gets new data from server and inserts it at the beginning
function getRecentActivity() {
  var apiKey = Cookies.getJSON('apiKey');

  if (apiKey == null) {
    console.log('apiKey not present. Sending to login page.');
    window.location.replace(thisUrl() + '/login.html');
    return;
  }

  var url = thisUrl() +
    '/session/' +
    '?apiKey=' + apiKey.key +
    '&teacherName=' + apiKey.user.name;

  request(url, function (xhr) {
    var table = document.getElementById('response-table-body');
    table.innerHTML = '';
    var sessions = JSON.parse(xhr.responseText);
    //go backwards to maintain order
    for (var i = sessions.length - 1; i >= 0; i--) {
      var session = sessions[i];
      var outEncounterTime = (session.outEncounter === null) ? '' : moment(session.outEncounter.time, 'x').format('L LTS');
      table.insertRow(0).innerHTML =
        ('<tr>' +
          '<td>' + (sessions.length - i) + '</td>' +
          '<td>' + linkRelative(session.inEncounter.student.name, '/studentprofile.html/?studentId=' + session.inEncounter.student.id) + '</td>' +
          '<td>' + session.inEncounter.student.id + '</td>' +
          '<td>' + session.course.period + '</td>' +
          '<td>' + linkRelative(session.course.teacher.name, '/userprofile.html/?userId=' + session.course.teacher.id) + '</td>' +
          '<td>' + session.course.location.name + '</td>' +
          '<td>' + moment(session.inEncounter.time, 'x').format('L LTS') + '</td>' +
          '<td>' + outEncounterTime + '</td>' +
          '</tr>');
    }
  },
    function (xhr) {
      console.log(xhr);
    }
  );
}

$(document).ready(function () {
  setInterval(getRecentActivity(), 5000);
});
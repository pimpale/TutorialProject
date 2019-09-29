"use strict"


function loadClassReport() {
  var apiKey = Cookies.getJSON('apiKey');

  if(apiKey == null) {
    console.log('not signed in');
    return;
  }

  var table = document.getElementById('classreport-table');

  var searchParams = new URLSearchParams(window.location.search);

  if(!searchParams.has('courseId') || !searchParams.has('periodId')) {
    console.log('page not loaded with right params');
    return;
  }

  var courseId = searchParams.get('courseId');
  var periodId = searchParams.get('periodId');

  // get students
  request(thisUrl() + '/student/' +
    '?courseId=' + courseId +
    '&apiKey=' + apiKey.key,
    function (xhr) {
      var students = JSON.parse(xhr.responseText);
      // get irregularities
      request(thisUrl() + '/irregularity/' +
        '?courseId=' + courseId +
        '&periodId=' + periodId +
        '&apiKey=' + apiKey.key,
        function (xhr) {
          var irregularities = JSON.parse(xhr.responseText).sort((a, b) => (a.time > b.time) ? 1 : -1);

          //blank table
          table.innerHTML = '';

          for (var i = 0; i < students.length; i++) {
            var text = '<span class="fa fa-check"></span>'
            var bgcolor = '#ccffcc';
            var fgcolor = '#00ff00';
            var student = students[i];

            var irregularity = irregularities.filter(i => i.student.id == student.id).pop();
            var type = irregularity == null ? null : irregularity.type;
            if (type == 'absent') {
              text = '<span class="fa fa-times"></span>';
              bgcolor = '#ffcccc';
              fgcolor = '#ff0000';
            } else if (type == 'tardy') {
              text = '<span class="fa fa-check"></span>';
              bgcolor = '#ffffcc';
              fgcolor = '#ffff00';
            } else if (type == 'left_early') {
              text = '<span class="fa fa-sign-out-alt"></span>';
              bgcolor = '#ccffff';
              fgcolor = '#00ffff';
            } else if (type == 'left_temporarily') {
              text = '<span class="fa fa-check"></span>';
              bgcolor = '#ccffff';
              fgcolor = '#00ffff';
            }

            // put values in table
            var newrow = table.insertRow(0);
            newrow.innerHTML =
              ('<td>' + student.name + '</td>' +
                '<td>' + student.id + '</td>' +
                '<td style="background-color:' + bgcolor + ';color:' + fgcolor + '">' + text + '</td>');
            newrow.className = 'id-' + student.id;
          }
        },
        //failure
        function (xhr) {
          return;
        }
      );
    },
    //failure
    function (xhr) {
      return;
    }
  );
}

function loadClassText() {
  var apiKey = Cookies.getJSON('apiKey');

  if(apiKey == null) {
    console.log('not signed in');
    return;
  }

  var table = document.getElementById('classreport-table');

  var searchParams = new URLSearchParams(window.location.search);

  if(!searchParams.has('courseId') || !searchParams.has('periodId')) {
    console.log('page not loaded with right params');
    return;
  }

  var courseId = searchParams.get('courseId');
  var periodId = searchParams.get('periodId');
}


$(document).ready(function () {
  loadClassText();
  loadClassReport();
})


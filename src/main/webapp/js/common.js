"use strict"

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isEmpty(str) {
  return (!str || 0 === str.length);
}

function thisUrl() {
  return window.location.protocol + "//" + window.location.host;
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function request(url, functionOnLoad, functionOnError) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      functionOnLoad(xhr);
    } else if (xhr.readyState == 4 && xhr.status != 200) {
      functionOnError(xhr);
    }
  };
  xhr.send();
}

function ordinal_suffix_of(i) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}

function giveAlert(innerHTML, type) {
  document.getElementById('alert-zone').innerHTML +=
    '<div class="alert alert-dismissable ' + type + '" role="alert">' +
    innerHTML +
    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
    '<span aria-hidden="true">&times;</span>' +
    '</button>' +
    '</div>';
  $(".alert").fadeTo(3000, 500).slideUp(500, function () {
    $(".alert").slideUp(500);
    this.parentNode.removeChild(this);
  });
}

function toGraduatingYear(grade) {
  var currentTime = moment();
  var currentYear = currentTime.year();
  if (currentTime.month() >= 7) {
    currentYear++;
  }
  return currentYear;
}


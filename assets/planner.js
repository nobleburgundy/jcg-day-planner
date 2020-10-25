$(document).ready(function () {
  // Show current date and current time
  setInterval(() => {
    $("#current-date").text(moment().format("MMMM Do YYYY, h:mm:ss a"));
  }, 1000);
});

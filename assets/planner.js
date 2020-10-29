let workHoursArray = [9, 10, 11, 12, 13, 14, 15, 16, 17];
let currentTime = moment().format("H");

$(document).ready(function () {
  setRowClassesBasedOnTime();

  // Show current date and current time
  setInterval(() => {
    $("#current-date").text(moment().format("MMMM Do YYYY, h:mm:ss a"));
  }, 1000);
});

function setRowClassesBasedOnTime() {
  let pastHoursClass = "secondary";
  let currentHourClass = "danger";
  let futureHourEmptyClass = "info";
  let futureHourFilledClass = "success";
  // For comparison
  let currentTimeInt = parseInt(currentTime);
  // Short Circuit for Testing...
  //   currentTimeInt = 10;

  for (let i = 0; i < workHoursArray.length; i++) {
    if (workHoursArray[i] < currentTimeInt) {
      $(`tr#${workHoursArray[i]}`).addClass(pastHoursClass);
    } else if (workHoursArray[i] === currentTimeInt) {
      $(`tr#${workHoursArray[i]}`).addClass(currentHourClass);
    } else {
      // Future hours, now check if there is a meeting
      let tdElement = $(`tr#${workHoursArray[i]} td:nth-child(2)`);
      // make it editable
      tdElement.attr("contenteditable", true);
      // green if open, blue if filled
      if (tdElement.text()) {
        $(`tr#${workHoursArray[i]}`).addClass(futureHourFilledClass);
      } else {
        console.log("empty");
        $(`tr#${workHoursArray[i]}`).addClass(futureHourEmptyClass);
      }
    }
  }
}

let mockPlanObject = [
  {
    time: 9,
    description: "",
  },
  {
    time: 10,
    description: "",
  },
  {
    time: 11,
    description: "",
  },
  {
    time: 12,
    description: "Lunch - No Meetings Allowed",
  },
  {
    time: 13,
    description: "",
  },
  {
    time: 14,
    description: "UX Design Check-in",
  },
  {
    time: 15,
    description: "1on1 - 007",
  },
  {
    time: 16,
    description: "",
  },
  {
    time: 17,
    description: "Happy Hour!",
  },
];
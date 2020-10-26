$(document).ready(function () {
  setRowClassesBasedOnTime();

  // Show current date and current time
  setInterval(() => {
    $("#current-date").text(moment().format("MMMM Do YYYY, h:mm a"));
  }, 1000);
});

let workHoursArray = [9, 10, 11, 12, 13, 14, 15, 16, 17];
let currentTime = moment().format("H");

function setRowClassesBasedOnTime() {
  let pastHoursClass = "table-secondary";
  let currentHourClass = "table-danger";
  let futureHourEmptyClass = "table-success";
  let futureHourFilledClass = "table-info";

  for (let i = 0; i < workHoursArray.length; i++) {
    if (workHoursArray[i] < currentTime) {
      $(`tr#${workHoursArray[i]}`).addClass(pastHoursClass);
    } else if (workHoursArray[i] === currentTime) {
      $(`tr#${workHoursArray[i]}`).addClass(currentHourClass);
    } else {
      // Future hours, now check if there is a meeting
      let tdElement = $(`tr#${workHoursArray[i]} td:nth-child(2)`);
      console.log(tdElement.text());
      //   let tdElement = trElement.children().;
      if (tdElement) {
        $(`tr#${workHoursArray[i]}`).addClass(futureHourFilledClass);
      } else {
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

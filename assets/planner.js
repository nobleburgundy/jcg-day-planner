let currentTime = moment().format("H");
let startTime = 9;

$(document).ready(function () {
  loadMeetingsFromLocalStorage();
  setRowClassesBasedOnTime();

  // Show current date and current time
  setInterval(() => {
    $("#current-date").text(moment().format("MMMM Do YYYY, h:mm a"));
  }, 1000);
});

function setRowClassesBasedOnTime() {
  let pastHoursClass = "past";
  let currentHourClass = "current";
  let futureHourEmptyClass = "empty";
  let futureHourFilledClass = "filled";
  // For comparison
  let currentTimeInt = parseInt(currentTime);

  for (let i = 0; i < meetingDataArray.length; i++) {
    if (meetingDataArray[i].time < currentTimeInt) {
      $(`tr#${meetingDataArray[i].time}`).addClass(pastHoursClass);
    } else if (meetingDataArray[i].time === currentTimeInt) {
      $(`tr#${meetingDataArray[i].time}`).addClass(currentHourClass);
    } else {
      // Future hours, now check if there is a meeting
      let tdElement = $(`tr#${meetingDataArray[i].time} td:nth-child(2)`);
      // make it editable
      tdElement.attr("contenteditable", true);
      // green if open, blue if filled
      if (tdElement.text()) {
        $(`tr#${meetingDataArray[i].time}`).addClass(futureHourFilledClass);
        $("#clear-all").removeClass("disabled");
        // show delete icon if there already is a meeting
        $(`tr#${meetingDataArray[i].time} td:nth-child(3)`).children(".fa-trash").removeClass("d-none");
      } else {
        $(`tr#${meetingDataArray[i].time}`).addClass(futureHourEmptyClass);
      }
    }
  }
}

function saveMeetingsToLocalStorage() {
  let meetingObjectJSON = JSON.stringify(meetingDataArray);
  localStorage.setItem("work-day-planner", meetingObjectJSON);
}

function loadMeetingsFromLocalStorage() {
  let localMeetingData = JSON.parse(localStorage.getItem("work-day-planner"));
  if (!localMeetingData) {
    // No data present, so just set to the empty meetingDataArray
    localMeetingData = meetingDataArray;
  } else {
    // update the meetinDataArray with the locally stored data
    meetingDataArray = localMeetingData;
  }

  // write data to the page
  for (let index = 0; index < localMeetingData.length; index++) {
    // Select the element with ID = time and select the child with class .meeting-description
    $(`#${localMeetingData[index].time}`).children(".meeting-description").text(localMeetingData[index].description);
  }
}

// listen for save click
$(".fa-save").on("click", function () {
  let timeBlock = $(this).parent().prevAll(".time").text();
  let timeBlockInt = parseInt(timeBlock);

  // convert to 24 time
  if (timeBlockInt < 9) {
    timeBlockInt += 12;
  }

  saveRow(timeBlockInt);
});

// Listen for delete click
$(document).on("click", ".fa-trash", function () {
  let time = $(this).parent().prevAll(".time").text();
  deleteRow(time);
});

// Listen for input on the meeting description cell and show the save button when there's input
$(".meeting-description").on("input", function () {
  $(this).next().children(".fa-save").removeClass("d-none");
  $("#save-all").removeClass("disabled");
  $("#clear-all").removeClass("disabled");

  // Listen for Enter key and save
  $(this).on("keypress", function (event) {
    if (event.code === "Enter") {
      event.preventDefault();
      let timeRow = $(this).parent().attr("id");
      saveRow(timeRow);
    }
  });
});

// Listen for Clear All button
$("#clear-all").on("click", function () {
  if (confirm("Are you sure? This will delete all of the future meetings on the calendar.")) {
    for (let i = 0; i < meetingDataArray.length; i++) {
      let time = meetingDataArray[i].time;
      if (time > parseInt(currentTime)) {
        deleteRow(time);
      }
    }
  }
  // Disable Clear All and Save All links
  $("#clear-all").addClass("disabled");
  $("#save-all").addClass("disabled");
});

// Listen for Save All button
$("#save-all").on("click", function () {
  for (let i = 0; i < meetingDataArray.length; i++) {
    saveRow(meetingDataArray[i].time);
  }
});

// Cheater function to short-circuit current time for testing
$(document).on("dblclick", ".time", function () {
  currentTime = parseInt($(this).text());
  setRowClassesBasedOnTime();
});

function deleteRow(time) {
  // convert to int
  time = parseInt(time);
  // convert time to 24 hour
  if (time < startTime) {
    time += 12;
  }
  // store the row
  let rowEl = $(`#${time}`);
  // clear the text
  rowEl.children(".meeting-description").text("");
  // update the class of the row
  rowEl.addClass("empty").removeClass("filled");
  // hide icons
  rowEl.children(".action").children(".fas").addClass("d-none");
  // Update the object
  meetingDataArray[time - meetingDataArray.length].description = "";
  // save to localStorage
  saveMeetingsToLocalStorage();
}

function saveRow(time) {
  // convert to int
  time = parseInt(time);
  currentTime = parseInt(currentTime);
  // convert time to 24 hour
  if (time < startTime) {
    time += 12;
  }
  // store the row
  let rowEl = $(`#${time}`);
  // get the description
  let description = rowEl.children(".meeting-description").text();
  let rowClass = rowEl.attr("class");

  // Only save if it's in the future, has a description entered, and has class 'empty'
  if (time > currentTime && description) {
    if (rowClass === "empty") {
      // update the class of the row
      rowEl.addClass("filled").removeClass("empty");
    }
    // hide save icon
    rowEl.children(".action").children(".fa-save").addClass("d-none");
    // show delete icon
    rowEl.children(".action").children(".fa-trash").removeClass("d-none");
    // save the meeting to the array and localStorage
    saveMeetingData(time, description);
  }
}

function saveMeetingData(timeInt, meetingText) {
  timeInt = parseInt(timeInt);
  meetingDataArray[timeInt - meetingDataArray.length].description = meetingText;
  saveMeetingsToLocalStorage();
}

let meetingDataArray = [
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
    description: "",
  },
  {
    time: 13,
    description: "",
  },
  {
    time: 14,
    description: "",
  },
  {
    time: 15,
    description: "",
  },
  {
    time: 16,
    description: "",
  },
  {
    time: 17,
    description: "",
  },
];

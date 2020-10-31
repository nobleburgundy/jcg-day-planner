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
  console.log(currentTimeInt);

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
  let cellContents = $(this).parent().prev().text();
  let timeBlock = $(this).parent().prevAll(".time").text();
  let timeBlockInt = parseInt(timeBlock);

  // convert to 24 time
  if (timeBlockInt < 9) {
    timeBlockInt += 12;
  }

  // update the object
  meetingDataArray[timeBlockInt - meetingDataArray.length].description = cellContents;
  // save to localStorage
  saveMeetingsToLocalStorage();

  // update classes
  if (cellContents.length > 0) {
    $(this).parent().parent().addClass("filled").removeClass("empty");
    // Hide icon
    $(this).addClass("d-none");
    // Show trash icon
    $(this).nextAll(".fa-trash").removeClass("d-none");
  } else {
    // If user clears the field and save, treat it like delete
    $(this).parent().parent().removeClass("filled").addClass("empty");
    // Hide icon
    $(this).addClass("d-none");
    // Hide trash icon
    $(this).nextAll(".fa-trash").addClass("d-none");
  }
});

$(document).on("click", ".fa-trash", function () {
  let time = $(this).parent().prevAll(".time").text();
  deleteRow(time);
});

// Listen for input on the meeting description cell and show the save button when there's input
$(".meeting-description").on("input", function () {
  $(this).next().children(".fa-save").removeClass("d-none");
  // Listen for Enter key and save
  $(this).on("keypress", function (event) {
    if (event.code === "Enter") {
      event.preventDefault();
      // Save
      let timeRow = $(this).parent().attr("id");
      saveMeeting(timeRow, $(this).text());
      // Update class
      $(this).next().children(".fa-save").addClass("d-none");
      $(this).next().children(".fa-trash").removeClass("d-none");
      $(this).parent().addClass("filled").removeClass("empty");
    }
  });
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
  // hide icon
  rowEl.children(".action").children(".fa-trash").addClass("d-none");
  // Update the object
  meetingDataArray[time - meetingDataArray.length].description = "";
  // save to localStorage
  saveMeetingsToLocalStorage();
}

$(".time").on("dblclick", function () {
  currentTime = parseInt($(this).text());
  setRowClassesBasedOnTime();
});

function saveMeeting(timeInt, meetingText) {
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

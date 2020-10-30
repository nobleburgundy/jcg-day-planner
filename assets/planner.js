let workHoursArray = [9, 10, 11, 12, 13, 14, 15, 16, 17];
let currentTime = moment().format("H");

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

  // Short Circuit for Testing...
  currentTimeInt = 10;

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
        // add delete icon if there already is a meeting
        let icon = $("<i>");
        icon.addClass("fas fa-trash");
        $(`tr#${meetingDataArray[i].time} td:nth-child(3)`).append(icon);
      } else {
        $(`tr#${meetingDataArray[i].time}`).addClass(futureHourEmptyClass);
      }
    }
  }
}

$(".meeting-description").on("input", function () {
  $(this).next().children(".fa-save").removeClass("d-none");
});

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
  // update classes
  $(this).parent().parent().addClass("filled").removeClass("empty");
  // Hide icon
  $(this).addClass("d-none");
  // Show trash icon
  $(this).nextAll(".fa-trash").removeClass("d-none");
  // save to localStorage
  saveMeetingsToLocalStorage();
});

function saveMeetingsToLocalStorage() {
  let meetingObjectJSON = JSON.stringify(meetingDataArray);
  localStorage.setItem("work-day-planner", meetingObjectJSON);
}

function loadMeetingsFromLocalStorage() {
  let localMeetingData = JSON.parse(localStorage.getItem("work-day-planner"));
  console.log(localMeetingData);
  if (!localMeetingData) {
    // No data present, so just set to the empty meetingDataArray
    localMeetingData = meetingDataArray;
  } else {
    // update the meetinDataArray with the locally stored data
    meetingDataArray = localMeetingData;
  }

  $(document).on("click", ".fa-trash", function () {
    // Remove this item's parents sibling
    let timeBlock = $(this).parent().prevAll(".time").text();
    let timeBlockInt = parseInt(timeBlock);
    // convert to 24 time
    if (timeBlockInt < 9) {
      timeBlockInt += 12;
    }
    // update the object
    meetingDataArray[timeBlockInt - meetingDataArray.length].description = "";
    // clear the field
    $(this).parent().prevAll(".meeting-description").text("");
    $(this).parent().parent().addClass("empty").removeClass("filled");
    $(this).addClass("d-none");
    // $(this).parent().parent().addClass("empty");
    // update localStorage
    saveMeetingsToLocalStorage();
  });

  // write data to the page
  for (let index = 0; index < localMeetingData.length; index++) {
    // Select the element with ID = time and select the child with class .meeting-description
    $(`#${localMeetingData[index].time}`).children(".meeting-description").text(localMeetingData[index].description);
  }
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

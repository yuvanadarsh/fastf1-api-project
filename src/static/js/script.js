year_dropdown = document.getElementById("year-dropdown"); // year drodown element
form = document.getElementById("myForm"); // form element
form.addEventListener("submit", handleYearInfo); // when the form is submitted, handle the information

for (let i = 2025; i >= 1950; i--) {
  // create new options for every year
  option = document.createElement("option");
  option.value = i;
  option.innerText = i;

  year_dropdown.add(option);
}

year_dropdown.addEventListener("change", function (event) {
  // when the year dropdown is changed, preventDefault and create fetch data
  event.preventDefault();

  // if a session dropdown was already crated from previous request, get rid of it
  // prevents multiple submissions and calls to FastF1 API
  if (document.getElementById("session-dropdown")) {
    document.getElementById("session-dropdown").remove();
  }

  // process the year info and proceed with the next sub-task
  // this subtask means getting all the grand prixs that happened in a given year
  // the year was the input from the dropdown
  handleYearInfo();
});

function handleYearInfo() {
  // fetch all the grand prixs that happened in a given year
  fetch(`/${year_dropdown.value}`, {
    method: "POST",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      displayCountries(data); // display all the grand prixs
    })
    .then(console.log("Done"))
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

function displayCountries(data) {
  let countryOptions = [];
  if (document.getElementById("gp-dropdown")) {
    // if it exists
    document.getElementById("gp-dropdown").remove(); // get rid of it
  }

  gp_dropdown = document.createElement("select"); // create a new one
  gp_dropdown.id = "gp-dropdown";

  for (let i = 1; i < data.length; i++) {
    countryOptions.push(data[i].EventName); // push every country option that exists
  }

  startingOption = document.createElement("option");
  startingOption.innerText = "Select a Grand Prix";
  startingOption.selected = true;
  startingOption.disabled = true;
  gp_dropdown.add(startingOption);

  for (let i = 0; i < countryOptions.length; i++) {
    option = document.createElement("option");
    option.value = countryOptions[i];
    option.innerText = countryOptions[i];

    gp_dropdown.add(option);
  }

  form.appendChild(gp_dropdown);

  gp_dropdown.addEventListener("change", function (event) {
    event.preventDefault();
    displaySessions();
  });
}

function displaySessions() {
  if (document.getElementById("session-dropdown")) {
    document.getElementById("session-dropdown").remove();
  }

  session_dropdown = document.createElement("select");
  session_dropdown.id = "session-dropdown";

  startingOption = document.createElement("option");
  startingOption.innerText = "Select a Session";
  startingOption.selected = true;
  startingOption.disabled = true;
  session_dropdown.add(startingOption);

  let raceOptions = [
    "Practice 1",
    "Practice 2",
    "Practice 3",
    "Qualifying",
    "Race",
  ];

  for (let i = 0; i < raceOptions.length; i++) {
    option = document.createElement("option");
    option.value = raceOptions[i];
    option.innerText = raceOptions[i];

    session_dropdown.add(option);
  }

  form.appendChild(session_dropdown);

  session_dropdown.addEventListener("change", function (event) {
    event.preventDefault();
    let year = document.getElementById("year-dropdown").value;
    let gp = document.getElementById("gp-dropdown").value;
    let session = document.getElementById("session-dropdown").value;
    getRaceData(year, gp, session);
  });
}

function getRaceData(year, gp, session) {
  fetch(`/${year}/${gp}/${session}`, {
    method: "POST",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      displayData(data);
    })
    .then(console.log("Done"))
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

function displayData(data) {
  if (document.getElementById("data-table")) {
    document.getElementById("data-table").remove();
  }
  table = document.createElement("table");
  table.id = "data-table";
  table.innerHTML = "";
  head = table.insertRow(0);

  titles = ["Pos.", "Driver Num.", "Full Name", "Team", "Time", "Points"];
  widths = ["100", "300", "500", "400", "400", "100"];

  for (let i = 0; i < titles.length; i++) {
    row = document.createElement("th");
    row.width = widths[i];
    row.innerHTML = titles[i];
    head.appendChild(row);
  }

  for (let i = 0; i < data.length; i++) {
    row = table.insertRow(i + 1);
    row.insertCell(0).textContent = i + 1;
    row.insertCell(1).textContent = data[i].DriverNumber;
    row.insertCell(2).textContent = data[i].FullName;
    row.insertCell(3).textContent = data[i].TeamName;
    if (i == 0) {
      row.insertCell(4).textContent = formatTime(
        converMillisecondsToSeconds(data[i].Time)
      );
    } else {
      if (data[i].Time != null) {
        row.insertCell(4).textContent =
          "+" + formatTime(converMillisecondsToSeconds(data[i].Time));
      } else {
        row.insertCell(4).textContent = "+1 Lap";
      }
    }

    row.insertCell(5).textContent = data[i].Points;
  }
  document.getElementById("output").appendChild(table);
}

function converMillisecondsToSeconds(milliseconds) {
  const seconds = milliseconds / 1000;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return {
    hours: hours,
    minutes: remainingMinutes,
    seconds: remainingSeconds,
  };
}

function formatTime(timeObject) {
  finalStr = "";
  if (timeObject.hours != 0) {
    finalStr += timeObject.hours;
    finalStr += ":";
  }

  if (timeObject.minutes != 0) {
    finalStr += timeObject.minutes;
    finalStr += ":";
  }

  if (timeObject.seconds != 0) {
    finalStr += timeObject.seconds.toFixed(3);
  }
  return finalStr;
}

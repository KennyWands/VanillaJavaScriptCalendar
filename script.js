let nav = 0;
// tracks month
let clicked = null;
// day clicked;
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];
// either the info in storage or an empty array
const eventTitleInput = document.getElementById("eventTitleInput");
const calendar = document.getElementById("calendar");
const newEventModal = document.getElementById("newEventModal");
const deleteEventModal = document.getElementById("deleteEventModal");

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function load() { // render calendar
  const dt = new Date(); // current date and time
  
  if (nav != 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }
  // tracks user change of month

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();
  const firstDayOfMonth = new Date(year, month, 1);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // 0 is last day of previous month
  // so this tells us how many days are in the month
  const dateString = firstDayOfMonth.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);
  //split weekdays on the comma after day and take that element i.e. element 0

  document.getElementById("monthDisplay").innerText = `${dt.toLocaleDateString(
    "en-GB",
    { month: "long" }
  )} ${year}`;

  calendar.innerHTML = "";

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");
    const dayString = `${i - paddingDays}/${month + 1}/${year}`;
    if (i > paddingDays) {
      if (i - paddingDays === day && nav === 0) {
        daySquare.id = "currentDay";
      }
      daySquare.innerText = i - paddingDays;
      daySquare.addEventListener("click", () => openModal(dayString));
      //the date argument being passed to the function
      const eventForDay = events.find((event) => event.date === dayString);
      if (eventForDay) {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }
    } else {
      daySquare.classList.add("padding");
    }
    calendar.appendChild(daySquare);
  }
  // console.log(paddingDays);
  console.log(dateString);
  console.log(dt);
  console.log(day, month, year);
  console.log(month);
  console.log(year);
  console.log(daysInMonth);
}
function openModal(date) {
  clicked = date;
  const eventForDay = events.find((event) => event.date === clicked);
  if (eventForDay) {
    document.getElementById("eventText").innerText = eventForDay.title;
    deleteEventModal.style.display = "block";
  } else {
    newEventModal.style.display = "block";
  }
  modalBackDrop.style.display = "block";
}
function closeModal() {
  eventTitleInput.classList.remove("error");
  newEventModal.style.display = "none";
  deleteEventModal.style.display = "none";
  modalBackDrop.style.display = "none";
  eventTitleInput.value = " ";
  clicked = null;
  load();
}
function saveEvent() {
  console.log("save event");
  //   console.log(eventTitleInput.value);
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove("error");

    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });
    localStorage.setItem("events", JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add("error");
  }
}
function deleteEvent() {
  events = events.filter((event) => event.date !== clicked);
  localStorage.setItem("events", JSON.stringify(events));
  closeModal();
}
function initButtons() {
  document.getElementById("nextButton").addEventListener("click", () => {
    nav++;
    load();
  });
  document.getElementById("backButton").addEventListener("click", () => {
    nav--;
    load();
  });
  document.getElementById("saveButton").addEventListener("click", saveEvent);
  document.getElementById("cancelButton").addEventListener("click", closeModal);
  document.getElementById("closeButton").addEventListener("click", closeModal);
  document
    .getElementById("deleteButton")
    .addEventListener("click", deleteEvent);
}

initButtons();
load();

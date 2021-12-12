import ical from "ical/ical";
import * as roam from "./roam-utils";
import * as dom from "./dom-utils";
import * as pageTitle from "./page-title";

if (!ICAL_URL) {
  alert("Please add `var ICAL_URL = ...;` before running this script.");
}

function makeUrl() {
  if (ICAL_URL.includes("https://calendar.google.com/calendar/ical")) {
    return `https://gcal-cors-proxy.vercel.app/api/calendar?url=${ICAL_URL}`;
  } else {
    return ICAL_URL;
  }
}

async function getICal() {
  const res = await fetch(makeUrl());

  if (ICAL_URL.includes("https://calendar.google.com/calendar/ical")) {
    return await res.json();
  } else {
    const data = await res.text();
    return ical.parseICS(data);
  }
}

dom.setupTrigger(async () => {
  const data = await getICal();
  const todayPageTitle = pageTitle.getByDate(new Date());
  let todayEventsBlock;

  const items = Object.values(data).filter((event) => {
    if (event.type !== "VEVENT") return false;
    const startDate = new Date(event.start);
    return isToday(startDate);
  });

  if (items.length) {
    todayEventsBlock = await roam.getOrCreateBlockOnPage(
      todayPageTitle,
      "[[Events]]"
    );
  }

  const promises = items.map(async (event, i) => {
    const titleBlockId = await roam.getOrCreateChildBlock(
      todayEventsBlock,
      makeTitle(event),
      i
    );

    return Promise.all([
      insertDescription(titleBlockId, event),
      insertAttendees(titleBlockId, event),
    ]);
  });

  await Promise.all(promises);
});

function isToday(date) {
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  return todayDay === day && todayMonth === month && todayYear === year;
}

function makeTitle(event) {
  const start = new Date(event.start);
  const hours = start.getHours().toString().padStart(2, 0);
  const minutes = start.getMinutes().toString().padStart(2, 0);
  const time = `${hours}:${minutes}`;
  return `${time} - ${event.summary}`;
}

function insertDescription(titleBlock, event) {
  if (event.description) {
    return roam.getOrCreateChildBlock(titleBlock, event.description, -1);
  }
}

async function insertAttendees(titleBlock, event) {
  const attendees = event.attendee.filter(
    (attendee) => attendee.val !== event.organizer.val
  );

  if (attendees.length === 0) return;

  const attendedByBlock = await roam.getOrCreateChildBlock(
    titleBlock,
    "Attendees",
    0
  );

  return Promise.all(
    attendees.map((attendee) =>
      roam.getOrCreateChildBlock(
        attendedByBlock,
        `[[${attendee.params.CN}]]`,
        -1
      )
    )
  );
}

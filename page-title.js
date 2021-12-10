const suffixes = ["th", "st", "nd", "rd"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getSuffix(day) {
  const number = typeof day === "string" ? parseInt(day, 10) : day;

  const tail = number % 100;
  return suffixes[(tail < 11 || tail > 13) && tail % 10] || suffixes[0];
}

export function getByDate(date) {
  const day = date.getDate();
  const suffix = getSuffix(day);
  const monthIndex = date.getMonth();
  const monthName = months[monthIndex];
  const year = date.getFullYear();

  return `${monthName} ${day}${suffix}, ${year}`;
}

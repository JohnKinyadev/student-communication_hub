export function getStartOfDay(dateValue) {
  const date = new Date(dateValue);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getTodayStart() {
  return getStartOfDay(new Date());
}

export function isPastDate(dateValue) {
  return getStartOfDay(dateValue) < getTodayStart();
}

export function getTodayInputValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

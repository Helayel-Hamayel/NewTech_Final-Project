const timeZone = "Asia/Jerusalem";

export function formatIsraeliDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat("en-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone,
  }).format(date);
}

export function formatIsraeliDateTime(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  const time = new Intl.DateTimeFormat("en-IL", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).format(date);

  return `${formatIsraeliDate(date)} @ ${time}`;
}

function fillZero(num) {
  if (num < 10) {
    return `0${num}`;
  } else {
    return num;
  }
}

export function getDate(timestamp) {
  if (!timestamp) {
    return;
  }
  const date = new Date(+timestamp);
  const month = fillZero(date.getMonth() + 1);
  return `${date.getFullYear()}-${month}`;
}

export function getDateTime(timestamp) {
  if (!timestamp) {
    return;
  }
  const date = new Date(+timestamp);
  const month = fillZero(date.getMonth() + 1);
  const day = fillZero(date.getUTCDate());
  const hours = fillZero(date.getUTCHours());
  const minutes = fillZero(date.getUTCMinutes());
  return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}`;
}

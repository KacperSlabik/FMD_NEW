import moment from 'moment';

export const formatDateTime = (date, time) => {
  const month = date.$M + 1;
  const day = date.$D;

  const hour = time.$H;
  const minute = time.$m;

  return `${date.$y}-${formatDatePart(month)}-${formatDatePart(day)}T${formatDatePart(hour)}:${formatDatePart(minute)}:00`;
};

const formatDatePart = (part) => (part >= 10 ? part : '0' + part);

export const getRemainingTime = (startDate, days) => {
  const createdAt = moment(startDate);
  const now = moment();
  const duration = moment.duration(createdAt.add(days, 'days').diff(now));

  let countdownText = 'Pozostało: ';
  let isEnded = false;

  if (duration.asMilliseconds() > 0) {
    const days = duration.days();
    const hours = duration.hours();

    if (days > 0) {
      countdownText += `${days} dni`;
    }

    if (hours > 0) {
      if (days > 0) {
        countdownText += ', ';
      }

      countdownText += `${hours} godzin`;
    }
  } else {
    countdownText = 'Przekroczono limit czasu';
    isEnded = true;
  }

  return [countdownText, isEnded];
};

export const formatDateTime = (date, time) => {
  const month = date.$M + 1;
  const day = date.$D;

  const hour = time.$H;
  const minute = time.$m;

  return `${date.$y}-${formatDatePart(month)}-${formatDatePart(day)}T${formatDatePart(hour)}:${formatDatePart(minute)}:00Z`;
};

const formatDatePart = (part) => (part >= 10 ? part : '0' + part);

export const combineDateAndTime = (date: Date, time: Date) => {
  const sTime = `${time.getHours()}:${time.getMinutes()}:00`;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const sDate = `${year}-${month}-${day}`;

  return new Date(`${sDate} ${sTime}`);
};

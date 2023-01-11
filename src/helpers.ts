// Formats a date into DD-MM-YYYY
export const toCommonDate = (date: Date): string => {
  const dateStr = `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`;

  return dateStr;
};

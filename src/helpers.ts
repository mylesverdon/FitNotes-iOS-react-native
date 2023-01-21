// Formats a date into DD-MM-YYYY
export const toCommonDate = (date: Date): string => {
  const dateStr = `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`;

  return dateStr;
};

export const fromCommonDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split("-");
  const date = new Date(Number(year), Number(month), Number(day) + 1);

  return date;
};

export const kgToLb = (kg: number): number => {
  return Math.round(kg * 2.20462 * 100) / 100;
};

export const lbToKg = (lb: number): number => {
  return Math.round((lb / 2.20462) * 100) / 100;
};

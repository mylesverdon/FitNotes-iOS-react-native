// Formats a date into DD-MM-YYYY
export const toCommonDate = (date: Date): string => {
  const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

  return dateStr;
};

export const fromCommonDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return date;
};

export const kgToLb = (kg: number): number =>
  Math.round(kg * 2.20462 * 100) / 100;

export const lbToKg = (lb: number): number =>
  Math.round((lb / 2.20462) * 100) / 100;

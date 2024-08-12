export const DCDateFormat = (dateStr: string) => {
  const date = new Date(dateStr);

  const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  const day = date.getUTCDate();
  const daySuffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return formattedDate.replace(/(\d+)/, `$1${daySuffix}`);
};

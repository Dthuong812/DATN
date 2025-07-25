import { eachDayOfInterval, format } from 'date-fns';

export const getAllDates = (startDate: Date, endDate: Date): string[] => {
  // Ensure the dates are Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Get all dates in the interval
  const dateArray = eachDayOfInterval({ start, end });

  // Format each date as a string in 'YYYY-MM-DD' format
  return dateArray.map((date) => format(date, 'yyyy-MM-dd'));
};

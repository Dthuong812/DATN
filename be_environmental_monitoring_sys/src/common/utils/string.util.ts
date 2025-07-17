export const platenumber_util = (plate: string): string => {
  plate = plate.trim().toUpperCase();

  const lastFive = plate.slice(-5);
  const prefix = plate.slice(0, 3);
  if (
    plate.length === 8 &&
    /^\d{2}[A-Z]$/.test(prefix) &&
    /^\d{5}$/.test(lastFive) &&
    !plate.includes('.') &&
    !plate.includes('-')
  ) {
    plate = prefix + '-' + lastFive.slice(0, 3) + '.' + lastFive.slice(3);
  }
  return plate;
};

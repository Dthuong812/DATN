export const count_index = (
  limit: number,
  page: number,
): { to: number; from: number } => {
  const from = limit * (page - 1) + 1;
  const to = from + limit - 1;
  return { from, to };
};

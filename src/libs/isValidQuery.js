export function isValidQuery(sort, limit, skip) {
  const validSortQuery = [
    'asc',
    'desc',
    'ascending',
    'descending',
    '1',
    '-1',
    1,
    -1
  ];

  return !validSortQuery.includes(sort) || String(Number(limit)) === 'NaN'
    || String(Number(skip)) === 'NaN';
}

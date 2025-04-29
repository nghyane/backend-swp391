export const academicYearParam = {
  name: 'academic_year',
  in: 'query',
  description: 'Academic year (e.g., 2024)',
  schema: { type: 'integer', minimum: 2000, maximum: 2100 },
  example: 2024
};

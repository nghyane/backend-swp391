export const campusIdParam = {
  name: 'campus_id',
  in: 'query',
  description: 'Campus ID',
  schema: { type: 'integer' },
  example: 1
};

export const campusCodeParam = {
  name: 'campus_code',
  in: 'query',
  description: 'Campus code',
  schema: { type: 'string' },
  example: 'HCM'
};

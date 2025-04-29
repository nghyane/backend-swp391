export const nameFilterParam = {
  name: 'name',
  in: 'query',
  description: 'Filter by name (case-insensitive partial match)',
  schema: { type: 'string' },
  example: 'computer'
};

export const idPathParam = {
  name: 'id',
  in: 'path',
  description: 'Resource ID',
  required: true,
  schema: { type: 'integer' },
  example: 1
};

export const pageParam = {
  name: 'page',
  in: 'query',
  description: 'Page number for pagination',
  schema: { type: 'integer', minimum: 1, default: 1 },
  example: 1
};

export const limitParam = {
  name: 'limit',
  in: 'query',
  description: 'Number of items per page',
  schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
  example: 20
};

export const sortByParam = {
  name: 'sort_by',
  in: 'query',
  description: 'Field to sort by',
  schema: { type: 'string' },
  example: 'name'
};

export const sortOrderParam = {
  name: 'sort_order',
  in: 'query',
  description: 'Sort order (asc or desc)',
  schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
  example: 'desc'
};

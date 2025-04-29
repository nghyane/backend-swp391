export const platformParam = {
  name: 'platform',
  in: 'query',
  description: 'Platform name (e.g., zalo)',
  schema: { type: 'string', enum: ['zalo'] },
  example: 'zalo'
};

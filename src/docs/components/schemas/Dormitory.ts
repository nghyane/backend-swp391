export const Dormitory = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    campus_id: { type: 'integer' },
    name: { type: 'string', example: 'Building A' },
    description: { type: 'string', example: 'Modern dormitory with air conditioning' },
    capacity: { type: 'integer', example: 500 },
    campus: { $ref: '#/components/schemas/Campus' }
  },
  required: ['id', 'campus_id', 'name']
};

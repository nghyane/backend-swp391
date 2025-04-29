export const DormitoryWithCampus = {
  allOf: [
    { $ref: '#/components/schemas/Dormitory' },
    {
      type: 'object',
      properties: {
        campus: { $ref: '#/components/schemas/Campus' }
      }
    }
  ]
};

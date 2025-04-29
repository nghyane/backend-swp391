export const Campus = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    code: { type: 'string', example: 'HCM' },
    name: { type: 'string', example: 'Ho Chi Minh City Campus' },
    address: { type: 'string', example: '123 Nguyen Hue, District 1, HCMC' },
    contact: {
      type: 'object',
      properties: {
        phone: { type: 'string', example: '(+84) 28 1234 5678' },
        email: { type: 'string', example: 'hcm@university.edu.vn' },
      },
    },
  },
  required: ['id', 'code', 'name', 'contact']
};

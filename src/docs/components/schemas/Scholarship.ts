export const Scholarship = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string', example: 'Merit Scholarship' },
    description: { type: 'string', example: 'Scholarship for high-achieving students' },
    condition: { type: 'string', example: 'GPA of 3.5 or higher' },
    amount: { type: 'integer', example: 5000000, description: 'Amount in VND' },
    application_url: { type: 'string', example: 'https://university.edu.vn/scholarships/apply' },
  },
  required: ['id', 'name']
};

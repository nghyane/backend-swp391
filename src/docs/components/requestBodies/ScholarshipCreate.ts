export const ScholarshipCreate = {
  description: 'Scholarship creation payload',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Merit Scholarship' },
          description: { type: 'string', example: 'Scholarship for high-achieving students' },
          condition: { type: 'string', example: 'GPA of 3.5 or higher' },
          amount: { type: 'integer', example: 5000000 },
          major_id: { type: 'integer', example: 1 },
          campus_id: { type: 'integer', example: 1 },
          application_url: { type: 'string', example: 'https://university.edu.vn/scholarships/apply' }
        },
        required: ['name', 'amount', 'major_id', 'campus_id']
      }
    }
  }
};

export const Career = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string', example: 'Software Engineer' },
    description: { type: 'string', example: 'Develops software applications and systems' },
    salary_range: { type: 'string', example: '$60,000 - $120,000' },
    category: { type: 'string', example: 'Technology' },
    info_url: { type: 'string', example: 'https://university.edu.vn/careers/software-engineer' },
    major_id: { type: 'integer' }
  },
  required: ['id', 'name', 'major_id']
};

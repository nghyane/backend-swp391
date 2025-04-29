export const AdmissionMethod = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string', example: 'High School Academic Records' },
    description: { type: 'string', example: 'Admission based on high school GPA and academic achievements' },
    application_url: { type: 'string', example: 'https://university.edu.vn/apply/academic-records' },
  },
  required: ['id', 'name']
};

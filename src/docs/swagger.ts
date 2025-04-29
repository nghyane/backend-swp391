import swaggerJsdoc from 'swagger-jsdoc';
import { components } from './components';

const version = '1.0.0';

/**
 * Swagger configuration options
 */
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Admission Consulting API Documentation',
      version,
      description: 'API documentation for the Admission Consulting Platform',
      contact: {
        name: 'API Support',
        email: 'hoangvananhnghia99@gmail.com',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'Development server',
      },
    ],
    components,
    tags: [
      { name: 'Majors', description: 'Academic majors operations' },
      { name: 'Campuses', description: 'Campus operations' },
      { name: 'Scholarships', description: 'Scholarship operations' },
      { name: 'Dormitories', description: 'Dormitory operations' },
      { name: 'Admission Methods', description: 'Admission methods operations' },
      { name: 'Sessions', description: 'Session management for chatbot' },
      { name: 'Webhooks', description: 'Webhook endpoints for chatbot integration' },
    ],
  },
  apis: ['./src/docs/routes/*.yaml'],
};

export const swaggerSpec = swaggerJsdoc(options);

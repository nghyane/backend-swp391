import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

// Cấu hình Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Tư vấn tuyển sinh',
      version: '1.0.0',
      description: 'API cho nền tảng tư vấn tuyển sinh',
      contact: {
        name: 'Nghia',
        email: 'hoangvananhnghia@gmail.com',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'API Server',
      },
    ],
  },
  // Bao gồm file định nghĩa components và các routes
  apis: [
    './src/docs/components/*.yaml',
    './src/api/routes/*.ts',
  ],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Hàm thiết lập Swagger UI
export const setupSwagger = (app: Application) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Tư vấn tuyển sinh',
  }));
};

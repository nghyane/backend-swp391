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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token authentication. Add token to Authorization header. Example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."'
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Bao gồm file định nghĩa components và các routes
  apis: [
    './src/docs/components/*.yaml',
    './src/api/routes/*.ts',
  ],
};

// Tạo tài liệu Swagger từ cấu hình
export const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Hàm thiết lập Swagger UI
export const setupSwagger = (app: Application) => {

  app.get('/docs/json', (_, res) => {
    res.setHeader('Content-Type', 'application/json');

    res.send(swaggerDocs);
  });

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Tư vấn tuyển sinh',
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
    }
  }));
};

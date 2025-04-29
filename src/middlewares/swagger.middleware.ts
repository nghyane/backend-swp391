import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../docs/swagger';

/**
 * Configure Swagger UI middleware
 */
const swaggerRouter = Router();

// Serve Swagger specification as JSON
swaggerRouter.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Serve Swagger UI
swaggerRouter.use(
  '/',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  })
);

export default swaggerRouter;

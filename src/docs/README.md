# API Documentation

## Overview

This directory contains the API documentation for the Admission Consulting Platform. The documentation is generated using OpenAPI/Swagger specification.

## Structure

- `swagger.ts`: Main configuration file for Swagger
- `routes/`: YAML files containing API endpoint definitions
  - `majors.yaml`: Endpoints for academic majors
  - `campuses.yaml`: Endpoints for campuses
  - `scholarships.yaml`: Endpoints for scholarships
  - `dormitories.yaml`: Endpoints for dormitories
  - `admission-methods.yaml`: Endpoints for admission methods
  - `sessions.yaml`: Endpoints for session management
  - `webhooks.yaml`: Endpoints for webhook integration

## Accessing the Documentation

The API documentation is available at `/docs` when the server is running. For example, if your server is running on port 4000, you can access the documentation at:

```
http://localhost:4000/docs
```

## Adding New Endpoints

To add documentation for new endpoints:

1. Create or update the appropriate YAML file in the `routes/` directory
2. Follow the OpenAPI 3.0 specification format
3. Use the existing components (schemas, parameters, responses) defined in `swagger.ts`
4. Restart the server to see the changes

## Best Practices

- Keep the documentation up-to-date with the actual API implementation
- Use consistent naming and formatting across all endpoint definitions
- Provide detailed descriptions for endpoints, parameters, and responses
- Use appropriate HTTP status codes and response formats
- Include examples where helpful

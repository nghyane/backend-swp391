export const PaginatedResponse = {
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: { type: 'object' },
          description: 'Array of items matching the query'
        },
        total: { type: 'integer', example: 100, description: 'Total number of items' },
        page: { type: 'integer', example: 1, description: 'Current page number' },
        limit: { type: 'integer', example: 10, description: 'Number of items per page' },
        total_pages: { type: 'integer', example: 10, description: 'Total number of pages' },
      },
      required: ['items', 'total', 'page', 'limit', 'total_pages']
    },
    message: { type: 'string', example: 'Items retrieved successfully' },
    success: { type: 'boolean', example: true },
    timestamp: { type: 'string', format: 'date-time', example: '2024-04-20T10:30:00Z' },
  },
  required: ['data', 'message', 'success', 'timestamp']
};

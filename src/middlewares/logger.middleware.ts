import pinoHttp from 'pino-http';
import pino from 'pino';
import { logger } from '../utils/pino-logger';
import env from '../config/env';

/**
 * Cấu hình middleware pino-http cho Express
 */
export const httpLogger = pinoHttp({
  logger,
  // Không log health check routes và các request chứa hình ảnh/file
  autoLogging: {
    ignore: (req) => {
      // Bỏ qua health check routes
      if (req.url === '/health' || req.url === '/ping') {
        return true;
      }

      // Bỏ qua các request chứa hình ảnh/file
      const contentType = req.headers['content-type'] || '';
      if (
        contentType.includes('image/') ||
        contentType.includes('multipart/form-data') ||
        contentType.includes('application/octet-stream') ||
        contentType.includes('video/') ||
        contentType.includes('audio/')
      ) {
        return true;
      }

      return false;
    }
  },
  // Tùy chỉnh cách log request
  customLogLevel: (_req, res, err) => {
    if (err) return 'error';
    if (res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },

  // Tùy chỉnh thông điệp log
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} completed with ${res.statusCode}`;
  },
  customErrorMessage: (req, res, err) => {
    return `${req.method} ${req.url} failed with ${res.statusCode}: ${err?.message || 'Unknown error'}`;
  },

  // Tùy chỉnh serializers
  serializers: {
    req: (req) => {
      // Kiểm tra content-type để không log body của các request chứa hình ảnh/file
      const contentType = req.headers['content-type'] || '';
      const isFileUpload =
        contentType.includes('image/') ||
        contentType.includes('multipart/form-data') ||
        contentType.includes('application/octet-stream') ||
        contentType.includes('video/') ||
        contentType.includes('audio/');

      // Chuẩn bị thông tin cơ bản của request
      const reqInfo = {
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
        body: req.body ? '[REDACTED]' : undefined,
      };

      // Chỉ thêm body trong môi trường development và không phải là file upload
      if (env.NODE_ENV !== 'production' && !isFileUpload && req.body) {
        // Nếu là JSON, thêm body vào log
        if (contentType.includes('application/json')) {
          return {
            ...reqInfo,
            body: req.body 
          };
        }
      }

      return reqInfo;
    },
    res: (res) => ({
      statusCode: res.statusCode,
    }),
    err: pino.stdSerializers.err,
  },
});

export default httpLogger;

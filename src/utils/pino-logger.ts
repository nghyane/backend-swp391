import pino from 'pino';
import env from '../config/env';

/**
 * Cấu hình Pino logger dựa trên môi trường
 */
const pinoConfig = {
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: env.NODE_ENV === 'production' 
    ? undefined 
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
  // Thêm timestamp vào mỗi log
  timestamp: pino.stdTimeFunctions.isoTime,
  // Mixin để thêm thông tin vào mỗi log
  // base: {
  //   app: 'admission-backend',
  //   env: env.NODE_ENV,
  // },
  // Serializers để định dạng các đối tượng phức tạp
  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
  // Redact để ẩn thông tin nhạy cảm
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers["set-cookie"]'],
    censor: '[REDACTED]',
  },
};

/**
 * Logger instance chính
 */
export const logger = pino(pinoConfig);

/**
 * Tạo child logger với namespace
 * @param namespace Namespace cho logger
 * @returns Child logger
 */
export const createNamespace = (namespace: string) => {
  return logger.child({ namespace });
};

/**
 * Tạo child logger với context
 * @param context Context object
 * @returns Child logger
 */
export const createLogger = (context: Record<string, any>) => {
  return logger.child(context);
};

/**
 * Xuất logger mặc định
 */
export default logger;

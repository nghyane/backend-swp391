import env from '../config/env';

/**
 * Log levels enum
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

/**
 * ANSI color codes for terminal output
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

/**
 * Color configuration for different log levels
 */
const levelColors = {
  [LogLevel.DEBUG]: colors.cyan,
  [LogLevel.INFO]: colors.green,
  [LogLevel.WARN]: colors.yellow,
  [LogLevel.ERROR]: colors.red
};

/**
 * Emoji configuration for different log levels
 */
const levelEmojis = {
  [LogLevel.DEBUG]: '🔍',
  [LogLevel.INFO]: 'ℹ️',
  [LogLevel.WARN]: '⚠️',
  [LogLevel.ERROR]: '❌'
};

/**
 * Current environment
 */
const NODE_ENV = env.NODE_ENV || 'development';

/**
 * Minimum log level based on environment
 * - In production, we only log INFO and above
 * - In other environments, we log all levels
 */
const MIN_LOG_LEVEL = NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG;

/**
 * Format the current timestamp
 * @returns Formatted timestamp string
 */
const getTimestamp = (): string => {
  const now = new Date();
  return now.toISOString();
};

/**
 * Format a log message with timestamp, level, and color
 * @param level Log level
 * @param args Arguments to log
 * @returns Formatted log message
 */
const formatLogMessage = (level: LogLevel, args: any[]): string => {
  const timestamp = getTimestamp();
  const color = levelColors[level];
  const emoji = levelEmojis[level];

  // Format the arguments
  const formattedArgs = args.map(arg => {
    if (arg instanceof Error) {
      return `${arg.message}\n${arg.stack}`;
    } else if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg, null, 2);
      } catch (e) {
        return String(arg);
      }
    } else {
      return String(arg);
    }
  }).join(' ');

  // Return the formatted message
  return `${colors.dim}[${timestamp}]${colors.reset} ${color}${emoji} [${level}]${colors.reset} ${formattedArgs}`;
};

/**
 * Check if the given log level should be logged
 * @param level Log level to check
 * @returns True if the level should be logged
 */
const shouldLog = (level: LogLevel): boolean => {
  const levels = Object.values(LogLevel);
  const minLevelIndex = levels.indexOf(MIN_LOG_LEVEL);
  const currentLevelIndex = levels.indexOf(level);

  return currentLevelIndex >= minLevelIndex;
};

/**
 * Log a message at the specified level
 * @param level Log level
 * @param args Arguments to log
 */
const logAtLevel = (level: LogLevel, ...args: any[]): void => {
  if (!shouldLog(level)) return;

  const formattedMessage = formatLogMessage(level, args);

  switch (level) {
    case LogLevel.ERROR:
      console.error(formattedMessage);
      break;
    case LogLevel.WARN:
      console.warn(formattedMessage);
      break;
    default:
      console.log(formattedMessage);
  }
};

/**
 * Logger object with methods for different log levels
 */
export const logger = {
  /**
   * Log a debug message
   * @param args Arguments to log
   */
  debug: (...args: any[]): void => logAtLevel(LogLevel.DEBUG, ...args),

  /**
   * Log an info message
   * @param args Arguments to log
   */
  info: (...args: any[]): void => logAtLevel(LogLevel.INFO, ...args),

  /**
   * Log a warning message
   * @param args Arguments to log
   */
  warn: (...args: any[]): void => logAtLevel(LogLevel.WARN, ...args),

  /**
   * Log an error message
   * @param args Arguments to log
   */
  error: (...args: any[]): void => logAtLevel(LogLevel.ERROR, ...args)
};

/**
 * Legacy log function for backward compatibility
 * @deprecated Use logger.info() instead
 * @param args Arguments to log
 */
export const log = (...args: any[]): void => {
  logger.info(...args);
};

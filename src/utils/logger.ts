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
 * Logger configuration interface
 */
export interface LoggerConfig {
  minLevel: LogLevel;
  useColors: boolean;
  useEmojis: boolean;
  includeTimestamp: boolean;
}

/**
 * Log context interface
 */
export interface LogContext {
  [key: string]: any;
}

/**
 * ANSI color codes for terminal output
 */
const colors = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
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
 * Default logger configuration based on environment
 */
const defaultConfig: LoggerConfig = {
  minLevel: env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  useColors: true,
  useEmojis: true,
  includeTimestamp: true
};

/**
 * Format the current timestamp
 * @returns Formatted timestamp string
 */
const getTimestamp = (): string => new Date().toISOString();

/**
 * Format a value for logging
 * @param value Value to format
 * @returns Formatted string
 */
const formatValue = (value: any): string => {
  if (value instanceof Error) {
    return `${value.message}\n${value.stack}`;
  } else if (typeof value === 'object' && value !== null) {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
};

/**
 * Logger class with configurable options
 */
class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Create a new logger with updated configuration
   * @param config Configuration overrides
   * @returns New logger instance
   */
  configure(config: Partial<LoggerConfig>): Logger {
    return new Logger({ ...this.config, ...config });
  }

  /**
   * Format a log message with timestamp, level, and color
   * @param level Log level
   * @param message Main message
   * @param context Optional context object
   * @returns Formatted log message
   */
  private formatLogMessage(level: LogLevel, message: string, context?: LogContext): string {
    const parts: string[] = [];

    // Add timestamp if configured
    if (this.config.includeTimestamp) {
      const timestamp = getTimestamp();
      parts.push(this.config.useColors ? `${colors.dim}[${timestamp}]${colors.reset}` : `[${timestamp}]`);
    }

    // Add level with color/emoji if configured
    const levelColor = this.config.useColors ? levelColors[level] : '';
    const levelReset = this.config.useColors ? colors.reset : '';
    const emoji = this.config.useEmojis ? `${levelEmojis[level]} ` : '';
    parts.push(`${levelColor}${emoji}[${level}]${levelReset}`);

    // Add message
    parts.push(message);

    // Add context if provided
    if (context && Object.keys(context).length > 0) {
      parts.push(formatValue(context));
    }

    return parts.join(' ');
  }

  /**
   * Check if the given log level should be logged
   * @param level Log level to check
   * @returns True if the level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = Object.values(LogLevel);
    const minLevelIndex = levels.indexOf(this.config.minLevel);
    const currentLevelIndex = levels.indexOf(level);
    return currentLevelIndex >= minLevelIndex;
  }

  /**
   * Log a message at the specified level
   * @param level Log level
   * @param message Main message
   * @param context Optional context object
   */
  private logAtLevel(level: LogLevel, message: string, context?: LogContext): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatLogMessage(level, message, context);

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
  }

  /**
   * Log a debug message
   * @param message Main message
   * @param context Optional context object
   */
  debug(message: string, context?: LogContext): void {
    this.logAtLevel(LogLevel.DEBUG, message, context);
  }

  /**
   * Log an info message
   * @param message Main message
   * @param context Optional context object
   */
  info(message: string, context?: LogContext): void {
    this.logAtLevel(LogLevel.INFO, message, context);
  }

  /**
   * Log a warning message
   * @param message Main message
   * @param context Optional context object
   */
  warn(message: string, context?: LogContext): void {
    this.logAtLevel(LogLevel.WARN, message, context);
  }

  /**
   * Log an error message
   * @param message Main message
   * @param error Optional error object
   * @param context Optional additional context
   */
  error(message: string, error?: Error, context?: LogContext): void {
    const errorContext = error ? { error: { message: error.message, stack: error.stack }, ...context } : context;
    this.logAtLevel(LogLevel.ERROR, message, errorContext);
  }
}

// Create default logger instance
const defaultLogger = new Logger();

/**
 * Export the default logger instance
 */
export const logger = defaultLogger;

/**
 * Create a new logger with custom configuration
 * @param config Logger configuration
 * @returns Configured logger instance
 */
export const createLogger = (config: Partial<LoggerConfig> = {}): Logger => {
  return defaultLogger.configure(config);
};


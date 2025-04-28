# Logger

## Overview

This module provides a flexible and feature-rich logging system for the application. It supports different log levels, colorized output, and automatic formatting of various data types.

## Features

- **Multiple log levels**: DEBUG, INFO, WARN, ERROR
- **Environment-aware**: Automatically adjusts log level based on environment (development vs production)
- **Colorized output**: Different colors for different log levels
- **Timestamp**: Each log message includes a timestamp
- **Object formatting**: Automatically formats objects, errors, and other data types
- **Emoji indicators**: Visual indicators for different log levels

## Usage

### Basic Usage

```typescript
import { logger } from './utils/logger';

// Different log levels
logger.debug('This is a debug message');
logger.info('This is an info message');
logger.warn('This is a warning message');
logger.error('This is an error message');

// Logging objects
logger.info('User data:', { id: 1, name: 'John' });

// Logging errors
try {
  throw new Error('Something went wrong');
} catch (error) {
  logger.error('An error occurred:', error);
}
```

### Legacy Support

For backward compatibility, the module also exports a `log` function that maps to `logger.info`:

```typescript
import { log } from './utils/logger';

// This will use logger.info internally
log('This is a log message');
```

## Log Levels

The logger supports the following log levels, in order of increasing severity:

1. **DEBUG**: Detailed information, typically useful only for diagnosing problems
2. **INFO**: Confirmation that things are working as expected
3. **WARN**: Indication that something unexpected happened, or may happen in the near future
4. **ERROR**: An error occurred, but the application can still function

In production environments, only INFO, WARN, and ERROR messages are logged. In development environments, all levels including DEBUG are logged.

## Customization

The logger can be customized by modifying the following constants in the module:

- `levelColors`: Colors for different log levels
- `levelEmojis`: Emoji indicators for different log levels
- `MIN_LOG_LEVEL`: Minimum log level to display (automatically set based on environment)

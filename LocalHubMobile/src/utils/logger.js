/**
 * Centralized logging utility for LocalHubMobile
 */

const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG',
};

const formatMessage = (level, message, data) => {
  const timestamp = new Date().toISOString();
  const dataString = data ? ` | Data: ${JSON.stringify(data, null, 2)}` : '';
  return `[${timestamp}] [${level}] ${message}${dataString}`;
};

const logger = {
  info: (message, data) => {
    const formatted = formatMessage(LOG_LEVELS.INFO, message, data);
    console.log(formatted);
  },
  warn: (message, data) => {
    const formatted = formatMessage(LOG_LEVELS.WARN, message, data);
    console.warn(formatted);
  },
  error: (message, data) => {
    const formatted = formatMessage(LOG_LEVELS.ERROR, message, data);
    console.error(formatted);
  },
  debug: (message, data) => {
    if (__DEV__) {
      const formatted = formatMessage(LOG_LEVELS.DEBUG, message, data);
      console.log(formatted);
    }
  },
};

export default logger;

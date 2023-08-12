const { format, createLogger, transports, addColors } = require('winston');
const { combine, printf } = format;
const path = require('path');
const env = require('../config/env.config');

let logger;

const myCustomLevels = {
  levels: {
    debug: 5,
    http: 4,
    info: 3,
    warn: 2,
    error: 1,
    fatal: 0,
  },
  colors: {
    debug: 'bold blue',
    http: 'italic cyan',
    info: 'gray',
    warn: 'yellow',
    error: 'whiteBG red',
    fatal: 'redBG grey',
  },
};

const myFormat = printf(({ level, message }) => {
  return `[${new Date().toLocaleTimeString()}] [${level}]: ${message}`;
});

const myFormatFile = printf(({ level, message }) => {
  return `[${new Date().toLocaleTimeString()}] [${level.toLocaleUpperCase()}]: ${message}`;
});

addColors(myCustomLevels.colors); // Agrega los colores personalizados

switch (env.NODE_ENV) {
  case 'DEVELOPMENT':
    logger = createLogger({
      levels: myCustomLevels.levels, // Niveles personalizados
      transports: [
        new transports.Console({
          level: 'debug',
          format: combine(format.colorize({ all: true }), myFormat),
        }),

        new transports.File({
          filename: path.join(__dirname, '../logs/dev.errors.log'),
          level: 'error',
          format: myFormatFile,
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
      ],
    });
    break;
  case 'PRODUCTION':
    logger = createLogger({
      levels: myCustomLevels.levels, // Niveles personalizados
      transports: [
        new transports.Console({
          level: 'info',
          format: combine(format.colorize({ all: true }), myFormat),
        }),

        new transports.File({
          filename: path.join(__dirname, '../logs/errors.log'),
          level: 'error',
          format: myFormatFile,
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
      ],
    });
    break;
  default:
    break;
}

const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(`${req.method} on ${req.url}`);
  next();
};

module.exports = { addLogger, logger };

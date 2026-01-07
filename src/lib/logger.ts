// src/lib/logger.ts

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production';

  private log(level: LogLevel, message: string, metadata?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    
    if (this.isDevelopment) {
      // En desarrollo: logs con colores
      const colors = {
        info: '\x1b[36m',
        warn: '\x1b[33m',
        error: '\x1b[31m',
        debug: '\x1b[90m',
      };
      const reset = '\x1b[0m';
      const color = colors[level];
      
      console.log(`${color}[${timestamp}] ${level.toUpperCase()}:${reset} ${message}`);
      if (metadata) {
        console.log(color, metadata, reset);
      }
    } else {
      // En producción: JSON
      console.log(JSON.stringify({ level, message, timestamp, ...metadata }));
    }
  }

  public info(message: string, metadata?: Record<string, unknown>) {
    this.log('info', message, metadata);
  }

  public warn(message: string, metadata?: Record<string, unknown>) {
    this.log('warn', message, metadata);
  }

  public error(message: string, metadata?: Record<string, unknown>) {
    this.log('error', message, metadata);
  }

  public debug(message: string, metadata?: Record<string, unknown>) {
    if (this.isDevelopment) {
      this.log('debug', message, metadata);
    }
  }
}

export const logger = new Logger();
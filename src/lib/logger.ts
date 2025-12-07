// Simple logger compatible with Next.js build
const isDev = process.env.NODE_ENV === 'development';
const logLevel = process.env.LOG_LEVEL || 'info';

const levels = {
    trace: 10,
    debug: 20,
    info: 30,
    warn: 40,
    error: 50,
    fatal: 60,
};

const currentLevel = levels[logLevel as keyof typeof levels] || levels.info;

function formatLog(level: string, data: any, message?: string) {
    const timestamp = new Date().toISOString();
    const logData = typeof data === 'object' ? JSON.stringify(data) : data;
    return `[${timestamp}] ${level.toUpperCase()}: ${message || ''} ${logData}`;
}

function createLogger() {
    return {
        trace: (data: any, message?: string) => {
            if (currentLevel <= levels.trace) console.log(formatLog('trace', data, message));
        },
        debug: (data: any, message?: string) => {
            if (currentLevel <= levels.debug) console.log(formatLog('debug', data, message));
        },
        info: (data: any, message?: string) => {
            if (currentLevel <= levels.info) console.log(formatLog('info', data, message));
        },
        warn: (data: any, message?: string) => {
            if (currentLevel <= levels.warn) console.warn(formatLog('warn', data, message));
        },
        error: (data: any, message?: string) => {
            if (currentLevel <= levels.error) console.error(formatLog('error', data, message));
        },
        fatal: (data: any, message?: string) => {
            if (currentLevel <= levels.fatal) console.error(formatLog('fatal', data, message));
        },
        child: () => createLogger(),
    };
}

export const logger = createLogger();

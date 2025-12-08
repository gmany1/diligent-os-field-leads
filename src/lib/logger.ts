
export const log = {
    info: (msg: string, data?: object) =>
        console.log(JSON.stringify({ level: 'info', msg, ...data, ts: new Date().toISOString() })),

    error: (msg: string, error?: unknown, data?: object) =>
        console.error(JSON.stringify({ level: 'error', msg, error: String(error), ...data, ts: new Date().toISOString() })),

    warn: (msg: string, data?: object) =>
        console.warn(JSON.stringify({ level: 'warn', msg, ...data, ts: new Date().toISOString() })),
};

export const logger = log;

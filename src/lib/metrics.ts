import client from 'prom-client';

// Prevent initializing multiple registers in development
const globalForMetrics = global as unknown as { metricsRegistry: client.Registry };

export const register = globalForMetrics.metricsRegistry || new client.Registry();

if (!globalForMetrics.metricsRegistry) {
    client.collectDefaultMetrics({ register, prefix: 'diligent_os_' });
    globalForMetrics.metricsRegistry = register;
}

// Helper to safely get or create metrics
function getOrCreateMetric<T extends client.Metric>(name: string, factory: () => T): T {
    const existing = register.getSingleMetric(name);
    if (existing) {
        return existing as unknown as T;
    }
    const newMetric = factory();
    return newMetric;
}

export const httpRequestDurationMicroseconds = getOrCreateMetric('http_request_duration_seconds', () => new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 1.5, 2, 5],
    registers: [register],
}));

export const httpRequestsTotal = getOrCreateMetric('http_requests_total', () => new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register],
}));

export const dbQueryDuration = getOrCreateMetric('db_query_duration_seconds', () => new client.Histogram({
    name: 'db_query_duration_seconds',
    help: 'Duration of DB queries in seconds',
    labelNames: ['model', 'operation'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2],
    registers: [register],
}));

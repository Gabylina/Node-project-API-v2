import path from 'path';
const storage_path = (rel) => path.resolve(process.cwd(), 'storage', rel);

/* migrated from config/cache.php */
export default {
    default: process.env.CACHE_DRIVER ?? 'database',

    stores: {
        array: {
            driver: 'array',
            serialize: false,
        },

        database: {
            driver: 'database',
            connection: process.env.DB_CACHE_CONNECTION,
            table: process.env.DB_CACHE_TABLE ?? 'cache',
            lock_connection: process.env.DB_CACHE_LOCK_CONNECTION,
            lock_table: process.env.DB_CACHE_LOCK_TABLE,
        },

        file: {
            driver: 'file',
            // PHP's storage_path is omitted; this path is relative to a conceptual
            // base storage directory in the Node.js application.
            path: 'framework/cache/data',
            lock_path: 'framework/cache/data',
        },

        memcached: {
            driver: 'memcached',
            persistent_id: process.env.MEMCACHED_PERSISTENT_ID,
            sasl: [
                process.env.MEMCACHED_USERNAME,
                process.env.MEMCACHED_PASSWORD,
            ],
            options: {
                // PHP constant Memcached::OPT_CONNECT_TIMEOUT is omitted as it's PHP-specific.
                // Node.js Memcached clients would have their own configuration options.
            },
            servers: [
                {
                    host: process.env.MEMCACHED_HOST ?? '127.0.0.1',
                    port: parseInt(process.env.MEMCACHED_PORT ?? '11211', 10),
                    weight: 100,
                },
            ],
        },

        redis: {
            driver: 'redis',
            connection: process.env.REDIS_CACHE_CONNECTION ?? 'cache',
            lock_connection: process.env.REDIS_CACHE_LOCK_CONNECTION ?? 'default',
        },

        dynamodb: {
            driver: 'dynamodb',
            key: process.env.AWS_ACCESS_KEY_ID,
            secret: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_DEFAULT_REGION ?? 'us-east-1',
            table: process.env.DYNAMODB_CACHE_TABLE ?? 'cache',
            endpoint: process.env.DYNAMODB_ENDPOINT,
        },

        octane: {
            driver: 'octane', // This driver is specific to Laravel Octane and has no direct Node.js equivalent.
        },
    },

    prefix: process.env.CACHE_PREFIX ?? (process.env.APP_NAME ? process.env.APP_NAME.toLowerCase().replace(/\s+/g, '-') + '-cache-' : 'laravel-cache-'),        ((process.env.APP_NAME ?? 'laravel').toLowerCase().replace(/[^a-z0-9]+/g, '-'))
        + '-cache-'
    ).replace(/^-+|-+$/g, ''),
};

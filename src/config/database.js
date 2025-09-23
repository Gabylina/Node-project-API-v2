/* migrated from config/database.php */

// A basic slug function equivalent to Laravel's Str::slug for the Redis prefix.
// In a real Node.js application, you might use a dedicated utility library.
const slugify = (text) => {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove invalid chars
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/-+/g, '-');        // Replace multiple - with single -
};

// Default value for APP_NAME, used in Redis prefix calculation
const APP_NAME = process.env.APP_NAME ?? 'laravel';
const defaultRedisPrefix = `${slugify(APP_NAME)}-database-`;

export default {
  default: process.env.DB_CONNECTION ?? 'sqlite',

  connections: {
    sqlite: {
      driver: 'sqlite',
      url: process.env.DB_URL,
      database: process.env.DB_DATABASE ?? 'database/database.sqlite', // 'database_path()' in Laravel corresponds to a relative path here
      prefix: '',
      foreign_key_constraints: process.env.DB_FOREIGN_KEYS ? (process.env.DB_FOREIGN_KEYS === 'true') : true,
      busy_timeout: null,
      journal_mode: null,
      synchronous: null,
    },

    mysql: {
      driver: 'mysql',
      url: process.env.DB_URL,
      host: process.env.DB_HOST ?? '127.0.0.1',
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      database: process.env.DB_DATABASE ?? 'laravel',
      username: process.env.DB_USERNAME ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      unix_socket: process.env.DB_SOCKET ?? '',
      charset: process.env.DB_CHARSET ?? 'utf8mb4',
      collation: process.env.DB_COLLATION ?? 'utf8mb4_unicode_ci',
      prefix: '',
      prefix_indexes: true,
      strict: true,
      engine: null,
      options: {
        // PDO::MYSQL_ATTR_SSL_CA translated to an option if present
        ...(process.env.MYSQL_ATTR_SSL_CA && { ssl_ca: process.env.MYSQL_ATTR_SSL_CA }),
      },
    },

    mariadb: {
      driver: 'mariadb',
      url: process.env.DB_URL,
      host: process.env.DB_HOST ?? '127.0.0.1',
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      database: process.env.DB_DATABASE ?? 'laravel',
      username: process.env.DB_USERNAME ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      unix_socket: process.env.DB_SOCKET ?? '',
      charset: process.env.DB_CHARSET ?? 'utf8mb4',
      collation: process.env.DB_COLLATION ?? 'utf8mb4_unicode_ci',
      prefix: '',
      prefix_indexes: true,
      strict: true,
      engine: null,
      options: {
        ...(process.env.MYSQL_ATTR_SSL_CA && { ssl_ca: process.env.MYSQL_ATTR_SSL_CA }),
      },
    },

    pgsql: {
      driver: 'pgsql',
      url: process.env.DB_URL,
      host: process.env.DB_HOST ?? '127.0.0.1',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      database: process.env.DB_DATABASE ?? 'laravel',
      username: process.env.DB_USERNAME ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      charset: process.env.DB_CHARSET ?? 'utf8',
      prefix: '',
      prefix_indexes: true,
      search_path: 'public',
      sslmode: 'prefer',
    },

    sqlsrv: {
      driver: 'sqlsrv',
      url: process.env.DB_URL,
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '1433', 10),
      database: process.env.DB_DATABASE ?? 'laravel',
      username: process.env.DB_USERNAME ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      charset: process.env.DB_CHARSET ?? 'utf8',
      prefix: '',
      prefix_indexes: true,
      // 'encrypt' and 'trust_server_certificate' were commented out in the PHP source.
    },
  },

  migrations: {
    table: 'migrations',
    update_date_on_publish: true,
  },

  redis: {
    client: process.env.REDIS_CLIENT || 'redis',

    options: {
      cluster: process.env.REDIS_CLUSTER ?? 'redis',
      prefix: process.env.REDIS_PREFIX ?? defaultRedisPrefix,
      persistent: process.env.REDIS_PERSISTENT ? process.env.REDIS_PERSISTENT === 'true' : false,
    },

    default: {
      url: process.env.REDIS_URL,
      host: process.env.REDIS_HOST ?? '127.0.0.1',
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
      database: parseInt(process.env.REDIS_DB ?? '0', 10),
    },

    cache: {
      url: process.env.REDIS_URL,
      host: process.env.REDIS_HOST ?? '127.0.0.1',
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
      database: parseInt(process.env.REDIS_CACHE_DB ?? '1', 10),
    },
  },
};

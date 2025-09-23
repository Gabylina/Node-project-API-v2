/* migrated from config/logging.php */

export default {
  default: process.env.LOG_CHANNEL ?? 'stack',

  deprecations: {
    channel: process.env.LOG_DEPRECATIONS_CHANNEL ?? 'null',
    trace: process.env.LOG_DEPRECATIONS_TRACE === 'true',
  },

  channels: {
    stack: {
      driver: 'stack',
      channels: (process.env.LOG_STACK ?? 'single').split(',').map(s => s.trim()).filter(Boolean),
      ignore_exceptions: false,
    },

    single: {
      driver: 'single',
      path: './logs/laravel.log', // Equivalent to storage_path('logs/laravel.log')
      level: process.env.LOG_LEVEL ?? 'debug',
      replace_placeholders: true,
    },

    daily: {
      driver: 'daily',
      path: './logs/laravel.log', // Equivalent to storage_path('logs/laravel.log')
      level: process.env.LOG_LEVEL ?? 'debug',
      days: parseInt(process.env.LOG_DAILY_DAYS ?? '14', 10),
      replace_placeholders: true,
    },

    slack: {
      driver: 'slack',
      url: process.env.LOG_SLACK_WEBHOOK_URL,
      username: process.env.LOG_SLACK_USERNAME ?? 'Laravel Log',
      emoji: process.env.LOG_SLACK_EMOJI ?? ':boom:',
      level: process.env.LOG_LEVEL ?? 'critical',
      replace_placeholders: true,
    },

    papertrail: {
      driver: 'monolog',
      level: process.env.LOG_LEVEL ?? 'debug',
      handler: process.env.LOG_PAPERTRAIL_HANDLER ?? 'SyslogUdpHandler', // PHP Class Name as string
      handler_with: {
        host: process.env.PAPERTRAIL_URL,
        port: parseInt(process.env.PAPERTRAIL_PORT, 10),
        connectionString: `tls://${process.env.PAPERTRAIL_URL}:${process.env.PAPERTRAIL_PORT}`,
      },
      processors: ['PsrLogMessageProcessor'], // PHP Class Name as string
    },

    stderr: {
      driver: 'monolog',
      level: process.env.LOG_LEVEL ?? 'debug',
      handler: 'StreamHandler', // PHP Class Name as string
      handler_with: {
        stream: 'stderr', // Equivalent to 'php://stderr'
      },
      formatter: process.env.LOG_STDERR_FORMATTER,
      processors: ['PsrLogMessageProcessor'], // PHP Class Name as string
    },

    syslog: {
      driver: 'syslog',
      level: process.env.LOG_LEVEL ?? 'debug',
      facility: process.env.LOG_SYSLOG_FACILITY ?? 'LOG_USER', // PHP Constant as string
      replace_placeholders: true,
    },

    errorlog: {
      driver: 'errorlog',
      level: process.env.LOG_LEVEL ?? 'debug',
      replace_placeholders: true,
    },

    null: {
      driver: 'monolog',
      handler: 'NullHandler', // PHP Class Name as string
    },

    emergency: {
      path: './logs/laravel.log', // Equivalent to storage_path('logs/laravel.log')
    },
  },
};

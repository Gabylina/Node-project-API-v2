/* migrated from config/mail.php */
export default {
    default: process.env.MAIL_MAILER ?? 'log',

    mailers: {
        smtp: {
            transport: 'smtp',
            scheme: process.env.MAIL_SCHEME,
            url: process.env.MAIL_URL,
            host: process.env.MAIL_HOST ?? '127.0.0.1',
            port: parseInt(process.env.MAIL_PORT ?? '2525', 10),
            username: process.env.MAIL_USERNAME,
            password: process.env.MAIL_PASSWORD,
            timeout: null,
            local_domain: process.env.MAIL_EHLO_DOMAIN ?? (() => {
                try {
                    const appUrl = process.env.APP_URL ?? 'http://localhost';
                    const url = new URL(appUrl);
                    // Mimic PHP's parse_url behavior which might return null/empty for malformed URLs
                    return url.hostname || 'localhost';
                } catch (e) {
                    // Fallback if APP_URL is completely invalid and new URL() throws
                    return 'localhost';
                }
            })(),
        },

        ses: {
            transport: 'ses',
        },

        postmark: {
            transport: 'postmark',
        },

        resend: {
            transport: 'resend',
        },

        sendmail: {
            transport: 'sendmail',
            path: process.env.MAIL_SENDMAIL_PATH ?? '/usr/sbin/sendmail -bs -i',
        },

        log: {
            transport: 'log',
            channel: process.env.MAIL_LOG_CHANNEL,
        },

        array: {
            transport: 'array',
        },

        failover: {
            transport: 'failover',
            mailers: [
                'smtp',
                'log',
            ],
            retry_after: 60,
        },

        roundrobin: {
            transport: 'roundrobin',
            mailers: [
                'ses',
                'postmark',
            ],
            retry_after: 60,
        },
    },

    from: {
        address: process.env.MAIL_FROM_ADDRESS ?? 'hello@example.com',
        name: process.env.MAIL_FROM_NAME ?? 'Example',
    },
};

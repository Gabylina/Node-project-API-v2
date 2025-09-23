/* migrated from config/app.php */
export default {
    name: process.env.APP_NAME ?? 'Laravel',
    env: process.env.APP_ENV ?? 'production',
    debug: process.env.APP_DEBUG === 'true',
    url: process.env.APP_URL ?? 'http://localhost',
    asset_url: process.env.APP_ASSET_URL ?? null,
    timezone: 'UTC',
    locale: process.env.APP_LOCALE ?? 'en',
    fallback_locale: process.env.APP_FALLBACK_LOCALE ?? 'en',
    faker_locale: process.env.APP_FAKER_LOCALE ?? 'en_US',
    key: process.env.APP_KEY,
    cipher: 'AES-256-CBC',
    aliases: {},
    providers: []
};

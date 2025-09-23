/* migrated from config/sanctum.php + config/sanctum.php */
export default {
  // These keys would typically be derived from config/auth.php.
  // Since config/auth.php was undefined, default/placeholder values are used.
  default: 'web',
  guards: {},
  providers: {},
  passwords: {},

  sanctum: {
    stateful: process.env.SANCTUM_STATEFUL_DOMAINS?.split(',') || (
      'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1' + (process.env.APP_URL_FOR_SANCTUM_STATEFUL || '')
    ).split(','),
    expiration: null,
    prefix: process.env.SANCTUM_TOKEN_PREFIX || '',
  },
};

/* migrated from config/services.php */
export default {
  postmark: {
    token: process.env.POSTMARK_TOKEN,
  },

  resend: {
    key: process.env.RESEND_KEY,
  },

  ses: {
    key: process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION ?? 'us-east-1',
  },

  slack: {
    notifications: {
      bot_user_oauth_token: process.env.SLACK_BOT_USER_OAUTH_TOKEN,
      channel: process.env.SLACK_BOT_USER_DEFAULT_CHANNEL,
    },
  },
};

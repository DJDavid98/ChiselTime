/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

module.exports = {
  distDir: '../../.next',
  redirects: async () => [
    {
      source: '/discord',
      destination: process.env.DISCORD_INVITE_URL,
      permanent: false,
    },
  ],
  experimental: {
    appDir: true,
  },
};

module.exports = {
  distDir: '../../.next',
  redirects: async () => [
    {
      source: '/discord',
      destination: 'https://discord.gg/fx7EKJ2uyH',
      permanent: false,
    },
  ],
  experimental: {
    appDir: true,
  },
};

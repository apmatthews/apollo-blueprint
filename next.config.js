const WP_HOST = new URL(process.env.NEXT_PUBLIC_WORDPRESS_URL).hostname;

module.exports = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: ['node_modules'],
  },
  eslint: {
    dirs: ['src'],
  },
  images: {
    domains: [WP_HOST],
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    });
    return config;
  },
  webpackDevMiddleware: (config) => {
    return config;
  },
};

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  // add your own icons to src/app/manifest.ts
  // to re-generate manifest.json, you can visit https://tomitm.github.io/appmanifest/
});

/** @type {import('next').NextConfig} */
module.exports = withPWA({
  swcMinify: true,
  reactStrictMode: true,
  eslint: {
    dirs: ['src'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/, // Add a rule to handle SVG imports
      use: ['@svgr/webpack'], // Use @svgr/webpack to transform SVGs into React components
    });
    config.externals.push('pino-pretty', 'encoding');
    config.resolve.fallback = { fs: false, net: false, tls: false };

    return config;
  },
});

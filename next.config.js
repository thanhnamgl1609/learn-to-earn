module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        port: '',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
  },
};

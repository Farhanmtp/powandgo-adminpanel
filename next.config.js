/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects() {
    return [
      {
        source: '/',
        destination: '/api/auth/signin',
        permanent: true,
      },
    ];
  },
  images: {
    domains: ['s3.eu-north-1.amazonaws.com', 'amazonaws.com'],
    formats: ['image/webp', 'image/avif'],
  },
};

module.exports = nextConfig;

// demo url - To be deleted
// https://s3.eu-north-1.amazonaws.com/static.powandgo.mtptest.co.uk/32da6c43-5fb6-48fc-8002-378fb622c312-1699278586916-close-cross.svg

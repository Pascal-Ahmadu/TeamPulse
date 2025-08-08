/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  onDemandEntries: {
    // Make sure the server doesn't keep running after Ctrl+C
    maxInactiveAge: 1000,
    pagesBufferLength: 1,
  },
};

// Handle process termination gracefully
if (process.env.NODE_ENV === 'development') {
  process.on('SIGINT', () => {
    process.exit(0);
  });
}

module.exports = nextConfig
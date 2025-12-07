/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    typescript: {
        ignoreBuildErrors: true, // Pragmatic choice for rapid prototyping; strictly fix types in production
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**', // Allow external images (e.g. avatars)
            },
        ],
    },
};

export default nextConfig;

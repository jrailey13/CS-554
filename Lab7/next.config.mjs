/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/launches',
                destination: '/launches/page/0',
                permanent: true,
            },
            {
                source: '/rockets',
                destination: '/rockets/page/0',
                permanent: true,
            },
            {
                source: '/cores',
                destination: '/cores/page/0',
                permanent: true,
            },
            {
                source: '/payloads',
                destination: '/payloads/page/0',
                permanent: true,
            },
            {
                source: '/launchpads',
                destination: '/launchpads/page/0',
                permanent: true,
            },
            {
                source: '/ships',
                destination: '/ships/page/0',
                permanent: true,
            }
        ];
    },
};

export default nextConfig;


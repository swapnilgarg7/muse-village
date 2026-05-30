
      /** @type {import("next").NextConfig} */
      const config = {
        trailingSlash: true,
        images: {
          unoptimized: true,
          remotePatterns: [
            {
              protocol: 'https',
              hostname: '*',
              pathname: '**',
            },
          ],
        },
typescript: {
          ignoreBuildErrors: true,
        },
      };
      export default config;
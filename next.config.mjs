import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{kebabCase member}}",
    },
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  async redirects() {
    const slugRedirects = [
      { oldSlug: "rockisland-rimini", newSlug: "porto-sole" },
      { oldSlug: "premium-restaurant-local-concept", newSlug: "mare-vivo" },
    ];
    const serviceRedirects = [{ oldSlug: "booking-flow", newSlug: "services" }];
    const locales = ["it", "en", "fr", "ru", "de", "es"];
    return [
      ...slugRedirects.flatMap(({ oldSlug, newSlug }) => [
        {
          source: `/work/${oldSlug}`,
          destination: `/work/${newSlug}`,
          permanent: true,
        },
        ...locales
          .filter((locale) => locale !== "it")
          .map((locale) => ({
            source: `/${locale}/work/${oldSlug}`,
            destination: `/${locale}/work/${newSlug}`,
            permanent: true,
          })),
      ]),
      ...serviceRedirects.flatMap(({ oldSlug, newSlug }) => [
        {
          source: `/services/${oldSlug}`,
          destination: `/${newSlug}`,
          permanent: true,
        },
        ...locales
          .filter((locale) => locale !== "it")
          .map((locale) => ({
            source: `/${locale}/services/${oldSlug}`,
            destination: `/${locale}/${newSlug}`,
            permanent: true,
          })),
      ]),
    ];
  },
};

export default withNextIntl(nextConfig);

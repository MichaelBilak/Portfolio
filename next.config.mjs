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
  async redirects() {
    const oldSlug = "rockisland-rimini";
    const newSlug = "porto-sole";
    const locales = ["it", "en", "fr", "ru", "de", "es"];
    return [
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
    ];
  },
};

export default withNextIntl(nextConfig);

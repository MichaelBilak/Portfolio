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
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "bcfebgxfuneruzljivwv.supabase.co" },
    ],
  },
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{kebabCase member}}",
    },
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
  webpack: (config, { dev }) => {
    if (!dev && process.env.DISABLE_MINIFY === "1") {
      config.optimization = { ...config.optimization, minimize: false };
    }
    return config;
  },
  async headers() {
    const headers = [
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    ];
    if (process.env.VERCEL_ENV === "preview") {
      headers.push({ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" });
    }
    return [{ source: "/(.*)", headers }];
  },
  async redirects() {
    const slugRedirects = [
      { oldSlug: "premium-restaurant-local-concept", newSlug: "mare-vivo" },
    ];
    const retiredWorkSlugs = ["rockisland-rimini", "porto-sole"];
    const locales = ["it", "en", "fr", "ru", "de", "es"];
    return [
      { source: "/it", destination: "/", permanent: true },
      { source: "/it/", destination: "/", permanent: true },
      { source: "/it/:path+", destination: "/:path+", permanent: true },
      ...retiredWorkSlugs.flatMap((oldSlug) => [
        {
          source: `/work/${oldSlug}`,
          destination: "/work",
          permanent: true,
        },
        ...locales
          .filter((locale) => locale !== "it")
          .map((locale) => ({
            source: `/${locale}/work/${oldSlug}`,
            destination: `/${locale}/work`,
            permanent: true,
          })),
      ]),
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
    ];
  },
};

export default withNextIntl(nextConfig);

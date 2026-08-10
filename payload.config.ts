import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { buildConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Services } from "./collections/Services";
import { AddonCategories } from "./collections/AddonCategories";
import { Projects } from "./collections/Projects";
import { Leads } from "./collections/Leads";
import { ProcessSteps } from "./collections/ProcessSteps";
import { BeforeAfterCases } from "./collections/BeforeAfterCases";
import { Redirects } from "./collections/Redirects";
import { AuditLogs } from "./collections/AuditLogs";
import { SiteSettings, SeoDefaults, Integrations } from "./globals/SiteSettings";
import { SiteCopy } from "./globals/SiteCopy";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const databaseUrl = process.env.DATABASE_URL || "file:./payload.db";
const usePostgres =
  Boolean(process.env.DATABASE_URL) &&
  !databaseUrl.startsWith("file:") &&
  (databaseUrl.startsWith("postgres") || databaseUrl.startsWith("postgresql"));

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " · DormUp Admin",
      description: "DormUp Studio content & leads admin",
      icons: [
        {
          rel: "icon",
          type: "image/png",
          url: "/images/logo-d-letter.png",
        },
        {
          rel: "apple-touch-icon",
          type: "image/png",
          url: "/images/logo-d-letter.png",
        },
      ],
      openGraph: {
        title: "DormUp Admin",
        description: "DormUp Studio content & leads admin",
        images: [
          {
            url: "/images/logo-dm-group.png",
            width: 512,
            height: 512,
          },
        ],
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: "./components/admin/Logo.tsx#Logo",
        Icon: "./components/admin/Icon.tsx#Icon",
      },
      views: {
        dashboard: {
          Component: "./app/(payload)/admin/views/Dashboard#DashboardView",
        },
      },
    },
  },
  collections: [
    Users,
    Media,
    Services,
    AddonCategories,
    Projects,
    Leads,
    ProcessSteps,
    BeforeAfterCases,
    Redirects,
    AuditLogs,
  ],
  globals: [SiteSettings, SeoDefaults, Integrations, SiteCopy],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "dev-only-change-me-in-production",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: usePostgres
    ? postgresAdapter({
        pool: { connectionString: databaseUrl },
      })
    : sqliteAdapter({
        client: { url: databaseUrl.startsWith("file:") ? databaseUrl : "file:./payload.db" },
      }),
  localization: {
    locales: [
      { code: "it", label: "Italiano" },
      { code: "en", label: "English" },
      { code: "fr", label: "Français" },
      { code: "ru", label: "Русский" },
      { code: "de", label: "Deutsch" },
      { code: "es", label: "Español" },
    ],
    defaultLocale: "it",
    fallback: true,
  },
  sharp,
  upload: {
    limits: {
      fileSize: 8 * 1024 * 1024,
    },
  },
});

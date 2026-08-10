import { writeFileSync } from "node:fs";
import { getSiteContent, getSeoDefaults, getRedirectMatch } from "../lib/cms/catalog";
import { getStudioSession } from "../lib/studio/auth";

async function main() {
  const lines: string[] = [];
  try {
    const content = await getSiteContent("it");
    lines.push(
      `siteContent: projects=${content.projects.length} services=${content.serviceMetas.length} hero=${Boolean(content.t.hero?.headline)}`,
    );
    const seo = await getSeoDefaults("it");
    lines.push(`seo: title=${Boolean(seo.defaultTitle)} ga=${Boolean(seo.gaMeasurementId)}`);
    const redir = await getRedirectMatch("/work/rockisland-rimini");
    lines.push(`redirect: ${JSON.stringify(redir)}`);
  } catch (e) {
    lines.push("CMS_ERR " + String(e));
  }
  writeFileSync("db-check.txt", lines.join("\n"));
}

main().catch((e) => {
  writeFileSync("db-check.txt", String(e));
  process.exit(1);
});

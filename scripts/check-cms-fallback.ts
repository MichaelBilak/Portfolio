/**
 * Proves a CMS edit cannot put obsolete commercial copy back on the page.
 * Read-only. Does not connect to Supabase.
 */
import {
  acceptServiceCopy,
  acceptSiteSection,
  approvedSectionData,
  approvedServicePayload,
} from "../lib/cms/approved-copy";
import { translations } from "../lib/translations";

function visibleHero(cms: unknown): string {
  const approved = approvedSectionData("it", "hero") as { headline: string };
  return acceptSiteSection("it", "hero", cms) ? (cms as { headline: string }).headline : approved.headline;
}

const approved = approvedSectionData("it", "hero");
const obsolete = {
  ...(approved as object),
  headline: "Your business.\nBuilt to work.\nDesigned to impress.",
};
const editedObsolete = {
  ...obsolete,
  socialProof: "Edited after the snapshot",
};

const failures: string[] = [];
if (!acceptSiteSection("it", "hero", approved)) failures.push("approved hero was rejected");
if (acceptSiteSection("it", "hero", obsolete)) failures.push("obsolete hero was accepted");
if (acceptSiteSection("it", "hero", editedObsolete)) failures.push("edited obsolete hero was accepted");
if (visibleHero(editedObsolete).includes("Built to work")) failures.push("edited CMS restored the old headline");
if (!visibleHero(editedObsolete).includes("Più visibilità")) failures.push("approved headline was not kept");

const video = translations.it.services.find((service) => service.id === "photo-video");
const videoPayload = video ? approvedServicePayload(video) : null;
if (!videoPayload || !acceptServiceCopy("it", "photo-video", videoPayload)) {
  failures.push("approved video copy was rejected");
}
if (videoPayload && acceptServiceCopy("it", "photo-video", { ...videoPayload, title: "Produzione contenuti" })) {
  failures.push("obsolete video title was accepted");
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("CMS fallback keeps the approved copy when a record is stale or unexpectedly edited.");

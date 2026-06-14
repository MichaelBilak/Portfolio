/**
 * Typography helpers — keep phrases intact at word boundaries (no mid-word breaks).
 * Uses non-breaking spaces around common separators and within short preposition groups.
 */
export function preventBrokenPhrases(text: string): string {
  return text
    .replace(/ · /g, "\u00A0·\u00A0")
    .replace(/ & /g, "\u00A0&\u00A0")
    .replace(/, /g, ",\u00A0")
    .replace(/ — /g, "\u00A0—\u00A0")
    .replace(/ – /g, "\u00A0–\u00A0")
    .replace(/\s([а-яёА-ЯЁ]{1,2})\s/g, "\u00A0$1\u00A0");
}

/** Non-breaking spaces between all words in a line (use sparingly on short headline lines). */
export function nbspLine(text: string): string {
  return text.replace(/ /g, "\u00A0");
}

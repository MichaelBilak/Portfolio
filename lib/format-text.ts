/**
 * Words that must stay with the next word. A line may break only between
 * content words, or after a clause mark (comma, colon, dash).
 */
const FUNCTION_WORD =
  /^(?:a|an|the|and|or|of|to|in|on|for|with|at|by|from|as|into|per|e|ed|di|da|su|per|con|il|lo|la|gli|le|un|una|del|della|dei|delle|al|alla|nel|nella|che|non|et|ou|de|du|des|les|une|à|au|aux|en|dans|sur|pour|avec|par|que|und|oder|der|die|das|den|dem|ein|eine|zu|von|mit|für|fur|auf|im|am|an|bei|y|o|el|los|las|para|por|и|а|но|в|во|на|с|со|к|ко|по|за|от|до|из|у|об|для|не|что|как|&|·)$/i;

function coreWord(word: string) {
  return word.replace(/^[«"“'(\[]+|[»"”'.,;:!?)\]]+$/g, "");
}

function glueLine(line: string) {
  const words = line.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) return line.trim();
  let out = words[0];
  for (let i = 1; i < words.length; i++) {
    const prev = words[i - 1];
    const curr = words[i];
    const prevCore = coreWord(prev);
    const currCore = coreWord(curr);
    const dash = /^[—–-]+$/.test(currCore);
    if (dash) {
      out += "\u00A0" + curr;
      continue;
    }
    const clause = /[,;:—–-]$/.test(prev) || /^[—–-]+$/.test(prevCore);
    const prevFn = FUNCTION_WORD.test(prevCore);
    const currFn = FUNCTION_WORD.test(currCore);
    const allowBreak = clause || (!prevFn && !currFn);
    out += (allowBreak ? " " : "\u00A0") + curr;
  }
  return out;
}

/** Keep explicit newlines. Everywhere else, break only at a phrase boundary. */
export function phraseText(text: string): string {
  return text.split("\n").map(glueLine).join("\n");
}

/** Typography helpers — keep phrases intact at word boundaries. */
export function preventBrokenPhrases(text: string): string {
  return phraseText(text);
}

/** Non-breaking spaces between all words in a line (use sparingly on short headline lines). */
export function nbspLine(text: string): string {
  return text.replace(/ /g, "\u00A0");
}

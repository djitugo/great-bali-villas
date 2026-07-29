// Pull the real listing description from each villa's Airbnb page so the
// property detail pages aren't empty. Reads the embedded `htmlDescription`
// blob (the "About this space" copy), cleans it up and stores it on the
// property as plain paragraphs.
//
// Usage: node scripts/descriptions.mjs [limit]   (limit = only first N missing, for testing)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pLimit from "p-limit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILES = [
  path.join(__dirname, "..", "src", "data", "properties.json"),
  path.join(__dirname, "data", "properties.json"),
];
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const LIMIT = parseInt(process.argv[2] || "0", 10);
const MIN_LEN = 40;

const props = JSON.parse(fs.readFileSync(FILES[0], "utf8"));
const roomId = (u) => ((u || "").match(/rooms\/(\d+)/) || [])[1] || null;

async function fetchHtml(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, {
        headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
        signal: AbortSignal.timeout(40000),
      });
      if (r.ok) return await r.text();
    } catch {}
    await new Promise((res) => setTimeout(res, 2000 * (i + 1)));
  }
  return null;
}

// Read one JS-escaped JSON string starting right after the opening quote, so
// escaped quotes inside the copy don't cut the value short.
function readEscapedString(html, start) {
  let i = start;
  let out = "";
  while (i < html.length) {
    const c = html[i];
    if (c === "\\") {
      out += html[i] + html[i + 1];
      i += 2;
      continue;
    }
    if (c === '"') break;
    out += c;
    i++;
  }
  return out;
}

// Airbnb repeats `htmlText` for many blocks (house rules, safety, cancellation,
// section titles...). The listing copy is the one the page also puts in its
// <meta name="description">, so use that as the source of truth and fall back
// to the longest non-boilerplate block.
const BOILERPLATE =
  /service animals|emotional support animal|cancellation|check-in|check out|carbon monoxide|smoke alarm|security camera|pets are not allowed|self check-in|quiet hours|additional rules|commercial photography|refundable/i;

function extractCandidates(html) {
  const out = [];
  let i = -1;
  while ((i = html.indexOf('"htmlText":"', i + 1)) > 0) {
    out.push(readEscapedString(html, i + '"htmlText":"'.length));
    if (out.length > 60) break;
  }
  return out;
}

function metaDescription(html) {
  const m = html.match(/<meta name="description" content="([^"]*)"/);
  if (!m) return null;
  // "Jul 29, 2026 · Entire home · <the actual copy>"
  const parts = m[1].split(" · ");
  return (parts.length > 2 ? parts.slice(2).join(" · ") : m[1]).trim();
}

function clean(raw) {
  if (!raw) return null;
  let s = raw;
  try {
    s = JSON.parse(`"${raw}"`); // resolve \n, é, \" etc.
  } catch {
    s = raw.replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }
  s = s
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
  // normalise whitespace, drop empty lines, rebuild as paragraphs
  const paras = s
    .split(/\n{2,}/)
    .map((p) => p.replace(/[ \t]+/g, " ").replace(/\n/g, " ").trim())
    .filter((p) => p.length > 0);
  const text = paras.join("\n\n").trim();
  return text.length >= MIN_LEN ? text : null;
}

const needs = props.filter(
  (p) => roomId(p.url) && (!p.description || p.description.trim().length < MIN_LEN)
);
const list = LIMIT ? needs.slice(0, LIMIT) : needs;
console.log(`missing descriptions: ${needs.length}, processing ${list.length}`);

const limit = pLimit(5);
let ok = 0;
const failed = [];

await Promise.all(
  list.map((p) =>
    limit(async () => {
      const id = roomId(p.url);
      const html = await fetchHtml(`https://www.airbnb.com/rooms/${id}`);
      if (!html) {
        failed.push(id);
        return;
      }
      const cands = extractCandidates(html)
        .map(clean)
        .filter((c) => c && !BOILERPLATE.test(c));
      if (!cands.length) {
        failed.push(id);
        return;
      }

      // Prefer the block that matches the page's own meta description.
      const meta = metaDescription(html);
      const norm = (s) => s.replace(/\s+/g, " ").toLowerCase();
      let best = null;
      if (meta) {
        const head = norm(meta.replace(/\.\.\.$/, "")).slice(0, 45);
        best = cands.find((c) => norm(c).startsWith(head)) || null;
      }
      // Otherwise the longest remaining block is the listing copy.
      if (!best) best = cands.sort((a, b) => b.length - a.length)[0];
      // A block that just repeats the listing title isn't a description.
      if (!best || norm(best) === norm(p.name || "") || best.length < 60) {
        failed.push(id);
        return;
      }

      p.description = best;
      ok++;
    })
  )
);

for (const f of FILES) {
  if (fs.existsSync(f)) fs.writeFileSync(f, JSON.stringify(props, null, 2));
}
console.log(`done: ok=${ok} failed=${failed.length}`);
if (failed.length) {
  fs.writeFileSync(path.join(__dirname, "data", "desc-failed.json"), JSON.stringify(failed));
  console.log("failed ids:", failed.slice(0, 20));
}

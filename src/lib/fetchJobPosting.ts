import * as cheerio from "cheerio";

const BLOCKED_HOSTS = ["login", "auth", "accounts.", "mycompany", "internal"];
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export function validateJobUrl(url: string): { valid: boolean; error?: string } {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    for (const block of BLOCKED_HOSTS) {
      if (host.includes(block)) {
        return {
          valid: false,
          error: "This URL may require login. Use the public job posting URL.",
        };
      }
    }

    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return { valid: false, error: "URL must use http or https." };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: "Invalid URL." };
  }
}

export async function fetchJobPosting(url: string): Promise<string> {
  const validation = validateJobUrl(url);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  if (!res.ok) {
    throw new Error(`Could not fetch job posting: ${res.status} ${res.statusText}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  // Remove script, style, nav, footer
  $("script, style, nav, footer, header, [role='navigation']").remove();

  // Common job content selectors
  const selectors = [
    "[data-job-description]",
    ".job-description",
    ".job-description__content",
    "[class*='job-description']",
    "[class*='jobDescription']",
    "[class*='job-description']",
    ".description",
    "[class*='JobDescription']",
    "article",
    ".job-post",
    "main",
  ];

  let text = "";
  for (const sel of selectors) {
    const el = $(sel).first();
    if (el.length) {
      text = el.text().trim();
      if (text.length > 200) break;
    }
  }

  if (text.length < 200) {
    text = $("body").text().trim();
  }

  return text
    .replace(/\s+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 15000);
}

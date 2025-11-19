import { BRAND } from "@/lib/constants";
export default async function sitemap() {
  const urls = ["/", "/meet", "/studio", "/display", "/monet", "/messages", "/legal/cgu", "/legal/privacy", "/legal/cookies"];
  return urls.map((u) => ({ url: `${BRAND.url}${u}`, changefreq: "weekly", priority: u === "/" ? 1.0 : 0.6 }));
}

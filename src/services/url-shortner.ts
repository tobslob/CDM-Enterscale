import { UrlShortnerRepo } from "@app/data/url-shortner";
import urlRegex from "url-regex";

export async function replaceUrlWithShortUrl(text: string) {
  const urls = text.match(urlRegex());
  const links = await UrlShortnerRepo.createShortUrl(urls);

  links.forEach(link => {
    text = text.replace(link.long_url, link.short_url);
  });
  return text;
}

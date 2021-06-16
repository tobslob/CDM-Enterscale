import { UrlShortnerRepo } from "@app/data/url-shortner";
import urlRegex from "url-regex";
import dotenv from "dotenv";

dotenv.config();

export async function replaceUrlWithShortUrl(text: string) {
  const urls = text.match(urlRegex());
  const links = await UrlShortnerRepo.createShortUrl(urls);

  links.forEach(link => {
    text = text.replace(link.long_url, `${process.env.base_url}/actions/short-url/${link.short_url}`);
  });
  return text;
}

import { useEffect } from "react";
import { usePublicData } from "../providers/PublicDataProvider";

interface SeoProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value));
}

function upsertLink(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value));
}

export default function Seo({
  title = companyInfo.defaultTitle,
  description = companyInfo.metaDescription,
  canonicalPath = "",
}: SeoProps) {
  useEffect(() => {
    document.title = resolvedTitle;

    upsertMeta('meta[name="description"]', { name: "description", content: resolvedDescription });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: resolvedTitle });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: resolvedDescription,
    });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: resolvedTitle });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: resolvedDescription,
    });
    const baseUrl = companyInfo?.canonicalUrl ?? "https://petercarrental.rw";
    upsertLink('link[rel="canonical"]', {
      rel: "canonical",
      href: `${baseUrl}${canonicalPath}`,
    });
  }, [canonicalPath, resolvedDescription, resolvedTitle, companyInfo?.canonicalUrl]);

  return null;
}

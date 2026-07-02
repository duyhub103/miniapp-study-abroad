import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://duhocbinhduong.vn";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/chinh-sach-bao-mat`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    // /admin is intentionally excluded
  ];
}

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/company",
        "/candidate",
        "/attempt",
        "/invitations",
        "/team",
        "/verify-email",
        "/reset-password",
        "/forgot-password",
        "/api",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

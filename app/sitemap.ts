import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: "https://cv-afrik.vercel.app", lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: "https://cv-afrik.vercel.app/tarifs", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: "https://cv-afrik.vercel.app/templates", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: "https://cv-afrik.vercel.app/blog", lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: "https://cv-afrik.vercel.app/auth/connexion", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: "https://cv-afrik.vercel.app/auth/inscription", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
  ];

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, created_at")
      .eq("publie", true);

    const blogPages = (posts || []).map((post) => ({
      url: `https://cv-afrik.vercel.app/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...blogPages];
  } catch {
    return staticPages;
  }
}

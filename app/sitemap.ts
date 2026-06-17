import type { MetadataRoute } from "next";
import { products } from "./lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mirus.in";
  const staticRoutes = ["", "/shop", "/collections", "/wishlist", "/contact", "/admin", "/profile"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...productRoutes];
}

import { Product } from "../data/products";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001/api";

const parseJSON = <T>(value: unknown, fallback: T): T => {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
};

const normalizeProduct = (row: any): Product => ({
  id: String(row.id || ""),
  slug: String(row.slug || ""),
  name: String(row.name || ""),
  price: Number(row.price || 0),
  originalPrice:
    row.originalPrice !== null && row.originalPrice !== undefined
      ? Number(row.originalPrice)
      : undefined,
  category: String(row.category || ""),
  description: String(row.description || ""),
  longDescription: String(row.longDescription || ""),
  images: parseJSON<string[]>(row.images, []),
  sizes: parseJSON<string[]>(row.sizes, []),
  colors: parseJSON<string[]>(row.colors, []),
  rating: Number(row.rating || 0),
  reviewCount: Number(row.reviewCount || 0),
  isNew: Boolean(row.isNew),
  isBestSeller: Boolean(row.isBestSeller),
  isSale: Boolean(row.isSale),
  tags: parseJSON<string[]>(row.tags, []),
  material: String(row.material || ""),
  careInstructions: parseJSON<string[]>(row.careInstructions, []),
  shippingInfo: String(row.shippingInfo || ""),
  returnsPolicy: String(row.returnsPolicy || ""),
  inventory: parseJSON<{ [size: string]: number }>(row.inventory, {}),
  created_at: row.created_at ? String(row.created_at) : undefined,
});

const fetchJSON = async (input: RequestInfo, init?: RequestInit) => {
  const res = await fetch(input, init);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "API request failed");
  }
  return data;
};

export const fetchProducts = async (): Promise<Product[]> => {
  const data = await fetchJSON(`${API_BASE}/products`);
  return Array.isArray(data) ? data.map(normalizeProduct) : [];
};

export const fetchProductBySlug = async (
  slug: string,
): Promise<Product | null> => {
  try {
    const data = await fetchJSON(
      `${API_BASE}/products/slug/${encodeURIComponent(slug)}`,
    );
    return data ? normalizeProduct(data) : null;
  } catch {
    return null;
  }
};

export const getRelatedProducts = async (
  product: Product,
  limit = 4,
): Promise<Product[]> => {
  const all = await fetchProducts();
  return all
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category ||
          p.tags.some((t) => product.tags.includes(t))),
    )
    .slice(0, limit);
};

export const createProduct = async (
  product: Partial<Product>,
): Promise<Product> => {
  const data = await fetchJSON(`${API_BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return normalizeProduct(data);
};

export const updateProduct = async (
  id: string,
  product: Partial<Product>,
): Promise<Product> => {
  const data = await fetchJSON(
    `${API_BASE}/products/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    },
  );
  return normalizeProduct(data);
};

export const deleteProduct = async (id: string): Promise<void> => {
  await fetch(`${API_BASE}/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
};

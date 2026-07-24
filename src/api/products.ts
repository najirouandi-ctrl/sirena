import { Product } from "../data/products";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001/api";

const normalizeProduct = (row: any): Product => ({
  id: String(row.id || ""),
  slug: String(row.slug || ""),
  name: String(row.name || ""),
  price: Number(row.price || 0),

  originalPrice:
    row.originalPrice !== null &&
    row.originalPrice !== undefined &&
    row.originalPrice !== ""
      ? Number(row.originalPrice)
      : undefined,

  category: String(row.category || ""),
  description: String(row.description || ""),
  longDescription: String(row.longDescription || ""),

  images: Array.isArray(row.images) ? row.images : [],
  sizes: Array.isArray(row.sizes) ? row.sizes : [],
  colors: Array.isArray(row.colors) ? row.colors : [],

  rating: Number(row.rating || 0),
  reviewCount: Number(row.reviewCount || 0),

  isNew: Boolean(Number(row.isNew)),
  isBestSeller: Boolean(Number(row.isBestSeller)),
  isSale: Boolean(Number(row.isSale)),

  tags: Array.isArray(row.tags) ? row.tags : [],

  material: String(row.material || ""),

  careInstructions: Array.isArray(row.careInstructions)
    ? row.careInstructions
    : [],

  shippingInfo: String(row.shippingInfo || ""),
  returnsPolicy: String(row.returnsPolicy || ""),

  inventory:
    row.inventory && typeof row.inventory === "object"
      ? row.inventory
      : {},

  created_at: row.created_at
    ? String(row.created_at)
    : undefined,
});

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch("/products.json", { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Impossible de charger products.json");
  }

  const data = await response.json();

  return data.map(normalizeProduct);
};

export const fetchProductBySlug = async (
  slug: string,
): Promise<Product | null> => {
  const products = await fetchProducts();

  return products.find((p) => p.slug === slug) || null;
};

export const getRelatedProducts = async (
  product: Product,
  limit = 4,
): Promise<Product[]> => {
  const products = await fetchProducts();

  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category ||
          p.tags.some((tag) => product.tags.includes(tag))),
    )
    .slice(0, limit);
};

export const createProduct = async (
  product: Partial<Product>,
): Promise<Product> => {
  const response = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Impossible de créer l'article.");
  }

  const data = await response.json();
  return normalizeProduct(data);
};

export const updateProduct = async (
  id: string,
  product: Partial<Product>,
): Promise<Product> => {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Impossible de mettre à jour l'article.");
  }

  const data = await response.json();
  return normalizeProduct(data);
};

export const deleteProduct = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Impossible de supprimer l'article.");
  }
};
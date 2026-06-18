export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  longDescription: string;
  images: string[];
  sizes: string[];
  // optional inventory per size (e.g. { "S": 4, "M": 2 })
  inventory?: { [size: string]: number };
  colors: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isSale?: boolean;
  tags: string[];
  material: string;
  careInstructions: string[];
  shippingInfo: string;
  returnsPolicy: string;
  created_at?: string;
}

const STORAGE_KEY = "sls_products_v1";

export const loadProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return products;
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) ? parsed : products;
  } catch (e) {
    console.error("Failed to load products from storage:", e);
    return products;
  }
};

export const saveProducts = (items: Product[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save products to storage:", e);
  }
};

export const getProducts = (): Product[] => loadProducts();

export const addProduct = (p: Product) => {
  const all = loadProducts();
  all.unshift(p);
  saveProducts(all);
};

export const updateProduct = (p: Product) => {
  const all = loadProducts();
  const idx = all.findIndex((x) => x.id === p.id);
  if (idx >= 0) all[idx] = p;
  else all.unshift(p);
  saveProducts(all);
};

export const deleteProduct = (id: string) => {
  const all = loadProducts();
  const filtered = all.filter((p) => p.id !== id);
  saveProducts(filtered);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((p) => p.slug === slug);
};

export const getRelatedProducts = (product: Product, limit = 4): Product[] => {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category ||
          p.tags.some((t) => product.tags.includes(t))),
    )
    .slice(0, limit);
};

export const categories = ["All", "Midi", "Maxi", "Mini"];
export const sortOptions = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "Newest",
  "Best Sellers",
];
export const sizes = ["XS", "S", "M", "L", "XL"];

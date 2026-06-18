import { useEffect, useState } from "react";
import { Product } from "../data/products";
import { fetchProducts } from "../api/products";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(
        (err as Error)?.message || "Erreur lors du chargement des produits",
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { products, loading, error, refresh };
};

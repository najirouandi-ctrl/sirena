import React, { useEffect, useState } from "react";
import {
  fetchProducts,
  createProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
} from "../api/products";
import { Product } from "../data/products";
import AdminLogin from "./AdminLogin";
import PageTransition from "../components/PageTransition";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Upload,
  Link as LinkIcon,
  Download,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "https://sirena-production.up.railway.app/api";

const makeId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const AdminPage: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [items, setItems] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({
    name: "",
    price: 0,
    category: "midi",
    sizes: "",
    colors: "",
    images: [] as string[],
    description: "",
    inventory: {},
  });
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [inventoryOpen, setInventoryOpen] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (auth) setIsAuth(true);
    else setIsAuth(false);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setItems(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (isAuth) loadProducts();
  }, [isAuth]);

  const handleLogin = (pwd: string) => {
    sessionStorage.setItem("admin_auth", pwd);
    setIsAuth(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setIsAuth(false);
  };

  if (!isAuth) return <AdminLogin onLogin={handleLogin} />;

  const refresh = async () => {
    try {
      const data = await fetchProducts();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const openNewForm = () => {
    setEditing(null);
    setForm({
      name: "",
      price: 0,
      category: "midi",
      sizes: "XS,S,M,L,XL",
      colors: "",
      images: [],
      description: "",
      inventory: {},
    });
    setUrlInput("");
    setShowForm(true);
    setInventoryOpen(false);
  };

  const onEdit = (p: Product) => {
    setEditing(p);
    setForm({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category,
      sizes: p.sizes.join(","),
      colors: (p.colors || []).join(","),
      images: p.images.slice(0, 5),
      description: p.description,
      inventory: p.inventory || {},
    });
    setUrlInput("");
    setShowForm(true);
    setInventoryOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;
    try {
      await apiDeleteProduct(id);
      await refresh();
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer l'article.");
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({
      name: "",
      price: 0,
      category: "midi",
      sizes: "",
      colors: "",
      images: [],
      description: "",
      inventory: {},
    });
  };

  const onFileChange = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);
    setUploadError("");
    const existing: string[] = form.images || [];

    for (let i = 0; i < files.length; i++) {
      if (existing.length >= 5) break;
      try {
        const formData = new FormData();
        formData.append("file", files[i]);
        const res = await fetch(`${API_BASE}/upload`, {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        existing.push(data.path);
      } catch (e) {
        console.error(e);
        setUploadError(`Erreur: ${files[i].name}`);
      }
    }

    setForm({ ...form, images: existing.slice(0, 5) });
    setUploading(false);
  };

  const addImageByUrl = () => {
    if (!urlInput) return;
    const existing: string[] = form.images || [];
    if (existing.length >= 5) return alert("Maximum 5 images");
    existing.push(urlInput.trim());
    setForm({ ...form, images: existing.slice(0, 5) });
    setUrlInput("");
  };

  const removeImageAt = (index: number) => {
    const existing: string[] = [...(form.images || [])];
    existing.splice(index, 1);
    setForm({ ...form, images: existing });
  };

  const onSave = async () => {
    if (!form.name.trim()) return alert("Le nom est requis");
    const sizesArr = String(form.sizes)
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
    const colorsArr = String(form.colors || "")
      .split(",")
      .map((c: string) => c.trim())
      .filter(Boolean);
    const imagesArr = (form.images || []).slice(0, 5);
    const prod: Partial<Product> = {
      id: editing ? editing.id : undefined,
      slug: editing ? editing.slug : slugify(form.name || "product"),
      name: form.name,
      price: Number(form.price) || 0,
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      category: form.category,
      description: form.description || "",
      longDescription: form.description || "",
      images: imagesArr,
      sizes: sizesArr,
      colors: colorsArr,
      rating: 0,
      reviewCount: 0,
      isNew: false,
      isBestSeller: false,
      isSale: false,
      tags: [],
      material: "",
      careInstructions: [],
      shippingInfo: "",
      returnsPolicy: "",
      inventory: form.inventory || {},
    };

    try {
      if (editing) {
        await apiUpdateProduct(editing.id, prod);
      } else {
        await createProduct(prod);
      }
      await refresh();
      closeForm();
    } catch (err) {
      console.error(err);
      alert("Impossible de sauvegarder l'article.");
    }
  };

  const updateInventoryValue = (size: string, value: number) => {
    setForm((f: any) => ({
      ...f,
      inventory: { ...(f.inventory || {}), [size]: Number(value) },
    }));
  };

  const exportProducts = () => {
    const data = JSON.stringify(items, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Form Panel as a variable (NOT a component) ──────────────────────────
  const formPanel = (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-4 sm:p-6 space-y-4 sm:space-y-5">
      {/* Form header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-base sm:text-lg text-[#1a1a1a] mb-1">
            {editing ? "Modifier l'article" : "Créer un article"}
          </h2>
          <div className="h-1 w-10 bg-gradient-to-r from-[#c9a96e] to-transparent rounded-full" />
        </div>
        <button
          onClick={closeForm}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-all text-gray-500"
          aria-label="Fermer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Nom de l'article
        </label>
        <input
          className="w-full border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/10 transition-all text-sm"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Ex: The Thea Dress"
        />
      </div>

      {/* Price & Category */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Prix ($)
          </label>
          <input
            type="number"
            className="w-full border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/10 transition-all text-sm"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Catégorie
          </label>
          <select
            className="w-full border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/10 transition-all bg-white text-sm"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="midi">MIDI</option>
            <option value="maxi">MAXI</option>
            <option value="mini">MINI</option>
          </select>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Tailles (virgule séparées)
        </label>
        <input
          className="w-full border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/10 transition-all text-sm"
          value={form.sizes}
          onChange={(e) => setForm({ ...form, sizes: e.target.value })}
          placeholder="XS,S,M,L,XL"
        />
      </div>

      {/* Colors */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Couleurs (virgule séparées)
        </label>
        <input
          className="w-full border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/10 transition-all text-sm"
          value={form.colors}
          onChange={(e) => setForm({ ...form, colors: e.target.value })}
          placeholder="Champagne, Ivory, Black"
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Images (max 5)
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer w-full border border-dashed border-gray-300 rounded-lg px-3 py-2.5 hover:border-[#c9a96e] hover:bg-[#c9a96e]/5 transition-all text-sm text-gray-500">
            <Upload size={16} className="text-[#c9a96e] flex-shrink-0" />
            <span>{uploading ? "Upload en cours…" : "Choisir des fichiers"}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onFileChange(e.target.files)}
              disabled={uploading}
              className="sr-only"
            />
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="ou ajouter par URL"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addImageByUrl()}
              className="flex-1 border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/10 transition-all"
            />
            <button
              onClick={addImageByUrl}
              className="px-3 py-2.5 bg-[#c9a96e] text-white rounded-lg hover:bg-[#b8985c] transition-all flex-shrink-0"
              disabled={uploading}
            >
              <LinkIcon size={16} />
            </button>
          </div>

          {uploadError && (
            <p className="text-xs text-red-600 font-medium">❌ {uploadError}</p>
          )}

          {(form.images || []).length > 0 && (
            <div className="grid grid-cols-5 gap-1.5 mt-2">
              {(form.images || []).map((src: string, i: number) => (
                <div key={i} className="relative group aspect-square">
                  <img
                    src={src}
                    alt={`${i}`}
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    onClick={() => removeImageAt(i)}
                    className="absolute -top-1.5 -right-1.5 bg-white shadow-md rounded-full p-0.5 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                  >
                    <X size={12} className="text-red-600" />
                  </button>
                </div>
              ))}
              {(form.images || []).length < 5 && (
                <div className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-xs font-medium">
                  {(form.images || []).length}/5
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Description
        </label>
        <textarea
          className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/10 transition-all resize-none"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description du produit…"
          rows={3}
        />
      </div>

      {/* Inventory */}
      {form.sizes && (
        <div>
          <button
            type="button"
            onClick={() => setInventoryOpen((v) => !v)}
            className="w-full flex items-center justify-between text-sm font-medium text-gray-700 mb-2 py-1"
          >
            <span>Stock par taille</span>
            {inventoryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {inventoryOpen && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {String(form.sizes)
                .split(",")
                .map((s: string) => {
                  const key = s.trim();
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg"
                    >
                      <span className="text-sm font-medium text-gray-700 w-8 flex-shrink-0">
                        {key}
                      </span>
                      <input
                        type="number"
                        className="flex-1 min-w-0 border border-gray-300 px-2 py-1.5 rounded text-sm focus:outline-none focus:border-[#c9a96e]"
                        value={(form.inventory && form.inventory[key]) || 0}
                        onChange={(e) =>
                          updateInventoryValue(key, Number(e.target.value))
                        }
                      />
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={onSave}
          className="flex-1 py-3 bg-gradient-to-r from-[#c9a96e] to-[#b8985c] text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm"
        >
          {editing ? "Mettre à jour" : "Créer l'article"}
        </button>
        {editing && (
          <button
            onClick={closeForm}
            className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm"
          >
            Annuler
          </button>
        )}
      </div>
    </div>
  );

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] via-white to-[#f0ebe5]">

        {/* ── Header ── */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-3 sm:py-5 flex items-center justify-between gap-3">
            <div>
              <h1 className="font-playfair text-xl sm:text-3xl text-[#1a1a1a] leading-tight">
                Admin
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Gestion complète des articles
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportProducts}
                className="p-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium flex items-center gap-2"
                title="Exporter"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Exporter</span>
              </button>

              <button
                onClick={openNewForm}
                className="px-3 py-2 sm:px-4 bg-gradient-to-r from-[#c9a96e] to-[#b8985c] text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium flex items-center gap-2"
              >
                <Plus size={16} />
                <span className="hidden xs:inline sm:inline">Nouveau</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-3 py-2 sm:px-4 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-all text-sm font-medium"
              >
                <span className="hidden sm:inline">Logout</span>
                <X size={16} className="sm:hidden" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Main ── */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">

          {/* Mobile form */}
          {showForm && (
            <div className="lg:hidden mb-6">
              {formPanel}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* Product List */}
            <div className="lg:col-span-2">
              {items.length > 0 && (
                <p className="text-xs text-gray-400 font-medium mb-3 uppercase tracking-wide">
                  {items.length} article{items.length > 1 ? "s" : ""}
                </p>
              )}

              <div className="space-y-3 sm:space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium text-sm">
                      Aucun article — créez-en un pour commencer
                    </p>
                    <button
                      onClick={openNewForm}
                      className="mt-4 px-4 py-2 bg-gradient-to-r from-[#c9a96e] to-[#b8985c] text-white rounded-lg text-sm font-medium inline-flex items-center gap-2"
                    >
                      <Plus size={14} />
                      Créer un article
                    </button>
                  </div>
                ) : (
                  items.map((p) => (
                    <div
                      key={p.id}
                      className="group bg-white rounded-xl border border-gray-200 hover:border-[#c9a96e] hover:shadow-md transition-all duration-300 overflow-hidden"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-5">
                        <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={p.images?.[0] || "https://via.placeholder.com/80"}
                            alt="thumb"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[#1a1a1a] truncate text-sm sm:text-base">
                            {p.name}
                          </h3>
                          <p className="text-xs text-gray-400 truncate hidden sm:block">
                            {p.slug}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-base sm:text-lg font-semibold text-[#c9a96e]">
                              ${p.price}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              {p.category}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">
                            {p.sizes.join(", ")}
                          </p>
                        </div>

                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => onEdit(p)}
                            className="p-2.5 sm:p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all active:scale-95"
                            aria-label="Modifier"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => onDelete(p.id)}
                            className="p-2.5 sm:p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all active:scale-95"
                            aria-label="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Desktop Form */}
            <div className="hidden lg:block">
              <div className="sticky top-28">
                {formPanel}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile FAB */}
        {!showForm && (
          <button
            onClick={openNewForm}
            className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-[#c9a96e] to-[#b8985c] text-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-all active:scale-95"
            aria-label="Nouvel article"
          >
            <Plus size={24} />
          </button>
        )}
      </div>
    </PageTransition>
  );
};

export default AdminPage;

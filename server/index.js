import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTS_PATH = path.resolve(__dirname, "../public/products.json");
const PORT = process.env.PORT || 3001;

// ─── Cloudinary config ───────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "sirena",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});
const upload = multer({ storage });

// ─── Helpers ──────────────────────────────────────────────────────────
const readProducts = async () => {
  const raw = await fs.readFile(PRODUCTS_PATH, "utf-8");
  return JSON.parse(raw);
};

const writeProducts = async (products) => {
  await fs.writeFile(PRODUCTS_PATH, JSON.stringify(products, null, 2), "utf-8");
};

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const makeId = (products) => {
  const maxId = products.reduce((max, p) => {
    const n = parseInt(p.id, 10);
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);
  return String(maxId + 1);
};

const nowSql = () => new Date().toISOString().slice(0, 19).replace("T", " ");

// ─── App ──────────────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

// GET /api/products — list all
app.get("/api/products", async (_req, res) => {
  try {
    const products = await readProducts();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossible de lire products.json" });
  }
});

// POST /api/products — create
app.post("/api/products", async (req, res) => {
  try {
    const products = await readProducts();
    const body = req.body || {};

    const product = {
      id: makeId(products),
      slug: body.slug ? slugify(body.slug) : slugify(body.name || "produit"),
      name: body.name || "",
      price: body.price ?? 0,
      originalPrice: body.originalPrice ?? "",
      category: body.category || "",
      description: body.description || "",
      longDescription: body.longDescription || body.description || "",
      images: Array.isArray(body.images) ? body.images : [],
      sizes: Array.isArray(body.sizes) ? body.sizes : [],
      colors: Array.isArray(body.colors) ? body.colors : [],
      rating: body.rating ?? 0,
      reviewCount: body.reviewCount ?? 0,
      isNew: body.isNew ? 1 : 0,
      isBestSeller: body.isBestSeller ? 1 : 0,
      isSale: body.isSale ? 1 : 0,
      tags: Array.isArray(body.tags) ? body.tags : [],
      material: body.material || "",
      careInstructions: Array.isArray(body.careInstructions)
        ? body.careInstructions
        : [],
      shippingInfo: body.shippingInfo || "",
      returnsPolicy: body.returnsPolicy || "",
      inventory: body.inventory && typeof body.inventory === "object" ? body.inventory : {},
      created_at: nowSql(),
    };

    products.push(product);
    await writeProducts(products);
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossible de créer l'article" });
  }
});

// PUT /api/products/:id — update
app.put("/api/products/:id", async (req, res) => {
  try {
    const products = await readProducts();
    const idx = products.findIndex((p) => String(p.id) === String(req.params.id));
    if (idx === -1) {
      return res.status(404).json({ error: "Article introuvable" });
    }

    const existing = products[idx];
    const body = req.body || {};

    const updated = {
      ...existing,
      slug: body.slug ? slugify(body.slug) : existing.slug,
      name: body.name ?? existing.name,
      price: body.price ?? existing.price,
      originalPrice: body.originalPrice ?? existing.originalPrice,
      category: body.category ?? existing.category,
      description: body.description ?? existing.description,
      longDescription: body.longDescription ?? existing.longDescription,
      images: Array.isArray(body.images) ? body.images : existing.images,
      sizes: Array.isArray(body.sizes) ? body.sizes : existing.sizes,
      colors: Array.isArray(body.colors) ? body.colors : existing.colors,
      isNew: body.isNew !== undefined ? (body.isNew ? 1 : 0) : existing.isNew,
      isBestSeller:
        body.isBestSeller !== undefined
          ? body.isBestSeller
            ? 1
            : 0
          : existing.isBestSeller,
      isSale: body.isSale !== undefined ? (body.isSale ? 1 : 0) : existing.isSale,
      tags: Array.isArray(body.tags) ? body.tags : existing.tags,
      material: body.material ?? existing.material,
      careInstructions: Array.isArray(body.careInstructions)
        ? body.careInstructions
        : existing.careInstructions,
      shippingInfo: body.shippingInfo ?? existing.shippingInfo,
      returnsPolicy: body.returnsPolicy ?? existing.returnsPolicy,
      inventory:
        body.inventory && typeof body.inventory === "object"
          ? body.inventory
          : existing.inventory,
    };

    products[idx] = updated;
    await writeProducts(products);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossible de mettre à jour l'article" });
  }
});

// DELETE /api/products/:id — delete
app.delete("/api/products/:id", async (req, res) => {
  try {
    const products = await readProducts();
    const next = products.filter((p) => String(p.id) !== String(req.params.id));
    if (next.length === products.length) {
      return res.status(404).json({ error: "Article introuvable" });
    }
    await writeProducts(next);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossible de supprimer l'article" });
  }
});

// POST /api/upload — image upload to Cloudinary
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier reçu" });
  }
  res.json({ path: req.file.path });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import crypto from "crypto";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const uploadsDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `img-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sirena",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const query = async (sql, params = []) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};

const parseJsonField = (value) => {
  if (value == null) return null;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
};

const normalizeProduct = (row) => ({
  ...row,
  price: Number(row.price || 0),
  originalPrice:
    row.originalPrice !== null && row.originalPrice !== undefined
      ? Number(row.originalPrice)
      : null,
  images: parseJsonField(row.images) || [],
  sizes: parseJsonField(row.sizes) || [],
  colors: parseJsonField(row.colors) || [],
  tags: parseJsonField(row.tags) || [],
  careInstructions: parseJsonField(row.careInstructions) || [],
  inventory: parseJsonField(row.inventory) || {},
  isNew: Boolean(row.isNew),
  isBestSeller: Boolean(row.isBestSeller),
  isSale: Boolean(row.isSale),
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const relativePath = `/uploads/${req.file.filename}`;
  res.json({ path: relativePath });
});

app.post("/api/upload-batch", upload.array("files", 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }
  const paths = req.files.map((file) => `/uploads/${file.filename}`);
  res.json({ paths });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});


app.get("/api/products", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM products ORDER BY updated_at DESC");
    res.json(rows.map(normalizeProduct));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load products" });
  }
});

app.get("/api/products/slug/:slug", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM products WHERE slug = ? LIMIT 1",
      [req.params.slug],
    );
    if (!rows || Array.isArray(rows) && rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(normalizeProduct(rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load product" });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const data = req.body;
    const id = data.id || crypto.randomUUID();
    const slug = data.slug || String(data.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    await query(
      `INSERT INTO products
        (id, slug, name, price, originalPrice, category, description, longDescription, images, sizes, colors, rating, reviewCount, isNew, isBestSeller, isSale, tags, material, careInstructions, shippingInfo, returnsPolicy, inventory)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        slug,
        data.name || "",
        data.price || 0,
        data.originalPrice || null,
        data.category || null,
        data.description || "",
        data.longDescription || data.description || "",
        JSON.stringify(data.images || []),
        JSON.stringify(data.sizes || []),
        JSON.stringify(data.colors || []),
        data.rating || 0,
        data.reviewCount || 0,
        data.isNew ? 1 : 0,
        data.isBestSeller ? 1 : 0,
        data.isSale ? 1 : 0,
        JSON.stringify(data.tags || []),
        data.material || null,
        JSON.stringify(data.careInstructions || []),
        data.shippingInfo || "",
        data.returnsPolicy || "",
        JSON.stringify(data.inventory || {}),
      ],
    );

    const product = {
      id,
      slug,
      name: data.name || "",
      price: Number(data.price || 0),
      originalPrice: data.originalPrice || null,
      category: data.category || "",
      description: data.description || "",
      longDescription: data.longDescription || data.description || "",
      images: data.images || [],
      sizes: data.sizes || [],
      colors: data.colors || [],
      rating: Number(data.rating || 0),
      reviewCount: Number(data.reviewCount || 0),
      isNew: Boolean(data.isNew),
      isBestSeller: Boolean(data.isBestSeller),
      isSale: Boolean(data.isSale),
      tags: data.tags || [],
      material: data.material || "",
      careInstructions: data.careInstructions || [],
      shippingInfo: data.shippingInfo || "",
      returnsPolicy: data.returnsPolicy || "",
      inventory: data.inventory || {},
    };

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create product" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;
    const slug = data.slug || String(data.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    await query(
      `UPDATE products SET
        slug = ?, name = ?, price = ?, originalPrice = ?, category = ?, description = ?, longDescription = ?, images = ?, sizes = ?, colors = ?, rating = ?, reviewCount = ?, isNew = ?, isBestSeller = ?, isSale = ?, tags = ?, material = ?, careInstructions = ?, shippingInfo = ?, returnsPolicy = ?, inventory = ?
      WHERE id = ?`,
      [
        slug,
        data.name || "",
        data.price || 0,
        data.originalPrice || null,
        data.category || null,
        data.description || "",
        data.longDescription || data.description || "",
        JSON.stringify(data.images || []),
        JSON.stringify(data.sizes || []),
        JSON.stringify(data.colors || []),
        data.rating || 0,
        data.reviewCount || 0,
        data.isNew ? 1 : 0,
        data.isBestSeller ? 1 : 0,
        data.isSale ? 1 : 0,
        JSON.stringify(data.tags || []),
        data.material || null,
        JSON.stringify(data.careInstructions || []),
        data.shippingInfo || "",
        data.returnsPolicy || "",
        JSON.stringify(data.inventory || {}),
        id,
      ],
    );

    res.json({
      id,
      slug,
      ...data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update product" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    await query("DELETE FROM products WHERE id = ?", [req.params.id]);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

app.use(express.static(path.join(__dirname, "../dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ API server running on http://localhost:${PORT}`);
});

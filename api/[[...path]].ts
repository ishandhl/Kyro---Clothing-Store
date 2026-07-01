import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from "../src/data.ts";
import { Product } from "../src/types.ts";

const app = express();

let productsDb: Product[] = [...INITIAL_PRODUCTS];
let ordersDb: any[] = [];
let reviewsDb: any[] = [...INITIAL_REVIEWS];

app.use(express.json());

app.get("/products", (req, res) => {
  res.json({ products: productsDb });
});

app.post("/products", (req, res) => {
  const newProduct = req.body as Product;
  if (!newProduct.id) {
    newProduct.id = "kr-" + (productsDb.length + 1).toString().padStart(2, "0");
  }
  const idx = productsDb.findIndex((p) => p.id === newProduct.id);
  if (idx !== -1) {
    productsDb[idx] = newProduct;
  } else {
    productsDb.push(newProduct);
  }
  res.json({ success: true, product: newProduct });
});

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  productsDb = productsDb.filter((p) => p.id !== id);
  res.json({ success: true });
});

app.post("/orders", (req, res) => {
  const newOrder = req.body;

  if (!newOrder.items || !Array.isArray(newOrder.items) || newOrder.items.length === 0) {
    return res.status(400).json({ error: "The order cart is empty." });
  }

  for (const item of newOrder.items) {
    const dbProduct = productsDb.find((p) => p.id === item.product.id);
    if (!dbProduct) {
      return res.status(400).json({ error: `Product ${item.product.name} not found in our catalog.` });
    }
    if (dbProduct.stock < item.quantity) {
      return res.status(400).json({ error: `Inadequate stock for ${dbProduct.name}. Only ${dbProduct.stock} items remaining in our luxury reserve.` });
    }
  }

  for (const item of newOrder.items) {
    const dbProduct = productsDb.find((p) => p.id === item.product.id)!;
    dbProduct.stock -= item.quantity;
  }

  newOrder.id = "KYRO-ORD-" + Math.floor(100000 + Math.random() * 900000);
  newOrder.createdAt = new Date().toISOString().split("T")[0];
  ordersDb.push(newOrder);
  res.json({ success: true, order: newOrder });
});

app.get("/orders", (req, res) => {
  res.json({ orders: ordersDb });
});

app.get("/orders/:id", (req, res) => {
  const { id } = req.params;
  const order = ordersDb.find((o) => o.id === id.toUpperCase());
  if (order) {
    res.json({ success: true, order });
  } else {
    res.status(404).json({ error: "Order signature not found in our registry." });
  }
});

app.put("/orders/:id", (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;
  const order = ordersDb.find((o) => o.id === id);
  if (order) {
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    res.json({ success: true, order });
  } else {
    res.status(404).json({ error: "Order not found" });
  }
});

app.get("/reviews/:productId", (req, res) => {
  const { productId } = req.params;
  const productReviews = reviewsDb.filter((r) => r.productId === productId);
  res.json({ reviews: productReviews });
});

app.post("/reviews", (req, res) => {
  const newReview = req.body;
  newReview.id = "rev-" + Date.now();
  newReview.createdAt = new Date().toISOString().split("T")[0];
  reviewsDb.push(newReview);

  const prod = productsDb.find((p) => p.id === newReview.productId);
  if (prod) {
    const prodReviews = reviewsDb.filter((r) => r.productId === newReview.productId);
    const totalRating = prodReviews.reduce((sum, r) => sum + r.rating, 0);
    prod.rating = parseFloat((totalRating / prodReviews.length).toFixed(1));
    prod.reviewsCount = prodReviews.length;
  }

  res.json({ success: true, review: newReview });
});

app.post("/advisor", async (req, res) => {
  const { messages } = req.body;
  try {
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      return res.json({
        text: "I am ready to act as your KYRO Master Stylist, but the Gemini API Key is not configured yet. You can set it in the Settings panel. For now, I can recommend styling the 'Heavy Loopback Hoodie' in Cream with our 'Modular Cargo Pants' in Olive Green for an effortlessly structured, balanced drop shoulder silhouette.",
        productIds: ["kr-01", "kr-02"]
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });

    const catalogContext = productsDb.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category,
      description: p.description,
      colors: p.colors,
      sizes: p.sizes
    }));

    const systemInstruction = `You are the master AI Stylist and creative outfit assistant for KYRO, an award-winning minimalist luxury streetwear brand inspired by Apple, Fear of God, Aime Leon Dore, GENTLE MONSTER, and Nothing.

Your mission is to guide clients into crafting perfect outfits from the official KYRO catalog listed below.
Your tone must be confident, editorial, sophisticated, and minimalist. Speak like a luxury creative director or senior personal stylist.

OFFICIAL CATALOGUE:
${JSON.stringify(catalogContext, null, 2)}

DIRECTIVES:
1. Under NO circumstances suggest products, categories, or brands that are not listed in the official catalog above. Stick 100% strictly to the items in our stock.
2. Recommend layers, pairings, colors, and styling tips (e.g., matching the Heavy Loopback Hoodie with the Modular Cargo Pants).
3. To allow the UI to show interactive product tiles beneath your chat bubble, you MUST end your message with a structured recommendation block:
   [RECOMMENDATIONS: id1, id2]
   where the comma-separated values are the exact product IDs from our catalog. You can recommend between 1 to 3 items.
   Example: "For a muted modular tech-wear drape, I suggest layering our Technical Shell Jacket over the Heavy Loopback Hoodie, completed with the Modular Cargo Pants. [RECOMMENDATIONS: kr-04, kr-01, kr-02]"`;

    const promptContents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7
      }
    });

    const responseText = response.text || "";

    let productIds: string[] = [];
    const match = responseText.match(/\[RECOMMENDATIONS:\s*([^\]]+)\]/);
    if (match && match[1]) {
      productIds = match[1]
        .split(",")
        .map((id) => id.trim())
        .filter((id) => productsDb.some((p) => p.id === id));
    }

    const cleanedText = responseText.replace(/\[RECOMMENDATIONS:\s*[^\]]+\]/, "").trim();

    res.json({
      text: cleanedText,
      productIds: productIds
    });
  } catch (err: any) {
    console.warn("Gemini API Error in /api/advisor. Initializing luxury backup advisor engine:", err);

    const userMessage = messages[messages.length - 1]?.text || "";
    const query = userMessage.toLowerCase();

    let text = "";
    let productIds: string[] = [];

    if (query.includes("hoodie") || query.includes("warm") || query.includes("cold") || query.includes("winter")) {
      text = "Our model frequencies are experiencing high atmospheric demand, but as your Personal Stylist, I advise a heavy-structured silhouette: Layer our 500gsm Heavy Loopback Hoodie under the Luxury Beanie for exceptional comfort, balanced with the Modular Cargo Pant in Onyx Black.";
      productIds = ["kr-01", "kr-07", "kr-02"];
    } else if (query.includes("cargo") || query.includes("pant") || query.includes("trouser") || query.includes("legs")) {
      text = "For architectural leg geometry, I suggest our high-density Modular Cargo Pant. Style it simply with the Atmosphere Graphic Tee, and layer with the Technical Shell Jacket for an adaptable high-street drape.";
      productIds = ["kr-02", "kr-03", "kr-04"];
    } else if (query.includes("technical") || query.includes("shell") || query.includes("rain") || query.includes("outdoor") || query.includes("jacket") || query.includes("vest")) {
      text = "For high-performance utility, layer our 3-Layer Technical Shell Jacket over the Heavy Loopback Hoodie, completed by the water-repellent Modular Cargo Pant.";
      productIds = ["kr-04", "kr-01", "kr-02"];
    } else if (query.includes("tee") || query.includes("shirt") || query.includes("summer") || query.includes("hot") || query.includes("warm weather")) {
      text = "For high-temperature structural styling, pair our long-staple 280gsm Atmosphere Graphic Tee with the hand-polished Acetate D-Frame Sunglasses.";
      productIds = ["kr-03", "kr-05"];
    } else if (query.includes("accessory") || query.includes("sunglasses") || query.includes("glass") || query.includes("beanie") || query.includes("hat")) {
      text = "Our accessories provide the perfect finish. I recommend the Italian cellulose Acetate D-Frame Sunglasses paired with our Merino Wool Luxury Beanie.";
      productIds = ["kr-05", "kr-07"];
    } else {
      text = "Due to extreme high demand on our luxury neural processors, I am operating on styling reserve codes. I highly recommend pairing our Heavy Loopback Hoodie with the articulated Modular Cargo Pants for a clean, balanced drop silhouette.";
      productIds = ["kr-01", "kr-02"];
    }

    productIds = productIds.filter((id) => productsDb.some((p) => p.id === id));

    return res.json({
      text: text,
      productIds: productIds
    });
  }
});

// Export Express app for Vercel serverless runtime.
export default app;

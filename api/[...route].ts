import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dns from "node:dns";
import { Hero, About, Phase, Role, Highlight, CTA, Carousel, Testimonial, BootcampMedia, SiteContent } from "../src/models.ts";

dotenv.config();

const dnsServers = (process.env.DNS_SERVERS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
if (dnsServers.length > 0) {
  try {
    dns.setServers(dnsServers);
  } catch (err) {
    console.error("Invalid DNS_SERVERS value:", err);
  }
}

const adminPassword = process.env.ADMIN_PASSWORD || "";
const mongoUri = process.env.MONGO_URI;
let lastMongoError: string | null = null;

let mongoConnectionPromise: Promise<typeof mongoose> | null = null;
const ensureDbConnection = async () => {
  if (!mongoUri || mongoUri === "mongodb+srv://...") return;
  if (mongoose.connection.readyState === 1) return;
  if (!mongoConnectionPromise) {
    mongoConnectionPromise = mongoose
      .connect(mongoUri, {
        serverSelectionTimeoutMS: 1500,
        connectTimeoutMS: 1500,
      })
      .then((conn) => {
        lastMongoError = null;
        return conn;
      })
      .catch((err) => {
        lastMongoError = err instanceof Error ? err.message : String(err);
        mongoConnectionPromise = null;
        throw err;
      });
  }
  await mongoConnectionPromise;
};

const isDbConnected = () => mongoose.connection.readyState === 1;
const nextId = (prefix: string) => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

const fallbackHero = {
  title: "ATLASIA",
  subtitle: "THE BOOTCAMP COMPANY",
  tagline: "12-Day Industry Bootcamp: INDUSTRY IMMERSION BOOTCAMP - From Classroom to Corporate Execution",
  primaryButtonText: "Explore Bootcamp",
  primaryButtonLink: "/bootcamp",
  secondaryButtonText: "Join as Student",
  secondaryButtonLink: "/students",
};

const fallbackAbout = {
  whoWeAre: "Atlasia is a premier industry immersion bootcamp designed to bridge the gap between academic learning and corporate reality.",
  whyAtlasia: "We provide real-world exposure, mentorship from industry leaders, and hands-on project experience.",
  approach: "Our 15-day intensive program focuses on execution, strategy, and professional growth.",
  vision: "To be a leader in professional immersion training for students",
  mission: "Empowering the next generation of professionals through direct industry engagement.",
};

const fallbackPhases = [
  { _id: "ph1", title: "Phase 1: Foundations", duration: "Day 1-2", description: "Introduction to industry standards and core concepts.", order: 1 },
  { _id: "ph2", title: "Phase 2: Deep Dive", duration: "Day 2-3", description: "Intensive workshops and real-world case studies.", order: 2 },
  { _id: "ph3", title: "Phase 3: Execution", duration: "Day 3-12", description: "Final project delivery and corporate presentation.", order: 3 },
];

const fallbackRoles = [
  { _id: "r1", roleName: "Business Analyst", description: "Analyze business needs and document requirements.", responsibilities: ["Requirement Gathering", "Process Mapping", "Stakeholder Management"], registerLink: "https://docs.google.com/forms/d/e/1FAIpQLSdSpFlEDLjvojJoACj1gMSSBU6Zspk5yYafi79CGh-IBQ4uVg/viewform", order: 1 },
  { _id: "r2", roleName: "HR", description: "Drive product vision and strategy.", responsibilities: ["Roadmap Planning", "User Research", "Agile Leadership"], registerLink: "https://docs.google.com/forms/d/e/1FAIpQLSdSpFlEDLjvojJoACj1gMSSBU6Zspk5yYafi79CGh-IBQ4uVg/viewform", order: 2 },
  { _id: "r3", roleName: "Operations", description: "Optimize internal processes and efficiency.", responsibilities: ["Workflow Optimization", "Resource Allocation", "Performance Tracking"], registerLink: "https://docs.google.com/forms/d/e/1FAIpQLSdSpFlEDLjvojJoACj1gMSSBU6Zspk5yYafi79CGh-IBQ4uVg/viewform", order: 3 },
  { _id: "r4", roleName: "BDE", description: "Optimize internal processes and efficiency.", responsibilities: ["Lead Generation & Market Research", "Client Relationship Management", "Revenue Growth Strategy"], registerLink: "https://docs.google.com/forms/d/e/1FAIpQLSdSpFlEDLjvojJoACj1gMSSBU6Zspk5yYafi79CGh-IBQ4uVg/viewform", order: 4 },
  { _id: "r5", roleName: "Web Development", description: "Develop Real Time Scalable Web Applications", responsibilities: ["Lead Generation & Market Research", "Client Relationship Management", "Revenue Growth Strategy"], registerLink: "https://docs.google.com/forms/d/e/1FAIpQLSdSpFlEDLjvojJoACj1gMSSBU6Zspk5yYafi79CGh-IBQ4uVg/viewform", order: 5 },
];

const fallbackHighlights = [
  { _id: "h1", title: "Industry Mentors", description: "Learn directly from professionals working in top-tier companies.", order: 1 },
  { _id: "h2", title: "Real Projects", description: "Work on actual business problems and deliver tangible solutions.", order: 2 },
  { _id: "h3", title: "Networking", description: "Build lasting connections with peers and industry leaders.", order: 3 },
];

const fallbackCta = {
  heading: "Ready to Transform Your Career?",
  buttonText: "Register Now",
  buttonLink: "/students",
};

const fallbackCarousel = [
  { _id: "c1", imageUrl: "https://picsum.photos/seed/atlasia1/1200/600", title: "Immersive Learning", description: "Experience the corporate world first-hand." },
  { _id: "c2", imageUrl: "https://picsum.photos/seed/atlasia2/1200/600", title: "Expert Guidance", description: "Mentorship from industry veterans." },
  { _id: "c3", imageUrl: "https://picsum.photos/seed/atlasia3/1200/600", title: "Career Growth", description: "Accelerate your professional journey." },
];

const fallbackTestimonials = [
  { _id: "t1", imageUrl: "https://picsum.photos/seed/testi1/300/300", name: "Ananya Sharma", role: "Business Analyst Intern", quote: "ATLASIA gave me practical confidence and a clear path into corporate projects.", order: 1 },
  { _id: "t2", imageUrl: "https://picsum.photos/seed/testi2/300/300", name: "Rahul Menon", role: "Product Operations Trainee", quote: "The 12-day immersion was intense, structured, and exactly what I needed to level up.", order: 2 },
  { _id: "t3", imageUrl: "https://picsum.photos/seed/testi3/300/300", name: "Sneha Iyer", role: "Program Participant", quote: "From day one to final presentation, every module felt relevant to real work.", order: 3 },
];

const fallbackBootcampMedia = [
  { _id: "bm1", mediaUrl: "/uploads/1772621960511-ca0f63a4-9b35-460a-92d8-8b357c30963f-WhatsAppImage2026-03-04at42501PM1.jpg", mediaType: "image", title: "Bootcamp Media 1", description: "Auto-loaded from uploads folder.", order: 1 },
  { _id: "bm2", mediaUrl: "/uploads/1772621926796-9a0523a7-823c-4b5b-9f7a-50715da0b0fd-WhatsAppImage2026-03-04at42501PM.jpg", mediaType: "image", title: "Bootcamp Media 2", description: "Auto-loaded from uploads folder.", order: 2 },
  { _id: "bm3", mediaUrl: "/uploads/1772621907273-f43b9b5a-9059-457b-b2c2-b24f2ab20b0a-WhatsAppImage2026-03-04at42502PM.jpg", mediaType: "image", title: "Bootcamp Media 3", description: "Auto-loaded from uploads folder.", order: 3 },
  { _id: "bm4", mediaUrl: "/uploads/1772621899573-7dc370ec-66e7-4e5b-8110-c7e2e25690f3-WhatsAppImage2026-03-04at42501PM2.jpg", mediaType: "image", title: "Bootcamp Media 4", description: "Auto-loaded from uploads folder.", order: 4 },
];

let fallbackSiteContent: Record<string, unknown> = {};

const app = express();
app.use(cors());
app.use(express.json({ limit: "40mb" }));

const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!adminPassword) return res.status(503).json({ error: "ADMIN_PASSWORD is not configured" });
  const key = req.header("x-admin-key");
  if (!key || key !== adminPassword) return res.status(401).json({ error: "Unauthorized" });
  return next();
};

app.use((_req, _res, next) => {
  // Non-blocking connection attempt so API can still serve fallback data
  // when MongoDB is unavailable or slow in serverless environments.
  void ensureDbConnection().catch((err) => {
    console.error("MongoDB connection error:", err);
  });
  next();
});

app.get("/api/admin/verify", requireAdmin, (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/admin/status", requireAdmin, (_req, res) => {
  res.json({
    dbConnected: isDbConnected(),
    mongoUriConfigured: Boolean(mongoUri),
    lastMongoError,
  });
});

app.use("/api", (req, res, next) => {
  if (req.method === "GET") return next();
  return requireAdmin(req, res, next);
});

app.get("/api/hero", async (_req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackHero);
    let data = await (Hero as any).findOne();
    if (!data) data = await (Hero as any).create(fallbackHero);
    return res.json(data);
  } catch {
    return res.json(fallbackHero);
  }
});

app.put("/api/hero", async (req, res) => {
  try {
    if (!isDbConnected()) {
      Object.assign(fallbackHero, req.body);
      return res.json(fallbackHero);
    }
    const hero = await (Hero as any).findOneAndUpdate({}, req.body, { new: true, upsert: true });
    return res.json(hero);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.get("/api/about", async (_req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackAbout);
    let data = await (About as any).findOne();
    if (!data) data = await (About as any).create(fallbackAbout);
    return res.json(data);
  } catch {
    return res.json(fallbackAbout);
  }
});

app.put("/api/about", async (req, res) => {
  try {
    if (!isDbConnected()) {
      Object.assign(fallbackAbout, req.body);
      return res.json(fallbackAbout);
    }
    const about = await (About as any).findOneAndUpdate({}, req.body, { new: true, upsert: true });
    return res.json(about);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.get("/api/phases", async (_req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackPhases);
    const phases = await (Phase as any).find().sort({ order: 1 });
    if (phases.length === 0) {
      await (Phase as any).insertMany(fallbackPhases);
      return res.json(fallbackPhases);
    }
    return res.json(phases);
  } catch {
    return res.json(fallbackPhases);
  }
});

app.post("/api/phases", async (req, res) => {
  try {
    if (!isDbConnected()) {
      const item = { _id: nextId("ph"), ...req.body };
      fallbackPhases.push(item);
      return res.json(item);
    }
    const phase = await (Phase as any).create(req.body);
    return res.json(phase);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.put("/api/phases/:id", async (req, res) => {
  try {
    if (!isDbConnected()) {
      const idx = fallbackPhases.findIndex((x) => x._id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: "Not found" });
      fallbackPhases[idx] = { ...fallbackPhases[idx], ...req.body };
      return res.json(fallbackPhases[idx]);
    }
    const phase = await (Phase as any).findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(phase);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.delete("/api/phases/:id", async (req, res) => {
  try {
    if (!isDbConnected()) {
      const idx = fallbackPhases.findIndex((x) => x._id === req.params.id);
      if (idx >= 0) fallbackPhases.splice(idx, 1);
      return res.json({ message: "Deleted" });
    }
    await (Phase as any).findByIdAndDelete(req.params.id);
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.get("/api/roles", async (_req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackRoles);
    const roles = await (Role as any).find().sort({ order: 1 });
    if (roles.length === 0) {
      await (Role as any).insertMany(fallbackRoles);
      return res.json(fallbackRoles);
    }
    return res.json(roles);
  } catch {
    return res.json(fallbackRoles);
  }
});

app.post("/api/roles", async (req, res) => {
  try {
    if (!isDbConnected()) {
      const item = { _id: nextId("r"), ...req.body };
      fallbackRoles.push(item);
      return res.json(item);
    }
    const role = await (Role as any).create(req.body);
    return res.json(role);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.put("/api/roles/:id", async (req, res) => {
  try {
    if (!isDbConnected()) {
      const idx = fallbackRoles.findIndex((x) => x._id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: "Not found" });
      fallbackRoles[idx] = { ...fallbackRoles[idx], ...req.body };
      return res.json(fallbackRoles[idx]);
    }
    const role = await (Role as any).findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(role);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.delete("/api/roles/:id", async (req, res) => {
  try {
    if (!isDbConnected()) {
      const idx = fallbackRoles.findIndex((x) => x._id === req.params.id);
      if (idx >= 0) fallbackRoles.splice(idx, 1);
      return res.json({ message: "Deleted" });
    }
    await (Role as any).findByIdAndDelete(req.params.id);
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.get("/api/highlights", async (_req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackHighlights);
    const highlights = await (Highlight as any).find().sort({ order: 1 });
    if (highlights.length === 0) {
      await (Highlight as any).insertMany(fallbackHighlights);
      return res.json(fallbackHighlights);
    }
    return res.json(highlights);
  } catch {
    return res.json(fallbackHighlights);
  }
});

app.post("/api/highlights", async (req, res) => {
  try {
    if (!isDbConnected()) {
      const item = { _id: nextId("h"), ...req.body };
      fallbackHighlights.push(item);
      return res.json(item);
    }
    const highlight = await (Highlight as any).create(req.body);
    return res.json(highlight);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.put("/api/highlights/:id", async (req, res) => {
  try {
    if (!isDbConnected()) {
      const idx = fallbackHighlights.findIndex((x) => x._id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: "Not found" });
      fallbackHighlights[idx] = { ...fallbackHighlights[idx], ...req.body };
      return res.json(fallbackHighlights[idx]);
    }
    const highlight = await (Highlight as any).findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(highlight);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.delete("/api/highlights/:id", async (req, res) => {
  try {
    if (!isDbConnected()) {
      const idx = fallbackHighlights.findIndex((x) => x._id === req.params.id);
      if (idx >= 0) fallbackHighlights.splice(idx, 1);
      return res.json({ message: "Deleted" });
    }
    await (Highlight as any).findByIdAndDelete(req.params.id);
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.get("/api/cta", async (_req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackCta);
    let data = await (CTA as any).findOne();
    if (!data) data = await (CTA as any).create(fallbackCta);
    return res.json(data);
  } catch {
    return res.json(fallbackCta);
  }
});

app.put("/api/cta", async (req, res) => {
  try {
    if (!isDbConnected()) {
      Object.assign(fallbackCta, req.body);
      return res.json(fallbackCta);
    }
    const cta = await (CTA as any).findOneAndUpdate({}, req.body, { new: true, upsert: true });
    return res.json(cta);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.get("/api/carousel", async (_req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackCarousel);
    const carousel = await (Carousel as any).find().sort({ createdAt: -1 });
    if (carousel.length === 0) {
      await (Carousel as any).insertMany(fallbackCarousel);
      return res.json(fallbackCarousel);
    }
    return res.json(carousel);
  } catch {
    return res.json(fallbackCarousel);
  }
});

app.post("/api/carousel", async (req, res) => {
  try {
    if (!isDbConnected()) {
      const item = { _id: nextId("c"), ...req.body };
      fallbackCarousel.unshift(item);
      return res.json(item);
    }
    const item = await (Carousel as any).create(req.body);
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.delete("/api/carousel/:id", async (req, res) => {
  try {
    if (!isDbConnected()) {
      const idx = fallbackCarousel.findIndex((x) => x._id === req.params.id);
      if (idx >= 0) fallbackCarousel.splice(idx, 1);
      return res.json({ message: "Deleted" });
    }
    await (Carousel as any).findByIdAndDelete(req.params.id);
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.get("/api/testimonials", async (_req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackTestimonials);
    const testimonials = await (Testimonial as any).find().sort({ order: 1, createdAt: -1 });
    if (testimonials.length === 0) {
      await (Testimonial as any).insertMany(fallbackTestimonials.map(({ _id, ...item }) => item));
      return res.json(fallbackTestimonials);
    }
    return res.json(testimonials);
  } catch {
    return res.json(fallbackTestimonials);
  }
});

app.post("/api/testimonials", async (req, res) => {
  try {
    if (!isDbConnected()) {
      const item = { _id: nextId("t"), ...req.body };
      fallbackTestimonials.push(item);
      return res.json(item);
    }
    const item = await (Testimonial as any).create(req.body);
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.put("/api/testimonials/:id", async (req, res) => {
  try {
    if (!isDbConnected()) {
      const idx = fallbackTestimonials.findIndex((x) => x._id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: "Not found" });
      fallbackTestimonials[idx] = { ...fallbackTestimonials[idx], ...req.body };
      return res.json(fallbackTestimonials[idx]);
    }
    const item = await (Testimonial as any).findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.delete("/api/testimonials/:id", async (req, res) => {
  try {
    if (!isDbConnected()) {
      const idx = fallbackTestimonials.findIndex((x) => x._id === req.params.id);
      if (idx >= 0) fallbackTestimonials.splice(idx, 1);
      return res.json({ message: "Deleted" });
    }
    await (Testimonial as any).findByIdAndDelete(req.params.id);
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.get("/api/bootcamp-media", async (_req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackBootcampMedia);
    const items = await (BootcampMedia as any).find().sort({ order: 1, createdAt: -1 });
    if (items.length === 0) {
      await (BootcampMedia as any).insertMany(fallbackBootcampMedia.map(({ _id, ...item }) => item));
      return res.json(fallbackBootcampMedia);
    }
    return res.json(items);
  } catch {
    return res.json(fallbackBootcampMedia);
  }
});

app.post("/api/bootcamp-media", async (req, res) => {
  try {
    if (!isDbConnected()) {
      const item = { _id: nextId("bm"), ...req.body };
      fallbackBootcampMedia.push(item);
      return res.json(item);
    }
    const item = await (BootcampMedia as any).create(req.body);
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.put("/api/bootcamp-media/:id", async (req, res) => {
  try {
    if (!isDbConnected()) {
      const idx = fallbackBootcampMedia.findIndex((x) => x._id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: "Not found" });
      fallbackBootcampMedia[idx] = { ...fallbackBootcampMedia[idx], ...req.body };
      return res.json(fallbackBootcampMedia[idx]);
    }
    const item = await (BootcampMedia as any).findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.delete("/api/bootcamp-media/:id", async (req, res) => {
  try {
    if (!isDbConnected()) {
      const idx = fallbackBootcampMedia.findIndex((x) => x._id === req.params.id);
      if (idx >= 0) fallbackBootcampMedia.splice(idx, 1);
      return res.json({ message: "Deleted" });
    }
    await (BootcampMedia as any).findByIdAndDelete(req.params.id);
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.get("/api/site-content", async (_req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackSiteContent);
    const doc = await (SiteContent as any).findOne();
    const data = doc?.data || {};
    fallbackSiteContent = data;
    return res.json(data);
  } catch {
    return res.json(fallbackSiteContent);
  }
});

app.put("/api/site-content", async (req, res) => {
  try {
    const payload = req.body && typeof req.body === "object" ? req.body : {};
    if (!isDbConnected()) {
      fallbackSiteContent = payload;
      return res.json(fallbackSiteContent);
    }
    const doc = await (SiteContent as any).findOneAndUpdate(
      {},
      { data: payload },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    fallbackSiteContent = doc?.data || {};
    return res.json(fallbackSiteContent);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.post("/api/uploads/base64", async (req, res) => {
  try {
    const { dataUrl } = req.body ?? {};
    if (typeof dataUrl !== "string") return res.status(400).json({ error: "dataUrl is required" });

    const match = dataUrl.match(/^data:((?:image|video)\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) return res.status(400).json({ error: "Invalid media data URL" });

    const mime = match[1];
    const encoded = match[2];
    const allowedMime = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
      "video/ogg",
    ]);
    if (!allowedMime.has(mime)) return res.status(400).json({ error: "Unsupported media type" });

    const buffer = Buffer.from(encoded, "base64");
    if (buffer.length > 30 * 1024 * 1024) return res.status(413).json({ error: "File exceeds 30MB" });

    // Serverless-safe fallback: return a data URL directly.
    // For production at scale, replace with Cloudinary/S3 and return hosted URL.
    return res.json({ url: dataUrl });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.all("/api/*", (_req, res) => {
  return res.status(404).json({ error: "Not found" });
});

export default function handler(req: any, res: any) {
  return app(req, res);
}

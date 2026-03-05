import express from "express";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dns from "node:dns";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { Hero, About, Phase, Role, Highlight, CTA, Carousel, Testimonial, BootcampMedia, SiteContent } from "./src/models.ts";

dotenv.config();
const dnsServers = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);
if (dnsServers.length > 0) dns.setServers(dnsServers);
const adminPassword = process.env.ADMIN_PASSWORD || "";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const uploadsDir = path.resolve("uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const isDbConnected = () => mongoose.connection.readyState === 1;
  const nextId = (prefix: string) => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

  const fallbackHero = {
    title: "ATLASIA",
    subtitle: "THE BOOTCAMP COMPANY",
    tagline: "12-Day Industry Bootcamp: INDUSTRY IMMERSION BOOTCAMP - From Classroom to Corporate Execution",
    primaryButtonText: "Explore Bootcamp",
    primaryButtonLink: "/bootcamp",
    secondaryButtonText: "Join as Student",
    secondaryButtonLink: "/students"
  };
  const fallbackAbout = {
    whoWeAre: "Atlasia is a premier industry immersion bootcamp designed to bridge the gap between academic learning and corporate reality.",
    whyAtlasia: "We provide real-world exposure, mentorship from industry leaders, and hands-on project experience.",
    approach: "Our 15-day intensive program focuses on execution, strategy, and professional growth.",
    vision: "To be a leader in professional immersion training for students",
    mission: "Empowering the next generation of professionals through direct industry engagement."
  };
  const fallbackPhases = [
    { _id: "ph1", title: "Phase 1: Foundations", duration: "Day 1-3", description: "Introduction to industry standards and core concepts.", order: 1 },
    { _id: "ph2", title: "Phase 2: Deep Dive", duration: "Day 4-8", description: "Intensive workshops and real-world case studies.", order: 2 },
    { _id: "ph3", title: "Phase 3: Execution", duration: "Day 9-12", description: "Final project delivery and corporate presentation.", order: 3 }
  ];
  const fallbackRoles = [
    { _id: "r1", roleName: "Business Analyst", description: "Analyze business needs and document requirements.", responsibilities: ["Requirement Gathering", "Process Mapping", "Stakeholder Management"], registerLink: "https://docs.google.com/forms/d/e/1FAIpQLSdddFRbl4A_gALPwJRA82ZklQpV1cvrg6FyCYak6Vm27QQoIw/viewform", order: 1 },
    { _id: "r2", roleName: "Product Manager", description: "Drive product vision and strategy.", responsibilities: ["Roadmap Planning", "User Research", "Agile Leadership"], registerLink: "https://docs.google.com/forms/d/e/1FAIpQLSdddFRbl4A_gALPwJRA82ZklQpV1cvrg6FyCYak6Vm27QQoIw/viewform", order: 2 },
    { _id: "r3", roleName: "Operations Lead", description: "Optimize internal processes and efficiency.", responsibilities: ["Workflow Optimization", "Resource Allocation", "Performance Tracking"], registerLink: "https://docs.google.com/forms/d/e/1FAIpQLSdddFRbl4A_gALPwJRA82ZklQpV1cvrg6FyCYak6Vm27QQoIw/viewform", order: 3 }
  ];
  const fallbackHighlights = [
    { _id: "h1", title: "Industry Mentors", description: "Learn directly from professionals working in top-tier companies.", order: 1 },
    { _id: "h2", title: "Real Projects", description: "Work on actual business problems and deliver tangible solutions.", order: 2 },
    { _id: "h3", title: "Networking", description: "Build lasting connections with peers and industry leaders.", order: 3 }
  ];
  const fallbackCta = {
    heading: "Ready to Transform Your Career?",
    buttonText: "Register Now",
    buttonLink: "/students"
  };
  const fallbackCarousel = [
    { _id: "c1", imageUrl: "https://picsum.photos/seed/atlasia1/1200/600", title: "Immersive Learning", description: "Experience the corporate world first-hand." },
    { _id: "c2", imageUrl: "https://picsum.photos/seed/atlasia2/1200/600", title: "Expert Guidance", description: "Mentorship from industry veterans." },
    { _id: "c3", imageUrl: "https://picsum.photos/seed/atlasia3/1200/600", title: "Career Growth", description: "Accelerate your professional journey." }
  ];
  const fallbackTestimonials = [
    { _id: "t1", imageUrl: "https://picsum.photos/seed/testi1/300/300", name: "Ananya Sharma", role: "Business Analyst Intern", quote: "ATLASIA gave me practical confidence and a clear path into corporate projects.", order: 1 },
    { _id: "t2", imageUrl: "https://picsum.photos/seed/testi2/300/300", name: "Rahul Menon", role: "Product Operations Trainee", quote: "The 12-day immersion was intense, structured, and exactly what I needed to level up.", order: 2 },
    { _id: "t3", imageUrl: "https://picsum.photos/seed/testi3/300/300", name: "Sneha Iyer", role: "Program Participant", quote: "From day one to final presentation, every module felt relevant to real work.", order: 3 }
  ];
  const fallbackBootcampMedia = [
    { _id: "bm1", mediaUrl: "https://picsum.photos/seed/bootcamp-media-1/1200/700", mediaType: "image", title: "Live Industry Workshop", description: "Participants collaborating in a real-time corporate simulation.", order: 1 },
    { _id: "bm2", mediaUrl: "https://picsum.photos/seed/bootcamp-media-2/1200/700", mediaType: "image", title: "Mentor Session", description: "One-on-one guidance from industry professionals.", order: 2 },
    { _id: "bm3", mediaUrl: "https://picsum.photos/seed/bootcamp-media-3/1200/700", mediaType: "image", title: "Final Presentation", description: "Delivering strategic solutions to a review panel.", order: 3 }
  ];
  let fallbackSiteContent: Record<string, unknown> = {};

  const uploadUrl = (fileName: string) => `/uploads/${encodeURIComponent(fileName)}`;
  const imageExtRegex = /\.(jpe?g|png|webp|gif|bmp|avif)$/i;
  const videoExtRegex = /\.(mp4|webm|ogv|ogg)$/i;

  // If users already placed assets in ./uploads, surface them in fallback content automatically.
  try {
    const uploadEntries = await fs.readdir(uploadsDir, { withFileTypes: true });
    const filesWithTime = await Promise.all(
      uploadEntries
        .filter(entry => entry.isFile())
        .map(async (entry) => {
          const fullPath = path.join(uploadsDir, entry.name);
          const stat = await fs.stat(fullPath);
          return { name: entry.name, modifiedAt: stat.mtimeMs };
        }),
    );
    filesWithTime.sort((a, b) => b.modifiedAt - a.modifiedAt);

    const orderedFiles = filesWithTime.map(file => file.name);
    const orderedImageFiles = orderedFiles.filter(name => imageExtRegex.test(name));
    const orderedVideoFiles = orderedFiles.filter(name => videoExtRegex.test(name));

    if (orderedImageFiles.length > 0) {
      fallbackCarousel.splice(
        0,
        fallbackCarousel.length,
        ...orderedImageFiles.slice(0, 10).map((fileName, idx) => ({
          _id: `c${idx + 1}`,
          imageUrl: uploadUrl(fileName),
          title: `Bootcamp Highlight ${idx + 1}`,
          description: "Captured moments from ATLASIA sessions.",
        })),
      );

      fallbackSiteContent = {
        ...fallbackSiteContent,
        aboutPage: {
          sectionImages: Array.from({ length: 5 }, (_, idx) => (
            orderedImageFiles[idx] ? uploadUrl(orderedImageFiles[idx]) : ""
          )),
        },
        studentsPage: {
          experienceImageUrl: uploadUrl(orderedImageFiles[0]),
        },
      };
    }

    const orderedMediaFiles = [...orderedVideoFiles, ...orderedImageFiles];
    if (orderedMediaFiles.length > 0) {
      fallbackBootcampMedia.splice(
        0,
        fallbackBootcampMedia.length,
        ...orderedMediaFiles.slice(0, 10).map((fileName, idx) => ({
          _id: `bm${idx + 1}`,
          mediaUrl: uploadUrl(fileName),
          mediaType: (videoExtRegex.test(fileName) ? "video" : "image") as "video" | "image",
          title: `Bootcamp Media ${idx + 1}`,
          description: "Auto-loaded from uploads folder.",
          order: idx + 1,
        })),
      );
    }
  } catch (err) {
    console.warn("Unable to auto-load uploads folder fallbacks:", (err as Error).message);
  }

  app.use(cors());
  app.use(express.json({ limit: "40mb" }));
  app.use("/uploads", express.static(uploadsDir));

  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!adminPassword) return res.status(503).json({ error: "ADMIN_PASSWORD is not configured" });
    const key = req.header("x-admin-key");
    if (!key || key !== adminPassword) return res.status(401).json({ error: "Unauthorized" });
    return next();
  };

  app.get("/api/admin/verify", requireAdmin, (req, res) => {
    res.json({ ok: true });
  });
  app.get("/api/admin/status", requireAdmin, (req, res) => {
    res.json({ dbConnected: mongoose.connection.readyState === 1 });
  });

  app.use("/api", (req, res, next) => {
    if (req.method === "GET") return next();
    return requireAdmin(req, res, next);
  });

  // MongoDB Connection
  const mongoUri = process.env.MONGO_URI;
  if (mongoUri && mongoUri !== "mongodb+srv://...") {
    mongoose.connect(mongoUri)
      .then(() => console.log("Connected to MongoDB"))
      .catch(err => console.error("MongoDB connection error:", err));
  } else {
    console.warn("MONGO_URI not found or invalid. Running with in-memory fallbacks.");
  }

  // API Routes

  // Hero
  app.get("/api/hero", async (req, res) => {
    try {
      if (!isDbConnected()) return res.json(fallbackHero);
      let data = await (Hero as any).findOne();
      if (!data) data = await (Hero as any).create(fallbackHero);
      res.json(data);
    } catch (err) { res.json(fallbackHero); }
  });

  app.put("/api/hero", async (req, res) => {
    try {
      if (!isDbConnected()) {
        Object.assign(fallbackHero, req.body);
        return res.json(fallbackHero);
      }
      const hero = await (Hero as any).findOneAndUpdate({}, req.body, { new: true, upsert: true });
      res.json(hero);
    } catch (err) { res.status(500).json({ error: (err as Error).message }); }
  });

  // About
  app.get("/api/about", async (req, res) => {
    try {
      if (!isDbConnected()) return res.json(fallbackAbout);
      let data = await (About as any).findOne();
      if (!data) data = await (About as any).create(fallbackAbout);
      res.json(data);
    } catch (err) { res.json(fallbackAbout); }
  });

  app.put("/api/about", async (req, res) => {
    try {
      if (!isDbConnected()) {
        Object.assign(fallbackAbout, req.body);
        return res.json(fallbackAbout);
      }
      const about = await (About as any).findOneAndUpdate({}, req.body, { new: true, upsert: true });
      res.json(about);
    } catch (err) { res.status(500).json({ error: (err as Error).message }); }
  });

  // Phases
  app.get("/api/phases", async (req, res) => {
    try {
      if (!isDbConnected()) return res.json(fallbackPhases);
      const phases = await (Phase as any).find().sort({ order: 1 });
      if (phases.length === 0) {
        await (Phase as any).insertMany(fallbackPhases);
        return res.json(fallbackPhases);
      }
      res.json(phases);
    } catch (err) { res.json(fallbackPhases); }
  });

  app.post("/api/phases", async (req, res) => {
    try {
      if (!isDbConnected()) {
        const item = { _id: nextId("ph"), ...req.body };
        fallbackPhases.push(item);
        return res.json(item);
      }
      const phase = await (Phase as any).create(req.body);
      res.json(phase);
    } catch (err) { res.status(500).json({ error: (err as Error).message }); }
  });

  app.put("/api/phases/:id", async (req, res) => {
    try {
      if (!isDbConnected()) {
        const idx = fallbackPhases.findIndex(x => x._id === req.params.id);
        if (idx === -1) return res.status(404).json({ error: "Not found" });
        fallbackPhases[idx] = { ...fallbackPhases[idx], ...req.body };
        return res.json(fallbackPhases[idx]);
      }
      const phase = await (Phase as any).findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(phase);
    } catch (err) { res.status(500).json({ error: (err as Error).message }); }
  });

  app.delete("/api/phases/:id", async (req, res) => {
    try {
      if (!isDbConnected()) {
        const idx = fallbackPhases.findIndex(x => x._id === req.params.id);
        if (idx >= 0) fallbackPhases.splice(idx, 1);
        return res.json({ message: "Deleted" });
      }
      await (Phase as any).findByIdAndDelete(req.params.id);
      res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: (err as Error).message }); }
  });

  // Roles
  app.get("/api/roles", async (req, res) => {
    try {
      if (!isDbConnected()) return res.json(fallbackRoles);
      const roles = await (Role as any).find().sort({ order: 1 });
      if (roles.length === 0) {
        await (Role as any).insertMany(fallbackRoles);
        return res.json(fallbackRoles);
      }
      res.json(roles);
    } catch (err) { res.json(fallbackRoles); }
  });

  app.post("/api/roles", async (req, res) => {
    try {
      if (!isDbConnected()) {
        const item = { _id: nextId("r"), ...req.body };
        fallbackRoles.push(item);
        return res.json(item);
      }
      const role = await (Role as any).create(req.body);
      res.json(role);
    } catch (err) { res.status(500).json({ error: (err as Error).message }); }
  });

  app.put("/api/roles/:id", async (req, res) => {
    try {
      if (!isDbConnected()) {
        const idx = fallbackRoles.findIndex(x => x._id === req.params.id);
        if (idx === -1) return res.status(404).json({ error: "Not found" });
        fallbackRoles[idx] = { ...fallbackRoles[idx], ...req.body };
        return res.json(fallbackRoles[idx]);
      }
      const role = await (Role as any).findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(role);
    } catch (err) { res.status(500).json({ error: (err as Error).message }); }
  });

  app.delete("/api/roles/:id", async (req, res) => {
    try {
      if (!isDbConnected()) {
        const idx = fallbackRoles.findIndex(x => x._id === req.params.id);
        if (idx >= 0) fallbackRoles.splice(idx, 1);
        return res.json({ message: "Deleted" });
      }
      await (Role as any).findByIdAndDelete(req.params.id);
      res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: (err as Error).message }); }
  });

  // Highlights
  app.get("/api/highlights", async (req, res) => {
    try {
      if (!isDbConnected()) return res.json(fallbackHighlights);
      const highlights = await (Highlight as any).find().sort({ order: 1 });
      if (highlights.length === 0) {
        await (Highlight as any).insertMany(fallbackHighlights);
        return res.json(fallbackHighlights);
      }
      res.json(highlights);
    } catch (err) { res.json(fallbackHighlights); }
  });

  app.post("/api/highlights", async (req, res) => {
    try {
      if (!isDbConnected()) {
        const item = { _id: nextId("h"), ...req.body };
        fallbackHighlights.push(item);
        return res.json(item);
      }
      const highlight = await (Highlight as any).create(req.body);
      res.json(highlight);
    } catch (err) { res.status(500).json({ error: (err as Error).message }); }
  });

  app.put("/api/highlights/:id", async (req, res) => {
    try {
      if (!isDbConnected()) {
        const idx = fallbackHighlights.findIndex(x => x._id === req.params.id);
        if (idx === -1) return res.status(404).json({ error: "Not found" });
        fallbackHighlights[idx] = { ...fallbackHighlights[idx], ...req.body };
        return res.json(fallbackHighlights[idx]);
      }
      const highlight = await (Highlight as any).findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(highlight);
    } catch (err) { res.status(500).json({ error: (err as Error).message }); }
  });

  app.delete("/api/highlights/:id", async (req, res) => {
    try {
      if (!isDbConnected()) {
        const idx = fallbackHighlights.findIndex(x => x._id === req.params.id);
        if (idx >= 0) fallbackHighlights.splice(idx, 1);
        return res.json({ message: "Deleted" });
      }
      await (Highlight as any).findByIdAndDelete(req.params.id);
      res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: (err as Error).message }); }
  });

  // CTA
  app.get("/api/cta", async (req, res) => {
    try {
      if (!isDbConnected()) return res.json(fallbackCta);
      let data = await (CTA as any).findOne();
      if (!data) data = await (CTA as any).create(fallbackCta);
      res.json(data);
    } catch (err) { res.json(fallbackCta); }
  });

  app.put("/api/cta", async (req, res) => {
    try {
      if (!isDbConnected()) {
        Object.assign(fallbackCta, req.body);
        return res.json(fallbackCta);
      }
      const cta = await (CTA as any).findOneAndUpdate({}, req.body, { new: true, upsert: true });
      res.json(cta);
    } catch (err) { res.status(500).json({ error: (err as Error).message }); }
  });

  // Carousel
  app.get("/api/carousel", async (req, res) => {
    try {
      if (!isDbConnected()) return res.json(fallbackCarousel);
      const carousel = await (Carousel as any).find().sort({ createdAt: -1 });
      if (carousel.length === 0) {
        await (Carousel as any).insertMany(fallbackCarousel);
        return res.json(fallbackCarousel);
      }
      res.json(carousel);
    } catch (err) { res.json(fallbackCarousel); }
  });

  app.post("/api/carousel", async (req, res) => {
    try {
      if (!isDbConnected()) {
        const item = { _id: nextId("c"), ...req.body };
        fallbackCarousel.unshift(item);
        return res.json(item);
      }
      const item = await (Carousel as any).create(req.body);
      res.json(item);
    } catch (err) { res.status(500).json({ error: (err as Error).message }); }
  });

  app.delete("/api/carousel/:id", async (req, res) => {
    try {
      if (!isDbConnected()) {
        const idx = fallbackCarousel.findIndex(x => x._id === req.params.id);
        if (idx >= 0) fallbackCarousel.splice(idx, 1);
        return res.json({ message: "Deleted" });
      }
      await (Carousel as any).findByIdAndDelete(req.params.id);
      res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: (err as Error).message }); }
  });

  // Testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      if (!isDbConnected()) return res.json(fallbackTestimonials);
      const testimonials = await (Testimonial as any).find().sort({ order: 1, createdAt: -1 });
      if (testimonials.length === 0) {
        await (Testimonial as any).insertMany(fallbackTestimonials.map(({ _id, ...item }) => item));
        return res.json(fallbackTestimonials);
      }
      res.json(testimonials);
    } catch (err) { res.json(fallbackTestimonials); }
  });

  app.post("/api/testimonials", async (req, res) => {
    try {
      if (!isDbConnected()) {
        const item = { _id: nextId("t"), ...req.body };
        fallbackTestimonials.push(item);
        return res.json(item);
      }
      const item = await (Testimonial as any).create(req.body);
      res.json(item);
    } catch (err) { res.status(500).json({ error: (err as Error).message }); }
  });

  app.put("/api/testimonials/:id", async (req, res) => {
    try {
      if (!isDbConnected()) {
        const idx = fallbackTestimonials.findIndex(x => x._id === req.params.id);
        if (idx === -1) return res.status(404).json({ error: "Not found" });
        fallbackTestimonials[idx] = { ...fallbackTestimonials[idx], ...req.body };
        return res.json(fallbackTestimonials[idx]);
      }
      const item = await (Testimonial as any).findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(item);
    } catch (err) { res.status(500).json({ error: (err as Error).message }); }
  });

  app.delete("/api/testimonials/:id", async (req, res) => {
    try {
      if (!isDbConnected()) {
        const idx = fallbackTestimonials.findIndex(x => x._id === req.params.id);
        if (idx >= 0) fallbackTestimonials.splice(idx, 1);
        return res.json({ message: "Deleted" });
      }
      await (Testimonial as any).findByIdAndDelete(req.params.id);
      res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: (err as Error).message }); }
  });

  app.get("/api/bootcamp-media", async (req, res) => {
    try {
      if (!isDbConnected()) return res.json(fallbackBootcampMedia);
      const items = await (BootcampMedia as any).find().sort({ order: 1, createdAt: -1 });
      if (items.length === 0) {
        await (BootcampMedia as any).insertMany(fallbackBootcampMedia.map(({ _id, ...item }) => item));
        return res.json(fallbackBootcampMedia);
      }
      return res.json(items);
    } catch (err) {
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
        const idx = fallbackBootcampMedia.findIndex(x => x._id === req.params.id);
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
        const idx = fallbackBootcampMedia.findIndex(x => x._id === req.params.id);
        if (idx >= 0) fallbackBootcampMedia.splice(idx, 1);
        return res.json({ message: "Deleted" });
      }
      await (BootcampMedia as any).findByIdAndDelete(req.params.id);
      return res.json({ message: "Deleted" });
    } catch (err) {
      return res.status(500).json({ error: (err as Error).message });
    }
  });

  app.get("/api/site-content", async (req, res) => {
    try {
      if (!isDbConnected()) return res.json(fallbackSiteContent);
      const doc = await (SiteContent as any).findOne();
      const data = doc?.data || {};
      fallbackSiteContent = data;
      return res.json(data);
    } catch (err) {
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
      const { dataUrl, filename } = req.body ?? {};
      if (typeof dataUrl !== "string") return res.status(400).json({ error: "dataUrl is required" });

      const match = dataUrl.match(/^data:((?:image|video)\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
      if (!match) return res.status(400).json({ error: "Invalid image data URL" });

      const mime = match[1];
      const encoded = match[2];
      const extByMime: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/gif": "gif",
        "video/mp4": "mp4",
        "video/webm": "webm",
        "video/ogg": "ogv",
      };
      const ext = extByMime[mime];
      if (!ext) return res.status(400).json({ error: "Unsupported image type" });

      const buffer = Buffer.from(encoded, "base64");
      if (buffer.length > 30 * 1024 * 1024) return res.status(413).json({ error: "File exceeds 30MB" });

      const safeBase = typeof filename === "string" && filename.trim()
        ? path.basename(filename, path.extname(filename)).replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 40)
        : "image";
      const outName = `${Date.now()}-${randomUUID()}-${safeBase || "image"}.${ext}`;
      const outPath = path.join(uploadsDir, outName);

      await fs.writeFile(outPath, buffer);
      return res.json({ url: `/uploads/${outName}` });
    } catch (err) {
      return res.status(500).json({ error: (err as Error).message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

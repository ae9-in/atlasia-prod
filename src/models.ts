import mongoose from 'mongoose';

const HeroSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  tagline: { type: String, required: true },
  primaryButtonText: { type: String, required: true },
  primaryButtonLink: { type: String, required: true },
  secondaryButtonText: { type: String, required: true },
  secondaryButtonLink: { type: String, required: true },
}, { timestamps: true });

export const Hero = mongoose.models.Hero || mongoose.model('Hero', HeroSchema);

const AboutSchema = new mongoose.Schema({
  whoWeAre: { type: String, required: true },
  whyAtlasia: { type: String, required: true },
  approach: { type: String, required: true },
  vision: { type: String, required: true },
  mission: { type: String, required: true },
}, { timestamps: true });

export const About = mongoose.models.About || mongoose.model('About', AboutSchema);

const PhaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const Phase = mongoose.models.Phase || mongoose.model('Phase', PhaseSchema);

const RoleSchema = new mongoose.Schema({
  roleName: { type: String, required: true },
  description: { type: String, required: true },
  responsibilities: [{ type: String }],
  registerLink: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const Role = mongoose.models.Role || mongoose.model('Role', RoleSchema);

const HighlightSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const Highlight = mongoose.models.Highlight || mongoose.model('Highlight', HighlightSchema);

const CTASchema = new mongoose.Schema({
  heading: { type: String, required: true },
  buttonText: { type: String, required: true },
  buttonLink: { type: String, required: true },
}, { timestamps: true });

export const CTA = mongoose.models.CTA || mongoose.model('CTA', CTASchema);

const CarouselSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String },
  description: { type: String },
}, { timestamps: true });

export const Carousel = mongoose.models.Carousel || mongoose.model('Carousel', CarouselSchema);

const TestimonialSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  quote: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);

const BootcampMediaSchema = new mongoose.Schema({
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ['image', 'video'], required: true },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const BootcampMedia = mongoose.models.BootcampMedia || mongoose.model('BootcampMedia', BootcampMediaSchema);

const SiteContentSchema = new mongoose.Schema({
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export const SiteContent = mongoose.models.SiteContent || mongoose.model('SiteContent', SiteContentSchema);

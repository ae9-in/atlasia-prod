import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export default api;

export interface HeroData {
  title: string;
  subtitle: string;
  tagline: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}

export interface AboutData {
  whoWeAre: string;
  whyAtlasia: string;
  approach: string;
  vision: string;
  mission: string;
}

export interface PhaseData {
  _id?: string;
  title: string;
  duration: string;
  description: string;
  order: number;
}

export interface RoleData {
  _id?: string;
  roleName: string;
  description: string;
  responsibilities: string[];
  registerLink: string;
  order: number;
}

export interface HighlightData {
  _id?: string;
  title: string;
  description: string;
  order: number;
}

export interface CTAData {
  heading: string;
  buttonText: string;
  buttonLink: string;
}

export interface CarouselData {
  _id?: string;
  imageUrl: string;
  title: string;
  description: string;
}

export interface TestimonialData {
  _id?: string;
  imageUrl: string;
  name: string;
  role: string;
  quote: string;
  order: number;
}

export interface BootcampMediaData {
  _id?: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  title: string;
  description: string;
  order: number;
}

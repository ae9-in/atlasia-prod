import axios from 'axios';

const configuredApiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || '';
const configuredApiFallbackUrl = (import.meta.env.VITE_API_FALLBACK_URL as string | undefined)?.trim() || 'https://atlansia.vercel.app/api';

function normalizeApiBaseUrl(raw: string): string {
  if (!raw) return '/api';
  const trimmed = raw.replace(/\/+$/, '');

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      const path = parsed.pathname.replace(/\/+$/, '');
      if (!path || path === '/') {
        parsed.pathname = '/api';
      } else if (!path.endsWith('/api')) {
        parsed.pathname = `${path}/api`;
      }
      return parsed.toString().replace(/\/+$/, '');
    } catch {
      // Fall through to generic handling.
    }
  }

  if (trimmed === '/api' || trimmed.endsWith('/api')) return trimmed;
  return `${trimmed}/api`;
}

const normalizedApiBaseUrl = normalizeApiBaseUrl(configuredApiBaseUrl);
const normalizedApiFallbackUrl = normalizeApiBaseUrl(configuredApiFallbackUrl);
const localhostApiFallback = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname)
  ? `http://${window.location.hostname}:3000/api`
  : '';

const api = axios.create({
  baseURL: normalizedApiBaseUrl,
});

const apiBaseCandidates = Array.from(new Set(
  [
    normalizedApiBaseUrl,
    '/api',
    localhostApiFallback,
    normalizedApiFallbackUrl,
  ].filter(Boolean),
));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error) || !error.config) throw error;

    const status = error.response?.status;
    const originalConfig = error.config as typeof error.config & { __apiRetryIndex?: number };
    const originalUrl = originalConfig.url || '';
    const isRetriableStatus = status === 404 || status === 405 || typeof status === 'undefined';
    const retryIndex = originalConfig.__apiRetryIndex || 0;
    const isRelativeUrl = typeof originalUrl === 'string' && originalUrl.startsWith('/');

    if (!isRetriableStatus || !isRelativeUrl) throw error;
    if (retryIndex >= apiBaseCandidates.length - 1) throw error;

    originalConfig.__apiRetryIndex = retryIndex + 1;
    originalConfig.baseURL = apiBaseCandidates[retryIndex + 1];
    originalConfig.url = originalUrl.startsWith('/api/') ? originalUrl.replace('/api', '') : originalUrl;
    return api.request(originalConfig);

    throw error;
  },
);

export default api;

const absoluteApiBase = normalizedApiBaseUrl;

export function resolveAssetUrl(url?: string | null): string {
  if (!url) return '';
  if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  if (!absoluteApiBase) return normalizedPath;

  try {
    const apiUrl = new URL(absoluteApiBase);
    const apiPath = apiUrl.pathname.replace(/\/+$/, '');
    if (apiPath.endsWith('/api')) {
      apiUrl.pathname = normalizedPath;
    } else {
      apiUrl.pathname = normalizedPath;
    }
    apiUrl.search = '';
    apiUrl.hash = '';
    return apiUrl.toString();
  } catch {
    return normalizedPath;
  }
}

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
